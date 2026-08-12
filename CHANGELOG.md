# Changelog

Todas as mudanças notáveis deste projeto. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versionamento acompanha as **edições** do livro (ver [`livro/HISTORICO.md`](livro/HISTORICO.md)).

> **Gate de CI:** toda PR adiciona uma entrada em `[Unreleased]`. Bypass explícito para mudanças que não afetam o leitor: label `skip-changelog`.

## [Unreleased]

### Adicionado — os gates da onda 1: as regras saem da prosa e entram no build
- **Backward Design nas duas direções.** O gate proibia exercício apontando para
  objetivo inexistente e **nada** proibia objetivo sem exercício. Foi por essa
  porta que 18 dívidas entraram sem registro: o roadmap declarava 2 objetivos
  órfãos, e o livro tinha **20**. A lista `ORFAOS_ACEITOS` é a dívida cobrada —
  órfão novo quebra o build, **e exceção que deixou de ser necessária também**,
  para que pagar a dívida obrigue a tirá-la da lista.
- **Seções obrigatórias do esqueleto v5** viram gate. "Fundamentos científicos"
  caiu para 1 capítulo em 29 e "Fontes da indústria" para zero sem ninguém
  notar, porque o esqueleto vivia só na prosa do Guia Editorial.
- **Verbo não verificável falha o build**: "entender", "conhecer", "saber",
  "dominar" abrindo um objetivo. Nenhum capítulo usa hoje — o gate existe para
  que continue assim.
- Os três foram **provados quebrando de propósito**: objetivo órfão novo, exceção
  obsoleta, seção removida e verbo vago.

### Adicionado — a tabela de verbos de Bloom (Guia Editorial §2.5)
- O esqueleto pedia "verbos de Bloom" desde o começo e **a tabela nunca existiu
  no repositório**. É a revisão de **Anderson & Krathwohl (2001)**, com as duas
  dimensões — os seis processos e os quatro tipos de conhecimento.
- Três regras, e a terceira é a que corrige o defeito medido: **o exercício
  define o verbo, não o contrário.** Rebaixar o verbo é honesto; inflar é
  promessa que o leitor descobre sozinho, tarde.
- Alerta explícito sobre "reconhecer"/"identificar": em Anderson & Krathwohl são
  subprocessos de **Lembrar**, e no livro geraram exercícios separados por quatro
  degraus a partir da mesma palavra.

### Corrigido — dívidas do roadmap que estavam sub-declaradas
- **D11: de 2 para 20 objetivos órfãos.** O projeto define o próprio nível de
  maturidade pela honestidade da declaração; 18 dívidas não declaradas
  contradizem a regra que autoriza publicar em `essencial`.
- **D13, nova**: 15 objetivos de nível Criar cobrados abaixo do nível — só 1 dos
  15 tem exercício que pede produção, e 4 não têm evidência alguma no livro.

### Alterado — numeração por parte, e o id do exercício desatado do número (ADR 0011)
- **`05-modelos-lineares` → `ii-2-modelos-lineares`**, e o título vira **II.2**.
  A medição que motivou: **as 29 posições do sumário estavam fora de ordem** —
  não algumas. Inserir um capítulo agora desloca só os vizinhos da mesma parte.
- **O id do exercício deixou de carregar o número**: `05-e1` → `modelos-lineares-e1`.
  Se seguisse a numeração, inserir um capítulo no meio de uma parte renumeraria
  os exercícios seguintes e **o progresso de cada aluno apontaria para exercícios
  inexistentes** — a cada inserção, para sempre. Números para humanos, nomes
  para máquinas.
- **O "capítulo" do companion virou posição de leitura** (1..29). O gating de
  capacidades passou de 2/4/6 para 5/9/12 — que é o que ele sempre quis dizer.
- **29 endereços antigos quebram**, por decisão explícita do autor (13 tentativas
  registradas em produção; redirecionar custaria uma tabela de-para para sempre).
