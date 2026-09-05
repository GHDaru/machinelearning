// Teste do INSTRUMENTO da rampa (D29) e da rampa que ele mede.
//
// Duas metades, e a segunda é a que impede o conserto de desandar em silêncio.
//
// 1. A RÉGUA DISCRIMINA. Cada degrau de 1 a 5 é exercido por um bloco escrito
//    à mão, e os dois casos difíceis são os que decidem tudo: `numerica` cujo
//    dado está no enunciado é conta à mão (3), e `numerica` que manda operar
//    um artefato é manipulação (5). Régua que dá o mesmo número para os dois
//    não mede a diferença que a D29 existe para cobrar.
//
// 2. A RAMPA DO `II.2` É AFIRMADA, e não sustentada por construção. A D27 foi
//    consertada e o conserto criou um pico: a subida terminava no cartão 26 e
//    os doze últimos ficavam parados. Depois da D29 a inclinação DENTRO dos
//    cartões 27 a 38 é positiva e o grau máximo volta no último cartão. Nada
//    no repositório defendia esses dois números, e a próxima edição os desfaria
//    sem que nada acusasse — que é exatamente o que aconteceu com o ρ da
//    escada, e o motivo de `testes/escada.mjs` existir.
//
// Uso:  node publicar/testes/grau-de-producao.mjs
import { readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { grauDoAto, medirCapitulo, relatorio, inclinacao, GRAU } from "../grau-de-producao.mjs";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
let falhas = 0;
const checa = (nome, veio, esperado) => {
  const ok = JSON.stringify(veio) === JSON.stringify(esperado);
  if (!ok) falhas++;
  console.log(`${ok ? "OK  " : "FALHOU"} ${nome}`);
  if (!ok) console.log(`       esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(veio)}`);
};

// ---------------------------------------------------------------- 1. a régua
const ato = (tipo, corpo, bloco = "exercicio") => grauDoAto({ bloco, tipo, corpo });

checa("1 · escolher entre alternativas dadas",
  ato("multipla", "Por que o modelo é recusado?\n\n- [ ] Por custo.\n- [x] Por não explicar.\n"),
  GRAU.ESCOLHER);
checa("1 · o `prever` de três opções também é escolher",
  ato("prever", "Uma equipe troca a perda.\n\n- ( ) O modelo.\n- (!) O critério.\n", "interacao"),
  GRAU.ESCOLHER);
checa("2 · lembrar um termo",
  ato("completar", "O número que multiplica um atributo chama-se ______."),
  GRAU.LEMBRAR);
checa("3 · conta cujos dados estão no enunciado",
  ato("numerica", "Uma reta deixa os resíduos $-1$, $+2$, $-2$ e $+3$. Qual a soma dos quadrados?"),
  GRAU.CALCULAR);
checa("3 · o desvanecido sem opções é conta, não escolha",
  ato("desvanecido", "Complete:\n\n- [?] soma dos quadrados => 14\n", "interacao"),
  GRAU.CALCULAR);
checa("4 · escrever um argumento próprio",
  ato("principio", "> **pergunta:** Escreva por que isso não basta.", "interacao"),
  GRAU.ARGUMENTAR);
checa("4 · a aberta com rubrica é o mesmo gesto",
  ato("aberta", "Escreva a resposta que você daria a ela, em até seis linhas."),
  GRAU.ARGUMENTAR);
checa("5 · manipular um artefato que roda",
  ato("numerica", "Clique em **Ajustar** e responda o coeficiente de `preco`, com uma casa."),
  GRAU.MANIPULAR);
checa("5 · o laboratório é manipulação por construção",
  ato("", "Minimize no olho até o número parar de cair.", "lab"),
  GRAU.MANIPULAR);

// Os dois casos que separam o 3 do 5, e que são a diferença que a D29 cobra.
checa("o enunciado sem numeral nenhum só se responde rodando",
  ato("numerica", "Com `temperatura` marcada, responda o coeficiente de `preco`, com duas casas."),
  GRAU.MANIPULAR);
checa("expoente e nome de coluna não são dado do enunciado",
  ato("numerica", "Com as quatro colunas no ajuste, responda o $R^2$, com três casas."),
  GRAU.MANIPULAR);
checa("substantivo não é ordem: 'saiu do ajuste' não vira manipulação",
  ato("numerica", "Um modelo saiu do ajuste com $a = 2{,}5$ e $b = 4$. Quanto vale $\\hat{y}$ em $x = 6$?"),
  GRAU.CALCULAR);
checa("a ordem de operar tem de estar no enunciado, não na revelação",
  ato("numerica", "Uma reta erra $+2$ e $-1$. Qual o erro quadrático médio?\n" +
      "> **porque:** Rode o notebook para conferir."),
  GRAU.CALCULAR);

// ------------------------------------------------- 2. a rampa medida no II.2
const fonte = readFileSync(join(RAIZ, "livro", "capitulos", "ii-2-modelos-lineares.md"), "utf8");
const cartoes = medirCapitulo(fonte);
const r = relatorio(cartoes, [27, 38]);

checa("o baralho do II.2 tem 38 cartões", cartoes.length, 38);
checa("todo cartão do II.2 pede pelo menos um ato",
  cartoes.filter((c) => c.grau === null).length, 0);

// A D29, com o número: a inclinação dentro do fecho deixa de ser negativa.
checa("D29 · a inclinação nos cartões 27 a 38 não é negativa",
  r.inclinacaoFaixa >= 0, true);
// Margem, para o teste não passar por acaso na terceira casa decimal.
checa("D29 · e ela é uma rampa, não um empate (>= 0,05 por cartão)",
  r.inclinacaoFaixa >= 0.05, true);
// O fecho passou a pedir mais do que a abertura, e não menos.
checa("D29 · o fecho pede mais que a média da primeira metade",
  r.mediaFaixa > r.mediaPrimeira, true);
// O topo da régua volta no último quarto do capítulo, e não a dois terços.
checa("D29 · o grau máximo se sustenta no último quarto",
  r.ultimoMaximoPct >= 75, true);
// E nenhum cartão do fecho volta ao puro reconhecimento. É a frase da D29 em
// número: "o fecho cobra no nível de reconhecimento o que a parte anterior
// acabou de ensinar a produzir". Quatro cartões estavam em 1,00 (um `prever` de
// três opções mais uma múltipla) e nenhum pode voltar para lá.
const fecho = cartoes.slice(26).map((c) => c.grau);
checa("D29 · nenhum cartão de 27 a 38 fica no puro reconhecimento",
  Math.min(...fecho) >= 2, true);

// O ato do topo da régua chega ao fim: é a medida que a D27 comparou com o
// notebook do Géron, que fecha o ciclo até 98,6% do caminho.
const ultimoAtoMaximo = cartoes.reduce(
  (acc, c, i) => (c.atos.some((a) => a.grau === GRAU.MANIPULAR) ? i + 1 : acc), 0);
checa("D29 · o último ato de grau 5 está no último cartão",
  ultimoAtoMaximo, cartoes.length);

// ------------------------------- 3. o ciclo executável existe do outro lado
//
// Os dois exercícios do cartão 38 mandam alterar uma célula e trazer o número.
// Se a célula sumir do notebook, o exercício vira uma ordem para um lugar que
// não existe, e nenhum outro portão do repositório olha para dentro do `.ipynb`.
// E o gabarito NÃO pode estar impresso lá: foi a D26, e o caminho de volta é o
// mesmo (o capítulo oferece o link, o leitor clica e lê a resposta).
const notebook = readFileSync(
  join(RAIZ, "ml-zero", "etapa-05", "regressao_limonada.ipynb"), "utf8");

checa("a célula que o e40 manda alterar existe no notebook",
  notebook.includes("arredondar = False"), true);
checa("a célula que o e50 manda alterar existe no notebook",
  notebook.includes("mes = 3"), true);
checa("D26 · o gabarito do e40 não está impresso no notebook",
  notebook.includes("0.4985") || notebook.includes("0,4985"), false);
checa("D26 · o gabarito do e50 não está impresso no notebook",
  /\b1902\b/.test(notebook), false);

// -------------------------------------------------------- a conta da reta
checa("a inclinação de uma série que sobe é positiva",
  inclinacao([[1, 1], [2, 2], [3, 3]]), 1);
checa("e a de uma série plana é zero", inclinacao([[1, 2], [2, 2], [3, 2]]), 0);

console.log(falhas ? `\n✗ ${falhas} falha(s)` : "\n✓ tudo verde");
process.exit(falhas ? 1 : 0);
