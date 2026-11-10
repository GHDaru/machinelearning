"""Gera o projeto HyperFrames da animação "Árvore de decisão: o caso da inadimplência".

Os números da animação (corte da raiz, cortes dos filhos, contagens e taxas por nó,
impureza de Gini ao varrer o atributo, a folha do cliente) vêm da `Arvore` da etapa 07
ajustada nos dados sintéticos de inadimplência da etapa 00, com seed fixa. Nada é
ilustrativo: regenere com `python etapa-07/video_arvore.py` e renderize com
`cd etapa-07/video-arvore && npx hyperframes render -o arvore_decisao.mp4`
(precisa de Node 22+ e FFmpeg; a primeira execução baixa o HyperFrames).
"""
from __future__ import annotations

import json
import pathlib
import random
import sys

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent / "etapa-00"))
sys.path.insert(0, str(AQUI))
from dados import gerar, dividir  # noqa: E402
from arvores import Arvore, _gini  # noqa: E402

RAIZ = AQUI / "video-arvore"

# ------------------------------------------------------------------ os números
dados_ = gerar(n=4000)
treino, _validacao, _teste = dividir(dados_)
X = [list(c) for c in treino.X]
y = [float(v) for v in treino.y]
arv = Arvore(max_profundidade=2, min_folha=10).fit(X, y)

def _contagem(idx):
    n = len(idx); n1 = int(sum(y[i] for i in idx)); return n, round(n1 / n, 3)

raiz = arv.raiz
_idx = list(range(len(y)))
_esq = [i for i in _idx if X[i][raiz.atributo] <= raiz.limiar]
_dir = [i for i in _idx if X[i][raiz.atributo] > raiz.limiar]
def _split(no, idx):
    return ([i for i in idx if X[i][no.atributo] <= no.limiar], [i for i in idx if X[i][no.atributo] > no.limiar])
_ee, _ed = _split(raiz.esquerda, _esq)
_de, _dd = _split(raiz.direita, _dir)
assert raiz.atributo == 2 and raiz.esquerda.atributo == 0 and raiz.direita.atributo == 0, "a árvore mudou de forma; revise o roteiro"

# curva de impureza ponderada ao varrer o atributo da raiz (uso do limite)
_a = raiz.atributo
_ord = sorted(_idx, key=lambda i: X[i][_a])
_n, _tot, _s, _curva = len(y), sum(y), 0.0, []
for k in range(1, _n):
    _s += y[_ord[k - 1]]
    if X[_ord[k]][_a] == X[_ord[k - 1]][_a]:
        continue
    imp = (k / _n) * _gini(int(_s), k) + ((_n - k) / _n) * _gini(int(_tot - _s), _n - k)
    _curva.append((round((X[_ord[k]][_a] + X[_ord[k - 1]][_a]) / 2, 4), round(imp, 4)))
