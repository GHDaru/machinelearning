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
import mathjax from "markdown-it-mathjax3";
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
<script src="${A}interativos.js" defer></script>
<script src="${A}laboratorios.js" defer></script>`;
}

// linkify: false de propósito — num livro técnico, "train.py"/"README.md" no
// texto não devem virar links. Links reais já são explícitos no Markdown.
const md = new MarkdownIt({ html: true, linkify: false, typographer: false }).use(anchor, {
  permalink: anchor.permalink.ariaHidden({ symbol: "#", placement: "after" }),
  slugify: (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
});

// O markdown-it-mathjax3 embrulha CADA f\u00f3rmula num <span> que carrega uma
// c\u00f3pia inteira da folha de estilo do MathJax (~3 KB). No cap\u00edtulo 05, com 15
// blocos, isso era 43 KB dos 130 KB da p\u00e1gina \u2014 um ter\u00e7o, id\u00eantico byte a
// byte. Aqui a folha \u00e9 recolhida UMA vez (vai para assets/matematica.css) e
// os embrulhos somem. O <span> usa `display: contents`, ent\u00e3o retir\u00e1-lo n\u00e3o
// muda o layout; e ele nunca aninha outro <span>, ent\u00e3o fecha no primeiro
// </span> \u2014 conferido no HTML gerado antes de escrever esta regra.
let cssMatematica = "";
const RE_EMBRULHO = /<span id="mjx-[0-9a-f]+">\s*<style>([\s\S]*?)<\/style>([\s\S]*?)<\/span>/g;
function dedupCssMatematica(html) {
  return html.replace(RE_EMBRULHO, (_, css, conteudo) => {
    if (!cssMatematica) {
      // Todas as regras vêm ANINHADAS dentro de `#mjx-ID { display:contents; … }`,
      // ou seja, escopadas ao embrulho. Como o embrulho vai embora, o escopo
      // precisa ir junto: tira-se a chave de abertura e a última de fechamento,
      // e as regras internas passam a valer para a página toda — que é o que
      // já faziam na prática, já que todo mjx-container está dentro de um.
      const semAbertura = css.replace(/^\s*#mjx-[0-9a-f]+\s*\{\s*display:contents;/, "");
      cssMatematica = semAbertura.replace(/\}\s*$/, "").trim();
    }
    return conteudo.trim();
  })
  // O plugin indenta o HTML que gera, e a quebra de linha que ele deixa depois
  // da fórmula colapsa num espaço visível: "escolher os w . O critério", com o
  // ponto solto. Aparar só antes de PONTUAÇÃO é a regra segura — antes de
  // palavra o espaço é do texto e tem de ficar ("a média de B estimadores").
  .replace(/<\/mjx-container>\s+(?=[.,;:!?)\]])/g, "</mjx-container>");
}

