# Changelog

Todas as mudanças notáveis deste projeto. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versionamento acompanha as **edições** do livro (ver [`livro/HISTORICO.md`](livro/HISTORICO.md)).

> **Gate de CI:** toda PR adiciona uma entrada em `[Unreleased]`. Bypass explícito para mudanças que não afetam o leitor: label `skip-changelog`.

## [Unreleased]

### Corrigido — "cerveja e fraldas": os números batiam, a cadeia de evidência não (cap. IV.1)
- **O livro dizia que Power entrevistou o autor do estudo. Ele não entrevistou
  ninguém.** Power não pôde assistir ao evento ao vivo, viu a gravação de um
  webcast da Teradata de 31/07/2002 e recebeu a transcrição por e-mail da
  moderadora, da própria Teradata. Num capítulo que separa correlação achada,
  decisão tomada e efeito medido, o texto fortalecia em uma palavra a origem da
  própria evidência.
- **"Junho de 1992" era precisão inventada.** A apuração diz só "in 1992".
- **Entrou a divergência que a fonte registra e o livro omitia.** Power abre a
  última seção com *"Does everyone agree with the above account? YES and NO!"*:
  Fawcett sustenta que o exemplo nunca foi sustentado por dado nenhum, e Kohavi
  chega à pessoa que rodou as consultas, com números que não batem com os de
  Blischok (50 lojas em um dia, 1990, contra 1,2 milhão de cestas de cerca de 25
  lojas). Ela não achava o padrão significativo.
- **Os números do relato se confirmaram** e agora aparecem entre aspas, na fala
  de Blischok. O selo da apuração de Power sobe de ✓ᵐ para ✓ (lida por inteiro),
  e os fatos em si ficam em ⏳, porque só os temos pelo relato dos envolvidos.
- **Marcador `❌` fora de lugar removido:** o corpo marcava com `❌` uma negativa
  apurada, e a tabela de selos logo abaixo explicava por que `❌` é o selo errado
  nesse caso.

### Alterado — Sokal & Sneath deixam de ser atribuição sem fonte (cap. IV.1)
- O programa da taxonomia numérica estava afirmado sem que nada dos autores
  tivesse sido aberto. O livro de 1963 segue fechado, mas o *Citation Classic*
  que **Sokal escreveu sobre o próprio livro** (1982) está lido e entrega o
  programa em primeira mão ("unaffected by subjective or phylogenetic
  judgments"), a origem da aposta de 1953 em Kansas, e a frase que fecha a tríade
  de precedência desta seção: *"in fact, we coined the name 'numerical
  taxonomy'."*
- O ⏳ de "antes se classificava por julgamento do especialista" sobe a ✓, **com a
  ressalva escrita** de que é a caracterização de quem atacava a prática.
- Erro dentro da própria tabela de selos: a referência cruzada dizia "capítulos
  II.2 e 18", numeração que o livro não usa mais. Corrigida para III.1.

### Corrigido — a tolerância dos exercícios numéricos, que sumia em silêncio
- **O parser trocava só a PRIMEIRA vírgula por ponto.** O livro é em português,
  e o gabarito natural é `0,45 ± 0,01`; com a troca não global, o valor saía
  certo e a tolerância virava **0**. Três exercícios já publicados declaravam
  tolerância e corrigiam por igualdade exata: `reforco-e1`, `reforco-e6` e
  `interpretabilidade-justica-e2`. Achado ao escrever a prova da Parte V, e o
  teste `publicar/testes/numerico.mjs` foi **visto falhando** antes do conserto.
- **Gate novo:** gabarito numérico decimal sem `±` passa a quebrar o build.
  Sem tolerância, a correção exige igualdade exata e reprova quem arredondou de
  outro jeito. Dois exercícios estavam nesse estado e ganharam tolerância:
  `do-modelo-a-decisao-e2` e `ia-simbolica-fuzzy-evolutiva-e2`. Inteiro segue
  dispensado, e `± 0` continua valendo quando for escolha escrita.

### Alterado — um ⏳ que era ✓, e a Parte III fecha (cap. III.6)
- **A filiação do objetivo de máscara à tarefa Cloze está declarada pelos autores
  do BERT**, em duas passagens: o objetivo é *"inspired by the Cloze task (Taylor,
  1953)"*, e o procedimento *"is often referred to as a Cloze task in the
  literature"*. Estava marcado como atribuição corrente.
- **Entrou um número concreto** que o capítulo não tinha: são **15% dos tokens**
  mascarados por sequência, sorteados ao acaso.
- **A ficha de Taylor foi conferida:** Wilson L. Taylor, *"'Cloze Procedure': A New
  Tool for Measuring Readability"*, *Journalism Quarterly* 30(4):415–433, 1953, com
  DOI. O intervalo de 65 anos entre a régua de redação e a função de perda agora
  tem as duas pontas datadas por fonte.
- **A Parte III fecha inteira na coluna de fontes**, de III.1 a III.6.

### Corrigido — o capítulo promovia o que a fonte subordina (cap. III.5)
- **A inversão da ordem das palavras não é a contribuição principal do seq2seq**,
  como o capítulo dizia. O resumo estabelece a hierarquia: *"Our main result is
  that… the translations produced by the LSTM achieve a BLEU score of 34.8"*, e a
  inversão entra depois, com *"Finally, we found that…"*.