- **Dívida D7 paga. Dívida D12 aberta**: a numeração das pastas do `ml-zero`
  ficou órfã (`etapa-05` serve o `II.2`).

### Adicionado — gate: âncora `volte para` inexistente falha o build
- O `volte para:` devolve o leitor à seção exata que ele precisa reler, e o Guia
  Editorial o chama de "o gesto mais útil do livro". Âncora inexistente **não dá
  erro**: a página abre, não rola, e o leitor acha que a culpa é dele.
- **Duas estavam quebradas** quando o gate foi escrito — achadas pelos pareceres
  de didática, não por teste. Provei o gate quebrando uma âncora de propósito.

### Corrigido — quatro acoplamentos ao número, que só apareceram quando ele mudou
- **`dividirTitulo` exigia prefixo só de dígitos.** Com "II.2" ele devolvia
  vazio, o cabeçalho do capítulo não era montado — e junto sumia o **selo de
  nível**. O gate do Princípio X pegou, nas 29 páginas de uma vez. Segunda vez
  que esse gate salva exatamente essa promessa.
- **O grafo do livro** identificava nós por número e ligava capítulos por menção
  textual ("cap. 05"). Passou a identificar por slug e a ligar **por link** —
  mais fiel: referência linkada é dependência declarada; menção solta nem sempre.
- **O gating de capacidades** nos dois lados (motor e backend).
- **Os testes do backend** citavam `05-e1` literal.

### Corrigido — o build do backend passa a ser declarado (ADR 0007)
- **`Dockerfile` + `.dockerignore` na raiz**, e `railway.json` com
  `builder: DOCKERFILE`. A raiz do repositório tem `package.json` (que existe só
  para fixar o Node na Vercel) e **nenhum marcador de Python no topo** — os do
  backend estão dois níveis abaixo. Qual linguagem a detecção automática
  elegeria nessa combinação não é coisa que se prove sem rodar o build lá, e o
  `buildCommand` anterior pressupunha `pip` na imagem. Achado na conferência
  **antes** do primeiro deploy, não depois dele falhar.
- **Removidos `chat-companion/backend/railway.json` e `Procfile`**, herdados da
  cópia do harness. Inertes com a raiz no repositório — e prontos para funcionar
  no dia em que alguém "consertasse" o Root Directory apontando-o para a pasta
  do backend: o serviço subiria **verde**, sem `livro/`, com a busca do tutor
  degradada e nenhum sinal.
- O `.dockerignore` exclui `.env` explicitamente: o arquivo é gitignored, mas
  `COPY . /app` não sabe disso (Princípio V).

### Adicionado — análise monovariada: laboratório, dois exercícios e notebook (cap. 21)
- **Laboratório `21-l1`** sobre o conjunto **real** da limonada, servido pelo
  próprio site: seletor de coluna, **histograma e boxplot na mesma escala**, e o
  painel completo — n, distintos, média, mediana, moda, desvio-padrão, Q1/Q3,
  IQR, P10/P90, cerca de 1,5 × IQR e contagem de outliers. Média e mediana
  aparecem como linhas tracejadas sobre o histograma: o afastamento entre elas é
  a assimetria, visível de graça.
- **`21-e4`** cobra o caso que o dado entrega de bandeja: `preco` acusa **62
  outliers** porque **Q1 = Q3 = 0,30 e o IQR é zero** — a régua quebrou, não os
  dados. E aumentar o fator de 1,5 para 3,0 não muda nada: três vezes zero
  continua zero.
- **`21-e5`** (aberta) usa `precipitacao`, onde a regra acusa 28 pontos **por
  construção** — distribuição assimétrica, cauda longa, chuva forte é fenômeno e
  não erro. A rubrica exige **critério declarado**, não remoção por reflexo.
- **Notebook `etapa-21/exploratoria_limonada.ipynb`**, com o caminho da aula:
  tipo de cada campo → contagem e nulidade → posição → separatrizes (incluindo a
  verificação de que P50 = Q2 = D5) → histograma e boxplot → a cerca coluna a
  coluna.
