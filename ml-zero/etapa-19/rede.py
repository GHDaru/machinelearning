"""Etapa 19 (parte 1) — a rede densa em NumPy, do passo para frente ao update.

Esta é a parte da etapa que paga o objetivo **O3** do capítulo III.2:
*implementar uma rede densa em NumPy, do forward ao update*. O `mlp.py` ao lado
CHAMA uma rede pronta; aqui ela é escrita.

    python ml-zero/etapa-19/rede.py

A ORDEM IMPORTA, E ELA FOI QUEBRADA UMA VEZ

A Restrição 1 da construção manda escrever o método antes de chamar a
biblioteca. Em agosto de 2026 o `mlp.py` entrou primeiro, por decisão de quem dá
a aula, para a turma poder rodar já — e a dívida ficou declarada no capítulo em
vez de escondida. Este arquivo é o pagamento dela.

O QUE ESTE ARQUIVO PROVA, E POR QUE ISSO É O ASSUNTO

Escrever retropropagação é fácil; escrever retropropagação CERTA é outra coisa.
Um sinal trocado, um `v_j` esquecido, um viés somado por unidade de origem em
vez de destino — nada disso lança exceção. A rede treina, a perda desce um
pouco, e o modelo aprende menos do que deveria. É o "bug que não grita" que o
próprio capítulo discute.

Por isso o arquivo traz `conferir_gradiente()`, que compara o gradiente
analítico com a **diferença finita** da perda:

    (E(w + h) - E(w - h)) / 2h

Se a sua conta estiver errada, os dois números discordam na terceira casa e você
descobre em um segundo, e não em três dias de treino. É o teste que separa "não
deu erro" de "está correto".

A PONTE COM O CAPÍTULO

`reproduzir_o_capitulo()` refaz, com este código, o passo publicado na seção
"Um passo inteiro, com números": mesmos nove pesos, mesmo caso, mesma taxa.
Os vinte e um números batem. Se algum dia deixarem de bater, o teste
`tests/test_etapa_19.py` cai — o capítulo e o código não podem divergir em
silêncio.

CONVENÇÕES, ditas uma vez

  - `W[k]` tem forma (entradas, saidas). É a matriz `e × s` que o capítulo manda
    contar, e `b[k]` tem uma posição por unidade de DESTINO — nunca de origem.
  - A perda é o EQM, a mesma do capítulo II.2 e do capítulo III.2.
  - Sigmoide nas duas camadas, para bater com a conta à mão. `tanh` fica
    disponível porque é o que o `mlp.py` usa.
"""
from __future__ import annotations

import numpy as np

ATIVACOES = {
    # (função, derivada escrita na própria ativação — é isso que torna a conta
    #  à mão viável, e o capítulo diz isso com todas as letras)
    "sigmoide": (lambda z: 1.0 / (1.0 + np.exp(-z)), lambda a: a * (1.0 - a)),
    "tanh":     (np.tanh,                            lambda a: 1.0 - a * a),
    # `igual` é a identidade: nenhuma não-linearidade. Usa-se na SAÍDA de uma
    # regressão, onde o alvo não está preso a um intervalo.
    "igual":    (lambda z: z,                        lambda a: np.ones_like(a)),
}


