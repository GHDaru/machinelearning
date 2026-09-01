// A INTERAÇÃO FORMATIVA: o que o parser aceita, o que ele recusa, e o que o
// JavaScript real faz com o HTML real.
//
// POR QUE ESTE TESTE EXISTE
//
// A interação é a única superfície do livro que REVELA no cliente. Ela pode
// fazer isso porque não vale nota, não grava tentativa e não fala com o
// backend — e as três coisas são invariantes, não intenções. Uma linha de
// `fetch` aqui não quebraria nada visível: a interação continuaria montando, e
// só falharia no leitor com a rede fora do ar, que é justamente quem o
// Princípio VIII.6 protege. Por isso o teste roda o `tema/interacoes.js` REAL
// num ambiente onde `fetch`, `XMLHttpRequest` e `localStorage` EXPLODEM ao
// serem tocados. Se algum dia alguém acrescentar telemetria, o teste cai aqui,
// e não no celular de um leitor no metrô.
//
// O outro invariante é o do gate dos cartões: ele conta `.interacao` e
// `[data-interacao]` no DOM. Se o render parar de emitir a classe, o cartão
// volta a ser "leitura disfarçada de microlearning" sem que nada grite.
//
// Uso: node publicar/testes/interacoes.mjs

import { extrair, renderizar, semGabarito, ErroDeBloco } from "../interativos.mjs";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

let falhas = 0;
function ok(nome, cond) {
  if (cond) console.log(`  ok   ${nome}`);
  else { console.log(`  FALHA ${nome}`); falhas++; }
}
function recusa(nome, md) {
  try {
    extrair(md, "teste.md");
    console.log(`  FALHA ${nome} (aceitou)`);
    falhas++;
  } catch (e) {
    ok(nome, e instanceof ErroDeBloco);
  }
}

// Renderizador de Markdown de brinquedo: o teste é do parser e do JS, não do
// markdown-it. Um `<p>` em volta basta para provar que o bloco não se parte.
const renderMd = (t) => `<p>${String(t).trim()}</p>`;

// ---------------------------------------------------------------- o parser

const PRINCIPIO = `:::interacao {"id":"t-i1","tipo":"principio","titulo":"De onde sai o x"}
As duas condições, já derivadas.

> **pergunta:** Por que o x aparece numa e não na outra?
> **revela:** Pela regra da cadeia.
:::`;

const DESVANECIDO = `:::interacao {"id":"t-i2","tipo":"desvanecido"}
Complete as duas parcelas:

- [?] temperatura: 0,3692 x 21,8 => 8,05
- [?] preço: 2,4143 x 0,20 => 0,48

> **revela:** A temperatura responde por 8,05 dos 9,4 copos.
:::`;

const PREVER_NUM = `:::interacao {"id":"t-i3","tipo":"prever","numero":100,"tolerancia":0}
Um ponto erra por 1; o outlier erra por 10.

> **pergunta:** Quantas vezes o outlier pesa mais?
> **revela:** Cem vezes.
:::`;

const PREVER_OPC = `:::interacao {"id":"t-i4","tipo":"prever"}
O gradiente contra a álgebra.

- ( ) chega ao ótimo em 4 000 passos
- (!) fica 2,8% acima do ótimo

> **pergunta:** O que acontece?
> **revela:** Não chega.
:::`;

const TODAS = [PRINCIPIO, DESVANECIDO, PREVER_NUM, PREVER_OPC].join("\n\n");
const lote = extrair(TODAS, "teste.md", 7);

ok("acha as quatro interações", lote.interacoes.length === 4);
ok("lê id, tipo e título", lote.interacoes[0].id === "t-i1" &&
   lote.interacoes[0].tipo === "principio" && lote.interacoes[0].titulo === "De onde sai o x");
ok("lê pergunta e revela do rodapé",
   lote.interacoes[0].pergunta === "Por que o x aparece numa e não na outra?" &&
   lote.interacoes[0].revela === "Pela regra da cadeia.");
ok("lê os passos apagados (rótulo => certo)",
   lote.interacoes[1].passos.length === 2 &&
   lote.interacoes[1].passos[0].certo === "8,05" &&
   lote.interacoes[1].passos[0].rotulo === "temperatura: 0,3692 x 21,8");
