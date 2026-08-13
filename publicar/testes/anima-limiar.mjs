// Teste da animação do limiar (II.1), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// O que ele guarda é a promessa que o capítulo faz ao leitor, e ela tem três
// partes que se sustentam ou caem juntas:
//
//   1. a AUC-ROC NÃO se move quando a prevalência muda. É o teorema, não uma
//      tendência: a ROC olha só para dentro de cada classe. Se algum dia o
//      número tremer, é porque alguém trocou o peso por reamostragem, e a
//      animação passa a desmentir a seção "o ranking é bom?";
//   2. a AUC-PR desaba com a classe rara, e é por isso que o capítulo a
//      prefere nesse regime;
//   3. dizer "não" a tudo dá acurácia 0,99 com 1% de positivos. É o O1 do
//      capítulo, e é o número que o leitor prevê errado.
//
// Uso: node publicar/testes/anima-limiar.mjs

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
if (!TIPOS || !TIPOS["anima-limiar"]) {
  console.log("FALHOU: tipo anima-limiar não registrado");
  process.exit(1);
}

/** Roda a varredura inteira e devolve o placar final, mais o do meio do
 *  caminho — a acurácia enganosa vive no limiar alto, não no fim. */
function roda(clicarBotao) {
  const area = novoEl("div");
  TIPOS["anima-limiar"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  if (clicarBotao != null) {
    const box = area.children.find((c) => c.className === "lab-botoes");
    listeners.get(box.children[clicarBotao])();
  }
  let n = 0, cedo = null;
  while (tick && n < 5000) {
    tick(); n++;
    if (n === 5) cedo = placar.textContent;   // limiar ainda alto
  }
  return { fim: placar.textContent, cedo, quadros: n };
}

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const eq = roda(null);
const raro = roda(1);

console.log("equilibrado (fim):", eq.fim);
console.log("raro (fim)       :", raro.fim);
console.log("raro (cedo)      :", raro.cedo);

const rocEq = num(eq.fim, "AUC-ROC"), rocRaro = num(raro.fim, "AUC-ROC");
const prEq = num(eq.fim, "AUC-PR"), prRaro = num(raro.fim, "AUC-PR");
const accCedo = num(raro.cedo, "acurácia"), recCedo = num(raro.cedo, "revocação");
const naoATudo = num(raro.fim, "dizer não a tudo dá acurácia");

const okRoc = Number.isFinite(rocEq) && Math.abs(rocEq - rocRaro) < 5e-4;
const okRocBoa = rocEq > 0.7;                       // o modelo ordena de fato
const okPr = prRaro < prEq - 0.3 && prRaro > 0.01;  // desaba, mas fica acima da base
const okTrap = accCedo > 0.98 && recCedo < 0.2;     // acurácia alta com revocação nula
const okNao = Math.abs(naoATudo - 0.99) < 1e-6;
const okPara = eq.quadros < 5000 && raro.quadros < 5000;

const linhas = [
  [okRoc, `a AUC-ROC não se move com a prevalência (${rocEq.toFixed(3)} contra ${rocRaro.toFixed(3)})`],
  [okRocBoa, `o modelo ordena de verdade (AUC-ROC ${rocEq.toFixed(3)})`],
  [okPr, `a AUC-PR desaba com a classe rara (${prEq.toFixed(3)} para ${prRaro.toFixed(3)})`],
  [okTrap, `no limiar alto e com 1% de positivos, acurácia ${accCedo.toFixed(3)} com revocação ${recCedo.toFixed(3)}`],
  [okNao, `dizer não a tudo dá acurácia ${naoATudo.toFixed(3)}`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
