# 07 — Árvores e Ensembles

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-05 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar como uma árvore de decisão escolhe cada divisão.
- **O2.** Distinguir bagging de boosting quanto ao erro que cada um ataca.
- **O3.** Ajustar os hiperparâmetros de um modelo de boosting na ordem que importa.
- **O4.** Justificar por que boosting em dados tabulares continua competitivo com deep learning.

## O problema: a fronteira que a reta não alcança

Um sistema precisa detectar consumo anômalo de energia. A regra real, que ninguém escreveu porque ninguém a conhecia inteira, é esta:

- consumo **muito alto** fora do horário comercial é anomalia;
- consumo **muito baixo** também é — medidor quebrado, fraude por desvio;
- consumo intermediário, em qualquer horário, é normal.

Um modelo linear não consegue expressar isso. Nem com mais dados, nem com mais tempo de treino. A razão é estrutural: uma reta é monotônica em cada atributo — se "mais consumo" empurra para anomalia, ele empurra sempre, no mesmo sentido. E aqui os **dois extremos** são anomalia e o **meio** é normal.

Medimos. No dado do experimento da [etapa 07](../trilha-ml-zero.md), com o teto teórico em 0,9402 de AUC:

| Modelo | AUC | % do teto |
|---|---|---|
| **Linear** | **0,4963** | 52,8% |
| Árvore (profundidade 3) | 0,9201 | 97,9% |
| Floresta (25 árvores) | 0,9332 | 99,3% |
| Boosting (50 árvores, η=0,2) | **0,9392** | **99,9%** |

O modelo linear está em 0,4963 — **acaso**. Não é que ele vá mal; é que ele não tem como ir bem. Já uma árvore de **profundidade 3** — três perguntas encadeadas — chega a 98% do teto.

## De onde isto veio

### As árvores: Breiman fora da universidade

**O aperto.** Leo Breiman **deixou a academia em 1967** e passou treze anos como consultor, voltando a Berkeley só em **1980**. Nesse período ele modelou coisas como padrões de tráfego em autoestradas, gargalos no sistema judiciário e o nível de ozônio do dia seguinte na bacia de Los Angeles. Três características em comum, e nenhuma delas aparece num seminário de estatística: **variáveis de tipos misturados** (número, categoria, ordem), **dados faltando** por razões banais, e o resultado tendo de ser explicado a quem **não lê estatística** — um juiz, um engenheiro de tráfego, um secretário municipal.

**O que se fazia antes.** Modelos paramétricos que exigiam que o consultor jurasse a forma da relação antes de olhar o dado, e que devolviam uma equação impossível de defender numa reunião com quem decide.

**A virada.** Um modelo que **é a própria explicação**: uma sequência de perguntas binárias sobre os atributos. A árvore não aproxima uma função e depois se explica — ela **já é** o organograma da decisão. E lida com tipo misto sem esforço, porque cada corte só precisa saber comparar dentro de um atributo.

**A ideia reaproveitável.** **A restrição de quem vai usar o resultado é um requisito de projeto, não uma limitação a lamentar.** CART tem a forma que tem porque nasceu na consultoria e não no seminário. Sempre que você escolher um modelo, a pergunta "quem vai precisar defender esta decisão, e para quem?" muda a resposta — e é uma pergunta técnica, não política.

**O nome.** *Classification and Regression Trees* (Breiman, Friedman, Olshen & Stone, Wadsworth, **1984**). Em paralelo, na linha da inteligência artificial, Quinlan desenvolve o **ID3** — *Iterative Dichotomiser 3* —, herdeiro do CLS de Hunt (1966); conta-se que o gatilho foi um desafio de Donald Michie: decidir, só por atributos do tabuleiro, se um final de xadrez Rei-Torre contra Rei-Cavalo está perdido em número fixo de lances.

### O boosting: uma pergunta que virou algoritmo

