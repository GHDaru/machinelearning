# Ledger do ciclo 009 — um ciclo por capítulo

> **Esta é a fonte da verdade do ciclo**, não a memória da sessão. Um long run é
> compactado no meio; o que não estiver escrito aqui não existe na próxima volta.
> Atualize a linha do capítulo **no mesmo commit** que o trabalho dele.

## Como ler

Cada capítulo passa por quatro etapas. `—` não começou · `~` em curso · `ok` feito e verificado.

| Etapa | O que é | Como se prova |
|---|---|---|
| **voz** | revisão de prosa do ADR 0013 | gate de prosa verde no build |
| **exs** | 3 exercícios por objetivo (ADR 0014) | `node publicar/exercicios.mjs --verificar` |
| **prova** | avaliação de fechamento (ADR 0014) | bloco presente e no banco |
| **fontes** | selos de procedência conferidos | selo atualizado no capítulo |

> **Animação não tem coluna aqui de propósito.** Ela não é etapa de todo
> capítulo: 23 dos 29 animam, 6 não, e o critério é o do [ADR 0015](../../adr/0015-animacao-e-laboratorio-sem-manopla.md).
> O mapa e o estado de cada uma vivem em [`animacoes.md`](animacoes.md), que é
> a fonte única desse recorte. Feita até agora: **III.1** (o perceptron
> aprendendo, com o botão do XOR).

## Estado

| # | Capítulo | obj | exs hoje | exs alvo | voz | exs | prova | fontes |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.1 — Introdução | 3 | 4 | 9 | **ok** | — | — | — |
| 2 | 0.2 — Fundamentos | 4 | 4 | 12 | **ok** | — | — | — |
| 3 | I.1 — O Ciclo da Ciência de Dados | 4 | 5 | 12 | **ok** | — | — | — |
| 4 | I.2 — Coleta e Integração | 4 | 4 | 12 | **ok** | — | — | — |
| 5 | I.3 — Qualidade e Vazamento | 4 | 5 | 12 | **ok** | — | — | — |
| 6 | I.4 — Análise Exploratória | 4 | 7 | 12 | **ok** | — | — | — |
| 7 | I.5 — Visualização e Storytelling | 4 | 4 | 12 | **ok** | — | — | — |
| 8 | I.6 — Representação | 4 | 4 | 12 | **ok** | — | — | — |
| 9 | II.1 — Avaliação | 5 | 5 | 15 | **ok** | — | — | — |
| 10 | II.2 — Modelos Lineares | 4 | 5 | 12 | **ok** | — | — | — |
| 11 | II.3 — Regressão Logística | 3 | 3 | 9 | **ok** | — | — | — |
| 12 | II.4 — Otimização e Regularização | 4 | 4 | 12 | **ok** | — | — | — |
| 13 | II.5 — Árvores e Ensembles | 4 | 5 | 12 | **ok** | — | — | — |
| 14 | II.6 — Análise Multidimensional | 4 | 4 | 12 | **ok** | — | — | — |
| 15 | II.7 — Séries Temporais | 4 | 4 | 12 | **ok** | — | — | — |
| 16 | II.8 — Do Modelo à Decisão | 4 | 4 | 12 | **ok** | — | — | — |
| 17 | III.1 — O Neurônio Artificial | 4 | 4 | 12 | **ok** | — | — | — |
| 18 | III.2 — Redes Multicamadas | 4 | 4 | 12 | **ok** | — | — | — |
| 19 | III.3 — Treinar Redes Profundas | 4 | 5 | 12 | **ok** | — | — | — |
| 20 | III.4 — Visão Computacional | 4 | 4 | 12 | **ok** | — | — | — |
| 21 | III.5 — Sequências e Linguagem | 4 | 4 | 12 | — | — | — | — |
| 22 | III.6 — Modelos de Fundação | 4 | 4 | 12 | — | — | — | — |
| 23 | IV.1 — Não Supervisionado | 4 | 4 | 12 | — | — | — | — |
| 24 | IV.2 — Aprendizado por Reforço | 4 | 4 | 12 | — | — | — | — |
| 25 | IV.3 — Simbólica, Fuzzy e Evolutiva | 4 | 4 | 12 | — | — | — | — |
| 26 | V.1 — Interpretabilidade e Justiça | 4 | 4 | 12 | — | — | — | — |
| 27 | V.2 — Sistemas de ML | 4 | 3 | 12 | — | — | — | — |
| 28 | V.3 — MLOps | 4 | 3 | 12 | — | — | — | — |
| 29 | V.4 — Fronteira e Expiração | 3 | 4 | 9 | — | — | — | — |

**Totais:** 114 objetivos · 122 exercícios hoje · **342 no alvo**.

## Medição de partida, conferida a mão

Duas correções em relação à primeira varredura, e as duas importam:

- **Aspas curvas: zero.** A primeira contagem disse 3830 porque a classe de caracteres do regex casou aspa reta. O livro usa `"` em toda parte, que é o certo em Markdown.
- **Travessão em prosa corrida: 783**, não 1087. A diferença estava em item de lista e citação, que a primeira passada somou como prosa.

| Onde | Travessões |
|---|---|
| Prosa corrida | 783 |
| Item de lista e citação | 781 |
| Célula de tabela | 248 |
| Título | 120 |
| Bloco de código | 5 |

**Perigo registrado:** há **45 sinais de menos (U+2212)** em fórmulas, em 14 arquivos. Qualquer varredura por "traço longo" que os alcance corrompe matemática. O gate de prosa nunca toca `$…$`, `$$…$$` nem bloco de código.
