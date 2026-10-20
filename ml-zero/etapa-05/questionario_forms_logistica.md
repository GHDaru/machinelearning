# Questionário: regressão logística (conteúdo para o Google Forms)

Conteúdo pronto para colar num Google Forms em modo **Teste** (Configurações → Tornar este um teste). Não há API de criação de Forms, então o formulário em si é montado à mão; este arquivo é o gabarito e a fonte.

Fontes cobradas, na ordem em que a tarefa pede que o aluno as consuma:

1. Vídeo StatQuest, "regressão logística" (19 min, legenda em português).
2. Vídeo Hashtag Programação, "A Regressão Logística" (~30 min).
3. Capítulo II.3 do livro.
4. Notebook `regressao_logistica_inadimplencia.ipynb`.

Sugestão de configuração: coletar e-mail, embaralhar a ordem das opções (não das perguntas), 1 ponto por pergunta fechada, liberar a nota na hora com o feedback abaixo. A pergunta aberta (Q17) vale pontos só na correção manual.

Convenção: **negrito** marca a resposta certa; em "caixas de seleção", todas as marcadas devem estar certas e nenhuma errada marcada.

---

## Seção 1: os vídeos (3 perguntas)

**Q1.** (Múltipla escolha) No StatQuest, por que a regressão logística não usa mínimos quadrados para ajustar a curva, como a regressão linear usa para a reta?

- Porque a curva em S tem fórmula mais complicada que a reta.
- **Porque não existe o mesmo conceito de resíduo; o ajuste é feito por máxima verossimilhança.**
- Porque mínimos quadrados só funciona com uma variável.
- Porque a regressão logística não precisa de ajuste: a curva é sempre a mesma.

Feedback: o vídeo diz que, sem resíduo, não dá para somar quadrados nem calcular R². Em vez disso, ele desloca a curva, calcula a verossimilhança dos dados sob cada curva e fica com a maior. Fonte: StatQuest, 6:22 a 8:04.

**Q2.** (Múltipla escolha) Ainda no StatQuest, o que a curva em S devolve para um rato de peso intermediário?

- A classe "obeso".
- **Uma probabilidade perto de 50% de ser obeso.**
- O peso previsto do rato.
- Um valor de R².

Feedback: a curva vai de 0 a 1 e lê a probabilidade; a classificação vem depois, pelo corte em 50%. Fonte: StatQuest, 3:39 a 4:30.

**Q3.** (Múltipla escolha) Na aula da Hashtag, o professor troca `predict` por `predict_proba` e, mais adiante, fala em olhar só quem passa de 80%. O que essa troca permite que `predict` sozinho não permite?

- Treinar o modelo mais rápido.
- Usar mais de uma coluna como atributo.
- **Escolher o próprio corte de decisão em vez de aceitar o padrão de 0,5, e priorizar os casos de maior probabilidade.**
- Evitar o erro de `max_iter`.

Feedback: `predict` já aplicou o corte de 0,5; `predict_proba` devolve o ponto em cima da curva, e aí você decide o corte. O notebook faz exatamente isso na seção 3. Fonte: Hashtag, 17:16 em diante e 22:26 a 22:50.

---

## Seção 2: o capítulo (9 perguntas, as mesmas do livro)

**Q4.** (Múltipla escolha) Numa regressão logística, o que é linear nos atributos?

- A probabilidade prevista.
- **O logito, o logaritmo da razão de chances.**
- A classe prevista (0 ou 1).
- O erro de classificação.

Feedback: o modelo calcula z = w·x + b (linear) e aplica a sigmoide para chegar à probabilidade. A sigmoide é não linear; ela comprime a reta inteira em [0,1]. A probabilidade não é linear nos atributos; o logito é.

**Q5.** (Resposta curta, numérica) Um modelo calcula z = w·x + b = 0 para um cliente. Qual probabilidade a sigmoide devolve? Duas casas decimais.

Aceitar: **0,50** (também 0.50, 0,5, 0.5).

Feedback: σ(0) = 1/(1 + e⁰) = 1/2. É a fronteira de decisão com limiar 0,5: a equação w·x + b = 0 é a reta (ou hiperplano) que separa as classes, e a sigmoide converte a distância até ela em probabilidade.

**Q6.** (Múltipla escolha) Um analista escreve: "cada ano a mais de relacionamento aumenta a probabilidade de renovação em 4 pontos percentuais, segundo o coeficiente do modelo". Qual é o problema da frase?

- Nenhum, desde que o coeficiente tenha sido convertido corretamente.
- **O efeito constante é sobre o logito; em pontos percentuais ele depende de onde o cliente estava: grande perto de 0,5, quase nulo perto de 0 ou de 1.**
- O erro é usar pontos percentuais em vez de porcentagem relativa.
- O erro é que o coeficiente mede correlação, e correlação não se reporta a clientes.

Feedback: a sigmoide é íngreme no meio e achatada nas pontas. A frase só vale num ponto específico, e o analista não disse qual. Trocar a unidade não resolve: nem porcentagem relativa é constante ao longo da curva.

