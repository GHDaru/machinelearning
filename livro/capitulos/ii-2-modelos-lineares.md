# II.2 — Modelos Lineares

> **Estado da arte capturado em 2026-08** · última revisão 2026-09-01 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

:::cartao {"nivel":1,"titulo":"O que este capítulo cobra"}

## Objetivos de aprendizagem

- **O1.** Derivar a regressão linear como minimização do erro quadrático.
- **O2.** Obter as equações normais da reta e calcular a inclinação e o intercepto ótimos.
- **O3.** Interpretar os coeficientes de um modelo linear — e dizer o que eles **não** significam.
- **O4.** Reconhecer as situações em que o modelo linear é a escolha certa, não a escolha simplória.

Só de **regressão linear**. A **regressão logística**, que tem "regressão" no nome e classifica, tem capítulo próprio: [II.3](ii-3-regressao-logistica.md).

:::interacao {"id":"modelos-lineares-i25","tipo":"prever","titulo":"Qual das duas tem fórmula fechada"}
As duas compartilham a forma `w·x + b`, e só uma tem fórmula que devolve os coeficientes de uma vez.

- ( ) A logística, pela saída limitada.
- (!) A linear, pela perda quadrática.
- ( ) As duas, pela forma somada.

> **pergunta:** Qual tem solução fechada?
> **revela:** A **linear**. Derivar a perda quadrática e igualar a zero produz um sistema linear nos coeficientes, e sistema linear se resolve de uma vez.
>
> A opção "as duas" é a armadilha que dá nome ao par. A forma somada é a mesma, e é só isso que elas têm em comum: perdas diferentes produzem contas diferentes, saídas em unidades diferentes e leituras diferentes do coeficiente.
:::

