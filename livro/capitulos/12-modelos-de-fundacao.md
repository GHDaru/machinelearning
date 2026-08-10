# 12 — Modelos de Fundação

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e mídia entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../ROADMAP.md).

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Distinguir pré-treino, fine-tuning e uso via prompt quanto a custo e a dado necessário.
- **O2.** Usar embeddings para busca semântica e medir a melhora sobre a busca por termos.
- **O3.** Explicar RAG como decisão de arquitetura, e não como técnica de prompt.
- **O4.** Escolher entre fine-tuning e recuperação a partir da natureza do problema.

## O problema

A partir de certo ponto, treinar do zero deixou de ser a opção padrão. Modelos pré-treinados em corpora enormes oferecem representações reaproveitáveis, e o trabalho de Machine Learning migra de 'treinar' para 'adaptar, recuperar e avaliar'.

Este capítulo é o mais exposto à cláusula de expiração do livro inteiro, e por isso trata do que é **estrutural** — a diferença entre conhecimento nos pesos e conhecimento recuperável — e não do modelo da moda.

## Roteiro do capítulo

1. Pré-treino, fine-tuning e prompt: três pontos de uma escala de custo
2. Embeddings: o texto como vetor, e o que a proximidade significa
3. Busca semântica: o experimento contra a linha de base por termos (o índice deste próprio livro)
4. RAG: conhecimento fora dos pesos, e as três falhas típicas
5. Fine-tuning eficiente: adaptar sem retreinar tudo
6. Avaliar o que não tem gabarito: rubricas, e o júri automático que também erra

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
