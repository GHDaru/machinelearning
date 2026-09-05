# Especialista 2 — desenho de prática e avaliação

**Escopo:** que exercício ensina o quê, em que ordem a prática precisa vir, e como se verifica
que o degrau foi vencido. Capítulo `II.2`, 39 cartões, 39 exercícios, 38 interações, 2
laboratórios.

**Legenda dos selos** (`livro/BASE-EDUCACIONAL.md` §1, sem abrandamento): ✓ fonte aberta e
lida · ✓ᵐ só metadados · ⏳ atribuição corrente · ❌ procurei e não achei · 📖 leitura
editorial.

**Uma declaração de honestidade sobre os meus próprios selos, no topo.** Marco **✓** o que eu
abri e contei nesta sessão: os arquivos do repositório, `/tmp/geron10.ipynb`, os três
notebooks do fastbook e o Colab do Google que baixei em `.ipynb`. Marco **⏳** o que veio das
páginas HTML do Google Machine Learning Crash Course (MLCC), porque eu não li a página: um
buscador leu e me devolveu resumo, e resumo de busca não é fonte. Marco **⏳** as cinco
teorias que o coordenador pediu para eu considerar e que **não** estão na base do livro
(Bloom, Rohrer & Taylor, Roediger & Karpicke, Black & Wiliam) — cito o que se lhes atribui e
**não cito tamanho de efeito nenhum**, porque não abri nenhuma delas.

---

## 1. Inventário classificado da prática atual

### 1.1 O que existe, medido

| Medida | Valor | Selo |
|---|---|---|
| Cartões | 39 | ✓ medido em `livro/capitulos/ii-2-modelos-lineares.md` |
| Exercícios | 39 (um por cartão) | ✓ `banco.json`, filtro `arquivo == livro/capitulos/ii-2-modelos-lineares.md` |
| Interações | 38 (o cartão 8 tem laboratório no lugar) | ✓ |
| Laboratórios | 2, nos cartões **8** e **15** | ✓ |
| Palavras do capítulo | 16 427 | ✓ |
| Tipos | 26 `multipla` · 6 `numerica` · 5 `completar` · 1 `multipla-multi` · 1 `aberta` | ✓ |
| Objetivo declarado | O1 = 14 · O4 = 9 · O2 = 8 · O3 = 8 | ✓ |
| Mediana de palavras do enunciado | 20 | ✓ |
| Mediana de palavras da correção (`porque`) | **127** (mínimo 103, máximo 152) | ✓ |
| Alternativas por múltipla escolha | 4 (mediana) | ✓ |

**O contrato novo do autor já está cumprido, e isso muda o alvo do ciclo.** "Cada card deve
ter um aspecto teórico, uma interação e um exercício e ou laboratório": 39/39 cartões têm
teoria e exercício, 38/39 têm interação, e o único sem interação (cartão 8, *Ponha a reta à
mão*) tem laboratório. O que falta não é o contrato. É a **ordem da exigência**.

### 1.2 Classificação por exigência real

Classifiquei pelo que o aluno **tem de fazer para passar**, não pelo rótulo de dificuldade.
Cinco categorias, na ordem que o coordenador fixou.

- **Reconhecer** — escolher, entre alternativas, a afirmação que o cartão acabou de fazer.
- **Calcular** — executar um procedimento numérico e devolver um número.
- **Produzir** — escrever um texto que atenda a critérios.
- **Transferir** — aplicar o raciocínio a um contexto que o capítulo não usou.
- **Decidir** — pesar restrições em conflito e escolher.

| Exigência | Quantos | Quais (na ordem do capítulo) |
|---|---|---|
| **Reconhecer** | **28** (72%) | e28, e29, e15, e8, e1, e9, e16, e17, e18, e11, e26, e20, e22, e23, e24, e5, e27, e41, e13, e31, e32, e33, e34, e35, e36, e37, e38, e39 |
| **Calcular** | **6** (15%) | e10, e19, e7, e21, e4, e40 |
| **Transferir** | **2** (5%) | e30, e12 |
| **Decidir** | **2** (5%) | e25, e14 |
| **Produzir** | **1** (3%) | e6 |

### 1.3 A ordem em que isso aparece — a curva que o autor está sentindo

Pontuando reconhecer = 1, calcular = 2, produzir/transferir = 3, decidir = 4, a exigência
por cartão é:

