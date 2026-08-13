# Prova do capítulo III.1 — O Neurônio Artificial

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado**. A recomendação do livro a quem dá aula é pontuar **por ter
> feito, nunca por ter acertado**.

## O que esta prova é

Doze itens sobre o capítulo [III.1](../capitulos/iii-1-neuronio-artificial.md), para aplicar ao fim dele. Os quatro objetivos declarados no capítulo aparecem três vezes cada, e a ordem sobe: os três primeiros pedem reconhecimento e conta direta, os quatro últimos pedem julgamento.

Nenhum item traz o **"volte para"**, porque a prova mede recuperação sem rota de volta. Todos são corrigidos na hora, sem consultar modelo de linguagem.

Quatro itens pedem conta à mão, com papel: a saída de um neurônio dados os pesos, o limiar de uma função lógica nova, um passo da regra do perceptron e a triagem de cinco configurações candidatas ao NÃO-E. São eles que separam quem entendeu de quem reconheceu o vocabulário.

Cada item liga o III.1 a um capítulo anterior, e a referência aponta sempre para trás. Nenhuma ideia deste capítulo nasceu nele: o limiar que vira decisão vem da avaliação, a busca por pesos vem da otimização, e a escolha de atributos vem da representação.

:::exercicio {"id":"prova-iii-1-q1","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O1","livro/capitulos/ii-4-otimizacao.md:O1"],"dificuldade":"facil"}
Verdadeiro ou falso: no modelo publicado por McCulloch e Pitts em 1943, os pesos são ajustados automaticamente a partir de exemplos rotulados.

- [ ] Verdadeiro
- [x] Falso

> **gabarito:** Falso
> **porque:** O modelo de 1943 descreve o que um neurônio **computa**, e nada nele descreve como os pesos apareceriam. Quem projeta a rede põe os pesos à mão, e a pergunta que McCulloch e Pitts responderam era lógica: que funções uma rede desses elementos consegue calcular.
>
> "Verdadeiro" atrai porque a expressão *rede neural* hoje carrega treino junto, e quem lê 1943 com os olhos de 2026 supõe aprendizado onde ele não estava. A regra de aprendizado chega quinze anos depois, com o perceptron de Rosenblatt, em 1958.
>
> A ligação com o capítulo de otimização é direta. Aprender pesos é executar um procedimento de busca sobre eles, e em 1943 não havia procedimento nenhum: havia um teorema sobre o que era representável.
:::

:::exercicio {"id":"prova-iii-1-q2","tipo":"numerica","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O1","livro/capitulos/ii-1-avaliacao.md:O4"],"dificuldade":"facil"}
Um neurônio de McCulloch–Pitts tem três entradas, com pesos `w₁ = 2`, `w₂ = −1` e `w₃ = 3`, e limiar `θ = 1`. Ele dispara quando a soma ponderada **alcança** o limiar, ou seja, quando `w₁x₁ + w₂x₂ + w₃x₃ ≥ θ`.

Chega a entrada `x = (1, 1, 0)`. Qual é a saída `y`?

> **gabarito:** 1
> **porque:** A soma é $2 \times 1 + (-1) \times 1 + 3 \times 0 = 2 - 1 + 0 = 1$. O limiar também é 1, e a regra do modelo dispara quando a soma **alcança** o limiar. Como $1 \geq 1$, a saída é **1**.
>
> O item foi armado para cair exatamente na fronteira, e quem responde 0 quase sempre acertou a aritmética e leu a comparação como estritamente maior. A escolha entre `≥` e `>` parece detalhe de notação e decide a resposta em todo ponto que cai sobre a reta.
>
> É o mesmo cuidado que o capítulo de avaliação cobra ao separar a qualidade do *ranking* da qualidade da decisão. A soma ponderada é o escore; o limiar é o que transforma escore em decisão, e mexer nele muda o rótulo sem mexer no escore.
:::

