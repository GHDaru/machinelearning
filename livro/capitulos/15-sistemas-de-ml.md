# 15 — Sistemas de ML

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Descrever os componentes de um sistema de ML além do modelo.
- **O2.** Identificar as formas de dívida técnica específicas de sistemas que aprendem.
- **O3.** Projetar o contrato entre treino e inferência para evitar training-serving skew.
- **O4.** Decidir entre predição em lote e em tempo real a partir do requisito, não do gosto.

## O problema

O código do modelo é uma fração pequena de um sistema de Machine Learning em produção — o restante é coleta, validação, features, serviço, monitoramento e infraestrutura. Essa observação, formalizada por [Sculley et al. (2015)](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems), continua sendo o diagnóstico mais citado da área.

O ponto não é que o modelo importa pouco. É que os modos de falha caros moram nas fronteiras entre componentes — e a mais cara delas é a fronteira entre como o atributo foi calculado no treino e como ele é calculado na hora de servir.

## Roteiro do capítulo

1. Os componentes que não são o modelo
2. Dívida técnica específica: entanglement, feedback loop escondido, pipelines-selva
3. Training-serving skew: a mesma feature calculada de dois jeitos
4. Feature store: o problema que ela resolve e o custo que ela cobra
5. Lote × tempo real: a decisão pelo requisito de latência e de frescor
6. O contrato de dados como interface versionada

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