ok("lê o número da previsão", lote.interacoes[2].numero === "100");
ok("lê as opções e qual delas é o que acontece",
   lote.interacoes[3].previsoes.length === 2 &&
   lote.interacoes[3].previsoes[1].real === true &&
   lote.interacoes[3].previsoes[0].real === false);

// A restrição número 1 do trabalho: o exercício não pode sentir nada.
const MISTO = `${PRINCIPIO}

:::exercicio {"id":"t-e1","tipo":"multipla","objetivo":"O1"}
Vale nota?

- [ ] não
- [x] sim

> **porque:** porque sim.
:::`;
const misto = extrair(MISTO, "teste.md");
ok("interação no mesmo arquivo não mexe no exercício",
   misto.exercicios.length === 1 && misto.exercicios[0].id === "t-e1" &&
   misto.exercicios[0].opcoes.filter((o) => o.correta).length === 1);
ok("e o exercício continua entregando o gabarito ao banco",
   misto.exercicios[0].porque === "porque sim.");

// Documentar a sintaxe não pode criar interação — a mesma regra dos :::exercicio.
const EM_CERCA = "```markdown\n" + PRINCIPIO + "\n```\n";
ok("interação dentro de código cercado é exemplo, não widget",
   extrair(EM_CERCA, "teste.md").interacoes.length === 0);
ok("e sai do render como veio", renderizar(EM_CERCA, renderMd, "teste.md") === EM_CERCA);

recusa("sem id", ':::interacao {"tipo":"principio"}\ncorpo\n\n> **pergunta:** q\n> **revela:** r\n:::');
recusa("tipo desconhecido", ':::interacao {"id":"x","tipo":"quiz"}\ncorpo\n\n> **revela:** r\n:::');
recusa("sem revela", ':::interacao {"id":"x","tipo":"principio"}\ncorpo\n\n> **pergunta:** q\n:::');
recusa("enunciado vazio", ':::interacao {"id":"x","tipo":"principio"}\n\n> **pergunta:** q\n> **revela:** r\n:::');
recusa("princípio sem pergunta", ':::interacao {"id":"x","tipo":"principio"}\ncorpo\n\n> **revela:** r\n:::');
recusa("desvanecido sem passo apagado", ':::interacao {"id":"x","tipo":"desvanecido"}\ncorpo\n\n> **revela:** r\n:::');
recusa("prever sem opção nem número", ':::interacao {"id":"x","tipo":"prever"}\ncorpo\n\n> **pergunta:** q\n> **revela:** r\n:::');
recusa("prever com duas opções reais",
  ':::interacao {"id":"x","tipo":"prever"}\ncorpo\n\n- (!) a\n- (!) b\n\n> **pergunta:** q\n> **revela:** r\n:::');
recusa("prever com uma opção só",
  ':::interacao {"id":"x","tipo":"prever"}\ncorpo\n\n- (!) a\n\n> **pergunta:** q\n> **revela:** r\n:::');
recusa("prever com opções E número",
  ':::interacao {"id":"x","tipo":"prever","numero":1}\ncorpo\n\n- ( ) a\n- (!) b\n\n> **pergunta:** q\n> **revela:** r\n:::');

// ---------------------------------------------------------------- o render

const html = renderizar(TODAS, renderMd, "teste.md", 7);

ok("emite a classe e o atributo que o gate dos cartões procura",
   /<section class="interacao" data-interacao="t-i1" data-tipo="principio">/.test(html));
ok("o gate acharia as quatro", (html.match(/class="interacao"/g) || []).length === 4);
ok("nenhuma linha em branco dentro do bloco (senão o markdown-it o parte em dois)",
   [PRINCIPIO, DESVANECIDO, PREVER_NUM, PREVER_OPC]
     .map((b) => renderizar(b, renderMd, "teste.md"))
     .every((h) => !/\n[ \t]*\n/.test(h)));
ok("o texto revelado vai num <template>, fora do innerText que o gate conta",
   /<template class="ia-fonte"><p>Pela regra da cadeia\.<\/p><\/template>/.test(html));
