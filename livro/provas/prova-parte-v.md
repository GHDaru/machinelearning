# Prova da Parte V — No mundo real

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado**. A recomendação do livro a quem dá aula é pontuar **por ter
> feito, nunca por ter acertado**.

## O que esta prova é

Dez itens sobre os quatro capítulos da Parte V, de [V.1](../capitulos/v-1-interpretabilidade-justica.md)
a [V.4](../capitulos/v-4-fronteira.md). Cada item **cruza dois capítulos ou
mais**, e vários cruzam para fora da parte, porque é isto que a Parte V faz: ela
pega o que o resto do livro ensinou em condição de laboratório e pergunta o que
acontece quando aquilo vai para o mundo, com gente afetada, com encanamento em
volta e com o relógio correndo.

Nenhum item traz o **"volte para"**, todo cenário é **inédito**, e todos são
corrigidos na hora, sem consultar modelo de linguagem.

:::exercicio {"id":"prova-parte-v-q1","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/v-1-interpretabilidade-justica.md:O1","livro/capitulos/v-2-sistemas-de-ml.md:O1"],"dificuldade":"media"}
Uma seguradora quer trocar o modelo de precificação, hoje uma regressão logística com doze variáveis, por um ensemble de árvores mais preciso. A área jurídica exige que a empresa continue conseguindo explicar cada preço a quem reclamar.

Um engenheiro propõe: *"trocamos o modelo e acoplamos uma camada de explicação por cima; do ponto de vista do sistema, é só mais um componente."*

Qual avaliação da proposta é correta?

- [ ] Está certa: explicação post-hoc é equivalente a modelo interpretável, e o sistema ganha precisão sem perder nada.
- [x] Está errada em duas frentes: a explicação passa a ser uma aproximação da decisão, e não a decisão; e o componente novo é mais encanamento para manter, sujeito ao mesmo princípio de que mudar qualquer coisa muda tudo.
- [ ] Está errada só na parte jurídica: tecnicamente o sistema fica idêntico, e o problema é de conformidade.
- [ ] Está certa desde que a camada de explicação seja treinada com o mesmo dado do modelo.

> **gabarito:** erra nas duas frentes, a da explicação e a do sistema
> **porque:** O item cruza os dois capítulos de propósito, porque a proposta é tentadora justamente por parecer razoável nos dois.
>
> Do lado da interpretabilidade: no modelo logístico, o coeficiente **é** o mecanismo da decisão. Com a explicação acoplada, o que se entrega a quem reclama é uma atribuição calculada depois, relativa a uma referência escolhida, sobre uma decisão que foi tomada por outro caminho. As duas coisas não são intercambiáveis, e a diferença aparece exatamente no caso contestado.
>
> Do lado do sistema: "só mais um componente" é a frase que constrói encanamento. O componente novo tem dono, versão, custo de latência e modo de falha próprio, e passa a ser mais uma superfície onde uma mudança aparentemente local muda o resultado.
>
> A quarta alternativa é a errada mais sedutora: treinar a explicação com o mesmo dado não a torna o mecanismo; ela continua sendo uma aproximação, agora com aparência de rigor.
:::

:::exercicio {"id":"prova-parte-v-q2","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/v-1-interpretabilidade-justica.md:O3","livro/capitulos/v-3-mlops.md:O3"],"dificuldade":"dificil"}
Um sistema de triagem de candidatos foi lançado com paridade de taxas de aprovação entre dois grupos, medida e documentada. Oito meses depois, o painel mostra que a distribuição das entradas mudou muito num dos grupos: chegam candidatos com outro perfil de formação. A taxa de aprovação daquele grupo caiu.

Qual leitura combina corretamente os dois capítulos?

- [x] Houve drift de covariáveis, e a paridade que havia sido calibrada sobre a distribuição antiga não é uma propriedade que se conserva sozinha quando a entrada muda.
- [ ] Houve drift de conceito, porque a relação entre candidato e aprovação claramente mudou para aquele grupo.
- [ ] Não houve drift, porque o modelo é o mesmo e nada nele foi alterado.
- [ ] Houve violação de justiça independentemente de drift, porque taxas diferentes são, por definição, discriminação.

