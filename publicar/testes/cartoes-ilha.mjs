// Teste do detector de ILHA no baralho de cartões.
//
// Nasceu de um defeito publicado, medido no `II.2` em 2026-09-01. Com o modo
// cartão ligado, o `tema/cartoes.js` põe `hidden` em tudo que não caiu dentro de
// um cartão. Isso é deliberado. O que não era deliberado é o que acontecia
// quando o baralho fechava no meio do capítulo com `:::cartao-fim`, seguia com
// prosa, e reabria depois: o trecho do meio virava uma ILHA, presente na página
// inteira e ausente no modo cartão, sem que nada avisasse.
//
// No `II.2` eram seis interrupções e 29,1% do capítulo fora do baralho. E o dano
// não parou na prosa: TRÊS exercícios que valem nota ficaram dentro de cartões
// citando material que tinha ido para a ilha — `e4` pedindo "pelo ajuste
// múltiplo acima", `e5` citando um coeficiente `+2,41` invisível, e `e6`, a
// aberta corrigida por rubrica, abrindo com "você tem os 365 dias do conjunto
// acima". Um quarto do banco do capítulo era inrespondível justamente no modo
// em que o capítulo se propõe a ser lido no celular.
//
// Este teste existe para que o detector não morra em silêncio numa refatoração:
// o caso que importa é o quarto, e os outros quatro estão aqui porque um
// detector que acusa demais é desligado, e desligado ele não acusa nada.
//
// Rodar: node publicar/testes/cartoes-ilha.mjs
import { ilhasDe, pontasDe } from "../cartoes.mjs";

let falhas = 0;
const checa = (oque, real, esperado) => {
  const bate = JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${bate ? "OK  " : "FALHOU"} ${oque}`);
  if (!bate) { falhas++; console.log(`       esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(real)}`); }
};

const cartao = (t) => `:::cartao {"nivel":1,"titulo":"${t}"}`;

// Capítulo sem marcador nenhum cai no corte por cabeçalho: não há baralho, não
// há ilha, e `pontasDe` não tem o que relatar. São 28 capítulos do livro.
checa("sem baralho não tem ilha", ilhasDe("# Cap\n\nProsa.\n").length, 0);
checa("sem baralho não tem pontas", pontasDe("# Cap\n\nProsa.\n"), null);

// O caso normal: baralho contínuo com rodapé depois do fecho.
{
  const md = `${cartao("A")}\nUm.\n\n${cartao("B")}\nDois.\n\n:::cartao-fim\n\nRodapé permitido.\n`;
  checa("baralho contínuo não acusa", ilhasDe(md).length, 0);
  checa("rodapé conta como ponta, não como ilha", pontasDe(md).depois, 2);
}

// Ponta na frente: é onde moram o título, o selo de data e os objetivos.
{
  const md = `Cabeçalho do capítulo.\n\n${cartao("A")}\nUm.\n\n:::cartao-fim\n\nRodapé.\n`;
  checa("ponta antes do primeiro cartão é permitida", ilhasDe(md).length, 0);
  checa("e é contada", pontasDe(md).antes, 3);
}

// O CASO QUE IMPORTA. Fecha, escreve, reabre: o meio some.
{
  const md = `${cartao("A")}\nUm.\n\n:::cartao-fim\n\nA montagem da limonada, perdida.\n\n${cartao("B")}\nDois.\n\n:::cartao-fim\n`;
  const ilhas = ilhasDe(md);
  checa("ilha no meio é acusada", ilhas.length, 1);
  checa("com a amostra do trecho perdido", ilhas[0].amostra, "A montagem da limonada, perdida.");
  checa("e com a contagem de palavras", ilhas[0].palavras, 5);
}

// Duas interrupções, duas ilhas — o relato é por trecho, não agregado, porque
// quem conserta precisa saber ONDE.
{
  const md = `${cartao("A")}\nUm.\n\n:::cartao-fim\n\nPrimeira ilha.\n\n${cartao("B")}\nDois.\n\n` +
             `:::cartao-fim\n\nSegunda ilha aqui.\n\n${cartao("C")}\nTrês.\n\n:::cartao-fim\n`;
  checa("duas interrupções, duas ilhas", ilhasDe(md).length, 2);
}

// Fecho seguido de fecho, sem nada entre eles: não é ilha, é redundância.
checa("fecho vazio não é ilha",
  ilhasDe(`${cartao("A")}\nUm.\n\n:::cartao-fim\n\n:::cartao-fim\n`).length, 0);

// Um marcador citado num exemplo de código não é corte. O
// `BANCO-DE-EXERCICIOS.md` ENSINA esta sintaxe mostrando blocos, e já foi
// acusado antes por um medidor que não sabia disso.
checa("marcador dentro de cerca não abre ilha",
  ilhasDe(`${cartao("A")}\nUm.\n\n\`\`\`\n:::cartao-fim\nexemplo de sintaxe\n\`\`\`\n\n:::cartao-fim\n`).length, 0);

// Baralho aberto até o fim do arquivo, sem fecho: tudo é cartão, nada é ilha.
checa("baralho sem fecho não tem ilha",
  ilhasDe(`${cartao("A")}\nUm.\n\n${cartao("B")}\nDois.\n`).length, 0);

console.log(falhas ? `\n✗ ${falhas} caso(s) falharam` : "\n✓ ilha acusada, ponta permitida e contada, cerca respeitada");
process.exit(falhas ? 1 : 0);
