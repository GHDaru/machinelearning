// O BLOCO `:::aprofundar`: o que o parser aceita, o que ele recusa, e o que o
// navegador de verdade faz com o `<details>` fechado.
//
// POR QUE ESTE TESTE EXISTE
//
// O aprofundamento é a única superfície do livro que TIRA conteúdo do caminho
// do leitor, e as duas promessas que o justificam não são visíveis no HTML:
//
//   1. o texto fechado NÃO conta no `innerText`, que é como
//      `gates/cartoes-legiveis.mjs` mede as palavras de um cartão. Se um dia
//      contar, o teto de 250 palavras volta a ser encostado pela dedução que o
//      bloco tinha tirado de lá, e ninguém saberá por quê;
//   2. o bloco não vira esconderijo. O gate dos cartões acha `.exercicio` e
//      `.interacao` com `querySelectorAll`, que atravessa `<details>` fechado:
//      um exercício aqui dentro passaria no portão e não apareceria ao leitor.
//      A recusa é do parser, e é ela que este teste cobra bloco a bloco.
//
// A PRIMEIRA PROMESSA É DO NAVEGADOR, NÃO DO NOSSO CÓDIGO. `innerText` depende
// de layout, e nenhum DOM falso o modela. Por isso ela é medida num Chromium de
// verdade, e nas DUAS direções: fechado não conta, aberto conta. Uma asserção
// que só olhasse o lado fechado passaria com um `<details>` que nunca abre.
//
// O Playwright não é dependência deste repositório (a constituição pede trilha
// de custo zero, e um navegador custa ~150 MB), e o job `livro` da CI não o
// tem. Aqui ele é OPCIONAL, e a ausência é dita em voz alta na saída em vez de
// virar silêncio; quem o executa com navegador é o job de publicação, que já
// instala o Chromium para os dois gates de tela.
//
// Uso: node publicar/testes/aprofundar.mjs
//      PLAYWRIGHT=/caminho/playwright/index.mjs CHROMIUM=/caminho/chrome node publicar/testes/aprofundar.mjs

import MarkdownIt from "markdown-it";
import { extrair, renderizar, semGabarito, ErroDeBloco } from "../interativos.mjs";

let falhas = 0;
let naoRodou = 0;
function ok(nome, cond) {
  if (cond) console.log(`  ok   ${nome}`);
  else { console.log(`  FALHA ${nome}`); falhas++; }
}
function recusa(nome, md) {
  try {
    extrair(md, "teste.md");
    console.log(`  FALHA ${nome} (aceitou)`);
    falhas++;
  } catch (e) {
    ok(nome, e instanceof ErroDeBloco);
  }
}

// Renderizador de brinquedo: o alvo aqui é o parser, não o markdown-it.
const renderMd = (t) => `<p>${String(t).trim()}</p>`;

// ---------------------------------------------------------------- o parser

const BLOCO = `:::aprofundar {"titulo":"De onde sai o 2/n"}
A conta inteira, para quem quer.

Ela ocupa dois parágrafos e não atrapalha ninguém.
:::`;

const lote = extrair(`Antes.\n\n${BLOCO}\n\nDepois.`, "teste.md", 2);
ok("acha o aprofundamento", lote.aprofundamentos.length === 1);
ok("lê o título", lote.aprofundamentos[0].titulo === "De onde sai o 2/n");
ok("lê o corpo inteiro, os dois parágrafos",
   /^A conta inteira[\s\S]*atrapalha ninguém\.$/.test(lote.aprofundamentos[0].corpo));
ok("não confunde com as outras superfícies",
   !lote.exercicios.length && !lote.videos.length && !lote.laboratorios.length && !lote.interacoes.length);

recusa("sem título", ':::aprofundar {"nivel":1}\ncorpo\n:::');
recusa("corpo vazio", ':::aprofundar {"titulo":"T"}\n\n:::');
recusa("atributos que não são JSON", ':::aprofundar {titulo:"T"}\ncorpo\n:::');

// ------------------------------------------- não pode virar esconderijo
//
// Cada um destes já seria perda de conteúdo disfarçada de organização. O
// exercício e a interação são o caso grave: eles CONTAM no gate do cartão
// mesmo fechados, então o cartão passaria no portão sem nada à vista.

recusa("exercício dentro",
  ':::aprofundar {"titulo":"T"}\ntexto\n:::exercicio {"id":"a","tipo":"multipla","objetivo":"O1"}\nq\n\n- [ ] a\n- [x] b\n\n> **porque:** p\n:::\n:::');
recusa("interação dentro",
  ':::aprofundar {"titulo":"T"}\ntexto\n:::interacao {"id":"a","tipo":"principio"}\nq\n\n> **pergunta:** p\n> **revela:** r\n:::\n:::');
