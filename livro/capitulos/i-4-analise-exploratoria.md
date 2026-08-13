# I.4 — Análise Exploratória

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Calcular e interpretar medidas de tendência central e dispersão.
- **O2.** Escolher a medida adequada à distribuição — e detectar quando a média engana.
- **O3.** Formular hipóteses a partir de padrões observados, sem confirmá-las nos mesmos dados.
- **O4.** Identificar outliers e decidir, com critério declarado, o que fazer com eles.

## O problema: a rua em que ninguém ganha a média

Sete moradores de uma rua ganham entre 3 e 6 mil reais por mês. O oitavo ganha 400 mil.

A renda **média** da rua é 52 mil. O número está aritmeticamente correto e não descreve morador nenhum: não existe uma única pessoa perto dele. Um relatório que diga "renda média de R$ 52 mil" está tecnicamente certo e comunicacionalmente falso.

Antes de modelar, **olhe**. É a etapa que quase todo mundo pula e quase todo mundo lamenta ter pulado. A análise exploratória não é um relatório bonito: é a etapa em que você descobre que 30% da coluna de renda está zerada, que existem três grafias para a mesma cidade, e que o pico de vendas de março era um erro de importação. E o detalhe cruel é que **o modelo não reclama**: ele treina em cima do erro de importação, aprende o padrão errado e devolve uma métrica plausível. Quem tinha de reclamar era você, antes.

## De onde isto veio

**O aperto.** Início dos anos 1960. A estatística acadêmica havia se tornado quase sinônimo de **inferência formal**: testar, com rigor matemático, uma hipótese previamente formulada. Havia teoria elegante para a pergunta *"esse efeito é real?"* — e nenhum lugar legítimo para a etapa anterior, a de **olhar o dado antes de saber o que perguntar**.

**O que se fazia antes.** Ou se testava uma hipótese, ou não se estava fazendo estatística. Examinar os números sem hipótese na mão era, na melhor das hipóteses, uma preliminar informal que não entrava no artigo.

**A virada.** John Tukey nomeia **análise de dados** como disciplina própria, da qual a inferência é *um* componente, não o todo. É uma jogada de definição antes de ser técnica: uma vez que a exploração tem nome e estatuto, ela pode ter método. E aí vêm as ferramentas: o boxplot, o stem-and-leaf, e o hábito que atravessa tudo, o de preferir medidas **resistentes** a valores extremos.

**A ideia reaproveitável.** **Antes de testar a resposta, é preciso ter permissão para procurar a pergunta.** Um campo que só valoriza a etapa confirmatória fica cego para a etapa que *gera* a hipótese — e, pior, empurra essa etapa para a informalidade, onde ela acontece assim mesmo, só que sem método e sem registro. Vale muito além da estatística: teste automatizado só verifica o que alguém pensou em perguntar; nenhuma suíte verde descobre a pergunta que ninguém fez.

**O nome.** *Exploratory* opõe-se explicitamente a *confirmatory* — a dupla é dele, e **o par é o argumento**. Batizar a exploração sozinha seria dar nome a um hábito; com o par, vira divisão de trabalho: uma fase produz hipóteses, a outra as julga — e não se faz as duas com os mesmos dados.

