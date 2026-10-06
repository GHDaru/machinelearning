# Prova — Regressão e regularização no problema da Califórnia

Prova de 20 questões de **Análise Preditiva** sobre o California Housing (censo de 1990,
20 640 *block groups*, dataset congelado em
[`ml-zero/dados/california/`](../../ml-zero/dados/california/README.md)).

| Arquivo | O que é |
|---|---|
| [`prova_california.md`](prova_california.md) | As 20 questões com gabarito comentado — material do professor, não distribuir antes |
| [`prova_california_google_forms.gs`](prova_california_google_forms.gs) | Script que cria o Google Forms sozinho (quiz, pontos, feedback por questão). **Gerado do `.md`** — edite lá e regenere |

## Blocos

1. **O dado (1–4)** — os 207 buracos de `total_bedrooms` e a imputação sem vazamento; os
   965 bairros no teto censurado de US$ 500 001; `ISLAND` com 5 linhas; a unidade da renda.
2. **Regressão simples (5–8)** — renda sozinha: R² 0,471 e +79,6 mil US$/dp; R² = r²;
   o sinal de `total_rooms` que vira do avesso no múltiplo.
3. **Modelo múltiplo (9–12)** — *dummy trap* das 5 `oceano_*`; o par latitude×longitude;
   colinearidade quartos×cômodos; coeficiente ajustado não é causa.
4. **Análise de resultado (13–16)** — treino 0,647 × teste 0,638; RMSE 69,3 mil × MAE
   50,3 mil; o resíduo de +107,7 mil nos imóveis do teto (censura, não erro); "R² bom?"
   depende da régua.
5. **Ridge e Lasso (17–20)** — o LassoCV zera exatamente `oceano_<1H OCEAN` e empata
   (0,6377 × 0,6375); a renda é a última da ordem de eliminação; padronização obrigatória;
   α por validação cruzada e a pegadinha de régua entre métodos.

## Procedência dos números

Calculados em 2026-10-06 sobre `housing_bruto.csv` (sha256 na ficha do dado): dummies de
`ocean_proximity`, mediana de `total_bedrooms` aprendida no treino (437), `StandardScaler`
sem vazamento, divisão 75/25 com `random_state=42`, scikit-learn (`LinearRegression`,
`RidgeCV`, `LassoCV`, α em `logspace`). Nenhum número digitado à mão.

> Ainda **não** existe Colab nosso de regressão na Califórnia — o notebook do repositório
> para esse dado é o da rede neural (`ml-zero/etapa-19/rede_california.ipynb`, capítulo
> III.2). Se a turma for revisar com material nosso antes da prova, vale gerar a "aula 3"
> nos moldes da sequência da limonada.