recusa("laboratório dentro",
  ':::aprofundar {"titulo":"T"}\ntexto\n:::lab {"id":"a","tipo":"neuronio-mp"}\nintro\n:::\n:::');
recusa("vídeo dentro",
  ':::aprofundar {"titulo":"T"}\ntexto\n:::video {"id":"a","ref":"r","autor":"x"}\npor quê\n:::\n:::');
recusa("corte de cartão dentro",
  ':::aprofundar {"titulo":"T"}\ntexto\n:::cartao {"nivel":1,"titulo":"c"}\nmais\n:::');
recusa("outro aprofundamento dentro",
  ':::aprofundar {"titulo":"T"}\ntexto\n:::aprofundar {"titulo":"U"}\nmais\n:::');
// `marcarCortes()` roda ANTES de `renderizar()` e já trocou `:::cartao` pelo
// `<hr>`. Sem esta segunda forma, a recusa valeria só no caminho de `extrair()`.
recusa("corte de cartão JÁ CONVERTIDO em <hr> dentro",
  ':::aprofundar {"titulo":"T"}\ntexto\n<hr class="corte-cartao" data-nivel="1" data-titulo="c">\nmais\n:::');

// O limite herdado do RE_BLOCO, com mensagem própria: o corpo termina no
// primeiro `:::` sozinho numa linha, mesmo dentro de cerca de código.
recusa("exemplo de bloco completo dentro de cerca, no corpo",
  ':::aprofundar {"titulo":"T"}\ntexto\n\n```markdown\n:::exercicio {"id":"x"}\n:::\n```\n:::');

// Uma cerca fechada, sem `:::` solto, continua valendo: é assim que a dedução
// mostra o código que a acompanha.
const COM_CODIGO = ':::aprofundar {"titulo":"T"}\nA conta:\n\n```python\ngrad = 2 * erro\n```\n:::';
ok("cerca de código bem formada no corpo é aceita",
   extrair(COM_CODIGO, "teste.md").aprofundamentos.length === 1);

// ------------------------------------- documentar a sintaxe não cria widget
const EM_CERCA = "```markdown\n" + BLOCO + "\n```\n";
ok("aprofundamento dentro de código cercado é exemplo, não widget",
   extrair(EM_CERCA, "teste.md").aprofundamentos.length === 0);
ok("e sai do render como veio", renderizar(EM_CERCA, renderMd, "teste.md") === EM_CERCA);

// ----------------------------------------------------------------- o render

const html = renderizar(BLOCO, renderMd, "teste.md", 2);

ok("vira um <details> com a classe do tema", /^<details class="aprofundar">/.test(html));
ok("nasce FECHADO — nenhum `open` no elemento", !/<details[^>]*\sopen/.test(html));
ok("o título vira o <summary>",
   /<summary class="ap-cab">.*De onde sai o 2\/n.*<\/summary>/.test(html));
ok("o corpo fica DEPOIS do summary, dentro do details",
   html.indexOf('class="ap-corpo"') > html.indexOf("</summary>"));
ok("nenhuma linha em branco dentro do bloco (senão o markdown-it o parte em dois)",
   !/\n[ \t]*\n/.test(html));
ok("nada de JavaScript: nenhum atributo de evento, nenhum script",
   !/<script|\son[a-z]+=/i.test(html));
ok("o título é escapado", /&lt;b&gt;/.test(
   renderizar(':::aprofundar {"titulo":"<b>x</b>"}\ncorpo\n:::', renderMd, "teste.md")));

// A linha em branco DENTRO de `<pre>` é conteúdo, e some se for tratada como
// separador de bloco. Ela vira `&#10;`, que o navegador lê como quebra e que no
// arquivo não é linha em branco. A conferência de que o navegador de fato a lê
// assim está na parte de navegador, mais abaixo.
const mdReal = new MarkdownIt({ html: true });
const CODIGO_COM_VAZIO = ':::aprofundar {"titulo":"T"}\n```python\na = 1\n\nb = 2\n```\n:::';
const htmlCodigo = renderizar(CODIGO_COM_VAZIO, (t) => mdReal.render(t), "teste.md");
ok("código com linha em branco não parte o bloco", !/\n[ \t]*\n/.test(htmlCodigo));
ok("e a linha em branco do código é preservada como entidade", /&#10;/.test(htmlCodigo));

// O bloco tem de atravessar o SEGUNDO passe do markdown-it inteiro — é ali que
// um bloco partido vira `<p>` solto e o `</details>` some.
const pagina = mdReal.render(renderizar(`Antes.\n\n${BLOCO}\n\nDepois.`, (t) => mdReal.render(t), "teste.md"));
ok("sobrevive ao segundo passe do markdown-it",
   (pagina.match(/<details/g) || []).length === 1 && (pagina.match(/<\/details>/g) || []).length === 1);
ok("e o texto do fluxo principal continua fora dele",
   /<p>Antes\.<\/p>/.test(pagina) && /<p>Depois\.<\/p>/.test(pagina));

// A exportação em Markdown não mexe no aprofundamento: não há gabarito ali.
ok("semGabarito devolve o aprofundamento intacto", semGabarito(BLOCO) === BLOCO);

// -------------------------------------------------- o navegador, de verdade
//
// A promessa que autoriza o bloco: o texto FECHADO não entra na contagem de
// palavras do cartão. A medição repete, letra por letra, a de
// `gates/cartoes-legiveis.mjs` — `(c.innerText || "").trim().split(/\s+/)` —
// porque é aquele número que decide se um cartão passa.

let chromium = null;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright"));
} catch { /* sem navegador: dito em voz alta no fim */ }

