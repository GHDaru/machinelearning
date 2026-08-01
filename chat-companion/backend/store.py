"""StorePort — persistência de sessões, mensagens e **progresso do leitor**.

Duas implementações atrás da mesma porta (hexagonal por necessidade):
  - MemoryStore: dev e testes, sem banco, sem rede.
  - PostgresStore: produção (psycopg v3). Cria as tabelas na subida.

Identidade é anônima: `session_id` é um id gerado pelo navegador. Nenhum dado
pessoal é exigido. `delete_session` implementa o direito ao esquecimento —
e apaga junto o progresso, as tentativas e os vídeos (Princípio V).

O que este store guarda de mais valioso não são as conversas: são as
**tentativas de exercício**. Saber qual exercício erra mais, e com qual
resposta, é o sinal que corrige o livro (Princípio VIII.6).
"""

from __future__ import annotations

import time
from typing import Optional, Protocol

Message = dict


class StorePort(Protocol):
    def ensure_session(self, session_id: str) -> None: ...
    def append(self, session_id: str, role: str, content: str) -> None: ...
    def history(self, session_id: str, limit: int = 100) -> list[Message]: ...
    def count_since(self, session_id: str, since_ts: float) -> int: ...
    def delete_session(self, session_id: str) -> None: ...
    def add_suggestion(self, session_id: str, texto: str, pagina: str) -> None: ...
    def suggestions(self, limit: int = 200) -> list[dict]: ...
    # consentimento, telemetria de navegação e objetivo do leitor
    def record_consent(self, session_id: str, versao: str) -> None: ...
    def has_consent(self, session_id: str) -> bool: ...
    def add_nav(self, session_id: str, slug: str) -> None: ...
    def nav_stats(self, limit: int = 500) -> dict: ...
    def set_goal(self, session_id: str, texto: str) -> None: ...
    def get_goal(self, session_id: str) -> Optional[str]: ...
    # interatividade: exercícios e vídeos
    def add_tentativa(self, session_id: str, exercicio_id: str, capitulo: int,
                      resposta: str, correto: bool) -> None: ...
    def contar_tentativas(self, session_id: str, exercicio_id: str) -> int: ...
    def progresso(self, session_id: str) -> dict: ...
    def marcar_video(self, session_id: str, video_id: str, capitulo: int) -> None: ...
    def stats_exercicios(self, limit: int = 200) -> dict: ...


# ----------------------------------------------------------- memória

