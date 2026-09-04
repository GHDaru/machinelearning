// Teste do gate do GLOSSÁRIO LIGADO.
//
// Ele existe porque este gate pode falhar de quatro maneiras diferentes, e três
// delas dão VERDE se ninguém escrever o caso:
//
//   1. não acusar o termo que nunca foi ligado (o defeito original: zero
//      ligações em 27 capítulos);
//   2. aceitar o link que chega tarde — depois de duas menções soltas, o link
//      só serve a quem já não precisava dele;
//   3. aceitar a repetição, que é o defeito que nasce do conserto: o autor que
//      leva a regra a sério liga toda ocorrência e transforma o cartão em sopa
//      de azul;
//   4. exigir link onde o gate não deveria olhar — dentro de alternativa de
//      exercício, que é medida em CARACTERES pelo gate D17, e do lado da
//      resposta, que nem chega ao HTML.
//
// A quarta é a mais perigosa das quatro, porque um gate que pede o errado
// ensina a desobedecer e acaba desligado. Por isso ela tem caso próprio aqui.
//
// Rodar: node publicar/testes/glossario-ligado.mjs
import {
  termosDoGlossario, fatiarCartoes, verificarCartoes, verificar,
  desdobrarLinks, normalizar, AMBIGUAS,
} from "../gates/glossario-ligado.mjs";

let falhas = 0;
const checa = (oque, real, esperado) => {
  const bate = JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(real)}`); }
};

const GLOSSARIO = `# Glossário

## Termos fundamentais

| Termo | O que é |
|---|---|
| **Resíduo** | O que sobrou |
| **Atributo** (*feature*) | Uma coluna |
| **Cerca** (*fence*) | O limite do boxplot |

## Siglas

