/**
 * Gera a prova "Regressão, interpretação e regularização — Califórnia" como um
 * Google Forms em modo teste (quiz), com gabarito, pontos e feedback por questão.
 * GERADO a partir de prova_california.md — edite lá e regenere, para não divergir.
 *
 * Uso: cole em https://script.google.com, execute criarProvaCalifornia (▶),
 * autorize, e leia no log as URLs de edição (professor) e publicada (alunos).
 */

const QUESTOES_CALIFORNIA = [
  {
    "titulo": "1. A coluna total_bedrooms tem 207 valores faltantes. No pipeline com divisão treino/teste, o tratamento correto é:",
    "opcoes": [
      [
        "remover as 207 linhas, inclusive as que caírem no teste",
        false
      ],
      [
        "imputar com a mediana calculada no dataset inteiro, antes da divisão",
        false
      ],
      [
        "imputar com a mediana calculada só no treino (deu 437) e aplicar esse mesmo valor ao teste",
        true
      ],
      [
        "substituir por zero, que é neutro",
        false
      ]
    ],
    "feedback": "Estatística de imputação é parâmetro aprendido: aprende no treino (mediana 437), aplica ao teste. Imputar com o dataset inteiro vaza o teste; deletar linhas do teste muda a população avaliada."
  },
  {
    "titulo": "2. Exatamente 965 bairros têm median_house_value = 500 001 — nem um dólar a mais, nem a menos. A leitura correta é:",
    "opcoes": [
      [
        "são erros de digitação e devem ser removidos",
        false
      ],
      [
        "a regra do IQR confirma que são outliers e manda excluir",
        false
      ],
      [
        "500 001 era o preço de tabela dos imóveis de luxo em 1990",
        false
      ],
      [
        "o alvo foi censurado no teto pelo censo: valores acima de US$ 500 mil foram truncados, e esses 965 não são outliers",
        true
      ]
    ],
    "feedback": "965 valores idênticos em 500 001 é assinatura de censura administrativa, não de fenômeno. Outlier se investiga; teto censurado se trata (e a questão 15 mostra o estrago de ignorá-lo)."
  },
  {
    "titulo": "3. A categoria ISLAND de ocean_proximity tem 5 linhas em 20 640. A consequência para o coeficiente da dummy oceano_ISLAND é:",
    "opcoes": [
      [
        "nenhuma: o coeficiente vale o mesmo que os demais",
        false
      ],
      [
        "o coeficiente fica mais preciso, porque a categoria é homogênea",
        false
      ],
      [
        "a dummy deve ser convertida em variável contínua",
        false
      ],
      [
        "o coeficiente é estimado sobre 5 observações: instável, sensível a qualquer mudança na amostra, e não deve ser lido como efeito",
        true
      ]
    ],
    "feedback": "Coeficiente é estimado da variação disponível; com 5 linhas, qualquer idiossincrasia vira \"efeito\". É o mesmo aviso do coeficiente instável sob poucos dados, em versão extrema."
  },
  {
    "titulo": "4. median_income varia de 0,5 a 15, com média 3,87. Antes de interpretar qualquer coeficiente dela, é preciso saber que:",
    "opcoes": [
      [
        "a renda está padronizada entre 0 e 15",
        false
      ],
      [
        "a unidade é dezenas de milhares de dólares por ano (3,87 ≈ US$ 38,7 mil): ignorar a unidade erra a leitura por um fator de 10 000",
        true
      ],
      [
        "a renda está em dólares por mês",
        false
      ],
      [
        "valores acima de 10 são impossíveis e devem ser tratados",
        false
      ]
    ],
    "feedback": "A ficha do dado diz: renda mediana em dezenas de milhares de US$. Unidade é a primeira checagem da descritiva — o mesmo hábito do Fahrenheit na limonada."
  },
  {
    "titulo": "5. Sozinha, median_income (padronizada) dá R² de teste 0,471. A leitura mais útil desse número é:",
    "opcoes": [
      [
        "um único atributo já explica quase metade da variância do preço — e vira a régua que o modelo múltiplo precisa superar",
        true
      ],
      [
        "o modelo é inútil, pois erra mais da metade",
        false
      ],
      [
        "0,471 é a correlação entre renda e preço",
        false
      ],
      [
        "falta padronizar a renda para o R² subir",
        false
      ]
    ],
    "feedback": "R² de um atributo só é a régua: o múltiplo (0,638) precisa justificar seus 12 atributos extras pelo ganho sobre 0,471 — ganho real aqui (+0,17), mas é essa a comparação que importa."
  },
  {
    "titulo": "6. Na regressão simples padronizada, o coeficiente da renda é ≈ +79 553. A interpretação correta é:",
    "opcoes": [
      [
        "cada dólar de renda aumenta o imóvel em 79 553 dólares",
        false
      ],
      [
        "79 553 é o preço previsto para a renda média",
        false
      ],
      [
        "subir um desvio-padrão na renda mediana do bairro move a previsão em ≈ +US$ 79,6 mil",
        true
      ],
      [
        "o coeficiente está errado, pois renda não pode valer mais que 15",
        false
      ]
    ],
    "feedback": "Padronizado, o coeficiente fala em desvios-padrão da entrada: +79,6 mil US$ por dp da renda do bairro. As demais alternativas trocam unidade ou papel do coeficiente."
  },
  {
    "titulo": "7. A correlação de median_income com o alvo é +0,688. Sem rodar nada, o R² da regressão simples correspondente é aproximadamente:",
    "opcoes": [
      [
        "0,688",
        false
      ],
      [
        "0,344",
        false
      ],
      [
        "0,83",
        false
      ],
      [
        "0,47 — porque na regressão simples R² = r²",
        true
      ]
    ],
    "feedback": "Na simples, R² = r² = 0,688² ≈ 0,47 — e bate com o 0,471 medido no teste. Liga a diagnóstica à modelagem sem rodar nada."
  },
  {
    "titulo": "8. Sozinho, total_rooms tem correlação +0,134 com o preço. No modelo múltiplo, seu coeficiente sai negativo (≈ −13 mil US$/dp). A explicação correta é:",
    "opcoes": [
      [
        "o coeficiente negativo prova que mais cômodos derrubam o preço",
        false
      ],
      [
        "é erro numérico: correlação e coeficiente devem ter o mesmo sinal",
        false
      ],
      [
        "com total_bedrooms, households e population no modelo, o coeficiente mede o efeito de cômodos dado o resto — e esse condicional pode trocar o sinal da relação marginal",
        true
      ],
      [
        "faltou aplicar logaritmo em total_rooms",
        false
      ]
    ],
    "feedback": "Sinal marginal (sozinho) e sinal condicional (dado o resto) são perguntas diferentes; sob colinearidade com quartos/domicílios/população, o condicional pode inverter. Não é erro: é outra pergunta."
  },
  {
    "titulo": "9. O modelo foi treinado com as cinco dummies de ocean_proximity ao mesmo tempo. O problema conhecido dessa escolha é:",
    "opcoes": [
      [
        "dummies não podem entrar em regressão linear",
        false
      ],
      [
        "as cinco somam sempre 1, ficando colineares com o intercepto (*dummy trap*): o ajuste fecha, mas os coeficientes individuais das dummies e o intercepto perdem leitura isolada",
        true
      ],
      [
        "o modelo deixa de convergir",
        false
      ],
      [
        "o R² de teste fica artificialmente alto",
        false
      ]
    ],
    "feedback": "As cinco dummies somam 1 em toda linha: colinearidade exata com o intercepto. O solver resolve numericamente, mas intercepto e dummies perdem leitura individual. Saídas: drop_first ou deixar a regularização cortar (questão 17)."
  },
  {
    "titulo": "10. No múltiplo padronizado, latitude dá ≈ −54,3 mil e longitude ≈ −54,0 mil US$/dp. A leitura correta do par é:",
    "opcoes": [
      [
        "morar ao norte e morar a leste destroem o preço, cada um por si",
        false
      ],
      [
        "as duas devem ser removidas por redundância",
        false
      ],
      [
        "na Califórnia, latitude e longitude juntas codificam a geografia (litoral × interior, sul × norte): o par se lê junto, e \"variar uma mantendo a outra fixa\" é operação na equação, não um deslocamento real",
        true
      ],
      [
        "o sinal negativo indica erro de escala",
        false
      ]
    ],
    "feedback": "Geografia mora no par. Fixar a longitude e \"andar um dp de latitude\" cruza o estado na diagonal — operação da equação, não um lugar real. Coordenadas se leem juntas (ou viram distância-à-costa engenheirada)."
  },
  {
    "titulo": "11. total_bedrooms sai com ≈ +44,9 mil e total_rooms com ≈ −13,2 mil, sendo os dois altamente correlacionados entre si. O erro de teste não muda se os dois trocarem pesos entre si. Isso ilustra:",
    "opcoes": [
      [
        "colinearidade: a previsão fica estável, mas a leitura de cada coeficiente separado vira ruído — o mesmo fenômeno de temperatura×panfletos na limonada",
        true
      ],
      [
        "que quartos valem mais que cômodos no mercado",
        false
      ],
      [
        "heterocedasticidade",
        false
      ],
      [
        "vazamento do teste para o treino",
        false
      ]
    ],
    "feedback": "A assinatura da colinearidade: previsão estável, pesos intercambiáveis, leitura isolada sem valor. A limonada mostrou com panfletos×temperatura; aqui são quartos×cômodos."
  },
  {
    "titulo": "12. O coeficiente da renda no múltiplo é ≈ +74,8 mil US$/dp \"mantendo os demais constantes\". Um relatório conclui: \"aumentar a renda do bairro em 1 dp causa +US$ 74,8 mil no imóvel\". O erro é:",
    "opcoes": [
      [
        "\"mantendo constante\" é operação matemática na equação ajustada, não intervenção no mundo: bairros de renda diferente diferem em tudo, e o modelo prevê — não autoriza leitura causal",
        true
      ],
      [
        "o valor correto seria +79,6 mil, o da regressão simples",
        false
      ],
      [
        "não há erro: coeficiente ajustado é efeito causal",
        false
      ],
      [
        "o erro é usar desvio-padrão em vez de dólar",
        false
      ]
    ],
    "feedback": "O condicional da equação não é contrafactual do mundo. Bairro de renda maior difere em escola, oferta, construção — nada disso está \"mantido constante\" na realidade. Modelo preditivo prevê; não autoriza política."
  },
  {
    "titulo": "13. O múltiplo deu R² de treino 0,647 e de teste 0,638. O diagnóstico correto é:",
    "opcoes": [
      [
        "sobreajuste grave: o treino está acima do teste",
        false
      ],
      [
        "treino e teste andam juntos: não há sobreajuste relevante; o que limita o modelo é a forma (reta em relações que não são retas), não a variância",
        true
      ],
      [
        "subajuste zero: 0,64 é o máximo teórico",
        false
      ],
      [
        "o teste vazou para o treino",
        false
      ]
    ],
    "feedback": "Gap treino−teste de 0,009 é ruído: variância sob controle. O que falta é capacidade/forma — relações não lineares (geografia!) que uma reta não desenha. Regularizar não conserta viés de forma."
  },
  {
    "titulo": "14. No teste, RMSE ≈ US$ 69,3 mil e MAE ≈ US$ 50,3 mil. A diferença entre os dois diz que:",
    "opcoes": [
      [
        "houve erro de conta: RMSE e MAE deveriam ser iguais",
        false
      ],
      [
        "o erro típico é de 19 mil dólares",
        false
      ],
      [
        "o RMSE está em outra unidade",
        false
      ],
      [
        "existe uma cauda de erros grandes: o RMSE eleva ao quadrado e é puxado por eles; o MAE descreve melhor o erro \"típico\" para comunicar ao negócio",
        true
      ]
    ],
    "feedback": "RMSE ≫ MAE denuncia cauda pesada de erros (o quadrado amplifica os grandes — inclusive os do teto censurado). Para comunicar erro típico, MAE; para otimização quadrática, RMSE."
  },
  {
    "titulo": "15. Nos 233 bairros do teste que estão no teto censurado (500 001), o resíduo médio é +107,7 mil (previsto acima do \"real\"); fora do teto, é −4,3 mil. A leitura correta é:",
    "opcoes": [
      [
        "o modelo superestima sistematicamente os imóveis caros por defeito próprio",
        false
      ],
      [
        "o alvo é que está truncado: o modelo prevê acima de 500 mil onde o censo cortou o valor — o \"erro\" ali é do dado, e avaliar sem tratar a censura pune o modelo injustamente",
        true
      ],
      [
        "é preciso remover os 233 do treino e do teste, sempre",
        false
      ],
      [
        "o resíduo positivo prova heterocedasticidade",
        false
      ]
    ],
    "feedback": "O modelo prevê ~608 mil em média onde o censo escreveu 500 001: o resíduo mede a censura, não a falha. Tratamentos honestos: avaliar com/sem o teto separadamente, ou modelo de censura (Tobit); nunca fingir que 500 001 é o preço verdadeiro."
  },
  {
    "titulo": "16. \"R² de 0,638 é bom ou ruim?\" A resposta tecnicamente correta é:",
    "opcoes": [
      [
        "ruim: abaixo de 0,9 não se publica",
        false
      ],
      [
        "bom: acima de 0,5 é sempre aceitável",
        false
      ],
      [
        "depende da régua e da pergunta: supera a renda sozinha (0,471) e a média (0), mas RMSE de US$ 69 mil pode ser inútil para precificar um imóvel e suficiente para ranquear regiões",
        true
      ],
      [
        "a pergunta não faz sentido, pois R² não avalia regressão",
        false
      ]
    ],
    "feedback": "R² não tem régua absoluta. A resposta profissional compara com as linhas de base disponíveis e com o uso: ranquear regiões tolera US$ 69 mil de RMSE; precificar um imóvel específico, não."
  },
  {
    "titulo": "17. O LassoCV (α escolhido por validação cruzada) zerou exatamente um atributo — a dummy oceano_<1H OCEAN — e empatou o R² de teste (0,6377 contra 0,6375 do modelo cheio). A leitura correta é:",
    "opcoes": [
      [
        "o lasso errou ao descartar uma variável com informação",
        false
      ],
      [
        "o lasso fez a seleção embutida e desarmou a *dummy trap* sozinho: com as cinco dummies somando 1, uma delas é redundante — e foi a que ele cortou, sem perder desempenho",
        true
      ],
      [
        "o lasso sempre zera exatamente uma variável",
        false
      ],
      [
        "o empate prova que regularizar não serve para nada aqui",
        false
      ]
    ],
    "feedback": "A redundância exata das cinco dummies dá ao lasso um corte \"de graça\": zera uma, não perde nada (0,6377 ≈ 0,6375). Seleção embutida fazendo o trabalho que o drop_first faria à mão — e parcimônia: mesmo desempenho, menos parâmetros."
  },
  {
    "titulo": "18. Varrendo α para cima, a ordem de zeramento termina com housing_median_age, depois oceano_INLAND, e median_income por último — com α uma ordem de grandeza acima de todos. Já total_rooms cai cedo. Isso significa que:",
    "opcoes": [
      [
        "total_rooms é inútil no mundo real",
        false
      ],
      [
        "a ordem é aleatória e muda a cada execução",
        false
      ],
      [
        "a ordem ranqueia a contribuição única de cada atributo: a renda é o sinal de que o modelo menos abre mão; total_rooms cai cedo por ser redundante com quartos/domicílios/população, não por ser inútil",
        true
      ],
      [
        "a renda deveria ter sido zerada primeiro, por ter o maior coeficiente",
        false
      ]
    ],
    "feedback": "A ordem de eliminação ranqueia contribuição única, como na limonada (o preço confundido caiu primeiro; a temperatura, por último). Aqui a renda é a \"temperatura\" do problema; total_rooms é o \"panfleto\"."
  },
  {
    "titulo": "19. Neste problema, population chega aos milhares enquanto median_income vive entre 0,5 e 15. Rodar ridge/lasso sem padronizar faria a penalidade:",
    "opcoes": [
      [
        "punir os atributos pela unidade em que foram medidos, e não pela utilidade — o coeficiente da renda, numericamente grande por causa da escala, seria esmagado primeiro",
        true
      ],
      [
        "funcionar igual, pois a penalidade é invariante a escala",
        false
      ],
      [
        "zerar automaticamente as dummies",
        false
      ],
      [
        "aumentar o R² de treino",
        false
      ]
    ],
    "feedback": "A penalidade soma coeficientes como se fossem comparáveis; sem padronizar, quem tem unidade \"cara\" (renda: um dp vale poucos pontos na escala crua, exigindo coeficiente numérico grande) apanha primeiro. A multa viraria imposto sobre unidades."
  },
  {
    "titulo": "20. A validação cruzada escolheu α=19 para o ridge e α=34 para o lasso. Sobre esses números, a afirmação correta é:",
    "opcoes": [
      [
        "o lasso é mais regularizado que o ridge, pois 34 > 19",
        false
      ],
      [
        "os dois α deveriam ser iguais",
        false
      ],
      [
        "o α correto seria escolhido no conjunto de teste, que é maior",
        false
      ],
      [
        "cada α foi escolhido por validação cruzada dentro do treino, com o teste tocado uma única vez ao final — e α de métodos diferentes não se compara: as convenções de escala da penalidade diferem entre Lasso e Ridge",
        true
      ]
    ],
    "feedback": "λ/α é hiperparâmetro: decide-se por validação cruzada no treino; o teste julga uma vez. E α entre métodos não se compara — Lasso e Ridge do scikit-learn usam normalizações diferentes do erro (a \"pegadinha de régua\")."
  }
];

function criarProvaCalifornia() {
  const form = FormApp.create("Prova — Regressão e regularização: Califórnia");
  form.setIsQuiz(true);
  form.setDescription(
    "Análise Preditiva · problema da Califórnia (censo de 1990, 20 640 block groups)\n" +
    "20 questões · 1 ponto cada · uma única alternativa correta por questão.\n" +
    "Blocos: o dado (1–4) · regressão simples (5–8) · modelo múltiplo (9–12) · análise de resultado (13–16) · Ridge e Lasso (17–20)."
  );
  form.setShuffleQuestions(false);
  form.setProgressBar(true);
  form.addTextItem().setTitle("Nome completo").setRequired(true);

  QUESTOES_CALIFORNIA.forEach((q) => {
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
