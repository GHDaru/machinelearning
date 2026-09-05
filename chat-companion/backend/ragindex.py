"""Índice leve de busca no texto do livro — sem dependências, sem rede.

O tutor responde do livro (Princípio I: evidência). Este módulo carrega os
Markdown de `livro/` (+ o README da trilha `ml-zero`), quebra em blocos por
cabeçalho/parágrafo e pontua por sobreposição de termos.

Nota didática: isto é deliberadamente **não** um índice de embeddings. É a
linha de base honesta — a mesma que o capítulo 12 manda medir antes de trocar
por um vetor denso. Quando o livro chegar lá, esta classe é o "antes" da
comparação, e a troca acontece exatamente aqui, atrás da mesma interface.
"""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from typing import Optional

_STOP = set("de da do das dos a o e que em para com sem por no na nos nas um uma os as "
            "se ao à é são como mais ou seu sua the of to and in is a an".split())

# Documentos que registram o PASSADO ou o processo — não são conteúdo do livro.
#
# O HISTORICO é o caso que doeu, e doeu em sala: perguntaram ao tutor qual é o
# capítulo do neurônio artificial e ele respondeu "Capítulo 18", citando o
# histórico. Aquele arquivo guarda a numeração de edições antigas POR
# CONSTRUÇÃO — depois do ADR 0011 o capítulo é III.1 —, então servi-lo como
# resposta atual não é acidente que se conserte editando o texto: é garantia de
# erro que cresce a cada edição.
_FORA_DO_CORPUS = {"HISTORICO.md", "GUIA-EDITORIAL.md", "BANCO-DE-EXERCICIOS.md"}

# As provas saem INTEIRAS do corpus (ADR 0014). Uma prova é evento sincronizado
# e mede recuperação sem rota de volta; um tutor que responde a partir da página
# da prova é a rota de volta, aberta durante a prova. O enunciado continua
# público no Markdown, e é isso que a ADR já assumia — o que não pode existir é
# quem o sirva sob demanda com a resposta junto.
_PASTAS_FORA_DO_CORPUS = ("livro/provas/",)

# O gabarito NUNCA entra no corpus, nem o de exercício de capítulo.
#
# O índice lia o Markdown cru linha a linha, então `> **gabarito:** 0,70` virava
# bloco recuperável como qualquer parágrafo. É a mesma falha do botão "⬇ md",
# que exportava 79 gabaritos e 30 rubricas ao lado do exercício: o livro protege
# o HTML com cuidado, e servia a resposta pela porta do lado. Aqui a porta era o
# tutor. Princípio VIII.2: o leitor recebe a pista, não a resposta.
_LINHA_SEGREDO = re.compile(r"^>?\s*\*\*(gabarito|porque|rubrica|volte para)[:\*]", re.I)


def _mapa_de_capitulos(repo_root) -> dict:
    """`arquivo` -> "Parte III … · III.1 — O Neurônio Artificial".

    Sem isto, os blocos de um capítulo não carregam a identidade dele: só o
    bloco do H1 continha o nome. Resultado medido — a pergunta "qual o capítulo
    do neurônio artificial?" não recuperava o capítulo do neurônio artificial,
    e o tutor respondia com o que sobrasse no topo do ranking.
    """
    try:
        bruto = (Path(repo_root) / "publicar" / "sumario.json").read_text(encoding="utf-8")
        sumario = json.loads(bruto)
    except (OSError, ValueError):
        return {}
    mapa = {}
    for parte in sumario.get("partes", []):
        for item in parte.get("itens", []):
            if item.get("arquivo"):
                mapa[item["arquivo"]] = f"{parte.get('nome', '')} · {item.get('titulo', '')}".strip(" ·")
    return mapa


def _norm(txt: str) -> list[str]:
    txt = unicodedata.normalize("NFD", txt.lower())
    txt = "".join(c for c in txt if unicodedata.category(c) != "Mn")
    return [t for t in re.findall(r"[a-z0-9]+", txt) if t not in _STOP and len(t) > 2]