> **gabarito:** drift de covariáveis, e a paridade não se conserva sozinha
> **porque:** É o cruzamento que a Parte V existe para fazer. Uma garantia de justiça é medida sobre uma distribuição, num instante. Ela não é uma propriedade do modelo, é uma propriedade da relação entre o modelo e a população que chega. Quando a população muda, a garantia pode cair sem que ninguém toque no código.
>
> A segunda alternativa confunde os dois drifts: mudou quem chega, e nada no enunciado diz que a relação entre formação e desempenho mudou. A terceira usa a definição errada de drift, a que exige alteração no modelo. E a quarta é a leitura que o capítulo V.1 desmonta: taxas diferentes podem ser consequência aritmética de prevalências diferentes, e chamar isso de discriminação por definição impede a discussão que de fato importa, que é qual critério se escolhe e por quê.
>
> A consequência prática é a que interessa: métrica de justiça pertence ao painel de monitoramento, com janela e alarme, e não ao relatório de lançamento.
:::

:::exercicio {"id":"prova-parte-v-q3","tipo":"multipla-multi","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/v-2-sistemas-de-ml.md:O3","livro/capitulos/v-3-mlops.md:O2"],"dificuldade":"media"}
Um modelo de previsão de cancelamento é servido por uma API. Um dos atributos, `meses_de_contrato`, é calculado no treino a partir da tabela de contratos e, no serviço, a partir de uma data que o aplicativo envia. Nos últimos meses, uma versão antiga do aplicativo passou a enviar a data em outro formato, e o serviço converte silenciosamente o que não entende para zero.

Quais afirmações são corretas? Marque todas que valem.

- [x] O defeito é de contrato de fronteira, e um contrato que declarasse tipo e faixa transformaria a degradação lenta em falha ruidosa.
- [x] Há divergência entre treino e serviço, e reutilizar o mesmo código de cálculo nos dois lados a tornaria impossível em vez de improvável.
- [x] A conversão silenciosa é a política mais perigosa das três, porque nada registra que ela aconteceu.
- [ ] O problema se resolve retreinando o modelo com dados recentes, que já incluem os zeros.
- [ ] O problema é de qualidade do aplicativo, e não do serviço de modelo, que apenas recebeu o que lhe mandaram.

> **gabarito:** contrato de fronteira; divergência entre treino e serviço; a política silenciosa
> **porque:** As três corretas atacam a causa em camadas diferentes e todas as três valem ao mesmo tempo, que é a razão de o item ser de múltipla marcação.
>
> A primeira errada é a mais cara na prática: retreinar com os zeros ensina o modelo a tratar contrato de duração zero como um caso frequente, o que dá a um defeito de integração a aparência de um padrão do negócio. O erro sai do painel e entra no modelo.
>
> A segunda errada é a que aparece em reunião. Tecnicamente é verdade que o aplicativo mudou o comportamento; e é irrelevante, porque a fronteira existe justamente para o caso de quem chama fazer algo inesperado. Um serviço que só funciona quando todos os chamadores se comportam não tem contrato, tem expectativa.
:::

:::exercicio {"id":"prova-parte-v-q4","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/v-2-sistemas-de-ml.md:O4","livro/capitulos/v-3-mlops.md:O4"],"dificuldade":"dificil"}
Uma operadora de saúde prevê risco de reinternação para acionar uma equipe de acompanhamento. A decisão é tomada uma vez por dia, de manhã, para a lista de pacientes com alta na véspera. Um dos atributos exige agregar dois anos de histórico do prontuário, e calculá-lo leva perto de um minuto por paciente.

O time de plataforma quer migrar tudo para serviço em linha, "para modernizar". Qual é a avaliação correta, e o que ela implica para o plano de rollback?

- [x] O requisito não pede tempo real, e o atributo caro reforça a escolha por lote; num sistema em lote, uma promoção ruim é notada no ciclo seguinte e desfeita com um recálculo, o que muda o desenho do rollback, mas não dispensa escrevê-lo.
- [ ] Migrar é correto, porque serviço em linha é sempre preferível quando existe infraestrutura, e o rollback fica mais simples com versões endereçáveis.
- [ ] Manter em lote e, por isso, dispensar o plano de rollback: em lote não há usuário afetado em tempo real.
- [ ] A decisão depende apenas do custo de infraestrutura das duas opções, que é o único eixo objetivo da escolha.

