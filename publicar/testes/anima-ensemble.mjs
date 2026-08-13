// Teste da animação do ensemble (II.5), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// O experimento é o MESMO orçamento de cortes gasto de dois jeitos: numa árvore
// que vai fundo, ou espalhado em tocos somados. Mesmo dado, mesma divisão
// treino/validação, mesmo número de cortes — senão a comparação mediria o
// orçamento em vez de medir a alocação dele.
//
// O resultado medido é mais interessante que "boosting ganha", e o teste guarda a
// nuance inteira:
//
//   | | melhor validação | onde | terminou | cortes gastos PIORANDO |
//   |---|---|---|---|---|
//   | árvore única | 0,2969 | 11 cortes | 0,3573 | **21** |
//   | tocos somados | 0,3041 | 59 cortes | 0,3051 | 1 |
//
// A árvore tem o **melhor ponto isolado** (0,2969 contra 0,3041). Só que ela o
// atinge no corte 11 e depois passa 21 cortes piorando, terminando 20% acima do
// próprio melhor. O boosting nunca chega ao ponto da árvore e termina melhor do
// que ela termina.
//
// A lição, então, não é "boosting é mais poderoso". É: **a árvore ganha se você
// souber exatamente onde parar, e o boosting ganha se você não souber** — e você
// nunca sabe sem um conjunto de validação, que é justamente o que o capítulo
// anterior cobra.
//
// Uso: node publicar/testes/anima-ensemble.mjs

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
if (!TIPOS || !TIPOS["anima-ensemble"]) {
  console.log("FALHOU: tipo anima-ensemble não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-ensemble"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([9999].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const arvore = roda(0);
const boost = roda(1);
console.log(arvore.texto);
console.log(boost.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const melhorA = num(arvore.texto, "a validação foi melhor em");
const ondeA = num(arvore.texto, "com");
const fimA = num(arvore.texto, "terminou em");
const piorouA = num(arvore.texto, "e piorou por");
const melhorB = num(boost.texto, "a validação foi melhor em");
const fimB = num(boost.texto, "terminou em");
const piorouB = num(boost.texto, "e piorou por");

const okVira = ondeA <= 15 && piorouA >= 10;
const okDegrada = fimA > melhorA * 1.15;
const okBoostMonotono = piorouB <= 3;
const okBoostTerminaMelhor = fimB < fimA;
const okArvoreTemMelhorPonto = melhorA < melhorB;
const okPara = arvore.quadros < 2000 && boost.quadros < 2000;

const linhas = [
  [okVira, `a árvore vira no corte ${ondeA} e passa ${piorouA} cortes piorando`],
  [okDegrada, `termina ${((fimA / melhorA - 1) * 100).toFixed(0)}% acima do próprio melhor (${melhorA.toFixed(4)} para ${fimA.toFixed(4)})`],
  [okBoostMonotono, `o boosting piora por apenas ${piorouB} corte(s)`],
  [okBoostTerminaMelhor, `e termina melhor do que a árvore termina (${fimB.toFixed(4)} contra ${fimA.toFixed(4)})`],
  [okArvoreTemMelhorPonto, `mas a árvore tem o melhor ponto isolado (${melhorA.toFixed(4)} contra ${melhorB.toFixed(4)}) — a nuance que impede "boosting é mais poderoso"`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
