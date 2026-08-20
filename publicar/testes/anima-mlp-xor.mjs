// Teste da animação do XOR (ADR 0015), rodando o laboratorios.js REAL num DOM
// mínimo. Ele existe porque a primeira versão desta animação NÃO fechava: a
// semente escolhida a esmo caía num mínimo local, e o texto do capítulo
// prometia ao leitor "assista até a contagem fechar".
//
// Build verde não pega isso — o bloco compila, a página monta, o canvas
// desenha. O que falha é o comportamento, e comportamento só se testa rodando.
//
// Uso: node publicar/testes/anima-mlp-xor.mjs

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
  if (tag === "canvas") {
    e.getContext = () => new Proxy({}, { get: () => () => {} });
  }
  return e;
}

const raiz = novoEl("html");
global.document = {
  documentElement: raiz,
  createElement: novoEl,
  querySelectorAll: () => [],
  addEventListener: () => {},
  readyState: "complete",
};
// Sem IntersectionObserver e sem MutationObserver: o núcleo cai no caminho
// direto, que é o que queremos para medir. prefers-reduced-motion desligado.
global.window = {
  matchMedia: () => ({ matches: false }),
  document: global.document,
};
let tick = null;
global.setInterval = (fn) => { tick = fn; return 1; };
global.clearInterval = () => { tick = null; };

const src = readFileSync(resolve(RAIZ, "publicar/tema/laboratorios.js"), "utf8");
// O arquivo é uma IIFE que só registra tipos e chama iniciar(). Expomos TIPOS.
new Function("window", "document", "setInterval", "clearInterval",
  src.replace("var TIPOS = {", "var TIPOS = globalThis.__TIPOS = {"))
  (global.window, global.document, global.setInterval, global.clearInterval);

const TIPOS = globalThis.__TIPOS;
if (!TIPOS || !TIPOS["anima-mlp-xor"]) {
  console.log("FALHOU: tipo anima-mlp-xor não registrado");
  process.exit(1);
}

// A CONFIGURAÇÃO VEM DO CAPÍTULO, NÃO DO DEFAULT.
//
// Este teste rodava com `{}`, o que caía no `semente: 6` embutido no código. O
// capítulo publicava `semente: 11`. Com a 6 a rede fecha em 48 de 48 na época
// 142, que é o que o texto promete; com a 11 ela para em 25 de 48 dizendo
// "empacou, e não vai sair daqui". O teste ficou verde por meses validando uma
// animação que o leitor nunca viu.
//
// É a mesma lição que o ADR 0015 já pagou uma vez: a verificação reproduzia o
// caminho do robô, não o do leitor. Aqui ela reproduzia o default, não o
// publicado. Agora a config sai do Markdown.
function configDoCapitulo() {
  const md = readFileSync(resolve(RAIZ, "livro/capitulos/iii-2-redes-neurais.md"), "utf8");
  const m = md.match(/^:::lab (\{[^\n]*"tipo":"anima-mlp-xor"[^\n]*\})/m);
  if (!m) { console.log("FALHOU: o capítulo não declara mais o laboratório anima-mlp-xor"); process.exit(1); }
  return JSON.parse(m[1]);
}
const CFG = configDoCapitulo();

function roda(botaoIdx) {
  const area = novoEl("div");
  TIPOS["anima-mlp-xor"](area, CFG);
  const placar = area.children.find((c) => c.className === "lab-placar");
  if (botaoIdx != null) {
    const box = area.children.find((c) => c.className === "lab-botoes");
    listeners.get(box.children[botaoIdx])();
  }
  let n = 0;
  while (tick && n < 5000) { tick(); n++; }
  return { texto: placar.textContent, quadros: n };
}

const com  = roda(null);
const sem  = roda(1);
const ruim = roda(2);
console.log("config do capítulo:", JSON.stringify(CFG));
console.log("padrão      :", com.texto,  `(${com.quadros} quadros)`);
console.log("sem camada  :", sem.texto,  `(${sem.quadros} quadros)`);
console.log("init ruim   :", ruim.texto, `(${ruim.quadros} quadros)`);

const okCom  = /48 de 48 certos/.test(com.texto) && /resolveu/.test(com.texto);
const okSem  = /empacou/.test(sem.texto)  && !/48 de 48/.test(sem.texto);
const okRuim = /empacou/.test(ruim.texto) && !/48 de 48/.test(ruim.texto);
console.log(okCom  ? "OK   padrão fecha em 48/48, como o texto promete" : "FALHA: padrão não fechou");
console.log(okSem  ? "OK   sem camada empaca, como o texto promete"      : "FALHA: sem camada resolveu");
console.log(okRuim ? "OK   inicialização infeliz empaca, como o texto promete" : "FALHA: init ruim resolveu");
process.exit(okCom && okSem && okRuim ? 0 : 1);
