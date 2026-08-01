"""Etapa 00, do começo ao fim: gerar, dividir, medir a linha de base.

    python etapa-00/rodar.py

Não treina modelo nenhum — de propósito. A etapa 00 existe para produzir o
**piso**: o número que todo modelo das etapas seguintes precisa bater para
justificar a própria existência.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from baseline import MajorityBaseline, acuracia, matriz_confusao  # noqa: E402
from dados import PROB_RUIDO, dividir, gerar  # noqa: E402


def main() -> None:
    dados = gerar()
    treino, validacao, teste = dividir(dados)

    print("═" * 62)
    print("ETAPA 00 — dado, divisão e linha de base")
    print("═" * 62)
    print(f"total            {len(dados):>6} exemplos")
    print(f"treino           {len(treino):>6}  (prevalência {treino.prevalencia():.3f})")
    print(f"validação        {len(validacao):>6}  (prevalência {validacao.prevalencia():.3f})")
    print(f"teste            {len(teste):>6}  (prevalência {teste.prevalencia():.3f})")
    print()
    print("As três prevalências são quase idênticas — é a estratificação")
    print("funcionando. Se divergissem, as métricas não seriam comparáveis.")
    print()

    modelo = MajorityBaseline().fit(treino.X, treino.y)
    pred = modelo.predict(validacao.X)
    acc = acuracia(validacao.y, pred)
    mc = matriz_confusao(validacao.y, pred)

    print("─" * 62)
    print(f"LINHA DE BASE (prevê sempre a classe {modelo.classe})")
    print("─" * 62)
    print(f"acurácia na validação   {acc:.4f}")
    print(f"matriz de confusão      VP={mc['vp']} FP={mc['fp']} FN={mc['fn']} VN={mc['vn']}")
    revocacao = mc["vp"] / (mc["vp"] + mc["fn"]) if (mc["vp"] + mc["fn"]) else 0.0
    print(f"revocação da classe 1   {revocacao:.4f}")
    print()
    print(f"Leia os dois números juntos: {acc:.1%} de acurácia e {revocacao:.0%} de")
    print("revocação. O 'modelo' acerta a maioria e não encontra NENHUM caso")
    print("positivo — que é justamente o que se queria encontrar. Este é o")
    print("problema que o capítulo 04 resolve.")
    print()
    teto = 1 - PROB_RUIDO / 2
    print(f"Teto teórico deste problema  ~{teto:.4f}")
    print(f"(o ruído irredutível é {PROB_RUIDO:.0%}; metade dele é recuperável por acaso)")
    print()
    print("→ Qualquer modelo das próximas etapas precisa bater a acurácia acima")
    print("  E ter revocação maior que zero. Um dos dois não basta.")


if __name__ == "__main__":
    main()
