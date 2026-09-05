// INSTRUMENTO: grau de produção pedido por cartão.
//
// Ele não é portão. É a régua que a D27 declarou no ROADMAP e que a D29 mandou
// reproduzir: "grau de produção por cartão, de 1 (escolher entre alternativas)
// a 5 (manipular e ler um resultado que muda), tomando a média dos atos do
// cartão".
//
// A escala, com o gesto que cada degrau cobra do leitor:
//
//   1  escolher entre alternativas que já estão escritas
//   2  produzir um termo curto de memória
//   3  completar uma conta cujos dados estão no enunciado
//   4  escrever um argumento próprio, que ninguém corrige por casamento
//   5  manipular um artefato que roda e ler dele um resultado que muda
//
// Um ato é uma `:::interacao`, um `:::exercicio` ou um `:::lab`. O grau do
// cartão é a média dos graus dos seus atos; cartão sem ato nenhum não entra na
// conta (não pede produção nem reconhecimento).
//
// O degrau 5 depende de o enunciado MANDAR operar o artefato, e por isso ele é
// reconhecido por marca no texto (o verbo no imperativo sobre o painel ou o
// notebook), nunca pelo tipo sozinho: `numerica` cujo dado está no enunciado é
// conta à mão, degrau 3.
//
// Uso:  node publicar/grau-de-producao.mjs [--faixa 27-38] [slug ...]
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CAPITULOS = join(RAIZ, "livro", "capitulos");

const RE_CARTAO = /^:::cartao(-fim)?[ \t]*(\{[^\n]*\})?[ \t]*$/;
const RE_BLOCO = /^:::(interacao|exercicio|lab)[ \t]*(\{[^\n]*\})[ \t]*$/;
const RE_FIM = /^:::[ \t]*$/;
const RE_OPCAO = /^[-*]?\s*[([](?:!|\?|x| )?[)\]]\s+/;

// DOIS SINAIS DE QUE A RESPOSTA SÓ EXISTE DEPOIS DE ALGO RODAR
//
// O primeiro é a ordem escrita: um imperativo maiúsculo que só faz sentido
// contra um artefato ("Clique", "Ajuste", "Marque", "Abra", "Rode", "Recorte").
// Maiúsculo de propósito, porque "saiu do ajuste" é substantivo e não ordem.
//
// O segundo é a ausência: um enunciado que NÃO traz numeral nenhum não pode ser
// respondido de cabeça, porque os números que a resposta precisa não estão nele.
// É o que separa "os resíduos são -1, +2, -2 e +3" (conta à mão, degrau 3) de
// "responda o coeficiente de `preco`, com duas casas" (só o painel sabe).
// Nome de coluna (crase) e expoente/índice ($R^2$, $S_{xx}$) saem antes da conta:
// são notação, não dado. O que sobrar em algarismo é dado do enunciado.
const RE_IMPERATIVO = /(^|[.!?:;]\s|\*\*|>\s)(Clique|Ajuste|Reajuste|Marque|Desmarque|Recorte|Ponha|Abra|Rode|Execute|Arraste|Mexa|Troque)\b/;

// O que o leitor lê ANTES de se comprometer. A ordem de operar o painel mora no
// enunciado; se ela só aparece na revelação, o gesto já passou.
const RE_RESPOSTA = /^>?\s*\*\*(revela|gabarito|rubrica|porque|volte para)/;
const enunciado = (corpo) => {
  const linhas = corpo.split("\n");
  const corte = linhas.findIndex((l) => RE_RESPOSTA.test(l.replace(/^>\s*/, "")));
  return (corte === -1 ? linhas : linhas.slice(0, corte)).join("\n");
};

export const GRAU = {
  ESCOLHER: 1,
  LEMBRAR: 2,
  CALCULAR: 3,
  ARGUMENTAR: 4,
  MANIPULAR: 5,
};