:::exercicio {"id":"prova-iii-1-q3","tipo":"numerica","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O2","livro/capitulos/ii-2-modelos-lineares.md:O3"],"dificuldade":"facil"}
Você quer um neurônio que decida por **voto de maioria** entre três entradas binárias: ele dispara quando pelo menos duas das três forem 1, e não dispara nos demais casos. Use `w₁ = w₂ = w₃ = 1`, com a regra `soma ≥ θ`.

Qual é o valor inteiro de limiar `θ` que faz o neurônio funcionar corretamente?

> **gabarito:** 2
> **porque:** Com os três pesos iguais a 1, a soma ponderada é simplesmente a contagem de entradas ligadas: 0, 1, 2 ou 3. A maioria deve disparar quando a contagem é 2 ou 3, e não disparar quando é 0 ou 1. Então θ precisa ser no máximo 2 e maior que 1, e o único inteiro nessa faixa é **θ = 2**.
>
> Os dois erros previsíveis são vizinhos. Com θ = 3 você construiu o E de três entradas, que exige unanimidade; com θ = 1 construiu o OU de três entradas, que se contenta com uma. Os pesos são os mesmos nos três casos, e quem decide qual função o neurônio computa é o limiar.
>
> A ligação com os modelos lineares é a leitura do coeficiente. Pesos iguais dizem que as três entradas têm a mesma importância, e essa é toda a informação que os pesos carregam aqui. Quanta evidência basta para dizer sim é uma segunda decisão, e ela mora no limiar.
:::

:::exercicio {"id":"prova-iii-1-q4","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O3","livro/capitulos/ii-2-modelos-lineares.md:O4"],"dificuldade":"media"}
Um aluno tenta o XOR no laboratório, trava em 3 de 4 e conclui: "o problema é que temos só quatro exemplos; com mais dados rotulados a reta certa apareceria".

Qual resposta corrige o erro pela geometria?

- [ ] Ele tem razão: o perceptron converge para o XOR desde que receba exemplos suficientes.
- [x] Os quatro pontos **são** o problema inteiro, e os que devem disparar ocupam cantos opostos do quadrado; nenhuma reta deixa dois cantos opostos de um lado e os outros dois do outro.
- [ ] O problema é a codificação das entradas; trocar 0 e 1 por −1 e +1 torna o XOR separável.
- [ ] O problema é o limiar ser inteiro; com θ fracionário a reta passa entre os cantos opostos.

> **gabarito:** os quatro pontos são o problema inteiro, e eles ocupam cantos opostos
> **porque:** O XOR de duas entradas tem exatamente quatro casos, e todos estão sobre a mesa. Ele dispara em (0,1) e (1,0), que são cantos opostos do quadrado, e não dispara em (0,0) e (1,1), também opostos entre si. Uma reta divide o plano em dois lados, e nenhuma posição dela separa um par de cantos opostos do outro par.
>
> A primeira alternativa é o erro do enunciado repetido em voz alta, e ele é atraente porque "mais dados" resolve muita coisa em Machine Learning. Aqui não há amostra a aumentar: a tabela-verdade já é a população.
>
> A terceira é a mais fina das erradas. Trocar 0/1 por −1/+1 é uma transformação afim das entradas, e transformação afim preserva separabilidade linear. Nessa codificação os pontos que disparam viram (−1,+1) e (+1,−1), que continuam sendo cantos opostos.
>
> A quarta troca geometria por aritmética, que é o mal-entendido mais comum do capítulo. Nenhum ajuste fino de θ ajuda, porque o que falta não é precisão no valor do limiar: é uma segunda fronteira.
:::

:::exercicio {"id":"prova-iii-1-q5","tipo":"numerica","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O2","livro/capitulos/ii-4-otimizacao.md:O1"],"dificuldade":"media"}
Um perceptron está com `w₁ = 0,5`, `w₂ = −0,5` e limiar `θ = 0,2`, e dispara quando `w₁x₁ + w₂x₂ ≥ θ`. A regra de Rosenblatt, com taxa `η = 0,1`, faz o seguinte quando a saída `ŷ` difere do rótulo `y`:

`wᵢ ← wᵢ + η(y − ŷ)xᵢ` e `θ ← θ − η(y − ŷ)`

