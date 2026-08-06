"""Etapa 07 — o experimento que o capítulo 07 cita.

    python etapa-07/rodar.py

Compara, no mesmo dado tabular, quatro modelos e a linha de base; e mede a
estabilidade de cada um sob reamostragem, que é onde bagging e boosting se
distinguem.

Toda afirmação numérica do capítulo 07 sai daqui (Princípio I). Seeds fixas:
rodar duas vezes dá o mesmo resultado.
"""

from __future__ import annotations

import random
import statistics
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ / "etapa-07"))

from arvores import Arvore, Boosting, Floresta, auc  # noqa: E402
from dados_tabulares import dividir, gerar, p_verdadeiro  # noqa: E402
from linear import LogisticaSimples  # noqa: E402

SEEDS = (0, 1, 2, 3, 4)


def metricas(y_true, prob) -> dict:
    pred = [1 if p > 0.5 else 0 for p in prob]
    vp = sum(1 for a, b in zip(y_true, pred) if a == 1 and b == 1)
    fn = sum(1 for a, b in zip(y_true, pred) if a == 1 and b == 0)
    acc = sum(1 for a, b in zip(y_true, pred) if a == b) / len(y_true)
    return {"acuracia": acc, "revocacao": vp / (vp + fn) if vp + fn else 0.0,
            "auc": auc(list(y_true), list(prob))}


MODELOS = (
    ("linear (referência)", lambda s: LogisticaSimples(epocas=300, taxa=0.5, seed=s)),
    ("árvore (prof. 3)", lambda s: Arvore(max_profundidade=3, min_folha=20, seed=s)),
    ("árvore (prof. 12)", lambda s: Arvore(max_profundidade=12, min_folha=2, seed=s)),
    ("floresta (25)", lambda s: Floresta(n_arvores=25, max_profundidade=8, seed=s)),
    ("boosting (50, η=0,2)", lambda s: Boosting(n_arvores=50, taxa=0.2,
                                                max_profundidade=3, seed=s)),
)


def main() -> None:
    dados = gerar()
    treino, val = dividir(dados)
    Xt, yt = treino.X, [float(v) for v in treino.y]
    Xv, yv = val.X, val.y

    teto = auc(yv, [p_verdadeiro(x) for x in Xv])
    base = max(1 - sum(yv) / len(yv), sum(yv) / len(yv))

    print("=" * 70)
    print("ETAPA 07 — árvore, floresta e boosting em dado tabular irregular")
    print("=" * 70)
    print(f"treino {len(treino)} · validação {len(val)} · "
          f"prevalência {treino.prevalencia():.3f}")
    print(f"6 atributos, dos quais 3 são puro ruído (Grinsztajn et al., 2022)")
    print(f"linha de base (classe majoritária): acurácia {base:.4f}")
    print(f"TETO DE BAYES (rank pelo processo verdadeiro): AUC {teto:.4f}\n")

    print(f"{'modelo':<24}{'acurácia':>10}{'revocação':>12}{'AUC':>9}{'% do teto':>11}")
    print("-" * 70)
    resultados = {}
    for nome, fabrica in MODELOS:
        m = fabrica(0).fit(Xt, yt)
        r = metricas(yv, m.predict_proba(Xv))
        resultados[nome] = r
        print(f"{nome:<24}{r['acuracia']:>10.4f}{r['revocacao']:>12.4f}"
              f"{r['auc']:>9.4f}{r['auc'] / teto:>10.1%}")

    print("\n" + "-" * 70)
    print("ESTABILIDADE — 5 reamostragens bootstrap do treino")
    print("-" * 70)
    print("Bagging ataca VARIÂNCIA: a floresta deve oscilar menos que a árvore.\n")
    print(f"{'modelo':<24}{'AUC média':>12}{'desvio':>10}{'amplitude':>12}")
    print("-" * 70)

    estab = {}
    for nome, fabrica in MODELOS:
        aucs = []
        for s in SEEDS:
            rng = random.Random(1000 + s)
            amostra = [rng.randrange(len(yt)) for _ in range(len(yt))]
            m = fabrica(s).fit([Xt[i] for i in amostra], [yt[i] for i in amostra])
            aucs.append(auc(yv, m.predict_proba(Xv)))
        estab[nome] = aucs
        print(f"{nome:<24}{statistics.mean(aucs):>12.4f}"
              f"{statistics.pstdev(aucs):>10.4f}{max(aucs) - min(aucs):>12.4f}")

    print("\n" + "=" * 70)
    print("LEITURA")
    print("=" * 70)
    lin, bo = resultados["linear (referência)"], resultados["boosting (50, η=0,2)"]
    print(f"1. O modelo linear chega a {lin['auc']:.4f} de AUC ({lin['auc']/teto:.0%} do teto);")
    print(f"   o boosting, a {bo['auc']:.4f} ({bo['auc']/teto:.0%}). A diferença não é")
    print("   capacidade bruta: é que a fronteira aqui é IRREGULAR — uma interação")
    print("   e uma quebra —, e a reta não a representa.")
    a12, flo = estab["árvore (prof. 12)"], estab["floresta (25)"]
    print(f"\n2. A árvore profunda varia {max(a12)-min(a12):.4f} de AUC entre reamostragens;")
    print(f"   a floresta, {max(flo)-min(flo):.4f} (desvio {statistics.pstdev(flo):.4f} contra")
    print(f"   {statistics.pstdev(a12):.4f}). Bagging não deixa o modelo mais esperto —")
    print("   deixa-o mais estável, que é atacar a variância.")
    a3 = resultados["árvore (prof. 3)"]
    print(f"\n3. O boosting usa árvores de profundidade 3 — cada uma delas sozinha vale")
    print(f"   {a3['auc']:.4f} — e a soma delas chega a {bo['auc']:.4f}. É viés atacado por")
    print("   correções sucessivas, não por capacidade individual.")


if __name__ == "__main__":
    main()