/** O grau de um ato, pelo gesto que ele cobra. */
export function grauDoAto({ bloco, tipo, corpo }) {
  if (bloco === "lab") return GRAU.MANIPULAR;

  const temOpcoes = corpo.split("\n").some((l) => RE_OPCAO.test(l) && !/^\s*[-*]?\s*\[\?\]/.test(l));
  const texto = enunciado(corpo);
  const semNumeral = !/[0-9]/.test(
    texto.replace(/`[^`]*`/g, "").replace(/\^\{?[0-9]+\}?/g, "").replace(/_\{?[A-Za-z0-9]+\}?/g, ""),
  );
  const mandaOperar = RE_IMPERATIVO.test(texto) || semNumeral;

  if (tipo === "principio" || tipo === "aberta") return GRAU.ARGUMENTAR;
  if (tipo === "multipla" || tipo === "multipla-multi") return GRAU.ESCOLHER;
  if (tipo === "completar") return GRAU.LEMBRAR;
  if (tipo === "numerica") return mandaOperar ? GRAU.MANIPULAR : GRAU.CALCULAR;
  if (tipo === "prever" || tipo === "desvanecido") {
    return temOpcoes ? GRAU.ESCOLHER : GRAU.CALCULAR;
  }
  return GRAU.ESCOLHER;
}

/** Lê um capítulo e devolve um cartão por posição, com os atos e o grau. */
export function medirCapitulo(texto) {
  const linhas = texto.split("\n");
  const cartoes = [];
  let atual = null;
  let bloco = null;
  let corpo = [];

  for (const linha of linhas) {
    const mc = linha.match(RE_CARTAO);
    if (mc && !bloco) {
      let meta = {};
      try { meta = mc[2] ? JSON.parse(mc[2]) : {}; } catch { meta = {}; }
      atual = { titulo: meta.titulo || "(sem título)", nivel: meta.nivel ?? null, atos: [] };
      cartoes.push(atual);
      continue;
    }
    const mb = linha.match(RE_BLOCO);
    if (mb && !bloco) {
      let meta = {};
      try { meta = JSON.parse(mb[2]); } catch { meta = {}; }
      bloco = { bloco: mb[1], tipo: meta.tipo || "", id: meta.id || "" };
      corpo = [];
      continue;
    }
    if (bloco && RE_FIM.test(linha)) {
      const ato = { ...bloco, corpo: corpo.join("\n") };
      ato.grau = grauDoAto(ato);
      if (atual) atual.atos.push(ato);
      bloco = null;
      continue;
    }
    if (bloco) corpo.push(linha);
  }

  for (const c of cartoes) {
    c.grau = c.atos.length ? c.atos.reduce((s, a) => s + a.grau, 0) / c.atos.length : null;
  }
  return cartoes;
}

/** Inclinação da reta de mínimos quadrados de grau contra posição. */
export function inclinacao(pares) {
  const n = pares.length;
  if (n < 2) return 0;
  const mx = pares.reduce((s, p) => s + p[0], 0) / n;
  const my = pares.reduce((s, p) => s + p[1], 0) / n;
  const sxy = pares.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0);
  const sxx = pares.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
  return sxx === 0 ? 0 : sxy / sxx;
}

function media(v) { return v.reduce((s, x) => s + x, 0) / v.length; }

export function relatorio(cartoes, faixa = null) {
  const com = cartoes.map((c, i) => ({ ...c, pos: i + 1 })).filter((c) => c.grau !== null);
  const pares = com.map((c) => [c.pos, c.grau]);
  const total = cartoes.length;
  const maximo = Math.max(...com.map((c) => c.grau));
  const ultimoMaximo = com.filter((c) => c.grau === maximo).at(-1);
  const meio = Math.ceil(total / 2);
  const primeira = com.filter((c) => c.pos <= meio).map((c) => c.grau);
  const segunda = com.filter((c) => c.pos > meio).map((c) => c.grau);
  const paresSegunda = com.filter((c) => c.pos > meio).map((c) => [c.pos, c.grau]);
  const naFaixa = faixa ? com.filter((c) => c.pos >= faixa[0] && c.pos <= faixa[1]) : [];
  return {
    faixa,
    inclinacaoFaixa: faixa ? inclinacao(naFaixa.map((c) => [c.pos, c.grau])) : null,
    mediaFaixa: faixa ? media(naFaixa.map((c) => c.grau)) : null,
    total,
    inclinacaoGlobal: inclinacao(pares),
    inclinacaoSegundaMetade: inclinacao(paresSegunda),
    mediaPrimeira: media(primeira),
    mediaSegunda: media(segunda),
    grauMaximo: maximo,
    ultimoMaximoPos: ultimoMaximo.pos,
    ultimoMaximoPct: (ultimoMaximo.pos / total) * 100,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const iFaixa = args.indexOf("--faixa");
  let faixa = null;
  if (iFaixa !== -1) {
    faixa = args[iFaixa + 1].split("-").map(Number);
    args.splice(iFaixa, 2);
  }
  const alvos = args.length
    ? args.map((s) => (s.endsWith(".md") ? s : `${s}.md`))
    : readdirSync(CAPITULOS).filter((f) => f.endsWith(".md"));
  for (const arquivo of alvos) {
    const caminho = join(CAPITULOS, basename(arquivo));
    const cartoes = medirCapitulo(readFileSync(caminho, "utf8"));
    if (!cartoes.length) continue;
    const r = relatorio(cartoes, faixa);
    console.log(`\n== ${basename(arquivo, ".md")} — ${r.total} cartões`);
    cartoes.forEach((c, i) => {
      const g = c.grau === null ? "  —  " : c.grau.toFixed(2);
      const atos = c.atos.map((a) => `${a.tipo || a.bloco}:${a.grau}`).join(" ");
      console.log(`  ${String(i + 1).padStart(2)} [n${c.nivel}] ${g}  ${c.titulo}  ·  ${atos}`);
    });
    console.log(`  inclinação global .............. ${r.inclinacaoGlobal.toFixed(4)} por cartão`);
    console.log(`  inclinação na segunda metade ... ${r.inclinacaoSegundaMetade.toFixed(4)} por cartão`);
    console.log(`  média 1ª metade / 2ª metade .... ${r.mediaPrimeira.toFixed(2)} / ${r.mediaSegunda.toFixed(2)}`);
    if (r.faixa) {
      console.log(`  inclinação nos cartões ${r.faixa[0]}–${r.faixa[1]} ..... ${r.inclinacaoFaixa.toFixed(4)} por cartão (média ${r.mediaFaixa.toFixed(2)})`);
    }
    console.log(`  último cartão no grau máximo ... ${r.ultimoMaximoPos}/${r.total} = ${r.ultimoMaximoPct.toFixed(1)}%`);
  }
}
