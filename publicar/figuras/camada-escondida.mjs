// Gera `publicar/tema/camada-escondida.svg` — a figura que sustenta a tese do III.2.
//
// POR QUE ELA EXISTE. O capítulo afirma que a camada escondida "reescreveu as
// entradas" e que "nelas o problema virou linearmente separável". É a coisa mais
// importante do capítulo e era uma frase no meio de um parágrafo. Somos visuais.
//
// TUDO É CALCULADO, INCLUSIVE A RETA. A primeira versão desta figura desenhou a
// fronteira à mão, em h₁+h₂=1 — e os dois pontos brancos do painel direito são
// exatamente (0,1) e (1,0), cuja soma é 1. A reta passava por cima dos pontos
// que deveria separar. O erro escapou porque era o único literal do arquivo: as
// coordenadas vinham das unidades, a reta vinha do dedo. Agora ela vem dos pesos
// da saída, e uma asserção recusa gerar se algum ponto ficar perto demais dela.
//
// EMPILHADA, NÃO LADO A LADO. Com dois painéis na horizontal, o viewBox precisa
// de ~980 de largura; numa coluna de 322px (celular) isso dá escala 0,33 e o
// rótulo de 12px vira 3,9px na tela — ilegível justamente no aparelho principal.
// Empilhado, a escala fica perto de 0,8.
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

// As unidades da tabela do capítulo, com os pesos que ele publica.
const UNI = { h1: { w: [1, 1], th: 1 }, h2: { w: [-1, -1], th: -1 }, y: { w: [1, 1], th: 2 } };
const disp = (u, e) => (u.w[0] * e[0] + u.w[1] * e[1] >= u.th ? 1 : 0);

const ENTRADAS = [[0, 0], [0, 1], [1, 0], [1, 1]];
const mapa = ENTRADAS.map(([a, b]) => {
  const p = disp(UNI.h1, [a, b]), q = disp(UNI.h2, [a, b]);
  return { a, b, p, q, y: disp(UNI.y, [p, q]), xor: a !== b ? 1 : 0 };
});
for (const m of mapa) {
  if (m.y !== m.xor) throw new Error(`a rede não reproduz o XOR em (${m.a},${m.b})`);
}

// Agrupa por destino, guardando DE ONDE cada ponto veio — é o que o painel de
// baixo rotula. Sem isso, os dois painéis usam "(1,1)" para coisas diferentes e
// quem lê de cima para baixo conclui o oposto do que a figura ensina.
const destinos = new Map();
for (const m of mapa) {
  const k = `${m.p},${m.q}`;
  if (!destinos.has(k)) destinos.set(k, { p: m.p, q: m.q, y: m.y, origens: [] });
  destinos.get(k).origens.push(`(${m.a},${m.b})`);
}
if (destinos.size !== 3) throw new Error("esperava 4 entradas colapsando em 3 posições");

// A fronteira da saída é w·h = θ. Com E (w=[1,1], θ=2) ela é h₁+h₂=2, que passa
// pelo próprio ponto verde. A reta DESENHADA é a mediana honesta entre as duas
// classes: o maior valor da classe de baixo é 1, o menor da de cima é 2.
const somaDe = (d) => UNI.y.w[0] * d.p + UNI.y.w[1] * d.q;
const grupos = [...destinos.values()];
const teto = Math.max(...grupos.filter((d) => d.y === 0).map(somaDe));
const piso = Math.min(...grupos.filter((d) => d.y === 1).map(somaDe));
if (!(teto < piso)) throw new Error("as classes não são separáveis na camada escondida");
const C = (teto + piso) / 2;                      // h₁ + h₂ = C
// Asserção que faltava na primeira versão: nenhum ponto encostado na reta.
const RAIO = 0.055;                               // em unidades do plano
for (const d of grupos) {
  const dist = Math.abs(somaDe(d) - C) / Math.hypot(UNI.y.w[0], UNI.y.w[1]);
  if (dist < RAIO) throw new Error(`a reta passa perto demais de (${d.p},${d.q})`);
}

const L = 210, PAD = 52, TOPO = 44, VAO = 118;
const px = (v) => PAD + 34 + v * L;
const py = (v, base) => base + (1 - v) * L;

function painel(base, titulo, eixoX, eixoY, pontos, reta, legenda) {
  let s = `  <text x="${PAD + 34 + L / 2}" y="${base - 18}" text-anchor="middle" class="tit">${titulo}</text>\n`;
  s += `  <line x1="${px(0) - 24}" y1="${py(0, base)}" x2="${px(1) + 30}" y2="${py(0, base)}" class="eixo"/>\n`;
  s += `  <line x1="${px(0)}" y1="${py(0, base) + 24}" x2="${px(0)}" y2="${py(1, base) - 30}" class="eixo"/>\n`;
  s += `  <text x="${px(1) + 40}" y="${py(0, base) + 5}" class="eixo-rot">${eixoX}</text>\n`;
  s += `  <text x="${px(0)}" y="${py(1, base) - 38}" text-anchor="middle" class="eixo-rot">${eixoY}</text>\n`;
  for (const v of [0, 1]) {
    s += `  <text x="${px(v)}" y="${py(0, base) + 22}" text-anchor="middle" class="tick">${v}</text>\n`;
    s += `  <text x="${px(0) - 14}" y="${py(v, base) + 5}" text-anchor="end" class="tick">${v}</text>\n`;
  }
  if (reta) {
    const [A, B] = reta;
    s += `  <line x1="${px(A[0])}" y1="${py(A[1], base)}" x2="${px(B[0])}" y2="${py(B[1], base)}" class="corte"/>\n`;
  }
  for (const p of pontos) {
    const cls = p.on ? "liga" : "desliga";
    if (p.dobro) s += `  <circle cx="${px(p.x) + 7}" cy="${py(p.y, base) - 7}" r="12" class="${cls} fantasma"/>\n`;
    s += `  <circle cx="${px(p.x)}" cy="${py(p.y, base)}" r="12" class="${cls}"/>\n`;
    s += `  <text x="${px(p.x) + (p.dir ? 24 : -24)}" y="${py(p.y, base) + 5}" text-anchor="${p.dir ? "start" : "end"}" class="rot">${p.rot}</text>\n`;
  }
  s += `  <text x="${PAD + 34 + L / 2}" y="${base + L + 46}" text-anchor="middle" class="leg">${legenda}</text>\n`;
  return s;
}