```
cartão   1  2  3  4  5  6  7  8 | 9 10 11 12 13 14 15 16 | 17 18 19 20 21 22 23 24 25 | 26 27 28 29 | 30 … 38 39
nível    ————— 1 —————————————— | ———— 2 —————————————— | ————— 3 ——————————————— | —— 4 —— | ——— 5 ———
exig.    1  1  3  1  1  1  1  1 | 1  2  1  2  2  1  1  1 |  2  1  1  1  1  2  1  3  3 |  1  4  4  1 |  1 … 1  2
```

| Bloco | Cartões | Exigência média |
|---|---|---|
| Nível 1 | 1–8 | **1,25** |
| Nível 2 | 9–16 | **1,38** |
| Nível 3 | 17–25 | **1,67** |
| Nível 4 | 26–29 | **2,50** |
| Nível 5 | 30–39 | **1,10** |

Três fatos saltam do desenho, e são eles que respondem *"não está linear"*:

1. **A escada sobe quatro degraus e desce cinco.** O pico está nos cartões 27 e 28 (`e25`,
   `e14`, decidir). Depois disso vêm **nove cartões seguidos de reconhecimento puro** (30 a
   38), e o bloco final fica **abaixo do bloco de abertura** — 1,10 contra 1,25. O leitor que
   chegou a decidir volta a marcar alternativa sobre quem publicou primeiro em 1805.
2. **A abertura é um platô de seis.** Cartões 4 a 9: seis exercícios seguidos de
   reconhecimento, todos com a resposta escrita no cartão imediatamente acima.
3. **A primeira exigência alta do capítulo é a terceira de todas** (`e30`, cartão 3,
   transferir). Ela chega antes de qualquer cálculo, antes da fórmula e antes da tabela de
   decisão de que ela depende.

---

## 2. Desalinhamentos, com identificador e cartão

### 2.1 Cobra menos do que o texto ensinou

**D1 — O objetivo O1 nunca é exercido. É o achado central.**
O1 declara *"**Derivar** a regressão linear como minimização do erro quadrático"*. Tem **14
exercícios**, quase cinco vezes o trio do ADR 0014 (`adr/0014-tres-exercicios-por-objetivo-e-a-prova.md`).
Nenhum deles pede derivar. Treze são reconhecer e um (`e16`, cartão 8) é completar uma
palavra. O ADR 0014 fixa que *"o teto do trio é o verbo do objetivo"*; aqui o teto fica dois
degraus abaixo dele, catorze vezes seguidas. A dedução em cinco passos ocupa os cartões 9 a
14 e **nenhum exercício do capítulo pede um passo dela** — o mais próximo é a interação
`i11` (cartão 13), que é `desvanecido`, não vale nota, e revela no cliente.

**D2 — O bloco histórico produz nove exercícios que não medem o objetivo que declaram.**
`e31`(c30), `e32`(c31), `e33`(c32), `e34`(c33), `e35`(c34), `e36`(c35), `e37`(c36) estão
rotulados **O1** e perguntam sobre Legendre, Gauss, Stigler e sobre a convenção de selos do
próprio livro. `e37` pede completar *"é ______ deste livro, e o selo 📖 existe para dizer
isso"*. Isso não é derivar a regressão como minimização; é recuperar a política editorial do
livro. O rótulo passa no portão de `publicar/exercicios.mjs` (o objetivo O1 existe no
capítulo) e mente para o quadro da turma, que vai reportar O1 dominado por quem nunca
derivou nada.

**D3 — Seis exercícios seguidos parafraseiam a linha anterior.**
Cartões 4 a 9: `e15` pergunta o que comparar, e o cartão acabou de dizer que se compara
previsão com observado; `e8` pergunta o que muda entre três convenções da perda, e a caixa
imediatamente acima diz *"constante positiva não move o mínimo"*; `e1` pergunta por que ao
quadrado, e o cartão lista as três razões numeradas; `e9` pergunta por que ensinar gradiente
se a fechada existe, e o cartão responde antes. O aluno passa relendo, e reler não é o gesto
que a `interacao` já cobrou no mesmo cartão.

**D4 — Nenhum laboratório onde a evidência diz que laboratório rende.**
Os dois laboratórios estão nos cartões **8** e **15**, os dois em zona de **procedimento**
(O1/O2). Os blocos de **conceito e transferência** (cartões 17 a 29, O3 e O4) têm **zero**
objetos manipuláveis. Pela regra da §4 da `BASE-EDUCACIONAL.md`, prática antes rende
**g = +0,36** ⏳ em conceito e transferência e **g = −0,03** ⏳ em procedimento. Os
laboratórios estão exatamente na metade em que o intervalo cruza o zero.