- **Os dois trechos entraram no capítulo entre aspas**, com a hierarquia preservada:
  o resultado que os autores destacam, e depois o achado adicional que interessa a
  este livro — inclusive a explicação deles, de que a inversão *"introduced many
  short term dependencies… which made the optimization problem easier"*, que é o
  diagnóstico do capítulo anterior aplicado à dimensão tempo.
- Nada estava factualmente errado sobre a inversão; o que estava errado era **o
  peso** dado a ela.

### Corrigido — o motivo pelo qual uma fonte não foi lida (cap. III.4)
- **O artigo de LeCun de 1989 não está atrás de paywall**, como o capítulo dizia. O
  PDF é público na página do autor; o problema é que ele **não tem camada de
  texto** — é imagem digitalizada. Os números internos continuam ⏳, e a razão
  registrada passou a ser a verdadeira: não falta acesso, falta reconhecimento
  óptico. Quem retomar precisa saber qual das duas coisas tentar.
- **Entrou a ficha exata do artigo de 1962 de Hubel & Wiesel** (*J. Physiol.*
  160(1):106–154), nomeando o candidato para a distinção entre células simples e
  complexas. Em qual dos dois artigos ela aparece segue ⏳: os dois estão no
  repositório como **imagem de página**, sem texto buscável.
- **O neocognitron passou a ✓ᵐ quanto a auto-organizar-se**, e a evidência é o
  próprio título: *"Neocognitron: A self-organizing neural network model…"*.

### Corrigido — a anedota mais repetida do dropout não está no artigo (cap. III.3)
- **A história do caixa de banco que roda de guichê não aparece no texto do JMLR.**
  Procurei "bank", "teller", "fraud" e "conspir" no artigo inteiro: as únicas
  ocorrências de "bank" são *"log-filter bank frames"*, sobre áudio.
- **As duas motivações que os autores escreveram entraram no lugar**, e são
  melhores: a teoria sobre o papel do sexo na evolução, e a das conspirações —
  *"Ten conspiracies each involving five people is probably a better way to create
  havoc than one big conspiracy that requires fifty people to all play their parts
  correctly."* Uma conspiração grande funciona se as condições não mudarem e houver
  tempo de ensaio, que é a descrição de um conjunto de treino.
- **"Adam" passou a ✓**: o próprio artigo diz *"the name Adam is derived from
  adaptive moment estimation"*.

### Corrigido — uma verdade que enganava, sobre o nome do teorema (cap. III.2)
- **A frase era literalmente correta e produzia conclusão errada.** O capítulo dizia
  que a expressão "aproximação universal" não consta do título de nenhum dos dois
  artigos citados (Cybenko 1989, Hornik 1991). É verdade sobre esses dois — e
  *"universal approximators"* está no título de um **terceiro**, de 1989, do mesmo
  Hornik com Stinchcombe e White, que o capítulo não citava.
- **O artigo que faltava entrou** com ficha e DOI, e o argumento foi reformulado
  para o que se sustenta: o rótulo posterior não é a palavra "universal", é a
  promoção a **teorema com nome próprio**, usado sem as hipóteses que os artigos
  enunciam.
- A leitura sobre a estrutura em camadas continua ⏳, e o capítulo registra que a
  frase que costuma ser citada para ela **não foi conferida** — por isso não
  aparece entre aspas.

### Corrigido — uma frase atribuída a quem não a disse (caps. III.1 e II.2)
- **"Não é o primeiro inventor que leva o crédito, é o último reinventor"** estava
  atribuída a Schmidhuber, em **dois capítulos**, um deles como citação em itálico.
  Não a localizei no levantamento histórico dele. O que ele declara é o propósito
  do trabalho: *"One of its goals is to assign credit to those who contributed to
  the present state of the art."* A formulação é **deste livro**, e os dois
  capítulos passaram a dizer isso.
- **Correção de data na linha do backpropagation:** a aplicação a redes neurais é
  de **1981**, não de 1974. A fonte separa as duas coisas — 1974 traz discussão
  preliminar, e a primeira aplicação vem sete anos depois. A tabela ganhou a linha
  que faltava, e a síntese foi corrigida junto.
- A cronologia (1970 em tese de mestrado, *"albeit without reference to NNs"*)
  passou a ✓, citada do levantamento lido.

### Adicionado — o caso da blindagem sem o verniz, e a Parte II fecha (cap. II.8)
- **A frase de efeito não está no documento.** O caso é contado em toda parte com
  "reforce onde os aviões que voltaram não têm furos". Os **oito memorandos** de
  Wald, de 1943, para o Statistical Research Group sob o NDRC, foram lidos no
  reimpresso de 1980: a palavra "armor" aparece **uma única vez**, e o que Wald
  escreve é que as conclusões *"can be used as guides for locating protective
  armor"*. O trabalho é uma tabela de vulnerabilidade, não um aforismo.
- A lição continua válida, e o capítulo passou a separar o que o documento diz do
  que a recontagem acrescentou — com selo ✓ para o primeiro e 📖 para o segundo.
- **A Parte II fecha inteira na coluna de fontes**, de II.1 a II.8, somada à
  Abertura e à Parte I.

### Corrigido — o título do artigo de Yule, que as citações vinham "consertando" (cap. II.7)
- **O impresso não tem o "in".** O registro do periódico traz *"VII. On a method of
  investigating periodicities disturbed series, with special reference to Wolfer's
  sunspot numbers"*. A forma corrente das citações, que este capítulo usava,
  acrescenta *"in"* entre "periodicities" e "disturbed". É o mesmo mecanismo da
  frase de Playfair no I.5 — variação que melhora a leitura e por isso ninguém
  corrige de volta —, agora no título em vez de no corpo.
