# Roadmap

> O lugar único que responde: **o que vem agora, em que ordem, e por quê.**
>
> Reescrito em **2026-08-08**, quando o projeto mudou de escopo: de um livro de Machine Learning para o livro de **três disciplinas reais** — Ciência de Dados, Análise Preditiva e Aprendizagem de Máquina.

## O que mudou, e por quê

O livro passou a servir a duas disciplinas **em curso**, ministradas pelo autor:

| Disciplina | Papel no livro | Recorte |
|---|---|---|
| **Ciência de Dados** | pré-requisito, dado por outro professor | os alunos chegam com preparação de dados na bagagem |
| **Análise Preditiva** | ministrada pelo autor | vai da transformação de dados até modelos preditivos |
| **Aprendizagem de Máquina** | ministrada pelo autor | vai **direto para deep learning**; o clássico é revisão |

Isso impõe três mudanças de prioridade:

1. **Cobertura antes de profundidade.** Uma disciplina em andamento precisa de material em todos os tópicos, não de sete capítulos perfeitos e vinte ausentes. A constituição foi emendada (1.1.0) para permitir isso **sem baixar o rigor em silêncio**: cada capítulo declara seu nível — `esqueleto`, `essencial` ou `completo` — no próprio cabeçalho.
2. **A ordem é a da disciplina, não a do sumário.** O número do capítulo virou identificador estável; a ordem de leitura vive nas [trilhas](livro/trilhas/analise-preditiva.md). Um mesmo capítulo serve a duas disciplinas com pesos diferentes, e capítulos distantes no sumário são vizinhos numa trilha.
3. **Laboratórios interativos passam a ser primeira classe.** O gesto de pôr os pesos à mão e ver a reta se mover ensina o que nenhuma frase ensina. É a linha de evolução mais promissora do livro.

## Estado atual — edição 0.5 (2026-08-08)

| | |
|---|---|
| Capítulos | **28** · 7 completos · **1 essencial** · 20 esqueleto |
| Interatividade | 31 exercícios · 7 vídeos · **1 laboratório** |
| Trilhas de disciplina | 3 (Análise Preditiva, Aprendizagem de Máquina, Ciência de Dados) |
| `ml-zero` | 4 etapas · 88 testes |
| Site | 🟢 https://ghdaru.github.io/machinelearning/ |
| Backend | 🔴 não publicado — exercícios dormentes; **laboratórios funcionam mesmo assim** |

---

## Agora

### C1 — Trilha de Análise Preditiva ao nível `essencial` ⬅ **prioridade máxima**

A disciplina está em curso. Faltam **sete capítulos** para a trilha ficar navegável de ponta a ponta:

| Capítulo | Unidade da ementa |
|---|---|
| [19 — O Ciclo da Ciência de Dados](livro/capitulos/19-ciclo-ciencia-de-dados.md) | I |
| [20 — Coleta e Integração](livro/capitulos/20-coleta-integracao.md) | I |
| [21 — Análise Exploratória](livro/capitulos/21-analise-exploratoria.md) | II |
| [22 — Visualização e Storytelling](livro/capitulos/22-visualizacao-storytelling.md) | II |
| [23 — Análise Multidimensional](livro/capitulos/23-analise-multidimensional.md) | II |
| [24 — Séries Temporais](livro/capitulos/24-series-temporais.md) | III |
| [25 — Do Modelo à Decisão](livro/capitulos/25-do-modelo-a-decisao.md) | III |
| [03 — Representação](livro/capitulos/03-representacao.md) | III |

**Entrega por capítulo (nível `essencial`):** corpo ensinável, ≥2 exercícios corrigidos, síntese e verificação. Sem experimento próprio e sem exigência de todas as fontes ✓ — isso é o ciclo de aprofundamento.

**Por que primeiro:** é a disciplina que já está sendo dada. Material ausente hoje custa aula; material aprofundado depois não custa nada.

### C2 — Trilha de Aprendizagem de Máquina ao nível `essencial`

Oito capítulos, com o peso onde a disciplina de fato aprofunda:

