// Gate: nada de rastreador dentro do que vendorizamos.
//
// O TensorFlow Playground publica um `analytics.js` com Google Analytics. Ele foi
// removido na vendorização (ADR 0018), e este gate existe porque "removi na mão"
// não é uma garantia: basta alguém rebaixar os arquivos da `gh-pages` para ele
// voltar sem ninguém notar.
//
// O princípio V da constituição diz que o progresso do leitor é anônimo e apagável.
// Um rastreador de terceiro dentro de um laboratório do livro quebra isso em
// silêncio, e em silêncio é o único jeito que essas coisas quebram.
//
// Uso: node publicar/gates/sem-analytics.mjs

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const VENDOR = resolve(RAIZ, "publicar/tema/playground");
const SUSPEITO = /analytics|gtag\(|googletagmanager|\bUA-\d{4,}|fonts\.googleapis\.com/i;
const TEXTO = new Set([".html", ".js", ".css", ".md"]);

function varrer(dir) {
  const achados = [];
  for (const nome of readdirSync(dir)) {
    const alvo = join(dir, nome);
    if (statSync(alvo).isDirectory()) { achados.push(...varrer(alvo)); continue; }
    if (!TEXTO.has(extname(nome))) continue;
    if (nome === "LEIA-ME.md") continue;          // ele DESCREVE a remoção
    const txt = readFileSync(alvo, "utf8");
    txt.split("\n").forEach((linha, i) => {
      if (SUSPEITO.test(linha)) {
        achados.push(`${alvo.replace(RAIZ + "/", "")}:${i + 1} — ${linha.trim().slice(0, 90)}`);
      }
    });
  }
  return achados;
}

let achados;
try {
  achados = varrer(VENDOR);
} catch (e) {
  console.error("✗ pasta vendorizada do playground não encontrada:", VENDOR);
  process.exit(1);
}

if (achados.length) {
  console.error(`✗ ${achados.length} ocorrência(s) de rastreador ou recurso externo no vendorizado:`);
  achados.forEach((a) => console.error("   " + a));
  console.error("   Ver publicar/tema/playground/LEIA-ME.md, item 1 e 2.");
  process.exit(1);
}
console.log("✓ vendorizado do playground: sem rastreador e sem recurso externo");
