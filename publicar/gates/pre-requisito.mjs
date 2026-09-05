// Gate do PRÉ-REQUISITO ANTES DO USO: nenhum cartão usa um termo que a
// sequência ainda não apresentou.
//
// POR QUE ELE EXISTE
//
// O autor recusou a ordem do `II.2` com uma frase: *"para um aluno precisando
// de passos evolutivos, não está linear."* Três especialistas independentes
// mediram o capítulo e acharam a mesma coisa por caminhos diferentes, e a
// não-linearidade **não era de sinalização** — uma única ocorrência de "veremos"
// em 39 cartões. Era de **pré-requisito**:
//
//   conceito            1º uso        apresentado
//   coeficiente         cartão 1      cartão 17
//   padronização        4 e 15        16
//   colinearidade       14 e 15       22
//   R²                  15            20
//   solução fechada     1             7
//   AUC                 quatro cartões  NUNCA
//
// A última linha é a que decide o desenho deste gate. "AUC" era expandida pelo
// `<abbr>` do motor e **nunca definida em lugar nenhum**, e nenhum portão do
// repositório tinha como perceber: o de glossário confere que o termo é
// LIGADO, não que ele foi APRESENTADO; o de exercícios confere que o objetivo
// citado EXISTE, não que ele corresponde. Um capítulo pode passar em todos os
// portões usando um vocabulário que ele nunca ensinou.
//
// A regra vem da [ADR 0023](../../adr/0023-a-sequencia-do-ii-2-carga-cognitiva-e-a-escada.md),
// decisão 1, item 1: *"Pré-requisito antes do uso. Nenhum cartão usa conceito
// que a sequência ainda não apresentou — nem em distrator, nem em revelação,
// nem em enunciado de laboratório."*
//
// A DECISÃO CENTRAL: "APRESENTADO" É DECLARADO, NÃO ADIVINHADO
//
// Tentei três réguas automáticas antes de escolher a declaração, e as três
// erram no mesmo lugar:
//
//   - **o termo em negrito** — convenção real do livro, e frágil: a ADR 0013
//     limita o negrito a três por parágrafo, então a convenção compete com um
//     portão que já existe;
//   - **o termo no título ou no cabeçalho** — é a isenção do gate de glossário,
//     e não serve aqui: `Padronizar muda a forma` apresenta, e
//     `O que o coeficiente diz` também, mas `O panfleto, de brinde` apresenta
//     colinearidade sem citá-la em cabeçalho nenhum;
//   - **o cartão que liga ao glossário** — todo cartão liga, porque o outro
//     gate exige. Não distingue quem apresenta de quem usa.
//
// Então o cartão **declara**, no próprio marcador, o que ele apresenta:
//
//     :::cartao {"nivel":1,"titulo":"Ponha a reta à mão","apresenta":["Resíduo","EQM"]}
//
// É a mesma moeda que o repositório já usa em `nivel`, `objetivo` e
// `dificuldade`: uma etiqueta escrita pelo autor, não inferida por modelo. E a
// declaração é cobrada nos dois sentidos — apresentar o que não se usa reprova
// tanto quanto usar o que não se apresentou —, porque etiqueta que só pode
// estar certa não mede nada.
//
// O QUE O CAPÍTULO HERDA, E POR QUE ISSO PRECISA SER DITO EM VOZ ALTA
//
// `atributo`, `variância`, `ensemble` e `calibração` vêm de capítulos
// anteriores, e exigir que o `II.2` os apresente seria pedir que ele reescreva
// o livro. Mas deixá-los fora **em silêncio** transformaria o gate numa
// peneira: bastaria não declarar nada para nada ser cobrado.
//
// O primeiro cartão declara `"herdado"`, e essa lista é a **lista de
// pré-requisitos do capítulo** — informação que o leitor merecia ter e que
// nenhum capítulo do livro dava. Ela também é cobrada: termo herdado que o
// capítulo nunca usa reprova, e termo herdado que algum cartão também apresenta
// reprova.
//
// O QUE ENTRA NA CONTA — o que o leitor lê ANTES de se comprometer
//
//   dentro: a prosa, os cabeçalhos, o enunciado do exercício e da interação, o
//     `> **pergunta:**`, o corpo do laboratório e **as alternativas** — um
//     distrator que cita um termo indefinido é exatamente o defeito medido no
//     cartão 14, e o gate de glossário não olha para lá porque ele mede outra
//     coisa (o comprimento das alternativas é medido em caracteres pelo D17, e
//     ali um link corromperia a medição; aqui não se pede link nenhum, só
//     ordem);
//   fora: `revela`, `gabarito`, `porque`, `rubrica` e `volte para`. Ali o termo
//     está sendo explicado depois do gesto, não pressuposto antes dele. É uma
//     fronteira escolhida, e ela tem preço: um termo que estreie dentro de uma
//     revelação passa por este gate. Fica declarado.
//   fora: código em cerca e em crase (`preco` é nome de coluna), e o corpo do
//     `:::aprofundar`, que nasce fechado — pelo mesmo motivo que o gate de
//     glossário o ignora.
//
// O VOCABULÁRIO
//
// Os verbetes do glossário, lidos com a mesma função do gate de glossário, mais
// uma lista curta de **símbolos**: notação que o glossário guarda sob nome por
// extenso e que o texto usa em símbolo. Sem ela o `R²` e a `AUC` — duas das seis
// inversões medidas — sairiam do alcance do gate, porque `termosDoGlossario`
// descarta de propósito as formas em caixa alta (elas são servidas pelo
// `<abbr>` do motor, e a asserção H da jornada cobra isso).
//
// A DÍVIDA DECLARADA. São 27 capítulos e um só anotado. Cobrar os 26 restantes
// hoje reprovaria o livro inteiro no primeiro dia, e anotar 26 capítulos é
// decisão de escopo editorial, não de portão. Vale a mesma disciplina do
// `LIGACAO_PENDENTE`: a lista é medida, relatada e não reprova — MAS o capítulo
// que já anotou tudo tem de sair dela no mesmo commit, porque dívida paga que
// continua declarada esconde a próxima.
//
// Uso:  node publicar/gates/pre-requisito.mjs
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { termosDoGlossario, normalizar, ocorrencias } from "./glossario-ligado.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// SÍMBOLOS: notação usada no texto que o glossário guarda sob nome por extenso.
// Procurados no texto BRUTO, porque a caixa alta é o que os identifica.
export const SIMBOLOS = [
  { nome: "R²", re: /(?<![A-Za-z0-9])R\s*\^?\s*[²2](?![A-Za-z0-9])/g,
    porque: 'o glossário guarda "Coeficiente de determinação"; o texto escreve $R^2$' },
  { nome: "AUC", re: /(?<![A-Za-z])AUC(?![A-Za-z])/g,
    porque: "sigla servida pelo <abbr>, que expande e não define" },
];

