# California Housing — 20 640 *block groups*

> Conjunto de dados para a parte de **redes neurais** da disciplina.
> Capturado em **2026-08-20**, do `scikit-learn` 1.9.0.

Preço mediano de imóvel por *block group* da Califórnia, do censo de 1990. Nove colunas,
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

## As colunas do arquivo cru

Cada linha é um ***block group*** do censo de 1990, e não uma casa nem uma pessoa. São 20 640
deles, com mediana de **409 domicílios** e **1 166 moradores** cada.

**Não traduza por "setor censitário" sem avisar.** O *block group* fica um degrau **abaixo** do
*census tract*, e quem procura "setor censitário" costuma cair no *census tract*, que é cerca
de três vezes maior. O encaixe do censo americano é:

```
Estado  ⊃  Condado  ⊃  Census tract  ⊃  Block group  ⊃  Block
                       2 500 a 8 000    ideal de 400    o quarteirão
                       moradores        domicílios      (sem renda publicada)
                                        ↑ cada linha do arquivo
```

O *block group* é **a menor unidade para a qual o censo publica dado amostral** — abaixo dele,
o quarteirão, e para o quarteirão não se publica renda. A mediana medida no arquivo, 409
domicílios, cai em cima do ideal de 400 e bem abaixo dos 1 000 a 3 000 de um *census tract*:
os números do arquivo confirmam a definição.

| Coluna | O quê | Faixa |
|---|---|---|
| `longitude`, `latitude` | centro do setor | −124,35 a −114,31 · 32,54 a 41,95 |
| `housing_median_age` | idade mediana das construções, em anos | 1 a 52 |
| `total_rooms` | **total** de cômodos do setor | 2 a 39 320 |
| `total_bedrooms` | **total** de quartos do setor. **207 linhas em branco** | 1 a 6 445 |
| `population` | moradores do setor | 3 a 35 682 |
| `households` | **domicílios ocupados** do setor | 1 a 6 082 |
| `median_income` | renda mediana, em dezenas de milhares de dólares | 0,50 a 15,00 |
| `median_house_value` | **o alvo**, em dólares. Censurado em 500 001 | 14 999 a 500 001 |
| `ocean_proximity` | categórica: `<1H OCEAN`, `INLAND`, `NEAR OCEAN`, `NEAR BAY`, `ISLAND` | 5 valores |

### A geografia: `longitude` e `latitude`

Coordenadas do centro do setor. **Longitude negativa é oeste**, então o menor número
(−124,35) é o ponto mais a noroeste e o maior (−114,31) o mais a leste, na divisa com o
Arizona. A latitude vai de 32,54, na fronteira com o México, a 41,95, na divisa com o Oregon.

**São a única dupla cujo sentido é conjunto, e não individual.** Latitude sozinha diz pouco;
latitude *com* longitude diz "isto é Los Angeles" ou "isto é a baía de São Francisco". A
distribuição mostra os dois aglomerados: 6 310 setores entre 32° e 34° (a região de Los
Angeles) e 6 562 entre 37° e 39° (a baía).

Guarde isso, porque a seção *Onde está o resultado* mede a consequência: **uma tabela de
correlação manda jogar as duas fora, e jogá-las fora piora o modelo em 19%.**

### `housing_median_age` — e o teto que quase ninguém nota

Idade mediana das construções do setor, em anos, de 1 a 52.

**52 não é a idade da casa mais velha da Califórnia: é o teto da régua.** São **1 273
setores** exatamente em 52 — **6,17%** do arquivo —, contra 48 setores em 51 e 136 em 50. O
degrau denuncia o *top-coding*: tudo que era mais velho que 52 foi registrado como 52.

A ficha anterior declarava a censura do alvo e não esta. São **três** as colunas censuradas
neste arquivo, e a lista completa está mais abaixo.

### Os três totais: `total_rooms`, `total_bedrooms`, `population`

