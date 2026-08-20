# III.2 — Redes Multicamadas

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar o perceptron multicamadas como composição de transformações e não-linearidades.
- **O2.** Derivar backpropagation como aplicação da regra da cadeia.
- **O3.** Implementar uma rede densa em NumPy, do forward ao update.
- **O4.** Diagnosticar os modos de falha do treino: gradiente que some, que explode, e inicialização ruim.

## O problema: sabia-se qual era a rede, e não havia como treiná-la

No [capítulo III.1](iii-1-neuronio-artificial.md) você travou em 3 de 4. O XOR não sai com um neurônio só, e o motivo é geometria: uma reta não separa cantos opostos de um quadrado.

Este capítulo resolve isso — e vale dizer com prazer, porque a solução é curta: **duas retas**. Uma camada intermediária traça duas fronteiras, e a camada de saída combina as duas. O XOR fecha em 4 de 4.

Só que essa não era a parte difícil. **Depois de 1969 já se sabia que uma camada intermediária resolvia o XOR.** Qualquer um conseguia escrever à mão os pesos que fazem aquilo funcionar — você vai escrever mais adiante neste capítulo. O que não existia era um jeito de **descobrir** esses pesos a partir de dados, quando eles são milhares e ninguém sabe o que cada unidade escondida deveria significar.

A regra do perceptron não servia: ela corrige pesos comparando a saída com o rótulo, e a camada escondida **não tem rótulo**. Ninguém sabe o que a terceira unidade da camada do meio deveria ter respondido. Esse é o aperto, e ele durou quase vinte anos.

Foi isso que 1986 entregou: não a arquitetura, que já se conhecia, mas o procedimento para treiná-la.

## De onde isto veio

**O aperto.** A arquitetura estava disponível e inerte. Havia camadas escondidas, havia demonstração de que elas resolviam o que uma camada não resolve, e não havia sinal de erro para elas. A pergunta não era *"que rede usar?"*, era *"como atribuir culpa a um peso que fica no meio do caminho?"*.

**O que se fazia antes.** Duas saídas, ambas ruins. Ficar na **camada única** com a regra do perceptron — barato, convergente, e limitado ao que é linearmente separável. Ou pôr os **pesos escondidos à mão**, projetando cada unidade intermediária como se fosse uma função lógica. Funciona em brinquedos como o XOR; não funciona em nada com mais de uma dúzia de unidades.

**A virada, e ela vem em ordem inversa à intuição.** Primeiro veio o **procedimento**: em 1986, Rumelhart, Hinton e Williams popularizam o backpropagation e mostram que as camadas escondidas aprendem representações úteis sozinhas. Só depois veio a licença teórica. Cybenko, em *Approximation by superpositions of a sigmoidal function* (*Math. Control Signals Systems*, 1989), e Hornik, em *Approximation capabilities of multilayer feedforward networks* (*Neural Networks* 4:251–257, 1991), provam que **uma única camada escondida aproxima qualquer função contínua — desde que haja unidades suficientes**.

Repare na ordem. A engenharia funcionou por três anos antes de a matemática dizer que ela podia funcionar. Isso é mais comum do que os livros contam, e é um bom antídoto contra a ideia de que teoria precede prática.

**A ideia reaproveitável — e é a tese deste capítulo: existência não é treinabilidade.** O teorema diz que a rede certa **está** no espaço de hipóteses. Não diz de quantas unidades ela precisa. Não diz como achá-la. E não diz se o gradiente descendente chega até ela partindo de onde você inicializou. É um resultado **não construtivo**: garante que o objeto existe sem dar receita para construí-lo.

Guarde isso, porque a confusão é cara e frequente. "A rede pode representar qualquer função" é uma afirmação sobre o **conjunto de funções representáveis**. "A rede vai aprender essa função" é uma afirmação sobre o **procedimento de busca**, sobre os dados e sobre a inicialização. Os vinte anos de dificuldade que o [capítulo III.3](iii-3-treinar-redes-profundas.md) narra, com gradientes que somem, gradientes que explodem e redes profundas que não treinavam, são o preço dessa distinção.

**O nome.** "Teorema da aproximação universal" é rótulo posterior, e convém ser exato sobre em que sentido. A palavra "universal" está num título da época: *"Multilayer feedforward networks are universal approximators"*, de Hornik, Stinchcombe e White (*Neural Networks* 2:359–366, 1989). O que veio depois foi a promoção a **teorema com nome próprio**. Os artigos enunciam o resultado com hipóteses explícitas, e quase ninguém as recita junto com o nome.

