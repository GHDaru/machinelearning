# Trilha — Ciência de Dados

> **Trilha de disciplina** — a ordem de leitura do livro para um curso específico.
>
> A numeração (`II.2`) é **parte e posição no sumário**, não a ordem desta trilha. Um mesmo capítulo serve a mais de uma disciplina, e capítulos de partes distantes podem ser vizinhos aqui — é isso que permite ao livro cobrir três disciplinas sem se repetir. Ver [ADR 0011](../../adr/0011-numeracao-por-parte.md).

**Disciplina:** Ciência de Dados · **Curso:** Engenharia de Software · **Professor:** —

Esta trilha cobre a **base** — a disciplina que antecede Análise Preditiva e Aprendizagem de Máquina. Serve a dois públicos: quem está cursando, e quem já cursou e precisa revisar antes das disciplinas seguintes.

Se você chegou aqui vindo de Análise Preditiva ou de Aprendizagem de Máquina e alguma coisa não fez sentido, provavelmente o que faltou está nesta trilha.


## Fundamentos e ciclo

| # | Capítulo | Cobre |
|---|---|---|
| 1 | [19 — O Ciclo da Ciência de Dados](../capitulos/i-1-ciclo-ciencia-de-dados.md) | CRISP-DM, papéis, relação entre Ciência de Dados, IA e Estatística |
| 2 | [00 — Introdução](../0-1-introducao.md) | quando ML é a resposta e quando não é |

## Coleta e integração

| # | Capítulo | Cobre |
|---|---|---|
| 3 | [20 — Coleta e Integração](../capitulos/i-2-coleta-integracao.md) | formatos, APIs, scraping, SQL e NoSQL, data lake e warehouse, bases públicas |

## Limpeza e pré-processamento

| # | Capítulo | Cobre |
|---|---|---|
| 4 | [02 — Qualidade e Vazamento](../capitulos/i-3-dados.md) | nulos, duplicatas, ficha de dataset, viés de seleção, e o vazamento |
| 5 | [03 — Representação](../capitulos/i-6-representacao.md) | codificação, normalização, padronização, engenharia de atributos |

## Visualização e comunicação

| # | Capítulo | Cobre |
|---|---|---|
| 6 | [21 — Análise Exploratória](../capitulos/i-4-analise-exploratoria.md) | estatística descritiva, dispersão, correlação, outliers |
| 7 | [22 — Visualização e Storytelling](../capitulos/i-5-visualizacao-storytelling.md) | escolha do gráfico, distorções visuais, narrativa de dados |

## Uma primeira passada por modelagem

| # | Capítulo | Cobre |
|---|---|---|
| 8 | [01 — Fundamentos](../0-2-fundamentos.md) | generalização, viés e variância |
| 9 | [04 — Avaliação](../capitulos/ii-1-avaliacao.md) | métricas, e por que acurácia engana |
| 10 | [05 — Modelos Lineares](../capitulos/ii-2-modelos-lineares.md) | o primeiro modelo, interpretável — com o laboratório de mínimos quadrados |

## Prática

Etapas **00** e **02** do [`ml-zero`](../trilha-ml-zero.md) — linha de base, divisões honestas e a ficha de dataset como portão executável. Ambas em Python puro, sem instalar nada além do pytest.
