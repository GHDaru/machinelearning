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
2. **A ordem é a da disciplina, não a do sumário.** A numeração é por **parte e posição** (`II.2`, ver [ADR 0011](adr/0011-numeracao-por-parte.md)); a ordem de leitura de cada disciplina vive nas [trilhas](livro/trilhas/analise-preditiva.md). Um mesmo capítulo serve a duas disciplinas com pesos diferentes, e capítulos distantes no sumário são vizinhos numa trilha.
3. **Laboratórios interativos passam a ser primeira classe.** O gesto de pôr os pesos à mão e ver a reta se mover ensina o que nenhuma frase ensina. É a linha de evolução mais promissora do livro.

## Estado atual — **edição 1.0 (2026-08-10)**

| | |
|---|---|
| Capítulos | **28** · todos no nível `essencial` · nenhum em `completo` |
| Interatividade | **91 exercícios** · 7 vídeos · 1 laboratório |
| Seções "De onde isto veio" | **26 de 26** capítulos de método, com tabela de selos |
| Trilhas de disciplina | 3 |
| `ml-zero` | 5 etapas · 88 testes · Backend: 28 testes |
| Site | 🟢 https://machinelearning.ghdaru.com.br/ |
| Backend | 🟢 https://api.machinelearning.ghdaru.com.br — **os 91 exercícios corrigem de verdade** |

**Ciclos concluídos:** C1 (trilha de Análise Preditiva), C2 (trilha de Aprendizagem de Máquina), C7 (o capítulo 27 cobre a Unidade 02) e C8 (pesquisa histórica + retrofit). **Dívidas D6, D8 e D9 pagas.**

---

## Agora

### C5 — Aprofundamento: `essencial → completo` ⬅ **prioridade máxima**

É o único caminho que resta para o livro melhorar, e ele **paga a dívida D10**: hoje muita fonte está selada `✓ᵐ` — conferimos que a obra existe, não que a lemos.

A ordem é a das **filas de verificação** nas cinco notas de pesquisa em `estudos/`, que já estão ordenadas por **dúvida fechada por unidade de esforço**. Os primeiros itens são baratos e fecham muito: o guia CRISP-DM 1.0 (fecha o cap. 19 inteiro numa leitura), Stigler 1981 (fecha o fio Gauss×Legendre), Loog *et al.* 2020 (2 páginas, arXiv aberto), Kaufman *et al.* 2012 e Gebru *et al.* 2018.

Promover a `completo` exige, além disso: experimento próprio no `ml-zero`, cláusula de expiração e revisão developmental.

### ~~C4 — Publicar o backend~~ — **CONCLUÍDO em 2026-08-11**

> Neon (São Paulo) + Railway + Vercel + domínio próprio, nos passos 1–7 do [`DEPLOY.md`](chat-companion/DEPLOY.md). Os **91 exercícios corrigem no servidor**, com revelação progressiva, verificada de ponta a ponta pelo domínio novo. Duas correções nasceram do próprio deploy: o [ADR 0007](adr/0007-builder-declarado-na-railway.md) (build declarado em vez de detectado) e o `og:image`, que apontava para o endereço prestes a ser aposentado.
>
> **Falta o passo 8** — aposentar o `ghdaru.github.io` trocando-o pelo stub de redirecionamento, e então remover essa origem de `ALLOWED_ORIGINS` no Railway. Deixado por último de propósito: é o único passo irreversível para quem tem link antigo.

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

### C6 — Etapas do `ml-zero` que faltam

Prioridade para as que servem às trilhas: **09** (rede em NumPy), **26** (treino profundo), **21** (EDA), **24** (séries temporais).

### C7 — Parte de Inteligência Artificial *(parcialmente concluído)*

O autor observa que **IA é outra disciplina**. O capítulo 27 cobre o que a ementa de Aprendizagem de Máquina exige (simbólico, fuzzy, genéticos, bayesianas). Uma Parte VI dedicada — busca, planejamento, agentes, representação de conhecimento — fica registrada como possibilidade, não como compromisso.

### ~~C8 — Sessão de pesquisa histórica e retrofit~~ — **CONCLUÍDO em 2026-08-10**