| Quando | O quê |
|---|---|
| **1962** | ["The Future of Data Analysis"](https://www.stat.berkeley.edu/~brill/Papers/jwtencyc.pdf), nos *Annals of Mathematical Statistics* — o manifesto |
| **entre 1962 e 1977** | O material circula em cerca de três edições mimeografadas e pelas mãos dos alunos dele |
| **1977** | *Exploratory Data Analysis*, Addison-Wesley — [o livro](https://www.stat.berkeley.edu/~brill/Papers/EDASage.pdf) que virou a referência do assunto |

Repare no intervalo: **quinze anos** entre o manifesto e o livro. É o mesmo formato de 1943→1958 no [capítulo III.1](iii-1-neuronio-artificial.md) (neurônio → perceptron) e de 1927→1970 no [capítulo II.7](ii-7-series-temporais.md). **O intervalo é o conteúdo**: a ideia precisou de mais de uma década, de três rodadas de material mimeografado e de uma geração de alunos para deixar de ser heresia e virar cadeira de graduação. Tukey ainda reaparece na pré-história da validação cruzada ([capítulo 0.2](../0-2-fundamentos.md)) — a mesma intuição, aplicada a outro problema: não julgue com o dado que já foi usado para escolher.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | O aperto do início dos anos 1960 (a estatística acadêmica identificada à inferência formal) e a virada de Tukey — análise de dados como disciplina, com boxplot, *stem-and-leaf* e resistência |
| ✓ᵐ | A cronologia 1962 (*Annals of Mathematical Statistics*) → ~3 edições mimeografadas → 1977 (Addison-Wesley), pelas duas fontes ligadas acima — **localizadas, não lidas por inteiro** |
| ⏳ | Que, antes disso, "ou se testava uma hipótese, ou não se estava fazendo estatística" |
| ⏳ | Que o par *exploratory* / *confirmatory* é dele |
| ⏳ | A participação de Tukey na pré-história da validação cruzada (Mosteller & Tukey, 1968) |
| ⏳ | O quarteto de Anscombe (1973) e os valores citados adiante — atribuição corrente; primária não consultada |
| 📖 | A ideia reaproveitável ("permissão para procurar a pergunta") e a leitura do intervalo de 15 anos como padrão recorrente deste livro |

## Fundamentos: a média mente, a mediana aguenta

Volte à rua: `3, 3, 4, 4, 5, 6, 6, 400` (em milhares). A **média** é 52,1. A **mediana**, o valor que deixa metade dos dados de cada lado, é 4,5. A diferença não é de precisão, é de natureza: a média usa o *valor* de cada ponto, então um único extremo a arrasta sem limite; a mediana usa só a *posição*, e trocar o 400 por 4 milhões a deixa em 4,5. Isso se chama **resistência**, e é a propriedade que Tukey pôs no centro do método.

O mesmo par existe para dispersão:

| Pergunta | Distribuição simétrica, sem extremos | Assimétrica ou com extremos |
|---|---|---|
| Onde é o centro? | média | **mediana** |
| Quanto varia? | desvio-padrão | **IQR** (intervalo interquartil) = Q3 − Q1 |
| Que forma tem? | histograma | histograma **e** boxplot |

O desvio-padrão eleva as diferenças ao quadrado — o que dá ao ponto extremo um voto elevado ao quadrado. O IQR é a largura da faixa que contém os 50% centrais: ignora, por construção, as duas caudas.

**Como ler um boxplot.** A caixa vai de Q1 a Q3 (é o IQR), e o traço dentro dela é a mediana. Os "bigodes" se estendem até o ponto mais distante que ainda esteja dentro de 1,5 × IQR a partir da borda da caixa; o que sobra é desenhado como ponto individual. Três leituras saem de bater o olho: onde está o centro, quão espalhado é o meio dos dados, e se a mediana está descentrada dentro da caixa, que é sinal de assimetria.

**Assimetria é a regra, não a exceção.** Renda, tempo de resposta de API, valor de compra, número de sessões por usuário: quase tudo que tem piso em zero e não tem teto forma uma **cauda longa** à direita. Nessas distribuições, média > mediana sempre, e reportar a média é reportar a cauda.

:::exercicio {"id":"analise-exploratoria-e1","tipo":"numerica","objetivo":"O1","dificuldade":"facil"}
Os salários mensais (em milhares de reais) de sete funcionários de uma equipe são:

`3, 3, 4, 4, 5, 6, 40`

Qual é a **mediana** desse conjunto?

> **gabarito:** 4
> **porque:** Os valores já estão ordenados e são sete — ímpar. A mediana é o valor da posição central, a quarta: **4**. Não há conta a fazer; há uma posição a contar.
>
> Compare com a **média**: (3+3+4+4+5+6+40)/7 = 65/7 ≈ **9,3**. Seis dos sete funcionários ganham *menos* que a média, e nenhum ganha algo próximo dela. O salário de 40 puxa a média em mais de cinco unidades e não move a mediana em nada — se ele fosse 400, a média iria a 60,7 e a mediana continuaria 4.
>
> O erro mais comum aqui é dividir a soma por sete por reflexo, sem reparar no enunciado. O segundo é ordenar errado quando a lista vem embaralhada: mediana **exige** ordenação. Com número par de elementos, é a média dos dois centrais.
> **volte para:** #fundamentos-a-media-mente-a-mediana-aguenta
:::

## Olhe uma variável de cada vez

A análise monovariada é a primeira coisa que se faz e a que mais se pula. Antes de cruzar duas colunas, olhe **uma**: que tipo é, quantos valores distintos tem, onde está o centro, quanto ela varia, e o que há nas pontas.

:::lab {"id":"analise-exploratoria-l1","tipo":"explorar-variavel","titulo":"Análise monovariada — venda de limonada","colunas":["temperatura","precipitacao","panfletos","preco","vendas"]}
As cinco colunas numéricas do conjunto de [365 dias de venda de limonada](https://github.com/GHDaru/machinelearning/tree/main/ml-zero/dados/limonada). Em cima o **histograma**, embaixo o **boxplot**, na mesma escala horizontal — para você ver os dois falando da mesma distribuição.

A linha tracejada **laranja** é a média; a **verde**, a mediana. O afastamento entre elas é o sinal de assimetria mais barato que existe.

Percorra as cinco colunas e responda, para cada uma:

1. A distribuição é **simétrica**? De que lado ela puxa?
2. Há **outliers** pela regra da cerca de 1,5 × IQR? Quantos?
3. A **média** é uma boa descrição desta variável — ou a mediana descreve melhor?

**Duas colunas têm respostas surpreendentes.** Os exercícios logo abaixo pedem os números que só o painel mostra — abra o laboratório antes de responder, porque o enunciado não os entrega.
:::

:::exercicio {"id":"analise-exploratoria-e6","tipo":"numerica","objetivo":"O1","dificuldade":"facil"}
Abra o laboratório e escolha a coluna **`preco`**. Quantos pontos a regra da cerca de 1,5 × IQR acusa?

> **gabarito:** 62
> **porque:** Sessenta e dois — de 365 dias. Mais de um sexto do conjunto marcado como anomalia numa coluna que, olhando o painel, tem **dois valores distintos**.
>
> Antes de decidir o que fazer com eles, olhe o IQR dessa coluna. É o próximo exercício, e é a lição do capítulo.
> **volte para:** #olhe-uma-variavel-de-cada-vez
:::

:::exercicio {"id":"analise-exploratoria-e4","tipo":"multipla","objetivo":"O4","dificuldade":"dificil"}
Você acabou de ver a cerca acusar 62 pontos em `preco`. Olhe, no painel do laboratório, o **IQR** e os **valores distintos** dessa coluna. Qual é a leitura correta?

- [ ] São 62 erros de digitação no registro do preço, e devem ser removidos antes de modelar.
- [ ] A regra está certa: 62 dias tiveram preço anormal, e esses dias merecem investigação individual.
- [x] A régua quebrou: com Q1 = Q3, o IQR é **zero**, e qualquer valor diferente do mais comum cai fora da cerca.
- [ ] O problema é o fator 1,5; com 3,0 em vez de 1,5 os 62 pontos deixariam de ser acusados.

> **gabarito:** A régua quebrou — o IQR é zero
> **porque:** A coluna tem **dois** valores em 365 dias: 0,30 em 303 deles e 0,50 nos 62 de julho e agosto. Como mais de 75% das linhas valem 0,30, o primeiro e o terceiro quartis coincidem: Q1 = Q3 = 0,30, logo **IQR = 0** e a cerca vira o intervalo [0,30 ; 0,30]. Tudo que não é exatamente 0,30 é acusado.
>
> Os 62 dias não são anomalia: são a alta temporada, e o preço foi uma **decisão** da dona. Removê-los apagaria julho e agosto do conjunto — dois dos meses mais importantes do negócio.
>
> A última alternativa é a mais instrutiva entre as erradas: com IQR igual a zero, **qualquer** multiplicador dá cerca de largura zero. 3,0 × 0 continua sendo 0. O problema não é a folga, é a régua.
>
> A lição do capítulo, em uma frase: **critério de outlier é escolha declarada, não verdade estatística.** A regra de 1,5 × IQR pressupõe uma distribuição contínua e razoavelmente espalhada. Aplicada a uma variável quase constante, ou a uma categórica disfarçada de número, ela produz um resultado tecnicamente correto e completamente sem sentido.
> **volte para:** #olhe-uma-variavel-de-cada-vez
:::

## Correlação: o que ela mede e o que ela não prova

A correlação de Pearson resume, num número entre −1 e 1, o quanto duas variáveis andam juntas **em linha reta**. As duas palavras finais são a armadilha inteira: uma relação forte e curva (um U perfeito, por exemplo) pode dar correlação próxima de zero. Correlação zero não significa "não há relação"; significa "não há relação *linear*".

O argumento definitivo contra confiar no número sem ver o gráfico é o **quarteto de Anscombe** (1973): quatro conjuntos de onze pontos cada, com médias, variâncias, correlação (≈ 0,816) e reta de regressão **praticamente idênticas** — e formas completamente diferentes quando plotados. Um é uma nuvem linear honesta; outro é uma curva perfeita; outro é uma reta com um ponto fora; o último é uma coluna de pontos e um único ponto distante que sozinho cria a correlação. Mesmo resumo numérico, quatro histórias.

E depois há a frase que todo mundo sabe repetir e quase ninguém aplica na hora certa: **correlação não é causalidade**. Diante de uma correlação forte, há sempre quatro explicações concorrentes, e só uma delas é a que você quer:

1. **A causa é a que você pensou** (X causa Y).
2. **A causa é a inversa** (Y causa X) — comum em dados operacionais: clientes com mais chamados de suporte cancelam mais, ou clientes prestes a cancelar abrem mais chamados?
3. **Há um confundidor** que causa as duas — o clássico: venda de sorvete e afogamentos sobem juntos porque é verão.
4. **É coincidência amostral** — teste 200 pares de variáveis e algumas parecerão correlacionadas por acaso.

Há ainda um quinto caso, específico de quem constrói modelos: **correlação altíssima com o alvo costuma ser vazamento**, não sorte. Se uma coluna prevê o alvo quase perfeitamente, a primeira hipótese não é "achei o atributo de ouro", é "essa coluna foi preenchida *depois* do desfecho" — o [capítulo I.3](i-3-dados.md) trata disso.

:::exercicio {"id":"analise-exploratoria-e2","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Duas colunas de um mesmo relatório têm média, desvio-padrão e correlação entre si praticamente idênticas às de outro par de colunas. Que conclusão é legítima?

- [ ] As duas relações têm a mesma forma; os resumos numéricos determinam o gráfico.
- [x] Nenhuma: resumos iguais são compatíveis com formas radicalmente diferentes — só o gráfico decide.
- [ ] Como a correlação é a mesma, um modelo linear serve igualmente bem nos dois casos.
- [ ] Se a correlação for alta nos dois casos, ambos os pares têm relação causal.

> **gabarito:** Nenhuma conclusão sobre a forma — é preciso ver o gráfico
> **porque:** É exatamente o que o quarteto de Anscombe demonstra: quatro conjuntos com médias, variâncias, correlação e reta de regressão iguais, e gráficos que não se parecem em nada. O resumo numérico comprime; e toda compressão descarta — a questão é sempre *o quê*.
>
> A terceira alternativa é a mais sedutora e a mais perigosa, porque a correlação é de fato o que a regressão linear otimiza. Só que num dos conjuntos de Anscombe a relação é uma **curva**: a reta ajustada tem os mesmos coeficientes e está sistematicamente errada em todo ponto. Em outro, a correlação inteira é produto de **um** ponto distante — remova-o e ela desaparece.
>
> A última confunde correlação com causalidade, e a primeira inverte a direção da inferência: o gráfico determina quais resumos fazem sentido, nunca o contrário.
> **volte para:** #correlacao-o-que-ela-mede-e-o-que-ela-nao-prova
:::

> **Um conjunto para praticar isto.** [`ml-zero/dados/limonada/`](../../ml-zero/dados/limonada/README.md) traz 365 dias de venda com um caso limpo do que esta seção afirma: `preco` correlaciona **+0,513** com as vendas, e o que essa correlação mede é o mês de julho. A exploração que revela isso é uma linha só, `df.groupby("preco")[["temperatura","vendas"]].mean()`, e ela precede qualquer modelo. O desdobramento está no [capítulo II.2](ii-2-modelos-lineares.md#o-caso-da-limonada).

## Faltantes, outliers e a fronteira entre explorar e confirmar

**Faltantes.** A pergunta útil nunca é "como preencho?", é **"por que falta?"**. Falta ao acaso (o sensor caiu numa terça) é um problema de imputação. Falta por mecanismo (renda alta declarada com menos frequência) enviesa qualquer preenchimento pela média. E falta com significado (um campo que só existe para quem comprou) é vazamento disfarçado de ausência. Antes de qualquer `dropna()`, conte os faltantes **por coluna e por subgrupo**: um faltante concentrado numa região, num período ou num canal é sinal de processo quebrado, não de dado ausente.

**Outliers.** Um ponto extremo é uma de três coisas, e a única forma de decidir é olhar a linha inteira:

| O que é | Exemplo | O que fazer |
|---|---|---|
| **Erro de medida** | idade = 999, preço = −1 | corrigir ou remover, registrando quantos |
| **Evento raro legítimo** | a compra de R$ 400 mil que de fato aconteceu | manter; usar medida resistente ou transformação |
| **O próprio alvo** | a transação fraudulenta, a falha do equipamento | **jamais** remover — é o que você quer prever |

A regra de 1,5 × IQR do boxplot **marca candidatos, não decide nada**. Decidir exige critério declarado por escrito: o que foi removido, por qual regra, quantas linhas, e o que acontece com o resultado se a regra mudar. "Limpei os outliers" não é descrição de método; é a ausência de uma.

**E a fronteira.** Se você olha quarenta gráficos e escolhe o padrão mais forte, você não achou o efeito mais forte: achou o **extremo do ruído**, a coincidência amostral do item 4 acima, agora garimpada de propósito. É a armadilha que a dupla de Tukey existe para prevenir. A regra prática é simples e barata: **separe uma parte dos dados antes de começar a olhar** e não a toque; explore no resto à vontade; escreva a hipótese antes de testá-la na parte guardada. Explorar produz candidatas; confirmar exige dado que não participou da escolha. Fazer as duas coisas no mesmo conjunto é o mesmo erro que o [capítulo II.1](ii-1-avaliacao.md) combate quando o limiar é escolhido no teste.

O produto legítimo de uma boa exploração não é uma conclusão — é uma **lista de hipóteses ordenada por quanto valeria confirmá-las**, mais uma lista de problemas de dado a consertar. Transformar essa lista em gráfico que convence é o [capítulo I.5](i-5-visualizacao-storytelling.md).

:::exercicio {"id":"analise-exploratoria-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"media"}
Você explora a base de vendas de uma rede de lojas e encontra 12 pedidos (de 400 mil) com valor acima de R$ 500 mil — a mediana dos pedidos é R$ 180. O modelo a treinar prevê o valor do próximo pedido de um cliente.

Escreva o que você faz com esses 12 pedidos: **como decide** e **o que registra**.

> **rubrica:** investiga a origem de cada ponto antes de decidir, em vez de aplicar uma regra automática;
> distingue explicitamente erro de medida, evento raro legítimo e alvo de interesse;
> propõe um critério declarado e reprodutível (regra escrita, contagem de linhas afetadas), não "limpei os outliers";
> considera o efeito da decisão sobre a métrica e sobre a escolha entre média e mediana;
> menciona documentar a decisão para quem for reproduzir ou revisar
> **porque:** Doze pontos em 400 mil não se resolvem por regra: resolvem-se **olhando as doze linhas**. Elas podem ser erro de digitação (um zero a mais), venda corporativa legítima (outro processo de negócio, que talvez mereça modelo próprio) ou fraude — e cada diagnóstico leva a uma ação diferente. O boxplot marca os candidatos; quem decide é quem conhece o processo que gerou o dado.
>
> O que separa uma resposta boa de uma correta é o **registro**. "Removi outliers acima de 500 mil (12 linhas, 0,003% da base, 4,1% da receita)" é método: qualquer pessoa reproduz, e a segunda frase já mostra que apagar 12 linhas apagou 4% da receita — o que provavelmente inviabiliza a remoção. "Limpei os outliers" não é reproduzível nem auditável.
>
> Repare no efeito colateral que quase sempre escapa: se as vendas corporativas ficam, o alvo é fortemente assimétrico, e otimizar erro quadrático médio faz o modelo perseguir a cauda. A decisão sobre outliers e a escolha da métrica são a **mesma** decisão tomada duas vezes.
> **volte para:** #faltantes-outliers-e-a-fronteira-entre-explorar-e-confirmar
:::

:::exercicio {"id":"analise-exploratoria-e5","tipo":"aberta","objetivo":"O2","pontos":3,"dificuldade":"media"}
No laboratório, escolha a coluna **`precipitacao`** e leia o painel: média, mediana, mínimo, máximo e quantos pontos a regra da cerca de 1,5 × IQR acusa.

Escreva um parágrafo de análise monovariada dessa variável, respondendo:

1. a distribuição é simétrica? Para que lado puxa, e como você sabe?
2. média ou mediana descreve melhor esta variável — e por quê?
3. os pontos acusados **são** outliers? O que você faria com eles, e com que critério declarado?

> **rubrica:** traz os números que leu no painel, em vez de falar em geral; identifica assimetria à direita, e justifica pela média ser maior que a mediana (ou pela cauda longa do histograma), não por impressão visual vaga;
> escolhe a mediana como descrição mais fiel, ligando a escolha à assimetria — a média é puxada pela cauda;
> reconhece que os pontos acusados são dias de chuva forte, isto é, **variação legítima do fenômeno**, e não erro de registro;
> declara um critério explícito para a decisão (manter, marcar, transformar) em vez de remover por reflexo;
> não confunde "fora da cerca" com "errado"
> **porque:** As três respostas se encadeiam, e a terceira é a que separa quem entendeu.
>
> **Simetria:** média 0,83 > mediana 0,74. Quando a média fica à direita da mediana, há cauda à direita — poucos dias de chuva muito acima do normal puxam a média, e a mediana nem se mexe. É a mesma mecânica da rua do começo do capítulo, em escala menor.
>
> **Qual medida:** a mediana. "Num dia típico chove 0,74" descreve o que se vê; "chove em média 0,83" descreve um dia que quase não existe.
>
> **Os 28 pontos:** são dias de chuva forte. Chuva forte **acontece** — a distribuição da precipitação é naturalmente assimétrica, e a regra de 1,5 × IQR acusa muito em distribuição assimétrica **por construção**, já que ela foi pensada para dados aproximadamente simétricos. Remover esses dias tiraria do conjunto justamente as observações que explicam as piores vendas do ano.
>
> A resposta forte não é "manter" nem "remover": é **declarar o critério**. Por exemplo: *"mantenho, porque são fenômeno e não erro; marco com uma coluna `chuva_forte` para poder verificar depois se o modelo erra mais nesses dias"*. Isso é decisão auditável — e é o que o capítulo pede quando diz que outlier se resolve com critério declarado.
> **volte para:** #faltantes-outliers-e-a-fronteira-entre-explorar-e-confirmar
:::


## Mão na massa

**Notebook pronto para executar** — [`exploratoria_limonada.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-21/exploratoria_limonada.ipynb) · [abrir no Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-21/exploratoria_limonada.ipynb)

O mesmo caminho do laboratório, agora com o **código à vista**: tipo de cada campo, contagem e nulidade, média × mediana × moda, decis e quartis (com a verificação de que P50 = Q2 = D5), histograma e boxplot desenhados juntos na mesma escala, e a regra da cerca de 1,5 × IQR calculada coluna a coluna.

> Este é o **único** notebook da trilha que usa `pandas` e `matplotlib` — as duas já vêm no Colab. A razão está no [ADR 0010](https://github.com/GHDaru/machinelearning/blob/main/adr/0010-pandas-na-etapa-de-exploracao.md): o assunto aqui é *ler distribuição*, e desenhar histograma à mão ensinaria sobre desenho. A conta em si (quantil, cerca, descritivas) está escrita à mão no laboratório, em 30 linhas de JavaScript.

## Síntese — o que levar

- **Sempre olhe antes de modelar.** O modelo não avisa que a coluna está zerada; ele aprende o erro e devolve uma métrica plausível.
- Média usa o **valor** de cada ponto; mediana usa a **posição**. Por isso a mediana resiste a extremos e a média não.
- Distribuição assimétrica ou com extremos: **mediana + IQR**. Simétrica e limpa: média + desvio-padrão.
- O boxplot entrega centro, dispersão e assimetria numa olhada — e a regra de 1,5 × IQR **marca candidatos, não decide**.
- Resumo numérico comprime. O quarteto de Anscombe é a prova de que estatísticas idênticas convivem com gráficos irreconhecíveis.
- Diante de uma correlação forte, enumere as quatro explicações antes de escolher a sua — e desconfie de correlação altíssima com o alvo: costuma ser vazamento. Faltante também tem **causa**, e descobri-la vale mais que preenchê-lo.
- Explorar gera hipóteses; confirmar exige dado que não participou da exploração. Separe a parte guardada **antes** de olhar.

:::exercicio {"id":"analise-exploratoria-e7","tipo":"aberta","objetivo":"O3","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Explorando, você encontrou um padrão forte num segmento de clientes: quem compra pela manhã devolve muito menos. Descreva **o que precisa acontecer** antes de esse padrão virar uma afirmação na apresentação para a diretoria.

> **rubrica:** exige que o padrão seja conferido em dados que **não participaram da exploração**, e diz de onde esses dados viriam (uma parte separada antes de olhar, um período posterior, uma coleta nova);
> explica **por que** conferir nos mesmos dados não vale — a exploração já usou aquela informação para escolher a hipótese, e o padrão pode ser particularidade da amostra;
> deixa a hipótese **declarada antes** do novo teste, incluindo o que contaria como refutação, em vez de ajustá-la depois de ver o resultado;
> não confunde força com verdade: nem tamanho do efeito nem número de clientes no segmento são evidência de que o padrão se repete fora dali
> **porque:** O erro que este exercício persegue não é estatístico, é de sequência. Você olhou muitos cortes possíveis, escolheu o que mais saltou, e agora quer testar **esse** — mas o dado que fez a escolha não pode também julgá-la. Quem procura em cem segmentos encontra padrão forte em alguns por sorte, e a força do padrão é justamente o que fez você reparar nele.
>
> Daí a divisão de trabalho do capítulo: uma fase **produz** hipóteses, outra as **julga**, e não se faz as duas com os mesmos dados. Separar a parte guardada antes de olhar não é burocracia — é a única coisa que impede a segunda fase de ser uma repetição da primeira.
>
> Note também o que **não** está sendo pedido: ninguém disse para você não explorar. O achado é legítimo e valioso; ele só ainda não é uma afirmação. Levar como "encontramos uma pista que vale testar" é honesto e útil; levar como "clientes da manhã devolvem menos" é apresentar um sorteio como conclusão.
> **volte para:** #faltantes-outliers-e-a-fronteira-entre-explorar-e-confirmar
:::

## Verificação

1. Um relatório diz "ticket médio de R$ 340". Que três perguntas você faz antes de usar esse número numa decisão?
2. Duas colunas têm correlação de 0,9. Liste as explicações possíveis e diga, para cada uma, que evidência adicional a distinguiria das demais.

> Estas duas não são corrigidas, e a omissão é deliberada: rendem mais numa discussão com alguém que discorde do que numa resposta escrita sozinho.
