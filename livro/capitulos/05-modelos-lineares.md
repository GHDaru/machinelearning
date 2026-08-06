# 05 — Modelos Lineares

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-05 · [histórico](../HISTORICO.md)

## Objetivos de aprendizagem

- **O1.** Derivar a regressão linear como minimização do erro quadrático.
- **O2.** Explicar por que a regressão logística é um modelo de classificação apesar do nome.
- **O3.** Interpretar os coeficientes de um modelo linear — e dizer o que eles **não** significam.
- **O4.** Reconhecer as situações em que o modelo linear é a escolha certa, não a escolha simplória.

## O problema: o modelo que todo mundo aprende e quase ninguém respeita

O [capítulo 07](07-arvores-ensembles.md) mostrou o modelo linear perdendo feio: 0,4963 de AUC contra 0,9392 do boosting. Se você leu aquele capítulo primeiro, saiu dele com a impressão de que linear é o modelo dos iniciantes.

É a impressão errada, e este capítulo existe para corrigi-la. Naquele experimento, o dado foi **construído** com uma fronteira irregular — o terreno onde a reta não tem chance. Troque o terreno e a conclusão vira:

- com **poucos dados por atributo**, o linear frequentemente ganha, porque tem menos o que estimar errado;
- quando a decisão precisa ser **auditada**, ele é o único que entrega um número por atributo que alguém consegue defender numa reunião;
- quando a saída vira **probabilidade que multiplica dinheiro**, ele nasce razoavelmente calibrado, enquanto ensembles precisam de correção posterior (cap. 04).

E há a razão pedagógica: é no modelo linear que otimização, regularização e interpretação aparecem na forma mais limpa. Quem não entende gradiente aqui não vai entender numa rede de doze camadas.

## Fundamentos: regressão linear como minimização

O modelo é uma reta (ou um plano, ou um hiperplano):

$$\hat{y} = w_1x_1 + w_2x_2 + \dots + w_dx_d + b$$

Resta escolher os $w$. O critério: minimizar a soma dos erros ao quadrado.

$$L(w, b) = \frac{1}{2n}\sum_{i=1}^{n}\left(\hat{y}_i - y_i\right)^2$$

Por que ao quadrado, e não em valor absoluto? Três razões, em ordem de honestidade:

1. **É diferenciável em todo ponto**, o que faz o otimizador funcionar sem casos especiais. O valor absoluto tem um bico em zero.
2. **Tem solução fechada.** Derivando e igualando a zero, chega-se às *equações normais* — um sistema linear que se resolve de uma vez, sem iteração.
3. **Pune o erro grande desproporcionalmente**, o que às vezes é o que você quer e às vezes não é. Se houver *outliers*, o erro quadrático os persegue — e aí o erro absoluto é a escolha certa. Esta é uma decisão de modelagem, não uma constante da natureza.

A solução fechada existe e está implementada na [etapa 05](../trilha-ml-zero.md), em 25 linhas de eliminação de Gauss. Vale conferir: **gradiente e solução fechada chegam ao mesmo lugar** — no experimento, com diferença menor que 0,05 em cada coeficiente. Isso desmistifica o gradiente, que passa a ser *um jeito* de resolver, não *o* jeito.

> Se a solução fechada existe e é exata, por que usar gradiente? Porque ela envolve inverter uma matriz $d \times d$ — inviável com muitos atributos — e porque ela **não existe** para a regressão logística, que vem a seguir. O gradiente é a ferramenta geral; a solução fechada é o caso de sorte.

