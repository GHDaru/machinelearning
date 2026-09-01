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

O **esqueleto v5 de capítulo** (ver Guia Editorial) é a materialização deste princípio e é obrigatório. Ele estende o v4 — que já acrescentara ao v3 do livro de harness as duas seções de interatividade, **Pratique** e **Assista** — com a seção histórica **"De onde isto veio"** exigida pelo Princípio X.

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

1. **Todo capítulo, ao atingir o nível `completo`, entrega no mínimo 3 exercícios e 1 elemento de mídia** — vídeo curado **ou** laboratório interativo —, ligados aos objetivos declarados. Ver "Níveis de maturidade" abaixo: o portão vale na promoção a `completo`, não em cada commit.
2. **Todo exercício tem gabarito e feedback explicativo.** Feedback que só diz "errado" é proibido: ele diz *por que* a alternativa escolhida falha e para onde voltar no texto.
3. **A correção acontece no backend**, não no HTML. A página nunca carrega o gabarito; a resposta do leitor é avaliada por uma regra determinística (múltipla escolha, numérica, completar) ou por rubrica escrita (resposta aberta, avaliada pelo LLM contra critérios explícitos).
4. **Todo exercício rastreia até um objetivo de aprendizagem.** Exercício órfão — que não testa nenhum objetivo do capítulo — não entra.
5. **Vídeo é curadoria, não enchimento**: cada vídeo declara autor, duração e *o que ele resolve* que o texto não resolve. Entra com link verificado e é reconferido na janela de revisão. **Quando não houver vídeo verificável para um tema, um laboratório interativo cumpre o requisito** — inventar uma referência para preencher a cota é violação do Princípio I.
6. **Laboratório é a terceira superfície.** Exercício pergunta e corrige; vídeo mostra; **laboratório deixa manipular**. Ele roda inteiro no navegador — não há gabarito a esconder, porque o gabarito é o comportamento do próprio objeto. Consequência prática: laboratórios funcionam mesmo com o backend fora do ar. Todo laboratório declara o que manipulá-lo ensina e o que o leitor deve **descobrir sozinho**.
7. **O progresso é do leitor** (Princípio V): anônimo, exportável, apagável. A telemetria agregada existe para melhorar o livro — quais exercícios erram mais é o sinal mais valioso que este projeto coleta.

### Níveis de maturidade de um capítulo

Um livro que serve a disciplinas em andamento precisa de **cobertura antes de profundidade** — um capítulo que existe de forma honesta vale mais para o estudante do que um capítulo ausente. Mas cobertura sem rigor é exatamente o que este projeto recusa. A conciliação é declarar o nível, capítulo a capítulo, no cabeçalho e no `HISTORICO.md`:

| Nível | O que garante | O que **não** garante |
|---|---|---|
| **esqueleto** | Objetivos de aprendizagem e o problema, declarados | corpo, prática, fontes |
| **essencial** | Corpo legível e ensinável, ≥2 exercícios, síntese e verificação, **"De onde isto veio" com selos** (Princípio X) | experimentos próprios, todas as fontes ✓, selos ✓ᵐ podem virar ✓ |
| **completo** | O portão dos sete itens (ver Guia Editorial): ≥3 exercícios, mídia, experimento reproduzível, fontes ✓, expiração, revisão developmental | — |

**Onde o Princípio X passa a valer.** A seção "De onde isto veio" é portão de **`essencial`** — é ali que o capítulo ganha corpo, e um corpo sem a origem do método é o procedimento avulso que o princípio proíbe. Capítulos escritos antes desta emenda não a têm: essa dívida é **declarada no roadmap**, capítulo a capítulo, e não se apaga promovendo nível sem pagá-la. Um capítulo `esqueleto` não precisa da seção, mas o seu spec já nasce com ela na lista de tarefas.

**A regra que impede a degradação:** um capítulo em nível `esqueleto` ou `essencial` **diz isso ao leitor**, em destaque, no próprio cabeçalho. O leitor sempre sabe o que está lendo. Baixar o rigor em silêncio seria fraude; declarar o nível é honestidade — e cria a dívida visível que o roadmap cobra.

### IX. Definition of Done verificável — "prove, não declare"

Nada é dado por pronto sem **evidência anexada**. O checklist vive em `.github/pull_request_template.md`; o que é mecânico é *hard gate* na CI:

- Build do livro **verde** (`node publicar/build.mjs`), sem link interno quebrado.
- Testes do backend **verdes** (`pytest chat-companion/backend`).
- **Gate de exercícios**: todo exercício declarado no Markdown compila para o banco, com gabarito, feedback e objetivo associado (`node publicar/exercicios.mjs --verificar`).
- Entrada no `CHANGELOG.md` (bypass explícito: label `skip-changelog`).
- **Revisão developmental** feita antes do copyedit — re-ver estrutura e sentido, não trocar palavras na superfície. "Escrever é reescrever."
- Datação e `HISTORICO.md` atualizados quando o estado da arte mudou.

Declarar "testado" sem colar a saída é violação deste princípio.

