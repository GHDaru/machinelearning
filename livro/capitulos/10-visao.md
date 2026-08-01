# 10 — Visão Computacional

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Explicar convolução como imposição de invariância translacional.
- **O2.** Justificar por que compartilhar pesos reduz a necessidade de dados.
- **O3.** Aplicar transferência de aprendizado e decidir o que congelar.
- **O4.** Projetar aumentação de dados coerente com o domínio do problema.

## O problema

Uma imagem de 224×224 pixels coloridos tem mais de 150 mil números. Uma camada densa sobre isso teria dezenas de milhões de parâmetros — e aprenderia que um gato no canto superior esquerdo é uma coisa diferente do mesmo gato no canto inferior direito.

A convolução resolve os dois problemas de uma vez, impondo uma estrutura ao modelo: os mesmos pesos aplicados em todas as posições. É o exemplo mais claro do livro de como **restringir** um modelo o torna melhor.

## Roteiro do capítulo

1. Convolução: o filtro que desliza, e a invariância que ele impõe
2. Pooling, stride e o crescimento do campo receptivo
3. Arquiteturas: da pilha simples às conexões residuais
4. Transferência de aprendizado: o caminho de custo zero deste livro
5. Aumentação: transformações que preservam o rótulo — e as que não preservam
6. Quando a imagem não é foto: espectrogramas e outros dados com estrutura local

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
