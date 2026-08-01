// Motor do livro — Markdown (livro/) -> site HTML navegável (docs/).
// App próprio (não framework): usa markdown-it como biblioteca de parsing; o
// motor em si — navegação, tema, callouts, exercícios, vídeos — é nosso.
//
// Uso: node build.mjs
//
// Convenções de conteúdo reconhecidas:
//  - 1º blockquote "**Estado da arte capturado em ...**" -> selo de data
//  - Seções ## de tipos pedagógicos -> callout próprio (Diátaxis/Bloom)
//  - Blocos :::exercicio / :::video -> UI interativa SEM gabarito (interativos.mjs)
//  - Links internos .md -> reescritos para .html; links .html passam intactos
//  - <div data-viz="..."> -> ilha viva (grafo do livro, uso do livro)

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import { gerarGrafo } from "./grafo.mjs";
import { renderizar, extrair } from "./interativos.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const SAIDA = resolve(RAIZ, "docs");
const A = "assets/";

const sumario = JSON.parse(readFileSync(resolve(AQUI, "sumario.json"), "utf8"));

const slugDe = (arquivo) => basename(arquivo).replace(/\.md$/, "").toLowerCase();
const itens = sumario.partes.flatMap((p) => p.itens.map((i) => ({ ...i, parte: p.nome }))).filter((i) => i.arquivo);
itens.forEach((i) => (i.slug = slugDe(i.arquivo)));
const slugsPublicados = new Set(itens.map((i) => i.slug));

const GITHUB_BASE = "https://github.com/GHDaru/machinelearning/blob/main/";
const SITE = "https://ghdaru.github.io/machinelearning/";

// Companion (chat + correção de exercícios + progresso). O gating real é do
// backend; o mapa abaixo é só exibição, e espelha capabilities.py.
const COMPANION_BACKEND = sumario.companion_backend || "";
const COMPANION_CAPS = [
  { chave: "tutor", rotulo: "Tutor do livro", libera: 0 },
  { chave: "busca_livro", rotulo: "Busca no livro", libera: 0 },
  { chave: "exercicios", rotulo: "Correção de exercícios", libera: 0 },
  { chave: "progresso", rotulo: "Seu progresso", libera: 0 },
  { chave: "plano_estudo", rotulo: "Plano de estudo", libera: 0 },
  { chave: "dados", rotulo: "Diagnóstico de dados", libera: 2 },
  { chave: "metricas", rotulo: "Calculadora de métricas", libera: 4 },
  { chave: "matematica", rotulo: "Contas passo a passo", libera: 6 },
];
const capituloDe = (titulo) => parseInt((String(titulo).match(/^\s*(\d+)/) || [])[1], 10) || 0;

function companionSnippet(chapter) {
  const cfg = JSON.stringify({ backend: COMPANION_BACKEND, chapter, mode: "progressivo", lang: "pt", capabilities: COMPANION_CAPS });
  return `<script>window.COMPANION=${cfg.replace(/</g, "\\u003c")}</script>
<link rel="stylesheet" href="${A}companion.css">
<script src="${A}companion.js" defer></script>
<script src="${A}interativos.js" defer></script>`;
}

