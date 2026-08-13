# Mapa das animações — o que anima em cada capítulo

> Parecer do comitê, aceito. A decisão de vocabulário (quarta superfície ou
> laboratório em modo demonstração) fica no ADR 0015.

## O critério

**Anima-se o que tem estado que evolui e um número que o leitor consegue prever errado.**

Não é "tem método", nem "tem gráfico". Capítulo de processo, de decisão e de governança podem animar, desde que o que se move não seja a caixa do diagrama, e sim a consequência quantificada de mexer num controle. Não animam: arquitetura, catálogo, e o que já é laboratório manipulável.

## O teste contra a decoração

Uma animação ensina se passa nos três:

1. há **número nomeado** na tela que muda com o quadro;
2. há **um controle cujo resultado o leitor consegue errar ao prever**;
3. **pausada num quadro qualquer**, ela responde a uma pergunta do capítulo.

Só o primeiro é ilustração. Só o terceiro é figura estática que se mexe. Sem o segundo, é a bolinha rolando no vale.

## A tabela

| Cap. | O que anima, e qual número cai na tela |
|---|---|
| 0.1 | **não animar** — é orientação de leitura, não procedimento |
| 0.2 | grau do polinômio de 1 a 15: erro de treino e de validação lado a lado, o de validação virando para cima |
| I.1 | horizonte do rótulo deslizando de 30 para 90 dias: % de clientes ainda acionáveis caindo, com a AUC subindo junto |
| I.2 | **não animar** — arquitetura não tem estado que evolui |
| I.3 | o `StandardScaler` cruzando a linha da divisão: AUC 0,94 → 0,71 quando o ajuste passa a usar só o treino |
| I.4 | **não animar** — já tem `explorar-variavel`, e manipular ensina mais que assistir |
| I.5 | base do eixo y subindo de 0 a 95: razão percebida entre as barras de 1,05 para 4,0, com os valores reais fixos |
| I.6 | escala de uma coluna × 100: quantos dos 5 vizinhos trocaram, e o rótulo previsto virando |
| II.1 | limiar varrendo 0→1: precisão, recall, a matriz de confusão, e o ponto andando sobre a ROC |
| II.2 | gradiente ajustando a reta: soma dos quadrados caindo, e a distância até o ótimo das equações normais |
| II.3 | \|w\| crescendo: log-loss ainda caindo depois que a acurácia estagnou |
| II.4 | três taxas (0,001 / 0,1 / 1,5) na mesma paisagem: a perda de cada uma, a terceira saindo da escala |
| II.5 | árvore crescendo corte a corte com o ganho de Gini; depois o boosting, com o resíduo médio encolhendo por árvore |
| II.6 | **não animar** — drill-down é navegação; cubo girando é decoração |
| II.7 | janela *walk-forward* avançando: MAE por dobra, contra o MAE menor e mentiroso da divisão embaralhada |
| II.8 | custo do falso negativo de 1 para 10: o limiar ótimo se deslocando e o lucro esperado em reais |
| III.1 | **feito** — o perceptron aprendendo, e o XOR onde ele não para |
| III.2 | MLP no mesmo XOR do III.1: as duas retas da camada escondida girando e a perda caindo até zerar |
| III.3 | norma do gradiente por camada: 1e-7 na primeira com sigmoide, e as barras voltando com ReLU e He |
| III.4 | filtro deslizando com o mapa de ativação: nº de parâmetros (densa 3,2 M × conv 2 400) **e o botão que desloca a imagem 3 px** |
| III.5 | pesos de atenção acendendo numa frase, contra o sinal de gradiente da RNN caindo a zero em 11 passos |
| III.6 | **não animar** — nada treinável honestamente no navegador vira encenação |
| IV.1 | atribuir e recentrar alternando: inércia caindo em degraus; outra semente parando 18% pior |
| IV.2 | grid-world com a Q-table pintando: recompensa por episódio e ε caindo; com ε=0 o agente trava num caminho pior |
| IV.3 | algoritmo genético: melhor aptidão subindo enquanto a diversidade colapsa |
| V.1 | limiar de um grupo movendo: paridade, igualdade de oportunidade e calibração, sempre dois verdes e um vermelho |
| V.2 | **não animar** — dívida técnica não tem dinâmica observável em 30 s |
| V.3 | distribuição deslocando: o PSI cruzando 0,25 dias antes de a AUC real cair |
| V.4 | **não animar** — é placar, e tabela datada é a forma certa |

**23 animações, 6 capítulos sem.**

## As cinco primeiras, em ordem

1. **0.2** — viés e variância. É a tese do livro, e a única em que se vê o cruzamento acontecer. Tabela mostra dois números; a animação mostra o instante em que um vira.
2. **II.4** — três taxas de aprendizado. Diagnóstico por forma de curva é a habilidade do capítulo, e exige ver as três formas ao mesmo tempo.
3. **V.1** — a impossibilidade da justiça. Teorema de impossibilidade fica abstrato até o leitor tentar satisfazer os três critérios com a mão no controle e falhar.
4. **IV.1** — k-means com ótimo local. Ensina o mais difícil: método correto, execução correta, resposta errada, e só a semente mudou.
5. **III.2** — XOR resolvido. Fecha o arco que a oscilação do III.1 abriu.

## Dívida a pagar ANTES da segunda animação

`animaPerceptron` já duplica, em outra forma, o que `regressaoLinear` tem: a função de escala, o preâmbulo de tema escuro, o construtor de botão, e o par `setInterval` + `prefers-reduced-motion`.

Extrair um núcleo (`plano(cv)`, `placar()`, `relogio()`) **com duas animações, não com oito**. Cinco módulos cobrem as 23:

| Módulo | Cobre |
|---|---|
| **A.** laço de descida com placar | 0.2, II.2, II.3, II.4, III.1, III.2, III.3 |
| **B.** limiar sobre scores fixos | II.1, II.8, V.1, V.3 |
| **C.** particionar e recalcular critério | IV.1, II.5, I.6 |
| **D.** janela deslizante no tempo | II.7, V.3, I.3 |
| **E.** melhor-até-agora por episódio | IV.2, IV.3 |
