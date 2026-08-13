// Teste do `parseNumerico` — a tolerância do exercício numérico.
//
// Nasceu de um defeito real, achado ao escrever a prova da Parte V. O livro é
// em português, e quem escreve gabarito escreve `0,45 ± 0,01`. O parser trocava
// UMA vírgula por ponto (`replace(",", ".")` sem a flag global), então o valor
// virava 0.45 e a tolerância "0,01" era lida como **0**. Três exercícios já
// publicados declaravam tolerância e corrigiam por igualdade exata, sem que
// nada acusasse: o gate só exigia que houvesse um número.
//
// Rodar: node publicar/testes/numerico.mjs
import { parseNumerico } from "../interativos.mjs";

let falhas = 0;
const eq = (o, esperado, oque) => {
  const bate = o && o.valor === esperado.valor && o.tolerancia === esperado.tolerancia;
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque} -> ${JSON.stringify(o)}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}`); }
};

// O caso que quebrou: vírgula decimal nos DOIS números.
eq(parseNumerico("0,45 ± 0,01"), { valor: 0.45, tolerancia: 0.01 }, "vírgula no valor e na tolerância");
eq(parseNumerico("11,1 ± 0,05"), { valor: 11.1, tolerancia: 0.05 }, "vírgula com parte inteira de dois dígitos");

// O que já funcionava, e precisa continuar funcionando.
eq(parseNumerico("0.75 ± 0.02"), { valor: 0.75, tolerancia: 0.02 }, "ponto nos dois");
eq(parseNumerico("0,45 ± 0.01"), { valor: 0.45, tolerancia: 0.01 }, "vírgula só no valor");
eq(parseNumerico("40 ± 0"), { valor: 40, tolerancia: 0 }, "tolerância zero declarada de propósito");
eq(parseNumerico("1728"), { valor: 1728, tolerancia: 0 }, "inteiro sem tolerância");
eq(parseNumerico("0,17"), { valor: 0.17, tolerancia: 0 }, "decimal sem tolerância declarada");
eq(parseNumerico("-1"), { valor: -1, tolerancia: 0 }, "negativo");
eq(parseNumerico("0.5 +- 0.1"), { valor: 0.5, tolerancia: 0.1 }, "sinal +- em vez de ±");

console.log(falhas ? `\n✗ ${falhas} caso(s) falharam` : "\n✓ tolerância numérica preservada");
process.exit(falhas ? 1 : 0);
