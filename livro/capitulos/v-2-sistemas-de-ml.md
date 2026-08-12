# V.2 — Sistemas de ML

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Descrever os componentes de um sistema de ML além do modelo.
- **O2.** Identificar as formas de dívida técnica específicas de sistemas que aprendem.
- **O3.** Projetar o contrato entre treino e inferência para evitar training-serving skew.
- **O4.** Decidir entre predição em lote e em tempo real a partir do requisito, não do gosto.

## O problema: o modelo funciona, o sistema apodrece

O modelo entrou em produção e acertou. Seis meses depois, o mesmo time não consegue mais mexer nele.

Trocar um atributo de entrada exige reajustar o modelo inteiro, e ninguém sabe dizer o que vai acontecer. Um script sem dono junta três tabelas todo dia às 4h. Existe um arquivo de configuração com centenas de linhas que nunca passou por revisão. E um segundo modelo, de outro time, lê a saída do primeiro — o primeiro time descobriu isso por acaso.

Nada disso é bug. Nada disso aparece num teste. E, principalmente, **nada disso tem uma linha no orçamento** — porque cada item desses é caro sem ter nome. O erro que este capítulo previne é tratar **o modelo como se fosse o sistema**: ele é uma peça pequena de uma máquina grande, e os modos de falha caros moram fora dele.

## De onde isto veio

**O aperto.** Entre 2014 e 2015, dentro do Google, sistemas de Machine Learning (ML) em produção acumulavam um custo de manutenção que **nenhum vocabulário de engenharia existente nomeava**. Todo mundo sentia; ninguém conseguia escrever numa planilha.

**O que se fazia antes.** Tratava-se o modelo como o sistema. A "cola" entre os componentes era invisível — não por ser pequena, mas **porque não tinha nome**.

**A virada.** Não foi inventar uma técnica. Foi **importar um vocabulário pronto de outro campo** — o de *dívida técnica*, da engenharia de software — e usá-lo para tornar o custo legível a quem decide orçamento. Um time de dez autores publicou o diagnóstico no NIPS 2015, e o vocabulário pegou.

**A ideia reaproveitável.** **Um problema que não tem nome não entra no orçamento.** Antes de inventar solução, verifique se o que falta é a *palavra*. Custo sem nome não é priorizado, não é medido e não é defendido em reunião — ele apenas cresce, e depois alguém leva a culpa por "lentidão do time".

**O nome.** *Technical debt* é de **Ward Cunningham**, num addendum aos anais da **OOPSLA '92**: *"Shipping first time code is like going into debt."* Entregar código na primeira versão é como contrair uma dívida — útil, desde que se pague antes que os juros comam o time.

> ### A leitura que fecha (📖)
>
> A figura 1 do artigo de 2015 é o par da AlexNet do [capítulo III.4](iii-4-visao.md). **Duas imagens que atravessaram um campo inteiro**: uma é um limite de 3 GB desenhado; a outra é uma caixa preta pequena no meio de treze retângulos. **Nenhuma das duas é um resultado — as duas são argumentos visuais**, e é por isso que sobreviveram. Um resultado é superado pelo resultado seguinte; um argumento visual só cai quando o argumento deixa de valer.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Tudo o que é atribuído a Sculley, Holt, Golovin, Davydov, Phillips, Ebner, Chaudhary, Young, Crespo e Dennison — figura 1, princípio CACE, dívida de configuração, *pipeline jungles* e os trechos citados entre aspas — de [*Hidden Technical Debt in Machine Learning Systems* (NIPS, 2015)](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems), **lido por inteiro** |
| ✓ | O aperto (2014–15, dentro do Google) e a ausência de vocabulário para o custo de manutenção |
| ✓ | A metáfora do *plumbing* (encanamento) **não é dos autores**: no artigo ela é creditada a **Lin e Ryaboy**. O crédito some em quase toda repetição da metáfora — registre-o quando repetir |
| ✓ᵐ | *Technical debt*, de **Ward Cunningham**, addendum aos anais da **OOPSLA '92**, e a frase *"Shipping first time code is like going into debt."* |
| ⏳ | *Feature store* como termo público em *"Meet Michelangelo: Uber's Machine Learning Platform"*, **setembro de 2017**, descrita como camada compartilhada que garante consistência entre offline e online — fonte é blog corporativo, **não aberto em primeira mão** |
| ⏳ | A formulação canônica de *train/serve skew* em *Rules of Machine Learning*, de **Martin Zinkevich** (Google), regras **#29 a #37** — com a #32 como receita central: reutilizar o código entre treino e serviço |
| 📖 | A leitura de que a virada foi importar vocabulário, e de que a figura 1 e a AlexNet são o par de imagens-argumento do campo |

