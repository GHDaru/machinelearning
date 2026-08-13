# IV.2 — Aprendizado por Reforço

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Formular um problema como processo de decisão de Markov.
- **O2.** Explicar o dilema exploração–explotação com um exemplo concreto.
- **O3.** Descrever a diferença entre aprender valor e aprender política.
- **O4.** Reconhecer quando reforço é a formulação certa — e quando é overkill.

## O problema: ganhou a partida — qual das 60 jogadas foi boa?

Em todos os capítulos anteriores havia gabarito. Cada exemplo trazia a resposta certa ao lado da pergunta, e o trabalho era encurtar a distância entre as duas.

Aqui não há gabarito. Há **consequência** — e ela chega **tarde** e **agregada**.

Você jogou uma partida de 60 lances e ganhou. O sinal que o mundo devolveu foi um único bit, no fim de tudo: *ganhou*. Qual dos 60 lances mereceu o crédito? O lance 7 foi brilhante e o 43 quase pôs tudo a perder, mas os dois receberam exatamente a mesma notícia no fim.

Isso tem nome: **atribuição de crédito temporal**. E o que faz dele um problema difícil, e não apenas um problema chato, é que **não existe supervisor para resolvê-lo**. Ninguém vai olhar o lance 7 e dizer "esse foi bom". Se a resposta existe, o agente terá de produzi-la sozinho.

## De onde isto veio

**O aperto.** Um sinal escasso, atrasado e coletivo, sem ninguém para desmembrá-lo. Duas tradições chegaram perto e nenhuma fechou. A **psicologia animal** descrevia o fenômeno com precisão, mas descrição não é procedimento: dizer que o animal repete o que deu certo não diz *como* calcular o que deu certo. O **controle ótimo** tinha o procedimento, mas exigia o modelo do mundo, isto é, saber de antemão para onde cada ação leva e quanto ela paga. Quem tem esse modelo já resolveu metade do problema; quem não tem, e é a regra fora do laboratório, ficava sem método.

**O que se fazia antes.** Esperar o fim. Jogar a partida inteira, ver o placar e distribuir crédito para trás. Funciona e é honesto — só é lentíssimo, porque nada se aprende enquanto o episódio corre, e porque episódios longos diluem qualquer sinal.

**A virada.** Aprender a partir da **discrepância entre duas previsões sucessivas**, sem esperar o resultado final e sem modelo do mundo. Se a minha previsão de agora e a minha previsão de daqui a um passo discordam, essa discordância já é informação utilizável imediatamente. É a **diferença temporal**.

**A ideia reaproveitável.** *Não é preciso saber a resposta certa para aprender: basta que a previsão de amanhã seja melhor informada que a de hoje.* O alvo do aprendizado passa a ser **uma versão ligeiramente menos ignorante de si mesmo**. Isso se chama *bootstrapping*, e é exatamente o que separa este capítulo de todo o resto do livro — em todos os outros, havia um gabarito externo puxando o modelo. Aqui, o puxão vem de dentro.

**A cronologia, e o maior intervalo do livro.** Edward Thorndike descreve o *trial-and-error* seletivo na monografia de **1898** (trabalho de 1897–1898, publicado como *Monograph Supplement* nº 8 da *Psychological Review*), e o formula como "lei do efeito" em 1911. Richard Bellman publica *Dynamic Programming* em 1957, junto com a "maldição da dimensionalidade" que limita o método. Richard Sutton formaliza os métodos de diferença temporal em 1988. Christopher Watkins apresenta o **Q-learning** na tese de 1989, descrevendo-o como um método incremental para programação dinâmica. Depois vem a prática: o TD-Gammon (Tesauro, 1992) aprendendo gamão por auto-jogo puro; o DQN da Atari (arXiv 2013, *Nature* em 26/02/2015); o AlphaGo (*Nature*, janeiro de 2016).

De Thorndike (1898) a Watkins (1989) são **91 anos** — o maior intervalo registrado neste livro. Compare: 59 anos no [capítulo I.6](i-6-representacao.md) (Harris → word2vec), 43 anos no [capítulo II.7](ii-7-series-temporais.md) (Yule → Box-Jenkins) e apenas 7 no boosting do [capítulo II.5](ii-5-arvores-ensembles.md). O padrão é consistente e vale como diagnóstico: **o intervalo encurta quando o aperto já está escrito como pergunta formal precisa**. Thorndike tinha um fenômeno observado; o boosting tinha uma pergunta com resposta sim/não. Noventa e um anos foi o preço de transformar observação em enunciado.

Vale ler o que Thorndike de fato escreveu, porque é mais fino do que "o animal repete o que deu certo". O mecanismo está no monográfico de 1898, nestas palavras: *"The one impulse, out of many accidental ones, which leads to pleasure, becomes strengthened and stamped in thereby [...]. Futile impulses are gradually stamped out."* E a **evidência** é uma curva de aprendizado, não uma impressão: se o gato raciocinasse, argumenta ele, haveria "a sudden vertical descent in the time-curve" assim que a solução fosse compreendida; as dezenas de casos registrados não mostram isso, e *"the gradual slope of the time-curve, then, shows the absence of reasoning"*. A formulação de 1911 fecha o enunciado como **lei do efeito**, e Thorndike a apresenta sob um título que costuma ser esquecido ao citá-la: *"Provisional Laws of Acquired Behavior or Learning"*.

