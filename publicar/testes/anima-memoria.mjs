// Teste da animação da memória (III.5), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// A animação faz retropropagação no tempo de verdade, δ ← (Wᵀδ) ⊙ tanh'(z), e
// mede quanto do sinal da saída chega a cada posição anterior. Três modos:
//
//   | modo                              | razão por passo | cai a 1‰ em |
//   |-----------------------------------|-----------------|-------------|
//   | recorrência, inicialização padrão | 0,926           | 95          |
//   | recorrência, pesos 40% menores    | 0,624           | **14**      |
//   | leitura por atenção               | 1,006           | nunca       |
//
// **A medição contraria o folclore, e o teste existe para segurar isso.** A spec
// desta animação prometia "o gradiente caindo a zero em 11 passos". Com a
// inicialização padrão (Glorot numa matriz quadrada dá raio espectral ≈ 1) o sinal
// chega a **95** passos antes de cair a 1‰. Os "dez e poucos passos" que circulam
// correspondem a uma matriz recorrente encolhida ou saturada — o modo 2 —, e não
// à recorrência em geral.
//
// O que a animação ensina, então, não é "RNN esquece em 11 passos". É que **a
// queda é geométrica e a base é escolhida pelos pesos**: 40% a menos nos pesos
// move o horizonte de 95 para 14. E a atenção não decai porque o caminho da saída
// até qualquer posição tem comprimento 1, e comprimento 1 não conhece distância.
//
// Uso: node publicar/testes/anima-memoria.mjs

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const listeners = new Map();

function novoEl(tag) {
  const e = {
    tagName: tag, className: "", textContent: "", style: {}, children: [], attributes: {},
    appendChild(c) { this.children.push(c); return c; },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k] ?? null; },
    addEventListener(ev, fn) { listeners.set(this, fn); },
    querySelectorAll() { return []; },
  };
  if (tag === "canvas") e.getContext = () => new Proxy({}, { get: () => () => {} });
  return e;
}

const raiz = novoEl("html");
global.document = {
  documentElement: raiz, createElement: novoEl,
  querySelectorAll: () => [], addEventListener: () => {}, readyState: "complete",
};
global.window = { matchMedia: () => ({ matches: false }), document: global.document };
let tick = null;
global.setInterval = (fn) => { tick = fn; return 1; };
global.clearInterval = () => { tick = null; };

const src = readFileSync(resolve(RAIZ, "publicar/tema/laboratorios.js"), "utf8");
new Function("window", "document", "setInterval", "clearInterval",
  src.replace("var TIPOS = {", "var TIPOS = globalThis.__TIPOS = {"))
  (global.window, global.document, global.setInterval, global.clearInterval);

const TIPOS = globalThis.__TIPOS;
if (!TIPOS || !TIPOS["anima-memoria"]) {
  console.log("FALHOU: tipo anima-memoria não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-memoria"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([9999].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const modos = [roda(0), roda(1), roda(2)];
modos.forEach((m) => console.log(m.texto));

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+(?:e[+-]\\d+)?)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const raz = modos.map((m) => num(m.texto, "fica"));
const corte = modos.map((m) => num(m.texto, "cai abaixo de 1‰ na posição"));

const okGeometrica = raz[1] < raz[0] && raz[0] < raz[2];
const okPadraoLonge = corte[0] > 60;
const okMenoresPerto = corte[1] < 25;
const okHorizonte = corte[0] > corte[1] * 4;
const okAtencaoNaoCai = /NUNCA cai abaixo de 1‰/.test(modos[2].texto) && raz[2] > 0.99;
const okPara = modos.every((m) => m.quadros < 2000);

const linhas = [
  [okGeometrica, `a razão por passo ordena os três modos (${raz[1].toFixed(3)} < ${raz[0].toFixed(3)} < ${raz[2].toFixed(3)})`],
  [okPadraoLonge, `com inicialização padrão o sinal chega a ${corte[0]} passos, e não a "dez e poucos"`],
  [okMenoresPerto, `com pesos 40% menores, cai a 1‰ já na posição ${corte[1]}`],
  [okHorizonte, `40% nos pesos movem o horizonte ${(corte[0] / corte[1]).toFixed(1)}x`],
  [okAtencaoNaoCai, `a atenção não decai (razão ${raz[2].toFixed(3)}), porque o caminho tem comprimento 1`],
  [okPara, "as três varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
