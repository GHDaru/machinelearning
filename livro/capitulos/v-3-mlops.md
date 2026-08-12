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

**O aperto.** Times de ML entregando modelos como quem entrega um relatório — a mão, um arquivo por vez — e descobrindo que o artefato entregue apodrece sozinho. 📖

**O que se fazia antes.** Entrega manual; retreino por calendário ou, na prática, por reclamação: alguém do negócio nota que "está estranho" e o time retreina. ⏳

**A virada.** Aplicar entrega contínua a um artefato que muda em **três eixos**, não em um: **código**, **modelo** e **dado**. É a tese declarada de Sato, Wider & Windheuser em *"Continuous Delivery for Machine Learning"* (martinfowler.com, 2019) ✓ᵐ — e a razão de o pipeline de entrega contínua tradicional não bastar. Um pipeline que só reage a commit não vê dois dos três eixos.

**A ideia reaproveitável.** **O que muda sozinho precisa ser testado sozinho.** Software comum se degrada quando alguém edita; **modelo se degrada quando ninguém edita.** A inversão é o coração do capítulo: se a degradação não é disparada por uma ação humana, nenhum gatilho humano vai detectá-la. 📖

### O nome que ninguém cunhou

Aqui está o achado mais desconfortável do capítulo — e ele é sobre o próprio nome da disciplina.

A versão repetida em dezenas de fontes de indústria é que **"MLOps foi cunhado no artigo de 2015 de Sculley et al."**. Extraímos o texto integral do artigo e buscamos: **a palavra "MLOps" não aparece nenhuma vez.** Também não aparecem "feature store" nem "training/serving skew". Selo **✓** — é uma **verificação negativa** feita sobre o texto primário, e verificação negativa é das mais fortes que existem: não depende de interpretação, só de leitura.

A filiação a DevOps, essa sim, está documentada: *"The first devopsdays was held in Ghent, Belgium in 2009"*, com **Patrick Debois** listado como fundador na página oficial ✓ᵃ. Já a história de a abreviação "#devops" ter nascido da necessidade de caber numa hashtag de Twitter é ⏳ — consistente entre fontes secundárias, sem primária.

> **A leitura (📖):** este é o **sexto caso** do padrão *"crédito segue o vocabulário"* que atravessa o livro — e o mais extremo. Nos cinco anteriores (Gauss × Legendre no cap. [II.2](ii-2-modelos-lineares.md), Linnainmaa × Rumelhart no [III.1](iii-1-neuronio-artificial.md), Harris × Firth no [I.6](i-6-representacao.md), o *double descent* no [0.2](../0-2-fundamentos.md) e o k-means com seis pretendentes no [IV.1](iv-1-nao-supervisionado.md)), o crédito foi para a pessoa errada.
>
> **Aqui o campo não tinha um autor para o nome e fabricou um retroativamente**, escolhendo o artigo mais citado da vizinhança. E a atribuição sobreviveu apesar de ser **falsificável em trinta segundos** por quem tivesse o PDF aberto e uma busca de texto.

**Concept drift tem nome desde 1986.** Schlimmer & Granger publicam naquele ano dois trabalhos: *"Beyond Incremental Processing: Tracking Concept Drift"* (AAAI-86 — o termo está no título) e *"Incremental learning from noisy data"* (*Machine Learning* 1(3):317–354). O survey que organizou o campo é o de Gama, Žliobaitė, Bifet, Pechenizkiy & Bouchachia (*ACM Computing Surveys* 46(4), art. 44, 2014) ✓ᵐ. **De 1986 a 2014: vinte e oito anos entre o nome e a síntese.**

