# III.1 — O Neurônio Artificial

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

$$y = \begin{cases} 1 & \text{se } w_1x_1 + w_2x_2 + \dots \geq \theta \\ 0 & \text{se } w_1x_1 + w_2x_2 + \dots < \theta \end{cases}$$

Aqui `y` é a saída, `x` são as entradas, `w` são os pesos e `θ` (teta) é o limiar — a mesma notação do diagrama acima.

É só isso. Uma soma ponderada e uma comparação.

<img src="assets/neuronio-mp.svg" alt="Diagrama do neurônio de McCulloch–Pitts: as entradas x₁ e x₂ são multiplicadas pelos pesos w₁ e w₂, somadas no corpo do neurônio, comparadas com o limiar θ, e a saída é 1 se a soma alcançar o limiar e 0 caso contrário." width="720">

O que McCulloch e Pitts demonstraram foi que **redes desses elementos podem computar qualquer função lógica proposicional**. O argumento era filosófico antes de ser tecnológico: se o pensamento é lógica, e a lógica é computável por neurônios, então o pensamento é computável. Foi uma das ideias fundadoras da inteligência artificial, da teoria de autômatos e da cibernética — quinze anos antes de existir uma máquina que aprendesse alguma coisa.

> **Repare no que ainda não existe aqui: aprendizado.** No modelo de 1943 os pesos são **postos à mão** por quem projeta a rede. Descobrir os pesos automaticamente é o passo seguinte da história, e é o que o perceptron de Rosenblatt traz em 1958.

## De onde isto veio

**O aperto.** McCulloch era neurofisiologista e passara anos atrás de uma pergunta que a fisiologia da época não sabia formular: *que tipo de coisa o cérebro faz, do ponto de vista lógico?* Pitts tinha vinte anos, nenhum diploma, e lia lógica formal desde os doze. Nenhum dos dois queria construir uma máquina — queriam **decidir uma questão filosófica** com ferramenta matemática. O aperto era esse: havia um órgão que evidentemente processava informação, e nenhuma linguagem para descrever o que ele processava.

**O que se fazia antes.** Descrevia-se o neurônio em termos **químicos e elétricos** — potenciais, limiares de disparo, sinapses. Descrição correta e inútil para a pergunta: nenhuma quantidade de eletroquímica dizia se aquilo computava alguma coisa.

**A virada.** Jogar fora quase tudo. Nada de tempo contínuo, nada de química, nada de geometria do axônio — só *"soma o que chega, e dispara se passar de um limite"*. Com essa abstração violenta eles provaram que **redes desses elementos computam qualquer função lógica proposicional**. Se o pensamento é lógica, e a lógica cabe em neurônios, então o pensamento é computável — quinze anos antes de existir máquina que aprendesse coisa alguma.

**A ideia reaproveitável.** **Uma abstração vale pelo que ela permite provar, não pela fidelidade ao original.** O neurônio de 1943 é biologicamente errado de propósito — e é justamente por ter descartado a biologia que rendeu um teorema. Todo modelo que você vai construir neste livro faz a mesma aposta: joga fora o que não serve à pergunta. Saber **o que** foi jogado fora é o que separa usar um modelo de acreditar nele — e é a origem de boa parte do exagero sobre o que redes neurais "entendem".

**O nome.** "Neurônio artificial" é herança da motivação, não descrição do mecanismo. E é mais velho que o campo: a expressão *inteligência artificial* só apareceria treze anos depois.