Chega o exemplo `x = (1, 1)` com rótulo `y = 1`. Aplique **um** passo da regra.

Qual é o novo valor de `w₁`?

> **gabarito:** 0.6 ± 0.01
> **porque:** Primeiro classifique com os pesos atuais: $0{,}5 \times 1 + (-0{,}5) \times 1 = 0$. Como $0 \geq 0{,}2$ é falso, a saída é $\hat{y} = 0$ e o rótulo é $y = 1$, então houve erro e a regra dispara. O termo $(y - \hat{y})$ vale 1, e $w_1 \leftarrow 0{,}5 + 0{,}1 \times 1 \times 1 = \mathbf{0{,}6}$.
>
> Vale terminar a conta para ver o passo funcionar. No mesmo movimento, $w_2 \leftarrow -0{,}5 + 0{,}1 = -0{,}4$ e $\theta \leftarrow 0{,}2 - 0{,}1 = 0{,}1$. Refazendo a classificação, a soma agora é $0{,}6 - 0{,}4 = 0{,}2$, que alcança o novo limiar de $0{,}1$, e o exemplo passou a ser classificado corretamente.
>
> Duas respostas erradas são frequentes e diagnósticas. Quem responde 0,5 concluiu que não houve erro, o que costuma vir de ler a comparação como estritamente maior ou de esquecer o limiar. Quem responde 0,4 aplicou o sinal do limiar aos pesos: θ desce quando os pesos sobem, porque baixar a barreira e aumentar a evidência empurram a fronteira para o mesmo lado.
>
> É o gradiente descendente do capítulo de otimização em versão mínima. O método olha um exemplo, mede o erro e move a fronteira na direção daquele ponto, com o tamanho do passo dado pela taxa.
:::

:::exercicio {"id":"prova-iii-1-q6","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O4","livro/capitulos/ii-2-modelos-lineares.md:O4"],"dificuldade":"media"}
*Perceptrons*, de Minsky e Papert, saiu em 1969 e é apontado como estopim do inverno da IA. Qual leitura desse episódio o capítulo sustenta?

- [ ] A demonstração de 1969 continha um erro matemático, corrigido nos anos 1980, e o inverno veio de um argumento falso.
- [x] A demonstração estava correta, e o que se ampliou além dela foi a leitura: o limite era da arquitetura de uma camada, não do neurônio.
- [ ] O inverno veio da falta de computadores rápidos, e nenhum argumento teórico teve papel nele.
- [ ] O perceptron nunca teve prova de convergência, e a área o abandonou ao descobrir isso.

> **gabarito:** a demonstração estava correta, e a leitura é que foi ampliada
> **porque:** Minsky e Papert demonstraram com rigor que uma camada não computa o XOR, e isso permanece verdadeiro. O que não estava demonstrado é a conclusão que o campo tirou, de que redes neurais em geral seriam um beco sem saída. A saída de 1986 confirma qual das duas afirmações era a certa: empilhar camadas resolve, e o neurônio continuou o mesmo.
>
> A primeira alternativa é atraente porque a história terminou bem para as redes neurais, e é tentador supor que o argumento contrário tenha sido refutado. Ele não foi: uma camada continua sem computar o XOR.
>
> A terceira aponta um fator real e o promove a causa única. Hardware pesou, e o que redirecionou financiamento para a IA simbólica foi a leitura de um resultado teórico.
>
> A quarta inverte o registro histórico. Rosenblatt provou a convergência do perceptron em 1958, e a prova é sólida; ela vale **sob a condição** de o problema ser linearmente separável, e foi essa condição que o entusiasmo da época não leu.
:::

:::exercicio {"id":"prova-iii-1-q7","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O1","livro/capitulos/i-6-representacao.md:O3"],"dificuldade":"media"}
Verdadeiro ou falso: multiplicar por 3 todos os pesos **e** o limiar de um neurônio de McCulloch–Pitts não altera nenhuma das saídas da tabela-verdade.

- [x] Verdadeiro
- [ ] Falso

