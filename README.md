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

**Edição 0.4 (2026-08-05)** — a maquinaria inteira funciona; o conteúdo avança capítulo a capítulo, cada um por sua spec.

| | |
|---|---|
| Capítulos escritos | **7** de 18 (00, 01, 02, 05, 06, 07 e o piloto 04) |
| Capítulos em esqueleto | 11 — com objetivos e problema definidos, aguardando sua spec |
| Exercícios | **27**, corrigidos no servidor |
| Vídeos curados | **7**, com link verificado |
| Etapas do `ml-zero` | **4** de 17 (etapas 00, 02, 05–06 e 07, 88 testes verdes) |
| Testes do backend | **23** verdes |

**O que vem a seguir está em [`ROADMAP.md`](ROADMAP.md)** — a ordem dos próximos capítulos, as dívidas registradas e os não-objetivos.

Os capítulos-esqueleto não têm corpo por decisão de processo: cada um entra pelo ciclo `spec → plan → tasks → implement`, com sua própria rodada de pesquisa verificada (Princípio VII). A [bibliografia](livro/bibliografia.md) reflete isso honestamente — 5 referências ✓ e as demais marcadas ⏳, sem poder sustentar afirmação no corpo.

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
