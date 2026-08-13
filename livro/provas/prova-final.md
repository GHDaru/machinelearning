# Prova final — o livro inteiro

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado**. A recomendação do livro a quem dá aula é pontuar **por ter
> feito, nunca por ter acertado**.

## O que esta prova é

Quatorze itens sobre o livro inteiro. As seis provas anteriores cruzam capítulos
**dentro** de uma parte; esta cruza **partes**, e é essa a diferença que ela
existe para cobrar. Cada item liga uma ideia da Abertura, da Parte I ou da
Parte II a uma consequência que só aparece nas Partes III, IV ou V.

A aposta pedagógica é simples de enunciar: quem estudou por capítulo responde
bem às provas de parte e trava aqui, porque o livro não é uma lista de assuntos.
O que ele repete, de capítulo em capítulo, é um punhado pequeno de ideias
usando roupas diferentes — e é isso que estes quatorze itens tentam mostrar.

Nenhum item traz o **"volte para"**, todo cenário é **inédito**, e todos são
corrigidos na hora, sem consultar modelo de linguagem.

:::exercicio {"id":"prova-final-q1","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/0-1-introducao.md:O2","livro/capitulos/ii-8-do-modelo-a-decisao.md:O4"],"dificuldade":"media"}
Uma transportadora quer prever se uma entrega vai atrasar. A regra atual é escrita e cabe em três linhas: atrasa se a distância passa de 400 km, ou se o veículo tem mais de dez anos, ou se o pedido saiu depois das 16h. Ela acerta 91% das vezes. Um modelo treinado com dois anos de histórico acerta 93%.

O que o livro sustenta sobre esse caso?

- [ ] Deve-se adotar o modelo, porque 93% é maior que 91% e a comparação foi feita.
- [x] Deve-se questionar a adoção: a regra é escrevível, os dois pontos percentuais precisam de incerteza declarada e de tradução em consequência, e o modelo traz um sistema inteiro para manter.
- [ ] Deve-se adotar o modelo apenas se ele for interpretável, porque a regra atual é.
- [ ] Não é caso de ML porque existe regra, e problemas com regra conhecida nunca se beneficiam de modelo.

> **gabarito:** questionar a adoção, pelos três motivos somados
> **porque:** O item cruza a pergunta de abertura do livro com a decisão de fechamento da Parte II, e as duas apontam para o mesmo lado.
>
> O primeiro critério de candidatura a ML é a regra que ninguém consegue escrever. Aqui alguém escreveu, em três linhas. Isso não proíbe usar modelo, e muda quem tem o ônus da prova: quem propõe a troca precisa mostrar o ganho, e dois pontos percentuais sem intervalo não são um ganho demonstrado, podem ser ruído do conjunto de teste.
>
> E há a conta que quase nunca entra: adotar o modelo troca três linhas de regra por coleta, extração de atributos, serviço, monitoramento e retreino. A quarta alternativa exagera na direção oposta e por isso está errada: existir regra não impede que um modelo seja melhor, sobretudo quando a regra foi calibrada no olho e nunca revista.
:::

:::exercicio {"id":"prova-final-q2","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/0-2-fundamentos.md:O4","livro/capitulos/ii-8-do-modelo-a-decisao.md:O1"],"dificuldade":"dificil"}
Um time comparou seis configurações de modelo. Para cada uma, treinou, mediu no conjunto de teste, ajustou e mediu de novo, repetindo até a melhor chegar a 0,88 de F1. O relatório apresenta 0,88 como o desempenho esperado em produção.

Qual é o defeito, e qual é a consequência?

- [x] O teste foi usado como conjunto de ajuste; 0,88 é uma estimativa otimista, e o número que ninguém tem é o de um conjunto que não participou de nenhuma decisão.
- [] O defeito é o número de configurações: seis é pouco para uma busca honesta, e o resultado é instável.
- [ ] Não há defeito no método; falta apenas declarar o intervalo de confiança de 0,88.
- [ ] O defeito é usar F1, que não é apropriado para comparar configurações entre si.

