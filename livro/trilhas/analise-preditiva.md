# Trilha — Análise Preditiva

> **Trilha de disciplina** — a ordem de leitura do livro para um curso específico.
>
> A numeração (`II.2`) é **parte e posição no sumário**, não a ordem desta trilha. Um mesmo capítulo serve a mais de uma disciplina, e capítulos de partes distantes podem ser vizinhos aqui — é isso que permite ao livro cobrir três disciplinas sem se repetir. Ver [ADR 0011](../../adr/0011-numeracao-por-parte.md).

**Disciplina:** Análise Preditiva · **Curso:** Engenharia de Software · **Professor:** Gilsiley Henrique Darú

Esta trilha assume que o estudante **já cursou Ciência de Dados** e traz a preparação de dados na bagagem. Ela vai da transformação de dados em informação até a entrega de um modelo preditivo defendido com evidência.

A ementa da disciplina tem três unidades; a trilha as segue.


## Unidade I — Transformação de Dados em Informação

*Dados, informação e conhecimento. SGBDs relacionais e NoSQL. Extração de conhecimento. ETL. Metodologia de pesquisa para análise de dados.*

| # | Capítulo | Por que aqui |
|---|---|---|
| 1 | [19 — O Ciclo da Ciência de Dados](../capitulos/i-1-ciclo-ciencia-de-dados.md) | CRISP-DM dá o mapa: por que a modelagem é a quarta fase |
| 2 | [20 — Coleta e Integração](../capitulos/i-2-coleta-integracao.md) | Arquivos, APIs, SQL e NoSQL, data lake × warehouse, ETL e ELT |
| 3 | [02 — Qualidade e Vazamento](../capitulos/i-3-dados.md) | O dado que chega está sujo, e o vazamento não dá erro |

**Ao final da unidade** o estudante monta um dataset a partir de fontes heterogêneas, com ficha de procedência, e sabe por que a divisão treino/teste precisa respeitar tempo e grupo.

## Unidade II — Análise Multidimensional de Dados

*Técnicas e ferramentas para análise multidimensional. Construção de repositório de dados.*

| # | Capítulo | Por que aqui |
|---|---|---|
| 4 | [23 — Análise Multidimensional](../capitulos/ii-6-analise-multidimensional.md) | Fato e dimensão, esquema estrela, OLAP, granularidade |
| 5 | [21 — Análise Exploratória](../capitulos/i-4-analise-exploratoria.md) | Olhar antes de modelar: descritiva, dispersão, outliers |
| 6 | [22 — Visualização e Storytelling](../capitulos/i-5-visualizacao-storytelling.md) | O gráfico que decide — e os que enganam sem intenção |

**Ao final da unidade** o estudante constrói um repositório analítico e extrai dele uma leitura defensável do que já aconteceu.

## Unidade III — Análise Preditiva de Dados

*Técnicas de análise preditiva aplicadas aos dados do módulo II. Experimentar ao menos duas técnicas, comparar e apresentar os resultados.*

| # | Capítulo | Por que aqui |
|---|---|---|
| 7 | [04 — Avaliação](../capitulos/ii-1-avaliacao.md) | **Antes de treinar**: escolher a métrica pelo custo do erro |
| 8 | [03 — Representação](../capitulos/i-6-representacao.md) | O modelo só vê o que você codificou |
| 9 | [05 — Modelos Lineares](../capitulos/ii-2-modelos-lineares.md) | A primeira técnica, interpretável e auditável |
| 10 | [28 — Regressão Logística](../capitulos/ii-3-regressao-logistica.md) | O mesmo maquinário para classificar: o que é linear é o logito |
| 11 | [07 — Árvores e Ensembles](../capitulos/ii-5-arvores-ensembles.md) | A segunda técnica, e a que costuma ganhar em tabular |
| 12 | [24 — Séries Temporais](../capitulos/ii-7-series-temporais.md) | Se o problema tiver tempo, ele muda de regras |
| 13 | [25 — Do Modelo à Decisão](../capitulos/ii-8-do-modelo-a-decisao.md) | Comparar com honestidade e apresentar o resultado |

**Ao final da unidade** o estudante entrega a avaliação N3 da ementa: **duas técnicas comparadas com protocolo justo, incerteza declarada, e uma recomendação defendida** — inclusive a recomendação de não usar o modelo.

## Leitura de apoio (opcional)

- [00 — Introdução](../0-1-introducao.md) e [01 — Fundamentos](../0-2-fundamentos.md) — se o estudante nunca viu ML, começam aqui.
- [06 — Otimização](../capitulos/ii-4-otimizacao.md) — para quem quiser entender o que o `fit()` faz por dentro.
- [14 — Interpretabilidade](../capitulos/v-1-interpretabilidade-justica.md) — quando a decisão precisa ser explicada a quem ela afeta.

## Prática

A construção [`ml-zero`](../trilha-ml-zero.md) acompanha esta trilha nas etapas **00** (linha de base), **02** (vazamento e divisões), **05–06** (lineares) e **07** (ensembles) — todas em Python puro, sem download e sem GPU.
