"""Etapa 02 — divisões honestas e detecção de vazamento.

O capítulo 02 argumenta que a divisão precisa respeitar a estrutura dos dados
e que vazamento não dá erro. Este módulo transforma esses dois argumentos em
código que **falha alto** quando a regra é violada.

A diferença em relação à etapa 00 é a que o capítulo introduz: lá, cada linha
era um sujeito independente e embaralhar era legítimo. Aqui há tempo e grupo,
e embaralhar passa a ser um erro metodológico silencioso.

Só biblioteca padrão. NumPy entra na etapa 05.
"""

from __future__ import annotations

import random
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from typing import Any, Iterable, Optional, Sequence

SEED = 20260805


# --------------------------------------------------------------- vazamento

@dataclass(frozen=True)
class Suspeita:
    """Um indício de vazamento. NÃO é um veredito — é um pedido de investigação."""

    coluna: str
    motivo: str
    forca: float  # 0..1; quanto mais perto de 1, mais grave

    def __str__(self) -> str:
        return f"[{self.forca:.2f}] {self.coluna}: {self.motivo}"


def detectar_vazamento_obvio(colunas: dict[str, Sequence[Any]], y: Sequence[int],
                             limiar_correlacao: float = 0.95,
                             limiar_preenchimento: float = 0.90) -> list[Suspeita]:
    """Procura o vazamento do tipo 1 (alvo disfarçado) por dois sinais.

    **Sinal A — previsibilidade quase perfeita.** Uma coluna que sozinha
    determina o alvo é suspeita: se ela fosse legítima, o problema já estaria
    resolvido e ninguém teria pedido um modelo.

    **Sinal B — preenchimento condicionado ao alvo.** A coluna só está
    preenchida quando o alvo é positivo. É a marca do campo que só passa a
    existir *depois* do evento — `motivo_cancelamento`, `valor_estornado`.

    Nenhum detector automático substitui a pergunta do capítulo ("no instante
    da predição, este valor já existe?"). Isto aqui pega o caso grosseiro, que
    é o que costuma chegar a produção.
    """
    if not y:
        raise ValueError("sem alvo: não há o que checar")
    suspeitas: list[Suspeita] = []

    for nome, valores in colunas.items():
        if len(valores) != len(y):
            raise ValueError(f"coluna '{nome}' tem tamanho diferente do alvo")

        # Sinal A: a melhor regra de decisão de UMA coluna acerta quase tudo?
        acerto = _melhor_acerto_de_uma_coluna(valores, y)
        base = max(Counter(y).values()) / len(y)  # a linha de base trivial (cap. 04)
        if acerto >= limiar_correlacao and acerto > base + 0.05:
            suspeitas.append(Suspeita(
                nome,
                f"sozinha, esta coluna prevê o alvo em {acerto:.1%} dos casos "
                f"(linha de base trivial: {base:.1%}) — bom demais",
                min(1.0, acerto)))

        # Sinal B: o preenchimento coincide com o alvo?
        preenchido = [v is not None and v != "" for v in valores]
        if any(preenchido) and not all(preenchido):
            coincidencia = sum(1 for p, alvo in zip(preenchido, y) if p == bool(alvo)) / len(y)
            # olha os dois sentidos: preenchido↔positivo e preenchido↔negativo
            coincidencia = max(coincidencia, 1 - coincidencia)
            if coincidencia >= limiar_preenchimento:
                suspeitas.append(Suspeita(
                    nome,
                    f"está preenchida exatamente quando o alvo tem certo valor "
                    f"({coincidencia:.1%} de coincidência) — típico de campo "
                    f"criado DEPOIS do evento",
                    coincidencia))

    return sorted(suspeitas, key=lambda s: s.forca, reverse=True)


