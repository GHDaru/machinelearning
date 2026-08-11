# ADR 0007 — O build do backend é declarado (Dockerfile), não detectado (Nixpacks)

**Data:** 2026-08-11 · **Estado:** aceito

## Contexto

O [ADR 0006](0006-publicacao-vercel-railway-dominio.md) decidiu que o **Root Directory do serviço na Railway é a raiz do repositório**, e não `chat-companion/backend/` como no guia do harness. A razão continua valendo: com a raiz na pasta do backend, o container não teria `livro/`, e a busca do tutor passaria a depender de um `corpus.json` de 815 KB versionado e regenerado a cada edição — que, esquecido, degrada a busca **sem avisar**.

Só que essa escolha tem uma consequência que o ADR 0006 não previu, e que apareceu na conferência véspera do deploy, antes de o autor clicar em qualquer coisa:

**A raiz deste repositório é ambígua para a detecção automática de linguagem.** Ela contém:

| Marcador | Onde | Para quê existe |
|---|---|---|
| `package.json` (`engines.node: 22.x`) | **raiz** | fixar a versão do Node **na Vercel**, que lê o `package.json` do Root Directory |
| `requirements.txt` | `chat-companion/backend/` | as dependências do backend |
| `runtime.txt` (`python-3.11.9`) | `chat-companion/backend/` | herdado da cópia do harness |

Ou seja: do ponto de vista de quem inspeciona a raiz, este é um projeto **Node**. O único marcador de Python está dois níveis abaixo, onde a detecção não olha. O `buildCommand` que estava configurado — `pip install -r chat-companion/backend/requirements.txt` — pressupõe que o `pip` exista na imagem, o que só é verdade se o provider de Python for eleito.

**E aqui está o ponto que decidiu este ADR:** *qual* provider o Nixpacks elegeria nessa combinação não é coisa que se prove sem rodar o build na Railway. Não há daemon Docker no ambiente de trabalho, e a ordem de precedência entre providers do Nixpacks é detalhe de implementação da ferramenta, versionado com ela. Restavam duas condutas: **apostar e descobrir no primeiro deploy**, ou **remover a aposta**.

O Princípio IX (DoD verificável — *prove, não declare*) não permite a primeira. Uma configuração que "provavelmente funciona" é exatamente a classe de afirmação que a metodologia proíbe.

## Decisão

**O build do backend passa a ser declarado num `Dockerfile` na raiz**, e o `railway.json` da raiz passa a `"builder": "DOCKERFILE"`.

```dockerfile
FROM python:3.12-slim
COPY chat-companion/backend/requirements.txt …   # dependências primeiro (cache)
RUN pip install --no-cache-dir -r …
COPY . /app                                       # inclui livro/ — é o ponto do ADR 0006
CMD ["sh", "-c", "cd chat-companion/backend && exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

Três detalhes não são estéticos:

- **`sh -c`** porque `$PORT` é atribuído pela Railway em tempo de execução, e a forma *exec* do `CMD` não expande variável.
- **`exec`** para o uvicorn virar o PID 1 e receber o `SIGTERM` do deploy direto, em vez de o shell segurar o sinal e o container morrer por timeout.
- **`requirements.txt` copiado sozinho, antes do resto**: editar um capítulo do livro não pode invalidar a camada de instalação de dependências. Como o `COPY . /app` é o que traz `livro/`, e o livro muda toda semana, sem essa separação **todo** deploy reinstalaria tudo.

Um **`.dockerignore`** acompanha, e a regra para editá-lo está escrita nele: o backend precisa de `livro/` e de `chat-companion/backend/`, e de mais nada. Ele também exclui `.env` explicitamente — o arquivo é gitignored, mas `COPY . /app` não sabe disso, e uma imagem com credencial dentro é um vazamento com prazo indeterminado (Princípio V).

**Os dois arquivos de deploy que sobraram na pasta do backend foram removidos** — `chat-companion/backend/railway.json` e `chat-companion/backend/Procfile`, herdados da cópia do harness. Ambos estavam inertes com o Root Directory na raiz, e ambos descreviam a topologia que o ADR 0006 **recusou**: um `startCommand` que sobe o backend sem `livro/` por perto. Inertes hoje, mas prontos para funcionar no dia em que alguém — inclusive um agente — "consertasse" o Root Directory apontando-o para a pasta do backend. Aí o serviço subiria **verde**, com a busca do tutor degradada e nenhum sinal. Configuração morta que descreve a alternativa rejeitada não é neutra: é uma armadilha com a documentação do lado errado.

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| **Manter Nixpacks e torcer** | Viola o Princípio IX. E o custo do erro não é simétrico: acertar economiza um arquivo; errar dá `pip: command not found` no meio do passo 3, com o autor sem contexto para diagnosticar |
| **Manter Nixpacks e forçar o provider** por variável de ambiente | Troca a aposta na detecção por uma aposta no *nome* da variável que a controla — que também não dá para verificar daqui. E move configuração para o painel, onde não é versionada nem revisada |
| **`requirements.txt` na raiz** apontando para o do backend | Acrescenta um marcador de Python, mas **não remove** o de Node: a ambiguidade continua, agora com dois arquivos dizendo coisas diferentes sobre o que este projeto é |
| **Mover o backend para a raiz** | Resolveria a detecção e destruiria a organização do repositório por causa de uma ferramenta de build |
| **Voltar o Root Directory para `chat-companion/backend/`** | É desfazer o ADR 0006 e reintroduzir o `corpus.json` versionado — o modo de falha silenciosa que ele existe para evitar |

## Consequências

**A favor:**

- O build deixa de depender de heurística. `python:3.12-slim` tem `pip`; não há o que eleger.
- A versão do Python fica **versionada e visível** (3.12), em vez de decidida pela ferramenta. O `runtime.txt` do backend, que pedia 3.11.9 e era ignorado com o Root Directory na raiz, deixa de ser a única declaração — e deixa de mentir.
- O mesmo `Dockerfile` roda igual na máquina do autor, o que torna o deploy **reproduzível fora da Railway** — e reduz o *lock-in* que o ADR 0006 já queria baixo.

**Contra, e assumido:**

- **Build mais lento** que o Nixpacks na primeira vez (imagem base + instalação). Mitigado pela ordem das camadas: o caso comum — publicar uma edição do livro — reaproveita a camada de dependências.
- **O `Dockerfile` vira mais uma coisa a manter.** Aceito: são 6 linhas efetivas, e elas substituem uma suposição.
- **Não foi construído localmente** — não há daemon Docker no ambiente onde este ADR foi escrito. O que se afirma aqui é que a imagem é *determinística*, não que ela *foi provada verde*. A prova é o primeiro deploy, e o `healthcheckPath: /health` da Railway é quem a colhe: se o container não subir, o deploy não é promovido. **Esta linha deve ser substituída pelo resultado observado** assim que o passo 3 do `DEPLOY.md` for executado.

## O que isto ensinou

O ADR 0006 decidiu *onde* a raiz do serviço fica e justificou bem a escolha pelo que ela **garante** (o `livro/` no container). Não perguntou o que ela **quebra** — e o que ela quebrava estava a um `ls` de distância, na própria raiz que ele escolheu.

A conferência que achou isso não foi um teste: foi ler o diretório que o container ia receber, antes de mandar alguém clicar. Barato, e fora de qualquer gate — nenhum portão do CI olha para dentro do container que a Railway vai montar.
