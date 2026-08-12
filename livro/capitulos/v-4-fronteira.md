# V.4 — Fronteira e Expiração

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).
>
> **Capítulo não-método** ([ADR 0004](../../adr/0004-escopo-da-primeira-versao.md)): não ensina um procedimento com inventor e data, e por isso é um dos dois que não trazem a seção "De onde isto veio". O que ele traz no lugar é o placar do próprio livro.

## Objetivos de aprendizagem

- **O1.** Identificar as questões abertas relevantes para a prática, e não só para a pesquisa.
- **O2.** Avaliar criticamente uma alegação de estado da arte.
- **O3.** Aplicar a cláusula de expiração ao próprio conhecimento do leitor.

## O problema: um livro técnico que finge ser atemporal envelhece mentindo

Se cada capítulo declara a data em que fotografou o estado da arte, alguém precisa manter o placar — anotar o que foi previsto, o que se confirmou e o que se refutou.

É também o capítulo que faz a pergunta desconfortável: **o que, do que você acabou de ler, tem prazo de validade curto?** A resposta honesta tem duas metades. Os fundamentos — generalização, viés e variância, o custo do erro, a separação entre quem produz e quem avalia — envelhecem devagar; alguns têm quase um século e continuam de pé. **Quase todo o resto envelhece rápido**, e o capítulo [12](iii-6-modelos-de-fundacao.md) envelhece enquanto você lê.

## O que os especialistas erraram — e como o erro chega até você

A primeira lição deste capítulo não é "especialistas erram". Isso todo mundo já sabe, e saber disso não muda nada.

A lição é mais fina, e vem de conferir três previsões célebres da história da IA. **As três chegam ao presente distorcidas — e de três maneiras diferentes.**

### Uma com a data errada

Herbert Simon escreveu que, tecnologicamente, máquinas seriam capazes, **dentro de vinte anos**, de fazer qualquer trabalho que um homem faça.

A frase é real. **A citação corrente é que está errada:** ela costuma ser atribuída a *The Shape of Automation*, de **1965**, e o original é *The New Science of Management Decision*, de **1960** — o livro de 1965 reimprime o capítulo. Cinco anos de diferença, repetidos por décadas.

### Uma com autoria contestada pelo próprio citado

A previsão de que "de três a oito anos teremos uma máquina com a inteligência geral de um ser humano médio" é atribuída a Marvin Minsky, e foi publicada na revista *Life* de **20 de novembro de 1970**, em reportagem de Brad Darrach.

**Minsky contestou o conteúdo do artigo.** E aqui este livro precisa parar: a negativa documentada chega por terceiros, e a revista de 1970 não foi aberta. **Não podemos dizer "ele disse" nem "ele não disse".** O que se pode afirmar é que a frase foi publicada naquele artigo, e que há registro de contestação.

### Uma com o autor trocado

A história mais repetida das três: *Minsky teria mandado um aluno resolver visão computacional num verão*.

O documento existe, e é o **MIT AI Memo 100, "The Summer Vision Project", de 7 de julho de 1966** — assinado por **Seymour Papert**, não por Minsky, e propondo trabalho para um grupo, não para um aluno solitário. **O nome trocado, o número de pessoas inflado, e a ambição exagerada** — a versão popular erra nos três.

> ### A lição, e ela é melhor do que "especialistas erram"
>
> **Não é o conteúdo da previsão que apodrece primeiro — é a procedência.** A data escorrega, o autor troca, o contexto some, e o que sobra é uma frase boa demais para o slide.
>
> É o mesmo padrão que o [capítulo IV.1](iv-1-nao-supervisionado.md) encontrou em "cerveja e fraldas", que o [13](iv-2-reforco.md) encontrou na origem do nome *dynamic programming*, e que o [23](ii-6-analise-multidimensional.md) encontrou no batismo do OLAP. **Quando um detalhe é bom demais para o slide, ele foi otimizado para o slide.**
>
> Por isso o placar deste livro registra, para cada afirmação datada, **onde ela foi publicada e por quem** — é isso que se perde antes do resto.

