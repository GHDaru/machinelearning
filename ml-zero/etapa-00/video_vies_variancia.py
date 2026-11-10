"""Gera o projeto HyperFrames da animação "Viés e variância: a curva que balança".

Reproduz o experimento do laboratório `fundamentos-l1` do capítulo 0.2 (a mesma curva
verdadeira, o mesmo ruído Irwin-Hall de 0,15, 20 pontos de treino, 200 de validação,
polinômios de grau 1 a 15 por Gram-Schmidt modificado) e o repete em 100 reamostragens
para medir o que o capítulo enuncia: viés² (a média das curvas contra a verdade),
variância (a dispersão das curvas) e o chão do ruído (0,5 × 0,15² = 0,01125).
Tudo em biblioteca padrão. Regenere com `python etapa-00/video_vies_variancia.py` e
renderize com `cd etapa-00/video-vies-variancia && npx hyperframes render -o vies.mp4`.
"""
from __future__ import annotations

import json
import math
import pathlib
import random
import statistics as st

RAIZ = pathlib.Path(__file__).resolve().parent / "video-vies-variancia"

# ------------------------------------------------------------------ o experimento
RUIDO = 0.15
PISO = 0.5 * RUIDO * RUIDO          # variância da soma de 6 uniformes centrada, × 0,15²
N_TREINO, N_VAL, GRAU_MAX, R = 20, 200, 15, 100

def verdade(x): return math.sin(3 * x) + 0.5 * x
def ruido(r): return (sum(r.random() for _ in range(6)) - 3) * RUIDO
def amostra(r, n):
    return [(-1 + 2 * (i + 0.5) / n, verdade(-1 + 2 * (i + 0.5) / n) + ruido(r)) for i in range(n)]

def ajustar(pts, g):
    n, m = len(pts), g + 1
    A = [[p[0] ** j for p in pts] for j in range(m)]
    Rm = [[0.0] * m for _ in range(m)]
    for j in range(m):
        for k in range(j):
            d = sum(A[k][i] * A[j][i] for i in range(n)); Rm[k][j] = d
            for i in range(n): A[j][i] -= d * A[k][i]
        nrm = math.sqrt(sum(v * v for v in A[j]))
        if nrm <= 1e-12: return None
        Rm[j][j] = nrm; A[j] = [v / nrm for v in A[j]]
    qty = [sum(A[j][i] * pts[i][1] for i in range(n)) for j in range(m)]
    c = [0.0] * m
    for j in range(m - 1, -1, -1):
        c[j] = (qty[j] - sum(Rm[j][k] * c[k] for k in range(j + 1, m))) / Rm[j][j]
    return c

def prever(c, x):
    s = 0.0
    for cj in reversed(c): s = s * x + cj
    return s
def eqm(c, pts): return sum((prever(c, x) - y) ** 2 for x, y in pts) / len(pts)

VAL = amostra(random.Random(20260813), N_VAL)
GRADE = [-1 + 2 * i / 100 for i in range(101)]
AMOSTRAS = {n: [amostra(random.Random(1000 + k), n) for k in range(R)] for n in (N_TREINO, 3 * N_TREINO)}
RES = {}
for n, lista in AMOSTRAS.items():
    RES[n] = {}
    for g in range(1, GRAU_MAX + 1):
        preds, tr, va = [], [], []
        for pts in lista:
            c = ajustar(pts, g)
            preds.append([prever(c, x) for x in GRADE]); tr.append(eqm(c, pts)); va.append(eqm(c, VAL))
        media = [st.mean(p[i] for p in preds) for i in range(101)]
        RES[n][g] = dict(
            vies2=st.mean((media[i] - verdade(GRADE[i])) ** 2 for i in range(101)),
            var=st.mean(st.pvariance([p[i] for p in preds]) for i in range(101)),
            tr=st.median(tr), va=st.median(va), preds=preds, media=media)
