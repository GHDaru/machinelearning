# Changelog

Todas as mudanças notáveis deste projeto. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versionamento acompanha as **edições** do livro (ver [`livro/HISTORICO.md`](livro/HISTORICO.md)).

> **Gate de CI:** toda PR adiciona uma entrada em `[Unreleased]`. Bypass explícito para mudanças que não afetam o leitor: label `skip-changelog`.

## [Unreleased]

### Adicionado
- `ROADMAP.md`: o lugar único que responde "o que vem agora, em que ordem e por quê".
  Consolida o que estava espalhado em quatro artefatos (tasks da spec 001, trilha,
  histórico e README), e acrescenta o que não existia em lugar nenhum: as dívidas
  registradas, os não-objetivos e o portão de publicação de um capítulo.

### Corrigido
- `livro/videoteca.md` afirmava que o índice era gerado a partir dos capítulos.
  Não é: a fonte de cada vídeo é o bloco `:::video` do capítulo, mas a tabela é
  mantida à mão. Texto corrigido, com a automação registrada como melhoria devida.

### Documentação
- `publicar/README.md` passa a registrar o procedimento de publicação e o modo de
  falha do deploy do Pages (job barrado no portão do ambiente `github-pages`,
  falhando em segundos e sem log), com as duas causas e onde conferir cada uma.

### Alterado
- `gerar-capa.py` movido de `publicar/tema/` para `publicar/`: `tema/` é o que vai
  para o site, e ferramenta de autoria não é asset publicado. Documentado no
  README do motor, com caminhos agora relativos ao próprio script.

## [0.1.0] — 2026-08-01

### Adicionado

**Governança**
- Constituição de 9 princípios, fundindo a didática e o ciclo spec-driven do livro de Engenharia de Harness com o processo de desenvolvimento do Maestro (raias, DoD verificável, skills-primeiro, ADR, gate de CHANGELOG).
- `CLAUDE.md` com o fluxo de trabalho para humanos e agentes; skills de processo em `skills/`.
- Registros de decisão: ADR 0001 (correção no servidor), 0002 (sintaxe interativa no Markdown), 0003 (dado sintético na etapa 00).

**O livro**
- Estrutura de 18 capítulos em 3 partes, mais o aparato. Todos com objetivos de aprendizagem declarados.
- Capítulos escritos: `00 Introdução`, `01 Fundamentos` e `04 Avaliação` — este último é o piloto do esqueleto v4.
- Aparato: Guia Editorial, Banco de Exercícios, Videoteca, Bibliografia (com status de validação), Glossário, Histórico com placar de expiração, Apêndice de uso, Autor.

**Camada de interatividade** (o que distingue este livro)
- Cinco tipos de exercício — múltipla, múltipla-multi, numérica, completar e aberta por rubrica — declarados no Markdown do capítulo e **corrigidos no servidor**.
- Revelação de gabarito só na 2ª tentativa: a primeira devolve pista e a âncora da seção.
- Vídeos curados com player de fachada: nada é pedido a terceiros antes do clique do leitor.
- Barra de progresso por capítulo, espelhada em `localStorage` (funciona offline).

**Backend**
- Tutor com busca no texto do livro, gating de capacidades por capítulo, e o progresso do leitor como contexto.
- Rotas de prática: `/exercicio/tentativa`, `/exercicios`, `/video/visto`, `/progresso`.
- Telemetria anônima e consentida, com projeção pública que inclui os **exercícios mais difíceis** — o sinal que corrige o livro.
- Apagamento em cascata: `DELETE /session/{id}` remove conversas, tentativas, vídeos e objetivo.
- Tools determinísticas de ML: métricas de classificação e conferência de split.
- 23 testes verdes, sem rede e sem banco.

**Motor de publicação**
- Markdown → site navegável, com gate de links internos quebrados.
- `exercicios.mjs`: extrai o banco e valida (gabarito, feedback, objetivo existente, ids únicos). Erro de autoria é falha de build, não aviso.
- Knowledge graph do livro, derivado do conteúdo a cada build.

**Trilha `ml-zero`**
- Etapa 00 (dado, divisão estratificada e linha de base), em biblioteca padrão pura — 17 testes verdes.
- Mapa das 17 etapas, uma por capítulo.

### Notas

- 15 capítulos estão em estado de **esqueleto** (objetivos e problema definidos, corpo a escrever). Cada um entra por sua própria spec — escrevê-los fora do ciclo violaria o Princípio VII.
- A bibliografia tem 5 referências ✓ e as demais ⏳; o que está ⏳ não sustenta afirmação no corpo.