> **gabarito:** fica em lote, e o rollback continua obrigatório com outro desenho
> **porque:** Os dois primeiros eixos da escolha apontam para o mesmo lado. A decisão é consumida de manhã, sobre a lista da véspera, então ninguém espera resposta; e o atributo custa um minuto, que não cabe em orçamento nenhum de requisição.
>
> A parte que separa quem entendeu os dois capítulos é a segunda metade. Lote **não** dispensa rollback, dispensa pressa. A pergunta muda: em vez de quantos segundos até reverter, é quantos pacientes entraram na lista errada antes de alguém perceber, e como se refaz a lista. Métrica de disparo, limite, responsável e tempo continuam sendo os quatro itens, e o terceiro item é o mais frágil aqui, porque num ciclo diário o incidente costuma ser descoberto por quem recebe a lista, e não por quem opera o modelo.
>
> A segunda alternativa é a armadilha da modernidade, que o capítulo V.2 nomeia e que a recomendação de uma autora conhecida alimenta. A quarta reduz a escolha a custo, que é um eixo real e não é o primeiro.
:::

:::exercicio {"id":"prova-parte-v-q5","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/v-2-sistemas-de-ml.md:O2","livro/capitulos/v-4-fronteira.md:O2"],"dificuldade":"media"}
Num relatório interno, um time escreve: *"o modelo de recomendação aumentou a receita em 12%"*. Ao conferir, você descobre que o número compara o mês de dezembro com o de novembro, que o modelo entrou no ar em 3 de dezembro, e que a empresa fez uma campanha de fim de ano no mesmo período.

Qual é a crítica mais precisa?

- [ ] O número está errado, porque 12% é grande demais para um sistema de recomendação.
- [x] O número existe e não sustenta a alegação: a comparação não isola o efeito do modelo do efeito da campanha e da sazonalidade.
- [ ] O problema é o tamanho da amostra, que abrange apenas um mês de operação.
- [ ] A alegação é aceitável internamente, e só precisaria de rigor se fosse publicada fora da empresa.

> **gabarito:** o número existe e não sustenta a alegação
> **porque:** É a ordem de avaliação do capítulo V.4 aplicada a uma alegação de dentro de casa: existe o número, o que ele mediu, sob que condição, e é isso que estão dizendo? Ele morre no terceiro passo, porque a condição incluiu duas outras causas suficientes para explicar a variação.
>
> A primeira alternativa é o reflexo de descartar pelo tamanho do efeito, e é fraco: 12% pode ser perfeitamente plausível, e a implausibilidade não é o defeito. A terceira ataca a amostra, e o problema não é quantidade de dado, é ausência de comparação. A quarta é a mais perigosa das quatro, e por isso está aqui: alegação interna decide orçamento, promoção de projeto e o que a empresa faz no ano seguinte. É onde o rigor tem consequência mais direta, e é justamente onde ele costuma ser dispensado.
>
> Repare no encanamento por trás: o time que não consegue isolar o efeito é quase sempre o time que não tem como servir metade do tráfego com a versão anterior. O rigor da avaliação depende de uma capacidade de sistema.
:::

:::exercicio {"id":"prova-parte-v-q6","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/v-3-mlops.md:O1","livro/capitulos/v-1-interpretabilidade-justica.md:O4"],"dificuldade":"dificil"}
Um órgão regulador pede que a empresa demonstre, para uma decisão automatizada tomada em março, qual foi o desempenho do modelo por subgrupo naquele momento. Estamos em novembro. A empresa tem o modelo de março guardado, o código no repositório e o dado de treino identificado por hash.

O que ainda pode impedir a resposta?

- [x] A definição dos subgrupos e o limiar vigentes em março, que são configuração e podem ter mudado sem deixar registro datado.
- [ ] Nada: com modelo, código e dado, o desempenho por subgrupo é recalculável e a resposta está garantida.
- [ ] A ausência do conjunto de teste de março, que precisaria ter sido copiado por inteiro.
- [ ] A impossibilidade de recuperar as predições exatas, já que modelos são não determinísticos por natureza.

