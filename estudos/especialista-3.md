# Especialista 3 — carga cognitiva e densidade conceitual

> Parecer para o comitê do capítulo **II.2 — Modelos Lineares**.
> Alvo medido: `livro/capitulos/ii-2-modelos-lineares.md`, 1 426 linhas, **39 cartões**,
> 38 interações, 39 exercícios, 2 laboratórios.
> Régua externa: `/tmp/geron10.ipynb` (capítulo 10 do *Hands-On Machine Learning*, Géron).
> Medições próprias reprodutíveis: `/tmp/comite/medir.py`, `/tmp/comite/densidade.py`,
> dados em `/tmp/comite/medidas.json`.
> Não alterei nenhum arquivo do repositório.

**Siglas, na primeira ocorrência:** EQM (erro quadrático médio) · AUC (*area under the curve*,
área sob a curva) · API (interface de programação de aplicações) · 4C/ID (*four-component
instructional design*) · DoD (*definition of done*, definição de pronto).

---

## 0. As três frases que resumem o parecer

1. **Não somos verbosos: somos empacotados errado.** Por palavra, o capítulo é *menos* denso
   que a régua do Géron. Por **unidade fechável** — o cartão — é **4,2 vezes mais denso**.
   Palavra não é a unidade de carga; **elemento que interage com outro** é.
2. **A junta continua lá, e mudou de lugar.** Ela não está mais no meio: está entre o cartão
   **25 e o 26**. Antes do 25 são 6,0 ideias novas por cartão; depois, 3,0. Razão exata **2,00×**
   (por 100 palavras, 1,62 contra 0,79 — **2,05×**). O diagnóstico anterior mediu 2,9 contra 1,1,
   razão 2,6×. **O capítulo melhorou 20% e continua sendo dois capítulos.**
3. **O portão vê 39,4% do cartão.** Das 14 599 palavras dos cartões, só **5 753** estão
   visíveis antes de o leitor clicar. **83 das 192 ideias novas (43%) estreiam na camada
   escondida** — dentro do `revela` e do `porque`. O teto de 250 palavras é cobrado sobre a
   metade do texto que o leitor de fato lê.

---

## 1. A curva de densidade, na ordem da sequência

**Como contei.** "Ideia nova" = primeira ocorrência, no capítulo, de um conceito nomeado, uma
notação, uma fórmula, uma regra que o leitor precisa segurar para seguir, ou um fenômeno
batizado. Conto dentro do cartão **inteiro** (prosa + interação + exercício + laboratório),
porque é isso que o leitor atravessa. Recapitulação não conta; aprofundamento de uma ideia já
introduzida conta como nova só quando traz um elemento novo que interage com ela (exemplo: no
cartão 6, "erro absoluto = regressão pela mediana condicional" conta; "o quadrado pune mais"
não, porque já estava no cartão 5).

Três contagens de palavras por cartão, e a diferença entre elas é o achado do §3:

- **teoria** — a prosa do cartão, fora dos blocos;
- **visível** — teoria + enunciado da interação + enunciado e alternativas do exercício (é o que
  o portão `cartoes-legiveis.mjs` mede, porque ele lê `innerText` com a revelação fechada);
- **total** — tudo, com `revela`, `gabarito`, `porque` e `rubrica` abertos.

