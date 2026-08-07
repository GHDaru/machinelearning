# 24 — Séries Temporais

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-08 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e vídeos entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../../ROADMAP.md).

## Objetivos de aprendizagem

- **O1.** Decompor uma série em tendência, sazonalidade e resíduo.
- **O2.** Aplicar validação com origem móvel, e explicar por que k-fold embaralhado é inválido aqui.
- **O3.** Comparar uma previsão contra a linha de base ingênua correta.
- **O4.** Reconhecer quando um problema temporal pode ser tratado como tabular.

## O problema

Prever o futuro tem uma armadilha que nenhum outro problema tem: **o futuro está nos dados**, e é fácil usá-lo sem perceber.

Embaralhar uma série antes de dividir é o erro mais comum e o mais fatal — o modelo treina com dezembro para prever junho e reporta uma métrica excelente que produção jamais reproduzirá. O capítulo 02 já avisou; aqui o assunto ganha ferramenta própria.

## Roteiro do capítulo

1. Decomposição: tendência, sazonalidade, resíduo
2. Estacionariedade, e por que ela importa para os métodos clássicos
3. A linha de base ingênua (repetir o último valor) — surpreendentemente difícil de bater
4. Validação com origem móvel e intervalo de guarda
5. Métodos clássicos: médias móveis, suavização exponencial, ARIMA
6. Transformar o problema em tabular: janelas e atributos defasados
7. Horizonte de previsão: prever 1 passo e prever 30 são problemas diferentes

## Onde este capítulo entra

- **Análise Preditiva** — ver [a trilha](../trilhas/analise-preditiva.md)

## Pratique

*A escrever.*

## Assista

*A escolher.*

## Verificação

*A escrever.*