> **gabarito:** a configuração, isto é, os subgrupos declarados e o limiar
> **porque:** O item cruza a linhagem do V.3 com a exigência do V.1 de declarar os subgrupos **antes** de olhar o resultado. Reprodutibilidade exige cinco versionamentos, e o enunciado entrega três: código, dado e modelo. Faltam configuração e ambiente, e a configuração é a que decide esta resposta.
>
> Duas coisas mudam a métrica por subgrupo sem tocar no modelo: o limiar, que altera quem é aprovado, e a própria definição dos recortes, que altera quem é comparado com quem. Se qualquer das duas foi ajustada entre março e novembro sem registro datado, o número que você calcular hoje é sobre outra pergunta.
>
> A terceira alternativa erra o método: o hash é o que evita copiar o conjunto por inteiro. A quarta usa uma meia verdade, porque a não determinação do treino é resolvida por semente e ambiente fixos, e a inferência de um modelo salvo é determinística.
:::

:::exercicio {"id":"prova-parte-v-q7","tipo":"numerica","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/v-1-interpretabilidade-justica.md:O4","livro/capitulos/v-3-mlops.md:O3"],"dificuldade":"media"}
Um modelo de aprovação de cadastro é monitorado por subgrupo. No grupo A, 4000 solicitantes, 1800 aprovados. No grupo B, 2000 solicitantes, 600 aprovados.

Calcule a diferença entre as taxas de aprovação dos dois grupos, em módulo. Responda como número decimal entre 0 e 1, com duas casas.

> **gabarito:** 0.15 ± 0.01
> **porque:** A taxa do grupo A é 1800 dividido por 4000, igual a 0,45. A do grupo B é 600 dividido por 2000, igual a 0,30. A diferença em módulo é 0,15.
>
> O número em si é a parte fácil, e a razão de ele estar numa prova é outra: essa diferença é uma **medida**, não um veredito. Ela pode vir de discriminação do modelo, de diferença real de prevalência entre os grupos, ou das duas coisas somadas, e nenhuma conta feita só com estes quatro números separa as três hipóteses. O que o valor obriga é a próxima pergunta, não a conclusão.
>
> E há a leitura de operação: uma diferença assim é exatamente o tipo de grandeza que precisa estar num painel com janela e alarme, porque ela se move quando a distribuição de quem chega se move, sem que ninguém altere o modelo.
:::

:::exercicio {"id":"prova-parte-v-q8","tipo":"multipla-multi","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/v-2-sistemas-de-ml.md:O2","livro/capitulos/v-3-mlops.md:O1"],"dificuldade":"dificil"}
Uma empresa tem, hoje: um script sem dono que junta quatro fontes toda madrugada; um segundo modelo que aprende a corrigir a saída do primeiro; um arquivo de parâmetros de 400 linhas na máquina de um analista; e a descoberta recente de que o time de cobrança consome a tabela de saída.

O time pergunta por onde começar. Quais justificativas para a ordem de pagamento são defensáveis pelo que a Parte V ensina? Marque todas que valem.

- [x] Começar pelo arquivo de parâmetros, porque pô-lo sob revisão e no repositório é barato e elimina um ponto único de falha que também impede reproduzir qualquer resultado.
- [x] Tratar cedo os consumidores não declarados, porque enquanto eles existirem qualquer melhoria sua vira incidente de outra pessoa.
- [ ] Começar pela cascata de correções, porque ela é a dívida mais cara e o mais caro deve vir primeiro.
- [x] Declarar contratos nas quatro fontes antes de mexer na cascata, porque sem eles não há como saber se uma mudança piorou algo.
- [ ] Reescrever o script da madrugada como primeiro passo, porque a selva de pipelines é a raiz de tudo.

