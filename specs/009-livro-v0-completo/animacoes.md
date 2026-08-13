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
| I.5 | **feita** — base do eixo subindo de 0 a 88 sobre os números do exercício do capítulo: razão vista chegando a 12,00 com a real parada em 1,0125, e o botão que troca barra por linha |
| I.6 | escala de uma coluna × 100: quantos dos 5 vizinhos trocaram, e o rótulo previsto virando |
| II.1 | **feita** — limiar descendo de 0,98 a 0,00: matriz de confusão, acurácia, precisão e revocação mudando junto, o ponto andando sobre a ROC, e o botão da prevalência de 1% |
| II.2 | **feita** — 4 000 passos de gradiente contra o ótimo fechado: com atributos colineares para em 2,8% de excesso, padronizados chega a 1% no passo 1 460 |
| II.3 | **feita** — acurácia congelando em 1,000 no passo 52 enquanto a norma de w vai de 6,08 a 7,91 e a perda de 0,23 a 0,078; o botão da L2 devolve o ponto ótimo |
| II.4 | **feita** — três taxas (0,001 / 0,1 / 1,5) na mesma paisagem, a terceira saindo da escala, mais o botão que troca só a perda e faz a mesma 1,5 virar a melhor das três |
| II.5 | árvore crescendo corte a corte com o ganho de Gini; depois o boosting, com o resíduo médio encolhendo por árvore |
| II.6 | **não animar** — drill-down é navegação; cubo girando é decoração |
| II.7 | **feita** — as 8 dobras de origem móvel avançando, contra a linha do embaralhado: 1,47 contra 0,76 sem quebra, e 3,07 contra 0,82 com quebra de regime |
| II.8 | **feita** — custo do FN de 1 a 10: o limiar ótimo DESCENDO de 0,46 a 0,115, colado na fórmula 1/(1+custo), e o botão que espreme a calibração e derruba a fórmula |
| III.1 | **feito** — o perceptron aprendendo, e o XOR onde ele não para |
| III.2 | **feito** — MLP no mesmo XOR do III.1: as duas retas girando, mais o botão que tira a camada e o que estraga a inicialização |
| III.3 | **feita** — a retropropagação descendo 20 camadas: 1,4e-12 na primeira com sigmoide + Xavier, 1,2e-3 com ReLU + Xavier (a ReLU sozinha não basta) e 0,86 com ReLU + He |
| III.4 | **feita** — filtro varrendo 144 posições com o mapa se pintando; com 3 px de deslocamento a densa cai de 1,000 a 0,009 e a convolucional segue em 0,996, com 26 pesos contra 257 |
| III.5 | pesos de atenção acendendo numa frase, contra o sinal de gradiente da RNN caindo a zero em 11 passos |
| III.6 | **não animar** — nada treinável honestamente no navegador vira encenação |
| IV.1 | **feito** — atribuir e recentrar alternando, com o botão da semente infeliz |
| IV.2 | grid-world com a Q-table pintando: recompensa por episódio e ε caindo; com ε=0 o agente trava num caminho pior |
| IV.3 | algoritmo genético: melhor aptidão subindo enquanto a diversidade colapsa |
| V.1 | **feito** — limiar de um grupo movendo, com o botão que iguala as prevalências |
| V.2 | **não animar** — dívida técnica não tem dinâmica observável em 30 s |
| V.3 | **feita** — 60 dias com PSI e AUC na mesma linha do tempo, e o botão da deriva que NÃO dói: mesmo PSI, AUC intacta |
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


## O que a décima animação ensinou (II.7, 2026-08)

**O número não foi escolhido: foi medido, e depois a lição mudou de forma.** A
spec prometia "o MAE menor e mentiroso da divisão embaralhada", como se a mentira
tivesse um tamanho. A primeira medição, numa série quase plana, deu **1,1×** — um
engano praticamente invisível. A tentação foi óbvia: mexer na simulação até o
número ficar dramático. Em vez disso, varri a tendência e escrevi a dependência:

