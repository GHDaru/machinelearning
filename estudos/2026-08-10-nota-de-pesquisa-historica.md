# Nota de pesquisa histórica — origem dos métodos do livro

> **Data:** 2026-08-10 · **Spec:** [006](../specs/006-pesquisa-historica-e-trilha-analise-preditiva/spec.md) · **Modelo de IA:** Claude (Anthropic), via Claude Code
>
> Cumpre o **Princípio X**: a pesquisa histórica acontece em **sessão própria**, não dentro de cada capítulo. Esta é a **primeira passada** — cobre a trilha de Análise Preditiva e o que se sobrepõe aos capítulos já escritos. A fila de verificação, no fim, diz o que falta e em que ordem.
>
> **Como ler os selos.** ✓ fonte aberta e lida · ✓ᵐ só metadados conferidos · ⏳ atribuição corrente não confirmada em primária · ❌ procurei e não achei · 📖 leitura editorial deste livro. Conferir um identificador dá **✓ᵐ**, nunca ✓.

---

## Por que esta nota existe, e o que ela já provou

O Princípio X afirma que **as histórias se conectam, e quem pesquisa capítulo a capítulo publica os dois lados sem a ligação.** Uma sessão só de pesquisa já produziu três ligações que a pesquisa fatiada teria perdido — estão na seção "Fios que atravessam o livro", no fim. A mais forte: **os capítulos 05 e 18 contam a mesma lição sobre crédito científico, por lados opostos.**

---

## Parte I — Trilha de Análise Preditiva

### Capítulo 19 — O ciclo da ciência de dados (CRISP-DM)

| Elemento | O que se apurou | Selo |
|---|---|---|
| **O aperto** | Meados dos anos 1990: mineração de dados era mercado novo e imaturo; cada projeto reinventava seu próprio processo, e os resultados não eram comparáveis nem repetíveis entre empresas | ⏳ |
| **O que se fazia antes** | Processo ad hoc por consultoria; ferramentas vendidas sem método | ⏳ |
| **A virada** | Um processo **de indústria, não de fornecedor**: seis fases, explicitamente cíclicas, com o **entendimento do negócio** na primeira posição e a modelagem só na quarta | ✓ᵐ |
| **A ideia reaproveitável** | **O método é o produto, não a ferramenta.** Quando um campo novo não tem processo comum, o processo comum vale mais que qualquer algoritmo — porque é ele que torna o resultado auditável e transferível entre equipes | 📖 |
| **O nome** | *CRoss-Industry Standard Process for Data Mining* — "cross-industry" é a tese: o processo não pode pertencer a um setor nem a um vendedor | ✓ᵐ |

