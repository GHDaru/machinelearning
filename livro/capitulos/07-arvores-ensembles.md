# 07 — Árvores e Ensembles

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Explicar como uma árvore de decisão escolhe cada divisão.
- **O2.** Distinguir bagging de boosting quanto ao erro que cada um ataca.
- **O3.** Ajustar os hiperparâmetros de um modelo de boosting na ordem que importa.
- **O4.** Justificar por que boosting em dados tabulares continua competitivo com deep learning.

## O problema

Em dados tabulares — que são a maioria dos dados corporativos — o gradient boosting ainda é a resposta padrão, e não por conservadorismo. A afirmação é forte e este capítulo a trata como afirmação empírica: com experimento reproduzível e citação verificada, não como folclore de competição.

O caminho até lá passa por entender a árvore individual (interpretável, instável) e as duas formas de combiná-las: **bagging**, que ataca variância, e **boosting**, que ataca viés.

## Roteiro do capítulo

1. A árvore de decisão: impureza, divisão e poda
2. Por que uma árvore sozinha tem variância alta
3. Bagging e floresta aleatória: média de modelos descorrelacionados
4. Boosting: cada modelo corrige o erro do anterior
5. A ordem de ajuste dos hiperparâmetros que economiza tempo
6. Tabular: o experimento que compara boosting e redes, com intervalo de confiança

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
