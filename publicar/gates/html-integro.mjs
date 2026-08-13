// Gate: a página gerada tem de fechar o que abre.
//
// POR QUE ESTE GATE EXISTE. O `III.1` e o `II.7` foram publicados com um
// `<style>` aberto e nunca fechado. Para o navegador, tudo o que vem depois de
// um `<style>` sem fecho é CSS — não é conteúdo. O leitor via o capítulo
// morrer no meio: dos doze exercícios apareciam três, o link do Colab sumia,
// os laboratórios não montavam, o companion não carregava e, com ele, ia
// embora o histórico do aluno. A página respondia 200 e tinha todos os bytes
// no lugar; só não era o documento que parecia ser.
//
// A causa foi um duplo passe de markdown: o texto do exercício é renderizado
// uma vez para virar HTML de opção e outra quando a página inteira passa pelo
// markdown. Fórmula dentro de opção nasce embrulhada num `<style>` do MathJax
// que contém linhas em branco, e o segundo passe lê essas linhas como
// separador de parágrafo, partindo o bloco. Corrigido no `build.mjs`,
// dedupando no momento em que o embrulho nasce.
//
// O QUE ELE COBRA, e por que é assim
//
// Nenhum gate anterior olhava para o HTML **gerado** — olhavam a prosa, o
// banco, os links, os intervalos, o tema. Todos leem a fonte. Este lê o
// produto, que é o que chega ao leitor. Ele não valida HTML inteiro (custaria
// uma dependência de parser); cobra as três invariantes que quebram a página
// inteira de uma vez, e a terceira é a que teria pego o defeito real:
//
//   1. exatamente um `</body>` e um `</html>`;
//   2. `<script>` abre e fecha na mesma conta;
//   3. `<style>` abre e fecha na mesma conta.
//
// Uso: node publicar/gates/html-integro.mjs

import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DOCS = resolve(RAIZ, "docs");

const conta = (txt, re) => (txt.match(re) || []).length;

export function verificar() {
  const problemas = [];
  let paginas;
  try {
    paginas = readdirSync(DOCS).filter((n) => n.endsWith(".html"));
  } catch {
    return ["docs/ não existe — rode o build antes deste gate"];
  }

  for (const nome of paginas) {
    const txt = readFileSync(join(DOCS, nome), "utf8");

    const abreStyle = conta(txt, /<style[\s>]/g);
    const fechaStyle = conta(txt, /<\/style>/g);
    if (abreStyle !== fechaStyle) {
      problemas.push(
        `docs/${nome} — <style> abre ${abreStyle}x e fecha ${fechaStyle}x; ` +
          `do ponto do desequilíbrio em diante o navegador lê a página como CSS`,
      );
    }

    const abreScript = conta(txt, /<script[\s>]/g);
    const fechaScript = conta(txt, /<\/script>/g);
    if (abreScript !== fechaScript) {
      problemas.push(`docs/${nome} — <script> abre ${abreScript}x e fecha ${fechaScript}x`);
    }

    for (const [tag, re] of [["</body>", /<\/body>/g], ["</html>", /<\/html>/g]]) {
      const n = conta(txt, re);
      if (n !== 1) problemas.push(`docs/${nome} — ${n} ocorrência(s) de ${tag}, esperado 1`);
    }
  }
  return problemas;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problemas = verificar();
  if (problemas.length) {
    console.error(`✗ ${problemas.length} página(s) com HTML rompido:`);
    problemas.forEach((p) => console.error("   " + p));
    process.exit(1);
  }
  console.log("✓ HTML gerado íntegro: <style>, <script>, </body> e </html> fecham em todas as páginas");
}
