# II.3 — Regressão Logística

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-11 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar por que a regressão logística é um modelo de classificação apesar do nome.
- **O2.** Interpretar um coeficiente como efeito sobre a **razão de chances**, e não sobre a probabilidade.
- **O3.** Justificar por que a perda é a entropia cruzada e por que não há solução fechada.

> Este capítulo saiu do [II.2 — Modelos Lineares](ii-2-modelos-lineares.md), onde dividia espaço com a regressão linear. Compartilham a forma $w \cdot x + b$ e quase nada além disso.

## O problema: o classificador que finge ser regressão

Você quer prever se o cliente vai pagar: sim ou não. Tem os atributos, tem os rótulos 0 e 1, e tem uma regressão linear que já funciona. A tentação é imediata — ajuste a reta contra o rótulo e chame de classificador.

O resultado é ruim de um jeito específico. A reta prevê **1,7** para um cliente e **−0,4** para outro. Não são probabilidades, e nenhum arredondamento conserta: o problema não é o valor, é que a reta **não tem teto nem piso**, e a resposta que você quer tem os dois.

Pior: a perda quadrática pune o modelo por acertar com folga. Um cliente claramente bom, previsto em 1,5 quando o rótulo é 1, gera erro — e o ajuste puxa a reta para trás por causa de um caso que ele já resolveu.

O conserto não é limitar a saída na marra. É **mudar o que se modela**.

## De onde isto veio

**O aperto.** Meados do século XX, epidemiologia e bioensaio. A pergunta prática: dada uma dose, qual a **probabilidade** de o organismo responder? Havia método consolidado, o *probit*, baseado na normal acumulada, e ele funcionava. Só que exigia tabelas, iteração pesada para a época, e entregava um coeficiente que **ninguém conseguia explicar** a um médico.

**O que se fazia antes.** Ajustava-se o probit e reportava-se o resultado na escala da normal. A pergunta "quanto muda o risco se a dose dobrar?" não tinha resposta em linguagem clínica. Alternativamente, ignorava-se tudo e ajustava-se uma reta na proporção observada — com o defeito de prever probabilidades negativas nas doses baixas.

**A virada.** Modelar não a probabilidade, mas o **logaritmo da razão de chances**:

$$\log\frac{p}{1-p} = w \cdot x + b$$

O lado esquerdo varre a reta inteira, de $-\infty$ a $+\infty$; o direito é linear. O teto e o piso deixam de ser uma restrição a impor e passam a ser **consequência da forma escolhida**.

**A ideia reaproveitável.** **Quando a saída tem fronteiras e o modelo não, transforme a saída — não restrinja o modelo.** É o mesmo movimento que aparece no logaritmo de valores positivos, no *softmax* de várias classes e na função de ligação de qualquer modelo linear generalizado. A restrição vira mudança de escala, e o maquinário linear continua valendo inteiro.

