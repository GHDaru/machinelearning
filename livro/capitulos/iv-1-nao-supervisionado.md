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

## De onde isto veio

**O aperto.** O detalhe que reorganiza tudo: os problemas originais **não eram "clustering"**. Eram quatro apertos em quatro campos que não conversavam entre si — **amostragem estratificada** (como dividir uma população em estratos para amostrar melhor), **momento de inércia de um sólido** (como partir um corpo heterogêneo), **compressão de voz** (como representar um sinal com poucos níveis) e **taxonomia biológica** (como classificar organismos). O mesmo procedimento foi inventado quatro vezes porque quatro pessoas tinham problemas diferentes com a mesma forma matemática.

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

**A leitura deste livro.** Os capítulos [II.2](ii-2-modelos-lineares.md) (Gauss × Legendre) e [III.1](iii-1-neuronio-artificial.md) (Linnainmaa × Rumelhart) contam a mesma história com **dois** pretendentes. Aqui há **seis**, em quatro campos isolados, e o nome vencedor foi cunhado para um algoritmo diferente. Os três casos, juntos, fecham a tríade e dizem o que nenhum diz sozinho: **não vence quem descobre, nem quem publica primeiro, nem sequer quem descreve o método que virou padrão. Vence quem escreve a palavra que pega.**

**Do lado hierárquico**, o aperto era político-científico. **Sokal & Sneath**, em *Principles of Numerical Taxonomy* (1963), motivaram a pesquisa mundial em clustering ao tirar a classificação das mãos da autoridade e torná-la **reproduzível a partir de caracteres medidos**. O objetivo não era achar grupos: era acabar com a discussão sobre quem tinha o direito de defini-los. **Do lado da redução de dimensionalidade**, dois problemas diferentes, 32 anos, a mesma decomposição: **Pearson (1901)** chegou por geometria — a reta ou o plano de melhor ajuste a uma nuvem de pontos; **Hotelling (1933)** chegou por álgebra, com motivação psicométrica, e é dele o nome "componentes principais".

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Toda a cadeia do k-means — Dalenius, Steinhaus, Lloyd, Forgy, Sebestyen, MacQueen, o nome cunhado para outro algoritmo, o resumo de Forgy sem o algoritmo, e a leitura de k-means como otimização alternada — de Bock, *"Origins and extensions of the k-means algorithm"* (JEHPS, 2008), **lido por inteiro** |
| ✓ | Sokal & Sneath, *Principles of Numerical Taxonomy* (1963), como motivador da pesquisa mundial em clustering |
| ✓ᵐ | A publicação tardia de Lloyd (1957 → 1982) |
| ✓ᵐ | Pearson (1901) e Hotelling (1933) como as duas formulações de componentes principais, e o nome vindo de Hotelling |
| ⏳ | Que antes disso se classificava por julgamento do especialista, com a autoridade do taxonomista valendo como critério |
| 📖 | A tríade com os capítulos II.2 e 18, e a leitura de que vence quem escreve a palavra que pega |

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

O que se perde tem três nomes. **Variância**, e você sabe quanto: é o número que a biblioteca informa. **Interpretabilidade** — cada componente é uma mistura de todas as variáveis originais, e "0,4 × renda − 0,3 × idade + …" não é um conceito que se leve a uma reunião. E o mais traiçoeiro: **variância não é o mesmo que informação útil**. A direção que mais varia pode ser justamente a que menos separa o que importa; PCA não sabe qual é o seu problema, porque ninguém contou a ele. PCA é uma decisão de **representação**, e vale para ela tudo o que o [capítulo I.6](i-6-representacao.md) diz — inclusive a sensibilidade à escala.

