# 02 — Dados

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Identificar as três fontes de vazamento de dados mais comuns e como cada uma se manifesta.
- **O2.** Projetar uma divisão treino/validação/teste que respeite a estrutura temporal e de grupo dos dados.
- **O3.** Escrever uma ficha de dataset (origem, licença, limitações conhecidas) antes de treinar.
- **O4.** Diagnosticar desbalanceamento e viés de seleção a partir da própria coleta.

## O problema

O modelo aprende o que está nos dados — inclusive o que não deveria estar. **Vazamento de dados** é a informação que existe no treino mas não existirá no momento da predição, e ele produz o resultado mais perigoso do Machine Learning: o resultado bom demais.

A assinatura é sempre a mesma. Alguém reporta uma métrica excelente, ninguém desconfia porque a notícia é boa, o modelo vai a produção e o número desaba. O vazamento não dá erro, não aparece em log, e passa por todas as revisões de código — porque não é um bug de código, é um bug de **tempo**: uma coluna que só existe depois do fato, uma normalização calculada antes da divisão, uma linha do mesmo paciente nos dois lados do split.

## Roteiro do capítulo

1. As três fontes de vazamento: alvo disfarçado, pré-processamento antes do split, e duplicata entre conjuntos
2. Divisão que respeita o tempo: por que embaralhar série temporal é fraude metodológica
3. Divisão por grupo: quando o mesmo sujeito não pode estar nos dois lados
4. Desbalanceamento: o que é problema real e o que é problema imaginário
5. A ficha de dataset: origem, licença, consentimento, limitações conhecidas
6. Viés de seleção: aprender com os clientes que você já tem

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
