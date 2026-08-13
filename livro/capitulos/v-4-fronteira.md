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

É também o capítulo que faz a pergunta desconfortável: **o que, do que você acabou de ler, tem prazo de validade curto?** A resposta honesta tem duas metades. Os fundamentos (generalização, viés e variância, o custo do erro, a separação entre quem produz e quem avalia) envelhecem devagar; alguns têm quase um século e continuam de pé. **Quase todo o resto envelhece rápido**, e o capítulo [III.6](iii-6-modelos-de-fundacao.md) envelhece enquanto você lê.

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

O documento existe, e agora está lido. O cabeçalho traz "MASSACHUSETTS INSTITUTE OF TECHNOLOGY", "PROJECT MAC", o grupo ("Artificial Intelligence Group"), a data (7 de julho de 1966) e uma numeração que quase ninguém cita: **"Vision Memo. No. 100."** O arquivo do MIT o cataloga como AIM-100, e daí ele circular como "AI Memo 100"; o papel diz outra coisa. Assina **Seymour Papert**, não Minsky.

Não era um aluno. A primeira frase fala em *"our summer workers"*, no plural, e a página seguinte registra que Sussman coordena as reuniões do "Vision Project" e *"should be consulted by anyone who wishes to participate"*. Um grupo aberto, com coordenação, e não uma tarefa despejada em alguém.

E o escopo corre para os dois lados, o que é a parte que ninguém conta. O objetivo declarado não é "resolver visão": é dividir uma imagem em *"likely objects, likely background areas, chaos"*, o que o texto chama de FIGURE-GROUND analysis, depois descrever regiões e só então identificar objetos *"by matching them with a vocabulary of known objects"*. O subobjetivo de julho é ainda mais estreito: cenas *"consisting of non-overlapping objects"*. Mas seria falso pintar o memorando como modesto, porque ele declara querer *"a real landmark in the development of 'pattern recognition'"*, com as aspas de reserva que são do próprio Papert.

**O nome trocado, o número de pessoas inflado, o escopo achatado nas duas pontas.** A versão popular erra nos três. E a mais reveladora é a primeira: até o rótulo do memorando, que é o dado mais fácil de copiar certo, viaja diferente do que está no papel.

> ### A lição, e ela é melhor do que "especialistas erram"
>
> **Não é o conteúdo da previsão que apodrece primeiro — é a procedência.** A data escorrega, o autor troca, o contexto some, e o que sobra é uma frase boa demais para o slide.
>
> É o mesmo padrão que o [capítulo IV.1](iv-1-nao-supervisionado.md) encontrou em "cerveja e fraldas", que o [IV.2](iv-2-reforco.md) encontrou na origem do nome *dynamic programming*, e que o [II.6](ii-6-analise-multidimensional.md) encontrou no batismo do OLAP. **Quando um detalhe é bom demais para o slide, ele foi otimizado para o slide.**
>
> Por isso o placar deste livro registra, para cada afirmação datada, **onde ela foi publicada e por quem** — é isso que se perde antes do resto.

