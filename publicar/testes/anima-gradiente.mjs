// Teste da animação do gradiente que some (III.3), rodando o laboratorios.js
// REAL num DOM mínimo e lendo os números do placar.
//
// O capítulo faz três afirmações encadeadas, e a animação existe para mostrar
// as três de uma vez. Este teste guarda cada uma:
//
//   1. **sigmoide + Xavier mata o gradiente.** A primeira das 20 camadas recebe
//      algo da ordem de 1e-12. O capítulo fala em "dividido por um milhão"; a
//      medição é bem pior que isso, e é por aí que a rede fica parada.
//   2. **ReLU sozinha NÃO resolve.** É o erro de previsão que a animação existe
//      para provocar. Com Xavier, a ReLU melhora nove ordens de grandeza e
//      ainda assim perde um fator de mil da última camada à primeira, porque a
//      dedução de Xavier supõe ativação linear.
//   3. **ReLU com He mantém as barras de pé**: a primeira camada fica na mesma
//      ordem da última.
//
// E guarda uma quarta coisa, que não é resultado e sim MÉTODO: os três modos
// precisam sortear do mesmo fluxo de números, senão a comparação mede sorteio
// em vez de medir inicialização, e a animação compara três redes diferentes
// enquanto o texto promete comparar três escolhas na mesma rede.
//
// A primeira versão deste teste checava isso pela norma da ÚLTIMA camada, e não
// checava nada: essa norma é ||δ|| na saída, sorteada de uma semente própria, e
// portanto igual nos três modos aconteça o que acontecer. O erro só apareceu ao
// **ver o teste falhar de propósito** — troquei a semente por modo e a linha do
// método continuou verde.
//
// A checagem certa é exata e vale a pena entender. He e Xavier sorteiam os
// MESMOS pesos, multiplicados por √2 camada a camada. Escalar por um positivo
// não muda o sinal de z, logo a máscara da ReLU é idêntica nos dois modos, e o
// passo para trás de He é o de Xavier vezes √2 a cada matriz atravessada. Como
// a norma da camada 1 é registrada depois de 19 dessas travessias, a razão entre
// os dois modos tem de ser (√2)^19 = 724,077..., e não um número qualquer.
// Com a semente quebrada por modo, a razão medida cai para ~274.
//
// Uso: node publicar/testes/anima-gradiente.mjs

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
if (!TIPOS || !TIPOS["anima-gradiente"]) {
  console.log("FALHOU: tipo anima-gradiente não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-gradiente"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0;
  while (tick && n < 2000) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+e[+-]\\d+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const modos = [roda(0), roda(1), roda(2)];
modos.forEach((m) => console.log(m.texto));

const pri = modos.map((m) => num(m.texto, "primeira camada"));
const ult = modos.map((m) => num(m.texto, "última camada"));
const raz = modos.map((m) => num(m.texto, "a primeira recebe"));

const ESPERADO = Math.pow(2, 9.5);          // (√2)^19, as 19 travessias de matriz
const medida = raz[2] / raz[1];

const okSig = pri[0] < 1e-9;
const okRelu = raz[1] < 1e-2 && raz[1] > raz[0] * 1e6;
const okHe = raz[2] > 0.3;
const okMesmaRede = Math.abs(medida / ESPERADO - 1) < 0.01;
const okDelta = Math.abs(ult[0] - ult[1]) < 1e-12 && Math.abs(ult[1] - ult[2]) < 1e-12;
const okPara = modos.every((m) => m.quadros < 2000);

const linhas = [
  [okSig, `sigmoide + Xavier mata o gradiente (primeira camada ${pri[0].toExponential(2)})`],
  [okRelu, `ReLU sozinha melhora muito e ainda perde um fator grande (razão ${raz[1].toExponential(2)})`],
  [okHe, `ReLU + He mantém as barras de pé (razão ${raz[2].toExponential(2)})`],
  [okMesmaRede, `He e Xavier são a MESMA rede vezes √2 por camada: razão medida ${medida.toFixed(1)} contra (√2)^19 = ${ESPERADO.toFixed(1)}`],
  [okDelta, `o δ da saída é o mesmo nos três (${ult[0].toExponential(2)})`],
  [okPara, "as três varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
