# 23 — Análise Multidimensional

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-08 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e vídeos entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../../ROADMAP.md).

## Objetivos de aprendizagem

- **O1.** Modelar um domínio em esquema estrela, distinguindo fatos de dimensões.
- **O2.** Executar operações OLAP: drill-down, roll-up, slice, dice e pivot.
- **O3.** Justificar a desnormalização deliberada de um repositório analítico.
- **O4.** Relacionar o cubo à tabela que um modelo preditivo consome.

## O problema

Antes de prever, as organizações precisam **entender o que já aconteceu** — e essa pergunta tem uma tecnologia própria, anterior ao Machine Learning e ainda dominante em BI.

O modelo dimensional resolve uma tensão real: o banco transacional é normalizado para escrever rápido e sem inconsistência; a análise precisa ler agregações enormes rapidamente. São objetivos opostos, e a resposta foi um segundo repositório com regras próprias.

## Roteiro do capítulo

1. Fato e dimensão: o vocabulário do modelo dimensional
2. Esquema estrela e floco de neve: a desnormalização como decisão
3. Granularidade: a decisão mais cara do projeto
4. Operações OLAP: drill-down, roll-up, slice, dice, pivot
5. Dimensões que mudam com o tempo (slowly changing dimensions)
6. Do cubo ao dataset: onde o BI termina e o modelo preditivo começa

## Onde este capítulo entra

- **Análise Preditiva** — ver [a trilha](../trilhas/analise-preditiva.md)

## Pratique

*A escrever.*

## Assista

*A escolher.*

## Verificação

*A escrever.*
