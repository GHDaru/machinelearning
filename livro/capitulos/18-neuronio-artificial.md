# 18 — O Neurônio Artificial

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-08 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (mais experimentos, mais fontes verificadas) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Descrever o neurônio de McCulloch–Pitts e o que ele computa.
- **O2.** Encontrar, à mão, pesos e limiar que implementem uma função lógica dada.
- **O3.** Explicar geometricamente por que um único neurônio não resolve o XOR.
- **O4.** Situar historicamente por que essa limitação parou a área — e o que a destravou.

## O problema: pode uma máquina pensar em lógica?

Em 1943 não havia computador digital comercial, não havia "Machine Learning", e a pergunta que Warren McCulloch — neurofisiologista — e Walter Pitts — um lógico de vinte anos, autodidata, que vivia sem endereço fixo — se fizeram era outra: **a atividade do cérebro pode ser descrita como lógica?**

A resposta deles foi um modelo brutalmente simples de neurônio ([McCulloch & Pitts, 1943](https://doi.org/10.1007/BF02478259), ✓). O neurônio recebe entradas, multiplica cada uma por um **peso**, soma tudo, e dispara — devolve 1 — se a soma alcançar um **limiar**. Senão, devolve 0.

$$\text{saída} = \begin{cases} 1 & \text{se } w_1x_1 + w_2x_2 + \dots \geq \theta \\ 0 & \text{caso contrário} \end{cases}$$

É só isso. Uma soma ponderada e uma comparação.

O que McCulloch e Pitts demonstraram foi que **redes desses elementos podem computar qualquer função lógica proposicional**. O argumento era filosófico antes de ser tecnológico: se o pensamento é lógica, e a lógica é computável por neurônios, então o pensamento é computável. Foi uma das ideias fundadoras da inteligência artificial, da teoria de autômatos e da cibernética — quinze anos antes de existir uma máquina que aprendesse alguma coisa.

> **Repare no que ainda não existe aqui: aprendizado.** No modelo de 1943 os pesos são **postos à mão** por quem projeta a rede. Descobrir os pesos automaticamente é o passo seguinte da história, e é o que o perceptron de Rosenblatt traz em 1958.

## Mão na massa: encontre os pesos você mesmo

Antes de ler qualquer explicação, brinque. Ajuste `w₁`, `w₂` e `θ` até a tabela-verdade fechar.

Comece pelo **E (AND)**: o neurônio deve disparar só quando as duas entradas forem 1.

:::lab {"id":"18-l1","tipo":"neuronio-mp","titulo":"Neurônio de McCulloch–Pitts","funcao":"AND"}
Cada ponto no gráfico é uma linha da tabela-verdade. **Verde** = deveria disparar; **branco/cinza** = não deveria. A reta é `w₁x₁ + w₂x₂ = θ`, e a região sombreada é onde o neurônio dispara.

Sua tarefa: mover a reta até que **todos os pontos verdes fiquem dentro da região sombreada e todos os outros fiquem fora**.

Comece pelo **E (AND)**. Depois tente **OU**, **NÃO-E** e **NÃO-OU** — todos têm solução, e cada um tem *infinitas* soluções. Deixe o **OU-EXCLUSIVO (XOR)** por último.
:::

### O que você deveria ter notado

**Primeiro:** não existe *a* resposta certa. Para o AND, `w₁=1, w₂=1, θ=2` funciona; `w₁=0,6, w₂=0,6, θ=1` também; `w₁=3, w₂=2, θ=4,5` também. Infinitas retas separam aqueles quatro pontos — e essa multiplicidade não é defeito, é a natureza do problema. É a mesma razão pela qual dois modelos treinados com sementes diferentes chegam a coeficientes diferentes e à mesma qualidade.

**Segundo:** você estava fazendo, à mão, exatamente o que o gradiente descendente do [capítulo 06](06-otimizacao.md) faz sozinho — mover a fronteira até que os erros acabem. A diferença é que você olhava a tabela inteira e ajustava por intuição; o algoritmo olha um erro por vez e ajusta por regra fixa.

**Terceiro — e este é o ponto do capítulo:** no XOR você travou em 3 de 4.

## Por que o XOR é impossível

Não é falta de habilidade nem de paciência. É geometria.

O XOR dispara em (0,1) e (1,0), e não dispara em (0,0) e (1,1). Coloque os quatro pontos num quadrado: os que devem disparar estão em **cantos opostos**, e os que não devem também.

Uma reta divide o plano em dois lados. Para resolver o XOR ela precisaria deixar dois cantos opostos de um lado e os outros dois do outro — e **nenhuma reta faz isso**. Não importa quanto você gire ou translade: qualquer reta que separe (0,1) de (0,0) e (1,1) vai deixar (1,0) do lado errado.

O nome técnico é **separabilidade linear**. AND, OR, NAND e NOR são linearmente separáveis; XOR não é. E um neurônio de McCulloch–Pitts — ou um perceptron, ou uma regressão logística — traça **exatamente uma reta**.

> É a mesma limitação que o [capítulo 07](07-arvores-ensembles.md) mediu com outro vocabulário: naquele experimento, o modelo linear ficou em 0,4963 de AUC — acaso — porque a fronteira verdadeira era não-monotônica. Aqui você vê a razão em quatro pontos, em vez de em uma tabela de resultados.

:::exercicio {"id":"18-e1","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Por que um único neurônio de McCulloch–Pitts não consegue implementar o XOR?

- [ ] Porque o XOR exige pesos negativos, e o modelo só admite pesos positivos.
- [x] Porque os casos que devem disparar estão em cantos opostos do quadrado, e nenhuma reta separa cantos opostos.
- [ ] Porque o XOR tem três entradas, e o neurônio só aceita duas.
- [ ] Porque o limiar teria de ser fracionário, o que o modelo original não permitia.

> **gabarito:** Os casos que devem disparar estão em cantos opostos
> **porque:** É geometria, não aritmética. O XOR dispara em (0,1) e (1,0) — cantos opostos do quadrado — e não dispara em (0,0) e (1,1), também opostos entre si. Uma reta divide o plano em dois lados; não existe reta que deixe dois cantos opostos de um lado e os outros dois do outro.
>
> As três alternativas erradas atribuem a limitação a restrições do **modelo** — sinal do peso, número de entradas, limiar fracionário — quando na verdade ela é uma propriedade do **problema**. Nenhuma delas ajudaria: mesmo com pesos reais, negativos e limiar contínuo, a impossibilidade permanece. É por isso que a solução, quando veio, não foi um neurônio melhor: foi **outra camada** de neurônios.
> **volte para:** #por-que-o-xor-e-impossivel
:::

## A história: entusiasmo, inverno e a saída

**1943 — McCulloch & Pitts.** O neurônio lógico. Sem aprendizado: os pesos são projetados.

**1949 — Hebb.** "Neurônios que disparam juntos, conectam-se juntos." A primeira regra de como um peso poderia *mudar* com a experiência.

**1958 — Rosenblatt e o perceptron.** A peça que faltava: uma **regra de aprendizado**. Mostre um exemplo; se o neurônio errar, empurre os pesos na direção que teria acertado; repita. Rosenblatt provou que, se o problema for linearmente separável, o procedimento **converge em número finito de passos**. O entusiasmo foi enorme — e a imprensa da época prometeu máquinas que andariam, falariam e teriam consciência de si.

**1969 — Minsky & Papert.** O livro *Perceptrons* demonstrou com rigor o que você acabou de descobrir no laboratório: um perceptron de camada única não computa o XOR. O argumento era correto e a leitura que se fez dele foi mais ampla do que os autores demonstraram — o financiamento migrou para a IA simbólica, e a área conexionista entrou no que se chamou depois de **inverno da IA**.

**1986 — a saída.** Rumelhart, Hinton e Williams popularizam o **backpropagation**: uma forma prática de treinar redes com **camadas intermediárias**. E com uma camada escondida o XOR se resolve — porque duas retas, combinadas, separam o que uma não separava.

A moral, e ela vale além da história: **a limitação nunca foi do neurônio. Era da arquitetura de uma camada só.** O capítulo 09 constrói a rede multicamada que resolve isso.

:::exercicio {"id":"18-e2","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
O que, historicamente, destravou a limitação demonstrada em *Perceptrons* (1969)?

- [ ] Computadores mais rápidos, que permitiram testar mais pesos.
- [ ] O abandono do modelo de neurônio de McCulloch–Pitts.
- [x] Empilhar camadas — e uma forma prática de treiná-las, o backpropagation.
- [ ] A substituição do limiar por uma função de ativação contínua.

> **gabarito:** Empilhar camadas, com backpropagation para treiná-las
> **porque:** A limitação era da **arquitetura**, não do neurônio. Com uma camada intermediária, duas fronteiras se combinam e o XOR se resolve. Isso já era sabido em 1969; o que faltava era um jeito **prático de treinar** os pesos das camadas escondidas — e é isso que o backpropagation, popularizado em 1986, entrega.
>
> A última alternativa merece atenção porque está **quase** certa e é o erro mais interessante: trocar o degrau por uma função contínua (como a sigmoide) é de fato **necessário** — sem derivada não há gradiente, e sem gradiente não há backpropagation. Mas sozinha ela não resolve nada: uma regressão logística é exatamente um neurônio com ativação contínua, e continua sem resolver o XOR. A ativação contínua é condição para o remédio, não o remédio.
> **volte para:** #a-historia-entusiasmo-inverno-e-a-saida
:::

:::exercicio {"id":"18-e3","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
Você quer construir a função **OU (OR)** com pesos `w₁ = 1` e `w₂ = 1`.

Qual é o **maior** valor inteiro de limiar `θ` que faz o neurônio funcionar corretamente?

> **gabarito:** 1
> **porque:** Some as entradas em cada linha da tabela: (0,0) → 0; (0,1) → 1; (1,0) → 1; (1,1) → 2. O OR deve disparar em todas menos na primeira. Então θ precisa ser **maior que 0** e **menor ou igual a 1** — o maior inteiro que satisfaz isso é **θ = 1**.
>
> Com θ = 2 você teria construído o **AND**, não o OR: só (1,1) alcançaria o limiar. Esse é o achado que vale levar do exercício — a mesma dupla de pesos produz funções diferentes conforme o limiar. O limiar não é um detalhe de calibração: ele é parte da função que o neurônio computa. Volte ao laboratório e confirme deslizando só o θ.
> **volte para:** #mao-na-massa-encontre-os-pesos-voce-mesmo
:::

:::exercicio {"id":"18-e4","tipo":"aberta","objetivo":"O1","pontos":3,"dificuldade":"media"}
Explique, para alguém que nunca viu redes neurais, **o que um neurônio artificial faz** — e diga em que ele se parece e em que ele **não** se parece com um neurônio biológico.

> **rubrica:** descreve a operação corretamente: soma ponderada das entradas comparada a um limiar;
> menciona que os pesos determinam a importância de cada entrada;
> aponta ao menos uma semelhança razoável com o neurônio biológico (integrar sinais, disparar ou não);
> aponta ao menos uma diferença importante (ausência de tempo, de química, de estrutura, ou o fato de ser uma simplificação deliberada);
> não trata a analogia biológica como se fosse literal
> **porque:** A operação é simples de enunciar: multiplica cada entrada pelo seu peso, soma, e dispara se a soma alcançar o limiar. O peso é "quanto essa entrada importa"; o limiar é "quão convencido preciso estar para dizer sim".
>
> A parte que separa uma boa resposta de uma decorada é a **analogia**. A semelhança é real e limitada: o neurônio biológico também integra sinais de entrada e dispara de forma tudo-ou-nada. As diferenças são enormes — o neurônio real opera no tempo, com sinais químicos, taxas de disparo, plasticidade e uma geometria que importa; o artificial é uma soma ponderada estática. McCulloch e Pitts sabiam disso: o modelo deles era uma abstração **deliberada**, feita para responder a uma pergunta lógica, não para simular biologia.
>
> Vale saber por que isso importa na prática: tratar a analogia como literal é a origem de boa parte do exagero sobre o que redes neurais "entendem". O nome é herança histórica, não descrição do mecanismo.
> **volte para:** #o-problema-pode-uma-maquina-pensar-em-logica
:::

## Síntese — o que levar

- O neurônio de McCulloch–Pitts (1943) faz **uma soma ponderada e uma comparação com um limiar**. Nada mais.
- No modelo original **não há aprendizado**: os pesos são postos à mão. Aprender pesos é o perceptron, de 1958.
- Encontrar pesos à mão é fazer manualmente o que o gradiente faz sozinho: mover a fronteira até os erros acabarem.
- Há **infinitas** soluções para cada função separável — e **nenhuma** para o XOR, por geometria.
- A limitação era da **arquitetura de uma camada**, não do neurônio. A saída foi empilhar camadas e treiná-las com backpropagation.

## Verificação

1. Sem olhar o laboratório, dê pesos e limiar que implementem o NÃO-E (NAND). Depois confira.
2. Explique a alguém, em duas frases, por que o XOR é impossível para um neurônio só.
3. Se uma segunda camada resolve o XOR, por que a área levou quase vinte anos para usá-la?
