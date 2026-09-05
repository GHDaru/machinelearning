# Especialista 1 — sequenciamento e progressão de dificuldade

**Objeto:** `livro/capitulos/ii-2-modelos-lineares.md`, 39 cartões, 1 426 linhas.
**Pergunta do autor:** *"para um aluno precisando de passos evolutivos, não está linear."*
**Escopo deste parecer:** a ordem. Não avalio o modelo do cartão (aprovado), nem a prosa, nem
a correção técnica do conteúdo.

Siglas usadas aqui, na primeira ocorrência: **EQM** (erro quadrático médio), **ADR**
(*Architecture Decision Record*, registro de decisão de arquitetura), **DOI** (*Digital Object
Identifier*, identificador digital de objeto), **AUC** (*Area Under the Curve*, área sob a curva).

---

## 1. A sequência atual, medida

39 cartões. Medi cada um: nível declarado, palavras de teoria (o texto antes do primeiro
bloco `:::`), palavras totais do cartão, tipo de interação, presença de laboratório,
objetivo e dificuldade do exercício.

| # | Nível | Título (abreviado) | Teoria | Interação | Lab | Obj | Dif | O que exige que o aluno já saiba |
|---|---|---|---|---|---|---|---|---|
| 1 | 1 | O que este capítulo cobra | 105 | prever | — | O4 | fácil | o que é regressão vs. classificação; o que é fórmula fechada |
| 2 | 1 | A carta de recusa | 81 | princípio | — | O4 | média | o que é *ensemble*; o que é métrica de acerto |
| 3 | 1 | Três vantagens | 111 | prever | — | O4 | média | calibração, ordenação, viés-variância (cap. II.1 e 0.2) |
| 4 | 1 | O modelo é uma reta | 82 | prever | — | O1 | fácil | notação com índices; $d$ atributos |
| 5 | 1 | O critério: EQM | 77 | desvanecido | — | O1 | fácil | somatório; o que é resíduo (ainda não nomeado) |
| 6 | 1 | Por que ao quadrado | 110 | prever | — | O1 | média | diferenciabilidade; *outlier* |
| 7 | 1 | A fechada existe, e ainda assim o gradiente | 73 | princípio | — | O1 | **difícil** | **equações normais, derivada igualada a zero, inversão de matriz $d\times d$ — nada disso foi dado** |
| 8 | 1 | Ponha a reta à mão | 11 | — | **L1** | O1 | fácil | resíduo como distância vertical |
| 9 | 2 | Passo 1 — a tigela | 107 | prever | — | O1 | média | convexidade |
| 10 | 2 | Passo 2 — centro de massa | 82 | princípio | — | O2 | fácil | derivada parcial |
| 11 | 2 | Passo 3 — ortogonalidade | 70 | princípio | — | O2 | média | regra da cadeia |
| 12 | 2 | Passo 4 — o sistema | 70 | princípio | — | O2 | média | álgebra de somatórios em torno da média |
| 13 | 2 | Uma vez com número | 101 | desvanecido | — | O2 | média | os passos 2 e 4 |
| 14 | 2 | Passo 5 — o denominador avisa | 57 | prever | — | O2 | **difícil** | $S_{xx}$; e o distrator cita **colinearidade**, ainda não dada |
| 15 | 2 | O gradiente contra a álgebra | 11 | prever | **L2** | O2 | média | **padronização e colinearidade, nenhuma das duas dada** |
| 16 | 2 | O que mudou não foi o otimizador | 63 | prever | — | O2 | média | superfície de erro em 2 pesos |
| 17 | 3 | O que o coeficiente diz | 105 | prever | — | O3 | fácil | razão de chances (adiantada de II.3) |
| 18 | 3 | A correlação que recomenda o contrário | 31 | prever | — | O3 | fácil | correlação de Pearson (cap. I.4) |
| 19 | 3 | O preço é termômetro disfarçado | 79 | princípio | — | O3 | média | leitura de tabela por subgrupo |
| 20 | 3 | O controle que não salva | 88 | desvanecido | — | O3 | média | **regressão múltipla ajustada; $R^2$, definido em nota de rodapé** |
| 21 | 3 | Controlar remove só o que mede | 93 | princípio | — | O3 | **difícil** | confundimento |
| 22 | 3 | O panfleto, de brinde | 87 | prever | — | O3 | fácil | **colinearidade — definida aqui, 8 cartões depois do 1º uso** |
| 23 | 3 | Reproduza | 54 | prever | — | O3 | média | **pandas (`df.corr`, `df.groupby`) — que o notebook do livro não usa** |
| 24 | 3 | O confundimento é perfeito | 95 | princípio | — | O4 | média | desenho experimental, aleatorização |
| 25 | 3 | As quatro coisas que não diz | 126 | princípio | — | O3 | média | extrapolação, padronização |
| 26 | 4 | Quando o linear é a escolha certa | 24 | princípio | — | O4 | fácil | — |
| 27 | 4 | As cinco situações | 95 | prever | — | O4 | média | linha de base, variância, latência |
| 28 | 4 | O caso da seguradora | 21 | princípio | — | O4 | **difícil** | AUC (cap. II.1) |
| 29 | 4 | Treine sempre um linear primeiro | 80 | prever | — | O4 | fácil | *boosting* (cap. II.5, ainda não lido) |
| 30 | 5 | O aperto (astronomia) | 89 | prever | — | O1 | média | — |
| 31 | 5 | A virada: uma regra pública | 85 | princípio | — | O1 | fácil | — |
| 32 | 5 | Perda é critério de arbitragem | 76 | prever | — | O1 | **difícil** | — |
| 33 | 5 | A disputa de prioridade | 96 | prever | — | O1 | média | — |
| 34 | 5 | Stigler, e o caso segue aberto | 99 | princípio | — | O1 | média | leitura de *hedge* em resumo científico |
| 35 | 5 | Crédito não segue descoberta | 81 | princípio | — | O1 | média | cap. III.1 (ainda não lido) |
| 36 | 5 | Procedência das afirmações | 122 | prever | — | O1 | **difícil** | a legenda de cinco selos |
| 37 | 5 | Mão na massa (notebook) | 75 | prever | — | O2 | fácil | Python, Colab, `Padronizador`, vazamento (cap. I.3) |
| 38 | 5 | Síntese | 161 | princípio | — | O1 | média | tudo |
| 39 | 5 | Verificação | 93 | princípio | — | O4 | média | tudo |

