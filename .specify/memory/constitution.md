# Constituição — Livro vivo de Machine Learning

> A lei do projeto. Todo trabalho (capítulo, exercício, vídeo, etapa do `ml-zero`, código do backend, pesquisa) segue estes princípios. Em conflito entre um pedido pontual e a constituição, a constituição prevalece — ou o conflito é explicitado antes de agir.
>
> Documentos operacionais: `livro/GUIA-EDITORIAL.md` (como escrever), `livro/BANCO-DE-EXERCICIOS.md` (como avaliar), `ml-zero/README.md` (como construir).
>
> **Herança declarada.** A **didática** e o **ciclo spec-driven** vêm do livro [Engenharia de Harness](https://github.com/GHDaru/harness_engineering); o **processo de desenvolvimento** (raias, Definition of Done verificável, skills-primeiro, ADR, gate de CHANGELOG) vem do [Maestro](https://github.com/GHDaru/maestro). Este documento é a fusão dos dois, adaptada ao domínio de Machine Learning.

## Princípios centrais

### I. Evidência acima de retórica (NÃO-NEGOCIÁVEL)

Toda afirmação empírica sobre um método de Machine Learning exige **evidência de uma destas três formas**:

1. **Experimento reproduzível** — caminho do script/notebook no repositório, com dataset identificado, *seed* fixa e o número que a afirmação cita. "Boosting costuma ganhar de floresta aleatória em dados tabulares" só entra com o experimento que mediu isso.
2. **Citação científica validada** — status ✓ em `livro/bibliografia.md`, conferida contra a fonte primária (DOI/arXiv verificado, nunca só lembrado).
3. **Fonte de indústria** — URL verificável (documentação oficial, *model card*, *dataset card*, post de engenharia).

Números sem procedência não entram no corpo do livro. Intuição sem evidência é marcada como intuição — e vive na prosa, nunca numa tabela de resultados.

### II. A fonte-base é o experimento executável

O livro nasce de **código que roda**: a trilha `ml-zero` e os notebooks de apoio são a espinha empírica. A teoria contextualiza e generaliza; não substitui a execução. Todo resultado numérico publicado tem um artefato que o regenera do zero — em CPU, sem chave paga.

Corolário: **nenhum resultado é copiado de terceiros sem reexecução**, salvo citação explícita e datada ("o paper reporta X; não reexecutamos").

### III. Método pedagógico combinado (o framework do livro)

Todo capítulo e toda etapa da construção seguem a combinação:

- **Backward Design** (Wiggins & McTighe): escrever de trás para frente — objetivos (verbos de Bloom) → evidências de aprendizado (exercícios/verificação) → só então o conteúdo.
- **4C/ID** (van Merriënboer): a trilha `ml-zero` é a espinha — etapas = *learning tasks* (tarefas inteiras); capítulos = *supportive information*; boxes no código = *just-in-time*; exercícios = *part-task practice*.
- **Diátaxis** (Procida): quatro tipos de texto, **nunca misturados** na mesma seção — capítulos = *explanation*, `ml-zero` = *tutorial*, banco de exercícios e fichas de dataset = *reference*, "receitas" = *how-to*.
- **Carga Cognitiva** (Sweller): *worked example* antes do exercício; *completion problems* ("complete", não "crie do zero"); *fading* do andaime capítulo a capítulo; **uma ideia nova por vez**.

O **esqueleto v4 de capítulo** (ver Guia Editorial) é a materialização deste princípio e é obrigatório. Ele estende o esqueleto v3 do livro de harness com as duas seções de interatividade — **Pratique** (exercícios) e **Assista** (vídeos).

### IV. Livro vivo (datação, expiração e interatividade viva)

O que se descreve é temporário — e em Machine Learning o prazo é curto. Regras:

- Todo capítulo declara **data de captura** no cabeçalho.
- Distinguem-se três datas: do **evento** (fato histórico, imutável), da **captura** (quando fotografamos o estado da arte) e do **experimento** (quando o número foi medido, com a versão da biblioteca).
- Toda edição atualiza `livro/HISTORICO.md`, incluindo o **registro de expiração** — o placar das previsões (🔵 aberta / 🟡 em curso / 🟢 confirmada / 🔴 refutada), com evidência datada.
- Toda edição registra a **versão do modelo de IA** usada, porque saídas de LLM são não-determinísticas e rastreabilidade é parte do rigor.
- **Exercícios e vídeos também expiram**: exercício cujo gabarito depende de uma versão de biblioteca declara essa versão; vídeo com link morto é substituído ou removido na janela de revisão.

### V. Segurança, credenciais e dados

- Nenhum segredo (chave de API, token, senha) entra em arquivo, commit ou texto publicado — **nunca**. Credenciais vivem só em ambiente / `.env` gitignored. Chave exposta é chave comprometida: alertar e orientar revogação.
- **Dado didático é dado limpo**: nenhum dataset com dado pessoal identificável entra no livro. Datasets usados declaram origem, licença e limitações conhecidas (ficha de dataset). Datasets com histórico documentado de viés problemático só entram *como objeto de estudo do viés*, nunca como exemplo neutro.
- O progresso do leitor (exercícios, vídeos, conversas) é **anônimo por identidade de navegador**, apagável a qualquer momento pelo próprio leitor, e nunca exige cadastro.

### VI. Neutralidade e acessibilidade

- Vendor-agnóstico: nenhuma biblioteca ou nuvem é favorecida por marca; comparações declaram versão e protocolo.
- **Custo zero é requisito, não cortesia**: toda a trilha prática roda em CPU, em máquina modesta ou em *notebook* gratuito. Nada exige GPU paga; onde a GPU muda o resultado, isso é dito e o caminho barato é oferecido.
- Prosa em português; termos técnicos consagrados (*overfitting*, *embedding*, *batch*, *drift*) **sem tradução forçada** — traduz-se quando o termo em português já é o usado na prática (viés, variância, acurácia).
- Matemática é bem-vinda, mas **sempre precedida da intuição** e seguida do código: fórmula órfã é ruído de carga cognitiva.

### VII. Spec-driven, raias e branch-per-melhoria (NÃO-NEGOCIÁVEL)

**Toda melhoria passa pelo spec-kit — `spec` → `plan` → `tasks` → `implement` — em sua própria branch `NNN-nome`.** Não há "só editar direto no main".

As **raias** (herdadas do Maestro) calibram o peso do ciclo:

| Raia | O que é | Artefato mínimo |
|---|---|---|
| **Leve** | typo, link quebrado, ajuste de uma linha | o próprio PR é o artefato |
| **Plena** | capítulo, lote de exercícios, etapa do `ml-zero`, feature do backend | spec + plan (Constitution Check) + tasks |
| **Infra** | deploy, banco, CI, migração de dados | sempre plena + gates de reversibilidade (backup, *dry-run*, rollback, aprovação humana) |

Exceção única: emendas a *esta constituição* podem ser feitas diretamente — são o meta-nível que habilita a própria regra —, sempre registradas aqui e no `HISTORICO.md`.

### VIII. Interatividade verificável (o que distingue este livro)

Ler não é aprender. O livro só cumpre seu papel se o leitor **pratica** e **recebe resposta**. Portanto:

1. **Todo capítulo entrega no mínimo 3 exercícios e 1 vídeo**, ligados aos objetivos declarados no item 1 do esqueleto. Capítulo sem prática não é publicável.
2. **Todo exercício tem gabarito e feedback explicativo.** Feedback que só diz "errado" é proibido: ele diz *por que* a alternativa escolhida falha e para onde voltar no texto.
3. **A correção acontece no backend**, não no HTML. A página nunca carrega o gabarito; a resposta do leitor é avaliada por uma regra determinística (múltipla escolha, numérica, completar) ou por rubrica escrita (resposta aberta, avaliada pelo LLM contra critérios explícitos).
4. **Todo exercício rastreia até um objetivo de aprendizagem.** Exercício órfão — que não testa nenhum objetivo do capítulo — não entra.
5. **Vídeo é curadoria, não enchimento**: cada vídeo declara autor, duração e *o que ele resolve* que o texto não resolve. Entra com link verificado e é reconferido na janela de revisão.
6. **O progresso é do leitor** (Princípio V): anônimo, exportável, apagável. A telemetria agregada existe para melhorar o livro — quais exercícios erram mais é o sinal mais valioso que este projeto coleta.

### IX. Definition of Done verificável — "prove, não declare"

Nada é dado por pronto sem **evidência anexada**. O checklist vive em `.github/pull_request_template.md`; o que é mecânico é *hard gate* na CI:

- Build do livro **verde** (`node publicar/build.mjs`), sem link interno quebrado.
- Testes do backend **verdes** (`pytest chat-companion/backend`).
- **Gate de exercícios**: todo exercício declarado no Markdown compila para o banco, com gabarito, feedback e objetivo associado (`node publicar/exercicios.mjs --verificar`).
- Entrada no `CHANGELOG.md` (bypass explícito: label `skip-changelog`).
- **Revisão developmental** feita antes do copyedit — re-ver estrutura e sentido, não trocar palavras na superfície. "Escrever é reescrever."
- Datação e `HISTORICO.md` atualizados quando o estado da arte mudou.

Declarar "testado" sem colar a saída é violação deste princípio.

## Restrições da construção (`ml-zero`)

1. **Do zero antes da biblioteca** — todo algoritmo central é implementado uma vez em NumPy, com o mínimo necessário para funcionar, *antes* de aparecer a chamada de uma linha do scikit-learn/PyTorch. O leitor precisa ver o motor antes de dirigir o carro.
2. **Arquitetura por refatoração** — cada porta (dados, modelo, avaliação, serviço) nasce da dor da etapa correspondente; nunca estrutura antecipada.
3. **Anti-apodrecimento** — dependências mínimas e fixadas; etapas autocontidas e executáveis; erros didáticos deliberados são **comentados como tal** no código.
4. **Reprodutibilidade** — *seed* fixa, versões declaradas, dataset obtido por script versionado. Rodar duas vezes dá o mesmo número, ou o texto explica por que não dá.
5. **Serviço desde cedo** — o modelo vira endpoint (Python + FastAPI) já nas primeiras etapas: um modelo que não serve ninguém é um exercício, não um sistema.

## Fluxo de trabalho e portões de qualidade

- Toda melhoria usa o spec-kit (Princípio VII), na raia correspondente, em branch `NNN-nome`.
- **Skills primeiro**: antes de agir, verifique se uma skill de `skills/` se aplica (constitution-check, dod-verificavel, combater-amontoado, anti-padroes, diagnostico-antes-do-fix). Encontrou bug? `diagnostico-antes-do-fix` **antes** de propor correção.
- Pesquisa científica segue a skill `academic-research` (localizar → validar → registrar → integrar).
- **Decisões viram ADR** em `adr/`: contexto → decisão → alternativas avaliadas → justificativa → consequências.
- Commits descrevem o *porquê*; o repositório é o registro. Push só quando o trabalho está coerente.

## Governança

Esta constituição prevalece sobre preferências pontuais. Emendas são registradas aqui e no `livro/HISTORICO.md`. O `CLAUDE.md` da raiz aponta para este documento como fonte de autoridade.

**Versão**: 1.0.0 | **Ratificada**: 2026-08-01 | **Última emenda**: — (versão inicial; deriva da constituição 1.2.0 do livro de Engenharia de Harness e do modelo operacional do Maestro)
