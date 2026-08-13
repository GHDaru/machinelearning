# Ledger do ciclo 009 — um ciclo por capítulo

> **Esta é a fonte da verdade do ciclo**, não a memória da sessão. Um long run é
> compactado no meio; o que não estiver escrito aqui não existe na próxima volta.
> Atualize a linha do capítulo **no mesmo commit** que o trabalho dele.

## Como ler

Cada capítulo passa por quatro etapas. `—` não começou · `~` em curso · `ok` feito e verificado.

| Etapa | O que é | Como se prova |
|---|---|---|
| **voz** | revisão de prosa do ADR 0013 | gate de prosa verde no build |
| **exs** | 3 exercícios por objetivo (ADR 0014) | `node publicar/exercicios.mjs --verificar` |
| **prova** | avaliação de fechamento (ADR 0014) | prova da parte verde no gate cruzado |
| **fontes** | selos de procedência conferidos | selo atualizado no capítulo |

> **A prova é por PARTE, não por capítulo** (ADR 0014). A coluna `prova` de um
> capítulo fecha quando a prova da parte dele existe e passa no gate. As provas
> vivem em `livro/provas/`, numa parte própria ao fim do sumário — posição
> escolhida para não renumerar nenhum dos 29 capítulos.
>
> | Parte | Prova | Itens | Estado |
> |---|---|---|---|
> | Abertura | `prova-abertura.md` | 6 | **ok** |
> | I | `prova-parte-i.md` | 10 | **ok** |
> | II | `prova-parte-ii.md` | 12 | **ok** |
> | III | `prova-parte-iii.md` | 10 | **ok** |
> | IV | `prova-parte-iv.md` | 8 | **ok** |
> | V | `prova-parte-v.md` | 10 | **ok** |
> | Final cumulativa | `prova-final.md` | 14 | **ok** |

> **Animação não tem coluna aqui de propósito.** Ela não é etapa de todo
> capítulo: 23 dos 29 animam, 6 não, e o critério é o do [ADR 0015](../../adr/0015-animacao-e-laboratorio-sem-manopla.md).
> O mapa e o estado de cada uma vivem em [`animacoes.md`](animacoes.md), que é
> a fonte única desse recorte. Feitas até agora: **III.1** (o perceptron
> aprendendo, com o botão do XOR), **III.2** (o MLP resolvendo o mesmo XOR,
> com os botões de tirar a camada e de estragar a inicialização), **IV.1**
> (o k-means alternando, com a semente que decide o resultado), **V.1** (o
> limiar movendo contra os três critérios de justiça), **0.2** (o grau do
> polinômio subindo, com a validação virando no grau 5 e o piso do ruído à
> vista), **II.4** (três taxas na mesma paisagem, com o botão que troca só a
> perda) e **I.3** (as fontes de vazamento medidas lado a lado). A dívida do
> núcleo compartilhado foi paga na segunda, como a ADR 0015 exigia.
> **7 feitas, 16 pendentes.**
>
> **As animações seguem a ordem de prioridade de `animacoes.md`**, e não a
> ordem dos capítulos. As cinco primeiras da fila estão feitas; a próxima sai
> da tabela, por mérito e não por posição. Um capítulo pode
> fechar a coluna de exercícios antes de receber a animação dele — III.4 é o
> primeiro caso.

## Estado

| # | Capítulo | obj | exs hoje | exs alvo | voz | exs | prova | fontes |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.1 — Introdução | 3 | 9 | 9 | **ok** | **ok** | **ok** | **n/a** |
| 2 | 0.2 — Fundamentos | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 3 | I.1 — O Ciclo da Ciência de Dados | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 4 | I.2 — Coleta e Integração | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 5 | I.3 — Qualidade e Vazamento | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 6 | I.4 — Análise Exploratória | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 7 | I.5 — Visualização e Storytelling | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 8 | I.6 — Representação | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 9 | II.1 — Avaliação | 5 | 15 | 15 | **ok** | **ok** | **ok** | — |
| 10 | II.2 — Modelos Lineares | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 11 | II.3 — Regressão Logística | 3 | 9 | 9 | **ok** | **ok** | **ok** | — |
| 12 | II.4 — Otimização e Regularização | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 13 | II.5 — Árvores e Ensembles | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 14 | II.6 — Análise Multidimensional | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 15 | II.7 — Séries Temporais | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 16 | II.8 — Do Modelo à Decisão | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 17 | III.1 — O Neurônio Artificial | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 18 | III.2 — Redes Multicamadas | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 19 | III.3 — Treinar Redes Profundas | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 20 | III.4 — Visão Computacional | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 21 | III.5 — Sequências e Linguagem | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 22 | III.6 — Modelos de Fundação | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 23 | IV.1 — Não Supervisionado | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 24 | IV.2 — Aprendizado por Reforço | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 25 | IV.3 — Simbólica, Fuzzy e Evolutiva | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 26 | V.1 — Interpretabilidade e Justiça | 4 | 12 | 12 | **ok** | **ok** | **ok** | — |
| 27 | V.2 — Sistemas de ML | 4 | 12 | 12 | **ok** | **ok** | **ok** | ~ |
| 28 | V.3 — MLOps | 4 | 12 | 12 | **ok** | **ok** | **ok** | ~ |
| 29 | V.4 — Fronteira e Expiração | 3 | 9 | 9 | **ok** | **ok** | **ok** | — |

**Totais:** 114 objetivos · 412 exercícios hoje (342 de capítulo + 70 de prova) · **342 no alvo — as colunas `exs` e `prova` fecharam nos 29 capítulos**.

