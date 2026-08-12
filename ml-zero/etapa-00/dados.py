"""Etapa 00 — os dados, e a divisão que não mente.

Dataset **sintético e declarado como tal**: gerado por um processo que nós
escrevemos, com seed fixa. A escolha é deliberada e tem três razões:

  1. **Custo zero e sem rede** (Princípio VI) — a etapa 00 roda em qualquer
     máquina, sem download, sem chave, sem esperar.
  2. **Reprodutibilidade perfeita** (Princípio II) — a mesma seed dá o mesmo
     conjunto, hoje e daqui a dois anos, independentemente de um servidor
     externo continuar no ar.
  3. **Conhecemos a verdade.** Como nós geramos o processo, sabemos qual é o
     ruído irredutível — o que permite, no capítulo 0.2, comparar o erro do
     modelo com o teto teórico. Com dado real isso é impossível.

O preço é honesto e precisa ser dito: **dado sintético não tem as patologias
do dado real** — sem valores ausentes traiçoeiros, sem vazamento acidental,
sem viés de coleta. Essas patologias entram a partir da etapa 02 (cap. I.3),
com dados reais. Aqui, o objetivo é outro: montar o esqueleto metodológico.

Só biblioteca padrão. NumPy entra na etapa 05, quando o algoritmo exigir.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass

SEED = 20260801
PROB_RUIDO = 0.08  # ruído irredutível: 8% dos rótulos são invertidos de propósito


@dataclass(frozen=True)
class Conjunto:
    """Um conjunto de dados: as linhas (X) e os rótulos (y), lado a lado."""

    X: list[list[float]]
    y: list[int]
    nomes: tuple[str, ...] = ("renda_mensal", "meses_de_relacionamento", "uso_do_limite")

    def __len__(self) -> int:
        return len(self.y)

    def prevalencia(self) -> float:
        """Fração da classe positiva. É o primeiro número a olhar em qualquer base."""
        return sum(self.y) / len(self.y) if self.y else 0.0


def gerar(n: int = 4000, seed: int = SEED, prob_ruido: float = PROB_RUIDO) -> Conjunto:
    """Gera n exemplos de um problema de inadimplência sintético.

    O processo verdadeiro é uma função logística de três atributos. Como ele é
    conhecido, o ruído injetado (`prob_ruido`) É o erro irredutível do problema:
    nenhum modelo, por melhor que seja, deveria passar de ~1 - prob_ruido/2 de
    acurácia. Ter esse teto explícito é o que torna a etapa 00 didática.
    """
    rng = random.Random(seed)
    X: list[list[float]] = []
    y: list[int] = []

    for _ in range(n):
        renda = rng.lognormvariate(8.2, 0.55)          # ~R$ 3.600 na mediana
        meses = rng.randint(0, 120)
        uso = min(1.0, max(0.0, rng.betavariate(2.0, 3.0)))

        # Processo verdadeiro: quanto maior o uso do limite e menor a renda e o
        # tempo de casa, maior o risco. Coeficientes escolhidos à mão para dar
        # uma prevalência de ~20% — desbalanceada o suficiente para o cap. II.1
        # ter o que dizer, equilibrada o suficiente para a etapa 00 ser simples.
        z = 2.6 * uso - 0.55 * math.log(renda) - 0.012 * meses + 2.1
        p = 1 / (1 + math.exp(-z))
        rotulo = 1 if rng.random() < p else 0

        # Ruído irredutível: o mundo tem aleatoriedade que nenhum atributo captura.
        if rng.random() < prob_ruido:
            rotulo = 1 - rotulo

        X.append([renda, float(meses), uso])
        y.append(rotulo)

    return Conjunto(X=X, y=y)


def dividir(dados: Conjunto, frac_treino: float = 0.6, frac_validacao: float = 0.2,
            seed: int = SEED, estratificar: bool = True) -> tuple[Conjunto, Conjunto, Conjunto]:
    """Divide em treino / validação / teste.

    Duas decisões que parecem detalhe e não são:

    **Seed fixa.** Sem ela, cada execução produz uma divisão diferente e as
    métricas oscilam por motivo nenhum — você passa a perseguir ruído.

    **Estratificação.** A proporção de positivos é preservada nos três
    conjuntos. Sem isso, com classe rara, o teste pode acabar com pouquíssimos
    positivos, e a métrica vira loteria. É a mesma razão pela qual o cap. II.1
    insiste que teste pequeno exige intervalo de confiança.

    O que esta função *ainda não* faz — e o cap. I.3 vai exigir — é respeitar
    grupo e tempo. Embaralhar linhas de um mesmo cliente entre treino e teste,
    ou embaralhar uma série temporal, é vazamento. Aqui cada linha é um cliente
    independente, então embaralhar é legítimo. Não copie esta função para um
    problema em que isso não valha.
    """
    if not 0 < frac_treino < 1 or not 0 <= frac_validacao < 1:
        raise ValueError("frações precisam estar em (0,1)")
    if frac_treino + frac_validacao >= 1:
        raise ValueError("treino + validação precisa deixar espaço para o teste")

    rng = random.Random(seed)
    indices = list(range(len(dados)))

    def recortar(idx: list[int]) -> Conjunto:
        return Conjunto(X=[dados.X[i] for i in idx], y=[dados.y[i] for i in idx])

    if not estratificar:
        ordem = indices[:]
        rng.shuffle(ordem)
        n = len(ordem)
        c1 = int(n * frac_treino)
        c2 = c1 + int(n * frac_validacao)
        return recortar(ordem[:c1]), recortar(ordem[c1:c2]), recortar(ordem[c2:])

    # Estratificar é cortar DENTRO de cada classe e só então juntar. A tentação
    # é embaralhar tudo e intercalar as classes — não funciona: quando as
    # classes têm tamanhos diferentes, a minoritária se esgota antes do fim e a
    # cauda fica só com a majoritária. O teste
    # `test_estratificacao_mantem_a_prevalencia_nos_tres_conjuntos` existe
    # justamente para não deixar essa versão errada passar.
    por_classe: dict[int, list[int]] = {}
    for i in indices:
        por_classe.setdefault(dados.y[i], []).append(i)

    treino: list[int] = []
    validacao: list[int] = []
    teste: list[int] = []
    for classe in sorted(por_classe):
        grupo = por_classe[classe]
        rng.shuffle(grupo)
        m = len(grupo)
        c1 = int(m * frac_treino)
        c2 = c1 + int(m * frac_validacao)
        treino += grupo[:c1]
        validacao += grupo[c1:c2]
        teste += grupo[c2:]

    # Reembaralha cada parte: sem isso, os exemplos sairiam agrupados por
    # classe, o que quebra qualquer treino que leia os dados em ordem.
    for parte in (treino, validacao, teste):
        rng.shuffle(parte)

    return recortar(treino), recortar(validacao), recortar(teste)