**Perfil agregado.**

| Medida | Valor |
|---|---|
| Cartões | 39 |
| Palavras de teoria por cartão (mediana) | **82** |
| Palavras totais por cartão (mediana) | 428 |
| Objetos manipuláveis (laboratório) | **2** — cartões 8 e 15 |
| Artefatos executáveis (notebook) | **1** — cartão 37 |
| Fórmulas em bloco | **13, todas entre os cartões 4 e 13** |
| Cartões com fórmula em bloco | 10 de 39 (26%) |
| Exercícios por objetivo | O1 = 14 · O2 = 8 · O3 = 8 · O4 = 9 |
| Dificuldade | fácil 12 · média 21 · difícil 6 |

---

## 2. Onde a sequência quebra

Dez pontos, todos localizados. Onde digo "não linear", há número.

### B1 — O cartão 7 usa três objetos que só chegam nos cartões 10, 11 e 12 (ou nunca)

Cartão 7, linha 236: *"Derivando e igualando a zero, chega-se às **equações normais**"*. A
primeira derivada do capítulo aparece na **linha 336** (cartão 10). As equações normais
aparecem na **linha 412** (cartão 12).

Pior no exercício `e9`, linha 249, marcado **`dificil`** — é o **primeiro `dificil` do
capítulo, no cartão 7 de 39 (18%)**. O gabarito é *"Porque inverter $d \times d$ fica caro"*.
A palavra "matriz" ocorre **duas vezes no capítulo inteiro**: na linha 262 (o feedback desse
exercício) e na linha 1359. O capítulo nunca escreve uma matriz, nunca inverte nada, e a
dedução inteira (cartões 9 a 14) é de **um** atributo, com $a$ e $b$. O exercício mais difícil
do primeiro quinto do capítulo repousa num objeto que o capítulo não carrega.

### B2 — Deserto de 21 cartões sem nada para manipular

Laboratórios nos cartões **8** e **15**. Notebook no cartão **37**.

Distância entre objetos executáveis: **7, 22**. Do cartão 16 ao 36 — **21 cartões seguidos,
54% do capítulo** — o formato é exatamente o mesmo: teoria (mediana 82 palavras) → interação →
exercício. Vinte e uma vezes. É degrau repetido sem ganho: o gesto que o leitor executa no
cartão 16 é idêntico ao do cartão 36.

### B3 — O notebook chega 12 cartões depois da análise que ele reproduz

`ml-zero/etapa-05/regressao_limonada.ipynb` tem 17 células e reproduz, na ordem, exatamente
os cartões 18 a 25: a tabela de correlações ingênua, o `groupby` por preço, o ajuste múltiplo,
os 53 panfletos por copo, a contagem de preços por mês. É o *whole task* da parte central
do capítulo.

Ele é linkado no **cartão 37**, ou seja **94,9% do caminho**, depois dos sete cartões de
história. O leitor termina a análise da limonada no cartão 25, atravessa quatro cartões de
decisão e sete de história, e só então recebe o arquivo que teria fechado o gesto.

### B4 — A dificuldade declarada não progride: ela oscila

Correlação de postos (Spearman) entre a posição do cartão e a dificuldade declarada, com
empates tratados por posto médio: **ρ = 0,173** em 39 cartões.

Sequência (f = fácil, m = média, D = difícil):

```
f m m f f m D f m f m m m D m m f f m m D f m m m f m D f m f D m m m D f m m
             ^7                      ^14         ^21       ^28    ^32       ^36
```

- **11 quedas de dificuldade.** Só **2 delas** caem numa fronteira de nível declarado
  (entre 16→17 e 25→26). As outras nove são degraus para baixo dentro do mesmo nível.
- Média por terço: **1,69 · 1,85 · 2,00** numa escala de 1 a 3. O capítulo inteiro ganha
  **0,31 de um degrau** do começo ao fim.
- `facil` aparece nas posições **29, 31 e 37**, depois de cinco `dificil`.

### B5 — O rótulo `nivel` promete uma progressão que ele não entrega

O marcador `:::cartao {"nivel":N}` vira, na navegação, "Nível 5 · página 37/39"
(`publicar/cartoes.mjs`, linha 88: *"o número é o que dá ao leitor a noção de progressão"*).

Distribuição: nível 1 = 8 cartões · 2 = 8 · 3 = 9 · 4 = 4 · **5 = 10**.

O nível 5 abriga quatro funções distintas: história (30–36), a prática executável (37), a
síntese (38) e a verificação (39). Um leitor no cartão 37, prestes a abrir um notebook, lê o
mesmo rótulo do cartão 30, que só lhe pede leitura. O rótulo mede posição no arquivo, não
exigência.

### B6 — Vocabulário usado antes de existir, dentro do próprio capítulo