> **gabarito:** Verdadeiro
> **porque:** A saída depende de uma comparação, e não das grandezas isoladas. Se $w \cdot x \geq \theta$, então $3(w \cdot x) \geq 3\theta$, e a recíproca também vale, porque multiplicar os dois lados de uma desigualdade por um número positivo preserva o sentido dela. Confira no E: com $(w_1, w_2, \theta) = (1, 1, 2)$ o neurônio dispara só em (1,1); com $(3, 3, 6)$ a soma em (1,1) é 6, que alcança o limiar 6, e em (0,1) é 3, que não alcança.
>
> "Falso" atrai por um reflexo razoável em outros contextos: pesos maiores costumam significar mais influência. Aqui a escala foi aplicada aos dois lados da comparação, e o que sobrevive é a fronteira, que é a mesma reta escrita com números maiores.
>
> É a explicação de por que o capítulo mostra três configurações que resolvem o E. Infinitas retas separam aqueles quatro pontos, e o reescalonamento é a família mais fácil de enxergar dentro dessas infinitas.
>
> Um aviso que o item não cobra e vale levar: com fator **negativo** a desigualdade inverte, e o neurônio passa a computar a negação da função original.
:::

:::exercicio {"id":"prova-iii-1-q8","tipo":"multipla-multi","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O4","livro/capitulos/ii-2-modelos-lineares.md:O1"],"dificuldade":"media"}
Quais afirmações sobre a cronologia registrada no capítulo estão corretas? (marque todas que valem)

- [x] A retropropagação foi descrita em 1970, por Linnainmaa, numa tese de mestrado que não menciona redes neurais.
- [x] A primeira aplicação da retropropagação eficiente a redes neurais é de 1981, com Werbos.
- [x] O neurônio artificial (1943) é mais velho que o termo *artificial intelligence*, que aparece pela primeira vez na proposta do projeto de Dartmouth, de 31 de agosto de 1955.
- [ ] Rumelhart, Hinton e Williams descreveram a retropropagação pela primeira vez, no artigo de 1986.

> **gabarito:** Linnainmaa em 1970 · aplicação a redes em 1981 · o neurônio é mais velho que o nome do campo
> **porque:** As três corretas vêm do levantamento de Schmidhuber, lido e citado no capítulo, e da proposta de Dartmouth, ligada ali. A tese de 1970 traz o método *"albeit without reference to NNs"*, e a aplicação a redes aparece em 1981; a discussão preliminar de Werbos, de 1974, é uma terceira coisa e o capítulo a separa das outras duas.
>
> A alternativa errada é a versão que quase todo curso repete, e ela erra num verbo. O artigo de 1986 **popularizou** a retropropagação e mostrou as representações aprendidas nas camadas escondidas, o que é uma contribuição real; descrever o método pela primeira vez é outra coisa, e é de dezesseis anos antes.
>
> A ligação com os modelos lineares é o padrão, não a data. Lá, Gauss provavelmente tinha os mínimos quadrados antes e perdeu a prioridade para Legendre, que publicou primeiro. Os dois casos juntos sustentam a leitura editorial do livro: crédito segue comunicação.
:::

:::exercicio {"id":"prova-iii-1-q9","tipo":"multipla-multi","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O2","livro/capitulos/ii-2-modelos-lineares.md:O2"],"dificuldade":"dificil"}
O **NÃO-E (NAND)** dispara em (0,0), (0,1) e (1,0), e não dispara em (1,1). Um neurônio dispara quando `w₁x₁ + w₂x₂ ≥ θ`.

Teste as quatro linhas da tabela-verdade em cada configuração `(w₁, w₂, θ)` abaixo. Quais implementam o NAND? (marque todas que valem)

- [x] (−1, −1, −1)
- [x] (−2, −2, −3)
- [ ] (−1, −1, 0)
- [ ] (1, 1, 2)
- [x] (−1, −2, −2)

