"""Testes da etapa 05–06 — modelos lineares e o otimizador.

Vários deles são afirmações dos capítulos 05 e 06 escritas como asserção: se
"L1 zera coeficientes e L2 apenas encolhe" deixar de ser verdade, o build cai.
"""

from __future__ import annotations

import math
import random

import pytest

from conftest import carregar

_l = carregar("etapa-05", "linear")

Padronizador = _l.Padronizador
RegressaoLinear = _l.RegressaoLinear
RegressaoLogistica = _l.RegressaoLogistica
descida_de_gradiente = _l.descida_de_gradiente
sigmoide = _l.sigmoide


# ---------------------------------------------------------------- fixtures

@pytest.fixture(scope="module")
def regressao_conhecida():
    """y = 3·x1 − 2·x2 + 5, com ruído pequeno. Sabemos a resposta certa."""
    rng = random.Random(7)
    X = [[rng.uniform(-3, 3), rng.uniform(-3, 3)] for _ in range(300)]
    y = [3 * a - 2 * b + 5 + rng.gauss(0, 0.1) for a, b in X]
    return X, y


@pytest.fixture(scope="module")
def classificacao_linear():
    """Fronteira linear limpa: 2·x1 + x2 > 1. Sem ruído, perfeitamente separável."""
    rng = random.Random(11)
    X = [[rng.uniform(-2, 2), rng.uniform(-2, 2)] for _ in range(400)]
    y = [1.0 if 2 * a + b > 1 else 0.0 for a, b in X]
    return X, y


@pytest.fixture(scope="module")
def classificacao_ruidosa():
    """A mesma fronteira, com ruído e atributos inúteis — há o que sobreajustar.

    A distinção importa: num problema separável **não existe** ponto a partir do
    qual ajustar mais piora, e por isso early stopping não tem o que detectar.
    """
    rng = random.Random(17)
    X, y = [], []
    for _ in range(300):
        a, b = rng.uniform(-2, 2), rng.uniform(-2, 2)
        inuteis = [rng.gauss(0, 1) for _ in range(12)]
        X.append([a, b] + inuteis)
        y.append(1.0 if 2 * a + b + rng.gauss(0, 1.2) > 1 else 0.0)
    return X, y


# ------------------------------------------------------------- padronizador

def test_padronizador_centra_e_escala():
    Z = Padronizador().fit_transform([[10.0], [20.0], [30.0]])
    media = sum(z[0] for z in Z) / 3
    assert abs(media) < 1e-9
    assert abs(sum(z[0] ** 2 for z in Z) / 3 - 1) < 1e-9


def test_coluna_constante_nao_explode():
    """Desvio zero dividiria por zero. Deve virar coluna de zeros, não NaN."""
    Z = Padronizador().fit_transform([[5.0], [5.0], [5.0]])
    assert Z == [[0.0], [0.0], [0.0]]


def test_padronizador_aplica_ao_teste_o_que_aprendeu_no_treino():
    """A regra do capítulo 02: o teste é aplicado, nunca consultado."""
    p = Padronizador().fit([[0.0], [10.0]])
    assert p.transform([[5.0]]) == [[0.0]]      # 5 é a média do TREINO
    assert p.transform([[15.0]])[0][0] == 2.0   # 2 desvios acima


def test_usar_antes_de_treinar_falha():
    with pytest.raises(RuntimeError):
        Padronizador().transform([[1.0]])
    with pytest.raises(ValueError):
        Padronizador().fit([])


# ------------------------------------------------------- regressão linear

def test_solucao_fechada_recupera_os_coeficientes_verdadeiros(regressao_conhecida):
    X, y = regressao_conhecida
    m = RegressaoLinear(solucao_fechada=True, padronizar=False).fit(X, y)
    assert abs(m.pesos[0] - 3) < 0.05
    assert abs(m.pesos[1] + 2) < 0.05
    assert abs(m.vies - 5) < 0.05


def test_gradiente_chega_ao_mesmo_lugar_da_solucao_fechada(regressao_conhecida):
    """A lição do capítulo 06: gradiente é *um jeito* de resolver, não *o* jeito."""
    X, y = regressao_conhecida
    fechada = RegressaoLinear(solucao_fechada=True).fit(X, y)
    gradiente = RegressaoLinear(solucao_fechada=False, taxa=0.3, epocas=2000).fit(X, y)
    for a, b in zip(fechada.pesos, gradiente.pesos):
        assert abs(a - b) < 0.05
    assert abs(fechada.vies - gradiente.vies) < 0.05


def test_l2_encolhe_os_coeficientes(regressao_conhecida):
    X, y = regressao_conhecida
    sem = RegressaoLinear(l2=0.0).fit(X, y)
    com = RegressaoLinear(l2=5.0).fit(X, y)
    assert sum(abs(w) for w in com.pesos) < sum(abs(w) for w in sem.pesos)


