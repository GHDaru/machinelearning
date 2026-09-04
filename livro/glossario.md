# Glossário

> Espelho do mapa de siglas do motor de publicação (`publicar/build.mjs`). Ao introduzir uma sigla nova, adicione-a **nos dois lugares** — e confira a expansão na fonte (Princípio I). No site, passar o mouse sobre qualquer sigla revela a expansão em qualquer ocorrência.

## Termos fundamentais

| Termo | O que é |
|---|---|
| **Exemplo** (instância, observação) | Uma linha dos dados: um cliente, uma foto, uma transação |
| **Atributo** (*feature*) | Uma coluna: idade, pixel 37, contagem de palavras |
| **Alvo** (*target*, *label*) | O que se quer prever. Sua presença define o aprendizado como supervisionado |
| **Parâmetro** | O que o **treino** ajusta (pesos, vieses) |
| **Hiperparâmetro** | O que **você** escolhe antes do treino (taxa de aprendizado, profundidade, regularização) |
| **Função de perda** | O que a otimização minimiza; precisa ser bem-comportada para o otimizador |
| **Métrica** | O que interessa a você; precisa ser interpretável e ligada à consequência |
| **Generalização** | Desempenho sobre exemplos **não vistos** durante o treino. O problema central do livro |
| **Overfitting** | O modelo ajustou-se ao ruído dos dados de treino; vai bem no treino e mal fora |
| **Underfitting** | O modelo é simples demais para o padrão; erra parecido no treino e no teste |
| **Viés** (*bias*) | Erro sistemático de suposição — o modelo não consegue representar o padrão |
| **Variância** | Instabilidade — o modelo muda muito conforme a amostra de treino muda |
| **Vazamento** (*leakage*) | Informação disponível no treino que não existirá no momento da predição |
| **Drift** | Mudança na distribuição dos dados ao longo do tempo, degradando o modelo sem alterar o código |
| **Calibração** | Os escores do modelo lidos como probabilidades honestas: quando diz 0,8, acontece 80% das vezes |
| **Linha de base** (*baseline*) | O desempenho do classificador trivial. Piso contra o qual todo modelo se mede |

## Siglas

| Sigla | Por extenso | Onde aparece |
|---|---|---|
| **ML** | Machine Learning | transversal |
| **IID** | Independent and Identically Distributed | 01, 11 |
| **ERM** | Empirical Risk Minimization | 01 |
| **PAC** | Probably Approximately Correct | 01 |
| **MSE / MAE / RMSE / MAPE** | Mean Squared / Absolute / Root Mean Squared / Absolute Percentage Error | 04, 05 |
| **AUC / ROC** | Area Under the Curve / Receiver Operating Characteristic | 04 |
| **SGD** | Stochastic Gradient Descent | 06, 09 |
| **PCA** | Principal Component Analysis | 08 |
| **KNN** | K-Nearest Neighbors | 03, 08 |
| **SVM** | Support Vector Machine | 05 |
| **MLP** | Multi-Layer Perceptron | 09 |
| **CNN** | Convolutional Neural Network | 10 |
| **RNN / LSTM / GRU** | Recurrent Neural Network / Long Short-Term Memory / Gated Recurrent Unit | 11 |
| **NLP** | Natural Language Processing | 11, 12 |
| **LLM** | Large Language Model | 12 |
| **RAG** | Retrieval-Augmented Generation | 12 |
| **BERT / GPT** | Bidirectional Encoder Representations from Transformers / Generative Pre-trained Transformer | 11, 12 |
| **RL / MDP / PPO / RLHF / DQN** | Reinforcement Learning / Markov Decision Process / Proximal Policy Optimization / RL from Human Feedback / Deep Q-Network | 13 |
| **SHAP / LIME** | SHapley Additive exPlanations / Local Interpretable Model-agnostic Explanations | 14 |
| **MLOps** | Machine Learning Operations | 15, 16 |
| **ETL** | Extract, Transform, Load | 02, 15 |
| **API / SDK / CLI** | Application Programming Interface / Software Development Kit / Command-Line Interface | 15, 16 |
| **CPU / GPU / TPU** | Central / Graphics / Tensor Processing Unit | 09, 10 |
| **LGPD** | Lei Geral de Proteção de Dados | 02, 14 |
| **NLL / KL / ELBO** | Negative Log-Likelihood / Kullback-Leibler / Evidence Lower Bound | 06, 08 |
| **IQR** | Interquartile Range — intervalo interquartil (Q3 − Q1) | 21 |

## Acrescentados na edição 1.0

