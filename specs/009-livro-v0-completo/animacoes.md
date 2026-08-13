# Mapa das animações — o que anima em cada capítulo

> Parecer do comitê, aceito. A decisão de vocabulário (quarta superfície ou
> laboratório em modo demonstração) fica no ADR 0015.

## O critério

**Anima-se o que tem estado que evolui e um número que o leitor consegue prever errado.**

Não é "tem método", nem "tem gráfico". Capítulo de processo, de decisão e de governança podem animar, desde que o que se move não seja a caixa do diagrama, e sim a consequência quantificada de mexer num controle. Não animam: arquitetura, catálogo, e o que já é laboratório manipulável.

## O teste contra a decoração

Uma animação ensina se passa nos três:

1. há **número nomeado** na tela que muda com o quadro;
2. há **um controle cujo resultado o leitor consegue errar ao prever**;
3. **pausada num quadro qualquer**, ela responde a uma pergunta do capítulo.

Só o primeiro é ilustração. Só o terceiro é figura estática que se mexe. Sem o segundo, é a bolinha rolando no vale.

## A tabela

| Cap. | O que anima, e qual número cai na tela |
|---|---|
| 0.1 | **não animar** — é orientação de leitura, não procedimento |
| 0.2 | **feita** — grau do polinômio de 1 a 15: treino sempre descendo, validação virando no grau 5, o piso do ruído visível e o botão dos 3× dados |
| I.1 | horizonte do rótulo deslizando de 30 para 90 dias: % de clientes ainda acionáveis caindo, com a AUC subindo junto |
| I.2 | **não animar** — arquitetura não tem estado que evolui |
| I.3 | **feita** — as três fontes de vazamento com a intensidade subindo, e uma quarta curva (codificar por alvo) que é a fonte 2 sobre outra estatística |
| I.4 | **não animar** — já tem `explorar-variavel`, e manipular ensina mais que assistir |
| I.5 | base do eixo y subindo de 0 a 95: razão percebida entre as barras de 1,05 para 4,0, com os valores reais fixos |
| I.6 | escala de uma coluna × 100: quantos dos 5 vizinhos trocaram, e o rótulo previsto virando |
| II.1 | **feita** — limiar descendo de 0,98 a 0,00: matriz de confusão, acurácia, precisão e revocação mudando junto, o ponto andando sobre a ROC, e o botão da prevalência de 1% |
| II.2 | gradiente ajustando a reta: soma dos quadrados caindo, e a distância até o ótimo das equações normais |
| II.3 | \|w\| crescendo: log-loss ainda caindo depois que a acurácia estagnou |
| II.4 | **feita** — três taxas (0,001 / 0,1 / 1,5) na mesma paisagem, a terceira saindo da escala, mais o botão que troca só a perda e faz a mesma 1,5 virar a melhor das três |
| II.5 | árvore crescendo corte a corte com o ganho de Gini; depois o boosting, com o resíduo médio encolhendo por árvore |
| II.6 | **não animar** — drill-down é navegação; cubo girando é decoração |
| II.7 | janela *walk-forward* avançando: MAE por dobra, contra o MAE menor e mentiroso da divisão embaralhada |
| II.8 | custo do falso negativo de 1 para 10: o limiar ótimo se deslocando e o lucro esperado em reais |
| III.1 | **feito** — o perceptron aprendendo, e o XOR onde ele não para |
| III.2 | **feito** — MLP no mesmo XOR do III.1: as duas retas girando, mais o botão que tira a camada e o que estraga a inicialização |
| III.3 | **feita** — a retropropagação descendo 20 camadas: 1,4e-12 na primeira com sigmoide + Xavier, 1,2e-3 com ReLU + Xavier (a ReLU sozinha não basta) e 0,86 com ReLU + He |
| III.4 | filtro deslizando com o mapa de ativação: nº de parâmetros (densa 3,2 M × conv 2 400) **e o botão que desloca a imagem 3 px** |
| III.5 | pesos de atenção acendendo numa frase, contra o sinal de gradiente da RNN caindo a zero em 11 passos |
| III.6 | **não animar** — nada treinável honestamente no navegador vira encenação |
| IV.1 | **feito** — atribuir e recentrar alternando, com o botão da semente infeliz |
| IV.2 | grid-world com a Q-table pintando: recompensa por episódio e ε caindo; com ε=0 o agente trava num caminho pior |
| IV.3 | algoritmo genético: melhor aptidão subindo enquanto a diversidade colapsa |
| V.1 | **feito** — limiar de um grupo movendo, com o botão que iguala as prevalências |
| V.2 | **não animar** — dívida técnica não tem dinâmica observável em 30 s |
| V.3 | distribuição deslocando: o PSI cruzando 0,25 dias antes de a AUC real cair |
| V.4 | **não animar** — é placar, e tabela datada é a forma certa |