## Fundamentos: o que é o sistema, além do modelo

A frase que o artigo repete, e que vale decorar: *"only a tiny fraction of the code in many ML systems is actually devoted to learning or prediction"* — apenas uma fração minúscula do código é de fato aprendizado ou predição. A legenda da figura 1 diz o resto: *"The required surrounding infrastructure is vast and complex."*

O que ocupa o espaço restante, componente a componente:

| Componente | O que faz | Onde falha |
|---|---|---|
| **Coleta** | trazer o dado de onde ele nasce (ver [cap. I.2](i-2-coleta-integracao.md)) | fonte muda de esquema sem avisar |
| **Validação de dados** | recusar o que está fora do contrato | não existe, e o lixo entra calado |
| **Extração de atributos** | transformar dado bruto em entrada do modelo | calculado de um jeito no treino, de outro no serviço |
| **Infraestrutura de serviço** | responder à chamada | latência, versão errada em produção |
| **Monitoramento** | perceber que algo mudou | mede a máquina, não a predição |
| **Gerenciamento de processos** | orquestrar quem roda quando | dependências implícitas entre jobs |

Os autores chamam esse entorno, **citando Lin e Ryaboy**, de *plumbing* — encanamento. É uma boa palavra: encanamento só é notado quando vaza.

### Por que dependências de dados são piores que dependências de código

Esta é a afirmação mais útil do artigo, e a que mais gente ignora: **dependências de dados custam mais que dependências de código**.

A razão é seca. Para dependência de código existe ferramenta — o compilador acusa, o *linker* quebra, o teste falha. **Para dependência de dados não há compilador.** Você consome um sinal produzido por outro time, aquele time muda a definição do sinal, e nada quebra: o modelo simplesmente piora, devagar, e ninguém liga uma coisa à outra. E há o efeito que dá nome ao princípio mais citado do artigo:

> *"No inputs are ever really independent. We refer to this here as the CACE principle: Changing Anything Changes Everything."*

Nenhuma entrada é realmente independente: mudar qualquer coisa muda tudo. E o princípio **não se limita aos sinais de entrada** — vale para hiperparâmetros, configurações de aprendizado, métodos de amostragem, limiares de convergência e seleção de dados. Remover um atributo aparentemente inútil não devolve o modelo anterior menos aquele atributo: devolve **outro modelo**.