**Procedência desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵃ | A frase de Simon e a correção da fonte de 1965 para *The New Science of Management Decision* (1960, p. 38) — via verificação que exibe a página do original |
| ✓ᵐ | O **MIT AI Memo 100**, *The Summer Vision Project*, 07/07/1966, assinado por **Seymour Papert** — obra, autoria e data. **O PDF não abriu** (o repositório devolveu erro) |
| ⏳ | Que a previsão de "três a oito anos" foi publicada na *Life* de 20/11/1970, em reportagem de Brad Darrach, **e** que Minsky contestou o artigo — a negativa chega por fonte de segunda mão, e a revista **não foi aberta** |
| ⏳ | Que a versão popular da lenda do "verão da visão" atribui o memorando a Minsky e a um aluno só |
| 📖 | A leitura de que a **procedência apodrece antes do conteúdo**, e a ligação com os caps. IV.1, 13 e 23 |

:::exercicio {"id":"fronteira-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Você lê num post: *"Estudos mostram que modelos de linguagem já superam médicos em diagnóstico."* Qual é a **primeira** pergunta a fazer?

- [ ] Qual modelo foi usado, e em qual versão?
- [ ] Quantos médicos participaram do estudo?
- [x] Qual estudo, publicado onde e quando — e o post está descrevendo o que o estudo mediu?
- [ ] O post é de uma fonte confiável?

> **gabarito:** Qual estudo, onde, quando — e o post descreve o que ele mediu?
> **porque:** As três alternativas erradas são boas perguntas **e vêm depois**. Sem localizar a fonte, você não tem o que perguntar: pode não haver estudo; pode haver um estudo que mediu outra coisa (concordância com um gabarito escrito, num conjunto de casos selecionados, sem exame físico nem histórico); ou pode haver um estudo real cuja conclusão o post ampliou.
>
> Repare que a alternativa "a fonte é confiável?" é a mais sedutora e a menos útil. **Confiabilidade da fonte é um atalho para não ir à fonte** — e é exatamente o atalho que fez a previsão de Simon circular por décadas com a data errada, e o memorando de Papert virar uma história sobre Minsky.
>
> A ordem certa é: **existe o estudo → o que ele mediu → sob que condição → o post está dizendo isso?** Quase toda alegação de estado da arte morre no segundo passo.
> **volte para:** #o-que-os-especialistas-erraram-e-como-o-erro-chega-ate-voce
:::

## O que envelhece rápido, e o que não envelhece

| Envelhece devagar | Envelhece rápido |
|---|---|
| generalização e a hipótese de mesma distribuição ([01](../0-2-fundamentos.md)) | qual arquitetura é o estado da arte |
| o custo do erro e o limiar como decisão de negócio ([04](ii-1-avaliacao.md), [25](ii-8-do-modelo-a-decisao.md)) | números de desempenho em benchmark |
| vazamento e as divisões que respeitam a estrutura ([02](i-3-dados.md)) | qual biblioteca usar |
| a representação como teto do que se pode aprender ([03](i-6-representacao.md)) | o tamanho de modelo considerado grande |
| a incompatibilidade entre definições de justiça ([14](v-1-interpretabilidade-justica.md)) | o que um modelo de fundação consegue fazer ([12](iii-6-modelos-de-fundacao.md)) |
| o diagnóstico do gradiente como produto ([26](iii-3-treinar-redes-profundas.md)) | qual o remédio da vez para treinar profundo |

Há uma regularidade nessa tabela, e ela é útil: **o que envelhece devagar é diagnóstico; o que envelhece rápido é remédio.** É a lição que o capítulo III.3 tira de Hochreiter — o texto de 1991 mediu o problema e não o resolveu, e trinta e cinco anos depois o remédio mudou quatro vezes enquanto o diagnóstico ficou de pé.

Aplique isso ao que você acabou de estudar. **Se você aprendeu a reconhecer o aperto, você aprendeu a parte durável.** Se aprendeu só o procedimento, aprendeu a parte com prazo.

:::exercicio {"id":"fronteira-e2","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"media"}
Escolha **um** capítulo deste livro que você leu. Escreva o que nele você espera que **ainda seja verdade em 2036**, o que espera que **esteja obsoleto**, e — a parte que importa — **qual observação futura faria você mudar de ideia** sobre cada um.

> **rubrica:** identifica ao menos um elemento durável e justifica pela natureza dele (diagnóstico, restrição estrutural, propriedade matemática), não por gosto;
> identifica ao menos um elemento com prazo e diz por que (depende de hardware, de escala, de biblioteca, de convenção da comunidade);
> propõe uma **observação falsificável** para cada previsão — algo que, se acontecesse, mostraria que a previsão estava errada;
> não trata "fundamentos duram" como slogan, mas aplica ao conteúdo concreto do capítulo escolhido
> **porque:** A resposta fraca repete a tabela acima com outras palavras. A resposta forte faz a parte difícil: **dizer o que a refutaria.**
>
> É a diferença entre uma previsão e um palpite. "A convolução vai continuar sendo usada" não é previsão — não há como errar. "Em 2036, arquiteturas com viés espacial embutido ainda vencerão transformadores puros em conjuntos de imagens abaixo de dez mil exemplos" é uma previsão: tem prazo, tem condição, e alguém pode conferir.
>
> E note o que você está fazendo ao responder: exatamente o que este livro faz consigo mesmo no [registro de expiração](../HISTORICO.md). Uma previsão sem critério de refutação não é humildade — é vagueza com aparência de prudência.
> **volte para:** #o-que-envelhece-rapido-e-o-que-nao-envelhece
:::

## O placar deste livro

O [histórico](../HISTORICO.md) mantém o registro de expiração: cada previsão que o livro faz entra com data, e sai com 🟢 confirmada, 🔴 refutada ou 🟡 em curso.

Isso tem um custo que vale nomear. **Um livro que registra as próprias previsões vai ser pego errando** — e é essa a intenção. O placar não existe para o livro parecer sábio; existe para que o leitor possa medir quanta confiança dar a ele. Um capítulo cujas previsões anteriores foram refutadas merece mais desconfiança que um que acertou, e sem o placar não há como saber qual é qual.

A dívida atual está declarada no [roadmap](../../ROADMAP.md), e a maior delas é honesta o bastante para aparecer aqui: **boa parte das fontes históricas deste livro está selada ✓ᵐ**, o que significa que conferimos que a obra existe e não que a lemos por inteiro. O ciclo de aprofundamento existe para pagar isso, uma fonte por vez.

:::exercicio {"id":"fronteira-e3","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Um capítulo declara: *"Estado da arte capturado em 2026-08."* O que exatamente essa data promete?

- [ ] Que todas as informações do capítulo eram verdadeiras em agosto de 2026.
- [x] Que a seção de estado da arte foi conferida naquela data — e nada sobre quando os fatos históricos ocorreram.
- [ ] Que o capítulo será revisado em agosto de 2027.
- [ ] Que os experimentos foram executados naquele mês.

> **gabarito:** Que a seção de estado da arte foi conferida naquela data
> **porque:** Este livro distingue **três datas diferentes**, e confundi-las é o erro que o selo existe para prevenir: a data do **evento** (um fato histórico — 1943 não muda nunca), a data da **captura** (quando fotografamos o que era consenso), e a data do **experimento** (quando um número foi medido, e com qual versão de biblioteca).
>
> A primeira alternativa é a mais tentadora e a mais errada: a data de captura **não** valida o capítulo inteiro. Uma afirmação histórica com selo ⏳ continua ⏳ em qualquer data — a captura não conserta procedência.
>
> A terceira confunde captura com compromisso de revisão; a quarta, captura com execução. Num capítulo com experimento próprio, as duas datas coexistem e são declaradas separadamente, justamente porque um número medido com uma versão de biblioteca não é o mesmo número medido com outra.
> **volte para:** #o-placar-deste-livro
:::

## Síntese — o que levar

- Um livro técnico que finge ser atemporal **envelhece mentindo**. Declarar a data é o mínimo; manter o placar é o resto.
- **Não é o conteúdo da previsão que apodrece primeiro — é a procedência.** Data escorrega, autor troca, contexto some.
- As três previsões famosas da IA conferidas aqui chegam distorcidas de **três maneiras diferentes**: data errada, autoria contestada, autor trocado.
- **O que envelhece devagar é diagnóstico; o que envelhece rápido é remédio.** Quem aprendeu a reconhecer o aperto aprendeu a parte durável.
- Uma previsão sem **critério de refutação** não é humildade: é vagueza com aparência de prudência.
- Avaliar alegação de estado da arte, na ordem: **existe o estudo → o que mediu → sob que condição → é isso que estão dizendo?**
- Este livro tem dívida declarada, e a maior é que muita fonte está ✓ᵐ — conferimos que existe, não lemos por inteiro.

## Verificação

1. Pegue uma afirmação de qualquer capítulo deste livro e classifique-a: envelhece devagar ou rápido? O que exatamente a faria expirar?
2. Uma alegação de estado da arte cita um benchmark que você não conhece. Descreva os três passos que você daria antes de aceitá-la — e diga qual deles quase todo mundo pula.
3. Este livro erra em algum lugar. Onde você apostaria que está o erro, e por quê? (A pergunta é séria: se você não consegue apontar um candidato, provavelmente leu confiando demais.)