### X. Nenhum método cai do céu (NÃO-NEGOCIÁVEL)

Todo método deste livro foi inventado por **alguém**, que estava **preso** num problema concreto, numa data, com meios limitados. Um capítulo que apresenta o método sem essa história entrega um procedimento — e procedimento, o leitor decora. **Este livro não passa decoreba.**

A razão não é ornamental. Quem sabe *que problema forçou o método a existir* consegue reconhecer, anos depois e noutro contexto, quando está diante do mesmo tipo de aperto — e é isso que transfere. Quem só sabe executar o procedimento tem uma habilidade que expira com a prova.

#### A seção obrigatória: "De onde isto veio"

Todo capítulo de método tem essa seção. Ela não é caixa de curiosidade: é o que dá ao leitor um motivo para não pular direto para a fórmula.

**Duas posições são admitidas** ([ADR 0022](../../adr/0022-a-ordem-do-capitulo-pratica-antes-historia-depois.md)):

- **depois de "o problema" e antes da intuição** — quando é a história que estabelece o aperto que o método resolve;
- **ao fim do capítulo** — quando o capítulo leva o leitor ao aperto por outro caminho, tipicamente pela prática.

O que não muda com a posição: os **cinco elementos** e a **tabela de selos** continuam obrigatórios nas duas. A seção pode mudar de lugar; não pode mudar de natureza. E a proibição de curiosidade decorativa vale igual nas duas — o que decide não é onde a seção está, é se ela carrega a ideia reaproveitável.

Cinco elementos, nesta ordem:

| Elemento | A pergunta que responde |
|---|---|
| **O aperto** | Quem estava preso, em quê, quando. Um problema do mundo, com data e gente |
| **O que se fazia antes** | Contra o quê o método compete. Sem isto, não dá para medir o salto |
| **A virada** | Qual foi a ideia que destravou — em linguagem natural, sem notação |
| **A ideia reaproveitável** | O padrão de raciocínio que serve **fora** deste método |
| **O nome** | Se o nome tem origem, ela é contada |

O elemento que mais importa é o quarto. **Todo artifício técnico declara a ideia reaproveitável que há por trás dele.** Um artifício sem ideia é truque, e truque não se transfere.

#### História é afirmação, e exige fonte

Este é o terreno mais fácil do livro para inventar, porque **história inventada soa bem**: uma data errada e uma atribuição plausível passam por qualquer revisão apressada.

**Inventar história é pior do que omiti-la, porque é convincente.**

Toda afirmação histórica carrega um selo, e cada capítulo fecha a seção com uma tabela que declara o estado de cada uma:

| Selo | Significa |
|---|---|
| ✓ | **Fonte aberta e lida.** O que está afirmado foi conferido no texto |
| ✓ᵐ | **Só os metadados** foram conferidos (autor, obra, ano, identificador). O conteúdo não foi lido |
| ✓ᵃ | **Resumo lido no original.** A página do artigo foi aberta e o resumo lido literalmente; o corpo, não. Autoriza citar o resumo entre aspas e afirmar a tese que os autores **declaram** |
| ⏳ | **Atribuição corrente**, repetida na literatura didática, **não confirmada em fonte primária** |
| ❌ | Procurei e **não achei fonte** |
| 📖 | **Leitura editorial** — interpretação deste livro, não afirmação histórica |

A distinção entre ✓ e ✓ᵐ não é preciosismo: ela é o que impede confundir *"existe e é este artigo"* com *"eu li e diz isso"*. Metadado confere que a obra existe; não confere o que ela afirma.

**A escala existe porque cada degrau autoriza uma coisa diferente.** Metadado prova que a obra **existe**; resumo lido autoriza citar o resumo e afirmar a **tese declarada pelos autores**; leitura completa autoriza afirmar o que o artigo **demonstra** — número, método, condição experimental.

**Regra de uso do `✓ᵃ`:** exige o identificador (DOI ou arXiv) **na própria linha**, e vale só para o resumo publicado pelos autores. *Snippet* de busca ou resumo gerado por máquina **nunca** dá `✓ᵃ` — é ✓ᵐ na melhor hipótese, e continua valendo a armadilha do resumo mais abaixo. E `✓ᵃ` **proíbe** afirmar qualquer coisa do corpo: número, tabela, protocolo, limitação, atribuição interna, ou "o artigo mostra que X". **Ele sustenta o que os autores dizem que fizeram, nunca o que o artigo demonstra.**

**Esta tabela é a fonte única do alfabeto de selos, e o build a lê daqui.** Um capítulo que use um símbolo fora dela — ou que redefina um selo numa legenda própria — **não compila**. Cunhar selo novo exige emenda, e isso é intencional: a precisão da proveniência é justamente o que não pode variar de capítulo para capítulo.

O selo ❌ é permitido e às vezes é o mais honesto. Uma lacuna admitida em voz alta vale mais do que uma suposição com cara de fato.