- A ficha ganhou DOI, número de fascículo e autor por extenso.
- **O texto do artigo não abriu:** periódico e espelho recusaram a transferência.
  A metáfora do pêndulo levando pancadas continua ⏳, com a tentativa registrada.

### Adicionado — evidência de época para o episódio do OLAP, sem tocar na acusação (cap. II.6)
- **Nada a corrigir:** o capítulo já dizia "a versão corrente é que" em vez de
  "aconteceu que", declarava o selo ⏳ no próprio corpo e explicava ao leitor por
  quê. A acusação envolve pessoas reais e **continua não conferida**; a busca de
  agosto de 2026 não localizou o material de época.
- **Entrou uma evidência parcial que dá para verificar.** O estatuto de maio de 1995
  do grupo `comp.databases.olap` define o escopo pelo relatório de Codd, é assinado
  por um funcionário da Arbor Software da área de alianças estratégicas, e termina
  com *"This posting is not officially sponsored by Arbor Software"*.
- **Com o limite escrito:** a linha de selo diz explicitamente que esse documento
  **não** sustenta a acusação sobre o relatório de 1993 — sustenta apenas a
  centralidade da empresa na institucionalização do termo.

### Corrigido — o manuscrito do *hypothesis boosting* é de Kearns sozinho (cap. II.5)
- **O erro estava na tabela de procedência, não no corpo.** A linha atribuía o
  manuscrito a "Kearns & Valiant". A ficha, lida na bibliografia de quem respondeu
  à pergunta, é **Kearns, M. (1988), *"Thoughts on hypothesis boosting"*,
  *Unpublished manuscript***. A dupla assina a introdução da aprendizagem fraca e a
  pergunta em aberto, que são outra coisa.
- **Entrou no corpo um fato que faltava e que é do feitio do livro:** o termo que
  hoje nomeia uma família inteira de algoritmos nasceu num manuscrito **não
  publicado**. A pergunta *"was termed the hypothesis boosting problem"*, e a
  referência dada para o batismo é esse texto que nunca saiu em periódico.
- A pergunta em aberto passou a ser citada nas palavras de quem a respondeu:
  Kearns e Valiant *"left open the question of whether the notions of strong and
  weak learnability are equivalent"*.

### Alterado — a herança do LASSO confirmada, e a data distinguida (cap. II.4)
- **A herança agora está nas palavras do autor**, lidas no artigo do LASSO: *"The
  motivation for the lasso came from an interesting proposal of Breiman (1993)"*, e
  a descrição do garrote que *"starts with the OLS estimates and shrinks them by
  non-negative factors whose sum is constrained"*.
- **A data que o capítulo dava era de outra coisa.** O capítulo citava "Breiman
  (1995)"; o LASSO cita o **relatório técnico de 1993**, de Berkeley, e a versão em
  periódico só sai em 1995 na *Technometrics*. As duas datas estão certas para
  coisas diferentes, e o capítulo passou a dizer qual é qual — com o intervalo de
  dois anos entre a ideia circular e ter endereço citável ligado ao caso do cap. II.2.
- Breiman (1995) e Hoerl & Kennard (1970) ganharam DOI. As origens de "ridge" nas
  superfícies de resposta e a cronologia de Tikhonov continuam ⏳.

### Adicionado — a briga do logito contra o probito, com o que faltava (cap. II.3)
- **A polêmica tinha uma segunda camada que o capítulo não contava.** A disputa
  logito × probito veio embrulhada nos ataques simultâneos de Berkson à máxima
  verossimilhança, com trocas ácidas entre ele e R. A. Fisher. O capítulo dizia
  apenas que o nome "carrega a polêmica".
- **O probito também tem paternidade disputada:** creditado a Gaddum (1933) e Bliss
  (1934), com a fonte advertindo que isso *"is too simple"* e raízes que recuam até
  Fechner. É mais um caso do padrão que o livro persegue, agora dentro do capítulo
  que usava o probito só como "método concorrente".
- **Berkson foi ridicularizado no início**, o que o capítulo não registrava:
  cunhou *logit* *"by analogy to the 'probit' of Bliss (for which he was initially
  much derided)"*.
