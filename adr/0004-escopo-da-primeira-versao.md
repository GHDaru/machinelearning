# ADR 0004 — O que é a "1ª versão" do livro, e como chegar lá

**Data:** 2026-08-10 · **Estado:** aceito · **Spec:** [006](../specs/006-pesquisa-historica-e-trilha-analise-preditiva/spec.md)

## Contexto

O autor autorizou um *long run* com a instrução: *"prossiga até terminar o livro para nossa 1ª versão"*. O estado é 28 capítulos, ~8 com corpo e 20 em esqueleto, e a emenda 1.2.0 (Princípio X) acabou de tornar obrigatória a seção "De onde isto veio" em todo capítulo de método a partir do nível `essencial`. Só 6 capítulos têm pesquisa histórica feita.

"Terminar o livro" admite leituras muito diferentes de esforço e de risco, e a diferença entre elas não é de gosto: ela decide **onde o risco de fabricar história se concentra**. Por isso a decisão foi levada a dois especialistas antes de ser tomada — arquitetura de plano e didática — em consulta independente.

## Decisão

A **v1.0** é **cobertura declarada e rastreável**:

1. Os **24 capítulos das duas trilhas que o autor ministra** em nível **`essencial`**, cada capítulo de método com "De onde isto veio" completa e tabela de selos.
2. Os **4 restantes** (14–17) entram como lote-válvula: vão a `essencial` se o rigor da pesquisa permitir, e permanecem `esqueleto` **declarado** se não.
3. **Nenhum** capítulo novo promovido a `completo`.
4. Dívidas **D8** e **D9** quitadas.

**Definição operacional de "capítulo de método"** — três perguntas, três "sim" para ser método: (i) o capítulo ensina algo que o leitor vai **executar** como procedimento ou artefato? (ii) esse artefato tem **inventor e data localizáveis** — alguém esteve preso num problema? (iii) omitir a origem transforma o capítulo em decoreba?

- **Método (26):** 01–16, 18–27.
- **Não-método (2):** **00 — Introdução** (orientação: quando ML é e não é a resposta) e **17 — Fronteira** (estado da arte datado, não um método).

A lista é deliberadamente quase total, e isso é intencional: **a definição é exatamente onde a fraude moraria.** Ela vira dado versionado no cabeçalho do capítulo (`metodo: true`) para poder ser cobrada por gate mecânico.

**Ordem de execução, em seis lotes.** O princípio de corte é **pesquisar por linhagem histórica, escrever por ordem de disciplina** — porque as histórias se conectam por linhagem, mas a aula acontece na ordem da ementa.

| Lote | Conteúdo | Por que nesta posição |
|---|---|---|
| **0** | D9 (declarar nível nos 20), fixar a lista método/não-método, e **o gate no build** | Zero pesquisa e torna todo o resto verificável. Sem ele, os lotes seguintes são declarações |
| **1** | C1: capítulos 19–25 + 03, com pesquisa própria para 25 e 03 antes de escrever | Disciplina em curso; 6 dos 8 já pagos pela nota de 2026-08-10 |
| **2** | D8: retrofit em 00, 01, 02, 04, 05, 06, 07, 18 | Dívida mais antiga e capítulos mais lidos. O **fio 05↔18** só fecha escrevendo os dois na mesma passada |
| **3** | Linhagem conexionista: 09, 26, 10, 11, 12 — **uma** sessão de pesquisa | Rosenblatt → Minsky → Rumelhart → LeCun → Hochreiter → Vaswani é **uma linhagem só**. Fatiada, publica os lados sem a ligação |
| **4** | 27, 08, 13 | Fecha a trilha de Aprendizagem de Máquina; três linhagens independentes |
| **5** | Válvula: 14, 15, 16 e 17 | Fora do núcleo; sai primeiro se a qualidade da pesquisa apertar |

**Quatro travas contra o risco central** (fabricar história — "história inventada soa bem" é o modo de falha que o próprio Princípio X nomeia):

- **Teto de selo ✓ᵐ durante o long run.** Nenhum ✓ é emitido sem primária aberta e lida.
- **Rastreabilidade nota → capítulo.** Nenhuma afirmação histórica existe no capítulo sem linha correspondente na nota de `estudos/`. A nota é fonte única, e assim a invenção fica **estruturalmente detectável**, não dependente de alguém desconfiar.
- **Orçamento de ❌.** Se mais de metade das afirmações históricas de um capítulo forem ❌, ele **permanece `esqueleto`**. O escopo cede; o rigor não.
- **Auditoria adversarial em contexto fresco**, por lote, checando só a tabela de selos.

