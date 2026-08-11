"""CORS: quem pode chamar o backend (ADR 0006).

Este teste existe porque o modo de falha é SILENCIOSO: com CORS errado, o
navegador bloqueia, o widget mostra "não deu para corrigir agora", e os
laboratórios continuam funcionando — mascarando a quebra. Sem teste, só se
descobre em produção, pelo relato de um aluno.
"""

import config
from fastapi.testclient import TestClient

from app import app

cliente = TestClient(app)


def _preflight(origem: str):
    return cliente.options(
        "/health",
        headers={
            "Origin": origem,
            "Access-Control-Request-Method": "GET",
        },
    )


def test_dominio_do_livro_e_aceito():
    r = _preflight("https://machinelearning.ghdaru.com.br")
    assert r.headers.get("access-control-allow-origin") == "https://machinelearning.ghdaru.com.br"


def test_pages_antigo_continua_aceito_durante_a_transicao():
    # Enquanto o stub de redirecionamento não estiver no ar, links antigos
    # ainda carregam o site do Pages. Cortar agora quebraria esses leitores.
    r = _preflight("https://ghdaru.github.io")
    assert r.headers.get("access-control-allow-origin") == "https://ghdaru.github.io"


def test_preview_da_vercel_e_aceito_pelo_regex():
    origem = "https://machinelearning-git-abc123-ghdaru.vercel.app"
    r = _preflight(origem)
    assert r.headers.get("access-control-allow-origin") == origem


def test_origem_desconhecida_e_recusada():
    r = _preflight("https://sitedequalquerum.example")
    assert "access-control-allow-origin" not in {k.lower() for k in r.headers}


def test_regex_nao_e_curinga():
    """Guarda contra alguém 'consertar' o CORS afrouxando o regex."""
    assert config.ALLOWED_ORIGIN_REGEX
    assert config.ALLOWED_ORIGIN_REGEX not in (".*", "^.*$", ".+")
    # Um domínio que só CONTÉM o nome do projeto não pode passar.
    r = _preflight("https://machinelearning-ghdaru.vercel.app.evil.example")
    assert "access-control-allow-origin" not in {k.lower() for k in r.headers}
