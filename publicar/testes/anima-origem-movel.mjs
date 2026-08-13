// Teste da animação da origem móvel (II.7), rodando o laboratorios.js REAL num
// DOM mínimo e lendo os números do placar.
//
// O que ele guarda é a afirmação do O2 do capítulo, e ela tem um SINAL antes de
// ter um tamanho: a divisão embaralhada não erra mais, ela erra MENOS. É isso
// que a torna perigosa, porque um erro que aparece pequeno vira slide. Se algum
// dia o embaralhado ficar acima da origem móvel, a animação passa a ensinar o
// contrário do capítulo.
//
// A segunda asserção é a que importa mais, e ela não é sobre um número e sim
// sobre uma DEPENDÊNCIA: o tamanho da mentira cresce quando o futuro difere
// mais do passado. Sem quebra de regime o embaralhado mente por volta de 1,9×;
// com quebra, por volta de 3,7×. O par é a lição, e uma animação que mostrasse
// só um número ensinaria que o vazamento tem tamanho fixo.
//
// Sobre a tendência da série (0,09 por passo): é escolha de realismo, não de
// efeito. Varrida em 0,035 / 0,09 / 0,18, a mentira sem quebra vale 1,1× / 1,9×
// / 3,5×. Fica registrado para que ninguém pense que o número foi escolhido
// pelo tamanho, e para que a dependência esteja escrita.
//
// Uso: node publicar/testes/anima-origem-movel.mjs

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
if (!TIPOS || !TIPOS["anima-origem-movel"]) {
  console.log("FALHOU: tipo anima-origem-movel não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-origem-movel"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0;
  while (tick && n < 2000) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const semQuebra = roda(0);
const comQuebra = roda(1);
console.log(semQuebra.texto);
console.log(comQuebra.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const movSem = num(semQuebra.texto, "MAE médio da origem móvel");
const embSem = num(semQuebra.texto, "MAE da divisão embaralhada");
const movCom = num(comQuebra.texto, "MAE médio da origem móvel");
const embCom = num(comQuebra.texto, "MAE da divisão embaralhada");
const razSem = movSem / embSem, razCom = movCom / embCom;

const okSinal = embSem < movSem && embCom < movCom;
const okEscala = razCom > razSem * 1.5;
const okQuebraDoi = movCom > movSem * 1.5;
const okEmbCego = Math.abs(embCom - embSem) < 0.4;
const okPara = semQuebra.quadros < 2000 && comQuebra.quadros < 2000;

const linhas = [
  [okSinal, `o embaralhado erra MENOS, nas duas séries (${embSem.toFixed(2)} contra ${movSem.toFixed(2)}; ${embCom.toFixed(2)} contra ${movCom.toFixed(2)})`],
  [okEscala, `a mentira cresce quando o futuro difere do passado (${razSem.toFixed(1)}x sem quebra, ${razCom.toFixed(1)}x com)`],
  [okQuebraDoi, `a quebra dói na origem móvel (${movSem.toFixed(2)} para ${movCom.toFixed(2)})`],
  [okEmbCego, `e o embaralhado quase não a enxerga (${embSem.toFixed(2)} para ${embCom.toFixed(2)})`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
