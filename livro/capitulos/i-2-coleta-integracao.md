# I.2 — Coleta e Integração

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Extrair dados de arquivos, APIs, bancos relacionais e não relacionais.
- **O2.** Comparar data lake e data warehouse quanto a propósito e custo.
- **O3.** Aplicar ETL e explicar quando ELT é preferível.
- **O4.** Avaliar a licença e a procedência de uma base pública antes de usá-la.

## O problema: o mesmo cliente, três vezes

Uma rede de varejo pede um modelo de recompra. A equipe precisa de uma linha por cliente, e o cliente está em três lugares: no CRM (cadastro comercial), no faturamento e no aplicativo da loja. Ninguém tem a mesma chave. No CRM ele é `João Silva`; no faturamento, `SILVA, J.`; no aplicativo, só um CPF e um e-mail.

A equipe faz o que parece óbvio: junta por nome. O resultado sai em duas horas e parece bom. Semanas depois alguém descobre que 12% da base virou dois clientes diferentes, e um punhado de homônimos virou um cliente só — com o histórico de compras de duas pessoas somado. O modelo aprendeu de um mundo que não existe.

Este é o capítulo menos glamouroso do livro e um dos que mais decidem o prazo do projeto. Ele cobre as fases 2 e 3 do ciclo do [capítulo I.1](i-1-ciclo-ciencia-de-dados.md), entender e preparar os dados, e o erro que previne não é de algoritmo: é acreditar que "trazer o dado" é uma tarefa de cópia. Não é. É uma tarefa de **reconciliação**, porque cada sistema tem a sua própria noção do que é um cliente, uma data e um valor ausente.

## De onde isto veio

**O aperto.** Anos 1980–90. Os dados da empresa viviam nos sistemas transacionais (o do caixa, o do estoque, o da cobrança), todos projetados para **registrar**, não para **perguntar**. Registrar exige gravar uma linha por vez, rápido e sem inconsistência. Perguntar exige varrer milhões de linhas de uma vez. Os dois disputavam a mesma máquina, e quando o gerente pedia o relatório do trimestre, a consulta pesada competia com a operação — e podia derrubá-la. O relatório do gerente travava a venda no caixa.

**O que se fazia antes.** Extraía-se o relatório direto do sistema de produção, em janela noturna. Funcionava enquanto a janela coubesse na noite e enquanto ninguém precisasse perguntar de dia.

**A virada.** Separar o repositório de **análise** do repositório de **operação** — e aceitar a redundância como preço da pergunta rápida. O mesmo fato passa a existir em dois lugares, com dois formatos, sob duas disciplinas diferentes. Copiar dado deixou de ser sintoma de projeto malfeito e virou decisão de arquitetura.

**A ideia reaproveitável.** **Otimizar para escrever e otimizar para ler são objetivos em conflito.** Quando os dois não cabem no mesmo lugar, duplicar com disciplina é mais barato que servir mal aos dois. O padrão reaparece longe daqui: réplica de leitura, cache, índice, view materializada, *feature store*. Todos são a mesma jogada — pagar em espaço e em sincronismo para comprar tempo de resposta.

**O nome.** **Bill Inmon** é chamado "pai do data warehouse"; *Building the Data Warehouse* é de 1992.

### O debate que não terminou

E aqui está a parte mais útil desta seção, justamente por não ter vencedor.

**Inmon** defende uma arquitetura *hub-and-spoke*: um warehouse central normalizado, fiel ao modelo corporativo, e *data marts* dependentes a jusante, montados a partir dele para cada área.

**Kimball** defende a arquitetura de barramento, e este lado dá para citar da fonte. O Kimball Group a define como algo que *"decomposes the DW/BI planning process into manageable pieces by focusing on business processes, while delivering integration via standardized conformed dimensions that are reused across processes"*. A peça que costura tudo é a dimensão conformada, e a definição dela é mais estreita que a paráfrase habitual: *"Dimension tables conform when attributes in separate dimension tables have the same column names and domain contents."* São os mesmos nomes de coluna e o mesmo domínio de valores, e não apenas "a mesma ideia de cliente".

Repare no que os dois **concordam**: modelagem dimensional serve, e é ela que faz o cubo do [capítulo II.6](ii-6-analise-multidimensional.md) responder rápido. A discordância é sobre **onde ela entra** — no fim do caminho ou desde a porta de entrada.