E há um detalhe atribuído a Hornik que o rótulo popular apaga: o poder de aproximação não viria da função de ativação escolhida, e sim da **estrutura em camadas**. Trocar sigmoide por outra não-linearidade razoável não mudaria o que a rede pode representar. Mudaria o quanto ela treina bem, que é assunto do livro inteiro.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Cybenko, *Approximation by superpositions of a sigmoidal function*, **Math. Control Signals Systems (1989)**; Hornik, *Approximation capabilities of multilayer feedforward networks*, **Neural Networks 4:251–257 (1991)**. **Os artigos não foram lidos por inteiro** |
| ✓ᵐ | **Hornik, Stinchcombe & White**, *"Multilayer feedforward networks are universal approximators"*, *Neural Networks* 2:359–366, 1989, [10.1016/0893-6080(89)90020-8](https://doi.org/10.1016/0893-6080(89)90020-8) — ficha conferida |
| ❌ | **Correção de 2026-08-13.** Esta linha dizia que a expressão "aproximação universal" não consta do título de nenhum dos artigos. Era verdade sobre os **dois** que o capítulo citava, e criava impressão falsa: *"universal approximators"* está no título do artigo de 1989 acima, do mesmo Hornik. O que é rótulo posterior é a promoção a **teorema com nome próprio**, e o capítulo passou a dizer isso |
| ✓ᵐ | Rumelhart, Hinton & Williams (1986) — [doi:10.1038/323533a0](https://doi.org/10.1038/323533a0), conferido no [capítulo III.1](iii-1-neuronio-artificial.md) |
| ⏳ | Que a prática anterior era camada única com a regra do perceptron, ou pesos escondidos postos à mão |
| ⏳ | A leitura de Hornik de que a fonte do poder de aproximação é a estrutura em camadas, e não a ativação. A frase que costuma ser citada para isso vem do resumo de 1989, e **não consegui abrir o texto** para conferi-la; por isso ela não aparece entre aspas no capítulo |
| 📖 | Que 1986 entrega o **procedimento**, não a arquitetura — e que a licença teórica chegou **depois** da engenharia |
| 📖 | "Existência não é treinabilidade" como a ideia exportável, e os vinte anos do [capítulo III.3](iii-3-treinar-redes-profundas.md) como o preço dela |

## Duas retas: o que a camada escondida faz com o espaço

Volte ao laboratório do [capítulo III.1](iii-1-neuronio-artificial.md) e olhe as retas que você **conseguiu** traçar. O OU funciona. O NÃO-E funciona. O XOR, não.

Agora repare: o XOR é exatamente `(x₁ OU x₂) E (x₁ NÃO-E x₂)` — "pelo menos um, mas não os dois". Duas fronteiras que você já sabe traçar, combinadas por uma terceira que você também já sabe traçar.

É isso que a camada escondida faz. Com o mesmo neurônio de limiar do capítulo III.1:

| Unidade | Pesos | Limiar | O que computa |
|---|---|---|---|
| escondida `h₁` | `w₁ = 1`, `w₂ = 1` | `θ = 1` | OU |
| escondida `h₂` | `w₁ = -1`, `w₂ = -1` | `θ = -1` | NÃO-E |
| saída `y` | `w₁ = 1`, `w₂ = 1` | `θ = 2` | E |

Confira nas quatro linhas: (0,0) → h=(0,1) → soma 1, não dispara. (0,1) → h=(1,1) → soma 2, dispara. (1,0) → idem, dispara. (1,1) → h=(1,0) → soma 1, não dispara. **4 de 4.** O que era impossível em um plano ficou trivial em dois passos, porque a camada escondida **reescreveu as entradas** — `h₁` e `h₂` são coordenadas novas, e nelas o problema virou linearmente separável.

<img src="assets/camada-escondida.svg" alt="Duas vistas do mesmo problema XOR, uma acima da outra. Em cima, o espaço das entradas x₁ e x₂: os quatro casos ocupam os cantos de um quadrado, e os dois que devem disparar estão em cantos opostos, de modo que nenhuma reta os separa dos outros dois. Embaixo, o espaço da camada escondida h₁ e h₂, com cada ponto rotulado pela entrada de onde veio: as entradas (0,1) e (1,0) chegam ambas à mesma posição, de modo que quatro casos ocupam apenas três lugares. Nesse espaço uma única reta separa o que dispara do que não dispara." width="444">

A figura é a frase acima, desenhada. Em cima, o problema que o [capítulo III.1](iii-1-neuronio-artificial.md) provou impossível: quatro pontos, e nenhuma reta que separe os verdes dos brancos. Embaixo, os **mesmos quatro casos** depois de passarem pelas duas unidades escondidas, cada ponto rotulado pela entrada de onde veio. Agora uma reta basta.

Repare no rótulo do ponto verde de baixo, porque ele é o mecanismo. Os dois casos que devem disparar, $(0,1)$ e $(1,0)$, **caem exatamente no mesmo ponto**. A camada escondida não entortou a fronteira: ela juntou o que precisava se comportar igual, e o que sobrou foi separável por uma reta. Quatro entradas viraram três posições, e é essa perda de informação, deliberada e seletiva, que resolve o problema.

A tabela acima traz os pesos **prontos**, escolhidos à mão para você conferir a aritmética. A pergunta que ela deixa em aberto é outra: a rede consegue **achar** esses pesos sozinha?

:::lab {"id":"redes-neurais-l1","tipo":"anima-mlp-xor","titulo":"O XOR resolvido, e as duas retas girando","semente":6}
É o mesmo XOR em que o perceptron do [capítulo III.1](iii-1-neuronio-artificial.md) oscilava sem fim. Aqui a rede é 2 → 2 → 1, com `tanh` na camada escondida, e ninguém escolheu peso nenhum: ela parte de valores aleatórios e desce o gradiente.

As **duas retas** são as fronteiras que as duas unidades escondidas estão aprendendo, e são o conteúdo da animação, não enfeite. Repare que a solução nunca vira uma fronteira curva: são duas retas, e quem as combina é a camada de saída — exatamente o `(OU) E (NÃO-E)` da tabela, encontrado sozinho.

Ponto com contorno é ponto que a rede ainda erra. Assista até a contagem fechar, na época 142.

Depois use os dois outros botões, nesta ordem.

**"E sem a camada escondida?"** deixa tudo igual e tira só a camada do meio. Mesma descida, mesma perda, mesmo tempo, e ela empaca em 24 de 48, que é o acaso. O que resolveu o XOR não foi o gradiente: foi a camada.

**"E se a inicialização for infeliz?"** mantém a camada e muda apenas de onde os pesos partem. A rede empaca em 24 de 48 com a perda parada em 0,348, e não sai mais dali. Não há erro nenhum: o método está correto, a implementação está correta, e a descida caiu num **mínimo local**. Varrendo 60 inicializações sobre este mesmo conjunto, 44 resolvem e 16 não.

Esse botão existe porque o problema apareceu de verdade ao construir esta animação — a primeira semente escolhida era uma das 16. É o modo de falha "inicialização ruim" do objetivo **O4**, e vê-lo aqui torna o resto do capítulo menos abstrato.
:::

**A arquitetura.** Um **perceptron multicamadas** (*multilayer perceptron*, MLP) é isso, generalizado: uma camada de entrada (os atributos), uma ou mais camadas escondidas e uma camada de saída. Cada camada faz duas coisas, sempre nesta ordem: uma transformação linear (`Wx + b`) e uma não-linearidade aplicada elemento a elemento. A rede inteira é a composição dessas duas peças, repetida.

**Contar os parâmetros.** Uma camada que recebe $e$ entradas e produz $s$ saídas tem uma matriz $W$ de $e \times s$ pesos, mais **um viés por unidade de destino** — $s$ deles. Total: $e \times s + s$.

Numa rede 3 → 4 → 2, portanto: a primeira camada tem $3 \times 4 + 4 = 16$; a segunda, $4 \times 2 + 2 = 10$; a rede tem **26** parâmetros treináveis. Guarde a regra: você vai repetir essa conta mais adiante, em outra arquitetura, e é ela que decide se há dado suficiente para treinar.

Tire a não-linearidade e a profundidade some junto. **Duas camadas lineares empilhadas, sem ativação no meio, são uma camada linear**: o produto de duas matrizes é uma matriz. Você paga por profundidade e recebe uma regressão.

O caso extremo dessa família já é seu conhecido: uma camada, uma unidade, ativação sigmoide, e você tem a **regressão logística** do [capítulo II.3](ii-3-regressao-logistica.md). Um neurônio só.

:::exercicio {"id":"redes-neurais-e5","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
O que a camada escondida faz para tornar o XOR resolvível?

- [ ] Traça uma fronteira curva, que a reta de um neurônio não consegue.
- [x] Reescreve as entradas em coordenadas novas, e nelas o problema vira linearmente separável.
- [ ] Aumenta o número de pesos, o que dá capacidade suficiente para decorar os quatro pontos.
- [ ] Aplica o XOR diretamente, porque a função já está embutida na arquitetura.

> **gabarito:** reescreve as entradas em coordenadas novas
> **porque:** As unidades escondidas `h₁` e `h₂` computam OU e NÃO-E, e passam a ser as **coordenadas** que a camada de saída enxerga. Nesse novo plano os quatro casos ficam separáveis por uma reta, e a saída só precisa computar E.
>
> A primeira alternativa é a intuição mais comum e é falsa, e a animação acima existe para desmenti-la: nunca aparece uma curva. Aparecem duas retas, e a combinação delas é que recorta o quadrado.
>
> A terceira confunde capacidade com representação. Não é o número de pesos que resolve, é o fato de existir uma etapa intermediária que muda o sistema de coordenadas — uma camada linear a mais, sem não-linearidade, teria mais pesos e continuaria sem resolver.
> **volte para:** #duas-retas-o-que-a-camada-escondida-faz-com-o-espaco
:::

:::exercicio {"id":"redes-neurais-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Uma rede tem duas camadas densas empilhadas, **sem nenhuma função de ativação entre elas**. O que essa rede consegue computar?

- [ ] Qualquer função contínua, pelo teorema da aproximação universal — basta ter unidades suficientes.
- [x] Exatamente o mesmo conjunto de funções que uma única camada linear.
- [ ] O XOR, porque já são duas camadas e duas fronteiras.
- [ ] O dobro de fronteiras de decisão de uma camada só, mas todas paralelas entre si.

> **gabarito:** Exatamente o mesmo que uma única camada linear
> **porque:** Aplicar `W₂(W₁x + b₁) + b₂` é aplicar `(W₂W₁)x + (W₂b₁ + b₂)`. O produto de duas matrizes é uma matriz: a composição colapsa. Você pagou o dobro de parâmetros e de tempo de treino para obter um modelo linear.
>
> As erradas todas confundem **profundidade** com **poder de representação**. O teorema exige a não-linearidade — é ela que impede o colapso; sem ativação, o teorema simplesmente não se aplica. O XOR continua impossível pelo mesmo motivo do [capítulo III.1](iii-1-neuronio-artificial.md): a função computada ainda é uma reta, e reta nenhuma separa cantos opostos. E "fronteiras paralelas" é uma imagem sedutora e falsa — não há duas fronteiras, há uma.
>
> A moral prática: **a não-linearidade é o que torna a camada uma camada.** Empilhar transformações lineares não constrói hierarquia nenhuma.
> **volte para:** #duas-retas-o-que-a-camada-escondida-faz-com-o-espaco
:::

:::exercicio {"id":"redes-neurais-e6","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Segundo o capítulo, qual modelo já conhecido é o caso extremo de um MLP?

- [ ] A árvore de decisão, que também compõe fronteiras simples.
- [x] A regressão logística: uma camada, uma unidade, ativação sigmoide.
- [ ] O k-NN, que também usa a vizinhança dos pontos.
- [ ] O gradient boosting, que também soma correções em sequência.

> **gabarito:** a regressão logística
> **porque:** Uma camada, uma unidade, ativação sigmoide, e você tem exatamente o modelo do [capítulo II.3](ii-3-regressao-logistica.md). Um neurônio só.
>
> A leitura que isso permite é a que interessa: a rede não é uma família estranha e nova, é a generalização de algo que o livro já construiu. E ela explica de novo por que a logística não resolve o XOR — sendo um neurônio, ela traça uma reta.
>
> A alternativa do boosting é a mais interessante das erradas porque acerta uma semelhança real: ele também acumula correções. Só que ele soma **modelos** treinados em sequência sobre o resíduo, e a rede compõe **transformações** treinadas em conjunto. Somar e compor são operações diferentes.
> **volte para:** #duas-retas-o-que-a-camada-escondida-faz-com-o-espaco
:::

## Achar os pesos: a culpa atravessa a camada

Agora o problema de 1969. Os pesos que fizeram o XOR fechar foram postos à mão, um a um. Como descobri-los a partir de dados?

**Primeiro, o degrau tem de sair.** A função-degrau do neurônio de McCulloch–Pitts é plana em toda parte e salta num ponto: sua derivada é zero onde existe e não existe onde importa. **Sem derivada não há gradiente, e sem gradiente não há direção para onde mover o peso.** Por isso as ativações usadas em rede treinável são contínuas: sigmoide, tangente hiperbólica, ReLU. Sem elas, a otimização do [capítulo II.4](ii-4-otimizacao.md) não tem o que ler.

**O passo para frente.** A entrada atravessa a rede camada a camada, e cada camada guarda o que calculou. No fim sai uma previsão, e a função de perda transforma previsão e rótulo num único número: o erro.

**O passo para trás.** O erro da saída depende dos pesos da última camada, o que é fácil de derivar. Mas ele também depende dos pesos da camada anterior, *através* da última camada. É a **regra da cadeia**: a influência de um peso lá atrás sobre o erro lá na frente é o produto das influências ao longo do caminho.

Fazer isso ingenuamente seria absurdo: recalcular o caminho inteiro para cada peso, com milhões de pesos, é trabalho repetido em escala industrial. **O que torna o backpropagation viável é o reaproveitamento.** Calcula-se o erro na saída, propaga-se para trás **uma vez**, e a quantidade que chega a cada camada é reusada por todos os pesos daquela camada. O custo do passo para trás fica da mesma ordem do passo para frente, e é aí que está a descoberta prática.

Backpropagation não é um algoritmo de otimização. Ele calcula o gradiente. Quem move os pesos é o gradiente descendente do [capítulo II.4](ii-4-otimizacao.md): a mesma otimização, os mesmos passos, a mesma regularização, só que numa superfície muito maior e cheia de vales.

### Um passo inteiro, com números

Tudo acima é verdade e nenhum peso se mexeu ainda. Aqui um passo inteiro, com a menor rede que ainda precisa da regra da cadeia: duas entradas, **duas** unidades escondidas, uma saída, sigmoide nas duas camadas. Com uma unidade só não haveria o que retropropagar.

Os pesos iniciais são postos à mão, como no [capítulo III.1](iii-1-neuronio-artificial.md). A diferença é que agora eles vão mudar sozinhos.

| para | peso de $x_1$ | peso de $x_2$ | viés |
|---|---|---|---|
| $h_1$ | 0,5 | −0,4 | 0,1 |
| $h_2$ | 0,3 | 0,8 | −0,2 |
| saída | $v_1 = 0{,}6$ | $v_2 = -0{,}7$ | $c = 0{,}2$ |

Um caso do XOR: $x = (1,\, 0)$, alvo $y = 1$, taxa $\eta = 0{,}5$. A perda é o EQM com $n = 1$, ou seja $E = (\hat{y} - y)^2$, que é a convenção fixada no [capítulo II.2](ii-2-modelos-lineares.md) para o livro inteiro.

**O passo para frente.**

$$z_1 = 0{,}5 \cdot 1 - 0{,}4 \cdot 0 + 0{,}1 = 0{,}6 \quad\Rightarrow\quad h_1 = \sigma(0{,}6) = 0{,}6457$$
$$z_2 = 0{,}3 \cdot 1 + 0{,}8 \cdot 0 - 0{,}2 = 0{,}1 \quad\Rightarrow\quad h_2 = \sigma(0{,}1) = 0{,}5250$$
$$u = 0{,}6 \cdot 0{,}6457 - 0{,}7 \cdot 0{,}5250 + 0{,}2 = 0{,}2199 \quad\Rightarrow\quad \hat{y} = \sigma(u) = 0{,}5548$$
$$E = (0{,}5548 - 1)^2 = 0{,}1982$$

**O passo para trás.** A derivada da sigmoide se escreve na própria ativação, $\sigma' = a(1-a)$, e é isso que torna a conta viável à mão. Chamo de $\delta_y$ a quantidade que chega à saída, e de $\delta_1$ e $\delta_2$ as que chegam a cada unidade escondida. É a notação usual, e o índice diz a quem o delta pertence.

$$\frac{\partial E}{\partial \hat{y}} = 2(\hat{y} - y) = -0{,}8905$$
$$\delta_y = \frac{\partial E}{\partial \hat{y}} \cdot \hat{y}(1-\hat{y}) = -0{,}8905 \cdot 0{,}2470 = -0{,}2200$$

Esse $-0{,}2200$ é o reaproveitamento de que a seção anterior fala, e ele é calculado **uma vez**. Os três gradientes da última camada saem dele por uma multiplicação cada:

$$\frac{\partial E}{\partial v_1} = \delta_y \cdot h_1 = -0{,}1420 \qquad \frac{\partial E}{\partial v_2} = \delta_y \cdot h_2 = -0{,}1155 \qquad \frac{\partial E}{\partial c} = \delta_y = -0{,}2200$$

E o mesmo número atravessa para a camada de baixo, cada unidade pesada pelo caminho que a liga à saída:

$$\delta_1 = \delta_y \cdot v_1 \cdot h_1(1-h_1) = -0{,}2200 \cdot 0{,}6 \cdot 0{,}2288 = -0{,}0302$$
$$\delta_2 = \delta_y \cdot v_2 \cdot h_2(1-h_2) = -0{,}2200 \cdot (-0{,}7) \cdot 0{,}2494 = +0{,}0384$$

Repare no sinal trocado de $\delta_2$. A segunda unidade entra na saída com peso negativo, então empurrá-la para cima piora o resultado. Ninguém programou isso: a rede descobre pelo sinal, e o sinal é a única coisa que a informa.

**A atualização**, com $\eta = 0{,}5$:

| peso | antes | gradiente | depois |
|---|---|---|---|
| $w_{11}$ | 0,5 | −0,0302 | **0,5151** |
| $w_{21}$ | −0,4 | **0** | −0,4 |
| $b_1$ | 0,1 | −0,0302 | **0,1151** |
| $w_{12}$ | 0,3 | +0,0384 | **0,2808** |
| $w_{22}$ | 0,8 | **0** | 0,8 |
| $b_2$ | −0,2 | +0,0384 | **−0,2192** |
| $v_1$ | 0,6 | −0,1420 | **0,6710** |
| $v_2$ | −0,7 | −0,1155 | **−0,6423** |
| $c$ | 0,2 | −0,2200 | **0,3100** |

Perda de 0,1982 para 0,1578, previsão de 0,5548 para 0,6027. Um passo, e a rede andou na direção certa.

Há uma lição escondida nas duas linhas cujo gradiente deu zero. Os pesos $w_{21}$ e $w_{22}$ **não se mexeram**, porque $x_2 = 0$ neste exemplo. Peso multiplicado por entrada nula não recebe gradiente, e isso não é defeito: é a regra da cadeia informando que aquele peso não participou do erro. É a mesma atribuição de culpa do perceptron, no [capítulo III.1](iii-1-neuronio-artificial.md), agora atravessando duas camadas. E é a raiz do problema da ReLU morta, que o [capítulo III.3](iii-3-treinar-redes-profundas.md) trata: unidade que nunca ativa nunca aprende, porque nunca recebe gradiente.

### E quando há mais de duas classes

O exemplo acima tinha uma saída só. Com mais de duas classes, a última camada produz um número por classe, e o **softmax** os converte em probabilidades que somam 1: exponencia cada um e divide pela soma. A perda passa a ser a **entropia cruzada**, que pune com força a confiança errada — prever 0,99 na classe errada custa muito mais do que prever 0,5. As duas andam juntas por um motivo: combinadas, o gradiente na saída se reduz a `previsão − rótulo`, que é simples de derivar e estável de calcular.

:::exercicio {"id":"redes-neurais-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Por que a função-degrau precisou sair para que a rede pudesse ser treinada?

- [x] Ela é plana em toda parte e salta num ponto: a derivada é zero onde existe e não existe onde importa.
- [ ] Ela é lenta de calcular em comparação com a sigmoide.
- [ ] Ela só aceita entradas binárias, e redes usam entradas contínuas.
- [ ] Ela não permite mais de duas classes na saída.

> **gabarito:** derivada zero onde existe, inexistente onde importa
> **porque:** Sem derivada não há gradiente, e sem gradiente não há direção para onde mover o peso. É por isso que ativações de rede treinável são contínuas: sigmoide, tanh, ReLU.
>
> Vale marcar que a troca **não** é preferência estética nem questão de desempenho. É a condição para que a otimização do [capítulo II.4](ii-4-otimizacao.md) tenha o que ler.
>
> E vale lembrar o limite disso, que o [capítulo III.1](iii-1-neuronio-artificial.md) já estabeleceu: trocar o degrau pela sigmoide é necessário para treinar e não resolve a geometria. Quem resolve o XOR é a camada, não a ativação.
> **volte para:** #achar-os-pesos-a-culpa-atravessa-a-camada
:::

:::exercicio {"id":"redes-neurais-e13","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Na rede do exemplo acima, a saída deu $\hat{y} = 0{,}5548$ para um alvo $y = 1$, com a perda $E = (\hat{y}-y)^2$.

Calcule $\delta_y = \frac{\partial E}{\partial \hat{y}} \cdot \sigma'(u)$, lembrando que $\sigma'(u) = \hat{y}(1-\hat{y})$.

> **gabarito:** -0.22 ± 0.005
> **porque:** São duas contas. A derivada da perda: $\frac{\partial E}{\partial \hat{y}} = 2(\hat{y}-y) = 2(0{,}5548 - 1) = -0{,}8905$. A derivada da sigmoide, escrita na própria ativação: $\hat{y}(1-\hat{y}) = 0{,}5548 \times 0{,}4452 = 0{,}2470$. O produto dá $-0{,}2200$.
>
> O sinal negativo diz a direção: a saída está **abaixo** do alvo, e o gradiente descendente vai somar aos pesos que a empurram para cima. Se você chegou a $+0{,}22$, provavelmente calculou $\hat{y} - y$ ao contrário, o que inverteria o treino inteiro e faria a perda subir.
>
> Se você chegou a $-0{,}11$, usou a convenção $E = \frac{1}{2}(\hat{y}-y)^2$, que cancela o 2 e é comum na literatura. Não está errada, mas **não é a deste livro**: o capítulo II.2 fixou o EQM sem a constante, e misturar as duas faz o aluno anotar um número que o capítulo não define.
>
> **volte para:** #um-passo-inteiro-com-numeros

:::

:::exercicio {"id":"redes-neurais-e14","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Na tabela de atualização, os pesos $w_{21}$ e $w_{22}$ ficaram exatamente onde estavam, com gradiente zero. Por quê?

- [ ] Porque já estavam nos valores ótimos, e o gradiente detecta isso.
- [x] Porque a entrada $x_2$ vale 0 neste exemplo, e o gradiente de um peso é proporcional à entrada que ele multiplica.
- [ ] Porque a taxa de aprendizado 0,5 é pequena demais para movê-los.
- [ ] Porque eles pertencem à camada escondida, que só é atualizada na segunda época.

> **porque:** O gradiente de um peso da primeira camada é $\delta_j \cdot x_i$. Com $x_2 = 0$, o produto é zero para qualquer $\delta$. A regra da cadeia está dizendo que aquele peso não participou da soma que gerou o erro, e portanto não tem culpa a pagar.
>
> É a mesma coisa que o perceptron faz no [capítulo III.1](iii-1-neuronio-artificial.md) com $\Delta w_i = \eta \cdot e \cdot x_i$, e é reconfortante que apareça igual: a atribuição de culpa não mudou ao ganhar uma camada, só ficou mais longa.
>
> A primeira alternativa inverte a inferência. Gradiente zero por entrada nula não diz nada sobre o valor do peso; com outro exemplo, em que $x_2 = 1$, o mesmo peso recebe gradiente e se move.
>
> A quarta descreve um algoritmo que não existe. Todas as camadas são atualizadas no mesmo passo, e é justamente esse o ponto do backpropagation: uma passada para trás basta.
>
> **volte para:** #um-passo-inteiro-com-numeros

:::

## Um passo não é treinar: o planalto

A rede andou na direção certa naquele passo, e um passo ainda não é treino. Aqui está ela sobre os quatro pontos do XOR, em lote cheio:

| época | EQM | `00` | `01` | `10` | `11` | acertos |
|---|---|---|---|---|---|---|
| 0 | 0,2520 | 0,55 | 0,50 | 0,55 | 0,51 | 2/4 |
| 100 | 0,2507 | 0,52 | 0,48 | 0,52 | 0,48 | 2/4 |
| 500 | 0,2502 | 0,51 | 0,48 | 0,52 | 0,49 | 2/4 |
| 1 000 | 0,2500 | 0,51 | 0,49 | 0,51 | 0,49 | 2/4 |
| 2 000 | 0,2499 | 0,51 | 0,49 | 0,51 | 0,49 | 2/4 |
| 4 000 | 0,1865 | 0,42 | 0,39 | 0,75 | 0,36 | 3/4 |
| 8 000 | **0,0017** | 0,04 | 0,95 | 0,96 | 0,04 | **4/4** |
| 15 000 | 0,0005 | 0,02 | 0,97 | 0,98 | 0,02 | 4/4 |

O que essa tabela ensina não é que a rede aprende, e sim o **planalto**. Por duas mil épocas o erro fica parado em 0,25 e as quatro saídas ficam em torno de 0,5, o que é a rede respondendo "sei lá" para tudo. Ela parece morta e não está. A quebra vem entre 2 000 e 4 000, e depois a perda cai três ordens de grandeza em poucos milhares de épocas.

Quem desiste na época 1 000 conclui que o método não funciona, e conclui isso com uma tabela na mão. Distinguir **empacar por planalto** de **empacar por mínimo local** exige rodar mais, e é a diferença entre os dois que a seção de diagnóstico deste capítulo trata.

:::exercicio {"id":"redes-neurais-e15","tipo":"multipla","objetivo":"O4","dificuldade":"dificil"}
Você treina a rede do exemplo no XOR e vê a perda parada em 0,2500 da época 100 à 2 000, com as quatro saídas em torno de 0,5. Qual leitura o próprio capítulo sustenta?

- [ ] O treino divergiu, e é preciso baixar a taxa de aprendizado.
- [ ] A rede caiu num mínimo local, e é preciso reinicializar os pesos.
- [x] Pode ser planalto, e não mínimo: nesta configuração a perda só quebra depois da época 2 000 e chega a 0,0017 na 8 000.
- [ ] A camada escondida é pequena demais, e é preciso mais unidades.

> **porque:** A medição do capítulo é explícita: da época 0 à 2 000 a perda fica em 0,25 e o acerto em 2 de 4, e entre 2 000 e 4 000 ela quebra, chegando a 0,0017 na época 8 000 com 4 de 4. Quem para na época 1 000 conclui que não funciona, e conclui isso com uma tabela verdadeira na mão.
>
> A primeira alternativa confunde os sintomas. Perda que diverge **sobe** sem limite; esta ficou parada, que é coisa diferente.
>
> A segunda é a alternativa boa, e é por isso que ela é a armadilha. Mínimo local existe de verdade nesta rede: o capítulo mede que, variando só a inicialização, a perda empaca em **0,348** e não sai mais. Só que 0,348 não é 0,2500, e a diferença entre os dois números é exatamente o que separa um diagnóstico do outro. Reinicializar aqui jogaria fora um treino que ia dar certo.
>
> A quarta prescreve capacidade sem evidência de que falta capacidade. Duas unidades escondidas bastam para o XOR, e esta mesma rede prova isso ao chegar a 4 de 4 sem ganhar nenhuma unidade nova.
>
> **volte para:** #um-passo-nao-e-treinar-o-planalto

:::

## Contar os parâmetros, e o bug que não grita

A regra de contagem já apareceu: `e × s + s`, com um viés por unidade de **destino**. Vale praticá-la, porque errá-la não costuma derrubar o programa: a rede apenas treina mal, em silêncio.

:::exercicio {"id":"redes-neurais-e2","tipo":"numerica","objetivo":"O3","dificuldade":"facil"}
Um MLP denso tem 4 entradas, uma camada escondida de 5 unidades e 3 saídas. Todas as camadas têm **viés**.

Quantos parâmetros treináveis a rede tem no total?

> **gabarito:** 43
> **porque:** Conte camada por camada. Primeira: uma matriz 4×5 = 20 pesos, mais 5 vieses (um por unidade de destino) = 25. Segunda: 5×3 = 15 pesos, mais 3 vieses = 18. Total **43**.
>
> A regra que vale levar: **os pesos de uma camada formam uma matriz `entradas × saídas`, e há um viés por unidade de destino** — nunca por unidade de origem. Errar isso é o bug mais comum de quem implementa a rede em NumPy pela primeira vez, e ele não aparece como erro de matemática: aparece como uma exceção de dimensão incompatível no passo para frente, ou pior, como uma soma que "funciona" por *broadcasting* e treina errado.
>
> Repare também na escala: 43 parâmetros para uma rede minúscula. Acrescente uma camada escondida de 100 unidades e você passa de mil. É por isso que o custo do passo para trás importa tanto.
> **volte para:** #achar-os-pesos-a-culpa-atravessa-a-camada
:::

:::exercicio {"id":"redes-neurais-e9","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Uma rede densa tem 10 entradas, duas camadas escondidas de 8 unidades cada, e 1 saída. Todas as camadas têm viés.

Quantos parâmetros treináveis ela tem?

> **gabarito:** 161
> **porque:** Camada a camada, com a regra `e × s + s`. Primeira: $10 \times 8 + 8 = 88$. Segunda: $8 \times 8 + 8 = 72$. Saída: $8 \times 1 + 1 = 9$. Total $88 + 72 + 9 = \mathbf{161}$.
>
> Repare onde o custo se concentra: a primeira camada sozinha responde por mais da metade, porque é ela que recebe o vetor de entrada inteiro, e o número de pesos de uma camada cresce com a largura do que entra. É a mesma conta que, com imagens, torna uma camada densa impraticável e motiva a convolução do [capítulo III.4](iii-4-visao.md).
>
> O erro clássico continua sendo o viés: um por unidade de **destino**, nunca por unidade de origem.
> **volte para:** #achar-os-pesos-a-culpa-atravessa-a-camada
:::

:::exercicio {"id":"redes-neurais-e10","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
Ao implementar a rede em NumPy, a soma do viés "funciona" por *broadcasting* mesmo com o vetor de tamanho errado, e a rede treina mal sem lançar exceção. O que esse caso ilustra?

- [ ] Que NumPy tem um defeito de projeto no *broadcasting*.
- [x] Que ausência de exceção não é evidência de correção, e um bug de forma pode virar bug de aprendizado silencioso.
- [ ] Que a rede precisa de mais épocas para compensar o viés errado.
- [ ] Que vieses deveriam ser sempre inicializados com zero para evitar o problema.

> **gabarito:** ausência de exceção não é evidência de correção
> **porque:** O *broadcasting* faz exatamente o que promete: alinha dimensões compatíveis. O problema é que "compatível" e "correto" são coisas diferentes, e um vetor de tamanho errado pode ser compatível por acidente.
>
> O sintoma é o pior possível: nada quebra, a perda desce um pouco, e o modelo aprende menos do que deveria. É a mesma família do "não deu NaN" do [capítulo II.4](ii-4-otimizacao.md) — ausência de sintoma não é diagnóstico.
>
> O gesto que protege é conferir formas explicitamente, e o teste barato do capítulo: se a rede não consegue decorar 50 exemplos, há defeito no caminho do gradiente, e não falta de capacidade.
> **volte para:** #achar-os-pesos-a-culpa-atravessa-a-camada
:::

:::exercicio {"id":"redes-neurais-e8","tipo":"multipla-multi","objetivo":"O2","dificuldade":"media"}
Quais afirmações sobre backpropagation são corretas? (marque todas que valem)

- [x] Ele calcula o gradiente, e quem move os pesos é o gradiente descendente.
- [x] O que o torna viável é o reaproveitamento: propaga-se para trás uma vez, e cada camada reusa o que chegou.
- [x] O custo do passo para trás fica da mesma ordem do passo para frente.
- [ ] Ele é um algoritmo de otimização alternativo ao gradiente descendente.

> **gabarito:** calcula o gradiente · reaproveitamento · custo da mesma ordem
> **porque:** As três corretas separam duas coisas que o vocabulário mistura. Backpropagation é **cálculo de derivada**; otimização é o que se faz com ela. Trocar o otimizador não muda o backpropagation, e vice-versa.
>
> O reaproveitamento é a descoberta prática, e não a regra da cadeia em si. Aplicá-la peso a peso seria recalcular o caminho inteiro milhões de vezes; propagar uma vez e reusar por camada é o que traz o custo para a mesma ordem da ida.
>
> A alternativa errada é a confusão mais comum, e ela tem consequência: quem acredita nela procura "trocar o backpropagation" quando o treino não anda, em vez de olhar taxa, inicialização e escala dos dados.
> **volte para:** #achar-os-pesos-a-culpa-atravessa-a-camada
:::

## Quantas camadas e quantas unidades — a decisão é empírica

O teorema diz que uma camada escondida basta. Não diz **quantas unidades** — e "unidades suficientes" pode significar um número absurdo. Redes mais profundas costumam resolver com menos unidades por camada o que uma camada rasa só resolveria com muitas. Isso é observação empírica, não consequência do teorema.

Comece pequeno, aumente até a rede conseguir *overfitar* um subconjunto pequeno dos dados — se ela não consegue decorar 50 exemplos, o problema é capacidade ou bug, não regularização. Depois regularize para trazer a generalização de volta, com as ferramentas do [capítulo II.4](ii-4-otimizacao.md). O número de camadas e de unidades é hiperparâmetro, e hiperparâmetro se escolhe com dados de validação.

:::lab {"id":"redes-neurais-l2","tipo":"iframe","titulo":"O Playground: uma manopla por pergunta","src":"assets/playground/playground.html","altura":800}
Este é o **TensorFlow Playground**, servido daqui mesmo — ele funciona com a sua rede fora do ar, e não manda nada para lugar nenhum. É código de terceiro sob Apache 2.0, e não um produto oficial do Google; a procedência está em [`publicar/tema/playground/LEIA-ME.md`](https://github.com/GHDaru/machinelearning/blob/main/publicar/tema/playground/LEIA-ME.md).

**Ele tem oito controles, e é aí que mora o perigo.** Mexer em três coisas ao mesmo tempo, ver a perda cair e não saber qual delas causou é o oposto de aprender. Então a regra deste laboratório é uma só: **uma manopla por pergunta, e você escreve a previsão antes de mexer.**

A interface está em inglês. A tradução dos rótulos:

| Na tela | Em português |
|---|---|
| Learning rate | taxa de aprendizado |
| Activation | função de ativação |
| Regularization / rate | regularização e a força dela |
| Features | atributos de entrada |
| Hidden layers | camadas escondidas |
| Training / Test loss | perda de treino e de teste |
| Noise | ruído nos dados |
| Ratio of training to test data | proporção treino/teste |

### As cinco perguntas

1. **Dados em círculo, zero camadas escondidas, só `x₁` e `x₂`.** Preveja a perda antes de rodar. Depois acrescente `x₁²` e `x₂²` como entrada. Pergunta: por que a camada escondida dispensa esse gesto manual?
2. **Espiral: 1 camada de 8 unidades contra 2 camadas de 4.** A contagem de parâmetros é parecida. Preveja qual treina melhor. Erra-se aqui com frequência.
3. **Espiral, 4 camadas, ativação `Linear` em todas.** Desenhe num papel a fronteira que você espera, e só então rode. É o exercício `e1` deste capítulo, em movimento.
4. **A mesma configuração, reinicializada cinco vezes.** Quantas resolvem? Compare com as 44 de 60 que a animação do XOR mediu, logo acima.
5. **Troque `tanh` por `ReLU`.** Pergunta final, e é a que separa quem leu o teorema de Hornik de quem decorou o nome dele: mudou o que a rede **pode representar**, ou só o quanto ela **consegue treinar**?
:::


## O teorema não decide por você

Aqui a tese do capítulo cobra o preço: existência não é treinabilidade. O teorema garante que **existe** uma configuração de pesos que resolve seu problema. Ele não garante que o seu treino vá encontrá-la — a inicialização pode ser ruim, o gradiente pode sumir antes de chegar às primeiras camadas, os dados podem ser insuficientes para distinguir aquela solução de mil outras. É por isso que empilhar mais camadas **não funcionou por quase vinte anos** depois de 1986, apesar de o teorema já estar publicado desde 1989. O [capítulo III.3](iii-3-treinar-redes-profundas.md) conta o que foi preciso para destravar.

:::exercicio {"id":"redes-neurais-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"dificil"}
Um colega justifica a escolha da arquitetura assim: *"pelo teorema da aproximação universal, uma camada escondida basta — então se o modelo não está aprendendo, é porque faltam unidades."*

Explique por que o teorema **não** sustenta essa conclusão, e liste o que mais pode estar impedindo o treino.

> **rubrica:** distingue **representabilidade** (a função está no espaço de hipóteses) de **treinabilidade** (o procedimento de busca chega até ela);
> aponta que o teorema é **não construtivo** — não diz quantas unidades, nem como achar os pesos;
> cita ao menos dois impedimentos que não são capacidade: inicialização ruim, gradiente que some ou explode, otimização presa, dados insuficientes ou mal escalados, perda ou taxa de aprendizado inadequadas;
> reconhece que "faltam unidades" é uma hipótese testável — e diz como testá-la (tentar overfitar um subconjunto pequeno);
> não afirma que o teorema está errado, apenas que ele responde a outra pergunta
> **porque:** O teorema é uma afirmação sobre o **conjunto de funções representáveis** por uma arquitetura. A frase do colega é uma afirmação sobre o **procedimento de busca**. São perguntas diferentes, e a segunda é a que atrapalha na prática.
>
> "Não construtivo" é o termo exato: garante-se que o objeto existe sem dar receita para construí-lo. O teorema não dá o número de unidades — e o número que serve pode ser proibitivo. Não dá os pesos. Não promete que o gradiente descendente, saindo da inicialização que você usou, chegue lá.
>
> Uma boa resposta enumera as suspeitas alternativas antes de mexer no tamanho: inicialização (pesos todos iguais quebram a simetria e todas as unidades aprendem a mesma coisa), gradiente que some ou explode ao atravessar camadas, taxa de aprendizado grande demais ou pequena demais, atributos em escalas muito diferentes, rótulos com ruído. E propõe o teste barato que decide entre capacidade e bug: **tente decorar 50 exemplos**. Se a rede não consegue nem isso, acrescentar unidades não vai salvar — há um defeito no caminho do gradiente.
>
> É esta a distinção que explica os vinte anos entre 1986 e as redes profundas que funcionam ([capítulo III.3](iii-3-treinar-redes-profundas.md)). O espaço de hipóteses sempre continha a solução. O que faltava era como chegar nela.
> **volte para:** #quantas-camadas-e-quantas-unidades-a-decisao-e-empirica
:::

:::exercicio {"id":"redes-neurais-e11","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Na animação deste capítulo, a rede com camada escondida empaca em 24 de 48 quando a inicialização muda, e resolve com a inicialização padrão. O dado, a arquitetura e a taxa são os mesmos. Qual é o diagnóstico?

- [ ] Falta de capacidade: duas unidades escondidas são poucas.
- [x] Inicialização ruim: a descida caiu num mínimo local, e o método está correto.
- [ ] Bug no cálculo do gradiente, que só se manifesta em alguns casos.
- [ ] Taxa de aprendizado alta demais, que fez a perda divergir.

> **gabarito:** inicialização ruim, com mínimo local
> **porque:** O enunciado já elimina três suspeitas: o dado, a arquitetura e a taxa são idênticos nos dois casos, e a mesma configuração resolve quando parte de outro lugar. A única variável que mudou foi de onde a descida começou.
>
> A quarta alternativa é descartável pelo número: a perda empaca em 0,348 e fica parada, e perda que diverge sobe sem limite. Empacar e divergir são sintomas diferentes.
>
> O que torna este caso desconfortável é que **nada está errado**. Método correto, implementação correta, execução correta, resposta errada — e a única diferença é a semente. Varrendo 60 inicializações sobre o mesmo conjunto, 44 resolvem e 16 não.
> **volte para:** #quantas-camadas-e-quantas-unidades-a-decisao-e-empirica
:::

:::exercicio {"id":"redes-neurais-e12","tipo":"multipla-multi","objetivo":"O4","dificuldade":"media"}
Uma rede não aprende. Quais verificações vêm **antes** de aumentar o número de unidades? (marque todas que valem)

- [x] Tentar decorar 50 exemplos: se nem isso a rede consegue, há defeito no caminho do gradiente.
- [x] Conferir a inicialização, porque pesos todos iguais fazem todas as unidades aprenderem a mesma coisa.
- [x] Conferir a escala dos atributos e a taxa de aprendizado.
- [ ] Aumentar as épocas até que a perda de treino chegue a zero, e só então avaliar.

> **gabarito:** overfitar 50 exemplos · inicialização · escala e taxa
> **porque:** As três corretas são baratas e decidem entre capacidade e defeito, que é a pergunta que precede qualquer mudança de arquitetura. O teste dos 50 exemplos é o mais informativo dos três: uma rede saudável **consegue** decorar um punhado de dados, e se não consegue, acrescentar unidades não resolve.
>
> A quebra de simetria merece destaque porque é silenciosa: com pesos idênticos, todas as unidades de uma camada recebem o mesmo gradiente e permanecem idênticas para sempre. A rede tem oito unidades e se comporta como uma.
>
> A alternativa errada troca diagnóstico por insistência. Treinar mais tempo não distingue nenhuma das hipóteses acima, e se houver mínimo local, a perda já parou de descer — o otimizador não está lento, ele chegou.
> **volte para:** #quantas-camadas-e-quantas-unidades-a-decisao-e-empirica
:::

## Síntese — o que levar

- **O XOR do [capítulo III.1](iii-1-neuronio-artificial.md) está resolvido**: uma camada escondida traça duas fronteiras (OU e NÃO-E) e a saída as combina (E). 4 de 4.
- A camada escondida não acrescenta retas: **reescreve as entradas** em coordenadas onde o problema vira linearmente separável.
- **A não-linearidade é o que torna a camada uma camada.** Sem ela, camadas empilhadas colapsam numa só transformação linear.
- Um MLP é composição de `linear → não-linearidade`, repetida. Uma unidade, sigmoide, e você tem a **regressão logística** do [capítulo II.3](ii-3-regressao-logistica.md).
- O **degrau não serve** como ativação treinável: sem derivada não há gradiente.
- **Backpropagation é a regra da cadeia com reaproveitamento.** Propaga-se o erro para trás uma vez, e cada camada reusa o que chegou — é o reaproveitamento que torna o custo viável, não a regra da cadeia em si.
- Backpropagation **calcula** o gradiente; quem move os pesos é a otimização do [capítulo II.4](ii-4-otimizacao.md).
- **Softmax + entropia cruzada** para multiclasse: o gradiente na saída vira `previsão − rótulo`.
- 1986 não entregou a arquitetura — entregou o **procedimento**. A licença teórica (1989, 1991) chegou **depois** da engenharia.
- **A ideia exportável: existência não é treinabilidade.** O teorema é não construtivo — garante que a rede certa está no espaço de hipóteses, sem dizer quantas unidades, como achá-la, ou se o gradiente chega lá.
- Camadas e unidades são **hiperparâmetros**: escolhem-se sob validação, não por teorema.

:::exercicio {"id":"redes-neurais-e4","tipo":"aberta","objetivo":"O2","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Explique backpropagation a alguém que **conhece a regra da cadeia** mas nunca viu uma rede. Diga o que é o passo para frente, o que é o passo para trás e, na parte que decide, **onde exatamente está o reaproveitamento** que torna o custo viável.

> **rubrica:** apresenta backpropagation como aplicação da regra da cadeia a uma composição de funções, e não como um algoritmo à parte que se decora;
> descreve o passo para frente guardando os valores intermediários, e diz **por que** eles precisam ser guardados — são eles que as derivadas do passo para trás consomem;
> localiza o reaproveitamento: o gradiente de uma camada é calculado a partir do gradiente da camada seguinte, de modo que cada derivada parcial é computada **uma vez** e reutilizada por tudo que está atrás dela;
> não deixa a explicação parar em "é a regra da cadeia": sem dizer o que seria o custo **sem** o reaproveitamento, isto é, recalcular o caminho inteiro para cada peso, a explicação não mostrou o que backpropagation acrescenta
> **porque:** O quarto critério existe porque a resposta mais comum é verdadeira e vazia. "É a regra da cadeia aplicada à rede" está certo, e não explica por que isso foi um acontecimento: a regra da cadeia é do século XVII, e as redes ficaram intratáveis por décadas mesmo com ela disponível.
>
> O que backpropagation acrescenta é **ordem de cálculo**. Aplicando a regra da cadeia ingenuamente, ou seja, percorrendo para cada peso o caminho dele até a saída, o mesmo produto é recalculado incontáveis vezes, e o custo cresce com o número de pesos multiplicado pela profundidade. Propagando de trás para frente, o gradiente da camada *k* já traz condensado tudo o que vem depois dela, e o custo do passo para trás fica **da mesma ordem** do passo para frente.
>
> Note o que a boa explicação torna óbvio de graça: **por que a memória cresce com a profundidade**. Guardar os valores intermediários é o preço do reaproveitamento, e é a razão de o tamanho do lote esbarrar na placa de vídeo — um fato de engenharia que cai direto desta derivação.
> **volte para:** #achar-os-pesos-a-culpa-atravessa-a-camada
:::

## Verificação

1. Escreva os pesos e limiares de um MLP que computa o XOR e confira as quatro linhas da tabela-verdade. Depois explique, em uma frase, o que a camada escondida fez com o espaço de entrada.
2. "Uma camada escondida basta para aproximar qualquer função contínua." Diga o que essa frase garante, o que ela não garante, e por que a diferença entre as duas coisas custou quase vinte anos à área.

> Estas duas não são corrigidas, e a omissão é deliberada: a primeira vale mais como construção no papel, conferida por você linha a linha, do que como texto — e a segunda rende mais numa discussão.