JOELHO = min(range(1, GRAU_MAX + 1), key=lambda g: RES[N_TREINO][g]["va"])
assert JOELHO == 5, f"o joelho mudou de grau ({JOELHO}); revise o roteiro"
G_BAIXO, G_ALTO = 1, 15
PONTOS = AMOSTRAS[N_TREINO][0]

def dec(v, casas): return f"{v:.{casas}f}".replace(".", ",")
def fmt(n): return f"{n:,}".replace(",", " ")

# ------------------------------------------------------------------ geometria
PX, PY, PW, PH = 300, 200, 1320, 660
YMIN, YMAX = -1.8, 1.8
def sx(x): return PX + (x + 1) / 2 * PW
def sy(v): return PY + PH - (min(max(v, YMIN - 5), YMAX + 5) - YMIN) / (YMAX - YMIN) * PH
def poli(ys): return " ".join(f"{sx(GRADE[i]):.1f},{sy(ys[i]):.1f}" for i in range(101))
VERDADE_SVG = poli([verdade(x) for x in GRADE])
PONTOS_SVG = "\n".join(f'<circle class="pt" cx="{sx(x):.1f}" cy="{sy(y):.1f}" r="9"/>' for x, y in PONTOS)
N_MOSTRADAS = 30

CSS_BASE = """
    #root { position: absolute; inset: 0; background: var(--ground); font-family: Inter, sans-serif; color: var(--ink); }
    .linha { position: absolute; left: 160px; right: 160px; text-align: center; font-weight: 700;
             font-size: 54px; letter-spacing: -0.02em; line-height: 1.15; top: 50px; }
    .linha span { display: inline-block; }
    .mono { font-family: "IBM Plex Mono", monospace; }
    .eixo { stroke: var(--ink-soft); stroke-width: 2; }
    .rot { font-size: 28px; fill: var(--ink-soft); font-family: Inter, sans-serif; }
    .verdade { fill: none; stroke: var(--ink); stroke-width: 5; }
    .verdade-fraca { fill: none; stroke: var(--ink-faint); stroke-width: 5; stroke-dasharray: 10 10; }
    .pt { fill: var(--ponto); }
    .fit { fill: none; stroke: var(--accent); stroke-width: 3; opacity: 0.28; }
    .fit.um { opacity: 1; stroke-width: 5; }
    .media { fill: none; stroke: var(--acento2); stroke-width: 6; }
    .readout { position: absolute; left: 340px; top: 230px; width: 360px; padding: 20px 24px; border-radius: 18px;
               background: var(--papel); box-shadow: 0 12px 40px rgba(28,37,54,.12); font-size: 28px; }
    .readout .g { font-family: "IBM Plex Mono", monospace; font-size: 40px; font-weight: 600; }
    .readout .t { color: var(--ink-soft); font-size: 28px; letter-spacing: .04em; text-transform: uppercase; margin-top: 10px; }
"""
BLUR_JS = """
    const blurIn = (sel, t) => tl.fromTo(sel, { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, t);
    const blurOut = (sel, t) => tl.to(sel, { opacity: 0, filter: "blur(6px)", duration: 0.18 }, t);
"""
def eixos():
    return (f'<line class="eixo" x1="{PX}" y1="{PY+PH}" x2="{PX+PW}" y2="{PY+PH}"/>'
            f'<line class="eixo" x1="{PX}" y1="{PY}" x2="{PX}" y2="{PY+PH}"/>'
            f'<text class="rot" x="{PX}" y="{PY+PH+40}">x = −1</text><text class="rot" x="{PX+PW}" y="{PY+PH+40}" text-anchor="end">x = 1</text>')
CLIP = f'<clipPath id="{{p}}-clip"><rect x="{PX}" y="{PY}" width="{PW}" height="{PH}"/></clipPath>'

