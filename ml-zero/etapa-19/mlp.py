"""Etapa 19 — um MLP de verdade, em dados de verdade (capítulo III.2).

O QUE ESTA ETAPA É, E O QUE ELA NÃO É

Ela é a ponte entre a conta à mão do capítulo e a biblioteca. No III.2 você
derivou a retropropagação e acompanhou nove pesos mudando num passo. Aqui a
mesma ideia roda sobre 20 640 block groups da Califórnia (a menor unidade do
censo com dado amostral publicado), e a rede tem
alguns milhares de pesos em vez de nove.

Ela NÃO é a implementação em NumPy que o objetivo O3 do capítulo promete. Essa
ainda não existe, e o capítulo declara isso em vez de fingir. A ordem que a
constituição pede é NumPy primeiro, biblioteca depois; aqui a biblioteca foi
antecipada a pedido do professor, para a turma poder rodar já.

A LIGAÇÃO COM A CONTA À MÃO, EM UMA LINHA

    mlp.coefs_[0].shape   ->  (n_atributos, n_ocultas)

É a mesma matriz `entradas × saídas` que o capítulo mandou contar, e
`intercepts_` é o viés por unidade de destino. Não há mágica nova: há a mesma
conta, repetida muitas vezes.

COMO RODAR

    python ml-zero/etapa-19/mlp.py            # o protocolo completo
    python ml-zero/etapa-19/mlp.py --cru      # sem padronizar, para ver a falha silenciosa
    python ml-zero/etapa-19/mlp.py --ocultas 32       # outra largura
    python ml-zero/etapa-19/mlp.py --ocultas 32,16    # duas camadas escondidas

O QUE MUDAR E O QUE NÃO MUDAR

`--ocultas` é a manopla do aluno: a arquitetura é hiperparâmetro, e o capítulo
pede que se escolha sob validação. O split, a métrica e o alvo NÃO têm manopla,
de propósito — são o protocolo, e protocolo que cada um ajusta deixa de comparar.
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler

DADOS = Path(__file__).parents[1] / "dados" / "california"
ALVO = "MedHouseVal"


def carregar():
    """Lê o CSV congelado e o split GRAVADO — nada é sorteado aqui.

    Sortear o split em tempo de execução parece inofensivo e não é: o
    embaralhamento pode mudar entre versões da biblioteca, e aí duas turmas em
    semestres diferentes deixam de ser comparáveis. O split mora num arquivo.
    """
    df = pd.read_csv(DADOS / "california.csv")
    split = pd.read_csv(DADOS / "split.csv")
    X = df.drop(columns=[ALVO]).to_numpy(dtype=float)
    y = df[ALVO].to_numpy(dtype=float)
    p = split["parte"].to_numpy()
    return {n: (X[p == n], y[p == n]) for n in ("treino", "validacao", "teste")}


def linhas_de_base(d, padronizar=True):
    """As duas linhas de base são o CHECKSUM DO PROTOCOLO, não concorrentes.

    Se dois alunos não obtiverem exatamente os mesmos números aqui, um dos dois
    tem bug de protocolo — leu outro arquivo, usou outro split, trocou a métrica.
    Descobrir isso ANTES de comparar arquiteturas elimina a classe inteira de
    "meu resultado deu diferente" que não tem a ver com o modelo.
    """
    Xtr, ytr = d["treino"]
    Xte, yte = d["teste"]
    if padronizar:
        e = StandardScaler().fit(Xtr)
        Xtr, Xte = e.transform(Xtr), e.transform(Xte)
    saida = {}
    for nome, m in [("mediana", DummyRegressor(strategy="median")),
                    ("linear", LinearRegression())]:
        m.fit(Xtr, ytr)
        saida[nome] = mean_absolute_error(yte, m.predict(Xte))
    return saida


def treinar(d, ocultas=(64,), padronizar=True, semente=0, max_iter=400, **kw):
    Xtr, ytr = d["treino"]
    Xva, yva = d["validacao"]
    Xte, yte = d["teste"]
    if padronizar:
        e = StandardScaler().fit(Xtr)
        Xtr, Xva, Xte = e.transform(Xtr), e.transform(Xva), e.transform(Xte)
    # `activation='tanh'` por continuidade com a animação do capítulo, que usa
    # tanh. O default do sklearn é 'relu', e trocar sem dizer confundiria quem
    # acabou de ver as duas retas girando.
    m = MLPRegressor(hidden_layer_sizes=ocultas, activation="tanh",
                     random_state=semente, max_iter=max_iter, **kw)
    m.fit(Xtr, ytr)
    return {
        "validacao": mean_absolute_error(yva, m.predict(Xva)),
        "teste": mean_absolute_error(yte, m.predict(Xte)),
        "epocas": m.n_iter_,
        "parametros": sum(c.size for c in m.coefs_) + sum(b.size for b in m.intercepts_),
        "formato_primeira_matriz": m.coefs_[0].shape,
    }


def cinco_sementes(d, **kw):
    """Uma semente é amostra de tamanho 1 de uma distribuição cuja dispersão é o
    assunto do capítulo. Reporta-se a MEDIANA, e a amplitude vai junto — é ela
    que diz se a diferença entre dois alunos significa alguma coisa."""
    v = [treinar(d, semente=s, **kw) for s in range(5)]
    t = sorted(r["teste"] for r in v)
    return {"mediana": t[2], "amplitude": t[-1] - t[0],
            "parametros": v[0]["parametros"], "epocas": [r["epocas"] for r in v]}


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--cru", action="store_true", help="não padronizar os atributos")
    ap.add_argument("--ocultas", default="64",
                    help="unidades por camada escondida, separadas por vírgula (padrão: 64)")
    a = ap.parse_args()
    d = carregar()
    pad = not a.cru
    ocultas = tuple(int(x) for x in a.ocultas.split(","))

    print(f"California Housing · MAE no teste, em centenas de milhares de dólares")
    print(f"padronizado: {pad} · ocultas: {ocultas}\n")
    base = linhas_de_base(d, padronizar=pad)
    print("  linhas de base (o checksum do protocolo)")
    for k, v in base.items():
        print(f"    {k:10} MAE {v:.4f}")
    r = cinco_sementes(d, ocultas=ocultas, padronizar=pad)
    print(f"\n  MLP {ocultas} tanh · mediana de 5 sementes")
    print(f"    MAE {r['mediana']:.4f}   amplitude {r['amplitude']:.4f}")
    print(f"    {r['parametros']} parâmetros · épocas {r['epocas']}")
