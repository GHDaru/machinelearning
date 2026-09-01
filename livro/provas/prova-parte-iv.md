# Prova da Parte IV — Além do supervisionado

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado**. A recomendação do livro a quem dá aula é pontuar **por ter
> feito, nunca por ter acertado**.

## O que esta prova é

Oito itens sobre os três capítulos da Parte IV, de [IV.1](../capitulos/iv-1-nao-supervisionado.md)
a [IV.3](../capitulos/iv-3-ia-simbolica-fuzzy-evolutiva.md). Cada item **cruza
dois capítulos ou mais**, e alguns cruzam para fora da parte, porque é aí que
esta seção do livro se define: ela existe para mostrar o que sobra quando o
rótulo acaba.

Nenhum item traz o **"volte para"**, todo cenário é **inédito**, e todos são
corrigidos na hora, sem consultar modelo de linguagem.

:::exercicio {"id":"prova-parte-iv-q1","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/iv-1-nao-supervisionado.md:O1","livro/capitulos/iv-2-reforco.md:O4"],"dificuldade":"media"}
Uma equipe propõe dois projetos. No A, quer segmentar 90 mil assinantes sem nenhum rótulo. No B, quer otimizar o envio de notificações, e cada envio muda a probabilidade de o usuário abrir as próximas.

O que distingue os dois quanto ao que pode dar errado sem ninguém perceber?

- [ ] Nada: os dois são não supervisionados e falham do mesmo jeito.
- [x] No A o risco é não haver estrutura real e ninguém ter como desmentir; no B o risco é o agente influenciar os próprios dados e ficar preso ao que testou primeiro.
- [ ] No A o risco é de vazamento temporal; no B, de desbalanceamento de classes.
- [ ] No B não há risco silencioso, porque a recompensa é observável a cada passo.

> **gabarito:** ausência de estrutura de um lado, influência sobre os próprios dados do outro
> **porque:** São dois modos de falha silenciosos de naturezas diferentes. No agrupamento, o algoritmo sempre devolve k grupos, inclusive em ruído puro, e as métricas disponíveis são internas — elas não podem discordar de você.
>
> No reforço, o comportamento do agente determina os dados do agente. Ele age de forma ótima segundo o que conhece, e o que ele conhece são as ações que teve a sorte de testar cedo. A recompensa é observável e não denuncia o que nunca foi medido.
>
> A última alternativa confunde observar recompensa com observar alternativa. Você vê o retorno do que fez, e nunca o do que não fez.
:::

:::exercicio {"id":"prova-parte-iv-q2","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iv-1-nao-supervisionado.md:O2","livro/capitulos/iv-3-ia-simbolica-fuzzy-evolutiva.md:O4"],"dificuldade":"dificil"}
K-means e algoritmo genético têm em comum o fato de não garantirem a melhor resposta. Qual comparação é correta?

- [x] O k-means para num mínimo local do critério que declarou; o genético não garante ótimo porque percorre um espaço sem gradiente por variação e seleção. Nos dois, rodar uma vez só é uma decisão.
- [ ] Os dois falham pelo mesmo motivo: ausência de derivada no critério.
- [ ] O k-means é determinístico e o genético é estocástico, então só o segundo precisa de várias execuções.
- [ ] Nenhum dos dois precisa de várias execuções, desde que os hiperparâmetros estejam corretos.

> **gabarito:** mínimo local declarado de um lado, busca sem gradiente do outro, e nos dois rodar uma vez é decisão
> **porque:** As causas são diferentes e a consequência prática é a mesma. O k-means tem critério bem definido e derivável em princípio, e ainda assim para no primeiro mínimo local; o genético nem persegue um critério derivável, ele tateia por variação e seleção.
>
> A terceira alternativa contém um erro de fato que vale corrigir: o k-means **não** é determinístico, porque depende dos centros iniciais sorteados. É exatamente por isso que as bibliotecas rodam várias inicializações.
>
> A leitura que fica é a mesma dos dois capítulos: execução única de método estocástico é uma escolha, e escolha não declarada vira resultado sem intervalo.
:::

:::exercicio {"id":"prova-parte-iv-q3","tipo":"multipla-multi","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iv-3-ia-simbolica-fuzzy-evolutiva.md:O3","livro/capitulos/ii-1-avaliacao.md:O4"],"dificuldade":"dificil"}
Um painel exibe, para a mesma leitura, "pertinência a QUENTE: 0,80" e "probabilidade de falha: 0,80". Quais afirmações são corretas? (marque todas que valem)

