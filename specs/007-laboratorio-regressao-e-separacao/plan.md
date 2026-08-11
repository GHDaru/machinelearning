# Plan 007

## Constitution Check (portão)

| Princípio | Conformidade |
|---|---|
| I — Evidência acima de retórica | A dedução é matemática verificável; os números do laboratório saem do próprio dado gerado, não de texto |
| II — A fonte-base é o código | O laboratório **é** código; a solução fechada nele é a mesma da `RegressaoLinear` da etapa 05 |
| III — Método pedagógico | O laboratório é 4C/ID puro: o aluno pratica antes de receber a fórmula. A dedução vem **depois** da manipulação |
| IV — Livro vivo | Data de captura no cabeçalho do capítulo novo; entrada no HISTORICO |
| V — Segurança | Sem segredo. O laboratório roda no navegador e não faz requisição |
| VI — Neutralidade e custo zero | Canvas puro, sem biblioteca de gráfico, sem CDN |
| VII — Spec-driven e branch | Este ciclo |
| VIII — Interatividade | Terceira superfície (laboratório), a mais robusta: não depende do backend |
| IX — DoD verificável | Build com gates de link/nível/selos; gate do banco; verificador de notebooks |
| **X — Nenhum método cai do céu** | **O capítulo novo precisa de "De onde isto veio" com tabela de selos, ou o build falha.** É o gate que decide a ordem do trabalho |

## Decisões

**D1 — O capítulo da logística recebe o número 28.** Números são identificadores estáveis; renumerar quebraria links externos e o progresso dos leitores. Registrado no ADR 0009.

**D2 — A interação direta usa duas alças, não arrasto livre.** Arrastar a reta inteira só translada (muda `b`); rotacionar exigiria um gesto secundário. Com uma alça em cada extremidade, os dois graus de liberdade ficam manipuláveis pelo mesmo gesto, e o aluno vê `a` e `b` mudarem juntos.

**D3 — A métrica minimizada é o EQM, e as outras existem para contraste.** Mostrar SQE, EQM, RMSE, EAM e R² lado a lado deixa ver o que o capítulo afirma: a escolha da perda é critério de arbitragem. O EAM discorda do EQM quando há ponto distante — e isso fica visível.

**D4 — O botão que revela a ótima usa a solução fechada**, não gradiente: é o resultado da dedução da seção nova, e o aluno pode conferir a conta à mão.

## Ordem de execução

O gate do Princípio X inverte a ordem ingênua: **não dá para criar o capítulo 28 e escrever a história depois** — o build falha antes. Então:

1. Laboratório (`publicar/tema/laboratorios.js` + CSS) — independente do resto.
2. Dedução no capítulo 05, com o laboratório ancorado antes dela.
3. Capítulo 28 **completo de uma vez**: corpo + história com selos + exercícios + vídeo.
4. Capítulo 05 perde a logística; objetivos, síntese e verificação reescritos.
5. Sumário, trilhas e links de outros capítulos.
6. Build, gate do banco, testes, notebooks.
