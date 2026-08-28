// Gera `publicar/tema/block-group.svg` — o que é UMA LINHA do California Housing.
//
// POR QUE ELA EXISTE. O capítulo dizia "20 640 setores censitários", e um leitor
// perguntou o que era um setor. A resposta certa não é "setor censitário": é
// BLOCK GROUP, que é outra coisa e fica um degrau ABAIXO do census tract. Quem
// traduz por "setor censitário" e vai procurar acaba em census tract, que tem
// três vezes o tamanho — e aí a intuição sobre a linha do arquivo fica errada.
//
// Hierarquia é assunto de figura, não de parágrafo: são cinco níveis encaixados,
// e texto corrido faz o leitor montar o encaixe de cabeça.
//
// OS NÚMEROS SÃO DE DUAS PROCEDÊNCIAS, E A FIGURA DIZ QUAL É QUAL.
//   - os do CENSO vêm do Geographic Areas Reference Manual (GARM), caps. 10 e 11,
//     e estão citados na ficha do dado com URL;
//   - os do ARQUIVO são medidos aqui, na geração, a partir do CSV congelado. Se o
//     arquivo mudar, a figura muda junto — número em figura não pode ser literal
//     digitado à mão, que foi o defeito da primeira versão da outra figura.
//
// EMPILHADA, 444 de largura: numa coluna de 322px (celular) a escala fica 0,73.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CSV = resolve(AQUI, "..", "..", "ml-zero", "dados", "california", "housing_bruto.csv");