> **gabarito:** o teste virou conjunto de ajuste, e 0,88 está otimista
> **porque:** É a razão de o teste precisar ser tocado o mínimo possível, e ela não é cerimônia. Cada olhada seguida de ajuste transfere informação do teste para o modelo. Depois de seis rodadas de "medir e ajustar", o teste virou parte do treino, e o número que ele produz mede o quanto o time otimizou contra aquele recorte.
>
> A terceira alternativa é a mais perigosa das erradas, porque parece rigor: declarar o intervalo de um número enviesado dá precisão a uma estimativa que está deslocada. O intervalo descreve a variação da amostra, e não o viés do procedimento.
>
> A saída é de protocolo, e não de estatística: um conjunto de validação para o ajuste, o teste tocado uma vez, e a comparação final com incerteza declarada. O que fica é a formulação: um número que participou das suas decisões não pode ser a sua estimativa.
:::

:::exercicio {"id":"prova-final-q3","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/i-3-dados.md:O2","livro/capitulos/v-3-mlops.md:O3"],"dificuldade":"media"}
Um modelo de previsão de demanda foi validado com divisão aleatória sobre três anos de histórico e foi muito bem. Em produção, erra sistematicamente. O time investiga e descobre duas coisas: a divisão aleatória misturou semanas futuras no treino, e a base de clientes mudou bastante no último ano.

Qual leitura é correta?

- [x] São dois problemas distintos: a divisão aleatória inflou a validação, e a mudança da base é drift; corrigir a divisão dá um número honesto, e não impede o drift.
- [ ] É o mesmo problema visto de dois ângulos: divisão temporal correta já teria capturado o drift e resolvido os dois.
- [ ] O problema é só a divisão; a mudança da base de clientes é normal e não afeta um modelo bem treinado.
- [ ] O problema é só o drift; a divisão aleatória é aceitável quando há três anos de dados.

> **gabarito:** são dois problemas distintos, e um não conserta o outro
> **porque:** Confundi-los é o erro que este item procura. A divisão aleatória em dado com ordem temporal é vazamento: o modelo treinou vendo o futuro, e a validação mediu uma tarefa que produção não oferece. Corrigir a divisão troca um número inflado por um número honesto, e mais nada.
>
> O drift é outro eixo: a população mudou depois. Nenhuma divisão, por mais correta, protege contra o que acontece depois do fim do histórico, porque a hipótese de mesma distribuição é anterior ao modelo.
>
> A segunda alternativa é a que mais gente marca, e ela quase acerta: a divisão temporal **mede** a degradação ao longo do histórico, o que é informativo, e não impede a próxima mudança. A resposta completa é divisão honesta na validação **mais** monitoramento em produção, que é a Parte I e a Parte V fazendo o mesmo trabalho em tempos diferentes.
:::

:::exercicio {"id":"prova-final-q4","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/i-6-representacao.md:O1","livro/capitulos/iii-1-neuronio-artificial.md:O3"],"dificuldade":"dificil"}
Um neurônio único não separa o XOR. Uma rede com uma camada escondida separa. Mas há um terceiro caminho, menos citado: acrescentar às duas entradas `x1` e `x2` um terceiro atributo, o produto `x1 · x2`, e treinar um neurônio único sobre os três.

O que esse terceiro caminho demonstra?

- [x] Que a limitação era da representação, e não do neurônio: no espaço de três atributos o problema virou linearmente separável, e a camada escondida é uma forma de aprender essa transformação em vez de escrevê-la.
- [ ] Que o neurônio único é tão expressivo quanto a rede, e a camada escondida é desnecessária quando há atributos suficientes.
- [ ] Que o XOR nunca foi um problema real, e a crise histórica da área se apoiou num exemplo mal escolhido.
- [ ] Que atributos construídos à mão são sempre preferíveis a camadas escondidas, por serem interpretáveis.

> **gabarito:** a limitação era da representação
> **porque:** É a tese do capítulo de representação encontrando o exemplo mais famoso da Parte III. O teto não estava no modelo, estava no espaço em que os dados foram descritos. Mudado o espaço, o mesmo modelo resolve.
>
> E é essa a leitura que dá sentido à camada escondida: ela não é um truque para ganhar poder, é um mecanismo para **aprender** a transformação que aqui foi escrita à mão. Quando você sabe qual é a transformação, escrevê-la é mais barato; quando não sabe, e é o caso geral, aprender é a única saída.
>
> A segunda alternativa generaliza demais, porque só funciona quando alguém já conhece o atributo certo. A terceira reescreve a história: a limitação demonstrada era real, e o que faltava era como treinar as camadas. E a quarta troca uma regra por outra, ignorando que o custo do caminho manual é precisar saber a resposta antes.
:::

