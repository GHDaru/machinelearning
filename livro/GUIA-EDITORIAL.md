# Guia Editorial — regras operacionais do livro

> Versão operacional das orientações pedagógicas. A lei está na [constituição](../.specify/memory/constitution.md); este guia é o que se consulta **enquanto escreve**.

## 1. O framework pedagógico em quatro linhas

| Framework | O que dita no livro |
|---|---|
| **Backward Design** | Todo capítulo se projeta de trás para frente: objetivos → evidências (exercícios/verificação) → só então o conteúdo |
| **4C/ID** | Etapas do `ml-zero` = tarefas inteiras; capítulos = informação de apoio; boxes no código = just-in-time; exercícios = treino de parte |
| **Diátaxis** | Quatro tipos de texto, nunca misturados na mesma seção: capítulo=explanation, `ml-zero`=tutorial, banco/fichas=reference, receitas=how-to |
| **Carga Cognitiva** | Worked example antes do exercício; exercícios são "complete", não "crie do zero"; andaime diminui capítulo a capítulo; uma ideia nova por vez |

## 2. Esqueleto v5 de capítulo (obrigatório)

O v5 é o v4 **mais a seção histórica** que o Princípio X tornou obrigatória. O v4, por sua vez, era o esqueleto v3 do livro de Engenharia de Harness mais as duas seções de interatividade. A ordem não é decorativa: ela é o Backward Design tornado sumário.

1. **Objetivos de aprendizagem** — 3–5, verbos de Bloom (explicar, comparar, implementar, avaliar), numerados `**O1.**`, `**O2.**`… Os identificadores são reais: cada exercício aponta para um deles, e o build falha se apontar para um que não existe.
2. **O problema** — por que este assunto existe. Comece pelo erro que alguém comete sem ele.
3. **De onde isto veio** — a história do método, em cinco elementos: **o aperto** (quem estava preso, em quê, quando) · **o que se fazia antes** · **a virada** (a ideia que destravou, sem notação) · **a ideia reaproveitável** (o padrão que serve fora deste método) · **o nome**. Fecha com a **tabela de selos** (✓ / ✓ᵐ / ⏳ / ❌ / 📖). Ver §2.4 e o Princípio X.
4. **Fundamentos** — a intuição, depois a matemática, depois o código. Nunca a fórmula sozinha.
5. **Fundamentos científicos** — 2–4 papers *traduzidos para decisões* ("o resultado X significa que, na prática, você deve Y"); ponteiro para `bibliografia.md`.
6. **O estado da arte** — o que é consenso hoje, o que está em disputa, e a **cláusula de expiração** do capítulo.
7. **Mão na massa** — a etapa correspondente do `ml-zero`, com o experimento que gera os números citados.
8. **Pratique** — os exercícios (mínimo 3). Ver §4.
9. **Assista** — os vídeos curados (mínimo 1) **ou** o laboratório. Ver §5 e §2.3.
10. **Síntese + "o que levar"** — leitura executiva e as ideias exportáveis para o trabalho do leitor.
11. **Verificação** — 2–3 perguntas abertas que testam exatamente os objetivos do item 1.

A posição do item 3 é a regra, não sugestão: **depois** do problema e **antes** da intuição. Antes do problema, a história não tem a que se agarrar; depois da fórmula, o leitor já pulou.

### 2.1 Cabeçalho obrigatório

```markdown
# 04 — Avaliação

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)
```

O selo diz ao leitor se a seção "estado da arte" está fresca — o que a data de um evento citado no corpo não faz.

## 2.2 Níveis de maturidade

Todo capítulo declara seu nível no cabeçalho, logo abaixo da data. O leitor sempre sabe o que está lendo.

| Nível | Garante | Selo no cabeçalho |
|---|---|---|
| **esqueleto** | objetivos e problema | ⚠ aviso em destaque |
| **essencial** | corpo ensinável, ≥2 exercícios, síntese, verificação | nota discreta |
| **completo** | os sete itens do portão (§9) | sem aviso |

