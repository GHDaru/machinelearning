// AUDITORIA DA JORNADA — o único verificador que lê a página como o leitor lê.
//
// POR QUE ELE EXISTE
//
// Todos os outros gates deste repositório leem a **fonte**: a prosa, o banco de
// exercícios, os links, os intervalos, o tema, o HTML como texto. Nenhum abria a
// página. Dois defeitos passaram por essa porta no mesmo dia, os dois com CI
// verde e os dois achados pelo autor no celular, não pelo build:
//
//   1. um `<style>` sem fecho no III.1 e no II.7. Os bytes estavam todos lá — um
//      `grep` contava doze exercícios — e o navegador montava **três**, porque
//      tratava o resto da página como CSS. Sumiam o Colab, os laboratórios e o
//      companion;
//   2. o painel do laboratório novo empurrando o documento para 592px num visor
//      de 360, o que cortava **todo** o texto do capítulo na margem direita.
//
// Nos dois casos a lição é a mesma: contar caractere não é ler página. Este
// script abre cada página num Chromium de verdade, deixa o JavaScript rodar, e
// afirma o que o leitor vê.
//
// O QUE ELE COBRA, por página
//
//   A. **Não rola de lado a 360px.** Elemento pode passar da borda desde que
//      esteja dentro de um contêiner que role sozinho; o que não se admite é a
//      PÁGINA rolar, porque aí o texto inteiro é diagramado fora da tela.
//   B. **Os exercícios do fonte chegam ao DOM.** Conta os blocos `:::exercicio`
//      do Markdown e exige o mesmo número de `.exercicio` montados. É a asserção
//      que teria pego o defeito 1 no dia em que ele nasceu.
//   C. **Todo laboratório monta alguma coisa** — canvas, svg, tabela ou botão.
//      Laboratório que não monta é uma caixa vazia com um título.
//   D. **O companion está no DOM.**
//   E. **Nenhum erro de JavaScript no console.**
//   F. **As interações do fonte montam, e a que bloqueia bloqueia mesmo.** Conta
//      os blocos `:::interacao` do Markdown e exige o mesmo número de
//      `.interacao` no DOM; exige que cada uma tenha botão, `role="status"` e um
//      controle onde responder; e então **clica em revelar sem responder nada** e
//      afirma que a revelação NÃO aconteceu e que a página disse por quê.
//
//      Esta última é a razão de F existir. O bloqueio do `prever` é a peça em que
//      a evidência do método se apoia — resolver antes de explicar só rende
//      quando a explicação vem DEPOIS da tentativa —, e ele estava afirmado em
//      dois lugares que não são o navegador: `publicar/testes/interacoes.mjs`, num
//      DOM falso, e um script de rascunho fora do repositório. Um DOM falso não
//      tem `disabled`, não tem foco e não tem tabulação; foi exatamente aí que
//      um `aria-disabled` passou, deixando o botão inalcançável para leitor de
//      tela sem que teste nenhum reclamasse. Afirmação que o leitor sente tem de
//      ser afirmada onde o leitor está.
//   G. **Nenhuma fórmula termina cortada na margem.** Para cada `mjx-container`,
//      exige `scrollWidth <= clientWidth`. A dívida conhecida está declarada em
//      `FORMULA_CORTADA_PENDENTE`, e a lista falha nas DUAS direções.
//
//      G mede também a fórmula dentro de um `<details>` fechado, que é onde o
//      `:::aprofundar` guarda a dedução. Ela abre cada bloco, mede e o devolve
//      ao estado anterior — não porque o Chromium de hoje esconda a geometria
//      (ele não esconde, foi medido), mas porque `content-visibility: hidden`
//      não promete devolvê-la, e um gate que depende de gentileza do navegador
//      estreita sozinho no dia em que ela acaba.
//
//      G existe porque A não a pega, e não por descuido de A: a fórmula mora num
//      contêiner com `overflow-x: auto` (tema/estilo.css), e A dispensa de
//      propósito quem está dentro de um contêiner que rola sozinho, porque o que
//      A protege é o texto do capítulo não ser diagramado fora da tela. As duas
//      restrições são diferentes: A cuida do LAYOUT, G cuida da LEITURA.
//
//      O defeito que a separou é a D21 do ROADMAP, medida num Chromium a 360px:
//      no II.2, duas fórmulas da dedução mediam 408px e 445px num espaço de
//      322px, e o leitor via a expressão terminar em `= 0 =` no nada. A auditoria
//      passava verde. Rolagem existia; **aviso de que havia rolagem, não** — o
//      Chromium móvel desenha barra sobreposta, que só aparece depois do gesto
//      que o leitor não sabe que precisa fazer.
//
//      O conserto adotado foi QUEBRAR a fórmula em duas linhas, e não anunciar a
//      rolagem, por uma razão medida no próprio tema: com o modo cartão ligado,
//      `tema/cartoes.js` liga ArrowLeft e ArrowRight à troca de cartão para tudo
//      que não seja INPUT, TEXTAREA ou SELECT. O eixo horizontal já está tomado
//      pelo baralho, e uma fórmula que só se lê rolando de lado disputa com ele o
//      mesmo gesto. Por isso G cobra ausência de corte, e não presença de dica.
//
//   H. **Nenhuma sigla conhecida chega nua ao leitor.** Para cada sigla do
//      dicionário `publicar/siglas.mjs`, exige que toda ocorrência em texto
//      visível esteja dentro de um `<abbr>`. É o Princípio VIII cobrado onde o
//      leitor está, e não no Markdown.
//
//      H existe por causa da D24 do ROADMAP, medida em 2026-09-04. O motor
//      embrulhava a sigla, e o embrulho parava na primeira alternativa de
//      exercício de cada página: `<input>` é elemento vazio, o contador de
//      proteção de `abrirSiglas` subia com ele e nunca descia. O II.2 tinha
//      zero `<abbr>` na página inteira e usava "AUC" quatro vezes sem expandir
//      nenhuma. Nenhum gate via isso, porque todos liam a fonte.
//
//      A segunda ordem é o que torna H obrigatória: o gate do glossário dispensa
//      as siglas de propósito, escrevendo que "o motor já a embrulha em `<abbr>`".
//      A isenção de um gate estava apoiada num mecanismo que ninguém media. H é
//      quem passa a medi-lo.
//
//      O QUE H NÃO COBRA, e por quê. Sigla dentro de `code`, `pre`, `a`,
//      cabeçalho ou `textarea` fica de fora: o motor não embrulha nenhum desses
//      de propósito (ver `TAGS_PROT` em `publicar/siglas.mjs`), e cobrar aqui o
//      que o motor recusa lá seria pedir ao autor um conserto impossível. A
//      página `glossario.html` fica inteira de fora: ela É a tabela de
//      expansões, e embrulhar a expansão na própria expansão é circular.
//
// COMO RODAR
//
//   npm i -D playwright && npx playwright install chromium   (uma vez)
//   node publicar/build.mjs && node publicar/jornada.mjs
//
// O Playwright NÃO é dependência do repositório: baixar um navegador custa uns
// 150 MB, e a constituição pede trilha de custo zero. Por isso este script falha
// com uma mensagem explicando o que instalar, em vez de se pular em silêncio —
// gate que se pula sozinho é gate que não existe.
//
// Variáveis: PORTA (padrão 8123), LARGURA (padrão 360), SO_ESTAS=a,b (limita a
// varredura a algumas páginas, por nome de arquivo).

import { readdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { SIGLAS } from "./siglas.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = resolve(RAIZ, "docs");
const CAPS = resolve(RAIZ, "livro");
const PORTA = Number(process.env.PORTA || 8123);
const LARGURA = Number(process.env.LARGURA || 360);

// `NODE_PATH` não vale para `import()` em ESM, então quem tem o Playwright
// instalado fora do projeto aponta o caminho em PLAYWRIGHT=/.../playwright.
let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright"));
} catch {
  console.error("✗ A auditoria da jornada precisa do Playwright, que não é dependência deste repositório.");
  console.error("   npm i -D playwright && npx playwright install chromium");
  console.error("   (o navegador pesa ~150 MB; por isso ele não entra no clone de quem só quer ler o livro)");
  process.exit(2);
}

const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
                ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json",
                ".woff2": "font/woff2", ".ico": "image/x-icon" };

const servidor = createServer((req, res) => {
  const caminho = decodeURIComponent(req.url.split("?")[0]);
  const alvo = join(DOCS, caminho === "/" ? "index.html" : caminho);
  if (!alvo.startsWith(DOCS)) { res.writeHead(403).end(); return; }
  try {
    const corpo = readFileSync(alvo);
    res.writeHead(200, { "Content-Type": TIPOS[extname(alvo)] || "application/octet-stream" });
    res.end(corpo);
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(PORTA, "127.0.0.1", ok));

/** Quantos blocos `:::exercicio` o Markdown desta página declara.
 *  A ligação página → fonte é pelo nome do arquivo, que o motor preserva: um
 *  `.md` em qualquer subpasta de `livro/` vira `docs/<mesmo-nome>.html`. Página
 *  sem fonte correspondente, como a capa e o índice, dispensa a checagem B em
 *  vez de inventá-la. */
const FONTES = new Map();
(function indexar(dir) {
  for (const nome of readdirSync(dir, { withFileTypes: true })) {
    const alvo = join(dir, nome.name);
    if (nome.isDirectory()) indexar(alvo);
    else if (nome.name.endsWith(".md")) FONTES.set(nome.name.replace(/\.md$/, "").toLowerCase(), alvo);
  }
})(CAPS);

function blocosNoFonte(nomeHtml, tipo) {
  const arq = FONTES.get(nomeHtml.replace(/\.html$/, "").toLowerCase());
  if (!arq) return null;
  // Fora as cercas de código, senão o BANCO-DE-EXERCICIOS.md — que ENSINA a
  // sintaxe mostrando blocos de exemplo — é acusado de perder três exercícios
  // que nunca foram exercícios. Foi a primeira coisa que esta auditoria
  // encontrou, e o defeito era do medidor.
  const fonte = readFileSync(arq, "utf8")
    .replace(/^(?:```|~~~)[\s\S]*?^(?:```|~~~)[ \t]*$/gm, "");
  return (fonte.match(new RegExp("^:::" + tipo, "gm")) || []).length;
}

// A DÍVIDA DE FÓRMULA CORTADA — cobrada, não apenas registrada.
//
// Espelha o `PROSA_PENDENTE` de `publicar/prosa.mjs`, inclusive no que ele tem de
// desconfortável: a lista falha nas DUAS direções. Fórmula nova que corta quebra
// o gate; página que se limpou e continua aqui também. Dívida paga que fica na
// lista vira um teto por baixo do qual um corte novo entra sem ninguém ver — que
// é a classe de defeito que criou esta asserção.
//
// Medido em 2026-09-01, num Chromium a 360px, depois de o II.2 ser consertado.
// Página que não está aqui tem de estar em zero.
export const FORMULA_CORTADA_PENDENTE = new Map([
  ["ii-3-regressao-logistica", 1],
  ["ii-5-arvores-ensembles", 1],
  ["iii-1-neuronio-artificial", 1],
  ["iii-2-redes-neurais", 8],
  ["iv-2-reforco", 1],
]);

// A DÍVIDA DE SIGLA NUA, na mesma disciplina da de cima: falha nas DUAS
// direções. Página que passa a deixar sigla nua quebra o gate; página que se
// limpou e continua declarada aqui também.
//
// O QUE SOBROU, medido em 2026-09-04 num Chromium a 360px, depois de o
// `abrirSiglas` ser consertado. No HTML que o motor escreve a conta foi a zero
// nos 27 capítulos, porque o defeito era do motor e não do texto. As 14
// ocorrências abaixo têm outra origem: elas são escritas pelo NAVEGADOR, por
// `publicar/tema/laboratorios.js`, depois que a página carrega — o cabeçalho
// "IQR" da tabela do boxplot, a linha "SQE" do painel de perda, o "AUC 0.65" do
// mostrador de vazamento. Nenhuma delas passa pelo motor, e nenhuma edição de
// capítulo as alcança.
//
// Por que não estão consertadas nesta rodada, dito em voz alta: o conserto certo
// é levar o dicionário `siglas.mjs` para dentro do tema e reabrir a sigla depois
// de cada desenho do laboratório. Isso é um segundo passe, em código que
// reescreve o próprio texto a cada movimento de alça, e um passe que se dispara
// nas próprias alterações precisa de guarda contra laço. Escrever a expansão à
// mão no `laboratorios.js` resolveria a tela e criaria uma segunda cópia do
// dicionário, que é exatamente o que o módulo de siglas existe para evitar.
//
// Por isso a dívida fica declarada, com número por página, em vez de a asserção
// dispensar `.lab-area` em silêncio: dispensa não tem prazo, dívida tem conta.
export const SIGLA_NUA_PENDENTE = new Map([
  ["i-1-ciclo-ciencia-de-dados", 1],
  ["i-4-analise-exploratoria", 3],
  ["ii-1-avaliacao", 3],
  ["ii-2-modelos-lineares", 5],
  ["ii-7-series-temporais", 2],
]);

// A ÚNICA PÁGINA DISPENSADA, e o motivo dela é o mesmo que o motor já aplica:
// `build.mjs` não passa o glossário por `abrirSiglas`. O glossário é a tabela
// que DEFINE as siglas, e embrulhar "MSE" num `title` que diz "MSE" é circular.
const PAGINAS_SEM_SIGLA = new Set(["glossario.html"]);

// Ordenada da mais longa para a mais curta, como no motor: sem isso "ML" casaria
// dentro de "MLOps" antes de "MLOps" ter chance.
const CHAVES_SIGLA = Object.keys(SIGLAS).sort((a, b) => b.length - a.length);

const paginas = (process.env.SO_ESTAS
  ? process.env.SO_ESTAS.split(",").map((s) => (s.endsWith(".html") ? s : s + ".html"))
  : readdirSync(DOCS).filter((n) => n.endsWith(".html"))).sort();

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
  args: ["--no-proxy-server"],
});
const aba = await navegador.newPage({ viewport: { width: LARGURA, height: 800 } });

