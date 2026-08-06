"""Régua linear — presente aqui só para comparação.

O modelo linear é construído com cuidado no **capítulo 05**, e o gradiente que
o treina, no **06**. Esta versão mínima existe na etapa 07 por um motivo: sem
uma régua, "boosting vai bem" não significa nada. Com ela, a afirmação do
capítulo 07 fica mensurável — a fronteira é irregular, e a reta não a alcança.

Referência para a frente, portanto, e deliberadamente enxuta: escala os
atributos, roda gradiente descendente em lote e para. Nada de regularização,
nada de otimizador esperto — isso é assunto do capítulo 06.
"""

from __future__ import annotations

import math
from typing import Sequence


def _sigmoide(z: float) -> float:
    if z >= 0:
        return 1 / (1 + math.exp(-min(z, 60)))
    e = math.exp(max(z, -60))
    return e / (1 + e)


class LogisticaSimples:
    def __init__(self, epocas: int = 300, taxa: float = 0.5, seed: int = 0) -> None:
        if epocas < 1:
            raise ValueError("precisa de ao menos 1 época")
        self.epocas = epocas
        self.taxa = taxa
        self.seed = seed
        self.pesos: list[float] = []
        self.vies = 0.0

    def fit(self, X: Sequence[Sequence[float]], y: Sequence[float]) -> "LogisticaSimples":
        if not y:
            raise ValueError("não dá para aprender com zero exemplos")
        n, d = len(y), len(X[0])
        # padroniza: sem isso, atributos em escalas diferentes fazem o gradiente
        # zigue-zaguear — a dor que o capítulo 06 formaliza
        self._media = [sum(linha[j] for linha in X) / n for j in range(d)]
        self._desvio = []
        for j in range(d):
            var = sum((linha[j] - self._media[j]) ** 2 for linha in X) / n
            self._desvio.append(math.sqrt(var) or 1.0)

        Z = [self._escalar(linha) for linha in X]
        self.pesos = [0.0] * d
        self.vies = 0.0
        for _ in range(self.epocas):
            gw = [0.0] * d
            gb = 0.0
            for linha, alvo in zip(Z, y):
                erro = _sigmoide(sum(w * v for w, v in zip(self.pesos, linha)) + self.vies) - alvo
                for j in range(d):
                    gw[j] += erro * linha[j]
                gb += erro
            for j in range(d):
                self.pesos[j] -= self.taxa * gw[j] / n
            self.vies -= self.taxa * gb / n
        return self

    def _escalar(self, linha: Sequence[float]) -> list[float]:
        return [(v - m) / s for v, m, s in zip(linha, self._media, self._desvio)]

    def predict_proba(self, X: Sequence[Sequence[float]]) -> list[float]:
        if not self.pesos:
            raise RuntimeError("chame fit() antes de predizer")
        return [_sigmoide(sum(w * v for w, v in zip(self.pesos, self._escalar(linha)))
                          + self.vies) for linha in X]

    def predict(self, X, limiar: float = 0.5) -> list[int]:
        return [1 if p > limiar else 0 for p in self.predict_proba(X)]