| # | ato | nível | ideias novas | teoria | visível | total | ideias/100 pal. | cartão |
|---:|:--:|:--:|:--|---:|---:|---:|---:|:--|
|  1 | A | 1 |  9 █████████ |  78 | 161 | 359 | 2,51 | O que este capítulo cobra |
|  2 | A | 1 |  5 █████ |  72 | 157 | 403 | 1,24 | A carta de recusa que ninguém escreve |
|  3 | A | 1 |  8 ████████ |  86 | 175 | 389 | 2,06 | Três vantagens que raramente se dizem |
|  4 | A | 1 |  7 ███████ |  62 | 153 | 350 | 2,00 | O modelo é uma reta |
|  5 | A | 1 |  6 ██████ |  59 | 134 | 374 | 1,60 | O critério: erro quadrático médio |
|  6 | A | 1 |  7 ███████ |  88 | 173 | 453 | 1,55 | Por que ao quadrado, e não em valor absoluto |
|  7 | A | 1 |  7 ███████ |  56 | 155 | 406 | 1,72 | A fechada existe, e ainda assim o gradiente |
|  8 | A | 1 |  4 ████ |   5 |  86 | 224 | 1,79 | Ponha a reta à mão *(lab)* |
|  9 | B | 2 |  8 ████████ |  76 | 155 | 372 | 2,15 | Passo 1 — a tigela tem um fundo só |
| 10 | B | 2 |  4 ████ |  33 |  80 | 280 | 1,43 | Passo 2 — a reta passa pelo centro de massa |
| 11 | B | 2 |  6 ██████ |  38 |  96 | 358 | 1,68 | Passo 3 — resíduos ortogonais ao atributo |
| 12 | B | 2 |  6 ██████ |  43 | 107 | 339 | 1,77 | Passo 4 — duas somas, e a reta está pronta |
| 13 | B | 2 |  2 ██ |  46 | 119 | 304 | 0,66 | Uma vez com número |
| 14 | B | 2 |  5 █████ |  42 | 131 | 388 | 1,29 | Passo 5 — o denominador avisa |
| 15 | B | 2 |  7 ███████ |   **5** |  94 | 280 | 2,50 | O gradiente contra a álgebra *(lab)* |
| 16 | B | 2 |  8 ████████ |  48 | 142 | 363 | 2,20 | O que mudou não foi o otimizador |
| 17 | C | 3 |  7 ███████ |  91 | 167 | 348 | 2,01 | O que o coeficiente diz |
| 18 | C | 3 |  5 █████ |  66 | 144 | 336 | 1,49 | A correlação que recomenda o contrário |
| 19 | C | 3 |  5 █████ |  71 | 135 | 411 | 1,22 | O preço é um termômetro disfarçado |
| 20 | C | 3 |  6 ██████ |  72 | 161 | 427 | 1,41 | O controle que não salva |
| 21 | C | 3 |  7 ███████ |  70 | 172 | 432 | 1,62 | Controlar remove só o que a variável mede |
| 22 | C | 3 |  5 █████ |  73 | 160 | 354 | 1,41 | O panfleto, de brinde |
| 23 | C | 3 |  5 █████ |  48 | 147 | 356 | 1,40 | Reproduza, e tente o conserto óbvio |
| 24 | C | 3 |  6 ██████ |  88 | 180 | **517** | 1,16 | O confundimento é perfeito |
| 25 | C | 3 |  5 █████ | 105 | 191 | 460 | 1,09 | As quatro coisas que o coeficiente não diz |
| 26 | D | 4 |  3 ███ |  16 |  **72** | 293 | 1,02 | Quando o linear é a escolha certa |
| 27 | D | 4 |  3 ███ |  73 | 158 | 355 | 0,85 | As cinco situações, e nenhuma é o placar |
| 28 | D | 4 |  3 ███ |  16 | 120 | 353 | 0,85 | O caso da seguradora |
| 29 | D | 4 |  4 ████ |  68 | 151 | 413 | 0,97 | Treine sempre um linear primeiro |
| 30 | E | 5 |  3 ███ |  81 | 163 | 391 | 0,77 | O aperto: nenhuma observação concorda |
| 31 | E | 5 |  3 ███ |  73 | 159 | 386 | 0,78 | A virada: uma regra pública |
| 32 | E | 5 |  3 ███ |  67 | 187 | 412 | 0,73 | Perda é critério de arbitragem |
| 33 | E | 5 |  4 ████ |  85 | 173 | 390 | 1,03 | A disputa de prioridade |
| 34 | E | 5 |  3 ███ |  90 | 182 | 417 | 0,72 | Stigler, e o caso segue aberto |
| 35 | E | 5 |  3 ███ |  71 | 175 | 389 | 0,77 | Crédito não segue descoberta |
| 36 | E | 5 |  5 █████ | 105 | 164 | 390 | 1,28 | Procedência das afirmações |
| 37 | F | 5 |  3 ███ |  54 | 169 | 406 | 0,74 | Mão na massa |
| 38 | F | 5 |  1 █ | 125 | 176 | 384 | 0,26 | Síntese — o que levar |
| 39 | F | 5 |  1 █ |  83 | 129 | 337 | 0,30 | Verificação |

**Totais.** 192 ideias novas · 14 599 palavras totais · 5 753 visíveis (39,4%) · 2 528 de teoria.
Média **4,92 ideias por cartão**, mediana 5. Densidade global: **1,32 ideias por 100 palavras**
(3,34 sobre o visível; 7,59 sobre a teoria). Cartão mediano: 71 palavras de teoria,
157 visíveis, 384 totais. Todos os números desta seção: **📖 medição própria, reprodutível
pelos dois scripts citados no cabeçalho.**

### Os picos, localizados

