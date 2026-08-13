// Teste da animação da deriva (V.3), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// A afirmação que ele guarda é a RESSALVA do capítulo, não a propaganda do PSI:
// a mesma deriva de entrada roda nos dois modos, com o mesmo PSI dia a dia, e a
// AUC desaba num e não se mexe no outro. Se algum dia a AUC cair também no modo
// "não dói", a animação passa a ensinar que alarme de entrada é veredito, que é
// o oposto do que o capítulo escreve.
//
// Duas coisas que a construção descobriu e que este teste protege:
//
//   1. **o adiantamento não vem de o PSI se mexer antes.** Medidos, os dois
//      cruzam no MESMO dia 32. O adiantamento vem da latência do rótulo: o PSI é
//      observável hoje, a AUC só 21 dias depois. Inventar uma dianteira para o
//      PSI seria mais bonito e seria mentira;
//   2. **um dia de referência e um dia de leitura medem sorteio.** A primeira
//      versão usava a AUC do dia 0 como base e a do dia corrente como leitura, e
//      acusava "queda de 5 pontos" no dia 9 **até no modo que não dói** — com
//      adiantamento negativo de 21 dias. A referência passou a ser a média dos 5
//      primeiros dias, a leitura uma média móvel de 3, e a amostra diária subiu
//      de 400 para 2 000.
//
// Uso: node publicar/testes/anima-deriva.mjs

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
if (!TIPOS || !TIPOS["anima-deriva"]) {
  console.log("FALHOU: tipo anima-deriva não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-deriva"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([1, 5, 13, 21, 29].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const doi = roda(0);
const naoDoi = roda(1);
console.log(doi.texto);
console.log(naoDoi.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const psiDoi = num(doi.texto, "PSI cruzou 0,25 no dia");
const psiNao = num(naoDoi.texto, "PSI cruzou 0,25 no dia");
const aucFimDoi = num(doi.texto, "AUC");
const aucFimNao = num(naoDoi.texto, "AUC");
const aviso = num(doi.texto, "o PSI avisou");

const okMesmoPSI = psiDoi === psiNao && Number.isFinite(psiDoi);
const okCai = aucFimDoi < 0.65;
const okNaoCai = /a AUC nunca caiu 5 pontos/.test(naoDoi.texto) && aucFimNao > 0.78;
const okAviso = aviso >= 21;
const okPara = doi.quadros < 2000 && naoDoi.quadros < 2000;

const linhas = [
  [okMesmoPSI, `a MESMA deriva de entrada nos dois modos: PSI cruza no dia ${psiDoi} em ambos`],
  [okCai, `na deriva que dói, a AUC desaba (${aucFimDoi.toFixed(3)} no fim)`],
  [okNaoCai, `na deriva que não dói, a AUC não se mexe (${aucFimNao.toFixed(3)}) e nunca dispara a queda`],
  [okAviso, `o aviso chega ${aviso} dias antes, e vem da latência do rótulo`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
