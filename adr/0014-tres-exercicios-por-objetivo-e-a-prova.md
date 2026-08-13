# ADR 0014 — "Tópico" é o objetivo de aprendizagem; a prova é por parte e 100% determinística

**Data:** 2026-08-13 · **Estado:** aceito · **Comitê:** psicometria, professor com turma em curso, arquitetura e custo

## Contexto

O pedido do autor foi *"3 exercícios para cada tópico e uma prova ao final"*. Duas palavras precisavam de definição antes de virar 200 exercícios: **tópico** e **prova**.

## Decisão 1 — tópico é o objetivo de aprendizagem

Não a seção. Três razões, e a terceira encerra:

- Backward Design já é a lei do projeto: objetivos, depois evidências, depois conteúdo. Exercício se projeta do objetivo.
- A seção `##` é prosa: o título muda a cada revisão e não tem identificador estável. Um gate sobre ela quebraria em toda edição. O objetivo tem `O1..On`, já validado no build.
- **A premissa de que seção daria um livro muito maior está errada, e foi medida.** Dos 256 cabeçalhos `##`, cerca de 157 são esqueleto (Objetivos, O problema, De onde isto veio, Fundamentos, Síntese, Verificação). Sobram ~99 seções de conteúdo. As duas leituras dão tamanho parecido, e só uma tem chave estável. Não havia troca a fazer.

**A conta: 114 objetivos × 3 = 342 exercícios.** Hoje são 122, então faltam 220.

## Decisão 2 — o trio é uma escada, e o teto é o verbo declarado

Três exercícios iguais são repetição, não prática. O trio sobe:

| | Nível | Tipo típico |
|---|---|---|
| E1 | dois degraus abaixo do verbo do objetivo | `multipla`, `completar` |
| E2 | um degrau abaixo | `numerica`, `completar` |
| E3 | **exatamente o verbo declarado** | o que a evidência exigir |

A regra que sustenta o resto: **o teto do trio é o verbo do objetivo, nunca acima.** Objetivo que diz "Aplicar" gera trio que termina em Aplicar, e nenhuma `aberta`.

Isso resolve dois problemas de uma vez. Trava a inflação de verbo que a auditoria de Bloom já mediu, e **contém o custo**: só objetivos de Avaliar e Criar puxam resposta aberta.

**Teto de custo: no máximo 1 `aberta` por objetivo.** Hoje 38% do banco é aberta; manter essa proporção em 342 levaria a ~133 abertas, cerca de 240 chamadas de modelo por aluno por semestre, recorrente a cada turma. O teto segura em torno de 60.

Uma exigência que gate nenhum verifica, e que vale escrever: **os três usam contextos diferentes**. O mesmo conjunto de dados com números trocados é repetição disfarçada de transferência.

## Decisão 3 — a prova é por parte, cruzada, e sem nenhuma resposta aberta

Seis provas de parte (Abertura, I, II, III, IV, V) mais uma final cumulativa. A prova de capítulo foi recusada porque a seção `Verificação`, depois do [ADR 0012](0012-verificacao-como-superficie-corrigida.md), já ocupa esse lugar; e uma prova só no fim do livro ninguém alcança, porque nenhuma disciplina usa os 29 capítulos.

O que distingue prova de "mais exercícios" é mecânico, não retórico:

1. **Item cruzado obrigatório**: cada item declara objetivos de dois capítulos ou mais. Nenhum exercício de capítulo faz isso, e é a distinção real.
2. **Sem `volte para`**: a prova mede recuperação sem rota de volta.
3. **Contexto inédito**: cenário que não aparece em capítulo nenhum.
4. **Marcada por atributo** `secao: "prova"`, como o ADR 0012 fez com `verificacao`. Atributo, não tipo de bloco novo.

### A prova não chama o modelo, e essa é a decisão que protege o serviço

**Todos os itens de prova são determinísticos** — `multipla`, `multipla-multi`, `numerica`, `completar`. Nenhuma `aberta`.

A razão é operacional e foi verificada no código. `post_tentativa` é um endpoint **síncrono** (`app.py:230`), e `store.py:220` abre uma **conexão nova ao Postgres a cada chamada**, sem pool. A carga hoje é difusa, então isso não aparece. Uma prova é um evento sincronizado: quarenta alunos ao mesmo tempo prendem quarenta threads do pool do Starlette esperando o modelo, e abrem mais de cem conexões contra um Postgres gerenciado. O backend cai, e leva o tutor junto.

Prova determinística corrige em memória, não chama modelo, e o pico vira apenas escrita no banco.

## Decisão 4 — a prova não vale nota, e o livro vai dizer isso

Com identificação autodeclarada ([ADR 0008](0008-identificacao-por-turma.md)), livro aberto e enunciado publicado no Markdown, o que existe é **evidência de prática, não de aprendizado**. Vender isso como avaliação somativa seria a mentira que o ADR 0008 já recusou.

O uso recomendado pelo professor do comitê, e que o livro vai documentar: pontuar **por ter feito, nunca por ter acertado**. Pontuar esforço remove o incentivo de colar; pontuar acerto o cria.

## Ordem de construção

O comitê convergiu em fasear, e a ordem importa mais que a velocidade:

1. Estender o gate: `≥3 por objetivo`, escada declarada, teto de 1 `aberta`. **Antes** de escrever, ou os 220 são reescritos depois.
2. Auditar os 114 verbos. Escrever exercício contra verbo inflado assa o erro no banco.
3. Especificar as provas cedo, executá-las por último — senão viram colheita do que já existe.
4. Dentro do trio, escrever **E3 primeiro**, depois E2 e E1. Começar pelo E1 produz "o que foi fácil de perguntar".
5. Piloto de uma parte antes de escalar.

## O risco que nenhum gate pega

**O gate confere contagem, não qualidade.** 342 itens deixam o build verde enquanto o livro piora. O que degrada primeiro, nesta ordem: os distratores (o caro de uma múltipla são as alternativas erradas), depois o `porque`, que passa a nomear a resposta em vez de ensinar, depois as rubricas.

E o professor do comitê trouxe o dado que mais desconforta: numa turma real o aluno faz um ou dois exercícios por capítulo, e faz os primeiros. **O retorno marginal de escrever o terceiro é baixo, e o custo de curadoria é alto.** A decisão de escrever 342 é do autor e está sendo executada; fica registrado que o comitê considera o E3 o item de maior valor do trio, e que a ordem de escrita acima existe por causa disso.

## Consequências

O placar da capa vai saltar de 122 para 342 sem que o livro tenha ficado três vezes melhor, e o CHANGELOG precisa dizer isso a cada lote.

Duas coisas quebram por diluição e entram como dívida: o **ranking de exercícios difíceis** (corte de 5 tentativas, que com o banco 3× maior quase nada cruza, e o sinal *taxa baixa = texto mal escrito* morre) e a **barra de progresso do capítulo**, que só fecha em 100% e passa a ser inatingível com 12 itens por capítulo.

O denominador do CSV da turma muda no meio do semestre quando o livro cresce: o aluno que tinha 60 de 122 passa a ter 60 de 342 da noite para o dia. Precisa ser congelado por turma.
