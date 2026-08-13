# 0.2 — Fundamentos

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar generalização como a diferença entre erro no que se viu e erro no que virá.
- **O2.** Diagnosticar *overfitting* e *underfitting* a partir do comportamento das curvas de erro.
- **O3.** Decompor o erro de um modelo em viés, variância e ruído — e dizer o que fazer em cada caso.
- **O4.** Justificar por que o conjunto de teste precisa ser tocado o mínimo possível.

## O problema: decorar não é aprender

Um estudante que decora a lista de exercícios resolvida vai bem na lista e mal na prova. Um modelo que decora os dados de treino vai bem no treino e mal em produção. É o mesmo fenômeno, e é o único problema deste livro — os outros capítulos são variações dele.

O nome técnico do fracasso é **overfitting**: o modelo ajustou-se não só ao padrão dos dados, mas também ao ruído deles. E ruído, por definição, não se repete.

O nome do fracasso oposto é **underfitting**: o modelo é simples demais para capturar o padrão, e erra igualmente no treino e no teste. Errar sempre é frustrante, mas é honesto — o modelo não engana ninguém sobre a própria qualidade. O overfitting é pior justamente porque **parece sucesso** enquanto está acontecendo.

O que separa os dois é a **capacidade** do modelo: quantas hipóteses diferentes ele consegue representar. Muita capacidade e poucos dados, ele decora. Pouca capacidade, ele não aprende. O trabalho é encontrar o ponto entre os dois — e, mais importante, **saber onde você está** nessa reta.

## De onde isto veio

**O aperto, e ele não nasceu na computação.** Em 1931, um psicometrista de sobrenome Larson tinha um problema prático e irritante: ao ajustar uma regressão múltipla numa amostra e aplicá-la a outra, o coeficiente de correlação **encolhia**. Sempre. O artigo dele chama-se, literalmente, *"The Shrinkage of the Coefficient of Multiple Correlation"*. O aperto era esse — um número que descrevia bem os dados que o produziram e mentia sobre os próximos.

**O que se fazia antes.** Avaliava-se o modelo nos mesmos dados em que ele foi ajustado, e o resultado era tomado como estimativa da qualidade. Não por ingenuidade: dado era caro, e separar metade dele para não usar parecia desperdício.

**A virada.** Guardar dados que o modelo não vê. É uma ideia quase ofensiva de simples, e a mais importante deste livro inteiro. Depois vieram as economias em cima dela: Mosteller e Tukey (1968) formulam o *leave-one-out*; Stone (1974) e Geisser (1975) constroem o arcabouço da validação cruzada. Note que Stone **cita explicitamente** Larson, Mosteller & Tukey e outros: o que ele traz de novo **não é a prática, é o arcabouço** que a justifica.

**A ideia reaproveitável.** **Quem avalia não pode ser quem produziu, nem usar a mesma informação.** A separação treino/teste é um caso particular de um princípio que vale muito além de modelos: o revisor precisa ser independente do autor; a prova precisa ter questões que não estavam na lista; o benchmark precisa ser secreto para medir alguma coisa. Toda vez que você vir um número bom demais, a primeira pergunta é **"quem avaliou, e com qual informação?"**.

**O nome.** *Cross-validation* é literalmente validar cruzando: cada parte dos dados serve, por sua vez, de juiz das outras.

### A curva em U — e a descoberta de que ela estava incompleta

A formulação canônica em Machine Learning do dilema viés–variância é **Geman, Bienenstock & Doursat, "Neural Networks and the Bias/Variance Dilemma"** (*Neural Computation*, 1992), que trata redes neurais como estimadores não-paramétricos e argumenta que a escolha do viés precisa casar com a estrutura do problema. Dali vem a curva em U que todo curso desenha: aumente a capacidade e o erro de teste cai, atinge um mínimo, e volta a subir.

Só que ela sobe **e depois desce de novo**. Belkin, Hsu, Ma e Mandal (*PNAS*, 2019) mostraram que, passando do ponto em que o modelo interpola perfeitamente o treino, o erro de teste **volta a cair** — o fenômeno do *double descent*, que explica por que redes enormes funcionam onde a intuição clássica previa desastre.

**A ideia reaproveitável, e é a que este capítulo mais quer que fique:** **uma "lei" empírica pode ser um artefato da faixa em que se mediu.** A curva em U não estava errada — estava **incompleta**. Era verdadeira dentro do regime de capacidade que era observável nos anos 1990. Quando o regime mudou, a lei revelou-se um trecho de uma curva maior. Guarde isso para toda regra prática que você aprender: *em que faixa isto foi medido?*

