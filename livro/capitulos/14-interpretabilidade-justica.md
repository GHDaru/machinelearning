# 14 — Interpretabilidade e Justiça

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Distinguir modelo interpretável de explicação post-hoc.
- **O2.** Aplicar e criticar SHAP como atribuição de importância.
- **O3.** Comparar três definições formais de justiça e mostrar que são incompatíveis entre si.
- **O4.** Medir desempenho por subgrupo e decidir o que fazer com a diferença encontrada.

## O problema: explicar a decisão, e responder pela diferença

Quando um modelo nega um crédito, alguém precisa dizer por quê. Quando ele erra mais para um grupo de pessoas do que para outro, alguém precisa responder por isso.

Os dois problemas se encontram no mesmo lugar: **explicação é o instrumento com que se descobre a diferença**, e a diferença é o que obriga a explicar. Mas o resultado mais importante desta área não é técnico no sentido usual — é uma **impossibilidade**. As definições razoáveis de "justo" não podem ser satisfeitas ao mesmo tempo, exceto em casos degenerados.

O erro que este capítulo previne é acreditar que existe um ajuste técnico que resolve. Não existe. Existe uma **escolha**, e alguém vai fazê-la — calado ou declarado.

## De onde isto veio

**O aperto.** Em 2016, um instrumento de avaliação de risco de reincidência usado em decisões judiciais reais nos Estados Unidos é acusado de viés racial. Acusação e defesa apresentam **evidência estatística correta** e chegam a **conclusões opostas**. Não é o caso comum, em que um lado erra a conta. Os dois números estão certos.

**O que se fazia antes.** "Justiça" era tratada como qualidade única e não formalizada. Discutia-se se o modelo era justo — não **em qual sentido**.

**A virada.** Formalizar as definições rivais e **provar que são mutuamente incompatíveis** sempre que a prevalência do evento difere entre os grupos. A pergunta deixa de ser jurídica e passa a ser aritmética.

**A ideia reaproveitável.** **Quando dois lados discordam com dados corretos, o desacordo é de definição, não de fato.** A pergunta útil não é "quem está certo?". É **"qual restrição cada um está impondo, e qual eu escolho pagar?"** Vale muito além de justiça algorítmica: sempre que uma discussão trava com todos os números conferidos, procure a definição escondida.

**O nome.** De um lado, *calibração* — ou *test fairness*, vocabulário vindo da psicometria, onde um teste é justo se o escore significa a mesma coisa para todo mundo. Do outro, *equilíbrio de taxas de erro*, vocabulário de quem olha a matriz de confusão. Dois campos, dois nomes, e a colisão entre eles é boa parte da confusão.

### O que cada um disse — e o que o teorema disse

Três coisas diferentes, que este capítulo mantém separadas do começo ao fim.

**(a) O que a reportagem afirmou.** Angwin, Larson, Mattu e Kirchner publicam *Machine Bias* em **23 de maio de 2016**. Dois números sustentam a peça: entre réus que **não** reincidiram, **44,9%** dos negros contra **23,5%** dos brancos haviam sido rotulados de risco mais alto; entre os que **reincidiram**, **47,7%** dos brancos contra **28,0%** dos negros haviam sido rotulados de risco mais baixo. Isso é desequilíbrio de taxas de erro, e é real.

**(b) O que a empresa respondeu.** Em **julho de 2016**, a Northpointe publicou uma réplica técnica — Dieterich, Mendoza & Brennan, *COMPAS Risk Scales: Demonstrating Accuracy Equity and Predictive Parity* — sustentando que o instrumento satisfaz **paridade preditiva**. E aqui o capítulo para: **este livro não leu esse documento** (o PDF devolve 404). Existência e autoria estão confirmadas em material acadêmico; o argumento em si, não. Por isso o texto não o caracteriza em primeira mão — e você deve desconfiar de qualquer resumo que o caracterize sem apontar a página.