**D5 — O laboratório `l1` é prática-antes num objetivo de procedimento.**
O cartão 8 (*Ponha a reta à mão*) põe o leitor a arrastar a reta **antes** da dedução, que só
começa no cartão 9. O exercício que o fecha, `e16`, é O1. Ou `l1` é conceitual e está
rotulado no objetivo errado, ou é procedimental e está no lugar errado — e o
ADR 0022 (`adr/0022-a-ordem-do-capitulo-pratica-antes-historia-depois.md`),
escrito sobre este capítulo, é quem proíbe as duas leituras. Nenhum portão vê isso.

### 2.2 Cobra mais do que a sequência preparou

**D6 — `e30` (cartão 3) precisa do cartão 33.**
Pede por que a calibração pesa mais que a ordenação quando o número é multiplicado pelo valor
da apólice. O cartão 3 só afirma que o linear *"nasce razoavelmente calibrado"*. O argumento
que a resposta exige — multiplicar exige o valor certo, ordenar não — só é construído no
cartão 33 (*O caso da seguradora*, `i21`, `e14`). O próprio retorno de `e30` confessa:
*"É a segunda linha da tabela que fecha este capítulo."* O leitor no cartão 3 acerta por
eliminação ou erra por não ter lido o que ainda não existe.

**D7 — `e6` (cartão 24) é a única `aberta` e viola o teto do seu objetivo.**
Está rotulada **O4**, cujo verbo declarado é *"**Reconhecer** as situações em que o modelo
linear é a escolha certa"*. O ADR 0014 fixa: *"Objetivo que diz 'Aplicar' gera trio que
termina em Aplicar, e nenhuma `aberta`"*, e reserva resposta aberta a objetivos de Avaliar e
Criar. Uma `aberta` sobre um objetivo de Reconhecer está acima do teto. Some-se que os cinco
critérios da rubrica de `e6` falam de R², de confundimento e de qual experimento faltaria —
conteúdo de **O3**, não de O4. O exercício é bom; o rótulo e o teto estão errados.

**D8 — O salto dos cartões 26→27 não tem degrau intermediário.**
`e41` (c26) é completar uma palavra. `e25` (c27) e `e14` (c28) pedem aplicar a tabela de
decisão a dois casos novos, com restrições em conflito, e `e14` ainda é `multipla-multi`,
o único do capítulo. Entre "preencher a lacuna" e "pesar cinco restrições" não há nada.

**D9 — `e24` (c20) usa R² antes de o capítulo garantir que o leitor o tenha.**
O R² é definido no cartão 19 (linha 722) e aparece antes disso, na correção de `e26`
(cartão 15, linha 545), como *"outra régua"*. A definição chega um cartão antes do exercício
que a cobra. É a margem mais estreita do capítulo e vale registrar como risco, não como
defeito.

---

## 3. Como as três fontes desenham a prática

### 3.1 Géron, *Hands-On Machine Learning*, capítulo 10 — ✓ (arquivo aberto e contado)

Confirmo as medidas do coordenador, contadas em `/tmp/geron10.ipynb`:

| Medida | Valor |
|---|---|
| Células | **211** (130 código, 81 markdown) |
| Linhas de código por célula | **mediana 3**, média 4,8, máximo 37 |
| Palavras por célula de markdown | **mediana 13**, média 29,2 |
| Seção `Exercise solutions` | células 168 a 210 = **43 células** (23 código, 20 markdown) |

A forma dos exercícios:

- **Dez exercícios por capítulo.** Os nove primeiros são conceituais e a solução inteira cabe
  em **uma célula de markdown** (célula 170, 933 palavras, **mediana de 101 palavras por
  resposta**, extremos 15 e 186). São respostas em prosa corrida, sem alternativas.
- **O décimo é um projeto**, com enunciado de 86 palavras e **critério numérico explícito**:
  *"See if you can get over 98% accuracy by manually tuning the hyperparameters."* A solução
  ocupa 37 células e termina com a frase que fecha o ciclo: *"We got over 98% accuracy."*
- **A solução viaja junto com o enunciado**, no mesmo notebook. Não há gabarito escondido:
  o notebook é assumidamente "all the sample code and solutions".

O que isso ensina ao nosso caso: o exercício longo do Géron é verificável porque tem **um
número com limiar declarado**. É o modelo mais próximo do que o autor pediu, e é também a
prova de que o formato existe fora daqui.

