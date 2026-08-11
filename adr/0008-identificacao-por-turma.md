# ADR 0008 — Identificação por turma: uma exceção estreita ao progresso anônimo

**Data:** 2026-08-11 · **Estado:** aceito

## Contexto

O livro entrou em uso numa disciplina real. O autor perguntou o que a v1.0 não respondia:

> *"Vou precisar controlar a evolução dos alunos para dar pontos, como vou fazer?"*

Na v1.0, **não fazia.** A sessão é um UUID gerado no navegador e guardado em `localStorage` (`publicar/tema/companion.js:19`): sem login, sem matrícula, sem turma. O `/progresso` mostra o progresso ao próprio leitor; o `/telemetry` de admin devolve **agregados do livro inteiro** — ótimo para descobrir que um exercício está mal escrito, inútil para atribuir prática a uma pessoa.

E isso não era omissão: o projeto declara que **o progresso do leitor é anônimo e apagável**. Identificar pessoas é mudança de política de privacidade, não ajuste técnico — daí este ADR existir antes do código.

A tensão é real e não se resolve escolhendo um lado:

| De um lado | Do outro |
|---|---|
| O anonimato é uma promessa feita a **todo** leitor, e a maioria não é aluno de ninguém | Um professor que usa o livro na disciplina precisa saber quem praticou |
| Rastrear por padrão trairia quem chegou pelo Google | Sem nenhum caminho, a alternativa real é o professor pedir *print* de tela — autodeclaração fantasiada de evidência |

## Decisão

**O anonimato continua sendo o padrão. A identificação é uma exceção que o próprio aluno ativa, digitando um comando no chat.**

```
/turma AP2026-2 123456      identifica
/turma                      explica o que muda, sem identificar
/turma sair                 desfaz
```

Quatro restrições, e cada uma existe por um motivo específico:

**1. Quem digita é o aluno.** Não há login, cookie de identidade nem detecção. Enquanto ninguém digitar, nada muda — e é isso que mantém a promessa de pé para os outros leitores. Foi também o que o autor pediu: *"o aluno coloca no chat a info"*.

**2. O comando é código, não prompt.** Interpretado em `turma.py` e despachado **antes** do modelo, nas duas rotas (`/chat` e `/chat/stream` — o widget usa a segunda). Três consequências: um LLM não decide quem é aluno de quem; a identificação funciona com a chave do modelo fora do ar; e a resposta é sempre a mesma, palavra por palavra. Um teste cobra isto quebrando o `run_turn` de propósito.

**3. A resposta diz o que passa a acontecer, antes de qualquer dado ser exposto** — o que o professor vai ver (exercícios resolvidos, tentativas), o que ele **não** vai ver (a conversa com o tutor, o texto das respostas) e como desfazer.

**4. O professor vê resultado, nunca conteúdo.** `GET /turma/{turma}` (JSON ou CSV) exige o `ADMIN_TOKEN` e devolve, por aluno: resolvidos, tentados, tentativas, acertos de primeira, capítulos, vídeos. **Um teste procura o texto de uma resposta e a frase de uma conversa dentro da saída e falha se achar** — porque promessa que o código não cumpre não é política, é mentira.

Agrega-se **por aluno, não por sessão**: a mesma pessoa abre o livro no laboratório e no celular, e são duas sessões anônimas distintas. Contar por sessão a partiria em duas linhas pela metade.

E aluno identificado que ainda não tentou nada **aparece zerado**, via `LEFT JOIN`. Ausente da lista é dúvida ("ela não fez ou não se identificou?"); zerado é informação.

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| **Login de verdade** (e-mail e senha, ou OAuth da instituição) | Resolve mais do que o problema e cria o que o projeto recusa: cadastro, senha para vazar, cadeia de responsabilidade sobre identidade. O livro não é um LMS |
| **Campo de matrícula no widget**, fora do chat | Equivalente em função e pior em consentimento: um campo em formulário é preenchido no automático. Digitar um comando é um ato deliberado — e foi o que o autor pediu |
| **Nada; nota só pelo trabalho entregue** | Foi a recomendação para *hoje*, e continua válida como política pedagógica. Mas deixa o professor sem sinal nenhum sobre quem praticou, que era exatamente a pergunta |
| **Deixar o modelo interpretar** "sou da turma X, matrícula Y" | Falha silenciosa e não determinística: o LLM responderia algo plausível sobre turmas sem identificar ninguém, e cairia junto com a chave da NVIDIA |
| **O professor ver as respostas dos alunos** | Seria útil para corrigir aberta. Mas quebra a frase que o aluno leu ao se identificar. Se um dia for preciso, muda-se **a frase primeiro**, e depois o código |

## Consequências

**A favor:**

- O professor consegue atribuir prática a pessoas, com um CSV que entra na planilha de notas.
- Quem não é aluno não perde nada — o padrão não mudou.
- Funciona hoje, sem infraestrutura nova: usa o Postgres que já está no ar.

**Contra, e assumido:**

- **A identificação é declarada, não verificada.** Um aluno pode digitar a matrícula de outro. Não há como resolver isso sem login, e login é o que este ADR recusa. **A consequência prática: o dado serve para acompanhar prática, não para lançar nota diretamente.** Quem transformar isso em nota sem outra evidência está confiando numa afirmação não verificada — e é o professor quem decide esse risco, sabendo dele.
- **O vínculo vive na sessão do navegador.** Limpar o `localStorage` faz o aluno perder o vínculo — ele redigita o comando, e as duas sessões passam a somar sob o mesmo nome.
- **Uma tabela a mais** (`identificacoes`), com `ON DELETE CASCADE` na sessão: apagar a sessão apaga o vínculo. Sem isso, "apagar tudo" deixaria o nome para trás — que é a pior falha possível numa funcionalidade de privacidade.

## O que fica registrado como dívida

- **A UI não mostra o vínculo.** O aluno se identifica pelo chat e não vê em lugar nenhum, fora dali, que está identificado. Estado invisível ao usuário é exatamente o defeito que o selo de nível teve na v1.0 — e a lição registrada lá foi que **gate que confere a entrada não prova nada sobre a saída**. O endpoint `GET /identificacao` já existe para o widget consumir; falta o widget.
- **Não há painel para o professor**, só JSON e CSV por URL com token.
- **Não há prazo de retenção.** O vínculo dura até o aluno desfazer.
