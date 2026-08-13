# Apêndice — Uso do livro

> Como este livro mede a si mesmo, o que ele coleta, o que ele **não** coleta, e como você apaga tudo.

## O que é coletado

| Dado | Quando | Para quê |
|---|---|---|
| Página visitada (o *slug*) | só **depois** do seu consentimento explícito | saber quais capítulos são lidos e quais são abandonados |
| Tentativa de exercício (qual exercício, qual resposta, se acertou) | ao clicar em "Responder" | **o sinal mais valioso do projeto** — ver abaixo |
| Vídeo marcado como assistido | ao marcar a caixa | montar seu progresso |
| Conversas com o tutor | ao usar o chat | manter o fio da conversa e melhorar o livro |
| Objetivo declarado ("quero aprender X para Y") | se você escrever um | o tutor conectar as respostas ao seu objetivo |

## O que **não** é coletado

- **Nenhum cadastro.** Sem nome, sem email, sem senha, sem login social.
- **Nenhum identificador pessoal.** Sua identidade aqui é um número aleatório que o **seu navegador** gerou e guardou localmente. Ninguém, inclusive o autor, consegue ligá-lo a uma pessoa.
- **Nenhum rastreador de terceiros.** Não há analytics externo, pixel, nem cookie de publicidade. Os vídeos só contatam o servidor de origem **depois** de você clicar em "Carregar o vídeo".

## Por que as tentativas de exercício importam tanto

Quando muita gente erra o mesmo exercício, a hipótese padrão deste projeto **não** é que os leitores são fracos: é que **o texto está mal escrito**.

Um exercício com taxa de acerto baixa e volume relevante entra automaticamente na fila de revisão do capítulo (Guia Editorial §10). É o mecanismo mais direto que este livro tem de melhorar com o uso — e é a razão de a correção acontecer no servidor, e não na sua página.

A projeção pública abaixo mostra os agregados. Sem sessões, sem horários, sem respostas individuais.

<div data-viz="uso-livro"></div>

> Se o quadro acima estiver vazio, o backend do livro vivo não está configurado nesta publicação — o site funciona como livro estático, e nada é coletado.

## A exceção: identificação por turma

Tudo acima descreve o padrão, e o padrão é o anonimato. Há **uma** forma de deixar de ser anônimo, e ela depende de você digitar um comando:

```
/turma AP2026-2 123456
```

Se a sua disciplina usa este livro para acompanhar prática, esse comando associa **esta sessão** ao código da turma e à sua matrícula. A partir daí, **o professor daquela turma** passa a ver:

| Ele vê | Ele **não** vê |
|---|---|
| quais exercícios você resolveu | o texto das suas respostas |
| quantas tentativas levou em cada um | suas conversas com o tutor |
| quantos acertou de primeira | o que você leu, e quando |

Digite `/turma` sozinho para ler isso dentro do próprio chat antes de decidir, e `/turma sair` para desfazer a qualquer momento. Enquanto você não digitar, **nada muda** — quem chegou aqui pelo Google continua anônimo.

Duas coisas ditas com todas as letras:

- **A identificação é declarada, não verificada.** Não há login: você digita a matrícula que quiser. Isso é deliberado (o preço de não exigir cadastro) e é a razão de este mecanismo servir para *acompanhar prática*, não para lançar nota sozinho.
- **Apagar a sessão apaga também o vínculo.** Não fica nome para trás.

O desenho, as alternativas recusadas e as dívidas estão no [ADR 0008](../adr/0008-identificacao-por-turma.md).

## Como apagar tudo

Uma ação, sem formulário e sem justificativa: **abra o companion (💬) → "Apagar meus dados"**.

Isso remove, na mesma operação: suas conversas, suas tentativas de exercício, seus vídeos marcados e seu objetivo declarado. Tecnicamente é um `DELETE /session/{id}`, e o banco apaga em cascata — não há cópia guardada "para estatística".

O agregado público já contabilizado não é revertido, porque ele não contém nada seu: é uma contagem por página, sem vínculo com sessão alguma.

## Onde isso está no código

| O quê | Onde |
|---|---|
| Coleta e consentimento | [`chat-companion/backend/app.py`](../chat-companion/backend/app.py) |
| Persistência e apagamento em cascata | [`chat-companion/backend/store.py`](../chat-companion/backend/store.py) |
| Projeção pública (o que sai daqui) | rota `GET /telemetry/publico` |

A regra que o código obedece está no Princípio V da [constituição](../.specify/memory/constitution.md): o progresso é do leitor — anônimo, exportável, apagável.
