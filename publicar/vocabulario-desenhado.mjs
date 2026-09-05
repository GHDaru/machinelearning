// O VOCABULÁRIO QUE O NAVEGADOR DESENHA, e que nenhum portão de fonte via.
//
// POR QUE ESTE ARQUIVO EXISTE
//
// Os portões deste repositório leem Markdown. O que o tema escreve na tela
// depois da carga não está no Markdown, e por isso não existe para eles. O ponto
// cego mordeu três vezes, e a terceira é a que o nomeou (D28 do `ROADMAP.md`):
//
//   1. as 14 siglas que continuam nuas na dívida D24 são escritas pelo navegador,
//      em `tema/laboratorios.js`, onde o passe de `<abbr>` do `build.mjs` não
//      chega;
//   2. o painel do laboratório do cartão 4 do `II.2` imprime `R²` na tela, e
//      `gates/pre-requisito.mjs` declara R² apresentado no cartão 23. São 50
//      pontos percentuais de inversão que o portão não vê;
//   3. e o padrão vale para qualquer portão de fonte, presente e futuro.
//
// AS TRÊS ROTAS, E O QUE A MEDIÇÃO FEZ COM ELAS
//
// (a) os portões passam a ler o DOM montado. Caro, e — medido — INSUFICIENTE:
//     na página do `II.2` o tema desenha 16 textos distintos com `fillText`, e
//     nenhum deles é nó de texto. Um portão que lê o DOM continua cego para a
//     primeira das três mordidas.
//
// (b) o tema declara num manifesto o vocabulário que imprime. Barato, e mente
//     por omissão. E não é hipótese: a dívida D24 diz "14 siglas nuas", número
//     levantado só do DOM, enquanto o `EQM` que o mesmo laboratório desenha no
//     canvas não está em conta nenhuma. Um manifesto escrito à mão herdaria
//     exatamente esse tipo de esquecimento.
//
// (c) a jornada, que já abre um Chromium, extrai o texto desenhado e o devolve
//     aos portões de fonte. É a rota certa com um detalhe fatal: texto de
//     `canvas` não está no DOM. Medido antes de escolher, e confirmado.
//
// A ROTA ADOTADA É (c) COM A EXTRAÇÃO NO LUGAR CERTO: não se lê o resultado do
// desenho, instrumenta-se o desenho. `CanvasRenderingContext2D.prototype.fillText`
// e `strokeText` são embrulhados ANTES de o script do tema rodar, e cada string
// desenhada é registrada no ato. Some com a diferença entre canvas e DOM, não
// pede nada ao tema (então não há o que alguém esqueça de declarar), e mantém os
// portões de fonte baratos: um passe de navegador produz o corpus, e eles leem
// um JSON.
//
// O QUE IMPEDE O CORPUS DE APODRECER
//
// Um corpus gerado é um número velho esperando para mentir. Por isso ele guarda
// a IMPRESSÃO DIGITAL de `tema/laboratorios.js` (tamanho e SHA-256), e quem o lê
// reprova quando ela não bate com o arquivo de hoje. Mexeu no tema, regenere:
//
//   PLAYWRIGHT=… CHROMIUM=… node publicar/vocabulario-desenhado.mjs --gerar
//
// O preço está declarado: a regeneração precisa de navegador, e a CI não tem um.
// Quem edita o tema regenera na máquina, como já faz com a jornada e com o gate
// dos cartões.
//
// O LIMITE QUE FICA, E A INTERFACE QUE O FECHARIA
//
// O coletor vê o que o laboratório desenha ao ABRIR. Texto que só aparece depois
// de um clique fica fora. Fechar isso sem simular o leitor exige uma linha do
// tema, e ela está desenhada aqui para quem for mexer nele:
//
//     raiz.__api.vocabulario = function () { return ["AUC", "IQR", …]; };
//
// Uma função opcional no `__api` que 6 laboratórios já expõem, devolvendo os
// termos que aquele laboratório PODE imprimir em qualquer estado. O coletor a
// chama quando existe, e conta quantos laboratórios a ofereceram — de modo que a
// ausência dela é um número, e não um silêncio.
//
// Uso:
//   node publicar/vocabulario-desenhado.mjs --gerar   regenera o corpus
//   node publicar/vocabulario-desenhado.mjs           confere a impressão digital
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { SIGLAS } from "./siglas.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
export const CORPUS = resolve(AQUI, "vocabulario-desenhado.json");
export const TEMA = resolve(AQUI, "tema", "laboratorios.js");

