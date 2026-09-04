# Base educacional — o que a evidência sustenta, e onde ela para

> **Estado da arte capturado em 2026-09** · última revisão 2026-09-01 · [histórico](HISTORICO.md)

Este documento reúne, num lugar só, as teorias e os achados educacionais que decidem **como este livro é escrito**. Ele existe porque a evidência estava espalhada por seis arquivos e um comentário de código, e regra que mora em seis lugares diverge em silêncio.

**Para quem é.** Para o autor, ao planejar um capítulo. Para o agente de IA, antes de escrever um. As duas leituras são a mesma, de propósito: se uma regra precisa de explicação diferente para a máquina, ela não está escrita com clareza suficiente para a pessoa.

**O que ele não é.** Não é uma revisão de literatura, não é neutro e não tenta cobrir a área. É a lista curta do que **este** livro usa, com o número que cada achado sustenta e a fronteira onde ele deixa de valer. A fronteira importa mais que o número: quase todo erro pedagógico deste repositório veio de aplicar um achado verdadeiro fora do lugar dele.

---

## 1. Como ler os selos

A legenda é a do Princípio X da constituição, e vale aqui sem abrandamento:

| Selo | Significa |
|---|---|
| ✓ | Fonte **aberta e lida** |
| ✓ᵐ | Só os **metadados** conferidos (autoria, obra, ano, DOI). O conteúdo **não** foi lido |
| ⏳ | **Atribuição corrente**, não confirmada em fonte primária |
| ❌ | Procurei e **não achei fonte** |
| 📖 | **Leitura editorial** — interpretação deste livro, não afirmação de terceiro |

Duas consequências que este documento leva a sério. Conferir um identificador digital de objeto (DOI) dá **✓ᵐ**, nunca ✓, porque metadado prova que a obra existe e não o que ela afirma por dentro. E **resumo de busca não é fonte**, nem para confirmar nem para desmentir.

**Aviso de honestidade, no topo e não no rodapé.** Quatro dos cinco achados da seção 3 estão em **⏳**. Eles entraram por pesquisa de ciclo anterior, sustentam regras hoje publicadas, e **não têm registro de verificação neste repositório**. A seção 8 é a fila para pagar isso, ordenada por dúvida fechada por unidade de esforço.

---

## 2. As quatro bases herdadas

Vêm do Princípio III da constituição e já estão verificadas em [`bibliografia.md`](bibliografia.md).

| Base | O que ela decide aqui | Selo |
|---|---|---|
| **Backward Design** (Wiggins & McTighe) | Escreve-se de trás para frente: objetivos com verbo de Bloom, depois a evidência de aprendizado, e só então o conteúdo. É por isso que todo exercício aponta para um objetivo declarado | ⏳ conferir edição |
| **4C/ID** (van Merriënboer, Clark & de Croock, 2002) | A trilha `ml-zero` é a espinha de tarefas inteiras; os capítulos são informação de apoio; os boxes no código são apoio no momento do uso; os exercícios são prática de parte | ✓ |
| **Diátaxis** (Procida) | Quatro tipos de texto, nunca misturados na mesma seção. Capítulo é explicação, `ml-zero` é tutorial, banco e fichas são referência, receita é como-fazer | ✓ |
| **Carga Cognitiva** (Sweller, 1988) | Exemplo trabalhado antes do exercício; problemas de completar em vez de criar do zero; desvanecimento do andaime capítulo a capítulo; uma ideia nova por vez | ✓ |

A quarta é a que mais aparece na prática diária, e é também a mais fácil de aplicar errado. A seção 5 mostra onde ela **não** vale.

---

## 3. Os cinco achados que este ciclo trouxe

Cada um traz: a afirmação, o número, o selo, onde está aplicado, e **o que ele não autoriza**. A última coluna é a que evita o uso indevido.

### 3.1 Resolver antes de explicar rende, mas depende do tipo de conhecimento

**Sinha & Kapur (2021)** · meta-análise de 53 estudos e 166 comparações · **⏳**

| O que se aprende | Praticar antes rende |
|---|---|
| Conceito e transferência | **g = 0,36** · IC [0,20 · 0,51] |
| **Procedimento** | **g = −0,03** · IC [−0,20 · 0,15] |

O intervalo do procedimento cruza o zero. Não é um efeito pequeno: é **ausência de efeito**, e tratá-lo como "menor benefício" é o erro que produz capítulo em que o leitor tenta derivar uma fórmula que ninguém lhe mostrou.

**A segunda metade do achado, e é a que mais se perde na citação.** A explicação que vem depois tem de construir sobre o que o leitor tentou: rende **g = 0,56** quando constrói e **g = 0,20** quando ignora. Um laboratório seguido de um texto genérico é a versão de baixa fidelidade do método, e é ela que produz os efeitos pequenos que se atribuem à prática-antes.