const RE_MARCADOR = /^:::cartao(-fim)?[ \t]*(\{[^\n]*\})?[ \t]*$/;
const RE_APROFUNDAR = /^:::aprofundar\b/;
const RE_ABRE_BLOCO = /^:::(exercicio|video|lab|interacao)\b/;
const RE_FECHA_BLOCO = /^:::[ \t]*$/;
// A linha do passo desvanecido tem o rótulo à esquerda e a CONTA CERTA à
// direita do `=>`. O rótulo é visível antes de conferir; a conta, não.
const RE_PASSO = /^(\s*-\s*\[\?\][^=]*)=>.*$/;
// As chaves do lado da resposta. `pergunta` fica FORA desta lista de propósito:
// ela é lida antes de o leitor responder.
const RE_RESPOSTA = /^\s*>\s*\*\*(revela|gabarito|porque|rubrica|volte para)\s*:?\*\*/i;

/**
 * Fatia o Markdown em cartões e devolve, de cada um, o texto que o leitor lê
 * ANTES de se comprometer, mais o que o marcador declara.
 *
 * @returns {{titulo:string, apresenta:string[], herdado:string[], texto:string}[]}
 */
export function fatiarParaPreRequisito(markdown) {
  const cartoes = [];
  let atual = null, emBloco = false, emCerca = false, emAprofundamento = false, emResposta = false;

  for (const linha of markdown.split("\n")) {
    if (/^(?:```|~~~)/.test(linha)) { emCerca = !emCerca; continue; }
    if (emCerca) continue;

    const marca = linha.match(RE_MARCADOR);
    if (marca) {
      atual = null; emBloco = false; emAprofundamento = false; emResposta = false;
      if (!marca[1]) {
        let attrs = {};
        try { attrs = JSON.parse(marca[2] || "{}"); } catch { /* o build já reprova */ }
        atual = {
          titulo: String(attrs.titulo || ""),
          apresenta: Array.isArray(attrs.apresenta) ? attrs.apresenta.map(String) : [],
          herdado: Array.isArray(attrs.herdado) ? attrs.herdado.map(String) : [],
          bruto: [],
        };
        cartoes.push(atual);
      }
      continue;
    }
    if (!atual) continue;

    if (RE_APROFUNDAR.test(linha)) { emAprofundamento = true; continue; }
    if (emAprofundamento) { if (RE_FECHA_BLOCO.test(linha)) emAprofundamento = false; continue; }
    if (RE_ABRE_BLOCO.test(linha)) { emBloco = true; emResposta = false; continue; }
    if (RE_FECHA_BLOCO.test(linha)) { emBloco = false; emResposta = false; continue; }

    if (emBloco && /^\s*>/.test(linha)) {
      // Uma chave do lado da resposta abre um trecho que continua nas linhas
      // seguintes, até a próxima chave. `pergunta` fecha esse trecho.
      if (RE_RESPOSTA.test(linha)) { emResposta = true; continue; }
      if (/^\s*>\s*\*\*pergunta\s*:?\*\*/i.test(linha)) { emResposta = false; }
      else if (emResposta) continue;
    }

    const passo = linha.match(RE_PASSO);
    atual.bruto.push(passo ? passo[1] : linha);
  }

  return cartoes.map((c) => ({
    titulo: c.titulo,
    apresenta: c.apresenta,
    herdado: c.herdado,
    // O rótulo de link vira o texto que o leitor vê; o alvo sai.
    texto: c.bruto.join("\n")
      .replace(/`[^`\n]*`/g, (t) => " ".repeat(t.length))
      .replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_, rot) => rot),
  }));
}

