"""Testes da etapa 00.

Na trilha `ml-zero`, os testes são o gabarito: eles dizem o que a etapa
precisa cumprir. Quem estiver implementando por conta própria roda estes
testes e sabe quando terminou.
"""

from __future__ import annotations

import pytest

from conftest import carregar

_baseline = carregar("etapa-00", "baseline")
_dados = carregar("etapa-00", "dados")

MajorityBaseline = _baseline.MajorityBaseline
MeanBaseline = _baseline.MeanBaseline
acuracia = _baseline.acuracia
matriz_confusao = _baseline.matriz_confusao
dividir = _dados.dividir
gerar = _dados.gerar


# --------------------------------------------------------------- dados

def test_geracao_e_reprodutivel_com_a_mesma_seed():
    a, b = gerar(n=300), gerar(n=300)
    assert a.X == b.X and a.y == b.y


def test_seeds_diferentes_geram_conjuntos_diferentes():
    a, b = gerar(n=300, seed=1), gerar(n=300, seed=2)
    assert a.y != b.y


def test_prevalencia_fica_na_faixa_desbalanceada_desejada():
    # O processo foi calibrado para ~20% de positivos: desbalanceado o
    # suficiente para o cap. 04 ter o que dizer.
    p = gerar(n=4000).prevalencia()
    assert 0.10 < p < 0.35


def test_divisao_preserva_todos_os_exemplos_sem_repetir():
    dados = gerar(n=1000)
    treino, val, teste = dividir(dados)
    assert len(treino) + len(val) + len(teste) == len(dados)
    # nenhum exemplo em dois conjuntos: o vazamento mais grosseiro que existe
    todos = [tuple(x) for c in (treino, val, teste) for x in c.X]
    assert len(todos) == len(set(todos))


def test_estratificacao_mantem_a_prevalencia_nos_tres_conjuntos():
    dados = gerar(n=4000)
    treino, val, teste = dividir(dados, estratificar=True)
    alvo = dados.prevalencia()
    for parte in (treino, val, teste):
        assert abs(parte.prevalencia() - alvo) < 0.02


def test_divisao_e_reprodutivel():
    dados = gerar(n=1000)
    a = dividir(dados, seed=7)
    b = dividir(dados, seed=7)
    assert [c.y for c in a] == [c.y for c in b]


@pytest.mark.parametrize("treino,validacao", [(0.9, 0.2), (0.0, 0.2), (1.0, 0.0)])
def test_fracoes_invalidas_falham_alto(treino, validacao):
    with pytest.raises(ValueError):
        dividir(gerar(n=100), frac_treino=treino, frac_validacao=validacao)


# ------------------------------------------------------------ baseline

def test_majority_preve_sempre_a_classe_mais_frequente():
    m = MajorityBaseline().fit([[0]] * 7, [0] * 5 + [1] * 2)
    assert m.classe == 0
    assert m.predict([[0], [0], [0]]) == [0, 0, 0]


def test_majority_expoe_a_prevalencia_como_escore_constante():
    m = MajorityBaseline().fit([[0]] * 10, [1] * 3 + [0] * 7)
    assert m.predict_proba([[0]]) == [0.3]


def test_usar_antes_de_treinar_falha_claramente():
    with pytest.raises(RuntimeError):
        MajorityBaseline().predict([[0]])
    with pytest.raises(ValueError):
        MajorityBaseline().fit([], [])


def test_mean_baseline_preve_a_media():
    m = MeanBaseline().fit([[0]] * 4, [2.0, 4.0, 6.0, 8.0])
    assert m.predict([[0], [0]]) == [5.0, 5.0]


# ------------------------------------------------------------- métricas

def test_acuracia_conta_acertos():
    assert acuracia([1, 0, 1, 0], [1, 0, 0, 0]) == 0.75
    assert acuracia([1, 1], [1, 1]) == 1.0


def test_acuracia_recusa_entrada_incoerente():
    with pytest.raises(ValueError):
        acuracia([1, 0], [1])
    with pytest.raises(ValueError):
        acuracia([], [])


def test_matriz_de_confusao_bate_com_a_conta_a_mao():
    mc = matriz_confusao([1, 1, 0, 0, 1], [1, 0, 1, 0, 1])
    assert mc == {"vp": 2, "fp": 1, "fn": 1, "vn": 1}


def test_a_licao_da_etapa_a_linha_de_base_tem_revocacao_zero():
    """O ponto pedagógico inteiro da etapa 00, como asserção executável."""
    treino, validacao, _ = dividir(gerar(n=4000))
    modelo = MajorityBaseline().fit(treino.X, treino.y)
    pred = modelo.predict(validacao.X)

    acc = acuracia(validacao.y, pred)
    mc = matriz_confusao(validacao.y, pred)

    assert acc > 0.65, "a linha de base já acerta a maioria — esse é o problema"
    assert mc["vp"] == 0, "e não encontra nenhum positivo — esse é o problema maior"
