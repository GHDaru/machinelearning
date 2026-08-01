"""Testes do backend do livro vivo.

Cobrem o caminho feliz e a falha de cada superfície: tutor, prática e
telemetria. Rodam sem rede e sem banco (adapter echo + MemoryStore).

Nota: os testes de correção montam o banco em memória em vez de depender do
`banco.json` gerado — assim testam a REGRA, não o conteúdo de um capítulo
específico (que muda a cada edição do livro vivo).
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import app as appmod  # noqa: E402
from exercicios import corrigir  # noqa: E402
from store import MemoryStore  # noqa: E402
from tools import Tools, _metricas_classificacao  # noqa: E402


@pytest.fixture()
def cliente(monkeypatch):
    """App com store limpo por teste — sessões não vazam entre casos."""
    monkeypatch.setattr(appmod, "_store", MemoryStore())
    return TestClient(appmod.app)


# ------------------------------------------------------------------ básico

def test_health_responde_com_o_estado_das_portas(cliente):
    r = cliente.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["store"] == "memory"
    assert "banco" in body


def test_capabilities_progressivo_esconde_o_que_o_livro_nao_ensinou(cliente):
    r = cliente.get("/capabilities", params={"chapter": 0, "mode": "progressivo"})
    caps = {c["chave"]: c["ativa"] for c in r.json()["capabilities"]}
    assert caps["tutor"] is True          # baseline
    assert caps["exercicios"] is True     # praticar nunca é gated
    assert caps["metricas"] is False      # só a partir do cap. 04


def test_capabilities_avancado_libera_tudo(cliente):
    r = cliente.get("/capabilities", params={"chapter": 0, "mode": "avancado"})
    assert all(c["ativa"] for c in r.json()["capabilities"])


# ----------------------------------------------------- correção (a regra)

EX_MULTIPLA = {
    "id": "t-1", "tipo": "multipla", "capitulo": 4, "objetivo": "O1", "pontos": 1,
    "enunciado": "Qual métrica?", "porque": "Porque a classe é rara.",
    "volte_para": "#metricas",
    "opcoes": [{"correta": False, "texto": "Acurácia"}, {"correta": True, "texto": "AUC-PR"}],
}

EX_MULTI = {
    "id": "t-2", "tipo": "multipla-multi", "capitulo": 2, "objetivo": "O1", "pontos": 2,
    "enunciado": "Quais causam vazamento?", "porque": "Ambas usam o futuro.",
    "opcoes": [{"correta": True, "texto": "normalizar antes de dividir"},
               {"correta": True, "texto": "usar alvo como atributo"},
               {"correta": False, "texto": "fixar a seed"}],
}

EX_NUM = {
    "id": "t-3", "tipo": "numerica", "capitulo": 4, "objetivo": "O2", "pontos": 1,
    "enunciado": "Qual a precisão?", "porque": "vp/(vp+fp).",
    "gabarito": "0.80 ± 0.01", "gabarito_num": {"valor": 0.80, "tolerancia": 0.01},
}

EX_COMPLETAR = {
    "id": "t-4", "tipo": "completar", "capitulo": 6, "objetivo": "O3", "pontos": 1,
    "enunciado": "Complete a lacuna", "porque": "É o termo de penalidade.",
    "gabarito": "regularização|regularizacao",
}


def test_multipla_escolha_certa_e_errada():
    certo = corrigir(EX_MULTIPLA, "1", tentativa=1)
    assert certo["correto"] is True and certo["pontos"] == 1
    assert "classe é rara" in certo["feedback"]     # acertou -> explica logo

    errado = corrigir(EX_MULTIPLA, "0", tentativa=1)
    assert errado["correto"] is False and errado["pontos"] == 0
    assert errado["volte_para"] == "#metricas"


def test_primeira_tentativa_errada_nao_revela_o_gabarito():
    r1 = corrigir(EX_MULTIPLA, "0", tentativa=1)
    assert r1["revelado"] is False
    assert "AUC-PR" not in r1["feedback"]

    r2 = corrigir(EX_MULTIPLA, "0", tentativa=2)
    assert r2["revelado"] is True
    assert "AUC-PR" in r2["feedback"]


def test_multipla_multi_reconhece_acerto_parcial():
    assert corrigir(EX_MULTI, "0,1", tentativa=1)["correto"] is True
    parcial = corrigir(EX_MULTI, "0", tentativa=1)
    assert parcial["correto"] is False and parcial["parcial"] is True
    errado = corrigir(EX_MULTI, "0,2", tentativa=1)          # marcou uma errada
    assert errado["correto"] is False and errado["parcial"] is False


def test_numerica_respeita_a_tolerancia_e_marca_quase():
    assert corrigir(EX_NUM, "0.805", tentativa=1)["correto"] is True
    quase = corrigir(EX_NUM, "0.815", tentativa=1)
    assert quase["correto"] is False and quase["parcial"] is True
    assert corrigir(EX_NUM, "0.5", tentativa=1)["parcial"] is False
    assert corrigir(EX_NUM, "sei lá", tentativa=1)["correto"] is False


def test_completar_ignora_acento_caixa_e_espaco():
    for resposta in ("regularização", "REGULARIZACAO", "  Regularização  "):
        assert corrigir(EX_COMPLETAR, resposta, tentativa=1)["correto"] is True
    assert corrigir(EX_COMPLETAR, "normalização", tentativa=1)["correto"] is False


def test_aberta_sem_llm_nao_finge_ter_avaliado():
    ex = {"id": "t-5", "tipo": "aberta", "capitulo": 1, "objetivo": "O1", "pontos": 3,
          "enunciado": "Explique overfitting.", "porque": "Ver seção X.",
          "criterios": ["cita generalização", "cita dados de teste"]}
    r = corrigir(ex, "É quando o modelo decora.", tentativa=1, llm=None)
    assert r["correto"] is False
    assert "não está configurado" in r["feedback"]


# ------------------------------------------------------------ rotas de prática

@pytest.fixture()
def com_banco(cliente, monkeypatch):
    """Injeta um banco determinístico nas rotas."""
    banco = appmod._banco
    monkeypatch.setattr(banco, "exercicios", {EX_MULTIPLA["id"]: EX_MULTIPLA})
    monkeypatch.setattr(banco, "videos", {"t-v1": {"id": "t-v1", "capitulo": 4}})
    return cliente


def test_tentativa_registra_progresso_e_conta_as_tentativas(com_banco):
    corpo = {"session_id": "s1", "exercicio_id": "t-1", "resposta": "0", "capitulo": 4}
    r1 = com_banco.post("/exercicio/tentativa", json=corpo)
    assert r1.status_code == 200 and r1.json()["tentativa"] == 1

    r2 = com_banco.post("/exercicio/tentativa", json=corpo)
    assert r2.json()["tentativa"] == 2 and r2.json()["revelado"] is True

    r3 = com_banco.post("/exercicio/tentativa", json={**corpo, "resposta": "1"})
    assert r3.json()["correto"] is True

    prog = com_banco.get("/progresso", params={"session_id": "s1"}).json()
    assert prog["resolvidos"] == 1
    assert prog["exercicios"]["t-1"]["tentativas"] == 3


def test_exercicio_desconhecido_e_resposta_vazia_falham_claramente(com_banco):
    r = com_banco.post("/exercicio/tentativa",
                       json={"session_id": "s", "exercicio_id": "nao-existe", "resposta": "1"})
    assert r.status_code == 404
    r = com_banco.post("/exercicio/tentativa",
                       json={"session_id": "s", "exercicio_id": "t-1", "resposta": "   "})
    assert r.status_code == 400


def test_listagem_de_exercicios_nunca_vaza_gabarito(com_banco):
    body = com_banco.get("/exercicios").json()
    assert body["total"] == 1
    campos = set(body["exercicios"][0])
    assert "opcoes" not in campos and "gabarito" not in campos and "porque" not in campos


def test_video_visto_e_idempotente(com_banco):
    corpo = {"session_id": "s2", "video_id": "t-v1", "capitulo": 4}
    assert com_banco.post("/video/visto", json=corpo).status_code == 200
    assert com_banco.post("/video/visto", json=corpo).status_code == 200
    assert com_banco.get("/progresso", params={"session_id": "s2"}).json()["videos"] == ["t-v1"]
    assert com_banco.post("/video/visto",
                          json={**corpo, "video_id": "fantasma"}).status_code == 404


def test_apagar_a_sessao_apaga_o_progresso(com_banco):
    com_banco.post("/exercicio/tentativa",
                   json={"session_id": "s3", "exercicio_id": "t-1", "resposta": "1"})
    assert com_banco.get("/progresso", params={"session_id": "s3"}).json()["resolvidos"] == 1
    com_banco.delete("/session/s3")
    depois = com_banco.get("/progresso", params={"session_id": "s3"}).json()
    assert depois["resolvidos"] == 0 and depois["exercicios"] == {}


# -------------------------------------------------------------- telemetria

def test_telemetria_so_grava_com_consentimento(cliente):
    cliente.post("/session", json={"session_id": "s4"})
    assert cliente.post("/telemetry", json={"session_id": "s4", "slug": "04-avaliacao"}).json()["ok"] is False
    cliente.post("/consent", json={"session_id": "s4", "versao": "v1"})
    assert cliente.post("/telemetry", json={"session_id": "s4", "slug": "04-avaliacao"}).json()["ok"] is True
    publico = cliente.get("/telemetry/publico").json()
    assert publico["por_pagina"]["04-avaliacao"] == 1


def test_telemetria_admin_exige_token(cliente):
    assert cliente.get("/telemetry").status_code == 403


def test_publico_nao_expoe_sessoes(cliente):
    body = cliente.get("/telemetry/publico").json()
    assert "ultimos" not in body and "sessions" not in body


# ------------------------------------------------------------------ tutor

def test_chat_responde_e_persiste_o_turno(cliente):
    r = cliente.post("/chat", json={"session_id": "s5", "message": "o que é overfitting?",
                                    "chapter": 1})
    assert r.status_code == 200
    assert "echo" in r.json()["reply"]
    hist = cliente.get("/history", params={"session_id": "s5"}).json()["messages"]
    assert [m["role"] for m in hist] == ["user", "assistant"]


def test_chat_recusa_mensagem_vazia(cliente):
    assert cliente.post("/chat", json={"session_id": "s", "message": "  "}).status_code == 400


# ---------------------------------------------------------- tools de ML

def test_metricas_de_classificacao_batem_com_a_conta_a_mao():
    saida = _metricas_classificacao({"vp": 8, "fp": 2, "fn": 4, "vn": 86})
    assert "precisão=0.8000" in saida       # 8/10
    assert "revocação=0.6667" in saida      # 8/12
    assert "acurácia=0.9400" in saida       # 94/100
    # a linha de base trivial é o ponto pedagógico: 88% sem modelo nenhum
    assert "trivial (sempre a classe majoritária)=0.8800" in saida


def test_metricas_avisa_divisao_por_zero_em_vez_de_inventar():
    saida = _metricas_classificacao({"vp": 0, "fp": 0, "fn": 5, "vn": 95})
    assert "indefinido" in saida


def test_tool_nao_habilitada_nao_executa():
    t = Tools(index=appmod._index)
    assert "não está habilitada" in t.executar("calcular", {"expressao": "1+1"}, permitidas=set())
    assert t.executar("calcular", {"expressao": "2*21"}, permitidas={"calcular"}) == "42"


def test_calculadora_recusa_codigo_arbitrario():
    t = Tools(index=appmod._index)
    saida = t.executar("calcular", {"expressao": "__import__('os').system('ls')"},
                       permitidas={"calcular"})
    assert saida.startswith("erro:")
