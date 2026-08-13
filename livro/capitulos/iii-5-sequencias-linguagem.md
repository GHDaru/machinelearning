# III.5 — Sequências e Linguagem

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar por que dados sequenciais quebram a premissa de independência.
- **O2.** Descrever a limitação de memória das redes recorrentes.
- **O3.** Explicar o mecanismo de atenção como consulta ponderada por relevância.
- **O4.** Justificar por que a arquitetura Transformer substituiu a recorrência na prática.

## O problema: a ordem é informação — e a memória se dissolve

"O cachorro mordeu o homem" e "o homem mordeu o cachorro" têm exatamente os mesmos atributos. Contadas as palavras, as duas frases são idênticas. Significam coisas opostas.

Isso quebra a premissa que sustentava todos os modelos até aqui: a de que cada exemplo é uma linha independente numa tabela, e que a ordem das colunas não carrega informação. Em texto, áudio e série temporal, **a ordem é o dado**. O exemplo não é a palavra: é a palavra *no lugar onde ela está*, condicionada a tudo que veio antes.

O segundo problema aparece assim que você tenta resolver o primeiro. Suponha uma rede que lê a frase palavra por palavra e vai atualizando um resumo interno do que já leu. Agora dê a ela esta frase: *"A conta que a auditoria contratada pelo conselho no ano passado revisou está **errada**."* Para concordar "conta" com "errada", a rede precisa lembrar de uma palavra vista onze posições atrás. Ela não lembra. E o motivo não é falta de capacidade — é o diagnóstico do [capítulo III.3](iii-3-treinar-redes-profundas.md), o gradiente que morre ao atravessar muitas camadas, aparecendo aqui numa dimensão diferente.

**É o mesmo problema, na dimensão tempo.** Cada passo da sequência é uma camada a mais no caminho de volta do erro.

