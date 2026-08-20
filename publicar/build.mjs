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
import { renderizar, extrair, semGabarito } from "./interativos.mjs";
import { verificar as verificarProsa } from "./prosa.mjs";
import { verificar as verificarIntervalos } from "./intervalos.mjs";
import { verificar as verificarTema } from "./gates/tema-unico.mjs";
import { verificar as verificarHtml } from "./gates/html-integro.mjs";

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
// Endereço público do livro. Entra no `og:image` de todas as páginas e no
// cabeçalho da exportação em Markdown. Apontava para o GitHub Pages, que no
// passo 8 do DEPLOY.md passa a servir só um stub de redirecionamento — o
// `capa-social.png` deixa de existir lá, e toda partilha em rede social vira um
// retângulo vazio. Nenhum gate pegaria: a página continua respondendo 200, só a
// prévia quebra, e quem publica o link não vê.
const SITE = "https://machinelearning.ghdaru.com.br/";

// Companion (chat + correção de exercícios + progresso). O gating real é do
// backend; o mapa abaixo é só exibição, e espelha capabilities.py.
const COMPANION_BACKEND = sumario.companion_backend || "";
const COMPANION_CAPS = [
  { chave: "tutor", rotulo: "Tutor do livro", libera: 0 },
  { chave: "busca_livro", rotulo: "Busca no livro", libera: 0 },
  { chave: "exercicios", rotulo: "Correção de exercícios", libera: 0 },
  { chave: "progresso", rotulo: "Seu progresso", libera: 0 },
  { chave: "plano_estudo", rotulo: "Plano de estudo", libera: 0 },
  { chave: "dados", rotulo: "Diagnóstico de dados", libera: 5 },
  { chave: "metricas", rotulo: "Calculadora de métricas", libera: 9 },
  { chave: "matematica", rotulo: "Contas passo a passo", libera: 12 },
];
// O "capítulo" que o companion e a telemetria usam é a POSIÇÃO DE LEITURA
// (1..29), não mais o número do título. Desde a numeração por parte (ADR 0011)
// o título começa com "II.2", e o gating por capítulo precisa de um inteiro
// crescente — que é justamente a ordem em que o leitor chega às capacidades.
const posicaoDe = (item) => itens.findIndex((i) => i.arquivo === item.arquivo) + 1;

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
// O nível declarado no cabeçalho. Lido em dois lugares: aqui, para virar
// selo visível ao leitor; e no gate do Princípio X, lá embaixo.
const RE_NIVEL = /\*\*Nível:\s*(esqueleto|essencial|completo)\.?\*\*/i;
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
  EQM: "Erro Quadrático Médio — o MSE da literatura em inglês", SQE: "Soma dos Quadrados dos Erros",
  EAM: "Erro Absoluto Médio — o MAE da literatura em inglês",
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
  // Aceita a numeração por parte ("II.2", "0.1") e o formato legado ("05").
  // Sem isto o `num` sai vazio, o cabeçalho inteiro do capítulo não é montado —
  // e com ele some o SELO DE NÍVEL, que a constituição manda mostrar ao leitor.
  // Foi exatamente o que o gate da página pegou na migração do ADR 0011.
  const eNumero = /^\s*(?:\d+|[0IVXLC]+\.\d+)\s*$/i.test(p[0]);
  return { num: eNumero ? p[0].trim() : "", texto: p.slice(1).join("—").trim() };
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
  "uso.js", "grafo.js", "professor.js", "laboratorios.js", "neuronio-mp.svg", "camada-escondida.svg", "favicon.svg", "favicon-32.png", "apple-touch-icon.png",
]) {
  cpSync(resolve(AQUI, "tema", arq), resolve(SAIDA, "assets", arq));
}
// Conjuntos de dados que os laboratórios leem no navegador. O laboratório de
// exploração do capítulo I.4 precisa do dado REAL — inventar números tiraria
// dele exatamente o que ensina: as assimetrias e os outliers deste conjunto.
mkdirSync(resolve(SAIDA, "dados"), { recursive: true });
cpSync(resolve(RAIZ, "ml-zero/dados/limonada/limonada.csv"), resolve(SAIDA, "dados/limonada.csv"));

