# Trilha `ml-zero` — a construção prática

> Documento de **referência**: o mapa das etapas e as regras da construção. O passo a passo de cada etapa (tutorial) vive em [`ml-zero/`](../ml-zero/README.md).

## O que é

Um sistema de Machine Learning completo, construído do zero, **uma etapa por capítulo**: do dado bruto ao modelo servido por API e monitorado.

No vocabulário do 4C/ID, as etapas são as *learning tasks* — tarefas inteiras, não fragmentos. Os capítulos são a informação de apoio; os exercícios são o treino de parte. É por isso que a etapa vem depois do capítulo, e não como apêndice dele: só a tarefa inteira ensina a coordenar o que as partes ensinaram isoladamente.

## As cinco regras da construção

Da [constituição](../.specify/memory/constitution.md), seção "Restrições da construção":

1. **Do zero antes da biblioteca.** Todo algoritmo central é implementado uma vez em NumPy, com o mínimo para funcionar, *antes* de aparecer a chamada de uma linha do scikit-learn ou do PyTorch. Você precisa ver o motor antes de dirigir o carro. Depois de ver, dirigir é legítimo — e a etapa seguinte usa a biblioteca sem culpa.
2. **Arquitetura por refatoração.** Cada porta (dados, modelo, avaliação, serviço) nasce da **dor** da etapa correspondente. Nunca estrutura antecipada: uma abstração criada antes da segunda implementação é adivinhação.
3. **Anti-apodrecimento.** Dependências mínimas e fixadas; etapas autocontidas e executáveis; erros didáticos deliberados **comentados como tal** no código — para que ninguém copie um antipadrão achando que é padrão.
4. **Reprodutibilidade.** *Seed* fixa, versões declaradas, dataset obtido por script versionado. Rodar duas vezes dá o mesmo número — ou o texto explica por que não dá.
5. **Serviço desde cedo.** O modelo vira endpoint (Python + FastAPI) já nas primeiras etapas. Um modelo que não serve ninguém é um exercício, não um sistema.

E, atravessando tudo, o Princípio VI: **custo zero é requisito**. Toda etapa roda em CPU, numa máquina modesta ou num *notebook* gratuito. Onde a GPU mudaria o resultado, o texto diz isso e oferece o caminho barato.

## O mapa das etapas

| Etapa | Capítulo | O que se constrói | A dor que ela resolve |
|---|---|---|---|
| **00** | 01 | Carregar dados, dividir com seed fixa, treinar a linha de base trivial | "não sei contra o que comparar" |
| **01** | 04 | Métricas do zero: matriz de confusão, precisão, revocação, F1, AUC-PR, bootstrap | "a acurácia parecia boa" |
| **02** | 02 | Pipeline de dados com detecção de vazamento e split por grupo/tempo | "o resultado estava bom demais" |
| **03** | 03 | Codificação de categóricas, escalas, atributos de domínio | "o modelo não enxerga o que importa" |
| **04** | 04 | Comparação pareada com intervalo de confiança | "melhorou de 0,912 para 0,918" |
| **05–06** | 05 e 06 | Linear e logística + o otimizador isolado, à mão | "chamei `fit()` e não sei o que aconteceu" · "a perda não desce" |
| **07** | 07 | Árvore, bagging e boosting; o experimento tabular do capítulo | "por que boosting ganha aqui?" |
| **08** | 08 | k-means e PCA, com o critério de escolha de k declarado | "achei grupos, e daí?" |
| **09** | 09 | Rede densa em NumPy: forward, backprop, update | "backprop é mágica" |
| **10** | 10 | Convolução e transferência de aprendizado, em CPU | "não tenho GPU" |
| **11** | 11 | Atenção implementada à mão sobre uma tarefa mínima | "atenção é uma fórmula que eu decorei" |
| **12** | 12 | Embeddings e busca semântica — contra a linha de base por termos deste próprio livro | "RAG resolve tudo?" |
| **13** | 13 | Q-learning tabular num ambiente mínimo | "recompensa é só uma variável?" |
| **14** | 14 | Explicação de decisão e métricas por subgrupo | "por que o modelo negou?" |
| **15** | 16 | Serviço FastAPI com contrato, validação de entrada e versão de modelo | "funcionava no notebook" |
| **16** | 16 | Telemetria de predições e detecção de drift | "quando eu ia saber que quebrou?" |

## O andaime, e como ele diminui

O *fading* do 4C/ID é explícito na trilha:

- **Etapas 00–04**: o código vem quase pronto; você completa lacunas marcadas e explica o que aconteceu. *Completion problems*, no sentido de Sweller.
- **Etapas 05–09**: você implementa o algoritmo, com a assinatura das funções e os testes dados. Os testes são o andaime que resta.
- **Etapas 10–16**: você recebe o requisito e o critério de aceite. O desenho é seu.

Se em algum ponto a etapa parecer fácil demais, ela provavelmente está — pule para a próxima. Se parecer impossível, o capítulo correspondente não terminou; volte a ele. Essa é a leitura correta do desconforto, e é deliberada.

## Estado atual

| Etapa | Estado |
|---|---|
| 00 — dado e linha de base | ✅ pronta e testada (17 testes) |
| 02 — pipeline de dados e vazamento | ✅ pronta e testada (28 testes) |
| 05–06 — lineares e o otimizador | ✅ pronta e testada (22 testes) |
| 07 — árvore, floresta e boosting | ✅ pronta e testada (21 testes) |
| 01, 03, 04, 08–16 | 🚧 entram pelo ciclo spec-driven, uma etapa por spec |

Cada etapa nova é uma spec (Princípio VII), com plano, tarefas e verificação — e o capítulo correspondente só sai do estado de esqueleto quando sua etapa roda.

## Como rodar

```bash
cd ml-zero
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
python -m pytest -q          # todas as etapas: os testes são o gabarito
python etapa-00/rodar.py     # a etapa 00, do começo ao fim
```

Sem internet, sem chave, sem GPU. Se algum comando acima pedir qualquer uma das três, é bug — [abra uma issue](https://github.com/GHDaru/machinelearning/issues).
