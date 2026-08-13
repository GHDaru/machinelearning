# II.1 — Avaliação

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

> **Capítulo-piloto do esqueleto v4.** É aqui que o formato do livro foi validado antes de ser exigido dos demais — como o cap. II.1 foi o piloto do livro de Engenharia de Harness, e pela mesma razão: avaliação é o assunto em que a diferença entre "achar que entendeu" e "entender" aparece mais rápido.

## Objetivos de aprendizagem

- **O1.** Explicar por que acurácia é enganosa sob desbalanceamento de classes.
- **O2.** Calcular e interpretar precisão, revocação e F1 a partir de uma matriz de confusão.
- **O3.** Escolher a métrica adequada a partir do **custo do erro** no problema, e não por hábito.
- **O4.** Distinguir a qualidade do *ranking* (AUC) da qualidade da *decisão* (limiar), e explicar por que calibração é uma terceira coisa.
- **O5.** Reportar uma métrica com incerteza, em vez de um ponto.

## O problema: 99,7% de acurácia sem modelo nenhum

Uma operadora de cartões pede um detector de fraude. A base tem 0,3% de transações fraudulentas. A equipe treina, mede, e reporta com orgulho: **99,5% de acurácia**.

O número é verdadeiro e é inútil. Um "modelo" de uma linha, `return "não é fraude"`, atinge 99,7%. A equipe entregou algo **pior que a ausência de modelo**, e a métrica escolhida escondeu isso atrás de dois noves.

Este capítulo é sobre não deixar isso acontecer. E o mecanismo do erro não é matemático — é de processo: **a métrica foi escolhida depois do modelo**, por hábito, em vez de antes, a partir do custo do erro.

### A linha de base que você precisa bater

Antes de qualquer métrica sofisticada, calcule o que um classificador trivial atinge:

- **Classificação**: sempre a classe majoritária.
- **Regressão**: sempre a média (ou a mediana) do treino.
- **Séries temporais**: repetir o último valor observado. Essa costuma ser surpreendentemente difícil de bater.

Se o modelo não bate a linha de base, ele não tem valor — independentemente de quantos dígitos a acurácia tenha. Registre esse número no início do projeto e mantenha-o visível em todo relatório. É o gesto mais barato de higiene metodológica que existe, e o mais frequentemente pulado.

