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
let comFormulas = 0, redirecionadas = 0, formulasCortadasTotal = 0;
const errosJs = [];
aba.on("pageerror", (e) => errosJs.push(String(e).slice(0, 140)));
aba.on("console", (m) => { if (m.type() === "error" && !/ERR_CERT|ERR_NAME|ERR_CONNECTION/.test(m.text())) errosJs.push(m.text().slice(0, 140)); });

for (const nome of paginas) {
  errosJs.length = 0;
  await aba.goto(`http://127.0.0.1:${PORTA}/${nome}`, { waitUntil: "load" });
  await aba.waitForTimeout(250);

  const visto = await aba.evaluate(() => {
    const W = window.innerWidth;
    const dentroDeRolagem = (e) => {
      for (let a = e.parentElement; a; a = a.parentElement) {
        const o = getComputedStyle(a).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden") return true;
      }
      return false;
    };
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewport: W,
      estouram: [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > W + 1 && !dentroDeRolagem(e))
        .slice(0, 3)
        .map((e) => e.tagName + (e.className ? "." + String(e.className).split(" ")[0] : "")),
      // G: a fórmula está dentro de um contêiner que rola, então ela escapa de
      // A por construção. O que se mede aqui é outra coisa: o conteúdo dela cabe
      // na caixa em que ela é DESENHADA? Não cabendo, a expressão termina na
      // margem, e no Chromium móvel nem barra aparece antes do gesto.
      formulasCortadas: [...document.querySelectorAll("mjx-container")]
        .filter((e) => e.scrollWidth > e.clientWidth + 1)
        .map((e) => ({ sw: e.scrollWidth, cw: e.clientWidth,
                       tex: (e.textContent || "").trim().slice(0, 46) })),
      exercicios: document.querySelectorAll(".exercicio").length,
      labsVazios: [...document.querySelectorAll("[data-lab]")]
        .filter((e) => !e.querySelector("canvas, svg, table, button"))
        .map((e) => e.getAttribute("data-lab")),
      companion: !!document.querySelector(".cmp"),
    };
  });

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
            `${formulasCortadasTotal} fórmula(s) ainda cortam, todas declaradas em ` +
            `FORMULA_CORTADA_PENDENTE.`);
if (falhas.length) {
  console.error(`✗ ${falhas.length} problema(s) que o leitor veria:`);
  falhas.forEach((f) => console.error("   " + f));
  process.exit(1);
}
console.log("✓ nenhuma página rola de lado, os exercícios do fonte chegam ao DOM, " +
            "os laboratórios montam, o companion carrega, o console fica limpo, " +
            "nenhuma interação revela antes de o leitor responder e nenhuma fórmula " +
            "termina cortada na margem fora da dívida declarada.");
