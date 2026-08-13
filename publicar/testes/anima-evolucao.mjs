// Teste da animação da evolução (IV.3), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// A paisagem tem dois picos: um largo e baixo (0,7) e um estreito e alto (1,0). A
// população começa espalhada, então já contém indivíduos perto dos dois.
//
//   | | melhor no fim | diversidade | melhor na geração 0 |
//   |---|---|---|---|
//   | sem guardar o melhor | 0,7000 | 0,0901 | 0,7349 |
//   | guardando o melhor   | **1,0000** | 0,0906 | 0,7349 |
//
// Três coisas que este teste guarda, e a terceira é a que corrige o que eu ia
// escrever:
//
//   1. **sem elitismo, a população termina PIOR do que começou** no seu melhor
//      indivíduo (0,7349 → 0,7000). Não é estagnação, é perda: a informação
//      estava lá na geração 0 e foi embora;
//   2. **com elitismo, a mesma população chega a 1,0000**, o ótimo global. Um
//      indivíduo guardado por geração faz a diferença entre os dois picos;
//   3. **a diversidade colapsa IGUAL nos dois** (0,0901 contra 0,0906). Então não
//      foi "manter diversidade" que resolveu, e a receita folclórica de subir a
//      mutação não resolve mesmo: varri 0,02 · 0,08 · 0,12 · 0,20 · 0,35 e o pico
//      alto se perde em todas.
//
// O mecanismo é o cruzamento por mistura: o filho de um indivíduo do pico alto com
// qualquer outro cai no vale entre os dois. A linhagem boa morre pela **média**, e
// não por falta de variação. Por isso o teste checa que as diversidades são
// parecidas — se um dia divergirem, a explicação da animação mudou de assunto.
//
// Uso: node publicar/testes/anima-evolucao.mjs

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
if (!TIPOS || !TIPOS["anima-evolucao"]) {
  console.log("FALHOU: tipo anima-evolucao não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-evolucao"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([9999].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const semElite = roda(0);
const comElite = roda(1);
console.log(semElite.texto);
console.log(comElite.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const fimSem = num(semElite.texto, "melhor aptidão");
const fimCom = num(comElite.texto, "melhor aptidão");
const ini = num(semElite.texto, "na geração 0 a população já tinha");
const iniCom = num(comElite.texto, "na geração 0 a população já tinha");
const divSem = num(semElite.texto, "diversidade");
const divCom = num(comElite.texto, "diversidade");

const okMesmaLargada = Math.abs(ini - iniCom) < 1e-9;
const okPerde = fimSem < ini && /terminou PIOR do que começou/.test(semElite.texto);
const okElitePega = fimCom > 0.99;
const okDivIgual = Math.abs(divSem - divCom) < 0.02;
const okDivColapsa = divSem < 0.2;
const okPara = semElite.quadros < 2000 && comElite.quadros < 2000;

const linhas = [
  [okMesmaLargada, `os dois partem da mesma população (melhor inicial ${ini.toFixed(4)})`],
  [okPerde, `sem guardar o melhor, termina PIOR do que começou (${ini.toFixed(4)} para ${fimSem.toFixed(4)})`],
  [okElitePega, `guardando o melhor, chega ao ótimo global (${fimCom.toFixed(4)})`],
  [okDivColapsa, `a diversidade colapsa (${divSem.toFixed(4)}), como o capítulo descreve`],
  [okDivIgual, `mas colapsa IGUAL nos dois (${divSem.toFixed(4)} contra ${divCom.toFixed(4)}) — não foi diversidade que resolveu`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
