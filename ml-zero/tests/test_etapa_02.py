"""Testes da etapa 02 — divisões honestas e detecção de vazamento.

Os testes são o gabarito da etapa. Vários deles são a afirmação do capítulo 02
escrita como asserção executável: se o texto diz que embaralhar uma série é
fraude metodológica, existe aqui um teste que falha quando alguém embaralha.
"""

from __future__ import annotations

import random

import pytest

from conftest import carregar

_d = carregar("etapa-02", "dados")

FichaDeDataset = _d.FichaDeDataset
checar_duplicatas = _d.checar_duplicatas
detectar_vazamento_obvio = _d.detectar_vazamento_obvio
dividir_por_grupo = _d.dividir_por_grupo
dividir_por_tempo = _d.dividir_por_tempo
vazou_entre = _d.vazou_entre


# ------------------------------------------------------------- vazamento

def test_detecta_alvo_disfarcado_por_previsibilidade_quase_perfeita():
    rng = random.Random(1)
    y = [rng.randint(0, 1) for _ in range(400)]
    colunas = {
        "ruido": [rng.random() for _ in y],
        "motivo_cancelamento_cod": [alvo * 7 + rng.choice([0, 0, 0, 1]) for alvo in y],
    }
    suspeitas = detectar_vazamento_obvio(colunas, y)
    nomes = [s.coluna for s in suspeitas]
    assert "motivo_cancelamento_cod" in nomes
    assert "ruido" not in nomes


def test_detecta_coluna_preenchida_so_quando_o_alvo_e_positivo():
    """Um campo criado depois do evento costuma disparar OS DOIS sinais.

    `valor_estornado` prevê o alvo quase perfeitamente (sinal A) *e* só está
    preenchido quando o alvo é positivo (sinal B). Reportar os dois é o
    comportamento correto: são evidências independentes da mesma suspeita, e
    a segunda é a que explica ao leitor por que a primeira aconteceu.
    """
    y = [1] * 100 + [0] * 100
    colunas = {"valor_estornado": [12.5 if alvo else None for alvo in y]}
    suspeitas = detectar_vazamento_obvio(colunas, y)

    assert {s.coluna for s in suspeitas} == {"valor_estornado"}
    motivos = " ".join(s.motivo for s in suspeitas)
    assert "DEPOIS do evento" in motivos and "bom demais" in motivos


def test_nao_acusa_atributo_legitimo_apenas_util():
    """Falso positivo é caro: um detector que grita sempre é ignorado sempre."""
    rng = random.Random(2)
    y, coluna = [], []
    for _ in range(600):
        x = rng.random()
        # sinal real, mas longe de determinar o alvo
        alvo = 1 if rng.random() < 0.25 + 0.4 * x else 0
        coluna.append(x)
        y.append(alvo)
    assert detectar_vazamento_obvio({"score_util": coluna}, y) == []


def test_alvo_vazio_falha_alto():
    with pytest.raises(ValueError):
        detectar_vazamento_obvio({"a": []}, [])


def test_coluna_de_tamanho_errado_falha_alto():
    with pytest.raises(ValueError):
        detectar_vazamento_obvio({"a": [1, 2]}, [1, 0, 1])


# ------------------------------------------------------------ duplicatas

def test_conta_duplicatas_dentro_e_entre_conjuntos():
    treino = [[1, "a"], [2, "b"], [1, "a"]]
    teste = [[2, "b"], [3, "c"]]
    r = checar_duplicatas(treino, teste)
    assert r["duplicatas_dentro"] == 1          # [1,"a"] repetida no treino
    assert r["duplicatas_entre_conjuntos"] == 1  # [2,"b"] nos dois


def test_conjuntos_limpos_nao_acusam_nada():
    r = checar_duplicatas([[1], [2]], [[3], [4]])
    assert r == {"duplicatas_dentro": 0, "duplicatas_entre_conjuntos": 0}


# -------------------------------------------------------- divisão por grupo

def test_divisao_por_grupo_nunca_parte_um_sujeito():
    grupos = [f"paciente-{i // 5}" for i in range(500)]  # 100 pacientes, 5 linhas cada
    treino, val, teste = dividir_por_grupo(grupos)
    assert vazou_entre(grupos, treino, val, teste) == set()


def test_divisao_por_grupo_preserva_todas_as_linhas():
    grupos = [f"g{i % 37}" for i in range(300)]
    treino, val, teste = dividir_por_grupo(grupos)
    assert sorted(treino + val + teste) == list(range(300))


def test_divisao_por_grupo_e_reprodutivel():
    grupos = [f"g{i % 40}" for i in range(200)]
    assert dividir_por_grupo(grupos, seed=9) == dividir_por_grupo(grupos, seed=9)