const cima = mapa.map((m) => ({ x: m.a, y: m.b, on: m.xor === 1,
                                rot: `(${m.a},${m.b})`, dir: m.a === 1 }));
const baixo = grupos.map((d) => ({
  x: d.p, y: d.q, on: d.y === 1, dobro: d.origens.length > 1, dir: d.p === 1,
  rot: d.origens.length > 1 ? `de ${d.origens.join(" e ")}` : `de ${d.origens[0]}`,
}));
// A reta h₁+h₂=C cruzando o quadrado, com folga para desenhar.
const retaC = [[C - 1.12, 1.12], [1.12, C - 1.12]];

const base1 = TOPO + 26, base2 = base1 + L + VAO;
const ALT = base2 + L + 76;
const LARG = PAD * 2 + 34 + L + 96;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARG} ${ALT}" role="img"
     aria-label="Duas vistas do mesmo problema XOR, uma acima da outra. Em cima, o espaço das entradas x1 e x2: os quatro casos ocupam os cantos de um quadrado, e os dois que devem disparar estão em cantos opostos, de modo que nenhuma reta os separa dos outros dois. Embaixo, o espaço da camada escondida h1 e h2, com cada ponto rotulado pela entrada de onde veio: as entradas (0,1) e (1,0) chegam ambas à mesma posição, de modo que quatro casos ocupam apenas três lugares. Nesse espaço uma única reta separa o que dispara do que não dispara.">
  <title>A camada escondida reescreve as coordenadas</title>
  <style>
    .tit  { font: 600 15px -apple-system, "Segoe UI", Roboto, sans-serif; fill: #1c1c1c; }
    .leg  { font: 13.5px -apple-system, "Segoe UI", Roboto, sans-serif; fill: #4a4a4a; }
    .rot  { font: 12.5px -apple-system, "Segoe UI", Roboto, sans-serif; fill: #4a4a4a; }
    .tick { font: 11.5px -apple-system, "Segoe UI", Roboto, sans-serif; fill: #6a6a6a; }
    .eixo-rot { font: italic 14px Georgia, serif; fill: #1c1c1c; }
    .seta { font: 600 13.5px -apple-system, "Segoe UI", Roboto, sans-serif; fill: #8a4d00; }
    .eixo { stroke: #8a8a86; stroke-width: 1.5; }
    .liga    { fill: #2a7a3f; stroke: #14532a; stroke-width: 1.5; }
    .desliga { fill: #fbfbfa; stroke: #4a4a4a; stroke-width: 2; }
    .fantasma { opacity: .5; }
    .corte   { stroke: #8a4d00; stroke-width: 3; stroke-linecap: round; }
    .fio     { stroke: #8a8a86; stroke-width: 2; fill: none; }
    .fundo   { fill: #fbfbfa; }
    @media (prefers-color-scheme: dark) {
      .fundo { fill: #17181a; }
      .tit, .eixo-rot { fill: #e6e6e4; } .leg, .rot { fill: #c8c8c5; } .tick { fill: #9a9a97; }
      .eixo, .fio { stroke: #6f7176; }
      .liga { fill: #6fd08a; stroke: #2a7a3f; }
      .desliga { fill: #17181a; stroke: #c8c8c5; }
      .corte, .seta { stroke: #e0a24a; fill: #e0a24a; }
    }
  </style>
  <rect width="100%" height="100%" class="fundo"/>
${painel(base1, "Antes: o que a rede recebe", "x₁", "x₂", cima, null,
         "Verde dispara, branco não. Nenhuma reta separa os dois grupos.")}
  <line x1="${px(0.5)}" y1="${base1 + L + 60}" x2="${px(0.5)}" y2="${base2 - 58}" class="fio"/>
  <polygon points="${px(0.5) - 6},${base2 - 58} ${px(0.5)},${base2 - 42} ${px(0.5) + 6},${base2 - 58}" class="corte" stroke="none"/>
  <text x="${px(0.5) + 16}" y="${base1 + L + 82}" class="seta">a camada escondida</text>
  <text x="${px(0.5) + 16}" y="${base1 + L + 100}" class="leg">h₁ = OU · h₂ = NÃO-E</text>
${painel(base2, "Depois: o que a camada de saída vê", "h₁", "h₂", baixo, retaC,
         "Uma reta basta — e duas entradas viraram um ponto só.")}
</svg>
`;

writeFileSync(resolve(AQUI, "..", "tema", "camada-escondida.svg"), svg);
console.log("✓ publicar/tema/camada-escondida.svg");
console.log(`  viewBox ${LARG}×${ALT} (empilhado; numa coluna de 322px a escala fica ${(322 / LARG).toFixed(2)})`);
console.log(`  reta calculada: h₁+h₂ = ${C} (entre ${teto} da classe de baixo e ${piso} da de cima)`);
for (const d of grupos) console.log(`  (${d.p},${d.q}) ← ${d.origens.join(" e ")}${d.origens.length > 1 ? "   ← o colapso" : ""}`);
