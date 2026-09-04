// Teste do segundo painel do laboratório de regressão (II.2, cartão 8): o plano
// (a, b) com as curvas de nível do erro quadrático médio (EQM), o ponto do
// leitor e o rastro dele.
//
// POR QUE ESTE TESTE EXISTE
//
// O capítulo apoia a dedução inteira numa frase — "L é uma soma de quadrados,
// uma superfície convexa em (a, b), uma tigela; tigela tem um fundo, e só um" —
// e é dela que sai o direito de derivar, igualar a zero e chamar o resultado de
// mínimo. O painel promete mostrar essa tigela. Uma figura bonita que não seja
// a tigela do conjunto de dados na tela seria pior do que a frase: seria a
// frase com uma prova falsa ao lado.
//
// Então nada aqui confere pixel. O que se confere é se o que está desenhado É o
// erro do próprio laboratório:
//
//   1. **os dois canvas nascem medidos em pixels de CSS** e o texto chega ao
//      leitor acima do piso de legibilidade numa coluna de 360px (defeito D18:
//      com backing store fixo, a fonte de 12px saía a 6,0px);
//   2. **a decomposição bate com o cálculo bruto** — L(a,b) = L(â,b̂) + Q(a−â,
//      b−b̂) contra a soma dos quadrados feita ponto a ponto;
//   3. **todo anel desenhado é curva de nível** — 24 ângulos de cada um dos 6
//      anéis, com o EQM recalculado do zero em cada ponto;
//   4. **a tigela tem um fundo só**, e nenhum par sorteado desce abaixo dele;
//   5. **o quadro contém a partida, o fundo e toda a faixa dos dois cursores**,
//      senão o ponto do leitor sai do mapa no meio do gesto;
//   6. **o rastro registra caminho, não repetição**, e zera com dados novos;
//   7. **descer a tigela aproxima o ponto do marcador**, em pixels — é a
//      afirmação que o cartão faz ao leitor;
//   8. **os números têm nome na tela e mudam com o controle** (ADR 0015): sem
//      isso o painel é decoração.
//
// Uso: node publicar/testes/lab-tigela.mjs

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// A coluna de leitura de um celular de 360px, que é onde o defeito D18 mora.
const LARGURA_CSS = 281;

// ------------------------------------------------------------ DOM de mentira
function acha(raiz, sel) {
  const cls = sel.replace(/^\./, "");
  const fora = [];
  (function anda(n) {
    (n.children || []).forEach((c) => {
      if ((" " + (c.className || "") + " ").indexOf(" " + cls + " ") >= 0) fora.push(c);
      anda(c);
    });
  })(raiz);
  return fora;
}

function novoCtx() {
  const reg = { textos: [], transform: null };
  const nada = () => {};
  return {
    _reg: reg,
    font: "", fillStyle: "", strokeStyle: "", lineWidth: 1, textAlign: "left",
    fillText(t, x, y) {
      reg.textos.push({ t: String(t), x, y, font: this.font, cor: this.fillStyle });
    },
    setTransform(...a) { reg.transform = a; },
    measureText(t) { return { width: String(t).length * 6.5 }; },
    clearRect: nada, fillRect: nada, strokeRect: nada, beginPath: nada, closePath: nada,
    moveTo: nada, lineTo: nada, arc: nada, fill: nada, stroke: nada, save: nada,
    restore: nada, clip: nada, rect: nada, setLineDash: nada, translate: nada,
  };
}

function novoEl(tag) {
  const e = {
    tagName: tag, className: "", textContent: "", innerHTML: "", type: "", value: "",
    step: "", min: "", max: "", hidden: false, style: {}, children: [], attributes: {},
    clientWidth: LARGURA_CSS,
    appendChild(c) { this.children.push(c); return c; },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    addEventListener() {},
    querySelectorAll(sel) { return acha(this, sel); },
    querySelector(sel) { return acha(this, sel)[0] || null; },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: this.clientWidth,
               height: parseFloat(this.style.height) || 0 };
    },
  };
  if (tag === "canvas") {
    e.width = 300; e.height = 150;
    e._ctx = novoCtx();
    e.getContext = () => e._ctx;
  }
  return e;
}

global.document = {
  documentElement: novoEl("html"), createElement: novoEl,
  querySelectorAll: () => [], addEventListener: () => {}, readyState: "complete",
};
global.window = { matchMedia: () => ({ matches: false }), document: global.document,
                  devicePixelRatio: 1, addEventListener: () => {} };
global.MutationObserver = class { observe() {} };
global.ResizeObserver = class { observe() {} };
global.setInterval = () => 1;
global.clearInterval = () => {};

const src = readFileSync(resolve(RAIZ, "publicar/tema/laboratorios.js"), "utf8");
new Function("window", "document", "setInterval", "clearInterval",
  src.replace("var TIPOS = {", "var TIPOS = globalThis.__TIPOS = {"))
  (global.window, global.document, global.setInterval, global.clearInterval);

const TIPOS = globalThis.__TIPOS;
if (!TIPOS || !TIPOS["regressao-linear"]) {
  console.log("FALHOU: tipo regressao-linear não registrado");
  process.exit(1);
}

