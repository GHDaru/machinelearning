// Gate do VIÉS DE COMPRIMENTO: marcar a alternativa mais longa não pode ser
// estratégia de prova.
//
// POR QUE ELE EXISTE, E POR QUE FALHA NAS DUAS DIREÇÕES
//
// O `ROADMAP.md` registra o achado D17: **88% das múltiplas do livro eram
// gabaritáveis marcando a alternativa mais longa.** A causa é conhecida e não é
// descuido — é assimetria de esforço. A alternativa certa tem de ser
// defensável, então ela ganha a ressalva, a condição e o "porque"; o distrator
// só precisa estar errado, e sai curto. O comprimento vira um canal lateral que
// entrega a resposta sem que o leitor abra o capítulo.
//
// O CONSERTO INGÊNUO CRIA O DEFEITO ESPELHADO, e isso aconteceu aqui. No ciclo
// que reescreveu o `II.2`, encurtar as corretas levou o capítulo de 88% para
// **0 de 26**. Zero está tão longe do acaso quanto 88%, só que do outro lado:
// com quatro alternativas, o acaso põe a correta no topo do ranking de
// comprimento em cerca de 25% dos itens, e quem aprende a RISCAR a mais longa
// elimina uma em quatro de graça. "A correta nunca é a mais longa" é uma regra
// tão explorável quanto "a correta é sempre a mais longa".
//
// Por isso o alvo não é "correta curta". É **comprimento indistinguível**: a
// correta cai no topo do ranking com a frequência que o acaso daria.
//
// A ESTATÍSTICA. Para cada múltipla de escolha única com N alternativas, a
// correta é "a mais longa" quando o comprimento dela empata ou supera o de
// todas as outras. Sob a hipótese nula (comprimento não informa nada), isso
// acontece com probabilidade 1/N. Somando os itens, o esperado é Σ 1/Nᵢ e a
// variância é Σ (1/Nᵢ)(1 − 1/Nᵢ). O desvio padronizado
//
//     z = (observado − esperado) / √variância
//
// é comparado com um teto BILATERAL. |z| > 2,5 reprova, e reprova tanto o excesso
// (a doença original) quanto a falta (a cura que virou doença).
//
// O TETO É 2,5, E NÃO 3, POR MEDIÇÃO. Um capítulo deste livro tem cerca de 26
// múltiplas. Com 26 itens de 4 alternativas, o pior caso possível da direção
// negativa — a correta NUNCA sendo a mais longa, que foi exatamente o estado em
// que o `II.2` ficou — dá z = −2,94. Um teto de 3 deixaria passar o defeito que
// originou este gate, e portanto seria decorativo justamente onde precisava
// morder. A 2,5, aquele estado reprova.
//
// O empate conta como "mais longa" de propósito: quem risca a mais longa também
// acerta quando ela está empatada em primeiro. Isso infla um pouco o esperado
// real acima de 1/N, o que torna o gate LEVEMENTE conservador contra o excesso
// e levemente severo contra a falta — e é o lado certo para errar, porque o
// excesso é o defeito que o livro tem.
//
// A DÍVIDA DECLARADA. Medido em 2026-09-01 sobre o banco inteiro: 278 múltiplas,
// 223 com a correta mais longa (80%) contra 70 esperadas. Cobrar isso hoje
// reprovaria 36 páginas de uma vez, e reescrever ~200 distratores é decisão de
// escopo editorial, não de portão. Então vale a mesma disciplina do
// `PROSA_PENDENTE`: a lista abaixo é COBRADA nas duas direções.
//
//   - página fora da lista entra na conta agregada e obedece ao |z| ≤ 3;
//   - página na lista é medida, relatada e não reprova — MAS precisa continuar
//     enviesada. Página que já foi consertada e continua na lista reprova o
//     build, porque dívida paga que não sai da lista esconde a próxima.
//
// Uso:  node publicar/gates/vies-de-comprimento.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extrair } from "../interativos.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const LIMITES = {
  // Teto bilateral do desvio padronizado na camada COBRADA. Ver o cabeçalho:
  // 2,5 é o que faz o caso 0-de-26 reprovar, e 3 não faria.
  z: 2.5,
  // Piso do desvio de uma página que se declara em dívida. Abaixo dele a página
  // já não está enviesada, e continuar na lista seria esconder o progresso.
  zDivida: 1,
  // Abaixo disto a página tem itens de menos para dizer qualquer coisa: ela é
  // relatada e não cobrada, em qualquer das duas camadas.
  minimoItens: 5,
};