// O TensorFlow Playground, vendorizado (ADR 0018). Vem inteiro porque é uma
// página própria, com CSS, fontes e imagens — servida por nós e não por iframe
// para domínio de terceiro, pelos princípios V (privacidade) e VIII.6 (o
// laboratório funciona com a rede fora do ar). O gate
// `publicar/gates/sem-analytics.mjs` guarda a pasta contra rastreador.
cpSync(resolve(AQUI, "tema", "playground"), resolve(SAIDA, "assets", "playground"),
       { recursive: true });

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
  const cap = posicaoDe(item);
  const data = extrairData(bruto);

  // Contagem para o placar da capa (só o que existe de fato).
  const { exercicios, videos, laboratorios } = extrair(bruto, item.arquivo, cap);
  placar.exercicios += exercicios.length;
  placar.videos += videos.length;
  placar.laboratorios += laboratorios.length;

  // Blocos interativos ANTES do parse: viram HTML puro, sem gabarito.
  //
  // O dedup roda AQUI, e não só na linha de baixo, porque o texto de um
  // exercício é renderizado duas vezes: uma para virar HTML de opção, outra
  // quando a página inteira passa pelo markdown. Fórmula dentro de opção de
  // múltipla escolha nasce embrulhada num `<style>` do MathJax que contém
  // LINHAS EM BRANCO; no segundo passe o markdown lê essas linhas como
  // separador de parágrafo e parte o bloco em `<p>`, de modo que o `</style>`
  // deixa de existir inteiro. O dedup lá de baixo então não casa mais e a
  // página vai ao ar com um `<style>` aberto — do ponto do defeito em diante o
  // navegador trata TUDO como CSS: some o resto dos exercícios, o link do
  // Colab, o companion e o histórico do leitor. Aconteceu no III.1 e no II.7.
  const renderMd = (t) => dedupCssMatematica(md.render(t, { srcDir: dirname(item.arquivo) }));
  const comInterativos = renderizar(bruto, renderMd, item.arquivo, cap);
  let corpo = dedupCssMatematica(marcarCallouts(md.render(comInterativos, { srcDir: dirname(item.arquivo) })));

  let hero = null;
  const { num, texto } = dividirTitulo(item.titulo);
  if (num) {
    placar.capitulos++;
    const { cap: dtCap, rev } = extrairDatas(bruto);
    // O NÍVEL DE MATURIDADE TEM DE CHEGAR AO LEITOR.
    // A constituição exige que um capítulo `esqueleto` ou `essencial` declare
    // isso "em destaque, no próprio cabeçalho" — e durante a v1.0 ele não
    // chegava: a linha vive no primeiro blockquote, e o blockquote inteiro é
    // removido logo abaixo para virar o selo de data. O gate conferia o
    // Markdown, não a página; declarar ao leitor virou promessa sem entrega.
    // Aqui o nível vira selo visível, com a explicação no title.
    const NIVEL_SELO = {
      esqueleto: ["⚠ esqueleto", "Só objetivos e o problema: corpo, prática e fontes ainda não foram escritos."],
      essencial: ["◐ essencial", "Corpo ensinável e prática funcionando. Falta o aprofundamento: experimento próprio, todas as fontes lidas e cláusula de expiração."],
      completo: ["● completo", "Passou pelo portão inteiro: experimento reproduzível, fontes conferidas, expiração declarada e revisão developmental."],
    };
    const nivelCap = (bruto.match(RE_NIVEL) || [])[1]?.toLowerCase();
    const selosNivel = NIVEL_SELO[nivelCap];
    const chips = [
      selosNivel ? `<span class="chip-nivel nivel-${nivelCap}" title="${selosNivel[1]}">${selosNivel[0]}</span>` : "",
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
    // Sem gabarito: o download fica ao lado do exercício, e servir o fonte
    // cru anulava a revelação progressiva que o backend cobra.
    const bruto = semGabarito(readFileSync(caminho, "utf8"));
    writeFileSync(resolve(SAIDA, "md", `${item.slug}.md`), bruto);
    partesMd.push(bruto.trim());
  }
  const cabecalho = `# ${sumario.titulo}\n\n> ${sumario.subtitulo}\n>\n> ${versaoDoLivro()} · fonte: https://github.com/GHDaru/machinelearning · site: ${SITE}\n\n---\n\n`;
  writeFileSync(resolve(SAIDA, "md/machine-learning.md"), cabecalho + partesMd.join("\n\n---\n\n") + "\n");

  // Gate: o download não pode devolver o que a segunda tentativa cobra.
  // Este vazamento existiu de verdade — 79 gabaritos e 30 rubricas no arquivo
  // servido pelo botão "⬇ md", ao lado do exercício. `renderizar()` protegia o
  // HTML e ninguém conferiu a outra porta. O gate confere a porta, não a
  // intenção. Exemplos de sintaxe dentro de cerca são exemplos, e passam.
  const VAZAMENTO = /^(?:>\s*\*\*(?:gabarito|porque|rubrica)\s*:\*\*|[-*]\s+\[x\])/i;
  const vazados = [];
  for (const item of itens) {
    const arq = resolve(SAIDA, "md", `${item.slug}.md`);
    if (!existsSync(arq)) continue;
    let emCerca = false;
    readFileSync(arq, "utf8").split("\n").forEach((linha, i) => {
      if (/^(?:```|~~~)/.test(linha)) emCerca = !emCerca;
      else if (!emCerca && VAZAMENTO.test(linha)) vazados.push(`docs/md/${item.slug}.md:${i + 1} — ${linha.trim().slice(0, 60)}`);
    });
  }
  if (vazados.length) {
    console.error(`✗ ${vazados.length} resposta(s) vazando no Markdown exportado:`);
    vazados.forEach((v) => console.error("   " + v));
    console.error("   O botão de download fica ao lado do exercício. Use semGabarito() na exportação.");
    process.exit(1);
  }
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
  ["0-2-fundamentos.html", "Trilha · 1", "Entender", "Generalização, viés e variância: o problema central."],
  ["ii-1-avaliacao.html", "Trilha · 2", "Medir", "O que significa &quot;bom&quot; — e por que acurácia mente."],
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

// ---- Endereços aposentados pela renumeração (ADR 0011) ----
//
// O ADR aceitou quebrar os endereços antigos, e a conta chegou depois: link de
// slide, de PDF de aula, do Moodle e de favorito de aluno passaram a dar 404 no
// meio do semestre. O ADR decidiu a numeração; ele não obrigava a abandonar
// quem já tinha o link.
//
// Stub em HTML, e não redirecionamento de servidor, por um motivo concreto: o
// livro é servido em DOIS lugares (o domínio próprio e o GitHub Pages, até o
// passo 8 da migração), e um arquivo funciona nos dois. Configuração de
// provedor funcionaria em um só.
const { rotas: ROTAS_ANTIGAS } = JSON.parse(
  readFileSync(resolve(AQUI, "redirecionamentos.json"), "utf8"));

const stubRedirecionamento = (de, para) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Este capítulo mudou de endereço</title>
<link rel="canonical" href="${SITE}${para}.html">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${para}.html">
<style>body{font-family:system-ui,sans-serif;max-width:34rem;margin:20vh auto;padding:0 1.5rem;line-height:1.6}</style>
</head>
<body>
<h1>Este capítulo mudou de endereço</h1>
<p>O livro passou a numerar os capítulos por parte. <code>${de}</code> agora é <code>${para}</code>.</p>
<p><a id="ir" href="${para}.html">Ir para o capítulo →</a></p>
<script>
// A âncora e a query importam: um link de aula costuma apontar para a SEÇÃO
// ("#o-caso-da-limonada"), e o meta refresh sozinho as descartaria.
(function () {
  var destino = ${JSON.stringify(para)} + ".html" + location.search + location.hash;
  document.getElementById("ir").href = destino;
  location.replace(destino);
})();
</script>
</body>
</html>
`;

// Portão de qualidade: todo link interno .html aponta para página existente.
// ---------------------------------------------------------------- turma.html
//
// A bancada do professor (ADR 0021). Fica FORA do `sumario.json` de propósito:
// todo item do sumário entra na barra lateral das 80 páginas, e uma linha
// "Quadro da turma" ali convidaria aluno a cutucar a porta e confundiria quem
// não é da disciplina. Isso é higiene, não segurança — a URL é pública e
// adivinhável, e quem protege é o token conferido no servidor.
//
// A página vai ao ar SEM NENHUM DADO dentro: nome, matrícula e nota vêm por
// requisição autenticada. É o que torna verdadeira a frase "a página é pública
// e mesmo assim não vaza nada".
writeFileSync(
  resolve(SAIDA, "turma.html"),
  pagina({
    tituloPagina: "Quadro da turma",
    corpo: '<div data-viz="turma"></div>',
    navLateral: "",
    prev: null,
    next: null,
    data: null,
    slug: "turma",
  }).replace("</head>", '  <meta name="robots" content="noindex">\n</head>')
     .replace("</body>", '<script src="' + A + 'professor.js" defer></script>\n</body>'),
);

const paginas = new Set(itens.map((i) => `${i.slug}.html`).concat("index.html", "sumario.html"));
// Escreve os stubs, com dois gates. O primeiro impede o pior caso possível:
// um "antigo" que hoje é o slug de um capítulo de verdade — o stub sobrescreveria
// o capítulo e o livro perderia uma página inteira para um redirecionamento.
const rotasRuins = [];
for (const [de, para] of Object.entries(ROTAS_ANTIGAS)) {
  if (paginas.has(`${de}.html`)) rotasRuins.push(`"${de}" é uma página VIVA — o stub a apagaria`);
  else if (!paginas.has(`${para}.html`)) rotasRuins.push(`"${de}" aponta para "${para}", que não existe`);
}
if (rotasRuins.length) {
  console.error(`✗ ${rotasRuins.length} rota(s) de redirecionamento inválida(s):`);
  rotasRuins.forEach((r) => console.error("   " + r));
  process.exit(1);
}
for (const [de, para] of Object.entries(ROTAS_ANTIGAS)) {
  writeFileSync(resolve(SAIDA, `${de}.html`), stubRedirecionamento(de, para));
}

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

  // EXIGIR a seção histórica só vale para capítulo de método fora de esqueleto.
  if (i.metodo && nivel !== "esqueleto") {
    const temSecao = RE_SECAO_HISTORICA.test(fonte);
    const temSelos = RE_TABELA_SELOS.test(fonte);
    if (!temSecao || !temSelos) {
      semHistoria.push(`${i.arquivo} (nível ${nivel})` +
        (temSecao ? " — tem a seção, falta a tabela de selos" : " — falta a seção \"De onde isto veio\""));
      continue;
    }
  }

  // VALIDAR os selos vale para TODO capítulo que tenha tabela de selos, método
  // ou não. O capítulo V.4 é não-método e mesmo assim sela afirmações — e a
  // primeira versão deste gate o pulava inteiro, deixando um buraco por onde
  // um selo inventado passaria. Dispensa da seção não é dispensa do alfabeto.
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

// O NÍVEL TEM DE CHEGAR À PÁGINA, não só ao Markdown.
// Este gate existe porque o anterior não bastava: ele conferia a declaração no
// arquivo-fonte, e o nível ficou INVISÍVEL ao leitor durante toda a v1.0 —
// a linha vive no primeiro blockquote, que o motor remove para virar o selo de
// data. Declarar ao leitor virou promessa sem entrega, e nenhum teste viu.
// Lição: gate que confere a ENTRADA não prova nada sobre a SAÍDA.
const semSeloNaPagina = [];
for (const i of itens) {
  if (i.metodo === undefined) continue;
  const html = readFileSync(resolve(SAIDA, `${i.slug}.html`), "utf8");
  if (!/class="chip-nivel/.test(html)) semSeloNaPagina.push(`${i.slug}.html`);
}
if (semSeloNaPagina.length) {
  console.error(`✗ ${semSeloNaPagina.length} página(s) sem o selo de nível visível ao leitor:`);
  semSeloNaPagina.forEach((q) => console.error("   " + q));
  console.error("   A constituição exige que o nível seja declarado ao LEITOR, em destaque.");
  process.exit(1);
}

// ---- O esqueleto v5 é obrigatório, e agora é cobrado ----
// "Fundamentos científicos" e "Fontes da indústria" desapareceram do livro sem
// que ninguém notasse — a primeira caiu para 1 capítulo em 29, a segunda para
// zero — porque o esqueleto vivia só na prosa do Guia Editorial. Regra que só
// existe em prosa é regra que se esquece na terceira semana.
// As cinco abaixo são as que o nível `essencial` garante (ADR 0004). As que
// esperam o `completo` não entram aqui: seriam dívida cobrada antes da hora.
const SECOES_OBRIGATORIAS = [
  { chave: "Objetivos de aprendizagem", re: /^##\s+Objetivos de aprendizagem/im, metodo: false },
  { chave: "O problema", re: /^##\s+O problema/im, metodo: false },
  { chave: "De onde isto veio", re: /^##\s+De onde isto veio/im, metodo: true },
  { chave: "Síntese", re: /^##\s+S[íi]ntese/im, metodo: false },
  { chave: "Verificação", re: /^##\s+Verifica[çc][ãa]o/im, metodo: false },
];
// Bloom: verbo que não se verifica não é objetivo. Nenhum capítulo usa hoje —
// o gate existe para que continue assim. Tabela de verbos no Guia Editorial §2.5.
const VERBOS_VAGOS = /\*\*O\d+\.?\*\*\s+(entender|compreender|conhecer|saber|dominar|familiarizar|ter no[çc][ãa]o|aprender sobre)\b/i;

const faltandoSecao = [];
const verbosVagos = [];
for (const i of itens) {
  if (i.metodo === undefined) continue;
  const caminho = resolve(RAIZ, i.arquivo);
  if (!existsSync(caminho)) continue;
  const fonte = readFileSync(caminho, "utf8");
  for (const sec of SECOES_OBRIGATORIAS) {
    if (sec.metodo && !i.metodo) continue;
    if (!sec.re.test(fonte)) faltandoSecao.push(`${i.arquivo} -> "## ${sec.chave}"`);
  }
  const vago = fonte.match(VERBOS_VAGOS);
  if (vago) verbosVagos.push(`${i.arquivo} -> "${vago[1]}"`);
}
if (faltandoSecao.length || verbosVagos.length) {
  if (faltandoSecao.length) {
    console.error(`✗ ${faltandoSecao.length} seção(ões) obrigatória(s) do esqueleto v5 faltando:`);
    faltandoSecao.forEach((q) => console.error("   " + q));
  }
  if (verbosVagos.length) {
    console.error(`✗ ${verbosVagos.length} objetivo(s) com verbo não verificável:`);
    verbosVagos.forEach((q) => console.error("   " + q));
    console.error('   Troque por um verbo de Bloom que se possa cobrar (Guia Editorial §2.5).');
  }
  process.exit(1);
}

// O "volte para:" de cada exercício devolve o leitor à âncora exata da seção
// que ele precisa reler — o Guia Editorial o chama de "o gesto mais útil do
// livro". Uma âncora que não existe leva a lugar nenhum, silenciosamente: a
// página abre, o navegador não rola, e o leitor acha que a culpa é dele.
// Duas estavam quebradas quando este gate foi escrito, uma delas há semanas.
const ancorasRuins = [];
for (const i of itens) {
  const caminho = resolve(RAIZ, i.arquivo);
  if (!existsSync(caminho)) continue;
  const fonte = readFileSync(caminho, "utf8");
  const titulos = new Set(
    [...fonte.matchAll(/^#{1,4}\s+(.+)$/gm)].map((m) =>
      m[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")));
  for (const m of fonte.matchAll(/\*\*volte para:\*\*\s*#([a-z0-9-]+)/g)) {
    if (!titulos.has(m[1])) ancorasRuins.push(`${i.arquivo} -> #${m[1]}`);
  }
}
if (ancorasRuins.length) {
  console.error(`✗ ${ancorasRuins.length} âncora(s) "volte para" apontando para seção inexistente:`);
  ancorasRuins.forEach((q) => console.error("   " + q));
  process.exit(1);
}

// Prosa amontoada (ADR 0013). Não é o travessão que incomoda: é a frase com
// dois e o parágrafo com quatro negritos.
const prosaRuim = verificarProsa(itens.map((i) => i.arquivo));
if (prosaRuim.length) {
  console.error(`✗ ${prosaRuim.length} problema(s) de prosa (ADR 0013):`);
  prosaRuim.slice(0, 20).forEach((q) => console.error("   " + q));
  if (prosaRuim.length > 20) console.error(`   … e mais ${prosaRuim.length - 20}`);
  process.exit(1);
}

// Intervalos citados entre capítulos. Um capítulo é dono de dois anos; os
// outros citam a diferença. Aqui a diferença é calculada, nunca lida.
const intervalosRuins = verificarIntervalos();
if (intervalosRuins.length) {
  console.error(`✗ ${intervalosRuins.length} intervalo(s) citado(s) fora da conta:`);
  intervalosRuins.forEach((q) => console.error("   " + q));
  process.exit(1);
}

// A chave do tema é uma só. Seletor escrito no vocabulário errado não pinta e
// não reclama — quem descobre é o leitor, com o painel branco numa página escura.
const temaRuim = verificarTema();
if (temaRuim.length) {
  console.error(`✗ ${temaRuim.length} problema(s) de tema:`);
  temaRuim.forEach((q) => console.error("   " + q));
  process.exit(1);
}

// Integridade do HTML **gerado**. Todos os outros gates leem a fonte; este lê o
// produto, que é o que chega ao leitor. Roda por último, com as páginas já
// escritas em docs/.
const htmlRompido = verificarHtml();
if (htmlRompido.length) {
  console.error(`✗ ${htmlRompido.length} página(s) com HTML rompido:`);
  htmlRompido.forEach((q) => console.error("   " + q));
  process.exit(1);
}

console.log(`✓ Livro gerado: ${gerados} páginas + capa em docs/ (links internos OK)`);
console.log(`  Interatividade: ${placar.exercicios} exercícios · ${placar.videos} vídeos · ${placar.laboratorios} laboratórios`);
