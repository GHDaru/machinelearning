# Spec 002 — Capítulo 02: Dados

**Branch:** `002-capitulo-02-dados` · **Raia:** plena · **Data:** 2026-08-05

## O quê

Escrever o capítulo 02 (Dados) no esqueleto v4 e implementar a etapa 02 do `ml-zero`.

## Por quê

Vazamento de dados é o erro mais caro e mais silencioso de Machine Learning: não dá erro, não aparece em log, passa por revisão de código, e o sintoma é uma métrica boa demais que ninguém questiona porque a notícia é boa.

É também o capítulo que tira a trilha prática do dado sintético — a limitação que o [ADR 0003](../../adr/0003-dado-sintetico-na-etapa-00.md) declarou de propósito na etapa 00.

## Requisitos

- **R1** Capítulo no esqueleto v4, cobrindo os 4 objetivos já declarados no esqueleto (não inventar objetivos novos: eles são o contrato firmado na spec 001).
- **R2** ≥3 exercícios (entregues: 4) e ≥1 vídeo, cada exercício rastreando a um objetivo.
- **R3** Etapa 02 do `ml-zero`: detecção de vazamento, divisão por grupo, divisão por tempo com intervalo de guarda, checagem de duplicatas, ficha de dataset executável.
- **R4** Toda referência citada no corpo com status ✓.

## Critérios de aceite

| # | Critério | Verificação |
|---|---|---|
| A1 | Build verde, gate do banco verde | saída do `npm run build` |
| A2 | Testes da etapa 02 verdes | `pytest` |
| A3 | A ficha de dataset **recusa** entrada incompleta | teste por campo obrigatório |
| A4 | Divisão por grupo nunca parte um sujeito | `vazou_entre(...) == set()` |
| A5 | Divisão por tempo põe todo o treino antes de todo o teste | teste de ordem |
| A6 | Nenhuma afirmação do corpo apoiada em referência ⏳ | inspeção da bibliografia |

## Fora de escopo

- Dataset real baixado da internet (a etapa 02 continua sem rede; o dado real entra quando houver um com ficha completa e licença conferida).
- Correção automática de vazamento — o detector **acusa**, quem decide é a pessoa.