Todos são **contagens do setor inteiro**, e não médias por casa. É a confusão mais cara do
conjunto.

| Coluna | Mediana | O que ela **não** é |
|---|---|---|
| `total_rooms` | 2 127 | não é o tamanho das casas, é o tamanho do setor |
| `total_bedrooms` | 435 | idem, e **207 linhas estão em branco** |
| `population` | 1 166 | moradores do setor |

Um setor com 5 000 domicílios tem mais cômodos que um com 200 sem que ninguém more melhor.
Por isso os três só viram atributo **depois de divididos por `households`** — é o que a
próxima seção explica.

Uma relação estável para calibrar a intuição: a mediana de `total_bedrooms / total_rooms` é
**0,203**. Cerca de um em cada cinco cômodos é quarto, e isso vale para o arquivo quase
inteiro.

### `households` merece um parágrafo, porque ele é o denominador

No vocabulário do censo americano, **um *household* é o conjunto de pessoas que ocupam uma
unidade habitacional** — ou seja, um domicílio **ocupado**. Casa vazia não conta como
*household*. A coluna é a **contagem de domicílios do *block group***: número inteiro, nunca zero,
de 1 a 6 082.

Somando o arquivo inteiro: **10 310 499 domicílios** para **29 421 840 moradores**, o que dá
**2,85 moradores por domicílio** — número plausível para a Califórnia de 1990, e um bom teste
de sanidade quando se desconfia de uma coluna.

**Três dos oito atributos derivados dividem por ele:**

```
AveRooms  = total_rooms    / households
AveBedrms = total_bedrooms / households
AveOccup  = population     / households
```

É por isso que os valores absurdos da ficha do derivado, `AveRooms` em 141,9 e `AveOccup` em
1 243, não são erro de digitação: são **denominador minúsculo**. Dos 69 setores com mais de
20 cômodos por domicílio, a mediana de `households` é **95**, contra **410** no resto do
arquivo. Divisão por número pequeno amplifica tudo, inclusive o ruído.

> **A explicação é vacância, e ela está documentada.** O *block group* com 141,9 cômodos por
> domicílio tem 1 561 cômodos, 11 domicílios e 30 moradores. A documentação do `scikit-learn`
> diz exatamente isso, e vale citar: *"these columns may take surprisingly large values for
> block groups with few households and many empty houses, such as vacation resorts"* — poucos
> domicílios ocupados e muitas casas vazias, como em lugares de veraneio.
>
> `total_rooms` conta os cômodos de **todas** as unidades; `households` conta só as
> **ocupadas**. A razão entre os dois explode onde a vacância é alta.

### `median_income` — a coluna que carrega o resultado, e ela tem teto **e** piso

Renda mediana do domicílio no setor, **em dezenas de milhares de dólares de 1990**. A mediana
do arquivo é 3,5348, ou seja **US$ 35 348** por ano.

Ela é censurada nas duas pontas, e as duas usam o mesmo truque de sentinela:

- **teto em 15,0001** (US$ 150 001), com 49 setores exatamente ali;
- **piso em 0,4999** (US$ 4 999), com 12 setores.

O `+0,0001` e o `−0,0001` existem para que o valor censurado seja **distinguível** do valor
redondo. É a convenção do censo, e é um bom detalhe para quem vai desenhar coleta de dados.

**É de longe a coluna mais informativa**: correlação de **+0,688** com o alvo, contra +0,152
da segunda colocada. Sozinha ela leva o erro de 0,8982 (a mediana) para 0,6217.

### `median_house_value` — o alvo, e o teto de meio milhão

Valor mediano do imóvel no setor, **em dólares** (o arquivo derivado divide por 100 000).
Mediana de **US$ 179 700**.

- **teto em 500 001**, com **965 setores** — **4,68%** do arquivo;
- **piso em 14 999**, com 4 setores.