> **gabarito:** (−1, −1, −1) · (−2, −2, −3) · (−1, −2, −2)
> **porque:** Faça as quatro somas de cada candidata e compare com o limiar dela. Em (−1, −1, −1) as somas são 0, −1, −1 e −2, e com θ = −1 as três primeiras alcançam o limiar e a última não: é o NAND. Em (−2, −2, −3) as somas são 0, −2, −2 e −4, e θ = −3 deixa de fora só a última. Em (−1, −2, −2) as somas são 0, −2, −1 e −3, e θ = −2 novamente barra apenas (1,1).
>
> A terceira configuração é o distrator central e captura uma confusão real entre funções vizinhas. Com (−1, −1, 0) as somas continuam 0, −1, −1 e −2, e θ = 0 só é alcançado pela primeira: dispara em (0,0) e em mais nada, ou seja, é o NÃO-OU (NOR). Trocar NAND por NOR é o erro mais comum de quem decora o sinal do peso sem refazer a tabela.
>
> A quarta é o E puro, com somas 0, 1, 1 e 2 e θ = 2, disparando exatamente onde o NAND se cala. Ela atrai porque NAND é lido como "o E negado", e negar a função não é negar o limiar mantendo os pesos.
>
> A quinta corrigida é a que mais ensina, e o ponto dela são os **pesos diferentes entre si**. Nada exige simetria: o que precisa valer é que (1,1) fique de um lado da reta e os outros três do outro. É a mesma leitura de inclinação e intercepto do capítulo de modelos lineares, com a diferença de que aqui a reta é escolhida à mão.
:::

:::exercicio {"id":"prova-iii-1-q10","tipo":"numerica","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O3","livro/capitulos/ii-3-regressao-logistica.md:O1"],"dificuldade":"dificil"}
Existem 16 funções booleanas de duas entradas, contando as duas constantes. Pesos e limiar podem ser quaisquer números reais, positivos ou negativos.

Quantas dessas 16 um **único** neurônio de McCulloch–Pitts consegue implementar?

> **gabarito:** 14
> **porque:** Uma função é implementável por um neurônio quando existe reta que separe os pontos que disparam dos que não disparam. Das 16 funções de duas entradas, duas falham nesse teste, e são o XOR e a negação dele. Sobram **14**.
>
> As constantes contam, e vale conferir para não perdê-las. A função sempre-0 sai com $w_1 = w_2 = 0$ e $\theta = 1$, já que a soma é sempre 0 e nunca alcança o limiar; a função sempre-1 sai com os mesmos pesos e $\theta = 0$, porque $0 \geq 0$.
>
> Responder 4 é o erro mais informativo, e ele vem de listar só as funções que o capítulo nomeia: E, OU, NÃO-E e NÃO-OU. Elas são as quatro que o laboratório oferece, e não são a lista completa das separáveis.
>
> O número importa por causa da proporção. O XOR não é uma exceção rara e nem é o caso comum: quase toda função de duas entradas cabe num neurônio, e ainda assim a que não cabe foi suficiente para parar a área por quase vinte anos. A regressão logística está exatamente no mesmo lugar, porque também traça uma reta só, e o nome contínuo da saída não muda a conta.
:::

:::exercicio {"id":"prova-iii-1-q11","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O3","livro/capitulos/i-6-representacao.md:O4"],"dificuldade":"dificil"}
Uma equipe quer o XOR sem acrescentar camada nenhuma. A proposta é alimentar **um único** neurônio com três entradas: `x₁`, `x₂` e uma terceira construída à mão, `x₃ = x₁ · x₂`.

O que acontece?

- [x] Funciona: com `w = (1, 1, −2)` e `θ = 1` o neurônio reproduz o XOR, porque no espaço de três dimensões os quatro pontos passam a ser separáveis por um plano. Quem resolveu foi o atributo construído, e não o neurônio.
- [ ] Não funciona: o XOR é impossível para um único neurônio em qualquer espaço de entrada, e essa é a demonstração de 1969.
- [ ] Funciona, e mostra que Minsky e Papert erraram ao dizer que uma camada não computa o XOR.
- [ ] Não funciona, porque `x₁ · x₂` é uma operação não linear e o neurônio só admite entradas binárias.

