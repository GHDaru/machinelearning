# Spec 004 — Capítulos II.2 e 06: Modelos Lineares e Otimização

**Branch:** `004-capitulos-05-06-lineares-otimizacao` · **Raia:** plena · **Data:** 2026-08-05

## O quê

Escrever os capítulos II.2 e 06 e implementar a etapa 05–06 do `ml-zero`.

## Por quê

Uma spec para dois capítulos porque são o mesmo objeto por dois ângulos: o 05 pergunta *que função o modelo representa*; o 06, *como se chega aos coeficientes*. Separá-los duplicaria a pesquisa e o código sem separar nada.

É também a reparação de uma dívida do capítulo II.5, que mostrou o modelo linear perdendo por larga margem — num terreno construído para favorecer árvores. O capítulo II.2 corrige a impressão que aquele resultado deixa.

## Requisitos

- **R1** Dois capítulos no esqueleto v4, cobrindo os 4 objetivos de cada.
- **R2** ≥3 exercícios por capítulo (entregues: 3 e 4) e ≥1 vídeo cada.
- **R3** Etapa 05–06: `Padronizador`, `RegressaoLinear` (solução fechada **e** gradiente), `RegressaoLogistica` (L1 e L2), `descida_de_gradiente` isolado do modelo.
- **R4** O otimizador devolve histórico com diagnóstico (`divergiu`, `estagnou`).
- **R5** Early stopping monitorando **validação**, com limiar mínimo de melhora.

## Critérios de aceite

| # | Critério | Verificação |
|---|---|---|
| A1 | Build e gate do banco verdes | `npm run build` |
| A2 | Gradiente e solução fechada chegam ao mesmo lugar (Δ < 0,05) | teste |
| A3 | L1 zera coeficientes de ruído; L2 mantém todos não nulos | teste |
| A4 | Padronizar melhora o treino quando as escalas divergem | teste |
| A5 | Early stopping dispara com validação ruidosa e não dispara sem ela | teste |
| A6 | Taxa alta demais é detectada em perda ilimitada | teste |

## Fora de escopo

- Otimizadores adaptativos (Adam, RMSProp) — pertencem ao capítulo III.2, onde a dor que os justifica aparece.
- Elastic net — citado no feedback de um exercício, sem implementação.
