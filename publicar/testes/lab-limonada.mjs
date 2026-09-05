// Teste da ESPIRAL DA LIMONADA (II.2, cartões 21 a 26): o mesmo painel reaberto
// seis vezes, um controle novo de cada vez.
//
// POR QUE ESTE TESTE EXISTE
//
// A espiral conserta a D27 do `ROADMAP.md`: depois do cartão 15 a escada do
// capítulo virava piso, e o caso da limonada — o achado central, 365 dias e
// quatro atributos — era gasto em oito cartões seguidos de leitura com múltipla
// escolha no fim. Trocar leitura por painel só é ganho se o painel **acertar**:
// seis exercícios passaram a cobrar um número que o leitor lê da tela, e um
// painel errado transforma seis gabaritos em seis armadilhas.
//
// O que se confere, e por que cada um pode falhar em silêncio:
//
//   1. **o ajuste é o do capítulo** — a equação publicada (3,1920 · 0,3692 ·
//      −2,2460 · 0,0188 · 2,4143, R² 0,9821) tem de sair do painel, senão o
//      texto e o objeto contam histórias diferentes na mesma página;
//   2. **cada gabarito é produzido pelo painel**, dirigindo-o exatamente como o
//      enunciado manda, e comparado com a tolerância DECLARADA no Markdown — os
//      números não são copiados para cá, são lidos do capítulo, de modo que
//      mexer no gabarito sem mexer no dado reprova;
//   3. **a recusa por coluna constante acontece e NOMEIA a coluna** — é o passo
//      5 da dedução voltando com roupa de negócio, e é o que o cartão 26 cobra;
//   4. **a recusa por colinearidade perfeita acontece**, e não muda quando o
//      dado é reescalado. Fica declarado o limite deste item: no conjunto da
//      limonada um limiar de pivô absoluto (1e−10) recusaria igual, e trocar o
//      relativo pelo absoluto NÃO reprova aqui. A verificação guarda a decisão
//      de recusar, não a régua com que ela é tomada;
//   5. **`alta_temporada` é 1 exatamente nos 62 dias de julho e agosto**, e
//      `preco` = 0,30 + 0,20 × ela, dia a dia. É essa identidade que faz a
//      recusa do item 4 ser verdade sobre o dado, e não sorte numérica;
//   6. **a espiral sobe** — seis painéis, em ordem de cartão, cada um com
//      exatamente um controle a mais que o anterior. Se alguém acrescentar duas
//      decisões num cartão só, a volta deixa de ser volta;
//   7. **o painel só imprime R² a partir do cartão que o apresenta** (D28): o
//      que o navegador escreve é invisível ao portão de fonte, e foi assim que o
//      cartão 4 passou a mostrar R² 19 cartões antes de defini-lo.
//
// Uso: node publicar/testes/lab-limonada.mjs

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseNumerico } from "../interativos.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// ------------------------------------------------------------ DOM de mentira
// O painel não desenha em canvas nenhum (é a resposta dele à D18 e à D28), então
// o boneco aqui é menor que o do `lab-tigela.mjs`: só o que o DOM precisa ter
// para o construtor rodar.
function acha(raiz, cls) {
  const alvo = cls.replace(/^\./, ""), fora = [];
  (function anda(n) {
    (n.children || []).forEach((c) => {
      if ((" " + (c.className || "") + " ").indexOf(" " + alvo + " ") >= 0) fora.push(c);
      anda(c);
    });
  })(raiz);
  return fora;
}
function novoEl(tag) {
  return {
    tagName: tag, className: "", textContent: "", innerHTML: "", type: "", value: "",
    step: "", min: "", max: "", checked: false, style: {}, children: [], attributes: {},
    clientWidth: 281,
    appendChild(c) { this.children.push(c); return c; },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    addEventListener() {},
    querySelectorAll(s) { return acha(this, s); },
    querySelector(s) { return acha(this, s)[0] || null; },
    getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: 0 }; },
  };
}
global.document = {
  documentElement: novoEl("html"), createElement: novoEl,
  querySelectorAll: () => [], addEventListener: () => {}, readyState: "complete",
};
global.window = { matchMedia: () => ({ matches: false }), document: global.document,
                  devicePixelRatio: 1, addEventListener: () => {} };
global.MutationObserver = class { observe() {} };
global.ResizeObserver = class { observe() {} };
global.setInterval = () => 1;
global.clearInterval = () => {};
// O painel busca o CSV. Aqui ele nunca chega a ser usado — os dados entram pelo
// gancho `carregar` —, mas sem a promessa o construtor estoura antes disso.
global.fetch = () => Promise.reject(new Error("sem rede no teste"));