| tendência por passo | mentira sem quebra |
|---|---|
| 0,035 | 1,1× |
| 0,09 | 1,9× |
| 0,18 | 3,5× |

Fixei **0,09** por realismo (em 320 passos a série mais que dobra, que é o que uma
base de negócio em crescimento faz), e a varredura inteira ficou registrada aqui e
no cabeçalho do teste, para que ninguém precise confiar na minha palavra de que o
valor não foi escolhido pelo tamanho.

**E a lição ficou melhor do que a da spec.** Não é "embaralhar mente por tanto";
é **"o método errado parece inofensivo justamente quando o mundo está parado"**.
Com quebra de regime a mentira vai a 3,7×, e o embaralhado mal registra a quebra
(0,76 → 0,82) porque as linhas de depois dela estão no treino dele. Quem valida
embaralhando num período calmo não recebe aviso nenhum, e recebe o prejuízo no
período em que a previsão importava.

**O modelo é k-vizinhos, pelo mesmo motivo do I.3:** é o mais simples que
memoriza. Com um linear, o vazamento existiria e seria pequeno, e a animação
ensinaria que erro de método é detalhe.

O teste foi **visto falhando**: tirei o embaralhamento (mantendo o corte 80/20 em
ordem cronológica) e a linha do sinal acusou na hora — o "embaralhado" passou a
errar **mais** que a origem móvel, 1,89 contra 1,47.


## O que a décima primeira animação ensinou (II.8, 2026-08)

**Escore calibrado por construção transformou a animação de tendência em
resultado.** Sorteando o escore e depois y ~ Bernoulli(escore), o limiar ótimo
passa a ter forma fechada, **1/(1+custo)**, e o tracejado da fórmula pode ser
desenhado por cima da curva medida. O leitor vê as duas coincidirem, e o teste
confere o desvio médio (0,015 ao longo da varredura). Sem a calibração por
construção, a animação mostraria uma curva descendo e pediria fé.

**O segundo botão é a contraprova, e ele vale mais que o primeiro.** Espremer os
escores para perto de 0,3 preserva a ORDEM (a AUC não muda) e mata a calibração.
A fórmula desaba na hora: o limiar ótimo quase para de responder ao custo, indo
de 0,34 a 0,26 onde deveria ir de 0,50 a 0,11. É a distinção do II.1 entre
ordenar e calibrar, aparecendo como dinheiro perdido em vez de nota de rodapé.

**Uma asserção do teste nasceu arbitrária e foi corrigida.** Eu tinha escrito
"desvio médio do espremido > 0,15", e ele reprovou com 0,104. O número 0,15 era
chute; o que a afirmação diz é "a fórmula deixa de ser um bom guia", e isso só
existe **em relação** ao caso em que ela é um bom guia. A asserção virou
`dEsp > dCal * 4`, e 0,104 contra 0,015 passa com folga. Corrigir o corte para o
teste passar seria trapaça; trocar um corte arbitrário pela comparação que a
frase realmente faz é o conserto.

**O número para a reunião não é uma métrica.** Manter o limiar em 0,50 "porque é
o padrão" custa **2 220 a mais por mil casos** quando o falso negativo vale 10.
É o O2 do capítulo (traduzir métrica em consequência) numa linha do placar.

O teste foi **visto falhando**: tirei o peso do falso negativo da conta de custo
e quatro das seis linhas acusaram, incluindo a da direção — o limiar parou de
descer.


## O que a décima segunda animação ensinou (V.3, 2026-08)

**A spec estava errada sobre o mecanismo, e o erro era do tipo lisonjeiro.** Ela
prometia "o PSI cruzando 0,25 **dias antes** de a AUC real cair". Medido: os dois
cruzam no **mesmo dia 32**. O PSI não tem dianteira nenhuma sobre a degradação;
ele não é mais sensível, é apenas **observável mais cedo**. O adiantamento real
vem da latência do rótulo: com 21 dias para o rótulo chegar, a queda do dia 32 só
fica visível no dia 53, e os 21 dias de vantagem são exatamente a latência.

