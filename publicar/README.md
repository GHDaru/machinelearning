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