| pico | cartão | ideias | por que dispara |
|---|---|---|---|
| **P1** | **1 — O que este capítulo cobra** | **9** | O cartão de objetivos é o mais denso do capítulo. Ele entrega quatro objetivos, o par linear × logística, a existência de **solução fechada** e a distinção regressão/classificação **antes de o modelo `ŷ = w·x + b` existir** — a forma só aparece no cartão 4, três cartões depois. |
| **P2** | **3 — Três vantagens** | 8 | Poucos dados por atributo, calibração, auditoria, contagem de parâmetros (51 números), viés e variância, ordenação contra calibração. Seis assuntos distintos, cinco deles com capítulo próprio noutro lugar do livro. |
| **P3** | **9 — Passo 1, a tigela** | 8 | Notação nova (`a`, `b`, `L(a,b)`), convexidade, unicidade do mínimo, a exceção da rede neural, forma ≠ altura, convexidade como consequência do quadrado, e a antecipação das 4 000 iterações. **Este é o pico honesto** (ver §2). |
| **P4** | **15 — O gradiente contra a álgebra** | 7 | **5 palavras de teoria.** Toda a carga está dentro da interação e do laboratório: 1 460, 4 000, 2,8%, 7,3 × 10⁻³, 2,5 × 10⁻¹, "quase colineares", "excesso sobre o ótimo fechado". **Sete números novos numa pergunta de previsão** cujo mecanismo só é explicado no cartão *seguinte*. |
| **P5** | **16 — O que mudou não foi o otimizador** | 8 | Padronização, vale estreito, forma × número de mínimos, o gradiente descendo a parede, equações normais que não andam, padronizar muda coeficientes, escala ≠ correlação, ponte com II.4. |
| **P6** | **21 — Controlar remove só o que a variável mede** | 7 | Confundimento, indicador ≠ confundidor, "ser julho" ≠ 78,8 graus, o que sobra sem dono, nenhuma métrica avisa, viés × ruído, padronizar não resolve confundimento. |

**Vales:** 13 (2 ideias), 38 e 39 (1 cada). Os vales do fim são *desejáveis* — a curva deve cair
no fecho. O vale do 13 ("Uma vez com número") é o melhor cartão do capítulo do ponto de vista da
carga: exemplo trabalhado completo, seguido de um desvanecido com os mesmos passos e outros
números. Zero ideias novas, gesto integral. **É o único lugar onde a teoria e a prática estão na
proporção certa, e não é coincidência que seja o único exemplo trabalhado do capítulo.**

### A junta: ela continua lá

| corte | ideias | palavras | ideias/100 pal. | ideias/cartão |
|---|---:|---:|---:|---:|
| cartões **1–25** | 150 (78%) | 9 283 (64%) | **1,62** | **6,00** |
| cartões **26–39** | 42 (22%) | 5 316 (36%) | **0,79** | **3,00** |

**Razão 2,05× por palavra, 2,00× por cartão.** O corte é limpo: não existe outro ponto da
sequência onde a razão entre as duas metades seja maior.

Comparação com o diagnóstico anterior (18 cartões: 2,9 contra 1,1, razão **2,6×**, "um capítulo
com dois capítulos dentro"; a frase está registrada em `livro/BASE-EDUCACIONAL.md` §4 — **✓ fonte
aberta e lida**): a junta **estreitou de 2,6× para 2,05× e se deslocou do meio para 64% do
percurso**. O que a mudou foi o crescimento de 18 para 39 cartões, quase todo ele na segunda
parte (atos D, E e F somam 17 cartões e apenas 42 ideias). **Diluímos o segundo capítulo em vez
de nivelar o primeiro.**

Por ato, a curva de densidade é uma escada descendente, e nenhum degrau é intencional:

```
A fundamentos  (1-8)    6,62 ideias/cartão  ████████████████████
B dedução      (9-16)   5,75                █████████████████
C interpretação(17-25)  5,67                █████████████████
D escolha      (26-29)  3,25                ██████████
E história     (30-36)  3,43                ██████████
F fechamento   (37-39)  1,67                █████
```

---

## 2. Intrínseco contra acidental

O calibrador dado pelo autor: a **convexidade** era entregue como a palavra "tigela" e virou um
painel manipulável. A dificuldade não mudou (um mínimo só continua sendo um mínimo só); o que
saiu foi o trabalho de *imaginar* uma superfície a partir de um substantivo. **É o modelo do que
procuro: elemento que o leitor tinha de segurar na cabeça e que passou a estar na tela.**

### Intrínseco — a dificuldade é do assunto, e a densidade alta é honesta

- **Cartões 10, 11 e 12 (as duas condições e a fórmula).** Não há como entender `b = ȳ − a·x̄`
  sem segurar, ao mesmo tempo, a derivada em `b`, a soma dos resíduos e a passagem de soma para
  média. Os elementos interagem por definição. 4, 6 e 6 ideias por cartão, e nenhuma sobra.
- **Cartão 9 (convexidade).** Pico P3, e é o pico que **já foi tratado**. O que resta depois do
  painel é irredutível.
