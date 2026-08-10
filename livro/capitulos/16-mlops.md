# 16 — MLOps

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e mídia entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../ROADMAP.md).

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Versionar dado, código e modelo de forma que um resultado seja reproduzível meses depois.
- **O2.** Implantar um modelo atrás de uma API com contrato e validação de entrada.
- **O3.** Distinguir drift de covariáveis de drift de conceito e detectar cada um.
- **O4.** Projetar um plano de rollback antes do deploy, e não durante o incidente.

## O problema

Um modelo em produção degrada sozinho. Não porque o código apodreceu, mas porque o mundo do qual ele aprendeu mudou — e ele não sabe disso. Sem monitoramento, a primeira pessoa a descobrir é o usuário; a segunda é o jurídico.

Este é o capítulo em que o livro fecha o ciclo: o `ml-zero` vira um serviço de verdade, com validação de entrada, telemetria de predições e detecção de drift. A mesma disciplina que o backend deste livro aplica a si mesmo.

## Roteiro do capítulo

1. Reprodutibilidade: seed, versões, e o hash do dado
2. Versionar modelo: registry, promoção e o que significa 'a versão em produção'
3. Servir: a API, o contrato, e a validação que rejeita entrada fora da distribuição
4. Drift de covariáveis × drift de conceito: o que cada um exige
5. Monitorar sem rótulo: os sinais indiretos disponíveis antes da verdade chegar
6. Rollback: o plano que se escreve antes

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