// Matem\u00e1tica: LaTeX -> SVG **em tempo de build**. A escolha \u00e9 deliberada.
// KaTeX/MathJax no navegador exigiriam CDN (proibido: o livro tem de abrir
// offline) ou empacotar fontes. Renderizar para SVG aqui n\u00e3o custa nada ao
// leitor: nenhum JS, nenhuma fonte, nenhuma requisi\u00e7\u00e3o \u2014 e imprime bem.
// Auditado antes de ligar: todo `$` fora de bloco de c\u00f3digo ERA matem\u00e1tica.
// Isso deixou de valer no cap\u00edtulo 25, que fala de dinheiro: "R$ 200". O que
// salva o pre\u00e7o de virar f\u00f3rmula \u00e9 a regra do pr\u00f3prio renderizador \u2014 `$\u2026$` s\u00f3
// \u00e9 matem\u00e1tica se o conte\u00fado n\u00e3o come\u00e7a nem termina com espa\u00e7o, e "R$ 200 \u2026"
// tem espa\u00e7o logo ap\u00f3s o delimitador. O guarda de acentua\u00e7\u00e3o l\u00e1 embaixo
// espelha essa mesma regra; sem isso ele acusava o pre\u00e7o em reais.
md.use(mathjax, {
  tex: { macros: { saida: "\\text{sa\u00edda}" } },
  // `a11y` liga a \u00e1rvore de acessibilidade do MathJax: o leitor de tela
  // anuncia a f\u00f3rmula em vez de silenciar sobre um <svg> an\u00f4nimo.
  options: { enableAssistiveMml: true },
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
  RLHF: "Reinforcement Learning from Human Feedback", DQN: "Deep Q-Network",
  LLM: "Large Language Model", NLP: "Natural Language Processing", RAG: "Retrieval-Augmented Generation",
  BERT: "Bidirectional Encoder Representations from Transformers", GPT: "Generative Pre-trained Transformer",
  SHAP: "SHapley Additive exPlanations", LIME: "Local Interpretable Model-agnostic Explanations",
  MLOps: "Machine Learning Operations",
  ETL: "Extract, Transform, Load", API: "Application Programming Interface",
  SDK: "Software Development Kit", CLI: "Command-Line Interface", GPU: "Graphics Processing Unit",
  CPU: "Central Processing Unit", TPU: "Tensor Processing Unit",
  JSON: "JavaScript Object Notation", HTTP: "HyperText Transfer Protocol", CSV: "Comma-Separated Values",
  DOI: "Digital Object Identifier", LGPD: "Lei Geral de Proteção de Dados",
  IQR: "Interquartile Range — intervalo interquartil (Q3 − Q1)",
  ARIMA: "AutoRegressive Integrated Moving Average", ACF: "Autocorrelation Function — função de autocorrelação",
  PACF: "Partial Autocorrelation Function — função de autocorrelação parcial",
  OLAP: "Online Analytical Processing", OLTP: "Online Transaction Processing",
  ELT: "Extract, Load, Transform", CRISP: "CRoss-Industry Standard Process",
  EDA: "Exploratory Data Analysis — análise exploratória de dados",
  CART: "Classification and Regression Trees", TF: "Term Frequency", IDF: "Inverse Document Frequency",
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
<link rel="stylesheet" href="${A}matematica.css">
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
    <p class="splash-placar">🎯 ${placar.exercicios} exercícios · 🔬 ${placar.laboratorios} laboratórios · 🎬 ${placar.videos} vídeos · 📖 ${placar.capitulos} capítulos</p>
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
  "uso.js", "grafo.js", "laboratorios.js", "neuronio-mp.svg", "favicon.svg", "favicon-32.png", "apple-touch-icon.png",
]) {
  cpSync(resolve(AQUI, "tema", arq), resolve(SAIDA, "assets", arq));
}
writeFileSync(resolve(SAIDA, ".nojekyll"), "");

let gerados = 0;
const placar = { exercicios: 0, videos: 0, laboratorios: 0, capitulos: 0 };

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
  const { exercicios, videos, laboratorios } = extrair(bruto, item.arquivo, cap);
  placar.exercicios += exercicios.length;
  placar.videos += videos.length;
  placar.laboratorios += laboratorios.length;

  // Blocos interativos ANTES do parse: viram HTML puro, sem gabarito.
  const renderMd = (t) => md.render(t, { srcDir: dirname(item.arquivo) });
  const comInterativos = renderizar(bruto, renderMd, item.arquivo, cap);
  let corpo = dedupCssMatematica(marcarCallouts(md.render(comInterativos, { srcDir: dirname(item.arquivo) })));

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
      laboratorios.length ? `<span title="Objetos interativos para manipular">🔬 ${laboratorios.length} laboratórios</span>` : "",
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
  <p class="ent-placar">🎯 ${placar.exercicios} exercícios corrigidos no servidor · 🔬 ${placar.laboratorios} laboratórios interativos · 🎬 ${placar.videos} vídeos curados · 📖 ${placar.capitulos} capítulos</p>
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

// A folha do MathJax, recolhida uma única vez durante a renderização.
// Vai para assets/ como arquivo próprio: o navegador a busca uma vez e a
// reaproveita em todos os capítulos, em vez de reler a mesma coisa embutida
// em cada fórmula de cada página.
writeFileSync(resolve(SAIDA, "assets/matematica.css"),
  cssMatematica
    ? `/* Gerado pelo build a partir do markdown-it-mathjax3 — não editar à mão.\n   Editar o estilo da matemática em tema/estilo.css. */\n${cssMatematica}\n`
    : "/* Sem matemática nesta edição. */\n");