- **ADR 0010**: esta é a **única** etapa que usa `pandas` e `matplotlib`. O
  assunto é *ler distribuição*; desenhar histograma à mão ensinaria sobre
  desenho. A conta em si — quantil, cerca, descritivas — está escrita à mão no
  laboratório, em 30 linhas.

### Corrigido — três defeitos que só apareceram ao dirigir o navegador
- **A última coluna do CSV era inacessível.** O arquivo estava com terminador
  `CRLF`, então o `\r` colava no nome da última coluna e a chave virava
  `"vendas\r"`. O laboratório lia `undefined`, a coluna inteira virava `NaN` — e
  **o painel continuava exibindo os números da coluna anterior**, porque o
  desenho quebrava antes de atualizá-lo. Valor errado exibido com confiança é
  pior que erro na tela. O CSV foi regravado com `LF` e o parser passou a
  limpar cada campo.
- **O painel do laboratório novo nascia espremido**: a regra de largura escrita
  para o laboratório do capítulo 05 estava presa ao seletor daquele laboratório.
- **`ml-zero/` estava no `.vercelignore`**, e o build agora lê o CSV de lá. A
  produção não quebraria (é construída no GitHub Actions, com o repositório
  inteiro) — **só as previews**, que é a falha mais difícil de diagnosticar.
- O **verificador de notebooks** passou a rodar **um processo por notebook**: a
  versão anterior limpava `sys.modules` entre eles e quebrava no primeiro
  `import numpy` (extensão em C não recarrega). Processo próprio é também o que
  o Jupyter dá ao aluno.

### Adicionado — laboratório de mínimos quadrados, dedução do método, e o capítulo 28 (ADR 0009)
- **Laboratório `05-l1`**: nuvem de pontos aleatória, e a reta manipulável pelos
  **coeficientes** ou **arrastando as alças** direto no gráfico. Resíduos
  desenhados ponto a ponto, e **os quadrados do erro como área** — o que se
  minimiza fica literalmente visível. Cinco métricas lado a lado (SQE, EQM,
  RMSE, EAM, R²) com **o EQM marcado como a que estamos minimizando**, mais
  botões de ajustar automaticamente, revelar a reta ótima e sortear novos dados.
  Roda no navegador, sem backend.
- **"A dedução, em cinco passos"** no capítulo 05: do critério às equações
  normais, passando pelas duas condições que a derivação entrega — a soma dos
  resíduos é zero (**a reta passa pelo centro de massa**) e os resíduos são
  ortogonais ao atributo. Termina no aviso que a fórmula dá de graça:
  `a = Sxy/Sxx`, e **atributo que não varia não tem coeficiente**.
- **Capítulo 28 — Regressão Logística**, separado do 05 (ADR 0009). Ganhou
  história com selos, a dedução de **por que a solução fechada some** (o peso
  fica preso dentro da sigmoide), a tabela que mostra o mesmo coeficiente
  movendo a probabilidade em 8, 17 ou 5 pontos conforme o ponto de partida, e
  três exercícios. Antes eram 30 linhas dentro do 05.
- Exercícios: **94 → 96**. `05-e2` e `05-e3` viraram `28-e1` e `28-e2`; o
  exercício novo da dedução é `05-e7` — **e não o `05-e2` vago**, porque
  reciclar id faria as tentativas antigas apontarem para outra pergunta em
  silêncio.

### Corrigido — o banner de consentimento estava quebrado em TODAS as páginas
- `var tx = el("span", …)` **sombreava a função `tx()`** de tradução dentro da
  mesma função (`publicar/tema/companion.js`), e a linha seguinte tentava chamar
  um `<span>`. Resultado: `Uncaught TypeError` em toda página do livro, banner
  nenhum, e — porque a telemetria de navegação **exige consentimento** — nenhum
  registro de navegação jamais gravado.
