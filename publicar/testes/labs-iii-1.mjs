// Teste dos dois laboratórios manipuláveis do III.1, rodando o laboratorios.js
// REAL num DOM mínimo.
//
// Eles não são animações: quem aciona é o leitor. Então o que se testa não é uma
// varredura, e sim o COMPORTAMENTO do método sob os comandos do painel.
//
// O que este teste guarda:
//
//   1. **o perceptron converge em AND, OR e NAND, e NÃO converge em XOR.** É a
//      tese inteira do capítulo, e a única forma honesta de afirmá-la é rodar;
//   2. **com 4 entradas ele continua convergindo.** É o ponto que o autor pediu:
//      não dá para desenhar o plano, e o método não se importa. O erro segue
//      calculável, e é o que o placar mostra no lugar da figura;
//   3. **o circuito de dois neurônios monta o XOR** com A = OU, B = NÃO-E,
//      saída = E — e nenhuma porta sozinha faz isso, o que o teste também
//      confere varrendo as quatro portas isoladas.
//
// Uso: node publicar/testes/labs-iii-1.mjs

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const ouvintes = new Map();

function novoEl(tag) {
  const e = {
    tagName: tag, className: "", textContent: "", type: "", value: "", step: "",
    min: "", max: "", style: {}, children: [], attributes: {},
    appendChild(c) { this.children.push(c); return c; },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k] ?? null; },
    addEventListener(ev, fn) { ouvintes.set(this, fn); },
    querySelectorAll() { return []; },
  };
  if (tag === "canvas") e.getContext = () => new Proxy({}, { get: () => () => {} });
  return e;
}

const raizDoc = novoEl("html");
global.document = {
  documentElement: raizDoc, createElement: novoEl,
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
for (const t of ["perceptron-treino", "circuito-neuronios"]) {
  if (!TIPOS || !TIPOS[t]) { console.log(`FALHOU: tipo ${t} não registrado`); process.exit(1); }
}

function treino(d, alvo) {
  const area = novoEl("div");
  TIPOS["perceptron-treino"](area, {});
  const api = area.__api;
  if (d !== 2) api.setD(d); else api.setAlvo(alvo);
  api.ateParar();
  const placar = area.children[0].children[1].children.find((c) => c.className === "lab-placar");
  return { erros: api.erros(), texto: placar.textContent };
}

const and = treino(2, "AND");
const or = treino(2, "OR");
const nand = treino(2, "NAND");
const xor = treino(2, "XOR");
const quatro = treino(4, null);

console.log("AND :", and.texto);
console.log("XOR :", xor.texto);
console.log("4 ent:", quatro.texto);

const circ = novoEl("div");
TIPOS["circuito-neuronios"](circ, {});
const capi = circ.__api;
capi.set("OR", "NAND", "AND");
const certasXor = capi.certas();
const sozinhas = ["AND", "OR", "NAND", "NOR"].map((p) => {
  capi.set(p, p, "AND");                      // A e B iguais: equivale a uma porta só
  return { p, c: capi.certas() };
});
capi.set("OR", "NAND", "AND");
console.log("circuito:", circ.children[0].children[1].children.find((c) => c.className === "lab-placar").textContent);

const okLineares = and.erros === 0 && or.erros === 0 && nand.erros === 0;
const okXorNao = xor.erros > 0;
const okQuatro = quatro.erros === 0;
const okSemPlano = /não há plano para desenhar/.test(quatro.texto) === false
  ? /maioria de 4 entradas/.test(quatro.texto) : true;
const okCircuito = certasXor === 4;
const okNenhumaSozinha = sozinhas.every((s) => s.c < 4);
const okAvisaXor = /não vai convergir/.test(xor.texto);

const linhas = [
  [okLineares, "o perceptron converge em AND, OR e NAND (zero erros nos três)"],
  [okXorNao, `e NÃO converge em XOR (${xor.erros} de 4 errados depois de 60 épocas)`],
  [okAvisaXor, "e o placar diz isso ao leitor, em vez de deixá-lo esperando"],
  [okQuatro, "com 4 entradas, o mesmo método converge (zero erros) sem plano nenhum para desenhar"],
  [okSemPlano, "e o placar identifica a função de 4 entradas"],
  [okCircuito, `dois neurônios montam o XOR: A=OU, B=NÃO-E, saída=E dá ${certasXor} de 4`],
  [okNenhumaSozinha, `e nenhuma porta sozinha chega lá (${sozinhas.map((s) => s.p + "=" + s.c).join(", ")})`],
];
linhas.forEach(([ok, msg]) => console.log((ok ? "OK   " : "FALHA: ") + msg));
process.exit(linhas.every(([ok]) => ok) ? 0 : 1);
