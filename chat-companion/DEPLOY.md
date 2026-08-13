# Publicar o livro vivo

> Front na **Vercel**, backend na **Railway**, banco no **Neon**, domínio **`machinelearning.ghdaru.com.br`**.
> As decisões e as alternativas descartadas estão no [ADR 0006](../adr/0006-publicacao-vercel-railway-dominio.md). Este documento é o passo a passo.
>
> Baseado no [guia do livro de Engenharia de Harness](https://github.com/GHDaru/harness_engineering/blob/main/chat-companion/README.md), com **duas divergências deliberadas**, marcadas ⚠ onde aparecem.

## A ordem importa

Cada passo depende do anterior, e o **último é irreversível para quem tem link antigo**. Não pule.

```
1. Neon (banco)  →  2. Chave do modelo  →  3. Railway (backend)
                                                   ↓
                                          4. DNS da API
                                                   ↓
                          5. Vercel (front)  →  6. DNS do site
                                                   ↓
                                          7. Smoke test
                                                   ↓
                                 8. Stub no Pages  ← só agora
```

**Por quê nesta ordem:** o site novo sem a API é um livro sem correção de exercícios; a API sem CORS para o domínio novo quebra **em silêncio** (o widget diz "não deu para corrigir agora" e os laboratórios continuam funcionando, mascarando a falha). O stub no Pages vai por último porque, feito antes, deixa o livro sem nenhum endereço no ar.

> **Nada quebra enquanto você não terminar.** Durante toda a migração o workflow publica **nos dois destinos**: o GitHub Pages continua servindo o livro normalmente, e o passo da Vercel é **pulado** — em verde, com um aviso — enquanto o segredo `VERCEL_TOKEN` não existir. Você pode parar no meio de qualquer passo e voltar depois.

---

## 1 · Banco no Neon (Postgres)

1. Conta em **[neon.tech](https://neon.tech)** → **New Project**, região mais próxima.
2. **Connection Details** → copie a *connection string* (`postgresql://…?sslmode=require`).

Guarde: será `DATABASE_URL`. As tabelas são criadas sozinhas na primeira subida.

> Sem `DATABASE_URL` o backend sobe em memória — o progresso do leitor some a cada reinício. Para uma turma, use o banco.

## 2 · Chave do modelo (NVIDIA NIM, gratuita)

1. Conta em **[build.nvidia.com](https://build.nvidia.com)**.
2. Escolha um modelo com rótulo **Function Calling** e gere a chave `nvapi-…`.

Guarde: será `OPENAI_API_KEY`.

> Sem chave, o adapter cai em `echo`. **A correção dos 91 exercícios funciona mesmo assim** — ela é determinística e não usa modelo. O que fica sem chave é o tutor e a avaliação de resposta aberta.

## 3 · Backend na Railway

1. **[railway.app](https://railway.app)** → **New Project → Deploy from GitHub repo** → `GHDaru/machinelearning`.
2. ⚠ **Settings → Root Directory: deixe a RAIZ do repositório** (vazio), **não** `chat-companion/backend`.
   *Divergência do guia do harness, e a razão está no ADR 0006:* com a raiz na pasta do backend, o container não teria `livro/`, e a busca do tutor dependeria de um `corpus.json` de 815 KB versionado e regenerado a cada edição — que, esquecido, degrada a busca **sem avisar**. Com a raiz no repositório, o índice é construído ao vivo.

   Não preencha build nem start command à mão: o [`railway.json`](../railway.json) da raiz aponta para o [`Dockerfile`](../Dockerfile), que traz os dois. **Se o painel oferecer Nixpacks, não aceite** — o build aqui é declarado, não detectado, e o [ADR 0007](../adr/0007-builder-declarado-na-railway.md) diz por quê: a raiz tem `package.json` (que existe só para a Vercel) e nenhum marcador de Python no topo, então deixar a ferramenta adivinhar a linguagem é apostar num `pip: command not found` no meio deste passo.
3. **Variables:**

   | Variável | Valor |
   |---|---|
   | `LLM_ADAPTER` | `openai` |
   | `OPENAI_BASE_URL` | `https://integrate.api.nvidia.com/v1` |
   | `OPENAI_API_KEY` | sua chave `nvapi-…` |
   | `LLM_MODEL` | o identificador do modelo escolhido no passo 2 (ex.: `nvidia/nemotron-3-ultra-550b-a55b`) |
   | `DATABASE_URL` | a string do Neon — a do botão **Copy**, com a senha real |
   | `ALLOWED_ORIGINS` | `https://machinelearning.ghdaru.com.br,https://ghdaru.github.io` |
   | `ADMIN_TOKEN` | um segredo seu, para `/telemetry` e `/suggestions` |

   **Mantenha `https://ghdaru.github.io` na lista até o passo 8.** Enquanto o stub não subir, é de lá que os leitores com link antigo chegam.

4. **Settings → Networking → Custom Domain** → informe `api.machinelearning.ghdaru.com.br`. O Railway devolve um alvo CNAME — guarde.
5. Confira a URL provisória: `SEU-APP.up.railway.app/health` deve responder `{"ok": true, "store": "postgres"}`.

## 4 · DNS da API

O DNS de `ghdaru.com.br` está na **Cloudflare**. O Railway pede **dois** registros, não um:

| Nome | Tipo | Valor | Proxy |
|---|---|---|---|
| `api.machinelearning` | CNAME | o alvo `*.up.railway.app` que o Railway mostrou | ☁️ **DNS only** (cinza) |
| `_railway-verify.api.machinelearning` | TXT | `railway-verify=…` (o valor que o Railway mostrou) | — |

O TXT é a prova de posse do subdomínio: sem ele o Railway não emite o certificado, e o domínio fica travado em *pending* para sempre.

> ⚠ **A nuvem tem de ficar CINZA.** Com o proxy ligado (laranja), quem responde no `api.…` é a Cloudflare, não o Railway: a verificação de posse falha, porque o Railway consulta o registro e encontra IP de proxy em vez do alvo dele. E, mesmo depois de verificado, o TLS passa a ser terminado duas vezes — o que, com o modo SSL em *Flexible*, produz laço de redirecionamento. É a mesma razão pela qual o site (passo 6) também vai cinza.

> **Por que a API tem subdomínio próprio.** O campo `companion_backend` do `publicar/sumario.json` é **compilado dentro do HTML de todas as páginas**. Apontar para `*.up.railway.app` significa que trocar de provedor obrigaria a **reconstruir e republicar o livro inteiro**. Com subdomínio próprio, o livro nunca carrega o nome de um fornecedor.

Confira, nesta ordem — o segundo é o que importa:

```bash
# 1. o nome resolve e aponta para o Railway (não para a Cloudflare)
getent hosts api.machinelearning.ghdaru.com.br

# 2. a API responde por ele, com certificado válido
curl -fsS https://api.machinelearning.ghdaru.com.br/health
```

## 5 · Front na Vercel

1. **[vercel.com](https://vercel.com)** → **Add New → Project** → importe `GHDaru/machinelearning`.
2. **Root Directory: a raiz do repositório.** Não `publicar/` — o motor lê `.specify/memory/constitution.md` e `livro/`, que estão acima dela.
3. Não preencha build nem output à mão: o [`vercel.json`](../vercel.json) já traz tudo.
4. Deixe a primeira build rodar e confira a URL `*.vercel.app`.

### Os três segredos do GitHub

O deploy de **produção** não sai da Vercel: sai do workflow, depois dos testes (ADR 0006). Em **Settings → Secrets and variables → Actions** do repositório:

| Secret | Onde achar |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel → Project Settings → General |
| `VERCEL_PROJECT_ID` | idem |

## 6 · DNS do site

| Nome | Tipo | Valor |
|---|---|---|
| `machinelearning` | CNAME | `cname.vercel-dns.com.` |

Na Vercel, **Project → Domains** → adicione `machinelearning.ghdaru.com.br` e marque como **Primary**. Configure o domínio `*.vercel.app` de produção como **Redirect** para ele — senão a duplicidade de conteúdo só troca de endereço.

> Se o DNS estiver no Cloudflare, **desligue o proxy** (nuvem cinza) nesses dois registros.

## 7 · Smoke test

O workflow faz isto sozinho e **falha o deploy** se algo não responder. Para conferir à mão:

```bash
curl -fsS https://api.machinelearning.ghdaru.com.br/health

curl -fsS -X OPTIONS https://api.machinelearning.ghdaru.com.br/health \
  -H "Origin: https://machinelearning.ghdaru.com.br" \
  -H "Access-Control-Request-Method: GET" -D- -o /dev/null \
  | grep -i access-control-allow-origin
```

A segunda linha **precisa** devolver o cabeçalho. Sem ele, o chat e a correção estão quebrados — e você não veria pela tela, porque os laboratórios continuam funcionando.

Depois, no site: abra um capítulo, responda um exercício **errado** de propósito. Deve aparecer *"Ainda não. Releia a seção indicada e tente outra vez"*. Erre de novo: vem a explicação completa. **Se isso acontecer, está tudo de pé** — a revelação progressiva é a parte que só o servidor faz.

## 8 · Aposentar o endereço antigo — por último

Só quando os passos 1–7 estiverem verdes.

**Actions → "Redirecionar o GitHub Pages para o domínio próprio" → Run workflow**, digitando `SIM` no campo de confirmação.

O antigo endereço passa a servir um stub que redireciona **preservando o caminho** (`/machinelearning/iii-1-neuronio-artificial.html` cai no capítulo III.1 do domínio novo), com `canonical` e `noindex`.

> **Link antigo com numeração antiga dá dois saltos — e chega.** `/machinelearning/18-neuronio-artificial.html` vai parar em `machinelearning.ghdaru.com.br/18-neuronio-artificial.html`, que é um dos 29 redirecionamentos do ADR 0011, e de lá em `iii-1-neuronio-artificial.html`. A âncora sobrevive aos dois saltos.
>
> Isso **só funciona porque os redirecionamentos subiram antes deste passo**. Sem eles, o stub entregaria o leitor num 404 do domínio novo — pior do que o 404 de onde ele veio, porque agora com a aparência de que o livro sumiu.

Depois disso, remova `https://ghdaru.github.io` de `ALLOWED_ORIGINS` no Railway. **Só depois**: enquanto o Pages ainda servir o livro, é de lá que parte dos leitores chama a API, e tirar a origem antes derruba a correção de exercício **em silêncio** — o widget diz "não deu para corrigir agora" e os laboratórios continuam funcionando, mascarando a falha.

---

## O que fazer quando algo quebra

| Sintoma | Causa provável |
|---|---|
| Exercício diz "não deu para corrigir agora" | CORS: `ALLOWED_ORIGINS` no Railway não tem o domínio do site |
| Chat responde como eco | Sem `OPENAI_API_KEY`, ou `LLM_ADAPTER` diferente de `openai` |
| Progresso some a cada visita | Sem `DATABASE_URL` — está em memória |
| Exercício "não encontrado" | `banco.json` derivou. O gate do CI pega isso; se passou, rode `node publicar/exercicios.mjs` e comite |
| Preview da Vercel sem chat | Esperado se `ALLOWED_ORIGIN_REGEX` não casar com a URL. Ajuste a variável no Railway |
| Deploy verde e site velho | A Vercel não publica do `main` de propósito. Quem promove é o workflow |
| Build da Railway falha com `pip: command not found` | O serviço está usando Nixpacks em vez do `Dockerfile`. Confira **Settings → Build** e o `railway.json` da raiz (ADR 0007) |
| `/health` responde `"store": "memory"` | O `DATABASE_URL` não chegou. Causa mais comum: foi colada a string com a senha mascarada (`******`), em vez da do botão **Copy** |

**Nenhuma credencial entra no repositório** (Princípio V). Se uma chave vazar, revogue-a no painel de origem antes de qualquer outra coisa.
