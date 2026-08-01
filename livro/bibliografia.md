# Bibliografia

> Referências do livro, por capítulo, **com status de validação**. O status não é decoração: o Princípio I exige que toda citação científica esteja conferida contra a fonte primária antes de sustentar uma afirmação no corpo do texto.

## Legenda de status

| Símbolo | Significado |
|---|---|
| ✓ | **Verificado** — identificador (DOI/arXiv), autoria e ano conferidos na fonte primária, com a data da conferência registrada |
| ⏳ | **A conferir** — a referência está na fila; **não pode** sustentar afirmação no corpo até virar ✓ |
| ⚠ | **Contestada** — o resultado citado é disputado na literatura; o texto deve dizer isso |

Uma referência ⏳ pode aparecer numa lista de leitura, nunca como evidência de uma afirmação. Essa distinção é o que separa uma bibliografia de uma lista de coisas que parecem certas.

> **Por que tantos ⏳ nesta edição.** Este livro nasceu em 2026-08 com a maquinaria pronta e o conteúdo em construção. As referências marcadas ⏳ são as que os capítulos-esqueleto vão precisar; elas entram no fluxo de verificação (skill `academic-research`) junto com a spec do capítulo correspondente. Publicar a lista antes de conferi-la é honesto; usá-la antes de conferi-la não seria.

---

## Método pedagógico (transversal — Princípio III)

