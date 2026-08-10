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

- **ARIMA** — *AutoRegressive Integrated Moving Average*. Família de modelos de série temporal com três peças: autorregressivo (o passado prevê o presente), integrado (diferenciar para estabilizar) e média móvel (o erro passado também informa). Capítulo 24.
- **ACF / PACF** — *Autocorrelation / Partial Autocorrelation Function*. Funções de autocorrelação e autocorrelação parcial — as ferramentas de diagnóstico que dizem quantas defasagens o modelo precisa. Capítulo 24.
- **OLAP** — *Online Analytical Processing*. Análise multidimensional sobre cubos: dimensões, medidas e agregação pré-computada. Contrasta com OLTP, o processamento transacional. Capítulo 23.
- **OLTP** — *Online Transaction Processing*. O sistema otimizado para registrar, não para perguntar. A tensão entre ele e a análise é a origem do data warehouse. Capítulo 20.
- **ELT** — *Extract, Load, Transform*. Inversão do ETL: carrega-se primeiro e transforma-se depois, viável quando armazenamento ficou barato. Capítulo 20.
- **EDA** — *Exploratory Data Analysis*. Análise exploratória de dados — a tradição que Tukey nomeou em 1962 e sistematizou em 1977. Capítulo 21.
- **CRISP-DM** — *CRoss-Industry Standard Process for Data Mining*. O ciclo de seis fases publicado em 1999. 'Cross-industry' é a tese: o processo não pertence a um setor nem a um fornecedor. Capítulo 19.
- **CART** — *Classification and Regression Trees*. As árvores de Breiman, Friedman, Olshen e Stone (1984), nascidas da consultoria e não do seminário. Capítulo 07.
- **TF-IDF** — *Term Frequency – Inverse Document Frequency*. Peso que combina a frequência do termo no documento com a raridade dele na coleção. Spärck Jones inventou o IDF em 1972; Salton e Yang o nomearam. Capítulo 03.