- **Cartões 18 a 21 (o confundimento).** O mecanismo exige quatro elementos simultâneos:
  correlação positiva, tabela por preço, coeficiente múltiplo positivo e R² alto. Tirar qualquer
  um desmonta o golpe. **Com uma exceção acidental dentro dele, abaixo.**
- **Cartão 6 (por que o quadrado).** Três razões que se contradizem parcialmente — diferenciável,
  fechada, pune demais. A tensão é o conteúdo.

### Acidental — a dificuldade é da nossa apresentação, com número de cartão

**A1 · Inversões de pré-requisito: quatro, todas verificáveis por `grep`.** É a classe mais cara,
porque o leitor precisa segurar um termo indefinido *enquanto* processa o que o termo explica.

| termo | primeiro **uso** | onde é **definido** | distância |
|---|---|---|---|
| **padronização** | cartão 4 (linha 152, dentro de um distrator) e cartão 15 (linha 526, como condição da pergunta) | cartão 16 (linha 552) | usado 2 vezes antes |
| **R²** | cartão 15 (linha 545, "a referência do R²") | cartão 20 (linha 722, num *blockquote*) | 5 cartões |
| **colinearidade** | cartão 14 (linha 507, distrator) e 15 (linha 524, "quase colineares") | cartão 22 (linha 794) | 8 cartões |
| **AUC** | cartão 26 (linha 943) | **nunca** — o capítulo usa AUC em 4 lugares, inclusive com números (0,4963 contra 0,9392), e não a define | ∞ |

Some-se a isso a **solução fechada**, usada como eixo da interação do cartão 1 (linha 25) três
cartões antes de o modelo existir. Cinco inversões. Nenhuma delas é do assunto: nenhuma lei da
regressão linear exige que a padronização seja apresentada depois de ser usada.

**A2 · Cartão 15 — o cartão de 5 palavras com 7 ideias.** Não é um cartão, é uma moldura em volta
de dois objetos. A interação `prever` pede um número (1 460 ± 500) que depende de sete
parâmetros novos, e o parágrafo que explica por que padronizar muda tudo está no cartão
**seguinte**. Sweller chamaria isso de carga extrínseca pura: o leitor gasta memória de trabalho
mantendo os sete números até chegar a explicação. **Acidental, e o conserto é ordem, não corte:
o cartão 16 vem antes do 15.**

**A3 · Cartão 20 — o R² num rodapé.** O R² nasce num *blockquote* de 32 palavras, no meio do
cartão sobre confundimento, e o exercício e24 cobra o R² inteiro (quatro leituras erradas
desmontadas). Duas ideias competem pelo mesmo cartão: "controlar não salva" e "o que o R²
significa". A segunda é **pré-requisito** da primeira e está sendo dada como nota de rodapé
depois de já ter sido usada no cartão 15. Acidental.

**A4 · Cartão 36 — Procedência das afirmações.** Cinco ideias novas, todas sobre o **aparato
editorial deste livro**: os selos ✓ᵐ, ✓ᵃ, ⏳ e 📖, mais Olbers (1816), Bessel (1832) e a frase
"new evidence, both documentary and statistical". Nenhuma serve a O1, O2, O3 ou O4. O contrato
obriga o cartão a ter interação e exercício, e o exercício e37 está declarado como **objetivo
O1** ("derivar a regressão linear como minimização") enquanto cobra o significado do selo 📖 —
**um objetivo declarado falso, que o portão `publicar/exercicios.mjs` não pega porque ele só
confere se o objetivo existe, não se ele corresponde**. Carga extrínseca no sentido literal:
processamento exigido pela forma de apresentação, não pelo material.

**A5 · Cartão 19 — a nota da unidade da temperatura.** "A unidade não está no arquivo, a faixa
(15,1 a 102,9) é típica de Fahrenheit, onde 78,8 °F são cerca de 26 °C." Honestidade
metodológica correta, colocada no meio do golpe conceitual mais importante do capítulo. É um
elemento a mais na memória de trabalho, sem relação com o confundimento. Cabe numa ficha do dado.

**A6 · Ato E — a história multiplicada por seis.** Cartões 30 a 35: **2 375 palavras, 19 ideias,
sete datas** (1795, 1805, 1809, 1816, 1820, 1832, 1981). Dessas 19, **uma** é reaproveitável
("perda é critério de arbitragem", cartão 32). O contrato obriga interação e exercício em cada
um dos seis, e os exercícios e34, e35 e e36 acabam cobrando *o que o capítulo sustenta sobre a
disputa* — memória de texto, não regressão. Acidental **por multiplicação**: um ato de um ou
dois cartões virou seis porque o corte foi por parágrafo e o contrato pediu um par por cartão.

