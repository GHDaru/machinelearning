"""Empacota o texto do livro num `corpus.json` ao lado do backend.

Necessário porque o deploy do backend costuma copiar só a própria pasta — sem
o repositório inteiro, o índice não teria o que ler. Rode antes de publicar:

    python build_corpus.py

O banco de exercícios (`banco.json`) é gerado pelo outro lado, em
`publicar/exercicios.mjs` — os dois arquivos juntos são tudo o que o backend
precisa do livro.
"""

from pathlib import Path

import config
from ragindex import BookIndex

if __name__ == "__main__":
    destino = Path(__file__).resolve().parent / "corpus.json"
    index = BookIndex(config.REPO_ROOT, corpus_path=None)
    n = index.exportar(destino)
    print(f"✓ corpus com {n} blocos -> {destino}")