**Procedência desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵃ | A frase de Simon e a correção da fonte de 1965 para *The New Science of Management Decision* (1960, p. 38) — via verificação que exibe a página do original |
| ✓ | *The Summer Vision Project*, MIT Project MAC, Artificial Intelligence Group, **"Vision Memo. No. 100."**, 7 de julho de 1966, assinado por **Seymour Papert**: cabeçalho, autoria, data, os *"summer workers"* no plural, a coordenação de Sussman, a cadeia FIGURE-GROUND → região → objeto, o subobjetivo de julho com objetos não sobrepostos e o *"real landmark"*. O PDF, que numa passagem anterior não abriu, está no [repositório do MIT](https://dspace.mit.edu/handle/1721.1/6125). **É digitalização sem camada de texto**: as páginas foram extraídas como imagem e lidas assim |
| ✓ᵐ | Que o mesmo documento é catalogado como **AIM-100**, que é a origem do nome "AI Memo 100" pelo qual ele circula |
| ⏳ | Que a previsão de "três a oito anos" foi publicada na *Life* de 20/11/1970, em reportagem de Brad Darrach, **e** que Minsky contestou o artigo. A negativa chega por fonte de segunda mão, e a revista **não foi aberta** |
| 📖 | A leitura de que a **procedência apodrece antes do conteúdo**, e a ligação com os capítulos IV.1 (cerveja e fraldas), IV.2 (o nome *dynamic programming*) e II.6 (o batismo do OLAP) |

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

:::exercicio {"id":"fronteira-e5","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Um colega diz: *"conferi o identificador digital do artigo, ele existe e é esse mesmo. Pode marcar como verificado."*

Que selo essa conferência dá, na convenção deste livro?

- [ ] ✓, porque a fonte foi localizada e é a correta
- [x] ✓ᵐ, porque só os metadados foram conferidos
- [ ] ⏳, porque conferir identificador não é conferir nada
- [ ] 📖, porque a escolha de confiar no identificador é uma leitura editorial

> **gabarito:** ✓ᵐ
> **porque:** Conferir o identificador prova que a obra existe, que o autor é aquele e que o ano está certo. Não prova que ela diz o que você está afirmando que ela diz, e essa é toda a diferença entre os dois selos.
>
> A terceira alternativa erra para o outro lado, e é injusta com o trabalho: conferir metadados é conferência de verdade, e é ela que pega data errada e autor trocado, que são dois dos três erros das previsões célebres deste capítulo. O que ela não pega é o terceiro tipo de erro, o de conteúdo, e é por isso que existe um selo separado em vez de um só.
> **volte para:** #o-placar-deste-livro
:::

## O que envelhece rápido, e o que não envelhece

| Envelhece devagar | Envelhece rápido |
|---|---|
| generalização e a hipótese de mesma distribuição ([0.2](../0-2-fundamentos.md)) | qual arquitetura é o estado da arte |
| o custo do erro e o limiar como decisão de negócio ([II.1](ii-1-avaliacao.md), [II.8](ii-8-do-modelo-a-decisao.md)) | números de desempenho em benchmark |
| vazamento e as divisões que respeitam a estrutura ([I.3](i-3-dados.md)) | qual biblioteca usar |
| a representação como teto do que se pode aprender ([I.6](i-6-representacao.md)) | o tamanho de modelo considerado grande |
| a incompatibilidade entre definições de justiça ([V.1](v-1-interpretabilidade-justica.md)) | o que um modelo de fundação consegue fazer ([III.6](iii-6-modelos-de-fundacao.md)) |
| o diagnóstico do gradiente como produto ([III.3](iii-3-treinar-redes-profundas.md)) | qual o remédio da vez para treinar profundo |

Há uma regularidade nessa tabela, e ela é útil: **o que envelhece devagar é diagnóstico; o que envelhece rápido é remédio.** É a lição que o capítulo III.3 tira de Hochreiter — o texto de 1991 mediu o problema e não o resolveu, e trinta e cinco anos depois o remédio mudou quatro vezes enquanto o diagnóstico ficou de pé.

Aplique isso ao que você acabou de estudar. **Se você aprendeu a reconhecer o aperto, você aprendeu a parte durável.** Se aprendeu só o procedimento, aprendeu a parte com prazo.

:::exercicio {"id":"fronteira-e4","tipo":"multipla-multi","objetivo":"O1","dificuldade":"media"}
As quatro afirmações abaixo são questões genuinamente em aberto. Quais delas mudam **o que você faz** num projeto na segunda-feira — e não apenas o que se discute num artigo?

- [x] Não há critério consensual para escolher entre duas definições de justiça quando elas são matematicamente incompatíveis no seu caso concreto.
- [ ] A atribuição de quem publicou primeiro a retropropagação é contestada, e a ordem de precedência segue em disputa.
- [x] Não existe método confiável para saber, **antes** de colocar em produção, se a hipótese de mesma distribuição vai valer lá.
- [ ] Não há acordo sobre qual arquitetura será o estado da arte daqui a cinco anos.

> **gabarito:** A incompatibilidade entre definições de justiça, e a impossibilidade de verificar a hipótese de mesma distribuição antes do deploy
> **porque:** O teste é este: **você precisa agir mesmo sem a resposta, e a decisão que toma depende dela.** As duas corretas passam. Você vai colocar um limiar em produção nesta semana e escolher uma definição de justiça em vez de outra — sem critério consensual, a escolha vira sua, e precisa ser documentada e defendida perante quem for afetado ([V.1](v-1-interpretabilidade-justica.md)). Com a distribuição acontece o mesmo: não podendo verificar antes, o projeto é obrigado a compensar com monitoramento depois ([V.3](v-3-mlops.md)) — a questão aberta vira requisito de arquitetura.
>
> As duas erradas são abertas e não são suas. A disputa de precedência da retropropagação é uma excelente questão — de história, e este capítulo mostra por que ela importa para **citar** com honestidade. Resolvê-la amanhã não muda uma linha do seu treino. A quarta nem questão é: é previsão, e a tabela acima a coloca do lado que envelhece rápido — planejar em torno dela é o oposto do que este capítulo recomenda.
>
> A regularidade: **questão aberta relevante para a prática é a que deixa uma decisão sua sem apoio.** Ela não se resolve esperando; resolve-se assumindo a escolha, escrevendo o porquê, e montando como você vai perceber que errou.
> **volte para:** #o-que-envelhece-rapido-e-o-que-nao-envelhece
:::

:::exercicio {"id":"fronteira-e6","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
Duas questões estão genuinamente em aberto. Qual delas muda o que você faz num projeto nesta semana?

- [x] Não existe método confiável para verificar, antes do deploy, se a distribuição de produção vai parecer com a do treino.
- [ ] Não há consenso sobre qual será a arquitetura dominante daqui a cinco anos.

> **gabarito:** a impossibilidade de verificar a distribuição antes do deploy
> **porque:** O teste é o mesmo do capítulo: você precisa agir mesmo sem a resposta, e a decisão que toma depende dela. Não podendo verificar antes, o projeto é obrigado a compensar depois, com o monitoramento do [capítulo V.3](v-3-mlops.md). A questão aberta vira requisito de arquitetura, nesta semana.
>
> A segunda nem questão aberta é, no sentido útil: é previsão sobre o futuro, e a tabela deste capítulo a coloca do lado que envelhece rápido. Planejar em torno dela é o oposto do que o capítulo recomenda, porque nenhuma decisão sua de hoje melhora se alguém acertar esse palpite.
> **volte para:** #o-que-envelhece-rapido-e-o-que-nao-envelhece
:::

:::exercicio {"id":"fronteira-e7","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Quatro afirmações são verdadeiras e todas descrevem alguma coisa em aberto. Qual delas é **relevante para a prática** pelo critério deste capítulo, e não apenas interessante?

- [ ] A comunidade não chegou a acordo sobre a definição precisa de "modelo de fundação", e o termo é usado com escopos diferentes.
- [x] Não há critério consensual para escolher entre definições de justiça quando elas são matematicamente incompatíveis no seu caso.
- [ ] A ordem de precedência histórica da retropropagação segue disputada entre Linnainmaa e o grupo de Rumelhart.
- [ ] Não se sabe qual será o tamanho de modelo considerado grande em 2031.

> **gabarito:** a incompatibilidade entre definições de justiça
> **porque:** É a única das quatro que deixa **uma decisão sua** sem apoio. Você vai escolher uma definição em vez de outra ao pôr um limiar em produção, e não existe critério consensual para essa escolha, então a escolha vira sua e precisa ser documentada perante quem for afetado ([capítulo V.1](v-1-interpretabilidade-justica.md)).
>
> As três erradas são a parte difícil deste exercício, porque todas parecem práticas. A disputa sobre o termo "modelo de fundação" atrapalha a conversa e não muda uma linha do que você treina; ela é resolvida dizendo o que você quer dizer. A precedência da retropropagação importa para citar com honestidade, que é assunto deste capítulo, e resolvê-la amanhã não muda o seu treino. E o tamanho considerado grande em 2031 é previsão, não questão aberta.
>
> A regularidade que fica: questão aberta relevante para a prática é a que **deixa uma decisão sua sem apoio**. Ela não se resolve esperando; resolve-se assumindo a escolha, escrevendo o porquê, e montando como você vai perceber que errou.
> **volte para:** #o-que-envelhece-rapido-e-o-que-nao-envelhece
:::

:::exercicio {"id":"fronteira-e2","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Escolha **um** capítulo deste livro que você leu.

Escreva o que nele você espera que ainda seja verdade em 2036, o que espera que esteja obsoleto e, a parte que importa, **qual observação futura faria você mudar de ideia** sobre cada um.

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

:::exercicio {"id":"fronteira-e8","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Você terminou o livro. Das quatro coisas que aprendeu, qual tem o prazo de validade mais curto?

- [ ] Que vazamento se evita com divisões que respeitam a estrutura do dado
- [x] Qual biblioteca usar para treinar um modelo de árvore com bom desempenho
- [ ] Que o limiar de decisão é escolha de negócio, e não saída do modelo
- [ ] Que a representação limita o que qualquer modelo consegue aprender

> **gabarito:** qual biblioteca usar
> **porque:** As outras três são diagnóstico, e diagnóstico envelhece devagar: descrevem uma restrição que existe independentemente da ferramenta da vez. A biblioteca é remédio, e remédio é a coluna que gira.
>
> Aplique isso ao que você acabou de estudar, que é o serviço deste capítulo. Se você aprendeu a reconhecer o aperto, aprendeu a parte durável. Se aprendeu só o procedimento, aprendeu a parte com prazo — e vale saber qual das duas coisas você tem antes de precisar dela.
> **volte para:** #o-que-envelhece-rapido-e-o-que-nao-envelhece
:::

:::exercicio {"id":"fronteira-e9","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Você confere a alegação do post e o estudo existe mesmo: publicado, revisado, com método descrito. Ele mede a concordância entre a saída do modelo e um gabarito escrito, sobre 300 casos clínicos selecionados de um banco de provas de residência, sem exame físico e sem histórico do paciente. Os médicos do grupo de comparação responderam às mesmas 300 questões, com tempo limitado e sem consultar nada.

O post dizia: *"modelos de linguagem já superam médicos em diagnóstico"*. Qual é a avaliação correta?

- [x] A alegação extrapola: o estudo mede desempenho em questões de prova sob restrição, e diagnóstico clínico envolve o que foi justamente removido do desenho.
- [ ] A alegação está correta, porque o estudo existe, foi revisado e o modelo venceu a comparação.
- [ ] A alegação é insustentável porque 300 casos são poucos para qualquer conclusão.
- [ ] A alegação só valeria se o estudo tivesse usado a versão mais recente do modelo.

> **gabarito:** a alegação extrapola o que o estudo mediu
> **porque:** O estudo morreu no segundo passo da ordem deste capítulo, que é *o que ele mediu*. A resposta a questões de prova, sem paciente, sem exame e sem histórico, é uma tarefa bem definida e não é a tarefa que a palavra "diagnóstico" evoca em quem lê o post. E repare no detalhe do grupo de comparação: médicos com tempo limitado e sem consultar nada não estão exercendo a prática deles, estão fazendo prova.
>
> A segunda alternativa é o atalho que este capítulo combate desde a primeira seção: existir e ser revisado responde ao primeiro passo, e as pessoas param aí. A terceira ataca o tamanho da amostra, que é a crítica reflexa, e ela é fraca aqui porque 300 casos sustentam uma conclusão sobre a tarefa medida; o problema não é o tamanho, é a tarefa. A quarta troca a discussão por uma atualização, e não resolveria nada: um modelo mais novo respondendo às mesmas 300 questões continuaria não medindo diagnóstico clínico.
>
> Guarde a formulação: quase toda alegação de estado da arte morre no segundo passo, e o segundo passo é sempre a mesma pergunta — o que exatamente foi medido, e sob que condição?
> **volte para:** #o-que-os-especialistas-erraram-e-como-o-erro-chega-ate-voce
:::

:::exercicio {"id":"fronteira-e3","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Um capítulo declara: *"Estado da arte capturado em 2026-08."* O que exatamente essa data promete?

- [ ] Que todas as informações do capítulo eram verdadeiras em agosto de 2026.
- [x] Que a seção de estado da arte foi conferida naquela data — e nada sobre quando os fatos históricos ocorreram.
- [ ] Que o capítulo será revisado em agosto de 2027.
- [ ] Que os experimentos foram executados naquele mês.

> **gabarito:** Que a seção de estado da arte foi conferida naquela data
> **porque:** Este livro distingue **três datas diferentes**, e confundi-las é o erro que o selo existe para prevenir: a data do evento (um fato histórico — 1943 não muda nunca), a data da captura (quando fotografamos o que era consenso), e a data do experimento (quando um número foi medido, e com qual versão de biblioteca).
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