**A7 · Cartões 26 e 28 — anúncios com contrato.** 16 palavras de teoria cada. O cartão 26
existe para dizer que o 27 vem aí; o 28 tem o caso inteiro dentro da interação. **O cartão 26
tem 72 palavras visíveis, abaixo do piso de 80 do portão** (a medição do portão inclui rótulos
de interface que a minha não conta, então ele pode passar por pouco — mas a proximidade do piso
é o sintoma). Cartão que raspa o piso não é unidade: é costura.

**A8 · Cartão 25 — assimetria de tratamento.** As quatro limitações: três já foram ensinadas com
caso inteiro (causalidade, colinearidade, padronização) e a quarta — **extrapolação** — estreia
ali, como item de lista, sem número e sem cena. A carga cai toda no item que não teve preparo.

**Contabilidade.** Das 192 ideias, **cerca de 19 (10%) são acidentais por conteúdo** (cartão 36
inteiro, a cronologia dos cartões 33-35, a nota do cartão 19, o excesso do cartão 1). As cinco
inversões de pré-requisito não somam ideias: **multiplicam o custo das que já existem**, porque
transformam elemento isolado em elemento interagente.

---

## 3. A régua do Géron, medida com o mesmo instrumento

**O que eu li, e o que não li.** Abri e medi `/tmp/geron10.ipynb` inteiro — **✓ fonte aberta e
lida**. Confirmei os números do enunciado: **211 células, 130 de código, 81 de markdown, mediana
de 13 palavras por célula de markdown, mediana de 3 linhas por célula de código.** A espinha
descrita no enunciado (neurônio biológico → artificial → perceptron → MLP de regressão → MLP de
classificação → implementação em carregar, criar, compilar, treinar, prever → repetição para
outra API) está nos cabeçalhos do próprio notebook e nessa ordem — verifiquei célula a célula.
**Não li o capítulo impresso**, onde mora a exposição conceitual; tudo o que eu dissesse sobre o
texto do livro seria ⏳.

**Consequência metodológica, e ela é decisiva.** O notebook é a *camada de prática*; o nosso
capítulo mistura exposição e prática. Comparar "ideias por 100 palavras" contra ele é comparar
coisas diferentes, e o resultado sai invertido: **por 100 palavras de prosa o Géron é mais
denso que nós** (61 ideias em 950 palavras de markdown = 6,4 por 100; nós, 1,32). Isso não diz
que ele sobrecarrega — diz que **as ideias dele não chegam por frase, chegam por gesto.** A
comparação válida é por **unidade que o aluno fecha**, e essa é legítima porque o notebook *é* a
sequência que o aluno percorre.

**A medição.** Defini a unidade do Géron como uma célula de markdown mais as células de código
que a seguem até o próximo markdown. Recortei o trecho de ensino (células 14 a 167, fora a
instalação e o apêndice de soluções): **52 unidades, 950 palavras de markdown, ~104 células de
código, 61 ideias novas** (contadas com o mesmo critério que usei no nosso capítulo).

| medida | II.2 (nosso) | Géron cap. 10 (notebook) | fator |
|---|---:|---:|---:|
| **ideias novas por unidade fechável** | **4,92** (mediana 5) | **1,17** (mediana 1) | **4,2×** |
| idem, só o primeiro bloco (nossos cartões 1–25) | 6,00 | 1,17 | **5,1×** |
| palavras de prosa por unidade (mediana) | 71 de teoria · 157 visíveis · 384 totais | 13 | 5,5× a 29× |
| palavras por unidade, prosa + código | 384 | 45,5 | 8,4× |
| gestos por unidade | 2 (1 interação + 1 exercício) | 2 células de código (mediana 1) | 1,0× |
| **gestos por ideia nova** | **0,42** | **1,7** | **4,0× a favor dele** |
| palavras lidas por ideia nova | 76 (30 visíveis) | 43 (15,6 só markdown) | 1,8× |
| ideias por 100 palavras | 1,32 | 2,3 (prosa+código) · 6,4 (só prosa) | **nós somos menos densos** |

**A resposta ao que foi perguntado: somos mais densos, e o fator é 4,2×** — medido na única
unidade que faz sentido comparar, a que o aluno fecha. No bloco onde a junta manda, **5,1×**.

E a linha que explica o parecer inteiro: **por palavra não somos mais densos, somos menos.**
Escrevemos 76 palavras por ideia nova contra as 43 dele. As palavras a mais são elaboração — o
distrator desmontado, a ideia reaproveitável, a ponte com outro capítulo. **Elaboração não
reduz o número de elementos que interagem; ela cerca os elementos com mais texto.** A carga
intrínseca é fixada pela contagem de elementos interagentes, não pelo comprimento do texto que
os cerca — atribuição corrente à Teoria da Carga Cognitiva, **⏳: eu não reabri Sweller neste
ciclo** (ver §4).