ok("o passo apagado vira campo com o certo no data-certo",
   /class="ia-branco"[^>]*data-certo="8,05"/.test(html));
ok("a previsão numérica leva o real e a tolerância no DOM",
   /class="ia-num"[^>]*data-real="100"[^>]*data-tol="0"/.test(html));
ok("a opção que acontece é marcada com data-real", /class="ia-opcao"[^>]*data-real="1"/.test(html));
// Nem `disabled` nem `aria-disabled`: as duas coisas tirariam do leitor de
// tela o único lugar onde o motivo de o botão não liberar está escrito.
ok("o botão nasce clicável, com data-pronto e aria-describedby",
   /class="ia-revelar" type="button" data-pronto="false" aria-describedby="ia-status-t-i1"/.test(html) &&
   !/class="ia-revelar"[^>]*(?:\sdisabled|aria-disabled)/.test(html));
ok("e o status que ele descreve tem id", /class="ia-status" id="ia-status-t-i1" role="status"/.test(html));
ok("a revelação é uma região viva que já existe vazia no DOM",
   /<div class="ia-revelacao" aria-live="polite"><\/div>/.test(html));
ok("nada de data-cap: não há a quem reportar", !/interacao"[^>]*data-cap/.test(html));

// A exportação em Markdown: a interação não tem o que esconder, e não pode
// inventar um `- [x]`, que é o que o gate de vazamento do build recusa.
const exportado = semGabarito(TODAS);
ok("semGabarito devolve a interação intacta", exportado === TODAS);
ok("e nenhuma linha de interação parece gabarito de exercício",
   !exportado.split("\n").some((l) => /^[-*]\s+\[x\]/i.test(l)));

// -------------------------------------------------- o JavaScript, no DOM real
//
// Um DOM mínimo: o suficiente para o `interacoes.js` de verdade rodar sobre o
// HTML de verdade que o parser acabou de gerar.

const VAZIAS = new Set(["input", "br", "hr", "img", "meta", "link"]);
const entidades = (t) => String(t).replace(/&amp;/g, "&").replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function criar(tag) {
  const e = {
    nodeType: 1, tagName: String(tag).toUpperCase(), children: [], parentNode: null,
    attributes: {}, __texto: "", __html: "", __ouvintes: {},
    value: "", checked: false, readOnly: false, disabled: false, hidden: false, style: {},
    get className() { return this.attributes.class || ""; },
    set className(v) { this.attributes.class = v; },
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === "class") return; },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    hasAttribute(k) { return k in this.attributes; },
    appendChild(c) { c.parentNode = this; this.children.push(c); return c; },
    get textContent() {
      return this.__texto + this.children.map((c) => c.textContent).join("");
    },
    set textContent(v) { this.children = []; this.__texto = String(v); },
    get innerHTML() { return this.__html; },
    set innerHTML(v) { this.__html = String(v); },
    addEventListener(t, fn) { (this.__ouvintes[t] = this.__ouvintes[t] || []).push(fn); },
    disparar(t) { (this.__ouvintes[t] || []).forEach((fn) => fn.call(this, { type: t })); },
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) {
      const partes = sel.split(",").map((s) => s.trim());
      const casa = (n) => partes.some((p) => p[0] === "."
        ? (" " + n.className + " ").indexOf(" " + p.slice(1) + " ") >= 0
        : n.tagName === p.toUpperCase());
      const achados = [];
      (function anda(no) {
        no.children.forEach((f) => { if (casa(f)) achados.push(f); anda(f); });
      })(this);
      return achados;
    },
  };
  return e;
}

