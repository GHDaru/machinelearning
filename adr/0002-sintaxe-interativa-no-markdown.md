# ADR 0002 — Exercícios e vídeos dentro do Markdown do capítulo

**Data:** 2026-08-01 · **Estado:** aceito

## Contexto

Decidido que a correção mora no servidor (ADR 0001), falta decidir onde o **autor** escreve o exercício, e como ele chega ao backend.

## Decisão

Exercícios e vídeos são escritos em blocos `:::exercicio` / `:::video` **dentro do Markdown do capítulo**, junto do texto que testam. Um extrator (`publicar/exercicios.mjs`) gera o banco para o backend; o motor (`publicar/build.mjs`) renderiza a UI sem o gabarito. Os dois consomem o mesmo parser, `publicar/interativos.mjs`.

## Alternativas avaliadas

**A. Arquivos separados** (`exercicios/04.yaml`). Mais limpo para ferramentas. Perdeu porque separa fisicamente o exercício do parágrafo que ele testa — e o que está separado envelhece separado. Uma seção reescrita deixaria para trás um exercício que testa a versão anterior, sem nenhum sinal.

**B. Banco no banco de dados**, editável por interface. Perdeu por tirar o exercício do controle de versão: sem revisão em PR, sem histórico, sem o gate de build.

**C. Sintaxe própria fora do Markdown padrão** (um dialeto completo). Perdeu por custo de manutenção desproporcional ao ganho.

## Justificativa

**Coesão.** O exercício vive a três parágrafos do que ele testa. Quem reescreve a seção vê o exercício e é forçado a decidir se ele ainda vale.

**Um só fluxo de revisão.** Exercício entra por PR, como texto. É revisado, versionado e revertido como texto.

**O gate é possível.** Como o exercício está no repositório, o build valida: gabarito presente, feedback presente, objetivo existente no capítulo, ids únicos. Erro de autoria vira **falha de build**, não aviso silencioso.

**Dois recortes, uma fonte.** O mesmo bloco produz a UI pública (sem resposta) e o banco privado (com tudo). Não há como os dois divergirem, porque não há dois lugares.

## Consequências

**Mais fácil:** manter exercício e texto sincronizados; revisar prática em PR; falhar cedo em erro de autoria.

**Mais difícil:** o Markdown deixa de ser Markdown puro — um leitor do arquivo bruto no GitHub vê a sintaxe de bloco em vez do widget.

**Exige cuidado:** o parser precisa ignorar blocos dentro de cercas de código, senão a própria documentação da sintaxe vira exercício. Isso aconteceu na primeira execução do gate, foi pego pelo gate, e está corrigido em `interativos.mjs` (função `cercas`) — o incidente está registrado aqui de propósito, porque é exatamente o tipo de coisa que se esquece.

**Também exige:** o `banco.json` gerado é versionado, e a CI confere que ele não divergiu da fonte (`git diff --exit-code` após regerar).