:::exercicio {"id":"05-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Por que a regressão linear minimiza o erro **ao quadrado** em vez do erro absoluto?

- [ ] Porque o erro quadrático é sempre menor que o absoluto.
- [x] Porque é diferenciável em todo ponto e admite solução fechada — não porque seja intrinsecamente mais correto.
- [ ] Porque o erro absoluto não pode ser minimizado.
- [ ] Porque o quadrado elimina os erros negativos, e o valor absoluto não.

> **gabarito:** É diferenciável e admite solução fechada
> **porque:** As razões são de **conveniência matemática**, e reconhecer isso é o que separa quem usa o método de quem o repete. O quadrado é diferenciável em toda parte (o valor absoluto tem um bico em zero, que complica o otimizador) e leva às equações normais, resolvíveis de uma vez.
>
> Não é que ele seja mais correto. Ele pune erros grandes de forma desproporcional, o que na presença de *outliers* é ativamente ruim — e nesse caso o erro absoluto é a escolha certa, à custa de exigir otimização iterativa. A última alternativa erra num detalhe revelador: o valor absoluto **também** elimina o sinal do erro. Eliminar sinal não é o ponto; a diferenciabilidade é.
> **volte para:** #fundamentos-regressao-linear-como-minimizacao
:::

## Regressão logística: o nome atrapalha

A regressão logística **classifica**. O nome vem de uma pergunta razoável mal resolvida.

A ideia ingênua seria usar regressão linear para prever a classe (0 ou 1). Não funciona: a reta prevê 1,7 e −0,4, que não são probabilidades. A saída precisa estar em $[0,1]$.

A solução é passar a saída linear por uma função que comprima a reta inteira nesse intervalo — a **sigmoide**:

$$p = \sigma(z) = \frac{1}{1 + e^{-z}}, \qquad z = w \cdot x + b$$

Aqui está o ponto que dá nome ao modelo. Invertendo:

$$z = \log\frac{p}{1-p}$$

O que é linear nos atributos **não é a probabilidade** — é o **logito**, o logaritmo da razão de chances. A regressão logística é uma regressão linear *sobre o logito*, usada para classificar.

Essa distinção não é preciosismo. Ela determina como se lê um coeficiente, que é o assunto da próxima seção e a fonte de mais erros de interpretação em relatórios do que qualquer outro tópico deste livro.

:::exercicio {"id":"05-e2","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Numa regressão logística, o que é linear nos atributos?

- [ ] A probabilidade prevista.
- [x] O logito — o logaritmo da razão de chances.
- [ ] A classe prevista (0 ou 1).
- [ ] O erro de classificação.

> **gabarito:** O logito
> **porque:** O modelo calcula z = w·x + b (linear) e depois aplica a sigmoide para chegar à probabilidade. A sigmoide é **não linear** — é justamente ela que comprime a reta inteira no intervalo [0,1]. Portanto a probabilidade *não* é linear nos atributos; o logito é.
>
> A consequência prática aparece nos extremos. Um aumento de uma unidade num atributo muda o logito sempre na mesma quantidade, mas muda a **probabilidade** muito perto de 0,5 e quase nada perto de 0 ou de 1. Por isso "este atributo aumenta a chance em 3 pontos percentuais" é uma frase que só pode ser verdadeira num ponto específico, nunca em geral.
> **volte para:** #regressao-logistica-o-nome-atrapalha
:::

## Interpretar coeficientes — e o que eles não dizem

O modelo linear é interpretável, e é por isso que ele sobrevive em crédito, seguro e saúde. Mas "interpretável" não significa "fácil de interpretar corretamente".

### O que o coeficiente diz

Na **regressão linear**: aumentar $x_j$ em uma unidade muda $\hat{y}$ em $w_j$ unidades, mantendo os demais atributos constantes.

Na **logística**: aumentar $x_j$ em uma unidade multiplica a **razão de chances** por $e^{w_j}$. Um coeficiente de 0,7 significa chance multiplicada por $e^{0,7} \approx 2$ — a chance dobra. Não a probabilidade: a chance.

### As quatro coisas que ele não diz

1. **Não diz causalidade.** "Mantendo tudo mais constante" é uma operação matemática sobre a equação ajustada, não uma intervenção no mundo. Se você mudar $x_j$ de fato, as outras variáveis mudam junto — e o modelo não sabe disso.
2. **Não é comparável entre atributos sem padronização.** Um coeficiente de 0,003 para renda em reais e 2,5 para número de filhos não diz que filhos importam mais. Compare coeficientes só depois de padronizar — e mesmo assim com cuidado.
3. **Não é confiável sob colinearidade.** Quando dois atributos são altamente correlacionados, o modelo pode dar peso alto a um e negativo ao outro, ou trocá-los completamente com uma pequena mudança nos dados. O *erro* não piora; a *interpretação* vira ruído. É o modo de falha mais traiçoeiro do modelo linear, porque a métrica não avisa.
4. **Não vale fora da faixa observada.** Extrapolar uma reta é a forma mais fácil de produzir uma previsão absurda com aparência de rigor.

:::exercicio {"id":"05-e3","tipo":"multipla-multi","objetivo":"O3","dificuldade":"dificil"}
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
> **volte para:** #as-quatro-coisas-que-ele-nao-diz
:::

## Quando o linear é a escolha certa

Não como consolo, e sim como decisão de engenharia:

| Situação | Por quê |
|---|---|
| **Poucos dados por atributo** | menos parâmetros, menos variância. Com 200 linhas e 50 colunas, o ensemble decora |
| **Necessidade de auditoria** | um número por atributo, defensável e questionável. Exigência regulatória em crédito e seguro |
| **Probabilidade que vira dinheiro** | sai razoavelmente calibrado; ensembles frequentemente não (cap. 04) |
| **Linha de base obrigatória** | é a régua contra a qual o modelo complexo precisa se justificar |
| **Latência apertada** | uma multiplicação de vetores; ordens de grandeza mais rápido que uma floresta |

O último ponto tem um corolário que vale sozinho: **sempre treine um linear primeiro**. Ele custa minutos e responde à pergunta que importa antes de qualquer outra — "quanto do sinal é simplesmente linear?". Se o modelo complexo ganha pouco dele, você acabou de descobrir que o problema é fácil e que o resto é custo de manutenção.

## Mão na massa

A **etapa 05–06** do [`ml-zero`](../trilha-ml-zero.md) implementa, em biblioteca padrão:

- `RegressaoLinear` com **os dois caminhos** — solução fechada por eliminação de Gauss e gradiente — para você conferir que chegam ao mesmo lugar;
- `RegressaoLogistica` com regularização L1 e L2 e leitura por `razao_de_chances()`;
- `Padronizador` que aprende no treino e **aplica** ao teste — o vazamento do capítulo 02 tornado difícil de cometer.

Uma etapa para dois capítulos, porque são o mesmo objeto por dois ângulos: o 05 pergunta *que função o modelo representa*; o 06, *como se chega aos coeficientes*.

## Assista

:::video {"id":"05-v1","fonte":"youtube","ref":"yIYKR4sgzI8","min":9,"autor":"StatQuest with Josh Starmer","titulo":"StatQuest: Logistic Regression"}
O que o texto acima explica algebricamente — a sigmoide comprimindo a reta, o logito voltando a ser linear — o vídeo mostra **geometricamente**, com a curva em S sendo ajustada aos pontos. Se a frase "o que é linear é o logito, não a probabilidade" ainda parece um detalhe técnico, este é o material que a transforma em imagem. Assista antes do exercício 05-e3.
:::

## Síntese — o que levar

- Regressão linear minimiza **erro quadrático** — por diferenciabilidade e solução fechada, não por ser intrinsecamente mais correto.
- Gradiente e solução fechada chegam ao mesmo lugar. O gradiente é a ferramenta **geral**; a fechada é o caso de sorte.
- Na logística, o que é linear é o **logito**. O coeficiente multiplica a **razão de chances** por $e^{w}$.
- Coeficiente **não** é causa, **não** é comparável sem padronização, **não** é estável sob colinearidade, e **não** vale fora da faixa observada.
- Treine sempre um linear primeiro. Ele responde "quanto do sinal é simplesmente linear?" em minutos.

## Verificação

1. Explique a um colega por que a regressão logística tem "regressão" no nome, sem usar a palavra "sigmoide".
2. Você tem 180 linhas e 60 atributos. Que família de modelo você tenta primeiro, e por quê?
3. Dois atributos do seu modelo são quase idênticos. O erro de validação está ótimo. O que pode estar errado mesmo assim?