# ---------------------------------------------------------------- cena 1: a verdade (9 s)
V1 = "A curva verdadeira existe."
V2 = f"Você só vê {N_TREINO} pontos dela, com ruído."
verdade_html = f"""<template>
  <style>{CSS_BASE}
    #ve-l2 {{ top: 920px; }}
  </style>
  <div id="root" data-composition-id="verdade" data-width="1920" data-height="1080">
    <div id="ve-l1" class="clip linha" data-start="0.3" data-duration="8.7"><span>{V1}</span></div>
    <div id="ve-svg" class="clip" data-start="0" data-duration="9">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {eixos()}
        <polyline id="ve-verdade" class="verdade" points="{VERDADE_SVG}" pathLength="1"/>
        <g id="ve-pts">{PONTOS_SVG}</g>
      </svg>
    </div>
    <div id="ve-l2" class="clip linha" data-start="4.2" data-duration="4.8" data-hold><span>{V2}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#ve-l1 span", 0.3);
    gsap.set("#ve-verdade", {{ strokeDasharray: 1, strokeDashoffset: 1 }});
    tl.fromTo("#ve-verdade", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }}, 0.6);
    tl.fromTo("#ve-pts circle", {{ opacity: 0, scale: 0.3, transformOrigin: "center" }}, {{ opacity: 1, scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(1.6)" }}, 4.4);
    tl.to("#ve-verdade", {{ opacity: 0.35, duration: 0.6 }}, 6.4);
    blurIn("#ve-l2 span", 4.2);
    window.__timelines["verdade"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cenas 2-4: um grau por cena
def cena_grau(cid, g, dur, l1, l2, l3, extra_js="", extra_html=""):
    preds = RES[N_TREINO][g]["preds"][:N_MOSTRADAS]
    fits = "\n".join(f'<polyline class="fit" id="{cid}-f{k}" points="{poli(p)}"/>' for k, p in enumerate(preds))
    media_svg = poli(RES[N_TREINO][g]["media"])
    r = RES[N_TREINO][g]
    return f"""<template>
  <style>{CSS_BASE}
    #{cid}-l2 {{ top: 920px; font-size: 48px; }} #{cid}-l3 {{ top: 920px; font-size: 48px; }}
  </style>
  <div id="root" data-composition-id="{cid}" data-width="1920" data-height="1080">
    <div id="{cid}-l1" class="clip linha" data-start="0" data-duration="{dur}"><span>{l1}</span></div>
    <div id="{cid}-svg" class="clip" data-start="0" data-duration="{dur}">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>{CLIP.format(p=cid)}</defs>
        {eixos()}
        <polyline class="verdade-fraca" points="{VERDADE_SVG}"/>
        <g clip-path="url(#{cid}-clip)">
          {fits}
          <polyline class="fit um" id="{cid}-f-um" points="{poli(preds[0])}"/>
          <polyline class="media" id="{cid}-media" points="{media_svg}"/>
        </g>
        <g>{PONTOS_SVG}</g>
        {extra_html}
      </svg>
    </div>
    <div id="{cid}-ro" class="clip readout" data-start="{dur*0.55:.1f}" data-duration="{dur - dur*0.55:.1f}">
      <div class="inner">
        <div class="t">viés²</div><div class="g">{dec(r['vies2'], 4)}</div>
        <div class="t">variância</div><div class="g">{dec(r['var'], 4 if r['var'] < 1 else 2)}</div>
        <div class="t">ruído (o chão)</div><div class="g">{dec(PISO, 3)}</div>
      </div>
    </div>
    <div id="{cid}-l2" class="clip linha" data-start="{dur*0.2:.1f}" data-duration="{dur*0.35:.1f}"><span>{l2}</span></div>
    <div id="{cid}-l3" class="clip linha" data-start="{dur*0.58:.1f}" data-duration="{dur - dur*0.58:.1f}" data-hold><span>{l3}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    const D = {dur};
    blurIn("#{cid}-l1 span", 0);
    gsap.set("#{cid}-media", {{ opacity: 0 }});
    gsap.set(".fit:not(.um)", {{ opacity: 0 }});
    gsap.set("#{cid}-f-um", {{ strokeDasharray: 1, strokeDashoffset: 1 }});
    tl.fromTo("#{cid}-f-um", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }}, 0.5);
    blurIn("#{cid}-l2 span", D * 0.2);
    tl.to("#{cid}-f-um", {{ opacity: 0.28, strokeWidth: 3, duration: 0.4 }}, D * 0.22);
    tl.fromTo(".fit:not(.um)", {{ opacity: 0 }}, {{ opacity: 0.28, duration: 0.25, stagger: 0.09 }}, D * 0.24);
    tl.fromTo("#{cid}-media", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5 }}, D * 0.55);
    tl.fromTo("#{cid}-ro .inner", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }}, D * 0.55);
    blurOut("#{cid}-l2 span", D * 0.55);
    blurIn("#{cid}-l3 span", D * 0.58);
    {extra_js}
    window.__timelines["{cid}"] = tl;
  </script>