### A lenda do nome "dynamic programming" — a fonte é autêntica, a cronologia não fecha

Bellman conta, na própria autobiografia (*Eye of the Hurricane*, 1984, p. 159), transcrita por Stuart Dreyfus em *Operations Research* (2002) com autorização do editor, que passou **o outono de 1950** na RAND e que sua primeira tarefa foi achar um nome para processos de decisão multiestágio. Havia em Washington, escreve ele, "um cavalheiro chamado Wilson", Secretário de Defesa, com "medo e ódio patológicos da palavra pesquisa". A RAND trabalhava para a Força Aérea; Bellman sentiu que precisava blindar Wilson do fato de que se fazia matemática ali. Escolheu "programming" por planejamento e "dynamic" porque é impossível usar a palavra em sentido pejorativo — "era algo a que nem um congressista poderia objetar".

A história é ótima. E ela **não pode ser verdadeira como contada**, por duas datas:

1. **Charles E. Wilson só assumiu como Secretário de Defesa em 28 de janeiro de 1953.** Em 1950 o cargo era de Louis Johnson e depois George Marshall.
2. **O primeiro artigo de Bellman com o termo é de 1952**: *"On the Theory of Dynamic Programming"*, *PNAS* 38(8), 716–719, no fascículo de **agosto de 1952** — portanto meses **antes** da posse de Wilson. É esta data, e não a da comunicação do artigo, que sustenta o argumento.

Há ainda uma versão concorrente: Harold Kushner relata que Bellman lhe disse estar tentando fazer sombra ao *linear programming* de George Dantzig acrescentando "dynamic".

**Note o que este capítulo não está dizendo.** Não está dizendo que a lenda é falsa nem que Bellman foi desonesto. Está dizendo o seguinte, que é diferente: *Bellman contou esta história, nestas palavras, na própria autobiografia — e a cronologia não fecha*. A memória autobiográfica de um cientista famoso, escrita **34 anos depois**, é **fonte secundária sobre si mesmo**. Ele não estava mentindo; estava lembrando, e lembrança comprime décadas.