- Nenhum gate pegava: o build compila, os testes do backend passam, os links
  estão certos. **Só apareceu ao dirigir a página num navegador de verdade**,
  enquanto eu verificava o laboratório novo.

### Adicionado — notebooks prontos para executar nas seções "Mão na massa"
- **Quatro notebooks novos** (o cap. 18 já tinha o dele), ligados dos capítulos
  **01, 02, 05, 06 e 07**: `linha_de_base`, `vazamento`, `regressao_limonada` e
  `arvores_ensembles`.
- **Rodam na máquina do aluno e no Colab sem mudar nada**: a primeira célula
  procura o repositório subindo de pasta e, se não achar, baixa do GitHub só o
  que precisa. Nenhum deles exige NumPy ou pandas — biblioteca padrão e o código
  do próprio livro.
- **Gate novo no CI**: `ml-zero/tests/rodar_notebooks.py` executa **todas** as
  células, a partir da pasta da etapa. Notebook que não roda é pior que notebook
  nenhum: quebra no meio da aula. O verificador achou três defeitos antes da
  publicação — chave errada na matriz de confusão, um exemplo de vazamento com
  10 linhas onde **toda** coluna separa por acaso, e uma quebra de sintaxe.

### Corrigido — uma frase minha sobre a limonada estava errada
- O capítulo 05 dizia para "refazer o ajuste só com julho e agosto, **onde o
  preço varia** sem a estação variar junto". **Não varia.** Escrevendo o
  notebook, a verificação mostrou que **nenhum mês do ano tem mais de um preço**
  — 0,30 em dez meses, 0,50 nos 62 dias de julho e agosto.
- A correção deixa a lição mais forte, não mais fraca: o confundimento é
  **perfeito**, e não existe recorte, controle ou modelo que separe preço de
  estação. A resposta honesta passa a ser *"com estes dados não dá — e aqui está
  o que precisaria ser coletado"*. Propagado para o README do conjunto e para a
  rubrica do exercício `05-e6`.

### Adicionado — identificação por turma, para o professor acompanhar prática (ADR 0008)
- **`/turma AP2026-2 123456` no chat.** O anonimato continua sendo o padrão; a
  identificação é uma exceção que **o próprio aluno ativa**, e `/turma sair`
  desfaz. Enquanto ninguém digitar, nada muda.
- **É código, não prompt** (`chat-companion/backend/turma.py`): interpretado
  antes do modelo, nas **duas** rotas de chat — o widget usa a `/chat/stream`, e
  interceptar só a `/chat` teria deixado o comando cair no LLM, que responderia
  algo plausível sobre turmas sem identificar ninguém. Um teste quebra o
  `run_turn` de propósito para provar que a identificação sobrevive ao modelo
  fora do ar.
- **`GET /turma/{turma}`** (JSON ou CSV), protegido pelo `ADMIN_TOKEN`: por
  aluno, resolvidos · tentados · tentativas · acertos de primeira · capítulos ·
  vídeos. **Nunca o texto das respostas nem as conversas** — e há um teste que
  procura esses conteúdos na saída e falha se achar.
- Agrega **por aluno, não por sessão**: laboratório e celular são duas sessões
  anônimas, a pessoa é uma. E aluno identificado sem nenhuma tentativa aparece
  **zerado**, não ausente — ausente é dúvida, zerado é informação.
- **19 testes novos** (backend: 28 → 47). Cobrem que apagar a sessão apaga o
  vínculo, que sem token dá 403, e que "o que é uma turma?" não é comando.
- **A identificação é declarada, não verificada** — dito no ADR, no apêndice de
  uso e na resposta que o aluno lê. Serve para acompanhar prática; não substitui
  evidência para lançar nota.