### 3.2 Google Machine Learning Crash Course — módulo de regressão linear

**O Colab, eu baixei e contei — ✓.** `linear_regression_taxi.ipynb`: **38 células** (21
código, 17 markdown), mediana de **12 linhas por célula de código** e **58 palavras por
célula de markdown**, em quatro partes (Setup, Dataset Exploration, Train Model, Validate
Model).

O desenho da prática dentro dele, que é o achado que interessa:

- **Uma única célula editável em todo o notebook.** A célula 26 traz
  `# TODO - Adjust these hyperparameters to see how they impact a training run.` sobre quatro
  parâmetros (`learning_rate`, `number_epochs`, `batch_size`, `input_features`). Todo o resto
  é `#@title` recolhido, para rodar e não para ler.
- **Seis células de gabarito escondido**, nas posições 13, 16, 24, 27, 30 e 37, todas com o
  título `#@title Double-click to view answers…`. Cada uma guarda de duas a três perguntas
  em prosa, do tipo *"How did raising the learning rate impact your ability to train the
  model?"*, respondidas em 40 a 60 palavras.
- **O gabarito está no próprio arquivo**, atrás de um duplo clique. É esconderijo de
  interface, não de servidor.
- **O par pergunta-resposta é sempre a mesma sanduíche**: célula de instrução em markdown →
  célula de código para rodar → célula de resposta recolhida.

**Da página HTML do módulo — ⏳** (li por resumo, não abri a página): o módulo tem nove
sub-páginas em 80 minutos, com **uma** pergunta *Check your understanding* por página de
conteúdo (a de *Linear regression* com 3 alternativas; a de *Loss* com 2), retorno explicativo
por alternativa, dois exercícios interativos, um exercício de programação e um quiz final.
O exercício interativo de redes neurais declara um **critério numérico de sucesso**:
*"training and test loss below 0.2"*, com solução dada (uma camada oculta, 3 neurônios,
taxa 0,01, ReLU).

### 3.3 fastbook — ✓ (três notebooks baixados e contados)

| Capítulo | Perguntas no `Questionnaire` | Mediana de palavras por pergunta | `Further Research` |
|---|---|---|---|
| `01_intro` | 35 | 12 | 2 itens |
| `04_mnist_basics` | 39 | 10 | 2 itens |
| `08_collab` | 35 | 13 | 3 itens |

A forma:

- **Nenhuma alternativa, nenhum gabarito no livro.** São perguntas abertas curtas
  (*"What is a 'rank-3 tensor'?"*), respondidas pelo leitor e conferidas fora do livro.
- **Bloco único ao fim do capítulo**, não distribuído pelo texto: 4 a 6 células no total.
- **Algumas perguntas exigem código**, na mesma lista e sem aviso: *"What is a list
  comprehension? Create one now that selects odd numbers from a list and doubles them."*
- **`Further Research` é a única faixa de transferência**, e é declarada não-respondida:
  *"Answers to these questions aren't on the book's website; you'll need to do your own
  research!"*

### 3.4 A comparação, com número

| | II.2 (nosso) | Géron cap. 10 | MLCC regressão linear | fastbook (mediana dos 3) |
|---|---|---|---|---|
| Unidade | cartão (39) | capítulo (1) | página (9) | capítulo (1) |
| Perguntas por unidade | **1** | 10 | ~1 | 35–39 |
| Perguntas por capítulo | **39** | 10 | ~11 | 35–39 |
| Formato dominante | múltipla, 4 alternativas | prosa aberta | múltipla, 2–3 alternativas | prosa aberta |
| Explicação por resposta | **127 palavras** (mediana) | 101 palavras | ~40–60 palavras | zero |
| Objeto manipulável | 2 laboratórios | 1 notebook (37 células) | 2 interativos + 1 Colab | o notebook inteiro |
| Célula editável pelo aluno | — | livre | **1 `TODO`** | livre |
| Critério numérico de sucesso | 6 exercícios `numerica` | 1 (*over 98%*) | 1 (*loss < 0.2*) | nenhum |
| Onde mora o gabarito | **servidor** | no notebook | no notebook, recolhido | não existe |

Três leituras que a tabela sustenta:

1. **Somos os mais densos em quantidade e os mais generosos em explicação.** 39 perguntas
   contra 10 do Géron, e 127 palavras de correção contra 40 do Google. A `BASE-EDUCACIONAL.md`
   §5 já declarou a profundidade da correção **fora de escopo** de comparação, e mantenho:
   o número não é defeito.