**22 animações, 7 capítulos sem.**

> **Correção de 2026-08-13.** Esta linha dizia "23 animações, 6 capítulos sem", e a
> conta estava errada por um: as linhas com "**não animar**" na tabela acima são
> **sete** (0.1, I.2, I.4, II.6, III.6, V.2 e V.4), e 29 − 7 = 22. O erro tinha sido
> copiado para o ledger, que dizia "7 feitas, 16 pendentes"; são 15 pendentes. É a
> mesma classe de defeito que o gate de `publicar/intervalos.mjs` passou a cobrar no
> corpo do livro: **número escrito à mão ao lado da lista que o determina**. A lista é
> a fonte da verdade; a soma é derivada dela.

## As cinco primeiras, em ordem

1. **0.2** — viés e variância. É a tese do livro, e a única em que se vê o cruzamento acontecer. Tabela mostra dois números; a animação mostra o instante em que um vira.
2. **II.4** — três taxas de aprendizado. Diagnóstico por forma de curva é a habilidade do capítulo, e exige ver as três formas ao mesmo tempo.
3. **V.1** — a impossibilidade da justiça. Teorema de impossibilidade fica abstrato até o leitor tentar satisfazer os três critérios com a mão no controle e falhar.
4. **IV.1** — k-means com ótimo local. Ensina o mais difícil: método correto, execução correta, resposta errada, e só a semente mudou.
5. **III.2** — XOR resolvido. Fecha o arco que a oscilação do III.1 abriu.

## Dívida a pagar ANTES da segunda animação — **paga**

`animaPerceptron` já duplica, em outra forma, o que `regressaoLinear` tem: a função de escala, o preâmbulo de tema escuro, o construtor de botão, e o par `setInterval` + `prefers-reduced-motion`.

Extrair um núcleo (`plano(cv)`, `placar()`, `relogio()`) **com duas animações, não com oito**. Cinco módulos cobrem as 23:

| Módulo | Cobre |
|---|---|
| **A.** laço de descida com placar | 0.2, II.2, II.3, II.4, III.1, III.2, III.3 |
| **B.** limiar sobre scores fixos | II.1, II.8, V.1, V.3 |
| **C.** particionar e recalcular critério | IV.1, II.5, I.6 |
| **D.** janela deslizante no tempo | II.7, V.3, I.3 |
| **E.** melhor-até-agora por episódio | IV.2, IV.3 |


## O que a segunda animação ensinou (2026-08)

**A dívida foi paga como a ADR mandava**, com duas animações e não oito.
`temaEscuro`, `tela` (canvas + escala + moldura), `placarDe`, `botoeiraDe` e
`relogio` saíram para o núcleo; `animaPerceptron` foi reescrito sobre ele sem
mudar de comportamento. O relógio concentra as três decisões que custaram caro
e que nenhuma animação nova deveria redescobrir: só começa quando o leitor
chega, entrega o resultado a quem pediu menos movimento, e redesenha na troca
de tema.

**E a animação nasceu errada, de novo pelo mesmo motivo do III.1.** A primeira
semente escolhida a esmo caía num mínimo local: a rede empacava em ~25 de 48
com a perda parada em ln(2)/2, enquanto o texto do capítulo prometia "assista
até a contagem fechar". Build verde, canvas desenhando, página montando — e o
comportamento errado. Só apareceu porque rodei o `laboratorios.js` real num DOM
mínimo e li o placar.

Dois achados do diagnóstico, ambos guardados:

1. Varrendo 60 inicializações sobre o mesmo dado, **44 resolvem e 16 não**. O
   gradiente estava certo o tempo todo.
