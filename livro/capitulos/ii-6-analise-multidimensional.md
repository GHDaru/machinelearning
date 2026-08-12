# II.6 — Análise Multidimensional

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Modelar um domínio em esquema estrela, distinguindo fatos de dimensões.
- **O2.** Executar operações OLAP: drill-down, roll-up, slice, dice e pivot.
- **O3.** Justificar a desnormalização deliberada de um repositório analítico.
- **O4.** Relacionar o cubo à tabela que um modelo preditivo consome.

## O problema: vendas por produto, por região, por trimestre

Você já viu SQL. Então já viu esta cena: a diretora pede "vendas por produto, por região, por trimestre" — e você escreve um `GROUP BY` com três colunas, três `JOIN` e um `SUM`. Funciona. Aí ela pergunta: "e sem a região Sul?". Depois: "e agora por categoria em vez de produto?". Depois: "e mês a mês, só no Nordeste?". Cada pergunta é uma consulta nova, escrita do zero, que varre a mesma base de novo.

O aperto é estrutural. O modelo relacional é excelente para **transação** — normalizado para escrever rápido e sem inconsistência. E é desajeitado para a **pergunta gerencial típica**, que agrega em vários eixos ao mesmo tempo e muda de eixo a cada trinta segundos de reunião. São dois objetivos opostos no mesmo banco, e o segundo sempre perde: a consulta demora, e quem perguntou já mudou de assunto.

O erro que este capítulo previne é tratar isso como problema de otimização de SQL. Não é. É problema de **modelo de dados**.

## De onde isto veio

**O aperto.** Anos 1980–90: as empresas já tinham o dado transacional em bancos relacionais e não conseguiam interrogá-lo na velocidade da conversa. O analista pedia um relatório; o relatório vinha no dia seguinte, respondendo a uma pergunta que já não era a pergunta.

**O que se fazia antes.** SQL direto sobre o transacional, com muitos `GROUP BY` encadeados — lento, e reescrito por inteiro a cada nova pergunta. O conhecimento acumulado ficava nas consultas de alguém, não no modelo.

**A virada.** Parar de tratar o dado como *tabelas* e passar a tratá-lo como **cubo**: eixos (as **dimensões** — produto, região, tempo) e **medidas** (o que se soma — receita, quantidade). Com as agregações **pré-computadas**, mudar de pergunta deixa de ser reescrever a consulta e vira **navegar**: descer o nível de detalhe, subir, fatiar, girar.

**A ideia reaproveitável.** **Trocar espaço e frescor por tempo de resposta é uma decisão de projeto, não um detalhe.** O cubo é essa troca tornada arquitetura: ele ocupa mais disco, duplica dado e responde com números de ontem — em troca de responder *agora*. É o mesmo padrão do [capítulo I.5](i-5-visualizacao-storytelling.md), onde Playfair inventa a barra por falta de dados, e do [capítulo III.1](iii-1-neuronio-artificial.md), onde o neurônio nasce sem aprendizado porque não havia como treinar: **restrição material gera forma nova**, e a forma sobrevive à restrição que a criou.

**O nome.** *Online Analytical Processing* (OLAP) é cunhado no relatório de **1993** de **E. F. Codd, S. B. Codd e C. T. Salley**, *"Providing OLAP to User-Analysts: An IT Mandate"*, que também lista **12 regras** para o que seria um produto OLAP legítimo. Codd é o mesmo Codd do modelo relacional — o que dá ao documento uma autoridade imediata.

### O episódio que convém não omitir

E aqui entra a parte incômoda, com o cuidado que ela exige.

**A versão corrente é que** o relatório que cunhou "OLAP" foi **patrocinado pela Arbor Software**, fabricante do Essbase — um produto lançado no ano anterior —, e que as 12 regras coincidiam notavelmente com as características desse produto. **Conta-se também que** o patrocínio não estava declarado no documento, que a *Computerworld* apurou o caso, e que o artigo acabou retirado.

