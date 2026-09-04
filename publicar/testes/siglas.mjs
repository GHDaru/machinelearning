// Teste do PASSE DE SIGLAS (`publicar/siglas.mjs`).
//
// Ele existe porque o defeito D24 do ROADMAP era invisível para todos os outros
// verificadores: o motor embrulhava a sigla, a contagem de bytes batia, o build
// saía verde, e mesmo assim o II.2 chegava ao leitor com zero `<abbr>` e quatro
// "AUC" nus. A causa era uma linha de máquina de estado, e máquina de estado se
// testa com caso, não com leitura.
//
// A asserção H da jornada cobre isto num navegador de verdade. Este teste é o
// laço curto: roda em milissegundos, sem Chromium, e diz QUAL caso quebrou.
//
// Rodar: node publicar/testes/siglas.mjs
import { abrirSiglas } from "../siglas.mjs";

let falhas = 0;
const checa = (oque, real, esperado) => {
  const bate = real === esperado;
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}\n       veio     ${JSON.stringify(real)}`); }
};
const contaAbbr = (h) => (h.match(/<abbr /g) || []).length;

// 1. O DEFEITO ORIGINAL. `<input>` é elemento vazio e não fecha: quando ele
// abria escopo de proteção, tudo o que vinha depois na página ficava nu.
const comInput = abrirSiglas(
  `<p>o EQM antes</p><label><input type="radio"><span>o EQM da opção</span></label><p>o EQM depois</p>`);
checa("as três ocorrências em volta de um <input> são embrulhadas", contaAbbr(comInput), 3);

// 2. O TEXTO INTERATIVO. Alternativa de múltipla escolha é prosa que o leitor lê.
checa("a alternativa dentro do <label> abre a sigla",
  /<span>o <abbr title="[^"]+">EQM<\/abbr> da opção<\/span>/.test(comInput), true);

// 3. NUNCA DENTRO DE ATRIBUTO. Um `<abbr>` injetado num `title=` ou num
// `placeholder=` quebraria o HTML sem aparecer na tela.
const comAtributo = abrirSiglas(
  `<input class="ex-num" placeholder="responda em AUC" title="a AUC do modelo"><p>a AUC do texto</p>`);
checa("atributo com sigla fica intacto", contaAbbr(comAtributo), 1);
checa("o placeholder não ganhou tag dentro", comAtributo.includes(`placeholder="responda em AUC"`), true);

// 4. O QUE CONTINUA PROTEGIDO, e por quê: `code` é identificador, `textarea`
// mostraria a tag escrita dentro da caixa, `a` já tem afordância própria.
checa("dentro de <code> não entra", contaAbbr(abrirSiglas(`<code>AUC</code>`)), 0);
checa("dentro de <textarea> não entra", contaAbbr(abrirSiglas(`<textarea>a AUC</textarea>`)), 0);
checa("dentro de <a> não entra", contaAbbr(abrirSiglas(`<a href="x.html">AUC</a>`)), 0);
checa("dentro de <h2> não entra", contaAbbr(abrirSiglas(`<h2>AUC e ROC</h2>`)), 0);

// 5. A PROTEÇÃO FECHA. Sigla depois de um bloco protegido volta a ser embrulhada
// — era exatamente isso que o contador quebrado deixava de fazer.
checa("depois do <code> o passe volta a valer",
  contaAbbr(abrirSiglas(`<p><code>auc_score</code> mede a AUC</p><p>e a AUC de novo</p>`)), 2);

// 6. NÃO ANINHA. Passar duas vezes no mesmo HTML não produz <abbr> dentro de <abbr>.
checa("passe idempotente", contaAbbr(abrirSiglas(abrirSiglas(`<p>a AUC</p>`))), 1);

// 7. A SIGLA MAIS LONGA GANHA: "ML" não pode casar dentro de "MLOps".
checa("MLOps não é lido como ML", /<abbr title="Machine Learning Operations">MLOps<\/abbr>/.test(abrirSiglas(`<p>MLOps</p>`)), true);

// 8. PALAVRA QUE CONTÉM A SIGLA NÃO É SIGLA.
checa("não embrulha dentro de palavra", contaAbbr(abrirSiglas(`<p>AUCtion e IAtrogênico</p>`)), 0);

if (falhas) { console.error(`\n✗ ${falhas} caso(s) falharam.`); process.exit(1); }
console.log("\n✓ o passe de siglas alcança o texto interativo, respeita atributo e continua fora de código.");
