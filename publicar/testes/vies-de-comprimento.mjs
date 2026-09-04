// Teste do gate de VIÉS DE COMPRIMENTO.
//
// Ele existe porque o defeito que o gate vigia já apareceu NAS DUAS DIREÇÕES,
// no mesmo repositório e com poucas semanas de distância:
//
//   - o `ROADMAP.md` (D17) mediu **88% das múltiplas gabaritáveis marcando a
//     alternativa mais longa** — o viés clássico, nascido da assimetria de
//     esforço entre a correta, que precisa ser defensável, e o distrator, que
//     só precisa estar errado;
//   - o conserto do `II.2` levou o capítulo a **0 de 26**, que é o mesmo canal
//     lateral com o sinal trocado: quem aprende a RISCAR a mais longa elimina
//     uma em quatro sem abrir o livro.
//
// Um gate que só cobrasse o excesso teria dado verde justamente na segunda
// falha. Por isso os dois casos centrais deste arquivo são o excesso e a falta,
// e por isso o resto está aqui: detector que acusa demais é desligado, e
// desligado ele não acusa nada.
//
// Rodar: node publicar/testes/vies-de-comprimento.mjs
import { estatistica, verificar, LIMITES } from "../gates/vies-de-comprimento.mjs";

let falhas = 0;
const checa = (oque, real, esperado) => {
  const bate = JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(real)}`); }
};

/** Uma múltipla de 4 alternativas em que a correta ocupa a posição `rank` do
 *  ranking de comprimento (0 = a mais longa, 3 = a mais curta). */
const item = (rank) => {
  const comps = [40, 30, 20, 10];
  return {
    tipo: "multipla",
    opcoes: comps.map((c, i) => ({ correta: i === rank, texto: "x".repeat(c) })),
  };
};
const lote = (n, ranks) => Array.from({ length: n }, (_, i) => item(ranks[i % ranks.length]));

// ---------------------------------------------------------------- a conta

checa("correta mais longa é contada", estatistica([item(0)]).maisLonga, 1);
checa("correta mais curta é contada", estatistica([item(3)]).maisCurta, 1);
checa("esperado é a soma de 1/N", Number(estatistica(lote(8, [0, 1, 2, 3])).esperado.toFixed(2)), 2);

// Empate conta como "mais longa" de propósito: quem risca a mais longa também
// acerta quando ela está empatada em primeiro.
checa("empate no topo conta como mais longa", estatistica([{
  opcoes: [{ correta: true, texto: "aaaa" }, { correta: false, texto: "bbbb" }],
}]).maisLonga, 1);

// O que a conta se recusa a medir, porque não há "a correta" bem definida.
checa("item sem correta é ignorado", estatistica([{
  opcoes: [{ correta: false, texto: "aa" }, { correta: false, texto: "b" }],
}]).n, 0);
checa("item com duas corretas é ignorado", estatistica([{
  opcoes: [{ correta: true, texto: "aa" }, { correta: true, texto: "b" }],
}]).n, 0);
checa("item com uma alternativa só é ignorado", estatistica([{
  opcoes: [{ correta: true, texto: "aa" }],
}]).n, 0);

// ------------------------------------------------- as duas direções da falha

const semDivida = new Set();

{
  // O defeito do D17: a correta é SEMPRE a mais longa.
  const r = verificar({ cap: lote(40, [0]) }, semDivida);
  checa("excesso reprova", r.problemas.length, 1);
  checa("excesso é nomeado como excesso", /vezes DEMAIS/.test(r.problemas[0]), true);
  checa("excesso tem z acima do teto", r.cobrado.z > LIMITES.z, true);
}

{
  // O defeito espelhado, que um gate de um lado só deixaria passar: a correta
  // NUNCA é a mais longa.
  const r = verificar({ cap: lote(40, [1, 2, 3]) }, semDivida);
  checa("falta reprova", r.problemas.length, 1);
  checa("falta é nomeada como falta", /vezes DE MENOS/.test(r.problemas[0]), true);
  checa("falta tem z abaixo do teto negativo", r.cobrado.z < -LIMITES.z, true);
}

{
  // O alvo: a correta cai no topo do ranking com a frequência do acaso.
  const r = verificar({ cap: lote(40, [0, 1, 2, 3]) }, semDivida);
  checa("comprimento indistinguível passa", r.problemas.length, 0);
  checa("e o resumo sai mesmo quando passa", r.resumo.length > 0, true);
}

{
  // A REGRESSÃO REAL, no tamanho real. Um capítulo deste livro tem cerca de 26
  // múltiplas, e o `II.2` chegou a 0 de 26 com a correta mais longa. Com um teto
  // de 3 esse caso passaria raspando (z = −2,94); é por ele que o teto é 2,5.
  const r = verificar({ cap: lote(26, [1, 2, 3]) }, semDivida);
  checa("0 de 26 (o estado real do II.2) reprova", r.problemas.length, 1);
  checa("e reprova pelo lado da falta", /vezes DE MENOS/.test(r.problemas[0]), true);
  checa("um teto de 3 teria deixado passar", Math.abs(r.cobrado.z) < 3, true);
}

// ------------------------------------------------------- a dívida declarada

{
  // Página declarada em dívida é medida e não reprova, mesmo no pior viés.
  const r = verificar({ velho: lote(40, [0]) }, new Set(["velho"]));
  checa("página em dívida não reprova pelo viés", r.problemas.length, 0);
  checa("página em dívida aparece no relatório", r.divida.length, 1);
  checa("dívida entra no resumo", /Dívida declarada/.test(r.resumo.join("\n")), true);
}

{
  // E a cobrança na outra direção: consertou, tem de sair da lista.
  const r = verificar({ velho: lote(40, [0, 1, 2, 3]) }, new Set(["velho"]));
  checa("dívida paga que fica na lista reprova", r.problemas.length, 1);
  checa("e a mensagem manda tirar da lista", /Tire-a da lista/.test(r.problemas[0]), true);
}

{
  // Página pequena demais não sustenta nem a cobrança nem a alta da lista.
  const r = verificar({ curto: lote(3, [0, 1, 2]) }, new Set(["curto"]));
  checa("página curta na lista não é forçada a sair", r.problemas.length, 0);
  const r2 = verificar({ curto: lote(3, [0]) }, semDivida);
  checa("página curta fora da lista não é cobrada", r2.problemas.length, 0);
}

{
  // A separação das camadas: o viés da dívida não contamina a conta cobrada.
  const r = verificar({ velho: lote(40, [0]), novo: lote(40, [0, 1, 2, 3]) }, new Set(["velho"]));
  checa("dívida não entra na conta cobrada", r.cobrado.n, 40);
  checa("livro com uma página limpa e uma em dívida passa", r.problemas.length, 0);
}

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTudo verde.");
process.exit(falhas ? 1 : 0);
