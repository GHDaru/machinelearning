# Prova da Abertura — 0.1 e 0.2

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação aqui é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado** — e vendê-la como avaliação somativa seria mentira. A quem dá
> aula, a recomendação do livro é pontuar **por ter feito, nunca por ter
> acertado**: pontuar esforço remove o incentivo de colar, pontuar acerto o cria.

## O que esta prova é

Seis itens sobre os capítulos [0.1](../0-1-introducao.md) e
[0.2](../0-2-fundamentos.md), e cada um deles **cruza os dois**. É essa a
diferença entre uma prova e mais uma lista: o exercício de capítulo pergunta
dentro de um capítulo, e aqui cada item só fecha se as duas metades estiverem
no lugar.

Duas outras diferenças, e as duas são deliberadas. Nenhum item traz o
**"volte para"** — a prova mede o que você recupera sem rota de volta. E todo
cenário é **inédito**: nenhum deles aparece em capítulo nenhum, para que
reconhecer o exemplo não substitua entender o conceito.

Todos os itens são corrigidos na hora, sem consultar modelo de linguagem.

:::exercicio {"id":"prova-abertura-q1","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/0-1-introducao.md:O1","livro/0-2-fundamentos.md:O1"],"dificuldade":"media"}
Uma prefeitura mantém há doze anos um sistema que calcula o IPTU a partir da metragem, da região e da idade do imóvel, seguindo a lei municipal. No ano passado a equipe acrescentou um segundo sistema, que estima o valor de mercado do imóvel a partir de vendas recentes da vizinhança.

O primeiro sistema nunca errou. O segundo passou a errar mais neste ano do que no ano passado, sem que ninguém tenha tocado no código dele.

Qual afirmação descreve corretamente os dois sistemas?

- [ ] Os dois aprendem regras a partir de dados; o segundo apenas tem mais ruído.
- [x] No primeiro a regra está no código e por isso ele não envelhece sozinho; no segundo a regra está em parâmetros ajustados a exemplos, e a piora indica que o mundo de onde ela foi aprendida mudou.
- [ ] O segundo sistema tem um bug introduzido na última atualização, já que software não muda de comportamento sozinho.
- [ ] O primeiro sistema é um caso de Machine Learning supervisionado com rótulo dado pela lei.

> **gabarito:** regra no código de um lado, regra em parâmetros do outro, e o segundo envelhece sozinho
> **porque:** O item pede as duas metades ao mesmo tempo. A primeira é onde mora a regra: a lei do IPTU é escrevível, alguém a escreveu, e o sistema executa o que foi escrito. Valor de mercado é a regra que ninguém consegue enunciar, e por isso ela é ajustada a exemplos.
>
> A segunda metade é o que a diferença implica no tempo. Um sistema cuja regra está no código só muda quando o requisito muda. Um sistema cuja regra veio de dados envelhece sozinho, porque o que garantia a validade dele era a semelhança entre o passado de onde aprendeu e o presente em que opera.
>
> A terceira alternativa é verdadeira sobre programação convencional e falsa sobre o segundo sistema, e é a resposta que quase toda equipe de manutenção dá antes de conhecer a distinção. A quarta confunde "há uma regra clara" com "há aprendizado": a lei não é um rótulo aprendido, é a própria função.
:::

:::exercicio {"id":"prova-abertura-q2","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/0-1-introducao.md:O2","livro/0-2-fundamentos.md:O4"],"dificuldade":"dificil"}
Uma editora quer prever quais manuscritos recebidos virarão sucesso de vendas. Tem 260 livros publicados nos últimos vinte anos, com vendas conhecidas. A diretoria pergunta se o projeto é viável e pede que a equipe "meça direito, no conjunto de teste, para não haver dúvida".

Qual é a resposta tecnicamente correta?

- [ ] É viável, e medir no teste é de fato a forma mais confiável de decidir.
- [x] O projeto é frágil por falta de exemplos, e a proposta de decidir pelo teste é justamente o uso que destrói a única estimativa imparcial disponível.
- [ ] É viável desde que a acurácia no teste passe de 90%, o que a diretoria estabeleceu como critério.
- [ ] Não é viável, porque prever vendas exige modelo de série temporal e não de classificação.