// FLEXÃO, e por que ela precisa existir aqui e não no gate de glossário.
//
// `ocorrencias` tolera o plural e mais nada, e está certo para o outro gate:
// ele pede um LINK, e link se põe onde o autor escreveu o substantivo. Aqui a
// pergunta é outra — "o leitor já viu esta ideia?" —, e o cartão 15 do capítulo
// original perguntava *"Padronizados os atributos, em que passo…"* um cartão
// antes de padronização ser definida. "Padronizados" é a ideia inteira, e
// escapava por ser particípio.
//
// A regra fica estreita de propósito: só formas terminadas em `-ar` com pelo
// menos seis letras ganham o radical flexionado, e só com os sufixos abaixo.
// Ampliar isso é convidar falso positivo, que é o defeito que desliga portões.
const SUFIXOS = ["a", "am", "ado", "ada", "ados", "adas", "ando"];
export function flexionar(formas) {
  const saida = new Set(formas);
  for (const f of formas) {
    if (!/ar$/.test(f) || f.length < 6) continue;
    const radical = f.slice(0, -2);
    for (const s of SUFIXOS) saida.add(radical + s);
  }
  return [...saida];
}

/** O vocabulário procurado: verbetes do glossário mais os símbolos. */
export function vocabulario(glossario) {
  const itens = termosDoGlossario(glossario).map((t) => {
    const formas = flexionar(t.formas);
    return { nome: t.termo, achar: (bruto) => ocorrencias(normalizar(bruto), formas) };
  });
  for (const s of SIMBOLOS) {
    itens.push({
      nome: s.nome,
      achar: (bruto) => [...bruto.matchAll(new RegExp(s.re.source, "g"))]
        .map((m) => ({ ini: m.index, fim: m.index + m[0].length })),
    });
  }
  return itens;
}

/**
 * A régua, sobre um capítulo já fatiado. Isolada do disco para o teste poder
 * dirigi-la sem escrever arquivo nenhum.
 *
 * @returns {{usos:number, apresentados:number, herdados:number, distintos:number, problemas:string[]}}
 */
