// Teste do gate da ESCADA DA PRÁTICA.
//
// Ele existe porque este gate pode falhar de nove maneiras, e oito delas dão
// VERDE se ninguém escrever o caso:
//
//   1. não acusar o teto não atingido — o objetivo promete um verbo e nenhum
//      exercício chega a E3;
//   2. não acusar o teto ultrapassado — uma `aberta` sob objetivo que a ADR 0014
//      proíbe de puxar resposta aberta;
//   3. não acusar a segunda `aberta` do mesmo objetivo (o teto de custo);
//   4. não acusar a queda de mais de um degrau dentro de um nível;
//   5. acusar a queda que acontece na FRONTEIRA entre dois níveis, que é legítima
//      e é como a escada recomeça;
//   6. não acusar o platô de cinco cartões;
//   7. acusar o platô de quatro, que é exatamente o teto e passa;
//   8. deixar a dívida declarada virar peneira: item na lista que já foi pago tem
//      de reprovar, senão a lista vira teto para o próximo defeito;
//   9. ler a tabela de Bloom errado — o verbo do processo ("Aplicar") abre nove
//      objetivos do livro e está na coluna do processo, não na dos exemplos.
//
// Rodar: node publicar/testes/escada.mjs
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  tabelaDeBloom, fatiarEscada, verificarCapitulo, verificar, spearman,
  DEGRAU, PLATO_MAXIMO,
} from "../gates/escada.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
let falhas = 0;
const checa = (oque, real, esperado) => {
  const bate = JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(real)}`); }
};

// ------------------------------------------------- a tabela lida, não copiada
const GUIA = readFileSync(resolve(RAIZ, "livro", "GUIA-EDITORIAL.md"), "utf8");
const bloom = tabelaDeBloom(GUIA);
checa("a tabela do Guia §2.5 é lida do arquivo", bloom.size > 30, true);
checa("o verbo de exemplo entra", bloom.get("derivar").rank, 4);
checa("e o NOME do processo entra como verbo dele mesmo", [bloom.get("aplicar").rank, bloom.get("avaliar").rank], [3, 5]);
checa("o acento não decide nada", bloom.has("analisar"), true);

// ------------------------------------------------------------- os andaimes
const cap = (objetivos, cartoes) =>
  `# X\n\n${objetivos.map((o) => `- **${o[0]}.** ${o[1]} coisas.`).join("\n")}\n\n` + cartoes.join("\n");

const cartao = (nivel, titulo, exs, cabecalho) =>
  `:::cartao {"nivel":${nivel},"titulo":"${titulo}"}\n\n` +
  (cabecalho ? `## ${cabecalho}\n\n` : "") +
  exs.map((e) =>
    `:::exercicio {"id":"${e.id}","tipo":"${e.tipo || "multipla"}","objetivo":"${e.obj}","dificuldade":"${e.dif}"}\n` +
    `Pergunta?\n\n> **gabarito:** a\n> **porque:** b\n:::`).join("\n") + "\n";

const roda = (fonte, dispensas) => verificarCapitulo(fatiarEscada(fonte), bloom, dispensas);
const tem = (r, re) => r.problemas.some((p) => re.test(p));

// ------------------------------------------------------------------ o teto
const semE3 = cap([["O1", "Derivar"]], [
  cartao(1, "A", [{ id: "a", obj: "O1", dif: "facil" }]),
  cartao(1, "B", [{ id: "b", obj: "O1", dif: "media" }]),
]);
checa("1. acusa o teto não atingido", tem(roda(semE3), /nenhum dos 2 exercício\(s\) chega ao degrau E3/), true);
checa("   e cala quando o trio fecha em E3",
  roda(cap([["O1", "Derivar"]], [
    cartao(1, "A", [{ id: "a", obj: "O1", dif: "facil" }]),
    cartao(1, "B", [{ id: "b", obj: "O1", dif: "media" }]),
    cartao(1, "C", [{ id: "c", obj: "O1", dif: "dificil" }]),
  ])).problemas.length, 0);