const falhas = [];
let comExercicios = 0;
let comInteracoes = 0;
let comFormulas = 0, redirecionadas = 0, formulasCortadasTotal = 0, dividaDeclarada = 0;
let comSiglas = 0, siglasAbertasTotal = 0, siglasNuasTotal = 0, dividaDeSigla = 0;
const errosJs = [];
aba.on("pageerror", (e) => errosJs.push(String(e).slice(0, 140)));
aba.on("console", (m) => { if (m.type() === "error" && !/ERR_CERT|ERR_NAME|ERR_CONNECTION/.test(m.text())) errosJs.push(m.text().slice(0, 140)); });

for (const nome of paginas) {
  errosJs.length = 0;
  await aba.goto(`http://127.0.0.1:${PORTA}/${nome}`, { waitUntil: "load" });
  await aba.waitForTimeout(250);

  const visto = await aba.evaluate((chaves) => {
    const W = window.innerWidth;
    const dentroDeRolagem = (e) => {
      for (let a = e.parentElement; a; a = a.parentElement) {
        const o = getComputedStyle(a).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden") return true;
      }
      return false;
    };
    // A lê a página INTOCADA, e é por isso que ela vem antes de qualquer
    // abertura de bloco: o que A protege é o layout que o leitor recebe.
    const estouram = [...document.querySelectorAll("body *")]
      .filter((e) => e.getBoundingClientRect().right > W + 1 && !dentroDeRolagem(e))
      .slice(0, 3)
      .map((e) => e.tagName + (e.className ? "." + String(e.className).split(" ")[0] : ""));

    // G MEDE TAMBÉM O QUE ESTÁ FECHADO, e o motivo é o `:::aprofundar`: a
    // dedução passou a morar num `<details>` fechado, e é ela quem mais corta.
    //
    // O que foi medido, e não presumido: num Chromium 141, uma fórmula dentro de
    // um `<details>` FECHADO ainda devolve geometria real (551 px de conteúdo
    // numa caixa de 281 px), então G já a via sem esta abertura. Só que essa
    // leitura é um efeito colateral: `content-visibility: hidden` diz que o
    // conteúdo é PULADO, e o navegador o dispõe por gentileza, ao ser
    // perguntado. No dia em que ele parar, a fórmula escondida mediria 0 contra
    // 0 e passaria por não existir — o gate estreitaria sozinho, em silêncio, e
    // logo sobre a dívida que ele nasceu para cobrar (D21). Abrir custa três
    // linhas e não muda número nenhum hoje. Cada bloco volta ao estado anterior.
    const fechados = [...document.querySelectorAll("details:not([open])")];
    fechados.forEach((d) => d.setAttribute("open", ""));
    const formulasCortadas = [...document.querySelectorAll("mjx-container")]
      .filter((e) => e.scrollWidth > e.clientWidth + 1)
      .map((e) => ({ sw: e.scrollWidth, cw: e.clientWidth,
                     tex: (e.textContent || "").trim().slice(0, 46) }));
    fechados.forEach((d) => d.removeAttribute("open"));

    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewport: W,
      estouram,
      // G: a fórmula está dentro de um contêiner que rola, então ela escapa de
      // A por construção. O que se mede aqui é outra coisa: o conteúdo dela cabe
      // na caixa em que ela é DESENHADA? Não cabendo, a expressão termina na
      // margem, e no Chromium móvel nem barra aparece antes do gesto.
      formulasCortadas,
      exercicios: document.querySelectorAll(".exercicio").length,
      labsVazios: [...document.querySelectorAll("[data-lab]")]
        .filter((e) => !e.querySelector("canvas, svg, table, button"))
        .map((e) => e.getAttribute("data-lab")),
      companion: !!document.querySelector(".cmp"),
      // H — sigla nua no texto que o leitor lê.
      //
      // "Visível" aqui é o texto do DOCUMENTO, e não o que cabe na tela agora.
      // No modo cartão o leitor vê um cartão por vez, e medir por visibilidade
      // computada dispensaria 38 dos 39 cartões do II.2 sem dizer nada. O
      // conteúdo de `<template>` entra pelo mesmo motivo ao contrário: ele ainda
      // não está na tela, mas é a revelação da interação, e chega ao leitor no
      // clique dele.
      siglasNuas: (() => {
        const re = new RegExp("\\b(" + chaves.join("|") + ")\\b", "g");
        const PROT = "pre, code, a, abbr, h1, h2, h3, h4, h5, h6, script, style, textarea";
        const achados = [];
        const varrer = (raiz) => {
          const passo = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
          for (let n = passo.nextNode(); n; n = passo.nextNode()) {
            const pai = n.parentElement;
            if (!pai || pai.closest(PROT)) continue;
            const texto = n.nodeValue || "";
            re.lastIndex = 0;
            let m;
            while ((m = re.exec(texto))) {
              achados.push({ sigla: m[1], ctx: texto.replace(/\s+/g, " ").trim().slice(0, 60) });
            }
          }
        };
        varrer(document.body);
        for (const t of document.querySelectorAll("template")) varrer(t.content);
        return achados;
      })(),
      siglasAbertas: document.querySelectorAll("abbr[title]").length,
    };
  }, CHAVES_SIGLA);

  // F roda numa segunda passada porque ela CLICA: separar deixa claro que a
  // primeira leitura enxergou a página intocada.
  const ias = await aba.evaluate(() => {
    const nomeDe = (s) => s.getAttribute("data-interacao") || "(interação sem id)";
    const secoes = [...document.querySelectorAll(".interacao")];
    const incompletas = [], vazaram = [], mudas = [];
    for (const sec of secoes) {
      const botao = sec.querySelector(".ia-revelar");
      const status = sec.querySelector(".ia-status");
      const controle = sec.querySelector(".ia-livre, .ia-num, .ia-opcao, .ia-branco");
      if (!botao || !status || !controle) { incompletas.push(nomeDe(sec)); continue; }
      // Clicar por `evaluate` e não pelo Playwright é deliberado: o cartão pode
      // estar `hidden` (só um aparece por vez) e o Playwright, com razão, recusa
      // clicar no que não se vê. Aqui o alvo da asserção é a regra, não o
      // acerto do ponteiro — a visibilidade quem cobra é a asserção A.
      botao.click();
      if (sec.getAttribute("data-revelado") === "true") vazaram.push(nomeDe(sec));
      else if (!(status.textContent || "").trim()) mudas.push(nomeDe(sec));
    }
    return { montadas: secoes.length, incompletas, vazaram, mudas };
  });

  const noFonte = blocosNoFonte(nome, "exercicio");
  const iasNoFonte = blocosNoFonte(nome, "interacao");

  if (visto.scrollWidth > visto.viewport + 1) {
    falhas.push(`${nome} · A · rola de lado: ${visto.scrollWidth}px num visor de ${visto.viewport}px` +
                (visto.estouram.length ? ` — quem estoura: ${visto.estouram.join(", ")}` : ""));
  }
  if (noFonte !== null) {
    comExercicios++;
    if (noFonte !== visto.exercicios) {
      falhas.push(`${nome} · B · o fonte declara ${noFonte} exercício(s) e o navegador montou ${visto.exercicios}`);
    }
  }
  if (visto.labsVazios.length) {
    falhas.push(`${nome} · C · laboratório(s) sem nada montado: ${visto.labsVazios.join(", ")}`);
  }
  if (!visto.companion) falhas.push(`${nome} · D · companion ausente do DOM`);
  if (errosJs.length) falhas.push(`${nome} · E · erro de JavaScript: ${errosJs[0]}`);

  if (iasNoFonte !== null) {
    comInteracoes += ias.montadas;
    if (iasNoFonte !== ias.montadas) {
      falhas.push(`${nome} · F · o fonte declara ${iasNoFonte} interação(ões) e o navegador montou ${ias.montadas}`);
    }
  }
  if (ias.incompletas.length) {
    falhas.push(`${nome} · F · interação sem botão, sem status ou sem onde responder: ${ias.incompletas.join(", ")}`);
  }
  if (ias.vazaram.length) {
    falhas.push(`${nome} · F · revelou sem o leitor ter respondido — ${ias.vazaram.join(", ")}. ` +
                `A explicação tem de vir DEPOIS da tentativa; revelada antes, ela vira texto lido.`);
  }
  if (ias.mudas.length) {
    falhas.push(`${nome} · F · bloqueou a revelação e não disse por quê: ${ias.mudas.join(", ")}. ` +
                `Botão que não responde e não explica é botão quebrado, para o leitor.`);
  }

  // G — fórmula cortada na margem.
  //
  // Stub de redirecionamento não entra: ele carrega, o `meta refresh` leva o
  // navegador ao capítulo de destino, e o que se mediria aqui seria o destino
  // outra vez, com outro nome. Contar duas vezes a mesma fórmula obrigaria a
  // dívida a declarar o mesmo número em dois lugares, e o segundo envelheceria
  // calado. O destino é medido no turno dele.
  const caminhoFinal = new URL(aba.url()).pathname.replace(/^\//, "");
  if (caminhoFinal !== nome) {
    redirecionadas++;
  } else {
    comFormulas++;
    const cortadas = visto.formulasCortadas;
    const previsto = FORMULA_CORTADA_PENDENTE.get(nome.replace(/\.html$/, "")) || 0;
    formulasCortadasTotal += cortadas.length;
    dividaDeclarada += previsto;
    if (cortadas.length > previsto) {
      const amostra = cortadas.slice(0, 3)
        .map((f) => `${f.sw}px num espaço de ${f.cw}px ("${f.tex}…")`).join("; ");
      falhas.push(`${nome} · G · ${cortadas.length} fórmula(s) terminam cortadas na margem ` +
                  `(a dívida declarada é ${previsto}): ${amostra}. ` +
                  `Quebre a fórmula em duas linhas — o eixo horizontal já é do baralho.`);
    } else if (cortadas.length < previsto) {
      falhas.push(`${nome} · G · a dívida declara ${previsto} fórmula(s) cortada(s) e há ${cortadas.length}: ` +
                  `atualize FORMULA_CORTADA_PENDENTE (publicar/jornada.mjs). ` +
                  `Dívida paga que continua na lista vira teto para o próximo corte.`);
    }

    // H — sigla conhecida que chegou nua ao leitor.
    if (!PAGINAS_SEM_SIGLA.has(nome)) {
      comSiglas++;
      siglasAbertasTotal += visto.siglasAbertas;
      const nuas = visto.siglasNuas;
      const previstoSigla = SIGLA_NUA_PENDENTE.get(nome.replace(/\.html$/, "")) || 0;
      siglasNuasTotal += nuas.length;
      dividaDeSigla += previstoSigla;
      if (nuas.length > previstoSigla) {
        const quais = [...new Set(nuas.map((n) => n.sigla))].slice(0, 6).join(", ");
        const amostra = nuas.slice(0, 3).map((n) => `"${n.sigla}" em "…${n.ctx}…"`).join("; ");
        falhas.push(`${nome} · H · ${nuas.length} sigla(s) chegam nuas ao leitor ` +
                    `(a dívida declarada é ${previstoSigla}): ${quais}. ${amostra}. ` +
                    `O Princípio VIII manda abrir a sigla; quem abre é o \`abrirSiglas\` de publicar/siglas.mjs, ` +
                    `e sigla nua aqui quer dizer que o passe não alcançou este texto.`);
      } else if (nuas.length < previstoSigla) {
        falhas.push(`${nome} · H · a dívida declara ${previstoSigla} sigla(s) nua(s) e há ${nuas.length}: ` +
                    `atualize SIGLA_NUA_PENDENTE (publicar/jornada.mjs). ` +
                    `Dívida paga que continua na lista vira teto para a próxima sigla nua.`);
      }
    }
  }
}

