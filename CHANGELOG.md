# Changelog

Todas as mudanças notáveis deste projeto. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versionamento acompanha as **edições** do livro (ver [`livro/HISTORICO.md`](livro/HISTORICO.md)).

> **Gate de CI:** toda PR adiciona uma entrada em `[Unreleased]`. Bypass explícito para mudanças que não afetam o leitor: label `skip-changelog`.

## [Unreleased]

## [1.0.0] — 2026-08-10 — **a primeira versão completa**

### Adicionado
- **Os 28 capítulos existem e declaram o próprio nível.** De 8 com corpo para 28
  declarados, **todos em `essencial`**. As duas disciplinas do autor têm material
  em todos os tópicos da ementa.
- **19 capítulos novos ou reescritos**: 03, 08, 09, 10, 11, 12, 13, 14, 15, 16,
  17, 19, 20, 21, 22, 23, 24, 25, 26, 27.
- **"De onde isto veio"** em todos os 26 capítulos de método, com tabela de selos.
- **Exercícios: de 31 para 91.**
- **Cinco notas de pesquisa histórica** em `estudos/`, com fila de verificação
  ordenada por dúvida fechada por unidade de esforço.
- **Relatório da auditoria adversarial** (`estudos/2026-08-10-auditoria-adversarial.md`).
- **ADR 0004** (escopo da v1) e **ADR 0005** (o selo `✓ᵃ` e a trava contra selos
  cunhados por fora).

### Alterado
- **Constituição 1.3.0**: o selo `✓ᵃ` (resumo lido no original) entra no alfabeto,
  com regra de uso e a declaração do que ele **proíbe** afirmar.
- **Gate do Princípio X no build**: capítulo de método em `essencial` sem a seção
  histórica **não compila**; e o alfabeto de selos é **lido da constituição**,
  falhando em qualquer símbolo desconhecido ou legenda própria. A versão anterior
  dava *falso verde* — bastava uma linha casar.
- **Esqueleto de capítulo v4 → v5.**

### Corrigido — achados da auditoria adversarial
- **Um prenome inventado** no capítulo 01 ("Selvin" Larson) — a nota de pesquisa
  nunca teve prenome. É o modo de falha que o Princípio X nomeia.
- **Duas seções históricas sem lastro** na fonte única (caps. 03 e 25): a pesquisa
  existia, o registro não. A 5ª passada entrou na nota com essa admissão.
- **Selo inflado** no cap. 08 (✓ onde a nota registra ⏳/❌), numa tabela que se
  contradizia a si mesma.
- **Três capítulos reivindicando "o maior intervalo do livro"** — com o cap. 10 se
  refutando na própria frase.
- **Erro factual**: células simples/complexas atribuídas ao artigo de 1959, quando
  a literatura as associa ao de 1962.
- **Registro misturado** no cap. 04: a origem da ROC narrada como fato com a
  tabela marcando tudo ⏳.

### Dívidas declaradas
- **D8** e **D9** — **pagas**.
- **D10** (nova): fonte selada `✓ᵐ` sustentando afirmação sobre o que a obra
  argumenta por dentro. Paga-se **lendo as fontes**, não com hedge no texto.
- **D6** — o capítulo 16 saiu do bloqueio: no nível `essencial` não há cota de mídia.

### Adicionado — **constituição 1.2.0**
- **Princípio X — "Nenhum método cai do céu"** (não-negociável). Todo capítulo de
  método traz a seção **"De onde isto veio"**: o aperto · o que se fazia antes ·
  a virada · **a ideia reaproveitável** · o nome. Portão do nível `essencial`.
- **Selos de proveniência** por afirmação histórica: ✓ (fonte lida) · ✓ᵐ (só
  metadados) · ⏳ (atribuição corrente) · ❌ (procurei e não achei) · 📖 (leitura
  editorial). Conferir um DOI dá **✓ᵐ**, nunca ✓.
- **Esqueleto de capítulo v4 → v5**, com a seção histórica entre "o problema" e
  os fundamentos. Guia Editorial §2.4 traz o operacional; o template de PR cobra.
- **`AGENTS.md`** — link simbólico para `CLAUDE.md`, para agentes que procuram esse
  nome. Um arquivo só, para não haver duas verdades que divergem.