/** A impressão digital do arquivo que desenha. Tamanho e hash, os dois. */
export function impressaoDoTema(caminho = TEMA) {
  const bruto = readFileSync(caminho);
  return { arquivo: "publicar/tema/laboratorios.js", bytes: bruto.length,
           sha256: createHash("sha256").update(bruto).digest("hex").slice(0, 16) };
}

/**
 * Lê o corpus e CONFERE a impressão digital. Devolve `{ paginas, aviso }`:
 * `aviso` é a mensagem de defasagem, ou null. Quem chama decide se reprova;
 * os dois portões que o usam hoje reprovam.
 */
export function lerVocabularioDesenhado(caminho = CORPUS) {
  if (!existsSync(caminho)) {
    return { paginas: {}, aviso:
      `o corpus do vocabulário desenhado não existe (${caminho}). ` +
      `Gere com: PLAYWRIGHT=… CHROMIUM=… node publicar/vocabulario-desenhado.mjs --gerar` };
  }
  const corpus = JSON.parse(readFileSync(caminho, "utf8"));
  const hoje = impressaoDoTema();
  const guardada = corpus.impressao || {};
  if (guardada.sha256 !== hoje.sha256 || guardada.bytes !== hoje.bytes) {
    return { paginas: corpus.paginas || {}, aviso:
      `o corpus do vocabulário desenhado está defasado: foi gerado com ` +
      `laboratorios.js de ${guardada.bytes} bytes (${guardada.sha256}) e o arquivo de hoje tem ` +
      `${hoje.bytes} (${hoje.sha256}). O que o tema desenha mudou, e o que os portões de fonte leem, não. ` +
      `Regenere: PLAYWRIGHT=… CHROMIUM=… node publicar/vocabulario-desenhado.mjs --gerar` };
  }
  return { paginas: corpus.paginas || {}, gerado: corpus.gerado, aviso: null };
}

/** Todo o texto que uma página desenhou, por laboratório, já colado. */
export function textoDesenhado(paginas, slug) {
  const p = paginas[slug];
  if (!p) return new Map();
  const mapa = new Map();
  for (const lab of p.labs || []) {
    mapa.set(lab.id, [...(lab.canvas || []), lab.dom || "", ...(lab.vocabulario || [])].join("\n"));
  }
  return mapa;
}

// A DÍVIDA D24 ESTAVA SUBCONTADA, e este é o número que faltava.
//
// A asserção H da jornada percorre nós de texto do DOM, então ela conta as 14
// siglas nuas que o laboratório ESCREVE e nenhuma das que ele DESENHA. Medido no
// corpus: mais 7 ocorrências em 6 páginas (AUC, ROC, EQM, MAE), que nunca
// estiveram em conta nenhuma. Elas não têm conserto no motor — `<abbr>` não
// existe dentro de um canvas —, e o conserto real é o rótulo desenhado trazer a
// expansão junto, no tema. Até lá o número fica declarado aqui, cobrado nas duas
// direções, para que o total honesto (14 + 7) seja visível.
export const SIGLA_EM_CANVAS_DECLARADA = 7;

