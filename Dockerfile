# Imagem do backend (chat, correção dos exercícios, telemetria).
#
# POR QUE UM DOCKERFILE, E NÃO NIXPACKS (ADR 0007):
# o Root Directory do serviço na Railway é a RAIZ do repositório — decisão do
# ADR 0006, para que o container tenha `livro/` e o índice do tutor seja
# construído ao vivo. Só que a raiz do repositório é ambígua para a detecção
# automática: ela tem um `package.json` (que existe só para fixar a versão do
# Node na Vercel) e NENHUM marcador de Python no topo — `requirements.txt` e
# `runtime.txt` moram em `chat-companion/backend/`. Qual provider o Nixpacks
# escolheria nessa combinação é coisa que não se prova sem rodar o build lá.
# Aqui não há o que adivinhar: a imagem é declarada, o Python é fixo, e o
# `pip` existe.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# As dependências primeiro, sozinhas: editar um capítulo do livro não pode
# invalidar a camada de instalação.
COPY chat-companion/backend/requirements.txt /app/chat-companion/backend/requirements.txt
RUN pip install --no-cache-dir -r chat-companion/backend/requirements.txt

# O resto do repositório. O `.dockerignore` é quem decide o que entra —
# `livro/` PRECISA entrar: é dele que o tutor constrói o índice de busca.
COPY . /app

# `sh -c` porque $PORT é atribuído pela Railway em tempo de execução; `exec`
# para o uvicorn virar o PID 1 e receber o SIGTERM do deploy sem esperar timeout.
CMD ["sh", "-c", "cd chat-companion/backend && exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
