# Plan 004 — Capítulos II.2 e 06

**Spec:** [spec.md](spec.md) · **Raia:** plena · **Data:** 2026-08-05

## Constitution Check (portão)

| Princípio | Como cumpre | Risco |
|---|---|---|
| **I — Evidência** | Os dois números publicados (L1/L2 em 10 atributos; logística não divergindo a taxa 500) saem de testes executáveis, não de memória. | Afirmar "L1 zera" sem medir. Mitigado: virou asserção. |
| **II — Experimento executável** | Três lições dos capítulos são testes que falham se deixarem de valer. | — |
| **III — Método pedagógico** | Esqueleto v4 nos dois; a analogia da encosta antes da fórmula (intuição → matemática → código, Princípio VI). | — |
| **IV — Livro vivo** | Selo de captura; entrada no HISTORICO. Sem cláusula de expiração nova — gradiente descendente não expira em trimestres. | — |
| **V — Segurança e dados** | Dados sintéticos gerados nos próprios testes. | — |
| **VI — Acessibilidade** | Biblioteca padrão; **NumPy adiado** para a etapa 09, onde a álgebra matricial passa a ser necessidade e não conveniência. | Contraria o plano original da spec 001. Registrado como decisão, com justificativa na regra 2 (nunca estrutura antecipada). |
| **VII — Spec-driven** | Este ciclo. Objetivos herdados dos esqueletos. | — |
| **VIII — Interatividade** | 3 + 4 exercícios, 2 vídeos verificados. | — |
| **IX — DoD** | Build verde, 88 testes na trilha, saídas coladas. | — |

**Veredito:** aprovado, com a decisão sobre NumPy registrada.

## Decisões

**NumPy adiado para a etapa 09.** O plano da spec 001 previa NumPy a partir da etapa 05. Biblioteca padrão bastou; adicionar dependência sem que o algoritmo exija é estrutura antecipada, que a regra 2 proíbe. Entra na etapa 09, onde a álgebra matricial deixa de ser conveniência.

**O otimizador isolado do modelo.** `descida_de_gradiente` recebe uma função `grad` e não sabe o que está minimizando. Não foi projetado assim — apareceu quando linear e logística precisaram do mesmo laço com perdas diferentes. É a arquitetura por refatoração da regra 2, acontecendo.

**Early stopping monitora validação.** A primeira versão observava a perda de treino. Um teste expôs que, com dados separáveis, essa perda cai indefinidamente e o critério nunca dispara — e que, mesmo disparando, mediria memória. O parâmetro `monitorar` nasceu daí.

**`min_delta` como parâmetro, não constante.** Sem limiar de melhora, 4e-10 conta como progresso.

## Achados registrados nos capítulos

Três descobertas do caminho entraram no texto porque são úteis ao leitor, não apesar de terem sido erros:

1. Perda logística é **limitada** — taxa 500 satura em vez de explodir, enquanto erro quadrático a taxa 50 diverge. "Não explodiu" não prova que a taxa está boa.
2. Early stopping monitorando treino nunca dispara em dado separável.
3. Um instrumento de diagnóstico pressupõe que o problema exista: testar early stopping em dado limpo não valida nada.
