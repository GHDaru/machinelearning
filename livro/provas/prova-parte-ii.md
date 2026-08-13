# Prova da Parte II — Análise Preditiva

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado**. A recomendação do livro a quem dá aula é pontuar **por ter
> feito, nunca por ter acertado**: pontuar esforço remove o incentivo de colar,
> pontuar acerto o cria.

## O que esta prova é

Doze itens sobre os oito capítulos da Parte II, de [II.1](../capitulos/ii-1-avaliacao.md)
a [II.8](../capitulos/ii-8-do-modelo-a-decisao.md). Cada item **cruza dois
capítulos ou mais**, e é essa a diferença entre uma prova e mais uma lista.

Nenhum item traz o **"volte para"**: a prova mede o que você recupera sem rota
de volta. Todo cenário é **inédito**, para que reconhecer o exemplo não
substitua entender o conceito. E todos os itens são corrigidos na hora, sem
consultar modelo de linguagem.

:::exercicio {"id":"prova-parte-ii-q1","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/ii-1-avaliacao.md:O3","livro/capitulos/ii-8-do-modelo-a-decisao.md:O2"],"dificuldade":"media"}
Uma transportadora usa um modelo para decidir quais cargas passam por inspeção extra. Inspecionar custa R$ 80. Uma carga irregular que passa sem inspeção custa R$ 3 200 em multa. Não inspecionar carga regular não custa nada.

Qual é a leitura correta da relação entre métrica e limiar aqui?

- [ ] A métrica que orienta o limiar é a acurácia, porque ela considera as quatro células.
- [x] O custo assimétrico desloca o limiar bem abaixo de 0,5, e quem escolhe o modelo é a métrica de ordenação, enquanto quem opera o modelo é a matriz de custo.
- [ ] Como inspecionar é barato, o limiar deve ser 0,5 para equilibrar os dois erros.
- [ ] O limiar ótimo depende apenas da proporção de cargas irregulares na base.

> **gabarito:** o custo assimétrico desloca o limiar, e métrica e matriz têm papéis distintos
> **porque:** Uma multa vale quarenta inspeções, então deixar passar é muito mais caro que inspecionar à toa. O ponto de indiferença fica bem abaixo de 0,5, e chegar nele não é opinião: é a conta da matriz de custo.
>
> A segunda metade do item é a que cruza os capítulos. A métrica de ordenação decide **qual modelo** usar; a matriz de custo decide **onde cortar** o escore desse modelo. São perguntas diferentes, e é por isso que uma mudança de custo no trimestre seguinte não exige treinar nada de novo.
>
> A última alternativa isola a prevalência, que importa para interpretar a métrica e não determina sozinha o corte. Dois problemas com a mesma prevalência e custos diferentes têm limiares diferentes.
:::

:::exercicio {"id":"prova-parte-ii-q2","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/ii-2-modelos-lineares.md:O3","livro/capitulos/ii-4-otimizacao.md:O3"],"dificuldade":"dificil"}
Um modelo linear tem dois atributos quase perfeitamente correlacionados. Sem regularização, os coeficientes trocam de sinal entre reamostragens. Com L1, um dos dois é zerado, e qual deles muda de execução para execução. Com L2, ambos ficam pequenos e estáveis.

Qual leitura é correta?

- [ ] A L1 é sempre preferível, porque um modelo com menos atributos é mais confiável.
- [x] Nenhuma das três situações é defeito de implementação: a colinearidade torna muitas combinações de pesos quase equivalentes, e cada tratamento escolhe uma forma diferente de resolver o empate.
- [ ] A instabilidade indica erro nos dados, e o correto é remover as linhas discrepantes.
- [ ] A L2 elimina a colinearidade, e por isso os coeficientes passam a ser interpretáveis individualmente.