class MemoryStore:
    def __init__(self) -> None:
        self._msgs: dict[str, list[dict]] = {}
        self._sug: list[dict] = []
        self._consents: dict[str, dict] = {}
        self._nav: list[dict] = []
        self._goals: dict[str, str] = {}
        self._tentativas: list[dict] = []
        self._videos: list[dict] = []

    def ensure_session(self, session_id: str) -> None:
        self._msgs.setdefault(session_id, [])

    def append(self, session_id: str, role: str, content: str) -> None:
        self._msgs.setdefault(session_id, []).append(
            {"role": role, "content": content, "ts": time.time()})

    def history(self, session_id: str, limit: int = 100) -> list[Message]:
        return [{"role": m["role"], "content": m["content"]}
                for m in self._msgs.get(session_id, [])[-limit:]]

    def count_since(self, session_id: str, since_ts: float) -> int:
        return sum(1 for m in self._msgs.get(session_id, [])
                   if m["role"] == "user" and m["ts"] >= since_ts)

    def delete_session(self, session_id: str) -> None:
        self._msgs.pop(session_id, None)
        self._consents.pop(session_id, None)
        self._goals.pop(session_id, None)
        self._nav = [e for e in self._nav if e["session_id"] != session_id]
        self._tentativas = [e for e in self._tentativas if e["session_id"] != session_id]
        self._videos = [e for e in self._videos if e["session_id"] != session_id]

    def add_suggestion(self, session_id: str, texto: str, pagina: str) -> None:
        self._sug.append({"session_id": session_id, "texto": texto, "pagina": pagina,
                          "ts": time.time()})

    def suggestions(self, limit: int = 200) -> list[dict]:
        return list(self._sug[-limit:])

    def record_consent(self, session_id: str, versao: str) -> None:
        self._consents[session_id] = {"versao": versao, "ts": time.time()}

    def has_consent(self, session_id: str) -> bool:
        return session_id in self._consents

    def add_nav(self, session_id: str, slug: str) -> None:
        self._nav.append({"session_id": session_id, "slug": slug, "ts": time.time()})

    def nav_stats(self, limit: int = 500) -> dict:
        nav = self._nav[-limit:]
        por_slug: dict[str, int] = {}
        for e in nav:
            por_slug[e["slug"]] = por_slug.get(e["slug"], 0) + 1
        return {"total": len(nav), "por_pagina": por_slug,
                "ultimos": [{"slug": e["slug"], "ts": e["ts"]} for e in nav[-20:]]}

    def set_goal(self, session_id: str, texto: str) -> None:
        self._goals[session_id] = texto

    def get_goal(self, session_id: str) -> Optional[str]:
        return self._goals.get(session_id)

    # ---- interatividade ----
    def add_tentativa(self, session_id: str, exercicio_id: str, capitulo: int,
                      resposta: str, correto: bool) -> None:
        self._tentativas.append({"session_id": session_id, "exercicio_id": exercicio_id,
                                 "capitulo": capitulo, "resposta": resposta,
                                 "correto": correto, "ts": time.time()})

    def contar_tentativas(self, session_id: str, exercicio_id: str) -> int:
        return sum(1 for t in self._tentativas
                   if t["session_id"] == session_id and t["exercicio_id"] == exercicio_id)

    def progresso(self, session_id: str) -> dict:
        exs: dict[str, dict] = {}
        for t in self._tentativas:
            if t["session_id"] != session_id:
                continue
            cur = exs.setdefault(t["exercicio_id"], {"tentativas": 0, "correto": False,
                                                     "capitulo": t["capitulo"]})
            cur["tentativas"] += 1
            cur["correto"] = cur["correto"] or t["correto"]
        vids = sorted({v["video_id"] for v in self._videos if v["session_id"] == session_id})
        return {"exercicios": exs, "videos": vids,
                "resolvidos": sum(1 for e in exs.values() if e["correto"])}

    def marcar_video(self, session_id: str, video_id: str, capitulo: int) -> None:
        if any(v["session_id"] == session_id and v["video_id"] == video_id for v in self._videos):
            return
        self._videos.append({"session_id": session_id, "video_id": video_id,
                             "capitulo": capitulo, "ts": time.time()})

    def stats_exercicios(self, limit: int = 200) -> dict:
        por: dict[str, dict] = {}
        for t in self._tentativas:
            cur = por.setdefault(t["exercicio_id"], {"tentativas": 0, "acertos": 0,
                                                     "capitulo": t["capitulo"]})
            cur["tentativas"] += 1
            cur["acertos"] += 1 if t["correto"] else 0
        for e in por.values():
            e["taxa_acerto"] = round(e["acertos"] / e["tentativas"], 3) if e["tentativas"] else 0.0
        return {"total_tentativas": len(self._tentativas), "por_exercicio": por}


# ----------------------------------------------------------- postgres