// A dívida de D17, medida em 2026-09-01. Cada página que passar por um ciclo de
// reescrita sai daqui no mesmo commit — e o gate cobra a saída.
export const VIES_PENDENTE = new Set([
  "0-1-introducao", "0-2-fundamentos",
  "i-1-ciclo-ciencia-de-dados", "i-2-coleta-integracao", "i-3-dados",
  "i-4-analise-exploratoria", "i-5-visualizacao-storytelling", "i-6-representacao",
  "ii-1-avaliacao", "ii-3-regressao-logistica", "ii-4-otimizacao",
  "ii-5-arvores-ensembles", "ii-6-analise-multidimensional",
  "ii-7-series-temporais", "ii-8-do-modelo-a-decisao",
  "iii-1-neuronio-artificial", "iii-2-redes-neurais",
  "iii-3-treinar-redes-profundas", "iii-4-visao",
  "iii-5-sequencias-linguagem", "iii-6-modelos-de-fundacao",
  "iv-1-nao-supervisionado", "iv-2-reforco", "iv-3-ia-simbolica-fuzzy-evolutiva",
  "v-1-interpretabilidade-justica", "v-2-sistemas-de-ml", "v-3-mlops",
  "v-4-fronteira",
  "prova-abertura", "prova-final", "prova-iii-1",
  "prova-parte-i", "prova-parte-ii", "prova-parte-iii",
  "prova-parte-iv", "prova-parte-v",
]);

/**
 * A conta, isolada do disco para o teste poder dirigi-la.
 *
 * @param {{opcoes:{correta:boolean,texto:string}[]}[]} itens múltiplas de escolha única
 * @returns {{n:number,maisLonga:number,maisCurta:number,esperado:number,variancia:number,z:number}}
 */
export function estatistica(itens) {
  let n = 0, maisLonga = 0, maisCurta = 0, esperado = 0, variancia = 0;
  for (const it of itens) {
    const ops = it.opcoes || [];
    const certas = ops.filter((o) => o.correta);
    if (ops.length < 2 || certas.length !== 1) continue;
    const comps = ops.map((o) => String(o.texto).length);
    const c = comps[ops.findIndex((o) => o.correta)];
    n++;
    if (c >= Math.max(...comps)) maisLonga++;
    if (c <= Math.min(...comps)) maisCurta++;
    const p = 1 / ops.length;
    esperado += p;
    variancia += p * (1 - p);
  }
  const z = variancia > 0 ? (maisLonga - esperado) / Math.sqrt(variancia) : 0;
  return { n, maisLonga, maisCurta, esperado, variancia, z };
}

/**
 * Aplica a régua a um livro já agrupado por página.
 *
 * @param {Map<string, object[]>|Record<string, object[]>} porPagina
 * @returns {{problemas:string[], cobrado:object, divida:object[], resumo:string[]}}
 */
