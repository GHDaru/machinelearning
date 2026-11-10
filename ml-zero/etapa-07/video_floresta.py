"""Gera o projeto HyperFrames da animação "Floresta aleatória: por que a média para de mexer".

Os números vêm da `Arvore` e da `Floresta` da etapa 07 ajustadas nos dados sintéticos de
inadimplência da etapa 00, com seed fixa: as 30 respostas de árvores fundas treinadas em
reamostragens bootstrap, a média acumulada delas, a AUC de cada árvore sozinha contra a
da floresta, e a variação entre cinco sementes. Nada é ilustrativo, exceto a ordem em que
os atributos aparecem sorteados na cena 4 (dita como tal na própria cena).
Regenere com `python etapa-07/video_floresta.py` e renderize com
`cd etapa-07/video-floresta && npx hyperframes render -o floresta.mp4`.
"""
from __future__ import annotations

import json
import pathlib
import random
import statistics as st
import sys

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent / "etapa-00"))
sys.path.insert(0, str(AQUI))
from dados import gerar, dividir  # noqa: E402
from arvores import Arvore, Floresta, auc  # noqa: E402

RAIZ = AQUI / "video-floresta"
CLIENTE = {"renda": 2500, "meses": 4, "uso": 0.60}
_cli = [2500.0, 4.0, 0.60]

# ------------------------------------------------------------------ os números
dados_ = gerar(n=4000)
treino, _validacao, teste = dividir(dados_)
X = [list(c) for c in treino.X]
y = [float(v) for v in treino.y]
Xte, yte = [list(c) for c in teste.X], teste.y
N = len(y)

funda = Arvore(max_profundidade=8, min_folha=5).fit(X, y)
P_FUNDA = round(funda.predict_proba([_cli])[0], 3)
AUC_FUNDA = round(auc(yte, funda.predict_proba(Xte)), 3)

_rng = random.Random(0)
RESPOSTAS = []
for _k in range(30):
    _am = [_rng.randrange(N) for _ in range(N)]
    _a = Arvore(max_profundidade=8, min_folha=5).fit([X[i] for i in _am], [y[i] for i in _am])
    RESPOSTAS.append(round(_a.predict_proba([_cli])[0], 3))
MEDIA_ACUM = [round(st.mean(RESPOSTAS[: k + 1]), 3) for k in range(30)]
DESVIO_RESP = round(st.pstdev(RESPOSTAS), 3)

floresta = Floresta(n_arvores=30, max_profundidade=8, min_folha=5, seed=0).fit(X, y)
P_FLORESTA = round(floresta.predict_proba([_cli])[0], 3)
AUC_FLORESTA = round(auc(yte, floresta.predict_proba(Xte)), 3)
AUC_INDIVIDUAL = round(st.mean(auc(yte, a.predict_proba(Xte)) for a in floresta.arvores), 3)

def _entre_sementes(fabrica, bootstrap):
    ps, aucs = [], []
    for s in range(5):
        if bootstrap:
            r = random.Random(s); am = [r.randrange(N) for _ in range(N)]
            m = fabrica(s).fit([X[i] for i in am], [y[i] for i in am])
        else:
            m = fabrica(s).fit(X, y)
        ps.append(m.predict_proba([_cli])[0]); aucs.append(auc(yte, m.predict_proba(Xte)))
    return round(st.pstdev(ps), 3), round(st.pstdev(aucs), 3), (round(min(ps), 2), round(max(ps), 2))
DESV_CLI_ARV, DESV_AUC_ARV, FAIXA_ARV = _entre_sementes(lambda s: Arvore(8, 5, seed=s), True)
DESV_CLI_FLO, DESV_AUC_FLO, FAIXA_FLO = _entre_sementes(lambda s: Floresta(30, 8, 5, seed=s), False)

# amostra bootstrap para a cena 2: 60 clientes, sorteados com reposição (seed fixa)
_r2 = random.Random(3)
AMOSTRA = [_r2.randrange(60) for _ in range(60)]
# seis árvores mostradas na cena 2: as quatro primeiras respostas e os dois extremos
I_EXTREMOS = [RESPOSTAS.index(min(RESPOSTAS)), RESPOSTAS.index(max(RESPOSTAS))]
MOSTRADAS = [0, 1, 2, 3] + I_EXTREMOS

