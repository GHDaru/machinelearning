# `chat-companion/` — o backend do livro vivo

O que faz o livro deixar de ser um PDF navegável: um tutor que responde a partir do texto, a **correção dos exercícios**, o progresso do leitor e a telemetria que corrige o próprio livro.

## Subir

```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/ -q        # 23 testes, sem rede e sem banco
uvicorn app:app --reload --port 8000
```

Depois aponte o site para ele em `publicar/sumario.json`:

```json
"companion_backend": "http://127.0.0.1:8000"
```

**Sobe sem nada configurado.** Sem chave de modelo, o adapter é `echo`; sem `DATABASE_URL`, o store é em memória. Os fallbacks são deliberados: ninguém deveria precisar de credencial para rodar o livro na própria máquina.

## As três superfícies

| Superfície | Rotas | O que faz |
|---|---|---|
| **Tutor** | `POST /chat`, `POST /chat/stream` | Responde ancorado no texto do livro, sabendo o capítulo e o progresso do leitor |
| **Prática** | `POST /exercicio/tentativa`, `GET /exercicios`, `POST /video/visto`, `GET /progresso` | Corrige, explica e registra |
| **Telemetria** | `POST /consent`, `POST /telemetry`, `GET /telemetry/publico` | Anônima, consentida, agregada em público |

Mais: `GET /health`, `GET /capabilities`, `POST /objetivo`, `POST /suggestion`, `DELETE /session/{id}`.

## Os arquivos

| Arquivo | Papel |
|---|---|
| `app.py` | Composition root e as rotas |
| `exercicios.py` | O motor de correção: 5 tipos, revelação na 2ª tentativa, rubrica por LLM |
| `capabilities.py` | Gating de capacidades por capítulo (o *fading* do 4C/ID virando comportamento) |
| `tools.py` | Tools sandbox: métricas de classificação, conferência de split, aritmética segura |
| `store.py` | Sessões, mensagens, tentativas, vídeos, consentimento — memória ou Postgres |
| `ragindex.py` | Busca no texto do livro (linha de base por termos, deliberadamente) |
| `llm.py` | `LLMPort` com adapters echo e OpenAI-compatible, e BYOK efêmero |
| `banco.json` | Gerado por `publicar/exercicios.mjs`. **Não editar à mão** |
| `corpus.json` | Gerado por `build_corpus.py`, para deploy isolado |

## Regras que este backend obedece

- **A página nunca recebe o gabarito.** Ele existe só aqui (ADR 0001).
- **Feedback que só diz "errado" é proibido.** Todo exercício tem explicação obrigatória.
- **A rubrica é do autor, não do modelo.** Sem modelo configurado, devolve avaliação honesta-vazia — nunca uma nota inventada.
- **Zero credencial no código.** Só ambiente / `.env` gitignored.
- **O progresso é do leitor.** Anônimo, sem cadastro, apagável em cascata numa chamada.

## Deploy

Qualquer plataforma que rode um processo Python. Antes de publicar, gere os dois arquivos que o backend precisa do livro:

```bash
node publicar/exercicios.mjs        # banco.json  (exercícios + gabaritos)
python chat-companion/backend/build_corpus.py   # corpus.json (texto do livro)
```

Variáveis de ambiente: ver [`backend/.env.example`](backend/.env.example).
