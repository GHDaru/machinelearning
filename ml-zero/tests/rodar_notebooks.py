"""Executa as células de código de cada notebook, na ordem, como o aluno faria.

Roda a partir da PASTA DA ETAPA — que é o diretório em que o aluno abre o
notebook. Se o bootstrap não achar a raiz do repositório dali, quebra aqui.
"""
import json, os, pathlib, sys, traceback, io, contextlib

RAIZ = pathlib.Path(__file__).resolve().parents[2]
NOTEBOOKS = [
    "ml-zero/etapa-05/regressao_limonada.ipynb",
    "ml-zero/etapa-00/linha_de_base.ipynb",
    "ml-zero/etapa-02/vazamento.ipynb",
    "ml-zero/etapa-07/arvores_ensembles.ipynb",
]

falhas = 0
for rel in NOTEBOOKS:
    caminho = RAIZ / rel
    nb = json.loads(caminho.read_text(encoding="utf8"))
    codigo = [ "".join(c["source"]) for c in nb["cells"] if c["cell_type"] == "code" ]
    print(f"\n{'='*70}\n{rel}  ({len(codigo)} células de código)\n{'='*70}")

    cwd_antes = os.getcwd()
    path_antes = list(sys.path)
    modulos_antes = set(sys.modules)
    os.chdir(caminho.parent)          # o aluno abre o notebook aqui
    escopo = {"__name__": "__main__"}
    try:
        for i, fonte in enumerate(codigo, 1):
            buf = io.StringIO()
            try:
                with contextlib.redirect_stdout(buf):
                    exec(compile(fonte, f"{rel}#celula{i}", "exec"), escopo)
            except Exception:
                print(f"  ✗ célula {i} FALHOU")
                print(buf.getvalue())
                traceback.print_exc()
                falhas += 1
                break
            saida = buf.getvalue().strip()
            print(f"  ✓ célula {i}" + (f"\n      " + saida.replace("\n", "\n      ") if saida else ""))
    finally:
        os.chdir(cwd_antes)
        sys.path[:] = path_antes
        for m in set(sys.modules) - modulos_antes:
            sys.modules.pop(m, None)

print(f"\n{'='*70}\n{'TODOS OS NOTEBOOKS RODARAM' if not falhas else str(falhas) + ' FALHA(S)'}")
sys.exit(1 if falhas else 0)
