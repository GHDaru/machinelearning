// Teste da animação do custo assimétrico (II.8), rodando o laboratorios.js REAL
// num DOM mínimo e lendo os números do placar.
//
// O capítulo diz que probabilidade ordena e custo decide. A animação existe para
// mostrar o "custo decide" como movimento, e este teste guarda três coisas:
//
//   1. **a direção**, que é o que o leitor erra. Quando errar por omissão fica
//      dez vezes mais caro, o limiar ótimo DESCE (de ~0,46 para ~0,11), porque o
//      que ficou caro foi deixar passar. A intuição diz o contrário;
//   2. **a fórmula**, e é por isso que os escores são calibrados por construção:
//      com escore calibrado o limiar ótimo é 1/(1+custo), e a curva medida tem de
//      acompanhar essa linha. Se descolar, a animação virou tendência ilustrada;
//   3. **o preço da inércia**: manter 0,50 "por padrão" custa mais de 2 000 por
//      mil casos quando o falso negativo vale 10.
//
// A asserção do escore espremido é RELATIVA ao caso calibrado (desvio pelo menos
// 4× maior), e não contra um número absoluto. A primeira versão exigia desvio
// acima de 0,15 e reprovou com 0,104 — mas 0,104 contra 0,015 já é a falha que a
// animação ensina. O corte absoluto era arbitrário; o que a afirmação diz é "a
// fórmula deixa de ser um bom guia", e isso só existe em relação ao caso em que
// ela é um bom guia.
//
// E guarda a contraprova, que é o segundo botão: espremendo os escores para o
// meio, a ORDEM se mantém e a calibração morre. A fórmula deixa de valer na hora
// — o limiar ótimo quase para de responder ao custo (0,34 → 0,26 em vez de 0,50 →
// 0,11). É a terceira pergunta do capítulo II.1 aparecendo como dinheiro.
//
// Uso: node publicar/testes/anima-custo.mjs

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
if (!TIPOS || !TIPOS["anima-custo"]) {
  console.log("FALHOU: tipo anima-custo não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-custo"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([1, 5, 13, 21, 29].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const cal = roda(0);
const esp = roda(1);
cal.snaps.forEach((s) => console.log("calibrado |", s.split(" · ").slice(1, 4).join(" · ")));
esp.snaps.forEach((s) => console.log("espremido |", s.split(" · ").slice(1, 4).join(" · ")));

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};
const desvios = (r) => r.snaps.map((s) => Math.abs(
  num(s, "limiar ótimo") - num(s, "a fórmula 1/\\(1\\+custo\\) dá")));
const media = (v) => v.reduce((a, b) => a + b, 0) / v.length;

const limCal = cal.snaps.map((s) => num(s, "limiar ótimo"));
const limEsp = esp.snaps.map((s) => num(s, "limiar ótimo"));
const dCal = media(desvios(cal)), dEsp = media(desvios(esp));
const g50 = num(cal.texto, "mantendo 0,50 seria");
const gOt = num(cal.texto, "custo por 1000 casos");

const okDesce = limCal[limCal.length - 1] < limCal[0] - 0.25;
const okFormula = dCal < 0.03;
const okEspFalha = dEsp > dCal * 4;
const okEspTravado = Math.abs(limEsp[limEsp.length - 1] - limEsp[0]) < 0.15;
const okInercia = g50 - gOt > 2000;
const okPara = cal.quadros < 2000 && esp.quadros < 2000;

const linhas = [
  [okDesce, `o limiar ótimo DESCE quando o falso negativo encarece (${limCal[0].toFixed(3)} para ${limCal[limCal.length - 1].toFixed(3)})`],
  [okFormula, `com escore calibrado, a medição acompanha 1/(1+custo) (desvio médio ${dCal.toFixed(3)})`],
  [okEspFalha, `com escore espremido, a fórmula deixa de valer (desvio médio ${dEsp.toFixed(3)}, contra ${dCal.toFixed(3)} do calibrado)`],
  [okEspTravado, `e o limiar quase para de responder ao custo (${limEsp[0].toFixed(3)} para ${limEsp[limEsp.length - 1].toFixed(3)})`],
  [okInercia, `manter 0,50 custa ${(g50 - gOt).toFixed(0)} a mais por mil casos`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
