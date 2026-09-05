# II.2 — Modelos Lineares

> **Estado da arte capturado em 2026-08** · última revisão 2026-09-01 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

:::cartao {"nivel":1,"titulo":"O que este capítulo cobra","apresenta":["Regressão linear","Regressão logística","Coeficiente","Inclinação","Intercepto"],"herdado":["Atributo","Parâmetro","Métrica","Variância","Correlação","Outlier","Ensemble","Calibração","Limiar","Razão de chances","Taxa de aprendizado","Gradiente descendente"]}

## Objetivos de aprendizagem

Um modelo linear soma [atributos](../glossario.md#termos-fundamentais): cada um entra multiplicado por um número seu, e um deslocamento fecha a conta. Cada um desses números é um **[coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo)**. Com um atributo só, o coeficiente se chama **[inclinação](../glossario.md#regressao-linear)** e o deslocamento se chama **[intercepto](../glossario.md#regressao-linear)**.

- **O1.** Derivar a [regressão linear](../glossario.md#regressao-linear) como minimização do erro quadrático.
- **O2.** Calcular a inclinação e o intercepto ótimos a partir de duas somas.
- **O3.** Interpretar os coeficientes de um modelo linear, e dizer o que eles **não** significam.
- **O4.** Decidir, sob as restrições do sistema, quando o modelo linear é a escolha certa.
- **O5.** Distinguir, numa afirmação histórica, o que a fonte sustenta do que é leitura deste livro.

Só de regressão linear. A **[regressão logística](../glossario.md#regressao-linear)**, que tem "regressão" no nome e classifica, tem capítulo próprio: [II.3](ii-3-regressao-logistica.md).

:::interacao {"id":"modelos-lineares-i40","tipo":"prever","titulo":"Quantos números o modelo estima","numero":4}
Um modelo linear é ajustado sobre três atributos.

> **pergunta:** Quantos números ele precisa estimar?
> **revela:** **Quatro.** Um coeficiente por atributo, e mais o intercepto, que não pertence a atributo nenhum.
>
> Quem respondeu três esqueceu o deslocamento, e ele é estimado como os outros: ninguém o entrega pronto. Guarde a contagem, porque ela volta como argumento de escolha de modelo no fim do capítulo.
:::

:::exercicio {"id":"modelos-lineares-e42","tipo":"completar","objetivo":"O3","dificuldade":"facil"}
Num modelo linear, o número que multiplica um atributo chama-se ______, e aprender a lê-lo sem exagerar no que ele diz é o que este capítulo cobra.

> **gabarito:** coeficiente|coeficientes|peso|pesos
> **porque:** É a palavra que o capítulo existe para ensinar a ler. Um coeficiente por atributo é o que o modelo linear entrega a mais que um placar de acerto, e é por isso que ele sobrevive onde é preciso justificar a decisão por escrito.
>
> Duas respostas próximas ficam de fora. Quem responde "intercepto" nomeou o deslocamento, que existe uma vez só e não pertence a atributo nenhum. Quem responde "previsão" nomeou o resultado da soma inteira, e não a parcela de uma coluna.
>
> A ordem do capítulo segue essa palavra: primeiro de onde ela sai, depois como se calcula, depois o que ela diz, e por último o que ela não diz.
> **volte para:** #objetivos-de-aprendizagem
:::

:::cartao {"nivel":1,"titulo":"A carta de recusa que ninguém escreve"}

## O problema: o modelo que todo mundo aprende e quase ninguém respeita

Um banco precisa negar um crédito e **explicar por quê**. A lei exige a explicação, o cliente exige a explicação, e o auditor vai pedir a conta.

O modelo campeão do concurso interno, quinhentas árvores somadas, dá a melhor previsão da casa e não produz **uma única frase** que caiba na carta de recusa. Ele acerta mais e não serve.

:::interacao {"id":"modelos-lineares-i26","tipo":"principio","titulo":"Acerta mais e não serve"}
O [ensemble](../glossario.md#diagnostico-e-leitura-do-modelo) ganhou o concurso interno por uma margem confortável de acerto.

> **pergunta:** Escreva por que isso não basta para ele ser aprovado neste banco.
> **revela:** Porque o requisito não é acerto, é **explicação por escrito**, e ele não está no placar. Um modelo que erra um pouco mais e escreve a frase atende ao cliente, ao regulador e ao auditor; o campeão não atende a nenhum dos três.
>
> O erro de raciocínio que isto desfaz é tratar a métrica como se ela fosse o problema inteiro. A métrica é uma das restrições, e a mais fácil de medir, e por isso ela ocupa a conversa toda.
>
> A ideia reaproveitável vale fora de crédito: **antes de comparar modelos, escreva a lista de requisitos que a comparação não enxerga.**
:::

:::exercicio {"id":"modelos-lineares-e29","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
No caso do banco, por que o modelo mais preciso é recusado?

- [ ] Porque quinhentas árvores custam caro demais para treinar todo mês.
- [ ] Porque a precisão dele foi medida errada e não se sustenta no teste.
- [ ] Porque a lei proíbe usar aprendizado de máquina em decisão de crédito.
- [x] Porque a recusa exige explicação por escrito, e ele não escreve nenhuma.

> **gabarito:** a recusa exige uma explicação
> **porque:** O requisito que ele falha não é de qualidade preditiva. É de **prestação de contas**: a decisão precisa vir acompanhada de uma frase defensável, e um voto de quinhentas árvores não se resume a uma.
>
> A primeira alternativa é um custo real e não é o problema aqui, porque um custo se paga e a explicação continua faltando. A segunda inventa um defeito de medição que o enunciado não dá, e trocar o diagnóstico por "mediram errado" é o reflexo que atrasa a decisão. A terceira é falsa: a lei exige explicação, e não proíbe o método.
>
> O modelo linear entra por essa porta, e não por caridade: ele entrega **um número por atributo**, e um número por atributo é uma frase.
> **volte para:** #o-problema-o-modelo-que-todo-mundo-aprende-e-quase-ninguem-respeita
:::

:::cartao {"nivel":1,"titulo":"O modelo é uma reta"}

## Fundamentos: regressão linear como minimização

Comece pelo caso menor, que é onde a conta cabe inteira: **um [atributo](../glossario.md#termos-fundamentais) só**. Aí o modelo é uma reta, com a [inclinação](../glossario.md#regressao-linear) $a$ e o [intercepto](../glossario.md#regressao-linear) $b$.

$$\hat{y} = ax + b$$

O chapéu marca o que o modelo produz, e sem chapéu o $y$ é o que o mundo entregou. São $n$ exemplos.

A dedução inteira acontece nesta reta de um atributo. A forma com muitos atributos volta mais adiante, e nada do que for deduzido aqui se perde na passagem.

:::interacao {"id":"modelos-lineares-i4","tipo":"prever","titulo":"A conta que a reta faz","numero":19}
Um modelo de uma entrada saiu do ajuste com $a = 2{,}5$ e $b = 4$. Chega um exemplo com $x = 6$.

> **pergunta:** Quanto vale $\hat{y}$?
> **revela:** **19**, de $2{,}5 \times 6 + 4 = 15 + 4$. O atributo entra uma vez, multiplicado pela inclinação, e o intercepto entra sozinho.
>
> Repare no que a forma permite dizer em voz alta: o atributo somou 15, e a base já valia 4. Essa é a frase que cabe na carta de recusa do banco, e é ela que as quinhentas árvores não escrevem.
:::

:::exercicio {"id":"modelos-lineares-e15","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Ajustar um modelo linear é escolher $a$ e $b$. Para saber se uma escolha é melhor que outra, o que precisa ser comparado?

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

:::cartao {"nivel":1,"titulo":"Ponha a reta à mão","apresenta":["Resíduo","EQM"]}

## Ponha a reta à mão

:::lab {"id":"modelos-lineares-l1","tipo":"regressao-linear","titulo":"Mínimos quadrados à mão","n":24,"a":1.8,"b":4,"ruido":3.2}
Cada segmento cinza é um **[resíduo](../glossario.md#modelos-lineares)**: a distância vertical de um ponto até a **sua** reta.

**Minimize no olho** até o número parar de cair, **ligue "Ver os quadrados"** para ver que ele soma áreas, e **revele a ótima**.
:::

O painel chama esse número de **[erro quadrático médio](../glossario.md#regressao-linear)**, ou **EQM**: a soma das áreas cinza, dividida pelo número de pontos.

:::exercicio {"id":"modelos-lineares-e43","tipo":"numerica","objetivo":"O1","dificuldade":"facil"}
Uma reta deixa os resíduos $-1$, $+2$, $-2$ e $+3$. Qual é a **soma das áreas** dos quadrados?

> **gabarito:** 18
> **porque:** Área do quadrado é o resíduo ao quadrado: $1 + 4 + 4 + 9 = \mathbf{18}$. O sinal desaparece porque quadrado de negativo é positivo, e é por isso que errar para cima e errar para baixo não se cancelam.
>
> Dois enganos dão números reconhecíveis. Quem soma os resíduos com sinal chega a 2, que é o número que a área existe para não deixar acontecer. Quem soma os valores absolutos chega a 8, que é outro critério legítimo e outro capítulo de consequências.
>
> Repare no que a área faz com o ponto distante: o resíduo 3 é uma vez e meia o resíduo 2, e entra na soma com 9 contra 4.
> **volte para:** #ponha-a-reta-a-mao
:::

:::cartao {"nivel":1,"titulo":"O critério: erro quadrático médio","apresenta":["Mínimos quadrados"]}

### O critério: minimizar o erro quadrático médio

Você já minimizou este número com a mão. Escrito com símbolos, ele é a função que o ajuste minimiza, e escolher a reta que a torna menor é o método dos **[mínimos quadrados](../glossario.md#regressao-linear)**:

$$L(a, b) = \frac{1}{n}\sum_{i=1}^{n}\left(y_i - \hat{y}_i\right)^2$$

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

:::cartao {"nivel":1,"titulo":"Por que ao quadrado, e não em valor absoluto","apresenta":["Erro absoluto","Solução fechada","Equações normais"]}

### Por que ao quadrado, e não em valor absoluto

Três razões, em ordem de honestidade:

1. **É diferenciável em todo ponto**, o que faz o otimizador funcionar sem casos especiais. O **[erro absoluto](../glossario.md#regressao-linear)**, que soma o módulo do [resíduo](../glossario.md#modelos-lineares) em vez do quadrado, tem um bico em zero.
2. **Tem [solução fechada](../glossario.md#regressao-linear).** Derivando e igualando a zero, chega-se às *[equações normais](../glossario.md#modelos-lineares)*, um sistema linear que se resolve de uma vez.
3. **Pune o erro grande desproporcionalmente**, o que às vezes é o que você quer e às vezes não é. Havendo *[outliers](../glossario.md#estatistica-descritiva-e-exploracao)*, o erro quadrático os persegue.

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
Por que a [regressão linear](../glossario.md#regressao-linear) minimiza o erro **ao quadrado** em vez do erro absoluto?

- [ ] Porque o erro quadrático é sempre menor que o erro absoluto.
- [x] Porque é diferenciável em todo ponto e admite solução fechada exata.
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

:::cartao {"nivel":1,"titulo":"A mesma reta, com três números"}

### Escolher entre duas retas, sem derivada nenhuma

Três pontos: $(1, 3)$, $(2, 5)$ e $(3, 4)$. Duas retas candidatas, e o critério decidindo entre elas.

A primeira é $\hat{y} = x + 2$. Ela prevê 3, 4 e 5; os [resíduos](../glossario.md#modelos-lineares) são $0$, $+1$ e $-1$; os quadrados são $0$, $1$ e $1$. O EQM é $2/3 \approx 0{,}67$.

Nenhuma derivada apareceu aqui. O critério é uma conta de aritmética que qualquer pessoa refaz, e é por isso que ele arbitra.

:::interacao {"id":"modelos-lineares-i41","tipo":"desvanecido","titulo":"A segunda candidata"}
A segunda reta é $\hat{y} = 0{,}5x + 3$, e ela prevê $3{,}5$, $4$ e $4{,}5$ nos mesmos três pontos. Complete:

- [?] resíduos => -0,5 · +1 · -0,5
- [?] soma dos quadrados => 0,25 + 1 + 0,25 = 1,5
- [?] EQM => 1,5 / 3 = 0,5

> **revela:** A segunda vence, com $0{,}50$ contra $0{,}67$. Ela erra em todos os três pontos, e mesmo assim erra menos no total que a primeira, que acertou um em cheio.
>
> Guarde essa estranheza, porque ela é o método inteiro em miniatura: o critério não premia o acerto isolado, premia a soma. E guarde a reta $\hat{y} = 0{,}5x + 3$, porque daqui a seis cartões a álgebra vai devolvê-la sem que ninguém precise testar candidata nenhuma.
:::

:::exercicio {"id":"modelos-lineares-e44","tipo":"numerica","objetivo":"O1","dificuldade":"media"}
Uma terceira candidata entra na disputa, nos mesmos pontos $(1, 3)$, $(2, 5)$ e $(3, 4)$: a reta $\hat{y} = 2x$. Calcule o EQM dela, com duas casas decimais.

> **gabarito:** 2.00 ± 0.02
> **porque:** Ela prevê 2, 4 e 6. Os resíduos são $+1$, $+1$ e $-2$; os quadrados, $1$, $1$ e $4$; a soma, $6$. Dividida por três, dá **2,00**, o triplo do EQM da primeira candidata e o quádruplo do da segunda.
>
> Dois enganos dão números reconhecíveis. Quem soma os resíduos com sinal chega a zero e conclui que a reta é perfeita, o que é exatamente o motivo de o critério elevar ao quadrado. Quem esquece de dividir por três para em 6, que é a soma dos quadrados e não a média.
>
> Repare que esta candidata passa pela origem: ela não tem intercepto para ajustar, e paga caro por isso.
> **volte para:** #escolher-entre-duas-retas-sem-derivada-nenhuma
:::

:::cartao {"nivel":2,"titulo":"Passo 1 — a tigela tem um fundo só","apresenta":["Convexidade"]}

## A dedução, em cinco passos

Por que existe uma reta ótima única, e como o computador a encontra sem tentar todas?

A reta é a mesma $\hat{y} = ax + b$ do cartão dos fundamentos, e o critério é o mesmo EQM. Escrito com a reta dentro:

$$L(a, b) = \frac{1}{n}\sum_{i=1}^{n}\left(y_i - ax_i - b\right)^2$$

### Passo 1 — por que há um mínimo, e um só

$L$ é uma soma de quadrados: a tigela que você percorreu no laboratório, [convexa](../glossario.md#regressao-linear) em $(a, b)$. Tigela tem um fundo, e só um.

:::interacao {"id":"modelos-lineares-i7","tipo":"prever","titulo":"Dois começos, um destino"}
Duas pessoas arrastam a reta do laboratório a partir de posições bem diferentes, até o EQM parar de cair.

- ( ) Em retas diferentes: o começo decide.
- ( ) Em retas diferentes: há mínimos locais.
- (!) Na mesma reta: há um fundo só.

> **pergunta:** Onde elas param?
> **revela:** Na **mesma reta**. A convexidade é o que garante isso: uma tigela não tem um segundo fundo onde alguém possa ficar preso, então o ponto de partida muda o caminho e nunca o destino.
>
> Guarde a exceção, porque ela chega logo. Essa garantia é propriedade da **perda com este modelo**, e não do gradiente: numa rede neural a superfície deixa de ser tigela, o ponto de partida passa a importar, e é por isso que lá se fala em inicialização.
:::

:::exercicio {"id":"modelos-lineares-e17","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
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

$$\frac{\partial L}{\partial b} = -\frac{2}{n}\sum_{i=1}^{n}\left(y_i - ax_i - b\right) = 0$$

$$\Longrightarrow\; \sum_{i=1}^{n} r_i = 0$$

onde $r_i = y_i - ax_i - b$ é o [resíduo](../glossario.md#modelos-lineares). **A soma dos resíduos é zero.** Dividindo por $n$: $\bar{y} = a\bar{x} + b$, ou seja, $b = \bar{y} - a\bar{x}$.

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
Uma reta de [mínimos quadrados](../glossario.md#regressao-linear) tem [inclinação](../glossario.md#regressao-linear) $a = 2{,}5$. As médias dos dados são $\bar{x} = 4$ e $\bar{y} = 18$.

Qual é o **[intercepto](../glossario.md#regressao-linear)** $b$?

> **gabarito:** 8
> **porque:** O passo 2 da dedução garante que a reta ótima passa pelo centro de massa $(\bar{x}, \bar{y})$, sempre. Daí sai direto $b = \bar{y} - a\bar{x} = 18 - 2{,}5 \times 4 = 18 - 10 = \mathbf{8}$.
>
> Dois erros comuns dão números reconhecíveis. Quem soma em vez de subtrair chega a 28, e quem inverte as médias calcula $4 - 2{,}5 \times 18$ e chega a $-41$. O teste é rápido: a reta tem de passar por $(4, 18)$, e só $b = 8$ passa.
>
> Vale reparar no que este exercício não pede: nenhum dado individual. O intercepto ótimo depende só da inclinação e das duas médias, e essa é uma consequência forte da condição de mínimo.
> **volte para:** #passo-2-no-fundo-as-derivadas-se-anulam
:::

:::cartao {"nivel":2,"titulo":"Passo 3 — os resíduos são ortogonais ao atributo","apresenta":["Ortogonalidade"]}

### Passo 3 — a segunda condição

Derivando em relação a $a$:

$$\frac{\partial L}{\partial a} = -\frac{2}{n}\sum_{i=1}^{n}x_i\left(y_i - ax_i - b\right) = 0$$

$$\Longrightarrow\; \sum_{i=1}^{n} x_i r_i = 0$$

**Os resíduos são ortogonais ao atributo.** O que sobrou de erro **não tem mais nada de linear em $x$**: se tivesse, a reta ainda poderia melhorar.

:::interacao {"id":"modelos-lineares-i2","tipo":"principio","titulo":"De onde sai o xᵢ"}
As duas condições do mínimo, uma sob a outra, trazem o resíduo multiplicado por coisas diferentes:

$$\frac{\partial L}{\partial b} = -\frac{2}{n}\sum_{i} r_i$$

$$\frac{\partial L}{\partial a} = -\frac{2}{n}\sum_{i} x_i\, r_i$$

> **pergunta:** Por que o $x_i$ aparece ao derivar em relação a $a$, e não em relação a $b$?
> **revela:** Pela regra da cadeia. O resíduo é $r_i = y_i - ax_i - b$: derivado em relação a $b$ ele dá $-1$, e em relação a $a$ dá $-x_i$. O que multiplica cada resíduo é **a sensibilidade daquele resíduo ao parâmetro**, e ela é $x_i$ porque é $x_i$ que multiplica $a$ na reta.
>
> Daí sai o significado geométrico. Na condição de $b$ todo ponto pesa igual, e por isso ela vira "a soma dos resíduos é zero". Na condição de $a$ cada ponto pesa o próprio $x_i$: ponto com $x$ grande manda muito na inclinação, e ponto com $x = 0$ não opina sobre ela.
>
> É a mesma regra de atribuição de culpa que o perceptron usa no [capítulo III.1](iii-1-neuronio-artificial.md): quem não entrou na conta não responde pelo erro.
:::

:::exercicio {"id":"modelos-lineares-e18","tipo":"completar","objetivo":"O2","dificuldade":"media"}
Numa reta já ajustada por [mínimos quadrados](../glossario.md#regressao-linear), some os produtos de cada atributo pelo seu resíduo, $\sum_i x_i r_i$. O resultado vale sempre ______.

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

Duas contas, uma soma de produtos e uma soma de quadrados, e a reta está pronta. Sem iteração, sem [taxa de aprendizado](../glossario.md#regressao-linear), sem critério de parada.

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

Calcule a **[inclinação](../glossario.md#regressao-linear)** $a$ da reta de [mínimos quadrados](../glossario.md#regressao-linear). Responda com duas casas decimais.

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

$$S_{xy} = (-1)(-1) + (0)(1) + (1)(0) = 1$$

$$S_{xx} = 1 + 0 + 1 = 2$$

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
Quatro pontos: (1, 2), (2, 3), (3, 5) e (4, 6). Calcule a **[inclinação](../glossario.md#regressao-linear)** $a$ da reta de [mínimos quadrados](../glossario.md#regressao-linear), com duas casas decimais.

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

O denominador é a variação de $x$. Se $S_{xx} = 0$, todos os $x$ são iguais, e **não existe reta**: nenhuma [inclinação](../glossario.md#regressao-linear) é melhor que outra. Não é falha numérica, é o dado não conter a informação.

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
- [ ] Que todos os $y$ são iguais, e a reta ótima fica horizontal.
- [x] Que todos os $x$ são iguais, e nenhuma inclinação é melhor que outra.

> **gabarito:** todos os $x$ são iguais, e não existe reta
> **porque:** $S_{xx}$ é a variação de $x$ em torno da média. Zerado, significa que $x$ nunca variou, e sem variação no que se quer usar como explicação nenhuma inclinação é preferível a outra. A conta não quebra por imprecisão; ela quebra porque a pergunta não tem resposta nos dados.
>
> A primeira alternativa é a reação de quem vê divisão por zero e pensa em máquina, mas aqui o zero é exato e proposital. A segunda troca o denominador pelo numerador, já que ajuste perfeito zeraria os **resíduos**, e não a variação do atributo. A terceira troca os eixos: com todos os $y$ iguais quem zera é $S_{xy}$, o numerador, e aí a reta existe e é horizontal, com inclinação zero. Zero em cima e zero embaixo são situações opostas.
>
> Reconhecer isto na forma algébrica antes de encontrá-lo na forma de relatório é o ponto do passo 5.
> **volte para:** #passo-5-o-que-a-formula-avisa
:::

:::cartao {"nivel":2,"titulo":"A conta inteira é sua"}

### O andaime sai

No cartão do exemplo trabalhado, a conta veio pronta. No desvanecido, uma parte veio pronta. Aqui não vem nada: quatro pontos, quatro linhas em branco, e a mesma receita de sempre.

Se a sua conta bater com a resposta, você não decorou uma fórmula. Você executou um procedimento, que é o que a próxima parte do capítulo vai começar a esticar.

:::interacao {"id":"modelos-lineares-i42","tipo":"desvanecido","titulo":"Quatro pontos, nenhuma linha pronta"}
Os pontos são $(2, 4)$, $(4, 9)$, $(6, 11)$ e $(8, 16)$. Faça as quatro linhas:

- [?] médias => x̄ = 5 · ȳ = 10
- [?] S_xy => (-3)(-6) + (-1)(-1) + (1)(1) + (3)(6) = 38
- [?] S_xx => 9 + 1 + 1 + 9 = 20
- [?] a e b => a = 38 / 20 = 1,9 · b = 10 - 1,9 × 5 = 0,5

> **revela:** A reta é $\hat{y} = 1{,}9x + 0{,}5$, e o teste de sempre confere: em $x = 5$ ela dá 10, que é $\bar{y}$.
>
> Se alguma linha não bateu, vale saber qual costuma falhar. A primeira raramente falha. A segunda falha quando se usam os valores brutos no lugar dos desvios, e é o único engano que muda a resposta de verdade.
:::

:::exercicio {"id":"modelos-lineares-e45","tipo":"numerica","objetivo":"O1","dificuldade":"dificil"}
Uma equipe decide ajustar uma reta **que passa pela origem**: $\hat{y} = ax$, sem [intercepto](../glossario.md#regressao-linear) nenhum. A perda vira $L(a) = \frac{1}{n}\sum_i (y_i - ax_i)^2$, com um [parâmetro](../glossario.md#termos-fundamentais) só.

Refaça a dedução para esse modelo, derivando e igualando a zero, e calcule $a$ para os pontos $(1, 2)$, $(2, 3)$ e $(3, 7)$. Responda com duas casas decimais.

> **gabarito:** 2.07 ± 0.02
> **porque:** Derivando, $\frac{dL}{da} = -\frac{2}{n}\sum_i x_i(y_i - ax_i)$. Igualando a zero, sobra $\sum_i x_i y_i = a\sum_i x_i^2$, ou seja $a = \frac{\sum x_i y_i}{\sum x_i^2} = \frac{2 + 6 + 21}{1 + 4 + 9} = \frac{29}{14} = \mathbf{2{,}07}$.
>
> O engano que este exercício existe para pegar dá **2,50**: é o resultado de aplicar $S_{xy}/S_{xx}$, a fórmula do modelo com intercepto, a um modelo que não tem intercepto. Os desvios em torno da média entraram na fórmula anterior porque a condição em $b$ obrigava a reta a passar pelo centro de massa. Sem $b$ não há essa condição, a soma dos resíduos não é zero, e a reta não passa pelo centro de massa.
>
> É a diferença entre derivar e lembrar. Quem deriva refaz os dois passos e vê a condição sumir; quem lembra aplica a fórmula que decorou a um modelo que não é o dela.
> **volte para:** #o-andaime-sai
:::

:::cartao {"nivel":3,"titulo":"De um atributo para vários"}

## De um atributo para vários

A dedução inteira foi feita com um atributo, porque assim a conta cabe na página. Um modelo de trabalho soma muitos:

$$\hat{y} = w_1x_1 + w_2x_2 + \dots + w_dx_d + b$$

São $n$ exemplos e $d$ atributos, e $w_j$ é o [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo) do atributo $j$. Com um atributo só, $w_1$ é a [inclinação](../glossario.md#regressao-linear) $a$ que você vinha calculando.

O que sobrevive à passagem é o raciocínio inteiro: o critério continua sendo o EQM, a rota continua sendo derivar e igualar a zero, e a superfície continua sendo uma tigela. O que muda é a **contagem**: em vez de duas condições de mínimo há $d + 1$, uma por [parâmetro](../glossario.md#termos-fundamentais), e resolvê-las deixa de caber numa linha.

:::interacao {"id":"modelos-lineares-i43","tipo":"prever","titulo":"Cinquenta atributos, quantas condições","numero":51}
Um modelo linear com [intercepto](../glossario.md#regressao-linear) é ajustado sobre 50 atributos.

> **pergunta:** Quantas condições de mínimo o sistema tem?
> **revela:** **51.** Uma derivada parcial por parâmetro, igualada a zero: 50 para os pesos e uma para o intercepto, que continua sendo estimado como os outros.
>
> Repare no que isso faz com o custo. Duas condições se resolvem à mão; 51 pedem um método de resolver sistemas, e é aí que a escolha entre a álgebra e o gradiente deixa de ser acadêmica.
:::

:::exercicio {"id":"modelos-lineares-e46","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Passando de um atributo para $d$, o que deixa de valer da dedução que você acabou de fazer?

- [x] Nada: muda a contagem das condições, de duas para $d + 1$.
- [ ] A convexidade, porque com muitos atributos surgem mínimos locais.
- [ ] A condição de que a soma dos resíduos é zero no ajuste ótimo.
- [ ] O critério, porque com muitos atributos usa-se o erro absoluto.

> **gabarito:** nada do raciocínio muda; muda a contagem das condições
> **porque:** A perda continua sendo uma soma de quadrados, e soma de quadrados continua sendo convexa em qualquer número de parâmetros. Derivar em relação a cada um e igualar a zero continua sendo a rota. O que cresce é o tamanho do sistema.
>
> A segunda alternativa é o mal-entendido mais caro da lista, e ele custa confiança: mínimo local é assunto de rede neural, onde a perda deixa de ser quadrática nos parâmetros. A terceira é falsa, porque a derivada em relação ao intercepto continua existindo e continua dando o mesmo zero. A quarta troca o critério sem motivo, e trocar o critério é decisão de projeto, não consequência de ter mais colunas.
>
> A consequência prática vem no cartão seguinte: com muitos atributos, resolver o sistema exato passa a ter preço.
> **volte para:** #de-um-atributo-para-varios
:::

:::cartao {"nivel":3,"titulo":"Dois atributos que andam juntos","apresenta":["Colinearidade"]}

### Quando duas colunas dizem quase a mesma coisa

Com muitos atributos aparece um problema que não existia com um: duas colunas podem carregar quase a mesma informação. Uma barraca que distribui mais panfletos nos dias quentes tem `panfletos` e `temperatura` subindo juntas, e nenhuma das duas varia sozinha.

Isso se chama **[colinearidade](../glossario.md#modelos-lineares)**. Ela não estraga a previsão: se muitas combinações de pesos dão quase o mesmo erro, o erro de validação não muda. O que ela deforma é a superfície que o otimizador percorre.

:::interacao {"id":"modelos-lineares-i23","tipo":"prever","titulo":"A forma que dois atributos colineares desenham"}
Muitas combinações de pesos dão quase o mesmo erro.

- ( ) Uma tigela redonda como antes.
- (!) Um vale comprido e estreito.
- ( ) Uma superfície com vários fundos.

> **pergunta:** Que forma isso dá à superfície de erro?
> **revela:** Um **vale comprido e estreito**. Ao longo da direção em que os dois pesos se compensam o erro quase não muda, e na direção perpendicular ele sobe rápido.
>
> A opção dos vários fundos é a confusão que o passo 1 já resolveu: a superfície continua convexa, com um fundo só. O que mudou não foi o número de mínimos, foi a **forma** ao redor dele, e o gradiente desce a parede em vez de andar pelo fundo.
:::

:::exercicio {"id":"modelos-lineares-e47","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
No passo 5, $S_{xx} = 0$ deixava a reta sem existir. Sob colinearidade, o que acontece com a conta?

- [ ] Ela também não fecha: o sistema fica sem solução, como com $S_{xx} = 0$.
- [x] Ela fecha, e muitas combinações de pesos dão quase o mesmo erro.
- [ ] Ela fecha, e o erro de previsão piora de forma mensurável.
- [ ] Ela fecha, e os coeficientes saem todos iguais entre si.

> **gabarito:** a conta fecha, e muitas combinações dão quase o mesmo erro
> **porque:** As duas situações são a mesma doença em graus opostos. Com $S_{xx} = 0$ falta variação por completo, e não há resposta nenhuma. Sob colinearidade falta variação **independente**, e o que sobra são muitas respostas quase igualmente boas, entre as quais o ajuste escolhe por detalhes da amostra.
>
> A terceira alternativa é a que mais engana, porque parece a consequência natural: se a conta ficou frouxa, o erro deveria piorar. Não piora, e é justamente por não piorar que o problema passa despercebido. A quarta inventa uma simetria que não existe, e sob colinearidade os coeficientes costumam sair grandes e de sinais opostos.
>
> A leitura que fica: a métrica de previsão não vê colinearidade, então nenhum painel vai avisar.
> **volte para:** #quando-duas-colunas-dizem-quase-a-mesma-coisa
:::

:::cartao {"nivel":3,"titulo":"Padronizar muda a forma, não o modelo","apresenta":["Padronização"]}

### Padronizar muda a forma, não o modelo

**Padronizar** é pôr cada [atributo](../glossario.md#termos-fundamentais) na mesma escala: de cada valor subtrai-se a média da coluna e divide-se pelo desvio. Não é higiene de planilha: é o que transforma o vale estreito do cartão anterior num vale redondo.

A álgebra não anda por superfície nenhuma. Ela iguala as derivadas a zero e resolve o sistema, e o vale estreito lhe dá o mesmo trabalho que o redondo. O capítulo [II.4](ii-4-otimizacao.md) retoma esta superfície pelo lado da [taxa de aprendizado](../glossario.md#regressao-linear).

:::interacao {"id":"modelos-lineares-i44","tipo":"prever","titulo":"O que padronizar muda no resultado"}
O mesmo conjunto é ajustado duas vezes: como veio, e padronizado.

- ( ) Nada: o ajuste sai igual.
- (!) Os coeficientes mudam, e a previsão não.
- ( ) A previsão muda, e o modelo melhora.

> **pergunta:** O que muda entre os dois ajustes?
> **revela:** **Os coeficientes mudam, e a previsão não.** Cada coeficiente é "quanto muda a resposta por unidade do atributo", e padronizar troca a unidade: onde antes era "por grau", passa a ser "por desvio-padrão de temperatura".
>
> A função ajustada continua a mesma, e é isso que faz padronizar ser reversível. Quem espera previsão melhor está pedindo à mudança de escala uma coisa que ela não faz: o que ela facilita é o caminho do otimizador, e o que ela permite é comparar coeficientes entre atributos.
:::

:::exercicio {"id":"modelos-lineares-e20","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Dois atributos quase [colineares](../glossario.md#modelos-lineares) deixam a superfície num vale estreito, e padronizar a deixa redonda. Por que a [solução fechada](../glossario.md#regressao-linear) devolve a resposta exata **nos dois casos**?

- [ ] Padronizar não altera os coeficientes ótimos.
- [x] As equações normais resolvem o sistema sem andar pela superfície.
- [ ] O dado padronizado deixa de ser correlacionado entre si.
- [ ] A álgebra usa um passo maior a cada iteração.

> **gabarito:** as equações normais resolvem de uma vez
> **porque:** A forma da superfície é o que atrapalha **quem anda por ela**. As equações normais não andam: elas igualam as derivadas a zero e resolvem o sistema resultante, então um vale estreito e um vale redondo dão o mesmo trabalho.
>
> A primeira alternativa é falsa e útil de desmontar, porque padronizar **muda** os coeficientes ao mudar a unidade de cada atributo, e o que não muda é a função ajustada. A terceira confunde escala com correlação, já que subtrair média e dividir por desvio não desfaz o fato de dois atributos andarem juntos. A quarta atribui à álgebra um passo que ela não tem.
>
> Guarde a previsão, porque o cartão seguinte a põe à prova numa varredura de 4 000 passos.
> **volte para:** #padronizar-muda-a-forma-nao-o-modelo
:::

:::cartao {"nivel":3,"titulo":"O gradiente contra a álgebra"}

### O gradiente contra a álgebra

Agora as duas rotas no mesmo dado, com dois [atributos](../glossario.md#termos-fundamentais) quase [colineares](../glossario.md#modelos-lineares). O placar mede o **excesso sobre o ótimo fechado**.

:::lab {"id":"modelos-lineares-l2","tipo":"anima-normais","titulo":"O gradiente atrás de uma resposta que já existe"}
Trezentos pontos, 4 000 passos. Rode como os atributos vieram, depois padronizados.
:::

:::interacao {"id":"modelos-lineares-i39","tipo":"prever","titulo":"Quantos passos","numero":1460,"tolerancia":500}
Arrisque o número antes de conferir.

> **pergunta:** Padronizados os atributos, em que passo o excesso cai abaixo de 1%?
> **revela:** No passo **1 460**. Como os atributos vieram, o gradiente **não chega**: termina 2,8% acima ao fim dos 4 000 passos, e não por passo mal escolhido, já que cada regime roda com o maior passo estável que a própria superfície admite.
:::

:::exercicio {"id":"modelos-lineares-e26","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
O que serve de referência para o zero do placar?

- [ ] O menor erro do próprio gradiente.
- [x] O erro que as equações normais devolvem.
- [ ] O erro de quem prevê sempre a média.
- [ ] O erro num teste separado.

> **gabarito:** o erro da solução fechada
> **porque:** A animação só consegue dizer "2,8% acima" porque existe um número exato para comparar, e ele vem das equações normais. É o caso raro em que a resposta certa é conhecida antes de o otimizador começar.
>
> A primeira alternativa faria o placar mentir por construção: se a referência fosse o melhor do próprio gradiente, ele terminaria sempre a 0%. A terceira descreve outra régua, a de quem prevê sempre a média, que responde a outra pergunta e volta mais adiante no capítulo. A quarta troca ajuste por generalização, e aqui nada foi separado, porque a animação compara duas formas de resolver o mesmo problema no mesmo dado.
>
> É por isso que este laboratório é possível só aqui. No capítulo II.3 não haveria com o que comparar.
> **volte para:** #o-gradiente-contra-a-algebra
:::

:::cartao {"nivel":3,"titulo":"A fechada existe, e ainda assim o gradiente"}

### A solução fechada existe. Por que, então, gradiente?

Você acabou de ver o gradiente gastar 1 460 passos para alcançar um lugar que a álgebra já ocupava desde o primeiro instante. A pergunta é legítima, e é a mesma que um aluno faz em voz alta: então por que aprender o gradiente?

A solução fechada está implementada na [etapa 05](../trilha-ml-zero.md), em 25 linhas de eliminação de Gauss. Vale conferir: **gradiente e solução fechada chegam ao mesmo lugar**, com diferença menor que 0,05 em cada [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo). Isso desmistifica o gradiente, que passa a ser *um jeito* de resolver, não *o* jeito.

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
Se a solução fechada das [equações normais](../glossario.md#modelos-lineares) é exata e existe, por que o livro ensina o gradiente?

- [ ] Porque o gradiente encontra um mínimo melhor que a solução fechada.
- [ ] Porque a solução fechada só vale quando os dados não têm ruído.
- [ ] Porque o gradiente é mais preciso quando existem *outliers* no conjunto.
- [x] Porque resolver $d + 1$ equações é caro, e a logística não tem fechada.

> **gabarito:** custo com muitos atributos, e ela não existe na logística
> **porque:** Os dois motivos são de alcance, não de qualidade. No experimento do livro, gradiente e solução fechada chegam ao mesmo lugar, com diferença menor que 0,05 em cada coeficiente, e isso descarta a primeira alternativa pela evidência do próprio capítulo.
>
> A segunda inverte a lógica do método, porque a solução fechada é justamente o que se faz **quando** há ruído, e sem ruído bastariam dois pontos. A terceira confunde otimizador com critério: quem persegue *outlier* é o erro quadrático, e ele é o mesmo nas duas rotas.
>
> O que muda é onde cada um se aplica. Com $d$ atributos o sistema tem $d + 1$ equações, e resolvê-lo de uma vez fica caro depressa conforme $d$ cresce; e para a regressão logística não há fórmula fechada nenhuma. O gradiente é a ferramenta **geral**, e a solução fechada é o caso de sorte de um modelo específico.
> **volte para:** #a-solucao-fechada-existe-por-que-entao-gradiente
:::

:::cartao {"nivel":4,"titulo":"O que o coeficiente diz"}

## Interpretar coeficientes — e o que eles não dizem

O modelo linear é interpretável, e é por isso que ele sobrevive em crédito, seguro e saúde. Mas "interpretável" não significa "fácil de interpretar corretamente".

### O que o coeficiente diz

Aumentar $x_j$ em uma unidade muda $\hat{y}$ em $w_j$ unidades, mantendo os demais [atributos](../glossario.md#termos-fundamentais) constantes. É a leitura mais direta que um modelo oferece.

> Na [regressão logística](../glossario.md#regressao-linear) a leitura é outra: o coeficiente multiplica a **[razão de chances](../glossario.md#modelos-lineares)**, não a saída. Confundir as duas é o erro de interpretação mais comum deste livro.

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

:::cartao {"nivel":4,"titulo":"A correlação que recomenda o contrário"}

## O caso da limonada

O conjunto em [`ml-zero/dados/limonada/`](../../ml-zero/dados/limonada/README.md) traz 365 dias de uma barraca.

:::interacao {"id":"modelos-lineares-i14","tipo":"prever","titulo":"O sinal que você espera"}
Preço cobrado e copos vendidos andam juntos nestes 365 dias.

- (!) Positivamente: caro vendeu mais.
- ( ) Negativamente: caro afasta freguês.
- ( ) Perto de zero: o preço mal mudou.

> **pergunta:** Com que sinal?
> **revela:** **Positivamente**, e forte: **+0,513**. Quem previu negativo aplicou a teoria econômica correta ao dado errado, e é exatamente esse o susto que o caso existe para dar.
>
> Guarde a estranheza sem explicá-la ainda. Uma correlação positiva significa que, nos dias em que a barraca cobrou mais, ela também vendeu mais. Alguma coisa está acontecendo junto com o preço, e o resto desta parte é descobrir o quê.
:::

| [atributo](../glossario.md#termos-fundamentais) | correlação com `vendas` |
|---|---|
| `temperatura` | +0,990 |
| `precipitacao` | −0,909 |
| `panfletos` | +0,805 |
| **`preco`** | **+0,513** |

Calor vende, chuva atrapalha, panfleto ajuda. E **preço mais alto vende mais**.

:::lab {"id":"modelos-lineares-l3","tipo":"regressao-limonada","titulo":"Primeira volta","fixos":["preco"]}
A primeira das cinco voltas do painel.
:::

:::exercicio {"id":"modelos-lineares-e22","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Clique em **Ajustar** e responda o [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo) de `preco`, com uma casa.

> **gabarito:** 47,0 ± 0,4
> **porque:** O painel devolve **+47,0**, com o intercepto em 9,6. Lido como decisão, ele diz que cada real a mais no copo vende quarenta e sete copos a mais, o que ninguém acredita — e é exatamente a recomendação que a tabela de correlação sugeria, agora com aparência de conta.
>
> Dois números aparecem no lugar. Quem responde **0,5** copiou o 0,513 da tabela, que é correlação e não coeficiente: um é adimensional e mora entre −1 e 1, o outro está em copos por real. Quem responde **9,6** leu a linha do intercepto, que é a previsão quando o preço vale zero, isto é, fora de qualquer dia observado.
>
> A tabela apontou onde olhar; o ajuste pôs um número na recomendação errada. Nenhum dos dois diz **por quê**, e é o resto desta parte que vai dizer.
> **volte para:** #o-caso-da-limonada
:::

:::cartao {"nivel":4,"titulo":"O preço é um termômetro disfarçado"}

### O preço é um termômetro disfarçado

| preço | dias | temperatura média* | vendas médias | meses em que aparece |
|---|---|---|---|---|
| 0,30 | 303 | 57,0 | 23,7 | jan–jun, set–dez |
| 0,50 | 62 | 78,8 | 33,1 | **só julho e agosto** |

> \* A unidade **não está no arquivo**. A faixa (15,1 a 102,9) é típica de Fahrenheit.

:::lab {"id":"modelos-lineares-l4","tipo":"regressao-limonada","titulo":"Segunda volta","fixos":["preco"],"escolher":["temperatura"]}
Marque `temperatura` e ajuste de novo.
:::

:::interacao {"id":"modelos-lineares-i15","tipo":"principio","titulo":"O que o preço está marcando"}
O preço de 0,50 aparece em 62 dias, todos em julho e agosto.

> **pergunta:** Escreva o que esse fato faz com a correlação de +0,513.
> **revela:** Ele a explica inteira. A coluna `preco` tem dois valores, e o valor alto é um **carimbo de julho e agosto**. Comparar vendas a 0,50 com vendas a 0,30 é comparar verão com o resto do ano, e a correlação mede o calor de julho.
>
> `preco` não é uma alavanca de decisão neste conjunto: é um **termômetro disfarçado**. A pergunta da dona da barraca, *quanto vendo a mais se eu baixar o preço*, exigiria dias comparáveis com preços diferentes, e não existe um só.
>
> A ideia reaproveitável: **uma coluna que só assume certo valor dentro de um recorte não mede o que o nome dela diz, mede o recorte.**
:::

:::exercicio {"id":"modelos-lineares-e23","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Com `temperatura` marcada, responda o [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo) de `preco`, com duas casas.

> **gabarito:** 1,64 ± 0,06
> **porque:** Ele cai de 47,0 para 1,64, vinte e nove vezes menor, e continua **positivo**. A queda é a medida do quanto daquele 47,0 era calor disfarçado de preço; o que não cai é o que sobra sem dono, e o cartão seguinte mostra de quem ele é.
>
> Três números aparecem no lugar. Quem responde **47,0** leu a coluna *antes*, que é a volta passada e está ali para comparação. Quem responde **0,42** leu a linha da `temperatura`, que é o outro coeficiente da mesma conta. E quem responde um número **negativo** respondeu a teoria econômica em vez do painel, que é o susto que este caso existe para dar.
>
> O teste que fica vale para qualquer coluna suspeita: pergunte **em que subconjunto dos dados ela varia**. Se a resposta for "num recorte só", ela carrega o recorte junto, e o coeficiente dela mede o recorte.
> **volte para:** #o-preco-e-um-termometro-disfarcado
:::

:::cartao {"nivel":4,"titulo":"O controle que não salva","apresenta":["Coeficiente de determinação","R²"]}

### O passo que deveria salvar, e não salva

A resposta de manual é **controlar pelas outras variáveis**: marque as duas que faltam.

:::lab {"id":"modelos-lineares-l5","tipo":"regressao-limonada","titulo":"Terceira volta","fixos":["preco","temperatura"],"escolher":["precipitacao","panfletos"],"mostrar":["r2"]}
Marque as duas caixas e ajuste. Uma linha nova aparece embaixo.
:::

Ela é o **[coeficiente de determinação](../glossario.md#diagnostico-e-leitura-do-modelo)**, o $R^2$: a fração da variação de `vendas` que o modelo reproduz, de 0 (prever sempre a média) a 1 (acertar cada ponto). Ele sai altíssimo, e é por ser altíssimo que está aqui.

:::interacao {"id":"modelos-lineares-i3","tipo":"desvanecido","titulo":"Quem explica os 9,4 copos"}
Do preço 0,30 para o 0,50 a venda sobe 9,4 copos, e a temperatura sobe de 57,0 para 78,8. Complete as duas parcelas:

- [?] temperatura: `0,3692 × (78,8 − 57,0)` => 8,05 copos
- [?] preço: `2,4143 × (0,50 − 0,30)` => 0,48 copo

> **revela:** A temperatura responde por **8,05** dos 9,4 copos, e o preço por **0,48**, cinco por cento da diferença. O que sobra está na precipitação e nos panfletos, que também mudam de janeiro para julho.
>
> Repare no contraste: **+2,4143 é o maior coeficiente da equação**, e mesmo assim a parcela dele é a menor de todas. Coeficiente é efeito por unidade; parcela é efeito por unidade vezes **a variação que de fato existiu no dado**. O preço variou 0,20 em 365 dias; a temperatura variou 21,8.
>
> São as duas armadilhas deste capítulo na mesma conta. Coeficiente grande não é atributo importante enquanto não se padroniza, e aqueles 0,20 de variação de preço só aconteceram em julho e agosto.
:::

:::exercicio {"id":"modelos-lineares-e24","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Com as quatro colunas no ajuste, responda o $R^2$, com três casas.

> **gabarito:** 0,982 ± 0,003
> **porque:** Ele sai em 0,982: o modelo reproduz 98,2% da variação de `vendas`. E repare no que a coluna *antes* mostra na mesma tela: o $R^2$ subiu de 0,980 para 0,982, quase nada, enquanto o coeficiente do preço subiu de 1,64 para **2,41**. Acrescentar dois controles deixou a leitura errada **maior**, e a qualidade do ajuste igual.
>
> Dois números aparecem no lugar. Quem responde **0,980** não marcou as caixas e leu a volta anterior. Quem responde **98,2** trocou a fração pela porcentagem, e o painel imprime a fração.
>
> O $R^2$ mede ajuste ao passado, e é uma afirmação sobre a coluna `vendas` e mais nada. Ele não diz que 98,2% das decisões de preço foram boas, nem que 1,8% das linhas ficaram de fora, nem quanta confiança o coeficiente do preço merece. Reproduzir bem o passado e dizer o efeito de mexer numa alavanca são coisas diferentes, e o $R^2$ alto é justamente o que faz o relatório errado parecer sólido.
> **volte para:** #o-passo-que-deveria-salvar-e-nao-salva
:::

:::cartao {"nivel":4,"titulo":"Controlar remove só o que a variável mede","apresenta":["Confundidor"]}

O [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo) do preço continua **positivo**: a temperatura média não captura *ser julho*, e o que sobrou de julho mora dentro de `preco`.

Um **[confundidor](../glossario.md#estatistica-descritiva-e-exploracao)** é a variável que mexe nas outras duas e cria associação sem causa. Aqui ele é "ser julho", e ninguém o mediu: controlar por uma variável só remove o confundimento que **aquela** variável mede.

:::lab {"id":"modelos-lineares-l6","tipo":"regressao-limonada","titulo":"Quarta volta","fixos":["temperatura","precipitacao","panfletos"],"escolher":["preco","alta_temporada"],"ligados":["preco"],"mostrar":["r2"]}
`alta_temporada` vale 1 nos 62 dias de julho e agosto, e 0 nos outros 303.
:::

:::interacao {"id":"modelos-lineares-i16","tipo":"principio","titulo":"O que a temperatura não carregou"}
A temperatura entrou no modelo e o coeficiente do preço continuou positivo.

> **pergunta:** O que "ser julho" tem que "78,8 graus" não tem?
> **revela:** Férias escolares, fluxo de rua diferente, hábito de quem passa, dias mais longos. Um dia de 78,8 graus em maio não traz nada disso, e é essa diferença que sobra sem dono no modelo.
>
> O que sobra sem dono não some: é atribuído ao atributo que marcar melhor o recorte, e aqui o único que marca julho é o preço. O coeficiente de 2,4143 é a estação inteira empacotada num nome errado.
>
> A ideia reaproveitável: **controlar por um indicador do confundidor não é controlar pelo confundidor.** Antes de escrever "controlamos por X", pergunte quanto de X ficou de fora da medida de X.
:::

:::exercicio {"id":"modelos-lineares-e5","tipo":"numerica","objetivo":"O3","dificuldade":"dificil"}
Marque `alta_temporada` e ajuste: o painel recusa. Desmarque `preco`, ajuste de novo, e responda o coeficiente de `alta_temporada`, com três casas.

> **gabarito:** 0,483 ± 0,012
> **porque:** Sai **0,483**, que é exatamente um quinto de 2,414. Não é coincidência: `preco` vale 0,30 + 0,20 × `alta_temporada`, dia a dia, sem resto. As duas colunas são a mesma variável com dois nomes, e é por isso que o painel se recusa a ajustar as duas juntas.
>
> Olhe as outras três linhas depois de trocar uma pela outra. `temperatura`, `precipitacao` e `panfletos` não mudam uma casa decimal, e o $R^2$ continua 0,982. O modelo é o mesmo; o que muda é o nome que o relatório dá ao efeito, e é só o nome que estava errado.
>
> Dois números aparecem no lugar. Quem responde 2,414 leu a linha do preço, que é o mesmo efeito na escala do real. Quem responde 0,369 leu a `temperatura`. E o que fica é o teste: quando duas colunas marcam o mesmo recorte, a regressão não escolhe entre elas por mérito, e **controlar por um indicador do confundidor não é controlar pelo confundidor**.
> **volte para:** #o-passo-que-deveria-salvar-e-nao-salva
:::

:::cartao {"nivel":5,"titulo":"O panfleto, de brinde"}

### O panfleto, de brinde

Vem outro de brinde: `temperatura` e `panfletos` correlacionam **+0,798**, porque em dia quente distribuíam-se mais panfletos. O [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo) do panfleto sai em 0,0188, e lido como efeito da panfletagem é falso.

[Colinearidade](../glossario.md#modelos-lineares) não estraga a previsão. Estraga a **leitura**, porque o erro de validação não muda.

:::lab {"id":"modelos-lineares-l7","tipo":"regressao-limonada","titulo":"Quinta volta","fixos":["preco","temperatura","precipitacao","panfletos"],"mostrar":["r2"],"corte":true}
O corte escolhe quantos dias entram. Mexa nele e ajuste de novo.
:::

:::interacao {"id":"modelos-lineares-i17","tipo":"principio","titulo":"Panfleto em dia frio"}
Suponha que a barraca passasse a distribuir a mesma quantidade de panfletos em dia frio e em dia quente, e que o modelo fosse reajustado.

> **pergunta:** Escreva o que aconteceria com o coeficiente de `panfletos`, e por quê.
> **revela:** Ele **desceria**. Hoje o panfleto aparece junto do calor e leva crédito por vendas que o calor explicaria sozinho; distribuindo panfleto em dia frio também, essa carona acaba.
>
> Quem respondeu "ficaria igual" fez a aposta que o cartão anterior desmontou: a temperatura está no modelo, e ainda assim não captura tudo o que anda junto dela.
>
> E há um hábito a levar daqui. Inverter o coeficiente devolve a unidade que a decisão usa: 0,0188 copo por panfleto vira 1 ÷ 0,0188 ≈ **53 panfletos por copo**. "0,0188" não diz nada a quem manda imprimir; "53 panfletos por copo" diz, e diz que a panfletagem provavelmente não se paga. Com o número honesto, ela se pagaria menos ainda.
:::

:::exercicio {"id":"modelos-lineares-e4","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Ponha o corte em 200 e ajuste. Responda o coeficiente de `panfletos`, com quatro casas.

> **gabarito:** 0,0159 ± 0,0006
> **porque:** Com os 365 dias ele valia 0,0188; com os 200 primeiros, **0,0159**. Em panfletos por copo, a recomendação vai de 53 para 63, dez a mais, e ninguém tocou no método: só se mudou onde a janela começa e termina.
>
> Agora olhe a linha do $R^2$ na mesma tela. Ela vai de 0,982 para 0,985, isto é, o ajuste **melhorou** enquanto a leitura piorava dez panfletos. É a frase do começo do cartão acontecendo: a colinearidade estraga a leitura e deixa a previsão intacta, e por isso nenhum painel de desempenho a denuncia.
>
> Dois números aparecem no lugar. Quem responde 0,0188 leu a coluna *antes*, que guarda o ajuste dos 365 dias. Quem responde 53 respondeu em panfletos por copo, que é o inverso do que foi pedido.
> **volte para:** #o-panfleto-de-brinde
:::

:::cartao {"nivel":5,"titulo":"O conserto óbvio, e por que ele não conserta"}

### O conserto óbvio

O conserto de manual seria **isolar um período em que o preço varie sem a estação variar junto**: recortar um mês, onde o calor é parecido dia após dia.

:::lab {"id":"modelos-lineares-l8","tipo":"regressao-limonada","titulo":"Sexta volta","fixos":["temperatura","precipitacao","panfletos"],"escolher":["preco"],"ligados":["preco"],"mostrar":["r2"],"recorte":true}
Escolha um mês e ajuste. Depois tente outro, e outro.
:::

O painel recusa nos doze, e o aviso é o do passo 5: em cada mês o preço tem um valor só, então $S_{xx}$ dele é zero. O [confundimento](../glossario.md#estatistica-descritiva-e-exploracao) aqui é **perfeito**, e preço e estação são a mesma variável com dois nomes.

:::interacao {"id":"modelos-lineares-i24","tipo":"principio","titulo":"O dado que teria respondido"}
A pergunta da dona da barraca não tem resposta nestes 365 dias.

> **pergunta:** Descreva a coleta que teria respondido a ela.
> **revela:** Alternar os dois preços **dentro do mesmo mês**, de preferência sorteando o preço de cada dia. Assim o preço deixa de andar junto com a estação, e a diferença de vendas entre dias parecidos passa a ser atribuível a ele.
>
> Repare no que muda de lugar. A solução não está na análise, está na **coleta**, e nenhuma técnica aplicada depois inventa a variação que ninguém produziu.
>
> É por isso que o experimento é caro e vale o preço. Quem controla a atribuição do tratamento compra a única coisa que a observação não vende.
:::

:::exercicio {"id":"modelos-lineares-e27","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Recorte **julho**, desmarque `preco` e ajuste. Responda o $R^2$, com três casas.

> **gabarito:** 0,948 ± 0,006
> **porque:** Sai **0,948** em 31 dias, e é esta a armadilha inteira do cartão: sem o preço o ajuste fecha, fecha bem, e não responde à pergunta que se foi ali fazer. A única coluna que um mês sozinho não consegue estimar é justamente a que interessava.
>
> Dois números aparecem no lugar. Quem responde 0,982 não aplicou o recorte e leu o ano inteiro. Quem responde 0,932 deixou só a `temperatura` marcada.
>
> O que fica é um teste para qualquer dado alheio: antes de estimar o efeito de uma coluna, conte **em quantos recortes ela varia**. Se a resposta for "num só", nenhuma técnica aplicada depois inventa a comparação que a coleta não produziu, e um $R^2$ alto no que sobrou não é consolo, é disfarce.
> **volte para:** #o-conserto-obvio
:::

:::cartao {"nivel":5,"titulo":"Mão na massa"}

## Mão na massa

A **etapa 05–06** do [`ml-zero`](../trilha-ml-zero.md) implementa, em biblioteca padrão, a `RegressaoLinear` com os dois caminhos ([solução fechada](../glossario.md#regressao-linear) por eliminação de Gauss e [gradiente](../glossario.md#regressao-linear)), e o `Padronizador`, que aprende no treino e **aplica** ao teste.

O notebook refaz a análise dos últimos cartões célula a célula, e a última delas traz um `# TODO`. É ali que este cartão cobra alguma coisa: você altera um número, roda, e traz o resultado de volta para o exercício.

**Notebook pronto para executar** — [`regressao_limonada.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb) · [abrir no Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb)

:::interacao {"id":"modelos-lineares-i35","tipo":"prever","titulo":"Onde o padronizador aprende"}
O `Padronizador` guarda a média e o desvio de cada [atributo](../glossario.md#termos-fundamentais) para poder reescalar os dados.

- (!) Só no treino, e depois aplica os mesmos números ao teste.
- ( ) No conjunto inteiro, antes de separar treino e teste.
- ( ) Em cada conjunto separadamente, com os números de cada um.

> **pergunta:** De onde ele tira esses números?
> **revela:** **Só do treino.** Aplicar ao teste os números aprendidos no treino é o que mantém o teste intocado.
>
> As outras duas opções são a mesma falha com roupas diferentes. Calcular no conjunto inteiro deixa a média do teste entrar no treino, e padronizar cada conjunto com os próprios números faz o modelo receber, na hora de avaliar, uma escala que ele nunca viu. Nos dois casos o número final fica melhor do que a realidade, que é o vazamento do [capítulo I.3](i-3-dados.md).
:::

:::exercicio {"id":"modelos-lineares-e48","tipo":"numerica","objetivo":"O3","dificuldade":"dificil"}
Abra o notebook e vá até a célula marcada com `# TODO`. Troque `corte = 300` por `corte = 250`: o modelo passa a treinar nos 250 primeiros dias e a ser avaliado nos 115 últimos. Rode e responda o **R² no teste**, com três casas decimais.

> **gabarito:** 0.953 ± 0.003
> **porque:** Com o corte em 250 o R² de teste é **0,953**, contra 0,919 do corte em 300. Ele **subiu** apesar de o modelo ter treinado com 50 dias a menos, e as duas metades da razão explicam por quê.
>
> Em cima, o erro caiu: o EQM de teste vai de 1,29 para 1,08, porque a janela avaliada deixa de ser só novembro e dezembro e passa a incluir setembro e outubro, que se parecem mais com o que o modelo viu. Embaixo, a variação das vendas na janela de teste sobe de 15,9 para 23,1: o R² compara o erro do modelo com o de quem prevê sempre a média **daquela janela**, e prever a média de um trecho pouco variável já é fácil.
>
> A leitura que fica vale para qualquer relatório: **R² não é comparável entre janelas de teste diferentes**. Dois números de R² só se comparam quando o denominador é o mesmo.
>
> Uma ressalva de honestidade, e ela é da arquitetura: este exercício confere o número, e não a execução. Quem chegar ao valor por outro caminho passa igual.
> **volte para:** #mao-na-massa
:::

:::cartao {"nivel":5,"titulo":"As quatro coisas que o coeficiente não diz","apresenta":["Extrapolação"]}

### As quatro coisas que ele não diz

As quatro, como lista de conferência:

1. **Não diz causalidade.** "Mantendo tudo mais constante" é operação sobre a equação, não intervenção no mundo.
2. **Não é comparável sem [padronização](../glossario.md#regressao-linear).** Um coeficiente de 0,003 para renda e 2,5 para filhos não diz que filhos importam mais.
3. **Não é confiável sob [colinearidade](../glossario.md#modelos-lineares).** [Atributos](../glossario.md#termos-fundamentais) que andam juntos trocam peso entre si.
4. **Não vale fora da faixa observada.** [Extrapolar](../glossario.md#diagnostico-e-leitura-do-modelo) é usar a reta onde ela nunca viu dado: a 120 graus ela continua traçando, e o absurdo sai com aparência de rigor.

:::interacao {"id":"modelos-lineares-i19","tipo":"principio","titulo":"O que a métrica enxerga"}
Um painel com erro de treino, erro de validação e R², todo verde.

> **pergunta:** Quais dos quatro itens acima esse painel detectaria?
> **revela:** **Nenhum.** Todos os quatro são falhas de **leitura**, e a métrica mede acerto de previsão. A limonada é a prova em números: R² de 0,982 com o coeficiente do preço invertido de sinal.
>
> É por isso que a lista existe como lista, e não como alerta automático. Não há portão que a cobre, e a única defesa é alguém perguntar, antes de escrever a recomendação, de onde veio a variação de cada atributo.
>
> A ideia reaproveitável vale muito além da regressão: **um sistema só avisa sobre aquilo que ele mede**, e a pergunta cara é sempre quais erros ele não é capaz de perceber.
:::

:::exercicio {"id":"modelos-lineares-e12","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
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

:::cartao {"nivel":6,"titulo":"Quando o linear é a escolha certa"}

## Quando o linear é a escolha certa

Não como consolo, e sim como decisão de engenharia.

:::interacao {"id":"modelos-lineares-i20","tipo":"principio","titulo":"Escolher o pior, de propósito"}
Uma pergunta que só tem resposta boa se você pensar no sistema inteiro, e não no placar.

> **pergunta:** Descreva uma situação em que você escolheria o linear **sabendo** que ele vai prever pior.
> **revela:** Há pelo menos cinco, e o cartão seguinte as lista: poucos dados por atributo, exigência de auditoria, probabilidade que vira dinheiro, linha de base obrigatória e latência apertada.
>
> O que as cinco têm em comum é o que a resposta fraca não vê: **nenhuma delas aparece na métrica de teste.** Latência, auditabilidade e calibração são requisitos do sistema, e nenhuma métrica de acerto sabe que eles existem.
>
> Se a sua resposta foi "quando os dados são poucos", você achou a linha mais citada e a menos interessante. As outras quatro é que decidem projeto de verdade.
:::

:::exercicio {"id":"modelos-lineares-e41","tipo":"completar","objetivo":"O4","dificuldade":"facil"}
Complete: as cinco linhas da tabela seguinte são ______ do sistema, e é por isso que nenhuma delas aparece na [métrica](../glossario.md#termos-fundamentais) de teste.

> **gabarito:** restrições|restricoes|requisitos|exigências|exigencias
> **porque:** A tabela não afirma que o linear prevê melhor. Ela lista **restrições** que o problema impõe antes de qualquer medição, e sob as quais um ganho de acerto precisa ser grande o bastante para pagar o que se perde.
>
> Quem responde "vantagens" inverte o sentido da seção, porque a vantagem é do problema e não do modelo. Quem responde "métricas" comete o erro que o cartão combate: latência, auditabilidade e calibração são exigências, e nenhuma delas é medida por uma métrica de acerto.
>
> A consequência prática é a ordem de trabalho. Escreva as restrições antes de abrir o notebook, porque depois de ver o placar fica difícil não decidir por ele.
> **volte para:** #quando-o-linear-e-a-escolha-certa
:::

:::cartao {"nivel":6,"titulo":"As cinco situações, e nenhuma é o placar","apresenta":["Linha de base"]}

| Situação | Por quê |
|---|---|
| **Poucos dados por [atributo](../glossario.md#termos-fundamentais)** | menos [parâmetros](../glossario.md#termos-fundamentais), menos [variância](../glossario.md#termos-fundamentais): com 200 linhas e 50 colunas, o [ensemble](../glossario.md#diagnostico-e-leitura-do-modelo) decora |
| **Necessidade de auditoria** | um número por atributo, defensável. Exigência regulatória em crédito e seguro |
| **Probabilidade que vira dinheiro** | sai razoavelmente calibrado; ensembles frequentemente não (cap. II.1) |
| **[Linha de base](../glossario.md#termos-fundamentais) obrigatória** | é a régua contra a qual o modelo complexo se justifica |
| **Latência apertada** | uma multiplicação de vetores, muito mais rápida que uma floresta |

:::interacao {"id":"modelos-lineares-i38","tipo":"principio","titulo":"A linha que vale sempre"}
Quatro linhas da tabela só entram quando a restrição correspondente existe. Uma vale sempre.

> **pergunta:** Escreva qual é, e o que ela responde que as outras quatro não respondem.
> **revela:** **Linha de base obrigatória.** As outras quatro dependem do contexto: só valem se houver pouco dado, regulador, dinheiro multiplicado ou prazo de resposta.
>
> A linha de base não depende de nada disso. Ela responde "quanto do sinal é simplesmente linear?", e essa pergunta existe em todo problema, inclusive naqueles em que o linear vai perder feio no fim.
>
> Se a sua frase nomeou a linha certa e parou aí, falta a metade que decide. O que a torna incondicional é a pergunta que ela responde vir **antes** da comparação, e não depender de quem ficou na frente no teste.
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
> Sobra uma linha da tabela que vale mesmo sem restrição nenhuma, e ela é o assunto do cartão que fecha esta parte.
> **volte para:** #quando-o-linear-e-a-escolha-certa
:::

:::cartao {"nivel":6,"titulo":"Duas linhas da tabela, por dentro"}

### Duas linhas da tabela, por dentro

Duas das cinco escondem um mecanismo, e é o mecanismo que decide.

**Poucos dados por [atributo](../glossario.md#termos-fundamentais).** Com 50 colunas o linear estima 51 números. Um [ensemble](../glossario.md#diagnostico-e-leitura-do-modelo) de árvores estima uma estrutura muito maior a partir das mesmas linhas, e sobra amostra para cada corte decorar ruído.

**Probabilidade que vira dinheiro.** O linear sai razoavelmente calibrado, e ensembles frequentemente precisam de correção posterior ([capítulo II.1](ii-1-avaliacao.md)). Ordenar bem e acertar o valor são exigências diferentes, e só a segunda sobrevive a uma multiplicação.

:::interacao {"id":"modelos-lineares-i27","tipo":"principio","titulo":"Duzentas linhas, cinquenta colunas"}
Um conjunto tem 200 linhas e 50 colunas, e você compara um linear com um ensemble.

> **pergunta:** Escreva quem tende a ir melhor no teste, e faça a contagem que sustenta a sua resposta.
> **revela:** O **linear**, e a razão é contagem. Com 50 colunas ele estima 51 números; o ensemble estima uma estrutura muito maior a partir das mesmas 200 linhas, e sobra amostra para cada corte decorar ruído.
>
> Não é uma lei, é uma tendência com mecanismo conhecido: quanto mais o modelo tem a estimar, mais dado ele precisa para estimar bem. É o mesmo raciocínio de viés e variância do [capítulo 0.2](../0-2-fundamentos.md), aplicado à escolha da família.
:::

:::exercicio {"id":"modelos-lineares-e30","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Uma equipe multiplica a probabilidade prevista pelo valor da apólice para provisionar. Por que a [calibração](../glossario.md#termos-fundamentais) pesa mais que a ordenação?

- [ ] A ordenação foi substituída pela calibração.
- [ ] Provisão não aceita base estatística.
- [x] O número é multiplicado, não só ordenado.
- [ ] Calibrar melhora a acurácia por limiar.

> **gabarito:** o número previsto é multiplicado
> **porque:** Ordenar exige só que o modelo ponha os casos na ordem certa. Multiplicar exige que **o valor** esteja certo: uma probabilidade de 0,4 que na verdade é 0,2 dobra a provisão, mesmo com a ordenação impecável.
>
> A primeira alternativa inventa uma sucessão que não existe, porque as duas medidas respondem a perguntas diferentes e convivem. A segunda é falsa, e provisão baseada em modelo é prática corrente e regulada. A quarta troca calibração por acurácia: recalibrar reescala as probabilidades sem mexer na ordem, então a acurácia por limiar pode não mudar nada.
>
> É a terceira linha da tabela do cartão anterior, e ela vem logo depois dela porque a leitura errada custa dinheiro antes de custar reputação.
> **volte para:** #duas-linhas-da-tabela-por-dentro
:::

:::cartao {"nivel":6,"titulo":"O caso da seguradora","apresenta":["AUC"]}

### O caso da seguradora

Quatro restrições numa proposta só, e nenhuma delas é sobre acertar mais. Uma seguradora precisa de um modelo treinado em 300 apólices com 40 [atributos](../glossario.md#termos-fundamentais), com resposta em menos de 10 ms, justificativa por escrito ao regulador em cada recusa, e a probabilidade multiplicada pelo valor da apólice para calcular a provisão.

A comparação que a equipe pretende fazer é por **AUC** (*area under the curve*, área sob a curva), a [métrica](../glossario.md#termos-fundamentais) que o [capítulo II.1](ii-1-avaliacao.md) apresenta: a probabilidade de um caso positivo sorteado ao acaso receber escore maior que um negativo sorteado ao acaso. Ela mede **ordenação**, e só ordenação.

:::interacao {"id":"modelos-lineares-i21","tipo":"principio","titulo":"O que a AUC não vê"}
Sobre a proposta acima, com as quatro restrições postas lado a lado.

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

:::cartao {"nivel":6,"titulo":"Treine sempre um linear primeiro"}

### Treine sempre um linear primeiro

A [linha de base](../glossario.md#termos-fundamentais) tem um corolário que vale sozinho: **sempre treine um linear primeiro**. Ele custa minutos e responde à pergunta anterior a todas as outras, que é "quanto do sinal é simplesmente linear?".

E o contraexemplo honesto, para o corolário não virar fé: no [capítulo II.5](ii-5-arvores-ensembles.md) o linear faz **0,4963 de AUC** contra **0,9392** do boosting, num dado de fronteira irregular.

:::interacao {"id":"modelos-lineares-i22","tipo":"principio","titulo":"Quando o ganho é pequeno"}
Você treinou o linear, treinou o complexo depois, e no mesmo teste o ganho do segundo foi pequeno.

> **pergunta:** Escreva o que esse resultado revelou, e a decisão de engenharia que ele autoriza.
> **revela:** Que **o sinal é quase todo linear**. A linha de base não serve para ser vencida: ela serve para dizer quanto de estrutura o problema tem além de uma soma ponderada.
>
> E aí a conta vira de engenharia. O ganho pequeno é permanente, e o custo do modelo complexo também: mais dependências, mais tempo de treino, mais superfície para quebrar, e uma explicação que ninguém escreve na carta de recusa.
>
> Quem previu "mal configurado" fez a aposta que custa semanas. Ela às vezes é verdadeira, e por isso a ordem importa: só vale investigá-la depois de a linha de base ter sido medida.
:::

:::exercicio {"id":"modelos-lineares-e6","tipo":"aberta","objetivo":"O4","dificuldade":"dificil"}
Agora use tudo. A dona da barraca de limonada quer decidir **o preço do próximo verão** e pede ajuda. Você tem os 365 dias do conjunto e um modelo linear com $R^2$ de 0,982, que é exatamente o tipo de linha de base que este cartão manda treinar primeiro.

Escreva a resposta que você daria a ela, em até seis linhas, sem jargão. Diga o que o modelo serve para responder, o que ele **não** serve, e o que você precisaria para responder a pergunta que ela fez.

> **rubrica:** Reconhece que o modelo prevê bem as vendas mas não estima o efeito do preço, porque nos dados o preço mudou junto com a estação; Não usa o R² alto como argumento a favor da recomendação de preço; Diz o que faltaria, variar o preço de propósito em dias comparáveis, porque nenhum recorte dos dados atuais resolve; Mantém o modelo como útil para o que ele faz bem, como prever demanda e dimensionar estoque; Responde em linguagem que a dona da barraca entende, sem exigir vocabulário técnico
> **porque:** Esta é a pergunta que separa "treinei um modelo" de "respondi a alguém". As três leituras que o exercício cobra estão no capítulo: o coeficiente não é causa, o R² alto não valida a recomendação, e o modelo linear continua sendo a escolha certa para **previsão de demanda**, que é outra pergunta.
>
> A resposta forte não é "não dá para saber". É separar as duas perguntas: *quantos copos vou vender amanhã, dado o tempo?* é respondida bem pelo modelo. *Quanto vendo a mais se eu baixar o preço?* não tem resposta no dado, porque o preço nunca variou sem a estação variar junto. E propor o desenho que traria essa informação: alternar preço entre dias parecidos, dentro do mesmo mês.
>
> Uma resposta que recomenda subir o preço citando o coeficiente positivo está errada mesmo que bem escrita, e é exatamente o relatório que o capítulo existe para impedir.
> **volte para:** #treine-sempre-um-linear-primeiro
:::

:::cartao {"nivel":7,"titulo":"O aperto, e a virada"}

## De onde isto veio

**O aperto.** Virada do século XVIII para o XIX, astronomia. Um cometa é observado em noites diferentes, e as observações não concordam. A órbita é uma só, e não há critério defensável para escolher a curva.

**O que se fazia antes.** Escolhia-se a olho. Dois astrônomos competentes chegavam a órbitas diferentes.

**A virada.** Trocar "a melhor curva" por uma regra explícita: a que torna mínima a soma dos quadrados dos desvios. Ela não é mais verdadeira que as outras, é **pública**: devolve a mesma resposta para qualquer pessoa.

**O nome.** *Moindres carrés*, [mínimos quadrados](../glossario.md#regressao-linear), é de Legendre, e é a definição do critério.

:::interacao {"id":"modelos-lineares-i28","tipo":"principio","titulo":"Dois astrônomos, os mesmos dados"}
Dois astrônomos recebem as mesmas observações e escolhem a olho.

> **pergunta:** Escreva o que eles obtêm, e diga se a média das duas escolhas resolveria.
> **revela:** **Órbitas diferentes, e sem árbitro.** O problema não era falta de dado nem falta de talento: era não existir uma regra escrita que dissesse o que "melhor curva" significa.
>
> A opção da média parece conciliadora e não resolve nada, porque a média de duas escolhas arbitrárias continua arbitrária. Sem critério declarado, não há como preferir uma resposta, nem como reconstruir a resposta de ontem.
:::

:::exercicio {"id":"modelos-lineares-e31","tipo":"completar","objetivo":"O5","dificuldade":"facil"}
Escreva o que faltava naquela astronomia: não era observação nem instrumento melhor, era uma ______ explícita do que conta como a melhor curva.

> **gabarito:** regra|regra explícita|regra explicita|critério|criterio|definição|definicao
> **porque:** O aperto era de **critério**, não de matéria-prima. Observações havia de sobra, e o excesso é que criava o problema: elas discordavam, e nada dizia como arbitrar entre as curvas candidatas.
>
> Três respostas próximas erram, e o enunciado já descarta duas delas. "Observação" inverte o quadro, porque com poucas observações não haveria discordância a resolver. "Instrumento" nomeia uma causa real do desacordo e não o problema a resolver, já que o erro de medida é o motivo de os pontos não caírem sobre uma curva, e o método existe justamente para conviver com ele. E "conta", ou qualquer palavra de cálculo, descreve um custo verdadeiro da época sem ser o que travava: mesmo com todo o tempo do mundo, sem critério não há resposta a calcular.
>
> É esse o sentido de dizer que a regressão **é** uma minimização. O que se inventou não foi a reta, foi o que conta como melhor reta.
> **volte para:** #de-onde-isto-veio
:::

:::cartao {"nivel":7,"titulo":"A ideia reaproveitável, e a disputa","apresenta":["Função de perda"]}

### Perda é critério de arbitragem

**A ideia reaproveitável.** Uma **[função de perda](../glossario.md#termos-fundamentais)** é um critério de arbitragem, não uma descoberta sobre o mundo: existe para tornar a escolha reproduzível e discutível.

Legendre publicou primeiro, em 1805. Gauss publicou em 1809, afirmando usar o método desde 1795. Stigler (1981) argumenta *"though not conclusively"* que Gauss o possuía antes, sem conseguir comunicá-lo.

No [capítulo III.1](iii-1-neuronio-artificial.md) o crédito pelo *backpropagation* fica com quem reinventou por último. Os dois casos dizem: **crédito não segue descoberta, segue comunicação.**

:::interacao {"id":"modelos-lineares-i30","tipo":"principio","titulo":"Trocar a perda é trocar o quê"}
Uma equipe passa a minimizar o [erro absoluto](../glossario.md#regressao-linear), nos mesmos dados.

> **pergunta:** Escreva o que essa equipe está trocando, e o que continua exatamente igual.
> **revela:** O **critério**. A família de modelos continua a mesma reta, e o que muda é a regra que decide qual reta ganha, porque o absoluto pesa o ponto distante dez vezes onde o quadrático pesa cem.
>
> A opção do "nada de essencial" é a confusão que a seção existe para desfazer. Perda não é uma propriedade do mundo que se descobre: é uma escolha declarada, e por isso trocá-la é decisão de projeto que precisa ser justificada e registrada.
:::

:::exercicio {"id":"modelos-lineares-e35","tipo":"multipla","objetivo":"O5","dificuldade":"media"}
O que o resumo de Stigler, como o capítulo o cita, permite afirmar?

- [ ] Que está provado que Gauss o possuía antes.
- [x] Que se argumenta, sem concluir, que ele o possuía antes.
- [ ] Que Gauss não o possuía antes, e que a reivindicação dele era falsa.
- [ ] Que a comunidade da época o conhecia por Gauss.

> **gabarito:** argumenta-se, sem concluir
> **porque:** A ressalva *though not conclusively* está na frase citada, e ela é parte da afirmação. O capítulo pode reportar a tese que o autor **declara**, e não pode transformá-la em fato demonstrado.
>
> A primeira alternativa é o erro que a ressalva existe para impedir, e é o mais fácil de cometer porque a frase soa conclusiva sem os parênteses. A terceira inverte o argumento, e ninguém afirmou isso. A quarta contradiz o próprio resumo, que diz o contrário: Gauss **falhou** em comunicar o método aos contemporâneos.
>
> O corte não inventa palavra nenhuma e mesmo assim inverte o estatuto da afirmação, que é o tipo de erro mais difícil de auditar depois. A regra que fica é a mesma que este livro aplica aos próprios números: hedge do autor é parte da afirmação, e removê-lo é alterá-la.
> **volte para:** #perda-e-criterio-de-arbitragem
:::

:::cartao {"nivel":7,"titulo":"Procedência das afirmações"}

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Legendre (1805) e Gauss (1809): obra, ano e conteúdo geral. Nenhuma das duas lida no original |
| ✓ᵃ | A tese que **Stigler declara** e o trecho citado entre aspas, do resumo de ["Gauss and the Invention of Least Squares"](https://projecteuclid.org/journals/annals-of-statistics/volume-9/issue-3/Gauss-and-the-Invention-of-Least-Squares/10.1214/aos/1176345451.full), *Annals of Statistics* 9(3):465–474, 1981, [10.1214/aos/1176345451](https://doi.org/10.1214/aos/1176345451) — **resumo lido no original; o corpo, não** |
| ⏳ | As notas de Olbers (1816) e Bessel (1832), e o ataque público de Legendre em 1820. O resumo de Stigler fala em "new evidence, both documentary and statistical", **sem nomear quais** |
| 📖 | A ideia reaproveitável ("perda é critério de arbitragem") e a ligação com o capítulo III.1 |

:::interacao {"id":"modelos-lineares-i34","tipo":"principio","titulo":"O selo da ideia reaproveitável"}
"Perda é critério de arbitragem" é a frase que este capítulo mais quer que você leve embora.

> **pergunta:** Escreva que selo ela leva na tabela, e o que o selo escolhido nega sobre ela.
> **revela:** **📖.** Nenhum documento de 1805 diz "função de perda é critério de arbitragem": a frase é a interpretação que este livro faz do que aconteceu, e vender interpretação como fato histórico é uma das três proibições da casa.
>
> Repare que o selo não enfraquece a ideia. Ele diz de onde ela vem, e é justamente por vir de leitura editorial que ela pode ser discutida sem que ninguém precise abrir um arquivo de 1805.
:::

:::exercicio {"id":"modelos-lineares-e37","tipo":"completar","objetivo":"O5","dificuldade":"dificil"}
"Perda é critério de arbitragem" não é afirmação de fonte histórica: é ______ deste livro, e o selo 📖 existe para dizer isso.

> **gabarito:** leitura editorial|leitura|interpretação|interpretacao|uma leitura editorial
> **porque:** O 📖 marca o que o livro **conclui**, separando-o do que as fontes **dizem**. A frase é a tradução da virada de 1805 para uma regra de projeto de hoje, e essa tradução é responsabilidade do autor deste capítulo.
>
> Três respostas próximas erram, e cada uma por um selo diferente. Quem responde "fonte não encontrada" descreveu o ❌, que é procurar e não achar; aqui ninguém procurou, porque não há o que procurar. Quem responde "hipótese" trata uma leitura conceitual como afirmação empírica à espera de experimento. E quem responde "metadado" descreveu o ✓ᵐ, que confere que uma obra existe e nada diz sobre o que ela afirma.
>
> A distinção tem consequência prática. Você pode discordar da leitura sem contestar nenhum fato histórico, o que é exatamente o tipo de discordância que um livro deve tornar possível.
> **volte para:** #de-onde-isto-veio
:::

:::cartao {"nivel":8,"titulo":"Síntese — o que levar"}

## Síntese — o que levar

- [Regressão linear](../glossario.md#regressao-linear) minimiza **erro quadrático** por diferenciabilidade e [solução fechada](../glossario.md#regressao-linear), não por ser intrinsecamente mais correto.
- A dedução dá **duas condições**: a soma dos [resíduos](../glossario.md#modelos-lineares) é zero, e os resíduos são [ortogonais](../glossario.md#regressao-linear) ao [atributo](../glossario.md#termos-fundamentais).
- $a = S_{xy}/S_{xx}$, e o denominador avisa: **atributo que não varia não tem [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo)**.
- [Gradiente](../glossario.md#regressao-linear) e solução fechada chegam ao mesmo lugar. O gradiente é a ferramenta **geral**; a fechada é o caso de sorte.
- Coeficiente **não é causa**, não é comparável sem [padronização](../glossario.md#regressao-linear), não é estável sob [colinearidade](../glossario.md#modelos-lineares), e não vale fora da faixa observada.
- Treine sempre um linear primeiro, porque ele responde em minutos quanto do sinal é simplesmente linear.
- **Uma perda é um critério de arbitragem**: quem escolhe a perda escolhe o que conta como erro.

:::interacao {"id":"modelos-lineares-i36","tipo":"principio","titulo":"A frase que você diria ao colega"}
Um colega quer aprovar um [ensemble](../glossario.md#diagnostico-e-leitura-do-modelo) para um sistema de crédito sem treinar o linear antes.

> **pergunta:** Escreva a frase que você diria a ele, usando uma das linhas acima.
> **revela:** A frase mais forte não é sobre acerto: é que **sem a linha de base ninguém sabe quanto do ganho é real**, e que um sistema de crédito ainda vai precisar de uma explicação por escrito em cada recusa.
>
> Se a sua frase falou só de desempenho, ela perde a discussão no dia em que o ensemble ganhar por pouco. As duas que não perdem são a linha de base e a auditoria, porque nenhuma delas depende de quem ficou na frente no teste.
:::

:::exercicio {"id":"modelos-lineares-e39","tipo":"completar","objetivo":"O1","dificuldade":"media"}
Complete a síntese do capítulo: uma [função de perda](../glossario.md#termos-fundamentais) é um ______ de arbitragem, e não uma descoberta sobre o mundo.

> **gabarito:** critério|criterio
> **porque:** É a ideia reaproveitável desta lição, e ela reposiciona tudo o mais. A perda declara o que conta como erro, e a partir dessa declaração o resto do método é consequência mecânica.
>
> Duas respostas próximas erram por motivos diferentes. Quem responde "método" troca a regra pelo procedimento que a executa, e o procedimento é o que muda quando você troca gradiente por álgebra. Quem responde "modelo" troca a regra pela família de funções, e a reta continua reta com qualquer perda.
>
> O teste de que a ideia foi absorvida é conseguir usá-la fora daqui. Toda vez que um sistema classifica, ordena ou recomenda, alguém escolheu um critério, e essa escolha é discutível.
> **volte para:** #sintese-o-que-levar
:::

:::cartao {"nivel":8,"titulo":"Verificação"}

## Verificação

1. Mostre, sem consultar o texto, por que a reta de [mínimos quadrados](../glossario.md#regressao-linear) passa necessariamente pelo ponto $(\bar{x}, \bar{y})$.
2. Você tem 180 linhas e 60 [atributos](../glossario.md#termos-fundamentais). Que família de modelo você tenta primeiro, e por quê?
3. Dois atributos do seu modelo são quase idênticos. O erro de validação está ótimo. O que pode estar errado mesmo assim?
4. No laboratório, o que aconteceria com a reta ótima se todos os pontos tivessem o mesmo $x$? Responda pela fórmula, não pelo desenho.

:::interacao {"id":"modelos-lineares-i37","tipo":"principio","titulo":"A primeira, de cabeça"}
Responda a questão 1 antes de revelar, com as suas palavras.

> **pergunta:** Por que a reta ótima passa por $(\bar{x}, \bar{y})$?
> **revela:** No mínimo, a derivada da perda em relação a $b$ se anula, e isso equivale a dizer que a soma dos resíduos é zero. Dividindo por $n$, a média dos resíduos é zero, o que dá $\bar{y} - a\bar{x} - b = 0$. Logo o ponto $(\bar{x}, \bar{y})$ satisfaz a equação da reta.
>
> Compare com o que você escreveu. Se o seu argumento partiu do desenho, ou de "faz sentido que passe pelo meio", ele não é uma demonstração: o que fecha a questão é a condição de primeira ordem, e nada além dela.
:::

:::exercicio {"id":"modelos-lineares-e40","tipo":"numerica","objetivo":"O3","dificuldade":"dificil"}
Questão 3, na célula 8.1 do [notebook](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb). Troque `arredondar` para `True` e rode: entra uma cópia da `temperatura`, arredondada ao grau. Responda o [coeficiente](../glossario.md#diagnostico-e-leitura-do-modelo) de `temperatura`, com quatro casas.

> **gabarito:** 0,4985 ± 0,0006
> **porque:** Ele salta de 0,3692 para **0,4985**, e a coluna nova fica com −0,1295. Os dois somados dão 0,3690, que é o coeficiente de sempre: o mesmo efeito, agora repartido entre dois nomes, e a repartição decidida por detalhe de amostra.
>
> Agora olhe o $R^2$ da mesma saída: **0,9821**, a mesma casa decimal de antes. É a questão 3 em números. O placar não piora, e nada nele avisa que metade de um efeito passou a ser creditada a uma coluna que ninguém mediu no mundo.
>
> Dois números aparecem no lugar. Quem responde 0,3692 leu a saída com `arredondar` em `False`, que é a do capítulo inteiro. Quem responde −0,1295 leu a linha da coluna nova.
> **volte para:** #verificacao
:::

:::exercicio {"id":"modelos-lineares-e50","tipo":"numerica","objetivo":"O2","dificuldade":"dificil"}
Questão 4, na célula 8.2 do mesmo notebook. Ponha `mes = 7` e rode: sai o $S_{xx}$ de cada coluna em julho. Responda o da `temperatura`, arredondado à unidade.

> **gabarito:** 1902 ± 5
> **porque:** Sai **1 902**, e o número só interessa pelo contraste da linha de baixo: o `preco` sai em 0,000, em julho e em qualquer outro mês que você escolher.
>
> Esse zero responde à questão 4 pela fórmula. Em $a = S_{xy}/S_{xx}$, o denominador é a variação do atributo dentro do recorte, e sem variação não há divisão a fazer. Não é um coeficiente ruim, é a ausência de coeficiente, e é o mesmo aviso do passo 5 da dedução.
>
> Dois números aparecem no lugar. Quem responde 0 leu a linha do `preco`, que é o zero que o cartão quer, na coluna errada. Quem responde 129 deixou o mês que vem pronto na célula.
> **volte para:** #verificacao
:::
