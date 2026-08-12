"""Etapa 18 — o neurônio de McCulloch–Pitts e o perceptron que aprende.

    python etapa-18/neuronio.py

Dois modelos separados por quinze anos de história, em ~120 linhas de
biblioteca padrão:

  - `NeuronioMP`  — McCulloch & Pitts (1943). **Não aprende**: os pesos são
                    postos à mão por quem projeta.
  - `Perceptron`  — Rosenblatt (1958). A peça que faltava: uma regra que
                    ajusta os pesos sozinha, olhando um erro por vez.

O ponto do arquivo é o contraste. Rode e veja o perceptron encontrar, em
poucas passadas, os pesos que você levou minutos para achar à mão no
laboratório do capítulo III.1 — e falhar para sempre no XOR, por mais épocas que
você dê a ele.

Sem NumPy: são listas de dois números. Colocar uma dependência aqui esconderia
o que se quer mostrar.
"""

from __future__ import annotations

import random
from typing import Callable, Sequence

ENTRADAS = [(0, 0), (0, 1), (1, 0), (1, 1)]

FUNCOES: dict[str, Callable[[int, int], int]] = {
    "AND":  lambda a, b: 1 if a and b else 0,
    "OR":   lambda a, b: 1 if a or b else 0,
    "NAND": lambda a, b: 0 if a and b else 1,
    "NOR":  lambda a, b: 0 if a or b else 1,
    "XOR":  lambda a, b: 1 if a != b else 0,   # o impossível
}


class NeuronioMP:
    """O neurônio de 1943: soma ponderada e comparação com um limiar.

    Não há `fit`. É deliberado — no modelo original **não existe aprendizado**,
    e a ausência do método é a forma mais honesta de dizer isso.
    """

    def __init__(self, pesos: Sequence[float], limiar: float) -> None:
        self.pesos = list(pesos)
        self.limiar = limiar

    def __call__(self, *entradas: float) -> int:
        if len(entradas) != len(self.pesos):
            raise ValueError(f"esperava {len(self.pesos)} entradas, recebi {len(entradas)}")
        soma = sum(w * x for w, x in zip(self.pesos, entradas))
        return 1 if soma >= self.limiar else 0

    def tabela_verdade(self, alvo: Callable[[int, int], int]) -> list[tuple]:
        """(x1, x2, esperado, obtido, acertou) — o que o laboratório mostra."""
        linhas = []
        for a, b in ENTRADAS:
            esperado, obtido = alvo(a, b), self(a, b)
            linhas.append((a, b, esperado, obtido, esperado == obtido))
        return linhas

    def acertos(self, alvo: Callable[[int, int], int]) -> int:
        return sum(1 for *_, ok in self.tabela_verdade(alvo) if ok)


class Perceptron:
    """Rosenblatt (1958): o mesmo neurônio, com uma regra de aprendizado.

    A regra cabe numa linha: mostre um exemplo; se errou, empurre os pesos na
    direção que teria acertado, proporcionalmente à entrada.

        w ← w + η · (esperado − obtido) · x

    Rosenblatt provou que, se o problema for linearmente separável, isso
    converge em número finito de passos. A prova é a razão do entusiasmo de
    1958 — e a palavra "separável" é a razão do desapontamento de 1969.
    """

    def __init__(self, n_entradas: int = 2, taxa: float = 0.1, seed: int = 0) -> None:
        rng = random.Random(seed)
        self.pesos = [rng.uniform(-0.5, 0.5) for _ in range(n_entradas)]
        self.limiar = rng.uniform(-0.5, 0.5)
        self.taxa = taxa
        self.historico: list[int] = []      # erros por época

    def __call__(self, *entradas: float) -> int:
        soma = sum(w * x for w, x in zip(self.pesos, entradas))
        return 1 if soma >= self.limiar else 0

    def treinar(self, alvo: Callable[[int, int], int], epocas: int = 50) -> "Perceptron":
        self.historico = []
        for _ in range(epocas):
            erros = 0
            for a, b in ENTRADAS:
                esperado = alvo(a, b)
                obtido = self(a, b)
                delta = esperado - obtido
                if delta:
                    erros += 1
                    self.pesos[0] += self.taxa * delta * a
                    self.pesos[1] += self.taxa * delta * b
                    # o limiar anda no sentido OPOSTO: subir o limiar dificulta
                    # o disparo, então errar por não disparar deve baixá-lo
                    self.limiar -= self.taxa * delta
            self.historico.append(erros)
            if erros == 0:
                break                        # convergiu: nada mais a corrigir
        return self

    def convergiu(self) -> bool:
        return bool(self.historico) and self.historico[-1] == 0