> **gabarito:** frágil por falta de exemplos, e decidir pelo teste destrói a estimativa
> **porque:** Duas coisas erradas no mesmo pedido, uma de cada capítulo, e responder só a uma delas é meia resposta.
>
> A primeira é a viabilidade. Duzentos e sessenta exemplos, num fenômeno com tantas causas quanto o sucesso de um livro, é pouco: a estimativa de qualquer métrica sobre um teste tirado dali carrega ruído grande o bastante para tornar a decisão uma loteria.
>
> A segunda está escondida na palavra "decidir". Um número de teste só é imparcial enquanto nenhuma decisão foi tomada com ele. Usá-lo para decidir se o projeto continua faz dele parte do processo, e a partir daí não sobra estimativa limpa para reportar depois. O lugar dessa decisão é a validação, e o teste fica reservado para uma medição final declarada.
>
> A terceira é a armadilha, porque parece rigor: fixar um limiar não conserta nada quando a medição é ruidosa e o conjunto que a produz é o mesmo que decide.
:::

:::exercicio {"id":"prova-abertura-q3","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/0-1-introducao.md:O2","livro/0-2-fundamentos.md:O3"],"dificuldade":"media"}
Uma companhia de ônibus quer prever se um veículo vai quebrar na próxima semana. Tem cinco anos de ordens de serviço, telemetria de motor e um mecânico que acerta quase sempre, "pelo barulho", e não consegue explicar como.

Depois de quatro meses e sete modelos diferentes, o erro de treino e o de validação estão ambos em 21% e não saem dali.

Qual leitura é a correta?

- [ ] O problema não era candidato a ML, porque o mecânico já resolve.
- [x] O problema é candidato a ML, e o platô com treino e validação juntos aponta para informação ausente, e não para escolha ruim de modelo.
- [ ] O problema é de variância alta, e a solução é regularizar os sete modelos.
- [ ] O problema é de rótulo, e a única saída é pedir que o mecânico rotule manualmente cada veículo.

> **gabarito:** é candidato, e o platô aponta para informação ausente
> **porque:** A primeira metade vem do critério de candidatura: existe uma regra, o mecânico a executa, e ninguém consegue escrevê-la. É a definição de problema de ML, e a competência do mecânico é argumento a favor, não contra.
>
> A segunda metade é diagnóstico de erro. Erro alto e **próximo** nos dois conjuntos descarta variância, e sete modelos de famílias diferentes chegando ao mesmo lugar torna a hipótese de viés frágil. Sobra a parcela irredutível: aquilo que decide a quebra talvez esteja no som que o mecânico escuta e não na telemetria coletada.
>
> A ação que isso indica não é de modelagem: é buscar informação nova, por exemplo instrumentar o áudio, ou declarar o teto e parar. É o oposto do que os quatro meses vinham fazendo.
:::

:::exercicio {"id":"prova-abertura-q4","tipo":"multipla-multi","objetivo":"O3","secao":"prova","objetivos":["livro/0-1-introducao.md:O3","livro/0-2-fundamentos.md:O2"],"dificuldade":"media"}
Uma estudante diz: "Entendi o capítulo de otimização. Consigo explicar o que é a taxa de aprendizado e por que ela pode divergir. Mas, quando fui ajustar o modelo do trabalho, o erro de treino ficou em 4% e o de validação em 26%, e eu não soube o que fazer."

Quais leituras são corretas? (marque todas que valem)

- [x] Ela tem uma lacuna de execução, não de compreensão, e a superfície que a fecha é a construção.
- [x] Os números que ela relata são a assinatura de variância alta, com ações conhecidas.
- [ ] Ela deve reler o capítulo de otimização com mais atenção à dedução.
- [x] Saber diagnosticar pelas curvas é o que transforma o travamento dela numa próxima ação concreta.
- [ ] Ela precisa medir no conjunto de teste para descobrir o que está acontecendo.