- **ARIMA** — *AutoRegressive Integrated Moving Average*. Família de modelos de série temporal com três peças: autorregressivo (o passado prevê o presente), integrado (diferenciar para estabilizar) e média móvel (o erro passado também informa). Capítulo II.7.
- **ACF / PACF** — *Autocorrelation / Partial Autocorrelation Function*. Funções de autocorrelação e autocorrelação parcial — as ferramentas de diagnóstico que dizem quantas defasagens o modelo precisa. Capítulo II.7.
- **OLAP** — *Online Analytical Processing*. Análise multidimensional sobre cubos: dimensões, medidas e agregação pré-computada. Contrasta com OLTP, o processamento transacional. Capítulo II.6.
- **OLTP** — *Online Transaction Processing*. O sistema otimizado para registrar, não para perguntar. A tensão entre ele e a análise é a origem do data warehouse. Capítulo I.2.
- **ELT** — *Extract, Load, Transform*. Inversão do ETL: carrega-se primeiro e transforma-se depois, viável quando armazenamento ficou barato. Capítulo I.2.
- **EDA** — *Exploratory Data Analysis*. Análise exploratória de dados — a tradição que Tukey nomeou em 1962 e sistematizou em 1977. Capítulo I.4.
- **CRISP-DM** — *CRoss-Industry Standard Process for Data Mining*. O ciclo de seis fases publicado em 1999. 'Cross-industry' é a tese: o processo não pertence a um setor nem a um fornecedor. Capítulo I.1.
- **CART** — *Classification and Regression Trees*. As árvores de Breiman, Friedman, Olshen e Stone (1984), nascidas da consultoria e não do seminário. Capítulo II.5.
- **TF-IDF** — *Term Frequency – Inverse Document Frequency*. Peso que combina a frequência do termo no documento com a raridade dele na coleção. Spärck Jones inventou o IDF em 1972; Salton e Yang o nomearam. Capítulo I.6.

## Acrescentados na edição 1.1 — o vocabulário das disciplinas em curso

> A auditoria de didática de 2026-08-12 mediu o buraco: o glossário cobria bem o capítulo de fundamentos e quase nada dos capítulos `I.3`, `I.4`, `I.6`, `II.1`, `II.2` e `II.3` — exatamente os que as duas disciplinas usam. São estes.

### Estatística descritiva e exploração

| Termo | O que é |
|---|---|
| **Mediana** (P50) | O valor do meio quando os dados estão ordenados. É o segundo quartil e o quinto decil ao mesmo tempo. **Insensível** a valor extremo: mexer no maior número da lista não a move |
| **Moda** | O valor mais frequente. É a única medida de centro que funciona em variável categórica — e, no varejo, é ela que responde "que preço o cliente vê com mais frequência?" |
| **Quartil** (Q1, Q2, Q3) | Cortes que dividem os dados ordenados em quatro partes iguais. Q1 deixa 25% abaixo de si; Q3 deixa 75% |
| **IQR** (amplitude interquartil) | Q3 − Q1: a largura da faixa que contém os **50% centrais**. Medida de dispersão que não se abala com extremos |
| **Cerca** (*fence*) | Os limites Q1 − 1,5 × IQR e Q3 + 1,5 × IQR. O que cai fora vira ponto solto no boxplot. **É um critério escolhido, não uma verdade**: com IQR igual a zero, a cerca tem largura zero e acusa tudo |
| **Boxplot** | Desenho de cinco elementos: caixa de Q1 a Q3, traço na mediana, bigodes até o extremo dentro da cerca, e pontos para o resto |
| **Assimetria** | Quando a distribuição puxa para um lado. Detector barato: **média maior que a mediana** indica cauda à direita |
| **Outlier** | Ponto distante do resto **segundo um critério declarado**. Fora da cerca não significa errado: pode ser o fenômeno (chuva forte acontece) |
| **Análise univariada** | Olhar uma variável de cada vez — tipo, contagem, nulidade, centro, dispersão, pontas — antes de cruzar duas |
| **Correlação** | Quanto duas variáveis andam juntas, entre −1 e +1. Mede associação linear, **não** causa, e não vê curva |
| **Confundidor** (confundimento) | Variável que influencia as outras duas e cria associação sem causa. Controlar por uma variável só remove o confundimento que **aquela** variável mede |

### Avaliação

| Termo | O que é |
|---|---|
| **Matriz de confusão** | Os quatro números de um classificador binário: verdadeiros e falsos, positivos e negativos |
| **Precisão** | Dos que o modelo acusou, quantos eram. Responde "posso confiar quando ele aponta?" |
| **Revocação** (sensibilidade) | Dos que eram, quantos o modelo achou. Responde "quanto ele deixa passar?" |
| **F1** | Média harmônica de precisão e revocação. Um número só, ao custo de esconder qual das duas caiu |
| **Limiar** | O ponto de corte que transforma um escore contínuo em decisão. **Ranking e decisão são coisas diferentes** |
| **Validação cruzada** | Rodízio em $k$ partes: treina em $k-1$, mede na que sobrou, repete. Devolve média e desvio |
| **Dobra** (*fold*) | Cada uma das $k$ partes da validação cruzada |
| **Bootstrap** | Reamostragem com reposição para estimar a incerteza de uma métrica |

### Modelos lineares