2. O mínimo local é do **par (dado, início)**, não do início sozinho. Quando
   fixei o dado e variei só a semente dos pesos, a semente que falhava passou a
   resolver. Por isso `dados()` usa sempre a semente boa: com o dado fixo, o
   botão isola a variável que ele diz isolar.

Em vez de trocar a semente e esconder o achado, a semente ruim virou **botão**,
porque "inicialização ruim" é literalmente o objetivo O4 do capítulo. O teste
está versionado em `publicar/testes/anima-mlp-xor.mjs` e foi visto falhando.

**Para as próximas 21:** nenhuma animação entra sem um teste que rode o método
e confira o número que o texto promete ao leitor. Foi a segunda vez que uma
animação passou no build e falhou com o leitor.


## O que a terceira animação ensinou (2026-08)

**O núcleo passou no teste de família.** As duas primeiras animações eram
"laço de descida com placar" (módulo A); o k-means é "particionar e recalcular
critério" (módulo C). `tela`, `placarDe`, `botoeiraDe` e `relogio` vieram
inteiros, sem adaptação, e o que a nova precisou escrever foi só o que é dela.
Isso é evidência de que a extração feita na segunda pegou o recorte certo — e
não uma abstração do primeiro caso disfarçada de núcleo.

**A previsão de "18% pior" estava errada, e o valor medido é 10×.** A linha
desta tabela foi escrita antes de construir. Com três grupos bem separados, a
semente infeliz funde dois grupos verdadeiros e parte o terceiro: a inércia vai
de **2,243** para **24,159**. Corrigi a linha em vez de forçar o dado a caber na
previsão.

O número maior é melhor para ensinar e pior como alerta, e o texto do
laboratório diz isso ao leitor: aqui o estrago é escandaloso e qualquer
comparação o pegaria; o caso perigoso é quando a partição infeliz sai só um
pouco pior e ninguém tem com o que compará-la.

Uma decisão de ritmo que vale para as próximas: **um passo do relógio é meia
iteração**, com atribuir e recentrar separados. Ver os dois movimentos alternando
é o que mostra que o método são dois gestos, e não uma caixa que devolve grupos.

Teste em `publicar/testes/anima-kmeans.mjs`, visto falhando.


## O que a quarta animação ensinou (2026-08)

**Terceira família servida pelo mesmo núcleo** ("limiar sobre scores fixos").
Nada é treinado: os escores existem desde o começo e só o limiar se move. O
núcleo veio inteiro de novo.

**Duas armadilhas de construção, e as duas mudariam o que o leitor aprende:**

1. *Calibração medindo artefato.* Na primeira versão os grupos não eram
   calibrados por construção, e a "calibração" media a forma como eu gerei o
   dado. Resultado: no máximo **um** verde, e o teorema não aparecia. A
   correção é gerar o escore primeiro e sortear `y ~ Bernoulli(escore)` —
   assim a calibração é premissa, como o teorema exige.
2. *Limiar degenerado satisfazendo tudo.* Varrendo a faixa inteira, os melhores
   resultados apareciam em limiares extremos, onde taxa de positivos e revocação
   colapsam para perto de zero nos dois grupos e "casam" trivialmente. Um limiar
   que quase não classifica ninguém satisfaz quase tudo, e exibi-lo como solução
   ensinaria o contrário do capítulo. A varredura ficou restrita à faixa de
   operação (0,25 a 0,75).

**Medido:** com prevalências 0,64 contra 0,36, o melhor desvio conjunto na faixa
é 0,037, acima da tolerância de 0,03 — nunca os três. Igualando as prevalências,
o melhor desvio cai para 0,018 e os três acendem. É por isso que o botão existe:
ele mostra que a impossibilidade depende de uma **condição do mundo**, e não do
modelo.

Teste em `publicar/testes/anima-justica.mjs`, visto falhando.

## Placar das previsões desta spec

Quatro animações construídas, cinco previsões escritas antes de medir:

