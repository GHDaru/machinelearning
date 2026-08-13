// Teste da animação de viés e variância (ADR 0015), rodando o laboratorios.js
// REAL num DOM mínimo. A regra que ficou do III.2: nenhuma animação entra sem
// um teste que rode o método e confira o número que o texto promete ao leitor.
//
// Aqui o texto promete três coisas, e as três são o argumento do capítulo:
//   1. existe joelho: o erro de validação vira para cima, e o menor fica no
//      grau 5;
//   2. o fundo da curva de validação é o PISO IRREDUTÍVEL — ele bate com a
//      variância do ruído (0,5 × 0,15² ≈ 0,011), e o erro de treino desce
//      ABAIXO dele, que é o modelo ajustando ruído;
//   3. com 3× mais dados, o castigo por passar do joelho desaba: no grau 15 o
//      erro de validação vai de ~0,48 para ~0,015.
//
// A terceira era, na primeira redação desta spec, "o joelho anda para a
// direita". Medido, ele NÃO anda: fica no grau 5 nos dois casos. O que muda é
// o preço de errar para cima, e essa é a lição melhor. Ver `animacoes.md`.
//
// Uso: node publicar/testes/anima-vies-variancia.mjs

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
if (!TIPOS || !TIPOS["anima-vies-variancia"]) {
  console.log("FALHOU: tipo anima-vies-variancia não registrado");
  process.exit(1);
}

function roda(botaoIdx) {
  const area = novoEl("div");
  TIPOS["anima-vies-variancia"](area, {});
  const placar = area.children.find((c) => c.className === "lab-placar");
  const box = area.children.find((c) => c.className === "lab-botoes");
  listeners.get(box.children[botaoIdx == null ? 0 : botaoIdx])();
  let n = 0;
  while (tick && n < 200) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const padrao = roda(0);
const maisDados = roda(1);
console.log("20 pontos:", padrao.texto);
console.log("60 pontos:", maisDados.texto);

const num = (t, re) => { const m = re.exec(t); return m ? Number(m[1]) : null; };
const grauDe = (t) => num(t, /melhor até aqui: grau (\d+)/);
const pisoDe = (t) => num(t, /melhor até aqui: grau \d+ com ([\d.]+)/);
const valDe = (t) => num(t, /erro de validação ([\d.]+)/);
const trDe = (t) => num(t, /erro de treino ([\d.]+)/);

const PISO_TEORICO = 0.5 * 0.15 * 0.15;   // variância do ruído Irwin-Hall de 6

const okCompleta = /varredura completa/.test(padrao.texto) && /varredura completa/.test(maisDados.texto);
const okJoelho = grauDe(padrao.texto) === 5 && grauDe(maisDados.texto) === 5;
// O fundo da validação é o piso do ruído, não zero: aceito 40% de folga, que é
// a variação amostral de 200 pontos de validação.
const okPiso = Math.abs(pisoDe(padrao.texto) - PISO_TEORICO) < 0.4 * PISO_TEORICO;
// Treino ABAIXO do piso é a assinatura de ajustar ruído.
const okAjustaRuido = trDe(padrao.texto) < PISO_TEORICO;
// O castigo por passar do joelho desaba com mais dado.
const okCastigo = valDe(padrao.texto) > 20 * pisoDe(padrao.texto) &&
                  valDe(maisDados.texto) < 2 * pisoDe(maisDados.texto);
const okPara = padrao.quadros < 200 && maisDados.quadros < 200;

console.log(okCompleta    ? "OK   as duas varreduras chegam ao grau 15" : "FALHA: varredura não completou");
console.log(okJoelho      ? "OK   o joelho fica no grau 5 nos dois casos" : "FALHA: o joelho mudou de grau");
console.log(okPiso        ? `OK   o fundo da validação bate com a variância do ruído (${PISO_TEORICO.toFixed(4)})`
                          : "FALHA: o fundo da validação não é o piso do ruído");
console.log(okAjustaRuido ? "OK   no grau 15 o treino desce abaixo do piso — ajustou ruído" : "FALHA: treino não passou do piso");
console.log(okCastigo     ? `OK   com 3× mais dados o castigo no grau 15 desaba (${valDe(padrao.texto)} -> ${valDe(maisDados.texto)})`
                          : "FALHA: o castigo não desabou");
console.log(okPara        ? "OK   as duas varreduras terminam" : "FALHA: alguma não terminou");
process.exit(okCompleta && okJoelho && okPiso && okAjustaRuido && okCastigo && okPara ? 0 : 1);
