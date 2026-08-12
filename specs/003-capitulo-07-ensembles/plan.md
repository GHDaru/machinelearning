# Plan 003 — Capítulo II.5: Árvores e Ensembles

**Spec:** [spec.md](spec.md) · **Raia:** plena · **Data:** 2026-08-05

## Constitution Check (portão)

| Princípio | Como cumpre | Risco |
|---|---|---|
| **I — Evidência** | Todos os números do capítulo saem de `etapa-07/rodar.py`, com seed fixa e caminho citado. As duas citações (Grinsztajn et al. 2022; Breiman 2001) conferidas na fonte. | Apresentar ilustração como evidência. **Mitigado com aviso em destaque no capítulo**: o dado foi construído com regra que favorece árvores, e isso é dito antes de qualquer número. |
| **II — Experimento executável** | Três lições do capítulo são testes que falham se deixarem de valer. | — |
| **III — Método pedagógico** | Esqueleto v4; worked example (o cálculo de Gini) antes do exercício numérico; dificuldade crescente. | — |
| **IV — Livro vivo** | Cláusula de expiração com **gatilho operacional**: um benchmark independente, com igual rigor de busca de hiperparâmetros, mostrando vantagem consistente de método não-árvore em porte médio. | — |
| **V — Segurança e dados** | Dado sintético, sem rede, sem dado pessoal. | — |
| **VI — Acessibilidade** | Tudo em biblioteca padrão, CPU. A comparação com deep learning é por citação justamente porque treinar redes violaria o custo zero. | — |
| **VII — Spec-driven** | Este ciclo. Objetivos herdados do esqueleto. | — |
| **VIII — Interatividade** | 5 exercícios (2 múltiplas, 1 múltipla-multi, 1 numérica, 1 aberta) + 1 vídeo. | — |
| **IX — DoD** | Build verde, 66 testes na trilha, saídas coladas. | — |

**Veredito:** aprovado, com a mitigação do Princípio I registrada e implementada.

## Decisões

**A etapa 07 gera o próprio dado.** Medido antes de decidir: o teto de Bayes do dado da etapa 00 é 0,5895, e os modelos chegaram a 96% dele — empilhados dentro do ruído. Além disso, aquela fronteira é suave, terreno onde árvores não têm vantagem. Registro completo em [`estudos/2026-08-05-teto-de-bayes-do-dado-da-etapa-00.md`](../../estudos/2026-08-05-teto-de-bayes-do-dado-da-etapa-00.md).

**A etapa 00 não foi alterada.** Sua lição depende daquele dado e já está publicada. Trocar dado publicado para um experimento novo ficar bonito é o caminho mais curto para perder a confiança do leitor.

**Régua linear na etapa 07, antes do capítulo II.2.** Sem uma régua, "boosting vai bem" não significa nada. `linear.py` é deliberadamente mínimo e declara-se como referência para a frente.

**Variância medida como Var[f̂(x)], não como desvio da AUC.** A primeira versão do teste comparava o desvio-padrão de AUCs entre reamostragens e falhava por falta de poder estatístico — o desvio de 4 pontos é ele próprio ruidoso. A variância da predição usa todos os pontos de validação e é literalmente a parcela da decomposição do capítulo 0.2.

## Fases

1. Medir o teto do dado existente (diagnóstico antes do fix).
2. Gerar o dado tabular com as três características do paper.
3. Implementar árvore, floresta, boosting e AUC.
4. Rodar o experimento e só então escrever o capítulo com os números obtidos.
5. Verificar as citações; registrar.
