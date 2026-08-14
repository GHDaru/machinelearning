// Teste do laboratório da TABELA do perceptron (III.1), rodando o
// laboratorios.js REAL num DOM mínimo.
//
// Este laboratório não desenha nada: ele mostra a aritmética que os outros
// escondem. Então o que se testa é a aritmética, célula por célula.
//
// O que este teste guarda:
//
//   1. **a partida do capítulo converge em 3 épocas**, com pesos finais
//      w₁ = 0,8 e w₂ = 0,9. É o número que o exercício `e13` cobra, e ele não
//      pode ser afirmado de memória;
//   2. **Δwᵢ = 0 quando xᵢ = 0, mesmo com erro ≠ 0.** É a explicação de "de
//      quem é a culpa" virada em asserção: se algum dia o ajuste passar a
//      mexer no peso que não participou, o teste cai;
//   3. **o XOR não converge** — o teto é atingido e o placar diz isso;
//   4. **a taxa de aprendizado muda o número de épocas.** Se não mudasse, o
//      controle de η no painel seria enfeite, e o ADR 0015 proíbe manopla que
//      não move número na tela.
//
// Uso: node publicar/testes/lab-perceptron-tabela.mjs

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

function novoEl(tag) {
  const e = {
    tagName: tag, className: "", textContent: "", innerHTML: "", type: "", value: "",
    step: "", min: "", max: "", style: {}, children: [], attributes: {},
    appendChild(c) { this.children.push(c); return c; },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k] ?? null; },
    addEventListener() {},
    querySelectorAll() { return []; },
  };
  if (tag === "canvas") e.getContext = () => new Proxy({}, { get: () => () => {} });
  return e;
}

global.document = {
  documentElement: novoEl("html"), createElement: novoEl,
  querySelectorAll: () => [], addEventListener: () => {}, readyState: "complete",
};
global.window = { matchMedia: () => ({ matches: false }), document: global.document };
global.setInterval = () => 1;
global.clearInterval = () => {};

const src = readFileSync(resolve(RAIZ, "publicar/tema/laboratorios.js"), "utf8");
new Function("window", "document", "setInterval", "clearInterval",
  src.replace("var TIPOS = {", "var TIPOS = globalThis.__TIPOS = {"))
  (global.window, global.document, global.setInterval, global.clearInterval);

const TIPOS = globalThis.__TIPOS;
if (!TIPOS || !TIPOS["perceptron-tabela"]) {
  console.log("FALHOU: tipo perceptron-tabela não registrado");
  process.exit(1);
}

const area = novoEl("div");
TIPOS["perceptron-tabela"](area, {});
const api = area.__api;
const { treinar } = api;

const PARTIDA = { taxa: 0.5, w1: -0.2, w2: 0.4, theta: 0.5, alvo: "OR" };
const r = treinar(PARTIDA);

// (1) o número que o capítulo e o exercício afirmam
const perto = (a, b) => Math.abs(a - b) < 1e-9;
const okEpocas = r.epocas === 3;
const okPesos = perto(r.w1, 0.8) && perto(r.w2, 0.9);

// (2) a regra da culpa: entrada zerada, ajuste zerado — mesmo errando
const comErroEx2Zero = r.linhas.filter((L) => L.erro !== 0 && L.x2 === 0);
const comErroEx1Zero = r.linhas.filter((L) => L.erro !== 0 && L.x1 === 0);
const okCulpa2 = comErroEx2Zero.length > 0 && comErroEx2Zero.every((L) => L.d2 === 0);
const okCulpa1 = comErroEx1Zero.length > 0 && comErroEx1Zero.every((L) => L.d1 === 0);
// e o contrapositivo: onde a entrada valia 1 e houve erro, o peso MEXEU
const mexeu = r.linhas.filter((L) => L.erro !== 0 && L.x1 === 1);
const okMexeu = mexeu.length > 0 && mexeu.every((L) => L.d1 !== 0);

// (3) o XOR não fecha
const rx = treinar({ ...PARTIDA, alvo: "XOR" });
const okXor = rx.epocas === null;

// (4) η muda o resultado — a manopla precisa mover número
const porTaxa = [0.1, 0.2, 0.5, 1].map((t) => ({ t, e: treinar({ ...PARTIDA, taxa: t }).epocas }));
const okTaxaImporta = new Set(porTaxa.map((p) => p.e)).size > 1;

// (5) o caso (0,0) nunca move peso nenhum, em nenhuma linha
const zeroZero = r.linhas.filter((L) => L.x1 === 0 && L.x2 === 0);
const okZeroZero = zeroZero.length > 0 && zeroZero.every((L) => L.d1 === 0 && L.d2 === 0);

console.log("épocas até convergir:", r.epocas, "| pesos finais:", r.w1.toFixed(2), r.w2.toFixed(2));
console.log("épocas por η:", porTaxa.map((p) => `η=${p.t} → ${p.e === null ? "não converge" : p.e}`).join(", "));

const linhas = [
  [okEpocas, `a partida do capítulo converge em 3 épocas (deu ${r.epocas})`],
  [okPesos, `com pesos finais w₁=0,8 e w₂=0,9 (deu ${r.w1.toFixed(2)} e ${r.w2.toFixed(2)})`],
  [okCulpa2, `erro com x₂=0 nunca mexe em w₂ (${comErroEx2Zero.length} linha(s) conferida(s))`],
  [okCulpa1, `erro com x₁=0 nunca mexe em w₁ (${comErroEx1Zero.length} linha(s) conferida(s))`],
  [okMexeu, `e onde a entrada valia 1 e houve erro, o peso mexeu (${mexeu.length} linha(s))`],
  [okZeroZero, "o caso (0,0) não move peso nenhum, em nenhuma linha"],
  [okXor, "o XOR não converge dentro do teto"],
  [okTaxaImporta, "a taxa de aprendizado muda o número de épocas (a manopla não é enfeite)"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
