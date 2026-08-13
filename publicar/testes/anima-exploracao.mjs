// Teste da animação da exploração (IV.2), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// O mundo tem duas saídas: +0,25 a cinco passos da largada e +1,5 a doze. A
// segunda vale mais mesmo descontada, e o agente guloso nunca a encontra —
// não por burrice, mas porque a única informação capaz de tirá-lo da saída
// pequena só apareceria numa ação que ele deixou de tomar.
//
// O que este teste guarda:
//
//   1. **o ε que cai acha a saída grande e o ε zero não**: 529 episódios contra
//      **5**, em 600;
//   2. **a recompensa média reflete isso**: 1,375 contra 0,200, quase sete vezes;
//   3. **os dois partem da mesma tabela Q e do mesmo fluxo de sorteios**, então a
//      diferença é o ε e nada mais.
//
// Uma armadilha da construção, registrada porque quase custou a lição: na
// primeira versão a saída pequena ficava em (1,1), colada na largada, e virava
// um poço absorvente que pegava OS DOIS modos. Com ε = 1 o passeio aleatório caía
// nela nos primeiros passos, e o agente que explora nunca chegava ao prêmio
// grande. A animação mostrava só que o mundo é cruel. Explorar precisa ser
// possível para que não explorar seja um erro.
//
// Uso: node publicar/testes/anima-exploracao.mjs

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
if (!TIPOS || !TIPOS["anima-exploracao"]) {
  console.log("FALHOU: tipo anima-exploracao não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-exploracao"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([9999].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const comEps = roda(0);
const semEps = roda(1);
console.log(comEps.texto);
console.log(semEps.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const grandeCom = num(comEps.texto, "chegou ao \\+1.5 em");
const grandeSem = num(semEps.texto, "chegou ao \\+1.5 em");
const mediaCom = num(comEps.texto, "recompensa média dos últimos 20");
const mediaSem = num(semEps.texto, "recompensa média dos últimos 20");
const epsFinal = num(comEps.texto, "ε");
const epsZero = num(semEps.texto, "ε");

const okAcha = grandeCom > 300;
const okNaoAcha = grandeSem < 50;
const okMedia = mediaCom > mediaSem * 3;
const okEps = epsFinal === 0.05 && epsZero === 0;
const okPara = comEps.quadros < 2000 && semEps.quadros < 2000;

const linhas = [
  [okAcha, `explorando, o agente chega ao prêmio grande em ${grandeCom} de 600 episódios`],
  [okNaoAcha, `com ε = 0, chega em ${grandeSem}`],
  [okMedia, `e a recompensa média fica ${(mediaCom / mediaSem).toFixed(1)}x maior (${mediaCom.toFixed(3)} contra ${mediaSem.toFixed(3)})`],
  [okEps, `o ε de fato cai a ${epsFinal} num modo e fica em ${epsZero} no outro`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