**Registre o estatuto disto:** é uma acusação de conduta envolvendo pessoas reais, e **a fonte primária não foi conferida** — o material da *Computerworld* da época não foi aberto para escrever este capítulo. O que existe aqui é um relato repetido de forma consistente em fontes secundárias. Por isso o selo é ⏳, e por isso o texto diz "a versão corrente é que", nunca "aconteceu que". A diferença entre essas duas formas é o capítulo inteiro em matéria de método. O que se sabe com segurança é o resto: Codd seguiu reconhecido como o pai do modelo relacional, e a categoria OLAP permaneceu — e prosperou por três décadas.

**Por que não omitir.** Porque ensina uma coisa que nenhum tutorial ensina: **categorias de tecnologia às vezes nascem de marketing, não de necessidade técnica.** Antes de aceitar que uma categoria é natural — *data lakehouse*, *feature store*, *vector database* —, pergunte de onde ela veio e quem se beneficia de ela existir. É a lição de ceticismo mais barata deste livro, e a única que você vai usar em toda contratação de ferramenta pelo resto da carreira. Note o detalhe fino: a técnica do cubo era **boa e resolvia um problema real** — o que está em causa é a *embalagem*, não a *engenharia*. As duas coisas podem ser julgadas em separado.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | O relatório de 1993 de E. F. Codd, S. B. Codd e C. T. Salley, *"Providing OLAP to User-Analysts: An IT Mandate"*, como origem do termo OLAP e das 12 regras — **metadados conferidos, relatório não lido** |
| ⏳ | O patrocínio da Arbor Software (fabricante do Essbase, lançado no ano anterior), a coincidência entre as 12 regras e o produto, o patrocínio não declarado, a apuração da *Computerworld* e a retirada do artigo — **relato consistente em fontes secundárias; a primária não foi aberta** |
| ⏳ | Que a prática anterior fosse SQL com muitos `GROUP BY` sobre o transacional, reescrito a cada pergunta nova |
| ⏳ | A virada do cubo — dimensões, medidas, agregação pré-computada e navegação por drill-down / roll-up / slice / dice |
| 📖 | A leitura de que "trocar espaço e frescor por tempo de resposta é uma decisão de projeto", e o paralelo com os capítulos III.1 e 22 (restrição material gera forma nova) |
| 📖 | A lição extraída do episódio: perguntar de onde veio a categoria antes de aceitá-la como natural — e julgar embalagem e engenharia em separado |
| 📖 | A leitura de que o cubo pré-computado perdeu terreno para a consulta direta em armazenamento colunar |

## Fundamentos: fato, dimensão e grão

O vocabulário é curto e faz todo o trabalho.

**Fato** é o que aconteceu e se mede: uma venda, um atendimento, um clique. A tabela-fato guarda as **medidas** (valor, quantidade) e as chaves que apontam para os eixos. Ela é comprida e estreita — milhões de linhas, poucas colunas.

**Dimensão** é o eixo pelo qual se corta o fato: produto, cliente, loja, tempo. A tabela-dimensão é curta e larga — poucas linhas, muitos atributos descritivos (nome, categoria, marca, região, gerente). É por ela que vêm os rótulos dos relatórios. O teste rápido: **se você somaria a coluna, é medida; se você agruparia por ela, é dimensão.**

**Grão** (granularidade) é a pergunta mais cara do projeto: *o que é uma linha da tabela-fato?* Uma venda? Um item de venda? O total de um produto por loja por dia? O grão define o teto do detalhe — **você sempre pode agregar para cima, nunca desagregar para baixo**. Escolher grão grosso porque "ninguém vai precisar do detalhe" é a decisão que se paga um ano depois, quando alguém precisa.

### Estrela e floco de neve

No **esquema estrela**, a tabela-fato fica no centro e cada dimensão é **uma única tabela desnormalizada** ao redor. A dimensão Produto carrega produto, subcategoria, categoria e departamento na mesma linha — texto repetido milhares de vezes.

No **floco de neve**, cada dimensão é normalizada em várias tabelas (Produto → Subcategoria → Categoria), sem repetição.