> **Relação com a bibliografia.** `livro/bibliografia.md` usa uma legenda mais curta (✓ / ⏳ / ⚠) porque responde a outra pergunta: *esta referência pode sustentar uma afirmação?* (Princípio I). Os selos acima são mais finos e vivem **no capítulo**, junto da afirmação histórica que qualificam. Onde os dois se encontram, vale a regra estrita: um ✓ na bibliografia conferido só por DOI corresponde a **✓ᵐ** aqui, e não autoriza afirmar o que a obra diz por dentro.

#### Três proibições

1. **Nada de gênio solitário.** É uma história ruim e geralmente falsa. Métodos nascem de instituições, encomendas, prazos e restrições materiais — e é isso que ensina.
2. **Nada de curiosidade decorativa.** Se o parágrafo sai sem o leitor perder compreensão ou julgamento, ele é enfeite. A história entra porque ensina, não porque enfeita.
3. **Nada de misturar registro.** "A literatura atribui a X" não é a mesma frase que "X publicou em 19NN", e as duas não podem parecer iguais no texto.

#### Processo: pesquise de uma vez, não capítulo a capítulo

Concentre a pesquisa histórica numa **sessão própria**, que produz uma nota de pesquisa alimentando as rodadas seguintes — em vez de pesquisar dentro de cada capítulo.

A razão é concreta: **as histórias se conectam, e quem descobre a conexão depois já publicou os dois lados sem ela.** Pesquisando junto, as ligações aparecem; pesquisando separado, não.

A nota de pesquisa deve terminar com uma **fila de verificação**, ordenada por quanta dúvida cada fonte fecharia por unidade de esforço. Nem toda fonte é alcançável, e saber qual abrir primeiro poupa horas.

#### Duas armadilhas, aprendidas na prática

**Resumo de busca não é fonte — nem para confirmar, nem para desmentir.** Um resumo pode abreviar o original de tal forma que um fato **correto** pareça errado. Corrigir a partir do resumo introduz o erro que você achava estar consertando. Se a afirmação importa, abra o texto.

**Ler a fonte não serve só para conferir: serve para achar o que você não sabia que estava lá.** As melhores histórias quase nunca aparecem em resumo — elas estão no parágrafo que ninguém resumiu.

#### O teste da seção

O leitor deve terminá-la **querendo continuar**. Um livro técnico compete com a tentação de pular para a fórmula; a história é o que dá ao leitor um motivo para não pular.

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

**Versão**: 1.3.0 | **Ratificada**: 2026-08-01 | **Última emenda**: 2026-09-01

**Emenda 1.3.0 (2026-09-01)** — o **Princípio X** passa a admitir **duas posições** para "De onde isto veio": a original (depois de "o problema") e **ao fim do capítulo**, quando é a prática que leva o leitor ao aperto. Os cinco elementos e a tabela de selos continuam obrigatórios nas duas, e a proibição de curiosidade decorativa também. Motivada por pedido do autor e decidida em [ADR 0022](../../adr/0022-a-ordem-do-capitulo-pratica-antes-historia-depois.md), que registra que a mudança se apoia em **ritmo**, e não em evidência de aprendizagem: procurei estudo sobre a posição de narrativa histórica e **não achei** (❌).

**Emenda 1.2.0 (2026-08-10)** — novo **Princípio X, "Nenhum método cai do céu"** (não-negociável): todo capítulo de método traz a seção **"De onde isto veio"** (o aperto, o que se fazia antes, a virada, **a ideia reaproveitável**, o nome), com **selos de proveniência por afirmação histórica** (✓ / ✓ᵐ / ⏳ / ❌ / 📖), três proibições (gênio solitário, curiosidade decorativa, mistura de registro) e a regra de **pesquisar a história em sessão própria**, não capítulo a capítulo.

Motivação: um capítulo que dá o método sem o problema que o forçou a existir entrega procedimento, e procedimento se decora e expira. A distinção ✓ / ✓ᵐ nasceu de um caso concreto desta obra — o DOI do neocognitron confere que o artigo existe e é de **1980**, o que não é a mesma coisa que ter lido o que ele afirma. O portão vale a partir do nível `essencial`; os capítulos anteriores à emenda carregam a dívida declarada no `ROADMAP.md`.

**Emenda 1.1.0 (2026-08-08)** — ampliação de escopo e três acréscimos ao Princípio VIII:
1. **Níveis de maturidade** (esqueleto / essencial / completo), declarados ao leitor. Viabiliza cobrir o programa de disciplinas em curso sem baixar o rigor em silêncio.
2. **Laboratório interativo** reconhecido como terceira superfície, ao lado de exercício e vídeo, e aceito como mídia obrigatória quando não houver vídeo verificável.
3. O portão de ≥3 exercícios passa a valer na promoção a `completo`, não em cada commit.

Motivação registrada: o livro passou de "Machine Learning" a **Ciência de Dados e Aprendizado de Máquina**, para servir a três disciplinas reais (Ciência de Dados, Análise Preditiva, Aprendizagem de Máquina) cujos programas estão em `ROADMAP.md`.
