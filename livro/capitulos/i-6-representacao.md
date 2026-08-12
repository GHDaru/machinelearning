# I.6 — Representação

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar por que a escolha de representação limita o que qualquer modelo pode aprender.
- **O2.** Aplicar codificação adequada a variáveis categóricas de alta e baixa cardinalidade.
- **O3.** Justificar quando normalizar e quando não faz diferença nenhuma.
- **O4.** Construir atributos a partir de conhecimento de domínio e medir se eles pagaram.

## O problema: o modelo só vê o que você mostrou

Um modelo não vê o mundo: vê os números que você escolheu mostrar a ele. Essa escolha — a **representação** — determina o teto de qualquer algoritmo que venha depois. Nenhuma quantidade de otimização recupera informação que não foi codificada.

O exemplo canônico é a data. Como inteiro (`1721692800`), ela é quase inútil: o modelo teria de descobrir sozinho que o mundo se repete a cada 604 800 segundos. Decomposta em dia da semana, hora do dia e proximidade de feriado, ela frequentemente carrega a maior parte do sinal. **O dado é o mesmo.** O que mudou foi o que o modelo consegue enxergar.

É por isso que este capítulo vem antes dos modelos, e não depois. Trocar de algoritmo é barato; descobrir que a informação nunca esteve na tabela é caro.

## De onde isto veio

**O aperto.** Anos 1950, Universidade da Pensilvânia. **Zellig Harris** queria uma linguística que partisse **só do corpus** — dos textos observáveis —, sem apelar para intuição de significado nem para dicionário. A influência declarada era a teoria da informação de Shannon. O aperto: *significado* parecia ser exatamente aquilo que não se pode medir.

**O que se fazia antes.** Significado descrito por definição, introspecção ou autoridade lexicográfica. Nada disso é observável, e nada disso é computável.

**A virada.** Em **1954**, no artigo *"Distributional Structure"*, Harris mostra como induzir o sentido de palavras como *oculist*, *eye-doctor* e *lawyer* a partir da **sobreposição dos ambientes** em que ocorrem: as duas primeiras aparecem quase nos mesmos contextos, a terceira só em parte deles. Diferença de sentido vira **diferença de distribuição observável**. É a **hipótese distribucional**, e é a fundação conceitual de tudo o que hoje se chama *embedding*.

**A ideia reaproveitável — e ela vale muito além de texto.** **Representar não é descrever a coisa: é registrar a companhia que a coisa mantém.** Não existe "o vetor do cliente"; existe o vetor do cliente **em relação ao conjunto**. É isso que faz *one-hot*, TF-IDF e *embedding* pertencerem a um capítulo só: todos trocam a essência do item pela **posição dele numa coleção**. Mude a coleção e a representação muda, sem que o item tenha mudado nada.

**O nome.** A frase que carrega a ideia é de **J. R. Firth (1957)**: *"You shall know a word by the company it keeps"* — e ele a usa para um modo específico de significado, o *"meaning by collocation"*, buscando as colocações habituais em que a palavra está mais caracteristicamente incrustada.

> ### O terceiro caso, e o mais desconfortável
>
> **Harris tinha o argumento.** Dezessete páginas de definições formais e exemplos trabalhados, em 1954. **Firth tinha a frase**, três anos depois. E todo mundo cita Firth.
>
> É a terceira vez que este livro tropeça no mesmo padrão. No [capítulo II.2](ii-2-modelos-lineares.md), Gauss descobre os mínimos quadrados e Legendre leva a prioridade por ter publicado. No [capítulo III.1](iii-1-neuronio-artificial.md), Linnainmaa descreve a retropropagação e Rumelhart leva o crédito por ter popularizado. Aqui, o argumento inteiro é de um e a citação é do outro.
>
> **O que circula não é a contribuição: é a forma citável da contribuição.** Isso não é cinismo, é instrução prática — se você quer que a sua ideia seja usada, ela precisa caber numa frase que alguém consiga repetir. A frase não substitui o argumento; ela é o veículo dele.

### Cinquenta e nove anos entre a ideia e o procedimento

A hipótese distribucional é de **1954**. O **word2vec** — Mikolov, Chen, Corrado e Dean — é de **janeiro de 2013**, com a regularidade que ficou famosa: *rei − homem + mulher ≈ rainha*.