Esta é a origem menos conhecida e a mais instrutiva do capítulo, porque **ninguém estava procurando boosting**.

Em **1988**, Michael Kearns e Leslie Valiant fizeram uma pergunta **teórica**: um aprendiz que só acerta um pouco mais que o acaso pode ser transformado num aprendiz arbitrariamente bom? Era uma questão sobre **limites do possível**, não um pedido de algoritmo. Em **1990**, Robert Schapire respondeu que **sim** — e a prova era **construtiva**. A construção era o método. AdaBoost, com Freund, vem em seguida.

**A ideia reaproveitável.** **Uma pergunta bem-posta sobre limites vira algoritmo.** Quando você consegue formular precisamente *"isto é possível?"*, a resposta afirmativa frequentemente já contém o *como*. Vale mais aprender isso do que decorar o AdaBoost.

> **Repare no relógio.** Em quase todo o resto deste livro, a distância entre a ideia e o procedimento utilizável é de décadas: 1943→1958 no [capítulo 18](18-neuronio-artificial.md), 1927→1970 no [24](24-series-temporais.md), 1931→1974 no [01](../01-fundamentos.md). No boosting são **sete anos** — pergunta em 1988, resposta em 1990, algoritmo em 1995.
>
> A diferença não é a época nem o computador. É que aqui **o aperto já estava formulado como uma pergunta formal precisa**. Quando a pergunta é vaga, a espera é longa; quando é exata, a resposta traz o método junto. Isso é uma dica prática sobre como gastar o seu tempo: afiar a pergunta costuma render mais que procurar a solução.

### E a ponte com o capítulo 06

Bagging — *bootstrap aggregating*, Breiman, 1996 — vem do mesmo diagnóstico que produziu o LASSO no [capítulo 06](06-otimizacao.md): **instabilidade**. Breiman classificou métodos entre estáveis e instáveis, e a árvore é o caso extremo de instável — mude poucos exemplos e a árvore inteira muda.

