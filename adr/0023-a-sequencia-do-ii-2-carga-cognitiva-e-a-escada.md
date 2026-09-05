# ADR 0023 — A sequência do II.2: carga cognitiva ordena, a escada do 0014 cobra

**Data:** 2026-09-05 · **Estado:** aceito · **Comitê:** três especialistas independentes (sequenciamento, prática e avaliação, carga cognitiva), consolidados pelo coordenador

## Contexto

O autor aprovou o modelo do cartão e recusou a ordem:

> *"Ficou muito bom o modelo, mas a sequência de conteúdo não. Para um aluno precisando de passos evolutivos, não está linear."*

Ele autorizou, para este capítulo, reescrever a constituição como experimento declarado, e pediu que a decisão saísse de três especialistas que concordassem num padrão pedagógico já provado.

Os três trabalharam **sem falar entre si**. É o que torna a convergência informação: comitê que combina antes não é comitê.

## O que os três acharam, e onde convergiram sem combinar

**A não-linearidade não é de sinalização.** Varredura por "veremos", "mais adiante", "na seção seguinte" nos 39 cartões: **uma ocorrência**, dentro da explicação de um exercício. O capítulo não promete coisas para depois.

**Ela é de pré-requisito.** Os três acharam inversões, por caminhos diferentes:

| Conceito | Primeiro uso | Apresentado | Quem achou |
|---|---|---|---|
| **coeficiente** | cartão 1 | cartão 17 | coordenador |
| padronização | 4 e 15 | 16 | especialista 3 |
| colinearidade | 14 e 15 | 22 | especialistas 1 e 3 |
| R² | 15 | 20 | especialista 3 |
| solução fechada | 1 | 7 | coordenador e 3 |
| **AUC** | quatro lugares | **nunca** | especialista 3 |

O pior é o mais central: *coeficiente* é a palavra que o capítulo existe para ensinar a ler, e o aluno a encontra no cartão 1 sem receber o cartão que a apresenta antes do 17.

**A dificuldade não progride.** Spearman entre posição e dificuldade = **0,173** (especialista 1). A exigência dos exercícios sobe 1,25 → 1,38 → 1,67 → 2,50 e **cai para 1,10** no bloco final, abaixo do nível de abertura, com nove cartões seguidos de puro reconhecimento (especialista 2).

**O objetivo O1 diz "derivar" e a dedução não é cobrada.** Os dois primeiros especialistas acharam isto separadamente e **divergem no número**: o 1 mede 8 de 14 exercícios desalinhados, o 2 diz que nenhum dos 14 pede derivar. A divergência fica registrada; o diagnóstico é o mesmo e não depende de qual contagem vence.

**O executável chega tarde demais.** O notebook está no cartão 37, a **94,9% do caminho**, e refaz a análise dos cartões 18 a 25. Na régua, o primeiro ato executável está a **7,1%**.

## A régua, medida no arquivo

`/tmp/geron10.ipynb`, capítulo 10 do *Hands-On Machine Learning*: 211 células, 130 de código e 81 de markdown, **mediana de 13 palavras por célula de markdown** e **3 linhas por célula de código**. Ele fecha o arco inteiro na célula 81 (38% do caminho) e o **repete quatro vezes**, com a prosa encolhendo a cada repetição.

Duas medidas do especialista 3 que puxam em sentidos opostos, e as duas ficam:

- **por unidade fechável somos 4,2 vezes mais densos** que ele;
- **por palavra somos menos densos**: 76 palavras por ideia contra 43 dele.

A conclusão que sai das duas juntas não é "escrevemos demais": é **empacotamento**. Ele dá 1,7 gestos por ideia nova; nós damos 0,42.

## Decisão 1 — a Teoria da Carga Cognitiva ordena a sequência

**Recusamos o 4C/ID para este papel, e a razão é do repositório.**

O especialista 1 recomendou 4C/ID com o argumento de que é o único dos cinco candidatos que está em `livro/bibliografia.md` com selo real; os outros entrariam em ⏳, que **nunca pode sustentar afirmação**. O critério é bom.

O especialista 3 recusou 4C/ID com um argumento mais forte: **a constituição já lhe deu outro papel**. No Princípio III, a trilha `ml-zero` são as tarefas inteiras e os capítulos são a informação de apoio. Usar 4C/ID para sequenciar o capítulo reatribui o papel do capítulo dentro de um modelo que já está em uso, e é o erro que a própria `BASE-EDUCACIONAL.md` §5 nomeia: aplicar um achado verdadeiro fora do lugar dele.

**Admitido o conflito de papel, o critério do especialista 1 seleciona Sweller.** A Teoria da Carga Cognitiva está em `bibliografia.md` com selo **✓**, conferida em 2026-08-01, e o Princípio III já a invoca para o formato. Estendê-la ao sequenciamento não reatribui papel nenhum.

**A regra que fica**, e ela é de sequenciamento e não de formato:

