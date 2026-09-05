# Changelog

Todas as mudanças notáveis deste projeto. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versionamento acompanha as **edições** do livro (ver [`livro/HISTORICO.md`](livro/HISTORICO.md)).

> **Gate de CI:** toda PR adiciona uma entrada em `[Unreleased]`. Bypass explícito para mudanças que não afetam o leitor: label `skip-changelog`.

## [Unreleased]

### Adicionado — a rampa do fecho do `II.2`: os doze últimos cartões deixam de reconhecer e passam a produzir (D29)

- **O defeito, confirmado com instrumento reproduzível.** A espiral da limonada consertou a
  D27 e deixou um pico: a subida terminava no cartão 26 e os cartões 27 a 38 ficavam onde
  estavam. Medido de novo, agora por um instrumento que vive no repositório
  (`publicar/grau-de-producao.mjs`), a inclinação **dentro** dos cartões 27 a 38 era
  −0,0017 por cartão, a média deles 2,13 contra 4,45 da espiral, e **quatro cartões** do
  fecho estavam em 1,00, o grau de puro reconhecimento.
- **O fecho passou a encomendar em vez de perguntar.** Seis interações que eram um `prever`
  de três opções viraram `principio`, o tipo que o próprio capítulo usa quando quer um
  argumento escrito (cartões 30, 31, 33, 34, 35 e 36). O `e31`, no bloco histórico, saiu de
  quatro alternativas para um `completar` sobre a palavra que faltava naquela astronomia.
- **A Verificação virou a volta executável que faltava.** As questões 3 e 4 tinham resposta
  em número e ninguém a produzia. A seção 8 do
  [`regressao_limonada.ipynb`](ml-zero/etapa-05/regressao_limonada.ipynb) ganhou duas células
  com `# TODO`: uma faz entrar uma cópia quase idêntica da `temperatura`, e o coeficiente
  dela salta de 0,3692 para **0,4985** com o $R^2$ parado em 0,9821; a outra imprime o
  $S_{xx}$ de cada coluna dentro de um mês, e o `preco` sai em **0,000** em qualquer mês.
  O `e40` e o `e50` cobram esses dois números. **O valor que vem pronto na célula não é o
  que o exercício pede**, que é a regra que a D26 deixou.
- **Os números que isso moveu.** Inclinação nos cartões 27 a 38: **−0,0017 → +0,0903** por
  cartão. Média do fecho: **2,13 → 3,01**. Inclinação global: **−0,0034 → +0,0298**. O
  último cartão no grau máximo sai de **26/38 (68,4%) para 38/38 (100%)**, e o último ato de
  grau 5 sai de 71,1% para 100% do caminho. O menor grau do fecho vai de 1,00 para 2,50.
  Na escada da prática, ρ(posição × dificuldade) do `II.2` sobe de **0,451 para 0,497**.
- **`publicar/testes/grau-de-producao.mjs`** afirma as duas coisas que nada defendia: a régua
  discrimina os cinco degraus (com os dois casos difíceis, `numerica` de conta à mão contra
  `numerica` que manda rodar), e a rampa do `II.2` é asserção, não construção. Ele também
  confere que a célula que cada exercício manda alterar **existe** no notebook e que o
  gabarito **não** está impresso lá.


### Adicionado — a escada da prática virou portão, e a camada que o navegador desenha entrou na conta dos portões de fonte

- **A dívida que a reordenação do `II.2` deixou escrita.** A [ADR 0023](adr/0023-a-sequencia-do-ii-2-carga-cognitiva-e-a-escada.md)
  decidiu dois portões e só o do pré-requisito foi construído. O da escada ficou como
  dívida declarada pelo próprio construtor: a monotonia dentro de cada nível era sustentada
  por construção, não por asserção, e qualquer edição futura a desfaria em silêncio.
- **`publicar/gates/escada.mjs`** cobra a régua da [ADR 0014](adr/0014-tres-exercicios-por-objetivo-e-a-prova.md)
  sem pedir etiqueta nova: `dificuldade` já tem exatamente os três valores dos três degraus
  (E1 dois abaixo do verbo, E2 um abaixo, E3 no verbo). Quatro acusações, as quatro pedidas
  pela ADR: teto não atingido, teto ultrapassado, queda de mais de um degrau dentro do nível
  e platô acima de quatro cartões. O verbo de cada objetivo é ranqueado pela tabela de Bloom
  do Guia Editorial §2.5, **lida do arquivo** em vez de copiada para o portão.
- **O `II.2` não passou de primeira, e o que ele acusou não estava em relatório nenhum.**
  O platô de seis cartões de reconhecimento que o especialista 2 mediu na abertura virou
  **cinco** com a reordenação, e cinco continua sendo mais que quatro. Entra como dívida
  declarada, com o número.
- **Uma regra ratificada em 2026-08-13 e nunca cobrada.** A ADR 0014 fixou que só objetivos
  de Avaliar e Criar puxam resposta aberta. São **22 exercícios `aberta` em 15 capítulos**
  sob verbo abaixo disso, de 50 abertas no livro, mais **4 objetivos cujo trio nunca chega
  a E3**. Nada disso reprova hoje: está medido, relatado em toda execução e cobrado nas duas
  direções, como a dívida do pré-requisito.
- **O ponto cego do canvas (D28), fechado pela raiz.** O que o tema escreve depois da carga
  não está no Markdown, e por isso não existia para portão nenhum. Medido antes de escolher
  a rota: na página do `II.2` o tema desenha **16 textos distintos com `fillText`**, e nenhum
  deles é nó de texto, então ler o DOM montado não resolveria. `publicar/vocabulario-desenhado.mjs`
  instrumenta `CanvasRenderingContext2D.fillText` antes de o tema rodar, junta o texto do
  painel escrito em runtime, e deixa um corpus versionado com a **impressão digital de
  `tema/laboratorios.js`**. Mexeu no tema sem regenerar, o portão reprova e diz o comando.
- **O portão de pré-requisito passou a ler esse corpus**, e o que ele achou é maior do que o
  roadmap sabia: não uma inversão desenhada, **três**. O `R²` que o painel imprime no cartão 4
  e o capítulo apresenta no 23 (19 cartões de dívida), o `EAM — erro absoluto médio` do mesmo
  painel dois cartões antes de o erro absoluto existir, e o **título do laboratório**, que
  vive no marcador `:::lab` e nunca tinha sido lido por ninguém.
- **E a dívida D24 estava subcontada.** A asserção H da jornada percorre nós de texto do DOM,
  então ela conta as 14 siglas que o laboratório escreve e nenhuma das que ele desenha.
  Medido no corpus: mais **7 ocorrências em 6 páginas** (AUC, ROC, EQM, MAE) que nunca
  estiveram em conta nenhuma. O total honesto é 21, e o número novo é cobrado nas duas
  direções em `SIGLA_EM_CANVAS_DECLARADA`.
- **Os dois portões foram vistos falhando antes de entrar.** As quatro acusações da escada
  foram provocadas uma a uma no capítulo real, e as duas da camada desenhada também.
  Testes novos em `publicar/testes/escada.mjs` (23 casos) e
  `publicar/testes/vocabulario-desenhado.mjs` (14 casos), mais os dois passos novos na
  `ci.yml`.
- **O limite do coletor, e a interface que o fecha.** Ele vê o que o laboratório desenha ao
  abrir; texto que só aparece depois de um clique fica fora. A saída é uma função opcional,
  `__api.vocabulario()`, que devolve tudo o que aquele painel pode imprimir em qualquer
  estado. O coletor a chama quando existe e **conta quantos laboratórios a ofereceram**, de
  modo que a ausência dela seja um número e não um silêncio.


### Alterado — a sequência do `II.2`: carga cognitiva ordena, e um portão cobra a ordem ([ADR 0023](adr/0023-a-sequencia-do-ii-2-carga-cognitiva-e-a-escada.md))

