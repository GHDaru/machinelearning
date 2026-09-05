// Gate da ESCADA DA PRÁTICA: dentro de um nível, a exigência sobe.
//
// POR QUE ELE EXISTE
//
// A [ADR 0023](../../adr/0023-a-sequencia-do-ii-2-carga-cognitiva-e-a-escada.md)
// decidiu duas coisas e só uma virou portão. A decisão 1 (pré-requisito antes do
// uso) tem `pre-requisito.mjs`. A decisão 2 não tinha nada, e quem reordenou o
// `II.2` deixou a dívida escrita com todas as letras:
//
//   "Eu MEDI a escada e a deixei monótona dentro de cada nível, mas isso hoje é
//    sustentado por construção, não por asserção: qualquer edição futura pode
//    desfazer os 0,437 sem que nada acuse."
//
// O 0,437 é o ρ de Spearman entre a posição do cartão e a dificuldade declarada.
// Ele saiu de 0,173 porque alguém reordenou 38 cartões à mão. Nenhum arquivo do
// repositório o defendia, e a próxima edição do capítulo o desfaria em silêncio.
//
// O QUE SE COBRA, E DE ONDE CADA REGRA VEM
//
// A régua é a escada da [ADR 0014](../../adr/0014-tres-exercicios-por-objetivo-e-a-prova.md),
// decisão 2: o trio de um objetivo sobe, e o teto do trio é o verbo declarado.
//
//   E1  dois degraus abaixo do verbo   `dificuldade: facil`
//   E2  um degrau abaixo               `dificuldade: media`
//   E3  exatamente o verbo             `dificuldade: dificil`
//
// Quatro acusações, as quatro pedidas pela ADR 0023:
//
//   1. TETO NÃO ATINGIDO   objetivo sem nenhum exercício em E3. O trio nunca
//                          chega ao verbo que o capítulo prometeu.
//   2. TETO ULTRAPASSADO   exercício `aberta` sob objetivo cujo verbo está
//                          abaixo de Avaliar. É a letra da ADR 0014: "objetivo
//                          que diz Aplicar gera trio que termina em Aplicar, e
//                          nenhuma aberta". Mais o teto de custo do mesmo texto:
//                          no máximo uma `aberta` por objetivo.
//   3. QUEDA               dentro de um nível, a dificuldade cai mais de um
//                          degrau entre cartões consecutivos.
//   4. PLATÔ               dentro de um nível, mais de quatro cartões seguidos
//                          na mesma dificuldade.
//
// A DECISÃO CENTRAL: NENHUMA ETIQUETA NOVA
//
// O especialista 2 pediu um campo novo no exercício
// (`"exige":"reconhecer|calcular|produzir|transferir|decidir"`). Ele não existe,
// e este portão foi escrito sem pedi-lo, por dois motivos.
//
// O primeiro é de custo: `dificuldade` já é uma etiqueta escrita pelo autor, já
// vale em 460 exercícios, e a ADR 0014 já lhe deu exatamente três valores para
// exatamente três degraus. Uma segunda escala paralela precisaria ser mantida
// coerente com a primeira, e duas réguas que discordam não medem nada.
//
// O segundo é o que a medição mostrou. Com `dificuldade` como degrau, o `II.2`
// tem ρ = 0,437, zero queda dentro de nível, e um platô de cinco na abertura.
// A régua discrimina. Uma etiqueta nova cobraria 460 edições para dizer o que
// esta diz hoje.
//
// O PREÇO DESSA ESCOLHA, DECLARADO
//
// `dificuldade` é RELATIVA ao objetivo: um `dificil` promete o verbo, não prova
// que o cumpre. Um `multipla` de quatro alternativas rotulado `dificil` sob um
// objetivo que diz "derivar" passa neste portão e não faz ninguém derivar nada.
// É o defeito D1 do especialista 2 (catorze exercícios de O1, teto dois degraus
// abaixo), e ele continua sendo revisão humana. O portão cobra a COERÊNCIA da
// escada declarada; a correspondência entre o degrau e o gesto real, não.
//
// ONDE A REGRA NÃO VALE (ADR 0023, decisão 2)
//
//   - o bloco histórico, sob o cabeçalho "De onde isto veio": a ADR 0022
//     registra selo ❌ para a posição dele, e forçar escada ali fabricaria
//     exercício de derivação sobre Legendre;
//   - a `Verificação` (ADR 0012), que mede recuperação cumulativa e tem regra
//     própria;
//   - entre capítulos: a escada é intra-nível e intra-objetivo.
//
// A DÍVIDA DECLARADA, no molde do `PRE_REQUISITO_PENDENTE` e do
// `SIGLA_NUA_PENDENTE`: medida, relatada em TODA execução inclusive no verde, e
// cobrada nas duas direções. Item que sai da lista sem ser pago reprova; item
// que continua na lista depois de pago reprova também, porque dívida paga que
// segue declarada vira teto para a próxima.
//
// Uso:  node publicar/gates/escada.mjs
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Os três degraus da ADR 0014, na moeda que o autor já escreve.
export const DEGRAU = { facil: 1, media: 2, dificil: 3 };
export const NOME_DEGRAU = { 1: "E1", 2: "E2", 3: "E3" };
export const TETO = 3;                 // E3 é o degrau que alcança o verbo
export const PLATO_MAXIMO = 4;         // "mais de quatro" reprova, quatro passa
export const QUEDA_MAXIMA = 1;         // "maior que um degrau" reprova
export const RANK_DA_ABERTA = 5;       // só Avaliar e Criar puxam resposta aberta

