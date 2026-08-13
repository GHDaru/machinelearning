// Teste da animação da convolução (III.4), rodando o laboratorios.js REAL num
// DOM mínimo e lendo os números do placar.
//
// Os dois modelos são TREINADOS dentro da animação, por descida de gradiente,
// sobre um conjunto em que a forma aparece sempre na MESMA posição. É a condição
// que o capítulo descreve no "problema": ou você mostra o gato em todas as
// posições, ou aprende um detector de gato-no-canto-esquerdo. Os dois acertam o
// treino; o deslocamento de 3 px é que os separa.
//
// O que este teste guarda:
//
//   1. **os dois resolvem a posição do treino** (1,000 e 0,997). Sem isso a
//      comparação seria entre um modelo que aprendeu e um que não aprendeu, e não
//      entre duas formas de codificar posição;
//   2. **a densa DESABA com 3 px de deslocamento** (1,000 → 0,009) e a
//      convolucional não se mexe (0,997 → 0,996). É o O1 do capítulo medido;
//   3. **a convolucional usa dez vezes menos pesos** (26 contra 257), e as duas
//      contagens saem da geometria dos modelos, não de um número escrito à mão.
//
// Uso: node publicar/testes/anima-convolucao.mjs

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
if (!TIPOS || !TIPOS["anima-convolucao"]) {
  console.log("FALHOU: tipo anima-convolucao não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-convolucao"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([9999].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const treino = roda(0);
const movida = roda(1);
console.log(treino.texto);
console.log(movida.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+(?:e[+-]\\d+)?)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const dTreino = num(treino.texto, "a densa dá");
const cTreino = num(treino.texto, "e a convolucional dá");
const dMovida = num(movida.texto, "a densa dá");
const cMovida = num(movida.texto, "e a convolucional dá");
const pDensa = num(treino.texto, "parâmetros: densa");
const pConv = num(treino.texto, "convolucional");

const okAprenderam = dTreino > 0.95 && cTreino > 0.95;
const okDensaDesaba = dMovida < 0.05;
const okConvSegura = cMovida > 0.9;
const okParametros = pDensa === 257 && pConv === 26;
const okPara = treino.quadros < 2000 && movida.quadros < 2000;

const linhas = [
  [okAprenderam, `os dois resolvem a posição do treino (densa ${dTreino.toFixed(3)}, conv ${cTreino.toFixed(3)})`],
  [okDensaDesaba, `com 3 px de deslocamento, a densa desaba para ${dMovida.toFixed(3)}`],
  [okConvSegura, `e a convolucional segue em ${cMovida.toFixed(3)}`],
  [okParametros, `a convolucional usa ${pConv} pesos contra ${pDensa} da densa, contados da geometria`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
