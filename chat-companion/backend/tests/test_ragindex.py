"""O índice do tutor — e a numeração que ele não pode inventar.

Nasceu de uma falha em sala. Perguntaram ao tutor qual é o capítulo do neurônio
artificial e ele respondeu **"Capítulo 18"**, citando `livro/HISTORICO.md`.
Depois do ADR 0011 o capítulo é **III.1**, e a posição de leitura é 17 — o 18
não existe em lugar nenhum do livro atual. Três causas somadas:

  1. o HISTORICO entrava no corpus com o mesmo peso de um capítulo, e ele guarda
     numeração de edições antigas POR CONSTRUÇÃO;
  2. os blocos não carregavam a identidade do capítulo em que vivem, então a
     pergunta sobre um capítulo não recuperava esse capítulo;
  3. `buscar()` devolvia caminho de arquivo e título de seção, e nunca o nome
     canônico — o modelo tinha de deduzir a numeração do texto.

Estes testes cobram as três.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from ragindex import BookIndex, _FORA_DO_CORPUS, _mapa_de_capitulos  # noqa: E402

RAIZ = Path(__file__).resolve().parents[3]

pytestmark = pytest.mark.skipif(
    not (RAIZ / "livro").is_dir(), reason="precisa do repositório completo")


@pytest.fixture(scope="module")
def indice():
    return BookIndex(RAIZ, corpus_path=None)


# ------------------------------------------- 1. registro histórico fora

def test_historico_nao_entra_no_corpus(indice):
    """Registro do passado não responde pelo presente.

    Editar o HISTORICO não resolveria: ele existe para guardar o que o livro
    JÁ FOI, e cada edição nova acrescenta numeração que envelhece.
    """
    fontes = {b["fonte"] for b in indice.blocos}
    assert "livro/HISTORICO.md" not in fontes
    assert not any(Path(f).name in _FORA_DO_CORPUS for f in fontes)


def test_capitulos_de_verdade_continuam_no_corpus(indice):
    """A exclusão é estreita — tirar demais quebraria o tutor."""
    fontes = {b["fonte"] for b in indice.blocos}
    assert "livro/capitulos/iii-1-neuronio-artificial.md" in fontes
    assert "livro/glossario.md" in fontes
    assert len(indice.blocos) > 1000


# --------------------------------- 2. o bloco sabe de que capítulo é

def test_todo_bloco_de_capitulo_carrega_a_identidade(indice):
    alvo = [b for b in indice.blocos
            if b["fonte"] == "livro/capitulos/iii-1-neuronio-artificial.md"]
    assert alvo, "o capítulo do neurônio sumiu do índice"
    for b in alvo:
        assert "III.1" in b["capitulo"], f"bloco sem capítulo: {b['titulo']!r}"


def test_o_mapa_vem_do_sumario_e_nao_de_texto_solto():
    mapa = _mapa_de_capitulos(RAIZ)
    assert mapa, "sem sumário não há numeração vigente — o tutor volta a adivinhar"
    assert "III.1" in mapa["livro/capitulos/iii-1-neuronio-artificial.md"]


# ------------------------- 3. a pergunta de navegação acha o capítulo

@pytest.mark.parametrize("pergunta,arquivo", [
    ("Qual o capítulo do neurônio artificial?", "livro/capitulos/iii-1-neuronio-artificial.md"),
    ("onde está regressão logística?", "livro/capitulos/ii-3-regressao-logistica.md"),
])
def test_perguntar_por_um_capitulo_recupera_esse_capitulo(indice, pergunta, arquivo):
    assert arquivo in {a["fonte"] for a in indice.buscar(pergunta, 3)}


def test_buscar_entrega_a_numeracao_vigente_ao_modelo(indice):
    """O que o modelo não recebe, ele inventa — foi exatamente o que houve."""
    achados = indice.buscar("Qual o capítulo do neurônio artificial?", 3)
    cap = next(a["capitulo"] for a in achados
               if a["fonte"] == "livro/capitulos/iii-1-neuronio-artificial.md")
    assert "III.1" in cap
    assert "Parte III" in cap
    assert "18" not in cap  # a numeração de criação não pode voltar por nenhuma via
