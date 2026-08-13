# V.3 — MLOps

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Versionar dado, código e modelo de forma que um resultado seja reproduzível meses depois.
- **O2.** Implantar um modelo atrás de uma API com contrato e validação de entrada.
- **O3.** Distinguir drift de covariáveis de drift de conceito e detectar cada um.
- **O4.** Projetar um plano de rollback antes do deploy, e não durante o incidente.

## O problema: aprovado na validação, reprovado em produção

O modelo passou na validação. Foi para produção. Três semanas depois, o desempenho medido no mundo real é bem pior que o do relatório — e ninguém consegue explicar.

A tentação é reabrir o modelo. É quase sempre o lugar errado de procurar. **A causa costuma não estar no modelo**: está em dois intervalos que ninguém mediu. O intervalo entre **treinar e servir** — onde o atributo calculado de um jeito no notebook é calculado de outro jeito na API, o mesmo vazamento do [capítulo I.3](i-3-dados.md) reaparecendo com outro nome. E o intervalo entre **servir hoje e servir daqui a três meses** — onde o mundo muda e o modelo não sabe disso.

Este capítulo é a sequência direta do [capítulo V.2](v-2-sistemas-de-ml.md): lá, o diagnóstico de que o sistema é maior que o modelo; aqui, o procedimento para operá-lo.

## De onde isto veio

**O aperto.** Times de ML entregando modelos como quem entrega um relatório (a mão, um arquivo por vez) e descobrindo que o artefato entregue apodrece sozinho. 📖

**O que se fazia antes.** Entrega manual; retreino por calendário ou, na prática, por reclamação: alguém do negócio nota que "está estranho" e o time retreina. ⏳

**A virada.** Aplicar entrega contínua a um artefato que muda em **três eixos**, não em um: código, modelo e dado. É a tese declarada de Sato, Wider & Windheuser em *"Continuous Delivery for Machine Learning"* (martinfowler.com, 2019) ✓ᵐ — e a razão de o pipeline de entrega contínua tradicional não bastar. Um pipeline que só reage a commit não vê dois dos três eixos.

**A ideia reaproveitável.** **O que muda sozinho precisa ser testado sozinho.** Software comum se degrada quando alguém edita; **modelo se degrada quando ninguém edita.** A inversão é o coração do capítulo: se a degradação não é disparada por uma ação humana, nenhum gatilho humano vai detectá-la. 📖

### O nome que ninguém cunhou

Aqui está o achado mais desconfortável do capítulo — e ele é sobre o próprio nome da disciplina.

A versão repetida em dezenas de fontes de indústria é que **"MLOps foi cunhado no artigo de 2015 de Sculley et al."**. Extraímos o texto integral do artigo e buscamos: **a palavra "MLOps" não aparece nenhuma vez.** Também não aparecem "feature store" nem "training/serving skew". Selo ✓ — é uma **verificação negativa** feita sobre o texto primário, e verificação negativa é das mais fortes que existem: não depende de interpretação, só de leitura.

A filiação a DevOps, essa sim, está documentada: *"The first devopsdays was held in Ghent, Belgium in 2009"*, com **Patrick Debois** listado como fundador na página oficial ✓ᵃ. Já a história de a abreviação "#devops" ter nascido da necessidade de caber numa hashtag de Twitter é ⏳ — consistente entre fontes secundárias, sem primária.

> **A leitura (📖):** este é o **sexto caso** do padrão *"crédito segue o vocabulário"* que atravessa o livro — e o mais extremo. Nos cinco anteriores (Gauss × Legendre no cap. [II.2](ii-2-modelos-lineares.md), Linnainmaa × Rumelhart no [III.1](iii-1-neuronio-artificial.md), Harris × Firth no [I.6](i-6-representacao.md), o *double descent* no [0.2](../0-2-fundamentos.md) e o k-means com seis pretendentes no [IV.1](iv-1-nao-supervisionado.md)), o crédito foi para a pessoa errada.
>
> **Aqui o campo não tinha um autor para o nome e fabricou um retroativamente**, escolhendo o artigo mais citado da vizinhança. E a atribuição sobreviveu apesar de ser **falsificável em trinta segundos** por quem tivesse o PDF aberto e uma busca de texto.

**Concept drift tem nome desde 1986.** Schlimmer & Granger, então na Universidade da Califórnia em Irvine, publicam naquele ano dois trabalhos: *"Beyond incremental processing: Tracking concept drift"* (AAAI-86, pp. 502–507) e *"Incremental learning from noisy data"* (*Machine Learning* 1(3):317–354) ✓. O primeiro está aberto e define o termo já no resumo, entre parênteses, como quem apresenta vocabulário novo: *"drift (concepts that change over time)"*.

E o problema que eles enunciam continua sendo o problema de hoje, palavra por palavra. Quando um preditor aprendido erra, escrevem, o sistema *"must be able to determine whether this situation is an instance of noise or an indication that the concept is beginning to drift"*. Distinguir ruído de deriva é a mesma pergunta que um painel de monitoramento faz quarenta anos depois, e é por isso que a seção sobre alarmes, mais adiante, insiste que drift detectado não é veredito. O survey que organizou o campo é o de Gama, Žliobaitė, Bifet, Pechenizkiy & Bouchachia (*ACM Computing Surveys* 46(4), art. 44, 2014) ✓ᵐ. **De 1986 a 2014: vinte e oito anos entre o nome e a síntese.**

