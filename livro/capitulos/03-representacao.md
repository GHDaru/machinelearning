# 03 — Representação

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Explicar por que a escolha de representação limita o que qualquer modelo pode aprender.
- **O2.** Aplicar codificação adequada a variáveis categóricas de alta e baixa cardinalidade.
- **O3.** Justificar quando normalizar e quando não faz diferença nenhuma.
- **O4.** Construir atributos a partir de conhecimento de domínio e medir se eles pagaram.

## O problema

Um modelo não vê o mundo: vê os números que você escolheu mostrar a ele. Essa escolha — a **representação** — determina o teto de qualquer algoritmo que venha depois. Nenhuma quantidade de otimização recupera informação que não foi codificada.

O exemplo canônico é a data. Como número inteiro (`1721692800`), ela é quase inútil; decomposta em dia da semana, hora do dia e proximidade de feriado, ela frequentemente carrega a maior parte do sinal. O dado é o mesmo. O que mudou foi o que o modelo consegue enxergar.

## Roteiro do capítulo

1. Representação como teto: o que nenhum modelo recupera
2. Categóricas: one-hot, ordinal, target encoding — e o vazamento que o último convida
3. Alta cardinalidade: hashing e embeddings aprendidos
4. Escalas: quando normalizar muda tudo (modelos com distância e gradiente) e quando não muda nada (árvores)
5. Valores ausentes: imputar, sinalizar, ou deixar o modelo lidar
6. Atributos de domínio: a vantagem que dado sozinho não dá

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
