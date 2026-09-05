// Teste do gate do PRÉ-REQUISITO ANTES DO USO.
//
// Ele existe porque este gate pode falhar de sete maneiras, e seis delas dão
// VERDE se ninguém escrever o caso:
//
//   1. não acusar a inversão (o defeito original: coeficiente usado no cartão 1
//      e apresentado no 17);
//   2. não acusar o termo que nunca é apresentado (o pior dos seis achados: a
//      AUC, usada em quatro lugares e definida em nenhum);
//   3. aceitar anotação morta — o cartão declara que apresenta um termo que ele
//      não usa, e a partir daí o gate passa sobre um termo órfão;
//   4. aceitar dois donos para o mesmo termo, e aí "antes" deixa de ter sentido;
//   5. aceitar "herdado" como porta dos fundos: bastaria declarar tudo herdado
//      para nada ser cobrado, então herdado que o capítulo não usa reprova;
//   6. olhar para o lado da resposta, onde o termo está sendo EXPLICADO e não
//      pressuposto, e cobrar uma ordem que não existe para o leitor;
//   7. deixar de olhar para as alternativas, que é justamente onde estava a
//      colinearidade do cartão 14 — o gate de glossário não vai lá porque mede
//      outra coisa, e se este também não for, ninguém vai.
//
// A sexta e a sétima são as duas faces da mesma decisão de fronteira, e por isso
// as duas têm caso próprio.
//
// Rodar: node publicar/testes/pre-requisito.mjs
import {
  fatiarParaPreRequisito, vocabulario, verificarCapitulo, verificar, SIMBOLOS, flexionar,
} from "../gates/pre-requisito.mjs";

let falhas = 0;
const checa = (oque, real, esperado) => {
  const bate = JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(real)}`); }
};

const GLOSSARIO = `# Glossário

## Modelos lineares

| Termo | O que é |
|---|---|
| **Colinearidade** | Dois atributos que medem quase a mesma coisa |
| **Padronização** (padronizar) | Pôr todo atributo na mesma escala |
| **Resíduo** | O que sobrou |
| **Atributo** (*feature*) | Uma coluna |
| **Coeficiente de determinação** (R²) | A fração da variação que o modelo reproduz |
`;

const vocab = vocabulario(GLOSSARIO);
const nomes = vocab.map((v) => v.nome);
const capitulo0 = (texto) => `:::cartao {"nivel":1,"titulo":"Um"}\n\n${texto}\n`;

checa("os verbetes do glossário entram no vocabulário", nomes.includes("Colinearidade"), true);
checa("os símbolos entram junto, porque o glossário não os expressa", [nomes.includes("R²"), nomes.includes("AUC")], [true, true]);
checa("o símbolo declara por que existe", SIMBOLOS.every((s) => s.porque.length > 10), true);

// O particípio é a ideia inteira: "Padronizados os atributos, em que passo…" é
// o uso que escapava no cartão 15 do capítulo original, um cartão antes da
// definição. E a regra é estreita de propósito: substantivo não flexiona.
checa("a forma verbal ganha as flexões", flexionar(["padronizar"]).includes("padronizados"), true);
checa("e o substantivo não ganha nada", flexionar(["colinearidade"]), ["colinearidade"]);
const participio = fatiarParaPreRequisito(capitulo0('Padronizados os atributos, o vale fica redondo.'));
checa("o particípio conta como uso",
  verificarCapitulo(participio, vocab).problemas.some((p) => /Padronização/.test(p)), true);

// ------------------------------------------------------------ o que se lê

const CARTAO = `:::cartao {"nivel":1,"titulo":"Um","apresenta":["Resíduo"]}

O **resíduo** é o que sobrou.

:::exercicio {"id":"x-e1","tipo":"multipla","objetivo":"O1"}
Qual é o problema?

- [ ] Que há colinearidade entre dois atributos.
- [x] Que o resíduo é grande.

