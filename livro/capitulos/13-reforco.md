# 13 — Aprendizado por Reforço

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e mídia entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../ROADMAP.md).

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Formular um problema como processo de decisão de Markov.
- **O2.** Explicar o dilema exploração–explotação com um exemplo concreto.
- **O3.** Descrever a diferença entre aprender valor e aprender política.
- **O4.** Reconhecer quando reforço é a formulação certa — e quando é overkill.

## O problema

Nos capítulos anteriores, o gabarito estava lá: cada exemplo trazia a resposta certa. No aprendizado por reforço não há gabarito, há **consequência** — e ela chega tarde, parcial e às vezes enganosa.

É a formulação mais próxima de como animais aprendem e a mais difícil de operar. Este capítulo é deliberadamente enxuto: o objetivo é que você reconheça a formulação e saiba julgar uma proposta, não que treine um agente de jogo.

## Roteiro do capítulo

1. MDP: estado, ação, recompensa, transição
2. Exploração e explotação: o custo de nunca tentar o desconhecido
3. Métodos de valor: Q-learning na sua forma tabular
4. Métodos de política: otimizar diretamente o comportamento
5. Recompensa mal especificada: o modo de falha característico
6. RLHF: onde reforço encontrou os modelos de linguagem

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