// A configuração vem do capítulo publicado, não de um número inventado aqui:
// se o autor mudar o laboratório, é o laboratório dele que este teste mede.
const capitulo = readFileSync(resolve(RAIZ, "livro/capitulos/ii-2-modelos-lineares.md"), "utf8");
const linhaLab = capitulo.split("\n").find((l) => l.indexOf('"modelos-lineares-l1"') >= 0);
if (!linhaLab) {
  console.log("FALHOU: o laboratório modelos-lineares-l1 sumiu do capítulo II.2");
  process.exit(1);
}
const cfg = JSON.parse(linhaLab.slice(linhaLab.indexOf("{")));

const area = novoEl("div");
TIPOS["regressao-linear"](area, cfg);
const api = area.__api;
if (!api) { console.log("FALHOU: o laboratório não expôs __api"); process.exit(1); }

const linhas = [];
const ok = (cond, msg) => linhas.push([!!cond, msg]);
const perto = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 1e-9 : tol);

// ---- (1) dois painéis, medidos em pixels de CSS -----------------------------
const telas = acha(area, ".lab-planos")[0];
const canvas = (telas ? telas.children : []).filter((c) => c.tagName === "canvas");
ok(canvas.length === 2, `o laboratório monta dois painéis (montou ${canvas.length})`);

const dim = api.dimensoes();
ok(dim && dim.plano && dim.plano.W === LARGURA_CSS,
   `o plano é diagramado sobre os ${LARGURA_CSS}px de CSS que ele ocupa ` +
   `(diagramou ${dim && dim.plano ? dim.plano.W : "?"})`);

// D18 EM UM NÚMERO: a fonte pedida vale 12px no backing store; o leitor a vê
// encolhida na razão entre a largura de CSS e a do backing store.
const alturaTexto = (cv) => {
  const t = cv._ctx._reg.textos.find((x) => /px /.test(x.font));
  if (!t) return 0;
  return parseFloat(t.font) * (cv.clientWidth / cv.width);
};
const alturas = canvas.map(alturaTexto);
ok(alturas.every((h) => h >= 11),
   `o texto dos dois painéis chega ao leitor com ${alturas.map((h) => h.toFixed(2)).join(" e ")}px ` +
   `numa coluna de ${LARGURA_CSS}px (piso: 11px — defeito D18)`);

// ---- (2) a decomposição bate com o erro bruto -------------------------------
let piorDecomp = 0;
for (let i = 0; i <= 4; i++) {
  for (let j = 0; j <= 4; j++) {
    const a = -3 + i * 1.5, b = -20 + j * 15;
    piorDecomp = Math.max(piorDecomp, Math.abs(api.eqmEm(a, b) - api.metricas(a, b).eqm));
  }
}
ok(piorDecomp < 1e-9,
   `a tigela desenhada é o EQM do conjunto: 25 pares (a, b), pior diferença ${piorDecomp.toExponential(2)}`);

// ---- (3) todo anel é curva de nível -----------------------------------------
const f = api.forma(), j = api.janela(f), qs = api.niveis(f, j);
let piorAnel = 0;
qs.forEach((q) => {
  for (let t = 0; t < 24; t++) {
    const th = (t / 24) * Math.PI * 2;
    const r = api.raioNoAngulo(f, q, th);
    const a = f.a + r * Math.cos(th), b = f.b + r * Math.sin(th);
    piorAnel = Math.max(piorAnel, Math.abs(api.metricas(a, b).eqm - (f.Lmin + q)));
  }
});
ok(qs.length >= 4 && piorAnel < 1e-8,
   `os ${qs.length} anéis desenhados são curvas de nível: 24 ângulos cada, ` +
   `pior desvio ${piorAnel.toExponential(2)}`);

// ---- (4) um fundo, e só um --------------------------------------------------
const det = f.A * f.C - f.B * f.B;
let menorAchado = Infinity, ondeMenor = null;
let semente = 7;
const aleat = () => (semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let i = 0; i < 4000; i++) {
  const a = j.a0 + aleat() * (j.a1 - j.a0), b = j.b0 + aleat() * (j.b1 - j.b0);
  const e = api.metricas(a, b).eqm;
  if (e < menorAchado) { menorAchado = e; ondeMenor = [a, b]; }
}
ok(f.A > 0 && det > 0,
   `a forma é positiva definida (A = ${f.A.toFixed(2)}, A·C − B² = ${det.toFixed(2)}): ` +
   `curva de nível é elipse fechada, e o mínimo é único`);
ok(menorAchado >= f.Lmin - 1e-9,
   `nenhum de 4 000 pares sorteados desce abaixo do fundo (${f.Lmin.toFixed(4)}); ` +
   `o melhor achado foi ${menorAchado.toFixed(4)}`);

