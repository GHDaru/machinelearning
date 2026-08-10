# 06 — Otimização e Regularização

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-05 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar o gradiente descendente como procedimento, não como fórmula.
- **O2.** Diagnosticar taxa de aprendizado alta e baixa pelo comportamento da curva de perda.
- **O3.** Comparar regularização L1 e L2 quanto ao efeito sobre os coeficientes.
- **O4.** Justificar early stopping como forma de regularização.

## O problema: a perda não desce

"Treinei e não funcionou" é o relato mais comum de quem está começando — e o menos acionável, porque não diz nada. Quase todo problema de treino tem sintoma **visível na curva de perda**, e quem sabe lê-la economiza dias.

Este capítulo é sobre duas coisas que parecem opostas e são complementares: **descer** a paisagem da perda, e **impedir** que a descida vá longe demais.

## De onde isto veio

### A descida: Cauchy, 18 de outubro de 1847

**O aperto.** Augustin-Louis Cauchy queria calcular a **órbita de um corpo celeste**. Não pelas equações diferenciais do movimento, mas pelas equações finitas que o representam, tomando como incógnitas os próprios elementos da órbita — *"Então as incógnitas são em número de seis."* Seis incógnitas, resolvidas à mão, em 1847.

**O que se fazia antes.** Eliminação sucessiva: reduzir o sistema a uma equação só. Cauchy lista por que não serve, e a lista é honesta: *"1º que, num grande número de casos, a eliminação não pode efetuar-se de maneira alguma; 2º que a equação resultante é geralmente muito complicada, mesmo quando as equações dadas são bastante simples"*.

**A virada.** Se a função nunca é negativa, **não é preciso resolvê-la — basta fazê-la decrescer**. Nas palavras dele: *"Para achar os valores de x, y, z… que verificarão a equação u = 0, bastará fazer decrescer indefinidamente a função u, até que ela se anule."* Descer contra a derivada, um passo pequeno de cada vez.

**A ideia reaproveitável.** **Trocar "resolver" por "melhorar repetidamente".** Quando a solução fechada não existe, ou existe e explode em complexidade, aceita-se um procedimento que só garante *ficar melhor a cada passo*. É a troca fundadora de quase todo o Machine Learning — e a razão de o capítulo 05 ter duas implementações: a equação normal, que resolve, e o gradiente, que melhora.

**O nome.** O artigo se chama *"Méthode générale pour la résolution des systèmes d'équations simultanées"* (C. R. Acad. Sci. Paris, 25:536–538, 1847). "Método geral" — a palavra *gradiente* não está no título.

> **Dois detalhes que mudam como você lê este capítulo.**
>
> **O primeiro:** para um sistema de várias equações, Cauchy manda minimizar a soma dos quadrados dos resíduos. Ou seja — **o capítulo 06 executa o objetivo que o [capítulo 05](05-modelos-lineares.md) inventou.** Legendre e Gauss definiram *o que* é a melhor curva; Cauchy, quarenta anos depois, deu o *como* chegar nela sem resolver nada.
>
> **O segundo, e é o melhor antídoto que este livro tem contra a reverência:** Cauchy **não prova que o método converge, e sabe disso.** Ele escreve que se limita, por ora, a indicar os princípios, propondo-se a voltar ao assunto *"num próximo Memória"*. Esse próximo memorial, ao que se sabe, **nunca existiu**. O matemático mais rigoroso do século XIX publicou um algoritmo sem garantia e não voltou. Método não nasce provado — nasce funcionando, e a prova vem depois, se vier.

### O freio: Tikhonov, ridge e LASSO

Regularização vem de outro lugar: **problemas mal-postos**. Hadamard (1923) define o que é um problema *bem-posto* — solução existe, é única e depende de forma estável dos dados. Muitos problemas inversos reais falham na terceira condição: uma perturbação minúscula na entrada muda a resposta radicalmente. Tikhonov publica sobre estabilidade desses problemas em **1943**, e o método de regularização em **1963**; **D. L. Phillips** chega a algo equivalente de forma independente em 1962 — daí a forma "Tikhonov–Phillips".