> **gabarito:** nenhuma é defeito; cada tratamento resolve o empate de um jeito
> **porque:** Quando dois atributos carregam quase a mesma informação, várias combinações de pesos produzem quase as mesmas previsões. Sem penalidade, o ajuste escolhe entre elas por detalhes da amostra; a L1 desempata zerando um; a L2 desempata repartindo.
>
> A quarta alternativa é a mais fina e é falsa numa palavra. A L2 estabiliza os coeficientes e **não** os torna interpretáveis separadamente: eles continuam descrevendo dois atributos que se movem juntos, e nenhum dos dois tem efeito isolado no mundo.
>
> A escolha entre L1 e L2 aqui não é de qualidade, é de requisito: modelo enxuto e explicável pede L1, coeficiente estável entre execuções pede L2.
:::

:::exercicio {"id":"prova-parte-ii-q3","tipo":"multipla-multi","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/ii-5-arvores-ensembles.md:O2","livro/capitulos/ii-4-otimizacao.md:O4"],"dificuldade":"media"}
Uma equipe treina um gradient boosting e uma floresta aleatória no mesmo problema. Quais decisões estão corretas? (marque todas que valem)

- [x] Usar early stopping na validação para escolher o número de árvores do boosting.
- [x] Fixar um número grande de árvores na floresta sem medo de piorar o resultado.
- [ ] Usar early stopping também para escolher o número de árvores da floresta.
- [x] Deixar as árvores do boosting rasas e as da floresta profundas.

> **gabarito:** early stopping no boosting · muitas árvores na floresta sem risco · rasas no boosting, profundas na floresta
> **porque:** As três corretas decorrem de bagging e boosting atacarem erros diferentes. Em boosting cada árvore persegue o resíduo, inclusive o ruído, então o número de árvores é hiperparâmetro de regularização e o early stopping é a forma padrão de escolhê-lo. Em bagging cada árvore é mais um termo numa média, e acrescentar termos satura em vez de piorar.
>
> A profundidade segue a mesma lógica invertida: o boosting usa árvores deliberadamente fracas e soma correções, enquanto a floresta usa árvores fortes e instáveis e conta com o cancelamento dos erros.
>
> A alternativa errada aplica ao bagging um instrumento que pressupõe degradação. Sem degradação para detectar, o critério não tem função — é o mesmo tipo de erro do early stopping testado em dados separáveis, onde a ausência de disparo foi confundida com defeito.
:::

:::exercicio {"id":"prova-parte-ii-q4","tipo":"numerica","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/ii-3-regressao-logistica.md:O2","livro/capitulos/ii-1-avaliacao.md:O4"],"dificuldade":"media"}
Um modelo de regressão logística prevê probabilidade 0,25 para um cliente. Qual é a **chance** (*odds*) correspondente? Responda com duas casas decimais.

> **gabarito:** 0.33 ± 0.01
> **porque:** Chance é $p/(1-p) = 0{,}25/0{,}75 = 1/3 \approx \mathbf{0{,}33}$, ou "um para três".
>
> O cruzamento está no que a conta pressupõe. Converter probabilidade em chance só faz sentido se o 0,25 for mesmo uma probabilidade, ou seja, se o modelo estiver **calibrado**. Um escore que ordena bem e não é calibrado passa pela mesma aritmética e produz um número sem significado.
>
> É a distinção entre as três perguntas: ordenar bem, decidir bem e ter escores honestos são propriedades independentes. A regressão logística costuma sair razoavelmente calibrada, e é por isso que ela sobrevive onde a probabilidade vira dinheiro.
:::

:::exercicio {"id":"prova-parte-ii-q5","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/ii-7-series-temporais.md:O2","livro/capitulos/ii-6-analise-multidimensional.md:O4"],"dificuldade":"dificil"}
Uma equipe monta o conjunto de treino a partir do cubo de vendas, com uma linha por cliente e mês, e atributos de janela vindos das medidas agregadas. Depois divide o conjunto cronologicamente, com cuidado, e valida com origem móvel.

Ainda assim o desempenho em produção é muito pior que na validação. Qual é a explicação mais provável?

