# Prova da Parte I — Ciência de Dados

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado**. A recomendação do livro a quem dá aula é pontuar **por ter
> feito, nunca por ter acertado**: pontuar esforço remove o incentivo de colar,
> pontuar acerto o cria.

## O que esta prova é

Dez itens sobre os seis capítulos da Parte I, de [I.1](../capitulos/i-1-ciclo-ciencia-de-dados.md)
a [I.6](../capitulos/i-6-representacao.md). Cada item **cruza dois capítulos ou
mais**, e é essa a diferença entre uma prova e mais uma lista: o exercício de
capítulo pergunta dentro de um capítulo, e aqui um item só fecha quando as duas
pontas estão no lugar.

Nenhum item traz o **"volte para"** — a prova mede o que você recupera sem rota
de volta. Todo cenário é **inédito**, para que reconhecer o exemplo não
substitua entender o conceito. E todos os itens são corrigidos na hora, sem
consultar modelo de linguagem.

:::exercicio {"id":"prova-parte-i-q1","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/i-1-ciclo-ciencia-de-dados.md:O2","livro/capitulos/i-6-representacao.md:O4"],"dificuldade":"media"}
Uma rede de academias quer prever quais alunos vão cancelar a matrícula. A equipe técnica se reúne na segunda-feira e sai com uma lista de trinta atributos derivados do histórico de frequência.

Na sexta, a área comercial informa que só consegue agir sobre um aluno **no dia da renovação mensal**, e que a lista precisa estar pronta sete dias antes.

O que essa informação torna necessário?

- [ ] Nada nos atributos: basta programar a entrega da lista com sete dias de antecedência.
- [x] Refazer os atributos com corte na data de decisão, porque qualquer um que use frequência dos últimos sete dias não existirá no momento em que a lista precisa sair.
- [ ] Trocar o modelo por um de série temporal, já que agora há uma data envolvida.
- [ ] Aumentar a janela de histórico de trinta para noventa dias, para compensar os sete dias perdidos.

> **gabarito:** refazer os atributos com corte na data de decisão
> **porque:** A restrição de ação é entrega da fase 1, e ela não é burocracia: ela determina sozinha quais atributos podem existir. Sete dias de antecedência significa que tudo o que o modelo usa precisa ser conhecido sete dias antes da renovação.
>
> A primeira alternativa é o erro que a Parte I inteira combate, e ele é sedutor porque parece uma questão de agendamento. Um atributo de "frequência nos últimos sete dias" calculado sobre o histórico completo funciona perfeitamente no treino e é impossível de calcular em produção no instante certo. O modelo fica ótimo e inútil.
>
> A terceira confunde "há prazo" com "há série temporal", e a quarta trata como problema de volume o que é problema de disponibilidade da informação no momento da decisão.
:::

:::exercicio {"id":"prova-parte-i-q2","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/i-2-coleta-integracao.md:O4","livro/capitulos/i-3-dados.md:O1"],"dificuldade":"dificil"}
Um pipeline monta o conjunto de treino de um modelo de cancelamento juntando a tabela de contratos com a tabela de clientes. A tabela de clientes é sincronizada toda madrugada, sobrescrevendo a linha do cliente. A coluna `situacao` vem dessa tabela.

O modelo atinge desempenho três vezes melhor que qualquer tentativa anterior. Onde está o problema, e de que tipo ele é?

- [ ] É um problema de modelagem: o modelo está com capacidade demais e decorou o treino.
- [x] É um problema de integração: a junção não recorta o tempo, então `situacao` chega com o estado de hoje colado num contrato antigo, e o rótulo entra disfarçado de atributo.
- [ ] É um problema de amostragem: a base tem contratos demais de um período só.
- [ ] Não há problema: desempenho melhor indica que os atributos novos funcionaram.

> **gabarito:** problema de integração, com junção sem recorte de tempo
> **porque:** O item cruza a pergunta de procedência com as fontes de vazamento, e a resposta depende das duas. Uma tabela sobrescrita carrega sempre o estado de **hoje**; uma junção sem recorte temporal cola esse hoje num fato de meses atrás. O cliente que cancelou em novembro aparece como cancelado também no contrato de janeiro.
>
> A primeira alternativa é a leitura mais comum e manda consertar o lugar errado. Decorar produziria treino bom e validação ruim; aqui a validação também fica boa, porque ela sofre do mesmo vazamento.
>
> A última é a que o entusiasmo produz, e o capítulo dá a regra de ofício contra ela: resultado bom demais é hipótese de vazamento até prova em contrário, e a prova se procura na origem das colunas, não na métrica.
>
> O reparo é dar tempo à dimensão, com validade por versão ou snapshot datado, e isso exige que alguém tenha decidido guardar história antes. É por isso que a pergunta de procedência se faz na coleta: na modelagem já é tarde.
:::

