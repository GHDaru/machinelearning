// Gate do MODO CARTÃO: um cartão tem de ser fechável.
//
// POR QUE ELE EXISTE
//
// A régua v1 cortava por cabeçalho — critério tipográfico, não pedagógico. Um
// crítico cego comparou o resultado com a referência de microlearning que o
// autor aprovou, a 360×800, e a medição foi essa:
//
//                       referência        nosso corte por cabeçalho
//   altura da unidade   759–910 px        226–5 849 px
//   telas por unidade   0,95 a 1,14       0,28 a 7,31
//   maior/menor         1,2x              25,9x
//   palavras            100–156           39–1 289
//
// O cartão 7 ("A dedução, em cinco passos") tinha 7,3 telas, 1 289 palavras e
// 49 blocos de fórmula. O cartão 8 tinha 39 palavras. A navegação prometia
// "7 de 18" para os dois.
//
// MICROLEARNING SÓ FUNCIONA PORQUE A UNIDADE É FECHÁVEL. Sem teto e sem piso,
// "cartão" não significa nada para quem lê, e a barra de progresso mente sobre
// o esforço que falta.
//
// Os limiares vêm do crítico, não da minha opinião:
//   altura   400 a 1600 px  (meia tela a duas telas, a 360×800)
//   palavras 80 a 250
//   razão maior/menor  ≤ 3x
//   no máximo 2 cartões SEGUIDOS sem exercício nem laboratório
//
// A ÚLTIMA REGRA MUDOU, E O MOTIVO VALE REGISTRAR. O crítico pediu "≥80% dos
// cartões com objeto", e eu adotei sem questionar. Está errado, e quem apontou
// foi quem teve de obedecer: expresso como FRAÇÃO DO TOTAL, o teto de cartões
// narrativos passa a ser fixado por uma quantidade que nada tem a ver com
// legibilidade — quantos exercícios o autor por acaso escreveu.
//
// No II.2 são 14 objetos, então 80% permitia no máximo 17 cartões e sobravam
// TRÊS vagas narrativas. O custo saiu do leitor: a montagem do caso da limonada
// — a tabela de correlação em que o caso inteiro se apoia — ficou fora do
// baralho, e em modo cartão o leitor chegava ao "controle que não salva" sem
// nunca ter visto a correlação de +0,513.
//
// A regra por SEQUÊNCIA mede o que se queria medir desde o começo: quanto tempo
// o leitor fica lendo sem fazer nada. Não põe a qualidade narrativa refém da
// contagem de exercícios.
//
// Uso:  node publicar/gates/cartoes-legiveis.mjs [arquivo.html ...]
//
// Precisa do Playwright, como a auditoria de jornada, e pelo mesmo motivo:
// contar caractere não é ler página. Ausente, ele FALHA em vez de se pular.
import { createServer } from "node:http";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DOCS = resolve(RAIZ, "docs");
const PORTA = Number(process.env.PORTA || 8144);
const LARG = 360, ALT = 800;

export const LIMITES = {
  alturaMin: 400, alturaMax: 1600,
  palavrasMin: 80, palavrasMax: 250,
  razaoMax: 3,
  seguidosSemObjeto: 2,
};

let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright"));
} catch {
  console.error("✗ O gate dos cartões precisa do Playwright.");
  console.error("   npm i -D playwright && npx playwright install chromium");
  console.error("   (ou PLAYWRIGHT=/caminho/para/playwright/index.mjs)");
  process.exit(2);
}

const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".csv": "text/csv",
  ".woff2": "font/woff2", ".ico": "image/x-icon" };
const servidor = createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  const alvo = join(DOCS, p === "/" ? "index.html" : p);
  if (!alvo.startsWith(DOCS)) { res.writeHead(403).end(); return; }
  try {
    res.writeHead(200, { "Content-Type": TIPOS[extname(alvo)] || "application/octet-stream" });
    res.end(readFileSync(alvo));
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(PORTA, "127.0.0.1", ok));

const pedidos = process.argv.slice(2);
const paginas = pedidos.length ? pedidos.map((p) => p.replace(/\.html$/, ""))
  : readdirSync(DOCS).filter((f) => f.endsWith(".html")).map((f) => f.slice(0, -5));

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
  args: ["--no-sandbox"],
});
const pagina = await navegador.newPage({ viewport: { width: LARG, height: ALT } });

const falhas = [];
let comCartoes = 0;