:::exercicio {"id":"prova-final-q5","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/ii-1-avaliacao.md:O1","livro/capitulos/iv-1-nao-supervisionado.md:O1"],"dificuldade":"media"}
Duas situações. Na primeira, um classificador de fraude acerta 99,7% num problema em que 0,3% das transações são fraude. Na segunda, um agrupamento de clientes devolve cinco grupos com boa separação medida pela silhueta.

O que as duas têm em comum?

- [x] Nas duas, a métrica pode ir bem sem que exista o achado: acurácia alta é o que se obtém dizendo sempre "não é fraude", e silhueta boa se obtém sobre dados sem estrutura nenhuma.
- [ ] Nas duas o problema é o tamanho da amostra, que precisa ser maior para a métrica ser confiável.
- [ ] Nada em comum: a primeira é supervisionada e tem gabarito, a segunda não tem, e os problemas de avaliação são de naturezas distintas.
- [ ] Nas duas, trocar a métrica por outra resolve: F1 na primeira, e índice de Rand na segunda.

> **gabarito:** nas duas a métrica vai bem sem que exista o achado
> **porque:** É a mesma armadilha em duas roupas, e reconhecê-la é metade do que este livro tenta ensinar. O classificador que sempre diz "não" acerta 99,7% e não achou nada. O agrupamento devolve k grupos sobre ruído puro, e a silhueta mede quão compactos ficaram, não se eles existem.
>
> A terceira alternativa é a que separa quem viu o padrão de quem estudou os capítulos isolados: é verdade que uma tem gabarito e a outra não, e é justamente por isso que o remédio é diferente. Na classificação você pode trocar a métrica, porque existe rótulo para comparar. No agrupamento a métrica é interna e não pode discordar de você, então o remédio é externo: comparar com dado embaralhado, checar estabilidade sob reamostragem, ou validar o grupo com alguém que conhece o negócio.
>
> A quarta erra por isso: o índice de Rand exige rótulo verdadeiro, que é exatamente o que não há.
:::

:::exercicio {"id":"prova-final-q6","tipo":"multipla-multi","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/ii-1-avaliacao.md:O4","livro/capitulos/v-1-interpretabilidade-justica.md:O3"],"dificuldade":"dificil"}
Um modelo de concessão de crédito tem AUC de 0,82, igual nos dois grupos protegidos. O time conclui: *"o modelo é igualmente bom para os dois grupos, então é justo."*

Quais críticas a essa conclusão são corretas? Marque todas que valem.

- [x] AUC mede a qualidade do ordenamento e não a da decisão; a decisão depende do limiar, que pode produzir taxas muito diferentes com o mesmo AUC.
- [x] Justiça exige escolher entre critérios formais que são incompatíveis quando as prevalências diferem, e AUC igual não escolhe nenhum deles.
- [x] Calibração é uma terceira propriedade, independente do ordenamento, e dois grupos com o mesmo AUC podem ter calibrações diferentes.
- [ ] A crítica correta é que AUC de 0,82 é baixo demais para decisão de crédito, e o problema desapareceria com um modelo melhor.
- [ ] AUC não deveria ser medida por subgrupo, porque métricas de ordenamento não se decompõem.

> **gabarito:** ordenamento não é decisão; a incompatibilidade continua de pé; calibração é independente
> **porque:** As três corretas são três propriedades distintas que a conclusão do time funde numa só, e é essa fusão que o livro trata em dois capítulos separados de propósito.
>
> A leitura que fica: **AUC igual é uma boa notícia sobre o ordenamento e não é uma afirmação sobre justiça.** O que decide quem recebe crédito é o limiar aplicado sobre a probabilidade, e é ali que os critérios rivais se manifestam.
>
> A quarta alternativa é a saída mágica que aparece em toda discussão de justiça: melhorar o modelo. Ela não funciona, porque a incompatibilidade entre os critérios é aritmética e vale para qualquer modelo, inclusive um perfeito. A quinta inventa uma restrição que não existe: medir por subgrupo é justamente o que o capítulo V.1 recomenda.
:::

:::exercicio {"id":"prova-final-q7","tipo":"numerica","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/ii-1-avaliacao.md:O2","livro/capitulos/ii-8-do-modelo-a-decisao.md:O2"],"dificuldade":"media"}
Um detector de fraude foi aplicado a 10 000 transações. Ele acusou 500, das quais 120 eram fraude de verdade. Havia 150 fraudes no total.

