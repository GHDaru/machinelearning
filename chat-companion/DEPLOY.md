# Publicar o backend do livro vivo

> O que isto destrava: **correção dos 31 exercícios**, feedback explicativo, progresso do leitor, tutor e telemetria. Os laboratórios interativos já funcionam sem backend — eles rodam no navegador.

## O caminho mais curto (Render, plano gratuito)

O repositório traz um blueprint pronto em [`render.yaml`](../render.yaml).

1. Abra **https://dashboard.render.com/select-repo?type=blueprint**
2. Escolha `GHDaru/machinelearning` → **Apply**
3. Espere o build (~2 min). O Render mostra a URL, algo como `https://livro-ml-backend.onrender.com`
4. Confira: abra `SUA-URL/health` — deve responder

```json
{"ok": true, "llm": "echo", "store": "memory",
 "banco": {"exercicios": 31, "videos": 7, ...}}
```

5. **Ligue o site ao backend**: em [`publicar/sumario.json`](../publicar/sumario.json), troque

```json
"companion_backend": ""
```
por
```json
"companion_backend": "https://livro-ml-backend.onrender.com"
```

6. Commit e push. O deploy do Pages reconstrói, e os exercícios passam a corrigir.

**Sobe sem configurar nada.** Sem chave de modelo, o adapter é `echo`; sem `DATABASE_URL`, o store é memória. Isso **já basta** para a correção dos exercícios: ela é determinística e não usa modelo nem banco.

> ⚠ **O plano gratuito hiberna** após ~15 min sem tráfego, e a primeira requisição seguinte leva ~30 s. Para uso em sala, abra o site alguns minutos antes da aula — ou suba para um plano pago, que não hiberna.

## O que cada variável liga

| Variável | Sem ela | Com ela |
|---|---|---|
| `ALLOWED_ORIGINS` | o navegador bloqueia por CORS | o site publicado pode chamar |
| `LLM_ADAPTER=openai` + `OPENAI_API_KEY` | tutor responde eco; resposta aberta **diz que não avaliou** | tutor real e avaliação por rubrica |
| `DATABASE_URL` | progresso some ao reiniciar | progresso persiste entre sessões e deploys |
| `ADMIN_TOKEN` | `/telemetry` e `/suggestions` retornam 403 | painel de uso acessível com o token |

**Nenhuma delas vai para o repositório.** No `render.yaml` elas estão marcadas `sync: false`, o que faz o Render pedir o valor no painel sem versioná-lo — Princípio V da constituição.

## Persistência (opcional, mas recomendada para uma turma)

Sem `DATABASE_URL`, o progresso dos alunos vive na memória do processo e some a cada reinício — inclusive quando o plano gratuito hiberna.

Qualquer Postgres serve. No próprio Render: **New → PostgreSQL** (há plano gratuito), copie a *Internal Database URL* e cole em `DATABASE_URL`. As tabelas são criadas sozinhas na primeira subida.

## Alternativas

O backend é um processo Python comum — sobe em qualquer lugar que rode `uvicorn`:

| Plataforma | Arquivo pronto |
|---|---|
| **Render** | [`render.yaml`](../render.yaml) |
| **Railway** | [`backend/railway.json`](backend/railway.json) |
| **Heroku / Fly / qualquer PaaS** | [`backend/Procfile`](backend/Procfile) |
| **Docker / VPS** | `pip install -r requirements.txt && uvicorn app:app --host 0.0.0.0 --port 8000` |

## Antes de publicar, regenere os dois arquivos derivados

O backend precisa de dois artefatos gerados a partir do livro:

```bash
node publicar/exercicios.mjs                     # banco.json — exercícios + gabaritos
python chat-companion/backend/build_corpus.py    # corpus.json — texto do livro (RAG do tutor)
```

O `banco.json` é **versionado** e a CI confere que não derivou do livro. O `corpus.json` é gitignored; num deploy que clona o repositório inteiro (como o Render faz), o backend encontra `livro/` sozinho e dispensa o corpus.

## Verificar que funcionou

Depois de ligar o site ao backend, abra qualquer capítulo com exercício — por exemplo o [18](https://ghdaru.github.io/machinelearning/18-neuronio-artificial.html) — e responda **errado** de propósito. Deve aparecer:

> *Ainda não. Releia a seção indicada e tente outra vez — na próxima tentativa eu explico o raciocínio completo.*

Responda errado de novo: aí sim vem a explicação completa e a resposta esperada. **Se isso acontecer, está tudo funcionando** — a revelação progressiva é a parte que só o servidor consegue fazer.