def fmt(n): return f"{n:,}".replace(",", " ")
def dec(v, casas): return f"{v:.{casas}f}".replace(".", ",")
def pct(p): return f"{round(p*100)}%"

CSS_BASE = """
    #root { position: absolute; inset: 0; background: var(--ground); font-family: Inter, sans-serif; color: var(--ink); }
    .linha { position: absolute; left: 160px; right: 160px; text-align: center; font-weight: 700;
             font-size: 56px; letter-spacing: -0.02em; line-height: 1.15; top: 60px; }
    .linha span { display: inline-block; }
    .mono { font-family: "IBM Plex Mono", monospace; }
    .pos { fill: var(--pagou); } .neg { fill: var(--naopagou); }
"""
BLUR_JS = """
    const blurIn = (sel, t) => tl.fromTo(sel, { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, t);
    const blurOut = (sel, t) => tl.to(sel, { opacity: 0, filter: "blur(6px)", duration: 0.18 }, t);
"""

# ---------------------------------------------------------------- cena 1: a pergunta (7 s)
L1 = "Uma árvore funda, treinada em tudo, respondeu " + dec(P_FUNDA, 2) + "."
L2 = "Quanto você confia nesse número?"
pergunta = f"""<template>
  <style>
    {CSS_BASE}
    #pg-card {{ position: absolute; left: 600px; top: 330px; width: 720px; padding: 40px 48px; border-radius: 24px;
               background: var(--papel); box-shadow: 0 20px 60px rgba(28,37,54,.12); }}
    #pg-card .rot {{ font-size: 28px; color: var(--ink-soft); letter-spacing: .08em; text-transform: uppercase; font-weight: 600; }}
    #pg-card .campo {{ display: flex; justify-content: space-between; font-size: 40px; margin-top: 22px; }}
    #pg-card .campo b {{ font-family: "IBM Plex Mono", monospace; font-weight: 600; }}
    #pg-resp {{ position: absolute; left: 0; right: 0; top: 700px; text-align: center; font-family: "IBM Plex Mono", monospace;
               font-size: 120px; font-weight: 600; color: var(--accent); }}
    #pg-l2 {{ top: 880px; }}
  </style>
  <div id="root" data-composition-id="pergunta" data-width="1920" data-height="1080">
    <div id="pg-card" class="clip" data-start="0" data-duration="7" data-hold>
      <div class="inner">
        <div class="rot">cliente nº 2 do notebook</div>
        <div class="campo"><span>renda mensal</span><b>R$ {fmt(CLIENTE['renda'])}</b></div>
        <div class="campo"><span>meses de relacionamento</span><b>{CLIENTE['meses']}</b></div>
        <div class="campo"><span>uso do limite</span><b>{int(CLIENTE['uso']*100)}%</b></div>
      </div>
    </div>
    <div id="pg-l1" class="clip linha" data-start="0.4" data-duration="6.6"><span>{L1}</span></div>
    <div id="pg-resp" class="clip" data-start="1.6" data-duration="5.4"><span>{dec(P_FUNDA, 2)}</span></div>
    <div id="pg-l2" class="clip linha" data-start="4" data-duration="3"><span>{L2}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#pg-l1 span", 0.4);
    tl.fromTo("#pg-resp span", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }}, 1.6);
    blurIn("#pg-l2 span", 4);
    window.__timelines["pergunta"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 2: reamostrar (17 s)
R1 = "Sorteie os " + fmt(N) + " clientes de novo, com reposição, e treine a mesma árvore."
R2 = "A mesma árvore, dados reamostrados: de " + dec(min(RESPOSTAS), 2) + " a " + dec(max(RESPOSTAS), 2) + " para o mesmo cliente."
# a fileira original (60 pontos) e a fileira sorteada
def fileira(idc, y0, prefixo, cores):
    out = []
    for i in range(60):
        x = 300 + i * 22
        out.append(f'<circle id="{prefixo}-{i}" cx="{x}" cy="{y0}" r="8" fill="{cores[i]}"/>')
    return "\n".join(out)
_rc = random.Random(11)
CORES = [("var(--naopagou)" if _rc.random() < 0.19 else "var(--pagou)") for _ in range(60)]
CORES_AMOSTRA = [CORES[j] for j in AMOSTRA]
faltam = sorted(set(range(60)) - set(AMOSTRA))
repetidos = sorted({j for j in AMOSTRA if AMOSTRA.count(j) > 1})
def mini_arvore(prefixo, x0, y0):
    # uma arvorezinha de 7 nós: raiz, 2 filhos, 4 folhas
    pts = {"r": (x0, y0), "a": (x0-60, y0+55), "b": (x0+60, y0+55),
           "aa": (x0-90, y0+110), "ab": (x0-30, y0+110), "ba": (x0+30, y0+110), "bb": (x0+90, y0+110)}
    linhas = [("r","a"),("r","b"),("a","aa"),("a","ab"),("b","ba"),("b","bb")]
    svg = [f'<line class="galho" x1="{pts[a][0]}" y1="{pts[a][1]}" x2="{pts[b][0]}" y2="{pts[b][1]}"/>' for a,b in linhas]
    svg += [f'<circle class="no" cx="{p[0]}" cy="{p[1]}" r="10"/>' for p in pts.values()]
    return f'<g id="{prefixo}" class="mini">' + "".join(svg) + "</g>"
colunas = []
for k, idx in enumerate(MOSTRADAS):
    cx = 300 + k * 265 + 100
    colunas.append(f"""
        <g id="ra-col-{k}">
          <text class="rot" x="{cx}" y="600" text-anchor="middle">amostra {idx+1}</text>
          {mini_arvore(f"ra-tree-{k}", cx, 640)}
          <text id="ra-ans-{k}" class="ans" x="{cx}" y="840" text-anchor="middle">{dec(RESPOSTAS[idx], 2)}</text>
        </g>""")
reamostra = f"""<template>
  <style>
    {CSS_BASE}
    #ra-svg {{ position: absolute; inset: 0; }}
    .rot {{ font-size: 28px; fill: var(--ink-soft); font-family: Inter, sans-serif; }}
    .galho {{ stroke: var(--ink-faint); stroke-width: 4; }}
    .no {{ fill: var(--papel); stroke: var(--accent); stroke-width: 4; }}
    .ans {{ font-family: "IBM Plex Mono", monospace; font-size: 56px; font-weight: 600; fill: var(--accent); }}
    #ra-l2 {{ top: 920px; font-size: 48px; }}
    .etq {{ font-size: 28px; fill: var(--ink-soft); font-family: Inter, sans-serif; }}
  </style>
  <div id="root" data-composition-id="reamostra" data-width="1920" data-height="1080">
    <div id="ra-l1" class="clip linha" data-start="0" data-duration="4.4"><span>{R1}</span></div>
    <div id="ra-svg" class="clip" data-start="0" data-duration="17">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <text class="etq" x="300" y="265">os {fmt(N)} clientes do treino (60 mostrados)</text>
        <g id="ra-orig">{fileira(None, 300, "ra-o", CORES)}</g>
        <text class="etq" id="ra-etq2" x="300" y="395" opacity="0">a amostra sorteada: alguns entram duas vezes, outros ficam de fora</text>
        <g id="ra-boot">{fileira(None, 430, "ra-b", CORES_AMOSTRA)}</g>
        {"".join(colunas)}
      </svg>
    </div>
    <div id="ra-l2" class="clip linha" data-start="12.6" data-duration="4.4" data-hold><span>{R2}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#ra-l1 span", 0);
    tl.fromTo("#ra-orig circle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3, stagger: 0.01 }}, 0.3);
    // o sorteio: cada posição da fileira de baixo "cai" da posição sorteada da de cima
    const amostra = {json.dumps(AMOSTRA)};
    tl.fromTo("#ra-etq2", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 1.6);
    amostra.forEach((j, i) => {{
      tl.fromTo("#ra-b-" + i, {{ opacity: 0, attr: {{ cx: 300 + j * 22, cy: 300 }} }},
        {{ opacity: 1, attr: {{ cx: 300 + i * 22, cy: 430 }}, duration: 0.45, ease: "power2.out" }}, 1.8 + i * 0.03);
    }});
    const faltam = {json.dumps(faltam)};
    tl.to(faltam.map(j => "#ra-o-" + j), {{ opacity: 0.18, duration: 0.3 }}, 4.0);
    blurOut("#ra-l1 span", 4.2);
    // as seis árvores crescem, uma por vez, cada uma com a sua resposta
    for (let k = 0; k < 6; k++) {{
      const t = 4.8 + k * 1.25;
      tl.fromTo("#ra-col-" + k + " .rot", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, t);
      tl.fromTo("#ra-tree-" + k + " .galho", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.25, stagger: 0.06 }}, t + 0.1);
      tl.fromTo("#ra-tree-" + k + " .no", {{ opacity: 0, scale: 0.4, transformOrigin: "center" }}, {{ opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.6)" }}, t + 0.15);
      tl.fromTo("#ra-ans-" + k, {{ opacity: 0, scale: 0.6, transformOrigin: "center" }}, {{ opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }}, t + 0.7);
    }}
    tl.to(["#ra-ans-4", "#ra-ans-5"], {{ fill: "#B3402C", duration: 0.3 }}, 12.6);
    blurIn("#ra-l2 span", 12.6);
    window.__timelines["reamostra"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 3: a média (18 s)
M1 = "Trinta respostas instáveis. Uma média que para de mexer."
M2 = f"Cada árvore sozinha: AUC {dec(AUC_INDIVIDUAL, 3)}. A média das trinta: {dec(AUC_FLORESTA, 3)}."
GX, GY, GW, GH = 300, 230, 1320, 560
def gx(k): return GX + (k - 1) / 29 * GW
def gy(p): return GY + GH - p * GH
pontos_svg = "\n".join(f'<circle id="me-p-{k}" cx="{gx(k+1):.1f}" cy="{gy(RESPOSTAS[k]):.1f}" r="9" class="ind"/>' for k in range(30))
caminho = " ".join(f"{'M' if k == 0 else 'L'}{gx(k+1):.1f},{gy(MEDIA_ACUM[k]):.1f}" for k in range(30))
media = f"""<template>
  <style>
    {CSS_BASE}
    #me-svg {{ position: absolute; inset: 0; }}
    .eixo {{ stroke: var(--ink-soft); stroke-width: 2; }}
    .rot {{ font-size: 28px; fill: var(--ink-soft); font-family: Inter, sans-serif; }}
    .ind {{ fill: var(--ink-faint); }}
    #me-linha {{ fill: none; stroke: var(--accent); stroke-width: 6; stroke-linejoin: round; }}
    #me-readout {{ position: absolute; left: 1270px; top: 250px; width: 380px; padding: 22px 26px; border-radius: 18px;
                   background: var(--papel); box-shadow: 0 12px 40px rgba(28,37,54,.12); font-size: 28px; }}
    #me-readout .g {{ font-family: "IBM Plex Mono", monospace; font-size: 48px; font-weight: 600; color: var(--accent); }}
    #me-l2 {{ top: 900px; font-size: 44px; }}
  </style>
  <div id="root" data-composition-id="media" data-width="1920" data-height="1080">
    <div id="me-l1" class="clip linha" data-start="0" data-duration="10"><span>{M1}</span></div>
    <div id="me-svg" class="clip" data-start="0" data-duration="18">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <line class="eixo" x1="{GX}" y1="{GY+GH}" x2="{GX+GW}" y2="{GY+GH}"/>
        <line class="eixo" x1="{GX}" y1="{GY}" x2="{GX}" y2="{GY+GH}"/>
        <text class="rot" x="{GX-14}" y="{GY+10}" text-anchor="end">1,0</text>
        <text class="rot" x="{GX-14}" y="{GY+GH+8}" text-anchor="end">0,0</text>
        <text class="rot" x="{GX-14}" y="{gy(0.5)+10:.0f}" text-anchor="end">0,5</text>
        <text class="rot" x="{GX}" y="{GY+GH+40}">1 árvore</text>
        <text class="rot" x="{GX+GW}" y="{GY+GH+40}" text-anchor="end">30 árvores</text>
        <text class="rot" x="{GX}" y="{GY-16}">resposta de cada árvore ao cliente (cinza) e a média acumulada (roxo)</text>
        {pontos_svg}
        <path id="me-linha" d="{caminho}" pathLength="1"/>
      </svg>
    </div>
    <div id="me-readout" class="clip" data-start="0.8" data-duration="17.2">
      <div class="inner">
        <div>média de <b id="me-k" class="mono">1</b> árvore(s)</div>
        <div class="g" id="me-m">{dec(MEDIA_ACUM[0], 3)}</div>
      </div>
    </div>
    <div id="me-l2" class="clip linha" data-start="11" data-duration="7" data-hold><span>{M2}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    const medias = {json.dumps(MEDIA_ACUM)};
    blurIn("#me-l1 span", 0);
    tl.fromTo("#me-readout .inner", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }}, 0.8);
    gsap.set("#me-linha", {{ strokeDasharray: 1, strokeDashoffset: 1 }});
    const prog = {{ k: 0 }};
    const aplicar = () => {{
      const k = Math.max(1, Math.min(30, Math.round(prog.k)));
      document.getElementById("me-k").textContent = k;
      document.getElementById("me-m").textContent = medias[k - 1].toFixed(3).replace(".", ",");
    }};
    for (let k = 0; k < 30; k++) {{
      tl.fromTo("#me-p-" + k, {{ opacity: 0, scale: 0.3, transformOrigin: "center" }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, 1 + k * 0.28);
    }}
    tl.fromTo("#me-linha", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: 29 * 0.28, ease: "none" }}, 1.28);
    tl.fromTo(prog, {{ k: 1 }}, {{ k: 30, duration: 29 * 0.28, ease: "none", onUpdate: aplicar }}, 1.28);
    blurOut("#me-l1 span", 9.8);
    blurIn("#me-l2 span", 11);
    window.__timelines["media"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 4: atributos sorteados (10 s)
A1 = "O segundo sorteio: em cada corte, só um atributo pode concorrer."
A2 = "Sem isso as árvores se parecem demais, e a média de iguais não ajuda."
ORDEM = ["uso", "renda", "meses"]   # ordem ilustrativa, dita na cena
cards = "".join(f'<div class="atr" id="at-{n}"><span>{n}</span></div>' for n in ["renda", "meses", "uso"])
atributos = f"""<template>
  <style>
    {CSS_BASE}
    #at-wrap {{ position: absolute; left: 0; right: 0; top: 230px; display: flex; justify-content: center; gap: 40px; }}
    .atr {{ width: 300px; height: 110px; border-radius: 18px; background: var(--papel); box-shadow: 0 10px 30px rgba(28,37,54,.12);
            display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 600; color: var(--ink-soft);
            border: 5px solid transparent; }}
    .atr.on {{ color: var(--accent); border-color: var(--accent); }}
    #at-svg {{ position: absolute; inset: 0; }}
    .galho {{ stroke: var(--ink-faint); stroke-width: 5; }}
    .no {{ fill: var(--papel); stroke: var(--accent); stroke-width: 5; }}
    .etq {{ font-family: "IBM Plex Mono", monospace; font-size: 30px; fill: var(--accent); font-weight: 600; }}
    #at-nota {{ position: absolute; left: 0; right: 0; top: 860px; text-align: center; font-size: 28px; color: var(--ink-soft); }}
    #at-l2 {{ top: 920px; font-size: 44px; }}
  </style>
  <div id="root" data-composition-id="atributos" data-width="1920" data-height="1080">
    <div id="at-l1" class="clip linha" data-start="0" data-duration="5.6"><span>{A1}</span></div>
    <div id="at-wrap" class="clip" data-start="0.4" data-duration="9.6"><div class="inner" style="display:flex; gap:40px;">{cards}</div></div>
    <div id="at-svg" class="clip" data-start="1" data-duration="9">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <line class="galho" x1="960" y1="460" x2="760" y2="620"/><line class="galho" x1="960" y1="460" x2="1160" y2="620"/>
        <line class="galho" x1="760" y1="620" x2="660" y2="760"/><line class="galho" x1="760" y1="620" x2="860" y2="760"/>
        <line class="galho" x1="1160" y1="620" x2="1060" y2="760"/><line class="galho" x1="1160" y1="620" x2="1260" y2="760"/>
        <circle class="no" id="at-n0" cx="960" cy="460" r="22"/><text class="etq" id="at-e0" x="996" y="470" opacity="0">sorteou: {ORDEM[0]}</text>
        <circle class="no" id="at-n1" cx="760" cy="620" r="22"/><text class="etq" id="at-e1" x="724" y="630" text-anchor="end" opacity="0">sorteou: {ORDEM[1]}</text>
        <circle class="no" id="at-n2" cx="1160" cy="620" r="22"/><text class="etq" id="at-e2" x="1196" y="630" opacity="0">sorteou: {ORDEM[2]}</text>
        <circle class="no" cx="660" cy="760" r="16"/><circle class="no" cx="860" cy="760" r="16"/><circle class="no" cx="1060" cy="760" r="16"/><circle class="no" cx="1260" cy="760" r="16"/>
      </svg>
    </div>
    <div id="at-nota" class="clip" data-start="1" data-duration="9"><span>com 3 atributos, √3 ≈ 1 por corte (o padrão da Floresta do ml-zero); a ordem acima é só ilustrativa</span></div>
    <div id="at-l2" class="clip linha" data-start="6" data-duration="4" data-hold><span>{A2}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#at-l1 span", 0);
    tl.fromTo("#at-wrap .atr", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "expo.out" }}, 0.4);
    tl.fromTo("#at-svg svg", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4 }}, 1);
    tl.fromTo("#at-nota span", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 1.2);
    const ordem = {json.dumps(ORDEM)};
    ordem.forEach((n, i) => {{
      const t = 1.8 + i * 1.3;
      tl.call(() => {{ document.querySelectorAll("#at-wrap .atr").forEach(e => e.classList.remove("on")); document.getElementById("at-" + n).classList.add("on"); }}, null, t);
      tl.call(() => {{ document.getElementById("at-" + n).classList.remove("on"); }}, null, t - 0.01);
      tl.fromTo("#at-e" + i, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.25 }}, t + 0.2);
      tl.fromTo("#at-n" + i, {{ attr: {{ r: 22 }} }}, {{ attr: {{ r: 30 }}, duration: 0.3, ease: "back.out(2)" }}, t);
    }});
    blurOut("#at-l1 span", 5.4);
    blurIn("#at-l2 span", 6);
    window.__timelines["atributos"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 5: resultado (12 s)
S1 = "Cinco sementes diferentes. O que muda?"
S2 = "A floresta não é mais esperta. É mais estável."
linhas_tab = [
    ("árvore funda", dec(P_FUNDA, 2), f"{dec(FAIXA_ARV[0], 2)} a {dec(FAIXA_ARV[1], 2)}", "±" + dec(DESV_CLI_ARV, 3), dec(AUC_FUNDA, 3), "±" + dec(DESV_AUC_ARV, 3)),
    ("floresta de 30", dec(P_FLORESTA, 2), f"{dec(FAIXA_FLO[0], 2)} a {dec(FAIXA_FLO[1], 2)}", "±" + dec(DESV_CLI_FLO, 3), dec(AUC_FLORESTA, 3), "±" + dec(DESV_AUC_FLO, 3)),
]
cab = ["", "resposta ao cliente", "faixa em 5 sementes", "desvio", "AUC no teste", "desvio da AUC"]
def _td(j, v):
    return f'<td class="mono">{v}</td>' if j else f"<td>{v}</td>"
tabela = "<tr>" + "".join(f"<th>{c}</th>" for c in cab) + "</tr>" + "".join(
    f'<tr id="re-r{i}">' + "".join(_td(j, v) for j, v in enumerate(r)) + "</tr>" for i, r in enumerate(linhas_tab))
resultado = f"""<template>
  <style>
    {CSS_BASE}
    #re-tab {{ position: absolute; left: 160px; right: 160px; top: 280px; }}
    table {{ width: 100%; border-collapse: separate; border-spacing: 0 16px; font-size: 34px; }}
    th {{ font-weight: 600; color: var(--ink-soft); font-size: 28px; text-align: center; letter-spacing: .03em; text-transform: uppercase; }}
    td {{ background: var(--papel); padding: 26px 18px; text-align: center; box-shadow: 0 8px 24px rgba(28,37,54,.08); }}
    td:first-child {{ text-align: left; font-weight: 700; border-radius: 16px 0 0 16px; }}
    td:last-child {{ border-radius: 0 16px 16px 0; }}
    #re-r1 td {{ color: var(--accent); }}
    #re-l2 {{ top: 760px; }}
    #re-l3 {{ top: 880px; font-size: 40px; color: var(--ink-soft); }}
  </style>
  <div id="root" data-composition-id="resultado" data-width="1920" data-height="1080">
    <div id="re-l1" class="clip linha" data-start="0" data-duration="5"><span>{S1}</span></div>
    <div id="re-tab" class="clip" data-start="0.6" data-duration="11.4"><div class="inner"><table>{tabela}</table></div></div>
    <div id="re-l2" class="clip linha" data-start="5.4" data-duration="6.6" data-hold><span>{S2}</span></div>
    <div id="re-l3" class="clip linha" data-start="8" data-duration="4" data-hold><span>A resposta variou {round(DESV_CLI_ARV / DESV_CLI_FLO, 1)}× menos; a AUC, {round(DESV_AUC_ARV / DESV_AUC_FLO, 1)}×.</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#re-l1 span", 0);
    tl.fromTo("#re-tab th", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 0.6);
    tl.fromTo("#re-r0 td", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "expo.out" }}, 1.2);
    tl.fromTo("#re-r1 td", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "expo.out" }}, 2.6);
    blurOut("#re-l1 span", 4.8);
    blurIn("#re-l2 span", 5.4);
    blurIn("#re-l3 span", 8);
    window.__timelines["resultado"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 6: a ideia (8 s)
I1 = "Trinta árvores erradas de jeitos diferentes."
I2 = "A média cancela o erro que não se repete."
I3 = "Daí \"aleatória\": amostra e atributos sorteados, de propósito."
ideia = f"""<template>
  <style>
    {CSS_BASE}
    .linha {{ font-size: 66px; }}
    #id-l1 {{ top: 330px; }} #id-l2 {{ top: 470px; }} #id-l3 {{ top: 660px; color: var(--accent); font-size: 56px; }}
  </style>
  <div id="root" data-composition-id="ideia" data-width="1920" data-height="1080">
    <div id="id-l1" class="clip linha" data-start="0.3" data-duration="7.7"><span>{I1}</span></div>
    <div id="id-l2" class="clip linha" data-start="2.6" data-duration="5.4"><span>{I2}</span></div>
    <div id="id-l3" class="clip linha" data-start="5" data-duration="3" data-hold><span>{I3}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {BLUR_JS}
    blurIn("#id-l1 span", 0.3); blurIn("#id-l2 span", 2.6); blurIn("#id-l3 span", 5);
    window.__timelines["ideia"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- raiz
DUR = {"pergunta": 7, "reamostra": 17, "media": 18, "atributos": 10, "resultado": 12, "ideia": 8}
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
        --accent: #4D4A8C; --pagou: #2E7D4F; --naopagou: #B3402C;
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
for nome, html in [("pergunta", pergunta), ("reamostra", reamostra), ("media", media),
                   ("atributos", atributos), ("resultado", resultado), ("ideia", ideia)]:
    (RAIZ / "compositions" / f"{nome}.html").write_text(html, encoding="utf-8")
(RAIZ / "hyperframes.json").write_text(json.dumps({
    "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
    "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
    "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"},
    "media": {"autoProxy": True}}, indent=2) + "\n", encoding="utf-8")
(RAIZ / "package.json").write_text(json.dumps({
    "name": "video-floresta", "private": True, "type": "module",
    "scripts": {"dev": "npx --yes hyperframes@0.9.31 preview", "check": "npx --yes hyperframes@0.9.31 check",
                "render": "npx --yes hyperframes@0.9.31 render"}}, indent=2) + "\n", encoding="utf-8")
(RAIZ / ".gitignore").write_text(".hyperframes/\nnode_modules/\n*.mp4\n", encoding="utf-8")
print("projeto escrito:", RAIZ, "| duração total:", TOTAL, "s")
print("números:", dict(P_FUNDA=P_FUNDA, P_FLORESTA=P_FLORESTA, AUC_FUNDA=AUC_FUNDA, AUC_FLORESTA=AUC_FLORESTA,
      AUC_INDIVIDUAL=AUC_INDIVIDUAL, DESVIO_RESP=DESVIO_RESP, DESV_CLI=(DESV_CLI_ARV, DESV_CLI_FLO), DESV_AUC=(DESV_AUC_ARV, DESV_AUC_FLO)))
