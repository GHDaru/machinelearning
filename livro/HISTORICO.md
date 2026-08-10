# Histórico — o livro vivo

> Este livro declara sua própria data de validade. Aqui ficam as **edições datadas**, o **snapshot por capítulo** e o **registro de expiração** — o placar das previsões que o livro fez, pontuadas contra a realidade.
>
> Toda edição registra também a **versão do modelo de IA** usada. Saídas de modelo de linguagem são não-determinísticas; sem esse registro, o resultado não é reproduzível nem auditável (Princípio IV).

## Edições

### Edição 1.0 — 2026-08-10 · A primeira versão completa (spec 006)

**Os 28 capítulos existem, e nenhum finge ser mais do que é.**

O livro saiu de 8 capítulos com corpo para **28, todos no nível `essencial`** e todos dizendo isso ao leitor no próprio cabeçalho. Os exercícios foram de 31 para **91**. As duas disciplinas que o autor ministra têm material em todos os tópicos da ementa.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-10.

**O que mudou de método, e é o que importa.** A emenda 1.2.0 criou o **Princípio X** — nenhum método cai do céu —, e a 1.3.0 acrescentou o selo `✓ᵃ`. Mas a decisão que mais mudou o resultado foi mecânica: **o gate no build**. Um capítulo de método em nível `essencial` sem a seção histórica e sem tabela de selos **não compila**, e o alfabeto de selos é lido da própria constituição, falhando em qualquer símbolo desconhecido.

O gate reordenou o plano sozinho. O [ADR 0004](../adr/0004-escopo-da-primeira-versao.md) mandava escrever os capítulos novos antes de consertar os antigos; declarar o nível dos capítulos com corpo deixou o build vermelho na hora, e nada novo pôde ser publicado antes de a dívida velha ser paga. **É a diferença entre dívida registrada e dívida cobrada.**

**A pesquisa histórica em sessão única pagou o que prometia.** Cinco passadas produziram ligações que a pesquisa capítulo a capítulo teria perdido — e uma delas reescreveu a tese central. O livro vinha dizendo "crédito segue comunicação"; o k-means corrigiu para **crédito segue o vocabulário**. Com seis pretendentes em quatro campos que não conversavam, e o nome cunhado por MacQueen **para um algoritmo diferente**, não vence quem descobre nem quem publica: vence quem **nomeia**. O caso do MLOps fechou o argumento pelo extremo oposto — ali o campo não tinha um autor para o nome e **fabricou um retroativamente**.

**Três lendas foram testadas com instrução de não forçá-las a fechar. As três quebraram.** "Cerveja e fraldas" é verdadeira até a descoberta e inventada a partir da ação. A origem do nome *dynamic programming* tem citação autêntica de Bellman e cronologia impossível. E "MLOps foi cunhado por Sculley *et al.*" caiu por **verificação negativa no texto primário** — a palavra não aparece uma vez sequer.

**A auditoria adversarial reprovou o livro, e foi o melhor dinheiro gasto.** Em contexto fresco, com instrução de *derrubar* em vez de revisar, ela achou seis defeitos altos que nenhum gate pegaria: um **prenome inventado**, duas seções sem lastro na nota de pesquisa, um selo inflado, três capítulos reivindicando "o maior intervalo do livro", um erro de data e uma seção narrando como fato o que a tabela marcava como dúvida. Todos corrigidos; o [relatório](../estudos/2026-08-10-auditoria-adversarial.md) fica registrado. **Pedir "revise" produz elogio; pedir "tente derrubar" produz achado.**

**A dívida que fica, declarada.** A maior é a **D10**: em vários capítulos, uma fonte selada `✓ᵐ` sustenta no corpo uma afirmação sobre o que a obra argumenta por dentro. Havia duas saídas — ler as fontes, ou pôr hedge em cada frase. A escolha registrada é **ler**, no ciclo de aprofundamento, porque hedge mascara o problema com linguagem. A fila de verificação das notas de pesquisa, ordenada por dúvida fechada por unidade de esforço, é o plano de pagamento.