/** Siglas conhecidas que o tema desenha em canvas, onde nenhum `<abbr>` alcança. */
export function siglasEmCanvas(paginas) {
  const chaves = Object.keys(SIGLAS).sort((a, b) => b.length - a.length);
  const re = new RegExp("\\b(" + chaves.join("|") + ")\\b", "g");
  const achados = [];
  for (const [slug, pagina] of Object.entries(paginas)) {
    for (const lab of pagina.labs || []) {
      for (const texto of lab.canvas || []) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(texto))) achados.push({ slug, lab: lab.id, sigla: m[1], texto });
      }
    }
  }
  return achados;
}

// --------------------------------------------------------------- o coletor

const GERAR = process.argv.includes("--gerar");
const executado = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (executado && !GERAR) {
  const { aviso, paginas, gerado } = lerVocabularioDesenhado();
  if (aviso) { console.error("✗ " + aviso); process.exit(1); }
  const labs = Object.values(paginas).reduce((a, p) => a + (p.labs || []).length, 0);
  const canvas = Object.values(paginas).reduce((a, p) => a + (p.labs || []).reduce((b, l) => b + (l.canvas || []).length, 0), 0);
  console.log(`✓ vocabulário desenhado: ${Object.keys(paginas).length} página(s), ${labs} laboratório(s), ` +
              `${canvas} texto(s) de canvas, gerado em ${gerado}, impressão digital do tema confere.`);
  const nuas = siglasEmCanvas(paginas);
  const quais = [...new Set(nuas.map((n) => n.sigla))].join(", ");
  console.log(`   Siglas desenhadas em canvas: ${nuas.length} ocorrência(s) em ` +
              `${new Set(nuas.map((n) => n.slug)).size} página(s) (${quais || "nenhuma"}). ` +
              `A asserção H da jornada não as vê: ela percorre nós de texto, e canvas não tem nó nenhum. ` +
              `Somam-se às 14 declaradas em SIGLA_NUA_PENDENTE.`);
  if (nuas.length !== SIGLA_EM_CANVAS_DECLARADA) {
    console.error(`✗ a dívida declara ${SIGLA_EM_CANVAS_DECLARADA} sigla(s) desenhada(s) em canvas e há ${nuas.length}.`);
    nuas.forEach((n) => console.error(`   ${n.slug} · ${n.lab} · "${n.sigla}" em "${n.texto}"`));
    console.error(`   Subiu: o rótulo novo desenha uma sigla que ninguém abre — traga a expansão junto no tema.`);
    console.error(`   Desceu: atualize SIGLA_EM_CANVAS_DECLARADA. Dívida paga que fica na lista vira teto para a próxima.`);
    process.exit(1);
  }
  process.exit(0);
}

