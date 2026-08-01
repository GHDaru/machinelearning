"""ToolPort — o registro de tools SEGURAS do companion.

Regra do capítulo 16 (MLOps) aplicada à superfície pública: nada de shell,
nada de leitura arbitrária de disco, nada de rede de saída, nada de execução
de código do leitor. Só tools sandbox, com efeito limitado e previsível.

Cada tool tem schema (dialeto OpenAI) e está amarrada a uma capacidade em
`capabilities.py` — o gating decide quais entram no loop.

As tools de ML aqui não "fazem ML": elas fazem a **aritmética que o leitor
erra**. Calcular precisão e revocação a partir da matriz de confusão é a
operação mais confundida do livro; deixá-la determinística no servidor evita
que o tutor invente um número — que é exatamente o pecado do Princípio I.
"""

from __future__ import annotations

import ast
import operator
from typing import Callable

from ragindex import BookIndex

# ------------------------------------------------------ implementações seguras

# Avaliador aritmético seguro: só números e + - * / ** % ( ) unário. Sem nomes,
# sem chamadas, sem atributos — não é eval() do Python (que seria uma ferida).
_OPS = {
    ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
    ast.Div: operator.truediv, ast.Pow: operator.pow, ast.Mod: operator.mod,
    ast.USub: operator.neg, ast.UAdd: operator.pos,
}


def _eval_no(no: ast.AST) -> float:
    if isinstance(no, ast.Constant) and isinstance(no.value, (int, float)):
        return no.value
    if isinstance(no, ast.BinOp) and type(no.op) in _OPS:
        return _OPS[type(no.op)](_eval_no(no.left), _eval_no(no.right))
    if isinstance(no, ast.UnaryOp) and type(no.op) in _OPS:
        return _OPS[type(no.op)](_eval_no(no.operand))
    raise ValueError("expressão não permitida")


def _calcular(args: dict) -> str:
    expr = str(args.get("expressao", ""))
    try:
        return str(_eval_no(ast.parse(expr, mode="eval").body))
    except Exception as exc:  # erro volta como texto para o modelo decidir
        return f"erro: {exc}"


def _metricas_classificacao(args: dict) -> str:
    """Todas as métricas binárias derivadas da matriz de confusão, de uma vez.

    Devolver o conjunto inteiro (e não só a pedida) é deliberado: o leitor que
    perguntou "qual a precisão?" quase sempre precisa ver a revocação ao lado
    para entender o trade-off do capítulo 04.
    """
    try:
        vp = float(args["vp"]); fp = float(args["fp"])
        fn = float(args["fn"]); vn = float(args["vn"])
    except (KeyError, TypeError, ValueError):
        return "erro: informe vp, fp, fn e vn (números da matriz de confusão)."
    if min(vp, fp, fn, vn) < 0:
        return "erro: contagens não podem ser negativas."
    total = vp + fp + fn + vn
    if total == 0:
        return "erro: matriz vazia."

    def div(a: float, b: float) -> float | None:
        return a / b if b else None

    precisao = div(vp, vp + fp)
    revocacao = div(vp, vp + fn)
    especificidade = div(vn, vn + fp)
    f1 = div(2 * precisao * revocacao, precisao + revocacao) if precisao and revocacao else 0.0
    acuracia = (vp + vn) / total
    base = max(vp + fn, vn + fp) / total  # acurácia da classe majoritária

    def f(x: float | None) -> str:
        return "indefinido (divisão por zero)" if x is None else f"{x:.4f}"

    return (
        f"precisão={f(precisao)} · revocação={f(revocacao)} · F1={f(f1)}\n"
        f"acurácia={f(acuracia)} · especificidade={f(especificidade)}\n"
        f"acurácia do classificador trivial (sempre a classe majoritária)={base:.4f}\n"
        f"prevalência da classe positiva={(vp + fn) / total:.4f}"
    )