> Cinco passadas de pesquisa em `estudos/`, retrofit nos 8 capítulos com corpo, e os níveis declarados. O registro do que a sessão única produziu — e do que a auditoria adversarial derrubou depois — está na [edição 1.0](livro/HISTORICO.md).

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
| ~~**D6**~~ | ~~Capítulo 16 sem vídeo verificável~~ — **resolvida**: no nível `essencial` não há cota de mídia, e nenhum vídeo foi inventado para preencher | Princípio VIII: o portão de mídia vale na promoção a `completo` |
| ~~**D7**~~ | ~~Numeração fora de ordem no sumário~~ — **PAGA** em 2026-08-12: numeração por parte ([ADR 0011](adr/0011-numeracao-por-parte.md)). As 29 posições estavam fora de ordem, não algumas | o id do exercício foi desatado do número, então renumerar deixou de ameaçar o progresso do leitor |
| ~~**D8**~~ | ~~Nenhum capítulo tem "De onde isto veio"~~ — **PAGA**: os 26 capítulos de método têm a seção e a tabela de selos, cobradas pelo build | a emenda 1.2.0 era posterior a eles; nível não subiu sem pagar |
| ~~**D9**~~ | ~~20 capítulos não declaram nível~~ — **PAGA** em 2026-08-10: os 18 que faltavam declararam nível, e o build agora **falha** sem a declaração | o Princípio "níveis" exige a declaração ao leitor |

| **D10** | **Selo ✓ᵐ sustentando afirmação sobre o que a obra argumenta por dentro**, em vários capítulos — quando ✓ᵐ só prova que a obra existe | achado da [auditoria adversarial](estudos/2026-08-10-auditoria-adversarial.md). Paga-se **lendo as fontes** no ciclo `essencial → completo`, não com hedge no texto. A fila de verificação da nota de pesquisa é o plano de pagamento |

| **D11** | **2 objetivos sem exercício próprio** — eram **20** em 2026-08-12, e não 2, como esta linha declarou até então | achado pela auditoria de Bloom. O gate do `exercicios.mjs` **cobra**: órfão novo quebra o build, e a exceção sai da lista no mesmo commit em que a dívida é paga. **18 pagos** pelo [ADR 0012](adr/0012-verificacao-como-superficie-corrigida.md), e os **2 últimos** em 2026-08-13, pelos ADRs 0016 e 0017 — eram falta de conteúdo, não de exercício. **PAGA por inteiro**: a lista de exceções do gate está vazia |
| ~~**D16**~~ | ~~Dois objetivos declarados em capítulos que não os ensinam~~ — **PAGA** em 2026-08-13, pelos dois lados e sempre pelo conteúdo. `v-2` O4 pelo [ADR 0016](adr/0016-a-quem-pertence-a-escolha-da-forma-de-servico.md): escolher a forma de serviço é desenho, o `v-2` ganhou a seção que faltava, e o `v-3` devolveu a tabela que lá era órfã de objetivo. `v-3` O2 pelo [ADR 0017](adr/0017-a-fronteira-do-servico-entra-no-v3.md): o `v-3` ganhou "A fronteira do serviço", com o backend deste próprio livro como exemplo trabalhado. **`ORFAOS_ACEITOS` ficou vazia** | as duas decisões foram de evidência, não de arrumação. No `v-2`, a escolha não estava em nenhuma das duas fontes-base e a indústria a trata como assunto de projeto. No `v-3`, nenhuma fonte aberta prescreve o que fazer quando uma requisição viola o contrato — então o capítulo apresenta as três políticas e ensina que a escolha é declarada, com selo 📖 na leitura e ❌ na busca que não achou |
| **D13** | **15 objetivos de nível Criar cobrados abaixo do nível** — só 1 dos 15 tem exercício que pede produção; 4 não têm evidência alguma no livro | achado da auditoria de Bloom. O caminho de pagamento passou a ser o [ADR 0012](adr/0012-verificacao-como-superficie-corrigida.md): a pergunta-âncora da Verificação vira exercício corrigido, com rubrica de 4 critérios. Ou o exercício sobe, ou o verbo desce — as duas coisas são trabalho de conteúdo, não de gate |
| **D14** | **`progresso` e `progresso_turma` agregam de `tentativas` sem cruzar com o banco** (`chat-companion/backend/store.py`) | id que sai do livro continua contando no progresso do leitor e no CSV da turma. É o que torna qualquer conversão de exercício **cara de desfazer** — pré-condição para escalar o ADR 0012 além do 1º lote |
| **D15** | **Rubrica é tudo-ou-nada e a barra de capítulo só fecha em 100%** (`exercicios.py`, `tema/interativos.js`) | com desafios de 4 critérios, esses itens afogam o ranking de "difíceis" — que existe para achar *texto mal escrito*, não exercício duro. O campo `secao` já está no banco para permitir segmentar |

