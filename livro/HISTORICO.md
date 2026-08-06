# Histórico — o livro vivo

> Este livro declara sua própria data de validade. Aqui ficam as **edições datadas**, o **snapshot por capítulo** e o **registro de expiração** — o placar das previsões que o livro fez, pontuadas contra a realidade.
>
> Toda edição registra também a **versão do modelo de IA** usada. Saídas de modelo de linguagem são não-determinísticas; sem esse registro, o resultado não é reproduzível nem auditável (Princípio IV).

## Edições

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

| Capítulo | Estado | Captura | Exercícios | Vídeos |
|---|---|---|---|---|
| 00 — Introdução | escrito | 2026-08 | 3 | 1 |
| 01 — Fundamentos | escrito | 2026-08 | 3 | 1 |
| 02 — Dados | **escrito** | 2026-08 | 4 | 1 |
| 03 — Representação | esqueleto | — | 0 | 0 |
| 04 — Avaliação | **escrito (piloto v4)** | 2026-08 | 5 | 1 |
| 05 — Modelos Lineares | esqueleto | — | 0 | 0 |
| 06 — Otimização | esqueleto | — | 0 | 0 |
| 07 — Árvores e Ensembles | **escrito** | 2026-08 | 5 | 1 |
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
