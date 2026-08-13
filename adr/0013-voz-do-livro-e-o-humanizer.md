# ADR 0013 — A skill `humanizer` entra como editora de concisão, não como varredura anti-detector

**Data:** 2026-08-13 · **Estado:** aceito · **Comitê:** editor de estilo, linguista de PT-BR, especialista em detecção de IA

## Contexto

O autor pediu que se aplicasse a skill `humanizer`, baseada em [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). A regra §14 dela é absoluta: *"o texto final não contém nenhum travessão ou meia-risca; trate como restrição, não preferência."*

O livro tem 1937 travessões. Aplicar §14 ao pé da letra reescreve quase todo parágrafo dos 29 capítulos.

Três pareceres independentes foram encomendados. **Convergiram nos três pontos que decidem**, e um deles contra a própria skill.

## O que a medição mostrou

Primeiro, onde os travessões estão. Contar 1937 e chamar de estilo é erro de medição:

| Onde | Quantos | É voz? |
|---|---|---|
| Prosa corrida | 783 | sim |
| Item de lista e citação | 781 | sim |
| Célula de tabela | 248 | não, o guia usa `—` como célula vazia |
| Título | 120 | não, é o padrão `II.2 — Modelos Lineares` |
| Bloco de código | 5 | não |

Duas medições minhas estavam erradas e o comitê as derrubou:

- **Aspas curvas: zero.** Eu havia contado 3830; o regex casou aspa reta. O livro usa aspa reta em toda parte, que é o correto em Markdown, e a skill lista aspa curva como falso positivo de qualquer forma.
- **Travessão em prosa: 783**, não os 1087 que reportei. A diferença estava em item de lista.

E há um perigo que só o linguista viu: **45 sinais de menos (U+2212)** vivem dentro de fórmulas, em 14 arquivos. Uma varredura por "traço longo" corrompe matemática em silêncio. A meia-risca, por sua vez, é intervalo legítimo (`1943–1958`, `4–5 estrelas`) e coordenação de dois nomes (`McCulloch–Pitts`, `viés–variância`), onde trocá-la por hífen produz erro tipográfico e ambiguidade.

## Decisão

**A `humanizer` é aplicada como editora de concisão, com regras verificáveis, e §14 é recusada.**

### 1. Nunca tocar

Sinal de menos U+2212, meia-risca, travessão em título, em célula de tabela, em bloco de código e dentro de `$…$` ou `$$…$$`.

### 2. O que vira gate

Duas regras, porque as duas medem **amontoado**, que é dano de leitura, e não frequência, que é voz:

| Regra | Hoje | Por quê |
|---|---|---|
| Nenhuma frase de prosa com 2+ travessões | 103 frases | o leitor perde o sujeito antes do verbo |
| Nenhum parágrafo com 4+ trechos em negrito | 128 parágrafos | quando tudo é ênfase, nada é |

O pior caso medido tem 10 negritos num parágrafo, e o capítulo II.2 tem um negrito **a cada 31 palavras**.

### 3. O que vira trabalho editorial, capítulo a capítulo

**A negação em cauda é o tique real deste livro, e é maior que o travessão.** São **261** ocorrências do padrão `X, não Y.` fechando frase. O capítulo II.2 tem 19; o III.1 tem 15. Todo parágrafo importante aterrissa do mesmo jeito, e ritmo é o que o leitor sente sem saber nomear.

Alvo: reduzir a cerca de um terço, cortando as decorativas e preservando as que carregam contraste de conteúdo. Junto vão: cortar 40% a 50% dos negritos, aposentar a fórmula "o que separa X de Y" (11 ocorrências), e deixar cerca de 30% das seções fecharem sem frase de efeito.

### 4. O que fica como está

Aforismo e "a ideia reaproveitável" são **exigência do esqueleto de capítulo** (`GUIA-EDITORIAL.md`), não enfeite. As tríades são enumerações factuais, não ritmo retórico. E a uniformidade da seção "De onde isto veio", que o cético apontou como o tell mais forte do livro, é andaime pedagógico declarado: previsibilidade de estrutura ajuda quem estuda. Uniformidade projetada não é uniformidade de modelo.

## Por que recusar §14

**A premissa não atravessa a língua.** A regra mede desvio em relação à base do inglês, onde o em dash é recurso enfático de uso parcimonioso. Em português o travessão é membro ordinário do inventário de pontuação: marca aposto explicativo, inciso de rank superior à vírgula e é o sinal obrigatório do discurso direto, função que em inglês cabe às aspas. Um sinal com mais funções normativas tem frequência-base maior, e a razão de verossimilhança colapsa. Aplicar o limiar do inglês ao português mede distância entre línguas, não autoria.

**A própria skill se subordina à amostra do autor** — e aqui a amostra não é inferida: o `GUIA-EDITORIAL.md` usa travessão dentro de regra editorial vinculante. Obedecer §14 obrigaria a reescrever a constituição editorial junto com o livro.

**E o risco central é o de piorar escrevendo para o detector.** O cético demonstrou com um trecho do II.2: a versão "anti-detector" perdeu a imagem que faz o conceito grudar (`preco` como termômetro disfarçado) e continuou com a mesma estrutura tripartida. Menos voz, mesma detectabilidade. A versão que corta redundância manteve a imagem e ficou melhor, e não tinha nada a ver com detector.

O livro carrega marcas que a própria skill manda preservar: detalhe difícil de fabricar (o nome que Hochreiter assina, o orientador, a seção do original), ignorância admitida com selo (`❌ não conseguimos conferir`), tensão não resolvida (*"com estes dados, não dá"*) e evidência contra a própria tese (o capítulo do linear reportando AUC 0,4963 contra 0,9392 do boosting). Varrer o travessão põe isso em risco para não ganhar nada.

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| Aplicar §14 integralmente | reescreve 29 capítulos, corrompe 45 fórmulas e 118 intervalos, e anglicisa a pontuação em nome de suspeita infundada |
| Não fazer nada | deixa 261 negações em cauda, 128 parágrafos sobre-negritados e 103 frases amontoadas |
| Varredura automática de travessão em prosa | remoção mecânica não distingue virada de raciocínio de aposto preguiçoso; o critério é semântico |

## Consequências

O trabalho de voz passa a ser **editorial e por capítulo**, dentro do ciclo da spec 009, e não uma passada global. Os dois gates entram no build e valem para capítulo novo.

O livro continua com muitos travessões, e continuará soando como este livro. Se alguém rodar um detector treinado em inglês, ele vai apontar. **Essa é a consequência aceita**, e ela é preferível a escrever para agradar a ferramenta.

Fica registrado o que não foi decidido: se o autor quiser a voz mais seca por preferência pessoal, e não por suspeita de IA, é outra decisão e merece outro ADR. O comitê tratou da pergunta que foi feita.