Dava para forçar uma dianteira (bastava começar a deriva de conceito depois da
deriva de covariáveis) e a animação ficaria mais bonita. Seria ensinar um
mecanismo falso. O mecanismo verdadeiro já estava escrito no capítulo, três
parágrafos acima: *"ela só pode ser calculada quando o rótulo chega"*.

**O segundo botão é o que impede a animação de virar propaganda de PSI.** A mesma
deriva de entrada, o mesmo PSI dia a dia, e a AUC desabando num modo e imóvel no
outro (0,58 contra 0,85). O leitor vê o mesmo alarme acompanhar um desastre e um
não-evento. É a ressalva que o capítulo já fazia em prosa, agora com número.

**E o primeiro defeito da construção foi de ruído virando sinal.** Com 400 casos
por dia, a AUC de um dia contra a AUC do dia 0 acusava "queda de cinco pontos" no
**dia 9**, inclusive no modo que não dói, e o adiantamento saía **negativo** (−21
dias). O alarme estava medindo sorteio. Três correções: amostra diária de 400
para 2 000, referência passando a ser a média dos cinco primeiros dias, e leitura
por média móvel de três. É a mesma disciplina que uma detecção de drift de
verdade precisa ter, e a animação teria ensinado o contrário sem ela.

Teste **visto falhando**: deixei a deriva "que não dói" corroer o sinal também, e
a linha do contraste acusou na hora.


## O que a décima terceira animação ensinou (I.5, 2026-08)

**A animação corrigiu o capítulo que a hospeda.** O exercício dizia que, com o
eixo começando em 88, a última barra fica "cerca de **onze** vezes" a altura da
primeira. São **doze**, exatamente: as alturas viram 0,1 · 0,4 · 0,9 · 1,2 e
1,2 ÷ 0,1 = 12. A conta tem uma linha e passou por três revisões sem que ninguém
a fizesse. O texto e a rubrica foram corrigidos no mesmo commit.

É a terceira vez neste ciclo que um número escrito à mão ao lado dos dados que o
determinam sai errado (as outras foram o intervalo do IV.2 e a soma das
animações). O padrão já tem nome no repositório: **onde o texto dá os
ingredientes da conta, faça a conta**.

**A segunda série que eu tinha planejado foi descartada, e vale registrar por
quê.** A ideia era comparar "dados de diferença pequena" com "dados de diferença
grande" para mostrar que o truque paga mais quando há menos a mostrar. Medindo,
descobri que o resultado dependia inteiramente de **onde eu escolhesse parar a
base**, e que com a regra mais natural (base = mínimo − 10% da amplitude) a razão
vista dá **11 nos dois casos, por identidade algébrica**. A comparação não media
nada. Troquei pelo botão barra/linha, que é a regra que o capítulo de fato
enuncia: em barra o comprimento codifica, em linha codifica a inclinação.

**Uma comparação que depende do ponto de parada não é uma comparação.** Foi só
medir para ver; antes de medir, ela parecia a melhor parte da animação.


## O que a décima quarta animação ensinou (II.3, 2026-08)

**A primeira versão respondia à pergunta cedo demais.** Com margem larga, a
acurácia batia 1,000 no passo 0 e a animação começava já com a resposta na tela.
Estreitei a margem, e a acurácia passou a chegar a 1,000 no passo **52**, o que dá
ao leitor 52 quadros de "está melhorando" antes dos 348 de "não está mais". A
lição precisa do intervalo entre as duas fases para existir.

**O que ela ensina é uma NÃO-EXISTÊNCIA, e isso é raro numa animação.** Com dado
separável, o máximo da verossimilhança não existe em ponto nenhum: a perda tende
a zero com a norma indo ao infinito. A tela mostra o processo não convergindo, e
o placar dá o número que prova (6,08 no passo 200 contra 7,91 no 400). É a
demonstração operacional do O3, que em prosa é uma frase sobre sistema
transcendental.

