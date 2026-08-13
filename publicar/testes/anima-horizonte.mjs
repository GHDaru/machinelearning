// Teste da animação do horizonte (I.1), rodando o laboratorios.js REAL num DOM
// mínimo e lendo os números do placar.
//
// É a animação do capítulo de abertura da Parte I, e ela encena o fracasso que
// abre o capítulo: a equipe define o rótulo pelo que os dados permitem, entrega
// uma AUC bonita, e a lista chega depois da renovação.
//
// Duas curvas andando em sentidos opostos enquanto o horizonte desliza de 5 a 120
// dias de silêncio:
//
//   - **a AUC sobe** (0,76 no fim), porque cliente calado há muito tempo é fácil
//     de prever;
//   - **a fração ainda acionável cai a 0,000**, porque quando o alarme toca a
//     renovação já passou.
//
// E o produto das duas tem máximo no MEIO: 0,7070 no horizonte de **23 dias** com
// a renovação no dia 60. Trocando a renovação para o dia 30, o ótimo vai para
// **11 dias**. É o resultado que o teste segura, porque é a tese do capítulo em
// número: **o prazo da operação escolhe o horizonte, e não o que a tabela
// permite**. A curva de AUC não sabe nada disso.
//
// Um defeito da construção, registrado: na primeira versão todos os clientes
// renovavam no mesmo dia, a fração acionável virava um degrau e os dois modos
// davam exatamente o mesmo ótimo. Cada cliente passou a ter a sua data.
//
// Uso: node publicar/testes/anima-horizonte.mjs

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
if (!TIPOS || !TIPOS["anima-horizonte"]) {
  console.log("FALHOU: tipo anima-horizonte não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-horizonte"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([3].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const r60 = roda(0);
const r30 = roda(1);
console.log("cedo (renov 60):", r60.snaps[0]);
console.log(r60.texto);
console.log(r30.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const aucCedo = num(r60.snaps[0], "AUC");
const aucFim = num(r60.texto, "AUC");
const acionFim = num(r60.texto, "fração ainda acionável");
const h60 = num(r60.texto, "no horizonte de");
const h30 = num(r30.texto, "no horizonte de");
const val60 = num(r60.texto, "o melhor produto AUC × acionável foi");
const val30 = num(r30.texto, "o melhor produto AUC × acionável foi");

const okAucSobe = aucFim > aucCedo + 0.05;
const okAcionZera = acionFim < 0.01;
const okOtimoInterior = h60 > 6 && h60 < 110;
const okPrazoMandaNoHorizonte = h30 < h60 * 0.7;
const okValorCai = val30 < val60;
const okPara = r60.quadros < 2000 && r30.quadros < 2000;

const linhas = [
  [okAucSobe, `a AUC sobe com o horizonte (${aucCedo.toFixed(4)} para ${aucFim.toFixed(4)})`],
  [okAcionZera, `e a fração acionável cai a ${acionFim.toFixed(3)}`],
  [okOtimoInterior, `o produto das duas tem máximo no meio, no horizonte de ${h60} dias`],
  [okPrazoMandaNoHorizonte, `e o prazo da operação é que o escolhe: renovação no dia 30 move o ótimo para ${h30} dias`],
  [okValorCai, `com prazo menor, o melhor valor possível também cai (${val60.toFixed(4)} para ${val30.toFixed(4)})`],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
