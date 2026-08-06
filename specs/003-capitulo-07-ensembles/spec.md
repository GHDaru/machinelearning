# Spec 003 — Capítulo 07: Árvores e Ensembles

**Branch:** `003-capitulo-07-ensembles` · **Raia:** plena · **Data:** 2026-08-05

## O quê

Escrever o capítulo 07 e implementar a etapa 07 do `ml-zero`: árvore, floresta e boosting do zero, mais o experimento que sustenta as afirmações do capítulo.

## Por quê

A maioria dos problemas reais de ML em empresas é tabular, e a resposta padrão continua sendo gradient boosting. Este livro não repassa folclore de competição: a afirmação precisa de citação verificada **e** de um experimento que mostre o mecanismo.

## Requisitos

- **R1** Capítulo no esqueleto v4, cobrindo os 4 objetivos do esqueleto.
- **R2** ≥3 exercícios (entregues: 5, incluindo numérica e aberta) e ≥1 vídeo.
- **R3** Etapa 07: `Arvore` (Gini + MSE), `Floresta` (bagging + subamostragem de atributos), `Boosting` (perda logística), `auc` por postos.
- **R4** Experimento reproduzível que produza **todos** os números citados no capítulo.
- **R5** A afirmação sobre tabular × deep learning sustentada por citação ✓.
- **R6** Cláusula de expiração com gatilho de revisão **operacional** — não "quando mudar", mas o que exatamente dispararia a revisão.

## Critérios de aceite

| # | Critério | Verificação |
|---|---|---|
| A1 | Build e gate do banco verdes | `npm run build` |
| A2 | Testes da etapa 07 verdes e rápidos (<10s) | `pytest` |
| A3 | Bagging corta a variância da predição pela metade ou mais | teste executável |
| A4 | O modelo linear fica <0,65 de AUC e a árvore >0,85 no mesmo dado | teste executável |
| A5 | Nenhum modelo passa do teto de Bayes | teste executável |
| A6 | Os três atributos de ruído não carregam sinal | teste executável |
| A7 | Grinsztajn et al. e Breiman conferidos e ✓ | bibliografia |

## Fora de escopo

- Comparação empírica própria contra deep learning — exigiria treinar redes, e o Princípio VI proíbe depender de GPU. A comparação vem por citação, e o capítulo diz isso.
- XGBoost/LightGBM. A etapa implementa o algoritmo; a biblioteca de produção é assunto do capítulo 16.