:::exercicio {"id":"avaliacao-e1","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Numa base de detecção de fraude com 0,3% de casos positivos, um modelo atinge 99,5% de acurácia no teste. Qual leitura é correta?

- [ ] O modelo é excelente: erra menos de 1 caso em 200.
- [x] O número não diz quase nada: prever "não é fraude" para tudo já daria 99,7%.
- [ ] A acurácia não pode ser usada em problemas binários.
- [ ] O modelo é bom, mas precisaria de mais dados para confirmar.

> **gabarito:** O número não diz quase nada
> **porque:** Com 0,3% de positivos, a classe majoritária sozinha entrega 99,7% de acurácia. O modelo com 99,5% está **abaixo** do classificador que não faz nada — ele está, na prática, destruindo valor. Acurácia mede a fração de acertos totais; quando uma classe domina, ela mede sobretudo a **prevalência**, não a competência do modelo. Note que a alternativa "não pode ser usada em problemas binários" é falsa e revela outro mal-entendido: acurácia é perfeitamente válida quando as classes são equilibradas e os dois tipos de erro custam o mesmo. O problema não é a métrica; é usá-la fora da condição em que ela informa.
> **volte para:** #a-linha-de-base-que-voce-precisa-bater
:::

:::exercicio {"id":"avaliacao-e6","tipo":"numerica","objetivo":"O1","dificuldade":"facil"}
Uma base de manutenção preditiva tem 8% de máquinas com falha no período. Qual acurácia um classificador trivial, que prevê sempre "sem falha", alcança? Responda em fração, com duas casas decimais.

> **gabarito:** 0.92 ± 0.01
> **porque:** O trivial acerta todos os negativos e erra todos os positivos, então a acurácia dele é exatamente a proporção da classe majoritária: 100% − 8% = **92%**.
>
> A conta é banal e o hábito de fazê-la não é. Ela é o piso contra o qual todo o resto se mede, e é o gesto mais barato de higiene metodológica que existe. Um modelo que reporta 0,93 neste problema ganhou um ponto percentual sobre não fazer nada, e essa é a informação que a acurácia sozinha esconde.
>
> Repare no efeito colateral útil: calcular a linha de base **antes** de treinar já revela quanto espaço existe. Com 92% de piso, qualquer promessa de "95% de acurácia" precisa ser lida como três pontos de ganho, não como quase perfeição.
> **volte para:** #a-linha-de-base-que-voce-precisa-bater
:::

:::exercicio {"id":"avaliacao-e7","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Uma equipe rebate: "sabemos do desbalanceamento, por isso reequilibramos a base por reamostragem antes de treinar. Agora as classes estão 50/50 e a acurácia de 0,88 é honesta". Qual é a avaliação correta?

- [ ] Correto: com as classes equilibradas, a acurácia volta a ser uma métrica adequada.
- [x] O 0,88 descreve um mundo 50/50 que não existe em produção, onde a prevalência continua sendo a original.
- [ ] Errado, porque reamostrar a base é sempre uma prática inválida.
- [ ] Correto, desde que a reamostragem tenha sido feita também no conjunto de teste.

> **gabarito:** o 0,88 descreve um mundo que não existe em produção
> **porque:** Reequilibrar o **treino** é uma técnica legítima, e às vezes ajuda o modelo a aprender a classe rara. Reequilibrar o conjunto que **mede** é outra coisa: ele deixa de representar a população onde o modelo vai operar, e toda métrica calculada ali passa a responder a uma pergunta hipotética.
>
> É por isso que a quarta alternativa é a mais perigosa da lista — ela propõe justamente a piora, com a aparência de coerência metodológica. O teste tem de manter a prevalência real, sempre.
>
> A terceira erra pelo lado oposto e proíbe uma técnica útil. O problema nunca foi reamostrar; foi medir onde não se deve, que é a mesma família de erro do capítulo inteiro: a métrica escolhida sem a condição em que ela informa.
> **volte para:** #a-linha-de-base-que-voce-precisa-bater
:::

## De onde isto veio

Este capítulo tem um nome estranho no meio dele — **curva ROC**, "característica de operação do receptor". Receptor de quê? A resposta explica a métrica inteira.

**O aperto.** Segunda Guerra Mundial, estações de radar britânicas e americanas. Um operador olha uma tela e vê um borrão. Aquilo é um bombardeiro inimigo, um navio amigo, uma revoada de pássaros, ou ruído do próprio aparelho? Ele tem segundos para decidir, e **os dois erros matam**: deixar passar um bombardeiro custa uma cidade; disparar o alarme à toa esgota a defesa e, repetido, faz os alarmes serem ignorados.

**O que se fazia antes.** Conta-se que a qualidade do operador e do equipamento era medida por uma taxa de acerto, quantas detecções corretas num turno, e que daí apareceu o problema que este capítulo inteiro persegue: **um operador nervoso, que apertasse o botão em quase tudo, teria taxa de detecção excelente.** O número subiria; a defesa pioraria. (Esta narrativa é a corrente na literatura didática de detecção de sinal; não a conferimos em fonte da época — ver a tabela ao fim da seção.)

**A virada.** Perceber que detecção e falso alarme **não são dois defeitos independentes: são as duas pontas de um mesmo botão.** Segundo a versão corrente, o receptor de radar tinha um controle de ganho: girá-lo para cima fazia aparecer mais alvos verdadeiros *e* mais fantasmas; para baixo, limpava a tela *e* escondia bombardeiros. Não existia posição sem custo. Então pare de medir um ponto e **meça a curva inteira**: para cada posição do botão, quanto se detecta e quanto se alarma à toa. Essa curva é a característica de operação do receptor.

**A ideia reaproveitável — e é a maior deste capítulo.** **O limiar não é propriedade do modelo; é a decisão de quem assume as consequências.** No radar isso era literal: havia um botão, e girá-lo trocava um tipo de erro por outro. Um modelo entrega um *ranking*; transformá-lo em decisão exige alguém dizer quanto custa cada erro. Nenhum valor de limiar é "o certo" sem essa conversa — e quando o cientista de dados escolhe o limiar sozinho, ele não está fazendo uma escolha técnica: está tomando, calado, uma decisão que era de outra pessoa.

**O nome.** *Receiver Operating Characteristic* é literalmente a característica de operação daquele receptor de rádio. O gráfico como o usamos vem do trabalho pós-guerra em teoria da detecção de sinal: um relatório técnico de **Peterson e Birdsall** na Universidade de Michigan, em 1953, publicado no ano seguinte como *"The theory of signal detectability"* por Peterson, Birdsall e Fox (*Transactions of the IRE*, 4(4):171–212, 1954). No mesmo ano de 1954, a ideia chega à psicologia por Tanner e Swets, em *"A decision-making theory of visual detection"* (*Psychological Review* 61(6):401–409), e de lá migra para a medicina, a meteorologia e, por fim, para cá.

> **Por que a história importa na prática.** Quem sabe que a ROC nasceu de um botão físico nunca mais confunde *"o modelo é bom"* com *"o limiar está certo"*. São duas perguntas, e só a primeira é técnica.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ⏳ | A origem no radar da Segunda Guerra e o controle de ganho ajustável pelo operador — consistente entre fontes secundárias; **nenhuma primária da época foi aberta** |
| ✓ᵐ | As fichas dos dois marcos de 1954: **Peterson, Birdsall & Fox**, *"The theory of signal detectability"*, *Transactions of the IRE Professional Group on Information Theory* 4(4):171–212, [10.1109/tit.1954.1057460](https://doi.org/10.1109/tit.1954.1057460); e **Tanner & Swets**, *"A decision-making theory of visual detection"*, *Psychological Review* 61(6):401–409, [10.1037/h0058700](https://doi.org/10.1037/h0058700) |
| ⏳ | Que o **termo** *Receiver Operating Characteristic* tenha nascido nesse trabalho, e o conteúdo do relatório de 1953. Tentei abrir o relatório em dois repositórios e **os dois recusaram** a transferência: o de defesa devolveu página em vez de documento, e o da universidade respondeu com desafio de robô. A ficha existe; o texto, não |
| ⏳ | O caso do operador com alta taxa de detecção por excesso de alarme — narrado de forma consistente na literatura didática de detecção de sinal |
| 📖 | A ideia reaproveitável ("o limiar é decisão de quem assume as consequências") e a leitura de que escolher limiar calado é tomar decisão alheia |

## Fundamentos: a matriz de confusão e o que dela deriva

Toda métrica de classificação binária nasce de quatro números:

|  | Predisse positivo | Predisse negativo |
|---|---|---|
| **É positivo** | Verdadeiro Positivo (VP) | Falso Negativo (FN) |
| **É negativo** | Falso Positivo (FP) | Verdadeiro Negativo (VN) |

A partir deles:

| Métrica | Fórmula | Pergunta que responde |
|---|---|---|
| **Acurácia** | (VP+VN)/total | de tudo, quanto acertei? |
| **Precisão** | VP/(VP+FP) | dos que **apontei** como positivos, quantos eram? |
| **Revocação** | VP/(VP+FN) | dos que **eram** positivos, quantos encontrei? |
| **F1** | média harmônica de precisão e revocação | um número quando os dois importam igualmente |
| **Especificidade** | VN/(VN+FP) | dos negativos, quantos deixei em paz? |

A distinção entre precisão e revocação é o eixo do capítulo, e a mnemônica que funciona é a das perguntas: **precisão olha para a coluna do que você apontou; revocação olha para a linha do que existia.**

E há um trade-off inescapável entre elas. Um modelo que aponta *tudo* como positivo tem revocação 1,0 e precisão péssima. Um que aponta apenas o caso de que tem certeza absoluta tem precisão alta e revocação irrisória. Mover o limiar desloca você ao longo dessa curva — nunca melhora os dois ao mesmo tempo.

### Worked example: a mesma matriz, três leituras

Um modelo de triagem médica, avaliado em 1.000 pacientes, dos quais 100 têm a doença:

|  | Predisse doente | Predisse saudável |
|---|---|---|
| **Doente** | VP = 80 | FN = 20 |
| **Saudável** | FP = 40 | VN = 860 |

- **Acurácia** = (80+860)/1000 = **0,940**
- **Precisão** = 80/(80+40) = **0,667** — de cada 3 alarmes, 1 é falso
- **Revocação** = 80/(80+20) = **0,800** — 20 doentes passaram despercebidos
- **F1** = 2·(0,667·0,800)/(0,667+0,800) = **0,727**
- **Linha de base trivial** ("todos saudáveis") = 900/1000 = **0,900**

Três leituras do mesmo modelo, e todas verdadeiras:

1. **"94% de acurácia"** — tecnicamente correto, e quase desonesto: o trivial faz 90%.
2. **"Encontra 4 de cada 5 doentes"** — a leitura da revocação. É a que importa numa triagem, porque o custo de um FN é uma doença não tratada.
3. **"Um terço dos alarmes é falso"** — a leitura da precisão. É a que determina se o serviço é operável: se cada alarme custa um exame caro, 33% de desperdício pode inviabilizar o programa.

**A métrica certa é a que responde à pergunta cujo erro custa caro.** Numa triagem, FN mata e FP custa dinheiro — então revocação manda, com precisão como restrição orçamentária. Num filtro de spam, é o inverso: o FN é um email chato na caixa de entrada, o FP é uma fatura perdida na pasta de lixo. Mesmo formalismo, prioridades opostas.

:::exercicio {"id":"avaliacao-e2","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Um classificador produziu a seguinte matriz de confusão: VP = 45, FP = 15, FN = 30, VN = 410.

Qual é a **precisão**? Responda com 2 casas decimais.

> **gabarito:** 0.75 ± 0.01
> **porque:** Precisão = VP/(VP+FP) = 45/(45+15) = 45/60 = **0,75**. O erro mais comum aqui é usar VP/(VP+FN), que dá 45/75 = 0,60, ou seja, a **revocação**. A forma de nunca trocar é voltar à pergunta: precisão pergunta "dos que apontei, quantos eram?", então o denominador é tudo o que você apontou como positivo (VP+FP). Revocação pergunta "dos que eram, quantos achei?", então o denominador é tudo o que era positivo de verdade (VP+FN). Repare que este modelo tem precisão razoável e revocação de 0,60 — ele erra pouco quando fala, mas fica calado com frequência.
> **volte para:** #fundamentos-a-matriz-de-confusao-e-o-que-dela-deriva
:::

:::exercicio {"id":"avaliacao-e8","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Qual pergunta a **revocação** responde?

- [ ] Dos que apontei como positivos, quantos eram mesmo?
- [x] Dos que eram positivos, quantos eu encontrei?
- [ ] De tudo, quanto eu acertei?
- [ ] Dos negativos, quantos eu deixei em paz?

> **gabarito:** dos que eram positivos, quantos encontrei
> **porque:** É a mnemônica que evita a troca mais comum do capítulo: **precisão olha para a coluna do que você apontou, revocação olha para a linha do que existia**. O denominador segue a pergunta — em revocação é tudo o que era positivo de verdade, ou seja, VP mais FN.
>
> A primeira alternativa é a precisão, a terceira é a acurácia e a quarta é a especificidade. As quatro nascem dos mesmos quatro números da matriz, e trocar uma pela outra não é erro de conta: é responder a uma pergunta diferente da que foi feita.
>
> Vale guardar a pergunta em vez da fórmula. Quem decora VP/(VP+FN) troca os denominadores sob pressão; quem guarda "dos que eram, quantos achei" reconstrói a fórmula na hora.
> **volte para:** #fundamentos-a-matriz-de-confusao-e-o-que-dela-deriva
:::

:::exercicio {"id":"avaliacao-e9","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Um modelo tem precisão 0,90 e revocação 0,30. Uma equipe propõe baixar o limiar para "melhorar a revocação sem perder precisão". O que se pode afirmar?

- [ ] É possível, se o modelo for retreinado com mais dados junto com a mudança de limiar.
- [x] Mover o limiar desloca o modelo ao longo do compromisso entre as duas: baixá-lo aumenta a revocação e reduz a precisão, sempre.
- [ ] Baixar o limiar aumenta as duas, porque o modelo passa a encontrar mais positivos.
- [ ] O limiar não afeta precisão nem revocação, apenas a acurácia.

> **gabarito:** baixar o limiar aumenta revocação e reduz precisão
> **porque:** O limiar não muda o modelo, muda onde você corta o escore que ele já produziu. Baixá-lo faz o modelo apontar mais casos: entre os novos apontados há positivos que antes escapavam, o que sobe a revocação, e também negativos, o que desce a precisão. O caso extremo torna isso óbvio — apontar tudo dá revocação 1,0 e precisão igual à prevalência.
>
> A primeira alternativa é a que confunde duas coisas diferentes e por isso é instrutiva. Retreinar **pode** mesmo melhorar as duas, porque muda a curva inteira; mover o limiar **anda sobre** a curva existente. A frase da equipe pede a segunda coisa com a expectativa da primeira.
>
> Diante de precisão 0,90 e revocação 0,30, a pergunta útil não é qual limiar usar: é qual dos dois erros custa mais neste problema. O limiar é a resposta a essa pergunta, não um parâmetro a otimizar sozinho.
> **volte para:** #fundamentos-a-matriz-de-confusao-e-o-que-dela-deriva
:::

:::exercicio {"id":"avaliacao-e3","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Um sistema faz a triagem inicial de currículos, descartando candidatos antes de qualquer olhar humano. Qual métrica deve orientar a decisão de limiar, e por quê?

- [ ] Precisão: é caro entrevistar candidatos ruins.
- [x] Revocação: um candidato bom descartado nunca mais é recuperado, e ninguém fica sabendo do erro.
- [ ] Acurácia: é a métrica mais completa, pois considera as quatro células.
- [ ] F1: equilibra as duas e evita ter de escolher.

> **gabarito:** Revocação
> **porque:** A pergunta não é estatística, é de **assimetria de custo e de visibilidade**. Um falso positivo (candidato mediano que passa) custa uma entrevista — é caro, mas é detectado e corrigido pelo humano na etapa seguinte. Um falso negativo (candidato bom descartado) é invisível: ninguém no processo jamais saberá que ele existiu, o erro nunca aparece em nenhum relatório e não há mecanismo de correção. Erros invisíveis são mais perigosos que erros caros, porque não geram aprendizado. Escolher F1 aqui (alternativa 4) é a resposta mais sedutora e a mais preguiçosa: F1 assume que os dois erros pesam igual, e a premissa inteira deste caso é que **não pesam**. Escolher F1 é declarar indiferença — só que sem perceber que está declarando.
> **volte para:** #worked-example-a-mesma-matriz-tres-leituras
:::

:::exercicio {"id":"avaliacao-e10","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Num filtro de spam, qual erro custa mais caro ao usuário?

- [ ] O falso negativo: um spam que chega à caixa de entrada.
- [x] O falso positivo: uma fatura legítima mandada para a pasta de lixo.
- [ ] Os dois custam igual, e por isso a métrica correta é F1.
- [ ] Depende apenas do volume de mensagens, não do tipo de erro.

> **gabarito:** o falso positivo
> **porque:** É o par invertido da triagem médica, e o capítulo os põe lado a lado de propósito. Um spam na caixa de entrada é um incômodo que o usuário vê e apaga em dois segundos. Uma fatura na pasta de lixo é uma perda que ele **não vê**, e que descobre quando o serviço é cortado.
>
> A terceira alternativa é a saída que evita a decisão. F1 assume que os dois erros pesam igual, e a premissa deste caso é que não pesam — escolher F1 aqui é declarar indiferença sem perceber que está declarando.
>
> Mesmo formalismo, prioridades opostas: na triagem manda a revocação, no spam manda a precisão. É o que a frase do capítulo resume — a métrica certa é a que responde à pergunta cujo erro custa caro.
> **volte para:** #worked-example-a-mesma-matriz-tres-leituras
:::

:::exercicio {"id":"avaliacao-e11","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Um município vai usar um modelo para priorizar visitas da vigilância sanitária a restaurantes. A equipe tem 40 fiscais e cerca de 9 000 estabelecimentos. Hoje as visitas são por sorteio.

Escolha a métrica que deve orientar o limiar e defenda a escolha pelo custo do erro. Diga também qual restrição operacional entra na conta, e o que você exigiria ver antes de trocar o sorteio pelo modelo.

> **rubrica:** nomeia os dois erros no contexto, ou seja, um restaurante com problema não visitado e uma visita gasta em estabelecimento sem problema;
> escolhe uma métrica e justifica pela assimetria de custo, não por hábito nem por ser "a mais completa";
> traz a capacidade dos fiscais para dentro da decisão, reconhecendo que só cabe um número fixo de visitas por período;
> exige a comparação com a linha de base vigente, que aqui é o sorteio, e não com um modelo trivial abstrato;
> considera ao menos um efeito de segunda ordem, como a base futura passar a conter só quem o modelo mandou visitar
> **porque:** A resposta fraca escolhe revocação porque "problema de saúde é grave" e para aí. Não está errada no instinto e ignora o que torna este caso diferente: **a capacidade é fixa**. Com 40 fiscais, o número de visitas por mês é um teto, e revocação alta não é alcançável por decreto — só se alcança visitando mais, que é justamente o que não dá.
>
> A resposta forte reconhece que o problema não é de limiar, é de **ordenação sob orçamento**. O que interessa é a qualidade das N primeiras posições da fila, com N igual à capacidade, e é isso que precisão no topo da lista mede. Revocação continua sendo o objetivo social, e a métrica operável é quantos problemas reais entram nas visitas que cabem.
>
> A comparação exigida também é específica: a linha de base aqui não é um classificador trivial, é o **sorteio que já existe**. Se o modelo não encontra mais problemas por visita do que o sorteio, ele não paga o próprio custo, por melhor que a AUC pareça.
>
> E o efeito de segunda ordem é o que separa uma resposta excelente. Passando a visitar só quem o modelo aponta, o histórico futuro conterá desfechos apenas desses, e o sistema aprenderá sobre uma fatia que ele mesmo selecionou. Manter uma fração de visitas sorteadas custa fiscais e é o que mantém a base honesta, exatamente como no [capítulo I.3](i-3-dados.md).
> **volte para:** #worked-example-a-mesma-matriz-tres-leituras
:::

## Ranking, decisão e calibração — três coisas diferentes

Um classificador quase sempre produz um **escore** contínuo, e só vira decisão quando você escolhe um **limiar**. Isso separa três perguntas que costumam ser confundidas numa só.

**1. O ranking é bom?** — Se eu ordenar todos os exemplos pelo escore, os positivos ficam no topo? É o que a **AUC-ROC** mede: a probabilidade de um positivo sorteado ao acaso receber escore maior que um negativo sorteado ao acaso. AUC não depende de limiar nenhum.

**2. A decisão é boa?** — Escolhido um limiar, quantos FP e FN aparecem? É aí que vivem precisão, revocação e o custo real da operação.

**3. Os escores são probabilidades honestas?** — Quando o modelo diz 0,8, isso acontece 80% das vezes? Isso é **calibração**, e é uma propriedade *independente* das duas anteriores. Um modelo pode ter AUC excelente (ordena perfeitamente) e ser péssimo calibrado (todos os escores comprimidos entre 0,4 e 0,6). Se a decisão a jusante multiplica a probabilidade por um valor monetário (preço, provisão, expectativa de perda), calibração deixa de ser refinamento e vira requisito.

**Uma armadilha específica.** Sob desbalanceamento severo, a AUC-ROC é otimista: o eixo de falsos positivos é normalizado pelo total de negativos, que é enorme, então mesmo muitos FP mal movem a curva. Para classes raras, prefira a **AUC-PR** (precisão × revocação), cuja linha de base é a própria prevalência — 0,003 no exemplo da fraude, o que deixa qualquer melhora visível em vez de diluída.

> **Cláusula de expiração.** Escrevo em 2026 que AUC-PR é a escolha padrão para classes raras e que a calibração é tratada como etapa pós-treino (Platt, isotônica). Se, na próxima revisão, os modelos de uso geral estiverem entregando escores bem calibrados sem etapa dedicada, esta seção muda de recomendação. Acompanhamento no [placar de expiração](../HISTORICO.md).

:::exercicio {"id":"avaliacao-e4","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Um modelo tem AUC-ROC de 0,95 no teste. Quais conclusões são **legítimas** a partir só desse número? (marque todas que valem)

- [x] O modelo ordena bem: positivos tendem a receber escores maiores que negativos.
- [ ] O modelo acerta 95% das predições.
- [ ] Os escores do modelo podem ser lidos como probabilidades confiáveis.
- [x] Existe **algum** limiar com um bom compromisso entre precisão e revocação.
- [ ] O modelo terá bom desempenho mesmo se a prevalência da classe positiva mudar.

> **gabarito:** ordena bem · existe algum limiar com bom compromisso
> **porque:** AUC é uma medida de **ordenação**, e só isso. Ela não é uma taxa de acerto (0,95 de AUC não é 95% de acurácia, são grandezas diferentes), não diz nada sobre **calibração** (um modelo pode ordenar perfeitamente e ainda assim ter escores sem significado probabilístico), e não sobrevive intacta a mudanças de prevalência: quando a proporção de positivos muda, precisão e a operação real mudam junto, mesmo com a AUC-ROC estável. Esse último ponto é exatamente por que a AUC-PR é preferível para classes raras: ela é sensível à prevalência, que é o que muda no mundo. As duas corretas são as únicas que se limitam ao que a definição da AUC autoriza.
> **volte para:** #ranking-decisao-e-calibracao-tres-coisas-diferentes
:::

:::exercicio {"id":"avaliacao-e12","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Um modelo de risco de crédito serve para calcular a provisão esperada, multiplicando a probabilidade prevista pelo valor do contrato. Qual das três propriedades passa a ser requisito, e não refinamento?

- [ ] A AUC, porque a ordenação é o que sustenta qualquer cálculo.
- [x] A calibração, porque o número previsto é multiplicado por dinheiro e precisa significar o que diz.
- [ ] A precisão no limiar escolhido, porque provisão é uma decisão binária.
- [ ] Nenhuma: qualquer escore serve, desde que aplicado de forma consistente.

> **gabarito:** a calibração
> **porque:** É a distinção que a seção faz e que quase nunca é feita na prática. AUC diz que o modelo **ordena**; calibração diz que quando ele afirma 0,8 isso acontece 80% das vezes. Multiplicar por valor monetário usa o número como probabilidade, então a ordenação sozinha não basta.
>
> Um modelo pode ordenar perfeitamente, com AUC excelente, e ter todos os escores comprimidos entre 0,4 e 0,6. A provisão calculada com esses escores estará errada em todo contrato, sem que nenhuma métrica de ordenação acuse.
>
> A terceira alternativa troca o problema por um binário que ele não é: provisão não é decidir sim ou não, é atribuir um valor. Onde a decisão a jusante multiplica a probabilidade por algo, calibração deixa de ser refinamento e vira requisito.
> **volte para:** #ranking-decisao-e-calibracao-tres-coisas-diferentes
:::

:::exercicio {"id":"avaliacao-e13","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Numa base com 0,3% de positivos, por que a AUC-PR é preferível à AUC-ROC?

- [ ] Porque a AUC-PR é mais fácil de calcular quando a classe é rara.
- [x] Porque o eixo de falsos positivos da ROC é normalizado por um total de negativos enorme, e mesmo muitos FP mal movem a curva.
- [ ] Porque a AUC-ROC não pode ser calculada com classes desbalanceadas.
- [ ] Porque a AUC-PR é insensível à prevalência, o que a torna comparável entre bases.

> **gabarito:** a normalização pelo total de negativos torna a ROC otimista
> **porque:** Com 99,7% de negativos, acrescentar centenas de falsos positivos muda pouquíssimo a taxa de falso positivo, porque o denominador é gigantesco. A curva ROC fica bonita enquanto a operação real está cheia de alarmes falsos.
>
> A AUC-PR usa precisão, cujo denominador é o que o modelo apontou, então cada FP pesa. E a linha de base dela é a própria prevalência, 0,003 aqui, o que deixa qualquer melhora visível em vez de diluída.
>
> A última alternativa inverte a propriedade e é o erro mais fino da lista. A AUC-PR é justamente **sensível** à prevalência, e é isso que a torna informativa neste caso — o preço é que ela não se compara entre bases de prevalências diferentes.
> **volte para:** #ranking-decisao-e-calibracao-tres-coisas-diferentes
:::

## Métrica é uma estimativa — reporte a incerteza

Uma acurácia de 0,94 medida em 100 exemplos e uma medida em 100.000 exemplos são o mesmo número e informações muito diferentes. A primeira tem intervalo de confiança de 95% de aproximadamente ±0,047; a segunda, de ±0,0015. Reportar as duas como "0,94" apaga a diferença que mais importa para decidir.

Duas práticas baratas resolvem quase tudo:

1. **Intervalo por *bootstrap***: reamostre o conjunto de teste com reposição algumas centenas de vezes, recalcule a métrica em cada reamostra, e reporte os percentis 2,5 e 97,5. Não exige suposição sobre a distribuição e funciona para qualquer métrica.
2. **Validação cruzada com desvio-padrão**: reporte média ± desvio entre as dobras. Um modelo com 0,84 ± 0,01 e outro com 0,86 ± 0,09 não estão empatados nem separados — estão em situações qualitativamente diferentes, e o segundo é instável.

Regra prática que vale como norma editorial deste livro: **duas métricas sem intervalos não podem ser comparadas.** "Melhorou de 0,912 para 0,918" é uma frase sem conteúdo até que se saiba se o ruído da medição é maior que 0,006.

:::exercicio {"id":"avaliacao-e5","tipo":"aberta","objetivo":"O5","pontos":3,"dificuldade":"dificil"}
Sua equipe compara dois modelos no mesmo conjunto de teste de 800 exemplos: o modelo A tem F1 = 0,812 e o modelo B, F1 = 0,829. Alguém propõe substituir A por B em produção.

Escreva a resposta que você daria: **o que falta saber** antes dessa decisão, e **como você obteria** essa informação.

> **rubrica:** questiona se a diferença de 0,017 é maior que a incerteza da medição;
> propõe um procedimento concreto para estimar essa incerteza (bootstrap, validação cruzada ou teste pareado);
> observa que os dois modelos foram medidos no mesmo conjunto, o que permite comparação pareada e reduz a variância da comparação;
> considera ao menos um fator além da métrica (custo de troca, latência, interpretabilidade, calibração, comportamento por subgrupo)
> **porque:** A diferença é de 0,017 num conjunto de 800 exemplos — plausivelmente dentro do ruído amostral. O caminho correto não é rejeitar B, é **medir a incerteza antes de decidir**: bootstrap pareado sobre o mesmo teste (reamostre os índices, recalcule as duas métricas na mesma reamostra e observe a distribuição da **diferença**) responde diretamente à pergunta certa. O detalhe do pareamento é o que separa uma resposta boa de uma correta: como os dois modelos foram avaliados nos mesmos exemplos, a comparação pareada elimina a variância comum ao conjunto e é bem mais sensível que comparar dois intervalos independentes. E a decisão de produção nunca é só da métrica — trocar modelo tem custo, e um ganho dentro do ruído não paga esse custo.
> **volte para:** #metrica-e-uma-estimativa-reporte-a-incerteza
:::

:::exercicio {"id":"avaliacao-e14","tipo":"multipla","objetivo":"O5","dificuldade":"facil"}
Dois relatórios trazem acurácia de 0,94. O primeiro mediu em 100 exemplos, o segundo em 100 000. O que se pode dizer?

- [ ] São a mesma informação, porque o número é o mesmo.
- [x] São informações muito diferentes: o intervalo de 95% é de cerca de ±0,047 no primeiro e ±0,0015 no segundo.
- [ ] O primeiro é mais confiável, porque uma amostra menor é mais controlada.
- [ ] O segundo é inválido, porque testar em 100 000 exemplos indica vazamento.

> **gabarito:** informações muito diferentes, pelo tamanho do intervalo
> **porque:** Métrica é estimativa, e estimativa tem incerteza que encolhe com o tamanho da amostra. Reportar os dois como "0,94" apaga exatamente a diferença que decide se dá para agir sobre o número.
>
> Com ±0,047, o valor real está plausivelmente entre 0,89 e 0,99, e qualquer comparação com outro modelo dentro dessa faixa é conversa. Com ±0,0015, a mesma comparação passa a distinguir modelos.
>
> Daí a norma editorial deste livro: duas métricas sem intervalos não podem ser comparadas. "Melhorou de 0,912 para 0,918" não tem conteúdo até se saber se o ruído da medição é maior que 0,006.
> **volte para:** #metrica-e-uma-estimativa-reporte-a-incerteza
:::

:::exercicio {"id":"avaliacao-e15","tipo":"multipla","objetivo":"O5","dificuldade":"media"}
Duas validações cruzadas: o modelo A dá 0,84 ± 0,01 entre as dobras, e o B dá 0,86 ± 0,09. Qual leitura é correta?

- [ ] B é melhor, porque a média é maior.
- [x] Eles não estão nem empatados nem separados: B é instável entre as dobras, e essa instabilidade é informação sobre o modelo, não ruído a ignorar.
- [ ] A é melhor, porque desvio menor sempre indica modelo superior.
- [ ] Os dois são equivalentes, porque os intervalos se sobrepõem.

> **gabarito:** não empatados nem separados; B é instável
> **porque:** O desvio entre dobras não é um detalhe do relatório: é uma medida de quanto o desempenho depende de quais exemplos calharam de ficar em cada dobra. Um modelo com ±0,09 pode entregar 0,77 no mês em que a amostra de produção se parecer com a pior dobra.
>
> A quarta alternativa aplica corretamente uma regra e chega a uma conclusão errada. Sobreposição de intervalos impede afirmar que B é melhor, e não autoriza declarar equivalência: as duas situações são qualitativamente diferentes, e a diferença está na dispersão, não na média.
>
> A terceira exagera para o outro lado. Desvio menor é preferível quando as médias são comparáveis, e não é critério isolado de qualidade — um modelo consistentemente medíocre também tem desvio baixo.
> **volte para:** #metrica-e-uma-estimativa-reporte-a-incerteza
:::

## Mão na massa

A **etapa 04** do [`ml-zero`](../trilha-ml-zero.md) implementa, em NumPy puro e sem scikit-learn:

1. `matriz_confusao(y_true, y_pred)` — os quatro números;
2. `precisao`, `revocacao`, `f1` derivadas dela;
3. `curva_pr` e `auc_pr` por varredura de limiares;
4. `bootstrap_ic(metrica, y_true, y_score, n=1000)` — o intervalo de confiança;
5. a comparação pareada entre dois modelos que o exercício avaliacao-e5 pediu.

Implementar precisão e revocação uma vez, à mão, é o antídoto mais duradouro contra trocá-las — que é o erro mais comum do capítulo, inclusive entre praticantes experientes.

## Assista

:::video {"id":"avaliacao-v1","fonte":"youtube","ref":"4jRBRDbJemM","min":16,"autor":"StatQuest with Josh Starmer","titulo":"ROC and AUC, Clearly Explained!"}
A curva ROC é o conceito deste capítulo que menos sobrevive à explicação em prosa. O vídeo constrói a curva **ponto a ponto**, deslizando o limiar e mostrando a matriz de confusão mudar junto — e é essa animação que faz cair a ficha de que ROC não é uma métrica de um modelo, mas o retrato de *todos os limiares de uma vez*. Assista antes do exercício avaliacao-e4.
:::

## Síntese — o que levar

- **Calcule a linha de base trivial antes de tudo** e mantenha-a em todo relatório. Modelo que não a bate não existe.
- Acurácia informa quando as classes são equilibradas e os erros custam igual. Fora disso, ela esconde.
- **Escolha a métrica pelo custo do erro, antes de treinar.** Escolher depois é escolher a que ficou bonita.
- AUC mede *ranking*; limiar produz *decisão*; calibração é uma **terceira** propriedade, exigida sempre que a probabilidade vira dinheiro.
- Métrica sem intervalo não se compara. Bootstrap pareado é barato e resolve.

## Verificação

1. Explique a diferença entre precisão e revocação para alguém de negócio, sem escrever nenhuma fórmula.
2. Em que situação um modelo com AUC de 0,99 pode ser inútil na prática? Dê um exemplo concreto.
3. Sua equipe reporta "acurácia de 97%". Que três perguntas você faz antes de aprovar o deploy?