/** Analisador de HTML de brinquedo — só o bastante para o markup que geramos. */
function montar(fonte) {
  const raiz = criar("div");
  const pilha = [raiz];
  const re = /<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*")*?)(\/?)>/g;
  let pos = 0, m;
  while ((m = re.exec(fonte)) !== null) {
    const texto = fonte.slice(pos, m.index);
    if (texto.trim()) pilha[pilha.length - 1].__texto += entidades(texto);
    pos = m.index + m[0].length;
    const [, fecha, tag, attrs] = m;
    if (fecha) { if (pilha.length > 1) pilha.pop(); continue; }
    const no = criar(tag);
    for (const a of attrs.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) {
      if (a[1]) no.attributes[a[1]] = a[2] == null ? "" : entidades(a[2]);
    }
    pilha[pilha.length - 1].appendChild(no);
    // `<template>` é inerte no DOM real: o conteúdo não é filho, é innerHTML.
    if (tag.toLowerCase() === "template") {
      const fim = fonte.indexOf("</template>", pos);
      no.__html = fonte.slice(pos, fim);
      pos = fim + "</template>".length;
      re.lastIndex = pos;
      continue;
    }
    if (!VAZIAS.has(tag.toLowerCase())) pilha.push(no);
  }
  return raiz;
}

const doc = montar(html);
global.document = {
  readyState: "complete",
  createElement: criar,
  addEventListener() {},
  querySelectorAll: (sel) => doc.querySelectorAll(sel),
  querySelector: (sel) => doc.querySelector(sel),
};
global.window = { document: global.document };

// A prova do Princípio VIII.6: aqui não há rede, e tocar nela é erro fatal.
const proibido = (nome) => () => { throw new Error("a interação tocou em " + nome); };
global.fetch = proibido("fetch");
global.XMLHttpRequest = proibido("XMLHttpRequest");
Object.defineProperty(global, "localStorage", { get: proibido("localStorage") });

const src = readFileSync(resolve(RAIZ, "publicar/tema/interacoes.js"), "utf8");
new Function("window", "document", src)(global.window, global.document);

ok("o script monta as quatro interações sem tocar em rede nem em armazenamento",
   doc.querySelectorAll(".interacao").length === 4);

const secDe = (id) => doc.querySelectorAll(".interacao").find((s) => s.getAttribute("data-interacao") === id);
const botaoDe = (s) => s.querySelector(".ia-revelar");
const statusDe = (s) => s.querySelector(".ia-status");
const revelacaoDe = (s) => s.querySelector(".ia-revelacao");
const revelado = (s) => s.getAttribute("data-revelado") === "true";

// ---- princípio: sem a explicação do leitor, não libera --------------------
const p1 = secDe("t-i1");
ok("princípio nasce sem estar pronto", botaoDe(p1).getAttribute("data-pronto") === "false");
botaoDe(p1).disparar("click");
ok("clique com o campo vazio não revela", !revelado(p1) && revelacaoDe(p1).children.length === 0);
ok("e diz o motivo no role=status", /Escreva a sua explicação/.test(statusDe(p1).textContent));
p1.querySelector(".ia-livre").value = "porque o resíduo depende de a através de x";
p1.querySelector(".ia-livre").disparar("input");
ok("escreveu, o botão libera", botaoDe(p1).getAttribute("data-pronto") === "true");
botaoDe(p1).disparar("click");
ok("agora revela", revelado(p1));
ok("a resposta do leitor fica na tela, ao lado da explicação",
   /porque o resíduo depende de a através de x/.test(revelacaoDe(p1).textContent));
ok("e a explicação vem do <template>",
   /Pela regra da cadeia/.test(revelacaoDe(p1).querySelector(".ia-rev-texto").innerHTML));
ok("a resposta do leitor não é julgada (nem certo, nem errado)",
   !/(certo|errado|correto|incorreto)/i.test(revelacaoDe(p1).textContent));
ok("o campo congela depois de revelado", p1.querySelector(".ia-livre").readOnly === true);
ok("o botão continua clicável e anunciado como clicável depois de revelar",
   botaoDe(p1).disabled === false && botaoDe(p1).getAttribute("aria-disabled") === null);
botaoDe(p1).disparar("click");
ok("clicar de novo não duplica a revelação", revelacaoDe(p1).children.length === 1);