> **E o crédito, de novo.** Loog, Viering, Mey, Krijthe e Tax publicaram *"A brief prehistory of double descent"* (*PNAS*, 2020) contestando que o fenômeno tivesse sido historicamente negligenciado — a física estatística de redes neurais já o havia observado.
>
> É a terceira vez que este livro encontra o mesmo padrão. Gauss perde a prioridade dos mínimos quadrados para Legendre no [capítulo II.2](capitulos/ii-2-modelos-lineares.md); Linnainmaa perde o crédito do backpropagation para quem o popularizou, no [capítulo III.1](capitulos/iii-1-neuronio-artificial.md); e aqui, em **2019**, acontece de novo — desta vez à luz do dia, com todos os artigos indexados e acessíveis. Se ocorre hoje, com essa infraestrutura toda, não era problema de correio lento no século XIX. **Crédito segue comunicação, não descoberta** — e este é o caso contemporâneo que torna os outros dois inegáveis.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Geman, Bienenstock & Doursat (*Neural Computation* 4(1):1–58, 1992); Stone (*JRSS-B* 36(2):111–133, 1974); Geisser (*JASA* 70:320–328, 1975); [Belkin *et al.* (*PNAS* 116(32), 2019)](https://doi.org/10.1073/pnas.1903070116); [Loog *et al.* (*PNAS* 117(20), 2020)](https://arxiv.org/abs/2004.04328) |
| ⏳ | Larson (1931) como origem da divisão de amostra, e Mosteller & Tukey (1968) para o *leave-one-out* |
| ⏳ | Que Stone cita os antecessores e que sua contribuição é o arcabouço, não a prática — apurado, **mas o texto de Stone não foi relido diretamente, e por isso nada dele aparece entre aspas neste capítulo** |
| ❌ | A **primeira** formulação da decomposição viés–variância, anterior a 1992 — procurei e não localizei |
| 📖 | As duas ideias reaproveitáveis e a leitura do *double descent* como terceiro caso do padrão de crédito |

## Fundamentos: a hipótese que sustenta tudo

Todo Machine Learning supervisionado repousa numa hipótese que raramente é dita em voz alta:

> Os dados de treino e os dados que o modelo verá em produção vêm da **mesma distribuição**.

Se essa hipótese vale, minimizar o erro nos exemplos que você tem é uma aproximação razoável de minimizar o erro nos exemplos que virão. Isso tem nome, **minimização do risco empírico** (*Empirical Risk Minimization*, ERM), e é o que praticamente todo algoritmo de treino faz.

Se a hipótese não vale, tudo o que vem depois é decoração. E ela **frequentemente não vale**:

- Você treinou com dados de 2024 e opera em 2026 (o mundo mudou — *drift*, cap. V.3).
- Você treinou com clientes que a empresa já tinha e vai operar sobre clientes novos (viés de seleção, cap. I.3).
- Você treinou com fotos bem iluminadas e vai operar no escuro (mudança de domínio, cap. III.4).

Guarde isto: **a métrica de teste é uma promessa condicional.** Ela diz "se o futuro se parecer com este conjunto, o erro será aproximadamente este". Quando alguém reporta uma métrica sem dizer sob qual condição ela vale, está reportando meia informação.

### As três divisões, e por que são três

| Conjunto | Para que serve | Quantas vezes se olha |
|---|---|---|
| **Treino** | ajustar os parâmetros do modelo | o tempo todo |
| **Validação** | escolher entre modelos, ajustar hiperparâmetros, decidir quando parar | muitas vezes — é para isso que existe |
| **Teste** | estimar o erro de generalização | **o mínimo possível**, idealmente uma vez |

A razão de o teste ser separado da validação é sutil e cara de aprender na prática. Cada vez que você olha a validação e muda algo por causa do que viu, você está usando aquele conjunto para tomar uma decisão — e, aos poucos, ajustando o modelo *àquele conjunto*. Com dezenas de decisões, o número da validação vira otimista: você fez overfitting na própria medição.

O teste existe para ser a testemunha que não foi coagida. Toda vez que você o consulta e reage ao que viu, ele perde um pouco dessa qualidade. Não há alarme, não há erro na tela: o número simplesmente vai ficando menos verdadeiro.

### Quando os dados são poucos: validação cruzada

Separar um pedaço fixo para validação custa caro quando há pouca linha: o modelo treina com menos, e a estimativa fica ruidosa porque depende de quais exemplos calharam de ficar de fora.

A **validação cruzada** resolve isso por rodízio. Divide-se o treino em $k$ partes iguais, cada uma chamada de **dobra** (*fold*). Treina-se em $k-1$ delas e mede-se na que sobrou. Repete-se até cada dobra ter sido a juíza uma vez. O resultado é a média das $k$ medições, e o desvio entre elas já diz quanto a estimativa é instável.

Três coisas que a definição não deixa ver e custam caro:

- **O teste continua fora disso, intocado.** A validação cruzada substitui a divisão de validação, não a de teste.
- **Todo pré-processamento entra no laço.** Padronizar, imputar, codificar pelo alvo — tudo tem de ser calculado **dentro de cada dobra**, só com o treino daquela dobra. Calcular antes, com o dado inteiro, é o vazamento do [capítulo I.3](capitulos/i-3-dados.md), repetido $k$ vezes.
- **Se houver grupo ou tempo no problema**, as dobras precisam respeitá-los. Cinco dobras embaralhadas erradas dão uma estimativa errada com intervalo estreito — pior que uma estimativa errada e obviamente incerta.

:::exercicio {"id":"fundamentos-e1","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Uma equipe testa 40 configurações de modelo, medindo cada uma no conjunto de teste, e reporta a melhor: 94,2% de acurácia. Qual é o problema mais grave dessa prática?

- [ ] Nenhum: testar muitas configurações é justamente o que se deve fazer.
- [ ] O problema é o custo computacional de 40 treinos.
- [x] O 94,2% é otimista: escolher o máximo entre 40 medições ruidosas seleciona também a sorte, e o teste deixou de ser uma estimativa imparcial.
- [ ] O problema é que 40 configurações é pouco para explorar bem o espaço.

> **gabarito:** O 94,2% é otimista
> **porque:** Cada medição no teste carrega ruído amostral. Ao tomar o **máximo** de 40 medições ruidosas, você seleciona sistematicamente as configurações que tiveram sorte naquele conjunto específico — e a sorte não se repete. O número reportado passa a conter uma parcela de acaso que será cobrada em produção. A correção é estrutural, não estatística: comparar as 40 configurações na **validação**, escolher uma, e só então medir essa uma no teste. Note que o custo computacional (alternativa 2) é uma questão real, mas menor: dinheiro se resolve com dinheiro; uma estimativa contaminada leva a decisão errada e ninguém percebe.
> **volte para:** #as-tres-divisoes-e-por-que-sao-tres
:::

:::exercicio {"id":"fundamentos-e11","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Segundo a tabela das três divisões, quantas vezes se olha para cada conjunto?

- [ ] Treino uma vez, validação uma vez, teste muitas vezes.
- [x] Treino o tempo todo, validação muitas vezes, teste o mínimo possível.
- [ ] Os três o mesmo número de vezes: é o que torna a comparação justa.
- [ ] Validação o mínimo possível, teste muitas vezes, porque o teste é maior.

> **gabarito:** treino o tempo todo, validação muitas vezes, teste o mínimo possível
> **porque:** A validação existe **para** ser olhada muitas vezes: é nela que você compara modelos, ajusta hiperparâmetro e decide quando parar. Olhar muito para ela não é abuso, é a função dela.
>
> O teste é o oposto, e a assimetria é o ponto de toda a seção. Ele estima o erro de generalização, e essa estimativa só vale enquanto nenhuma decisão sua tiver sido tomada com base nele. A terceira alternativa parece equilibrada e é o erro exato: tratar os três igualmente destrói justamente o que torna o teste útil.
> **volte para:** #as-tres-divisoes-e-por-que-sao-tres
:::

:::exercicio {"id":"fundamentos-e5","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
O modelo A erra 2% no treino e 9% na validação. O modelo B erra 6% no treino e 7% na validação. Qual dos dois generaliza melhor?

- [ ] O A, porque o erro de treino dele é três vezes menor.
- [x] O B, porque generalizar é errar pouco no que ainda não se viu, e é onde ele erra menos.
- [ ] Empatam: a soma dos dois erros é parecida nos dois modelos.
- [ ] Não dá para dizer sem saber o erro dos dois no teste.

> **gabarito:** o B
> **porque:** Generalização é uma afirmação sobre o erro no que virá, e o único dado disponível sobre isso é o erro na validação: 9% contra 7%. O erro de treino do A é menor e não interessa — ele mede o desempenho nos exemplos que o próprio modelo usou para se ajustar, que é a pergunta que ninguém precisa responder.
>
> A última alternativa merece cuidado porque parece rigor. Consultar o teste para escolher entre A e B é exatamente o que o teste não pode fazer: no instante em que ele decide, deixa de ser testemunha e vira validação. A decisão é na validação, e o teste vem depois, uma vez.
> **volte para:** #o-problema-decorar-nao-e-aprender
:::

:::exercicio {"id":"fundamentos-e6","tipo":"multipla-multi","objetivo":"O1","dificuldade":"media"}
"A métrica de teste é uma promessa condicional." Quais consequências decorrem dessa frase? (marque todas que valem)

- [x] Reportar uma métrica sem dizer sobre qual conjunto ela foi medida é reportar meia informação.
- [x] Um modelo pode estar certo e a métrica dele deixar de valer, sem que nada no modelo tenha mudado.
- [ ] Métricas de teste são pouco confiáveis e devem ser substituídas por avaliação qualitativa.
- [x] Antes de acreditar num número, cabe perguntar se os dados de produção se parecem com os de teste.
- [ ] Se a acurácia de teste for alta o bastante, a condição deixa de importar.

> **gabarito:** meia informação sem a condição · pode deixar de valer sem o modelo mudar · cabe perguntar se produção se parece com o teste
> **porque:** A palavra **condicional** é o que carrega as três corretas. A promessa tem a forma "se o futuro se parecer com este conjunto, o erro será aproximadamente este" — então a condição é parte do número, e omiti-la é omitir metade dele.
>
> As duas erradas erram em direções opostas, e as duas são comuns. Concluir que métrica não presta é jogar fora a única evidência quantitativa disponível: a promessa é condicional, não vazia. E imaginar que um valor alto dispensa a condição inverte a lógica: quanto mais alto o número, mais caro sai descobrir tarde que a condição não valia.
> **volte para:** #fundamentos-a-hipotese-que-sustenta-tudo
:::

## A decomposição viés–variância

Quando um modelo erra, o erro esperado se decompõe em três parcelas — e cada uma pede uma ação diferente. Esta é provavelmente a ferramenta de diagnóstico mais útil do livro inteiro.

**Viés (*bias*)** — o erro de suposição. O modelo é sistematicamente incapaz de representar o padrão. Uma reta tentando descrever uma curva tem viés alto: não importa quantos dados você dê, ela continuará errando do mesmo jeito, na mesma direção.

**Variância** — o erro de instabilidade. O modelo é tão sensível aos dados específicos que recebeu que, treinado em outra amostra do mesmo fenômeno, produziria algo bem diferente. Variância alta é o sintoma matemático do overfitting.

**Ruído irredutível** — a parte que nenhum modelo alcança, porque o próprio fenômeno é aleatório ou porque a informação necessária não está nos dados. Perseguir essa parcela é o modo mais eficiente de desperdiçar um trimestre.

### O diagnóstico prático

O sintoma é visível nas duas curvas de erro:

| Erro no treino | Erro na validação | Diagnóstico | O que fazer |
|---|---|---|---|
| alto | alto (parecido) | **viés alto** (underfitting) | modelo mais expressivo; melhores atributos; treinar mais |
| baixo | alto (bem maior) | **variância alta** (overfitting) | mais dados; regularização; modelo mais simples |
| baixo | baixo | bom — verifique se não há vazamento | vá ao teste, **uma vez** |
| alto | baixo | quase sempre um bug | investigue a divisão dos dados antes de comemorar |

A última linha merece atenção. Erro de validação *melhor* que o de treino costuma indicar que os conjuntos não são comparáveis — uma divisão mal feita, um vazamento invertido, ou regularização forte aplicada só no treino. É um resultado bom demais, e resultados bons demais são a pista mais confiável de que algo está errado (cap. I.3).

**Uma advertência sobre a decomposição.** A ideia de que mais capacidade sempre aumenta a variância é uma simplificação útil, e é *falsa* no regime das redes modernas. Modelos muito grandes, treinados muito além do ponto de interpolação, frequentemente voltam a generalizar bem, num fenômeno chamado **double descent** ([Belkin et al., 2019](https://doi.org/10.1073/pnas.1903070116), ✓). A intuição viés–variância continua sendo a melhor ferramenta de diagnóstico para o regime clássico, que é onde vive a maior parte do trabalho tabular deste livro, mas **não é uma lei universal**, e o capítulo III.2 volta ao assunto.

> **Cláusula de expiração.** Escrevo em 2026 que a decomposição viés–variância é a ferramenta de diagnóstico dominante na prática tabular, e que o *double descent* é entendido como fenômeno do regime superparametrizado. Se, na próxima revisão, existir uma teoria unificada que preveja quantitativamente o comportamento de generalização nos dois regimes, esta seção precisa ser reescrita — não apenas emendada. Acompanhamento no [placar de expiração](HISTORICO.md).

:::exercicio {"id":"fundamentos-e2","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Um modelo atinge 0,98 de acurácia no treino e 0,71 na validação. Qual é o diagnóstico e a primeira ação razoável?

- [ ] Viés alto: aumentar a capacidade do modelo.
- [x] Variância alta: regularizar, simplificar o modelo ou conseguir mais dados.
- [ ] Ruído irredutível: aceitar o resultado, é o teto do problema.
- [ ] Impossível diagnosticar sem ver o erro no teste.

> **gabarito:** Variância alta
> **porque:** A assinatura é o **vão** entre treino e validação: 0,98 contra 0,71. O modelo tem capacidade de sobra: consegue explicar quase perfeitamente os dados que viu, mas o que aprendeu não se transfere. Isso é variância alta, ou seja, overfitting. Aumentar a capacidade (alternativa 1) pioraria; o sintoma de viés alto seria erro **alto nos dois** conjuntos, e próximos entre si. E note por que a última alternativa é errada e perigosa: você não precisa, nem deve, consultar o teste para fazer esse diagnóstico. Diagnóstico se faz na validação; o teste é a testemunha que se preserva.
> **volte para:** #o-diagnostico-pratico
:::

:::exercicio {"id":"fundamentos-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Um modelo erra 31% no treino e 33% na validação. Qual é o diagnóstico?

- [x] Viés alto: o modelo é simples demais para o padrão, e erra parecido nos dois conjuntos.
- [ ] Variância alta: 33% de erro na validação é muito.
- [ ] Está bom: os dois números são próximos, que é o que se quer.
- [ ] Vazamento de dados: erros tão parecidos indicam que os conjuntos se misturaram.

> **gabarito:** viés alto
> **porque:** O diagnóstico não se lê no nível do erro, e sim na relação entre os dois. Erro **alto e parecido** nos dois conjuntos é a assinatura de viés alto: o modelo erra do mesmo jeito em toda parte porque não consegue representar o padrão, e mais dados não resolveriam isso.
>
> A terceira alternativa é a armadilha desta linha da tabela. Números próximos são condição necessária de um modelo saudável, não suficiente: próximos **e altos** é underfitting, próximos e baixos é o caso bom. Confundir os dois faz uma equipe parar de melhorar um modelo que ainda tinha muito a ganhar.
> **volte para:** #o-diagnostico-pratico
:::

:::exercicio {"id":"fundamentos-e8","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Um estagiário mostra o resultado, animado: 18% de erro no treino e 9% na validação. Qual é a leitura correta?

- [ ] Excelente: o modelo generaliza melhor do que memoriza, que é o objetivo.
- [ ] Viés alto no treino e variância baixa na validação, uma combinação incomum mas boa.
- [x] Quase sempre um bug: erro de validação melhor que o de treino indica conjuntos não comparáveis, e a divisão precisa ser investigada antes de qualquer comemoração.
- [ ] Ruído irredutível alto no treino, que a validação por acaso não tem.

> **gabarito:** quase sempre um bug
> **porque:** É a última linha da tabela, e a única cujo "o que fazer" não é técnica de modelagem, e sim investigação. As causas típicas são três: uma divisão mal feita, em que a validação ficou mais fácil que o treino, um vazamento invertido, ou regularização forte aplicada apenas durante o treino, que infla o erro medido lá dentro.
>
> A primeira alternativa é a leitura que quase todo mundo faz na primeira vez, e é sedutora porque usa o vocabulário certo. Mas generalizar melhor do que se ajusta é uma afirmação sem sentido: o modelo viu os dados de treino, e um desempenho pior justamente onde ele teve mais informação não descreve nenhum mecanismo de aprendizado.
>
> A regra prática que fica vale para o livro inteiro: resultado bom demais é a pista mais confiável de que algo está errado. É o mesmo instinto do [capítulo I.3](capitulos/i-3-dados.md), aplicado antes de haver qualquer suspeita.
> **volte para:** #o-diagnostico-pratico
:::

:::exercicio {"id":"fundamentos-e9","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Uma equipe prevê se um paciente vai faltar à consulta. Nos últimos quatro meses trocou de modelo cinco vezes, quadruplicou os atributos e ajustou hiperparâmetros à exaustão. O erro de validação melhorou de 27% para 26,4% e não sai dali, sempre próximo do erro de treino. Qual parcela do erro explica melhor esse platô, e o que fazer?

- [ ] Variância: os modelos estão instáveis, e falta regularização.
- [ ] Viés: nenhum dos modelos testados tem capacidade suficiente.
- [x] Ruído irredutível: a informação que decidiria o caso não está nos dados, e a ação é buscar informação nova ou parar.
- [ ] Vazamento: um platô tão estável indica que a divisão está contaminada.

> **gabarito:** ruído irredutível
> **porque:** Duas pistas apontam para a mesma parcela. O erro de validação está **próximo** do de treino, o que descarta variância alta. E cinco modelos de capacidades diferentes chegaram ao mesmo lugar, o que torna viés uma explicação frágil: se fosse falta de expressividade, algum dos cinco teria andado.
>
> Sobra a terceira parcela, e ela é a única cuja ação não é de modelagem. Se a decisão depende de algo que não está na tabela (o paciente teve transporte naquele dia, alguém da família adoeceu), nenhum modelo alcança. As duas saídas honestas são buscar uma fonte de informação nova ou declarar o teto e parar.
>
> Reconhecer isso cedo é o que o capítulo chama de não desperdiçar um trimestre. O sinal de alerta é justamente o que a equipe viveu: muito esforço, muitas trocas, ganho marginal estável.
> **volte para:** #a-decomposicao-vies-variancia
:::

:::exercicio {"id":"fundamentos-e10","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Você herda um modelo de previsão de demanda com 4% de erro no treino e 19% na validação. Depois de dobrar a base de dados, os números passam a 7% e 15%. Depois de dobrar de novo, 9% e 14%.

Decomponha o que está acontecendo em viés, variância e ruído, e diga qual é a próxima ação — e qual você já pode descartar, com base nesses números.

> **rubrica:** lê a primeira medição como variância alta, pelo vão de 15 pontos entre treino e validação;
> lê a trajetória corretamente: mais dados reduziram o vão de 15 para 5 pontos, que é o efeito esperado sobre variância;
> repara que o ganho está desacelerando, porque a segunda duplicação melhorou a validação em apenas 1 ponto contra 4 da primeira;
> conclui que continuar dobrando a base é a ação com o pior retorno esperado, e justifica pela desaceleração e não por opinião;
> propõe uma ação coerente com o que sobrou, como mais capacidade ou melhores atributos para atacar viés, ou investigar quanto do erro restante é irredutível
> **porque:** O exercício pede a leitura de uma **trajetória**, e não de um retrato. Um retrato isolado diz onde você está; a trajetória diz para onde a ação que você tomou estava levando, o que é a informação que decide a próxima.
>
> A resposta fraca diagnostica a primeira linha, acerta "variância alta" e recomenda mais dados. É a resposta certa para a pergunta de ontem: os dados já foram dobrados duas vezes, e a própria série mostra o retorno caindo.
>
> A resposta forte percebe que as duas parcelas trocaram de lugar. O erro de treino subiu de 4% para 9%, que é o esperado quando mais dados impedem o modelo de decorar, e o vão encolheu de 15 para 5 pontos. Sobra um erro de 14% em que treino e validação já estão próximos — a assinatura da qual variância não é mais o principal suspeito. A partir daí a decisão é entre atacar viés e medir o teto do problema, e as duas são defensáveis desde que declaradas.
> **volte para:** #o-diagnostico-pratico
:::

:::exercicio {"id":"fundamentos-e3","tipo":"completar","objetivo":"O3","dificuldade":"facil"}
Complete o termo que falta na decomposição do erro esperado de um modelo:

`erro esperado ≈ viés² + ______ + ruído irredutível`

> **gabarito:** variância|variancia
> **porque:** A decomposição clássica tem três parcelas: o **viés²** (o quanto o modelo erra sistematicamente, por não conseguir representar o padrão), a **variância** (o quanto ele oscila conforme a amostra de treino muda) e o ruído irredutível (o que nenhum modelo alcança). O valor prático de decorar isto não é a fórmula: é que cada parcela pede uma ação diferente, viés pede mais expressividade, variância pede mais dados ou mais restrição, e ruído pede que você pare.
> **volte para:** #a-decomposicao-vies-variancia
:::

## O vocabulário mínimo

Estes termos aparecem em todos os capítulos seguintes. Estão também no [Glossário](glossario.md).

- **Exemplo** (ou *instância*, *observação*) — uma linha: um cliente, uma foto, uma transação.
- **Atributo** (*feature*) — uma coluna: idade, pixel 37, quantidade de palavras.
- **Alvo** (*target*, *label*) — o que se quer prever. Sua presença define o aprendizado como **supervisionado**.
- **Modelo** — a função que mapeia atributos ao alvo, mais os parâmetros que a especificam.
- **Parâmetro** — o que o treino ajusta (pesos). **Hiperparâmetro** — o que você escolhe antes do treino (taxa de aprendizado, profundidade). A confusão entre os dois causa metade dos erros de metodologia.
- **Função de perda** — a medida do quanto uma predição errou; é o que a otimização minimiza.
- **Métrica** — a medida que interessa a **você**. Nem sempre é a perda; quase nunca deveria ser (cap. II.1).

A distinção entre perda e métrica é a fonte de mal-entendidos mais persistente para quem está começando. A perda precisa ser diferenciável e bem-comportada para o otimizador; a métrica precisa ser interpretável e ligada à consequência no mundo. São propósitos diferentes, e otimizar a primeira esperando melhorar a segunda é uma aposta — às vezes boa, nunca automática.

## Mão na massa

A **etapa 00** do [`ml-zero`](trilha-ml-zero.md) monta o esqueleto: carregar um dataset, dividir em treino/validação/teste com *seed* fixa, e treinar a linha de base mais burra possível (prever sempre a classe majoritária).

Parece pouco. É o número mais importante do projeto: **nenhum modelo que não bate a linha de base merece existir**, e um número surpreendente de projetos em produção nunca calculou a sua.


**Notebook pronto para executar** — [`linha_de_base.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-00/linha_de_base.ipynb) · [abrir no Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-00/linha_de_base.ipynb)

Monta as três divisões, treina a linha de base e mostra por que **81% de acurácia pode ser um resultado péssimo** — o modelo não encontra um único positivo.

> Na sua máquina: `pip install notebook` e `jupyter notebook`, ou abra a pasta no VS Code. O notebook **não precisa do repositório clonado** — se você estiver no Colab, ele baixa sozinho os arquivos de que precisa. Como rodar a trilha inteira: [`ml-zero`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/README.md).

## Assista

:::video {"id":"fundamentos-v1","fonte":"youtube","ref":"EuBBz3bI-aA","min":7,"autor":"StatQuest with Josh Starmer","titulo":"Machine Learning Fundamentals: Bias and Variance"}
A decomposição viés–variância é um daqueles conceitos que a prosa explica e o **gráfico** fixa. O vídeo mostra ajustes sucessivos ao mesmo conjunto de pontos, e a intuição visual de "a curva balança demais quando os dados mudam" é o que faz o termo *variância* deixar de ser jargão e virar algo que você reconhece de longe num gráfico de treino.
:::

## Síntese — o que levar

- Aprender é **generalizar**, não acertar no que já se viu.
- Toda métrica de teste é uma promessa condicional: vale enquanto o futuro se parecer com o teste.
- O vão entre treino e validação é seu diagnóstico primário: vão grande = variância; erro alto nos dois = viés.
- **Validação para decidir, teste para testemunhar.** Consultar o teste repetidamente não dá erro — só torna o número mentiroso.
- Antes de qualquer modelo, calcule a linha de base trivial. É o piso contra o qual todo o resto se mede.

:::exercicio {"id":"fundamentos-e4","tipo":"aberta","objetivo":"O1","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Explique, **sem usar a palavra "overfitting"** nem sinônimo dela, por que um modelo pode ir muito bem no treino e mal em produção. A proibição é o exercício: o nome está barrado justamente porque nomear parece explicar.

> **rubrica:** distingue as duas quantidades (o erro medido no que o modelo já viu e o erro esperado no que ele ainda não viu) e deixa claro que só a segunda interessa;
> aponta ao menos um mecanismo concreto pelo qual o desempenho no treino deixa de valer fora dele — o modelo se apoiou em particularidade da amostra, ou a amostra não representava o mundo, ou o mundo mudou depois;
> nomeia a hipótese que precisa valer para o passado informar o futuro, que é os dados de produção virem da mesma distribuição, e diz o que acontece com a promessa quando ela falha;
> não substitui a explicação pelo nome: dizer que "o modelo decorou" sem dizer **o que** foi decorado, e por que aquilo não se repete fora da amostra, não atende
> **porque:** A palavra foi proibida porque é um atalho que fecha a pergunta em vez de responder. "Deu overfitting" rotula o sintoma e para ali — e quem para ali não consegue decidir o que fazer, porque os três mecanismos acima pedem ações diferentes: regularizar, coletar dado representativo, ou monitorar e retreinar.
>
> A resposta completa passa pelas duas quantidades e pela ponte entre elas. O erro de treino é **medido**; o erro futuro é **esperado**, e a esperança se apoia numa hipótese — mesma distribuição. Todo número deste livro é promessa condicional a ela, e é por isso que o capítulo insiste que métrica de teste não é certificado: é aposta com prazo.
>
> Repare que o terceiro mecanismo, o mundo mudou, **não é falha de treino nenhuma**: o modelo estava certo e o mundo saiu de baixo dele. Chamar isso de "overfitting" é o erro de diagnóstico mais caro do capítulo [V.3](capitulos/v-3-mlops.md), e é exatamente o que o rótulo esconde.
> **volte para:** #fundamentos-a-hipotese-que-sustenta-tudo
:::

:::exercicio {"id":"fundamentos-e12","tipo":"aberta","objetivo":"O4","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** O modelo foi medido no teste: 91%. Uma correção pequena foi feita depois disso, e a gerência pede para medir de novo no teste, "só para confirmar que a correção não piorou nada". O pedido é razoável e a pessoa que o faz não está sendo descuidada.

Escreva a resposta que você daria. Justifique por que a segunda medição custa alguma coisa, diga o que essa coisa é, e proponha o que fazer no lugar.

> **rubrica:** explica que a segunda medição não é gratuita porque o resultado dela vai influenciar uma decisão, e é isso que consome a independência do conjunto;
> deixa claro o que se perde, que é a imparcialidade da estimativa, e não a validade do dado ou o acesso ao arquivo;
> reconhece que nada quebra visivelmente: não há erro na tela, o número apenas fica menos verdadeiro a cada consulta;
> propõe medir a correção na validação, e reservar o teste para uma medição final declarada;
> trata o pedido como legítimo e responde a ele, em vez de apenas citar a regra
> **porque:** A dificuldade deste exercício não é técnica, é de argumentação. A regra "não toque no teste" é fácil de recitar e difícil de defender diante de alguém que está sendo cuidadoso — e recitá-la sem defender é como a regra morre na prática, porque a gerência tem uma razão e você tem uma citação.
>
> O argumento que funciona é o do mecanismo. Se a segunda medição pudesse mudar o que a equipe faz (reverter a correção, ajustá-la, adiar o lançamento), então ela é uma decisão tomada com o teste, e o teste passa a fazer parte do processo de ajuste. O 91% inicial era uma estimativa imparcial. O número seguinte, obtido depois de um ciclo de reação, já carrega escolha.
>
> A resposta excelente nota que o custo é invisível, e é por isso que a prática se degrada: não existe alarme. Uma equipe pode consultar o teste doze vezes sem ver nada de errado, e descobrir a diferença apenas em produção, quando não há mais como saber quanto do número era real.
>
> E oferece a saída: medir a correção na validação, que existe exatamente para isso, e combinar de antemão uma única medição final no teste, declarada como tal no relatório.
> **volte para:** #as-tres-divisoes-e-por-que-sao-tres
:::

## Verificação

1. Você recebe um relatório com acurácia de 0,93 no teste. Que três perguntas você faz antes de acreditar?
2. Um colega quer "usar o teste para escolher o melhor de três modelos, porque é o conjunto mais confiável". Onde está o erro do raciocínio?

> Estas duas não são corrigidas, e a omissão é deliberada: valem pelo desacordo que produzem numa conversa, e a resposta que interessa é a que você sustenta diante de alguém.
