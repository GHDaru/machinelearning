# IV.1 — Aprendizado Não Supervisionado

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar por que avaliar agrupamento é qualitativamente mais difícil que avaliar classificação.
- **O2.** Aplicar k-means e reconhecer as premissas geométricas que ele impõe.
- **O3.** Usar PCA para redução de dimensionalidade e dizer o que se perde.
- **O4.** Escolher o número de grupos com um critério declarado, e não pelo gráfico que ficou bonito.

## O problema: não há erro a minimizar

Todos os capítulos anteriores tinham um gabarito: havia um alvo, havia um erro, e o erro dizia se você estava melhorando. Aqui não há nada disso. Sem rótulo, **não existe erro a minimizar** — existe um critério a *inventar*. Você decide o que significa "grupo bom", e só então há o que otimizar. A escolha não vem dos dados: vem de você.

A consequência é desconfortável. Quase sempre é possível encontrar grupos: rode k-means com k=4 em ruído puro e ele devolve quatro grupos, com fronteiras nítidas e centros bem definidos. O algoritmo nunca diz "não há estrutura aqui". A pergunta honesta, portanto, nunca é *"existem grupos?"* — é **"estes grupos significam alguma coisa fora deste conjunto de dados?"**. O erro que este capítulo previne é o mais barato de cometer em toda a análise de dados: **olhar para os grupos, achar que fazem sentido, e apresentar isso como descoberta.**

