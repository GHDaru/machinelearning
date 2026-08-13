// Teste da animação da escala (I.6), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// Uma coluna troca de unidade, multiplicando por até 100. Os dados são os mesmos;
// muda a régua. O k-vizinhos roda por cima:
//
//   | | vizinhos ainda iguais (de 5) | rótulos virados |
//   |---|---|---|
//   | colunas como vieram   | **0,81** | **31,0%** |
//   | padronizadas antes    | 5,00     | 0,0%      |
//
// A segunda linha é uma INVARIÂNCIA, não uma melhora, e o teste a checa como tal:
// exatamente 5,00 de 5 vizinhos e exatamente 0,0% de rótulos virados. Padronizar
// não deixa o modelo melhor; deixa o modelo **indiferente à unidade**, que é outra
// coisa e é a que se quer.
//
// A ORDEM do pré-processamento é o assunto, e foi o primeiro defeito desta
// animação: eu padronizava antes de aplicar a troca de unidade, e aí os dois modos
// davam o mesmo resultado. Padronizar antes da unidade chegar não protege de nada.
// A coluna chega na unidade nova e SÓ DEPOIS o pré-processamento roda.
//
// Uso: node publicar/testes/anima-escala.mjs

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
if (!TIPOS || !TIPOS["anima-escala"]) {
  console.log("FALHOU: tipo anima-escala não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-escala"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([9999].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const bruto = roda(0);
const pad = roda(1);
console.log(bruto.texto);
console.log(pad.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const vizBruto = num(bruto.texto, "ainda são os mesmos");
const vizPad = num(pad.texto, "ainda são os mesmos");
const virBruto = num(bruto.texto, "rótulos previstos que viraram");
const virPad = num(pad.texto, "rótulos previstos que viraram");
const fator = num(bruto.texto, "escala da coluna 1 em");

const okFator = Math.abs(fator - 100) < 0.5;
const okPerdeVizinhos = vizBruto < 1.5;
const okViraRotulos = virBruto > 25;
const okInvariante = vizPad === 5 && virPad === 0;
const okPara = bruto.quadros < 2000 && pad.quadros < 2000;

const linhas = [
  [okFator, `a varredura chega a ${fator.toFixed(1)}x na coluna 1`],
  [okPerdeVizinhos, `sem padronizar, sobram ${vizBruto.toFixed(2)} dos 5 vizinhos`],
  [okViraRotulos, `e ${virBruto.toFixed(1)}% dos rótulos previstos viram`],
  [okInvariante, `padronizando antes, a resposta é INVARIANTE: ${vizPad.toFixed(2)} de 5 vizinhos e ${virPad.toFixed(1)}% virados`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