### Adicionado — o capítulo 05 ganhou o caso da limonada (91 → 94 exercícios)
- **Nova seção "O caso da limonada"** em `ii-2-modelos-lineares.md`: a lista "as
  quatro coisas que o coeficiente não diz" deixa de ser advertência e passa a ser
  experimento. O leitor **produz** o coeficiente errado antes de ler que é errado.
- Mostra o que quase nenhum material mostra: **controlar pela temperatura não
  desfaz o confundimento** — o coeficiente do preço segue +2,41 na regressão
  múltipla, porque a temperatura do dia não captura "ser julho". Controlar por uma
  variável só remove o confundimento que aquela variável mede.
- **Três exercícios novos**: `05-e4` (inverter o coeficiente devolve a unidade da
  decisão: 53 panfletos por copo), `05-e5` (por que o coeficiente do preço
  sobrevive) e `05-e6`, aberto — a resposta que se dá à dona da barraca.
- **`05-e6` fecha uma lacuna anterior**: o objetivo **O4 não tinha exercício
  nenhum** no capítulo. Era o mesmo padrão da dívida D11, ainda não registrado.
- **Ponteiros** a partir do cap. 21 (a exploração que revela o confundimento
  precede o modelo) e do cap. 25 (a seção "limitações" é a única das seis partes
  do relatório que impediria a recomendação errada).

### Publicado — o livro está no ar no domínio próprio, com o backend vivo
- **https://machinelearning.ghdaru.com.br** (Vercel) e
  **https://api.machinelearning.ghdaru.com.br** (Railway + Neon em São Paulo),
  passos 1–7 do `DEPLOY.md` concluídos em 2026-08-11.
- **Os 91 exercícios saíram da dormência**: correção no servidor com revelação
  progressiva, verificada de ponta a ponta pelo domínio novo — 1ª tentativa
  devolve "Ainda não, releia a seção"; a 2ª entrega a explicação completa.
- Ambos os nomes resolvem **direto no provedor**, sem o proxy da Cloudflare:
  ele impediria a verificação de posse nos dois casos, e no `api.` o certificado
  grátis nem cobriria dois níveis de subdomínio.
- **Falta o passo 8** — o stub no endereço antigo — deixado por último por ser o
  único irreversível para quem tem link em circulação.

### Adicionado — conjunto de dados "Limonada" para regressão linear
- **`ml-zero/dados/limonada/`** — 365 dias (2017) de venda de limonada com tempo,
  panfletos e preço, fornecido pelo autor para a parte de regressão linear de
  Análise Preditiva. Original `.xlsx` preservado + `.csv` para código.
- O `README.md` do conjunto documenta **três armadilhas verificadas no próprio
  dado**, não supostas: (1) `preco` correlaciona **+0,513** com as vendas porque
  o preço de 0,50 só aparece em **julho e agosto** — é um indicador disfarçado de
  estação, e o confundimento **sobrevive à regressão múltipla**; (2) colinearidade
  `temperatura`×`panfletos` de **+0,798**; (3) `R² = 0,982` sem divisão
  treino/teste.
- A **unidade da temperatura não é declarada** pelo arquivo. O README registra
  Fahrenheit como leitura provável (faixa 15,1–102,9) e **não** como fato — e
  transforma isso na primeira pergunta da aula.

### Corrigido — o `og:image` apontava para o endereço que vai ser aposentado
- **`SITE` no `build.mjs`** passa a ser `https://machinelearning.ghdaru.com.br/`.
  Ele entra no `og:image` de **todas** as páginas e no cabeçalho da exportação em
  Markdown, e apontava para o GitHub Pages — que no passo 8 passa a servir só um
  stub. O `capa-social.png` deixaria de existir lá, e **toda partilha do livro em
  rede social viraria um retângulo vazio**. Nenhum gate pegaria: a página continua
  200, só a prévia quebra, e quem publica o link não vê. Achado lendo o HTML
  publicado na primeira build da Vercel.

