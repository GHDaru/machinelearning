# 04 — Avaliação

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> **Capítulo-piloto do esqueleto v4.** É aqui que o formato do livro foi validado antes de ser exigido dos demais — como o cap. 04 foi o piloto do livro de Engenharia de Harness, e pela mesma razão: avaliação é o assunto em que a diferença entre "achar que entendeu" e "entender" aparece mais rápido.

## Objetivos de aprendizagem

- **O1.** Explicar por que acurácia é enganosa sob desbalanceamento de classes.
- **O2.** Calcular e interpretar precisão, revocação e F1 a partir de uma matriz de confusão.
- **O3.** Escolher a métrica adequada a partir do **custo do erro** no problema, e não por hábito.
- **O4.** Distinguir a qualidade do *ranking* (AUC) da qualidade da *decisão* (limiar), e explicar por que calibração é uma terceira coisa.
- **O5.** Reportar uma métrica com incerteza, em vez de um ponto.

## O problema: 99,7% de acurácia sem modelo nenhum

Uma operadora de cartões pede um detector de fraude. A base tem 0,3% de transações fraudulentas. A equipe treina, mede, e reporta com orgulho: **99,5% de acurácia**.

O número é verdadeiro e é inútil. Um "modelo" de uma linha — `return "não é fraude"` — atinge 99,7%. A equipe entregou algo **pior que a ausência de modelo**, e a métrica escolhida escondeu isso atrás de dois noves.

Este capítulo é sobre não deixar isso acontecer. E o mecanismo do erro não é matemático — é de processo: **a métrica foi escolhida depois do modelo**, por hábito, em vez de antes, a partir do custo do erro.

### A linha de base que você precisa bater

Antes de qualquer métrica sofisticada, calcule o que um classificador trivial atinge:

- **Classificação**: sempre a classe majoritária.
- **Regressão**: sempre a média (ou a mediana) do treino.
- **Séries temporais**: repetir o último valor observado. Essa costuma ser surpreendentemente difícil de bater.

Se o modelo não bate a linha de base, ele não tem valor — independentemente de quantos dígitos a acurácia tenha. Registre esse número no início do projeto e mantenha-o visível em todo relatório. É o gesto mais barato de higiene metodológica que existe, e o mais frequentemente pulado.