Calcule a **precisão** do detector. Responda como número decimal entre 0 e 1, com duas casas.

> **gabarito:** 0,24 ± 0,01
> **porque:** Precisão é a fração de acertos entre os acusados: 120 dividido por 500, igual a 0,24. A revocação, que é outra coisa, seria 120 dividido por 150, igual a 0,80.
>
> O par de números conta a história que a conta sozinha não conta. O detector encontra 80% das fraudes, o que é bom, e três de cada quatro pessoas que ele acusa não fizeram nada. Se cada acusação vira um bloqueio de cartão, são 380 clientes legítimos incomodados para pegar 120 fraudadores.
>
> Se esse preço vale a pena é decisão de negócio, não de modelagem, e depende do custo de cada erro: quanto custa uma fraude que passa, e quanto custa um cliente bloqueado indevidamente. É por isso que a métrica não se escolhe por hábito, e sim a partir do custo do erro.
:::

:::exercicio {"id":"prova-final-q8","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/ii-5-arvores-ensembles.md:O2","livro/0-2-fundamentos.md:O3"],"dificuldade":"media"}
Um time tem uma árvore profunda que acerta quase tudo no treino e vai mal na validação. Um colega sugere trocar por floresta aleatória; outro sugere boosting com árvores rasas.

Qual leitura, em termos de viés e variância, é correta?

- [x] A árvore profunda tem variância alta, e a floresta ataca exatamente isso ao promediar árvores decorreladas; o boosting ataca viés, partindo de árvores rasas que erram muito e somando correções.
- [ ] As duas sugestões atacam a variância, e a escolha entre elas é só de custo computacional.
- [ ] A árvore profunda tem viés alto, e por isso o boosting é a única sugestão pertinente.
- [ ] Nenhuma das duas ajuda: o problema é de dado, e conjuntos de modelos não corrigem falta de dado.

> **gabarito:** floresta ataca variância; boosting ataca viés
> **porque:** É a decomposição da Abertura aplicada à Parte II, e a distinção não é vocabulário: ela diz qual das duas sugestões responde ao sintoma descrito. Acertar quase tudo no treino e falhar na validação é o retrato da variância alta, então a floresta responde ao problema que o time tem.
>
> Isso não faz o boosting ser a resposta errada em geral. Ele costuma vencer em dado tabular e ataca o outro termo: parte de aprendizes fracos, de viés alto, e soma correções. Só que, aplicado sem cuidado num caso de variância, ele tem tudo para reproduzir o mesmo problema com outra forma.
>
> A terceira alternativa inverte o diagnóstico. A quarta é a resposta derrotista que às vezes está certa, e não aqui: o enunciado descreve a assinatura da variância, e não a de falta de dado, que apareceria como desempenho ruim nos dois lados.
:::

:::exercicio {"id":"prova-final-q9","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iii-3-treinar-redes-profundas.md:O2","livro/capitulos/v-4-fronteira.md:O3"],"dificuldade":"dificil"}
O trabalho que mediu o problema do gradiente que some é de 1991. Ele diagnosticou e não resolveu. De lá para cá, o remédio mudou várias vezes: inicializações melhores, funções de ativação diferentes, normalização, conexões de atalho.

O que isso ensina sobre o que estudar?

- [x] Que o diagnóstico envelhece devagar e o remédio envelhece rápido: quem entendeu por que o gradiente some reconhece o sintoma em arquiteturas que ainda não existem, e quem decorou o remédio da vez fica sem nada quando ele for substituído.
- [ ] Que trabalhos antigos são mais confiáveis, porque sobreviveram ao tempo.
- [ ] Que o problema do gradiente foi resolvido e virou assunto histórico, sem consequência prática hoje.
- [ ] Que estudar remédios é perda de tempo, já que todos serão substituídos.

> **gabarito:** o diagnóstico dura, o remédio expira
> **porque:** É a regularidade da tabela do último capítulo, e este é o exemplo mais limpo dela dentro do livro. O produto de muitos fatores menores que um tende a zero, e isso é uma propriedade da composição, não de uma arquitetura. Enquanto houver rede profunda treinada por gradiente, o sintoma pode voltar.
>
> A segunda alternativa é a falácia da antiguidade: o trabalho de 1991 não vale por ser antigo, vale por ter medido uma restrição estrutural, e é isso que o torna durável.
>
> A quarta é o exagero que o capítulo não sustenta. Remédio é o que faz a rede treinar hoje, e você precisa dele; o que o capítulo pede é que você saiba **qual das duas coisas** tem na cabeça, porque só uma delas continua valendo quando a ferramenta mudar.
:::