- [ ] A validação com origem móvel é otimista por construção e precisa ser substituída por um corte único.
- [x] Os atributos de janela foram agregados sobre a base inteira antes da divisão, então cada linha de treino já contém informação posterior ao seu instante.
- [ ] O grão de cliente e mês é fino demais, e agregar por trimestre resolveria.
- [ ] O cubo não deveria ser usado como origem de conjunto de treino.

> **gabarito:** os atributos de janela foram agregados antes da divisão
> **porque:** São dois vazamentos independentes, e a equipe corrigiu só um. A divisão cronológica resolve a ordem das **linhas**; ela não diz nada sobre quando cada **coluna** foi calculada. Uma média agregada sobre a base inteira carrega o futuro para dentro de cada linha, e sobrevive intacta a qualquer protocolo de divisão.
>
> É a travessia do cubo para o modelo na sua forma mais fácil de errar, porque a consulta que produz o atributo é natural e curta, e o sintoma é o de sempre: desempenho excelente e inútil.
>
> A primeira alternativa acusa o instrumento correto. A origem móvel não é otimista; ela é justamente o que dá várias medidas em vez de uma, e um corte único seria menos informativo, não mais seguro.
:::

:::exercicio {"id":"prova-parte-ii-q6","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/ii-1-avaliacao.md:O5","livro/capitulos/ii-8-do-modelo-a-decisao.md:O1"],"dificuldade":"media"}
Dois modelos são comparados no mesmo teste. A diferença de F1 é de 0,004, e o bootstrap pareado devolve um intervalo de 95% de [−0,009; +0,017] para a diferença. Um deles custa três vezes mais para servir. O que fazer?

- [ ] Escolher o de maior F1, porque a estimativa pontual é o melhor palpite disponível.
- [x] Tratar como empate estatístico e decidir pelo custo, que é um critério real e não empatado.
- [ ] Rodar dez mil reamostragens, para estreitar o intervalo e desempatar.
- [ ] Adiar a decisão até coletar mais dados de treino.

> **gabarito:** empate estatístico, e o custo decide
> **porque:** O intervalo cruza o zero, então os dados são compatíveis com qualquer um dos dois sendo melhor. Reportar o de maior F1 como vencedor é apresentar ruído como resultado.
>
> O empate é uma boa notícia disfarçada: ele **libera** a decisão para os critérios de engenharia, e três vezes o custo de servir é uma diferença que não está empatada.
>
> A terceira alternativa é o erro mais comum na prática. Aumentar reamostragens não estreita o intervalo de forma relevante, porque a incerteza vem do tamanho do conjunto de teste, e não do número de reamostragens. Mais dado de **teste** ajudaria; mais dado de treino, que é o que a quarta alternativa propõe, responde a outra pergunta.
:::

:::exercicio {"id":"prova-parte-ii-q7","tipo":"multipla-multi","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/ii-2-modelos-lineares.md:O4","livro/capitulos/ii-5-arvores-ensembles.md:O4"],"dificuldade":"dificil"}
Um hospital precisa de um modelo com 1 200 registros, 60 atributos tabulares, justificativa por escrito em cada recusa de exame, e resposta em menos de 20 ms. Quais afirmações estão corretas? (marque todas que valem)

- [x] Poucos dados por atributo favorecem menos parâmetros, o que aponta para o linear.
- [x] A exigência de justificativa por decisão individual pesa contra ensembles.
- [x] Um boosting bem ajustado provavelmente teria desempenho preditivo melhor neste tipo de dado.
- [ ] Como o boosting tende a prever melhor, ele é a escolha correta aqui.

> **gabarito:** poucos dados por atributo · justificativa individual · boosting provavelmente prevê melhor
> **porque:** As três primeiras podem ser verdadeiras ao mesmo tempo, e é isso que o item cobra. Reconhecer que o boosting provavelmente prevê melhor **não** o torna a escolha, porque desempenho preditivo é um critério entre quatro, e três dos outros apontam para o outro lado.
>
> A alternativa errada é a que confunde "melhor no teste" com "melhor decisão". Latência, auditabilidade e o regime de poucos dados por atributo não aparecem em métrica nenhuma, e ignorá-los é escolher pelo que é fácil de medir.
>
> A decisão defensável aqui é o linear, e ela não é consolo: é engenharia. Um ganho de desempenho teria de ser grande o bastante para pagar três perdas simultâneas.
:::