- [x] O primeiro 0,80 mede quanto a palavra "quente" se aplica, e medir a temperatura com mais precisão não o reduz.
- [x] O segundo 0,80 mede incerteza sobre um fato nítido, e mais informação pode levá-lo a 0 ou a 1.
- [x] Só o segundo pode ser avaliado por calibração, ou seja, verificando se eventos previstos com 0,80 acontecem 80% das vezes.
- [ ] Os dois podem ser somados a outros graus da mesma família, e a soma tem de dar 1.

> **gabarito:** vagueza contra incerteza · só o segundo se calibra · a soma não precisa dar 1
> **porque:** As três corretas separam dois números que a interface iguala. Vagueza não some com informação; incerteza sim.
>
> A terceira é a que amarra os capítulos. Calibração pergunta se o número previsto corresponde à frequência observada, e essa pergunta só faz sentido para probabilidade — não existe "frequência observada de quente".
>
> A alternativa errada aplica a probabilidade uma regra que só vale para ela, e nem sempre: graus de pertinência não somam 1 por construção, e é essa a primeira pista de que não se trata de probabilidade.
:::

:::exercicio {"id":"prova-parte-iv-q4","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iv-2-reforco.md:O1","livro/capitulos/iv-3-ia-simbolica-fuzzy-evolutiva.md:O1"],"dificuldade":"media"}
Um problema de manutenção tem histórico curto, exigência de justificar cada parada de máquina, e uma estrutura causal que os engenheiros sabem desenhar. Alguém propõe modelá-lo como MDP e treinar um agente.

Qual é a crítica mais precisa?

- [ ] MDP não serve para manutenção, que é um problema de classificação.
- [x] A formulação escolhida define qual busca é possível, e aqui há três recursos que o MDP não usa: histórico curto, exigência de explicação e estrutura causal conhecida.
- [ ] O problema é que faltam recompensas numéricas no domínio.
- [ ] A crítica é apenas de custo: MDP funcionaria, mas seria caro.

> **gabarito:** a formulação não usa três recursos disponíveis
> **porque:** É a ideia reaproveitável do IV.3 aplicada a uma decisão de projeto: a representação escolhida decide qual busca é possível. Uma rede bayesiana com estrutura desenhada por especialista usa os três recursos; um MDP treinado por interação não usa nenhum.
>
> A quarta alternativa reduz tudo a custo, e o problema é anterior. Mesmo com orçamento infinito, o agente aprenderia por interação num domínio em que interagir significa deixar máquinas quebrarem, e continuaria sem entregar justificativa por decisão.
>
> Repare no eco do caso de abertura do IV.3: o erro não é técnico, é de enquadramento — supor que usar IA significa ajustar um modelo a dados.
:::

:::exercicio {"id":"prova-parte-iv-q5","tipo":"numerica","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/iv-2-reforco.md:O1","livro/capitulos/ii-8-do-modelo-a-decisao.md:O2"],"dificuldade":"media"}
Um agente recebe recompensa 0 nos dois primeiros passos e 100 no terceiro. Com γ = 0,8, qual é o retorno descontado visto do instante inicial?

> **gabarito:** 64 ± 0,5
> **porque:** Só o terceiro termo é diferente de zero, e ele espera dois passos: $0{,}8^2 \times 100 = 0{,}64 \times 100 = \mathbf{64}$.
>
> O número diz o que o desconto faz com uma promessa distante. Um prêmio de 100 daqui a dois passos entra na conta valendo 64, e a diferença de 36 é o preço da espera declarado por quem escolheu γ.
>
> É a mesma aritmética da matriz de custo do [capítulo II.8](../capitulos/ii-8-do-modelo-a-decisao.md), com uma diferença que vale notar: lá os valores vêm de quem paga a conta no mundo, aqui γ é escolhido pela equipe. Um parâmetro que decide comportamento e não tem dono declarado é um lugar fácil de esconder uma decisão de negócio.
:::

:::exercicio {"id":"prova-parte-iv-q6","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iv-1-nao-supervisionado.md:O4","livro/capitulos/i-4-analise-exploratoria.md:O3"],"dificuldade":"dificil"}
Uma analista roda k-means com sete valores de k, olha os grupos de cada um, escolhe o que "fez mais sentido" e reporta. Qual é a formulação mais precisa do erro?