| Previsão | O que o dado disse |
|---|---|
| III.2 — "a perda caindo até zerar" | ✅ zera, mas só com semente boa: 44 de 60 inicializações resolvem |
| IV.1 — "outra semente parando 18% pior" | ❌ **10× pior**, não 18% |
| V.1 — "sempre dois verdes e um vermelho" | ✅ dois é o teto, e a condição que levanta virou botão |
| 0.2 — "o erro de validação virando para cima" | ✅ vira, e o fundo fica no grau 5 |
| 0.2 — "com 3× mais dados o joelho anda para a direita" | ❌ **não anda**; fica no grau 5 nos dois casos |
| II.4 — "a terceira taxa saindo da escala" | ✅ estoura, e a fronteira de estabilidade tem valor fechado: 1,0 |
| II.4 — "com perda logística a mesma taxa não estoura" | ✅ e mais: ela vira a **melhor** das três (0,1455) |
| I.3 — "duas disparam e a do pré-processamento quase não se mexe" | ✅ e mais forte que o previsto: o efeito dela é −0,003, e o **sinal nem é estável** |

**Duas em sete previsões numéricas estavam erradas**, e nenhuma delas teria
sido detectada pelo build. É o argumento inteiro a favor de a animação vir com
teste.

## O que a quarta animação ensinou (0.2 — viés e variância)

**A previsão errada rendeu uma lição melhor que a certa.** Eu ia escrever que
mais dado move o joelho para a direita, porque é o que a intuição de "mais dado
sustenta mais complexidade" sugere. Medido: o joelho fica no grau 5 com 20 e com
60 pontos. O que desaba é o **castigo por passar dele**, de 0,48 para 0,015 no
grau 15. O capítulo passou a ensinar isso, que é mais útil: mais dado não
descobre o grau certo, ele torna o excesso quase inofensivo.

**Duas decisões de implementação viraram conteúdo.**

1. **A validação leva ruído próprio.** Na primeira versão ela era limpa, e a
   curva laranja descia até quase zero. Ficava bonito e apagava o terceiro termo
   da decomposição. Com ruído, o fundo bate em ~0,011, que é a variância do
   ruído: o **piso irredutível** deixou de ser um parágrafo e virou uma linha na
   tela. E o erro de treino descendo **abaixo** desse piso é a assinatura visual
   de ajustar ruído.
2. **O ajuste é por Gram-Schmidt (A = QR), não pela equação normal.** Com grau
   15 a matriz de Vandermonde é malcondicionada e a equação normal eleva isso ao
   quadrado. O erro de validação explodiria por ponto flutuante, e não por
   sobreajuste: a animação certa contando a história errada, sem nada acusar.

**Um defeito de contagem que só o teste pegou:** o rótulo "varredura completa"
nunca aparecia, por um `>` que devia ser `>=`. O placar é o que o leitor sem
visão lê, então era uma falha de acessibilidade silenciosa.


## O que a quinta animação ensinou (II.4 — três taxas)

**O experimento mudou uma variável só, e isso foi decisão de conteúdo.** A
tentação era usar taxa 1,5 no quadrático e 500 na logística, que são os números
que o capítulo mede na etapa 05–06. Mas aí duas coisas mudam ao mesmo tempo, e o
leitor não sabe a qual atribuir o resultado. Mantendo a taxa idêntica e trocando
só a perda, a comparação vira experimento: **mesma taxa, mesma paisagem, mesmo
ponto de partida, resultado oposto**.

**O achado que não estava previsto:** na perda logística, a taxa 1,5 não apenas
sobrevive — ela termina em 0,1455 e é a **menor perda das três**. A taxa
"perigosa" é a mais eficiente ali. Isso reforça a lição do capítulo em vez de
apenas ilustrá-la: se a mesma taxa é destrutiva numa paisagem e ótima na outra,
não existe taxa boa em abstrato.

**Um rótulo precisou de critério declarado.** "Quase parada" estava saindo como
"descendo" para a taxa 0,001, por uma diferença de fração de ponto no corte. Em
vez de mexer no número até o rótulo sair bonito, o corte foi escrito: **menos de
10% de queda em 60 épocas é "quase parada"**, que é a leitura de "desce, mas
quase imperceptivelmente" da tabela do capítulo. Corte arbitrário e não
declarado é o começo de um número escolhido para agradar.

**O núcleo aguentou o terceiro módulo.** `tela`, `placarDe`, `botoeiraDe` e
`relogio` vieram inteiros de novo. Esta é do módulo A (laço de descida com
placar), que cobre 7 das 23 — e é a primeira do módulo a rodar **três** laços
simultâneos, sem que o núcleo precisasse saber disso.