**Por que existe.** O livro serve a disciplinas em andamento: um capítulo que existe de forma honesta vale mais ao estudante do que um capítulo ausente. Mas cobertura sem rigor é o que este projeto recusa — então o nível é **declarado**, nunca silencioso. Baixar o rigor sem avisar seria fraude; declarar cria a dívida visível que o roadmap cobra.

**Como promover.** `esqueleto → essencial` é um ciclo de escrita; `essencial → completo` é um ciclo de aprofundamento (experimento próprio, fontes ✓, cláusula de expiração, revisão developmental). Cada promoção é uma spec.

## 2.3 Laboratórios interativos

A terceira superfície do livro, ao lado de exercício e vídeo:

| Superfície | O que faz | Precisa de backend? |
|---|---|---|
| **Exercício** | pergunta e corrige, com feedback que explica | **sim** |
| **Vídeo** | mostra o que a prosa não mostra | não |
| **Laboratório** | **deixa manipular** | **não** |

Um laboratório roda inteiro no navegador. Não há gabarito a esconder — o gabarito é o comportamento do próprio objeto. Isso o torna a superfície mais robusta do livro: funciona mesmo com o backend fora do ar.

**Regras de autoria:**

- O bloco declara **o que manipular ali ensina** e, sobretudo, **o que o leitor deve descobrir sozinho**. Um laboratório que explica antes de deixar brincar desperdiça o próprio mecanismo.
- Ponha o laboratório **antes** da explicação, não depois. A descoberta vem primeiro; o texto confirma e nomeia.
- Prefira laboratórios em que **o fracasso ensine**. O melhor exemplo do livro é o XOR no capítulo 18: o leitor trava em 3 de 4 e descobre a impossibilidade com as próprias mãos — o que nenhuma frase entrega.
- Quando não houver vídeo verificável para um tema, **o laboratório cumpre a cota de mídia**. Inventar uma referência para preencher cota é violação do Princípio I.

Sintaxe em [`BANCO-DE-EXERCICIOS.md`](BANCO-DE-EXERCICIOS.md); os widgets vivem em `publicar/tema/laboratorios.js`.

## 2.4 "De onde isto veio" — como se escreve

Materializa o **Princípio X**. Portão do nível `essencial`, para todo capítulo de método.

**Os cinco elementos, nesta ordem.** O aperto (quem, em quê, quando — gente e data, não "os pesquisadores") · o que se fazia antes (contra o quê o método compete) · a virada (a ideia que destravou, **em linguagem natural, sem notação**) · **a ideia reaproveitável** · o nome, se tiver origem.

**O quarto elemento é a razão de a seção existir.** Todo artifício técnico declara a ideia reaproveitável que há por trás dele: artifício sem ideia é truque, e truque não se transfere. Se você não consegue escrever esse parágrafo, ou ainda não entendeu o método, ou ele não merece capítulo.

**A tabela de selos fecha a seção.** Uma linha por afirmação histórica:

| Selo | Significa | Erro que ele previne |
|---|---|---|
| ✓ | fonte **aberta e lida** | — |
| ✓ᵐ | só os **metadados** conferidos (autor, obra, ano, DOI) | confundir *"existe e é este artigo"* com *"eu li e diz isso"* |
| ⏳ | **atribuição corrente**, não confirmada em primária | repetir o que "todo mundo diz" como se fosse conferido |
| ❌ | procurei e **não achei** | preencher a lacuna com suposição plausível |
| 📖 | **leitura editorial** deste livro | vender interpretação como fato histórico |

Conferir um DOI dá **✓ᵐ**, nunca ✓. Diferente da legenda de [`bibliografia.md`](bibliografia.md), que responde a outra pergunta ("esta referência pode sustentar uma afirmação?"): lá um ✓ conferido só por identificador equivale a ✓ᵐ aqui.