Os 965 setores no teto são a faixa horizontal que aparece em qualquer gráfico de resíduos, e
**nenhum modelo consegue acertá-la**: o teto não está nos dados, está na régua que os coletou.

### `ocean_proximity` — a única categórica, e a categoria que some do teste

Cinco valores, e a distribuição é muito desigual:

| Categoria | Setores | Valor mediano do imóvel |
|---|---|---|
| `<1H OCEAN` | 9 136 | US$ 214 850 |
| `INLAND` | 6 551 | **US$ 108 500** |
| `NEAR OCEAN` | 2 658 | US$ 229 450 |
| `NEAR BAY` | 2 290 | US$ 233 800 |
| `ISLAND` | **5** | US$ 414 700 |

`INLAND` vale metade do resto, e a coluna claramente carrega informação. Mas repare no
`ISLAND`: **cinco linhas em 20 640**, todas agrupadas em torno de 33,3° N e −118,3° O, no mar
ao largo de Los Angeles.

> **A armadilha, medida no recorte que este repositório usa:** dos 5 setores `ISLAND`, **4
> caem no treino, 1 na validação e ZERO no teste**.
>
> Quem transformar a coluna em *one-hot* ganha um atributo `ISLAND` que vale 1 em quatro
> linhas de treino e **em nenhuma linha de teste**. O modelo aprende um peso para ele que
> jamais será avaliado. Não é bug do recorte: com 5 exemplos, **nenhum** sorteio razoável
> garante presença nas três partes.
>
> É por isso que o arquivo derivado não tem esta coluna. E é o argumento concreto contra
> *one-hot* automático em categoria rara — o problema não aparece como erro, aparece como um
> parâmetro que ninguém nunca testou.

### Três linhas impossíveis

Em **três** setores há **mais domicílios do que moradores** — 4 domicílios para 3 pessoas,
39 para 27, 204 para 198. Pela definição, isso não pode acontecer: domicílio ocupado tem ao
menos um ocupante.

Não é muito, e não muda resultado nenhum: são 3 linhas em 20 640. O que elas mostram é outra
coisa, e é a mesma lição das 207 linhas da seção seguinte — **o conjunto "clássico", usado em
milhares de aulas, tem linhas que contradizem a própria definição das colunas, e ninguém
esbarra nelas porque ninguém olha.**

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

## Onde está o resultado, medido por ablação

Correlação de Pearson de cada atributo com o alvo, no arquivo derivado:

| Atributo | *r* |
|---|---|
| `MedInc` | **+0,688** |
| `AveRooms` | +0,152 |
| `Latitude` | −0,144 |
| `HouseAge` | +0,106 |
| `AveBedrms` | −0,047 |
| `Longitude` | −0,046 |
| `Population` | −0,025 |
| `AveOccup` | −0,024 |

Lida sozinha, essa tabela diz "use `MedInc` e jogue o resto fora". Ela está errada, e dá para
mostrar isso treinando. MAE no teste, com o mesmo recorte gravado (prever sempre a mediana dá
0,8982):

| Atributos usados | Regressão linear | MLP 64, `tanh` |
|---|---|---|
| só `Latitude` + `Longitude` | 0,7873 | **0,7165** |
| só `MedInc` | 0,6217 | 0,6183 |
| as oito | 0,5271 | **0,3888** |
| as oito **sem** a geografia | 0,5710 | 0,4620 |

Três leituras, e nenhuma delas cabe na tabela de correlação:

**1. As duas colunas "sem correlação" batem a mediana com folga.** Latitude e longitude
sozinhas levam o erro de 0,8982 a 0,7165. Correlação linear mede uma coluna por vez; a
informação aqui está no **par**, e nenhum valor de latitude significa alguma coisa sem a
longitude ao lado.

**2. Tirar a geografia custa 19% do resultado da rede** — de 0,3888 para 0,4620. As duas
colunas que a tabela mandaria descartar respondem por mais melhoria do que qualquer outra
dupla do conjunto.