:::exercicio {"id":"prova-parte-i-q3","tipo":"multipla-multi","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/i-4-analise-exploratoria.md:O2","livro/capitulos/i-5-visualizacao-storytelling.md:O1"],"dificuldade":"media"}
Uma analista precisa mostrar à diretoria o tempo de espera no atendimento. Média 14 min, mediana 6 min, e uma cauda de casos acima de 90 min.

Quais escolhas respeitam o que a Parte I ensina? (marque todas que valem)

- [x] Reportar a mediana como o tempo típico, e a cauda separadamente.
- [x] Usar histograma ou boxplot, porque a pergunta é de distribuição.
- [ ] Usar um gráfico de barras com a média por dia da semana, que é a forma mais legível para diretoria.
- [x] Escrever no título a conclusão, por exemplo que metade é atendida em até 6 minutos e uma minoria espera mais de uma hora.
- [ ] Reportar só a média, porque um número único é mais fácil de decidir em cima.

> **gabarito:** mediana como típico · histograma ou boxplot · título com a conclusão
> **porque:** As três corretas encadeiam a escolha da medida, a escolha da forma e a escolha do título, e as três decorrem do mesmo fato: a distribuição é assimétrica, com média bem acima da mediana.
>
> A barra com a média por dia responde a outra pergunta, de comparação e evolução, e usa exatamente a estatística que apaga a cauda que interessa. Reportar só a média é pior: ela descreve uma espera que quase ninguém vive, nem quem espera 6 minutos nem quem espera 90.
>
> O título com a conclusão é o item que mais gente deixa passar, e tem um efeito colateral útil: escrever a afirmação obriga a verificar se o gráfico a sustenta. Um título que precisa citar dois números é o sinal de que a distribuição tem duas histórias, e é isso mesmo que a diretoria precisa ouvir.
:::

:::exercicio {"id":"prova-parte-i-q4","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/i-4-analise-exploratoria.md:O3","livro/capitulos/i-1-ciclo-ciencia-de-dados.md:O3"],"dificuldade":"dificil"}
Uma equipe explora a base por três semanas, cruza dezenas de variáveis e encontra que clientes de um determinado plano cancelam muito mais. Reporta o achado como conclusão, com o valor-p calculado sobre a mesma base, e a diretoria aprova mudar o plano.

Quais são os dois erros, e de que fases eles são?

- [ ] Explorar demais e reportar rápido demais; os dois são da fase 2.
- [x] Confirmar a hipótese no conjunto que a escolheu, e tratar um achado da fase 2 como decisão da fase 5 sem passar pela pergunta da fase 1.
- [ ] Usar valor-p em vez de intervalo de confiança, e não estratificar a amostra.
- [ ] Não há erro: exploração longa aumenta a confiança no achado.

> **gabarito:** confirmar onde escolheu, e pular da fase 2 para a decisão
> **porque:** O primeiro erro é o da fronteira entre explorar e confirmar: escolher o padrão mais forte entre dezenas e testá-lo nos mesmos dados garante que o teste já nasceu contaminado pela escolha. O produto legítimo de uma exploração é uma lista de hipóteses ordenada, não uma conclusão.
>
> O segundo é de processo, e o CRISP-DM o nomeia. Um achado da fase 2 virou decisão de negócio sem passar pela fase 1, ou seja, sem que ninguém perguntasse qual decisão vai mudar, de quem, e com qual critério de sucesso. É a seta de volta da fase 2 para a 1, que existe justamente para isso.
>
> A última alternativa inverte a relação: exploração longa aumenta o número de padrões examinados, e portanto aumenta a chance de o mais forte ser o extremo do ruído. Mais tempo explorando exige mais disciplina na confirmação, não menos.
:::

:::exercicio {"id":"prova-parte-i-q5","tipo":"numerica","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/i-6-representacao.md:O2","livro/capitulos/i-3-dados.md:O2"],"dificuldade":"facil"}
Uma variável categórica `turno` tem 3 valores. Ela entra numa **regressão logística com intercepto**, e a validação é feita por validação cruzada de 5 dobras.

Quantas colunas *dummy* devem ser criadas para `turno`?

