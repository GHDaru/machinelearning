# Tasks 001 — Fundação do livro vivo de Machine Learning

**Plan:** [plan.md](plan.md) · Cada tarefa tem verificação objetiva. Sem evidência, não está feita (Princípio IX).

## Fase 1 — Maquinaria

- [x] **T101** Copiar motor de publicação, backend, spec-kit e assets do livro de Engenharia de Harness · *verif.:* árvore de arquivos
- [x] **T102** Copiar enforcement do Maestro (CI com gate de CHANGELOG, PR template, skills de processo) · *verif.:* `.github/` e `skills/` presentes
- [x] **T103** Remover o que é conteúdo do harness, não maquinaria · *verif.:* nenhuma referência a harness fora das citações de herança

## Fase 2 — Governança

- [x] **T201** Constituição de 9 princípios (didática do harness + processo do Maestro + interatividade) · *verif.:* Constitution Check do plano
- [x] **T202** `CLAUDE.md` com fluxo, raias e mapa do repositório · *verif.:* leitura
- [x] **T203** Guia Editorial com o esqueleto v4 · *verif.:* o cap. 04 o segue
- [x] **T204** `BANCO-DE-EXERCICIOS.md` documentando a sintaxe · *verif.:* exemplos batem com o parser

## Fase 3 — Estrutura

- [x] **T301** `sumario.json` com 18 capítulos em 3 partes + aparato · *verif.:* build gera 27 páginas
- [x] **T302** 15 capítulos-esqueleto com objetivos numerados e problema · *verif.:* todos com `**O1.**`
- [x] **T303** Aparato: bibliografia, glossário, videoteca, trilha, histórico, uso, autor · *verif.:* links internos OK

## Fase 4 — Interatividade

- [x] **T401** Parser `interativos.mjs`: extrair + renderizar, fonte única · *verif.:* build e extrator usam o mesmo módulo
- [x] **T402** Extrator `exercicios.mjs` com validação dura · *verif.:* `--verificar` falha em exercício quebrado
- [x] **T403** Parser ignora cercas de código · *verif.:* `BANCO-DE-EXERCICIOS.md` não gera exercício
- [x] **T404** UI (`interativos.js` + `.css`): responder, feedback, vídeo com fachada, barra de progresso · *verif.:* HTML gerado
- [x] **T405** Motor de correção `exercicios.py` — 5 tipos + revelação na 2ª tentativa · *verif.:* 8 testes
- [x] **T406** Rotas de prática e progresso em `app.py` · *verif.:* 6 testes
- [x] **T407** Tabelas de tentativa e vídeo no store, com apagamento em cascata · *verif.:* teste de exclusão
- [x] **T408** Telemetria pública com os exercícios mais difíceis · *verif.:* teste de não-vazamento de sessão

## Fase 5 — Conteúdo-piloto

- [x] **T501** Cap. 00 — Introdução (3 exercícios, 1 vídeo) · *verif.:* build
- [x] **T502** Cap. 01 — Fundamentos (3 exercícios, 1 vídeo) · *verif.:* build
- [x] **T503** Cap. 04 — Avaliação, piloto do v4 (5 exercícios, 1 vídeo) · *verif.:* build
- [x] **T504** Verificar os ids dos 3 vídeos por busca antes de citá-los · *verif.:* busca registrada na sessão
- [x] **T505** Bibliografia com 5 referências ✓ conferidas e as demais ⏳ · *verif.:* nenhuma afirmação do corpo apoiada em ⏳

## Fase 6 — Trilha

- [x] **T601** Etapa 00: geração, divisão estratificada, linha de base · *verif.:* `rodar.py`
- [x] **T602** 17 testes da etapa 00 · *verif.:* `pytest -q`
- [x] **T603** Corrigir a estratificação (bug pego pelo teste) · *verif.:* prevalência idêntica nos 3 conjuntos
- [x] **T604** Mapa das 17 etapas · *verif.:* `trilha-ml-zero.md`

## Fase 7 — Verificação e registro

- [x] **T701** Build verde sem link quebrado · *verif.:* saída do `build.mjs`
- [x] **T702** 23 testes do backend verdes · *verif.:* saída do `pytest`
- [x] **T703** ADRs 0001–0003 · *verif.:* `adr/README.md`
- [x] **T704** `CHANGELOG.md` e `HISTORICO.md` (edição 0.1 + placar de expiração + modelo de IA) · *verif.:* leitura
- [x] **T705** CI com gate de deriva do banco · *verif.:* `.github/workflows/ci.yml`

## Fora deste ciclo

Os 15 capítulos-esqueleto e as etapas 01–16 do `ml-zero`. **Uma spec por capítulo, uma spec por etapa** (Princípio VII). Ordem sugerida: 02 (dados) → 07 (ensembles) → 05/06 (lineares e otimização) → 16 (MLOps) → o resto.