### Corrigido — o `vercel.json` não podia ter comentários
- **Removidas as três chaves `_comentario…`**: a Vercel valida o schema e recusa
  a importação do projeto com *"should NOT have additional property"*. O Railway
  aceita e ignora chaves desconhecidas — daí o hábito ter passado batido. Achado
  na tela de importação, com o autor parado nela.
- A explicação de **cada campo** foi para `publicar/README.md`, incluindo a razão
  de `cleanUrls: false` (paridade de URL com o Pages, que é o que faz o stub de
  redirecionamento funcionar sem mapa de rotas) e de
  `git.deploymentEnabled.main: false` (quem promove produção é o workflow, depois
  dos gates).

### Adicionado — publicação (ADR 0006)
- **Front na Vercel**, promovido pelo workflow **depois** dos gates — não pela
  integração Git da Vercel. `deploymentEnabled.main: false` no `vercel.json`
  garante que o site não vá ao ar com os testes vermelhos.
- **Backend na Railway com raiz no repositório**, divergindo do guia do harness:
  com a raiz na pasta do backend, o tutor dependeria de um `corpus.json` de
  815 KB versionado e regenerado a cada edição — que, esquecido, degrada a busca
  **em silêncio**. Com a raiz no repositório o índice é construído ao vivo.
- **Domínio próprio** `machinelearning.ghdaru.com.br`, e **`api.machinelearning`
  para o backend** — porque `companion_backend` é compilado dentro do HTML de
  todas as páginas, e apontar para `*.up.railway.app` obrigaria a republicar o
  livro inteiro a cada troca de provedor.
- **`ALLOWED_ORIGIN_REGEX`** no backend, para as URLs de preview da Vercel, que
  mudam a cada commit. Sem ele o chat quebraria em silêncio em toda preview.
  Cinco testes cobrem o CORS, inclusive um que garante que o regex **não** é
  curinga.
- **Smoke test bloqueante** no deploy: sem o cabeçalho `access-control-allow-origin`
  vindo da API, o deploy falha. É a mitigação do risco que o ADR mais teme —
  degradação silenciosa, com os laboratórios funcionando e mascarando a falha.
- **Stub de redirecionamento** para o endereço antigo do Pages, preservando o
  caminho, com `canonical` e `noindex`. Publicado por workflow manual, e só
  depois de o domínio novo estar no ar.
- **Passo 4 do `DEPLOY.md` corrigido durante a execução**: o Railway pede **dois**
  registros (CNAME + TXT `_railway-verify`), não um — sem o TXT o certificado
  nunca é emitido. E o DNS de `ghdaru.com.br` está na Cloudflare, então os
  registros precisam ficar **DNS only** (nuvem cinza): com o proxy ligado, a
  verificação de posse falha, porque o Railway encontra IP de proxy no lugar do
  alvo dele.

### Corrigido
- **O gate do banco de exercícios não pegava derivação.** Ele validava a sintaxe
  do Markdown e **não comparava com o `banco.json` versionado** — que é o arquivo
  que o backend serve ao leitor. Estava derivado de verdade: **88 exercícios no
  banco contra 91 no livro**, então os três do capítulo 14 nunca chegariam a
  quem estudasse. Agora o gate compara o conteúdo e falha na diferença.

### Removido
- `render.yaml` — o blueprint do Render foi substituído pelo caminho
  Railway + Vercel do ADR 0006.

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
- **O nível de maturidade não chegava ao leitor.** A constituição exige que um
  capítulo `esqueleto` ou `essencial` declare isso "em destaque, no cabeçalho" —
  e durante toda a v1.0 ele ficou **invisível**: a linha vive no primeiro
  blockquote, que o motor remove para virar o selo de data. O gate conferia o
  Markdown, não a página. Agora o nível é um **selo colorido** no cabeçalho, com
  explicação no `title` do que ele garante e do que não garante — e há um gate
  que confere a **saída**, não a entrada. Achado na verificação final, olhando o
  site publicado. **Gate que confere a entrada não prova nada sobre a saída.**
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