São **cinquenta e nove anos**, um dos maiores intervalos registrados neste livro — maior que os 43 de Yule → Box–Jenkins ([capítulo II.7](ii-7-series-temporais.md)) e que os 43 de Larson → Stone ([capítulo 0.2](../0-2-fundamentos.md)). No meio do caminho, a linha vetorial foi sendo construída: **1972**, Karen Spärck Jones mostra que **especificidade é estatística, não semântica** — pesa-se o termo pela raridade na coleção; **1973**, Salton e Yang multiplicam a frequência do termo por aquela fórmula e batizam o resultado de *idf*; **1975**, o modelo de espaço vetorial é formalizado no sistema SMART, em Cornell.

Repare no detalhe do TF-IDF: **ela inventou, eles nomearam.** O padrão de novo.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Que Harris parte do corpus sob influência declarada de Shannon, e a frase de Firth com o sentido de *meaning by collocation* — via [Brunila & LaViolette (2022), arXiv:2205.07750](https://arxiv.org/pdf/2205.07750), **lido**, que faz leitura cerrada dos dois originais |
| ✓ᵐ | Harris, *"Distributional Structure"*, *Word* 10(2–3), 1954, e o exemplo *oculist* / *eye-doctor* / *lawyer*. **O artigo original não foi aberto** (paywall) |
| ✓ᵐ | Spärck Jones (*Journal of Documentation* 28:11–21, 1972); Salton, Wong & Yang (*CACM* 18:613–620, 1975); Mikolov *et al.* ([arXiv:1301.3781](https://arxiv.org/abs/1301.3781), 16/01/2013) |
| ✓ᵐ | Suits, *"Use of Dummy Variables in Regression Equations"*, *JASA* 52:548–551, 1957 — e que o próprio Suits diz que a técnica **não era nova**; o que faltava era expor o procedimento, inclusive a restrição obrigatória |
| ⏳ | Que Salton & Yang (1973) batizaram o "idf" a partir da fórmula de Spärck Jones |
| ⏳ | Que "one-hot" vem de circuito digital, onde a única combinação legal é um bit alto — não localizei o primeiro uso datado |
| 📖 | A ideia reaproveitável, a leitura sobre a "forma citável" e a contagem dos 59 anos |

## Fundamentos: as três decisões

Toda representação responde a três perguntas, e errar qualquer uma custa mais que trocar de modelo.

### 1. Categórica: quantos valores diferentes existem?

Para **baixa cardinalidade** (cor, estado civil, região — dezenas de valores), o **one-hot** é o padrão: uma coluna por valor, com 1 na coluna correspondente e 0 nas demais.

O nome vem do circuito digital, onde a única combinação válida é ter exatamente um bit alto. Em estatística a mesma técnica é a **variável dummy**, e ela é bem mais velha: Daniel Suits a expôs em 1957 — dizendo, aliás, que já não era nova.

> **A armadilha das dummies tem 69 anos e continua sendo a primeira em que o aluno pisa.** Se você criar uma coluna para **cada** valor **e** mantiver o intercepto, as colunas somam exatamente 1 em toda linha — informação perfeitamente redundante. Numa regressão isso torna a solução indeterminada. A regra é: **omita uma categoria, ou tire o intercepto.** Nunca os dois, nunca nenhum.

Para **alta cardinalidade** (CEP, código de produto, ID de usuário — milhares de valores), one-hot explode: você ganha dez mil colunas quase vazias e um modelo que decora. As saídas são agrupar por frequência (tudo que aparece pouco vira "outros"), codificar pelo alvo — com um cuidado que o [capítulo I.3](i-3-dados.md) já explicou —, ou aprender um **embedding**.

> **Codificação pelo alvo é vazamento esperando acontecer.** Substituir a categoria pela média do alvo naquela categoria usa a resposta como entrada. Se a média for calculada com o dado inteiro, você vazou. Calcule **só no treino**, e por dobra.

### 2. Numérica: a escala importa?

Depende inteiramente do modelo, e essa é a resposta que quase ninguém dá.

| Modelo | Normalizar muda? | Por quê |
|---|---|---|
| Regressão com gradiente | **muito** | escalas díspares deformam a paisagem e a descida ziguezagueia ([cap. II.4](ii-4-otimizacao.md)) |
| Regularização L1/L2 | **muito** | a penalidade compara coeficientes; sem escala comum, ela pune o atributo de unidade pequena |
| k-NN, k-means, SVM | **muito** | dependem de distância, e distância soma unidades diferentes |
| Árvores e ensembles | **nada** | cada corte olha **um** atributo por vez, e a ordem não muda com escala ([cap. II.5](ii-5-arvores-ensembles.md)) |

A consequência prática é útil: se o seu pipeline normaliza antes de um *random forest*, você não fez mal — fez trabalho à toa, e adicionou uma peça que pode quebrar.

### 3. Domínio: que atributo não está lá?

É aqui que o conhecimento de negócio entra, e onde o ganho costuma ser maior. Razões em vez de valores absolutos (*ticket* médio em vez de total e contagem separados), diferenças temporais (dias desde a última compra), agregações por grupo (gasto do cliente sobre a média da região dele).

**E medir se pagou.** Atributo novo se justifica por experimento, não por plausibilidade: mesma divisão, mesmo protocolo, e a diferença comparada com o ruído ([cap. II.8](ii-8-do-modelo-a-decisao.md)).

:::exercicio {"id":"representacao-e1","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Você treina um *random forest* para prever inadimplência. Um colega revisa o código e sugere padronizar todos os atributos numéricos (média 0, desvio 1) antes do treino, "porque é boa prática". O que acontece com o desempenho?

- [ ] Melhora, porque as árvores comparam atributos entre si.
- [ ] Piora, porque a padronização destrói a informação de escala que as árvores usam.
- [x] Fica praticamente igual — a árvore escolhe cortes dentro de um atributo por vez, e a ordem dos valores não muda.
- [ ] Melhora só se houver atributos com unidades muito diferentes.

> **gabarito:** Fica praticamente igual
> **porque:** Uma árvore avalia cortes do tipo "atributo *j* ≤ *v*". Padronizar é uma transformação **monotônica** dentro de cada atributo: ela muda os valores, mas **não muda a ordem** deles — e portanto não muda quais divisões dos exemplos são possíveis. O corte que separava os mesmos exemplos antes continua separando os mesmos depois.
>
> A segunda alternativa é o erro simétrico e vale desmontar: a árvore **não usa** escala como informação. Ela nunca compara um atributo com outro na mesma conta — é justamente essa indiferença que a torna cômoda para tabela com unidades misturadas.
>
> Lição prática: normalizar antes de uma floresta não é errado, é **inútil** — e código inútil no pipeline é código que pode quebrar, que precisa ser mantido, e que confunde quem vier depois. "Boa prática" sem a condição em que ela vale é superstição.
> **volte para:** #2-numerica-a-escala-importa
:::

:::exercicio {"id":"representacao-e2","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
Uma variável categórica `regiao` tem 5 valores possíveis. Você vai usá-la numa **regressão linear com intercepto**.

Quantas colunas *dummy* você deve criar para evitar a indeterminação?

> **gabarito:** 4
> **porque:** Com 5 colunas — uma por região — a soma delas dá exatamente 1 em toda linha, que é precisamente o que a coluna do intercepto já vale. Uma das colunas é combinação linear perfeita das outras mais o intercepto, e o sistema deixa de ter solução única: infinitos conjuntos de coeficientes produzem exatamente as mesmas previsões.
>
> Omitindo uma categoria, ela vira a **referência**, e cada coeficiente passa a significar "o efeito desta região **em relação à** referência". Isso não é uma perda: é o que torna o coeficiente interpretável.
>
> A regra geral é **k − 1** colunas para k categorias, quando há intercepto. Sem intercepto, use as k. E note que isso **não vale** para árvores ou para modelos regularizados, onde a redundância não impede a solução — mais um caso em que a resposta certa depende do modelo, não da variável.
> **volte para:** #1-categorica-quantos-valores-diferentes-existem
:::

## O artesanato mudou de lugar, não desapareceu

A promessa do aprendizado de representações — o contraponto moderno, formulado por Bengio, Courville e Vincent em 2013 — é **aprender** a representação em vez de fabricá-la à mão. Em texto e imagem, a promessa se cumpriu de forma espetacular: ninguém mais escreve detector de borda à mão ([cap. III.4](iii-4-visao.md)).

Mas em **dado tabular** — a maior parte do trabalho real de empresa — o artesanato continua, e continua decidindo o resultado.

**E mesmo onde a promessa se cumpriu, ela mudou o artesanato de lugar em vez de eliminá-lo.** Quem monta o corpus decide o que conta como *contexto*; quem define a janela de um *embedding* decide o que é "companhia"; quem escolhe o que entra na tabela decide o que existe. É exatamente o trabalho que Harris fazia à mão em 1954, com outra ferramenta.

:::exercicio {"id":"representacao-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"media"}
Uma rede de farmácias quer prever quais clientes vão abandonar o programa de fidelidade nos próximos 90 dias. A tabela disponível tem uma linha por cliente com: `cpf`, `data_cadastro`, `cidade`, `total_gasto_historico`, `numero_de_compras`.

Proponha **três atributos novos** construídos a partir dessas colunas ou de dados que você pediria, justifique cada um pela hipótese de negócio, e descreva como mediria se eles pagaram.

> **rubrica:** propõe ao menos um atributo de **razão ou média** (ticket médio = total gasto / número de compras) em vez de usar só valores absolutos;
> propõe ao menos um atributo **temporal** (dias desde a última compra, ou frequência recente contra frequência histórica) e reconhece que a data da última compra não está na tabela e precisa ser pedida;
> justifica cada atributo por uma hipótese de negócio explícita, não por "costuma ajudar";
> descreve uma medição comparativa com protocolo — mesma divisão, mesmo modelo, com e sem os atributos;
> menciona a incerteza da comparação, ou o risco de vazamento ao construir atributo temporal
> **porque:** A resposta fraca lista transformações genéricas. A resposta forte percebe duas coisas.
>
> **Primeira:** `total_gasto_historico` e `numero_de_compras` juntos escondem o **ticket médio**, e ticket médio distingue dois clientes que a tabela crua confunde — quem gastou R\$ 5 000 em 200 compras é um cliente de rotina; quem gastou o mesmo em 3 compras é outra pessoa, com outro motivo para sair. A razão carrega informação que nenhuma das duas colunas carrega sozinha.
>
> **Segunda, e é a que separa:** a tabela **não tem a data da última compra**, e sem ela quase não há como prever abandono — recência é o sinal mais forte que existe para esse problema. Perceber a **ausência** vale mais que propor dez transformações do que está presente. É a lição de abertura do capítulo: o modelo só vê o que você mostrou, e informação que não foi coletada nenhum algoritmo recupera.
>
> Sobre a medição: comparar com e sem os atributos exige o protocolo do [capítulo II.8](ii-8-do-modelo-a-decisao.md) — mesma divisão, mesmo orçamento de busca, e a diferença confrontada com o ruído. E todo atributo temporal precisa ser calculado **na data de corte** de cada exemplo, nunca com o histórico completo, sob pena do vazamento do [capítulo I.3](i-3-dados.md).
> **volte para:** #3-dominio-que-atributo-nao-esta-la
:::

## Síntese — o que levar

- O modelo **só vê o que você mostrou**. A representação define o teto; nenhuma otimização recupera informação não codificada.
- **Representar é registrar a companhia que a coisa mantém**, não descrever a coisa. Muda a coleção, muda a representação.
- Categórica de **baixa** cardinalidade: one-hot, com **k − 1** colunas se houver intercepto. De **alta**: agrupe, codifique pelo alvo com cuidado, ou aprenda um *embedding*.
- **Codificação pelo alvo calculada fora do treino é vazamento.**
- Normalizar importa para gradiente, regularização e distância; **não importa** para árvores.
- Atributo de domínio costuma pagar mais que troca de modelo — e se justifica por **experimento**, não por plausibilidade.
- A hipótese distribucional tem **setenta anos**; o *embedding* é a realização computacional dela.
- O *deep learning* **mudou o artesanato de lugar**, não o eliminou: alguém ainda decide o que conta como contexto.

## Verificação

1. Por que uma data como inteiro é quase inútil para a maioria dos modelos, e o que exatamente a decomposição em dia da semana e hora do dia acrescenta?
2. Você tem uma coluna com 8 000 códigos de produto distintos. Descreva duas estratégias de codificação e diga em que situação escolheria cada uma.
3. A hipótese distribucional afirma que o sentido está na companhia. Dê um exemplo, fora de texto, em que representar um item pelo contexto funciona melhor que representá-lo pelos atributos próprios.
