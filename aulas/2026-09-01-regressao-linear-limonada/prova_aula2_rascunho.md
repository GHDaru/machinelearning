# [RASCUNHO] Prova da aula 2 — Regressão linear com o caso da limonada

> **Status: rascunho a revisar antes da aula 2.** Esta prova foi escrita quando o material
> era uma aula única; as questões 1–5 cobrem a parte descritiva/diagnóstica, que **já caiu
> na prova da aula 1**. Antes de aplicar, substituí-las por questões da regressão item a
> item (a = S_xy/S_xx, R² = r² na simples, o U nos resíduos da chuva, o preço de +47 para
> ~+1 no múltiplo, a régua do melhor item). As questões 6–10 seguem válidas.
>
> Script correspondente: [`prova_aula2_rascunho_google_forms.gs`](prova_aula2_rascunho_google_forms.gs).
> **Não distribua este arquivo aos alunos antes da prova.**

---

**1.** Na análise descritiva, uma das variáveis apresentou assimetria à direita forte (≈ 1,9) e curtose alta (≈ 5), indicando cauda pesada. Qual?

- a) temperatura
- b) precipitacao
- c) vendas
- d) panfletos

**2.** A regra do IQR (quartil ± 1,5×IQR) marcou os 62 dias de preço 0,50 como "outliers". A interpretação correta desse resultado é:

- a) os 62 dias devem ser removidos antes de modelar
- b) o multiplicador 1,5 é baixo demais; com 3,0 o problema desaparece
- c) `preco` só assume dois valores: o IQR colapsa em zero e a regra, que pressupõe variável contínua, deixa de significar "outlier"
- d) há erro de digitação nos valores 0,50

**3.** Os ~28 pontos de precipitação acima da cerca superior correspondem a dias de chuva forte que realmente aconteceram. O tratamento adequado é:

- a) manter os pontos, e considerar uma transformação (por exemplo, log) se a análise dos resíduos indicar
- b) excluir os pontos, porque outlier sempre prejudica a regressão
- c) substituir os valores pela média da variável
- d) substituir os valores pela mediana da variável

**4.** Curtose (excesso) de aproximadamente +5 em `precipitacao` significa que a distribuição:

- a) é mais achatada que a normal
- b) é simétrica
- c) tem variância próxima de zero
- d) tem caudas mais pesadas que as da normal — valores extremos mais frequentes

**5.** A correlação entre `preco` e `vendas` é +0,51. Por que a conclusão "suba o preço para vender mais" é errada?

- a) 0,51 é uma correlação fraca demais para qualquer conclusão
- b) o preço 0,50 só existe em julho e agosto: a correlação mede a estação (confundimento), não o efeito do preço
- c) o correto seria usar a correlação de Spearman
- d) faltou padronizar as variáveis antes de calcular a correlação

**6.** Por que o `StandardScaler` é ajustado (`fit`) apenas no conjunto de treino?

- a) porque o scikit-learn exige essa ordem
- b) para o código rodar mais rápido
- c) para evitar vazamento: usar média e desvio do teste contaminaria a avaliação, que deve simular dados futuros
- d) porque o teste tem escala diferente do treino

**7.** O modelo linear obteve R² ≈ 0,98 no treino **e** no teste. A leitura correta é:

- a) o modelo explica ~98% da variância das vendas e generaliza bem — o que não autoriza ler os coeficientes como efeitos causais
- b) o modelo decorou os dados (sobreajuste)
- c) R² alto prova que subir o preço aumenta as vendas
- d) um R² tão alto é impossível; o experimento está errado

**8.** Se o gráfico de resíduo × previsto mostrasse um "funil" (resíduos abrindo conforme o previsto cresce), isso indicaria:

- a) colinearidade entre as preditoras
- b) que o modelo está perfeito
- c) que o teste vazou para o treino
- d) variância não constante (heterocedasticidade) — considerar transformar o alvo ou usar pesos

**9.** A diferença central entre as regressões Ridge e Lasso é:

- a) Ridge (L2) encolhe os coeficientes sem zerá-los; Lasso (L1) encolhe e pode zerar, funcionando como seleção de atributos
- b) Lasso serve apenas para classificação
- c) Ridge zera coeficientes; Lasso apenas encolhe
- d) com o mesmo α, as duas produzem exatamente o mesmo modelo

**10.** Com os 14 atributos expandidos, o Lasso empatou no R² de teste com o modelo completo mantendo apenas 8 coeficientes. A decisão de engenharia correta é:

- a) escolher o modelo de 14 atributos, pois usa "toda a informação disponível"
- b) escolher o Lasso: desempenho igual com menos parâmetros é um modelo mais simples de manter e de explicar
- c) escolher sempre o modelo de maior R² no treino
- d) rejeitar os três e partir para uma rede neural

---

## Gabarito comentado

| # | Resposta | Por quê |
|---|---|---|
| 1 | **b** | A chuva concentra muitos dias de valor baixo e poucos dias de chuva forte: assimetria 1,86 e curtose ~5,2, medidas na aula. Temperatura e vendas são quase simétricas; panfletos tem assimetria leve (~0,3). |
| 2 | **c** | Q1 = Q3 = 0,30 → IQR = 0 e a cerca colapsa num ponto. A regra pressupõe variável contínua; `preco` é binária na prática. Remover os "outliers" apagaria julho e agosto do dataset. |
| 3 | **a** | Outlier real carrega informação — chuva forte é justamente o que derruba venda. Excluir ou substituir por média/mediana apaga o fenômeno e enviesa o modelo. A resposta ao formato da distribuição é transformação, decidida por medida. |
| 4 | **d** | Curtose de excesso positiva = leptocúrtica: caudas mais pesadas que as da normal. Achatamento (a) seria curtose negativa; curtose não mede simetria (b) nem variância (c). |
| 5 | **b** | O preço nunca variou dentro de um mês: preço e estação são a mesma variável com dois nomes. A correlação de +0,51 mede o verão — "termômetro disfarçado". Nenhum recorte destes dados separa os dois efeitos. |
| 6 | **c** | O teste simula o futuro, e o futuro não fornece parâmetros. Média e desvio aprendidos no dado completo levariam informação do teste para dentro do pipeline — vazamento. |
| 7 | **a** | Treino ≈ teste afasta o sobreajuste, e R² mede variância explicada — nada além. O coeficiente positivo do preço no mesmo modelo é o contraexemplo: previsão excelente, leitura causal errada. |
| 8 | **d** | Funil = a dispersão do erro cresce com o nível da previsão (heterocedasticidade). Os remédios clássicos: transformar o alvo (log) ou mínimos quadrados ponderados. Colinearidade (a) não aparece nesse gráfico. |
| 9 | **a** | A penalidade L2 (soma dos quadrados) encolhe suavemente e nunca zera; a L1 (soma dos absolutos) tem "quina" em zero e zera coeficientes — seleção de atributos embutida. |
| 10 | **b** | Empate de desempenho + menos parâmetros = fique com o mais simples: mais barato de manter, de explicar e de auditar. R² de treino (c) não decide nada; "toda a informação" (a) inclui os 6 termos que o próprio ajuste mostrou serem dispensáveis. |
