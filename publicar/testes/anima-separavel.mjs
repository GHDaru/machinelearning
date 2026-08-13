// Teste da animação do dado separável (II.3), rodando o laboratorios.js REAL num
// DOM mínimo e lendo os números do placar.
//
// A afirmação do O3 é que a logística não tem solução fechada, e com dado
// linearmente separável isso deixa de ser um detalhe algébrico: o máximo da
// verossimilhança **não existe em ponto nenhum**. A perda tende a zero com a
// norma de w indo ao infinito. Este teste guarda as três consequências:
//
//   1. a acurácia congela em 1,000 cedo (passo 52) e não se mexe mais;
//   2. sem penalização, a norma de w CONTINUA crescendo depois disso (6,08 no
//      passo 200 contra 7,91 no 400) e a perda continua caindo. O modelo não está
//      melhorando: está ficando mais confiante sobre a mesma fronteira;
//   3. com penalização L2, a norma converge (3,29 contra 3,31) e a perda
//      estabiliza acima de zero. É o argumento de por que regularizar não é ajuste
//      fino.
//
// Uso: node publicar/testes/anima-separavel.mjs

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
if (!TIPOS || !TIPOS["anima-separavel"]) {
  console.log("FALHOU: tipo anima-separavel não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-separavel"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([200].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const semReg = roda(0);
const comReg = roda(1);
console.log("sem penalização (200):", semReg.snaps[0]);
console.log("sem penalização (400):", semReg.texto);
console.log("com L2 (200):", comReg.snaps[0]);
console.log("com L2 (400):", comReg.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const n200 = num(semReg.snaps[0], "norma de w"), n400 = num(semReg.texto, "norma de w");
const p200 = num(semReg.snaps[0], "perda"), p400 = num(semReg.texto, "perda");
const r200 = num(comReg.snaps[0], "norma de w"), r400 = num(comReg.texto, "norma de w");
const iAcc = num(semReg.texto, "a acurácia chegou a 1,000 no passo");
const acc = num(semReg.texto, "acurácia");

const okAcc = acc === 1 && iAcc > 0 && iAcc < 150;
const okNormaCresce = n400 > n200 * 1.2;
const okPerdaCai = p400 < p200 * 0.85;
const okRegConverge = Math.abs(r400 - r200) / r200 < 0.05;
const okRegMenor = r400 < n400 * 0.6;
const okPara = semReg.quadros < 2000 && comReg.quadros < 2000;

const linhas = [
  [okAcc, `a acurácia congela em 1,000 no passo ${iAcc} e fica`],
  [okNormaCresce, `sem penalização, a norma segue crescendo depois disso (${n200.toFixed(2)} no passo 200, ${n400.toFixed(2)} no 400)`],
  [okPerdaCai, `e a perda segue caindo (${p200.toFixed(4)} para ${p400.toFixed(4)}) sem que a acurácia mude`],
  [okRegConverge, `com L2 a norma converge (${r200.toFixed(2)} para ${r400.toFixed(2)})`],
  [okRegMenor, `e fica bem abaixo da norma sem penalização (${r400.toFixed(2)} contra ${n400.toFixed(2)})`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
