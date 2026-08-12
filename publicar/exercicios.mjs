// Extrator do banco de exercícios e vídeos.
//
// Lê todo o Markdown publicado (sumario.json), extrai os blocos `:::exercicio`
// e `:::video` e escreve o banco COMPLETO — com gabarito — em
// `chat-companion/backend/banco.json`, que é quem o backend usa para corrigir.
//
// Uso:
//   node exercicios.mjs              gera o banco
//   node exercicios.mjs --verificar  só valida (gate de CI); não escreve nada
//
// Por que um arquivo, e não o Markdown lido direto pelo backend: o backend
// roda isolado em produção (só a pasta dele é copiada). Mesma razão do corpus
// do tutor. O gate garante que banco e livro nunca divergem.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { extrair, parseNumerico, ErroDeBloco } from "./interativos.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const DESTINO = resolve(RAIZ, "chat-companion/backend/banco.json");
const SO_VERIFICAR = process.argv.includes("--verificar");

const sumario = JSON.parse(readFileSync(resolve(AQUI, "sumario.json"), "utf8"));
const itens = sumario.partes.flatMap((p) => p.itens).filter((i) => i.arquivo);
// Posição de leitura (1..N), não o número do título — ver ADR 0011.
const posicaoDe = (arquivo) => itens.findIndex((i) => i.arquivo === arquivo) + 1;

const exercicios = [];
const videos = [];
const laboratorios = [];
const problemas = [];

for (const item of itens) {
  const caminho = resolve(RAIZ, item.arquivo);
  if (!existsSync(caminho)) continue;
  const bruto = readFileSync(caminho, "utf8");
  const cap = posicaoDe(item.arquivo);
  const slug = basename(item.arquivo).replace(/\.md$/, "").toLowerCase();

  let lote;
  try {
    lote = extrair(bruto, item.arquivo, cap);
  } catch (e) {
    if (e instanceof ErroDeBloco) {
      problemas.push(e.message);
      continue;
    }
    throw e;
  }

  // Objetivos declarados no capítulo: `- **O1.** ...` na seção Objetivos.
  const objetivos = new Set();
  for (const m of bruto.matchAll(/^[-*]\s+\*\*(O\d+)\.?\*\*/gm)) objetivos.add(m[1]);

  for (const ex of lote.exercicios) {
    ex.pagina = slug;
    ex.titulo_capitulo = item.titulo;
    if (objetivos.size && !objetivos.has(ex.objetivo)) {
      problemas.push(`${item.arquivo} · ${ex.id}: objetivo "${ex.objetivo}" não existe no capítulo (declarados: ${[...objetivos].join(", ") || "nenhum"})`);
    }
    if (ex.tipo === "numerica") {
      const n = parseNumerico(ex.gabarito);
      if (!n) problemas.push(`${item.arquivo} · ${ex.id}: gabarito numérico ilegível ("${ex.gabarito}")`);
      else ex.gabarito_num = n;
    }
    if (ex.tipo === "aberta") {
      ex.criterios = ex.rubrica.split(/[;\n]/).map((s) => s.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
      if (ex.criterios.length < 2) problemas.push(`${item.arquivo} · ${ex.id}: rubrica precisa de ao menos 2 critérios`);
    }
    exercicios.push(ex);
  }
  for (const v of lote.videos) {
    v.pagina = slug;
    videos.push(v);
  }
  for (const l of lote.laboratorios) {
    l.pagina = slug;
    laboratorios.push(l);
  }
}

// Ids duplicados quebram a correção e a telemetria — falha dura.
const vistos = new Map();
for (const ex of exercicios) {
  if (vistos.has(ex.id)) problemas.push(`id de exercício duplicado: "${ex.id}" (${vistos.get(ex.id)} e ${ex.arquivo})`);
  vistos.set(ex.id, ex.arquivo);
}
const vistosV = new Map();
for (const v of videos) {
  if (vistosV.has(v.id)) problemas.push(`id de vídeo duplicado: "${v.id}" (${vistosV.get(v.id)} e ${v.arquivo})`);
  vistosV.set(v.id, v.arquivo);
}
const vistosL = new Map();
for (const l of laboratorios) {
  if (vistosL.has(l.id)) problemas.push(`id de laboratório duplicado: "${l.id}" (${vistosL.get(l.id)} e ${l.arquivo})`);
  vistosL.set(l.id, l.arquivo);
}

if (problemas.length) {
  console.error(`✗ ${problemas.length} problema(s) no banco de exercícios:`);
  problemas.forEach((p) => console.error("   " + p));
  process.exit(1);
}

const porCapitulo = {};
for (const ex of exercicios) porCapitulo[ex.capitulo] = (porCapitulo[ex.capitulo] || 0) + 1;

const conteudo = JSON.stringify({ exercicios, videos, laboratorios, gerado_de: "livro/" }, null, 1);

if (SO_VERIFICAR) {
  // Validar o Markdown NÃO basta — e essa era a falha deste gate.
  // Quem o backend serve ao leitor é o `banco.json` VERSIONADO. Se ele estiver
  // atrasado em relação ao livro, o leitor abre um exercício que existe na
  // página e recebe "exercício não encontrado" — ou, pior, é corrigido contra
  // um gabarito antigo. Aconteceu de verdade: o livro tinha 91 exercícios e o
  // banco commitado tinha 88, porque `node build.mjs` sozinho não o regenera.
  // Agora o gate compara o conteúdo, não só a sintaxe.
  const atual = existsSync(DESTINO) ? readFileSync(DESTINO, "utf8") : "";
  if (atual !== conteudo) {
    let nAtual = "?";
    try { nAtual = JSON.parse(atual).exercicios.length; } catch { /* arquivo ausente ou inválido */ }
    console.error("✗ O banco versionado DERIVOU do livro.");
    console.error(`   chat-companion/backend/banco.json: ${nAtual} exercícios`);
    console.error(`   livro/:                            ${exercicios.length} exercícios`);
    console.error("   É este arquivo que o backend serve ao leitor. Rode `node exercicios.mjs` e comite o resultado.");
    process.exit(1);
  }
  console.log(`✓ Banco válido e em dia: ${exercicios.length} exercícios · ${videos.length} vídeos · ${laboratorios.length} laboratórios`);
} else {
  writeFileSync(DESTINO, conteudo);
  console.log(`✓ Banco gerado: ${exercicios.length} exercícios · ${videos.length} vídeos · ${laboratorios.length} laboratórios -> chat-companion/backend/banco.json`);
}
console.log("  por capítulo: " + Object.entries(porCapitulo).map(([c, n]) => `${c}:${n}`).join(" "));