O floco é mais "correto" segundo a terceira forma normal. E a estrela quase sempre vence, por três razões: menos `JOIN` por consulta, um modelo que um analista de negócio consegue ler sozinho, e a percepção de que **a redundância aqui é barata** — a dimensão é pequena, e o que ela repete é texto, não a fonte da verdade. A normalização existe para proteger a **escrita** de anomalias; no repositório analítico, a escrita é uma carga controlada, feita por um processo só, em janela conhecida (ver [capítulo I.2](i-2-coleta-integracao.md)). A anomalia que a 3NF previne simplesmente não tem por onde entrar. **Desnormalizar aqui não é relaxar o rigor: é aplicá-lo a um problema diferente.**

:::exercicio {"id":"analise-multidimensional-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Você modela as vendas de uma rede de farmácias. A base tem: `valor_do_item`, `quantidade`, `nome_do_produto`, `categoria_do_produto`, `cidade_da_loja`, `data_da_venda`, `desconto_concedido`. Qual conjunto pertence à **tabela-fato**, no grão "um item de venda"?

- [ ] `nome_do_produto`, `categoria_do_produto`, `cidade_da_loja` — são o que o relatório mostra.
- [x] `valor_do_item`, `quantidade`, `desconto_concedido` — mais as chaves para produto, loja e tempo.
- [ ] Todas as sete colunas, para evitar `JOIN` e deixar a consulta mais rápida.
- [ ] `data_da_venda` e `cidade_da_loja`, porque toda análise começa por tempo e lugar.

> **gabarito:** As medidas (`valor_do_item`, `quantidade`, `desconto_concedido`) mais as chaves de dimensão
> **porque:** Vale o teste: você **somaria** valor, quantidade e desconto — são medidas, e medida mora no fato. Você **agruparia por** nome de produto, categoria e cidade — são atributos descritivos, e atributo descritivo mora na dimensão.
>
> A primeira e a última alternativas invertem os papéis: confundem "o que aparece no relatório" com "o que é medido" — o rótulo vem da dimensão justamente para que você possa trocá-lo (produto → categoria) sem tocar no fato. A terceira é o erro mais interessante, porque tem um argumento verdadeiro dentro: `JOIN` custa, e desnormalizar acelera. Só que jogar tudo no fato multiplica o texto por **milhões** de linhas, não pelas poucas centenas da dimensão — e, pior, tira do modelo o lugar onde a hierarquia produto → categoria fica declarada. Sem esse lugar, não existe roll-up: você volta a reescrever a consulta a cada pergunta.
> **volte para:** #fundamentos-fato-dimensao-e-grao
:::

## As cinco operações

Modelado o cubo, a análise vira navegação — e são só cinco movimentos:

| Operação | O que faz | Exemplo |
|---|---|---|
| **drill-down** | desce um nível na hierarquia de uma dimensão | trimestre → mês |
| **roll-up** | sobe um nível, agregando | produto → categoria |
| **slice** | fixa **um** valor de **uma** dimensão | só o mês de março |
| **dice** | filtra **várias** dimensões por **vários** valores | março e abril, no Sul e Sudeste, em duas categorias |
| **pivot** | gira os eixos, trocando o que é linha e o que é coluna | região nas linhas ↔ região nas colunas |

Repare no que mudou em relação ao SQL do início do capítulo: as cinco operações são **fechadas** — a saída de qualquer uma é outro cubo, pronto para receber a próxima. É por isso que a reunião flui. O analista não escreve nada; ele clica, e cada clique é uma dessas cinco coisas.

### Por que muito cubo virou consulta direta

Uma nota de leitura editorial (📖), para você não sair daqui achando que precisa construir um cubo: **o cubo pré-computado perdeu bastante terreno.** Quando o armazenamento **colunar** e o processamento distribuído ficaram baratos, varrer bilhões de linhas na hora deixou de ser proibitivo — e a agregação prévia passou a custar mais do que rende, em espaço, em manutenção e em atraso do dado. O que **não** perdeu terreno é a parte que interessa: fato, dimensão, grão, hierarquia e as cinco operações continuam sendo o vocabulário da análise, mesmo quando a resposta é calculada na hora. A implementação envelheceu; o modelo, não.

:::exercicio {"id":"analise-multidimensional-e2","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Um cubo de vendas tem três dimensões, no grão mais fino: **Produto** (40 produtos, agrupados em 8 categorias), **Região** (5 regiões) e **Tempo** (12 meses).

Partindo do cubo completo, você aplica um **slice** em Tempo = março e, em seguida, um **roll-up** de produto para categoria. Quantas células tem o cubo resultante?

> **gabarito:** 40 ± 0
> **porque:** O cubo completo tem 40 × 5 × 12 = **2 400** células. O **slice** fixa um valor de uma dimensão (março), sobrando 40 × 5 = **200**. O **roll-up** sobe Produto de 40 itens para 8 categorias: 8 × 5 = **40** células.
>
> Dois erros comuns valem a atenção. O primeiro é achar que o roll-up **descarta** dado: ele não descarta, ele **agrega** — a receita das 40 células vira a receita das 8, e a soma total continua a mesma. O segundo é confundir slice com dice: se em vez de "março" você tivesse pedido "março e abril, no Sul e no Sudeste", seria um **dice**, e o resultado seria 8 × 2 × 2 = 32. E note o que o número mostra: você saiu de 2 400 células para 40 sem escrever consulta nova — foi exatamente isso que a arquitetura comprou.
> **volte para:** #as-cinco-operacoes
:::

## Nem toda medida pode ser somada

Este é o detalhe que separa quem entendeu o modelo de quem decorou o desenho. Medidas se dividem em três tipos:

**Aditivas** — somam em **todas** as dimensões. Receita, quantidade vendida, custo. É o caso confortável, e o que todo mundo assume por padrão.

**Semi-aditivas** — somam em **algumas** dimensões e não em outras. O exemplo clássico é **estoque**: somar o estoque de um produto **ao longo das lojas** faz todo sentido (é o estoque da rede); somar o estoque **ao longo do tempo** não significa nada — janeiro tinha 100 unidades, fevereiro tinha 100 unidades, e "200" não descreve coisa nenhuma. Ao longo do tempo, o que faz sentido é o **último valor** ou a **média**. Saldo bancário e número de assinantes ativos têm exatamente o mesmo comportamento.

**Não aditivas** — não somam em dimensão nenhuma. Razões e percentuais: a margem média de duas lojas não é a soma das margens, nem a média simples delas. A regra é guardar no fato os **componentes** (receita e custo) e calcular a razão **depois** da agregação, no nível pedido.

Um painel que soma coluna semi-aditiva ao longo do tempo é um dos erros mais silenciosos do BI: ninguém vê erro de execução, o total simplesmente cresce mês a mês, e a empresa acredita ter um estoque que nunca teve.

### Do cubo ao modelo

O cubo responde "o que aconteceu"; o modelo preditivo responde "o que vai acontecer" — e os dois consomem o **mesmo** trabalho de base. A tabela que um modelo consome é, quase sempre, um cubo **achatado num grão escolhido**: uma linha por entidade-e-instante, medidas agregadas em janelas (receita nos últimos 30 dias, número de compras no trimestre) e atributos vindos das dimensões. Duas armadilhas na travessia. A primeira: **o grão do cubo vira o grão do dataset**, e um grão grosso demais impede o modelo de existir. A segunda, e mais grave: agregar sem respeitar o **corte de tempo** é o vazamento do [capítulo I.3](i-3-dados.md) na forma mais fácil de cometer — se a janela de agregação inclui informação posterior ao instante da previsão, seu modelo tem um desempenho excelente e inútil.

:::exercicio {"id":"analise-multidimensional-e3","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Você propõe um esquema estrela para o repositório analítico. Um colega, DBA experiente, recusa: *"Isso viola a terceira forma normal. A categoria do produto vai estar repetida em milhares de linhas da dimensão. Se alguém renomear uma categoria, você tem anomalia de atualização. Normalize."*

Escreva a resposta que você daria a ele — reconhecendo o que ele tem de razão.

> **rubrica:** reconhece que a crítica é tecnicamente correta quanto à 3NF e que a redundância existe de fato;
> explica que a normalização protege a integridade da **escrita**, e que no repositório analítico a escrita é uma carga controlada, por um processo só, em janela conhecida — a anomalia de atualização não tem por onde entrar;
> aponta o ganho concreto da estrela: menos JOIN por consulta e um modelo legível por quem faz a pergunta;
> observa que a redundância é barata porque ocorre na **dimensão** (pequena), não no fato (milhões de linhas);
> trata o caso da renomeação de categoria como requisito a resolver no processo de carga (ou como dimensão que muda com o tempo), não como impedimento
> **porque:** A resposta fraca é "em BI a gente desnormaliza mesmo" — que é obedecer a um costume, não justificar uma decisão, e é exatamente o que o objetivo O3 cobra. A resposta forte começa **concedendo**: ele está certo sobre a 3NF, e a redundância é real.
>
> O argumento vem em seguida, e é sobre **qual problema cada regra resolve**. A 3NF é uma defesa contra anomalias de atualização em ambiente de escrita concorrente e imprevisível — o transacional. O repositório analítico não é esse ambiente: nele a escrita é um processo de carga único, versionado, testado e executado em janela conhecida ([capítulo I.2](i-2-coleta-integracao.md)). Retirar uma defesa contra um ataque que não existe naquele perímetro não é descuido; é dimensionar a defesa ao risco.
>
> O caso da renomeação é onde a boa resposta se distingue da excelente: ele **não** é um contra-argumento, é um requisito — e um requisito interessante, porque muitas vezes você **não quer** propagar a mudança. Se um produto mudou de categoria em junho, reescrever a dimensão faz o relatório de janeiro mentir sobre janeiro. É o problema das *slowly changing dimensions*, e a resposta usual é guardar as duas versões com vigência, não normalizar. Fecha o caso a assimetria de tamanho: repetir "Medicamentos" em 800 linhas de uma dimensão custa quase nada; repeti-lo em 40 milhões de linhas do fato custaria — e por isso a estrela desnormaliza a dimensão, e só ela.
> **volte para:** #estrela-e-floco-de-neve
:::

## Síntese — o que levar

- O modelo relacional é ótimo para **transação** e desajeitado para a **pergunta gerencial**, que agrega em vários eixos ao mesmo tempo e muda a cada trinta segundos.
- **Fato** é o que se mede; **dimensão** é por onde se corta. Teste: somaria a coluna → medida; agruparia por ela → dimensão.
- O **grão** é a decisão mais cara. Agregar para cima sempre dá; desagregar para baixo, nunca.
- **Estrela** vence **floco de neve** quase sempre: menos `JOIN`, modelo legível, redundância barata porque acontece na dimensão. Desnormalizar aqui **não é relaxar o rigor** — a 3NF protege a escrita, e a escrita analítica é uma carga controlada.
- Cinco operações fechadas: **drill-down, roll-up, slice, dice, pivot**. A saída de cada uma é outro cubo, e é isso que faz a reunião fluir.
- **Nem toda medida soma.** Estoque soma entre lojas e não soma ao longo do tempo; razão não soma em lugar nenhum — guarde os componentes, calcule depois.
- **Trocar espaço e frescor por tempo de resposta é decisão de projeto.** O cubo é essa troca virada arquitetura — o mesmo padrão da barra de Playfair ([I.5](i-5-visualizacao-storytelling.md)) e do neurônio sem aprendizado ([III.1](iii-1-neuronio-artificial.md)).
- O cubo **pré-computado** perdeu terreno para o colunar barato; o **vocabulário** do cubo não perdeu nada.
- A categoria "OLAP" nasceu com um episódio incômodo. **Pergunte de onde veio a categoria** antes de aceitá-la como natural — e julgue a embalagem separadamente da engenharia.

## Verificação

1. Escolha um sistema que você conhece e diga qual seria o **grão** da tabela-fato. Depois diga o que se perde ao subir um nível — e quem vai reclamar primeiro.
2. Dê um exemplo, do seu contexto, de medida **semi-aditiva**. Em quais dimensões ela soma, e o que se calcula naquela em que não soma?
3. O colega da farmácia diz que o cubo é dispensável porque "hoje o banco colunar aguenta". Em que ele tem razão, e o que continua valendo do modelo dimensional mesmo sem cubo pré-computado?
4. Você usaria as agregações do cubo como variáveis de um modelo preditivo ([capítulo I.4](i-4-analise-exploratoria.md) antes, [capítulo I.3](i-3-dados.md) como alerta). Que verificação você faria **antes**, para não vazar o futuro para dentro do passado?
