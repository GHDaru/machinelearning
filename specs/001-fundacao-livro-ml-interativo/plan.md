# Plan 001 — Fundação do livro vivo de Machine Learning

**Spec:** [spec.md](spec.md) · **Raia:** plena · **Data:** 2026-08-01

## Constitution Check (portão)

| Princípio | Como este plano cumpre | Risco |
|---|---|---|
| **I — Evidência acima de retórica** | Números do cap. 04 vêm de matriz calculada no próprio texto; a linha de base do `ml-zero` vem de `rodar.py`. Bibliografia com status; 5 referências ✓ conferidas na fonte, demais ⏳ e **proibidas de sustentar afirmação**. | Tentação de citar de memória ao escrever os esqueletos. Mitigado: o esqueleto não cita. |
| **II — Fonte-base é o experimento** | Etapa 00 gera os números que o cap. 01 usa. Seed fixa, sem rede. | — |
| **III — Método pedagógico** | Esqueleto v4 obrigatório; cap. 04 é o piloto. Objetivos declarados em **todos** os capítulos, inclusive esqueletos. | — |
| **IV — Livro vivo** | Selo de captura nos capítulos escritos; `HISTORICO.md` com placar de expiração (2 cláusulas abertas) e versão do modelo de IA registrada. | — |
| **V — Segurança e dados** | Zero segredos; `.env.example` sem valores; dado sintético na etapa 00; progresso anônimo com apagamento em cascata. | Rota de correção pode virar superfície de abuso. Mitigado: rate limit por sessão e IP. |
| **VI — Neutralidade e acessibilidade** | Etapa 00 só com biblioteca padrão; backend sobe sem chave; vídeos gratuitos. | — |
| **VII — Spec-driven e raias** | Este ciclo é raia plena, com spec/plan/tasks. Os 15 capítulos restantes ficam **fora de escopo**, um por spec. | Tentação de "só escrever mais um capítulo". Explicitamente barrada no escopo. |
| **VIII — Interatividade verificável** | 5 tipos de exercício; correção no servidor; feedback obrigatório; rastreio a objetivo com gate de build; vídeo com justificativa obrigatória. | — |
| **IX — DoD verificável** | Build verde, 23 + 17 testes verdes, gate do banco, CHANGELOG, saídas coladas no PR. | — |

**Veredito:** aprovado. Nenhuma violação; o risco de I e VII está barrado pelo escopo declarado.

## Decisões de arquitetura

| Decisão | Onde | ADR |
|---|---|---|
| Correção no servidor, não no cliente | `chat-companion/backend/exercicios.py` | [0001](../../adr/0001-correcao-de-exercicios-no-servidor.md) |
| Sintaxe interativa dentro do Markdown | `publicar/interativos.mjs` | [0002](../../adr/0002-sintaxe-interativa-no-markdown.md) |
| Dado sintético na etapa 00 | `ml-zero/etapa-00/dados.py` | [0003](../../adr/0003-dado-sintetico-na-etapa-00.md) |

### O parser como fonte única

`publicar/interativos.mjs` é consumido por dois lados com recortes diferentes: o motor renderiza **sem** gabarito; o extrator gera o banco **com** tudo. Um só parser garante que não há como divergirem — se houvesse dois, a divergência seria questão de tempo.

### Publicação em duas metades

O site é estático (GitHub Pages); a interatividade é uma chamada a um backend separado. Sem backend, o livro degrada para estático **e diz isso**. Essa degradação honesta é requisito (A5), não cortesia.

## Fases

| Fase | O que entra | Verificação |
|---|---|---|
| 1 — Maquinaria | Copiar e adaptar motor, backend, spec-kit, CI | build roda |
| 2 — Governança | Constituição, CLAUDE.md, guia editorial, banco de exercícios (doc) | leitura + Constitution Check |
| 3 — Estrutura | Sumário, 18 capítulos com objetivos, aparato | build gera 27 páginas |
| 4 — Interatividade | Parser, extrator, UI, rotas, store, testes | A2–A6 verdes |
| 5 — Conteúdo-piloto | 00, 01, 04 escritos; 11 exercícios; 3 vídeos verificados | A3 e A9 |
| 6 — Trilha | Etapa 00 + testes | A8 |
| 7 — Verificação e registro | DoD, CHANGELOG, HISTORICO, ADRs | A1–A9 |

## Riscos

| Risco | Resposta |
|---|---|
| Referência fabricada pelo modelo de IA | Status ✓/⏳ obrigatório; ⏳ não sustenta afirmação. Vídeos com id conferido por busca antes de entrar. |
| Backend fora do ar degrada o livro | Degradação honesta e explícita; livro segue legível. |
| Documentação da sintaxe virar exercício de verdade | O parser ignora cercas de código. **Aconteceu**, foi pego pelo gate e está corrigido — registrado no ADR 0002. |
| Escopo escorregar para escrever mais capítulos | Fora de escopo explícito na spec; cada capítulo é uma spec. |