export function verificarCapitulo(cartoes, vocab) {
  const problemas = [];
  const porNome = new Map(vocab.map((v) => [normalizar(v.nome), v]));

  // Onde cada termo é usado pela primeira vez, e onde é declarado.
  const primeiroUso = new Map();     // nome normalizado -> {cartao, nome}
  const usosPorTermo = new Map();
  const apresentadoEm = new Map();   // nome normalizado -> cartão
  const herdadoEm = new Map();

  cartoes.forEach((c, k) => {
    const n = k + 1;
    for (const v of vocab) {
      if (!v.achar(c.texto).length) continue;
      const chave = normalizar(v.nome);
      usosPorTermo.set(chave, (usosPorTermo.get(chave) || 0) + 1);
      if (!primeiroUso.has(chave)) primeiroUso.set(chave, { cartao: n, nome: v.nome, titulo: c.titulo });
    }
    const declarar = (lista, mapa, campo) => {
      for (const bruto of lista) {
        const chave = normalizar(bruto);
        if (!porNome.has(chave)) {
          problemas.push(
            `cartão ${n} ("${c.titulo}"): declara ${campo} "${bruto}", que não é verbete do glossário nem símbolo conhecido. ` +
            `Escreva o termo como ele está em livro/glossario.md.`
          );
          continue;
        }
        if (mapa.has(chave)) {
          problemas.push(
            `cartão ${n} ("${c.titulo}"): "${bruto}" já era ${campo} no cartão ${mapa.get(chave)}. ` +
            `Um termo tem um dono só, senão "antes" deixa de ter sentido.`
          );
          continue;
        }
        mapa.set(chave, n);
      }
    };
    declarar(c.apresenta, apresentadoEm, "apresenta");
    declarar(c.herdado, herdadoEm, "herdado");
  });

  // 1. inversão: usado antes de apresentado.
  for (const [chave, apr] of apresentadoEm) {
    const uso = primeiroUso.get(chave);
    const nome = porNome.get(chave).nome;
    if (!uso) {
      problemas.push(
        `cartão ${apr}: apresenta "${nome}" e o cartão não usa a palavra. ` +
        `Anotação morta é pior que anotação ausente: ela faz o gate passar sobre um termo que ninguém apresentou.`
      );
      continue;
    }
    if (uso.cartao < apr) {
      problemas.push(
        `"${nome}": usado no cartão ${uso.cartao} ("${uso.titulo}") e apresentado só no cartão ${apr}. ` +
        `São ${apr - uso.cartao} cartão(ões) de dívida — o leitor segura um termo indefinido enquanto processa o que ele explica.`
      );
    }
  }

  // 2. usado e nunca apresentado nem herdado.
  for (const [chave, uso] of primeiroUso) {
    if (apresentadoEm.has(chave) || herdadoEm.has(chave)) continue;
    problemas.push(
      `"${uso.nome}": usado a partir do cartão ${uso.cartao} ("${uso.titulo}") e apresentado em cartão nenhum. ` +
      `Ou um cartão o declara em "apresenta", ou o primeiro cartão o declara em "herdado".`
    );
  }

  // 3. herdado que o capítulo não usa, ou que também é apresentado.
  for (const [chave, cartao] of herdadoEm) {
    const nome = porNome.get(chave).nome;
    if (apresentadoEm.has(chave)) {
      problemas.push(
        `"${nome}": declarado herdado no cartão ${cartao} e apresentado no cartão ${apresentadoEm.get(chave)}. ` +
        `Ou o capítulo o ensina, ou o recebe pronto.`
      );
      continue;
    }
    if (!primeiroUso.has(chave)) {
      problemas.push(
        `cartão ${cartao}: declara "${nome}" como herdado e o capítulo nunca o usa. ` +
        `A lista de herdados é a lista de pré-requisitos do leitor, e pré-requisito que não se usa é ruído.`
      );
    }
  }

  return {
    usos: [...usosPorTermo.values()].reduce((a, b) => a + b, 0),
    distintos: primeiroUso.size,
    apresentados: apresentadoEm.size,
    herdados: herdadoEm.size,
    problemas,
  };
}

