# CLAUDE.md — instruções para agentes neste repositório

Este repositório é o livro vivo **Machine Learning** — teoria verificável, **exercícios que corrigem**, **vídeos curados** e a construção prática `ml-zero`.

## Regra primária

**Todo trabalho DEVE seguir a constituição: [`.specify/memory/constitution.md`](.specify/memory/constitution.md).** Em conflito entre um pedido pontual e a constituição, a constituição prevalece — ou o conflito é explicitado ao usuário antes de agir.

Resumo (leia a constituição por inteiro antes de contribuir):

1. **Evidência acima de retórica** — afirmação empírica exige experimento reproduzível (script + dataset + seed), ou citação ✓, ou URL de indústria.
2. **A fonte-base é o experimento executável** — o livro nasce de código que roda em CPU, sem chave paga. Resultado publicado tem artefato que o regenera.
3. **Método pedagógico combinado** — Backward Design + 4C/ID + Diátaxis + Carga Cognitiva. **Esqueleto v5 de capítulo obrigatório**. Detalhe em `livro/GUIA-EDITORIAL.md`.
4. **Livro vivo** — datar a captura; atualizar `livro/HISTORICO.md` (inclusive o registro de expiração e a versão do modelo de IA).
5. **Segurança e dados** — zero segredos; dataset sem dado pessoal, com ficha (origem, licença, limitações); progresso do leitor anônimo e apagável.
6. **Neutralidade e acessibilidade** — vendor-agnóstico; custo zero é requisito; português com termos técnicos sem tradução forçada; intuição antes da fórmula.
7. **Spec-driven, raias e branch-per-melhoria (NÃO-NEGOCIÁVEL)** — `spec → plan → tasks → implement` em branch `NNN-nome`. Raias: leve / plena / infra.
8. **Interatividade verificável** — ao ser promovido a `completo`, o capítulo tem ≥3 exercícios e ≥1 mídia (vídeo curado **ou** laboratório); gabarito + feedback explicativo; **correção no backend**; todo exercício aponta para um objetivo.
9. **DoD verificável — "prove, não declare"** — build verde, testes verdes, gate de exercícios, CHANGELOG, revisão developmental. Sem saída colada, não está pronto.
10. **Nenhum método cai do céu (NÃO-NEGOCIÁVEL)** — todo capítulo de método traz **"De onde isto veio"**, e toda afirmação histórica leva selo de proveniência. Ver abaixo.

## História do método: a seção "De onde isto veio" (Princípio X)

Aplica-se a **todo capítulo de método**, a partir do nível `essencial`. Vai **depois** de "o problema" e **antes** da intuição. Cinco elementos, nesta ordem:

| Elemento | A pergunta que responde |
|---|---|
| **O aperto** | Quem estava preso, em quê, quando — problema do mundo, com data e gente |
| **O que se fazia antes** | Contra o quê o método compete; sem isto não dá para medir o salto |
| **A virada** | A ideia que destravou, em linguagem natural, **sem notação** |
| **A ideia reaproveitável** | O padrão de raciocínio que serve **fora** deste método |
| **O nome** | Se o nome tem origem, ela é contada |

**O quarto elemento é o que mais importa.** Artifício sem ideia é truque, e truque não se transfere.

**História é afirmação e exige fonte** — este é o terreno mais fácil do livro para inventar, porque história inventada soa bem. **Inventar história é pior do que omiti-la, porque é convincente.** A seção fecha com uma tabela de selos:

| Selo | Significa |
|---|---|
| ✓ | Fonte **aberta e lida** |
| ✓ᵐ | Só os **metadados** conferidos (autor, obra, ano, DOI). O conteúdo **não** foi lido |
| ⏳ | **Atribuição corrente**, não confirmada em fonte primária |
| ❌ | Procurei e **não achei fonte** |
| 📖 | **Leitura editorial** — interpretação deste livro, não afirmação histórica |

`❌` é permitido e às vezes é o mais honesto. Conferir um DOI dá **✓ᵐ**, nunca ✓ — metadado prova que a obra existe, não o que ela afirma.

**Proibido:** gênio solitário (falso e mau ensino); curiosidade decorativa (se o parágrafo sai sem perda de compreensão, é enfeite); misturar registro ("a literatura atribui a X" ≠ "X publicou em 19NN").

