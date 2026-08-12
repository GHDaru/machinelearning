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

**O aperto, e ele não nasceu na computação.** Em **1931**, um psicometrista de sobrenome **Larson** tinha um problema prático e irritante: ao ajustar uma regressão múltipla numa amostra e aplicá-la a outra, o coeficiente de correlação **encolhia**. Sempre. O artigo dele chama-se, literalmente, *"The Shrinkage of the Coefficient of Multiple Correlation"*. O aperto era esse — um número que descrevia bem os dados que o produziram e mentia sobre os próximos.

**O que se fazia antes.** Avaliava-se o modelo nos mesmos dados em que ele foi ajustado, e o resultado era tomado como estimativa da qualidade. Não por ingenuidade: dado era caro, e separar metade dele para não usar parecia desperdício.

**A virada.** Guardar dados que o modelo **não vê**. É uma ideia quase ofensiva de simples, e é a mais importante deste livro inteiro. Depois vieram as economias em cima dela: **Mosteller e Tukey (1968)** formulam o *leave-one-out*; **Stone (1974)** e **Geisser (1975)** constroem o arcabouço da validação cruzada. Note que Stone **cita explicitamente** Larson, Mosteller & Tukey e outros: o que ele traz de novo **não é a prática, é o arcabouço** que a justifica.

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

Se essa hipótese vale, minimizar o erro nos exemplos que você tem é uma aproximação razoável de minimizar o erro nos exemplos que virão. Isso tem nome — **minimização do risco empírico** (*Empirical Risk Minimization*, ERM) — e é o que praticamente todo algoritmo de treino faz.

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

**Uma advertência sobre a decomposição.** A ideia de que mais capacidade sempre aumenta a variância é uma simplificação útil — e é *falsa* no regime das redes modernas. Modelos muito grandes, treinados muito além do ponto de interpolação, frequentemente voltam a generalizar bem, num fenômeno chamado **double descent** ([Belkin et al., 2019](https://doi.org/10.1073/pnas.1903070116), ✓). A intuição viés–variância continua sendo a melhor ferramenta de diagnóstico para o regime clássico — que é onde vive a maior parte do trabalho tabular deste livro — mas **não é uma lei universal**, e o capítulo III.2 volta ao assunto.

> **Cláusula de expiração.** Escrevo em 2026 que a decomposição viés–variância é a ferramenta de diagnóstico dominante na prática tabular, e que o *double descent* é entendido como fenômeno do regime superparametrizado. Se, na próxima revisão, existir uma teoria unificada que preveja quantitativamente o comportamento de generalização nos dois regimes, esta seção precisa ser reescrita — não apenas emendada. Acompanhamento no [placar de expiração](HISTORICO.md).

:::exercicio {"id":"fundamentos-e2","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Um modelo atinge 0,98 de acurácia no treino e 0,71 na validação. Qual é o diagnóstico e a primeira ação razoável?

- [ ] Viés alto: aumentar a capacidade do modelo.
- [x] Variância alta: regularizar, simplificar o modelo ou conseguir mais dados.
- [ ] Ruído irredutível: aceitar o resultado, é o teto do problema.
- [ ] Impossível diagnosticar sem ver o erro no teste.

> **gabarito:** Variância alta
> **porque:** A assinatura é o **vão** entre treino e validação: 0,98 contra 0,71. O modelo tem capacidade de sobra — ele consegue explicar quase perfeitamente os dados que viu — mas o que aprendeu não se transfere. Isso é variância alta, ou seja, overfitting. Aumentar a capacidade (alternativa 1) pioraria; o sintoma de viés alto seria erro **alto nos dois** conjuntos, e próximos entre si. E note por que a última alternativa é errada e perigosa: você não precisa — nem deve — consultar o teste para fazer esse diagnóstico. Diagnóstico se faz na validação; o teste é a testemunha que se preserva.
> **volte para:** #o-diagnostico-pratico
:::

:::exercicio {"id":"fundamentos-e3","tipo":"completar","objetivo":"O3","dificuldade":"facil"}
Complete o termo que falta na decomposição do erro esperado de um modelo:

`erro esperado ≈ viés² + ______ + ruído irredutível`

> **gabarito:** variância|variancia
> **porque:** A decomposição clássica tem três parcelas: o **viés²** (o quanto o modelo erra sistematicamente, por não conseguir representar o padrão), a **variância** (o quanto ele oscila conforme a amostra de treino muda) e o **ruído irredutível** (o que nenhum modelo alcança). O valor prático de decorar isto não é a fórmula — é que cada parcela pede uma ação diferente: viés pede mais expressividade, variância pede mais dados ou mais restrição, e ruído pede que você pare.
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

## Verificação

1. Explique, sem usar a palavra "overfitting", por que um modelo pode ir muito bem no treino e mal em produção.
2. Você recebe um relatório com acurácia de 0,93 no teste. Que três perguntas você faz antes de acreditar?
3. Um colega quer "usar o teste para escolher o melhor de três modelos, porque é o conjunto mais confiável". Onde está o erro do raciocínio?
