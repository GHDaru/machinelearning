# Histórico — o livro vivo

> Este livro declara sua própria data de validade. Aqui ficam as **edições datadas**, o **snapshot por capítulo** e o **registro de expiração** — o placar das previsões que o livro fez, pontuadas contra a realidade.
>
> Toda edição registra também a **versão do modelo de IA** usada. Saídas de modelo de linguagem são não-determinísticas; sem esse registro, o resultado não é reproduzível nem auditável (Princípio IV).


## Edição 2.1 (em curso) — 2026-09-05 · a sequência do `II.2`, e o portão do pré-requisito

Implementa a [ADR 0023](../adr/0023-a-sequencia-do-ii-2-carga-cognitiva-e-a-escada.md). Modelo de IA usado: Claude Opus 5.

**O que mudou no `II.2`.** A ordem, não o contrato: os 39 cartões viram **38**, em oito níveis, com o laboratório da reta antes da definição do erro quadrático médio, quatro cartões novos entre os degraus que faltavam, os sete cartões de história comprimidos em três, e o notebook da limonada movido de 94,9% do caminho para 71% — dentro da classe que ele fecha, com o ciclo de alterar, rodar e colar o resultado de volta.

**Os dois números que o ciclo moveu.** Inversões de pré-requisito entre os conceitos medidos: **5 → 0**. Correlação de postos entre posição do cartão e dificuldade declarada: **0,173 → 0,437**, com todas as sete quedas restantes em fronteira de nível.

**O portão novo.** `publicar/gates/pre-requisito.mjs` cobra a regra que faltava e que nenhum outro portão conseguia ver: a AUC era usada em quatro lugares do capítulo e definida em nenhum, passando limpo pelo gate de glossário, que confere que o termo é *ligado* e não que foi *apresentado*, e pelo de exercícios, que confere que o objetivo *existe* e não que ele *corresponde*. Ele foi visto acusando as seis inversões reintroduzidas uma a uma.

**A espiral da limonada (D27), 2026-09-05.** A ordem consertada não consertou a *exigência*: um crítico cego mediu a escada contra o notebook do capítulo 10 do Géron e achou que, depois do cartão 15, ela vira piso. O instrumento é declarado: grau de produção pedido por cartão, de 1 (escolher entre alternativas) a 5 (manipular e ler um resultado que muda), tomando a média dos atos do cartão. Por ele, a inclinação era **−0,0027 por cartão**, com 2,71 de média na primeira metade e 2,63 na segunda. O mesmo instrumento nas 210 células do notebook dá **+0,0024**, com o ciclo fechado 32 vezes entre 7,1% e 98,6% do caminho.

O conserto copia o mecanismo do Géron, não o formato: o caso da limonada, que era gasto em oito cartões de leitura, passa a ser **o mesmo painel reaberto seis vezes**, nos cartões 21 a 26, com **um mecanismo novo por volta e nunca dois**. O leitor ajusta `vendas ~ preco` sozinho e lê +47,0; marca `temperatura` e vê o coeficiente cair para 1,64 sem morrer; acrescenta as outras duas colunas e vê o R² parar em 0,982 enquanto o preço **sobe** para 2,41; marca a coluna `alta_temporada` e recebe uma recusa, porque `preco` = 0,30 + 0,20 × ela, dia a dia; mexe no corte de treino e vê a recomendação de panfletagem andar dez panfletos com o R² melhorando; recorta um mês e recebe o aviso do passo 5 da dedução, com a coluna constante nomeada.

**Os números que isso moveu.** Exercícios de "escolha uma": 21 → 16, e `numerica` 10 → 15. A primeira execução sobre o dado real sai de 68,4% do caminho e de fora da página (o link do Colab) para **52,6%, dentro do cartão**. A inclinação global vai de −0,0027 para **+0,0047**, e a segunda metade deixa de pedir menos que a primeira: 2,63 → 3,09.

**A dívida que o conserto deixa, e ela é nova.** A subida é um pico, não uma rampa: os cartões 27 a 38 não mudaram, e a inclinação medida *dentro* da segunda metade fica negativa. Entra como **D29** no roadmap, com o número.

**A rampa do fecho (D29), 2026-09-05.** O instrumento da espiral deixou de ser um cálculo de sessão e virou arquivo: `publicar/grau-de-producao.mjs`, com a escala declarada em código (1 escolher entre alternativas · 2 lembrar um termo · 3 completar uma conta cujos dados estão no enunciado · 4 escrever um argumento próprio · 5 manipular um artefato que roda). Remedido por ele, o defeito é maior do que a D29 registrou: os cartões 27 a 38 valiam 2,13 contra 4,45 da espiral, e quatro deles estavam em **1,00**, que é reconhecimento puro.