**Q7.** (Múltipla escolha) Por que a regressão logística não tem solução fechada, como a linear tem?

- Porque a entropia cruzada não é diferenciável.
- Porque o problema não é convexo, e por isso não há mínimo único.
- **Porque, ao anular a derivada, os pesos ficam presos dentro da sigmoide, e o sistema resultante não é linear nos pesos.**
- Porque a solução fechada exigiria inverter uma matriz singular.

Feedback: a condição de otimalidade tem a mesma forma da linear, mas "previsto" agora é σ(w·x + b): o peso está dentro de uma função não linear e não há álgebra que o isole. As duas primeiras alternativas invertem os fatos: a entropia cruzada é diferenciável e o problema é convexo.

**Q8.** (Múltipla escolha) Por que a regressão logística usa entropia cruzada em vez de erro quadrático?

- Porque o erro quadrático não pode ser calculado sobre probabilidades.
- **Porque o erro quadrático sobre a saída da sigmoide dá uma superfície não convexa, com mínimos locais em que o otimizador pode parar.**
- Porque a entropia cruzada tem solução fechada e o erro quadrático não.
- Porque a entropia cruzada é mais rápida de calcular.

Feedback: a escolha é sobre a forma da superfície de otimização. A entropia cruzada é convexa em w (mínimo único) e pune muito a previsão confiante e errada. Nenhuma das duas tem solução fechada aqui.

**Q9.** (Caixas de seleção) Sobre a entropia cruzada e a condição de otimalidade, quais afirmações são corretas?

- **A condição tem a mesma forma da linear: o resíduo fica ortogonal ao atributo.**
- **O que impede isolar w é ele estar dentro da sigmoide, o que torna o sistema transcendental.**
- **Prever 0,99 para um exemplo de classe 0 custa muito mais que prever 0,5.**
- Como não há solução fechada, o problema pode ter vários mínimos e o resultado depende da inicialização.

Feedback: a errada junta dois fatos verdadeiros numa conclusão falsa. Não há solução fechada, e problemas não convexos dependem da inicialização; mas a entropia cruzada é convexa. Ausência de fórmula e presença de mínimos locais são coisas independentes.

**Q10.** (Caixas de seleção) Um modelo de risco de crédito, com atributos padronizados, tem coeficiente 0,7 para `dívida_atual`. Quais leituras são corretas?

- **Um desvio-padrão a mais de dívida multiplica a razão de chances de inadimplência por aproximadamente 2.**
- Um desvio-padrão a mais de dívida aumenta a probabilidade de inadimplência em 70 pontos percentuais.
- Reduzir a dívida do cliente reduziria o risco dele na proporção do coeficiente.
- **Se `dívida_atual` for muito correlacionada com `renda_comprometida`, este coeficiente pode ser instável entre reamostragens.**
- Como o coeficiente é o maior do modelo, dívida é a causa principal da inadimplência.

Feedback: e^0,7 ≈ 2,01, sobre a razão de chances. As três erradas são os três erros clássicos de relatório: confundir logito com probabilidade (70 pontos percentuais nem cabe em [0,1]), ler correlação como intervenção, e tratar tamanho de coeficiente como importância causal.

**Q11.** (Resposta curta, numérica) A probabilidade de um evento é 0,80. Qual é a chance (*odds*) dele?

Aceitar: **4** (também 4,0, 4.0, "4 para 1").

Feedback: chance = p/(1 − p) = 0,80/0,20 = 4, "quatro para um". Probabilidade vive entre 0 e 1; chance vai de 0 a infinito e vale 1 quando a probabilidade é 0,5.

**Q12.** (Múltipla escolha) Um coeficiente vale 0,7 (multiplica a chance por ≈2). Dois clientes recebem o mesmo aumento de um desvio-padrão nesse atributo: um estava com probabilidade 0,10, o outro com 0,90. O que acontece?

- Os dois sobem 20 pontos percentuais, porque o efeito do coeficiente é o mesmo.
- **O primeiro vai a 0,18 e o segundo a 0,95: mesmo efeito sobre a chance, efeitos muito diferentes sobre a probabilidade.**
- O primeiro vai a 0,20 e o segundo a 1,80, o que é impossível e mostra que o modelo falhou.
- Nada muda para o segundo, porque a probabilidade já está saturada.

Feedback: a conta se faz na chance. 0,10 → chance 0,11 → dobra para 0,22 → volta como 0,18. 0,90 → chance 9 → 18 → 0,95. Oito pontos para um, cinco para o outro, mesmo coeficiente.

---

## Seção 3: o notebook (5 perguntas; o aluno precisa ter rodado)

**Q13.** (Resposta curta, numérica) Na seção 2 do notebook, a regressão linear comum recebe o cliente `[50000, 240, 0]` (renda alta, 20 anos de casa, limite sem uso). Que "probabilidade" ela devolve? Três casas decimais, com sinal.

Aceitar: **−0,757** (também -0.757, -0,757).

