# Spec 006 — Sessão de pesquisa histórica + trilha de Análise Preditiva ao nível `essencial`

**Status:** em andamento · **Aberta em:** 2026-08-10 · **Raia:** plena

## O quê

Duas entregas encadeadas, nesta ordem — e a ordem é o ponto:

1. **Uma sessão de pesquisa histórica** (não uma por capítulo), produzindo uma nota em `estudos/` que cobre a origem dos métodos da trilha de Análise Preditiva **e** o que se sobrepõe aos capítulos já escritos.
2. **Os oito capítulos da trilha de Análise Preditiva** ao nível `essencial`, cada um **já nascendo com** a seção "De onde isto veio" e seus selos.

## Por quê

**A disciplina está em curso.** A trilha de Análise Preditiva tem oito buracos, e material ausente hoje custa aula; material aprofundado depois não custa nada. Isso torna o C1 a prioridade máxima do roadmap.

**Mas escrever os oito sem a pesquisa dobraria a dívida.** A emenda 1.2.0 (Princípio X) exige "De onde isto veio" a partir do nível `essencial`. Oito capítulos novos escritos sem ela seriam oito dívidas criadas na semana seguinte à emenda que as proíbe, somando-se às oito já registradas em **D8**.

**E a pesquisa fatiada perde o que a pesquisa junta encontra.** É a regra do próprio Princípio X, e no recorte desta trilha ela é literal: Tukey (EDA) → a tradição gráfica (Playfair, Bertin, Tufte) → Codd (OLAP) → Box–Jenkins (séries) não são quatro histórias, são uma linha. Quem pesquisa capítulo a capítulo publica os dois lados sem a ligação.

## Escopo

### Capítulos da trilha (nível `essencial`)

| Capítulo | Unidade da ementa |
|---|---|
| 19 — O Ciclo da Ciência de Dados | I |
| 20 — Coleta e Integração | I |
| 21 — Análise Exploratória | II |
| 22 — Visualização e Storytelling | II |
| 23 — Análise Multidimensional | II |
| 24 — Séries Temporais | III |
| 25 — Do Modelo à Decisão | III |
| 03 — Representação | III |

### A nota de pesquisa

Cobre os métodos acima **e** os dos capítulos com corpo (00, 01, 02, 04, 05, 06, 07) — a sobreposição é grande e pesquisar duas vezes é desperdício. Termina com a **fila de verificação**, ordenada por quanta dúvida cada fonte fecha por unidade de esforço.

## Critérios de aceite

- **CA1** A nota existe em `estudos/`, com uma entrada por método, cada afirmação histórica com selo (✓ / ✓ᵐ / ⏳ / ❌ / 📖) e identificador quando houver.
- **CA2** A nota termina com a fila de verificação **ordenada e justificada** — não uma lista de desejos.
- **CA3** Cada um dos 8 capítulos tem: cabeçalho com data e **nível declarado**, objetivos numerados, o problema, **"De onde isto veio"** nos cinco elementos com tabela de selos, corpo ensinável, ≥2 exercícios ligados a objetivos, síntese e verificação.
- **CA4** A seção histórica de cada capítulo entrega o **quarto elemento** — a ideia reaproveitável. Um capítulo sem ele não passa: é o elemento que justifica a seção existir.
- **CA5** Nenhuma afirmação histórica sem selo. `❌` é resultado aceitável; afirmação sem procedência não é.
- **CA6** Build verde, links internos OK, gate de exercícios passando, `CHANGELOG` e `HISTORICO` atualizados.
- **CA7** A dívida **D8/D9** é atualizada com o que de fato foi pago — não zerada por otimismo.

## Fora de escopo

- Promover qualquer capítulo a `completo` (isso é o C5: experimento próprio, fontes ✓, expiração, revisão developmental).
- O retrofit dos 8 capítulos antigos. A **pesquisa** os cobre, para não pesquisar duas vezes; a **escrita** do retrofit fica no C8.
- Etapas novas do `ml-zero` (C6).

## Riscos declarados

| Risco | Mitigação |
|---|---|
| **Inventar história** — o risco central do Princípio X; história inventada soa bem | Selo obrigatório por afirmação; `❌` permitido; nada de resumo de busca como fonte |
| **Volume**: 8 capítulos numa rodada tenderia a corpo raso | O nível é `essencial` e está **declarado ao leitor**; profundidade é o C5 |
| **Resumo de busca confundido com fonte** | Regra do princípio: se a afirmação importa, abrir o texto. Sem abrir, o selo é ✓ᵐ ou ⏳ — nunca ✓ |