## Correção de spec: a animação do I.3 (achada antes de construir)

A linha do I.3 nesta tabela prometia **"AUC 0,94 → 0,71"** para o
`StandardScaler` ajustado antes da divisão. **O próprio capítulo I.3 diz o
contrário**, e com todas as letras:

> "O efeito costuma ser pequeno — décimos de ponto. É justamente por isso que é
> perigoso: pequeno demais para levantar suspeita, grande o bastante para decidir
> qual modelo vai a produção."

Construir a animação como estava escrito exigiria forjar o dado até o número
aparecer, e o resultado seria uma animação contradizendo o capítulo que ela
ilustra. É o mesmo erro do IV.1 ("18% pior", medido em 10×), com a diferença de
que desta vez ele foi pego **antes** de virar código.

**A spec nova.** Animar as **três** fontes de vazamento ao mesmo tempo, cada uma
com uma intensidade que sobe de 0 a 1, e uma curva de AUC medida por fonte:

| Fonte | O que a intensidade varre |
|---|---|
| 1. alvo disfarçado | quanto da coluna vazada depende do rótulo |
| 2. pré-processamento antes da divisão | quanto do teste entra no ajuste do normalizador |
| 3. duplicata entre conjuntos | fração de linhas do teste que também estão no treino |

A lição fica melhor que a da spec antiga, e é a do capítulo: **duas curvas
disparam e a do meio quase não se mexe** — e é justamente a do meio que vai para
produção, porque ninguém desconfia de um ganho de décimos.

Os números entram no texto **depois de medidos**, nunca antes.


## O que a sétima animação ensinou (I.3 — as fontes de vazamento)

**Esta é a primeira animação cuja spec já estava corrigida antes da primeira
linha de código** (ver a nota da correção acima), e ainda assim a medição mudou
o desenho dela duas vezes.

**Primeira mudança: a curva do pré-processamento é plana, e isso virou o
assunto.** A spec corrigida previa "quase não se mexe". Medido: **−0,003**, com
o sinal invertendo para +0,002 em outro conjunto de sorteios. Não é um efeito
pequeno, é um efeito **indistinguível de zero**. Escrever "pequeno" seria
generoso demais com a própria previsão.

**Segunda mudança: entrou uma quarta curva, e ela é a fonte 2 outra vez.**
Com a curva plana, a animação corria o risco de ensinar "normalizar antes de
dividir é inofensivo", que é o oposto do capítulo. A saída foi medir o **mesmo
erro sobre outra estatística**: codificação por alvo numa categórica de alta
cardinalidade. Mesmo descuido, +0,183 em vez de −0,003. O par 2 × 2b é a
animação inteira, e a lição ficou melhor que a da spec: **o tamanho do vazamento
não se lê no erro, e sim no quanto a estatística vazada se mexe.**

**Três decisões de simulação que eram armadilha:**

1. **Todas as fontes precisam partir do mesmo ponto.** A primeira versão dava
   AUC inicial diferente por fonte, porque uma delas tinha uma coluna a mais. A
   comparação media geometria, não vazamento. Hoje as quatro partem de 0,570 e o
   teste **cobra isso**.
2. **`cat` sumindo no `map`.** Duas fontes reconstruíam as linhas sem copiar a
   categoria, então a linha "duplicada" recebia outra codificação e deixava de
   ser duplicata. O vazamento aparecia menor do que é, por defeito da simulação.
   A duplicata ia a 0,737; corrigida, vai a 1,000.
3. **Um sorteio só não sustenta milésimos.** Cada ponto é a média de **8
   sorteios independentes**. Sem isso, a curva do pré-processamento media ruído
   amostral, e o sinal dela dependia da semente.

**O modelo é k-vizinhos, e por um motivo:** é o mais simples que memoriza. Com
um linear, a fonte 3 (duplicata) teria efeito perto de zero e o capítulo perderia
justamente "o modelo que já viu a prova".


## O que a oitava animação ensinou (II.1, 2026-08)

