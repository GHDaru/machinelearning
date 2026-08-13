# II.2 — Modelos Lineares

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-05 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Derivar a regressão linear como minimização do erro quadrático.
- **O2.** Obter as equações normais da reta e calcular a inclinação e o intercepto ótimos.
- **O3.** Interpretar os coeficientes de um modelo linear — e dizer o que eles **não** significam.
- **O4.** Reconhecer as situações em que o modelo linear é a escolha certa, não a escolha simplória.

> **Este capítulo trata só de regressão linear.** A **regressão logística** — que tem "regressão" no nome e classifica — ganhou capítulo próprio: [II.3 — Regressão Logística](ii-3-regressao-logistica.md). Compartilham a forma `w·x + b` e quase nada além disso: perdas diferentes, saídas em unidades diferentes, e uma tem solução fechada enquanto a outra não tem.

## O problema: o modelo que todo mundo aprende e quase ninguém respeita

Um banco precisa negar um crédito e **explicar por quê**. A lei exige a explicação, o cliente exige a explicação, e o auditor vai pedir a conta.

O modelo campeão do concurso interno — quinhentas árvores somadas — dá a melhor previsão da casa e não produz **uma única frase** que caiba na carta de recusa. Ele acerta mais e não serve.

É aqui que o modelo linear volta ao jogo, e não por caridade: ele entrega **um número por atributo**, e um número por atributo é uma frase. Some-se a isso o que raramente se diz em voz alta:

- com **poucos dados por atributo**, o linear frequentemente ganha, porque tem menos o que estimar errado;
- quando a saída vira **probabilidade que multiplica dinheiro**, ele nasce razoavelmente calibrado, enquanto ensembles precisam de correção posterior ([capítulo II.1](ii-1-avaliacao.md));
- quando a decisão precisa ser **auditada**, ele é o único que alguém consegue defender numa reunião.

Guarde a cena, porque o capítulo vai cobrar o outro lado: **essa transparência tem preço, e o preço é mais alto do que parece.** Um coeficiente é fácil de ler e fácil de ler errado — e a segunda metade deste capítulo é sobre isso.

E há a razão pedagógica: é no modelo linear que otimização, regularização e interpretação aparecem na forma mais limpa. Quem não entende gradiente aqui não vai entender numa rede de doze camadas.

## De onde isto veio

**O aperto.** Virada do século XVIII para o XIX, astronomia. Um cometa ou um planeta é observado várias vezes, por instrumentos diferentes, em noites diferentes — e **nenhuma das observações concorda com as outras**. A órbita verdadeira é uma só; os dados são muitos e discordantes. O astrônomo precisa de **uma** curva, e não tem critério defensável para escolhê-la.

**O que se fazia antes.** Escolhia-se a olho, descartava-se a observação que parecia pior, ou faziam-se médias de subconjuntos convenientes. Todos os caminhos tinham o mesmo defeito: **dois astrônomos competentes, com os mesmos dados, chegavam a órbitas diferentes** — e não havia como decidir quem estava certo.

**A virada.** Trocar "a melhor curva" por **uma regra explícita do que significa melhor**: aquela que torna mínima a soma dos quadrados dos desvios. A regra não é mais verdadeira que as outras — ela é **pública**. Dados os mesmos números, devolve a mesma resposta para qualquer pessoa.

**A ideia reaproveitável.** **Uma função de perda é um critério de arbitragem, não uma descoberta sobre o mundo.** Ela existe para tornar a escolha reproduzível e discutível. É por isso que a pergunta "por que erro *quadrático*, e não valor absoluto?" tem resposta honesta — conveniência matemática mais uma hipótese sobre o ruído — e não a resposta "porque é o certo". Trocar a perda é trocar o critério de arbitragem: decisão de projeto, nunca detalhe técnico.

**O nome.** *Mínimos quadrados* — *moindres carrés* — foi batizado por Legendre, e o nome é literalmente a definição do critério.

