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

**A virada.** Não foi inventar uma técnica. Foi **importar um vocabulário pronto de outro campo**, o de *dívida técnica*, da engenharia de software, e usá-lo para tornar o custo legível a quem decide orçamento. Um time de dez autores publicou o diagnóstico no NIPS 2015, e o vocabulário pegou.

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
| ✓ | O *feature store* na descrição do Michelangelo, plataforma de ML do Uber, como repositório central de atributos canônicos compartilhados entre times, em *["Meet Michelangelo: Uber's Machine Learning Platform"](https://www.uber.com/blog/michelangelo-machine-learning-platform/)* |
| ⏳ | A data de **setembro de 2017** para a aparição pública do termo, e a redação de que a camada "garante consistência entre offline e online": o texto aberto descreve o repositório compartilhado, e não confirma essa formulação. Nova tentativa em 2026-08-13 de reabrir a página para conferir a data: o domínio passou a responder **406**, e a data segue não conferida |
| ✓ | As regras **#31** e **#32** de *[Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml)*, de **Martin Zinkevich** (Google), lidas no texto da própria regra — com a #32 como receita central: reutilizar o código entre treino e serviço |
| ✓ | Que a formulação canônica de *train/serve skew* ocupe a faixa das regras **#29 a #37**: o documento tem uma seção intitulada *"Training-Serving Skew"* que começa depois da regra #28 e termina na #37, onde entra a "ML Phase III". Dessa seção vêm também a definição citada e as três causas. Página baixada e o texto varrido aqui |
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
> **porque:** É exatamente o argumento da figura 1 de Sculley et al. (2015), a caixa preta pequena no meio de treze retângulos, e do corpo do artigo: *"only a tiny fraction of the code in many ML systems is actually devoted to learning or prediction"*.
>
> A primeira alternativa é o erro que o capítulo inteiro combate, e é o mais comum: quem trata o modelo como o sistema não orça o resto, e o resto chega mesmo assim. A terceira erra a proporção — não é meio a meio, é uma fração minúscula. A quarta inverte a causa: o encanamento não aparece porque o modelo cresceu, ele existe desde o primeiro dia em produção; o que muda com o tempo é só a visibilidade do custo.
> **volte para:** #fundamentos-o-que-e-o-sistema-alem-do-modelo
:::

:::exercicio {"id":"sistemas-de-ml-e4","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Um time descreve assim o sistema de risco de crédito dele: um job noturno lê a base de propostas, um script calcula os atributos, o modelo treinado é salvo em disco, e uma API carrega esse arquivo e responde às consultas do time comercial. Existe um painel com uso de processador, memória e tempo de resposta da API.

Pela lista de componentes deste capítulo, qual deles o relato não menciona nenhuma vez?

- [ ] Coleta
- [x] Validação de dados
- [ ] Extração de atributos
- [ ] Infraestrutura de serviço

> **gabarito:** validação de dados
> **porque:** Os outros três estão no relato: ler a base de propostas é coleta, o script que calcula os atributos é extração, e a API é a infraestrutura de serviço. Não há, em lugar nenhum, algo que recuse uma entrada fora do contrato.
>
> É a ausência mais comum e a mais cara, pela razão que o capítulo dá: para dependência de dado não existe compilador. Quando a fonte muda de esquema sem avisar, nada quebra. O job roda, a API responde, e o modelo apenas piora, devagar, com todos os indicadores verdes.
> **volte para:** #fundamentos-o-que-e-o-sistema-alem-do-modelo
:::

:::exercicio {"id":"sistemas-de-ml-e5","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Seis meses depois, o mesmo sistema de risco de crédito está com todos os indicadores verdes: a API responde em 40 ms, nenhuma requisição falha, a memória está estável. Ainda assim, a inadimplência entre as propostas aprovadas dobrou.

Qual descrição do sistema explica melhor essa combinação?

- [x] O monitoramento existe, mas mede a máquina e não a predição; um modelo pode piorar sem que nenhum indicador de infraestrutura se mexa.
- [ ] A infraestrutura de serviço está degradada, e o painel não é sensível o bastante para capturar isso.
- [ ] O modelo foi treinado com dado insuficiente e nunca foi bom de verdade.
- [ ] A extração de atributos ficou mais lenta e passou a truncar valores no meio do cálculo.

> **gabarito:** o monitoramento mede a máquina, não a predição
> **porque:** É a linha da tabela de componentes sobre monitoramento, e o modo de falha dela. Saúde de infraestrutura e qualidade de predição são grandezas independentes: a segunda pode desabar com a primeira intacta, porque o que mudou está no dado que entra e não na máquina que responde.
>
> As três erradas ficam de pé apenas enquanto ninguém confere os números do enunciado. Degradação de serviço apareceria nos 40 ms. Um modelo que nunca foi bom não explica uma inadimplência que dobrou, porque dobrar é uma mudança, e o que sempre foi ruim não muda. E truncamento na extração é uma hipótese razoável de causa, só que ela também não seria vista por este painel, o que a torna um exemplo do mesmo problema em vez de uma alternativa a ele.
> **volte para:** #fundamentos-o-que-e-o-sistema-alem-do-modelo
:::

## As dívidas que têm nome

Nomear é o serviço que o artigo presta. Cada item abaixo é um custo que você já pagou sem saber chamar.

**Glue code.** O código que existe só para fazer um pacote de propósito geral caber no seu problema: adaptadores, conversões de formato, empacotamentos. É a maior parte do que se escreve em volta de uma biblioteca de ML, e não faz nada de ML.

**Pipeline jungle.** Caso particular de *glue code*, no lado dos dados. Os autores a descrevem como *"a jungle of scrapes, joins, and sampling steps"* — uma selva de raspagens, junções e amostragens que cresce por acréscimo, um sinal novo de cada vez. E o diagnóstico é organizacional, não técnico: *"symptomatic of integration issues that may have a root cause in overly separated 'research' and 'engineering' roles."* A selva é sintoma de papéis de pesquisa e engenharia separados demais. Quem for consertar a selva reescrevendo scripts, e não a divisão de trabalho, vai fazer uma selva nova.

**Modelos em cascata e o correction cascade.** Você tem um modelo que funciona. Precisa dele para um problema ligeiramente diferente, e o caminho barato é aprender uma correção por cima da saída dele. Depois outra correção por cima da correção. Cada camada acrescenta dependência e prende o sistema a um mínimo local: melhorar o modelo de baixo agora **piora** os de cima, que foram treinados para corrigir os defeitos antigos dele.

**Consumidores não declarados.** A sua saída está num arquivo, num tópico, numa tabela. Alguém a lê — e você não sabe quem. Isso transforma qualquer mudança sua num incidente de outra pessoa, e é a dívida mais silenciosa da lista: ela só aparece no dia em que você melhora alguma coisa.

**Dívida de configuração.** A que quase todo time subestima. O artigo é direto: *"In a mature system which is being actively developed, the number of lines of configuration can far exceed the number of lines of the traditional code."* Num sistema maduro em desenvolvimento ativo, as linhas de configuração podem superar em muito as de código. E ele traz os exemplos datados, do tipo *"o atributo A foi registrado incorretamente de 14/09 a 17/09"* — o tipo de detalhe que vive num arquivo de configuração e decide o resultado do treino. Dos seis princípios de boa configuração que o artigo lista, o último é o que mais dói e o mais fácil de adotar: *"Configurations should undergo a full code review and be checked into a repository."*

:::exercicio {"id":"sistemas-de-ml-e6","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Metade do código do repositório do time converte o dataframe para o formato que a biblioteca espera, renomeia colunas, embrulha a chamada de treino e desembrulha o resultado. Nada disso faz aprendizado nem predição.

Que nome este capítulo dá a esse custo?

- [x] Glue code
- [ ] Pipeline jungle
- [ ] Cascata de correções
- [ ] Consumidor não declarado

> **gabarito:** glue code
> **porque:** É a definição literal: código que existe só para fazer um pacote de propósito geral caber no seu problema, feito de adaptadores, conversões de formato e empacotamentos.
>
> As outras três são dívidas reais, mas de outro formato. A selva de pipelines é o caso particular do glue code no lado dos dados, com raspagens, junções e amostragens que crescem por acréscimo. A cascata é um modelo aprendendo a corrigir a saída de outro. E consumidor não declarado é quem lê a sua saída sem que você saiba.
> **volte para:** #as-dividas-que-tem-nome
:::

:::exercicio {"id":"sistemas-de-ml-e7","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Dois times descrevem problemas diferentes. No time A, um job diário raspa quatro fontes, junta, amostra, e ganha um passo novo toda vez que alguém pede um sinal novo; ninguém consegue dizer de cor o que o job faz hoje. No time B, o modelo de preço aprende sobre a saída do modelo de demanda, e uma terceira etapa corrige o preço para as lojas com estoque baixo.

Qual par de nomes descreve A e B, nessa ordem?

- [x] Pipeline jungle e cascata de correções
- [ ] Glue code e pipeline jungle
- [ ] Cascata de correções e pipeline jungle
- [ ] Dívida de configuração e glue code

> **gabarito:** pipeline jungle e cascata de correções
> **porque:** O time A tem a selva: raspagens, junções e amostragens que crescem uma de cada vez, até ninguém conseguir descrever o todo. O time B tem a cascata: uma correção aprendida sobre a saída de outro modelo, e depois uma correção sobre a correção.
>
> Vale reter o que cada nome antecipa, porque é aí que ele paga. A selva é sintoma organizacional, não técnico: no diagnóstico dos próprios autores, ela vem de papéis de pesquisa e engenharia separados demais, e quem a conserta reescrevendo script faz uma selva nova. A cascata prende o sistema num mínimo local: melhorar o modelo de demanda agora piora os de cima, que foram treinados para corrigir os defeitos antigos dele.
> **volte para:** #as-dividas-que-tem-nome
:::

## Reduzir a dívida: versionar, contratar, apagar

Três movimentos, em ordem de retorno por esforço.

**1. Versione o dado e a configuração como você versiona código.** Configuração revisada e no repositório é a recomendação literal do artigo. Dado versionado é o que permite responder à pergunta que sempre aparece depois de um incidente: *com qual dado exatamente este modelo foi treinado?* Sem versão, essa pergunta não tem resposta — só opinião.

**2. Escreva contratos de entrada.** Um contrato declara, para cada atributo, o tipo, a faixa aceitável, a taxa de nulos tolerada e quem é o dono. O que o contrato compra é o compilador que não existe: com ele, uma mudança silenciosa na fonte vira **falha ruidosa** na sua fronteira, e não uma degradação lenta seis semanas depois. É o mesmo assunto de qualidade e vazamento do [capítulo I.3](i-3-dados.md), agora escrito como código executável.

**3. Apague código morto.** Atributo que não é mais usado, ramo experimental que nunca saiu, modelo que ninguém consulta. Cada um deles é superfície para o CACE agir e para um consumidor não declarado aparecer. Apagar é a única forma de pagamento de dívida que não cria dívida nova.

### O contrato entre treino e serviço

O *train/serve skew* é a fronteira mais cara do sistema. A definição da fonte é mais larga que a intuição corrente: *"training-serving skew is a difference between performance during training and performance during serving"*, e ela lista **três causas**, não uma. Divergência em como o dado é tratado nos dois encanamentos; mudança no dado entre o momento de treinar e o de servir; e realimentação entre o modelo e o algoritmo.

Este capítulo trata sobretudo da primeira, que é a mais barata de evitar e a mais cara de descobrir: o mesmo atributo calculado de dois jeitos, um no treino, em lote, com a tabela inteira disponível, e outro no serviço, sob latência, com o que chegou na requisição. A segunda é o *drift* do [capítulo V.3](v-3-mlops.md), e a terceira é o laço de realimentação que a regra #36 da mesma fonte trata à parte.

A formulação canônica está nas *Rules of Machine Learning*, de Martin Zinkevich: o documento tem uma seção com esse nome exato, **"Training-Serving Skew"**, e ela vai da regra #29 à #37 ✓. A regra #32 é a receita inteira, e é curta: **reutilize o código entre treino e serviço.** Não "escreva os dois com cuidado", não "documente a fórmula": reutilize o mesmo código, de modo que a divergência se torne impossível em vez de improvável.

A *feature store* é a versão de plataforma dessa ideia: uma camada compartilhada que serve o mesmo atributo ao treino e à inferência. O termo aparece publicamente em setembro de 2017, na descrição do Michelangelo, plataforma de ML do Uber (⏳). O custo é que ela é mais uma peça de encanamento para manter — e o CACE também vale para ela.

:::exercicio {"id":"sistemas-de-ml-e8","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
A regra #32 manda reutilizar o código entre treino e serviço. Um colega propõe, no lugar, documentar a fórmula do atributo num wiki que as duas equipes consultam antes de mexer.

O que a proposta dele deixa de comprar?

- [x] A divergência deixa de ser impossível e volta a ser apenas improvável: duas implementações da mesma fórmula podem divergir, e nada acusa no dia em que divergirem.
- [ ] Nada de importante: documentação e código compartilhado dão a mesma garantia, e a documentação sai mais barata de manter.
- [ ] A documentação é pior só porque envelhece; enquanto estiver atualizada, o risco de divergência é o mesmo dos dois lados.
- [ ] O que se perde é desempenho, porque código compartilhado evita calcular o mesmo atributo duas vezes.

> **gabarito:** a divergência volta a ser improvável em vez de impossível
> **porque:** É a diferença entre as duas frases, e ela é toda a regra #32. Código compartilhado remove a possibilidade de divergir, porque não existem duas implementações para divergirem. Documento compartilhado remove apenas a intenção de divergir, e intenção não é garantia.
>
> A terceira é a errada mais interessante, porque quase acerta: ela admite que o documento envelhece, mas supõe que um documento atualizado equivale ao código. Não equivale. Duas equipes lendo a mesma fórmula correta ainda implementam arredondamento, fuso, ordem de filtro e tratamento de nulo de dois jeitos. E a quarta troca o assunto: o ganho da regra #32 é de correção, não de custo de máquina.
> **volte para:** #o-contrato-entre-treino-e-servico
:::

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

:::exercicio {"id":"sistemas-de-ml-e9","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
O seu modelo de evasão usa o atributo `dias_desde_ultimo_login`. No treino ele sai da tabela de eventos, com o histórico inteiro à disposição; no serviço, ele vem do que a aplicação manda na requisição.

Projete o contrato dessa fronteira. Diga o que o contrato declara, onde ele é verificado, o que acontece quando é violado, e o que você muda no código para que a divergência deixe de ser possível.

> **rubrica:** declara o contrato do atributo com tipo, faixa aceitável, taxa de nulos tolerada e dono;
> verifica o contrato nos DOIS lados da fronteira, e não só no treino;
> define a violação como falha ruidosa, e justifica por que recusar é melhor que seguir com o valor suspeito;
> propõe extrair o cálculo para um componente único usado pelo treino e pelo serviço, e não apenas conferir as duas implementações uma contra a outra;
> trata a ausência do campo pela cláusula de nulos do contrato, em vez de deixar cada lado inventar um valor padrão;
> menciona comparar a distribuição servida com a do treino como a rede que pega o que o contrato não pega
> **porque:** A resposta fraca descreve uma conferência: alguém lê os dois códigos e confirma que batem. Isso protege até o dia em que um dos dois for alterado, o que é o dia em que a proteção é necessária. A resposta forte remove a duplicação, que é a regra #32 na letra.
>
> A cláusula de nulos é a parte que mais gente esquece, e neste atributo ela decide o resultado. Um usuário que nunca entrou não tem dias desde o último login. Se um lado resolve isso com zero e o outro com o valor máximo, os dois estão calculando coisas opostas a partir do mesmo caso, e o modelo vê em produção uma entrada que nunca viu no treino. Por isso o padrão pertence ao contrato, e não ao gosto de quem implementa cada lado.
>
> O monitoramento de distribuição entra por último de propósito: ele não impede a divergência, ele a denuncia. Serve para o que o contrato não cobre, que é a mudança de significado sem mudança de tipo nem de faixa, o mesmo ponto cego da dependência de dado que abre este capítulo.
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

## Decidir a forma de serviço pelo requisito

A seção anterior resolveu **como** o atributo é calculado. Falta **quando** a predição é calculada, e essa é uma decisão de desenho, não de implantação: ou ela é calculada antes, em lote, e fica guardada até alguém pedir, ou é calculada na hora em que o pedido chega.

A regra #32 abre justamente por aí, antes de falar em reúso de código:

> *"Batch processing is different than online processing. In online processing, you must handle each request as it arrives (e.g. you must do a separate lookup for each query), whereas in batch processing, you can combine tasks (e.g. making a join)."*

Processamento em lote é diferente de processamento em linha: no segundo você atende cada requisição quando ela chega, enquanto no primeiro você pode combinar tarefas. As três formas usuais:

| Forma | Quando serve | Latência típica |
|---|---|---|
| **Lote** | a decisão pode esperar horas; as predições são calculadas de uma vez e guardadas | minutos a horas |
| **Em linha** | a decisão é pedida na hora, uma requisição de cada vez | milissegundos |
| **Fluxo** | a decisão acompanha um fluxo contínuo de eventos | segundos |

Quatro eixos decidem entre elas, e nenhum deles é gosto.

**1. Quando a decisão é necessária.** É o eixo mais fácil e o único que quase todo time considera. Se o resultado é consumido por uma tela que abre de manhã, ou por uma campanha que sai na terça, a predição pode ser calculada de madrugada. Se ela responde a um clique, não pode.

**2. Quanto custa calcular o atributo, dentro do orçamento de latência.** É o eixo decisivo, e o que mais gente descobre tarde. Quando a predição é feita na hora, o custo de obter os atributos entra inteiro no tempo que o usuário espera. Huyen é direta: *"Because real-time features are computed upon receiving prediction requests, their computation latency adds directly to user-facing latency."* Se calcular o atributo custa 800 ms e o orçamento da tela é 100 ms, o modelo em linha já perdeu, por mais preciso que seja.

A escala real ajuda a calibrar. No Michelangelo, do Uber, o serviço reporta *"P95 latency of less than 5 milliseconds (ms)"* sem buscar atributo externo, e *"less than 10ms"* quando busca atributos no Cassandra. O orçamento inteiro de uma predição em linha cabe na casa de poucos milissegundos, e é dentro dele que o cálculo do atributo precisa caber.

Há o caso extremo, em que o custo não é alto e sim proibitivo: o atributo simplesmente não pode ser calculado sob demanda. O texto do Michelangelo dá o exemplo de que *"it is not possible to directly query the UberEATS order service to compute the average meal prep time for a restaurant over a specific period of time"*. Quando o atributo é uma agregação sobre uma janela de histórico, alguém precisa tê-la calculado antes, e isso força pré-cálculo mesmo num sistema que responde na hora.

**3. Frescor.** Predição guardada envelhece, e o mundo não espera pelo próximo job. É a regra #31, que descreve o mesmo mecanismo do lado do atributo: *"Between training and serving time, features in the table may be changed. Your model's prediction for the same document may then differ between training and serving."* A pergunta a fazer é quanto de desatualização a decisão tolera. Atributo recalculado quase em tempo real fica com defasagem *"in the order of seconds"*, enquanto o de um job diário passa o dia inteiro envelhecendo.

**4. Volume e desperdício.** Em lote você calcula para a base toda, inclusive para quem nunca vai aparecer, e paga por isso; em compensação, combina o trabalho numa junção só e o custo por predição despenca. Em linha você só calcula para quem pediu, e paga por manter a capacidade de responder a qualquer momento.

### A armadilha, que tem duas bocas

A primeira boca é escolher em linha por modernidade. A recomendação existe e é de autora conhecida: Huyen escreve que *"Batch prediction is largely a product of legacy systems"* e que *"If you're building a new ML system today, it's possible to start with online prediction."* Leia isso como o que é, uma recomendação de autora e não um fato do campo, porque o eixo 2 continua valendo depois dela. Quem adota a recomendação sem medir o custo do atributo chega ao mesmo lugar do exemplo do UberEATS, com um sistema em linha que precisa de uma agregação que ninguém consegue calcular a tempo.

A segunda boca é escolher lote e esquecer o relógio. A predição estava certa quando foi calculada, e é servida horas depois como se ainda estivesse. Esse defeito não aparece em nenhuma métrica de teste, porque no teste a predição e o rótulo são do mesmo instante.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | As regras **#31** e **#32** de *[Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml)*, de Martin Zinkevich, e os trechos citados entre aspas, conferidos no texto da regra |
| ✓ | Os números de latência e o exemplo do tempo de preparo do UberEATS, de *["Meet Michelangelo: Uber's Machine Learning Platform"](https://www.uber.com/blog/michelangelo-machine-learning-platform/)* |
| ✓ | As frases atribuídas a **Chip Huyen** sobre latência de atributo, defasagem e sistemas legados, de *["Real-time machine learning: challenges and solutions"](https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html)*, 2022 |
| ✓ᵐ | Que a escolha é tratada como assunto de projeto na indústria: é o capítulo 7 de *Designing Machine Learning Systems*, com a seção "Batch Prediction Versus Online Prediction", e são os padrões 16 e 17 de *Machine Learning Design Patterns*. **Sumários conferidos; o corpo dos dois capítulos está atrás de paywall e não foi lido** |
| ❌ | A escolha **não** vem das fontes-base dos dois capítulos: procurei *batch*, *online*, *latency* e *real-time* no artigo de Sculley et al. (2015) e o contraste não está lá, nem está no *Continuous Delivery for Machine Learning* |
| 📖 | A ordem dos quatro eixos, e a leitura de que o custo do atributo é o eixo decisivo por ser o que o time descobre mais tarde |

:::exercicio {"id":"sistemas-de-ml-e10","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Um banco calcula, para cada cliente, a propensão a aceitar uma oferta de crédito. A lista de clientes propensos é usada pela equipe de campanha, que monta o disparo de e-mail de segunda-feira olhando o resultado na sexta.

Qual forma de serviço o requisito pede?

- [x] Em lote, porque a decisão pode esperar e ninguém está aguardando resposta.
- [ ] Em linha, porque o cálculo por cliente precisa da versão mais recente do modelo.
- [ ] Em linha, porque é a forma que qualquer sistema novo deve adotar hoje.
- [ ] Por fluxo, porque a lista muda a cada evento de novo cliente.

> **gabarito:** em lote
> **porque:** O requisito é o que decide, e aqui ele é explícito: o consumo acontece na sexta para um disparo na segunda. Ninguém espera na frente de uma tela, então não há orçamento de latência a respeitar, e calcular tudo de uma vez sai mais barato por predição.
>
> A segunda alternativa troca frescor do modelo por forma de serviço, que são coisas diferentes: um job em lote pode perfeitamente usar o modelo recém-promovido. A terceira é a armadilha da seção em pessoa, e a resposta a ela é que nenhuma recomendação geral substitui o requisito deste caso. A quarta escolhe fluxo por um evento que não tem urgência alguma: cliente novo entra na lista do próximo lote sem prejuízo nenhum.
> **volte para:** #decidir-a-forma-de-servico-pelo-requisito
:::

:::exercicio {"id":"sistemas-de-ml-e11","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Uma loja quer ordenar as vitrines da página inicial no momento em que ela abre. O orçamento de latência da página para essa chamada é de 80 ms. Um dos atributos do modelo é a média de tempo de entrega do vendedor nos últimos 30 dias, e consultar o serviço de pedidos para calculá-la leva cerca de 400 ms.

Qual desenho atende ao requisito?

- [x] Servir em linha, com o atributo de 30 dias pré-calculado e guardado, e apenas lido no momento da requisição.
- [ ] Servir em lote de madrugada, guardando a ordenação pronta de cada vitrine para cada cliente.
- [ ] Servir em linha e calcular o atributo na requisição, aceitando que a página passe do orçamento em alguns casos.
- [ ] Trocar o atributo de 30 dias por outro mais barato, porque atributo caro não cabe em serviço em linha.

> **gabarito:** em linha, com o atributo agregado pré-calculado
> **porque:** O requisito exige resposta na abertura da página, o que descarta lote. E o eixo 2 diz que 400 ms não cabem em 80 ms. As duas coisas juntas não são contraditórias: o que precisa ser feito na hora é a predição, e não a agregação. Pré-calcular a janela de 30 dias e apenas lê-la é exatamente o que o exemplo do UberEATS descreve, e é para isso que existe a camada compartilhada de atributos.
>
> A segunda falha pela combinação de clientes e vitrines, que faz a ordenação depender de quem abriu a página. A terceira aceita estourar o orçamento, o que não é uma decisão de desenho e sim a ausência de uma. A quarta é a mais tentadora e a mais cara: ela joga fora um atributo bom por um problema que é de arquitetura, e não do atributo. O custo alto é de calcular sob demanda, não de usar.
> **volte para:** #decidir-a-forma-de-servico-pelo-requisito
:::

:::exercicio {"id":"sistemas-de-ml-e12","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Um sistema antifraude decide, no instante da compra, se o cartão passa. Hoje ele serve em lote: de hora em hora, um job recalcula um escore de risco por cartão, e a autorização apenas consulta o escore guardado. O time relata que fraudes em rajada, concentradas em poucos minutos, passam quase todas.

Quais afirmações sustentam a mudança para serviço em linha? Marque todas que valem.

- [x] A decisão é pedida no instante da compra, e o requisito de quando decidir é o primeiro eixo da escolha.
- [x] O escore guardado envelhece até uma hora, e uma rajada acontece inteira dentro desse intervalo.
- [x] Um atributo que depende da compra que está sendo feita não existe no momento em que o job roda.
- [ ] Serviço em lote é um resíduo de sistemas legados, e sistemas novos devem começar em linha.
- [ ] Serviço em linha é mais preciso, porque usa o modelo mais recente a cada requisição.

> **gabarito:** o instante da decisão; a defasagem de uma hora contra a duração da rajada; o atributo que só existe na requisição
> **porque:** As três corretas são os eixos aplicados a este caso. A defasagem é a mais concreta: se a janela de recálculo é de uma hora e a rajada dura minutos, o escore consultado foi calculado num mundo em que a fraude ainda não tinha começado. E há atributos que sequer podem existir em lote, como a distância entre esta compra e a anterior do mesmo cartão, porque a compra ainda não aconteceu quando o job rodou.
>
> A quarta é a citação da seção usada como argumento, e é por isso que ela está aqui. Ela é recomendação de autora, não fato, e mesmo que fosse verdadeira em geral não diria nada sobre este sistema. Repare que a decisão certa neste caso não precisa dela: os três eixos já bastam, e é assim que se decide pelo requisito e não pelo gosto. A quinta confunde forma de serviço com versão do modelo. Um job em lote roda o modelo que estiver promovido, e trocar a forma não melhora a qualidade da predição, apenas o instante em que ela é feita e o que está disponível para fazê-la.
> **volte para:** #decidir-a-forma-de-servico-pelo-requisito
:::

## Síntese — o que levar

- O código de aprendizado é uma **fração pequena** do sistema. O resto é encanamento — e encanamento só é notado quando vaza.
- **Um problema que não tem nome não entra no orçamento.** Às vezes o que falta não é solução: é a palavra.
- **Dependências de dados são piores que dependências de código**, porque não existe compilador que as acuse. Quem substitui o compilador é o **contrato de entrada**.
- **CACE:** mudar qualquer coisa muda tudo — inclusive hiperparâmetro, amostragem e limiar de convergência. Não existe mudança local num sistema que aprende.
- *Glue code*, *pipeline jungle*, cascata de correções, consumidores não declarados e configuração: cinco custos que você já paga — agora com nome. E **configuração é código**: revisão e repositório, sempre.
- Contra *train/serve skew*, **reutilize o código** entre treino e serviço. Documentar a fórmula duas vezes não é contrato.
- Apagar código morto é a única forma de pagar dívida sem criar dívida nova.
- A forma de serviço sai do **requisito**, por quatro eixos: quando a decisão é necessária, quanto custa calcular o atributo dentro do orçamento de latência, quanto de defasagem a decisão tolera, e o volume. O eixo do custo do atributo é o que se descobre tarde, e o que decide.
- A operação contínua desse sistema (o que monitorar, quando retreinar, como implantar) é o [capítulo V.3](v-3-mlops.md), a sequência direta deste. A decisão de **não lançar** está no [capítulo II.8](ii-8-do-modelo-a-decisao.md).

## Verificação

1. Desenhe, para um sistema que você conhece, os componentes além do modelo. Qual deles não existe hoje — e o que essa ausência já custou?
2. Um colega propõe remover um atributo "que não faz diferença" e diz que o resto do modelo fica igual. Por que o CACE contradiz isso, e o que você pediria antes de aprovar?
3. Escolha um atributo do seu sistema e descreva como ele é calculado no treino e no serviço. Se as duas descrições não citarem o mesmo código, qual é o seu plano — e por que "conferir com cuidado" não é um plano?
