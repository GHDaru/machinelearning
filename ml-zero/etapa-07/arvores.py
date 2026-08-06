"""Etapa 07 — árvore, floresta e boosting, do zero.

Três modelos em ~250 linhas de biblioteca padrão, na ordem em que o capítulo 07
os apresenta:

  1. `Arvore`   — uma árvore de decisão (CART com impureza de Gini).
  2. `Floresta` — bagging + subamostragem de atributos. Ataca **variância**.
  3. `Boosting` — árvores sequenciais sobre o resíduo. Ataca **viés**.

O ponto pedagógico não é ter três classificadores: é que bagging e boosting
atacam **parcelas diferentes do erro** (cap. 01), e isso é visível nos números
que `rodar.py` imprime — a árvore sozinha oscila muito entre seeds, a floresta
quase não oscila, e o boosting alcança o que nenhuma árvore isolada alcança.

Regra 1 da construção: do zero antes da biblioteca. Depois de ver isto, usar
`sklearn` é legítimo — e a etapa seguinte usa, sem culpa.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from typing import Optional, Sequence

Linha = Sequence[float]


# ------------------------------------------------------------------ árvore

@dataclass
class No:
    """Nó da árvore. Folha se `atributo is None`."""

    atributo: Optional[int] = None
    limiar: float = 0.0
    esquerda: Optional["No"] = None
    direita: Optional["No"] = None
    valor: float = 0.0  # folha: proporção da classe 1 (ou o valor de regressão)


def _gini(n1: int, n: int) -> float:
    """Impureza de Gini de um nó binário com n1 positivos entre n exemplos.

    Intuição: a chance de errar se você chutasse a classe sorteando pela
    distribuição do próprio nó. Zero quando o nó é puro.
    """
    if n == 0:
        return 0.0
    p = n1 / n
    return 2 * p * (1 - p)


class Arvore:
    """Árvore de decisão binária (CART).

    `criterio="gini"` classifica; `criterio="mse"` faz regressão — este segundo
    é o que o boosting usa para ajustar resíduos.
    """

    def __init__(self, max_profundidade: int = 6, min_folha: int = 10,
                 criterio: str = "gini", atributos_por_no: Optional[int] = None,
                 seed: int = 0) -> None:
        if criterio not in ("gini", "mse"):
            raise ValueError("critério deve ser 'gini' ou 'mse'")
        if max_profundidade < 1:
            raise ValueError("profundidade mínima é 1")
        self.max_profundidade = max_profundidade
        self.min_folha = min_folha
        self.criterio = criterio
        self.atributos_por_no = atributos_por_no
        self.raiz: Optional[No] = None
        self._rng = random.Random(seed)

    # -- treino --

    def fit(self, X: Sequence[Linha], y: Sequence[float]) -> "Arvore":
        if not y:
            raise ValueError("não dá para aprender com zero exemplos")
        if len(X) != len(y):
            raise ValueError("X e y têm tamanhos diferentes")
        self._n_atributos = len(X[0])
        self.raiz = self._crescer(list(range(len(y))), X, y, profundidade=0)
        return self

    def _crescer(self, idx: list[int], X, y, profundidade: int) -> No:
        valores = [y[i] for i in idx]
        media = sum(valores) / len(valores)

        if profundidade >= self.max_profundidade or len(idx) < 2 * self.min_folha:
            return No(valor=media)
        if all(v == valores[0] for v in valores):       # nó puro: parar é o certo
            return No(valor=media)

        atributo, limiar, ganho = self._melhor_corte(idx, X, y)
        if atributo is None or ganho <= 1e-12:
            return No(valor=media)

        esq = [i for i in idx if X[i][atributo] <= limiar]
        dir_ = [i for i in idx if X[i][atributo] > limiar]
        if len(esq) < self.min_folha or len(dir_) < self.min_folha:
            return No(valor=media)

        return No(atributo=atributo, limiar=limiar, valor=media,
                  esquerda=self._crescer(esq, X, y, profundidade + 1),
                  direita=self._crescer(dir_, X, y, profundidade + 1))

    def _atributos_candidatos(self) -> list[int]:
        """Subamostragem de atributos — é o que descorrelaciona as árvores da
        floresta. Sem isso, bagging sozinho produz árvores parecidas demais e
        a média delas melhora pouco (Breiman, 2001)."""
        todos = list(range(self._n_atributos))
        if not self.atributos_por_no or self.atributos_por_no >= len(todos):
            return todos
        return self._rng.sample(todos, self.atributos_por_no)

    def _melhor_corte(self, idx: list[int], X, y) -> tuple[Optional[int], float, float]:
        n = len(idx)
        soma_total = sum(y[i] for i in idx)
        impureza_pai = (_gini(int(soma_total), n) if self.criterio == "gini"
                        else _variancia(idx, y))
        melhor = (None, 0.0, 0.0)

        for a in self._atributos_candidatos():
            ordenados = sorted(idx, key=lambda i: X[i][a])
            soma_esq = 0.0
            soma_quad_esq = 0.0
            for k in range(1, n):
                i = ordenados[k - 1]
                soma_esq += y[i]
                soma_quad_esq += y[i] * y[i]
                if X[ordenados[k]][a] == X[ordenados[k - 1]][a]:
                    continue                      # não corta no meio de empate
                if k < self.min_folha or n - k < self.min_folha:
                    continue

                if self.criterio == "gini":
                    imp = (k / n) * _gini(int(soma_esq), k) + \
                          ((n - k) / n) * _gini(int(soma_total - soma_esq), n - k)
                else:
                    soma_dir = soma_total - soma_esq
                    soma_quad_dir = sum(y[j] * y[j] for j in ordenados[k:])
                    imp = ((soma_quad_esq - soma_esq ** 2 / k) +
                           (soma_quad_dir - soma_dir ** 2 / (n - k))) / n

                ganho = impureza_pai - imp
                if ganho > melhor[2]:
                    limiar = (X[ordenados[k]][a] + X[ordenados[k - 1]][a]) / 2
                    melhor = (a, limiar, ganho)
        return melhor

    # -- uso --

    def predict_proba(self, X: Sequence[Linha]) -> list[float]:
        if self.raiz is None:
            raise RuntimeError("chame fit() antes de predizer")
        return [self._descer(self.raiz, linha) for linha in X]

    def predict(self, X: Sequence[Linha], limiar: float = 0.5) -> list[int]:
        return [1 if p > limiar else 0 for p in self.predict_proba(X)]

    def _descer(self, no: No, linha: Linha) -> float:
        while no.atributo is not None:
            no = no.esquerda if linha[no.atributo] <= no.limiar else no.direita
        return no.valor

    def profundidade(self) -> int:
        def _p(no: Optional[No]) -> int:
            if no is None or no.atributo is None:
                return 0
            return 1 + max(_p(no.esquerda), _p(no.direita))
        return _p(self.raiz)


def _variancia(idx: list[int], y) -> float:
    vals = [y[i] for i in idx]
    m = sum(vals) / len(vals)
    return sum((v - m) ** 2 for v in vals) / len(vals)


# --------------------------------------------------------------- floresta

class Floresta:
    """Bagging + subamostragem de atributos. Ataca VARIÂNCIA.

    Cada árvore vê uma reamostragem com reposição dos dados e um subconjunto
    dos atributos em cada nó. Sozinha, cada árvore é pior que a árvore única
    treinada em tudo — a média delas é melhor. Esse é o contraintuitivo do
    bagging, e é consequência direta da decomposição do capítulo 01.
    """

    def __init__(self, n_arvores: int = 30, max_profundidade: int = 8,
                 min_folha: int = 5, atributos_por_no: Optional[int] = None,
                 seed: int = 0) -> None:
        if n_arvores < 1:
            raise ValueError("precisa de ao menos 1 árvore")
        self.n_arvores = n_arvores
        self.max_profundidade = max_profundidade
        self.min_folha = min_folha
        self.atributos_por_no = atributos_por_no
        self.seed = seed
        self.arvores: list[Arvore] = []

    def fit(self, X: Sequence[Linha], y: Sequence[float]) -> "Floresta":
        rng = random.Random(self.seed)
        n = len(y)
        m = self.atributos_por_no or max(1, int(math.sqrt(len(X[0]))))
        self.arvores = []
        for k in range(self.n_arvores):
            amostra = [rng.randrange(n) for _ in range(n)]      # com reposição
            Xb = [X[i] for i in amostra]
            yb = [y[i] for i in amostra]
            arv = Arvore(self.max_profundidade, self.min_folha, "gini",
                         atributos_por_no=m, seed=self.seed + k)
            self.arvores.append(arv.fit(Xb, yb))
        return self

    def predict_proba(self, X: Sequence[Linha]) -> list[float]:
        if not self.arvores:
            raise RuntimeError("chame fit() antes de predizer")
        somas = [0.0] * len(X)
        for arv in self.arvores:
            for i, p in enumerate(arv.predict_proba(X)):
                somas[i] += p
        return [s / len(self.arvores) for s in somas]

    def predict(self, X: Sequence[Linha], limiar: float = 0.5) -> list[int]:
        return [1 if p > limiar else 0 for p in self.predict_proba(X)]


# --------------------------------------------------------------- boosting

class Boosting:
    """Gradient boosting com perda logística. Ataca VIÉS.

    Cada árvore nova é ajustada ao **resíduo** (y − p) das anteriores, no espaço
    do logito. A `taxa` encolhe a contribuição de cada árvore: aprender devagar
    e por muitas etapas generaliza melhor que aprender rápido em poucas — é
    regularização por outro nome (cap. 06).
    """

    def __init__(self, n_arvores: int = 60, taxa: float = 0.1,
                 max_profundidade: int = 3, min_folha: int = 10, seed: int = 0) -> None:
        if not 0 < taxa <= 1:
            raise ValueError("taxa precisa estar em (0,1]")
        if n_arvores < 1:
            raise ValueError("precisa de ao menos 1 árvore")
        self.n_arvores = n_arvores
        self.taxa = taxa
        self.max_profundidade = max_profundidade
        self.min_folha = min_folha
        self.seed = seed
        self.arvores: list[Arvore] = []
        self.logito_inicial = 0.0

    def fit(self, X: Sequence[Linha], y: Sequence[float]) -> "Boosting":
        if not y:
            raise ValueError("não dá para aprender com zero exemplos")
        p0 = min(max(sum(y) / len(y), 1e-6), 1 - 1e-6)
        self.logito_inicial = math.log(p0 / (1 - p0))
        logitos = [self.logito_inicial] * len(y)
        self.arvores = []

        for k in range(self.n_arvores):
            residuos = [yi - _sigmoide(f) for yi, f in zip(y, logitos)]
            arv = Arvore(self.max_profundidade, self.min_folha, "mse", seed=self.seed + k)
            arv.fit(X, residuos)
            passo = arv.predict_proba(X)
            logitos = [f + self.taxa * d for f, d in zip(logitos, passo)]
            self.arvores.append(arv)
        return self

    def predict_proba(self, X: Sequence[Linha]) -> list[float]:
        if not self.arvores:
            raise RuntimeError("chame fit() antes de predizer")
        logitos = [self.logito_inicial] * len(X)
        for arv in self.arvores:
            for i, d in enumerate(arv.predict_proba(X)):
                logitos[i] += self.taxa * d
        return [_sigmoide(f) for f in logitos]

    def predict(self, X: Sequence[Linha], limiar: float = 0.5) -> list[int]:
        return [1 if p > limiar else 0 for p in self.predict_proba(X)]


def _sigmoide(z: float) -> float:
    if z >= 0:
        return 1 / (1 + math.exp(-min(z, 60)))
    e = math.exp(max(z, -60))
    return e / (1 + e)


# ---------------------------------------------------------------- métricas

def auc(y_true: Sequence[int], escores: Sequence[float]) -> float:
    """AUC-ROC pelo método dos postos (Mann–Whitney), com empates tratados.

    Definição operacional do capítulo 04: a probabilidade de um positivo
    sorteado ao acaso receber escore maior que um negativo sorteado ao acaso.
    """
    if len(y_true) != len(escores):
        raise ValueError("tamanhos diferentes")
    pos = sum(y_true)
    neg = len(y_true) - pos
    if pos == 0 or neg == 0:
        raise ValueError("AUC é indefinida com uma única classe")

    ordem = sorted(range(len(escores)), key=lambda i: escores[i])
    postos = [0.0] * len(escores)
    i = 0
    while i < len(ordem):
        j = i
        while j + 1 < len(ordem) and escores[ordem[j + 1]] == escores[ordem[i]]:
            j += 1
        posto_medio = (i + j) / 2 + 1           # empates dividem o posto
        for k in range(i, j + 1):
            postos[ordem[k]] = posto_medio
        i = j + 1

    soma_pos = sum(p for p, alvo in zip(postos, y_true) if alvo == 1)
    return (soma_pos - pos * (pos + 1) / 2) / (pos * neg)
