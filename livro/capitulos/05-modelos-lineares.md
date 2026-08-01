# 05 — Modelos Lineares

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Derivar a regressão linear como minimização do erro quadrático.
- **O2.** Explicar por que a regressão logística é um modelo de classificação apesar do nome.
- **O3.** Interpretar os coeficientes de um modelo linear — e dizer o que eles não significam.
- **O4.** Reconhecer as situações em que o modelo linear é a escolha certa, não a escolha simplória.

## O problema

O modelo linear é o que a maioria das pessoas aprende primeiro e a maioria dos praticantes subestima depois. Ele é rápido, interpretável, calibrável e — em dimensões altas, com poucos dados por atributo — frequentemente **imbatível**.

Mais importante para este livro: é o modelo em que todos os conceitos de otimização, regularização e interpretação aparecem na forma mais limpa. Entendê-lo bem é o que torna os capítulos seguintes legíveis.

## Roteiro do capítulo

1. Regressão linear: da intuição geométrica à solução fechada
2. Regressão logística: a função logística e por que ela produz probabilidades
3. Interpretação de coeficientes: o que 'mantendo tudo mais constante' esconde
4. Colinearidade: quando os coeficientes viram ruído sem que o erro piore
5. Quando o linear ganha: dimensão alta, poucos dados, necessidade de auditoria

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