:::exercicio {"id":"nao-supervisionado-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Seus dados têm dois grupos visíveis: um alongado, em forma de arco, com 800 pontos, e outro pequeno e denso, com 60 pontos. Você roda k-means com k=2 e o resultado corta o arco ao meio, juntando uma das metades ao grupo pequeno. Qual é o diagnóstico correto?

- [ ] O algoritmo convergiu para um mínimo local; basta rodar com mais inicializações.
- [ ] O k está errado; com k=3 ou k=4 o arco é recuperado corretamente.
- [x] A limitação está no critério: minimizar distância ao centro premia grupos esféricos e de tamanho parecido, então nenhuma inicialização ou k conserta a partição.
- [ ] Os dados precisam ser normalizados antes; a escala é a causa do corte.

> **gabarito:** A limitação está no critério, não na execução
> **porque:** A inércia — soma das distâncias quadradas ao centro — é minimizada por **bolas compactas**. Um arco tem pontos longe do próprio centro, então cortá-lo ao meio de fato **reduz** a inércia: o algoritmo não falhou, ele acertou o alvo errado.
>
> As três alternativas erradas confundem execução com critério. Mais inicializações encontram mínimos locais melhores **do mesmo critério** — e o critério é o problema. Mais grupos fatiam o arco em pedaços mais esféricos, o que pode "funcionar" visualmente, mas aí você deixou de recuperar a estrutura e passou a aproximá-la por pedaços. E normalizar corrige distorção de **unidades**; aqui as unidades podem estar perfeitas e o resultado ser o mesmo, porque o problema é a **forma**. A saída real é trocar de critério — densidade, ou hierárquico com a ligação adequada — e não afinar o k-means.
> **volte para:** #fundamentos-inventar-o-criterio-depois-alternar
:::

## Regras de associação — e a lenda que quebrou

Regras de associação nasceram de um aperto comercial concreto: o que os itens de uma cesta de compras dizem uns sobre os outros (**Agrawal, Imieliński & Swami**, SIGMOD 1993; o algoritmo **Apriori** vem no ano seguinte, com Agrawal & Srikant, VLDB 1994). Uma regra `{A} → {B}` tem três números, e o terceiro é o que importa:

- **suporte** — em que fração das cestas A e B aparecem juntos. Mede se a regra é frequente o bastante para ligar.
- **confiança** — entre as cestas que têm A, em quantas aparece B. Parece a métrica principal. Não é.
- **lift** — a confiança **dividida** pela frequência de B em geral. Responde a pergunta certa: *ter A muda a chance de ter B?* Lift 1 significa **nenhuma relação**.

A armadilha é confiança alta com lift 1. Se 60% de todas as cestas têm pão, uma regra `{leite} → {pão}` com 60% de confiança parece forte e não descobriu nada: pão está em 60% das cestas *de qualquer maneira*. Confiança alta mede a **popularidade de B**, não a relação entre os dois. É a versão de mercearia da linha de base do [capítulo II.1](ii-1-avaliacao.md).

### Cerveja e fraldas: verdadeira até a descoberta, inventada a partir da ação

Todo curso conta esta história. Vale separar o que se sustenta do que não se sustenta — a fratura está num ponto exato. **O estudo existe.** Junho de 1992, **Thomas Blischok** (NCR/Teradata) para a **Osco Drug**: cerca de 1,2 milhão de cestas, cerca de 25 lojas (⏳). **A correlação foi achada**: cerveja e fraldas juntas entre 17h e 19h (⏳).

**A parte que todo mundo ensina é falsa.** "Puseram a cerveja ao lado das fraldas e as vendas subiram" — isto não aconteceu. Power, que entrevistou o autor do estudo, afirma que a Osco **não** explorou a relação movendo produtos, e Blischok confirma que **nunca fizeram nada com ela** (❌). Um participante ainda registra que o líder da equipe, ao falar com prospects, **não distinguia entre as afinidades testadas e as hipóteses** (⏳). A lenda nasceu no discurso de vendas, e isso está documentado.

Não conserte a lenda: **olhe para a fratura**. Ela é o exemplo mais barato de três coisas que o mercado trata como uma só — **correlação achada ≠ decisão tomada ≠ efeito medido**. O estudo produziu a primeira; a segunda nunca ocorreu; a terceira, portanto, não existe — e é justamente ela que todo mundo repete como resultado. É o mesmo padrão do [capítulo II.6](ii-6-analise-multidimensional.md), onde a categoria "OLAP" também foi fabricada pelo marketing: a técnica era boa, a embalagem é que não se sustenta.

| Selo | Afirmação |
|---|---|
| ✓ᵐ | A existência e a autoria da apuração de Power, *"Ask Dan!"*, [DSSResources (2002)](https://dssresources.com/newsletters/66.php) — página localizada e identificada. **A entrevista não foi lida por inteiro**, e por isso nada dela aparece aqui entre aspas |
| ⏳ | Data, empresas, volume de cestas e a janela das 17h–19h, conforme relatados nessa entrevista |
| ⏳ | Que o rearranjo de gôndola **não aconteceu** — a negativa é sustentada pela apuração de Power, mas **por fonte secundária**. `❌` seria dizer que não achamos fonte; aqui há fonte, e ela nega. A distinção importa: **não é o mesmo desconhecer e ter apurado que não** |
| ✓ᵐ | Agrawal, Imieliński & Swami (SIGMOD 1993) e Apriori (Agrawal & Srikant, VLDB 1994) |

:::exercicio {"id":"nao-supervisionado-e2","tipo":"numerica","objetivo":"O1","dificuldade":"media"}
De **1 000** cestas de um supermercado: **600** contêm pão, **500** contêm leite e **300** contêm os dois.

Calcule o **lift** da regra `{leite} → {pão}`. Responda com duas casas decimais.

> **gabarito:** 1.00 ± 0.01
> **porque:** A confiança é `300 / 500 = 0,60` — parece uma regra forte. Mas o suporte de pão sozinho é `600 / 1000 = 0,60`, e o lift é `0,60 / 0,60 = 1,00`: **exatamente nenhuma relação**.
>
> É a armadilha inteira num número. Saber que alguém levou leite **não muda em nada** a chance de ter levado pão: uma regra com confiança alta e lift 1 é uma descoberta sobre o item mais vendido da loja, disfarçada de descoberta sobre a relação entre dois itens. Guarde a leitura: lift > 1 é associação positiva, lift < 1 é associação **negativa** (um item afasta o outro — às vezes o achado mais útil), lift ≈ 1 é independência. E note que é o mesmo problema da seção anterior em outra roupa: sem gabarito, a métrica que parece óbvia é a errada, e vale a que se compara com uma **linha de base**.
> **volte para:** #regras-de-associacao-e-a-lenda-que-quebrou
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

## Verificação

1. Um colega diz que agrupamento é "classificação sem rótulo, só um pouco mais difícil". Explique por que a diferença é de natureza, e não de grau.
2. Você reduziu 200 colunas a 10 componentes principais que retêm 95% da variância, e o modelo seguinte piorou. Como isso é possível, se você "quase não perdeu informação"?
3. Sua diretoria quer saber quantos segmentos de cliente existem. Descreva o critério que você declararia **antes** de rodar qualquer algoritmo, e como você defenderia esse número se ele fosse contestado.
