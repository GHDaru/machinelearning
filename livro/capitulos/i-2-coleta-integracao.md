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

Este é o capítulo menos glamouroso do livro e um dos que mais decidem o prazo do projeto. Ele cobre as fases 2 e 3 do ciclo do [capítulo I.1](i-1-ciclo-ciencia-de-dados.md) — entender e preparar os dados —, e o erro que previne não é de algoritmo: é acreditar que "trazer o dado" é uma tarefa de cópia. Não é. É uma tarefa de **reconciliação**, porque cada sistema tem a sua própria noção do que é um cliente, uma data e um valor ausente.

## De onde isto veio

**O aperto.** Anos 1980–90. Os dados da empresa viviam nos sistemas transacionais — o sistema do caixa, do estoque, da cobrança —, todos projetados para **registrar**, não para **perguntar**. Registrar exige gravar uma linha por vez, rápido e sem inconsistência. Perguntar exige varrer milhões de linhas de uma vez. Os dois disputavam a mesma máquina, e quando o gerente pedia o relatório do trimestre, a consulta pesada competia com a operação — e podia derrubá-la. O relatório do gerente travava a venda no caixa.

**O que se fazia antes.** Extraía-se o relatório direto do sistema de produção, em janela noturna. Funcionava enquanto a janela coubesse na noite e enquanto ninguém precisasse perguntar de dia.

**A virada.** Separar o repositório de **análise** do repositório de **operação** — e aceitar a redundância como preço da pergunta rápida. O mesmo fato passa a existir em dois lugares, com dois formatos, sob duas disciplinas diferentes. Copiar dado deixou de ser sintoma de projeto malfeito e virou decisão de arquitetura.

**A ideia reaproveitável.** **Otimizar para escrever e otimizar para ler são objetivos em conflito.** Quando os dois não cabem no mesmo lugar, duplicar com disciplina é mais barato que servir mal aos dois. O padrão reaparece longe daqui: réplica de leitura, cache, índice, view materializada, *feature store*. Todos são a mesma jogada — pagar em espaço e em sincronismo para comprar tempo de resposta.

**O nome.** **Bill Inmon** é chamado "pai do data warehouse"; *Building the Data Warehouse* é de 1992.

### O debate que não terminou

E aqui está a parte mais útil desta seção, justamente por não ter vencedor.

**Inmon** defende uma arquitetura *hub-and-spoke*: um warehouse central **normalizado**, fiel ao modelo corporativo, e *data marts* dependentes a jusante, montados a partir dele para cada área. **Ralph Kimball** defende a *bus matrix*: o warehouse **inteiro** em forma dimensional, feito de marts que se ligam por **dimensões conformadas** — a mesma dimensão "cliente", com a mesma chave e o mesmo significado, usada por todos.

Repare no que os dois **concordam**: modelagem dimensional serve, e é ela que faz o cubo do [capítulo II.6](ii-6-analise-multidimensional.md) responder rápido. A discordância é sobre **onde ela entra** — no fim do caminho ou desde a porta de entrada.

Na prática, quase todo warehouse grande é **híbrido**. E o híbrido não é o fracasso de um projeto que não escolheu lado: é o sedimento de decisões tomadas por equipes diferentes, em épocas diferentes, sob restrições diferentes — a que tinha prazo e fez o mart direto; a que herdou dez fontes e precisou de uma camada normalizada para conciliá-las. Quando você chegar a uma empresa e encontrar as duas coisas convivendo, a leitura correta não é "está errado", é "aqui houve história". Sua pergunta deve ser qual restrição produziu cada pedaço, e se ela ainda vale.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ⏳ | O aperto dos anos 1980–90: consulta analítica competindo com a carga transacional na mesma máquina, a ponto de degradar a operação |
| ⏳ | A prática anterior do relatório extraído da produção em janela noturna |
| ⏳ | A virada arquitetural — separar o repositório de análise do de operação, aceitando a redundância |
| ⏳ | Bill Inmon como "pai do data warehouse" e *Building the Data Warehouse* (1992) |
| ⏳ | O conteúdo das duas posições (Inmon *hub-and-spoke* com marts dependentes; Kimball *bus matrix* com dimensões conformadas) e o acordo dos dois quanto à utilidade da modelagem dimensional. **Apurado em fontes secundárias de qualidade desigual; nenhum dos dois livros foi aberto** |
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
> **porque:** No **ETL**, a transformação acontece **antes** da carga: chega ao repositório apenas o que já foi limpo, modelado e, muitas vezes, agregado — e o que ficou de fora não volta. No **ELT**, o bruto entra primeiro e as regras viram SQL dentro do repositório. A vantagem decisiva não é desempenho, é **reversibilidade**: quando a definição de "cliente ativo" mudar (e ela muda), você recalcula a partir do bruto em vez de pedir uma extração nova a um sistema que talvez nem exista mais. Não confunda a ordem com virtude: ELT sem catálogo, sem dono e sem controle de custo produz um repositório caro que ninguém confia.
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

## Verificação

1. Você precisa extrair 4 milhões de registros de uma API paginada que muda ao longo do dia, e a mesma entidade também existe num banco relacional de produção. Descreva como faria cada extração e o que garantiria que as duas descrevem o mesmo instante.
2. Uma diretora pergunta por que a empresa vai pagar por um data warehouse se "já existe o lake, e ele é mais barato". Responda em termos de custo por byte e custo por pergunta, com um exemplo de cada.
3. Um colega diz que o pipeline dele está correto porque "roda todo dia sem erro há seis meses". Que três perguntas você faz antes de confiar nos dados que ele entrega?
