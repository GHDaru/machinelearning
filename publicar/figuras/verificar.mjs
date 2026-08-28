// Gate de deriva das FIGURAS: regenera cada uma e exige que o SVG versionado
// bata com o resultado.
//
// POR QUE ELE EXISTE. As figuras deste livro são geradas a partir dos dados, e
// não desenhadas: a do XOR calcula a reta a partir dos pesos, a do block group
// mede a mediana no CSV congelado. Isso é bom, e tinha um buraco: nada
// regenerava as figuras. O SVG ficava commitado, os dados podiam mudar, e a
// figura seguiria afirmando o número antigo — em silêncio, do lado de um texto
// que já dizia outro.
//
// É o mesmo defeito que o gate de deriva do `banco.json` fecha, e a mesma cura:
// regenerar e comparar. Cada gerador também traz suas próprias asserções (a
// figura se recusa a existir se os dados pararem de sustentar o que ela afirma);
// este arquivo garante que alguém as execute.
//
// Uso:  node publicar/figuras/verificar.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const AQUI = dirname(fileURLToPath(import.meta.url));
const TEMA = resolve(AQUI, "..", "tema");

const geradores = readdirSync(AQUI)
  .filter((f) => f.endsWith(".mjs") && f !== "verificar.mjs")
  .sort();

if (!geradores.length) {
  console.error("✗ nenhum gerador de figura encontrado — o gate não pode passar vazio.");
  process.exit(1);
}

const problemas = [];
for (const g of geradores) {
  const svg = resolve(TEMA, basename(g, ".mjs") + ".svg");
  let antes = null;
  try { antes = readFileSync(svg, "utf8"); } catch { /* figura nova */ }

  const r = spawnSync(process.execPath, [resolve(AQUI, g)], { encoding: "utf8" });
  if (r.status !== 0) {
    problemas.push(`${g}: o gerador falhou (saída ${r.status}) — as asserções dele recusaram os dados.`);
    const err = (r.stderr || "").trim().split("\n").find((l) => l.includes("Error"));
    if (err) problemas.push("    " + err.trim());
    continue;
  }
  const depois = readFileSync(svg, "utf8");
  // O gerador SOBRESCREVE o SVG versionado. Se ele divergiu, a árvore de
  // trabalho é restaurada: sem isso, a segunda execução do gate passa — ele
  // teria "consertado" o que devia denunciar, e a falha não seria reproduzível.
  if (antes !== null && antes !== depois) writeFileSync(svg, antes);
  if (antes === null) {
    problemas.push(`${g}: gerou ${basename(svg)}, que não estava versionado. Faça commit.`);
  } else if (antes !== depois) {
    problemas.push(`${g}: ${basename(svg)} está fora de sincronia com o gerador e com os dados. ` +
                   "Rode o gerador e faça commit do SVG.");
  } else {
    console.log(`OK   ${basename(svg)}`);
  }
}

if (problemas.length) {
  console.error(`✗ ${problemas.length} problema(s) nas figuras:`);
  problemas.forEach((p) => console.error("   " + p));
  process.exit(1);
}
console.log(`\n${geradores.length} figura(s) em dia com os dados que as geram.`);
