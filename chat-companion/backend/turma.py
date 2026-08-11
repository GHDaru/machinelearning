"""Identificação por turma — o comando `/turma` do chat.

POR QUE ISTO EXISTE, E POR QUE É UMA EXCEÇÃO ESTREITA (ADR 0008):
o progresso do leitor é anônimo por princípio, e continua sendo o padrão. Um
professor que usa o livro numa disciplina precisa atribuir prática a pessoas —
e a única alternativa honesta a este módulo seria o professor pedir print de
tela, que é autodeclaração disfarçada de evidência.

Três garantias, e elas são o motivo de o desenho ser este:

1. **O aluno digita.** Não há login, cookie de identidade nem detecção. Enquanto
   ninguém digitar o comando, nada muda: a sessão segue anônima.
2. **A resposta diz o que passa a acontecer**, na hora, antes de qualquer dado
   ser exposto ao professor.
3. **`/turma sair` desfaz**, e `DELETE /session` continua apagando tudo.

O comando é interpretado AQUI, antes do modelo. Não é prompt: é código. Um LLM
não decide quem é aluno de quem — e a identificação funciona igual com a chave
do modelo fora do ar.
"""

from __future__ import annotations

import re
from typing import Optional

# `/turma AP2026 12345` · `turma AP2026 Maria Silva` · `/turma` · `/turma sair`
_RE = re.compile(r"^\s*/?turma\b\s*(?P<resto>.*)$", re.IGNORECASE | re.DOTALL)
_SAIR = {"sair", "sai", "esquecer", "esqueça", "esqueca", "anonimo", "anônimo", "remover"}

TURMA_MAX = 32
ALUNO_MAX = 60


def _limpar(s: str, tamanho: int) -> str:
    return re.sub(r"\s+", " ", s).strip()[:tamanho]


def detectar(mensagem: str) -> Optional[dict]:
    """Retorna a intenção do comando, ou None se a mensagem não for `/turma`.

    {"acao": "ver"} · {"acao": "sair"} · {"acao": "entrar", "turma": ..., "aluno": ...}
    · {"acao": "incompleto"} quando veio só a turma, sem quem é a pessoa.
    """
    m = _RE.match(mensagem or "")
    if not m:
        return None
    resto = _limpar(m.group("resto"), 200)
    if not resto:
        return {"acao": "ver"}
    if resto.lower() in _SAIR:
        return {"acao": "sair"}

    partes = resto.split(" ", 1)
    turma = _limpar(partes[0], TURMA_MAX)
    aluno = _limpar(partes[1], ALUNO_MAX) if len(partes) > 1 else ""
    # "matricula 123" / "matrícula: 123" — a palavra é ruído, o número é o dado.
    aluno = re.sub(r"^(matr[ií]cula|ra|registro)\s*[:=]?\s*", "", aluno, flags=re.IGNORECASE).strip()
    if not turma or not aluno:
        return {"acao": "incompleto", "turma": turma}
    return {"acao": "entrar", "turma": turma, "aluno": aluno}


AJUDA = (
    "**Identificação por turma.** Por padrão seu progresso aqui é anônimo — nem eu nem o "
    "professor sabemos quem é você. Se a sua disciplina usa o livro para acompanhar prática, "
    "você pode se identificar:\n\n"
    "`/turma CODIGO-DA-TURMA SUA-MATRICULA`\n\n"
    "Exemplo: `/turma AP2026-2 123456`\n\n"
    "A partir daí, **o professor dessa turma** passa a ver seus exercícios resolvidos e quantas "
    "tentativas cada um levou. Ele não vê suas conversas comigo, nem o que você digitou nas "
    "respostas — só o resultado.\n\n"
    "`/turma sair` desfaz a identificação. Apagar tudo, inclusive o progresso, continua sendo o "
    "botão de apagar a sessão."
)


def confirmacao(turma: str, aluno: str, resolvidos: int, total: int) -> str:
    return (
        f"Pronto: você está identificado como **{aluno}** na turma **{turma}**.\n\n"
        f"O que muda: o professor dessa turma passa a ver, associados a esta matrícula, "
        f"os exercícios que você resolveu ({resolvidos} de {total} até agora) e quantas "
        f"tentativas levou em cada um.\n\n"
        f"O que **não** muda: suas conversas comigo continuam privadas, e o texto das suas "
        f"respostas não é enviado a ele — só se acertou e em quantas tentativas.\n\n"
        f"Mudou de ideia? `/turma sair`."
    )


SAIDA = (
    "Feito — sua sessão voltou a ser **anônima**. O professor não vê mais este progresso "
    "associado a você.\n\n"
    "O histórico de tentativas continua guardado (é o que faz a revelação progressiva "
    "funcionar), só que sem nome. Para apagar de vez, use o botão de apagar a sessão."
)

INCOMPLETO = (
    "Faltou a segunda parte. O formato é `/turma CODIGO SUA-MATRICULA` — "
    "por exemplo `/turma AP2026-2 123456`.\n\n"
    "Se você quer só entender o que isso faz antes de decidir, digite `/turma` sozinho."
)
