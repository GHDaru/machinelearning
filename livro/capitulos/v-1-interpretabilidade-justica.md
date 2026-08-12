# V.1 — Interpretabilidade e Justiça

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Distinguir modelo interpretável de explicação post-hoc.
- **O2.** Aplicar e criticar SHAP como atribuição de importância.
- **O3.** Comparar três definições formais de justiça e mostrar que são incompatíveis entre si.
- **O4.** Medir desempenho por subgrupo e decidir o que fazer com a diferença encontrada.

## O problema: explicar a decisão, e responder pela diferença

Quando um modelo nega um crédito, alguém precisa dizer por quê. Quando ele erra mais para um grupo de pessoas do que para outro, alguém precisa responder por isso. Os dois problemas se encontram no mesmo lugar: **explicação é o instrumento com que se descobre a diferença**, e a diferença é o que obriga a explicar.

Só que o resultado mais importante desta área não é técnico no sentido usual — é uma **impossibilidade**. As definições razoáveis de "justo" não podem ser satisfeitas ao mesmo tempo, exceto em casos degenerados. O erro que este capítulo previne é acreditar que existe um ajuste técnico que resolve. Não existe. Existe uma **escolha**, e alguém vai fazê-la — calado ou declarado.

## De onde isto veio

**O aperto.** Em 2016, um instrumento de avaliação de risco de reincidência usado em decisões judiciais reais nos Estados Unidos é acusado de viés racial. Acusação e defesa apresentam **evidência estatística correta** e chegam a **conclusões opostas**. Não é o caso comum, em que um lado errou a conta: os dois números estão certos.

**O que se fazia antes.** "Justiça" era tratada como qualidade única e não formalizada. Discutia-se se o modelo era justo — não **em qual sentido**.

**A virada.** Formalizar as definições rivais e **provar que são mutuamente incompatíveis** sempre que a prevalência do evento difere entre os grupos. A pergunta deixa de ser retórica e passa a ser aritmética.

**A ideia reaproveitável.** **Quando dois lados discordam com dados corretos, o desacordo é de definição, não de fato.** A pergunta útil não é "quem está certo?", é **"qual restrição cada um está impondo, e qual eu escolho pagar?"**. Vale muito além de justiça algorítmica: sempre que uma discussão trava com todos os números conferidos, procure a definição escondida.

**O nome.** De um lado, *calibração* — ou *test fairness*, vocabulário da psicometria, onde um teste é justo se o escore significa a mesma coisa para todo mundo. Do outro, *equilíbrio de taxas de erro*, vocabulário de quem olha a matriz de confusão. Dois campos, dois nomes, e a colisão entre eles é boa parte da confusão.

### O que cada um disse — e o que o teorema disse

**(a) O que a reportagem afirmou.** Angwin, Larson, Mattu e Kirchner publicam *Machine Bias* em **23 de maio de 2016**. Dois números sustentam a peça: entre réus que **não** reincidiram, **44,9%** dos negros contra **23,5%** dos brancos haviam sido rotulados de risco mais alto; entre os que **reincidiram**, **47,7%** dos brancos contra **28,0%** dos negros haviam sido rotulados de risco mais baixo. Isso é desequilíbrio de taxas de erro, e é real.

**(b) O que a empresa respondeu.** Em **julho de 2016**, a Northpointe publicou uma réplica técnica — Dieterich, Mendoza & Brennan, *COMPAS Risk Scales: Demonstrating Accuracy Equity and Predictive Parity* — sustentando que o instrumento satisfaz **paridade preditiva**. E aqui o capítulo para: **este livro não leu esse documento** (o PDF devolve 404). Existência e autoria estão confirmadas em material acadêmico; o argumento em si, não. Por isso o texto não o caracteriza em primeira mão — e você deve desconfiar de qualquer resumo que o caracterize sem apontar a página.