**Um número que não estava no pedido e que eu destacaria ao coordenador.** O aluno do Géron
executa uma célula a cada 13 palavras lidas, e faz **1,7 gestos por ideia nova**. O nosso faz
**0,42**. Ele pratica quatro vezes mais por ideia; nós explicamos quase duas vezes mais por
ideia. O contrato novo ("teoria, interação e exercício em todo cartão") empurra na direção
certa — e não resolve, porque acrescenta gestos ao cartão inteiro sem reduzir quantas ideias o
cartão carrega.

---

## 4. A recomendação: uma só

### O que recomendo

> **Adotar a Teoria da Carga Cognitiva (Sweller) como regra de *sequenciamento*, e não apenas de
> formato, com um invariante numérico por cartão: no máximo uma ideia nova de cada vez em
> elementos que interagem, e nenhum termo usado antes do cartão que o nomeia.**

Operacionalmente, três asserções, nesta ordem de prioridade:

1. **Pré-requisito antes do uso, sem exceção.** Nenhum cartão usa um termo que ainda não foi
   nomeado num cartão anterior — nem em distrator, nem em revelação, nem em enunciado de
   laboratório. As cinco inversões do §2/A1 são a dívida de abertura desta regra.
2. **Teto de ideias novas por cartão: 3.** Contadas no cartão inteiro, revelação incluída.
   Hoje a média é 4,92 e o máximo é 9. Vinte e dois dos 39 cartões estouram esse teto.
3. **Exemplo trabalhado antes de exercício, e desvanecimento com pergunta de princípio** — o que
   o livro já faz, e faz bem, nos cartões 13 e 11. A recomendação aqui é **estender o que já
   funciona**, não instalar coisa nova.

### Por que esta, e não as outras três

| candidata | selo da fonte neste repositório | por que **não** é a que recomendo |
|---|---|---|
| **Carga Cognitiva** (Sweller, 1988) | **✓** em `livro/bibliografia.md` linha 25, *verificado em 2026-08-01* — **selo do repositório; eu não reabri o artigo neste ciclo** | **É a que recomendo.** Único candidato com fonte já verificada *e* que fala diretamente da grandeza que eu medi. |
| **4C/ID** (van Merriënboer, Clark & de Croock, 2002) | **✓** em `bibliografia.md` linha 26, *verificado em 2026-08-01* — mesma ressalva | Fonte boa, lugar errado. `BASE-EDUCACIONAL.md` §2 já atribui ao 4C/ID outro papel: a trilha `ml-zero` é a espinha de tarefas inteiras e **os capítulos são informação de apoio**. Usá-lo para sequenciar cartões é aplicar um achado verdadeiro fora do lugar dele — exatamente o erro que a §5 daquele documento nomeia como o mais frequente deste repositório. E ele não oferece nenhum teto por unidade. |
| **Elaboration Theory** (Reigeluth) | **⏳** — não está em `bibliografia.md`, não foi lida por mim, e resumo de busca não é fonte | O epítome-primeiro **é o que o capítulo já faz, e é o pico P1**: o cartão 1 é um epítome com 9 ideias. Adotá-la formalizaria o defeito. E custaria uma sexta linha na fila de verificação da §8 para sustentar uma mudança estrutural do livro inteiro — o pior retorno por unidade de dúvida fechada do lote. |
| **Segmentação e pré-treino** (Mayer) | **⏳** — não está em `bibliografia.md`, não foi lida por mim | **É a mais próxima do meu diagnóstico** e mesmo assim não a recomendo *como fonte*. O operador dela ("nomeie os componentes antes do processo") é precisamente o conserto das cinco inversões do §2/A1. Mas eu não posso apresentá-lo com autoridade que não verifiquei. **Proposta honesta: adotar o operador como 📖 leitura editorial, derivado do critério de elementos interagentes, e não citar Mayer como evidência.** Se o autor quiser o selo, ela entra na fila da §8 como linha 7. |

**Uma ressalva contra mim mesmo, e ela é importante.** O mecanismo específico que eu usaria para
justificar o teto de três ideias — o efeito de "elementos isolados", isolar antes de fazer
interagir, atribuído a Pollock, Chandler e Sweller (2002) — é **⏳ atribuição corrente que eu
carrego de memória e não confirmei em fonte primária neste ciclo**. Não o uso como prova. O que
sustenta a recomendação com selo é o que o repositório já tem verificado em `bibliografia.md`
linha 25 e registrado em `BASE-EDUCACIONAL.md` §2: exemplo trabalhado antes de exercício,
desvanecimento capítulo a capítulo, **uma ideia nova por vez**. A minha contribuição não é uma
teoria nova: é **o número que diz o quanto essa regra está sendo violada** — 4,92 quando o
contrato dela é 1.