const src = readFileSync(resolve(RAIZ, "publicar/tema/laboratorios.js"), "utf8");
new Function("window", "document", "setInterval", "clearInterval", "fetch",
  src.replace("var TIPOS = {", "var TIPOS = globalThis.__TIPOS = {"))
  (global.window, global.document, global.setInterval, global.clearInterval, global.fetch);
const TIPOS = globalThis.__TIPOS;

const linhas = [];
const ok = (cond, msg) => linhas.push([!!cond, msg]);
const perto = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;

if (!TIPOS || !TIPOS["regressao-limonada"]) {
  console.log("FALHOU: o tipo regressao-limonada não está registrado em laboratorios.js");
  process.exit(1);
}

// -------------------------------------------------- o dado e o capítulo reais
const csv = readFileSync(resolve(RAIZ, "ml-zero/dados/limonada/limonada.csv"), "utf8");
const brutas = csv.trim().split(/\r?\n/);
const cab = brutas[0].split(",").map((c) => c.trim());
const DADOS = brutas.slice(1).map((l) => {
  const v = l.split(","), o = {};
  cab.forEach((c, i) => { o[c] = (v[i] || "").trim(); });
  return o;
});

const CAP = readFileSync(resolve(RAIZ, "livro/capitulos/ii-2-modelos-lineares.md"), "utf8");

/** Todos os painéis da espiral, na ordem em que o capítulo os declara. */
function paineisDoCapitulo() {
  const fora = [];
  for (const linha of CAP.split("\n")) {
    const m = linha.match(/^:::lab[ \t]+(\{.*\})[ \t]*$/);
    if (!m) continue;
    const cfg = JSON.parse(m[1]);
    if (cfg.tipo === "regressao-limonada") fora.push(cfg);
  }
  return fora;
}
/** O gabarito numérico de um exercício, lido do Markdown com o mesmo leitor do motor. */
function gabaritoDe(id) {
  const bloco = CAP.split("\n:::")
    .find((b) => b.indexOf(`"${id}"`) >= 0 && b.indexOf("**gabarito:**") >= 0);
  if (!bloco) return null;
  const m = bloco.split("\n").find((l) => /^\s*>\s*\*\*gabarito:\*\*/i.test(l));
  return m ? parseNumerico(m.replace(/^\s*>\s*\*\*gabarito:\*\*/i, "").trim()) : null;
}

/** Monta um painel com a configuração publicada e devolve o `__api` dele. */
function montar(cfg, dados) {
  const area = novoEl("div");
  TIPOS["regressao-limonada"](area, cfg);
  area.__api.carregar(dados || DADOS);
  return area.__api;
}

const PAINEIS = paineisDoCapitulo();
const porId = new Map(PAINEIS.map((c) => [c.id, c]));

// ---- (1) o ajuste é o do capítulo ------------------------------------------
{
  const api = montar({ id: "t", fixos: ["preco", "temperatura", "precipitacao", "panfletos"],
                       mostrar: ["r2"] });
  api.ajustar();
  const r = api.resultado();
  const esperado = [3.1920, 2.4143, 0.3692, -2.2460, 0.0188];
  ok(r && !r.falha && esperado.every((v, i) => perto(r.w[i], v, 5e-4)),
     "(1) o painel reproduz a equação publicada do capítulo, coeficiente por coeficiente");
  ok(r && perto(r.r2, 0.9821, 5e-4) && r.n === 365,
     "    e o R² de 0,9821 sobre os 365 dias");
}

