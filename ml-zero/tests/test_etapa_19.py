"""Testes da etapa 19 — o MLP em dados reais.

Na trilha `ml-zero`, os testes são o gabarito. Aqui eles guardam três coisas
diferentes, e vale separar quais:

1. **O protocolo** — que o split é lido de arquivo e não sorteado, e que as
   linhas de base dão sempre o mesmo número. É o que torna a comparação da turma
   possível: se dois alunos discordam nas linhas de base, um dos dois tem bug de
   protocolo, não modelo melhor.
2. **A ponte com o capítulo** — que `coefs_[0]` tem o formato `entradas × ocultas`
   que o III.2 mandou contar, e que a contagem de parâmetros bate com a regra
   `e × s + s`.
3. **A armadilha** — que treinar sem padronizar piora o resultado, e piora em
   silêncio. Se um dia a biblioteca passar a padronizar sozinha, este teste cai e
   o capítulo precisa ser reescrito.
"""

from __future__ import annotations

import pytest

from conftest import carregar

mlp = carregar("etapa-19", "mlp")


@pytest.fixture(scope="module")
def dados():
    return mlp.carregar()


def test_o_split_vem_de_arquivo_e_nao_do_sorteio(dados):
    """Sortear o split em tempo de execução parece inofensivo e não é: o
    embaralhamento muda entre versões da biblioteca, e aí duas turmas em
    semestres diferentes deixam de ser comparáveis."""
    tamanhos = {n: len(y) for n, (X, y) in dados.items()}
    assert tamanhos == {"treino": 12384, "validacao": 4128, "teste": 4128}
    # e roda duas vezes dando o mesmo — nada de aleatório aqui dentro
    assert {n: len(y) for n, (X, y) in mlp.carregar().items()} == tamanhos


def test_as_linhas_de_base_sao_o_checksum_do_protocolo(dados):
    """Números fixos até a quarta casa. Se mudarem sem que ninguém mexa no
    protocolo de propósito, alguma coisa se moveu por baixo."""
    b = mlp.linhas_de_base(dados)
    assert b["mediana"] == pytest.approx(0.8982, abs=5e-4)
    assert b["linear"] == pytest.approx(0.5271, abs=5e-4)
    # e a linha de base burra tem de ser pior que a linear, senão o problema não
    # tem sinal nenhum e o capítulo inteiro não faz sentido
    assert b["mediana"] > b["linear"]


def test_a_primeira_matriz_tem_o_formato_que_o_capitulo_manda_contar(dados):
    r = mlp.treinar(dados, ocultas=(64,), semente=0, max_iter=60)
    assert r["formato_primeira_matriz"] == (8, 64)
    # a regra do capítulo: e×s + s por camada. (8×64+64) + (64×1+1) = 641
    assert r["parametros"] == 8 * 64 + 64 + 64 * 1 + 1 == 641


def test_a_rede_ganha_da_regressao_linear(dados):
    """Se não ganhasse, o capítulo estaria usando o conjunto errado para
    argumentar que a camada escondida serve para alguma coisa."""
    base = mlp.linhas_de_base(dados)
    r = mlp.cinco_sementes(dados, ocultas=(64,))
    assert r["mediana"] < base["linear"]


def test_nao_padronizar_piora_e_piora_em_silencio(dados):
    """A armadilha que o aluno deve pisar de propósito.

    O ponto pedagógico não é só que piora: é que o resultado cru fica
    INDISTINGUÍVEL da regressão linear, o que produz a conclusão falsa e
    coerente "testei, a rede não ganha neste problema".
    """
    base = mlp.linhas_de_base(dados)
    bom = mlp.cinco_sementes(dados, ocultas=(64,), padronizar=True)
    cru = mlp.cinco_sementes(dados, ocultas=(64,), padronizar=False)
    assert cru["mediana"] > bom["mediana"], "sem padronizar tem de ser pior"
    # o empate com a linear é o que engana
    assert abs(cru["mediana"] - base["linear"]) < 0.05
    # e a instabilidade entre sementes cresce junto
    assert cru["amplitude"] > bom["amplitude"]