Na prática, quase todo warehouse grande é **híbrido**. E o híbrido não é o fracasso de um projeto que não escolheu lado: é o sedimento de decisões tomadas por equipes diferentes, em épocas diferentes, sob restrições diferentes — a que tinha prazo e fez o mart direto; a que herdou dez fontes e precisou de uma camada normalizada para conciliá-las. Quando você chegar a uma empresa e encontrar as duas coisas convivendo, a leitura correta não é "está errado", é "aqui houve história". Sua pergunta deve ser qual restrição produziu cada pedaço, e se ela ainda vale.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ⏳ | O aperto dos anos 1980–90: consulta analítica competindo com a carga transacional na mesma máquina, a ponto de degradar a operação |
| ⏳ | A prática anterior do relatório extraído da produção em janela noturna |
| ⏳ | A virada arquitetural — separar o repositório de análise do de operação, aceitando a redundância |
| ✓ᵐ | *Building the Data Warehouse*, de **William H. Inmon**, Wiley, **1992**, e *The Data Warehouse Toolkit*, de **Ralph Kimball**, Wiley, **1996** — ficha das duas obras conferida em catálogo |
| ✓ | O lado **Kimball** da disputa, e os dois trechos citados entre aspas, nas páginas de técnicas do próprio [Kimball Group](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/enterprise-data-warehouse-bus-architecture/): a arquitetura de barramento e a definição de dimensão conformada |
| ⏳ | Bill Inmon como "pai do data warehouse". A atribuição é corrente e tem lastro documental (prêmio da DAMA International, 2002), mas **não foi conferida em primária** |
| ⏳ | O lado **Inmon** da disputa (*hub-and-spoke* com marts dependentes) e o acordo dos dois quanto à utilidade da modelagem dimensional. **Assimetria declarada:** o lado Kimball está citado do site dos próprios autores, e o lado Inmon continua apurado em fonte secundária, com nenhum dos dois livros aberto |
| 📖 | A ideia reaproveitável ("otimizar para escrever e otimizar para ler são objetivos em conflito") |
| 📖 | A leitura de que o warehouse híbrido é a norma e um sedimento de restrições, não um defeito de projeto |

## Fundamentos: as fontes e a ordem da transformação

Toda coleta começa escolhendo por onde o dado sai. Cinco portas cobrem quase tudo, e cada uma falha à sua maneira.

| Fonte | Como se lê | O que costuma doer |
|---|---|---|
| **Arquivo** (CSV, Excel, JSON, Parquet) | leitura direta | esquema implícito, codificação de caracteres, tudo vira texto — exceto no Parquet, que carrega tipo e colunas |
| **API** (*Application Programming Interface*) | requisições paginadas | limite de taxa, paginação e o dado **mudando entre uma página e a seguinte** |
| **Banco relacional** | SQL, de preferência numa réplica de leitura | consultar a produção é exatamente o pecado dos anos 1980 |
| **NoSQL** (documento, chave-valor, coluna, grafo) | busca por chave; o esquema mora na aplicação | o mesmo campo com dois formatos, porque duas versões do app escreveram nele |
| **Streaming** (fila ou tópico) | consumo contínuo por *offset* | entrega "ao menos uma vez" — ou seja, **duplicata é normal**, não é bug |

Escolhida a porta, resta a pergunta de ordem: transformar antes ou depois de gravar?

**ETL** (*Extract, Transform, Load*) transforma **antes** de carregar. Nasceu numa época em que armazenamento era caro: guardava-se apenas o que já estava limpo, modelado e agregado. O preço é irreversível — o que a transformação descartou não volta. Quando a regra de negócio muda, você precisa do dado bruto que jogou fora.

**ELT** (*Extract, Load, Transform*) carrega o bruto e transforma **dentro** do repositório, quase sempre em SQL. A ordem inverteu quando o armazenamento ficou barato e o motor analítico ficou forte: passou a ser mais barato guardar tudo e derivar depois do que decidir cedo o que interessa. O ganho real é poder **re-derivar** — mudou a regra, você recalcula a partir do bruto em vez de pedir uma nova extração. O preço é honesto e precisa ser dito: você paga para armazenar dado que ninguém pediu, e sem catálogo e sem dono ninguém sabe qual das dezessete tabelas `cliente` é a boa.