:::exercicio {"id":"modelos-lineares-e28","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Você precisa prever **quantos reais** um cliente vai gastar. Qual das duas serve?

- [x] A linear: a saída pedida é um valor.
- [ ] A logística, que usa a mesma forma somada.
- [ ] Qualquer uma: a diferença é de notação.
- [ ] Nenhuma: dinheiro exige um modelo próprio.

> **gabarito:** a regressão linear
> **porque:** A pergunta define o modelo: pedir **quanto** é regressão, e pedir **qual** é classificação. A saída da regressão linear é um número na mesma unidade da resposta observada, e é isso que a decisão precisa.
>
> Quem marca a logística confunde forma com função: ela usa a mesma soma ponderada e depois a espreme num intervalo entre 0 e 1, o que a torna inútil para reais. Quem marca "qualquer uma" repete a confusão que este capítulo separou logo no começo, porque perda, saída e existência de fórmula fechada mudam entre as duas. E quem pede um modelo próprio inventa uma exigência: dinheiro é um número contínuo como qualquer outro, e o que às vezes muda é a escala usada, nunca a família.
> **volte para:** #objetivos-de-aprendizagem
:::

:::cartao {"nivel":1,"titulo":"A carta de recusa que ninguém escreve"}

## O problema: o modelo que todo mundo aprende e quase ninguém respeita

Um banco precisa negar um crédito e **explicar por quê**. A lei exige a explicação, o cliente exige a explicação, e o auditor vai pedir a conta.

O modelo campeão do concurso interno, quinhentas árvores somadas, dá a melhor previsão da casa e não produz **uma única frase** que caiba na carta de recusa. Ele acerta mais e não serve.

:::interacao {"id":"modelos-lineares-i26","tipo":"principio","titulo":"Acerta mais e não serve"}
O ensemble ganhou o concurso interno por uma margem confortável de acerto.

> **pergunta:** Escreva por que isso não basta para ele ser aprovado neste banco.
> **revela:** Porque o requisito não é acerto, é **explicação por escrito**, e ele não está no placar. Um modelo que erra um pouco mais e escreve a frase atende ao cliente, ao regulador e ao auditor; o campeão não atende a nenhum dos três.
>
> O erro de raciocínio que isto desfaz é tratar a métrica como se ela fosse o problema inteiro. A métrica é uma das restrições, e a mais fácil de medir, e por isso ela ocupa a conversa toda.
>
> A ideia reaproveitável vale fora de crédito: **antes de comparar modelos, escreva a lista de requisitos que a comparação não enxerga.**
:::

:::exercicio {"id":"modelos-lineares-e29","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
No caso do banco, por que o modelo mais preciso é recusado?

- [ ] Porque quinhentas árvores custam caro demais para treinar todo mês.
- [ ] Porque a precisão dele foi medida errada e não se sustenta no teste.
- [ ] Porque a lei proíbe usar aprendizado de máquina em decisão de crédito.
- [x] Porque a recusa exige uma explicação, e ele não produz nenhuma.

> **gabarito:** a recusa exige uma explicação
> **porque:** O requisito que ele falha não é de qualidade preditiva. É de **prestação de contas**: a decisão precisa vir acompanhada de uma frase defensável, e um voto de quinhentas árvores não se resume a uma.
>
> A primeira alternativa é um custo real e não é o problema aqui, porque um custo se paga e a explicação continua faltando. A segunda inventa um defeito de medição que o enunciado não dá, e trocar o diagnóstico por "mediram errado" é o reflexo que atrasa a decisão. A terceira é falsa: a lei exige explicação, e não proíbe o método.
>
> O modelo linear entra por essa porta, e não por caridade: ele entrega **um número por atributo**, e um número por atributo é uma frase.
> **volte para:** #o-problema-o-modelo-que-todo-mundo-aprende-e-quase-ninguem-respeita
:::

:::cartao {"nivel":1,"titulo":"Três vantagens que raramente se dizem"}

E há o que raramente se diz em voz alta sobre o linear:

- com **poucos dados por atributo**, ele frequentemente ganha, porque tem menos o que estimar errado;
- quando a saída vira **probabilidade que multiplica dinheiro**, ele nasce razoavelmente calibrado, enquanto ensembles precisam de correção posterior ([capítulo II.1](ii-1-avaliacao.md));
- quando a decisão precisa ser **auditada**, ele é o único que alguém consegue defender numa reunião.

Guarde a cena, porque o capítulo vai cobrar o outro lado: um coeficiente é fácil de ler e **fácil de ler errado**.

:::interacao {"id":"modelos-lineares-i27","tipo":"prever","titulo":"Duzentas linhas, cinquenta colunas"}
Um conjunto tem 200 linhas e 50 colunas, e você compara um linear com um ensemble de árvores.

- ( ) O ensemble, que aproveita o pouco.
- (!) O linear, com menos a estimar.
- ( ) Empate: o tamanho não pesa.

> **pergunta:** Quem tende a ir melhor no teste?
> **revela:** O **linear**, e a razão é contagem. Com 50 colunas ele estima 51 números; o ensemble estima uma estrutura muito maior a partir das mesmas 200 linhas, e sobra amostra para cada corte decorar ruído.
>
> Não é uma lei, é uma tendência com mecanismo conhecido: quanto mais o modelo tem a estimar, mais dado ele precisa para estimar bem. É o mesmo raciocínio de viés e variância do [capítulo 0.2](../0-2-fundamentos.md), aplicado à escolha da família.
:::

:::exercicio {"id":"modelos-lineares-e30","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Uma equipe multiplica a probabilidade prevista pelo valor da apólice para provisionar. Por que a calibração pesa mais que a ordenação?

- [ ] A ordenação foi substituída pela calibração.
- [ ] Provisão não aceita base estatística.
- [x] O número é multiplicado, não só ordenado.
- [ ] Calibrar melhora a acurácia por limiar.

> **gabarito:** o número previsto é multiplicado
> **porque:** Ordenar exige só que o modelo ponha os casos na ordem certa. Multiplicar exige que **o valor** esteja certo: uma probabilidade de 0,4 que na verdade é 0,2 dobra a provisão, mesmo com a ordenação impecável.
>
> A primeira alternativa inventa uma sucessão que não existe, porque as duas medidas respondem a perguntas diferentes e convivem. A segunda é falsa, e provisão baseada em modelo é prática corrente e regulada. A quarta troca calibração por acurácia: recalibrar reescala as probabilidades sem mexer na ordem, então a acurácia por limiar pode não mudar nada.
>
> É a segunda linha da tabela que fecha este capítulo, e ela aparece aqui porque a leitura errada dela custa dinheiro antes de custar reputação.
> **volte para:** #o-problema-o-modelo-que-todo-mundo-aprende-e-quase-ninguem-respeita
:::

:::cartao {"nivel":1,"titulo":"O modelo é uma reta"}

## Fundamentos: regressão linear como minimização

Uma forma só sustenta o capítulo inteiro: uma soma ponderada dos atributos, mais um deslocamento. É dela que sai **um número por atributo**.

$$\hat{y} = w_1x_1 + w_2x_2 + \dots + w_dx_d + b$$

Aqui $\hat{y}$ é a previsão e $y$ o valor observado: **o chapéu marca o que o modelo produz, e sem chapéu é o que o mundo entregou**. São $n$ exemplos e $d$ atributos.

:::interacao {"id":"modelos-lineares-i4","tipo":"prever","titulo":"Uma parcela por atributo","numero":8}
Um modelo de duas entradas saiu do ajuste com $w_1 = 2$, $w_2 = -1{,}5$ e $b = 3$. Chega um exemplo com $x_1 = 4$ e $x_2 = 2$.

> **pergunta:** Quanto vale $\hat{y}$?
> **revela:** **8**, de $2 \times 4 - 1{,}5 \times 2 + 3 = 8 - 3 + 3$. Cada atributo entra uma vez, multiplicado pelo seu peso, e o $b$ entra sozinho.
>
> Repare no que a forma permite dizer em voz alta: o primeiro atributo somou 8, o segundo tirou 3, e a base já valia 3. Essa é a frase que cabe na carta de recusa do banco, e é ela que as quinhentas árvores não escrevem.
:::

:::exercicio {"id":"modelos-lineares-e15","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Ajustar um modelo linear é escolher $w$ e $b$. Para saber se uma escolha é melhor que outra, o que precisa ser comparado?

- [ ] O tamanho dos pesos, porque peso grande costuma indicar atributo importante.
- [ ] A quantidade de atributos contra a quantidade de exemplos disponíveis.
- [x] A previsão do modelo contra o valor observado, exemplo por exemplo.
- [ ] Os atributos entre si, para descobrir qual deles domina a escala.

> **gabarito:** a previsão contra o valor observado
> **porque:** O que existe para ser julgado é a distância entre $\hat{y}$ e $y$ em cada linha dos dados. Daí sai o critério da próxima seção, e daí sai todo o resto do capítulo.
>
> As três alternativas erradas trocam o ajuste por outra coisa. O **tamanho do peso** não é evidência de nada enquanto os atributos não estiverem na mesma escala: um coeficiente pequeno pode estar apenas num atributo medido em unidade grande, e o capítulo volta a isso ao tratar de padronização. A **razão entre atributos e exemplos** decide se o modelo vai generalizar, e não entra na conta que escolhe $w$. E **comparar atributos entre si** é exploração de dados: acontece antes, e não julga previsão nenhuma.
> **volte para:** #fundamentos-regressao-linear-como-minimizacao
:::

:::cartao {"nivel":1,"titulo":"O critério: erro quadrático médio"}

### O critério: minimizar o erro quadrático médio

Resta escolher os $w$. O critério é minimizar o **erro quadrático médio**, o **EQM**:

$$L(w, b) = \frac{1}{n}\sum_{i=1}^{n}\left(y_i - \hat{y}_i\right)^2$$

> **Três convenções, a mesma reta.** Muito texto escreve $\frac{1}{2n}$, porque o meio cancela o 2 que desce ao derivar; outros minimizam a **soma**. Constante positiva não move o mínimo, e a reta é a mesma nas três.

:::interacao {"id":"modelos-lineares-i5","tipo":"desvanecido","titulo":"O EQM de três pontos"}
Uma reta erra $+2$, $-1$ e $+3$ nos três pontos do conjunto. Complete a conta:

- [?] soma dos quadrados => 4 + 1 + 9 = 14
- [?] divisão pelo número de pontos => 14 / 3

> **revela:** O EQM é $14/3 \approx 4{,}67$. O sinal some no quadrado, e é por isso que errar para cima e errar para baixo não se cancelam.
>
> Repare no peso do terceiro ponto. Ele erra uma vez e meia mais que o primeiro e entra na soma com 9 contra 4. O $\frac{1}{n}$ devolve o número a uma escala comparável entre conjuntos de tamanhos diferentes, e é só isso que ele faz.
:::

:::exercicio {"id":"modelos-lineares-e8","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Três textos escrevem a perda como $\frac{1}{n}\sum(y-\hat{y})^2$, $\frac{1}{2n}\sum(y-\hat{y})^2$ e $\sum(y-\hat{y})^2$. O que muda entre eles?

- [x] Só o número do painel: o mínimo não anda.
- [ ] A reta ótima, diferente em cada convenção.
- [ ] A necessidade de otimização iterativa.
- [ ] O grau do polinômio que se ajusta aos dados.

> **gabarito:** só o número que aparece no painel
> **porque:** Minimizar $L$ e minimizar $cL$, com $c$ positivo, tem o mesmo argumento de mínimo. Os três textos ajustam exatamente a mesma reta, e discordam apenas sobre qual valor imprimir.
>
> Quem marca "a reta ótima" segue a leitura intuitiva e errada: a constante estica o eixo vertical do gráfico da perda, sem mexer no ponto mais baixo dele. Quem marca a otimização iterativa inverte a razão de existir do meio, que é comodidade de dedução e não requisito de método, porque ele cancela o 2 que desce ao derivar o quadrado. E o grau do polinômio troca de assunto, já que ele é escolha de atributos e nada tem a ver com a escala da perda.
>
> Saber disso evita duas confusões práticas. Comparar o "erro" de dois relatórios que usaram convenções diferentes não faz sentido, e ver um número dez vezes maior num livro não significa que o modelo de lá seja pior.
> **volte para:** #o-criterio-minimizar-o-erro-quadratico-medio
:::

:::cartao {"nivel":1,"titulo":"Por que ao quadrado, e não em valor absoluto"}

### Por que ao quadrado, e não em valor absoluto

Três razões, em ordem de honestidade:

1. **É diferenciável em todo ponto**, o que faz o otimizador funcionar sem casos especiais. O valor absoluto tem um bico em zero.
2. **Tem solução fechada.** Derivando e igualando a zero, chega-se às *equações normais*, um sistema linear que se resolve de uma vez.
3. **Pune o erro grande desproporcionalmente**, o que às vezes é o que você quer e às vezes não é. Havendo *outliers*, o erro quadrático os persegue.

:::interacao {"id":"modelos-lineares-i1","tipo":"prever","titulo":"O peso do ponto distante","numero":100}
Um ponto erra por **1**; o *outlier* erra por **10**. No critério absoluto o segundo pesa 10 vezes mais.

> **pergunta:** E no quadrático, quantas vezes?
> **revela:** **Cem vezes.** O erro decuplicou e o peso centuplicou, porque $10^2 = 100$ contra $1^2 = 1$. Quem previu 10 leu o critério certo, o absoluto, e é justamente essa a diferença entre os dois.
>
> "Persegue os *outliers*" deixa de ser advertência e vira aritmética: um ponto dez vezes mais distante manda cem vezes mais na escolha da reta. Com quatro pontos comportados e um *outlier* assim, a reta obedece ao *outlier*, e o EQM cai ao ceder a ele.
>
> É o que o item 3 quer dizer com decisão de modelagem. Trocar para o erro absoluto devolve a proporção de dez para um, ao custo de perder o bico diferenciável e a solução fechada dos itens 1 e 2.
:::

:::exercicio {"id":"modelos-lineares-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Por que a regressão linear minimiza o erro **ao quadrado** em vez do erro absoluto?

- [ ] Porque o erro quadrático é sempre menor que o erro absoluto.
- [x] Porque é diferenciável em todo ponto e admite solução fechada.
- [ ] Porque o erro absoluto não pode ser minimizado por nenhum método.
- [ ] Porque o quadrado elimina os erros negativos, e o absoluto não.

> **gabarito:** É diferenciável e admite solução fechada
> **porque:** As razões são de **conveniência matemática**, e reconhecer isso é o que separa quem usa o método de quem o repete. O quadrado é diferenciável em toda parte, enquanto o valor absoluto tem um bico em zero que complica o otimizador, e ele leva às equações normais.
>
> A primeira alternativa compara grandezas sem sentido: para erro maior que 1 o quadrado é maior, e para erro menor que 1 é menor. A terceira é falsa, e vale saber por quê, porque o erro absoluto se minimiza sim, por otimização iterativa ou por programação linear, e o resultado é a regressão pela mediana condicional. A quarta erra num detalhe revelador, já que o valor absoluto **também** elimina o sinal do erro.
>
> Não é que o quadrado seja mais correto. Ele pune erros grandes de forma desproporcional, o que na presença de *outliers* é ativamente ruim.
> **volte para:** #por-que-ao-quadrado-e-nao-em-valor-absoluto
:::

:::cartao {"nivel":1,"titulo":"A fechada existe, e ainda assim o gradiente"}

### A solução fechada existe. Por que, então, gradiente?

A solução fechada está implementada na [etapa 05](../trilha-ml-zero.md), em 25 linhas de eliminação de Gauss. Vale conferir: **gradiente e solução fechada chegam ao mesmo lugar**, com diferença menor que 0,05 em cada coeficiente. Isso desmistifica o gradiente, que passa a ser *um jeito* de resolver, não *o* jeito.

:::interacao {"id":"modelos-lineares-i6","tipo":"principio","titulo":"Duas rotas, o mesmo lugar"}
No experimento do livro, gradiente e solução fechada param a menos de 0,05 um do outro em cada coeficiente.

> **pergunta:** O que essa coincidência autoriza você a concluir, e o que ela não autoriza?
> **revela:** Ela autoriza confiar no **procedimento**. O gradiente, bem configurado, chega aonde a álgebra chega, e aqueles 0,05 são resíduo de critério de parada, não desacordo de resposta.
>
> O que ela não autoriza é generalizar a **garantia**. A conferência só foi possível porque este modelo tem resposta exata para servir de régua. Na regressão logística não há régua nenhuma, e é lá que a confiança construída aqui vai ser gasta.
>
> É o padrão que vale além deste capítulo: calibre a ferramenta geral onde existe resposta exata, e leve a calibração para onde não existe.
:::

:::exercicio {"id":"modelos-lineares-e9","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Se a solução fechada das equações normais é exata e existe, por que o livro ensina o gradiente?

- [ ] Porque o gradiente encontra um mínimo melhor que a solução fechada.
- [ ] Porque a solução fechada só vale quando os dados não têm ruído.
- [ ] Porque o gradiente é mais preciso quando existem *outliers* no conjunto.
- [x] Porque inverter $d \times d$ é caro, e a logística não tem fórmula.

> **gabarito:** custo com muitos atributos, e ela não existe na logística
> **porque:** Os dois motivos são de alcance, não de qualidade. No experimento do livro, gradiente e solução fechada chegam ao mesmo lugar, com diferença menor que 0,05 em cada coeficiente, e isso descarta a primeira alternativa pela evidência do próprio capítulo.
>
> A segunda inverte a lógica do método, porque a solução fechada é justamente o que se faz **quando** há ruído, e sem ruído bastariam dois pontos. A terceira confunde otimizador com critério: quem persegue *outlier* é o erro quadrático, e ele é o mesmo nas duas rotas.
>
> O que muda é onde cada um se aplica. Inverter uma matriz $d \times d$ fica caro rápido conforme $d$ cresce, e para a regressão logística não há fórmula fechada nenhuma. O gradiente é a ferramenta **geral**, e a solução fechada é o caso de sorte de um modelo específico.
> **volte para:** #a-solucao-fechada-existe-por-que-entao-gradiente
:::

:::cartao {"nivel":1,"titulo":"Ponha a reta à mão"}

## Ponha a reta à mão

:::lab {"id":"modelos-lineares-l1","tipo":"regressao-linear","titulo":"Mínimos quadrados à mão","n":24,"a":1.8,"b":4,"ruido":3.2}
Cada segmento cinza é um **resíduo**: a distância vertical de um ponto até a **sua** reta.

1. **Minimize no olho** até o EQM parar de cair, e anote o valor.
2. **Ligue "Mostrar os quadrados"**: você minimiza a soma das áreas.
3. **Revele a reta ótima** e descubra sozinho quanto custou o olho.
:::

:::exercicio {"id":"modelos-lineares-e16","tipo":"completar","objetivo":"O1","dificuldade":"facil"}
Some as áreas dos quadrados cinza, divida pelo número de pontos, e você calculou o ______ daquela reta.

> **gabarito:** EQM|erro quadrático médio|erro quadratico medio|erro quadrático|erro quadratico
> **porque:** Área do quadrado é resíduo ao quadrado, e somar as áreas é somar os quadrados dos resíduos. Dividir pelo número de pontos fecha exatamente a fórmula do EQM.
>
> Duas respostas próximas ficam de fora, e por bom motivo. Quem responde "resíduo" parou um passo antes, porque resíduo é o lado do quadrado e não a área somada. Quem responde "soma dos quadrados" parou na conta certa sem a divisão, e é a divisão que torna o número comparável entre conjuntos de tamanhos diferentes.
>
> O gesto de ver o erro como **área** é o que faz a punição desproporcional virar imagem: dobrar o resíduo quadruplica o quadrado, e é isso que a sua mão sente ao arrastar a reta.
> **volte para:** #ponha-a-reta-a-mao
:::

:::cartao {"nivel":2,"titulo":"Passo 1 — a tigela tem um fundo só"}

## A dedução, em cinco passos

Por que existe uma reta ótima única, e como o computador a encontra sem tentar todas?

Com um só atributo escrevemos $a$ no lugar de $w_1$, e a reta vira $\hat{y} = ax + b$. O critério é o mesmo EQM:

$$L(a, b) = \frac{1}{n}\sum_{i=1}^{n}\left(y_i - ax_i - b\right)^2$$

### Passo 1 — por que há um mínimo, e um só

$L$ é uma soma de quadrados: uma superfície convexa em $(a, b)$, uma tigela. Tigela tem um fundo, e só um.

:::interacao {"id":"modelos-lineares-i7","tipo":"prever","titulo":"Dois começos, um destino"}
Duas pessoas arrastam a reta do laboratório a partir de posições bem diferentes, até o EQM parar de cair.

- ( ) Em retas diferentes: o começo decide.
- (!) Na mesma reta: há um fundo só.
- ( ) Em retas diferentes: há mínimos locais.

> **pergunta:** Onde elas param?
> **revela:** Na **mesma reta**. A convexidade é o que garante isso: uma tigela não tem um segundo fundo onde alguém possa ficar preso, então o ponto de partida muda o caminho e nunca o destino.
>
> Guarde a exceção, porque ela chega logo. Essa garantia é propriedade da **perda com este modelo**, e não do gradiente: numa rede neural a superfície deixa de ser tigela, o ponto de partida passa a importar, e é por isso que lá se fala em inicialização.
:::

:::exercicio {"id":"modelos-lineares-e17","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Por que a convexidade de $L$ torna o ajuste confiável?

- [ ] Garante erro pequeno no fundo da tigela.
- [ ] Permite trocar o quadrático pelo absoluto.
- [ ] Dispensa escolher o passo do otimizador.
- [x] Garante um mínimo só, para todo caminho.

> **gabarito:** um mínimo só, e o mesmo para todo caminho
> **porque:** Convexidade fala sobre a **forma** da superfície, não sobre a qualidade do ajuste. Uma tigela tem um fundo, então o resultado não depende de onde se começou nem de quem rodou o código, e é essa reprodutibilidade que o capítulo está construindo.
>
> A primeira alternativa confunde forma com altura, porque a tigela pode ter o fundo bem alto e um modelo ruim continua sendo o melhor da sua família. A segunda inverte a dependência, já que a convexidade é consequência de ter escolhido o quadrado. A terceira promete demais, e o laboratório do gradiente mostra o contrário adiante: mesmo numa superfície convexa o passo mal dimensionado leva 4 000 iterações a lugar nenhum.
> **volte para:** #passo-1-por-que-ha-um-minimo-e-um-so
:::

:::cartao {"nivel":2,"titulo":"Passo 2 — a reta passa pelo centro de massa"}

### Passo 2 — no fundo, as derivadas se anulam

Derivando em relação a $b$:

$$\frac{\partial L}{\partial b} = -\frac{2}{n}\sum_{i=1}^{n}\left(y_i - ax_i - b\right) = 0 \;\Longrightarrow\; \sum_{i=1}^{n} r_i = 0$$

onde $r_i = y_i - ax_i - b$ é o resíduo. **A soma dos resíduos é zero.** Dividindo por $n$: $\bar{y} = a\bar{x} + b$, ou seja, $b = \bar{y} - a\bar{x}$.

:::interacao {"id":"modelos-lineares-i8","tipo":"principio","titulo":"De zero a centro de massa"}
A condição de mínimo em $b$ diz apenas que a soma dos resíduos é zero.

> **pergunta:** Como se sai daí para "a reta passa por $(\bar{x}, \bar{y})$"?
> **revela:** Divida a soma por $n$. A média dos resíduos é zero, e a média de $y_i - ax_i - b$ é $\bar{y} - a\bar{x} - b$. Igualando a zero, o ponto $(\bar{x}, \bar{y})$ satisfaz a equação da reta, e portanto está sobre ela.
>
> A ideia reaproveitável é a passagem: **uma condição sobre a soma vira uma afirmação sobre a média**, e média é uma coordenada. Foi assim que uma igualdade algébrica virou um fato geométrico que se vê no laboratório.
>
> Vale para qualquer conjunto, com ou sem *outlier*. Gire a reta ótima em torno de um ponto e ele será $(\bar{x}, \bar{y})$.
:::

:::exercicio {"id":"modelos-lineares-e10","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
Uma reta de mínimos quadrados tem inclinação $a = 2{,}5$. As médias dos dados são $\bar{x} = 4$ e $\bar{y} = 18$.

Qual é o **intercepto** $b$?

> **gabarito:** 8
> **porque:** O passo 2 da dedução garante que a reta ótima passa pelo centro de massa $(\bar{x}, \bar{y})$, sempre. Daí sai direto $b = \bar{y} - a\bar{x} = 18 - 2{,}5 \times 4 = 18 - 10 = \mathbf{8}$.
>
> Dois erros comuns dão números reconhecíveis. Quem soma em vez de subtrair chega a 28, e quem inverte as médias calcula $4 - 2{,}5 \times 18$ e chega a $-41$. O teste é rápido: a reta tem de passar por $(4, 18)$, e só $b = 8$ passa.
>
> Vale reparar no que este exercício não pede: nenhum dado individual. O intercepto ótimo depende só da inclinação e das duas médias, e essa é uma consequência forte da condição de mínimo.
> **volte para:** #passo-2-no-fundo-as-derivadas-se-anulam
:::

:::cartao {"nivel":2,"titulo":"Passo 3 — os resíduos são ortogonais ao atributo"}

### Passo 3 — a segunda condição

Derivando em relação a $a$:

$$\frac{\partial L}{\partial a} = -\frac{2}{n}\sum_{i=1}^{n}x_i\left(y_i - ax_i - b\right) = 0 \;\Longrightarrow\; \sum_{i=1}^{n} x_i r_i = 0$$

**Os resíduos são ortogonais ao atributo.** O que sobrou de erro **não tem mais nada de linear em $x$**: se tivesse, a reta ainda poderia melhorar.

:::interacao {"id":"modelos-lineares-i2","tipo":"principio","titulo":"De onde sai o xᵢ"}
As duas condições do mínimo, uma sob a outra, trazem o resíduo multiplicado por coisas diferentes:

$$\frac{\partial L}{\partial b} = -\frac{2}{n}\sum_{i} r_i \qquad \frac{\partial L}{\partial a} = -\frac{2}{n}\sum_{i} x_i\, r_i$$

> **pergunta:** Por que o $x_i$ aparece ao derivar em relação a $a$, e não em relação a $b$?
> **revela:** Pela regra da cadeia. O resíduo é $r_i = y_i - ax_i - b$: derivado em relação a $b$ ele dá $-1$, e em relação a $a$ dá $-x_i$. O que multiplica cada resíduo é **a sensibilidade daquele resíduo ao parâmetro**, e ela é $x_i$ porque é $x_i$ que multiplica $a$ na reta.
>
> Daí sai o significado geométrico. Na condição de $b$ todo ponto pesa igual, e por isso ela vira "a soma dos resíduos é zero". Na condição de $a$ cada ponto pesa o próprio $x_i$: ponto com $x$ grande manda muito na inclinação, e ponto com $x = 0$ não opina sobre ela.
>
> É a mesma regra de atribuição de culpa que o perceptron usa no [capítulo III.1](iii-1-neuronio-artificial.md): quem não entrou na conta não responde pelo erro.
:::

:::exercicio {"id":"modelos-lineares-e18","tipo":"completar","objetivo":"O2","dificuldade":"media"}
Numa reta já ajustada por mínimos quadrados, some os produtos de cada atributo pelo seu resíduo, $\sum_i x_i r_i$. O resultado vale sempre ______.

> **gabarito:** 0|zero
> **porque:** É a segunda condição de mínimo, e ela não é aproximada nem estatística: se aquela soma fosse diferente de zero, a derivada de $L$ em relação a $a$ não seria zero, e a reta ainda teria por onde melhorar.
>
> Duas respostas erradas revelam a confusão que este passo desfaz. Quem responde "$n$" ou "a média dos resíduos" está pensando na **primeira** condição, que é a soma dos resíduos sozinhos. Quem responde "depende dos dados" trata um resultado exato como tendência, e ele vale para qualquer conjunto em que a reta tenha sido de fato minimizada.
>
> A leitura que fica é a que o passo 3 chama de ortogonalidade. O erro que sobrou não guarda nenhuma informação linear sobre $x$, e por isso não há reta melhor a extrair dele.
> **volte para:** #passo-3-a-segunda-condicao
:::

:::cartao {"nivel":2,"titulo":"Passo 4 — duas somas, e a reta está pronta"}

### Passo 4 — resolver o sistema

Substituindo $b = \bar{y} - a\bar{x}$ na segunda condição e reorganizando em torno das médias:

$$a = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{n}(x_i - \bar{x})^2} = \frac{S_{xy}}{S_{xx}}$$

Duas contas, uma soma de produtos e uma soma de quadrados, e a reta está pronta. Sem iteração, sem taxa de aprendizado, sem critério de parada.

:::interacao {"id":"modelos-lineares-i10","tipo":"principio","titulo":"Produto em cima, quadrado embaixo"}
O numerador soma produtos de dois desvios; o denominador soma quadrados de um só.

> **pergunta:** Por que o denominador tem quadrado, se o numerador tem produto?
> **revela:** Porque ele **é** um produto, com $x$ nos dois lugares: $S_{xx} = \sum (x_i - \bar{x})(x_i - \bar{x})$. Trocar $y$ por $x$ no numerador dá o denominador, e o quadrado é só o nome curto disso.
>
> A leitura que a simetria entrega é a fração inteira: em cima, quanto $x$ e $y$ variam **juntos**; embaixo, quanto $x$ varia **sozinho**. A inclinação é o tanto de $y$ que se ganha por unidade de variação de $x$.
>
> E ela já avisa onde vai quebrar. Se $x$ não varia sozinho, o denominador é zero, e é isso que o passo 5 vai cobrar.
:::

:::exercicio {"id":"modelos-lineares-e19","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Um conjunto tem três pontos cujos desvios em $x$ são $-2$, $0$ e $+2$, e cujos desvios em $y$ são $-3$, $0$ e $+3$.

Calcule a **inclinação** $a$ da reta de mínimos quadrados. Responda com duas casas decimais.

> **gabarito:** 1.50 ± 0.02
> **porque:** S_xy = (−2)(−3) + 0 + (2)(3) = 6 + 0 + 6 = 12, e S_xx = 4 + 0 + 4 = 8. Logo a = 12 / 8 = **1,5**.
>
> Dois enganos frequentes dão números que dá para reconhecer. Quem soma os desvios em vez de multiplicá-los chega a zero nos dois lados, porque desvio em torno da média sempre soma zero, e isso é sinal de que o produto foi esquecido. Quem inverte a fração calcula 8 / 12 e chega a 0,67, que é a inclinação da reta de $x$ contra $y$, um modelo diferente e com outra pergunta.
>
> Repare que o ponto do meio, com desvio zero nos dois eixos, não entrou em nenhuma das somas. Ele é exatamente o centro de massa, e o passo 2 já dizia que a reta passa por ele.
> **volte para:** #passo-4-resolver-o-sistema
:::

:::cartao {"nivel":2,"titulo":"Uma vez com número"}

### Uma vez com número

Três pontos: (1, 3), (2, 5) e (3, 4). As médias são $\bar{x} = 2$ e $\bar{y} = 4$. Os desvios em $x$ são $-1$, $0$, $+1$; em $y$, $-1$, $+1$, $0$.

$$S_{xy} = (-1)(-1) + (0)(1) + (1)(0) = 1 \qquad S_{xx} = 1 + 0 + 1 = 2$$

Logo $a = 1/2 = 0{,}5$, e $b = 4 - 0{,}5 \times 2 = 3$. A reta é $\hat{y} = 0{,}5x + 3$, e passa por $(2, 4)$.

:::interacao {"id":"modelos-lineares-i11","tipo":"desvanecido","titulo":"O mesmo caminho, outros três pontos"}
Agora os pontos são (0, 1), (1, 2) e (2, 6): $\bar{x} = 1$, $\bar{y} = 3$, desvios em $x$ de $-1$, $0$, $+1$ e em $y$ de $-2$, $-1$, $+3$.

- [?] S_xy => (-1)(-2) + (0)(-1) + (1)(3) = 5
- [?] S_xx => 1 + 0 + 1 = 2
- [?] a => 5 / 2 = 2,5
- [?] b => 3 - 2,5 x 1 = 0,5

> **revela:** A reta é $\hat{y} = 2{,}5x + 0{,}5$, e o teste de sempre confere: em $x = 1$ ela dá 3, que é $\bar{y}$.
>
> Repare no que mudou em relação ao exemplo de cima. O $S_{xx}$ é o mesmo 2, porque os $x$ são os mesmos; o que subiu foi o $S_{xy}$, de 1 para 5, porque o terceiro ponto saiu bem mais alto.
:::

:::exercicio {"id":"modelos-lineares-e7","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Quatro pontos: (1, 2), (2, 3), (3, 5) e (4, 6). Calcule a **inclinação** $a$ da reta de mínimos quadrados, com duas casas decimais.

> **gabarito:** 1.40 ± 0.02
> **porque:** As médias são x̄ = 2,5 e ȳ = 4. Os desvios em x são −1,5, −0,5, +0,5 e +1,5; em y são −2, −1, +1 e +2.
>
> S_xy = (−1,5)(−2) + (−0,5)(−1) + (0,5)(1) + (1,5)(2) = 3 + 0,5 + 0,5 + 3 = **7**
> S_xx = 2,25 + 0,25 + 0,25 + 2,25 = **5**
>
> Logo a = 7 / 5 = **1,4**, e o intercepto sai de b = ȳ − a·x̄ = 4 − 1,4 × 2,5 = **0,5**.
>
> O engano mais comum aqui é usar os valores brutos em vez dos desvios, o que dá 50 / 30 ≈ 1,67. A fórmula é sobre variação em torno da média, e trocar $x_i$ por $(x_i - \bar{x})$ é o passo que não pode ser pulado.
>
> Confira que a reta ótima passa por (x̄, ȳ) = (2,5; 4): 1,4 × 2,5 + 0,5 = 4.
> **volte para:** #uma-vez-com-numero
:::

:::cartao {"nivel":2,"titulo":"Passo 5 — o denominador avisa"}

### Passo 5 — o que a fórmula avisa

O denominador é a variação de $x$. Se $S_{xx} = 0$, todos os $x$ são iguais, e **não existe reta**: nenhuma inclinação é melhor que outra. Não é falha numérica, é o dado não conter a informação.

:::interacao {"id":"modelos-lineares-i12","tipo":"prever","titulo":"Quarenta dias pelo mesmo preço","numero":0}
Uma barraca vendeu limonada por quarenta dias e cobrou 0,30 por copo em todos eles. Você quer ajustar `vendas` contra `preco`.

> **pergunta:** Quanto vale $S_{xx}$ do preço?
> **revela:** **Zero.** Todo $x_i$ é igual a $\bar{x}$, então todo desvio é zero, e a soma dos quadrados de zeros é zero.
>
> A fração $S_{xy}/S_{xx}$ fica sem resposta, e o que a álgebra está dizendo é uma frase sobre o mundo: **atributo que não varia não tem coeficiente.** Não há como saber o efeito de mudar o preço se ninguém nunca o mudou.
>
> Guarde este número, porque o caso da limonada é uma versão disfarçada dele: lá o preço varia no ano inteiro e não varia dentro de nenhum mês, que é onde a comparação justa teria de acontecer.
:::

:::exercicio {"id":"modelos-lineares-e11","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Ao ajustar uma reta, o denominador $S_{xx}$ dá zero. O que isso significa?

- [ ] Erro numérico de arredondamento, corrigível com mais precisão na conta.
- [ ] Que o modelo está perfeitamente ajustado, e o erro nos pontos é zero.
- [ ] Que há colinearidade entre dois atributos, e um deles precisa sair.
- [x] Que todos os $x$ são iguais, e nenhuma inclinação é melhor que outra.

> **gabarito:** todos os $x$ são iguais, e não existe reta
> **porque:** $S_{xx}$ é a variação de $x$ em torno da média. Zerado, significa que $x$ nunca variou, e sem variação no que se quer usar como explicação nenhuma inclinação é preferível a outra. A conta não quebra por imprecisão; ela quebra porque a pergunta não tem resposta nos dados.
>
> A primeira alternativa é a reação de quem vê divisão por zero e pensa em máquina, mas aqui o zero é exato e proposital. A segunda troca o denominador pelo numerador, já que ajuste perfeito zeraria os **resíduos**, e não a variação do atributo. A terceira descreve um fenômeno vizinho e diferente, porque colinearidade é dois atributos variando **juntos**, e ali a conta até fecha, só que a interpretação vira ruído.
>
> Reconhecer isto na forma algébrica antes de encontrá-lo na forma de relatório é o ponto do passo 5.
> **volte para:** #passo-5-o-que-a-formula-avisa
:::

:::cartao {"nivel":2,"titulo":"O gradiente contra a álgebra"}

### O gradiente contra a álgebra

:::lab {"id":"modelos-lineares-l2","tipo":"anima-normais","titulo":"O gradiente atrás de uma resposta que já existe"}
Trezentos pontos e dois atributos **quase colineares**. O placar traz o excesso de erro sobre o ótimo fechado, e a varredura vai a 4 000 passos.

**Antes de assistir, chute:** quantos passos até chegar a 1% do ótimo?

Como vieram, ele **não chega**: termina 2,8% acima, e não por passo mal escolhido. Clique em **"E se os atributos fossem padronizados?"**: agora chega a 1% no passo **1 460** e o passo estável salta de 7,3 × 10⁻³ para 2,5 × 10⁻¹.
:::

:::exercicio {"id":"modelos-lineares-e26","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
O placar marca o **excesso sobre o ótimo fechado**. O que serve de referência para esse zero?

- [ ] O menor erro que o gradiente alcançou nos 4 000 passos.
- [x] O erro das equações normais.
- [ ] O erro de quem prevê sempre a média.
- [ ] O erro num conjunto de teste separado.

> **gabarito:** o erro da solução fechada
> **porque:** A animação só consegue dizer "2,8% acima" porque existe um número exato para comparar, e ele vem das equações normais. É o caso raro em que a resposta certa é conhecida antes de o otimizador começar.
>
> A primeira alternativa faria o placar mentir por construção: se a referência fosse o melhor do próprio gradiente, ele terminaria sempre a 0%. A terceira descreve a referência do $R^2$, que é outra régua e responde a outra pergunta. A quarta troca ajuste por generalização, e aqui nada foi separado, porque a animação compara duas formas de resolver o mesmo problema no mesmo dado.
>
> É por isso que este laboratório é possível só aqui. No capítulo II.3 não haveria com o que comparar.
> **volte para:** #o-gradiente-contra-a-algebra
:::

:::cartao {"nivel":2,"titulo":"O que mudou não foi o otimizador"}

**Padronizar não é higiene de planilha:** é o que transforma um vale estreito num vale redondo. E repare no que a álgebra fez enquanto isso: **nos dois casos ela deu a resposta exata numa única conta**. O capítulo [II.4](ii-4-otimizacao.md) retoma esta superfície pelo lado da taxa de aprendizado.

:::interacao {"id":"modelos-lineares-i23","tipo":"prever","titulo":"A forma que dois atributos colineares desenham"}
Dois atributos quase colineares carregam quase a mesma informação, e muitas combinações de pesos dão quase o mesmo erro.

- ( ) Uma tigela redonda como antes.
- (!) Um vale comprido e estreito.
- ( ) Uma superfície com vários fundos.

> **pergunta:** Que forma isso dá à superfície de erro?
> **revela:** Um **vale comprido e estreito**. Ao longo da direção em que os dois pesos se compensam o erro quase não muda, e na direção perpendicular ele sobe rápido.
>
> A terceira opção é a confusão que o passo 1 já resolveu: a superfície continua convexa, com um fundo só. O que mudou não foi o número de mínimos, foi a **forma** ao redor dele, e o gradiente desce a parede em vez de andar pelo fundo.
:::

:::exercicio {"id":"modelos-lineares-e20","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
O gradiente melhora muito com os atributos padronizados. A álgebra acertou **nos dois casos**. Por quê?

- [ ] Padronizar não altera os coeficientes ótimos.
- [x] As equações normais não andam pela superfície.
- [ ] O dado padronizado deixa de ser correlacionado entre si.
- [ ] A álgebra usa um passo maior a cada iteração.

> **gabarito:** as equações normais resolvem de uma vez
> **porque:** A forma da superfície é o que atrapalha **quem anda por ela**. As equações normais não andam: elas igualam as derivadas a zero e resolvem o sistema resultante, então um vale estreito e um vale redondo dão o mesmo trabalho.
>
> A primeira alternativa é falsa e útil de desmontar, porque padronizar **muda** os coeficientes ao mudar a unidade de cada atributo, e o que não muda é a função ajustada. A terceira confunde escala com correlação, já que subtrair média e dividir por desvio não desfaz o fato de dois atributos andarem juntos. A quarta atribui à álgebra um passo que ela não tem.
>
> A leitura que fica é a do próprio laboratório: o que mudou entre as duas execuções não foi o otimizador, foi o problema.
> **volte para:** #o-gradiente-contra-a-algebra
:::

:::cartao {"nivel":3,"titulo":"O que o coeficiente diz"}

## Interpretar coeficientes — e o que eles não dizem

O modelo linear é interpretável, e é por isso que ele sobrevive em crédito, seguro e saúde. Mas "interpretável" não significa "fácil de interpretar corretamente".

### O que o coeficiente diz

Aumentar $x_j$ em uma unidade muda $\hat{y}$ em $w_j$ unidades, mantendo os demais atributos constantes. É a leitura mais direta que um modelo oferece.

> Na regressão logística a leitura é outra: o coeficiente multiplica a **razão de chances**, não a saída. Confundir as duas é o erro de interpretação mais comum deste livro.

:::interacao {"id":"modelos-lineares-i13","tipo":"prever","titulo":"Trinta e cinco por metro quadrado","numero":350}
Um modelo de aluguel saiu assim, com a área em metros quadrados: $\hat{y} = 1200 + 35\,x$.

> **pergunta:** Quanto muda a previsão entre dois imóveis que diferem em 10 m²?
> **revela:** **350 reais**, de $35 \times 10$. O intercepto some da conta, porque ele é o mesmo nos dois imóveis e a pergunta é sobre a **diferença**.
>
> É esse o gesto que torna o coeficiente uma frase: multiplique pelo tamanho da mudança que interessa à decisão. E note que a frase honesta é sobre **comparar dois imóveis do conjunto**, não sobre derrubar uma parede, porque o modelo viu áreas diferentes e nunca viu uma reforma.
:::

:::exercicio {"id":"modelos-lineares-e21","tipo":"numerica","objetivo":"O3","dificuldade":"facil"}
Um modelo prevê o limite de crédito em reais, com a renda em reais e os dependentes em pessoas:

`limite = 500 + 0,12 · renda − 800 · dependentes`

Comparando dois clientes, um com 2 000 reais a mais de renda e um dependente a mais que o outro, quanto muda o limite previsto?

> **gabarito:** -560
> **porque:** As parcelas se somam com o próprio sinal: 0,12 × 2 000 = +240 pela renda, e −800 × 1 = −800 pelo dependente. O total é 240 − 800 = **−560** reais.
>
> Três enganos aparecem sempre. Quem responde +1 040 somou os dois efeitos como se ambos empurrassem para cima; quem responde −1 040 ignorou que a renda entra positiva; e quem responde −60 incluiu o intercepto de 500, que não pertence a uma **diferença** entre dois clientes.
>
> A leitura a levar é que coeficiente sozinho não decide nada. Ele só vira decisão depois de multiplicado pela variação que a situação real oferece.
> **volte para:** #o-que-o-coeficiente-diz
:::

:::cartao {"nivel":3,"titulo":"A correlação que recomenda o contrário"}

## O caso da limonada

O conjunto em [`ml-zero/dados/limonada/`](../../ml-zero/dados/limonada/README.md) traz 365 dias de uma barraca: tempo, panfletos, preço e copos vendidos.

:::interacao {"id":"modelos-lineares-i14","tipo":"prever","titulo":"O sinal que você espera"}
Nestes 365 dias, preço cobrado e copos vendidos aparecem correlacionados.

- ( ) Negativamente: caro afasta freguês.
- (!) Positivamente: caro vendeu mais.
- ( ) Perto de zero: o preço mal mudou.

> **pergunta:** Com que sinal?
> **revela:** **Positivamente**, e forte: **+0,513**. Quem previu negativo aplicou a teoria econômica correta ao dado errado, e é exatamente esse o susto que o caso existe para dar.
>
> Guarde a estranheza sem explicá-la ainda. Uma correlação positiva significa que, nos dias em que a barraca cobrou mais, ela também vendeu mais. Alguma coisa está acontecendo junto com o preço, e o resto desta parte é descobrir o quê.
:::

| atributo | correlação com `vendas` |
|---|---|
| `temperatura` | +0,990 |
| `precipitacao` | −0,909 |
| `panfletos` | +0,805 |
| **`preco`** | **+0,513** |

Calor vende, chuva atrapalha, panfleto ajuda. E **preço mais alto vende mais.** A última linha é onde o relatório morre: ela sugere *aumente o preço*, o oposto do que a barraca deve fazer.

:::exercicio {"id":"modelos-lineares-e22","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Olhando **só** esta tabela, o que ela permite afirmar?

- [x] Que as quatro andam junto, sem dizer por quê.
- [ ] Que a chuva derruba as vendas e o preço as levanta.
- [ ] Que a precipitação é o melhor previsor da tabela.
- [ ] Que subir o preço é a melhor alavanca do negócio.

> **gabarito:** andam junto com as vendas, sem dizer por quê
> **porque:** Correlação é uma medida de acompanhamento entre duas colunas. Ela diz que os números sobem e descem juntos, e não diz nada sobre quem move quem, nem sobre o que mais mudou ao mesmo tempo.
>
> A leitura causal ("a chuva derruba, o preço levanta") é o assunto do resto desta seção. A alternativa da precipitação é falsa dentro da própria tabela, porque quem tem o maior valor absoluto é `temperatura`, com 0,990. E "subir o preço" é a recomendação que vai para o slide e custa dinheiro.
>
> A tabela cumpriu o papel dela, que é apontar onde olhar. Quem para nela transforma um mapa em conclusão.
> **volte para:** #o-caso-da-limonada
:::

:::cartao {"nivel":3,"titulo":"O preço é um termômetro disfarçado"}

### O preço é um termômetro disfarçado

Antes de explicar, olhe o dado.

| preço | dias | temperatura média* | vendas médias | meses em que aparece |
|---|---|---|---|---|
| 0,30 | 303 | 57,0 | 23,7 | jan–jun, set–dez |
| 0,50 | 62 | 78,8 | 33,1 | **só julho e agosto** |

> \* A unidade da temperatura **não está no arquivo**, e a ficha do dado recusa-se a inventá-la. A faixa (15,1 a 102,9) é típica de Fahrenheit, onde 78,8 °F são cerca de 26 °C.

:::interacao {"id":"modelos-lineares-i15","tipo":"principio","titulo":"O que o preço está marcando"}
O preço de 0,50 aparece em 62 dias, todos em julho e agosto.

> **pergunta:** Escreva o que esse fato faz com a correlação de +0,513.
> **revela:** Ele a explica inteira. A coluna `preco` tem dois valores, e o valor alto é um **carimbo de julho e agosto**. Comparar vendas a 0,50 com vendas a 0,30 é comparar verão com o resto do ano, e a correlação mede o calor de julho.
>
> `preco` não é uma alavanca de decisão neste conjunto: é um **termômetro disfarçado**. A pergunta da dona da barraca, *quanto vendo a mais se eu baixar o preço*, exigiria dias comparáveis com preços diferentes, e não existe um só.
>
> A ideia reaproveitável: **uma coluna que só assume certo valor dentro de um recorte não mede o que o nome dela diz, mede o recorte.**
:::

:::exercicio {"id":"modelos-lineares-e23","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
O que torna `preco` um termômetro disfarçado aqui?

- [ ] Foi registrado na unidade da temperatura.
- [x] O valor alto só sai nos meses quentes.
- [ ] A correlação com as vendas passa de 0,5.
- [ ] O valor baixo cobre 303 dos 365 dias.

> **gabarito:** o valor alto só aparece nos dois meses mais quentes
> **porque:** O que faz uma coluna virar termômetro é a **coincidência entre o recorte dela e o recorte de outra variável**. Aqui o preço de 0,50 e o mês de julho ocupam exatamente os mesmos 62 dias, então quem lê o preço está lendo o calendário.
>
> A primeira alternativa é falsa e vale desfazer, porque preço está em unidade monetária e temperatura em graus, e unidade não tem nada a ver com confundimento. A terceira confunde o sintoma com a causa, já que o valor 0,513 é o que precisa ser explicado. A quarta é um fato verdadeiro da tabela e irrelevante: o problema não é o valor comum aparecer muito, é o valor raro aparecer só num lugar.
>
> O teste que fica: para toda coluna suspeita, pergunte **em que subconjunto dos dados ela varia**. Se a resposta for "num recorte só", ela carrega o recorte junto.
> **volte para:** #o-preco-e-um-termometro-disfarcado
:::

:::cartao {"nivel":3,"titulo":"O controle que não salva"}

### O passo que deveria salvar, e não salva

A resposta de manual, diante da limonada, é "controle pelas outras variáveis". Ajustando tudo junto:

```
vendas = 3,192
       + 0,3692 · temperatura
       − 2,2460 · precipitacao
       + 0,0188 · panfletos
       + 2,4143 · preco          R² = 0,982
```

> **O $R^2$** é a fração da variação de `vendas` que o modelo reproduz: 0 é não fazer melhor que a média, 1 é acertar cada ponto. **0,982 é altíssimo, e é por isso que ele está aqui.**

:::interacao {"id":"modelos-lineares-i3","tipo":"desvanecido","titulo":"Quem explica os 9,4 copos"}
Do preço 0,30 para o 0,50 a venda média sobe de 23,7 para 33,1 copos, **9,4 a mais**, e a temperatura média sobe de 57,0 para 78,8. Complete as duas parcelas:

- [?] temperatura: `0,3692 × (78,8 − 57,0)` => 8,05 copos
- [?] preço: `2,4143 × (0,50 − 0,30)` => 0,48 copo

> **revela:** A temperatura responde por **8,05** dos 9,4 copos, e o preço por **0,48**, cinco por cento da diferença. O que sobra está na precipitação e nos panfletos, que também mudam de janeiro para julho.
>
> Repare no contraste: **+2,4143 é o maior coeficiente da equação**, e mesmo assim a parcela dele é a menor de todas. Coeficiente é efeito por unidade; parcela é efeito por unidade vezes **a variação que de fato existiu no dado**. O preço variou 0,20 em 365 dias; a temperatura variou 21,8.
>
> São as duas armadilhas deste capítulo na mesma conta. Coeficiente grande não é atributo importante enquanto não se padroniza, e aqueles 0,20 de variação de preço só aconteceram em julho e agosto.
:::

:::exercicio {"id":"modelos-lineares-e24","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
O ajuste tem $R^2 = 0{,}982$. O que esse número autoriza a afirmar?

- [ ] Que 98,2% das decisões de preço da barraca foram boas.
- [ ] Que o efeito do preço tem 98,2% de chance.
- [x] Que ele reproduz 98,2% da variação observada.
- [ ] Que 1,8% das linhas ficaram fora do ajuste.

> **gabarito:** reproduz 98,2% da variação observada nas vendas
> **porque:** O $R^2$ compara o erro do modelo com o erro de quem prevê sempre a média. Ele mede **ajuste ao passado**, e é uma afirmação sobre a coluna `vendas` e mais nada.
>
> As três alternativas erradas são três formas de esticá-lo. A primeira o transforma em juízo de negócio, que ele não faz. A segunda o transforma em confiança sobre um coeficiente, que é outra conta inteira e que, aqui, seria falsa mesmo se fosse feita. A quarta o transforma em contagem de linhas, quando ele é uma razão entre variações.
>
> É por isso que ele está neste cartão. Reproduzir bem o passado e dizer o efeito de mexer numa alavanca são coisas diferentes, e o R² alto é justamente o que faz o relatório errado parecer sólido.
> **volte para:** #o-passo-que-deveria-salvar-e-nao-salva
:::

:::cartao {"nivel":3,"titulo":"Controlar remove só o que a variável mede"}

O coeficiente do preço continua **positivo**. Controlar pela temperatura não desfez nada, porque a temperatura média não captura *ser julho*, e o que sobrou de julho continua morando dentro de `preco`.

**Controlar por uma variável só remove o confundimento que aquela variável mede.** Se o confundidor real é "estação", e você mediu "temperatura do dia", a regressão devolve um número com aparência de rigor e sinal invertido. Nenhuma métrica avisa.

:::interacao {"id":"modelos-lineares-i16","tipo":"principio","titulo":"O que a temperatura não carregou"}
A temperatura entrou no modelo e o coeficiente do preço continuou positivo.

> **pergunta:** O que "ser julho" tem que "78,8 graus" não tem?
> **revela:** Férias escolares, fluxo de rua diferente, hábito de quem passa, dias mais longos. Um dia de 78,8 graus em maio não traz nada disso, e é essa diferença que sobra sem dono no modelo.
>
> O que sobra sem dono não some: é atribuído ao atributo que marcar melhor o recorte, e aqui o único que marca julho é o preço. O coeficiente de 2,4143 é a estação inteira empacotada num nome errado.
>
> A ideia reaproveitável: **controlar por um indicador do confundidor não é controlar pelo confundidor.** Antes de escrever "controlamos por X", pergunte quanto de X ficou de fora da medida de X.
:::

:::exercicio {"id":"modelos-lineares-e5","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
Na regressão múltipla da limonada, `preco` fica com coeficiente **+2,41** mesmo com `temperatura` no modelo. Qual é a explicação correta?

- [ ] O modelo provou que subir o preço aumenta as vendas, e a correlação estava certa.
- [ ] O coeficiente é positivo por erro numérico, e com mais dados ele viraria negativo.
- [x] `preco` marca julho e agosto, e a temperatura do dia não é tudo o que é verão.
- [ ] O problema seria resolvido padronizando os atributos antes de ajustar o modelo.

> **gabarito:** `preco` funciona como indicador de julho e agosto
> **porque:** O preço de 0,50 só existe em 62 dias, todos em julho e agosto. Ele carrega a informação "é alta temporada" (férias, fluxo de rua, hábito) que a temperatura média do dia não representa inteira. O que sobra desse efeito é atribuído ao único atributo que o marca: o preço.
>
> A primeira alternativa é a leitura que vai para o slide de recomendação e custa dinheiro. A segunda inverte o diagnóstico, porque não é ruído, é **viés**, e mais dados do mesmo tipo tornariam o coeficiente errado mais preciso em vez de mais correto. A quarta confunde escalas com confundimento, já que padronizar muda a **magnitude** dos coeficientes para que sejam comparáveis, e não mexe em qual variável está roubando o efeito da outra.
>
> Controlar por uma variável só remove o confundimento que aquela variável mede.
> **volte para:** #o-passo-que-deveria-salvar-e-nao-salva
:::

:::cartao {"nivel":3,"titulo":"O panfleto, de brinde"}

### O panfleto, de brinde

O preço foi a causalidade em números, e não em advertência. Vem outro de brinde: `temperatura` e `panfletos` correlacionam **+0,798**, porque em dia quente distribuíam-se mais panfletos. O coeficiente do panfleto sai em 0,0188, e lido como efeito da panfletagem é falso.

Colinearidade não estraga a previsão. Estraga a **leitura**, e é o modo de falha mais traiçoeiro do modelo linear, porque o erro de validação não muda.

:::interacao {"id":"modelos-lineares-i17","tipo":"prever","titulo":"Panfleto em dia frio"}
Suponha que a barraca passasse a distribuir a mesma quantidade de panfletos em dias frios e em dias quentes, e que o modelo fosse reajustado.

- ( ) Subiria, porque haveria mais panfletos distribuídos ao longo do ano.
- (!) Desceria, porque parte dos 0,0188 de hoje é calor, e não panfleto.
- ( ) Ficaria igual, porque o coeficiente já está controlado pela temperatura.

> **pergunta:** O que aconteceria com o coeficiente de `panfletos`?
> **revela:** **Desceria.** Hoje o panfleto aparece junto do calor e leva crédito por vendas que o calor explicaria sozinho. Distribuindo panfleto em dia frio também, essa carona acaba.
>
> Quem previu "ficaria igual" fez a aposta que o cartão anterior desmontou: a temperatura está no modelo, e ainda assim não captura tudo o que anda junto dela. E a leitura de negócio piora com a correção, porque o número honesto seria pior ainda que o de hoje.
:::

:::exercicio {"id":"modelos-lineares-e4","tipo":"numerica","objetivo":"O3","dificuldade":"facil"}
Pelo ajuste múltiplo acima, quantos panfletos precisam ser distribuídos para vender **um copo a mais**? Responda com um número inteiro aproximado.

> **gabarito:** 53 ± 4
> **porque:** O coeficiente é 0,0188 copo por panfleto, então um copo pede 1 ÷ 0,0188 ≈ 53 panfletos.
>
> O engano previsível é multiplicar em vez de dividir, o que devolve 0,0188 e não responde à pergunta feita. O número importa menos que o hábito: **inverter o coeficiente devolve a unidade que a decisão usa**. "0,0188" não diz nada a quem manda imprimir panfleto; "53 panfletos por copo" diz, e diz que a panfletagem provavelmente não se paga.
>
> E a ressalva vale mais que a conta: `panfletos` correlaciona +0,798 com `temperatura`, então parte desses 0,0188 é calor. O número real, se a barraca distribuísse panfletos sem escolher o dia, seria **menor** ainda.
> **volte para:** #o-panfleto-de-brinde
:::

:::cartao {"nivel":3,"titulo":"Reproduza, e tente o conserto óbvio"}

### Reproduza

```python
df.corr(numeric_only=True)["vendas"]                     # a tabela ingênua
df.groupby("preco")[["temperatura", "vendas"]].mean()    # a revelação
df.assign(mes=df.data.dt.month).groupby("mes").preco.nunique()
```

O conserto óbvio seria **isolar um período em que o preço varie sem a estação variar junto**. A terceira linha responde se ele existe, e a resposta é **1 para todos os doze meses**.

:::interacao {"id":"modelos-lineares-i18","tipo":"prever","titulo":"Preços distintos em julho","numero":1}
Você decide salvar a análise restringindo o conjunto a julho, onde o calor é parecido dia após dia, e ajustando `vendas` contra `preco` só ali.

> **pergunta:** Quantos preços distintos julho tem?
> **revela:** **Um.** Julho inteiro foi vendido a 0,50, e o mesmo vale para os outros onze meses, cada um com o seu preço único.
>
> É o passo 5 da dedução voltando com roupa de negócio: dentro de julho, $S_{xx}$ do preço é zero, e não existe reta. O recorte que igualaria a estação é exatamente o recorte que apaga a variação do preço.
:::

:::exercicio {"id":"modelos-lineares-e27","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
A terceira linha devolve 1 para os doze meses. O que esse resultado prova?

- [ ] Que o conjunto tem um erro de coleta, e um mês perdeu suas linhas.
- [ ] Que o efeito do preço é pequeno, porque ele quase nunca foi mudado.
- [x] Que não há recorte mensal em que preço e estação variem separados.
- [ ] Que o modelo precisa de um atributo novo indicando o mês de cada dia.

> **gabarito:** não há recorte em que os dois variem separados
> **porque:** A contagem de valores distintos por mês é o teste direto da pergunta "existe comparação justa aqui dentro?". Doze respostas iguais a 1 dizem que não existe, e é um fato sobre o **desenho da coleta**, não sobre o modelo.
>
> A primeira alternativa lê o resultado como defeito de arquivo, quando ele é uma propriedade real e consistente dos 365 dias. A segunda troca ausência de variação por efeito pequeno, e essas duas coisas são opostas: sem variação não há efeito estimável, nem grande nem pequeno. A quarta piora o problema, porque um indicador de mês seria colinear com o preço e apenas transferiria a confusão de nome.
>
> É o teste que vale levar para qualquer dado alheio. Antes de estimar o efeito de uma coluna, conte em quantos recortes ela varia.
> **volte para:** #reproduza
:::

:::cartao {"nivel":3,"titulo":"O confundimento é perfeito"}

### O confundimento é perfeito

**Nenhum mês do ano tem mais de um preço.** São 0,30 de janeiro a junho e de setembro a dezembro, 0,50 nos 62 dias de julho e agosto. Restringir a julho não isola o efeito do preço: deixa o preço **constante**.

O confundimento aqui é **perfeito**: preço e estação são a mesma variável, com dois nomes. Estimar efeito de preço exigiria cobrar 0,30 e 0,50 dentro do mesmo mês. Esta é a resposta menos confortável e a mais honesta que a análise pode dar.

:::interacao {"id":"modelos-lineares-i24","tipo":"principio","titulo":"O dado que teria respondido"}
A pergunta da dona da barraca não tem resposta nestes 365 dias.

> **pergunta:** Descreva a coleta que teria respondido a ela.
> **revela:** Alternar os dois preços **dentro do mesmo mês**, de preferência sorteando o preço de cada dia. Assim o preço deixa de andar junto com a estação, e a diferença de vendas entre dias parecidos passa a ser atribuível a ele.
>
> Repare no que muda de lugar. A solução não está na análise, está na **coleta**, e nenhuma técnica aplicada depois inventa a variação que ninguém produziu.
>
> É por isso que o experimento é caro e vale o preço. Quem controla a atribuição do tratamento compra a única coisa que a observação não vende.
:::

:::exercicio {"id":"modelos-lineares-e6","tipo":"aberta","objetivo":"O4","dificuldade":"media"}
A dona da barraca de limonada quer decidir **o preço do próximo verão** e pede ajuda. Você tem os 365 dias do conjunto acima e um modelo linear com R² de 0,982.

Escreva a resposta que você daria a ela, em até seis linhas, sem jargão. Diga o que o modelo serve para responder, o que ele **não** serve, e o que você precisaria para responder a pergunta que ela fez.

> **rubrica:** Reconhece que o modelo prevê bem as vendas mas não estima o efeito do preço, porque nos dados o preço mudou junto com a estação; Não usa o R² alto como argumento a favor da recomendação de preço; Diz o que faltaria, variar o preço de propósito em dias comparáveis, porque nenhum recorte dos dados atuais resolve; Mantém o modelo como útil para o que ele faz bem, como prever demanda e dimensionar estoque; Responde em linguagem que a dona da barraca entende, sem exigir vocabulário técnico
> **porque:** Esta é a pergunta que separa "treinei um modelo" de "respondi a alguém". As três leituras que o exercício cobra estão no capítulo: o coeficiente não é causa, o R² alto não valida a recomendação, e o modelo linear continua sendo a escolha certa para **previsão de demanda**, que é outra pergunta.
>
> A resposta forte não é "não dá para saber". É separar as duas perguntas: *quantos copos vou vender amanhã, dado o tempo?* é respondida bem pelo modelo. *Quanto vendo a mais se eu baixar o preço?* não tem resposta no dado, porque o preço nunca variou sem a estação variar junto. E propor o desenho que traria essa informação: alternar preço entre dias parecidos, dentro do mesmo mês.
>
> Uma resposta que recomenda subir o preço citando o coeficiente positivo está errada mesmo que bem escrita, e é exatamente o relatório que o capítulo existe para impedir.
> **volte para:** #o-confundimento-e-perfeito
:::

:::cartao {"nivel":3,"titulo":"As quatro coisas que o coeficiente não diz"}

### As quatro coisas que ele não diz

A limonada mostrou duas delas em números. As quatro, em forma de lista de conferência:

1. **Não diz causalidade.** "Mantendo tudo mais constante" é operação sobre a equação, não intervenção no mundo. É o `preco` de julho.
2. **Não é comparável sem padronização.** Um coeficiente de 0,003 para renda em reais e 2,5 para filhos não diz que filhos importam mais.
3. **Não é confiável sob colinearidade.** Atributos que andam juntos trocam peso entre si. É o par `temperatura` e `panfletos`.
4. **Não vale fora da faixa observada.** Extrapolar uma reta produz o absurdo com aparência de rigor.

:::interacao {"id":"modelos-lineares-i19","tipo":"principio","titulo":"O que a métrica enxerga"}
Um painel com erro de treino, erro de validação e R², todo verde.

> **pergunta:** Quais dos quatro itens acima esse painel detectaria?
> **revela:** **Nenhum.** Todos os quatro são falhas de **leitura**, e a métrica mede acerto de previsão. A limonada é a prova em números: R² de 0,982 com o coeficiente do preço invertido de sinal.
>
> É por isso que a lista existe como lista, e não como alerta automático. Não há portão que a cobre, e a única defesa é alguém perguntar, antes de escrever a recomendação, de onde veio a variação de cada atributo.
>
> A ideia reaproveitável vale muito além da regressão: **um sistema só avisa sobre aquilo que ele mede**, e a pergunta cara é sempre quais erros ele não é capaz de perceber.
:::

:::exercicio {"id":"modelos-lineares-e12","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Num modelo de crédito, `renda_declarada` e `renda_comprovada` são quase idênticas. Com 200 linhas novas no treino, o coeficiente de um foi de +0,8 para −0,4, e o do outro fez o inverso. O erro de teste não mudou. Qual limitação isto ilustra?

- [ ] Não diz causalidade.
- [ ] Não é comparável entre atributos sem padronização.
- [x] Não é confiável sob colinearidade.
- [ ] Não vale fora da faixa observada.

> **gabarito:** não é confiável sob colinearidade
> **porque:** A assinatura está no enunciado inteiro: dois atributos que andam juntos, coeficientes que trocam de sinal com uma pequena mudança nos dados, e **erro que não piora**. Quando dois atributos carregam quase a mesma informação, muitas combinações de pesos produzem quase as mesmas previsões, e o ajuste escolhe entre elas por detalhes da amostra.
>
> As outras três não se sustentam neste enunciado. Causalidade exigiria uma afirmação sobre intervir no mundo, e ninguém interveio em nada. Padronização mudaria a escala dos dois coeficientes de forma estável, e o que se vê aqui é instabilidade. Faixa observada falaria de previsão para valores nunca vistos, e o problema aqui está no treino.
>
> É o modo de falha mais traiçoeiro do modelo linear, e a razão é a última frase do enunciado: a métrica não avisa. Um relatório de desempenho passa limpo enquanto a explicação que se dá ao regulador está invertida.
> **volte para:** #as-quatro-coisas-que-ele-nao-diz
:::

:::cartao {"nivel":4,"titulo":"Quando o linear é a escolha certa"}

## Quando o linear é a escolha certa

Não como consolo, e sim como decisão de engenharia.

:::interacao {"id":"modelos-lineares-i20","tipo":"principio","titulo":"Escolher o pior, de propósito"}
Uma pergunta que só tem resposta boa se você pensar no sistema inteiro, e não no placar.

> **pergunta:** Descreva uma situação em que você escolheria o linear **sabendo** que ele vai prever pior.
> **revela:** Há pelo menos cinco, e o cartão seguinte as lista: poucos dados por atributo, exigência de auditoria, probabilidade que vira dinheiro, linha de base obrigatória e latência apertada.
>
> O que as cinco têm em comum é o que a resposta fraca não vê: **nenhuma delas aparece na métrica de teste.** Latência, auditabilidade e calibração são requisitos do sistema, e a AUC não sabe que eles existem.
>
> Se a sua resposta foi "quando os dados são poucos", você achou a linha mais citada e a menos interessante. As outras quatro é que decidem projeto de verdade.
:::

:::exercicio {"id":"modelos-lineares-e41","tipo":"completar","objetivo":"O4","dificuldade":"facil"}
Complete: as cinco linhas da tabela seguinte são ______ do sistema, e é por isso que nenhuma delas aparece na métrica de teste.

> **gabarito:** restrições|restricoes|requisitos|exigências|exigencias
> **porque:** A tabela não afirma que o linear prevê melhor. Ela lista **restrições** que o problema impõe antes de qualquer medição, e sob as quais um ganho de acerto precisa ser grande o bastante para pagar o que se perde.
>
> Quem responde "vantagens" inverte o sentido da seção, porque a vantagem é do problema e não do modelo. Quem responde "métricas" comete o erro que o cartão combate: latência, auditabilidade e calibração são exigências, e três delas nem são medidas por AUC.
>
> A consequência prática é a ordem de trabalho. Escreva as restrições antes de abrir o notebook, porque depois de ver o placar fica difícil não decidir por ele.
> **volte para:** #quando-o-linear-e-a-escolha-certa
:::

:::cartao {"nivel":4,"titulo":"As cinco situações, e nenhuma é o placar"}

| Situação | Por quê |
|---|---|
| **Poucos dados por atributo** | menos parâmetros, menos variância: com 200 linhas e 50 colunas, o ensemble decora |
| **Necessidade de auditoria** | um número por atributo, defensável. Exigência regulatória em crédito e seguro |
| **Probabilidade que vira dinheiro** | sai razoavelmente calibrado; ensembles frequentemente não (cap. II.1) |
| **Linha de base obrigatória** | é a régua contra a qual o modelo complexo se justifica |
| **Latência apertada** | uma multiplicação de vetores, muito mais rápida que uma floresta |

:::interacao {"id":"modelos-lineares-i38","tipo":"prever","titulo":"A linha que vale sempre"}
Quatro linhas só entram com a restrição correspondente. Uma vale sempre.

- ( ) Poucos dados por atributo.
- ( ) Necessidade de auditoria.
- (!) Linha de base obrigatória.

> **pergunta:** Qual delas?
> **revela:** **Linha de base obrigatória.** As outras quatro dependem do contexto: só valem se houver pouco dado, regulador, dinheiro multiplicado ou prazo de resposta.
>
> A linha de base não depende de nada disso. Ela responde "quanto do sinal é simplesmente linear?", e essa pergunta existe em todo problema, inclusive naqueles em que o linear vai perder feio no fim.
:::

:::exercicio {"id":"modelos-lineares-e25","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Um time tem 15 000 linhas, 8 atributos, nenhuma exigência de auditoria e nenhum limite de latência. O que a tabela diz sobre a escolha?

- [ ] Nada muda: o linear vence pelas cinco linhas da tabela.
- [x] Nenhuma se aplica: a escolha volta a ser empírica.
- [ ] O linear fica desaconselhado: há dados demais.
- [ ] A calibração deixa de importar num conjunto grande.

> **gabarito:** nenhuma se aplica, e a escolha volta a ser empírica
> **porque:** A tabela é uma lista de **restrições**, não uma preferência por família de modelo. Sem restrição ativa, o critério que sobra é o de sempre: meça no conjunto de teste e escolha o que serve melhor à decisão.
>
> A primeira alternativa lê a tabela como manifesto, que é o oposto da abertura da seção. A terceira inventa uma proibição inexistente, porque muitos dados não impedem um linear de ser adequado quando a relação é de fato linear. A quarta confunde tamanho do conjunto com calibração, e um modelo mal calibrado continua mal calibrado com um milhão de linhas.
>
> Sobra uma linha da tabela que vale mesmo sem restrição nenhuma, e ela é o assunto do próximo cartão.
> **volte para:** #quando-o-linear-e-a-escolha-certa
:::

:::cartao {"nivel":4,"titulo":"O caso da seguradora"}

### O caso da seguradora

Quatro restrições numa proposta só, e nenhuma delas é sobre acertar mais.

:::interacao {"id":"modelos-lineares-i21","tipo":"principio","titulo":"O que a AUC não vê"}
Uma seguradora precisa de: modelo treinado em 300 apólices com 40 atributos, resposta em menos de 10 ms, justificativa por escrito ao regulador em cada recusa, e probabilidade multiplicada pelo valor da apólice para calcular a provisão.

> **pergunta:** Quais dessas quatro restrições apareceriam numa comparação feita só por AUC?
> **revela:** Só a **primeira**, e mesmo assim de lado: com 300 linhas e 40 atributos o ensemble decora, e isso chega à AUC de teste como variância alta entre partições.
>
> As outras três são invisíveis para qualquer métrica de acerto. Latência é engenharia, auditabilidade é regulação, e calibração é uma propriedade da probabilidade que a AUC ignora por construção, porque ela só olha ordenação.
>
> É o argumento inteiro do capítulo numa frase: **escolher modelo pelo placar é escolher olhando um quarto do problema.**
:::

:::exercicio {"id":"modelos-lineares-e14","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Ainda no caso da seguradora acima: quais dessas restrições, sozinhas, já apontam para o modelo linear? (marque todas que valem)

- [x] 300 linhas para 40 atributos.
- [x] Resposta em menos de 10 ms.
- [x] Justificativa por escrito ao regulador.
- [x] Probabilidade multiplicada por dinheiro.
- [ ] Nenhuma: a escolha do modelo depende só da métrica no teste.

> **gabarito:** as quatro restrições
> **porque:** Cada uma corresponde a uma linha da tabela anterior, e o exercício existe para mostrar que elas se acumulam. Poucos dados por atributo favorecem menos parâmetros e menos variância. Latência apertada favorece uma multiplicação de vetores. Auditoria favorece um número por atributo, defensável e questionável. E probabilidade que vira dinheiro exige calibração, que o linear costuma entregar razoavelmente e ensembles frequentemente não.
>
> A quinta alternativa é a que o capítulo combate desde o título. Escolher pelo teste sozinho ignora que três das quatro restrições acima nem aparecem numa métrica: latência, auditabilidade e calibração não são medidas por AUC.
>
> Repare no que o item **não** afirma. Nada disso garante que o linear terá o melhor desempenho preditivo. Ele diz que, sob estas restrições, um ganho de desempenho precisaria ser grande o bastante para pagar quatro perdas simultâneas.
> **volte para:** #quando-o-linear-e-a-escolha-certa
:::

:::cartao {"nivel":4,"titulo":"Treine sempre um linear primeiro"}

### Treine sempre um linear primeiro

A linha de base tem um corolário que vale sozinho: **sempre treine um linear primeiro**. Ele custa minutos e responde à pergunta anterior a todas as outras, que é "quanto do sinal é simplesmente linear?".

E o contraexemplo honesto, para o corolário não virar fé: no [capítulo II.5](ii-5-arvores-ensembles.md) o linear faz **0,4963 de AUC** contra **0,9392** do boosting, num dado de fronteira irregular.

:::interacao {"id":"modelos-lineares-i22","tipo":"prever","titulo":"Quando o ganho é pequeno"}
Você treinou o linear, treinou o complexo depois, e no mesmo teste o ganho do segundo foi pequeno.

- ( ) O complexo foi mal configurado.
- (!) O sinal é quase todo linear.
- ( ) O teste é pequeno demais.

> **pergunta:** O que esse resultado revelou?
> **revela:** Que **o sinal é quase todo linear**. A linha de base não serve para ser vencida: ela serve para dizer quanto de estrutura o problema tem além de uma soma ponderada.
>
> E aí a conta vira de engenharia. O ganho pequeno é permanente, e o custo do modelo complexo também: mais dependências, mais tempo de treino, mais superfície para quebrar, e uma explicação que ninguém escreve na carta de recusa.
>
> Quem previu "mal configurado" fez a aposta que custa semanas. Ela às vezes é verdadeira, e por isso a ordem importa: só vale investigá-la depois de a linha de base ter sido medida.
:::

:::exercicio {"id":"modelos-lineares-e13","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Por que sempre treinar um modelo linear primeiro?

- [x] Porque diz em minutos quanto do sinal é linear.
- [ ] Porque ele costuma vencer o modelo complexo.
- [ ] Porque o modelo complexo exige um linear antes.
- [ ] Porque é a única forma de achar vazamento no dado.

> **gabarito:** custa minutos e diz quanto do sinal é linear
> **porque:** É uma decisão de engenharia, não de gosto. O linear é a régua contra a qual o modelo complexo precisa se justificar, e a resposta dele muda o que vale a pena fazer depois.
>
> "Costuma vencer" é falso, e o próprio capítulo dá o contraexemplo: 0,4963 de AUC contra 0,9392 do boosting, no capítulo II.5. "Exige um linear antes" inventa uma dependência técnica que não existe, já que árvores e ensembles não pedem coeficiente nenhum para funcionar. E "achar vazamento" confunde linha de base com auditoria de dados, porque vazamento se detecta olhando como as colunas foram construídas.
>
> O corolário é o que se leva: se o modelo complexo ganha pouco do linear, você acabou de descobrir que o problema é fácil, e que a diferença entre os dois é custo de manutenção pelo resto da vida do sistema.
> **volte para:** #treine-sempre-um-linear-primeiro
:::

:::cartao {"nivel":5,"titulo":"O aperto: nenhuma observação concorda"}

## De onde isto veio

**O aperto.** Virada do século XVIII para o XIX, astronomia. Um cometa é observado em noites diferentes, por instrumentos diferentes, e **nenhuma das observações concorda com as outras**. A órbita é uma só, e o astrônomo não tem critério defensável para escolher a curva.

**O que se fazia antes.** Escolhia-se a olho, descartava-se a observação pior, ou faziam-se médias de subconjuntos convenientes. Todos com o mesmo defeito: **dois astrônomos competentes chegavam a órbitas diferentes**.

:::interacao {"id":"modelos-lineares-i28","tipo":"prever","titulo":"Dois astrônomos, os mesmos dados"}
Dois astrônomos recebem as mesmas observações discordantes e escolhem a órbita a olho.

- ( ) A mesma órbita: o dado é o mesmo.
- (!) Órbitas diferentes, e sem árbitro.
- ( ) Órbitas diferentes, e a média vale.

> **pergunta:** O que eles obtêm?
> **revela:** **Órbitas diferentes, e sem árbitro.** O problema não era falta de dado nem falta de talento: era não existir uma regra escrita que dissesse o que "melhor curva" significa.
>
> A terceira opção parece conciliadora e não resolve nada, porque a média de duas escolhas arbitrárias continua arbitrária. Sem critério declarado, não há como preferir uma resposta, nem como reconstruir a resposta de ontem.
:::

:::exercicio {"id":"modelos-lineares-e31","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Que problema os mínimos quadrados vieram resolver naquela astronomia?

- [x] Faltava regra explícita do que é a melhor curva.
- [ ] Faltava observação para determinar a órbita direito.
- [ ] O instrumento era impreciso, e o erro de medida grande.
- [ ] Faltava como calcular à mão com tantas observações.

> **gabarito:** faltava uma regra explícita do que é "a melhor curva"
> **porque:** O aperto era de **critério**, não de matéria-prima. Observações havia de sobra, e o excesso é que criava o problema: elas discordavam, e nada dizia como arbitrar entre as curvas candidatas.
>
> "Faltava observação" inverte o quadro, porque com poucas observações não haveria discordância a resolver. O instrumento impreciso descreve uma causa real do desacordo e não o problema a resolver: o erro de medida é o motivo de os pontos não caírem sobre uma curva, e o método existe justamente para conviver com ele. E a dificuldade de calcular à mão era um custo verdadeiro da época sem ser o que travava, porque mesmo com todo o tempo do mundo, sem critério não há resposta a calcular.
>
> É esse o sentido de dizer que a regressão **é** uma minimização. O que se inventou não foi a reta, foi o que conta como melhor reta.
> **volte para:** #de-onde-isto-veio
:::

:::cartao {"nivel":5,"titulo":"A virada: uma regra pública"}

### A virada: uma regra pública

**A virada.** Trocar "a melhor curva" por **uma regra explícita do que significa melhor**: aquela que torna mínima a soma dos quadrados dos desvios. A regra não é mais verdadeira que as outras, ela é **pública**. Dados os mesmos números, devolve a mesma resposta para qualquer pessoa.

**O nome.** *Mínimos quadrados*, em francês *moindres carrés*, foi batizado por Legendre, e o nome é literalmente a definição do critério.

:::interacao {"id":"modelos-lineares-i29","tipo":"principio","titulo":"Por que 'pública' é a palavra certa"}
A regra dos mínimos quadrados não é mais verdadeira que as alternativas dela.

> **pergunta:** Então o que ela ganha, se não ganha em verdade?
> **revela:** Ganha em **reprodutibilidade e em discutibilidade**. Escrita a regra, duas pessoas com os mesmos números chegam à mesma curva, e quem discordar tem onde bater: no critério, que está declarado, e não no gosto de quem ajustou.
>
> Repare que isso é exatamente o que o capítulo cobra do seu trabalho hoje. Script, semente fixa e saída colada existem pelo mesmo motivo que a regra existiu em 1805, que é permitir a outra pessoa refazer e discordar.
>
> A ideia reaproveitável: **um critério declarado transforma uma disputa de opinião numa disputa de premissa.**
:::

:::exercicio {"id":"modelos-lineares-e32","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
O que a regra de minimizar a soma dos quadrados dos desvios trouxe que o "escolher a olho" não tinha?

- [ ] Uma curva mais próxima da órbita verdadeira do que qualquer outra.
- [ ] Uma forma de descartar automaticamente as observações defeituosas.
- [x] Uma resposta igual para quem refizer a conta.
- [ ] Uma medida do erro de cada instrumento usado na observação.

> **gabarito:** a mesma resposta para qualquer pessoa
> **porque:** O ganho é de **arbitragem**, não de verdade. A regra fixa o que conta como melhor, e a partir daí o resultado deixa de depender de quem está segurando a régua.
>
> A primeira alternativa promete o que nenhum critério entrega: minimizar o quadrado dá a melhor curva **sob aquele critério**, e trocar o critério troca a curva. A segunda descreve descarte de *outlier*, que o erro quadrático justamente não faz, porque ele persegue o ponto distante em vez de ignorá-lo. A quarta confunde o método com a calibração de instrumento, que é outro problema inteiro.
>
> É por isso que a seção diz que a regra é **pública**. Duas pessoas podem discordar dela, e agora elas discordam de algo escrito.
> **volte para:** #a-virada-uma-regra-publica
:::

:::cartao {"nivel":5,"titulo":"Perda é critério de arbitragem"}

### Perda é critério de arbitragem

**A ideia reaproveitável.** **Uma função de perda é um critério de arbitragem, não uma descoberta sobre o mundo.** Ela existe para tornar a escolha reproduzível e discutível. É por isso que a pergunta "por que erro *quadrático*, e não valor absoluto?" tem resposta honesta, que é conveniência matemática mais uma hipótese sobre o ruído, e não a resposta "porque é o certo".

:::interacao {"id":"modelos-lineares-i30","tipo":"prever","titulo":"Trocar a perda é trocar o quê"}
Uma equipe decide minimizar o erro absoluto em vez do quadrático, no mesmo problema e com os mesmos dados.

- ( ) O modelo, porque a reta deixa de ser uma soma ponderada.
- ( ) Nada de essencial, porque as duas perdas medem o mesmo erro.
- (!) O critério de arbitragem, e com ele a reta que sai vencedora.

> **pergunta:** O que essa equipe está trocando?
> **revela:** O **critério**. A família de modelos continua a mesma reta, e o que muda é a regra que decide qual reta ganha, porque o absoluto pesa o ponto distante dez vezes onde o quadrático pesa cem.
>
> A segunda opção é a confusão que a seção existe para desfazer. Perda não é uma propriedade do mundo que se descobre: é uma escolha declarada, e por isso trocá-la é decisão de projeto que precisa ser justificada e registrada.
:::

:::exercicio {"id":"modelos-lineares-e33","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Segundo este capítulo, o que se está fazendo ao trocar a função de perda de um modelo?

- [ ] Corrigindo um erro de modelagem que a perda anterior introduzia.
- [ ] Ajustando um detalhe técnico do otimizador, sem efeito no resultado.
- [ ] Escolhendo uma família de modelos diferente da que se tinha antes.
- [x] Trocando o critério que decide qual solução conta como a melhor.

> **gabarito:** trocando o critério de arbitragem
> **porque:** A perda define o que "melhor" significa naquele problema. Trocá-la muda a resposta vencedora sem mudar nem os dados nem a família de modelos, e por isso é **decisão de projeto**, com consequência sobre quem o modelo vai favorecer.
>
> A primeira alternativa supõe que existe uma perda correta a ser descoberta, e é exatamente a crença que a seção desfaz. A segunda é falsa e perigosa, porque a perda não é detalhe do otimizador: ela é o alvo, e trocar o alvo troca o resultado. A terceira confunde critério com hipótese, já que a reta continua reta com qualquer uma das duas perdas.
>
> O teste prático: se alguém trocar a perda do seu modelo sem escrever por quê, você perdeu o registro de qual erro o sistema decidiu tolerar.
> **volte para:** #perda-e-criterio-de-arbitragem
:::

:::cartao {"nivel":5,"titulo":"A disputa de prioridade"}

### A disputa de prioridade mais famosa da estatística

**Legendre publicou primeiro**, em 1805, em *Nouvelles méthodes pour la détermination des orbites des comètes*, e deu ao método o nome que ficou. **Gauss publicou em 1809** (*Theoria motus corporum coelestium*) afirmando usar o método desde 1795.

Legendre reagiu mal, e o argumento dele é o que interessa aqui: **prioridade se estabelece por publicação**. Em 1820 atacou publicamente a reivindicação. Gauss entendia prioridade como *ser o primeiro a descobrir*, e apoiava-se em registros privados e correspondência.

:::interacao {"id":"modelos-lineares-i31","tipo":"prever","titulo":"O que estava em disputa"}
Legendre e Gauss disputaram a autoria de alguma coisa, e vale ser exato sobre o quê.

- ( ) Da ideia de ajustar uma reta.
- (!) Da regra que minimiza os quadrados.
- ( ) Do cálculo da órbita do cometa.

> **pergunta:** O que estava em disputa?
> **revela:** A **regra**. Ajustar curvas a observações discordantes já se fazia, mal e sem critério; o que nenhum dos dois inventou foi a reta, e o que os dois reivindicaram foi o critério que decide qual curva vence.
>
> É a mesma distinção que o capítulo inteiro sustenta. O modelo é a forma somada; o método é a minimização. Confundir os dois faz parecer que a contribuição foi desenhar uma reta.
:::

:::exercicio {"id":"modelos-lineares-e34","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Sobre a disputa, qual afirmação o capítulo sustenta?

- [ ] Que Gauss provou o uso desde 1795, e está encerrado.
- [ ] Que Legendre inventou a reta, e Gauss a divulgou.
- [ ] Que os dois chegaram ao método no mesmo ano.
- [x] Que Legendre publicou antes, e Gauss reivindicou.

> **gabarito:** Legendre publicou primeiro, e Gauss reivindicou uso anterior
> **porque:** É o que as fontes seladas do capítulo sustentam, e nada além disso. A tabela de procedência marca as duas obras com ✓ᵐ, o que confere obra, ano e conteúdo geral, e não autoriza afirmar mais do que a existência e a data de cada publicação.
>
> A primeira alternativa transforma a reivindicação de Gauss em prova, e o próprio estudo de referência argumenta **sem concluir**. A segunda inverte os papéis e ainda erra o objeto, porque o que se disputava era o critério, não o desenho da reta. A terceira inventa uma simultaneidade que nenhuma fonte deste capítulo afirma.
>
> Repare no cuidado de registro: "a literatura atribui a X" e "X publicou em 19NN" são frases diferentes, e a segunda é a única que este cartão faz.
> **volte para:** #a-disputa-de-prioridade-mais-famosa-da-estatistica
:::

:::cartao {"nivel":5,"titulo":"Stigler, e o caso segue aberto"}

O estudo de referência sobre a disputa é o de **Stephen Stigler** (1981), e vale citar a conclusão dele com o hedge que ele mesmo pôs: *"It is argued (though not conclusively) that Gauss probably possessed the method well before Legendre, but that he was unsuccessful in communicating it to his contemporaries."*

Argumenta-se, **sem concluir**, que Gauss provavelmente tinha o método bem antes, e que falhou em comunicá-lo. Stigler acrescenta que dados do arco meridiano francês poderiam, concebivelmente, permitir uma verificação definitiva, ou seja, o caso segue **aberto**.

:::interacao {"id":"modelos-lineares-i32","tipo":"principio","titulo":"O peso de 'though not conclusively'"}
O resumo de Stigler traz, entre parênteses, a ressalva *though not conclusively*.

> **pergunta:** O que muda numa citação quando essa ressalva é preservada, e o que mudaria se ela fosse cortada?
> **revela:** Preservada, ela reporta um **argumento**. Cortada, a mesma frase vira uma conclusão estabelecida, e o leitor passa a acreditar que a prioridade de Gauss está resolvida quando o próprio autor diz que não está.
>
> É a diferença entre citar e usar a citação. O corte não inventa palavra nenhuma, e mesmo assim inverte o estatuto da afirmação, que é o tipo de erro mais difícil de auditar depois.
>
> A regra que fica é a mesma que este livro aplica aos próprios números: **hedge do autor é parte da afirmação, e removê-lo é alterá-la.**
:::

:::exercicio {"id":"modelos-lineares-e35","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
O que o resumo de Stigler, tal como o capítulo o cita, permite afirmar?

- [ ] Que está provado que Gauss possuía o método bem antes de Legendre.
- [x] Que se argumenta, sem concluir, que Gauss o possuía bem antes.
- [ ] Que Gauss não possuía o método antes, e a reivindicação era falsa.
- [ ] Que a comunidade científica da época conhecia o método por Gauss.

> **gabarito:** argumenta-se, sem concluir
> **porque:** A ressalva *though not conclusively* está na frase citada, e ela é parte da afirmação. O capítulo pode reportar a tese que os autores **declaram**, e não pode transformá-la em fato demonstrado.
>
> A primeira alternativa é o erro que a ressalva existe para impedir, e é o mais fácil de cometer porque a frase soa conclusiva sem os parênteses. A terceira inverte o argumento, e ninguém afirmou isso. A quarta contradiz o próprio resumo, que diz o contrário: Gauss **falhou** em comunicar o método aos contemporâneos.
>
> Vale ligar isto ao que o capítulo cobra do leitor. Um critério só serve como árbitro se for comunicado, e um resultado só existe para os outros depois de publicado de forma que dê para conferir.
> **volte para:** #a-disputa-de-prioridade-mais-famosa-da-estatistica
:::

:::cartao {"nivel":5,"titulo":"Crédito não segue descoberta"}

**O espelho disto está no [capítulo III.1](iii-1-neuronio-artificial.md).** Lá, quem leva o crédito pelo backpropagation são os últimos (Rumelhart *et al.*, 1986), não o primeiro (Linnainmaa, 1970), e a leitura deste livro é que o crédito fica com quem reinventa por último. Aqui o caso é o inverso exato: o primeiro descobridor perde para o primeiro **publicador**.

Juntos, os dois dizem o que nenhum diz sozinho: **crédito não segue descoberta, segue comunicação.**

:::interacao {"id":"modelos-lineares-i33","tipo":"principio","titulo":"O experimento que não aconteceu"}
Você rodou um experimento, viu o resultado na tela e seguiu para a próxima tarefa sem registrar semente, script nem saída.

> **pergunta:** Em que sentido esse experimento não aconteceu?
> **revela:** No único sentido que importa para quem não estava lá. Ninguém pode refazê-lo, ninguém pode discordar dele com precisão, e você mesmo, em três meses, não vai conseguir reconstruir a versão exata que produziu aquele número.
>
> É a lição de Gauss aplicada ao seu repositório. Ele tinha o método antes, e o que ficou foi a publicação de Legendre, porque comunicação é o que torna um resultado disponível para terceiros.
>
> Por isso este livro exige script, *seed* e saída colada. Não é burocracia: é a diferença entre um resultado e uma lembrança.
:::

:::exercicio {"id":"modelos-lineares-e36","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
O capítulo lê a disputa Legendre-Gauss junto com o caso do backpropagation, no capítulo III.1. Qual é a leitura que ele extrai dos dois?

- [ ] Que o primeiro a descobrir sempre acaba reconhecido, mais cedo ou mais tarde.
- [ ] Que disputas de prioridade são ruído, e não mudam o uso do método.
- [x] Que o crédito acompanha a comunicação do resultado, e não a descoberta.
- [ ] Que publicar cedo demais prejudica quem ainda está aperfeiçoando a ideia.

> **gabarito:** o crédito acompanha a comunicação
> **porque:** Os dois casos apontam para o mesmo lado por caminhos opostos. Em um, o primeiro **publicador** leva; no outro, quem reinventa por último e comunica melhor leva. O que sobrevive nos dois é a comunicação.
>
> A primeira alternativa é desmentida pelos dois casos ao mesmo tempo. A segunda trata a disputa como fofoca, e ela é a evidência que sustenta a exigência prática do livro. A quarta inventa uma moral oposta, que nenhum dos dois casos sustenta.
>
> Esta é uma **leitura editorial**, marcada como tal na tabela de procedência abaixo. Ela interpreta dois episódios, e não é uma afirmação histórica sobre nenhum deles.
> **volte para:** #a-disputa-de-prioridade-mais-famosa-da-estatistica
:::

:::cartao {"nivel":5,"titulo":"Procedência das afirmações"}

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Legendre (1805) e Gauss (1809): obra, ano e conteúdo geral. Nenhuma das duas lida no original |
| ✓ᵃ | A tese que **Stigler declara** e o trecho citado entre aspas, do resumo de ["Gauss and the Invention of Least Squares"](https://projecteuclid.org/journals/annals-of-statistics/volume-9/issue-3/Gauss-and-the-Invention-of-Least-Squares/10.1214/aos/1176345451.full), *Annals of Statistics* 9(3):465–474, 1981, [10.1214/aos/1176345451](https://doi.org/10.1214/aos/1176345451) — **resumo lido no original; o corpo, não** |
| ⏳ | As notas de Olbers (1816) e Bessel (1832), e o ataque público de Legendre em 1820. O resumo de Stigler fala em "new evidence, both documentary and statistical", **sem nomear quais** |
| 📖 | A ideia reaproveitável ("perda é critério de arbitragem") e a ligação com o capítulo III.1 |

:::interacao {"id":"modelos-lineares-i34","tipo":"prever","titulo":"O selo da ideia reaproveitável"}
"Perda é critério de arbitragem" é a frase que este capítulo mais quer que você leve embora.

- ( ) ✓, fonte aberta e lida.
- ( ) ✓ᵐ, metadados conferidos.
- (!) 📖, leitura deste livro.

> **pergunta:** Que selo ela leva na tabela, e por quê?
> **revela:** **📖.** Nenhum documento de 1805 diz "função de perda é critério de arbitragem": a frase é a interpretação que este livro faz do que aconteceu, e vender interpretação como fato histórico é uma das três proibições da casa.
>
> Repare que o selo não enfraquece a ideia. Ele diz de onde ela vem, e é justamente por vir de leitura editorial que ela pode ser discutida sem que ninguém precise abrir um arquivo de 1805.
:::

:::exercicio {"id":"modelos-lineares-e37","tipo":"completar","objetivo":"O1","dificuldade":"dificil"}
"Perda é critério de arbitragem" não é afirmação de fonte histórica: é ______ deste livro, e o selo 📖 existe para dizer isso.

> **gabarito:** leitura editorial|leitura|interpretação|interpretacao|uma leitura editorial
> **porque:** O 📖 marca o que o livro **conclui**, separando-o do que as fontes **dizem**. A frase é a tradução da virada de 1805 para uma regra de projeto de hoje, e essa tradução é responsabilidade do autor deste capítulo.
>
> Três respostas próximas erram, e cada uma por um selo diferente. Quem responde "fonte não encontrada" descreveu o ❌, que é procurar e não achar; aqui ninguém procurou, porque não há o que procurar. Quem responde "hipótese" trata uma leitura conceitual como afirmação empírica à espera de experimento. E quem responde "metadado" descreveu o ✓ᵐ, que confere que uma obra existe e nada diz sobre o que ela afirma.
>
> A distinção tem consequência prática. Você pode discordar da leitura sem contestar nenhum fato histórico, o que é exatamente o tipo de discordância que um livro deve tornar possível.
> **volte para:** #de-onde-isto-veio
:::

:::cartao {"nivel":5,"titulo":"Mão na massa"}

## Mão na massa

A **etapa 05–06** do [`ml-zero`](../trilha-ml-zero.md) implementa, em biblioteca padrão, a `RegressaoLinear` com **os dois caminhos** (solução fechada por eliminação de Gauss e gradiente) para você conferir que chegam ao mesmo lugar, e o `Padronizador`, que aprende no treino e **aplica** ao teste.

**Notebook pronto para executar** — [`regressao_limonada.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb) · [abrir no Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb)

:::interacao {"id":"modelos-lineares-i35","tipo":"prever","titulo":"Onde o padronizador aprende"}
O `Padronizador` guarda a média e o desvio de cada atributo para poder reescalar os dados.

- ( ) No conjunto inteiro, antes de separar treino e teste.
- (!) Só no treino, e depois aplica os mesmos números ao teste.
- ( ) Em cada conjunto separadamente, com os números de cada um.

> **pergunta:** De onde ele tira esses números?
> **revela:** **Só do treino.** Aplicar ao teste os números aprendidos no treino é o que mantém o teste intocado.
>
> As outras duas opções são a mesma falha com roupas diferentes. Calcular no conjunto inteiro deixa a média do teste entrar no treino, e padronizar cada conjunto com os próprios números faz o modelo receber, na hora de avaliar, uma escala que ele nunca viu. Nos dois casos o número final fica melhor do que a realidade, que é o vazamento do [capítulo I.3](i-3-dados.md).
:::

:::exercicio {"id":"modelos-lineares-e38","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Por que a etapa 05 implementa as duas rotas, solução fechada e gradiente, em vez de só a mais rápida?

- [x] Porque poder comparar as duas torna o gradiente confiável.
- [ ] Porque as duas dão respostas diferentes, e a média delas é melhor.
- [ ] Porque a solução fechada falha em conjuntos com muitas linhas.
- [ ] Porque o gradiente é exigido pela biblioteca padrão da trilha.

> **gabarito:** comparar as duas é o que torna o gradiente confiável
> **porque:** A etapa existe para o leitor ver, com os próprios dados, que as duas rotas param no mesmo lugar. É a única vez na trilha em que há resposta exata para servir de régua, e a confiança construída aqui é gasta na regressão logística, onde régua não existe.
>
> "Respostas diferentes" inventa um desacordo que o experimento nega, já que a diferença medida fica abaixo de 0,05 por coeficiente. "Falha com muitas linhas" troca linhas por colunas: o que encarece a solução fechada é a quantidade de **atributos**, porque a matriz a inverter é $d \times d$. E "exigido pela biblioteca" inverte a dependência, porque a biblioteca padrão não exige método nenhum.
>
> Vale notar o que a mesma etapa serve ao [capítulo II.4](ii-4-otimizacao.md): o 05 pergunta que função o modelo representa, e o 06 pergunta como se chega aos coeficientes.
> **volte para:** #mao-na-massa
:::

:::cartao {"nivel":5,"titulo":"Síntese — o que levar"}

## Síntese — o que levar

- Regressão linear minimiza **erro quadrático** por diferenciabilidade e solução fechada, não por ser intrinsecamente mais correto.
- A dedução dá **duas condições**: a soma dos resíduos é zero, e os resíduos são ortogonais ao atributo.
- $a = S_{xy}/S_{xx}$, e o denominador avisa: **atributo que não varia não tem coeficiente**.
- Gradiente e solução fechada chegam ao mesmo lugar. O gradiente é a ferramenta **geral**; a fechada é o caso de sorte.
- Coeficiente **não é causa**, não é comparável sem padronização, não é estável sob colinearidade, e não vale fora da faixa observada.
- Treine sempre um linear primeiro, porque ele responde em minutos quanto do sinal é simplesmente linear.
- **Uma perda é um critério de arbitragem**: quem escolhe a perda escolhe o que conta como erro.

:::interacao {"id":"modelos-lineares-i36","tipo":"principio","titulo":"A frase que você diria ao colega"}
Um colega quer aprovar um ensemble para um sistema de crédito sem treinar o linear antes.

> **pergunta:** Escreva a frase que você diria a ele, usando uma das linhas acima.
> **revela:** A frase mais forte não é sobre acerto: é que **sem a linha de base ninguém sabe quanto do ganho é real**, e que um sistema de crédito ainda vai precisar de uma explicação por escrito em cada recusa.
>
> Se a sua frase falou só de desempenho, ela perde a discussão no dia em que o ensemble ganhar por pouco. As duas que não perdem são a linha de base e a auditoria, porque nenhuma delas depende de quem ficou na frente no teste.
:::

:::exercicio {"id":"modelos-lineares-e39","tipo":"completar","objetivo":"O1","dificuldade":"media"}
Complete a síntese do capítulo: uma função de perda é um ______ de arbitragem, e não uma descoberta sobre o mundo.

> **gabarito:** critério|criterio
> **porque:** É a ideia reaproveitável desta lição, e ela reposiciona tudo o mais. A perda declara o que conta como erro, e a partir dessa declaração o resto do método é consequência mecânica.
>
> Duas respostas próximas erram por motivos diferentes. Quem responde "método" troca a regra pelo procedimento que a executa, e o procedimento é o que muda quando você troca gradiente por álgebra. Quem responde "modelo" troca a regra pela família de funções, e a reta continua reta com qualquer perda.
>
> O teste de que a ideia foi absorvida é conseguir usá-la fora daqui. Toda vez que um sistema classifica, ordena ou recomenda, alguém escolheu um critério, e essa escolha é discutível.
> **volte para:** #sintese-o-que-levar
:::

:::cartao {"nivel":5,"titulo":"Verificação"}

## Verificação

1. Mostre, sem consultar o texto, por que a reta de mínimos quadrados passa necessariamente pelo ponto $(\bar{x}, \bar{y})$.
2. Você tem 180 linhas e 60 atributos. Que família de modelo você tenta primeiro, e por quê?
3. Dois atributos do seu modelo são quase idênticos. O erro de validação está ótimo. O que pode estar errado mesmo assim?
4. No laboratório, o que aconteceria com a reta ótima se todos os pontos tivessem o mesmo $x$? Responda pela fórmula, não pelo desenho.

:::interacao {"id":"modelos-lineares-i37","tipo":"principio","titulo":"A primeira, de cabeça"}
Responda a questão 1 acima antes de revelar, escrevendo o argumento inteiro com suas palavras.

> **pergunta:** Por que a reta ótima passa por $(\bar{x}, \bar{y})$?
> **revela:** No mínimo, a derivada da perda em relação a $b$ se anula, e isso equivale a dizer que a soma dos resíduos é zero. Dividindo por $n$, a média dos resíduos é zero, o que dá $\bar{y} - a\bar{x} - b = 0$. Logo o ponto $(\bar{x}, \bar{y})$ satisfaz a equação da reta.
>
> Compare com o que você escreveu. Se o seu argumento partiu do desenho, ou de "faz sentido que passe pelo meio", ele não é uma demonstração: o que fecha a questão é a condição de primeira ordem, e nada além dela.
:::

:::exercicio {"id":"modelos-lineares-e40","tipo":"numerica","objetivo":"O4","dificuldade":"media"}
Na questão 2 acima, você tem 180 linhas e 60 atributos. Quantos números um modelo linear com intercepto precisa estimar nesse conjunto?

> **gabarito:** 61
> **porque:** Um coeficiente por atributo, mais o intercepto: 60 + 1 = **61**. Compare com as 180 linhas disponíveis e você tem três exemplos por parâmetro, que é pouco.
>
> Quem responde 60 esqueceu o intercepto, que também é estimado dos dados e não é uma constante dada. Quem responde 180 confundiu parâmetro com exemplo, e essa troca é o coração da questão: o que decide a variância do ajuste é a **razão** entre os dois números.
>
> É a primeira linha da tabela de decisão do capítulo, agora em números. Com três linhas por parâmetro, um ensemble teria muito mais o que estimar errado, e é por isso que a resposta à questão 2 é começar pelo linear.
> **volte para:** #verificacao
:::
