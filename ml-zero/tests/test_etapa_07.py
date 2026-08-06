"""Testes da etapa 07 — árvore, floresta e boosting.

Usam dados pequenos de propósito: os testes são o gabarito da etapa e precisam
rodar em segundos. O experimento completo, com os números que o capítulo cita,
está em `etapa-07/rodar.py` e leva alguns minutos.
"""

from __future__ import annotations

import random
import statistics

import pytest

from conftest import carregar

_a = carregar("etapa-07", "arvores")
_dt = carregar("etapa-07", "dados_tabulares")
_lin = carregar("etapa-07", "linear")

Arvore = _a.Arvore
Floresta = _a.Floresta
Boosting = _a.Boosting
auc = _a.auc
gerar = _dt.gerar
dividir = _dt.dividir
p_verdadeiro = _dt.p_verdadeiro
LogisticaSimples = _lin.LogisticaSimples


@pytest.fixture(scope="module")
def dados_pequenos():
    d = gerar(n=600)
    return dividir(d)


# ------------------------------------------------------------------- AUC

def test_auc_perfeita_e_invertida():
    y = [0, 0, 1, 1]
    assert auc(y, [0.1, 0.2, 0.8, 0.9]) == 1.0
    assert auc(y, [0.9, 0.8, 0.2, 0.1]) == 0.0


def test_auc_de_escore_constante_e_meio():
    """Empate total = moeda. É a propriedade que faz AUC ser interpretável."""
    assert auc([0, 1, 0, 1], [0.5] * 4) == 0.5


def test_auc_indefinida_com_uma_classe_so():
    with pytest.raises(ValueError, match="uma única classe"):
        auc([1, 1, 1], [0.1, 0.2, 0.3])


def test_auc_recusa_tamanhos_diferentes():
    with pytest.raises(ValueError):
        auc([0, 1], [0.5])


# ---------------------------------------------------------------- árvore

def test_arvore_aprende_uma_regra_de_um_corte():
    X = [[v] for v in range(100)]
    y = [1.0 if v >= 50 else 0.0 for v in range(100)]
    arv = Arvore(max_profundidade=2, min_folha=5).fit(X, y)
    assert arv.predict([[10]]) == [0]
    assert arv.predict([[90]]) == [1]


def test_arvore_respeita_a_profundidade_maxima():
    d = gerar(n=400)
    arv = Arvore(max_profundidade=3, min_folha=5).fit(d.X, [float(v) for v in d.y])
    assert arv.profundidade() <= 3


def test_no_puro_vira_folha_sem_cortar():
    X = [[1.0], [2.0], [3.0]]
    arv = Arvore(max_profundidade=5, min_folha=1).fit(X, [1.0, 1.0, 1.0])
    assert arv.profundidade() == 0
    assert arv.predict_proba([[99.0]]) == [1.0]


def test_arvore_recusa_configuracao_invalida():
    with pytest.raises(ValueError):
        Arvore(criterio="entropia")
    with pytest.raises(ValueError):
        Arvore(max_profundidade=0)


def test_usar_antes_de_treinar_falha_claramente():
    with pytest.raises(RuntimeError):
        Arvore().predict([[1.0]])
    with pytest.raises(RuntimeError):
        Floresta().predict_proba([[1.0]])
    with pytest.raises(RuntimeError):
        Boosting().predict_proba([[1.0]])


def test_treinar_com_nada_falha_alto():
    with pytest.raises(ValueError):
        Arvore().fit([], [])
    with pytest.raises(ValueError):
        Boosting().fit([], [])


def test_x_e_y_de_tamanhos_diferentes_falham():
    with pytest.raises(ValueError):
        Arvore().fit([[1.0], [2.0]], [1.0])


# ------------------------------------------------------- floresta e boosting

def test_floresta_e_boosting_batem_a_linha_de_base(dados_pequenos):
    treino, val = dados_pequenos
    yt = [float(v) for v in treino.y]
    for modelo in (Floresta(n_arvores=10, max_profundidade=6, seed=0),
                   Boosting(n_arvores=20, taxa=0.3, max_profundidade=3, seed=0)):
        modelo.fit(treino.X, yt)
        assert auc(val.y, modelo.predict_proba(val.X)) > 0.75


def test_modelos_sao_reprodutiveis(dados_pequenos):
    treino, val = dados_pequenos
    yt = [float(v) for v in treino.y]
    a = Floresta(n_arvores=8, seed=3).fit(treino.X, yt).predict_proba(val.X)
    b = Floresta(n_arvores=8, seed=3).fit(treino.X, yt).predict_proba(val.X)
    assert a == b


def test_configuracoes_invalidas_de_ensemble_falham():
    with pytest.raises(ValueError):
        Floresta(n_arvores=0)
    with pytest.raises(ValueError):
        Boosting(taxa=0)
    with pytest.raises(ValueError):
        Boosting(taxa=1.5)
    with pytest.raises(ValueError):
        Boosting(n_arvores=0)