**E o botão da L2 é o argumento inteiro de por que regularizar não é ajuste
fino.** Com penalização, a norma para em 3,31 e a perda em 0,226, com a mesma
acurácia de 1,000. A penalização não melhorou a classificação: ela **devolveu ao
problema um ponto ótimo que ele não tinha**.

Teste **visto falhando**: tirei a penalização do gradiente e as duas linhas da L2
acusaram, com a norma "regularizada" indo a 7,91 igual à outra.


## O que a décima quinta animação ensinou (II.2, 2026-08)

**Duas fraudes de comparação foram achadas e desfeitas aqui, e nenhuma das duas
era óbvia antes de medir.**

**A primeira: passo de aprendizado comum.** Com um passo fixo, a comparação entre
atributos brutos e padronizados não mede condicionamento, mede a sorte de o
passo servir a um regime e não a outro. Com 0,02 o regime bruto **divergiu** (soma
dos quadrados a 8 × 10¹⁹⁶ em 400 passos). Cada regime passou a receber o **maior
passo estável**, 1/L com L o maior autovalor da hessiana por iteração de potência,
e os dois valores ficam no placar: 7,3 × 10⁻³ contra 2,5 × 10⁻¹. O teste confere
que são diferentes, porque igualá-los seria voltar à fraude.

**A segunda: medir distância entre vetores de peso.** Padronizar troca a
parametrização — o intercepto ótimo passa a ser a média de y — e ‖w − w*‖ nos dois
regimes compara réguas diferentes. A primeira versão fazia isso e dava o resultado
**invertido**: o regime padronizado aparecia mais longe do ótimo (3,65) que o
bruto (1,92). A medida passou a ser o **excesso relativo de erro** sobre o ótimo
fechado, que é invariante à troca e é a moeda que o método minimiza.

**Só depois das duas correções o número virou lição:** com os atributos como
vieram, 4 000 passos param a 2,8% do ótimo; padronizados, chegam a 1% no passo
1 460 e terminam 351 vezes mais perto. E as equações normais deram a resposta
exata numa conta, nos dois casos.

**A regra que isto deixa:** antes de comparar dois regimes, pergunte o que mais
muda entre eles além da variável que você quer isolar. Aqui mudavam duas coisas
(a escala do passo e a parametrização), e as duas empurravam o resultado para
lados opostos.


## O que a décima sexta animação ensinou (III.4, 2026-08)

**Os dois modelos são treinados dentro da animação, e isso não era opcional.**
A alternativa preguiçosa era montar a densa como um "filtro casado" na posição do
treino, o que daria o mesmo desenho sem treinar nada. Seria afirmar "a densa
aprende um detector de gato-no-canto-esquerdo" sem mostrar a densa aprendendo. Com
300 épocas de descida sobre 60 exemplos, os dois **chegam a acertar o treino**
(1,000 e 0,997), e é esse empate que dá sentido ao desempate do botão.

**O número que o capítulo não mostrava.** A seção de parâmetros compara memória:
1 728 pesos contra 9,6 milhões. A animação mostra o mesmo fato como
**generalização**: 3 pixels de deslocamento levam a densa de 1,000 a **0,009** e
deixam a convolucional em **0,996**. A densa tinha dez vezes mais pesos e ficou
cega, não pior.

**A spec pedia "densa 3,2 M × conv 2 400", e esses números não são de lugar
nenhum.** Nem batem com os do próprio capítulo (que fala em 9 633 792 contra
1 728, com 64 filtros sobre 224×224×3). As contagens da animação saem da geometria
dos modelos que ela de fato roda: 16×16 + 1 = 257 e 5×5 + 1 = 26. Número em spec
não é medição, e a diferença entre os dois é o assunto deste ciclo inteiro.

Teste **visto falhando**: variei a posição da forma no treino, e a linha do
"os dois resolvem o treino" acusou na hora (densa em 0,624).