</template>
"""

g1 = RES[N_TREINO][G_BAIXO]; g5 = RES[N_TREINO][JOELHO]; g15 = RES[N_TREINO][G_ALTO]
grau1 = cena_grau("grau1", G_BAIXO, 15,
    "Uma reta pelos 20 pontos.",
    f"E se os 20 pontos fossem outros? {N_MOSTRADAS} amostras, {N_MOSTRADAS} retas.",
    "Todas erram igual, no mesmo lugar. Isso é viés.")
grau15 = cena_grau("grau15", G_ALTO, 16,
    f"Um polinômio de grau {G_ALTO}: passa por todos os pontos.",
    f"Outros 20 pontos, {N_MOSTRADAS} vezes: cada amostra conta outra história.",
    f"Isso é variância. No treino, erro {dec(g15['tr'], 3)}: decorou o ruído.")
grau5 = cena_grau("grau5", JOELHO, 14,
    f"Grau {JOELHO}: o grau que o capítulo escolhe.",
    f"{N_MOSTRADAS} amostras: as curvas balançam pouco, e a média (laranja) quase é a verdade.",
    f"Chão: {dec(PISO, 3)}. Nenhum modelo passa dele.")

# ---------------------------------------------------------------- cena 5: a curva em U (18 s)
UX, UY, UW, UH = 300, 200, 1320, 640
LMIN, LMAX = -3, 1
def ux(g): return UX + (g - 1) / (GRAU_MAX - 1) * UW
def uy(v): return UY + UH - (math.log10(max(v, 1e-4)) - LMIN) / (LMAX - LMIN) * UH
def upoli(chave, n): return " ".join(f"{ux(g):.1f},{uy(RES[n][g][chave]):.1f}" for g in range(1, GRAU_MAX + 1))
U1 = "Grau por grau: o erro de treino só desce. O de validação vira."
U2 = f"Joelho no grau {JOELHO}. No grau {G_ALTO}, treino {dec(g15['tr'], 3)} (abaixo do chão), validação {dec(g15['va'], 1)}."
U3 = f"Com 3× mais dados o joelho não anda. O castigo do grau {G_ALTO} cai para {dec(RES[3*N_TREINO][G_ALTO]['va'], 3)}."
ticks = "".join(f'<text class="rot" x="{UX-14}" y="{uy(10**e)+10:.0f}" text-anchor="end">{dec(10**e, 3) if e < 0 else int(10**e)}</text>'
                f'<line class="eixo" x1="{UX-6}" y1="{uy(10**e):.0f}" x2="{UX}" y2="{uy(10**e):.0f}"/>' for e in range(LMIN, LMAX + 1))
curvau = f"""<template>
  <style>{CSS_BASE}
    .treino {{ fill: none; stroke: var(--treino); stroke-width: 5; }}
    .val {{ fill: none; stroke: var(--validacao); stroke-width: 5; }}
    .val.mais {{ stroke-dasharray: 14 10; }}
    .chao {{ stroke: var(--ink-faint); stroke-width: 3; stroke-dasharray: 8 8; }}
    .joelho {{ stroke: var(--ink); stroke-width: 3; stroke-dasharray: 6 6; }}
    .leg {{ font-size: 28px; font-family: Inter, sans-serif; font-weight: 600; }}
    #cu-l2, #cu-l3 {{ top: 920px; font-size: 44px; }}
  </style>
  <div id="root" data-composition-id="curvau" data-width="1920" data-height="1080">
    <div id="cu-l1" class="clip linha" data-start="0" data-duration="7"><span>{U1}</span></div>
    <div id="cu-svg" class="clip" data-start="0" data-duration="18">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <line class="eixo" x1="{UX}" y1="{UY+UH}" x2="{UX+UW}" y2="{UY+UH}"/><line class="eixo" x1="{UX}" y1="{UY}" x2="{UX}" y2="{UY+UH}"/>
        {ticks}
        {"".join(f'<text class="rot" x="{ux(g):.0f}" y="{UY+UH+40}" text-anchor="middle">{g}</text>' for g in range(1, GRAU_MAX+1))}
        <text class="rot" x="{UX+UW/2:.0f}" y="{UY+UH+80}" text-anchor="middle">grau do polinômio</text>
        <text class="rot" x="{UX}" y="{UY-16}">erro quadrático médio (escala log; mediana de {R} amostras)</text>
        <line id="cu-chao" class="chao" x1="{UX}" y1="{uy(PISO):.0f}" x2="{UX+UW}" y2="{uy(PISO):.0f}"/>
        <text id="cu-chao-t" class="rot" x="{UX+UW-10}" y="{uy(PISO)-12:.0f}" text-anchor="end">chão do ruído {dec(PISO, 3)}</text>
        <polyline id="cu-tr" class="treino" points="{upoli('tr', N_TREINO)}" pathLength="1"/>
        <polyline id="cu-va" class="val" points="{upoli('va', N_TREINO)}" pathLength="1"/>
        <polyline id="cu-va60" class="val mais" points="{upoli('va', 3*N_TREINO)}"/>
        <line id="cu-joelho" class="joelho" x1="{ux(JOELHO):.0f}" y1="{UY}" x2="{ux(JOELHO):.0f}" y2="{UY+UH}"/>
        <text class="leg" id="cu-leg-tr" x="{UX+30}" y="{UY+40}" style="fill: var(--treino)">treino</text>
        <text class="leg" id="cu-leg-va" x="{UX+30}" y="{UY+80}" style="fill: var(--validacao)">validação ({N_TREINO} pontos)</text>
        <text class="leg" id="cu-leg-va60" x="{UX+30}" y="{UY+120}" style="fill: var(--validacao)">validação ({3*N_TREINO} pontos)</text>
      </svg>
    </div>
    <div id="cu-l2" class="clip linha" data-start="7.2" data-duration="5.6" data-hold><span>{U2}</span></div>
    <div id="cu-l3" class="clip linha" data-start="13" data-duration="5" data-hold><span>{U3}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#cu-l1 span", 0);
    gsap.set(["#cu-tr", "#cu-va"], {{ strokeDasharray: 1, strokeDashoffset: 1 }});
    gsap.set(["#cu-joelho", "#cu-leg-va60", "#cu-va60"], {{ opacity: 0 }});
    tl.fromTo("#cu-tr", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: 5, ease: "none" }}, 0.8);
    tl.fromTo("#cu-va", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: 5, ease: "none" }}, 0.8);
    tl.fromTo("#cu-joelho", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 6.2);
    blurOut("#cu-l1 span", 6.8); blurIn("#cu-l2 span", 7.2);
    blurOut("#cu-l2 span", 12.6); blurIn("#cu-l3 span", 13);
    tl.fromTo("#cu-va60", {{ opacity: 0 }}, {{ opacity: 1, duration: 1.2, ease: "power2.out" }}, 13.2);
    tl.fromTo("#cu-leg-va60", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 13.2);
    window.__timelines["curvau"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 6: o diagnóstico (12 s)
D1 = "Erro alto e parecido nos dois: viés. Peça mais capacidade."
D2 = "Vão grande entre treino e validação: variância. Peça mais dados, ou menos liberdade."
D3 = "Erro no chão: ruído. Pare."
ideia = f"""<template>
  <style>{CSS_BASE}
    .linha {{ font-size: 58px; }}
    #id-l1 {{ top: 300px; }} #id-l2 {{ top: 460px; }} #id-l3 {{ top: 680px; color: var(--accent); }}
  </style>
  <div id="root" data-composition-id="ideia" data-width="1920" data-height="1080">
    <div id="id-l1" class="clip linha" data-start="0.3" data-duration="11.7" data-hold><span>{D1}</span></div>
    <div id="id-l2" class="clip linha" data-start="4" data-duration="8" data-hold><span>{D2}</span></div>
    <div id="id-l3" class="clip linha" data-start="8.4" data-duration="3.6" data-hold><span>{D3}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#id-l1 span", 0.3); blurIn("#id-l2 span", 4); blurIn("#id-l3 span", 8.4);
    window.__timelines["ideia"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- raiz
DUR = {"verdade": 9, "grau1": 15, "grau15": 16, "grau5": 14, "curvau": 18, "ideia": 12}
starts, t = {}, 0
for k, d in DUR.items():
    starts[k] = t; t += d
TOTAL = t
hosts = "\n".join(
    f'      <div id="{k}" data-composition-id="{k}" data-composition-src="compositions/{k}.html" data-start="{starts[k]}" '
    f'data-duration="{DUR[k]}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>'
    for k in DUR)
index = f"""<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      :root {{
        --ground: #F3F1EC; --papel: #FFFFFF; --ink: #1C2536; --ink-soft: #5B6578; --ink-faint: #B9C0CC;
        --accent: #4D4A8C; --acento2: #C96A1B; --ponto: #1C2536; --treino: #2F6DB5; --validacao: #C96A1B;
      }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: var(--ground); }}
      #fundo {{ position: absolute; inset: 0; background: var(--ground); }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
      <div id="fundo"></div>
{hosts}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""