- [ ] Ela testou poucos valores de k; o correto seria varrer de 2 a 20.
- [x] Ela escolheu o critério depois de ver o resultado, e num regime em que não existe gabarito capaz de desmenti-la.
- [ ] O erro é usar k-means, que não serve para segmentação de clientes.
- [ ] O erro é não ter normalizado os atributos antes.

> **gabarito:** critério escolhido depois de ver o resultado, sem gabarito para desmentir
> **porque:** É o mesmo erro estrutural do [capítulo I.4](../capitulos/i-4-analise-exploratoria.md), em que escolher o padrão mais forte entre muitos e confirmá-lo nos mesmos dados garante que o teste já nasceu contaminado. Aqui ele é pior, porque no agrupamento não há resposta certa esperando para contradizê-la.
>
> A primeira alternativa piora o problema com aparência de rigor: testar mais valores de k aumenta o número de partições examinadas, e portanto a chance de a mais "interpretável" ser a mais afortunada.
>
> A saída é a mesma dos dois capítulos: declarar o critério antes e testá-lo fora, com estabilidade entre metades ou com uma variável que não entrou no agrupamento.
:::

:::exercicio {"id":"prova-parte-iv-q7","tipo":"multipla-multi","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iv-3-ia-simbolica-fuzzy-evolutiva.md:O2","livro/capitulos/v-1-interpretabilidade-justica.md:O1"],"dificuldade":"media"}
Um regulador exige justificativa por decisão individual. Quais afirmações comparam corretamente as duas formas de obtê-la? (marque todas que valem)

- [x] No encadeamento para trás, o rastro de regras é o raciocínio de fato executado.
- [x] Numa explicação post-hoc, o que se obtém é uma aproximação do modelo, e não a razão pela qual ele decidiu.
- [x] A diferença importa diante de auditoria, porque uma das duas pode divergir do que o sistema realmente fez.
- [ ] As duas são equivalentes desde que a explicação post-hoc tenha alta fidelidade medida.

> **gabarito:** rastro é o raciocínio · post-hoc é aproximação · a diferença importa em auditoria
> **porque:** As três apontam para a mesma distinção: coincidir com o mecanismo é diferente de aproximá-lo bem. Alta fidelidade reduz a divergência e não a elimina, e é justamente na divergência que a auditoria encontra problema.
>
> A alternativa errada troca uma propriedade categórica por uma métrica. "Fidelidade alta" é um número sobre concordância média; a pergunta do regulador é sobre **aquela** decisão.
>
> É o que torna as tradições do IV.3 vivas em domínio regulado: ali a explicação não é extraída depois, ela é o próprio objeto.
:::

:::exercicio {"id":"prova-parte-iv-q8","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iv-2-reforco.md:O2","livro/capitulos/i-3-dados.md:O4"],"dificuldade":"dificil"}
Um sistema de crédito recomenda aprovações, e só quem foi aprovado gera histórico de pagamento. Um sistema de recomendação exibe itens, e só os exibidos geram cliques. O que os dois casos têm em comum?

- [x] Nos dois, a decisão de hoje filtra o dado de amanhã, e mais coleta pela mesma porta reforça o problema em vez de corrigi-lo.
- [ ] Nos dois, o problema é desbalanceamento de classes, tratável com reponderação.
- [ ] Nos dois, o problema é vazamento temporal, tratável com corte de tempo.
- [ ] São problemas diferentes: um é viés de seleção e o outro é exploração insuficiente, sem relação entre si.

> **gabarito:** a decisão filtra o dado, e mais coleta reforça
> **porque:** São o mesmo mecanismo com dois vocabulários. O [capítulo I.3](../capitulos/i-3-dados.md) chama de viés de seleção com laço de realimentação; o [capítulo IV.2](../capitulos/iv-2-reforco.md) chama de explotação em excesso. Nos dois, o sistema fica mais confiante sobre uma fatia cada vez mais estreita do mundo.
>
> A quarta alternativa acerta os dois nomes e nega a relação, que é o ponto do item. Ver que são o mesmo mecanismo é o que transfere o remédio: reservar uma fração de decisões fora da recomendação do modelo, e aceitar pagar por ela.
>
> As duas alternativas do meio propõem tratamentos para problemas de outra natureza. Reponderar corrige proporção entre exemplos que existem; nenhuma reponderação cria linhas sobre quem nunca foi aprovado.
:::