:::exercicio {"id":"prova-parte-ii-q8","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/ii-6-analise-multidimensional.md:O1","livro/capitulos/ii-1-avaliacao.md:O1"],"dificuldade":"media"}
Um painel executivo mostra "taxa de conversão média das lojas: 4,2%", calculada como a média simples das taxas de cada loja. Uma loja nova, com 12 visitas e 3 conversões, entra na conta com 25%.

Qual é o problema?

- [x] Taxa é medida não aditiva: a razão precisa ser calculada depois da agregação, a partir dos componentes, e não como média de razões.
- [ ] O problema é a loja nova ser um outlier, e removê-la corrige o número.
- [ ] O problema é a métrica escolhida, e a mediana das taxas seria correta.
- [ ] Não há problema: média de taxas é a definição usual de taxa média.

> **gabarito:** taxa é não aditiva, e a razão se calcula depois da agregação
> **porque:** A regra é guardar no fato os **componentes** (visitas e conversões) e calcular a razão no nível pedido. A média das razões dá a cada loja o mesmo peso, então doze visitas influenciam tanto quanto doze mil.
>
> A segunda alternativa trata como outlier o que é comportamento previsível da fórmula errada: com média de razões, **qualquer** loja pequena distorce, e remover uma não impede a próxima.
>
> A terceira troca uma estatística por outra sem corrigir a estrutura. A mediana das taxas continua sendo uma estatística sobre razões, e continua ignorando o tamanho de cada loja.
:::

:::exercicio {"id":"prova-parte-ii-q9","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/ii-4-otimizacao.md:O2","livro/capitulos/ii-3-regressao-logistica.md:O3"],"dificuldade":"dificil"}
Uma equipe troca a perda de uma classificação de entropia cruzada para erro quadrático sobre a saída da sigmoide. O treino roda sem erro, a perda desce, e o resultado final varia de execução para execução com a mesma configuração.

Qual é a explicação?

- [ ] O erro quadrático não é diferenciável na saída da sigmoide, e o gradiente fica indefinido.
- [x] A superfície deixou de ser convexa: surgem mínimos locais, e onde o otimizador para passa a depender da inicialização.
- [ ] A taxa de aprendizado ficou alta demais depois da troca de perda.
- [ ] O problema é o número de épocas, e treinar mais faria as execuções convergirem.

> **gabarito:** a superfície deixou de ser convexa
> **porque:** É exatamente a razão pela qual a logística usa entropia cruzada. Erro quadrático sobre a saída da sigmoide produz uma superfície com mínimos locais, e o otimizador pode parar em qualquer um deles conforme o ponto de partida.
>
> O sintoma do enunciado é a assinatura disso: nada quebra, a perda desce, e o resultado muda entre execuções idênticas. Variação com a mesma configuração é informação sobre a **paisagem**, não sobre a implementação.
>
> A primeira alternativa inverte um fato: o erro quadrático é diferenciável ali. E treinar mais não resolve, porque num mínimo local o gradiente já é nulo — o otimizador não está lento, ele chegou.
:::

:::exercicio {"id":"prova-parte-ii-q10","tipo":"numerica","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/ii-7-series-temporais.md:O3","livro/capitulos/ii-1-avaliacao.md:O1"],"dificuldade":"facil"}
Uma série mensal tem sazonalidade anual forte. Um relatório compara o modelo novo contra a previsão ingênua **simples** e celebra 40% de redução de erro.

Quantas linhas de base diferentes deveriam ter sido reportadas, no mínimo, para a comparação ser honesta?