def test_regressao_recusa_entrada_incoerente():
    with pytest.raises(ValueError):
        RegressaoLinear().fit([], [])
    with pytest.raises(ValueError):
        RegressaoLinear().fit([[1.0], [2.0]], [1.0])
    with pytest.raises(ValueError):
        RegressaoLinear(l2=-1)
    with pytest.raises(RuntimeError):
        RegressaoLinear().predict([[1.0]])


# ------------------------------------------------------ regressão logística

def test_logistica_aprende_uma_fronteira_linear(classificacao_linear):
    X, y = classificacao_linear
    m = RegressaoLogistica(taxa=1.0, epocas=600).fit(X, y)
    pred = m.predict(X)
    acerto = sum(1 for a, b in zip(y, pred) if a == b) / len(y)
    assert acerto > 0.93


def test_logistica_exige_alvo_binario():
    with pytest.raises(ValueError, match="binário"):
        RegressaoLogistica().fit([[1.0], [2.0]], [0.0, 2.0])


def test_razao_de_chances_e_a_leitura_correta_do_coeficiente(classificacao_linear):
    """Coeficiente logístico não se lê como "aumenta a probabilidade em w"."""
    X, y = classificacao_linear
    m = RegressaoLogistica(taxa=1.0, epocas=400).fit(X, y)
    razoes = m.razao_de_chances()
    assert all(r > 0 for r in razoes)
    for w, r in zip(m.pesos, razoes):
        assert abs(math.log(r) - w) < 1e-9
    assert razoes[0] > razoes[1]        # x1 pesa o dobro na regra verdadeira


def test_sigmoide_nao_estoura_em_extremos():
    assert sigmoide(1000) == pytest.approx(1.0)
    assert sigmoide(-1000) == pytest.approx(0.0)
    assert sigmoide(0) == 0.5


# --------------------------------------------------------- o otimizador

def test_taxa_alta_demais_diverge(regressao_conhecida):
    """Divergência exige perda ILIMITADA — por isso o teste usa regressão.

    Descoberta do caminho: com taxa 500 a regressão logística **não** diverge
    neste dado. Duas razões, e as duas valem para o leitor: (a) a perda
    logística é limitada (o log é cortado quando a probabilidade satura), e (b)
    num problema linearmente separável o primeiro passo já aponta na direção
    certa — um passo gigante nessa direção acerta em vez de explodir.

    Erro quadrático não tem teto. Aí sim o passo grande demais explode.
    """
    X, y = regressao_conhecida
    m = RegressaoLinear(solucao_fechada=False, taxa=50.0, epocas=60).fit(X, y)
    assert m.historico.divergiu()


def test_a_perda_logistica_e_limitada_e_por_isso_satura_em_vez_de_explodir(
        classificacao_linear):
    X, y = classificacao_linear
    m = RegressaoLogistica(taxa=500.0, epocas=60).fit(X, y)
    assert all(p < 100 for p in m.historico.perdas), (
        "a perda logística tem teto: satura, não vai ao infinito"
    )


def test_taxa_pequena_demais_estagna(classificacao_linear):
    X, y = classificacao_linear
    m = RegressaoLogistica(taxa=1e-7, epocas=30).fit(X, y)
    assert m.historico.estagnou()


def test_taxa_adequada_converge_sem_divergir_nem_estagnar(classificacao_linear):
    X, y = classificacao_linear
    m = RegressaoLogistica(taxa=0.5, epocas=300).fit(X, y)
    assert not m.historico.divergiu()
    assert not m.historico.estagnou()
    assert m.historico.perdas[-1] < m.historico.perdas[0]


def test_early_stopping_precisa_de_validacao_para_funcionar(classificacao_ruidosa):
    """A correção mais importante desta etapa.

    Com dados separáveis, a perda de TREINO cai indefinidamente: o modelo
    empurra os pesos para o infinito e a perda tende a zero sem nunca estagnar.
    Um early stopping que observa treino nunca dispara — ele está medindo
    memória, não generalização.

    Observando a VALIDAÇÃO, o critério funciona: a partir de certo ponto a
    perda de validação para de melhorar, e é aí que faz sentido parar.

    E o teste usa dado **ruidoso** de propósito: num problema perfeitamente
    separável não existe ponto a partir do qual ajustar mais piora, e portanto
    não há nada para o early stopping detectar. O instrumento pressupõe que haja
    sobreajuste possível.
    """
    X, y = classificacao_ruidosa
    corte = int(len(X) * 0.7)
    Xt, yt, Xv, yv = X[:corte], y[:corte], X[corte:], y[corte:]

    com_validacao = RegressaoLogistica(taxa=0.5, epocas=2000, paciencia=8,
                                       validacao=(Xv, yv)).fit(Xt, yt)
    assert com_validacao.historico.parou_cedo, (
        "com validação ruidosa o critério deveria disparar"
    )
    assert com_validacao.historico.epocas < 2000
    # e o que ele observou é a perda de VALIDAÇÃO, não a de treino
    assert len(com_validacao.historico.monitorado) == com_validacao.historico.epocas