> **gabarito:** 2
> **porque:** A regra é k − 1 colunas para k categorias quando há intercepto, então 2. Com as três, elas somam 1 em toda linha, que é exatamente o que a coluna do intercepto já vale, e o sistema perde a solução única.
>
> A validação cruzada aparece no enunciado por outro motivo, e é o cruzamento que o item cobra: o número de dummies não muda com ela, mas **onde a codificação é calculada** muda. Toda transformação aprendida dos dados entra dentro de cada dobra, com o treino daquela dobra, e não antes.
>
> Para one-hot puro isso quase não importa, porque a transformação não olha o alvo nem estatística nenhuma da coluna. Para codificação pelo alvo importa muito, e é essa distinção que faz a regra valer a pena decorar como "estatística aprendida entra no laço", em vez de "sempre transforme dentro da dobra".
:::

:::exercicio {"id":"prova-parte-i-q6","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/i-3-dados.md:O2","livro/capitulos/i-2-coleta-integracao.md:O1"],"dificuldade":"dificil"}
Um sistema industrial coleta leituras de 60 sensores em 14 máquinas, por dois anos, via fila de mensagens. O modelo vai prever falha em máquinas do mesmo parque, incluindo três que serão instaladas no ano que vem.

Qual conjunto de cuidados a divisão exige?

- [ ] Embaralhar as leituras e estratificar pela taxa de falha, que é rara.
- [x] Dividir por tempo, garantir que nenhuma máquina apareça nos dois lados, e deduplicar antes, porque a fila entrega ao menos uma vez.
- [ ] Dividir por máquina apenas, já que a estrutura de grupo é a mais forte aqui.
- [ ] Usar validação cruzada de 10 dobras sobre as leituras, que é mais robusta que divisão única.

> **gabarito:** tempo, grupo e deduplicação
> **porque:** Três estruturas se acumulam, e ignorar qualquer uma invalida a medição. **Tempo**, porque o parque, a operação e o desgaste mudam em dois anos. **Grupo**, porque o caso de uso declarado inclui máquinas novas, e um modelo que aprende a reconhecer a máquina vai bem no teste e falha exatamente onde foi prometido.
>
> A terceira vem da coleta, e é a que quase ninguém lembra numa questão de divisão: fila entrega ao menos uma vez, então duplicata é comportamento normal. Leituras duplicadas caindo dos dois lados da divisão fazem o teste medir memória, e nenhuma disciplina de tempo ou de grupo detecta isso.
>
> A alternativa da validação cruzada é a mais elegante e a mais enganosa. Robustez contra ruído amostral não conserta viés: dez dobras embaralhadas erradas produzem uma estimativa errada com intervalo estreito, que é pior do que uma estimativa errada e visivelmente incerta.
:::

:::exercicio {"id":"prova-parte-i-q7","tipo":"multipla-multi","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/i-3-dados.md:O3","livro/capitulos/i-2-coleta-integracao.md:O4"],"dificuldade":"media"}
Uma equipe vai usar uma base pública de imagens médicas, baixada sem cadastro, para treinar um produto comercial. Quais perguntas a Parte I obriga a responder antes? (marque todas que valem)

- [x] Qual é a licença, e se ela permite uso comercial e redistribuição.
- [x] Como um exemplo entrou nesta base, que é onde mora o viés de seleção.
- [x] Como o alvo foi rotulado, e por quem.
- [ ] Qual é a correlação de cada atributo com o diagnóstico, para descartar os fracos cedo.
- [x] Se há dado pessoal e, havendo, se está anonimizado.

> **gabarito:** licença · como o exemplo entrou · como o alvo foi rotulado · dado pessoal
> **porque:** As quatro corretas são perguntas da ficha de dataset, e nenhuma delas se responde olhando as colunas: todas exigem procurar quem produziu a base. É esse o ponto da ficha, e é por isso que ela vem antes do treino.
>
> Duas merecem destaque neste caso. Download aberto não é permissão: acesso descreve como o arquivo é distribuído, não o que a licença autoriza, e uso comercial é justamente o que costuma ser restrito em base médica. E "como o alvo foi rotulado" decide o teto do modelo — se o diagnóstico veio de um sistema anterior, o modelo aprende aquele sistema, não a doença.
>
> A alternativa errada é de outra etapa e, pior, seria enganosa aqui: correlação com o alvo medida na base inteira é o sintoma típico de vazamento, e nenhuma pergunta de qualidade detecta problema de procedência. Coluna vazada é limpa, completa e preditiva.
:::

:::exercicio {"id":"prova-parte-i-q8","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/i-6-representacao.md:O3","livro/capitulos/i-4-analise-exploratoria.md:O1"],"dificuldade":"media"}
Uma tabela tem `renda_mensal` (milhares de reais, distribuição com cauda longa à direita) e `anos_de_estudo` (0 a 25). A equipe vai comparar dois modelos: um k-NN e uma floresta aleatória.