// A dívida medida em 2026-09-05: só o `II.2` carrega as anotações. Os 26 abaixo
// são medidos, relatados e NÃO reprovam.
export const PRE_REQUISITO_PENDENTE = new Set([
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

// Abaixo disto o capítulo não tem vocabulário suficiente para dizer nada.
export const MINIMO_DISTINTOS = 5;

/** Lê o glossário e os capítulos do disco. */
export function lerLivro(raiz = RAIZ) {
  const glossario = readFileSync(resolve(raiz, "livro", "glossario.md"), "utf8");
  const dir = resolve(raiz, "livro", "capitulos");
  const capitulos = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ slug: basename(f, ".md"), fonte: readFileSync(join(dir, f), "utf8") }));
  return { glossario, capitulos };
}

export function verificar({ glossario, capitulos }, pendentes = PRE_REQUISITO_PENDENTE) {
  const vocab = vocabulario(glossario);
  const problemas = [];
  const cobrado = { capitulos: 0, cartoes: 0, usos: 0, distintos: 0, apresentados: 0, herdados: 0 };
  const divida = { capitulos: 0, cartoes: 0, usos: 0, distintos: 0, anotados: 0 };

  for (const cap of capitulos) {
    const cartoes = fatiarParaPreRequisito(cap.fonte);
    if (!cartoes.length) continue;                     // capítulo sem baralho declarado
    const r = verificarCapitulo(cartoes, vocab);
    if (pendentes.has(cap.slug)) {
      divida.capitulos++;
      divida.cartoes += cartoes.length;
      divida.usos += r.usos;
      divida.distintos += r.distintos;
      divida.anotados += r.apresentados + r.herdados;
      if (r.distintos >= MINIMO_DISTINTOS && !r.problemas.length) {
        problemas.push(
          `${cap.slug}: declarado em PRE_REQUISITO_PENDENTE e já está anotado ` +
          `(${r.distintos} termo(s) distinto(s), nenhum pendente). ` +
          `Tire-o da lista no mesmo commit — dívida paga que continua declarada esconde a próxima.`
        );
      }
      continue;
    }
    cobrado.capitulos++;
    cobrado.cartoes += cartoes.length;
    cobrado.usos += r.usos;
    cobrado.distintos += r.distintos;
    cobrado.apresentados += r.apresentados;
    cobrado.herdados += r.herdados;
    problemas.push(...r.problemas.map((p) => `${cap.slug} · ${p}`));
  }

  const resumo = [
    `Pré-requisito antes do uso: ${vocab.length} termo(s) de vocabulário procurados em ` +
    `${cobrado.capitulos} capítulo(s) cobrado(s), ${cobrado.cartoes} cartões — ` +
    `${cobrado.distintos} termo(s) distinto(s) em uso, ${cobrado.usos} uso(s), ` +
    `${cobrado.apresentados} apresentado(s) no capítulo e ${cobrado.herdados} herdado(s) de capítulos anteriores.`,
  ];
  if (divida.capitulos) {
    resumo.push(
      `   Dívida declarada: ${divida.capitulos} capítulo(s), ${divida.cartoes} cartões, ` +
      `${divida.distintos} termo(s) distinto(s) em uso, ${divida.usos} uso(s), ${divida.anotados} anotação(ões). ` +
      `Estes números NÃO reprovam — existem para que ninguém precise descobrir sozinho o tamanho do que falta.`
    );
  }
  return { problemas, cobrado, divida, resumo, vocabulario: vocab.length };
}

const executado = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (executado) {
  const { problemas, resumo } = verificar(lerLivro());
  resumo.forEach((l) => console.log(l));
  if (problemas.length) {
    console.error(`✗ ${problemas.length} problema(s) de pré-requisito:`);
    problemas.forEach((p) => console.error("   " + p));
    console.error("\n   A regra é a da ADR 0023: nenhum cartão usa conceito que a sequência ainda não apresentou.");
    console.error('   Declare quem ensina o termo: :::cartao {"nivel":N,"titulo":"…","apresenta":["Termo"]}');
    console.error('   O que vem de capítulo anterior vai em "herdado", no primeiro cartão.');
    process.exit(1);
  }
  console.log("✓ todo termo do vocabulário é apresentado antes do primeiro uso, ou declarado herdado.");
}
