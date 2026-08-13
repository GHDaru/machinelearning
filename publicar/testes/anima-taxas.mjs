// Teste da animação das três taxas de aprendizado (ADR 0015), rodando o
// laboratorios.js REAL num DOM mínimo. A regra que ficou do III.2: nenhuma
// animação entra sem um teste que rode o método e confira o número que o texto
// promete ao leitor.
//
// O texto promete quatro coisas, e todas são o argumento do capítulo:
//   1. com erro quadrático, taxa 0,001 fica QUASE PARADA (0,5521 em 60 épocas);
//   2. taxa 0,1 desce de verdade, chegando a 0,0061;
//   3. taxa 1,5 ESTOURA e sai da escala — a fronteira de estabilidade desta
//      paisagem é 1,0, porque o maior autovalor da Hessiana (2/n)XᵀX é 2;
//   4. trocando SÓ a perda para logística, a MESMA taxa 1,5 não estoura: ela
//      termina em 0,1455, e ainda por cima é a melhor das três. É a sutileza
//      medida na etapa 05–06 e o motivo de "não explodiu" não ser evidência de
//      que a taxa está boa.
//
// Uso: node publicar/testes/anima-taxas.mjs

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
if (!TIPOS || !TIPOS["anima-taxas"]) {
  console.log("FALHOU: tipo anima-taxas não registrado");
  process.exit(1);
}

function roda(botaoIdx) {
  const area = novoEl("div");
  TIPOS["anima-taxas"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  listeners.get(box.children[botaoIdx])();
  let n = 0;
  while (tick && n < 500) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const quad = roda(0);
const logi = roda(1);
console.log("erro quadrático:", quad.texto);
console.log("perda logística:", logi.texto);

const trecho = (t, lr) => {
  const m = new RegExp(`taxa ${lr.replace(".", "\\.")}: ([^(]+)\\(([^)]+)\\)`).exec(t);
  return m ? { valor: m[1].trim(), diag: m[2] } : null;
};
const q001 = trecho(quad.texto, "0.001"), q01 = trecho(quad.texto, "0.1"), q15 = trecho(quad.texto, "1.5");
const l15 = trecho(logi.texto, "1.5");

const okLenta = q001 && q001.diag === "quase parada" && q001.valor === "0.5521";
const okBoa = q01 && q01.diag === "descendo" && q01.valor === "0.0061";
const okEstoura = q15 && q15.diag === "estourou" && q15.valor === "fora da escala";
const okLogistica = l15 && l15.diag !== "estourou" && l15.valor === "0.1455";
// A MESMA taxa que estourou no quadrático é, na logística, a que desce mais.
const menorLog = ["0.001", "0.1", "1.5"]
  .map((lr) => Number(trecho(logi.texto, lr).valor))
  .reduce((a, b) => Math.min(a, b));
const okMelhorDasTres = Math.abs(menorLog - 0.1455) < 1e-9;
const okPara = quad.quadros < 500 && logi.quadros < 500;

console.log(okLenta         ? "OK   taxa 0,001 fica quase parada em 0,5521" : "FALHA: a taxa baixa mudou");
console.log(okBoa           ? "OK   taxa 0,1 desce até 0,0061" : "FALHA: a taxa boa mudou");
console.log(okEstoura       ? "OK   taxa 1,5 estoura e sai da escala" : "FALHA: a taxa alta não estourou");
console.log(okLogistica     ? "OK   com perda logística a MESMA taxa 1,5 não estoura (0,1455)" : "FALHA: a logística mudou");
console.log(okMelhorDasTres ? "OK   e ali ela é a melhor das três" : "FALHA: 1,5 não é a menor perda na logística");
console.log(okPara          ? "OK   as duas varreduras terminam" : "FALHA: alguma não terminou");
process.exit(okLenta && okBoa && okEstoura && okLogistica && okMelhorDasTres && okPara ? 0 : 1);