O conserto tem três movimentos e nenhum deles é outra espiral. Seis interações de "escolha uma" viraram `principio`, o tipo que o capítulo já usa quando quer o argumento escrito. O `e31`, no bloco histórico, que não comporta notebook, saiu de quatro alternativas para um `completar`. E a **Verificação** virou a volta executável que faltava: as questões 3 e 4 sempre tiveram resposta em número e ninguém a produzia, então a seção 8 do notebook da limonada ganhou duas células com `# TODO` — a coluna quase idêntica, que reparte o coeficiente da temperatura entre dois nomes sem mexer no $R^2$, e o $S_{xx}$ por coluna dentro de um mês, que devolve zero no `preco` e responde à questão 4 pela fórmula.

**Os números.** Inclinação dentro dos cartões 27 a 38: **−0,0017 → +0,0903** por cartão. Média do fecho: 2,13 → 3,01. Inclinação global: −0,0034 → +0,0298. O último cartão no grau máximo sai de **68,4% para 100%** do caminho, e o último ato de grau 5 sai de 71,1% para 100%; a régua do Géron vai a 98,6%. O ρ da escada sobe de 0,451 para 0,497.

**O que sobra.** O cartão 38 fechou a 1.571px num teto de 1.600, e a folga de altura do capítulo continua sendo o que limita o desenho: não cabe mais um ato em nenhum cartão do fecho, exceto no 29. A rampa é medida por cartão, e dentro do fecho ela ainda tem dentes, com o cartão 33 acima dos dois seguintes.

**Uma correção de registro que o ciclo obrigou.** Sete exercícios do bloco histórico declaravam o objetivo `O1`, "derivar a regressão linear como minimização", e cobravam disciplina de proveniência. Agora existe um `O5` declarado, e `O1` ganhou o exercício que faltava: derivar a reta sem intercepto, cujo engano previsível é aplicar a fórmula decorada do modelo que tem intercepto.

## Edição 2.0 — 2026-08-13 · a v0 completa: exercícios, provas, procedências e as 22 animações

Fecha o **ciclo 009**, e fecha as quatro colunas que ele abriu para os 29 capítulos: voz, exercícios, prova e **fontes**. Modelo de IA usado: Claude Opus 5.

**Os números.** 412 exercícios (342 de capítulo, três por objetivo em escada, mais 70 distribuídos em sete provas), 25 laboratórios, 48 páginas. Nenhuma prova vale nota, por decisão do [ADR 0014](../adr/0014-tres-exercicios-por-objetivo-e-a-prova.md): pontua-se por ter feito.

**A coluna `fontes` foi a que mais rendeu, e o que ela rendeu não foi conforto.** Vinte e oito capítulos conferidos um a um, abrindo cada fonte da tabela de selos. A maioria devolveu achado. Alguns exemplos do que estava publicado e não se sustentava:

- o livro dizia que Power **entrevistou** o autor do estudo de "cerveja e fraldas". Ele não entrevistou ninguém: viu a gravação de um webcast da Teradata e recebeu a transcrição por e-mail da moderadora, da própria Teradata. Num capítulo sobre separar correlação achada de decisão tomada e de efeito medido;
- "de Thorndike a Watkins são cerca de 80 anos" — são **91**, e o número errado tinha sido copiado para outros três capítulos;
- o memorando de 1966 do "verão da visão" abriu (é digitalização sem camada de texto; as páginas foram lidas como imagem) e desmentiu o capítulo que o cita: o papel diz "Vision Memo. No. 100.", fala em *"our summer workers"* no plural, e escalona os objetivos.

**As 22 animações do [ADR 0015](../adr/0015-animacao-e-laboratorio-sem-manopla.md) ficaram prontas**, cada uma com um teste que roda o `laboratorios.js` real e confere o número que o texto promete. **Cinco delas corrigiram o texto que as hospeda ou a própria spec** — o exercício do eixo truncado dizia onze vezes e são doze; a spec do gradiente previa 1e-7 e a medição deu 1,4e-12; a spec da memória repetia o folclore dos "onze passos" e a medição deu 95. **Quatro tiveram o desenho experimental refeito** depois de a primeira versão medir a coisa errada.

**Um gate novo, nascido de um erro que se repetiu quatro vezes.** `publicar/intervalos.mjs` guarda os dois anos de cada intervalo histórico e calcula a diferença; qualquer menção em prosa que discorde da subtração quebra o build. Visto falhando antes de entrar.

**A regra que este ciclo deixa escrita, e que vale além do livro:** *número em spec é hipótese, não resultado*. Das 22 animações, nenhuma saiu exatamente como planejada, e as que mais mudaram foram as que ensinaram mais.

## Edição 1.2 — 2026-08-12 · a auditoria de Bloom, e as portas que ninguém tinha conferido

Edição inteiramente de **conserto e cobrança**: nenhum capítulo novo, e o livro melhorou mais do que em edições que ganharam capítulo. O disparador foi uma auditoria pedagógica que mediu os objetivos declarados contra o que o livro de fato cobra.

**A numeração mudou** ([ADR 0011](../adr/0011-numeracao-por-parte.md)). O capítulo passou a ser identificado por parte e posição (`II.2 — Modelos Lineares`) porque nenhuma das 29 posições coincidia com o número de criação. E o **id do exercício se desatou do número** (`05-e1` → `modelos-lineares-e1`): fosse pelo número, inserir um capítulo apagaria o progresso de cada aluno nos capítulos seguintes, para sempre. Endereços antigos quebraram, por decisão explícita.

