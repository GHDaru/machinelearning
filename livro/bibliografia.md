# Bibliografia

> Referências do livro, por capítulo, **com status de validação**. O status não é decoração: o Princípio I exige que toda citação científica esteja conferida contra a fonte primária antes de sustentar uma afirmação no corpo do texto.

## Legenda de status

| Símbolo | Significado |
|---|---|
| ✓ | **Verificado** — identificador (DOI/arXiv), autoria e ano conferidos na fonte primária, com a data da conferência registrada |
| ⏳ | **A conferir** — a referência está na fila; **não pode** sustentar afirmação no corpo até virar ✓ |
| ⚠ | **Contestada** — o resultado citado é disputado na literatura; o texto deve dizer isso |

Uma referência ⏳ pode aparecer numa lista de leitura, nunca como evidência de uma afirmação. Essa distinção é o que separa uma bibliografia de uma lista de coisas que parecem certas.

> **Esta legenda e a dos capítulos respondem a perguntas diferentes.** Aqui a pergunta é *"esta referência pode sustentar uma afirmação?"* (Princípio I). Na seção "De onde isto veio" de cada capítulo, a pergunta é mais fina (*"o que exatamente eu conferi desta obra?"*) e a legenda tem cinco selos (✓ · ✓ᵐ · ⏳ · ❌ · 📖), definidos no Princípio X.
>
> A tradução entre as duas é estrita, e sempre na direção conservadora: **um ✓ desta página conferido só por DOI/identificador vale como ✓ᵐ no capítulo.** Metadado prova que a obra existe, quem assina e quando saiu; não prova o que ela afirma por dentro. Onde a nota de verificação abaixo diz "(Crossref)", foi isso, e só isso, que se conferiu.

> **Por que tantos ⏳ nesta edição.** Este livro nasceu em 2026-08 com a maquinaria pronta e o conteúdo em construção. As referências marcadas ⏳ são as que os capítulos-esqueleto vão precisar; elas entram no fluxo de verificação (skill `academic-research`) junto com a spec do capítulo correspondente. Publicar a lista antes de conferi-la é honesto; usá-la antes de conferi-la não seria.

---

## Método pedagógico (transversal — Princípio III)