const abertaBaixa = cap([["O1", "Calcular"]], [
  cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil", tipo: "aberta" }]),
]);
checa("2. acusa o teto ultrapassado (aberta sob Aplicar)", tem(roda(abertaBaixa), /abaixo de Avaliar/), true);
checa("   e aceita a aberta sob Decidir, que é Avaliar",
  tem(roda(cap([["O1", "Decidir"]], [cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil", tipo: "aberta" }])])),
      /abaixo de Avaliar/), false);

const duasAbertas = cap([["O1", "Decidir"]], [
  cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil", tipo: "aberta" }]),
  cartao(1, "B", [{ id: "b", obj: "O1", dif: "dificil", tipo: "aberta" }]),
]);
checa("3. acusa a segunda aberta do mesmo objetivo", tem(roda(duasAbertas), /no máximo UMA por objetivo/), true);

// ---------------------------------------------------------------- a escada
const desce = cap([["O1", "Decidir"]], [
  cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil" }]),
  cartao(1, "B", [{ id: "b", obj: "O1", dif: "facil" }]),
]);
checa("4. acusa a queda de dois degraus dentro do nível", tem(roda(desce), /Queda de 2 degraus/), true);
checa("   e tolera a queda de um degrau, que a ADR 0023 permite",
  tem(roda(cap([["O1", "Decidir"]], [
    cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil" }]),
    cartao(1, "B", [{ id: "b", obj: "O1", dif: "media" }]),
  ])), /Queda/), false);

const fronteira = cap([["O1", "Decidir"]], [
  cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil" }]),
  cartao(2, "B", [{ id: "b", obj: "O1", dif: "facil" }]),
]);
checa("5. NÃO acusa a queda na fronteira de nível", tem(roda(fronteira), /Queda/), false);

const platoDe = (n) => cap([["O1", "Decidir"]], [
  ...Array.from({ length: n }, (_, i) => cartao(1, "C" + i, [{ id: "c" + i, obj: "O1", dif: "facil" }])),
  cartao(1, "Z", [{ id: "z", obj: "O1", dif: "dificil" }]),
]);
checa("6. acusa o platô de cinco", tem(roda(platoDe(5)), new RegExp(`5 cartões seguidos em E1`)), true);
checa("7. e o platô de quatro passa, porque quatro é o teto", tem(roda(platoDe(PLATO_MAXIMO)), /platô/), false);

// ------------------------------------------------- as isenções da ADR 0023
const historico = cap([["O1", "Decidir"]], [
  cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil" }]),
  cartao(1, "B", [{ id: "b", obj: "O1", dif: "facil" }], "De onde isto veio"),
]);
checa("o bloco histórico sai da escada (ADR 0023) e a queda não é acusada", tem(roda(historico), /Queda/), false);
checa("mas o exercício dele continua contando para o teto — a isenção é da ordenação",
  roda(cap([["O1", "Derivar"]], [
    cartao(1, "A", [{ id: "a", obj: "O1", dif: "facil" }]),
    cartao(1, "Verificação", [{ id: "v", obj: "O1", dif: "dificil" }]),
  ])).problemas.length, 0);

// --------------------------------------------- a camada de dívida declarada
const dispensado = roda(semE3, { teto: new Set(["O1"]) });
checa("8. o item dispensado não reprova", dispensado.problemas.length, 0);
checa("   e aparece no relatório de dívida", dispensado.divida.length, 1);
checa("   e a dívida paga que continua na lista reprova",
  roda(cap([["O1", "Derivar"]], [cartao(1, "A", [{ id: "a", obj: "O1", dif: "dificil" }])]),
       { teto: new Set(["O1"]) }).problemas.some((p) => /Tire-o da lista/.test(p)), true);
checa("   o mesmo vale para o platô",
  roda(platoDe(PLATO_MAXIMO), { plato: new Set(["1"]) }).problemas.some((p) => /Tire-o da lista/.test(p)), true);

// -------------------------------------------------------- o livro de verdade
const livro = verificar({
  guia: GUIA,
  capitulos: [{ slug: "ii-2-modelos-lineares",
    fonte: readFileSync(resolve(RAIZ, "livro", "capitulos", "ii-2-modelos-lineares.md"), "utf8") }],
}, { semNivel: new Set() });
checa("o capítulo em modo cartão é medido de ponta a ponta", livro.conta.cartoes, 38);
checa("e o ρ publicado é reproduzível pela mesma régua",
  Math.abs(spearman(fatiarEscada(readFileSync(resolve(RAIZ, "livro", "capitulos", "ii-2-modelos-lineares.md"), "utf8")).cartoes) - 0.45) < 0.02,
  true);

// 9. a régua tem de discriminar: dificuldade inventada não vira degrau.
checa("dificuldade fora da escala não vira degrau silencioso", DEGRAU["media"], 2);

console.log(falhas ? `\n✗ ${falhas} falha(s)` : "\n✓ tudo verde");
process.exit(falhas ? 1 : 0);