| Termo | 1º **uso** | 1ª **definição** | Distância |
|---|---|---|---|
| colinearidade | linha 507, distrator do cartão 14 | linha 790, cartão 22 | **8 cartões** |
| padronizar | linha 526, cartão 15 — na **premissa de uma previsão numérica** | linha 553, cartão 16 | 1 cartão, na ordem errada |
| $R^2$ | linha 719, dentro do bloco de código do cartão 20 | nota de rodapé, mesma linha | definido em nota, cobrado em exercício `media` no mesmo cartão |

E a dimensionalidade muda quatro vezes sem aviso: cartão 4 apresenta $d$ atributos → cartões
9–14 deduzem com **um** atributo ($a$, $b$) → cartões 15–16 voltam a dois → cartão 20 exibe
uma equação ajustada de quatro. O capítulo nunca diz que está trocando de terreno.

### B7 — O laboratório 2 tem a própria descoberta revelada pela interação acima dele

Cartão 15. Ordem no arquivo:

- **linha 523**, interação `i39`: *"Padronizados os atributos, em que passo o excesso cai
  abaixo de 1%?"* → revela *"No passo **1 460** … termina 2,8% acima ao fim dos 4 000 passos"*.
- **linha 530**, laboratório `l2` (`anima-normais`): *"varredura de 4 000 passos, e o placar
  mede o excesso de erro sobre o ótimo fechado"*.

A interação entrega o número que o laboratório existe para produzir. Inverte a regra do próprio
`GUIA-EDITORIAL.md` §2.3 (*"Ponha o laboratório **antes** da explicação, não depois"*) e a
condição de Alfieri que o `BASE-EDUCACIONAL.md` §3.2 registra.

### B8 — 8 dos 14 exercícios do objetivo O1 não cobram o verbo do objetivo

O1 é *"**Derivar** a regressão linear como minimização do erro quadrático"* — verbo do nível
**Analisar** na tabela de Bloom do `GUIA-EDITORIAL.md` §2.5.

Exercícios que apontam para O1: cartões 4, 5, 6, 7, 8, 9, **30, 31, 32, 33, 34, 35, 36, 38**.
Os oito em negrito estão na seção histórica e na síntese. Perguntam sobre Legendre, Gauss, o
*hedge* de Stigler e o selo 📖. **Nenhum pede que se derive coisa alguma.** A cadeia do
Backward Design (verbo do objetivo → evidência de aprendizado) está rompida em **57% dos
exercícios de O1**.

### B9 — O código que o cartão 23 manda rodar não roda no notebook que o livro dá

Cartão 23, linha 825:

```python
df.corr(numeric_only=True)["vendas"]
df.groupby("preco")[["temperatura", "vendas"]].mean()
df.assign(mes=df.data.dt.month).groupby("mes").preco.nunique()
```

Isso é pandas. `grep -c pandas ml-zero/etapa-05/regressao_limonada.ipynb` devolve **0** — o
notebook é biblioteca padrão, como a restrição 1 da constituição (`ml-zero`) exige, com
`csv`, `defaultdict` e uma função `correlacao` escrita à mão. O leitor que segue o cartão 23
até o cartão 37 encontra outro vocabulário.

### B10 — O capítulo abre pelo julgamento mais caro que ele tem

