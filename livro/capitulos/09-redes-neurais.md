# 09 — Redes Neurais

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e mídia entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../ROADMAP.md).

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Explicar o perceptron multicamadas como composição de transformações e não-linearidades.
- **O2.** Derivar backpropagation como aplicação da regra da cadeia.
- **O3.** Implementar uma rede densa em NumPy, do forward ao update.
- **O4.** Diagnosticar os modos de falha do treino: gradiente que some, que explode, e inicialização ruim.

## O problema

Uma rede neural é uma composição de funções simples que, empilhadas, aproximam funções complicadas. O treino é a regra da cadeia aplicada com cuidado contábil. Não há mágica — há uma quantidade de detalhes que, quando erram, produzem sintomas específicos e reconhecíveis.

Este capítulo constrói a rede à mão, em NumPy, antes de qualquer framework. A razão é a mesma que faz este livro implementar precisão e revocação à mão: o que se constrói uma vez não se confunde depois.

## Roteiro do capítulo

1. Do perceptron ao MLP: por que a não-linearidade é o que importa
2. Funções de ativação: ReLU e as alternativas, com o critério de escolha
3. Backpropagation: a regra da cadeia com contabilidade
4. Inicialização: por que zeros não funcionam
5. Gradiente que some e que explode: sintomas e correções
6. Double descent: o retorno da conversa do capítulo 01

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