// linkify: false de propósito — num livro técnico, "train.py"/"README.md" no
// texto não devem virar links. Links reais já são explícitos no Markdown.
const md = new MarkdownIt({ html: true, linkify: false, typographer: false }).use(anchor, {
  permalink: anchor.permalink.ariaHidden({ symbol: "#", placement: "after" }),
  slugify: (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
});

// Reescrita de links internos: .md publicado -> .html local; .html passa
// intacto; o resto aponta para o arquivo no GitHub.
const defaultLinkOpen = md.renderer.rules.link_open || ((t, i, o, e, s) => s.renderToken(t, i, o));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet("href");
  if (href && !/^https?:|^#|^mailto:|^\/\//.test(href) && !/\.html(#|$)/.test(href)) {
    const [alvo, hash] = href.split("#");
    const ancora = hash ? "#" + hash : "";
    const slug = basename(alvo).replace(/\.md$/i, "").toLowerCase();
    if (/\.md$/i.test(alvo) && slugsPublicados.has(slug)) {
      tokens[idx].attrSet("href", slug + ".html" + ancora);
    } else {
      const repoRel = path.posix.normalize(path.posix.join(env.srcDir || ".", alvo)).replace(/^(\.\.\/)+/, "");
      tokens[idx].attrSet("href", GITHUB_BASE + repoRel + ancora);
    }
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

// Datação — o selo do livro vivo.
const RE_CAPTURA = /Estado da arte capturado em/;
function extrairData(markdown) {
  const m = markdown.match(new RegExp("^>\\s*\\*\\*(" + RE_CAPTURA.source + "[^*]+)\\*\\*([^\\n]*)", "m"));
  return m ? (m[1] + m[2]).replace(/\[.*?\]\(.*?\)/g, "").replace(/·\s*$/, "").trim() : null;
}
function extrairDatas(markdown) {
  const cap = (markdown.match(new RegExp(RE_CAPTURA.source + "\\s+(\\d{4}-\\d{2}(?:-\\d{2})?)")) || [])[1] || null;
  const rev = (markdown.match(/última revisão\s+(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
  return { cap, rev };
}

// Carga estimada de leitura (Sweller): ~200 palavras/min, sem blocos de código.
function tempoDeLeitura(markdown) {
  const semCodigo = markdown.replace(/```[\s\S]*?```/g, " ");
  const palavras = (semCodigo.match(/\S+/g) || []).length;
  return Math.max(1, Math.round(palavras / 200));
}

// Callouts pedagógicos.
const TIPOS_CALLOUT = [
  { re: /objetivos de aprendizagem/i, cls: "callout-objetivos" },
  { re: /^verifica/i, cls: "callout-verificacao" },
  { re: /^pratique/i, cls: "callout-pratica" },
  { re: /^assista/i, cls: "callout-video" },
  { re: /mão na massa/i, cls: "callout-pratica" },
  { re: /o que levar/i, cls: "callout-roubar" },
  { re: /^apêndice/i, cls: "callout-apendice" },
];
function marcarCallouts(html) {
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (full, attrs, titulo) => {
    const limpo = titulo.replace(/<[^>]+>/g, "").trim();
    const tipo = TIPOS_CALLOUT.find((t) => t.re.test(limpo));
    return tipo ? `<h2${attrs} data-callout="${tipo.cls}">${titulo}</h2>` : full;
  });
}

// Siglas "abertas" — fonte única; o glossário espelha (Guia Editorial).
const SIGLAS = {
  ML: "Machine Learning", IA: "Inteligência Artificial",
  MLP: "Multi-Layer Perceptron", CNN: "Convolutional Neural Network", RNN: "Recurrent Neural Network",
  LSTM: "Long Short-Term Memory", GRU: "Gated Recurrent Unit", GAN: "Generative Adversarial Network",
  SVM: "Support Vector Machine", KNN: "K-Nearest Neighbors", PCA: "Principal Component Analysis",
  SGD: "Stochastic Gradient Descent", MSE: "Mean Squared Error", MAE: "Mean Absolute Error",
  RMSE: "Root Mean Squared Error", MAPE: "Mean Absolute Percentage Error",
  AUC: "Area Under the Curve", ROC: "Receiver Operating Characteristic",
  RL: "Reinforcement Learning", MDP: "Markov Decision Process", PPO: "Proximal Policy Optimization",
  RLHF: "Reinforcement Learning from Human Feedback",
  LLM: "Large Language Model", NLP: "Natural Language Processing", RAG: "Retrieval-Augmented Generation",
  BERT: "Bidirectional Encoder Representations from Transformers", GPT: "Generative Pre-trained Transformer",
  SHAP: "SHapley Additive exPlanations", LIME: "Local Interpretable Model-agnostic Explanations",
  MLOps: "Machine Learning Operations",
  ETL: "Extract, Transform, Load", API: "Application Programming Interface",
  SDK: "Software Development Kit", CLI: "Command-Line Interface", GPU: "Graphics Processing Unit",
  CPU: "Central Processing Unit", TPU: "Tensor Processing Unit",
  JSON: "JavaScript Object Notation", HTTP: "HyperText Transfer Protocol", CSV: "Comma-Separated Values",
  DOI: "Digital Object Identifier", LGPD: "Lei Geral de Proteção de Dados",
  IID: "Independent and Identically Distributed", ERM: "Empirical Risk Minimization",
  PAC: "Probably Approximately Correct", NLL: "Negative Log-Likelihood",
  KL: "Kullback-Leibler", ELBO: "Evidence Lower Bound", DDD: "Domain-Driven Design",
};
const RE_SIGLAS = new RegExp("\\b(" + Object.keys(SIGLAS).sort((a, b) => b.length - a.length).join("|") + ")\\b", "g");
const TAGS_PROT = /^(pre|code|a|abbr|h[1-6]|script|style|input|textarea|button|label)$/i;
function ligarCitacoes(texto) {
  return texto.replace(/arXiv\s+(\d{4}\.\d{4,5})/g,
    (m, id) => `<a class="cita" href="bibliografia.html" title="ver na Bibliografia">arXiv ${id}</a>`);
}
function abrirSiglas(html) {
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  const sub = (t) => ligarCitacoes(t).replace(RE_SIGLAS, (s) => `<abbr title="${SIGLAS[s]}">${s}</abbr>`);
  let out = "", last = 0, m, prot = 0;
  while ((m = re.exec(html))) {
    const txt = html.slice(last, m.index);
    out += prot > 0 ? txt : sub(txt);
    const tag = m[1].toLowerCase();
    if (TAGS_PROT.test(tag) && !m[0].endsWith("/>")) prot += m[0][1] === "/" ? -1 : 1;
    if (prot < 0) prot = 0;
    out += m[0];
    last = re.lastIndex;
  }
  return out + (prot > 0 ? html.slice(last) : sub(html.slice(last)));
}

// "02 — Dados" -> { num: "02", texto: "Dados" }.
const dividirTitulo = (t) => {
  const p = t.split("—");
  if (p.length < 2) return { num: "", texto: t.trim() };
  return { num: /^\s*\d+\s*$/.test(p[0]) ? p[0].trim() : "", texto: p.slice(1).join("—").trim() };
};

function pagina({ tituloPagina, corpo, navLateral, prev, next, data, ehIndex, chapter = 0, slug = "", hero = null }) {
  const navBtn = (item, dir) => {
    if (!item) return `<span></span>`;
    const { num, texto } = dividirTitulo(item.titulo);
    const badge = num ? `<span class="pag-badge">${num}</span>` : "";
    const rotulo = dir === "prev" ? "← anterior" : "próximo →";
    return `<a class="pagcard${dir === "next" ? " next" : ""}" href="${item.slug}.html">${badge}<span class="pag-tx"><span class="pag-dir">${rotulo}</span><span class="pag-tt">${texto}</span></span></a>`;
  };
  const selo = data ? `<div class="selo-data" title="Livro vivo — ver Histórico">🕒 ${data}</div>` : "";
  return `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${tituloPagina} · ${sumario.titulo}</title>
<meta name="description" content="${sumario.subtitulo}">
<meta property="og:type" content="website">
<meta property="og:title" content="${sumario.titulo}">
<meta property="og:description" content="${sumario.subtitulo}">
<meta property="og:image" content="${SITE}assets/capa-social.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="${A}favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="${A}favicon-32.png">
<link rel="apple-touch-icon" href="${A}apple-touch-icon.png">
<link rel="stylesheet" href="${A}estilo.css">
<link rel="stylesheet" href="${A}interativos.css">
</head><body${ehIndex ? ' class="pagina-index"' : hero ? ' class="pagina-capitulo"' : ""} data-slug="${slug}" data-lang="pt" data-titulo="${tituloPagina.replace(/"/g, "&quot;")}">
<button id="alt-tema" aria-label="Alternar tema">◐</button>
<div class="layout">
  <aside class="sidebar">
    <a class="marca" href="sumario.html">${sumario.titulo}</a>
    <a class="link-capa" href="index.html">↩ capa</a>
    ${navLateral}
  </aside>
  <main class="conteudo">
    ${hero || selo}
    <article class="markdown">${corpo}</article>
    <nav class="pagcards">${navBtn(prev, "prev")}${navBtn(next, "next")}</nav>
    <footer class="rodape">Livro vivo · gerado do Markdown pelo motor próprio · <a href="https://github.com/GHDaru/machinelearning">fonte no GitHub</a></footer>
  </main>
</div>
<script src="${A}app.js"></script>
<script src="${A}uso.js" defer></script>
<script src="${A}grafo.js" defer></script>
${companionSnippet(chapter)}
</body></html>`;
}

// Versão do livro: fonte única = a última edição declarada em HISTORICO.md.
function versaoDoLivro() {
  try {
    const hist = readFileSync(resolve(RAIZ, "livro/HISTORICO.md"), "utf8");
    const m = hist.match(/^###\s+Edição\s+(\d+)\.(\d+)/m);
    if (m) return `v${m[1]}.${m[2]}.0`;
  } catch {}
  return "v0.0.0";
}
function dataDaUltimaModificacao() {
  let d;
  try {
    const iso = execSync("git log -1 --format=%cI", { cwd: RAIZ, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    d = iso ? new Date(iso) : new Date();
  } catch {
    d = new Date();
  }
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(d);
}
function ultimaEdicao() {
  try {
    const hist = readFileSync(resolve(RAIZ, "livro/HISTORICO.md"), "utf8");
    const m = hist.match(/^###\s+Edição\s+(\d+\.\d+)\s+—\s+(\d{4}-\d{2}-\d{2})\s+·\s+(.+)$/m);
    if (m) return { versao: `v${m[1]}.0`, data: m[2], titulo: m[3].replace(/\s*\(spec \d+\)\s*$/, "") };
  } catch {}
  return null;
}
const edicao = ultimaEdicao();

const ALT_CAPA = "Capa do livro vivo de Machine Learning: uma nuvem de pontos de dados que se organiza numa fronteira de decisão luminosa, sobre fundo escuro com traços de grade.";

function paginaSplash(placar) {
  return `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${sumario.titulo}</title>
<meta name="description" content="${sumario.subtitulo}">
<meta property="og:type" content="website">
<meta property="og:title" content="${sumario.titulo}">
<meta property="og:description" content="${sumario.subtitulo}">
<meta property="og:image" content="${SITE}assets/capa-social.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="${A}favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="${A}favicon-32.png">
<link rel="apple-touch-icon" href="${A}apple-touch-icon.png">
<link rel="stylesheet" href="${A}estilo.css">
<link rel="stylesheet" href="${A}interativos.css">
</head><body class="splash-body" data-lang="pt">
<main class="splash">
  <div class="splash-arte">
    <img src="${A}capa.png" width="1024" height="1536" loading="eager" alt="${ALT_CAPA}">
  </div>
  <div class="splash-texto">
    <h1>${sumario.titulo}</h1>
    <p class="splash-sub">${sumario.subtitulo}</p>
    <p class="splash-desc">Um livro que <em>corrige você</em>: cada capítulo traz exercícios avaliados no servidor, vídeos curados e uma etapa da construção <code>ml-zero</code> — do NumPy cru ao modelo servido por API.</p>
    <div class="splash-ctas">
      <a class="btn btn-primario btn-grande" href="sumario.html">Entrar no livro →</a>
      <a class="btn btn-escuro" href="banco-de-exercicios.html">Praticar</a>
      <a class="btn btn-escuro" href="trilha-ml-zero.html">Construir</a>
    </div>
    <p class="splash-placar">🎯 ${placar.exercicios} exercícios · 🎬 ${placar.videos} vídeos · 📖 ${placar.capitulos} capítulos</p>
    ${edicao ? `<p class="splash-vedicao">📖 Nesta edição (<b>${edicao.versao}</b> · ${edicao.data}): ${edicao.titulo} — <a href="historico.html">Histórico</a></p>` : ""}
    <p class="splash-creditos"><strong><a href="autor.html">Gilsiley Henrique Darú</a></strong> — edição, direção e orquestração · <a class="splash-linkedin" href="https://www.linkedin.com/in/gilsiley-dar%C3%BA/">LinkedIn</a><br><strong>Claude (Anthropic)</strong> — pesquisa e geração de texto (co-autoria)</p>
    <p class="splash-versao"><span class="splash-versao-num">${versaoDoLivro()}</span> · atualizado em ${dataDaUltimaModificacao()}</p>
  </div>
</main>
<script src="${A}app.js"></script>
${companionSnippet(0)}
</body></html>`;
}

function montarNavLateral(atualSlug) {
  return sumario.partes
    .map(
      (p) =>
        `<div class="nav-parte">${p.nome}</div><ul>` +
        p.itens
          .map((i) => {
            if (!i.arquivo) return `<li><a href="${i.externo}">${i.titulo}</a></li>`;
            const s = slugDe(i.arquivo);
            const ativo = s === atualSlug ? ' class="ativo"' : "";
            return `<li><a${ativo} href="${s}.html">${i.titulo}</a></li>`;
          })
          .join("") +
        `</ul>`
    )
    .join("");
}

// --- build ---
if (existsSync(SAIDA)) rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });
mkdirSync(resolve(SAIDA, "assets"), { recursive: true });

for (const arq of [
  "estilo.css", "app.js", "capa.png", "capa-social.png", "autor.png",
  "companion.css", "companion.js", "interativos.css", "interativos.js",
  "uso.js", "grafo.js", "favicon.svg", "favicon-32.png", "apple-touch-icon.png",
]) {
  cpSync(resolve(AQUI, "tema", arq), resolve(SAIDA, "assets", arq));
}
writeFileSync(resolve(SAIDA, ".nojekyll"), "");

let gerados = 0;
const placar = { exercicios: 0, videos: 0, capitulos: 0 };

for (let k = 0; k < itens.length; k++) {
  const item = itens[k];
  const caminho = resolve(RAIZ, item.arquivo);
  if (!existsSync(caminho)) {
    console.warn(`  aviso: ausente, pulando -> ${item.arquivo}`);
    continue;
  }
  const bruto = readFileSync(caminho, "utf8");
  const cap = capituloDe(item.titulo);
  const data = extrairData(bruto);

  // Contagem para o placar da capa (só o que existe de fato).
  const { exercicios, videos } = extrair(bruto, item.arquivo, cap);
  placar.exercicios += exercicios.length;
  placar.videos += videos.length;

  // Blocos interativos ANTES do parse: viram HTML puro, sem gabarito.
  const renderMd = (t) => md.render(t, { srcDir: dirname(item.arquivo) });
  const comInterativos = renderizar(bruto, renderMd, item.arquivo, cap);
  let corpo = marcarCallouts(md.render(comInterativos, { srcDir: dirname(item.arquivo) }));

  let hero = null;
  const { num, texto } = dividirTitulo(item.titulo);
  if (num) {
    placar.capitulos++;
    const { cap: dtCap, rev } = extrairDatas(bruto);
    const chips = [
      dtCap ? `<span title="Livro vivo — ver Histórico">🕒 estado da arte ${dtCap}</span>` : "",
      rev ? `<span>revisão ${rev}</span>` : "",
      `<span>📖 ~${tempoDeLeitura(bruto)} min de leitura</span>`,
      exercicios.length ? `<span title="Exercícios corrigidos no servidor">🎯 ${exercicios.length} exercícios</span>` : "",
      videos.length ? `<span>🎬 ${videos.length} vídeos</span>` : "",
      `<a class="cap-dl" href="md/${item.slug}.md" download title="Baixar o Markdown-fonte deste capítulo">⬇ md</a>`,
    ].join("");
    hero = `<header class="cap-hero"><div class="cap-num" aria-hidden="true">${num}</div>
<div class="cap-kicker">${item.parte} · Cap. ${num}</div>
<h1>${texto}</h1>
${item.teaser ? `<p class="cap-teaser">${item.teaser}</p>` : ""}
<div class="cap-meta">${chips}</div></header>`;
    corpo = corpo.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/, "");
    corpo = corpo.replace(new RegExp("<blockquote>\\s*<p><strong>" + RE_CAPTURA.source + "[\\s\\S]*?<\\/blockquote>\\s*"), "");
  }

  if (item.slug !== "glossario") corpo = abrirSiglas(corpo);
  writeFileSync(
    resolve(SAIDA, `${item.slug}.html`),
    pagina({
      tituloPagina: item.titulo,
      corpo,
      navLateral: montarNavLateral(item.slug),
      prev: k === 0 ? { slug: "sumario", titulo: "Sumário" } : itens[k - 1],
      next: itens[k + 1],
      data,
      chapter: cap,
      slug: item.slug,
      hero,
    })
  );
  gerados++;
}

// Downloads: fontes .md publicados + consolidado (bom para LLMs).
mkdirSync(resolve(SAIDA, "md"), { recursive: true });
{
  const partesMd = [];
  for (const item of itens) {
    const caminho = resolve(RAIZ, item.arquivo);
    if (!existsSync(caminho)) continue;
    const bruto = readFileSync(caminho, "utf8");
    writeFileSync(resolve(SAIDA, "md", `${item.slug}.md`), bruto);
    partesMd.push(bruto.trim());
  }
  const cabecalho = `# ${sumario.titulo}\n\n> ${sumario.subtitulo}\n>\n> ${versaoDoLivro()} · fonte: https://github.com/GHDaru/machinelearning · site: ${SITE}\n\n---\n\n`;
  writeFileSync(resolve(SAIDA, "md/machine-learning.md"), cabecalho + partesMd.join("\n\n---\n\n") + "\n");
}

// Knowledge Graph do livro — derivado do conteúdo a cada build.
const grafo = gerarGrafo(itens, RAIZ, versaoDoLivro());
writeFileSync(resolve(SAIDA, "assets/grafo.json"), JSON.stringify(grafo));
console.log(`✓ Grafo do livro: ${grafo.nos.length} nós, ${grafo.arestas.length} arestas`);

// index = tela-capa (splash).
writeFileSync(resolve(SAIDA, "index.html"), paginaSplash(placar));

// sumario.html = a experiência de entrada.
const cartaoEnt = (i) => {
  const s = slugDe(i.arquivo);
  const { num, texto } = dividirTitulo(i.titulo);
  return `<a class="ent-card" href="${s}.html">${num ? `<span class="ent-badge">${num}</span>` : ""}<span class="ent-ct">${texto}</span>${i.teaser ? `<span class="ent-cd">${i.teaser}</span>` : ""}</a>`;
};
const pillEnt = (i) =>
  i.arquivo
    ? `<a class="ent-pill" href="${slugDe(i.arquivo)}.html">${dividirTitulo(i.titulo).texto}</a>`
    : `<a class="ent-pill" href="${i.externo}">${dividirTitulo(i.titulo).texto}</a>`;
const PARTES_CARTAO = new Set(sumario.partes.map((p) => p.nome).filter((n) => n !== "Aparato"));
const blocosCartao = sumario.partes
  .filter((p) => PARTES_CARTAO.has(p.nome))
  .map((p) => `<div class="ent-parte"><span>${p.nome}</span><i></i></div><div class="ent-grid">${p.itens.map(cartaoEnt).join("")}</div>`)
  .join("");
const pillsEnt = sumario.partes.filter((p) => !PARTES_CARTAO.has(p.nome)).flatMap((p) => p.itens).map(pillEnt).join("");

const TRILHA = [
  ["01-fundamentos.html", "Trilha · 1", "Entender", "Generalização, viés e variância: o problema central."],
  ["04-avaliacao.html", "Trilha · 2", "Medir", "O que significa &quot;bom&quot; — e por que acurácia mente."],
  ["banco-de-exercicios.html", "Trilha · 3", "Praticar", "Exercícios corrigidos, com feedback que explica."],
  ["trilha-ml-zero.html", "Trilha · 4", "Construir", "ml-zero: do NumPy cru ao modelo servido."],
];
const trilhaHtml = TRILHA.map(([href, n, b, s]) => `<a class="ent-step" href="${href}"><span class="ent-step-n">${n}</span><b>${b}</b><span>${s}</span></a>`).join("\n    ");

const corpoSumario = `<section class="entrada">
  <div class="ent-hero">
    <img class="ent-capa" src="${A}capa.png" width="1024" height="1536" loading="eager" alt="${ALT_CAPA}">
    <div class="ent-hero-txt">
      <div class="ent-kicker">Livro vivo · ${versaoDoLivro()}</div>
      <h1 class="ent-titulo">${sumario.titulo}</h1>
      <p class="ent-sub">${sumario.subtitulo}</p>
      <div class="ent-ctas">
        <a class="ent-btn ent-btn-a" href="${itens[0].slug}.html">▶ Começar do início — 00</a>
        <a class="ent-btn" href="banco-de-exercicios.html">🎯 Praticar</a>
        <a class="ent-btn" href="trilha-ml-zero.html">🛠 Construir</a>
        <a class="ent-btn" href="md/machine-learning.md" download title="Livro completo em Markdown (bom para LLMs)">⬇ Markdown</a>
      </div>
    </div>
  </div>
  <p class="ent-placar">🎯 ${placar.exercicios} exercícios corrigidos no servidor · 🎬 ${placar.videos} vídeos curados · 📖 ${placar.capitulos} capítulos</p>
  ${edicao ? `<p class="ent-vedicao">📖 Nesta edição (<b>${edicao.versao}</b> · ${edicao.data}): ${edicao.titulo} — <a href="historico.html">Histórico</a></p>` : ""}
  <a class="ent-retomar" id="ent-retomar" href="#" hidden>
    <span class="ent-ret-l"><span class="ent-ret-lab">Continue lendo</span><span class="ent-ret-cap" id="ent-ret-cap"></span></span>
    <span class="ent-btn ent-btn-a">Retomar ▶</span>
  </a>
  <div class="ent-trilha">
    ${trilhaHtml}
  </div>
  ${blocosCartao}
  <div class="ent-parte"><span>Aparato</span><i></i></div>
  <div class="ent-pills">${pillsEnt}</div>
</section>`;
writeFileSync(
  resolve(SAIDA, "sumario.html"),
  pagina({
    tituloPagina: "Sumário",
    corpo: corpoSumario,
    navLateral: montarNavLateral("sumario"),
    prev: null,
    next: itens[0],
    data: null,
    ehIndex: true,
    slug: "sumario",
  })
);

// Portão de qualidade: todo link interno .html aponta para página existente.
const paginas = new Set(itens.map((i) => `${i.slug}.html`).concat("index.html", "sumario.html"));
const quebrados = [];
for (const i of [...itens, { slug: "index" }, { slug: "sumario" }]) {
  const arq = resolve(SAIDA, `${i.slug}.html`);
  if (!existsSync(arq)) continue;
  const html = readFileSync(arq, "utf8");
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^https?:|^#|^mailto:|^\/\//.test(href)) continue;
    if (!/\.html(#|$)/.test(href)) continue;
    const alvo = basename(href.split("#")[0]);
    if (!paginas.has(alvo)) quebrados.push(`${i.slug}.html → ${href}`);
  }
}
if (quebrados.length) {
  console.error(`✗ ${quebrados.length} link(s) interno(s) quebrado(s):`);
  quebrados.forEach((q) => console.error("   " + q));
  process.exit(1);
}

console.log(`✓ Livro gerado: ${gerados} páginas + capa em docs/ (links internos OK)`);
console.log(`  Interatividade: ${placar.exercicios} exercícios · ${placar.videos} vídeos`);
