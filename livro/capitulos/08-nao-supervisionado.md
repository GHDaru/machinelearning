# 08 — Aprendizado Não Supervisionado

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Explicar por que avaliar agrupamento é qualitativamente mais difícil que avaliar classificação.
- **O2.** Aplicar k-means e reconhecer as premissas geométricas que ele impõe.
- **O3.** Usar PCA para redução de dimensionalidade e dizer o que se perde.
- **O4.** Escolher o número de grupos com um critério declarado, e não pelo gráfico que ficou bonito.

## O problema

Sem rótulo, não há gabarito — e sem gabarito, não há a métrica que organizou todos os capítulos anteriores. Este é o ponto em que o aprendizado não supervisionado deixa de ser 'o mesmo, mas sem alvo' e passa a ser um problema de natureza diferente.

A consequência prática é desconfortável: quase sempre é possível encontrar grupos. A pergunta honesta nunca é 'existem grupos?', mas 'estes grupos significam alguma coisa fora deste conjunto de dados?'.

## Roteiro do capítulo

1. Por que não há métrica de verdade: silhueta, inércia e suas limitações
2. k-means: o algoritmo, e as premissas de forma e escala que ele carrega
3. Agrupamento hierárquico e DBSCAN: quando a forma não é esférica
4. PCA: variância como critério, e o que a projeção descarta
5. Escolher k: cotovelo, silhueta, e o critério externo que vale mais que os dois
6. Detecção de anomalia: o caso em que 'raro' e 'interessante' não coincidem

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