(RAIZ / "compositions").mkdir(parents=True, exist_ok=True)
(RAIZ / "index.html").write_text(index, encoding="utf-8")
for nome, html in [("verdade", verdade_html), ("grau1", grau1), ("grau15", grau15), ("grau5", grau5),
                   ("curvau", curvau), ("ideia", ideia)]:
    (RAIZ / "compositions" / f"{nome}.html").write_text(html, encoding="utf-8")
(RAIZ / "hyperframes.json").write_text(json.dumps({
    "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
    "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
    "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"},
    "media": {"autoProxy": True}}, indent=2) + "\n", encoding="utf-8")
(RAIZ / "package.json").write_text(json.dumps({
    "name": "video-vies-variancia", "private": True, "type": "module",
    "scripts": {"dev": "npx --yes hyperframes@0.9.31 preview", "check": "npx --yes hyperframes@0.9.31 check",
                "render": "npx --yes hyperframes@0.9.31 render"}}, indent=2) + "\n", encoding="utf-8")
(RAIZ / ".gitignore").write_text(".hyperframes/\nnode_modules/\n*.mp4\n", encoding="utf-8")
print("projeto escrito:", RAIZ, "| duração total:", TOTAL, "s | joelho: grau", JOELHO)
for g in (G_BAIXO, JOELHO, G_ALTO):
    r = RES[N_TREINO][g]
    print(f"  grau {g:2d}: viés² {r['vies2']:.4f} var {r['var']:.4f} treino {r['tr']:.4f} validação {r['va']:.4f}")
print(f"  grau {G_ALTO} com {3*N_TREINO} pontos: validação {RES[3*N_TREINO][G_ALTO]['va']:.4f}")