- ✓ **Sweller, J. (1988).** Cognitive Load During Problem Solving: Effects on Learning. *Cognitive Science*, 12(2), 257–285. [doi:10.1207/s15516709cog1202_4](https://doi.org/10.1207/s15516709cog1202_4) — *verificado em 2026-08-01.* Origem do princípio de *worked examples* antes de exercício, que define o formato da seção "Pratique".
- ✓ **van Merriënboer, J. J. G., Clark, R. E., & de Croock, M. B. M. (2002).** Blueprints for complex learning: The 4C/ID-model. *ETR&D*, 50, 39–64. [doi:10.1007/BF02504993](https://doi.org/10.1007/BF02504993) — *verificado em 2026-08-01.* Fundamenta a relação entre a trilha `ml-zero` (tarefas inteiras) e os capítulos (informação de apoio).
- ✓ **Procida, D.** Diátaxis: A systematic framework for technical documentation authoring. [diataxis.fr](https://diataxis.fr/) — *verificado em 2026-08-01.* A regra de "um tipo de texto por seção".
- ⏳ **Wiggins, G., & McTighe, J. (2005).** *Understanding by Design*, 2ª ed. ASCD. — Backward Design; conferir edição e ISBN.

## Capítulo 0.2 — Fundamentos

- ✓ **Belkin, M., Hsu, D., Ma, S., & Mandal, S. (2019).** Reconciling modern machine-learning practice and the classical bias–variance trade-off. *PNAS*, 116(32), 15849–15854. [doi:10.1073/pnas.1903070116](https://doi.org/10.1073/pnas.1903070116) — *verificado em 2026-08-01.* Sustenta a advertência de que a intuição viés–variância não é lei universal no regime superparametrizado (*double descent*).
- ⏳ **Vapnik, V. (1999).** *The Nature of Statistical Learning Theory*. Springer. — Base formal da minimização do risco empírico.
- ⏳ **Hastie, T., Tibshirani, R., & Friedman, J. (2009).** *The Elements of Statistical Learning*, 2ª ed. Springer. — Referência canônica da decomposição viés–variância.

## Capítulo I.3 — Dados

- ✓ **Gebru, T., Morgenstern, J., Vecchione, B., Wortman Vaughan, J., Wallach, H., Daumé III, H., & Crawford, K. (2021).** Datasheets for Datasets. *Communications of the ACM*, 64(12), 86–92. [doi:10.1145/3458723](https://doi.org/10.1145/3458723) — *verificado em 2026-08-05.* Origem da prática de ficha de dataset; o capítulo I.3 adota uma versão mínima de sete perguntas e a torna executável (`FichaDeDataset`).
- ⏳ **Kaufman, S., Rosset, S., Perlich, C., & Stitelman, O. (2012).** Leakage in Data Mining: Formulation, Detection, and Avoidance. *ACM TKDD*. — A formulação de referência do vazamento. **Prioridade**: sustentaria a taxonomia das três fontes, hoje apresentada como síntese própria.

## Capítulo II.1 — Avaliação

- ⏳ **Saito, T., & Rehmsmeier, M. (2015).** The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets. *PLOS ONE*. — Sustenta a recomendação de AUC-PR para classes raras. **Prioridade de verificação**: esta referência sustenta uma recomendação já publicada no capítulo-piloto.
- ⏳ **Niculescu-Mizil, A., & Caruana, R. (2005).** Predicting Good Probabilities with Supervised Learning. *ICML*. — Calibração como propriedade independente do ranking.
- ⏳ **Efron, B., & Tibshirani, R. (1993).** *An Introduction to the Bootstrap*. Chapman & Hall. — O intervalo de confiança recomendado na seção de incerteza.

## Capítulo II.5 — Árvores e Ensembles

- ✓ **Breiman, L. (2001).** Random Forests. *Machine Learning*, 45, 5–32. [doi:10.1023/A:1010933404324](https://doi.org/10.1023/A:1010933404324) — *verificado em 2026-08-05.* Sustenta a afirmação de que a subamostragem de atributos existe para descorrelacionar as árvores, e não apenas para acelerar.
- ✓ **Grinsztajn, L., Oyallon, E., & Varoquaux, G. (2022).** Why do tree-based models still outperform deep learning on tabular data? *NeurIPS 2022, Datasets and Benchmarks Track*. [arXiv:2207.08815](https://arxiv.org/abs/2207.08815) — *verificado em 2026-08-05.* Benchmark de 45 datasets; sustenta que modelos de árvore permanecem no estado da arte em tabular de porte médio (~10 mil exemplos) e identifica os três mecanismos (atributos não informativos, funções irregulares, orientação dos eixos).
- ⏳ **Chen, T., & Guestrin, C. (2016).** XGBoost: A Scalable Tree Boosting System. *KDD*. — Boosting moderno; entra quando o capítulo V.3 tratar da biblioteca de produção.
- ⏳ **Friedman, J. (2001).** Greedy Function Approximation: A Gradient Boosting Machine. *Annals of Statistics*. — A formulação original do gradient boosting.

## Capítulo III.1 — O Neurônio Artificial

- ✓ **McCulloch, W. S., & Pitts, W. (1943).** A logical calculus of the ideas immanent in nervous activity. *Bulletin of Mathematical Biophysics*, 5, 115–133. [doi:10.1007/BF02478259](https://doi.org/10.1007/BF02478259) — *verificado em 2026-08-08.* O modelo de neurônio que o capítulo III.1 e o laboratório implementam.
- ✓ **Rosenblatt, F. (1958).** The perceptron: A probabilistic model for information storage and organization in the brain. *Psychological Review*, 65(6), 386–408. [doi:10.1037/h0042519](https://doi.org/10.1037/h0042519) — *verificado em 2026-08-08 (Crossref).* A regra de aprendizado que o `Perceptron` da etapa 18 implementa, e a prova de convergência para problemas separáveis.
- ⏳ **Minsky, M., & Papert, S. (1969).** *Perceptrons*. MIT Press. — A demonstração da limitação do XOR. Livro sem DOI; conferir edição e ISBN na fonte da editora.
- ⏳ **Hebb, D. O. (1949).** *The Organization of Behavior*. Wiley. — "Neurônios que disparam juntos, conectam-se juntos."
- ✓ **Fukushima, K. (1980).** Neocognitron: A self-organizing neural network model for a mechanism of pattern recognition unaffected by shift in position. *Biological Cybernetics*, 36, 193–202. [doi:10.1007/BF00344251](https://doi.org/10.1007/BF00344251) — *verificado em 2026-08-08 (Crossref).* **Atenção à data:** o DOI registra **1980** (versão em inglês); a publicação japonesa original é de 1979. O capítulo III.1 traz as duas datas por isso.
- ⏳ **Linnainmaa, S. (1970).** *Alqoritmin kumulatiivinen pyöristysvirhe…* Dissertação de mestrado, Univ. de Helsinque. — A prioridade do modo reverso da diferenciação automática. Sem DOI e em finlandês; o capítulo III.1 a cita **como nota de cronologia**, não como evidência de afirmação técnica.
- ⏳ **Werbos, P. (1974).** *Beyond Regression*. Tese de doutorado, Harvard. — Discussão preliminar já voltada a redes. A primeira aplicação do método a redes neurais é de **1981**, e não desta tese; a distinção está no levantamento de Schmidhuber (✓, lido) e na errata do [capítulo III.1](capitulos/iii-1-neuronio-artificial.md#errata). Esta linha dizia "a primeira aplicação" e contradizia a correção que o próprio capítulo já tinha feito.

## Capítulos III.2–11 — Redes, visão e sequências

- ✓ **Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986).** Learning representations by back-propagating errors. *Nature*, 323, 533–536. [doi:10.1038/323533a0](https://doi.org/10.1038/323533a0) — *verificado em 2026-08-08 (Crossref).* O trabalho que **popularizou** o backpropagation; a nota de prioridade do capítulo III.1 se apoia nele.
- ⏳ **He, K. et al. (2016).** Deep Residual Learning for Image Recognition. *CVPR*.
- ⏳ **Vaswani, A. et al. (2017).** Attention Is All You Need. *NeurIPS*.

## Capítulo III.6 — Modelos de fundação

- ⏳ **Lewis, P. et al. (2020).** Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*.
- ⏳ **Bommasani, R. et al. (2021).** On the Opportunities and Risks of Foundation Models.

## Capítulo V.1 — Interpretabilidade e justiça

- ⏳ **Lundberg, S., & Lee, S.-I. (2017).** A Unified Approach to Interpreting Model Predictions. *NeurIPS*. — SHAP.
- ⏳ **Ribeiro, M. T., Singh, S., & Guestrin, C. (2016).** "Why Should I Trust You?": Explaining the Predictions of Any Classifier. *KDD*. — LIME.
- ⏳ **Kleinberg, J., Mullainathan, S., & Raghavan, M. (2017).** Inherent Trade-Offs in the Fair Determination of Risk Scores. *ITCS*. — O teorema de impossibilidade citado no capítulo.
- ⏳ **Mitchell, M. et al. (2019).** Model Cards for Model Reporting. *FAT\**.

## Capítulos V.2–16 — Sistemas e MLOps

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
