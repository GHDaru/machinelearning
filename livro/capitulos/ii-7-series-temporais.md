# II.7 — Séries Temporais

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Decompor uma série em tendência, sazonalidade e resíduo.
- **O2.** Aplicar validação com origem móvel, e explicar por que k-fold embaralhado é inválido aqui.
- **O3.** Comparar uma previsão contra a linha de base ingênua correta.
- **O4.** Reconhecer quando um problema temporal pode ser tratado como tabular.

## O problema: o futuro vaza pela divisão

Um analista prevê a demanda mensal de um centro de distribuição. Carrega cinco anos de histórico, chama `train_test_split` com `shuffle=True`, treina, mede: **erro 4%**. Excelente. Sobe para produção. No primeiro mês, erra 22%.

Nada quebrou. O experimento é que estava errado — e de um jeito invisível. Ao embaralhar, ele pôs dezembro de 2025 no treino e junho de 2025 no teste: o modelo previu junho **sabendo o que aconteceu em dezembro**. Em produção esse conhecimento não existe, porque dezembro ainda não aconteceu.

É o vazamento do [capítulo I.3](i-3-dados.md) na sua forma mais fácil de cometer e mais difícil de perceber. A divisão aleatória, que é a coisa certa a fazer em quase todo o resto do livro, aqui é exatamente o defeito, e não deixa rastro: nenhum aviso, nenhuma exceção, nenhum número absurdo. Só uma métrica boa demais que ninguém questiona, porque métrica boa é o que todo mundo estava esperando. Este capítulo é sobre o que muda quando os dados têm **ordem**.

## De onde isto veio

**O aperto.** 1927. As manchas solares oscilam com regularidade aparente, e a estatística da época tem uma explicação pronta para qualquer periodicidade: existe um **ciclo determinístico oculto** na natureza, e o que borra a curva é o erro de medição do instrumento. **George Udny Yule** desconfia dessa divisão de trabalho. E se o ruído não estiver na medição, mas no próprio sistema?

**O que se fazia antes.** Análise harmônica: decompor a série em senos e cossenos, à procura dos períodos escondidos. O método pressupõe a resposta — se você procura período fixo, você acha algum.

**A virada.** Modelar o valor de hoje como função dos valores anteriores mais uma perturbação aleatória. É o autorregressivo. A metáfora de Yule diz tudo sem uma linha de notação: um **pêndulo que leva pancadas aleatórias** oscila, mas sem período fixo. Ele parece cíclico e não é. A regularidade não vem de um relógio escondido; vem da **inércia do próprio sistema**, que carrega para a frente cada empurrão que recebe.

**A ideia reaproveitável.** **O acaso pode estar dentro do mecanismo, não só no instrumento.** Trocar "sinal limpo + erro de leitura" por "sistema que é ele mesmo ruidoso" muda o que você procura: em vez de caçar o período verdadeiro, você estima **quanto do passado sobrevive no presente**. É uma troca de pergunta, não de técnica — e serve muito além de séries temporais. Sempre que um modelo não fecha, vale perguntar se o erro está no medidor ou na sua ideia do que está sendo medido.

**O nome.** **ARIMA** = *AutoRegressive Integrated Moving Average* — as três peças do procedimento, no acrônimo. O "AR" é Yule; o "I" é a diferenciação; o "MA" é a memória curta dos choques.