**Aplicado em:** [ADR 0022](../adr/0022-a-ordem-do-capitulo-pratica-antes-historia-depois.md), a ordem dos cinco atos do capítulo · [`GUIA-EDITORIAL.md`](GUIA-EDITORIAL.md) §2.3 · o tipo `prever` das interações.

**Não autoriza:** aplicar prática-antes ao capítulo inteiro. Não autoriza chamar de prática-antes um laboratório cuja explicação seguinte não menciona a tentativa.

### 3.2 Descoberta sem assistência é pior que nenhuma

**Alfieri, Brooks, Aldrich & Tenenbaum (2011)** · **⏳**

- descoberta **não assistida**: **d = −0,38**
- descoberta **assistida** (com retorno, exemplo trabalhado, andaime e explicação elicitada): **d = +0,30**

**A diferença entre as duas não é de grau: é de sinal.** É o achado mais fácil de citar pela metade, e a metade errada é a que virou "deixe o aluno descobrir".

**Aplicado em:** toda interação do livro bloqueia a revelação até o leitor se comprometer, **e então** revela com explicação. O tipo `desvanecido` põe a linha certa ao lado da do leitor, sem veredito.

**Não autoriza:** exercício aberto sem rubrica. Não autoriza laboratório sem número com nome na tela ([ADR 0015](../adr/0015-animacao-e-laboratorio-sem-manopla.md)).

### 3.3 Autoexplicação provocada supera receber a explicação pronta

**Bisra, Liu, Nesbit, Salimi & Winne (2018)** · **⏳** · **g = 0,35**

**Aplicado em:** o tipo `principio` das interações. O leitor escreve a resposta dele, clica, e a explicação aparece **ao lado** da resposta dele. Ela não é corrigida: é comparada.

**Não autoriza:** trocar correção por comparação onde há nota em jogo. A interação pode comparar porque não vale nada; o exercício corrige no backend porque vale.

### 3.4 Desvanecimento com pergunta de princípio transfere

**Atkinson, Renkl & Merrill (2003)** · **⏳** · efeito médio a grande em transferência próxima e distante

O andaime sai por partes, e cada passo apagado vem acompanhado de uma pergunta sobre **por que** aquele passo existe. Sem a pergunta, o desvanecimento vira lacuna a preencher.

**Aplicado em:** o tipo `desvanecido` · os problemas de completar do banco · a progressão dos cinco passos da dedução no capítulo II.2.

**Não autoriza:** apagar passo sem perguntar o princípio. Isso é adivinhação, e mede memória de curto prazo.

### 3.5 Detalhe interessante e irrelevante prejudica

