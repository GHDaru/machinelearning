/**
 * Gera a prova "Regressão linear com o caso da limonada" como um Google Forms
 * no modo teste (quiz), com gabarito, pontuação e feedback por questão.
 *
 * Como usar (2 minutos):
 *   1. Abra https://script.google.com e crie um projeto novo.
 *   2. Cole este arquivo inteiro no editor e salve.
 *   3. Execute a função `criarProva` (botão ▶). Autorize quando pedido.
 *   4. Abra o menu "Execuções" (ou Ctrl+Enter no log): as duas URLs aparecem —
 *      a de EDIÇÃO (para você) e a PUBLICADA (para enviar aos alunos).
 *
 * O formulário é criado no Drive da conta que executar o script.
 */

const QUESTOES = [
  {
    titulo: "1. Na análise descritiva, uma das variáveis apresentou assimetria à direita forte (≈ 1,9) e curtose alta (≈ 5), indicando cauda pesada. Qual?",
    opcoes: [
      ["temperatura", false],
      ["precipitacao", true],
      ["vendas", false],
      ["panfletos", false],
    ],
    feedback: "A chuva concentra muitos dias de valor baixo e poucos dias de chuva forte: assimetria 1,86 e curtose ~5,2. Temperatura e vendas são quase simétricas; panfletos tem assimetria leve.",
  },
  {
    titulo: "2. A regra do IQR (quartil ± 1,5×IQR) marcou os 62 dias de preço 0,50 como \"outliers\". A interpretação correta desse resultado é:",
    opcoes: [
      ["os 62 dias devem ser removidos antes de modelar", false],
      ["o multiplicador 1,5 é baixo demais; com 3,0 o problema desaparece", false],
      ["`preco` só assume dois valores: o IQR colapsa em zero e a regra, que pressupõe variável contínua, deixa de significar \"outlier\"", true],
      ["há erro de digitação nos valores 0,50", false],
    ],
    feedback: "Q1 = Q3 = 0,30 → IQR = 0 e a cerca colapsa num ponto. A regra pressupõe variável contínua; preco é binária na prática. Remover os \"outliers\" apagaria julho e agosto do dataset.",
  },
  {
    titulo: "3. Os ~28 pontos de precipitação acima da cerca superior correspondem a dias de chuva forte que realmente aconteceram. O tratamento adequado é:",
    opcoes: [
      ["manter os pontos, e considerar uma transformação (por exemplo, log) se a análise dos resíduos indicar", true],
      ["excluir os pontos, porque outlier sempre prejudica a regressão", false],
      ["substituir os valores pela média da variável", false],
      ["substituir os valores pela mediana da variável", false],
    ],
    feedback: "Outlier real carrega informação — chuva forte é justamente o que derruba venda. Excluir ou substituir apaga o fenômeno e enviesa o modelo.",
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
    titulo: "6. Por que o StandardScaler é ajustado (fit) apenas no conjunto de treino?",
    opcoes: [
      ["porque o scikit-learn exige essa ordem", false],
      ["para o código rodar mais rápido", false],
      ["para evitar vazamento: usar média e desvio do teste contaminaria a avaliação, que deve simular dados futuros", true],
      ["porque o teste tem escala diferente do treino", false],
    ],
    feedback: "O teste simula o futuro, e o futuro não fornece parâmetros. Média e desvio aprendidos no dado completo levariam informação do teste para dentro do pipeline.",
  },
  {
    titulo: "7. O modelo linear obteve R² ≈ 0,98 no treino E no teste. A leitura correta é:",
    opcoes: [
      ["o modelo explica ~98% da variância das vendas e generaliza bem — o que não autoriza ler os coeficientes como efeitos causais", true],
      ["o modelo decorou os dados (sobreajuste)", false],
      ["R² alto prova que subir o preço aumenta as vendas", false],
      ["um R² tão alto é impossível; o experimento está errado", false],
    ],
    feedback: "Treino ≈ teste afasta o sobreajuste, e R² mede variância explicada — nada além. O coeficiente positivo do preço no mesmo modelo é o contraexemplo.",
  },
  {
    titulo: "8. Se o gráfico de resíduo × previsto mostrasse um \"funil\" (resíduos abrindo conforme o previsto cresce), isso indicaria:",
    opcoes: [
      ["colinearidade entre as preditoras", false],
      ["que o modelo está perfeito", false],
      ["que o teste vazou para o treino", false],
      ["variância não constante (heterocedasticidade) — considerar transformar o alvo ou usar pesos", true],
    ],
    feedback: "Funil = a dispersão do erro cresce com o nível da previsão. Remédios clássicos: transformar o alvo (log) ou mínimos quadrados ponderados.",
  },
  {
    titulo: "9. A diferença central entre as regressões Ridge e Lasso é:",
    opcoes: [
      ["Ridge (L2) encolhe os coeficientes sem zerá-los; Lasso (L1) encolhe e pode zerar, funcionando como seleção de atributos", true],
      ["Lasso serve apenas para classificação", false],
      ["Ridge zera coeficientes; Lasso apenas encolhe", false],
      ["com o mesmo α, as duas produzem exatamente o mesmo modelo", false],
    ],
    feedback: "A penalidade L2 encolhe suavemente e nunca zera; a L1 tem \"quina\" em zero e zera coeficientes — seleção de atributos embutida.",
  },
  {
    titulo: "10. Com os 14 atributos expandidos, o Lasso empatou no R² de teste com o modelo completo mantendo apenas 8 coeficientes. A decisão de engenharia correta é:",
    opcoes: [
      ["escolher o modelo de 14 atributos, pois usa \"toda a informação disponível\"", false],
      ["escolher o Lasso: desempenho igual com menos parâmetros é um modelo mais simples de manter e de explicar", true],
      ["escolher sempre o modelo de maior R² no treino", false],
      ["rejeitar os três e partir para uma rede neural", false],
    ],
    feedback: "Empate de desempenho + menos parâmetros = fique com o mais simples: mais barato de manter, de explicar e de auditar.",
  },
];

function criarProva() {
  const form = FormApp.create("Prova — Regressão linear com o caso da limonada");
  form.setIsQuiz(true);
  form.setDescription(
    "Análise Preditiva · aula de 2026-09-01\n" +
    "10 questões · 1 ponto cada · uma única alternativa correta por questão.\n" +
    "Baseada no notebook trabalhado em aula (dataset da limonada)."
  );
  form.setShuffleQuestions(false);
  form.setProgressBar(true);

  // Identificação do aluno (a coleta de e-mail depende da conta/domínio;
  // o campo de nome funciona em qualquer conta).
  form.addTextItem().setTitle("Nome completo").setRequired(true);

  QUESTOES.forEach((q) => {
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