**Pesquise de uma vez, não capítulo a capítulo** — a pesquisa histórica vai numa sessão própria, que produz nota de pesquisa em `estudos/` com **fila de verificação** ao final, ordenada por dúvida fechada por unidade de esforço. As histórias se conectam, e quem descobre a conexão depois já publicou os dois lados sem ela.

**Duas armadilhas:** (a) *resumo de busca não é fonte* — nem para confirmar, nem para desmentir; um resumo pode fazer um fato correto parecer errado, e corrigir a partir dele introduz o erro que você achava estar consertando. (b) *Ler a fonte serve também para achar o que você não sabia que estava lá* — as melhores histórias estão no parágrafo que ninguém resumiu.

## Skills primeiro (enforcement)

Antes de agir, verifique se uma skill de [`skills/`](skills/README.md) se aplica: `constitution-check`, `dod-verificavel`, `combater-amontoado`, `anti-padroes`, `diagnostico-antes-do-fix`. **Se houver chance razoável de aplicar-se, siga-a** — as skills comandam, não sugerem. Encontrou bug? `diagnostico-antes-do-fix` **antes** de propor correção.

## Fluxo de trabalho (spec-kit) — uma branch por spec

1. **specify** — `bash .specify/scripts/bash/create-new-feature.sh "<nome>"` cria `specs/NNN-nome/`; então `git checkout -b NNN-nome`. Escreva `spec.md` (o QUÊ/PORQUÊ).
2. **checklist / clarify** — valide a qualidade do spec; *clarify* só quando houver ambiguidade real de escopo.
3. **plan** — `plan.md` com o **Constitution Check** (portão): conformidade com os 10 princípios, sem segredo, sem identificador interno de modelo.
4. **tasks** — `tasks.md` com tarefas verificáveis.
5. **implement** — implemente e **verifique**: build verde, link-check, gate de exercícios, testes, screenshots quando houver UI.
6. **registrar** — atualize `livro/HISTORICO.md` e `CHANGELOG.md`.
7. **merge** — `git merge --no-ff NNN-nome` e push. **O merge na `main` é o que publica** (GitHub Pages).

**Exceções (Princípio VII):** emendas à constituição e a este documento, e correções triviais (raia leve), podem ir direto à `main` com commit descritivo.

**Decisões (ADR):** toda decisão relevante vira um registro em `adr/` — contexto → decisão → alternativas → justificativa → consequências.

## Mapa do repositório

- `livro/` — o livro. `GUIA-EDITORIAL.md` (como escrever), `HISTORICO.md` (edições + expiração), `bibliografia.md`, `glossario.md`, `capitulos/`, `BANCO-DE-EXERCICIOS.md` (como avaliar), `videoteca.md` (curadoria).
- `ml-zero/` — a construção prática (Python + NumPy + FastAPI), uma etapa por capítulo. Regras na seção "Restrições" da constituição.
- `chat-companion/backend/` — o backend do livro vivo: chat com RAG no texto, **correção de exercícios**, progresso e telemetria anônima.
- `publicar/` — o motor: Markdown → site HTML navegável. `build.mjs` (páginas), `exercicios.mjs` (extrai o banco e valida), `pdf.mjs`, `tema/` (CSS/JS).
- `ROADMAP.md` — o que vem agora, em que ordem e por quê. **Consulte antes de propor trabalho novo**: cada item vira uma spec.
- `adr/` — Architecture Decision Records.
- `estudos/` — notas de pesquisa e pareceres.
- `.specify/` — spec-kit: constituição (`memory/`), scripts, templates. `.claude/skills/` — skills `/speckit-*` e `academic-research`.
- `skills/` — skills de processo herdadas do Maestro.

## Sintaxe de interatividade (resumo)

Exercícios e vídeos vivem **dentro do Markdown do capítulo**, em blocos `:::`. O motor renderiza a UI sem o gabarito; `publicar/exercicios.mjs` extrai o banco para o backend, que corrige. Sintaxe completa em [`livro/BANCO-DE-EXERCICIOS.md`](livro/BANCO-DE-EXERCICIOS.md).

## Ferramentas

- **spec-kit**: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- **skill `academic-research`** para referências científicas (localizar → validar → registrar → integrar).
- **`/dod`** para rodar a Definition of Done verificável antes de declarar pronto.