1. **Pré-requisito antes do uso.** Nenhum cartão usa conceito que a sequência ainda não apresentou.
2. **Teto de três ideias novas por cartão.** Hoje a média é 4,92 e seis cartões passam de sete.
3. **Exemplo trabalhado, depois desvanecimento**, no que for procedimento. O capítulo já faz isso nos cartões 11 e 13, e funciona.

**Onde não vale:** a fronteira da ADR 0022 continua de pé. Praticar antes rende g = 0,36 em conceito e transferência e g = −0,03 em procedimento, e a carga cognitiva não revoga esses números.

## Decisão 2 — a escada da ADR 0014 ordena a prática

Do especialista 2, e compatível com a decisão 1: a progressão E1/E2/E3 terminando **no verbo do objetivo** passa a ser a chave de ordenação da prática, com portão executável que reprova teto não atingido, teto ultrapassado, queda maior que um degrau e platô acima de quatro cartões.

Custa uma etiqueta nova no Markdown. Não vale no bloco histórico (a ADR 0022 registra selo ❌ para a posição dele), nem na `Verificação` (ADR 0012), nem entre capítulos.

## Decisão 3 — a constituição NÃO é reescrita

O autor autorizou a ruptura e ela não é necessária, o que é o desfecho que o Princípio VII pede: **YAGNI poda o que não se paga**.

O especialista 1 chegou a pedir uma clarificação MINOR do Princípio III, para o capítulo em modo cartão contar também como prática de parte. Recusada pelo mesmo motivo da decisão 1: a regra que resolve já existe, e emendar a constituição para acomodar um padrão que perdeu a comparação seria pagar duas vezes.

**Fica registrado que a liberdade foi concedida e não usada.** Se uma rodada futura precisar dela, o precedente está aqui.

## Decisão 4 — o teto do cartão passa a contar a camada revelada

Achado do especialista 3, corrigido pela medição do coordenador. Ele afirmou que o gate enxerga 39,4% do cartão; a medição no navegador dá **69,2%**. A diferença é que ele contou o gabarito e o `porque`, que não chegam ao cliente de forma alguma e por isso não são camada escondida: são camada ausente.

O que sobra depois da correção continua sendo defeito: **3.211 palavras em 38 revelações** de interação, 31% do que o leitor pode ler, ficam fora da conta. O teto de 250 palavras é cobrado sobre 69% do texto, e um cartão de 236 palavras medidas pode ter 340 com as revelações abertas.

O gate passa a somar o conteúdo dos `<template>` de revelação ao contar palavras.

## Decisão 5 — o notebook entra na classe que ele fecha

O ciclo que o autor pediu (o aluno abre, altera, roda e cola o resultado de volta) é **verificável sem vazar**: o tipo `numerica` guarda o valor no backend e ele nunca desce ao cliente. O especialista 2 desenhou três pontos de entrada e cinco condições.

Duas ressalvas que ficam declaradas. `TENTATIVAS_ATE_REVELAR = 2` entrega a resposta no segundo clique. E **o número prova o número, nunca a execução**: um aluno que descobre o valor por outro caminho passa igual.

## Bloqueadores que entram no replanejamento

- **D26**: o `e4` pergunta o que o notebook linkado imprime em prosa. O capítulo oferece o link; o aluno clica e lê a resposta.
- Os exercícios `e31`–`e37` declaram O1 e testam disciplina de proveniência. A saída honesta é um **O5 declarado**, e ela deixou de ser adiável porque agora há decisão de sequência dependendo do mapa de objetivos.
- **AUC nunca é definida** no capítulo, embora expandida em `<abbr>`.

## Alternativas avaliadas

**4C/ID.** Recusada pelo conflito de papel, não por mérito. Continua valendo onde a constituição a pôs.

**Elaboration Theory (Reigeluth).** Recusada duas vezes: selo ⏳, que não sustenta afirmação, e o epítome-primeiro é exatamente o pico de densidade P1 que o especialista 3 mediu no cartão 1, hoje o mais denso do capítulo com nove ideias.

**Mastery learning (Bloom).** Recusada pelo especialista 1 com argumento de arquitetura: a `:::interacao` é formativa por construção, não grava tentativa e não tem onde verificar o degrau. Sem verificação, mastery learning é nome, não método.

**Currículo em espiral (Bruner) e Cognitive Apprenticeship.** Recusadas por selo ⏳.

## Consequências

- O `II.2` passa de 39 para cerca de 36 cartões. Cortar sozinho **piora** a densidade por unidade, como o especialista 3 alertou: o orçamento que sai do bloco histórico é gasto partindo os seis picos.
- Dois portões novos: pré-requisito antes do uso, e a escada da prática.
- O gate dos cartões muda de conta, e os limites de 400 a 1.600px e 80 a 250 palavras precisam ser reaferidos contra a camada revelada antes de virarem números diferentes.
- Os outros 28 capítulos **não** mudam por causa desta ADR. Ela é do `II.2`, e a generalização espera o resultado medido.