**A prevalência entra como PESO, e essa é a decisão inteira.** A tentação era
reamostrar: gerar 2000 casos com 1% de positivos e medir. Teria funcionado, e
teria arruinado a lição. O capítulo ensina que a AUC-ROC **não depende da
prevalência**, porque a ROC compara positivos com positivos e negativos com
negativos. Com reamostragem, o número mudaria no terceiro dígito por ruído
amostral, e o leitor atento veria tremer justamente o número que o texto promete
imóvel. Com π entrando como peso sobre dois poços fixos de escores, TPR e FPR
ficam **exatamente** invariantes, e o placar mostra 0,968 nos dois regimes,
dígito por dígito.

A regra que isto deixa: **quando a animação ensina "este número não muda", a
simulação tem de tornar isso verdade por construção, não por sorte.** Uma
animação que ilustra um teorema com ruído em cima está ensinando que o teorema é
uma tendência.

**Os números medidos, que são melhores do que a spec previa:**

| | equilibrado | 1% de positivos |
|---|---|---|
| AUC-ROC | 0,968 | **0,968** |
| AUC-PR | 0,925 | 0,578 |
| acurácia no limiar 0,88 | — | **0,992** |
| revocação no mesmo limiar | — | 0,168 |
| dizer "não" a tudo | 0,500 | 0,990 |

A linha da acurácia é o O1 do capítulo em um número: 0,992 de acurácia deixando
escapar 83% dos positivos. E o par AUC-ROC/AUC-PR é o O4 na mesma tela, sem
precisar de uma segunda figura.

**O botão pede a previsão antes de ser clicado**, e o texto do laboratório
manda escrever a resposta primeiro. É o requisito 2 do ADR 0015 levado à letra:
não basta o controle existir, o leitor precisa ter cometido a previsão errada
para que o clique ensine.

O teste (`publicar/testes/anima-limiar.mjs`) foi **visto falhando**: quebrei a
invariância fazendo `tpr` depender de π, e ele acusou 0,968 contra 0,874 na
linha certa, com as outras cinco asserções ainda verdes.


## O que a nona animação ensinou (III.3, 2026-08)

**A previsão da spec estava otimista por cinco ordens de grandeza, e para o lado
certo.** A tabela previa "1e-7 na primeira com sigmoide". Medido numa rede de 20
camadas por 48 unidades: **1,4 × 10⁻¹²**. A spec tinha estimado de cabeça a
partir do 0,25¹⁰ do corpo do capítulo, que é o **melhor caso** da derivada da
sigmoide; a rede real não opera no melhor caso, porque as ativações saem
descentradas de (0, 1) e a variância encolhe junto. Não corrigi a medição para
caber na previsão: corrigi a previsão.

**A lição de projeto é o segundo clique, não o primeiro.** Rede profunda mata o
gradiente é o que todo mundo já espera. O que quase ninguém prevê é que **a ReLU
sozinha não resolve**: ela melhora nove ordens de grandeza e ainda perde um fator
de mil, porque a dedução de Xavier supõe ativação linear. Sem esse segundo
clique, a animação ilustraria o que o leitor já sabe.

**Os três modos são a mesma rede**, sorteada do mesmo fluxo, com escala e
ativação diferentes. Entre Xavier e He os pesos são os mesmos vezes √2 por
camada, e como escalar por positivo não muda sinal, a máscara da ReLU é idêntica
nos dois: a razão entre as normas da primeira camada é **exatamente (√2)¹⁹ ≈
724,08**, medida em 723,9.

**E o teste nasceu com um furo, achado por vê-lo falhar.** A asserção que eu
tinha escrito para guardar a comparação controlada conferia a norma da ÚLTIMA
camada nos três modos. Ela é ||δ|| na saída, sorteada de uma semente própria, e
portanto igual nos três aconteça o que acontecer: a linha estava verde sem
guardar nada. Só apareceu porque quebrei a semente por modo de propósito e vi a
linha do método continuar passando enquanto outra falhava. A checagem foi
trocada pela razão exata (√2)¹⁹, que com a semente quebrada cai para ~275.

**A regra que isto deixa: uma asserção que passa nos dois mundos não é
asserção.** Ver o teste falhar não serve só para provar que ele pega o defeito
que você imaginou; serve para descobrir quais das suas linhas não pegam nada.
