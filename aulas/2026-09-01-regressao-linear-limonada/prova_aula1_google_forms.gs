/**
 * Gera a prova da AULA 1 — "Análise descritiva e diagnóstica (caso da limonada)"
 * como um Google Forms em modo teste (quiz), com gabarito, pontos e feedback.
 *
 * Como usar (2 minutos):
 *   1. Abra https://script.google.com e crie um projeto novo.
 *   2. Cole este arquivo inteiro no editor e salve.
 *   3. Execute a função `criarProvaAula1` (botão ▶). Autorize quando pedido.
 *   4. No log aparecem as duas URLs — a de EDIÇÃO (professor) e a PUBLICADA (alunos).
 */

const QUESTOES_AULA1 = [
  {
    titulo: "1. Na análise descritiva, uma das variáveis apresentou assimetria à direita forte (≈ 1,9) e curtose alta (≈ 5), indicando cauda pesada. Qual?",
    opcoes: [
      ["temperatura", false],
      ["precipitacao", true],
      ["vendas", false],
      ["panfletos", false],
    ],
    feedback: "A chuva concentra muitos dias de valor baixo e poucos de chuva forte: assimetria 1,86 e curtose ~5,2. Temperatura e vendas são quase simétricas; panfletos tem assimetria leve.",
  },
  {
    titulo: "2. A regra do IQR (quartil ± 1,5×IQR) marcou os 62 dias de preço 0,50 como \"outliers\". A interpretação correta desse resultado é:",
    opcoes: [
      ["os 62 dias devem ser removidos antes de modelar", false],
      ["o multiplicador 1,5 é baixo demais; com 3,0 o problema desaparece", false],
      ["preco só assume dois valores: o IQR colapsa em zero e a regra, que pressupõe variável contínua, deixa de significar \"outlier\"", true],
      ["há erro de digitação nos valores 0,50", false],
    ],
    feedback: "Q1 = Q3 = 0,30 → IQR = 0 e a cerca colapsa num ponto. A regra pressupõe variável contínua; preco é binária na prática. Remover os \"outliers\" apagaria julho e agosto.",
  },
  {
    titulo: "3. Os ~28 pontos de precipitação acima da cerca superior correspondem a dias de chuva forte que realmente aconteceram. O tratamento adequado é:",
    opcoes: [
      ["manter os pontos, e considerar uma transformação (por exemplo, log) se a análise indicar", true],
      ["excluir os pontos, porque outlier sempre prejudica a análise", false],
      ["substituir os valores pela média da variável", false],
      ["substituir os valores pela mediana da variável", false],
    ],
    feedback: "Outlier real carrega informação — chuva forte é justamente o que derruba venda. Excluir ou substituir apaga o fenômeno e enviesa qualquer análise seguinte.",
  },
  {
    titulo: "4. Curtose (excesso) de aproximadamente +5 em precipitacao significa que a distribuição:",
    opcoes: [
      ["é mais achatada que a normal", false],
      ["é simétrica", false],
      ["tem variância próxima de zero", false],
      ["tem caudas mais pesadas que as da normal — valores extremos mais frequentes", true],
    ],
    feedback: "Curtose de excesso positiva = leptocúrtica: caudas mais pesadas que as da normal. Achatamento seria curtose negativa; curtose não mede simetria nem variância.",
  },
  {
    titulo: "5. A correlação entre preco e vendas é +0,51. Por que a conclusão \"suba o preço para vender mais\" é errada?",
    opcoes: [
      ["0,51 é uma correlação fraca demais para qualquer conclusão", false],
      ["o preço 0,50 só existe em julho e agosto: a correlação mede a estação (confundimento), não o efeito do preço", true],
      ["o correto seria usar a correlação de Spearman", false],
      ["faltou padronizar as variáveis antes de calcular a correlação", false],
    ],
    feedback: "O preço nunca variou dentro de um mês: preço e estação são a mesma variável com dois nomes. A correlação mede o verão — \"termômetro disfarçado\".",
  },
  {
    titulo: "6. Na descritiva da temperatura, a média é ~61, o mínimo ~15 e o máximo ~103. O cuidado de leitura correto é:",
    opcoes: [
      ["valores acima de 100 são impossíveis; há erro de coleta", false],
      ["os dois extremos devem ser removidos pela regra do IQR", false],
      ["depois de padronizar, a unidade deixa de importar para a interpretação", false],
      ["a escala é Fahrenheit — interpretar os valores como °C levaria a conclusões absurdas", true],
    ],
    feedback: "Os valores (15 a 103, média 61) identificam a escala Fahrenheit. Unidade é a primeira checagem da descritiva; padronizar muda a escala dos números, não a necessidade de entender o que eles medem.",
  },
  {
    titulo: "7. Na scatter_matrix, todos os cruzamentos que envolvem preco aparecem como DUAS FAIXAS de pontos. Isso indica que:",
    opcoes: [
      ["preco assume pouquíssimos valores distintos (na prática, é binária)", true],
      ["preco tem correlação positiva forte com todas as variáveis", false],
      ["as faixas são os outliers detectados pelo IQR", false],
      ["houve erro de renderização do gráfico", false],
    ],
    feedback: "Faixas numa dispersão denunciam variável com poucos valores distintos. É a scatter_matrix mostrando o mesmo diagnóstico que o IQR colapsado já tinha dado: preco é binária.",
  },
  {
    titulo: "8. Sobre a correlação de Pearson, r = cov(x,y)/(sx·sy): se duas variáveis têm r ≈ 0, a conclusão correta é:",
    opcoes: [
      ["não existe relação alguma entre elas", false],
      ["existe relação causal fraca entre elas", false],
      ["não há associação LINEAR — mas pode existir relação não linear forte (por exemplo, em U)", true],
      ["uma delas tem variância zero", false],
    ],
    feedback: "Pearson mede só associação linear. Uma parábola perfeita pode dar r ≈ 0. Por isso o par a par (olhar a forma) vem antes e junto do número.",
  },
  {
    titulo: "9. As vendas médias por dia da semana variaram de 24,8 a 25,7 copos, e a correlação de cada dummy de dia com as vendas ficou entre −0,03 e +0,02. A decisão adequada é:",
    opcoes: [
      ["incluir dia_semana no modelo, porque em varejo o dia da semana sempre importa", false],
      ["deixar dia_semana fora do modelo: o sinal foi medido e não existe neste dado", true],
      ["converter o dia em número de 1 a 7 e incluir como variável contínua", false],
      ["excluir os domingos, que têm a menor média", false],
    ],
    feedback: "Amplitude menor que 1 copo e correlações indistinguíveis de zero: neste dado não há sinal, e atributo sem sinal só adiciona variância. Em varejo real costuma haver efeito de dia — aqui a conclusão vale porque foi MEDIDA.",
  },
  {
    titulo: "10. No gráfico das vendas ao longo do ano, a faixa do preço 0,50 (julho–agosto) está exatamente sobre o pico da série. O que essa imagem mostra?",
    opcoes: [
      ["o confundimento: o preço só muda no pico da estação, então qualquer variável que só muda ali \"correlaciona\" com vendas", true],
      ["a prova de que o aumento de preço causou o pico de vendas", false],
      ["que a série não tem sazonalidade relevante", false],
      ["que a média móvel de 7 dias distorce a série original", false],
    ],
    feedback: "A faixa sombreada sobre o pico é a fotografia do confundimento perfeito entre preço e estação. Causalidade é exatamente a leitura que a imagem desmente.",
  },
];

function criarProvaAula1() {
  const form = FormApp.create("Prova — Aula 1: análise descritiva e diagnóstica (limonada)");
  form.setIsQuiz(true);
  form.setDescription(
    "Análise Preditiva · aula 1\n" +
    "10 questões · 1 ponto cada · uma única alternativa correta por questão.\n" +
    "Cobre a análise descritiva, par a par, diagnóstica e o calendário — o modelo fica para a prova da aula 2."
  );
  form.setShuffleQuestions(false);
  form.setProgressBar(true);

  form.addTextItem().setTitle("Nome completo").setRequired(true);

  QUESTOES_AULA1.forEach((q) => {
    const item = form.addMultipleChoiceItem();
    item.setTitle(q.titulo).setPoints(1).setRequired(true);
    item.setChoices(q.opcoes.map(([texto, certa]) => item.createChoice(texto, certa)));
    const fb = FormApp.createFeedback().setText(q.feedback).build();
    item.setFeedbackForCorrect(fb);
    item.setFeedbackForIncorrect(fb);
  });

  Logger.log("EDIÇÃO (professor): " + form.getEditUrl());
  Logger.log("PUBLICADA (alunos): " + form.getPublishedUrl());
}
