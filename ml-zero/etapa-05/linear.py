"""Etapa 05–06 — modelos lineares e o otimizador que os treina.

Uma etapa para dois capítulos, porque são o mesmo objeto visto de dois ângulos:
o capítulo II.2 pergunta *que função o modelo representa*; o 06, *como se chega
aos coeficientes*. Separá-los em duas etapas duplicaria o código sem separar
nada.

O que está aqui, em biblioteca padrão:

  - `RegressaoLinear`   — com solução fechada (equações normais) E gradiente,
                          para o leitor ver que chegam ao mesmo lugar;
  - `RegressaoLogistica`— classificação, com regularização L1 e L2;
  - `descida_de_gradiente` — o otimizador, com histórico de perda: é o histórico
                          que torna diagnosticável o que dá errado no treino.

**Sobre NumPy.** O plano original previa NumPy a partir desta etapa. Não entrou:
até aqui, biblioteca padrão bastou, e a regra 3 da construção manda dependência
mínima. Adicionar NumPy sem que o algoritmo exija é estrutura antecipada — o
que a regra 2 proíbe. Ele entra na etapa 09 (redes neurais), onde a álgebra
matricial deixa de ser conveniência e passa a ser necessidade.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field
from typing import Callable, Optional, Sequence

Matriz = Sequence[Sequence[float]]
Vetor = Sequence[float]


# ------------------------------------------------------------------ escala

class Padronizador:
    """(x − média) / desvio, aprendido SÓ no treino.

    Vive aqui, e não solto num script, para tornar impossível o vazamento do
    capítulo I.3: quem chama `fit` recebe um objeto que já sabe o que aplicar
    ao teste. O caminho errado exige esforço extra, que é como deve ser.
    """

    def __init__(self) -> None:
        self.media: list[float] = []
        self.desvio: list[float] = []

    def fit(self, X: Matriz) -> "Padronizador":
        if not X:
            raise ValueError("nada para padronizar")
        n, d = len(X), len(X[0])
        self.media = [sum(linha[j] for linha in X) / n for j in range(d)]
        self.desvio = []
        for j in range(d):
            var = sum((linha[j] - self.media[j]) ** 2 for linha in X) / n
            # desvio zero = coluna constante: dividir por 1 a deixa em zero,
            # que é o efeito correto (a coluna não carrega informação)
            self.desvio.append(math.sqrt(var) or 1.0)
        return self

    def transform(self, X: Matriz) -> list[list[float]]:
        if not self.media:
            raise RuntimeError("chame fit() antes de transform()")
        return [[(v - m) / s for v, m, s in zip(linha, self.media, self.desvio)]
                for linha in X]

    def fit_transform(self, X: Matriz) -> list[list[float]]:
        return self.fit(X).transform(X)


# ------------------------------------------------------------- otimizador

@dataclass
class Historico:
    """O que aconteceu durante o treino. É o instrumento de diagnóstico do
    capítulo II.4: divergiu, estagnou, ou convergiu?"""

    perdas: list[float] = field(default_factory=list)
    monitorado: list[float] = field(default_factory=list)
    epocas: int = 0
    parou_cedo: bool = False

    def divergiu(self) -> bool:
        """A perda explodiu em algum momento, ou terminou pior do que começou.

        Olhar só a última época não basta: com taxa alta a perda oscila, e ela
        pode terminar por acaso num vale. O sintoma de passo grande demais é a
        perda **ter passado** muito acima do ponto de partida em algum momento
        — e é isso que o diagnóstico precisa capturar.
        """
        if not self.perdas:
            return False
        if any(math.isnan(p) or math.isinf(p) for p in self.perdas):
            return True
        if len(self.perdas) < 3:
            return False
        return max(self.perdas) > self.perdas[0] * 1.5 or self.perdas[-1] > self.perdas[0]

    def estagnou(self, tol: float = 1e-4) -> bool:
        """Melhorou menos que `tol` no total — taxa pequena demais, ou já no ótimo."""
        if len(self.perdas) < 2:
            return False
        return (self.perdas[0] - self.perdas[-1]) < tol


def descida_de_gradiente(
    grad: Callable[[list[float], list[int]], tuple[list[float], float]],
    n_parametros: int,
    n_exemplos: int,
    taxa: float = 0.1,
    epocas: int = 200,
    lote: Optional[int] = None,
    paciencia: Optional[int] = None,
    min_delta: float = 1e-6,
    monitorar: Optional[Callable[[list[float]], float]] = None,
    seed: int = 0,
) -> tuple[list[float], Historico]:
    """O otimizador, isolado do modelo.

    `grad(parametros, indices)` devolve (gradiente, perda) sobre o subconjunto
    de exemplos indicado. Quem decide *o que* minimizar é o modelo; este código
    só sabe descer.

    - `lote=None` → gradiente em lote (todos os exemplos por passo);
    - `lote=k`    → mini-batch de tamanho k;
    - `lote=1`    → estocástico.

    `paciencia` liga o **early stopping**: pare quando a perda não melhorar por
    N épocas. É a regularização mais barata que existe — não custa nada e
    frequentemente é a que mais rende (cap. II.4).

    `min_delta` é o que torna o early stopping utilizável: sem ele, uma melhora
    de 4e-10 por época conta como progresso e o critério nunca dispara. O que
    interessa não é "a perda caiu", é "a perda caiu o bastante para valer outra
    época".

    `monitorar(parametros) -> float` é **o que se observa para decidir parar**.
    Sem ele, observa-se a perda de treino — e isso está errado no caso que mais
    importa: com dados separáveis, a perda de treino cai indefinidamente e o
    critério nunca dispara, por mais que a generalização já tenha parado de
    melhorar. Early stopping é um instrumento de **validação**; monitorar treino
    é medir o que o modelo decorou. A primeira versão desta função cometia esse
    erro, e ele só apareceu porque um teste o expôs.
    """
    if taxa <= 0:
        raise ValueError("a taxa de aprendizado precisa ser positiva")
    if epocas < 1:
        raise ValueError("precisa de ao menos 1 época")
    if lote is not None and lote < 1:
        raise ValueError("o lote precisa ter ao menos 1 exemplo")

    rng = random.Random(seed)
    p = [0.0] * n_parametros
    hist = Historico()
    melhor, sem_melhora = float("inf"), 0
    todos = list(range(n_exemplos))

    for e in range(epocas):
        if lote is None:
            g, perda = grad(p, todos)
            p = [pi - taxa * gi for pi, gi in zip(p, g)]
        else:
            ordem = todos[:]
            rng.shuffle(ordem)
            perda = 0.0
            n_lotes = 0
            for ini in range(0, n_exemplos, lote):
                idx = ordem[ini:ini + lote]
                g, l = grad(p, idx)
                p = [pi - taxa * gi for pi, gi in zip(p, g)]
                perda += l
                n_lotes += 1
            perda /= max(1, n_lotes)

        hist.perdas.append(perda)
        hist.epocas = e + 1

        if math.isnan(perda) or math.isinf(perda):
            break  # divergiu: continuar é queimar CPU

        if paciencia is not None:
            observado = monitorar(p) if monitorar else perda
            hist.monitorado.append(observado)
            perda = observado if monitorar else perda
            if perda < melhor - min_delta:
                melhor, sem_melhora = perda, 0
            else:
                sem_melhora += 1
                if sem_melhora >= paciencia:
                    hist.parou_cedo = True
                    break

    return p, hist


# ----------------------------------------------------------------- modelos

class RegressaoLinear:
    """y ≈ w·x + b, minimizando erro quadrático.

    Oferece os dois caminhos de propósito: `solucao_fechada=True` resolve as
    equações normais por eliminação de Gauss; `False` usa gradiente. Chegam ao
    mesmo lugar — e ver isso é o que desmistifica o gradiente, que passa a ser
    "um jeito de resolver" em vez de "o jeito".

    A solução fechada existe aqui e **não existe** para a logística. Essa
    assimetria é o motivo de o gradiente ser a ferramenta geral.
    """

    def __init__(self, solucao_fechada: bool = True, taxa: float = 0.1,
                 epocas: int = 500, l2: float = 0.0, padronizar: bool = True) -> None:
        if l2 < 0:
            raise ValueError("a penalidade L2 não pode ser negativa")
        self.solucao_fechada = solucao_fechada
        self.taxa = taxa
        self.epocas = epocas
        self.l2 = l2
        self.padronizar = padronizar
        self.pesos: list[float] = []
        self.vies = 0.0
        self.historico = Historico()

    def fit(self, X: Matriz, y: Vetor) -> "RegressaoLinear":
        if not y:
            raise ValueError("não dá para aprender com zero exemplos")
        if len(X) != len(y):
            raise ValueError("X e y têm tamanhos diferentes")
        self._esc = Padronizador().fit(X) if self.padronizar else None
        Z = self._esc.transform(X) if self._esc else [list(l) for l in X]
        n, d = len(Z), len(Z[0])

        if self.solucao_fechada:
            self.pesos, self.vies = _equacoes_normais(Z, list(y), self.l2)
            return self

        def grad(p: list[float], idx: list[int]) -> tuple[list[float], float]:
            w, b = p[:d], p[d]
            g = [0.0] * (d + 1)
            perda = 0.0
            for i in idx:
                erro = sum(wj * Z[i][j] for j, wj in enumerate(w)) + b - y[i]
                for j in range(d):
                    g[j] += erro * Z[i][j]
                g[d] += erro
                perda += erro * erro
            m = len(idx)
            g = [gi / m for gi in g]
            for j in range(d):
                g[j] += self.l2 * w[j]                      # o gradiente da penalidade
            perda = perda / (2 * m) + self.l2 / 2 * sum(wj * wj for wj in w)
            return g, perda

        p, self.historico = descida_de_gradiente(grad, d + 1, n, self.taxa, self.epocas)
        self.pesos, self.vies = p[:d], p[d]
        return self

    def predict(self, X: Matriz) -> list[float]:
        if not self.pesos:
            raise RuntimeError("chame fit() antes de predizer")
        Z = self._esc.transform(X) if self._esc else X
        return [sum(w * v for w, v in zip(self.pesos, linha)) + self.vies for linha in Z]


def _equacoes_normais(Z: Matriz, y: list[float], l2: float) -> tuple[list[float], float]:
    """(XᵀX + λI)w = Xᵀy, resolvido por eliminação de Gauss com pivotamento.

    Sem NumPy de propósito: são 25 linhas, e escrevê-las uma vez mostra que
    "resolver o sistema" não é magia — é a mesma eliminação do ensino médio.
    """
    n, d = len(Z), len(Z[0])
    X = [list(linha) + [1.0] for linha in Z]                # coluna do viés
    k = d + 1
    A = [[sum(X[i][a] * X[i][b] for i in range(n)) for b in range(k)] for a in range(k)]
    c = [sum(X[i][a] * y[i] for i in range(n)) for a in range(k)]
    for a in range(d):                                       # não regulariza o viés
        A[a][a] += l2 * n

    for col in range(k):
        piv = max(range(col, k), key=lambda r: abs(A[r][col]))
        if abs(A[piv][col]) < 1e-12:
            continue                                        # coluna degenerada
        A[col], A[piv] = A[piv], A[col]
        c[col], c[piv] = c[piv], c[col]
        for r in range(k):
            if r == col:
                continue
            f = A[r][col] / A[col][col]
            for cc in range(col, k):
                A[r][cc] -= f * A[col][cc]
            c[r] -= f * c[col]

    sol = [c[a] / A[a][a] if abs(A[a][a]) > 1e-12 else 0.0 for a in range(k)]
    return sol[:d], sol[d]


class RegressaoLogistica:
    """Classificação binária: p = σ(w·x + b).

    Apesar do nome, é um classificador. O que ela regride é o **logito** —
    o logaritmo da razão de chances —, e é aí que a relação volta a ser linear.

    Regularização L1 e L2 disponíveis. A diferença entre as duas é o assunto
    do capítulo II.4 e está visível no que cada uma faz aos coeficientes:
    L2 encolhe todos, L1 zera alguns.
    """

    def __init__(self, taxa: float = 0.5, epocas: int = 400, l2: float = 0.0,
                 l1: float = 0.0, lote: Optional[int] = None,
                 paciencia: Optional[int] = None, min_delta: float = 1e-6,
                 validacao: Optional[tuple] = None,
                 padronizar: bool = True, seed: int = 0) -> None:
        if l1 < 0 or l2 < 0:
            raise ValueError("penalidades não podem ser negativas")
        self.taxa, self.epocas = taxa, epocas
        self.l1, self.l2 = l1, l2
        self.lote, self.paciencia, self.min_delta = lote, paciencia, min_delta
        self.validacao = validacao
        self.padronizar, self.seed = padronizar, seed
        self.pesos: list[float] = []
        self.vies = 0.0
        self.historico = Historico()

    def fit(self, X: Matriz, y: Vetor) -> "RegressaoLogistica":
        if not y:
            raise ValueError("não dá para aprender com zero exemplos")
        if len(X) != len(y):
            raise ValueError("X e y têm tamanhos diferentes")
        if set(map(float, y)) - {0.0, 1.0}:
            raise ValueError("a logística espera alvo binário (0/1)")

        self._esc = Padronizador().fit(X) if self.padronizar else None
        Z = self._esc.transform(X) if self._esc else [list(l) for l in X]
        n, d = len(Z), len(Z[0])

        def grad(p: list[float], idx: list[int]) -> tuple[list[float], float]:
            w, b = p[:d], p[d]
            g = [0.0] * (d + 1)
            perda = 0.0
            for i in idx:
                z = sum(wj * Z[i][j] for j, wj in enumerate(w)) + b
                prob = sigmoide(z)
                g[d] += prob - y[i]
                for j in range(d):
                    g[j] += (prob - y[i]) * Z[i][j]
                perda += -(y[i] * math.log(max(prob, 1e-12))
                           + (1 - y[i]) * math.log(max(1 - prob, 1e-12)))
            m = len(idx)
            g = [gi / m for gi in g]
            perda /= m
            for j in range(d):
                g[j] += self.l2 * w[j]
                # L1 não é diferenciável em zero; usa-se o subgradiente sign(w).
                # É a razão de L1 zerar coeficientes: o empurrão para o zero tem
                # magnitude constante, não proporcional ao peso.
                g[j] += self.l1 * (1.0 if w[j] > 0 else (-1.0 if w[j] < 0 else 0.0))
                perda += self.l2 / 2 * w[j] * w[j] + self.l1 * abs(w[j])
            return g, perda

        monitor = None
        if self.validacao is not None:
            Xv, yv = self.validacao
            Zv = self._esc.transform(Xv) if self._esc else [list(l) for l in Xv]

            def monitor(p: list[float]) -> float:
                """Perda logística na VALIDAÇÃO — o que de fato interessa parar de
                melhorar. Monitorar treino faria o critério perseguir memória."""
                w, b = p[:d], p[d]
                total = 0.0
                for linha, alvo in zip(Zv, yv):
                    prob = sigmoide(sum(wj * v for wj, v in zip(w, linha)) + b)
                    total += -(alvo * math.log(max(prob, 1e-12))
                               + (1 - alvo) * math.log(max(1 - prob, 1e-12)))
                return total / len(yv)

        p, self.historico = descida_de_gradiente(
            grad, d + 1, n, self.taxa, self.epocas, self.lote, self.paciencia,
            self.min_delta, monitor, self.seed)
        self.pesos, self.vies = p[:d], p[d]
        # limpeza numérica: o subgradiente de L1 deixa resíduos ínfimos em vez
        # de zeros exatos. Sem isto, "L1 zera coeficientes" seria uma meia-verdade.
        if self.l1 > 0:
            corte = self.taxa * self.l1
            self.pesos = [0.0 if abs(w) < corte else w for w in self.pesos]
        return self

    def predict_proba(self, X: Matriz) -> list[float]:
        if not self.pesos:
            raise RuntimeError("chame fit() antes de predizer")
        Z = self._esc.transform(X) if self._esc else X
        return [sigmoide(sum(w * v for w, v in zip(self.pesos, linha)) + self.vies)
                for linha in Z]

    def predict(self, X: Matriz, limiar: float = 0.5) -> list[int]:
        return [1 if p > limiar else 0 for p in self.predict_proba(X)]

    def coeficientes_nao_nulos(self) -> int:
        return sum(1 for w in self.pesos if w != 0.0)

    def razao_de_chances(self) -> list[float]:
        """exp(w): quanto a chance é multiplicada por 1 desvio-padrão do atributo.

        É a leitura honesta de um coeficiente logístico. Dizer "aumenta a
        probabilidade em w" é errado — a relação linear está no logito, não na
        probabilidade (cap. II.2).
        """
        return [math.exp(w) for w in self.pesos]


def sigmoide(z: float) -> float:
    if z >= 0:
        return 1 / (1 + math.exp(-min(z, 60)))
    e = math.exp(max(z, -60))
    return e / (1 + e)