:::exercicio {"id":"coleta-integracao-e1","tipo":"completar","objetivo":"O3","dificuldade":"facil"}
Complete a sigla que nomeia a ordem adotada quando o armazenamento ficou barato — carregar o dado bruto primeiro e transformá-lo depois, dentro do próprio repositório analítico:

`Extract → Load → Transform = ______`

> **gabarito:** ELT|elt
> **porque:** No ETL, a transformação acontece antes da carga: chega ao repositório apenas o que já foi limpo, modelado e, muitas vezes, agregado, e o que ficou de fora não volta. No ELT, o bruto entra primeiro e as regras viram SQL dentro do repositório. A vantagem decisiva não é desempenho, é **reversibilidade**: quando a definição de "cliente ativo" mudar (e ela muda), você recalcula a partir do bruto em vez de pedir uma extração nova a um sistema que talvez nem exista mais. Não confunda a ordem com virtude: ELT sem catálogo, sem dono e sem controle de custo produz um repositório caro que ninguém confia.
> **volte para:** #fundamentos-as-fontes-e-a-ordem-da-transformacao
:::

:::exercicio {"id":"coleta-integracao-e5","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Um pipeline consome uma fila de eventos e grava cada mensagem recebida. Depois de uma semana, o faturamento consolidado está 3% acima do real. Qual característica da fonte explica isso?

- [ ] A fila perdeu mensagens, e o que sobrou ficou enviesado para cima.
- [x] A fila entrega "ao menos uma vez", então duplicata é comportamento normal, e não defeito.
- [ ] O esquema das mensagens mudou entre duas versões do aplicativo.
- [ ] O consumo por *offset* leu as mensagens fora de ordem.

> **gabarito:** entrega "ao menos uma vez", duplicata é normal
> **porque:** É a linha de streaming da tabela de fontes, e a palavra que decide é **normal**. A garantia usual de uma fila é entregar cada mensagem ao menos uma vez, o que significa que ela pode entregar duas. Um consumidor que grava tudo o que recebe vai contar algumas vendas duas vezes, e ninguém verá erro nenhum no log.
>
> As outras três descrevem falhas reais de outras fontes ou de outros momentos: perda de mensagem produziria total **abaixo** do real, esquema instável é a dor do NoSQL e do arquivo, e leitura fora de ordem afeta a sequência, não a contagem.
>
> A correção não é "consertar a fila", é assumir a duplicata no destino: gravar com `MERGE` por chave de negócio, ou sobrescrever a partição inteira do período. É a mesma ideia da idempotência, chegando pela porta da coleta.
> **volte para:** #fundamentos-as-fontes-e-a-ordem-da-transformacao
:::

:::exercicio {"id":"coleta-integracao-e6","tipo":"multipla-multi","objetivo":"O1","dificuldade":"media"}
Você vai extrair a mesma entidade de quatro portas diferentes. Quais pareamentos entre fonte e dor típica estão corretos? (marque todos que valem)

- [x] Arquivo CSV: o esquema é implícito, e a codificação de caracteres costuma ser descoberta pelo erro.
- [x] API paginada: o dado pode mudar entre uma página e a seguinte.
- [x] Banco relacional: consultar direto a produção é o pecado que a réplica de leitura existe para evitar.
- [ ] Parquet: como é arquivo, também entrega tudo como texto e sem tipo.
- [ ] NoSQL: o esquema é garantido pelo banco, o que elimina divergência de formato.

> **gabarito:** CSV com esquema implícito · API que muda entre páginas · produção consultada direto
> **porque:** As três corretas são a coluna "o que costuma doer" da tabela de fontes, e cada uma pede uma defesa diferente: declarar o esquema na leitura, fixar um cursor estável na paginação, e apontar a extração para uma réplica.
>
> As duas erradas invertem exatamente a exceção de cada linha. O Parquet é o arquivo que **carrega** tipo e colunas, e é por isso que ele aparece destacado na tabela. E no NoSQL o esquema mora na aplicação, não no banco — daí o sintoma clássico de o mesmo campo ter dois formatos, porque duas versões do aplicativo escreveram nele.
> **volte para:** #fundamentos-as-fontes-e-a-ordem-da-transformacao
:::

:::exercicio {"id":"coleta-integracao-e9","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Uma empresa usa ETL há oito anos: o pipeline calcula "cliente ativo" na transformação e carrega apenas o resultado. A definição de cliente ativo acaba de mudar. O que essa arquitetura torna caro?

- [ ] Recalcular a métrica, porque o SQL do warehouse é lento para agregações históricas.
- [x] Recompor a série histórica, porque o dado bruto que permitiria recalcular não foi guardado.
- [ ] Publicar a nova definição, porque o catálogo precisa ser reescrito.
- [ ] Nada relevante: basta trocar a regra no pipeline e seguir.

> **gabarito:** recompor a série histórica
> **porque:** O preço do ETL é o descarte, e ele é irreversível. O que a transformação jogou fora antes da carga não está em lugar nenhum do repositório, então a nova definição só vale daqui para a frente — e comparar o antes com o depois exige uma extração nova, de um sistema de origem que talvez nem guarde mais aquele período.
>
> A última alternativa é a que a equipe costuma acreditar no primeiro dia: trocar a regra no pipeline de fato é fácil. O custo aparece na primeira reunião em que alguém pede a série dos últimos três anos sob o critério novo.
>
> É esta a vantagem que o ELT compra, e ela não é desempenho: é **reversibilidade**. Guardar o bruto custa armazenamento e disciplina de catálogo, e paga justamente no dia em que a regra de negócio muda, que é o dia que sempre chega.
> **volte para:** #fundamentos-as-fontes-e-a-ordem-da-transformacao
:::

:::exercicio {"id":"coleta-integracao-e10","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
Um time migrou tudo para ELT há dois anos: o bruto entra sem transformação e as regras viram SQL no repositório. Hoje existem dezessete tabelas chamadas alguma variação de `cliente`, a fatura mensal triplicou e os analistas conferem números entre si antes de reportar. O que esse quadro demonstra?

- [ ] Que o ELT foi implementado errado, e o correto seria voltar ao ETL.
- [x] Que o ELT troca o custo do descarte pelo custo de governança, e esse segundo custo foi ignorado.
- [ ] Que o volume cresceu além do que o repositório suporta, e falta particionamento.
- [ ] Que a equipe deveria transformar antes da carga apenas nas tabelas mais consultadas.

> **gabarito:** trocou o custo do descarte pelo de governança, e ignorou o segundo
> **porque:** Os três sintomas do enunciado são exatamente o preço declarado do ELT: paga-se para armazenar dado que ninguém pediu, e sem catálogo e sem dono ninguém sabe qual das dezessete tabelas `cliente` é a boa. A arquitetura não falhou; a metade não técnica dela nunca foi feita.
>
> A primeira alternativa é a reação comum e troca um problema por outro pior: voltar ao ETL resolve a fatura e restaura o descarte irreversível, que foi o motivo da migração. A quarta parece um meio-termo sensato e não toca em nenhum dos três sintomas, porque o problema não é onde a transformação roda, é ninguém responder pelo significado das tabelas.
>
> A leitura que fica vale além deste capítulo: quando uma decisão de arquitetura tem um preço declarado, não pagá-lo não cancela o preço — apenas o transfere para quem vai usar o sistema.
> **volte para:** #fundamentos-as-fontes-e-a-ordem-da-transformacao
:::

## Onde o dado descansa: lake, warehouse, lakehouse

Os três guardam dados, e a diferença que importa é **quando o esquema é cobrado**.

| Repositório | O que aceita | Quando cobra o esquema | Perfil de custo |
|---|---|---|---|
| **Data warehouse** | dado modelado, tabular | na **escrita** — nada entra fora do formato | caro por byte, barato por pergunta |
| **Data lake** | qualquer arquivo, inclusive semiestruturado | na **leitura** — quem consulta interpreta | barato por byte, caro por pergunta |
| **Lakehouse** | arquivos, com uma camada transacional por cima | na leitura, mas **sob contrato** (esquema versionado, transação, histórico) | promete os dois; paga-se na camada de metadados e na disciplina |

O warehouse cobra caro na entrada e devolve confiança: se a linha entrou, ela está no formato combinado. O lake cobra barato na entrada e transfere o problema para quem lê — e é exatamente por isso que um lake sem catálogo vira o pântano de que todo mundo fala: não é o volume que o mata, é a **ausência de quem responda pelo significado de cada arquivo**. O lakehouse é a tentativa de ficar com os dois: arquivos abertos e baratos, mais uma camada de tabela que garante transação, evolução de esquema e viagem no tempo. Ele não elimina a decisão — apenas move o custo para a governança.

:::exercicio {"id":"coleta-integracao-e2","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Uma equipe precisa de duas coisas ao mesmo tempo: guardar cinco anos de eventos brutos de clique (JSON, com o esquema mudando a cada release do aplicativo) e servir trinta relatórios fixos ao financeiro, todo dia às 7h. Qual arranjo atende melhor?

- [ ] Só warehouse: modelar os eventos de clique no esquema dimensional já na entrada.
- [x] Eventos brutos no lake (esquema na leitura) e tabelas modeladas no warehouse para os relatórios, com um catálogo ligando as duas pontas.
- [ ] Só lake: byte é barato e hoje se roda SQL direto sobre os arquivos.
- [ ] Nem um nem outro: basta uma réplica de leitura do banco transacional.

> **gabarito:** Lake para o bruto, warehouse para o relatório, catálogo ligando os dois
> **porque:** As duas necessidades têm perfis de custo **opostos**, e é isso que o exercício testa. O evento de clique tem esquema instável e valor por byte baixíssimo — exigir modelagem na escrita significaria remodelar a cada release e descartar campos novos que ninguém pediu ainda. O relatório do financeiro é o inverso: mesma pergunta, todo dia, no horário — aí compensa pagar caro na entrada para ler barato depois.
>
> Por que as outras erram: "só warehouse" transforma cada mudança do app em migração de esquema. "Só lake" ignora que barato **por byte** não é barato **por pergunta** — trinta relatórios diários varrendo JSON bruto custam mais em processamento do que a modelagem que se evitou, e o lake sem catálogo perde o significado dos arquivos em poucos meses. A réplica de leitura resolve só o problema dos anos 1980 (não derrubar a operação); ela não guarda histórico que a produção já apagou nem entrega o dado modelado.
> **volte para:** #onde-o-dado-descansa-lake-warehouse-lakehouse
:::

:::exercicio {"id":"coleta-integracao-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Qual é a diferença que separa data warehouse de data lake, segundo esta seção?

- [ ] O volume que cada um aguenta.
- [x] O momento em que o esquema é cobrado: na escrita no warehouse, na leitura no lake.
- [ ] O formato dos arquivos: o warehouse usa Parquet e o lake usa JSON.
- [ ] A tecnologia de consulta: o warehouse usa SQL e o lake não.

> **gabarito:** o momento em que o esquema é cobrado
> **porque:** É a pergunta que organiza a tabela inteira, e dela decorrem as outras diferenças. Cobrar o esquema na escrita significa que nada entra fora do formato combinado, e é isso que o warehouse vende: se a linha entrou, ela está no formato. Cobrar na leitura significa aceitar qualquer arquivo e transferir a interpretação para quem consulta.
>
> O perfil de custo é consequência disso, não causa: caro por byte e barato por pergunta de um lado, o inverso do outro. As outras alternativas descrevem escolhas de implementação que variam de produto para produto, e nenhuma delas é o critério.
> **volte para:** #onde-o-dado-descansa-lake-warehouse-lakehouse
:::

:::exercicio {"id":"coleta-integracao-e8","tipo":"multipla-multi","objetivo":"O2","dificuldade":"dificil"}
Um fornecedor apresenta o lakehouse como "o fim da escolha entre lake e warehouse". Quais afirmações desta seção qualificam essa promessa? (marque todas que valem)

- [x] O lakehouse cobra o esquema na leitura, mas sob contrato: esquema versionado, transação e histórico.
- [x] Ele não elimina a decisão, apenas move o custo para a governança.
- [ ] Ele cobra o esquema na escrita, como o warehouse, e por isso dá a mesma garantia.
- [x] A camada de metadados e a disciplina que ela exige são onde o custo aparece.
- [ ] Ele torna o catálogo desnecessário, porque o histórico das tabelas substitui a documentação.

> **gabarito:** leitura sob contrato · move o custo para governança · o preço está na camada de metadados
> **porque:** As três corretas são a linha do lakehouse lida com atenção. "Sob contrato" é a expressão-chave: a cobrança continua sendo na leitura, mas com garantias que o lake cru não dá, e essas garantias têm um preço em metadados e disciplina.
>
> As duas erradas são as duas leituras otimistas que o discurso comercial estimula. Cobrar na escrita seria virar warehouse, e aí o custo por byte voltaria. E histórico de tabela é um registro do que mudou, não do que cada arquivo significa nem de quem responde por ele — que é justamente o serviço do catálogo, e a ausência dele é o que transforma lake em pântano.
>
> A leitura útil não é que o lakehouse seja fraco: é que toda arquitetura que promete os dois lados está movendo o custo, não o eliminando, e a pergunta a fazer é sempre para onde ele foi.
> **volte para:** #onde-o-dado-descansa-lake-warehouse-lakehouse
:::

## Integrar é mais difícil que extrair

Extrair é engenharia; integrar é semântica. Três problemas aparecem em todo projeto.

**Uma entidade, várias chaves.** O `João Silva` do início do capítulo. Quando existe uma chave forte compartilhada (CPF, CNPJ, número do contrato), use-a e acabou. Quando não existe, o casamento é **probabilístico**: normalize o texto, compare nome, data de nascimento e endereço, calcule uma pontuação de similaridade e escolha um limiar. E esse limiar não é técnico — limiar alto deixa duplicata na base, limiar baixo funde duas pessoas. Decida com quem paga a conta do erro, e **registre a regra**, porque em seis meses ninguém lembra por que dois cadastros viraram um.

**Granularidade, e o que se perde ao agregar cedo.** O grão é o fato mais fino que a tabela guarda: um item de um pedido, ou o total do dia por loja. Agregar é irreversível — quem guardou só o total diário por loja não consegue mais responder quais produtos são comprados juntos, nem qual foi o efeito de uma promoção sobre um item. A regra prática: **guarde no grão mais fino que couber no orçamento**; agregar depois é uma consulta, desagregar depois é uma coleta nova. É o mesmo grão que o cubo do [capítulo II.6](ii-6-analise-multidimensional.md) vai fatiar.

**Idempotência e reprocessamento.** Todo pipeline roda de novo — a fonte chegou atrasada, o job caiu no meio, alguém corrigiu o arquivo de ontem. Rodar duas vezes tem de produzir o mesmo estado que rodar uma. `INSERT` puro não é idempotente: reprocessar duplica o faturamento. As duas formas baratas de conseguir isso são `MERGE` por chave de negócio e **sobrescrita da partição inteira** do período reprocessado. Sem isso, o pipeline só é confiável enquanto nunca falhar — e a fila de streaming, que entrega "ao menos uma vez", garante que ele vai falhar. Monitorar essa reexecução é assunto do [capítulo V.3](v-3-mlops.md).

### De onde veio este dado, e quem o produziu?

É a pergunta que abre o [capítulo I.3](i-3-dados.md), e é aqui que ela nasce — porque o vazamento mais comum de todos não vem de um erro de modelagem: vem de **juntar tabelas sem respeitar o tempo**.

Uma tabela de dimensão que é atualizada no lugar (sem histórico) carrega sempre o estado de **hoje**. Um `JOIN` sem recorte temporal cola esse estado de hoje em um fato de doze meses atrás — e o modelo passa a ver, no momento da compra, uma informação que só existiu depois dela. O sintoma é sempre o mesmo: métrica excelente no teste, desempenho medíocre em produção. Por isso a procedência não é burocracia de licença — embora a licença também importe, e nenhuma base pública deva ser usada sem ler a sua. De cada coluna que entra no seu conjunto de treino, saiba responder: **quem a produz, com que frequência, e ela é sobrescrita ou versionada?** Se você não sabe, você não sabe em que instante ela passou a valer.

:::exercicio {"id":"coleta-integracao-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"dificil"}
Você monta o conjunto de treino de um modelo que prevê **inadimplência no momento da compra**. Os pedidos de 2025 estão no data warehouse; o cadastro vem de outro sistema, e a tabela `clientes` é sincronizada todas as noites **sobrescrevendo** a linha do cliente.

```sql
SELECT p.pedido_id, p.data_pedido, p.valor,
       c.score_risco, c.situacao_cadastral
FROM   pedidos p
JOIN   clientes c ON c.cliente_id = p.cliente_id
WHERE  p.data_pedido BETWEEN '2025-01-01' AND '2025-12-31';
```

O modelo treinado com essa tabela alcança desempenho muito acima do esperado. Explique o que está errado e o que você faria.

> **rubrica:** identifica que `clientes` é sobrescrita e portanto o JOIN traz o estado de **hoje** para uma linha de 2025;
> reconhece que `score_risco` e `situacao_cadastral` foram produzidos **depois** do momento da decisão que o modelo deve apoiar;
> nomeia isso como vazamento e liga o desempenho alto no teste à queda esperada em produção;
> propõe ao menos uma correção concreta — dimensão versionada com validade (início/fim), snapshot datado do cadastro, ou recomputar o atributo com corte no tempo do pedido;
> faz a pergunta de procedência sobre as colunas: quem as produz, com que frequência e se são sobrescritas
> **porque:** O `JOIN` está sintaticamente correto e semanticamente errado. O `WHERE` recorta os **pedidos** no tempo, mas nada recorta o **cadastro**: cada linha de 2025 recebe o cliente como ele está agora. Um cliente que ficou inadimplente em novembro aparece como inadimplente também na compra de janeiro — o rótulo entrou disfarçado de atributo. É o vazamento do [capítulo I.3](i-3-dados.md) na sua forma mais comum, e ele não nasce da modelagem: nasce da integração.
>
> O desempenho "muito acima do esperado" é o sinal, e vale como regra de ofício: **resultado bom demais é hipótese de vazamento até prova em contrário** — vá conferir a origem das colunas antes de comemorar.
>
> A correção estrutural é dar tempo à dimensão: guardar cada versão do cadastro com validade (`valido_de`, `valido_ate`) e juntar com `p.data_pedido BETWEEN c.valido_de AND c.valido_ate`. Onde isso não existe, sirva-se de snapshots datados do cadastro, ou recalcule o atributo a partir de eventos anteriores à data do pedido. E note o que a correção exige: alguém precisa ter decidido **guardar história** lá atrás. Por isso a pergunta de procedência é feita na coleta, não na modelagem — na modelagem já é tarde.
> **volte para:** #de-onde-veio-este-dado-e-quem-o-produziu
:::

:::exercicio {"id":"coleta-integracao-e11","tipo":"multipla-multi","objetivo":"O4","dificuldade":"facil"}
Antes de usar uma coluna no conjunto de treino, quais perguntas de procedência esta seção manda fazer? (marque todas que valem)

- [x] Quem produz esta coluna?
- [x] Com que frequência ela é atualizada?
- [x] Ela é sobrescrita ou versionada?
- [ ] Qual é a correlação dela com o alvo?
- [ ] Quantos valores faltantes ela tem?

> **gabarito:** quem produz · com que frequência · sobrescrita ou versionada
> **porque:** São as três perguntas do fim da seção, e as três respondem à mesma coisa: **em que instante esta coluna passou a valer**. Sem isso você não sabe se o valor que está na sua tabela existia no momento da decisão que o modelo deve apoiar.
>
> As duas erradas não são inúteis, são de outra etapa. Correlação com o alvo e contagem de faltantes são análise exploratória, e ambas serão altas e bonitas em uma coluna vazada — foi exatamente assim que o `score_risco` do exercício anterior pareceu um ótimo atributo. Perguntas de qualidade não detectam problema de procedência, porque uma coluna vazada é limpa, completa e preditiva.
>
> "Sobrescrita ou versionada" é a mais decisiva das três, e a que quase ninguém faz: uma dimensão sobrescrita carrega sempre o estado de hoje, e um `JOIN` sem recorte de tempo cola o hoje em um fato de doze meses atrás.
> **volte para:** #de-onde-veio-este-dado-e-quem-o-produziu
:::

:::exercicio {"id":"coleta-integracao-e12","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Uma equipe encontra uma base pública que resolveria o problema, com download aberto e sem cadastro. Segundo este capítulo, o que ela deve fazer antes de usá-la?

- [ ] Nada além de citar a fonte no relatório: download aberto implica uso livre.
- [x] Ler a licença da base, porque acesso aberto não determina sozinho o que se pode fazer com o dado.
- [ ] Confirmar apenas que o volume e o esquema atendem, já que a legalidade é assunto do jurídico.
- [ ] Republicar uma cópia no lake da empresa, para garantir que o link não caia.

> **gabarito:** ler a licença da base
> **porque:** Acesso e permissão são coisas diferentes. Um arquivo poder ser baixado sem cadastro diz respeito a como ele é distribuído, e não ao que a licença autoriza — uso comercial, redistribuição, obrigação de citar, exigência de manter a mesma licença em obras derivadas. O capítulo é explícito: nenhuma base pública deve ser usada sem ler a sua.
>
> A terceira alternativa terceiriza a pergunta e é a mais comum na prática. Ela falha porque a decisão que a licença condiciona é técnica: se o dado não pode alimentar um produto comercial, isso muda a arquitetura, não só o parecer.
>
> A quarta acerta um cuidado operacional real e o aplica antes de ter direito a ele. Republicar uma cópia é redistribuição, que é precisamente uma das coisas que a licença pode proibir.
>
> **Dívida declarada:** o tratamento de licença neste capítulo é mais curto do que o objetivo O4 promete, e o aprofundamento está registrado no ledger do ciclo.
> **volte para:** #de-onde-veio-este-dado-e-quem-o-produziu
:::

## Síntese — o que levar

- **Otimizar para escrever e otimizar para ler são objetivos em conflito.** O warehouse nasceu de aceitar isso e duplicar com disciplina.
- Inmon e Kimball discordam de **onde** a modelagem dimensional entra, não de que ela sirva. O warehouse híbrido é a norma, não o fracasso — leia-o como sedimento de restrições, e pergunte se cada uma ainda vale.
- Cada fonte falha à sua maneira: arquivo esconde esquema, API muda entre páginas, NoSQL guarda dois formatos no mesmo campo, streaming duplica por projeto.
- ETL transforma antes e **descarta**; ELT carrega o bruto e compra **reversibilidade** — pagando em armazenamento e em governança.
- Warehouse cobra esquema na escrita (caro por byte, barato por pergunta); lake cobra na leitura (o inverso); lakehouse tenta os dois e move o custo para a governança.
- Sem chave forte, integração é casamento probabilístico com **limiar** — e limiar é decisão de negócio, que se registra.
- **Guarde no grão mais fino que couber no orçamento.** Agregar depois é uma consulta; desagregar depois é uma coleta nova.
- Reprocessar é rotina, não exceção: `MERGE` por chave ou sobrescrita de partição, nunca `INSERT` puro.
- De cada coluna: **quem produz, quando, e é sobrescrita ou versionada?** Junção sem recorte de tempo é a fábrica número um de vazamento.

:::exercicio {"id":"coleta-integracao-e4","tipo":"aberta","objetivo":"O1","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Você precisa extrair 4 milhões de registros de uma API paginada **que muda ao longo do dia**, e a mesma entidade também existe num banco relacional de produção. Descreva como faria cada extração e, na parte que decide, **o que garantiria que as duas descrevem o mesmo instante**.

> **rubrica:** trata a paginação sobre base que se move: diz como evita registro repetido ou pulado quando a página 700 é lida depois de a base ter mudado (cursor estável, ordenação por chave imutável, ou releitura idempotente);
> descreve a extração relacional por um recorte declarado e repetível — um corte de tempo explícito, não "tudo o que está lá agora";
> nomeia um **instante de referência** único e diz como ele é fixado nas duas fontes (marca de tempo de corte, versão, ou snapshot), em vez de supor que "rodar as duas na mesma hora" basta;
> não trata o problema como de volume: 4 milhões de registros é fácil, e a resposta que só fala de lote, paralelismo ou memória não respondeu à pergunta
> **porque:** O número grande é a isca. Volume se resolve com paginação e paciência; o que quebra a integração é que **a fonte se move enquanto é lida** — quando você chega à última página, a primeira já não vale, e você produziu um retrato de nada: nem do começo, nem do fim.
>
> Daí a pergunta que importa não ser "como extrair", e sim "**a que instante este conjunto se refere?**". Sem essa resposta, a junção com o banco relacional cruza um cliente de hoje com um pedido de ontem e ninguém percebe, porque a contagem fecha e o pipeline não dá erro.
>
> É a mesma armadilha da última linha da síntese: junção sem recorte de tempo é a fábrica número um de vazamento. Aqui ela aparece antes do modelo, na coleta — e é mais barata de consertar aqui do que três capítulos adiante, quando o vazamento já virou uma métrica boa demais.
> **volte para:** #fundamentos-as-fontes-e-a-ordem-da-transformacao
:::

## Verificação

1. Uma diretora pergunta por que a empresa vai pagar por um data warehouse se "já existe o lake, e ele é mais barato". Responda em termos de custo por byte e custo por pergunta, com um exemplo de cada.
2. Um colega diz que o pipeline dele está correto porque "roda todo dia sem erro há seis meses". Que três perguntas você faz antes de confiar nos dados que ele entrega?

> Estas duas não são corrigidas, e a omissão é deliberada: as duas se ganham convencendo alguém, e a resposta certa depende de quem está do outro lado da mesa.