def test_divisao_por_grupo_com_seeds_diferentes_muda():
    grupos = [f"g{i % 40}" for i in range(200)]
    assert dividir_por_grupo(grupos, seed=1) != dividir_por_grupo(grupos, seed=2)


# -------------------------------------------------------- divisão por tempo

def test_divisao_por_tempo_poe_todo_o_treino_antes_de_todo_o_teste():
    tempos = list(range(1000))
    random.Random(3).shuffle(tempos)  # ordem de chegada embaralhada de propósito
    treino, val, teste = dividir_por_tempo(tempos)
    assert max(tempos[i] for i in treino) < min(tempos[i] for i in val)
    assert max(tempos[i] for i in val) < min(tempos[i] for i in teste)


def test_intervalo_de_guarda_descarta_o_fim_de_cada_bloco():
    tempos = list(range(1000))
    sem, com = dividir_por_tempo(tempos, guarda=0), dividir_por_tempo(tempos, guarda=30)
    assert len(com[0]) == len(sem[0]) - 30
    assert len(com[2]) == len(sem[2])          # o teste nunca é encurtado
    # e abre-se um vão real entre o fim do treino e o início da validação
    assert min(tempos[i] for i in com[1]) - max(tempos[i] for i in com[0]) > 1


def test_divisao_por_tempo_nao_tem_aleatoriedade():
    """A ausência de `seed` é o ponto: série temporal não se embaralha."""
    tempos = [10, 3, 7, 1, 9, 2, 8, 4, 6, 5] * 20
    assert dividir_por_tempo(tempos) == dividir_por_tempo(tempos)


@pytest.mark.parametrize("t,v", [(0.9, 0.2), (0.0, 0.2), (1.0, 0.0)])
def test_fracoes_invalidas_falham_alto_nas_duas_divisoes(t, v):
    with pytest.raises(ValueError):
        dividir_por_tempo(list(range(50)), frac_treino=t, frac_validacao=v)
    with pytest.raises(ValueError):
        dividir_por_grupo([f"g{i}" for i in range(50)], frac_treino=t, frac_validacao=v)


def test_guarda_negativa_falha_alto():
    with pytest.raises(ValueError):
        dividir_por_tempo(list(range(50)), guarda=-1)


# ------------------------------------------------- a lição da etapa, executável

def test_a_licao_da_etapa_embaralhar_por_linha_vaza_o_sujeito():
    """A afirmação central do capítulo 02, como asserção.

    Com várias linhas por sujeito, a divisão ingênua (embaralhar linhas)
    espalha o mesmo sujeito pelos três conjuntos. A divisão por grupo, não.
    """
    grupos = [f"cliente-{i // 8}" for i in range(800)]  # 100 clientes, 8 linhas cada

    indices = list(range(800))
    random.Random(4).shuffle(indices)
    ingenuo = (indices[:480], indices[480:640], indices[640:])

    assert len(vazou_entre(grupos, *ingenuo)) > 90, "quase todo cliente vaza"
    assert vazou_entre(grupos, *dividir_por_grupo(grupos)) == set()


# ---------------------------------------------------------- ficha do dado

def _ficha_completa(**kw) -> FichaDeDataset:
    base = dict(
        nome="avaliacoes-2026",
        quem_coletou="equipe de dados, 2026-Q1, para treinar sentimento",
        como_entrou="toda avaliação publicada com nota; 3 estrelas descartadas",
        licenca="CC BY 4.0",
        tem_dado_pessoal=False,
        como_foi_rotulado="regra automática: 4-5 estrelas = positiva, 1-2 = negativa",
        limitacoes_conhecidas=["ironia não é capturada pela nota",
                               "casos ambíguos (3 estrelas) foram removidos"],
        expira_em="2027-Q1",
    )
    base.update(kw)
    return FichaDeDataset(**base)


def test_ficha_completa_passa():
    assert _ficha_completa().validar().nome == "avaliacoes-2026"


@pytest.mark.parametrize("campo", ["quem_coletou", "como_entrou", "licenca",
                                   "como_foi_rotulado", "expira_em"])
def test_ficha_incompleta_recusa_e_diz_o_que_falta(campo):
    with pytest.raises(ValueError, match=campo):
        _ficha_completa(**{campo: ""}).validar()


def test_ficha_exige_resposta_explicita_sobre_dado_pessoal():
    with pytest.raises(ValueError, match="tem_dado_pessoal"):
        _ficha_completa(tem_dado_pessoal=None).validar()


def test_nenhuma_limitacao_conhecida_tambem_precisa_ser_dito():
    with pytest.raises(ValueError, match="limitacoes_conhecidas"):
        _ficha_completa(limitacoes_conhecidas=[]).validar()


def test_dado_pessoal_barra_o_dataset():
    with pytest.raises(ValueError, match="dado pessoal"):
        _ficha_completa(tem_dado_pessoal=True).validar()
