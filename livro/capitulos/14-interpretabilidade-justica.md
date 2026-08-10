# 14 — Interpretabilidade e Justiça

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](../HISTORICO.md)
>
> ⚠ **Nível: esqueleto.** Objetivos e problema definidos (Backward Design: os objetivos vêm primeiro). Corpo, exercícios e mídia entram no ciclo de conteúdo — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade) e o [roadmap](../ROADMAP.md).

> ⚠ **Esqueleto.** Este capítulo tem os objetivos e o problema definidos (Backward Design: os objetivos vêm primeiro), mas o corpo, os exercícios e os vídeos ainda não foram escritos. Ele entra pelo ciclo spec-driven — uma spec por capítulo (Princípio VII) — e só é publicado quando cumprir o portão do Princípio VIII: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um dos objetivos abaixo.

## Objetivos de aprendizagem

- **O1.** Distinguir modelo interpretável de explicação post-hoc.
- **O2.** Aplicar e criticar SHAP como atribuição de importância.
- **O3.** Comparar três definições formais de justiça e mostrar que são incompatíveis entre si.
- **O4.** Medir desempenho por subgrupo e decidir o que fazer com a diferença encontrada.

## O problema

Quando um modelo nega um crédito, alguém precisa dizer por quê. Quando erra mais para um grupo de pessoas do que para outro, alguém precisa responder por isso — e cada vez mais, por exigência legal.

Este capítulo trata dos dois problemas juntos porque eles se encontram no mesmo lugar: explicação é o instrumento com que se descobre a injustiça, e o resultado técnico mais importante da área é que as definições razoáveis de 'justo' **não podem ser satisfeitas ao mesmo tempo**, exceto em casos degenerados. Isso transforma uma escolha aparentemente técnica numa decisão explicitamente política — que precisa ser tomada por gente, e registrada.

## Roteiro do capítulo

1. Interpretável por construção × explicado depois
2. Importância de atributos: as formas erradas e a menos errada
3. SHAP: a ideia da teoria dos jogos, e o que a explicação não prova
4. Três definições de justiça e o teorema de impossibilidade
5. Métricas por subgrupo: a análise que quase ninguém faz
6. O que fazer com a diferença: mitigar, documentar, ou não lançar

## Pratique

*A escrever.* Serão no mínimo 3 exercícios, cada um rastreando até um dos objetivos acima — a sintaxe está em [`BANCO-DE-EXERCICIOS.md`](../BANCO-DE-EXERCICIOS.md).

## Assista

*A escolher.* No mínimo 1 vídeo, com autor, duração e a justificativa do que ele resolve que o texto não resolve (Guia Editorial §5).

## Verificação

*A escrever.* Serão 2–3 perguntas abertas que testam exatamente os objetivos declarados no início — nem mais, nem menos.