:::exercicio {"id":"04-e1","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Numa base de detecção de fraude com 0,3% de casos positivos, um modelo atinge 99,5% de acurácia no teste. Qual leitura é correta?

- [ ] O modelo é excelente: erra menos de 1 caso em 200.
- [x] O número não diz quase nada: prever "não é fraude" para tudo já daria 99,7%.
- [ ] A acurácia não pode ser usada em problemas binários.
- [ ] O modelo é bom, mas precisaria de mais dados para confirmar.

> **gabarito:** O número não diz quase nada
> **porque:** Com 0,3% de positivos, a classe majoritária sozinha entrega 99,7% de acurácia. O modelo com 99,5% está **abaixo** do classificador que não faz nada — ele está, na prática, destruindo valor. Acurácia mede a fração de acertos totais; quando uma classe domina, ela mede sobretudo a **prevalência**, não a competência do modelo. Note que a alternativa "não pode ser usada em problemas binários" é falsa e revela outro mal-entendido: acurácia é perfeitamente válida quando as classes são equilibradas e os dois tipos de erro custam o mesmo. O problema não é a métrica; é usá-la fora da condição em que ela informa.
> **volte para:** #a-linha-de-base-que-voce-precisa-bater
:::

## Fundamentos: a matriz de confusão e o que dela deriva

Toda métrica de classificação binária nasce de quatro números:

|  | Predisse positivo | Predisse negativo |
|---|---|---|
| **É positivo** | Verdadeiro Positivo (VP) | Falso Negativo (FN) |
| **É negativo** | Falso Positivo (FP) | Verdadeiro Negativo (VN) |

A partir deles:

| Métrica | Fórmula | Pergunta que responde |
|---|---|---|
| **Acurácia** | (VP+VN)/total | de tudo, quanto acertei? |
| **Precisão** | VP/(VP+FP) | dos que **apontei** como positivos, quantos eram? |
| **Revocação** | VP/(VP+FN) | dos que **eram** positivos, quantos encontrei? |
| **F1** | média harmônica de precisão e revocação | um número quando os dois importam igualmente |
| **Especificidade** | VN/(VN+FP) | dos negativos, quantos deixei em paz? |

A distinção entre precisão e revocação é o eixo do capítulo, e a mnemônica que funciona é a das perguntas: **precisão olha para a coluna do que você apontou; revocação olha para a linha do que existia.**

E há um trade-off inescapável entre elas. Um modelo que aponta *tudo* como positivo tem revocação 1,0 e precisão péssima. Um que aponta apenas o caso de que tem certeza absoluta tem precisão alta e revocação irrisória. Mover o limiar desloca você ao longo dessa curva — nunca melhora os dois ao mesmo tempo.

### Worked example: a mesma matriz, três leituras

Um modelo de triagem médica, avaliado em 1.000 pacientes, dos quais 100 têm a doença:

|  | Predisse doente | Predisse saudável |
|---|---|---|
| **Doente** | VP = 80 | FN = 20 |
| **Saudável** | FP = 40 | VN = 860 |

- **Acurácia** = (80+860)/1000 = **0,940**
- **Precisão** = 80/(80+40) = **0,667** — de cada 3 alarmes, 1 é falso
- **Revocação** = 80/(80+20) = **0,800** — 20 doentes passaram despercebidos
- **F1** = 2·(0,667·0,800)/(0,667+0,800) = **0,727**
- **Linha de base trivial** ("todos saudáveis") = 900/1000 = **0,900**

Três leituras do mesmo modelo, e todas verdadeiras:

1. **"94% de acurácia"** — tecnicamente correto, e quase desonesto: o trivial faz 90%.
2. **"Encontra 4 de cada 5 doentes"** — a leitura da revocação. É a que importa numa triagem, porque o custo de um FN é uma doença não tratada.
3. **"Um terço dos alarmes é falso"** — a leitura da precisão. É a que determina se o serviço é operável: se cada alarme custa um exame caro, 33% de desperdício pode inviabilizar o programa.

**A métrica certa é a que responde à pergunta cujo erro custa caro.** Numa triagem, FN mata e FP custa dinheiro — então revocação manda, com precisão como restrição orçamentária. Num filtro de spam, é o inverso: o FN é um email chato na caixa de entrada, o FP é uma fatura perdida na pasta de lixo. Mesmo formalismo, prioridades opostas.

:::exercicio {"id":"04-e2","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Um classificador produziu a seguinte matriz de confusão: VP = 45, FP = 15, FN = 30, VN = 410.

Qual é a **precisão**? Responda com 2 casas decimais.

> **gabarito:** 0.75 ± 0.01
> **porque:** Precisão = VP/(VP+FP) = 45/(45+15) = 45/60 = **0,75**. O erro mais comum aqui é usar VP/(VP+FN) — isso dá 45/75 = 0,60, que é a **revocação**. A forma de nunca trocar é voltar à pergunta: precisão pergunta "dos que **apontei**, quantos eram?", então o denominador é tudo o que você apontou como positivo (VP+FP). Revocação pergunta "dos que **eram**, quantos achei?", então o denominador é tudo o que era positivo de verdade (VP+FN). Repare que este modelo tem precisão razoável e revocação de 0,60 — ele erra pouco quando fala, mas fica calado com frequência.
> **volte para:** #fundamentos-a-matriz-de-confusao-e-o-que-dela-deriva
:::

:::exercicio {"id":"04-e3","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Um sistema faz a triagem inicial de currículos, descartando candidatos antes de qualquer olhar humano. Qual métrica deve orientar a decisão de limiar, e por quê?

- [ ] Precisão: é caro entrevistar candidatos ruins.
- [x] Revocação: um candidato bom descartado nunca mais é recuperado, e ninguém fica sabendo do erro.
- [ ] Acurácia: é a métrica mais completa, pois considera as quatro células.
- [ ] F1: equilibra as duas e evita ter de escolher.

> **gabarito:** Revocação
> **porque:** A pergunta não é estatística, é de **assimetria de custo e de visibilidade**. Um falso positivo (candidato mediano que passa) custa uma entrevista — é caro, mas é detectado e corrigido pelo humano na etapa seguinte. Um falso negativo (candidato bom descartado) é invisível: ninguém no processo jamais saberá que ele existiu, o erro nunca aparece em nenhum relatório e não há mecanismo de correção. Erros invisíveis são mais perigosos que erros caros, porque não geram aprendizado. Escolher F1 aqui (alternativa 4) é a resposta mais sedutora e a mais preguiçosa: F1 assume que os dois erros pesam igual, e a premissa inteira deste caso é que **não pesam**. Escolher F1 é declarar indiferença — só que sem perceber que está declarando.
> **volte para:** #worked-example-a-mesma-matriz-tres-leituras
:::

## Ranking, decisão e calibração — três coisas diferentes

Um classificador quase sempre produz um **escore** contínuo, e só vira decisão quando você escolhe um **limiar**. Isso separa três perguntas que costumam ser confundidas numa só.

**1. O ranking é bom?** — Se eu ordenar todos os exemplos pelo escore, os positivos ficam no topo? É o que a **AUC-ROC** mede: a probabilidade de um positivo sorteado ao acaso receber escore maior que um negativo sorteado ao acaso. AUC não depende de limiar nenhum.

**2. A decisão é boa?** — Escolhido um limiar, quantos FP e FN aparecem? É aí que vivem precisão, revocação e o custo real da operação.

**3. Os escores são probabilidades honestas?** — Quando o modelo diz 0,8, isso acontece 80% das vezes? Isso é **calibração**, e é uma propriedade *independente* das duas anteriores. Um modelo pode ter AUC excelente (ordena perfeitamente) e ser péssimo calibrado (todos os escores comprimidos entre 0,4 e 0,6). Se a decisão a jusante multiplica a probabilidade por um valor monetário — preço, provisão, expectativa de perda — calibração deixa de ser refinamento e vira requisito.

**Uma armadilha específica.** Sob desbalanceamento severo, a AUC-ROC é otimista: o eixo de falsos positivos é normalizado pelo total de negativos, que é enorme, então mesmo muitos FP mal movem a curva. Para classes raras, prefira a **AUC-PR** (precisão × revocação), cuja linha de base é a própria prevalência — 0,003 no exemplo da fraude, o que deixa qualquer melhora visível em vez de diluída.

> **Cláusula de expiração.** Escrevo em 2026 que AUC-PR é a escolha padrão para classes raras e que a calibração é tratada como etapa pós-treino (Platt, isotônica). Se, na próxima revisão, os modelos de uso geral estiverem entregando escores bem calibrados sem etapa dedicada, esta seção muda de recomendação. Acompanhamento no [placar de expiração](../HISTORICO.md).

:::exercicio {"id":"04-e4","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Um modelo tem AUC-ROC de 0,95 no teste. Quais conclusões são **legítimas** a partir só desse número? (marque todas que valem)

- [x] O modelo ordena bem: positivos tendem a receber escores maiores que negativos.
- [ ] O modelo acerta 95% das predições.
- [ ] Os escores do modelo podem ser lidos como probabilidades confiáveis.
- [x] Existe **algum** limiar com um bom compromisso entre precisão e revocação.
- [ ] O modelo terá bom desempenho mesmo se a prevalência da classe positiva mudar.

> **gabarito:** ordena bem · existe algum limiar com bom compromisso
> **porque:** AUC é uma medida de **ordenação**, e só isso. Ela não é uma taxa de acerto (0,95 de AUC não é 95% de acurácia — são grandezas diferentes), não diz nada sobre **calibração** (um modelo pode ordenar perfeitamente e ainda assim ter escores sem significado probabilístico), e não sobrevive intacta a mudanças de prevalência — quando a proporção de positivos muda, precisão e a operação real mudam junto, mesmo com a AUC-ROC estável. Esse último ponto é exatamente por que a AUC-PR é preferível para classes raras: ela é sensível à prevalência, que é o que muda no mundo. As duas corretas são as únicas que se limitam ao que a definição da AUC autoriza.
> **volte para:** #ranking-decisao-e-calibracao-tres-coisas-diferentes
:::

## Métrica é uma estimativa — reporte a incerteza

Uma acurácia de 0,94 medida em 100 exemplos e uma medida em 100.000 exemplos são o mesmo número e informações muito diferentes. A primeira tem intervalo de confiança de 95% de aproximadamente ±0,047; a segunda, de ±0,0015. Reportar as duas como "0,94" apaga a diferença que mais importa para decidir.

Duas práticas baratas resolvem quase tudo:

1. **Intervalo por *bootstrap***: reamostre o conjunto de teste com reposição algumas centenas de vezes, recalcule a métrica em cada reamostra, e reporte os percentis 2,5 e 97,5. Não exige suposição sobre a distribuição e funciona para qualquer métrica.
2. **Validação cruzada com desvio-padrão**: reporte média ± desvio entre as dobras. Um modelo com 0,84 ± 0,01 e outro com 0,86 ± 0,09 não estão empatados nem separados — estão em situações qualitativamente diferentes, e o segundo é instável.

Regra prática que vale como norma editorial deste livro: **duas métricas sem intervalos não podem ser comparadas.** "Melhorou de 0,912 para 0,918" é uma frase sem conteúdo até que se saiba se o ruído da medição é maior que 0,006.

:::exercicio {"id":"04-e5","tipo":"aberta","objetivo":"O5","pontos":3,"dificuldade":"dificil"}
Sua equipe compara dois modelos no mesmo conjunto de teste de 800 exemplos: o modelo A tem F1 = 0,812 e o modelo B, F1 = 0,829. Alguém propõe substituir A por B em produção.

Escreva a resposta que você daria: **o que falta saber** antes dessa decisão, e **como você obteria** essa informação.

> **rubrica:** questiona se a diferença de 0,017 é maior que a incerteza da medição;
> propõe um procedimento concreto para estimar essa incerteza (bootstrap, validação cruzada ou teste pareado);
> observa que os dois modelos foram medidos no mesmo conjunto, o que permite comparação pareada e reduz a variância da comparação;
> considera ao menos um fator além da métrica (custo de troca, latência, interpretabilidade, calibração, comportamento por subgrupo)
> **porque:** A diferença é de 0,017 num conjunto de 800 exemplos — plausivelmente dentro do ruído amostral. O caminho correto não é rejeitar B, é **medir a incerteza antes de decidir**: bootstrap pareado sobre o mesmo teste (reamostre os índices, recalcule as duas métricas na mesma reamostra e observe a distribuição da **diferença**) responde diretamente à pergunta certa. O detalhe do pareamento é o que separa uma resposta boa de uma correta: como os dois modelos foram avaliados nos mesmos exemplos, a comparação pareada elimina a variância comum ao conjunto e é bem mais sensível que comparar dois intervalos independentes. E a decisão de produção nunca é só da métrica — trocar modelo tem custo, e um ganho dentro do ruído não paga esse custo.
> **volte para:** #metrica-e-uma-estimativa-reporte-a-incerteza
:::

## Mão na massa

A **etapa 04** do [`ml-zero`](../trilha-ml-zero.md) implementa, em NumPy puro e sem scikit-learn:

1. `matriz_confusao(y_true, y_pred)` — os quatro números;
2. `precisao`, `revocacao`, `f1` derivadas dela;
3. `curva_pr` e `auc_pr` por varredura de limiares;
4. `bootstrap_ic(metrica, y_true, y_score, n=1000)` — o intervalo de confiança;
5. a comparação pareada entre dois modelos que o exercício 04-e5 pediu.

Implementar precisão e revocação uma vez, à mão, é o antídoto mais duradouro contra trocá-las — que é o erro mais comum do capítulo, inclusive entre praticantes experientes.

## Assista

:::video {"id":"04-v1","fonte":"youtube","ref":"4jRBRDbJemM","min":16,"autor":"StatQuest with Josh Starmer","titulo":"ROC and AUC, Clearly Explained!"}
A curva ROC é o conceito deste capítulo que menos sobrevive à explicação em prosa. O vídeo constrói a curva **ponto a ponto**, deslizando o limiar e mostrando a matriz de confusão mudar junto — e é essa animação que faz cair a ficha de que ROC não é uma métrica de um modelo, mas o retrato de *todos os limiares de uma vez*. Assista antes do exercício 04-e4.
:::

## Síntese — o que levar

- **Calcule a linha de base trivial antes de tudo** e mantenha-a em todo relatório. Modelo que não a bate não existe.
- Acurácia informa quando as classes são equilibradas e os erros custam igual. Fora disso, ela esconde.
- **Escolha a métrica pelo custo do erro, antes de treinar.** Escolher depois é escolher a que ficou bonita.
- AUC mede *ranking*; limiar produz *decisão*; calibração é uma **terceira** propriedade, exigida sempre que a probabilidade vira dinheiro.
- Métrica sem intervalo não se compara. Bootstrap pareado é barato e resolve.

## Verificação

1. Explique a diferença entre precisão e revocação para alguém de negócio, sem escrever nenhuma fórmula.
2. Em que situação um modelo com AUC de 0,99 pode ser inútil na prática? Dê um exemplo concreto.
3. Sua equipe reporta "acurácia de 97%". Que três perguntas você faz antes de aprovar o deploy?