**O que esta edição deliberadamente não fez:** nenhum capítulo foi promovido a `completo`; nenhum experimento próprio novo entrou no `ml-zero`; e o backend continua sem publicar, o que mantém os exercícios dormentes e os laboratórios funcionando.


### Edição 0.6 — 2026-08-10 · Emenda 1.2.0: nenhum método cai do céu

Uma emenda à constituição, e a mais consequente até aqui para *como os capítulos são escritos*.

**O novo Princípio X.** Todo método deste livro foi inventado por **alguém**, preso num problema concreto, numa data, com meios limitados. Um capítulo que dá o método sem essa história entrega um procedimento — e procedimento se decora. Passa a ser obrigatória, em todo capítulo de método a partir do nível `essencial`, a seção **"De onde isto veio"**: o aperto · o que se fazia antes · a virada · **a ideia reaproveitável** · o nome.

O quarto elemento é o que justifica a seção. **Todo artifício técnico declara a ideia reaproveitável que há por trás dele** — artifício sem ideia é truque, e truque não se transfere. Quem sabe *que problema forçou o método a existir* reconhece o mesmo tipo de aperto anos depois, noutro contexto; quem só executa o procedimento tem uma habilidade que expira com a prova.

**Selos de proveniência por afirmação histórica** (✓ · ✓ᵐ · ⏳ · ❌ · 📖). História é o terreno mais fácil do livro para inventar, porque **história inventada soa bem** — uma data errada e uma atribuição plausível passam por qualquer revisão apressada. Inventar história é pior do que omiti-la, justamente porque convence.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-10.

**De onde veio a distinção ✓ / ✓ᵐ.** Ela não é preciosismo de escrivão: nasceu de um caso desta obra, três dias atrás. Ao conferir o DOI do neocognitron para o capítulo 18, o registro do Crossref devolveu **1980** — e o capítulo dizia 1979. O DOI provava que o artigo existe, quem assina e quando saiu; não provava nada sobre o que ele afirma por dentro. São duas perguntas diferentes, e um selo só não distinguia as duas. Agora conferir identificador dá **✓ᵐ**; ✓ exige ter aberto o texto.

**Uma dívida criada de propósito.** A emenda torna 8 capítulos não-conformes no instante em que é ratificada — nenhum dos que têm corpo traz a seção, porque todos são anteriores a ela. Isso está registrado como **D8** no roadmap, com o retrofit em **C8**, e nenhum deles sobe de nível sem pagá-la. Emendar a lei e declarar retroativamente que tudo já estava conforme seria o oposto do que o princípio pede.

### Edição 0.5.1 — 2026-08-08 · O capítulo 18 ganha história, imagem e código executável (sem spec)

Uma rodada curta e inteira dedicada a um capítulo só — o 18 —, a pedido de quem dá a aula. Nada de escopo novo: profundidade no que já existia.

**O que entrou:**

