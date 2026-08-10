# 19 — O Ciclo da Ciência de Dados

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-08 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Descrever as seis fases do CRISP-DM e o que cada uma entrega.
- **O2.** Justificar por que entendimento de negócio vem antes de qualquer dado.
- **O3.** Reconhecer que o ciclo é iterativo, e não uma cascata.
- **O4.** Distinguir os papéis de cientista de dados, engenheiro de dados e engenheiro de ML.

## O problema: um modelo excelente para a pergunta errada

Um varejista pede um modelo de *churn*. A equipe recebe acesso ao banco, encontra a tabela de compras, define o rótulo pelo que os dados permitem — "cliente que não compra há 90 dias" — treina, mede e entrega AUC de 0,93. O relatório é bonito. O modelo nunca foi usado.

O motivo apareceu na primeira reunião com a área de retenção: eles só conseguem agir sobre um cliente **na renovação do plano**, e a renovação acontece antes dos 90 dias de silêncio. Quando o modelo acusa risco, o cliente já foi embora. A lista chega tarde para todo mundo que poderia fazer algo com ela.

Nenhuma métrica do [capítulo 04](04-avaliacao.md) capturaria isso. O modelo é bom; o alvo é que responde a uma pergunta que ninguém tinha. E repare no mecanismo do erro: a equipe começou **pelos dados disponíveis**, e o rótulo saiu do que era fácil de calcular, não do que era possível decidir.

O CRISP-DM (*CRoss-Industry Standard Process for Data Mining*) existe para tornar esse erro difícil de cometer. Ele coloca *entendimento do negócio* como fase 1 e *modelagem* como fase 4 — e essa ordem é a lição inteira do capítulo.

## De onde isto veio

**O aperto.** Meados dos anos 1990. Mineração de dados era um mercado novo, com dinheiro entrando e nenhum acordo sobre como se trabalha. Cada projeto reinventava seu próprio processo. Dois times na mesma empresa entregavam relatórios que não se comparavam; duas empresas não conseguiam repetir o que a outra tinha feito. Não havia como saber se um resultado ruim veio do problema, dos dados ou de alguém ter pulado uma etapa — porque não existia a lista de etapas.

**O que se fazia antes.** Consultoria: cada casa trazia seu método interno, não publicado, casado com a ferramenta que vendia. E ferramenta se vendia sem método nenhum — comprava-se o *workbench*, e o cliente que descobrisse sozinho o que fazer com ele.

**A virada.** Escrever um processo **de indústria**, e não de fornecedor. Seis fases explicitamente **cíclicas**, com *entendimento do negócio* na primeira posição e *modelagem* apenas na quarta. O documento não pertence a ninguém, não exige software algum e descreve entregas, não cliques.

**A ideia reaproveitável.** **O método é o produto, não a ferramenta.** Quando um campo novo ainda não tem processo comum, o processo comum vale mais do que qualquer algoritmo: é ele que torna o resultado **auditável** (dá para perguntar em que fase a coisa desandou) e **transferível** (outra equipe consegue continuar o trabalho). Vale para muito além de mineração de dados — é a mesma razão pela qual um repositório com README, testes e CI vale mais que um repositório com código mais esperto.

**O nome.** *CRoss-Industry Standard Process for Data Mining*. O "cross-industry" não é enfeite, é a tese: o processo não pode pertencer a um setor nem a um vendedor, ou volta a ser método de consultoria.

