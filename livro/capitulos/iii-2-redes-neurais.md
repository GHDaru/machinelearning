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

Só que essa não era a parte difícil. **Depois de 1969 já se sabia que uma camada intermediária resolvia o XOR.** Qualquer um conseguia escrever à mão os pesos que fazem aquilo funcionar — você vai escrever daqui a três parágrafos. O que não existia era um jeito de **descobrir** esses pesos a partir de dados, quando eles são milhares e ninguém sabe o que cada unidade escondida deveria significar.

A regra do perceptron não servia: ela corrige pesos comparando a saída com o rótulo, e a camada escondida **não tem rótulo**. Ninguém sabe o que a terceira unidade da camada do meio deveria ter respondido. Esse é o aperto, e ele durou quase vinte anos.

**1986 não entrega a arquitetura. Entrega o procedimento.**

## De onde isto veio

**O aperto.** A arquitetura estava disponível e inerte. Havia camadas escondidas, havia demonstração de que elas resolviam o que uma camada não resolve, e não havia sinal de erro para elas. A pergunta não era *"que rede usar?"*, era *"como atribuir culpa a um peso que fica no meio do caminho?"*.

**O que se fazia antes.** Duas saídas, ambas ruins. Ficar na **camada única** com a regra do perceptron — barato, convergente, e limitado ao que é linearmente separável. Ou pôr os **pesos escondidos à mão**, projetando cada unidade intermediária como se fosse uma função lógica. Funciona em brinquedos como o XOR; não funciona em nada com mais de uma dúzia de unidades.

**A virada — e ela vem em ordem inversa à intuição.** Primeiro veio o **procedimento**: em 1986, Rumelhart, Hinton e Williams popularizam o backpropagation e mostram que as camadas escondidas aprendem representações úteis sozinhas. Só **depois** veio a licença teórica. Cybenko, em *Approximation by superpositions of a sigmoidal function* (*Math. Control Signals Systems*, 1989), e Hornik, em *Approximation capabilities of multilayer feedforward networks* (*Neural Networks* 4:251–257, 1991), provam que **uma única camada escondida aproxima qualquer função contínua — desde que haja unidades suficientes**.

Repare na ordem. A engenharia funcionou por três anos antes de a matemática dizer que ela podia funcionar. Isso é mais comum do que os livros contam, e é um bom antídoto contra a ideia de que teoria precede prática.

**A ideia reaproveitável — e é a tese deste capítulo: existência não é treinabilidade.** O teorema diz que a rede certa **está** no espaço de hipóteses. Não diz quantas unidades ela precisa. Não diz como achá-la. E não diz se o gradiente descendente chega até ela partindo de onde você inicializou. É um resultado **não construtivo**: garante que o objeto existe sem dar receita para construí-lo.

Guarde isso, porque a confusão é cara e frequente. "A rede pode representar qualquer função" é uma afirmação sobre o **conjunto de funções representáveis**. "A rede vai aprender essa função" é uma afirmação sobre o **procedimento de busca**, sobre os dados e sobre a inicialização. Os vinte anos de dificuldade que o [capítulo III.3](iii-3-treinar-redes-profundas.md) narra — gradientes que somem, gradientes que explodem, redes profundas que não treinavam — são exatamente o preço dessa distinção.

