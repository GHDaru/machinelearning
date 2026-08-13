// Teste da animação das fontes de vazamento (ADR 0015), rodando o
// laboratorios.js REAL num DOM mínimo. A regra que ficou do III.2: nenhuma
// animação entra sem um teste que rode o método e confira o número que o texto
// promete ao leitor.
//
// Esta animação nasceu de uma spec ERRADA. A tabela de `animacoes.md` prometia
// "AUC 0,94 → 0,71" para o vazamento de normalização, e o capítulo I.3 diz o
// contrário: "o efeito costuma ser pequeno — décimos de ponto". Medir em vez de
// confirmar mudou a animação inteira.
//
// O que o texto promete, tudo medido:
//   1. as quatro curvas partem do MESMO ponto (AUC 0,570), porque na
//      intensidade 0 as quatro são o mesmo experimento honesto;
//   2. alvo disfarçado sobe a 0,991 e duplicata a 1,000;
//   3. normalizar antes de dividir NÃO SOBE: fica em 0,567, e o sinal do efeito
//      nem é estável entre conjuntos de sorteio;
//   4. o mesmo erro sobre outra estatística (codificar por alvo) sobe a 0,753.
//      É o par 2 × 2b que dá sentido à animação.
//
// Uso: node publicar/testes/anima-vazamento.mjs

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
if (!TIPOS || !TIPOS["anima-vazamento"]) {
  console.log("FALHOU: tipo anima-vazamento não registrado");
  process.exit(1);
}

function roda(botaoIdx) {
  const area = novoEl("div");
  TIPOS["anima-vazamento"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  listeners.get(box.children[botaoIdx])();
  let n = 0;
  while (tick && n < 200) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const r = roda(0);
const outro = roda(1);          // outro conjunto de sorteios
console.log("sorteio padrão:", r.texto);
console.log("outro sorteio :", outro.texto);

const fonte = (t, rotulo) => {
  const m = new RegExp(`${rotulo}: AUC ([\\d.]+) \\(([+-][\\d.]+)\\)`).exec(t);
  return m ? { auc: Number(m[1]), ganho: Number(m[2]) } : null;
};
const alvo = fonte(r.texto, "1\\. alvo disfarçado");
const prep = fonte(r.texto, "2\\. normalizar antes de dividir");
const enc = fonte(r.texto, "2b\\. codificar por alvo antes de dividir");
const dup = fonte(r.texto, "3\\. duplicata");
const prepOutro = fonte(outro.texto, "2\\. normalizar antes de dividir");

// As quatro partem do mesmo lugar: AUC final menos ganho é a linha de base.
const bases = [alvo, prep, enc, dup].map((f) => f.auc - f.ganho);
const okMesmaBase = bases.every((b) => Math.abs(b - bases[0]) < 0.002);

const okAlvo = Math.abs(alvo.auc - 0.991) < 0.002;
const okDup = Math.abs(dup.auc - 1.000) < 0.002;
const okEnc = Math.abs(enc.auc - 0.753) < 0.002;
// A afirmação central: normalizar antes de dividir NÃO infla de forma
// detectável — o efeito cabe em um centésimo, em qualquer direção.
const okPrepPlano = Math.abs(prep.ganho) < 0.01;
// E não é só uma amostra: em outro conjunto de sorteios continua no mesmo lugar.
const okPrepEstavel = Math.abs(prepOutro.ganho) < 0.01;
// O par que dá sentido à animação: mesmo erro, estatística diferente, 60× mais.
const okPar = enc.ganho > 20 * Math.abs(prep.ganho);
const okPara = r.quadros < 200 && outro.quadros < 200;

console.log(okMesmaBase   ? `OK   as quatro curvas partem da mesma AUC (${bases[0].toFixed(3)})` : `FALHA: bases diferentes ${bases.map((b) => b.toFixed(3))}`);
console.log(okAlvo        ? "OK   alvo disfarçado chega a 0,991" : "FALHA: alvo mudou");
console.log(okDup         ? "OK   duplicata chega a 1,000" : "FALHA: duplicata mudou");
console.log(okEnc         ? "OK   codificar por alvo antes de dividir chega a 0,753" : "FALHA: codificação mudou");
console.log(okPrepPlano   ? `OK   normalizar antes de dividir fica plano (${prep.ganho})` : "FALHA: a normalização passou a inflar");
console.log(okPrepEstavel ? `OK   e continua plano em outro sorteio (${prepOutro.ganho})` : "FALHA: instável entre sorteios");
console.log(okPar         ? "OK   o mesmo erro sobre outra estatística vale muito mais" : "FALHA: o par 2 × 2b não se sustenta");
console.log(okPara        ? "OK   a varredura termina" : "FALHA: não terminou");
process.exit(okMesmaBase && okAlvo && okDup && okEnc && okPrepPlano && okPrepEstavel && okPar && okPara ? 0 : 1);
