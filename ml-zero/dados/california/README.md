# California Housing — 20 640 setores censitários

> Conjunto de dados para a parte de **redes neurais** da disciplina.
> Capturado em **2026-08-20**, do `scikit-learn` 1.9.0.

Preço mediano de imóvel por setor censitário da Califórnia, do censo de 1990. Nove colunas,
20 640 linhas, **nenhum valor faltante** e **nenhum dado pessoal** — cada linha é um setor,
não uma pessoa.

| Arquivo | O quê |
|---|---|
| [`california.csv`](california.csv) | o **derivado**, 9 colunas, que as etapas leem. UTF-8, ponto decimal |
| [`housing_bruto.csv`](housing_bruto.csv) | o **cru**, 10 colunas, como o Kaggle entrega |
| [`obter.py`](obter.py) | o script que regenera o derivado a partir do `scikit-learn` |
| [`split.csv`](split.csv) | quais linhas são treino, validação e teste — **gravado**, não sorteado |

```
sha256  de7c6baf96d63c5947036f2f5c050313cabcda16880f9eacfdefb99f1bfd6403   california.csv
sha256  8a3727f4cf54ac1a327f69b1d5b4db54c5834ea81c6e4efc0d163300022a685e   housing_bruto.csv
```

São esses números que provam que a turma inteira treinou sobre o mesmo arquivo.

## As duas versões, e por que as duas estão aqui

**O derivado** (`california.csv`) vem do `scikit-learn` 1.9.0: 9 colunas de números, sem
buraco e sem categoria. É o que as etapas treinam.

**O cru** (`housing_bruto.csv`) é o arquivo de onde aquele preparo saiu, e ele tem o que o
derivado apagou: a coluna de texto `ocean_proximity` e **207 linhas sem `total_bedrooms`**.

| Procedência | O que foi conferido |
|---|---|
| Baixado de [`ageron/handson-ml2`](https://raw.githubusercontent.com/ageron/handson-ml2/master/datasets/housing/housing.csv) em **2026-08-21** | 20 640 × 10, `sha256` acima |
| Comparado com `kagglehub.dataset_download("camnugent/california-housing-prices")` na mesma data | **byte a byte igual** — mesmo `sha256`. Não é suposição: `dados_kaggle.comparar_com_o_congelado()` faz a conta |
| O download do Kaggle **não pediu credencial** | conjunto público; o `kagglehub` cai em acesso anônimo |

Então por que congelar, se dá para baixar? Porque conjunto no Kaggle ganha revisão, sai do ar
e muda de versão sem avisar. No dia em que isso acontecer, duas turmas de semestres
diferentes deixam de ser comparáveis — que é exatamente o que o `split.csv` gravado existe
para impedir. A cópia local é o que faz a etapa rodar na aula em que a rede da escola cai.

## A quarta armadilha: as duas cópias discordam, e nenhuma avisa

As **207** linhas em branco no arquivo do Kaggle **têm valor** no do `scikit-learn`. E o valor
é inteiro: 217, 279, 1 394, com **186 valores distintos** entre os 207.

Isso descarta preenchimento. Imputar pela média ou pela mediana daria número quebrado, e o
**mesmo** número repetido 207 vezes. O que há ali é dado que uma das duas cópias perdeu pelo
caminho.

Duas versões do mesmo conjunto, as duas chamadas "California Housing", discordam sobre 207
linhas. Sem esta ficha, *"usei o California Housing"* não identifica o que se usou.

## As colunas

| Coluna | O quê | Faixa |
|---|---|---|
| `MedInc` | renda mediana do setor, em dezenas de milhares de dólares | 0,50 a 15,00 |
| `HouseAge` | idade mediana das casas, em anos | 1 a 52 |
| `AveRooms` | média de cômodos por domicílio | 0,85 a 141,9 |
| `AveBedrms` | média de quartos por domicílio | 0,33 a 34,1 |
| `Population` | população do setor | 3 a 35 682 |
| `AveOccup` | média de moradores por domicílio | 0,69 a 1 243,3 |
| `Latitude` | latitude do centro do setor | 32,54 a 41,95 |
| `Longitude` | longitude | −124,35 a −114,31 |
| **`MedHouseVal`** | **o alvo**: valor mediano do imóvel, em **centenas de milhares de dólares** | 0,15 a 5,00 |

## As três armadilhas, declaradas

**1. As escalas são absurdamente diferentes, e o erro é silencioso.** `Population` chega a
35 682 enquanto `MedInc` para em 15. Uma rede neural treinada sobre isso sem padronizar
converge mal, e **não avisa**: nenhuma exceção, nenhum aviso, só um resultado sofrível que
parece um problema do modelo. É a mesma família do erro de *broadcasting* que o capítulo
III.2 discute — ausência de exceção não é evidência de correção.

**2. O alvo é censurado em 5,00001.** Todo setor cujo valor mediano passava de meio milhão
de dólares foi registrado como 5,00001. São 965 linhas, quase 5% do conjunto. No gráfico de
resíduos isso aparece como uma faixa horizontal, e nenhum modelo consegue acertá-la — o
teto não está nos dados, está na régua que os coletou.

**3. `AveRooms` chega a 141,9 cômodos por domicílio.** Não é erro de digitação: são setores
quase desabitados, onde a média divide por um denominador minúsculo. `AveOccup` tem o mesmo
efeito, chegando a 1 243 moradores por domicílio.

## Sobre o Boston Housing, que este conjunto substitui

O conjunto clássico de preço de imóvel no ensino era o **Boston Housing**, e ele foi
**removido do scikit-learn na versão 1.2**, por razão ética que vale a aula: uma das
colunas, `B`, foi construída como uma função da proporção de moradores negros da cidade —
isto é, os autores engenheiraram um atributo **partindo da premissa de que a segregação
racial afeta o preço do imóvel**. A documentação do próprio scikit-learn recomenda não usá-lo
e aponta a análise de M. Carlisle, *"Racist data destruction?"* (2019).

O princípio V deste livro diz que conjunto com viés documentado só entra **como objeto de
estudo do viés**. É exatamente esse o estatuto do Boston aqui: ele é citado, não usado.
