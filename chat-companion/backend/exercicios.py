"""Correção de exercícios — o coração da interatividade do livro vivo.

A página nunca carrega o gabarito (Princípio VIII.3). Quem corrige é este
módulo, a partir do `banco.json` gerado por `publicar/exercicios.mjs`.

Quatro tipos determinísticos (múltipla, múltipla-multi, numérica, completar) e
um tipo por rubrica (aberta), avaliado pelo LLM contra critérios escritos pelo
autor — nunca contra "o que o modelo acha".

Política de revelação (carga cognitiva, Sweller): errar é parte do ciclo. O
feedback explica o conceito na 1ª tentativa; o gabarito só aparece quando o
leitor acerta ou depois de `TENTATIVAS_ATE_REVELAR` tentativas — assim a
segunda tentativa ainda é uma tentativa, não uma cópia.
"""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from typing import Optional

TENTATIVAS_ATE_REVELAR = 2

BANCO_PATH = Path(__file__).resolve().parent / "banco.json"


class Banco:
    """Índice em memória do banco de exercícios e vídeos."""

    def __init__(self, caminho: Path = BANCO_PATH) -> None:
        self.exercicios: dict[str, dict] = {}
        self.videos: dict[str, dict] = {}
        self._carregar(caminho)

    def _carregar(self, caminho: Path) -> None:
        if not caminho.exists():
            return  # sem banco -> a API responde 404 por exercício; nada quebra
        dados = json.loads(caminho.read_text(encoding="utf-8"))
        self.exercicios = {e["id"]: e for e in dados.get("exercicios", [])}
        self.videos = {v["id"]: v for v in dados.get("videos", [])}

    def get(self, exercicio_id: str) -> Optional[dict]:
        return self.exercicios.get(exercicio_id)

    def por_capitulo(self, capitulo: int) -> list[dict]:
        return [e for e in self.exercicios.values() if e.get("capitulo") == capitulo]

    def resumo(self) -> dict:
        por_cap: dict[int, int] = {}
        for e in self.exercicios.values():
            por_cap[e.get("capitulo", 0)] = por_cap.get(e.get("capitulo", 0), 0) + 1
        return {"exercicios": len(self.exercicios), "videos": len(self.videos),
                "por_capitulo": por_cap}


# ------------------------------------------------------------ normalização

def _normalizar(txt: str) -> str:
    """minúsculas, sem acento, sem pontuação de borda, espaços colapsados."""
    t = unicodedata.normalize("NFD", str(txt).strip().lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"[\s_]+", " ", t)
    return t.strip(" .,;:!?\"'`()[]")


def _num(txt: str) -> Optional[float]:
    m = re.search(r"-?\d+(?:[.,]\d+)?(?:e-?\d+)?", str(txt).replace("%", ""))
    if not m:
        return None
    try:
        return float(m.group(0).replace(",", "."))
    except ValueError:
        return None


# ---------------------------------------------------------------- correção

def _corrigir_multipla(ex: dict, resposta: str) -> tuple[bool, bool]:
    opcoes = ex.get("opcoes", [])
    try:
        idx = int(str(resposta).strip())
    except ValueError:
        return False, False
    if not (0 <= idx < len(opcoes)):
        return False, False
    return bool(opcoes[idx].get("correta")), False


def _corrigir_multi(ex: dict, resposta: str) -> tuple[bool, bool]:
    opcoes = ex.get("opcoes", [])
    certas = {i for i, o in enumerate(opcoes) if o.get("correta")}
    try:
        marcadas = {int(p) for p in str(resposta).split(",") if p.strip() != ""}
    except ValueError:
        return False, False
    if marcadas == certas:
        return True, False
    # parcial: acertou alguma e não marcou nenhuma errada
    parcial = bool(marcadas) and marcadas < certas
    return False, parcial


def _corrigir_numerica(ex: dict, resposta: str) -> tuple[bool, bool]:
    alvo = ex.get("gabarito_num") or {}
    valor, tol = alvo.get("valor"), alvo.get("tolerancia", 0) or 0
    dado = _num(resposta)
    if valor is None or dado is None:
        return False, False
    if abs(dado - valor) <= tol:
        return True, False
    # parcial: dentro do dobro da tolerância (ou 10% quando a tolerância é 0)
    margem = (tol * 2) if tol else abs(valor) * 0.1
    return False, abs(dado - valor) <= margem


def _corrigir_completar(ex: dict, resposta: str) -> tuple[bool, bool]:
    aceitas = [a for a in str(ex.get("gabarito") or "").split("|")]
    dado = _normalizar(resposta)
    return any(dado == _normalizar(a) for a in aceitas if a.strip()), False


