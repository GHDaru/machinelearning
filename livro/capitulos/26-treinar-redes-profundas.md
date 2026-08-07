# 26 — Treinar Redes Profundas

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-08 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e vídeos entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../../ROADMAP.md).

## Objetivos de aprendizagem

- **O1.** Explicar por que a inicialização dos pesos determina se a rede treina.
- **O2.** Diagnosticar gradientes que somem e que explodem pelos seus sintomas.
- **O3.** Aplicar dropout, normalização em lote e aumento de dados como regularização.
- **O4.** Escolher entre SGD com momento e otimizadores adaptativos, com critério.

## O problema

Uma rede de duas camadas treina quase sozinha. Uma de vinte não treina de jeito nenhum — a menos que você conheça o punhado de truques que a comunidade levou trinta anos para descobrir.

Este capítulo é sobre esses truques. Nenhum deles é profundo teoricamente; todos são a diferença entre uma rede que aprende e uma que fica parada.

## Roteiro do capítulo

1. Inicialização: por que zeros não funcionam, e o que Xavier e He resolvem
2. Gradiente que some e que explode: sintomas e correções
3. Normalização em lote e suas alternativas
4. Dropout: regularização por ruído deliberado
5. Aumento de dados: mais dados sem coletar mais dados
6. Momento, Adam e companhia: o que adaptar a taxa por parâmetro compra
7. Agendas de taxa de aprendizado e o aquecimento
8. Transferência: por que quase ninguém treina do zero

## Onde este capítulo entra

- **Aprendizagem de Máquina** — ver [a trilha](../trilhas/aprendizagem-de-maquina.md)

## Pratique

*A escrever.*

## Assista

*A escolher.*

## Verificação

*A escrever.*