const RE_CARTAO = /^:::cartao(-fim)?[ \t]*(\{[^\n]*\})?[ \t]*$/;
const RE_EXERCICIO = /^:::exercicio[ \t]*(\{[^\n]*\})[ \t]*$/;
const RE_TITULO = /^##[ \t]+(.+?)[ \t]*$/;
const RE_OBJETIVO = /^[-*]\s+\*\*(O\d+)\.?\*\*\s*(.+)$/;

// As duas isenções da ADR 0023, reconhecidas por marcador que o autor já
// escreve: o cabeçalho obrigatório do Princípio X e o título do cartão de
// fechamento. Nenhuma delas é uma lista de exceções que alguém precise manter.
const CABECALHO_ISENTO = /^de onde isto veio/i;
const CARTAO_ISENTO = /^verifica[çc][ãa]o/i;

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const normalizarVerbo = (s) => semAcento(String(s || "").toLowerCase().trim());

/**
 * A tabela de Bloom do Guia Editorial §2.5, lida do arquivo em vez de copiada
 * para cá. Copiar seria criar uma segunda tabela que envelhece sozinha, e o
 * guia é quem manda: "o exercício define o verbo, não o contrário".
 *
 * O nome do processo entra como verbo dele mesmo. Não é invenção: a coluna
 * "Processo" É a tabela, e "aplicar" abre nove objetivos do livro enquanto
 * "Aplicar" está ali na linha 3. Ler só a coluna dos exemplos deixaria de fora
 * o verbo mais usado do livro.
 *
 * @returns {Map<string, {rank:number, processo:string}>}
 */
export function tabelaDeBloom(guia) {
  const mapa = new Map();
  for (const linha of guia.split("\n")) {
    const m = linha.match(/^\|\s*([1-6])\s*\|\s*\*\*([^*|]+)\*\*\s*\|\s*([^|]+)\|/);
    if (!m) continue;
    const rank = Number(m[1]);
    const processo = m[2].trim();
    const verbos = [processo, ...m[3].split(/[,·]/)];
    for (const bruto of verbos) {
      const v = normalizarVerbo(bruto.replace(/\*\*/g, "").replace(/\(.*?\)/g, ""));
      if (/^[a-z]+$/.test(v)) mapa.set(v, { rank, processo });
    }
  }
  return mapa;
}

/**
 * Fatia o capítulo no que a escada precisa: os objetivos com o verbo que os
 * abre, e os cartões com o nível declarado e os exercícios que eles cobram.
 *
 * Isolado do disco para o teste poder dirigi-lo sem escrever arquivo nenhum.
 */
