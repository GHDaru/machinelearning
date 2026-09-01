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
//   TODO cartão tem uma interação E um exercício
//
// A ÚLTIMA REGRA MUDOU DUAS VEZES, E AS DUAS VALEM REGISTRAR.
//
// O crítico pediu "≥80% dos cartões com objeto", e eu adotei sem questionar.
// Estava errado, e quem apontou foi quem teve de obedecer: expresso como FRAÇÃO
// DO TOTAL, o teto de cartões narrativos passa a ser fixado por algo que nada
// tem a ver com legibilidade — quantos exercícios o autor por acaso escreveu.
// Virou "no máximo 2 seguidos sem nada para fazer".
//
// Então o AUTOR fixou a premissa, e ela é mais forte que as duas:
//
//     "todo card deve ter uma interação e um exercício, mesmo que teórico —
//      algo que conduza o leitor à solução ou à ideia"
//
// Não é teto nem piso: é uma propriedade de TODO cartão. Um cartão sem gesto é
// leitura disfarçada de microlearning; um cartão sem cobrança não sabe se
// ensinou. A regra por sequência tolerava dois seguidos de cada; esta não
// tolera nenhum.
//
// "Mesmo que teórico" é o que a torna exequível: a interação não precisa ser
// simulação. Predizer antes de revelar, ordenar, escolher e conferir, completar
// uma conta — tudo conta, desde que o leitor faça algo antes de o texto
// responder. O que não conta é um objeto que só se assiste.
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
  // Premissa do autor: sem exceção, sem fração, sem sequência tolerada.
  todoCartaoTemInteracao: true,
  todoCartaoTemExercicio: true,
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
      const exercicios = c.querySelectorAll(".exercicio").length;
      // Interação é qualquer coisa em que o leitor FAÇA algo antes de o texto
      // responder — laboratório, ou um interativo mais leve marcado como tal.
      const interacoes = c.querySelectorAll(".laboratorio, .interacao, [data-interacao]").length;
      const inter = exercicios + interacoes;
      if (estava) c.setAttribute("hidden", "");
      return { i: i + 1, h, pal, inter, exercicios, interacoes,
               titulo: (c.querySelector("h2,h3")?.textContent || "").trim().slice(0, 46) };
    });
  });
  if (!medidas.length) continue;

  const alturas = medidas.map((m) => m.h);
  const razao = Math.max(...alturas) / Math.max(1, Math.min(...alturas));
  const semInteracao = medidas.filter((m) => m.interacoes === 0);
  const semExercicio = medidas.filter((m) => m.exercicios === 0);
  const foraAltura = medidas.filter((m) => m.h < LIMITES.alturaMin || m.h > LIMITES.alturaMax);
  const foraPalavras = medidas.filter((m) => m.pal < LIMITES.palavrasMin || m.pal > LIMITES.palavrasMax);

  if (foraAltura.length || foraPalavras.length || razao > LIMITES.razaoMax
      || semInteracao.length || semExercicio.length) {
    falhas.push({ nome, total: medidas.length, razao, foraAltura, foraPalavras,
                  semInteracao, semExercicio });
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
    if (f.semInteracao.length) {
      console.error(`     ${f.semInteracao.length} de ${f.total} cartões SEM INTERAÇÃO: ${f.semInteracao.map((m) => m.i).join(", ")}`);
    }
    if (f.semExercicio.length) {
      console.error(`     ${f.semExercicio.length} de ${f.total} cartões SEM EXERCÍCIO: ${f.semExercicio.map((m) => m.i).join(", ")}`);
    }
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
console.log(`✓ ${comCartoes} página(s) com modo cartão: todo cartão fecha entre ${LIMITES.alturaMin} e ${LIMITES.alturaMax}px e entre ${LIMITES.palavrasMin} e ${LIMITES.palavrasMax} palavras, e todo cartão tem uma interação e um exercício.`);
