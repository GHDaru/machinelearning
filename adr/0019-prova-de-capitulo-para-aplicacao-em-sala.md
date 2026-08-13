# ADR 0019 — Prova de capítulo existe, e é para a sala de aula

- **Status:** aceito
- **Data:** 2026-08-13
- **Emenda:** revisa a Decisão 3 do [ADR 0014](0014-tres-exercicios-por-objetivo-e-a-prova.md)
- **Raia:** plena

## Contexto

O ADR 0014, Decisão 3, **recusou explicitamente a prova de capítulo**, com este
argumento: a seção `Verificação`, criada pelo ADR 0012, já ocupa esse lugar. A prova
passou a existir só por **parte**, cruzando capítulos, e o cruzamento virou "a
distinção real" entre prova e exercício.

O argumento era bom e continua bom **para o leitor sozinho, no site**. Ele não cobre o
caso que apareceu depois: o autor leciona, e precisa de um instrumento para **aplicar
numa turma, em sala, corrigindo ele mesmo**.

## Decisão

**A prova de capítulo passa a existir, com um propósito declarado e diferente:**
avaliação presencial aplicada por um professor. A primeira é a do III.1
(`livro/provas/prova-iii-1.md`).

Ela não substitui a `Verificação` nem a prova de parte. As três convivem porque
respondem a perguntas diferentes:

| Instrumento | Para quem | Pergunta que responde |
|---|---|---|
| `Verificação` | leitor sozinho | "posso seguir para o próximo capítulo?" |
| Prova de **parte** | leitor sozinho | "as peças da parte se ligam entre si?" |
| Prova de **capítulo** | professor, em sala | "esta turma aprendeu este capítulo?" |

## Restrições que a prova de capítulo herda, e a que ela não herda

**Herda: 100% determinística.** Só `multipla`, `multipla-multi` e `numerica`. Nenhuma
questão aberta — quem corrige uma turma inteira à mão precisa de gabarito inequívoco,
e é justamente o caso em que uma rubrica ambígua custa mais caro.

**Herda: retorno que ensina.** Cada item explica por que o gabarito é o gabarito **e**
por que cada distrator errado é atraente. A regra do livro contra o retorno que só diz
"errado" vale mais, não menos, numa prova.

**Não herda o cruzamento obrigatório**, e aqui está a tensão honesta. O gate atual
(`publicar/exercicios.mjs`) exige que todo item com `secao: "prova"` referencie
objetivos de dois capítulos distintos. Prova de capítulo é monocapítulo por definição,
então cumprir isso é forçar o mecanismo. A saída adotada na do III.1: cada item liga o
objetivo do III.1 a um objetivo de capítulo **anterior** (I.6, II.1, II.2, II.3, II.4),
nunca posterior — conteúdo que a turma já viu. As ligações são honestas e o capítulo já
as faz no corpo. Mas fica registrado que **o critério foi desenhado para prova de parte,
e aqui ele é cumprido pela letra, não pelo espírito**. Se surgir uma segunda prova de
capítulo, o gate deve ganhar um caso próprio em vez de continuar sendo dobrado.

## A tarja "isto não vale nota" foi mantida, e é do autor decidir tirá-la

O ADR 0014, Decisão 4, criou a tarja com três premissas: identificação autodeclarada,
livro aberto, enunciado publicado. Uma prova presencial muda duas delas. O texto foi
mantido palavra por palavra no cabeçalho porque a versão **web** da prova continua
pública e continua sujeita às três. Se o autor aplicar em papel e atribuir nota, é
decisão dele, e o livro não tem como saber.

## Consequências

- `publicar/sumario.json` ganha a prova na parte "Provas", e ela passa a ser construída,
  publicada e corrigida pelo backend como qualquer outra.
- O placar do ciclo sobe de 412 para **424** exercícios.
- **Risco aceito:** uma prova publicada é uma prova que o aluno pode ler antes da aula.
  É o preço de o livro ser aberto, e o autor sabe disso ao aplicar.

## Achado de brinde

Ao escrever a prova, o especialista de exercícios encontrou um erro no corpo do III.1:
o capítulo dizia três vezes que o neurônio artificial é **"treze anos mais velho"** que
o termo "inteligência artificial", enquanto a tabela do mesmo capítulo data o termo em
**31 de agosto de 1955** e o neurônio em **1943**. São **doze**. O "treze" só fecharia
com o workshop de 1956, e não é o que a tabela diz. Corrigido nas três ocorrências.

É a quinta ocorrência desta classe no ciclo: **número escrito à mão ao lado dos dados
que o determinam**. Desta vez quem achou foi alguém escrevendo uma prova — o que sugere
que escrever avaliação é, por si só, uma auditoria do capítulo.