CURVA = _curva[::max(1, len(_curva) // 60)]

# amostra determinística de 260 clientes para a dispersão
_rng = random.Random(7)
PONTOS = [[round(X[i][2], 3), round(X[i][0]), int(y[i])] for i in _rng.sample(_idx, 260)]

CORTE_USO = round(raiz.limiar, 4)
GINI_PAI = round(_gini(int(_tot), _n), 3)
GINI_MELHOR = round(min(c[1] for c in _curva), 3)
NO = {"raiz": _contagem(_idx), "esq": _contagem(_esq), "dir": _contagem(_dir),
      "ee": _contagem(_ee), "ed": _contagem(_ed), "de": _contagem(_de), "dd": _contagem(_dd)}
CORTE_ESQ, CORTE_DIR = round(raiz.esquerda.limiar), round(raiz.direita.limiar)
CLIENTE = {"renda": 2500, "meses": 4, "uso": 0.60}
P_LOGISTICA = 0.347   # regressao_logistica_inadimplencia.ipynb, seção 5
P_ARVORE = round(arv.predict_proba([[2500.0, 4.0, 0.60]])[0], 3)

# --- números da árvore (saída de arvores.Arvore, profundidade 2, min_folha 10, treino 2399)

# --- geometria do gráfico de dispersão (compartilhada pelas cenas 2 e 3)
PX, PY, PW, PH = 300, 230, 1320, 620
RENDA_MAX = 12000
def sx(uso): return PX + uso * PW
def sy(renda): return PY + PH - min(renda, RENDA_MAX) / RENDA_MAX * PH

def circulos(prefixo):
    esq, dir_ = [], []
    for i, (uso, renda, cls) in enumerate(PONTOS):
        c = f'<circle cx="{sx(uso):.1f}" cy="{sy(renda):.1f}" r="7" class="{"neg" if cls else "pos"}"/>'
        (dir_ if uso > CORTE_USO else esq).append(c)
    return "\n".join(esq), "\n".join(dir_)

def hold(texto):  # 0,5 s + 0,3 s por palavra (motion.md)
    return round(0.5 + 0.3 * len(texto.split()), 1)

def fmt(n): return f"{n:,}".replace(",", " ")
def dec(v, casas): return f"{v:.{casas}f}".replace(".", ",")
def pct(p): return f"{round(p*100)}%"

CSS_BASE = """
    #root { position: absolute; inset: 0; background: var(--ground); font-family: Inter, sans-serif; color: var(--ink); }
    .linha { position: absolute; left: 160px; right: 160px; text-align: center; font-weight: 700;
             font-size: 64px; letter-spacing: -0.02em; line-height: 1.15; }
    .linha span { display: inline-block; }
    .mono { font-family: "IBM Plex Mono", monospace; }
    .pos { fill: var(--pagou); } .neg { fill: var(--naopagou); }
"""

# ---------------------------------------------------------------- cena 1: a pergunta
pergunta = f"""<template>
  <style>
    {CSS_BASE}
    #pg-card {{ position: absolute; left: 600px; top: 300px; width: 720px; padding: 40px 48px; border-radius: 24px;
               background: var(--papel); box-shadow: 0 20px 60px rgba(28,37,54,.12); }}
    #pg-card .rot {{ font-size: 28px; color: var(--ink-soft); letter-spacing: .08em; text-transform: uppercase; font-weight: 600; }}
    #pg-card .campo {{ display: flex; justify-content: space-between; font-size: 40px; margin-top: 22px; }}
    #pg-card .campo b {{ font-family: "IBM Plex Mono", monospace; font-weight: 600; }}
    #pg-l1 {{ top: 110px; }}  #pg-l2 {{ top: 720px; }}
  </style>
  <div id="root" data-composition-id="pergunta" data-width="1920" data-height="1080">
    <div id="pg-l1" class="clip linha" data-start="0.4" data-duration="5.6"><span>Este cliente vai pagar a fatura?</span></div>
    <div id="pg-card" class="clip" data-start="0" data-duration="6" data-hold>
      <div class="inner">
        <div class="rot">cliente nº 2 do notebook</div>
        <div class="campo"><span>renda mensal</span><b>R$ {fmt(CLIENTE['renda'])}</b></div>
        <div class="campo"><span>meses de relacionamento</span><b>{CLIENTE['meses']}</b></div>
        <div class="campo"><span>uso do limite</span><b>{int(CLIENTE['uso']*100)}%</b></div>
      </div>
    </div>
    <div id="pg-l2" class="clip linha" data-start="3.2" data-duration="2.8"><span>A logística disse <em class="mono">{dec(P_LOGISTICA, 2)}</em>. E uma árvore?</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    tl.fromTo("#pg-l1 span", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, 0.4);
    tl.fromTo("#pg-l2 span", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, 3.2);
    window.__timelines["pergunta"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 2: o corte
c_esq, c_dir = circulos("ct")
# mini-curva de impureza, desenhada sob o gráfico (x = uso, y = gini ponderado)
MX, MY, MW, MH = 300, 905, 1320, 110
gmin, gmax = min(c[1] for c in CURVA), max(c[1] for c in CURVA)
def my(g): return MY + MH - (g - gmin) / (gmax - gmin) * MH
caminho = " ".join(f"{'M' if i == 0 else 'L'}{sx(u):.1f},{my(g):.1f}" for i, (u, g) in enumerate(CURVA))
curva_js = json.dumps(CURVA)
L1 = "Uma árvore faz uma pergunta de cada vez."
L2 = "Testa todos os cortes. Fica com o de menor impureza."
corte = f"""<template>
  <style>
    {CSS_BASE}
    #ct-l1 {{ top: 60px; }} #ct-l2 {{ top: 60px; }}
    #ct-plot {{ position: absolute; inset: 0; }}
    .eixo {{ stroke: var(--ink-soft); stroke-width: 2; }}
    .rotulo {{ font-size: 28px; fill: var(--ink-soft); font-family: Inter, sans-serif; }}
    #ct-linha {{ stroke: var(--accent); stroke-width: 5; stroke-linecap: round; }}
    #ct-trace {{ fill: none; stroke: var(--accent); stroke-width: 3; opacity: .45; }}
    #ct-marker {{ fill: var(--accent); }}
    #ct-readout {{ position: absolute; left: 1230px; top: 240px; width: 400px; padding: 22px 26px; border-radius: 18px;
                   background: var(--papel); box-shadow: 0 12px 40px rgba(28,37,54,.12); font-size: 28px; }}
    #ct-readout .g {{ font-family: "IBM Plex Mono", monospace; font-size: 44px; font-weight: 600; margin-top: 4px; }}
    #ct-readout .leg {{ color: var(--ink-soft); font-size: 28px; margin-top: 10px; }}
    #ct-legenda {{ position: absolute; left: 300px; top: 176px; font-size: 28px; color: var(--ink-soft); }}
    #ct-legenda i {{ display: inline-block; width: 16px; height: 16px; border-radius: 50%; margin: 0 8px 0 20px; }}
  </style>
  <div id="root" data-composition-id="corte" data-width="1920" data-height="1080">
    <div id="ct-l1" class="clip linha" data-start="0" data-duration="3.4"><span>{L1}</span></div>
    <div id="ct-plot" class="clip" data-start="0" data-duration="14">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <line class="eixo" x1="{PX}" y1="{PY+PH}" x2="{PX+PW}" y2="{PY+PH}"/>
        <line class="eixo" x1="{PX}" y1="{PY}" x2="{PX}" y2="{PY+PH}"/>
        <text class="rotulo" x="{PX+PW}" y="{PY+PH+36}" text-anchor="end">uso do limite →</text>
        <text class="rotulo" x="{PX-14}" y="{PY+10}" text-anchor="end">renda</text>
        <text class="rotulo" x="{PX-14}" y="{PY+PH+8}" text-anchor="end">0</text>
        <text class="rotulo" x="{PX}" y="{PY+PH+36}" text-anchor="start">0</text>
        <text class="rotulo" x="{PX+PW}" y="{PY+PH+36+36}" text-anchor="end">1</text>
        <g id="ct-pontos" opacity="0.85">
{c_esq}
{c_dir}
        </g>
        <path id="ct-trace" d="{caminho}"/>
        <circle id="ct-marker" cx="{sx(CURVA[0][0]):.1f}" cy="{my(CURVA[0][1]):.1f}" r="9" opacity="0"/>
        <line id="ct-linha" x1="{sx(CURVA[0][0]):.1f}" y1="{PY}" x2="{sx(CURVA[0][0]):.1f}" y2="{PY+PH}" opacity="0"/>
        <text id="ct-corte-txt" class="rotulo mono" x="{sx(CORTE_USO)+14:.1f}" y="{PY+34}" opacity="0" style="fill: var(--accent); font-weight: 600;">uso ≤ {dec(CORTE_USO, 3)}</text>
      </svg>
    </div>
    <div id="ct-legenda" class="clip" data-start="0.6" data-duration="13.4"><span><i style="background:var(--pagou)"></i>pagou <i style="background:var(--naopagou)"></i>não pagou</span></div>
    <div id="ct-readout" class="clip" data-start="3.4" data-duration="10.6">
      <div class="inner">
        <div>corte em uso = <b id="ct-u" class="mono">0,00</b></div>
        <div class="g">Gini <span id="ct-g">{dec(GINI_PAI, 3)}</span></div>
        <div class="leg">impureza média dos dois lados (o todo: {dec(GINI_PAI, 3)})</div>
      </div>
    </div>
    <div id="ct-l2" class="clip linha" data-start="11" data-duration="3"><span>{L2}</span></div>
  </div>
  <script>
    const curva = {curva_js};
    const PX = {PX}, PW = {PW};
    const fmt = v => v.toFixed(3).replace(".", ",");
    const tl = gsap.timeline({{ paused: true }});
    tl.fromTo("#ct-l1 span", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, 0);
    tl.to("#ct-l1 span", {{ opacity: 0, filter: "blur(6px)", duration: 0.2 }}, 3.2);
    tl.fromTo("#ct-pontos circle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5, stagger: {{ each: 0.004, from: "random" }}, ease: "power2.out" }}, 0.3);
    tl.fromTo("#ct-legenda span", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 0.6);
    tl.fromTo("#ct-readout .inner", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }}, 3.4);
    tl.fromTo(["#ct-linha", "#ct-marker"], {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, 3.4);
    // a varredura: tudo é função do progresso p
    const sweep = {{ p: 0 }};
    const aplicar = () => {{
      const i = Math.min(curva.length - 1, Math.floor(sweep.p * (curva.length - 1)));
      const [u, g] = curva[i];
      const x = PX + u * PW;
      gsap.set("#ct-linha", {{ attr: {{ x1: x, x2: x }} }});
      gsap.set("#ct-marker", {{ attr: {{ cx: x, cy: {MY} + {MH} - (g - {gmin}) / {gmax - gmin} * {MH} }} }});
      document.getElementById("ct-u").textContent = u.toFixed(2).replace(".", ",");
      document.getElementById("ct-g").textContent = fmt(g);
    }};
    tl.fromTo(sweep, {{ p: 0 }}, {{ p: 1, duration: 6.4, ease: "none", onUpdate: aplicar }}, 3.6);
    // volta ao melhor corte: a posição é função do tempo, via objeto proxy
    const melhor = [{CORTE_USO}, {GINI_MELHOR}];   // o corte que a Arvore do ml-zero escolheu
    const ultimo = curva[curva.length - 1];
    const volta = {{ u: ultimo[0], g: ultimo[1] }};
    const aplicarVolta = () => {{
      const x = PX + volta.u * PW;
      gsap.set("#ct-linha", {{ attr: {{ x1: x, x2: x }} }});
      gsap.set("#ct-marker", {{ attr: {{ cx: x, cy: {MY} + {MH} - (volta.g - {gmin}) / {gmax - gmin} * {MH} }} }});
      document.getElementById("ct-u").textContent = volta.u.toFixed(3).replace(".", ",");
      document.getElementById("ct-g").textContent = fmt(volta.g);
    }};
    tl.fromTo(volta, {{ u: ultimo[0], g: ultimo[1] }}, {{ u: melhor[0], g: melhor[1], duration: 0.7, ease: "power3.inOut", onUpdate: aplicarVolta }}, 10.1);
    tl.fromTo("#ct-corte-txt", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.25 }}, 10.8);
    tl.fromTo("#ct-l2 span", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, 11);
    window.__timelines["corte"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 3: a árvore cresce e o cliente desce
a_esq, a_dir = circulos("ar")
# posições dos nós
NODES = {"raiz": (1125, 250), "esq": (775, 520), "dir": (1475, 520),
         "ee": (600, 800), "ed": (950, 800), "de": (1300, 800), "dd": (1650, 800)}
NW, NH = 330, 130
def no_html(key, pergunta=None, nivel=""):
    x, y = NODES[key]; n, p = NO[key]
    q = f'<div class="q">{pergunta}</div>' if pergunta else ""
    return (f'<div id="ar-{key}" class="no{nivel}" style="left:{x-NW//2}px; top:{y-NH//2}px;">'
            f'<div class="inner">{q}<div class="n"><b>{fmt(n)}</b> clientes</div>'
            f'<div class="p"><b>{pct(p)}</b> não pagaram</div></div></div>')
def aresta(a, b, key):
    (x1, y1), (x2, y2) = NODES[a], NODES[b]
    return f'<line id="ar-e-{key}" class="aresta" x1="{x1}" y1="{y1+NH//2}" x2="{x2}" y2="{y2-NH//2}"/>'
T_L1 = "Cada lado é mais parecido consigo mesmo que o todo."
T_L2 = "E repete, em cada lado, até parar."
T_L3 = "Para quando dividir não melhora, ou o grupo fica pequeno."
T_L4 = f"Logística {dec(P_LOGISTICA, 2)}. Árvore {dec(P_ARVORE, 2)}. Perguntas diferentes, resposta parecida."
arvore = f"""<template>
  <style>
    {CSS_BASE}
    .linha {{ top: 60px; font-size: 56px; }}
    #ar-plot {{ position: absolute; inset: 0; }}
    #ar-tree {{ position: absolute; inset: 0; }}
    .no {{ position: absolute; width: {NW}px; height: {NH}px; border-radius: 18px; background: var(--papel);
           box-shadow: 0 10px 30px rgba(28,37,54,.12); font-size: 26px; text-align: center; }}
    .no .inner {{ padding: 12px 10px; }}
    .no .q {{ font-family: "IBM Plex Mono", monospace; font-weight: 600; color: var(--accent); font-size: 28px; }}
    .no .n, .no .p {{ color: var(--ink-soft); font-size: 28px; line-height: 1.25; }}
    .no .n b, .no .p b {{ color: var(--ink); font-family: "IBM Plex Mono", monospace; }}
    .no.folha .inner {{ padding-top: 24px; }}
    .aresta {{ stroke: var(--ink-faint); stroke-width: 4; }}
    .aresta.on {{ stroke: var(--accent); stroke-width: 7; }}
    #ar-svg {{ position: absolute; inset: 0; }}
    #ar-card {{ position: absolute; left: 70px; top: 180px; width: 340px; padding: 20px 24px; border-radius: 18px;
                background: var(--ink); color: #fff; font-size: 28px; box-shadow: 0 14px 40px rgba(28,37,54,.25); }}
    #ar-card .rot {{ font-size: 28px; letter-spacing: .08em; text-transform: uppercase; opacity: .75; }}
    #ar-card .campo {{ display: flex; justify-content: space-between; margin-top: 8px; }}
    #ar-card b {{ font-family: "IBM Plex Mono", monospace; }}
    #ar-card .campo.on b {{ color: #FFD37A; }}
    .passo {{ position: absolute; left: 70px; width: 340px; font-size: 28px; line-height: 1.25; color: var(--ink); background: var(--papel);
              border-left: 6px solid var(--accent); padding: 12px 16px; border-radius: 0 12px 12px 0; }}
    .passo b {{ font-family: "IBM Plex Mono", monospace; }}
    #ar-p1 {{ top: 440px; }} #ar-p2 {{ top: 570px; }} #ar-p3 {{ top: 700px; }}
    .destaque {{ outline: 6px solid var(--accent); }}
  </style>
  <div id="root" data-composition-id="arvore" data-width="1920" data-height="1080">
    <div id="ar-plot" class="clip" data-start="0" data-duration="3">
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <g id="ar-g-esq" opacity="0.85">
{a_esq}
        </g>
        <g id="ar-g-dir" opacity="0.85">
{a_dir}
        </g>
        <line id="ar-linha" x1="{sx(CORTE_USO):.1f}" y1="{PY}" x2="{sx(CORTE_USO):.1f}" y2="{PY+PH}" style="stroke: var(--accent); stroke-width: 5;"/>
      </svg>
    </div>
    <div id="ar-tree" class="clip" data-start="0" data-duration="36">
      <svg id="ar-svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        {aresta("raiz","esq","re")}{aresta("raiz","dir","rd")}
        {aresta("esq","ee","ee")}{aresta("esq","ed","ed")}{aresta("dir","de","de")}{aresta("dir","dd","dd")}
      </svg>
      {no_html("raiz", "uso ≤ " + f"{CORTE_USO:.3f}".replace(".", ",") + "?")}
      {no_html("esq", "renda ≤ " + fmt(CORTE_ESQ) + "?")}
      {no_html("dir", "renda ≤ " + fmt(CORTE_DIR) + "?")}
      {no_html("ee", nivel=" folha")}{no_html("ed", nivel=" folha")}{no_html("de", nivel=" folha")}{no_html("dd", nivel=" folha")}
    </div>
    <div id="ar-l1" class="clip linha" data-start="2.2" data-duration="3.6"><span>{T_L1}</span></div>
    <div id="ar-l2" class="clip linha" data-start="6.5" data-duration="3.2"><span>{T_L2}</span></div>
    <div id="ar-l3" class="clip linha" data-start="12.5" data-duration="4.2" data-hold><span>{T_L3}</span></div>
    <div id="ar-card" class="clip" data-start="18" data-duration="18">
      <div class="inner">
        <div class="rot">cliente nº 2</div>
        <div class="campo" id="ar-c-uso"><span>uso do limite</span><b>{dec(CLIENTE['uso'], 2)}</b></div>
        <div class="campo" id="ar-c-renda"><span>renda</span><b>R$ {fmt(CLIENTE['renda'])}</b></div>
        <div class="campo"><span>meses</span><b>{CLIENTE['meses']}</b></div>
      </div>
    </div>
    <div id="ar-p1" class="clip passo" data-start="19.5" data-duration="16.5"><span>uso <b>{dec(CLIENTE['uso'], 2)}</b> &gt; {dec(CORTE_USO, 3)} → direita</span></div>
    <div id="ar-p2" class="clip passo" data-start="23" data-duration="13"><span>renda <b>{fmt(CLIENTE['renda'])}</b> ≤ {fmt(CORTE_DIR)} → esquerda</span></div>
    <div id="ar-p3" class="clip passo" data-start="26.5" data-duration="9.5"><span>folha: <b>{fmt(NO['de'][0])}</b> parecidos, <b>{pct(NO['de'][1])}</b> não pagaram</span></div>
    <div id="ar-l4" class="clip linha" data-start="30" data-duration="6" data-hold><span>{T_L4}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    const blurIn = (sel, t) => tl.fromTo(sel, {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, t);
    const blurOut = (sel, t) => tl.to(sel, {{ opacity: 0, filter: "blur(6px)", duration: 0.18 }}, t);
    const nodeIn = (sel, t) => tl.fromTo(sel + " .inner", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }}, t);
    // nós começam invisíveis (o fundo do cartão também)
    gsap.set(".no", {{ opacity: 0 }});
    gsap.set(".aresta", {{ opacity: 0 }});
    // 0–2 s: as duas metades da dispersão encolhem até os nós filhos; a raiz aparece
    tl.fromTo("#ar-g-esq", {{ x: 0, y: 0, scale: 1, opacity: 0.85 }}, {{ x: {NODES['esq'][0] - (PX + PW*CORTE_USO/2):.0f}, y: {NODES['esq'][1] - (PY + PH/2):.0f}, scale: 0.12, opacity: 0, duration: 1.3, ease: "power3.inOut", transformOrigin: "{PX + PW*CORTE_USO/2:.0f}px {PY + PH/2:.0f}px" }}, 0.4);
    tl.fromTo("#ar-g-dir", {{ x: 0, y: 0, scale: 1, opacity: 0.85 }}, {{ x: {NODES['dir'][0] - (PX + PW*(1+CORTE_USO)/2):.0f}, y: {NODES['dir'][1] - (PY + PH/2):.0f}, scale: 0.12, opacity: 0, duration: 1.3, ease: "power3.inOut", transformOrigin: "{PX + PW*(1+CORTE_USO)/2:.0f}px {PY + PH/2:.0f}px" }}, 0.4);
    tl.fromTo("#ar-linha", {{ opacity: 1 }}, {{ opacity: 0, duration: 0.4 }}, 0.6);
    tl.fromTo("#ar-raiz", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 0.3); nodeIn("#ar-raiz", 0.3);
    tl.fromTo(["#ar-e-re", "#ar-e-rd"], {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4 }}, 1.2);
    tl.fromTo(["#ar-esq", "#ar-dir"], {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 1.5); nodeIn("#ar-esq", 1.5); nodeIn("#ar-dir", 1.6);
    gsap.set(["#ar-esq .q", "#ar-dir .q"], {{ opacity: 0 }});
    blurIn("#ar-l1 span", 2.2); blurOut("#ar-l1 span", 5.6);
    // 6,5 s: cada lado pergunta; as folhas descem
    blurIn("#ar-l2 span", 6.5);
    tl.fromTo(["#ar-esq .q", "#ar-dir .q"], {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.25, stagger: 0.15 }}, 7.2);
    tl.fromTo(["#ar-e-ee", "#ar-e-ed", "#ar-e-de", "#ar-e-dd"], {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4, stagger: 0.12 }}, 8.2);
    tl.fromTo([".no.folha"], {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3, stagger: 0.12 }}, 8.6);
    tl.fromTo(".no.folha .inner", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "expo.out" }}, 8.6);
    blurOut("#ar-l2 span", 9.5);
    blurIn("#ar-l3 span", 12.5); blurOut("#ar-l3 span", 16.5);
    // 18 s: o cliente desce
    tl.fromTo("#ar-card .inner", {{ opacity: 0, x: -30 }}, {{ opacity: 1, x: 0, duration: 0.5, ease: "expo.out" }}, 18);
    tl.fromTo("#ar-p1 span", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 19.5);
    tl.call(() => document.getElementById("ar-c-uso").classList.add("on"), null, 19.5);
    tl.call(() => document.getElementById("ar-c-uso").classList.remove("on"), null, 19.49);
    tl.to("#ar-e-rd", {{ attr: {{ class: "aresta on" }}, duration: 0.01 }}, 20.2);
    tl.to("#ar-e-rd", {{ attr: {{ class: "aresta" }}, duration: 0.01 }}, 20.19);
    tl.fromTo("#ar-dir", {{ outlineColor: "rgba(77,74,140,0)" }}, {{ outlineColor: "rgba(77,74,140,1)", duration: 0.3, outlineWidth: 6, outlineStyle: "solid" }}, 20.5);
    tl.fromTo("#ar-p2 span", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 23);
    tl.call(() => document.getElementById("ar-c-renda").classList.add("on"), null, 23);
    tl.call(() => document.getElementById("ar-c-renda").classList.remove("on"), null, 22.99);
    tl.to("#ar-e-de", {{ attr: {{ class: "aresta on" }}, duration: 0.01 }}, 23.7);
    tl.to("#ar-e-de", {{ attr: {{ class: "aresta" }}, duration: 0.01 }}, 23.69);
    tl.fromTo("#ar-de", {{ outlineColor: "rgba(77,74,140,0)" }}, {{ outlineColor: "rgba(77,74,140,1)", duration: 0.3, outlineWidth: 6, outlineStyle: "solid" }}, 24);
    tl.fromTo("#ar-de .inner", {{ scale: 1 }}, {{ scale: 1.08, duration: 0.4, ease: "back.out(1.4)" }}, 26.5);
    tl.fromTo("#ar-p3 span", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 26.5);
    blurIn("#ar-l4 span", 30);
    window.__timelines["arvore"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- cena 4: a ideia
I1 = "A árvore não ajusta uma reta: ela faz perguntas."
I2 = "E para quando responder não melhora mais."
I3 = "Funda demais, decora o treino. Daí a floresta."
ideia = f"""<template>
  <style>
    {CSS_BASE}
    .linha {{ font-size: 68px; }}
    #id-l1 {{ top: 330px; }} #id-l2 {{ top: 470px; }} #id-l3 {{ top: 660px; color: var(--accent); }}
  </style>
  <div id="root" data-composition-id="ideia" data-width="1920" data-height="1080">
    <div id="id-l1" class="clip linha" data-start="0.3" data-duration="9.7"><span>{I1}</span></div>
    <div id="id-l2" class="clip linha" data-start="3.6" data-duration="6.4"><span>{I2}</span></div>
    <div id="id-l3" class="clip linha" data-start="6.6" data-duration="3.4" data-hold><span>{I3}</span></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    const blurIn = (sel, t) => tl.fromTo(sel, {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }}, t);
    blurIn("#id-l1 span", 0.3); blurIn("#id-l2 span", 3.6); blurIn("#id-l3 span", 6.6);
    window.__timelines["ideia"] = tl;
  </script>
</template>
"""

# ---------------------------------------------------------------- raiz
DUR = {"pergunta": 6, "corte": 14, "arvore": 36, "ideia": 10}
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
for nome, html in [("pergunta", pergunta), ("corte", corte), ("arvore", arvore), ("ideia", ideia)]:
    (RAIZ / "compositions" / f"{nome}.html").write_text(html, encoding="utf-8")
print("projeto escrito:", RAIZ, "| duração total:", TOTAL, "s")
for k in DUR: print(f"  {k}: {starts[k]}–{starts[k]+DUR[k]} s")