// ---- os números do ARQUIVO, medidos agora -------------------------------
const linhas = readFileSync(CSV, "utf8").trim().split("\n");
const cab = linhas[0].split(",");
const iDom = cab.indexOf("households"), iPop = cab.indexOf("population");
if (iDom < 0 || iPop < 0) throw new Error("o CSV não tem households/population");
const dom = [], pop = [];
for (let i = 1; i < linhas.length; i++) {
  const c = linhas[i].split(",");
  dom.push(+c[iDom]); pop.push(+c[iPop]);
}
const mediana = (v) => { const s = [...v].sort((a, b) => a - b); const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const MED = { linhas: dom.length, dom: mediana(dom), pop: mediana(pop) };

// ---- os números do CENSO (GARM caps. 10 e 11), citados na ficha ---------
const CENSO = { bgIdeal: 400, bgMin: 250, bgMax: 550, bgsPorTract: 3,
                tractPop: "2 500 a 8 000", tractDom: "1 000 a 3 000" };

// A asserção que dá sentido à figura: a mediana do arquivo tem de ficar perto do
// ideal do block group, e LONGE do tamanho de um census tract. É isso que a
// figura afirma, então é isso que ela recusa desenhar se deixar de valer.
if (Math.abs(MED.dom - CENSO.bgIdeal) > 150) {
  throw new Error(`mediana de ${MED.dom} domicílios longe do ideal de ${CENSO.bgIdeal} do block group`);
}
if (MED.dom > 1000) throw new Error(`mediana de ${MED.dom} está na faixa de um census tract, não de um block group`);

const br = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const LARG = 444;
const NIVEIS = [
  { n: "Estado", d: "Califórnia" },
  { n: "Condado", d: "58 na Califórnia" },
  { n: "Census tract", d: `${CENSO.tractPop} moradores`, nota: `≈ ${CENSO.bgsPorTract} block groups dentro` },
  { n: "Block group", d: `ideal ${CENSO.bgIdeal} domicílios (${CENSO.bgMin} a ${CENSO.bgMax})`,
    nota: "menor unidade com dado amostral", alvo: true },
  { n: "Block", d: "o quarteirão", nota: "sem dado de renda publicado" },
];

// Escada com trilho à esquerda: o degrau + o fio em L é o que faz o encaixe ser
// LIDO como encaixe. Só recuar as caixas não basta — a primeira versão fez isso
// e as cinco faixas pareciam uma lista, não uma contenção.
const ESQ = 22, DEG = 22, DIR = 96;   // DIR: calha reservada para o marcador
const y0 = 74, gap = 10;
const alt = (v) => (v.nota ? 60 : 46);
let y = y0;
const faixas = NIVEIS.map((v, i) => {
  const f = { ...v, x: ESQ + i * DEG, y, h: alt(v) };
  f.w = LARG - f.x - (v.alvo ? DIR : 22);
  y += f.h + gap;
  return f;
});
const alvo = faixas.find((f) => f.alvo);
const fim = y;
const baseB = fim + 26;
const ALT = baseB + 74;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARG} ${ALT}"
  role="img" width="${LARG}" font-family="ui-sans-serif, system-ui, sans-serif">
  <style>
    .fundo { fill: #ffffff; }
    .cx { fill: #f4f5f7; stroke: #c9ccd2; }
    .cx-alvo { fill: #e8f2ea; stroke: #2f7d46; stroke-width: 2; }
    .t { fill: #1c1f24; font-size: 14px; font-weight: 600; }
    .d { fill: #4a5058; font-size: 11.5px; }
    .nota { fill: #6b7280; font-size: 10.5px; font-style: italic; }
    .tit { fill: #1c1f24; font-size: 15px; font-weight: 700; }
    .marca { fill: #2f7d46; font-size: 11.5px; font-weight: 700; }
    .leg { fill: #4a5058; font-size: 11px; }
    .fio-enc { stroke: #9aa1aa; stroke-width: 1.2; fill: none; }
    .seta { stroke: #2f7d46; stroke-width: 1.6; fill: none; }
    .ponta { fill: #2f7d46; }
    .sep { stroke: #d8dbe0; }
    :root:not([data-tema="claro"]) { }
    @media (prefers-color-scheme: dark) {
      :root:not([data-tema="claro"]) .fundo { fill: #14171a; }
      :root:not([data-tema="claro"]) .cx { fill: #1e2227; stroke: #3a4048; }
      :root:not([data-tema="claro"]) .cx-alvo { fill: #1b2a20; stroke: #6fbe86; }
      :root:not([data-tema="claro"]) .t, :root:not([data-tema="claro"]) .tit { fill: #e6e8ea; }
      :root:not([data-tema="claro"]) .d, :root:not([data-tema="claro"]) .leg { fill: #b3b8bf; }
      :root:not([data-tema="claro"]) .nota { fill: #8d949c; }
      :root:not([data-tema="claro"]) .marca { fill: #6fbe86; }
      :root:not([data-tema="claro"]) .fio-enc { stroke: #666d76; }
      :root:not([data-tema="claro"]) .seta { stroke: #6fbe86; }
      :root:not([data-tema="claro"]) .ponta { fill: #6fbe86; }
      :root:not([data-tema="claro"]) .sep { stroke: #3a4048; }
    }
    :root[data-tema="escuro"] .fundo { fill: #14171a; }
    :root[data-tema="escuro"] .cx { fill: #1e2227; stroke: #3a4048; }
    :root[data-tema="escuro"] .cx-alvo { fill: #1b2a20; stroke: #6fbe86; }
    :root[data-tema="escuro"] .t, :root[data-tema="escuro"] .tit { fill: #e6e8ea; }
    :root[data-tema="escuro"] .d, :root[data-tema="escuro"] .leg { fill: #b3b8bf; }
    :root[data-tema="escuro"] .nota { fill: #8d949c; }
    :root[data-tema="escuro"] .marca { fill: #6fbe86; }
    :root[data-tema="escuro"] .fio-enc { stroke: #666d76; }
    :root[data-tema="escuro"] .seta { stroke: #6fbe86; }
    :root[data-tema="escuro"] .ponta { fill: #6fbe86; }
    :root[data-tema="escuro"] .sep { stroke: #3a4048; }
  </style>
  <rect width="100%" height="100%" class="fundo"/>

  <text x="${ESQ}" y="30" class="tit">Uma linha do arquivo é um block group</text>
  <text x="${ESQ}" y="49" class="leg">O encaixe do censo dos Estados Unidos, do maior para o menor.</text>
  <line x1="${ESQ}" y1="60" x2="${LARG - 22}" y2="60" class="sep"/>

${faixas.map((f, i) => {
  const pai = faixas[i - 1];
  const fio = pai
    ? `  <path d="M ${pai.x + 11} ${pai.y + pai.h} V ${f.y + f.h / 2} H ${f.x}" class="fio-enc"/>\n`
    : "";
  return fio +
`  <rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="6" class="${f.alvo ? "cx-alvo" : "cx"}"/>
  <text x="${f.x + 12}" y="${f.y + 20}" class="t">${f.n}</text>
  <text x="${f.x + 12}" y="${f.y + 36}" class="d">${f.d}</text>${f.nota ? `
  <text x="${f.x + 12}" y="${f.y + 51}" class="nota">${f.nota}</text>` : ""}`;
}).join("\n")}

  <path d="M ${LARG - 26} ${alvo.y + alvo.h / 2} H ${alvo.x + alvo.w + 7}" class="seta"/>
  <polygon points="${alvo.x + alvo.w + 2},${alvo.y + alvo.h / 2} ${alvo.x + alvo.w + 11},${alvo.y + alvo.h / 2 - 5} ${alvo.x + alvo.w + 11},${alvo.y + alvo.h / 2 + 5}" class="ponta"/>
  <text x="${LARG - 24}" y="${alvo.y + alvo.h / 2 - 8}" text-anchor="end" class="marca">cada linha</text>
  <text x="${LARG - 24}" y="${alvo.y + alvo.h / 2 + 8}" text-anchor="end" class="marca">do CSV</text>

  <line x1="${ESQ}" y1="${baseB - 20}" x2="${LARG - 22}" y2="${baseB - 20}" class="sep"/>
  <text x="${ESQ}" y="${baseB}" class="tit">E é isto que o arquivo mede</text>
  <text x="${ESQ}" y="${baseB + 21}" class="d"><tspan class="marca">${br(MED.linhas)}</tspan> linhas · mediana de <tspan class="marca">${br(MED.dom)}</tspan> domicílios</text>
  <text x="${ESQ}" y="${baseB + 37}" class="d">e <tspan class="marca">${br(MED.pop)}</tspan> moradores por linha</text>
  <text x="${ESQ}" y="${baseB + 57}" class="leg">A mediana medida cai em cima do ideal do block group (${CENSO.bgIdeal}), e bem</text>
  <text x="${ESQ}" y="${baseB + 71}" class="leg">abaixo dos ${CENSO.tractDom} domicílios de um census tract.</text>
</svg>
`;

writeFileSync(resolve(AQUI, "..", "tema", "block-group.svg"), svg);
console.log("✓ publicar/tema/block-group.svg");
console.log(`  viewBox ${LARG}×${ALT} (numa coluna de 322px a escala fica ${(322 / LARG).toFixed(2)})`);
console.log(`  medido no CSV: ${MED.linhas} linhas · mediana ${MED.dom} domicílios · ${MED.pop} moradores`);
console.log(`  censo (GARM): block group ideal ${CENSO.bgIdeal} (${CENSO.bgMin}–${CENSO.bgMax}) · tract ${CENSO.tractDom} domicílios`);