- **Dívidas D8 e D9** e o ciclo **C8** (sessão de pesquisa histórica + retrofit):
  a emenda deixa 8 capítulos com corpo devendo a seção e 20 sem nível declarado.
  Registrado em vez de silenciado — nenhum sobe de nível sem pagar.

### Adicionado
- **Capítulo 18 — histórico com as fontes reais.** Linha do tempo 1943–1986 com DOI
  ou link verificável em cada marco (McCulloch & Pitts, Hebb, Rosenblatt, Minsky &
  Papert, Linnainmaa, Werbos, Fukushima, Rumelhart–Hinton–Williams).
- **Diagrama do neurônio de McCulloch–Pitts** (`publicar/tema/neuronio-mp.svg`):
  entradas → pesos → soma → limiar → saída, com tema claro/escuro e `aria-label`.
- **Nota "quando a IA ainda não se chamava assim"**: o relatório de Turing de 1948,
  o artigo na *Mind* de 1950 (o teste), e a proposta de Dartmouth de 1955 que cunhou
  o termo *artificial intelligence*.
- **Nota sobre a prioridade do backpropagation**: Linnainmaa (1970), Werbos (1974),
  Fukushima (1979) e o que Rumelhart *et al.* (1986) de fato acrescentaram.
- **Código Python para baixar e rodar** (`ml-zero/etapa-18/`): `neuronio.py` com
  `NeuronioMP` (sem `fit`, de propósito) e `Perceptron` com a regra de Rosenblatt,
  mais `neuronio_mp.ipynb` pronto para o Colab — inclui a varredura de força bruta
  que fecha o XOR em 3 de 4.
- **Blueprint de deploy do backend** (`render.yaml` + `chat-companion/DEPLOY.md`):
  aplicação em um clique, segredos com `sync: false` (nunca versionados).

### Corrigido
- **A matemática não renderizava.** O motor não tinha renderizador nenhum: todo
  `$$...$$` saía como LaTeX cru na tela, em **quatro** capítulos (05, 06, 07 e 18)
  — 21 fórmulas em destaque e dezenas em linha. Agora o build converte para SVG
  com MathJax, **em tempo de compilação**: nenhum JS, nenhuma fonte e nenhuma
  requisição para o leitor, e imprime bem. O SVG desenha em `currentColor`, então
  o tema escuro sai de graça.
- **Acento dentro de fórmula quebrava a palavra.** As fontes TeX não têm glifos
  acentuados: `\text{saída}` saía como "saí da". A fórmula do capítulo 18 foi
  reescrita sem acentos (e passou a usar `y`, a notação do diagrama), e o build
  agora **falha** se alguém reintroduzir o problema.
- **A página inteira rolava na horizontal no celular** (capítulo 18): a tabela do
  histórico alargava a coluna do grid em vez de rolar sozinha. Faltava
  `min-width: 0` no item de grid. Verificado a 390 px em seis páginas.