**Sundararajan & Adesope (2020)**, *Keep it Coherent*, *Educational Psychology Review* 32 · [10.1007/s10648-020-09522-4](https://doi.org/10.1007/s10648-020-09522-4) · **✓ᵐ**

**O selo é ✓ᵐ porque o editor está fechado e o texto não foi aberto.** Metadado prova que a obra existe, não o que ela afirma. Por isso **nenhum tamanho de efeito é citado aqui**, e a direção do achado entra como cautela, não como prova.

**A regra que fica, e ela não depende daquele número:** ilustração entra a serviço do **mecanismo**, não da curiosidade. O padrão do livro é a figura gerada dos dados, que se recusa a existir se os dados pararem de sustentar o que ela afirma.

**Não autoriza:** cortar imagem por suspeita. A cautela pede que a imagem justifique o lugar dela, não que ela desapareça.

---

## 4. A regra que resulta: prática antes, por tipo de conhecimento

É a síntese operacional das seções 3.1 e 3.2, e é o que se consulta ao planejar um ato de capítulo.

| Tipo de conhecimento | Ordem | Por quê |
|---|---|---|
| **Procedimento** (derivar, calcular, obter a fórmula) | **exemplo trabalhado primeiro**, depois desvanece | praticar antes rende g = −0,03 |
| **Conceito e transferência** (interpretar, decidir, reconhecer) | **prática primeiro**, explicação depois | praticar antes rende g = +0,36 |

Duas condições, e as duas têm número: a prática **não pode ser sem assistência** (§3.2), e a explicação seguinte **tem de construir sobre a tentativa** (§3.1).

**Como saber em que zona você está.** Olhe o verbo do objetivo declarado. *Derivar*, *calcular* e *obter* são procedimento. *Interpretar*, *reconhecer*, *decidir* e *dizer o que não significa* são conceito e transferência. O verbo já estava lá por causa do Backward Design, e agora ele decide também a ordem.

**Uma convergência que não foi combinada, e vale registrar.** Um diagnóstico de densidade do capítulo II.2, feito sem ver esta pesquisa, achou a junta entre os dois blocos exatamente onde o tipo de conhecimento a acha: 2,9 ideias novas por 100 palavras na primeira metade, 1,1 na segunda. Duas análises independentes, mesmo corte.

---

## 5. O que a evidência **não** diz

Esta seção existe porque o espaço negativo é a parte que se perde primeiro, e é a que mais custa quando se perde.

**A posição da narrativa histórica no capítulo: ❌.** Procurei estudo sobre onde colocar narrativa histórica em material instrucional e **não achei**. A decisão de mover "De onde isto veio" para o fim do capítulo repousa em **ritmo**, não em aprendizagem medida, e o [ADR 0022](../adr/0022-a-ordem-do-capitulo-pratica-antes-historia-depois.md) diz isso com todas as letras. Registrar como preferência editorial fundamentada, e não como decisão baseada em evidência, é a diferença entre uma decisão e uma justificação.

**A profundidade da correção: sem número aqui.** A regra de que o retorno desmonta as alternativas erradas vem do Princípio VIII.2 da constituição, que é decisão editorial. Nenhum dos achados acima a sustenta, e ela não precisa deles. Quando um material de referência com correções de 22 palavras foi comparado com o nosso, de 125, a comparação foi declarada **fora de escopo**: a barra vale para segmentação, ritmo e presença de objeto interativo, e não para profundidade de correção.

**A ligação ao glossário: comparação com um material concreto, não estudo.** A régua de ligar cada termo no primeiro uso veio de medir uma página do Google Machine Learning Crash Course, que liga nove termos ao glossário. Não há aqui número de aprendizagem que a sustente, e nenhum foi inventado: é **📖 leitura editorial**, e o que ela empresta da constituição é o Princípio VIII, que já mandava o termo novo entrar no glossário. A escolha de tomar o **cartão** como unidade, e não o capítulo, tem justificativa de leitura e não de literatura: no modo cartão o leitor vê um cartão por vez, e um link que mora noutro cartão não existe para ele.

**O tamanho do cartão: medido aqui, não na literatura.** Os limites de 400 a 1.600px e de 80 a 250 palavras saíram de uma comparação com um material concreto e da medição do nosso, não de um estudo. São **📖 leitura editorial** com número próprio, e o gate que os cobra é honesto sobre isso.

**Microlearning como categoria: não use como argumento.** O livro adota a **forma** (unidade fechável, um gesto por unidade), e cada peça dessa forma se justifica por um dos achados acima. "É microlearning" não é razão para nada.

---

## 6. Os três tipos de interação, e a evidência de cada um

A `:::interacao` é **formativa**: não vale nota, revela no cliente, não grava nada, e errar nela é o ponto. É por não valer nota que ela pode revelar sem violar o Princípio VIII.3. Sintaxe em [`BANCO-DE-EXERCICIOS.md`](BANCO-DE-EXERCICIOS.md).

| Tipo | O gesto | Achado |
|---|---|---|
| `principio` | O leitor escreve, clica, e a explicação aparece ao lado da resposta dele | §3.3, g = 0,35 |
| `desvanecido` | Passo apagado da conta; ao conferir, a linha certa aparece ao lado da dele | §3.4 |
| `prever` | O botão só libera depois da previsão, e a revelação **repete a previsão dele** antes de dar o resultado | §3.1, g = 0,36, e a condição g = 0,56 contra 0,20 |

A revelação do `prever` começa pela previsão do leitor, e não pela resposta. Isso não é enfeite: é a condição sem a qual o efeito cai de 0,56 para 0,20.

---

## 7. De cada regra ao portão que a cobra

Esta seção é o que torna o documento utilizável por um agente. Teoria que não vira asserção volta a ser opinião.

| Regra | Cobrada por | O que reprova |
|---|---|---|
| Todo exercício aponta para um objetivo declarado | `publicar/exercicios.mjs` | objetivo citado que não existe no capítulo |
| O teto do exercício é o verbo do objetivo | [ADR 0014](../adr/0014-tres-exercicios-por-objetivo-e-a-prova.md), revisão humana | — |
| A interação não revela antes da resposta | **asserção F** de `publicar/jornada.mjs` | clica em revelar sem responder e algo aparece |
| Todo cartão fecha, com interação e exercício | `publicar/gates/cartoes-legiveis.mjs` | fora de 400–1.600px, de 80–250 palavras, ou sem os dois |
| O baralho não tem ilha escondida | `ilhasDe()` em `publicar/cartoes.mjs` | trecho entre dois cartões que some no modo cartão |
| O termo do glossário é ligado no primeiro uso do cartão | `publicar/gates/glossario-ligado.mjs` | termo usado e nunca ligado, link fora do primeiro uso, link repetido no mesmo cartão, âncora inexistente |
| O comprimento da alternativa não entrega a resposta | `publicar/gates/vies-de-comprimento.mjs` | \|z\| > 2,5 nas duas direções |
| A fórmula não termina cortada na margem | **asserção G** de `publicar/jornada.mjs` | `scrollWidth` maior que `clientWidth` |
| Retorno que só diz "errado" é proibido | Princípio VIII.2, revisão humana | — |

As três linhas com "revisão humana" são dívida declarada, não descuido: são as regras que ainda não viraram asserção executável.

---

## 8. A fila de verificação

Ordenada por **dúvida fechada por unidade de esforço**, como o Princípio X pede. Todas as quatro primeiras sustentam regra já publicada, o que as torna prioridade sobre qualquer referência nova.

| # | Fonte | Estado | O que muda quando fechar |
|---|---|---|---|
| 1 | **Sinha & Kapur (2021)** | ⏳ sem DOI registrado | Sustenta a ordem dos cinco atos e o tipo `prever`. É a de maior alcance: se os números estiverem trocados, a estrutura do capítulo muda |
| 2 | **Alfieri et al. (2011)** | ⏳ sem DOI registrado | Sustenta o bloqueio da revelação em toda interação do livro |
| 3 | **Bisra et al. (2018)** | ⏳ sem DOI registrado | Sustenta o tipo `principio` |
| 4 | **Atkinson, Renkl & Merrill (2003)** | ⏳ sem DOI registrado | Sustenta o tipo `desvanecido` e os problemas de completar |
| 5 | **Sundararajan & Adesope (2020)** | ✓ᵐ, editor fechado | Trocar o ✓ᵐ por ✓ liberaria citar tamanho de efeito; hoje nenhum é citável |
| 6 | **Wiggins & McTighe (2005)** | ⏳ conferir edição e ISBN | Backward Design; a regra já está em uso e a conferência é de metadado |

**Nenhuma das cinco primeiras está em [`bibliografia.md`](bibliografia.md)**, e é lá que se responde "esta referência pode sustentar uma afirmação?". Entrar na bibliografia com selo é parte de fechar cada linha desta fila.

**O que fazer enquanto não fecham.** As regras ficam de pé, porque foram adotadas e estão funcionando. O que não se pode é apresentá-las como evidência verificada. Onde este documento cita um número com ⏳, a citação é da atribuição corrente, e o texto do livro que se apoiar nela precisa dizer o mesmo.

---

## 9. Como usar isto ao planejar um capítulo

1. Escreva os **objetivos** primeiro, com verbo de Bloom. O verbo decide a avaliação e também a ordem dos atos.
2. Separe os objetivos em **procedimento** e **conceito ou transferência** (§4).
3. Nos atos de procedimento: exemplo trabalhado, depois desvanecimento com pergunta de princípio, depois exercício.
4. Nos atos de conceito: prática primeiro, e a explicação seguinte **nomeia o que o leitor acabou de produzir**.
5. Toda unidade fechável leva **uma interação e um exercício**. A interação prepara; o exercício mede.
6. Rode os portões da §7 antes de declarar pronto. Verde local não é certo global, mas vermelho local é errado em qualquer lugar.

---

## Referências

Enquanto a fila da §8 não fecha, as quatro fontes em ⏳ vivem aqui, e **não** em `bibliografia.md`, porque aquela página é a lista do que pode sustentar afirmação.

- ⏳ **Alfieri, L., Brooks, P. J., Aldrich, N. J., & Tenenbaum, H. R. (2011).** Does discovery-based instruction enhance learning? *Journal of Educational Psychology*.
- ⏳ **Atkinson, R. K., Renkl, A., & Merrill, M. M. (2003).** Transitioning from studying examples to solving problems: Effects of self-explanation prompts and fading worked-out steps. *Journal of Educational Psychology*.
- ⏳ **Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018).** Inducing self-explanation: A meta-analysis. *Educational Psychology Review*.
- ⏳ **Sinha, T., & Kapur, M. (2021).** When problem solving followed by instruction works: Evidence for productive failure. *Review of Educational Research*.
- ✓ᵐ **Sundararajan, N., & Adesope, O. (2020).** Keep it coherent: A meta-analysis of the seductive details effect. *Educational Psychology Review*, 32. [10.1007/s10648-020-09522-4](https://doi.org/10.1007/s10648-020-09522-4)

As quatro bases da §2 já estão em [`bibliografia.md`](bibliografia.md), com data de conferência.