**Os gates que passaram a cobrar.** A dívida deixou de ser *registrada* e passou a ser *cobrada* — cada gate nasceu de um defeito real, e cada um foi **visto falhando** antes de ser dado por pronto:

- seções obrigatórias e verbos vagos nos objetivos;
- âncora do `volte para` que não existe — duas estavam quebradas, uma há semanas;
- **Backward Design nas duas direções.** Antes, exercício apontando para objetivo inexistente quebrava o build, e objetivo sem exercício não quebrava nada; foi por essa porta que 18 dívidas entraram sem registro. A lista de exceções agora falha **também** quando uma exceção deixa de ser necessária: dívida paga que continua na lista esconde a próxima;
- gabarito vazando na exportação, e rubrica partida por `;` — os dois achados abaixo.

**O que o uso derrubou desta vez** — de novo, sem nenhum gate mecânico acusando:

1. **O botão "⬇ md" entregava o gabarito.** O livro protege o HTML com cuidado (a página nunca carrega a resposta certa) e servia, ao lado do exercício, um download com **79 gabaritos e 30 rubricas**. A superfície protegida era uma das duas.
2. **Uma rubrica de três alternativas virava três exigências.** A rubrica é quebrada em `;`, então `"aponta um mecanismo (A; B; C)"` produzia três critérios — e, como a correção exige *todos*, quem respondesse exatamente o que foi pedido reprovava. Já estava publicado.

**No conteúdo**

- Exercícios: **96 → 122**. Dezoito cobrem objetivos que o livro declarava e não cobrava — a dívida caiu de 20 para **2**, e os dois que restam não são falta de exercício: são objetivos declarados em capítulos que não os ensinam.
- **Exemplos numéricos trabalhados** entraram no corpo de quatro capítulos — antes existiam só dentro dos gabaritos, isto é, só para quem já tinha errado.
- **Três laboratórios**: neurônio de McCulloch–Pitts, mínimos quadrados à mão, e exploração de variável sobre o conjunto da limonada.
- A seção `## Verificação` começou a virar superfície corrigida, uma pergunta por capítulo ([ADR 0012](../adr/0012-verificacao-como-superficie-corrigida.md)), com rubrica de quatro critérios — o quarto sendo o **anti-critério**, o erro comum nomeado. As perguntas que ficam sem correção passaram a **dizer por que**.

**Modelo de IA usado nesta edição:** Claude (Anthropic), em sessão conduzida pelo autor, com três pareceres independentes encomendados para a decisão do ADR 0012.

> **A lição da edição.** A de 1.1 dizia: *saída tecnicamente válida, comportamento errado*. Esta acrescenta a variante mais cara — **a promessa cumprida numa superfície e falsa na outra**. O livro tinha uma regra explícita ("a página nunca carrega a resposta certa"), implementou-a corretamente, e a desmentiu num botão ao lado. Gate não confere intenção: confere porta. E porta que ninguém listou, ninguém confere.

## Edição 1.1 — 2026-08-11 · o livro em uso, e o que o uso quebrou

Primeira edição publicada **enquanto uma turma usa o livro**. Quase tudo aqui nasceu de pedido do autor em preparação de aula, e três achados vieram de **usar** em vez de revisar.

**No conteúdo**

- **Capítulo 05** ganhou o laboratório `modelos-lineares-l1` (mínimos quadrados à mão, com os quadrados do erro desenhados) e a seção **"A dedução, em cinco passos"**, do critério às equações normais.
- **Capítulo 28 — Regressão Logística** nasceu, separado do 05 ([ADR 0009](../adr/0009-separar-linear-e-logistica.md)). Antes eram 30 linhas; agora tem história com selos, a dedução de por que a solução fechada some, e três exercícios.
- **O caso da limonada** entrou no capítulo 05, com o conjunto de 365 dias que o autor trouxe da disciplina. Ele demonstra, com número, que **controlar por uma variável não desfaz confundimento** quando o confundidor não foi medido direito.
- **Notebooks** em cinco etapas do `ml-zero`, executáveis na máquina do aluno e no Colab.
- Exercícios: **91 → 96**.

**O que o uso derrubou, e nenhum gate pegava**

1. **Uma frase minha estava errada.** O capítulo 05 mandava "refazer o ajuste só com julho e agosto, onde o preço varia sem a estação variar junto". Não varia: **nenhum mês do ano tem mais de um preço**. Descoberto ao escrever a célula do notebook que faria isso. A correção deixou a lição mais forte — o confundimento é perfeito, e a resposta honesta passou a ser *"com estes dados não dá"*.
2. **O banner de consentimento estava quebrado em todas as páginas** desde sempre: uma variável `tx` sombreava a função `tx()` de tradução. Como a telemetria de navegação exige consentimento, **nenhum registro jamais foi gravado**. Build verde, testes verdes, links certos — só apareceu ao dirigir a página num navegador de verdade.
3. **O `og:image` apontava para o endereço prestes a ser aposentado.** Toda partilha em rede social viraria um retângulo vazio depois da migração, sem que nada acusasse.

