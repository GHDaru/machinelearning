# -*- coding: utf-8 -*-
"""Gera a capa do livro em PNG, sem dependência externa.

Desenha o que o livro é: uma nuvem de pontos de duas classes, e a fronteira
de decisão que as separa — com a faixa de sobreposição deixada visível, porque
o erro irredutível é parte da tese (cap. 01).
"""
import math, random, struct, zlib
from pathlib import Path

def png(path, w, h, pixels):
    raw = b"".join(b"\x00" + bytes(pixels[y]) for y in range(h))
    def chunk(tipo, dados):
        c = tipo + dados
        return struct.pack(">I", len(dados)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
    Path(path).write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b""))

def desenhar(w, h, seed=20260801):
    rng = random.Random(seed)
    # fundo: gradiente azul-escuro, com uma grade tênue (blueprint)
    px = []
    for y in range(h):
        t = y / (h - 1)
        base = (int(18 + 10 * t), int(20 + 12 * t), int(24 + 18 * t))
        linha = []
        for x in range(w):
            c = base
            if x % 64 == 0 or y % 64 == 0:
                c = (c[0] + 8, c[1] + 8, c[2] + 10)
            linha += [c[0], c[1], c[2]]
        px.append(linha)

    def blend(x, y, cor, alpha):
        if 0 <= x < w and 0 <= y < h:
            i = x * 3
            for k in range(3):
                px[y][i + k] = int(px[y][i + k] * (1 - alpha) + cor[k] * alpha)

    def ponto(cx, cy, r, cor):
        for dy in range(-r - 2, r + 3):
            for dx in range(-r - 2, r + 3):
                d = math.hypot(dx, dy)
                if d <= r + 2:
                    a = 1.0 if d <= r - 1 else max(0.0, (r + 1.5 - d) / 2.5)
                    blend(cx + dx, cy + dy, cor, a * 0.95)

    # a fronteira de decisão: uma sigmoide atravessando a arte
    def fronteira(x):
        u = (x / w - 0.5) * 9
        return h * (0.72 - 0.42 / (1 + math.exp(-u)))

    AZUL, VERDE, AMBAR = (120, 174, 255), (111, 208, 138), (224, 162, 74)

    # nuvem de pontos: classe pelo lado da fronteira, com sobreposição proposital
    for _ in range(340):
        x = rng.randint(int(w * 0.05), int(w * 0.95))
        y = rng.randint(int(h * 0.06), int(h * 0.94))
        margem = y - fronteira(x)
        if abs(margem) < h * 0.02 and rng.random() < 0.55:
            continue
        # 9% de rótulos trocados: o ruído irredutível, visível na capa
        classe = margem > 0
        if rng.random() < 0.09:
            classe = not classe
        r = rng.choice([5, 6, 6, 7, 8])
        ponto(x, y, r, VERDE if classe else AZUL)

    # a fronteira por cima, em âmbar
    for x in range(int(w * 0.02), int(w * 0.98)):
        y = fronteira(x)
        for dy in range(-4, 5):
            a = max(0.0, 1 - abs(dy) / 4.2)
            blend(x, int(y) + dy, AMBAR, a * 0.9)
    return px

png("publicar/tema/capa.png", 1024, 1536, desenhar(1024, 1536))
png("publicar/tema/capa-social.png", 1200, 630, desenhar(1200, 630, seed=7))
print("✓ capa.png (1024×1536) e capa-social.png (1200×630) geradas")
