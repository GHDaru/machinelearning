// Teste da animação do k-means (ADR 0015), rodando o laboratorios.js REAL num
// DOM mínimo. A regra que ficou do III.2: nenhuma animação entra sem um teste
// que rode o método e confira o número que o texto promete ao leitor.
//
// Aqui o texto promete três coisas: a semente boa estabiliza em 2,243 de
// inércia, a infeliz estabiliza em 24,159, e a segunda funde dois grupos
// verdadeiros num só. Se qualquer uma mudar, o capítulo passa a mentir.
//
// Uso: node publicar/testes/anima-kmeans.mjs

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const listeners = new Map();

function novoEl(tag) {
  const e = {
    tagName: tag, className: "", textContent: "", style: {}, children: [],
    attributes: {},
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
if (!TIPOS || !TIPOS["anima-kmeans"]) {
  console.log("FALHOU: tipo anima-kmeans não registrado");
  process.exit(1);
}

function roda(botaoIdx) {
  const area = novoEl("div");
  TIPOS["anima-kmeans"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  if (botaoIdx != null) {
    const box = area.children.find((c) => c.className === "lab-botoes");
    listeners.get(box.children[botaoIdx])();
  }
  let n = 0;
  while (tick && n < 2000) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const boa = roda(null);
const ruim = roda(1);
console.log("semente boa    :", boa.texto);
console.log("semente infeliz:", ruim.texto);

const okBoa = /inércia 2\.243/.test(boa.texto) && /estabilizou/.test(boa.texto);
const okRuim = /inércia 24\.159/.test(ruim.texto) && /estabilizou/.test(ruim.texto);
// As duas param: um método que não estabiliza contaria outra história.
const okPara = boa.quadros < 2000 && ruim.quadros < 2000;

console.log(okBoa  ? "OK   semente boa estabiliza em 2,243, como o texto promete" : "FALHA: inércia boa mudou");
console.log(okRuim ? "OK   semente infeliz estabiliza em 24,159, como o texto promete" : "FALHA: inércia ruim mudou");
console.log(okPara ? "OK   as duas estabilizam sozinhas" : "FALHA: alguma não estabilizou");
process.exit(okBoa && okRuim && okPara ? 0 : 1);