**O que a recomendação não autoriza.** Não autoriza cortar elaboração no cartão 13 nem nos
cartões 10 a 12: ali a densidade é intrínseca e o formato já é o certo. Não autoriza tratar
palavra como carga — a §3 mostra que o número de palavras e a carga andam em direções opostas
neste capítulo. E não autoriza cortar figura ou laboratório por suspeita: o painel da
convexidade é a prova de que interatividade **remove** carga acidental.

---

## 5. Onde cortar, para o contrato caber

O contrato novo (teoria + interação + exercício ou laboratório em todo cartão) **acrescenta
carga**, e a medição diz quanto: **83 das 192 ideias novas (43%) estreiam dentro da interação ou
da revelação do exercício**. Em média, o par acrescenta **2,1 ideias e 220 palavras por cartão**.
Multiplicar 39 cartões pelo par é multiplicar essas 2,1 por 39.

E um cartão só é fechável se o aluno consegue fechá-lo. Hoje o portão mede o cartão **fechado**
(39,4% do texto). Aberto, o cartão mediano tem 384 palavras e o cartão 24 tem 517 — o dobro e
mais do teto de 250.

### Cartões que não suportam o contrato como estão

| # | por que não suporta | o que sai |
|---|---|---|
| **1** | 9 ideias num cartão de objetivos, e o modelo ainda não existe | O par linear × logística inteiro (interação i25 + exercício e28). É nota de fronteira, não objetivo. Vai para o cartão 17, onde a razão de chances já reaparece. **−3 ideias na abertura.** |
| **15** | 5 palavras de teoria para 7 ideias e 7 números; usa "padronizar" e "colinear" antes da definição | Inverter com o 16 (padronização primeiro). Reduzir os sete números a dois: 1 460 passos, e não chega em 4 000. **Os cinco restantes vão para a legenda do laboratório.** |
| **20** | R² como rodapé, sendo pré-requisito, e já usado no cartão 15 | O R² sai do *blockquote* e vira **cartão próprio, antes da regressão múltipla** (pré-treino). O 20 fica com uma ideia: controlar não salva. **+1 cartão, −1 inversão.** |
| **24** | 517 palavras totais, o maior do capítulo; rubrica de cinco critérios | A rubrica do exercício aberto e6 vai para `BANCO-DE-EXERCICIOS.md`; o e6 vira item da Verificação (cartão 39). O cartão fica com um exercício fechado curto. **−160 palavras.** |
| **25** | três recapitulações e uma estreia sem cena (extrapolação) | A extrapolação vira cartão próprio com o seu caso; a lista das quatro fica como fecho, sem feedback novo. |
| **26** | 16 palavras de teoria, 72 visíveis (no piso do portão); é um anúncio | Funde com o 27. **−1 cartão.** |
| **28** | 16 palavras de teoria; o caso mora dentro da interação | O caso da seguradora vira o corpo do cartão e a interação passa a cobrar a decisão. Sem fusão, sem corte de ideia. |
| **30–35** | 6 cartões, 2 375 palavras, 19 ideias, 7 datas, e os exercícios cobram memória de texto | Colapsam em **2**: (a) o aperto e a virada da regra pública; (b) perda é critério de arbitragem. A disputa de prioridade, Stigler, Olbers, Bessel e o espelho com o *backpropagation* vão para um apêndice "De onde isto veio", **fora do baralho e sem contrato**. **−4 cartões, −1 600 palavras, −13 ideias.** |
| **36** | 5 ideias, todas sobre o aparato editorial; e o exercício e37 declara objetivo O1 e não testa O1 | **Sai do baralho.** Vira bloco de procedência no fim da seção histórica, sem interação e sem exercício. **−1 cartão, −5 ideias.** |
| **38, 39** | 1 ideia cada, 721 palavras somadas | **Ficam.** A curva *deve* cair no fecho, e a síntese com gesto ritual é o fecho certo. Não confundir vale com defeito. |

### A aritmética, e o alerta que ela traz

Cortar cartões, sozinho, **piora** a densidade por unidade: menos cartões para as mesmas ideias.
A conta correta é **gastar o que sai nos picos**:

```
sai   ato E colapsado (−4 cartões, −13 ideias) + cartão 36 (−1, −5) + fusão 26/27 (−1, −0)
      + excesso do cartão 1 (−3 ideias) + rubrica do 24 (−160 palavras)
      = −6 cartões, −21 ideias, ≈ −2 900 palavras

entra os seis picos partidos em dois (cartões 1, 3, 9, 15/16, 21) + R² como cartão + extrapolação
      como cartão = +6 a +7 cartões, 0 ideias novas

fica  ≈ 39 a 40 cartões · ≈ 171 ideias · ≈ 4,3 ideias por cartão nos picos partidos,
      ≈ 3,0 no resto — e a razão entre os dois blocos cai de 2,05× para ≈ 1,3×
```