2. **Somos os únicos que corrigem no servidor**, e é a nossa vantagem estrutural. As três
   fontes entregam o gabarito junto com a pergunta. Nós podemos pedir um número e conferi-lo
   sem devolvê-lo (`exercicios.py:105`).
3. **Somos os únicos sem uma faixa declarada de transferência.** O Géron tem o exercício 10,
   o Google tem o `TODO` e o critério de perda, o fastbook tem `Further Research`. Nós temos
   39 perguntas fechadas e **duas** de transferência, uma delas fora de ordem (`e30`).

---

## 4. Recomendação: uma só

> **Adotar a escada do ADR 0014 como a chave de ordenação da prática, por objetivo, e
> convertê-la em portão executável.**

Ou seja: a sequência que o aluno percorre não é a ordem narrativa dos cartões, é **um objetivo
por vez, cada um com a sua escada de três degraus terminando no verbo declarado**:
E1 dois degraus abaixo do verbo, E2 um degrau abaixo, E3 exatamente no verbo. É a regra que o
repositório já ratificou em 2026-08-13 e que o `II.2` não cumpre em nenhum dos quatro
objetivos por excesso, e em O1 por catorze exercícios de déficit.

### 4.1 Por que esta, e não as cinco que o comitê mandou considerar

Considerei as cinco, e nenhuma sobrevive inteira ao que este repositório já tem escrito.

| Padrão | Selo | Por que não é a recomendação |
|---|---|---|
| **Mastery learning** (Bloom) | ⏳ atribuição corrente; não abri a fonte e **não cito efeito** | Exige travar o avanço até o degrau verificado. O livro é navegável e o leitor escolhe o cartão; travar contradiz a superfície. Não há evidência na nossa base, e o custo de implementar o travamento é alto. **Aproveito uma peça dela**: o degrau tem de ser *verificado*, não *visitado* — é o que o portão da §4.3 faz. |
| **Prática intercalada** (Rohrer & Taylor) | ⏳ mesma condição | Rende quando há **tipos de problema confundíveis** para discriminar. O `II.2` tem essencialmente um procedimento (mínimos quadrados de uma variável). Intercalar aqui misturaria história com álgebra, que é exatamente a não-linearidade de que o autor reclama. **Onde vale**: entre `II.2` e `II.3`, na prova de parte, não dentro do capítulo. |
| **Teste como aprendizagem** (Roediger & Karpicke) | ⏳ mesma condição | É um argumento para **manter** o que já existe (39 cartões terminam em exercício corrigido), não uma regra de ordenação. Não resolve o defeito medido. |
| **Problemas de completar com desvanecimento** (Sweller 1988 **✓**; van Merriënboer, Clark & de Croock 2002 **✓**; Atkinson, Renkl & Merrill 2003 **⏳**) | ✓ / ⏳ | É a mais forte, e **entra como o mecanismo dos degraus**, não como o padrão de progressão. Diz como subir de E1 para E3 dentro de um objetivo de procedimento; não diz em que ordem os objetivos vêm. |
| **Avaliação formativa embutida** (Black & Wiliam) | ⏳ mesma condição | Descreve o que a `:::interacao` já é — 38 delas, não valem nota, revelam depois do compromisso. Já implementado. |

A escada do ADR 0014 vence por três razões verificáveis, não por preferência:

- **Já é lei aqui**, com data e comitê, e está sendo descumprida. Recomendar o cumprimento de
  uma regra ratificada custa menos que ratificar uma nova, e o Princípio VII (YAGNI, no
  Maestro) e o Princípio VII da constituição deste repositório empurram na mesma direção.
- **É a unidade certa.** A queixa do autor é sobre passos evolutivos. Passo evolutivo é uma
  relação entre exercícios do **mesmo objetivo**, não entre cartões vizinhos: dois cartões
  vizinhos podem tratar de objetivos diferentes sem que isso seja um degrau.
- **É computável.** Verbo do objetivo e exigência do exercício são duas etiquetas; comparar
  as duas é um `if`. Nenhuma das cinco alternativas vira asserção com esse custo.

### 4.2 O que isso muda no `II.2`, concretamente