**E o procedimento veio rápido.** *The ML Test Score* — Breck, Cai, Nielsen, Salib & **Sculley**, IEEE Big Data 2017 — traz **28 testes e necessidades de monitoramento** pontuados ✓ᵐ. Repare no subtítulo: *"…and Technical Debt Reduction"*. É explicitamente a continuação do [capítulo V.2](v-2-sistemas-de-ml.md): mesmo autor sênior, dois anos depois, transformando o diagnóstico em checklist. **Diagnóstico (2015) → procedimento (2017): dois anos.** Compare com as décadas do resto do livro — quando o diagnóstico é preciso *e* já existe infraestrutura, o procedimento chega rápido. É o mesmo fio dos capítulos [II.5](ii-5-arvores-ensembles.md) e [III.6](iii-6-modelos-de-fundacao.md).

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | "MLOps", "feature store" e "training/serving skew" **não aparecem** no artigo de Sculley et al. (2015) — texto integral extraído e buscado |
| ✓ᵃ | O primeiro devopsdays em Ghent, Bélgica, 2009, e Patrick Debois como fundador — página oficial do evento |
| ✓ᵐ | Sato, Wider & Windheuser, *Continuous Delivery for Machine Learning* (martinfowler.com, 2019), e a tese dos três eixos |
| ✓ᵐ | Breck, Cai, Nielsen, Salib & Sculley, *The ML Test Score* (IEEE Big Data, 2017), com 28 testes e necessidades de monitoramento |
| ✓ᵐ | Gama, Žliobaitė, Bifet, Pechenizkiy & Bouchachia, *ACM Computing Surveys* 46(4), art. 44, 2014 |
| ⏳ | Schlimmer & Granger (1986) como cunho de *concept drift* — **nenhum dos dois trabalhos foi aberto**; o título do AAAI-86 é a evidência mais forte obtida |
| ⏳ | A origem da hashtag "#devops" no limite de caracteres do Twitter |
| 📖 | A leitura do "sexto caso" do padrão *crédito segue o vocabulário*, e a inversão "modelo se degrada quando ninguém edita" |

## Fundamentos: versionar, registrar, servir

**Versionar o quê.** Reproduzir um resultado meses depois exige cinco coisas, não uma: **código**, **dado**, **modelo**, **configuração** (hiperparâmetros, limiar, regras de negócio) e **ambiente** (versões de biblioteca). Faltando qualquer uma, o número do relatório não volta. Dado costuma ser versionado por *hash* de conteúdo, não por cópia — o que se guarda é a impressão digital que prova qual dado foi usado.

**Registro de modelos e linhagem.** Um registro de modelos responde a três perguntas em segundos: qual versão está em produção, **de qual dado e de qual código ela saiu**, e quem a promoveu. A pergunta da linhagem é a que salva auditoria e incidente. Um modelo sem linhagem é um binário anônimo: você pode desligá-lo, mas não pode explicá-lo.

**Servir.** Três formas, escolhidas pelo requisito e não pelo gosto:

| Forma | Quando serve | Latência típica |
|---|---|---|
| **Batch** | a decisão pode esperar horas; predições calculadas em lote e guardadas | minutos a horas |
| **Online** | a decisão é pedida na hora, por requisição | milissegundos |
| **Streaming** | a decisão acompanha um fluxo contínuo de eventos | segundos |

A escolha manda no resto da arquitetura. Batch tolera atributo caro; online não — se calcular o atributo custa 800 ms, o modelo online já perdeu, por mais preciso que seja.

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

## Monitorar em três camadas

Monitoramento de ML não é um painel: são **três** painéis, com donos e tempos diferentes.

1. **Saúde do serviço** — taxa de erro, latência, disponibilidade. Quebra em segundos e é a camada que todo time já sabe montar.
2. **Qualidade do dado de entrada** — esquema, faixas, proporção de nulos, cardinalidade de categóricas. Quebra em horas e é a que mais pega falha real, porque a maior parte dos incidentes de ML é um campo que mudou de unidade ou passou a chegar vazio (ver [capítulo I.2](i-2-coleta-integracao.md)).
3. **Desempenho do modelo** — a métrica do [capítulo II.1](ii-1-avaliacao.md). E aqui está a dificuldade central: **ela só pode ser calculada quando o rótulo chega**, o que pode levar semanas ou meses.