| Termo | O que é |
|---|---|
| **Resíduo** | O que sobrou: valor observado menos previsto. No ajuste ótimo, a soma deles é zero |
| **EQM** (erro quadrático médio) | A média dos resíduos ao quadrado. É o **MSE** da literatura em inglês |
| **Equações normais** | O sistema que sai de derivar a perda e igualar a zero. Resolve a regressão linear **sem iteração** |
| **Colinearidade** | Dois atributos que medem quase a mesma coisa. O erro não piora; a **interpretação** vira ruído |
| **Logito** | O logaritmo da razão de chances. É ele que é linear nos atributos, **não** a probabilidade |
| **Chance** (*odds*) | Razão entre a probabilidade de ocorrer e a de não ocorrer: $p/(1-p)$. **Em português corrente "chance" significa probabilidade — aqui, não** |
| **Razão de chances** (*odds ratio*) | O quociente entre duas chances. É o que o coeficiente da logística multiplica: $e^{w}$ |
| **Sigmoide** | A função que comprime a reta inteira em [0, 1] |
| **Entropia cruzada** (*log-loss*) | A perda da logística. Pune **muito** a previsão confiante e errada |

### Representação

| Termo | O que é |
|---|---|
| **One-hot** | Uma coluna por categoria, com 1 na que vale. Explode em alta cardinalidade |
| **Embedding** | Representação densa aprendida: a categoria (ou palavra, ou item) vira um vetor de poucas dimensões, e a proximidade no vetor passa a significar semelhança |
| **Churn** | Abandono: o cliente deixa de comprar ou cancela. O alvo mais comum em retenção |

## Acrescentados na edição 1.2 — os termos do capítulo II.2

> A régua foi uma página do Google Machine Learning Crash Course: nove termos ligados ao glossário numa página só, cada um no primeiro uso. Medido aqui no mesmo dia, o livro tinha **zero** ligações: nenhum dos 27 capítulos apontava para este arquivo. O capítulo II.2 é o primeiro a pagar, e o portão `publicar/gates/glossario-ligado.mjs` cobra a partir de agora, com os outros 26 declarados em dívida.
>
> A régua da ligação é **por cartão**, não por capítulo. No modo cartão o leitor vê um cartão por vez, e um link que mora noutro cartão não existe para ele.

### Regressão linear

| Termo | O que é | Onde aparece |
|---|---|---|
| **Regressão linear** | O modelo que prevê um número somando cada atributo multiplicado por um peso, mais um deslocamento fixo | II.2 |
| **Regressão logística** | A parente que classifica: a mesma soma ponderada, espremida entre 0 e 1 para virar probabilidade | II.2, II.3 |
| **Mínimos quadrados** | O critério que escolhe a reta: aquela que torna mínima a soma dos quadrados dos resíduos. O nome é a definição, e foi Legendre quem o deu, em 1805 | II.2 |
| **Solução fechada** (fórmula fechada) | Resposta obtida por uma conta direta, sem iteração e sem critério de parada. A regressão linear tem uma; a logística não | II.2, II.3 |
| **Gradiente descendente** (gradiente) | O método que desce a superfície de erro em passos contra a subida, até parar de melhorar. É a ferramenta geral, e serve onde não existe fórmula fechada | II.2, II.4 |
| **Taxa de aprendizado** | O tamanho do passo do gradiente. Grande demais salta o fundo; pequeno demais não chega até ele | II.2, II.4 |
| **Convexidade** (convexa) | A superfície de erro tem um fundo só, como uma tigela. É o que garante que o ponto de partida mude o caminho e nunca o destino | II.2 |
| **Centro de massa** | O ponto formado pelas duas médias, uma de cada eixo. A reta de mínimos quadrados passa por ele sempre | II.2 |
| **Ortogonalidade** (ortogonais) | O que sobrou de erro não guarda mais nada de linear sobre o atributo. Se guardasse, ainda haveria reta melhor a extrair dele | II.2 |
| **Inclinação** | Quanto a previsão muda a cada unidade a mais do atributo. Num modelo de uma variável, é o coeficiente da reta | II.2 |
| **Intercepto** | O valor previsto quando todo atributo vale zero. É a parcela que não depende de atributo nenhum | II.2 |
| **Erro absoluto** | A perda que soma o módulo do resíduo em vez do quadrado. Pesa o ponto distante dez vezes onde o quadrático pesa cem | II.2 |
| **Padronização** (padronizar) | Pôr todo atributo na mesma escala, subtraindo a média e dividindo pelo desvio. Sem ela, comparar coeficiente é comparar unidade de medida | II.2, II.4 |

### Diagnóstico e leitura do modelo

| Termo | O que é | Onde aparece |
|---|---|---|
| **Coeficiente** | O número que multiplica um atributo dentro do modelo. É um parâmetro, e é ele que vira a frase da carta de recusa | II.2, II.3 |
| **Coeficiente de determinação** (R²) | A fração da variação do alvo que o modelo reproduz: 0 é não fazer melhor que a média, 1 é acertar cada ponto. Mede **ajuste ao passado**, e não o efeito de mexer numa alavanca | II.2 |
| **Extrapolação** (extrapolar) | Prever fora da faixa de valores que o modelo viu. A reta continua traçando fora dela, e o absurdo sai com aparência de rigor | II.2 |
| **Ensemble** | Modelo feito de muitos modelos, somados ou votados. Costuma acertar mais, e não produz a frase por escrito que a auditoria pede | II.2, II.5 |
