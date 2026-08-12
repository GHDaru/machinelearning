# ADR 0006 — Publicação: front na Vercel, backend na Railway, domínio próprio

**Data:** 2026-08-10 · **Estado:** aceito

## Contexto

O livro está publicado em `https://ghdaru.github.io/machinelearning/` (GitHub Pages) e o backend nunca foi publicado — os 91 exercícios estão dormentes desde a v1.0.

O autor pediu: **backend na Railway, front na Vercel, domínio `machinelearning.ghdaru.com.br`**, seguindo o [guia do livro de Engenharia de Harness](https://github.com/GHDaru/harness_engineering/blob/main/chat-companion/README.md).

O guia cobre Railway + Neon + NVIDIA NIM e serviu de base. **Mas ele publica o front no GitHub Pages**, e o [ADR 0001 do harness](https://github.com/GHDaru/harness_engineering/blob/main/adr/0001-modelo-de-publicacao.md) registra a razão: *"sem mais infra"*, tendo **recusado explicitamente** a alternativa de staging separado. Trocar para a Vercel contraria essa escolha, então ela precisa se justificar.

## Decisão

### 1. Front na Vercel, e o motivo é *preview*, não desempenho

Para HTML estático, Pages e Vercel entregam a mesma coisa: CDN, HTTPS grátis, domínio via CNAME. O que a Vercel acrescenta de concreto é **deployment de preview por branch** — exatamente o custo que o ADR 0001 do harness *aceitou* ("rascunho invisível na web; preview local ou por screenshots") e a alternativa que ele recusou por exigir infra. Na Vercel ela é automática e não se mantém.

Somam-se: rollback instantâneo por deployment, `headers`/`redirects` declarativos (o Pages não tem nenhum dos dois) e build fora dos minutos do Actions. **Não** acrescenta SEO, TLS nem velocidade perceptível — e dizer isso importa, porque é o que quase todo mundo supõe.

Princípio VI (custo zero é requisito): plano Hobby é US$ 0, e o *lock-in* é nulo — a saída é `docs/` estático puro, e voltar ao Pages custa reverter um workflow.

### 2. O Pages continua ligado, servindo um redirecionamento — não o livro

Dois sites com o mesmo conteúdo é conteúdo duplicado de verdade, e o Pages **não faz 301**. Apagar também é ruim: há links antigos em circulação.

Solução: o Pages passa a servir **um stub** com `canonical`, `noindex` e redirecionamento que **preserva o caminho** — `/machinelearning/iii-1-neuronio-artificial.html` cai em `.../iii-1-neuronio-artificial.html` no domínio novo. Um `404.html` cobre todos os *deep links*, porque é o que o Pages serve para qualquer caminho inexistente.

### 3. Build na Vercel a partir da **raiz do repositório**

Não de `publicar/`: o `build.mjs` lê `.specify/memory/constitution.md` (o alfabeto de selos) e `livro/`, e o `exercicios.mjs` lê `livro/`.

```json
{ "installCommand": "cd publicar && npm ci",
  "buildCommand": "cd publicar && npm run build",
  "outputDirectory": "docs",
  "git": { "deploymentEnabled": { "main": false } } }
```

**`deploymentEnabled.main: false` é a parte importante.** Sem isso a Vercel publicaria em paralelo ao CI, e o gate do Princípio IX viraria decoração — o site iria ao ar mesmo com os testes vermelhos. O `publicar.yml` continua sendo o portão (pytest do `ml-zero` + gate de exercícios + build) e **só ele** promove para produção. Previews de branch seguem automáticos, que é justamente o que se foi buscar.

### 4. Railway com raiz no **repositório**, não na pasta do backend

**Aqui divergimos do guia do harness, e a razão é concreta.** O guia manda `Root Directory = chat-companion/backend`, o que copia só aquela pasta — e por isso o harness embarca um `corpus.json` gerado antes do deploy.

Neste repositório o `corpus.json` tem **815 KB e é gitignored**. Com a raiz na pasta do backend, ele não existiria no container, e as opções seriam: versionar 815 KB que mudam a **cada** edição do livro, ou aceitar o tutor sem busca no texto.

Com a raiz no repositório, `livro/` está presente, o índice é construído ao vivo e **o corpus deixa de existir como artefato**. O `_find_repo_root()` do `config.py` já resolve isso sozinho — ele sobe procurando `livro/`.

### 5. Dois subdomínios, e o backend precisa do dele

| Registro | Tipo | Aponta para |
|---|---|---|
| `machinelearning` | CNAME | `cname.vercel-dns.com.` |
| `api.machinelearning` | CNAME | o alvo que o Railway mostrar em *Settings → Networking → Custom Domain* |

**Por que o backend precisa de subdomínio próprio, e não a URL da Railway.** O campo `companion_backend` do `sumario.json` é **compilado dentro do HTML de todas as páginas**. Apontar para `*.up.railway.app` significa que trocar de provedor — ou o Railway mudar a URL — obriga a **reconstruir e republicar o livro inteiro**. Com subdomínio próprio, o livro nunca carrega o nome de um fornecedor, e o CORS passa a listar nomes estáveis.

### 6. CORS: lista fixa em produção, regex para os previews

Produção: `ALLOWED_ORIGINS=https://machinelearning.ghdaru.com.br` (mais `https://ghdaru.github.io` **só durante a transição**).

Previews mudam de URL a cada commit, então entra um `ALLOWED_ORIGIN_REGEX` — que **não existia** no backend, onde só havia lista fixa. Sem ele, o chat quebraria em silêncio em toda preview. É seguro porque `allow_credentials=False` (não há cookie nem sessão autenticada a roubar) e o ativo real, a chave do modelo, é protegido por *rate limit*, não por CORS. **Nunca `*`.**

## Alternativas avaliadas

**A. Ficar no GitHub Pages com domínio customizado.** O Pages suporta CNAME e HTTPS; resolveria o domínio sem migração nenhuma. Perdeu por não ter preview por branch nem rollback — e preview é a única coisa que a Vercel realmente acrescenta.

**B. Migrar para a Vercel e desligar o Pages.** Perdeu porque quebra links já em circulação, sem 301 possível.

**C. Manter os dois sites ativos.** Rejeitada: conteúdo duplicado real, e a dúvida sobre qual é o oficial.

**D. Seguir o guia do harness à risca, com raiz na pasta do backend.** Perdeu pelo `corpus.json`: versionar 815 KB que mudam a cada edição é *churn* garantido, e esquecer de regenerá-lo degrada o tutor **em silêncio** — o pior modo de falha.

**E. Deixar a Vercel publicar direto do `main`.** Rejeitada: o site iria ao ar sem passar pelos gates. O Princípio IX exige evidência antes de dar por pronto.

## Justificativa

A migração se paga por **uma** coisa — preview por branch — e é honesto dizer que é só isso. O ADR 0001 do harness aceitou não ter preview porque a alternativa custava infra; na Vercel ela não custa, então a premissa daquela decisão mudou.

O resto do desenho existe para que a mudança **não** afrouxe o que já estava de pé: o CI continua sendo o portão, o CORS continua fechado, e o livro deixa de carregar o nome de um fornecedor dentro do próprio HTML.

## Consequências

**Mais fácil:** ver o rascunho ao vivo antes do merge; reverter um deploy ruim em um clique; trocar de provedor de backend sem republicar o livro.

**Mais difícil:** três serviços externos em vez de um, e três painéis com credenciais. Nenhuma credencial entra no repositório (Princípio V).

**Aceito conscientemente:** o plano Hobby da Vercel é para uso não-comercial — o livro é gratuito e cabe, mas a regra existe e fica registrada.

**O risco que mais preocupa: degradação silenciosa.** Se o front subir no domínio novo antes de o CORS do Railway aceitá-lo, o chat e a correção de exercícios morrem exibindo *"não deu para corrigir agora"* — e **os laboratórios continuam funcionando**, mascarando a falha. Mitigação em duas camadas: janela com as duas origens liberadas, e um **smoke test bloqueante** no workflow que confere o cabeçalho `access-control-allow-origin` vindo da API com a origem do site. Sem o cabeçalho, o deploy falha.
