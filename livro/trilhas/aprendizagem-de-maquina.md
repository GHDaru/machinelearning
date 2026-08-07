# Trilha — Aprendizagem de Máquina

> **Trilha de disciplina** — a ordem de leitura do livro para um curso específico.
>
> O número do capítulo é um **identificador estável**, não uma ordem. Um mesmo capítulo pode aparecer em mais de uma trilha, e capítulos de números distantes podem ser vizinhos aqui. É isso que permite ao livro cobrir três disciplinas sem se repetir.

**Disciplina:** Aprendizagem de Máquina · **Curso:** Engenharia de Software · **Professor:** Gilsiley Henrique Darú

Esta trilha assume que o estudante **já cursou Análise Preditiva** e conhece o supervisionado clássico. Por isso ela vai **direto para as redes** e trata os modelos clássicos como revisão rápida.

A ementa tem seis unidades; a trilha as segue, redistribuindo a carga para o que a disciplina de fato aprofunda.


## Unidade 01 — Introdução à Aprendizagem de Máquina *(4h)*

| # | Capítulo | Por que aqui |
|---|---|---|
| 1 | [00 — Introdução](../00-introducao.md) | Quando ML é a resposta, e — mais importante — quando **não** é |
| 2 | [01 — Fundamentos](../01-fundamentos.md) | Generalização, viés e variância: o problema que nunca sai de cena |

## Unidade 02 — Machine Learning e Deep Learning *(8h)*

*Modelos baseados em símbolo, conexionistas, evolutivos, estatísticos e híbridos.*

| # | Capítulo | Por que aqui |
|---|---|---|
| 3 | [27 — IA Simbólica, Fuzzy e Evolutiva](../capitulos/27-ia-simbolica-fuzzy-evolutiva.md) | Os paradigmas que **não** aprendem de dados — e onde ainda ganham |
| 4 | [18 — O Neurônio Artificial](../capitulos/18-neuronio-artificial.md) | O conexionismo começa aqui: McCulloch–Pitts, perceptron, e o XOR **no laboratório interativo** |

> A aula do capítulo 18 tem um objeto manipulável: o estudante põe os pesos à mão e vê a reta se mover. O XOR é descoberto, não contado.

## Unidade 03 — Aprendizado Supervisionado *(20h)*

*Modelos preditivos. Classificação. Regressão. Algoritmos clássicos **e redes neurais**.*

| # | Capítulo | Peso na disciplina |
|---|---|---|
| 5 | [04 — Avaliação](../capitulos/04-avaliacao.md) | revisão rápida — já visto em Análise Preditiva |
| 6 | [05 — Modelos Lineares](../capitulos/05-modelos-lineares.md) | revisão rápida |
| 7 | [07 — Árvores e Ensembles](../capitulos/07-arvores-ensembles.md) | revisão rápida (retomado na Unidade 06) |
| 8 | [06 — Otimização e Regularização](../capitulos/06-otimizacao.md) | **aprofundar** — é a base do treino de redes |
| 9 | [09 — Redes Multicamadas](../capitulos/09-redes-neurais.md) | **núcleo** — a camada escondida e o backpropagation |
| 10 | [26 — Treinar Redes Profundas](../capitulos/26-treinar-redes-profundas.md) | **núcleo** — o que faz uma rede de 20 camadas convergir |

## Unidade 04 — Aprendizado Não Supervisionado *(16h)*

*Modelos descritivos. Clusterização. Associação. Sumarização. Algoritmos clássicos e redes neurais.*

| # | Capítulo |
|---|---|
| 11 | [08 — Aprendizado Não Supervisionado](../capitulos/08-nao-supervisionado.md) |
| 12 | [03 — Representação](../capitulos/03-representacao.md) — redução de dimensionalidade e embeddings |

## Unidade 05 — Aprendizado por Reforço *(16h)*

*MDPs. Q-learning. Deep Q-networks.*

| # | Capítulo |
|---|---|
| 13 | [13 — Aprendizado por Reforço](../capitulos/13-reforco.md) |

## Unidade 06 — Ensembles e Modelos Generativos *(16h)*

*ML com ensembles. Modelos generativos com LLMs.*

| # | Capítulo | Por que aqui |
|---|---|---|
| 14 | [07 — Árvores e Ensembles](../capitulos/07-arvores-ensembles.md) | agora **aprofundado**: bagging × boosting e o que cada um ataca |
| 15 | [10 — Visão Computacional](../capitulos/10-visao.md) | convolução e transferência de aprendizado |
| 16 | [11 — Sequências e Linguagem](../capitulos/11-sequencias-linguagem.md) | de RNN ao Transformer: como se chega aos LLMs |
| 17 | [12 — Modelos de Fundação e Generativos](../capitulos/12-modelos-de-fundacao.md) | LLMs, embeddings, fine-tuning e RAG |

## Leitura de apoio (opcional)

- [16 — MLOps](../capitulos/16-mlops.md) e [15 — Sistemas de ML](../capitulos/15-sistemas-de-ml.md) — para quem for levar um modelo a produção.
- [14 — Interpretabilidade e Justiça](../capitulos/14-interpretabilidade-justica.md) — obrigatório se a aplicação decidir sobre pessoas.
- [17 — Fronteira e Expiração](../capitulos/17-fronteira.md) — a unidade "tendências da área" da ementa.

## Prática

A construção [`ml-zero`](../trilha-ml-zero.md) atende esta trilha nas etapas **05–06** (o otimizador que treina redes), **07** (ensembles) e, quando prontas, **09** (rede em NumPy), **10** (convolução) e **11** (atenção).