**O nome.** "Teorema da aproximação universal" é rótulo posterior: a expressão **não aparece no título de nenhum dos dois artigos**. E há um detalhe de Hornik que o rótulo popular apaga — o poder de aproximação **não vem da função de ativação escolhida**; vem da **estrutura em camadas**. Trocar sigmoide por outra não-linearidade razoável não muda o que a rede pode representar. Muda o quanto ela treina bem, que é outra conversa — a conversa deste livro inteiro.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Cybenko, *Approximation by superpositions of a sigmoidal function*, **Math. Control Signals Systems (1989)**; Hornik, *Approximation capabilities of multilayer feedforward networks*, **Neural Networks 4:251–257 (1991)**. **Os artigos não foram lidos por inteiro** |
| ✓ᵐ | Que a expressão "teorema da aproximação universal" **não consta do título** de nenhum dos dois artigos |
| ✓ᵐ | Rumelhart, Hinton & Williams (1986) — [doi:10.1038/323533a0](https://doi.org/10.1038/323533a0), conferido no [capítulo III.1](iii-1-neuronio-artificial.md) |
| ⏳ | Que a prática anterior era camada única com a regra do perceptron, ou pesos escondidos postos à mão |
| ⏳ | A leitura de Hornik de que a fonte do poder de aproximação é a estrutura em camadas, não a ativação |
| 📖 | Que 1986 entrega o **procedimento**, não a arquitetura — e que a licença teórica chegou **depois** da engenharia |
| 📖 | "Existência não é treinabilidade" como a ideia exportável, e os vinte anos do [capítulo III.3](iii-3-treinar-redes-profundas.md) como o preço dela |

## Fundamentos: a camada escondida, e o XOR resolvido

Volte ao laboratório do [capítulo III.1](iii-1-neuronio-artificial.md) e olhe as retas que você **conseguiu** traçar. O OU funciona. O NÃO-E funciona. O XOR, não.

Agora repare: o XOR é exatamente `(x₁ OU x₂) E (x₁ NÃO-E x₂)` — "pelo menos um, mas não os dois". Duas fronteiras que você já sabe traçar, combinadas por uma terceira que você também já sabe traçar.

É isso que a camada escondida faz. Com o mesmo neurônio de limiar do capítulo III.1:

| Unidade | Pesos | Limiar | O que computa |
|---|---|---|---|
| escondida `h₁` | `w₁ = 1`, `w₂ = 1` | `θ = 1` | OU |
| escondida `h₂` | `w₁ = -1`, `w₂ = -1` | `θ = -1` | NÃO-E |
| saída `y` | `w₁ = 1`, `w₂ = 1` | `θ = 2` | E |

Confira nas quatro linhas: (0,0) → h=(0,1) → soma 1, não dispara. (0,1) → h=(1,1) → soma 2, dispara. (1,0) → idem, dispara. (1,1) → h=(1,0) → soma 1, não dispara. **4 de 4.** O que era impossível em um plano ficou trivial em dois passos, porque a camada escondida **reescreveu as entradas** — `h₁` e `h₂` são coordenadas novas, e nelas o problema virou linearmente separável.

**A arquitetura.** Um **perceptron multicamadas** (*multilayer perceptron*, MLP) é isso, generalizado: uma camada de **entrada** (os atributos), uma ou mais camadas **escondidas** e uma camada de **saída**. Cada camada faz duas coisas, sempre nesta ordem: uma transformação linear (`Wx + b`) e uma **não-linearidade** aplicada elemento a elemento. A rede inteira é a composição dessas duas peças, repetida.

**Contar os parâmetros, uma vez, com número.** Uma camada que recebe $e$ entradas e produz $s$ saídas tem uma matriz $W$ de $e \times s$ pesos, mais **um viés por unidade de destino** — $s$ deles. Total: $e \times s + s$.

Numa rede 3 → 4 → 2, portanto: a primeira camada tem $3 \times 4 + 4 = 16$; a segunda, $4 \times 2 + 2 = 10$; a rede tem **26** parâmetros treináveis. Guarde a regra, porque o próximo exercício pede outra arquitetura — e porque é a conta que decide se você tem dado suficiente para treinar.

A não-linearidade não é enfeite. **Duas camadas lineares empilhadas, sem ativação no meio, são uma camada linear** — o produto de duas matrizes é uma matriz. Sem a não-linearidade, você paga por profundidade e recebe uma regressão. Aliás, o caso extremo já é seu conhecido: uma camada, uma unidade, ativação sigmoide, e você tem a **regressão logística** do [capítulo II.3](ii-3-regressao-logistica.md). Um neurônio só.

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
> **volte para:** #fundamentos-a-camada-escondida-e-o-xor-resolvido
:::

## Backpropagation: a regra da cadeia com reaproveitamento

Agora o problema de 1969. Os pesos da tabela acima foram postos à mão. Como descobri-los a partir de dados?

**Primeiro, o degrau tem de sair.** A função-degrau do neurônio de McCulloch–Pitts é plana em toda parte e salta num ponto: sua derivada é zero onde existe e não existe onde importa. **Sem derivada não há gradiente, e sem gradiente não há direção para onde mover o peso.** Por isso as ativações usadas em rede treinável são contínuas: sigmoide, tangente hiperbólica, ReLU. Não é preferência estética — é a condição para que a otimização do [capítulo II.4](ii-4-otimizacao.md) tenha o que ler.

**O passo para frente.** A entrada atravessa a rede camada a camada, e cada camada guarda o que calculou. No fim sai uma previsão, e a função de perda transforma previsão e rótulo num único número: o erro.

**O passo para trás.** Aqui está a ideia inteira. O erro da saída depende dos pesos da última camada — isso é fácil de derivar. Mas ele também depende dos pesos da camada anterior, *através* da última camada. É a **regra da cadeia**: a influência de um peso lá atrás sobre o erro lá na frente é o produto das influências ao longo do caminho.

Fazer isso ingenuamente seria absurdo: recalcular o caminho inteiro para cada peso, com milhões de pesos, é trabalho repetido em escala industrial. **O que torna o backpropagation viável é o reaproveitamento.** Calcula-se o erro na saída, propaga-se para trás **uma vez**, e a quantidade que chega a cada camada é reusada por todos os pesos daquela camada. O custo do passo para trás fica da mesma ordem do passo para frente — e é isso, e não a regra da cadeia em si, que é a descoberta prática.

Repare no que backpropagation **não** é: não é um algoritmo de otimização. Ele calcula o gradiente. Quem move os pesos é o gradiente descendente do [capítulo II.4](ii-4-otimizacao.md) — a mesma otimização, os mesmos passos, a mesma regularização, só que numa superfície muito maior e cheia de vales.

**A saída, para classificação multiclasse.** A última camada produz um número por classe, e o **softmax** os converte em probabilidades que somam 1: exponencia cada um e divide pela soma. A perda é a **entropia cruzada**, que pune com força a confiança errada — prever 0,99 na classe errada custa muito mais do que prever 0,5. A dupla softmax + entropia cruzada não é acaso: combinadas, o gradiente na saída se reduz a `previsão − rótulo`. Simples de derivar, estável de calcular, barato de implementar.

:::exercicio {"id":"redes-neurais-e2","tipo":"numerica","objetivo":"O3","dificuldade":"facil"}
Um MLP densa tem **4 entradas**, uma camada escondida de **5 unidades** e **3 saídas**. Todas as camadas têm **viés**.

Quantos parâmetros treináveis a rede tem no total?

> **gabarito:** 43
> **porque:** Conte camada por camada. Primeira: uma matriz 4×5 = 20 pesos, mais 5 vieses (um por unidade de destino) = **25**. Segunda: 5×3 = 15 pesos, mais 3 vieses = **18**. Total **43**.
>
> A regra que vale levar: **os pesos de uma camada formam uma matriz `entradas × saídas`, e há um viés por unidade de destino** — nunca por unidade de origem. Errar isso é o bug mais comum de quem implementa a rede em NumPy pela primeira vez, e ele não aparece como erro de matemática: aparece como uma exceção de dimensão incompatível no passo para frente, ou pior, como uma soma que "funciona" por *broadcasting* e treina errado.
>
> Repare também na escala: 43 parâmetros para uma rede minúscula. Acrescente uma camada escondida de 100 unidades e você passa de mil. É por isso que o custo do passo para trás importa tanto.
> **volte para:** #backpropagation-a-regra-da-cadeia-com-reaproveitamento
:::

## Quantas camadas e quantas unidades — a decisão é empírica

O teorema diz que uma camada escondida basta. Não diz **quantas unidades** — e "unidades suficientes" pode significar um número absurdo. Na prática, redes mais profundas costumam resolver com menos unidades por camada o que uma camada rasa só resolveria com muitas. Isso é observação da prática, não consequência do teorema.

Então como se escolhe? **Empiricamente, e sob validação.** Comece pequeno, aumente até a rede conseguir *overfitar* um subconjunto pequeno dos dados — se ela não consegue decorar 50 exemplos, o problema é capacidade ou bug, não regularização. Depois regularize para trazer a generalização de volta, com as ferramentas do [capítulo II.4](ii-4-otimizacao.md). O número de camadas e de unidades é hiperparâmetro, e hiperparâmetro se escolhe com dados de validação, nunca com opinião.

E aqui a tese do capítulo cobra o preço. O teorema garante que **existe** uma configuração de pesos que resolve seu problema. Ele não garante que o seu treino vá encontrá-la — a inicialização pode ser ruim, o gradiente pode sumir antes de chegar às primeiras camadas, os dados podem ser insuficientes para distinguir aquela solução de mil outras. É exatamente por isso que empilhar mais camadas **não funcionou por quase vinte anos** depois de 1986, apesar de o teorema já estar publicado desde 1989. O [capítulo III.3](iii-3-treinar-redes-profundas.md) conta o que foi preciso para destravar.

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
**Desafio de fechamento.** Explique backpropagation a alguém que **conhece a regra da cadeia** mas nunca viu uma rede. Diga o que é o passo para frente, o que é o passo para trás, e — a parte que decide — **onde exatamente está o reaproveitamento** que torna o custo viável.

> **rubrica:** apresenta backpropagation como aplicação da regra da cadeia a uma composição de funções, e não como um algoritmo à parte que se decora;
> descreve o passo para frente guardando os valores intermediários, e diz **por que** eles precisam ser guardados — são eles que as derivadas do passo para trás consomem;
> localiza o reaproveitamento: o gradiente de uma camada é calculado a partir do gradiente da camada seguinte, de modo que cada derivada parcial é computada **uma vez** e reutilizada por tudo que está atrás dela;
> não deixa a explicação parar em "é a regra da cadeia": sem dizer o que seria o custo **sem** o reaproveitamento — recalcular o caminho inteiro para cada peso —, a explicação não mostrou o que backpropagation acrescenta
> **porque:** O quarto critério existe porque a resposta mais comum é verdadeira e vazia. "É a regra da cadeia aplicada à rede" está certo, e não explica por que isso foi um acontecimento: a regra da cadeia é do século XVII, e as redes ficaram intratáveis por décadas mesmo com ela disponível.
>
> O que backpropagation acrescenta é **ordem de cálculo**. Aplicando a regra da cadeia ingenuamente — para cada peso, percorrer o caminho dele até a saída — o mesmo produto é recalculado incontáveis vezes, e o custo cresce com o número de pesos multiplicado pela profundidade. Propagando de trás para frente, o gradiente da camada *k* já traz condensado tudo o que vem depois dela, e o custo do passo para trás fica **da mesma ordem** do passo para frente.
>
> Note o que a boa explicação torna óbvio de graça: **por que a memória cresce com a profundidade**. Guardar os valores intermediários é o preço do reaproveitamento, e é a razão de o tamanho do lote esbarrar na placa de vídeo — um fato de engenharia que cai direto desta derivação.
> **volte para:** #backpropagation-a-regra-da-cadeia-com-reaproveitamento
:::

## Verificação

1. Escreva os pesos e limiares de um MLP que computa o XOR e confira as quatro linhas da tabela-verdade. Depois explique, em uma frase, o que a camada escondida fez com o espaço de entrada.
2. "Uma camada escondida basta para aproximar qualquer função contínua." Diga o que essa frase garante, o que ela não garante, e por que a diferença entre as duas coisas custou quase vinte anos à área.

> Estas duas não são corrigidas, e a omissão é deliberada: a primeira vale mais como construção no papel, conferida por você linha a linha, do que como texto — e a segunda rende mais numa discussão.
