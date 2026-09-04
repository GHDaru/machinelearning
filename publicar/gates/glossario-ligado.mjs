// Gate do GLOSSÁRIO LIGADO: termo do glossário que aparece num cartão é
// ligado ao glossário no primeiro uso DAQUELE cartão.
//
// POR QUE ELE EXISTE
//
// A régua foi medida numa página real do Google Machine Learning Crash Course,
// a de perda da regressão linear: nove termos ligados ao glossário numa página
// só, cada um no primeiro uso, e o leitor nunca precisa sair para descobrir o
// que a palavra quer dizer. Medido aqui no mesmo dia, o nosso livro tinha
// **zero**: nenhum dos 27 capítulos apontava para `livro/glossario.md`, que
// existia com 8 verbetes e para o qual ninguém apontava.
//
// Não é imitação de estilo. O Princípio VIII da constituição já mandava abrir a
// sigla no primeiro uso e pôr o termo novo no glossário; a régua só tornou
// visível que a regra não era cobrada por ninguém. Teoria que não vira asserção
// volta a ser opinião.
//
// A UNIDADE É O CARTÃO, E ESSA É A DECISÃO CENTRAL
//
// O capítulo II.2 tem 39 cartões, e no modo cartão o leitor vê **um por vez**.
// "Primeira ocorrência no capítulo" é uma regra escrita para quem rola a página
// inteira: ela põe o link no cartão 3 e deixa sem link o leitor que abriu o
// cartão 27, que é justamente quem tem menos tela para ir procurar. Um link que
// mora noutro cartão, para esse leitor, não existe.
//
// Por isso a régua aqui é **primeira ocorrência por cartão**:
//
//   1. termo do glossário usado na prosa de um cartão é ligado ali, uma vez;
//   2. a ligação fica na PRIMEIRA ocorrência do termo naquele cartão — link
//      depois de duas menções soltas chega tarde para quem já leu as duas;
//   3. uma só por cartão. A segunda não informa nada e vira ruído azul.
//
// A exceção é o cartão que **apresenta** o termo: quando o título do cartão ou
// um cabeçalho dentro dele nomeia o termo, a definição está ali, no corpo, com
// mais contexto do que a linha do glossário daria. Ali o link é permitido e não
// é exigido. Fora isso, todo cartão se banca sozinho.
//
// O QUE ENTRA NA CONTA — e três recortes que precisam de justificativa
//
//   - **Fora: as alternativas de exercício e de interação.** O gate D17
//     (`vies-de-comprimento.mjs`) mede o COMPRIMENTO EM CARACTERES do texto
//     bruto de cada alternativa para decidir se o comprimento entrega a
//     resposta. `[resíduo](../glossario.md#regressao-linear)` não muda uma
//     palavra para o leitor e acrescenta 38 caracteres à alternativa — ligar
//     dentro de alternativa corromperia a medição do outro gate, e o viés
//     entraria pela porta que ninguém está olhando. Alternativa não se liga.
//   - **Fora: o lado da resposta** (`> **gabarito:**`, `> **porque:**`,
//     `> **revela:**`, `> **rubrica:**`, `> **pergunta:**`). O gabarito e o
//     feedback nem chegam ao HTML — quem corrige é o backend (Princípio VIII.3)
//     —, e a revelação da interação é a recompensa de um gesto, não o lugar de
//     mandar o leitor embora para outra página. Prosa e enunciado ficam dentro.
//   - **Fora: código.** Cerca e trecho em crase são nomes de coluna e de
//     função (`preco`, `panfletos`), não o termo do glossário.
//
//   O que sobra é o que o leitor lê como texto: a prosa do cartão, os
//   cabeçalhos e os enunciados.
//
// A DÍVIDA DECLARADA. São 27 capítulos e **zero** ligações em 2026-09-04.
// Cobrar os 27 de uma vez reprovaria o livro inteiro no primeiro dia, e ligar
// ~26 capítulos é decisão de escopo editorial, não de portão. Vale a mesma
// disciplina do `VIES_PENDENTE`: a lista abaixo é medida, relatada e não
// reprova — MAS o capítulo que já ligou tudo tem de sair dela no mesmo commit,
// porque dívida paga que continua declarada esconde a próxima.
//
// O resumo imprime os dois números em TODA execução, inclusive quando passa. É
// o que impede a camada de dívida de virar silêncio.
//
// Uso:  node publicar/gates/glossario-ligado.mjs
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Sem acento e em caixa baixa — a comparação é entre palavras, não entre grafias. */
export const normalizar = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** O mesmo slug do `markdown-it-anchor` no `build.mjs` — as âncoras têm de bater. */
export const slugificar = (s) =>
  normalizar(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// FORMAS QUE O GATE SE RECUSA A PROCURAR, e o motivo de cada uma. Sem esta
// lista o gate exigiria link em cima de palavra comum do português, e um gate
// que pede o errado é pior que um gate ausente: ele ensina a desobedecer.
export const AMBIGUAS = new Map([
  ["exemplo", "no livro é a linha dos dados; em português é o caso ilustrativo, e o capítulo usa os dois sentidos no mesmo cartão"],
  ["instancia", "mesmo caso de 'exemplo'"],
  ["observacao", "na seção histórica são as medições do cometa, não a linha de uma tabela"],
  ["cerca", "'cerca de 26 °C' é quantificador, não o limite do boxplot"],
  ["chance", "o próprio glossário avisa: em português corrente significa probabilidade"],
  ["dobra", "'dobra a provisão' é o verbo dobrar, não a parte da validação cruzada"],
  ["moda", "a medida de centro colide com o uso corrente da palavra"],
  ["precisao", "'mais precisão na conta' não é a métrica de classificação"],
  ["sensibilidade", "'a sensibilidade do resíduo ao parâmetro' é derivada, não revocação"],
  ["label", "aparece em inglês dentro de nome de campo, não como o alvo"],
]);

/**
 * Lê os verbetes do glossário.
 *
 * Um verbete é uma linha de tabela ou de lista que começa por `**Termo**`, com
 * as variantes entre parênteses logo depois: `**Viés** (*bias*)`. A sigla em
 * caixa alta é descartada de propósito — o motor já a embrulha em `<abbr>` com
 * a expansão no `title` (`build.mjs`), e exigir link em cima disso duplicaria
 * um mecanismo que já funciona. O que sobra é o termo por extenso.
 *
 * @returns {{termo:string, secao:string, ancora:string, formas:string[]}[]}
 */
export function termosDoGlossario(fonte) {
  const termos = [];
  let secao = "", ancora = "";
  for (const linha of fonte.split("\n")) {
    const cab = linha.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (cab) { secao = cab[2]; ancora = slugificar(cab[2]); continue; }
    if (!/^\s*(\||-\s)/.test(linha)) continue;
    const m = linha.match(/\*\*(.+?)\*\*\s*(?:\(([^)]*)\))?/);
    if (!m) continue;
    const limpa = (t) => t.replace(/[*`]/g, "").trim();
    const formas = [m[1], ...(m[2] ? m[2].split(",") : [])]
      .map(limpa)
      .filter(Boolean)
      // Sigla, número de quartil e afins: caixa alta, já servidos pelo <abbr>.
      .filter((t) => !/^[A-Z0-9²ᵐ/ –-]+$/.test(t))
      .map(normalizar)
      .filter((f) => !AMBIGUAS.has(f));
    if (formas.length) termos.push({ termo: limpa(m[1]), secao, ancora, formas });
  }
  return termos;
}

const RE_MARCADOR = /^:::cartao(-fim)?[ \t]*(\{[^\n]*\})?[ \t]*$/;
// O `:::aprofundar` NÃO entra na lista acima, e a distinção é o miolo da coisa.
//
// `emBloco` não descarta o corpo de um bloco: descarta a linha de alternativa e
// o lado da resposta. Está certo assim, porque o ENUNCIADO de um exercício é
// texto que o leitor lê, e um termo que estreia ali estreia de verdade.
//
// O aprofundamento é o contrário: ele vira um `<details>` que nasce fechado, e
// o corpo INTEIRO fica fora da tela. A regra deste gate é "ligue no primeiro
// uso", e primeiro uso quer dizer a primeira vez que o LEITOR vê a palavra. Sem
// a regra abaixo, um termo cuja primeira menção caísse num aprofundamento seria
// cobrado ali, e o autor poria o link no único lugar do cartão onde a maioria
// nunca olha. O gate satisfeito e o leitor desamparado é a pior combinação que
// um portão pode produzir.
//
// A consequência aceita: termo que só aparece dentro de aprofundamento não tem
// link exigido. Aprofundamento é profundidade para quem já seguiu o fluxo
// principal, e exigir ligação num lugar opcional é pedir ao autor um trabalho
// que não chega a quem precisa.
//
// Os dois construtores desta rodada acharam esta emenda um no trabalho do outro,
// cada um do seu lado, antes de ela custar alguma coisa. Hoje ainda é latente:
// nenhum capítulo usa o bloco.
const RE_APROFUNDAR = /^:::aprofundar\b/;
const RE_ABRE_BLOCO = /^:::(exercicio|video|lab|interacao)\b/;
const RE_FECHA_BLOCO = /^:::[ \t]*$/;
const RE_OPCAO = /^\s*-\s*(\[[ xX?]\]|\([ !]\))/;

/**
 * Fatia o Markdown em cartões e devolve, de cada um, o texto que o leitor lê.
 *
 * O trecho anterior ao primeiro `:::cartao` e o posterior ao `:::cartao-fim`
 * final são as pontas permitidas (ver `cartoes.mjs`) e ficam fora: lá moram o
 * cabeçalho e o selo de data, que não são prosa do baralho.
 *
 * CAPÍTULO SEM MARCADOR CAI NO CORTE POR CABEÇALHO, e isso não é conveniência:
 * é o que o leitor recebe. O `tema/cartoes.js` abre um cartão a cada `<h2>` ou
 * `<h3>` quando o autor não declarou corte nenhum, e são 26 capítulos nessa
 * situação. Se aqui eles devolvessem zero cartão, a camada de dívida imprimiria
 * "0 usos" com ar de coisa resolvida — que é a forma mais silenciosa de um gate
 * mentir. Medidos pelo corte real, eles dizem o tamanho do que falta.
 *
 * @returns {{titulo:string, cabecalhos:string[], legivel:string, ligacoes:{ini:number,fim:number,texto:string,alvo:string}[]}[]}
 */
export function fatiarCartoes(markdown) {
  const linhas = markdown.split("\n");
  const cartoes = [];
  let atual = null, emBloco = false, emCerca = false, emAprofundamento = false;

  for (const linha of linhas) {
    if (/^(?:```|~~~)/.test(linha)) { emCerca = !emCerca; continue; }
    if (emCerca) continue;

    const marca = linha.match(RE_MARCADOR);
    if (marca) {
      atual = null;
      emBloco = false;
      emAprofundamento = false;
      if (!marca[1]) {
        let attrs = {};
        try { attrs = JSON.parse(marca[2] || "{}"); } catch { /* o build já reprova */ }
        atual = { titulo: String(attrs.titulo || ""), cabecalhos: [], bruto: [] };
        cartoes.push(atual);
      }
      continue;
    }
    if (!atual) continue;

    if (RE_APROFUNDAR.test(linha)) { emAprofundamento = true; continue; }
    if (emAprofundamento) { if (RE_FECHA_BLOCO.test(linha)) emAprofundamento = false; continue; }
    if (RE_ABRE_BLOCO.test(linha)) { emBloco = true; continue; }
    if (RE_FECHA_BLOCO.test(linha)) { emBloco = false; continue; }
    if (RE_OPCAO.test(linha)) continue;              // alternativa: ver cabeçalho
    if (emBloco && /^\s*>/.test(linha)) continue;    // o lado da resposta

    const cab = linha.match(/^#{2,6}\s+(.+?)\s*$/);
    if (cab) atual.cabecalhos.push(cab[1]);
    atual.bruto.push(linha);
  }

  const montar = (c) => {
    const { texto, ligacoes } = desdobrarLinks(c.bruto.join("\n"));
    return { titulo: c.titulo, cabecalhos: c.cabecalhos, legivel: texto, ligacoes };
  };
  if (cartoes.length) return cartoes.map(montar);
  return fatiarPorCabecalho(markdown).map(montar);
}

/** O corte automático do `tema/cartoes.js`: um cartão a cada `<h2>` ou `<h3>`. */
function fatiarPorCabecalho(markdown) {
  const cartoes = [];
  let atual = null, emBloco = false, emCerca = false, emAprofundamento = false;
  for (const linha of markdown.split("\n")) {
    if (/^(?:```|~~~)/.test(linha)) { emCerca = !emCerca; continue; }
    if (emCerca) continue;
    const cab = linha.match(/^#{2,3}\s+(.+?)\s*$/);
    if (cab) {
      atual = { titulo: cab[1], cabecalhos: [cab[1]], bruto: [linha] };
      cartoes.push(atual);
      emBloco = false;
      emAprofundamento = false;
      continue;
    }
    if (!atual) continue;                            // o que vem antes do 1º cabeçalho
    if (RE_APROFUNDAR.test(linha)) { emAprofundamento = true; continue; }
    if (emAprofundamento) { if (RE_FECHA_BLOCO.test(linha)) emAprofundamento = false; continue; }
    if (RE_ABRE_BLOCO.test(linha)) { emBloco = true; continue; }
    if (RE_FECHA_BLOCO.test(linha)) { emBloco = false; continue; }
    if (RE_OPCAO.test(linha)) continue;
    if (emBloco && /^\s*>/.test(linha)) continue;
    atual.bruto.push(linha);
  }
  return cartoes;
}

/**
 * Troca cada `[texto](alvo)` pelo texto que o leitor vê e anota onde ele ficou.
 *
 * É o que permite cobrar POSIÇÃO, e não só presença: com o link desdobrado, a
 * primeira ocorrência do termo tem um índice no mesmo texto em que as ligações
 * têm intervalo, e dá para perguntar se ela caiu dentro de uma delas.
 * O trecho em crase vira espaço em branco do mesmo tamanho, para não deslocar
 * nada e não casar `preco` com o termo do glossário.
 */
export function desdobrarLinks(md) {
  const semCodigo = md.replace(/`[^`\n]*`/g, (t) => " ".repeat(t.length));
  const ligacoes = [];
  let texto = "";
  const re = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
  let ultimo = 0, m;
  while ((m = re.exec(semCodigo))) {
    texto += semCodigo.slice(ultimo, m.index);
    const ini = texto.length;
    texto += m[1];
    ligacoes.push({ ini, fim: texto.length, texto: m[1], alvo: m[2] });
    ultimo = re.lastIndex;
  }
  texto += semCodigo.slice(ultimo);
  return { texto, ligacoes };
}

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Todas as posições em que uma forma do termo aparece, tolerando o plural. */
export function ocorrencias(textoNormalizado, formas) {
  const achados = [];
  for (const f of formas) {
    const re = new RegExp("(?<![a-z0-9])" + escapar(f) + "(?:es|s)?(?![a-z0-9])", "g");
    let m;
    while ((m = re.exec(textoNormalizado))) achados.push({ ini: m.index, fim: m.index + m[0].length });
  }
  return achados.sort((a, b) => a.ini - b.ini);
}

const ehGlossario = (alvo) => /(^|\/)glossario\.md(#|$)/.test(alvo);

/**
 * A régua, aplicada a um capítulo já fatiado. Isolada do disco para o teste
 * poder dirigi-la sem escrever arquivo nenhum.
 *
 * @returns {{usos:number, ligados:number, isentos:number, problemas:string[]}}
 */
export function verificarCartoes(cartoes, termos, ancorasValidas = null) {
  const problemas = [];
  let usos = 0, ligados = 0, isentos = 0;

  cartoes.forEach((c, k) => {
    const onde = `cartão ${k + 1} ("${c.titulo}")`;
    const texto = normalizar(c.legivel);
    const nome = normalizar([c.titulo, ...c.cabecalhos].join(" · "));

    for (const t of termos) {
      const achados = ocorrencias(texto, t.formas);
      const links = c.ligacoes.filter(
        (l) => ehGlossario(l.alvo) && ocorrencias(normalizar(l.texto), t.formas).length
      );
      // Toda ligação é procurada pelo texto dela, e o texto da ligação faz
      // parte da prosa: link sem ocorrência não existe.
      if (!achados.length) continue;
      usos++;

      // A âncora tem de existir: o build não confere âncora fora do "volte
      // para", então um `#secao-que-nao-existe` sairia daqui em silêncio.
      for (const l of links) {
        const hash = l.alvo.split("#")[1];
        if (hash && ancorasValidas && !ancorasValidas.has(hash)) {
          problemas.push(`${onde}: liga "${t.termo}" para "#${hash}", que não é uma seção do glossário.`);
        }
      }

      const isento = ocorrencias(nome, t.formas).length > 0;
      if (!links.length) {
        if (isento) { isentos++; continue; }
        problemas.push(
          `${onde}: usa "${t.termo}" e nunca liga ao glossário. ` +
          `No modo cartão o leitor vê um cartão por vez — um link noutro cartão não existe para ele.`
        );
        continue;
      }
      ligados++;
      if (links.length > 1) {
        problemas.push(`${onde}: liga "${t.termo}" ${links.length} vezes. Uma por cartão; a segunda não informa nada.`);
      }
      const primeira = achados[0];
      const cobre = links.some((l) => primeira.ini >= l.ini && primeira.fim <= l.fim);
      if (!cobre) {
        const antes = c.legivel.slice(Math.max(0, primeira.ini - 30), primeira.fim + 20).replace(/\s+/g, " ");
        problemas.push(
          `${onde}: liga "${t.termo}", mas não no primeiro uso — a primeira menção fica solta em "…${antes}…".`
        );
      }
    }
  });

  return { usos, ligados, isentos, problemas };
}

// A dívida medida em 2026-09-04: zero ligações em todo o livro. O `II.2` saiu
// desta lista no commit que ligou os 39 cartões dele.
export const LIGACAO_PENDENTE = new Set([
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

// Abaixo disto o capítulo não tem termo suficiente para dizer nada, e continuar
// na lista de dívida não esconde progresso nenhum.
export const MINIMO_USOS = 5;

/** Lê o glossário e os 27 capítulos do disco. */
export function lerLivro(raiz = RAIZ) {
  const glossario = readFileSync(resolve(raiz, "livro", "glossario.md"), "utf8");
  const capitulos = readdirSync(resolve(raiz, "livro", "capitulos"))
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ slug: basename(f, ".md"), fonte: readFileSync(join(resolve(raiz, "livro", "capitulos"), f), "utf8") }));
  return { glossario, capitulos };
}

export function verificar({ glossario, capitulos }, pendentes = LIGACAO_PENDENTE) {
  const termos = termosDoGlossario(glossario);
  const ancoras = new Set(
    glossario.split("\n").map((l) => l.match(/^#{2,3}\s+(.+?)\s*$/)).filter(Boolean).map((m) => slugificar(m[1]))
  );

  const problemas = [];
  const cobrado = { capitulos: 0, cartoes: 0, usos: 0, ligados: 0, isentos: 0 };
  const divida = { capitulos: 0, cartoes: 0, usos: 0, ligados: 0 };

  for (const cap of capitulos) {
    const cartoes = fatiarCartoes(cap.fonte);
    const r = verificarCartoes(cartoes, termos, ancoras);
    if (pendentes.has(cap.slug)) {
      divida.capitulos++;
      divida.cartoes += cartoes.length;
      divida.usos += r.usos;
      divida.ligados += r.ligados;
      // A cobrança da lista: quem já pagou tem de sair dela.
      if (r.usos >= MINIMO_USOS && !r.problemas.length) {
        problemas.push(
          `${cap.slug}: declarado em LIGACAO_PENDENTE e já está ligado ` +
          `(${r.ligados} de ${r.usos} usos ligados, ${r.isentos} isentos, nenhum pendente). ` +
          `Tire-o da lista no mesmo commit — dívida paga que continua declarada esconde a próxima.`
        );
      }
      continue;
    }
    cobrado.capitulos++;
    cobrado.cartoes += cartoes.length;
    cobrado.usos += r.usos;
    cobrado.ligados += r.ligados;
    cobrado.isentos += r.isentos;
    problemas.push(...r.problemas.map((p) => `${cap.slug} · ${p}`));
  }

  const resumo = [
    `Glossário ligado: ${termos.length} verbete(s) procurados em ${cobrado.capitulos} capítulo(s) cobrado(s), ` +
    `${cobrado.cartoes} cartões — ${cobrado.usos} uso(s) de termo, ${cobrado.ligados} ligado(s) e ` +
    `${cobrado.isentos} isento(s) por o cartão apresentar o termo no título ou no cabeçalho.`,
  ];
  if (divida.capitulos) {
    resumo.push(
      `   Dívida declarada: ${divida.capitulos} capítulo(s), ${divida.cartoes} cartões, ` +
      `${divida.usos} uso(s) de termo do glossário, ${divida.ligados} ligado(s). ` +
      `Estes números NÃO reprovam — existem para que ninguém precise descobrir sozinho o tamanho do que falta.`
    );
  }
  return { problemas, cobrado, divida, resumo, termos: termos.length };
}

const executado = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (executado) {
  const { problemas, resumo } = verificar(lerLivro());
  resumo.forEach((l) => console.log(l));
  if (problemas.length) {
    console.error(`✗ ${problemas.length} problema(s) de ligação ao glossário:`);
    problemas.forEach((p) => console.error("   " + p));
    console.error("\n   O leitor de cartão vê um cartão por vez: o termo se explica ali ou não se explica.");
    console.error(`   Ligue o primeiro uso, uma vez por cartão: [termo](../glossario.md#secao).`);
    process.exit(1);
  }
  console.log("✓ todo termo do glossário usado num cartão cobrado é ligado no primeiro uso.");
}