**Os três tipos de drift.** *Drift de dados* (ou de covariáveis): a distribuição da **entrada** muda — chegam clientes de outro perfil. *Drift de conceito*: a relação entre entrada e saída muda — o mesmo perfil de cliente passa a se comportar de outro jeito. *Drift de rótulo*: a distribuição da **saída** muda — a fraude que era 0,3% da base virou 2%.

O drift é exatamente a quebra da hipótese que o [capítulo 0.2](../0-2-fundamentos.md) coloca na fundação: treino e produção vindo da mesma distribuição. Nada no modelo protege contra isso, porque a hipótese é anterior ao modelo.

**Detectar sem rótulo.** Enquanto o rótulo não chega, sobra o que não depende dele: comparar a **distribuição da entrada** de hoje com a de referência (a janela de treino), atributo a atributo, e comparar a **distribuição da saída** — o histograma das probabilidades previstas. Se o modelo começa a prever positivo com o dobro da frequência de antes, algo mudou, mesmo que ninguém ainda saiba se ele está certo. É um alarme, não um veredito: drift de entrada **não implica** queda de desempenho, e queda de desempenho pode acontecer sem drift visível na entrada.

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
> A resposta forte separa o que se pode medir agora do que só se poderá medir depois. Entrada e saída são observáveis imediatamente; o rótulo, não. E a resposta excelente acrescenta o passo seguinte: quando o rótulo enfim chega, ele chega **atrasado e em blocos**, então a avaliação precisa ser feita por coorte de entrada — os contratos de março avaliados juntos — e não pela data em que o rótulo apareceu. Misturar as duas datas é reinventar o vazamento temporal do [capítulo I.3](i-3-dados.md) dentro do próprio monitoramento.
> **volte para:** #monitorar-em-tres-camadas
:::

## Retreinar e implantar sem quebrar

**Retreino por gatilho ou por calendário?** Por gatilho — quando o monitoramento acusa drift ou queda de métrica — é a resposta certa quando existe monitoramento confiável e o rótulo chega em tempo útil. Por calendário é o padrão honesto quando não existe: um retreino mensal é uma aposta, mas é melhor que esperar a reclamação. Os dois exigem a mesma coisa: **o retreino precisa ser um pipeline que roda sozinho**, não um notebook que alguém reabre.

E vale a regra que o [capítulo II.8](ii-8-do-modelo-a-decisao.md) impõe: **retreinar não é a única resposta**. Se o que mudou foi o custo do erro, recalcule o limiar; o modelo pode continuar o mesmo.

**Implantação segura.** Três instrumentos, do mais barato ao mais caro:

- **Sombra**: o modelo novo recebe o tráfego real e responde, mas **a resposta é descartada** — serve só para comparar com a do modelo atual. Risco zero para o usuário.
- **Canário**: uma fatia pequena do tráfego real vai para o novo. Aqui o usuário já é afetado, então há critério de parada definido **antes**.
- **Reverter**: voltar à versão anterior em minutos, sem retreinar nada. Só é possível se a versão anterior continua registrada e servível.

O plano de rollback é o item que quase todo time escreve durante o incidente, quando já é tarde. **Escreva antes**: qual métrica dispara a volta, qual é o limite, quem tem autoridade para acionar e quanto tempo leva. Um plano que depende de retreinar não é plano de rollback — é um segundo incidente.

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
- E o nome da disciplina não foi cunhado onde todo mundo diz. Atribuição repetida não é atribuição verificada.

## Verificação

1. Um colega propõe versionar apenas o código e o modelo, porque "o dado é grande demais". Que pergunta ele deixa de conseguir responder — e como o *hash* de conteúdo resolve isso sem copiar o dado?
2. O painel mostra drift claro na distribuição de duas entradas, mas a métrica de desempenho medida sobre os rótulos que já chegaram está estável. Retreinar ou não? Justifique usando a diferença entre drift de covariáveis e drift de conceito.
3. Descreva o plano de rollback do último sistema em que você trabalhou — métrica de disparo, limite, responsável e tempo de execução. Se algum dos quatro não existir, diga o que aconteceria no incidente.