| Capítulo | Prioridade |
|---|---|
| [09 — Redes Multicamadas](livro/capitulos/09-redes-neurais.md) | **alta** — sequência direta do 18, já escrito |
| [26 — Treinar Redes Profundas](livro/capitulos/26-treinar-redes-profundas.md) | **alta** |
| [27 — IA Simbólica, Fuzzy e Evolutiva](livro/capitulos/27-ia-simbolica-fuzzy-evolutiva.md) | alta — cobre a Unidade 02 da ementa, hoje sem nenhum material |
| [08 — Não Supervisionado](livro/capitulos/08-nao-supervisionado.md) | média — Unidade 04, 16h |
| [13 — Reforço](livro/capitulos/13-reforco.md) | média — Unidade 05, 16h |
| [10 — Visão](livro/capitulos/10-visao.md) · [11 — Sequências](livro/capitulos/11-sequencias-linguagem.md) · [12 — Fundação](livro/capitulos/12-modelos-de-fundacao.md) | média — Unidade 06 |

### C3 — Mais laboratórios interativos

O laboratório do capítulo 18 provou o formato: o estudante trava em 3 de 4 no XOR e **descobre** a impossibilidade. A linha de evolução, em ordem de valor didático:

| Laboratório | Capítulo | O que o leitor descobre manipulando |
|---|---|---|
| **Perceptron que aprende** | 18 | a regra de Rosenblatt ajustando os pesos sozinha, passo a passo — depois de ele ter feito à mão |
| **XOR com camada escondida** | 09 | duas retas combinadas resolvem o que uma não resolvia |
| **Gradiente descendente** | 06 | taxa alta quica, taxa baixa arrasta — vendo a bolinha descer |
| **Fronteira de decisão** | 05/07 | reta × árvore × floresta no mesmo conjunto de pontos, desenhado por ele |
| **Matriz de confusão e limiar** | 04 | precisão e revocação trocando de lugar ao arrastar o limiar |
| **Viés × variância** | 01 | grau do polinômio subindo, treino melhorando e validação piorando |
| **k-means passo a passo** | 08 | centróides se movendo, e a dependência da inicialização |

Cada um roda no navegador, sem backend. Isso os torna a superfície **mais robusta** do livro.

---

## Depois

### C4 — Publicar o backend

Destrava a correção dos 31 exercícios, o tutor e a telemetria. Continua sendo alta alavanca, mas **saiu do primeiro lugar**: os laboratórios funcionam sem ele, e cobertura de conteúdo é o que a disciplina precisa esta semana.

### C5 — Aprofundamento: `essencial → completo`

Capítulo a capítulo, na ordem em que forem usados em aula: experimento próprio no `ml-zero`, fontes promovidas a ✓, cláusula de expiração, revisão developmental.

### C6 — Etapas do `ml-zero` que faltam

Prioridade para as que servem às trilhas: **09** (rede em NumPy), **26** (treino profundo), **21** (EDA), **24** (séries temporais).

### C7 — Parte de Inteligência Artificial

O autor observa que **IA é outra disciplina**. O capítulo 27 cobre o que a ementa de Aprendizagem de Máquina exige (simbólico, fuzzy, genéticos, bayesianas). Uma Parte VI dedicada — busca, planejamento, agentes, representação de conhecimento — fica registrada como possibilidade, não como compromisso.

### C8 — Sessão de pesquisa histórica e retrofit do Princípio X

Criado pela emenda **1.2.0** da constituição. **Uma sessão de pesquisa, não uma por capítulo** — a regra do próprio princípio: as histórias se conectam (McCulloch–Pitts → Rosenblatt → Minsky → backpropagation; Gauss/Legendre → mínimos quadrados → regressão; Tukey → EDA → visualização), e quem pesquisa capítulo a capítulo publica os dois lados sem a ligação.

Produtos, nesta ordem:

1. **Nota de pesquisa** em `estudos/`, cobrindo os métodos dos capítulos com corpo, e terminando com a **fila de verificação** — as fontes ordenadas por quanta dúvida cada uma fecha por unidade de esforço.
2. **Retrofit** da seção "De onde isto veio" nos 8 capítulos com corpo (dívida **D8**), cada afirmação com selo ✓ / ✓ᵐ / ⏳ / ❌ / 📖.
3. **Declaração de nível** nos 20 capítulos que não a têm (dívida **D9**) — mesma passada, mesmo cabeçalho.