> ### Repare no relógio: 43 anos
>
> Yule publica a autorregressão em **1927**. O procedimento que qualquer pessoa consegue seguir (identificar, estimar, diagnosticar) chega em **1970**, com Box & Jenkins. **Quarenta e três anos** entre a ideia e a ferramenta.
>
> É o formato padrão deste livro: 1962→1977 no [capítulo I.4](i-4-analise-exploratoria.md), 1943→1958 no [III.1](iii-1-neuronio-artificial.md), 1931→1974 no [0.2](../0-2-fundamentos.md) — também 43 anos.
>
> Mas o [capítulo II.5](ii-5-arvores-ensembles.md) traz a exceção que explica a regra: no *boosting* foram **sete** anos. Pergunta em 1988, resposta em 1990, algoritmo em 1995. Por quê tão rápido? Porque ali o aperto já estava formulado como **pergunta formal precisa**, "um aprendiz fraco pode ser transformado num forte?", com os dois lados definidos o bastante para alguém responder sim ou não.
>
> **O gargalo nunca é o tempo nem o computador. É a precisão da pergunta.** Yule tinha uma intuição excelente e vaga; Kearns e Valiant tinham um enunciado. Quarenta e três anos contra sete.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ⏳ | O aperto de 1927 (o ruído no sistema e não na medição), a análise harmônica como prática anterior e a metáfora do pêndulo que leva pancadas |
| ✓ᵐ | Yule, *On a Method of Investigating Periodicities in Disturbed Series, with Special Reference to Wolfer's Sunspot Numbers*, Phil. Trans. Royal Society A, **226**, 267–298 (1927) — primeira aplicação de autorregressão, com defasagem 2. **Localizado e identificado; não lido** |
| ✓ᵐ | Box & Jenkins, *Time Series Analysis: Forecasting and Control* (Holden-Day, 1970), e o acrônimo ARIMA. **Localizado e identificado; não lido** |
| 📖 | A ideia reaproveitável, e a leitura do relógio — os 43 anos, o paralelo com os capítulos I.4, 18 e 01, e o contraste com os sete anos do [II.5](ii-5-arvores-ensembles.md) |

## Fundamentos: o que muda quando existe tempo

Uma série é uma sequência de observações **ordenadas**, e a ordem é informação. Quatro componentes convivem em quase toda série real:

| Componente | O que é | Como se reconhece |
|---|---|---|
| **Tendência** | movimento de longo prazo | a média muda de nível ao longo do período |
| **Sazonalidade** | padrão de **período fixo e conhecido** | mês, dia da semana, hora do dia |
| **Ciclo** | oscilação de período **variável** | dura anos, não fecha em calendário |
| **Ruído** | o que sobra | sem estrutura aproveitável |

A distinção entre sazonalidade e ciclo é a herança direta de Yule, e é a mais confundida. Sazonalidade tem calendário: dezembro é dezembro. Ciclo não tem — é o pêndulo levando pancadas, e prever quando ele vira é bem mais difícil do que prever dezembro. Antes de qualquer modelo, **desenhe a série**: é o [capítulo I.4](i-4-analise-exploratoria.md) aplicado ao tempo, e tendência, sazonalidade, quebras de nível e buracos de coleta aparecem num gráfico de linha em cinco segundos — nenhum deles aparece numa tabela de médias.

### Estacionariedade e a diferenciação

Uma série é **estacionária** quando suas propriedades estatísticas (média, variância, autocorrelação) não dependem de *quando* você olha. Os métodos clássicos exigem isso, e a razão é honesta: eles aprendem **uma** relação entre passado e presente. Se essa relação muda de ano para ano, não há o que aprender.

A ferramenta padrão é a **diferenciação**: em vez de modelar o valor, modele a variação. Uma série que cresce (100, 110, 121, 133) não é estacionária; a série das diferenças (10, 11, 12) já vive num nível fixo. Este é o **"I"** de ARIMA, de *Integrated*, o número de vezes que foi preciso diferenciar; para sazonalidade, diferencia-se contra o mesmo período do ano anterior. Duas armadilhas: diferenciar demais injeta ruído que não existia, e a previsão precisa ser **desdiferenciada** de volta à escala original, porque esquecer esse passo produz números plausíveis na unidade errada.

### O diagnóstico da memória: ACF e PACF