- ✓ **Sweller, J. (1988).** Cognitive Load During Problem Solving: Effects on Learning. *Cognitive Science*, 12(2), 257–285. [doi:10.1207/s15516709cog1202_4](https://doi.org/10.1207/s15516709cog1202_4) — *verificado em 2026-08-01.* Origem do princípio de *worked examples* antes de exercício, que define o formato da seção "Pratique".
- ✓ **van Merriënboer, J. J. G., Clark, R. E., & de Croock, M. B. M. (2002).** Blueprints for complex learning: The 4C/ID-model. *ETR&D*, 50, 39–64. [doi:10.1007/BF02504993](https://doi.org/10.1007/BF02504993) — *verificado em 2026-08-01.* Fundamenta a relação entre a trilha `ml-zero` (tarefas inteiras) e os capítulos (informação de apoio).
- ✓ **Procida, D.** Diátaxis: A systematic framework for technical documentation authoring. [diataxis.fr](https://diataxis.fr/) — *verificado em 2026-08-01.* A regra de "um tipo de texto por seção".
- ⏳ **Wiggins, G., & McTighe, J. (2005).** *Understanding by Design*, 2ª ed. ASCD. — Backward Design; conferir edição e ISBN.

## Capítulo 01 — Fundamentos

- ✓ **Belkin, M., Hsu, D., Ma, S., & Mandal, S. (2019).** Reconciling modern machine-learning practice and the classical bias–variance trade-off. *PNAS*, 116(32), 15849–15854. [doi:10.1073/pnas.1903070116](https://doi.org/10.1073/pnas.1903070116) — *verificado em 2026-08-01.* Sustenta a advertência de que a intuição viés–variância não é lei universal no regime superparametrizado (*double descent*).
- ⏳ **Vapnik, V. (1999).** *The Nature of Statistical Learning Theory*. Springer. — Base formal da minimização do risco empírico.
- ⏳ **Hastie, T., Tibshirani, R., & Friedman, J. (2009).** *The Elements of Statistical Learning*, 2ª ed. Springer. — Referência canônica da decomposição viés–variância.

## Capítulo 02 — Dados

- ⏳ **Kaufman, S., Rosset, S., Perlich, C., & Stitelman, O. (2012).** Leakage in Data Mining: Formulation, Detection, and Avoidance. *ACM TKDD*. — A formulação de referência do vazamento.
- ⏳ **Gebru, T. et al. (2021).** Datasheets for Datasets. *Communications of the ACM*. — Origem da prática de ficha de dataset exigida pelo Princípio V.

## Capítulo 04 — Avaliação

- ⏳ **Saito, T., & Rehmsmeier, M. (2015).** The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets. *PLOS ONE*. — Sustenta a recomendação de AUC-PR para classes raras. **Prioridade de verificação**: esta referência sustenta uma recomendação já publicada no capítulo-piloto.
- ⏳ **Niculescu-Mizil, A., & Caruana, R. (2005).** Predicting Good Probabilities with Supervised Learning. *ICML*. — Calibração como propriedade independente do ranking.
- ⏳ **Efron, B., & Tibshirani, R. (1993).** *An Introduction to the Bootstrap*. Chapman & Hall. — O intervalo de confiança recomendado na seção de incerteza.

## Capítulo 07 — Árvores e Ensembles

- ⏳ **Breiman, L. (2001).** Random Forests. *Machine Learning*, 45, 5–32. — Bagging e florestas.
- ⏳ **Chen, T., & Guestrin, C. (2016).** XGBoost: A Scalable Tree Boosting System. *KDD*. — Boosting moderno.
- ⏳ **Grinsztajn, L., Oyallon, E., & Varoquaux, G. (2022).** Why do tree-based models still outperform deep learning on typical tabular data? *NeurIPS Datasets and Benchmarks*. — Evidência central da afirmação do capítulo sobre dados tabulares. **Prioridade de verificação.**

## Capítulos 09–11 — Redes, visão e sequências

- ⏳ **Rumelhart, D., Hinton, G., & Williams, R. (1986).** Learning representations by back-propagating errors. *Nature*.
- ⏳ **He, K. et al. (2016).** Deep Residual Learning for Image Recognition. *CVPR*.
- ⏳ **Vaswani, A. et al. (2017).** Attention Is All You Need. *NeurIPS*.

## Capítulo 12 — Modelos de fundação

- ⏳ **Lewis, P. et al. (2020).** Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*.
- ⏳ **Bommasani, R. et al. (2021).** On the Opportunities and Risks of Foundation Models.

## Capítulo 14 — Interpretabilidade e justiça

- ⏳ **Lundberg, S., & Lee, S.-I. (2017).** A Unified Approach to Interpreting Model Predictions. *NeurIPS*. — SHAP.
- ⏳ **Ribeiro, M. T., Singh, S., & Guestrin, C. (2016).** "Why Should I Trust You?": Explaining the Predictions of Any Classifier. *KDD*. — LIME.
- ⏳ **Kleinberg, J., Mullainathan, S., & Raghavan, M. (2017).** Inherent Trade-Offs in the Fair Determination of Risk Scores. *ITCS*. — O teorema de impossibilidade citado no capítulo.
- ⏳ **Mitchell, M. et al. (2019).** Model Cards for Model Reporting. *FAT\**.

## Capítulos 15–16 — Sistemas e MLOps

- ✓ **Sculley, D. et al. (2015).** Hidden Technical Debt in Machine Learning Systems. *NIPS 2015*, 2503–2511. [papers.nips.cc/paper/5656](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems) — *verificado em 2026-08-01.* O diagnóstico de que o modelo é a fração pequena do sistema.
- ⏳ **Breck, E. et al. (2017).** The ML Test Score: A Rubric for ML Production Readiness. *IEEE Big Data*.
- ⏳ **Gama, J. et al. (2014).** A Survey on Concept Drift Adaptation. *ACM Computing Surveys*.

---

## Como adicionar uma referência

1. Localize a fonte primária (editora, arXiv, DOI). Não aceite o resumo de terceiros como confirmação.
2. Confira **autoria, ano, veículo e identificador** — os quatro, não apenas o título.
3. Registre aqui com o status ✓ e **a data da conferência**.
4. Só então use a referência para sustentar uma afirmação no corpo.

O fluxo completo está na skill [`academic-research`](../.claude/skills/academic-research/SKILL.md). A razão de tanto rigor é medida: modelos de linguagem fabricam citações plausíveis com frequência alta, e uma referência inventada num livro técnico contamina tudo o que ela sustenta.
