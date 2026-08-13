# Trilha — Aprendizagem de Máquina

> **Trilha de disciplina** — a ordem de leitura do livro para um curso específico.
>
> A numeração (`II.2`) é **parte e posição no sumário**, não a ordem desta trilha. Um mesmo capítulo serve a mais de uma disciplina, e capítulos de partes distantes podem ser vizinhos aqui — é isso que permite ao livro cobrir três disciplinas sem se repetir. Ver [ADR 0011](../../adr/0011-numeracao-por-parte.md).

**Disciplina:** Aprendizagem de Máquina · **Curso:** Engenharia de Software · **Professor:** Gilsiley Henrique Darú

Esta trilha assume que o estudante **já cursou Análise Preditiva** e conhece o supervisionado clássico. Por isso ela vai **direto para as redes** e trata os modelos clássicos como revisão rápida.

A ementa tem seis unidades; a trilha as segue, redistribuindo a carga para o que a disciplina de fato aprofunda.


## Unidade 01 — Introdução à Aprendizagem de Máquina *(4h)*

| # | Capítulo | Por que aqui |
|---|---|---|
| 1 | [0.1 — Introdução](../0-1-introducao.md) | Quando ML é a resposta, e — mais importante — quando **não** é |
| 2 | [0.2 — Fundamentos](../0-2-fundamentos.md) | Generalização, viés e variância: o problema que nunca sai de cena |

## Unidade 02 — Machine Learning e Deep Learning *(8h)*

*Modelos baseados em símbolo, conexionistas, evolutivos, estatísticos e híbridos.*

| # | Capítulo | Por que aqui |
|---|---|---|
| 3 | [IV.3 — IA Simbólica, Fuzzy e Evolutiva](../capitulos/iv-3-ia-simbolica-fuzzy-evolutiva.md) | Os paradigmas que **não** aprendem de dados — e onde ainda ganham |
| 4 | [III.1 — O Neurônio Artificial](../capitulos/iii-1-neuronio-artificial.md) | O conexionismo começa aqui: McCulloch–Pitts, perceptron, e o XOR **no laboratório interativo** |

> A aula do capítulo III.1 tem um objeto manipulável: o estudante põe os pesos à mão e vê a reta se mover. O XOR é descoberto, não contado.

## Unidade 03 — Aprendizado Supervisionado *(20h)*

*Modelos preditivos. Classificação. Regressão. Algoritmos clássicos **e redes neurais**.*

| # | Capítulo | Peso na disciplina |
|---|---|---|
| 5 | [II.1 — Avaliação](../capitulos/ii-1-avaliacao.md) | revisão rápida — já visto em Análise Preditiva |
| 6 | [II.2 — Modelos Lineares](../capitulos/ii-2-modelos-lineares.md) e [II.3 — Regressão Logística](../capitulos/ii-3-regressao-logistica.md) | revisão rápida — o 28 é pré-requisito real do capítulo III.2: um neurônio com sigmoide **é** uma regressão logística |
| 7 | [II.5 — Árvores e Ensembles](../capitulos/ii-5-arvores-ensembles.md) | revisão rápida (retomado na Unidade 06) |
| 8 | [II.4 — Otimização e Regularização](../capitulos/ii-4-otimizacao.md) | **aprofundar** — é a base do treino de redes |
| 9 | [III.2 — Redes Multicamadas](../capitulos/iii-2-redes-neurais.md) | **núcleo** — a camada escondida e o backpropagation |
| 10 | [III.3 — Treinar Redes Profundas](../capitulos/iii-3-treinar-redes-profundas.md) | **núcleo** — o que faz uma rede de 20 camadas convergir |

## Unidade 04 — Aprendizado Não Supervisionado *(16h)*

*Modelos descritivos. Clusterização. Associação. Sumarização. Algoritmos clássicos e redes neurais.*

| # | Capítulo |
|---|---|
| 11 | [IV.1 — Aprendizado Não Supervisionado](../capitulos/iv-1-nao-supervisionado.md) |
| 12 | [I.6 — Representação](../capitulos/i-6-representacao.md) — redução de dimensionalidade e embeddings |

## Unidade 05 — Aprendizado por Reforço *(16h)*

*MDPs. Q-learning. Deep Q-networks.*

| # | Capítulo |
|---|---|
| 13 | [IV.2 — Aprendizado por Reforço](../capitulos/iv-2-reforco.md) |

## Unidade 06 — Ensembles e Modelos Generativos *(16h)*

*ML com ensembles. Modelos generativos com LLMs.*

| # | Capítulo | Por que aqui |
|---|---|---|
| 14 | [II.5 — Árvores e Ensembles](../capitulos/ii-5-arvores-ensembles.md) | agora **aprofundado**: bagging × boosting e o que cada um ataca |
| 15 | [III.4 — Visão Computacional](../capitulos/iii-4-visao.md) | convolução e transferência de aprendizado |
| 16 | [III.5 — Sequências e Linguagem](../capitulos/iii-5-sequencias-linguagem.md) | de RNN ao Transformer: como se chega aos LLMs |
| 17 | [III.6 — Modelos de Fundação e Generativos](../capitulos/iii-6-modelos-de-fundacao.md) | LLMs, embeddings, fine-tuning e RAG |

## Leitura de apoio (opcional)

- [V.3 — MLOps](../capitulos/v-3-mlops.md) e [V.2 — Sistemas de ML](../capitulos/v-2-sistemas-de-ml.md) — para quem for levar um modelo a produção.
- [V.1 — Interpretabilidade e Justiça](../capitulos/v-1-interpretabilidade-justica.md) — obrigatório se a aplicação decidir sobre pessoas.
- [V.4 — Fronteira e Expiração](../capitulos/v-4-fronteira.md) — a unidade "tendências da área" da ementa.

## Prática

A construção [`ml-zero`](../trilha-ml-zero.md) atende esta trilha nas etapas 05–06 (o otimizador que treina redes), 07 (ensembles) e, quando prontas, 09 (rede em NumPy), 10 (convolução) e 11 (atenção).
