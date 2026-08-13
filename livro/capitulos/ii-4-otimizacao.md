# II.4 — Otimização e Regularização

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

**A ideia reaproveitável.** **Trocar "resolver" por "melhorar repetidamente".** Quando a solução fechada não existe, ou existe e explode em complexidade, aceita-se um procedimento que só garante *ficar melhor a cada passo*. É a troca fundadora de quase todo o Machine Learning — e a razão de o capítulo II.2 ter duas implementações: a equação normal, que resolve, e o gradiente, que melhora.

**O nome.** O artigo se chama *"Méthode générale pour la résolution des systèmes d'équations simultanées"* (C. R. Acad. Sci. Paris, 25:536–538, 1847). "Método geral" — a palavra *gradiente* não está no título.

> **Dois detalhes que mudam como você lê este capítulo.**
>
> **O primeiro:** para um sistema de várias equações, Cauchy manda minimizar a soma dos quadrados dos resíduos. Ou seja — **o capítulo II.4 executa o objetivo que o [capítulo II.2](ii-2-modelos-lineares.md) inventou.** Legendre e Gauss definiram *o que* é a melhor curva; Cauchy, quarenta anos depois, deu o *como* chegar nela sem resolver nada.
>
> **O segundo, e é o melhor antídoto que este livro tem contra a reverência:** Cauchy **não prova que o método converge, e sabe disso.** Ele escreve que se limita, por ora, a indicar os princípios, propondo-se a voltar ao assunto *"num próximo Memória"*. Esse próximo memorial, ao que se sabe, **nunca existiu**. O matemático mais rigoroso do século XIX publicou um algoritmo sem garantia e não voltou. Método não nasce provado — nasce funcionando, e a prova vem depois, se vier.

### O freio: Tikhonov, ridge e LASSO

Regularização vem de outro lugar: **problemas mal-postos**. Hadamard (1923) define o que é um problema *bem-posto*: solução existe, é única e depende de forma estável dos dados. Muitos problemas inversos reais falham na terceira condição: uma perturbação minúscula na entrada muda a resposta radicalmente. Tikhonov publica sobre estabilidade desses problemas em 1943, e o método de regularização em 1963; **D. L. Phillips** chega a algo equivalente de forma independente em 1962 — daí a forma "Tikhonov–Phillips".

Na estatística o mesmo movimento aparece como **ridge regression** (Hoerl & Kennard, *Technometrics*, 1970), e a origem é industrial: Hoerl vinha da engenharia química, e o "ridge" alude às cristas dos gráficos de superfície de resposta.

Vinte e seis anos depois vem o **LASSO**, e a herança está declarada pelo próprio autor logo depois de apresentar o método: *"The motivation for the lasso came from an interesting proposal of Breiman (1993)."* O garrote, segundo a descrição dele ali mesmo, *"starts with the OLS estimates and shrinks them by non-negative factors whose sum is constrained"* — duas etapas, que o LASSO funde numa só.

Repare na data citada. Tibshirani credita um **relatório técnico de 1993** de Berkeley; a versão publicada em periódico só sai em **1995**, na *Technometrics*. É o intervalo de dois anos entre ter a ideia circulando e ela ter endereço citável, o mesmo fenômeno que o [capítulo II.2](ii-2-modelos-lineares.md) discute com Gauss.

**A ideia reaproveitável do bloco inteiro:** **aceitar erro sistemático de propósito para comprar estabilidade.** Tikhonov, ridge e LASSO são o mesmo gesto — o dado não determina a resposta, então você **impõe** uma preferência externa e assume o viés que ela introduz. É por isso que regularização não é um truque de implementação: é uma declaração sobre o que você acredita antes de ver os dados.

