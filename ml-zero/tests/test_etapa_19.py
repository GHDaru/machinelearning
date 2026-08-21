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


# ---------------------------------------------------------------------------
# A rede escrita à mão (rede.py) — o objetivo O3 do capítulo III.2.
#
# Estes testes guardam outra coisa dos de cima. Lá o assunto era o protocolo em
# volta de uma biblioteca; aqui é a CORREÇÃO da retropropagação escrita neste
# repositório. Um sinal trocado ou um fator esquecido não lança exceção: treina
# mal, devagar, e a culpa cai na taxa de aprendizado. Estes testes tiram esse
# defeito do silêncio.
# ---------------------------------------------------------------------------

import numpy as np

rede = carregar("etapa-19", "rede")


def test_a_rede_a_mao_reproduz_o_passo_publicado_no_capitulo():
    """As vinte e uma células da seção "Um passo inteiro, com números".

    O capítulo e o código não podem divergir em silêncio: o aluno confere a conta
    dele contra o texto, e o texto tem de continuar sendo o que o código faz.
    """
    c = rede.reproduzir_o_capitulo()
    assert c["antes"]["h"] == pytest.approx([0.6457, 0.5250], abs=5e-5)
    assert c["antes"]["y"] == pytest.approx(0.5548, abs=5e-5)
    assert c["antes"]["perda"] == pytest.approx(0.1982, abs=5e-5)
    # os nove pesos depois do passo, na ordem da tabela publicada
    assert c["W"][0].ravel().tolist() == pytest.approx([0.5151, 0.2808, -0.4, 0.8], abs=5e-5)
    assert c["b"][0].tolist() == pytest.approx([0.1151, -0.2192], abs=5e-5)
    assert c["W"][1][:, 0].tolist() == pytest.approx([0.6710, -0.6423], abs=5e-5)
    assert c["b"][1].tolist() == pytest.approx([0.3100], abs=5e-5)
    assert c["depois"]["y"] == pytest.approx(0.6027, abs=5e-5)
    assert c["depois"]["perda"] == pytest.approx(0.1578, abs=5e-5)
    assert c["parametros"] == 9


def test_entrada_zerada_nao_recebe_gradiente():
    """A atribuição de culpa do capítulo, virada em asserção. No caso (1,0) os
    pesos de x₂ não participaram do erro, e a regra da cadeia informa isso."""
    c = rede.reproduzir_o_capitulo()
    assert c["gW"][0][1].tolist() == [0.0, 0.0]      # linha de x₂: zerada
    assert all(g != 0 for g in c["gW"][0][0].tolist())  # linha de x₁: mexeu


@pytest.mark.parametrize("tamanhos,ativacao,saida", [
    ([2, 3, 1], "sigmoide", None),
    ([2, 4, 3, 1], "tanh", None),
    ([2, 5, 1], "tanh", "igual"),
])
def test_a_retropropagacao_bate_com_a_diferenca_finita(tamanhos, ativacao, saida):
    """O TESTE QUE SEPARA "não deu erro" DE "está correto".

    Se o gradiente analítico discordar da diferença finita da perda, há defeito
    na conta — e é o único jeito barato de descobrir isso antes de três dias de
    treino ruim.
    """
    r = rede.Rede(tamanhos, ativacao, saida, semente=1)
    pior = rede.conferir_gradiente(r, rede.XOR_X, rede.XOR_Y)
    assert pior < 1e-6, f"erro relativo {pior:.2e} — a retropropagação discorda da diferença finita"


def test_o_vies_e_por_unidade_de_destino_nunca_de_origem():
    """O bug mais comum de quem implementa a rede pela primeira vez. Ele não
    aparece como erro de matemática: aparece como dimensão incompatível, ou pior,
    como uma soma que "funciona" por broadcasting e treina errado."""
    r = rede.Rede([4, 5, 3], "sigmoide", semente=0)
    assert r.W[0].shape == (4, 5) and r.b[0].shape == (5,)
    assert r.W[1].shape == (5, 3) and r.b[1].shape == (3,)
    assert r.parametros == 4 * 5 + 5 + 5 * 3 + 3 == 43   # o número do exercício e2
    # e a rede recusa pesos com a forma errada, em vez de deixar passar
    with pytest.raises(AssertionError):
        rede.Rede([2, 2, 1], pesos=([np.zeros((2, 2)), np.zeros((2, 1))],
                                   [np.zeros(3), np.zeros(1)]))


def test_a_rede_a_mao_fecha_o_xor():
    """Duas unidades escondidas bastam, e a rede escrita aqui prova isso."""
    r = rede.Rede([2, 2, 1], "sigmoide", semente=4)
    r.treinar(rede.XOR_X, rede.XOR_Y, taxa=0.5, epocas=20000, parar_em=0.005)
    p = r.prever(rede.XOR_X)[:, 0]
    assert int(((p >= 0.5) == (rede.XOR_Y == 1)).sum()) == 4
    assert r.perda(rede.XOR_X, rede.XOR_Y) < 0.01


def test_saida_achatada_estraga_a_regressao_sem_lancar_excecao():
    """A armadilha que custou uma medição, e que este teste prende.

    Com `tanh` na saída a rede não pode passar de 1, e o alvo vai a 5. Nada
    quebra: ela treina, a perda desce, e o resultado é PIOR que prever sempre a
    mediana. Saída de regressão é `igual`.
    """
    achatada = rede.california(epocas=40, saida_igual=False)["mae"]
    assert achatada > 0.8982, "com tanh na saída a rede deveria perder até para a mediana"


def test_a_rede_a_mao_chega_perto_da_biblioteca():
    """A ponte nos dois sentidos.

    O `mlp.py` mostra que a biblioteca chega a 0,3878 neste recorte. Se o método
    escrito à mão ficasse muito longe disso, a conclusão honesta seria que a
    implementação tem defeito — e não que "biblioteca é melhor".
    """
    r = rede.california()
    assert r["parametros"] == 641
    assert r["mae"] < 0.5271, "a rede à mão precisa ao menos ganhar da regressão linear"
    assert r["mae"] < 0.45, f"MAE {r['mae']:.4f} — longe demais dos 0,3878 da biblioteca"