def test_mini_batch_tambem_converge(classificacao_linear):
    X, y = classificacao_linear
    m = RegressaoLogistica(taxa=0.5, epocas=60, lote=32, seed=1).fit(X, y)
    acerto = sum(1 for a, b in zip(y, m.predict(X)) if a == b) / len(y)
    assert acerto > 0.90


def test_otimizador_recusa_configuracao_invalida():
    g = lambda p, idx: ([0.0], 0.0)
    with pytest.raises(ValueError):
        descida_de_gradiente(g, 1, 10, taxa=0)
    with pytest.raises(ValueError):
        descida_de_gradiente(g, 1, 10, epocas=0)
    with pytest.raises(ValueError):
        descida_de_gradiente(g, 1, 10, lote=0)


# ------------------------------------------- as lições, como asserções

def test_a_licao_1_l1_zera_coeficientes_e_l2_apenas_encolhe():
    """A diferença entre L1 e L2, medida — não afirmada.

    Dados com 2 atributos úteis e 8 de puro ruído. L2 encolhe todos os dez;
    L1 elimina a maioria dos inúteis, virando também seleção de atributos.
    """
    rng = random.Random(3)
    X, y = [], []
    for _ in range(500):
        a, b = rng.uniform(-2, 2), rng.uniform(-2, 2)
        ruido = [rng.gauss(0, 1) for _ in range(8)]
        X.append([a, b] + ruido)
        y.append(1.0 if 2 * a + b > 0 else 0.0)

    l2 = RegressaoLogistica(taxa=0.5, epocas=300, l2=0.05).fit(X, y)
    l1 = RegressaoLogistica(taxa=0.5, epocas=300, l1=0.05).fit(X, y)

    assert l2.coeficientes_nao_nulos() == 10, "L2 encolhe, mas não zera"
    assert l1.coeficientes_nao_nulos() < 10, "L1 deveria zerar alguns"
    # e zera preferencialmente os inúteis, não os úteis
    assert l1.pesos[0] != 0.0 and l1.pesos[1] != 0.0
    zerados_ruido = sum(1 for w in l1.pesos[2:] if w == 0.0)
    assert zerados_ruido >= 4, f"esperava eliminar ruído, eliminou {zerados_ruido}/8"


def test_a_licao_2_padronizar_muda_o_gradiente_e_nao_muda_a_arvore():
    """Por que o capítulo 03 manda padronizar para modelos com gradiente.

    Com atributos em escalas muito diferentes, o gradiente zigue-zagueia e a
    mesma taxa que funcionava passa a não funcionar.
    """
    rng = random.Random(5)
    X, y = [], []
    for _ in range(300):
        pequeno = rng.uniform(-1, 1)
        gigante = rng.uniform(-10000, 10000)     # 4 ordens de grandeza acima
        X.append([pequeno, gigante])
        y.append(1.0 if pequeno + gigante / 10000 > 0 else 0.0)

    com = RegressaoLogistica(taxa=0.5, epocas=200, padronizar=True).fit(X, y)
    sem = RegressaoLogistica(taxa=0.5, epocas=200, padronizar=False).fit(X, y)

    acerto = lambda m: sum(1 for a, b in zip(y, m.predict(X)) if a == b) / len(y)
    assert acerto(com) > acerto(sem) + 0.05


def test_a_licao_3_early_stopping_e_regularizacao_de_graca():
    """Parar cedo não é só economia de tempo — muda o modelo que sai.

    Com dados ruidosos, o modelo que treina até o fim ajusta mais o ruído.
    """
    rng = random.Random(13)
    X, y = [], []
    for _ in range(200):
        a = rng.uniform(-2, 2)
        ruido = [rng.gauss(0, 1) for _ in range(15)]
        X.append([a] + ruido)
        y.append(1.0 if a + rng.gauss(0, 0.6) > 0 else 0.0)

    corte = int(len(X) * 0.7)
    Xt, yt, Xv, yv = X[:corte], y[:corte], X[corte:], y[corte:]

    ate_o_fim = RegressaoLogistica(taxa=0.5, epocas=3000).fit(Xt, yt)
    parando = RegressaoLogistica(taxa=0.5, epocas=3000, paciencia=8,
                                 validacao=(Xv, yv)).fit(Xt, yt)

    assert parando.historico.epocas < ate_o_fim.historico.epocas
    norma = lambda m: sum(w * w for w in m.pesos)
    assert norma(parando) <= norma(ate_o_fim), (
        "parar cedo deveria deixar os pesos menores — é o efeito regularizador"
    )
