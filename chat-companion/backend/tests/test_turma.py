"""Identificação por turma (ADR 0008).

O que estes testes protegem, em ordem de importância:
  1. Ninguém é identificado sem digitar o comando — o padrão é anônimo.
  2. O professor vê resultado, NUNCA o texto das respostas nem a conversa.
     A mensagem de confirmação promete isso ao aluno; o teste cobra.
  3. Sair desfaz, e apagar a sessão apaga também o vínculo.
  4. O comando funciona sem o modelo — é código, não prompt.
"""

import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("ADMIN_TOKEN", "token-de-teste")
import app as app_mod  # noqa: E402
import turma as turma_mod  # noqa: E402

TOKEN = "token-de-teste"


@pytest.fixture()
def cli():
    app_mod.config.ADMIN_TOKEN = TOKEN
    from store import MemoryStore
    app_mod._store = MemoryStore()
    return TestClient(app_mod.app)


def chat(cli, sid, msg):
    r = cli.post("/chat", json={"session_id": sid, "message": msg})
    assert r.status_code == 200, r.text
    return r.json()["reply"]


# ---------------------------------------------------------------- o parser

@pytest.mark.parametrize("msg,turma,aluno", [
    ("/turma AP2026-2 123456", "AP2026-2", "123456"),
    ("turma AP2026-2 123456", "AP2026-2", "123456"),
    ("/TURMA ap2026 Maria Silva", "ap2026", "Maria Silva"),
    ("/turma AP2026 matricula 123456", "AP2026", "123456"),
    ("/turma AP2026 matrícula: 123456", "AP2026", "123456"),
])
def test_reconhece_as_formas_que_o_aluno_vai_digitar(msg, turma, aluno):
    d = turma_mod.detectar(msg)
    assert d == {"acao": "entrar", "turma": turma, "aluno": aluno}


@pytest.mark.parametrize("msg", [
    "o que é uma turma?",
    "como funciona a turma de análise preditiva",
    "quero entender regressão linear",
    "",
])
def test_nao_confunde_conversa_com_comando(msg):
    """A frase precisa COMEÇAR com o comando. 'o que é uma turma?' é pergunta."""
    assert turma_mod.detectar(msg) is None


# ------------------------------------------------------- o padrão é anônimo

def test_sem_comando_ninguem_e_identificado(cli):
    cli.post("/exercicio/tentativa",
             json={"session_id": "s1", "exercicio_id": "05-e1", "resposta": "qualquer"})
    assert cli.get("/identificacao", params={"session_id": "s1"}).json()["identificacao"] is None
    r = cli.get("/turma/AP2026", params={"token": TOKEN}).json()
    assert r["progresso"] == []


def test_turma_sozinho_explica_e_nao_identifica(cli):
    reply = chat(cli, "s1", "/turma")
    assert "anônimo" in reply
    assert "/turma sair" in reply
    assert cli.get("/identificacao", params={"session_id": "s1"}).json()["identificacao"] is None


# ------------------------------------------------------------ o fluxo feliz

def test_identifica_e_o_professor_ve_o_progresso(cli):
    reply = chat(cli, "s1", "/turma AP2026-2 123456")
    assert "123456" in reply and "AP2026-2" in reply

    # duas tentativas erradas e uma certa em outro exercício
    for _ in range(2):
        cli.post("/exercicio/tentativa",
                 json={"session_id": "s1", "exercicio_id": "05-e1", "resposta": "errada"})

    r = cli.get("/turma/AP2026-2", params={"token": TOKEN}).json()
    assert r["alunos"] == 1
    linha = r["progresso"][0]
    assert linha["aluno"] == "123456"
    assert linha["exercicios_tentados"] == 1
    assert linha["tentativas"] == 2


def test_o_professor_nao_ve_resposta_nem_conversa(cli):
    """A promessa da mensagem de confirmação, cobrada em teste."""
    chat(cli, "s1", "/turma AP2026 123456")
    chat(cli, "s1", "uma pergunta qualquer para o tutor")
    cli.post("/exercicio/tentativa",
             json={"session_id": "s1", "exercicio_id": "05-e1",
                   "resposta": "TEXTO-SECRETO-DA-RESPOSTA"})

    bruto = cli.get("/turma/AP2026", params={"token": TOKEN}).text
    assert "TEXTO-SECRETO" not in bruto
    assert "pergunta qualquer" not in bruto

    csv = cli.get("/turma/AP2026", params={"token": TOKEN, "formato": "csv"}).text
    assert "TEXTO-SECRETO" not in csv
    assert csv.splitlines()[0] == "aluno,resolvidos,exercicios_tentados,tentativas,de_primeira,capitulos,videos"


def test_duas_sessoes_do_mesmo_aluno_viram_uma_linha(cli):
    """Laboratório e celular são duas sessões anônimas. A pessoa é uma."""
    for sid in ("lab", "celular"):
        chat(cli, sid, "/turma AP2026 123456")
        cli.post("/exercicio/tentativa",
                 json={"session_id": sid, "exercicio_id": "05-e1", "resposta": "errada"})

    r = cli.get("/turma/AP2026", params={"token": TOKEN}).json()
    assert r["alunos"] == 1
    assert r["progresso"][0]["tentativas"] == 2


# ------------------------------------------------------------- desfazer

def test_sair_desfaz(cli):
    chat(cli, "s1", "/turma AP2026 123456")
    reply = chat(cli, "s1", "/turma sair")
    assert "anônima" in reply
    assert cli.get("/identificacao", params={"session_id": "s1"}).json()["identificacao"] is None
    assert cli.get("/turma/AP2026", params={"token": TOKEN}).json()["progresso"] == []


def test_apagar_a_sessao_apaga_o_vinculo(cli):
    chat(cli, "s1", "/turma AP2026 123456")
    cli.delete("/session/s1")
    assert cli.get("/turma/AP2026", params={"token": TOKEN}).json()["progresso"] == []


# --------------------------------------------------------------- proteção

@pytest.mark.parametrize("params", [{}, {"token": "errado"}])
def test_turma_exige_token_do_professor(cli, params):
    chat(cli, "s1", "/turma AP2026 123456")
    assert cli.get("/turma/AP2026", params=params).status_code == 403


def test_funciona_sem_modelo(cli, monkeypatch):
    """É código, não prompt: com o LLM quebrado, o comando responde igual."""
    def explode(*a, **k):
        raise RuntimeError("modelo fora do ar")
    monkeypatch.setattr(app_mod, "run_turn", explode)

    assert "AP2026" in chat(cli, "s1", "/turma AP2026 123456")
    r = cli.post("/chat", json={"session_id": "s1", "message": "e uma pergunta normal?"})
    assert r.status_code == 502  # a conversa quebra; a identificação, não
