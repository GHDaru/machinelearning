"""Executa as células de código de cada notebook, na ordem, como o aluno faria.

Cada notebook roda em **processo próprio**, a partir da pasta da etapa — que é
o diretório em que o aluno abre o arquivo. Processo próprio não é zelo: a
primeira versão reaproveitava o mesmo interpretador e limpava `sys.modules`
entre os notebooks. Funcionava enquanto tudo era biblioteca padrão, e quebrou
no primeiro `import numpy` — `cannot load module more than once per process`,
porque extensão em C não recarrega. Um kernel por notebook é, aliás, o que o
Jupyter dá ao aluno.

Uso:  python tests/rodar_notebooks.py
"""

import json
import pathlib
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[2]
NOTEBOOKS = [
    "ml-zero/etapa-05/regressao_limonada.ipynb",
    "ml-zero/etapa-00/linha_de_base.ipynb",
    "ml-zero/etapa-02/vazamento.ipynb",
    "ml-zero/etapa-07/arvores_ensembles.ipynb",
    "ml-zero/etapa-21/exploratoria_limonada.ipynb",
]

falhas = []
for rel in NOTEBOOKS:
    caminho = RAIZ / rel
    nb = json.loads(caminho.read_text(encoding="utf8"))
    codigo = ["".join(c["source"]) for c in nb["cells"] if c["cell_type"] == "code"]
    script = "\n\n# ---- proxima celula ----\n\n".join(codigo)

    print(f"\n{'=' * 70}\n{rel}  ({len(codigo)} celulas)\n{'=' * 70}")
    r = subprocess.run([sys.executable, "-c", script], cwd=caminho.parent,
                       capture_output=True, text=True, timeout=900)
    saida = (r.stdout or "").strip()
    if saida:
        print("  " + saida.replace("\n", "\n  ")[:1200])
    if r.returncode != 0:
        print("  x FALHOU")
        print("  " + (r.stderr or "").strip().replace("\n", "\n  ")[-1800:])
        falhas.append(rel)
    else:
        print("  ok - todas as celulas rodaram")

print(f"\n{'=' * 70}")
if falhas:
    print("FALHARAM:", ", ".join(falhas))
    sys.exit(1)
print(f"TODOS OS {len(NOTEBOOKS)} NOTEBOOKS RODARAM")