A **função de autocorrelação (ACF)** mede a correlação da série com ela mesma defasada de *k* períodos. É um gráfico, e responde de graça uma pergunta cara: quanto do passado ainda importa? Uma ACF que cai devagar e nunca zera denuncia tendência (falta diferenciar); um pico solitário na defasagem 12, em dado mensal, é sazonalidade anual gritando. Já a **autocorrelação parcial (PACF)** remove o efeito das defasagens intermediárias — a correlação entre hoje e três dias atrás **descontando** ontem e anteontem. É ela que sugere quantos termos autorregressivos usar; a defasagem 2 de Yule saiu de um raciocínio desse tipo.

:::exercicio {"id":"series-temporais-e1","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Você plota a série mensal de vendas de uma loja e observa: as vendas sobem de forma consistente ao longo de quatro anos, e todo dezembro é muito maior que os meses vizinhos. Qual decomposição descreve isso?

- [ ] Só sazonalidade: o pico de dezembro explica o crescimento.
- [x] Tendência (crescimento de longo prazo) mais sazonalidade anual (o pico de dezembro), mais o resíduo.
- [ ] Só ciclo: qualquer oscilação repetida é um ciclo.
- [ ] Ruído com autocorrelação, sem componente estrutural.

> **gabarito:** Tendência + sazonalidade anual + resíduo
> **porque:** São dois fenômenos independentes acontecendo juntos, e tratá-los como um só é o erro clássico. O crescimento ao longo de quatro anos é **tendência**: a média muda de nível. O pico de dezembro é **sazonalidade**, porque tem período fixo e conhecido pelo calendário, já que dezembro é sempre dezembro. A terceira alternativa confunde ciclo com sazonalidade, e a diferença é operacional, não terminológica: sazonalidade você prevê olhando o calendário; ciclo tem período variável e é justamente o que Yule mostrou que pode emergir de um sistema ruidoso, sem relógio nenhum por trás. Chamar dezembro de "ciclo" faz você procurar um período a estimar quando ele já está dado.
> **volte para:** #fundamentos-o-que-muda-quando-existe-tempo
:::

:::exercicio {"id":"series-temporais-e5","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
A série 100, 110, 121, 133 é diferenciada uma vez, virando 10, 11, 12. O modelo é ajustado sobre as diferenças e prevê 13 para o próximo passo. O que deve ser reportado como previsão de vendas?

- [ ] 13, que é a saída do modelo.
- [x] 146, porque a previsão precisa ser desdiferenciada de volta à escala original: 133 + 13.
- [ ] 13% de crescimento sobre o último valor.
- [ ] Não dá para reportar, porque a diferenciação é irreversível.

> **gabarito:** 146
> **porque:** Diferenciar troca a pergunta: o modelo passou a prever a **variação**, não o nível. Reportar 13 como vendas é a segunda armadilha que a seção nomeia, e ela é traiçoeira porque produz um número plausível na unidade errada.
>
> A volta é somar a variação prevista ao último valor observado, $133 + 13 = 146$. Com duas diferenciações, a volta é feita duas vezes, na ordem inversa.
>
> A quarta alternativa inverte a propriedade. A diferenciação é perfeitamente reversível desde que se guarde o valor de partida, e é esquecer de guardá-lo que transforma um passo reversível num relatório errado.
> **volte para:** #estacionariedade-e-a-diferenciacao
:::

:::exercicio {"id":"series-temporais-e6","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Numa série mensal, a ACF cai devagar e nunca chega perto de zero, e há um pico isolado na defasagem 12. O que os dois sinais dizem?

- [x] A queda lenta denuncia tendência, ou seja, falta diferenciar; o pico em 12 é sazonalidade anual.
- [ ] Os dois sinais indicam a mesma coisa: sazonalidade de período 12.
- [ ] A queda lenta indica ruído branco, e o pico em 12 é coincidência amostral.
- [ ] Os dois indicam que a série já é estacionária e pode ser modelada direto.

> **gabarito:** queda lenta é tendência, pico em 12 é sazonalidade anual
> **porque:** São dois diagnósticos independentes lidos no mesmo gráfico. Uma ACF que não zera significa que o valor de hoje continua correlacionado com um passado distante, que é a assinatura de nível mudando ao longo do tempo. O pico isolado em 12, em dado mensal, é o mesmo mês do ano anterior gritando.
>
> Cada um pede uma ação diferente: a tendência pede diferenciação simples, e a sazonalidade pede diferenciação contra o mesmo período do ano anterior. Tratar os dois como um só leva a diferenciar de menos ou de mais, e diferenciar demais injeta ruído que não existia.
>
> É a leitura de graça que a seção promete: um gráfico responde quanto do passado ainda importa, antes de qualquer modelo ser ajustado.
> **volte para:** #o-diagnostico-da-memoria-acf-e-pacf
:::

## A validação não pode ser aleatória

Esta é a seção mais importante do capítulo. **Embaralhar e sortear treino/teste vaza o futuro para o passado.** Não é um vazamento sutil de atributo mal construído — é o modelo lendo a resposta. E ele não se manifesta como erro: manifesta-se como uma métrica excelente que produção jamais reproduz.

**Divisão cronológica.** O treino termina numa data; o teste começa depois dela. Sempre. Se houver ajuste de hiperparâmetros, use três blocos em ordem (treino, validação, teste), e o teste é o mais recente.

**Validação com origem móvel (*walk-forward*).** Um único corte informa pouco: talvez você tenha sorteado um trimestre fácil. Então repita o corte, avançando a origem:

```
treino [========]           teste [==]
treino [==========]              teste [==]
treino [============]                 teste [==]
```

Cada rodada treina com tudo até a origem e avalia no bloco seguinte. Você ganha várias medidas, e com elas a **incerteza** que o [capítulo II.1](ii-1-avaliacao.md) exige — e não só um ponto.

**Janela expansiva ou deslizante?** A expansiva (acima) acumula todo o histórico; a **deslizante** mantém o tamanho fixo e descarta o passado remoto. Expansiva quando o processo é estável e dado é escasso; deslizante quando o regime mudou — uma pandemia, uma troca de precificação, um concorrente novo. Dado antigo de um regime morto não é dado a mais, é viés.

Um detalhe que engana gente experiente: **atributos defasados têm de respeitar o corte**. Se você calcula uma média móvel de 30 dias sobre a série inteira **antes** de dividir, cada linha do treino já contém informação do teste. Calcule as features dentro de cada dobra, nunca antes.

### A linha de base ingênua

Antes de qualquer modelo, meça o que a **previsão ingênua** entrega: *amanhã é igual a hoje*. Se houver sazonalidade, a versão honesta é a ingênua sazonal: *este dezembro é igual ao dezembro passado*. Ela é surpreendentemente difícil de bater — em séries com muita inércia o último valor já carrega quase tudo o que se sabe. E o incômodo desta seção é este: **muito modelo publicado não bate essa linha**, porque ninguém a calculou. Compare-se sempre à ingênua **do tipo certo**: pôr um modelo sazonal contra a ingênua simples é escolher o adversário fraco.

:::exercicio {"id":"series-temporais-e2","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
Vendas mensais (em milhares):

| Mês | 2024 | 2025 |
|---|---|---|
| jan | 100 | 110 |
| fev | 120 | 126 |
| mar | 90 | 99 |

Calcule o **MAE** (erro absoluto médio) da previsão ingênua sazonal, em que cada mês de 2025 é previsto pelo mesmo mês de 2024, nos três meses de 2025. Responda com 2 casas decimais.

> **gabarito:** 8.33 ± 0.01
> **porque:** As previsões são os valores de 2024: 100, 120 e 90. Os erros absolutos são |110−100| = 10, |126−120| = 6 e |99−90| = 9. O MAE é (10 + 6 + 9)/3 = 25/3 = **8,33**.
>
> Agora o que o exercício realmente ensina: compare com a **ingênua simples** (prever o valor do mês anterior). Ela previria 110 para fevereiro (erro 16) e 126 para março (erro 27) — muito pior, porque a série tem sazonalidade forte e a ingênua simples a ignora. É por aqui que relatórios ficam desonestos sem má-fé: escolhe-se a ingênua simples como linha de base, o modelo a supera com folga, e todo mundo comemora — quando a régua correta era a sazonal, que talvez o modelo nem batesse. **A linha de base tem de ser a melhor coisa trivial disponível**, não a mais fácil de vencer.
> **volte para:** #a-linha-de-base-ingenua
:::

:::exercicio {"id":"series-temporais-e9","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Qual é a previsão ingênua correta para uma série com sazonalidade anual forte?

- [ ] Amanhã é igual a hoje.
- [x] Este dezembro é igual ao dezembro passado.
- [ ] Amanhã é igual à média de toda a série.
- [ ] Amanhã é igual à média dos últimos 30 dias.

> **gabarito:** este dezembro é igual ao dezembro passado
> **porque:** A ingênua sazonal usa o mesmo período do ciclo anterior, e é ela que serve de régua quando existe sazonalidade forte. A ingênua simples ignora o calendário e erra sistematicamente em todo mês atípico.
>
> A escolha da régua decide o veredito. Pôr um modelo sazonal contra a ingênua simples é escolher o adversário fraco, e é assim que relatórios ficam desonestos sem má-fé: o modelo vence com folga uma comparação que não era a correta.
>
> A regra que fica: a linha de base tem de ser a **melhor coisa trivial disponível**, e não a mais fácil de vencer.
> **volte para:** #a-linha-de-base-ingenua
:::

:::exercicio {"id":"series-temporais-e10","tipo":"numerica","objetivo":"O3","dificuldade":"dificil"}
Usando a mesma tabela do exercício anterior (jan 100/110, fev 120/126, mar 90/99), calcule o **MAE da previsão ingênua simples** nos meses de fevereiro e março de 2025, em que cada mês é previsto pelo mês imediatamente anterior. Responda com duas casas decimais.

> **gabarito:** 21.50 ± 0.01
> **porque:** Fevereiro de 2025 é previsto por janeiro de 2025: $|126 - 110| = 16$. Março é previsto por fevereiro: $|99 - 126| = 27$. O MAE é $(16 + 27)/2 = \mathbf{21{,}50}$.
>
> Compare com os 8,33 da ingênua sazonal sobre os mesmos dados: a régua errada é quase três vezes pior. Um modelo qualquer que chegasse a 15 de MAE pareceria excelente contra a ingênua simples e seria pior que não fazer nada, se a comparação fosse com a sazonal.
>
> É por isso que o capítulo insiste que a linha de base é uma escolha metodológica, não um detalhe de relatório. Ela decide se o número final significa competência ou apenas adversário mal escolhido.
> **volte para:** #a-linha-de-base-ingenua
:::

:::exercicio {"id":"series-temporais-e3","tipo":"aberta","objetivo":"O2","pontos":3,"dificuldade":"dificil"}
Uma colega apresenta este protocolo para prever a demanda diária de um e-commerce:

> "Peguei 3 anos de dados diários. Criei atributos defasados (venda de 1, 7 e 30 dias atrás) e a média móvel de 30 dias, tudo calculado sobre a base completa. Depois embaralhei as linhas e fiz `train_test_split` com 20% de teste, mais um k-fold de 5 dobras para ajustar os hiperparâmetros. Deu 3,1% de erro percentual. Também rodei uma validação cruzada aleatória repetida para confirmar, e o intervalo ficou estreito."

Identifique os problemas do protocolo e descreva o que você faria no lugar.

> **rubrica:** aponta que o embaralhamento quebra a ordem e permite treinar com dias posteriores ao dia previsto — vazamento do futuro para o passado;
> observa que o k-fold aleatório repete o mesmo defeito, e que rodá-lo várias vezes não corrige nada — só mede o mesmo erro com mais precisão;
> identifica o segundo vazamento, independente do primeiro: os atributos defasados e a média móvel foram calculados sobre a base inteira antes da divisão;
> propõe divisão cronológica e validação com origem móvel (walk-forward), com as features recalculadas dentro de cada dobra;
> exige comparação contra a previsão ingênua (simples ou sazonal) antes de aceitar os 3,1%
> **porque:** Há **dois** vazamentos, e quem enxerga só um entrega meia resposta. O primeiro é a ordem: embaralhar coloca no treino dias que vieram depois do dia previsto, e o modelo aprende a interpolar entre vizinhos temporais que, em produção, ainda não existirão. O segundo é mais silencioso e sobrevive mesmo a quem corrige o primeiro: a **média móvel calculada antes da divisão**. Cada linha do treino carrega uma estatística que já viu o período de teste. Você pode dividir cronologicamente de forma impecável e ainda assim vazar por aqui — é o mesmo mecanismo do [capítulo I.3](i-3-dados.md), onde a normalização feita antes do split contamina o teste.
>
> O detalhe que separa a boa resposta da excelente é o intervalo estreito. Ele soa como confirmação e é o contrário: **um erro sistemático medido muitas vezes continua sendo o mesmo erro, agora com um intervalo estreito em volta de um número errado**. Precisão não é validade; repetir um protocolo inválido só o torna mais convincente. E 3,1% não significa nada até se saber quanto a previsão ingênua entrega — talvez entregue 3,0%.
> **volte para:** #a-validacao-nao-pode-ser-aleatoria
:::

:::exercicio {"id":"series-temporais-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Por que a validação com origem móvel é preferível a um único corte cronológico?

- [ ] Porque ela usa mais dados de treino no total.
- [x] Porque um corte só pode ter calhado num período fácil, e várias origens dão várias medidas, e com elas a incerteza.
- [ ] Porque ela permite embaralhar dentro de cada bloco com segurança.
- [ ] Porque ela elimina a necessidade de comparar com a linha de base ingênua.

> **gabarito:** um corte só pode ter calhado num período fácil
> **porque:** Um corte cronológico já resolve o vazamento, e ainda entrega **um** número. Se o trimestre sorteado for atípico, esse número descreve o trimestre e não o modelo.
>
> Repetindo o corte com a origem avançando, você ganha várias medidas do mesmo modelo em períodos diferentes, e a dispersão entre elas é a incerteza que o [capítulo II.1](ii-1-avaliacao.md) exige antes de comparar duas métricas.
>
> A terceira alternativa reintroduz o problema que a seção acabou de fechar: embaralhar dentro de um bloco continua colocando dias posteriores no treino de dias anteriores. E a quarta troca duas coisas independentes — nenhum protocolo de validação dispensa a comparação com a ingênua.
> **volte para:** #a-validacao-nao-pode-ser-aleatoria
:::

:::exercicio {"id":"series-temporais-e8","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Uma empresa mudou de política de preços há oito meses e tem cinco anos de histórico. Janela expansiva ou deslizante?

- [ ] Expansiva, porque cinco anos de histórico são um ativo e descartá-los é desperdício.
- [x] Deslizante, porque o regime mudou e dado antigo de um regime morto não é dado a mais, é viés.
- [ ] Expansiva, porque a janela deslizante só se justifica com séries muito longas.
- [ ] Tanto faz: a escolha entre as duas afeta só o custo computacional.

> **gabarito:** deslizante
> **porque:** O critério não é o tamanho do histórico, é a **estabilidade do processo**. Expansiva quando o processo é estável e dado é escasso; deslizante quando houve quebra de regime, como uma troca de precificação, um concorrente novo ou uma pandemia.
>
> A primeira alternativa trata todo histórico como ativo, e é a intuição que a seção corrige com uma frase direta: dado antigo de um regime morto não é dado a mais, é viés. Ele empurra o modelo a aprender uma relação que deixou de existir.
>
> Vale notar o que a escolha não resolve. Oito meses sob o regime novo podem ser pouco para treinar bem, e aí a decisão honesta é declarar a limitação, não recuperar os quatro anos anteriores como se contassem.
> **volte para:** #a-validacao-nao-pode-ser-aleatoria
:::

## Quando o problema temporal vira tabular

Boa parte do trabalho prático não usa ARIMA. Usa-se **janelamento**: cada linha vira "os *k* valores anteriores + atributos de calendário", e o alvo é o valor seguinte. A partir daí, qualquer regressor do [capítulo II.5](ii-5-arvores-ensembles.md) serve.

A transformação é legítima e frequentemente vence os métodos clássicos — desde que **o protocolo de validação continue temporal**. É aí que mora o perigo: assim que o problema *parece* tabular, o reflexo de embaralhar volta. A tabela esconde a ordem; a ordem continua lá. E declare o **horizonte**: prever 1 passo à frente e prever 30 são problemas diferentes, com erros diferentes — um modelo excelente em 1 passo pode ser inútil em 30, e reportar só o primeiro número é omissão.

:::exercicio {"id":"series-temporais-e11","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
O que o janelamento faz com um problema temporal?

- [x] Cada linha vira "os $k$ valores anteriores mais atributos de calendário", e o alvo é o valor seguinte, o que permite usar qualquer regressor tabular.
- [ ] Agrega a série em janelas fixas, reduzindo o número de observações para acelerar o treino.
- [ ] Remove a sazonalidade, deixando só tendência e ruído.
- [ ] Converte a série em estacionária, dispensando a diferenciação.

> **gabarito:** cada linha vira os $k$ valores anteriores mais calendário
> **porque:** É uma mudança de **formato**, não de conteúdo: a informação temporal passa a estar nas colunas, e a partir daí qualquer regressor do [capítulo II.5](ii-5-arvores-ensembles.md) serve. A transformação é legítima e frequentemente vence os métodos clássicos.
>
> As três alternativas erradas atribuem ao janelamento efeitos que ele não tem. Ele não agrega, não remove sazonalidade e não torna a série estacionária — atributos de calendário até ajudam o modelo a **capturar** sazonalidade, o que é diferente de removê-la.
>
> O que a mudança de formato não altera é a natureza do problema, e é justamente aí que mora o perigo da próxima questão.
> **volte para:** #quando-o-problema-temporal-vira-tabular
:::

:::exercicio {"id":"series-temporais-e12","tipo":"multipla-multi","objetivo":"O4","dificuldade":"dificil"}
Uma equipe janelou a série e passou a tratá-la como tabela. Quais cuidados desta seção continuam obrigatórios? (marque todos que valem)

- [x] O protocolo de validação continua temporal: a tabela esconde a ordem, e a ordem continua lá.
- [x] O horizonte precisa ser declarado, porque prever 1 passo e prever 30 são problemas diferentes.
- [x] Os atributos defasados precisam ser calculados dentro de cada dobra, não sobre a base inteira.
- [ ] O janelamento dispensa a comparação com a previsão ingênua, porque agora o modelo é tabular.

> **gabarito:** validação temporal · horizonte declarado · atributos dentro da dobra
> **porque:** As três corretas são os cuidados que sobrevivem à mudança de formato, e a seção explica por que é fácil perdê-los: assim que o problema **parece** tabular, o reflexo de embaralhar volta.
>
> O horizonte é o que mais escapa em relatório. Um modelo excelente a 1 passo pode ser inútil a 30, e reportar só o primeiro número é omissão — não erro de cálculo, omissão.
>
> A alternativa errada troca a régua pelo formato. A ingênua continua sendo a coisa trivial a bater, e o janelamento não muda isso; se algo, torna a comparação mais necessária, porque um regressor tabular sobre defasagens pode simplesmente reaprender a copiar o último valor.
> **volte para:** #quando-o-problema-temporal-vira-tabular
:::

## Síntese — o que levar

- Tempo é **ordem**, e ordem é informação. Todo procedimento do livro que embaralha precisa ser reexaminado aqui.
- **Nunca embaralhe.** Divisão cronológica e validação com **origem móvel**; expansiva se o regime é estável, deslizante se mudou.
- Atributos defasados e estatísticas móveis calculam-se **dentro** de cada dobra. Vazamento por *feature* sobrevive a uma divisão cronológica correta.
- A **previsão ingênua**, do tipo certo, é o adversário obrigatório. Modelo que não a bate não tem valor.
- Um intervalo estreito em torno de um protocolo inválido é **precisão sem validade**, e é mais perigoso que um número ruim.
- Separe **sazonalidade** (período fixo, do calendário) de **ciclo** (período variável, emergente). Estacionariedade é pré-requisito dos métodos clássicos, e diferenciar é o caminho mais curto até ela — com a previsão voltando à escala original.
- A ideia de Yule que atravessa tudo: **o acaso pode estar dentro do mecanismo, não só no instrumento**.

:::exercicio {"id":"series-temporais-e4","tipo":"aberta","objetivo":"O4","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Um colega quer abandonar os modelos de série e resolver a previsão de demanda com um ensemble de árvores: monta janelas (vendas dos últimos 7, 14 e 28 dias), acrescenta dia da semana e feriado, e trata cada linha como uma observação independente. "Virou tabular, agora é só treinar."

Diga **em que condições essa transformação é legítima** e liste tudo que continua tendo de respeitar a ordem temporal mesmo depois de a tabela parecer comum.

> **rubrica:** nomeia ao menos uma condição sob a qual a transformação é legítima — o horizonte é curto e fixo, as janelas contêm a memória que importa, e há exemplos suficientes para o modelo aprender o padrão sazonal em vez de recebê-lo pronto;
> lista os cuidados que sobrevivem à transformação: a divisão treino/teste continua sendo por tempo, a validação continua com origem móvel, e nenhuma estatística usada como atributo pode olhar além da data da linha;
> mantém a comparação com a **linha de base ingênua correta** — a tabela nova não dispensa o piso, e um ensemble que não bate a previsão ingênua sazonal não ganhou nada;
> não conclui que "virou tabular, então as regras de série sumiram": a independência entre as linhas é aparência criada pela janela, não propriedade recuperada do problema
> **porque:** A transformação é legítima e comum — quase toda previsão de demanda em produção é feita assim. O erro não está em fazê-la, e sim em **acreditar nela**: o formato da tabela mudou, o fenômeno não. As linhas continuam vindo de um processo em que ontem causa hoje, e continuam se sobrepondo, porque a janela de terça inclui quase os mesmos dias que a de quarta.
>
> Daí o quarto critério ser o que separa a boa resposta. Quem diz "agora é tabular, posso embaralhar" produz uma métrica excelente e inútil — o modelo estará prevendo dias cujos vizinhos ele já viu, que é o mesmo vazamento do começo do capítulo com outra roupa. O `train_test_split` aleatório não sabe que a tabela era uma série; **você** sabe, e é a única defesa.
>
> A condição do primeiro critério merece atenção: janelas carregam memória **curta**. Se o que decide a série é um ciclo anual e você deu 28 dias ao modelo, nenhuma árvore vai inventar o que a representação omitiu — é o teto do [capítulo I.6](i-6-representacao.md) aparecendo de novo, agora no tempo.
> **volte para:** #quando-o-problema-temporal-vira-tabular
:::

## Verificação

1. Explique a um colega, sem usar a palavra "vazamento", por que k-fold embaralhado dá uma métrica boa e inútil numa série temporal.
2. Sua série tem sazonalidade semanal e uma quebra de nível há seis meses (mudança de preço). Você usaria janela expansiva ou deslizante, e qual previsão ingênua seria a linha de base honesta? Justifique as duas escolhas.

> Estas duas não são corrigidas, e a omissão é deliberada: a primeira se ganha convencendo o colega, e a segunda depende de decisões que só fazem sentido diante de uma série concreta.
