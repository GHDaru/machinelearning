// A RÉGUA DO MODO CARTÃO, do lado do Markdown.
//
// POR QUE ESTE ARQUIVO EXISTE
//
// A v1 do modo cartão cortava o capítulo por cabeçalho. Cabeçalho é critério
// TIPOGRÁFICO: diz onde o autor quis um título, não onde termina uma unidade
// que o leitor consegue fechar. Medido a 360×800 no capítulo II.2, o corte por
// cabeçalho dava cartões de 226 px a 5 849 px — 25,9x entre o maior e o menor,
// contra 1,2x na referência de microlearning que o autor aprovou. O cartão 7
// tinha 7,3 telas, 1 289 palavras e 49 blocos de fórmula, e a navegação
// prometia "7 de 18" para ele e para um cartão de 39 palavras.
//
// Aqui o corte passa a ser DECLARADO pelo autor, no próprio Markdown:
//
//   :::cartao {"nivel":1,"titulo":"O modelo é uma reta"}
//   … tudo daqui até o próximo :::cartao é UM cartão …
//   :::cartao {"nivel":2,"titulo":"Passo 1 — a tigela tem um fundo só"}
//   … outro cartão …
//   :::cartao-fim
//   … isto fica no capítulo e FORA do baralho …
//
// TRÊS DECISÕES QUE PRECISAM DE JUSTIFICATIVA
//
//   1. **O marcador é um CORTE, não um invólucro.** Todos os outros blocos da
//      casa (`:::exercicio`, `:::lab`, `:::video`) abrem e fecham. Este não —
//      e não por preguiça: um cartão contém exercícios, e `:::` aninhado dentro
//      de `:::` não é analisável pelo `RE_BLOCO` de `interativos.mjs`, que é a
//      fonte única da sintaxe. Envolver exigiria um parser de aninhamento para
//      resolver um problema que uma linha divisória já resolve.
//   2. **`nivel` e `titulo` vêm do marcador, não do cabeçalho.** A referência
//      rotula "Nível 1 · página 3/9"; o corte por cabeçalho só sabia repetir a
//      seção-mãe. Um cartão cujo objeto é um laboratório pode não ter cabeçalho
//      nenhum, e ainda assim precisa de nome na barra de progresso e no
//      `aria-label`.
//   3. **`:::cartao-fim` existe porque nem tudo é cartão.** A disputa
//      Legendre-Gauss é texto sem gesto: não há o que manipular, não há uma
//      pergunta que se responda sem rolar para trás. Ela CONTINUA no capítulo
//      (perder conteúdo seria falha) e fica fora do fluxo de cartões (deixá-lo
//      fora do baralho é decisão). O mesmo vale para o miolo: um trecho entre
//      dois cartões que não vira cartão nenhum.
//
// O QUE CHEGA AO NAVEGADOR. Cada marcador vira um `<hr class="corte-cartao">`
// invisível, com os atributos `data-nivel` e `data-titulo`. É um nó real no
// DOM, na posição exata do corte — que é o que `tema/cartoes.js` precisa para
// segmentar sem reinterpretar Markdown no cliente. Capítulo sem nenhum
// marcador continua caindo no corte por cabeçalho, e os outros 28 capítulos
// seguem funcionando como antes.

/** Erro de autoria com localização — vira falha de build, não aviso silencioso. */
export class ErroDeCartao extends Error {
  constructor(arquivo, msg) {
    super(`${arquivo} · marcador de cartão: ${msg}`);
    this.arquivo = arquivo;
  }
}

// O marcador ocupa a linha inteira. `cartao-fim` não leva atributos.
const RE_MARCADOR = /^:::cartao(-fim)?[ \t]*(\{[^\n]*\})?[ \t]*$/gm;
const RE_CERCA = /^(?:```|~~~)[\s\S]*?^(?:```|~~~)[ \t]*$/gm;

/** Intervalos de código cercado — um marcador citado em exemplo não é corte. */
function cercas(markdown) {
  const faixas = [];
  for (const m of markdown.matchAll(RE_CERCA)) faixas.push([m.index, m.index + m[0].length]);
  return (pos) => faixas.some(([ini, fim]) => pos >= ini && pos < fim);
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/**
 * Conta os cartões declarados num Markdown (sem renderizar).
 * @returns {{nivel:number,titulo:string}[]}
 */
export function cartoesDe(markdown, arquivo = "?") {
  const emCerca = cercas(markdown);
  const achados = [];
  for (const m of markdown.matchAll(RE_MARCADOR)) {
    if (emCerca(m.index)) continue;
    if (m[1]) continue; // :::cartao-fim
    if (!m[2]) throw new ErroDeCartao(arquivo, 'sem atributos — escreva `:::cartao {"nivel":1,"titulo":"…"}`');
    let attrs;
    try {
      attrs = JSON.parse(m[2]);
    } catch (e) {
      throw new ErroDeCartao(arquivo, `atributos não são JSON válido — ${e.message}`);
    }
    if (!attrs.titulo) throw new ErroDeCartao(arquivo, "sem `titulo` — é o nome que vai ao aria-label e ao anúncio de troca de cartão");
    if (!attrs.nivel) throw new ErroDeCartao(arquivo, `"${attrs.titulo}" sem \`nivel\` — a referência rotula "Nível 1 · página 3/9", e o número é o que dá ao leitor a noção de progressão`);
    achados.push({ nivel: Number(attrs.nivel), titulo: String(attrs.titulo) });
  }
  return achados;
}

/**
 * Troca cada marcador pelo `<hr>` invisível que o JavaScript do tema procura.
 * Roda ANTES do markdown-it; o `<hr …>` sozinho na linha é bloco HTML.
 */
export function marcarCortes(markdown, arquivo = "?") {
  cartoesDe(markdown, arquivo); // valida antes de escrever qualquer coisa
  const emCerca = cercas(markdown);
  return markdown.replace(RE_MARCADOR, (bloco, fim, json, offset) => {
    if (emCerca(offset)) return bloco;
    if (fim) return '<hr class="corte-cartao" data-fim="1">';
    const attrs = JSON.parse(json);
    return `<hr class="corte-cartao" data-nivel="${esc(attrs.nivel)}" data-titulo="${esc(attrs.titulo)}">`;
  });
}
