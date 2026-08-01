"""Etapa 00 — a linha de base, e a acurácia que ela já entrega.

O número mais importante do projeto, e o mais frequentemente pulado: **quanto
acerta o modelo que não faz nada?**

Sem ele, "94% de acurácia" é uma frase sem referência. Com ele, você sabe na
hora se 94% é excelente (linha de base 50%) ou constrangedor (linha de base
90%). O cap. 04 inteiro é uma expansão desta ideia.

Note que `MajorityBaseline` é um modelo de verdade: tem `fit` e `predict`,
como qualquer outro. Isso não é ironia — é a interface que a etapa 05 vai
reaproveitar, e tratá-lo como modelo desde o começo evita a tentação de
compará-lo "por fora".
"""

from __future__ import annotations

from collections import Counter


class MajorityBaseline:
    """Prevê sempre a classe mais frequente do treino."""

    def __init__(self) -> None:
        self.classe: int | None = None
        self.prob_: float | None = None

    def fit(self, X: list[list[float]], y: list[int]) -> "MajorityBaseline":
        if not y:
            raise ValueError("não dá para aprender com zero exemplos")
        contagem = Counter(y)
        self.classe = contagem.most_common(1)[0][0]
        # Escore constante = prevalência da classe positiva no treino. Isso torna
        # a linha de base comparável por AUC também, não só por acurácia.
        self.prob_ = contagem.get(1, 0) / len(y)
        return self

    def predict(self, X: list[list[float]]) -> list[int]:
        if self.classe is None:
            raise RuntimeError("chame fit() antes de predict()")
        return [self.classe] * len(X)

    def predict_proba(self, X: list[list[float]]) -> list[float]:
        if self.prob_ is None:
            raise RuntimeError("chame fit() antes de predict_proba()")
        return [self.prob_] * len(X)


class MeanBaseline:
    """Prevê sempre a média do treino. A linha de base da regressão."""

    def __init__(self) -> None:
        self.media: float | None = None

    def fit(self, X: list[list[float]], y: list[float]) -> "MeanBaseline":
        if not y:
            raise ValueError("não dá para aprender com zero exemplos")
        self.media = sum(y) / len(y)
        return self

    def predict(self, X: list[list[float]]) -> list[float]:
        if self.media is None:
            raise RuntimeError("chame fit() antes de predict()")
        return [self.media] * len(X)


def acuracia(y_true: list[int], y_pred: list[int]) -> float:
    if len(y_true) != len(y_pred):
        raise ValueError("y_true e y_pred têm tamanhos diferentes")
    if not y_true:
        raise ValueError("conjunto vazio: acurácia é indefinida")
    return sum(1 for a, b in zip(y_true, y_pred) if a == b) / len(y_true)


def matriz_confusao(y_true: list[int], y_pred: list[int]) -> dict[str, int]:
    """Os quatro números de que toda métrica binária deriva (cap. 04).

    Aparece já na etapa 00 porque a linha de base precisa ser lida por eles:
    "sempre a classe majoritária" tem acurácia alta e revocação **zero** na
    classe rara — e é exatamente esse contraste que motiva o capítulo 04.
    """
    if len(y_true) != len(y_pred):
        raise ValueError("y_true e y_pred têm tamanhos diferentes")
    vp = fp = fn = vn = 0
    for real, pred in zip(y_true, y_pred):
        if real == 1 and pred == 1:
            vp += 1
        elif real == 0 and pred == 1:
            fp += 1
        elif real == 1 and pred == 0:
            fn += 1
        else:
            vn += 1
    return {"vp": vp, "fp": fp, "fn": fn, "vn": vn}