- **Espaço solto antes da pontuação** depois de fórmula em linha ("escolher os
  *w* . O critério") — 5 ocorrências, do HTML indentado que o plugin gera.

### Alterado
- Subtítulo do livro passa a declarar que ele é **vivo e evolutivo**.
- **Páginas com matemática ficaram ~33% menores.** O plugin embutia uma cópia
  inteira da folha do MathJax a cada fórmula (43 KB dos 130 KB do capítulo 05,
  idênticos byte a byte). A folha passa a ser um arquivo só, em
  `assets/matematica.css`, buscado uma vez e reaproveitado. Capítulo 05: 132 KB → 88 KB.

## [0.5.0] — 2026-08-08

### Alterado — **mudança de escopo**
- O livro passa de "Machine Learning" a **"Ciência de Dados e Aprendizado de Máquina"**,
  para servir a três disciplinas de Engenharia de Software: Ciência de Dados
  (pré-requisito), Análise Preditiva e Aprendizagem de Máquina.
- Estrutura de 18 para **28 capítulos**, em cinco partes.
- O número do capítulo passa a ser **identificador estável**, não ordem de leitura.
  A ordem vive nas trilhas. Alternativa descartada: renumerar tudo — quebraria os
  ids dos 31 exercícios, que embutem o número do capítulo.
- **Constituição 1.1.0**: níveis de maturidade (`esqueleto`/`essencial`/`completo`),
  laboratório aceito como mídia obrigatória, portão de exercícios valendo na
  promoção a `completo`.

### Adicionado
- **Laboratórios interativos** — terceira superfície do livro, ao lado de exercício
  e vídeo. Bloco `:::lab` no motor, runtime em `publicar/tema/laboratorios.js`.
  Rodam no navegador: funcionam mesmo com o backend fora do ar.
- **Widget `neuronio-mp`**: pesos e limiar ajustáveis, reta de decisão desenhada
  em tempo real sobre a tabela-verdade, veredito por linha. O XOR trava em 3 de 4
  e explica por quê.
- **Capítulo 18 — O Neurônio Artificial** (nível `essencial`): 4 exercícios e 1
  laboratório. McCulloch & Pitts (1943) conferido e ✓.
- **Três trilhas de disciplina**, mapeadas unidade a unidade das ementas.
- **Nove capítulos-esqueleto** cobrindo o que faltava: 19–27.

## [0.4.0] — 2026-08-05

### Adicionado
- **Capítulo 05 — Modelos Lineares** (3 exercícios, 1 vídeo) e **Capítulo 06 —
  Otimização e Regularização** (4 exercícios, 1 vídeo).
- **Etapa 05–06 do `ml-zero`**: `Padronizador`, `RegressaoLinear` (equações normais
  por eliminação de Gauss **e** gradiente), `RegressaoLogistica` (L1/L2, razão de
  chances) e `descida_de_gradiente` isolado do modelo. 22 testes.

### Corrigido
- `Historico.divergiu()` olhava apenas a última época e perdia a explosão que
  acontecia no meio do treino — com taxa alta a perda oscila e pode terminar
  num vale por acaso.
- Early stopping não disparava: sem limiar mínimo de melhora, 4e-10 por época
  contava como progresso. Adicionado `min_delta`.
- Early stopping monitorava a perda de **treino**. Com dados separáveis essa
  perda cai indefinidamente e o critério nunca dispara — e mesmo disparando
  mediria memória. Adicionado `monitorar`, para observar a validação.

### Alterado
- **NumPy adiado** da etapa 05 para a 09. Biblioteca padrão bastou; adicionar
  dependência sem que o algoritmo exija é estrutura antecipada (regra 2 da
  construção). Registrado no docstring da etapa e no plano da spec 004.

## [0.3.0] — 2026-08-05

### Adicionado
- **Capítulo 07 — Árvores e Ensembles**, com 5 exercícios e 1 vídeo.
- **Etapa 07 do `ml-zero`**: `Arvore`, `Floresta`, `Boosting`, `auc` por postos e um
  gerador tabular com as três características que Grinsztajn et al. identificam no
  tabular real. Mais `linear.py` como régua declarada. 21 testes.
- `estudos/2026-08-05-teto-de-bayes-do-dado-da-etapa-00.md`: a medição que justificou
  a etapa 07 gerar o próprio dado em vez de reusar o da etapa 00.
- Breiman (2001) e Grinsztajn et al. (2022) conferidos e promovidos a ✓.
- Cláusula de expiração E3 no placar, com gatilho de revisão operacional.

## [0.2.0] — 2026-08-05

### Adicionado
- **Capítulo 02 — Dados**, no esqueleto v4, com 4 exercícios e 1 vídeo: as três fontes
  de vazamento, divisão por tempo e por grupo, ficha de dataset e viés de seleção.
- **Etapa 02 do `ml-zero`**: `detectar_vazamento_obvio` (dois sinais independentes),
  `dividir_por_grupo`, `dividir_por_tempo` com intervalo de guarda, `checar_duplicatas`,
  `vazou_entre` e `FichaDeDataset` — a ficha é um portão que levanta, não um documento
  que alguém promete escrever. 28 testes.
- `ml-zero/tests/conftest.py`: carregador de módulos por etapa. Etapas autocontidas têm
  arquivos homônimos (`dados.py` na 00 e na 02) e `sys.path` cru fazia a primeira
  importação vencer, silenciosamente.
- Gebru et al. (2021), *Datasheets for Datasets*, conferido na fonte e promovido a ✓.

### Adicionado
- `ROADMAP.md`: o lugar único que responde "o que vem agora, em que ordem e por quê".
  Consolida o que estava espalhado em quatro artefatos (tasks da spec 001, trilha,
  histórico e README), e acrescenta o que não existia em lugar nenhum: as dívidas
  registradas, os não-objetivos e o portão de publicação de um capítulo.

### Corrigido
- `livro/videoteca.md` afirmava que o índice era gerado a partir dos capítulos.
  Não é: a fonte de cada vídeo é o bloco `:::video` do capítulo, mas a tabela é
  mantida à mão. Texto corrigido, com a automação registrada como melhoria devida.

### Documentação
- `publicar/README.md` passa a registrar o procedimento de publicação e o modo de
  falha do deploy do Pages (job barrado no portão do ambiente `github-pages`,
  falhando em segundos e sem log), com as duas causas e onde conferir cada uma.

### Alterado
- `gerar-capa.py` movido de `publicar/tema/` para `publicar/`: `tema/` é o que vai
  para o site, e ferramenta de autoria não é asset publicado. Documentado no
  README do motor, com caminhos agora relativos ao próprio script.

## [0.1.0] — 2026-08-01

### Adicionado

**Governança**
- Constituição de 9 princípios, fundindo a didática e o ciclo spec-driven do livro de Engenharia de Harness com o processo de desenvolvimento do Maestro (raias, DoD verificável, skills-primeiro, ADR, gate de CHANGELOG).
- `CLAUDE.md` com o fluxo de trabalho para humanos e agentes; skills de processo em `skills/`.
- Registros de decisão: ADR 0001 (correção no servidor), 0002 (sintaxe interativa no Markdown), 0003 (dado sintético na etapa 00).

**O livro**
- Estrutura de 18 capítulos em 3 partes, mais o aparato. Todos com objetivos de aprendizagem declarados.
- Capítulos escritos: `00 Introdução`, `01 Fundamentos` e `04 Avaliação` — este último é o piloto do esqueleto v4.
- Aparato: Guia Editorial, Banco de Exercícios, Videoteca, Bibliografia (com status de validação), Glossário, Histórico com placar de expiração, Apêndice de uso, Autor.

**Camada de interatividade** (o que distingue este livro)
- Cinco tipos de exercício — múltipla, múltipla-multi, numérica, completar e aberta por rubrica — declarados no Markdown do capítulo e **corrigidos no servidor**.
- Revelação de gabarito só na 2ª tentativa: a primeira devolve pista e a âncora da seção.
- Vídeos curados com player de fachada: nada é pedido a terceiros antes do clique do leitor.
- Barra de progresso por capítulo, espelhada em `localStorage` (funciona offline).

**Backend**
- Tutor com busca no texto do livro, gating de capacidades por capítulo, e o progresso do leitor como contexto.
- Rotas de prática: `/exercicio/tentativa`, `/exercicios`, `/video/visto`, `/progresso`.
- Telemetria anônima e consentida, com projeção pública que inclui os **exercícios mais difíceis** — o sinal que corrige o livro.
- Apagamento em cascata: `DELETE /session/{id}` remove conversas, tentativas, vídeos e objetivo.
- Tools determinísticas de ML: métricas de classificação e conferência de split.
- 23 testes verdes, sem rede e sem banco.

**Motor de publicação**
- Markdown → site navegável, com gate de links internos quebrados.
- `exercicios.mjs`: extrai o banco e valida (gabarito, feedback, objetivo existente, ids únicos). Erro de autoria é falha de build, não aviso.
- Knowledge graph do livro, derivado do conteúdo a cada build.

**Trilha `ml-zero`**
- Etapa 00 (dado, divisão estratificada e linha de base), em biblioteca padrão pura — 17 testes verdes.
- Mapa das 17 etapas, uma por capítulo.

### Notas

- 15 capítulos estão em estado de **esqueleto** (objetivos e problema definidos, corpo a escrever). Cada um entra por sua própria spec — escrevê-los fora do ciclo violaria o Princípio VII.
- A bibliografia tem 5 referências ✓ e as demais ⏳; o que está ⏳ não sustenta afirmação no corpo.
