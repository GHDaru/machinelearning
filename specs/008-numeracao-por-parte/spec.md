# Spec 008 — Numeração por parte

**Data:** 2026-08-12 · **Estado:** implementado · Decisão: [ADR 0011](../../adr/0011-numeracao-por-parte.md)

## Por quê

Medição feita antes de qualquer mudança: **as 29 posições do sumário estavam fora de ordem**. Não algumas — todas. O capítulo 28, criado no dia anterior entre o 05 e o 06, tornou o problema visível.

## Critérios de aceite

| # | Critério | Verificação |
|---|---|---|
| A1 | Todo capítulo identificado por parte e posição (`II.2`) | título, arquivo e endereço |
| A2 | Nenhum link interno quebrado | `npm run build` valida e falha |
| A3 | Id de exercício **não** carrega numeração | `banco.json`: nenhum id começa por dígito |
| A4 | O selo de nível continua chegando ao leitor | gate do Princípio X, 29 páginas |
| A5 | Gating de capacidades preservado em significado | 2→5, 4→9, 6→12 (posição de leitura) |
| A6 | Grafo do livro continua sendo gerado | 54 nós, 264 arestas |
| A7 | Testes e notebooks verdes | 47 backend · 88 ml-zero · 5 notebooks |
| A8 | Âncora `volte para` inexistente falha o build | gate novo, provado quebrando de propósito |

## Fora de escopo

- **Renomear as pastas do `ml-zero`** (`etapa-05` → nome). Mexe nos testes e nos cinco notebooks; virou a dívida **D12**, e é o próximo lote.
- **Redirecionar os endereços antigos.** Decisão explícita do autor: 29 URLs quebram, com 13 tentativas registradas em produção.