- **Histórico com as fontes reais.** A linha do tempo 1943–1986 deixou de citar de memória: cada marco leva DOI ou link verificável. McCulloch & Pitts ([doi:10.1007/BF02478259](https://doi.org/10.1007/BF02478259)), Rosenblatt ([doi:10.1037/h0042519](https://doi.org/10.1037/h0042519)), Fukushima ([doi:10.1007/BF00344251](https://doi.org/10.1007/BF00344251)), Rumelhart–Hinton–Williams ([doi:10.1038/323533a0](https://doi.org/10.1038/323533a0)).
- **A imagem do neurônio.** Diagrama próprio (SVG, tema claro/escuro, descrito para leitor de tela): entradas → pesos → soma → comparação com o limiar → saída.
- **Duas notas de contexto.** *Quando a IA ainda não se chamava assim*: o relatório de Turing de 1948, o artigo na *Mind* de 1950 e a proposta de Dartmouth de **31 de agosto de 1955**, que cunhou o termo. E a nota sobre **a prioridade do backpropagation**.
- **Código para baixar e rodar.** `ml-zero/etapa-18/neuronio.py` e um caderno pronto para o Colab. O `NeuronioMP` **não tem `fit`** — a ausência é o conteúdo: em 1943 não havia aprendizado. O `Perceptron`, ao lado, tem.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-08.

**A nota que não fechou, e por que ela ficou assim.** O pedido incluía checar uma lembrança: que o backpropagation teria sido desenvolvido por *um italiano, em 1979*. A busca não confirmou. O que existe, e está no capítulo com fonte: **Seppo Linnainmaa** (finlandês, 1970) publicou o modo reverso da diferenciação automática — a matemática do algoritmo; **Paul Werbos** (americano) o aplicou a redes na tese de 1974, com publicações no fim dos anos 1970; **Kunihiko Fukushima** (japonês) publicou o Neocognitron em **1979**. Nenhum italiano apareceu. O capítulo diz exatamente isso — inclusive que não achamos —, porque inventar uma atribuição plausível é o erro que o Princípio I existe para impedir. Se a lembrança tiver fonte, ela entra e esta nota é corrigida.

**Uma dívida de processo desta edição.** Ela foi feita a pedido direto, sem passar pelo ciclo `spec → plan → tasks` que o Princípio VII exige para a raia plena — um capítulo revisado, código novo e um blueprint de deploy não são raia leve. A versão original deste registro dizia "spec 006", uma spec que nunca existiu; a correção está aqui em vez de apagada, porque um livro que mantém placar das próprias previsões não pode maquiar o próprio histórico.

**O que o `NeuronioMP` sem `fit` ensina.** Um estudante que baixa o arquivo procura o método de treino e não encontra. Essa frustração de trinta segundos ensina o recorte histórico melhor que o parágrafo que o antecede: o modelo de 1943 é um circuito, não um aprendiz. Rosenblatt levou **quinze anos** para dar-lhe uma regra de aprendizado, e ela está no arquivo ao lado, para comparação direta.

### Edição 0.5 — 2026-08-08 · Novo escopo: três disciplinas, trilhas e o primeiro laboratório (spec 005)

A mudança mais profunda desde a fundação. O livro deixou de ser sobre Machine Learning e passou a ser **Ciência de Dados e Aprendizado de Máquina**, para servir a três disciplinas reais de Engenharia de Software.

**O que entrou:**

- **Novo escopo e novo título.** De 18 para **28 capítulos**, em cinco partes: Ciência de Dados, Análise Preditiva, Redes e Deep Learning, Além do Supervisionado, e No Mundo Real.
- **Trilhas de disciplina.** Três páginas que ordenam os capítulos por curso, mapeadas unidade a unidade das ementas. O número do capítulo virou **identificador estável**; a ordem vive nas trilhas. É isso que permite um capítulo servir a duas disciplinas com pesos diferentes.
- **Capítulo 18 — O Neurônio Artificial**, nível `essencial`: McCulloch–Pitts, o perceptron, o inverno da IA, e o XOR.
- **Laboratórios interativos** — a terceira superfície do livro. O primeiro é o neurônio de McCulloch–Pitts: o estudante põe os pesos à mão, vê a reta de decisão se mover sobre a tabela-verdade, e **descobre sozinho** que o XOR é impossível.
- **Nove capítulos-esqueleto novos** cobrindo o que faltava das ementas: ciclo CRISP-DM, coleta e integração, análise exploratória, visualização e storytelling, análise multidimensional, séries temporais, do modelo à decisão, treinar redes profundas, e IA simbólica/fuzzy/evolutiva.
- **Constituição emendada para 1.1.0**: níveis de maturidade (`esqueleto` / `essencial` / `completo`), laboratório reconhecido como mídia, e o portão de exercícios passando a valer na promoção a `completo`.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-08.

**A decisão de método.** Servir a disciplinas em curso exige **cobertura antes de profundidade** — e cobertura sem rigor é o que este projeto recusa. A conciliação foi declarar o nível de cada capítulo **ao leitor**, no próprio cabeçalho. Baixar o rigor em silêncio seria fraude; declarar cria a dívida visível que o roadmap cobra.

**Por que o laboratório importa.** O XOR é o caso em que o formato se justifica sozinho: nenhuma frase entrega o que travar em 3 de 4 entrega. O leitor tenta, tenta de novo, e **descobre** a impossibilidade — que é exatamente como Minsky e Papert a apresentaram em 1969. E, por rodar no navegador, o laboratório funciona mesmo com o backend fora do ar: é a superfície mais robusta do livro.

### Edição 0.4 — 2026-08-05 · Lineares e otimização: três achados que vieram de testes que falharam (spec 004)

**O que entrou:**

- **Capítulo 05 — Modelos Lineares** (3 exercícios, 1 vídeo): erro quadrático por conveniência e não por virtude, o logito como o que de fato é linear, as quatro coisas que um coeficiente **não** diz, e quando o linear é a escolha certa — reparando a impressão que o capítulo 07 deixa.
- **Capítulo 06 — Otimização e Regularização** (4 exercícios, 1 vídeo): gradiente como procedimento, diagnóstico pela curva de perda, L1 × L2 explicado pelo gradiente da penalidade, e early stopping.
- **Etapa 05–06 do `ml-zero`**: `Padronizador`, `RegressaoLinear` com solução fechada **e** gradiente, `RegressaoLogistica` com L1/L2, e o otimizador isolado do modelo. 22 testes.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-05.

**Os três achados.** Todos vieram de testes que falharam, e todos entraram no texto porque são úteis ao leitor:

1. **Perda logística é limitada.** Taxa 500 na logística **não** diverge — satura. Erro quadrático a taxa 50 explode. "Não explodiu" não prova que a taxa está boa.
2. **Early stopping monitorando treino nunca dispara em dado separável**, porque a perda de treino cai indefinidamente. O critério precisa observar validação — e a primeira versão da nossa implementação estava errada.
3. **Um instrumento de diagnóstico pressupõe que o problema exista.** Testar early stopping em dado limpo e separável não valida nada: não há ponto a partir do qual ajustar mais piore.

**Decisão registrada:** NumPy foi **adiado** para a etapa 09. O plano da spec 001 o previa a partir da 05; biblioteca padrão bastou, e adicionar dependência sem que o algoritmo exija é a estrutura antecipada que a regra 2 da construção proíbe.

### Edição 0.3 — 2026-08-05 · Árvores e ensembles: o que bagging e boosting realmente atacam (spec 003)

**O que entrou:**

- **Capítulo 07 — Árvores e Ensembles**, com 5 exercícios e 1 vídeo: como a árvore escolhe cada corte, por que uma árvore sozinha tem variância alta, a distinção entre bagging (variância) e boosting (viés), a ordem de ajuste de hiperparâmetros que economiza tempo, e a evidência sobre tabular × deep learning.
- **Etapa 07 do `ml-zero`**: `Arvore` (Gini + MSE), `Floresta`, `Boosting` e `auc` por postos, em ~250 linhas de biblioteca padrão. Mais `linear.py` como régua declarada. 21 testes.
- **Breiman (2001)** e **Grinsztajn, Oyallon & Varoquaux (2022)** conferidos e promovidos a ✓.
- **Nota de estudo** sobre a medição que mudou o desenho do experimento.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-05.

**O achado do caminho.** A primeira versão do experimento reusou o dado da etapa 00 e os quatro modelos terminaram empilhados entre 0,55 e 0,57 de AUC. Em vez de mexer no código, medimos o teto: o classificador de Bayes daquele dado alcança **0,5895** — o boosting já estava em 96% do máximo possível. Os modelos estavam certos; o instrumento é que não media. A etapa 07 passou a gerar o próprio dado, e a etapa 00 **não foi tocada** — sua lição depende daquele dado e já está publicada.

**Nota de honestidade.** O dado da etapa 07 foi construído com uma regra que favorece árvores por construção, e o capítulo diz isso em destaque, antes de qualquer número. A ilustração mostra o mecanismo; a evidência de que dado tabular real tem essa forma é do paper, não nossa.

### Edição 0.2 — 2026-08-05 · Dados: o vazamento e as divisões que respeitam a estrutura (spec 002)

O primeiro capítulo de conteúdo depois da fundação, e não por acaso: **vazamento de dados é o erro mais caro e mais silencioso de Machine Learning**.

**O que entrou:**

- **Capítulo 02 — Dados**, no esqueleto v4: as três fontes de vazamento (alvo disfarçado, pré-processamento antes da divisão, duplicata entre conjuntos), a divisão que respeita tempo e grupo, a ficha de dataset em sete perguntas e o viés de seleção. 4 exercícios e 1 vídeo.
- **Etapa 02 do `ml-zero`**: detector de vazamento com dois sinais independentes, divisão por grupo, divisão por tempo com intervalo de guarda, checagem de duplicatas e a `FichaDeDataset` como **portão executável** — o pipeline recusa dataset com ficha incompleta ou com dado pessoal declarado. 28 testes.
- **Carregador de módulos por etapa** (`ml-zero/tests/conftest.py`): etapas autocontidas têm arquivos homônimos, e `sys.path` cru fazia a primeira importação vencer silenciosamente.
- **Gebru et al. (2021)** conferido na fonte e promovido a ✓.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-05.

**Nota de método:** a lição central do capítulo — "embaralhar por linha vaza o sujeito" — é uma **asserção executável** na suíte de testes, não apenas uma frase no texto. É o Princípio II levado ao limite: o argumento do livro falha o build se deixar de ser verdade.

### Edição 0.1 — 2026-08-01 · Fundação: maquinaria, estrutura e a camada interativa (spec 001)

O repositório nasce com a máquina inteira funcionando e o conteúdo em construção — deliberadamente nessa ordem, para que nenhum capítulo seja escrito fora do formato que o livro exige de si mesmo.

**O que entrou:**

- **Governança** — constituição de 9 princípios, fundindo a didática e o ciclo spec-driven do livro de Engenharia de Harness com o processo de desenvolvimento do Maestro (raias, DoD verificável, skills-primeiro, ADR, gate de CHANGELOG).
- **Estrutura do livro** — 18 capítulos em 3 partes, mais o aparato. Todos com objetivos de aprendizagem declarados (Backward Design: os objetivos vêm antes do corpo).
- **Capítulos escritos** — `00 Introdução`, `01 Fundamentos` e `04 Avaliação` (o piloto do esqueleto v4). Os demais são esqueletos com objetivos e problema definidos.
- **Camada interativa** — exercícios em 5 tipos (múltipla, múltipla-multi, numérica, completar, aberta por rubrica) corrigidos **no servidor**, com feedback explicativo e revelação de gabarito só na 2ª tentativa; vídeos curados com player de fachada (nada é pedido a terceiros antes do clique).
- **Backend** — tutor com busca no texto do livro, correção de exercícios, progresso anônimo e telemetria consentida. 23 testes verdes.
- **Motor de publicação** — Markdown → site navegável, com gate de links internos e gate do banco de exercícios.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-01. Autoria, curadoria e responsabilidade humanas — ver [Autor](autor.md).

**O que ficou de fora, e por quê:** os 15 capítulos-esqueleto não têm corpo, exercícios nem vídeos. Escrevê-los agora, fora do ciclo spec-driven, violaria o Princípio VII — cada um entra por sua própria spec, com sua rodada de pesquisa verificada. A bibliografia reflete isso: 5 referências ✓ e as demais ⏳, honestamente marcadas.

## Snapshot por capítulo

> **Níveis** (constituição 1.1.0): `esqueleto` = objetivos e problema · `essencial` = corpo ensinável e prática · `completo` = o portão dos sete itens.
>
> Os capítulos 19–27, criados na edição 0.5, estão todos em `esqueleto`. O 18 está em `essencial`.

| Capítulo | Estado | Captura | Exercícios | Vídeos |
|---|---|---|---|---|
| 00 — Introdução | completo | 2026-08 | 3 | 1 |
| 01 — Fundamentos | completo | 2026-08 | 3 | 1 |
| 02 — Qualidade e Vazamento | completo | 2026-08 | 4 | 1 |
| 03 — Representação | esqueleto | — | 0 | 0 |
| 04 — Avaliação | completo (piloto v4) | 2026-08 | 5 | 1 |
| 05 — Modelos Lineares | completo | 2026-08 | 3 | 1 |
| 06 — Otimização | completo | 2026-08 | 4 | 1 |
| 07 — Árvores e Ensembles | completo | 2026-08 | 5 | 1 |
| 08 — Não Supervisionado | esqueleto | — | 0 | 0 |
| 09 — Redes Neurais | esqueleto | — | 0 | 0 |
| 10 — Visão | esqueleto | — | 0 | 0 |
| 11 — Sequências e Linguagem | esqueleto | — | 0 | 0 |
| 12 — Modelos de Fundação | esqueleto | — | 0 | 0 |
| 13 — Reforço | esqueleto | — | 0 | 0 |
| 14 — Interpretabilidade e Justiça | esqueleto | — | 0 | 0 |
| 15 — Sistemas de ML | esqueleto | — | 0 | 0 |
| 16 — MLOps | esqueleto | — | 0 | 0 |
| 17 — Fronteira | esqueleto | — | 0 | 0 |
| **18 — O Neurônio Artificial** | **essencial** | 2026-08 | 4 | 1 laboratório |
| 19 — Ciclo da Ciência de Dados | esqueleto | — | 0 | 0 |
| 20 — Coleta e Integração | esqueleto | — | 0 | 0 |
| 21 — Análise Exploratória | esqueleto | — | 0 | 0 |
| 22 — Visualização e Storytelling | esqueleto | — | 0 | 0 |
| 23 — Análise Multidimensional | esqueleto | — | 0 | 0 |
| 24 — Séries Temporais | esqueleto | — | 0 | 0 |
| 25 — Do Modelo à Decisão | esqueleto | — | 0 | 0 |
| 26 — Treinar Redes Profundas | esqueleto | — | 0 | 0 |
| 27 — IA Simbólica, Fuzzy e Evolutiva | esqueleto | — | 0 | 0 |

## Registro de expiração — o placar das previsões

Cada capítulo declara uma **cláusula de expiração**: o que, ali, tem prazo. Aqui elas são acompanhadas.

| # | Cláusula | Capítulo | Declarada em | Estado | Evidência |
|---|---|---|---|---|---|
| E1 | A decomposição viés–variância continua sendo a ferramenta de diagnóstico dominante na prática tabular; *double descent* é entendido como fenômeno do regime superparametrizado. Se surgir teoria unificada que preveja os dois regimes quantitativamente, a seção é reescrita. | 01 | 2026-08 | 🔵 aberta | — |
| E2 | AUC-PR é a escolha padrão para classes raras; calibração é etapa pós-treino dedicada. Se modelos de uso geral passarem a entregar escores bem calibrados sem etapa dedicada, a recomendação muda. | 04 | 2026-08 | 🔵 aberta | — |

| E3 | Gradient boosting é a escolha padrão para tabular de porte médio (Grinsztajn et al., 2022). **Gatilho de revisão**: um benchmark independente, com igual rigor de busca de hiperparâmetros, mostrando vantagem consistente de método não-árvore nesse regime. | 07 | 2026-08 | 🔵 aberta | — |

**Legenda:** 🔵 aberta (ainda em pé, sem evidência de mudança) · 🟡 em curso (há sinais, mas não conclusivos) · 🟢 confirmada (o previsto aconteceu) · 🔴 refutada (o livro errou — e isso é a notícia mais importante de uma edição)

## Cadência

- **Janela trimestral** (próxima: **2026-11**): reconferir vídeos, reexecutar os experimentos com as versões correntes das bibliotecas, atualizar o placar acima e as datas de revisão.
- **Gatilho extraordinário**: qualquer evento que invalide uma "Síntese — o que levar" dispara revisão pontual do capítulo afetado, sem esperar a janela.
- **Gatilho por telemetria**: exercício com taxa de acerto baixa e volume relevante é sinal de texto mal escrito. Ele entra na fila de revisão — ver [Uso do livro](apendice-uso.md).