**Cronologia.** Concebido no fim de **1996**; vira projeto europeu com financiamento **ESPRIT** em 1997; consórcio de cinco organizações — ISL (depois absorvida pela SPSS, autora do Clementine, primeiro *workbench* comercial de mineração, 1994), Teradata, NCR, Daimler-Benz e a seguradora OHRA. Testado em projetos reais na Mercedes-Benz e na OHRA. Especificação **CRISP-DM 1.0** publicada em **1999**. [Guia 1.0 em PDF](https://www.kde.cs.uni-kassel.de/lehre/ws2012-13/kdd/files/CRISPWP-0800.pdf) · [espelho IBM/SPSS](https://public.dhe.ibm.com/software/analytics/spss/documentation/modeler/14.2/es/CRISP-DM.pdf) — **✓ᵐ**: localizei o documento primário e conferi identificação e autoria, mas **não o li por inteiro**. Vira ✓ quando lido.

> **Detalhe que ensina, e que precisa de fonte primária:** o consórcio incluir uma **seguradora** (OHRA) ao lado de uma montadora é a prova de conceito do "cross-industry" embutida na própria composição do grupo. Confirmar no guia 1.0 antes de afirmar assim no capítulo. ⏳

---

### Capítulo 20 — Coleta e integração (data warehouse)

| Elemento | O que se apurou | Selo |
|---|---|---|
| **O aperto** | Anos 1980–90: os dados da empresa viviam nos sistemas transacionais, otimizados para **registrar**, não para **perguntar**. Uma consulta analítica pesada competia com a operação e podia derrubá-la | ⏳ |
| **O que se fazia antes** | Relatório extraído direto do sistema de produção, em janela noturna | ⏳ |
| **A virada** | **Separar o repositório de análise do repositório de operação** — e aceitar a redundância como preço da pergunta rápida | ⏳ |
| **A ideia reaproveitável** | **Otimizar para escrever e otimizar para ler são objetivos em conflito.** Quando os dois não cabem no mesmo lugar, duplicar com disciplina é mais barato que servir mal aos dois | 📖 |
| **O nome** | Bill Inmon é chamado *pai do data warehouse*; *Building the Data Warehouse*, 1992 | ⏳ |

**O debate que não terminou.** Inmon (arquitetura *hub-and-spoke*, warehouse normalizado com *data marts* dependentes a jusante) × Kimball (*bus matrix*, o warehouse inteiro em forma dimensional, marts ligados por **dimensões conformadas**). Os dois concordavam que modelagem dimensional serve; discordavam de onde ela entra. **Na prática, quase todo warehouse grande é híbrido** — sedimento de decisões tomadas por equipes diferentes sob restrições diferentes. **⏳** — apurado em fontes secundárias de qualidade desigual; nenhum dos dois livros foi aberto.

> **Isto é ótimo material didático justamente por não ter vencedor.** O capítulo deve apresentá-lo como *trade-off vivo*, não como "o jeito certo" — e dizer que o híbrido é a norma, não o fracasso. 📖

---

### Capítulo 21 — Análise exploratória (Tukey)

| Elemento | O que se apurou | Selo |
|---|---|---|
| **O aperto** | Início dos anos 1960: a estatística acadêmica havia se tornado quase sinônimo de **inferência formal** — testar hipóteses previamente formuladas, com rigor matemático. Faltava lugar legítimo para a etapa anterior: *olhar o dado antes de saber o que perguntar* | ✓ᵐ |
| **O que se fazia antes** | Ou se testava uma hipótese, ou não se estava fazendo estatística | ⏳ |
| **A virada** | Nomear **análise de dados** como disciplina própria, da qual a inferência é *um* componente — e não o todo. Depois, dar-lhe ferramentas: *boxplot*, *stem-and-leaf*, e o hábito da resistência a valores extremos | ✓ᵐ |
| **A ideia reaproveitável** | **Antes de testar a resposta, é preciso ter permissão para procurar a pergunta.** Um campo que só valoriza a etapa confirmatória fica cego para a etapa que gera hipótese | 📖 |
| **O nome** | *Exploratory* opõe-se explicitamente a *confirmatory* — a dupla é dele, e o par é o argumento | ⏳ |

**Cronologia.** **1962** — "The Future of Data Analysis", *Annals of Mathematical Statistics*: o manifesto. **1977** — *Exploratory Data Analysis*, Addison-Wesley: o livro que virou a bíblia do assunto. Entre um e outro, o material circulou por ~3 edições mimeografadas e pelos alunos dele. [Verbete biográfico por Brillinger](https://www.stat.berkeley.edu/~brill/Papers/jwtencyc.pdf) · [capítulo sobre EDA](https://www.stat.berkeley.edu/~brill/Papers/EDASage.pdf) — **✓ᵐ**.

> **Quinze anos entre o manifesto e o livro.** Esse intervalo é o conteúdo: a ideia precisou de mais de uma década e de uma geração de alunos para deixar de ser heresia. É o mesmo formato do intervalo de 1943→1958 no capítulo 18. 📖

---

### Capítulo 22 — Visualização e storytelling (Playfair)

| Elemento | O que se apurou | Selo |
|---|---|---|
| **O aperto** | Fim do século XVIII: comércio internacional crescendo, e os números só existiam em **tabelas**. Playfair queria que um leitor apreendesse uma tendência de décadas **de relance** | ✓ᵐ |
| **O que se fazia antes** | Tabela de números, lida linha a linha | ⏳ |
| **A virada** | Usar **posição e comprimento** para representar quantidade — o gráfico de linhas e o de barras | ✓ᵐ |
| **A ideia reaproveitável** | **Uma restrição de dados pode gerar uma forma nova.** Ver o achado abaixo | 📖 |
| **O nome** | *The Commercial and Political Atlas* (1786; edição preliminar privada em 1785) | ✓ᵐ |

**O achado desta pesquisa — e o melhor material do capítulo.** O gráfico de barras nasceu de uma **falta**. O atlas de Playfair é feito de séries temporais: 34 pranchas de importação e exportação ao longo dos anos, em linha. Mas para a **Escócia** ele tinha os dados de **um único ano (1781)** — sem eixo do tempo, não há linha a traçar. A saída foi desenhar 34 barras, uma para cada sentido do comércio com 17 parceiros. *"Playfair was driven to this invention by a lack of data"* (Beniger & Robyn, 1978, apud [History of Data Visualization, cap. 5](https://friendly.github.io/HistDataVis/ch05-playfair.html)). **⏳** — a atribuição vem de fonte secundária boa que cita a primária; confirmar em Beniger & Robyn antes de afirmar no corpo.

**A frase do próprio Playfair**, que abre bem o capítulo: *"As the knowledge of mankind increases, and transactions multiply, it becomes more and more desirable to abbreviate and facilitate the modes of conveying information."* **⏳** — citada de forma consistente em várias fontes secundárias; **não conferida na edição de 1786**.

---

### Capítulo 23 — Análise multidimensional (OLAP)

| Elemento | O que se apurou | Selo |
|---|---|---|
| **O aperto** | O modelo relacional é ótimo para transação e desajeitado para a pergunta gerencial típica — *"vendas por produto, por região, por trimestre"*, com agregação em vários eixos ao mesmo tempo | 📖 |
| **O que se fazia antes** | SQL com muitos `GROUP BY`, lento e reescrito a cada nova pergunta | ⏳ |
| **A virada** | Tratar o dado como **cubo**: eixos (dimensões) e medidas, com agregação pré-computada e navegação por *drill-down* / *roll-up* | ⏳ |
| **A ideia reaproveitável** | **Trocar espaço e frescor por tempo de resposta é uma decisão de projeto, não um detalhe.** O cubo é essa troca tornada arquitetura | 📖 |
| **O nome** | Cunhado no relatório de 1993 de E. F. Codd, S. B. Codd e C. T. Salley — *Providing OLAP to User-Analysts: An IT Mandate* | ✓ᵐ |

> ### A história incômoda, e por que ela **entra** no livro
>
> O relatório que cunhou "OLAP" e listou as **12 regras** foi **patrocinado pela Arbor Software**, fabricante do Essbase — lançado no ano anterior —, e as regras coincidiam notavelmente com as características do produto. O patrocínio não estava declarado. Quando a *Computerworld* apurou o caso, o artigo foi retirado. Codd seguiu reconhecido como pai do modelo relacional, e a categoria "OLAP" permaneceu. **⏳** — reportado de forma consistente em fontes secundárias; **não abri o material da Computerworld da época**, e este é o item que mais precisa de fonte primária em toda esta nota.
>
> **Por que não omitir.** O Princípio X proíbe *curiosidade decorativa*, e este episódio não é decoração: ele ensina que **categorias de tecnologia às vezes nascem de marketing, não de necessidade técnica** — e que o aluno deve perguntar de onde veio a categoria antes de aceitá-la como natural. É a lição de ceticismo mais barata que o livro tem para dar. Mas ela **só entra se a fonte fechar**: afirmação de má conduta exige primária, não eco. Enquanto for ⏳, o texto diz "a versão corrente é que…", e não "aconteceu que…". Se não fechar, vira ❌ e o capítulo diz isso.

---

### Capítulo 24 — Séries temporais (Yule → Box–Jenkins)

| Elemento | O que se apurou | Selo |
|---|---|---|
| **O aperto** | 1927: as manchas solares oscilavam com regularidade aparente, e a estatística da época explicava periodicidade por **ciclo determinístico oculto + erro de medição**. Yule desconfiou: o ruído não estaria *na medição*, mas **no próprio sistema** | ⏳ |
| **O que se fazia antes** | Análise harmônica à procura de períodos escondidos | ⏳ |
| **A virada** | Modelar o valor de hoje como **função dos valores anteriores mais uma perturbação aleatória** — o autorregressivo. A metáfora dele: um pêndulo levando pancadas aleatórias oscila sem ter período fixo | ⏳ |
| **A ideia reaproveitável** | **O acaso pode estar dentro do mecanismo, não só no instrumento.** Trocar "sinal limpo + erro de leitura" por "sistema que é ele mesmo ruidoso" muda o que se procura | 📖 |
| **O nome** | ARIMA: *AutoRegressive Integrated Moving Average* — as três peças do procedimento | ✓ᵐ |

**Cronologia.** **1927** — Yule, "On a Method of Investigating Periodicities in Disturbed Series, with Special Reference to Wolfer's Sunspot Numbers", *Phil. Trans. Royal Society A*, 226, 267–298: primeira aplicação de autorregressão, com defasagem 2. **1970** — Box & Jenkins, *Time Series Analysis: Forecasting and Control*, Holden-Day: o procedimento que popularizou e sistematizou (identificar → estimar → diagnosticar). **✓ᵐ** para ambos.

> Repare no formato: **43 anos entre a ideia e o procedimento que a tornou utilizável.** É o terceiro caso deste padrão nesta nota. 📖

---

### Capítulo 25 — Do modelo à decisão · Capítulo 03 — Representação

Ainda **sem pesquisa própria** nesta passada. Estão na fila de verificação. Não escreverei a seção "De onde isto veio" deles a partir de memória — o Princípio X é exatamente sobre isso. ❌ *(por enquanto: não pesquisado, não "não existe")*

---

## Parte II — Sobreposição com capítulos já escritos (dívida D8)

### Capítulo 04 — Avaliação (curva ROC)

**A origem é militar.** "Receiver Operating Characteristic" vem literalmente do **receptor de radar** na Segunda Guerra: o operador via um sinal na tela e tinha de decidir se era bombardeiro inimigo, navio amigo ou ruído — e podia **ajustar o ganho** do receptor, movendo o limiar entre deixar passar falso alarme e perder o alvo. A curva é o mapa dessa troca. O gráfico como o conhecemos vem do trabalho pós-guerra em teoria da detecção de sinal (Peterson & Birdsall, 1953; Peterson et al., 1954) e chega à psicologia por Tanner e Swets. **⏳** — consistente entre fontes secundárias; as primárias de 1953–54 não foram abertas.

> **A ideia reaproveitável, e ela é grande:** **o limiar não é propriedade do modelo, é uma decisão de quem assume as consequências.** O radar tornou isso literal — havia um botão, e girá-lo trocava um tipo de erro por outro. Nenhum valor de limiar é "o certo" sem dizer quanto custa cada erro. É exatamente o que o capítulo 04 já ensina; falta-lhe a história que o torna inesquecível. 📖

### Capítulo 05 — Modelos lineares (mínimos quadrados)

**A disputa de prioridade mais famosa da história da estatística.** **Legendre publicou primeiro**, em **1805**, em *Nouvelles méthodes pour la détermination des orbites des comètes* — e deu ao método o nome que ficou. **Gauss publicou em 1809** (*Theoria motus corporum coelestium*) afirmando **usar o método desde 1795**. Legendre reagiu com a tese de que **prioridade se estabelece por publicação**, e em 1820 atacou publicamente a reivindicação. Gauss entendia prioridade como *ser o primeiro a descobrir*, e apoiava-se em registros privados e correspondência; Olbers (1816) e Bessel (1832) publicaram notas confirmando ter visto o método com ele antes. A avaliação histórica moderna: Gauss provavelmente **tinha** o método antes, e **falhou em comunicá-lo**. [Stigler, "Gauss and the Invention of Least Squares", *Annals of Statistics*, 1981](https://projecteuclid.org/journals/annals-of-statistics/volume-9/issue-3/Gauss-and-the-Invention-of-Least-Squares/10.1214/aos/1176345451.full) — **✓ᵐ**, artigo localizado e identificado, não lido.

**O aperto é concreto e bonito:** astronomia. Várias observações ruidosas da mesma órbita, todas discordando entre si, e a necessidade de uma **única** curva. Mínimos quadrados nasceu para achar cometas e planetas — não para prever preço de imóvel.

### Capítulo 01 · 02 · 06 · 07

Não pesquisados nesta passada. Fila abaixo.

---

## Fios que atravessam o livro

O que só aparece pesquisando junto — a justificativa empírica do "sessão única" do Princípio X.

**1. Crédito científico: os capítulos 05 e 18 são o mesmo caso por lados opostos.**
O capítulo 18 fecha com Schmidhuber: *não é o primeiro inventor que leva o crédito, é o último reinventor* — Linnainmaa (1970) descreve, Rumelhart *et al.* (1986) popularizam, e o crédito corrente vai para os segundos. O capítulo 05 tem o inverso perfeito: Gauss descobre antes e **perde** a prioridade para Legendre, que publicou. Juntos, os dois casos ensinam o que nenhum deles ensina sozinho: **crédito não segue descoberta, segue comunicação** — e é por isso que publicar, documentar e datar faz parte do método, não da burocracia. Os dois capítulos devem **citar um ao outro**.

**2. O padrão "ideia → procedimento utilizável" leva décadas, e o intervalo é o conteúdo.**
1943→1958 (neurônio → perceptron, 15 anos) · 1927→1970 (Yule → Box–Jenkins, 43) · 1962→1977 (manifesto de Tukey → livro, 15) · 1970→1986 (retropropagação → uso corrente, 16). Quatro casos, mesmo formato: **a ideia não pega quando é publicada; pega quando alguém a transforma em procedimento que outros conseguem seguir.** É a mesma lição do fio 1, vista pelo lado do método.

**3. Restrição material gera forma nova.**
Playfair inventa a barra por **falta de série temporal**. McCulloch e Pitts fazem um neurônio sem aprendizado porque **não havia como treinar**. O cubo OLAP pré-computa porque **a consulta era lenta demais**. O capítulo 19 pode fechar o ciclo dizendo isto explicitamente: *no mundo real o método é escolhido pela restrição, não pelo ideal* — que é a tese do CRISP-DM começar pelo entendimento do negócio.

---

## Fila de verificação

Ordenada por **quanta dúvida cada fonte fecha por unidade de esforço** — não por importância do tema. Fonte cara que fecha pouco fica no fim, mesmo sendo célebre.

| # | Fonte | O que fecha | Esforço | Por que nesta posição |
|---|---|---|---|---|
| 1 | **Guia CRISP-DM 1.0** (PDF aberto, ~76 pp.) | ✓ᵐ → ✓ em **todo** o capítulo 19: fases, ordem, composição do consórcio | baixo | PDF já localizado e livre. Fecha um capítulo inteiro numa leitura |
| 2 | **Stigler (1981), *Gauss and the Invention of Least Squares*** | ✓ᵐ → ✓ na disputa de prioridade; e é a fonte do **fio 1** | baixo | Artigo único, autor de referência, sustenta uma ligação entre dois capítulos |
| 3 | **Tukey (1962), "The Future of Data Analysis"** | ✓ᵐ → ✓ no cap. 21; a frase-manifesto no original | médio | Artigo longo, mas é a origem do argumento exploratório×confirmatório |
| 4 | **Beniger & Robyn (1978)** | ⏳ → ✓ na história da barra por falta de dado — o melhor achado do cap. 22 | médio | Hoje o livro dependeria de fonte secundária para o seu melhor parágrafo |
| 5 | **Computerworld sobre o caso OLAP/Arbor** | ⏳ → ✓ **ou** ❌ na única acusação de má conduta da nota | alto | Material de 1993–94, provavelmente fora da web aberta. **Enquanto não fechar, o texto usa "a versão corrente é…"** |
| 6 | **Yule (1927), *Phil. Trans. A*** | ✓ᵐ → ✓ na metáfora do pêndulo golpeado | médio | A metáfora é do original; hoje chega por terceiros |
| 7 | **Peterson & Birdsall (1953/54)** | ⏳ → ✓ na origem da ROC | alto | Relatórios técnicos da era do radar, difíceis de obter. A história geral já é sólida |
| 8 | **Inmon (1992) e Kimball (1996)** | ⏳ → ✓ᵐ no cap. 20 | alto | Dois livros. O capítulo pode ficar `essencial` sem eles, apresentando o debate como debate |
| 9 | **Capítulos 25 e 03** | ❌ → primeira passada | — | Ainda não pesquisados: precisam de sessão própria antes da escrita |

**Regra de uso desta fila.** Nenhum item acima autoriza escrever no corpo antes de fechar. Enquanto o selo for ⏳, o texto diz que é atribuição corrente; enquanto for ✓ᵐ, o texto pode dizer *que a obra existe e o que ela é*, nunca *o que ela argumenta por dentro*.

---

## O que esta nota deliberadamente **não** fez

- **Não abriu nenhuma fonte primária.** Toda a pesquisa desta passada é de localização e triangulação entre secundárias. Por isso o selo mais alto aqui é **✓ᵐ**, e não há um único **✓** — o que é a resposta honesta, não modéstia: `✓` exige ter lido o texto.
- **Não cobriu os capítulos 25, 03, 01, 02, 06 e 07.** Marcados ❌ no sentido de *não pesquisados nesta passada*, que é diferente de *procurei e não existe*.
- **Não resolveu o caso OLAP.** É a afirmação mais séria da nota — envolve conduta de pessoas reais — e a que tem a fonte mais fraca. Está registrada com esse desconforto explícito, e não entra no corpo do livro como fato até fechar.


---

# 2ª passada — capítulos 01, 02, 06 e 07

> **Data:** 2026-08-10 · Cobre a sobreposição com os capítulos que já tinham corpo (dívida D8).
>
> **Novidade desta passada: há um ✓ de verdade.** [Lemaréchal, *Cauchy and the Gradient Method*, Documenta Mathematica, 2012](https://ems.press/content/book-chapter-files/27368?nt=1) foi **lido por inteiro**, e transcreve o francês original de Cauchy em nota de rodapé. É a primeira afirmação do livro que sai de fonte aberta e lida, e não de triangulação.

## Cap. 06 — Gradiente (Cauchy, 18 de outubro de 1847)

Cauchy queria a **órbita de um corpo celeste**, com seis incógnitas, à mão. Critica a eliminação sucessiva por dois motivos que ele enumera: em muitos casos ela simplesmente não se efetua, e a equação resultante fica complicadíssima mesmo partindo de equações simples. A virada: se a função nunca é negativa, **não é preciso resolvê-la — basta fazê-la decrescer** até que se anule. ✓

**Três detalhes de ouro, todos ✓:**

1. Para sistemas de várias equações, Cauchy manda minimizar a **soma dos quadrados** dos resíduos. Ou seja: **o cap. 06 executa o objetivo que o cap. 05 inventou.**
2. **Cauchy não prova convergência, e sabe disso.** Diz que se limita, por ora, a indicar os princípios, prometendo voltar "num próximo Memória". Lemaréchal observa que esse próximo memorial **parece não existir**. O matemático mais rigoroso do século publicou um algoritmo sem garantia e nunca voltou.
3. **Bônus para o cap. 05:** Lemaréchal cita Gauss sobre a disputa com Legendre — que não imaginava que Legendre tivesse tanto apego a uma ideia tão simples, e que deveria antes causar espanto ninguém a ter tido cem anos antes. ✓ como transcrição; ⏳ para a correspondência original.

**Regularização:** Hadamard (1923) define problema bem-posto; Tikhonov publica em 1943 e 1963, com Phillips (1962) chegando a algo equivalente de forma independente ⏳. Ridge é Hoerl & Kennard, *Technometrics*, 1970 ✓ᵐ — origem industrial, engenharia química, e o "ridge" alude às cristas dos gráficos de superfície de resposta ⏳. LASSO é Tibshirani, *JRSS-B*, 1996 ✓ᵐ, herdeiro do *non-negative garrote* de Breiman (1995) ⏳. **Early stopping: ❌** — não localizei atribuição primária confiável.

## Cap. 07 — Árvores e ensembles

**Breiman deixou a academia em 1967**, passou treze anos consultando e voltou a Berkeley em **1980**; modelava tráfego em autoestradas, gargalos do sistema judiciário e ozônio em Los Angeles ✓ᵐ. **CART nasce da consultoria, não do seminário.**

**Boosting inverte o padrão do livro.** Kearns & Valiant (1988) fizeram uma **pergunta teórica** — um aprendiz pouco melhor que o acaso pode virar arbitrariamente bom? Schapire (1990) respondeu que sim, e **a prova era construtiva**: a construção era o método ✓ᵐ. Ninguém procurava boosting; procurava-se saber se era possível.

**❌ desta passada:** o nome do projeto de consultoria específico que gerou o CART; a expansão de *AdaBoost* na fonte de 1997.

## Cap. 01 — Fundamentos

Divisão treino/teste é **mais antiga do que se conta**: Larson (1931), psicometria, medindo o encolhimento do R múltiplo ⏳. Mosteller & Tukey (1968) formulam o *leave-one-out* ⏳. Stone (1974) e Geisser (1975) constroem o arcabouço ✓ᵐ — e Stone **cita os antecessores**: o novo dele não é a prática, é o arcabouço.

Viés–variância em ML: Geman, Bienenstock & Doursat (1992) ✓ᵐ. **A origem da decomposição, anterior a eles, é ❌** — procurei e não achei.

*Double descent*: Belkin *et al.* (*PNAS*, 2019) ✓ᵐ, **com contestação publicada** — Loog *et al.*, "A brief prehistory of double descent" (*PNAS*, 2020) ✓ᵐ, sustentando que o fenômeno não fora historicamente negligenciado.

> ⚠ **Aviso de método desta passada.** O PDF de Stone (1974) foi aberto, mas a extração devolveu texto **parafraseado**. Por isso **nada de Stone entra entre aspas** em nenhum capítulo até releitura direta. É exatamente a armadilha que o Princípio X nomeia — resumo não é fonte —, apanhada em flagrante dentro do próprio processo.

## Cap. 02 — Dados

Vazamento: Kaufman, Rosset, Perlich & Stitelman, *ACM TKDD*, 2012 ✓ᵐ. O gatilho foram **competições públicas quebradas** — INFORMS 2010, IJCNN 2011, KDD-Cup 2007 — e o emblema é a **KDD Cup 2008**, mamografia, em que o **identificador do paciente** tinha poder preditivo enorme ⏳.

Fichas de dataset: Gebru *et al.*, arXiv:1803.09010 (2018), *CACM* (2021) ✓ᵐ. A analogia com a folha de dados da **eletrônica** está declarada no resumo.

**❌:** casos de datasets clássicos que envelheceram mal — existem e são citados, **nenhum verificado**. Nenhum é nomeado no capítulo.

## Fios novos

**4. Cauchy fecha o triângulo 05 → 06.** Mínimos quadrados (1805/1809) dá o alvo; Cauchy (1847) dá o como, e manda explicitamente somar os quadrados. Os dois capítulos agora se citam.

**5. O padrão "ideia → procedimento" ganha casos… e uma exceção que o explica.** Larson 1931 → Stone 1974 são **43 anos**, idêntico a Yule → Box–Jenkins. Mas **boosting inverte**: pergunta em 1988, resposta em 1990, AdaBoost em 1995 — **sete anos**. A diferença é que ali o aperto já estava formulado como **pergunta formal precisa**. O gargalo nunca foi o tempo nem o computador: é a **precisão da pergunta**. Isso reescreve o fio 2 e o torna acionável.

**6. *Double descent* é o fio 1 pela terceira vez — e a versão contemporânea.** Belkin *et al.* levam o crédito por algo que, segundo Loog *et al.*, já estava publicado. Com Gauss×Legendre e Linnainmaa×Rumelhart, são três casos; este é o único **de 2019**, com tudo indexado e acessível. Se acontece hoje, não era problema de correio lento no século XIX.

**7. Um método pode nascer duas vezes do mesmo diagnóstico.** "Instabilidade" leva Breiman ao garrote → LASSO (cap. 06) e ao *bagging* (cap. 07).

## Fila de verificação (acrescenta à anterior)

| # | Fonte | O que fecha | Esforço |
|---|---|---|---|
| 1 | [Loog *et al.*, arXiv:2004.04328](https://arxiv.org/abs/2004.04328) — 2 pp., aberto | ✓ᵐ → ✓ no fio 6; lista as fontes pré-1999 | baixo |
| 2 | [Gebru *et al.*, arXiv:1803.09010](https://arxiv.org/abs/1803.09010) | ✓ᵐ → ✓ na motivação e na analogia | baixo |
| 3 | [Kaufman *et al.*, TKDD 2012 (PDF aberto)](https://www.cs.umb.edu/~ding/history/470_670_fall_2011/papers/cs670_Tran_PreferredPaper_LeakingInDataMining.pdf) | ✓ᵐ → ✓ no caso *Patient ID* | baixo |
| 4 | **Stone (1974), releitura direta** | permite **citar** — hoje proibido | baixo |
| 5 | [Schapire (1990)](http://www.schapire.net/papers/strengthofweak.pdf) | ✓ᵐ → ✓ no enunciado de Kearns & Valiant | médio |
| 6 | [Quinlan (1986)](https://hunch.net/~coms-4771/quinlan.pdf) | ⏳ → ✓ no desafio de Michie e no crédito a Hunt | médio |
| 7 | Breiman, *Statistical Modeling: The Two Cultures* (2001) | os projetos de consultoria em 1ª pessoa | médio |
| 8 | Casos de dataset enviesado (cap. 02) | ❌ → 1ª passada | alto |
| 9 | Cauchy, *C. R. Acad. Sci. Paris* 25:536–538 (Gallica) | ✓ via Lemaréchal → ✓ direto | médio |

---

# 3ª passada — capítulos 27, 08 e 13

> **Data:** 2026-08-10 · **Dois ✓ de verdade**: [Bock, *Origins and extensions of the k-means algorithm* (JEHPS, 2008)](http://www.jehps.net/Decembre2008/Bock.pdf) e [Dreyfus, *Richard Bellman on the Birth of Dynamic Programming* (Operations Research 50(1), 2002)](https://www.cs.miami.edu/home/odelia/teaching/csc317_fall19/syllabus/dy_birth.pdf), lidos por inteiro.
>
> **E as duas lendas encomendadas quebraram — as duas, por motivos diferentes.** É o melhor resultado desta nota.

## Cap. 08 — k-means: o caso-limite do padrão de crédito

Bock (2008), lido, desmonta a versão de curso. A cadeia real tem **seis** pretendentes, em **quatro campos que não conversavam**:

- **Dalenius (1950/51)** — a primeira formulação do problema, em **amostragem estratificada**, não em clustering. Um nome anterior a todos os quatro que se costuma citar. ✓
- **Steinhaus (1956)** — primeiro a propor o k-means multidimensional, versão contínua, com motivação **mecânica**: partir um sólido heterogêneo minimizando momentos de inércia. Publicado **em francês**. ✓
- **Lloyd (1957)** — critério contínuo em uma dimensão, contexto de **quantização de voz** nos Bell Labs. Publicado só em **1982**. ✓ᵐ
- **Forgy (1965)** — primeiro a propor o k-means discreto. **Detalhe demolidor:** Bock registra que o resumo da palestra de Forgy **não menciona explicitamente o algoritmo** — o conteúdo é conhecido apenas por descrição de terceiros. ✓
- **MacQueen (1967)** — cunha o nome "k-means", **para um algoritmo diferente** do que hoje leva esse nome (o sequencial, não o *batch*). E **Sebestyen (1962)** já propusera o mesmo procedimento. ✓

> **Por que supera Gauss×Legendre e Linnainmaa×Rumelhart.** Ali havia dois pretendentes; aqui há seis. E o nome vencedor foi cunhado **para outro algoritmo**. Não vence quem descobre, nem quem publica, nem quem descreve o método corrente: vence **quem escreve a palavra que pega**. 📖

**A ideia reaproveitável do k-means:** quando o problema conjunto é intratável, **congele metade e resolva a outra — depois inverta**. Bock mostra que é um caso de otimização alternada, e a mesma forma reaparece em EM, fuzzy c-means e k-medoids. **Não é um algoritmo, é um padrão.** 📖

**Hierárquico:** Sokal & Sneath (1963) motivaram a pesquisa mundial em clustering ✓. O aperto era político-científico: **tirar a classificação das mãos da autoridade do taxonomista** e torná-la reproduzível. 📖

**PCA:** Pearson (1901), formulação geométrica; Hotelling (1933), formulação algébrica, motivação psicométrica — e é dele o nome. **32 anos, dois problemas diferentes, mesma decomposição.** ✓ᵐ

### A lenda "cerveja e fraldas" — quebrou, e da forma mais instrutiva

Rastreada até [Power, *Ask Dan!*, DSSResources (2002)](https://dssresources.com/newsletters/66.php), que entrevistou o autor do estudo:

- **O estudo existe**: junho de **1992**, Thomas Blischok (NCR/Teradata) para a **Osco Drug**; ~1,2 milhão de cestas em ~25 lojas. ⏳
- **A correlação foi achada**: cerveja e fraldas juntas **entre 17h e 19h**. ⏳
- **A parte que todo curso ensina — "puseram a cerveja ao lado das fraldas e as vendas subiram" — é FALSA.** Power afirma que a Osco **não** explorou a relação movendo produtos, e Blischok confirma que nunca fizeram nada com ela. ❌
- E o registro de ouro: um participante observa que o líder da equipe, ao falar com prospects, **não distinguia entre as afinidades testadas e as hipóteses**. ⏳ **A lenda nasceu no discurso de vendas, documentadamente.**

> **Não consertar a lenda: exibir a fratura.** A história é verdadeira até a descoberta e inventada a partir da ação. É o exemplo mais barato de *correlação achada ≠ decisão tomada ≠ efeito medido* — e a fabricação vem do marketing, como no caso OLAP do cap. 23. 📖

## Cap. 13 — a lenda do nome "dynamic programming": quebrou por data, e a citação é real

Aqui os dois selos divergem, **e a divergência é o conteúdo**.

**✓ — a citação existe e foi lida.** Dreyfus (2002) transcreve a autobiografia de Bellman (*Eye of the Hurricane*, 1984, p. 159): ele passou o outono **de 1950** na RAND, precisava de um nome, e havia em Washington "um cavalheiro chamado Wilson", Secretário de Defesa, com "medo e ódio patológicos da palavra **pesquisa**". Escolheu "dynamic" porque era impossível usar em sentido pejorativo — "algo a que nem um congressista poderia objetar".

**❌ — a explicação não pode ser verdadeira como contada.** Duas datas a derrubam:

1. **Charles E. Wilson só assumiu como Secretário de Defesa em 28 de janeiro de 1953.** Em 1950 o cargo era de Louis Johnson / George Marshall. ✓ᵐ
2. **O primeiro artigo de Bellman com o termo é de 1952** — *PNAS* 38(8), comunicado por von Neumann em 5 de junho de 1952 — **anterior à posse de Wilson**. ✓ᵐ
3. Há versão concorrente: Kushner relata que Bellman lhe disse estar tentando fazer sombra ao *linear programming* de Dantzig. ⏳

> **O que o capítulo deve dizer não é "a lenda é falsa".** É: *Bellman contou esta história, nestas palavras, na própria autobiografia — e a cronologia não fecha.* A lição não é sobre desonestidade; é sobre **memória autobiográfica de cientista famoso ser fonte secundária sobre si mesmo**, escrita 34 anos depois. É o caso mais limpo do livro para separar **"a fonte é autêntica"** de **"a afirmação é verdadeira"** — exatamente a distinção que ✓ e ⏳ codificam. 📖

**Cronologia do 13:** Thorndike, lei do efeito (1898 tese, 1911 formulação) ⏳ · Bellman, *Dynamic Programming* (1957) e a "maldição da dimensionalidade" ✓ᵐ · Sutton, diferenças temporais (*Machine Learning* 3, 1988) ✓ᵐ · Watkins, Q-learning (tese, Cambridge, 1989) ✓ᵐ · TD-Gammon (Tesauro, 1992/1995) · DQN (2013/*Nature* 2015) ✓ᵐ · AlphaGo (*Nature*, jan. 2016) ✓ᵐ.

**A ideia reaproveitável do 13:** **não é preciso saber a resposta certa para aprender — basta que a previsão de amanhã seja melhor informada que a de hoje.** O alvo é uma versão *ligeiramente menos ignorante* de si mesmo. 📖

## Cap. 27 — quatro tradições, quatro apertos

*Provar teorema sem busca cega* (Newell, Shaw & Simon) · *decidir com predicado vago* — "a água está quente" não tem limiar (Zadeh) · *otimizar forma física sem derivada* (Rechenberg) · *raciocinar sob incerteza sem explodir a tabela conjunta* (Pearl).

**A ideia reaproveitável:** **a representação escolhida decide qual busca é possível.** Nenhuma das quatro inventou um otimizador melhor; cada uma inventou uma *forma de escrever o problema* que tornou a busca tratável. É a lição do cap. 03 vista de outro ângulo. 📖

**Simbólica.** Logic Theorist (Newell, **Shaw** e Simon — o terceiro nome quase sempre some) provou 38 dos 52 primeiros teoremas do cap. 2 do *Principia*, e para o teorema 2.85 achou prova **mais curta** que a de Whitehead e Russell. O *Journal of Symbolic Logic* teria recusado artigo coautorado por um programa ⏳. DENDRAL (Stanford, 1965) e MYCIN (Shortliffe, 1972–76), que diagnosticava no nível de especialista e **nunca foi usado clinicamente** ⏳. Colapso em **1987**, quando workstations comuns passaram a rodar LISP mais barato ⏳.

> **A ideia reaproveitável do colapso, e ela é dura:** o que matou o mercado **não foi a IA falhar** — foi o hardware genérico alcançar o especializado. A aposta perdida foi de **arquitetura**, não de método. 📖

**Fuzzy.** Zadeh, *Information and Control* 8, 1965 ✓ᵐ. "Fuzzy" foi escolha ruim e custou uma década de recepção ⏳. Metrô de **Sendai**, linha Namboku, em operação com controle fuzzy em **1987** ⏳.

**Evolutiva — três origens independentes, três continentes, ~25 anos sem se conhecerem:** Holland em Ann Arbor (1962; livro 1975), Fogel em San Diego (1962/66), e Rechenberg & Schwefel na TU Berlin (~1965), evoluindo **formas de mínimo arrasto em túnel de vento** — otimização com peça física, não simulada ⏳.

**Bayesianas.** Pearl, UCLA TR CSD-850017, abril de **1985** ✓ᵐ — é onde o termo aparece. Turing em 2011. Em 1985, falar de probabilidade em IA era estar **fora do mainstream** ⏳.

## Fios novos (8 a 12)

**8. O k-means reescreve o fio 1: crédito segue o VOCABULÁRIO.** Não vence quem descobre nem quem publica — vence quem **nomeia**. Gauss×Legendre já apontava (Legendre deu o nome *e* levou o crédito); o k-means prova. Caps. 05, 08 e 18 formam uma tríade.

**9. Invenção paralela é a regra, e a distância entre as cópias mede o isolamento do campo.** PCA: 32 anos. Evolutiva: três origens simultâneas em três continentes, independentes por ~25 anos. k-means: cinco redescobertas em 17 anos. **O gargalo não é a ideia, é a circulação.**

**10. O maior intervalo do livro.** Thorndike (1898) → Q-learning (1989): **~80 anos**. Zadeh (1965) → Sendai (1987): 22 anos **e uma mudança de continente**.

**11. A rejeição tem geografia.** Fuzzy é hostilizada no Ocidente e adotada industrialmente no Japão; Pearl está "fora do mainstream" em 1985 e ganha o Turing em 2011. **A comunidade que rejeita uma ideia raramente é a que a reabilita.** 📖

**12. A lenda serve ao ensino, não à história — e é o padrão mais útil ao leitor.** As duas lendas testadas quebram no mesmo ponto: a parte verificável é modesta (uma correlação achada; uma citação autobiográfica autêntica) e a parte memorável é a inventada (a prateleira reorganizada; a explicação causal do nome). Com o caso OLAP do cap. 23, são **três**. A regra: **quando um detalhe é bom demais para o slide, ele foi otimizado para o slide.** 📖

> **Nota de método desta passada.** As duas fontes lidas foram obtidas extraindo o texto dos PDFs localmente, depois que a leitura via web falhou — e o resumo automático do segundo chegou a **negar** que o trecho de Bellman existisse. Ele estava lá, na primeira página. É o aviso do Princípio X apanhado em flagrante pela segunda vez: **resumo não é fonte, nem quando o resumo diz que a fonte não diz nada.**
