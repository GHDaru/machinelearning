// Gate dos intervalos — o livro conta o tempo entre a ideia e o procedimento,
// e conta esse mesmo número em vários capítulos.
//
// Por que este gate existe. No ciclo 009, o IV.2 dizia "de Thorndike (1898) a
// Watkins (1989) são cerca de 80 anos". São 91. O número errado tinha sido
// copiado para outros TRÊS capítulos (III.4, III.6 e IV.3), porque cada um
// compara o seu intervalo com o dos outros. Um erro, quatro páginas, e nenhuma
// delas errada por conta própria: erradas por citação.
//
// A regra que este arquivo aplica é: NINGUÉM escreve o intervalo. Os dois anos
// são a fonte da verdade, a subtração é da máquina, e qualquer menção em prosa
// que discorde da subtração quebra o build.
//
// Uso: importado por build.mjs. `node intervalos.mjs` sozinho lista o que achou.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");

/** Os intervalos que o livro cita entre capítulos.
 *
 * `de`/`ate` são os dois anos; o intervalo NÃO é escrito aqui, é calculado.
 * `arquivo` é o capítulo dono do intervalo, e é onde a fonte dos dois anos
 * está selada. `apelidos` são as formas como os outros capítulos o chamam. */
export const INTERVALOS = [
  {
    id: "IV.2",
    arquivo: "livro/capitulos/iv-2-reforco.md",
    de: 1898, // Thorndike, monográfico
    ate: 1989, // Watkins, tese
    o_que: "Thorndike → Q-learning",
    apelidos: ["IV.2", "capítulo IV.2"],
  },
  {
    id: "I.6",
    arquivo: "livro/capitulos/i-6-representacao.md",
    de: 1954, // Harris
    ate: 2013, // word2vec
    o_que: "Harris → word2vec",
    apelidos: ["I.6", "capítulo I.6"],
  },
  {
    id: "II.7",
    arquivo: "livro/capitulos/ii-7-series-temporais.md",
    de: 1927, // Yule
    ate: 1970, // Box-Jenkins
    o_que: "Yule → Box-Jenkins",
    apelidos: ["II.7", "capítulo II.7"],
  },
  {
    id: "III.4",
    arquivo: "livro/capitulos/iii-4-visao.md",
    de: 1959, // Hubel & Wiesel
    ate: 2012, // AlexNet
    o_que: "Hubel & Wiesel → AlexNet",
    apelidos: ["III.4", "capítulo III.4"],
  },
];

export function anos(iv) {
  return iv.ate - iv.de;
}

/** Acha "os ~80 do [capítulo IV.2](...)", "91 no [IV.2](...)", "cerca de 80 anos
 * no [capítulo IV.2](...)" e afins, e confere o número contra a subtração. */
export function verificar() {
  const queixas = [];
  const arquivos = new Set(INTERVALOS.map((i) => i.arquivo));
  // Todo capítulo pode citar o intervalo de outro, não só os quatro donos.
  for (const iv of INTERVALOS) arquivos.add(iv.arquivo);
  const todos = [
    ...arquivos,
    ...INTERVALOS.map((i) => i.arquivo),
    "livro/capitulos/iii-6-modelos-de-fundacao.md",
    "livro/capitulos/iv-3-ia-simbolica-fuzzy-evolutiva.md",
    "livro/capitulos/ii-5-arvores-ensembles.md",
  ];

  for (const rel of new Set(todos)) {
    let fonte;
    try {
      fonte = readFileSync(resolve(RAIZ, rel), "utf8");
    } catch {
      queixas.push(`${rel}: arquivo da tabela de intervalos não existe`);
      continue;
    }
    fonte.split("\n").forEach((linha, i) => {
      for (const iv of INTERVALOS) {
        for (const apelido of iv.apelidos) {
          // número (com "cerca de"/"~" opcional), talvez "anos", "do"/"no",
          // e o link para o capítulo dono do intervalo.
          //
          // O lookbehind não é detalhe: sem ele, "1927→1970 no [II.7]" casa
          // como "970 no [II.7]" e o gate acusa um erro que não existe. Um
          // ano citado NÃO é um intervalo citado.
          const re = new RegExp(
            `(?:cerca de\\s+|~)?(?<![\\d\\u2013\\u2014\\u2192-])(\\d{1,3})\\s*(?:anos)?\\s+(?:do|no|de)\\s+\\[${apelido.replace(".", "\\.")}\\]`,
            "gi",
          );
          let m;
          while ((m = re.exec(linha)) !== null) {
            const dito = Number(m[1]);
            const certo = anos(iv);
            if (dito !== certo) {
              queixas.push(
                `${rel}:${i + 1} cita ${dito} para o intervalo do ${iv.id} ` +
                  `(${iv.o_que}), mas ${iv.de}→${iv.ate} são ${certo}`,
              );
            }
          }
        }
      }
    });
  }
  return queixas;
}

if (process.argv[1] && process.argv[1].endsWith("intervalos.mjs")) {
  const q = verificar();
  if (q.length) {
    console.error(`✗ ${q.length} intervalo(s) citado(s) fora da conta:`);
    q.forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  const linhas = INTERVALOS.map(
    (iv) => `${iv.id}: ${iv.de}→${iv.ate} = ${anos(iv)} anos (${iv.o_que})`,
  );
  console.log(`✓ ${INTERVALOS.length} intervalos conferidos por subtração`);
  linhas.forEach((l) => console.log("   " + l));
}
