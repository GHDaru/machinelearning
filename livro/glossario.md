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
| **RL / MDP / PPO / RLHF** | Reinforcement Learning / Markov Decision Process / Proximal Policy Optimization / RL from Human Feedback | 13 |
| **SHAP / LIME** | SHapley Additive exPlanations / Local Interpretable Model-agnostic Explanations | 14 |
| **MLOps** | Machine Learning Operations | 15, 16 |
| **ETL** | Extract, Transform, Load | 02, 15 |
| **API / SDK / CLI** | Application Programming Interface / Software Development Kit / Command-Line Interface | 15, 16 |
| **CPU / GPU / TPU** | Central / Graphics / Tensor Processing Unit | 09, 10 |
| **LGPD** | Lei Geral de Proteção de Dados | 02, 14 |
| **NLL / KL / ELBO** | Negative Log-Likelihood / Kullback-Leibler / Evidence Lower Bound | 06, 08 |