| Sigla | Por extenso | Onde aparece |
|---|---|---|
| **PCA** | Principal Component Analysis | 08 |
`;

const termos = termosDoGlossario(GLOSSARIO);
const nomes = termos.map((t) => t.termo);

// ------------------------------------------------------- ler o glossário

checa("verbete de tabela vira termo", nomes.includes("Resíduo"), true);
checa("a variante entre parênteses também procura", termos.find((t) => t.termo === "Atributo").formas, ["atributo", "feature"]);
checa("a sigla em caixa alta fica com o <abbr>, não com o link", nomes.includes("PCA"), false);
checa("a âncora é a da seção do verbete", termos.find((t) => t.termo === "Resíduo").ancora, "termos-fundamentais");
// "cerca de 26 °C" não é a cerca do boxplot. A forma ambígua sai; o verbete
// fica, procurado só pela variante que não colide com o português corrente.
checa("forma ambígua não é procurada", termos.find((t) => t.termo === "Cerca").formas, ["fence"]);
checa("e a exclusão é declarada com motivo", AMBIGUAS.has("cerca"), true);

// --------------------------------------------------- o que entra no cartão

const LIGA = "../glossario.md#termos-fundamentais";
const cartao = (corpo) => fatiarCartoes(`:::cartao {"nivel":1,"titulo":"Um cartão"}\n${corpo}\n`);

{
  const c = cartao("O resíduo é a distância vertical.")[0];
  checa("a prosa do cartão entra", /residuo/.test(normalizar(c.legivel)), true);
}
{
  // O gabarito e o feedback não chegam ao HTML (Princípio VIII.3), e a
  // revelação é a recompensa do gesto — nenhum dos dois é lugar de link.
  const c = cartao(':::exercicio {"id":"x","tipo":"multipla"}\nQuanto vale?\n\n> **gabarito:** o resíduo\n:::')[0];
  checa("o enunciado entra", /quanto vale/.test(normalizar(c.legivel)), true);
  checa("o lado da resposta fica fora", /residuo/.test(normalizar(c.legivel)), false);
}
{
  // A alternativa é medida em CARACTERES pelo gate D17: um link de 38
  // caracteres que não muda uma palavra para o leitor desloca aquela medição.
  const c = cartao(':::exercicio {"id":"x","tipo":"multipla"}\nQual?\n\n- [x] O resíduo\n- [ ] Outra\n:::')[0];
  checa("a alternativa fica fora", /residuo/.test(normalizar(c.legivel)), false);
}
{
  const c = cartao("A coluna `residuo` do arquivo.")[0];
  checa("o código em crase fica fora", /residuo/.test(normalizar(c.legivel)), false);
}
{
  const c = cartao("```\nO resíduo aparece aqui\n```")[0];
  checa("a cerca de código fica fora", /residuo/.test(normalizar(c.legivel)), false);
}
{
  const { texto, ligacoes } = desdobrarLinks(`O [resíduo](${LIGA}) some.`);
  checa("o link vira o texto que o leitor vê", texto, "O resíduo some.");
  checa("e o intervalo dele é anotado", texto.slice(ligacoes[0].ini, ligacoes[0].fim), "resíduo");
}

// ------------------------------------------------------ as quatro direções

const rodar = (corpo) => verificarCartoes(cartao(corpo), termos);

{
  // 1. O defeito original.
  const r = rodar("O resíduo é o que sobrou.");
  checa("termo usado e nunca ligado reprova", r.problemas.length, 1);
  checa("e a mensagem diz por que a unidade é o cartão", /um cartão por vez/.test(r.problemas[0]), true);
}
{
  const r = rodar(`O [resíduo](${LIGA}) é o que sobrou.`);
  checa("ligado no primeiro uso passa", r.problemas.length, 0);
  checa("e é contado como ligado", r.ligados, 1);
}
{
  // 2. O link que chega tarde.
  const r = rodar(`O resíduo é o que sobrou, e o [resíduo](${LIGA}) soma zero.`);
  checa("ligar fora do primeiro uso reprova", r.problemas.length, 1);
  checa("e a mensagem mostra a menção solta", /não no primeiro uso/.test(r.problemas[0]), true);
}
{
  // 3. O defeito que nasce do conserto.
  const r = rodar(`O [resíduo](${LIGA}) soma zero, e o [resíduo](${LIGA}) some.`);
  checa("ligar duas vezes no mesmo cartão reprova", r.problemas.length, 1);
  checa("e a mensagem diz que a segunda não informa", /Uma por cartão/.test(r.problemas[0]), true);
}
{
  // 4. Onde o gate não deve olhar — se olhasse, pediria link dentro de
  // alternativa e dentro do gabarito, e seria desligado na semana seguinte.
  const r = rodar(':::exercicio {"id":"x","tipo":"multipla"}\nQual delas?\n\n- [x] O resíduo\n- [ ] O atributo\n\n> **porque:** o resíduo é o que sobrou\n:::');
  checa("nada é exigido em alternativa nem no gabarito", r.problemas.length, 0);
  checa("e nada é contado como uso", r.usos, 0);
}

// ------------------------------------------- o cartão que apresenta o termo

{
  const c = fatiarCartoes(':::cartao {"nivel":1,"titulo":"O resíduo"}\nO resíduo é o que sobrou.\n');
  const r = verificarCartoes(c, termos);
  checa("cartão cujo título nomeia o termo é isento", r.problemas.length, 0);
  checa("e a isenção é contada, não escondida", r.isentos, 1);
}
{
  const c = fatiarCartoes(':::cartao {"nivel":1,"titulo":"Passo 2"}\n### O resíduo\n\nO resíduo é o que sobrou.\n');
  checa("cabeçalho do cartão também isenta", verificarCartoes(c, termos).problemas.length, 0);
}
{
  // A isenção dispensa; não proíbe. Mas ligar mal continua sendo ligar mal.
  const c = fatiarCartoes(`:::cartao {"nivel":1,"titulo":"O resíduo"}\nO resíduo some, e o [resíduo](${LIGA}) volta.\n`);
  checa("no cartão isento, link fora do primeiro uso ainda reprova", verificarCartoes(c, termos).problemas.length, 1);
}

// ------------------------------------------------------ a âncora e o alvo

{
  const c = cartao(`O [resíduo](../glossario.md#secao-que-nao-existe) some.`);
  const r = verificarCartoes(c, termos, new Set(["termos-fundamentais"]));
  checa("âncora inexistente no glossário reprova", r.problemas.length, 1);
  checa("e é nomeada", /não é uma seção do glossário/.test(r.problemas[0]), true);
}
{
  // Link para outro capítulo não é ligação ao glossário, e o cartão continua
  // devendo a sua.
  const r = rodar("O [resíduo](ii-3-regressao-logistica.md) some.");
  checa("link para outro capítulo não conta como glossário", r.problemas.length, 1);
}

// ------------------------------------- o capítulo que não declarou cartão

{
  // Os 26 capítulos em dívida não têm `:::cartao`, e o `tema/cartoes.js` corta
  // por cabeçalho para eles. Se o gate devolvesse zero cartão aqui, a dívida
  // imprimiria "0 usos" com ar de coisa resolvida.
  const c = fatiarCartoes("# Cap\n\n## Um\n\nO resíduo some.\n\n## Dois\n\nO atributo fica.\n");
  checa("sem marcador, o corte é por cabeçalho", c.length, 2);
  checa("e cada cabeçalho nomeia o seu cartão", c.map((x) => x.titulo), ["Um", "Dois"]);
  checa("o que vem antes do primeiro cabeçalho fica fora", /cap/.test(normalizar(c[0].legivel)), false);
}

