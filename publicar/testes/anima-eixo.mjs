// Teste da animação do eixo truncado (I.5), rodando o laboratorios.js REAL num
// DOM mínimo e lendo os números do placar.
//
// Ele guarda a conta do exercício deste capítulo, e foi ele quem a corrigiu. O
// enunciado dizia que a última barra fica "cerca de ONZE vezes" a altura da
// primeira com o eixo começando em 88. São **doze**, exatamente: as alturas
// passam a ser 0,1 · 0,4 · 0,9 · 1,2, e 1,2 ÷ 0,1 = 12. O texto foi corrigido no
// mesmo commit desta animação.
//
// As duas asserções que importam:
//
//   1. **os valores não mudam em quadro nenhum.** A razão real entre a maior e a
//      menor barra é 1,0125 do começo ao fim. Se ela se mexer, a animação passou
//      a mentir sobre o dado em vez de sobre o eixo, que é o oposto da lição;
//   2. **a razão do que se vê chega a 12,00 na base 88**, com exagero de 11,9
//      vezes sobre o real.
//
// E guarda a regra que o capítulo enuncia: em LINHA o comprimento não codifica
// nada, então o placar deixa de exibir razão de alturas em vez de exibir um
// número que não significaria coisa alguma.
//
// Uso: node publicar/testes/anima-eixo.mjs

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
if (!TIPOS || !TIPOS["anima-eixo"]) {
  console.log("FALHOU: tipo anima-eixo não registrado");
  process.exit(1);
}

/** Instancia do zero e clica no botão de modo `vezes` vezes, para cair no modo. */
function roda(vezes) {
  const area = novoEl("div");
  TIPOS["anima-eixo"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  for (let q = 0; q < vezes; q++) listeners.get(box.children[1])();
  let n = 0; const snaps = [];
  while (tick && n < 2000) { tick(); n++; if ([1, 5, 13, 21, 29].includes(n)) snaps.push(placar.textContent); }
  return { texto: placar.textContent, quadros: n, snaps };
}

const barra = roda(0);
const linha = roda(1);
console.log(barra.texto);
console.log(linha.texto);

const num = (txt, rot) => {
  const m = new RegExp(rot + " (-?[\\d.]+)").exec(txt);
  return m ? Number(m[1]) : NaN;
};

const real = num(barra.texto, "razão real entre a maior e a menor");
const vista = num(barra.texto, "razão das alturas na tela");
const exagero = num(barra.texto, "o exagero é de");
const baseFim = num(barra.texto, "base do eixo");
const realLinha = num(linha.texto, "razão real entre a maior e a menor");

const okDadoIntacto = /88\.1 · 88\.4 · 88\.9 · 89\.2 \(inalterados\)/.test(barra.texto) &&
  Math.abs(real - 1.0125) < 1e-4 && Math.abs(realLinha - real) < 1e-12;
const okBase = Math.abs(baseFim - 88) < 1e-9;
const okDoze = Math.abs(vista - 12) < 0.01;
const okExagero = Math.abs(exagero - 11.9) < 0.1;
const okLinha = /na linha o comprimento não codifica nada/.test(linha.texto) &&
  !/razão das alturas na tela/.test(linha.texto);
const okPara = barra.quadros < 2000 && linha.quadros < 2000;

const linhas = [
  [okDadoIntacto, `os valores não mudam, e a razão real fica em ${real.toFixed(4)} nos dois modos`],
  [okBase, `a varredura termina na base 88 do exercício (${baseFim.toFixed(1)})`],
  [okDoze, `a razão das alturas na tela chega a ${vista.toFixed(2)}, e não a "cerca de onze"`],
  [okExagero, `o exagero sobre o real é de ${exagero.toFixed(1)} vezes`],
  [okLinha, "em linha, o placar deixa de exibir razão de alturas, porque comprimento não codifica"],
  [okPara, "as duas varreduras terminam"],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