> **gabarito:** lacuna de execução · variância alta · o diagnóstico dá a próxima ação
> **porque:** O item cruza qual superfície fecha qual lacuna com o diagnóstico pelas curvas, e as três corretas se encadeiam: o vão de 22 pontos nomeia o problema, o nome dá as ações (mais dados, regularização, modelo mais simples), e o que falta a ela é executá-las.
>
> Reler é a resposta que quase todo estudante escolhe e a menos eficaz aqui: ela já explicou o conceito em voz alta, então o texto cumpriu o papel dele. Reler produz de novo a sensação de competência sem tocar no que falta.
>
> A última alternativa é a mais perigosa das cinco, porque parece diligência. Diagnóstico se faz na validação, e ela já tem o número de que precisa. Ir ao teste para investigar gasta a testemunha antes da hora, e não acrescenta informação nenhuma ao diagnóstico.
:::

:::exercicio {"id":"prova-abertura-q5","tipo":"numerica","objetivo":"O4","secao":"prova","objetivos":["livro/0-2-fundamentos.md:O4","livro/0-1-introducao.md:O2"],"dificuldade":"facil"}
Uma equipe tem três conjuntos: treino, validação e teste. Ao longo do projeto ela compara 18 configurações de modelo, escolhe a melhor, corrige dois defeitos encontrados no caminho e reporta o resultado final à diretoria.

Segundo a regra deste livro, quantas vezes o **conjunto de teste** deveria ter sido consultado?

> **gabarito:** 1
> **porque:** A tabela das três divisões é explícita: o teste se olha o mínimo possível, idealmente uma vez. Comparar as 18 configurações e verificar as duas correções é trabalho de **validação**, que existe justamente para ser olhada muitas vezes.
>
> A resposta errada mais comum é 3, contando uma consulta para a escolha e uma para cada correção. Ela é errada por um motivo mecânico, não estilístico: cada consulta que muda uma decisão transfere um pouco da informação do teste para dentro do modelo, e o número reportado no fim já não é imparcial.
>
> E o custo é invisível. Não há erro na tela nem alarme: o número apenas vai ficando menos verdadeiro, e a diferença só aparece em produção, quando não há mais como saber quanto dele era real.
:::

:::exercicio {"id":"prova-abertura-q6","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/0-1-introducao.md:O1","livro/0-2-fundamentos.md:O1"],"dificuldade":"dificil"}
Um sistema de triagem de currículos foi treinado em 2021 e mede 0,89 de acurácia no teste separado na época. Em 2026 ele continua com o mesmo código, o mesmo modelo e os mesmos pesos. Uma auditoria mede a acurácia sobre os currículos que chegaram neste ano: 0,63.

Qual afirmação explica isso sem inventar uma falha que o enunciado não sustenta?

- [ ] O modelo tinha overfitting em 2021, e o 0,89 era otimista desde sempre.
- [x] A métrica de 2021 era uma promessa condicional, e a condição deixou de valer: o modelo não mudou, mudou a população de currículos.
- [ ] O conjunto de teste de 2021 estava contaminado por vazamento, e a queda revela isso.
- [ ] A acurácia é uma métrica inadequada, e com outra métrica os dois números coincidiriam.

> **gabarito:** a métrica era promessa condicional, e a condição deixou de valer
> **porque:** As três alternativas erradas têm algo em comum: todas acusam um defeito de 2021 que o enunciado não dá evidência nenhuma para sustentar. Overfitting e vazamento produziriam queda **imediata**, não cinco anos depois, e trocar de métrica não reconcilia duas medições feitas sobre populações diferentes.
>
> A resposta correta não acusa ninguém. O número de 2021 dizia "se o futuro se parecer com este conjunto, o erro será aproximadamente este", e isso valia. O que aconteceu foi a condição expirar — currículos, vocabulário, formação e mercado de 2026 não são os de 2021.
>
> Esse é o modo de envelhecimento que distingue um sistema aprendido de um programado, e é a razão de a métrica precisar ser reportada com a condição junto. Um número sem a condição é meia informação, e cinco anos depois é a metade que faltava que decide.
:::