**O nome.** *Logit*, contração de *logistic unit* (em português, **logito**), foi cunhado por **Joseph Berkson** em 1944, ecoando deliberadamente o *probit* (*probability unit*) do método concorrente. O nome carrega a polêmica: era uma proposta de substituição, não de complemento. A palavra *logística* vem antes, da curva logística de Pierre François Verhulst (1838), estudando crescimento populacional limitado — a mesma curva em S, chegando aqui por outro caminho.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Berkson, "Application of the Logistic Function to Bio-Assay", *Journal of the American Statistical Association*, 1944 — obra, ano e o fato de cunhar *logit*. [DOI 10.1080/01621459.1944.10500699](https://doi.org/10.1080/01621459.1944.10500699). **Não lida** |
| ✓ᵐ | Verhulst (1838), "Notice sur la loi que la population suit dans son accroissement" — a curva logística e o nome. **Não lida** |
| ✓ᵐ | Cox, "The Regression Analysis of Binary Sequences", *Journal of the Royal Statistical Society B*, 1958 — o trabalho que consolida o modelo na forma usada hoje. [DOI 10.1111/j.2517-6161.1958.tb00292.x](https://doi.org/10.1111/j.2517-6161.1958.tb00292.x). **Não lida** |
| ⏳ | Que o *logit* foi proposto como **substituto** do *probit*, e a controvérsia entre as duas escolas |
| ⏳ | Que a motivação era interpretabilidade clínica e custo de cálculo |
| ❌ | A data em que o método passou a ser padrão em crédito e seguro — procurei e não achei fonte com data defensável |
| 📖 | A ideia reaproveitável ("transforme a saída, não restrinja o modelo") e a ligação com o *softmax* |

> **Dívida declarada.** As três fontes acima estão seladas **✓ᵐ**: sei que existem, com DOI conferido, e não as li. O que este capítulo afirma sobre o que elas argumentam por dentro está, portanto, apoiado em leitura secundária. É a dívida **D10** do roadmap, e se paga lendo, não suavizando o texto.

## Fundamentos: a sigmoide e o logito

Invertendo a equação da virada, chega-se à forma que se usa para prever:

$$p = \sigma(z) = \frac{1}{1 + e^{-z}}, \qquad z = w \cdot x + b$$

A **sigmoide** comprime a reta inteira em $[0, 1]$: manda $-\infty$ para 0, $0$ para $0{,}5$ e $+\infty$ para 1.

O ponto que dá nome ao modelo é a volta:

$$z = \log\frac{p}{1-p}$$

O que é linear nos atributos **não é a probabilidade** — é o **logito**, o logaritmo da razão de chances. A regressão logística é uma regressão linear *sobre o logito*, usada para classificar.

:::exercicio {"id":"regressao-logistica-e1","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Numa regressão logística, o que é linear nos atributos?

- [ ] A probabilidade prevista.
- [x] O logito — o logaritmo da razão de chances.
- [ ] A classe prevista (0 ou 1).
- [ ] O erro de classificação.

> **gabarito:** O logito
> **porque:** O modelo calcula z = w·x + b (linear) e depois aplica a sigmoide para chegar à probabilidade. A sigmoide é **não linear** — é justamente ela que comprime a reta inteira no intervalo [0,1]. Portanto a probabilidade *não* é linear nos atributos; o logito é.
>
> A consequência prática aparece nos extremos. Um aumento de uma unidade num atributo muda o logito sempre na mesma quantidade, mas muda a **probabilidade** muito perto de 0,5 e quase nada perto de 0 ou de 1. Por isso "este atributo aumenta a chance em 3 pontos percentuais" é uma frase que só pode ser verdadeira num ponto específico, nunca em geral.
> **volte para:** #fundamentos-a-sigmoide-e-o-logito
:::

:::exercicio {"id":"regressao-logistica-e4","tipo":"numerica","objetivo":"O1","dificuldade":"media"}
Um modelo de regressão logística calcula $z = w \cdot x + b = 0$ para um determinado cliente.

Qual probabilidade a sigmoide devolve? Responda com duas casas decimais.

> **gabarito:** 0.50 ± 0.01
> **porque:** $\sigma(0) = 1/(1 + e^{0}) = 1/2 = \mathbf{0{,}50}$. É o ponto médio da sigmoide, e o que ele significa vale mais que a conta: $z = 0$ é a fronteira de decisão do modelo com limiar em 0,5.
>
> Daí sai a leitura geométrica do modelo. A equação $w \cdot x + b = 0$ descreve uma reta, um plano ou um hiperplano no espaço dos atributos, e é ela que separa as duas classes. Tudo o que a sigmoide faz é converter a distância até essa fronteira numa probabilidade.
>
> Isso também explica por que a regressão logística é um classificador **linear**: a fronteira é linear, mesmo com a saída sendo curva. O que a sigmoide curva é a leitura, não a separação.
> **volte para:** #fundamentos-a-sigmoide-e-o-logito
:::

:::exercicio {"id":"regressao-logistica-e5","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Um analista escreve no relatório: "cada ano a mais de relacionamento aumenta a probabilidade de renovação em 4 pontos percentuais, segundo o coeficiente do modelo". Qual é o problema da frase?

- [ ] Nenhum, desde que o coeficiente tenha sido convertido corretamente.
- [x] O efeito constante é sobre o logito, e o efeito em pontos percentuais depende de onde o cliente estava: perto de 0,5 o deslocamento é grande, perto de 0 ou de 1 é quase nulo.
- [ ] O erro é usar pontos percentuais em vez de porcentagem relativa.
- [ ] O erro é que o coeficiente mede correlação, e correlação não se reporta a clientes.

> **gabarito:** o efeito em pontos percentuais depende de onde o cliente estava
> **porque:** O que é linear nos atributos é o logito, então o incremento constante acontece lá. A sigmoide é íngreme no meio e achatada nas pontas, e é isso que faz o mesmo deslocamento de logito valer muitos pontos percentuais perto de 0,5 e quase nada perto dos extremos.
>
> A frase do analista só pode ser verdadeira **num ponto específico**, e ele não disse qual. Um cliente com probabilidade de renovação de 0,95 não ganha 4 pontos com mais um ano; ele ganha uma fração disso.
>
> A terceira alternativa parece corrigir a unidade e não toca no problema: nem porcentagem relativa nem pontos percentuais são constantes ao longo da curva. O erro não é de unidade, é de supor constante o que só é constante na escala do logito.
> **volte para:** #fundamentos-a-sigmoide-e-o-logito
:::

## Por que a perda muda, e por que a solução fechada some

O [capítulo II.2](ii-2-modelos-lineares.md#a-deducao-em-cinco-passos) deduziu a reta ótima em cinco passos, e o quarto entregou uma fórmula. Aqui o mesmo caminho **não chega ao fim** — e vale entender onde ele para.

**Primeiro, a perda.** Usar erro quadrático sobre a saída da sigmoide dá uma superfície **não convexa**: aparecem mínimos locais, e o otimizador pode parar num deles. A perda usada é a **entropia cruzada** (ou *log-loss*):

$$L = -\frac{1}{n}\sum_{i=1}^{n}\left[y_i \log p_i + (1 - y_i)\log(1 - p_i)\right]$$

Ela é convexa em $w$, e tem uma leitura direta: pune **muito** a previsão confiante e errada. Prever 0,99 para quem era 0 custa $\log(0{,}01)$ — um número grande. Prever 0,5 custa pouco em comparação. O modelo aprende a ter medo de errar com convicção, que é exatamente o comportamento que se quer de uma probabilidade que vai virar decisão.

**Segundo, o que some.** Derivando a entropia cruzada e igualando a zero, chega-se a

$$\sum_{i=1}^{n}\left(\sigma(w \cdot x_i + b) - y_i\right)x_i = 0$$

que tem a **mesma forma** da condição do capítulo II.2 — resíduo ortogonal ao atributo. Só que aqui o "resíduo" contém $\sigma(\cdot)$, e $w$ está **dentro** de uma função não linear. Não há como isolar $w$: o sistema é transcendental.

É por isso que a logística **não tem** equações normais, e o gradiente deixa de ser uma alternativa elegante para virar a única saída. A frase do capítulo II.2, *"o gradiente é a ferramenta geral; a solução fechada é o caso de sorte"*, recebe aqui a sua demonstração.

:::exercicio {"id":"regressao-logistica-e3","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Por que a regressão logística não tem solução fechada, como a linear tem?

- [ ] Porque a entropia cruzada não é diferenciável.
- [ ] Porque o problema não é convexo, e por isso não há mínimo único.
- [x] Porque, ao anular a derivada, os pesos ficam presos dentro da sigmoide — e o sistema resultante não é linear nos pesos.
- [ ] Porque a solução fechada exigiria inverter uma matriz singular.

> **gabarito:** Os pesos ficam presos dentro da sigmoide
> **porque:** A condição de otimalidade tem a mesma forma da linear — soma de (previsto − observado) vezes o atributo, igual a zero. A diferença é que "previsto" aqui é σ(w·x + b): o peso está **dentro** de uma função não linear, e não há álgebra que o isole. O sistema é transcendental, e se resolve por iteração.
>
> As duas primeiras alternativas invertem os fatos: a entropia cruzada **é** diferenciável, e o problema **é** convexo — há mínimo único, e é justamente por isso que o gradiente funciona bem aqui. A quarta confunde com um problema numérico da regressão linear (colinearidade perfeita torna a matriz singular), que é outra história.
> **volte para:** #por-que-a-perda-muda-e-por-que-a-solucao-fechada-some
:::

:::exercicio {"id":"regressao-logistica-e6","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Por que a regressão logística usa entropia cruzada em vez de erro quadrático?

- [ ] Porque o erro quadrático não pode ser calculado sobre probabilidades.
- [x] Porque o erro quadrático sobre a saída da sigmoide dá uma superfície não convexa, com mínimos locais em que o otimizador pode parar.
- [ ] Porque a entropia cruzada tem solução fechada e o erro quadrático não.
- [ ] Porque a entropia cruzada é mais rápida de calcular.

> **gabarito:** o erro quadrático sobre a sigmoide não é convexo
> **porque:** A escolha é sobre a **forma da superfície de otimização**, não sobre a fórmula ser calculável. Erro quadrático sobre a saída da sigmoide produz mínimos locais, e um otimizador que cai num deles para longe da melhor solução, sem avisar.
>
> A entropia cruzada é convexa em $w$, o que dá mínimo único e faz o gradiente funcionar de forma previsível. A terceira alternativa inverte um fato importante do capítulo: **nenhuma** das duas tem solução fechada aqui.
>
> E ela tem uma segunda virtude, que é comportamental: pune muito a previsão confiante e errada. O modelo aprende a ter medo de errar com convicção, que é o que se quer de uma probabilidade destinada a virar decisão.
> **volte para:** #por-que-a-perda-muda-e-por-que-a-solucao-fechada-some
:::

:::exercicio {"id":"regressao-logistica-e7","tipo":"multipla-multi","objetivo":"O3","dificuldade":"dificil"}
Sobre a entropia cruzada e a condição de otimalidade da logística, quais afirmações são corretas? (marque todas que valem)

- [x] A condição tem a mesma forma da linear: o resíduo fica ortogonal ao atributo.
- [x] O que impede isolar $w$ é ele estar dentro da sigmoide, o que torna o sistema transcendental.
- [x] Prever 0,99 para um exemplo de classe 0 custa muito mais que prever 0,5.
- [ ] Como não há solução fechada, o problema pode ter vários mínimos e o resultado depende da inicialização.

> **gabarito:** mesma forma da condição linear · $w$ preso na sigmoide · previsão confiante e errada é cara
> **porque:** As três corretas contam a mesma história em três níveis: a álgebra chega ao mesmo tipo de condição do capítulo II.2, para no mesmo lugar por um motivo estrutural, e a perda escolhida tem uma consequência de comportamento.
>
> A alternativa errada é a mais instrutiva, porque junta dois fatos verdadeiros numa conclusão falsa. É verdade que não há solução fechada, e é verdade que problemas não convexos dependem da inicialização — só que a entropia cruzada **é** convexa. Ausência de fórmula fechada e presença de mínimos locais são coisas independentes, e confundi-las é o que faz alguém desconfiar do resultado de uma logística sem motivo.
>
> A frase do capítulo II.2 recebe aqui a demonstração: o gradiente é a ferramenta geral, e a solução fechada era o caso de sorte.
> **volte para:** #por-que-a-perda-muda-e-por-que-a-solucao-fechada-some
:::

## Interpretar o coeficiente: chance, não probabilidade

Uma definição antes da leitura, porque a palavra trabalha contra o capítulo. A **chance** (*odds*) de um evento é a razão entre a probabilidade de ele ocorrer e a de não ocorrer, $p/(1-p)$: probabilidade 0,5 é chance 1 — "um para um"; probabilidade 0,9 é chance 9. **No português do dia a dia, "chance" é sinônimo de probabilidade. Aqui não é, e essa é justamente a distinção que o capítulo existe para ensinar.** A **razão de chances** é o quociente entre duas chances.

Aumentar $x_j$ em uma unidade **multiplica a chance** por $e^{w_j}$ — ou seja, produz uma razão de chances de $e^{w_j}$.

Um coeficiente de 0,7 significa chance multiplicada por $e^{0{,}7} \approx 2$ — **a chance dobra**. Não a probabilidade: a chance.

A diferença é grande e é onde os relatórios erram:

| Probabilidade antes | Chance antes | Chance depois (× 2) | Probabilidade depois |
|---|---|---|---|
| 0,10 | 0,11 | 0,22 | **0,18** |
| 0,50 | 1,00 | 2,00 | **0,67** |
| 0,90 | 9,00 | 18,00 | **0,95** |

O mesmo coeficiente move a probabilidade em 8, 17 e 5 pontos percentuais, dependendo de onde se estava. Por isso "este atributo aumenta o risco em X pontos" é uma frase sem sentido fora de um ponto específico.

E tudo o que o [capítulo II.2](ii-2-modelos-lineares.md#as-quatro-coisas-que-ele-nao-diz) diz sobre o que o coeficiente **não** significa continua valendo aqui, palavra por palavra: não é causa, não é comparável sem padronização, não é estável sob colinearidade e não vale fora da faixa observada.

:::exercicio {"id":"regressao-logistica-e2","tipo":"multipla-multi","objetivo":"O2","dificuldade":"dificil"}
Um modelo de risco de crédito, com atributos padronizados, tem coeficiente 0,7 para `dívida_atual`. Quais leituras são **corretas**? (marque todas que valem)

- [x] Um desvio-padrão a mais de dívida multiplica a razão de chances de inadimplência por aproximadamente 2.
- [ ] Um desvio-padrão a mais de dívida aumenta a probabilidade de inadimplência em 70 pontos percentuais.
- [ ] Reduzir a dívida do cliente reduziria o risco dele na proporção do coeficiente.
- [x] Se `dívida_atual` for muito correlacionada com `renda_comprometida`, este coeficiente pode ser instável entre reamostragens.
- [ ] Como o coeficiente é o maior do modelo, dívida é a causa principal da inadimplência.

> **gabarito:** multiplica a razão de chances por ~2 · pode ser instável sob colinearidade
> **porque:** A primeira correta é a leitura literal: e^0,7 ≈ 2,01, e o efeito é sobre a **razão de chances**, não sobre a probabilidade. A segunda correta é o alerta de colinearidade — dois atributos que medem quase a mesma coisa dividem o crédito de forma arbitrária, e a divisão muda com pequenas variações nos dados sem que a métrica piore.
>
> As três erradas são os três erros clássicos, nesta ordem de frequência: confundir logito com probabilidade (70 pontos percentuais é impossível — sequer respeita o intervalo [0,1]); ler correlação como intervenção ("reduzir a dívida reduziria o risco" é uma afirmação causal que o modelo não sustenta); e tratar magnitude de coeficiente como importância causal. As três aparecem em relatórios reais, e a terceira costuma aparecer no slide de recomendação.
> **volte para:** #interpretar-o-coeficiente-chance-nao-probabilidade
:::

:::exercicio {"id":"regressao-logistica-e8","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
A probabilidade de um evento é 0,80. Qual é a **chance** (*odds*) dele?

> **gabarito:** 4
> **porque:** Chance é $p/(1-p) = 0{,}80/0{,}20 = \mathbf{4}$, lida como "quatro para um".
>
> A conta é trivial e a palavra não é. No português do dia a dia "chance" é sinônimo de probabilidade, e aqui não é — é essa confusão que o capítulo existe para desfazer. Probabilidade vive entre 0 e 1; chance vai de 0 a infinito, e passa por 1 exatamente quando a probabilidade é 0,5.
>
> Guardar a conversão nos dois sentidos evita o erro dos relatórios. De chance para probabilidade: $p = \text{chance}/(1 + \text{chance})$, que aqui devolve $4/5 = 0{,}80$.
> **volte para:** #interpretar-o-coeficiente-chance-nao-probabilidade
:::

:::exercicio {"id":"regressao-logistica-e9","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Um coeficiente vale 0,7, e portanto multiplica a chance por aproximadamente 2. Dois clientes recebem o mesmo aumento de um desvio-padrão nesse atributo: um estava com probabilidade 0,10 e o outro com 0,90. O que acontece com cada um?

- [ ] Os dois sobem 20 pontos percentuais, porque o efeito do coeficiente é o mesmo.
- [x] O primeiro vai a 0,18 e o segundo a 0,95: mesmo efeito sobre a chance, efeitos muito diferentes sobre a probabilidade.
- [ ] O primeiro vai a 0,20 e o segundo a 1,80, que é impossível e mostra que o modelo falhou.
- [ ] Nada muda para o segundo, porque a probabilidade já está saturada.

> **gabarito:** 0,18 e 0,95
> **porque:** A conta se faz na escala da chance. O primeiro tem chance $0{,}10/0{,}90 \approx 0{,}11$, que dobrada vira $0{,}22$, e de volta para probabilidade dá $0{,}22/1{,}22 \approx \mathbf{0{,}18}$. O segundo tem chance 9, que dobrada vira 18, e volta como $18/19 \approx \mathbf{0{,}95}$.
>
> Oito pontos percentuais para um, cinco para o outro, com o mesmo coeficiente. É por isso que "este atributo aumenta o risco em X pontos" é uma frase sem sentido fora de um ponto específico.
>
> A terceira alternativa mostra o que acontece quando alguém aplica o multiplicador direto na probabilidade: 1,80 não é um número que a probabilidade possa assumir. O absurdo é útil — ele denuncia o erro na hora, e é justamente por isso que ele é menos perigoso que o da primeira alternativa, que produz números plausíveis e errados.
> **volte para:** #interpretar-o-coeficiente-chance-nao-probabilidade
:::

## Mão na massa

A **etapa 05–06** do [`ml-zero`](../trilha-ml-zero.md) traz `RegressaoLogistica` em biblioteca padrão, com regularização L1 e L2 e leitura por `razao_de_chances()`. O otimizador é o mesmo da linear — só a função de perda muda, que é o ponto da arquitetura do [capítulo II.4](ii-4-otimizacao.md).

**Notebook** — [`regressao_limonada.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb) cobre a linear. Um notebook próprio para a logística está na fila; enquanto isso, o caminho é importar `RegressaoLogistica` da mesma etapa e ajustar contra um rótulo binário.

## Assista

:::video {"id":"regressao-logistica-v1","fonte":"youtube","ref":"yIYKR4sgzI8","min":9,"autor":"StatQuest with Josh Starmer","titulo":"StatQuest: Logistic Regression"}
O que o texto explica algebricamente (a sigmoide comprimindo a reta, o logito voltando a ser linear) o vídeo mostra **geometricamente**, com a curva em S sendo ajustada aos pontos. Se a frase "o que é linear é o logito, não a probabilidade" ainda parece um detalhe técnico, este é o material que a transforma em imagem. Assista antes do exercício regressao-logistica-e2.
:::

## Síntese — o que levar

- A logística **classifica**. O nome vem de modelar o **logito** com uma regressão linear.
- Teto e piso não são impostos ao modelo: são **consequência** de transformar a saída. Quando a resposta tem fronteiras e o modelo não, mude a escala da resposta.
- A perda é **entropia cruzada**, não erro quadrático — por convexidade, e porque punir a confiança errada é o comportamento desejado.
- **Não há solução fechada**: ao anular a derivada, o peso fica preso dentro da sigmoide.
- O coeficiente multiplica a **razão de chances** por $e^{w}$. O efeito em pontos percentuais depende de onde se estava.

## Verificação

1. Explique por que a regressão logística tem "regressão" no nome, sem usar a palavra "sigmoide".
2. Um coeficiente vale 1,1. Um colega diz que o atributo "aumenta o risco em 110%". O que está errado na frase, e qual seria a correta?
3. Por que usar erro quadrático com a sigmoide é uma má ideia — e qual das duas razões (convexidade ou punição do erro confiante) você considera a mais grave?
4. Onde exatamente a dedução do capítulo II.2 para de funcionar aqui?