> **O que o gate ensinou, e que o plano não previa.** O ADR 0004 mandava fazer o lote 1 (capítulos novos) antes do lote 2 (retrofit dos antigos). Assim que o gate entrou no build, ele **inverteu a ordem sozinho**: declarar o nível dos 7 capítulos com corpo tornou o build vermelho na hora, e nenhum trabalho novo podia ser publicado antes de a dívida antiga ser paga.
>
> Isso é o gate funcionando como projetado — e é a diferença entre uma dívida *registrada* e uma dívida *cobrada*. Uma fica no roadmap; a outra impede o próximo commit.

| **D12** | **A numeração das etapas do `ml-zero` ficou órfã** — `etapa-05` serve o capítulo `II.2` | consequência do ADR 0011; o conserto é o mesmo princípio: a pasta passa a ter nome, não número |

| **D17** | **88% das questões de múltipla escolha são gabaritáveis marcando a alternativa mais longa** — 227 de 259, contra 25,3% de acaso. Em 19 capítulos a estratégia acerta **100%**. A segunda alternativa é a correta em 71% dos casos. Um aluno que descobrir o padrão tira 88 sem abrir o livro, e o banco **está valendo nota** | medido no `banco.json` inteiro em 2026-09-01, a partir de uma suspeita levantada só sobre o `II.2`. A causa é de escrita: a correta é a única na voz do livro, com ressalva e contraponto, enquanto os distratores são frases curtas — no `e9` do `II.2`, 147 caracteres contra 67 da segunda maior. O `e12` escapa, e mostra o conserto: quatro rótulos curtos e paralelos. Paga-se equalizando comprimento, embaralhando posição e **cobrando isso num gate**. O gate existe desde 2026-09-01: `publicar/gates/vies-de-comprimento.mjs`, bilateral, com dívida declarada em `VIES_PENDENTE`. **Bilateral porque a cura ingênua criou o defeito espelhado**: encurtar as corretas do `II.2` levou o capítulo a 0 de 26, e quem risca a mais longa passa a eliminar uma em quatro de graça. O `II.2` é a primeira página cobrada e está em 8 de 26 (z = 0,68); as outras 36 páginas seguem na lista, com 223 de 252 (88%) |
| **D18** | **O texto dos laboratórios sai a 6px no celular** — o *backing store* do canvas é fixo (560 ou 460px), o CSS o encolhe para 281px numa coluna de 360px, e a fonte de 12px renderiza a **6,0px**. O número com nome na tela é a exigência inteira do [ADR 0015](adr/0015-animacao-e-laboratorio-sem-manopla.md), e está abaixo do piso de legibilidade no aparelho em que o livro é lido | medido num Chromium a 360px em 2026-09-01. Não há rolagem lateral, então a auditoria de jornada passa: ela cobre a restrição errada. O conserto não é o `fitCanvas` sozinho — ele dá nitidez, não tamanho —, é o desenho passar a ler `clientWidth` e diagramar a partir dele, como faz a referência de microlearning. Os laboratórios **novos** já nascem assim, e o de regressão linear do `II.2` foi convertido em 2026-09-04, junto com o painel da tigela (D25): a fonte de 12px que saía a **6,0px** passou a sair a **12,0px**, medido no mesmo Chromium a 360px. Sobram **26** |
| **D19** | **O aviso de consentimento do companion cobre o conteúdo no celular** — `position: fixed`, `z-index` 2147483001, 257×326px numa coluna de 360, com o texto quebrando de duas em duas palavras. A 768px o mesmo aviso ocupa 384×111 | achado numa captura de tela do `II.2` a 360px, ao investigar a D18. A auditoria de jornada não pega: ela confere rolagem lateral, contagem de exercícios, montagem de laboratório e console limpo — **oclusão não está na lista** |
| **D20** | **O modo cartão existe em 58 páginas e só uma foi desenhada como baralho** — nas outras 57 o corte é automático por cabeçalho, e o resultado é **623 cartões de 682 sem interação nenhuma** e **438 sem exercício**, com a pior razão maior/menor em **80,1x** (`06-otimizacao`). O leitor que ligar o modo cartão fora do `II.2` recebe uma barra de progresso que mede parágrafos, não unidades fecháveis | medido em 2026-09-01 pelo `publicar/gates/cartoes-legiveis.mjs`, que passou a **imprimir estes números em toda execução, inclusive quando passa**. O gate cobra por inteiro só a página com `:::cartao` no fonte e relata as demais sem reprovar: cobrar as 57 de uma vez reprovaria o livro inteiro, e essa é decisão de escopo editorial. O conserto é por capítulo, no mesmo movimento do `II.2` — cortar o baralho à mão e dar a cada cartão uma interação e um exercício |
| **D21** | ~~**Fórmula cortada na margem no modo cartão**~~ — **PAGA em 2026-09-01**. Quatro fórmulas do `II.2` mediam 408px, 445px, 514px e 324px em espaços de 322px e 281px, e o leitor via a expressão terminar no nada. As quatro foram quebradas em duas linhas, e a medição virou a **asserção G** de `publicar/jornada.mjs` | medido num Chromium a 360px em 2026-09-01. A entrada original dizia "cartões 7 e 8" e citava a interação `i2` como exemplo do conserto já feito à mão: as duas coisas estavam erradas. No baralho de hoje são os cartões 10, 11 e 13, e a `i2` usava `\qquad`, com as duas condições **lado a lado** e cortando 324px em 281px. Agora estão de fato uma sob a outra. O corte não é só do modo cartão: as mesmas quatro fórmulas cortavam no fluxo longo, e G mede as duas leituras de uma vez porque mede a caixa da fórmula, não a da página. Sobram **12 fórmulas em 5 capítulos**, declaradas em `FORMULA_CORTADA_PENDENTE` e cobradas nas duas direções |
| **D22** | **A tabela do cartão 19 do `II.2` é cortada 41px sem rolagem** — some a coluna "meses em que aparece", que é exatamente onde mora a sazonalidade. O cartão diz *"antes de explicar, olhe o dado"* e esconde o confundidor que ele quer que o leitor descubra sozinho | achado por crítico cego num Chromium a 360px em 2026-09-01. É o único lugar do baralho em que o leitor **perde conteúdo sem saber**: fórmula que transborda ao menos rola, esta não. Conserto barato; o que o torna urgente é que ele mata o gesto pedagógico do próprio cartão |
| **D23** | **Vinte e quatro cartões seguidos sem nada para o leitor manipular** — os dois laboratórios do `II.2` estão nos cartões 8 e 15, e os cartões 16 a 39 (62% do baralho, 46 telas) não têm um único objeto que se mexa. Todo o orçamento de manipulação foi gasto no **ajuste**; a metade seguinte, que é sobre interpretar coeficiente, é justamente onde a ideia central **é uma mudança num número** — o que acontece com o coeficiente quando entra a terceira variável | medido por crítico cego em 2026-09-01: objetos manipuláveis por unidade, 1,00 na referência de microlearning contra 0,05 aqui. É o modo de falha que só o capítulo comprido tem, e o gate dos cartões não o vê porque mede **altura, e não variedade**: 37 dos 39 cartões têm a mesma forma, e forma repetida não aparece em pixel. A máquina do conserto já existe na peça — o laboratório do cartão 8 com um seletor de variável de controle resolveria o cartão 20 inteiro |
| **D24** | ~~**Quase metade das siglas do livro nasce nua**~~ — **PAGA em 2026-09-04**. Eram **223 ocorrências nuas dentro de bloco interativo** contra 237 embrulhadas fora, com o `II.2` em zero `<abbr>` e quatro "AUC" sem expansão. Hoje a página inteira é embrulhada: 207 `<abbr>` viraram **470** e a conta de sigla nua nos 27 capítulos é **zero**. A medição virou a **asserção H** de `publicar/jornada.mjs` | **a hipótese desta entrada estava errada, e o conserto só apareceu ao medir**. Não era a ordem de renderização: o passe `abrirSiglas` já rodava depois de o bloco interativo virar HTML. O que o parava era `<input>` na lista de tags protegidas — elemento vazio, escrito sem barra final, subia o contador de proteção e nunca o descia, e da primeira alternativa de exercício em diante a página inteira ficava protegida. Sobram **14 ocorrências em 5 páginas** no DOM, mais **7 desenhadas em canvas** (AUC, ROC, EQM, MAE) que a asserção H nunca viu, porque ela percorre nós de texto e canvas não tem nó nenhum — medidas em 2026-09-05 pelo corpus da D28 e declaradas em `SIGLA_EM_CANVAS_DECLARADA`; total honesto, 21, escritas pelo navegador por `tema/laboratorios.js` depois da carga, declaradas em `SIGLA_NUA_PENDENTE` e cobradas nas duas direções. A isenção de sigla do gate do glossário, que se apoiava neste mecanismo, passou a ser verdadeira e a ter quem a meça |
| ~~**D25**~~ | ~~**Nenhuma figura em 39 cartões, e a convexidade é entregue como palavra**~~ — **PAGA em 2026-09-04**. O laboratório do cartão 8 ganhou um segundo painel vivo: o plano (a, b) em curvas de nível do EQM, o fundo marcado, o ponto do leitor sobre ele e o rastro de onde ele já esteve. O leitor arrasta a alça e vê o próprio ponto descer a tigela; o cartão 9 passou a chamá-la de "a tigela que você percorreu no laboratório". Sem manopla nova: o controle continua sendo a alça e os dois cursores | achado por crítico cego em 2026-09-01, comparando com o módulo de regressão linear do Google. **A conta da altura foi o que decidiu o desenho**: dois painéis empilhados num visor de 360px somavam 1.646px num cartão cujo teto é 1.600, então o painel novo foi pago com rótulo de botão mais curto, veredito de uma linha e a dica que repetia a intro — o cartão fechou em 1.563px contra 1.561 antes. A geometria é conferida sem navegador por `publicar/testes/lab-tigela.mjs`, que mede cada anel em 24 ângulos contra o erro calculado ponto a ponto. **Sobra a fraqueza declarada**: os cartões 10 a 14 continuam sem figura própria, e no modo cartão o painel mora no cartão anterior ao da frase que ele sustenta |
| **D26** | **Um gabarito que vale nota está publicado num notebook que o próprio capítulo linka** — o `e4` do `II.2` pergunta quantos panfletos rendem um copo a mais, gabarito `53 ± 4`, e a célula 12 de `ml-zero/etapa-05/regressao_limonada.ipynb` escreve *"53 panfletos por copo"*. O capítulo oferece o link em "Mão na massa", com botão de abrir no Colab: o aluno clica no que o livro lhe dá e lê a resposta | achado em 2026-09-05 por um especialista **lendo**, não por varredura. Vale registrar o contraste: o meu grep automático por gabarito dentro de `ml-zero/` devolveu 30 achados, e **29 eram ruído** — dígitos soltos como "1", "4" e "8" casam com qualquer README, e os dois candidatos distintivos (`0.92` da acurácia trivial e `0.38` do Gini) eram coincidência com um escore de modelo e um MAE. O Princípio VIII.3 protege o gabarito no cliente e não previa a rota indireta: a página não carrega a resposta, ela linka para onde a resposta está impressa. O conserto entra no replanejamento da sequência, porque o `e4` e o notebook mudam de lugar nele |
| **D27** | ~~**A escada do II.2 vira piso depois do cartão 15**~~ — **consertada em 2026-09-05 pela espiral da limonada**. O caso central do capítulo deixou de ser oito cartões de leitura e virou o mesmo painel reaberto seis vezes (cartões 21 a 26), um mecanismo novo por volta e nunca dois, que é a regra do notebook do Géron. Cinco exercícios saíram de "escolha uma" e passaram a cobrar um número que só existe depois do ajuste: as múltiplas caem de 21 para 16, as `numerica` sobem de 10 para 15 | medido com instrumento declarado (grau de produção por cartão, 1 a 5, média dos atos): a inclinação global vai de **−0,0027** para **+0,0047** por cartão, e a segunda metade deixa de pedir menos que a primeira (**2,63 → 3,09**, contra 2,71 da primeira). A primeira execução sobre o dado real sai de **68,4% e de fora da página** para **52,6%, dentro do cartão**. **O que sobra**: a subida é um platô nos cartões 21 a 26 e os cartões 27 a 38 não mudaram, então a inclinação DENTRO da segunda metade fica negativa (−0,0717) — o capítulo tem agora um pico, e não a rampa que o Géron sustenta até 98,6% do caminho. Fecha a D27 e abre a **D29** |
| **D28** | ~~**O que o navegador desenha num canvas é invisível a todos os portões que leem a fonte**~~ — **MEDIDA e cobrada em 2026-09-05**. O painel do laboratório do cartão 4 mostra `R²` na tela, e o gate de pré-requisito declarava R² apresentado no cartão 23: **19 cartões de dívida**, 50 pontos percentuais de inversão. `publicar/vocabulario-desenhado.mjs` instrumenta `CanvasRenderingContext2D.fillText` antes de o tema rodar e junta o painel escrito em runtime; o corpus guarda a impressão digital de `tema/laboratorios.js` e o portão de fonte reprova quando ela não bate | **a rota do DOM montado foi medida e recusada**: na página do `II.2` o tema desenha 16 textos distintos com `fillText` e nenhum é nó de texto, então ler o DOM fecharia esta mordida e não a primeira (as 14 siglas da D24). O manifesto declarado pelo tema foi recusado por mentir por omissão, e a prova é a própria D24, cujo número saiu só do DOM. Ligado o corpus, as inversões desenhadas do `II.2` não são uma: são **três** — `R²`, o `EAM` do mesmo painel e o **título do laboratório**, que vive no marcador `:::lab`. As três entram em `DESENHADO_PENDENTE`, medidas e não reprovando, porque o conserto é de conteúdo: ou o laboratório para de imprimir o rótulo antes da hora, ou o cartão que o hospeda passa a apresentá-lo |
| ~~**D29**~~ | ~~**A escada do II.2 virou pico, não rampa**~~ — **PAGA em 2026-09-05**. O fecho deixou de reconhecer: seis interações de "escolha uma" viraram `principio`, o `e31` do bloco histórico virou `completar`, e a **Verificação** passou a cobrar os dois números que as questões 3 e 4 sempre tiveram e ninguém produzia — a coluna quase idêntica que reparte o coeficiente da `temperatura` entre dois nomes sem mexer no $R^2$, e o $S_{xx}$ que dá zero no `preco` dentro de qualquer mês. As duas células novas vivem na seção 8 do `regressao_limonada.ipynb`, com `# TODO`, e o valor que vem pronto **não** é o que o exercício pede | medido pelo instrumento que agora é arquivo, `publicar/grau-de-producao.mjs`: a inclinação DENTRO dos cartões 27 a 38 vai de **−0,0017 para +0,0903** por cartão, a média do fecho de **2,13 para 3,01**, e o menor grau dele de **1,00 para 2,50**. O último cartão no grau máximo sai de **68,4% para 100%** do caminho e o último ato de grau 5 de 71,1% para 100%, contra a régua de 98,6% do notebook do Géron. **A medição anterior não bate com esta, e a divergência fica registrada**: a D29 declarou 3,95 na espiral, 2,67 no fecho e −0,0717 de inclinação; a mesma régua reconstruída dá 4,45, 2,13 e −0,0017. O diagnóstico é o mesmo e não depende de qual contagem vence. `publicar/testes/grau-de-producao.mjs` afirma a rampa, o piso de reconhecimento e a existência das células no notebook, e foi visto acusando as quatro quebras deliberadas |
| **D30** | **A escada da prática já é portão, e ele nasceu vermelho no capítulo que a ADR 0023 reordenou** — `publicar/gates/escada.mjs` cobra a régua da ADR 0014 (E1 dois degraus abaixo do verbo, E2 um abaixo, E3 no verbo) e acusa quatro coisas: teto não atingido, teto ultrapassado, queda de mais de um degrau dentro do nível e platô acima de quatro cartões. Três dívidas ficam declaradas: o **platô de cinco** na abertura do `II.2` (era seis antes da reordenação), **22 exercícios `aberta` em 15 capítulos** sob objetivo com verbo abaixo de Avaliar, e **4 objetivos** cujo trio nunca chega a E3 | a regra da `aberta` está ratificada desde 2026-08-13 na ADR 0014 e nunca teve quem a cobrasse; 22 de 50 abertas do livro a violam. O que o portão **não** alcança está escrito nele: `dificuldade` é relativa ao objetivo, então um `multipla` rotulado `dificil` sob um verbo que diz "derivar" passa sem fazer ninguém derivar nada. É o defeito D1 do especialista 2, e continua sendo revisão humana. Fora do alcance também: **29 objetivos** abrem com verbo que não está na tabela de Bloom do Guia Editorial §2.5, e a regra do teto não os ranqueia |

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
