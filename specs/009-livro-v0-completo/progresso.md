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
> capítulo: 22 dos 29 animam, 7 não, e o critério é o do [ADR 0015](../../adr/0015-animacao-e-laboratorio-sem-manopla.md).
> O mapa e o estado de cada uma vivem em [`animacoes.md`](animacoes.md), que é
> a fonte única desse recorte. Feitas até agora: **III.1** (o perceptron
> aprendendo, com o botão do XOR), **III.2** (o MLP resolvendo o mesmo XOR,
> com os botões de tirar a camada e de estragar a inicialização), **IV.1**
> (o k-means alternando, com a semente que decide o resultado), **V.1** (o
> limiar movendo contra os três critérios de justiça), **0.2** (o grau do
> polinômio subindo, com a validação virando no grau 5 e o piso do ruído à
> vista), **II.4** (três taxas na mesma paisagem, com o botão que troca só a
> perda), **I.3** (as fontes de vazamento medidas lado a lado), **II.1** (o
> limiar descendo, com a acurácia SUBINDO quando a classe fica rara e a AUC-ROC
> parada no mesmo 0,968), **III.3** (a retropropagação descendo 20 camadas, com
> a ReLU sozinha não bastando), **II.7** (a origem móvel contra a divisão
> embaralhada, que erra MENOS), **II.8** (o custo do falso negativo subindo e o
> limiar ótimo DESCENDO), **V.3** (o PSI e a AUC na mesma linha do tempo, com a
> deriva que não dói), **I.5** (a base do eixo subindo, com os valores parados),
> **II.3** (a perda caindo depois que a acurácia congelou), **II.2** (o gradiente
> correndo atrás do ótimo fechado) e **III.4** (a densa ficando cega com 3 px de
> deslocamento, com dez vezes mais pesos que a convolucional) e **IV.2** (o agente
> guloso preso na saída pequena, com 5 achados contra 529). A dívida do núcleo
> compartilhado foi paga na segunda, como a ADR 0015 exigia.
> **17 feitas, 5 pendentes** (a linha dizia "7 feitas, 16 pendentes", herdando um
> erro de conta de `animacoes.md`, corrigido em 2026-08-13).
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
| 6 | I.4 — Análise Exploratória | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 7 | I.5 — Visualização e Storytelling | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 8 | I.6 — Representação | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 9 | II.1 — Avaliação | 5 | 15 | 15 | **ok** | **ok** | **ok** | **ok** |
| 10 | II.2 — Modelos Lineares | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 11 | II.3 — Regressão Logística | 3 | 9 | 9 | **ok** | **ok** | **ok** | **ok** |
| 12 | II.4 — Otimização e Regularização | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 13 | II.5 — Árvores e Ensembles | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 14 | II.6 — Análise Multidimensional | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 15 | II.7 — Séries Temporais | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 16 | II.8 — Do Modelo à Decisão | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 17 | III.1 — O Neurônio Artificial | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 18 | III.2 — Redes Multicamadas | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 19 | III.3 — Treinar Redes Profundas | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 20 | III.4 — Visão Computacional | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 21 | III.5 — Sequências e Linguagem | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 22 | III.6 — Modelos de Fundação | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 23 | IV.1 — Não Supervisionado | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 24 | IV.2 — Aprendizado por Reforço | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 25 | IV.3 — Simbólica, Fuzzy e Evolutiva | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 26 | V.1 — Interpretabilidade e Justiça | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 27 | V.2 — Sistemas de ML | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 28 | V.3 — MLOps | 4 | 12 | 12 | **ok** | **ok** | **ok** | **ok** |
| 29 | V.4 — Fronteira e Expiração | 3 | 9 | 9 | **ok** | **ok** | **ok** | **ok** |

**Totais:** 114 objetivos · 412 exercícios hoje (342 de capítulo + 70 de prova) · **342 no alvo — as quatro colunas fecharam nos 29 capítulos**.