> **gabarito:** configuração primeiro; consumidores declarados cedo; contratos antes da cascata
> **porque:** As três corretas seguem o mesmo critério, que é retorno por esforço combinado com redução de risco, e não gravidade absoluta.
>
> A alternativa da cascata inverte o critério: caro não é o mesmo que primeiro. Mexer na cascata exige negociar com quem depende dela e é o trabalho mais lento da lista, e fazê-lo antes de haver contrato significa mudar o sistema sem instrumento para perceber o estrago.
>
> A alternativa do script é a mais instrutiva das erradas, porque ela parece a mais corajosa. Reescrever a selva sem mudar a divisão de trabalho que a criou produz uma selva nova, e isso não é opinião do livro: é o diagnóstico dos próprios autores que nomearam a dívida, que a descrevem como sintoma de papéis de pesquisa e engenharia separados demais.
:::

:::exercicio {"id":"prova-parte-v-q9","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/v-4-fronteira.md:O3","livro/capitulos/v-3-mlops.md:O3"],"dificuldade":"media"}
Um capítulo técnico afirma duas coisas. A primeira: *"a hipótese de que treino e produção vêm da mesma distribuição não é verificável antes do deploy."* A segunda: *"a biblioteca X é hoje a escolha padrão para servir modelos com baixa latência."*

Qual classificação, quanto à validade no tempo, está correta?

- [x] A primeira envelhece devagar, porque é uma restrição estrutural do problema; a segunda envelhece rápido, porque é escolha de ferramenta.
- [ ] As duas envelhecem rápido, porque toda afirmação técnica tem prazo.
- [ ] A primeira envelhece rápido, porque métodos de detecção de drift estão evoluindo e podem torná-la falsa.
- [ ] A segunda envelhece devagar, porque a necessidade de baixa latência é permanente.

> **gabarito:** a primeira devagar, a segunda rápido
> **porque:** É a regularidade da tabela do V.4: o que envelhece devagar é diagnóstico, o que envelhece rápido é remédio. A primeira afirmação descreve uma limitação de conhecimento sobre o futuro, e nenhum avanço de ferramenta a remove.
>
> A terceira alternativa merece atenção porque quase acerta. Métodos de detecção melhoram e vão continuar melhorando, e o que eles detectam é o drift **depois** que ele começou a aparecer nos dados. Isso não é o mesmo que verificar antes do deploy se a distribuição futura vai coincidir, e é essa distinção que mantém a afirmação de pé.
>
> A quarta troca a necessidade pela solução: precisar de baixa latência é durável, e qual biblioteca entrega isso é a parte que gira.
:::

:::exercicio {"id":"prova-parte-v-q10","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/v-4-fronteira.md:O1","livro/capitulos/v-1-interpretabilidade-justica.md:O3"],"dificuldade":"dificil"}
Você lidera um projeto que vai decidir quem recebe uma tarifa social. Duas definições de justiça razoáveis para o caso são incompatíveis entre si, dadas as prevalências dos grupos, e não há critério consensual na literatura para escolher entre elas.

Qual é a conduta que este livro sustenta?

- [x] Escolher uma, escrever a justificativa e a quem ela desfavorece, e montar o monitoramento que mostraria que a escolha foi ruim.
- [ ] Adiar a decisão até que a literatura produza um critério consensual, já que decidir sem base é arbitrário.
- [ ] Escolher a definição que produzir os números mais equilibrados no relatório de lançamento.
- [ ] Delegar a escolha ao jurídico, porque a questão é normativa e não técnica.

> **gabarito:** escolher, justificar por escrito e montar como perceber o erro
> **porque:** É a definição de questão aberta relevante para a prática: você precisa agir mesmo sem a resposta, e a decisão depende dela. Esperar não é neutro, porque o sistema entra no ar de um jeito ou de outro, ou não entra, e não entrar também é uma decisão com efeito sobre gente.
>
> A terceira alternativa é a que mais acontece, e o defeito dela não é escolher: é escolher pelo resultado que o número dá, o que transforma um critério de justiça em enfeite de relatório. A quarta terceiriza a parte que é sua: a área jurídica decide o que é permitido, e não qual definição formal corresponde melhor ao que se quer proteger, porque essa correspondência exige entender o que cada definição mede.
>
> O terceiro pedaço da resposta certa é o que a Parte V acrescenta ao V.1 sozinho. Escolha declarada é auditável; escolha declarada **com um mecanismo de perceber que estava errada** é o que separa uma decisão defensável de uma justificativa bem escrita.
:::