:::exercicio {"id":"prova-final-q10","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iv-2-reforco.md:O2","livro/capitulos/v-3-mlops.md:O3"],"dificuldade":"dificil"}
Um sistema de recomendação escolhe, para cada usuário, entre milhares de itens. Ele é retreinado toda semana com os cliques da semana anterior. Depois de alguns meses, a variedade do que ele recomenda caiu muito, e as métricas de clique continuam boas.

Qual diagnóstico combina as duas partes?

- [x] O sistema determina os próprios dados de treino: só aprende sobre o que mostrou, e o retreino realimenta a escolha antiga; o clique não denuncia isso porque mede o que foi mostrado, e não o que teria acontecido.
- [ ] É drift de conceito: os usuários mudaram de gosto, e o modelo ficou preso ao comportamento antigo.
- [ ] Não há problema: métricas boas com menos variedade indicam que o sistema aprendeu as preferências reais e parou de desperdiçar exibições.
- [ ] É um problema de exploração que se resolve aumentando o número de itens recomendados por vez.

> **gabarito:** o sistema fecha o laço sobre os próprios dados, e o clique não vê isso
> **porque:** É o dilema entre explorar e explotar aparecendo onde quase ninguém procura, num sistema que não foi construído como agente de reforço. O modelo age segundo o que conhece, e o que ele conhece são os itens que teve a sorte de mostrar cedo. Cada retreino reforça a escolha, e o espaço vai se estreitando.
>
> O cruzamento com o monitoramento é a segunda metade. A métrica de clique é calculada sobre o que foi exibido, e nunca sobre o que não foi. Ela pode subir enquanto o sistema piora, porque nada nela mede o que ficou de fora.
>
> A segunda alternativa é a errada mais defensável, e é diagnóstico de fora para dentro: culpa o mundo por mudar, quando o enunciado descreve o sistema mudando a si mesmo. A quarta confunde quantidade com exploração: mostrar mais itens da mesma vizinhança não abre o espaço, porque a lista continua vindo do mesmo modelo enviesado.
:::

:::exercicio {"id":"prova-final-q11","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iv-1-nao-supervisionado.md:O2","livro/capitulos/i-6-representacao.md:O3"],"dificuldade":"media"}
Você agrupa clientes com k-means usando dois atributos: renda mensal, em reais, entre 1 000 e 40 000, e número de compras no ano, entre 1 e 30. Sem qualquer pré-processamento.

O que acontece, e por quê?

- [x] Os grupos saem praticamente definidos só pela renda, porque a distância euclidiana é dominada pelo atributo de maior escala.
- [ ] Os grupos saem equilibrados entre os dois atributos, porque o k-means normaliza internamente antes de calcular distâncias.
- [ ] O resultado é imprevisível, porque escalas diferentes tornam o algoritmo instável e ele não converge.
- [ ] Os grupos saem definidos pelo número de compras, porque atributos com menos valores distintos dominam a partição.

> **gabarito:** a renda domina, por ser a de maior escala
> **porque:** É o caso em que a resposta de dois capítulos diferentes é a mesma. O k-means minimiza distância euclidiana, e uma diferença de mil reais contribui muito mais para a distância do que uma diferença de dez compras. O algoritmo agrupa pela renda, e o segundo atributo entra quase como decoração.
>
> Este é também o exemplo que responde à pergunta de quando normalizar. Em modelos baseados em distância ou em gradiente, a escala muda o resultado; em árvores, que decidem por corte em cada atributo separadamente, ela não muda quase nada. Normalizar não é etapa obrigatória de higiene: é decisão que depende do que o modelo faz com os números.
>
> A terceira alternativa confunde dominância com instabilidade. O algoritmo converge normalmente, e é justamente aí que está o perigo: ele devolve um resultado limpo, plausível e enviesado, sem nenhum sinal de erro.
:::

:::exercicio {"id":"prova-final-q12","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/v-2-sistemas-de-ml.md:O2","livro/capitulos/i-3-dados.md:O1"],"dificuldade":"media"}
Um atributo chamado `saldo_medio_conta` é calculado no treino a partir de uma tabela consolidada que já inclui a movimentação do mês inteiro. No serviço, ele é calculado com o que existe até o instante da consulta.