PROMPT_RUBRICA = (
    "Você avalia a resposta de um estudante contra critérios escritos pelo autor do livro. "
    "Avalie SOMENTE contra os critérios — não invente exigências nem premie prosa bonita. "
    "Responda em JSON puro, sem cercas de código, no formato: "
    '{{"criterios": [{{"criterio": "<texto do critério>", "atendido": true|false}}], '
    '"comentario": "<2 frases, em português, dizendo o que faltou ou o que ficou bom>"}}\n\n'
    "Pergunta: {enunciado}\n\nCritérios:\n{criterios}\n\nResposta do estudante:\n{resposta}"
)


def _corrigir_aberta(ex: dict, resposta: str, llm) -> dict:
    """Avaliação por rubrica. Sem LLM disponível, devolve avaliação honesta-vazia."""
    criterios = ex.get("criterios") or []
    if llm is None:
        return {"correto": False, "parcial": False, "criterios": [],
                "comentario": "A avaliação por rubrica precisa do modelo, que não está "
                              "configurado nesta publicação. Os critérios do capítulo "
                              "continuam valendo — compare sua resposta com eles."}
    prompt = PROMPT_RUBRICA.format(
        enunciado=ex.get("enunciado", ""),
        criterios="\n".join(f"- {c}" for c in criterios),
        resposta=str(resposta)[:4000],
    )
    try:
        msg = llm.complete([{"role": "user", "content": prompt}], [])
        bruto = (msg or {}).get("content") or ""
        limpo = re.sub(r"^```(?:json)?|```$", "", str(bruto).strip(), flags=re.M).strip()
        dados = json.loads(limpo)
        avaliados = [
            {"criterio": str(c.get("criterio", ""))[:300], "atendido": bool(c.get("atendido"))}
            for c in dados.get("criterios", [])
        ][: len(criterios) or 10]
        atendidos = sum(1 for c in avaliados if c["atendido"])
        total = len(avaliados) or len(criterios) or 1
        return {"correto": atendidos == total, "parcial": 0 < atendidos < total,
                "criterios": avaliados, "comentario": str(dados.get("comentario", ""))[:800]}
    except Exception:
        return {"correto": False, "parcial": False, "criterios": [],
                "comentario": "Não consegui avaliar sua resposta agora. Tente de novo em instantes."}


def corrigir(ex: dict, resposta: str, tentativa: int, llm=None) -> dict:
    """Avalia uma resposta e monta o feedback que o leitor vê.

    `tentativa` é a contagem JÁ INCLUINDO esta (1 na primeira).
    """
    tipo = ex.get("tipo")
    extra: dict = {}

    if tipo == "multipla":
        correto, parcial = _corrigir_multipla(ex, resposta)
    elif tipo == "multipla-multi":
        correto, parcial = _corrigir_multi(ex, resposta)
    elif tipo == "numerica":
        correto, parcial = _corrigir_numerica(ex, resposta)
    elif tipo == "completar":
        correto, parcial = _corrigir_completar(ex, resposta)
    elif tipo == "aberta":
        r = _corrigir_aberta(ex, resposta, llm)
        correto, parcial = r["correto"], r["parcial"]
        extra = {"criterios": r["criterios"], "comentario": r["comentario"]}
    else:
        raise ValueError(f"tipo de exercício desconhecido: {tipo}")

    revelar = correto or tentativa >= TENTATIVAS_ATE_REVELAR
    partes: list[str] = []
    if extra.get("comentario"):
        partes.append(extra["comentario"])
    if revelar:
        partes.append(ex.get("porque") or "")
        gab = _texto_do_gabarito(ex)
        if gab and not correto:
            partes.append(f"**Resposta esperada:** {gab}")
    else:
        partes.append(
            "Ainda não. Releia a seção indicada e tente outra vez — na próxima tentativa "
            "eu explico o raciocínio completo."
        )

    return {
        "correto": correto,
        "parcial": parcial,
        "tentativa": tentativa,
        "revelado": revelar,
        "pontos": ex.get("pontos", 1) if correto else 0,
        "feedback": "\n\n".join(p for p in partes if p).strip(),
        "volte_para": ex.get("volte_para") if not correto else None,
        "criterios": extra.get("criterios"),
        "objetivo": ex.get("objetivo"),
    }


def _texto_do_gabarito(ex: dict) -> str:
    tipo = ex.get("tipo")
    if tipo in ("multipla", "multipla-multi"):
        certas = [o["texto"] for o in ex.get("opcoes", []) if o.get("correta")]
        return " · ".join(certas)
    if tipo == "completar":
        return str(ex.get("gabarito") or "").split("|")[0].strip()
    if tipo == "numerica":
        return str(ex.get("gabarito") or "")
    return ""