// ---------------------------------------------------------------------------
// GATE DO PRINCÍPIO X — "nenhum método cai do céu" (ADR 0004, lote 0)
//
// Capítulo de MÉTODO (metodo:true no sumário) em nível `essencial` ou acima
// tem de trazer "De onde isto veio" COM tabela de selos. Sem isto, o princípio
// seria promessa: um capítulo poderia subir de nível calado, e ninguém veria.
// Aqui ele não compila.
//
// Este gate deixa o build VERMELHO de propósito enquanto os capítulos antigos
// não pagarem a dívida D8. Isso é o gate funcionando, não um bug.
// ---------------------------------------------------------------------------
const RE_NIVEL = /\*\*Nível:\s*(esqueleto|essencial|completo)\.?\*\*/i;
const RE_SECAO_HISTORICA = /^##+\s+De onde isto veio/mi;

// O ALFABETO DE SELOS VEM DA CONSTITUIÇÃO, não daqui (ADR 0005).
// A versão anterior era um regex com os selos escritos à mão, e ela dava
// FALSO VERDE: bastava UMA linha casar para o capítulo passar. Um agente
// cunhou o selo `✓ᵃ` durante a escrita, definiu-o de dois jeitos diferentes
// em dois capítulos, e o gate não viu — porque as outras linhas tinham ✓.
// Agora é allowlist derivada da fonte única, com falha no DESCONHECIDO:
// cunhar selo passa a exigir editar a constituição, que é o ponto.
const CONSTITUICAO = readFileSync(resolve(RAIZ, ".specify/memory/constitution.md"), "utf8");
const SELOS = new Set(
  [...CONSTITUICAO.matchAll(/^\|\s*(✓ᵐ|✓ᵃ|✓|⏳|❌|📖)\s*\|/gm)].map((m) => m[1])
);
if (SELOS.size < 5) {
  console.error("✗ Não consegui ler o alfabeto de selos da constituição (Princípio X).");
  console.error("   O gate do Princípio X depende dessa tabela. Confira .specify/memory/constitution.md");
  process.exit(1);
}
// Qualquer primeira célula de uma linha de tabela que "pareça selo" — símbolo
// curto, não-alfanumérico — mas não esteja no alfabeto.
const RE_LINHA_TABELA = /^\|\s*([^|\s][^|]{0,3}?)\s*\|/gm;
const RE_TABELA_SELOS = new RegExp("^\\|\\s*(" + [...SELOS].join("|") + ")\\s*\\|", "m");
const RE_LEGENDA_PROPRIA = /^[^\n]*\b[Ll]egenda\b[^\n]*(✓ᵃ|✓ᵐ|✓)\s*=/m;

