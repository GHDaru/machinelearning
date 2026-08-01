# 11 — Sequências e Linguagem

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Explicar por que dados sequenciais quebram a premissa de independência.
- **O2.** Descrever a limitação de memória das redes recorrentes.
- **O3.** Explicar o mecanismo de atenção como consulta ponderada por relevância.
- **O4.** Justificar por que a arquitetura Transformer substituiu a recorrência na prática.

## O problema

Em texto, áudio e séries temporais, a ordem é informação. 'O cachorro mordeu o homem' e 'o homem mordeu o cachorro' têm os mesmos atributos e significados opostos — o que quebra a premissa que sustentava todos os modelos até aqui.

A história da solução tem três atos: recorrência (memória que se degrada), portões (memória que dura mais) e atenção (acesso direto a qualquer posição). O terceiro ato mudou tudo, e este capítulo explica por quê — em termos de paralelização e de caminho de gradiente, não de entusiasmo.

## Roteiro do capítulo

1. Por que a ordem quebra a premissa IID
2. RNN: a memória que se dissolve com a distância
3. LSTM e GRU: portões como solução parcial
4. Atenção: consulta, chave e valor
5. Transformer: por que paralelizar foi o que decidiu a disputa
6. Tokenização: a decisão de representação que ninguém discute e todos herdam

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
