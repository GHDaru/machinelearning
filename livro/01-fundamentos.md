# 01 — Fundamentos

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](HISTORICO.md)

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

## Fundamentos: a hipótese que sustenta tudo

Todo Machine Learning supervisionado repousa numa hipótese que raramente é dita em voz alta:

> Os dados de treino e os dados que o modelo verá em produção vêm da **mesma distribuição**.

Se essa hipótese vale, minimizar o erro nos exemplos que você tem é uma aproximação razoável de minimizar o erro nos exemplos que virão. Isso tem nome — **minimização do risco empírico** (*Empirical Risk Minimization*, ERM) — e é o que praticamente todo algoritmo de treino faz.

Se a hipótese não vale, tudo o que vem depois é decoração. E ela **frequentemente não vale**:

- Você treinou com dados de 2024 e opera em 2026 (o mundo mudou — *drift*, cap. 16).
- Você treinou com clientes que a empresa já tinha e vai operar sobre clientes novos (viés de seleção, cap. 02).
- Você treinou com fotos bem iluminadas e vai operar no escuro (mudança de domínio, cap. 10).

Guarde isto: **a métrica de teste é uma promessa condicional.** Ela diz "se o futuro se parecer com este conjunto, o erro será aproximadamente este". Quando alguém reporta uma métrica sem dizer sob qual condição ela vale, está reportando meia informação.

### As três divisões, e por que são três

| Conjunto | Para que serve | Quantas vezes se olha |
|---|---|---|
| **Treino** | ajustar os parâmetros do modelo | o tempo todo |
| **Validação** | escolher entre modelos, ajustar hiperparâmetros, decidir quando parar | muitas vezes — é para isso que existe |
| **Teste** | estimar o erro de generalização | **o mínimo possível**, idealmente uma vez |

A razão de o teste ser separado da validação é sutil e cara de aprender na prática. Cada vez que você olha a validação e muda algo por causa do que viu, você está usando aquele conjunto para tomar uma decisão — e, aos poucos, ajustando o modelo *àquele conjunto*. Com dezenas de decisões, o número da validação vira otimista: você fez overfitting na própria medição.

O teste existe para ser a testemunha que não foi coagida. Toda vez que você o consulta e reage ao que viu, ele perde um pouco dessa qualidade. Não há alarme, não há erro na tela: o número simplesmente vai ficando menos verdadeiro.

:::exercicio {"id":"01-e1","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
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

A última linha merece atenção. Erro de validação *melhor* que o de treino costuma indicar que os conjuntos não são comparáveis — uma divisão mal feita, um vazamento invertido, ou regularização forte aplicada só no treino. É um resultado bom demais, e resultados bons demais são a pista mais confiável de que algo está errado (cap. 02).

**Uma advertência sobre a decomposição.** A ideia de que mais capacidade sempre aumenta a variância é uma simplificação útil — e é *falsa* no regime das redes modernas. Modelos muito grandes, treinados muito além do ponto de interpolação, frequentemente voltam a generalizar bem, num fenômeno chamado **double descent** ([Belkin et al., 2019](https://doi.org/10.1073/pnas.1903070116), ✓). A intuição viés–variância continua sendo a melhor ferramenta de diagnóstico para o regime clássico — que é onde vive a maior parte do trabalho tabular deste livro — mas **não é uma lei universal**, e o capítulo 09 volta ao assunto.

> **Cláusula de expiração.** Escrevo em 2026 que a decomposição viés–variância é a ferramenta de diagnóstico dominante na prática tabular, e que o *double descent* é entendido como fenômeno do regime superparametrizado. Se, na próxima revisão, existir uma teoria unificada que preveja quantitativamente o comportamento de generalização nos dois regimes, esta seção precisa ser reescrita — não apenas emendada. Acompanhamento no [placar de expiração](HISTORICO.md).

:::exercicio {"id":"01-e2","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Um modelo atinge 0,98 de acurácia no treino e 0,71 na validação. Qual é o diagnóstico e a primeira ação razoável?

- [ ] Viés alto: aumentar a capacidade do modelo.
- [x] Variância alta: regularizar, simplificar o modelo ou conseguir mais dados.
- [ ] Ruído irredutível: aceitar o resultado, é o teto do problema.
- [ ] Impossível diagnosticar sem ver o erro no teste.

> **gabarito:** Variância alta
> **porque:** A assinatura é o **vão** entre treino e validação: 0,98 contra 0,71. O modelo tem capacidade de sobra — ele consegue explicar quase perfeitamente os dados que viu — mas o que aprendeu não se transfere. Isso é variância alta, ou seja, overfitting. Aumentar a capacidade (alternativa 1) pioraria; o sintoma de viés alto seria erro **alto nos dois** conjuntos, e próximos entre si. E note por que a última alternativa é errada e perigosa: você não precisa — nem deve — consultar o teste para fazer esse diagnóstico. Diagnóstico se faz na validação; o teste é a testemunha que se preserva.
> **volte para:** #o-diagnostico-pratico
:::

:::exercicio {"id":"01-e3","tipo":"completar","objetivo":"O3","dificuldade":"facil"}
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
- **Métrica** — a medida que interessa a **você**. Nem sempre é a perda; quase nunca deveria ser (cap. 04).

A distinção entre perda e métrica é a fonte de mal-entendidos mais persistente para quem está começando. A perda precisa ser diferenciável e bem-comportada para o otimizador; a métrica precisa ser interpretável e ligada à consequência no mundo. São propósitos diferentes, e otimizar a primeira esperando melhorar a segunda é uma aposta — às vezes boa, nunca automática.

## Mão na massa

A **etapa 00** do [`ml-zero`](trilha-ml-zero.md) monta o esqueleto: carregar um dataset, dividir em treino/validação/teste com *seed* fixa, e treinar a linha de base mais burra possível (prever sempre a classe majoritária).

Parece pouco. É o número mais importante do projeto: **nenhum modelo que não bate a linha de base merece existir**, e um número surpreendente de projetos em produção nunca calculou a sua.

## Assista

:::video {"id":"01-v1","fonte":"youtube","ref":"EuBBz3bI-aA","min":7,"autor":"StatQuest with Josh Starmer","titulo":"Machine Learning Fundamentals: Bias and Variance"}
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
