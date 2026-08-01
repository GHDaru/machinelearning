# Spec 001 — Fundação do livro vivo de Machine Learning

**Branch:** `001-fundacao-livro-ml-interativo` · **Raia:** plena · **Data:** 2026-08-01

## O quê

Fundar o repositório do livro vivo de Machine Learning: governança, estrutura do livro, motor de publicação, backend e — a diferença em relação aos livros que o originaram — a **camada de interatividade** (exercícios corrigidos e vídeos curados).

## Por quê

Existe um livro vivo de Engenharia de Harness com didática madura (Backward Design + 4C/ID + Diátaxis + Carga Cognitiva) e um ciclo spec-driven que funciona; e existe o Maestro, com um processo de desenvolvimento cujo rigor (raias, DoD verificável, skills-primeiro) já está provado. Machine Learning é um domínio onde **ler não basta** — o modo de falha característico do estudante é a sensação de competência sem a competência, e ela não é detectável de dentro.

A resposta é um livro que **corrige o leitor**: exercícios com feedback que explica o erro, vídeos que resolvem o que o texto não resolve, e uma construção prática que obriga o conceito a virar código que roda.

## Para quem

Quem sabe programar e quer aprender ML com rigor metodológico; e quem já usa ML e quer fechar as lacunas de método (avaliação, vazamento, drift) que separam "treinei um modelo" de "opero um sistema que aprende".

## Requisitos

### R1 — Governança
- **R1.1** Constituição que funda a didática e o ciclo spec-driven do livro de harness com o processo do Maestro, adaptada ao domínio de ML.
- **R1.2** `CLAUDE.md` operacional; skills de processo disponíveis; templates spec-kit prontos.
- **R1.3** Gates mecânicos na CI: build, testes, banco de exercícios, CHANGELOG.

### R2 — Estrutura do livro
- **R2.1** Sumário completo de capítulos, em partes, com teasers.
- **R2.2** **Todo** capítulo com objetivos de aprendizagem declarados e numerados (`O1`, `O2`…), inclusive os ainda não escritos — Backward Design exige que os objetivos venham primeiro.
- **R2.3** Ao menos um capítulo escrito por inteiro, servindo de piloto do formato.
- **R2.4** Aparato completo: guia editorial, bibliografia com status, glossário, histórico com placar de expiração.

### R3 — Interatividade (o requisito distintivo)
- **R3.1** Exercícios declarados no Markdown do capítulo, em ao menos 4 tipos, incluindo resposta aberta.
- **R3.2** A página renderizada **não** contém gabarito, feedback nem rubrica.
- **R3.3** Correção no backend, com feedback explicativo; gabarito revelado só após a 2ª tentativa.
- **R3.4** Todo exercício rastreia até um objetivo declarado do capítulo; violação é erro de build.
- **R3.5** Vídeos com autor, duração e justificativa obrigatória; player não contata terceiros antes do clique.
- **R3.6** Progresso anônimo, sem cadastro, apagável em uma ação.

### R4 — Backend
- **R4.1** Tutor ancorado no texto do livro, com gating de capacidades por capítulo.
- **R4.2** Rotas de prática e progresso.
- **R4.3** Telemetria anônima e consentida, com projeção pública que exponha os exercícios mais errados.
- **R4.4** Sobe sem chave e sem banco (fallbacks: echo + memória).

### R5 — Trilha prática
- **R5.1** Mapa das etapas, uma por capítulo.
- **R5.2** Etapa 00 pronta, testada, rodando sem rede e sem dependência externa.

## Critérios de aceite

| # | Critério | Como se verifica |
|---|---|---|
| A1 | O site constrói sem link interno quebrado | `node publicar/build.mjs` sai 0 |
| A2 | Exercício sem gabarito, feedback ou objetivo válido **falha o build** | `node publicar/exercicios.mjs --verificar` sai ≠0 no caso de erro |
| A3 | O HTML publicado não contém gabarito | busca por `gabarito`/`volte para` no `docs/*.html` retorna vazio |
| A4 | 1ª tentativa errada não revela a resposta; a 2ª revela | teste automatizado |
| A5 | Sem backend, o exercício degrada de forma honesta | inspeção do caminho de erro em `interativos.js` |
| A6 | Apagar a sessão apaga o progresso | teste automatizado |
| A7 | Backend verde sem rede e sem banco | `pytest` sai 0 |
| A8 | Etapa 00 roda e reproduz os mesmos números | `pytest` + `rodar.py` |
| A9 | Bibliografia distingue verificado de não verificado | inspeção: nenhuma afirmação do corpo apoiada em ⏳ |

## Fora de escopo

- Escrever os 15 capítulos restantes — **cada um é uma spec própria** (Princípio VII).
- Tradução para inglês.
- Autenticação de leitor e progresso entre dispositivos (ver ADR 0001, alternativa B).
- Execução de código do leitor no servidor (exercícios de código são *completion problems*; a construção livre vive no `ml-zero`, na máquina do leitor).

## Ambiguidades resolvidas

| Pergunta | Resolução |
|---|---|
| O gabarito estar no repositório público não anula esconder do HTML? | Não. O objetivo não é sigilo, é não pôr a resposta no caminho. Registrado no ADR 0001 e dito ao leitor no Banco de Exercícios. |
| Capítulos-esqueleto violam o mínimo de 3 exercícios? | Não: o portão vale na **publicação** do capítulo. O esqueleto declara-se como tal e cita o portão que precisará cumprir. |
| Como citar sem verificar tudo agora? | Marcando: ✓ verificado, ⏳ a conferir. O que está ⏳ não sustenta afirmação no corpo. |