**Na infraestrutura**

- O livro saiu do GitHub Pages para **domínio próprio**, com backend vivo: os **96 exercícios corrigem no servidor**, com revelação progressiva. ADRs [0006](../adr/0006-publicacao-vercel-railway-dominio.md) e [0007](../adr/0007-builder-declarado-na-railway.md).
- **Identificação por turma** ([ADR 0008](../adr/0008-identificacao-por-turma.md)): o anonimato segue sendo o padrão, e o aluno pode optar por sair dele com um comando no chat.

**Modelo de IA usado nesta edição:** Claude (Anthropic), em sessão conduzida pelo autor.

> **A lição da edição.** As três falhas acima têm a mesma forma: **saída tecnicamente válida, comportamento errado**. Nenhum gate mecânico as pegaria, porque nenhum gate olha para o que o leitor vê. O que as achou foi *usar* — escrever o notebook, abrir o navegador, ler o HTML publicado.

## Edições

### Edição 1.0 — 2026-08-10 · A primeira versão completa (spec 006)

**Os 28 capítulos existem, e nenhum finge ser mais do que é.**

O livro saiu de 8 capítulos com corpo para **28, todos no nível `essencial`** e todos dizendo isso ao leitor no próprio cabeçalho. Os exercícios foram de 31 para **91**. As duas disciplinas que o autor ministra têm material em todos os tópicos da ementa.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-10.

**O que mudou de método, e é o que importa.** A emenda 1.2.0 criou o **Princípio X** (nenhum método cai do céu), e a 1.3.0 acrescentou o selo `✓ᵃ`. Mas a decisão que mais mudou o resultado foi mecânica: **o gate no build**. Um capítulo de método em nível `essencial` sem a seção histórica e sem tabela de selos não compila, e o alfabeto de selos é lido da própria constituição, falhando em qualquer símbolo desconhecido.

O gate reordenou o plano sozinho. O [ADR 0004](../adr/0004-escopo-da-primeira-versao.md) mandava escrever os capítulos novos antes de consertar os antigos; declarar o nível dos capítulos com corpo deixou o build vermelho na hora, e nada novo pôde ser publicado antes de a dívida velha ser paga. **É a diferença entre dívida registrada e dívida cobrada.**

**A pesquisa histórica em sessão única pagou o que prometia.** Cinco passadas produziram ligações que a pesquisa capítulo a capítulo teria perdido — e uma delas reescreveu a tese central. O livro vinha dizendo "crédito segue comunicação"; o k-means corrigiu para **crédito segue o vocabulário**. Com seis pretendentes em quatro campos que não conversavam, e o nome cunhado por MacQueen para um algoritmo diferente, não vence quem descobre nem quem publica: vence quem **nomeia**.

O caso do MLOps fechou o argumento pelo extremo oposto — ali o campo não tinha um autor para o nome e **fabricou um retroativamente**.

**Três lendas foram testadas com instrução de não forçá-las a fechar. As três quebraram.** "Cerveja e fraldas" é verdadeira até a descoberta e inventada a partir da ação. A origem do nome *dynamic programming* tem citação autêntica de Bellman e cronologia impossível. E "MLOps foi cunhado por Sculley *et al.*" caiu por **verificação negativa no texto primário** — a palavra não aparece uma vez sequer.

**A auditoria adversarial reprovou o livro, e foi o melhor dinheiro gasto.** Em contexto fresco, com instrução de *derrubar* em vez de revisar, ela achou seis defeitos altos que nenhum gate pegaria: um **prenome inventado**, duas seções sem lastro na nota de pesquisa, um selo inflado, três capítulos reivindicando "o maior intervalo do livro", um erro de data e uma seção narrando como fato o que a tabela marcava como dúvida. Todos corrigidos; o [relatório](../estudos/2026-08-10-auditoria-adversarial.md) fica registrado. **Pedir "revise" produz elogio; pedir "tente derrubar" produz achado.**

**A dívida que fica, declarada.** A maior é a **D10**: em vários capítulos, uma fonte selada `✓ᵐ` sustenta no corpo uma afirmação sobre o que a obra argumenta por dentro. Havia duas saídas — ler as fontes, ou pôr hedge em cada frase. A escolha registrada é **ler**, no ciclo de aprofundamento, porque hedge mascara o problema com linguagem. A fila de verificação das notas de pesquisa, ordenada por dúvida fechada por unidade de esforço, é o plano de pagamento.

**O que esta edição deliberadamente não fez:** nenhum capítulo foi promovido a `completo`; nenhum experimento próprio novo entrou no `ml-zero`; e o backend continua sem publicar, o que mantém os exercícios dormentes e os laboratórios funcionando.


### Edição 0.6 — 2026-08-10 · Emenda 1.2.0: nenhum método cai do céu