O que a diferença de escala exige de cada um?

- [ ] Dos dois, porque escalas díspares sempre prejudicam o treino.
- [x] Do k-NN, que soma unidades diferentes numa distância; da floresta, nada, porque cada corte olha um atributo por vez.
- [ ] Da floresta, que compara atributos entre si ao escolher o corte.
- [ ] De nenhum, desde que a renda seja transformada por logaritmo antes.

> **gabarito:** exige do k-NN, e nada da floresta
> **porque:** A resposta depende do modelo, e essa é a resposta que quase ninguém dá. O k-NN define vizinhança por distância, e distância soma unidades diferentes: sem escala comum, a renda em milhares domina os anos de estudo só porque os números são maiores. A floresta é indiferente, porque padronizar é transformação monotônica dentro de cada atributo e não muda a ordem dos valores.
>
> A terceira alternativa inverte a mecânica da árvore, que nunca compara dois atributos na mesma conta.
>
> A quarta é a mais interessante, porque mistura duas decisões diferentes. Transformar a renda por logaritmo é uma resposta à **assimetria**, que é uma questão de forma da distribuição, e ajuda a leitura e alguns modelos. Ela não substitui a padronização exigida pelo k-NN: depois do logaritmo as duas variáveis continuam em unidades diferentes.
:::

:::exercicio {"id":"prova-parte-i-q9","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/i-1-ciclo-ciencia-de-dados.md:O4","livro/capitulos/i-3-dados.md:O4"],"dificuldade":"dificil"}
Um time de quatro pessoas técnicas opera há dois anos um modelo que aprova pedidos de reembolso. A base de treino cresce todo mês com os pedidos processados. O desempenho medido nunca caiu. Ninguém foi designado para conversar com a área que recebe as reclamações dos reembolsos negados.

Qual é o diagnóstico mais completo?

- [ ] Não há problema: desempenho estável por dois anos é o melhor sinal possível.
- [x] Duas fases estão sem dono, e a base cresce por uma porta que o próprio modelo filtra, então o desempenho estável mede uma fatia cada vez mais estreita.
- [ ] Há viés de seleção, e a solução é coletar mais dados por mais tempo.
- [ ] Falta um engenheiro de ML, que é quem monitoraria a fase 6.

> **gabarito:** duas fases sem dono, e a base filtrada pelo próprio modelo
> **porque:** O item soma um diagnóstico de processo com um de coleta, e cada um sozinho deixa metade do problema de pé.
>
> Do lado do processo: num time só de gente técnica a fase 1 fica sem dono, e aqui a fase 5 também, porque ninguém pergunta se o resultado resolve o problema de quem recebe as reclamações. Fase sem responsável declarado é diferente de pessoa com dois chapéus, que é normal e funciona.
>
> Do lado da coleta: cada pedido novo entra na base já filtrado pela decisão anterior do modelo. Os negados não geram histórico de desfecho, e o sistema fica mais confiante sobre uma população que ele mesmo selecionou. Por isso a terceira alternativa é a armadilha: mais dados pela mesma porta pioram o problema, e o erro cresce junto com a base.
>
> A quarta acerta uma lacuna real e para cedo. Monitorar a fase 6 detectaria queda de métrica, e aqui a métrica não cai — ela mede a fatia estreita com precisão crescente.
:::

:::exercicio {"id":"prova-parte-i-q10","tipo":"completar","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/i-6-representacao.md:O1","livro/capitulos/i-1-ciclo-ciencia-de-dados.md:O1"],"dificuldade":"facil"}
Complete a fase do CRISP-DM em que se decide como o dado vira uma tabela treinável, com atributos construídos e rótulo definido. É também a fase mais revisitada do ciclo:

`fase ______ — preparação dos dados`

> **gabarito:** 3|três|tres
> **porque:** A fase 3 entrega o pacote que a modelagem consome: divisões feitas, atributos construídos, rótulo definido. Ela é a mais revisitada porque cada erro do modelo, na fase 4, devolve trabalho para ela.
>
> O cruzamento com o capítulo de representação é o que dá sentido a decorar isto. As três decisões de representação (como codificar categórica, se a escala importa, e que atributo não está lá) são todas tomadas dentro da fase 3, e é por isso que a fase mais revisitada é também aquela onde o teto do projeto é decidido.
>
> Quem monta o cronograma reservando tempo para "modelar" e tratando a preparação como etapa que acontece uma vez está orçando o projeto errado, e vai gastar a diferença sem tê-la previsto.
:::