- **O defeito, medido por três especialistas independentes.** A recusa do autor (*"para um aluno
  precisando de passos evolutivos, não está linear"*) não era de sinalização: uma única ocorrência
  de "veremos" em 39 cartões. Era de **pré-requisito** e de **escada**. Seis conceitos eram usados
  antes de existirem, e a correlação de postos entre a posição do cartão e a dificuldade declarada
  era **0,173**, com 11 quedas de dificuldade, **nove delas dentro do mesmo nível**.
- **A sequência foi refeita: 39 → 38 cartões, em oito níveis.** O laboratório da reta subiu do
  cartão 8 para o 4 e passa a **preceder** a definição do erro quadrático médio, que então nomeia o
  que o leitor acabou de produzir. Nascem quatro cartões que não existiam: um exemplo trabalhado
  com três números antes de qualquer derivada, um desvanecido de andaime zero, a passagem de um
  atributo para vários, e a colinearidade como cartão próprio. Os sete cartões de história viram
  três. O notebook da limonada sai da posição 37 de 39 (94,9% do caminho) e vira o cartão 27 de 38,
  na mesma classe que ele fecha.
- **Zero inversão de pré-requisito, e um portão novo que cobra isso.**
  `publicar/gates/pre-requisito.mjs` lê o vocabulário do glossário mais os símbolos que ele guarda
  sob nome por extenso (`R²`, `AUC`), e reprova o cartão que usa um termo que a sequência ainda não
  apresentou. "Apresentado" é **declarado** no marcador do cartão (`"apresenta"`), e o que vem de
  capítulo anterior é declarado no primeiro (`"herdado"`, que passa a ser a lista de pré-requisitos
  do capítulo). Os 26 capítulos ainda não anotados estão em `PRE_REQUISITO_PENDENTE`: medidos,
  relatados em toda execução, e não reprovam. O gate foi visto acusando as seis inversões
  reintroduzidas uma a uma.
- **A dificuldade parou de cair dentro de uma classe.** ρ de Spearman entre posição e dificuldade
  vai de **0,173 para 0,437**; as quedas caem de 11 para 7, e as **sete acontecem em fronteira de
  nível** (antes, nove das onze eram dentro do mesmo nível).
- **Os três bloqueadores da ADR foram fechados.** A **AUC** passa a ser definida no cartão do caso
  da seguradora, onde estreia. Os sete exercícios de história deixam de mentir o objetivo `O1`
  ("derivar") e apontam para um **`O5`** declarado, que é o que eles de fato medem; `O1` ganha o
  exercício que faltava, uma derivação da reta sem intercepto que a fórmula decorada erra. E o
  notebook `regressao_limonada.ipynb` deixa de escrever em prosa o gabarito de `e4`: o número
  continua saindo quando o notebook roda, e não mais quando ele é apenas lido no navegador.
- **O notebook ganhou um `# TODO`**, e o cartão "Mão na massa" ganhou o ciclo que o autor pediu: o
  leitor altera o corte de treino e teste, roda, e cola o número de volta num exercício `numerica`
  cujo gabarito nunca desce ao cliente. Com duas ressalvas declaradas no próprio cartão: o número
  prova o número, nunca a execução.
- **`O2` e `O4` foram reescritos** para ter um verbo só cada (Guia §2.5): `O2` passa a "calcular", e
  `O4` sobe de "reconhecer" para **"decidir"**, que é o que os exercícios da tabela de restrições
  sempre cobraram.

### Adicionado — a espiral da limonada: o caso central do `II.2` virou seis voltas de laboratório (D27)

- **O defeito, confirmado antes de consertar.** Um crítico cego mediu a escada do capítulo
  contra o notebook do capítulo 10 do Géron. Com um instrumento declarado (grau de produção
  exigido por cartão, 1 a 5, média dos atos de cada cartão), a inclinação do `II.2` era
  **−0,0027 por cartão**, com média **2,71** na primeira metade e **2,63** na segunda: não é
  ruído em torno de uma subida, é ausência de subida. O mesmo instrumento aplicado às 210
  células do notebook dá **+0,0024**, com o ciclo inteiro fechado **32 vezes**, de 7,1% a
  98,6% do caminho. Dos 38 exercícios, **21 eram "escolha uma"**, e a única resposta que o
  aluno produzia estava a **84,2%**. O desvanecimento aparecia nos cartões 5, 7, 12, 14 e 23
  e nunca mais.
- **O caso da limonada era o pior lugar para isso acontecer.** 365 dias, quatro atributos e o
  achado central do capítulo — confundimento perfeito, colinearidade, R² como armadilha —
  gastos em **oito cartões seguidos de leitura com múltipla escolha no fim**. O aluno acertava
  entre quatro alternativas sem nunca produzir um diagnóstico.
- **O conserto é o mecanismo do Géron: a mesma alça, fechada seis vezes, um mecanismo novo
  por volta e nunca dois.** Nasce o tipo de laboratório `regressao-limonada`, que ajusta por
  solução fechada sobre o conjunto real e reabre nos cartões 21 a 26:

  | volta | cartão | a decisão nova | o que o aluno produz |
  |---|---|---|---|
  | 1 | 21 (52,6%) | ajustar `vendas ~ preco`, sozinho | o coeficiente **+47,0** |
  | 2 | 22 | a caixa `temperatura` | ele cai para **1,64** e **não morre** |
  | 3 | 23 | `precipitacao` e `panfletos`, e a linha do R² | **R² 0,982**, com o preço subindo para 2,41 |
  | 4 | 24 | a coluna derivada `alta_temporada` | o painel **recusa**, e sem o preço sai **0,483** |
  | 5 | 25 | o corte de treino | com 200 dias, `panfletos` vai de 0,0188 a **0,0159** |
  | 6 | 26 | o recorte de meses | recusa nos doze, e o que sobra em julho dá **R² 0,948** |

- **Cinco exercícios deixaram de ser "escolha uma".** `e22`, `e23`, `e24`, `e5` e `e27` passam
  a cobrar um número que só existe depois de o aluno rodar o ajuste. As "escolha uma" do
  capítulo caem de **21 para 16**, as `numerica` sobem de 10 para 15, e a primeira execução
  sobre o dado real sai de **68,4% e de fora da página** (o link para o Colab, no cartão 27)
  para **52,6%, dentro do cartão**.
- **O que o instrumento diz depois.** A inclinação global vai de −0,0027 para **+0,0047**, e a
  segunda metade deixa de pedir menos que a primeira: média **2,63 → 3,09**. Contando só os
  exercícios, a segunda metade sai de 1,79 para **2,32**. O portão da escada, que lê a
  etiqueta `dificuldade` e não o que o exercício pede, registra ρ de 0,437 para **0,451**, depois 0,497 com a rampa da D29 — a
  diferença entre os dois números é a medida do que uma etiqueta não enxerga.
- **A recusa é conteúdo, não erro.** Com `preco` e `alta_temporada` marcadas o sistema não
  fecha, porque `preco` = 0,30 + 0,20 × `alta_temporada` dia a dia, sem resto: é a frase
  "preço e estação são a mesma variável com dois nomes" virando mensagem do painel. E em
  qualquer mês recortado o preço tem um valor só, então o painel devolve o aviso do **passo 5**
  da dedução, nomeando a coluna constante em vez de dizer "singular".
- **Sem canvas, e é decisão.** O painel escreve em tabela do DOM. A 360px o menor texto sai a
  **12,8px** (contra os 6,0px que a D18 mediu no canvas de backing store fixo), o leitor de
  tela alcança os números, e não há o que reescalar. Também não há barra comparando
  coeficientes lado a lado: seria bonita e seria o erro que o cartão 28 nomeia. A única
  comparação que o painel oferece é a coluna **antes**, o mesmo coeficiente contra ele mesmo
  na volta anterior.
- **D28 respeitada por construção.** O painel só imprime `R²` a partir do cartão 23, que é o
  que o apresenta, e expõe `__api.vocabulario()` com tudo o que pode escrever em qualquer
  estado, inclusive as três recusas que só aparecem depois de um clique. Seis laboratórios
  passam a oferecer a função.
- **`publicar/testes/lab-limonada.mjs`** (25 verificações) dirige os seis painéis exatamente
  como cada enunciado manda e compara com o gabarito **lido do Markdown**, não copiado para o
  teste. Ele foi visto reprovando com o gabarito trocado, com a recusa deixando de nomear a
  coluna, com duas decisões estreando na mesma volta, com o R² impresso dois cartões antes de
  ser apresentado, e com `alta_temporada` marcando só julho.

### Adicionado — a tigela deixou de ser palavra: o plano (a, b) virou painel vivo (D25)

- **O defeito, medido.** O `II.2` tinha **zero figuras em 39 cartões**, e o cartão 9 apoiava a
  dedução inteira numa frase: *"L é uma soma de quadrados, uma superfície convexa em (a, b), uma
  tigela; tigela tem um fundo, e só um"*. É dessa afirmação que sai o direito de derivar, igualar
  a zero e chamar o resultado de mínimo, e os cartões 10 a 14 pedem a álgebra num visor de 360px
  a partir de um substantivo. A referência de microlearning mostra a tigela três vezes.
- **O conserto não é ilustração.** O laboratório do cartão 8 ganhou um **segundo painel**: o plano
  (a, b) com as curvas de nível do erro quadrático médio, o fundo marcado, o ponto do leitor sobre
  ele e o **rastro** de onde ele já esteve. O leitor arrasta a alça da reta e vê o próprio ponto
  descer a tigela.
- **Nenhuma manopla nova** ([ADR 0015](adr/0015-animacao-e-laboratorio-sem-manopla.md)): o controle
  continua sendo a alça e os dois cursores, e o painel é a consequência visível deles. O par
  corrente e o erro nele são escritos na tela, com nome, ao lado do erro do fundo.
- **A aritmética é exata, e é testada como tal.** Com as equações normais,
  `L(a, b) = L(â, b̂) + A·u² + 2B·u·v + C·v²`, e a forma é positiva definida — um fundo, e só um.
  `publicar/testes/lab-tigela.mjs` confere a decomposição contra o cálculo bruto do erro e mede
  cada anel desenhado em 24 ângulos, além de cobrar rastro, quadro e legibilidade. Os cinco modos
  de falha foram vistos reprovando antes de o teste entrar.
- **O laboratório passou a ler `clientWidth`** e a diagramar em pixels de CSS (defeito **D18**):
  o texto que chegava ao leitor a **6,0px** numa coluna de 360px agora chega a **12,0px**, medido
  num Chromium. Sobram 26 laboratórios com backing store fixo.
- **Os dois painéis couberam no cartão sem estourar o teto de 1.600px**, e o preço está declarado:
  rótulo de botão mais curto (que passou de três linhas para duas no celular), veredito de uma
  linha só, e a dica que repetia a intro do laboratório. O cartão 8 mede **1.563px** contra 1.561
  antes, com 158 palavras.
- **O cartão 9 passou a apontar para o gesto**: "a tigela que você percorreu no laboratório". A
  explicação que constrói sobre a tentativa do leitor rende g = 0,56; a que a ignora, g = 0,20
  ([`BASE-EDUCACIONAL.md`](livro/BASE-EDUCACIONAL.md) §3.1).

### Corrigido — 223 siglas chegavam nuas ao leitor, e a causa era uma linha do motor (D24)

- **O defeito, medido.** O motor embrulha cada sigla conhecida em `<abbr>` com a expansão no
  `title`, e o embrulho parava na **primeira alternativa de exercício de cada página**: 223
  ocorrências nuas dentro de bloco interativo, 207 `<abbr>` em 35 das 49 páginas, e o `II.2`
  com **zero** `<abbr>` usando "AUC" quatro vezes sem expandir nenhuma. Viola o Princípio VIII.
- **A causa não era a ordem de renderização.** O passe `abrirSiglas` já rodava depois de os
  blocos interativos virarem HTML. O que o parava era `<input>` na lista de tags protegidas:
  elemento vazio, escrito sem barra final, subia o contador de proteção e nunca o descia. Da
  primeira alternativa em diante a página inteira ficava protegida, prosa comum junto.
- **O conserto**: elemento vazio nunca abre escopo de proteção, e `label` e `button` saem da
  lista, porque é ali que moram o texto da alternativa e o rótulo do gesto. Resultado: 207
  `<abbr>` viram **470**, e a conta de sigla nua nos 27 capítulos vai a zero. O passe passou a
  alcançar também o teaser do cabeçalho do capítulo e a descrição da capa.
- **Asserção nova na auditoria da jornada**: `H` abre cada página num Chromium e cobra que toda
  sigla do dicionário em texto visível esteja dentro de um `<abbr>`. Falha nas duas direções, no
  molde do `FORMULA_CORTADA_PENDENTE`, e imprime os números inclusive no verde.
- **Dívida declarada, com o motivo escrito**: 14 ocorrências em 5 páginas continuam nuas porque
  são escritas pelo navegador, por `publicar/tema/laboratorios.js`, depois da carga — o "IQR" da
  tabela do boxplot, o "SQE" do painel de perda, o "AUC 0.65" do mostrador de vazamento. Nenhuma
  passa pelo motor. Entram em `SIGLA_NUA_PENDENTE`, com número por página.
- **O dicionário virou módulo**: `publicar/siglas.mjs` guarda as 65 siglas e o passe, com teste
  próprio em `publicar/testes/siglas.mjs` (12 casos, sem navegador).
- **Uma isenção que era falsa passou a ser verdadeira.** `gates/glossario-ligado.mjs` dispensa as
  siglas da tabela escrevendo que "o motor já a embrulha em `<abbr>`". Era verdade em 35 páginas
  e falso onde o texto era interativo. O comentário passou a dizer isso, com a data, e a apontar
  quem mede o mecanismo que sustenta a isenção.

### Adicionado — o glossário deixou de ser um arquivo para o qual ninguém aponta

- **A régua, medida.** A página de perda da regressão linear do Google Machine Learning Crash
  Course liga **nove termos** ao glossário numa página só, cada um no primeiro uso. Medido aqui
  no mesmo dia: `grep -ro 'glossario\.md' livro/capitulos/ | wc -l` devolvia **0**. Os 27
  capítulos não apontavam para `livro/glossario.md`, que existia com 8 verbetes.
- **18 verbetes novos** em `livro/glossario.md`, levantados lendo o `II.2` inteiro: regressão
  linear e logística, mínimos quadrados, solução fechada, gradiente descendente, taxa de
  aprendizado, convexidade, centro de massa, ortogonalidade, inclinação, intercepto, erro
  absoluto, padronização, coeficiente, coeficiente de determinação, extrapolação e ensemble.
  `Confundidor` ganhou `confundimento` como variante, para o cartão não levar dois links a um
  passo um do outro.
- **80 ligações no `II.2`**, uma por termo por cartão, sempre no primeiro uso daquele cartão.
  A unidade é o cartão porque o leitor vê **um cartão por vez**: "primeira ocorrência no
  capítulo" põe o link no cartão 3 e deixa a descoberto quem abriu o cartão 27.
- **Portão novo**: `publicar/gates/glossario-ligado.mjs`, com testes em
  `publicar/testes/glossario-ligado.mjs` e passo próprio na CI. Reprova em quatro direções —
  termo usado e nunca ligado, link fora do primeiro uso, link repetido no mesmo cartão e âncora
  que não existe no glossário. As quatro foram vistas falhando antes de este texto ser escrito.
- **Onde ele se recusa a olhar, e por quê**: a alternativa de exercício não recebe link, porque
  `gates/vies-de-comprimento.mjs` mede o **comprimento em caracteres** da alternativa, e um link
  de 38 caracteres que não muda uma palavra para o leitor deslocaria aquela medição. Fora
  também o lado da resposta, que nem chega ao HTML (Princípio VIII.3).
- **Dívida declarada, no molde do D17**: os outros 26 capítulos entram em `LIGACAO_PENDENTE`,
  medidos pelo mesmo corte por cabeçalho que o leitor recebe (310 cartões, 592 usos de termo,
  0 ligados) e relatados em **toda** execução, inclusive no verde. Capítulo que ligar tudo e
  continuar na lista reprova o build.
- `gates/links-relativos.mjs` passou a rodar na CI, onde não estava.

### Adicionado — `:::aprofundar`, a dedução sai do fluxo principal sem sair do livro

- Novo bloco no motor (`publicar/interativos.mjs`): `:::aprofundar {"titulo":"…"}` vira um
  `<details>` **fechado**, sem uma linha de JavaScript. O teclado, o foco e a busca da página vêm
  do navegador, e o bloco continua inteiro com o backend fora do ar (Princípio VIII.6).
- Por que ele existe: o cartão tem teto de 1.600 px e de 250 palavras, a dívida D21 foi paga
  quebrando fórmula em duas linhas (o que *aumenta* a altura), e a carga cognitiva pede uma ideia
  nova por vez. A derivada completa dentro do fluxo principal é a segunda ideia da página.
- **Medido, não presumido**: num Chromium 141 a 360×800, o corpo fechado fica fora do `innerText`
  que `gates/cartoes-legiveis.mjs` usa para contar palavras. São 15 palavras contra 29 no mesmo
  cartão aberto, e 70 px contra 138 px. A asserção está em `publicar/testes/aprofundar.mjs` e
  cobra as duas direções, porque olhar só o lado fechado passaria com um bloco que nunca abre.
- O bloco **não pode virar esconderijo**, e a recusa é do parser: nenhum `:::exercicio`,
  `:::interacao`, `:::lab`, `:::video` ou corte de cartão vive lá dentro. O gate dos cartões acha
  `.exercicio` e `.interacao` com `querySelectorAll`, que atravessa `<details>` fechado; sem a
  recusa, um cartão passaria no portão da premissa do autor sem nada à vista para o leitor.
- A asserção G de `publicar/jornada.mjs` passa a abrir todo `<details>` antes de medir fórmula
  cortada, e a devolvê-lo ao estado anterior. O Chromium de hoje já devolvia a geometria do que
  está fechado, e foi medido; o que não existe é promessa de que continuará devolvendo.
- Documentação em `livro/BANCO-DE-EXERCICIOS.md` e em `publicar/README.md`.

### Corrigido — o laboratório do `II.2` pedia um chute e não dava onde chutar

- O laboratório `modelos-lineares-l2` pedia em negrito *"Antes de assistir, chute: quantos passos
  até chegar a 1% do ótimo?"* e não oferecia campo nenhum. Dois parágrafos abaixo, na mesma tela,
  estava a resposta: `1 460`. Sem campo e com o número à vista, o ganho de prever antes de ver
  não acontece, porque ele depende de o leitor ter se comprometido com um número.
- O pedido virou a interação `modelos-lineares-i39`, do tipo `prever` com campo numérico
  (`"numero":1460`, `"tolerancia":500`), **antes** do laboratório; o parágrafo com a resposta
  passou a ser o `revela` dela, que só aparece depois de o leitor arriscar.
- Reusou-se a peça existente em vez de dar o campo ao próprio widget, e a razão é de verificação:
  o bloqueio da `:::interacao` já é conferido num Chromium de verdade pela asserção F de
  `publicar/jornada.mjs`, que clica em revelar sem responder e exige que nada apareça. Um segundo
  mecanismo de bloqueio dentro de `tema/laboratorios.js` nasceria fora do alcance de F. Além
  disso, o `laboratório` é a superfície que, por definição, não tem gabarito a esconder.
- O cartão 15 passou de 1 466px para 1 547px, dentro do teto de 1 600px do gate dos cartões, e de
  191 para 159 palavras. A prosa de apoio foi encurtada para caber, e é onde o conserto doeu.

### Corrigido — fórmula cortada na margem, e a asserção G que passa a cobrar isso (D21)

- Quatro fórmulas do `II.2` mediam 408px, 445px, 514px e 324px em espaços de 322px e 281px num
  Chromium a 360px: o leitor via a expressão terminar no nada. Todas foram **quebradas em duas
  linhas**. O corte acontecia no modo cartão e também no fluxo longo.
- Quebrar, e não anunciar a rolagem, por uma razão medida no tema: com o modo cartão ligado,
  `tema/cartoes.js` liga `ArrowLeft` e `ArrowRight` à troca de cartão para tudo que não seja
  `INPUT`, `TEXTAREA` ou `SELECT`. O eixo horizontal já pertence ao baralho.
- **Asserção G** em `publicar/jornada.mjs`: para cada `mjx-container`, `scrollWidth <= clientWidth`.
  Ela existe porque a asserção A não a pega por projeto — A dispensa quem está dentro de um
  contêiner que rola sozinho, e a fórmula está. A cuida do layout; G, da leitura.
- Dívida em `FORMULA_CORTADA_PENDENTE`, no molde do `PROSA_PENDENTE`: **12 fórmulas em 5
  capítulos**, cobrada nas duas direções. Conferido quebrando o conserto de propósito — devolver a
  fórmula do passo 3 à linha única reprova com `445px num espaço de 322px`; declarar dívida no
  `II.2` já limpo reprova pedindo a saída da lista.
- Stubs de redirecionamento não entram em G: o `meta refresh` leva o navegador ao destino, e medir
  ali contaria a mesma fórmula duas vezes. São 29 dispensados, e o número é impresso sempre.


### Adicionado — gate BILATERAL de viés de comprimento nas múltiplas escolhas (D17)

- **O defeito original**, medido no `ROADMAP.md`: **88% das múltiplas do livro eram gabaritáveis
  marcando a alternativa mais longa**, contra 25% de acaso. A causa é assimetria de esforço, e não
  descuido: a correta precisa ser defensável e ganha a ressalva; o distrator só precisa estar
  errado, e sai curto.
- **A cura ingênua criou o defeito espelhado, no mesmo repositório e na mesma semana.** Encurtar as
  corretas do `II.2` levou o capítulo de 88% a **0 de 26**. Zero está tão longe do acaso quanto 88%,
  só que do outro lado: quem aprende a **riscar** a mais longa elimina uma em quatro sem abrir o
  livro. Um gate que cobrasse só o excesso teria dado verde exatamente aí.
- **`publicar/gates/vies-de-comprimento.mjs`** compara o número de itens em que a correta é a mais
  longa com o esperado Σ 1/Nᵢ, e reprova por `|z| > 2,5` — os **dois** lados.
- **O teto é 2,5 por medição, não por gosto.** Um capítulo deste livro tem cerca de 26 múltiplas, e
  0 de 26 dá z = −2,94: um teto de 3 deixaria passar justamente o estado que originou o gate.
- **Dívida declarada e cobrada nas duas direções**, como no `PROSA_PENDENTE`. As 36 páginas ainda
  enviesadas (223 de 252, 88%) estão em `VIES_PENDENTE`: são medidas, relatadas em toda execução e
  não reprovam. Mas página que já foi consertada e continua na lista **reprova o build**, porque
  dívida paga que não sai da lista esconde a próxima.
- Vinte e sete casos em `publicar/testes/vies-de-comprimento.mjs`, e os dois que decidem são o
  excesso e a falta. Conferido também contra o livro real: tirar `ii-4-otimizacao` da lista sem
  consertá-la reprova por excesso (z = 3,22); o `II.2` do commit anterior reprova por falta
  (z = −2,94); declarar o `II.2` já consertado na lista reprova pedindo a saída dela.
- O `II.2` é a primeira página **cobrada**: 8 de 26 com a correta mais longa (esperado 6,5,
  z = 0,68), a correta mais curta em 6 de 26, e a posição da resposta certa distribuída em
  6 / 6 / 8 / 6.
- O mesmo canal lateral existia nas **interações de previsão**, onde não vale nota e mesmo assim
  destrói o gesto: a opção verdadeira estava em segundo lugar em 10 de 13, e nunca em primeiro.
  Quem aprende "é sempre a do meio" para de prever. Agora está em 4 / 3 / 6. Isto o gate **não**
  cobra, porque interação não vira nota e não entra no banco: fica como dívida declarada aqui.


### Alterado — o `II.2` foi remontado na ordem do ADR 0022, e todo cartão passou a ter uma interação e um exercício

- **A ordem mudou, e a história foi para o fim.** A seção "De onde isto veio" saía na linha 30,
  trinta linhas antes do modelo, e é ali que o diagnóstico dizia que o leitor apressado desiste.
  O capítulo passa a correr nos cinco atos do
  [ADR 0022](adr/0022-a-ordem-do-capitulo-pratica-antes-historia-depois.md): o problema, a conta
  (exemplo trabalhado antes da prática, porque procedimento rende g = −0,03 quando se pratica
  primeiro), a leitura, a decisão, e a história no fim. Os cinco elementos e a tabela de selos
  vieram intactos, como o Princípio X exige das duas posições.
- **A fronteira do ADR foi respeitada ato a ato.** No Ato II a dedução mantém a ordem
  fórmula → exemplo trabalhado → prática desvanecida. Nos Atos III e IV a prática vem antes: a
  montagem da limonada, o preço-termômetro e o confundimento perfeito agora **precedem** a lista
  das "quatro coisas que o coeficiente não diz", que passa a nomear o que o leitor acabou de
  produzir. É a condição que Sinha & Kapur medem em g = 0,56 contra 0,20.
- **A premissa do autor passou a valer sem exceção:** todo cartão tem uma interação **e** um
  exercício. Eram 13 de 18 cartões sem interação e 6 de 18 sem exercício. São **39 cartões**, e
  o gate `cartoes-legiveis.mjs` passa por inteiro, dentro de 400–1 600 px e 80–250 palavras, com
  razão maior/menor de 1,6x contra o teto de 3x.
- **O baralho ficou contínuo.** Nenhum `:::cartao-fim` no meio: `pontasDe()` reporta **47 de
  16 373 palavras** fora do baralho, e são o título e o selo de data. Voltaram para dentro os
  três trechos que a régua antiga tinha expulsado — a montagem da limonada, "O que o coeficiente
  diz" e "Uma vez com número" — mais o "Reproduza", a síntese, a verificação e os objetivos de
  aprendizagem, que o leitor de cartão nunca tinha visto.
- **27 exercícios e 34 interações novos**, e nenhum bloco antigo perdido. As interações são 18
  `prever` (5 delas numéricas), 16 `principio` e 3 `desvanecidas`, mais os 2 laboratórios que já
  existiam. Nenhuma `aberta` nova: a única do capítulo continua sendo a do preço da limonada,
  como o [ADR 0014](adr/0014-tres-exercicios-por-objetivo-e-a-prova.md) manda.


### Corrigido — o modo cartão escondia 29,1% do `II.2`, e três exercícios que valem nota ficavam impossíveis de responder

- **O mecanismo.** Com o baralho ligado, o `tema/cartoes.js` põe `hidden` em tudo que não caiu
  dentro de um cartão. Isso é deliberado. O que não era deliberado é a **ilha**: fechar o
  baralho no meio do capítulo com `:::cartao-fim`, escrever prosa, e reabrir com outro
  `:::cartao`. O trecho do meio existe na página inteira, some no modo cartão, e nada avisava.
- **O tamanho, medido no `II.2`:** seis interrupções, **2.198 das 7.543 palavras** fora do
  baralho. Sumiam a montagem inteira do caso da limonada (os 365 dias, a correlação
  `preco +0,851`, a tabela preço × estação), o exemplo aritmético que torna a dedução concreta,
  e a seção que diz o que o coeficiente **diz**, antes das quatro que dizem o que ele não diz.
- **E o dano não parou na prosa.** Três exercícios estavam **dentro** de cartões citando
  material que tinha ido para a ilha: `e4` pede *"pelo ajuste múltiplo acima"* e não há acima;
  `e5` cita um coeficiente `+2,41` que não aparece em cartão nenhum; `e6`, a aberta corrigida
  por rubrica, abre com *"você tem os 365 dias do conjunto acima"*. **Um quarto do banco do
  capítulo era inrespondível justamente no modo em que o capítulo se propõe a ser lido no
  celular** — e os cartões do Nível 3, que carregam a tese, argumentavam sobre um número que o
  leitor de cartão não tinha visto.
- **O conserto é um gate, não um remendo.** `ilhasDe()` em `publicar/cartoes.mjs` reprova o
  build, com a linha e a amostra de cada trecho perdido. Ilha não degrada a leitura: ela quebra
  a avaliação, em silêncio, e do lado do leitor que tem menos tela para descobrir o que faltou.
- **A ponta continua permitida, e passa a ser dita.** Ficar fora do baralho antes do primeiro
  marcador ou depois do fecho final é decisão de autor, e é onde moram o cabeçalho e o selo de
  data. Mas sem número isso seria a mesma perda um passo ao lado: bastaria adiantar o fecho para
  o capítulo virar rodapé escondido com o gate calado. `pontasDe()` imprime o quanto **em toda
  execução, inclusive quando passa**.
- Treze casos em `publicar/testes/cartoes-ilha.mjs`, incluindo os que o detector **não** pode
  acusar: capítulo sem baralho, ponta nas duas bordas, fecho vazio e marcador citado dentro de
  cerca de código. Detector que acusa demais é desligado, e desligado ele não acusa nada.

### Corrigido — um teste de motor fixava a contagem de conteúdo de um capítulo

- `publicar/testes/interacoes.mjs` exigia que o `II.2` tivesse **exatamente** três interações,
  que era o número do dia em que ele nasceu. Reprovou assim que o capítulo ganhou a quarta,
  dando o veredito "motor quebrado" para o fato "o livro cresceu". A asserção passa a ser sobre
  **cobertura de tipo**: os três tipos continuam exercitados por texto real, que é o que pega um
  tipo virando letra morta numa refatoração.

### Adicionado — `livro/BASE-EDUCACIONAL.md`, e o que ele revelou ao ser escrito

- **A evidência estava em seis lugares, e regra que mora em seis lugares diverge em silêncio.** Os
  achados que decidem a ordem dos atos de um capítulo viviam espalhados entre a constituição, o
  guia editorial, o banco de exercícios, uma ADR, o `CHANGELOG` e um comentário de 40 linhas dentro
  de `tema/interacoes.js`. Agora estão num documento só, escrito para o autor e para o agente na
  mesma leitura.
- **O achado do levantamento: nenhuma das cinco fontes educacionais está em `bibliografia.md`.**
  Sinha & Kapur, Alfieri *et al.*, Bisra *et al.* e Atkinson, Renkl & Merrill sustentam hoje a ordem
  dos cinco atos, o bloqueio da revelação em toda interação e os três tipos formativos — e **nenhuma
  tem registro de verificação neste repositório**. A `bibliografia.md` é onde se responde "esta
  referência pode sustentar uma afirmação?", e elas não estão lá. As quatro entram no documento com
  selo **⏳**, e a fila de verificação da §8 é ordenada por dúvida fechada por unidade de esforço.
- **As regras ficam de pé; o que muda é como elas podem ser citadas.** Foram adotadas e estão
  funcionando. O que não se pode é apresentá-las como evidência verificada, e onde o livro se apoiar
  num número em ⏳ o texto precisa dizer o mesmo.
- **O espaço negativo ganhou seção própria (§5)**, porque é a parte que se perde primeiro: a posição
  da narrativa histórica é **❌**, sem estudo achado; a profundidade da correção não vem de achado
  nenhum e sim do Princípio VIII.2; os limites de tamanho do cartão são **📖**, medidos aqui; e
  "é microlearning" não é argumento para coisa alguma.
- **A §7 mapeia cada regra ao portão que a cobra**, que é o que torna o documento utilizável por um
  agente. Três linhas dizem "revisão humana", e isso é dívida declarada: são as regras que ainda não
  viraram asserção executável.
- Ligado a partir do `CLAUDE.md`, da constituição, do `GUIA-EDITORIAL.md` e do `BANCO-DE-EXERCICIOS.md`.
  O gate de links pegou um link meu quebrado para a ADR 0014 antes de qualquer publicação.

### Corrigido — o gate do modo cartão levava 40 minutos, morria em arquivo faltando, e quase virou um gate de uma página só

- **O custo.** Ele abria as 81 páginas com `waitUntil: "networkidle"`, e `networkidle` só
  desiste no timeout de 30s — o site tem ilhas que atualizam sozinhas e nunca dão o silêncio
  que ele espera. Medido: **sete minutos para chegar à décima quinta página**. Com
  `waitUntil: "load"`, que é a espera certa porque o modo cartão é montado na carga e não
  depende de rede, as 81 páginas levam **37 segundos**.
- **O erro que se disfarçava de outro.** O servidor de teste escrevia o cabeçalho **antes** de
  ler o arquivo, então todo 404 estourava `ERR_HTTP_HEADERS_SENT` e derrubava o gate inteiro
  com um stack que não fala de cartão nenhum. Agora lê primeiro; e página pedida à mão que não
  existe recebe uma frase, não um stack.
- **E o defeito que quase entrou no lugar.** Com o custo resolvido, a economia óbvia era só
  abrir as páginas cujo Markdown traz `:::cartao`. Ela estava errada: **toda** página tem modo
  cartão, porque sem marcador o `cartoes.js` corta por cabeçalho. O filtro teria estreitado o
  gate de 81 páginas para 1 **sem dizer a ninguém** — a classe de defeito que este
  repositório passa o tempo caçando. Foi medido antes de ser adotado, e por isso caiu.
- **O que ficou no lugar do filtro:** todas as páginas são medidas, e o marcador decide o que
  se **cobra**. Baralho cortado à mão é cobrado por inteiro, com a premissa do autor (todo
  cartão tem interação e exercício); baralho por cabeçalho é medido e **relatado**, sem
  reprovar. E o resumo imprime os dois números **sempre, inclusive quando passa** — é isso que
  impede a camada relatada de virar silêncio. O gate também recusa uma varredura em que só
  sobre a camada relatada: gate que só relata não é gate.
- O tamanho do que ficou de fora virou a **D20** do [`ROADMAP.md`](ROADMAP.md): 623 de 682
  cartões sem interação em 57 páginas, pior razão 80,1x.

### Adicionado — asserção **F** na auditoria da jornada: a interação que bloqueia é clicada num Chromium de verdade

- **A afirmação mais próxima do leitor era a menos protegida.** O bloqueio do `prever` — o
  botão que não libera enquanto o leitor não arrisca — é a peça em que a evidência do método
  se apoia: resolver antes de explicar só rende quando a explicação vem **depois** da
  tentativa. Ele estava afirmado em dois lugares que não são o navegador: o
  `publicar/testes/interacoes.mjs`, num DOM falso, e um script de rascunho **fora do
  repositório**. Um DOM falso não tem `disabled`, não tem foco e não tem tabulação; foi
  exatamente por aí que um `aria-disabled` passou, deixando o botão inalcançável para leitor
  de tela sem que teste nenhum reclamasse.
- **O que F cobra, por página:** as interações do fonte chegam ao DOM (contagem
  `:::interacao` × `.interacao`, a mesma trava que a asserção B faz pelos exercícios); cada
  uma tem botão, `role="status"` e um controle onde responder; e então o script **clica em
  revelar sem responder nada** e exige que a revelação **não** tenha acontecido e que a
  página **tenha dito por quê**.
- **Quatro mutações, quatro falhas** — porque portão que nunca se viu falhar não é portão.
  Dispensar a resposta acusa `revelou sem o leitor ter respondido`; bloquear sem escrever no
  status acusa `bloqueou a revelação e não disse por quê`; renomear uma `<section class="interacao">`
  no HTML montado acusa `o fonte declara 3 e o navegador montou 2`; remover o campo de
  previsão acusa `interação sem botão, sem status ou sem onde responder`. Com o código
  íntegro, as 81 páginas passam.
- O clique é disparado por `evaluate`, e não pelo Playwright, porque no modo cartão só um
  cartão fica visível e o Playwright — com razão — recusa clicar no que não se vê. O alvo de F
  é a regra; visibilidade quem cobra é a asserção A.

### Adicionado — `:::interacao`, a peça formativa que faltava para "todo cartão tem uma interação E um exercício"

- **A distinção define a arquitetura.** O exercício é **somativo**: vale nota, é corrigido no
  backend, grava tentativa por aluno, e o erro conta contra ele. A interação é **formativa**:
  não vale nada, é revelada **no cliente**, não grava coisa nenhuma — nem servidor, nem
  `localStorage` — e errar nela **é o ponto**. **É porque ela não vale nota que pode revelar
  no cliente sem violar o Princípio VIII.3**: aquele princípio protege o gabarito daquilo
  que é contabilizado, e aqui não há tentativa, placar nem telemetria a envenenar. De quebra,
  sem segredo não há chamada de rede, e a interação fica inteira com o backend fora do ar
  (Princípio VIII.6) — o teste roda o JavaScript real num ambiente onde tocar em `fetch`,
  `XMLHttpRequest` ou `localStorage` **explode**.
- **Três tipos, e cada um vem de evidência.** `principio` (exemplo trabalhado com pergunta de
  princípio; autoexplicação provocada supera receber a explicação pronta, g=0,35 — Bisra
  *et al.*, 2018); `desvanecido` (passo apagado, a linha certa aparece **ao lado** da do
  leitor, sem nota e sem "errado" — Atkinson, Renkl & Merrill, 2003); `prever` (o botão só
  libera depois da previsão, e a revelação **repete a previsão dele antes de dar o
  resultado**, porque o ganho de resolver-antes-de-explicar depende de a explicação construir
  sobre o que o leitor tentou: g=0,56 quando constrói, g=0,20 quando ignora — Sinha & Kapur,
  2021).
- **Sintaxe da casa**, com um desvio deliberado: o passo apagado é `- [?] rótulo => a linha
  certa`, e não `- [x]`. `[x]` significa "gabarito" aqui, e interação não tem gabarito — e o
  gate de vazamento do `build.mjs` recusa `- [x]` no Markdown exportado, que `semGabarito()`
  só limpa dentro de bloco de exercício. A previsão usa `- ( )` e `- (!)` pelo mesmo motivo.
  Documentação em [`livro/BANCO-DE-EXERCICIOS.md`](livro/BANCO-DE-EXERCICIOS.md).
- **O botão de revelar não nasce `disabled` nem `aria-disabled`.** As duas coisas o tiram da
  tabulação ou o anunciam como indisponível, e levam junto a única explicação de por que ele
  não libera — que mora no `role="status"` ao lado. Medido: o Playwright **recusa clicar** num
  `aria-disabled`, aplicando a mesma regra da tecnologia assistiva. O sinal de "ainda não" é
  `data-pronto`, que pinta e não bloqueia. A revelação entra num `aria-live="polite"` que já
  existe vazio no DOM, porque região viva criada na hora não anuncia de forma confiável.
- **Um de cada tipo no `II.2`, com conteúdo do próprio capítulo:** o peso do *outlier* no
  critério quadrático (`prever`: 100 contra 10), de onde sai o $x_i$ na segunda condição do
  mínimo (`principio`), e quem explica os 9,4 copos da limonada (`desvanecido`: 8,05 de
  temperatura contra 0,48 de preço, com o maior coeficiente da equação rendendo a menor
  parcela). **Os cartões sem interação caíram de 16 para 13**, dentro dos limites de altura,
  palavras e razão do gate.
- Arquivos: `publicar/tema/interacoes.js`, `publicar/testes/interacoes.mjs` (63 asserções,
  ligadas ao `testes/rodar.mjs`), parser em `publicar/interativos.mjs` e estilo em
  `publicar/tema/interativos.css`. **O `:::exercicio` e o backend não foram tocados**: o
  `banco.json` não ganhou nem perdeu item.

### Alterado — o modo cartão passa a cortar por conceito, não por cabeçalho (cap. `II.2`)
- A régua v1 cortava em cada `<h2>`/`<h3>`. Cabeçalho é critério **tipográfico**: diz onde o
  autor quis um título, não onde termina uma unidade que o leitor consegue fechar. Medido a
  360×800 no `II.2`, o resultado era **226 px a 5 849 px por cartão — 25,9x** entre o maior e
  o menor, contra 1,2x na referência de microlearning aprovada. O cartão "A dedução, em cinco
  passos" tinha **7,3 telas, 1 289 palavras e 49 blocos de fórmula**; o seguinte tinha 39
  palavras, e a navegação prometia "7 de 18" para os dois. Um cartão que rola sete telas é a
  página longa com um botão.
- O corte agora é **declarado no Markdown**: `:::cartao {"nivel":1,"titulo":"…"}` abre um
  cartão e `:::cartao-fim` fecha o baralho (`publicar/cartoes.mjs`, sintaxe no
  `publicar/README.md`). O marcador é **divisória, não invólucro** — um cartão contém
  exercícios, e `:::` aninhado em `:::` não é analisável pelo parser da casa. Ele chega ao DOM
  como um `<hr class="corte-cartao">` invisível, e `tema/cartoes.js` corta por ele.
- **`nivel` e `titulo` vêm do marcador**, então o rótulo virou `Nível 1 · cartão 3/17` (o da
  referência) em vez da seção-mãe, e um cartão cujo objeto é um laboratório passa a ter nome
  na barra de progresso e no `aria-label`.
- **`:::cartao-fim` é a saída para o trecho sem gesto.** A disputa Legendre-Gauss não tem o que
  manipular nem pergunta respondível sem rolar para trás: ela **continua no capítulo** e fica
  fora do fluxo de cartões. Perder conteúdo é falha; deixá-lo fora do baralho é decisão.
- **Os 28 outros capítulos não sentiram nada:** sem marcador, a régua cai no corte por
  cabeçalho, byte a byte como antes.

### Alterado — o `II.2` recortado em 17 cartões, com o portão fechando
- 17 cartões, **14 deles com exercício ou laboratório (82%)**; alturas de **614 px a 1 566 px**
  (razão **2,55x**) e de **136 a 240 palavras**. `gates/cartoes-legiveis.mjs` passa a sair 0.
- **Nenhum exercício foi reescrito.** Os 12 blocos `:::exercicio` só mudaram de lugar, para
  ficar junto do conceito que cobram — o `banco.json` regenerado é idêntico item a item, e só
  a ordem mudou.
- A dedução virou **cinco cartões encadeados** (a tigela · o centro de massa · a
  ortogonalidade · as duas somas · o aviso do denominador), com o exercício que cobra cada
  passo dentro do cartão do passo.
- Os passos 1 a 5, que eram parágrafos em negrito no meio de um bloco de 1 289 palavras,
  viraram `###` de verdade — o que também dá sumário e âncora à dedução na página longa.
- Prosa comprimida onde o teto de 250 palavras exigiu, **sem perder fato**: as três convenções
  da perda, as instruções dos dois laboratórios e as quatro coisas que o coeficiente não diz
  continuam completas.

### Adicionado — teste do marcador de cartão
- `publicar/testes/cartoes-marcador.mjs`: valida o que o marcador aceita, o que recusa (JSON
  quebrado, sem título, sem nível), o escape do atributo, o marcador citado dentro de cerca de
  código, e que um capítulo sem marcador sai byte a byte como entrou. Marcador que vira
  parágrafo não quebra nada: o capítulo volta em silêncio ao corte por cabeçalho, e defeito
  que não grita é defeito que fica.

### Corrigido — não são "setores censitários": são ***block groups*** (cap. `III.2`)
- O capítulo dizia **"20 640 setores censitários da Califórnia"**. A unidade é o ***block
  group***, que fica um degrau **abaixo** do *census tract*. Quem traduz por "setor
  censitário" e vai procurar acaba no *census tract*, que é cerca de **três vezes maior**, e
  sai com a intuição errada sobre o que uma linha do arquivo representa.
- **Confirmado na fonte primária.** A documentação do `scikit-learn` diz, literalmente,
  *"using one row per census block group"*, e o *Geographic Areas Reference Manual* do
  *Census Bureau* dá os tamanhos: *block group* com **ideal de 400 domicílios (250 a 550)**,
  *census tract* com **2 500 a 8 000 moradores** e **1 000 a 3 000 domicílios**.
- **E o próprio arquivo decide a questão:** a mediana medida é de **409 domicílios**, em cima
  do ideal do *block group* e bem abaixo da faixa de um *census tract*.
- Corrigido no capítulo, na ficha do dado e na etapa. Registrado na **errata**, que o `III.2`
  não tinha e agora tem.

### Adicionado — a figura do encaixe do censo, e a ficha ganha `Fontes` com selos
- `publicar/tema/block-group.svg`, gerada por `publicar/figuras/block-group.mjs`: os cinco
  níveis encaixados (Estado ⊃ Condado ⊃ *Census tract* ⊃ *Block group* ⊃ *Block*), com o
  *block group* destacado como "cada linha do CSV". **Segunda figura gerada do livro.**
- Os números têm duas procedências e a figura diz qual é qual: os do censo vêm do GARM e
  estão citados; os do arquivo são **medidos na geração**, lendo o CSV congelado. Número em
  figura não pode ser literal digitado à mão — foi esse o defeito da primeira versão da figura
  da camada escondida.
- O gerador **se recusa a desenhar** se a mediana medida sair do ideal do *block group* ou
  entrar na faixa de um *census tract*: a figura afirma isso, então recusa existir se deixar
  de valer. Visto falhando com um CSV de medianas infladas.
- A ficha do dado ganhou seção **`Fontes`** com selos: ✓ para o `scikit-learn` e os dois
  capítulos do GARM (abertos e lidos, com as frases citadas), ✓ᵐ para Pace & Barry (1997), e
  **❌ para o StatLib** (403 na tentativa) e **para o IBGE** (403) — por isso a ficha **não**
  afirma equivalência de tamanho entre *block group* e setor censitário do IBGE.

### Corrigido — a hipótese da vacância deixou de ser hipótese
- A ficha registrava como **não confirmada** a explicação para `AveRooms` chegar a 141,9. A
  documentação do `scikit-learn` a confirma nestas palavras: *"these columns may take
  surprisingly large values for block groups with few households and many empty houses, such
  as vacation resorts"*. `total_rooms` conta todas as unidades; `households`, só as ocupadas.

### Adicionado — gate de deriva das figuras, porque nada as regenerava
- As figuras deste livro são **geradas dos dados**, e ficavam versionadas como SVG sem que
  nada as regerasse. O dado podia mudar e a figura seguir afirmando o número velho, em
  silêncio, ao lado de um texto que já dizia outro — o mesmo defeito que o gate de deriva do
  `banco.json` fecha, e ninguém tinha fechado para figura.
- `publicar/figuras/verificar.mjs` regenera cada uma e compara; a CI ganhou o passo. Falha
  também se um gerador não tiver SVG versionado, ou se as asserções do gerador recusarem os
  dados.
- **Ele não mutila a árvore de trabalho.** A primeira versão deixava o SVG regenerado no
  lugar, então a segunda execução passava: o gate "consertava" o que devia denunciar, e a
  falha não era reproduzível. Agora restaura o arquivo e falha igual nas duas execuções —
  conferido por código de saída, sem `| tail` mascarando nada.

### Adicionado — as 10 colunas do arquivo cru, explicadas uma a uma
- A ficha definia `households` e listava o resto numa tabela. Agora cada coluna tem
  tratamento, e três achados saíram daí:
- **São três as colunas censuradas, não uma.** A ficha declarava só o alvo. `housing_median_age`
  tem teto em **52**, com **1 273 setores** (6,17%) exatamente ali, contra 48 em 51 — o degrau
  denuncia o *top-coding*. E `median_income` é censurada nas **duas** pontas: teto em
  **15,0001** (49 linhas) e piso em **0,4999** (12 linhas), com o `±0,0001` servindo de
  sentinela para distinguir o valor censurado do redondo.
- **`ISLAND` some do teste.** Dos 5 *block groups* dessa categoria, **4 caem no treino, 1 na
  validação e ZERO no teste**. Quem fizer *one-hot* ganha um atributo que vale 1 em quatro
  linhas de treino e em nenhuma de teste: o modelo aprende um peso que jamais será avaliado.
  Com 5 exemplos, nenhum sorteio razoável garante presença nas três partes.
- **Onde está o resultado, medido por ablação:** só `MedInc` leva o erro de 0,8982 para
  0,6217, e ali linear e MLP empatam (0,6217 contra 0,6183). Só latitude e longitude dão
  0,7165 com a rede — **apesar de correlação individual de −0,144 e −0,046**, que numa tabela
  de correlação mandaria jogá-las fora. Tirar a geografia das oito piora o MLP de 0,3888 para
  **0,4620**. A vantagem da rede está nas **interações**, não na não-linearidade de uma
  variável isolada.

### Adicionado — a ficha do dado agora define as 10 colunas do arquivo cru
- O notebook novo entrega ao aluno **10** colunas do censo, e o repositório só definia as **9**
  derivadas. Lacuna aberta pela própria entrega anterior, e fechada aqui.
- **`households` ganhou parágrafo próprio, porque ele é o denominador.** No vocabulário do
  censo americano, um *household* é o conjunto de pessoas que ocupam uma unidade
  habitacional: domicílio **ocupado**, e casa vazia não conta. É contagem por setor
  censitário, inteira, de 1 a 6 082, mediana 409.
- Teste de sanidade que vale guardar: **10 310 499 domicílios** para **29 421 840 moradores**,
  ou **2,85 moradores por domicílio** — plausível para a Califórnia de 1990.
- **Explica os absurdos do arquivo derivado.** `AveRooms` em 141,9 e `AveOccup` em 1 243 não
  são erro de digitação: são denominador minúsculo. Nos 69 setores com mais de 20 cômodos por
  domicílio, a mediana de `households` é **95**, contra **410** no resto.
- Hipótese marcada **como hipótese**: se `total_rooms` contasse todas as unidades e
  `households` só as ocupadas, vacância explicaria o setor de 1 561 cômodos, 11 domicílios e
  30 moradores. O arquivo não tem coluna de vacância, então fica sem confirmação.

### Corrigido — três linhas do conjunto contradizem a definição da própria coluna
- Em **três** setores há **mais domicílios do que moradores**: 4 para 3, 39 para 27, 204 para
  198. Domicílio ocupado tem ao menos um ocupante, então isso não pode acontecer.
- São 3 linhas em 20 640 e não mudam resultado nenhum. O que elas mostram é a mesma coisa que
  as 207 linhas perdidas: o conjunto "clássico", usado em milhares de aulas, tem linhas que
  contradizem a própria definição das colunas, e ninguém esbarra nelas porque ninguém olha.
- Os **17 números** dessa seção da ficha foram conferidos contra o arquivo um a um, e os
  principais viraram teste (21 na etapa, 109 na trilha).

### Adicionado — o notebook do `III.2`: clicar e abrir, com o download do Kaggle
- [`ml-zero/etapa-19/rede_california.ipynb`](ml-zero/etapa-19/rede_california.ipynb), com o
  link **abre no Colab** na seção nova "Abrir no Colab, sem instalar nada" do capítulo. Nove
  células de código, todas executadas pelo verificador antes de cada publicação.
- Usa o trecho que o próprio Kaggle mostra na página do conjunto, sem mudar nada:
  `kagglehub.dataset_download("camnugent/california-housing-prices")`. **Medido: baixa sem
  credencial** — o conjunto é público e o `kagglehub` cai em acesso anônimo.
- **O notebook começa antes do que o capítulo começava.** O que vem do Kaggle não é o arquivo
  de 9 colunas: são **10** colunas do censo, com a coluna de texto `ocean_proximity` e
  **207 linhas sem `total_bedrooms`**. O aluno refaz a derivação (três dos oito atributos são
  razões por `households`) e `conferir()` compara a derivação dele com o congelado, coluna a
  coluna — o mesmo instrumento das linhas de base, um passo antes.
- `ml-zero/etapa-19/dados_kaggle.py` com `baixar_do_kaggle`, `carregar_bruto`, `derivar`,
  `conferir` e `comparar_com_o_congelado`.

### Adicionado — a cópia crua do conjunto, e a procedência conferida em vez de suposta
- `ml-zero/dados/california/housing_bruto.csv` (20 640 × 10),
  `sha256 8a3727f4cf54ac1a327f69b1d5b4db54c5834ea81c6e4efc0d163300022a685e`.
- **Byte a byte igual ao que o Kaggle entrega**, e isso foi *medido* na data da captura, não
  presumido: o download real bate no `sha256`, na forma, nas colunas e na posição dos nulos.
- Congelar não é desconfiança do Kaggle: conjunto de terceiro ganha revisão, sai do ar e muda
  de versão sem avisar, e no dia em que isso acontecer duas turmas de semestres diferentes
  deixam de ser comparáveis — que é o mesmo motivo de o `split.csv` estar gravado. Se o
  download falhar, o notebook segue pela cópia local e **diz** que fez isso.

### Corrigido — a quarta armadilha do conjunto: as duas cópias discordam, e nenhuma avisa
- As **207** linhas em branco no arquivo do Kaggle **têm valor** no que o `scikit-learn`
  distribui, e o valor é **inteiro**: 217, 279, 1 394, com **186 valores distintos** entre os
  207. Isso descarta preenchimento — média ou mediana dariam número quebrado, e o *mesmo*
  número repetido 207 vezes.
- Não é imputação: é dado que uma das duas cópias perdeu pelo caminho. Duas versões do mesmo
  conjunto, as duas chamadas "California Housing", discordam sobre 207 linhas.
- Está na ficha do dado, na seção nova do capítulo e num teste. É o argumento concreto de por
  que ficha com origem e `sha256` não é burocracia: sem ela, *"usei o California Housing"* não
  identifica o que se usou.
- 6 testes novos (20 na etapa, 108 na trilha), e o da conferência foi **visto falhando** com
  os dois erros plausíveis: dividir por `population` em vez de `households`, e esquecer o
  fator 100 000 no alvo. Nenhum dos dois lança exceção.

### Corrigido — o notebook da etapa 18 nunca foi verificado, e o README dizia que era
- `ml-zero/README.md` afirma que **todos** os notebooks têm as células executadas antes de
  cada publicação. O da etapa 18 não estava na lista de `tests/rodar_notebooks.py` desde que
  nasceu: rodava, e ninguém sabia disso. **Afirmação sem gate é promessa.**
- Achado ao acrescentar o notebook novo à lista. Os dois entraram; são **7** notebooks
  verificados, e a contagem "quatro dos cinco" do README, que também estava velha, foi
  corrigida para "cinco dos sete".

### Adicionado — a dívida do objetivo `O3` foi paga: a rede densa em NumPy
- Dois ciclos atrás, `scikit-learn` entrou na trilha **fora da ordem** que a Restrição 1 pede,
  por decisão de quem dá a aula, e a dívida ficou declarada em vez de escondida. Ela está
  paga: [`ml-zero/etapa-19/rede.py`](ml-zero/etapa-19/rede.py) implementa a rede densa do
  passo para frente ao update, com NumPy e mais nada.
- **A ponte é verificada, não afirmada.** `reproduzir_o_capitulo()` refaz o passo publicado no
  `III.2` com os mesmos nove pesos, e as **21 células** batem: $h_1 = 0{,}6457$,
  $\hat{y} = 0{,}5548$, $E = 0{,}1982$, os nove pesos depois, e a previsão em 0,6027. O teste
  compara célula a célula, então o capítulo e o código não podem divergir em silêncio.
- **`conferir_gradiente()` é o que a etapa realmente ensina.** Compara o gradiente analítico
  com a diferença finita da perda. Escrever retropropagação é fácil; escrever
  retropropagação certa é outra coisa, e um sinal trocado não lança exceção — a rede treina,
  a perda desce um pouco, e a culpa cai na taxa de aprendizado.
- **A mesma rede, nos mesmos 20 640 bairros: MAE 0,3990** contra 0,3878 da biblioteca, em
  menos de 5 segundos. Perto o bastante para dizer que é o mesmo método — que é a afirmação
  que interessa. Se ficasse longe, a conclusão honesta seria implementação com defeito, e
  não "biblioteca é melhor".
- 8 testes novos (14 na etapa, 102 na trilha), e o do gradiente foi **visto falhando**:
  removendo a derivada da ativação do caminho de volta, 5 asserções caem e o XOR desce para
  3 de 4 — exatamente o sintoma que o capítulo descreve.

### Corrigido — a rede à mão achatava a saída, e perdia para a mediana sem avisar
- A primeira versão de `rede.py` aplicava a ativação em **todas** as camadas, inclusive na
  saída. Nada quebrou: ela treinou, a perda desceu, e o erro no California Housing deu
  **1,1610** — pior do que prever sempre a mediana (0,8982).
- A causa depois de vista é simples: `tanh` não passa de 1 e o alvo vai até 5. A rede estava
  impedida de acertar **por construção**. Saída de regressão não leva não-linearidade, e é o
  que o `MLPRegressor` faz por padrão quando ninguém olha.
- Achado por medição, e não por leitura: o número saiu absurdo ao rodar. Virou a ativação de
  saída como parâmetro próprio (`igual`), um teste que prende o valor ruim, um comentário no
  construtor e um parágrafo no capítulo — é a segunda armadilha silenciosa da etapa, ao lado
  da padronização.
- `ml-zero/README.md` ganhou a seção da etapa 19, que não existia (nem para o `mlp.py`).

### Adicionado — o laboratório `mlp-tabela`: os nove pesos mudando na tela (cap. `III.2`)
- O capítulo mostrava **um** passo de retropropagação com todos os números, e dizia que um
  passo não é treinar. Dizer não é ver. O laboratório novo continua exatamente de onde a
  conta à mão para: **o primeiro clique reproduz a tabela do capítulo dígito por dígito**, e
  daí em diante o leitor segura o botão.
- As duas linhas de **gradiente zero** ficam destacadas na tabela. São $w_{21}$ e $w_{22}$, os
  pesos de $x_2$, e $x_2$ vale 0 no caso do capítulo: é a atribuição de culpa acontecendo na
  tela, e não numa nota de rodapé.
- **A manopla do [ADR 0015](adr/0015-animacao-e-laboratorio-sem-manopla.md) é "tudo zero", e a
  previsão que quase todo mundo faz está errada.** Zero parece a partida mais neutra que
  existe; a expectativa é "vai demorar mais". Medido: a rede **nunca** fecha o XOR e empaca em
  **3 de 4** — o mesmo lugar do perceptron do `III.1`, agora com uma camada escondida inteira
  sem servir para nada. O placar diz a razão em voz alta: $h_1$ e $h_2$ continuam idênticas.
- **Medido também o que a explicação fácil erraria.** Aumentar $\eta$ não resolve (de 0,5 a 10,
  sempre 3 de 4, simetria intacta). E o gradiente **não** é zero em toda a rede: no primeiro
  passo os seis da camada escondida são zero, porque o caminho de volta passa por $v_1$ e
  $v_2$; a camada de saída se mexe já nesse passo, e do segundo em diante os escondidos também
  recebem gradiente — sempre o mesmo para as duas unidades.
- Exercício `e19` (`multipla`, O4) cobra o diagnóstico, com as três alternativas erradas
  desmontadas por medição e não por retórica. **434 exercícios · 30 laboratórios.**
- A prosa diz explicitamente que a tabela da seção anterior é **lote cheio** e o laboratório é
  **por caso**, e que é por isso que o XOR fecha em **583 épocas** aqui contra as 8 000 de lá.
  Métodos diferentes, números diferentes, e a diferença aparece em vez de se esconder.

### Corrigido — 25 testes de laboratório existiam e a CI nunca os chamava
- `publicar/testes/` tem 25 testes que rodam o `laboratorios.js` **real** num DOM mínimo e
  conferem os números que o livro promete. Cada um foi rodado à mão no dia em que nasceu, e
  nunca mais: nenhum workflow os invocava. **Teste que ninguém roda não guarda nada** — ele
  registra o que era verdade naquele dia e apodrece junto com o código que deveria vigiar.
- Descoberto ao procurar onde ligar o teste do `mlp-tabela` na CI: não havia onde.
- `publicar/testes/rodar.mjs` roda todos e devolve código de saída; a CI ganhou o passo
  "Testes dos laboratórios e animações". Os 25 estavam verdes na hora de ligar, então o gate
  entra sem exceção nenhuma.
- O runner falha se o diretório estiver vazio: gate que passa sem rodar nada é o defeito que
  ele existe para impedir.
- `lab-mlp-tabela.mjs` compara as **21 células publicadas** do capítulo com o que o código
  calcula, e foi **visto falhando**: removendo o fator $v_j$ do delta escondido — um bug de
  retropropagação de aparência plausível — cinco asserções caem.

### Adicionado — o capítulo `III.2` sai dos quatro pontos: um MLP em 20 640 bairros
- Nova etapa `ml-zero/etapa-19/mlp.py` e nova seção **"Mão na massa"** no `III.2`. O mesmo
  método do capítulo, sem nada de novo, sobre o **California Housing** (20 640 setores
  censitários, oito atributos). A ponte com a conta à mão cabe numa linha:
  `mlp.coefs_[0].shape → (8, 64)` é a mesma matriz `entradas × saídas` que o capítulo manda
  contar, e uma rede 8 → 64 → 1 tem os 641 parâmetros que o programa imprime.
- **Os dados estão congelados no repositório**, em `ml-zero/dados/california/`, com ficha,
  `sha256` e o **recorte treino/validação/teste gravado num arquivo**. Nada é baixado quando
  o aluno roda, e nada é sorteado em tempo de execução: sorteio muda entre versões da
  biblioteca, e duas turmas de semestres diferentes deixariam de ser comparáveis.
- **As duas linhas de base são o checksum do protocolo, não concorrentes.** Mediana 0,8982 e
  regressão linear 0,5271; o MLP fica em **0,3878**. Número diferente do colega significa
  outro arquivo, outro recorte ou outra métrica, antes de significar modelo melhor.
- **A armadilha medida, e ela não avisa.** Sem padronizar (`--cru`), o erro sobe 34% para
  0,5193, a amplitude entre cinco sementes quadruplica (0,0060 → 0,0258) e a rede **desiste
  antes**: 52 a 76 épocas contra 238 a 336. Nenhuma exceção. O resultado empata com a
  regressão linear e sustenta a conclusão coerente e falsa *"a rede não ganha aqui"*. A causa
  está na ficha: `Population` tem desvio 1 132 e `AveBedrms` tem 0,474, razão de 2 390 vezes.
- **`--ocultas` é a única manopla do aluno.** A arquitetura é hiperparâmetro e se escolhe sob
  validação; o split, a métrica e o alvo não têm manopla, de propósito.
- `ml-zero/tests/test_etapa_19.py`, 5 testes: o recorte vem do arquivo, as linhas de base
  como checksum, `coefs_[0].shape == (8, 64)` e os 641 parâmetros, a rede bate a linear, e
  **não padronizar é pior e indistinguível da regressão linear** — é este último que prende a
  armadilha.
- **Dívida declarada, e não escondida.** Esta etapa *usa* uma rede pronta; ela não implementa
  uma. O objetivo **O3** promete a rede densa em NumPy, e essa etapa ainda não existe. A
  ordem que a construção pede é a inversa; `scikit-learn` entra no `requirements.txt` fora de
  ordem, por decisão de quem dá a aula, e a seção "O que este exemplo ainda não é" diz isso
  ao leitor.

### Adicionado — objetivo `O5` no `III.2`, com o trio que o cobra (433 exercícios)
- A seção nova trouxe uma capacidade que nenhum dos quatro objetivos declarava. Em vez de
  pendurá-la num objetivo alheio, o capítulo ganhou **O5 — "Executar um MLP num conjunto de
  dados real e diagnosticar o efeito da escala dos atributos sobre o treino"**, e o gate
  bidirecional de Backward Design passou a cobrá-lo.
- Trio conforme o [ADR 0014](adr/0014-topico-e-o-objetivo-a-prova-e-por-parte.md), com teto no
  verbo declarado e **uma única `aberta`**: `e16` (`numerica`) manda rodar `--ocultas 32` e
  fecha os 321 parâmetros por dois caminhos, a regra `e × s + s` e a saída do programa; `e17`
  (`multipla`) cobra o diagnóstico do `--cru`, separando *"parou cedo"* de *"convergiu
  rápido"*; `e18` (`aberta`) é o relato do experimento do próprio aluno.
- **`e18` cobra o que o exercício está realmente ensinando**, e com caso medido: 32 unidades
  dão 0,3852 contra 0,3878 das 64, uma diferença de **0,0026** — menor que a amplitude de
  qualquer uma das duas (0,0099 e 0,0060). A leitura honesta é "não distingui as duas". A
  rubrica exige confrontar a diferença **contra a amplitude** antes de declarar vencedor, e
  registrar a previsão escrita **antes** de rodar.
- Três itens novos na Síntese: linha de base como instrumento, escala de atributo como modo
  de falha silencioso, e semente como amostra de tamanho 1.

### Corrigido — a caixa que cobra rigor de data errava a data (cap. `III.1`)
- Ela discute a lenda de que "um italiano desenvolveu o backpropagation em 1979" e afirmava
  que *"o que existe em 1979 são as publicações de Werbos"*. A linha do tempo do **próprio
  capítulo**, cinco linhas acima, dá Werbos em **1974** e **1981**; em 1979 ela ancora só o
  neocognitron de Fukushima.
- Achado pela passada de humanização, que não podia corrigi-lo por envolver data e nome.
  Registrado na errata do capítulo, que vai a seis entradas.

### Corrigido — três defeitos dentro de blocos de exercício no `III.2`
- `e13`: o feedback tinha uma oração que não fechava — *"misturar as duas é como o aluno
  anota um número…"*.
- `e2`: *"Um MLP **densa**"* — o termo é masculino.
- `e9`: o feedback explicava o custo da primeira camada dizendo que *"é ela que **encontra a
  maior largura de entrada**"*, frase que não explica nada. Agora diz o que de fato acontece:
  ela recebe o vetor de entrada inteiro, e o número de pesos cresce com a largura do que entra.

### Alterado — passada de humanização em `III.1` e `III.2`, depois da reforma e não junto
- 13 edições, todas de prosa. As contagens saem idênticas às de antes — **430 exercícios, 7
  vídeos, 29 laboratórios, 49 páginas** — que é a prova de que nenhum bloco interativo foi
  tocado.
- **Quatro costuras que a reforma estrutural deixou**, e é para isso que a passada veio
  depois dela: um "E aqui" que apontava para o nada depois de ganhar cabeçalho por cima; o
  parágrafo do softmax repetindo o próprio título recém-criado; a abertura do planalto
  ecoando o título e com o referente ("a mesma rede") separado do exemplo por uma subseção
  inteira; e um *"o próximo exercício pede outra arquitetura"* cujo próximo exercício deixou
  de ser aquele.
- Uma seção nova abria **direto num exercício**, sem uma linha de prosa — caso único nos dois
  capítulos. Ganhou entrada.
- **Onde a skill foi recusada, e por quê:** banir travessões (contraria o ADR 0013, que fixa
  o limite em dois por frase); paralelismo negativo, nos casos em que o "não X, e sim Y" é
  literalmente a alternativa que o exercício vizinho testa — medidas as oito negações em
  cauda de cada capítulo, nenhuma foi cortada; voz passiva, porque em português a partícula
  passiva é a forma neutra para procedimento; regra de três em enumeração factual; e os
  rótulos em negrito de "O aperto / O que se fazia antes / A virada", que são o esqueleto
  obrigatório do Guia, não enfeite.

### Alterado — o `III.2` reorganizado em arco narrativo (revisão *developmental*)
- O autor disse: *"está difícil para ler, está tudo bagunçado. O conteúdo está bom."* Ele
  estava certo nas duas metades, e a causa era mensurável.
- **O defeito central:** um parágrafo ensinando **softmax e entropia cruzada** estava
  encaixado entre o `:::` que fechava um exercício e o que abria o seguinte. Conteúdo novo,
  nunca preparado, no meio do banco de exercícios — quem estava praticando pulava, quem
  estava lendo era interrompido. Ele subiu para dentro da seção, antes da prática, com
  cabeçalho próprio: `### E quando há mais de duas classes`.
- **A seção de retropropagação ocupava 45% do capítulo** e carregava onze ideias novas onde
  o Guia permite uma, com negrito no meio de parágrafo fazendo o trabalho que cabia a
  cabeçalho. Virou três seções. A maior agora tem **24,6%**.
- **Os títulos passaram a nomear movimentos do leitor, não assuntos.** "Duas retas: o que a
  camada escondida faz com o espaço" · "Achar os pesos: a culpa atravessa a camada" · "Um
  passo não é treinar: o planalto" · "O teorema não decide por você". O arco é **dá → dá de
  novo → tira → põe na mão → cobra o preço**.
- **A tese do capítulo ganhou casa.** "Existência não é treinabilidade" era plantada na
  linha 36 e sumia por mais de trezentas linhas, voltando espremida entre o laboratório do
  Playground e o exercício seguinte, sem cabeçalho. Agora abre a seção que fecha o arco.
- **A regra que passou a valer, e que o `III.1` já praticava sem estar escrita:** exercício
  **fecha** seção, nunca a abre nem a interrompe. Conferido por varredura: zero ocorrências
  de prosa depois de um exercício dentro da mesma seção.
- Escada de dificuldade do objetivo O1 corrigida — começava no segundo degrau (média,
  fácil, difícil).
- Os exercícios `e13`, `e14` e `e15`, criados dois ciclos atrás, eram os **únicos três do
  capítulo sem `volte para:`** — o ponteiro que o Guia Editorial chama de "o gesto mais útil
  do livro". Cada um passou a apontar para a seção que sustenta a resposta, não para a
  seção em que ele está.

### Registrado — o que a reforma NÃO pagou, e fica declarado
- **O objetivo O3 continua órfão.** Ele promete "implementar uma rede densa em NumPy, do
  forward ao update", e o capítulo tem **zero linhas de código** e nenhuma etapa no
  `ml-zero`. A tríade que aponta para ele conta parâmetros e discute *broadcasting*;
  ninguém implementa nada. Reorganizar por cima sem dizer isso esconderia o defeito em vez
  de pagá-lo.
- **Nenhuma passada de voz foi feita, e é deliberado.** Medidos os dois gates do ADR 0013:
  o `III.2` tem **zero** parágrafos sobre-negritados e **uma** frase com dois travessões; o
  `III.1`, que o autor considera legível, tem um e zero. A dificuldade não estava na frase.
  O Guia pede revisão *developmental* antes do copyedit, e misturar as duas no mesmo diff
  tornaria qualquer uma delas irrevisável.

### Corrigido — a animação do `III.2` mostrava a rede FALHANDO, ao lado do texto que promete sucesso
- O capítulo publicava `"semente":11` no laboratório do XOR. O texto ao lado diz *"assista
  até a contagem fechar, na época 142"*. Com a semente 11 ela **não fecha**: para na época
  250 com `perda 0.348 · 25 de 48 certos · empacou, e não vai sair daqui`.
- Pior que o desmentido: o botão **"E se a inicialização for infeliz?"** existe para
  contrastar com o caso bom — e o caso bom publicado já marcava **0,348**, o mesmo número
  do infeliz. O contraste que sustenta o exercício `e15` e as linhas sobre mínimo local
  simplesmente não existia na página.
- Com a semente correta: `época 142 · perda 0.047 · 48 de 48 certos · resolveu`.
- **Por que passou por meses de CI verde:** `publicar/testes/anima-mlp-xor.mjs` chamava
  `TIPOS["anima-mlp-xor"](area, {})` — config **vazia**, que cai no `semente: 6` embutido
  no código. O teste validava a semente 6; o livro publicava a 11. O teste estava verde e
  correto sobre uma animação **que o leitor nunca viu**.
- É a mesma lição que o ADR 0015 já tinha pago uma vez, em nova roupa: naquela vez a
  verificação reproduzia o caminho do robô e não o do leitor; nesta, reproduzia o *default*
  e não o *publicado*. **O teste passou a ler a configuração do Markdown do capítulo**, e
  foi visto reprovando o estado que estava no ar.

### Adicionado — a figura da camada escondida no `III.2`, gerada e verificada por código
- `publicar/figuras/camada-escondida.mjs` gera `publicar/tema/camada-escondida.svg`: dois
  planos empilhados, o das entradas e o da camada escondida, com cada ponto rotulado pela
  **entrada de onde veio**. O capítulo afirmava que a camada "reescreveu as entradas" — a
  coisa mais importante dele — numa frase no meio de um parágrafo.
- **O gerador se recusa a desenhar o que não confere.** Ele aplica os pesos que o capítulo
  publica e assere: que a rede reproduz o XOR nas quatro linhas, que as quatro entradas
  colapsam em três posições, e que a reta separadora não encosta em nenhum ponto. Visto
  falhando nos dois casos: reta em cima dos pontos, e pesos adulterados.
- **A primeira versão estava errada, e o erro ensina.** A reta ia em `h₁+h₂=1`, que passa
  exatamente por cima dos dois pontos brancos — uma fronteira que não separa nada. Ela era
  **o único elemento do arquivo desenhado à mão**; tudo o mais vinha de cálculo. Foi
  justamente o que escapou da regra que quebrou. Agora ela sai dos pesos da saída.
- A primeira versão também punha os dois painéis lado a lado, e usava `(a,b)` para
  coordenadas diferentes nos dois. Quem lesse da esquerda para a direita concluía que a
  camada "consertou" o `(1,1)` — **o oposto** do que acontece. E numa coluna de celular o
  rótulo de 12px renderizava a **3,9px**. Empilhada e rotulada por procedência, a escala vai
  a 0,73 e a leitura passa a ser vertical, que é a ordem do argumento.

### Adicionado — `turma.html`, o quadro do professor ([ADR 0021](adr/0021-o-quadro-da-turma.md))
- Página no próprio livro que consome `GET /turma/{turma}`: tabela ordenável por clique no
  cabeçalho, busca por aluno, filtro por capítulo e download de CSV montado no cliente
  (`;`, vírgula decimal e BOM — é o que o Excel em português abre certo).
- **A página vai ao ar com 2.896 bytes**: um título e uma `<div>` vazia. Uma página de
  capítulo tem oitenta mil. Nome, matrícula e nota não estão no arquivo; vêm por requisição
  autenticada.
- Fica **fora do sumário**, sem link a partir do livro e com `noindex`. Isso é higiene, não
  segurança: a URL é pública e adivinhável, e quem protege é o token conferido no servidor.
- Ela **não faz requisição nenhuma antes do clique** — além de ser o desenho certo, é
  requisito técnico: um 403 automático quebraria a auditoria de jornada.

### Adicionado — autenticação de verdade para o professor
- `ADMIN_USER` e `ADMIN_PASSWORD` no ambiente do servidor, e `POST /admin/login` devolvendo
  **token de sessão assinado com HMAC-SHA256, sem estado no servidor**, válido por 12 horas.
  Sem estado porque uma tabela de sessões em memória deslogaria o professor toda vez que a
  `main` recebesse um push — no meio da aula. Nenhuma dependência nova.
- **`Authorization: Bearer` e `sessionStorage`, não cookie.** Cookie exigiria
  `allow_credentials=True`, e o `ALLOWED_ORIGIN_REGEX` deste backend casa qualquer
  `machinelearning-*.vercel.app`, domínio que um terceiro pode registrar hoje. O ADR 0006
  escreveu que isso é seguro "porque não há sessão a roubar" — é uma **precondição**, e
  ligar credenciais a revogaria em silêncio.
- Uma porta só (`_exigir_admin`) no lugar de **três cópias divergentes** da mesma linha em
  `/turma`, `/telemetry` e `/suggestions`.
- Nove testes novos: senha errada e usuário errado dão a **mesma** resposta; a senha nunca
  volta no corpo; token adulterado não passa; sessão expirada não passa; força bruta esbarra
  no teto; e sem as variáveis no ambiente a rota responde 503.

### Corrigido — a nota sem recorte de capítulo invertia o ranking
- Defeito introduzido no ciclo anterior, por mim. O denominador era "o que o aluno tentou",
  então **quem tentou um exercício e acertou recebia 10,0** enquanto quem fez quatrocentos e
  acertou 350 recebia 8,1. Ordenar por essa coluna punha o aluno que menos fez no topo — e a
  coluna se chamava "nota".
- Agora, sem `?capitulo=N`, `nota` é nula e o número passa a se chamar
  `acerto_do_que_tentou`. O dado não se perdeu; ganhou um nome que diz o que mede. O painel
  mostra o aviso e não oferece a palavra "nota" nesse estado.

### Corrigido — turma e aluno eram comparados letra a letra, e isso criava alunos fantasma
- `AP2026` e `ap2026` eram **duas turmas**; `Maria Silva` e `maria silva`, **duas pessoas**.
  Medido: sete formas de digitar geravam **cinco identidades**. Na prática, o aluno que
  digitou em minúscula simplesmente não aparecia no relatório, e o professor não distinguia
  "não fez" de "digitou diferente".
- A comparação passou a ser canônica nos dois stores; o nome exibido continua sendo a forma
  que a pessoa escreveu.

### Adicionado — o export da turma passa a dar as cinco coisas que o professor pediu
- `GET /turma/{turma}` ganha **quando**, **quanto tempo**, **pontos** e **nota**, além do
  que já tinha. As cinco coisas do pedido — o que fez, quando fez, quanto tempo levou, a
  nota, e o código do aluno — saem agora numa linha só, em JSON ou CSV.
- **Nenhuma tabela nova, nenhuma migração.** O `created_at` de cada tentativa já era
  gravado desde sempre (`store.py`), e ninguém o expunha. O peso de cada exercício já
  existia no banco. Faltava juntar.
- **`?capitulo=N` resolve a dívida que o ADR 0014 registrou por escrito:** o total do livro
  cresce no meio do semestre (já foi de 91 a 430 itens), e nota sobre ele muda sozinha em
  outubro. Com o recorte, o denominador é o capítulo, que é estável e é o que se aplica em
  aula. Sem recorte, a nota sai sobre o que o aluno **tentou**, e a coluna diz isso.
- A coluna do relógio se chama **`minutos_entre_primeira_e_ultima`**, e o nome é a
  ressalva: não é tempo de trabalho. Quem responde a primeira questão, almoça e responde a
  última marca noventa minutos. Preferimos o nome feio ao número que mente.
- `aluno` e as datas saem **citadas** no CSV: matrícula com zero à esquerda o Excel abre
  como número e a chave deixa de casar com o diário.

### Alterado — o teste que guarda a privacidade do aluno ficou mais forte
- O `test_o_professor_nao_ve_resposta_nem_conversa` **falhou** ao acrescentarmos colunas,
  e falhou pelo motivo certo: ele fixa o cabeçalho do CSV de propósito, porque coluna nova
  no export é decisão de política, não detalhe de implementação. As duas asserções de
  sigilo passaram sem tocar — o texto da resposta continua fora.
- Além de atualizar o cabeçalho, o teste passou a cobrar que os **ids de exercício**
  usados internamente para somar pontos não vazem para a saída.
- Dois testes novos, e os três casos **vistos falhando** antes de merecerem confiança:
  nota anulada → falha; relógio removido → falha; denominador ignorando o recorte → falha.

### Adicionado — folha de impressão: Ctrl+P vira prova de papel ou PDF
- `publicar/tema/estilo.css`, bloco `@media print`. Some a barra lateral de 19rem, o
  rodapé, o cartucho do número do capítulo e o selo de data; o texto ocupa a folha
  inteira; título não fica órfão no pé da página; tabela, figura e citação não se partem.
- O `interativos.css` já escondia botão de responder, feedback e barra de progresso desde
  antes, e já impedia exercício de quebrar entre folhas. **Faltava o resto da página** —
  sem isso, imprimir levava junto a navegação e espremia o texto numa coluna estreita.
- Laboratório não imprime. Ele é interação; no papel viraria uma caixa vazia com título.
- Link externo passa a mostrar o endereço entre parênteses; link interno e âncora, não,
  senão vira ruído em toda linha.
- **Conferido em navegador**, não no CSS: com `emulateMedia({media:"print"})`, a barra
  lateral, o rodapé, os botões e os laboratórios saem, e os **12 exercícios** da prova do
  `III.1` continuam lá. PDFs gerados para as duas páginas.
- É o caminho de **custo zero** que o princípio VI pede: prova em papel sem servidor, sem
  exportador e sem dependência nova.

### Adicionado — [ADR 0020](adr/0020-avaliacao-com-nota-no-livro-aberto.md): avaliação com nota num livro aberto
- Comitê de três especialistas (avaliação, backend/privacidade, experiência do aluno) sobre
  o pedido de aplicar prova online com registro automático. Oito decisões, e duas delas
  divergem do pedido literal.
- **Um defeito verificado em produção bloqueava tudo:** duas requisições anônimas com
  respostas erradas fazem o backend devolver o gabarito (`TENTATIVAS_ATE_REVELAR = 2`), e o
  `session_id` é inventado pelo cliente, então o limite de taxa não protege. Não vaza nada
  que já não seja público — os gabaritos estão no Markdown, e o ADR 0019 aceitou isso — mas
  aceitou para instrumento **sem nota**.
- **O modo é da aplicação, não do item.** Desligar feedback nos itens de prova quebraria o
  princípio VIII.2 para quem pratica com eles.
- **A nota nunca vem do arquivo**; o servidor recalcula. Assinatura no caderno de ida foi
  recusada: exigiria distribuir uma chave para a turma, e chave distribuída não é chave.
- **"Quanto tempo levou" é registrado e rotulado pelo que não é.** Só se mede a diferença
  entre a primeira e a última submissão, pelo relógio do servidor. Duração calculada no
  cliente foi recusada, e telemetria de foco de aba também.
- **A entrega sobrevive ao botão de apagar a sessão** — hoje `tentativas` pende de
  `sessions` com `ON DELETE CASCADE`, e nota apagável pelo avaliado não é nota.
- **`GET /turma` não muda.** A promessa de não mostrar o texto das respostas fica de pé; a
  leitura entra escopada por avaliação, sob consentimento versionado.

### Adicionado — `Referências deste capítulo` e `Errata` no fim do `III.1`
- **Referências**: as treze fontes do capítulo reunidas num lugar só, cada uma com o
  selo que diz **até onde ela foi conferida** e uma linha dizendo o que ela sustenta.
  Antes o leitor tinha de garimpar links espalhados por dez seções para saber a origem
  de um fato.
- **Errata no fim, não no meio.** As correções que o capítulo já sofreu saíram da tabela
  de procedência, onde competiam com o texto, e viraram seção própria no fecho. Registro
  de manutenção não é conteúdo de aula — mas fica, porque livro que corrige em silêncio
  pede confiança em vez de merecê-la. Cinco entradas, cada uma com o que estava escrito
  e o que está agora.

### Corrigido — três linhas da linha do tempo do `III.1` pareciam não ter fonte
- As entradas de **1970 (Linnainmaa)**, **1974** e **1981 (Werbos)** traziam um travessão
  na coluna *Fonte*, que se lê como "isto não tem origem conhecida".
- **Elas sempre tiveram fonte.** É o levantamento de Schmidhuber (2014), que a tabela de
  procedência do próprio capítulo registra com ✓ e a nota "**lido**". A tabela escondia a
  origem que o capítulo já tinha conferido. A coluna passou a mostrá-la.
- Não era caso de apagar as linhas: apagar teria custado a prioridade de 1970, que é um
  dos pontos históricos do capítulo, para consertar um problema que era de apresentação.

### Corrigido — duas inconsistências de selo achadas ao montar as referências
- A citação de **McCulloch & Pitts** no corpo trazia **✓** (fonte aberta e lida) enquanto
  a tabela de procedência dizia **✓ᵐ** e explicitava que o artigo **não** foi lido por
  inteiro. Os dois não podem valer ao mesmo tempo; vale o ✓ᵐ.
- A **bibliografia** descrevia a tese de Werbos (1974) como "a primeira aplicação do
  método a redes neurais" — exatamente a afirmação que a errata do `III.1` já tinha
  corrigido para **1981**. O livro contradizia a própria correção, em outro arquivo.
  Alinhada, com o link para a errata.

### Corrigido — o `III.1` cortava todo o texto no celular, por culpa do laboratório novo
- Achado pelo autor **no celular**, não pelo build: os parágrafos apareciam cortados na
  margem direita, de cima a baixo, num capítulo que nem tinha chegado na tabela.
- A causa é minha e é de ontem. Ao escrever o laboratório `perceptron-tabela`, inventei
  as classes `lab-tabela-rolagem`, `lab-nota` e `lab-linha-erro` no JavaScript e **nunca
  escrevi o CSS delas**. Sem `overflow-x`, a tabela de doze colunas se esticava, alargava
  a caixa do laboratório e empurrava o documento para **592px num visor de 360**. Aí o
  navegador diagrama o capítulo inteiro nessa largura, e todo o texto sai da tela.
- O painel de controles ia junto para fora do visor, ou seja, o leitor de celular perdia
  exatamente a taxa de aprendizado e os pesos iniciais que o laboratório existe para ele
  mexer.
- Corrigido em `publicar/tema/interativos.css`. Medido antes e depois na mesma página:
  `scrollWidth` de **592 → 360**, igual ao visor, e zero elementos estourando fora de um
  contêiner rolável.
- **Uma correção foi desfeita por ser inútil.** Eu havia envolvido toda tabela num
  contêiner rolável no `build.mjs`. A auditoria mostrou que as 80 páginas passam sem
  isso, porque `estilo.css` já dava `overflow-x` às tabelas de Markdown desde antes.
  Maquinaria que não faz nada sai; ficou só a correção que resolve.

### Alterado — a fórmula do diagrama de McCulloch–Pitts virou condicional de dois ramos
- A legenda dizia `y = 1 se w₁x₁ + w₂x₂ ≥ θ · y = 0 caso contrário`, tudo numa linha e
  com os dois ramos ligados por um ponto — que se lê como **multiplicação**, exatamente o
  que a figura não quer dizer. Agora são duas linhas com chave, como a condicional que a
  fórmula é, e igual ao `\begin{cases}` que o texto do capítulo usa três parágrafos acima.
- O `viewBox` do SVG cresceu de 340 para 380 para caber, e o texto alternativo passou a
  descrever a condicional em vez da frase corrida.

### Adicionado — `publicar/jornada.mjs`, a auditoria da jornada do leitor
- **O primeiro verificador que abre a página.** Todos os outros leem a fonte: prosa,
  banco, links, intervalos, tema, HTML como texto. Dois defeitos passaram por essa porta
  em vinte e quatro horas, ambos com CI verde e ambos achados pelo autor no celular.
- Abre as 80 páginas num Chromium a 360px e cobra cinco coisas por página: a página **não
  rola de lado** (elemento pode passar da borda, desde que dentro de um contêiner que role
  sozinho); os `:::exercicio` do Markdown **chegam ao DOM** na mesma quantidade; todo
  laboratório **monta** canvas, svg, tabela ou botão; o companion está presente; e o
  console fica limpo.
- **Visto falhando nos dois defeitos reais**, e não em caso inventado. Com o `<style>`
  quebrado de volta: 19 problemas, entre eles laboratórios que não montam. Com o CSS da
  tabela removido: `rola de lado: 590px num visor de 360px — quem estoura: TABLE.lab-tabela`.
  Com a árvore restaurada: saída 0.
- **Encontrou um erro na primeira execução, e o erro era meu medidor.** Ele acusou
  `BANCO-DE-EXERCICIOS.md` de perder três exercícios; eram blocos de exemplo dentro de
  cerca de código, no documento que **ensina** a sintaxe. Passou a ignorar cercas, como os
  outros gates já faziam.
- O Playwright **não** entra como dependência do repositório: baixar um navegador custa uns
  150 MB e a constituição pede trilha de custo zero. O script falha com instrução de
  instalação em vez de se pular em silêncio, porque gate que se pula sozinho não é gate.

### Adicionado — a conta do treino, que o livro prometia e nunca mostrava
- O `III.1` explicava a regra de 1958 em prosa e em dois laboratórios, e **nunca fazia a
  conta**. O `III.2` derivava a retropropagação como regra da cadeia e **nenhum peso se
  mexia**. O aluno lia o método e não via um número. Os dois buracos estão pagos.
- **`III.1`, seção nova "A regra escrita, e de quem é a culpa"**: as quatro equações
  ($S$, o degrau, o erro, $\Delta w_i = \eta \cdot e \cdot x_i$) e a **tabela do OU
  preenchida à mão**, doze linhas, com as colunas que o professor pediu — `x₁ w₁ x₂ w₂
  soma θ esperado saída erro Δw₁ Δw₂`. Partida $(-0{,}2;\ 0{,}4)$, $\theta = 0{,}5$,
  $\eta = 0{,}5$: converge em **3 épocas**, pesos finais 0,8 e 0,9.
- O ponto pedagógico central é a **atribuição de culpa**: o $x_i$ na regra decide qual
  peso paga pelo erro. Entrada zerada, ajuste zerado, mesmo errando. A seção liga isso
  ao nome do problema (*credit assignment*) e ao `III.2`, onde ele reaparece atravessando
  uma camada escondida.
- **`III.2`, seção nova "A conta, com números"**: rede 2-2-1 com sigmoide, um passo
  inteiro aberto — passo para frente, $\delta_y = -0{,}2200$ calculado **uma vez**, os
  três gradientes da saída saindo dele, os deltas atravessando para a camada de baixo, e
  a tabela dos nove pesos antes e depois. Perda de 0,1982 para 0,1578.
- E a tabela que um passo não mostra: o XOR em lote cheio, com o **planalto**. Da época
  0 à 2 000 a perda fica em 0,25 e as quatro saídas em torno de 0,5; a quebra vem entre
  2 000 e 4 000, e na 8 000 a perda é 0,0017 com 4 de 4. **Quem desiste na época 1 000
  conclui que não funciona, com uma tabela verdadeira na mão.**

### Adicionado — laboratório `perceptron-tabela` e 6 exercícios novos
- `publicar/tema/laboratorios.js`: laboratório que mostra a **aritmética** em vez da
  fronteira. O leitor escolhe a taxa, os pesos iniciais e o limiar, ou aperta "Sortear
  pesos", e o placar responde **em quantas épocas convergiu**.
- Seis exercícios: três no `III.1` (O2) e três no `III.2` (O2 e O4). Livro em **430
  exercícios** e **29 laboratórios**.
- Números medidos, não afirmados. Varrendo a taxa na mesma partida: 0,05 → 14 épocas,
  0,1 → 7, 0,2 → 5, 0,3 → 4, 0,5 → 3, e de 1 para cima trava em 2. **Taxa maior não é
  taxa melhor**: com 3 a rede aprende o mesmo OU com pesos quatro vezes maiores.
- E variando só a partida com a taxa fixa: 1, 2, 3 ou 4 épocas. Daí o exercício difícil
  do `III.1` — "épocas até convergir" mede a distância entre a partida e alguma solução,
  não a dificuldade do problema. Comparar algoritmos por esse número sem fixar a partida
  é comparar o sorteio.
- `publicar/testes/lab-perceptron-tabela.mjs` roda o `laboratorios.js` real e afirma os
  números medidos, inclusive a regra da culpa nas duas direções: erro com $x_i = 0$
  **nunca** mexe em $w_i$, e erro com $x_i = 1$ **sempre** mexe.
- **Dois gates morderam durante a escrita**, e os dois estavam certos: gabarito decimal
  sem tolerância declarada (`-0.22` exigiria igualdade exata e puniria arredondamento), e
  palavra acentuada dentro de fórmula — `\text{saída}` sai como "saí da" porque as fontes
  TeX não têm o glifo. Virou $\delta_y$.

### Corrigido — o `III.1` e o `II.7` iam ao ar com um `<style>` aberto, e morriam no meio
- Para o navegador, tudo o que vem depois de um `<style>` sem fecho **é CSS**. As duas
  páginas respondiam 200 e tinham todos os bytes no lugar, mas o leitor via o capítulo
  morrer no meio: dos **doze** exercícios apareciam **três**, o link do Colab sumia, os
  laboratórios não montavam e o companion não carregava — e sem companion não há
  histórico do aluno.
- **A causa é um duplo passe de markdown.** O texto do exercício é renderizado uma vez
  para virar HTML de opção (`build.mjs:442`) e outra quando a página inteira passa pelo
  markdown (`build.mjs:444`). Fórmula dentro de opção de múltipla escolha nasce
  embrulhada num `<style>` do MathJax que contém **linhas em branco**; no segundo passe
  o markdown lê essas linhas como separador de parágrafo e parte o bloco em `<p>`, de
  modo que o `</style>` deixa de existir inteiro. O dedup que já existia rodava só
  depois, quando não casava mais. Agora ele roda no momento em que o embrulho nasce.
- **Foi o ciclo 009 que introduziu**: os quatro exercícios com matemática dentro da
  opção (`modelos-lineares-e9`, `regressao-logistica-e7`, `series-temporais-e11`,
  `neuronio-artificial-e10`) entraram nas rodadas que levaram cada capítulo a doze.
  Reverter tiraria exercícios bons e deixaria a causa de pé para a próxima fórmula em
  opção; a correção vai para a frente.
- Medido em navegador de verdade, antes e depois, na mesma página: **3 → 12 exercícios,
  3 → 4 laboratórios (os quatro montando), companion ausente → presente, 0 → 1 link do
  Colab.**

### Adicionado — gate `html-integro.mjs`: o primeiro que lê o produto, não a fonte
- Todos os gates até aqui liam a **fonte** — prosa, banco, links, intervalos, tema.
  Nenhum olhava o HTML **gerado**, e foi por essa porta que a página quebrada passou
  por CI verde e foi publicada.
- Cobra três invariantes por página: `<style>` e `<script>` fecham na conta em que
  abrem, e há exatamente um `</body>` e um `</html>`. Ligado ao `build.mjs`, rodando
  por último, com as páginas já escritas.
- **Visto falhar no defeito real**, não num caso inventado: com a correção de uma linha
  desfeita, ele acusa `ii-7-series-temporais.html` e `iii-1-neuronio-artificial.html`
  nominalmente e o build inteiro para (saída 1); com a correção de volta, saída 0.

### Corrigido — a chave do tema tinha dois nomes, e um deles não existia
- O `app.js` escreve `data-tema` com valores `claro`/`escuro`. Três blocos de CSS
  estavam escritos em `data-theme` com valores `dark`/`light` — vocabulário que
  **ninguém escreve no DOM**. Seletor que não casa com nada não dá erro, não
  aparece no build e não quebra teste: ele só não pinta.
- O que o leitor via: num sistema claro, acender o modo escuro do livro deixava a
  página escura com o **painel do chat branco** e os chips de nível na cor clara,
  ilegíveis. No sistema escuro, pedir o modo claro dava a página clara com o painel
  preto. A escolha explícita do leitor perdia para a preferência do sistema
  operacional, que é a hierarquia ao contrário.
- Arquivos: `publicar/tema/estilo.css` (chips de nível) e
  `publicar/tema/companion.css` (o painel inteiro).

### Adicionado — gate `tema-unico.mjs`
- `publicar/gates/tema-unico.mjs`, ligado ao `build.mjs`: cobra uma chave só
  (`data-tema`), recusa valor em inglês, e exige que toda
  `@media (prefers-color-scheme: dark)` esteja guardada por
  `:root:not([data-tema="claro"])` — sem a guarda, o sistema operacional passa por
  cima do leitor.
- **Visto falhando nos três casos** antes de merecer confiança, e visto *não* falhar
  no caso legítimo: seletor com `data-theme` → 1; `data-tema="dark"` → 1; media query
  sem guarda → 1; media query com guarda → 0; árvore limpa → 0. O build inteiro para
  com o defeito reintroduzido.
- O gate acusou os próprios comentários que explicam o bug. A correção foi ensiná-lo
  a ignorar comentário CSS, não afrouxá-lo: comentário não cria seletor, então um
  seletor morto não pode se esconder dentro de um. Isso o torna mais preciso, não
  mais permissivo.
- Fica **de fora** o `neuronio-mp.svg`, que tem o mesmo defeito por outra via: SVG
  carregado por `<img>` é documento isolado e não enxerga o `data-tema` da página de
  jeito nenhum. A correção depende de decidir o mecanismo das figuras, o que está em
  comitê.

### Alterado — passada de humanização em III.1 e III.2 (só prosa)
- 32 edições de forma nos dois capítulos, nenhuma linha de exercício, laboratório ou
  selo tocada: os três gates fecham com a **mesma** contagem de antes (424 exercícios,
  7 vídeos, 28 laboratórios, 49 páginas).
- Três achados que não eram de estilo e sim de conteúdo: um "diagrama acima" que
  apontava para um diagrama **abaixo**; um "daqui a três parágrafos" que na verdade
  eram cerca de vinte; e uma frase do III.1 cujo referente estava invertido — dizia que
  *saber* o que foi jogado fora é a origem do exagero, quando a origem é **perder de
  vista**. Uma sentença do III.2 repetia quase palavra por palavra o feedback do
  exercício `e7`, entregando a resposta antes da pergunta.
- **Onde a skill foi recusada, e por quê:** a regra que baniria travessões contraria o
  [ADR 0013](adr/0013-a-voz-do-livro.md), que já fixa o limite em duas ocorrências por
  frase — a regra do livro prevalece. O paralelismo negativo só valeu onde o "não Y"
  não é o distrator que o exercício testa. A regra de três foi recusada duas vezes em
  enumerações factuais, e a proscrição da voz passiva porque em português a partícula
  passiva é a forma neutra para descrever procedimento. Recusa registrada é recusa
  auditável; skill aplicada sem exame vira ruído.

### Adicionado — prova do capítulo III.1, para aplicar em sala (12 itens)
- `livro/provas/prova-iii-1.md`: **12 itens 100% determinísticos** (nenhum aberto),
  três por objetivo, progressão fácil → difícil, com **quatro itens de conta à mão**.
  Cada item explica por que o gabarito é o gabarito e por que cada distrator erra.
- **O ADR 0014 recusava prova de capítulo**, e a recusa era boa para o leitor sozinho.
  O [ADR 0019](adr/0019-prova-de-capitulo-para-aplicacao-em-sala.md) a emenda: o caso
  que não estava coberto é o do professor aplicando numa turma. Os três instrumentos
  passam a conviver com propósitos separados (`Verificação`, prova de parte, prova de
  capítulo).
- **Tensão registrada, não escondida:** o gate exige item cruzado em toda prova, e
  prova de capítulo é monocapítulo. Cada item liga o objetivo do III.1 a um de
  capítulo anterior — cumpre a letra, não o espírito. Se vier uma segunda, o gate
  ganha caso próprio em vez de continuar sendo dobrado.
- Exercícios do livro: **412 → 424**.

### Corrigido — doze anos, não treze (cap. III.1)
- O capítulo dizia **três vezes** que o neurônio artificial é "treze anos mais velho"
  que o termo "inteligência artificial". A tabela do próprio capítulo data o termo em
  **31/08/1955** e o neurônio em **1943**: são **doze**. O treze só fecharia com o
  workshop de 1956, que não é o que a tabela diz.
- Quinta ocorrência da classe neste ciclo — número escrito à mão ao lado dos dados que
  o determinam. Achado por quem estava **escrevendo a prova**, o que sugere que montar
  avaliação é, por si só, uma auditoria do capítulo.

### Adicionado — o Playground vendorizado no III.2, e dois laboratórios novos no III.1
- **TensorFlow Playground entra no III.2** ([ADR 0018](adr/0018-o-playground-entra-vendorizado.md)),
  **vendorizado** em `publicar/tema/playground/` e servido pelo nosso site — não por
  `iframe` para o domínio de terceiro. Comitê de três especialistas, decisão unânime:
  o domínio serve Google Analytics (princípio V) e um iframe remoto quebra quando o
  terceiro cai (princípio VIII.6). O upstream está parado desde junho de 2022, o que
  **inverte** a intuição: código congelado é dívida baixa para quem copia e
  dependência alta para quem aponta.
- **Três modificações declaradas** (Apache 2.0, cláusula 4(b)): `analytics.js`
  removido, fontes vendorizadas (Roboto + Material Icons — oito botões usam ligadura
  e virariam palavras literais sem elas), e `index.html` renomeado para
  `playground.html`, porque o gate de links compara por `basename()` e um segundo
  `index.html` passaria falsamente.
- **Gate novo:** `publicar/gates/sem-analytics.mjs` quebra o build se rastreador ou
  recurso externo voltar à pasta vendorizada. **Visto mordendo** — pegou primeiro um
  comentário meu que citava o domínio das fontes, e depois o `<script>` do analytics
  reintroduzido de propósito.
- **O laboratório entra com roteiro, e o roteiro é condição.** Oito manoplas soltas
  produzem confundimento: mexe-se em três coisas, algo melhora, e não se sabe qual
  causou. Cinco perguntas, uma manopla por pergunta, previsão escrita antes de mexer,
  mais a tabela de tradução dos rótulos.

### Adicionado — o neurônio que você treina, e o circuito de dois (cap. III.1)
- **`perceptron-treino`**: o leitor aplica a regra de 1958 um passo por vez, lendo no
  placar qual exemplo entrou, o que esperava, o que saiu e se corrigiu. Medido: AND
  fecha em 5 épocas; **XOR não fecha nunca** (2 erros de 4 depois de 60 épocas), e o
  placar diz isso em vez de deixar o leitor esperando.
- **E o botão das 4 entradas, que é o ponto:** o plano some, porque quatro entradas
  não cabem numa folha. O método não se importa — **converge em 10 épocas, zero erros
  de 16 casos**. Perdemos a figura, não o método, e confundir "não consigo desenhar"
  com "não consigo verificar" é um dos erros mais caros da área.
- **`circuito-neuronios`**: dois neurônios alimentando um terceiro, e o leitor escolhe
  as portas até montar o XOR. A solução é A = OU, B = NÃO-E, saída = E. O teste
  confere também que **nenhuma porta sozinha chega lá** (AND=1, OR=3, NAND=3, NOR=1 de
  4 linhas), que é a afirmação que o capítulo faz e nunca tinha demonstrado.
- Teste em `publicar/testes/labs-iii-1.mjs`, cobrindo as sete afirmações acima.

### Adicionado — as duas últimas animações, e a v0 do livro fecha (caps. I.6 e I.1)
- **I.6 — a escala de uma coluna** (`anima-escala`): a unidade de um atributo sobe
  até 100×, e do k-vizinhos sobram **0,81 dos 5 vizinhos**, com **31% dos rótulos
  previstos virando**. Padronizando antes, a resposta é **invariante**: 5,00 de 5
  e 0,0%. Não é uma melhora, é indiferença à unidade — e a ordem importa, porque
  padronizar antes de a unidade nova chegar não protege de nada.
- **I.1 — o horizonte do rótulo** (`anima-horizonte`): de 5 a 120 dias de silêncio,
  a AUC sobe de 0,66 a **0,76** enquanto a fração ainda acionável cai a **0,000**.
  O produto tem máximo no meio, em **23 dias**; trocando a renovação para o dia 30,
  o ótimo vai para **11**. O prazo da operação escolhe o horizonte, e a curva de
  AUC não sabe disso.
- **Com estas duas, as 22 animações do ciclo 009 estão feitas** (7 capítulos não
  animam, pelo critério do ADR 0015). Cinco delas corrigiram o texto que as
  hospeda ou a própria spec; quatro tiveram o desenho experimental refeito por
  medição. O placar completo está em `specs/009-livro-v0-completo/animacoes.md`.

### Adicionado — a animação da evolução, e a população que termina pior do que começou (cap. IV.3)
- **Vigésima animação** (`anima-evolucao`): 80 candidatas espalhadas por uma
  paisagem de dois picos, um largo e baixo (0,7) e um estreito e alto (1,0), ao
  longo de 120 gerações.
- **Sem guardar o melhor, a população termina PIOR do que começou:** 0,7349 na
  geração 0, 0,7000 no fim. Alguém já estava perto do pico alto desde o início, e
  a linhagem foi diluída. Não é estagnação, é perda.
- **Guardando um indivíduo intacto por geração, a mesma população chega a
  1,0000**, o ótimo global.
- **A diversidade colapsa igual nos dois** (0,0901 contra 0,0906), então não foi
  "manter diversidade" que resolveu. A receita folclórica de subir a mutação
  também não: varrida em 0,02 · 0,08 · 0,12 · 0,20 · 0,35, o pico alto se perde em
  todas. O mecanismo é o cruzamento por mistura, que joga o filho de uma candidata
  do pico alto no vale entre os dois. **A linhagem boa morre pela média.**
- Duas versões anteriores foram descartadas por medição: a população largada junto
  do pico largo (nenhum modo achava o pico alto, porque o vale é intransponível
  por mutação local) e a mutação como controle (não separa os modos).

### Adicionado — a animação do ensemble, e a conclusão fácil que a medição recusou (cap. II.5)
- **Décima nona animação** (`anima-ensemble`): 60 cortes gastos numa árvore só ou
  espalhados em tocos somados, com o mesmo dado, a mesma divisão e o mesmo
  orçamento.
- **O melhor ponto isolado é da árvore** (0,2969 contra 0,3041), não do boosting.
  Se você soubesse parar exatamente no corte 11, a árvore única venceria.
- **O que separa os dois é o custo de errar onde parar.** A árvore atinge o melhor
  no corte 11 e passa os 21 seguintes piorando, terminando **20% acima do próprio
  ótimo**. O boosting piora por 1 corte em 60, com a curva quase plana no fim.
- **A frase que o capítulo não dizia:** o boosting é padrão em dado tabular não por
  ser mais expressivo, e sim **por ser mais difícil de estragar**.
- Teste **visto falhando**: retirada a taxa de aprendizado, o boosting passou a
  piorar por 40 cortes e o melhor ponto migrou para ele por sobreajuste.

### Adicionado — a animação da memória, e o folclore dos "onze passos" corrigido (cap. III.5)
- **Décima oitava animação** (`anima-memoria`): retropropagação no tempo de
  verdade, δ ← (Wᵀδ) ⊙ tanh'(z), medindo quanto do sinal chega a cada posição
  anterior ao longo de 100 passos.
- **A spec pedia "o gradiente caindo a zero em 11 passos". Medido, com a
  inicialização padrão o sinal só cruza um milésimo na posição 95**, com razão de
  0,926 por passo. Os "dez e poucos passos" que circulam descrevem uma matriz
  recorrente encolhida ou saturada, não a recorrência em geral.
- **A lição virou a forma, não o número:** com os pesos 40% menores a razão cai a
  0,624 e o corte vai para a posição **14**. Quarenta por cento nos pesos movem o
  horizonte quase sete vezes, porque a queda é geométrica e a base é escolhida
  pelos pesos.
- **E a atenção não decai** (razão 1,006, sem cruzar o milésimo em 100 passos), não
  por ser maior ou mais treinada, mas porque o caminho da saída até qualquer
  posição tem comprimento 1, e comprimento 1 não tem produto onde encolher.
- Segunda vez neste ciclo que uma spec de animação repete um número de folclore (a
  primeira foi o "1e-7" do III.3, medido em 1,4e-12). **Número em spec é hipótese,
  não resultado.**

### Adicionado — a animação da exploração, e o agente guloso que decide certo o tempo todo (cap. IV.2)
- **Décima sétima animação** (`anima-exploracao`): grid 7×7 com duas saídas, +0,25
  a cinco passos e +1,5 a doze, Q-learning com um episódio por quadro.
- **Explorando, o agente chega ao prêmio grande em 529 de 600 episódios.** Com
  **ε = 0**, chega em **5**, e a recompensa média cai de 1,375 para 0,200. Mesmo
  algoritmo, mesma tabela inicial, mesmo fluxo de sorteios.
- **Ele não fica preso por burrice.** Achada a saída pequena, toda decisão que ele
  toma está certa pela informação que tem; a informação que o tiraria dali só
  apareceria numa ação que ele deixou de tomar.
- **A primeira versão não ensinava nada, e o defeito era do mundo.** Com a saída
  pequena colada na largada, ela virava um poço absorvente que pegava os dois
  modos: mesmo com ε = 1 o agente chegava ao prêmio grande em 1 de 300 episódios,
  e as duas recompensas médias empatavam. Explorar precisa ser possível para que
  não explorar seja um erro.
- **Rótulos do desenho passaram a derivar das constantes.** Diziam "+0,3" e "+1,0"
  depois que os valores já eram 0,25 e 1,5 — quarta ocorrência da classe neste
  ciclo.

### Adicionado — a animação da convolução, e a densa que fica cega com 3 pixels (cap. III.4)
- **Décima sexta animação** (`anima-convolucao`): o filtro varre as 144 posições
  com o mapa de ativação se pintando. Os dois modelos são **treinados dentro da
  animação**, por descida de gradiente, num conjunto em que a forma aparece sempre
  na mesma posição — que é a situação descrita no "problema" do capítulo.
- **Os dois resolvem o treino** (densa 1,000, convolucional 0,997). É o empate que
  dá sentido ao desempate: com a imagem andada **3 pixels**, a densa cai para
  **0,009** e a convolucional segue em **0,996**.
- **A densa tinha dez vezes mais pesos e ficou cega**, não pior: 257 contra 26,
  contados da geometria dos modelos. A seção de parâmetros do capítulo já mostrava
  a economia como memória (1 728 contra 9,6 milhões); a animação mostra o mesmo
  fato como **generalização**, que a conta de memória não revela.
- A spec pedia "densa 3,2 M × conv 2 400", números que não batem com os do próprio
  capítulo nem com modelo nenhum. As contagens agora saem da geometria do que a
  animação de fato roda.
- Teste **visto falhando**: variada a posição da forma no treino, a linha do "os
  dois resolvem o treino" acusou (densa em 0,624).

### Adicionado — a animação das equações normais, e duas fraudes de comparação desfeitas (cap. II.2)
- **Décima quinta animação** (`anima-normais`): 4 000 passos de gradiente
  perseguindo o ótimo que as equações normais entregam numa conta, com dois
  atributos quase colineares. O placar mostra o **excesso relativo de erro** sobre
  esse ótimo.
- **Com os atributos como vieram, 4 000 passos não bastam**: param a 2,8% do
  ótimo. Padronizados, chegam a 1% no passo **1 460** e terminam 351 vezes mais
  perto. O que mudou não foi o otimizador, foi o condicionamento.
- **Fraude 1, desfeita: passo de aprendizado comum.** Com passo fixo em 0,02 o
  regime bruto **divergiu** (soma dos quadrados a 8 × 10¹⁹⁶). Cada regime passou a
  receber o maior passo estável, 1/L por iteração de potência, e os dois valores
  ficam no placar (7,3 × 10⁻³ contra 2,5 × 10⁻¹). O teste confere que são
  diferentes, porque igualá-los seria voltar à fraude.
- **Fraude 2, desfeita: medir ‖w − w*‖.** Padronizar troca a parametrização (o
  intercepto ótimo vira a média de y), então comparar normas de vetores de peso
  compara réguas diferentes. A primeira versão fazia isso e dava o resultado
  **invertido**: o padronizado aparecia mais longe do ótimo que o bruto. A medida
  virou o excesso relativo de erro, que é invariante à troca.

### Adicionado — a animação do dado separável, e a perda que cai sem melhorar nada (cap. II.3)
- **Décima quarta animação** (`anima-separavel`): 400 passos de descida na
  entropia cruzada sobre dado linearmente separável, com a norma de w, a perda e
  a acurácia no placar.
- **A acurácia congela em 1,000 no passo 52 e a perda continua caindo** até o
  passo 400, de 0,23 para 0,078. O modelo não está melhorando: está ficando mais
  confiante sobre a mesma fronteira. A norma de w vai de 6,08 (passo 200) para
  7,91 (passo 400) e continuaria subindo.
- **Ela ensina uma não-existência**, que é raro numa animação: com dado
  separável, o máximo da verossimilhança não existe em ponto nenhum. É a
  demonstração operacional do O3, que em prosa é uma frase sobre sistema
  transcendental.
- **O botão da L2 é o argumento de por que regularizar não é ajuste fino:** a
  norma para em 3,31, a perda em 0,226, e a acurácia segue 1,000. A penalização
  não melhorou a classificação, **devolveu ao problema um ponto ótimo que ele não
  tinha**.
- A primeira versão respondia cedo demais (acurácia 1,000 já no passo 0, com
  margem larga). A margem foi estreitada para que existam 52 quadros de "está
  melhorando" antes dos 348 de "não está mais".

### Corrigido — não são onze vezes, são doze (cap. I.5)
- O exercício do eixo truncado dizia que, com o eixo começando em 88, a última
  barra fica "cerca de **onze vezes**" a altura da primeira. As alturas viram
  0,1 · 0,4 · 0,9 · 1,2, e 1,2 ÷ 0,1 = **12**, exatamente. Enunciado, rubrica e
  explicação corrigidos. Terceira ocorrência neste ciclo de número escrito à mão
  ao lado dos dados que o determinam.

### Adicionado — a animação do eixo truncado (cap. I.5)
- **Décima terceira animação** (`anima-eixo`): a base do eixo sobe de 0 a 88 sobre
  os quatro números do exercício, que não mudam em quadro nenhum. A razão vista
  chega a 12,00 enquanto a real fica em 1,0125: exagero de quase doze vezes, sem
  nenhum número falsificado. **Foi ela quem achou o erro acima.**
- Segundo botão: troca barra por linha na mesma base truncada, que é a regra que
  o capítulo enuncia (em barra o comprimento codifica; em linha, a inclinação).
- **Uma segunda série de dados foi projetada e descartada por medição.** A ideia
  era mostrar que o truque paga mais quando há menos diferença real, mas o
  resultado dependia de onde eu parasse a base: com a regra mais natural, a razão
  vista dá 11 nos dois casos, por identidade algébrica. Comparação que depende do
  ponto de parada não compara nada.

### Adicionado — a animação da deriva, e o PSI que não tem dianteira nenhuma (cap. V.3)
- **Décima segunda animação** (`anima-deriva`): 60 dias com o PSI da entrada e a
  AUC real do modelo na mesma linha do tempo.
- **A spec estava errada sobre o mecanismo.** Ela prometia o PSI cruzando 0,25
  *dias antes* de a AUC cair. Medido: os dois cruzam no **mesmo dia 32**. O PSI
  não é mais sensível, é apenas **observável mais cedo**. O adiantamento real vem
  da latência do rótulo: com 21 dias de espera, a queda do dia 32 só fica visível
  no dia 53, e a vantagem é exatamente esses 21 dias. Forçar uma dianteira era
  fácil e seria ensinar um mecanismo falso.
- **O segundo botão impede a animação de virar propaganda de PSI.** A mesma
  deriva de entrada, o mesmo PSI dia a dia, e a AUC desabando num modo (0,58) e
  imóvel no outro (0,85). O mesmo alarme acompanha um desastre e um não-evento.
- **Um defeito de ruído virando sinal foi corrigido antes de publicar.** Com 400
  casos por dia, a AUC de um dia contra a do dia 0 acusava queda de cinco pontos
  no **dia 9**, inclusive no modo que não dói, com adiantamento **negativo**.
  Amostra diária foi a 2 000, a referência virou a média dos cinco primeiros dias
  e a leitura virou média móvel de três.
- Teste **visto falhando**: com a deriva "que não dói" corroendo o sinal também,
  a linha do contraste acusou.

### Adicionado — a animação do custo, e o limiar que desce quando encarece errar (cap. II.8)
- **Décima primeira animação** (`anima-custo`): o custo do falso negativo sobe de
  1 a 10 e o limiar ótimo anda por causa disso. O modelo não muda em nenhum
  quadro; muda quanto dói cada tipo de erro.
- **O leitor erra a direção.** O limiar **desce**, de 0,46 para 0,115. A intuição
  diz "preciso ter mais certeza antes de agir"; o que encareceu foi **não agir**.
- **É resultado, não tendência.** Os escores são calibrados por construção, então
  o limiar ótimo tem forma fechada, 1/(1+custo), desenhada em tracejado por cima
  da curva medida. Desvio médio de 0,015 ao longo da varredura.
- **O número para a reunião:** manter 0,50 "porque é o padrão" custa **2 220 a
  mais por mil casos** quando o falso negativo vale 10.
- **O segundo botão é a contraprova.** Espremendo os escores para perto de 0,3, a
  ordem se mantém (a AUC não muda) e a calibração morre: o limiar ótimo quase
  para de responder ao custo, indo de 0,34 a 0,26 onde deveria ir de 0,50 a 0,11.
  A terceira pergunta do II.1 aparece como dinheiro perdido.
- **Uma asserção do teste nasceu arbitrária e foi corrigida.** Exigia desvio do
  espremido acima de 0,15 e reprovou com 0,104. O 0,15 era chute; a afirmação é
  "a fórmula deixa de ser um bom guia", que só existe em relação ao caso em que
  ela é um bom guia. Virou `dEsp > dCal * 4` (0,104 contra 0,015).
- Teste **visto falhando**: retirado o peso do falso negativo da conta, quatro das
  seis linhas acusaram, incluindo a da direção.

### Adicionado — a animação da origem móvel, e o erro que aparece MENOR (cap. II.7)
- **Décima animação** (`anima-origem-movel`): a mesma série, o mesmo modelo, os
  mesmos atributos, avaliados de dois jeitos. As oito dobras de origem móvel
  avançam em barras; a linha vermelha é o MAE da divisão embaralhada.
- **O que o leitor erra é o sinal, antes do tamanho.** O método errado produz um
  número **menor**: 0,76 contra 1,47. É isso que o torna perigoso, porque erro que
  aparece grande ninguém publica e erro que aparece pequeno vira slide.
- **Com quebra de regime, o embaralhado quase não a enxerga:** a origem móvel vai
  a 3,07 e ele passa de 0,76 para 0,82, porque as linhas de depois da quebra
  estão no treino dele.
- **O número foi medido, e a lição mudou de forma por causa disso.** A primeira
  medição, numa série quase plana, deu 1,1× — engano quase invisível. Em vez de
  mexer na simulação até o número ficar dramático, varri a tendência (0,035 →
  1,1× · 0,09 → 1,9× · 0,18 → 3,5×) e fixei 0,09 por realismo, deixando a
  varredura registrada. A lição resultante é melhor que a da spec: **o método
  errado parece inofensivo justamente quando o mundo está parado**, e passa a
  mentir quando o mundo se mexe, que é quando a previsão importa.
- Teste **visto falhando**: retirado o embaralhamento, o "embaralhado" passou a
  errar mais que a origem móvel (1,89 contra 1,47) e a linha do sinal acusou.

### Adicionado — a animação do gradiente, e a ReLU que não basta (cap. III.3)
- **Nona animação** (`anima-gradiente`): a retropropagação descendo 20 camadas de
  48 unidades, com a norma do gradiente de cada camada em escala logarítmica e a
  linha de 10⁻⁶ marcada. Pesos sorteados, passo para a frente e passo para trás
  calculados; a barra é a norma L2 de δ.
- **O segundo clique é a lição.** Que rede profunda mate o gradiente já se
  espera: com sigmoide e Xavier, a primeira camada recebe **1,4 × 10⁻¹²**. O que
  quase ninguém prevê é que a ReLU sozinha não resolva: com Xavier ela melhora
  nove ordens de grandeza e ainda perde um fator de mil (1,2 × 10⁻³), porque a
  dedução de Xavier supõe ativação linear. Só ReLU com He mantém as barras de pé
  (0,86 contra 1,09 na última camada).
- **A previsão da spec estava errada por cinco ordens de grandeza.** Ela dizia
  "1e-7 na primeira com sigmoide", estimado a partir do 0,25¹⁰ do corpo, que é o
  melhor caso da derivada da sigmoide. A rede real não opera no melhor caso.
  Corrigida a previsão, não a medição.
- **Os três modos são a mesma rede**, do mesmo sorteio. Entre Xavier e He os
  pesos são os mesmos vezes √2 por camada, e escalar por positivo não muda sinal:
  a máscara da ReLU é idêntica, e a razão entre as primeiras camadas é exatamente
  (√2)¹⁹ ≈ 724,08, medida em 723,9.
- **O teste nasceu com um furo, achado por vê-lo falhar.** A linha que eu escrevi
  para guardar a comparação controlada conferia a norma da última camada, que é
  ||δ|| na saída e vem de semente própria: passava nos dois mundos, e portanto não
  guardava nada. Trocada pela razão exata (√2)¹⁹, que com a semente quebrada por
  modo cai para ~275. **Ver o teste falhar também serve para descobrir quais
  asserções não pegam nada.**

### Adicionado — a animação do limiar, e a acurácia que sobe quando deveria cair (cap. II.1)
- **Oitava animação** (`anima-limiar`): o limiar desce de 0,98 a 0,00 e a matriz
  de confusão, a acurácia, a precisão e a revocação mudam junto, com o ponto
  andando sobre a ROC.
- **O controle que o leitor erra ao prever é a prevalência.** Com 1% de
  positivos, a acurácia **sobe** a 0,992 no limiar alto, com revocação de 0,168:
  o modelo deixa escapar 83% dos positivos e acerta quase tudo, porque quase tudo
  é negativo. Dizer "não" a todo mundo já daria 0,990. É o O1 do capítulo em três
  números na tela, e o texto do laboratório pede a previsão **antes** do clique.
- **E o que não se mexe é a outra metade da lição.** A AUC-ROC fica em 0,968 nas
  duas prevalências, dígito por dígito, enquanto a AUC-PR cai de 0,925 para
  0,578. É o O4 do capítulo, na mesma tela, sem uma segunda figura.
- **A prevalência entra como peso, não por reamostragem.** Os escores vêm de dois
  poços fixos e π só decide quanto cada um pesa na contagem, o que torna TPR e
  FPR **exatamente** invariantes. Uma animação que ensina "este número não muda"
  não pode exibir o número tremendo no terceiro dígito por ruído amostral.
- Teste em `publicar/testes/anima-limiar.mjs`, **visto falhando**: quebrada a
  invariância, ele acusou 0,968 contra 0,874 na linha certa.

### Corrigido — a conta das animações estava errada por um
- `animacoes.md` dizia "23 animações, 6 capítulos sem". As linhas com "não
  animar" são **sete**, e 29 − 7 = 22. O erro tinha sido copiado para o ledger
  como "7 feitas, 16 pendentes". Mesma classe de defeito que o gate de intervalos
  passou a cobrar no corpo do livro: número escrito à mão ao lado da lista que o
  determina.

### Alterado — o memorando de 1966 foi lido, e desmente o capítulo que o cita (cap. V.4)
- **O PDF que "não abria" abriu**, e a razão antes registrada estava errada: não era
  erro do repositório, é **digitalização sem camada de texto**. As páginas foram
  extraídas como imagem e lidas assim, que é o mesmo diagnóstico já registrado no
  III.4 para os artigos de Hubel & Wiesel.
- **O papel diz "Vision Memo. No. 100.", não "AI Memo 100".** O arquivo do MIT o
  cataloga como AIM-100, e daí o nome pelo qual circula. Num capítulo cuja tese é
  que o rótulo apodrece antes do conteúdo, o rótulo tinha apodrecido.
- **A lenda erra em três pontos, e agora com citação para cada um.** Não era um
  aluno: o texto fala em *"our summer workers"*, no plural, e registra Sussman
  coordenando reuniões abertas a *"anyone who wishes to participate"*. E o escopo é
  escalonado: figura-fundo, depois região, depois objeto, com o subobjetivo de julho
  limitado a cenas *"consisting of non-overlapping objects"*.
- **A correção corre para os dois lados.** O capítulo dizia "ambição exagerada"; o
  memorando declara querer *"a real landmark in the development of 'pattern
  recognition'"*. A lenda achata o escopo para baixo e o livro estava achatando para
  cima.
- **Numeração antiga dentro da tabela de selos:** a linha 📖 remetia aos "caps. IV.1,
  13 e 23". São IV.1, IV.2 e II.6. Segunda ocorrência da classe neste ciclo, depois
  do "II.2 e 18" do IV.1; o livro foi varrido e não há uma terceira.

### Corrigido — train/serve skew tinha três causas e o livro contava uma (cap. V.2)
- **A definição estava estreitada.** A fonte diz *"training-serving skew is a
  difference between performance during training and performance during serving"*
  e lista três causas: divergência entre os dois encanamentos, mudança no dado
  entre treinar e servir, e realimentação entre modelo e algoritmo. O capítulo
  tratava só da primeira sem dizer que era uma de três. Agora nomeia as três e
  aponta onde o livro trata as outras duas.
- **A faixa "regras #29 a #37" sobe de ⏳ para ✓**, e pelo caminho mais simples:
  o documento tem uma seção intitulada *"Training-Serving Skew"* que começa depois
  da regra #28 e termina na #37, onde entra a "ML Phase III".
- **Tentativa registrada:** a página do Michelangelo, que sustenta a data de
  setembro de 2017 para o termo *feature store*, passou a responder 406. A data
  segue ⏳, agora com a tentativa datada.

### Alterado — duas fontes fechadas se abriram, e uma delas confirmou um vão (cap. V.3)
- **Schlimmer & Granger (1986) saiu de ⏳ para ✓.** Os anais do AAAI-86 são
  abertos: *"Beyond incremental processing: Tracking concept drift"*, pp. 502–507,
  UC Irvine. O resumo define o termo entre parênteses, como quem apresenta
  vocabulário novo (*"drift (concepts that change over time)"*), e enuncia o
  problema que ainda é o de hoje: quando o preditor erra, decidir *"whether this
  situation is an instance of noise or an indication that the concept is beginning
  to drift"*. Ambos entraram no corpo.
- **O cunho do termo continua ⏳, de propósito.** A lista de referências do artigo
  não traz fonte anterior para "concept drift", e ausência de contra-exemplo em um
  lugar só não é prova de primazia.
- **O *ML Test Score* foi lido** (o PDF está no arquivo público de publicações do
  Google) e confirma os 28 testes em quatro grupos de sete. Dele entraram os testes
  "Data 1" e "Monitor 2".
- **E lê-lo NÃO fechou o ❌ vizinho.** Falta fonte que prescreva o que fazer quando
  *uma requisição* viola o contrato; o Monitor 2 manda *"alert when they diverge
  significantly"*, com limiar entre falso positivo e falso negativo, que é política
  de agregado. Abrir a fonte que faltava confirmou o vão em vez de fechá-lo.

### Corrigido — a regra do ciclo aplicada contra o próprio capítulo (cap. V.1)
- **Os quatro percentuais da ProPublica sobem de ✓ᵐ para ✓.** Estavam marcados com
  a razão escrita: números "devolvidos por extrator automático". Como a regra deste
  ciclo é que resumo de máquina não confere fonte, a página foi baixada e o texto
  extraído localmente. Os quatro batem, inclusive a direção de cada comparação.
  Entraram junto o título da tabela (*"Prediction Fails Differently for Black
  Defendants"*) e o acerto global do instrumento: *"correctly predicts recidivism
  61 percent of the time"*.
- **"Cinco meses depois da reportagem, Kleinberg…": são quatro.** De 23/05 a 19/09
  são quatro meses; o "cinco" é o vão completo até 24/10, que aparece certo duas
  linhas adiante. Mesma mecânica do IV.3: um número certo do parágrafo vizinho
  migra para onde está errado.
- **O ❌ da réplica da Northpointe continua ❌, agora com as tentativas escritas:**
  404 no domínio da fornecedora, 403 atrás de Cloudflare no espelho público, na
  página e na API.

### Adicionado — gate dos intervalos: a subtração passa a ser da máquina
- `publicar/intervalos.mjs` guarda os **dois anos** de cada intervalo que o livro
  cita entre capítulos e calcula a diferença. Qualquer menção em prosa que
  discorde da subtração quebra o build. Roda dentro de `build.mjs` e sozinho.
- **Por que existe:** o "cerca de 80 anos" errado do IV.2 estava copiado em mais
  três capítulos (III.4, III.6, IV.3), porque cada um compara o seu intervalo com
  o dos outros. Um erro, quatro páginas, nenhuma delas errada por conta própria.
- **Visto falhando** antes de entrar: com o "~80" reintroduzido no III.4 e no
  III.6, o build saiu com código 1 nas duas vezes; verde depois de corrigido.
- A primeira versão do regex dava falso positivo, lendo "970 no [II.7]" dentro de
  "1927→1970 no [II.7]". Um ano citado não é um intervalo citado; o *lookbehind*
  que separa os dois está comentado no arquivo.

### Corrigido — o Turing de Pearl e a resenha que a anedota escondia (cap. IV.3)
- **"Pearl recebeu o Turing 22 anos depois" de 1985: são 26.** O 22 é o intervalo
  Zadeh→Sendai, duas linhas abaixo no mesmo box, e vazou para a linha de cima.
- **Os três capítulos que citavam "cerca de 80" para o IV.2** (III.4, III.6, IV.3)
  passam a citar 91.
- **O *Journal of Symbolic Logic* resenhou o artigo do Logic Theory Machine** em
  setembro de 1957, por Andrzej Ehrenfeucht (vol. 22 nº 3, pp. 331–332). Não
  desmente a anedota da recusa, que é sobre uma submissão, mas desmente a leitura
  fácil dela: "a revista rejeitou" e "a revista ignorou" não são a mesma
  afirmação. Entrou no corpo com a distinção explícita.
- **Tentativas registradas onde a fonte não abriu:** o artigo de Zadeh (403 no
  editor, 404 no espelho, sem depósito no repositório aberto) e o do Logic Theory
  Machine seguem em ✓ᵐ/⏳ com as fichas conferidas e o motivo escrito. A abertura
  do metrô de Sendai ganhou data e autoria, com a ressalva de que a consistência
  entre fontes terciárias não é confirmação: elas se copiam.

### Corrigido — 91 anos, não 80: o maior intervalo do livro estava mal contado (cap. IV.2)
- **De Thorndike (1898) a Watkins (1989) são 91 anos**, e o capítulo dizia "cerca de
  80" na mesma frase em que apresenta os dois anos. A conclusão sobrevive: 91 segue
  sendo o maior intervalo registrado no livro, contra 59 (I.6), 43 (II.7) e 7 (II.5).
- **O Thorndike de 1898 entrou no corpo em primeira mão.** O fac-símile de *Animal
  Intelligence* (1911), que reimprime o monográfico, dá o mecanismo nas palavras dele
  (*"stamped in" / "stamped out"*) e, o que faltava, dá a **evidência**: se o gato
  raciocinasse, haveria *"a sudden vertical descent in the time-curve"*; a inclinação
  gradual é o argumento. A lei do efeito está na p. 244, sob o título "Provisional
  Laws of Acquired Behavior or Learning".
- **Duas ⏳ novas, de propósito.** A monografia de 1898 é chamada de tese de doutorado
  em todo lugar e o volume de 1911 não diz isso: o corpo parou de chamá-la de tese.
  A data de comunicação do artigo de Bellman no *PNAS* (05/06/1952) não pôde ser
  conferida no fac-símile, e ficou ⏳ com a nota de que **o argumento não depende
  dela** — o fascículo de agosto de 1952 já é anterior à posse de Wilson.
- **Selos que subiram:** a apuração de Dreyfus foi conferida contra o texto (p. 159,
  *Operations Research* 50(1), pp. 48–51), as datas dos Secretários de Defesa passam
  a vir da ficha do Historical Office do Departamento de Defesa, e o TD-Gammon de
  Tesauro, que estava só no corpo, ganhou ficha com DOI.

### Corrigido — "cerveja e fraldas": os números batiam, a cadeia de evidência não (cap. IV.1)
- **O livro dizia que Power entrevistou o autor do estudo. Ele não entrevistou
  ninguém.** Power não pôde assistir ao evento ao vivo, viu a gravação de um
  webcast da Teradata de 31/07/2002 e recebeu a transcrição por e-mail da
  moderadora, da própria Teradata. Num capítulo que separa correlação achada,
  decisão tomada e efeito medido, o texto fortalecia em uma palavra a origem da
  própria evidência.
- **"Junho de 1992" era precisão inventada.** A apuração diz só "in 1992".
- **Entrou a divergência que a fonte registra e o livro omitia.** Power abre a
  última seção com *"Does everyone agree with the above account? YES and NO!"*:
  Fawcett sustenta que o exemplo nunca foi sustentado por dado nenhum, e Kohavi
  chega à pessoa que rodou as consultas, com números que não batem com os de
  Blischok (50 lojas em um dia, 1990, contra 1,2 milhão de cestas de cerca de 25
  lojas). Ela não achava o padrão significativo.
- **Os números do relato se confirmaram** e agora aparecem entre aspas, na fala
  de Blischok. O selo da apuração de Power sobe de ✓ᵐ para ✓ (lida por inteiro),
  e os fatos em si ficam em ⏳, porque só os temos pelo relato dos envolvidos.
- **Marcador `❌` fora de lugar removido:** o corpo marcava com `❌` uma negativa
  apurada, e a tabela de selos logo abaixo explicava por que `❌` é o selo errado
  nesse caso.

### Alterado — Sokal & Sneath deixam de ser atribuição sem fonte (cap. IV.1)
- O programa da taxonomia numérica estava afirmado sem que nada dos autores
  tivesse sido aberto. O livro de 1963 segue fechado, mas o *Citation Classic*
  que **Sokal escreveu sobre o próprio livro** (1982) está lido e entrega o
  programa em primeira mão ("unaffected by subjective or phylogenetic
  judgments"), a origem da aposta de 1953 em Kansas, e a frase que fecha a tríade
  de precedência desta seção: *"in fact, we coined the name 'numerical
  taxonomy'."*
- O ⏳ de "antes se classificava por julgamento do especialista" sobe a ✓, **com a
  ressalva escrita** de que é a caracterização de quem atacava a prática.
- Erro dentro da própria tabela de selos: a referência cruzada dizia "capítulos
  II.2 e 18", numeração que o livro não usa mais. Corrigida para III.1.

### Corrigido — a tolerância dos exercícios numéricos, que sumia em silêncio
- **O parser trocava só a PRIMEIRA vírgula por ponto.** O livro é em português,
  e o gabarito natural é `0,45 ± 0,01`; com a troca não global, o valor saía
  certo e a tolerância virava **0**. Três exercícios já publicados declaravam
  tolerância e corrigiam por igualdade exata: `reforco-e1`, `reforco-e6` e
  `interpretabilidade-justica-e2`. Achado ao escrever a prova da Parte V, e o
  teste `publicar/testes/numerico.mjs` foi **visto falhando** antes do conserto.
- **Gate novo:** gabarito numérico decimal sem `±` passa a quebrar o build.
  Sem tolerância, a correção exige igualdade exata e reprova quem arredondou de
  outro jeito. Dois exercícios estavam nesse estado e ganharam tolerância:
  `do-modelo-a-decisao-e2` e `ia-simbolica-fuzzy-evolutiva-e2`. Inteiro segue
  dispensado, e `± 0` continua valendo quando for escolha escrita.

### Alterado — um ⏳ que era ✓, e a Parte III fecha (cap. III.6)
- **A filiação do objetivo de máscara à tarefa Cloze está declarada pelos autores
  do BERT**, em duas passagens: o objetivo é *"inspired by the Cloze task (Taylor,
  1953)"*, e o procedimento *"is often referred to as a Cloze task in the
  literature"*. Estava marcado como atribuição corrente.
- **Entrou um número concreto** que o capítulo não tinha: são **15% dos tokens**
  mascarados por sequência, sorteados ao acaso.
- **A ficha de Taylor foi conferida:** Wilson L. Taylor, *"'Cloze Procedure': A New
  Tool for Measuring Readability"*, *Journalism Quarterly* 30(4):415–433, 1953, com
  DOI. O intervalo de 65 anos entre a régua de redação e a função de perda agora
  tem as duas pontas datadas por fonte.
- **A Parte III fecha inteira na coluna de fontes**, de III.1 a III.6.

### Corrigido — o capítulo promovia o que a fonte subordina (cap. III.5)
- **A inversão da ordem das palavras não é a contribuição principal do seq2seq**,
  como o capítulo dizia. O resumo estabelece a hierarquia: *"Our main result is
  that… the translations produced by the LSTM achieve a BLEU score of 34.8"*, e a
  inversão entra depois, com *"Finally, we found that…"*.
- **Os dois trechos entraram no capítulo entre aspas**, com a hierarquia preservada:
  o resultado que os autores destacam, e depois o achado adicional que interessa a
  este livro — inclusive a explicação deles, de que a inversão *"introduced many
  short term dependencies… which made the optimization problem easier"*, que é o
  diagnóstico do capítulo anterior aplicado à dimensão tempo.
- Nada estava factualmente errado sobre a inversão; o que estava errado era **o
  peso** dado a ela.

### Corrigido — o motivo pelo qual uma fonte não foi lida (cap. III.4)
- **O artigo de LeCun de 1989 não está atrás de paywall**, como o capítulo dizia. O
  PDF é público na página do autor; o problema é que ele **não tem camada de
  texto** — é imagem digitalizada. Os números internos continuam ⏳, e a razão
  registrada passou a ser a verdadeira: não falta acesso, falta reconhecimento
  óptico. Quem retomar precisa saber qual das duas coisas tentar.
- **Entrou a ficha exata do artigo de 1962 de Hubel & Wiesel** (*J. Physiol.*
  160(1):106–154), nomeando o candidato para a distinção entre células simples e
  complexas. Em qual dos dois artigos ela aparece segue ⏳: os dois estão no
  repositório como **imagem de página**, sem texto buscável.
- **O neocognitron passou a ✓ᵐ quanto a auto-organizar-se**, e a evidência é o
  próprio título: *"Neocognitron: A self-organizing neural network model…"*.

### Corrigido — a anedota mais repetida do dropout não está no artigo (cap. III.3)
- **A história do caixa de banco que roda de guichê não aparece no texto do JMLR.**
  Procurei "bank", "teller", "fraud" e "conspir" no artigo inteiro: as únicas
  ocorrências de "bank" são *"log-filter bank frames"*, sobre áudio.
- **As duas motivações que os autores escreveram entraram no lugar**, e são
  melhores: a teoria sobre o papel do sexo na evolução, e a das conspirações —
  *"Ten conspiracies each involving five people is probably a better way to create
  havoc than one big conspiracy that requires fifty people to all play their parts
  correctly."* Uma conspiração grande funciona se as condições não mudarem e houver
  tempo de ensaio, que é a descrição de um conjunto de treino.
- **"Adam" passou a ✓**: o próprio artigo diz *"the name Adam is derived from
  adaptive moment estimation"*.

### Corrigido — uma verdade que enganava, sobre o nome do teorema (cap. III.2)
- **A frase era literalmente correta e produzia conclusão errada.** O capítulo dizia
  que a expressão "aproximação universal" não consta do título de nenhum dos dois
  artigos citados (Cybenko 1989, Hornik 1991). É verdade sobre esses dois — e
  *"universal approximators"* está no título de um **terceiro**, de 1989, do mesmo
  Hornik com Stinchcombe e White, que o capítulo não citava.
- **O artigo que faltava entrou** com ficha e DOI, e o argumento foi reformulado
  para o que se sustenta: o rótulo posterior não é a palavra "universal", é a
  promoção a **teorema com nome próprio**, usado sem as hipóteses que os artigos
  enunciam.
- A leitura sobre a estrutura em camadas continua ⏳, e o capítulo registra que a
  frase que costuma ser citada para ela **não foi conferida** — por isso não
  aparece entre aspas.

### Corrigido — uma frase atribuída a quem não a disse (caps. III.1 e II.2)
- **"Não é o primeiro inventor que leva o crédito, é o último reinventor"** estava
  atribuída a Schmidhuber, em **dois capítulos**, um deles como citação em itálico.
  Não a localizei no levantamento histórico dele. O que ele declara é o propósito
  do trabalho: *"One of its goals is to assign credit to those who contributed to
  the present state of the art."* A formulação é **deste livro**, e os dois
  capítulos passaram a dizer isso.
- **Correção de data na linha do backpropagation:** a aplicação a redes neurais é
  de **1981**, não de 1974. A fonte separa as duas coisas — 1974 traz discussão
  preliminar, e a primeira aplicação vem sete anos depois. A tabela ganhou a linha
  que faltava, e a síntese foi corrigida junto.
- A cronologia (1970 em tese de mestrado, *"albeit without reference to NNs"*)
  passou a ✓, citada do levantamento lido.

### Adicionado — o caso da blindagem sem o verniz, e a Parte II fecha (cap. II.8)
- **A frase de efeito não está no documento.** O caso é contado em toda parte com
  "reforce onde os aviões que voltaram não têm furos". Os **oito memorandos** de
  Wald, de 1943, para o Statistical Research Group sob o NDRC, foram lidos no
  reimpresso de 1980: a palavra "armor" aparece **uma única vez**, e o que Wald
  escreve é que as conclusões *"can be used as guides for locating protective
  armor"*. O trabalho é uma tabela de vulnerabilidade, não um aforismo.
- A lição continua válida, e o capítulo passou a separar o que o documento diz do
  que a recontagem acrescentou — com selo ✓ para o primeiro e 📖 para o segundo.
- **A Parte II fecha inteira na coluna de fontes**, de II.1 a II.8, somada à
  Abertura e à Parte I.

### Corrigido — o título do artigo de Yule, que as citações vinham "consertando" (cap. II.7)
- **O impresso não tem o "in".** O registro do periódico traz *"VII. On a method of
  investigating periodicities disturbed series, with special reference to Wolfer's
  sunspot numbers"*. A forma corrente das citações, que este capítulo usava,
  acrescenta *"in"* entre "periodicities" e "disturbed". É o mesmo mecanismo da
  frase de Playfair no I.5 — variação que melhora a leitura e por isso ninguém
  corrige de volta —, agora no título em vez de no corpo.
- A ficha ganhou DOI, número de fascículo e autor por extenso.
- **O texto do artigo não abriu:** periódico e espelho recusaram a transferência.
  A metáfora do pêndulo levando pancadas continua ⏳, com a tentativa registrada.

### Adicionado — evidência de época para o episódio do OLAP, sem tocar na acusação (cap. II.6)
- **Nada a corrigir:** o capítulo já dizia "a versão corrente é que" em vez de
  "aconteceu que", declarava o selo ⏳ no próprio corpo e explicava ao leitor por
  quê. A acusação envolve pessoas reais e **continua não conferida**; a busca de
  agosto de 2026 não localizou o material de época.
- **Entrou uma evidência parcial que dá para verificar.** O estatuto de maio de 1995
  do grupo `comp.databases.olap` define o escopo pelo relatório de Codd, é assinado
  por um funcionário da Arbor Software da área de alianças estratégicas, e termina
  com *"This posting is not officially sponsored by Arbor Software"*.
- **Com o limite escrito:** a linha de selo diz explicitamente que esse documento
  **não** sustenta a acusação sobre o relatório de 1993 — sustenta apenas a
  centralidade da empresa na institucionalização do termo.

### Corrigido — o manuscrito do *hypothesis boosting* é de Kearns sozinho (cap. II.5)
- **O erro estava na tabela de procedência, não no corpo.** A linha atribuía o
  manuscrito a "Kearns & Valiant". A ficha, lida na bibliografia de quem respondeu
  à pergunta, é **Kearns, M. (1988), *"Thoughts on hypothesis boosting"*,
  *Unpublished manuscript***. A dupla assina a introdução da aprendizagem fraca e a
  pergunta em aberto, que são outra coisa.
- **Entrou no corpo um fato que faltava e que é do feitio do livro:** o termo que
  hoje nomeia uma família inteira de algoritmos nasceu num manuscrito **não
  publicado**. A pergunta *"was termed the hypothesis boosting problem"*, e a
  referência dada para o batismo é esse texto que nunca saiu em periódico.
- A pergunta em aberto passou a ser citada nas palavras de quem a respondeu:
  Kearns e Valiant *"left open the question of whether the notions of strong and
  weak learnability are equivalent"*.

### Alterado — a herança do LASSO confirmada, e a data distinguida (cap. II.4)
- **A herança agora está nas palavras do autor**, lidas no artigo do LASSO: *"The
  motivation for the lasso came from an interesting proposal of Breiman (1993)"*, e
  a descrição do garrote que *"starts with the OLS estimates and shrinks them by
  non-negative factors whose sum is constrained"*.
- **A data que o capítulo dava era de outra coisa.** O capítulo citava "Breiman
  (1995)"; o LASSO cita o **relatório técnico de 1993**, de Berkeley, e a versão em
  periódico só sai em 1995 na *Technometrics*. As duas datas estão certas para
  coisas diferentes, e o capítulo passou a dizer qual é qual — com o intervalo de
  dois anos entre a ideia circular e ter endereço citável ligado ao caso do cap. II.2.
- Breiman (1995) e Hoerl & Kennard (1970) ganharam DOI. As origens de "ridge" nas
  superfícies de resposta e a cronologia de Tikhonov continuam ⏳.

### Adicionado — a briga do logito contra o probito, com o que faltava (cap. II.3)
- **A polêmica tinha uma segunda camada que o capítulo não contava.** A disputa
  logito × probito veio embrulhada nos ataques simultâneos de Berkson à máxima
  verossimilhança, com trocas ácidas entre ele e R. A. Fisher. O capítulo dizia
  apenas que o nome "carrega a polêmica".
- **O probito também tem paternidade disputada:** creditado a Gaddum (1933) e Bliss
  (1934), com a fonte advertindo que isso *"is too simple"* e raízes que recuam até
  Fechner. É mais um caso do padrão que o livro persegue, agora dentro do capítulo
  que usava o probito só como "método concorrente".
- **Berkson foi ridicularizado no início**, o que o capítulo não registrava:
  cunhou *logit* *"by analogy to the 'probit' of Bliss (for which he was initially
  much derided)"*.
- **A motivação foi separada em duas:** a vantagem de **cálculo** ficou ✓ (*"in the
  practical aspect of ease of computation the logit had a clear advantage"*); a de
  **interpretabilidade clínica** continua ⏳, porque não a achei na fonte lida.

### Corrigido — excesso de certeza sobre Gauss × Legendre (caps. II.2 e III.1)
- **O livro afirmava mais do que a fonte.** Dizia que "a avaliação histórica moderna
  é que Gauss tinha o método antes". O estudo de referência da disputa diz: *"It is
  argued (though not conclusively) that Gauss probably possessed the method well
  before Legendre, but that he was unsuccessful in communicating it"* — e acrescenta
  que dados do arco meridiano francês poderiam um dia permitir verificação
  definitiva. O caso segue **aberto**, e o capítulo passa a dizer isso.
- **A correção vazava para outro capítulo.** Três passagens do III.1 tratavam a
  descoberta anterior como fato, uma delas dentro do gabarito de um exercício.
  Foram alinhadas no mesmo commit.
- Stigler ganhou selo ✓ᵃ com volume, páginas e DOI. As notas de Olbers e Bessel e o
  ataque de Legendre em 1820 continuam ⏳: o resumo fala em *"new evidence, both
  documentary and statistical"* **sem nomear qual**, e ✓ᵃ não autoriza afirmar o que
  está no corpo do artigo.

### Alterado — a linhagem da curva ROC ganha ficha, e o que não abriu fica dito (cap. II.1)
- **"Peterson *et al.*, 1954" virou a citação inteira:** Peterson, Birdsall & Fox,
  *"The theory of signal detectability"*, *Transactions of the IRE* 4(4):171–212,
  com DOI. E Tanner & Swets ganhou a referência que não tinha: *"A decision-making
  theory of visual detection"*, *Psychological Review* 61(6):401–409, 1954.
- **O relatório de 1953 não abriu**, e é nele que o termo *Receiver Operating
  Characteristic* teria nascido. Duas tentativas, dois repositórios, duas recusas:
  o de defesa devolveu página em vez de documento, o da universidade respondeu com
  desafio de robô. A linha continua ⏳ **com as tentativas registradas**, para que
  quem retomar saiba o que já falhou.
- O gate de prosa pegou um parágrafo com quatro negritos, introduzido por mim ao
  escrever a correção.

### Alterado — o capítulo I.6 passou na conferência, e ganhou páginas
- **Primeiro capítulo da coluna sem achado.** As quatro afirmações centrais bateram
  com a fonte, inclusive a direção de cada sobreposição no exemplo de Harris: quase
  completa entre *oculist* e *eye-doctor*, parcial entre *oculist* e *lawyer*.
- **O ganho foi de precisão.** Entraram as páginas — 156–157 no artigo de Harris,
  194 no de Firth para o *meaning by collocation* — e o intervalo completo do
  artigo de 1954 (*Word* 10(2–3):146–162).
- A fonte que sustenta essas leituras passou a ser citada pela **versão publicada**
  (NAACL 2022), e não apenas pelo pré-print do arXiv.
- Spärck Jones (1972) e Salton & Yang (1973) ganharam ficha com DOI; **quem cunhou
  o termo "idf" continua ⏳**, porque ficha de artigo não prova autoria de nome.

### Corrigido — a citação de Playfair, no capítulo I.5, estava na forma que circula
- **O livro se pegou errando uma citação.** O capítulo trazia *"As **the knowledge
  of mankind increases**, and transactions multiply…"*, que é a forma repetida em
  fontes secundárias. O texto de Playfair, lido na digitalização da **terceira
  edição** do atlas, diz *"As **knowledge increases amongst mankind**…"* — e segue
  por mais uma oração, que o capítulo cortava sem marcar.
- **A frase também estava no lugar errado:** era atribuída à edição de 1786, e está
  na introdução da terceira edição. Ela **não aparece** no texto da de 1787.
- **Entrou uma frase nova, que data a invenção pela mão do autor:** *"It is now
  sixteen years since I first thought of applying lines to subjects of Finance."*
  A terceira edição é de 1801, e dezesseis anos antes dá 1785, o ano da edição
  preliminar privada que o capítulo já citava.
- **O capítulo registra o próprio erro ao leitor**, porque é o padrão que o V.4
  descreve: a procedência apodrece antes do conteúdo, e variação que não atrapalha
  a leitura não é corrigida por ninguém. Desta vez o caso é de dentro de casa.
- Beniger & Robyn ganhou ficha com DOI; a frase citada deles continua ⏳.

### Alterado — o quarteto de Anscombe deixa de ser "praticamente idêntico" (cap. I.4)
- **Os seis números entraram numa tabela**, recalculados sobre os onze pontos de
  cada conjunto: médias de 9,00 e 7,50, variância de x igual a 11,00 nos quatro,
  correlação 0,816 (0,817 no quarto) e a mesma reta 3,00 + 0,500x. O capítulo
  dizia "praticamente idênticas" e agora mostra o quanto.
- A descrição do quarto conjunto ficou verificável em vez de impressionista:
  `x` vale **8 em dez dos onze pontos**, com um único ponto em 19.
- **Uma distinção que o capítulo passa a fazer:** os valores estão ✓ porque foram
  recalculados; a ficha do artigo de Anscombe está ✓ᵐ porque só o DOI foi
  conferido, e o artigo segue fechado. A atribuição dos dados a ele passa pela
  distribuição do R, não pela leitura da tabela original.
- Tukey (1962) ganhou ficha com DOI, e o registro de que o texto **não abriu**.

### Corrigido — o mecanismo do *Patient ID*, no capítulo I.3
- **A explicação estava plausível e errada.** O capítulo dizia que o identificador
  do paciente previa câncer porque refletia "a organização da fila do hospital",
  com exames de triagem de rotina contra encaminhamento suspeito. A análise da
  competição diz outra coisa: a base juntou **várias fontes** (estudos clínicos,
  instituições, equipamentos), algumas das quais escolheram a população *"with
  prior knowledge of the patient's condition"*, e a junção manteve identificadores
  consecutivos por fonte, feita *"without obfuscating the source"*. O número do
  paciente era o nome da fonte, disfarçado de número.
- O texto do artigo foi extraído e lido, e com ele subiram a ✓ as competições
  citadas como gatilho (INFORMS 2010, IJCNN 2011, KDD-Cup 2007 sobre as bases da
  Netflix) e o caso do *Patient ID*.
- **Uma distinção de versão que o capítulo não fazia:** o que se leu é a versão de
  conferência (KDD '11, três autores). A versão citada pelo capítulo é a de *TKDD*
  6(4), 2012, com Stitelman como quarto autor, e **essa** continua ⏳.

### Alterado — o capítulo I.2 sai de cinco ⏳ e ganha o lado que dá para citar
- **O lado Kimball da disputa passou a ✓**, com duas definições citadas das páginas
  de técnicas dos próprios autores: a arquitetura de barramento e a dimensão
  conformada. A definição de dimensão conformada é **mais estreita** que a paráfrase
  que o capítulo usava: *"same column names and domain contents"*, e não "a mesma
  chave e o mesmo significado". O texto foi ajustado à fonte.
- **As duas obras ganharam ficha conferida** em catálogo: Inmon, *Building the Data
  Warehouse*, Wiley, 1992; Kimball, *The Data Warehouse Toolkit*, Wiley, 1996.
- **A assimetria ficou declarada ao leitor:** o lado Kimball está citado do site dos
  autores e o lado Inmon continua em fonte secundária. Onde só um lado de uma
  controvérsia está verificado, o capítulo diz qual.

### Corrigido — dois fatos do capítulo I.1, derrubados pelo guia CRISP-DM
- **O consórcio tinha quatro membros, não cinco.** O capítulo listava ISL, Teradata,
  NCR, Daimler-Benz e OHRA. A página de propriedade do guia lista NCR,
  DaimlerChrysler, SPSS e OHRA: **Teradata é a linha de *data warehouse* da NCR**,
  não um membro, e **ISL é o nome anterior da própria SPSS**. O capítulo contava
  duas vezes a mesma empresa e promovia um produto a organização.
- **ESPRIT não aparece no documento.** O capítulo dava o programa como financiador;
  o guia diz apenas *"obtained funding from the European Commission"*. A atribuição
  a ESPRIT desceu para ⏳, com a razão escrita.
- As 78 páginas do guia foram extraídas e lidas, então a estrutura de seis fases, a
  cronologia, os testes na Mercedes-Benz e o Clementine de 1994 subiram de ✓ᵐ para
  ✓, com as frases do prefácio citadas.
- A síntese do capítulo, que repetia "1996–1999, ESPRIT", foi corrigida junto.

### Alterado — a coluna de fontes abre para valer, no capítulo 0.2
- **A tabela de selos do 0.2 foi refeita, uma obra por linha.** Antes, uma única
  linha ✓ᵐ cobria cinco trabalhos de status muito diferente. Selo médio esconde
  a fonte mais fraca do conjunto, que é o oposto do que o selo existe para fazer.
- **A carta do *double descent* foi lida por inteiro** (Loog, Viering, Mey,
  Krijthe & Tax, PNAS 2020), com a lista de referências conferida. O capítulo
  agora nomeia quem viu antes, com ano: Vallet *et al.* (1989) experimentalmente,
  Opper *et al.* (1990) no primeiro resultado teórico, Duin (2000) em dado real.
- **Belkin *et al.* ganhou o selo ✓ᵃ** (resumo lido no original, ADR 0005), e o
  texto passou a citar o resumo entre aspas em vez de afirmar o que o corpo
  demonstra — que é exatamente o que esse selo não autoriza.
- **Larson (1931) saiu de "um psicometrista de sobrenome Larson" para a citação
  completa**: S. C. Larson, *Journal of Educational Psychology* 22(1):45–55, DOI
  conferido. A **primazia** dele continua ⏳, porque metadado prova que a obra
  existe e não que ela foi a primeira.
- **A regra de método que este ciclo deixou registrada:** resumo de máquina não
  confere fonte. Uma extração automática afirmou que a carta **não** mencionava
  física estatística, e quase enfraqueci uma frase correta do livro por causa
  disso; o texto extraído localmente diz *"various physics papers on learning"*.

### Adicionado — as fontes de vazamento medidas lado a lado (cap. I.3)
- **`anima-vazamento`**: as três fontes do capítulo com a intensidade subindo de
  0 a 1, partindo todas da mesma AUC (0,570) porque na intensidade 0 são o mesmo
  experimento honesto. Alvo disfarçado chega a **0,991**, duplicata a **1,000**.
- **A curva do meio é o assunto.** Normalizar antes de dividir, que é o erro mais
  comum, mede **−0,003** — e vira +0,002 em outro conjunto de sorteios. O sinal
  não é estável: o efeito é indistinguível de zero, e é por isso que ninguém o
  detecta. A spec antiga prometia um tombo de AUC aqui, contra o próprio texto do
  capítulo; foi corrigida antes de virar código e a medição foi ainda mais longe.
- **Entrou uma quarta curva, que é a mesma fonte sobre outra estatística:**
  codificar por alvo antes de dividir, numa categórica de alta cardinalidade,
  infla **+0,183**. Mesmo descuido, sessenta vezes mais. A lição do capítulo
  ficou melhor que a da spec: o tamanho do vazamento não se lê no erro, e sim no
  quanto a estatística vazada se mexe.
- **Cada ponto é a média de 8 sorteios independentes**, porque um sorteio só não
  sustenta uma afirmação da ordem de milésimos.
- `publicar/testes/anima-vazamento.mjs`, com oito asserções — incluindo a de que
  as quatro curvas partem do mesmo ponto, que pegou dois defeitos de simulação:
  a categoria sumindo na cópia das linhas duplicadas (a duplicata media 0,737 em
  vez de 1,000) e uma fonte rodando com uma coluna a mais que as outras.

### Adicionado — três taxas de aprendizado na mesma paisagem (cap. II.4)
- **`anima-taxas`**: 0,001, 0,1 e 1,5 descendo ao mesmo tempo, partindo do mesmo
  ponto. Diagnóstico por forma de curva é a habilidade do capítulo, e forma não
  se compara em sequência. A taxa 1,5 sai da moldura, com seta marcando a época
  em que passou do teto; a fronteira de estabilidade desta paisagem é **1,0**,
  e o texto diz por quê.
- **O botão troca só a PERDA, mantendo as três taxas idênticas.** Mudar duas
  variáveis de uma vez não é experimento. Com erro quadrático a taxa 1,5
  estoura; com perda logística, sobre o mesmo dado, ela termina em **0,1455** e
  é a **melhor das três**. A taxa destrutiva numa paisagem é a mais eficiente na
  outra, que é a sutileza medida na etapa 05–06.
- **Um rótulo ganhou critério declarado:** "quase parada" passou a ser menos de
  **10% de queda em 60 épocas**, em vez de um corte escolhido até o rótulo sair
  bonito.
- `publicar/testes/anima-taxas.mjs`, com seis asserções sobre valores medidos, e
  visto falhando ao se trocar um dígito do esperado.

### Adicionado — a animação da tese do livro (viés e variância, cap. 0.2)
- **`anima-vies-variancia`**: o grau do polinômio sobe de 1 a 15, o erro de
  treino só desce e o de validação **vira para cima no grau 5**. É o único lugar
  do livro em que o cruzamento acontece na tela, e não numa tabela.
- **O piso irredutível ficou visível.** A validação leva ruído próprio, então o
  fundo da curva bate em ~0,011, que é a variância do ruído. E o erro de treino
  descendo **abaixo** desse piso é a assinatura de um modelo ajustando ruído.
  Com validação limpa, como estava na primeira versão, o terceiro termo da
  decomposição sumia do desenho.
- **A previsão do autor estava errada, e a lição medida é melhor.** A spec dizia
  que com 3× mais dados o joelho andaria para a direita. Ele não anda: fica no
  grau 5 nos dois casos. O que desaba é o **castigo** por passar dele, de ~0,48
  para ~0,015 no grau 15. O capítulo passou a ensinar isso.
- **O ajuste é por Gram-Schmidt (A = QR), não pela equação normal**, porque no
  grau 15 a equação normal faria a validação explodir por ponto flutuante em vez
  de por sobreajuste — a animação certa contando a história errada.
- `publicar/testes/anima-vies-variancia.mjs`, com seis asserções, todas
  derivadas de medição. Ele pegou um `>` que devia ser `>=` e por isso o rótulo
  "varredura completa" nunca chegava ao placar, que é o que o leitor sem visão lê.

### Adicionado — a prova final, e as sete provas do livro completas
- **Prova final** (`livro/provas/prova-final.md`), quatorze itens que cruzam
  **partes**, e não apenas capítulos: a hipótese de mesma distribuição contra
  drift; o XOR como problema de representação; acurácia enganosa e silhueta
  enganosa como a mesma armadilha; o vazamento da Parte I reaparecendo como
  divergência entre treino e serviço na Parte V.
- Com ela, as **7 provas** existem: seis de parte mais a final, 70 itens, todos
  determinísticos, com cenário inédito e sem `volte para`. Nenhuma vale nota, e
  nenhuma entra no corpus do tutor.

### Adicionado — a Parte V fecha, e com ela os 29 capítulos
- **Prova da Parte V** (`livro/provas/prova-parte-v.md`), dez itens cruzados
  sobre os quatro capítulos da parte, todos com cenário inédito e correção
  determinística. Vários cruzam para fora da parte, que é o que a Parte V faz:
  pega o livro em condição de laboratório e pergunta o que sobra no mundo.
- **Nove exercícios no V.4**, fechando três por objetivo. Com isso **a coluna de
  exercícios fecha nos 29 capítulos**: 342 de capítulo, três por objetivo, em
  escada e com teto no verbo declarado.

### Adicionado — o V.3 ganha a fronteira do serviço, e a lista de dívidas do gate zera
- **Seção "A fronteira do serviço: contrato e validação de entrada"** no V.3,
  dentro de "Fundamentos". O capítulo prometia implantar atrás de uma API com
  contrato e validação e **não tratava da fronteira em lugar nenhum**. Decidido
  pelo [ADR 0017](adr/0017-a-fronteira-do-servico-entra-no-v3.md).
- **O exemplo trabalhado é o backend deste próprio livro** (`chat-companion/backend/app.py`),
  com linha citada, e **com os defeitos dele em voz alta**: não versiona endpoint
  e não conta nenhuma rejeição. Um serviço real que o leitor pode abrir vale mais
  que um exemplo inventado, inclusive onde está abaixo do que o capítulo recomenda.
- **A política de violação é apresentada como decisão, não como prescrição.**
  Nenhuma fonte aberta diz o que fazer quando uma requisição viola o contrato,
  e isso ficou registrado com selo ❌ em vez de virar opinião com aparência de
  fonte. O capítulo mostra as três políticas convivendo no mesmo serviço e
  ensina que a escolha é escrita no contrato.
- **Nove exercícios novos no V.3**, fechando três por objetivo. O difícil do O2
  é desafio aberto na Verificação, com rubrica, para não pagar a D16 engordando
  a D13.
- **`ORFAOS_ACEITOS` ficou vazia** em `publicar/exercicios.mjs`: a dívida D16 foi
  paga pelos dois lados, e nenhum verbo foi rebaixado para caber no que já
  estava escrito. A checagem inversa continua ligada.

### Adicionado — o V.2 passa a ensinar o que prometia
- **Seção "Decidir a forma de serviço pelo requisito"** no capítulo V.2, com os
  quatro eixos da escolha (quando a decisão é necessária, custo do atributo
  dentro do orçamento de latência, frescor, volume) e a armadilha nas duas
  direções. O capítulo declarava esse objetivo desde sempre e **não o ensinava
  em lugar nenhum**; quem ensinava era o V.3, sem que nenhum objetivo de lá
  cobrisse a tabela. Decidido pelo [ADR 0016](adr/0016-a-quem-pertence-a-escolha-da-forma-de-servico.md), que paga a primeira metade da dívida D16.
- **Nove exercícios novos no V.2**, fechando três por objetivo nos quatro
  objetivos, em escada e com teto no verbo declarado.
- **Quatro fontes abertas em primeira mão** para sustentar a seção nova: as
  regras #31 e #32 das *Rules of Machine Learning*, o texto do Michelangelo e o
  artigo de Chip Huyen de 2022. Duas afirmações que estavam em ⏳ subiram para
  ✓; duas que o texto aberto **não** confirmou ficaram em ⏳, com a razão escrita.
  Uma citação relatada por um dos especialistas estava quase certa e não era
  literal, e foi corrigida contra o texto antes de entrar no livro.

### Alterado — o V.3 devolve o que não era dele
- **A tabela das três formas de serviço saiu do V.3**, onde vivia sem objetivo
  que a cobrisse. Ficou uma remissão ao V.2 e o que de fato pertence ao capítulo
  de operação: como a forma escolhida muda a promoção e o rollback.
- `publicar/exercicios.mjs`: a exceção `v-2 O4` saiu de `ORFAOS_ACEITOS` no
  mesmo commit em que a dívida foi paga, como o próprio gate exige.

### Adicionado — os endereços antigos voltam a chegar ao capítulo
- **29 redirecionamentos**, um para cada capítulo renumerado pelo ADR 0011.
  `05-modelos-lineares.html` → `ii-2-modelos-lineares.html`, e assim por diante.
  O ADR aceitou quebrar os endereços; a conta chegou no meio do semestre, em
  link de slide, de PDF de aula, do Moodle e de favorito de aluno.
- **A âncora e a query sobrevivem** — `05-modelos-lineares.html#o-caso-da-limonada`
  chega em `ii-2-modelos-lineares.html#o-caso-da-limonada`. É o caso que mais
  importa, porque link de aula aponta para a *seção*, e o `meta refresh`
  sozinho descartaria o fragmento. Verificado num navegador de verdade.
- **Stub em HTML, não configuração de provedor**: o livro é servido em dois
  lugares até o passo 8 da migração, e um arquivo funciona nos dois.
- O mapa (`publicar/redirecionamentos.json`) foi **derivado da detecção de
  rename do git**, não escrito à mão. Dois gates novos: uma rota que colida com
  uma página viva (o stub apagaria o capítulo) ou que aponte para página
  inexistente quebra o build.

### Corrigido — o tutor citava numeração que não existe mais
- **"Qual o capítulo do neurônio artificial?" → "Capítulo 18", citando o
  `HISTORICO.md`.** Depois do ADR 0011 o capítulo é **III.1**, e a posição de
  leitura é 17 — o 18 não existe em lugar nenhum do livro atual. Três causas
  somadas, todas medidas antes de qualquer conserto:
  1. **O `HISTORICO.md` entrava no corpus** com o mesmo peso de um capítulo — e
     ele guarda numeração de edições antigas *por construção*. Editar o arquivo
     não resolveria: cada edição nova acrescenta numeração que envelhece. Saiu
     do índice, junto com o guia editorial e a documentação do banco.
  2. **Os blocos não sabiam de que capítulo eram.** Só o bloco do H1 continha o
     nome, então perguntar por um capítulo não recuperava esse capítulo — na
     medição, o capítulo do neurônio não aparecia entre os três primeiros.
     Agora todo bloco herda "Parte III … · III.1 — O Neurônio Artificial",
     vindo do `sumario.json`, que é a fonte da numeração vigente.
  3. **`buscar()` nunca entregava o nome canônico ao modelo** — só caminho de
     arquivo e título de seção. O modelo *tinha* de deduzir o número do texto,
     e deduziu do texto histórico. Agora recebe o capítulo e a instrução
     explícita de não inferir numeração do conteúdo.
- Sete testes novos cobram as três causas, vistos falhando antes de valerem.

### Corrigido — onda 3: o download que entregava o gabarito
- **O botão "⬇ md" servia o arquivo-fonte cru.** `docs/md/machine-learning.md`
  trazia **79 gabaritos e 30 rubricas**, e o botão fica na página do capítulo,
  ao lado do exercício que deveria custar duas tentativas. O desenho estava
  certo — `renderizar()` protege o HTML — e a promessa era falsa, porque
  ninguém tinha conferido a outra porta. `semGabarito()` limpa a exportação
  (gabarito, `porque`, rubrica e a marcação `- [x]`), preservando enunciado,
  alternativas e o `volte para`. **Gate novo**, visto falhando com 273
  vazamentos antes de ser dado por pronto.
- **Rubrica partida por `;` dentro do critério.** A rubrica é quebrada em `;`,
  então `"aponta um mecanismo (A; B; C)"` virava **três critérios**. Como
  `correto = atendidos == total`, quem respondesse exatamente o que foi pedido
  — *um* mecanismo — falharia em dois. Atingia `ciclo-ciencia-de-dados-e5`, já
  publicado. Gate novo: parêntese desbalanceado no critério quebra o build —
  e ele **pegou o mesmo erro sendo cometido de novo**, uma hora depois, na
  redação de um exercício novo. Um segundo gate (teto de 6 critérios) cobre a
  variante que o parêntese não vê: lista com `;` sem parêntese nenhum, que
  transformou "cite ao menos três" em oito exigências simultâneas.

### Adicionado — onda 3: a promessa dos objetivos
- **Vinte e um exercícios novos, 101 → 122.** Dezoito pagam objetivos que não
  tinham cobrança nenhuma (**D11: 20 → 2**); três fecham os órfãos abertos ao
  reapontar exercícios mal mapeados — que o gate bidirecional da onda 1
  detectou no mesmo instante, como projetado.
- **Os 2 órfãos restantes não são falta de exercício, e sim de conteúdo** (D16).
  `v-2` declara "decidir entre lote e tempo real pelo requisito" e quem ensina
  isso é o **`v-3`** — com a frase "escolhidas pelo requisito e não pelo gosto",
  que é a redação do objetivo do outro capítulo. Escrever exercício ali seria
  cobrar o que o capítulo não ensina; a saída é editorial, e ficou registrada.
- **[ADR 0012](adr/0012-verificacao-como-superficie-corrigida.md) — a seção
  `## Verificação` vira superfície corrigida, uma pergunta por capítulo.** Três
  pareceres independentes (avaliação, arquitetura, professor com turma em
  curso) convergiram em não converter as ~87, não criar tipo novo de bloco e
  fasear. Divergiram sobre revelar a solução; o desacordo se resolve revelando
  **os critérios**, não a solução pronta — o exemplo trabalhado vai para o
  corpo do capítulo, onde serve o leitor solitário sem queimar a aula seguinte.
  Marcação por atributo `secao`, agora carregado até o `banco.json`.
- **Rubrica de 4 critérios obrigatória** nesses desafios, sendo o quarto o
  **anti-critério** — o movimento errado comum, nomeado.
- **As perguntas que ficam sem correção agora dizem por quê**, em vez de o
  leitor ter de adivinhar. Três delas continuam sem correção de propósito:
  dependem de material que só o leitor tem à mão, e rubricar artefato que o
  corretor não viu seria fingir correção.
- **O índice dos ADRs voltou a existir**: tinha parado no 0003 por oito
  registros. Índice que não acompanha é pior do que índice nenhum.

### Corrigido — onda 2: o dano direto ao aluno
- **O laboratório do `I.4` deixou de ser sabotado pelo próprio capítulo.** O
  enunciado pedia "encontre as duas colunas surpreendentes" e **duas linhas
  depois** entregava "62 outliers" e "média 0,83, mediana 0,74, 28 pontos". O
  leitor lia a saída em vez de produzi-la. Agora um exercício **numérico** pede
  o número que só o painel mostra, e os seguintes partem dele. 101 exercícios.
- **A perda tinha três escalas no `II.2`** — $\frac{1}{2n}$ no texto, sem
  constante na dedução, e `sqe/n` no laboratório. O número que o aluno anotava
  não era o que o capítulo definia. Unificado no **EQM** ($\frac{1}{n}$), com
  as duas convenções alternativas explicadas e a razão de elas não moverem o
  mínimo. `EQM`, `SQE` e `EAM` entraram no mapa de siglas.
- **`validação cruzada` e `dobra` eram instrução sem definição** — o `I.6` manda
  "calcule só no treino, e por dobra" e a unidade não existia no livro. Definidas
  no `0.2`, com as três armadilhas que a definição não deixa ver.
- **31 termos novos no glossário**, cobrindo o vocabulário de `I.3`, `I.4`,
  `I.6`, `II.1`, `II.2` e `II.3` — os capítulos das disciplinas em curso.
  Inclusive **chance (*odds*)**, cuja ausência derrubava a tese do `II.3`.
- **Duas trilhas violavam pré-requisito.** Em Ciência de Dados, Fundamentos vinha
  **depois** do capítulo de vazamento, que usa *overfitting* e validação cruzada
  como se o leitor soubesse; em Análise Preditiva, era **leitura opcional** — e o
  capítulo de ensembles apoia a seção inteira de bagging na decomposição
  viés–variância, dizendo isso com todas as letras. Reordenadas.
- **A abertura do `II.2`, a mais fraca do livro**, abria com um erro *do livro*
  ("o capítulo II.5 mostrou o linear perdendo feio"), quatro dígitos e dois
  jargões antes de qualquer cena — e dependia de um capítulo que a disciplina de
  Análise Preditiva não usa. Agora abre com o banco que precisa negar crédito e
  explicar por quê. A comparação numérica migrou para onde há contexto para ela.
- **Duas frases diziam o contrário do pretendido**: "refeitas **de graça**" (era
  *à toa*) e "o fenômeno que **apareceu** … mais adiante" (pretérito para o que
  ainda vem). E **"a cerca de 1,5 × IQR"** lia-se como "aproximadamente" —
  virou "a **regra da** cerca", com o termo técnico enfim nomeado onde é
  apresentado.
- Siglas expandidas na primeira ocorrência: **CRISP-DM**, **ESPRIT**, *workbench*
  e **churn**, todos órfãos na abertura do capítulo mais introdutório da trilha.
- **56 rótulos de link** ainda mostravam o número antigo no formato
  `[19 — O Ciclo…]` — outro padrão que a migração não pegou.

### Adicionado — os gates da onda 1: as regras saem da prosa e entram no build
- **Backward Design nas duas direções.** O gate proibia exercício apontando para
  objetivo inexistente e **nada** proibia objetivo sem exercício. Foi por essa
  porta que 18 dívidas entraram sem registro: o roadmap declarava 2 objetivos
  órfãos, e o livro tinha **20**. A lista `ORFAOS_ACEITOS` é a dívida cobrada —
  órfão novo quebra o build, **e exceção que deixou de ser necessária também**,
  para que pagar a dívida obrigue a tirá-la da lista.
- **Seções obrigatórias do esqueleto v5** viram gate. "Fundamentos científicos"
  caiu para 1 capítulo em 29 e "Fontes da indústria" para zero sem ninguém
  notar, porque o esqueleto vivia só na prosa do Guia Editorial.
- **Verbo não verificável falha o build**: "entender", "conhecer", "saber",
  "dominar" abrindo um objetivo. Nenhum capítulo usa hoje — o gate existe para
  que continue assim.
- Os três foram **provados quebrando de propósito**: objetivo órfão novo, exceção
  obsoleta, seção removida e verbo vago.

### Adicionado — a tabela de verbos de Bloom (Guia Editorial §2.5)
- O esqueleto pedia "verbos de Bloom" desde o começo e **a tabela nunca existiu
  no repositório**. É a revisão de **Anderson & Krathwohl (2001)**, com as duas
  dimensões — os seis processos e os quatro tipos de conhecimento.
- Três regras, e a terceira é a que corrige o defeito medido: **o exercício
  define o verbo, não o contrário.** Rebaixar o verbo é honesto; inflar é
  promessa que o leitor descobre sozinho, tarde.
- Alerta explícito sobre "reconhecer"/"identificar": em Anderson & Krathwohl são
  subprocessos de **Lembrar**, e no livro geraram exercícios separados por quatro
  degraus a partir da mesma palavra.

### Corrigido — dívidas do roadmap que estavam sub-declaradas
- **D11: de 2 para 20 objetivos órfãos.** O projeto define o próprio nível de
  maturidade pela honestidade da declaração; 18 dívidas não declaradas
  contradizem a regra que autoriza publicar em `essencial`.
- **D13, nova**: 15 objetivos de nível Criar cobrados abaixo do nível — só 1 dos
  15 tem exercício que pede produção, e 4 não têm evidência alguma no livro.

### Alterado — numeração por parte, e o id do exercício desatado do número (ADR 0011)
- **`05-modelos-lineares` → `ii-2-modelos-lineares`**, e o título vira **II.2**.
  A medição que motivou: **as 29 posições do sumário estavam fora de ordem** —
  não algumas. Inserir um capítulo agora desloca só os vizinhos da mesma parte.
- **O id do exercício deixou de carregar o número**: `05-e1` → `modelos-lineares-e1`.
  Se seguisse a numeração, inserir um capítulo no meio de uma parte renumeraria
  os exercícios seguintes e **o progresso de cada aluno apontaria para exercícios
  inexistentes** — a cada inserção, para sempre. Números para humanos, nomes
  para máquinas.
- **O "capítulo" do companion virou posição de leitura** (1..29). O gating de
  capacidades passou de 2/4/6 para 5/9/12 — que é o que ele sempre quis dizer.
- **29 endereços antigos quebram**, por decisão explícita do autor (13 tentativas
  registradas em produção; redirecionar custaria uma tabela de-para para sempre).
- **Dívida D7 paga. Dívida D12 aberta**: a numeração das pastas do `ml-zero`
  ficou órfã (`etapa-05` serve o `II.2`).

### Adicionado — gate: âncora `volte para` inexistente falha o build
- O `volte para:` devolve o leitor à seção exata que ele precisa reler, e o Guia
  Editorial o chama de "o gesto mais útil do livro". Âncora inexistente **não dá
  erro**: a página abre, não rola, e o leitor acha que a culpa é dele.
- **Duas estavam quebradas** quando o gate foi escrito — achadas pelos pareceres
  de didática, não por teste. Provei o gate quebrando uma âncora de propósito.

### Corrigido — quatro acoplamentos ao número, que só apareceram quando ele mudou
- **`dividirTitulo` exigia prefixo só de dígitos.** Com "II.2" ele devolvia
  vazio, o cabeçalho do capítulo não era montado — e junto sumia o **selo de
  nível**. O gate do Princípio X pegou, nas 29 páginas de uma vez. Segunda vez
  que esse gate salva exatamente essa promessa.
- **O grafo do livro** identificava nós por número e ligava capítulos por menção
  textual ("cap. 05"). Passou a identificar por slug e a ligar **por link** —
  mais fiel: referência linkada é dependência declarada; menção solta nem sempre.
- **O gating de capacidades** nos dois lados (motor e backend).
- **Os testes do backend** citavam `05-e1` literal.

### Corrigido — o build do backend passa a ser declarado (ADR 0007)
- **`Dockerfile` + `.dockerignore` na raiz**, e `railway.json` com
  `builder: DOCKERFILE`. A raiz do repositório tem `package.json` (que existe só
  para fixar o Node na Vercel) e **nenhum marcador de Python no topo** — os do
  backend estão dois níveis abaixo. Qual linguagem a detecção automática
  elegeria nessa combinação não é coisa que se prove sem rodar o build lá, e o
  `buildCommand` anterior pressupunha `pip` na imagem. Achado na conferência
  **antes** do primeiro deploy, não depois dele falhar.
- **Removidos `chat-companion/backend/railway.json` e `Procfile`**, herdados da
  cópia do harness. Inertes com a raiz no repositório — e prontos para funcionar
  no dia em que alguém "consertasse" o Root Directory apontando-o para a pasta
  do backend: o serviço subiria **verde**, sem `livro/`, com a busca do tutor
  degradada e nenhum sinal.
- O `.dockerignore` exclui `.env` explicitamente: o arquivo é gitignored, mas
  `COPY . /app` não sabe disso (Princípio V).

### Adicionado — análise monovariada: laboratório, dois exercícios e notebook (cap. 21)
- **Laboratório `21-l1`** sobre o conjunto **real** da limonada, servido pelo
  próprio site: seletor de coluna, **histograma e boxplot na mesma escala**, e o
  painel completo — n, distintos, média, mediana, moda, desvio-padrão, Q1/Q3,
  IQR, P10/P90, cerca de 1,5 × IQR e contagem de outliers. Média e mediana
  aparecem como linhas tracejadas sobre o histograma: o afastamento entre elas é
  a assimetria, visível de graça.
- **`21-e4`** cobra o caso que o dado entrega de bandeja: `preco` acusa **62
  outliers** porque **Q1 = Q3 = 0,30 e o IQR é zero** — a régua quebrou, não os
  dados. E aumentar o fator de 1,5 para 3,0 não muda nada: três vezes zero
  continua zero.
- **`21-e5`** (aberta) usa `precipitacao`, onde a regra acusa 28 pontos **por
  construção** — distribuição assimétrica, cauda longa, chuva forte é fenômeno e
  não erro. A rubrica exige **critério declarado**, não remoção por reflexo.
- **Notebook `etapa-21/exploratoria_limonada.ipynb`**, com o caminho da aula:
  tipo de cada campo → contagem e nulidade → posição → separatrizes (incluindo a
  verificação de que P50 = Q2 = D5) → histograma e boxplot → a cerca coluna a
  coluna.
- **ADR 0010**: esta é a **única** etapa que usa `pandas` e `matplotlib`. O
  assunto é *ler distribuição*; desenhar histograma à mão ensinaria sobre
  desenho. A conta em si — quantil, cerca, descritivas — está escrita à mão no
  laboratório, em 30 linhas.

### Corrigido — três defeitos que só apareceram ao dirigir o navegador
- **A última coluna do CSV era inacessível.** O arquivo estava com terminador
  `CRLF`, então o `\r` colava no nome da última coluna e a chave virava
  `"vendas\r"`. O laboratório lia `undefined`, a coluna inteira virava `NaN` — e
  **o painel continuava exibindo os números da coluna anterior**, porque o
  desenho quebrava antes de atualizá-lo. Valor errado exibido com confiança é
  pior que erro na tela. O CSV foi regravado com `LF` e o parser passou a
  limpar cada campo.
- **O painel do laboratório novo nascia espremido**: a regra de largura escrita
  para o laboratório do capítulo 05 estava presa ao seletor daquele laboratório.
- **`ml-zero/` estava no `.vercelignore`**, e o build agora lê o CSV de lá. A
  produção não quebraria (é construída no GitHub Actions, com o repositório
  inteiro) — **só as previews**, que é a falha mais difícil de diagnosticar.
- O **verificador de notebooks** passou a rodar **um processo por notebook**: a
  versão anterior limpava `sys.modules` entre eles e quebrava no primeiro
  `import numpy` (extensão em C não recarrega). Processo próprio é também o que
  o Jupyter dá ao aluno.

### Adicionado — laboratório de mínimos quadrados, dedução do método, e o capítulo 28 (ADR 0009)
- **Laboratório `05-l1`**: nuvem de pontos aleatória, e a reta manipulável pelos
  **coeficientes** ou **arrastando as alças** direto no gráfico. Resíduos
  desenhados ponto a ponto, e **os quadrados do erro como área** — o que se
  minimiza fica literalmente visível. Cinco métricas lado a lado (SQE, EQM,
  RMSE, EAM, R²) com **o EQM marcado como a que estamos minimizando**, mais
  botões de ajustar automaticamente, revelar a reta ótima e sortear novos dados.
  Roda no navegador, sem backend.
- **"A dedução, em cinco passos"** no capítulo 05: do critério às equações
  normais, passando pelas duas condições que a derivação entrega — a soma dos
  resíduos é zero (**a reta passa pelo centro de massa**) e os resíduos são
  ortogonais ao atributo. Termina no aviso que a fórmula dá de graça:
  `a = Sxy/Sxx`, e **atributo que não varia não tem coeficiente**.
- **Capítulo 28 — Regressão Logística**, separado do 05 (ADR 0009). Ganhou
  história com selos, a dedução de **por que a solução fechada some** (o peso
  fica preso dentro da sigmoide), a tabela que mostra o mesmo coeficiente
  movendo a probabilidade em 8, 17 ou 5 pontos conforme o ponto de partida, e
  três exercícios. Antes eram 30 linhas dentro do 05.
- Exercícios: **94 → 96**. `05-e2` e `05-e3` viraram `28-e1` e `28-e2`; o
  exercício novo da dedução é `05-e7` — **e não o `05-e2` vago**, porque
  reciclar id faria as tentativas antigas apontarem para outra pergunta em
  silêncio.

### Corrigido — o banner de consentimento estava quebrado em TODAS as páginas
- `var tx = el("span", …)` **sombreava a função `tx()`** de tradução dentro da
  mesma função (`publicar/tema/companion.js`), e a linha seguinte tentava chamar
  um `<span>`. Resultado: `Uncaught TypeError` em toda página do livro, banner
  nenhum, e — porque a telemetria de navegação **exige consentimento** — nenhum
  registro de navegação jamais gravado.
- Nenhum gate pegava: o build compila, os testes do backend passam, os links
  estão certos. **Só apareceu ao dirigir a página num navegador de verdade**,
  enquanto eu verificava o laboratório novo.

### Adicionado — notebooks prontos para executar nas seções "Mão na massa"
- **Quatro notebooks novos** (o cap. 18 já tinha o dele), ligados dos capítulos
  **01, 02, 05, 06 e 07**: `linha_de_base`, `vazamento`, `regressao_limonada` e
  `arvores_ensembles`.
- **Rodam na máquina do aluno e no Colab sem mudar nada**: a primeira célula
  procura o repositório subindo de pasta e, se não achar, baixa do GitHub só o
  que precisa. Nenhum deles exige NumPy ou pandas — biblioteca padrão e o código
  do próprio livro.
- **Gate novo no CI**: `ml-zero/tests/rodar_notebooks.py` executa **todas** as
  células, a partir da pasta da etapa. Notebook que não roda é pior que notebook
  nenhum: quebra no meio da aula. O verificador achou três defeitos antes da
  publicação — chave errada na matriz de confusão, um exemplo de vazamento com
  10 linhas onde **toda** coluna separa por acaso, e uma quebra de sintaxe.

### Corrigido — uma frase minha sobre a limonada estava errada
- O capítulo 05 dizia para "refazer o ajuste só com julho e agosto, **onde o
  preço varia** sem a estação variar junto". **Não varia.** Escrevendo o
  notebook, a verificação mostrou que **nenhum mês do ano tem mais de um preço**
  — 0,30 em dez meses, 0,50 nos 62 dias de julho e agosto.
- A correção deixa a lição mais forte, não mais fraca: o confundimento é
  **perfeito**, e não existe recorte, controle ou modelo que separe preço de
  estação. A resposta honesta passa a ser *"com estes dados não dá — e aqui está
  o que precisaria ser coletado"*. Propagado para o README do conjunto e para a
  rubrica do exercício `05-e6`.

### Adicionado — identificação por turma, para o professor acompanhar prática (ADR 0008)
- **`/turma AP2026-2 123456` no chat.** O anonimato continua sendo o padrão; a
  identificação é uma exceção que **o próprio aluno ativa**, e `/turma sair`
  desfaz. Enquanto ninguém digitar, nada muda.
- **É código, não prompt** (`chat-companion/backend/turma.py`): interpretado
  antes do modelo, nas **duas** rotas de chat — o widget usa a `/chat/stream`, e
  interceptar só a `/chat` teria deixado o comando cair no LLM, que responderia
  algo plausível sobre turmas sem identificar ninguém. Um teste quebra o
  `run_turn` de propósito para provar que a identificação sobrevive ao modelo
  fora do ar.
- **`GET /turma/{turma}`** (JSON ou CSV), protegido pelo `ADMIN_TOKEN`: por
  aluno, resolvidos · tentados · tentativas · acertos de primeira · capítulos ·
  vídeos. **Nunca o texto das respostas nem as conversas** — e há um teste que
  procura esses conteúdos na saída e falha se achar.
- Agrega **por aluno, não por sessão**: laboratório e celular são duas sessões
  anônimas, a pessoa é uma. E aluno identificado sem nenhuma tentativa aparece
  **zerado**, não ausente — ausente é dúvida, zerado é informação.
- **19 testes novos** (backend: 28 → 47). Cobrem que apagar a sessão apaga o
  vínculo, que sem token dá 403, e que "o que é uma turma?" não é comando.
- **A identificação é declarada, não verificada** — dito no ADR, no apêndice de
  uso e na resposta que o aluno lê. Serve para acompanhar prática; não substitui
  evidência para lançar nota.

### Adicionado — o capítulo 05 ganhou o caso da limonada (91 → 94 exercícios)
- **Nova seção "O caso da limonada"** em `ii-2-modelos-lineares.md`: a lista "as
  quatro coisas que o coeficiente não diz" deixa de ser advertência e passa a ser
  experimento. O leitor **produz** o coeficiente errado antes de ler que é errado.
- Mostra o que quase nenhum material mostra: **controlar pela temperatura não
  desfaz o confundimento** — o coeficiente do preço segue +2,41 na regressão
  múltipla, porque a temperatura do dia não captura "ser julho". Controlar por uma
  variável só remove o confundimento que aquela variável mede.
- **Três exercícios novos**: `05-e4` (inverter o coeficiente devolve a unidade da
  decisão: 53 panfletos por copo), `05-e5` (por que o coeficiente do preço
  sobrevive) e `05-e6`, aberto — a resposta que se dá à dona da barraca.
- **`05-e6` fecha uma lacuna anterior**: o objetivo **O4 não tinha exercício
  nenhum** no capítulo. Era o mesmo padrão da dívida D11, ainda não registrado.
- **Ponteiros** a partir do cap. 21 (a exploração que revela o confundimento
  precede o modelo) e do cap. 25 (a seção "limitações" é a única das seis partes
  do relatório que impediria a recomendação errada).

### Publicado — o livro está no ar no domínio próprio, com o backend vivo
- **https://machinelearning.ghdaru.com.br** (Vercel) e
  **https://api.machinelearning.ghdaru.com.br** (Railway + Neon em São Paulo),
  passos 1–7 do `DEPLOY.md` concluídos em 2026-08-11.
- **Os 91 exercícios saíram da dormência**: correção no servidor com revelação
  progressiva, verificada de ponta a ponta pelo domínio novo — 1ª tentativa
  devolve "Ainda não, releia a seção"; a 2ª entrega a explicação completa.
- Ambos os nomes resolvem **direto no provedor**, sem o proxy da Cloudflare:
  ele impediria a verificação de posse nos dois casos, e no `api.` o certificado
  grátis nem cobriria dois níveis de subdomínio.
- **Falta o passo 8** — o stub no endereço antigo — deixado por último por ser o
  único irreversível para quem tem link em circulação.

### Adicionado — conjunto de dados "Limonada" para regressão linear
- **`ml-zero/dados/limonada/`** — 365 dias (2017) de venda de limonada com tempo,
  panfletos e preço, fornecido pelo autor para a parte de regressão linear de
  Análise Preditiva. Original `.xlsx` preservado + `.csv` para código.
- O `README.md` do conjunto documenta **três armadilhas verificadas no próprio
  dado**, não supostas: (1) `preco` correlaciona **+0,513** com as vendas porque
  o preço de 0,50 só aparece em **julho e agosto** — é um indicador disfarçado de
  estação, e o confundimento **sobrevive à regressão múltipla**; (2) colinearidade
  `temperatura`×`panfletos` de **+0,798**; (3) `R² = 0,982` sem divisão
  treino/teste.
- A **unidade da temperatura não é declarada** pelo arquivo. O README registra
  Fahrenheit como leitura provável (faixa 15,1–102,9) e **não** como fato — e
  transforma isso na primeira pergunta da aula.

### Corrigido — o `og:image` apontava para o endereço que vai ser aposentado
- **`SITE` no `build.mjs`** passa a ser `https://machinelearning.ghdaru.com.br/`.
  Ele entra no `og:image` de **todas** as páginas e no cabeçalho da exportação em
  Markdown, e apontava para o GitHub Pages — que no passo 8 passa a servir só um
  stub. O `capa-social.png` deixaria de existir lá, e **toda partilha do livro em
  rede social viraria um retângulo vazio**. Nenhum gate pegaria: a página continua
  200, só a prévia quebra, e quem publica o link não vê. Achado lendo o HTML
  publicado na primeira build da Vercel.

### Corrigido — o `vercel.json` não podia ter comentários
- **Removidas as três chaves `_comentario…`**: a Vercel valida o schema e recusa
  a importação do projeto com *"should NOT have additional property"*. O Railway
  aceita e ignora chaves desconhecidas — daí o hábito ter passado batido. Achado
  na tela de importação, com o autor parado nela.
- A explicação de **cada campo** foi para `publicar/README.md`, incluindo a razão
  de `cleanUrls: false` (paridade de URL com o Pages, que é o que faz o stub de
  redirecionamento funcionar sem mapa de rotas) e de
  `git.deploymentEnabled.main: false` (quem promove produção é o workflow, depois
  dos gates).

### Adicionado — publicação (ADR 0006)
- **Front na Vercel**, promovido pelo workflow **depois** dos gates — não pela
  integração Git da Vercel. `deploymentEnabled.main: false` no `vercel.json`
  garante que o site não vá ao ar com os testes vermelhos.
- **Backend na Railway com raiz no repositório**, divergindo do guia do harness:
  com a raiz na pasta do backend, o tutor dependeria de um `corpus.json` de
  815 KB versionado e regenerado a cada edição — que, esquecido, degrada a busca
  **em silêncio**. Com a raiz no repositório o índice é construído ao vivo.
- **Domínio próprio** `machinelearning.ghdaru.com.br`, e **`api.machinelearning`
  para o backend** — porque `companion_backend` é compilado dentro do HTML de
  todas as páginas, e apontar para `*.up.railway.app` obrigaria a republicar o
  livro inteiro a cada troca de provedor.
- **`ALLOWED_ORIGIN_REGEX`** no backend, para as URLs de preview da Vercel, que
  mudam a cada commit. Sem ele o chat quebraria em silêncio em toda preview.
  Cinco testes cobrem o CORS, inclusive um que garante que o regex **não** é
  curinga.
- **Smoke test bloqueante** no deploy: sem o cabeçalho `access-control-allow-origin`
  vindo da API, o deploy falha. É a mitigação do risco que o ADR mais teme —
  degradação silenciosa, com os laboratórios funcionando e mascarando a falha.
- **Stub de redirecionamento** para o endereço antigo do Pages, preservando o
  caminho, com `canonical` e `noindex`. Publicado por workflow manual, e só
  depois de o domínio novo estar no ar.
- **Passo 4 do `DEPLOY.md` corrigido durante a execução**: o Railway pede **dois**
  registros (CNAME + TXT `_railway-verify`), não um — sem o TXT o certificado
  nunca é emitido. E o DNS de `ghdaru.com.br` está na Cloudflare, então os
  registros precisam ficar **DNS only** (nuvem cinza): com o proxy ligado, a
  verificação de posse falha, porque o Railway encontra IP de proxy no lugar do
  alvo dele.

### Corrigido
- **O gate do banco de exercícios não pegava derivação.** Ele validava a sintaxe
  do Markdown e **não comparava com o `banco.json` versionado** — que é o arquivo
  que o backend serve ao leitor. Estava derivado de verdade: **88 exercícios no
  banco contra 91 no livro**, então os três do capítulo 14 nunca chegariam a
  quem estudasse. Agora o gate compara o conteúdo e falha na diferença.

### Removido
- `render.yaml` — o blueprint do Render foi substituído pelo caminho
  Railway + Vercel do ADR 0006.

## [1.0.0] — 2026-08-10 — **a primeira versão completa**

### Adicionado
- **Os 28 capítulos existem e declaram o próprio nível.** De 8 com corpo para 28
  declarados, **todos em `essencial`**. As duas disciplinas do autor têm material
  em todos os tópicos da ementa.
- **19 capítulos novos ou reescritos**: 03, 08, 09, 10, 11, 12, 13, 14, 15, 16,
  17, 19, 20, 21, 22, 23, 24, 25, 26, 27.
- **"De onde isto veio"** em todos os 26 capítulos de método, com tabela de selos.
- **Exercícios: de 31 para 91.**
- **Cinco notas de pesquisa histórica** em `estudos/`, com fila de verificação
  ordenada por dúvida fechada por unidade de esforço.
- **Relatório da auditoria adversarial** (`estudos/2026-08-10-auditoria-adversarial.md`).
- **ADR 0004** (escopo da v1) e **ADR 0005** (o selo `✓ᵃ` e a trava contra selos
  cunhados por fora).

### Alterado
- **Constituição 1.3.0**: o selo `✓ᵃ` (resumo lido no original) entra no alfabeto,
  com regra de uso e a declaração do que ele **proíbe** afirmar.
- **Gate do Princípio X no build**: capítulo de método em `essencial` sem a seção
  histórica **não compila**; e o alfabeto de selos é **lido da constituição**,
  falhando em qualquer símbolo desconhecido ou legenda própria. A versão anterior
  dava *falso verde* — bastava uma linha casar.
- **Esqueleto de capítulo v4 → v5.**

### Corrigido — achados da auditoria adversarial
- **O nível de maturidade não chegava ao leitor.** A constituição exige que um
  capítulo `esqueleto` ou `essencial` declare isso "em destaque, no cabeçalho" —
  e durante toda a v1.0 ele ficou **invisível**: a linha vive no primeiro
  blockquote, que o motor remove para virar o selo de data. O gate conferia o
  Markdown, não a página. Agora o nível é um **selo colorido** no cabeçalho, com
  explicação no `title` do que ele garante e do que não garante — e há um gate
  que confere a **saída**, não a entrada. Achado na verificação final, olhando o
  site publicado. **Gate que confere a entrada não prova nada sobre a saída.**
- **Um prenome inventado** no capítulo 01 ("Selvin" Larson) — a nota de pesquisa
  nunca teve prenome. É o modo de falha que o Princípio X nomeia.
- **Duas seções históricas sem lastro** na fonte única (caps. 03 e 25): a pesquisa
  existia, o registro não. A 5ª passada entrou na nota com essa admissão.
- **Selo inflado** no cap. 08 (✓ onde a nota registra ⏳/❌), numa tabela que se
  contradizia a si mesma.
- **Três capítulos reivindicando "o maior intervalo do livro"** — com o cap. 10 se
  refutando na própria frase.
- **Erro factual**: células simples/complexas atribuídas ao artigo de 1959, quando
  a literatura as associa ao de 1962.
- **Registro misturado** no cap. 04: a origem da ROC narrada como fato com a
  tabela marcando tudo ⏳.

### Dívidas declaradas
- **D8** e **D9** — **pagas**.
- **D10** (nova): fonte selada `✓ᵐ` sustentando afirmação sobre o que a obra
  argumenta por dentro. Paga-se **lendo as fontes**, não com hedge no texto.
- **D6** — o capítulo 16 saiu do bloqueio: no nível `essencial` não há cota de mídia.

### Adicionado — **constituição 1.2.0**
- **Princípio X — "Nenhum método cai do céu"** (não-negociável). Todo capítulo de
  método traz a seção **"De onde isto veio"**: o aperto · o que se fazia antes ·
  a virada · **a ideia reaproveitável** · o nome. Portão do nível `essencial`.
- **Selos de proveniência** por afirmação histórica: ✓ (fonte lida) · ✓ᵐ (só
  metadados) · ⏳ (atribuição corrente) · ❌ (procurei e não achei) · 📖 (leitura
  editorial). Conferir um DOI dá **✓ᵐ**, nunca ✓.
- **Esqueleto de capítulo v4 → v5**, com a seção histórica entre "o problema" e
  os fundamentos. Guia Editorial §2.4 traz o operacional; o template de PR cobra.
- **`AGENTS.md`** — link simbólico para `CLAUDE.md`, para agentes que procuram esse
  nome. Um arquivo só, para não haver duas verdades que divergem.
- **Dívidas D8 e D9** e o ciclo **C8** (sessão de pesquisa histórica + retrofit):
  a emenda deixa 8 capítulos com corpo devendo a seção e 20 sem nível declarado.
  Registrado em vez de silenciado — nenhum sobe de nível sem pagar.

### Adicionado
- **Capítulo 18 — histórico com as fontes reais.** Linha do tempo 1943–1986 com DOI
  ou link verificável em cada marco (McCulloch & Pitts, Hebb, Rosenblatt, Minsky &
  Papert, Linnainmaa, Werbos, Fukushima, Rumelhart–Hinton–Williams).
- **Diagrama do neurônio de McCulloch–Pitts** (`publicar/tema/neuronio-mp.svg`):
  entradas → pesos → soma → limiar → saída, com tema claro/escuro e `aria-label`.
- **Nota "quando a IA ainda não se chamava assim"**: o relatório de Turing de 1948,
  o artigo na *Mind* de 1950 (o teste), e a proposta de Dartmouth de 1955 que cunhou
  o termo *artificial intelligence*.
- **Nota sobre a prioridade do backpropagation**: Linnainmaa (1970), Werbos (1974),
  Fukushima (1979) e o que Rumelhart *et al.* (1986) de fato acrescentaram.
- **Código Python para baixar e rodar** (`ml-zero/etapa-18/`): `neuronio.py` com
  `NeuronioMP` (sem `fit`, de propósito) e `Perceptron` com a regra de Rosenblatt,
  mais `neuronio_mp.ipynb` pronto para o Colab — inclui a varredura de força bruta
  que fecha o XOR em 3 de 4.
- **Blueprint de deploy do backend** (`render.yaml` + `chat-companion/DEPLOY.md`):
  aplicação em um clique, segredos com `sync: false` (nunca versionados).

### Corrigido
- **A matemática não renderizava.** O motor não tinha renderizador nenhum: todo
  `$$...$$` saía como LaTeX cru na tela, em **quatro** capítulos (05, 06, 07 e 18)
  — 21 fórmulas em destaque e dezenas em linha. Agora o build converte para SVG
  com MathJax, **em tempo de compilação**: nenhum JS, nenhuma fonte e nenhuma
  requisição para o leitor, e imprime bem. O SVG desenha em `currentColor`, então
  o tema escuro sai de graça.
- **Acento dentro de fórmula quebrava a palavra.** As fontes TeX não têm glifos
  acentuados: `\text{saída}` saía como "saí da". A fórmula do capítulo 18 foi
  reescrita sem acentos (e passou a usar `y`, a notação do diagrama), e o build
  agora **falha** se alguém reintroduzir o problema.
- **A página inteira rolava na horizontal no celular** (capítulo 18): a tabela do
  histórico alargava a coluna do grid em vez de rolar sozinha. Faltava
  `min-width: 0` no item de grid. Verificado a 390 px em seis páginas.
- **Espaço solto antes da pontuação** depois de fórmula em linha ("escolher os
  *w* . O critério") — 5 ocorrências, do HTML indentado que o plugin gera.

### Alterado
- Subtítulo do livro passa a declarar que ele é **vivo e evolutivo**.
- **Páginas com matemática ficaram ~33% menores.** O plugin embutia uma cópia
  inteira da folha do MathJax a cada fórmula (43 KB dos 130 KB do capítulo 05,
  idênticos byte a byte). A folha passa a ser um arquivo só, em
  `assets/matematica.css`, buscado uma vez e reaproveitado. Capítulo 05: 132 KB → 88 KB.

## [0.5.0] — 2026-08-08

### Alterado — **mudança de escopo**
- O livro passa de "Machine Learning" a **"Ciência de Dados e Aprendizado de Máquina"**,
  para servir a três disciplinas de Engenharia de Software: Ciência de Dados
  (pré-requisito), Análise Preditiva e Aprendizagem de Máquina.
- Estrutura de 18 para **28 capítulos**, em cinco partes.
- O número do capítulo passa a ser **identificador estável**, não ordem de leitura.
  A ordem vive nas trilhas. Alternativa descartada: renumerar tudo — quebraria os
  ids dos 31 exercícios, que embutem o número do capítulo.
- **Constituição 1.1.0**: níveis de maturidade (`esqueleto`/`essencial`/`completo`),
  laboratório aceito como mídia obrigatória, portão de exercícios valendo na
  promoção a `completo`.

### Adicionado
- **Laboratórios interativos** — terceira superfície do livro, ao lado de exercício
  e vídeo. Bloco `:::lab` no motor, runtime em `publicar/tema/laboratorios.js`.
  Rodam no navegador: funcionam mesmo com o backend fora do ar.
- **Widget `neuronio-mp`**: pesos e limiar ajustáveis, reta de decisão desenhada
  em tempo real sobre a tabela-verdade, veredito por linha. O XOR trava em 3 de 4
  e explica por quê.
- **Capítulo 18 — O Neurônio Artificial** (nível `essencial`): 4 exercícios e 1
  laboratório. McCulloch & Pitts (1943) conferido e ✓.
- **Três trilhas de disciplina**, mapeadas unidade a unidade das ementas.
- **Nove capítulos-esqueleto** cobrindo o que faltava: 19–27.

## [0.4.0] — 2026-08-05

### Adicionado
- **Capítulo 05 — Modelos Lineares** (3 exercícios, 1 vídeo) e **Capítulo 06 —
  Otimização e Regularização** (4 exercícios, 1 vídeo).
- **Etapa 05–06 do `ml-zero`**: `Padronizador`, `RegressaoLinear` (equações normais
  por eliminação de Gauss **e** gradiente), `RegressaoLogistica` (L1/L2, razão de
  chances) e `descida_de_gradiente` isolado do modelo. 22 testes.

### Corrigido
- `Historico.divergiu()` olhava apenas a última época e perdia a explosão que
  acontecia no meio do treino — com taxa alta a perda oscila e pode terminar
  num vale por acaso.
- Early stopping não disparava: sem limiar mínimo de melhora, 4e-10 por época
  contava como progresso. Adicionado `min_delta`.
- Early stopping monitorava a perda de **treino**. Com dados separáveis essa
  perda cai indefinidamente e o critério nunca dispara — e mesmo disparando
  mediria memória. Adicionado `monitorar`, para observar a validação.

### Alterado
- **NumPy adiado** da etapa 05 para a 09. Biblioteca padrão bastou; adicionar
  dependência sem que o algoritmo exija é estrutura antecipada (regra 2 da
  construção). Registrado no docstring da etapa e no plano da spec 004.

## [0.3.0] — 2026-08-05

### Adicionado
- **Capítulo 07 — Árvores e Ensembles**, com 5 exercícios e 1 vídeo.
- **Etapa 07 do `ml-zero`**: `Arvore`, `Floresta`, `Boosting`, `auc` por postos e um
  gerador tabular com as três características que Grinsztajn et al. identificam no
  tabular real. Mais `linear.py` como régua declarada. 21 testes.
- `estudos/2026-08-05-teto-de-bayes-do-dado-da-etapa-00.md`: a medição que justificou
  a etapa 07 gerar o próprio dado em vez de reusar o da etapa 00.
- Breiman (2001) e Grinsztajn et al. (2022) conferidos e promovidos a ✓.
- Cláusula de expiração E3 no placar, com gatilho de revisão operacional.

## [0.2.0] — 2026-08-05

### Adicionado
- **Capítulo 02 — Dados**, no esqueleto v4, com 4 exercícios e 1 vídeo: as três fontes
  de vazamento, divisão por tempo e por grupo, ficha de dataset e viés de seleção.
- **Etapa 02 do `ml-zero`**: `detectar_vazamento_obvio` (dois sinais independentes),
  `dividir_por_grupo`, `dividir_por_tempo` com intervalo de guarda, `checar_duplicatas`,
  `vazou_entre` e `FichaDeDataset` — a ficha é um portão que levanta, não um documento
  que alguém promete escrever. 28 testes.
- `ml-zero/tests/conftest.py`: carregador de módulos por etapa. Etapas autocontidas têm
  arquivos homônimos (`dados.py` na 00 e na 02) e `sys.path` cru fazia a primeira
  importação vencer, silenciosamente.
- Gebru et al. (2021), *Datasheets for Datasets*, conferido na fonte e promovido a ✓.

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
