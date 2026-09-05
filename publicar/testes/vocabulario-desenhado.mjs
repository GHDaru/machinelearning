// Teste da CAMADA DESENHADA: o vocabulário que o navegador imprime, e que
// nenhum portão de fonte via (D28 do ROADMAP).
//
// Ele existe porque este mecanismo pode falhar de seis maneiras, e cinco delas
// dão VERDE se ninguém escrever o caso:
//
//   1. o corpus defasar em silêncio — o tema muda o que imprime, o portão segue
//      respondendo com o vocabulário de ontem;
//   2. o corpus sumir e o portão continuar passando, como se ausência de dado
//      fosse ausência de defeito;
//   3. o texto do canvas ficar de fora — é metade do que o laboratório escreve,
//      e é a metade que o DOM não tem;
//   4. a inversão que só existe na camada desenhada não ser acusada (era o caso
//      do R² no cartão 4 do `II.2`, apresentado no 23);
//   5. a lista de dívida virar peneira: termo dispensado que já foi consertado
//      tem de reprovar;
//   6. a colagem grudar no cartão errado, e aí a acusação aponta para quem não
//      hospeda o laboratório.
//
// Rodar: node publicar/testes/vocabulario-desenhado.mjs
import { writeFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  lerVocabularioDesenhado, textoDesenhado, impressaoDoTema, siglasEmCanvas,
  SIGLA_EM_CANVAS_DECLARADA, CORPUS,
} from "../vocabulario-desenhado.mjs";
import { verificar } from "../gates/pre-requisito.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
let falhas = 0;
const checa = (oque, real, esperado) => {
  const bate = JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(real)}`); }
};

// ------------------------------------------------------ a impressão digital
const dir = mkdtempSync(join(tmpdir(), "voc-"));
const real = JSON.parse(readFileSync(CORPUS, "utf8"));

const gravar = (corpus) => {
  const alvo = join(dir, "corpus.json");
  writeFileSync(alvo, JSON.stringify(corpus));
  return alvo;
};

checa("1. o corpus defasado reprova, e diz o que rodar",
  /defasado/.test(lerVocabularioDesenhado(gravar({ ...real, impressao: { bytes: 1, sha256: "cafe" } })).aviso), true);
checa("2. o corpus ausente reprova",
  /não existe/.test(lerVocabularioDesenhado(join(dir, "nao-existe.json")).aviso), true);
checa("   e o corpus de hoje passa", lerVocabularioDesenhado(CORPUS).aviso, null);
checa("   a impressão digital é do arquivo que desenha", impressaoDoTema().arquivo, "publicar/tema/laboratorios.js");

// ------------------------------------------------------- canvas mais o DOM
const paginas = { cap: { labs: [{ id: "x-l1", canvas: ["fundo · EQM 9.48"], dom: "R² -5.83" }] } };
const colado = textoDesenhado(paginas, "cap").get("x-l1");
checa("3. o canvas e o DOM entram juntos", [/EQM/.test(colado), /R²/.test(colado)], [true, true]);

// -------------------------------------- a inversão que só existe no desenho
const GLOSSARIO = `# Glossário

## Modelos lineares

| Termo | O que é |
|---|---|
| **Resíduo** | O que sobrou |
| **Coeficiente de determinação** (R²) | A fração da variação que o modelo reproduz |
`;
const capitulo = (comLab) => `# X

:::cartao {"nivel":1,"titulo":"Um","apresenta":["Resíduo"]}

Cada segmento é um resíduo.

${comLab ? ':::lab {"id":"x-l1","tipo":"regressao-linear","titulo":"À mão"}\nArraste a alça.\n:::' : ""}

:::cartao {"nivel":1,"titulo":"Dois","apresenta":["Coeficiente de determinação","R²"]}

O coeficiente de determinação, o $R^2$, é a fração da variação que o modelo reproduz.
`;

// `desenhado` indefinido significa "sem camada desenhada"; um objeto significa
// "este é o corpus", e aí um laboratório que ele não conhece é defeito.
const rodar = (comLab, desenhado, dispensa = new Map()) =>
  verificar({ glossario: GLOSSARIO, capitulos: [{ slug: "cap", fonte: capitulo(comLab) }], desenhado },
            new Set(), dispensa);

checa("   sem a camada desenhada, o capítulo passa", rodar(true, undefined).problemas.length, 0);
checa("4. com ela, a inversão do cartão 1 é acusada",
  rodar(true, paginas).problemas.some((p) => /"R²": usado no cartão 1/.test(p)), true);
checa("5. o termo dispensado não reprova",
  rodar(true, paginas, new Map([["cap", new Set(["R²"])]])).problemas.length, 0);
checa("   e o dispensado que já foi consertado reprova",
  rodar(true, undefined, new Map([["cap", new Set(["R²"])]])).problemas.some((p) => /Tire-o da lista/.test(p)), true);
checa("6. sem o marcador do laboratório, o texto não gruda em cartão nenhum",
  rodar(false, paginas).problemas.length, 0);
checa("   laboratório novo que o corpus não conhece reprova, e diz o que regenerar",
  rodar(true, { cap: { labs: [] } }).problemas.some((p) => /o corpus não conhece/.test(p)), true);

// ------------------------------------- a sigla que só existe no canvas (D24)
checa("7. a sigla desenhada em canvas é encontrada",
  siglasEmCanvas({ p: { labs: [{ id: "l", canvas: ["fundo · EQM 9.48", "sem sigla aqui"] }] } })
    .map((n) => n.sigla), ["EQM"]);
checa("   e o DOM não entra nesta conta, porque a jornada já o percorre",
  siglasEmCanvas({ p: { labs: [{ id: "l", canvas: [], dom: "AUC 0.65" }] } }).length, 0);
checa("   o número declarado bate com o corpus de hoje",
  siglasEmCanvas(lerVocabularioDesenhado(CORPUS).paginas).length, SIGLA_EM_CANVAS_DECLARADA);

console.log(falhas ? `\n✗ ${falhas} falha(s)` : "\n✓ tudo verde");
process.exit(falhas ? 1 : 0);
