"""Etapa 07 — um dado tabular com a estrutura que o capítulo 07 discute.

**Por que não reusar o dado da etapa 00.** Reusar seria mais elegante, e seria
errado. Duas razões, medidas antes de decidir (Princípio I):

1. **Teto baixo demais para comparar modelos.** A etapa 00 injeta 8% de flips
   num problema com 19% de prevalência — o que corrompe cerca de 40% dos
   positivos. O classificador de Bayes daquele dado alcança **0,5895** de AUC.
   Com o teto nesse patamar, árvore, floresta e boosting terminam empilhados
   dentro do ruído, e o experimento não distingue nada. (Sem os flips, o mesmo
   Bayes daria 0,7155 — a medição está em `estudos/`.)

2. **A fronteira é suave, e é justo aí que árvores não têm vantagem.** O dado
   da etapa 00 é uma sigmoide de três variáveis: um modelo linear a descreve
   quase perfeitamente. Usá-lo para argumentar a favor de árvores seria montar
   o experimento para dar o resultado que já se queria.

Grinsztajn, Oyallon & Varoquaux (2022) identificam três características do dado
tabular real que favorecem modelos de árvore: presença de **atributos não
informativos**, **funções irregulares** (não suaves) e sensibilidade à
orientação dos eixos. Este gerador tem as três, de propósito e declaradamente.

Regra 4 da construção: seed fixa, mesmo resultado sempre.
"""

from __future__ import annotations

import random
from dataclasses import dataclass

SEED = 20260807
RUIDO = 0.03  # flips deliberados; baixo o bastante para o teto ficar informativo

NOMES = ("consumo", "horario", "regiao_cod", "ruido_a", "ruido_b", "ruido_c")


@dataclass(frozen=True)
class Tabular:
    X: list[list[float]]
    y: list[int]
    nomes: tuple[str, ...] = NOMES

    def __len__(self) -> int:
        return len(self.y)

    def prevalencia(self) -> float:
        return sum(self.y) / len(self.y) if self.y else 0.0


def gerar(n: int = 3000, seed: int = SEED, ruido: float = RUIDO) -> Tabular:
    """Gera um problema de detecção de anomalia de consumo.

    O processo verdadeiro tem **interação** e **quebra**, que é o que torna a
    função irregular:

    - anomalia se `consumo` alto **e** `horario` fora do comercial (interação:
      nenhum dos dois sozinho basta);
    - **ou** se `consumo` cair abruptamente abaixo de um limiar (quebra: uma
      descontinuidade, não uma rampa);
    - três atributos são puro ruído, e não deveriam ser usados por modelo nenhum.

    Um modelo linear precisa de termos de interação explícitos para capturar a
    primeira regra, e não representa a segunda. Uma árvore captura ambas com
    dois cortes. Essa assimetria é o argumento do capítulo, e ela está aqui
    porque foi construída — o que é honesto desde que dito.
    """
    rng = random.Random(seed)
    X: list[list[float]] = []
    y: list[int] = []

    for _ in range(n):
        consumo = rng.uniform(0, 100)
        horario = rng.uniform(0, 24)
        regiao = float(rng.randrange(5))
        ruido_a = rng.gauss(0, 1)
        ruido_b = rng.uniform(-3, 3)
        ruido_c = rng.lognormvariate(0, 1)

        fora_do_comercial = horario < 6 or horario > 20
        interacao = consumo > 70 and fora_do_comercial
        quebra = consumo < 8
        # a região 3 tem tolerância maior — quebra a simetria entre categorias
        if regiao == 3 and interacao:
            interacao = consumo > 88

        rotulo = 1 if (interacao or quebra) else 0
        if rng.random() < ruido:
            rotulo = 1 - rotulo

        X.append([consumo, horario, regiao, ruido_a, ruido_b, ruido_c])
        y.append(rotulo)

    return Tabular(X=X, y=y)


def dividir(dados: Tabular, frac_treino: float = 0.7, seed: int = SEED
            ) -> tuple[Tabular, Tabular]:
    """Treino/validação estratificado. Aqui cada linha é independente — não há
    grupo nem tempo —, então embaralhar é legítimo. O capítulo 02 explica
    quando deixa de ser."""
    rng = random.Random(seed)
    por_classe: dict[int, list[int]] = {}
    for i, alvo in enumerate(dados.y):
        por_classe.setdefault(alvo, []).append(i)

    treino: list[int] = []
    validacao: list[int] = []
    for classe in sorted(por_classe):
        grupo = por_classe[classe]
        rng.shuffle(grupo)
        corte = int(len(grupo) * frac_treino)
        treino += grupo[:corte]
        validacao += grupo[corte:]
    rng.shuffle(treino)
    rng.shuffle(validacao)

    corta = lambda idx: Tabular(X=[dados.X[i] for i in idx], y=[dados.y[i] for i in idx])
    return corta(treino), corta(validacao)


def p_verdadeiro(x: list[float]) -> float:
    """A probabilidade real do rótulo, antes do ruído.

    Existe porque nós escrevemos o processo — é o que permite calcular o teto
    de Bayes e saber quando parar de otimizar (cap. 01, ruído irredutível).
    """
    consumo, horario, regiao = x[0], x[1], x[2]
    fora_do_comercial = horario < 6 or horario > 20
    limite = 88 if regiao == 3 else 70
    positivo = (consumo > limite and fora_do_comercial) or consumo < 8
    # com ruído de flip r, P(rótulo=1) = (1-r) se positivo, r caso contrário
    return (1 - RUIDO) if positivo else RUIDO