:::exercicio {"id":"sequencias-linguagem-e5","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
"O cachorro mordeu o homem" e "o homem mordeu o cachorro" produzem exatamente a mesma contagem de palavras. O que isso demonstra?

- [x] Que a ordem carrega informação que uma representação por contagem descarta.
- [ ] Que a contagem de palavras é uma representação inválida para qualquer tarefa de texto.
- [ ] Que as duas frases têm o mesmo significado, e o contexto é que decide.
- [ ] Que é preciso um vocabulário maior para distinguir as duas.

> **gabarito:** a ordem carrega informação que a contagem descarta
> **porque:** As duas frases têm os mesmos atributos e significam coisas opostas. Isso quebra a premissa que sustentava tudo até aqui: cada exemplo é uma linha independente, e a ordem das colunas não informa.
>
> A segunda alternativa exagera para uma proibição. Contagem de palavras é representação perfeitamente útil onde a ordem não decide, como classificar um documento por assunto. O que ela não serve é para tarefas em que a ordem **é** o dado.
>
> A quarta trata como problema de vocabulário o que é de representação: as duas frases usam exatamente as mesmas palavras, e nenhum vocabulário maior as distingue.
> **volte para:** #o-problema-a-ordem-e-informacao-e-a-memoria-se-dissolve
:::

:::exercicio {"id":"sequencias-linguagem-e6","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
O capítulo diz que o problema da memória em sequências é "o mesmo problema, na dimensão tempo". Do que ele é o mesmo?

- [ ] Do overfitting, que aparece quando a sequência é longa demais para os dados.
- [x] Do gradiente que morre ao atravessar muitas camadas: cada passo da sequência é uma camada a mais no caminho de volta do erro.
- [ ] Do desbalanceamento de classes, que aparece quando certas palavras são raras.
- [ ] Da colinearidade entre atributos, porque palavras vizinhas se correlacionam.

> **gabarito:** do gradiente que morre atravessando camadas
> **porque:** É o diagnóstico do [capítulo III.3](iii-3-treinar-redes-profundas.md) reaparecendo noutra dimensão. Numa rede profunda o erro atravessa camadas; numa recorrente, atravessa passos de tempo. Nos dois casos o gradiente é um **produto**, e produtos de fatores menores que 1 encolhem exponencialmente.
>
> A leitura útil é que os remédios também se transferem. A LSTM aparece na tabela do kit de conserto do III.3 pelo mesmo motivo das conexões residuais: ela cria um caminho por onde o erro passa somado em vez de multiplicado.
>
> As três alternativas erradas nomeiam problemas reais de outra natureza, e nenhum deles produz o sintoma descrito, que é a rede aprender dependências curtas e nunca as longas.
> **volte para:** #o-problema-a-ordem-e-informacao-e-a-memoria-se-dissolve
:::

## De onde isto veio

**O aperto.** Uma rede recorrente precisa lembrar de algo visto muitos passos atrás, e o gradiente morre no caminho até lá. O erro é multiplicado por um fator a cada passo que retrocede; multiplicações repetidas produzem uma exponencial, e exponencial só faz duas coisas — explode ou some. Some, na maioria das vezes.

**O que se fazia antes.** Janela fixa: olhar as *n* palavras anteriores e mais nada (os n-gramas), ou uma rede recorrente que, na prática, só enxergava o passado recente. Nos dois casos a memória tinha um teto, e o teto era baixo.

**A virada.** Se o erro morre por ser multiplicado a cada passo, então construa um caminho por onde ele **não seja multiplicado**. É isso que a *Long Short-Term Memory* (LSTM) faz, apresentada em 1997: um canal de refluxo constante do erro, guarnecido por **comportas** que decidem o que escrever, o que apagar e o que ler. As comportas são a parte visível; o canal é a parte que resolve.

**A ideia reaproveitável.** *A solução veio do formato da falha, não da tarefa.* Ninguém desenhou a LSTM pensando em linguagem: desenhou-se contra uma exponencial. O nome da tarefa é acidente; o formato do defeito é o que orienta a arquitetura. E há prova documental do que se estava perseguindo: o capítulo 4 da tese de Sepp Hochreiter, de 1991, já se chamava *"Konstanter Fehlerrückfluß"*, refluxo constante do erro. **Seis anos** entre nomear o problema e conseguir comportá-lo. Se você guardar uma frase deste capítulo, guarde esta: **um defeito bem nomeado é meio método**.

**O nome.** *Long Short-Term Memory* é memória de **curto prazo que dura muito** — não uma terceira espécie de memória. O oximoro é o argumento inteiro: a rede continua tendo apenas memória de trabalho; o que mudou é quanto tempo ela sobrevive.

**O segundo aperto: traduzir.** Em 2014, Sutskever, Vinyals e Le publicam o *sequence to sequence* (seq2seq): uma rede codificadora lê a frase de origem inteira e a comprime num vetor; uma rede decodificadora lê esse vetor e produz a frase de destino. Funciona, e o resultado que os autores destacam é o de tradução: *"Our main result is that on an English to French translation task from the WMT'14 dataset, the translations produced by the LSTM achieve a BLEU score of 34.8."*

O que interessa a este capítulo vem no fim do resumo, apresentado como achado adicional e não como a tese: *"Finally, we found that reversing the order of the words in all source sentences (but not target sentences) improved the LSTM's performance markedly, because doing so introduced many short term dependencies between the source and the target sentence which made the optimization problem easier."*

**Inverter a ordem das palavras da frase de origem.** É um truque que hoje soa constrangedor, e a explicação dos autores é exatamente o assunto do capítulo anterior: invertida, a primeira palavra da entrada fica perto da primeira palavra da saída, e o gradiente tem menos passos a atravessar.

É restrição virando forma, como em tantos outros capítulos — só que desta vez a forma é **gambiarra confessa**. E gambiarra confessa é um sintoma valioso: quando o truque que mais ajuda é encurtar a distância, a distância é o problema.

**A virada, segunda parte.** Ainda em 2014, Bahdanau, Cho e Bengio nomeiam esse problema com todas as letras, e este é o detalhe mais bonito da história: **o resumo do artigo não contém a palavra "attention"**. O diagnóstico declarado é que *"the use of a fixed-length vector is a bottleneck"*, e a proposta é deixar o modelo *"(soft-)search for parts of a source sentence that are relevant"*. No artigo, o modelo se chama **RNNsearch** e o vocabulário é o de alinhamento, não o de atenção. O nome que pegou teria vindo de Bengio, em revisão — atribuição corrente, não confirmada.

**A terceira virada, e o que ela de fato removeu.** Em 2017, Vaswani e colegas propõem uma arquitetura *"based solely on attention mechanisms, **dispensing with recurrence and convolutions entirely**"*. O motivo declarado é operacional, não representacional: ser *"more parallelizable and requiring significantly less time to train"* — com 41,8 BLEU obtidos em *"3.5 days on eight GPUs"*.

📖 **A leitura que fecha.** O que "Attention Is All You Need" eliminou foi a **recorrência**, não a convolução e muito menos a atenção. A atenção já existia desde 2014, mas como acessório de uma rede recorrente; 2017 remove o hospedeiro e mantém o acessório. E o ganho anunciado não é de expressividade: é de **paralelismo**. A recorrência obriga a processar um passo por vez, porque o passo *t* depende do resultado do passo *t−1*; a GPU quer todos os passos ao mesmo tempo. É restrição material gerando forma nova outra vez — a mesma mecânica da AlexNet no [capítulo III.4](iii-4-visao.md) e do Playfair no [capítulo I.5](i-5-visualizacao-storytelling.md).

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | O gradiente que some ao longo dos passos é o mesmo diagnóstico do [capítulo III.3](iii-3-treinar-redes-profundas.md), aplicado à dimensão tempo |
| ✓ | O capítulo 4 da tese de Hochreiter (**1991**) intitula-se *"Konstanter Fehlerrückfluß"* — o problema estava nomeado seis anos antes da LSTM |
| ✓ᵃ | Bahdanau, Cho & Bengio, *Neural Machine Translation by Jointly Learning to Align and Translate*, [arXiv:1409.0473](https://arxiv.org/abs/1409.0473), 01/09/2014 — o resumo **não contém** a palavra "attention"; fala em *fixed-length vector* como gargalo, em *(soft-)search* e no modelo **RNNsearch** |
| ✓ᵃ | Vaswani et al., *Attention Is All You Need*, [arXiv:1706.03762](https://arxiv.org/abs/1706.03762), 12/06/2017 — *"dispensing with recurrence and convolutions entirely"*, *"more parallelizable"*, 41,8 BLEU em *"3.5 days on eight GPUs"* |
| ⏳ | A LSTM (1997) como resposta direta ao refluxo constante do erro; a janela fixa (n-gramas) e a RNN de memória curta como o que se fazia antes; o oximoro do nome |
| ✓ᵃ | Sutskever, Vinyals & Le, *Sequence to Sequence Learning with Neural Networks*, [arXiv:1409.3215](https://arxiv.org/abs/1409.3215), 10/09/2014 — os dois trechos citados entre aspas, do resumo lido no original |
| ❌ | **Correção de 2026-08-13.** Este capítulo dizia que a inversão da ordem das palavras era apontada pelos autores "como uma das contribuições técnicas principais". O resumo diz o contrário sobre a hierarquia: *"Our main result is…"* introduz o resultado de tradução, e a inversão entra com *"Finally, we found that…"*, como achado adicional. O capítulo promovia a hierarquia que a fonte subordina |
| ⏳ | A atribuição do nome "attention" a Bengio — relato de terceiros, não confirmado em primária |
| 📖 | *A solução veio do formato da falha, não da tarefa* — e o corolário: um defeito bem nomeado é meio método |
| 📖 | A leitura de que 2017 removeu a **recorrência**, não a atenção, e de que o ganho é de paralelismo, não de representação |

> **Legenda adicional:** **✓ᵃ** = o **resumo** do artigo foi lido literalmente e sustenta a citação; o corpo do artigo não foi lido nesta edição. É mais forte que ✓ᵐ (só metadados) e mais fraco que ✓ (fonte lida).

## Fundamentos: a recorrência, o estado oculto e o gradiente que some no tempo

Uma **rede neural recorrente** (*Recurrent Neural Network*, RNN) tem uma ideia só: processe um elemento por vez e carregue um **estado oculto** — um vetor que funciona como resumo do que já foi lido. A cada passo, a rede recebe *o elemento atual* e *o estado anterior*, e produz *um novo estado*. Os pesos são os mesmos em todos os passos: é uma função aplicada repetidamente, não uma rede por posição.

O estado oculto é a memória, e é aí que está tanto a virtude quanto o defeito. A virtude: a rede aceita sequências de qualquer comprimento sem mudar de tamanho. O defeito: **tudo o que ela sabe do passado tem de caber naquele vetor**, e cada passo novo sobrescreve um pouco do que havia.

Para treinar, o erro precisa voltar por todos os passos até a informação que causou o problema. Cada passo aplica um fator; retroceder *k* passos multiplica *k* fatores. Fatores menores que 1 encolhem exponencialmente — em vinte passos, o sinal já é ruído numérico. Na prática, isso significa que a rede **aprende as dependências curtas e nunca chega a aprender as longas**: não é que ela erre a concordância distante, é que ela nunca recebe sinal suficiente para tentar.

### Comportas: o que a LSTM e a GRU acrescentam

A LSTM parte de um estado que atravessa os passos **sendo somado, não multiplicado** — é o caminho por onde o erro reflui sem encolher. Em volta dele há três decisões, todas aprendidas e todas contínuas (não são chaves liga-desliga, são torneiras):

- **Esquecer** — quanto do estado antigo mantenho?
- **Escrever** — quanto do que acabei de ver entra no estado?
- **Ler** — quanto do estado eu exponho como saída deste passo?

A **GRU** (*Gated Recurrent Unit*) é a mesma ideia com menos peças: funde esquecer e escrever numa comporta só e dispensa a separação entre estado interno e saída. Menos parâmetros, treino mais rápido, comportamento parecido na maioria das tarefas. A escolha entre as duas quase nunca é o que decide um projeto — o que decide é se você precisa de recorrência.

:::exercicio {"id":"sequencias-linguagem-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Uma RNN simples é treinada para classificar avaliações de produto e vai bem em textos curtos, mas erra sistematicamente quando a negação aparece no começo de um parágrafo longo ("Não recomendo… *[80 palavras]* …o acabamento é bonito"). Qual é o diagnóstico correto?

- [ ] A rede tem poucos parâmetros; basta aumentar o tamanho do estado oculto.
- [x] O gradiente encolhe exponencialmente ao retroceder muitos passos, então a rede nunca recebe sinal para aprender a dependência longa.
- [ ] A rede está em *overfitting* nos textos curtos e precisa de mais regularização.
- [ ] Textos longos violam a premissa de independência; textos curtos não.

> **gabarito:** O gradiente encolhe exponencialmente com a distância em passos
> **porque:** Retroceder *k* passos multiplica *k* fatores. Com fatores abaixo de 1, o produto tende a zero rápido — e um gradiente que chega em zero não é um gradiente pequeno, é ausência de instrução. A rede **não aprende** aquela dependência; não é que a aprenda mal.
>
> Sobre as erradas: **aumentar o estado oculto** dá mais espaço de memória, mas o problema não é espaço, é o caminho do erro até lá — mais capacidade sem caminho não vira aprendizado. **Regularização** ataca variância, e aqui o modelo não está decorando os curtos: está cego para os longos. E a **premissa de independência** é violada em *qualquer* comprimento — ela é o que define o problema sequencial, não um efeito do tamanho do texto.
>
> A correção histórica foi arquitetural: um caminho em que o estado é somado em vez de multiplicado (LSTM/GRU) e, depois, o acesso direto de qualquer posição a qualquer posição (atenção).
> **volte para:** #fundamentos-a-recorrencia-o-estado-oculto-e-o-gradiente-que-some-no-tempo
:::

:::exercicio {"id":"sequencias-linguagem-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Onde fica, numa RNN, tudo o que ela sabe do passado?

- [x] No estado oculto, um vetor de tamanho fixo que cada passo novo sobrescreve um pouco.
- [ ] Nos pesos, que são diferentes em cada passo de tempo.
- [ ] Na sequência de entrada, que a rede reprocessa a cada passo.
- [ ] Num buffer que cresce conforme a sequência fica mais longa.

> **gabarito:** no estado oculto, de tamanho fixo
> **porque:** A virtude e o defeito estão no mesmo lugar. Como o estado tem tamanho fixo, a rede aceita sequências de qualquer comprimento sem mudar de tamanho — e, pelo mesmo motivo, tudo o que ela sabe precisa caber ali, e cada passo sobrescreve um pouco do que havia.
>
> A segunda alternativa inverte um ponto que define a recorrência: os pesos são **os mesmos** em todos os passos. É uma função aplicada repetidamente, e não uma rede por posição.
>
> A quarta descreve algo próximo do que a atenção faz depois — guardar um vetor por posição, sem comprimir. É justamente o que a RNN **não** faz, e a diferença entre as duas coisas é o assunto das seções seguintes.
> **volte para:** #fundamentos-a-recorrencia-o-estado-oculto-e-o-gradiente-que-some-no-tempo
:::

:::exercicio {"id":"sequencias-linguagem-e8","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
As comportas da LSTM são descritas como "torneiras, não chaves liga-desliga". Por que a distinção importa?

- [ ] Porque torneiras são mais rápidas de calcular que chaves binárias.
- [x] Porque valores contínuos são deriváveis, e é isso que permite aprender as comportas junto com o resto da rede.
- [ ] Porque chaves binárias exigiriam mais parâmetros que valores contínuos.
- [ ] Porque a distinção é apenas didática, e na implementação as comportas são binárias.

> **gabarito:** valores contínuos são deriváveis
> **porque:** Uma chave liga-desliga é uma função-degrau, e o [capítulo III.2](iii-2-redes-neurais.md) já estabeleceu o que isso significa: derivada zero onde existe, inexistente onde importa. Comportas binárias não teriam como ser treinadas por gradiente.
>
> Sendo contínuas, elas são aprendidas junto com todo o resto, e a rede descobre **quanto** esquecer e **quanto** escrever em cada situação, em vez de receber uma regra fixa.
>
> É a mesma razão que torna a atenção treinável mais adiante: ela é uma busca **suave**, em que nada é escolhido e tudo é misturado em proporção à relevância. Escolha dura não deriva; mistura ponderada, sim.
> **volte para:** #comportas-o-que-a-lstm-e-a-gru-acrescentam
:::

## Do gargalo à atenção: seq2seq e o vetor de tamanho fixo

O seq2seq colocou o problema num formato limpo: **codificador** lê a entrada e produz um vetor; **decodificador** lê o vetor e produz a saída. Isso permitiu, pela primeira vez, mapear uma sequência de tamanho *n* numa sequência de tamanho *m* sem alinhamento manual.

E expôs um gargalo com nome próprio. Frase de 5 palavras e frase de 50 palavras produzem **o mesmo vetor de tamanho fixo**. Traduzir passa a ser um exercício de compressão com taxa infinita: tudo o que a origem diz precisa caber num vetor que não cresce. Quanto mais longa a frase, pior a tradução — e o remédio dos autores (inverter a origem) trata a distância, não a compressão.

A **atenção** troca a compressão por acesso. Em vez de exigir um resumo único, o codificador guarda um vetor por posição da entrada e, a cada palavra que vai gerar, o decodificador pergunta: *de quais posições da origem eu preciso agora?* A resposta é um conjunto de pesos que somam 1, com quase toda a massa em duas ou três posições e quase nada no resto, e a entrada usada naquele passo é a **média ponderada** por esses pesos.

Três palavras descrevem o mecanismo, e valem para tudo o que vem depois: a consulta (o que estou procurando agora), as chaves (o que cada posição oferece) e os valores (o que cada posição entrega quando é escolhida). Compare consulta com todas as chaves, transforme as semelhanças em pesos, some os valores ponderados. É uma busca **suave**: nada é escolhido, tudo é misturado em proporção à relevância — e é justamente por ser suave que ela é derivável, e portanto treinável junto com o resto.

Repare no que foi ganho de graça: o caminho entre a posição 1 da entrada e a posição 50 da saída deixou de ter 50 passos. Tem **um**.

:::exercicio {"id":"sequencias-linguagem-e9","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Quais são as três peças do mecanismo de atenção?

- [ ] Entrada, estado oculto e saída.
- [x] Consulta (o que procuro agora), chaves (o que cada posição oferece) e valores (o que cada posição entrega quando é escolhida).
- [ ] Codificador, decodificador e vetor de contexto.
- [ ] Esquecer, escrever e ler.

> **gabarito:** consulta, chaves e valores
> **porque:** O procedimento é: compare a consulta com todas as chaves, transforme as semelhanças em pesos que somam 1, e some os valores ponderados por esses pesos.
>
> A quarta alternativa lista as comportas da LSTM, e o contraste vale: lá as três decisões governam **um resumo**; aqui as três peças governam **um acesso**. Uma esquece por construção, a outra não esqueceu nada e escolhe o que usar.
>
> A terceira nomeia as peças do seq2seq, que é o arranjo onde o gargalo aparece — e é exatamente o gargalo que a atenção remove.
> **volte para:** #do-gargalo-a-atencao-seq2seq-e-o-vetor-de-tamanho-fixo
:::

:::exercicio {"id":"sequencias-linguagem-e10","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Por que a atenção precisa ser uma busca **suave**, com pesos que somam 1, em vez de escolher a posição mais relevante?

- [ ] Porque escolher uma posição só descartaria informação útil das demais.
- [x] Porque escolha dura não é derivável, e sem derivada o mecanismo não poderia ser treinado junto com o resto da rede.
- [ ] Porque a soma dos pesos precisa dar 1 para que a saída seja uma probabilidade.
- [ ] Porque o hardware calcula médias mais rápido que seleções.

> **gabarito:** escolha dura não é derivável
> **porque:** Selecionar a posição de maior semelhança é uma operação em degrau: uma variação pequena na consulta não muda nada até que, de repente, muda tudo. Sem gradiente, não há como aprender **o que** consultar.
>
> A primeira alternativa diz algo verdadeiro e não é a razão. Descartar informação seria uma desvantagem de qualidade; o impedimento aqui é anterior, e é de treinabilidade.
>
> Repare que na prática os pesos ficam concentrados: quase toda a massa em duas ou três posições e quase nada no resto. A busca é suave por construção e **quase** dura por comportamento — e é essa combinação que a torna útil e treinável ao mesmo tempo.
> **volte para:** #do-gargalo-a-atencao-seq2seq-e-o-vetor-de-tamanho-fixo
:::

## O Transformer: remover o hospedeiro

Se a atenção já dá acesso direto a qualquer posição, para que serve a recorrência? A resposta de 2017 foi: para nada — e ela custa caro.

A **autoatenção** (*self-attention*) aplica o mesmo mecanismo dentro de uma única sequência: cada posição consulta todas as outras posições da mesma frase, inclusive a si mesma. É assim que "errada" encontra "conta" onze palavras atrás sem atravessar onze passos.

Três peças completam a arquitetura:

- **Cabeças múltiplas** (*multi-head*). Vários mecanismos de atenção em paralelo, cada um com sua própria projeção de consultas, chaves e valores. Uma média ponderada só produz uma mistura; várias cabeças permitem que uma posição atenda simultaneamente a relações diferentes (concordância numa cabeça, referência do pronome noutra) sem que uma apague a outra.
- **Codificação posicional**. Aqui está a conta a pagar: sem recorrência, **nada no modelo sabe a ordem**. A autoatenção enxerga um conjunto, não uma sequência — troque as palavras de lugar e ela devolve os mesmos resultados, permutados. Como a ordem *é* o problema do capítulo, a posição precisa ser reinjetada explicitamente, somada à representação de cada elemento. A recorrência codificava a ordem de graça, no próprio formato; o Transformer paga por ela.
- **Paralelismo**. A recorrência é sequencial por definição: o passo *t* espera o *t−1*. A autoatenção calcula todas as comparações de uma vez, como uma multiplicação de matrizes — exatamente a operação em que a GPU é boa. Não é que o Transformer aprenda o que a LSTM não aprendia: é que ele **cabe no hardware**, e por isso pôde ser treinado em dados e tamanhos que a recorrência nunca alcançaria. É a mesma lição do [capítulo III.4](iii-4-visao.md): a restrição material escolhe a arquitetura vencedora.

**E o preço.** Se cada posição compara-se com todas, o número de comparações cresce com o **quadrado** do comprimento da sequência. Dobrar o texto quadruplica o custo da atenção. Esse é o limite estrutural que organiza boa parte da pesquisa desde então — e a razão de "janela de contexto" ser uma métrica comercial no [capítulo III.6](iii-6-modelos-de-fundacao.md), e não um detalhe técnico.

:::exercicio {"id":"sequencias-linguagem-e2","tipo":"numerica","objetivo":"O4","dificuldade":"facil"}
Numa camada de autoatenção, cada posição da sequência é comparada com todas as posições. Se o comprimento da sequência passa de **512** para **4096** elementos, por qual fator o número de comparações da atenção é multiplicado?

Responda com um número inteiro.

> **gabarito:** 64 ± 0
> **porque:** O número de comparações é o comprimento ao quadrado. A sequência ficou 8 vezes maior (4096 ÷ 512 = 8), e 8² = **64**. Não é o custo que fica 8 vezes maior — é 64.
>
> É por isso que "aumentamos a janela de contexto de 8 mil para 128 mil" nunca é uma mudança barata: o fator de comprimento é 16, e o de comparações, 256. Também é por isso que o comprimento máximo aparece como característica de produto, com preço. A atenção comprou **caminho curto** (uma posição alcança qualquer outra em um passo) e pagou em **custo quadrático** — a recorrência fazia o negócio inverso: custo linear no comprimento, caminho longo demais para o gradiente sobreviver.
> **volte para:** #o-transformer-remover-o-hospedeiro
:::

:::exercicio {"id":"sequencias-linguagem-e11","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Qual foi o motivo **declarado** no artigo de 2017 para remover a recorrência?

- [ ] Que a atenção representa dependências que a recorrência não conseguia representar.
- [x] Paralelismo e tempo de treino: a autoatenção calcula todas as comparações de uma vez, e a recorrência é sequencial por definição.
- [ ] Que a recorrência exigia mais parâmetros para o mesmo desempenho.
- [ ] Que a codificação posicional é mais precisa que a ordem implícita da recorrência.

> **gabarito:** paralelismo e tempo de treino
> **porque:** O argumento foi **operacional**, e não representacional. A recorrência espera o passo anterior; a autoatenção é uma multiplicação de matrizes, que é exatamente a operação em que a GPU é boa.
>
> A primeira alternativa é a leitura comum e errada. Não é que o Transformer aprenda o que a LSTM não aprendia: é que ele **cabe no hardware**, e por isso pôde ser treinado em dados e tamanhos que a recorrência nunca alcançaria.
>
> A quarta inverte um custo em virtude. A codificação posicional é a **conta a pagar** por remover a recorrência: sem ela, nada no modelo saberia a ordem, porque a autoatenção enxerga um conjunto. A recorrência codificava a ordem de graça, no próprio formato.
>
> É a mesma lição do [capítulo III.4](iii-4-visao.md), onde o diagrama mais reproduzido da visão é um limite de 3 GB desenhado: a restrição material escolhe a arquitetura vencedora.
> **volte para:** #o-transformer-remover-o-hospedeiro
:::

:::exercicio {"id":"sequencias-linguagem-e12","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
O que o Transformer **ganhou** e o que **pagou** ao trocar recorrência por autoatenção? (marque todas que valem)

- [x] Ganhou caminho de um passo entre quaisquer duas posições.
- [x] Ganhou paralelismo, porque as comparações não dependem umas das outras.
- [x] Pagou custo quadrático no comprimento da sequência.
- [x] Pagou a necessidade de reinjetar a ordem por codificação posicional.
- [ ] Ganhou custo linear no comprimento, que a recorrência não tinha.

> **gabarito:** caminho de um passo · paralelismo · custo quadrático · ordem reinjetada
> **porque:** As quatro corretas são o negócio inteiro, e vê-lo como negócio é o ponto. A recorrência tinha custo **linear** no comprimento e caminho longo demais para o gradiente sobreviver; a atenção inverte exatamente os dois termos.
>
> A alternativa errada atribui ao Transformer justamente a propriedade que ele abriu mão de ter. Custo linear era da recorrência.
>
> A consequência prática dessa troca organiza boa parte da pesquisa desde então, e explica por que "janela de contexto" é métrica comercial no [capítulo III.6](iii-6-modelos-de-fundacao.md): dobrar o texto quadruplica o custo da atenção.
> **volte para:** #o-transformer-remover-o-hospedeiro
:::

## Tokenização: o texto vira número antes de qualquer coisa

Nada disso opera sobre letras. Antes de qualquer arquitetura, o texto é cortado em **tokens** (pedaços do tamanho de uma palavra curta, um prefixo, um sufixo) e cada token vira um índice, que vira um vetor (o *embedding* do [capítulo I.6](i-6-representacao.md), onde a hipótese distribucional de Harris, de 1954, já dizia que o significado de uma palavra está na companhia que ela mantém).

A escolha do corte é uma decisão de representação com consequências que ninguém revisita depois. Cortar em palavras inteiras produz vocabulário gigante e nenhuma resposta para a palavra nunca vista. Cortar em caracteres resolve isso e alonga a sequência — e comprimento, na seção anterior, tem preço quadrático. Os esquemas de **subpalavra** ficam no meio: palavras comuns viram um token só, palavras raras se decompõem em pedaços conhecidos.

Duas consequências práticas que voltam para morder: idiomas mal representados no vocabulário gastam **mais tokens para dizer a mesma coisa** — e, como se cobra por token e o custo cresce com o comprimento, a mesma frase sai mais cara em português que em inglês. E tarefas que dependem de olhar dentro da palavra (contar letras, rimar, soletrar) são difíceis não por falta de inteligência do modelo, mas porque **a letra não é uma unidade que ele enxerga**.

:::exercicio {"id":"sequencias-linguagem-e3","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Um colega diz: *"Atenção é só uma forma de dar mais memória ao modelo — no fundo é uma LSTM melhorzinha."* Explique por que essa leitura está errada, usando (a) o que a atenção substitui, (b) o que ela custa e (c) o que o artigo de 2017 de fato removeu.

> **rubrica:** identifica que a atenção substitui **compressão** (um vetor de tamanho fixo resumindo tudo) por **acesso ponderado** a todas as posições preservadas;
> descreve o mecanismo como consulta × chaves → pesos que somam 1 → média ponderada dos valores, isto é, busca suave e derivável;
> aponta que o caminho entre duas posições distantes passa de muitos passos para um, o que é uma mudança de topologia do gradiente, não de tamanho de memória;
> reconhece o custo: comparações quadráticas no comprimento, contra custo linear da recorrência;
> afirma corretamente que 2017 removeu a **recorrência** (o hospedeiro), mantendo a atenção que já existia desde 2014, e que o motivo declarado foi paralelismo/tempo de treino
> **porque:** A resposta fraca trata memória e atenção como quantidades da mesma grandeza ("mais memória") e conclui que a diferença é de grau. A diferença é de **espécie**. A LSTM mantém um resumo e decide o que preservar dele a cada passo: é compressão com política de descarte. A atenção **não resume**: guarda todas as posições e escolhe, a cada consulta, quanto de cada uma usar. Uma esquece por construção; a outra nunca esqueceu nada e paga por isso.
>
> A prova de que não é uma LSTM melhorzinha está na cronologia: entre 2014 e 2017 a atenção **conviveu** com a recorrência, como acessório. Se fosse a mesma coisa em versão melhor, não haveria por que somar as duas. O que 2017 fez foi retirar a parte antiga — e o argumento apresentado foi operacional, não representacional: *"more parallelizable and requiring significantly less time to train"*.
>
> Uma resposta excelente nota o que o negócio custou: caminho curto de gradiente em troca de custo quadrático no comprimento, mais a necessidade de reinjetar a ordem via codificação posicional, porque sem recorrência a arquitetura enxerga um conjunto e não uma sequência.
> **volte para:** #do-gargalo-a-atencao-seq2seq-e-o-vetor-de-tamanho-fixo
:::

## Síntese — o que levar

- **A ordem é informação.** O exemplo não é o elemento: é o elemento *na posição em que está*. Isso quebra a premissa de independência que sustentava os capítulos anteriores.
- A RNN carrega um **estado oculto** — memória de tamanho fixo que é sobrescrita a cada passo.
- O gradiente que some no tempo é o **mesmo diagnóstico** do [capítulo III.3](iii-3-treinar-redes-profundas.md): cada passo é uma camada a mais no caminho de volta do erro.
- **A ideia exportável:** *a solução veio do formato da falha, não da tarefa*. A LSTM foi desenhada contra uma exponencial, não contra a linguagem. Um defeito bem nomeado é meio método — e o nome ("refluxo constante do erro") veio **seis anos** antes da arquitetura.
- **LSTM e GRU** somam um caminho por onde o erro reflui sem encolher, com comportas contínuas para esquecer, escrever e ler. Aliviam o teto de memória; não o eliminam.
- **Seq2seq** transformou tradução em codificar → decodificar, e revelou o gargalo do **vetor de tamanho fixo**. O truque de inverter a frase de origem é gambiarra confessa — e sintoma de que o problema era distância.
- **Atenção = acesso, não compressão.** Consulta, chaves e valores; pesos que somam 1; média ponderada. O caminho entre duas posições distantes passa a ter **um** passo.
- **O Transformer removeu a recorrência, não a atenção.** A atenção existia desde 2014 como acessório de uma RNN; 2017 tirou o hospedeiro. O motivo declarado foi **paralelismo** — a mesma restrição material que decidiu a visão computacional no [capítulo III.4](iii-4-visao.md).
- **Sem recorrência, ninguém sabe a ordem**: por isso a codificação posicional existe. A recorrência codificava ordem de graça; aqui se paga por ela.
- O preço da atenção é **quadrático no comprimento**. Dobrar o texto quadruplica o custo — e é daí que vem o preço da janela de contexto no [capítulo III.6](iii-6-modelos-de-fundacao.md).
- **Tokenização é uma decisão de representação**, não um detalhe de pré-processamento: define o vocabulário, o comprimento da sequência, o custo por frase e o que o modelo simplesmente não consegue enxergar.

:::exercicio {"id":"sequencias-linguagem-e4","tipo":"aberta","objetivo":"O1","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Um sistema registra, para cada sessão de um site, a lista de páginas visitadas em ordem. Um colega monta a tabela com uma linha por visita (sessão, página, tempo na página) e treina um modelo para prever se a sessão terminará em compra, tratando cada linha como observação independente.

Explique, **sem usar exemplo de texto**, por que tratar esses registros como independentes destrói informação, e diga **exatamente o que se perde** ao embaralhar a ordem.

> **rubrica:** nomeia informação que existe **entre** os registros e não dentro de nenhum deles — a sequência em que as páginas apareceram, e o fato de uma página ter vindo antes ou depois de outra;
> dá ao menos um caso concreto em que a mesma coleção de páginas com ordens diferentes significa coisas diferentes — carrinho → pagamento é compra em curso, e pagamento → carrinho é desistência ou erro;
> explica a consequência técnica: o modelo passa a estimar uma probabilidade **média por página**, e nenhuma quantidade de dados recupera a informação que a tabela apagou, porque ela não está mais lá;
> não reduz o problema a "faltou uma variável de ordem": acrescentar o índice da página como coluna dá ao modelo o número, não a **dependência** entre as linhas — a premissa de independência continua violada
> **porque:** A premissa de independência é a mais silenciosa do livro: ela nunca é declarada no código, e quebrá-la não produz erro nenhum. O modelo treina, a métrica sai, e o pipeline não reclama.
>
> O que se perde é a informação **relacional**. Cada linha, isolada, é verdadeira; o que desapareceu foi o que uma linha diz sobre a seguinte. Por isso o quarto critério é o que separa a boa resposta: acrescentar `posicao = 3` informa *onde* a página estava, e não que a página anterior era o carrinho. A dependência é entre observações, e uma coluna vive dentro de uma observação.
>
> Note o que a boa resposta prepara sem saber: é exatamente esta lacuna que a recorrência tenta preencher com um estado que atravessa os passos, e que a atenção preenche deixando cada posição olhar diretamente para as outras. Quem entendeu o que a tabela apagou já entendeu o que as duas arquiteturas foram inventadas para recuperar.
> **volte para:** #o-problema-a-ordem-e-informacao-e-a-memoria-se-dissolve
:::

## Verificação

1. Descreva a limitação de memória de uma RNN e diga por que ela **não** se resolve aumentando o tamanho do estado oculto. Em seguida, explique o que a atenção muda nesse quadro: o que ela substitui e o que ela cobra.
2. Um colega propõe voltar a usar uma LSTM num projeto novo "porque consome menos". Que argumentos a favor e contra você apresenta, e qual característica do problema decidiria a escolha?

> Estas duas não são corrigidas, e a omissão é deliberada: a segunda é uma discussão de projeto, e discussões de projeto se ganham diante de quem discorda.