await navegador.close();
servidor.close();

console.log(`Jornada: ${paginas.length} página(s) abertas em Chromium a ${LARGURA}px · ` +
            `${comExercicios} com fonte rastreável para conferir a contagem de exercícios · ` +
            `${comInteracoes} interação(ões) clicada(s) sem resposta para ver se seguram.`);
// Sempre, inclusive no verde: a asserção G dispensa os stubs e tolera uma dívida,
// e quem dispensa em silêncio estreita o gate sem avisar ninguém.
console.log(`   Fórmulas: ${comFormulas} página(s) medidas e ${redirecionadas} dispensadas ` +
            `(stub de redirecionamento, medido no destino) · ` +
            `${formulasCortadasTotal} fórmula(s) ainda cortam, contra ${dividaDeclarada} ` +
            `declarada(s) em FORMULA_CORTADA_PENDENTE para essas páginas.`);
// Idem para H: os dois números saem sempre, inclusive no verde. Um gate que
// dispensa páginas e tolera dívida tem de dizer quanto dispensou.
console.log(`   Siglas: ${comSiglas} página(s) medidas e ${PAGINAS_SEM_SIGLA.size} dispensada(s) ` +
            `(o glossário define as siglas) · ${siglasAbertasTotal} ocorrência(s) em <abbr> · ` +
            `${siglasNuasTotal} ainda nua(s), contra ${dividaDeSigla} declarada(s) em SIGLA_NUA_PENDENTE.`);
if (falhas.length) {
  console.error(`✗ ${falhas.length} problema(s) que o leitor veria:`);
  falhas.forEach((f) => console.error("   " + f));
  process.exit(1);
}
console.log("✓ nenhuma página rola de lado, os exercícios do fonte chegam ao DOM, " +
            "os laboratórios montam, o companion carrega, o console fica limpo, " +
            "nenhuma interação revela antes de o leitor responder, nenhuma fórmula " +
            "termina cortada na margem e nenhuma sigla conhecida chega nua ao leitor, " +
            "fora das dívidas declaradas.");