> **gabarito:** o resíduo
> **porque:** A padronização não tem nada a ver com isto.
> **volte para:** #um
:::

:::interacao {"id":"x-i1","tipo":"desvanecido","titulo":"Passo"}
Complete:

- [?] soma => 4 + 1 = 5

> **pergunta:** E depois?
> **revela:** Depois vem a padronização.
:::
`;

const [c] = fatiarParaPreRequisito(CARTAO);

checa("a prosa entra", /resíduo/.test(c.texto), true);
// A sétima falha: a alternativa é texto que o leitor lê, e foi num distrator
// que a colinearidade estreou oito cartões antes de ser definida.
checa("a ALTERNATIVA de exercício entra", /colinearidade/i.test(c.texto), true);
// A sexta: do lado da resposta o termo está sendo explicado, não pressuposto.
checa("o `porque` NÃO entra", /padronização/i.test(c.texto), false);
checa("o `revela` NÃO entra", /Depois vem/.test(c.texto), false);
checa("a `pergunta` entra, porque é lida antes de responder", /E depois\?/.test(c.texto), true);
checa("o rótulo do passo desvanecido entra e a conta certa não", [/soma/.test(c.texto), /4 \+ 1/.test(c.texto)], [true, false]);
checa("o marcador declara o que apresenta", c.apresenta, ["Resíduo"]);

// ------------------------------------------------------------- a régua

const capitulo = (cartoes) => cartoes.map((t) => t.trim()).join("\n\n") + "\n";
const usa = (n, titulo, texto, attrs = "") =>
  `:::cartao {"nivel":1,"titulo":"${titulo}"${attrs}}\n\n${texto}\n`;


// 1. a inversão
const invertido = fatiarParaPreRequisito(capitulo([
  usa(1, "Abre", "A colinearidade atrapalha a leitura.", ',"herdado":["Atributo"]'),
  usa(2, "Define", "Isso se chama colinearidade, e um atributo mede o outro.", ',"apresenta":["Colinearidade"]'),
]));
const rInv = verificarCapitulo(invertido, vocab);
checa("acusa o termo usado antes de apresentado", rInv.problemas.length, 1);
checa("e diz os dois cartões", /cartão 1 .* apresentado só no cartão 2/.test(rInv.problemas[0]), true);

// e a mesma sequência na ordem certa passa
const certo = fatiarParaPreRequisito(capitulo([
  usa(1, "Define", "Isso se chama colinearidade.", ',"apresenta":["Colinearidade"]'),
  usa(2, "Usa", "A colinearidade atrapalha a leitura."),
]));
checa("e passa quando a ordem está certa", verificarCapitulo(certo, vocab).problemas, []);

// 2. usado e nunca apresentado — o caso da AUC
const orfao = fatiarParaPreRequisito(capitulo([
  usa(1, "Abre", "A comparação foi feita por AUC, e nada mais."),
]));
checa("acusa o termo que nunca é apresentado", verificarCapitulo(orfao, vocab).problemas.length, 1);
checa("e a mensagem diz onde ele estreia", /cartão 1/.test(verificarCapitulo(orfao, vocab).problemas[0]), true);

// 3. anotação morta
const morta = fatiarParaPreRequisito(capitulo([
  usa(1, "Abre", "Nada de especial aqui.", ',"apresenta":["Colinearidade"]'),
]));
checa("acusa a anotação morta", /não usa a palavra/.test(verificarCapitulo(morta, vocab).problemas[0] || ""), true);

// 4. dois donos
const doisDonos = fatiarParaPreRequisito(capitulo([
  usa(1, "Um", "Isso se chama colinearidade.", ',"apresenta":["Colinearidade"]'),
  usa(2, "Dois", "Colinearidade de novo, aqui.", ',"apresenta":["Colinearidade"]'),
]));
checa("acusa dois donos para o mesmo termo", /já era apresenta no cartão 1/.test(verificarCapitulo(doisDonos, vocab).problemas[0] || ""), true);

// 5. herdado não é porta dos fundos
const herdadoOcioso = fatiarParaPreRequisito(capitulo([
  usa(1, "Um", "Isso se chama colinearidade.", ',"apresenta":["Colinearidade"],"herdado":["Resíduo"]'),
]));
checa("acusa o herdado que o capítulo não usa", /nunca o usa/.test(verificarCapitulo(herdadoOcioso, vocab).problemas[0] || ""), true);

const herdadoEApresentado = fatiarParaPreRequisito(capitulo([
  usa(1, "Um", "Isso se chama colinearidade.", ',"apresenta":["Colinearidade"],"herdado":["Colinearidade"]'),
]));
checa("acusa o termo que é herdado e apresentado ao mesmo tempo",
  verificarCapitulo(herdadoEApresentado, vocab).problemas.some((p) => /herdado no cartão 1 e apresentado/.test(p)), true);

// o herdado legítimo passa
const herdadoBom = fatiarParaPreRequisito(capitulo([
  usa(1, "Um", "Cada atributo entra uma vez.", ',"herdado":["Atributo"]'),
]));
checa("o herdado usado de verdade passa", verificarCapitulo(herdadoBom, vocab).problemas, []);

// 6. nome que não existe no vocabulário
const errado = fatiarParaPreRequisito(capitulo([
  usa(1, "Um", "Isso se chama colinearidade.", ',"apresenta":["Colinearidad"]'),
]));
checa("acusa o nome que não é verbete nem símbolo",
  verificarCapitulo(errado, vocab).problemas.some((p) => /não é verbete do glossário nem símbolo/.test(p)), true);

// o símbolo em notação matemática é encontrado
const simbolo = fatiarParaPreRequisito(capitulo([
  usa(1, "Um", "O ajuste tem $R^2 = 0{,}982$."),
]));
checa("o R² escrito em notação é encontrado",
  verificarCapitulo(simbolo, vocab).problemas.some((p) => /R²/.test(p)), true);

// --------------------------------------------- a camada de dívida declarada

const doisCapitulos = {
  glossario: GLOSSARIO,
  capitulos: [
    { slug: "cobrado", fonte: capitulo([usa(1, "Um", "A colinearidade atrapalha.")]) },
    { slug: "devedor", fonte: capitulo([usa(1, "Um", "A colinearidade atrapalha.")]) },
  ],
};
const rel = verificar(doisCapitulos, new Set(["devedor"]));
checa("o capítulo pendente não reprova", rel.problemas.length, 1);
checa("e o pendente é contado no resumo", rel.divida.capitulos, 1);
// O resumo tem três linhas desde que a camada desenhada entrou (D28): a conta
// do cobrado, a da dívida e a do que o navegador imprime. Medir por CONTEÚDO,
// e não por tamanho, para a próxima linha nova não derrubar um teste que
// nunca falou de tamanho nenhum.
checa("o resumo imprime a dívida mesmo quando o cobrado passa",
  rel.resumo.some((l) => /Dívida declarada/.test(l)), true);
checa("e diz quantas inversões só existem na camada desenhada",
  rel.resumo.some((l) => /Camada desenhada/.test(l)), true);

// a cobrança da lista: quem pagou tem de sair dela
const pago = {
  glossario: GLOSSARIO,
  capitulos: [{
    slug: "devedor",
    fonte: capitulo([
      usa(1, "Um", "Colinearidade, padronização, resíduo, atributo e o coeficiente de determinação, o $R^2$.",
        ',"apresenta":["Colinearidade","Padronização","Resíduo","Coeficiente de determinação","R²"],"herdado":["Atributo"]'),
    ]),
  }],
};
checa("cobra quem já pagou e continua na lista de dívida",
  verificar(pago, new Set(["devedor"])).problemas.some((p) => /já está anotado/.test(p)), true);

console.log(falhas ? `\n✗ ${falhas} falha(s)` : "\n✓ tudo verde");
process.exit(falhas ? 1 : 0);
