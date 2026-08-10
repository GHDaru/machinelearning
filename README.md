# Ciência de Dados e Aprendizado de Máquina — o livro vivo

> Um livro aberto, em português, para **aprender fazendo**: teoria verificável, exercícios corrigidos no servidor, **laboratórios que se manipulam**, vídeos curados e uma construção completa do zero.
>
> Cobre três disciplinas: **Ciência de Dados** (base), **Análise Preditiva** e **Aprendizagem de Máquina**. A ordem de leitura de cada uma está nas [trilhas](livro/trilhas/analise-preditiva.md).

## O que é este repositório

O repositório oficial de escrita do livro. Ele não é só o texto: é também o **motor de publicação**, o **backend do livro vivo** (tutor, correção de exercícios, progresso, telemetria) e a **trilha prática `ml-zero`** — um sistema de Machine Learning construído etapa por etapa, em CPU, sem chave paga.

O método é o de um livro que pratica o que ensina:

- **Nenhuma afirmação empírica sem experimento reproduzível** ou citação conferida contra a fonte primária.
- **Nenhum capítulo publicado sem prática**: mínimo de 3 exercícios e 1 vídeo, cada exercício amarrado a um objetivo de aprendizagem declarado.
- **Nada é dado por pronto sem evidência anexada** — build verde, testes verdes, saída colada. "Prove, não declare."

A lei do projeto está na [constituição](.specify/memory/constitution.md).

## O que o torna diferente de um livro comum

| | Livro estático | Este livro |
|---|---|---|
| Você lê | ✅ | ✅ |
| Você **pratica e é corrigido** | ❌ | ✅ exercícios avaliados no servidor, com feedback que explica o erro |
| Você **assiste** | ❌ | ✅ vídeos curados, com justificativa do que resolvem |
| Você **constrói** | ❌ | ✅ trilha `ml-zero`, uma etapa por capítulo |
| Você **pergunta** | ❌ | ✅ tutor ancorado no texto, que sabe onde você está |
| O livro **aprende com você** | ❌ | ✅ exercício com taxa de acerto baixa entra na fila de revisão |
| O livro **declara sua validade** | ❌ | ✅ data de captura por capítulo + placar de expiração |

A última linha é a mais incomum e a mais importante: este livro mantém um [placar das próprias previsões](livro/HISTORICO.md), pontuado contra a realidade. Um livro técnico que não faz isso finge ser atemporal, e envelhece mentindo.

## Estrutura do livro

### Abertura
| | |
|---|---|
| [00 — Introdução](livro/00-introducao.md) | O que é aprender de dados, quando **não** usar ML, e como usar este livro |
| [01 — Fundamentos](livro/01-fundamentos.md) | Generalização, viés e variância, as três divisões dos dados |

### Parte I — O ciclo do aprendizado supervisionado
| | |
|---|---|
| [02 — Dados](livro/capitulos/02-dados.md) | Coleta, qualidade e o vazamento que engana todo mundo |
| [03 — Representação](livro/capitulos/03-representacao.md) | Como o mundo vira vetor — e o que se perde no caminho |
| [**04 — Avaliação**](livro/capitulos/04-avaliacao.md) | O que significa "bom", e por que acurácia mente — **capítulo-piloto** |
| [05 — Modelos Lineares](livro/capitulos/05-modelos-lineares.md) | A reta que explica muito mais do que parece |
| [06 — Otimização e Regularização](livro/capitulos/06-otimizacao.md) | Como o modelo aprende — e como impedi-lo de decorar |
| [07 — Árvores e Ensembles](livro/capitulos/07-arvores-ensembles.md) | Por que boosting ainda ganha em dados tabulares |

### Parte II — Sem rótulo, e profundo
| | |
|---|---|
| [08 — Não Supervisionado](livro/capitulos/08-nao-supervisionado.md) | Estrutura sem gabarito: agrupar e reduzir |
| [09 — Redes Neurais](livro/capitulos/09-redes-neurais.md) | Do perceptron ao backpropagation, em NumPy |
| [10 — Visão Computacional](livro/capitulos/10-visao.md) | Convolução, e o poder de aproveitar o que já foi treinado |
| [11 — Sequências e Linguagem](livro/capitulos/11-sequencias-linguagem.md) | De RNN a Transformer: por que a atenção venceu |
| [12 — Modelos de Fundação](livro/capitulos/12-modelos-de-fundacao.md) | Embeddings, fine-tuning e RAG |

### Parte III — Machine Learning no mundo real
| | |
|---|---|
| [13 — Aprendizado por Reforço](livro/capitulos/13-reforco.md) | Aprender por consequência, não por gabarito |
| [14 — Interpretabilidade e Justiça](livro/capitulos/14-interpretabilidade-justica.md) | Explicar a decisão e medir a quem ela prejudica |
| [15 — Sistemas de ML](livro/capitulos/15-sistemas-de-ml.md) | O modelo é a fração pequena. Os outros 95% |
| [16 — MLOps](livro/capitulos/16-mlops.md) | Versionar, servir, monitorar, detectar drift |
| [17 — Fronteira e Expiração](livro/capitulos/17-fronteira.md) | O que ainda não sabemos — e o placar das previsões |