Uma emenda à constituição, e a mais consequente até aqui para *como os capítulos são escritos*.

**O novo Princípio X.** Todo método deste livro foi inventado por **alguém**, preso num problema concreto, numa data, com meios limitados. Um capítulo que dá o método sem essa história entrega um procedimento — e procedimento se decora. Passa a ser obrigatória, em todo capítulo de método a partir do nível `essencial`, a seção **"De onde isto veio"**: o aperto · o que se fazia antes · a virada · a ideia reaproveitável · o nome.

O quarto elemento é o que justifica a seção. **Todo artifício técnico declara a ideia reaproveitável que há por trás dele** — artifício sem ideia é truque, e truque não se transfere. Quem sabe *que problema forçou o método a existir* reconhece o mesmo tipo de aperto anos depois, noutro contexto; quem só executa o procedimento tem uma habilidade que expira com a prova.

**Selos de proveniência por afirmação histórica** (✓ · ✓ᵐ · ⏳ · ❌ · 📖). História é o terreno mais fácil do livro para inventar, porque **história inventada soa bem** — uma data errada e uma atribuição plausível passam por qualquer revisão apressada. Inventar história é pior do que omiti-la, justamente porque convence.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-10.

**De onde veio a distinção ✓ / ✓ᵐ.** Ela não é preciosismo de escrivão: nasceu de um caso desta obra, três dias atrás. Ao conferir o DOI do neocognitron para o capítulo 18, o registro do Crossref devolveu **1980** — e o capítulo dizia 1979. O DOI provava que o artigo existe, quem assina e quando saiu; não provava nada sobre o que ele afirma por dentro. São duas perguntas diferentes, e um selo só não distinguia as duas. Agora conferir identificador dá **✓ᵐ**; ✓ exige ter aberto o texto.

**Uma dívida criada de propósito.** A emenda torna 8 capítulos não-conformes no instante em que é ratificada — nenhum dos que têm corpo traz a seção, porque todos são anteriores a ela. Isso está registrado como **D8** no roadmap, com o retrofit em **C8**, e nenhum deles sobe de nível sem pagá-la. Emendar a lei e declarar retroativamente que tudo já estava conforme seria o oposto do que o princípio pede.

### Edição 0.5.1 — 2026-08-08 · O capítulo 18 ganha história, imagem e código executável (sem spec)

Uma rodada curta e inteira dedicada a um capítulo só (o 18), a pedido de quem dá a aula. Nada de escopo novo: profundidade no que já existia.

**O que entrou:**