**❌ é permitido e às vezes é o melhor que há.** Exemplo real, no capítulo 18: a atribuição do backpropagation a "um italiano em 1979" não foi confirmada — o capítulo diz que procurou e não achou, e lista o que existe (Linnainmaa 1970, Werbos 1974, Fukushima 1979/80). Lacuna admitida em voz alta vale mais que suposição com cara de fato.

**Três proibições.** Gênio solitário (história ruim e geralmente falsa: métodos nascem de instituições, encomendas, prazos e restrições materiais — e é isso que ensina) · curiosidade decorativa (se o parágrafo sai sem o leitor perder compreensão ou julgamento, é enfeite) · misturar registro ("a literatura atribui a X" ≠ "X publicou em 19NN", e as duas não podem parecer iguais no texto).

**Pesquise de uma vez, não capítulo a capítulo.** A pesquisa histórica vai numa sessão própria, com nota em `estudos/` e **fila de verificação** ao final, ordenada por dúvida fechada por unidade de esforço. As histórias se conectam, e quem descobre a conexão depois já publicou os dois lados sem ela.

**Duas armadilhas.** *Resumo de busca não é fonte* — nem para confirmar nem para desmentir; um resumo pode abreviar o original a ponto de um fato **correto** parecer errado, e corrigir a partir dele introduz o erro que você achava estar consertando. *Ler a fonte também serve para achar o que você não sabia que estava lá* — as melhores histórias estão no parágrafo que ninguém resumiu.

**O teste:** o leitor termina a seção **querendo continuar**. Um livro técnico compete com a tentação de pular para a fórmula; a história é o que dá ao leitor um motivo para não pular.

## 3. Regras de escrita permanentes

- **Evidência por experimento**: toda afirmação empírica cita o script que a produziu (`ml-zero/etapa-04/experimento.py`), com dataset, *seed* e versão da biblioteca. Sem isso, é intuição — e se escreve como intuição.
- **Nenhum número sem procedência.** Nem "cerca de 90%", nem "costuma dobrar". Ou mede, ou cita, ou não afirma.
- **Intuição → matemática → código**, nessa ordem. Uma fórmula que aparece antes da intuição é carga cognitiva pura.
- **Uma ideia nova por seção.** Se a seção precisa de duas, são duas seções.
- Termos técnicos consagrados sem tradução forçada (*overfitting*, *embedding*, *batch*, *drift*); traduzidos quando a prática já traduziu (viés, variância, acurácia).
- Tabelas para fatos enumeráveis; explicação vive na prosa, não nas células.
- Cada componente descrito deve, quando possível, declarar sua **cláusula de expiração**.

## 4. Como se escreve um exercício

A sintaxe completa está em [`BANCO-DE-EXERCICIOS.md`](BANCO-DE-EXERCICIOS.md). As regras editoriais:

- **Todo exercício rastreia até um objetivo** (`"objetivo":"O2"`). Sem isso, o build falha.
- **O feedback (`> **porque:**`) é obrigatório e explica o conceito** — não apenas nomeia a resposta certa. Escreva-o pensando em quem errou, não em quem acertou.
- **`> **volte para:**` aponta a âncora da seção** que resolve a dúvida. É o gesto mais útil do livro.
- **Errar é parte do ciclo**: o gabarito só é revelado na segunda tentativa. Escreva o enunciado sabendo que o leitor vai tentar de novo.
- **Distratores plausíveis.** Uma alternativa errada que ninguém marcaria não ensina nada. As melhores são as que capturam um mal-entendido real e comum.
- Ordem de dificuldade dentro do capítulo: reconhecimento → aplicação → julgamento.
- Exercício de código é sempre **completion problem** (Sweller): complete a lacuna, não escreva do zero. Criar do zero é trabalho da etapa do `ml-zero`.

## 5. Como se escolhe um vídeo