:::exercicio {"id":"nao-supervisionado-e5","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Qual é a pergunta honesta a fazer diante de um resultado de agrupamento?

- [ ] Existem grupos nestes dados?
- [x] Estes grupos significam alguma coisa fora deste conjunto de dados?
- [ ] Qual é o valor de k que minimiza a inércia?
- [ ] Os grupos encontrados são interpretáveis pela equipe?

> **gabarito:** os grupos significam algo fora deste conjunto
> **porque:** "Existem grupos?" é uma pergunta que o algoritmo sempre responde que sim. Rode k-means com k=4 em ruído puro e ele devolve quatro grupos, com fronteiras nítidas e centros bem definidos. Ele nunca diz "não há estrutura aqui".
>
> A terceira alternativa tem resposta trivial e inútil: a inércia sempre cai com k maior, e é minimizada quando cada ponto é seu próprio grupo.
>
> A quarta é a mais perigosa porque parece rigor e é o erro que o capítulo previne. Você reconhece histórias em grupos aleatórios com uma facilidade constrangedora, e interpretabilidade é justamente a evidência que o ruído também produz.
> **volte para:** #o-problema-nao-ha-erro-a-minimizar
:::

:::exercicio {"id":"nao-supervisionado-e6","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Por que avaliar agrupamento é qualitativamente mais difícil que avaliar classificação?

- [ ] Porque as métricas de agrupamento são matematicamente mais complexas.
- [x] Porque as métricas disponíveis são internas: calculadas sobre os mesmos dados, com a mesma noção de distância que produziu os grupos, então elas medem coerência com o critério e não verdade.
- [ ] Porque agrupamento exige mais dados que classificação.
- [ ] Porque não existe nenhuma forma de validar um agrupamento.

> **gabarito:** as métricas são internas e medem coerência com o próprio critério
> **porque:** Na classificação a validação é **externa**: existe uma resposta certa que você não usou para treinar, e ela pode desmentir você. No agrupamento, silhueta e inércia usam a mesma distância que gerou a partição — silhueta alta com grupos esféricos não é confirmação independente, é o critério se elogiando.
>
> A quarta alternativa desiste cedo demais e o capítulo mostra a saída: os grupos se mantêm numa amostra separada, e eles predizem alguma variável que **não** entrou no agrupamento. Um critério externo vale mais que cotovelo e silhueta somados, porque é o único que pode dar errado.
>
> A dificuldade, portanto, não é de complexidade matemática. É de **falseabilidade**: métrica que não pode discordar de você não está avaliando nada.
> **volte para:** #validar-sem-gabarito
:::

## De onde isto veio

**O aperto.** O detalhe que reorganiza tudo: os problemas originais **não eram "clustering"**. Eram quatro apertos em quatro campos que não conversavam entre si: amostragem estratificada (como dividir uma população em estratos para amostrar melhor), momento de inércia de um sólido (como partir um corpo heterogêneo), compressão de voz (como representar um sinal com poucos níveis) e taxonomia biológica (como classificar organismos). O mesmo procedimento foi inventado quatro vezes porque quatro pessoas tinham problemas diferentes com a mesma forma matemática.

**O que se fazia antes.** Classificar por julgamento do especialista. Na biologia, isso tinha nome: a classificação valia pela **autoridade do taxonomista** que a assinava.

**A virada.** Fixar um critério explícito de homogeneidade e **alternar duas minimizações parciais** — cada uma trivial quando a outra está congelada. Dados os centros, atribuir cada ponto ao mais próximo é imediato; dadas as atribuições, recalcular o melhor centro é uma média. O problema conjunto é duro; os dois parciais são fáceis.

**A ideia reaproveitável.** **Quando o problema conjunto é intratável, congele metade e resolva a outra — depois inverta.** Bock mostra que o k-means é um caso de *otimização alternada*, e essa mesma forma reaparece em EM, fuzzy c-means e k-medoids. **Não é um algoritmo, é um padrão** — e você vai reconhecê-lo em qualquer lugar onde duas incógnitas se determinam mutuamente.

**O nome.** "k-means" foi cunhado por **MacQueen (1967)** — para um algoritmo **diferente** do que hoje leva o nome: o sequencial de passagem única, não o *batch* que todo mundo roda.

### Seis pretendentes, e quem levou o nome

| Ano | Quem | O que fez |
|---|---|---|
| 1950/51 | **Dalenius** | A primeira formulação do problema, em amostragem estratificada — anterior a todos os que se costuma citar |
| 1956 | **Steinhaus** | Primeiro a propor o k-means multidimensional (versão contínua), por motivação **mecânica**: partir um sólido heterogêneo minimizando momentos de inércia. Publicado em francês |
| 1957 | **Lloyd** | Critério contínuo em **uma** dimensão, quantização de voz nos Bell Labs. Publicado só em **1982** — 25 anos depois |
| 1962 | **Sebestyen** | Já propusera o mesmo procedimento que MacQueen apresentaria cinco anos depois |
| 1965 | **Forgy** | Primeiro a propor o k-means discreto. Bock registra que **o resumo da palestra não menciona explicitamente o algoritmo**: o conteúdo é conhecido apenas por descrição de terceiros |
| 1967 | **MacQueen** | Cunha o nome — para outro algoritmo |

**A leitura deste livro.** Os capítulos [II.2](ii-2-modelos-lineares.md) (Gauss × Legendre) e [III.1](iii-1-neuronio-artificial.md) (Linnainmaa × Rumelhart) contam a mesma história com **dois** pretendentes. Aqui há seis, em quatro campos isolados, e o nome vencedor foi cunhado para um algoritmo diferente. Os três casos, juntos, fecham a tríade e dizem o que nenhum diz sozinho: **não vence quem descobre, nem quem publica primeiro, nem sequer quem descreve o método que virou padrão. Vence quem escreve a palavra que pega.**

Do lado hierárquico, o aperto era político-científico. **Sokal & Sneath**, em *Principles of Numerical Taxonomy* (1963), motivaram a pesquisa mundial em clustering, no registro de Bock. O que eles propunham está resumido pelo próprio Sokal: classificar a partir de "a large number of equally weighted characters, unaffected by subjective or phylogenetic judgments", com algoritmos de agrupamento aplicados a matrizes de similaridade. O objetivo não era achar grupos: era **tirar da autoridade o direito de defini-los**.

A origem do programa é bem mais prosaica que o programa. Sokal conta que num almoço de laboratório em Kansas, em 1953, fez a "brash claim" de que classificaria organismos melhor por meios estatísticos do que pela "traditional subjective approach"; Earl A. Bell apostou uma caixa de seis cervejas que não daria certo, e Charles D. Michener forneceu os dados de um grupo de abelhas. E há uma linha do mesmo texto que fecha com a tríade acima. Ao explicar por que o livro é tão citado, Sokal escreve: "in fact, we coined the name 'numerical taxonomy'."

Do lado da redução de dimensionalidade, dois problemas diferentes, 32 anos, a mesma decomposição: Pearson (1901) chegou por geometria, com a reta ou o plano de melhor ajuste a uma nuvem de pontos; Hotelling (1933) chegou por álgebra, com motivação psicométrica, e é dele o nome "componentes principais".

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Toda a cadeia do k-means — Dalenius, Steinhaus, Lloyd, Forgy, Sebestyen, MacQueen, o nome cunhado para outro algoritmo, o resumo de Forgy sem o algoritmo, e a leitura de k-means como otimização alternada — de Bock, *"Origins and extensions of the k-means algorithm"* (JEHPS, 2008), **lido por inteiro** |
| ✓ | Que Sokal & Sneath (1963) motivaram a pesquisa mundial em clustering: é afirmação de Bock, na mesma fonte acima |
| ✓ | O programa da taxonomia numérica, a aposta de 1953 e o "we coined the name", de Sokal, *"This Week's Citation Classic"* sobre *Principles of Numerical Taxonomy*, [Current Contents (15 de setembro de 1982)](https://garfield.library.upenn.edu/classics1982/A1982PJ14400001.pdf), lido por inteiro. **O livro de 1963 em si não foi aberto**: o que dele aparece aqui vem desse comentário do autor |
| ✓ᵐ | A publicação tardia de Lloyd (1957 → 1982) |
| ✓ᵐ | Pearson (1901) e Hotelling (1933) como as duas formulações de componentes principais, e o nome vindo de Hotelling |
| ✓ | Que antes disso se classificava por julgamento do especialista: é assim que Sokal descreve o que havia, como "the traditional subjective approach". **É a caracterização de quem estava atacando essa prática**, não a de um observador neutro |
| 📖 | A tríade com os capítulos II.2 e III.1, e a leitura de que vence quem escreve a palavra que pega |

## Fundamentos: inventar o critério, depois alternar

O k-means declara o critério antes de tudo: **a soma das distâncias quadradas de cada ponto ao centro do seu grupo** (a *inércia*). Grupo bom = grupo compacto. Escolhido isso, o algoritmo é a alternância descrita acima — sorteie k centros, atribua, recalcule, repita até parar de mudar. Três consequências que ninguém avisa:

**Ele sempre converge, e quase nunca para o ótimo.** A inércia cai a cada passo, então o algoritmo para — num mínimo **local**, que depende do sorteio inicial. Rodar de novo com outra semente pode dar outra resposta; por isso as bibliotecas rodam várias inicializações e ficam com a melhor. Duas partições diferentes do mesmo dado não são bug: são a natureza do método.

**Ele só enxerga grupos esféricos e de tamanho parecido.** Isso está no *critério*, não no código. Minimizar distância quadrada ao centro premia bolas compactas; um grupo alongado será cortado ao meio, e um grupo grande será dividido para "pagar" a fusão de dois pequenos. Nenhum valor de k conserta isso.

**Distância depende de escala.** Uma coluna em reais e outra em anos não são comparáveis: quem tem números maiores domina a distância e decide os grupos sozinha. **Normalizar não é higiene, é parte da definição do critério** — ver [capítulo I.6](i-6-representacao.md).

### Quando você não quer fixar k: o dendrograma

O agrupamento hierárquico inverte a pergunta. Em vez de escolher k antes, ele constrói **toda** a hierarquia: começa com cada ponto sozinho e funde os dois grupos mais próximos, até sobrar um. O resultado é o **dendrograma** — uma árvore em que a altura de cada fusão é a distância em que ela ocorreu. Você decide o k **depois**, cortando a árvore na altura que quiser, e vê a estrutura em todas as escalas ao mesmo tempo.

O preço: a fusão é irreversível (um erro no início se propaga até o fim) e o custo cresce rápido com o número de pontos. E há uma escolha escondida que muda tudo — o que significa "distância entre dois **grupos**": o par mais próximo, o mais distante, a média. Trocar essa definição troca a árvore.

### PCA: variância como critério, e o que se perde

A análise de componentes principais (PCA) resolve o problema de Pearson: achar as direções em que os dados mais variam e reescrevê-los nelas, em ordem. Ficar com as primeiras é reduzir a dimensionalidade — menos colunas, quase a mesma dispersão.

O que se perde tem três nomes. Variância, e você sabe quanto: é o número que a biblioteca informa. Interpretabilidade, porque cada componente é uma mistura de todas as variáveis originais, e "0,4 × renda − 0,3 × idade + …" não é um conceito que se leve a uma reunião. E o mais traiçoeiro: **variância não é o mesmo que informação útil**. A direção que mais varia pode ser justamente a que menos separa o que importa; PCA não sabe qual é o seu problema, porque ninguém contou a ele. PCA é uma decisão de **representação**, e vale para ela tudo o que o [capítulo I.6](i-6-representacao.md) diz — inclusive a sensibilidade à escala.

:::exercicio {"id":"nao-supervisionado-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Seus dados têm dois grupos visíveis: um alongado, em forma de arco, com 800 pontos, e outro pequeno e denso, com 60 pontos. Você roda k-means com k=2 e o resultado corta o arco ao meio, juntando uma das metades ao grupo pequeno. Qual é o diagnóstico correto?

- [ ] O algoritmo convergiu para um mínimo local; basta rodar com mais inicializações.
- [ ] O k está errado; com k=3 ou k=4 o arco é recuperado corretamente.
- [x] A limitação está no critério: minimizar distância ao centro premia grupos esféricos e de tamanho parecido, então nenhuma inicialização ou k conserta a partição.
- [ ] Os dados precisam ser normalizados antes; a escala é a causa do corte.

> **gabarito:** A limitação está no critério, não na execução
> **porque:** A inércia, que é a soma das distâncias quadradas ao centro, é minimizada por **bolas compactas**. Um arco tem pontos longe do próprio centro, então cortá-lo ao meio de fato **reduz** a inércia: o algoritmo não falhou, ele acertou o alvo errado.
>
> As três alternativas erradas confundem execução com critério. Mais inicializações encontram mínimos locais melhores **do mesmo critério**, e o critério é o problema. Mais grupos fatiam o arco em pedaços mais esféricos, o que pode "funcionar" visualmente, mas aí você deixou de recuperar a estrutura e passou a aproximá-la por pedaços. E normalizar corrige distorção de **unidades**; aqui as unidades podem estar perfeitas e o resultado ser o mesmo, porque o problema é a **forma**. A saída real é trocar de critério, indo para densidade, ou hierárquico com a ligação adequada — e não afinar o k-means.
> **volte para:** #fundamentos-inventar-o-criterio-depois-alternar
:::

:::lab {"id":"nao-supervisionado-l1","tipo":"anima-kmeans","titulo":"Atribuir e recentrar, e a semente que decide o resultado","semente":5,"semente_ruim":29}
O método são **dois movimentos alternando**, e a animação os separa de propósito: atribuir cada ponto ao centro mais próximo, depois recolocar cada centro na média dos seus pontos. As cruzes são os centros — elas não são pontos do dado, e confundir as duas coisas é o mal-entendido mais comum aqui.

Os três grupos foram desenhados bem separados, então não há ambiguidade no dado. Assista a inércia cair em degraus até estabilizar em **2,243**, na quarta iteração.

Agora clique em **"E se a semente for outra?"**. Mesmo dado, mesmo algoritmo, mesmo k, mesmo critério, e só os centros iniciais mudam. A execução estabiliza em **24,159**, dez vezes pior, e o desenho mostra o que aconteceu: dois grupos verdadeiros foram fundidos num só, e o terceiro foi partido ao meio para pagar a conta.

Não há erro em lugar nenhum. O método está correto, a implementação está correta, a execução está correta, e a resposta está errada — porque a inércia cai a cada passo e o algoritmo para no primeiro mínimo **local** que encontrar.

Duas leituras que valem mais que a animação. A primeira: é por isso que as bibliotecas rodam várias inicializações e ficam com a melhor, e é por isso que rodar uma vez só é uma decisão, não um padrão inofensivo. A segunda é mais desconfortável — aqui o estrago é escandaloso, dez vezes na inércia, e qualquer comparação o pegaria. O caso perigoso é o outro: quando a partição infeliz sai só um pouco pior, parece plausível, e ninguém tem com o que compará-la.
:::

:::exercicio {"id":"nao-supervisionado-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Na animação acima, duas execuções sobre o **mesmo dado** estabilizam em inércias muito diferentes. O que mudou?

- [ ] O valor de k.
- [x] Apenas os centros iniciais sorteados, e o algoritmo parou no primeiro mínimo local que encontrou.
- [ ] A normalização dos atributos.
- [ ] O critério que estava sendo minimizado.

> **gabarito:** apenas os centros iniciais
> **porque:** Dado, algoritmo, k e critério são idênticos nas duas execuções. A única variável é de onde a alternância partiu, e a inércia cai a cada passo até parar — num mínimo **local**, que depende do sorteio.
>
> É por isso que as bibliotecas rodam várias inicializações e ficam com a melhor. Duas partições diferentes do mesmo dado não são bug: são a natureza do método.
>
> Repare no que isso tem em comum com a animação do [capítulo III.2](../capitulos/iii-2-redes-neurais.md): método correto, execução correta, resposta errada, e só a semente mudou. São problemas diferentes com a mesma forma.
> **volte para:** #fundamentos-inventar-o-criterio-depois-alternar
:::

:::exercicio {"id":"nao-supervisionado-e8","tipo":"multipla-multi","objetivo":"O2","dificuldade":"dificil"}
Quais premissas o k-means impõe **pelo critério**, e não pelo código? (marque todas que valem)

- [x] Que os grupos são aproximadamente esféricos.
- [x] Que os grupos têm tamanhos parecidos.
- [x] Que as escalas dos atributos são comparáveis, porque a distância soma unidades.
- [ ] Que o número de grupos é conhecido de antemão pelos dados.

> **gabarito:** esféricos · tamanhos parecidos · escalas comparáveis
> **porque:** As três estão embutidas em "minimizar a soma das distâncias quadradas ao centro". Bolas compactas minimizam essa soma; um grupo alongado será cortado, e um grupo grande será dividido para pagar a fusão de dois pequenos. E distância soma unidades, então a coluna de números maiores decide os grupos sozinha — normalizar não é higiene, é parte da definição do critério.
>
> A alternativa errada descreve uma exigência **do uso**, não do critério. Você precisa fornecer k, e nada nos dados o informa: é justamente por isso que a escolha de k é um objetivo separado deste capítulo.
>
> A distinção entre critério e código é o que torna essas premissas incontornáveis. Nenhuma inicialização melhor e nenhum valor de k conserta a forma que o critério premia.
> **volte para:** #fundamentos-inventar-o-criterio-depois-alternar
:::

## Regras de associação — e a lenda que quebrou

Regras de associação nasceram de um aperto comercial concreto: o que os itens de uma cesta de compras dizem uns sobre os outros (**Agrawal, Imieliński & Swami**, SIGMOD 1993; o algoritmo **Apriori** vem no ano seguinte, com Agrawal & Srikant, VLDB 1994). Uma regra `{A} → {B}` tem três números, e o terceiro é o que importa:

- **suporte** — em que fração das cestas A e B aparecem juntos. Mede se a regra é frequente o bastante para ligar.
- **confiança** — entre as cestas que têm A, em quantas aparece B. Parece a métrica principal. Não é.
- **lift** — a confiança **dividida** pela frequência de B em geral. Responde a pergunta certa: *ter A muda a chance de ter B?* Lift 1 significa **nenhuma relação**.

A armadilha é confiança alta com lift 1. Se 60% de todas as cestas têm pão, uma regra `{leite} → {pão}` com 60% de confiança parece forte e não descobriu nada: pão está em 60% das cestas *de qualquer maneira*. Confiança alta mede a **popularidade de B**, não a relação entre os dois. É a versão de mercearia da linha de base do [capítulo II.1](ii-1-avaliacao.md).

### Cerveja e fraldas: verdadeira até a descoberta, inventada a partir da ação

Todo curso conta esta história. Vale separar o que se sustenta do que não se sustenta, e a fratura está num ponto exato. **O estudo existe.** Em 1992, Thomas Blischok, que dirigia um grupo de consultoria de varejo na Teradata (divisão da NCR), analisou com a equipe as cestas da Osco Drug. Ele descreve o material nas próprias palavras: "We took over 1.2 million market baskets [...] And these represented transactions from about 25 stores." **A correlação foi achada**, e também está na fala dele: "we did discover that between 5:00 and 7:00 p.m. that consumers bought beer and diapers."

**A parte que todo mundo ensina é falsa.** "Puseram a cerveja ao lado das fraldas e as vendas subiram": isto não aconteceu. Quem nega é o próprio Blischok, na mesma fala: "in reality they never did anything with beer and diapers relationships." Power fecha a apuração dizendo que os gerentes da Osco "did NOT exploit the beer and diapers relationship by moving the products closer together on the shelves". A lenda nasceu no discurso de vendas. John Earle, que diz ter trabalhado na Teradata e nesse projeto, registra que Blischok, ao falar com prospects e com a imprensa, "didn't distinguish between the actual affinities tested and our hypotheses", e acrescenta a frase que explica o mecanismo: "Our job was to sell the value of systems. Sometimes in selling, fact blurred with folklore."

**E a cadeia de evidência é mais frouxa do que a história merecia.** Vale olhar como esses fatos chegaram até aqui, porque o próprio Power abre a última seção da apuração com "Does everyone agree with the above account? YES and NO!". Três coisas que o texto dele deixa explícitas e que quase nunca são repetidas junto com os números:

- **Power não entrevistou ninguém.** Ele não pôde assistir ao evento ao vivo, viu a gravação de um webcast de 31 de julho de 2002 e recebeu a transcrição por e-mail da moderadora, Holly Michael, da Teradata.
- **O webcast era da empresa que fez o estudo**, celebrando os dez anos da própria lenda. A versão canônica do "fato" chega por uma peça de comunicação da parte interessada.
- **A descoberta em si é contestada.** Tom Fawcett, relatando em terceira mão, sustenta que Blischok inventou o exemplo e que ele "was never supported in any data that they analyzed". Ronny Kohavi diz ter chegado à pessoa que rodou as consultas (K. Heath, self joins em SQL, 1990, "50 stores over a day period") e registra que ela **não achava o padrão significativo**. Esses números não batem com os de Blischok: 50 lojas em um dia contra 1,2 milhão de cestas de cerca de 25 lojas.

Não conserte a lenda: **olhe para a fratura**. Ela é o exemplo mais barato de três coisas que o mercado trata como uma só — **correlação achada ≠ decisão tomada ≠ efeito medido**. O estudo, tal como Blischok o conta, produziu a primeira; a segunda nunca ocorreu; a terceira, portanto, não existe — e é justamente ela que todo mundo repete como resultado. É o mesmo padrão do [capítulo II.6](ii-6-analise-multidimensional.md), onde a categoria "OLAP" também foi fabricada pelo marketing: a técnica era boa, a embalagem é que não se sustenta.

| Selo | Afirmação |
|---|---|
| ✓ | A apuração de Power, *"Ask Dan! — What is the 'true story' about data mining, beer and diapers?"*, DSS News vol. 3 nº 23, 10 de novembro de 2002, [DSSResources](https://dssresources.com/newsletters/66.php), **lida por inteiro**. Todas as aspas desta seção saíram dela |
| ✓ | Que as falas de Blischok (1,2 milhão de cestas, cerca de 25 lojas, a janela das 17h–19h, o "never did anything") chegam a Power pela transcrição de um webcast da Teradata de 31/07/2002, enviada por e-mail pela moderadora. **Power não entrevistou Blischok**, e a edição anterior deste capítulo dizia que sim |
| ✓ | Que Power registra as objeções de Fawcett e de Kohavi, e que os números atribuídos a Kohavi (50 lojas, um dia, 1990) não batem com os de Blischok |
| ⏳ | Os fatos em si (ano, empresas, volume de cestas, janela das 17h–19h, e o rearranjo de gôndola que **não aconteceu**), que só temos pelo relato dos envolvidos. `❌` seria dizer que não achamos fonte; aqui há fonte, e ela nega. A distinção importa: **não é o mesmo desconhecer e ter apurado que não** |
| ✓ᵐ | Agrawal, Imieliński & Swami (SIGMOD 1993) e Apriori (Agrawal & Srikant, VLDB 1994) |

:::exercicio {"id":"nao-supervisionado-e2","tipo":"numerica","objetivo":"O1","dificuldade":"media"}
De 1 000 cestas de um supermercado: 600 contêm pão, 500 contêm leite e 300 contêm os dois.

Calcule o **lift** da regra `{leite} → {pão}`. Responda com duas casas decimais.

> **gabarito:** 1.00 ± 0.01
> **porque:** A confiança é `300 / 500 = 0,60` — parece uma regra forte. Mas o suporte de pão sozinho é `600 / 1000 = 0,60`, e o lift é `0,60 / 0,60 = 1,00`: **exatamente nenhuma relação**.
>
> É a armadilha inteira num número. Saber que alguém levou leite **não muda em nada** a chance de ter levado pão: uma regra com confiança alta e lift 1 é uma descoberta sobre o item mais vendido da loja, disfarçada de descoberta sobre a relação entre dois itens. Guarde a leitura: lift > 1 é associação positiva, lift < 1 é associação **negativa** (um item afasta o outro — às vezes o achado mais útil), lift ≈ 1 é independência. E note que é o mesmo problema da seção anterior em outra roupa: sem gabarito, a métrica que parece óbvia é a errada, e vale a que se compara com uma **linha de base**.
> **volte para:** #regras-de-associacao-e-a-lenda-que-quebrou
:::

:::exercicio {"id":"nao-supervisionado-e9","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Qual critério a PCA usa para escolher as direções?

- [x] A variância: ela acha as direções em que os dados mais variam e os reescreve nelas, em ordem.
- [ ] A correlação com a variável alvo.
- [ ] A interpretabilidade das variáveis originais.
- [ ] A separação entre as classes conhecidas.

> **gabarito:** a variância
> **porque:** É a resposta ao problema de Pearson, e ela é puramente sobre a dispersão dos dados. Ficar com as primeiras componentes é reduzir a dimensionalidade com quase a mesma dispersão.
>
> As duas alternativas que citam alvo e classes descrevem métodos supervisionados, e é exatamente o que a PCA **não** é. Ela não sabe qual é o seu problema, porque ninguém contou a ele.
>
> Daí a consequência mais traiçoeira: variância não é o mesmo que informação útil. A direção que mais varia pode ser justamente a que menos separa o que importa.
> **volte para:** #pca-variancia-como-criterio-e-o-que-se-perde
:::

:::exercicio {"id":"nao-supervisionado-e10","tipo":"multipla-multi","objetivo":"O3","dificuldade":"media"}
O que se perde ao reduzir dimensionalidade com PCA? (marque todas que valem)

- [x] Variância, e você sabe exatamente quanto, porque a biblioteca informa.
- [x] Interpretabilidade, porque cada componente é uma mistura de todas as variáveis originais.
- [x] Possivelmente a direção que separava o que importa, porque variância não é informação útil.
- [ ] A capacidade de voltar aos dados originais, que é irreversível por construção.

> **gabarito:** variância mensurável · interpretabilidade · possivelmente o que separava
> **porque:** As três perdas têm naturezas diferentes, e é isso que o item cobra. A primeira é **quantificada**: você sabe quanto ficou para trás. A segunda é qualitativa: "0,4 × renda − 0,3 × idade + …" não é um conceito que se leve a uma reunião. A terceira é a perigosa, porque é invisível na métrica que a própria PCA reporta.
>
> A alternativa errada afirma irreversibilidade absoluta. Descartar componentes de fato perde informação, e a transformação em si é linear e invertível — mantendo todas as componentes, você reconstrói os dados exatamente.
>
> Vale reter que PCA é uma decisão de **representação**, e vale para ela tudo o que o [capítulo I.6](i-6-representacao.md) diz, inclusive a sensibilidade à escala.
> **volte para:** #pca-variancia-como-criterio-e-o-que-se-perde
:::

## Validar sem gabarito

Aqui está a dificuldade que separa este capítulo de todos os anteriores. Na classificação, a validação é externa: existe uma resposta certa que você não usou para treinar. No agrupamento, os candidatos a métrica são **internos** — calculados sobre os mesmos dados, com a mesma noção de distância que produziu os grupos. Eles medem se a partição é coerente com o critério, não se ela é **verdadeira**. Duas ferramentas, e o que cada uma não faz:

**Silhueta.** Para cada ponto, compara a distância média aos vizinhos do próprio grupo com a distância média ao grupo mais próximo. Perto de 1, bem alocado; perto de 0, na fronteira; negativo, provavelmente no grupo errado. É útil e tem um limite duro: premia a mesma geometria compacta que o k-means persegue. Silhueta alta com clusters esféricos não é confirmação independente — é o critério se elogiando.

**Método do cotovelo.** Plote a inércia contra k e procure onde a curva "dobra". Funciona quando a dobra é óbvia; na maioria dos dados reais ela não é, e "o cotovelo é aqui" vira leitura pessoal do gráfico — que muda de analista para analista e, pior, muda depois de você já ter uma hipótese.

**E o alerta principal:** *"os clusters fazem sentido"* é a forma mais fácil de se enganar em análise de dados. Você reconhece histórias em grupos aleatórios com uma facilidade constrangedora — dê nomes a quatro grupos de ruído e o quarto vira "os clientes de alto potencial ainda não ativados". O antídoto é declarar o critério **antes** e testá-lo fora: os grupos se mantêm numa amostra separada? Eles predizem alguma variável que **não** entrou no agrupamento (churn, receita futura, retorno de campanha)? Um critério externo vale mais que cotovelo e silhueta somados, porque é o único que pode dar errado.

:::exercicio {"id":"nao-supervisionado-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"media"}
Uma analista segmenta 40 mil clientes com k-means. Ela testou k de 2 a 10, escolheu **k=5** porque "foi onde os grupos ficaram mais interpretáveis", nomeou os cinco segmentos, e a diretoria aprovou uma campanha diferente para cada um.

Escreva a crítica que você faria e o que proporia em seguida.

> **rubrica:** identifica que "mais interpretável" é um critério posterior e subjetivo, escolhido depois de ver o resultado;
> menciona que o k-means sempre devolve k grupos, inclusive sem estrutura real nos dados;
> aponta ao menos uma verificação de estabilidade (reamostrar/dividir os dados, trocar a semente, comparar partições);
> propõe ao menos um critério externo — uma variável que não entrou no agrupamento e que os grupos deveriam predizer;
> não se limita a sugerir "usar silhueta" como se isso resolvesse
> **porque:** A resposta fraca troca um critério interno por outro: "use silhueta em vez de interpretabilidade". Mas silhueta mede a mesma compacidade que o k-means otimizou — ela pode confirmar uma partição de puro ruído, porque nunca foi projetada para dizer se a estrutura existe.
>
> A resposta forte percebe **duas** coisas. Primeiro, que o critério foi escolhido depois de ver o resultado — o mesmo pecado do [capítulo II.8](ii-8-do-modelo-a-decisao.md), escolher a régua depois de conhecer os números, aqui agravado porque não há gabarito para desmentir ninguém. Segundo, que ninguém fez a pergunta decisiva: **os grupos sobrevivem fora deste conjunto de dados?** Divida a base, agrupe as duas metades separadamente e veja se as partições concordam; ou verifique se os segmentos predizem algo que não entrou no modelo. E há o teste que fecha o argumento, barato e humilhante: rode o mesmo procedimento em dados **embaralhados**. Se os cinco grupos continuarem nomeáveis, o que a analista descobriu foi a própria capacidade de contar histórias.
> **volte para:** #validar-sem-gabarito
:::

:::exercicio {"id":"nao-supervisionado-e11","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Por que a silhueta não serve como confirmação independente de uma partição do k-means?

- [ ] Porque ela só funciona com mais de dez grupos.
- [x] Porque ela premia a mesma geometria compacta que o k-means persegue: é o critério se elogiando.
- [ ] Porque ela exige rótulos verdadeiros para ser calculada.
- [ ] Porque ela é sensível à ordem dos pontos no conjunto.

> **gabarito:** ela premia a mesma geometria que o k-means persegue
> **porque:** Silhueta compara a distância média dentro do grupo com a distância ao grupo mais próximo, usando a **mesma noção de distância** que gerou a partição. Ela pode confirmar uma partição de puro ruído.
>
> A terceira alternativa inverte a natureza dela: silhueta é métrica **interna**, calculada sem gabarito, e é justamente por isso que ela está disponível aqui, e por isso que ela não decide.
>
> Independência exige informação que não participou da escolha. É o mesmo princípio do conjunto de teste do capítulo 0.2, aplicado onde não há rótulo: um critério externo é o único que pode dar errado.
> **volte para:** #validar-sem-gabarito
:::

:::exercicio {"id":"nao-supervisionado-e12","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Uma equipe precisa declarar um critério para escolher k. Quais procedimentos podem **discordar** dela? (marque todos que valem)

- [x] Dividir a base, agrupar as duas metades separadamente e comparar as partições.
- [x] Verificar se os segmentos predizem uma variável que não entrou no agrupamento.
- [x] Rodar o mesmo procedimento em dados embaralhados e ver se os grupos continuam nomeáveis.
- [ ] Escolher o k em que os grupos ficaram mais interpretáveis.
- [ ] Olhar o gráfico da inércia e apontar onde a curva dobra.

> **gabarito:** estabilidade entre metades · variável externa · teste em dados embaralhados
> **porque:** As três podem dar errado, e é isso que as torna evidência. Se as duas metades produzem partições incompatíveis, a estrutura não sobrevive fora daquele recorte. Se os grupos não predizem nada externo, eles não descreveram nada além de si mesmos.
>
> O terceiro é o mais barato e o mais humilhante: se os grupos continuam nomeáveis em ruído, o que a equipe descobriu foi a própria capacidade de contar histórias.
>
> As duas erradas não podem discordar de ninguém. Interpretabilidade é critério posterior e subjetivo, escolhido depois de ver o resultado — o mesmo pecado do [capítulo II.8](ii-8-do-modelo-a-decisao.md), agravado aqui porque não há gabarito para desmentir. E o cotovelo vira leitura pessoal do gráfico quando a dobra não é óbvia, que é a maioria dos dados reais.
> **volte para:** #validar-sem-gabarito
:::

## Síntese — o que levar

- Sem rótulo **não há erro a minimizar**: há um critério a inventar. Quem escolhe o critério decide o resultado, e a escolha não está nos dados.
- **O algoritmo nunca diz "não há grupos".** A pergunta é se os grupos existem fora deste conjunto de dados.
- **Congele metade, resolva a outra, inverta.** O k-means é um caso de otimização alternada — o padrão vale para EM, fuzzy c-means, k-medoids e para qualquer problema com duas incógnitas que se determinam mutuamente.
- k-means só enxerga grupos **esféricos e de tamanho parecido**, e isso está no critério, não no código. Nenhum k nem nenhuma semente conserta forma errada. E **distância depende de escala**: normalizar faz parte da definição do critério, não da faxina.
- PCA troca colunas por variância — e perde interpretabilidade e, às vezes, exatamente a direção que importava.
- Em regras de associação, **confiança alta sem lift alto é a popularidade do item disfarçada de descoberta**.
- Métricas internas (silhueta, cotovelo) medem coerência com o critério, não verdade. **Critério externo vale mais que as duas somadas**, porque é o único que pode dar errado.
- "Os clusters fazem sentido" não é evidência. Teste em dados embaralhados antes de acreditar em você mesmo.
- Da tríade 05–08–18: crédito não segue descoberta nem publicação. **Vence quem escreve a palavra que pega.**

:::exercicio {"id":"nao-supervisionado-e4","tipo":"aberta","objetivo":"O3","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Você reduziu 200 colunas a 10 componentes principais que retêm **95% da variância**, e o modelo seguinte **piorou**. Explique como isso é possível, se você "quase não perdeu informação".

> **rubrica:** identifica o que os 95% medem, ou seja, variância **das entradas**, calculada sem olhar o alvo uma única vez, e conclui que reter variância não é o mesmo que reter poder preditivo;
> descreve o mecanismo concreto: o sinal que importava para o alvo podia estar numa direção de variância pequena, e foi justamente ela que os 5% descartados levaram embora;
> aponta ao menos um agravante do procedimento — a dependência de escala, que faz colunas em unidades grandes dominarem os componentes, ou a perda de interpretabilidade, que impede diagnosticar qual atributo sumiu;
> não atribui a piora ao número de componentes: subir de 10 para 20 pode devolver o sinal por acaso, e continuar sem responder por que uma direção de variância baixa carregava o que importava
> **porque:** A frase "quase não perdi informação" é onde o erro mora, porque ela troca silenciosamente o significado de *informação*. O PCA maximiza variância das entradas; o modelo precisa de informação **sobre o alvo**. São grandezas diferentes, e nada garante que andem juntas.
>
> O caso limite deixa isso desconfortável: imagine uma coluna que varia pouquíssimo, um marcador raro que aparece em 2% dos casos, e que é o **único** preditor real do alvo. Ela contribui quase nada para a variância total, cai nos 5% descartados, e o relatório continua dizendo 95%. O número está certo; a conclusão que se tira dele é que estava errada.
>
> É o mesmo aviso do capítulo I.6 aparecendo do outro lado: **a representação decide o teto**. Aqui o teto não foi baixado por descuido, mas por um critério explícito que ninguém percebeu ser o critério errado — e é essa a razão de o capítulo insistir que redução de dimensionalidade não é uma etapa neutra de limpeza.
> **volte para:** #pca-variancia-como-criterio-e-o-que-se-perde
:::

## Verificação

1. Um colega diz que agrupamento é "classificação sem rótulo, só um pouco mais difícil". Explique por que a diferença é de natureza, e não de grau.
2. Sua diretoria quer saber quantos segmentos de cliente existem. Descreva o critério que você declararia **antes** de rodar qualquer algoritmo, e como você defenderia esse número se ele fosse contestado.

> Estas duas não são corrigidas, e a omissão é deliberada: a segunda se ganha defendendo o critério diante de quem o contesta, que é exatamente o que uma resposta escrita não simula.