// ---- desvanecido: todas as linhas, e a comparação lado a lado -------------
const d = secDe("t-i2");
const brancos = d.querySelectorAll(".ia-branco");
ok("dois passos apagados", brancos.length === 2);
brancos[0].value = "8,05";
brancos[0].disparar("input");
botaoDe(d).disparar("click");
ok("com um branco em aberto ainda não confere", !revelado(d) && /Falta um passo/.test(statusDe(d).textContent));
brancos[1].value = "0,5";
brancos[1].disparar("input");
botaoDe(d).disparar("click");
ok("preenchidos os dois, confere", revelado(d));
const cmp = d.querySelectorAll(".ia-passo-cmp").map((c) => c.textContent);
ok("cada passo mostra a linha certa", cmp[0].indexOf("8,05") >= 0 && cmp[1].indexOf("0,48") >= 0);
ok("e a linha do leitor ao lado", cmp[1].indexOf("você escreveu 0,5") >= 0);
ok("sem veredito: a comparação não diz 'errado'",
   !/errad|incorret/i.test(cmp.join(" ") + revelacaoDe(d).textContent));

// ---- prever numérico: bateu ou não bateu ---------------------------------
const n = secDe("t-i3");
botaoDe(n).disparar("click");
ok("previsão numérica nasce bloqueada", !revelado(n) && /Arrisque um número/.test(statusDe(n).textContent));
n.querySelector(".ia-num").value = "dez";
n.querySelector(".ia-num").disparar("input");
botaoDe(n).disparar("click");
ok("palavra não é previsão", !revelado(n) && /não é um número/.test(statusDe(n).textContent));
n.querySelector(".ia-num").value = "10";
n.querySelector(".ia-num").disparar("input");
botaoDe(n).disparar("click");
ok("previu 10, revela", revelado(n));
ok("a revelação REPETE a previsão dele antes do resultado",
   revelacaoDe(n).textContent.indexOf("10") >= 0 && /não bateu/.test(revelacaoDe(n).textContent));
ok("e o resultado real vem depois", /Cem vezes/.test(revelacaoDe(n).querySelector(".ia-rev-texto").innerHTML));
ok("o data-bateu registra o não", n.getAttribute("data-bateu") === "nao");

// A vírgula decimal do português tem de valer — a lição do parseNumerico.
const n2 = montar(renderizar(
  ':::interacao {"id":"t-i5","tipo":"prever","numero":1.4,"tolerancia":0.02}\ncorpo\n\n> **pergunta:** q\n> **revela:** r\n:::',
  renderMd, "teste.md"));
doc.appendChild(n2.children[0]);
new Function("window", "document", src)(global.window, global.document);
const v = secDe("t-i5");
v.querySelector(".ia-num").value = "1,41";
v.querySelector(".ia-num").disparar("input");
botaoDe(v).disparar("click");
ok("1,41 com vírgula cai dentro de 1,4 ± 0,02 e BATE", v.getAttribute("data-bateu") === "sim");

// ---- prever por opção -----------------------------------------------------
const o = secDe("t-i4");
botaoDe(o).disparar("click");
ok("previsão por opção nasce bloqueada", !revelado(o) && /Escolha uma previsão/.test(statusDe(o).textContent));
const opcoes = o.querySelectorAll(".ia-opcao");
opcoes[1].checked = true;
opcoes[1].disparar("change");
botaoDe(o).disparar("click");
ok("escolheu a que acontece: bateu", revelado(o) && o.getAttribute("data-bateu") === "sim");
ok("a opção escolhida aparece por extenso na revelação",
   /fica 2,8% acima do ótimo/.test(revelacaoDe(o).textContent));
ok("as opções congelam depois da revelação", opcoes[0].disabled === true);

// ---- o capítulo de verdade ------------------------------------------------
const cap = readFileSync(resolve(RAIZ, "livro/capitulos/ii-2-modelos-lineares.md"), "utf8");
const doCap = extrair(cap, "livro/capitulos/ii-2-modelos-lineares.md", 10).interacoes;
ok("o II.2 traz um exemplar de cada tipo, com conteúdo do próprio capítulo",
   doCap.length === 3 && new Set(doCap.map((i) => i.tipo)).size === 3);

if (falhas) { console.error(`✗ ${falhas} FALHOU`); process.exit(1); }
console.log("✓ interação: formativa, revela no cliente, não julga e não toca em rede.");