:::exercicio {"id":"sistemas-de-ml-e1","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Você vai apresentar a arquitetura do sistema de recomendação da empresa. Qual descrição é fiel ao que um sistema de ML em produção é?

- [ ] O modelo é o sistema; coleta, serviço e monitoramento são detalhes de implantação.
- [x] O código de aprendizado é uma fração pequena do total; a maior parte é coleta, validação, extração de atributos, serviço, monitoramento e orquestração.
- [ ] O sistema é metade modelo e metade infraestrutura, em partes equilibradas.
- [ ] A infraestrutura só cresce depois que o modelo fica grande demais para uma máquina.

> **gabarito:** O código de aprendizado é uma fração pequena; o resto é infraestrutura
> **porque:** É exatamente o argumento da figura 1 de Sculley et al. (2015) — a caixa preta pequena no meio de treze retângulos — e do corpo do artigo: *"only a tiny fraction of the code in many ML systems is actually devoted to learning or prediction"*.
>
> A primeira alternativa é o erro que o capítulo inteiro combate, e é o mais comum: quem trata o modelo como o sistema não orça o resto, e o resto chega mesmo assim. A terceira erra a proporção — não é meio a meio, é uma fração minúscula. A quarta inverte a causa: o encanamento não aparece porque o modelo cresceu, ele existe desde o primeiro dia em produção; o que muda com o tempo é só a visibilidade do custo.
> **volte para:** #fundamentos-o-que-e-o-sistema-alem-do-modelo
:::

## As dívidas que têm nome

Nomear é o serviço que o artigo presta. Cada item abaixo é um custo que você já pagou sem saber chamar.

**Glue code.** O código que existe só para fazer um pacote de propósito geral caber no seu problema: adaptadores, conversões de formato, empacotamentos. É a maior parte do que se escreve em volta de uma biblioteca de ML, e não faz nada de ML.

**Pipeline jungle.** Caso particular de *glue code*, no lado dos dados. Os autores a descrevem como *"a jungle of scrapes, joins, and sampling steps"* — uma selva de raspagens, junções e amostragens que cresce por acréscimo, um sinal novo de cada vez. E o diagnóstico é organizacional, não técnico: *"symptomatic of integration issues that may have a root cause in overly separated 'research' and 'engineering' roles."* A selva é sintoma de papéis de pesquisa e engenharia separados demais. Quem for consertar a selva reescrevendo scripts, e não a divisão de trabalho, vai fazer uma selva nova.

**Modelos em cascata e o correction cascade.** Você tem um modelo que funciona. Precisa dele para um problema ligeiramente diferente, e o caminho barato é aprender uma correção por cima da saída dele. Depois outra correção por cima da correção. Cada camada acrescenta dependência e prende o sistema a um mínimo local: melhorar o modelo de baixo agora **piora** os de cima, que foram treinados para corrigir os defeitos antigos dele.

**Consumidores não declarados.** A sua saída está num arquivo, num tópico, numa tabela. Alguém a lê — e você não sabe quem. Isso transforma qualquer mudança sua num incidente de outra pessoa, e é a dívida mais silenciosa da lista: ela só aparece no dia em que você melhora alguma coisa.

**Dívida de configuração.** A que quase todo time subestima. O artigo é direto: *"In a mature system which is being actively developed, the number of lines of configuration can far exceed the number of lines of the traditional code."* Num sistema maduro em desenvolvimento ativo, as linhas de configuração podem superar em muito as de código. E ele traz os exemplos datados, do tipo *"o atributo A foi registrado incorretamente de 14/09 a 17/09"* — o tipo de detalhe que vive num arquivo de configuração e decide o resultado do treino. Dos seis princípios de boa configuração que o artigo lista, o último é o que mais dói e o mais fácil de adotar: *"Configurations should undergo a full code review and be checked into a repository."*

## Reduzir a dívida: versionar, contratar, apagar

Três movimentos, em ordem de retorno por esforço.

**1. Versione o dado e a configuração como você versiona código.** Configuração revisada e no repositório é a recomendação literal do artigo. Dado versionado é o que permite responder à pergunta que sempre aparece depois de um incidente: *com qual dado exatamente este modelo foi treinado?* Sem versão, essa pergunta não tem resposta — só opinião.

**2. Escreva contratos de entrada.** Um contrato declara, para cada atributo, o tipo, a faixa aceitável, a taxa de nulos tolerada e quem é o dono. O que o contrato compra é o compilador que não existe: com ele, uma mudança silenciosa na fonte vira **falha ruidosa** na sua fronteira, e não uma degradação lenta seis semanas depois. É o mesmo assunto de qualidade e vazamento do [capítulo I.3](i-3-dados.md), agora escrito como código executável.

**3. Apague código morto.** Atributo que não é mais usado, ramo experimental que nunca saiu, modelo que ninguém consulta. Cada um deles é superfície para o CACE agir e para um consumidor não declarado aparecer. Apagar é a única forma de pagamento de dívida que não cria dívida nova.

### O contrato entre treino e serviço

O *train/serve skew* é a fronteira mais cara do sistema: o mesmo atributo calculado de dois jeitos — um no treino, em lote, com a tabela inteira disponível; outro no serviço, sob latência, com o que chegou na requisição.

A formulação canônica está nas *Rules of Machine Learning*, de Martin Zinkevich, regras #29 a #37 (⏳). A regra #32 é a receita inteira, e é curta: **reutilize o código entre treino e serviço.** Não "escreva os dois com cuidado", não "documente a fórmula" — reutilize o mesmo código, de modo que a divergência se torne impossível em vez de improvável.

A *feature store* é a versão de plataforma dessa ideia: uma camada compartilhada que serve o mesmo atributo ao treino e à inferência. O termo aparece publicamente em setembro de 2017, na descrição do Michelangelo, plataforma de ML do Uber (⏳). O custo é que ela é mais uma peça de encanamento para manter — e o CACE também vale para ela.

:::exercicio {"id":"sistemas-de-ml-e2","tipo":"multipla-multi","objetivo":"O3","dificuldade":"media"}
Sua equipe calcula `media_de_compras_90d` num job Spark noturno para treinar, e reimplementa o mesmo atributo em Java no serviço de inferência. Quais medidas atacam de fato o *train/serve skew*? Marque todas que valem.

- [x] Extrair o cálculo do atributo para um único componente usado pelos dois caminhos.
- [x] Registrar em produção os atributos servidos e comparar sua distribuição com a do treino.
- [x] Declarar um contrato para o atributo (tipo, faixa, nulos) e verificá-lo nos dois lados.
- [ ] Aumentar a frequência do job noturno para de hora em hora.
- [ ] Retreinar o modelo com mais dados até que ele fique robusto à diferença.

> **gabarito:** unificar o código; monitorar as distribuições servida e de treino; contratar o atributo
> **porque:** As três corretas atacam a **causa** (duas implementações da mesma definição) ou garantem que a divergência apareça cedo. A primeira é a regra #32 na letra: reutilizar o código torna a divergência impossível, e não apenas improvável.
>
> As duas erradas são as tentações reais. Aumentar a frequência do job trata **frescor**, que é outro problema: a média de hora em hora continua sendo calculada por um código diferente do código do serviço, então o desvio persiste — só chega mais rápido. E retreinar com mais dados não corrige nada, porque o modelo continua sendo treinado com a versão *do treino* do atributo; mais dado só torna o modelo mais confiante sobre uma entrada que ele nunca verá em produção.
> **volte para:** #o-contrato-entre-treino-e-servico
:::

:::exercicio {"id":"sistemas-de-ml-e3","tipo":"aberta","objetivo":"O2","pontos":3,"dificuldade":"dificil"}
Um sistema de previsão de demanda funciona assim: um job diário raspa três bancos internos e uma planilha do time comercial, junta tudo e amostra os últimos 18 meses. Sobre a saída do modelo de demanda, um segundo modelo aplica uma correção sazonal, e um terceiro corrige a correção para as lojas do Nordeste. O time de precificação lê a tabela final — o time de demanda descobriu isso no mês passado. O comportamento do sistema é regido por um arquivo `params.yaml` de 600 linhas que fica na máquina do analista sênior.

Liste as dívidas ocultas deste sistema, **usando os nomes do capítulo**, e diga por onde você começaria a pagar — justificando a ordem.

> **rubrica:** identifica a pipeline jungle (raspagens + junções + amostragem crescendo por acréscimo);
> identifica a cascata de correções e explica que melhorar o modelo de base agora piora as camadas acima;
> identifica os consumidores não declarados (o time de precificação) e o risco que isso cria para qualquer mudança;
> identifica a dívida de configuração (600 linhas fora do repositório, sem revisão, sem versão);
> menciona a dependência de dados frágil da planilha do comercial e a ausência de contrato/validação;
> propõe uma ordem de pagamento com justificativa — e não apenas uma lista
> **porque:** A resposta fraca lista problemas genéricos ("falta documentação", "o código está bagunçado"). A resposta forte usa os nomes, porque **é o nome que faz o item entrar no orçamento** — a ideia reaproveitável deste capítulo.
>
> A ordem mais defensável começa pelo mais barato com maior redução de risco: **pôr o `params.yaml` no repositório, sob revisão**, é uma tarde de trabalho e elimina o ponto único de falha na máquina de uma pessoa. Em seguida, **declarar o contrato de entrada** — sobretudo o da planilha do comercial, que é a dependência de dados sem dono e sem compilador para acusá-la. Só então mexer na cascata, que é caro e exige negociar com quem depende dela. E, antes de qualquer mudança na saída, **descobrir e declarar os consumidores**: o time de precificação já é um; provavelmente não é o único.
>
> Repare que a resposta certa é organizacional tanto quanto técnica — a selva de pipelines é, no diagnóstico dos próprios autores, sintoma de papéis de pesquisa e engenharia separados demais.
> **volte para:** #as-dividas-que-tem-nome
:::

## Síntese — o que levar

- O código de aprendizado é uma **fração pequena** do sistema. O resto é encanamento — e encanamento só é notado quando vaza.
- **Um problema que não tem nome não entra no orçamento.** Às vezes o que falta não é solução: é a palavra.
- **Dependências de dados são piores que dependências de código**, porque não existe compilador que as acuse. Quem substitui o compilador é o **contrato de entrada**.
- **CACE:** mudar qualquer coisa muda tudo — inclusive hiperparâmetro, amostragem e limiar de convergência. Não existe mudança local num sistema que aprende.
- *Glue code*, *pipeline jungle*, cascata de correções, consumidores não declarados e configuração: cinco custos que você já paga — agora com nome. E **configuração é código**: revisão e repositório, sempre.
- Contra *train/serve skew*, **reutilize o código** entre treino e serviço. Documentar a fórmula duas vezes não é contrato.
- Apagar código morto é a única forma de pagar dívida sem criar dívida nova.
- A operação contínua desse sistema — o que monitorar, quando retreinar, como implantar — é o [capítulo V.3](v-3-mlops.md), a sequência direta deste. A decisão de **não lançar** está no [capítulo II.8](ii-8-do-modelo-a-decisao.md).

## Verificação

1. Desenhe, para um sistema que você conhece, os componentes além do modelo. Qual deles não existe hoje — e o que essa ausência já custou?
2. Um colega propõe remover um atributo "que não faz diferença" e diz que o resto do modelo fica igual. Por que o CACE contradiz isso, e o que você pediria antes de aprovar?
3. Escolha um atributo do seu sistema e descreva como ele é calculado no treino e no serviço. Se as duas descrições não citarem o mesmo código, qual é o seu plano — e por que "conferir com cuidado" não é um plano?