for (const nome of paginas) {
  await pagina.goto(`http://127.0.0.1:${PORTA}/${nome}.html`, { waitUntil: "networkidle" });
  const ligou = await pagina.evaluate(() => {
    const b = document.querySelector(".cartoes-alt");
    if (!b) return false;
    b.click();
    return true;
  });
  if (!ligou) continue;
  comCartoes++;
  await pagina.waitForTimeout(350);

  const medidas = await pagina.evaluate(() => {
    // Os cartões usam o atributo `hidden`. Para medir altura e texto de todos,
    // cada um é revelado por um instante e devolvido ao estado anterior — medir
    // só o visível daria uma amostra de tamanho 1.
    const cs = [...document.querySelectorAll(".cartao")];
    return cs.map((c, i) => {
      const estava = c.hasAttribute("hidden");
      if (estava) c.removeAttribute("hidden");
      const h = Math.round(c.scrollHeight);
      const txt = (c.innerText || "").trim();
      const pal = txt ? txt.split(/\s+/).length : 0;
      const inter = c.querySelectorAll(".exercicio, .laboratorio").length;
      if (estava) c.setAttribute("hidden", "");
      return { i: i + 1, h, pal, inter, titulo: (c.querySelector("h2,h3")?.textContent || "").trim().slice(0, 46) };
    });
  });
  if (!medidas.length) continue;

  const alturas = medidas.map((m) => m.h);
  const razao = Math.max(...alturas) / Math.max(1, Math.min(...alturas));
  // A maior sequência de cartões seguidos sem exercício nem laboratório.
  let corrida = 0, maiorCorrida = 0, inicioPior = 0, inicio = 0;
  medidas.forEach((m, k) => {
    if (m.inter === 0) {
      if (corrida === 0) inicio = k;
      corrida++;
      if (corrida > maiorCorrida) { maiorCorrida = corrida; inicioPior = inicio; }
    } else corrida = 0;
  });
  const comInter = medidas.filter((m) => m.inter > 0).length / medidas.length;
  const foraAltura = medidas.filter((m) => m.h < LIMITES.alturaMin || m.h > LIMITES.alturaMax);
  const foraPalavras = medidas.filter((m) => m.pal < LIMITES.palavrasMin || m.pal > LIMITES.palavrasMax);

  if (foraAltura.length || foraPalavras.length || razao > LIMITES.razaoMax
      || maiorCorrida > LIMITES.seguidosSemObjeto) {
    falhas.push({ nome, total: medidas.length, razao, comInter, foraAltura, foraPalavras,
                  maiorCorrida, inicioPior, medidas });
  }
}

await navegador.close();
servidor.close();

if (!comCartoes) {
  console.error("✗ nenhuma página com modo cartão foi encontrada — o gate não pode passar vazio.");
  process.exit(1);
}

if (falhas.length) {
  console.error(`✗ ${falhas.length} página(s) com cartões que não fecham:`);
  for (const f of falhas) {
    console.error(`\n   ${f.nome} — ${f.total} cartões`);
    console.error(`     razão maior/menor: ${f.razao.toFixed(1)}x (teto ${LIMITES.razaoMax}x)`);
    if (f.maiorCorrida > LIMITES.seguidosSemObjeto) {
      const quais = f.medidas.slice(f.inicioPior, f.inicioPior + f.maiorCorrida)
        .map((m) => `${m.i} ("${m.titulo}")`).join(", ");
      console.error(`     ${f.maiorCorrida} cartões seguidos sem nada para fazer (teto ${LIMITES.seguidosSemObjeto}): ${quais}`);
    }
    console.error(`     com exercício ou laboratório: ${(100 * f.comInter).toFixed(0)}% (informativo)`);
    for (const m of f.foraAltura) {
      const q = (m.h / ALT).toFixed(1);
      console.error(`     cartão ${m.i}: ${m.h}px (${q} telas) — "${m.titulo}"`);
    }
    for (const m of f.foraPalavras) {
      console.error(`     cartão ${m.i}: ${m.pal} palavras — "${m.titulo}"`);
    }
  }
  console.error("\n   Microlearning só funciona porque a unidade é FECHÁVEL.");
  console.error("   Sem teto e sem piso, a barra de progresso mente sobre o esforço que falta.");
  process.exit(1);
}
console.log(`✓ ${comCartoes} página(s) com modo cartão: todo cartão fecha entre ${LIMITES.alturaMin} e ${LIMITES.alturaMax}px e entre ${LIMITES.palavrasMin} e ${LIMITES.palavrasMax} palavras, e nunca passa de ${LIMITES.seguidosSemObjeto} cartões seguidos sem nada para fazer.`);