if (executado && GERAR) {
  const DOCS = resolve(RAIZ, "docs");
  const PORTA = Number(process.env.PORTA || 8155);
  let chromium;
  try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
  catch {
    console.error("✗ Gerar o vocabulário desenhado precisa do Playwright — é o navegador que desenha.");
    console.error("   npm i -D playwright && npx playwright install chromium");
    process.exit(2);
  }
  const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
    ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".csv": "text/csv",
    ".woff2": "font/woff2", ".ico": "image/x-icon" };
  const servidor = createServer((req, res) => {
    const p = decodeURIComponent(req.url.split("?")[0]);
    const alvo = join(DOCS, p === "/" ? "index.html" : p);
    if (!alvo.startsWith(DOCS)) { res.writeHead(403).end(); return; }
    let corpo;
    try { corpo = readFileSync(alvo); } catch { res.writeHead(404).end(); return; }
    res.writeHead(200, { "Content-Type": TIPOS[extname(alvo)] || "application/octet-stream" });
    res.end(corpo);
  });
  await new Promise((ok) => servidor.listen(PORTA, "127.0.0.1", ok));

  // Só as páginas que trazem laboratório. Aqui o filtro é legítimo, ao
  // contrário do que aconteceu no gate dos cartões: sem `[data-lab]` não há
  // nada desenhado para coletar, e o número de páginas abertas fica no relatório.
  const paginasComLab = readdirSync(DOCS)
    .filter((n) => n.endsWith(".html"))
    .filter((n) => /data-lab=/.test(readFileSync(join(DOCS, n), "utf8")))
    .sort();

  const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined,
                                            args: ["--no-proxy-server"] });
  const aba = await navegador.newPage({ viewport: { width: 360, height: 800 } });
  // O embrulho entra ANTES de qualquer script da página. Depois seria tarde: o
  // laboratório desenha na carga.
  await aba.addInitScript(() => {
    window.__desenhado = new Map();
    const proto = CanvasRenderingContext2D.prototype;
    for (const metodo of ["fillText", "strokeText"]) {
      const original = proto[metodo];
      proto[metodo] = function (texto, ...resto) {
        try {
          const secao = this.canvas && this.canvas.closest && this.canvas.closest("[data-lab]");
          const chave = secao ? (secao.getAttribute("data-id") || secao.getAttribute("data-lab")) : "(fora de laboratório)";
          if (!window.__desenhado.has(chave)) window.__desenhado.set(chave, new Set());
          window.__desenhado.get(chave).add(String(texto));
        } catch { /* desenhar nunca pode quebrar por causa do coletor */ }
        return original.call(this, texto, ...resto);
      };
    }
  });

  const paginas = {};
  let totalLabs = 0, totalCanvas = 0, comApi = 0, comVocabulario = 0;
  for (const nome of paginasComLab) {
    await aba.goto(`http://127.0.0.1:${PORTA}/${nome}`, { waitUntil: "load" });
    await aba.waitForTimeout(900);
    const dados = await aba.evaluate(() => {
      const desenhado = window.__desenhado || new Map();
      return [...document.querySelectorAll("[data-lab]")].map((sec) => {
        const id = sec.getAttribute("data-id") || sec.getAttribute("data-lab");
        // O `__api` fica na `.lab-area`, não na seção: o despachante do tema
        // chama `construir(raiz.querySelector(".lab-area"), cfg)`. Procurar na
        // seção devolvia zero laboratórios com API, e zero era mentira.
        const api = (sec.querySelector(".lab-area") || {}).__api || sec.__api;
        let vocabulario = null;
        try { if (api && typeof api.vocabulario === "function") vocabulario = api.vocabulario().map(String); }
        catch { vocabulario = null; }
        return {
          id, tipo: sec.getAttribute("data-lab"),
          canvas: [...(desenhado.get(id) || [])],
          dom: (sec.innerText || "").replace(/\s+/g, " ").trim(),
          temApi: !!api,
          vocabulario,
        };
      });
    });
    const slug = nome.replace(/\.html$/, "");
    paginas[slug] = { labs: dados };
    totalLabs += dados.length;
    totalCanvas += dados.reduce((a, l) => a + l.canvas.length, 0);
    comApi += dados.filter((l) => l.temApi).length;
    comVocabulario += dados.filter((l) => l.vocabulario).length;
  }
  await navegador.close();
  servidor.close();

  const corpus = {
    // Este arquivo é GERADO. A edição à mão dele é a forma mais rápida de
    // reintroduzir exatamente o ponto cego que ele existe para fechar.
    gerado: new Date().toISOString().slice(0, 10),
    impressao: impressaoDoTema(),
    paginas,
  };
  writeFileSync(CORPUS, JSON.stringify(corpus, null, 1) + "\n");
  console.log(`✓ vocabulário desenhado: ${paginasComLab.length} página(s), ${totalLabs} laboratório(s), ` +
              `${totalCanvas} texto(s) de canvas capturado(s) -> publicar/vocabulario-desenhado.json`);
  console.log(`  ${comApi} laboratório(s) expõem __api; ${comVocabulario} oferecem __api.vocabulario(). ` +
              `Os que não oferecem só entregam o que desenham ao abrir.`);
}