**(c) O que o teorema estabeleceu.** Este ponto, sim, está fechado. Alexandra Chouldechova ([arXiv:1610.07524](https://arxiv.org/abs/1610.07524)) define um escore como *test-fair* (bem calibrado) quando ele reflete a **mesma probabilidade de reincidência independentemente do grupo**, e daí deriva a relação entre taxa de falso positivo, prevalência, valor preditivo positivo e taxa de falso negativo. A conclusão, nas palavras dela: *"when the recidivism prevalence differs between two groups, a test-fair score S<sub>c</sub> cannot have equal false positive and negative rates across those groups."* No próprio dado a prevalência difere — **51% contra 39%** — e portanto *"some level of imbalance in the error rates must exist"*.

Não é acusação nem defesa. É álgebra de três linhas.

Cinco meses depois da reportagem, Kleinberg, Mullainathan & Raghavan chegam ao mesmo muro por outro caminho ([arXiv:1609.05807](https://arxiv.org/abs/1609.05807), 19/09/2016): *"we prove that except in highly constrained special cases, there is no method that can satisfy these three conditions simultaneously."*

> ### A cronologia é o conteúdo
>
> **23 de maio → julho → 19 de setembro → 24 de outubro de 2016.** Cinco meses entre uma reportagem e **dois teoremas independentes**.
>
> E o desfecho é o que costuma se perder na repetição da história: **os dois lados estavam certos dentro da própria definição**. O que o teorema acrescenta não é um vencedor — é a prova de que **não pode haver um**, a menos que se mude a prevalência ou se abra mão de um critério. 📖

### O outro fio: uma fórmula de 1953 esperando um problema

O lado da explicação tem uma história mais curta e um intervalo maior. **LIME** aparece em **16/02/2016** (Ribeiro, Singh & Guestrin, *"Why Should I Trust You?"*, [arXiv:1602.04938](https://arxiv.org/abs/1602.04938)). **SHAP** aparece em **22/05/2017** (Lundberg & Lee, [arXiv:1705.07874](https://arxiv.org/abs/1705.07874)), e o resumo declara a contribuição não como invenção, mas como **unificação**: *"The new class unifies six existing methods"*.

A fórmula por trás dele é de **Lloyd S. Shapley**, *"A Value for n-Person Games"*, de **1953**.

> **O intervalo mais limpo do livro: 1953 → 2017, sessenta e quatro anos — e a fórmula não mudou.**
>
> O que mudou foi passar a existir um objeto cujas partes se pudessem tratar como jogadores de uma coalizão: um modelo treinado, com atributos que entram e saem. **A matemática esperou o problema, não o contrário.**
>
> Emparelha com Taylor 1953 → BERT 2018 no [capítulo 12](12-modelos-de-fundacao.md) — e o ano de origem é o mesmo nos dois casos: **1953**. 📖

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Chouldechova, *Fair prediction with disparate impact* ([arXiv:1610.07524](https://arxiv.org/abs/1610.07524), 24/10/2016) — a definição de *test fairness*, a relação entre as taxas, as prevalências de 51% e 39% e as duas citações entre aspas. **Lido** |
| ✓ᵐ | Angwin, Larson, Mattu & Kirchner, *Machine Bias* (ProPublica, 23/05/2016) — os quatro percentuais (44,9 / 23,5 / 47,7 / 28,0). Página aberta e números devolvidos **literalmente, mas por extrator automático** |
| ✓ᵐ | Que Dieterich, Mendoza & Brennan publicaram *COMPAS Risk Scales* (Northpointe, julho de 2016) — existência e autoria confirmadas em material acadêmico |
| ❌ | **O conteúdo desse documento**: o PDF devolve 404 e não foi aberto. Por isso este capítulo afirma apenas que a réplica existe e sustenta paridade preditiva, e **não caracteriza o argumento da empresa em primeira mão** |
| ✓ᵃ | Kleinberg, Mullainathan & Raghavan ([arXiv:1609.05807](https://arxiv.org/abs/1609.05807), v1 19/09/2016) — a citação vem do **resumo**, lido literalmente |
| ✓ᵃ | LIME — Ribeiro, Singh & Guestrin ([arXiv:1602.04938](https://arxiv.org/abs/1602.04938), v1 16/02/2016); SHAP — Lundberg & Lee ([arXiv:1705.07874](https://arxiv.org/abs/1705.07874), v1 22/05/2017), incluindo a frase sobre **unificar seis métodos**; Model Cards — Mitchell, Wu, Zaldivar, Barnes, Vasserman, Hutchinson, Spitzer, Raji e Gebru ([arXiv:1810.03993](https://arxiv.org/abs/1810.03993), v1 05/10/2018) |
| ✓ᵐ | Lloyd S. Shapley, *"A Value for n-Person Games"*, *Annals of Mathematics Studies* 28, Princeton University Press, 1953, pp. 307–317 |
| ✓ᵐ | Timnit Gebru assina **Datasheets** (2018, ver [capítulo 02](02-dados.md)) e **Model Cards** (2018) — mesma autora nos dois |
| 📖 | A leitura de que a cronologia é o conteúdo; o paralelo Shapley→SHAP com Taylor→BERT; e a formulação "o desacordo é de definição, não de fato" |

> **Legenda adicional:** **✓ᵃ** = o **resumo** do artigo foi lido literalmente e sustenta a citação; o corpo, não. É mais forte que ✓ᵐ e mais fraco que ✓.

## Fundamentos: o que é explicar um modelo

Duas perguntas diferentes se escondem sob a palavra "explicar".

**Global**: *como este modelo funciona, no geral?* Quais atributos ele usa, em que direção, com que peso relativo. Serve para auditar e para desconfiar.

**Local**: *por que este caso recebeu esta saída?* Serve para responder à pessoa que teve o crédito negado — e é o que a regulação normalmente exige. A assimetria prática é grande: equipes produzem explicação global com facilidade e são cobradas por explicação local.

### Interpretável por construção, ou explicado depois

**Interpretável por construção** é o modelo cuja estrutura já é a explicação: uma regressão linear com poucos atributos, uma árvore rasa, um sistema de regras (ver [capítulo 27](27-ia-simbolica-fuzzy-evolutiva.md)). Você lê o modelo e sabe o que ele faz. Não há intermediário.

**Explicação post-hoc** é o que se faz quando o modelo é um ensemble de mil árvores ou uma rede profunda: treina-se um **segundo** objeto, simples, para descrever o comportamento do primeiro.

E aqui está o alerta que sustenta metade deste capítulo:

> **Uma explicação post-hoc é uma aproximação do modelo — não a razão pela qual o modelo decidiu.**

O modelo não tem "razões": tem pesos. A explicação é uma narrativa fiel até certo ponto, ajustada para se parecer com o comportamento dele naquela vizinhança. Ela pode ser útil, defensável e ainda assim **não** ser aquilo que aconteceu por dentro. Tratar a explicação como motivação da decisão — em um relatório, em uma auditoria, em juízo — é trocar o modelo por um retrato dele.

Quando a decisão for de alto risco e a exigência de justificar for real, **considere pagar o preço do modelo interpretável por construção**. Muitas vezes a perda de desempenho é menor do que o time supõe, e a diferença some no intervalo de confiança (ver [capítulo 25](25-do-modelo-a-decisao.md)).

### LIME e SHAP, sem fórmula

**LIME** faz o óbvio, e o óbvio funciona: pega o caso que você quer explicar, gera variações dele em volta, pergunta ao modelo o que ele responde para cada variação, e ajusta um modelo simples **só naquela vizinhança**. O resultado responde: *"perto deste caso, o modelo se comporta assim"*. Nada além disso.

**SHAP** vem da teoria dos jogos cooperativos. Imagine a previsão como o prêmio de uma partida, e cada atributo como um jogador que entra na coalizão. A contribuição de um jogador é o quanto ele acrescenta ao prêmio, **em média sobre todas as ordens possíveis de entrada**. Isso dá à atribuição uma propriedade rara: as contribuições **somam exatamente** o desvio entre a previsão daquele caso e a previsão média. Nada some, nada aparece do nada.

Três coisas que uma atribuição SHAP **não** diz:

- **Não é causal no mundo.** "Renda contribuiu −0,4" não significa que aumentar a renda daquela pessoa mudaria a vida dela — significa que, no modelo, aquele valor empurra a saída para baixo.
- **Não é a razão interna.** É uma leitura do comportamento entrada→saída, feita de fora.
- **Não é estável de graça.** Atributos correlacionados dividem crédito de maneiras que dependem de escolhas de implementação.

:::exercicio {"id":"14-e1","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Um banco usa um ensemble de árvores para decidir crédito e gera, para cada negativa, uma explicação SHAP com os três atributos de maior contribuição. O jurídico pergunta se essa explicação pode ser apresentada como a motivação da decisão. Qual leitura é correta?

- [ ] Sim: SHAP tem base na teoria dos jogos, então a atribuição é causal e mostra o que causou a negativa.
- [x] Não: a explicação post-hoc descreve como o modelo se comporta perto daquele caso — é uma aproximação, não a razão interna da decisão.
- [ ] Sim, desde que as contribuições somem o desvio em relação à previsão média, o que SHAP garante.
- [ ] A pergunta não se aplica: um modelo interpretável por construção dispensaria a análise por subgrupo, então basta trocar o modelo.

> **gabarito:** É uma aproximação do comportamento do modelo, não a razão da decisão
> **porque:** A explicação post-hoc é um **segundo objeto**, ajustado para imitar o primeiro numa vizinhança. Ela pode ser fiel e útil e ainda assim não ser o que ocorreu por dentro do ensemble. Apresentá-la como motivação troca o modelo pelo retrato dele.
>
> A primeira alternativa confunde duas causalidades: SHAP é causal **dentro do jogo** que ele define (atributos entrando numa coalizão), não no mundo. A terceira captura um erro sedutor — a soma exata é uma propriedade real e desejável, mas **coerência aritmética não é veracidade explicativa**; uma decomposição pode fechar a conta perfeitamente e ainda descrever mal o mecanismo.
>
> A quarta erra em dobro: modelo interpretável por construção resolve a explicação, **não** a justiça. Regras visíveis podem produzir taxas de erro muito diferentes entre grupos — e você só descobre medindo.
> **volte para:** #interpretavel-por-construcao-ou-explicado-depois
:::

## Três definições de justiça que não cabem juntas

Cada uma é razoável. Cada uma tem defensores sérios. Cada uma exige uma coisa diferente.

| Definição | Exige que… | Quem ela protege |
|---|---|---|
| **Paridade demográfica** | a proporção de decisões positivas seja igual entre os grupos | quem é sub-representado no resultado, independentemente do desfecho |
| **Igualdade de oportunidade** | entre quem **de fato** é positivo, a taxa de acerto seja igual entre os grupos | quem merecia a decisão favorável e não a teve |
| **Calibração** (*test fairness*) | o mesmo escore signifique a mesma probabilidade em qualquer grupo | quem lê o escore e age sobre ele — e, por tabela, quem seria mal servido por um escore que "vale menos" no seu grupo |

Note que a primeira nem olha o desfecho, e as outras duas olham. Já se pode sentir o atrito.

### A álgebra de três linhas

A relação de Chouldechova amarra quatro grandezas: **taxa de falso positivo**, **prevalência**, **valor preditivo positivo** e **taxa de falso negativo**. Fixadas três, a quarta está determinada. Não é uma tendência empírica — é identidade.

A consequência é a frase citada acima: com prevalência diferente entre os grupos, um escore calibrado **não pode** ter taxas de falso positivo e de falso negativo iguais entre eles. E prevalência quase sempre difere, por razões que nada têm a ver com o modelo — inclusive porque o próprio dado histórico registra um processo social, e não a verdade sobre as pessoas (ver [capítulo 02](02-dados.md) e [capítulo 12](12-modelos-de-fundacao.md)).

Daí a formulação prática: **exigir as três definições ao mesmo tempo é exigir que a prevalência seja igual.** Se ela não for, você está pedindo algo aritmeticamente impossível — e alguém vai entregar um relatório dizendo que conseguiu.

:::exercicio {"id":"14-e2","tipo":"numerica","objetivo":"O4","dificuldade":"media"}
Um escore de risco foi avaliado separadamente em dois grupos, com mil pessoas cada. A tabela traz as quatro células da matriz de confusão de cada um:

| Grupo | Positivo real, previsto positivo | Positivo real, previsto negativo | Negativo real, previsto positivo | Negativo real, previsto negativo |
|---|---|---|---|---|
| **A** (prevalência 40%) | 280 | 120 | 120 | 480 |
| **B** (prevalência 60%) | 420 | 180 | 180 | 220 |

Calcule a **taxa de falso positivo do grupo B**. Responda em fração, com duas casas decimais.

> **gabarito:** 0,45 ± 0,01
> **porque:** A taxa de falso positivo é calculada **sobre os negativos reais**, nunca sobre o total. No grupo B há 180 + 220 = **400** negativos reais, dos quais 180 foram previstos como positivos: 180 / 400 = **0,45**. O erro mais comum é dividir por 1 000 e obter 0,18 — isso mede outra coisa.
>
> Agora faça as outras contas, porque é aqui que o capítulo se fecha. No grupo A: 120 / 600 = **0,20** de falso positivo. Valor preditivo positivo: no A, 280 / 400 = **0,70**; no B, 420 / 600 = **0,70** — **idênticos**. Taxa de falso negativo: 120 / 400 = 0,30 no A e 180 / 600 = 0,30 no B — **também idênticos**.
>
> Ou seja: este escore trata os dois grupos igualmente em duas definições e ainda assim **erra para cima mais que o dobro** no grupo B (0,45 contra 0,20). Nada foi sabotado. A única diferença entre os grupos é a **prevalência**, e ela sozinha basta. É exatamente o que o teorema diz, agora em números que você conferiu com uma divisão.
> **volte para:** #a-algebra-de-tres-linhas
:::

## Quando o teorema diz que você tem de escolher

Provado que não dá para ter tudo, o trabalho muda de natureza. Ele passa a ser de **procedimento**, e tem quatro partes.

**1. Declarar a escolha.** Escreva qual critério o sistema otimiza, qual foi abandonado, e por quê. Uma frase basta — "priorizamos igualdade de oportunidade porque o custo do falso negativo recai sobre quem já tem menos acesso, e aceitamos taxas de falso positivo desiguais". Escolha calada não deixa de ser escolha; deixa apenas de ser auditável.

**2. Medir por subgrupo, sempre.** A média esconde a decisão. Reporte a **matriz de confusão inteira por subgrupo** (ver [capítulo 04](04-avaliacao.md)), não uma métrica agregada. Três cuidados: declare os subgrupos **antes** de olhar os resultados, para não caçar o recorte conveniente; verifique se cada subgrupo tem gente suficiente para a estimativa significar algo; e lembre que ausência de diferença medida em um subgrupo pequeno é ausência de medida, não ausência de diferença.

**3. Envolver quem paga a conta.** A escolha entre critérios distribui erro entre pessoas. Quem decide raramente é quem recebe. Levar a decisão a quem sofre a consequência não é gentileza — é a única forma de descobrir qual erro dói mais, informação que não está no conjunto de dados.

**4. Registrar.** Um **Model Card** documenta o modelo como um datasheet documenta o dado: uso pretendido, uso desaconselhado, **desempenho desagregado por subgrupo**, e as considerações éticas. O elo com o [capítulo 02](02-dados.md) não é analogia — é a **mesma autora**: Timnit Gebru assina os dois. Documentar o dado e documentar o modelo são um projeto só.

E há uma quinta saída, que é decisão legítima: **não lançar**. Desempenho bom no agregado e ruim num subgrupo que importa é motivo suficiente, e defender essa recusa exige o mesmo aparato de defender o lançamento — ver [capítulo 25](25-do-modelo-a-decisao.md).

:::exercicio {"id":"14-e3","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Um plano de saúde vai usar um escore para selecionar pacientes crônicos que entram num programa de acompanhamento intensivo — as vagas são limitadas e o programa reduz internações. A prevalência de complicação grave é **maior no grupo X** do que no grupo Y, por razões conhecidas de acesso histórico a atendimento.

A diretoria pede que o escore seja, ao mesmo tempo, **calibrado** (o mesmo escore significa a mesma probabilidade nos dois grupos) e **igualitário em oportunidade** (mesma taxa de acerto entre quem de fato vai complicar).

Escreva a resposta que você levaria à diretoria: explique por que o pedido é impossível como está, escolha **um** dos dois critérios, e diga **quem paga a conta** da sua escolha.

> **rubrica:** explica que os dois critérios não podem valer juntos porque a prevalência difere entre os grupos, e que isso é identidade aritmética, não limitação de engenharia;
> nomeia corretamente o que cada critério exige;
> escolhe explicitamente **um** critério em vez de propor um meio-termo vago;
> identifica de forma concreta quem sofre o erro resultante — qual grupo, qual tipo de erro, qual consequência clínica;
> propõe ao menos uma ação de procedimento (registrar a escolha, reportar por subgrupo, ouvir os afetados, revisar a prevalência na origem);
> NÃO afirma que existe uma resposta tecnicamente correta
> **porque:** A resposta fraca promete "buscar um equilíbrio" e pede mais dados. Mais dados não removem a incompatibilidade: ela decorre da diferença de prevalência, não do tamanho da amostra.
>
> A resposta forte faz três movimentos. Primeiro, devolve o pedido: as duas exigências juntas equivalem a exigir prevalências iguais. Segundo, escolhe — e nomeia o preço. Priorizar **igualdade de oportunidade** tende a levar mais gente do grupo X ao programa, aumentando o falso positivo lá e consumindo vagas que outros pacientes teriam; priorizar **calibração** preserva o significado do escore para quem o lê, ao custo de que a taxa de erro seja pior em um dos grupos. Terceiro, diz **quem paga** em termos de pessoas e desfechos — pacientes que complicam sem entrar no programa, ou pacientes que ocupam vaga sem precisar — e não em termos de métrica.
>
> O movimento que separa uma boa resposta de uma excelente é reparar que a prevalência diferente **é ela mesma o resíduo de um acesso desigual anterior**. Nesse caso, otimizar sobre ela é herdar o problema. A ação mais valiosa pode estar fora do modelo: ampliar o acesso que produziu a diferença. O modelo não pode consertar isso, e afirmar que pode é a forma mais educada de não decidir.
> **volte para:** #quando-o-teorema-diz-que-voce-tem-de-escolher
:::

## Síntese — o que levar

- **Quando dois lados discordam com dados corretos, o desacordo é de definição, não de fato.** Procure a definição escondida antes de procurar o erro de conta.
- Interpretabilidade tem duas perguntas: **global** (como funciona) e **local** (por que este caso). A regulação cobra a local; os times entregam a global.
- **Explicação post-hoc é aproximação, não motivação.** Ela descreve o comportamento do modelo; não é a razão pela qual ele decidiu.
- SHAP é atribuição por contribuição média em coalizão, com soma exata. Soma exata é **coerência**, não veracidade — e não é causalidade no mundo.
- Paridade demográfica, igualdade de oportunidade e calibração são **critérios rivais**. Exigir os três é exigir prevalências iguais.
- Com prevalências diferentes, **algum desequilíbrio de taxas de erro tem de existir**. É identidade, não descuido.
- A média esconde a decisão: reporte a **matriz de confusão por subgrupo**, com os subgrupos declarados antes.
- Escolha declarada é auditável; escolha calada é a mesma escolha, sem responsável.
- **A matemática esperou o problema** — Shapley 1953, SHAP 2017, fórmula intacta.

## Verificação

1. Um colega mostra uma explicação SHAP de uma negativa de crédito e conclui: "foi a renda que causou a recusa". Reescreva a frase de modo tecnicamente defensável, e diga o que se perde na versão original.
2. Sua auditoria mostra que o modelo é bem calibrado nos dois grupos e que a taxa de falso positivo é o dobro em um deles. Um gestor pede que você "corrija o modelo até que as duas coisas fiquem iguais". O que você responde, e o que oferece no lugar?
3. Você precisa escolher entre um ensemble com desempenho superior e um modelo de regras com desempenho ligeiramente inferior, num domínio em que cada decisão negativa pode ser contestada individualmente. Que critérios usaria, e em que condição a escolha se inverteria?
