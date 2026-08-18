# ADR 0021 — O quadro da turma, e o que "só abre para o admin" pode significar

- **Estado:** aceito
- **Data:** 2026-08-18
- **Decisores:** autor + comitê de três (autenticação, a página, escrita de notas)
- **Relacionado a:** ADR 0006 (domínios e CORS), ADR 0008 (identificação opt-in), ADR 0020 (avaliação com nota)

## Contexto

O pedido: *"Crie no próprio livro um frontend para consumir estes dados e permitir eu
administrar as notas. Ela só abre a hora que se conectar com o email/usuário admin em
variável de ambiente no servidor."*

## A premissa que não dá para atender, e a que a substitui

**Uma página estática não "abre só para o admin".** O livro é publicado como arquivo; o
HTML e o JavaScript são baixáveis por qualquer um que digite o endereço. Não há servidor
renderizando a página para decidir quem a vê.

O que se entrega no lugar, e é mais forte:

> Nenhum dado de aluno — nome, matrícula, turma, tentativa, nota — atravessa a fronteira
> do servidor sem credencial verificada **no servidor, a cada requisição**. A página sem
> credencial é uma casca.

É mais forte porque não depende de ninguém desconhecer a URL. `docs/turma.html` tem **2.896
bytes**: um título e uma `<div>` vazia. Uma página de capítulo tem oitenta mil.

## Decisões

**1. Usuário e senha em variável de ambiente, com token de sessão assinado.**

`ADMIN_USER` e `ADMIN_PASSWORD` no ambiente do servidor. Guardar só o e-mail não
autenticaria ninguém: e-mail não é segredo, qualquer um digita o do professor. O que
autentica é a senha.

`POST /admin/login` devolve um token **assinado com HMAC-SHA256 e sem estado no servidor**,
com validade de 12 horas. Uma tabela de sessões em memória deslogaria o professor toda vez
que a `main` recebesse um push, porque o Railway reinicia o processo — e isso aconteceria
no meio da aula. Chave de assinatura é o `ADMIN_TOKEN` que já existia; nenhum segredo novo
a guardar, e nenhuma dependência nova (`hmac` e `hashlib` são da biblioteca padrão).

Falha fechada: sem as variáveis, a rota responde 503 e ninguém entra.

**2. `Authorization: Bearer` e `sessionStorage`, não cookie.**

O caminho de manual seria cookie `HttpOnly`, e aqui ele é o **arriscado**. Cookie exige
`allow_credentials=True`, e o `ALLOWED_ORIGIN_REGEX` deste backend casa qualquer
`machinelearning-*.vercel.app` — domínio que **um terceiro pode registrar hoje mesmo**.
Isso é inofensivo enquanto `allow_credentials=False`, e o ADR 0006 escreveu essa frase como
observação; ela é uma **precondição**. Ligar credenciais para "fazer o login funcionar"
revogaria a proteção sem que ninguém percebesse.

Com Bearer em header, um site atacante não consegue anexar a credencial nem ler a resposta,
e CSRF deixa de ser uma classe de bug a considerar. `sessionStorage` e não `localStorage`
porque a credencial deve morrer quando a aba fecha — o painel será aberto em máquina de
laboratório e de sala de aula.

**3. Uma porta só, no lugar de três cópias.**

`_exigir_admin()` substitui três repetições divergentes da mesma linha em `/turma`,
`/telemetry` e `/suggestions`. Ela aceita o token de sessão, o `ADMIN_TOKEN` mestre no
header, e — por compatibilidade, **depreciado** — o `?token=` na query. O vazamento
realista da query aqui não é log de servidor: é o professor projetando a planilha no telão.

**4. A v1 é somente leitura. "Administrar" fica para a v2, e o motivo é auditoria.**

Escrever nota exige rastro de quem, quando e por quê — senão um token vazado deixa de ser
"leram meus dados" e passa a ser "alteraram notas e ninguém sabe quais". O desenho está
decidido (tabela `ajustes` append-only, no grão do item, com `motivo` obrigatório) e entra
depois da frase de consentimento, seguindo a regra que o ADR 0008 fixou: muda-se a frase
primeiro, e o código depois.

Um "editar nota" que grava no navegador seria pior que nada: uma nota que existe numa
máquina só, some com a limpeza de cache e não sobrevive a um recurso de aluno.

**5. Sem recorte de capítulo, `nota` não existe.**

Este ADR corrige um defeito introduzido no ciclo anterior. A nota era calculada com
denominador igual ao que o aluno **tentou** — e aí quem tentou um exercício e acertou
recebe 10,0, enquanto quem fez quatrocentos e acertou 350 recebe 8,1. **Ordenar por essa
coluna inverte o ranking**, e a coluna se chamava "nota".

Agora, sem `?capitulo=N`, `nota` é `None` e o que sobra se chama `acerto_do_que_tentou`. O
dado não se perdeu; ganhou um nome que diz o que ele mede. O painel mostra o aviso e não
oferece a palavra "nota" nesse estado.

**6. Fora do sumário, com `noindex`, e sem link a partir do livro.**

Todo item do sumário entra na barra lateral das 80 páginas. Uma linha "Quadro da turma"
ali convidaria aluno a cutucar a porta e confundiria quem não é da disciplina. Isso é
**higiene, não segurança**: a URL é pública e adivinhável, e quem protege é o token.

## Consequências

Boas: o professor tem quadro ordenável, filtrável por capítulo e exportável em CSV que o
Excel em português abre certo (`;`, vírgula decimal, BOM). A página passa na auditoria de
jornada a 360px e não faz **nenhuma requisição** antes do clique — o que também é requisito
técnico, porque um 403 automático quebraria a auditoria.

Ruins: são duas credenciais a manter no Railway, e a v1 não escreve nada, o que significa
que a autoridade sobre a nota continua no diário do professor. Fica a pendência do `?token=`
na query, que deve virar `false` por padrão no ciclo seguinte e sair no outro.

## Pendências datadas

- Fechar o `?token=` por padrão: **próximo ciclo**. Remover: o seguinte.
- Restringir o `ALLOWED_ORIGIN_REGEX` — hoje é latente, e está a um `allow_credentials=True`
  de ser explorável.
- Pool de conexões (`_conn()` abre uma por chamada), já registrado no ADR 0020.