### Aparato
[Trilha `ml-zero`](livro/trilha-ml-zero.md) · [Banco de Exercícios](livro/BANCO-DE-EXERCICIOS.md) · [Videoteca](livro/videoteca.md) · [Bibliografia](livro/bibliografia.md) · [Glossário](livro/glossario.md) · [Guia Editorial](livro/GUIA-EDITORIAL.md) · [Histórico](livro/HISTORICO.md) · [Uso do livro](livro/apendice-uso.md) · [Autor](livro/autor.md)

## Estado atual

**Edição 1.0 (2026-08-10) — a primeira versão completa.** Os 28 capítulos existem, e nenhum finge ser mais do que é: cada um declara o próprio nível de maturidade no cabeçalho.

| | |
|---|---|
| Capítulos | **28**, todos com nível declarado — a grande maioria em `essencial` |
| Exercícios | **85**, corrigidos no servidor |
| Vídeos curados | 7 · Laboratórios interativos | 1 |
| Seções "De onde isto veio" | em **todos** os capítulos de método, com tabela de selos por afirmação |
| Etapas do `ml-zero` | 5 (88 testes verdes) · Backend: 23 testes verdes |

**O que a v1.0 é:** cobertura declarada e rastreável. As duas disciplinas ministradas pelo autor têm material em todos os tópicos da ementa.

**O que a v1.0 não é:** nenhum capítulo está no nível `completo`. Isso exige experimento próprio, todas as fontes lidas e cláusula de expiração — é o ciclo de aprofundamento, e está no [`ROADMAP.md`](ROADMAP.md).

### O Princípio X, e por que ele define este livro

Todo método foi inventado por **alguém**, preso num problema concreto, numa data, com meios limitados. Um capítulo que dá o método sem essa história entrega um procedimento — e procedimento se decora. Por isso todo capítulo de método traz **"De onde isto veio"**: o aperto · o que se fazia antes · a virada · **a ideia reaproveitável** · o nome.

E porque **história inventada soa bem**, toda afirmação histórica carrega um **selo de proveniência**:

| Selo | Significa |
|---|---|
| ✓ | fonte **aberta e lida** |
| ✓ᵃ | **resumo** lido no original; o corpo, não |
| ✓ᵐ | só os **metadados** conferidos — prova que a obra existe, não o que ela afirma |
| ⏳ | **atribuição corrente**, não confirmada em primária |
| ❌ | procurei e **não achei** |
| 📖 | **leitura editorial** deste livro |

Isso não é decoração: **o build não compila** um capítulo de método que suba de nível sem a seção e sem a tabela — e o alfabeto de selos é lido da constituição, falhando em qualquer símbolo inventado.

### Três lendas que este livro testou — e que quebraram

Pedimos verificação com instrução explícita de **não forçá-las a fechar**:

- **"Cerveja e fraldas"** — o estudo existe e a correlação foi achada; a parte que todo curso ensina, o rearranjo da gôndola, **não aconteceu**.
- **A origem do nome *dynamic programming*** — a citação de Bellman é autêntica e foi lida; **a cronologia não fecha**. É o caso mais limpo do livro para separar *"a fonte é autêntica"* de *"a afirmação é verdadeira"*.
- **"MLOps foi cunhado por Sculley *et al.* (2015)"** — a palavra **não aparece uma vez sequer** no artigo. Verificação negativa sobre o texto primário.

## Rodar localmente

**O site:**

```bash
cd publicar
npm install
npm run build          # gera o banco de exercícios + o site em docs/
python3 -m http.server 8080 --directory ../docs
```

**O backend do livro vivo** (tutor + correção de exercícios):

```bash
cd chat-companion/backend
pip install -r requirements.txt
python -m pytest tests/ -q
uvicorn app:app --reload --port 8000
```

Depois, aponte o site para ele: `"companion_backend": "http://127.0.0.1:8000"` em `publicar/sumario.json`. Sem backend, o site funciona como livro estático e diz isso honestamente — nunca finge ter corrigido.

**A trilha prática:**

```bash
cd ml-zero
pip install -r requirements.txt
python -m pytest -q
python etapa-00/rodar.py
```

Sem internet, sem chave, sem GPU. Se algum comando pedir qualquer uma das três, é bug.

## Como contribuir

Toda melhoria passa pelo ciclo spec-driven, na raia correspondente. As instruções para humanos e agentes estão em [`CLAUDE.md`](CLAUDE.md); a lei está na [constituição](.specify/memory/constitution.md); as decisões estão em [`adr/`](adr/README.md).

Sugestões de leitor são bem-vindas pelo próprio companion do livro (botão 💬 → Sugerir) — elas chegam ao repositório.

## Herança

A **didática** (Backward Design + 4C/ID + Diátaxis + Carga Cognitiva) e o **ciclo spec-driven** vêm do livro [Engenharia de Harness](https://github.com/GHDaru/harness_engineering). O **processo de desenvolvimento** (raias, Definition of Done verificável, skills-primeiro, ADR, gate de CHANGELOG) vem do [Maestro](https://github.com/GHDaru/maestro). O que este livro acrescenta é a **camada de interatividade**: exercícios que corrigem e vídeos que praticam.

## Licença

Texto sob [CC BY 4.0](LICENSE) · código sob [MIT](LICENSE-CODE).