**3. Com uma variável só, a rede não tem o que fazer.** Em `MedInc` sozinho, linear e MLP
empatam (0,6217 contra 0,6183). Com as oito, a rede abre 26% de vantagem. **A vantagem de uma
rede está nas interações entre atributos**, e não em curvar uma variável isolada — é por isso
que ela não aparece em problema de uma dimensão.

## Sobre o Boston Housing, que este conjunto substitui

O conjunto clássico de preço de imóvel no ensino era o **Boston Housing**, e ele foi
**removido do scikit-learn na versão 1.2**, por razão ética que vale a aula: uma das
colunas, `B`, foi construída como uma função da proporção de moradores negros da cidade —
isto é, os autores engenheiraram um atributo **partindo da premissa de que a segregação
racial afeta o preço do imóvel**. A documentação do próprio scikit-learn recomenda não usá-lo
e aponta a análise de M. Carlisle, *"Racist data destruction?"* (2019).

O princípio V deste livro diz que conjunto com viés documentado só entra **como objeto de
estudo do viés**. É exatamente esse o estatuto do Boston aqui: ele é citado, não usado.

## Fontes

Selos: **✓** aberta e lida · **✓ᵐ** só metadados · **❌** procurada e não encontrada.

| Selo | Fonte |
|---|---|
| ✓ | **scikit-learn**, *California Housing dataset*, [datasets/real_world.html](https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset) — conferida em 2026-08-28. É de lá que vêm, literalmente: *"using one row per census **block group**"*; *"a block group is the smallest geographical unit for which the U.S. Census Bureau publishes sample data"*; e a explicação da vacância citada acima |
| ✓ | **U.S. Census Bureau**, *Geographic Areas Reference Manual*, cap. 11 — [Ch11GARM.pdf](https://www2.census.gov/geo/pdfs/reference/GARM/Ch11GARM.pdf). O tamanho do *block group*: *"an ideal size for a BG of 400 housing units, with a minimum of 250, and a maximum of 550"*, e *"the average number of BGs per census tract was 3"* |
| ✓ | **U.S. Census Bureau**, *GARM*, cap. 10 — [Ch10GARM.pdf](https://www2.census.gov/geo/pdfs/reference/GARM/Ch10GARM.pdf). O *census tract*: *"between 2,500 and 8,000 residents"*, com *"1,000 to 3,000 housing units"* |
| ✓ᵐ | **Pace, R. Kelley & Ronald Barry**, *Sparse Spatial Autoregressions*, *Statistics and Probability Letters* 33:291–297, 1997 — [10.1016/S0167-7152(96)00140-X](https://doi.org/10.1016/S0167-7152(96)00140-X). O artigo de origem do conjunto. **Não foi lido**: o DOI resolve, o texto não foi aberto |
| ❌ | **StatLib**, `lib.stat.cmu.edu/datasets/houses.zip` — a origem que o `scikit-learn` declara. Devolveu **403** na tentativa de 2026-08-28, então a cadeia de procedência foi fechada por outro caminho: o arquivo cru veio de [`ageron/handson-ml2`](https://raw.githubusercontent.com/ageron/handson-ml2/master/datasets/housing/housing.csv) e bate **byte a byte** com o que o `kagglehub` baixa do Kaggle |
| ❌ | **IBGE**, definição de setor censitário, para dimensionar a analogia com o *block group*. O site devolveu **403** nesta sessão. Por isso a ficha **não** afirma equivalência de tamanho entre os dois: diz apenas que a tradução leva o leitor ao *census tract*, que é o erro concreto |

Tudo o que esta ficha afirma sobre o **conteúdo do arquivo** (medianas, faixas, contagens, as
207 linhas, as 3 linhas impossíveis, a distribuição do `ISLAND`) é **medido na geração**, não
copiado de fonte alguma — e os principais números estão presos em
[`tests/test_etapa_19.py`](../../tests/test_etapa_19.py).
