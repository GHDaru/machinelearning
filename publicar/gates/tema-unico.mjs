// Gate: o tema do livro tem uma chave só, e ela se chama `data-tema`.
//
// O `app.js` escreve `data-tema` com os valores `claro` e `escuro`
// (publicar/tema/app.js:7-14). Isso é a única fonte de verdade sobre o tema.
//
// POR QUE ESTE GATE EXISTE. Três folhas de estilo tinham regras escritas em
// `data-theme` com valores `dark`/`light` — o vocabulário em inglês, que ninguém
// escreve no DOM. Regra que não casa com nada não dá erro, não aparece no build,
// não quebra teste: ela simplesmente não pinta. O leitor num sistema claro que
// acendia o modo escuro do livro recebia a página escura com o painel do chat
// **branco** e os chips de nível na cor clara, ilegíveis. O contrário também:
// sistema escuro, leitor pede claro, e o painel fica preto na página branca.
//
// Um seletor morto é a pior classe de defeito de CSS justamente por ser mudo.
// Só um gate acha.
//
// O QUE ELE COBRA
//
//   1. Nenhuma folha nossa menciona `data-theme` — o atributo em inglês.
//   2. Nenhum `data-tema` recebe valor em inglês (`dark`/`light`).
//   3. Toda `@media (prefers-color-scheme: dark)` que pinte algo do livro está
//      guardada por `:root:not([data-tema="claro"])`. Sem a guarda, a preferência
//      do sistema operacional passa por cima da escolha explícita do leitor, que
//      é exatamente a hierarquia invertida.
//
// O vendorizado (tema/playground) fica de fora: é código de terceiro, governado
// pelo LEIA-ME dele e pelo gate sem-analytics.mjs.
//
// Uso: node publicar/gates/tema-unico.mjs

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const TEMA = resolve(RAIZ, "publicar/tema");
const IGNORAR = new Set(["playground"]);

function folhas(dir) {
  const achadas = [];
  for (const nome of readdirSync(dir)) {
    const alvo = join(dir, nome);
    if (statSync(alvo).isDirectory()) {
      if (!IGNORAR.has(nome)) achadas.push(...folhas(alvo));
      continue;
    }
    if (extname(nome) === ".css") achadas.push(alvo);
  }
  return achadas;
}

const rel = (p) => p.replace(RAIZ + "/", "");
const problemas = [];

// Comentário fora, numeração intacta. Um comentário CSS não pode criar seletor,
// então um seletor morto nunca se esconde dentro de um — tirá-los da varredura
// deixa o gate mais preciso, não mais frouxo. E é necessário: o comentário que
// explica este bug precisa escrever `data-theme` para dizer qual era o erro.
// (Substituo o miolo por espaços em vez de apagar, para a linha do relatório
// continuar apontando para a linha do arquivo.)
const semComentario = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (bloco) => bloco.replace(/[^\n]/g, " "));

for (const folha of folhas(TEMA)) {
  const linhas = semComentario(readFileSync(folha, "utf8")).split("\n");

  linhas.forEach((linha, i) => {
    const onde = `${rel(folha)}:${i + 1}`;
    const corte = linha.trim().slice(0, 88);

    if (/data-theme/.test(linha)) {
      problemas.push(`${onde} — usa 'data-theme'; o DOM só tem 'data-tema'\n      ${corte}`);
    }
    if (/data-tema\s*=\s*["'](dark|light)["']/.test(linha)) {
      problemas.push(`${onde} — 'data-tema' com valor em inglês; os valores são 'claro'/'escuro'\n      ${corte}`);
    }
  });

  // A guarda da media query: olha o bloco inteiro, não a linha solta.
  const texto = linhas.join("\n");
  const re = /@media[^{]*prefers-color-scheme\s*:\s*dark[^{]*\{/gi;
  let m;
  while ((m = re.exec(texto)) !== null) {
    // Anda até fechar o bloco da media query, contando chaves.
    let prof = 1;
    let i = m.index + m[0].length;
    for (; i < texto.length && prof > 0; i++) {
      if (texto[i] === "{") prof++;
      else if (texto[i] === "}") prof--;
    }
    const corpo = texto.slice(m.index + m[0].length, i - 1);
    const linha = texto.slice(0, m.index).split("\n").length;
    if (!/:root:not\(\[data-tema="claro"\]\)/.test(corpo)) {
      problemas.push(
        `${rel(folha)}:${linha} — @media prefers-color-scheme sem a guarda ` +
          `':root:not([data-tema="claro"])'; a preferência do sistema passa por ` +
          `cima da escolha do leitor`,
      );
    }
  }
}

export function verificar() {
  return problemas;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (problemas.length) {
    console.error(`✗ ${problemas.length} problema(s) de tema:`);
    problemas.forEach((p) => console.error("   " + p));
    console.error("\n   A chave do tema é 'data-tema', valores 'claro' e 'escuro' (tema/app.js:7-14).");
    process.exit(1);
  }
  console.log("✓ tema: uma chave só ('data-tema'), e o leitor vence o sistema");
}