Concebido no fim de 1996, virou projeto europeu com financiamento **ESPRIT** em 1997, tocado por um consórcio de cinco organizações: a ISL — depois absorvida pela SPSS, autora do Clementine, o primeiro *workbench* comercial de mineração, de 1994 —, a Teradata, a NCR, a Daimler-Benz e a seguradora holandesa OHRA. Foi testado em projetos reais na Mercedes-Benz e na OHRA, e a versão 1.0 saiu em 1999 ([guia CRISP-DM 1.0](https://www.kde.cs.uni-kassel.de/lehre/ws2012-13/kdd/files/CRISPWP-0800.pdf)).

Olhe outra vez para a lista do consórcio: uma **montadora** e uma **seguradora** sentadas na mesma mesa. A prova de conceito do "cross-industry" está na composição do grupo — se o mesmo processo servisse para fabricar carros e para precificar apólices, servia para o resto.

> **A restrição material gerou a forma.** O CRISP-DM não é fruto de uma boa ideia solta: é resposta a um mercado sem linguagem comum. O livro já viu isso duas vezes — no [capítulo 22](22-visualizacao-storytelling.md), Playfair inventa o gráfico de barras porque **não tinha** a série temporal que os outros gráficos exigiam; no [capítulo 18](18-neuronio-artificial.md), o neurônio de 1943 nasce sem aprendizado porque não havia como treinar coisa alguma. Falta de recurso é o que mais produz forma nova.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | A estrutura de seis fases cíclicas e o nome por extenso, pelo guia CRISP-DM 1.0 (1999) — documento localizado e identificado, **não lido por inteiro** |
| ✓ᵐ | A cronologia (concepção no fim de 1996, ESPRIT em 1997, versão 1.0 em 1999), a composição do consórcio (ISL/SPSS, Teradata, NCR, Daimler-Benz, OHRA), os testes na Mercedes-Benz e na OHRA, e o Clementine (1994) como primeiro *workbench* comercial |
| ⏳ | O estado do mercado em meados dos anos 1990: processo ad hoc por consultoria, ferramenta vendida sem método, resultados não comparáveis nem repetíveis entre empresas |
| ⏳ | Que a presença de uma seguradora ao lado de uma montadora funcione como prova de conceito do "cross-industry" |
| 📖 | A ideia reaproveitável ("o método é o produto, não a ferramenta") e a leitura de que o processo comum é o que torna o resultado auditável e transferível |

## Fundamentos: as seis fases e o que cada uma entrega

Uma fase não termina quando o tempo acaba — termina quando ela **entrega** o artefato que a fase seguinte consome.

| # | Fase | A pergunta que ela responde | O que entrega |
|---|---|---|---|
| 1 | **Entendimento do negócio** | que decisão vai mudar, de quem, e quando? | objetivo de negócio, critério de sucesso, restrição de ação |
| 2 | **Entendimento dos dados** | o que existe, e dá para confiar? | inventário das fontes, primeiras estatísticas, problemas de qualidade |
| 3 | **Preparação dos dados** | como isto vira uma tabela treinável? | conjunto de treino/teste, atributos, rótulo definido |
| 4 | **Modelagem** | que família de modelo, com que hiperparâmetros? | modelos treinados e seus resultados técnicos |
| 5 | **Avaliação** | isto resolve o problema da fase 1? | decisão de seguir, iterar ou parar |
| 6 | **Implantação** | como isto chega a quem decide, e continua funcionando? | sistema em produção, monitoramento, plano de manutenção |

Três fases já têm capítulo próprio neste livro. A **preparação dos dados** é o assunto do [capítulo 02](02-dados.md) e do [capítulo 20](20-coleta-integracao.md). A **avaliação** técnica — matriz de confusão, métrica escolhida pelo custo do erro — é o [capítulo 04](04-avaliacao.md). A **implantação** é o [capítulo 15](15-sistemas-de-ml.md) e o [capítulo 16](16-mlops.md).

E vale separar duas coisas que o vocabulário mistura. A métrica que você calcula dentro da fase 4 responde *"o modelo aprendeu?"*. A fase 5 responde *"e daí?"* — se o ganho de AUC vira dinheiro, se a lista chega a tempo de alguém agir, se o critério escrito na fase 1 foi atingido. Um modelo pode passar na primeira e reprovar na segunda. Foi exatamente o que aconteceu com o *churn* do início do capítulo.

:::exercicio {"id":"19-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Uma seguradora pede um modelo para "reduzir os sinistros de automóvel". O projeto tem seis semanas. O que o CRISP-DM manda fazer na primeira?

- [ ] Levantar as tabelas disponíveis no *data warehouse* e medir a qualidade de cada campo.
- [x] Descobrir qual decisão vai mudar por causa do modelo, quem a toma e com quanta antecedência.
- [ ] Treinar um modelo simples de linha de base, para saber se o problema tem sinal.
- [ ] Definir a métrica de avaliação e separar o conjunto de teste.

> **gabarito:** Descobrir qual decisão vai mudar, quem a toma e quando
> **porque:** "Reduzir sinistros" não é um problema de mineração de dados — é um objetivo de negócio, e dele saem alvos completamente diferentes: prever quem vai bater o carro, recusar propostas de risco, reprecificar apólices na renovação, priorizar vistoria. Cada um exige rótulo, dado e prazo distintos. Sem essa conversa você não escolhe entre eles: você herda o alvo que a tabela mais acessível permitir.
>
> A alternativa mais tentadora é a última — o [capítulo 04](04-avaliacao.md) insiste em definir a métrica **antes** de treinar, e isso está certo. Mas a métrica se escolhe pelo custo do erro, e o custo do erro é informação de negócio: quem paga um falso positivo aqui, o cliente recusado ou a seguradora? Definir métrica sem a fase 1 é escolher no chute e chamar de rigor. Inventariar tabelas é a fase 2; treinar uma linha de base é a fase 4 — as duas são trabalho útil, na hora errada.
> **volte para:** #o-problema-um-modelo-excelente-para-a-pergunta-errada
:::

## As setas voltam: por que isto é um ciclo, não uma cascata

O desenho do CRISP-DM tem setas entre fases vizinhas **e setas de volta**. Elas não são decoração de diagrama: são as quatro descobertas que todo projeto faz fora de ordem.

- **Fase 2 → fase 1.** Você abre os dados e descobre que a pergunta não é respondível: o campo que definiria o alvo só existe a partir de 2024, ou é preenchido à mão em 30% dos casos. A pergunta precisa mudar antes que qualquer coisa seja treinada.
- **Fase 4 → fase 3.** O laço mais frequente do ciclo. Todo erro que o modelo comete devolve trabalho para a preparação — um atributo novo, um vazamento a tapar, um recorte de amostra a corrigir.
- **Fase 5 → fase 1.** O modelo funciona e não serve: chega tarde, prevê o que ninguém pode acionar, ou o ganho não paga o custo operacional.
- **Fase 6 → tudo.** Em produção, o mundo muda debaixo do modelo — comportamento, catálogo, política de preço. É o *drift* do [capítulo 16](16-mlops.md), e é a razão de o CRISP-DM ser um círculo e não uma reta: a implantação reabre o ciclo, ela não o encerra.

A consequência prática vale a regra: **a fase 3 é a mais revisitada**, porque cada volta da modelagem cai nela. Quanto tempo isso representa, o CRISP-DM não promete — e este livro não repete a porcentagem que circula por aí sem tê-la medido.

Tratar o ciclo como cascata tem um custo específico e previsível: você descobre na semana seis o que custaria uma reunião na semana um.

:::exercicio {"id":"19-e2","tipo":"numerica","objetivo":"O3","dificuldade":"facil"}
Na fase de avaliação, a equipe descobre que rotulou como "cliente perdido" quem ficou 90 dias sem comprar — enquanto, para a área de retenção, perder um cliente é ele **não renovar o contrato**. O modelo prevê muito bem o rótulo que recebeu.

Para qual fase, de 1 a 6, o CRISP-DM manda voltar? Responda com o número.

> **gabarito:** 1
> **porque:** Definir o que conta como evento é **entendimento do negócio**, fase 1. O que quebrou não foi a construção do rótulo: foi o acordo sobre o que se está prevendo.
>
> A resposta tentadora é **3** — preparação dos dados — porque foi lá que o rótulo virou coluna, e é lá que o conserto vai ser digitado. Mas refazer o rótulo sem reabrir a conversa com a retenção só produz um segundo alvo escolhido pela equipe técnica, com a mesma chance de errar. A fase 1 é onde se pergunta *"cliente perdido é quem, para quem age?"*; a fase 3 é onde a resposta vira código. Voltar até a 1 parece o caminho mais caro e é o mais barato: a semana perdida na 1 já foi perdida, as fases 2 a 5 é que serão refeitas de graça se o alvo continuar errado.
> **volte para:** #as-setas-voltam-por-que-isto-e-um-ciclo-nao-uma-cascata
:::

## Quem faz o quê: quatro papéis sobre o mesmo ciclo

Os cargos que o mercado usa não são especializações por técnica — são **recortes do ciclo**. Ver assim explica por que um time incompleto sempre falha na mesma fase.

| Papel | Onde vive | O que entrega |
|---|---|---|
| **Analista / dono do problema** | fases 1 e 5 | o critério de sucesso e o veredito sobre se ele foi atingido |
| **Engenheiro de dados** | fases 2 e 3 | as fontes confiáveis e o pipeline que as mantém ([cap. 20](20-coleta-integracao.md)) |
| **Cientista de dados** | fases 3, 4 e 5 | atributos, modelo, e a leitura honesta do resultado |
| **Engenheiro de ML** | fases 4 e 6 | o modelo servindo em produção, monitorado ([cap. 15](15-sistemas-de-ml.md), [cap. 16](16-mlops.md)) |

Duas leituras saem da tabela. A primeira: **a fase 3 é onde os papéis se encontram** — o engenheiro entrega a fonte, o cientista constrói o atributo — e por isso é onde mais se perde trabalho quando ninguém combinou quem faz o quê.

A segunda é mais séria. Num time só de gente técnica, **a fase 1 fica sem dono**. Ninguém foi contratado para descobrir qual decisão vai mudar, e o ciclo começa pela fase 2 — que é exatamente o erro da primeira seção deste capítulo. Em time pequeno, uma pessoa ocupa vários papéis, e isso funciona; o que não funciona é uma fase sem responsável declarado.

:::exercicio {"id":"19-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"media"}
Um time de três pessoas — um engenheiro de dados, um cientista de dados e um engenheiro de ML — vai retomar o projeto de *churn* do começo do capítulo.

Distribua as seis fases entre os três, aponte a fase que corre risco de ficar **sem dono** e diga como você resolveria isso.

> **rubrica:** atribui as fases 2 e 3 majoritariamente ao engenheiro de dados;
> atribui as fases 4 e 5 ao cientista de dados;
> atribui a fase 6 ao engenheiro de ML, com monitoramento;
> identifica a fase 1 (entendimento do negócio) como a que fica sem dono natural neste trio;
> propõe uma solução concreta — trazer a área de retenção para a fase 1, ou o cientista de dados assumir formalmente a conversa — em vez de só apontar o problema;
> justifica com a consequência: sem dono na fase 1, o time otimiza um alvo que ninguém pediu
> **porque:** O recorte por fase é direto: dados chegam pelo engenheiro de dados (2 e 3), o modelo e sua leitura são do cientista de dados (4 e 5), produção e monitoramento são do engenheiro de ML (6). A fase 3 é compartilhada, e vale dizer isso na resposta.
>
> A parte que separa uma boa resposta de uma lista é a **fase 1**. Nenhum dos três foi contratado para ela, e é justamente a fase cuja ausência produziu o fracasso original: o rótulo de 90 dias saiu do que a tabela permitia, não do que a retenção podia acionar. Uma resposta que só distribui as seis fases entre os três está reproduzindo o erro do capítulo com organograma novo. Resolver não exige contratar ninguém — exige declarar um responsável por conversar com quem age, e um critério de sucesso escrito antes da primeira consulta ao banco.
> **volte para:** #quem-faz-o-que-quatro-papeis-sobre-o-mesmo-ciclo
:::

## Síntese — o que levar

- O CRISP-DM tem **seis fases**: entendimento do negócio, entendimento dos dados, preparação, modelagem, avaliação e implantação. Cada uma termina por **entrega**, não por prazo.
- **Modelagem é a quarta.** Começar pelos dados disponíveis faz o rótulo sair do que é fácil de calcular, e não do que é possível decidir.
- A fase 5 não é a métrica de teste: é *"isto resolve o problema da fase 1?"*. Modelo pode passar na 4 e reprovar na 5.
- **As setas voltam.** Fase 4 devolve trabalho para a 3; fase 5 devolve para a 1; a implantação reabre o ciclo por causa do *drift*.
- Os cargos são **recortes do ciclo**, não especialidades técnicas — e num time só técnico a fase 1 fica sem dono.
- Nasceu de um consórcio de indústria (1996–1999, ESPRIT), com montadora e seguradora na mesma mesa, para que o processo não pertencesse a nenhum fornecedor.
- **O método é o produto, não a ferramenta.** Em campo novo, o processo comum é o que torna o resultado auditável e transferível — mais do que qualquer algoritmo.

## Verificação

1. Liste as seis fases de memória e diga, em uma frase cada, **o artefato** que cada uma entrega para a seguinte.
2. Um colega diz: "não dá para conversar com o negócio antes de olhar os dados, porque não sabemos o que é possível". O que há de certo nessa objeção, e por que ela mesmo assim não justifica começar pela fase 2?
3. Você chega a um projeto em que ninguém sabe dizer qual decisão vai mudar por causa do modelo. Que perguntas você faz, e a quem, antes de escrever a primeira linha de código?
