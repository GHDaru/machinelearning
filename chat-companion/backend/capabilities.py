"""Registro de capacidades e o gating por capítulo.

Duas modalidades:
  - "avancado": tudo liberado (o companion completo).
  - "progressivo": só o que o livro já ensinou até o capítulo atual — o
    *fading* do 4C/ID e a carga cognitiva virando comportamento: o tutor não
    oferece um atalho que o leitor ainda não tem base para julgar.

Cada capacidade declara em que capítulo é liberada e quais tools habilita.
O widget usa `capacidades(chapter, mode)` para mostrar "o que posso fazer agora".
`tools_ativas` e `loop_ativo` decidem o comportamento real do turno.

Nota: a **correção de exercícios** não é gated. Praticar é o Princípio VIII e
vale desde a primeira página.
"""

from __future__ import annotations

from typing import Optional

# chave, rótulo, descrição (voltada ao leitor), capítulo que libera, tools que habilita.
# tools=() significa capacidade conceitual (sem tool nova) ou infra sempre-presente.
REGISTRO = [
    {"chave": "tutor", "rotulo": "Tutor do livro", "libera": 0, "tools": (),
     "descricao": "Explico conceitos e respondo perguntas usando o texto do livro."},
    {"chave": "busca_livro", "rotulo": "Busca no livro", "libera": 0, "tools": ("buscar_no_livro",),
     "descricao": "Encontro trechos relevantes no livro para embasar a resposta (com evidência)."},
    {"chave": "exercicios", "rotulo": "Correção de exercícios", "libera": 0, "tools": (),
     "descricao": "Corrijo suas respostas e explico o porquê — inclusive as abertas, por rubrica."},
    {"chave": "progresso", "rotulo": "Seu progresso", "libera": 0, "tools": (),
     "descricao": "Sei o que você já resolveu e o que ficou pendente — de forma anônima."},
    {"chave": "plano_estudo", "rotulo": "Plano de estudo", "libera": 0, "tools": (),
     "descricao": "Monto uma ordem de leitura e prática a partir do seu objetivo declarado."},
    {"chave": "dados", "rotulo": "Diagnóstico de dados", "libera": 2, "tools": ("checar_split",),
     "descricao": "Ajudo a farejar vazamento, desbalanceamento e divisão mal-feita."},
    {"chave": "metricas", "rotulo": "Calculadora de métricas", "libera": 4,
     "tools": ("metricas_classificacao",),
     "descricao": "Calculo precisão, revocação, F1 e acurácia a partir da matriz de confusão."},
    {"chave": "matematica", "rotulo": "Contas passo a passo", "libera": 6, "tools": ("calcular",),
     "descricao": "Faço a aritmética do exercício sem você abrir a calculadora."},
]

MODOS = ("avancado", "progressivo")


def _norm(chapter: Optional[int], mode: str) -> tuple[int, str]:
    ch = 0 if chapter is None else max(0, int(chapter))
    md = mode if mode in MODOS else "progressivo"
    return ch, md


def _ativa(cap: dict, chapter: int, mode: str) -> bool:
    return True if mode == "avancado" else cap["libera"] <= chapter


def capacidades(chapter: Optional[int], mode: str) -> list[dict]:
    """Lista para o widget: cada capacidade com rótulo, descrição e `ativa`."""
    ch, md = _norm(chapter, mode)
    return [{"chave": c["chave"], "rotulo": c["rotulo"], "descricao": c["descricao"],
             "libera_no_capitulo": c["libera"], "ativa": _ativa(c, ch, md)}
            for c in REGISTRO]


def loop_ativo(chapter: Optional[int], mode: str) -> bool:
    """O loop de tools vale sempre: a busca no livro é baseline do tutor."""
    return True


def tools_ativas(chapter: Optional[int], mode: str) -> set[str]:
    """Nomes de tools habilitadas neste capítulo/modo."""
    ch, md = _norm(chapter, mode)
    ativas: set[str] = set()
    for c in REGISTRO:
        if _ativa(c, ch, md):
            ativas.update(c["tools"])
    return ativas
