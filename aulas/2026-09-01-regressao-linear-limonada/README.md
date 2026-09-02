# Sequência de aulas — Regressão linear com o caso da limonada

Material de aula de **Análise Preditiva** (fora do livro), em duas aulas sobre o dataset
da limonada ([`ml-zero/dados/limonada/`](../../ml-zero/dados/limonada/README.md), sintético,
365 dias). Cada notebook está **executado** (saídas e gráficos incluídos), roda de ponta a
ponta no Colab ou na máquina local, e baixa o CSV sozinho quando não encontra o repositório.

## Aula 1 — Análise descritiva e diagnóstica

| Arquivo | O que é |
|---|---|
| [`aula1_descritiva_diagnostica.ipynb`](aula1_descritiva_diagnostica.ipynb) | O notebook da aula 1 |
| [`prova_aula1.md`](prova_aula1.md) | As 10 questões com gabarito comentado — material do professor |
| [`prova_aula1_google_forms.gs`](prova_aula1_google_forms.gs) | Script que cria o Google Forms da prova 1 sozinho (quiz, pontos, feedback) |

Roteiro: **1)** o dado e os tipos · **2)** descritiva por campo (histograma com boxplot
superior, outliers pelo IQR, assimetria, curtose, cuidados — inclusive a pegadinha do
`preco` binário) · **3)** par a par (`pd.plotting.scatter_matrix` com todos os cruzamentos
e os pares com o alvo em close, com a fórmula de Pearson) · **4)** diagnóstica (matriz de
correlação e a armadilha do +0,51 do preço) · **5)** o calendário (médias por dia da semana:
amplitude < 1 copo, sem sinal; a série do ano com o preço 0,50 sombreado no pico).

## Aula 2 — O modelo de regressão

| Arquivo | O que é |
|---|---|
| [`aula2_regressao.ipynb`](aula2_regressao.ipynb) | O notebook da aula 2 |
| [`prova_aula2_rascunho.md`](prova_aula2_rascunho.md) | **Rascunho** da prova 2, a revisar antes da aula (ver nota no cabeçalho) |
| [`prova_aula2_rascunho_google_forms.gs`](prova_aula2_rascunho_google_forms.gs) | Script do Forms correspondente ao rascunho |

Roteiro: **1)** retomada · **2)** **regressão item a item** — uma reta para cada variável
contra `vendas`, com a, b, r, R² e RMSE por item (temperatura sozinha: R² 0,98; o preço
"bem ajustado" rendendo +47 copos/real; a soma dos R² dando ~2,7 — os itens compartilham a
estação) e os resíduos de cada ajuste (o U da chuva) · **3)** preparação sem vazamento ·
**4)** modelo múltiplo, coeficientes contra as retas simples (o preço derrete de +47 para
~+1) e avaliação contra a régua do melhor item · **5)** feedback de retorno · **6)** Ridge
e Lasso em 14 atributos expandidos (Lasso empata com 8) · **7)** transformação log da chuva.

## Como abrir com a turma

- **Colab (depois do merge na `main`)**:
  - Aula 1: <https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/aulas/2026-09-01-regressao-linear-limonada/aula1_descritiva_diagnostica.ipynb>
  - Aula 2: <https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/aulas/2026-09-01-regressao-linear-limonada/aula2_regressao.ipynb>
- **Colab (antes do merge)**: baixe o `.ipynb` e use *File → Upload notebook*. O notebook
  baixa o CSV sozinho.
- **Local**: `jupyter notebook` na raiz do repositório (usa pandas, matplotlib e
  scikit-learn — os mesmos do `ml-zero/requirements.txt`; a aula 1 usa só pandas e matplotlib).

## Como gerar uma prova no Google Forms

1. Abra <https://script.google.com> e crie um projeto novo.
2. Cole o conteúdo do `.gs` da prova e salve.
3. Execute a função principal (▶) e autorize.
4. O log imprime as duas URLs: **edição** (professor) e **publicada** (alunos).

O formulário nasce como *quiz*: corrige sozinho, mostra a pontuação e devolve o feedback
explicativo de cada questão.

> Nota de procedência: os números citados no material (assimetria 1,86 e curtose 5,2 da
> chuva, 62 dias a 0,50, R² por item, soma ~2,7, +47 copos/real, Lasso com 8 de 14) são os
> que os próprios notebooks calculam ao executar — nenhum número digitado à mão.
