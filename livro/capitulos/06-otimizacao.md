# 06 — Otimização e Regularização

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Explicar o gradiente descendente como procedimento, não como fórmula.
- **O2.** Diagnosticar taxa de aprendizado alta e baixa pelo comportamento da curva de perda.
- **O3.** Comparar regularização L1 e L2 quanto ao efeito sobre os coeficientes.
- **O4.** Justificar early stopping como forma de regularização.

## O problema

Treinar é procurar. A função de perda define uma paisagem, e o otimizador é o procedimento que desce por ela. Quase tudo o que dá errado no treino — não converge, converge para lugar ruim, converge e depois piora — é legível na curva de perda, se você souber ler.

E há a outra metade: impedir que a busca vá longe demais. **Regularização** é toda técnica que troca um pouco de ajuste aos dados de treino por estabilidade no que virá. É o capítulo 01 virando código.

## Roteiro do capítulo

1. Gradiente descendente: a intuição da descida e o papel da taxa de aprendizado
2. Estocástico, mini-batch e completo: o que muda no ruído da trajetória
3. Lendo a curva de perda: divergência, platô, oscilação e overfitting
4. L2 (Ridge): encolher todos os coeficientes
5. L1 (Lasso): zerar alguns — regularização que também seleciona atributos
6. Early stopping: a regularização que não custa nada

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