Cartões 1, 2 e 3 apontam todos para **O4** (*"reconhecer as situações em que o modelo linear é
a escolha certa"*), a transferência. Os exercícios pedem: escolher entre linear e logística
(`e28`), diagnosticar por que um *ensemble* campeão é recusado (`e29`, `media`), e explicar
por que calibração pesa mais que ordenação quando a probabilidade multiplica dinheiro
(`e30`, `media`).

O modelo — a soma ponderada — só é escrito no **cartão 4**, linha 128. O leitor é convocado a
escolher entre famílias de modelo antes de saber o que é a família de que trata o capítulo.

---

## 3. A régua: o notebook do capítulo 10 do *Hands-On Machine Learning*

Confirmei a medição do autor abrindo `/tmp/geron10.ipynb`. Bate:

| Medida | Géron cap. 10 | II.2 hoje |
|---|---|---|
| Unidades | 211 células (130 código, 81 markdown) | 39 cartões |
| Unidade de exposição (mediana) | **13 palavras** | **82 palavras** de teoria |
| Unidade executável (mediana) | **3 linhas** de código | — |
| Atos executáveis por ato de exposição | **1,6** (130/81) | **0,077** (3/39) |
| Mediana de células entre dois blocos de código | **1** (máximo 8) | **7 cartões** entre laboratórios (máximo 22) |
| Maior corrida de exposição sem execução | **7 células** | **21 cartões** |
| Corridas de markdown de 1 célula | **52 de 62 (84%)** | — |
| Primeiro ato executável do leitor | célula 15 = **7,1%** do notebook | cartão 37 = **94,9%** do capítulo |

**A espinha de Géron, confirmada, com as posições:**

```
 3  Setup                                              (11 células)
14  De neurônio biológico a artificial / Perceptron     ( 9)   ← 1ª execução na célula 15
23  MLP de regressão                                   ( 5)
28  MLP de classificação                               ( 2)
30  Implementar com Keras — carregar o dado            (19)
49    criar o modelo                                   (12)
61    compilar                                         ( 7)
68    treinar e avaliar                                ( 7)
75    prever                                           ( 6)   ← arco fechado na célula 81 (38%)
81  Repete o arco: MLP de regressão, API Sequential    ( 6)
87  Repete o arco: API funcional                       (20)
107 Repete o arco: subclassing                         ( 4)
111 Salvar · callbacks · TensorBoard · tuning          (57)
```

**Três coisas que essa progressão faz e a nossa não faz, com número:**

**(a) Ele fecha a tarefa inteira cedo e a repete quatro vezes.** O arco *carregar → criar →
compilar → treinar → prever* fecha na célula 81, a **38%** do notebook. Depois ele repete os
mesmos cinco tempos três vezes, com outra interface, e a prosa encolhe: 10 células de markdown
guiam as 35 de código do primeiro arco (0,46 de markdown por código); depois 2 para 4 (0,50);
depois 6 para 14 (**0,43**); depois 2 para 2. É o andaime desvanecendo sobre uma tarefa que
não muda.

O II.2 **nunca fecha a tarefa inteira dentro do capítulo**. O que mais se aproxima é um link
no cartão 37, e o capítulo acaba dois cartões depois.

**(b) A distância entre anunciar e mostrar o resultado é de uma célula.** 84% das corridas de
markdown de Géron têm **uma** célula, e a mediana entre dois blocos de código é **1**. O
leitor lê uma frase de 13 palavras e vê um número. Células 34, 36, 42, 46 são literalmente
`X_train.shape`, `X_train.dtype`, `y_train`, `class_names[y_train[0]]`.

Nossa distância mínima é o piso do próprio portão: `publicar/gates/cartoes-legiveis.mjs`,
`palavrasMin: 80`. **O piso do nosso cartão é 6,2 vezes a mediana da unidade dele.**

**(c) A pista conceitual dele é curta e a nossa é o capítulo todo.** Géron gasta as células 14
a 30 (**16 células, 7,6%**) indo de neurônio biológico a perceptron a MLP de regressão a MLP
de classificação — e o leitor já rodou `Perceptron().fit()` na célula 15. Só então vem a
implementação, quebrada em cinco passos nomeados.

Nós gastamos 36 cartões (**92%**) antes do primeiro `import`.

**O que a comparação não autoriza.** Géron é *tutorial* na taxonomia Diátaxis; o II.2 é
*explanation*, e a constituição proíbe misturar os dois na mesma seção (Princípio III). Não
proponho transformar o capítulo em notebook, e não uso a cadência dele como meta. Uso as três
medidas acima como **diagnóstico de forma**: fechar o arco cedo, repeti-lo, e encurtar a
distância entre anúncio e resultado são propriedades da sequência, não do gênero.

---

## 4. A recomendação: **4C/ID — classes de tarefa com andaime desvanecente** (van Merriënboer, Clark & de Croock, 2002)

Uma só. Não o currículo em espiral, não a Elaboration Theory, não o Cognitive Apprenticeship,
não o mastery learning. E a razão principal é uma regra deste repositório, não uma preferência
minha.

### 4.1 O selo, aplicado sem abrandamento

`livro/bibliografia.md`, linha 26:

> ✓ **van Merriënboer, J. J. G., Clark, R. E., & de Croock, M. B. M. (2002).** Blueprints for
> complex learning: The 4C/ID-model. *ETR&D*, 50, 39–64.
> [doi:10.1007/BF02504993](https://doi.org/10.1007/BF02504993) — *verificado em 2026-08-01.*

A legenda daquela página é ✓ = *"identificador (DOI), autoria e ano conferidos na fonte
primária"*. E a regra de tradução, que a própria página escreve, é estrita e conservadora:
*"um ✓ desta página conferido só por DOI/identificador vale como **✓ᵐ** no capítulo."* A nota
de verificação não registra que o corpo do artigo foi lido.

**Portanto o selo que eu carrego para dentro de um capítulo é ✓ᵐ**, não ✓: metadados
conferidos, conteúdo não lido neste repositório. Eu não li o artigo nesta sessão. O que estou
usando é o mapeamento que o repositório já publicou sobre ele (`BASE-EDUCACIONAL.md` §2,
Princípio III da constituição), e é isso, e só isso, que o ✓ᵐ cobre.

**E é por isso que os outros quatro candidatos perdem.** Reigeluth, Bruner, Collins–Brown–Newman
e Bloom **não estão em `bibliografia.md` nem em `BASE-EDUCACIONAL.md`**. Verifiquei:

```
grep -i "merri|4C/ID|Reigeluth|Bruner|Collins|apprentice|Bloom|mastery" livro/bibliografia.md
→ só Sweller (✓), van Merriënboer (✓) e Wiggins & McTighe (⏳)
```

Qualquer um deles entraria como **⏳ na melhor das hipóteses**, e a regra da própria página é
literal: *"Uma referência ⏳ pode aparecer numa lista de leitura, **nunca como evidência de uma
afirmação**."* Recomendar Elaboration Theory ou espiral hoje significa uma de duas coisas:
pagar antes um ciclo de verificação (a fila do §8 já tem seis linhas abertas, quatro delas
sustentando regra publicada), ou publicar uma regra estrutural sobre um framework sem fonte.
Nenhuma das duas é aceitável, e não vou disfarçar a escolha como mérito pedagógico quando ela
é, antes disso, disponibilidade de evidência.

**Menção honesta ao mastery learning.** Ele é o único que eu recusaria mesmo com selo. Ele
exige verificação do degrau antes de avançar, e a plataforma não tem onde verificar: a
`:::interacao` é formativa por construção (`BASE-EDUCACIONAL.md` §6: *"não vale nota, revela no
cliente, não grava nada"*). Só o `:::exercicio` corrige no *backend*. Implementar mastery
learning significaria bloquear a navegação por resultado de exercício — mudança de produto, não
de sequência, e contra o Princípio VIII.7 (*"o progresso é do leitor"*).

### 4.2 O que a evidência sustenta, e por que ela responde à queixa do autor

O 4C/ID sequencia por **classes de tarefa**: cada classe é uma versão completa da mesma tarefa
inteira, numa faixa de complexidade; dentro de uma classe o **andaime desvanece até zero**; na
fronteira da classe a **complexidade sobe e o andaime é restaurado**.

Isso importa para a queixa. O autor disse *"não está linear"*, e a resposta correta **não é uma
rampa monotônica**. O 4C/ID prevê quedas de apoio — mas só nas fronteiras, e só no **apoio**,
nunca na complexidade da tarefa inteira. É um dente de serra, não uma reta.

O diagnóstico bate com essa forma: hoje há **11 quedas de dificuldade, das quais 2 caem numa
fronteira de nível** (§B4). Não falta rampa; faltam **fronteiras declaradas** que expliquem as
quedas. Ordenar os 39 cartões por dificuldade seria a correção errada.

O modelo também nomeia os quatro componentes, e todos já existem aqui, o que torna a adoção
barata: tarefas inteiras (`ml-zero` e os laboratórios), informação de apoio (o corpo do
cartão), informação no momento do uso (os *boxes*), prática de parte (interação + exercício).
O `livro/trilha-ml-zero.md` já opera o desvanecimento explícito nas etapas
(00–04 completar → 05–09 implementar com testes dados → 10–16 só o requisito).

### 4.3 Onde ele não vale — quatro fronteiras, ditas antes de aplicar

1. **Não diz nada sobre a posição da narrativa histórica.** Nada. A posição de "De onde isto
   veio" continua sendo o que a ADR 0022 diz que é: **ritmo**, selo **❌** (*"procurei estudo
   sobre a posição de narrativa histórica em material instrucional e não achei"*). Não vou
   fingir que ganhei uma alavanca ali.
2. **É um modelo para *complex learning*** — tarefas inteiras com habilidades constituintes
   coordenadas. Deduzir mínimos quadrados de um atributo não é tarefa complexa nesse sentido.
   A estrutura de classes que proponho é defensável para o capítulo **como um todo** (ajustar →
   ler → decidir) e é maquinaria demais para qualquer cartão tomado isolado.
3. **O desvanecimento é *dentro* da classe.** O modelo não licencia o mapeamento entre "apoio"
   e nossos rótulos `facil/media/dificil`. Esse mapeamento é vocabulário nosso: é **📖 leitura
   editorial minha**, e deve ser registrado como tal.
4. **O selo é ✓ᵐ.** Se o comitê quiser que essa recomendação sustente uma emenda de
   constituição, o corpo do artigo de 2002 tem de ser aberto e o selo virar ✓. Enquanto não
   for, ela sustenta uma **decisão editorial fundamentada**, que é o mesmo estatuto que a ADR
   0022 declara para si.

### 4.4 O que eu peço à constituição, e o que se perde

**Não peço romper nada. Peço uma clarificação de mapeamento, e ela é MINOR.**

O Princípio III mapeia: *"a trilha `ml-zero` é a espinha — etapas = tarefas inteiras;
**capítulos = informação de apoio**; boxes = *just-in-time*; exercícios = prática de parte."*
Sob esse mapeamento, o 4C/ID não sequencia o capítulo, porque informação de apoio não tem
classes de tarefa.

O fato é que **o capítulo deixou de ser informação de apoio pura quando virou baralho**. O
portão `cartoes-legiveis.mjs` fixa, com a premissa do autor citada dentro do próprio arquivo:
*"todo card deve ter uma interação e um exercício, mesmo que teórico"*. Interação e exercício
**são** prática de parte na taxonomia do modelo; e os dois laboratórios são tarefa inteira em
miniatura. O capítulo, hoje, é um híbrido — e é exatamente por não ter sequência declarada
para o componente de prática que os 39 cartões oscilam.

**A clarificação pedida:** a linha do Princípio III passa a ler *"capítulos = informação de
apoio; **no modo cartão, a sequência de cartões é também sequência de prática de parte, e é
organizada nas mesmas classes de tarefa da etapa do `ml-zero` que o capítulo apoia**"*.

**O que se perde ao aceitar:** a separação limpa entre trilha e capítulo, que era fácil de
explicar e fácil de auditar. Passa a existir um acoplamento — mudar as classes da etapa 05–06
obriga a revisar a sequência do II.2. É custo real de manutenção, e não é hipotético: são 29
capítulos.

**O que se perde ao recusar:** nada da minha análise das quebras, que é independente do
framework. Mas a correção fica sem regra que a sustente, e volta a ser gosto — que é o
problema que a ADR 0022 existe para não repetir.

### 4.5 Sobre a ADR 0022 — não discordo, e refino um ponto

O autor autorizou discordar. Discordo de uma coisa só, e não é dos números.

**O que eu mantenho, inteiro.** O corte por tipo de conhecimento é sólido e a minha proposta o
obedece: procedimento g = −0,03, IC [−0,20 · 0,15] — intervalo cruzando zero, ausência de
efeito, exemplo trabalhado primeiro; conceito e transferência g = +0,36, IC [0,20 · 0,51] —
prática primeiro. Na sequência nova, o laboratório sobe para antes do EQM (conceito) e a
dedução mantém o exemplo trabalhado antes (procedimento). As duas condições também:
prática assistida (d = +0,30 contra −0,38) e explicação que constrói sobre a tentativa
(g = 0,56 contra 0,20).

**O que eu contesto é um salto de escopo que a ADR dá sem número.** A Decisão 1 classifica
**atos** por tipo de conhecimento — correto, é o que a meta-análise mede. Mas a "ordem que
resulta" atribui O1 e O2 em bloco ao Ato II e O3 e O4 em bloco aos Atos III e IV, e **serializa
todo o procedimento antes de todo o conceito**. Sinha & Kapur não mede sequências de capítulo;
mede a ordem local entre resolver e explicar. Serializar é uma extrapolação, e o preço dela
está medido nos dados do próprio capítulo:

- as 13 fórmulas em bloco ficaram todas numa janela de 10 cartões (4–13) e **nunca voltam**:
  26 dos 39 cartões (67%) não têm nenhuma;
- a condição de ortogonalidade $\sum x_i r_i = 0$, deduzida no cartão 11, reaparece **duas
  vezes em 28 cartões** — de relance no cartão 23 e na verificação do 39;
- e 8 dos 14 exercícios de O1 terminaram 20 cartões adiante, colados na história, sem pedir
  nenhuma derivação (§B8).

Intercalar os dois tipos **entre classes** é compatível com os dois números do §3.1 e corrige
as três coisas. Registro isso como **refinamento da Decisão 1**, não como contradição, e ele
cabe numa ADR nova que a superseda em um parágrafo.

**Um argumento da ADR que eu leio ao contrário.** Ela usa a convergência como apoio: *"cartões
1 a 11 a 2,9 ideias novas por 100 palavras; 12 a 18 a 1,1 — duas análises independentes, mesmo
corte"*. Isso é evidência de que a junta **está lá**, não de que ela deva ficar. Um penhasco de
densidade de 2,6× é a descrição do defeito. A minha proposta move densidade; não preserva o
penhasco.

---

## 5. A sequência nova, cartão a cartão

**A tarefa inteira, enunciada uma vez e nunca alterada:** *dada uma tabela, ajustar um modelo
linear e escrever a frase que a decisão precisa.* As quatro classes são a mesma tarefa em
complexidade crescente.

**39 → 36 cartões.** Três nascem, dois pares se fundem, sete cartões de história viram dois,
um exercício é cortado.

### Classe 1 — "há uma reta, e há uma medida de quão ruim ela é" · nível 1 · 7 cartões

Complexidade: um atributo, dado sintético. Andaime: máximo, desvanecendo de exploração →
previsão → produção.

| Novo # | Vem de | Mudança |
|---|---|---|
| 1 | C01 objetivos | **exercício trocado**: sai `e28` (escolher entre linear e logística, O4); entra um de O1 `facil`. O que a distinção linear × logística exige, o cartão já diz em prosa, e II.3 tem capítulo próprio |
| 2 | C02 a carta de recusa | **fica na posição 2** — é "O problema" do esqueleto v5, e um capítulo tem de dizer por que existe. `e29` rebaixado de `media` para `facil` (reconhecer, não diagnosticar) |
| 3 | C04 o modelo é uma reta | **só um atributo.** A forma com $d$ atributos sai daqui e vai para o cartão 16 |
| 4 | **C08 sobe de 8 → 4** · laboratório L1 | o laboratório passa a **preceder** o EQM. Aqui o EQM é conceito ("existe um critério"), não procedimento: zona do g = +0,36 |
| 5 | C05 o critério: EQM | passa a **nomear o que o leitor acabou de fazer**: "você somou as áreas dos quadrados cinza". É a condição g = 0,56 contra 0,20 |
| 6 | C06 por que ao quadrado | inalterado |
| 7 | **novo — N1** "a mesma reta, agora com três números" | exemplo trabalhado numérico completo: três pontos, EQM calculado à mão, **zero derivadas**. É o degrau que hoje não existe entre "arrastei uma reta" e "derivei uma perda". Exercício `numerica` |

### Classe 2 — "a reta ótima existe, é única, e sai de duas somas" · nível 2 · 8 cartões

Complexidade: um atributo, agora com a maquinaria. Andaime: exemplo trabalhado → desvanecido →
sem apoio.

| Novo # | Vem de | Mudança |
|---|---|---|
| 8 | C09 passo 1 — a tigela | inalterado |
| 9 | C10 passo 2 — centro de massa | inalterado |
| 10 | C11 passo 3 — ortogonalidade | inalterado |
| 11 | C12 passo 4 — o sistema | inalterado |
| 12 | C13 uma vez com número | inalterado (é o exemplo trabalhado do procedimento) |
| 13 | C14 passo 5 — o denominador avisa | **o distrator que cita colinearidade é reescrito**: hoje ele usa, na linha 507, um termo que só é definido oito cartões depois |
| 14 | **novo — N2** "a mesma conta, sem andaime" | quatro pontos, nenhuma linha preenchida, o leitor faz $S_{xy}$, $S_{xx}$, $a$ e $b$ sozinho e confere. Hoje o desvanecimento pula de `desvanecido` (C13) direto para múltipla escolha; falta o degrau em que a conta inteira é do leitor. **Fecha a classe: andaime zero** |
| 15 | **C07 desce de 7 → 15** a fechada e o gradiente | agora vem **depois** de as equações normais existirem (§B1). O `e9` perde a menção a inversão de matriz $d\times d$ e passa a contar somas por atributo, que é o objeto que o capítulo carrega. Recebe também o `e38` do antigo C37 (por que a etapa 05 implementa as duas rotas) |

### Classe 3 — "mais de um atributo, e a conta certa dá a leitura errada" · nível 3 · 12 cartões

Fronteira de classe: a complexidade sobe (um atributo → vários; sintético → 365 dias reais) e
**o andaime é restaurado**.

| Novo # | Vem de | Mudança |
|---|---|---|
| 16 | **novo — N3** "de um atributo para vários" | a forma $\hat y = w_1x_1+\dots+b$ que hoje aparece no C04 e some. Diz explicitamente que a dedução foi feita em um atributo e o que muda com $d$. Fecha a terceira das quatro trocas silenciosas de dimensionalidade (§B6) |
| 17 | **C16 sobe de 16 → 17** padronizar | **antes** do laboratório do gradiente. Hoje o leitor prevê um número sobre "atributos padronizados" um cartão antes de saber o que padronizar significa |
| 18 | **C15 desce de 15 → 18** o gradiente contra a álgebra · laboratório L2 | **a interação `i39` passa para depois do laboratório** (§B7). O leitor roda a varredura e só então prevê |
| 19 | C17 o que o coeficiente diz | inalterado |
| 20 | C18 a correlação que recomenda o contrário | inalterado |
| 21 | C19 o preço é termômetro disfarçado | inalterado |
| 22 | C20 o controle que não salva | **$R^2$ sai da nota de rodapé** e vira uma frase do corpo, porque o exercício `e24` do mesmo cartão o cobra |
| 23 | C21 controlar remove só o que mede | inalterado |
| 24 | C22 o panfleto, de brinde | inalterado — e agora é aqui que colinearidade aparece **pela primeira vez**, não oito cartões depois do primeiro uso |
| 25 | **C23 + C24 fundidos** reproduza / o confundimento é perfeito | dizem a mesma coisa (nenhum mês tem mais de um preço): um mostra o código, o outro conclui. **O código pandas é trocado pelas funções da etapa 05** (§B9). O exercício aberto `e6` sai daqui e vai para o cartão 32 |
| 26 | **C37 sobe de 37 → 26** · o notebook da limonada | **é o *whole task* da classe.** O leitor roda `regressao_limonada.ipynb`, que reproduz exatamente os cartões 20–25, altera o corte de treino/teste da célula 15 e **cola o número de volta**. Posição 26 de 36 = **72%**: depois de dois laboratórios e da dedução inteira, tarde o bastante para um degrau caro. Exercício **novo**, `numerica` com tolerância sobre o EQM de teste — a *seed* fixa e o corte 300/65 garantem o gabarito (restrição 4 do `ml-zero`). **É o único exercício do capítulo cuja resposta o leitor gera em vez de reconhecer** |
| 27 | C25 as quatro coisas que não diz | fecha a classe: é o sumário, e agora as quatro chegam depois de vividas em número |

### Classe 4 — "escolher a família, sob restrição" · nível 4 · 5 cartões

| Novo # | Vem de | Mudança |
|---|---|---|
| 28 | **C03 desce de 3 → 28** três vantagens | `e30` (calibração × ordenação, `media`) deixa de ser o terceiro exercício do capítulo e passa a abrir a classe que trata de escolha de família (§B10) |
| 29 | C26 quando o linear é a escolha certa | inalterado |
| 30 | C27 as cinco situações | inalterado |
| 31 | C28 o caso da seguradora | inalterado (`multipla-multi`, `dificil`) — agora é o penúltimo degrau de uma classe, não o 28º cartão avulso |
| 32 | C29 treine sempre um linear primeiro | **recebe `e6`, o exercício aberto com rubrica** (a carta à dona da barraca). É o *whole task* de mais alto nível do capítulo e o único do nível **Criar** de Bloom. Hoje ele está no cartão 24 de 39, com quinze cartões depois dele |

### Coda — nível 5 · 4 cartões

| Novo # | Vem de | Mudança |
|---|---|---|
| 33 | **C30–C33 → um cartão** "o aperto e a virada" | o aperto (astronomia, órbitas discordantes) · o que se fazia antes · a virada (a regra pública) — três dos cinco elementos do Princípio X |
| 34 | **C34–C36 → um cartão** "a disputa, e o que ela ensina" | a ideia reaproveitável (perda é critério de arbitragem) · o nome (*moindres carrés*, Legendre) · **a tabela de selos, intacta** · o espelho com III.1 em três frases, dentro do cartão |
| 35 | C38 síntese | inalterado |
| 36 | C39 verificação | inalterado |

**A compressão da história, justificada com número e com a perda nomeada.** Os cartões 30 a 36
são **sete cartões, 3 036 palavras, 0 fórmulas em bloco, 1 termo novo de glossário** e sete
exercícios que apontam para O1 sem cobrar o verbo dele (§B8). São 18% dos cartões para 0% do
conteúdo procedimental. O Princípio X exige a seção, os **cinco elementos** e a **tabela de
selos** — não exige sete cartões, e a ADR 0022 já registrou que a posição repousa em ritmo.
Dois cartões carregam os cinco elementos e a tabela.

**O que se perde, dito por nome:** o cartão do *hedge* de Stigler (C34) como unidade própria —
a lição sobre preservar "though not conclusively" numa citação vira duas frases dentro do
cartão 34 e perde a interação `i32`; o detalhe do ataque público de Legendre em 1820; e a
interação `i33` ("o experimento que não aconteceu"), que é boa e que eu moveria para o cartão
26, ao lado do notebook, onde ela deixa de ser história e vira exigência da tarefa que o leitor
acabou de executar. Prefiro pagar isso a manter um capítulo cujo último gesto novo do leitor
acontece no cartão 26 de 39.

### 5.1 O que a proposta faz com os números do diagnóstico

| Medida | Hoje | Proposto |
|---|---|---|
| Cartões | 39 | 36 |
| ρ de Spearman, posição × dificuldade | **0,173** | **0,446** |
| Quedas de dificuldade | 11 | **4** |
| Quedas em fronteira de classe | 2 de 11 | **4 de 4** |
| Dificuldade não-decrescente dentro da classe | não se aplica | **verdadeiro nas 5 classes** |
| Maior corrida sem objeto manipulável | **21 cartões** | **14 cartões** (4 → 18) |
| Posição do primeiro código executável | 94,9% | **72%** |
| Distância entre a análise da limonada e o notebook que a reproduz | 12 cartões | **0** (mesma classe) |
| Exercícios de O1 que não cobram derivar | 8 de 14 (57%) | **2 de 8** — os dois da coda, e os quatro da história são reapontados |
| Termos usados antes de definidos | 3 | **0** |

**Sequência de dificuldade proposta** (fronteiras em `|`):

```
f f f f m m m | f m m m m m D D | f f m m m m m m D D D D | f m m D D | f m m D
```

**Duas honestidades sobre esses números.**

Primeira: **ρ = 0,446, não 1,0, e isso é o desenho, não a falha.** Uma rampa monotônica exigiria
que o primeiro cartão de cada classe fosse mais difícil que o último da anterior, o que é
exatamente o que o 4C/ID diz para não fazer. Se o comitê quiser ρ > 0,8, está pedindo outro
modelo — provavelmente mastery learning — e aí valem as objeções do §4.1.

Segunda: **o deserto cai de 21 para 14 cartões, e não para 1.** A cadência de Géron é
inalcançável enquanto o portão `cartoes-legiveis.mjs` tiver `palavrasMin: 80` — o piso da nossa
unidade é 6,2× a mediana da dele. **Há um caminho barato para chegar a 8**, e eu o proponho
separado porque exige código: parametrizar o laboratório `regressao-linear` que já existe com
um modo "conferir", e usá-lo nos cartões 7 e 14. As distâncias passariam a 4 → 7 → 14 → 18 → 26,
com máximo de **8**. Não é widget novo; é um parâmetro. Mas é mudança de `publicar/tema/`, e
não escondo isso dentro de uma proposta de sequência.

### 5.2 O portão que essa proposta oferece

O §7 do `BASE-EDUCACIONAL.md` cobra: *"teoria que não vira asserção volta a ser opinião"*, e
lista três regras que ainda são "revisão humana" — dívida declarada.

A regra que proponho **é executável hoje**, sem Playwright e sem navegador, lendo os atributos
que os cartões já carregam:

> **Dentro de uma classe de tarefa, a dificuldade declarada nunca cai.** Quedas só são
> permitidas na fronteira, e toda fronteira declara a complexidade que sobe.

Um script de vinte linhas lê `:::cartao {"nivel":N}` e `:::exercicio {"dificuldade":…}`,
agrupa por nível e reprova a queda intra-classe. Reprovaria o capítulo de hoje em **nove
pontos**. É a única parte deste parecer que eu entregaria como portão, e é o que impede a
correção de apodrecer.

---

## 6. O que eu faria se estivesse errado

Nomeio os falsificadores com número, porque parecer sem falsificador é opinião com tabela.

**Falsificador 1 — o desvanecimento não desvanece.** O livro coleta quais exercícios erram mais
(Princípio VIII.7: *"quais exercícios erram mais é o sinal mais valioso que este projeto
coleta"*). Se, depois da reordenação, a taxa de erro nos cartões 8 a 15 **não cair** do começo
ao fim da classe — digamos, se o erro no cartão 14 (a conta sem andaime) não for menor que no
cartão 12 —, então o que chamei de andaime não estava sustentando nada, e as classes estão
cortadas no lugar errado. Nesse caso o corte a testar é por **dimensionalidade** (um atributo /
vários), não por maquinaria.

**Falsificador 2 — o notebook continua caro demais no cartão 26.** Se a taxa de conclusão do
exercício `numerica` do cartão 26 ficar abaixo de metade da taxa dos cartões vizinhos, a tarefa
inteira não cabe no meio do capítulo, e a estrutura de classes está errada para este conteúdo.
**Aí eu trocaria de modelo, e digo para qual:** Elaboration Theory de Reigeluth — um epítome
simples e completo primeiro (ajustar uma reta a três pontos e ler o coeficiente, tudo num
cartão), depois duas elaborações que voltam ao mesmo todo com mais detalhe. Isso permitiria pôr
o notebook no fim sem que ele ficasse órfão, porque o todo já teria sido visitado três vezes.
O custo é o do §4.1 e não desapareceu: Reigeluth entraria em ⏳, e sob a regra da
`bibliografia.md` teria de ser verificado antes de sustentar a decisão.

**Falsificador 3 — a compressão da história.** É a minha recomendação mais agressiva e a de
evidência mais fraca, porque a ADR 0022 já registrou selo ❌ para a posição da narrativa e eu
não tenho nada melhor. Se um leitor real relatar que a coda ficou seca, eu recuo primeiro aqui:
volto o cartão do *hedge* de Stigler (C34) como unidade própria, indo de 36 para 37 cartões,
e mantenho tudo o mais. A compressão é meio, não fim.

**O que eu não recuo.** Os dez pontos do §2 são medições do arquivo, não interpretação: o
cartão 7 usar equações normais que chegam no 12, o notebook chegar 12 cartões depois da análise
que reproduz, colinearidade ser usada oito cartões antes de definida, o laboratório 2 ter a
resposta revelada acima dele, e 57% dos exercícios de O1 não cobrarem o verbo do objetivo.
Esses erram independentemente de qual padrão pedagógico o comitê escolher, e qualquer proposta
que não os corrija está corrigindo outra coisa.