// ---- (5) o quadro cobre a partida, o fundo e a faixa dos cursores -----------
const faixas = acha(area, ".lab-faixa");
const faixaA = { min: parseFloat(faixas[0].min), max: parseFloat(faixas[0].max) };
const faixaB = { min: parseFloat(faixas[1].min), max: parseFloat(faixas[1].max) };
const dentro = (a, b) => a >= j.a0 - 1e-9 && a <= j.a1 + 1e-9 && b >= j.b0 - 1e-9 && b <= j.b1 + 1e-9;
ok(dentro(0, 0) && dentro(f.a, f.b),
   `o quadro contém a partida (0, 0) e o fundo (${f.a.toFixed(2)}, ${f.b.toFixed(2)})`);
ok(dentro(faixaA.min, faixaB.min) && dentro(faixaA.max, faixaB.max),
   `o quadro contém toda a faixa dos dois cursores: a em [${faixaA.min}, ${faixaA.max}], ` +
   `b em [${faixaB.min}, ${faixaB.max}] dentro de a em [${j.a0.toFixed(1)}, ${j.a1.toFixed(1)}], ` +
   `b em [${j.b0.toFixed(1)}, ${j.b1.toFixed(1)}]`);

// ---- (6) o rastro ----------------------------------------------------------
const antes = api.estado.rastro.length;
api.mover(1.0, 2.0);
api.mover(1.0, 2.0);          // parado não é caminho
api.mover(1.4, 3.0);
const depois = api.estado.rastro.length;
ok(antes === 1 && depois === 3,
   `o rastro guarda a partida e cada posição nova, e não repete parado (${antes} → ${depois})`);
api.novosDados();
ok(api.estado.rastro.length <= 1,
   `dados novos zeram o rastro (${api.estado.rastro.length}), porque o fundo mudou de lugar`);

// ---- (7) descer a tigela aproxima o ponto do marcador ----------------------
const o = api.otimo();
api.mover(0, 0);
const g = api.plano();
const mx = g.PX(g.f.a), my = g.PY(g.f.b);
let erroAntes = Infinity, distAntes = Infinity, desceuSempre = true;
for (let k = 0; k <= 20; k++) {
  const a = (o.a * k) / 20, b = (o.b * k) / 20;
  const e = api.metricas(a, b).eqm;
  const dx = g.PX(a) - mx, dy = g.PY(b) - my;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (k > 0 && !(e < erroAntes - 1e-12 && d < distAntes - 1e-9)) desceuSempre = false;
  erroAntes = e; distAntes = d;
}
ok(desceuSempre,
   `no caminho da partida ao fundo, o EQM cai a cada passo e o ponto se aproxima ` +
   `do marcador em pixels (20 passos, distância final ${distAntes.toFixed(1)}px)`);
ok(mx >= g.ml && mx <= g.ml + g.pw && my >= g.mt && my <= g.mt + g.ph,
   `o marcador do fundo cai dentro da moldura do gráfico`);

// ---- (8) os números têm nome na tela, e mudam com o controle (ADR 0015) ----
const textoDo = (cv) => cv._ctx._reg.textos.map((t) => t.t).join(" | ");
const desenhaEDiz = (a, b) => {
  canvas[1]._ctx._reg.textos.length = 0;   // só o que ESTE desenho escreveu
  api.mover(a, b);
  return textoDo(canvas[1]);
};
const par1 = [0.5, 1.5], par2 = [o.a, o.b + 2];
const t1 = desenhaEDiz(par1[0], par1[1]);
const t2 = desenhaEDiz(par2[0], par2[1]);
const eqmNoTexto = (s) => {
  const m = /você\s+a ([-\d.]+) · b ([-\d.]+) · EQM ([-\d.]+)/.exec(s);
  return m ? { a: +m[1], b: +m[2], eqm: +m[3] } : null;
};
const n1 = eqmNoTexto(t1), n2 = eqmNoTexto(t2);
ok(n1 && n2, "o painel escreve o par (a, b) e o erro nele, com nome, na tela");
ok(n1 && n2 && perto(n1.a, par1[0], 5e-3) && perto(n2.a, par2[0], 5e-3) && n1.eqm !== n2.eqm,
   `mexer nos cursores muda o número escrito no painel ` +
   `(EQM ${n1 ? n1.eqm : "?"} → ${n2 ? n2.eqm : "?"}): o controle não é enfeite`);
ok(n2 && perto(n2.eqm, api.metricas(par2[0], par2[1]).eqm, 5e-3),
   `o erro escrito no painel é o mesmo que o placar calcula ponto a ponto ` +
   `(${n2 ? n2.eqm : "?"} contra ${api.metricas(par2[0], par2[1]).eqm.toFixed(4)})`);
ok(/fundo · EQM/.test(t2), "o fundo da tigela também é escrito, e não só marcado");

// ----------------------------------------------------------------- veredito
console.log(`plano (a, b): ${dim.plano.W}×${dim.plano.H} px de CSS · dispersão ` +
            `${dim.disp.W}×${dim.disp.H} · densidade ${dim.dpr}`);
console.log(`fundo em a = ${f.a.toFixed(3)}, b = ${f.b.toFixed(3)}, EQM = ${f.Lmin.toFixed(4)} · ` +
            `${qs.length} anéis até ${(f.Lmin + qs[qs.length - 1]).toFixed(1)}`);
linhas.forEach(([bom, msg]) => console.log((bom ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([bom]) => bom) ? 0 : 1);
