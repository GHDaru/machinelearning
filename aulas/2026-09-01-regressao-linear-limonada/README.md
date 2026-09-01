# Aula 2026-09-01 — Regressão linear com o caso da limonada

Material de aula de **Análise Preditiva** (fora do livro): da análise descritiva à
regressão regularizada, sobre o dataset da limonada
([`ml-zero/dados/limonada/`](../../ml-zero/dados/limonada/README.md), sintético, 365 dias).

## O que há nesta pasta

| Arquivo | O que é |
|---|---|
| [`aula_limonada.ipynb`](aula_limonada.ipynb) | O notebook da aula, **já executado** (saídas e gráficos incluídos). Roda de ponta a ponta no Colab ou na máquina local — baixa o CSV sozinho quando não encontra o repositório |
| [`prova.md`](prova.md) | As 10 questões com **gabarito comentado** — material do professor, não distribuir antes da prova |
| [`prova_google_forms.gs`](prova_google_forms.gs) | Script (Google Apps Script) que **cria o Google Forms sozinho**, em modo teste, com pontos e feedback por questão |

## Roteiro do notebook

1. **Descritiva** por campo quantitativo — histograma com boxplot superior, outliers (IQR),
   assimetria, curtose e os cuidados de cada variável (inclusive a pegadinha do `preco`
   binário, que a regra do IQR marca inteiro como "outlier").
2. **Par a par** — todos os cruzamentos num comando (`pd.plotting.scatter_matrix`) e depois
   cada par com o alvo em close: dispersão para as contínuas, boxplot por grupo para o preço.
3. **Diagnóstica** — matriz de correlação e a armadilha do preço (+0,51 que é estação).
4. **O calendário** — vendas médias por dia da semana (amplitude < 1 copo: sem sinal, fica
   fora do modelo) e a série do ano inteiro, com o período de preço 0,50 sombreado no pico.
5. **Preparação** — `X`/`y`, treino/teste, padronização sem vazamento.
6. **Regressão linear** — coeficientes, R²/MAE/RMSE em treino e teste, resíduos.
7. **Feedback de retorno** — o que o modelo responde e o que exige dado novo.
8. **Ridge e Lasso** — 14 atributos expandidos; o Lasso empata em R² com 8 parâmetros.
9. **Transformação** — log em `precipitacao`: assimetria 1,86 → 0,81, ganho medido.

## Como abrir com a turma

- **Colab (depois do merge na `main`)**:
  <https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/aulas/2026-09-01-regressao-linear-limonada/aula_limonada.ipynb>
- **Colab (hoje, antes do merge)**: baixe o `.ipynb` desta pasta e use
  *File → Upload notebook* no Colab. O notebook baixa o CSV sozinho.
- **Local**: `jupyter notebook aula_limonada.ipynb` na raiz do repositório
  (usa pandas, matplotlib e scikit-learn — os mesmos do `ml-zero/requirements.txt`).

## Como gerar a prova no Google Forms

1. Abra <https://script.google.com> e crie um projeto novo.
2. Cole o conteúdo de `prova_google_forms.gs` e salve.
3. Execute `criarProva` (▶) e autorize.
4. O log imprime as duas URLs: **edição** (professor) e **publicada** (alunos).

O formulário nasce como *quiz*: corrige sozinho, mostra a pontuação e devolve o
feedback explicativo de cada questão.

> Nota de procedência: os números citados no material (assimetria 1,86 e curtose 5,2 da
> chuva, 62 dias a 0,50, R² ≈ 0,98, Lasso com 8 de 14) são os que o próprio notebook
> calcula ao executar — nenhum número digitado à mão.
