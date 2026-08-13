// Gate de prosa — as duas regras do ADR 0013.
//
// A skill `humanizer` manda eliminar todo travessão (§14). O comitê recusou:
// a regra é calibrada em corpus de inglês, onde o em dash é recurso enfático
// parcimonioso; em português o travessão é pontuação ordinária, com funções
// normativas que a vírgula não cobre. Medir frequência mede a língua, não a
// autoria.
//
// O que É dano de leitura, e o que este gate cobra, é AMONTOADO:
//   1. frase com 2+ travessões  — o leitor perde o sujeito antes do verbo
//   2. parágrafo com 4+ negritos — quando tudo é ênfase, nada é
//
// O que este gate NUNCA toca, porque tocar corrompe:
//   - sinal de menos U+2212 (45 deles vivem em fórmulas, em 14 arquivos)
//   - meia-risca U+2013 (intervalo: "1943–1958"; e coordenação: "McCulloch–Pitts")
//   - travessão em título, tabela, código e matemática ($…$ e $$…$$)
//
// Uso: importado por build.mjs. `node prosa.mjs` sozinho lista as pendências.

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");

// A dívida COBRADA, não registrada. Cada capítulo que passa pelo ciclo 009 sai
// desta lista no mesmo commit. Falha nas duas direções: entrada nova quebra o
// build, e entrada que deixou de ser necessária também — dívida paga que
// continua na lista esconde a próxima.
//
// Vazia desde o fim do ciclo 009: os 29 capítulos e os 7 arquivos fora deles
// passaram. A lista vazia é o estado normal — o gate agora vale para o livro
// inteiro, e qualquer texto novo que amontoe quebra o build na hora.
export const PROSA_PENDENTE = new Set([]);

/** Linhas que são prosa: fora de código, de tabela, de título e de matemática. */
function linhasDeProsa(fonte) {
  const saida = [];
  let emCodigo = false;
  let emMate = false;
  fonte.split("\n").forEach((linha, i) => {
    const t = linha.trim();
    if (t.startsWith("```") || t.startsWith("~~~")) { emCodigo = !emCodigo; return; }
    if (t === "$$") { emMate = !emMate; return; }
    if (emCodigo || emMate) return;
    if (!t || t.startsWith("#") || t.startsWith("|") || t.startsWith(":::")) return;
    // Três coisas saem da linha ANTES de qualquer contagem, porque em todas
    // elas o travessão pertence a um nome, não à pontuação da frase — e
    // "reescrever" um nome é corromper a referência, não desamontoar a prosa:
    //   $…$  matemática inline (é lá que moram os 45 sinais de menos)
    //   `…`  código inline (`II.2 — Modelos Lineares` é um identificador)
    //   [ ]  rótulo de link (o título do capítulo carrega o travessão)
    // A ADR 0013 já dizia "nunca toca em título, tabela, código e matemática";
    // isto é a implementação alcançando o que a decisão declarava.
    saida.push([i + 1, linha
      .replace(/\$[^$]*\$/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/\[([^\]]*)\]\(/g, "[](")]);
  });
  return saida;
}

export function analisar(arquivo) {
  const caminho = resolve(RAIZ, arquivo);
  if (!existsSync(caminho)) return [];
  const problemas = [];
  for (const [n, linha] of linhasDeProsa(readFileSync(caminho, "utf8"))) {
    for (const frase of linha.split(/(?<=[.!?])\s+/)) {
      const t = (frase.match(/—/g) || []).length;
      if (t >= 2) problemas.push(`${arquivo}:${n} — frase com ${t} travessões: "${frase.trim().slice(0, 70)}…"`);
    }
    const nb = (linha.match(/\*\*[^*]+\*\*/g) || []).length;
    if (nb >= 4) problemas.push(`${arquivo}:${n} — parágrafo com ${nb} trechos em negrito`);
  }
  return problemas;
}

/** @returns {string[]} mensagens de falha; vazio = verde */
export function verificar(arquivos) {
  const falhas = [];
  for (const a of arquivos) {
    const p = analisar(a);
    if (p.length && !PROSA_PENDENTE.has(a)) falhas.push(...p);
    if (!p.length && PROSA_PENDENTE.has(a)) {
      falhas.push(`${a}: prosa já está limpa — tire-o de PROSA_PENDENTE (publicar/prosa.mjs). ` +
        `Dívida paga que continua na lista esconde a próxima.`);
    }
  }
  return falhas;
}

// Execução direta: relatório, para o ciclo 009 saber onde está.
if (import.meta.url === `file://${process.argv[1]}`) {
  const sumario = JSON.parse(readFileSync(resolve(AQUI, "sumario.json"), "utf8"));
  const itens = sumario.partes.flatMap((p) => p.itens).filter((i) => i.arquivo);
  let totF = 0, totN = 0, limpos = 0;
  for (const i of itens) {
    const p = analisar(i.arquivo);
    const f = p.filter((x) => x.includes("travessões")).length;
    const nb = p.length - f;
    if (!p.length) { limpos++; continue; }
    totF += f; totN += nb;
    console.log(`${String(f).padStart(3)} frases · ${String(nb).padStart(3)} parágrafos  ${i.arquivo}`);
  }
  console.log(`\n${limpos} arquivo(s) já limpos · ${totF} frases amontoadas · ${totN} parágrafos sobre-negritados`);
}
