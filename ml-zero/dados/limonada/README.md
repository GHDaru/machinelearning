# Limonada — 365 dias de venda

> Conjunto de dados para a parte de **regressão linear** da disciplina de Análise Preditiva.
> Capturado em **2026-08-11**.

Um ano inteiro (2017) de operação de uma barraca de limonada: o tempo que fez, quantos panfletos foram distribuídos, o preço praticado e quantos copos foram vendidos. Sete colunas, 365 linhas, **nenhum valor faltante** e **nenhum dado pessoal**.

| Arquivo | O quê |
|---|---|
| [`limonada.xlsx`](limonada.xlsx) | o original, como o professor entrega em aula — não editar |
| [`limonada.csv`](limonada.csv) | o mesmo conteúdo para código: UTF-8, data em ISO, ponto decimal, cabeçalho sem acento |

```python
import pandas as pd
df = pd.read_csv("ml-zero/dados/limonada/limonada.csv", parse_dates=["data"])
```

## As colunas

| CSV | Planilha | Tipo | Faixa | Observação |
|---|---|---|---|---|
| `data` | Data | data | 2017-01-01 a 2017-12-31 | um registro por dia, sem falha |
| `dia_semana` | Dia da Semana | texto | `Monday`…`Sunday` | em inglês, como no original |
| `temperatura` | Temperatura | número | 15,1 – 102,9 | **unidade não declarada** — ver abaixo |
| `precipitacao` | Precipitação | número | 0,47 – 2,50 | unidade não declarada |
| `panfletos` | Panfletos | inteiro | 9 – 80 | quantos foram distribuídos no dia |
| `preco` | Preço | número | **só 0,30 e 0,50** | ver a armadilha 1 |
| `vendas` | Vendas | inteiro | 7 – 43 | **a variável resposta** |

**A unidade da temperatura não está no arquivo.** A faixa 15,1–102,9 é típica de **Fahrenheit** (≈ −9 °C a 39 °C, um ano inteiro num clima temperado); em Celsius, 102,9 seria impossível. É a leitura mais provável, **não uma certeza** — o dado não declara, e este README não vai inventar. Serve como primeira pergunta da aula: *o que você faria antes de reportar um coeficiente cuja unidade você não conhece?*

## Por que este conjunto ensina bem

O ajuste ingênuo é quase perfeito — `R² = 0,982` com as quatro variáveis, e `temperatura` sozinha correlaciona **+0,990** com as vendas. Isso denuncia dado sintético (nenhuma barraca real é tão previsível), e é justamente o que o torna útil: **as armadilhas aparecem limpas, sem ruído para escondê-las.**

### Armadilha 1 — o preço que "aumenta" as vendas

| | correlação com `vendas` |
|---|---|
| `temperatura` | **+0,990** |
| `precipitacao` | −0,909 |
| `panfletos` | +0,805 |
| `preco` | **+0,513** |

Lido de forma ingênua: subir o preço vende mais. Cobre 5 e enriqueça.

O que o dado diz de verdade:

| preço | dias | temperatura média | vendas médias | meses em que aparece |
|---|---|---|---|---|
| 0,30 | 303 | 57,0 | 23,7 | jan–jun, set–dez |
| 0,50 | 62 | 78,8 | 33,1 | **só julho e agosto** |

O preço subiu **no verão**. Ele não é uma variável de decisão: é um **indicador disfarçado de estação**. A correlação positiva mede o calor, não a elasticidade.

Pior — a armadilha sobrevive à regressão múltipla, que é onde o aluno costuma achar que está seguro:

```
vendas = 3,192 + 0,3692·temperatura − 2,246·precipitacao
              + 0,0188·panfletos + 2,414·preco        R² = 0,982
```

O coeficiente do preço continua **positivo (+2,41)**, porque `preco` ainda carrega o que a temperatura não explicou de julho e agosto. Controlar por uma variável **não** resolve confundimento quando o confundidor não foi medido direito. Este é o ponto que o dado ensina melhor do que qualquer definição de livro.

### Armadilha 2 — colinearidade

`temperatura` × `panfletos` correlacionam **+0,798**: em dia quente, distribuíam-se mais panfletos. Os dois coeficientes ficam instáveis, e o do panfleto (+0,0188 por panfleto — ou seja, **53 panfletos para vender um copo a mais**) não pode ser lido como efeito causal da panfletagem.

### Armadilha 3 — o `R²` alto que não é mérito do modelo

`R² = 0,982` é excelente e não prova nada sobre generalização: não há divisão treino/teste aqui, e o dado é sintético. Serve para introduzir o que os capítulos [01](../../../livro/01-fundamentos.md) e [04](../../../livro/capitulos/04-avaliacao.md) cobram — divisão honesta e métrica fora da amostra.

## Perguntas de aula, na ordem

1. Ajuste `vendas ~ temperatura`. Interprete o coeficiente **com a unidade que você não tem certeza qual é**.
2. Acrescente `preco`. O sinal faz sentido de negócio? Investigue antes de responder.
3. Recorte julho e agosto e refaça. O que acontece com o coeficiente do preço?
4. Crie `verao = mes in (7,8)` e rode `vendas ~ temperatura + preco + verao`. Compare.
5. Divida em treino/teste **por tempo** (não aleatoriamente — é série diária). O `R²` continua 0,98?

## Procedência

Fornecido pelo autor em 2026-08-11 como material das aulas de Análise Preditiva. O arquivo não traz fonte, licença nem dicionário de dados, e a estrutura (barraca de limonada, temperatura em Fahrenheit, panfletos) coincide com conjuntos didáticos que circulam há anos em cursos de análise de dados — **sem que se tenha confirmado qual é a origem primária**. Enquanto isso não for verificado, o conjunto é usado como **exemplo didático sintético**, não como evidência empírica sobre venda de bebidas.