**Forma do capítulo `essencial`** (parecer de didática): 120–180 linhas, 4–6 seções; sete elementos do esqueleto v5 são indispensáveis (objetivos, problema, "De onde isto veio", fundamentos, pratique, síntese, verificação) e quatro esperam o `completo` (fundamentos científicos, estado da arte, mão na massa, assista). **Três exercícios**, não dois — a progressão reconhecimento → aplicação → julgamento precisa de três degraus, e com dois um objetivo sempre fica órfão. A seção histórica é **um bloco só**, na posição 3, teto de ~35 linhas.

## Alternativas avaliadas

**A. Todos os 28 a `essencial`.** Ganha completude. Perde controle de procedência: espalharia a escrita histórica por 22 capítulos sem pesquisa, tensionando os **dois** princípios não-negociáveis (I e X) mais o IX. Descartada na forma ingênua — a decisão aceita quase todo o conteúdo dela, mas com lotes, gate e travas.

**B. Só as duas trilhas, resto congelado.** Descoberta que dissolveu a comparação: **a união das duas trilhas já é 24 dos 28**. A e B diferem em quatro capítulos, então a escolha real nunca foi o conjunto — era ritmo e procedência. Perderia o capítulo 14 (interpretabilidade e justiça), que é obrigatório quando a decisão do modelo afeta pessoas.

**C. Declarar vários capítulos "não-método" para dispensá-los da seção.** Na forma estrita é *no-op* (a regra já é "capítulo de método"); na forma larga é **fraude definicional** — converter um não-negociável em jogo de definição. Rejeitada frontalmente. É a razão de a lista de método ser quase total e versionada.

**D. Poucos capítulos a `completo` em vez de muitos a `essencial`.** Tensiona a emenda 1.1.0 e a tese do roadmap ("cobertura antes de profundidade"), entrega **nada** aos 20 capítulos vazios, e põe o caminho crítico dentro do `ml-zero` — porque `completo` exige experimento próprio, que é exatamente onde um *long run* inventaria números. Profundidade quer humano ao teclado; cobertura não.

**E. Uma mega-spec para o run inteiro.** Rejeitada: viola o Princípio VII e apaga os pontos de parada onde o gate humano ainda cabe.

## Justificativa

A decisão escolhe **o lugar onde o risco se concentra**. Toda alternativa tinha o mesmo perigo — vinte seções históricas de prosa plausível e uniforme, sem fonte. O que muda entre elas é se esse perigo fica **visível e cobrável** ou difuso.

Pôr o gate no build (lote 0, antes de qualquer escrita) transforma o Princípio X de promessa em condição de compilação. Pôr o teto de ✓ᵐ e a rastreabilidade nota→capítulo torna a fabricação estruturalmente detectável em vez de depender de vigilância. E o orçamento de ❌ dá ao processo uma saída honesta: quando a pesquisa não fecha, **o capítulo não sobe de nível** — em vez de subir com história inventada.

A ordem "pesquisar por linhagem, escrever por trilha" vem da evidência da própria nota de 2026-08-10, onde a sessão única já revelou três ligações que a pesquisa fatiada teria perdido.

## Consequências

**Mais fácil:** a disciplina em curso ganha material em todos os tópicos; cada lote é uma spec com ponto de parada humano; a conformidade com o Princípio X passa a ser verificável por máquina, não por leitura.

**Mais difícil:** o gate do lote 0 deixará o build **vermelho** até cada capítulo pagar sua seção — de propósito. E `completo` fica adiado para todos: a v1.0 é explicitamente uma versão de cobertura, e o cabeçalho de cada capítulo diz isso ao leitor.

**Aceito conscientemente:** um capítulo pode terminar a v1.0 ainda em `esqueleto` se a pesquisa histórica dele não fechar. Isso é resultado, não falha — é o orçamento de ❌ funcionando.

**Risco residual:** convergência de forma — 20 capítulos escritos em sequência viram 20 variações do mesmo parágrafo, e a história vira a "curiosidade decorativa" que o Princípio X proíbe. Mitigação adotada do parecer de didática: escrever **todos os objetivos e exercícios primeiro, em lote**, antes de qualquer corpo, forçando a diferenciação no nível do design e não do estilo; revisão developmental lendo **cinco capítulos em sequência** e perguntando o que os distingue; e variar deliberadamente a superfície de abertura (caso, número, laboratório, erro real de aluno).
