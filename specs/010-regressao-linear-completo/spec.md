# Spec 010 — Capítulo II.2 (Regressão Linear): `essencial → completo`

**Branch:** `claude/regressao-linear-7ewl39` · **Raia:** plena · **Data:** 2026-09-01

> **Nota sobre o nome da branch.** A convenção do Princípio VII é `NNN-nome`; esta sessão
> remota recebeu do harness a branch `claude/regressao-linear-7ewl39` como destino
> obrigatório de push. O conflito fica registrado aqui, como a constituição pede: o ciclo
> segue o spec-kit por inteiro (spec → plan → tasks → implement), apenas o nome da branch
> vem do harness.

## O quê

Promover o capítulo [II.2 — Modelos Lineares](../../livro/capitulos/ii-2-modelos-lineares.md)
de `essencial` a `completo` — a **primeira promoção** do livro, abrindo o ciclo C5 do roadmap.

## Por quê

O ROADMAP declara C5 (`essencial → completo`) como prioridade máxima, e a fila de
verificação da [nota de pesquisa histórica](../../estudos/2026-08-10-nota-de-pesquisa-historica.md)
põe **Stigler (1981)** na posição 2: artigo único, aberto, de baixo esforço, que fecha a
disputa Gauss×Legendre e sustenta o fio 1 do livro (crédito segue comunicação). O II.2 é o
capítulo certo para estrear o portão dos sete itens: a prática (etapa 05) existe e é testada,
os laboratórios existem e têm números conferidos por teste, e a dívida D10 dele se paga com
uma leitura.

## Requisitos

- **R1 — Fontes lidas (D10 deste capítulo).** Stigler (1981) lido na íntegra; selos da
  seção "De onde isto veio" atualizados pelo que a leitura sustenta — para cima **ou para
  baixo** (o que a fonte não confirmar é rebaixado ou removido). Leitura registrada em
  `estudos/`.
- **R2 — Esqueleto v5 completo.** Entram as duas seções que o nível `essencial` não exigia:
  **"Fundamentos científicos"** (2–4 papers traduzidos para decisões, cada um validado na
  fonte e sincronizado com `bibliografia.md`) e **"O estado da arte"** (consenso, disputa,
  cláusula de expiração).
- **R3 — Experimento próprio.** Os números do caso da limonada publicados no corpo
  (correlações, coeficientes do ajuste múltiplo, R², a checagem de que nenhum mês tem dois
  preços) viram **asserção executável** em `ml-zero`, no padrão da casa: se o texto mentir,
  o teste cai.
- **R4 — Cláusula de expiração** declarada no capítulo e registrada no placar do
  `HISTORICO.md`.
- **R5 — Revisão developmental** do capítulo inteiro antes do copyedit (estrutura, ordem,
  lacunas, exercícios × objetivos).
- **R6 — Registro.** Cabeçalho promovido, edição nova no `HISTORICO.md` (com snapshot e
  modelo de IA), entrada no `CHANGELOG.md`.

## Critérios de aceite

| # | Critério | Verificação |
|---|---|---|
| A1 | Build e gates verdes | `npm run build` em `publicar/` — exit 0 |
| A2 | Gate do banco de exercícios verde | `node exercicios.mjs --verificar` — exit 0 |
| A3 | Capítulo declara `Nível: completo.` e o selo aparece na página | `grep -c "Nível: completo" livro/capitulos/ii-2-modelos-lineares.md` = 1 |
| A4 | Seções novas existem | `grep -E "^## (Fundamentos científicos|O estado da arte)"` no capítulo — 2 linhas |
| A5 | Números da limonada sob asserção | `pytest ml-zero/tests/test_etapa_05.py` — exit 0, com os testes novos presentes |
| A6 | Nenhum selo rebaixado silenciosamente | a nota de leitura em `estudos/` lista cada selo alterado, com o motivo |
| A7 | Placar de expiração ganhou a cláusula do II.2 | `grep -c "II.2" livro/HISTORICO.md` ≥ 1 na tabela do placar |
| A8 | Testes do backend seguem verdes | `pytest chat-companion/backend` — exit 0 |

## Fora de escopo

- Ler Legendre (1805) e Gauss (1809) nos originais — ficam `✓ᵐ`, com o que Stigler (lido)
  sustenta sobre eles dito **como relato de Stigler**, nunca como leitura própria.
- Promover o II.3 (Regressão Logística) ou o II.4 (Otimização) — cada promoção é uma spec.
- Vídeo novo — a cota de mídia do portão já está cumprida por dois laboratórios.