// ---- (2) cada gabarito sai do painel ---------------------------------------
// Cada roteiro é o enunciado do exercício traduzido em chamadas. Se o enunciado
// mudar e o roteiro não, o número deixa de bater e o teste reprova — que é
// exatamente o que se quer de um exercício cujo gabarito mora no objeto.
const ROTEIROS = [
  { ex: "modelos-lineares-e22", lab: "modelos-lineares-l3",
     como: "cartão 21 · ajustar com `preco` sozinho",
     rodar: (a) => { a.ajustar(); return a.resultado().w[1]; } },
  { ex: "modelos-lineares-e23", lab: "modelos-lineares-l4",
     como: "cartão 22 · marcar `temperatura`",
     rodar: (a) => { a.ajustar(); a.ligar("temperatura", true); a.ajustar();
                     return a.resultado().w[1]; } },
  { ex: "modelos-lineares-e24", lab: "modelos-lineares-l5",
     como: "cartão 23 · marcar `precipitacao` e `panfletos`, ler o R²",
     rodar: (a) => { a.ajustar(); a.ligar("precipitacao", true); a.ligar("panfletos", true);
                     a.ajustar(); return a.resultado().r2; } },
  { ex: "modelos-lineares-e5", lab: "modelos-lineares-l6",
     como: "cartão 24 · marcar `alta_temporada`, desmarcar `preco`",
     rodar: (a) => { a.ligar("alta_temporada", true); a.ajustar();
                     a.ligar("preco", false); a.ajustar();
                     const r = a.resultado();
                     return r.w[a.colunas().indexOf("alta_temporada") + 1]; } },
  { ex: "modelos-lineares-e4", lab: "modelos-lineares-l7",
     como: "cartão 25 · corte de treino em 200, ler `panfletos`",
     rodar: (a) => { a.corte(200); a.ajustar();
                     return a.resultado().w[a.colunas().indexOf("panfletos") + 1]; } },
  { ex: "modelos-lineares-e27", lab: "modelos-lineares-l8",
     como: "cartão 26 · recortar julho, desmarcar `preco`, ler o R²",
     rodar: (a) => { a.mes("07"); a.ligar("preco", false); a.ajustar();
                     return a.resultado().r2; } },
];
for (const r of ROTEIROS) {
  const cfg = porId.get(r.lab);
  const gab = gabaritoDe(r.ex);
  if (!cfg) { ok(false, `(2) ${r.como}: o laboratório ${r.lab} sumiu do capítulo`); continue; }
  if (!gab) { ok(false, `(2) ${r.como}: o exercício ${r.ex} não tem gabarito numérico`); continue; }
  let valor = NaN;
  try { valor = r.rodar(montar(cfg)); } catch (e) { /* fica NaN, e o ok abaixo acusa */ }
  ok(perto(valor, gab.valor, gab.tolerancia),
     `(2) ${r.como} → ${Number.isFinite(valor) ? valor.toFixed(4) : "—"} ` +
     `contra o gabarito ${gab.valor} ± ${gab.tolerancia} de ${r.ex}`);
}

// ---- (3) a recusa por coluna constante, com a coluna nomeada ----------------
{
  const cfg = porId.get("modelos-lineares-l8");
  let nomeadas = 0, recusas = 0;
  for (let m = 1; m <= 12; m++) {
    const api = montar(cfg);
    api.mes(m < 10 ? "0" + m : String(m));
    api.ajustar();
    const r = api.resultado();
    if (r && r.falha) recusas++;
    if (r && r.falha && r.falha.coluna === "preco") nomeadas++;
  }
  ok(recusas === 12, `(3) o painel recusa a coluna preco nos doze meses (recusou em ${recusas})`);
  ok(nomeadas === 12, "    e nomeia a coluna constante, em vez de dizer só \"singular\"");
}

// ---- (4) a colinearidade perfeita, e o limiar RELATIVO ----------------------
{
  const api = montar(porId.get("modelos-lineares-l6"));
  api.ligar("alta_temporada", true);
  api.ajustar();
  const r = api.resultado();
  ok(r && r.falha && r.falha.erro === "singular",
     "(4) `preco` com `alta_temporada` é recusado: são a mesma coluna com dois nomes");

  ok(r && !r.w, "    e nenhum coeficiente é devolvido no lugar da recusa");

  // A recusa não pode depender da unidade em que alguém mediu as colunas. Isto
  // não distingue o limiar relativo do absoluto neste conjunto (ver o item 4 do
  // cabeçalho), mas guarda a propriedade que o leitor sente: trocar reais por
  // centavos não faz a mesma pergunta ter outra resposta.
  const escalas = [1e-3, 1e3, 1e6];
  const aceitou = [];
  for (const k of escalas) {
    const reescalado = DADOS.map((l) => ({
      data: l.data,
      preco: String(parseFloat(l.preco) * k),
      temperatura: String(parseFloat(l.temperatura) * k),
      precipitacao: String(parseFloat(l.precipitacao) * k),
      panfletos: String(parseFloat(l.panfletos) * k),
      vendas: String(parseFloat(l.vendas) * k),
    }));
    const outro = montar(porId.get("modelos-lineares-l6"), reescalado);
    outro.ligar("alta_temporada", true);
    outro.ajustar();
    if (!outro.resultado() || !outro.resultado().falha) aceitou.push(k);
  }
  ok(aceitou.length === 0,
     `    e a recusa não depende da unidade do dado (aceitou em: ${aceitou.join(", ") || "nenhuma escala"})`);
}

// ---- (5) alta_temporada é o preço com outro nome ----------------------------
{
  const api = montar(porId.get("modelos-lineares-l6"));
  const linhasReais = api.recorte();
  const altos = linhasReais.filter((l) => l.alta_temporada === 1);
  ok(altos.length === 62, `(5) alta_temporada vale 1 em 62 dias (valeu em ${altos.length})`);
  ok(altos.every((l) => String(l.data).slice(5, 7).match(/^0[78]$/)),
     "    e todos eles são de julho ou agosto");
  ok(linhasReais.every((l) => Math.abs(parseFloat(l.preco) - (0.30 + 0.20 * l.alta_temporada)) < 1e-9),
     "    e `preco` = 0,30 + 0,20 × alta_temporada, dia a dia, sem resto");
}