- **Um vídeo entra por aquilo que o texto não faz bem.** Geometria animada, som, ritmo de derivação no quadro. Se o vídeo só repete o capítulo, ele não entra.
- Declare **autor, duração e o que ele resolve**. O campo de justificativa é obrigatório.
- Prefira material estável e gratuito. Vídeo atrás de paywall não entra (Princípio VI).
- **Reconfira os links na janela de revisão.** Vídeo morto é dívida do livro vivo, não do leitor.
- A carga do player só é pedida ao servidor de origem **depois do clique** do leitor — privacidade por padrão.

## 6. Datação, histórico e expiração

1. Todo capítulo declara a data de captura no cabeçalho.
2. Distinguem-se três datas: do **evento** (imutável), da **captura** (quando fotografamos) e do **experimento** (quando o número foi medido, com a versão da biblioteca).
3. Toda edição atualiza [`HISTORICO.md`](HISTORICO.md): changelog, snapshot por capítulo e o **registro de expiração** (🔵 aberta / 🟡 em curso / 🟢 confirmada / 🔴 refutada), com a versão do modelo de IA usada.

Regra de escrita associada: quando uma afirmação for sensível ao tempo ("hoje", "ainda não", "o consenso de 2026"), ela está implicitamente sob a data de captura do cabeçalho. Evite absolutos atemporais ("nunca", "sempre") a menos que sejam do tipo que não expira.

## 7. Revisão em duas camadas

Antes do copyedit de superfície, um passo de **revisão *developmental***: re-ver estrutura e sentido. O argumento fecha? A ordem serve ao leitor? Há redundância ou lacuna? Os exercícios testam mesmo os objetivos declarados, ou testam o que foi fácil de perguntar?

"Escrever é reescrever." Nenhum trecho novo é publicado sem esse passo — é portão de qualidade da constituição (Princípio IX), não sugestão.

## 8. Siglas e glossário (política)

- **Toda sigla é apresentada por extenso na 1ª ocorrência** de um capítulo — "Support Vector Machine (SVM)" — e dali em diante o texto pode usar só a sigla.
- O motor reforça isso: envolve automaticamente cada sigla conhecida em `<abbr>`, de modo que passar o mouse revela o significado em qualquer ocorrência, sem poluir o texto-fonte. O mapa vive em `publicar/build.mjs` e é espelhado em [`glossario.md`](glossario.md).
- Ao introduzir uma sigla nova, adicione-a **nos dois lugares** e confira a expansão na fonte (Princípio I).

## 9. Fluxo repetível para um contribuidor

1. **Abrir o tema** — pesquisa dupla (científica + indústria), verificada por busca cruzada; registrar lacunas.
2. **Definir os objetivos primeiro** (Backward Design) e, logo em seguida, **os exercícios** — antes de escrever o corpo. Se você não consegue escrever o exercício, o objetivo está vago.
3. **Reunir a evidência** — rodar o experimento no `ml-zero`; anotar seed, versões e números.
4. **Escrever** — no esqueleto v5, um tipo de texto por seção (Diátaxis).
5. **Revisar (developmental)** — §7.
6. **Verificar fontes** — nenhuma URL/DOI inventado; não-confirmado marcado `⏳`; sincronizar `bibliografia.md`.
7. **Gate de build** — `npm run build` (em `publicar/`) verde: link-check e gate de exercícios.
8. **Datar** — selo no capítulo, entrada no `HISTORICO.md` com a versão do modelo de IA, entrada no `CHANGELOG.md`.

## 10. Cadência do livro vivo

- **Janela trimestral**: reconferir vídeos, reexecutar os experimentos com as versões correntes das bibliotecas, atualizar o placar de expiração e as datas de revisão.
- **Gatilho extraordinário**: qualquer evento que invalide uma "Leitura executiva" (um resultado replicado que derruba uma recomendação, uma biblioteca central descontinuada, um dataset retirado) dispara revisão pontual do capítulo afetado, sem esperar a janela.
- **Gatilho por telemetria**: exercício com taxa de acerto muito baixa e volume relevante é sinal de que **o texto** está mal escrito, não de que o leitor é fraco. Ele entra na fila de revisão.