class Rede:
    """Rede densa de camadas totalmente conectadas.

    `tamanhos` é a lista de larguras, da entrada à saída: [2, 2, 1] é a rede do
    capítulo. Os pesos entram pelo construtor quando se quer reproduzir uma conta
    publicada, e são sorteados quando se quer treinar.
    """

    def __init__(self, tamanhos, ativacao="sigmoide", saida=None, semente=0, pesos=None):
        self.tamanhos = list(tamanhos)
        self.f, self.df = ATIVACOES[ativacao]
        # A ativação da SAÍDA é uma escolha à parte, e esquecer isso custou uma
        # medição: com `tanh` na saída, esta mesma rede deu MAE 1,1610 no
        # California Housing, pior que prever sempre a mediana (0,8982). Nada
        # lançou exceção. O alvo vai de 0,15 a 5, e tanh não passa de 1: a rede
        # estava impedida de acertar por construção. Regressão pede saída
        # `igual`, e é o que o MLPRegressor do sklearn faz por padrão.
        self.g, self.dg = ATIVACOES[saida or ativacao]
        if pesos is not None:
            self.W = [np.array(w, dtype=float) for w in pesos[0]]
            self.b = [np.array(v, dtype=float) for v in pesos[1]]
        else:
            r = np.random.default_rng(semente)
            # Xavier: a escala da inicialização é assunto do capítulo III.3, e
            # sortear em vez de zerar é o que quebra a simetria entre unidades.
            self.W = [r.normal(0, np.sqrt(1.0 / e), (e, s))
                      for e, s in zip(self.tamanhos, self.tamanhos[1:])]
            self.b = [np.zeros(s) for s in self.tamanhos[1:]]
        for k, (e, s) in enumerate(zip(self.tamanhos, self.tamanhos[1:])):
            assert self.W[k].shape == (e, s), f"W[{k}] devia ser ({e}, {s})"
            assert self.b[k].shape == (s,), f"b[{k}] devia ter {s} posições (uma por DESTINO)"

    @property
    def parametros(self):
        return sum(w.size for w in self.W) + sum(v.size for v in self.b)

    def frente(self, X):
        """Devolve as ativações de todas as camadas. Guardá-las é o preço do
        reaproveitamento: são elas que as derivadas do passo para trás consomem,
        e é por isso que a memória cresce com a profundidade."""
        a = [np.atleast_2d(np.asarray(X, dtype=float))]
        ultimo = len(self.W) - 1
        for k in range(len(self.W)):
            z = a[-1] @ self.W[k] + self.b[k]
            a.append((self.g if k == ultimo else self.f)(z))
        return a

    def prever(self, X):
        return self.frente(X)[-1]

    def perda(self, X, y):
        p = self.prever(X)[:, 0]
        d = p - np.asarray(y, dtype=float)
        return float(np.mean(d * d))

    def gradiente(self, X, y):
        """Retropropagação. Devolve (gW, gb) com a mesma forma de (W, b).

        O delta da camada k sai do delta da camada k+1 por UMA multiplicação de
        matriz mais uma pela derivada da ativação. É o reaproveitamento: cada
        derivada parcial é computada uma vez e reusada por tudo o que está atrás.
        """
        a = self.frente(X)
        y = np.asarray(y, dtype=float).reshape(-1, 1)
        n = a[0].shape[0]
        # dE/da na saída, com E = média dos quadrados
        d = (2.0 / n) * (a[-1] - y) * self.dg(a[-1])
        gW = [None] * len(self.W)
        gb = [None] * len(self.b)
        for k in range(len(self.W) - 1, -1, -1):
            gW[k] = a[k].T @ d
            gb[k] = d.sum(axis=0)          # um viés por unidade de DESTINO
            if k > 0:
                d = (d @ self.W[k].T) * self.df(a[k])
        return gW, gb

    def passo(self, X, y, taxa):
        """Um passo de gradiente descendente. Devolve a perda ANTES do passo."""
        antes = self.perda(X, y)
        gW, gb = self.gradiente(X, y)
        for k in range(len(self.W)):
            self.W[k] -= taxa * gW[k]
            self.b[k] -= taxa * gb[k]
        return antes

    def treinar(self, X, y, taxa=0.5, epocas=1000, parar_em=None):
        """Lote cheio. Devolve o histórico de perdas, uma por época."""
        hist = []
        for _ in range(epocas):
            hist.append(self.passo(X, y, taxa))
            if parar_em is not None and hist[-1] <= parar_em:
                break
        return hist


def conferir_gradiente(rede, X, y, h=1e-6):
    """Compara o gradiente analítico com a diferença finita da perda.

    É O TESTE QUE SEPARA "não deu erro" DE "está correto". Um sinal trocado ou um
    fator esquecido não lança exceção nenhuma: ele treina mal, devagar, e você
    culpa a taxa de aprendizado. Aqui ele aparece na terceira casa decimal.

    Devolve o maior erro relativo entre os dois gradientes.
    """
    gW, gb = rede.gradiente(X, y)
    pior = 0.0
    for lista, grads in ((rede.W, gW), (rede.b, gb)):
        for k, P in enumerate(lista):
            it = np.nditer(P, flags=["multi_index"])
            while not it.finished:
                i = it.multi_index
                guardado = P[i]
                P[i] = guardado + h; mais = rede.perda(X, y)
                P[i] = guardado - h; menos = rede.perda(X, y)
                P[i] = guardado
                numerico = (mais - menos) / (2 * h)
                analitico = grads[k][i]
                escala = max(1e-12, abs(numerico) + abs(analitico))
                pior = max(pior, abs(numerico - analitico) / escala)
                it.iternext()
    return pior


# Os nove pesos publicados no capítulo III.2, seção "Um passo inteiro, com
# números". A ordem é (entradas, saídas): W0[i][j] é o peso de xᵢ para hⱼ.
CAPITULO_PESOS = ([[[0.5, 0.3], [-0.4, 0.8]], [[0.6], [-0.7]]],
                  [[0.1, -0.2], [0.2]])