| Objetivo | Verbo | Hoje | O que a escada exige |
|---|---|---|---|
| **O1** Derivar | Derivar (procedimento) | 14 exercícios, teto em reconhecer | E1 `completar` (`e16` serve) · E2 `desvanecido` com a linha do passo 2 apagada · **E3 novo: derivar um dos cinco passos**, `completar` de múltiplas lacunas ou `numerica` com o resultado da derivada. Os nove exercícios de história saem de O1. |
| **O2** Obter e calcular | Calcular (procedimento) | 8 exercícios, 3 calculam, teto atingido em `e7` | Está conforme. Cortar dois dos cinco `reconhecer` do bloco. |
| **O3** Interpretar | Interpretar (conceito) | 8 exercícios, teto em `e12` | Está quase conforme. **Receber `e6`**, cuja rubrica já é O3. |
| **O4** Reconhecer | Reconhecer (conceito) | 9 exercícios, dois **acima** do teto (`e25`, `e14`) e uma `aberta` acima do teto (`e6`) | Ou o verbo de O4 sobe para *Decidir* na declaração do capítulo, e aí `e25`/`e14`/`e6` ficam legais, ou eles descem. **Recomendo subir o verbo**: o capítulo de fato ensina a decidir, e o objetivo é que está subdeclarado. |
| **O5 (novo)** Situar historicamente | Reconhecer | não existe | Recebe os nove exercícios do bloco 30–38, hoje mentindo como O1. E aí a escada permite que o bloco **inteiro** feche com um exercício só, em vez de nove. |

### 4.3 O portão que cobra (a parte que impede a regra de virar opinião)

Um script novo, no padrão da §7 da `BASE-EDUCACIONAL.md`, que reprova quando:

1. **Teto não atingido** — nenhum exercício de um objetivo alcança o verbo declarado.
2. **Teto ultrapassado** — algum exercício exige mais que o verbo declarado (pega `e6`,
   `e25` e `e14` hoje).
3. **Queda maior que um degrau** — dentro de um bloco de mesmo nível, a exigência cai mais de
   um degrau entre cartões consecutivos (pega a queda 4 → 1 do cartão 28 para o 29, e a
   queda 4 → 1 do 28 para o 30).
4. **Platô** — mais de quatro cartões consecutivos com a mesma exigência (pega o platô de
   seis na abertura e o de nove no fim).

O item 3 e o item 4 precisam de um campo novo no bloco do exercício, algo como
`"exige":"reconhecer|calcular|produzir|transferir|decidir"`. É uma etiqueta escrita pelo
autor, não inferida por modelo, exatamente como `objetivo` e `dificuldade` já são.

### 4.4 Onde esta recomendação **não** vale

- **No bloco histórico.** O ADR 0022 já diz, com selo ❌, que a posição da narrativa histórica
  repousa em ritmo e não em aprendizagem medida. Forçar uma escada ali fabricaria exercícios
  de derivação sobre Legendre. A regra correta para o bloco 30–38 é a oposta: **menos**
  exercícios, um só, e um objetivo próprio.
- **Na `Verificação`** (cartão 39). O ADR 0012 já a fez superfície corrigida com regra
  própria; ela mede recuperação cumulativa e não pertence a nenhuma escada.
- **Entre capítulos.** A escada é intra-objetivo. A progressão `II.2 → II.3 → II.4` é
  problema do sumário, não deste portão.
- **Quando o objetivo tem verbo baixo de propósito.** Um objetivo declarado como *Reconhecer*
  e cumprido com três exercícios de reconhecer está conforme, mesmo parecendo raso. O portão
  reprova incoerência, não ambição.

---

## 5. O ciclo do notebook

O autor descreveu: *"o aluno abre o notebook, pratica o exercício fazendo a alteração
necessária, executa o notebook e insere o resultado no card."*

### 5.1 A mecânica já existe, e ela não vaza

O tipo `numerica` guarda `gabarito_num: {"valor": …, "tolerancia": …}` no `banco.json`, e a
correção acontece em `chat-companion/backend/exercicios.py:105`. O cliente envia um número e
recebe certo/errado com retorno; **o valor nunca desce para a página**. É o Princípio VIII.3
cumprido pela arquitetura, não por disciplina. Exemplos vivos: `e19` guarda
`{valor: 1.5, tolerancia: 0.02}`, `e4` guarda `{valor: 53, tolerancia: 4}`.

Portanto: **é verificável sem vazar.** Com cinco condições, e a quinta é a que mais importa.

### 5.2 Onde cabe — três cartões, e por quê

A regra da §4 da `BASE-EDUCACIONAL.md` decide o **lugar**: em procedimento, o notebook vem
depois do exemplo trabalhado; em conceito e transferência, vem antes da explicação.