| Quando | O quê |
|---|---|
| **1943** | McCulloch & Pitts publicam o neurônio lógico |
| **jul–ago de 1948** | Turing escreve, para o National Physical Laboratory, o relatório [*Intelligent Machinery*](https://weightagnostic.github.io/papers/turing1948.pdf) — onde o jogo da imitação aparece pela primeira vez, em forma restrita. O relatório **só foi publicado em 1968** |
| **1950** | Sai na *Mind* [*Computing Machinery and Intelligence*](https://doi.org/10.1093/mind/LIX.236.433), a exposição completa do que hoje se chama **teste de Turing** |
| **31 de agosto de 1955** | McCarthy, Minsky, Rochester e Shannon assinam a [proposta do projeto de Dartmouth](https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html) — onde **"artificial intelligence" aparece pela primeira vez** |
| **1956** | O workshop de Dartmouth acontece, e é tomado como o evento fundador do campo |

Duas coisas valem ficar: **o neurônio artificial é treze anos mais velho que o nome do campo em que vive**, e a ideia de Turing sobre máquinas pensantes é de **1948**, não de 1950 — o texto famoso é o segundo, e o primeiro passou vinte anos numa gaveta.

### A linha até 1986, e o que ela ensina sobre crédito

| Ano | Quem | O quê | Fonte |
|---|---|---|---|
| **1943** | McCulloch & Pitts | O neurônio lógico. Sem aprendizado: os pesos são projetados | [doi:10.1007/BF02478259](https://doi.org/10.1007/BF02478259) |
| **1949** | Hebb | *The Organization of Behavior*: "neurônios que disparam juntos conectam-se juntos" — a primeira ideia de como um peso poderia **mudar** com a experiência | [registro](https://psycnet.apa.org/record/1950-02200-000) |
| **1958** | Rosenblatt | O **perceptron**: a regra de aprendizado que faltava, com prova de convergência para problemas separáveis | [doi:10.1037/h0042519](https://doi.org/10.1037/h0042519) |
| **1969** | Minsky & Papert | *Perceptrons*: a demonstração de que uma camada não computa o XOR | [MIT Press](https://mitpress.mit.edu/9780262534772/perceptrons/) |
| **1970** | Linnainmaa | A **retropropagação** descrita pela primeira vez, em tese de mestrado, em finlandês, sem falar em redes neurais | — |
| **1974** | Werbos | Tese de doutorado: aplicar aquilo a redes neurais; publicações entre 1979 e 1981 | — |
| **1979/80** | Fukushima | O **neocognitron**, primeira arquitetura hierárquica convolucional — treinada **sem** backpropagation. Em japonês em 1979; em inglês em 1980 | [doi:10.1007/BF00344251](https://doi.org/10.1007/BF00344251) |
| **1986** | Rumelhart, Hinton & Williams | Popularizam o backpropagation e mostram as representações aprendidas nas camadas escondidas | [doi:10.1038/323533a0](https://doi.org/10.1038/323533a0) |

Rosenblatt provou que, **se o problema for linearmente separável**, o perceptron converge em número finito de passos. A prova é sólida e a condição é a chave — mas o entusiasmo de 1958 leu só a primeira parte, e a imprensa prometeu máquinas conscientes. Onze anos depois, *Perceptrons* demonstrou com rigor o que você vai descobrir no laboratório abaixo: uma camada não computa o XOR. **O argumento estava correto**; a leitura que se fez dele foi mais ampla do que os autores demonstraram, o financiamento migrou para a IA simbólica, e veio o **inverno da IA**.

A saída, em 1986, tem uma moral que vale além da história: **a limitação nunca foi do neurônio, era da arquitetura de uma camada só.** O [capítulo III.2](iii-2-redes-neurais.md) constrói a rede multicamada que resolve isso.

E repare em quem leva o crédito. Rumelhart, Hinton e Williams **popularizaram** o backpropagation; a descrição é de Linnainmaa, dezesseis anos antes, em finlandês, sem mencionar redes neurais. Jürgen Schmidhuber, que passou anos reivindicando a atribuição correta, resume assim: **não é o primeiro inventor que leva o crédito, é o último reinventor.**

> **O espelho disto está no [capítulo II.2](ii-2-modelos-lineares.md).** Lá, Gauss descobriu os mínimos quadrados antes e **perdeu** a prioridade para Legendre, que publicou primeiro e argumentou que prioridade se estabelece por publicação. Os dois casos, juntos, dizem o que nenhum diz sozinho: **crédito não segue descoberta, segue comunicação** — e é por isso que publicar, datar e documentar faz parte do método, não da burocracia.

> **Sobre "um italiano em 1979".** Essa memória circula, e não encontrei quem a sustente. O que existe em 1979 são as publicações de Werbos (americano) e o neocognitron de Fukushima (japonês, em inglês no ano seguinte); a prioridade de 1970 é de Linnainmaa, finlandês. Se você tiver a referência, ela entra aqui — até lá o livro registra a dúvida em vez de escolher uma versão.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Datas, autoria e veículo de McCulloch & Pitts (1943), Rosenblatt (1958), Fukushima (1980) e Rumelhart *et al.* (1986) — conferidos no Crossref em 2026-08-08. **Os artigos não foram lidos por inteiro** |
| ✓ᵐ | A proposta de Dartmouth (31/08/1955) e o artigo da *Mind* (1950), pelos documentos ligados acima |
| ⏳ | Que o relatório *Intelligent Machinery* (1948) só veio a público em 1968 |
| ⏳ | A biografia de Pitts (vinte anos, autodidata, sem endereço fixo) — repetida de forma consistente na literatura; não conferida em fonte primária |
| ⏳ | A cronologia de prioridade do backpropagation (Linnainmaa 1970, Werbos 1974) e a frase de Schmidhuber |
| ❌ | "Um italiano desenvolveu o backpropagation em 1979" — procurei e não achei fonte |
| 📖 | A ideia reaproveitável ("uma abstração vale pelo que permite provar") e a leitura de que o inverno veio de uma leitura ampliada de *Perceptrons* |

## Mão na massa: encontre os pesos você mesmo

Antes de ler qualquer explicação, brinque. Ajuste `w₁`, `w₂` e `θ` até a tabela-verdade fechar.

Comece pelo **E (AND)**: o neurônio deve disparar só quando as duas entradas forem 1.

:::lab {"id":"neuronio-artificial-l1","tipo":"neuronio-mp","titulo":"Neurônio de McCulloch–Pitts","funcao":"AND"}
Cada ponto no gráfico é uma linha da tabela-verdade. **Verde** = deveria disparar; **branco/cinza** = não deveria. A reta é `w₁x₁ + w₂x₂ = θ`, e a região sombreada é onde o neurônio dispara.

Sua tarefa: mover a reta até que **todos os pontos verdes fiquem dentro da região sombreada e todos os outros fiquem fora**.

Comece pelo **E (AND)**. Depois tente **OU**, **NÃO-E** e **NÃO-OU** — todos têm solução, e cada um tem *infinitas* soluções. Deixe o **OU-EXCLUSIVO (XOR)** por último.
:::

### O que você deveria ter notado

**Primeiro:** não existe *a* resposta certa. Para o AND, `w₁=1, w₂=1, θ=2` funciona; `w₁=0,6, w₂=0,6, θ=1` também; `w₁=3, w₂=2, θ=4,5` também. Infinitas retas separam aqueles quatro pontos — e essa multiplicidade não é defeito, é a natureza do problema. É a mesma razão pela qual dois modelos treinados com sementes diferentes chegam a coeficientes diferentes e à mesma qualidade.

**Segundo:** você estava fazendo, à mão, exatamente o que o gradiente descendente do [capítulo II.4](ii-4-otimizacao.md) faz sozinho — mover a fronteira até que os erros acabem. A diferença é que você olhava a tabela inteira e ajustava por intuição; o algoritmo olha um erro por vez e ajusta por regra fixa.

**Terceiro — e este é o ponto do capítulo:** no XOR você travou em 3 de 4.

## Por que o XOR é impossível

Não é falta de habilidade nem de paciência. É geometria.

O XOR dispara em (0,1) e (1,0), e não dispara em (0,0) e (1,1). Coloque os quatro pontos num quadrado: os que devem disparar estão em **cantos opostos**, e os que não devem também.

Uma reta divide o plano em dois lados. Para resolver o XOR ela precisaria deixar dois cantos opostos de um lado e os outros dois do outro — e **nenhuma reta faz isso**. Não importa quanto você gire ou translade: qualquer reta que separe (0,1) de (0,0) e (1,1) vai deixar (1,0) do lado errado.

O nome técnico é **separabilidade linear**. AND, OR, NAND e NOR são linearmente separáveis; XOR não é. E um neurônio de McCulloch–Pitts — ou um perceptron, ou uma regressão logística — traça **exatamente uma reta**.

> É a mesma limitação que o [capítulo II.5](ii-5-arvores-ensembles.md) mediu com outro vocabulário: naquele experimento, o modelo linear ficou em 0,4963 de AUC — acaso — porque a fronteira verdadeira era não-monotônica. Aqui você vê a razão em quatro pontos, em vez de em uma tabela de resultados.

:::exercicio {"id":"neuronio-artificial-e1","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
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

:::exercicio {"id":"neuronio-artificial-e2","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
O que, historicamente, destravou a limitação demonstrada em *Perceptrons* (1969)?

- [ ] Computadores mais rápidos, que permitiram testar mais pesos.
- [ ] O abandono do modelo de neurônio de McCulloch–Pitts.
- [x] Empilhar camadas — e uma forma prática de treiná-las, o backpropagation.
- [ ] A substituição do limiar por uma função de ativação contínua.

> **gabarito:** Empilhar camadas, com backpropagation para treiná-las
> **porque:** A limitação era da **arquitetura**, não do neurônio. Com uma camada intermediária, duas fronteiras se combinam e o XOR se resolve. Isso já era sabido em 1969; o que faltava era um jeito **prático de treinar** os pesos das camadas escondidas — e é isso que o backpropagation, popularizado em 1986, entrega.
>
> A última alternativa merece atenção porque está **quase** certa e é o erro mais interessante: trocar o degrau por uma função contínua (como a sigmoide) é de fato **necessário** — sem derivada não há gradiente, e sem gradiente não há backpropagation. Mas sozinha ela não resolve nada: uma regressão logística é exatamente um neurônio com ativação contínua, e continua sem resolver o XOR. A ativação contínua é condição para o remédio, não o remédio.
> **volte para:** #a-linha-ate-1986-e-o-que-ela-ensina-sobre-credito
:::

:::exercicio {"id":"neuronio-artificial-e3","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
Você quer construir a função **OU (OR)** com pesos `w₁ = 1` e `w₂ = 1`.

Qual é o **maior** valor inteiro de limiar `θ` que faz o neurônio funcionar corretamente?

> **gabarito:** 1
> **porque:** Some as entradas em cada linha da tabela: (0,0) → 0; (0,1) → 1; (1,0) → 1; (1,1) → 2. O OR deve disparar em todas menos na primeira. Então θ precisa ser **maior que 0** e **menor ou igual a 1** — o maior inteiro que satisfaz isso é **θ = 1**.
>
> Com θ = 2 você teria construído o **AND**, não o OR: só (1,1) alcançaria o limiar. Esse é o achado que vale levar do exercício — a mesma dupla de pesos produz funções diferentes conforme o limiar. O limiar não é um detalhe de calibração: ele é parte da função que o neurônio computa. Volte ao laboratório e confirme deslizando só o θ.
> **volte para:** #mao-na-massa-encontre-os-pesos-voce-mesmo
:::

:::exercicio {"id":"neuronio-artificial-e4","tipo":"aberta","objetivo":"O1","pontos":3,"dificuldade":"media"}
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

## Mão na massa: rode o código

Além do laboratório, o capítulo tem código Python que você pode **baixar e rodar** — sem instalar nada, nem NumPy.

| O quê | Como usar |
|---|---|
| **Notebook no Colab** | [abrir direto no Google Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-18/neuronio_mp.ipynb) — não precisa instalar nada |
| **Script** | [`ml-zero/etapa-18/neuronio.py`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-18/neuronio.py) — `python neuronio.py` |

O notebook tem três partes, e a terceira é a que fecha o capítulo:

1. **Você põe os pesos à mão** — a célula tem `w1, w2, theta = 0.0, 0.0, 0.0` e um comentário `<-- MEXA AQUI`.
2. **O perceptron acha os pesos sozinho** — a regra de Rosenblatt em oito linhas, convergindo em poucas épocas para AND, OR, NAND e NOR.
3. **O XOR por força bruta.** Em vez de argumentar, o notebook **testa 15.625 combinações** de pesos e limiar numa grade fina. O melhor resultado que aparece é **3 de 4**. Nunca 4.

Esse último ponto é o que transforma "é impossível" de afirmação em resultado. E há um detalhe no meio do caminho que vale reparar: treinando o perceptron no XOR, o número de erros por época **nem diminui** — ele oscila. O perceptron não se aproxima da solução, porque não há solução de que se aproximar. É o sintoma do impossível, não do difícil.

## Síntese — o que levar

- O neurônio de McCulloch–Pitts (1943) faz **uma soma ponderada e uma comparação com um limiar**. Nada mais.
- No modelo original **não há aprendizado**: os pesos são postos à mão. Aprender pesos é o perceptron, de 1958.
- Encontrar pesos à mão é fazer manualmente o que o gradiente faz sozinho: mover a fronteira até os erros acabarem.
- Há **infinitas** soluções para cada função separável — e **nenhuma** para o XOR, por geometria.
- A limitação era da **arquitetura de uma camada**, não do neurônio. A saída foi empilhar camadas e treiná-las com backpropagation.
- O neurônio artificial (1943) é **treze anos mais velho que o termo "inteligência artificial"** (1955) — e a ideia de Turing sobre máquinas pensantes está no relatório de **1948**, não no artigo famoso de 1950.
- O backpropagation foi descrito em **1970** (Linnainmaa), aplicado a redes em **1974** (Werbos) e popularizado em **1986**. Em ciência, o crédito vai ao último reinventor.

## Verificação

1. Sem olhar o laboratório, dê pesos e limiar que implementem o NÃO-E (NAND). Depois confira.
2. Explique a alguém, em duas frases, por que o XOR é impossível para um neurônio só.
3. Se uma segunda camada resolve o XOR, por que a área levou quase vinte anos para usá-la?
4. O termo "inteligência artificial" é de 1955 e o neurônio artificial é de 1943. O que isso diz sobre como campos científicos se formam?