- **Histórico com as fontes reais.** A linha do tempo 1943–1986 deixou de citar de memória: cada marco leva DOI ou link verificável. McCulloch & Pitts ([doi:10.1007/BF02478259](https://doi.org/10.1007/BF02478259)), Rosenblatt ([doi:10.1037/h0042519](https://doi.org/10.1037/h0042519)), Fukushima ([doi:10.1007/BF00344251](https://doi.org/10.1007/BF00344251)), Rumelhart–Hinton–Williams ([doi:10.1038/323533a0](https://doi.org/10.1038/323533a0)).
- **A imagem do neurônio.** Diagrama próprio (SVG, tema claro/escuro, descrito para leitor de tela): entradas → pesos → soma → comparação com o limiar → saída.
- **Duas notas de contexto.** *Quando a IA ainda não se chamava assim*: o relatório de Turing de 1948, o artigo na *Mind* de 1950 e a proposta de Dartmouth de **31 de agosto de 1955**, que cunhou o termo. E a nota sobre **a prioridade do backpropagation**.
- **Código para baixar e rodar.** `ml-zero/etapa-18/neuronio.py` e um caderno pronto para o Colab. O `NeuronioMP` **não tem `fit`** — a ausência é o conteúdo: em 1943 não havia aprendizado. O `Perceptron`, ao lado, tem.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-08.

**A nota que não fechou, e por que ela ficou assim.** O pedido incluía checar uma lembrança: que o backpropagation teria sido desenvolvido por *um italiano, em 1979*. A busca não confirmou.

O que existe, e está no capítulo com fonte: **Seppo Linnainmaa** (finlandês, 1970) publicou o modo reverso da diferenciação automática — a matemática do algoritmo; **Paul Werbos** (americano) o aplicou a redes na tese de 1974, com publicações no fim dos anos 1970; **Kunihiko Fukushima** (japonês) publicou o Neocognitron em 1979. Nenhum italiano apareceu.

O capítulo diz exatamente isso, inclusive que não achamos, porque inventar uma atribuição plausível é o erro que o Princípio I existe para impedir. Se a lembrança tiver fonte, ela entra e esta nota é corrigida.

**Uma dívida de processo desta edição.** Ela foi feita a pedido direto, sem passar pelo ciclo `spec → plan → tasks` que o Princípio VII exige para a raia plena — um capítulo revisado, código novo e um blueprint de deploy não são raia leve. A versão original deste registro dizia "spec 006", uma spec que nunca existiu; a correção está aqui em vez de apagada, porque um livro que mantém placar das próprias previsões não pode maquiar o próprio histórico.

**O que o `NeuronioMP` sem `fit` ensina.** Um estudante que baixa o arquivo procura o método de treino e não encontra. Essa frustração de trinta segundos ensina o recorte histórico melhor que o parágrafo que o antecede: o modelo de 1943 é um circuito, não um aprendiz. Rosenblatt levou **quinze anos** para dar-lhe uma regra de aprendizado, e ela está no arquivo ao lado, para comparação direta.

### Edição 0.5 — 2026-08-08 · Novo escopo: três disciplinas, trilhas e o primeiro laboratório (spec 005)

A mudança mais profunda desde a fundação. O livro deixou de ser sobre Machine Learning e passou a ser **Ciência de Dados e Aprendizado de Máquina**, para servir a três disciplinas reais de Engenharia de Software.

**O que entrou:**

- **Novo escopo e novo título.** De 18 para **28 capítulos**, em cinco partes: Ciência de Dados, Análise Preditiva, Redes e Deep Learning, Além do Supervisionado, e No Mundo Real.
- **Trilhas de disciplina.** Três páginas que ordenam os capítulos por curso, mapeadas unidade a unidade das ementas. O número do capítulo virou **identificador estável**; a ordem vive nas trilhas. É isso que permite um capítulo servir a duas disciplinas com pesos diferentes.
- **Capítulo 18 — O Neurônio Artificial**, nível `essencial`: McCulloch–Pitts, o perceptron, o inverno da IA, e o XOR.
- **Laboratórios interativos** — a terceira superfície do livro. O primeiro é o neurônio de McCulloch–Pitts: o estudante põe os pesos à mão, vê a reta de decisão se mover sobre a tabela-verdade, e **descobre sozinho** que o XOR é impossível.
- **Nove capítulos-esqueleto novos** cobrindo o que faltava das ementas: ciclo CRISP-DM, coleta e integração, análise exploratória, visualização e storytelling, análise multidimensional, séries temporais, do modelo à decisão, treinar redes profundas, e IA simbólica/fuzzy/evolutiva.
- **Constituição emendada para 1.1.0**: níveis de maturidade (`esqueleto` / `essencial` / `completo`), laboratório reconhecido como mídia, e o portão de exercícios passando a valer na promoção a `completo`.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-08.

**A decisão de método.** Servir a disciplinas em curso exige **cobertura antes de profundidade** — e cobertura sem rigor é o que este projeto recusa. A conciliação foi declarar o nível de cada capítulo **ao leitor**, no próprio cabeçalho. Baixar o rigor em silêncio seria fraude; declarar cria a dívida visível que o roadmap cobra.

**Por que o laboratório importa.** O XOR é o caso em que o formato se justifica sozinho: nenhuma frase entrega o que travar em 3 de 4 entrega. O leitor tenta, tenta de novo, e **descobre** a impossibilidade — que é exatamente como Minsky e Papert a apresentaram em 1969. E, por rodar no navegador, o laboratório funciona mesmo com o backend fora do ar: é a superfície mais robusta do livro.

### Edição 0.4 — 2026-08-05 · Lineares e otimização: três achados que vieram de testes que falharam (spec 004)

**O que entrou:**

- **Capítulo 05 — Modelos Lineares** (3 exercícios, 1 vídeo): erro quadrático por conveniência e não por virtude, o logito como o que de fato é linear, as quatro coisas que um coeficiente **não** diz, e quando o linear é a escolha certa, reparando a impressão que o capítulo 07 deixa.
- **Capítulo 06 — Otimização e Regularização** (4 exercícios, 1 vídeo): gradiente como procedimento, diagnóstico pela curva de perda, L1 × L2 explicado pelo gradiente da penalidade, e early stopping.
- **Etapa 05–06 do `ml-zero`**: `Padronizador`, `RegressaoLinear` com solução fechada **e** gradiente, `RegressaoLogistica` com L1/L2, e o otimizador isolado do modelo. 22 testes.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-05.

**Os três achados.** Todos vieram de testes que falharam, e todos entraram no texto porque são úteis ao leitor:

1. **Perda logística é limitada.** Taxa 500 na logística **não** diverge — satura. Erro quadrático a taxa 50 explode. "Não explodiu" não prova que a taxa está boa.
2. **Early stopping monitorando treino nunca dispara em dado separável**, porque a perda de treino cai indefinidamente. O critério precisa observar validação — e a primeira versão da nossa implementação estava errada.
3. **Um instrumento de diagnóstico pressupõe que o problema exista.** Testar early stopping em dado limpo e separável não valida nada: não há ponto a partir do qual ajustar mais piore.

**Decisão registrada:** NumPy foi **adiado** para a etapa 09. O plano da spec 001 o previa a partir da 05; biblioteca padrão bastou, e adicionar dependência sem que o algoritmo exija é a estrutura antecipada que a regra 2 da construção proíbe.

### Edição 0.3 — 2026-08-05 · Árvores e ensembles: o que bagging e boosting realmente atacam (spec 003)

**O que entrou:**

- **Capítulo 07 — Árvores e Ensembles**, com 5 exercícios e 1 vídeo: como a árvore escolhe cada corte, por que uma árvore sozinha tem variância alta, a distinção entre bagging (variância) e boosting (viés), a ordem de ajuste de hiperparâmetros que economiza tempo, e a evidência sobre tabular × deep learning.
- **Etapa 07 do `ml-zero`**: `Arvore` (Gini + MSE), `Floresta`, `Boosting` e `auc` por postos, em ~250 linhas de biblioteca padrão. Mais `linear.py` como régua declarada. 21 testes.
- **Breiman (2001)** e **Grinsztajn, Oyallon & Varoquaux (2022)** conferidos e promovidos a ✓.
- **Nota de estudo** sobre a medição que mudou o desenho do experimento.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-05.

**O achado do caminho.** A primeira versão do experimento reusou o dado da etapa 00 e os quatro modelos terminaram empilhados entre 0,55 e 0,57 de AUC. Em vez de mexer no código, medimos o teto: o classificador de Bayes daquele dado alcança **0,5895** — o boosting já estava em 96% do máximo possível. Os modelos estavam certos; o instrumento é que não media. A etapa 07 passou a gerar o próprio dado, e a etapa 00 **não foi tocada** — sua lição depende daquele dado e já está publicada.

**Nota de honestidade.** O dado da etapa 07 foi construído com uma regra que favorece árvores por construção, e o capítulo diz isso em destaque, antes de qualquer número. A ilustração mostra o mecanismo; a evidência de que dado tabular real tem essa forma é do paper, não nossa.

### Edição 0.2 — 2026-08-05 · Dados: o vazamento e as divisões que respeitam a estrutura (spec 002)

O primeiro capítulo de conteúdo depois da fundação, e não por acaso: **vazamento de dados é o erro mais caro e mais silencioso de Machine Learning**.

**O que entrou:**

- **Capítulo 02 — Dados**, no esqueleto v4: as três fontes de vazamento (alvo disfarçado, pré-processamento antes da divisão, duplicata entre conjuntos), a divisão que respeita tempo e grupo, a ficha de dataset em sete perguntas e o viés de seleção. 4 exercícios e 1 vídeo.
- **Etapa 02 do `ml-zero`**: detector de vazamento com dois sinais independentes, divisão por grupo, divisão por tempo com intervalo de guarda, checagem de duplicatas e a `FichaDeDataset` como **portão executável** — o pipeline recusa dataset com ficha incompleta ou com dado pessoal declarado. 28 testes.
- **Carregador de módulos por etapa** (`ml-zero/tests/conftest.py`): etapas autocontidas têm arquivos homônimos, e `sys.path` cru fazia a primeira importação vencer silenciosamente.
- **Gebru et al. (2021)** conferido na fonte e promovido a ✓.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-05.

**Nota de método:** a lição central do capítulo ("embaralhar por linha vaza o sujeito") é uma **asserção executável** na suíte de testes, não apenas uma frase no texto. É o Princípio II levado ao limite: o argumento do livro falha o build se deixar de ser verdade.

### Edição 0.1 — 2026-08-01 · Fundação: maquinaria, estrutura e a camada interativa (spec 001)

O repositório nasce com a máquina inteira funcionando e o conteúdo em construção — deliberadamente nessa ordem, para que nenhum capítulo seja escrito fora do formato que o livro exige de si mesmo.

**O que entrou:**

- **Governança** — constituição de 9 princípios, fundindo a didática e o ciclo spec-driven do livro de Engenharia de Harness com o processo de desenvolvimento do Maestro (raias, DoD verificável, skills-primeiro, ADR, gate de CHANGELOG).
- **Estrutura do livro** — 18 capítulos em 3 partes, mais o aparato. Todos com objetivos de aprendizagem declarados (Backward Design: os objetivos vêm antes do corpo).
- **Capítulos escritos** — `00 Introdução`, `01 Fundamentos` e `04 Avaliação` (o piloto do esqueleto v4). Os demais são esqueletos com objetivos e problema definidos.
- **Camada interativa** — exercícios em 5 tipos (múltipla, múltipla-multi, numérica, completar, aberta por rubrica) corrigidos **no servidor**, com feedback explicativo e revelação de gabarito só na 2ª tentativa; vídeos curados com player de fachada (nada é pedido a terceiros antes do clique).
- **Backend** — tutor com busca no texto do livro, correção de exercícios, progresso anônimo e telemetria consentida. 23 testes verdes.
- **Motor de publicação** — Markdown → site navegável, com gate de links internos e gate do banco de exercícios.

**Modelo de IA usado:** Claude (Anthropic), via Claude Code, sessão de 2026-08-01. Autoria, curadoria e responsabilidade humanas — ver [Autor](autor.md).

**O que ficou de fora, e por quê:** os 15 capítulos-esqueleto não têm corpo, exercícios nem vídeos. Escrevê-los agora, fora do ciclo spec-driven, violaria o Princípio VII — cada um entra por sua própria spec, com sua rodada de pesquisa verificada. A bibliografia reflete isso: 5 referências ✓ e as demais ⏳, honestamente marcadas.

## Snapshot por capítulo

> **Níveis** (constituição 1.1.0): `esqueleto` = objetivos e problema · `essencial` = corpo ensinável e prática · `completo` = o portão dos sete itens.
>
> Os capítulos 19–27, criados na edição 0.5, estão todos em `esqueleto`. O 18 está em `essencial`.

| Capítulo | Estado | Captura | Exercícios | Vídeos |
|---|---|---|---|---|
| 00 — Introdução | completo | 2026-08 | 3 | 1 |
| 01 — Fundamentos | completo | 2026-08 | 3 | 1 |
| 02 — Qualidade e Vazamento | completo | 2026-08 | 4 | 1 |
| 03 — Representação | esqueleto | — | 0 | 0 |
| 04 — Avaliação | completo (piloto v4) | 2026-08 | 5 | 1 |
| 05 — Modelos Lineares | completo | 2026-08 | 3 | 1 |
| 06 — Otimização | completo | 2026-08 | 4 | 1 |
| 07 — Árvores e Ensembles | completo | 2026-08 | 5 | 1 |
| 08 — Não Supervisionado | esqueleto | — | 0 | 0 |
| 09 — Redes Neurais | esqueleto | — | 0 | 0 |
| 10 — Visão | esqueleto | — | 0 | 0 |
| 11 — Sequências e Linguagem | esqueleto | — | 0 | 0 |
| 12 — Modelos de Fundação | esqueleto | — | 0 | 0 |
| 13 — Reforço | esqueleto | — | 0 | 0 |
| 14 — Interpretabilidade e Justiça | esqueleto | — | 0 | 0 |
| 15 — Sistemas de ML | esqueleto | — | 0 | 0 |
| 16 — MLOps | esqueleto | — | 0 | 0 |
| 17 — Fronteira | esqueleto | — | 0 | 0 |
| **18 — O Neurônio Artificial** | **essencial** | 2026-08 | 4 | 1 laboratório |
| 19 — Ciclo da Ciência de Dados | esqueleto | — | 0 | 0 |
| 20 — Coleta e Integração | esqueleto | — | 0 | 0 |
| 21 — Análise Exploratória | esqueleto | — | 0 | 0 |
| 22 — Visualização e Storytelling | esqueleto | — | 0 | 0 |
| 23 — Análise Multidimensional | esqueleto | — | 0 | 0 |
| 24 — Séries Temporais | esqueleto | — | 0 | 0 |
| 25 — Do Modelo à Decisão | esqueleto | — | 0 | 0 |
| 26 — Treinar Redes Profundas | esqueleto | — | 0 | 0 |
| 27 — IA Simbólica, Fuzzy e Evolutiva | esqueleto | — | 0 | 0 |

## Registro de expiração — o placar das previsões

Cada capítulo declara uma **cláusula de expiração**: o que, ali, tem prazo. Aqui elas são acompanhadas.

| # | Cláusula | Capítulo | Declarada em | Estado | Evidência |
|---|---|---|---|---|---|
| E1 | A decomposição viés–variância continua sendo a ferramenta de diagnóstico dominante na prática tabular; *double descent* é entendido como fenômeno do regime superparametrizado. Se surgir teoria unificada que preveja os dois regimes quantitativamente, a seção é reescrita. | 01 | 2026-08 | 🔵 aberta | — |
| E2 | AUC-PR é a escolha padrão para classes raras; calibração é etapa pós-treino dedicada. Se modelos de uso geral passarem a entregar escores bem calibrados sem etapa dedicada, a recomendação muda. | 04 | 2026-08 | 🔵 aberta | — |

| E3 | Gradient boosting é a escolha padrão para tabular de porte médio (Grinsztajn et al., 2022). **Gatilho de revisão**: um benchmark independente, com igual rigor de busca de hiperparâmetros, mostrando vantagem consistente de método não-árvore nesse regime. | 07 | 2026-08 | 🔵 aberta | — |

**Legenda:** 🔵 aberta (ainda em pé, sem evidência de mudança) · 🟡 em curso (há sinais, mas não conclusivos) · 🟢 confirmada (o previsto aconteceu) · 🔴 refutada (o livro errou — e isso é a notícia mais importante de uma edição)

## Cadência

- **Janela trimestral** (próxima: **2026-11**): reconferir vídeos, reexecutar os experimentos com as versões correntes das bibliotecas, atualizar o placar acima e as datas de revisão.
- **Gatilho extraordinário**: qualquer evento que invalide uma "Síntese — o que levar" dispara revisão pontual do capítulo afetado, sem esperar a janela.
- **Gatilho por telemetria**: exercício com taxa de acerto baixa e volume relevante é sinal de texto mal escrito. Ele entra na fila de revisão — ver [Uso do livro](apendice-uso.md).