Do lado "instabilidade é defeito, encolha os coeficientes" saiu a regularização. Do lado **"instabilidade é insumo"** saiu o bagging: se o modelo varia muito com o dado, então **perturbe de propósito** e tire a média. Random Forests (2001) é a mesma frase dita de novo, com uma perturbação a mais. **O mesmo diagnóstico, dois métodos, dois capítulos.**

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Breiman deixando a academia em 1967, os treze anos de consultoria, o retorno em 1980 e os três exemplos de projeto — [memorial da Estatística de Berkeley](https://statistics.berkeley.edu/about/memoriam/memory-leo-breiman) |
| ✓ᵐ | CART (1984), *bagging* (*Machine Learning* 24:123–140, 1996), Random Forests (2001), Schapire (*Machine Learning* 5:197–227, 1990): obra, ano e veículo |
| ⏳ | A pergunta de Kearns & Valiant (1988) e sua formulação como manuscrito sobre *hypothesis boosting* |
| ⏳ | O desafio de Michie a Quinlan e o final Rei-Torre × Rei-Cavalo; a filiação do ID3 ao CLS de Hunt (1966) |
| ❌ | O **nome do projeto de consultoria específico** que gerou o CART — procurei e não achei em primária |
| 📖 | As três ideias reaproveitáveis, a leitura sobre o relógio do boosting e a ponte com o capítulo 06 |

> **Números deste capítulo.** Todos saem de [`ml-zero/etapa-07/rodar.py`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-07/rodar.py), com seed fixa. Rodar duas vezes dá o mesmo resultado (Princípio II).

> ⚠ **Honestidade sobre o experimento.** O dado foi **construído** com uma regra que é literalmente uma árvore pequena — uma interação e uma quebra. Árvores têm vantagem estrutural aqui **por construção**, e seria desonesto apresentar isso como descoberta. O experimento serve para tornar visível *por que* a vantagem existe, não para provar que ela sempre existe. A evidência de que dado tabular real tende a ter essa forma está em Grinsztajn et al. (2022), adiante.

## Fundamentos: como a árvore escolhe cada corte

Uma árvore de decisão é uma sequência de perguntas binárias. A única decisão real é: **qual pergunta fazer em cada nó?**

O procedimento é guloso e local. Em cada nó, para cada atributo, para cada corte possível, mede-se quanto o corte reduz a **impureza** — e escolhe-se o melhor. Depois repete-se nos dois filhos, sem nunca reconsiderar o corte anterior.

A impureza mais usada em classificação é o **Gini**:

$$\text{Gini}(p) = 2p(1-p)$$

onde $p$ é a proporção da classe positiva no nó. A intuição vale mais que a fórmula: é a chance de você errar se chutasse a classe sorteando pela distribuição do próprio nó. Zero quando o nó é puro (só uma classe); máximo em $p = 0{,}5$ (moeda honesta).

O **ganho** de um corte é a impureza do pai menos a média ponderada da impureza dos filhos:

$$\text{ganho} = \text{Gini}(\text{pai}) - \frac{n_e}{n}\text{Gini}(\text{esq}) - \frac{n_d}{n}\text{Gini}(\text{dir})$$

Três consequências que explicam quase todo comportamento de árvore:

1. **O corte é local e definitivo.** A árvore nunca desfaz uma decisão anterior. Por isso ela é rápida e por isso ela às vezes erra feio: um corte ruim no topo compromete tudo abaixo.
2. **Escala não importa.** Multiplicar um atributo por mil não muda a ordem dos valores, e o corte depende só da ordem. É por isso que árvores dispensam normalização — ao contrário de tudo que usa distância ou gradiente (cap. 03 e 06).
3. **Atributos inúteis são ignorados de graça.** Se nenhum corte de um atributo dá ganho, ele simplesmente não aparece na árvore. Guarde este ponto: ele volta no fim do capítulo.

:::exercicio {"id":"07-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Um nó contém 100 exemplos, 50 de cada classe. Um corte candidato produz um filho com 50 exemplos (45 positivos, 5 negativos) e outro com 50 (5 positivos, 45 negativos). Qual é o ganho de Gini desse corte?

- [ ] 0,000 — o corte não ajuda, porque cada filho ainda tem as duas classes.
- [x] Aproximadamente 0,320.
- [ ] 0,500 — o corte separa metade dos exemplos.
- [ ] Não dá para calcular sem saber qual atributo foi usado.

> **gabarito:** Aproximadamente 0,320
> **porque:** Gini do pai: 2 × 0,5 × 0,5 = **0,5**. Cada filho tem p = 45/50 = 0,9, logo Gini = 2 × 0,9 × 0,1 = **0,18**. Como os dois filhos têm o mesmo tamanho, a média ponderada é 0,18. Ganho = 0,5 − 0,18 = **0,32**.
>
> A primeira alternativa é o mal-entendido que vale corrigir: um corte não precisa deixar os filhos **puros** para valer muito. Ele precisa deixá-los **mais puros que o pai** — e este corte quase resolve o problema. Já a última alternativa confunde o que a fórmula usa: o ganho depende só de **como os exemplos se distribuem** entre os filhos, nunca de qual atributo produziu a separação. Por isso a mesma conta serve para qualquer atributo, e por isso escala não importa.
> **volte para:** #fundamentos-como-a-arvore-escolhe-cada-corte
:::

## Uma árvore sozinha tem variância alta

Árvore profunda decora. Isso já era esperado do [capítulo 01](../01-fundamentos.md) — mais capacidade, mais variância. O que o capítulo 01 não mostrou é **quanto**.

Medindo a variância da predição, Var[f̂(x)], sobre 5 reamostragens *bootstrap* do treino:

| Modelo | Var[f̂(x)] |
|---|---|
| Árvore (profundidade 12) | 0,04066 |
| Floresta (12 árvores) | **0,00676** |

**Seis vezes menos.** Treine a mesma árvore profunda em amostras ligeiramente diferentes do mesmo fenômeno e ela produz previsões visivelmente diferentes para o mesmo cliente. A floresta, não.

É essa instabilidade — não a falta de acerto — que os *ensembles* atacam primeiro.

## Bagging e boosting atacam erros diferentes

Aqui está a ideia que organiza o capítulo inteiro, e a que mais rende em entrevista e em projeto:

| | **Bagging** (floresta aleatória) | **Boosting** (gradient boosting) |
|---|---|---|
| Ataca | **variância** | **viés** |
| Como treina | árvores **em paralelo**, independentes | árvores **em sequência**, cada uma corrigindo a anterior |
| Cada árvore vê | reamostragem com reposição + subconjunto de atributos | todos os dados, mas o **resíduo** do que já foi previsto |
| Árvore individual | profunda, forte, instável | rasa, fraca, estável |
| Se você adicionar árvores demais | satura (não piora) | **passa a overfitar** |
| Paraleliza | trivialmente | não (é sequencial por definição) |

### Bagging: a média de modelos descorrelacionados

Treine 25 árvores, cada uma numa reamostragem com reposição, e tire a média. Cada árvore individual é *pior* que a árvore única treinada em tudo — viu menos dados úteis. A média delas é melhor.

Isso é contraintuitivo até você ligar à decomposição: a média de $B$ estimadores independentes com variância $\sigma^2$ tem variância $\sigma^2/B$. O viés não muda — a média de modelos igualmente enviesados é igualmente enviesada. **Bagging não deixa o modelo mais esperto; deixa-o mais estável.**

E há um segundo truque, esse de Breiman (2001, ✓): sortear um **subconjunto de atributos em cada nó**. Sem isso, as árvores ficam parecidas demais (todas escolhem o mesmo atributo forte no topo) e a média melhora pouco. Estimadores só se cancelam se forem descorrelacionados — e a subamostragem força a descorrelação.

### Boosting: cada árvore corrige o erro da anterior

Comece com uma previsão constante. Calcule o **resíduo** — o quanto cada exemplo ficou errado. Ajuste uma árvore rasa a esse resíduo. Some uma fração dela à previsão. Recalcule o resíduo. Repita.

Cada árvore é deliberadamente fraca: profundidade 3, no experimento. Sozinha, ela vale 0,9201 de AUC. **Cinquenta delas, somadas com passo 0,2, chegam a 0,9392** — 99,9% do teto teórico. É viés atacado por acumulação de correções, não por capacidade individual.

A **taxa de aprendizado** η encolhe cada contribuição. Passo pequeno com muitas árvores generaliza melhor que passo grande com poucas — o mesmo fenômeno que o [capítulo 06](06-otimizacao.md) trata como regularização.

:::exercicio {"id":"07-e2","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Uma equipe treina uma floresta aleatória com 50 árvores e obtém 0,88 de AUC na validação. Aumentam para 500 árvores. O que se espera?

- [ ] A AUC vai cair, porque 500 árvores causam overfitting.
- [x] A AUC vai melhorar pouco ou nada, e depois estabilizar — mais árvores em bagging saturam, não pioram.
- [ ] A AUC vai subir proporcionalmente ao número de árvores.
- [ ] Impossível dizer sem saber a profundidade das árvores.

> **gabarito:** Vai melhorar pouco ou nada, e estabilizar
> **porque:** Em bagging, cada árvore nova é mais um termo na média. A variância da média cai com 1/B, então o ganho por árvore diminui rapidamente — de 50 para 500 você multiplica o custo por 10 para reduzir a variância residual por um fator pequeno. **Não piora**: adicionar termos a uma média não introduz overfitting, porque nenhuma árvore nova está tentando corrigir os erros das anteriores.
>
> É exatamente aqui que bagging e boosting se separam. Em **boosting**, cada árvore nova é ajustada ao resíduo — ou seja, ela persegue ativamente o que sobrou, inclusive o ruído. Por isso, em boosting, o número de árvores **é** um hiperparâmetro de regularização, e o excesso degrada a validação.
>
> Se você respondeu "vai cair", você aplicou a intuição de boosting a bagging. É o erro mais comum do capítulo, e a razão de a tabela comparativa existir.
> **volte para:** #bagging-e-boosting-atacam-erros-diferentes
:::

:::exercicio {"id":"07-e3","tipo":"multipla-multi","objetivo":"O2","dificuldade":"dificil"}
Quais afirmações sobre a floresta aleatória são corretas? (marque todas que valem)

- [x] Cada árvore individual é tipicamente pior que uma única árvore treinada em todos os dados.
- [x] Sortear atributos em cada nó existe para descorrelacionar as árvores.
- [ ] O treino é sequencial: cada árvore depende do resultado da anterior.
- [x] Normalizar os atributos não muda o resultado.
- [ ] A floresta reduz o viés do modelo em relação a uma árvore única.

> **gabarito:** cada árvore é pior · sortear atributos descorrelaciona · normalizar não muda nada
> **porque:** As três corretas são as propriedades que definem bagging. A primeira é contraintuitiva e verdadeira: cada árvore vê uma reamostragem com reposição, na qual cerca de 37% dos exemplos originais não aparecem — ela treina com menos informação. A média é melhor porque os erros individuais se cancelam parcialmente, e isso exige que eles sejam **independentes**, que é o que a segunda propriedade compra. A terceira decorre de o corte depender só da ordem dos valores, e ordem é invariante a escala.
>
> As duas erradas trocam bagging por boosting e variância por viés. Treino sequencial é boosting. E reduzir viés é boosting: a média de modelos igualmente enviesados tem o mesmo viés — não há como a floresta representar uma função que suas árvores não representam.
> **volte para:** #bagging-a-media-de-modelos-descorrelacionados
:::

## A ordem de ajuste que economiza tempo

Boosting tem muitos hiperparâmetros e eles interagem. Ajustá-los na ordem errada custa dias. A ordem que funciona:

| # | Ajuste | Por quê primeiro |
|---|---|---|
| 1 | **Profundidade** (3–8) | define que tipo de interação o modelo consegue capturar. Profundidade 1 (tocos) só captura efeitos aditivos; 3 já captura interações de três vias |
| 2 | **Taxa de aprendizado + número de árvores**, **juntos** | são um par: baixar η exige subir o número de árvores. Fixe η baixo (0,05–0,1) e deixe o *early stopping* na validação decidir quantas |
| 3 | **Subamostragem** de linhas e colunas (0,6–0,9) | injeta o ingrediente do bagging dentro do boosting: reduz variância e acelera |
| 4 | **Regularização** (mínimo por folha, penalidades) | ajuste fino; só rende depois que os três acima estão razoáveis |

O erro caro é começar pelo item 4 — mexer em regularização com profundidade errada é otimizar a decoração de uma casa cuja planta está errada.

E use **early stopping** desde o começo: em vez de escolher o número de árvores por busca, treine muitas e pare quando a validação parar de melhorar. É o hiperparâmetro que se ajusta sozinho.

:::exercicio {"id":"07-e4","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Um modelo de boosting foi treinado com taxa de aprendizado η = 0,2 e 50 árvores. Você decide reduzir a taxa para 0,05, mantendo o mesmo "caminho percorrido" pelo modelo. Aproximadamente quantas árvores serão necessárias?

> **gabarito:** 200 ± 5
> **porque:** A contribuição total é aproximadamente o produto η × número de árvores. Dividir a taxa por 4 (de 0,2 para 0,05) exige multiplicar o número de árvores por 4: 50 × 4 = **200**.
>
> A regra é aproximada de propósito, e é útil justamente por ser grosseira: ela dá o ponto de partida da busca, não o valor final. Na prática, taxa menor com mais árvores costuma terminar **um pouco melhor** que a configuração equivalente com taxa maior — passos menores exploram a paisagem com mais cuidado e o efeito regularizador é real. Por isso a receita do item 2 é fixar η baixo e deixar o early stopping decidir o número, em vez de buscar os dois numa grade.
> **volte para:** #a-ordem-de-ajuste-que-economiza-tempo
:::

## Fundamentos científicos: por que árvores ainda ganham em tabular

A afirmação "gradient boosting continua sendo a resposta padrão para dados tabulares" é forte, e neste livro ela não vale por repetição — vale por medição de terceiros, verificada.

**Grinsztajn, Oyallon & Varoquaux (2022)** ([arXiv:2207.08815](https://arxiv.org/abs/2207.08815), ✓) montaram um *benchmark* de **45 datasets tabulares** de domínios variados, comparando modelos de árvore com métodos de deep learning padrão e específicos para tabular, sob buscas extensas de hiperparâmetros. O resultado: **modelos baseados em árvore permanecem no estado da arte em dados de porte médio (~10 mil exemplos)** — e isso sem sequer contabilizar a vantagem de velocidade.

O mais útil do trabalho não é o placar, é o **diagnóstico**. Eles identificam três características do dado tabular que explicam a diferença:

1. **Atributos não informativos.** Bases tabulares reais vêm cheias de colunas irrelevantes. Árvores as ignoram de graça — nenhum corte, nenhum ganho, nenhuma presença. Redes precisam aprender a zerá-las, e nem sempre conseguem.
2. **Funções irregulares.** A relação entre atributo e alvo tem quebras, patamares e interações abruptas. Redes têm viés a favor de funções suaves; árvores não têm viés nenhum a favor de suavidade.
3. **Orientação dos eixos.** Em dados tabulares cada coluna tem significado próprio, e árvores cortam ao longo dos eixos — o que casa com a estrutura. Redes são invariantes a rotação, uma propriedade que ajuda em imagem e atrapalha aqui.

Repare que o experimento deste capítulo foi construído com exatamente as características 1 e 2 — três atributos de puro ruído e uma fronteira com quebra e interação. Ele **ilustra** o mecanismo que o paper **mede**. As duas coisas são diferentes, e confundi-las seria vender ilustração como evidência.

> **Cláusula de expiração.** Escrevo em 2026 que gradient boosting é a escolha padrão para tabular de porte médio, sustentado por Grinsztajn et al. (2022). Esta é a afirmação com maior chance de envelhecer neste livro: há trabalho ativo em arquiteturas tabulares e em modelos de fundação para tabular. O gatilho de revisão é claro: **um benchmark independente, com o mesmo rigor de busca de hiperparâmetros, mostrando vantagem consistente de um método não-árvore em dados de porte médio**. Acompanhamento no [placar de expiração](../HISTORICO.md).

:::exercicio {"id":"07-e5","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"dificil"}
Sua equipe tem 8.000 linhas, 40 colunas tabulares, e um prazo de duas semanas. Um colega propõe começar por uma rede neural profunda, argumentando que "deep learning é o estado da arte".

Escreva a resposta que você daria: qual sua **recomendação**, com que **evidência**, e em que **condição** você mudaria de ideia.

> **rubrica:** recomenda começar por um modelo de árvore/boosting, com linha de base antes;
> sustenta a recomendação em evidência citável, não em preferência pessoal;
> menciona ao menos um dos três mecanismos (atributos não informativos, funções irregulares, orientação dos eixos) e não apenas o placar;
> declara uma condição concreta que mudaria a recomendação, em vez de tratá-la como regra absoluta;
> considera o custo de iteração dentro do prazo, e não só a métrica final
> **porque:** A recomendação defensável é **boosting**, e o argumento tem três camadas. **Evidência**: 8.000 linhas e 40 colunas caem exatamente no regime medido por Grinsztajn et al. (2022) — porte médio, tabular —, onde modelos de árvore permanecem no estado da arte. **Mecanismo**: entre 40 colunas quase certamente há colunas irrelevantes, que árvores descartam sem custo. **Prazo**: boosting treina em minutos e tem poucos hiperparâmetros que importam, o que permite muitas iterações em duas semanas — e o número de iterações costuma decidir mais que a escolha de família de modelo.
>
> A parte que separa uma boa resposta de uma dogmática é a **condição de mudança**. Exemplos legítimos: se houver texto livre ou imagem entre as colunas, se o volume crescer uma ou duas ordens de grandeza, se houver um modelo pré-treinado do domínio para aproveitar, ou se o requisito for aprender representação transferível para outra tarefa. Uma resposta que apenas afirma "árvore sempre ganha em tabular" acerta a recomendação e erra o raciocínio — e é essa a diferença que o exercício mede.
> **volte para:** #fundamentos-cientificos-por-que-arvores-ainda-ganham-em-tabular
:::

## Mão na massa

A **etapa 07** do [`ml-zero`](../trilha-ml-zero.md) implementa os três modelos em ~250 linhas de biblioteca padrão — sem NumPy, sem scikit-learn:

1. `Arvore` — CART com Gini para classificação e erro quadrático para regressão (é a segunda que o boosting usa);
2. `Floresta` — bagging com subamostragem de atributos por nó;
3. `Boosting` — árvores sequenciais sobre o resíduo, com perda logística e taxa de aprendizado;
4. `auc` — pelo método dos postos, com empates tratados;
5. `rodar.py` — o experimento inteiro, que produz a tabela deste capítulo.

Três lições do capítulo estão escritas como **testes que falham** se deixarem de ser verdade: bagging corta a variância pela metade ou mais; a reta não alcança a fronteira irregular; e ninguém passa do teto de Bayes — passar indicaria vazamento (cap. 02).

## Assista

:::video {"id":"07-v1","fonte":"youtube","ref":"3CC4N4z3GJc","min":15,"autor":"StatQuest with Josh Starmer","titulo":"Gradient Boost Part 1: Regression Main Ideas"}
Boosting é o conceito deste capítulo que a prosa explica mal, porque ele é um processo **iterativo** — e prosa é linear. O vídeo constrói o modelo passo a passo numa tabela pequena: previsão inicial, resíduo, árvore no resíduo, nova previsão, novo resíduo. Ver a coluna de resíduos encolhendo a cada rodada é o que transforma "cada árvore corrige a anterior" de frase decorada em mecanismo entendido. Assista antes do exercício 07-e4.
:::

## Síntese — o que levar

- Árvore corta por **ganho de impureza**, de forma gulosa e local. Dispensa normalização e ignora atributo inútil de graça.
- Uma árvore profunda tem **variância alta**: no experimento, 6× a da floresta.
- **Bagging ataca variância** (paralelo, árvores fortes, satura); **boosting ataca viés** (sequencial, árvores fracas, pode overfitar).
- Ordem de ajuste do boosting: profundidade → (taxa + nº de árvores, juntos) → subamostragem → regularização. Com **early stopping** desde o começo.
- Em tabular de porte médio, **árvores continuam no estado da arte** (Grinsztajn et al., 2022) — por três mecanismos, não por magia: atributos inúteis, funções irregulares e orientação dos eixos.
- E a afirmação tem prazo. O gatilho de revisão está escrito.

## Verificação

1. Explique, sem usar a palavra "variância", por que a média de 25 árvores é melhor que a melhor árvore isolada.
2. Você aumenta o número de árvores de um modelo e a validação piora. Isso é bagging ou boosting? Como você sabe?
3. Um colega diz que normalizou os atributos e a floresta melhorou. Que explicações são possíveis?