| # | Cartão | Objetivo | O aluno altera | O número que volta | Tipo | Por que ali |
|---|---|---|---|---|---|---|
| **N1** | **13** (*Uma vez com número*) | O2, procedimento | Troca um dos quatro pontos do conjunto por um valor dado no enunciado, e roda | A nova inclinação $a$, duas casas | `numerica`, tolerância 0,02 | Vem **depois** dos passos 2, 3 e 4. É o E3 que falta a O2: executar o procedimento inteiro em dado que ele não viu. Substitui `e7`, que hoje pede a mesma conta à mão |
| **N2** | **21** (*Controlar remove só o que a variável mede*) | O3, conceito | Restringe o conjunto da limonada a julho e agosto e reajusta | O coeficiente de `preco` no recorte | `numerica`, tolerância a medir | Vem **antes** da explicação do cartão 22. É o *"tente o conserto óbvio"* que o cartão 23 hoje só narra. Zona do g = +0,36 ⏳ |
| **N3** | **27** (*As cinco situações*) | O4, transferência | Escolhe entre linear e ensemble num conjunto de 180 × 60 e roda os dois | A diferença de erro de teste entre os dois, ou o número de parâmetros de cada um | `numerica` | O único cartão do capítulo onde há uma decisão a tomar com dado na mão. Zona do g = +0,36 ⏳ |

Um só notebook por cartão, e **um número por exercício**: o backend não tem tipo para tupla,
e inventar um contradiz o ADR 0014, que segurou a superfície em cinco tipos determinísticos.
Se um cartão precisa de dois números, são dois exercícios encadeados, não um tipo novo.

### 5.3 As cinco condições

1. **O número tem de ser determinístico.** Semente fixa, sem embaralhamento, sem divisão
   aleatória, sem inicialização sorteada. É por isso que o laboratório `l2` (varredura de
   4 000 passos) é laboratório e não exercício: o `i39` que o acompanha já precisa de
   `tolerancia: 500` sobre um alvo de 1 460, o que é 34% de margem. Margem assim não
   verifica nada.
2. **A tolerância vem de medição, não de gosto.** Rodar o notebook em três ambientes (a
   máquina do autor, o Colab e o contêiner do CI) e usar a dispersão observada. Uma
   tolerância chutada larga deixa passar quem errou; uma estreita reprova quem acertou.
3. **O notebook não pode dizer o número em prosa.** Este é o vazamento real hoje, e ele já
   está publicado: `ml-zero/etapa-05/regressao_limonada.ipynb` traz, na célula 12 de
   markdown, *"53 panfletos por copo"* — que é, dígito por dígito, o gabarito de `e4`. As
   saídas estão limpas (0 de 8 células de código com saída armazenada ✓), então o vazamento
   não é do executor: é do texto. A regra que fica: **num notebook usado como exercício, o
   número pedido não aparece em célula de markdown nenhuma**, e um portão pode conferir isso
   com uma expressão regular sobre o valor do `gabarito_num`.
4. **Duas tentativas revelam.** `TENTATIVAS_ATE_REVELAR = 2` em `exercicios.py:24`: na
   segunda tentativa o backend imprime a resposta esperada. Um notebook custa quinze minutos
   e duas tentativas custam dois cliques. Ou o exercício de notebook usa um limiar próprio
   (sugiro 3), ou aceita-se que ele é um convite honesto e não uma prova. **Recomendo o
   limiar próprio**, porque é uma linha de código e preserva o único exercício caro do
   cartão.
5. **O número prova o número, nunca a execução.** Um aluno que raciocina, que pergunta ao
   companheiro de chat ou que copia de um colega entrega os mesmos dígitos. O cartão pode
   dizer *"confira o seu resultado"*; não pode dizer *"comprovadamente executou"*. Se alguém
   pedir a segunda frase, a resposta honesta é **não**: nada nesta arquitetura observa o
   navegador do aluno, e fingir que observa é pior que não ter o recurso.

### 5.4 O formato do notebook, copiado de quem já acertou

Do Colab do Google, que é o desenho mais próximo do pedido (✓, medido):
**uma única célula editável, marcada com `# TODO`, e todo o resto recolhido para rodar.**
38 células e um `TODO`. O nosso `regressao_limonada.ipynb` tem 17 células e **zero** `TODO`:
hoje ele é leitura executável, não exercício. Convertê-lo custa uma célula marcada e uma
frase de instrução.