Feedback: um número negativo onde deveria haver uma probabilidade. A reta não sabe que está prevendo uma probabilidade; a sigmoide existe para travar a saída em [0,1].

**Q14.** (Múltipla escolha) Na seção 3, com o limiar padrão de 0,5, a acurácia do modelo logístico deu 0,8092, igual à da linha de base, e a revocação da classe 1 deu 0. O que explica o empate?

- O modelo não aprendeu nada; os coeficientes são todos zero.
- O conjunto de teste é pequeno demais para medir.
- **A classe positiva é rara (19%), quase nenhum cliente passa de 0,5 de probabilidade, e o modelo acaba prevendo 0 para todo mundo, igual à linha de base.**
- A regressão logística sempre empata com a linha de base no primeiro treino.

Feedback: os coeficientes da seção 4 mostram que o modelo aprendeu (sinais certos, razões de chances longe de 1). O problema é o limiar, não o modelo. É a mesma armadilha da etapa 00: 81% de acurácia e 0% de revocação.

**Q15.** (Caixas de seleção) Ainda na seção 3, o limiar é baixado para a prevalência (0,191). O que aconteceu, segundo a saída do notebook?

- **A acurácia caiu para 0,574.**
- **A revocação subiu para 0,608 (93 dos 153 inadimplentes encontrados).**
- A acurácia subiu, porque o modelo passou a acertar mais.
- Nada mudou, porque o modelo é o mesmo.

Feedback: o modelo é o mesmo; a decisão mudou. Achar mais inadimplentes custa incomodar bons pagadores. Qual troca vale é assunto do capítulo II.1, mas uma coisa já ficou clara: acurácia sozinha teria enterrado um modelo que funcionava.

**Q16.** (Múltipla escolha) Na seção 4, `razao_de_chances()` devolve 1,382 para `uso_do_limite`. Qual é a leitura correta?

- Um desvio-padrão a mais de uso do limite aumenta a probabilidade de inadimplência em 38 pontos percentuais.
- **Um desvio-padrão a mais de uso do limite multiplica a chance de inadimplência por 1,38.**
- 38% dos clientes com uso alto do limite são inadimplentes.
- O uso do limite explica 38% da inadimplência.

Feedback: e^w multiplica a chance, não a probabilidade. A seção 5 do notebook mostra que o mesmo coeficiente deslocou a probabilidade em +0,050 num cliente e +0,117 no outro; se fosse "38 pontos percentuais", o deslocamento seria igual para os dois.

**Q17.** (Parágrafo, correção manual) Na seção 5, o cliente de baixo risco foi de 0,093 para 0,144 (+0,050) e o de alto risco de 0,347 para 0,464 (+0,117), com o mesmo aumento de 30 pontos no uso do limite. Explique, em até cinco linhas e sem usar a palavra "sigmoide", por que o mesmo coeficiente produziu deslocamentos tão diferentes. Depois escreva uma frase de relatório que descreva o efeito do uso do limite corretamente.

Critérios (3 pontos): (1) diz que o efeito constante é sobre a chance ou o logito, não sobre a probabilidade; (2) relaciona o tamanho do deslocamento com o ponto de partida (perto de 0 move pouco, perto de 0,5 move muito); (3) a frase de relatório fala em "multiplica a chance por 1,38 por desvio-padrão" ou equivalente, sem prometer pontos percentuais fixos.

---

## Gabarito resumido

| Q | Tipo | Resposta | Fonte |
|---|---|---|---|
| 1 | múltipla | máxima verossimilhança, não há resíduo | StatQuest 6:22 |
| 2 | múltipla | probabilidade ≈ 50% | StatQuest 3:39 |
| 3 | múltipla | escolher o corte; priorizar por probabilidade | Hashtag 17:16 |
| 4 | múltipla | o logito | capítulo e1 |
| 5 | numérica | 0,50 | capítulo e4 |
| 6 | múltipla | efeito depende de onde o cliente estava | capítulo e5 |
| 7 | múltipla | pesos presos dentro da sigmoide | capítulo e3 |
| 8 | múltipla | erro quadrático sobre sigmoide não é convexo | capítulo e6 |
| 9 | caixas | 1ª, 2ª e 3ª | capítulo e7 |
| 10 | caixas | 1ª e 4ª | capítulo e2 |
| 11 | numérica | 4 | capítulo e8 |
| 12 | múltipla | 0,18 e 0,95 | capítulo e9 |
| 13 | numérica | −0,757 | notebook seção 2 |
| 14 | múltipla | classe rara, limiar 0,5 prevê 0 para todos | notebook seção 3 |
| 15 | caixas | 1ª e 2ª | notebook seção 3 |
| 16 | múltipla | multiplica a chance por 1,38 | notebook seção 4 |
| 17 | parágrafo | correção manual, 3 critérios | notebook seção 5 |

Os números da seção 3 dependem da seed fixa do notebook (`gerar(n=4000)` com a seed padrão de `etapa-00/dados.py`). Se alguém alterar a seed ou o `n`, os valores mudam e as questões 13 a 17 precisam ser refeitas.