// ---- (6) a espiral sobe: um mecanismo novo por volta, NUNCA DOIS ------------
// É a regra que o notebook do Géron obedece nove vezes seguidas e que a D27
// aponta como a que falta aqui. "Mecanismo" é o tipo de decisão, não a
// quantidade de caixas: acrescentar duas colunas na mesma caixa que a volta
// anterior já ensinou é a mesma decisão outra vez, e não custa nada ao leitor.
// Acrescentar caixa E corte no mesmo cartão custa duas.
{
  const mecanismos = (c) => {
    const m = new Set();
    if ((c.escolher || []).length) m.add("caixa de atributo");
    if ((c.escolher || []).includes("alta_temporada")) m.add("coluna derivada");
    if (c.corte) m.add("corte de treino");
    if (c.recorte) m.add("recorte de meses");
    return m;
  };
  ok(PAINEIS.length === 6, `(6) a espiral tem seis voltas (tem ${PAINEIS.length})`);
  ok(mecanismos(PAINEIS[0]).size === 0,
     "    a primeira volta não tem mecanismo nenhum além do botão: é ajustar e ler");
  const vistos = new Set();
  const novidades = [];
  let excesso = null;
  PAINEIS.forEach((c, i) => {
    const novos = [...mecanismos(c)].filter((m) => !vistos.has(m));
    novos.forEach((m) => vistos.add(m));
    novidades.push(`volta ${i + 1}: ${novos.length ? novos.join(" + ") : "nada novo"}`);
    if (novos.length > 1 && excesso == null) excesso = i + 1;
  });
  ok(excesso == null,
     `    e nenhuma volta estreia dois mecanismos de uma vez (${novidades.join(" · ")})`);
  ok(vistos.size === 4,
     `    as quatro decisões do capítulo estreiam, cada uma na sua volta (${vistos.size} de 4)`);
}

// ---- (7) o R² só é impresso a partir do cartão que o apresenta (D28) --------
{
  // Em que cartão cada painel mora, e em que cartão o capítulo declara o R².
  const linhasCap = CAP.split("\n");
  let cartao = 0;
  const cartaoDoLab = new Map();
  let cartaoDoR2 = null;
  for (const l of linhasCap) {
    const marca = l.match(/^:::cartao[ \t]+(\{.*\})[ \t]*$/);
    if (marca) {
      cartao++;
      const attrs = JSON.parse(marca[1]);
      if ((attrs.apresenta || []).includes("R²")) cartaoDoR2 = cartao;
      continue;
    }
    const lab = l.match(/^:::lab[ \t]+(\{.*\})[ \t]*$/);
    if (lab) {
      const cfg = JSON.parse(lab[1]);
      if (cfg.tipo === "regressao-limonada") cartaoDoLab.set(cfg.id, cartao);
    }
  }
  ok(cartaoDoR2 != null, `(7) o capítulo declara em que cartão o R² é apresentado (${cartaoDoR2})`);
  const cedo = PAINEIS.filter((c) => (c.mostrar || []).includes("r2") &&
                                     cartaoDoLab.get(c.id) < cartaoDoR2);
  ok(cedo.length === 0,
     "    e nenhum painel imprime R² antes dele: " +
     (cedo.length ? cedo.map((c) => `${c.id} no cartão ${cartaoDoLab.get(c.id)}`).join(", ")
                  : "o que o navegador desenha não inverte o pré-requisito"));
  // O outro lado: o painel que declara `mostrar: r2` tem mesmo de imprimi-lo,
  // senão a checagem acima passaria sobre uma declaração morta.
  const comR2 = PAINEIS.filter((c) => (c.mostrar || []).includes("r2"));
  ok(comR2.length === 4, `    e ${comR2.length} painéis declaram a linha do R² (esperado 4)`);
  const vocab = montar(porId.get("modelos-lineares-l5")).vocabulario();
  ok(vocab.includes("R²"),
     "    o __api.vocabulario() entrega o R² ao coletor da camada desenhada");
  const vocab1 = montar(porId.get("modelos-lineares-l3")).vocabulario();
  ok(!vocab1.includes("R²"),
     "    e o painel do cartão 21, que não o mostra, não o declara");
}

// ------------------------------------------------------------------ relatório
let falhas = 0;
for (const [passou, msg] of linhas) {
  console.log(`${passou ? "OK  " : "FALHOU"} ${msg}`);
  if (!passou) falhas++;
}
console.log(`\n${linhas.length - falhas} de ${linhas.length} verificação(ões) verde(s).`);
process.exit(falhas ? 1 : 0);
