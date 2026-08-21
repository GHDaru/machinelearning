// Teste do laboratório MLP-TABELA (III.2), rodando o laboratorios.js REAL num
// DOM mínimo.
//
// Este laboratório continua a conta à mão do capítulo, e é essa continuidade que
// o teste guarda. Se algum dia o código mudar de convenção — outra perda, outra
// ordem de casos, outro sinal — a tabela do capítulo e a da tela deixariam de
// bater, e ninguém notaria pelo build. Aqui as duas são comparadas célula a
// célula.
//
// O que este teste guarda:
//
//   1. **o primeiro passo reproduz o capítulo dígito por dígito** — os nove
//      pesos depois, mais h₁, h₂, ŷ, a perda, δ_y e os dois deltas escondidos;
//   2. **gradiente zero onde a entrada é zero.** No caso (1,0), w₂₁ e w₂₂ não
//      recebem gradiente, e a tabela do capítulo marca esses dois em negrito;
//   3. **a partida do capítulo fecha o XOR**, e o número de épocas é medido aqui
//      em vez de afirmado de memória;
//   4. **"tudo zero" NÃO fecha**, e a razão é verificada, não narrada: a simetria
//      entre h₁ e h₂ nunca se quebra em nenhum passo;
//   5. **η move número na tela** — sem isso a manopla é enfeite, e o ADR 0015
//      proíbe.
//
// Uso: node publicar/testes/lab-mlp-tabela.mjs

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
if (!TIPOS || !TIPOS["mlp-tabela"]) {
  console.log("FALHOU: tipo mlp-tabela não registrado");
  process.exit(1);
}

const area = novoEl("div");
TIPOS["mlp-tabela"](area, {});
const api = area.__api;
const { umPasso, frente, placarDos, ateFechar, copiar, PARTIDAS, CASOS } = api;

const q4 = (v) => Number(v.toFixed(4));
const igual = (a, b) => Math.abs(a - b) < 5e-5;

// ---- (1) o primeiro passo, contra a tabela publicada no capítulo ------------
const q = copiar(PARTIDAS.capitulo);
const f0 = frente(q, [1, 0]);
const r1 = umPasso(q, [1, 0, 1], 0.5);

// Os valores estão em livro/capitulos/iii-2-redes-neurais.md, seção
// "Um passo inteiro, com números". Copiados de lá, não do código.
const CAPITULO = {
  h1: 0.6457, h2: 0.5250, u: 0.2199, y: 0.5548, perda: 0.1982,
  dy: -0.2200, d1: -0.0302, d2: 0.0384,
  gv1: -0.1420, gv2: -0.1155, gc: -0.2200,
  depois: { w11: 0.5151, w21: -0.4, b1: 0.1151, w12: 0.2808, w22: 0.8,
            b2: -0.2192, v1: 0.6710, v2: -0.6423, c: 0.3100 },
  yDepois: 0.6027, perdaDepois: 0.1578,
};