> **gabarito:** funciona, e quem resolveu foi o atributo construído
> **porque:** Confira as quatro linhas com $w = (1, 1, -2)$ e $\theta = 1$. Em (0,0) a terceira entrada é 0 e a soma é 0, abaixo do limiar; em (0,1) a soma é 1 e dispara; em (1,0) a soma é 1 e dispara; em (1,1) a terceira entrada é 1 e a soma é $1 + 1 - 2 = 0$, abaixo do limiar. É exatamente a tabela do XOR.
>
> A segunda alternativa generaliza demais e é o engano mais caro do item. A demonstração de 1969 é sobre separabilidade **no espaço dado**, com as entradas que você tem. Mudar o espaço muda o problema, e é por isso que a mesma limitação some quando alguém constrói o atributo certo.
>
> A terceira erra na direção oposta, ao ler o resultado como refutação. Nada aqui contradiz 1969: no espaço original de duas entradas o XOR continua impossível para uma reta, e o que se fez foi sair desse espaço.
>
> A quarta junta um fato correto a uma conclusão que não decorre dele. O produto é de fato não linear, e é isso que faz a proposta funcionar, não o que a impede. O neurônio nunca exigiu entradas binárias: ele soma o que chega e compara com um limiar.
>
> A lição que fica é a do capítulo de representação. Você pode pagar a não-linearidade em dois lugares, no atributo ou na arquitetura, e a diferença é quem precisa saber a resposta antes. Construir $x_1 x_2$ à mão exige que alguém já saiba que o produto é o que falta; a camada extra do [III.2](../capitulos/iii-2-redes-neurais.md) descobre esse tipo de coisa sozinha, e é por isso que ela escala e o truque manual não.
:::

:::exercicio {"id":"prova-iii-1-q12","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O4","livro/capitulos/ii-4-otimizacao.md:O2"],"dificuldade":"dificil"}
No notebook do capítulo, o perceptron é treinado no XOR e o número de erros por época **oscila**, sem tendência de queda. Em AND, OU e NÃO-E, o mesmo código zera os erros em poucas épocas.

O que a oscilação demonstra?

- [ ] Que a taxa de aprendizado está alta demais, e reduzi-la faz o perceptron convergir para o XOR.
- [ ] Que a convergência para o XOR é lenta, e bastaria rodar mais épocas.
- [x] Que não há solução de que se aproximar: a prova de convergência de Rosenblatt vale sob a condição de separabilidade linear, e o XOR não a satisfaz. É o sintoma do impossível, e não do difícil.
- [ ] Que a inicialização caiu num mínimo local, e outra semente resolveria.

> **gabarito:** não há solução de que se aproximar
> **porque:** A regra do perceptron só se move quando erra, e ela empurra a fronteira na direção do ponto mal classificado. Havendo reta que separe tudo, esse empurrão termina, e a prova de 1958 garante que termina em número finito de passos. No XOR não existe essa reta, então cada correção estraga um ponto que estava certo, e a contagem de erros passeia em vez de descer.
>
> A primeira alternativa é o diagnóstico certo para o problema errado, e é a mais tentadora porque oscilação de perda costuma **mesmo** indicar taxa alta. O teste que separa os dois casos está no próprio enunciado: com o mesmo código e a mesma taxa, AND, OU e NÃO-E convergem. O que mudou foi o conjunto de dados.
>
> A segunda confunde impossível com lento, que é a distinção central do capítulo. O notebook fecha essa porta por força bruta, testando 15 625 combinações de pesos e limiar e chegando no máximo a 3 de 4.
>
> A quarta importa um diagnóstico verdadeiro de outro contexto. Semente ruim explica resultados diferentes quando a solução existe e a busca não a alcança; aqui nenhuma semente ajuda, porque o espaço de hipóteses de um neurônio não contém o XOR.
>
> É por isso que a oscilação é o dado histórico mais eloquente do capítulo. O sintoma estava disponível a quem treinasse um perceptron em 1960, e foi preciso esperar 1969 para que alguém demonstrasse o que ele significava.
:::
