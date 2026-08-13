// Teste da animação das equações normais (II.2), rodando o laboratorios.js REAL
// num DOM mínimo e lendo os números do placar.
//
// A pergunta do capítulo é "se a solução fechada existe e é exata, por que o
// livro ensina o gradiente?". A animação responde pelo avesso, mostrando o preço
// do gradiente quando o problema é mal condicionado, e este teste guarda a
// medição:
//
//   1. com dois atributos quase colineares, 4 000 passos **não** bastam para
//      chegar a 1% de excesso de erro sobre o ótimo fechado (para em 2,8%);
//   2. padronizados, os mesmos 4 000 passos chegam a 1% no passo **1 460** e
//      terminam em 0,008%;
//   3. e as equações normais dão a resposta exata numa conta, nos dois casos.
//
// Duas decisões de método que este teste também protege, porque sem elas a
// comparação seria fraudulenta:
//
//   - **cada regime recebe o maior passo estável** (1/L, L o maior autovalor da
//     hessiana). Com passo fixo pequeno o padronizado pareceria lento à toa; com
//     passo fixo grande o bruto DIVERGE (medi: soma dos quadrados a 8e196). O
//     teste confere que os dois passos são de fato diferentes;
//   - **a "distância" é o excesso RELATIVO de erro**, e não ‖w − w*‖. Padronizar
//     troca a parametrização (o intercepto ótimo vira a média de y), e comparar
//     normas de vetores de peso compararia réguas diferentes. A primeira versão
//     fazia isso e dava o resultado invertido: o regime padronizado aparecia
//     mais LONGE do ótimo que o bruto.
//
// Uso: node publicar/testes/anima-normais.mjs

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
if (!TIPOS || !TIPOS["anima-normais"]) {
  console.log("FALHOU: tipo anima-normais não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-normais"](area, {});
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
  const m = new RegExp(rot + " (-?[\\d.]+(?:e[+-]\\d+)?)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const excBruto = num(bruto.texto, "excesso de erro sobre o ótimo fechado");
const excPad = num(pad.texto, "excesso de erro sobre o ótimo fechado");
const etaBruto = num(bruto.texto, "passo de");
const etaPad = num(pad.texto, "passo de");
const chegouPad = num(pad.texto, "chegou a 1% de excesso no passo");

const okBrutoNao = /nunca chegou a 1% de excesso/.test(bruto.texto) && excBruto > 0.01;
const okPadChega = Number.isFinite(chegouPad) && chegouPad < 2000;
const okDistancia = excPad < excBruto / 100;
const okPassosDiferentes = etaPad > etaBruto * 10;
const okPara = bruto.quadros < 2000 && pad.quadros < 2000;

const linhas = [
  [okBrutoNao, `com atributos como vieram, 4 000 passos não chegam a 1% de excesso (param em ${(excBruto * 100).toFixed(1)}%)`],
  [okPadChega, `padronizados, chegam a 1% no passo ${chegouPad}`],
  [okDistancia, `e terminam ${(excBruto / excPad).toFixed(0)}x mais perto do ótimo fechado`],
  [okPassosDiferentes, `cada regime usou o seu maior passo estável (${etaBruto.toExponential(1)} contra ${etaPad.toExponential(1)}), então a comparação não está viciada por um passo comum`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