const semHistoria = [], semNivel = [], selosDesconhecidos = [], legendasProprias = [];
for (const i of itens) {
  if (i.metodo === undefined) continue;             // trilhas, aparato: não são capítulos
  const fonte = readFileSync(resolve(RAIZ, i.arquivo), "utf8");
  const nivel = (fonte.match(RE_NIVEL) || [])[1]?.toLowerCase();
  if (!nivel) { semNivel.push(i.arquivo); continue; }
  if (!i.metodo || nivel === "esqueleto") continue;  // dispensados, e declaradamente
  const temSecao = RE_SECAO_HISTORICA.test(fonte);
  const temSelos = RE_TABELA_SELOS.test(fonte);
  if (!temSecao || !temSelos) {
    semHistoria.push(`${i.arquivo} (nível ${nivel})` +
      (temSecao ? " — tem a seção, falta a tabela de selos" : " — falta a seção \"De onde isto veio\""));
    continue;
  }
  // Allowlist, escopada À TABELA DE SELOS. Um capítulo tem outras tabelas —
  // cronologias, comparativos, filas com coluna "#" —, e varrer todas dava
  // falso positivo. O critério: um bloco contíguo de linhas de tabela que
  // contenha ao menos um selo conhecido É a tabela de selos; então TODAS as
  // linhas dele têm de usar o alfabeto.
  for (const bloco of fonte.split(/\n\s*\n/)) {
    const primeiras = [...bloco.matchAll(/^\|\s*([^|\n]*?)\s*\|/gm)].map((m) => m[1]);
    if (!primeiras.some((c) => SELOS.has(c))) continue;   // não é a tabela de selos
    for (const celula of primeiras) {
      if (SELOS.has(celula)) continue;
      if (/^[-:]+$/.test(celula)) continue;               // separador
      if (/^Selo$/i.test(celula)) continue;               // cabeçalho
      selosDesconhecidos.push(`${i.arquivo} — "${celula}" não está no alfabeto da constituição`);
    }
  }
  if (RE_LEGENDA_PROPRIA.test(fonte)) {
    legendasProprias.push(`${i.arquivo} — redefine um selo numa legenda própria`);
  }
}
if (semNivel.length) {
  console.error(`✗ ${semNivel.length} capítulo(s) sem NÍVEL declarado no cabeçalho (dívida D9):`);
  semNivel.forEach((q) => console.error("   " + q));
  console.error('   O leitor tem de saber o que está lendo. Declare: > **Nível: esqueleto|essencial|completo.**');
  process.exit(1);
}
if (selosDesconhecidos.length) {
  console.error(`✗ ${selosDesconhecidos.length} selo(s) fora do alfabeto do Princípio X:`);
  selosDesconhecidos.forEach((q) => console.error("   " + q));
  console.error("   O alfabeto vive na constituição e só lá. Cunhar selo exige emenda (ADR 0005).");
  process.exit(1);
}
if (legendasProprias.length) {
  console.error(`✗ ${legendasProprias.length} capítulo(s) redefinindo selo numa legenda própria:`);
  legendasProprias.forEach((q) => console.error("   " + q));
  console.error("   A definição do selo vive num lugar só: .specify/memory/constitution.md");
  process.exit(1);
}
if (semHistoria.length) {
  console.error(`✗ ${semHistoria.length} capítulo(s) de método sem a seção histórica do Princípio X:`);
  semHistoria.forEach((q) => console.error("   " + q));
  console.error("   Um método sem a história que o forçou a existir é procedimento, e procedimento se decora.");
  console.error("   Saídas: escrever a seção, ou rebaixar o capítulo a `esqueleto` e declarar isso ao leitor.");
  process.exit(1);
}

// Guarda de acentuação dentro de matemática.
// As fontes TeX do MathJax não têm glifos acentuados: `\text{saída}` sai como
// "saí da", com um buraco no lugar do acento. É um erro silencioso — o build
// passa, o SVG existe, e só se vê olhando a página. Num livro em português,
// isso reaparece toda vez que alguém escrever naturalmente. Então falha aqui.
const acentuadoEmMatematica = [];
for (const i of itens) {
  const fonte = readFileSync(resolve(RAIZ, i.arquivo), "utf8")
    .replace(/^(?:```|~~~)[\s\S]*?^(?:```|~~~)[ \t]*$/gm, "");
  // O delimitador em linha espelha a regra do renderizador: `$…$` só é
  // matemática se o conteúdo NÃO começa nem termina com espaço. É o que salva
  // "R$ 200 … R$ 1000" de virar fórmula — e o que impede este guarda de
  // acusar preço em reais, num livro escrito em português.
  for (const m of fonte.matchAll(/\$\$([\s\S]*?)\$\$|\$(?!\s)([^$\n]*[^\s$])\$/g)) {
    const formula = m[1] ?? m[2];
    const achados = [...new Set(formula.match(/[^\x00-\x7F]/g) || [])]
      // θ, λ, Σ e afins são símbolos matemáticos legítimos: o MathJax os tem.
      .filter((c) => !/[Ͱ-Ͽ -⏿←-⇿]/.test(c));
    if (achados.length) acentuadoEmMatematica.push(`${i.arquivo}: ${achados.join(" ")} em  ${formula.trim().slice(0, 60)}…`);
  }
}
if (acentuadoEmMatematica.length) {
  console.error(`✗ ${acentuadoEmMatematica.length} fórmula(s) com caractere acentuado — o MathJax quebra a palavra no acento.`);
  acentuadoEmMatematica.forEach((q) => console.error("   " + q));
  console.error("   Saída: tire a palavra acentuada da fórmula e explique em prosa ao lado.");
  process.exit(1);
}

console.log(`✓ Livro gerado: ${gerados} páginas + capa em docs/ (links internos OK)`);
console.log(`  Interatividade: ${placar.exercicios} exercícios · ${placar.videos} vídeos · ${placar.laboratorios} laboratórios`);