### A disputa de prioridade mais famosa da estatística

**Legendre publicou primeiro**, em **1805**, em *Nouvelles méthodes pour la détermination des orbites des comètes*, e deu ao método o nome que ficou. **Gauss publicou em 1809** (*Theoria motus corporum coelestium*) afirmando **usar o método desde 1795**.

Legendre reagiu mal, e o argumento dele é o que interessa aqui: **prioridade se estabelece por publicação**. Em 1820 atacou publicamente a reivindicação. Gauss entendia prioridade como *ser o primeiro a descobrir*, e apoiava-se em registros privados e correspondência — Olbers (1816) e Bessel (1832) publicaram notas confirmando ter visto o método com ele antes. A avaliação histórica moderna é que Gauss provavelmente **tinha** o método antes e **falhou em comunicá-lo**.

> **O espelho disto está no [capítulo III.1](iii-1-neuronio-artificial.md).** Lá, quem leva o crédito pelo backpropagation são os últimos (Rumelhart *et al.*, 1986), não o primeiro (Linnainmaa, 1970), e Schmidhuber resume: *não é o primeiro inventor que leva o crédito, é o último reinventor*. Aqui o caso é o inverso exato — o primeiro descobridor perde para o primeiro **publicador**.
>
> Juntos, os dois dizem o que nenhum diz sozinho: **crédito não segue descoberta, segue comunicação.** Vale para o seu trabalho: o experimento que você não registrou, datou e tornou reproduzível é, na prática, um experimento que não aconteceu. É a razão de este livro exigir script, *seed* e saída colada — e não é burocracia.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Legendre (1805) e Gauss (1809): obra, ano e conteúdo geral. Nenhuma das duas lida no original |
| ✓ᵐ | [Stigler, "Gauss and the Invention of Least Squares", *Annals of Statistics*, 1981](https://projecteuclid.org/journals/annals-of-statistics/volume-9/issue-3/Gauss-and-the-Invention-of-Least-Squares/10.1214/aos/1176345451.full) — localizado e identificado, **não lido** |
| ⏳ | As notas de Olbers (1816) e Bessel (1832), e o ataque público de Legendre em 1820 |
| ⏳ | A avaliação de que Gauss tinha o método antes mas falhou em comunicá-lo |
| 📖 | A ideia reaproveitável ("perda é critério de arbitragem") e a ligação com o capítulo III.1 |

## Fundamentos: regressão linear como minimização

O modelo é uma reta (ou um plano, ou um hiperplano):

$$\hat{y} = w_1x_1 + w_2x_2 + \dots + w_dx_d + b$$

Aqui $\hat{y}$ é a previsão do modelo e $y$ o valor observado — **o chapéu marca sempre o que o modelo produz, e sem chapéu é o que o mundo entregou**. São $n$ exemplos e $d$ atributos.

Resta escolher os $w$. O critério: minimizar o **erro quadrático médio**, o **EQM**:

$$L(w, b) = \frac{1}{n}\sum_{i=1}^{n}\left(y_i - \hat{y}_i\right)^2$$

> **Duas convenções que você vai encontrar por aí, e por que elas não mudam nada.** Muito texto escreve $\frac{1}{2n}$ em vez de $\frac{1}{n}$ — o meio existe só para cancelar o 2 que aparece ao derivar, e deixar a conta mais limpa. Outros omitem o $\frac{1}{n}$ e minimizam a **soma** (o SQE) em vez da média.
>
> **Multiplicar a perda por uma constante positiva não move o ponto de mínimo.** A reta ótima é a mesma nas três escalas; o que muda é o número que aparece no painel. Este livro usa o **EQM** — $\frac{1}{n}$, sem o meio — em todo lugar: no texto, na dedução e no laboratório.

Por que ao quadrado, e não em valor absoluto? Três razões, em ordem de honestidade:

1. **É diferenciável em todo ponto**, o que faz o otimizador funcionar sem casos especiais. O valor absoluto tem um bico em zero.
2. **Tem solução fechada.** Derivando e igualando a zero, chega-se às *equações normais* — um sistema linear que se resolve de uma vez, sem iteração.
3. **Pune o erro grande desproporcionalmente**, o que às vezes é o que você quer e às vezes não é. Se houver *outliers*, o erro quadrático os persegue — e aí o erro absoluto é a escolha certa. Esta é uma decisão de modelagem, não uma constante da natureza.

A solução fechada existe e está implementada na [etapa 05](../trilha-ml-zero.md), em 25 linhas de eliminação de Gauss. Vale conferir: **gradiente e solução fechada chegam ao mesmo lugar** — no experimento, com diferença menor que 0,05 em cada coeficiente. Isso desmistifica o gradiente, que passa a ser *um jeito* de resolver, não *o* jeito.

> Se a solução fechada existe e é exata, por que usar gradiente? Porque ela envolve inverter uma matriz $d \times d$ — inviável com muitos atributos — e porque ela **não existe** para a regressão logística ([capítulo II.3](ii-3-regressao-logistica.md)). O gradiente é a ferramenta geral; a solução fechada é o caso de sorte.

:::exercicio {"id":"modelos-lineares-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
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

## Ponha a reta à mão

Antes da fórmula, o gesto. Arraste a reta até achar que está boa, e olhe o número subir e descer enquanto você mexe.

:::lab {"id":"modelos-lineares-l1","tipo":"regressao-linear","titulo":"Mínimos quadrados à mão","n":24,"a":1.8,"b":4,"ruido":3.2}
Cada segmento cinza é um **resíduo**: a distância vertical de um ponto até a **sua** reta. O laboratório mostra cinco medidas de erro ao mesmo tempo, e marca **uma** como a que estamos minimizando.

Três coisas para tentar, nesta ordem:

1. **Minimize no olho.** Arraste as alças até o **erro quadrático médio (EQM)** parar de cair. Anote o valor.
2. **Ligue "Mostrar os quadrados".** Agora o erro tem área: cada quadrado tem lado igual ao resíduo, e o que você está minimizando é a **soma das áreas**. Repare no que acontece quando um único ponto fica longe.
3. **Revele a reta ótima.** A distância entre a sua e a dela é o preço do olho. Depois clique em "Ajustar automaticamente" e compare os coeficientes com o que você tinha.

Uma pergunta para levar para a próxima seção: **por que existe uma reta ótima única, e como o computador a encontra sem tentar todas?**
:::

## A dedução, em cinco passos

O laboratório mostrou que existe um fundo do poço. Esta seção mostra **por que ele existe e como chegar nele por conta**, sem tentativa e erro. É a diferença entre usar a fórmula e saber de onde ela vem.

Com um só atributo o índice atrapalha mais do que ajuda, então escrevemos $a$ no lugar de $w_1$: a reta é $\hat{y} = ax + b$. O critério é o mesmo EQM de antes, com a mesma ordem do resíduo:

$$L(a, b) = \frac{1}{n}\sum_{i=1}^{n}\left(y_i - ax_i - b\right)^2$$

**Passo 1 — por que há um mínimo, e um só.** $L$ é uma soma de quadrados: é uma superfície convexa em $(a, b)$, uma tigela. Tigela tem um fundo, e só um. É a razão de o laboratório sempre convergir para a mesma reta, venha você por onde vier.

**Passo 2 — no fundo, as derivadas se anulam.** Derivando em relação a $b$:

$$\frac{\partial L}{\partial b} = -2\sum_{i=1}^{n}\left(y_i - ax_i - b\right) = 0 \;\Longrightarrow\; \sum_{i=1}^{n} r_i = 0$$

onde $r_i = y_i - ax_i - b$ é o resíduo. **A soma dos resíduos é zero.** Dividindo por $n$: $\bar{y} = a\bar{x} + b$, ou seja,

$$b = \bar{y} - a\bar{x}$$

**A reta ótima passa pelo centro de massa dos dados** — sempre, em qualquer conjunto. É um resultado que se vê no laboratório: gire a reta ótima em torno de um ponto e ele será $(\bar{x}, \bar{y})$.

**Passo 3 — a segunda condição.** Derivando em relação a $a$:

$$\frac{\partial L}{\partial a} = -2\sum_{i=1}^{n}x_i\left(y_i - ax_i - b\right) = 0 \;\Longrightarrow\; \sum_{i=1}^{n} x_i r_i = 0$$

**Os resíduos são ortogonais ao atributo.** Traduzindo: o que sobrou de erro **não tem mais nada de linear em $x$** — se tivesse, a reta ainda poderia melhorar. É o significado geométrico do ajuste, e vale para qualquer número de atributos.

**Passo 4 — resolver o sistema.** Substituindo $b = \bar{y} - a\bar{x}$ na segunda condição e reorganizando em torno das médias:

$$a = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{n}(x_i - \bar{x})^2} = \frac{S_{xy}}{S_{xx}}$$

> $S_{xy}$ e $S_{xx}$ são **somas de desvios**, não a perda — a letra é a mesma por tradição, e é por isso que a perda aqui se chama $L$.

Duas contas — uma soma de produtos e uma soma de quadrados — e a reta está pronta. Sem iteração, sem taxa de aprendizado, sem critério de parada.

**Uma vez com número.** Três pontos: (1, 3), (2, 5) e (3, 4). As médias são $\bar{x} = 2$ e $\bar{y} = 4$. Os desvios em $x$ são $-1$, $0$, $+1$; em $y$, $-1$, $+1$, $0$.

$$S_{xy} = (-1)(-1) + (0)(1) + (1)(0) = 1 \qquad S_{xx} = 1 + 0 + 1 = 2$$

Logo $a = 1/2 = 0{,}5$, e $b = \bar{y} - a\bar{x} = 4 - 0{,}5 \times 2 = 3$. A reta é $\hat{y} = 0{,}5x + 3$ — e ela passa por $(2, 4)$, o centro de massa, como o passo 2 garantiu.

**Passo 5 — o que a fórmula avisa.** O denominador é a variação de $x$. Se $S_{xx} = 0$, todos os $x$ são iguais, e **não existe reta**: nenhuma inclinação é melhor que outra. Não é falha numérica — é o dado não conter a informação. É o mesmo fenômeno que você vai encontrar adiante, no caso da limonada, onde o preço **não varia** dentro de nenhum mês.

> **Isto é a versão com um atributo do que a etapa 05 do `ml-zero` faz para $d$ atributos.** Lá as duas condições viram um sistema $d \times d$ — as **equações normais** — resolvido por eliminação de Gauss. A ideia é idêntica: derivar, igualar a zero, resolver. O que cresce é a álgebra, não o conceito.

:::exercicio {"id":"modelos-lineares-e7","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Quatro pontos: (1, 2), (2, 3), (3, 5) e (4, 6).

Calcule a **inclinação** $a$ da reta de mínimos quadrados, usando $a = S_{xy} / S_{xx}$. Responda com duas casas decimais.

> **gabarito:** 1.40 ± 0.02
> **porque:** As médias são x̄ = 2,5 e ȳ = 4. Os desvios em x são −1,5, −0,5, +0,5 e +1,5; em y são −2, −1, +1 e +2.
>
> S_xy = (−1,5)(−2) + (−0,5)(−1) + (0,5)(1) + (1,5)(2) = 3 + 0,5 + 0,5 + 3 = **7**
> S_xx = 2,25 + 0,25 + 0,25 + 2,25 = **5**
>
> Logo a = 7 / 5 = **1,4**, e o intercepto sai de b = ȳ − a·x̄ = 4 − 1,4 × 2,5 = **0,5**.
>
> Confira no laboratório acima que a reta ótima passa por (x̄, ȳ) = (2,5; 4): 1,4 × 2,5 + 0,5 = 4. Isso não é coincidência deste exemplo — é o passo 2 da dedução, e vale sempre.
> **volte para:** #a-deducao-em-cinco-passos
:::

## Interpretar coeficientes — e o que eles não dizem

O modelo linear é interpretável, e é por isso que ele sobrevive em crédito, seguro e saúde. Mas "interpretável" não significa "fácil de interpretar corretamente".

### O que o coeficiente diz

Aumentar $x_j$ em uma unidade muda $\hat{y}$ em $w_j$ unidades, mantendo os demais atributos constantes. É a leitura mais direta que um modelo oferece — e é o motivo de o linear sobreviver em crédito, seguro e saúde.

> Na regressão logística a leitura é outra: o coeficiente multiplica a **razão de chances**, não a saída. Está no [capítulo II.3](ii-3-regressao-logistica.md), e confundir as duas é o erro de interpretação mais comum deste livro.

### As quatro coisas que ele não diz

1. **Não diz causalidade.** "Mantendo tudo mais constante" é uma operação matemática sobre a equação ajustada, não uma intervenção no mundo. Se você mudar $x_j$ de fato, as outras variáveis mudam junto — e o modelo não sabe disso.
2. **Não é comparável entre atributos sem padronização.** Um coeficiente de 0,003 para renda em reais e 2,5 para número de filhos não diz que filhos importam mais. Compare coeficientes só depois de padronizar — e mesmo assim com cuidado.
3. **Não é confiável sob colinearidade.** Quando dois atributos são altamente correlacionados, o modelo pode dar peso alto a um e negativo ao outro, ou trocá-los completamente com uma pequena mudança nos dados. O *erro* não piora; a *interpretação* vira ruído. É o modo de falha mais traiçoeiro do modelo linear, porque a métrica não avisa.
4. **Não vale fora da faixa observada.** Extrapolar uma reta é a forma mais fácil de produzir uma previsão absurda com aparência de rigor.


## O caso da limonada

A lista acima é fácil de ler e difícil de acreditar. Esta seção existe para você **produzir** o erro antes de aceitar que ele é um erro.

O conjunto está em [`ml-zero/dados/limonada/`](../../ml-zero/dados/limonada/README.md): 365 dias de uma barraca de limonada, com o tempo que fez, quantos panfletos foram distribuídos, o preço praticado e quantos copos saíram. Sem valor faltante. O dado é sintético — e é por isso que serve: as armadilhas aparecem limpas, sem ruído para escondê-las.

Comece pelo que todo mundo faz — a matriz de correlação com a variável resposta:

| atributo | correlação com `vendas` |
|---|---|
| `temperatura` | +0,990 |
| `precipitacao` | −0,909 |
| `panfletos` | +0,805 |
| **`preco`** | **+0,513** |

Calor vende, chuva atrapalha, panfleto ajuda. E **preço mais alto vende mais.**

A última linha é onde o relatório morre. Ela sugere uma recomendação de negócio — *aumente o preço* — que é o oposto do que a barraca deve fazer. Antes de ler adiante, olhe o dado:

| preço | dias | temperatura média | vendas médias | meses em que aparece |
|---|---|---|---|---|
| 0,30 | 303 | 57,0 | 23,7 | jan–jun, set–dez |
| 0,50 | 62 | 78,8 | 33,1 | **só julho e agosto** |

O preço subiu **no verão**. `preco` não é uma alavanca de decisão: é um **termômetro disfarçado**. A correlação de +0,513 mede o calor de julho, não a disposição do freguês a pagar.

### O passo que deveria salvar, e não salva

A resposta de manual é "controle pelas outras variáveis". Ajustando tudo junto:

```
vendas = 3,192
       + 0,3692 · temperatura
       − 2,2460 · precipitacao
       + 0,0188 · panfletos
       + 2,4143 · preco          R² = 0,982
```

O coeficiente do preço continua **positivo**. Controlar pela temperatura não desfez nada — porque a temperatura média não captura *ser julho*, e o que sobrou de julho continua morando dentro de `preco`.

**Controlar por uma variável só remove o confundimento que aquela variável mede.** Se o confundidor real é "estação", e você mediu "temperatura do dia", a regressão devolve um número com aparência de rigor e sinal invertido. Nenhuma métrica avisa: o R² é 0,982.

Este é o item 1 da lista anterior — *não diz causalidade* — em números, e não em advertência.

### E o item 3, de brinde

`temperatura` e `panfletos` correlacionam **+0,798**: em dia quente, distribuíam-se mais panfletos. O coeficiente do panfleto sai em 0,0188 — ou seja, **53 panfletos para um copo a mais**. Lido como efeito da panfletagem, é falso: parte do que ele mede é simplesmente o calor daquele dia.

Colinearidade não estraga a previsão. Estraga a **leitura** — e é o modo de falha mais traiçoeiro do modelo linear, porque o erro de validação não muda.

### Reproduza

```python
import pandas as pd
df = pd.read_csv("ml-zero/dados/limonada/limonada.csv", parse_dates=["data"])

df.corr(numeric_only=True)["vendas"]            # a tabela ingênua
df.groupby("preco")[["temperatura", "vendas"]].mean()   # a revelação
df.assign(mes=df.data.dt.month).groupby("preco").mes.unique()
```

Agora tente o conserto óbvio: **isolar um período em que o preço varie sem a estação variar junto**, e ajustar só ali.

Ele não existe. Rode e veja:

```python
df.assign(mes=df.data.dt.month).groupby("mes").preco.nunique()   # tudo 1
```

**Nenhum mês do ano tem mais de um preço.** São 0,30 de janeiro a junho e de setembro a dezembro, 0,50 nos 62 dias de julho e agosto — exatamente os dois meses inteiros. Restringir a julho e agosto não isola o efeito do preço: deixa o preço **constante**, e um atributo que não varia não tem coeficiente.

O confundimento aqui é **perfeito**: preço e estação são a mesma variável, com dois nomes. Não há recorte, controle nem modelo que separe as duas — a informação não está no dado, e nenhuma técnica a inventa. Estimar efeito de preço exigiria **variar o preço de propósito** em dias comparáveis: cobrar 0,30 e 0,50 dentro do mesmo mês.

Esta é a resposta menos confortável e a mais honesta que a análise pode dar: *com estes dados, não dá — e aqui está o que precisaria ser coletado.*

:::exercicio {"id":"modelos-lineares-e4","tipo":"numerica","objetivo":"O3","dificuldade":"facil"}
Pelo ajuste múltiplo acima, quantos panfletos precisam ser distribuídos para vender **um copo a mais**? Responda com um número inteiro aproximado.

> **gabarito:** 53 ± 4
> **porque:** O coeficiente é 0,0188 copo por panfleto, então um copo pede 1 ÷ 0,0188 ≈ 53 panfletos.
>
> O número importa menos que o hábito: **inverter o coeficiente devolve a unidade que a decisão usa**. "0,0188" não diz nada a quem manda imprimir panfleto; "53 panfletos por copo" diz — e diz que a panfletagem provavelmente não se paga.
>
> E a ressalva vale mais que a conta: `panfletos` correlaciona +0,798 com `temperatura`, então parte desses 0,0188 é calor, não panfleto. O número real, se a barraca distribuísse panfletos sem escolher o dia, seria **menor** — pior ainda para a ideia.
> **volte para:** #e-o-item-3-de-brinde
:::

:::exercicio {"id":"modelos-lineares-e5","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
Na regressão múltipla da limonada, `preco` fica com coeficiente **+2,41** mesmo com `temperatura` no modelo. Qual é a explicação correta?

- [ ] O modelo provou que subir o preço aumenta as vendas; a correlação simples estava certa.
- [ ] O coeficiente é positivo por erro numérico — com mais dados ele viraria negativo.
- [x] `preco` funciona como indicador de julho e agosto, e a temperatura do dia não captura tudo o que "ser verão" significa.
- [ ] O problema seria resolvido padronizando os atributos antes de ajustar.

> **gabarito:** `preco` funciona como indicador de julho e agosto
> **porque:** O preço de 0,50 só existe em 62 dias, todos em julho e agosto. Ele carrega a informação "é alta temporada" — férias, fluxo de rua, hábito — que a temperatura média do dia não representa inteira. O que sobra desse efeito é atribuído ao único atributo que o marca: o preço.
>
> A primeira alternativa é a leitura que vai para o slide de recomendação e custa dinheiro. A segunda inverte o diagnóstico: não é ruído, é **viés** — mais dados do mesmo tipo tornariam o coeficiente errado mais preciso, não mais correto. A quarta confunde escalas com confundimento: padronizar muda a **magnitude** dos coeficientes para que sejam comparáveis entre si, e não mexe em qual variável está roubando o efeito da outra.
>
> Controlar por uma variável só remove o confundimento que aquela variável mede.
> **volte para:** #o-passo-que-deveria-salvar-e-nao-salva
:::

## Quando o linear é a escolha certa

Não como consolo, e sim como decisão de engenharia.

Antes da tabela, o contraexemplo honesto: no experimento do [capítulo II.5](ii-5-arvores-ensembles.md), o linear faz **0,4963 de AUC** contra **0,9392** do boosting. É um massacre — e é uma afirmação sobre **aquele terreno**, não sobre o modelo. O dado de lá foi construído com uma fronteira irregular, que é exatamente onde a reta não tem chance. Troque o terreno e a conclusão vira.



| Situação | Por quê |
|---|---|
| **Poucos dados por atributo** | menos parâmetros, menos variância. Com 200 linhas e 50 colunas, o ensemble decora |
| **Necessidade de auditoria** | um número por atributo, defensável e questionável. Exigência regulatória em crédito e seguro |
| **Probabilidade que vira dinheiro** | sai razoavelmente calibrado; ensembles frequentemente não (cap. II.1) |
| **Linha de base obrigatória** | é a régua contra a qual o modelo complexo precisa se justificar |
| **Latência apertada** | uma multiplicação de vetores; ordens de grandeza mais rápido que uma floresta |

O último ponto tem um corolário que vale sozinho: **sempre treine um linear primeiro**. Ele custa minutos e responde à pergunta que importa antes de qualquer outra — "quanto do sinal é simplesmente linear?". Se o modelo complexo ganha pouco dele, você acabou de descobrir que o problema é fácil e que o resto é custo de manutenção.

:::exercicio {"id":"modelos-lineares-e6","tipo":"aberta","objetivo":"O4","dificuldade":"media"}
A dona da barraca de limonada quer decidir **o preço do próximo verão** e pede ajuda. Você tem os 365 dias do conjunto acima e um modelo linear com R² de 0,982.

Escreva a resposta que você daria a ela — em até seis linhas, sem jargão. Diga o que o modelo serve para responder, o que ele **não** serve, e o que você precisaria para responder a pergunta que ela fez.

> **rubrica:** Reconhece que o modelo prevê bem as vendas mas não estima o efeito do preço, porque nos dados o preço mudou junto com a estação; Não usa o R² alto como argumento a favor da recomendação de preço; Diz o que faltaria — variar o preço de propósito em dias comparáveis, porque nenhum recorte dos dados atuais resolve: não há um único mês com dois preços; Mantém o modelo como útil para o que ele faz bem, como prever demanda e dimensionar estoque; Responde em linguagem que a dona da barraca entende, sem exigir vocabulário técnico
> **porque:** Esta é a pergunta que separa "treinei um modelo" de "respondi a alguém". As três leituras que o exercício cobra estão no capítulo: o coeficiente **não é causa**, o R² alto **não valida a recomendação**, e o modelo linear continua sendo a escolha certa — para **previsão de demanda**, que é outra pergunta.
>
> A resposta forte não é "não dá para saber". É separar as duas perguntas: *quantos copos vou vender amanhã, dado o tempo?* — o modelo responde bem. *Quanto vendo a mais se eu baixar o preço?* — o dado não contém a resposta, porque o preço nunca variou sem a estação variar junto. E propor o desenho que traria essa informação: alternar preço entre dias parecidos, dentro do mesmo mês — que é justamente o que nunca aconteceu nestes 365 dias.
>
> Uma resposta que recomenda subir o preço citando o coeficiente positivo está errada mesmo que bem escrita — é exatamente o relatório que o capítulo existe para impedir.
> **volte para:** #quando-o-linear-e-a-escolha-certa
:::

## Mão na massa

A **etapa 05–06** do [`ml-zero`](../trilha-ml-zero.md) implementa, em biblioteca padrão:

- `RegressaoLinear` com **os dois caminhos** — solução fechada por eliminação de Gauss e gradiente — para você conferir que chegam ao mesmo lugar;
- `Padronizador` que aprende no treino e **aplica** ao teste — o vazamento do capítulo I.3 tornado difícil de cometer.

A mesma etapa serve ao [capítulo II.4](ii-4-otimizacao.md), porque são o mesmo objeto por dois ângulos: o 05 pergunta *que função o modelo representa*; o 06, *como se chega aos coeficientes*. A `RegressaoLogistica`, que também mora ali, é do [capítulo II.3](ii-3-regressao-logistica.md).


**Notebook pronto para executar** — [`regressao_limonada.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb) · [abrir no Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb)

O caso da limonada do começo ao fim: a correlação que sugere *aumente o preço*, a descoberta de que o preço é um termômetro disfarçado, o controle que **não conserta**, e a verificação de que nenhum mês tem dois preços — a informação não está no dado.

> Na sua máquina: `pip install notebook` e `jupyter notebook`, ou abra a pasta no VS Code. O notebook **não precisa do repositório clonado** — se você estiver no Colab, ele baixa sozinho os arquivos de que precisa. Como rodar a trilha inteira: [`ml-zero`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/README.md).

## Síntese — o que levar

- Regressão linear minimiza **erro quadrático** — por diferenciabilidade e solução fechada, não por ser intrinsecamente mais correto.
- A dedução dá **duas condições**: a soma dos resíduos é zero (a reta passa pelo centro de massa) e os resíduos são ortogonais ao atributo (não sobrou nada de linear em $x$).
- $a = S_{xy}/S_{xx}$, e o denominador avisa: **atributo que não varia não tem coeficiente**.
- Gradiente e solução fechada chegam ao mesmo lugar. O gradiente é a ferramenta **geral**; a fechada é o caso de sorte.
- Coeficiente **não** é causa, **não** é comparável sem padronização, **não** é estável sob colinearidade, e **não** vale fora da faixa observada.
- Treine sempre um linear primeiro. Ele responde "quanto do sinal é simplesmente linear?" em minutos.

## Verificação

1. Mostre, sem consultar o texto, por que a reta de mínimos quadrados passa necessariamente pelo ponto $(\bar{x}, \bar{y})$.
2. Você tem 180 linhas e 60 atributos. Que família de modelo você tenta primeiro, e por quê?
3. Dois atributos do seu modelo são quase idênticos. O erro de validação está ótimo. O que pode estar errado mesmo assim?
4. No laboratório, o que aconteceria com a reta ótima se todos os pontos tivessem o mesmo $x$? Responda pela fórmula, não pelo desenho.