Que dois nomes, de dois capítulos diferentes, descrevem esse mesmo defeito?

- [x] Vazamento, no treino, e divergência entre treino e serviço, na produção — o segundo é o primeiro reaparecendo com outro nome.
- [ ] Drift de covariáveis e dívida de configuração.
- [ ] Desbalanceamento de classes e dívida de código de cola.
- [ ] Viés de seleção e cascata de correções.

> **gabarito:** vazamento e divergência entre treino e serviço
> **porque:** É o mesmo defeito visto em dois momentos do livro, e reconhecer isso é o objetivo do item. No treino, o atributo carrega informação que não existia no instante da predição, e isso é vazamento: o modelo aprendeu com uma vantagem que produção não oferece.
>
> Em produção, o mesmo atributo é calculado de outro jeito, e o modelo recebe uma entrada com distribuição diferente da que viu. É a divergência entre treino e serviço, e a receita é a mesma da Parte V: reutilizar o código entre os dois caminhos, para que a diferença deixe de ser possível em vez de improvável.
>
> As três erradas listam pares de dívidas reais que não descrevem este caso, e servem para separar quem reconhece o mecanismo de quem reconhece o vocabulário.
:::

:::exercicio {"id":"prova-final-q13","tipo":"completar","objetivo":"O3","secao":"prova","objetivos":["livro/0-2-fundamentos.md:O1","livro/capitulos/v-3-mlops.md:O3"],"dificuldade":"facil"}
Complete a hipótese que a Abertura coloca na fundação do livro e que o capítulo de operação mostra sendo quebrada pelo tempo. Ela diz que treino e produção vêm da mesma:

`hipótese de mesma ______`

> **gabarito:** distribuição|distribuicao
> **porque:** É a hipótese que sustenta a ideia de generalizar: se o que virá se parece com o que se viu, o que funcionou tende a continuar funcionando.
>
> O que o capítulo de operação acrescenta é que ela **não é uma propriedade do modelo**, e sim uma aposta sobre o mundo. Drift é o nome do dia em que a aposta deixa de valer, e nada dentro do modelo protege contra isso, porque a hipótese é anterior a ele. É também por isso que a verificação não pode ser feita antes do deploy: ela é uma afirmação sobre dados que ainda não existem.
:::

:::exercicio {"id":"prova-final-q14","tipo":"multipla-multi","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/v-4-fronteira.md:O2","livro/capitulos/ii-8-do-modelo-a-decisao.md:O3"],"dificuldade":"dificil"}
Você vai apresentar a diretores um resultado real: o novo modelo de retenção reduziu o cancelamento de 4,2% para 3,8% num teste com metade da base, ao longo de seis semanas.

Quais condutas o livro sustenta para essa apresentação? Marque todas que valem.

- [x] Declarar a incerteza dos 0,4 ponto, porque um número sem intervalo não permite saber se a diferença sobreviveria a outra amostra.
- [x] Traduzir a diferença em consequência de negócio, dizendo quantos clientes e quanto dinheiro ela representa no período.
- [x] Dizer o que o teste não mediu, como o efeito além das seis semanas e a possibilidade de o ganho ser antecipação de cancelamentos futuros.
- [ ] Omitir a incerteza para não abalar a confiança da diretoria na equipe, já que o resultado é positivo.
- [ ] Apresentar a redução como 10% de queda relativa, sem mencionar a diferença absoluta, por ser mais compreensível.

> **gabarito:** incerteza declarada; tradução em consequência; o que o teste não mediu
> **porque:** As três corretas são o mesmo compromisso em três formas: rigor sem jargão. Público não técnico não precisa de menos verdade, precisa da mesma verdade em outra linguagem.
>
> A quinta alternativa é a mais instrutiva das erradas, porque não é mentira: de 4,2% para 3,8% é mesmo uma queda relativa de cerca de 10%. Apresentar só o relativo infla a percepção do efeito, e a prática recomendada é dar os dois, porque cada um esconde o que o outro mostra.
>
> A quarta é a que o livro recusa sem meio-termo. Omitir incerteza para proteger a confiança da equipe é o caminho mais curto para perdê-la, porque a diretoria vai decidir com base num número que você sabia ser mais frágil do que parecia — e o dia em que a fragilidade aparecer será o dia em que alguém perguntará o que você sabia e quando.
:::