export function fatiarEscada(markdown) {
  const objetivos = [];
  const cartoes = [];
  let atual = null, cabecalho = "", emCerca = false;

  for (const linha of markdown.split("\n")) {
    if (/^(?:```|~~~)/.test(linha)) { emCerca = !emCerca; continue; }
    if (emCerca) continue;

    // O `##` do capítulo vem DEPOIS do marcador do cartão, não antes: o cartão
    // abre e o título da seção é a primeira linha dentro dele. Ler o cabeçalho
    // corrente no momento do marcador daria a seção ANTERIOR a cada cartão, e a
    // isenção do bloco histórico cairia sobre a "Síntese", que vem depois dele.
    // Medido: com o cabeçalho lido antes, N7 e N8 saíam como [1··] e [··].
    const tit = linha.match(RE_TITULO);
    if (tit) {
      cabecalho = tit[1].replace(/[*`]/g, "").trim();
      if (atual && !atual.temCabecalhoProprio) {
        atual.temCabecalhoProprio = true;
        atual.cabecalho = cabecalho;
        atual.isento = CABECALHO_ISENTO.test(cabecalho) || CARTAO_ISENTO.test(atual.titulo);
        for (const e of atual.exercicios) e.isento = e.isento || atual.isento;
      }
    }

    const obj = linha.match(RE_OBJETIVO);
    if (obj) {
      const texto = obj[2].replace(/[*`]/g, "").trim();
      const primeira = texto.split(/[\s,.:;]+/)[0] || "";
      objetivos.push({ id: obj[1], verbo: primeira, texto: texto.slice(0, 80) });
    }

    const marca = linha.match(RE_CARTAO);
    if (marca) {
      atual = null;
      if (!marca[1]) {
        let attrs = {};
        try { attrs = JSON.parse(marca[2] || "{}"); } catch { /* o build já reprova */ }
        atual = {
          n: cartoes.length + 1,
          nivel: attrs.nivel === undefined ? null : Number(attrs.nivel),
          titulo: String(attrs.titulo || ""),
          cabecalho,
          temCabecalhoProprio: false,
          isento: CABECALHO_ISENTO.test(cabecalho) || CARTAO_ISENTO.test(String(attrs.titulo || "")),
          exercicios: [],
        };
        cartoes.push(atual);
      }
      continue;
    }

    const ex = linha.match(RE_EXERCICIO);
    if (ex) {
      let attrs = {};
      try { attrs = JSON.parse(ex[1]); } catch { continue; }
      const item = {
        id: String(attrs.id || "?"),
        tipo: String(attrs.tipo || "?"),
        objetivo: String(attrs.objetivo || ""),
        dificuldade: String(attrs.dificuldade || "media"),
        secao: String(attrs.secao || ""),
        cartao: atual ? atual.n : null,
        nivel: atual ? atual.nivel : null,
        // Um exercício é isento se o cartão dele é isento, ou se ele mesmo se
        // declara da Verificação. As duas portas existem porque só metade do
        // livro está em modo cartão.
        isento: (atual ? atual.isento : false) || /^verifica/.test(String(attrs.secao || "")),
      };
      if (atual) atual.exercicios.push(item);
      else cartoes.push({ n: null, nivel: null, titulo: "", cabecalho, isento: item.isento, exercicios: [item], solto: true });
    }
  }

  return { objetivos, cartoes };
}

/** O degrau do cartão é o mais alto que ele cobra. */
const degrauDoCartao = (c) => {
  const g = c.exercicios.map((e) => DEGRAU[e.dificuldade]).filter(Boolean);
  return g.length ? Math.max(...g) : null;
};

/**
 * A régua, sobre um capítulo já fatiado.
 *
 * @param dispensas {{teto:Set<string>, aberta:Set<string>, plato:Set<string>}}
 *   o que este capítulo deve à lista de dívida, por chave.
 */
export function verificarCapitulo({ objetivos, cartoes }, bloom, dispensas = {}) {
  const problemas = [];
  const divida = [];
  const dispensa = (grupo, chave) => (dispensas[grupo] || new Set()).has(chave);

  const exercicios = cartoes.flatMap((c) => c.exercicios);
  const semRank = new Set();

  // ---------------------------------------------------------------- o teto
  //
  // O teto é cobrado sobre TODOS os exercícios do objetivo, isentos inclusive, e
  // isso não é descuido de fronteira: a isenção da ADR 0023 é da ORDENAÇÃO, não
  // do teto. Quem tentar o contrário mede o dano na hora — a `Verificação` é,
  // por decisão da ADR 0012, o lugar onde a pergunta-âncora virou exercício
  // corrigido justamente para PAGAR a dívida D13 (objetivo cobrado abaixo do
  // verbo). Tirá-la da conta do teto acusaria 19 objetivos de não alcançarem um
  // verbo que eles alcançam no cartão de fechamento. Medido, e desfeito.
  const porObjetivo = new Map();
  for (const e of exercicios) {
    if (!porObjetivo.has(e.objetivo)) porObjetivo.set(e.objetivo, []);
    porObjetivo.get(e.objetivo).push(e);
  }

  for (const o of objetivos) {
    const lista = porObjetivo.get(o.id) || [];
    // Objetivo cujos exercícios estão TODOS na área isenta sai da escada por
    // decisão da ADR 0023, não por descuido. O `O5` do `II.2` é exatamente isso.
    if (!lista.length) continue;

    const rank = bloom.get(normalizarVerbo(o.verbo));
    if (!rank) semRank.add(o.id);

    const atinge = lista.filter((e) => DEGRAU[e.dificuldade] >= TETO);
    if (!atinge.length) {
      const msg =
        `${o.id} ("${o.verbo}"): nenhum dos ${lista.length} exercício(s) chega ao degrau E3. ` +
        `O teto do trio é o verbo do objetivo (ADR 0014): sem um exercício "dificil", ` +
        `o capítulo promete "${o.verbo}" e cobra dois degraus abaixo.`;
      (dispensa("teto", o.id) ? divida : problemas).push(msg);
    } else if (dispensa("teto", o.id)) {
      problemas.push(
        `${o.id}: está declarado em TETO_PENDENTE e já tem exercício em E3 (${atinge[0].id}). ` +
        `Tire-o da lista no mesmo commit — dívida paga que continua declarada esconde a próxima.`
      );
    }

    const abertas = lista.filter((e) => e.tipo === "aberta");
    if (abertas.length > 1) {
      problemas.push(
        `${o.id}: ${abertas.length} exercícios "aberta" (${abertas.map((e) => e.id).join(", ")}). ` +
        `A ADR 0014 fixa no máximo UMA por objetivo, e a razão é de operação: cada aberta é ` +
        `uma chamada de modelo por aluno por tentativa.`
      );
    }
    for (const a of abertas) {
      if (!rank) continue;                       // sem rank, a regra não alcança
      if (rank.rank >= RANK_DA_ABERTA) {
        if (dispensa("aberta", a.id)) {
          problemas.push(
            `${a.id}: está declarado em ABERTA_ACIMA_PENDENTE e o verbo de ${o.id} ("${o.verbo}", ` +
            `${rank.processo}) já autoriza resposta aberta. Tire-o da lista.`
          );
        }
        continue;
      }
      const msg =
        `${a.id} (${o.id}, "${o.verbo}" = ${rank.processo}, nível ${rank.rank} de Bloom): ` +
        `exercício "aberta" sob objetivo abaixo de Avaliar. A ADR 0014 diz que só Avaliar e Criar ` +
        `puxam resposta aberta; aqui a evidência exige mais do que o objetivo prometeu. ` +
        `Ou o verbo sobe na declaração, ou o exercício desce de tipo.`;
      (dispensa("aberta", a.id) ? divida : problemas).push(msg);
    }
  }

  // -------------------------------------------------------------- a escada
  // Os cartões isentos não entram na sequência e também não emendam o que
  // ficou dos dois lados deles: eles CORTAM o nível. Emendar faria o portão
  // comparar dois cartões que o leitor nunca vê em seguida.
  const niveis = new Map();
  for (const c of cartoes) {
    if (c.nivel === null || c.solto) continue;
    if (!niveis.has(c.nivel)) niveis.set(c.nivel, []);
    niveis.get(c.nivel).push(c);
  }

  const medidasNivel = [];
  for (const [nivel, lista] of [...niveis].sort((a, b) => a[0] - b[0])) {
    const perfil = [];
    let corrida = 0, maiorPlato = 0, anterior = null, quedas = 0, quedasDeUm = 0;

    for (const c of lista) {
      if (c.isento) { anterior = null; corrida = 0; perfil.push("·"); continue; }
      const g = degrauDoCartao(c);
      if (g === null) { anterior = null; corrida = 0; perfil.push("?"); continue; }
      perfil.push(String(g));

      if (anterior && anterior.g - g > QUEDA_MAXIMA) {
        quedas++;
        const msg =
          `nível ${nivel}: a dificuldade cai de ${NOME_DEGRAU[anterior.g]} no cartão ${anterior.n} ` +
          `("${anterior.titulo}") para ${NOME_DEGRAU[g]} no cartão ${c.n} ("${c.titulo}"). ` +
          `Queda de ${anterior.g - g} degraus dentro do mesmo nível: quem acabou de decidir volta a reconhecer.`;
        (dispensa("queda", `${nivel}:${c.n}`) ? divida : problemas).push(msg);
      } else if (anterior && anterior.g > g) {
        quedasDeUm++;
      }

      corrida = anterior && anterior.g === g ? corrida + 1 : 1;
      if (corrida > maiorPlato) maiorPlato = corrida;
      if (corrida > PLATO_MAXIMO) {
        const msg =
          `nível ${nivel}: ${corrida} cartões seguidos em ${NOME_DEGRAU[g]}, terminando no cartão ${c.n} ` +
          `("${c.titulo}"). Mais de ${PLATO_MAXIMO} sem subir é platô: o leitor repete o mesmo gesto ` +
          `e o capítulo não descobre se ele avançou.`;
        (dispensa("plato", `${nivel}`) ? divida : problemas).push(msg);
      }
      anterior = { g, n: c.n, titulo: c.titulo };
    }

    if (maiorPlato <= PLATO_MAXIMO && dispensa("plato", `${nivel}`)) {
      problemas.push(
        `nível ${nivel}: está declarado em PLATO_PENDENTE e o maior platô hoje é de ${maiorPlato} ` +
        `cartão(ões), dentro do teto de ${PLATO_MAXIMO}. Tire-o da lista.`
      );
    }
    medidasNivel.push({ nivel, cartoes: lista.length, perfil: perfil.join(""), maiorPlato, quedas, quedasDeUm });
  }

  return {
    problemas, divida, medidasNivel, semRank: [...semRank],
    objetivos: objetivos.length,
    exercicios: exercicios.length,
    isentos: exercicios.filter((e) => e.isento).length,
    rho: spearman(cartoes),
  };
}

/**
 * ρ de Spearman entre a posição do cartão e a dificuldade declarada. É o número
 * que a ADR 0023 publicou (0,173 antes, 0,437 depois) e que ninguém defendia.
 * Conta TODOS os cartões com nível, isentos inclusive, porque é assim que o
 * número publicado foi medido e um resumo que não reproduz o publicado não
 * serve para comparar com ele.
 * Ele NÃO reprova: correlação é resumo, e resumo não diz onde consertar. Serve
 * para que a regressão apareça no relatório antes de aparecer no leitor.
 */
export function spearman(cartoes) {
  const pares = [];
  for (const c of cartoes) {
    if (c.nivel === null || c.solto) continue;
    const g = degrauDoCartao(c);
    if (g !== null) pares.push([c.n, g]);
  }
  if (pares.length < 3) return null;
  const postos = (v) => {
    const ord = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const r = new Array(v.length);
    let i = 0;
    while (i < ord.length) {
      let j = i;
      while (j + 1 < ord.length && ord[j + 1][0] === ord[i][0]) j++;
      const m = (i + j) / 2 + 1;
      for (let k = i; k <= j; k++) r[ord[k][1]] = m;
      i = j + 1;
    }
    return r;
  };
  const ra = postos(pares.map((p) => p[0])), rb = postos(pares.map((p) => p[1]));
  const n = pares.length;
  const media = (v) => v.reduce((a, b) => a + b, 0) / n;
  const ma = media(ra), mb = media(rb);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    const x = ra[i] - ma, y = rb[i] - mb;
    num += x * y; da += x * x; db += y * y;
  }
  return da && db ? num / Math.sqrt(da * db) : null;
}

// ------------------------------------------------------- a dívida declarada
//
// Medida em 2026-09-05, com `node publicar/gates/escada.mjs`. Cada linha diz o
// capítulo, a chave e o porquê. Nada aqui reprova; tudo aqui é relatado em toda
// execução, e some da lista no commit que paga.

// Objetivos cujo trio nunca chega a E3. Quatro, em dois capítulos. É trabalho de
// conteúdo (escrever o exercício que falta), não de portão.
export const TETO_PENDENTE = new Map([
  ["i-1-ciclo-ciencia-de-dados", new Set(["O1", "O4"])],
  ["i-4-analise-exploratoria", new Set(["O1", "O2"])],
]);

// Exercícios `aberta` sob objetivo abaixo de Avaliar. A regra é da ADR 0014, de
// 2026-08-13, e nunca teve quem a cobrasse: são 22 exercícios em 15 capítulos,
// de 50 abertas no livro. Seis deles abrem objetivo com o verbo "Aplicar", que a
// ADR nomeia de propósito: "objetivo que diz Aplicar gera trio que termina em
// Aplicar, e nenhuma aberta".
// A saída é a mesma dos dois lados — ou o verbo do objetivo estava subdeclarado
// e sobe, ou o exercício desce de tipo.
export const ABERTA_ACIMA_PENDENTE = new Map([
  ["i-1-ciclo-ciencia-de-dados", new Set(["ciclo-ciencia-de-dados-e3"])],
  ["i-3-dados", new Set(["dados-e5"])],
  ["i-6-representacao", new Set(["representacao-e4"])],
  ["ii-7-series-temporais", new Set(["series-temporais-e3", "series-temporais-e4"])],
  ["iii-2-redes-neurais", new Set(["redes-neurais-e3", "redes-neurais-e4", "redes-neurais-e18"])],
  ["iii-3-treinar-redes-profundas", new Set(["treinar-redes-profundas-e3", "treinar-redes-profundas-e5"])],
  ["iii-4-visao", new Set(["visao-e3"])],
  ["iii-5-sequencias-linguagem", new Set(["sequencias-linguagem-e3", "sequencias-linguagem-e4"])],
  ["iii-6-modelos-de-fundacao", new Set(["modelos-de-fundacao-e4"])],
  ["iv-1-nao-supervisionado", new Set(["nao-supervisionado-e4"])],
  ["iv-2-reforco", new Set(["reforco-e3"])],
  ["iv-3-ia-simbolica-fuzzy-evolutiva",
    new Set(["ia-simbolica-fuzzy-evolutiva-e3", "ia-simbolica-fuzzy-evolutiva-e4"])],
  ["v-1-interpretabilidade-justica",
    new Set(["interpretabilidade-justica-e3", "interpretabilidade-justica-e4"])],
  ["v-3-mlops", new Set(["mlops-e2"])],
  ["v-4-fronteira", new Set(["fronteira-e2"])],
]);

// O platô que sobrou da reordenação do `II.2`, e que o relatório da reordenação
// não mencionou. O especialista 2 mediu seis cartões seguidos de reconhecimento
// na abertura; depois de reordenar são CINCO, e cinco continua sendo mais do que
// quatro. A escada do capítulo começa plana, e é o começo que decide quem fica.
export const PLATO_PENDENTE = new Map([
  ["ii-2-modelos-lineares", new Set(["1"])],
]);

// Nenhuma queda de mais de um degrau dentro de nível no livro inteiro. A lista
// existe vazia de propósito, como a `ORFAOS_ACEITOS` do `exercicios.mjs`: é a
// forma de a próxima queda ter de ser declarada por escrito em vez de aceita.
export const QUEDA_PENDENTE = new Map();

// Capítulos sem `:::cartao` com `nivel`: a metade "escada" não é cobrada neles,
// porque não há nível declarado onde medir queda ou platô. O teto CONTINUA
// cobrado, porque objetivo e dificuldade existem em todo capítulo.
export const SEM_NIVEL_PENDENTE = new Set([
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
]);

export function lerLivro(raiz = RAIZ) {
  const guia = readFileSync(resolve(raiz, "livro", "GUIA-EDITORIAL.md"), "utf8");
  const dir = resolve(raiz, "livro", "capitulos");
  const capitulos = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ slug: basename(f, ".md"), fonte: readFileSync(join(dir, f), "utf8") }));
  return { guia, capitulos };
}