> **As 7 provas existem.** As seis de parte cruzam capítulos dentro da parte; a
> final cruza **partes**, que é a diferença que ela existe para cobrar. Nenhuma
> vale nota, por decisão do ADR 0014: pontua-se por ter feito, nunca por ter
> acertado. E nenhuma entra no corpus do tutor, porque `livro/provas/` está fora
> dele por construção, com teste de regressão.

> **A `ORFAOS_ACEITOS` do gate ficou vazia.** Era a lista dos objetivos que o
> livro declarava e não ensinava, e ela existia desde a auditoria de Bloom. Os
> dois últimos casos caíram nos ciclos do V.2 e do V.3, e os dois pelo mesmo
> caminho: o conteúdo subiu, e nenhum verbo foi rebaixado para caber no que já
> estava escrito. Lista vazia não é lista morta, porque a checagem inversa
> segue valendo e um órfão novo quebra o build.

> **Como se fecha a coluna `fontes`** (definido no ciclo do 0.2, que foi o primeiro
> capítulo a fechá-la de propósito): abrir cada fonte da tabela de selos, conferir
> o que ela sustenta, e **reescrever a tabela para que cada linha carregue um selo
> só**. Uma linha com cinco obras sob um selo é um selo médio, e média esconde a
> mais fraca. `n/a` marca capítulo sem afirmação histórica a selar — hoje só o 0.1.
>
> **E a coluna paga por si.** No I.1, ler o guia CRISP-DM inteiro derrubou dois
> fatos que o capítulo afirmava: o consórcio tinha **quatro** membros e não cinco,
> porque a Teradata é a linha de produto **da NCR** e ISL é o nome anterior da
> própria SPSS. A palavra ESPRIT, que o capítulo dava como o programa financiador,
> **não aparece nenhuma vez** no documento, que diz "European Commission". Dois
> erros que nenhum gate pegaria, num capítulo com voz, exercícios e prova fechados.
>
> **Placar da coluna, para calibrar o que falta.** Quatro capítulos conferidos,
> quatro achados: no 0.2, uma linha de selo cobrindo cinco obras; no I.1, dois
> fatos errados (consórcio de cinco, ESPRIT); no I.2, uma paráfrase que alargava
> a definição da fonte; no I.3, um mecanismo trocado por outro mais plausível e
> menos verdadeiro. **Nenhum dos quatro seria pego por gate**, e três deles
> estavam em capítulos que eu mesmo já dera por fechados nas outras colunas.
>
> **A regra que este ciclo deixou:** resumo de máquina não confere fonte. Ao ler a
> carta do *double descent*, uma extração automática afirmou que ela **não**
> mencionava física estatística, e eu quase enfraqueci uma frase correta do livro
> por causa disso. Extraindo o PDF localmente, lá estava: *"various physics papers
> on learning"*. Quando o PDF não abre limpo, extraia o texto, não aceite o resumo.
>
> **A coluna `fontes` abriu no V.2**, e abriu por necessidade, não por planejamento. O
> capítulo prometia um objetivo que ele não ensinava, e escrever a seção que faltava
> exigiu conferir fonte antes de citar. Quatro páginas foram abertas em primeira mão,
> duas afirmações que estavam em ⏳ subiram para ✓, e duas que **não** se confirmaram
> ficaram em ⏳ com a razão escrita. Uma citação que um dos especialistas trouxe estava
> quase certa e não era literal; foi conferida contra o texto e corrigida antes de
> entrar no livro. É o argumento para o resto da coluna: fonte relatada não é fonte lida.

## Dívidas de conteúdo achadas ao escrever os exercícios

Escrever 3 exercícios por objetivo obriga a ler o objetivo contra o corpo. Onde
o corpo não sustenta o que o objetivo promete, a dívida entra aqui em vez de o
exercício inventar conteúdo (Princípio I).

| # | Capítulo | O que falta | Estado |
|---|---|---|---|
| DC2 | III.3 — Treinar Redes Profundas | O3 promete **aplicar aumento de dados** como regularização; o corpo trata dropout e normalização a fundo e só menciona aumento de dados no desafio de fechamento. Os exercícios de O3 cobram o que o texto sustenta. Falta um parágrafo sobre o que é, por que funciona como regularização, e o cuidado de não aplicar transformação que mude o rótulo. | aberta |
| DC1 | I.2 — Coleta e Integração | O4 promete **avaliar licença** de base pública; o corpo trata procedência a fundo e menciona licença de passagem, numa oração só. O exercício e12 cobra o que o texto sustenta (acesso não é permissão) e declara a dívida ao leitor. Falta uma subseção com os eixos da licença: uso comercial, redistribuição, atribuição, obrigação de manter a licença em derivados. | aberta |

## Medição de partida, conferida a mão

Duas correções em relação à primeira varredura, e as duas importam:

- **Aspas curvas: zero.** A primeira contagem disse 3830 porque a classe de caracteres do regex casou aspa reta. O livro usa `"` em toda parte, que é o certo em Markdown.
- **Travessão em prosa corrida: 783**, não 1087. A diferença estava em item de lista e citação, que a primeira passada somou como prosa.

| Onde | Travessões |
|---|---|
| Prosa corrida | 783 |
| Item de lista e citação | 781 |
| Célula de tabela | 248 |
| Título | 120 |
| Bloco de código | 5 |

**Perigo registrado:** há **45 sinais de menos (U+2212)** em fórmulas, em 14 arquivos. Qualquer varredura por "traço longo" que os alcance corrompe matemática. O gate de prosa nunca toca `$…$`, `$$…$$` nem bloco de código.