- **A motivação foi separada em duas:** a vantagem de **cálculo** ficou ✓ (*"in the
  practical aspect of ease of computation the logit had a clear advantage"*); a de
  **interpretabilidade clínica** continua ⏳, porque não a achei na fonte lida.

### Corrigido — excesso de certeza sobre Gauss × Legendre (caps. II.2 e III.1)
- **O livro afirmava mais do que a fonte.** Dizia que "a avaliação histórica moderna
  é que Gauss tinha o método antes". O estudo de referência da disputa diz: *"It is
  argued (though not conclusively) that Gauss probably possessed the method well
  before Legendre, but that he was unsuccessful in communicating it"* — e acrescenta
  que dados do arco meridiano francês poderiam um dia permitir verificação
  definitiva. O caso segue **aberto**, e o capítulo passa a dizer isso.
- **A correção vazava para outro capítulo.** Três passagens do III.1 tratavam a
  descoberta anterior como fato, uma delas dentro do gabarito de um exercício.
  Foram alinhadas no mesmo commit.
- Stigler ganhou selo ✓ᵃ com volume, páginas e DOI. As notas de Olbers e Bessel e o
  ataque de Legendre em 1820 continuam ⏳: o resumo fala em *"new evidence, both
  documentary and statistical"* **sem nomear qual**, e ✓ᵃ não autoriza afirmar o que
  está no corpo do artigo.

### Alterado — a linhagem da curva ROC ganha ficha, e o que não abriu fica dito (cap. II.1)
- **"Peterson *et al.*, 1954" virou a citação inteira:** Peterson, Birdsall & Fox,
  *"The theory of signal detectability"*, *Transactions of the IRE* 4(4):171–212,
  com DOI. E Tanner & Swets ganhou a referência que não tinha: *"A decision-making
  theory of visual detection"*, *Psychological Review* 61(6):401–409, 1954.
- **O relatório de 1953 não abriu**, e é nele que o termo *Receiver Operating
  Characteristic* teria nascido. Duas tentativas, dois repositórios, duas recusas:
  o de defesa devolveu página em vez de documento, o da universidade respondeu com
  desafio de robô. A linha continua ⏳ **com as tentativas registradas**, para que
  quem retomar saiba o que já falhou.
- O gate de prosa pegou um parágrafo com quatro negritos, introduzido por mim ao
  escrever a correção.

### Alterado — o capítulo I.6 passou na conferência, e ganhou páginas
- **Primeiro capítulo da coluna sem achado.** As quatro afirmações centrais bateram
  com a fonte, inclusive a direção de cada sobreposição no exemplo de Harris: quase
  completa entre *oculist* e *eye-doctor*, parcial entre *oculist* e *lawyer*.
- **O ganho foi de precisão.** Entraram as páginas — 156–157 no artigo de Harris,
  194 no de Firth para o *meaning by collocation* — e o intervalo completo do
  artigo de 1954 (*Word* 10(2–3):146–162).
- A fonte que sustenta essas leituras passou a ser citada pela **versão publicada**
  (NAACL 2022), e não apenas pelo pré-print do arXiv.
- Spärck Jones (1972) e Salton & Yang (1973) ganharam ficha com DOI; **quem cunhou
  o termo "idf" continua ⏳**, porque ficha de artigo não prova autoria de nome.

### Corrigido — a citação de Playfair, no capítulo I.5, estava na forma que circula
- **O livro se pegou errando uma citação.** O capítulo trazia *"As **the knowledge
  of mankind increases**, and transactions multiply…"*, que é a forma repetida em
  fontes secundárias. O texto de Playfair, lido na digitalização da **terceira
  edição** do atlas, diz *"As **knowledge increases amongst mankind**…"* — e segue
  por mais uma oração, que o capítulo cortava sem marcar.
- **A frase também estava no lugar errado:** era atribuída à edição de 1786, e está
  na introdução da terceira edição. Ela **não aparece** no texto da de 1787.
- **Entrou uma frase nova, que data a invenção pela mão do autor:** *"It is now
  sixteen years since I first thought of applying lines to subjects of Finance."*
  A terceira edição é de 1801, e dezesseis anos antes dá 1785, o ano da edição
  preliminar privada que o capítulo já citava.
- **O capítulo registra o próprio erro ao leitor**, porque é o padrão que o V.4
  descreve: a procedência apodrece antes do conteúdo, e variação que não atrapalha
  a leitura não é corrigida por ninguém. Desta vez o caso é de dentro de casa.
- Beniger & Robyn ganhou ficha com DOI; a frase citada deles continua ⏳.

### Alterado — o quarteto de Anscombe deixa de ser "praticamente idêntico" (cap. I.4)
- **Os seis números entraram numa tabela**, recalculados sobre os onze pontos de
  cada conjunto: médias de 9,00 e 7,50, variância de x igual a 11,00 nos quatro,
  correlação 0,816 (0,817 no quarto) e a mesma reta 3,00 + 0,500x. O capítulo
  dizia "praticamente idênticas" e agora mostra o quanto.
- A descrição do quarto conjunto ficou verificável em vez de impressionista:
  `x` vale **8 em dez dos onze pontos**, com um único ponto em 19.
- **Uma distinção que o capítulo passa a fazer:** os valores estão ✓ porque foram
  recalculados; a ficha do artigo de Anscombe está ✓ᵐ porque só o DOI foi
  conferido, e o artigo segue fechado. A atribuição dos dados a ele passa pela
  distribuição do R, não pela leitura da tabela original.
- Tukey (1962) ganhou ficha com DOI, e o registro de que o texto **não abriu**.

### Corrigido — o mecanismo do *Patient ID*, no capítulo I.3
- **A explicação estava plausível e errada.** O capítulo dizia que o identificador
  do paciente previa câncer porque refletia "a organização da fila do hospital",
  com exames de triagem de rotina contra encaminhamento suspeito. A análise da
  competição diz outra coisa: a base juntou **várias fontes** (estudos clínicos,
  instituições, equipamentos), algumas das quais escolheram a população *"with
  prior knowledge of the patient's condition"*, e a junção manteve identificadores
  consecutivos por fonte, feita *"without obfuscating the source"*. O número do
  paciente era o nome da fonte, disfarçado de número.
- O texto do artigo foi extraído e lido, e com ele subiram a ✓ as competições
  citadas como gatilho (INFORMS 2010, IJCNN 2011, KDD-Cup 2007 sobre as bases da
  Netflix) e o caso do *Patient ID*.
- **Uma distinção de versão que o capítulo não fazia:** o que se leu é a versão de
  conferência (KDD '11, três autores). A versão citada pelo capítulo é a de *TKDD*
  6(4), 2012, com Stitelman como quarto autor, e **essa** continua ⏳.

### Alterado — o capítulo I.2 sai de cinco ⏳ e ganha o lado que dá para citar
- **O lado Kimball da disputa passou a ✓**, com duas definições citadas das páginas
  de técnicas dos próprios autores: a arquitetura de barramento e a dimensão
  conformada. A definição de dimensão conformada é **mais estreita** que a paráfrase
  que o capítulo usava: *"same column names and domain contents"*, e não "a mesma
  chave e o mesmo significado". O texto foi ajustado à fonte.
- **As duas obras ganharam ficha conferida** em catálogo: Inmon, *Building the Data
  Warehouse*, Wiley, 1992; Kimball, *The Data Warehouse Toolkit*, Wiley, 1996.
- **A assimetria ficou declarada ao leitor:** o lado Kimball está citado do site dos
  autores e o lado Inmon continua em fonte secundária. Onde só um lado de uma
  controvérsia está verificado, o capítulo diz qual.

### Corrigido — dois fatos do capítulo I.1, derrubados pelo guia CRISP-DM
- **O consórcio tinha quatro membros, não cinco.** O capítulo listava ISL, Teradata,
  NCR, Daimler-Benz e OHRA. A página de propriedade do guia lista NCR,
  DaimlerChrysler, SPSS e OHRA: **Teradata é a linha de *data warehouse* da NCR**,
  não um membro, e **ISL é o nome anterior da própria SPSS**. O capítulo contava
  duas vezes a mesma empresa e promovia um produto a organização.
- **ESPRIT não aparece no documento.** O capítulo dava o programa como financiador;
  o guia diz apenas *"obtained funding from the European Commission"*. A atribuição
  a ESPRIT desceu para ⏳, com a razão escrita.
- As 78 páginas do guia foram extraídas e lidas, então a estrutura de seis fases, a
  cronologia, os testes na Mercedes-Benz e o Clementine de 1994 subiram de ✓ᵐ para
  ✓, com as frases do prefácio citadas.
- A síntese do capítulo, que repetia "1996–1999, ESPRIT", foi corrigida junto.

### Alterado — a coluna de fontes abre para valer, no capítulo 0.2
- **A tabela de selos do 0.2 foi refeita, uma obra por linha.** Antes, uma única
  linha ✓ᵐ cobria cinco trabalhos de status muito diferente. Selo médio esconde
  a fonte mais fraca do conjunto, que é o oposto do que o selo existe para fazer.
- **A carta do *double descent* foi lida por inteiro** (Loog, Viering, Mey,
  Krijthe & Tax, PNAS 2020), com a lista de referências conferida. O capítulo
  agora nomeia quem viu antes, com ano: Vallet *et al.* (1989) experimentalmente,
  Opper *et al.* (1990) no primeiro resultado teórico, Duin (2000) em dado real.
- **Belkin *et al.* ganhou o selo ✓ᵃ** (resumo lido no original, ADR 0005), e o
  texto passou a citar o resumo entre aspas em vez de afirmar o que o corpo
  demonstra — que é exatamente o que esse selo não autoriza.
- **Larson (1931) saiu de "um psicometrista de sobrenome Larson" para a citação
  completa**: S. C. Larson, *Journal of Educational Psychology* 22(1):45–55, DOI
  conferido. A **primazia** dele continua ⏳, porque metadado prova que a obra
  existe e não que ela foi a primeira.
- **A regra de método que este ciclo deixou registrada:** resumo de máquina não
  confere fonte. Uma extração automática afirmou que a carta **não** mencionava
  física estatística, e quase enfraqueci uma frase correta do livro por causa
  disso; o texto extraído localmente diz *"various physics papers on learning"*.

### Adicionado — as fontes de vazamento medidas lado a lado (cap. I.3)
- **`anima-vazamento`**: as três fontes do capítulo com a intensidade subindo de
  0 a 1, partindo todas da mesma AUC (0,570) porque na intensidade 0 são o mesmo
  experimento honesto. Alvo disfarçado chega a **0,991**, duplicata a **1,000**.
- **A curva do meio é o assunto.** Normalizar antes de dividir, que é o erro mais
  comum, mede **−0,003** — e vira +0,002 em outro conjunto de sorteios. O sinal
  não é estável: o efeito é indistinguível de zero, e é por isso que ninguém o
  detecta. A spec antiga prometia um tombo de AUC aqui, contra o próprio texto do
  capítulo; foi corrigida antes de virar código e a medição foi ainda mais longe.
- **Entrou uma quarta curva, que é a mesma fonte sobre outra estatística:**
  codificar por alvo antes de dividir, numa categórica de alta cardinalidade,
  infla **+0,183**. Mesmo descuido, sessenta vezes mais. A lição do capítulo
  ficou melhor que a da spec: o tamanho do vazamento não se lê no erro, e sim no
  quanto a estatística vazada se mexe.
- **Cada ponto é a média de 8 sorteios independentes**, porque um sorteio só não
  sustenta uma afirmação da ordem de milésimos.
- `publicar/testes/anima-vazamento.mjs`, com oito asserções — incluindo a de que
  as quatro curvas partem do mesmo ponto, que pegou dois defeitos de simulação:
  a categoria sumindo na cópia das linhas duplicadas (a duplicata media 0,737 em
  vez de 1,000) e uma fonte rodando com uma coluna a mais que as outras.

### Adicionado — três taxas de aprendizado na mesma paisagem (cap. II.4)
- **`anima-taxas`**: 0,001, 0,1 e 1,5 descendo ao mesmo tempo, partindo do mesmo
  ponto. Diagnóstico por forma de curva é a habilidade do capítulo, e forma não
  se compara em sequência. A taxa 1,5 sai da moldura, com seta marcando a época
  em que passou do teto; a fronteira de estabilidade desta paisagem é **1,0**,
  e o texto diz por quê.
- **O botão troca só a PERDA, mantendo as três taxas idênticas.** Mudar duas
  variáveis de uma vez não é experimento. Com erro quadrático a taxa 1,5
  estoura; com perda logística, sobre o mesmo dado, ela termina em **0,1455** e
  é a **melhor das três**. A taxa destrutiva numa paisagem é a mais eficiente na
  outra, que é a sutileza medida na etapa 05–06.
- **Um rótulo ganhou critério declarado:** "quase parada" passou a ser menos de
  **10% de queda em 60 épocas**, em vez de um corte escolhido até o rótulo sair
  bonito.
- `publicar/testes/anima-taxas.mjs`, com seis asserções sobre valores medidos, e
  visto falhando ao se trocar um dígito do esperado.

### Adicionado — a animação da tese do livro (viés e variância, cap. 0.2)
- **`anima-vies-variancia`**: o grau do polinômio sobe de 1 a 15, o erro de
  treino só desce e o de validação **vira para cima no grau 5**. É o único lugar
  do livro em que o cruzamento acontece na tela, e não numa tabela.
- **O piso irredutível ficou visível.** A validação leva ruído próprio, então o
  fundo da curva bate em ~0,011, que é a variância do ruído. E o erro de treino
  descendo **abaixo** desse piso é a assinatura de um modelo ajustando ruído.
  Com validação limpa, como estava na primeira versão, o terceiro termo da
  decomposição sumia do desenho.
- **A previsão do autor estava errada, e a lição medida é melhor.** A spec dizia
  que com 3× mais dados o joelho andaria para a direita. Ele não anda: fica no
  grau 5 nos dois casos. O que desaba é o **castigo** por passar dele, de ~0,48
  para ~0,015 no grau 15. O capítulo passou a ensinar isso.
- **O ajuste é por Gram-Schmidt (A = QR), não pela equação normal**, porque no
  grau 15 a equação normal faria a validação explodir por ponto flutuante em vez
  de por sobreajuste — a animação certa contando a história errada.
- `publicar/testes/anima-vies-variancia.mjs`, com seis asserções, todas
  derivadas de medição. Ele pegou um `>` que devia ser `>=` e por isso o rótulo
  "varredura completa" nunca chegava ao placar, que é o que o leitor sem visão lê.

### Adicionado — a prova final, e as sete provas do livro completas
- **Prova final** (`livro/provas/prova-final.md`), quatorze itens que cruzam
  **partes**, e não apenas capítulos: a hipótese de mesma distribuição contra
  drift; o XOR como problema de representação; acurácia enganosa e silhueta
  enganosa como a mesma armadilha; o vazamento da Parte I reaparecendo como
  divergência entre treino e serviço na Parte V.
- Com ela, as **7 provas** existem: seis de parte mais a final, 70 itens, todos
  determinísticos, com cenário inédito e sem `volte para`. Nenhuma vale nota, e
  nenhuma entra no corpus do tutor.

### Adicionado — a Parte V fecha, e com ela os 29 capítulos
- **Prova da Parte V** (`livro/provas/prova-parte-v.md`), dez itens cruzados
  sobre os quatro capítulos da parte, todos com cenário inédito e correção
  determinística. Vários cruzam para fora da parte, que é o que a Parte V faz:
  pega o livro em condição de laboratório e pergunta o que sobra no mundo.
- **Nove exercícios no V.4**, fechando três por objetivo. Com isso **a coluna de
  exercícios fecha nos 29 capítulos**: 342 de capítulo, três por objetivo, em
  escada e com teto no verbo declarado.

### Adicionado — o V.3 ganha a fronteira do serviço, e a lista de dívidas do gate zera
- **Seção "A fronteira do serviço: contrato e validação de entrada"** no V.3,
  dentro de "Fundamentos". O capítulo prometia implantar atrás de uma API com
  contrato e validação e **não tratava da fronteira em lugar nenhum**. Decidido
  pelo [ADR 0017](adr/0017-a-fronteira-do-servico-entra-no-v3.md).
- **O exemplo trabalhado é o backend deste próprio livro** (`chat-companion/backend/app.py`),
  com linha citada, e **com os defeitos dele em voz alta**: não versiona endpoint
  e não conta nenhuma rejeição. Um serviço real que o leitor pode abrir vale mais
  que um exemplo inventado, inclusive onde está abaixo do que o capítulo recomenda.
- **A política de violação é apresentada como decisão, não como prescrição.**
  Nenhuma fonte aberta diz o que fazer quando uma requisição viola o contrato,
  e isso ficou registrado com selo ❌ em vez de virar opinião com aparência de
  fonte. O capítulo mostra as três políticas convivendo no mesmo serviço e
  ensina que a escolha é escrita no contrato.
- **Nove exercícios novos no V.3**, fechando três por objetivo. O difícil do O2
  é desafio aberto na Verificação, com rubrica, para não pagar a D16 engordando
  a D13.
- **`ORFAOS_ACEITOS` ficou vazia** em `publicar/exercicios.mjs`: a dívida D16 foi
  paga pelos dois lados, e nenhum verbo foi rebaixado para caber no que já
  estava escrito. A checagem inversa continua ligada.

### Adicionado — o V.2 passa a ensinar o que prometia
- **Seção "Decidir a forma de serviço pelo requisito"** no capítulo V.2, com os
  quatro eixos da escolha (quando a decisão é necessária, custo do atributo
  dentro do orçamento de latência, frescor, volume) e a armadilha nas duas
  direções. O capítulo declarava esse objetivo desde sempre e **não o ensinava
  em lugar nenhum**; quem ensinava era o V.3, sem que nenhum objetivo de lá
  cobrisse a tabela. Decidido pelo [ADR 0016](adr/0016-a-quem-pertence-a-escolha-da-forma-de-servico.md), que paga a primeira metade da dívida D16.
- **Nove exercícios novos no V.2**, fechando três por objetivo nos quatro
  objetivos, em escada e com teto no verbo declarado.
- **Quatro fontes abertas em primeira mão** para sustentar a seção nova: as
  regras #31 e #32 das *Rules of Machine Learning*, o texto do Michelangelo e o
  artigo de Chip Huyen de 2022. Duas afirmações que estavam em ⏳ subiram para
  ✓; duas que o texto aberto **não** confirmou ficaram em ⏳, com a razão escrita.
  Uma citação relatada por um dos especialistas estava quase certa e não era
  literal, e foi corrigida contra o texto antes de entrar no livro.

### Alterado — o V.3 devolve o que não era dele
- **A tabela das três formas de serviço saiu do V.3**, onde vivia sem objetivo
  que a cobrisse. Ficou uma remissão ao V.2 e o que de fato pertence ao capítulo
  de operação: como a forma escolhida muda a promoção e o rollback.
- `publicar/exercicios.mjs`: a exceção `v-2 O4` saiu de `ORFAOS_ACEITOS` no
  mesmo commit em que a dívida foi paga, como o próprio gate exige.

### Adicionado — os endereços antigos voltam a chegar ao capítulo
- **29 redirecionamentos**, um para cada capítulo renumerado pelo ADR 0011.
  `05-modelos-lineares.html` → `ii-2-modelos-lineares.html`, e assim por diante.
  O ADR aceitou quebrar os endereços; a conta chegou no meio do semestre, em
  link de slide, de PDF de aula, do Moodle e de favorito de aluno.
- **A âncora e a query sobrevivem** — `05-modelos-lineares.html#o-caso-da-limonada`
  chega em `ii-2-modelos-lineares.html#o-caso-da-limonada`. É o caso que mais
  importa, porque link de aula aponta para a *seção*, e o `meta refresh`
  sozinho descartaria o fragmento. Verificado num navegador de verdade.
- **Stub em HTML, não configuração de provedor**: o livro é servido em dois
  lugares até o passo 8 da migração, e um arquivo funciona nos dois.
- O mapa (`publicar/redirecionamentos.json`) foi **derivado da detecção de
  rename do git**, não escrito à mão. Dois gates novos: uma rota que colida com
  uma página viva (o stub apagaria o capítulo) ou que aponte para página
  inexistente quebra o build.

### Corrigido — o tutor citava numeração que não existe mais
- **"Qual o capítulo do neurônio artificial?" → "Capítulo 18", citando o
  `HISTORICO.md`.** Depois do ADR 0011 o capítulo é **III.1**, e a posição de
  leitura é 17 — o 18 não existe em lugar nenhum do livro atual. Três causas
  somadas, todas medidas antes de qualquer conserto:
  1. **O `HISTORICO.md` entrava no corpus** com o mesmo peso de um capítulo — e
     ele guarda numeração de edições antigas *por construção*. Editar o arquivo
     não resolveria: cada edição nova acrescenta numeração que envelhece. Saiu
     do índice, junto com o guia editorial e a documentação do banco.
  2. **Os blocos não sabiam de que capítulo eram.** Só o bloco do H1 continha o
     nome, então perguntar por um capítulo não recuperava esse capítulo — na
     medição, o capítulo do neurônio não aparecia entre os três primeiros.
     Agora todo bloco herda "Parte III … · III.1 — O Neurônio Artificial",
     vindo do `sumario.json`, que é a fonte da numeração vigente.
  3. **`buscar()` nunca entregava o nome canônico ao modelo** — só caminho de
     arquivo e título de seção. O modelo *tinha* de deduzir o número do texto,
     e deduziu do texto histórico. Agora recebe o capítulo e a instrução
     explícita de não inferir numeração do conteúdo.
- Sete testes novos cobram as três causas, vistos falhando antes de valerem.

### Corrigido — onda 3: o download que entregava o gabarito
- **O botão "⬇ md" servia o arquivo-fonte cru.** `docs/md/machine-learning.md`
  trazia **79 gabaritos e 30 rubricas**, e o botão fica na página do capítulo,
  ao lado do exercício que deveria custar duas tentativas. O desenho estava
  certo — `renderizar()` protege o HTML — e a promessa era falsa, porque
  ninguém tinha conferido a outra porta. `semGabarito()` limpa a exportação
  (gabarito, `porque`, rubrica e a marcação `- [x]`), preservando enunciado,
  alternativas e o `volte para`. **Gate novo**, visto falhando com 273
  vazamentos antes de ser dado por pronto.
- **Rubrica partida por `;` dentro do critério.** A rubrica é quebrada em `;`,
  então `"aponta um mecanismo (A; B; C)"` virava **três critérios**. Como
  `correto = atendidos == total`, quem respondesse exatamente o que foi pedido
  — *um* mecanismo — falharia em dois. Atingia `ciclo-ciencia-de-dados-e5`, já
  publicado. Gate novo: parêntese desbalanceado no critério quebra o build —
  e ele **pegou o mesmo erro sendo cometido de novo**, uma hora depois, na
  redação de um exercício novo. Um segundo gate (teto de 6 critérios) cobre a
  variante que o parêntese não vê: lista com `;` sem parêntese nenhum, que
  transformou "cite ao menos três" em oito exigências simultâneas.

### Adicionado — onda 3: a promessa dos objetivos
- **Vinte e um exercícios novos, 101 → 122.** Dezoito pagam objetivos que não
  tinham cobrança nenhuma (**D11: 20 → 2**); três fecham os órfãos abertos ao
  reapontar exercícios mal mapeados — que o gate bidirecional da onda 1
  detectou no mesmo instante, como projetado.
- **Os 2 órfãos restantes não são falta de exercício, e sim de conteúdo** (D16).
  `v-2` declara "decidir entre lote e tempo real pelo requisito" e quem ensina
  isso é o **`v-3`** — com a frase "escolhidas pelo requisito e não pelo gosto",
  que é a redação do objetivo do outro capítulo. Escrever exercício ali seria
  cobrar o que o capítulo não ensina; a saída é editorial, e ficou registrada.
- **[ADR 0012](adr/0012-verificacao-como-superficie-corrigida.md) — a seção
  `## Verificação` vira superfície corrigida, uma pergunta por capítulo.** Três
  pareceres independentes (avaliação, arquitetura, professor com turma em
  curso) convergiram em não converter as ~87, não criar tipo novo de bloco e
  fasear. Divergiram sobre revelar a solução; o desacordo se resolve revelando
  **os critérios**, não a solução pronta — o exemplo trabalhado vai para o
  corpo do capítulo, onde serve o leitor solitário sem queimar a aula seguinte.
  Marcação por atributo `secao`, agora carregado até o `banco.json`.
- **Rubrica de 4 critérios obrigatória** nesses desafios, sendo o quarto o
  **anti-critério** — o movimento errado comum, nomeado.
- **As perguntas que ficam sem correção agora dizem por quê**, em vez de o
  leitor ter de adivinhar. Três delas continuam sem correção de propósito:
  dependem de material que só o leitor tem à mão, e rubricar artefato que o
  corretor não viu seria fingir correção.
- **O índice dos ADRs voltou a existir**: tinha parado no 0003 por oito
  registros. Índice que não acompanha é pior do que índice nenhum.

### Corrigido — onda 2: o dano direto ao aluno
- **O laboratório do `I.4` deixou de ser sabotado pelo próprio capítulo.** O
  enunciado pedia "encontre as duas colunas surpreendentes" e **duas linhas
  depois** entregava "62 outliers" e "média 0,83, mediana 0,74, 28 pontos". O
  leitor lia a saída em vez de produzi-la. Agora um exercício **numérico** pede
  o número que só o painel mostra, e os seguintes partem dele. 101 exercícios.
- **A perda tinha três escalas no `II.2`** — $\frac{1}{2n}$ no texto, sem
  constante na dedução, e `sqe/n` no laboratório. O número que o aluno anotava
  não era o que o capítulo definia. Unificado no **EQM** ($\frac{1}{n}$), com
  as duas convenções alternativas explicadas e a razão de elas não moverem o
  mínimo. `EQM`, `SQE` e `EAM` entraram no mapa de siglas.
- **`validação cruzada` e `dobra` eram instrução sem definição** — o `I.6` manda
  "calcule só no treino, e por dobra" e a unidade não existia no livro. Definidas
  no `0.2`, com as três armadilhas que a definição não deixa ver.
- **31 termos novos no glossário**, cobrindo o vocabulário de `I.3`, `I.4`,
  `I.6`, `II.1`, `II.2` e `II.3` — os capítulos das disciplinas em curso.
  Inclusive **chance (*odds*)**, cuja ausência derrubava a tese do `II.3`.
- **Duas trilhas violavam pré-requisito.** Em Ciência de Dados, Fundamentos vinha
  **depois** do capítulo de vazamento, que usa *overfitting* e validação cruzada
  como se o leitor soubesse; em Análise Preditiva, era **leitura opcional** — e o
  capítulo de ensembles apoia a seção inteira de bagging na decomposição
  viés–variância, dizendo isso com todas as letras. Reordenadas.
- **A abertura do `II.2`, a mais fraca do livro**, abria com um erro *do livro*
  ("o capítulo II.5 mostrou o linear perdendo feio"), quatro dígitos e dois
  jargões antes de qualquer cena — e dependia de um capítulo que a disciplina de
  Análise Preditiva não usa. Agora abre com o banco que precisa negar crédito e
  explicar por quê. A comparação numérica migrou para onde há contexto para ela.
- **Duas frases diziam o contrário do pretendido**: "refeitas **de graça**" (era
  *à toa*) e "o fenômeno que **apareceu** … mais adiante" (pretérito para o que
  ainda vem). E **"a cerca de 1,5 × IQR"** lia-se como "aproximadamente" —
  virou "a **regra da** cerca", com o termo técnico enfim nomeado onde é
  apresentado.
- Siglas expandidas na primeira ocorrência: **CRISP-DM**, **ESPRIT**, *workbench*
  e **churn**, todos órfãos na abertura do capítulo mais introdutório da trilha.
- **56 rótulos de link** ainda mostravam o número antigo no formato
  `[19 — O Ciclo…]` — outro padrão que a migração não pegou.

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