if (!chromium) {
  console.log("  NÃO RODOU (sem Playwright) — a contagem de palavras do cartão não foi medida.");
  console.log("     PLAYWRIGHT=/caminho/playwright/index.mjs CHROMIUM=/caminho/chrome node publicar/testes/aprofundar.mjs");
  naoRodou = 3;
} else {
  const CARTAO = (aberto) => `<!doctype html><html><body><div class="cartao">
<p>O gradiente aponta para onde a perda cresce mais rápido.</p>
${renderizar(BLOCO, (t) => mdReal.render(t), "teste.md").replace("<details ", `<details ${aberto ? "open " : ""}`)}
</div></body></html>`;

  const navegador = await chromium.launch({
    executablePath: process.env.CHROMIUM || undefined,
    args: ["--no-sandbox"],
  });
  const pag = await navegador.newPage({ viewport: { width: 360, height: 800 } });

  const medir = async (aberto) => {
    await pag.setContent(CARTAO(aberto));
    return pag.evaluate(() => {
      const c = document.querySelector(".cartao");
      const txt = (c.innerText || "").trim();
      return {
        palavras: txt ? txt.split(/\s+/).length : 0,
        altura: Math.round(c.scrollHeight),
        temNoTexto: /atrapalha/.test(txt),
        // `querySelectorAll` atravessa o `<details>` fechado: é por isso que a
        // recusa de aninhamento tem de ser do parser, e não do gate.
        alcancavelPorSeletor: !!c.querySelector(".ap-corpo"),
      };
    });
  };

  const fechado = await medir(false);
  const aberto = await medir(true);

  ok("fechado: o corpo NÃO entra no innerText que o gate conta", !fechado.temNoTexto);
  ok("aberto: o mesmo corpo entra — a asserção discrimina", aberto.temNoTexto);
  ok(`fechado conta menos palavras que aberto (${fechado.palavras} contra ${aberto.palavras})`,
     fechado.palavras < aberto.palavras);
  ok(`fechado é mais baixo que aberto (${fechado.altura}px contra ${aberto.altura}px)`,
     fechado.altura < aberto.altura);
  ok("e o gate ALCANÇA o conteúdo fechado por seletor — daí a recusa ser do parser",
     fechado.alcancavelPorSeletor);

  // A entidade `&#10;` do código: o navegador tem de ler como quebra de linha.
  await pag.setContent(`<!doctype html><html><body>${
    mdReal.render(renderizar(CODIGO_COM_VAZIO, (t) => mdReal.render(t), "teste.md"))
      .replace("<details ", "<details open ")}</body></html>`);
  const codigo = await pag.evaluate(() => document.querySelector("pre code").textContent);
  ok("a linha em branco do código chega ao navegador como linha em branco",
     /a = 1\n\nb = 2/.test(codigo));

  // O teclado vem do navegador, e é a razão de não haver JavaScript aqui.
  await pag.setContent(CARTAO(false));
  await pag.keyboard.press("Tab");
  const focoNoSummary = await pag.evaluate(() => document.activeElement?.tagName === "SUMMARY");
  await pag.keyboard.press("Enter");
  const abriuComTeclado = await pag.evaluate(() => document.querySelector("details").open);
  ok("o <summary> recebe foco de teclado sem tabindex nosso", focoNoSummary);
  ok("e Enter abre o bloco, sem uma linha de JavaScript", abriuComTeclado);

  await navegador.close();
}

console.log(`\n${falhas ? "✗" : "✓"} aprofundar: ${falhas} falha(s)` +
            (naoRodou ? `, ${naoRodou} asserção(ões) NÃO RODARAM por falta de navegador.` : "."));
process.exit(falhas ? 1 : 0);
