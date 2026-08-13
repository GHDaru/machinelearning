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

Um modelo não vê o mundo: vê os números que você escolheu mostrar a ele. Essa escolha, a **representação**, determina o teto de qualquer algoritmo que venha depois. Nenhuma quantidade de otimização recupera informação que não foi codificada.

O exemplo canônico é a data. Como inteiro (`1721692800`), ela é quase inútil: o modelo teria de descobrir sozinho que o mundo se repete a cada 604 800 segundos. Decomposta em dia da semana, hora do dia e proximidade de feriado, ela frequentemente carrega a maior parte do sinal. **O dado é o mesmo.** O que mudou foi o que o modelo consegue enxergar.

É por isso que este capítulo vem antes dos modelos, e não depois. Trocar de algoritmo é barato; descobrir que a informação nunca esteve na tabela é caro.

:::exercicio {"id":"representacao-e11","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
A mesma data aparece de duas formas: como inteiro `1721692800` e decomposta em dia da semana, hora e proximidade de feriado. O que muda entre as duas?

- [ ] A quantidade de informação: a versão decomposta contém mais dados.
- [x] O que o modelo consegue enxergar: o dado é o mesmo, e a segunda forma põe à vista uma estrutura que a primeira esconde.
- [ ] A precisão do registro, que a decomposição arredonda.
- [ ] Nada de relevante, desde que o modelo tenha capacidade suficiente.

> **gabarito:** o que o modelo consegue enxergar
> **porque:** A frase do capítulo é literal: **o dado é o mesmo**. As duas formas descrevem o mesmo instante, e uma delas é reconstruível a partir da outra. O que mudou foi o custo de usar a estrutura que ali existe.
>
> A última alternativa é a mais tentadora, e é a aposta que a prática costuma perder. Com capacidade suficiente e dado suficiente um modelo poderia, em tese, descobrir sozinho que o mundo se repete a cada 604 800 segundos. Na prática ele gasta capacidade e exemplos para reaprender o calendário, que você já sabia de graça.
>
> É o argumento que põe este capítulo antes dos modelos: trocar de algoritmo é barato, e descobrir que a informação nunca esteve na tabela é caro.
> **volte para:** #o-problema-o-modelo-so-ve-o-que-voce-mostrou
:::

## De onde isto veio

**O aperto.** Anos 1950, Universidade da Pensilvânia. **Zellig Harris** queria uma linguística que partisse só do corpus, isto é, dos textos observáveis, sem apelar para intuição de significado nem para dicionário. A influência declarada era a teoria da informação de Shannon. O aperto: *significado* parecia ser exatamente aquilo que não se pode medir.

**O que se fazia antes.** Significado descrito por definição, introspecção ou autoridade lexicográfica. Nada disso é observável, e nada disso é computável.

**A virada.** Em 1954, nas páginas 156 e 157 do artigo *"Distributional Structure"*, Harris mostra como induzir o sentido de palavras como *oculist*, *eye-doctor* e *lawyer* a partir da sobreposição dos ambientes em que ocorrem. Entre *oculist* e *eye-doctor* a sobreposição é quase completa; entre *oculist* e *lawyer*, apenas parcial. Diferença de sentido vira **diferença de distribuição observável**. É a **hipótese distribucional**, e é a fundação conceitual de tudo o que hoje se chama *embedding*.

**A ideia reaproveitável, e ela vale muito além de texto.** Representar não é descrever a coisa: é registrar a companhia que a coisa mantém. Não existe "o vetor do cliente"; existe o vetor do cliente **em relação ao conjunto**. É isso que faz *one-hot*, TF-IDF e *embedding* pertencerem a um capítulo só: todos trocam a essência do item pela posição dele numa coleção. Mude a coleção e a representação muda, sem que o item tenha mudado nada.

**O nome.** A frase que carrega a ideia é de **J. R. Firth (1957)**: *"You shall know a word by the company it keeps"*. Ele a usa para um modo específico de significado, o *"meaning by collocation"* (Firth, 1957b, p. 194), buscando as colocações habituais em que a palavra está mais caracteristicamente incrustada.

> ### O terceiro caso, e o mais desconfortável
>
> **Harris tinha o argumento.** Dezessete páginas de definições formais e exemplos trabalhados, em 1954. **Firth tinha a frase**, três anos depois. E todo mundo cita Firth.
>
> É a terceira vez que este livro tropeça no mesmo padrão. No [capítulo II.2](ii-2-modelos-lineares.md), Gauss descobre os mínimos quadrados e Legendre leva a prioridade por ter publicado. No [capítulo III.1](iii-1-neuronio-artificial.md), Linnainmaa descreve a retropropagação e Rumelhart leva o crédito por ter popularizado. Aqui, o argumento inteiro é de um e a citação é do outro.
>
> **O que circula não é a contribuição: é a forma citável da contribuição.** Isso não é cinismo, é instrução prática — se você quer que a sua ideia seja usada, ela precisa caber numa frase que alguém consiga repetir. A frase não substitui o argumento; ela é o veículo dele.

### Cinquenta e nove anos entre a ideia e o procedimento

A hipótese distribucional é de **1954**. O **word2vec**, de Mikolov, Chen, Corrado e Dean, é de **janeiro de 2013**, com a regularidade que ficou famosa: *rei − homem + mulher ≈ rainha*.

São **cinquenta e nove anos**, um dos maiores intervalos registrados neste livro, maior que os 43 de Yule → Box–Jenkins ([capítulo II.7](ii-7-series-temporais.md)) e que os 43 de Larson → Stone ([capítulo 0.2](../0-2-fundamentos.md)). No meio do caminho, a linha vetorial foi sendo construída. Em 1972, Karen Spärck Jones mostra que especificidade é estatística, não semântica: pesa-se o termo pela raridade na coleção. Em 1973, Salton e Yang multiplicam a frequência do termo por aquela fórmula e batizam o resultado de *idf*. Em 1975, o modelo de espaço vetorial é formalizado no sistema SMART, em Cornell.

Repare no detalhe do TF-IDF: **ela inventou, eles nomearam.** O padrão de novo.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Que Harris parte do corpus sob influência declarada de Shannon, e a frase de Firth com o sentido de *meaning by collocation* — via [Brunila & LaViolette (2022), arXiv:2205.07750](https://arxiv.org/pdf/2205.07750), **lido**, que faz leitura cerrada dos dois originais |
| ✓ | O exemplo *oculist* / *eye-doctor* / *lawyer* **e a direção de cada sobreposição** (quase completa entre as duas primeiras, parcial com a terceira), além da localização nas páginas 156–157 e da atribuição do *meaning by collocation* à p. 194 de Firth — tudo em [Brunila & LaViolette (NAACL 2022)](https://aclanthology.org/2022.naacl-main.327.pdf), lido, que cita os originais com página |
| ✓ᵐ | Harris, *"Distributional Structure"*, *Word* 10(2–3):146–162, 1954. **O artigo original não foi aberto** (paywall): o que se leu foi a leitura cerrada que Brunila & LaViolette fazem dele |
| ✓ᵐ | Spärck Jones (*Journal of Documentation* 28:11–21, 1972); Salton, Wong & Yang (*CACM* 18:613–620, 1975); Mikolov *et al.* ([arXiv:1301.3781](https://arxiv.org/abs/1301.3781), 16/01/2013) |
| ✓ᵐ | Suits, *"Use of Dummy Variables in Regression Equations"*, *JASA* 52:548–551, 1957 — e que o próprio Suits diz que a técnica **não era nova**; o que faltava era expor o procedimento, inclusive a restrição obrigatória |
| ⏳ | Que Salton & Yang **batizaram** o "idf" a partir da fórmula de Spärck Jones. A ficha do artigo está conferida (*"On the specification of term values in automatic indexing"*, *Journal of Documentation* 29(4):351–372, 1973, [10.1108/eb026562](https://doi.org/10.1108/eb026562)); quem cunhou o termo, não |
| ⏳ | Que "one-hot" vem de circuito digital, onde a única combinação legal é um bit alto — não localizei o primeiro uso datado |
| 📖 | A ideia reaproveitável, a leitura sobre a "forma citável" e a contagem dos 59 anos |

## Fundamentos: as três decisões

Toda representação responde a três perguntas, e errar qualquer uma custa mais que trocar de modelo.

### 1. Categórica: quantos valores diferentes existem?

Para **baixa cardinalidade** (cor, estado civil, região — dezenas de valores), o **one-hot** é o padrão: uma coluna por valor, com 1 na coluna correspondente e 0 nas demais.

O nome vem do circuito digital, onde a única combinação válida é ter exatamente um bit alto. Em estatística a mesma técnica é a **variável dummy**, e ela é bem mais velha: Daniel Suits a expôs em 1957 — dizendo, aliás, que já não era nova.

> **A armadilha das dummies tem 69 anos e continua sendo a primeira em que o aluno pisa.** Se você criar uma coluna para cada valor **e** mantiver o intercepto, as colunas somam exatamente 1 em toda linha, que é informação perfeitamente redundante. Numa regressão isso torna a solução indeterminada. A regra é: **omita uma categoria, ou tire o intercepto.** Nunca os dois, nunca nenhum.

Para **alta cardinalidade** (CEP, código de produto, ID de usuário — milhares de valores), one-hot explode: você ganha dez mil colunas quase vazias e um modelo que decora. As saídas são agrupar por frequência (tudo que aparece pouco vira "outros"), codificar pelo alvo, com o cuidado que o [capítulo I.3](i-3-dados.md) já explicou, ou aprender um **embedding**.

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

:::lab {"id":"representacao-l1","tipo":"anima-escala","titulo":"Troque a unidade de uma coluna e conte os vizinhos"}
Trezentos pontos, dois atributos, k-vizinhos com k = 5. A tabela é a mesma do começo ao fim: o que muda é a **unidade da primeira coluna**, multiplicada progressivamente até 100×. Metros para centímetros, reais para centavos, a coisa mais inofensiva que existe numa planilha.

Duas curvas: quantos dos 5 vizinhos de cada ponto **ainda são os mesmos**, e a fração de rótulos previstos que **virou**.

**Antes de assistir, arrisque.** Trocando a unidade de uma coluna, quantos dos 5 vizinhos você acha que sobrevivem?

Sobram **0,81**. Menos de um de cinco. E **31% dos rótulos previstos viram** — quase um terço das decisões do modelo muda porque alguém exportou a planilha em outra unidade. Nenhum número foi corrompido; nenhuma linha foi perdida.

Agora clique em **"E se as colunas fossem padronizadas antes?"**. Os 5 vizinhos continuam os 5 vizinhos, e 0,0% dos rótulos viram.

> **Repare que a segunda linha não é uma melhora: é uma invariância.** Não são "quase 5" nem "poucos rótulos"; são exatamente 5,00 e exatamente 0,0%. Padronizar não deixa o k-NN mais esperto. Deixa a resposta dele **indiferente à unidade em que o dado chegou** — e é isso que se quer, porque a unidade não é informação sobre o problema, é acidente de quem exportou.
>
> **E a ordem é o assunto.** Padronizar não protege se a padronização rodar antes da troca de unidade: aí ela padroniza a régua velha e a nova passa por cima. Só protege quem padroniza **depois** que o dado chegou, dentro do pipeline, toda vez. É a mesma disciplina que o [capítulo I.3](i-3-dados.md) exige contra vazamento, aplicada a outro risco.
:::

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

:::exercicio {"id":"representacao-e7","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Para quais destes a normalização muda o resultado, segundo a tabela do capítulo?

- [ ] Árvores de decisão e florestas aleatórias.
- [x] k-NN, k-means e SVM.
- [ ] Todos os modelos, sempre.
- [ ] Nenhum: normalizar é apenas convenção de pipeline.

> **gabarito:** k-NN, k-means e SVM
> **porque:** Os três dependem de **distância**, e distância soma unidades diferentes. Sem escala comum, um atributo medido em reais domina outro medido em anos só porque os números são maiores, e a vizinhança que o modelo enxerga passa a ser definida pela unidade de medida.
>
> A resposta "todos, sempre" é a superstição que o capítulo desmonta, e árvores são o contraexemplo: cada corte olha um atributo por vez, e transformação monotônica não muda ordem.
>
> A pergunta certa nunca é "devo normalizar?", é "**este** modelo compara atributos entre si na mesma conta?". Regressão com gradiente, regularização e métodos por distância comparam; árvores não.
> **volte para:** #2-numerica-a-escala-importa
:::

:::exercicio {"id":"representacao-e8","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
Uma regressão com regularização L2 tem dois atributos: `renda_mensal` em reais (milhares) e `anos_de_relacionamento` (unidades). Ninguém normalizou. Qual é a consequência específica da regularização aqui?

- [ ] Nenhuma: a L2 é invariante à escala, e por isso a normalização é dispensável com ela.
- [x] A penalidade compara coeficientes sem saber a unidade, e pune mais o coeficiente do atributo de unidade pequena.
- [ ] A L2 elimina o atributo de menor variância, que neste caso é `anos_de_relacionamento`.
- [ ] O gradiente não converge, e o treino falha com erro numérico.

> **gabarito:** a penalidade pune mais o coeficiente do atributo de unidade pequena
> **porque:** A L2 soma o quadrado dos coeficientes, e coeficiente é "efeito por unidade do atributo". Um atributo em milhares de reais precisa de um coeficiente pequeno para produzir o mesmo efeito que `anos_de_relacionamento` produz com um coeficiente grande — e é justamente o coeficiente grande que a penalidade encolhe.
>
> O resultado é que a regularização passa a escolher atributos pela **unidade de medida**, e não pela contribuição. Trocar anos por meses no mesmo conjunto mudaria quem é penalizado, sem que nada no fenômeno tivesse mudado.
>
> A quarta alternativa descreve um sintoma que às vezes acompanha escalas díspares, no gradiente, e não é o efeito perguntado. O caso da regularização é mais silencioso: o treino converge, o modelo funciona, e a seleção de atributos foi decidida pela unidade sem que ninguém veja.
> **volte para:** #2-numerica-a-escala-importa
:::

:::exercicio {"id":"representacao-e2","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
Uma variável categórica `regiao` tem 5 valores possíveis. Você vai usá-la numa **regressão linear com intercepto**.

Quantas colunas *dummy* você deve criar para evitar a indeterminação?

> **gabarito:** 4
> **porque:** Com 5 colunas, uma por região, a soma delas dá exatamente 1 em toda linha, que é precisamente o que a coluna do intercepto já vale. Uma das colunas é combinação linear perfeita das outras mais o intercepto, e o sistema deixa de ter solução única: infinitos conjuntos de coeficientes produzem exatamente as mesmas previsões.
>
> Omitindo uma categoria, ela vira a **referência**, e cada coeficiente passa a significar "o efeito desta região **em relação à** referência". Isso não é uma perda: é o que torna o coeficiente interpretável.
>
> A regra geral é **k − 1** colunas para k categorias, quando há intercepto. Sem intercepto, use as k. E note que isso **não vale** para árvores ou para modelos regularizados, onde a redundância não impede a solução — mais um caso em que a resposta certa depende do modelo, não da variável.
> **volte para:** #1-categorica-quantos-valores-diferentes-existem
:::

:::exercicio {"id":"representacao-e5","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Uma coluna `codigo_produto` tem 14 mil valores distintos. Um estagiário aplica one-hot. O que acontece?

- [ ] Nada de especial: one-hot é o padrão para categórica, e o modelo lida com o resto.
- [x] O conjunto ganha 14 mil colunas quase vazias, e o modelo passa a ter material para decorar produto em vez de aprender comportamento.
- [ ] O one-hot falha, porque a técnica só aceita até algumas centenas de categorias.
- [ ] O modelo melhora, porque mais colunas significam mais informação disponível.

> **gabarito:** 14 mil colunas quase vazias, e material para decorar
> **porque:** One-hot é o padrão para **baixa** cardinalidade, e a palavra faz todo o trabalho. Com 14 mil valores, cada coluna nova tem 1 em pouquíssimas linhas e 0 no resto, e um modelo com capacidade suficiente aprende a reconhecer o produto específico daquele conjunto.
>
> A terceira alternativa erra ao imaginar um limite técnico. Não há: o código roda, a matriz é gerada, nada dá erro. É o que torna este caso perigoso — o problema aparece como desempenho excelente no treino e queda no que o modelo nunca viu, e não como exceção na tela.
>
> As três saídas do capítulo são agrupar por frequência (o que aparece pouco vira "outros"), codificar pelo alvo com o cuidado do [capítulo I.3](i-3-dados.md), ou aprender um embedding. A escolha depende de quanto sinal existe na identidade do produto e de quanto dado há por categoria.
> **volte para:** #1-categorica-quantos-valores-diferentes-existem
:::

:::exercicio {"id":"representacao-e6","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Uma equipe codifica `cidade` pela média do alvo em cada cidade, calculada sobre a base inteira antes da divisão treino/teste. A validação fica excelente. Qual é o diagnóstico?

- [ ] A codificação pelo alvo é sempre proibida, e deveria ser substituída por one-hot.
- [x] A média usou o alvo das linhas de validação, então o atributo carrega a resposta; a técnica é válida, o cálculo é que precisa ficar dentro do treino e por dobra.
- [ ] O problema é a cardinalidade de `cidade`, e agrupar cidades pequenas em "outros" resolveria.
- [ ] Não há problema: a média do alvo é uma estatística agregada, e agregados não vazam.

> **gabarito:** a média usou o alvo da validação; o cálculo é que precisa ficar dentro do treino
> **porque:** Substituir a categoria pela média do alvo naquela categoria usa a resposta como entrada, e por isso o **momento** do cálculo decide tudo. Calculada com o dado inteiro, a média de cada cidade já contém o alvo das linhas que serão usadas para avaliar, e a validação deixa de medir generalização.
>
> A primeira alternativa joga fora uma técnica útil por causa de um erro de execução. Codificação pelo alvo é uma das três saídas legítimas para alta cardinalidade, e funciona quando calculada só no treino e por dobra.
>
> A última é a defesa que soa estatística e é falsa. Agregação não protege: a média de uma cidade com sete linhas é praticamente o alvo daquelas sete linhas. Quanto menor o grupo, mais o "agregado" é a própria resposta.
> **volte para:** #1-categorica-quantos-valores-diferentes-existem
:::

## O artesanato mudou de lugar, não desapareceu

A promessa do aprendizado de representações, o contraponto moderno formulado por Bengio, Courville e Vincent em 2013, é **aprender** a representação em vez de fabricá-la à mão. Em texto e imagem, a promessa se cumpriu de forma espetacular: ninguém mais escreve detector de borda à mão ([cap. III.4](iii-4-visao.md)).

Mas em **dado tabular**, que é a maior parte do trabalho real de empresa, o artesanato continua, e continua decidindo o resultado.

**E mesmo onde a promessa se cumpriu, ela mudou o artesanato de lugar em vez de eliminá-lo.** Quem monta o corpus decide o que conta como *contexto*; quem define a janela de um *embedding* decide o que é "companhia"; quem escolhe o que entra na tabela decide o que existe. É exatamente o trabalho que Harris fazia à mão em 1954, com outra ferramenta.

:::exercicio {"id":"representacao-e12","tipo":"multipla-multi","objetivo":"O1","dificuldade":"media"}
"O aprendizado de representações eliminou a engenharia de atributos." Quais correções esta seção faz a essa afirmação? (marque todas que valem)

- [x] Em dado tabular, que é a maior parte do trabalho de empresa, o artesanato continua e continua decidindo o resultado.
- [x] Mesmo onde a promessa se cumpriu, o artesanato mudou de lugar: quem monta o corpus decide o que conta como contexto.
- [x] Quem define a janela de um embedding decide o que é "companhia" entre palavras.
- [ ] A afirmação está simplesmente errada, porque nenhuma representação é de fato aprendida na prática.

> **gabarito:** tabular continua artesanal · o artesanato mudou de lugar · a janela do embedding é uma decisão humana
> **porque:** As três corretas separam duas coisas que a afirmação junta. Em texto e imagem a promessa se cumpriu de verdade, e ninguém mais escreve detector de borda à mão. Em tabela, não.
>
> E onde ela se cumpriu, as decisões humanas não sumiram: elas subiram um nível. Montar corpus, definir janela e escolher o que entra na tabela são escolhas de representação tanto quanto era escrever um atributo à mão, com a diferença de ficarem menos visíveis — e de serem tomadas antes, por quem talvez nem se considere responsável por representação.
>
> A alternativa errada exagera para o lado oposto e nega um fato. O capítulo não diz que o aprendizado de representações falhou; diz onde ele venceu, e o que continuou humano mesmo lá.
> **volte para:** #o-artesanato-mudou-de-lugar-nao-desapareceu
:::

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

:::exercicio {"id":"representacao-e9","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Um atributo novo é proposto numa reunião e todos concordam que faz sentido. Segundo esta seção, o que autoriza mantê-lo no modelo?

- [ ] O consenso da equipe sobre a plausibilidade da hipótese.
- [x] Um experimento com a mesma divisão e o mesmo protocolo, com a diferença comparada ao ruído.
- [ ] A correlação do atributo novo com o alvo, medida na base inteira.
- [ ] A melhora do erro de treino depois de incluí-lo.

> **gabarito:** um experimento com mesmo protocolo, diferença comparada ao ruído
> **porque:** A frase da seção é curta: atributo novo se justifica por experimento, não por plausibilidade. Plausibilidade é o que faz valer a pena testar; ela não é resultado.
>
> A terceira alternativa é pior do que parece, e não por preguiça: correlação alta com o alvo medida na base inteira é o sintoma clássico de vazamento, e um atributo construído a partir de conhecimento de domínio é exatamente onde o vazamento entra sem ser notado.
>
> A quarta troca o conjunto que decide. Erro de treino sempre melhora quando se acrescenta informação, inclusive informação inútil — quem responde é a validação, sob o mesmo protocolo de antes.
> **volte para:** #3-dominio-que-atributo-nao-esta-la
:::

:::exercicio {"id":"representacao-e10","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Uma tabela de clientes tem `total_gasto_historico`, `numero_de_compras` e `data_cadastro`. Quais afirmações desta seção se aplicam à construção de atributos aqui? (marque todas que valem)

- [x] O ticket médio carrega informação que nenhuma das duas colunas de gasto carrega sozinha.
- [x] Falta a data da última compra, e perceber a ausência vale mais do que transformar o que está presente.
- [x] Todo atributo temporal precisa ser calculado na data de corte de cada exemplo.
- [ ] Com essas três colunas é possível derivar a recência, dividindo o histórico pelo tempo de cadastro.

> **gabarito:** ticket médio · a ausência da recência · corte temporal por exemplo
> **porque:** As três corretas são os três movimentos da seção: razão em vez de absolutos, pergunta sobre o que não está lá, e disciplina temporal na construção.
>
> A alternativa errada é a mais instrutiva porque parece uma saída engenhosa. Dividir o histórico pelo tempo de cadastro dá uma **frequência média**, que descreve o cliente ao longo de anos e é quase cega ao que aconteceu no último mês. Um cliente que comprava toda semana e parou há noventa dias tem frequência média alta, e é justamente o que se quer detectar. Frequência média não é recência, e trocar uma pela outra é o tipo de substituição que passa despercebida em revisão.
>
> O que sobra é a lição de abertura: o modelo só vê o que você mostrou, e informação que não foi coletada nenhum algoritmo recupera.
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

:::exercicio {"id":"representacao-e4","tipo":"aberta","objetivo":"O1","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Um colega guarda a data e hora de cada pedido como um único inteiro (segundos desde 1970) e argumenta que "a informação está toda lá, o modelo que se vire". Explique por que essa representação é quase inútil para a maioria dos modelos, o que exatamente a decomposição em dia da semana e hora do dia acrescenta, e por que "a informação está toda lá" não é o mesmo que "o modelo consegue usá-la".

> **rubrica:** explica que o inteiro só oferece ordem e distância, e que os padrões que interessam (semanal, diário) **não são função simples** dele — sábado aparece a cada 604 800 segundos, e nenhum corte no eixo do inteiro isola sábados;
> diz o que a decomposição acrescenta: torna explícita uma regularidade cíclica que o modelo teria de reconstruir sozinho, e passa a permitir que ele a use com os cortes de que dispõe;
> conecta ao limite geral — nenhum modelo aprende o que a representação não deixa expressar, e mais dados não compensam representação que apaga a estrutura;
> não responde que "o modelo não entende datas": o problema não é o tipo do campo nem falta de inteligência do modelo, é qual informação a codificação torna **acessível** à família de funções que ele consegue formar
> **porque:** O argumento do colega é literalmente verdadeiro e praticamente errado, e essa distância é o capítulo inteiro. A informação **está** no inteiro — é reversível, nada foi perdido. Mas "estar presente" e "estar acessível" são coisas diferentes: uma árvore corta em limiares, um modelo linear soma termos ponderados, e nenhum dos dois expressa "é sábado" a partir de um número que cresce sem parar.
>
> Repare no que a decomposição faz de fato: ela não acrescenta informação nenhuma, **ela reorganiza a mesma informação numa forma que o modelo consegue usar**. É o exemplo mais limpo do princípio de abertura, o de que o modelo só vê o que você mostrou, e é por isso que este exercício vem no fim: a representação é a decisão que estabelece o **teto** do que qualquer modelo pode aprender, e ela é tomada antes de existir modelo.
>
> Um detalhe que a boa resposta costuma alcançar: a hora do dia também é cíclica, e 23h e 0h estão próximas no relógio e distantes no número. Quem percebe isso já está a um passo de codificar o ciclo com seno e cosseno — que é a mesma ideia, aplicada mais uma vez.
> **volte para:** #o-problema-o-modelo-so-ve-o-que-voce-mostrou
:::

## Verificação

1. Você tem uma coluna com 8 000 códigos de produto distintos. Descreva duas estratégias de codificação e diga em que situação escolheria cada uma.
2. A hipótese distribucional afirma que o sentido está na companhia. Dê um exemplo, fora de texto, em que representar um item pelo contexto funciona melhor que representá-lo pelos atributos próprios.

> Estas duas não são corrigidas, e a omissão é deliberada: a segunda, em especial, vale pelo exemplo que **você** traz — e um exemplo novo é melhor do que um exemplo certo.
