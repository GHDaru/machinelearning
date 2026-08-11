# `publicar/` — o motor do livro

Markdown (`livro/`) → site HTML navegável (`docs/`). App próprio, não framework: `markdown-it` é usado como biblioteca de parsing; navegação, tema, callouts, exercícios e vídeos são nossos.

## Comandos

```bash
npm install
npm run build       # gera o banco de exercícios E o site
npm run verificar   # só valida o banco (é o gate da CI); não escreve nada
```

## Os arquivos

| Arquivo | O que faz |
|---|---|
| `build.mjs` | Markdown → HTML: navegação, callouts, siglas, hero de capítulo, gate de links |
| `interativos.mjs` | **Fonte única** da sintaxe de exercícios e vídeos. Dois recortes: com e sem gabarito |
| `exercicios.mjs` | Extrai o banco para o backend e **valida** (gabarito, feedback, objetivo, ids únicos) |
| `grafo.mjs` | Knowledge graph do livro, derivado do conteúdo a cada build |
| `sumario.json` | A estrutura do livro: partes, capítulos, teasers, URL do backend |
| `tema/` | CSS, JS e imagens servidos como assets |
| `gerar-capa.py` | Regera `tema/capa.png` e `tema/capa-social.png` — PNG puro, sem dependência |

## Os dois recortes do mesmo bloco

Essa é a ideia central do motor:

```
:::exercicio no Markdown
        │
        ├── build.mjs ──────► HTML da página: enunciado + alternativas
        │                      SEM marcação de correta, SEM feedback
        │
        └── exercicios.mjs ─► banco.json: tudo, inclusive gabarito e rubrica
                               (só o backend lê)
```

Um só parser garante que os dois não divergem. Se houvesse dois, a divergência seria questão de tempo — e o sintoma seria a página mostrar um exercício que o backend corrige por outro gabarito.

## Gates

O build **falha** (não avisa) quando:

- há link interno `.html` apontando para página inexistente;
- um exercício está sem `id`, `tipo`, `objetivo`, enunciado ou `porque`;
- o `objetivo` citado não existe entre os declarados no capítulo;
- múltipla escolha não tem exatamente uma correta;
- há id de exercício ou vídeo duplicado;
- um vídeo está sem `ref`, sem `autor` ou sem justificativa.

Exercício quebrado é pior que exercício nenhum: ele ensina errado com a autoridade do livro.

## Convenções reconhecidas no Markdown

| Convenção | Efeito |
|---|---|
| 1º blockquote `**Estado da arte capturado em ...**` | vira o selo de data do livro vivo |
| `## Objetivos de aprendizagem` / `## Verificação` / `## Pratique` / `## Assista` | vira callout com cor própria |
| `:::exercicio` / `:::video` | vira UI interativa (ignorados dentro de cercas de código) |
| Link para `.md` publicado | reescrito para `.html`; o resto aponta para o GitHub |
| `<div data-viz="uso-livro">` | ilha viva preenchida em runtime |

## Regerar a capa

```bash
python3 publicar/gerar-capa.py
```

Desenha o que o livro é: duas classes de pontos, a fronteira de decisão que as
separa, e — de propósito — os ~9% de pontos do lado errado. O erro irredutível
é parte da tese do capítulo 01, então ele aparece na capa.

O script vive aqui, e não em `tema/`, porque `tema/` é o que vai para o site:
ferramenta de autoria não é asset publicado. Os PNGs gerados são versionados;
rode isto só quando a identidade visual mudar.

## Publicação (GitHub Pages) — e a armadilha que já nos pegou

O deploy é `.github/workflows/publicar.yml`: o job `build` gera `docs/` e sobe o
artefato; o job `deploy` publica. Só há **uma** etapa manual, feita uma vez:
`Settings → Pages → Source: GitHub Actions`.

**Se o `deploy` falhar em ~2 segundos, sem executar nenhum passo e sem log**, não
procure erro no build: ele passou. Esse sintoma significa que o job nunca chegou
a um runner — foi barrado no portão do ambiente `github-pages`.

Duas causas, em ordem de probabilidade:

1. **Política de branches do ambiente.** O GitHub cria o ambiente `github-pages`
   com uma regra de branches permitidas, derivada da configuração do Pages no
   momento em que ele foi habilitado. Se o Pages foi habilitado quando outra
   branch era a default, a regra recusa `main`. Conferir em
   `Settings → Environments → github-pages → Deployment branches`.
2. **Source errada.** `Settings → Pages` ainda em "Deploy from a branch".
   Sintoma auxiliar: nesse caso o passo `configure-pages` costuma falhar já no
   `build` — se ele passou, a causa provavelmente é a (1).

Depois de ajustar, `Re-run failed jobs` reaproveita o artefato que já subiu; não
é preciso commit novo.

**Por que o push que cria uma branch não dispara o deploy:** o workflow tem
filtro de `paths`, e num push de criação de branch o GitHub não avalia esse
filtro — nada conta como modificado. Use `Run workflow` (o `workflow_dispatch`
está declarado) ou o primeiro push seguinte que toque `livro/`, `publicar/` ou
`ml-zero/`.

---

## Por que o `vercel.json` é assim

O arquivo não tem comentários porque **a Vercel valida o schema e recusa
qualquer chave desconhecida** — inclusive uma chave `_comentario`. Descoberto na
tela de importação do projeto, com o erro *"Invalid request: should NOT have
additional property `_comentario_raiz`"*. O Railway, no `railway.json`, aceita e
ignora; a Vercel não. A explicação de cada campo mora aqui.

| Campo | Por quê |
|---|---|
| `framework: null` | Não é Next, não é Astro. O motor é o `build.mjs` deste diretório |
| `installCommand` / `buildCommand` com `cd publicar` | **O Root Directory do projeto na Vercel é a RAIZ do repositório**, não `publicar/`. O `build.mjs` lê `.specify/memory/constitution.md` (o alfabeto de selos do Princípio X) e `livro/`; o `exercicios.mjs` lê `livro/`. Rodando de dentro de `publicar/`, os dois quebrariam |
| `outputDirectory: docs` | Onde o motor escreve o site — o mesmo diretório que o GitHub Pages publica |
| `cleanUrls: false` | Mantém paridade 1:1 com as URLs do Pages (`…/18-neuronio-artificial.html`). É o que faz o stub de redirecionamento do endereço antigo funcionar **sem mapa de rotas** |
| `git.deploymentEnabled.main: false` | A Vercel **não** publica produção sozinha. Quem promove é o `.github/workflows/publicar.yml`, depois dos testes do `ml-zero`, do gate de exercícios e do build. Sem isto, o site iria ao ar com os testes vermelhos e o Princípio IX viraria decoração. **Previews de branch continuam automáticos — é o motivo de estarmos na Vercel** (ADR 0006) |
| `headers` | Cache imutável para `assets/` (o nome já carrega hash), e dois cabeçalhos de segurança que o GitHub Pages não permitia declarar |