**O contrato passa a caber porque cada cartão partido tem uma ideia para ancorar o gesto.** Hoje
o par existe em todo cartão, mas em nove deles (1, 3, 9, 15, 16, 21, 26, 28, 36) ele é ritual:
o gesto não fecha a ideia porque há cinco outras na mesma tela.

### Duas mudanças de portão que eu pediria junto

1. **`publicar/gates/cartoes-legiveis.mjs` mede o cartão fechado.** Ele remove o `hidden` do
   `.cartao` e mede `innerText`, com revelações e gabaritos ainda ocultos — **39,4% do texto do
   cartão**. Proposta: medir **duas vezes**, fechado e com todas as revelações abertas, e cobrar
   o teto de 1 600px e o de 250 palavras sobre o **estado aberto**, que é onde o leitor termina.
2. **`publicar/exercicios.mjs` confere se o objetivo citado existe, não se ele corresponde.**
   O exercício e37 (cartão 36) declara O1 e cobra o significado do selo 📖. Um exercício cujo
   verbo não é o verbo do objetivo declarado é carga acidental com aparência de rigor.

---

## 6. O que eu faria se estivesse errado

Digo onde a minha medição quebra, e o que teria de aparecer para eu mudar de lado.

**A contagem de ideias é minha, e é o parâmetro mais frágil de tudo o que escrevi.** Ela é
julgamento, não `grep`. Se um segundo leitor contar com um critério mais frouxo — só termo com
verbete no glossário, digamos — as 192 caem para perto de 90 e a média por cartão vai a 2,3.
**Mas a *forma* da curva não muda**, e é ela que sustenta o parecer: a junta em 25/26 e os seis
picos aparecem em qualquer critério consistente, porque o cartão 1 tem mais coisas novas que o
cartão 38 sob qualquer contagem. **Se um recontagem independente movesse a junta para outro
lugar, ou achatasse os picos, eu retiraria o §1 e o §5 inteiros.** O teste é barato: peça a
contagem a outro agente em contexto fresco, com o mesmo critério escrito, e compare as duas
listas cartão a cartão.

**O fator 4,2× depende de uma escolha de unidade que é discutível, e este é o ponto onde eu sou
mais atacável.** Chamei de "unidade" do Géron a célula de markdown mais o código que a segue. Se
a unidade dele for a **seção**, o trecho de ensino tem 16 cabeçalhos (11 de nível `##` mais 5 de
nível `###`) para 61 ideias = **3,8 por seção**, contra os nossos 4,92 por cartão: **o fator cai
de 4,2× para 1,3× e o parecer perde o seu número mais forte.** Escolhi a célula porque é ali que
o aluno executa e vê saída, e é o que ele fecha; a seção dele não é fechável no sentido em que o
nosso cartão é. Mas quem defender a seção tem um argumento legítimo, e nesse caso a minha
conclusão vira "estamos na mesma faixa de densidade por unidade, e o que difere é a taxa de
gestos, 1,7 contra 0,42" — que ainda sustenta a recomendação, com metade da força e com a
segmentação, não a densidade, virando o assunto principal.

**A comparação com o Géron é parcial por construção, e eu disse isso no §3.** Não li o capítulo
impresso. Se ele carregar exposição pesada que o notebook não mostra, a régua que usei mede a
prática dele contra a exposição *mais* a prática nossa, e o 4,2× está inflado. **O conserto é
conhecido:** medir um material que seja exposição e prática no mesmo artefato — o Google Machine
Learning Crash Course, que este repositório já usou como referência de microlearning, serve.

**A minha própria recomendação pode estar defendendo o que já falhou.** A Carga Cognitiva já é
uma das quatro bases herdadas (`BASE-EDUCACIONAL.md` §2), e o capítulo está assim **apesar
dela**. Uma leitura razoável disso é que o problema não é qual teoria rege, é que nenhuma delas
virou asserção executável para *sequência* — só para formato. Se o comitê concluir isso, a minha
recomendação deve ser lida como **um portão, não como uma teoria**: a contagem de ideias novas
por cartão e a verificação de pré-requisito antes do uso são as duas coisas que uma máquina
consegue conferir, e é isso que falta. **Prefiro perder a discussão sobre a teoria e ganhar o
portão.**

**E o erro que eu mais temo cometer:** cortar o que carrega a tese. O cartão 13 tem 2 ideias e
304 palavras, e um corte por densidade o marcaria como gordura. Ele é o melhor cartão do
capítulo. Densidade baixa depois de um pico é **recuperação**, e um capítulo sem vales não é um
capítulo eficiente: é um capítulo que ninguém termina.