**(c) O que o teorema estabeleceu.** Este ponto, sim, está fechado. Alexandra Chouldechova ([arXiv:1610.07524](https://arxiv.org/abs/1610.07524)) define um escore como *test-fair* (bem calibrado) quando ele reflete a **mesma probabilidade de reincidência independentemente do grupo**, e daí deriva a relação entre taxa de falso positivo, prevalência, valor preditivo positivo e taxa de falso negativo. A conclusão, nas palavras dela: *"when the recidivism prevalence differs between two groups, a test-fair score S<sub>c</sub> cannot have equal false positive and negative rates across those groups."* No próprio dado a prevalência difere — **51% contra 39%** — e portanto *"some level of imbalance in the error rates must exist"*. Não é acusação nem defesa: é álgebra de três linhas.

Cinco meses depois da reportagem, Kleinberg, Mullainathan & Raghavan chegam ao mesmo muro por outro caminho ([arXiv:1609.05807](https://arxiv.org/abs/1609.05807), 19/09/2016): *"we prove that except in highly constrained special cases, there is no method that can satisfy these three conditions simultaneously."*

> ### A cronologia é o conteúdo
>
> **23 de maio → julho → 19 de setembro → 24 de outubro de 2016.** Cinco meses entre uma reportagem e **dois teoremas independentes**.
>
> E o desfecho é o que se perde na repetição da história: **os dois lados estavam certos dentro da própria definição**. O que o teorema acrescenta não é um vencedor — é a prova de que **não pode haver um**, a menos que se mude a prevalência ou se abra mão de um critério. 📖

### O outro fio: uma fórmula de 1953 esperando um problema

O lado da explicação tem história mais curta e intervalo maior. **LIME** aparece em **16/02/2016** (Ribeiro, Singh & Guestrin, *"Why Should I Trust You?"*); **SHAP**, em **22/05/2017** (Lundberg & Lee) — e o resumo declara a contribuição não como invenção, mas como **unificação**: *"The new class unifies six existing methods"*. A fórmula por trás dele é de **Lloyd S. Shapley**, *"A Value for n-Person Games"*, de **1953**.

> **O intervalo mais limpo do livro: 1953 → 2017, sessenta e quatro anos — e a fórmula não mudou.**
>
> O que mudou foi passar a existir um objeto cujas partes se pudessem tratar como jogadores de uma coalizão: um modelo treinado, com atributos que entram e saem. **A matemática esperou o problema, não o contrário.** Emparelha com Taylor 1953 → BERT 2018 no [capítulo III.6](iii-6-modelos-de-fundacao.md) — e o ano de origem é o mesmo nos dois casos. 📖

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Chouldechova, *Fair prediction with disparate impact* ([arXiv:1610.07524](https://arxiv.org/abs/1610.07524), 24/10/2016) — a definição de *test fairness*, a relação entre as taxas, as prevalências de 51% e 39% e as duas citações entre aspas. **Lido** |
| ✓ᵐ | Angwin, Larson, Mattu & Kirchner, *Machine Bias* (ProPublica, 23/05/2016) — os quatro percentuais (44,9 / 23,5 / 47,7 / 28,0): página aberta e números devolvidos **literalmente, mas por extrator automático**. Também ✓ᵐ: Shapley, *"A Value for n-Person Games"*, *Annals of Mathematics Studies* 28, Princeton UP, 1953, pp. 307–317; e o fato de Timnit Gebru assinar **Datasheets** (ver [capítulo I.3](i-3-dados.md)) e **Model Cards**, ambos de 2018 |
| ✓ᵐ | Que Dieterich, Mendoza & Brennan publicaram *COMPAS Risk Scales* (Northpointe, julho de 2016) — existência e autoria confirmadas em material acadêmico |
| ❌ | **O conteúdo desse documento**: o PDF devolve 404 e não foi aberto. Por isso este capítulo afirma apenas que a réplica existe e sustenta paridade preditiva, e **não caracteriza o argumento da empresa em primeira mão** |
| ✓ᵃ | Kleinberg, Mullainathan & Raghavan ([arXiv:1609.05807](https://arxiv.org/abs/1609.05807), v1 19/09/2016); LIME ([arXiv:1602.04938](https://arxiv.org/abs/1602.04938), v1 16/02/2016); SHAP ([arXiv:1705.07874](https://arxiv.org/abs/1705.07874), v1 22/05/2017), incluindo a frase sobre unificar seis métodos; Model Cards — Mitchell, Wu, Zaldivar, Barnes, Vasserman, Hutchinson, Spitzer, Raji e Gebru ([arXiv:1810.03993](https://arxiv.org/abs/1810.03993), v1 05/10/2018). Em todos, a citação vem do **resumo** |
| 📖 | A leitura de que a cronologia é o conteúdo; o paralelo Shapley→SHAP com Taylor→BERT; e a formulação "o desacordo é de definição, não de fato" |

> **Legenda adicional:** **✓ᵃ** = o **resumo** do artigo foi lido literalmente e sustenta a citação; o corpo, não. É mais forte que ✓ᵐ e mais fraco que ✓.

## Fundamentos: o que é explicar um modelo

Duas perguntas diferentes se escondem sob a mesma palavra. **Global**: *como este modelo funciona, no geral?* — quais atributos usa, em que direção, com que peso; serve para auditar. **Local**: *por que este caso recebeu esta saída?* — serve para responder à pessoa que teve o crédito negado, e é o que a regulação normalmente exige. A assimetria prática é grande: times produzem explicação global com facilidade e são cobrados por explicação local.

### Interpretável por construção, ou explicado depois

**Interpretável por construção** é o modelo cuja estrutura já é a explicação: uma regressão linear com poucos atributos, uma árvore rasa, um sistema de regras (ver [capítulo IV.3](iv-3-ia-simbolica-fuzzy-evolutiva.md)). Você lê o modelo e sabe o que ele faz. **Explicação post-hoc** é o que se faz quando o modelo é um ensemble de mil árvores ou uma rede profunda: treina-se um **segundo** objeto, simples, para descrever o comportamento do primeiro. Daí o alerta que sustenta metade deste capítulo.

> **Uma explicação post-hoc é uma aproximação do modelo — não a razão pela qual o modelo decidiu.**

O modelo não tem "razões": tem pesos. A explicação é uma narrativa ajustada para se parecer com o comportamento dele naquela vizinhança. Pode ser útil, defensável e ainda assim **não** ser o que aconteceu por dentro. Tratá-la como motivação da decisão — num relatório, numa auditoria, em juízo — é trocar o modelo pelo retrato dele. Quando a decisão for de alto risco e a exigência de justificar for real, considere pagar o preço do modelo interpretável por construção: a perda de desempenho costuma ser menor do que o time supõe, e às vezes some dentro do intervalo de confiança (ver [capítulo II.8](ii-8-do-modelo-a-decisao.md)).

### LIME e SHAP, sem fórmula

**LIME** faz o óbvio, e o óbvio funciona: pega o caso que você quer explicar, gera variações dele em volta, pergunta ao modelo o que ele responde para cada variação e ajusta um modelo simples **só naquela vizinhança**. O resultado responde *"perto deste caso, o modelo se comporta assim"* — nada além disso.

**SHAP** vem da teoria dos jogos cooperativos. Imagine a previsão como o prêmio de uma partida e cada atributo como um jogador que entra na coalizão: a contribuição de um jogador é o quanto ele acrescenta ao prêmio, **em média sobre todas as ordens possíveis de entrada**. Isso dá à atribuição uma propriedade rara — as contribuições **somam exatamente** o desvio entre a previsão daquele caso e a previsão média. Nada some, nada aparece do nada. Mas a atribuição **não é causal no mundo** ("renda contribuiu −0,4" não diz o que aconteceria se a renda mudasse), **não é a razão interna** do modelo, e **não é estável de graça**: atributos correlacionados dividem crédito de formas que dependem da implementação.

:::exercicio {"id":"interpretabilidade-justica-e1","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Um banco usa um ensemble de árvores para decidir crédito e gera, para cada negativa, uma explicação SHAP com os três atributos de maior contribuição. O jurídico pergunta se essa explicação pode ser apresentada como a motivação da decisão. Qual leitura é correta?

- [ ] Sim: SHAP tem base na teoria dos jogos, então a atribuição é causal e mostra o que causou a negativa.
- [x] Não: a explicação post-hoc descreve como o modelo se comporta perto daquele caso — é aproximação, não a razão interna da decisão.
- [ ] Sim, desde que as contribuições somem o desvio em relação à previsão média, o que SHAP garante.
- [ ] A pergunta não se aplica: bastaria trocar por um modelo interpretável por construção, que já dispensa a análise por subgrupo.

> **gabarito:** É uma aproximação do comportamento do modelo, não a razão da decisão
> **porque:** A explicação post-hoc é um **segundo objeto**, ajustado para imitar o primeiro numa vizinhança. Pode ser fiel e útil sem ser o que ocorreu por dentro do ensemble; apresentá-la como motivação troca o modelo pelo retrato dele. A primeira alternativa confunde duas causalidades: SHAP é causal **dentro do jogo** que ele define, não no mundo.
>
> A terceira captura o erro mais sedutor — a soma exata é propriedade real e desejável, mas **coerência aritmética não é veracidade explicativa**: uma decomposição pode fechar a conta perfeitamente e ainda descrever mal o mecanismo. A quarta erra em dobro: modelo interpretável por construção resolve a explicação, **não** a justiça — regras visíveis podem produzir taxas de erro muito diferentes entre grupos, e você só descobre medindo.
> **volte para:** #interpretavel-por-construcao-ou-explicado-depois
:::

## Três definições de justiça que não cabem juntas

Cada uma é razoável, cada uma tem defensores sérios, e cada uma exige coisa diferente. Repare que a primeira nem olha o desfecho, e as outras duas olham.

| Definição | Exige que… | Quem ela protege |
|---|---|---|
| **Paridade demográfica** | a proporção de decisões positivas seja igual entre os grupos | quem é sub-representado no resultado, independentemente do desfecho |
| **Igualdade de oportunidade** | entre quem **de fato** é positivo, a taxa de acerto seja igual entre os grupos | quem merecia a decisão favorável e não a teve |
| **Calibração** (*test fairness*) | o mesmo escore signifique a mesma probabilidade em qualquer grupo | quem lê o escore e age sobre ele — e quem seria mal servido por um escore que "vale menos" no seu grupo |

### A álgebra de três linhas

A relação de Chouldechova amarra quatro grandezas: **taxa de falso positivo**, **prevalência**, **valor preditivo positivo** e **taxa de falso negativo**. Fixadas três, a quarta está determinada. Não é tendência empírica — é identidade.

A consequência é a frase citada acima: com prevalência diferente entre os grupos, um escore calibrado **não pode** ter taxas de falso positivo e de falso negativo iguais entre eles. E prevalência quase sempre difere, por razões que nada têm a ver com o modelo — inclusive porque o dado histórico registra um processo social, não a verdade sobre as pessoas (ver [capítulo I.3](i-3-dados.md) e [capítulo III.6](iii-6-modelos-de-fundacao.md)). Daí a formulação prática: **exigir as três definições ao mesmo tempo é exigir que a prevalência seja igual.** Se ela não for, você pediu algo aritmeticamente impossível — e alguém vai entregar um relatório dizendo que conseguiu.

:::exercicio {"id":"interpretabilidade-justica-e2","tipo":"numerica","objetivo":"O4","dificuldade":"media"}
Um escore de risco foi avaliado separadamente em dois grupos, com mil pessoas cada. A tabela traz as quatro células da matriz de confusão de cada um:

| Grupo | Positivo real, previsto positivo | Positivo real, previsto negativo | Negativo real, previsto positivo | Negativo real, previsto negativo |
|---|---|---|---|---|
| **A** (prevalência 40%) | 280 | 120 | 120 | 480 |
| **B** (prevalência 60%) | 420 | 180 | 180 | 220 |

Calcule a **taxa de falso positivo do grupo B**. Responda em fração, com duas casas decimais.

> **gabarito:** 0,45 ± 0,01
> **porque:** A taxa de falso positivo se calcula **sobre os negativos reais**, nunca sobre o total. No grupo B há 180 + 220 = **400** negativos reais, dos quais 180 foram previstos positivos: 180 / 400 = **0,45**. O erro mais comum é dividir por 1 000 e obter 0,18 — isso mede outra coisa.
>
> Agora faça as outras contas, porque é aqui que o capítulo se fecha. Falso positivo no grupo A: 120 / 600 = **0,20**. Valor preditivo positivo: 280 / 400 = **0,70** no A e 420 / 600 = **0,70** no B — **idênticos**. Taxa de falso negativo: 120 / 400 = **0,30** no A e 180 / 600 = **0,30** no B — **também idênticos**.
>
> Ou seja: este escore trata os dois grupos igualmente em duas definições e ainda assim **erra para cima mais que o dobro** no grupo B. Nada foi sabotado, nenhum atributo sensível precisou entrar no modelo. A única diferença entre os grupos é a **prevalência**, e ela sozinha basta. É o teorema, agora em números que você conferiu com uma divisão.
> **volte para:** #a-algebra-de-tres-linhas
:::

## Quando o teorema diz que você tem de escolher

Provado que não dá para ter tudo, o trabalho muda de natureza: passa a ser de **procedimento**, em quatro partes.

**1. Declarar a escolha.** Escreva qual critério o sistema otimiza, qual foi abandonado e por quê — "priorizamos igualdade de oportunidade porque o custo do falso negativo recai sobre quem já tem menos acesso, e aceitamos taxas de falso positivo desiguais". Escolha calada não deixa de ser escolha; deixa apenas de ser auditável.

**2. Medir por subgrupo, sempre.** A média esconde a decisão. Reporte a **matriz de confusão inteira por subgrupo** (ver [capítulo II.1](ii-1-avaliacao.md)), não uma métrica agregada. Três cuidados: declare os subgrupos **antes** de olhar os resultados, para não caçar o recorte conveniente; verifique se cada um tem gente suficiente para a estimativa significar algo; e lembre que ausência de diferença medida num subgrupo pequeno é ausência de medida, não ausência de diferença.

**3. Envolver quem paga a conta.** A escolha entre critérios distribui erro entre pessoas, e quem decide raramente é quem recebe. Levar a decisão a quem sofre a consequência não é gentileza: é a única forma de descobrir qual erro dói mais — informação que não está no conjunto de dados.

**4. Registrar.** Um **Model Card** documenta o modelo como um datasheet documenta o dado: uso pretendido, uso desaconselhado, **desempenho desagregado por subgrupo** e considerações éticas. O elo com o [capítulo I.3](i-3-dados.md) não é analogia — é a **mesma autora**: Timnit Gebru assina os dois, no mesmo ano. Documentar o dado e documentar o modelo são um projeto só.

E há uma quinta saída, legítima: **não lançar**. Desempenho bom no agregado e ruim num subgrupo que importa é motivo suficiente, e defender a recusa exige o mesmo aparato de defender o lançamento — ver [capítulo II.8](ii-8-do-modelo-a-decisao.md).

:::exercicio {"id":"interpretabilidade-justica-e3","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Um plano de saúde vai usar um escore para selecionar pacientes crônicos que entram num programa de acompanhamento intensivo — as vagas são limitadas e o programa reduz internações. A prevalência de complicação grave é **maior no grupo X** do que no grupo Y, por razões conhecidas de acesso histórico a atendimento.

A diretoria pede que o escore seja, ao mesmo tempo, **calibrado** (o mesmo escore significa a mesma probabilidade nos dois grupos) e **igualitário em oportunidade** (mesma taxa de acerto entre quem de fato vai complicar). Escreva a resposta que você levaria à diretoria: explique por que o pedido é impossível como está, escolha **um** dos dois critérios, e diga **quem paga a conta** da sua escolha.

> **rubrica:** explica que os dois critérios não podem valer juntos porque a prevalência difere, e que isso é identidade aritmética, não limitação de engenharia;
> nomeia corretamente o que cada critério exige;
> escolhe explicitamente um critério em vez de propor um meio-termo vago;
> identifica de forma concreta quem sofre o erro resultante — qual grupo, qual tipo de erro, qual consequência clínica;
> propõe ao menos uma ação de procedimento (registrar a escolha, reportar por subgrupo, ouvir os afetados, atacar a prevalência na origem);
> NÃO afirma que existe uma resposta tecnicamente correta
> **porque:** A resposta fraca promete "buscar um equilíbrio" e pede mais dados. Mais dados não removem a incompatibilidade: ela decorre da diferença de prevalência, não do tamanho da amostra.
>
> A resposta forte faz três movimentos. Devolve o pedido — as duas exigências juntas equivalem a exigir prevalências iguais. Escolhe, e nomeia o preço: priorizar **igualdade de oportunidade** tende a levar mais gente do grupo X ao programa, aumentando o falso positivo lá e consumindo vagas que outros pacientes teriam; priorizar **calibração** preserva o significado do escore para quem o lê, ao custo de taxas de erro piores num dos grupos. E diz **quem paga** em pessoas e desfechos — pacientes que complicam sem entrar no programa, ou pacientes que ocupam vaga sem precisar — não em métrica. O que separa a boa da excelente é reparar que a prevalência diferente **é ela mesma resíduo de um acesso desigual anterior**: otimizar sobre ela é herdar o problema, e a ação mais valiosa pode estar fora do modelo.
> **volte para:** #quando-o-teorema-diz-que-voce-tem-de-escolher
:::

## Síntese — o que levar

- **Quando dois lados discordam com dados corretos, o desacordo é de definição, não de fato.** Procure a definição escondida antes de procurar o erro de conta.
- Interpretabilidade tem duas perguntas: **global** (como funciona) e **local** (por que este caso). A regulação cobra a local; os times entregam a global.
- **Explicação post-hoc é aproximação, não motivação.** SHAP soma exato — e soma exata é **coerência**, não veracidade, nem causalidade no mundo.
- Paridade demográfica, igualdade de oportunidade e calibração são **critérios rivais**. Exigir os três é exigir prevalências iguais.
- Com prevalências diferentes, **algum desequilíbrio de taxas de erro tem de existir**. É identidade, não descuido.
- A média esconde a decisão: reporte a **matriz de confusão por subgrupo**, com os subgrupos declarados antes de olhar o resultado.
- Escolha declarada é auditável; escolha calada é a mesma escolha, sem responsável. E **não lançar** continua sendo uma saída.
- **A matemática esperou o problema** — Shapley 1953, SHAP 2017, fórmula intacta.

:::exercicio {"id":"interpretabilidade-justica-e4","tipo":"aberta","objetivo":"O2","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Um colega mostra uma explicação SHAP de uma negativa de crédito e conclui: **"foi a renda que causou a recusa"**. Reescreva a frase de modo tecnicamente defensável, e diga o que se perde na versão original.

> **rubrica:** a frase reescrita atribui o efeito **ao modelo**, e não ao mundo — algo como "neste caso, a renda foi o atributo que mais empurrou a saída do modelo para baixo, em relação à referência usada";
> torna explícita a **referência**: a atribuição é sempre relativa a uma linha de base (a média das saídas, ou um conjunto de fundo escolhido), e mudar essa referência muda os números;
> nomeia o que a versão original afirma sem sustentação: uma relação **causal** no mundo, que exigiria intervir na renda e observar a decisão mudar — e a explicação não observou nada disso;
> não conclui que SHAP é inútil ou "não explica nada": ele responde corretamente a uma pergunta bem definida sobre a saída do modelo, e o defeito está na pergunta que o colega achou ter feito
> **porque:** A frase do colega é o erro mais comum da área, e é fácil de cometer porque a saída do SHAP **parece** uma explicação causal: um atributo, um sinal, uma magnitude. O que ela de fato reporta é como a saída **deste modelo** se decompõe em relação a uma referência — uma afirmação sobre um artefato de software, não sobre a vida do solicitante.
>
> A distância entre as duas leituras aparece num teste mental simples: se a renda daquela pessoa fosse outra, a decisão mudaria? A atribuição não responde isso. Ela diz o quanto aquele valor de renda contribuiu para afastar a saída da referência **mantida a estrutura do modelo**, que pode ter aprendido a renda como substituta de outra coisa que ninguém mediu.
>
> O quarto critério evita o pêndulo. Quem entende a crítica pela primeira vez tende a concluir que a ferramenta não presta; ela presta, e a pergunta que ela responde é útil — sobretudo para auditar o modelo. O que não se pode é **entregar a resposta dela como se fosse resposta de outra pergunta**, especialmente para alguém que teve o crédito negado e vai agir com base no que você disse.
> **volte para:** #lime-e-shap-sem-formula
:::

## Verificação

1. Sua auditoria mostra que o modelo é bem calibrado nos dois grupos e que a taxa de falso positivo é o dobro em um deles. Um gestor pede que você "corrija o modelo até que as duas coisas fiquem iguais". O que você responde, e o que oferece no lugar?
2. Você precisa escolher entre um ensemble com desempenho superior e um modelo de regras ligeiramente pior, num domínio em que cada decisão negativa pode ser contestada individualmente. Que critérios usaria, e em que condição a escolha se inverteria?

> Estas duas não são corrigidas, e a omissão é deliberada: as duas são negociações, e negociação se ganha diante de quem pede a coisa impossível.