> **A coluna `fontes` fechou no V.4**, e o último capítulo foi o que melhor resume a
> coluna inteira. Ele é o capítulo sobre "a procedência apodrece antes do conteúdo",
> e o memorando de 1966 que ele usa como prova disso estava, nele próprio, em ✓ᵐ com
> a razão escrita: o PDF não abria. Abriu. É digitalização sem camada de texto, então
> as páginas saíram como imagem e foram lidas assim. O que apareceu confirmou a tese
> do capítulo contra o próprio capítulo: até o rótulo do memorando viaja diferente do
> que está no papel, que diz "Vision Memo. No. 100." e não "AI Memo 100".
>
> **Placar da coluna: 29 capítulos, 1 marcado `n/a` (o 0.1, que não faz afirmação
> histórica), 28 conferidos.** A maioria rendeu achado, e os que não renderam também
> são resultado: o I.6 foi o primeiro capítulo em que as afirmações centrais bateram
> com a fonte, e o III.6 fechou sem erro, com um ⏳ que era ✓. Quem for contar a taxa
> exata, conte pelas entradas do CHANGELOG deste ciclo, que é onde cada achado está
> registrado um a um. Não vale estimar de cabeça: é o erro que esta coluna passou o
> ciclo inteiro corrigindo.

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
> **No I.4 o achado foi de outro tipo, e vale registrar como técnica:** quando a
> afirmação é numérica, **recalcular vale mais que abrir o artigo**. O quarteto de
> Anscombe estava em ⏳ com "primária não consultada"; o artigo continua fechado
> (paywall), mas os onze pontos de cada conjunto foram recalculados, e o capítulo
> trocou "praticamente idênticas" por uma tabela com os seis números. Selo ✓ para
> os valores, ✓ᵐ para a ficha do artigo, e a diferença entre os dois declarada.
>
> **E no I.5 o livro se pegou errando uma citação.** A frase de Playfair estava na
> forma que circula nas secundárias (*"As the knowledge of mankind increases…"*);
> o texto da terceira edição, digitalizado, diz *"As knowledge increases amongst
> mankind…"*. A diferença não muda o sentido, e é por isso que sobreviveu: variação
> que não atrapalha a leitura não é corrigida por ninguém. O capítulo passou a
> registrar o próprio erro, porque é o padrão que o V.4 descreve, achado em casa.
>
> **Truque de busca que essa passagem deixou:** digitalização de texto antigo usa o
> s longo, e o OCR devolve `ſ` ou `f`. Buscar a frase literal falha; normalizar
> antes de buscar acha. Duas edições foram varridas assim.
>
> **O I.6 foi o primeiro capítulo sem achado, e isso também é resultado.** As
> quatro afirmações centrais bateram com a fonte, inclusive a direção de cada
> sobreposição no exemplo do Harris. O ganho foi de precisão: entraram as páginas
> (156–157 no Harris, 194 no Firth) e o artigo da fonte lida passou a ser citado
> pela versão publicada, e não só pelo pré-print. Sete capítulos, seis achados —
> a taxa não é de um por capítulo, e convém não prometer que seja.
>
> **No II.1 o resultado foi um empate honesto.** As duas fichas de 1954 subiram a
> ✓ᵐ com DOI, e o corpo ganhou autores, veículo e páginas onde antes havia só
> "Peterson et al.". Mas o relatório de 1953, que é onde o **termo** ROC teria
> nascido, não abriu em nenhum dos dois repositórios: o de defesa devolveu página
> em vez de documento, o da universidade respondeu com desafio de robô. A linha
> ficou ⏳ **com as tentativas registradas**, que é mais útil do que ⏳ sozinho:
> quem retomar sabe o que já falhou.
>
> **No II.2 o achado foi de EXCESSO DE CERTEZA, e ele vazava para outro capítulo.**
> O livro dizia que "a avaliação histórica moderna é que Gauss tinha o método
> antes"; o estudo de referência diz *"it is argued (though not conclusively) that
> Gauss probably possessed the method"* e acrescenta que dados do arco meridiano
> poderiam um dia permitir verificação definitiva. O caso segue **aberto**. Três
> passagens do III.1 afirmavam a descoberta como fato, uma delas dentro de um
> gabarito, e foram alinhadas no mesmo commit.
>
> **A lição de varredura:** quando um capítulo é corrigido, `grep` no livro inteiro
> pelo nome próprio envolvido. Afirmação histórica viaja entre capítulos, e corrigir
> só onde a fonte está citada deixa a versão errada viva onde ela é usada como
> exemplo.
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
>
> **No IV.1 o achado foi na CADEIA, não no fato.** A apuração de Power sobre "cerveja
> e fraldas" estava em ✓ᵐ com a razão "não foi lida por inteiro". Lida por inteiro,
> os números todos se confirmaram (1,2 milhão de cestas, cerca de 25 lojas, a janela
> das 17h–19h, o rearranjo que não aconteceu) e um só se desfez: o livro dizia que
> Power **entrevistou** o autor do estudo. Ele não entrevistou ninguém. Viu a gravação
> de um webcast da Teradata e recebeu a transcrição por e-mail da moderadora, da
> própria Teradata. O capítulo inteiro é sobre a diferença entre correlação achada,
> decisão tomada e efeito medido, e ele estava fortalecendo em uma palavra a origem
> da própria evidência. Também faltava a parte em que Power escreve *"Does everyone
> agree with the above account? YES and NO!"*: dois relatos na mesma página contestam
> a descoberta, e os números de um deles (50 lojas em um dia, 1990) não batem com os
> de Blischok. Entraram no corpo.
>
> **E "junho de 1992" era precisão inventada.** A fonte diz só "in 1992". Ninguém
> inventa um mês de propósito; ele aparece porque a frase fica melhor com ele.
> Precisão a mais é tão errada quanto imprecisão, e é mais difícil de flagrar,
> porque parece cuidado.
>
> **Bônus de uma fonte procurada por outro motivo.** O livro atribuía a Sokal & Sneath
> um programa (tirar a classificação das mãos da autoridade) sem tê-los aberto. O
> livro de 1963 continua fechado, mas o *Citation Classic* que o próprio Sokal
> escreveu em 1982 está aberto, diz o programa em três linhas ("unaffected by
> subjective or phylogenetic judgments") e ainda entrega, de graça, a tese desta
> seção do capítulo pela boca do vencedor: *"in fact, we coined the name 'numerical
> taxonomy'."* Uma ⏳ virou ✓ **com a ressalva registrada** de que a caracterização do
> que havia antes é de quem estava atacando a prática, não de observador neutro.
>
> **No IV.2 o achado foi ARITMÉTICO, e estava numa frase que o capítulo usa como
> tese.** "De Thorndike (1898) a Watkins (1989) são cerca de 80 anos — o maior
> intervalo registrado neste livro." São 91. A conclusão sobrevive (91 continua sendo
> o maior), o número não sobrevivia. Vale como técnica de varredura: **onde o texto
> dá dois anos e a diferença entre eles, subtraia**. É a checagem mais barata do
> livro inteiro e ninguém a faz, porque o número já vem escrito.
>
> **E o Thorndike de 1898 é mais fino do que a paráfrase que circula.** Aberto o
> fac-símile de 1911 (que reimprime o monográfico), o mecanismo está lá em palavras
> dele ("stamped in" / "stamped out") e, melhor, a **evidência** é uma curva: se o
> gato raciocinasse, haveria "a sudden vertical descent in the time-curve"; a
> inclinação gradual é o argumento. Um capítulo sobre atribuição de crédito estava
> deixando de fora que o avô da área já argumentava por curva de aprendizado. Entrou
> no corpo. De quebra, a lei do efeito aparece sob um título que ninguém cita:
> "Provisional Laws".
>
> **Duas ⏳ novas, criadas de propósito.** A monografia de 1898 é chamada de "tese de
> doutorado" em todo lugar, e o volume de 1911 não diz isso: o capítulo parou de
> chamá-la de tese e registrou a dúvida. E a data de comunicação do artigo de Bellman
> no PNAS (05/06/1952) não pôde ser conferida no fac-símile; ficou ⏳ **com a nota de
> que o argumento não depende dela**, porque o fascículo de agosto de 1952 já é
> anterior à posse de Wilson. Criar ⏳ onde havia ✓ᵐ sem lastro é ganho, não perda.
>
> **E aí o IV.3 mostrou que o erro do IV.2 tinha VIAJADO.** Os capítulos comparam os
> seus intervalos uns com os outros, então "cerca de 80" estava copiado em III.4,
> III.6 e IV.3. Um erro, quatro páginas, e nenhuma delas errada por conta própria:
> erradas **por citação**. No mesmo box do IV.3 havia um segundo erro de subtração,
> independente: "Pearl [...] recebeu o Turing 22 anos depois", de 1985 a 2011. São 26.
> O 22 é do intervalo Zadeh→Sendai, duas linhas abaixo, e vazou para a linha de cima.
>
> **Isso virou gate, e não conselho.** `publicar/intervalos.mjs` guarda os DOIS ANOS de
> cada intervalo e calcula a diferença; qualquer menção em prosa que discorde da
> subtração quebra o build. Visto falhando antes de entrar (reintroduzi o "~80" no
> III.4 e no III.6, o build saiu com 1 nas duas vezes) e visto passando depois. A
> primeira versão do regex acusava um falso positivo: em "1927→1970 no [II.7]" ele
> lia "970 no [II.7]". **Um ano citado não é um intervalo citado**, e o lookbehind que
> conserta isso está comentado no arquivo.
>
> **O achado de conteúdo do IV.3 veio de um lugar inesperado.** Procurando a ficha do
> artigo do Logic Theory Machine, o Crossref devolveu de brinde uma **resenha desse
> artigo publicada no próprio *Journal of Symbolic Logic***, em setembro de 1957, por
> Andrzej Ehrenfeucht. O capítulo conta a anedota de que o JSL teria recusado um
> artigo coautorado por um programa. A resenha não desmente a anedota (recusar uma
> submissão e resenhar um artigo publicado alhures são coisas diferentes), mas
> desmente a leitura fácil dela: **"a revista rejeitou" e "a revista ignorou" não são
> a mesma afirmação**. Entrou no corpo com a distinção explícita.
>
> **No V.1 a regra deste ciclo foi aplicada contra o próprio capítulo.** A linha da
> ProPublica estava em ✓ᵐ com a razão escrita: os quatro percentuais tinham sido
> devolvidos "por extrator automático". Como a regra do ciclo é que **resumo de
> máquina não confere fonte**, a linha não podia ficar assim. Página baixada, texto
> extraído aqui, e os quatro números batem, inclusive a direção de cada comparação.
> Entraram de lambuja o título da tabela e o acerto global do instrumento (61%).
> Selo ✓.
>
> **E havia um erro de meses, do mesmo tipo dos erros de anos.** "Cinco meses depois
> da reportagem, Kleinberg [...]": de 23/05 a 19/09 são quatro. O "cinco" é o vão
> completo, até 24/10, que aparece certo duas linhas adiante. A mesma mecânica do IV.3:
> **um número certo do parágrafo de baixo migra para o de cima**, onde está errado.
> Vale como padrão de busca, não como caso isolado.
>
> **O ❌ do V.1 continua ❌, e agora com as tentativas escritas.** A réplica da
> Northpointe devolve 404 no domínio da fornecedora e 403 atrás de Cloudflare no
> espelho, na página e na API. Registrar o que já falhou vale mais do que ❌ sozinho.
>
> **No V.2 o achado foi de PARÁFRASE QUE ESTREITA**, que é o espelho do achado do
> I.2. O capítulo definia *train/serve skew* como "o mesmo atributo calculado de
> dois jeitos". A fonte é mais larga: *"a difference between performance during
> training and performance during serving"*, com **três** causas, e a do capítulo é
> só a primeira. Corrigido, com as outras duas nomeadas e endereçadas a onde o livro
> as trata. O ⏳ da faixa "#29 a #37" virou ✓ pelo caminho mais bobo possível: baixar
> a página e olhar. Existe uma seção com o título exato "Training-Serving Skew", que
> começa depois da #28 e acaba na #37. Eu tinha suposto que a faixa era generosa
> demais; era literal.
>
> **No V.3 uma fonte que "não abria" abriu, e o ganho foi contrário ao esperado.** O
> *ML Test Score* estava em ✓ᵐ porque o PDF não abria; ele está no arquivo público de
> publicações do Google. Só que lê-lo **não fechou** o ❌ vizinho, o de que falta
> fonte prescrevendo o que fazer quando UMA requisição viola o contrato: o Monitor 2
> manda medir e alertar quando o dado diverge "significativamente", com limiar entre
> falso positivo e falso negativo, o que é política de agregado. **Abrir a fonte que
> faltava confirmou o vão em vez de fechá-lo**, e isso é um resultado melhor do que o
> ❌ anterior, que era só ausência de busca bem-sucedida.
>
> **E o Schlimmer & Granger de 1986 estava a um clique.** Os anais do AAAI-86 são
> abertos. O termo está no título, a definição está no resumo entre parênteses
> (*"drift (concepts that change over time)"*) e o problema que eles enunciam é o de
> hoje: distinguir ruído de deriva quando o preditor erra. A lista de referências não
> traz fonte anterior para o termo, o que **não** prova primazia; o cunho ficou em ⏳
> com essa distinção escrita.
>
> **O V.4 fecha a coluna, e fecha com a coluna se aplicando a si mesma.** É o capítulo
> sobre "a procedência apodrece antes do conteúdo", e a prova que ele usa disso, o
> memorando de 1966, estava nele em ✓ᵐ porque o PDF não abria. Abriu, em três URLs
> diferentes, e a razão registrada antes era imprecisa: não era erro do repositório,
> é digitalização **sem camada de texto**. Extraí as páginas como imagem e li assim.
> Foi o mesmo diagnóstico que o III.4 já tinha registrado para os artigos de Hubel &
> Wiesel; se eu tivesse lido a nota do III.4 antes, teria tentado a extração de
> imagem na primeira passagem em vez de anotar "o repositório devolveu erro".
>
> **E o memorando confirmou a tese do capítulo contra o capítulo.** Ele fala em
> *"our summer workers"* no plural, registra Sussman coordenando reuniões abertas a
> *"anyone who wishes to participate"*, e escalona o objetivo (figura-fundo, depois
> região, depois objeto), com o subobjetivo de julho limitado a cenas de objetos não
> sobrepostos. A lenda achata o escopo para baixo ("resolver visão num verão") e o
> livro estava achatando para o outro lado, chamando a ambição de exagerada quando o
> texto declara querer *"a real landmark"*. E o rótulo: o papel diz "Vision Memo. No.
> 100.", não "AI Memo 100". Num capítulo cuja tese é que o rótulo apodrece primeiro,
> o rótulo tinha apodrecido.
>
> **Um segundo erro de numeração velha, igual ao do IV.1.** A linha 📖 remetia aos
> "caps. IV.1, 13 e 23", e o livro não usa mais numeração corrida. São IV.1, IV.2 e
> II.6, que é o que o próprio box diz duas linhas acima. Segunda ocorrência dessa
> classe no ciclo (a primeira foi o "II.2 e 18" do IV.1): **numeração antiga sobrevive
> dentro das tabelas de selo**, porque ninguém relê a tabela procurando link. Varri o
> livro inteiro atrás de uma terceira e não há: as demais menções a "capítulo <número>"
> são a capítulos de outras obras (o 2 do *Principia*, o 4 da tese de Hochreiter, o 7
> do *Designing ML Systems*), e as do `HISTORICO.md` são registro de edição antiga,
> que é para ficar como está.

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
