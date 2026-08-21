# California Housing — 20 640 setores censitários

> Conjunto de dados para a parte de **redes neurais** da disciplina.
> Capturado em **2026-08-20**, do `scikit-learn` 1.9.0.

Preço mediano de imóvel por setor censitário da Califórnia, do censo de 1990. Nove colunas,
20 640 linhas, **nenhum valor faltante** e **nenhum dado pessoal** — cada linha é um setor,
não uma pessoa.

| Arquivo | O quê |
|---|---|
| [`california.csv`](california.csv) | o congelado, que a etapa lê. UTF-8, ponto decimal |
| [`obter.py`](obter.py) | o script que o regenera a partir do `scikit-learn` |
| [`split.csv`](split.csv) | quais linhas são treino, validação e teste — **gravado**, não sorteado |

```
sha256  de7c6baf96d63c5947036f2f5c050313cabcda16880f9eacfdefb99f1bfd6403
```

É esse número que prova que a turma inteira treinou sobre o mesmo arquivo.

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