> **gabarito:** 2
> **porque:** Duas: a ingênua simples e a **ingênua sazonal**. Com sazonalidade forte, a sazonal é a régua correta, e é bem mais difícil de bater.
>
> Comparar só com a simples é escolher o adversário fraco, e o resultado fica desonesto sem má-fé: o número de 40% é verdadeiro e responde a uma pergunta que ninguém deveria ter feito.
>
> É a mesma disciplina que a acurácia exige sob desbalanceamento, aplicada ao tempo. Em ambos os casos a regra é a mesma: a linha de base tem de ser a melhor coisa trivial disponível, não a mais fácil de vencer.
:::

:::exercicio {"id":"prova-parte-ii-q11","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/ii-8-do-modelo-a-decisao.md:O3","livro/capitulos/ii-2-modelos-lineares.md:O3"],"dificuldade":"media"}
Um relatório traz: problema, dados, protocolo, resultado com intervalo de confiança e recomendação de aumentar o preço com base num coeficiente positivo. O protocolo está impecável e o R² é 0,982.

Qual parte do relatório mínimo está faltando, e o que ela teria impedido?

- [ ] O resultado com incerteza, que teria mostrado que o coeficiente não é significativo.
- [x] As limitações, que teriam registrado que o preço nunca variou fora da alta temporada, e portanto o modelo não estima efeito de preço.
- [ ] O protocolo, que deveria ter usado validação cruzada.
- [ ] Nenhuma: com R² de 0,982 e protocolo correto, a recomendação se sustenta.

> **gabarito:** as limitações
> **porque:** Nenhuma das outras partes pegaria o problema, e é isso que torna o caso instrutivo. O protocolo estava correto, o R² é legítimo, e o intervalo de confiança do coeficiente pode ser perfeitamente estreito — o coeficiente é preciso e responde sobre a estação, não sobre o preço.
>
> O que falta é a frase que só cabe em limitações: o preço nunca variou dentro de um mesmo período, então o dado não contém a informação que a recomendação exige.
>
> É a parte que quase todo mundo corta por parecer fraqueza, e a única que teria evitado o erro caro. Vale como regra: um coeficiente só responde sobre o que variou de forma independente nos dados.
:::

:::exercicio {"id":"prova-parte-ii-q12","tipo":"multipla-multi","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/ii-8-do-modelo-a-decisao.md:O4","livro/capitulos/ii-1-avaliacao.md:O5"],"dificuldade":"dificil"}
Um modelo de priorização de atendimento tem AUC de 0,88 ± 0,01 entre as dobras, bate a linha de base com folga e o ganho financeiro estimado paga o custo. Ao segmentar, o desempenho cai para 0,61 no grupo de pacientes que chegam pelo pronto-socorro, que é 18% do volume.

Quais conclusões se sustentam? (marque todas que valem)

- [x] A média de 0,88 esconde um subgrupo relevante com desempenho próximo do acaso.
- [x] Desempenho ruim num subgrupo que importa é motivo suficiente para não lançar, mesmo passando nas métricas.
- [x] Recusar o lançamento exige o mesmo aparato de defendê-lo: números, protocolo e critério explícito.
- [ ] Como o intervalo entre dobras é estreito, o resultado é estável e o subgrupo é ruído amostral.

> **gabarito:** a média esconde o subgrupo · motivo suficiente para não lançar · a recusa exige o mesmo aparato
> **porque:** As três corretas encadeiam medição, critério e processo. Um AUC de 0,61 aplicado a decisões de atendimento significa priorizar perto do sorteio, enquanto a instituição acredita operar um sistema de 0,88.
>
> A alternativa errada usa corretamente um fato e tira a conclusão oposta. Intervalo estreito entre dobras diz que a média é estável, e uma média estável de um número que agrega dois subgrupos muito diferentes continua escondendo os dois. Estabilidade não é homogeneidade.
>
> O terceiro item é o que evita que a recusa vire opinião. "Não vamos lançar" com evidência é trabalho concluído, e é assim que ele precisa chegar à reunião.
:::
