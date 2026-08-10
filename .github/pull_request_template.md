<!-- Espelha a Definition of Done da constituição (Princípio IX).
     O que é mecânico já é hard gate na CI; este checklist cobre o que exige julgamento. -->

## O que muda
<!-- Resumo do delta. Na raia leve, este PR é o próprio artefato. -->

## Raia (Princípio VII)
- [ ] Leve (typo/link/uma linha) &nbsp;·&nbsp; [ ] Plena (capítulo, lote de exercícios, etapa do ml-zero, feature) &nbsp;·&nbsp; [ ] Infra (sempre plena + gates de reversibilidade)

## Rastreabilidade
- Spec: `specs/NNN-*` &nbsp;(ou `N/A — raia leve`)
- Fecha/relaciona: #

## Definition of Done — "prove, não declare"
- [ ] `npm run build` (em `publicar/`) verde — sem link interno quebrado
- [ ] Gate do banco de exercícios verde (`node exercicios.mjs --verificar`) e `banco.json` em sincronia
- [ ] `pytest` verde no backend e na trilha `ml-zero`
- [ ] **Evidência colada** (saída de build/teste, screenshot) — sem saída, não está pronto

## Se o PR toca o livro
- [ ] Esqueleto v5 respeitado (objetivos → problema → **de onde isto veio** → fundamentos → estado da arte → prática → síntese → verificação)
- [ ] Princípio X: toda afirmação histórica tem selo (✓ / ✓ᵐ / ⏳ / ❌ / 📖); DOI conferido é ✓ᵐ, não ✓
- [ ] Mínimo de **3 exercícios e 1 vídeo** por capítulo publicado (Princípio VIII.1)
- [ ] Todo exercício rastreia até um objetivo declarado, com feedback que **explica** (VIII.2/VIII.4)
- [ ] Toda afirmação empírica tem experimento reproduzível ou citação ✓ (Princípio I) — nada apoiado em ⏳
- [ ] Selo de captura atualizado e entrada no `livro/HISTORICO.md`, **com a versão do modelo de IA** (Princípio IV)
- [ ] **Revisão developmental feita** antes do copyedit — estrutura e sentido, não só palavras

## Se o PR toca vídeos ou datasets
- [ ] Vídeo com autor, duração, justificativa e link **conferido**
- [ ] Dataset com ficha (origem, licença, limitações) e sem dado pessoal identificável (Princípio V)

## Segurança (Princípio V)
- [ ] Nenhum segredo em arquivo, commit ou texto
- [ ] Nenhum identificador interno de modelo de IA vazado em artefato publicado

## Registro
- [ ] Entrada no `CHANGELOG.md` (ou label `skip-changelog` justificado)
- [ ] Decisão relevante virou ADR em `adr/`