Do Géron (✓): **o critério de sucesso vem no enunciado, em número** (*"over 98% accuracy"*).
O nosso equivalente é a tolerância, e ela deve aparecer no enunciado do cartão — *"responda
com duas casas decimais"* — como `e7` e `e19` já fazem.

O que **não** copiamos de nenhum dos três: o gabarito dentro do arquivo. Duplo clique é
esconderijo de interface. O nosso fica no servidor, e é a única vantagem estrutural que
temos sobre as três fontes.

---

## 6. Se eu estiver errado

**A hipótese que me derruba.** A queixa do autor pode ser sobre a **ordem narrativa** — a
sensação de que o capítulo tem dois capítulos dentro, que o próprio diagnóstico de densidade
já mediu (2,9 ideias novas por 100 palavras nos cartões 1–11 contra 1,1 nos 12–18, registrado
no ADR 0022) — e não sobre a exigência da prática. Se for isso, o portão da §4.3 é cerimônia:
mede uma coisa saudável enquanto o leitor tropeça noutra.

**O teste que separa as duas, e é barato.** Dar o baralho a três leitores da persona alvo e
pedir, em cada cartão, uma frase: *"o que eu tenho de fazer para passar daqui?"*. Se as
respostas vierem 28 vezes na forma *"marcar a alternativa que o cartão acabou de dizer"*,
o defeito é da prática e a minha recomendação vale. Se vierem na forma *"entender de onde
saiu isso"*, o defeito é da narrativa e quem tem razão é outro especialista deste comitê.

**O que eu faria em seguida, nos dois casos.** A classificação da §1.2 é minha e é
falsificável: qualquer pessoa pode reclassificar os 39 e discordar de cada linha. Publicaria
a etiqueta `exige` no Markdown antes de qualquer outra mudança, e deixaria o autor
reclassificar. Se a distribuição dele der 72% de reconhecer como a minha deu, o diagnóstico
está fechado com duas leituras independentes, que é o padrão de prova que o ADR 0022 usou
para a junta de densidade. Se der outra coisa, eu estava errado e o número mostra onde.

**O que eu não abriria mão em nenhum cenário.** Três coisas, e as três são falhas de
consistência interna que independem de qual especialista tem razão sobre a sequência:

- **D1** — O1 tem catorze exercícios e nenhum exerce o verbo declarado.
- **D2** — nove exercícios sobre história rotulados no objetivo de derivar.
- **§5.3, item 3** — um gabarito publicado em prosa dentro de um notebook do repositório.

---

## Referências e selos

**Medido nesta sessão (✓):** `livro/capitulos/ii-2-modelos-lineares.md` ·
`chat-companion/backend/banco.json` · `chat-companion/backend/exercicios.py` ·
`ml-zero/etapa-05/regressao_limonada.ipynb` · `/tmp/geron10.ipynb` ·
`linear_regression_taxi.ipynb` (Google, baixado do repositório `google/eng-edu`) ·
`01_intro.ipynb`, `04_mnist_basics.ipynb`, `08_collab.ipynb` (fastbook).

**Lido por resumo, não na fonte (⏳):** as páginas HTML do Google Machine Learning Crash
Course (módulos de regressão linear e de redes neurais). Tudo que atribuo a elas na §3.2
carrega este selo.

**Herdado da base do livro, com o selo que ela já declara:** Sinha & Kapur 2021 (⏳) ·
Alfieri et al. 2011 (⏳) · Bisra et al. 2018 (⏳) · Atkinson, Renkl & Merrill 2003 (⏳) ·
Sweller 1988 (✓) · van Merriënboer, Clark & de Croock 2002 (✓) · Wiggins & McTighe (⏳,
conferir edição).

**Citado sem fonte aberta, sem número (⏳):** Bloom (mastery learning) · Rohrer & Taylor
(prática intercalada) · Roediger & Karpicke (teste como aprendizagem) · Black & Wiliam
(avaliação formativa). Nenhum tamanho de efeito é citado para nenhum dos quatro, e nenhum
deles sustenta a recomendação da §4. Entram na fila de verificação da §8 da
`BASE-EDUCACIONAL.md` se o comitê quiser usá-los como argumento.

**Decisões do repositório usadas como base:** ADR 0012 (verificação como superfície
corrigida) · ADR 0014 (o trio é uma escada, o teto é o verbo) · ADR 0015 (laboratório sem
manopla) · ADR 0022 (prática antes por tipo de conhecimento; história ao fim, selo ❌).
