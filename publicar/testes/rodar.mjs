// Roda TODOS os testes de publicar/testes/ e devolve código de saída.
//
// POR QUE ESTE ARQUIVO EXISTE
//
// Os 25 testes deste diretório rodavam um a um, à mão, no momento em que cada um
// foi escrito — e depois nunca mais. A CI não os invocava. Um teste que ninguém
// roda não guarda nada: ele registra o que era verdade no dia em que foi escrito,
// e apodrece em silêncio junto com o código que deveria vigiar.
//
// Descobri isso ao acrescentar o teste do laboratório mlp-tabela e procurar onde
// ligá-lo na CI: não havia onde. Este runner é a ligação, e a CI passou a chamá-lo.
//
// Uso: node publicar/testes/rodar.mjs
import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const AQUI = dirname(fileURLToPath(import.meta.url));
const arquivos = readdirSync(AQUI)
  .filter((f) => f.endsWith(".mjs") && f !== "rodar.mjs")
  .sort();

if (!arquivos.length) {
  console.error("✗ nenhum teste encontrado em publicar/testes/ — o runner não pode passar vazio.");
  process.exit(1);
}

const falhas = [];
for (const f of arquivos) {
  const r = spawnSync(process.execPath, [resolve(AQUI, f)], { encoding: "utf8" });
  if (r.status === 0) {
    console.log(`OK   ${f}`);
  } else {
    falhas.push(f);
    console.log(`FALHA ${f} (saída ${r.status})`);
    const saida = (r.stdout || "") + (r.stderr || "");
    saida.split("\n").filter((l) => /FALHA|FALHOU|Error/.test(l)).forEach((l) => console.log("       " + l));
  }
}

console.log(`\n${arquivos.length - falhas.length} de ${arquivos.length} teste(s) verde(s).`);
if (falhas.length) {
  console.error("✗ falharam: " + falhas.join(", "));
  process.exit(1);
}