class BookIndex:
    def __init__(self, repo_root: Path, corpus_path: Optional[Path] = None) -> None:
        """Carrega do `corpus.json` empacotado se existir (caso do container
        isolado); senão varre `livro/` ao vivo (dev / repo completo)."""
        self.blocos: list[dict] = []
        if corpus_path and Path(corpus_path).exists():
            self._carregar_corpus(Path(corpus_path))
        elif (Path(repo_root) / "livro").is_dir():
            self._carregar(repo_root)

    def _carregar_corpus(self, path: Path) -> None:
        try:
            dados = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            return
        for b in dados:
            cap = b.get("capitulo", "")
            self.blocos.append({"fonte": b["fonte"], "titulo": b["titulo"], "texto": b["texto"],
                                "capitulo": cap,
                                "termos": _norm(cap + " " + b["titulo"] + " " + b["texto"])})

    def exportar(self, path: Path) -> int:
        """Grava o corpus (sem os termos — recomputados no load) para empacotar."""
        dados = [{"fonte": b["fonte"], "titulo": b["titulo"], "texto": b["texto"],
                  "capitulo": b.get("capitulo", "")}
                 for b in self.blocos]
        Path(path).write_text(json.dumps(dados, ensure_ascii=False), encoding="utf-8")
        return len(dados)

    def _carregar(self, repo_root: Path) -> None:
        fontes = sorted(
            p for p in (repo_root / "livro").rglob("*.md")
            if p.name not in _FORA_DO_CORPUS
            and not p.relative_to(repo_root).as_posix().startswith(_PASTAS_FORA_DO_CORPUS)
        )
        trilha = repo_root / "ml-zero" / "README.md"
        if trilha.exists():
            fontes.append(trilha)
        capitulos = _mapa_de_capitulos(repo_root)
        for f in fontes:
            try:
                texto = f.read_text(encoding="utf-8")
            except OSError:
                continue
            rel = f.relative_to(repo_root).as_posix()
            cap = capitulos.get(rel, "")
            titulo_atual = f.stem
            buffer: list[str] = []

            def flush():
                if buffer:
                    corpo = " ".join(buffer).strip()
                    if len(corpo) > 40:
                        self.blocos.append(
                            {"fonte": rel, "titulo": titulo_atual, "texto": corpo,
                             "capitulo": cap,
                             # o capítulo entra nos termos: todo bloco carrega a
                             # identidade da página em que vive, não só o H1.
                             "termos": _norm(cap + " " + titulo_atual + " " + corpo)})

            # `em_segredo` liga na primeira linha de gabarito/rubrica e só
            # desliga no fim do bloco do exercício. Filtrar linha a linha não
            # bastaria: a explicação continua por vários parágrafos de citação
            # depois do `> **porque:**`, e são justamente eles que entregam a
            # resposta em prosa.
            em_segredo = False
            for linha in texto.splitlines():
                if linha.startswith(":::"):
                    em_segredo = False
                    flush()
                    buffer = []
                    continue
                if _LINHA_SEGREDO.match(linha):
                    em_segredo = True
                    flush()
                    buffer = []
                    continue
                if em_segredo:
                    continue
                if linha.startswith("#"):
                    flush()
                    buffer = []
                    titulo_atual = linha.lstrip("#").strip()
                elif linha.strip():
                    buffer.append(linha.strip())
                else:
                    flush()
                    buffer = []
            flush()

    def buscar(self, query: str, k: int = 4) -> list[dict]:
        termos = set(_norm(query))
        if not termos:
            return []
        pontuados = []
        for b in self.blocos:
            toks = b["termos"]
            if not toks:
                continue
            # COBERTURA antes de FREQUÊNCIA, e o motivo tem data.
            #
            # A linha antiga era `sum(1 for t in toks if t in termos)`, que conta
            # cada REPETIÇÃO. A docstring deste módulo sempre prometeu
            # "sobreposição de termos", que é operação de conjunto; o código
            # media multiconjunto. Enquanto os capítulos tinham tamanhos
            # parecidos, os dois davam quase a mesma ordem e ninguém percebeu.
            #
            # Em 2026-09-04 o capítulo II.2 passou de 7.500 para 15.900 palavras
            # e a diferença apareceu: perguntando "onde está regressão
            # logística?", o tutor devolvia o II.2, que fala de regressão
            # linear e cita a logística de passagem. O capítulo certo, quatro
            # vezes menor, saía do top 3. Volume vencia pertinência.
            #
            # Agora o critério primeiro é quantos termos DISTINTOS da pergunta o
            # bloco cobre, e o desempate é a densidade deles no bloco. Um trecho
            # curto que fala do assunto ganha de um capítulo longo que o menciona.
            achados = termos.intersection(toks)
            if achados:
                densidade = sum(1 for t in toks if t in termos) / len(toks)
                pontuados.append(((len(achados), densidade), b))
        pontuados.sort(key=lambda x: x[0], reverse=True)
        # `capitulo` vai junto: sem ele o modelo recebia caminho de arquivo e
        # título de seção, e tinha de INFERIR como o capítulo se chama. Foi
        # assim que o tutor respondeu "Capítulo 18" para o III.1 — o número
        # veio de um texto histórico, porque o nome atual nunca foi enviado.
        return [{"fonte": b["fonte"], "titulo": b["titulo"],
                 "capitulo": b.get("capitulo", ""),
                 "trecho": b["texto"][:600]} for _, b in pontuados[:k]]