> **A ponte com o [capítulo II.5](ii-5-arvores-ensembles.md) é Breiman, e é uma ideia só: instabilidade.** Ele classificou os métodos entre estáveis (ridge) e instáveis (seleção de subconjunto), com o garrote no meio. Do lado "encolher coeficientes" nasce o LASSO, aqui. Do lado "instabilidade é oportunidade, não defeito" nasce o *bagging*, lá. **O mesmo diagnóstico gerou dois métodos em dois capítulos** — e conhecer o diagnóstico vale mais que conhecer os dois métodos.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Tudo o que é atribuído a Cauchy: o problema das seis incógnitas, a crítica à eliminação, a frase "fazer decrescer indefinidamente", a minimização da soma de quadrados, e a ausência do memorial prometido — via [Lemaréchal, *Cauchy and the Gradient Method*, Documenta Mathematica, 2012](https://ems.press/content/book-chapter-files/27368?nt=1), **lido por inteiro**, que transcreve o francês original em nota |
| ✓ᵐ | Hoerl & Kennard (*Technometrics* 12(1):55–67, 1970) e Tibshirani (*JRSS-B* 58(1):267–288, 1996): obra, ano e veículo |
| ⏳ | A cronologia de Tikhonov (1943, 1963) e a contribuição independente de Phillips (1962) |
| ⏳ | Que "ridge" vem das cristas dos gráficos de superfície de resposta |
| ✓ | Que o LASSO herda do garrote, **declarado pelo próprio Tibshirani**, e os dois trechos citados entre aspas, lidos no texto de *"Regression Shrinkage and Selection via the Lasso"* (*JRSS-B* 58(1):267–288, 1996) |
| ✓ᵐ | O garrote publicado: **Leo Breiman**, *"Better Subset Regression Using the Nonnegative Garrote"*, *Technometrics* 37(4):373–384, 1995, [10.1080/00401706.1995.10484371](https://doi.org/10.1080/00401706.1995.10484371). Note que o LASSO cita o **relatório técnico de 1993**, e não esta versão |
| ❌ | **Early stopping**: procurei e não localizei atribuição primária confiável. O capítulo ensina o método sem lhe atribuir inventor |
| 📖 | As duas ideias reaproveitáveis, a ligação com o cap. II.2 e a ponte com o cap. II.5 |

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

:::lab {"id":"otimizacao-l1","tipo":"anima-taxas","titulo":"Três taxas na mesma paisagem, e a mesma taxa em duas perdas"}
A tabela acima descreve formas de curva, e forma não se compara em sequência: é preciso ver as três ao mesmo tempo. Aqui não há nada a manipular. O dado é o mesmo, a paisagem é a mesma, o ponto de partida é o mesmo, e a única diferença entre as três curvas é **o tamanho do passo**.

São 60 épocas de gradiente descendente com taxas de **0,001**, **0,1** e **1,5**.

Assista e compare com as três primeiras linhas da tabela:

- **0,001** desce. Depois de 60 épocas, saiu de cerca de 0,58 para **0,5521** — menos de 10% do caminho. É a curva que "desce, mas quase imperceptivelmente", e o perigo dela é parecer saudável: ela nunca dá erro, nunca oscila, e só custa tempo.
- **0,1** desce de verdade e chega a **0,0061**.
- **1,5** sai da moldura. A seta marca a época em que ela passou do teto e a linha parou de ser desenhada.

O 1,5 não estoura por azar. Nesta paisagem a fronteira de estabilidade é exatamente **1,0**: acima dela, cada passo salta o mínimo e chega mais longe do que estava, e a distância cresce a cada época.

### Agora troque só a perda

Clique em **"E se a perda fosse logística?"**. Vale prever antes: o mesmo 1,5 estoura de novo?

**Não estoura.** Com perda logística, sobre o mesmo dado, a taxa 1,5 termina em **0,1455** — e é a **melhor das três**, à frente do 0,1, que chega a 0,4545. A taxa que era destrutiva em uma paisagem é a mais eficiente na outra.

A razão está na seção seguinte, e é o motivo de esta animação existir: o erro quadrático não tem teto, e a perda logística tem. Guarde a consequência prática antes de ler o porquê: **"não explodiu" não é evidência de que a taxa está boa** — e, como o 0,001 mostra do outro lado, "não explodiu" também não é evidência de que ela está aprendendo.
:::

### Uma sutileza que quase ninguém conta

Taxa alta demais **nem sempre** produz explosão. Medimos, na [etapa 05–06](../trilha-ml-zero.md):

- Com **regressão linear** (erro quadrático) e taxa 50, a perda explode e vira infinito. O erro quadrático não tem teto.
- Com **regressão logística** e taxa 500, dez vezes maior, a perda **não** explode. Ela satura.

Duas razões, e ambas valem entender. A perda logística é **limitada**: quando a sigmoide satura, o logaritmo é cortado e a perda para de crescer. E num problema linearmente separável, o primeiro gradiente já aponta na direção certa — um passo gigante nessa direção **acerta** em vez de explodir.

A lição prática: **"não explodiu" não é evidência de que a taxa está boa.** Confie na curva, não na ausência de NaN.

:::exercicio {"id":"otimizacao-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
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

:::exercicio {"id":"otimizacao-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Qual dos quatro padrões de curva é o **único** que não pode ser diagnosticado com a curva de treino sozinha?

- [ ] Sobe, oscila muito ou vira NaN.
- [ ] Desce, mas quase imperceptivelmente.
- [ ] Desce e estabiliza num patamar.
- [x] Desce no treino e sobe na validação.

> **gabarito:** desce no treino e sobe na validação
> **porque:** É a única linha da tabela que cita duas curvas, e por isso a única invisível com uma só. Os outros três padrões são afirmações sobre o formato de uma única série: explosão, lentidão e estabilização.
>
> O quarto é uma afirmação sobre a **relação** entre duas séries, e é justamente o problema que custa mais caro. Uma curva de treino descendo bonito é compatível com um modelo que está piorando onde importa.
>
> Daí a regra operacional: plote sempre as duas no mesmo gráfico. Não é capricho de apresentação — uma curva sozinha esconde exatamente o problema que o resto do livro passa o tempo tentando evitar.
> **volte para:** #diagnostico-pela-curva-de-perda
:::

## Regularização: impedir que a descida vá longe demais

Minimizar o erro no treino até o fim é decorar. Regularizar é acrescentar à perda um termo que penaliza complexidade:

$$L_{\text{total}} = L_{\text{dados}} + \lambda \cdot \Omega(w)$$

O $\lambda$ controla o quanto você prefere um modelo simples a um modelo que ajusta bem. É o botão que anda na reta viés–variância do [capítulo 0.2](../0-2-fundamentos.md): $\lambda$ alto empurra para viés, $\lambda$ baixo para variância.

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

:::exercicio {"id":"otimizacao-e2","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
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

:::exercicio {"id":"otimizacao-e8","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Por que a L1 zera coeficientes e a L2 não?

- [ ] Porque a L1 usa valor absoluto, que é sempre positivo.
- [x] Porque o gradiente da L1 tem magnitude constante, e o da L2 é proporcional ao peso: perto de zero, o empurrão da L2 enfraquece e o da L1 não.
- [ ] Porque a L1 é aplicada depois do treino e a L2 durante.
- [ ] Porque a L2 usa um λ menor por convenção.

> **gabarito:** magnitude constante contra empurrão proporcional
> **porque:** É a última linha da tabela, e ela explica todas as anteriores. O gradiente da penalidade L2 é $2w_j$: quanto mais perto de zero o peso está, mais fraco o empurrão, então ele se aproxima de zero sem nunca chegar. O da L1 é $\text{sign}(w_j)$, que não enfraquece — o peso chega a zero e fica.
>
> A primeira alternativa cita a característica visível da fórmula e não explica nada: o quadrado da L2 também é sempre positivo.
>
> O efeito medido no capítulo torna a diferença concreta. Com 2 atributos úteis e 8 de ruído, a L2 deixou 10 coeficientes não nulos de 10, e a L1 eliminou pelo menos 4 dos 8 de ruído, preservando os dois úteis.
> **volte para:** #l2-encolhe-todos-l1-zera-alguns
:::

:::exercicio {"id":"otimizacao-e9","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
Um modelo de crédito tem `renda_declarada` e `renda_comprovada`, quase perfeitamente correlacionadas, e ambas úteis. A equipe quer coeficientes estáveis entre reamostragens. Qual regularização atende melhor, e por quê?

- [x] L2, que encolhe os dois e distribui o peso entre eles, em vez de escolher um arbitrariamente.
- [ ] L1, porque eliminar um dos dois resolve a redundância de vez.
- [ ] Nenhuma das duas: colinearidade se resolve removendo uma coluna à mão.
- [ ] As duas dão o mesmo resultado quando os atributos são correlacionados.

> **gabarito:** L2
> **porque:** O requisito declarado é **estabilidade**, e é aí que as duas penalidades se separam. Sob colinearidade, a L1 tende a escolher um dos atributos e zerar o outro, e qual dos dois ela escolhe pode mudar com uma reamostragem — o que é exatamente a instabilidade que a equipe quer evitar. A L2 encolhe os dois e reparte o peso entre eles.
>
> A segunda alternativa não é absurda, e é a resposta certa para outro requisito. Se o objetivo fosse um modelo enxuto e explicável, zerar um dos dois seria desejável. O enunciado pede outra coisa.
>
> A terceira propõe uma decisão razoável e a apresenta como exclusiva. Remover uma coluna à mão é legítimo e frequentemente o melhor caminho, e não dispensa regularizar o resto do modelo.
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

:::exercicio {"id":"otimizacao-e3","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
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
> As erradas: early stopping **complementa** L1/L2 e é rotineiro usá-los juntos — ele controla *quando* parar, elas controlam *para onde* ir. E ele vale para qualquer modelo treinado iterativamente, incluindo o gradient boosting do [capítulo II.5](ii-5-arvores-ensembles.md), onde é a forma padrão de escolher o número de árvores.
> **volte para:** #early-stopping-a-regularizacao-de-graca
:::

:::exercicio {"id":"otimizacao-e10","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Por que parar o treino cedo funciona como regularização?

- [ ] Porque menos épocas significam menos dados vistos, e menos dados evitam decorar.
- [x] Porque o treino percorre modelos em ordem crescente de complexidade, então parar antes seleciona um modelo menos complexo.
- [ ] Porque interromper o gradiente injeta ruído, e ruído regulariza.
- [ ] Porque a perda de validação é sempre menor no início do treino.

> **gabarito:** o treino percorre modelos em ordem crescente de complexidade
> **porque:** Os pesos começam pequenos e crescem ao longo do treino. Cada época é um modelo um pouco mais expressivo que o da anterior, e parar cedo é escolher um ponto anterior nessa trajetória. É o mesmo efeito de uma penalidade, obtido sem penalizar.
>
> A primeira alternativa confunde épocas com dados. O modelo vê o conjunto inteiro a cada época; parar cedo não reduz quantos exemplos ele viu, reduz quanto ele se ajustou a eles.
>
> A quarta é falsa como regra: a perda de validação costuma cair no começo e só depois subir. Se ela fosse sempre menor no início, o treino não teria valor nenhum.
> **volte para:** #early-stopping-a-regularizacao-de-graca
:::

:::exercicio {"id":"otimizacao-e11","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Ao testar o early stopping num conjunto limpo e separável, o critério nunca dispara. O que se conclui?

- [ ] Que o critério está com defeito e precisa ser corrigido.
- [x] Que naquele cenário não há sobreajuste a detectar, e um instrumento de diagnóstico pressupõe que o problema exista.
- [ ] Que o limiar `min_delta` está alto demais.
- [ ] Que a validação deveria ser trocada pelo treino nesse caso.

> **gabarito:** não há sobreajuste a detectar naquele cenário
> **porque:** Foi a descoberta que a implementação da etapa 05–06 forçou. Com dados limpos e separáveis, nem a validação estagnava: não existia ponto a partir do qual ajustar mais piorasse, então não havia nada que o critério pudesse detectar. Foi preciso injetar ruído e atributos inúteis para o instrumento ter função.
>
> A primeira alternativa é a conclusão natural e errada, e é o motivo de esta lição valer além do early stopping: testar um instrumento num cenário sem o problema não valida nada, e ainda passa a falsa impressão de que ele está quebrado.
>
> A quarta é a saída pior de todas, porque conserta o sintoma na direção errada. Com dados separáveis a perda de treino cai indefinidamente, e um critério que a observe nunca dispararia — e, se disparasse, estaria medindo o que o modelo decorou.
> **volte para:** #as-duas-armadilhas-que-descobrimos-implementando
:::

:::exercicio {"id":"otimizacao-e4","tipo":"completar","objetivo":"O1","dificuldade":"facil"}
Complete o nome do hiperparâmetro que define o **tamanho do passo** na atualização abaixo:

`w ← w − ______ × ∇L(w)`

> **gabarito:** taxa de aprendizado|learning rate|taxa|eta|η
> **porque:** É a **taxa de aprendizado** (η), e ela é o hiperparâmetro que mais decide entre um treino que funciona e um que não funciona. Alta demais: o passo salta por cima do mínimo e a perda oscila ou explode. Baixa demais: a perda desce imperceptivelmente e o treino termina antes de chegar a lugar nenhum.
>
> Repare que ela não muda *para onde* ir — o gradiente já decidiu a direção. Ela só decide **quanto** andar naquela direção. Confundir as duas coisas é a origem da tentativa comum e inútil de "consertar a direção" mexendo na taxa.
> **volte para:** #fundamentos-descer-sem-enxergar-a-paisagem
:::

:::exercicio {"id":"otimizacao-e5","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Por que o ruído do mini-batch não é apenas tolerado, mas ajuda?

- [ ] Porque reduz o custo de memória, e memória é o gargalo do treino.
- [x] Porque uma trajetória perfeitamente lisa desce até o primeiro vale e para lá, enquanto o ruído dá chance de escapar de vales rasos.
- [ ] Porque o ruído aumenta a taxa de aprendizado efetiva.
- [ ] Porque o gradiente calculado sobre poucos exemplos é mais preciso.

> **gabarito:** o ruído dá chance de escapar de vales rasos
> **porque:** O gradiente de lote completo é a direção **mais precisa** da descida, e é exatamente isso que o prende: uma trajetória lisa segue a inclinação local até onde ela some, e para no primeiro mínimo que encontrar.
>
> A última alternativa inverte o fato. O gradiente de um mini-batch é uma estimativa **ruidosa** do gradiente verdadeiro, e o valor dele está justamente em ser ruidosa. Precisão, aqui, não é o objetivo.
>
> O custo de memória é uma vantagem real do mini-batch e não é a razão que a seção dá. Vale distinguir as duas: a econômica explica por que o mini-batch é viável, e a do ruído explica por que ele é preferível mesmo quando o lote inteiro caberia.
> **volte para:** #fundamentos-descer-sem-enxergar-a-paisagem
:::

:::exercicio {"id":"otimizacao-e12","tipo":"multipla-multi","objetivo":"O1","dificuldade":"dificil"}
Um estudante descreve o gradiente descendente assim: "é a fórmula que calcula os pesos ótimos do modelo". Quais correções o capítulo faz? (marque todas que valem)

- [x] Não é fórmula, é procedimento repetido: sentir a inclinação, dar um passo, sentir de novo.
- [x] Ele não garante o ótimo, apenas desce enquanto houver inclinação sob os pés.
- [x] Ele nem sempre vê a paisagem inteira: com mini-batch, cada passo usa uma estimativa ruidosa da inclinação.
- [ ] Ele só funciona quando existe solução fechada para comparar.

> **gabarito:** procedimento e não fórmula · não garante ótimo · a inclinação é estimada
> **porque:** As três corretas desfazem a mesma ilusão, que é tratar o gradiente como um cálculo que devolve a resposta. Ele é um laço, e o que ele devolve depende de onde começou, de quanto andou por passo e de quando parou.
>
> A imagem da encosta no escuro carrega as três: você não vê o vale, só sente a inclinação onde está, e nada garante que o vale onde você parou seja o mais fundo.
>
> A alternativa errada inverte a relação estabelecida no [capítulo II.2](ii-2-modelos-lineares.md). A solução fechada serviu para **conferir** o gradiente onde ela existia, e a conclusão foi o contrário do que a frase sugere: o gradiente é a ferramenta geral, e é justamente onde não há fórmula fechada que ele deixa de ser opcional.
> **volte para:** #fundamentos-descer-sem-enxergar-a-paisagem
:::

:::exercicio {"id":"otimizacao-e6","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Uma equipe treina com taxa 500 numa regressão logística e a perda não explode. Conclui que a taxa está adequada. Onde está o erro?

- [ ] Não há erro: ausência de explosão é o critério prático de estabilidade.
- [x] A perda logística é limitada e satura, então "não explodiu" não é evidência de taxa boa; quem responde é a curva.
- [ ] O erro é usar taxa fixa em regressão logística, que sempre exige agendamento.
- [ ] O erro é medir a perda na validação em vez de no treino.

> **gabarito:** a perda logística satura, e ausência de explosão não é evidência
> **porque:** É a sutileza que o capítulo mediu na etapa 05–06. Com erro quadrático e taxa 50, a perda vira infinito, porque o quadrado não tem teto. Com logística e taxa 500, dez vezes maior, ela não explode: quando a sigmoide satura, o logaritmo é cortado e a perda para de crescer.
>
> Há uma segunda razão, específica de problema separável: o primeiro gradiente já aponta na direção certa, e um passo gigante nessa direção **acerta** em vez de divergir.
>
> A lição é um critério de confiança, não um número. "Não deu NaN" é ausência de um sintoma, e ausência de sintoma não é diagnóstico.
> **volte para:** #uma-sutileza-que-quase-ninguem-conta
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


**Notebook pronto para executar** — [`regressao_limonada.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb) · [abrir no Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-05/regressao_limonada.ipynb)

É o notebook do capítulo II.2 — a mesma etapa serve aos dois. Troque `solucao_fechada=True` por `False` na célula do ajuste e confira que gradiente e equações normais chegam ao mesmo lugar.

> Na sua máquina: `pip install notebook` e `jupyter notebook`, ou abra a pasta no VS Code. O notebook **não precisa do repositório clonado** — se você estiver no Colab, ele baixa sozinho os arquivos de que precisa. Como rodar a trilha inteira: [`ml-zero`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/README.md).

## Assista

:::video {"id":"otimizacao-v1","fonte":"youtube","ref":"sDv4f4s2SB8","min":24,"autor":"StatQuest with Josh Starmer","titulo":"Gradient Descent, Step-by-Step"}
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
