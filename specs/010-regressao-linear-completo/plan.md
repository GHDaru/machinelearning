# Plan 010

## Constitution Check (portão)

| Princípio | Conformidade |
|---|---|
| I — Evidência acima de retórica | O ciclo inteiro é sobre evidência: fonte lida antes de afirmar, número do corpo com asserção que o regenera. Nenhum número novo entra sem artefato |
| II — A fonte-base é o código | Os números da limonada passam a ser saída de teste em `ml-zero`, não texto copiado do notebook |
| III — Método pedagógico | O esqueleto v5 se completa (Fundamentos científicos + Estado da arte); nenhuma seção muda de tipo Diátaxis |
| IV — Livro vivo | Cláusula de expiração declarada e registrada no placar; datas de captura e revisão atualizadas; HISTORICO com modelo de IA |
| V — Segurança | Sem segredo; nenhum dado novo; o PDF lido é aberto (Project Euclid, open access) |
| VI — Neutralidade e custo zero | Nenhuma dependência nova; papers citados são abertos (Euclid, arXiv, PMC) |
| VII — Spec-driven e branch | Este ciclo. Nome da branch vem do harness — conflito declarado na spec |
| VIII — Interatividade | Cota do portão já cumprida (12 exercícios, 2 laboratórios); nenhum exercício órfão novo |
| IX — DoD verificável | A1–A8 da spec, todos com comando e exit code |
| X — Nenhum método cai do céu | A seção histórica **melhora de evidência**: ✓ᵃ → ✓ no Stigler; o que a leitura não sustentar desce de selo, nunca o contrário |

**Veredito: sem violações.** Único ponto de tensão: o Princípio IV pede a versão do modelo
de IA no HISTORICO, e a política da sessão remota proíbe gravar identificador de modelo em
artefato do repositório. Registro no formato dos precedentes ("Claude (Anthropic), via
Claude Code"), sem o identificador fino — e o conflito fica declarado na conversa com o
autor, que pode completar o registro.

## Decisões

**D1 — O que a leitura de Stigler autoriza, e o que não.** Stigler (1981) lido vira ✓.
Afirmações sobre Legendre 1805, Gauss 1809, Olbers 1816 e o ataque de 1820 são sustentadas
**como relato de Stigler** (fonte secundária lida) — o registro no texto distingue "Stigler
relata" de "lido no original", e os originais permanecem ✓ᵐ. **Bessel (1832) não aparece em
Stigler (1981)**: a atribuição desce para ⏳ com a fonte corrente nomeada (Plackett 1972,
não lido), em vez de fingir confirmação.

**D2 — Fundamentos científicos com três papers, todos abertos.** Hand (2006, *Statistical
Science*) para "a ilusão de progresso" dos classificadores complexos; Rudin (2019, *Nature
Machine Intelligence* / arXiv) para "modelo interpretável em decisão de alto risco";
Westreich & Greenland (2013, *Am. J. Epidemiology*) para a falácia da Tabela 2 — a leitura
errada de coeficientes de ajuste que o caso da limonada produz de propósito. Cada um entra
com o selo que a validação alcançar (✓ se lido, ✓ᵃ se resumo), nunca acima.

**D3 — A asserção da limonada vive em `test_etapa_05.py`,** ao lado das asserções que já
guardam as afirmações do capítulo, e recalcula do CSV cru — sem pandas, no padrão da
etapa (biblioteca padrão + a álgebra da própria `RegressaoLinear`).

**D4 — A cláusula de expiração fecha "O estado da arte"** e aponta gatilhos observáveis
(o que teria de acontecer para a recomendação mudar), no formato das E1–E3 do placar.

## Ordem de execução

1. Leitura de Stigler (1981) e nota em `estudos/` — destrava tudo.
2. Seção histórica do II.2: selos, correções e o que a leitura trouxe de novo.
3. Fundamentos científicos (validação dos três papers) + bibliografia.
4. O estado da arte + cláusula de expiração.
5. Asserções da limonada em `ml-zero/tests/test_etapa_05.py`.
6. Revisão developmental do capítulo inteiro; promoção do cabeçalho.
7. HISTORICO (edição + snapshot + placar E4) e CHANGELOG.
8. Gates: exercícios, build, pytest (ml-zero e backend). Push.