def reproduzir_o_capitulo():
    """Refaz, com este código, o passo publicado no capítulo.

    Devolve tudo o que o texto imprime, para que o teste compare célula a célula.
    """
    r = Rede([2, 2, 1], "sigmoide", pesos=CAPITULO_PESOS)
    X, y = np.array([[1.0, 0.0]]), np.array([1.0])
    a = r.frente(X)
    antes = {"h": a[1][0].copy(), "y": float(a[2][0, 0]), "perda": r.perda(X, y)}
    gW, gb = r.gradiente(X, y)
    r.passo(X, y, taxa=0.5)
    return {
        "antes": antes,
        "gW": [g.copy() for g in gW], "gb": [g.copy() for g in gb],
        "W": [w.copy() for w in r.W], "b": [v.copy() for v in r.b],
        "depois": {"y": float(r.prever(X)[0, 0]), "perda": r.perda(X, y)},
        "parametros": r.parametros,
    }


def california(ocultas=64, taxa=0.03, epocas=300, lote=256, semente=0, saida_igual=True):
    """A MESMA rede escrita aqui, nos 20 640 bairros do `mlp.py` ao lado.

    Existe para fechar a ponte nos dois sentidos: o `mlp.py` mostra que a
    biblioteca chega a 0,3878, e esta função mostra que o método escrito à mão
    chega perto disso — em segundos, sem nada além de NumPy. Se ficasse muito
    longe, a conclusão honesta seria que a implementação tem defeito, e não que
    "biblioteca é melhor".

    Reusa `carregar()` do `mlp.py`: o recorte é o gravado em arquivo, o mesmo
    para os dois. Comparar dois modelos em recortes diferentes não compara nada.
    """
    import importlib.util
    from pathlib import Path
    alvo = Path(__file__).with_name("mlp.py")
    esp = importlib.util.spec_from_file_location("mlp_etapa19", alvo)
    mlp = importlib.util.module_from_spec(esp)
    esp.loader.exec_module(mlp)
    d = mlp.carregar()
    Xtr, ytr = d["treino"]
    Xte, yte = d["teste"]
    media, desvio = Xtr.mean(axis=0), Xtr.std(axis=0)
    Xtr, Xte = (Xtr - media) / desvio, (Xte - media) / desvio
    # Saída `igual`: o alvo vai de 0,15 a 5, e uma saída achatada em [-1, 1] não
    # tem como acertar. Com `tanh` na saída esta mesma rede dá MAE 1,1610.
    r = Rede([Xtr.shape[1], ocultas, 1], "tanh",
             "igual" if saida_igual else "tanh", semente=semente)
    sorteia = np.random.default_rng(semente)
    for _ in range(epocas):
        ordem = sorteia.permutation(len(Xtr))
        for i in range(0, len(ordem), lote):
            b = ordem[i:i + lote]
            r.passo(Xtr[b], ytr[b], taxa)
    erro = float(np.abs(r.prever(Xte)[:, 0] - yte).mean())
    return {"mae": erro, "parametros": r.parametros, "rede": r}


XOR_X = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
XOR_Y = np.array([0.0, 1.0, 1.0, 0.0])


if __name__ == "__main__":
    print("A rede densa em NumPy — o que o objetivo O3 do capítulo III.2 promete\n")

    c = reproduzir_o_capitulo()
    print("  1. O passo do capítulo, refeito por este código")
    print(f"     h₁ = {c['antes']['h'][0]:.4f}   h₂ = {c['antes']['h'][1]:.4f}"
          f"   ŷ = {c['antes']['y']:.4f}   E = {c['antes']['perda']:.4f}")
    print(f"     depois do passo:  ŷ = {c['depois']['y']:.4f}   E = {c['depois']['perda']:.4f}")
    print(f"     {c['parametros']} parâmetros — os mesmos nove da tabela publicada")
    print(f"     gradiente de w₂₁ e w₂₂: {c['gW'][0][1][0]:.4f} e {c['gW'][0][1][1]:.4f}"
          "   (zero: x₂ vale 0 neste caso)\n")

    print("  2. A conferência de gradiente — o que separa “não deu erro” de “está correto”")
    r = Rede([2, 3, 1], "sigmoide", semente=1)
    print(f"     maior erro relativo contra a diferença finita: {conferir_gradiente(r, XOR_X, XOR_Y):.2e}\n")

    print("  3. O XOR, com a rede escrita aqui")
    r = Rede([2, 2, 1], "sigmoide", semente=4)
    hist = r.treinar(XOR_X, XOR_Y, taxa=0.5, epocas=20000, parar_em=0.005)
    p = r.prever(XOR_X)[:, 0]
    acertos = int(((p >= 0.5) == (XOR_Y == 1)).sum())
    print(f"     {len(hist)} épocas · perda {r.perda(XOR_X, XOR_Y):.4f} · acerta {acertos} de 4")
    print("     previsões: " + "  ".join(f"{v:.2f}" for v in p) + "\n")

    print("  4. A mesma rede, escrita aqui, nos 20 640 bairros do mlp.py")
    c = california()
    print(f"     {c['parametros']} parâmetros · MAE no teste {c['mae']:.4f}")
    print("     a biblioteca, no mesmo recorte, dá 0,3878; a regressão linear, 0,5271")