# --------------------------------------------------------------- roteiro

def _linhas(neuronio, alvo) -> list[tuple]:
    return [(a, b, alvo(a, b), neuronio(a, b), alvo(a, b) == neuronio(a, b))
            for a, b in ENTRADAS]


def _mostrar(titulo: str, neuronio, alvo) -> None:
    linhas = _linhas(neuronio, alvo)
    acertos = sum(1 for *_, ok in linhas if ok)
    print(f"\n{titulo} — {acertos}/4")
    print(f"  w₁={neuronio.pesos[0]:+.2f}  w₂={neuronio.pesos[1]:+.2f}  θ={neuronio.limiar:+.2f}")
    print("  x₁ x₂ | esperado  obtido")
    for a, b, esperado, obtido, ok in linhas:
        print(f"   {a}  {b} |    {esperado}         {obtido}   {'✔' if ok else '✘'}")


def main() -> None:
    print("=" * 66)
    print("PARTE 1 — McCulloch & Pitts (1943): os pesos são postos à mão")
    print("=" * 66)

    # Uma solução para cada função separável. Não são AS soluções: são UMAS.
    a_mao = {
        "AND":  NeuronioMP([1, 1], limiar=2),
        "OR":   NeuronioMP([1, 1], limiar=1),
        "NAND": NeuronioMP([-1, -1], limiar=-1),
        "NOR":  NeuronioMP([-1, -1], limiar=0),
    }
    for nome, neuronio in a_mao.items():
        alvo = FUNCOES[nome]
        _mostrar(nome, neuronio, alvo)

    print("\n  Repare: existem INFINITAS soluções para cada uma. Troque")
    print("  NeuronioMP([1,1], 2) por ([0.6,0.6], 1.1) e o AND continua certo.")

    print("\n" + "=" * 66)
    print("PARTE 2 — Rosenblatt (1958): a máquina encontra os pesos sozinha")
    print("=" * 66)

    for nome in ("AND", "OR", "NAND", "NOR"):
        p = Perceptron(seed=1).treinar(FUNCOES[nome], epocas=100)
        print(f"\n{nome}: convergiu em {len(p.historico)} épocas "
              f"(erros por época: {p.historico})")
        print(f"  encontrou w₁={p.pesos[0]:+.2f} w₂={p.pesos[1]:+.2f} θ={p.limiar:+.2f}")

    print("\n" + "=" * 66)
    print("PARTE 3 — XOR: o limite que parou a área por uma década")
    print("=" * 66)

    p = Perceptron(seed=1).treinar(FUNCOES["XOR"], epocas=500)
    print(f"\nXOR após 500 épocas: convergiu? {p.convergiu()}")
    print(f"  erros nas últimas 10 épocas: {p.historico[-10:]}")
    print("  Note que o número de erros nem sequer DIMINUI — o perceptron não")
    print("  se aproxima da solução, ele oscila. Não há solução de que se")
    print("  aproximar. É o sintoma do impossível, não do difícil.")
    _mostrar("  onde ele parou", p, FUNCOES["XOR"])

    melhor = max(_linhas(NeuronioMP([w1, w2], t), FUNCOES["XOR"]).count(True) if False else
                 sum(1 for *_, ok in _linhas(NeuronioMP([w1, w2], t), FUNCOES["XOR"]) if ok)
                 for w1 in (-1, 0, 1) for w2 in (-1, 0, 1) for t in (-1.5, -0.5, 0.5, 1.5))
    print(f"\n  Varrendo pesos em {{-1,0,1}} e limiares em {{±0,5, ±1,5}}, o melhor")
    print(f"  resultado possível é {melhor}/4 — nunca 4.")
    print("\n  Não é falta de épocas nem de taxa. É geometria: os pontos de")
    print("  saída 1 estão em CANTOS OPOSTOS do quadrado, e nenhuma reta")
    print("  separa cantos opostos. Minsky & Papert demonstraram isso em 1969.")
    print("\n  A saída veio em 1986, e não era um neurônio melhor:")
    print("  era OUTRA CAMADA. É o capítulo III.2.")


if __name__ == "__main__":
    main()
