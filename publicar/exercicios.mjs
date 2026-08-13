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

// Backward Design é a regra do projeto: objetivos -> evidências -> conteúdo. O
// gate abaixo era UNIDIRECIONAL — proibia exercício apontando para objetivo
// inexistente, e nada proibia objetivo sem exercício. Foi por essa porta que 18
// dívidas entraram sem registro: o roadmap declarava 2 objetivos órfãos e o
// livro tinha 20.
//
// A lista de exceções é a dívida COBRADA, não registrada. Falha nas DUAS
// direções: um órfão novo quebra o build, e uma exceção que deixou de ser
// necessária também — para que pagar a dívida obrigue a tirá-la daqui.
// As duas que sobraram NÃO são falta de exercício: são falta de CONTEÚDO, e
// escrever exercício sobre o que o capítulo não ensina seria pior que a dívida.
//   v-2 O4 (decidir entre lote e tempo real pelo requisito) — o capítulo não
//     ensina isso; quem ensina é o v-3, na seção "Servir", com a tabela das três
//     formas e a frase "escolhidas pelo requisito e não pelo gosto". O objetivo
//     está no capítulo errado, e mover conteúdo é decisão editorial, não de gate.
//   v-3 O2 (implantar atrás de API com contrato e validação de entrada) — o
//     capítulo cobre servir e monitorar, e não o contrato da API.
// Nos dois casos a saída é "o verbo desce ou o conteúdo sobe" (dívida D13).
const ORFAOS_ACEITOS = new Map(Object.entries({
  "livro/capitulos/v-2-sistemas-de-ml.md": ["O4"],
  "livro/capitulos/v-3-mlops.md": ["O2"],
}));

const objetivosPorArquivo = new Map();
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
  objetivosPorArquivo.set(item.arquivo, objetivos);

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
      // Desafio de fim de capítulo cobra produção de artefato ou demonstração,
      // e rubrica de 2 critérios não decide nada nesse nível (ADR 0012): o
      // quarto slot é o ANTI-CRITÉRIO — o movimento errado comum, nomeado.
      // A rubrica é quebrada em `;` e quebra de linha. Um `;` DENTRO de um
      // critério — tipicamente numa lista entre parênteses — parte um critério
      // em três, e como `correto = atendidos == total`, os pedaços viram
      // exigências conjuntas. O caso real: "aponta ao menos um mecanismo (A; B;
      // C)" virou "aponta ao menos um mecanismo (A", "B", "C)" — e quem
      // respondesse exatamente o pedido falharia em dois critérios.
      // Parêntese desbalanceado é a assinatura confiável dessa quebra.
      ex.criterios.forEach((c, i) => {
        if ((c.match(/\(/g) || []).length !== (c.match(/\)/g) || []).length) {
          problemas.push(`${item.arquivo} · ${ex.id}: critério ${i + 1} tem parêntese desbalanceado — ` +
            `um ";" dentro do critério o partiu. Use vírgula ou "ou": "${c.slice(0, 60)}…"`);
        }
      });
      // O parêntese pega a maioria dos casos e NÃO pega uma lista com `;` sem
      // parêntese — aconteceu, e virou 8 critérios de um enunciado que pedia
      // "ao menos três". O teto é a segunda rede: rubrica boa discrimina com
      // 4 a 6 critérios, e como a correção exige TODOS, cada critério a mais é
      // uma exigência a mais que o autor provavelmente não quis criar.
      const TETO = 6;
      if (ex.criterios.length > TETO) {
        problemas.push(`${item.arquivo} · ${ex.id}: ${ex.criterios.length} critérios (teto ${TETO}). ` +
          `Um ";" numa lista dentro do critério o parte em vários — e a correção exige todos. Use vírgula ou "ou".`);
      }
      const minimo = ex.secao === "verificacao" ? 4 : 2;
      if (ex.criterios.length < minimo) {
        problemas.push(`${item.arquivo} · ${ex.id}: rubrica precisa de ao menos ${minimo} critérios` +
          (minimo === 4 ? " (desafio de fechamento — inclua o anti-critério)" : ""));
      }
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

// ---- Backward Design nas DUAS direções ----
const cobertos = new Map();
for (const ex of exercicios) {
  if (!cobertos.has(ex.arquivo)) cobertos.set(ex.arquivo, new Set());
  cobertos.get(ex.arquivo).add(ex.objetivo);
}
for (const [arquivo, objetivos] of objetivosPorArquivo) {
  const tem = cobertos.get(arquivo) || new Set();
  const aceitos = new Set(ORFAOS_ACEITOS.get(arquivo) || []);
  for (const o of [...objetivos].filter((x) => !tem.has(x))) {
    if (!aceitos.has(o)) {
      problemas.push(`${arquivo}: objetivo ${o} não tem nenhum exercício. ` +
        `Escreva o exercício, ou declare a dívida em ORFAOS_ACEITOS — e no roadmap.`);
    }
  }
  for (const o of aceitos) {
    if (!objetivos.has(o)) {
      problemas.push(`${arquivo}: ORFAOS_ACEITOS lista ${o}, que não existe mais no capítulo.`);
    } else if (tem.has(o)) {
      problemas.push(`${arquivo}: ${o} já tem exercício — tire-o de ORFAOS_ACEITOS. ` +
        `Dívida paga que continua na lista esconde a próxima.`);
    }
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