O capítulo **18** é o piloto: já tem linha do tempo com DOIs, mas ela está organizada como cronologia, não como "o aperto → o que se fazia antes → a virada → **a ideia reaproveitável** → o nome". Falta-lhe justamente o quarto elemento, e os selos precisam baixar de ✓ para **✓ᵐ** onde só o DOI foi conferido — o caso do neocognitron mostrou por quê.

## Dívidas registradas

| # | Dívida | Origem |
|---|---|---|
| D1 | Índice da [videoteca](livro/videoteca.md) mantido à mão | declarado na própria página |
| D2 | Bibliografia com maioria ⏳ | por design — cada ⏳ vira ✓ no ciclo de aprofundamento |
| D3 | Sem exercícios de código executável | exige sandbox; hoje são *completion problems* e laboratórios |
| D4 | Nenhum capítulo tem PDF | o motor perdeu o `pdf.mjs` na adaptação |
| D5 | Sem tradução para inglês | fora de escopo |
| **D6** | **Capítulo 16 (MLOps) sem vídeo verificável** | a busca não achou material conferível; um laboratório de detecção de drift resolveria |
| **D7** | **Numeração fora de ordem no sumário** | consequência aceita de manter identificadores estáveis; mitigada pelas trilhas |
| ~~**D8**~~ | ~~Nenhum capítulo tem "De onde isto veio"~~ — **em pagamento** no lote 2 do [ADR 0004](adr/0004-escopo-da-primeira-versao.md). Já pagos: 18, 05, 04 | a emenda 1.2.0 é posterior a eles; nível não sobe sem pagar |
| ~~**D9**~~ | ~~20 capítulos não declaram nível~~ — **PAGA** em 2026-08-10: os 18 que faltavam declararam nível, e o build agora **falha** sem a declaração | o Princípio "níveis" exige a declaração ao leitor |

| **D10** | **Selo ✓ᵐ sustentando afirmação sobre o que a obra argumenta por dentro**, em vários capítulos — quando ✓ᵐ só prova que a obra existe | achado da [auditoria adversarial](estudos/2026-08-10-auditoria-adversarial.md). Paga-se **lendo as fontes** no ciclo `essencial → completo`, não com hedge no texto. A fila de verificação da nota de pesquisa é o plano de pagamento |

> **O que o gate ensinou, e que o plano não previa.** O ADR 0004 mandava fazer o lote 1 (capítulos novos) antes do lote 2 (retrofit dos antigos). Assim que o gate entrou no build, ele **inverteu a ordem sozinho**: declarar o nível dos 7 capítulos com corpo tornou o build vermelho na hora, e nenhum trabalho novo podia ser publicado antes de a dívida antiga ser paga.
>
> Isso é o gate funcionando como projetado — e é a diferença entre uma dívida *registrada* e uma dívida *cobrada*. Uma fica no roadmap; a outra impede o próximo commit.

## O que este projeto **não** vai fazer

- **Não será um curso com certificado.** Sem cadastro, sem nota, sem trilha obrigatória.
- **Não vai executar código do leitor no servidor.** Laboratórios rodam no navegador; a construção livre vive no `ml-zero`, na máquina dele.
- **Não vai perseguir o modelo da moda.**
- **Não vai fingir profundidade.** Um capítulo `essencial` diz que é `essencial`, em destaque, no cabeçalho.

## O portão de publicação (nível `completo`)

- [ ] Esqueleto v5 completo (inclui "De onde isto veio" com selos)
- [ ] ≥3 exercícios e ≥1 mídia (vídeo **ou** laboratório), cada exercício rastreando a um objetivo
- [ ] Toda afirmação empírica com experimento reproduzível ou citação ✓
- [ ] Etapa correspondente do `ml-zero` rodando e testada
- [ ] Selo de captura + entrada no `HISTORICO.md` com a versão do modelo de IA
- [ ] Cláusula de expiração declarada e registrada no placar
- [ ] Revisão developmental feita

Para o nível `essencial`, o portão é menor e está no [Guia Editorial §2.2](livro/GUIA-EDITORIAL.md#22-niveis-de-maturidade).

---

*Este roadmap é uma intenção datada, não um contrato. A ordem muda quando a realidade der motivo — e a mudança fica registrada no `CHANGELOG.md`.*