export function verificar(porPagina, pendentes = VIES_PENDENTE, limites = LIMITES) {
  const entradas = porPagina instanceof Map ? [...porPagina] : Object.entries(porPagina);
  const problemas = [];
  const divida = [];
  const cobrados = [];

  for (const [pagina, itens] of entradas) {
    const e = estatistica(itens);
    if (!e.n) continue;
    if (pendentes.has(pagina)) {
      divida.push({ pagina, ...e });
      // A cobrança da lista: quem já não está enviesado tem de sair dela.
      if (e.n >= limites.minimoItens && e.z < limites.zDivida) {
        problemas.push(
          `${pagina}: declarada em VIES_PENDENTE e já não está enviesada ` +
          `(${e.maisLonga}/${e.n} com a correta mais longa, esperado ${e.esperado.toFixed(1)}, z=${e.z.toFixed(2)}). ` +
          `Tire-a da lista no mesmo commit — dívida paga que continua declarada esconde a próxima.`
        );
      }
    } else {
      cobrados.push(...itens);
    }
  }

  const cobrado = { ...estatistica(cobrados), paginas: entradas.length - divida.length };
  if (cobrado.n >= limites.minimoItens && Math.abs(cobrado.z) > limites.z) {
    const lado = cobrado.z > 0
      ? "a correta é a mais longa vezes DEMAIS — quem marca a mais longa acerta sem ler"
      : "a correta é a mais longa vezes DE MENOS — quem RISCA a mais longa elimina de graça";
    problemas.push(
      `camada cobrada: ${lado}. ` +
      `${cobrado.maisLonga} de ${cobrado.n} itens, esperado ${cobrado.esperado.toFixed(1)}, ` +
      `z=${cobrado.z.toFixed(2)} (teto bilateral ${limites.z}).`
    );
  }

  const totalDivida = divida.reduce((a, d) => a + d.n, 0);
  const longaDivida = divida.reduce((a, d) => a + d.maisLonga, 0);
  const resumo = [
    `Viés de comprimento: ${cobrado.n} item(ns) cobrado(s) em ${cobrado.paginas} página(s) — ` +
    `${cobrado.maisLonga} com a correta mais longa, esperado ${cobrado.esperado.toFixed(1)}, z=${cobrado.z.toFixed(2)}.`,
  ];
  if (divida.length) {
    resumo.push(
      `   Dívida declarada (D17): ${divida.length} página(s), ${totalDivida} item(ns), ` +
      `${longaDivida} com a correta mais longa (${Math.round((100 * longaDivida) / totalDivida)}%). ` +
      `Estes números NÃO reprovam — existem para que ninguém precise descobrir sozinho o tamanho do que falta.`
    );
  }
  return { problemas, cobrado, divida, resumo };
}

/** Lê o livro do disco e agrupa as múltiplas de escolha única por página. */
export function lerLivro(raiz = RAIZ) {
  const porPagina = new Map();
  (function anda(dir) {
    for (const nome of readdirSync(dir)) {
      const caminho = join(dir, nome);
      if (statSync(caminho).isDirectory()) { anda(caminho); continue; }
      if (!nome.endsWith(".md")) continue;
      const pagina = nome.slice(0, -3);
      const fonte = readFileSync(caminho, "utf8");
      let lote;
      try { lote = extrair(fonte, caminho); } catch { continue; }  // erro de autoria é do outro gate
      const itens = lote.exercicios.filter((e) => e.tipo === "multipla");
      if (itens.length) porPagina.set(pagina, [...(porPagina.get(pagina) || []), ...itens]);
    }
  })(resolve(raiz, "livro"));
  return porPagina;
}

const executado = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (executado) {
  const { problemas, resumo } = verificar(lerLivro());
  resumo.forEach((l) => console.log(l));
  if (problemas.length) {
    console.error(`✗ ${problemas.length} problema(s) de viés de comprimento (D17):`);
    problemas.forEach((p) => console.error("   " + p));
    console.error("\n   Comprimento não pode informar a resposta em nenhuma das duas direções.");
    console.error("   Engorde o distrator onde isso o torna mais plausível, e devolva à correta");
    console.error("   a ressalva que ela precisa — nunca ajuste o comprimento pelo gabarito.");
    process.exit(1);
  }
  console.log("✓ o comprimento da alternativa não entrega a resposta na camada cobrada.");
}