const frenteOk = [
  [igual(f0.h[0], CAPITULO.h1), `h₁ = ${q4(f0.h[0])} (capítulo: ${CAPITULO.h1})`],
  [igual(f0.h[1], CAPITULO.h2), `h₂ = ${q4(f0.h[1])} (capítulo: ${CAPITULO.h2})`],
  [igual(f0.u, CAPITULO.u), `u = ${q4(f0.u)} (capítulo: ${CAPITULO.u})`],
  [igual(f0.y, CAPITULO.y), `ŷ = ${q4(f0.y)} (capítulo: ${CAPITULO.y})`],
  [igual(r1.perda, CAPITULO.perda), `E = ${q4(r1.perda)} (capítulo: ${CAPITULO.perda})`],
];
const trasOk = [
  [igual(r1.dy, CAPITULO.dy), `δ_y = ${q4(r1.dy)} (capítulo: ${CAPITULO.dy})`],
  [igual(r1.d[0], CAPITULO.d1), `δ₁ = ${q4(r1.d[0])} (capítulo: ${CAPITULO.d1})`],
  [igual(r1.d[1], CAPITULO.d2), `δ₂ = ${q4(r1.d[1])} (capítulo: ${CAPITULO.d2})`],
  [igual(r1.g.v1, CAPITULO.gv1), `∂E/∂v₁ = ${q4(r1.g.v1)} (capítulo: ${CAPITULO.gv1})`],
  [igual(r1.g.v2, CAPITULO.gv2), `∂E/∂v₂ = ${q4(r1.g.v2)} (capítulo: ${CAPITULO.gv2})`],
  [igual(r1.g.c, CAPITULO.gc), `∂E/∂c = ${q4(r1.g.c)} (capítulo: ${CAPITULO.gc})`],
];
const depoisOk = Object.keys(CAPITULO.depois).map((k) => [
  igual(r1.depois[k], CAPITULO.depois[k]),
  `${k} depois = ${q4(r1.depois[k])} (capítulo: ${CAPITULO.depois[k]})`,
]);

// e o resultado do passo: a perda cai e a previsão sobe para os números do texto
const f1 = frente(q, [1, 0]);
const okDepois = igual(f1.y, CAPITULO.yDepois) &&
                 igual((f1.y - 1) ** 2, CAPITULO.perdaDepois);

// ---- (2) entrada zerada, gradiente zerado ----------------------------------
const okCulpa = r1.g.w21 === 0 && r1.g.w22 === 0 && r1.g.w11 !== 0 && r1.g.w12 !== 0;

// ---- (3) a partida do capítulo fecha o XOR ---------------------------------
const fecha = ateFechar("capitulo", 0.5, 4000);

// ---- (4) tudo zero não fecha, e a simetria nunca se quebra -----------------
const zero = ateFechar("zero", 0.5, 4000);
const plZero = placarDos(zero.q);
const okZeroTravado = zero.epocas === null && zero.simetrico === true;
// e a razão exportável: ela empaca onde o perceptron do III.1 empacava
const okZeroTresDeQuatro = plZero.acertos === 3;

// ---- (5) η move número -----------------------------------------------------
const porTaxa = [0.1, 0.5, 1].map((t) => ({ t, e: ateFechar("capitulo", t, 4000).epocas }));
const okTaxaImporta = new Set(porTaxa.map((p) => p.e)).size > 1;

console.log("XOR pela partida do capítulo:", fecha.epocas, "épocas · perda", q4(fecha.perda));
console.log("tudo zero:", zero.epocas === null ? "não fecha" : zero.epocas + " épocas",
            "· acerta", plZero.acertos, "de 4 · perda", q4(plZero.perda));
console.log("épocas por η:", porTaxa.map((p) => `η=${p.t} → ${p.e === null ? "não fecha" : p.e}`).join(", "));

const linhas = [
  ...frenteOk, ...trasOk, ...depoisOk,
  [okDepois, `depois do passo: ŷ = ${q4(f1.y)} e E = ${q4((f1.y - 1) ** 2)} (capítulo: ${CAPITULO.yDepois} e ${CAPITULO.perdaDepois})`],
  [okCulpa, "no caso (1,0) os pesos de x₂ não recebem gradiente, e os de x₁ recebem"],
  [fecha.epocas !== null, `a partida do capítulo fecha o XOR (deu ${fecha.epocas} épocas)`],
  [okZeroTravado, "“tudo zero” não fecha, e h₁ e h₂ permanecem idênticas em TODO passo"],
  [okZeroTresDeQuatro, `“tudo zero” empaca em ${plZero.acertos} de 4 — o mesmo lugar do perceptron do III.1`],
  [okTaxaImporta, "η muda o número de épocas (a manopla não é enfeite)"],
  [CASOS[0][0] === 1 && CASOS[0][1] === 0, "o primeiro caso da fila é (1,0): o do capítulo"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