Na estatística o mesmo movimento aparece como **ridge regression** (Hoerl & Kennard, *Technometrics*, 1970), e a origem é **industrial**: Hoerl vinha da engenharia química, e o "ridge" alude às **cristas dos gráficos de superfície de resposta**. Vinte e seis anos depois, o **LASSO** (Tibshirani, *JRSS-B*, 1996) herda diretamente do *non-negative garrote* de Breiman (1995), fundindo as duas etapas do garrote numa só.

**A ideia reaproveitável do bloco inteiro:** **aceitar erro sistemático de propósito para comprar estabilidade.** Tikhonov, ridge e LASSO são o mesmo gesto — o dado não determina a resposta, então você **impõe** uma preferência externa e assume o viés que ela introduz. É por isso que regularização não é um truque de implementação: é uma declaração sobre o que você acredita antes de ver os dados.

> **A ponte com o [capítulo 07](07-arvores-ensembles.md) é Breiman, e é uma ideia só: instabilidade.** Ele classificou os métodos entre estáveis (ridge) e instáveis (seleção de subconjunto), com o garrote no meio. Do lado "encolher coeficientes" nasce o LASSO, aqui. Do lado "instabilidade é oportunidade, não defeito" nasce o *bagging*, lá. **O mesmo diagnóstico gerou dois métodos em dois capítulos** — e conhecer o diagnóstico vale mais que conhecer os dois métodos.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Tudo o que é atribuído a Cauchy: o problema das seis incógnitas, a crítica à eliminação, a frase "fazer decrescer indefinidamente", a minimização da soma de quadrados, e a ausência do memorial prometido — via [Lemaréchal, *Cauchy and the Gradient Method*, Documenta Mathematica, 2012](https://ems.press/content/book-chapter-files/27368?nt=1), **lido por inteiro**, que transcreve o francês original em nota |
| ✓ᵐ | Hoerl & Kennard (*Technometrics* 12(1):55–67, 1970) e Tibshirani (*JRSS-B* 58(1):267–288, 1996): obra, ano e veículo |
| ⏳ | A cronologia de Tikhonov (1943, 1963) e a contribuição independente de Phillips (1962) |
| ⏳ | Que "ridge" vem das cristas dos gráficos de superfície de resposta |
| ⏳ | Que o LASSO herda do *non-negative garrote* de Breiman (1995) |
| ❌ | **Early stopping**: procurei e não localizei atribuição primária confiável. O capítulo ensina o método sem lhe atribuir inventor |
| 📖 | As duas ideias reaproveitáveis, a ligação com o cap. 05 e a ponte com o cap. 07 |

## Fundamentos: descer, sem enxergar a paisagem

Imagine estar numa encosta, no escuro, com um único instrumento: você sente a inclinação sob os pés. O procedimento é óbvio — dê um passo na direção mais íngreme para baixo, sinta de novo, repita.

Isso é gradiente descendente, inteiro. Formalmente:

$$w \leftarrow w - \eta \, \nabla L(w)$$

O gradiente $\nabla L$ aponta na direção de **maior crescimento**; o sinal negativo desce. A taxa $\eta$ é o **tamanho do passo**.

Três decisões, e só três, definem tudo o que acontece:

**1. Quanto do dado usar por passo.**

| Variante | Exemplos por passo | Consequência |
|---|---|---|
| **Lote** (*batch*) | todos | direção precisa, passo caro, trajetória lisa |
| **Mini-batch** | 32–256 | o padrão prático; ruído suficiente para escapar de vales rasos |
| **Estocástico** | 1 | passo baratíssimo, trajetória errática |

O ruído do mini-batch não é só tolerado: ele **ajuda**. Uma trajetória perfeitamente lisa desce até o primeiro vale e para lá.

**2. O tamanho do passo.** É o hiperparâmetro que mais decide entre sucesso e fracasso, e a próxima seção trata dele.

**3. Quando parar.** Aparentemente trivial, e o assunto da seção sobre *early stopping* — onde está a lição menos óbvia do capítulo.

## Diagnóstico pela curva de perda

Registre a perda a cada época e olhe o desenho. Quatro padrões cobrem quase tudo:

| Sintoma na curva | Diagnóstico | O que fazer |
|---|---|---|
| Sobe, oscila muito, ou vira NaN | **taxa alta demais** | dividir a taxa por 10 |
| Desce, mas quase imperceptivelmente | **taxa baixa demais** | multiplicar por 3–10 |
| Desce e estabiliza num patamar | convergiu | verificar se o patamar é bom o bastante |
| Desce no treino e **sobe** na validação | **overfitting** | regularizar, parar antes, mais dados |

A quarta linha é a única que exige duas curvas. Plote sempre as duas — treino e validação, no mesmo gráfico. Uma curva sozinha esconde exatamente o problema que mais custa caro.

### Uma sutileza que quase ninguém conta

Taxa alta demais **nem sempre** produz explosão. Medimos, na [etapa 05–06](../trilha-ml-zero.md):

- Com **regressão linear** (erro quadrático) e taxa 50, a perda explode e vira infinito. O erro quadrático não tem teto.
- Com **regressão logística** e taxa **500** — dez vezes maior —, a perda **não** explode. Ela satura.

Duas razões, e ambas valem entender. A perda logística é **limitada**: quando a sigmoide satura, o logaritmo é cortado e a perda para de crescer. E num problema linearmente separável, o primeiro gradiente já aponta na direção certa — um passo gigante nessa direção **acerta** em vez de explodir.

A lição prática: **"não explodiu" não é evidência de que a taxa está boa.** Confie na curva, não na ausência de NaN.

:::exercicio {"id":"06-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
A curva de perda de treino desce rapidamente nas primeiras épocas e depois oscila para cima e para baixo sem estabilizar, mantendo-se num patamar alto. Qual é o diagnóstico mais provável?

- [ ] Overfitting: o modelo decorou o treino.
- [x] Taxa de aprendizado alta demais: o passo salta por cima do mínimo e fica quicando em torno dele.
- [ ] Dados insuficientes.
- [ ] O modelo é simples demais para o problema.

> **gabarito:** Taxa de aprendizado alta demais
> **porque:** A assinatura é a **oscilação sem convergência** num patamar alto. O otimizador está dando passos maiores que a distância até o mínimo: chega perto, ultrapassa, volta, ultrapassa de novo. Divida a taxa por 10 e a oscilação vira descida.
>
> Overfitting (alternativa 1) tem assinatura totalmente diferente e exige **duas** curvas para ser visto: treino continua descendo enquanto validação sobe. Se você só tem a curva de treino, não pode diagnosticar overfitting — e essa é a razão de o capítulo insistir em plotar as duas juntas. Já "modelo simples demais" produziria uma curva que desce e estabiliza cedo, sem oscilar.
> **volte para:** #diagnostico-pela-curva-de-perda
:::

## Regularização: impedir que a descida vá longe demais

Minimizar o erro no treino até o fim é decorar. Regularizar é acrescentar à perda um termo que penaliza complexidade:

$$L_{\text{total}} = L_{\text{dados}} + \lambda \cdot \Omega(w)$$

O $\lambda$ controla o quanto você prefere um modelo simples a um modelo que ajusta bem. É o botão que anda na reta viés–variância do [capítulo 01](../01-fundamentos.md): $\lambda$ alto empurra para viés, $\lambda$ baixo para variância.

### L2 encolhe todos; L1 zera alguns

| | **L2** (Ridge) | **L1** (Lasso) |
|---|---|---|
| Penalidade | $\sum w_j^2$ | $\sum \lvert w_j \rvert$ |
| Efeito nos coeficientes | encolhe **todos**, nenhum vira zero | **zera** vários |
| Também serve para | estabilizar sob colinearidade | **selecionar atributos** |
| Gradiente da penalidade | $2w_j$ — proporcional ao peso | $\text{sign}(w_j)$ — **constante** |

A última linha explica as anteriores. O gradiente de L2 é proporcional ao peso: quanto mais perto de zero, mais fraco o empurrão — e o peso se aproxima de zero sem nunca chegar. O gradiente de L1 tem **magnitude constante**: o empurrão não enfraquece perto de zero, e o peso chega lá e fica.

Medimos, num problema com 2 atributos úteis e 8 de puro ruído:

| Regularização | Coeficientes não nulos | Atributos de ruído eliminados |
|---|---|---|
| **L2** (λ = 0,05) | **10 de 10** | 0 de 8 |
| **L1** (λ = 0,05) | menos de 10 | **pelo menos 4 de 8** |

E o L1 preservou os dois coeficientes úteis. Não é sorte: ele elimina preferencialmente o que não paga o próprio custo na perda.

:::exercicio {"id":"06-e2","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Você tem 300 atributos, suspeita que a maioria é irrelevante, e precisa entregar um modelo que a equipe consiga explicar. Qual regularização escolher, e por quê?

- [ ] L2, porque é mais estável numericamente.
- [x] L1, porque zera coeficientes e produz um modelo com menos atributos — que é o requisito de explicabilidade.
- [ ] Nenhuma: com 300 atributos, regularizar descarta informação.
- [ ] As duas dão o mesmo resultado; a escolha é indiferente.

> **gabarito:** L1
> **porque:** O requisito declarado é **explicabilidade**, e um modelo com 30 coeficientes não nulos é explicável de um jeito que um modelo com 300 coeficientes pequenos não é. L1 entrega isso porque o gradiente da penalidade tem magnitude constante — o empurrão para zero não enfraquece quando o peso se aproxima de zero, então ele chega lá.
>
> L2 é de fato mais estável numericamente e melhor sob colinearidade, mas **não zera nada**: você terminaria com 300 coeficientes pequenos, tecnicamente regularizados e praticamente ilegíveis. A terceira alternativa inverte a situação: com 300 atributos e suspeita de irrelevância, regularizar é justamente o que **preserva** informação útil, ao impedir que o modelo gaste capacidade ajustando ruído.
>
> Na prática há uma quarta opção que o capítulo não cobre e vale conhecer: *elastic net*, que combina as duas penalidades e costuma se comportar melhor quando os atributos irrelevantes são correlacionados entre si.
> **volte para:** #l2-encolhe-todos-l1-zera-alguns
:::

## Early stopping: a regularização de graça

Treine, e a cada época meça a perda **na validação**. Quando ela parar de melhorar por algumas épocas seguidas, pare — e fique com os pesos do melhor momento.

Não custa nada, não tem hiperparâmetro difícil, e funciona porque o treino percorre modelos em ordem crescente de complexidade: os pesos começam pequenos e crescem. Parar cedo é escolher um ponto anterior nessa trajetória — o mesmo efeito de uma penalidade, obtido de graça.

### As duas armadilhas que descobrimos implementando

**1. "Melhorou" precisa de um limiar.** A primeira versão do nosso otimizador considerava progresso qualquer melhora, por menor que fosse. Com melhoras de $4 \times 10^{-10}$ por época, o critério **nunca** disparava. Só faz sentido continuar se a perda caiu o bastante para valer outra época — daí o parâmetro `min_delta`.

**2. Monitorar treino é medir o que o modelo decorou.** Esta é a armadilha séria, e ela só apareceu porque um teste a expôs.

Com dados **separáveis**, a perda de treino cai indefinidamente: o modelo empurra os pesos para o infinito e a perda tende a zero sem nunca estagnar. Um *early stopping* que observa treino nunca dispara — e mesmo que disparasse, estaria medindo a coisa errada.

Pior: mesmo observando validação, o critério **só tem o que detectar se houver sobreajuste possível**. No nosso experimento com dados limpos e separáveis, nem a validação estagnava — não havia ponto a partir do qual ajustar mais piorasse. Foi preciso injetar ruído e atributos inúteis para o instrumento ter função.

> **A lição geral, que vale além do early stopping.** Um instrumento de diagnóstico pressupõe que o problema exista. Testar o instrumento num cenário sem o problema não valida nada — e pode passar a falsa impressão de que ele está quebrado.

:::exercicio {"id":"06-e3","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Quais afirmações sobre early stopping são corretas? (marque todas que valem)

- [x] Deve ser monitorado na validação, não no treino.
- [x] Funciona como regularização porque o treino percorre modelos em ordem crescente de complexidade.
- [ ] Substitui completamente L1 e L2.
- [x] Precisa de um limiar mínimo de melhora, ou pode nunca disparar.
- [ ] Só faz sentido em redes neurais.

> **gabarito:** monitorar validação · regularização por trajetória · precisa de limiar mínimo
> **porque:** As três corretas são as que a implementação da etapa 05–06 tornou concretas — e as duas últimas foram descobertas na marra, não planejadas.
>
> **Validação, não treino**: com dados separáveis a perda de treino cai indefinidamente, e o critério mediria memória.
> **Regularização por trajetória**: os pesos crescem ao longo do treino, então parar antes seleciona um modelo menos complexo — o mesmo efeito de penalizar, sem penalizar.
> **Limiar mínimo**: sem `min_delta`, uma melhora de 4e-10 conta como progresso e o critério nunca dispara.
>
> As erradas: early stopping **complementa** L1/L2 e é rotineiro usá-los juntos — ele controla *quando* parar, elas controlam *para onde* ir. E ele vale para qualquer modelo treinado iterativamente, incluindo o gradient boosting do [capítulo 07](07-arvores-ensembles.md), onde é a forma padrão de escolher o número de árvores.
> **volte para:** #early-stopping-a-regularizacao-de-graca
:::

:::exercicio {"id":"06-e4","tipo":"completar","objetivo":"O1","dificuldade":"facil"}
Complete o nome do hiperparâmetro que define o **tamanho do passo** na atualização abaixo:

`w ← w − ______ × ∇L(w)`

> **gabarito:** taxa de aprendizado|learning rate|taxa|eta|η
> **porque:** É a **taxa de aprendizado** (η), e ela é o hiperparâmetro que mais decide entre um treino que funciona e um que não funciona. Alta demais: o passo salta por cima do mínimo e a perda oscila ou explode. Baixa demais: a perda desce imperceptivelmente e o treino termina antes de chegar a lugar nenhum.
>
> Repare que ela não muda *para onde* ir — o gradiente já decidiu a direção. Ela só decide **quanto** andar naquela direção. Confundir as duas coisas é a origem da tentativa comum e inútil de "consertar a direção" mexendo na taxa.
> **volte para:** #fundamentos-descer-sem-enxergar-a-paisagem
:::

## Mão na massa

A **etapa 05–06** do [`ml-zero`](../trilha-ml-zero.md) traz o otimizador **isolado do modelo**:

```python
def descida_de_gradiente(grad, n_parametros, n_exemplos, taxa, epocas,
                         lote=None, paciencia=None, min_delta=1e-6,
                         monitorar=None, seed=0)
```

Quem decide *o que* minimizar é o modelo, que passa a função `grad`. O otimizador só sabe descer. Essa separação é a arquitetura hexagonal nascendo da dor (regra 2 da construção): ela não foi projetada de antemão — apareceu quando linear e logística precisaram do mesmo laço com perdas diferentes.

O `Historico` que ele devolve é o instrumento de diagnóstico: `divergiu()`, `estagnou()`, e a lista de perdas para plotar.

## Assista

:::video {"id":"06-v1","fonte":"youtube","ref":"sDv4f4s2SB8","min":24,"autor":"StatQuest with Josh Starmer","titulo":"Gradient Descent, Step-by-Step"}
Vinte e quatro minutos, e valem cada um. O vídeo faz a conta **à mão**, passo a passo, num exemplo minúsculo: calcula o gradiente, dá o passo, recalcula. É o que a fórmula `w ← w − η∇L` esconde — que ela descreve um procedimento repetitivo e concreto, não uma operação abstrata. Se o gradiente ainda parece magia, é este material que resolve.
:::

## Síntese — o que levar

- Gradiente descendente é um **procedimento**: sinta a inclinação, dê um passo, repita. Três decisões — quanto de dado por passo, tamanho do passo, quando parar.
- **Plote treino e validação juntos.** Uma curva sozinha não consegue mostrar overfitting.
- "Não explodiu" não prova que a taxa está boa: perda logística é **limitada** e satura em vez de divergir.
- **L2 encolhe todos, L1 zera alguns** — porque o gradiente de L1 tem magnitude constante perto de zero. L1 é também seleção de atributos.
- **Early stopping** é regularização de graça, mas exige monitorar **validação** e um **limiar mínimo** de melhora. E só tem o que detectar se houver sobreajuste possível.

## Verificação

1. Explique por que o ruído do mini-batch pode ajudar, em vez de atrapalhar.
2. Sua perda de treino desce bem e a de validação desce e depois sobe. Que três intervenções você tentaria, em que ordem?
3. Por que L1 zera coeficientes e L2 não? Responda pelo gradiente da penalidade, não pelo formato da curva.
