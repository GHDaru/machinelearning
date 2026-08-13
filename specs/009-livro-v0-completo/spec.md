# Spec 009 — Livro v0 completo: voz revisada, 3 exercícios por tópico, prova final

**Data:** 2026-08-13 · **Estado:** em execução · **Branch:** `claude/ml-interactive-book-qg7tku`

## O quê

Levar os 29 capítulos ao padrão v0, um ciclo por capítulo:

1. **Voz** — aplicar a revisão de prosa decidida no ADR 0013 (não a skill `humanizer` ao pé da letra; ver o ADR).
2. **Cobertura** — 3 exercícios por tópico, na definição operacional do ADR 0014.
3. **Prova** — a avaliação de fechamento, na forma decidida no ADR 0014.
4. **Fontes** — verificar o que for verificável e atualizar os selos de procedência.

## Por quê

O pedido do autor foi *"3 exercícios para cada tópico e uma prova ao final"*, mais uma aplicação da skill `humanizer`. As duas coisas são decisões de projeto com alcance grande, e foram para comitê antes de virar trabalho.

## Medição de partida (2026-08-13)

| | |
|---|---|
| Capítulos | 29 (+12 páginas de aparato) |
| Objetivos declarados | 114 |
| Seções de conteúdo | 235 |
| Exercícios | 122 |
| Travessões | 1937 |

Onde estão os travessões, medido e não estimado:

| Onde | Quantos | Conta como voz? |
|---|---|---|
| Prosa corrida | 1087 | sim |
| Dentro de `:::exercicio` e citações | 477 | sim, e são de autoria recente |
| Células de tabela | 248 | não, é estrutura (o guia usa `—` como célula vazia) |
| Títulos | 120 | não, é o padrão `II.2 — Modelos Lineares` |
| Blocos de código | 5 | não |

Concentrações que são dano de leitura, não voz:

- **103 frases** de prosa com 2 ou mais travessões
- **20 linhas** com 3 ou mais
- **81 apostos intercalados** (`— … —`)
- **128 parágrafos com 4 ou mais trechos em negrito** (o pior: 10 num só)

## Critérios de aceite

- Todo capítulo tem 3 exercícios por tópico, conforme ADR 0014, e o gate cobra.
- Nenhuma frase de prosa com 2+ travessões; nenhum parágrafo com 4+ negritos. Gate no build.
- A prova existe na forma decidida, e não é uma repetição dos exercícios do capítulo.
- Build verde, banco em dia, testes do backend passando, notebooks rodando.
- `livro/HISTORICO.md` e `CHANGELOG.md` atualizados.

## Fora de escopo

- Reescrever a voz do livro para evadir detector de IA (ver ADR 0013 para a razão).
- Mexer em `livro/HISTORICO.md` como prosa: é registro histórico, e o ADR 0013 o isenta.

## O ledger

O progresso capítulo a capítulo fica em [`progresso.md`](progresso.md), que é a fonte da verdade deste ciclo — não a memória da sessão.
