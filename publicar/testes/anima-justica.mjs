// Teste da animação do teorema de impossibilidade (V.1), rodando o
// laboratorios.js REAL num DOM mínimo.
//
// Ele guarda a afirmação central do capítulo, que é um TEOREMA e não uma
// tendência: com prevalências diferentes, o melhor que se consegue é 2 dos 3
// critérios; igualando as prevalências, os 3 acendem. Se algum dia a animação
// exibir 3 de 3 no primeiro caso, o capítulo passa a desmentir a si mesmo.
//
// Duas armadilhas que a construção encontrou e que este teste protege:
//   1. os dois grupos precisam ser calibrados POR CONSTRUÇÃO (sorteia-se o
//      escore, depois y ~ Bernoulli(escore)); sem isso a "calibração" mede
//      artefato da geração do dado, e o máximo cai para 1 verde;
//   2. a varredura fica na faixa de operação — fora dela as métricas colapsam
//      para perto de zero e "casam" trivialmente.
//
// Uso: node publicar/testes/anima-justica.mjs

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
if (!TIPOS || !TIPOS["anima-justica"]) {
  console.log("FALHOU: tipo anima-justica não registrado");
  process.exit(1);
}

function roda(botaoIdx) {
  const area = novoEl("div");
  TIPOS["anima-justica"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  if (botaoIdx != null) {
    const box = area.children.find((c) => c.className === "lab-botoes");
    listeners.get(box.children[botaoIdx])();
  }
  let n = 0;
  while (tick && n < 5000) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const dif = roda(null);
const igu = roda(1);
console.log("prevalências diferentes:", dif.texto);
console.log("prevalências iguais    :", igu.texto);

const okDif = /melhor que deu: 2 de 3/.test(dif.texto);
const okIgu = /melhor que deu: 3 de 3/.test(igu.texto);
const okPara = dif.quadros < 5000 && igu.quadros < 5000;

console.log(okDif  ? "OK   com prevalências diferentes, o melhor é 2 de 3 — o teorema" : "FALHA: prevalências diferentes deram 3 de 3");
console.log(okIgu  ? "OK   com prevalências iguais, os 3 acendem — a condição que levanta a impossibilidade" : "FALHA: prevalências iguais não deram 3 de 3");
console.log(okPara ? "OK   as duas varreduras terminam" : "FALHA: varredura não terminou");
process.exit(okDif && okIgu && okPara ? 0 : 1);