def test_boosting_com_taxa_menor_precisa_de_mais_arvores(dados_pequenos):
    """Encolher o passo é regularizar: aprende menos por etapa, precisa de mais."""
    treino, val = dados_pequenos
    yt = [float(v) for v in treino.y]
    rapido = Boosting(n_arvores=10, taxa=0.5, max_profundidade=3, seed=0).fit(treino.X, yt)
    devagar = Boosting(n_arvores=10, taxa=0.05, max_profundidade=3, seed=0).fit(treino.X, yt)
    assert auc(val.y, rapido.predict_proba(val.X)) > auc(val.y, devagar.predict_proba(val.X))


# ---------------------------------------------- as lições da etapa, executáveis

def test_a_licao_1_bagging_reduz_a_variancia(dados_pequenos):
    """A afirmação do capítulo 01 medida no capítulo 07.

    **Como medir importa.** A primeira versão deste teste colapsava cada
    reamostragem numa AUC e comparava o desvio-padrão dessas AUCs. Com poucas
    reamostras, esse desvio é ele próprio ruidoso — o teste falhava por falta
    de poder estatístico, não por a teoria estar errada.

    A medida certa é a da própria decomposição: **variância da predição**,
    Var[f̂(x)] sobre reamostragens do treino, calculada ponto a ponto e depois
    promediada. Usa todos os pontos de validação em vez de um número por
    reamostra, e por isso enxerga o efeito com uma fração das execuções.
    """
    treino, val = dados_pequenos
    yt = [float(v) for v in treino.y]

    def variancia_da_predicao(fabrica, reamostras: int = 5) -> float:
        predicoes = []
        for s in range(reamostras):
            rng = random.Random(500 + s)
            amostra = [rng.randrange(len(yt)) for _ in range(len(yt))]
            m = fabrica(s).fit([treino.X[i] for i in amostra], [yt[i] for i in amostra])
            predicoes.append(m.predict_proba(val.X))
        return statistics.mean(
            statistics.pvariance([p[i] for p in predicoes]) for i in range(len(val.X))
        )

    var_arvore = variancia_da_predicao(lambda s: Arvore(max_profundidade=12, min_folha=1, seed=s))
    var_floresta = variancia_da_predicao(lambda s: Floresta(n_arvores=12, max_profundidade=8, seed=s))

    assert var_floresta < var_arvore / 2, (
        f"bagging deveria cortar a variância pela metade ou mais "
        f"(árvore {var_arvore:.5f}, floresta {var_floresta:.5f})"
    )


def test_a_licao_2_a_reta_nao_alcanca_uma_fronteira_irregular(dados_pequenos):
    """O argumento central do capítulo 07, como asserção.

    A regra verdadeira é não-monotônica: consumo MUITO alto (fora do horário
    comercial) e consumo MUITO baixo são ambos anomalia. Nenhuma reta expressa
    "os extremos são positivos e o meio é negativo" — e por isso o modelo
    linear fica perto do acaso enquanto a árvore vai bem.
    """
    treino, val = dados_pequenos
    yt = [float(v) for v in treino.y]

    linear = LogisticaSimples(epocas=200, taxa=0.5).fit(treino.X, yt)
    arvore = Arvore(max_profundidade=6, min_folha=5).fit(treino.X, yt)

    auc_linear = auc(val.y, linear.predict_proba(val.X))
    auc_arvore = auc(val.y, arvore.predict_proba(val.X))

    assert auc_linear < 0.65, "a reta não deveria dar conta desta fronteira"
    assert auc_arvore > 0.85, "a árvore deveria dar"
    assert auc_arvore - auc_linear > 0.25


def test_a_licao_3_o_teto_de_bayes_e_conhecido_e_ninguem_deveria_passar_dele(dados_pequenos):
    """Só é possível porque nós escrevemos o processo gerador (cap. 01)."""
    treino, val = dados_pequenos
    teto = auc(val.y, [p_verdadeiro(x) for x in val.X])
    assert 0.85 < teto < 1.0

    modelo = Boosting(n_arvores=25, taxa=0.3, max_profundidade=3, seed=0)
    modelo.fit(treino.X, [float(v) for v in treino.y])
    obtido = auc(val.y, modelo.predict_proba(val.X))
    assert obtido <= teto + 0.03, "passar do teto de Bayes indicaria vazamento"


# ------------------------------------------------------------ dado tabular

def test_o_gerador_e_reprodutivel():
    assert gerar(n=200).X == gerar(n=200).X


def test_tres_atributos_sao_puro_ruido():
    """Grinsztajn et al.: dado tabular real tem atributos não informativos.

    Se um dos três "ruídos" carregasse sinal, o experimento estaria medindo
    outra coisa. Este teste guarda a premissa.
    """
    d = gerar(n=3000)
    for j, nome in ((3, "ruido_a"), (4, "ruido_b"), (5, "ruido_c")):
        a = auc(d.y, [linha[j] for linha in d.X])
        assert abs(a - 0.5) < 0.05, f"{nome} carrega sinal ({a:.3f}) e não deveria"


def test_divisao_preserva_a_prevalencia():
    d = gerar(n=1200)
    treino, val = dividir(d)
    assert abs(treino.prevalencia() - val.prevalencia()) < 0.03
    assert len(treino) + len(val) == len(d)