// --------------------------------------------------------- a dívida declarada

const capComFalta = { slug: "velho", fonte: ':::cartao {"nivel":1,"titulo":"Um"}\nO resíduo, o atributo, o resíduo, o atributo, o resíduo, o atributo.\n' };
const capLimpo = {
  slug: "velho",
  fonte: `:::cartao {"nivel":1,"titulo":"Um"}\nO [resíduo](${LIGA}) e o [atributo](${LIGA}).\n` +
         `:::cartao {"nivel":1,"titulo":"Dois"}\nO [resíduo](${LIGA}) e o [atributo](${LIGA}).\n` +
         `:::cartao {"nivel":1,"titulo":"Três"}\nO [resíduo](${LIGA}) e o [atributo](${LIGA}) de novo.\n`,
};

{
  const r = verificar({ glossario: GLOSSARIO, capitulos: [capComFalta] }, new Set(["velho"]));
  checa("capítulo em dívida não reprova", r.problemas.length, 0);
  checa("mas é medido", r.divida.usos > 0, true);
  checa("e o número aparece no resumo", /Dívida declarada/.test(r.resumo.join("\n")), true);
}
{
  const r = verificar({ glossario: GLOSSARIO, capitulos: [capComFalta] }, new Set());
  checa("fora da lista, o mesmo capítulo reprova", r.problemas.length > 0, true);
}
{
  // A cobrança na outra direção: pagou, tem de sair da lista.
  const r = verificar({ glossario: GLOSSARIO, capitulos: [capLimpo] }, new Set(["velho"]));
  checa("dívida paga que fica na lista reprova", r.problemas.length, 1);
  checa("e a mensagem manda tirar da lista", /Tire-o da lista/.test(r.problemas[0]), true);
}
{
  // O resumo sai em toda execução, inclusive no verde: é o que impede a
  // camada de dívida de virar silêncio.
  const r = verificar({ glossario: GLOSSARIO, capitulos: [capLimpo] }, new Set());
  checa("capítulo ligado passa", r.problemas.length, 0);
  checa("e o resumo sai mesmo assim", r.resumo.length > 0, true);
}

// ------------------------------------------------- o livro real, como está

{
  const { lerLivro } = await import("../gates/glossario-ligado.mjs");
  const r = verificar(lerLivro());
  checa("o livro publicado passa no gate", r.problemas.length, 0);
  checa("e o II.2 é cobrado de verdade, com uso a contar", r.cobrado.usos > 50, true);
  checa("os outros 26 capítulos estão na dívida", r.divida.capitulos, 26);
  checa("e a dívida é medida pelo corte por cabeçalho, não zerada", r.divida.usos > 100, true);
}

// ---- a emenda com o `:::aprofundar` -----------------------------------------
//
// Primeiro uso é o primeiro que o LEITOR vê. O `:::aprofundar` nasce fechado,
// então o que está lá dentro não conta como menção. Sem esta regra o autor seria
// levado a pôr o link no único lugar do cartão onde a maioria nunca olha.
{
  const comAprofundamento = [
    ':::cartao {"nivel":1,"titulo":"A conta"}',
    "Aqui a prosa que o leitor vê, sem o termo.",
    "",
    ':::aprofundar {"titulo":"A derivada inteira"}',
    "Aqui dentro aparece o resíduo pela primeira vez.",
    ":::",
    "",
    "E agora o resíduo aparece no fluxo principal.",
    "",
    ":::cartao-fim",
  ].join("\n");

  // O campo é `legivel`: é o texto que o LEITOR lê, e é o nome certo para o que
  // este gate mede. A primeira versão deste teste leu um campo inexistente, e as
  // duas asserções passaram contra `undefined` sem provar nada.
  const legivel = fatiarCartoes(comAprofundamento)[0].legivel;
  checa("o corpo do aprofundamento fica fora do texto que o leitor lê",
        /Aqui dentro aparece/.test(legivel), false);
  checa("e o que vem depois do bloco continua dentro",
        /fluxo principal/.test(legivel), true);
  checa("a prosa antes do bloco também",
        /sem o termo/.test(legivel), true);
}

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTudo verde.");
process.exit(falhas ? 1 : 0);