def _checar_split(args: dict) -> str:
    """Sanidade de uma divisão treino/validação/teste — a conta que engana."""
    try:
        n = int(args["n_total"])
        treino = float(args.get("frac_treino", 0.7))
        val = float(args.get("frac_validacao", 0.15))
        teste = float(args.get("frac_teste", 0.15))
    except (KeyError, TypeError, ValueError):
        return "erro: informe n_total e as frações de treino/validação/teste."
    soma = treino + val + teste
    linhas = [f"n_total={n} · frações somam {soma:.4f}"]
    if abs(soma - 1.0) > 1e-6:
        linhas.append("⚠ as frações não somam 1 — alguma parte dos dados está sumindo ou repetindo.")
    for nome, fr in (("treino", treino), ("validação", val), ("teste", teste)):
        k = int(round(n * fr))
        aviso = "  ⚠ pequeno demais para uma estimativa estável" if k < 30 else ""
        linhas.append(f"{nome}: ~{k} exemplos{aviso}")
    if teste > 0 and int(round(n * teste)) < 100:
        linhas.append("⚠ com teste < 100 exemplos, o intervalo de confiança da métrica é largo: "
                      "reporte o intervalo, não só o ponto (cap. 04).")
    return "\n".join(linhas)


class Tools:
    """Fecha as tools sobre o índice do livro (dependência injetada)."""

    def __init__(self, index: BookIndex) -> None:
        self._index = index
        self.impls: dict[str, Callable[[dict], str]] = {
            "calcular": _calcular,
            "metricas_classificacao": _metricas_classificacao,
            "checar_split": _checar_split,
            "buscar_no_livro": self._buscar_no_livro,
        }

    def _buscar_no_livro(self, args: dict) -> str:
        achados = self._index.buscar(str(args.get("consulta", "")), k=4)
        if not achados:
            return "nada encontrado no livro para essa consulta."
        return "\n\n".join(f"[{a['fonte']} · {a['titulo']}] {a['trecho']}" for a in achados)

    def schemas_para(self, nomes: set[str]) -> list[dict]:
        """Só os schemas das tools ativas (gating)."""
        todos = {
            "calcular": {"type": "function", "function": {
                "name": "calcular",
                "description": "Avalia uma expressão aritmética segura (+ - * / ** %).",
                "parameters": {"type": "object",
                               "properties": {"expressao": {"type": "string",
                                              "description": "ex.: (2+3)*4"}},
                               "required": ["expressao"]}}},
            "metricas_classificacao": {"type": "function", "function": {
                "name": "metricas_classificacao",
                "description": ("Calcula precisão, revocação, F1, acurácia, especificidade e a "
                                "linha de base trivial a partir da matriz de confusão binária."),
                "parameters": {"type": "object", "properties": {
                    "vp": {"type": "number", "description": "verdadeiros positivos"},
                    "fp": {"type": "number", "description": "falsos positivos"},
                    "fn": {"type": "number", "description": "falsos negativos"},
                    "vn": {"type": "number", "description": "verdadeiros negativos"}},
                    "required": ["vp", "fp", "fn", "vn"]}}},
            "checar_split": {"type": "function", "function": {
                "name": "checar_split",
                "description": ("Confere uma divisão treino/validação/teste: se as frações somam 1 "
                                "e se cada parte tem tamanho suficiente para estimar métrica."),
                "parameters": {"type": "object", "properties": {
                    "n_total": {"type": "integer", "description": "número total de exemplos"},
                    "frac_treino": {"type": "number"},
                    "frac_validacao": {"type": "number"},
                    "frac_teste": {"type": "number"}},
                    "required": ["n_total"]}}},
            "buscar_no_livro": {"type": "function", "function": {
                "name": "buscar_no_livro",
                "description": "Busca trechos relevantes no texto do livro.",
                "parameters": {"type": "object",
                               "properties": {"consulta": {"type": "string",
                                              "description": "o que procurar no livro"}},
                               "required": ["consulta"]}}},
        }
        return [todos[n] for n in nomes if n in todos]

    def executar(self, nome: str, args: dict, permitidas: set[str]) -> str:
        if nome not in permitidas:                       # gating também na execução
            return f"erro: ferramenta '{nome}' não está habilitada neste capítulo."
        impl = self.impls.get(nome)
        return impl(args) if impl else f"erro: ferramenta desconhecida '{nome}'"