class PostgresStore:
    """Persistência real. Import de psycopg é tardio para o app subir mesmo
    sem a lib instalada (o MemoryStore cobre dev/testes)."""

    def __init__(self, database_url: str) -> None:
        import psycopg  # noqa: F401  (falha cedo e claro se ausente em produção)

        self._psycopg = psycopg
        if "sslmode=" not in database_url:
            database_url += ("&" if "?" in database_url else "?") + "sslmode=require"
        self._dsn = database_url
        self._init_schema()

    def _conn(self):
        return self._psycopg.connect(self._dsn)

    def _init_schema(self) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                CREATE TABLE IF NOT EXISTS messages (
                    id BIGSERIAL PRIMARY KEY,
                    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, id);
                CREATE TABLE IF NOT EXISTS suggestions (
                    id BIGSERIAL PRIMARY KEY,
                    session_id TEXT,
                    texto TEXT NOT NULL,
                    pagina TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                CREATE TABLE IF NOT EXISTS consents (
                    session_id TEXT PRIMARY KEY REFERENCES sessions(session_id) ON DELETE CASCADE,
                    versao TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                CREATE TABLE IF NOT EXISTS nav_events (
                    id BIGSERIAL PRIMARY KEY,
                    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
                    slug TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                CREATE INDEX IF NOT EXISTS idx_nav_slug ON nav_events(slug);
                CREATE TABLE IF NOT EXISTS goals (
                    session_id TEXT PRIMARY KEY REFERENCES sessions(session_id) ON DELETE CASCADE,
                    texto TEXT NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                CREATE TABLE IF NOT EXISTS tentativas (
                    id BIGSERIAL PRIMARY KEY,
                    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
                    exercicio_id TEXT NOT NULL,
                    capitulo INT NOT NULL DEFAULT 0,
                    resposta TEXT NOT NULL,
                    correto BOOLEAN NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                CREATE INDEX IF NOT EXISTS idx_tent_sessao ON tentativas(session_id, exercicio_id);
                CREATE INDEX IF NOT EXISTS idx_tent_ex ON tentativas(exercicio_id);
                CREATE TABLE IF NOT EXISTS videos_vistos (
                    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
                    video_id TEXT NOT NULL,
                    capitulo INT NOT NULL DEFAULT 0,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                    PRIMARY KEY (session_id, video_id)
                );
            """)
            conn.commit()

    def ensure_session(self, session_id: str) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO sessions(session_id) VALUES (%s) ON CONFLICT DO NOTHING",
                        (session_id,))
            conn.commit()

    def append(self, session_id: str, role: str, content: str) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO messages(session_id, role, content) VALUES (%s, %s, %s)",
                        (session_id, role, content))
            conn.commit()

    def history(self, session_id: str, limit: int = 100) -> list[Message]:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT role, content FROM messages WHERE session_id = %s "
                        "ORDER BY id DESC LIMIT %s", (session_id, limit))
            rows = cur.fetchall()
        return [{"role": r[0], "content": r[1]} for r in reversed(rows)]

    def count_since(self, session_id: str, since_ts: float) -> int:
        from datetime import datetime, timezone
        since = datetime.fromtimestamp(since_ts, tz=timezone.utc)
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT count(*) FROM messages WHERE session_id = %s AND role = 'user' "
                        "AND created_at >= %s", (session_id, since))
            return int(cur.fetchone()[0])

    def delete_session(self, session_id: str) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("DELETE FROM sessions WHERE session_id = %s", (session_id,))
            conn.commit()

    def add_suggestion(self, session_id: str, texto: str, pagina: str) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO suggestions(session_id, texto, pagina) VALUES (%s, %s, %s)",
                        (session_id, texto, pagina))
            conn.commit()

    def suggestions(self, limit: int = 200) -> list[dict]:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT session_id, texto, pagina, created_at FROM suggestions "
                        "ORDER BY id DESC LIMIT %s", (limit,))
            rows = cur.fetchall()
        return [{"session_id": r[0], "texto": r[1], "pagina": r[2], "created_at": str(r[3])}
                for r in rows]

    def record_consent(self, session_id: str, versao: str) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO consents(session_id, versao) VALUES (%s, %s) "
                        "ON CONFLICT (session_id) DO UPDATE SET versao = EXCLUDED.versao, "
                        "created_at = now()", (session_id, versao))
            conn.commit()

    def has_consent(self, session_id: str) -> bool:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT 1 FROM consents WHERE session_id = %s", (session_id,))
            return cur.fetchone() is not None

    def add_nav(self, session_id: str, slug: str) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO nav_events(session_id, slug) VALUES (%s, %s)",
                        (session_id, slug))
            conn.commit()

    def nav_stats(self, limit: int = 500) -> dict:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT slug, count(*) FROM nav_events GROUP BY slug "
                        "ORDER BY count(*) DESC LIMIT 100")
            por = {r[0]: int(r[1]) for r in cur.fetchall()}
            cur.execute("SELECT slug, created_at FROM nav_events ORDER BY id DESC LIMIT 20")
            ult = [{"slug": r[0], "ts": str(r[1])} for r in cur.fetchall()]
            cur.execute("SELECT count(*) FROM nav_events")
            total = int(cur.fetchone()[0])
        return {"total": total, "por_pagina": por, "ultimos": ult}

    def set_goal(self, session_id: str, texto: str) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO goals(session_id, texto) VALUES (%s, %s) "
                        "ON CONFLICT (session_id) DO UPDATE SET texto = EXCLUDED.texto, "
                        "updated_at = now()", (session_id, texto))
            conn.commit()

    def get_goal(self, session_id: str) -> Optional[str]:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT texto FROM goals WHERE session_id = %s", (session_id,))
            row = cur.fetchone()
        return row[0] if row else None

    # ---- interatividade ----
    def add_tentativa(self, session_id: str, exercicio_id: str, capitulo: int,
                      resposta: str, correto: bool) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO tentativas(session_id, exercicio_id, capitulo, resposta, "
                        "correto) VALUES (%s, %s, %s, %s, %s)",
                        (session_id, exercicio_id, capitulo, resposta[:4000], correto))
            conn.commit()

    def contar_tentativas(self, session_id: str, exercicio_id: str) -> int:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT count(*) FROM tentativas WHERE session_id = %s "
                        "AND exercicio_id = %s", (session_id, exercicio_id))
            return int(cur.fetchone()[0])

    def progresso(self, session_id: str) -> dict:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT exercicio_id, max(capitulo), count(*), bool_or(correto) "
                        "FROM tentativas WHERE session_id = %s GROUP BY exercicio_id",
                        (session_id,))
            exs = {r[0]: {"capitulo": int(r[1] or 0), "tentativas": int(r[2]),
                          "correto": bool(r[3])} for r in cur.fetchall()}
            cur.execute("SELECT video_id FROM videos_vistos WHERE session_id = %s ORDER BY video_id",
                        (session_id,))
            vids = [r[0] for r in cur.fetchall()]
        return {"exercicios": exs, "videos": vids,
                "resolvidos": sum(1 for e in exs.values() if e["correto"])}

    def marcar_video(self, session_id: str, video_id: str, capitulo: int) -> None:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("INSERT INTO videos_vistos(session_id, video_id, capitulo) "
                        "VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
                        (session_id, video_id, capitulo))
            conn.commit()

    def stats_exercicios(self, limit: int = 200) -> dict:
        with self._conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT exercicio_id, max(capitulo), count(*), "
                        "count(*) FILTER (WHERE correto) FROM tentativas "
                        "GROUP BY exercicio_id ORDER BY count(*) DESC LIMIT %s", (limit,))
            por = {}
            for r in cur.fetchall():
                tent, ac = int(r[2]), int(r[3])
                por[r[0]] = {"capitulo": int(r[1] or 0), "tentativas": tent, "acertos": ac,
                             "taxa_acerto": round(ac / tent, 3) if tent else 0.0}
            cur.execute("SELECT count(*) FROM tentativas")
            total = int(cur.fetchone()[0])
        return {"total_tentativas": total, "por_exercicio": por}


def make_store(database_url: str) -> StorePort:
    return PostgresStore(database_url) if database_url else MemoryStore()