def _melhor_acerto_de_uma_coluna(valores: Sequence[Any], y: Sequence[int]) -> float:
    """Acurácia da melhor regra possível baseada só nesta coluna.

    Para categóricas (poucos valores distintos), é prever a classe majoritária
    dentro de cada valor. Para numéricas, é o melhor corte por limiar. Ambas
    são o teto do que a coluna sozinha entrega — que é justamente o número que
    revela o alvo disfarçado.
    """
    distintos = set(map(_chave, valores))
    if len(distintos) <= max(20, len(valores) // 50):
        por_valor: dict[Any, Counter] = defaultdict(Counter)
        for v, alvo in zip(valores, y):
            por_valor[_chave(v)][alvo] += 1
        acertos = sum(c.most_common(1)[0][1] for c in por_valor.values())
        return acertos / len(y)

    numeros = [(_num(v), alvo) for v, alvo in zip(valores, y) if _num(v) is not None]
    if len(numeros) < len(y) * 0.5:
        return 0.0
    numeros.sort()
    total_pos = sum(a for _, a in numeros)
    n = len(numeros)
    melhor, pos_ate_aqui = 0.0, 0
    for i, (_, alvo) in enumerate(numeros, start=1):
        pos_ate_aqui += alvo
        # corte aqui: à esquerda prevê 0, à direita prevê 1 (e o inverso)
        certos = (i - pos_ate_aqui) + (total_pos - pos_ate_aqui)
        melhor = max(melhor, certos / n, 1 - certos / n)
    return melhor


def _chave(v: Any) -> Any:
    return "∅" if v is None or v == "" else v


def _num(v: Any) -> Optional[float]:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


# ------------------------------------------------------------- duplicatas

def checar_duplicatas(*conjuntos: Sequence[Sequence[Any]]) -> dict[str, int]:
    """Conta duplicatas exatas dentro e entre conjuntos.

    Duplicata entre treino e teste é o vazamento do tipo 3: o teste deixa de
    medir generalização e passa a medir memória.
    """
    assinaturas = [Counter(tuple(map(str, linha)) for linha in c) for c in conjuntos]
    dentro = sum(sum(n - 1 for n in a.values() if n > 1) for a in assinaturas)
    entre = 0
    for i in range(len(assinaturas)):
        for j in range(i + 1, len(assinaturas)):
            entre += sum(min(assinaturas[i][k], assinaturas[j][k])
                         for k in assinaturas[i].keys() & assinaturas[j].keys())
    return {"duplicatas_dentro": dentro, "duplicatas_entre_conjuntos": entre}


# ---------------------------------------------------------------- divisões

def dividir_por_grupo(grupos: Sequence[Any], frac_treino: float = 0.6,
                      frac_validacao: float = 0.2, seed: int = SEED
                      ) -> tuple[list[int], list[int], list[int]]:
    """Divide por SUJEITO, não por linha. Devolve índices.

    A pergunta que justifica isto é a do capítulo: *o que vai ser novo em
    produção?* Se o sistema atenderá sujeitos nunca vistos, o teste precisa
    conter sujeitos que o treino nunca viu.

    As frações valem sobre os GRUPOS, não sobre as linhas — então os tamanhos
    finais em linhas variam conforme os grupos tenham tamanhos diferentes.
    Isso é honesto e inevitável; fingir o contrário exigiria quebrar grupos.
    """
    _validar_fracoes(frac_treino, frac_validacao)
    unicos = sorted({str(g) for g in grupos})
    rng = random.Random(seed)
    rng.shuffle(unicos)

    n = len(unicos)
    c1 = int(n * frac_treino)
    c2 = c1 + int(n * frac_validacao)
    destino = {}
    for i, g in enumerate(unicos):
        destino[g] = 0 if i < c1 else (1 if i < c2 else 2)

    partes: list[list[int]] = [[], [], []]
    for i, g in enumerate(grupos):
        partes[destino[str(g)]].append(i)
    return partes[0], partes[1], partes[2]


def dividir_por_tempo(tempos: Sequence[Any], frac_treino: float = 0.6,
                      frac_validacao: float = 0.2, guarda: int = 0
                      ) -> tuple[list[int], list[int], list[int]]:
    """Divide cronologicamente: treino no passado, teste no futuro.

    `guarda` é o **intervalo de guarda** — quantos exemplos, no fim de cada
    bloco, são descartados. Existe porque previsão com horizonte h faz os
    últimos h períodos do treino se sobreporem ao início do teste. Perder um
    pedaço do treino é barato; descobrir em produção que a métrica era
    otimista, não.

    Note que NÃO há `seed`: não há aleatoriedade aqui, e essa é a questão.
    Embaralhar uma série é a máquina do tempo que produção não terá.
    """
    _validar_fracoes(frac_treino, frac_validacao)
    if guarda < 0:
        raise ValueError("guarda não pode ser negativa")

    ordem = sorted(range(len(tempos)), key=lambda i: tempos[i])
    n = len(ordem)
    c1 = int(n * frac_treino)
    c2 = c1 + int(n * frac_validacao)

    treino = ordem[:max(0, c1 - guarda)]
    validacao = ordem[c1:max(c1, c2 - guarda)]
    teste = ordem[c2:]
    return treino, validacao, teste


def _validar_fracoes(frac_treino: float, frac_validacao: float) -> None:
    if not 0 < frac_treino < 1 or not 0 <= frac_validacao < 1:
        raise ValueError("frações precisam estar em (0,1)")
    if frac_treino + frac_validacao >= 1:
        raise ValueError("treino + validação precisa deixar espaço para o teste")


def vazou_entre(grupos: Sequence[Any], *particoes: Iterable[int]) -> set[str]:
    """Sujeitos presentes em mais de uma partição — deveria ser sempre vazio.

    Serve como asserção de pipeline: rode depois de dividir, e falhe se voltar
    algo. É a diferença entre acreditar que a divisão está certa e saber.
    """
    vistos: dict[str, int] = {}
    repetidos: set[str] = set()
    for k, indices in enumerate(particoes):
        for i in indices:
            g = str(grupos[i])
            if vistos.setdefault(g, k) != k:
                repetidos.add(g)
    return repetidos


# ----------------------------------------------------------- ficha do dado

@dataclass
class FichaDeDataset:
    """As sete perguntas do capítulo 02, como objeto executável.

    A diferença entre isto e um documento é que um documento é uma promessa e
    isto é um portão: `validar()` levanta se alguma resposta faltar. A ficha
    não é algo que alguém vai escrever depois — é algo sem o qual o pipeline
    não roda.
    """

    nome: str
    quem_coletou: str = ""
    como_entrou: str = ""
    licenca: str = ""
    tem_dado_pessoal: Optional[bool] = None
    como_foi_rotulado: str = ""
    limitacoes_conhecidas: list[str] = field(default_factory=list)
    expira_em: str = ""

    OBRIGATORIAS = ("quem_coletou", "como_entrou", "licenca", "como_foi_rotulado", "expira_em")

    def pendencias(self) -> list[str]:
        faltando = [c for c in self.OBRIGATORIAS if not str(getattr(self, c)).strip()]
        if self.tem_dado_pessoal is None:
            faltando.append("tem_dado_pessoal")
        if not self.limitacoes_conhecidas:
            # "nenhuma conhecida" é uma resposta válida — mas precisa ser dita.
            faltando.append("limitacoes_conhecidas")
        return faltando

    def validar(self) -> "FichaDeDataset":
        pend = self.pendencias()
        if pend:
            raise ValueError(
                f"ficha de '{self.nome}' incompleta: {', '.join(pend)}. "
                "Treinar sem responder é treinar sem saber com o quê (Princípio V)."
            )
        if self.tem_dado_pessoal:
            raise ValueError(
                f"'{self.nome}' declara dado pessoal identificável. Anonimize ou "
                "não use: nenhum dataset com dado pessoal entra no livro (Princípio V)."
            )
        return self
