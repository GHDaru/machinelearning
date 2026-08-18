"""O painel do professor: quem entra, e o que acontece com quem não entra.

A promessa que estes testes cobram é a do ADR 0021: a PÁGINA é pública — é um
arquivo estático e não tem como não ser — mas nenhum dado de aluno atravessa a
fronteira do servidor sem credencial conferida a cada requisição.
"""
import importlib
import os

import pytest
from fastapi.testclient import TestClient

TOKEN = "token-de-teste"
USER = "professor"
SENHA = "uma frase longa o suficiente"


@pytest.fixture()
def cli(monkeypatch):
    monkeypatch.setenv("ADMIN_TOKEN", TOKEN)
    monkeypatch.setenv("ADMIN_USER", USER)
    monkeypatch.setenv("ADMIN_PASSWORD", SENHA)
    import config
    importlib.reload(config)
    import app
    importlib.reload(app)
    return TestClient(app.app)


def entrar(cli, usuario=USER, senha=SENHA):
    return cli.post("/admin/login", json={"usuario": usuario, "senha": senha})


def test_login_devolve_token_de_sessao(cli):
    r = entrar(cli)
    assert r.status_code == 200
    d = r.json()
    assert d["token"] and d["expira_em"] > 0
    # o token NÃO é o segredo mestre: se vazar, expira sozinho
    assert d["token"] != TOKEN


def test_senha_errada_e_usuario_errado_dao_a_mesma_resposta(cli):
    """Distinguir os dois entrega metade do segredo a quem está adivinhando."""
    a = entrar(cli, senha="errada")
    b = entrar(cli, usuario="ninguem")
    assert a.status_code == b.status_code == 403
    assert a.json() == b.json()


def test_a_senha_nunca_volta_na_resposta(cli):
    for r in (entrar(cli), entrar(cli, senha="errada")):
        assert SENHA not in r.text
        assert TOKEN not in r.text


def test_a_sessao_abre_a_porta_da_turma(cli):
    tok = entrar(cli).json()["token"]
    r = cli.get("/turma/QUALQUER", headers={"Authorization": f"Bearer {tok}"})
    assert r.status_code == 200


def test_sem_credencial_nenhum_dado_sai(cli):
    """A garantia real do ADR 0021, nas três rotas de admin."""
    for rota in ("/turma/QUALQUER", "/telemetry", "/suggestions"):
        assert cli.get(rota).status_code == 403
        assert cli.get(rota, headers={"Authorization": "Bearer inventado"}).status_code == 403


def test_token_adulterado_nao_passa(cli):
    tok = entrar(cli).json()["token"]
    payload, _, _assin = tok.rpartition(":")
    # trocar o usuário mantendo a assinatura antiga
    forjado = payload.replace(USER, "invasor") + ":" + _assin
    assert cli.get("/turma/X", headers={"Authorization": f"Bearer {forjado}"}).status_code == 403


def test_sessao_expirada_nao_passa(cli, monkeypatch):
    import app
    tok = entrar(cli).json()["token"]
    monkeypatch.setattr(app.time, "time", lambda: 10 ** 12)  # muito depois
    assert cli.get("/turma/X", headers={"Authorization": f"Bearer {tok}"}).status_code == 403


def test_forca_bruta_esbarra_no_limite(cli):
    vistos = {entrar(cli, senha=f"tentativa-{i}").status_code for i in range(12)}
    assert 429 in vistos, "sem teto, a senha é adivinhável em paralelo"


def test_painel_nao_configurado_falha_fechado(monkeypatch):
    """Sem ADMIN_USER/ADMIN_PASSWORD no ambiente, ninguém entra — nem por acaso."""
    monkeypatch.setenv("ADMIN_TOKEN", TOKEN)
    monkeypatch.delenv("ADMIN_USER", raising=False)
    monkeypatch.delenv("ADMIN_PASSWORD", raising=False)
    import config, app
    importlib.reload(config)
    importlib.reload(app)
    c = TestClient(app.app)
    assert c.post("/admin/login", json={"usuario": "", "senha": ""}).status_code == 503