Este é o caso mais limpo do livro para separar duas perguntas que o leitor apressado funde numa só: **"a fonte é autêntica?"** e **"a afirmação é verdadeira?"**. São exatamente as perguntas que os selos ✓ e ⏳ codificam na tabela abaixo — e por isso as duas linhas do episódio Wilson **divergem de selo**. A divergência não é um defeito da tabela: é o conteúdo.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | A citação de Bellman sobre Wilson, "programming", "dynamic" e o congressista, de Dreyfus, *Richard Bellman on the Birth of Dynamic Programming*, **Operations Research 50(1), jan.–fev. 2002, pp. 48–51**, que transcreve *Eye of the Hurricane* (1984) e credita a p. 159 a esse trecho. **Lida.** Dreyfus registra que "the publisher has generously approved extensive excerpting" |
| ✓ | Charles E. Wilson como Secretário de Defesa de **28/01/1953 a 08/10/1957**, e o cargo em 1950 com Louis A. Johnson (28/03/1949 a 19/09/1950) e depois George C. Marshall (21/09/1950 a 12/09/1951), pelas fichas do [Historical Office do Departamento de Defesa](https://history.defense.gov/Multimedia/Biographies/Article-View/Article/571268/charles-e-wilson/) |
| ✓ᵐ | O primeiro artigo de Bellman com o termo: *"On the Theory of Dynamic Programming"*, *PNAS* **38(8), 716–719**, fascículo de **agosto de 1952**, DOI [10.1073/pnas.38.8.716](https://doi.org/10.1073/pnas.38.8.716) |
| ⏳ | Que o artigo foi comunicado por von Neumann em **05/06/1952**. A linha está na primeira página do fac-símile, que **não abriu**: o PDF do repositório devolveu página em vez de documento, e o texto completo não está exposto pela API. O argumento não depende dela: agosto de 1952 já é anterior a janeiro de 1953 |
| ✓ᵐ | Bellman, *Dynamic Programming* (1957) e a "maldição da dimensionalidade"; Sutton, *Learning to Predict by the Methods of Temporal Differences*, **Machine Learning 3, 9–44 (1988)**; Watkins, *Learning from Delayed Rewards*, tese, Cambridge (1989); Tesauro, *Practical Issues in Temporal Difference Learning*, **Machine Learning 8, 257–277 (maio de 1992)**, DOI [10.1007/bf00992697](https://doi.org/10.1007/bf00992697); DQN em *Nature* (26/02/2015); AlphaGo em *Nature* 529 (jan. 2016) |
| ✓ | Thorndike: o mecanismo de *stamping in* / *stamping out*, o argumento da curva de tempo e o enunciado da lei do efeito, de *Animal Intelligence: Experimental Studies* (Macmillan, 1911), **lido no fac-símile**. O volume reimprime o monográfico de 1898 (*Monograph Supplement* nº 8 da *Psychological Review*, trabalho de 1897–1898); a lei do efeito e a lei do exercício estão na p. 244, sob o título "Provisional Laws of Acquired Behavior or Learning" |
| ⏳ | Que a monografia de 1898 foi a **tese de doutorado** de Thorndike. É o que se costuma dizer, e o volume de 1911 não diz: ele a descreve só como *Monograph Supplement*. Por isso o corpo do capítulo deixou de chamá-la de tese |
| ⏳ | A versão concorrente de Kushner: Bellman teria acrescentado "dynamic" para fazer sombra ao *linear programming* de Dantzig. A formulação que circula é *"he was trying to upstage Dantzig's linear programming by adding dynamic"*, atribuída a uma **fala** de Kushner (aceitação do Bellman Control Heritage Award, 2004). **O texto da fala não foi localizado**: chega aqui por fonte terciária, e fica registrado o que já se tentou |
| 📖 | A leitura de que o intervalo Thorndike→Q-learning é o maior do livro, e de que o intervalo encurta quando o aperto já está escrito como pergunta formal |
| 📖 | A leitura do episódio Wilson como o caso-modelo da distinção entre fonte autêntica e afirmação verdadeira |

## Fundamentos: o MDP, o desconto e o alvo que se move

Cinco peças, e o problema inteiro cabe nelas. O agente decide; o ambiente responde; o **estado** é o que o agente sabe no instante em que decide; a ação é o que ele faz; a recompensa é o número que volta. Quando o estado atual carrega tudo o que importa do passado, ou seja, quando o futuro só depende de *onde você está* e não de *como chegou lá*, essa formulação se chama **processo de decisão de Markov (MDP)**. Formular um problema como MDP é o primeiro trabalho real, e é onde a maioria dos projetos já erra: estado mal definido não se conserta com mais treino.

Duas coisas se pode aprender. A **política** responde "o que fazer aqui?" — é um mapa de estado para ação. A **função de valor** responde "quanto vale estar aqui?" — é uma previsão de recompensa futura acumulada. Métodos de valor aprendem a previsão e agem sendo gulosos sobre ela; métodos de política ajustam o comportamento diretamente, sem passar pela previsão. As duas famílias resolvem o mesmo problema por portas opostas.

**O desconto (γ).** Recompensa futura vale menos que recompensa agora, e multiplica-se cada passo por um fator γ entre 0 e 1. Isso existe por dois motivos, um matemático e um honesto: sem desconto, a soma de recompensas de um processo sem fim não converge; e, com desconto, o agente pesa o futuro do jeito que qualquer decisor sensato pesa — com desconfiança crescente, porque previsão distante é previsão pior. γ perto de 0 produz um agente imediatista; γ perto de 1, um agente paciente e mais difícil de treinar.

Em números, para não ficar abstrato. O **retorno** a partir de um instante é a soma descontada do que vem depois:

$$G = r_0 + \gamma r_1 + \gamma^2 r_2 + \dots$$

Com $\gamma = 0{,}9$ e as recompensas $5$, $0$, $10$:

$$G = 5 + 0{,}9 \times 0 + 0{,}81 \times 10 = 5 + 0 + 8{,}1 = 13{,}1$$

Repare no que o desconto fez: o prêmio de 10, dois passos à frente, entrou valendo **8,1**. É o mesmo 10 do mundo, pesado pela distância.

:::exercicio {"id":"reforco-e1","tipo":"numerica","objetivo":"O1","dificuldade":"facil"}
Um agente executa três passos e recebe as recompensas 3, 0 e 10, nessa ordem. Com fator de desconto **γ = 0,9**, qual é o retorno descontado visto do instante inicial?

Responda com uma casa decimal.

> **gabarito:** 11,1 ± 0,05
> **porque:** O retorno é a soma das recompensas, cada uma multiplicada por γ elevado ao número de passos de espera: `3 + 0,9 × 0 + 0,81 × 10 = 3 + 0 + 8,1 = 11,1`.
>
> O que interessa aqui não é a conta, é o **8,1**. A recompensa de 10 existe e é real, mas vista de hoje ela vale 8,1 — e essa diferença de 1,9 é o preço da espera. Baixe γ para 0,5 e a mesma recompensa passa a valer 2,5: o agente deixa de perseguir o prêmio do fim e vira imediatista. γ **não é um detalhe de implementação**: é onde você declara quanta paciência o agente tem, e trocá-lo muda o comportamento ótimo, não só a velocidade do treino.
> **volte para:** #fundamentos-o-mdp-o-desconto-e-o-alvo-que-se-move
:::

:::exercicio {"id":"reforco-e5","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
O que caracteriza um processo de decisão de Markov?

- [ ] Que as recompensas são sempre positivas e somam 1.
- [x] Que o estado atual carrega tudo o que importa do passado: o futuro depende de onde você está, e não de como chegou lá.
- [ ] Que o número de estados é finito e conhecido de antemão.
- [ ] Que o agente conhece o modelo do ambiente antes de começar.

> **gabarito:** o estado carrega tudo o que importa do passado
> **porque:** É a propriedade que dá nome ao formalismo, e ela é uma afirmação sobre a **definição do estado**, não sobre o mundo. O mesmo problema pode ser markoviano ou não conforme o que você decide colocar no estado.
>
> Daí a frase que o capítulo põe como primeiro trabalho real: estado mal definido não se conserta com mais treino. Se a informação que decide o futuro ficou de fora, nenhum algoritmo a recupera.
>
> A quarta alternativa descreve outra coisa: conhecer o modelo do ambiente é a diferença entre planejamento e aprendizado por reforço, e não faz parte da definição de MDP.
> **volte para:** #fundamentos-o-mdp-o-desconto-e-o-alvo-que-se-move
:::

:::exercicio {"id":"reforco-e6","tipo":"numerica","objetivo":"O1","dificuldade":"dificil"}
As mesmas recompensas do exercício anterior, 3, 0 e 10, mas agora com **γ = 0,5**. Qual é o retorno descontado visto do instante inicial?

> **gabarito:** 5,5 ± 0,05
> **porque:** $3 + 0{,}5 \times 0 + 0{,}25 \times 10 = 3 + 0 + 2{,}5 = \mathbf{5{,}5}$.
>
> Compare com os 11,1 obtidos com γ = 0,9. A recompensa de 10 valia 8,1 lá e vale **2,5** aqui: o mesmo prêmio do mesmo mundo, pesado por outra paciência.
>
> A consequência não é de escala, é de **comportamento ótimo**. Com γ = 0,5, uma recompensa imediata de 4 passa a ser preferível ao prêmio de 10 dois passos à frente, e o agente que antes esperava deixa de esperar. Trocar γ muda qual política é a melhor, e não só a velocidade do treino.
> **volte para:** #fundamentos-o-mdp-o-desconto-e-o-alvo-que-se-move
:::

### Explorar ou explotar — o dilema é o cerne, não um detalhe

O agente só conhece o valor de uma ação se a experimentar. Mas cada experimento custa: enquanto testa o desconhecido, ele deixa de colher o melhor que já conhece. Explorar demais é jogar dinheiro fora aprendendo o que não precisava; explorar de menos é ficar preso à primeira coisa razoável que funcionou.

A receita mais simples é a **ε-gulosa**: com probabilidade ε escolha uma ação ao acaso, no resto do tempo escolha a melhor conhecida — e reduza ε ao longo do treino. É rudimentar e ainda assim é o suficiente para a maioria dos casos.

:::lab {"id":"reforco-l1","tipo":"anima-exploracao","titulo":"Tire a exploração e veja quanto ela valia"}
Um mundo de 7×7 com **duas** saídas: uma de **+0,25** a cinco passos da largada, e uma de **+1,5** a doze. Descontada, a segunda ainda vale mais que o dobro da primeira. Q-learning, um episódio por quadro, 600 episódios. O tom de cada casa é o valor que o agente atribui a ela.

Com ε caindo de 1 a 0,05, o agente termina chegando ao prêmio grande em **529 dos 600 episódios**, com recompensa média de 1,375.

**Antes de clicar, preveja.** Explorar custa: cada ação ao acaso é uma ação que não colhe o melhor conhecido. Se tirarmos a exploração e o agente for sempre à melhor ação que conhece, ele fica melhor ou pior?

Com **ε = 0**, ele chega ao prêmio grande em 5 episódios de 600. A recompensa média cai para 0,200, quase sete vezes menos. E não é um agente pior: é o mesmo algoritmo, partindo da **mesma tabela e do mesmo fluxo de sorteios**.

> **Ele não fica preso por burrice.** Ele acha a saída de +0,25, e a partir daí a melhor ação conhecida é positiva e leva até lá. Toda vez que decide, decide certo **pela informação que tem**. A informação que o tiraria dali só apareceria numa ação que ele deixou de tomar — e a regra que ele segue é justamente a de nunca tomá-la.
>
> É por isso que a seção acima chama o dilema de **cerne, e não detalhe**. O custo de explorar aparece no painel, em episódios "desperdiçados". O custo de não explorar não aparece em lugar nenhum: ele é o prêmio que o agente nunca viu, e ninguém sente falta do que não sabe que existe.
:::

Repare que **este dilema não existe em nenhum outro capítulo do livro**. No aprendizado supervisionado, os dados chegam prontos e o modelo não influencia o que verá em seguida. Aqui, **o comportamento do agente determina os dados do agente**. É por isso que o alvo se move: a distribuição de treino é uma função do que se aprendeu até agora — condição bem diferente da otimização de superfície estável do [capítulo II.4](ii-4-otimizacao.md).

### Q-learning e a atualização por diferença temporal

O **Q-learning** mantém uma estimativa `Q(estado, ação)`: quanto vale tomar aquela ação naquele estado. A cada passo, o agente compara duas previsões — a que tinha antes de agir e a que tem depois de ver a recompensa e o novo estado. A diferença entre elas é o **erro de diferença temporal**, e a estimativa se move um pouco naquela direção. Nada espera o fim do episódio.

Em uma frase, a distinção que confunde todo mundo: **on-policy** aprende sobre a política que está de fato executando (inclusive suas explorações atrapalhadas); **off-policy**, que é o caso do Q-learning, aprende sobre a política ótima *enquanto* se comporta de outro jeito, o que permite aprender com experiência velha ou de terceiros.

:::exercicio {"id":"reforco-e2","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Um sistema de recomendação foi treinado por reforço e, após duas semanas, converge para exibir sempre os mesmos 40 itens — os que renderam mais cliques no começo. O catálogo tem 12 mil itens. Qual é o diagnóstico mais provável?

- [ ] O fator de desconto γ está alto demais, tornando o agente paciente em excesso.
- [x] Explotação em excesso: o agente parou de experimentar e ficou preso ao que funcionou primeiro, sem nunca medir os outros 11 960 itens.
- [ ] A recompensa está mal calibrada e precisa ser normalizada entre 0 e 1.
- [ ] O problema é o *bootstrapping*: previsões que se alimentam de previsões sempre colapsam.

> **gabarito:** Explotação em excesso — o agente parou de explorar
> **porque:** O agente está agindo de forma **ótima segundo o que conhece** — e o que ele conhece são os itens que teve a sorte de mostrar cedo. Sobre os outros 11 960 ele não tem estimativa nenhuma, e uma estimativa que nunca é atualizada nunca vira competitiva. É o círculo vicioso característico: só se aprende o valor do que se experimenta, e só se experimenta o que já parece valioso.
>
> Sobre as erradas: **γ alto** deixa o agente mais paciente, não mais repetitivo — se algo, ele o faria buscar recompensas distantes. **Normalizar a recompensa** muda a escala dos números, não a decisão de experimentar ou não. E **bootstrapping** não colapsa por definição; é o mecanismo central que faz o Q-learning funcionar sem esperar o fim do episódio.
>
> A correção prática costuma ser simples e desconfortável: garantir um piso de exploração (ε que não vai a zero) e aceitar pagar por ele — porque o custo de explorar é visível no painel e o custo de não explorar não é.
> **volte para:** #explorar-ou-explotar-o-dilema-e-o-cerne-nao-um-detalhe
:::

:::exercicio {"id":"reforco-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Por que o dilema exploração–explotação não existe no aprendizado supervisionado?

- [x] Porque lá os dados chegam prontos e o modelo não influencia o que verá em seguida.
- [ ] Porque lá o modelo já conhece todas as classes possíveis desde o começo.
- [ ] Porque supervisionado usa validação cruzada, que cobre todos os casos.
- [ ] Porque o dilema é um detalhe de implementação do reforço, e não uma diferença real.

> **gabarito:** os dados chegam prontos e o modelo não os influencia
> **porque:** É a diferença estrutural entre os dois regimes. No supervisionado, o conjunto existe antes do modelo; aqui, **o comportamento do agente determina os dados do agente**.
>
> É também a razão de o alvo se mover. A distribuição de treino passa a ser função do que se aprendeu até agora, condição bem diferente da otimização sobre superfície estável do [capítulo II.4](ii-4-otimizacao.md).
>
> A quarta alternativa trata como detalhe o que o título da seção chama de cerne. Ele não é um parâmetro a ajustar depois: é o que define a natureza do problema.
> **volte para:** #explorar-ou-explotar-o-dilema-e-o-cerne-nao-um-detalhe
:::

:::exercicio {"id":"reforco-e8","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Uma equipe reduz ε a zero ao longo do treino, como manda a receita, e o sistema fica preso a um conjunto pequeno de ações. Qual é a correção que o capítulo propõe, e por que ela é desconfortável?

- [ ] Aumentar γ, para o agente valorizar recompensas distantes.
- [x] Garantir um piso de exploração que não vai a zero, e aceitar pagar por ele — o custo de explorar aparece no painel, e o de não explorar não aparece.
- [ ] Trocar Q-learning por um método on-policy, que explora por construção.
- [ ] Reiniciar o treino com outra semente até obter um resultado melhor.

> **gabarito:** um piso de exploração, com custo visível
> **porque:** A assimetria é o ponto. O custo de explorar é mensurável e imediato: aparece como cliques perdidos, receita menor naquele lote. O custo de **não** explorar é invisível — são as ações boas que nunca foram medidas, e que por isso nunca entram em relatório nenhum.
>
> A primeira alternativa mexe na paciência, e o problema não é horizonte: é cobertura. Um agente mais paciente continua sem estimativa para o que nunca experimentou.
>
> A terceira confunde as famílias. On-policy aprende sobre a política que executa, inclusive as explorações atrapalhadas, e isso não garante exploração nenhuma se a política executada for gulosa.
> **volte para:** #explorar-ou-explotar-o-dilema-e-o-cerne-nao-um-detalhe
:::

## Quando a tabela não cabe: o que a rede acrescenta

O Q-learning tabular guarda um número por par (estado, ação). Isso funciona enquanto der para listar os estados. Numa tela de vídeo game de 84×84 pixels, não dá — e a tabela também tem um defeito mais profundo que o tamanho: ela **não generaliza**. Duas telas quase idênticas ocupam duas células sem relação nenhuma, e a experiência ganha numa não ajuda em nada na outra.

O **DQN** (*Deep Q-Network*) substitui a tabela por uma rede neural que recebe o estado e devolve os valores das ações. O ganho não é memória: é **generalização entre estados parecidos** — a mesma virtude que a rede tem no [capítulo III.2](iii-2-redes-neurais.md), aplicada a uma previsão de valor em vez de a um rótulo. Foi isso que fez o mesmo algoritmo, sem ajuste por jogo, aprender dezenas de jogos de Atari a partir dos pixels.

O preço é instabilidade. Quando o alvo do aprendizado é produzido pela própria rede que está sendo treinada, o treino pode divergir com facilidade — e boa parte da engenharia do DQN existe só para segurar isso.

:::exercicio {"id":"reforco-e9","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Qual é a diferença entre aprender valor e aprender política?

- [x] A política responde "o que fazer aqui?", mapeando estado em ação; a função de valor responde "quanto vale estar aqui?", prevendo recompensa futura acumulada.
- [ ] A política serve para ambientes discretos e o valor para contínuos.
- [ ] O valor é aprendido offline e a política, online.
- [ ] São nomes diferentes para a mesma coisa, e a distinção é histórica.

> **gabarito:** o que fazer contra quanto vale estar aqui
> **porque:** São duas perguntas diferentes, e as duas famílias resolvem o mesmo problema por portas opostas. Métodos de valor aprendem a previsão e agem sendo gulosos sobre ela; métodos de política ajustam o comportamento diretamente, sem passar pela previsão.
>
> A quarta alternativa colapsa a distinção que organiza o campo. Ela importa na prática: um método de valor precisa de um passo a mais para virar comportamento, e é nesse passo que a exploração entra.
>
> As duas alternativas do meio inventam critérios que não correspondem à divisão real — há métodos de política em ambientes discretos e métodos de valor treinados offline.
> **volte para:** #fundamentos-o-mdp-o-desconto-e-o-alvo-que-se-move
:::

:::exercicio {"id":"reforco-e10","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
O que o DQN acrescenta ao Q-learning tabular, e a que preço?

- [ ] Mais memória para guardar a tabela, ao custo de treino mais lento.
- [x] Generalização entre estados parecidos, ao custo de instabilidade, porque o alvo do aprendizado é produzido pela própria rede que está sendo treinada.
- [ ] A capacidade de aprender off-policy, que a tabela não tinha.
- [ ] Exploração automática, dispensando o ε.

> **gabarito:** generalização, ao custo de instabilidade
> **porque:** O defeito da tabela é mais profundo que o tamanho: ela **não generaliza**. Duas telas quase idênticas ocupam células sem relação nenhuma, e o que se aprende numa não ajuda na outra. A rede resolve isso pela mesma virtude que ela tem no [capítulo III.2](iii-2-redes-neurais.md), aplicada a uma previsão de valor.
>
> O preço é estrutural. Quando o alvo vem da própria rede em treino, o treino pode divergir com facilidade, e boa parte da engenharia do DQN existe só para segurar isso.
>
> A terceira alternativa atribui à rede algo que já era do Q-learning: ele é off-policy por construção, tabular ou não.
> **volte para:** #quando-a-tabela-nao-cabe-o-que-a-rede-acrescenta
:::

## Por que reforço é a última ferramenta a considerar

Esta é a seção mais útil deste capítulo na vida prática, e ela vai contra o marketing.

**Reforço precisa de simulador ou de interação barata em enorme quantidade.** Os resultados célebres vêm de domínios onde se pode jogar milhões de partidas de graça. Se cada tentativa do seu agente custa um cliente irritado, uma máquina parada ou um paciente exposto, você não tem esse orçamento.

**É caro em amostras.** Ordens de grandeza mais caro que aprendizado supervisionado para a mesma tarefa, quando a tarefa admite as duas formulações.

**É instável para treinar.** Duas execuções com a mesma configuração e sementes diferentes podem terminar em lugares diferentes. Isso transforma depuração em trabalho de paciência.

**E a maioria dos problemas de empresa é supervisionado disfarçado.** O teste é direto: *as minhas decisões mudam o que eu vou observar depois?* Se não mudam, não há problema sequencial — há um problema de previsão seguido de uma regra de decisão, e o [capítulo II.8](ii-8-do-modelo-a-decisao.md) resolve isso melhor, mais barato e com muito mais controle. Bellman e Wald, aliás, são a mesma família: decidir sob incerteza com uma função que precifica.

**E existe *reward hacking*.** O agente otimiza **a recompensa que você escreveu**, não a que você pretendia. Se o número recompensa cliques, ele produzirá cliques — inclusive por caminhos que ninguém quis. Especificar recompensa é escrever um contrato com um advogado literal e incansável, e é aí que mora o modo de falha característico da formulação. Onde reforço tem funcionado fora dos jogos é justamente onde a recompensa é a parte difícil e recebeu tratamento sério — o **RLHF** dos modelos de linguagem, no [capítulo III.6](iii-6-modelos-de-fundacao.md).

:::exercicio {"id":"reforco-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"dificil"}
Uma transportadora quer "usar aprendizado por reforço para otimizar a roteirização das entregas do dia". Há histórico de 4 anos de rotas executadas, com tempos reais. Não existe simulador. Cada rota mal planejada custa horas extras e atraso com o cliente.

Julgue: este problema merece reforço, ou é supervisionado (ou otimização) disfarçado? Justifique e proponha o que fazer.

> **rubrica:** aplica o teste da influência — pergunta se a decisão de hoje muda o que será observado amanhã;
> identifica a ausência de simulador e o custo alto por tentativa como impedimento prático, não como detalhe;
> reconhece que há 4 anos de dados rotulados por tempo real, o que sustenta um modelo supervisionado de previsão de tempo de percurso;
> separa as duas metades — prever tempos (supervisionado) e escolher a rota (otimização combinatória sobre as previsões);
> NÃO recomenda reforço como primeira escolha, e diz sob que condição ele voltaria à mesa (existência de simulador validado, ou interação barata)
> **porque:** A resposta fraca aceita o enunciado do cliente e discute qual algoritmo de reforço usar. A resposta forte percebe que o problema já vem **com gabarito**: quatro anos de rotas executadas com tempos reais são exemplos rotulados. Prever o tempo de um trecho é supervisionado clássico; escolher a melhor rota dadas as previsões é otimização de roteirização, um campo com décadas de solvers maduros.
>
> O critério que decide não é o tamanho do problema, é a **influência**: as entregas de hoje mudam a distribuição do trânsito de amanhã? Praticamente não. Sem influência, não há problema sequencial a resolver — há previsão mais decisão, exatamente a separação do [capítulo II.8](ii-8-do-modelo-a-decisao.md).
>
> E há o argumento material, que costuma encerrar a conversa antes do argumento teórico: **sem simulador, o agente aprende explorando na operação real**, e explorar aqui significa despachar rotas ruins de propósito para descobrir que são ruins. Alguém vai pagar essa conta em horas extras. Reforço volta à mesa no dia em que existir um simulador de trânsito validado — e então o trabalho difícil passa a ser mostrar que o simulador se parece com a rua.
> **volte para:** #por-que-reforco-e-a-ultima-ferramenta-a-considerar
:::

:::exercicio {"id":"reforco-e11","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
Qual é o teste direto para saber se um problema de empresa é sequencial de verdade?

- [ ] O volume de dados históricos disponíveis passa de um milhão de registros.
- [x] As minhas decisões mudam o que eu vou observar depois?
- [ ] Existe uma recompensa numérica bem definida no domínio.
- [ ] O problema envolve uma sequência de passos no tempo.

> **gabarito:** as decisões mudam o que será observado depois
> **porque:** É a pergunta da influência, e ela separa problema sequencial de previsão mais decisão. Se as decisões não mudam a distribuição futura, não há nada de sequencial a resolver, e o [capítulo II.8](ii-8-do-modelo-a-decisao.md) trata do caso melhor, mais barato e com muito mais controle.
>
> A quarta alternativa é a confusão mais comum. Muita coisa acontece em sequência sem ser um problema sequencial: prever a demanda de cada dia do mês é uma sequência de previsões independentes se o que você faz hoje não muda a demanda de amanhã.
>
> A terceira inverte a ordem do trabalho. Ter recompensa bem definida é raro e é a parte difícil — e onde reforço funciona fora dos jogos é justamente onde ela recebeu tratamento sério.
> **volte para:** #por-que-reforco-e-a-ultima-ferramenta-a-considerar
:::

:::exercicio {"id":"reforco-e12","tipo":"multipla-multi","objetivo":"O4","dificuldade":"media"}
Quais condições, segundo o capítulo, tornam reforço impraticável num projeto de empresa? (marque todas que valem)

- [x] Não existe simulador, e cada tentativa custa cliente irritado ou máquina parada.
- [x] O custo em amostras é ordens de grandeza maior que o do supervisionado para a mesma tarefa.
- [x] Duas execuções com a mesma configuração e sementes diferentes terminam em lugares diferentes.
- [ ] O problema tem mais de mil estados possíveis.

> **gabarito:** sem simulador · caro em amostras · instável entre execuções
> **porque:** As três são as objeções práticas da seção, e nenhuma é sobre o tamanho do problema. A primeira costuma encerrar a conversa antes das outras: sem simulador, explorar significa tomar decisões ruins de propósito na operação real, e alguém paga essa conta.
>
> A instabilidade merece destaque porque é a que mais surpreende. Ela transforma depuração em trabalho de paciência: quando duas execuções idênticas divergem, você não sabe se mudou algo ou se tirou outra semente. É o mesmo desconforto do ótimo local do [capítulo IV.1](iv-1-nao-supervisionado.md), agora como condição permanente de trabalho.
>
> A alternativa errada propõe um limiar de tamanho. Mil estados é pequeno para reforço e não diz nada: o que decide é influência, orçamento de interação e estabilidade.
> **volte para:** #por-que-reforco-e-a-ultima-ferramenta-a-considerar
:::

## Síntese — o que levar

- O sinal chega **tarde e agregado**; o problema é **atribuição de crédito temporal**, e não há supervisor para resolvê-lo.
- A virada foi aprender da **discrepância entre duas previsões sucessivas**, sem esperar o fim e sem modelo do mundo.
- **A ideia exportável:** não é preciso saber a resposta certa para aprender — basta que a previsão de amanhã seja mais informada que a de hoje. O alvo é uma versão menos ignorante de si mesmo.
- **MDP** = estado, ação, recompensa, transição. Estado mal definido não se conserta com mais treino.
- **γ** declara quanta paciência o agente tem; muda o comportamento ótimo, não só a velocidade.
- **Valor** responde "quanto vale estar aqui"; **política** responde "o que fazer aqui". Portas opostas para o mesmo problema.
- Explorar × explotar é o **cerne**, não um detalhe: aqui o comportamento do agente determina os dados do agente.
- A rede (DQN) acrescenta **generalização entre estados**, não memória — e cobra instabilidade por isso.
- **Reforço é a última ferramenta a considerar.** Sem simulador ou interação barata, quase sempre é supervisionado disfarçado.
- *Reward hacking* não é anedota: o agente otimiza a recompensa **escrita**, não a pretendida.
- **Fonte autêntica ≠ afirmação verdadeira.** O próprio Bellman é o caso-modelo.

:::exercicio {"id":"reforco-e4","tipo":"aberta","objetivo":"O3","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Explique a diferença entre aprender uma **função de valor** e aprender uma **política** diretamente, e dê uma situação concreta em que você preferiria cada uma.

> **rubrica:** enuncia as duas perguntas que cada abordagem responde (valor responde "quanto vale estar aqui", política responde "o que fazer aqui") e deixa claro que são portas opostas para o mesmo problema;
> descreve como o método de valor **age**: ele aprende a previsão e escolhe a ação sendo guloso sobre ela, de modo que a política existe, mas é derivada e não aprendida;
> dá ao menos uma situação concreta para cada escolha e justifica pela **estrutura do problema**, não por preferência — por exemplo, poucas ações discretas favorecem valor, e ação contínua ou política deliberadamente aleatória favorece política direta;
> não trata as duas como etapas de um mesmo procedimento nem confunde a distinção com *on-policy* × *off-policy*, que é uma questão diferente: de qual comportamento se aprende, não do que se aprende
> **porque:** O quarto critério é o que este exercício realmente persegue, porque as duas distinções aparecem no mesmo capítulo e se embaralham com facilidade. **Valor × política** responde *o que o método aprende*. **On-policy × off-policy** responde *sobre qual comportamento ele aprende*. São eixos independentes, e é perfeitamente possível combinar qualquer par.
>
> A situação concreta é o que separa quem entendeu de quem decorou. Onde as ações são poucas e discretas, calcular um valor por ação e pegar o máximo é natural e barato. Onde a ação é **contínua**, como o ângulo de um leme ou a dose de um medicamento, esse máximo vira um problema de otimização a cada passo, e aprender a política diretamente evita o problema em vez de resolvê-lo repetidamente.
>
> Há um segundo caso que a boa resposta às vezes alcança: quando a política **ótima é aleatória**. Um método de valor guloso sempre escolhe a mesma ação no mesmo estado; se o problema exige imprevisibilidade, como num jogo com adversário que aprende, essa determinação é uma fraqueza que o método de valor não consegue expressar.
> **volte para:** #fundamentos-o-mdp-o-desconto-e-o-alvo-que-se-move
:::

## Verificação

1. Descreva um problema do seu trabalho como MDP: quem é o agente, o que é o estado, quais são as ações e qual é a recompensa. Em seguida, diga qual das quatro peças foi mais difícil de definir — e por quê essa dificuldade é um sinal sobre o problema, não sobre você.
2. Um colega propõe reforço para ajustar preços em tempo real num *e-commerce*. Que três perguntas você faz antes de concordar — e qual resposta faria você recusar a formulação?

> Estas duas não são corrigidas, e a omissão é deliberada: a primeira pede um problema que só você conhece, e a segunda se ganha na conversa em que você recusa a formulação.