**E o procedimento veio rápido.** *The ML Test Score* (Breck, Cai, Nielsen, Salib & Sculley, IEEE Big Data 2017) traz **28 testes e necessidades de monitoramento** pontuados ✓ᵐ. Repare no subtítulo: *"…and Technical Debt Reduction"*. É explicitamente a continuação do [capítulo V.2](v-2-sistemas-de-ml.md): mesmo autor sênior, dois anos depois, transformando o diagnóstico em checklist. **Diagnóstico (2015) → procedimento (2017): dois anos.** Compare com as décadas do resto do livro — quando o diagnóstico é preciso *e* já existe infraestrutura, o procedimento chega rápido. É o mesmo fio dos capítulos [II.5](ii-5-arvores-ensembles.md) e [III.6](iii-6-modelos-de-fundacao.md).

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | "MLOps", "feature store" e "training/serving skew" **não aparecem** no artigo de Sculley et al. (2015) — texto integral extraído e buscado |
| ✓ᵃ | O primeiro devopsdays em Ghent, Bélgica, 2009, e Patrick Debois como fundador — página oficial do evento |
| ✓ᵐ | Sato, Wider & Windheuser, *Continuous Delivery for Machine Learning* (martinfowler.com, 2019), e a tese dos três eixos |
| ✓ | Breck, Cai, Nielsen, Salib & Sculley, *"The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction"*, **lido** no arquivo público de publicações do Google. O resumo diz literalmente *"we present 28 specific tests and monitoring needs"*, e os quatro grupos são Data, Model, Infra e Monitor, com sete testes cada. O veículo (IEEE Big Data, 2017) é ✓ᵐ: a cópia lida não traz a folha de rosto do evento |
| ✓ᵐ | Gama, Žliobaitė, Bifet, Pechenizkiy & Bouchachia, *ACM Computing Surveys* 46(4), art. 44, 2014 |
| ✓ | Schlimmer & Granger, *"Beyond incremental processing: Tracking concept drift"*, **AAAI-86, pp. 502–507**, Universidade da Califórnia em Irvine: título, autoria, veículo, a definição *"drift (concepts that change over time)"* e a formulação ruído-contra-deriva, do [PDF aberto dos anais](https://cdn.aaai.org/AAAI/1986/AAAI86-084.pdf), **lido** |
| ⏳ | Que o termo tenha sido **cunhado** ali. O artigo o usa no título e o apresenta no resumo como vocabulário novo, e a lista de referências dele não traz fonte anterior para o termo. Nada disso é prova de primazia: é ausência de contra-exemplo em um lugar só |
| ✓ᵐ | O segundo trabalho de 1986, *"Incremental learning from noisy data"*, *Machine Learning* 1(3):317–354. **Ficha conferida; não lido** |
| ⏳ | A origem da hashtag "#devops" no limite de caracteres do Twitter |
| 📖 | A leitura do "sexto caso" do padrão *crédito segue o vocabulário*, e a inversão "modelo se degrada quando ninguém edita" |

## Fundamentos: versionar, registrar, servir

**Versionar o quê.** Reproduzir um resultado meses depois exige cinco coisas, não uma: código, dado, modelo, configuração (hiperparâmetros, limiar, regras de negócio) e ambiente (versões de biblioteca). Faltando qualquer uma, o número do relatório não volta. Dado costuma ser versionado por *hash* de conteúdo, não por cópia — o que se guarda é a impressão digital que prova qual dado foi usado.

**Registro de modelos e linhagem.** Um registro de modelos responde a três perguntas em segundos: qual versão está em produção, **de qual dado e de qual código ela saiu**, e quem a promoveu. A pergunta da linhagem é a que salva auditoria e incidente. Um modelo sem linhagem é um binário anônimo: você pode desligá-lo, mas não pode explicá-lo.

**Servir.** *Qual* forma de serviço o sistema usa (lote, em linha ou por fluxo) é decisão de desenho, e ela foi tomada no [capítulo V.2](v-2-sistemas-de-ml.md), pelos quatro eixos do requisito. O que interessa aqui é operar a forma já escolhida, e ela mexe em tudo o que vem a seguir neste capítulo: em lote, uma promoção ruim é notada no próximo job e desfeita com um recálculo; em linha, ela atinge o usuário na próxima requisição, e o plano de rollback deixa de ser opcional.

### A fronteira do serviço: contrato e validação de entrada

O contrato de entrada do [capítulo V.2](v-2-sistemas-de-ml.md) foi declarado como diagnóstico: o compilador que não existe para dependência de dado. Aqui ele vira procedimento, executado a cada requisição.

Comece pelo fato que dispensa decisão: **o contrato existe de qualquer jeito.** O texto do *Continuous Delivery for Machine Learning* diz por quê:

> *"there is always an implicit contract between the model and its consumers. The model will usually expect input data in a certain shape, and if Data Scientists change that contract to require new input or add new features, you can cause integration issues and break the applications using it."*

Há sempre um contrato implícito entre o modelo e quem o consome. A escolha do time não é ter ou não ter contrato; é entre um contrato **escrito e verificado** e um contrato que só se revela no dia em que quebra.

**O que o contrato declara.** As mesmas quatro coisas do V.2, agora numa forma que a máquina lê: tipo, faixa aceitável, taxa de nulos tolerada e dono. É a definição de esquema, na formulação do TensorFlow Data Validation: *"The schema codifies properties which the input data is expected to satisfy, such as data types or categorical values"*.

**Onde a checagem mora.** Em duas camadas, e confundi-las é o erro comum. A camada **declarativa** verifica forma: campo presente, tipo certo, valor dentro do domínio. Ela é escrita uma vez, ao lado da definição da entrada. A camada **imperativa** verifica regra de negócio, e vive no manipulador da requisição, porque depende de estado que o esquema não conhece.

O serviço que atende este livro serve de exemplo, e é um exemplo que você pode abrir. Em `chat-companion/backend/app.py`, as linhas 130 a 173 declaram a camada de forma, um modelo por rota. Já a rota de tentativa de exercício, nas linhas 229 a 241, faz a camada de regra: exercício desconhecido, resposta vazia, resposta acima de 8000 caracteres e excesso de tentativas seguidas. Nenhuma dessas quatro é verificável olhando só o formato da requisição.

**O que fazer quando a entrada viola o contrato.** Aqui o capítulo não prescreve, porque nenhuma fonte prescreve. Existem três políticas, e o mesmo serviço deste livro usa as três em rotas diferentes:

| Política | O que faz | O que custa |
|---|---|---|
| **Rejeitar** | devolve erro e não prediz | quem chamou precisa saber tratar o erro |
| **Sanear** | corta, trunca ou normaliza e segue | o valor que entra no modelo não é o que o cliente mandou |
| **Ignorar** | aceita, não faz o trabalho e responde que não fez | o chamador pode não perceber que nada aconteceu |

A rota de tentativa rejeita. A rota de telemetria saneia o identificador e o corta em 80 caracteres. E ela também ignora, devolvendo `{"ok": False}` sem erro quando falta consentimento, o que ali é uma decisão de privacidade deliberada.

A regra que vale reter não é qual das três escolher, e sim que **a política é uma decisão escrita no contrato, e não um acidente da implementação**. Escolher é do projeto; escolher sem perceber que escolheu é o defeito. E há uma assimetria com fonte: a política silenciosa é a mais perigosa das três, porque é a que a regra #10 das *Rules of Machine Learning* chama de falha silenciosa, aquela em que *"the machine learning system will adjust, and behavior will continue to be reasonably good, decaying gradually"*.

**A rejeição é sinal, não só erro.** Um pico de entradas recusadas é a camada 2 do monitoramento funcionando na fronteira, e chega antes de qualquer métrica de desempenho. Para isso a recusa precisa ser contada, e não apenas devolvida.

Repare no que a literatura oferece e no que ela não oferece. O *ML Test Score* traz o teste "Data 1", que manda escrever as expectativas dos atributos num esquema (*"an adult human is surely between one and ten feet in height"*), e o "Monitor 2", que manda *"measure whether data matches the schema and alert when they diverge significantly"*. Note o verbo e o advérbio: **medir** e **divergir significativamente** são operações sobre um agregado, com limiar afinado entre falso positivo e falso negativo. O que fazer com a requisição da vez continua sem prescrição na fonte, e é por isso que a decisão é sua e precisa estar escrita.

Aqui o exemplo deste livro **falha**, e vale dizer em voz alta: o serviço não conta nenhuma rejeição. O que ele observa é só o sucesso, através das tentativas que foram gravadas. Um serviço de modelo em produção deveria contar as duas coisas, e a ausência dessa contagem é o tipo de dívida que só aparece no incidente.

**Versão do modelo endereçável.** A resposta diz qual versão do modelo respondeu, e a versão anterior continua servível. Sem isso, o canário não tem como comparar, e o rollback da seção seguinte não tem para onde voltar. É também o que torna auditável a resposta que alguém contestar seis meses depois.

**Registrar o que foi servido fecha o laço com o V.2.** A regra #29 é explícita sobre o método: *"The best way to make sure that you train like you serve is to save the set of features used at serving time, and then pipe those features to a log to use them at training time."* Guardar os atributos como foram servidos, e treinar a partir desse registro, elimina a divergência na origem. E a regra #37 diz o que fazer com isso: aplicar o modelo ao mesmo exemplo no treino e no serviço deve dar o mesmo resultado, e *"a discrepancy here probably indicates an engineering error"*.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | O contrato implícito entre o modelo e quem o consome, de *["Continuous Delivery for Machine Learning"](https://martinfowler.com/articles/cd4ml.html)*, seção *Model Serving* |
| ✓ | As regras **#10**, **#29** e **#37** de *[Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml)*, e os trechos citados, lidos no texto da regra |
| ✓ | O que um esquema codifica, do [guia do TensorFlow Data Validation](https://www.tensorflow.org/tfx/guide/tfdv) |
| ✓ | As três políticas convivendo num serviço real, com as linhas indicadas, em `chat-companion/backend/app.py` deste repositório |
| ✓ | *The ML Test Score* (Breck, Cai, Nielsen, Salib & Sculley, Google), **agora lido**: o PDF que antes não abria está no arquivo público de publicações do Google. Dele vêm o teste **Data 1** (*"Feature expectations are captured in a schema"*, com o exemplo do humano adulto entre um e dez pés de altura) e o **Monitor 2** (*"Data invariants hold in training and serving inputs"*) |
| ❌ | Uma fonte que prescreva o que fazer quando **uma requisição** viola o contrato. A busca continua sem achado, e agora com a fonte que faltava aberta: o Monitor 2 manda *"measure whether data matches the schema and alert when they diverge significantly"*, com afinação de limiar entre falso positivo e falso negativo. Isso é política de **agregado**, não de requisição. Abrir a fonte confirmou o vão em vez de fechá-lo |
| 📖 | A leitura de que a política de violação é decisão escrita no contrato, e de que a rejeição não contada é dívida — e a escolha de usar o serviço deste livro como exemplo, defeitos inclusive |

:::exercicio {"id":"mlops-e10","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Um serviço de modelo recebe uma requisição em que o campo `renda_mensal` chega como o texto vazio. O serviço converte o vazio para zero e responde a predição normalmente, sem registrar nada.

Qual é o problema principal dessa decisão?

- [ ] Zero é um valor implausível de renda, e o modelo vai errar essa predição.
- [x] A política de violação é silenciosa: ninguém saberá que a entrada estava fora do contrato, nem hoje nem no relatório do mês.
- [ ] O serviço deveria ter recusado a requisição, porque recusar é sempre a política correta.
- [ ] O campo deveria ser obrigatório no esquema, o que tornaria a conversão desnecessária.

> **gabarito:** a política é silenciosa
> **porque:** Sanear a entrada é uma das três políticas legítimas, e o defeito aqui não é sanear: é sanear **sem deixar rastro**. A predição sai, o chamador recebe um número com aparência normal, e nada no sistema registra que o modelo decidiu sobre um valor que o cliente não mandou.
>
> A primeira alternativa está certa no fato e erra no alvo: uma predição ruim é o efeito, e o problema é que ninguém vai ligar o efeito à causa. A terceira transforma em regra o que o capítulo diz explicitamente não ser regra: nenhuma fonte prescreve recusar, e há casos em que recusar derruba um serviço por causa de um campo secundário. A quarta é uma boa melhoria de esquema e não resolve o que está em jogo, porque a pergunta continua de pé: quando a violação acontecer, o que o serviço faz, e quem fica sabendo?
> **volte para:** #a-fronteira-do-servico-contrato-e-validacao-de-entrada
:::

:::exercicio {"id":"mlops-e11","tipo":"multipla-multi","objetivo":"O2","dificuldade":"media"}
Você vai pôr um modelo de risco atrás de uma API. Quais decisões pertencem ao contrato dessa fronteira, e precisam estar escritas antes de o serviço subir? Marque todas que valem.

- [x] O tipo e a faixa aceitável de cada campo de entrada, e a proporção de nulos tolerada.
- [x] O que o serviço faz quando um campo viola o contrato, e o que ele registra ao fazer isso.
- [x] Qual versão do modelo respondeu, devolvida junto com a predição.
- [ ] Qual algoritmo foi usado no treino e quais hiperparâmetros venceram a busca.
- [ ] Com que frequência o modelo será retreinado.

> **gabarito:** o esquema dos campos; a política de violação e o que ela registra; a versão do modelo na resposta
> **porque:** As três corretas são justamente o que quem consome o serviço precisa saber para depender dele sem surpresa. A segunda é a que mais gente esquece, e é a que separa um contrato de uma anotação: sem política declarada, cada rota decide sozinha, e as decisões divergem sem que ninguém perceba.
>
> As duas erradas são verdadeiras e não são do contrato. O algoritmo e os hiperparâmetros pertencem à linhagem, que responde a outra pergunta e para outro público, o de auditoria. A frequência de retreino é política de operação, e muda sem que o contrato mude. O teste é este: se essa informação mudar, quem chama o serviço precisa mexer no código dele? Se sim, é contrato.
> **volte para:** #a-fronteira-do-servico-contrato-e-validacao-de-entrada
:::

:::exercicio {"id":"mlops-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Um auditor pergunta: *"este modelo em produção foi treinado com quais dados?"*. O time tem o código no Git, o modelo salvo em disco e os notebooks de treino. O que falta para responder com segurança?

- [ ] Nada: basta rodar o notebook de novo e olhar o resultado.
- [x] O registro da linhagem — qual versão do dado e qual commit produziram **aquele** artefato em produção.
- [ ] Um conjunto de teste maior, para reavaliar o modelo hoje.
- [ ] A documentação do modelo escrita pelo time.

> **gabarito:** Falta a linhagem: dado e commit amarrados ao artefato em produção
> **porque:** Rodar o notebook de novo **produz outro modelo**, não recupera o que está servindo — as bibliotecas mudaram, o dado provavelmente cresceu e a seed pode não ter sido fixada. Reavaliar hoje responde "ele ainda é bom?", que é outra pergunta. E documentação escrita à mão descreve a intenção, não o fato: ela não prova nada, porque nada a obriga a estar sincronizada.
>
> A única resposta verificável amarra o artefato ao **hash do dado** e ao **commit** que o geraram, registrados no momento do treino. Reprodutibilidade não é uma qualidade do time; é um dado que se grava.
> **volte para:** #fundamentos-versionar-registrar-servir
:::

:::exercicio {"id":"mlops-e4","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Um time guarda no Git o código de treino, guarda o modelo treinado num repositório de artefatos e registra o hash do conjunto de dados usado. Seis meses depois, roda o mesmo código sobre o mesmo dado e obtém um modelo diferente do que está em produção.

Qual dos cinco versionamentos deste capítulo ficou de fora?

- [ ] O dado
- [ ] O modelo
- [x] O ambiente
- [ ] O código

> **gabarito:** o ambiente
> **porque:** Os outros três estão no enunciado, um a um. O que não está é a versão das bibliotecas, e é ela que muda sozinha entre um semestre e outro. Uma implementação que trocou o padrão de um parâmetro, ou que passou a sortear de outro jeito, produz outro modelo a partir do mesmo código e do mesmo dado.
>
> Falta também a configuração, que é o quinto item, mas o enunciado não diz nada sobre hiperparâmetros, e o ambiente é o que o caso descrito isola: mesmo código, mesmo dado, resultado diferente. Vale reter que a reprodutibilidade não é uma qualidade do time; é um conjunto de cinco coisas que alguém gravou.
> **volte para:** #fundamentos-versionar-registrar-servir
:::

:::exercicio {"id":"mlops-e5","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Outro time é rigoroso: código no Git, dado por hash, modelo no registro, ambiente fixado por imagem de contêiner, semente fixa. O treino é reproduzível bit a bit. Ainda assim, o número de aprovações que o relatório de março mostrava não volta quando alguém reexecuta a avaliação em setembro, com o mesmo modelo e o mesmo dado de março.

Onde está a diferença?

- [x] Na configuração: o limiar de decisão foi ajustado depois, e ele não estava versionado junto com o resto.
- [ ] No dado: o hash garante o conteúdo, mas não garante a ordem das linhas.
- [ ] No modelo: reexecutar a avaliação recarrega o artefato e pode carregar outra versão.
- [ ] No ambiente: a imagem de contêiner fixa as bibliotecas, mas não a versão do sistema operacional.

> **gabarito:** na configuração, que é o quinto versionamento
> **porque:** O enunciado fecha quatro portas de propósito e deixa uma aberta. Treino reproduzível bit a bit não diz nada sobre o **limiar**, que é decisão de negócio e vive fora do modelo. Mudar o limiar muda quantos são aprovados sem mudar uma única probabilidade prevista.
>
> É exatamente a dívida de configuração do [capítulo V.2](v-2-sistemas-de-ml.md) aparecendo do lado da reprodutibilidade, e é por isso que a configuração é um dos cinco itens e não uma nota de rodapé. Repare que este caso não seria pego por nenhuma checagem de treino: o treino está perfeito. O que não está versionado é a regra que transforma a probabilidade em decisão.
> **volte para:** #fundamentos-versionar-registrar-servir
:::

## Monitorar em três camadas

Monitoramento de ML não é um painel: são **três** painéis, com donos e tempos diferentes.

1. **Saúde do serviço** — taxa de erro, latência, disponibilidade. Quebra em segundos e é a camada que todo time já sabe montar.
2. **Qualidade do dado de entrada** — esquema, faixas, proporção de nulos, cardinalidade de categóricas. Quebra em horas e é a que mais pega falha real, porque a maior parte dos incidentes de ML é um campo que mudou de unidade ou passou a chegar vazio (ver [capítulo I.2](i-2-coleta-integracao.md)).
3. **Desempenho do modelo** — a métrica do [capítulo II.1](ii-1-avaliacao.md). E aqui está a dificuldade central: **ela só pode ser calculada quando o rótulo chega**, o que pode levar semanas ou meses.

**Os três tipos de drift.** *Drift de dados* (ou de covariáveis): a distribuição da **entrada** muda — chegam clientes de outro perfil. *Drift de conceito*: a relação entre entrada e saída muda — o mesmo perfil de cliente passa a se comportar de outro jeito. *Drift de rótulo*: a distribuição da **saída** muda — a fraude que era 0,3% da base virou 2%.

O drift é exatamente a quebra da hipótese que o [capítulo 0.2](../0-2-fundamentos.md) coloca na fundação: treino e produção vindo da mesma distribuição. Nada no modelo protege contra isso, porque a hipótese é anterior ao modelo.

:::lab {"id":"mlops-l1","tipo":"anima-deriva","titulo":"O PSI e a AUC na mesma linha do tempo"}
Sessenta dias. A linha laranja é o **PSI** da entrada contra a janela de referência, que você calcula hoje; a azul é a **AUC real**, que exige o rótulo. A partir do dia 20 a distribuição da entrada começa a andar.

O PSI cruza 0,25 no dia 32. A AUC também cai cinco pontos no dia 32, e vale insistir nisso porque contraria o que se costuma prometer: **o PSI não se mexeu antes**. Os dois se movem juntos.

O adiantamento vem de outro lugar, e é o lugar certo: **o rótulo demora**. Com 21 dias de latência, a queda do dia 32 só fica visível no dia 53. O PSI avisou 21 dias antes, e os 21 são exatamente a latência, não uma sensibilidade mágica do indicador.

**Agora clique em "E se a deriva não doesse?".** A entrada anda exatamente do mesmo jeito: mesmo PSI, cruzando 0,25 no mesmo dia 32. E a AUC fica onde estava, em 0,85, sem nunca disparar a queda de cinco pontos.

> **É a diferença entre alarme e veredito, medida.** O mesmo valor de PSI acompanha um desastre e um não-evento. Quem religiosamente retreina quando o PSI passa de 0,25 vai retreinar à toa metade das vezes, e vai gastar a credibilidade do alarme antes da vez em que ele importava. O indicador de entrada diz **"vá olhar"**; quem diz se houve dano é o rótulo, quando chegar.
:::

**Detectar sem rótulo.** Enquanto o rótulo não chega, sobra o que não depende dele: comparar a **distribuição da entrada** de hoje com a de referência (a janela de treino), atributo a atributo, e comparar a **distribuição da saída** — o histograma das probabilidades previstas. Se o modelo começa a prever positivo com o dobro da frequência de antes, algo mudou, mesmo que ninguém ainda saiba se ele está certo. É um alarme, não um veredito: drift de entrada não implica queda de desempenho, e queda de desempenho pode acontecer sem drift visível na entrada.

:::exercicio {"id":"mlops-e6","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Num sistema antifraude, a proporção de transações fraudulentas na base passou de 0,3% para 2% em duas semanas. O perfil de quem compra continua o mesmo, e a relação entre o comportamento e a fraude também.

Que tipo de drift é esse?

- [ ] Drift de covariáveis
- [ ] Drift de conceito
- [x] Drift de rótulo
- [ ] Nenhum: mudança de proporção não é drift

> **gabarito:** drift de rótulo
> **porque:** O que mudou foi a distribuição da **saída**, e o enunciado fecha as outras duas portas explicitamente: o perfil de entrada é o mesmo, e a relação entre entrada e saída também.
>
> Guarde a distinção pelo que muda em cada uma. Covariáveis: muda quem chega. Conceito: muda como quem chega se comporta. Rótulo: muda quanto do resultado é de cada tipo. E a quarta alternativa erra de um jeito caro: uma classe que quase septuplicou desarranja limiar, calibração e a métrica que o time acompanha, mesmo com o modelo intacto.
> **volte para:** #monitorar-em-tres-camadas
:::

:::exercicio {"id":"mlops-e7","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Um modelo de risco de crédito é usado numa região nova do país. A distribuição de renda, idade e tempo de emprego dos solicitantes é bem diferente da que estava no treino, e o painel de entrada acusa isso em vários atributos. Quando os rótulos dos primeiros meses chegam, o desempenho do modelo nessa região está igual ao histórico.

O que aconteceu, e o que se conclui?

- [x] Houve drift de covariáveis sem drift de conceito: a entrada mudou, mas a relação entre entrada e inadimplência continua valendo, e o modelo generalizou.
- [ ] Houve drift de conceito, porque o comportamento dos clientes da região nova é diferente do dos antigos.
- [ ] Não houve drift, porque o desempenho não caiu; drift é definido pela queda de métrica.
- [ ] Houve drift de rótulo, já que a base de solicitantes mudou de composição.

> **gabarito:** drift de covariáveis sem drift de conceito
> **porque:** É o caso que ensina a diferença, porque ele separa as duas coisas que costumam vir juntas. A entrada mudou de verdade, e o alarme do painel estava certo em disparar. Mas a função que liga entrada e inadimplência não mudou, então o modelo continua acertando em território novo.
>
> A terceira é a errada mais instrutiva, e é uma confusão comum de painel: ela define drift pelo efeito em vez de pela causa. Drift de entrada é observável **antes** do rótulo, e é essa antecedência que o torna útil. Se drift só existisse quando a métrica cai, ele não serviria para nada, porque a métrica só existe quando o rótulo chega. O alarme de entrada é alarme, e não veredito, e este exercício é o caso em que o veredito absolve.
> **volte para:** #monitorar-em-tres-camadas
:::

:::exercicio {"id":"mlops-e2","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Você opera um modelo que prevê, na assinatura do contrato, se um cliente vai ficar inadimplente. O **rótulo verdadeiro só existe 90 dias depois** — é o prazo para a primeira parcela vencer e o atraso ser confirmado.

Descreva como você monitora esse modelo **durante os 90 dias**, e o que faria disparar uma investigação antes do rótulo chegar.

> **rubrica:** reconhece explicitamente que a métrica de desempenho não pode ser calculada no intervalo, e não propõe calculá-la;
> propõe monitorar a distribuição das **entradas** contra a janela de referência do treino;
> propõe monitorar a distribuição das **saídas** (probabilidades previstas ou taxa de positivos);
> cita ao menos um sinal proxy ou parcial (sinais precoces de atraso, cancelamentos, reclamações, taxa de aprovação por segmento);
> reconhece que esses sinais são alarme e não veredito, e diz o que faria em seguida (investigar, segurar promoção, comparar com o campeão anterior)
> **porque:** A resposta fraca diz "acompanho a acurácia semanalmente" — impossível, porque **não há rótulo para comparar**. Essa é a armadilha do exercício e o erro real mais comum de painel de ML: exibir uma métrica de desempenho que, nos primeiros 90 dias, está sendo calculada sobre um recorte enviesado (só os casos que já venceram, que são justamente os contratos mais antigos).
>
> A resposta forte separa o que se pode medir agora do que só se poderá medir depois. Entrada e saída são observáveis imediatamente; o rótulo, não. E a resposta excelente acrescenta o passo seguinte: quando o rótulo enfim chega, ele chega **atrasado e em blocos**, então a avaliação precisa ser feita por coorte de entrada (os contratos de março avaliados juntos) e não pela data em que o rótulo apareceu. Misturar as duas datas é reinventar o vazamento temporal do [capítulo I.3](i-3-dados.md) dentro do próprio monitoramento.
> **volte para:** #monitorar-em-tres-camadas
:::

## Retreinar e implantar sem quebrar

**Retreino por gatilho ou por calendário?** Por gatilho (quando o monitoramento acusa drift ou queda de métrica) é a resposta certa quando existe monitoramento confiável e o rótulo chega em tempo útil. Por calendário é o padrão honesto quando não existe: um retreino mensal é uma aposta, mas é melhor que esperar a reclamação. Os dois exigem a mesma coisa: **o retreino precisa ser um pipeline que roda sozinho**, não um notebook que alguém reabre.

E vale a regra que o [capítulo II.8](ii-8-do-modelo-a-decisao.md) impõe: **retreinar não é a única resposta**. Se o que mudou foi o custo do erro, recalcule o limiar; o modelo pode continuar o mesmo.

**Implantação segura.** Três instrumentos, do mais barato ao mais caro:

- **Sombra**: o modelo novo recebe o tráfego real e responde, mas **a resposta é descartada** — serve só para comparar com a do modelo atual. Risco zero para o usuário.
- **Canário**: uma fatia pequena do tráfego real vai para o novo. Aqui o usuário já é afetado, então há critério de parada definido **antes**.
- **Reverter**: voltar à versão anterior em minutos, sem retreinar nada. Só é possível se a versão anterior continua registrada e servível.

O plano de rollback é o item que quase todo time escreve durante o incidente, quando já é tarde. **Escreva antes**: qual métrica dispara a volta, qual é o limite, quem tem autoridade para acionar e quanto tempo leva. Um plano que depende de retreinar não é plano de rollback — é um segundo incidente.

:::exercicio {"id":"mlops-e8","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Um plano de rollback escrito antes do deploy responde a quatro perguntas. Qual das opções abaixo **não** é uma delas?

- [ ] Qual métrica dispara a volta atrás
- [ ] Qual é o limite dessa métrica
- [x] Qual correção será aplicada ao modelo com problema
- [ ] Quem tem autoridade para acionar

> **gabarito:** a correção a ser aplicada
> **porque:** As outras três são o plano, junto com o tempo que a volta leva. A correção não é: descobrir a causa e consertar leva o tempo que levar, e é justamente por isso que o rollback existe. Ele separa **parar o dano** de **entender o problema**, que são coisas de urgências diferentes.
>
> Vale a formulação do capítulo: um plano que depende de retreinar não é plano de rollback, é um segundo incidente. Voltar à versão anterior tem de ser possível em minutos, sem treinar nada, e isso só vale se a versão anterior continuar registrada e servível.
> **volte para:** #retreinar-e-implantar-sem-quebrar
:::

:::exercicio {"id":"mlops-e3","tipo":"multipla-multi","objetivo":"O4","dificuldade":"media"}
Você vai promover uma nova versão de um modelo de recomendação. Quais práticas reduzem o risco **antes** de o usuário ser afetado?

- [x] Rodar o modelo novo em sombra, comparando as respostas com as do atual sem entregá-las a ninguém.
- [x] Manter a versão anterior registrada e servível, para reverter sem retreinar.
- [x] Definir, antes do deploy, a métrica e o limite que disparam a volta atrás.
- [ ] Substituir a versão antiga assim que o modelo novo vencer no conjunto de teste.
- [ ] Aumentar o tráfego do canário rapidamente, para colher resultado estatístico antes.

> **gabarito:** sombra, versão anterior servível e critério de parada escrito antes
> **porque:** As duas alternativas erradas são as tentações reais. Vencer no conjunto de teste diz que o modelo é melhor **naquele dado**; produção tem tráfego, latência e distribuição que o teste não tem — é justamente o intervalo entre treinar e servir que abre este capítulo. E acelerar o canário para "ter significância logo" inverte a lógica do canário: ele existe para **limitar o dano**, não para produzir resultado rápido; quem acelera troca a proteção pela pressa.
>
> Repare que a sombra é a única das três práticas certas que dá evidência **com risco zero**, porque a resposta do modelo novo nunca chega ao usuário. É o instrumento mais subutilizado da lista.
> **volte para:** #retreinar-e-implantar-sem-quebrar
:::

:::exercicio {"id":"mlops-e9","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"dificil"}
Você vai promover na sexta-feira uma nova versão do modelo que ordena os resultados de busca de um marketplace. O modelo serve em linha, a 3 mil requisições por segundo. A métrica de negócio que interessa é a taxa de clique, e ela só é confiável depois de umas seis horas de tráfego acumulado. A métrica técnica, latência, é confiável em minutos.

Projete o plano de rollback desta promoção, antes de ela acontecer.

> **rubrica:** nomeia a métrica de disparo e reconhece que são DUAS, com tempos diferentes de confiança: a latência responde em minutos, a taxa de clique só depois de horas;
> define um limite numérico para cada uma, e não apenas "se piorar";
> diz quem tem autoridade para acionar a volta, e prevê o caso de o incidente cair fora do horário comercial;
> estima o tempo de execução da volta e exige que a versão anterior siga registrada e servível;
> usa canário com fatia declarada, em vez de trocar a versão inteira de uma vez, e justifica a fatia pela métrica mais lenta;
> não propõe corrigir o modelo como parte do rollback
> **porque:** A resposta fraca escreve "se a métrica cair, volta atrás". Isso não é plano: não diz qual métrica, quanto é cair, quem decide nem em quanto tempo. No incidente, cada um desses quatro buracos vira uma discussão, e a discussão acontece enquanto o dano corre.
>
> O que este caso acrescenta, e é o miolo dele, é o **descompasso entre as duas métricas**. A latência protege em minutos; a taxa de clique, que é a que de fato importa, não protege ninguém nas primeiras horas. Quem promove tudo de uma vez fica cego justamente na métrica que interessa, e é por isso que a fatia do canário se dimensiona pela métrica mais lenta: ela precisa ser pequena o bastante para o dano ser tolerável durante as seis horas em que só a latência responde.
>
> A sexta-feira do enunciado não é enfeite. Um plano cuja autoridade de acionamento é uma pessoa que sai às 18h não é um plano, e a resposta forte percebe isso sem que ninguém aponte.
> **volte para:** #retreinar-e-implantar-sem-quebrar
:::

## Síntese — o que levar

- A falha em produção quase nunca está no modelo. Está entre **treinar e servir**, e entre **servir hoje e servir em três meses**.
- **O que muda sozinho precisa ser testado sozinho.** Software se degrada quando alguém edita; modelo se degrada quando **ninguém** edita.
- A aplicação muda em **três eixos** — código, modelo e dado. Pipeline que só reage a commit enxerga um terço do problema.
- Reprodutibilidade exige **cinco** versionamentos: código, dado, modelo, configuração e ambiente.
- Linhagem é a pergunta que salva auditoria: **de qual dado e de qual código saiu este artefato?**
- Monitore em **três camadas**: serviço, dado de entrada, desempenho. A terceira só existe quando o rótulo chega.
- Sem rótulo, monitore **distribuição de entrada e de saída**. Isso é alarme, não veredito.
- Drift de dados ≠ drift de conceito ≠ drift de rótulo. O que muda é diferente, e a resposta também.
- **Escreva o plano de rollback antes do deploy.** Sombra, canário e reverter — nessa ordem de custo.
- Na fronteira do serviço, **o contrato existe de qualquer jeito**; a escolha é entre escrevê-lo e descobri-lo quebrado. E a política de violação (rejeitar, sanear, ignorar) é decisão declarada, nunca acidente da implementação.
- E o nome da disciplina não foi cunhado onde todo mundo diz. Atribuição repetida não é atribuição verificada.

## Verificação

1. Um colega propõe versionar apenas o código e o modelo, porque "o dado é grande demais". Que pergunta ele deixa de conseguir responder — e como o *hash* de conteúdo resolve isso sem copiar o dado?
2. O painel mostra drift claro na distribuição de duas entradas, mas a métrica de desempenho medida sobre os rótulos que já chegaram está estável. Retreinar ou não? Justifique usando a diferença entre drift de covariáveis e drift de conceito.
3. Descreva o plano de rollback do último sistema em que você trabalhou — métrica de disparo, limite, responsável e tempo de execução. Se algum dos quatro não existir, diga o que aconteceria no incidente.

:::exercicio {"id":"mlops-e12","tipo":"aberta","objetivo":"O2","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Um modelo de previsão de atraso de entrega vai ao ar atrás de uma API. Ele recebe seis campos: `distancia_km` (número), `peso_kg` (número), `hora_do_dia` (inteiro de 0 a 23), `tipo_veiculo` (uma de quatro categorias), `chuva_mm` (número, frequentemente ausente) e `avaliacao_entregador` (número de 1 a 5, ausente para quem é novo).

Escreva o contrato dessa fronteira e a política de violação de cada campo. Justifique cada política, e diga o que o serviço registra quando ela é acionada.

> **rubrica:** declara, para os seis campos, o tipo e a faixa ou o conjunto de categorias aceitas, e não apenas para alguns;
> trata os dois campos ausentes como **casos previstos no contrato**, e não como violação — a ausência de chuva e a de avaliação têm significados diferentes, e o contrato precisa dizer o que o serviço faz com cada uma;
> escolhe uma política por campo entre rejeitar, sanear e ignorar, e **justifica pelo custo do erro** daquele campo, em vez de aplicar a mesma política a todos;
> declara o que é registrado quando a política é acionada, de modo que um pico de violações seja observável antes de qualquer queda de métrica;
> inclui a versão do modelo na resposta, ou justifica por que não incluiria;
> não trata "rejeitar" como resposta padrão correta para tudo
> **porque:** O ponto do desafio é que **os seis campos não merecem a mesma política**, e quem aplica uma regra única entrega a resposta fraca. Distância e peso fora de faixa provavelmente indicam erro de quem chamou, e recusar é defensável porque a predição sem eles não vale nada. Chuva ausente é o caso normal, não a exceção, e tratá-la como violação derrubaria o serviço na maior parte do ano.
>
> A avaliação do entregador é o caso mais interessante, e é o que separa a resposta forte da correta. Ela está ausente exatamente para os entregadores novos, que são um grupo com comportamento próprio. Preencher com a média joga esse grupo para o meio da distribuição e apaga a informação mais útil que existe sobre ele, que é ser novo. Um valor sentinela declarado, ou um campo que diga que o entregador não tem histórico, preserva o que a ausência informa. Repare que essa decisão é de modelagem e chega ao contrato, o que é justamente o argumento de o contrato ser escrito antes de o serviço subir.
>
> E o último critério existe porque a leitura apressada deste capítulo produz um serviço que recusa tudo. Rejeitar é a política mais visível e não é a mais segura: um campo secundário fora de faixa que derruba a resposta inteira troca uma predição um pouco pior por nenhuma predição, e essa troca precisa ser escolhida, não herdada.
> **volte para:** #a-fronteira-do-servico-contrato-e-validacao-de-entrada
:::