export function verificar({ guia, capitulos }, listas = {}) {
  const teto = listas.teto || TETO_PENDENTE;
  const aberta = listas.aberta || ABERTA_ACIMA_PENDENTE;
  const plato = listas.plato || PLATO_PENDENTE;
  const queda = listas.queda || QUEDA_PENDENTE;
  const semNivel = listas.semNivel || SEM_NIVEL_PENDENTE;

  const bloom = tabelaDeBloom(guia);
  const problemas = [];
  const divida = [];
  const linhasNivel = [];
  const conta = {
    capitulos: 0, objetivos: 0, exercicios: 0, isentos: 0,
    comNivel: 0, niveis: 0, cartoes: 0, semRank: 0, semNivelDeclarado: 0,
  };

  for (const cap of capitulos) {
    const fatia = fatiarEscada(cap.fonte);
    if (!fatia.objetivos.length && !fatia.cartoes.length) continue;
    const r = verificarCapitulo(fatia, bloom, {
      teto: teto.get(cap.slug),
      aberta: aberta.get(cap.slug),
      plato: plato.get(cap.slug),
      queda: queda.get(cap.slug),
    });
    conta.capitulos++;
    conta.objetivos += r.objetivos;
    conta.exercicios += r.exercicios;
    conta.isentos += r.isentos;
    conta.semRank += r.semRank.length;

    const temNivel = r.medidasNivel.length > 0;
    if (temNivel) {
      conta.comNivel++;
      conta.niveis += r.medidasNivel.length;
      conta.cartoes += r.medidasNivel.reduce((a, m) => a + m.cartoes, 0);
      const rho = r.rho === null ? "—" : r.rho.toFixed(3).replace(".", ",");
      linhasNivel.push(
        `   ${cap.slug}: ρ(posição × dificuldade) = ${rho} · ` +
        r.medidasNivel.map((m) => `N${m.nivel}[${m.perfil}]`).join(" ")
      );
      if (semNivel.has(cap.slug)) {
        problemas.push(
          `${cap.slug}: está em SEM_NIVEL_PENDENTE e já declara ${r.medidasNivel.length} nível(is) ` +
          `no marcador do cartão. Tire-o da lista — a escada dele passou a ser cobrada.`
        );
      }
    } else {
      conta.semNivelDeclarado++;
      if (!semNivel.has(cap.slug)) {
        problemas.push(
          `${cap.slug}: não declara "nivel" em cartão nenhum, e não está em SEM_NIVEL_PENDENTE. ` +
          `Ou o capítulo ganha o baralho anotado, ou entra na lista de dívida com data.`
        );
      }
    }
    problemas.push(...r.problemas.map((p) => `${cap.slug} · ${p}`));
    divida.push(...r.divida.map((p) => `${cap.slug} · ${p}`));
  }

  const resumo = [
    `Escada da prática: ${conta.capitulos} capítulo(s), ${conta.objetivos} objetivo(s), ` +
    `${conta.exercicios} exercício(s) — ${conta.isentos} isento(s) pelo bloco histórico ou pela Verificação. ` +
    `Teto cobrado em todos; escada cobrada em ${conta.comNivel} capítulo(s), ` +
    `${conta.niveis} nível(is), ${conta.cartoes} cartões.`,
    ...linhasNivel,
  ];
  if (conta.semRank) {
    resumo.push(
      `   Fora do alcance do teto: ${conta.semRank} objetivo(s) abrem com verbo que não está na ` +
      `tabela de Bloom do Guia Editorial §2.5. A regra da "aberta" não os alcança, e o silêncio ` +
      `sobre eles é este número.`
    );
  }
  if (divida.length || conta.semNivelDeclarado) {
    resumo.push(
      `   Dívida declarada: ${divida.length} achado(s) dispensado(s) e ` +
      `${conta.semNivelDeclarado} capítulo(s) sem nível declarado. ` +
      `Estes números NÃO reprovam — existem para que ninguém precise descobrir sozinho o tamanho do que falta.`
    );
    divida.forEach((d) => resumo.push("      · " + d));
  }
  return { problemas, divida, resumo, conta };
}

const executado = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (executado) {
  const { problemas, resumo } = verificar(lerLivro());
  resumo.forEach((l) => console.log(l));
  if (problemas.length) {
    console.error(`✗ ${problemas.length} problema(s) de escada:`);
    problemas.forEach((p) => console.error("   " + p));
    console.error("\n   A régua é a da ADR 0014: E1 dois degraus abaixo do verbo, E2 um degrau abaixo,");
    console.error("   E3 exatamente o verbo. `dificuldade` é o degrau: facil, media, dificil.");
    console.error("   Dentro de um nível a exigência não cai mais de um degrau nem repousa mais de quatro cartões.");
    process.exit(1);
  }
  console.log("✓ a escada sobe dentro de cada nível, e todo objetivo cobrado alcança o próprio verbo.");
}
