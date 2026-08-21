"""Baixa o California Housing e o congela como CSV no repositório.

POR QUE VENDORIZAR. O `ml-zero/README.md` promete "sem internet, sem chave, sem
GPU — se algum comando pedir qualquer uma das três, é bug". `fetch_california_housing`
baixa da rede na primeira chamada. Um aluno sem internet na aula ficaria sem a
etapa, e duas turmas em semestres diferentes poderiam receber versões distintas.

Rode este script UMA vez para regenerar o CSV; a etapa lê o CSV, nunca a rede.

    python ml-zero/dados/california/obter.py
"""
import hashlib
from pathlib import Path

from sklearn.datasets import fetch_california_housing

AQUI = Path(__file__).parent
DESTINO = AQUI / "california.csv"

d = fetch_california_housing(as_frame=True)
df = d.frame
df.to_csv(DESTINO, index=False, float_format="%.6g")

sha = hashlib.sha256(DESTINO.read_bytes()).hexdigest()
print(f"✓ {DESTINO.relative_to(AQUI.parents[2])}")
print(f"  {len(df)} linhas × {len(df.columns)} colunas")
print(f"  sha256 {sha}")
print("\n  Cole o sha256 acima no README.md — é ele que prova que a turma toda")
print("  treinou sobre o mesmo arquivo.")
