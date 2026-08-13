# II.8 — Do Modelo à Decisão

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Comparar duas ou mais técnicas com protocolo justo e incerteza declarada.
- **O2.** Traduzir métrica estatística em consequência de negócio.
- **O3.** Apresentar resultados a um público não técnico sem perder o rigor.
- **O4.** Decidir, com critério explícito, se um modelo deve ou não ir a produção.

## O problema: o modelo está pronto, e daí?

Um analista termina o projeto com 0,91 de AUC. Apresenta. A diretora pergunta: *"Então a gente aprova ou não aprova o crédito desse cliente aqui?"*

Ele não sabe responder. E não é por incompetência técnica — é porque **falta uma informação que nunca esteve nos dados**: quanto custa cada tipo de erro.

O modelo entrega uma **ordenação**: este cliente é mais arriscado que aquele. Transformar ordenação em **ação** exige um corte, e o corte exige um preço. Enquanto ninguém disser quanto vale perder um bom cliente e quanto custa aprovar um mau, não existe resposta certa — existe apenas uma escolha, e alguém vai fazê-la de qualquer maneira.

O erro que este capítulo previne é esse: **o cientista de dados escolher o limiar sozinho, calado, achando que é uma decisão técnica.** Não é. É uma decisão de negócio disfarçada de detalhe de implementação.

## De onde isto veio

**O aperto.** Guerra, 1940–43, duas frentes independentes com o mesmo problema: *o que fazer com um número*.

Na Inglaterra, **Patrick Blackett** monta em agosto de 1940, no Anti-Aircraft Command, um grupo de sete cientistas (físicos, um astrônomo, um fisiologista, um matemático) apelidado **"Blackett's Circus"**. Em março de 1941 repete a receita no Coastal Command, contra os submarinos alemães. Nos Estados Unidos, o **Statistical Research Group** reúne em Columbia, no verão de 1942, gente como Wald, Savage, Friedman e Hotelling para decidir blindagem de bombardeiro, mistura de munição e regras de inspeção por amostragem.

**O que se fazia antes.** Decisão de comando por experiência e hierarquia. E, do lado da estatística, dois problemas tratados separadamente e **sem preço**: estimar um parâmetro e testar uma hipótese.

**A virada.** Abraham Wald mostra, em 1939, que estimar e testar são casos particulares de um mesmo problema: decidir. E para isso ele precisa de algo que a estatística clássica não tinha, uma **função que diz quanto custa errar**. Erro deixa de ser categoria lógica (certo/errado) e vira **grandeza econômica**.

**A ideia reaproveitável.** **Pode ser ótimo agir como se uma classe fosse verdadeira mesmo quando a outra é mais provável.** Charles Elkan dá o exemplo perfeito: pode ser racional não aprovar uma transação alta de cartão *mesmo que ela seja provavelmente legítima*, porque o prejuízo da fraude rara supera o incômodo do bloqueio frequente. **Probabilidade ordena; custo decide.** Um modelo que devolve só probabilidade não terminou o trabalho.

**O nome.** *Operational research* no Reino Unido, *operations research* nos Estados Unidos: a diferença de nome guarda a diferença de origem. Já "análise de decisão" é cunhada só em 1966, por **Ronald Howard**, e o detalhe é saboroso: o nome do campo nasce **dentro** de uma conferência de Pesquisa Operacional.

> ### O capítulo II.1 e este são a mesma história, cortada em dois
>
> Blackett entrou em **1934** no comitê Tizard, cuja marca foi justamente **supervisionar o desenvolvimento do radar** antes da guerra. Só depois, em 1940, montou o Circus.
>
> **A mesma pessoa, no mesmo comitê, diante do mesmo problema.** Chegou o sinal — o que se faz com ele? O [capítulo II.1](ii-1-avaliacao.md) conta o lado do **botão de ganho**: onde pôr o limiar, e como a curva ROC mapeia essa troca. Este conta o lado do **comando**: quanto custa cada erro, e quem tem autoridade para dizer isso.
>
> **O limiar do capítulo II.1 é a matriz de custo deste capítulo vista de perfil.**

### A matriz de custo, e o erro que atravessou décadas

Aqui está o achado mais útil, e mais desconfortável, desta seção.

O *German credit dataset*, conjunto didático clássico distribuído com uma matriz de custo oficial, tem uma matriz **economicamente incoerente**. Elkan demonstra o problema: ela mede cada célula a partir de uma linha de base diferente. Como **negar o empréstimo produz exatamente o mesmo fluxo de caixa** quer o cliente fosse bom ou mau, as duas células da linha "negar" **têm de ser iguais** — e não são.

A recomendação dele é prática e vale para o seu trabalho: **contabilize em benefício, não em custo.** Benefício tem uma linha de base natural — o estado do agente **antes** de decidir. Custo não tem, e por isso convida ao erro de comparar cada célula com uma referência diferente.

Um conjunto de dados usado em aula há décadas circula com uma matriz de custo errada. Não porque alguém foi descuidado: porque **matriz de custo é mais difícil do que parece**, e quase ninguém confere.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | Tudo o que é atribuído a Elkan — o exemplo do cartão de crédito, a incoerência da matriz do *German credit*, e a recomendação de contabilizar em benefício — de [*The Foundations of Cost-Sensitive Learning* (IJCAI, 2001)](https://cseweb.ucsd.edu/~elkan/rescale.pdf), **lido** |
| ✓ᵐ | Blackett, o "Blackett's Circus" (agosto de 1940), o Coastal Command (março de 1941) e a participação no comitê Tizard/CSSAD desde 1934 — [perfil biográfico do INFORMS](https://www.informs.org/Explore/History-of-O.R.-Excellence/Biographical-Profiles/Blackett-Patrick-M.-S) |
| ✓ᵐ | Wald (*Annals of Mathematical Statistics* 10(4):299–326, 1939) e *Statistical Decision Functions* (1950); Savage (1954); Raiffa & Schlaifer (1961, Harvard Business School); Howard cunhando "decision analysis" em 1966. **O artigo de Wald está digitalizado sem camada de texto e não foi lido** |
| ✓ᵐ | O Statistical Research Group de Columbia (1942) e seus integrantes |
| ⏳ | O estudo da blindagem dos bombardeiros (1943) como caso canônico de viés de sobrevivência |
| ❌ | A **origem da curva de lift**: procurei inventor, data e publicação, e **não achei atribuição primária**. O que se apura é ambiente, não autoria — RFM atribuído a George Cullinan por volta de 1961 no marketing direto (⏳), e a análise por decis consolidada no *database marketing* dos anos 1980–90 (⏳) |
| 📖 | A leitura de que os capítulos II.1 e 25 são uma história só, e de que o limiar é a matriz de custo vista de perfil |

## Fundamentos: comparar duas técnicas sem se enganar

Comparação justa tem três exigências, e violar qualquer uma invalida o resultado.

**1. O mesmo dado, na mesma divisão.** Se o modelo A foi avaliado numa divisão e o B em outra, você comparou as divisões, não os modelos. Fixe a *seed* e reutilize exatamente os mesmos conjuntos.

**2. O mesmo orçamento de busca.** Comparar um modelo com hiperparâmetros ajustados por cem tentativas contra outro com valores de fábrica não é comparação, é encenação. Ou os dois recebem busca, ou nenhum recebe.

**3. A mesma métrica, escolhida antes.** Escolher a métrica **depois** de ver os resultados é a forma mais comum e mais inocente de trapaça — você acaba selecionando a régua que favorece o modelo que já preferia.

### A diferença é maior que o ruído?

Modelo A dá 0,913 e modelo B dá 0,907. A é melhor?

Provavelmente **você não sabe**. Métrica calculada num conjunto de teste é uma **estimativa**, e estimativa tem incerteza — como o [capítulo II.1](ii-1-avaliacao.md) mostrou. Com 500 exemplos de teste, uma diferença de 0,006 costuma estar dentro do ruído.

O procedimento honesto é o **bootstrap pareado**: reamostre o conjunto de teste com reposição, recalcule a métrica dos **dois** modelos na mesma reamostragem, e guarde a diferença. Repita mil vezes. Se o intervalo das diferenças cruza o zero, **os modelos empataram** — e dizer isso é um resultado, não um fracasso.

O detalhe que faz o método funcionar é o *pareado*: avaliar os dois na **mesma** reamostragem cancela a variação que vem do conjunto e isola a que vem do modelo.

:::exercicio {"id":"do-modelo-a-decisao-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Você comparou dois modelos no mesmo conjunto de teste: A deu 0,913 de AUC e B deu 0,907. O bootstrap pareado com mil reamostragens devolveu um intervalo de 95% para a diferença (A − B) de **[−0,004; +0,016]**. O que reportar?

- [ ] Que A é melhor que B, porque a estimativa pontual da diferença é positiva.
- [x] Que não há evidência de diferença entre os dois, e a escolha deve usar outro critério.
- [ ] Que B é melhor, porque o intervalo é mais largo do lado positivo.
- [ ] Que o experimento falhou e precisa de mais reamostragens.

> **gabarito:** Não há evidência de diferença; decida por outro critério
> **porque:** O intervalo **cruza o zero**, então os dados são compatíveis com A melhor, B melhor e empate. A estimativa pontual de +0,006 existe, mas não se sustenta sozinha — reportá-la como "A ganhou" é apresentar ruído como resultado.
>
> E isto é uma boa notícia disfarçada: **quando dois modelos empatam em desempenho, você fica livre para decidir por tudo o mais** — custo de inferência, facilidade de explicar a decisão a um auditor, tempo de treino, número de dependências. Um empate estatístico transfere a decisão da métrica para a engenharia, e quase sempre a engenharia tem preferência clara.
>
> A última alternativa é o erro mais comum na prática: aumentar as reamostragens **não** estreita o intervalo de forma relevante, porque a incerteza vem do **tamanho do conjunto de teste**, não do número de reamostragens. Mil já é suficiente; o que faltaria é mais dado de teste.
> **volte para:** #a-diferenca-e-maior-que-o-ruido
:::

:::exercicio {"id":"do-modelo-a-decisao-e5","tipo":"multipla-multi","objetivo":"O1","dificuldade":"facil"}
Quais são as três exigências de uma comparação justa entre duas técnicas? (marque todas que valem)

- [x] O mesmo dado, na mesma divisão.
- [x] O mesmo orçamento de busca de hiperparâmetros.
- [x] A mesma métrica, escolhida antes de ver os resultados.
- [ ] O mesmo tempo de treino em segundos para os dois modelos.

> **gabarito:** mesmo dado e divisão · mesmo orçamento de busca · métrica escolhida antes
> **porque:** As três protegem contra formas diferentes de se enganar. Divisões distintas comparam divisões, não modelos. Busca desigual compara esforço, não método. E métrica escolhida depois seleciona a régua que favorece o modelo que você já preferia, que é a forma mais inocente de trapaça, porque quem a comete costuma não perceber.
>
> A alternativa errada iguala o que não precisa ser igual. Tempo de treino é uma característica legítima dos modelos e frequentemente um critério de decisão, e forçá-lo a ser igual estragaria a comparação em vez de protegê-la.
>
> Repare que a terceira exigência é a única que se cumpre **antes** de rodar qualquer coisa, e é por isso que ela é a mais fácil de esquecer.
> **volte para:** #fundamentos-comparar-duas-tecnicas-sem-se-enganar
:::

:::exercicio {"id":"do-modelo-a-decisao-e6","tipo":"multipla","objetivo":"O1","dificuldade":"dificil"}
Por que o bootstrap precisa ser **pareado** para comparar dois modelos?

- [ ] Porque assim o número de reamostragens necessário cai pela metade.
- [x] Porque avaliar os dois na mesma reamostragem cancela a variação que vem do conjunto e isola a que vem do modelo.
- [ ] Porque modelos diferentes exigem conjuntos de teste diferentes.
- [ ] Porque o pareamento corrige a falta de calibração das probabilidades.

> **gabarito:** cancela a variação do conjunto e isola a do modelo
> **porque:** Boa parte da variação de uma métrica vem de **quais exemplos** caíram na reamostragem, e essa parte afeta os dois modelos igualmente. Calculando a diferença dentro da mesma reamostragem, ela se cancela, e o que sobra é a diferença entre os modelos.
>
> Comparar dois intervalos independentes desperdiça essa informação e é bem menos sensível: dois intervalos que se sobrepõem podem esconder uma diferença que o teste pareado detectaria.
>
> A quarta alternativa junta dois assuntos reais e independentes. Calibração é propriedade dos escores e continua sendo problema depois do pareamento; o bootstrap não a conserta nem depende dela para comparar ordenações.
> **volte para:** #a-diferenca-e-maior-que-o-ruido
:::

## Da métrica ao dinheiro

Aqui o capítulo cumpre o seu nome. Toda decisão binária tem quatro resultados possíveis, e **cada um vale um número**:

| | Previu positivo | Previu negativo |
|---|---|---|
| **É positivo** | acerto — benefício de agir certo | erro — custo de deixar passar |
| **É negativo** | erro — custo do alarme falso | acerto — benefício de não agir à toa |

Preenchida a tabela, o limiar ótimo deixa de ser opinião: é o corte que **maximiza o benefício esperado**. E, seguindo Elkan, preencha-a em **benefício**, com a linha de base sendo *o que aconteceria se você não fizesse nada*.

Três avisos que economizam retrabalho:

**Os números não são seus.** Quem sabe quanto custa um falso negativo é a área de risco, a área médica, o jurídico. O seu papel é **exigir os números e registrar quem os forneceu** — porque quando o limiar for questionado, a pergunta vai ser "quem decidiu isso?".

**Custos mudam; o modelo não precisa mudar junto.** Se a matriz muda de trimestre, você recalcula o limiar sobre as mesmas probabilidades. É a maior vantagem prática de separar o modelo (que ordena) da decisão (que corta).

**Probabilidade mal calibrada estraga tudo.** O cálculo do limiar ótimo pressupõe que 0,7 signifique 70%. Ensembles costumam não cumprir isso — ver [capítulo II.1](ii-1-avaliacao.md). Calibre antes de contabilizar.

:::exercicio {"id":"do-modelo-a-decisao-e2","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Um modelo prevê inadimplência. Aprovar um cliente **bom** dá lucro de **R$ 200**. Aprovar um cliente **mau** dá prejuízo de **R$ 1 000**. Negar não gera lucro nem prejuízo (R$ 0), qualquer que seja o cliente.

Acima de qual **probabilidade de inadimplência** vale mais negar do que aprovar? Responda em fração, com duas casas decimais.

> **gabarito:** 0,17 ± 0,01
> **porque:** Chame de *p* a probabilidade de o cliente ser mau. Aprovar tem valor esperado `200 × (1 − p) − 1000 × p`; negar tem valor esperado **0**. O ponto de indiferença é onde os dois se igualam: `200 − 200p − 1000p = 0`, ou seja `200 = 1200p`, então `p = 1/6 ≈ 0,1667` — **0,17** arredondado.
>
> Repare no que acabou de acontecer: o limiar **não é 0,5**. E não é por causa de desequilíbrio de classes — é porque **os erros custam preços diferentes**. Um mau cliente destrói o lucro de cinco bons, então a régua se desloca para o lado cauteloso.
>
> Este é o cálculo que responde a pergunta da diretora lá do início do capítulo. Note também que ele **não usou a AUC**: a AUC serve para escolher o modelo; a matriz de custo serve para operá-lo.
> **volte para:** #da-metrica-ao-dinheiro
:::

:::exercicio {"id":"do-modelo-a-decisao-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Quem deve fornecer os valores da matriz de custo?

- [ ] A equipe de dados, que conhece o modelo e as métricas.
- [x] A área que responde pela consequência (risco, jurídico, clínica), e o papel da equipe de dados é exigir os números e registrar quem os forneceu.
- [ ] Ninguém: os valores se estimam do próprio histórico do modelo.
- [ ] O fornecedor da ferramenta de modelagem, que traz valores de referência do setor.

> **gabarito:** a área que responde pela consequência
> **porque:** Quanto custa um falso negativo é uma pergunta de negócio, e a equipe de dados não tem como respondê-la. O que ela tem é a obrigação de **exigir** o número e registrar a origem.
>
> A razão do registro é operacional e aparece depois: quando o limiar for questionado, a pergunta será "quem decidiu isso?". Sem o registro, a resposta vira "o modelo", que não é uma resposta.
>
> A terceira alternativa parece técnica e é circular: estimar o custo do erro a partir do histórico do próprio modelo usa como evidência as decisões que se quer avaliar. Valores de referência de setor podem informar a conversa e não substituem a decisão de quem paga a conta.
> **volte para:** #da-metrica-ao-dinheiro
:::

:::exercicio {"id":"do-modelo-a-decisao-e8","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
A matriz de custo do trimestre muda: o prejuízo de aprovar um cliente mau passa de R$ 1 000 para R$ 2 000. O que precisa ser refeito?

- [ ] O treino do modelo, com a nova matriz entrando na função de perda.
- [x] Só o limiar, recalculado sobre as mesmas probabilidades já previstas.
- [ ] O modelo inteiro, incluindo seleção de atributos e busca de hiperparâmetros.
- [ ] Nada: o limiar ótimo não depende dos custos, só da prevalência.

> **gabarito:** só o limiar
> **porque:** É a maior vantagem prática de separar o modelo, que **ordena**, da decisão, que **corta**. As probabilidades previstas não mudam quando o custo muda; o que muda é onde vale a pena cortar.
>
> Com o novo valor, o ponto de indiferença vira $200 = 2200p$, ou seja $p \approx 0{,}09$: o limiar desce, e o sistema fica mais cauteloso. Nenhum treino foi necessário.
>
> A última alternativa inverte o resultado do exercício anterior, que mostrou o limiar em 0,17 e não em 0,5 justamente porque os erros custam preços diferentes. Prevalência importa para a métrica; custo importa para o corte.
>
> Uma condição fica pressuposta em tudo isso: as probabilidades precisam significar o que dizem. Com escores mal calibrados, o cálculo do limiar ótimo é aritmética sobre números que não são probabilidades.
> **volte para:** #da-metrica-ao-dinheiro
:::

## Apresentar sem trair o rigor

O relatório mínimo tem seis partes, nesta ordem: problema (a decisão que se quer apoiar), dados (origem, período, tamanho, o que foi excluído e por quê), protocolo (divisão, busca, métrica escolhida antes), resultado com incerteza, **limitações** (onde o modelo não vale) e recomendação.

A parte que quase todo mundo corta é a de **limitações** — e é a que constrói confiança. Um relatório que declara onde o modelo falha é levado mais a sério que um que só apresenta vitórias, porque o leitor entende que alguém procurou.

Três regras para a conversa com quem não é técnico:

- **Fale em consequência, não em métrica.** Não "AUC de 0,91", e sim "entre os 10% que o modelo mais suspeita, encontramos 6 de cada 10 fraudes do período".
- **Nunca prometa o número do teste como se fosse o de produção.** O dado de produção difere; diga isso antes que a realidade diga.
- **Traga o cenário do erro.** Quem decide precisa saber como é um dia ruim, não só o dia médio.

> **O relatório errado, em um exemplo.** Em [`ml-zero/dados/limonada/`](../../ml-zero/dados/limonada/README.md), um modelo com R² de 0,982 sustenta a recomendação "aumente o preço" — porque o preço só subiu no verão, e o coeficiente positivo sobrevive até à regressão múltipla. Das seis partes do relatório acima, a única que pegaria isso é **limitações**: é lá que se escreve "o preço nunca variou fora da alta temporada, logo este modelo não estima efeito de preço". A parte que quase todo mundo corta é a que impediria a recomendação errada. O caso está no [capítulo II.2](ii-2-modelos-lineares.md#o-caso-da-limonada).

:::exercicio {"id":"do-modelo-a-decisao-e9","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Qual das seis partes do relatório mínimo é a que quase todo mundo corta, e a que teria impedido a recomendação errada da limonada?

- [ ] Protocolo.
- [ ] Resultado com incerteza.
- [x] Limitações.
- [ ] Recomendação.

> **gabarito:** limitações
> **porque:** É lá que se escreve "o preço nunca variou fora da alta temporada, logo este modelo não estima efeito de preço". Nenhuma das outras cinco partes pegaria o problema: o protocolo estava correto, o resultado era um R² de 0,982 legítimo, e a recomendação é justamente o que se queria impedir.
>
> A seção diz por que ela também é a que constrói confiança. Um relatório que declara onde o modelo falha é levado mais a sério do que um que só apresenta vitórias, porque o leitor entende que alguém procurou.
>
> Repare na ironia útil: a parte mais cortada por parecer fraqueza é a única que teria evitado o erro caro.
> **volte para:** #apresentar-sem-trair-o-rigor
:::

:::exercicio {"id":"do-modelo-a-decisao-e10","tipo":"multipla-multi","objetivo":"O3","dificuldade":"media"}
Quais frases seguem as três regras de conversa com público não técnico? (marque todas que valem)

- [x] "Entre os 10% que o modelo mais suspeita, encontramos 6 de cada 10 fraudes do período."
- [x] "Num mês ruim, esperamos que cerca de um terço dos alarmes seja falso."
- [ ] "O modelo tem AUC de 0,91, o que é considerado excelente na literatura."
- [x] "O número medido no teste tende a cair em produção, porque o dado de lá difere; vamos acompanhar."
- [ ] "Garantimos 91% de acerto quando entrar em produção."

> **gabarito:** consequência em vez de métrica · cenário do dia ruim · aviso de que o teste não é produção
> **porque:** As três corretas cobrem as três regras. A primeira troca a métrica pela consequência que a sala consegue avaliar. A segunda traz o dia ruim, e não só o dia médio, que é o que quem decide precisa para dimensionar equipe e orçamento. A terceira antecipa a diferença entre teste e produção, e dizer isso antes é o que preserva a confiança quando o número cair.
>
> A frase da AUC não é falsa e não informa: quem ouve não tem como converter 0,91 em decisão, e "excelente na literatura" transfere autoridade em vez de dar entendimento.
>
> A última é a pior das cinco, porque promete o número do teste como se fosse o de produção. É a promessa que a realidade vai desmentir, e o custo não é só o do erro: é a perda de crédito de todo relatório seguinte.
> **volte para:** #apresentar-sem-trair-o-rigor
:::

### A decisão de não lançar

É uma decisão legítima e frequentemente a certa. Motivos suficientes para recusar um modelo que passa nas métricas:

o ganho não paga o custo de manter; o desempenho é bom no geral e **ruim num subgrupo que importa** (ver [capítulo V.1](v-1-interpretabilidade-justica.md)); ninguém consegue explicar uma decisão individual quando for contestada; ou não há como monitorar o modelo depois de implantado (ver [capítulo V.3](v-3-mlops.md)).

Defender essa recusa exige exatamente o mesmo aparato de defender o lançamento: números, protocolo e critério explícito. **"Não vamos lançar" com evidência é trabalho concluído**, não trabalho perdido.

:::exercicio {"id":"do-modelo-a-decisao-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"media"}
Seu modelo de triagem de currículos alcança 0,89 de AUC no conjunto de teste, bem acima da triagem manual atual. Ao segmentar o resultado, você descobre que o desempenho é **0,91 para candidatos formados nas cinco universidades mais frequentes na base histórica** e **0,63 para os demais**.

Escreva a recomendação que você levaria à diretoria — incluindo o que você recomenda fazer e por quê.

> **rubrica:** identifica que a média de 0,89 esconde um desempenho ruim num subgrupo;
> reconhece que o subgrupo pior corresponde a quem já era minoria na base histórica, o que caracteriza aprendizado do processo de seleção passado e não da competência dos candidatos;
> NÃO recomenda lançar como está;
> propõe ao menos uma ação concreta — reponderar/coletar dados do subgrupo, usar o modelo só como apoio com revisão humana, ou restringir o escopo declarando a limitação;
> menciona a consequência para pessoas reais, não só a métrica
> **porque:** A resposta fraca compara 0,89 com a triagem manual e recomenda lançar. A resposta forte percebe que **a média esconde a decisão**: para 0,63 de AUC o modelo está perto do acaso, e "perto do acaso" aplicado a currículos significa descartar gente por sorteio — enquanto a empresa acredita estar usando um sistema de 0,89.
>
> O ponto mais fino, e o que separa uma boa resposta de uma excelente: o modelo provavelmente **não está errado sobre os dados** — ele aprendeu corretamente um padrão que existe no histórico. Aprendeu **quem a empresa costumava contratar**. É exatamente o vazamento do [capítulo I.3](i-3-dados.md) em versão social: o modelo capturou o processo de coleta em vez do fenômeno. E a decisão de lançar ou não **não é técnica** — é a mesma lição da seção "De onde isto veio": alguém precisa dizer quanto custa cada erro, e aqui o custo recai sobre pessoas que não estão na sala.
> **volte para:** #a-decisao-de-nao-lancar
:::

:::exercicio {"id":"do-modelo-a-decisao-e11","tipo":"multipla-multi","objetivo":"O4","dificuldade":"facil"}
Quais motivos, segundo esta seção, bastam para recusar um modelo que **passa** nas métricas? (marque todos que valem)

- [x] O ganho não paga o custo de manter.
- [x] O desempenho é bom no geral e ruim num subgrupo que importa.
- [x] Ninguém consegue explicar uma decisão individual quando ela for contestada.
- [x] Não há como monitorar o modelo depois de implantado.
- [ ] A equipe preferia outra família de modelo.

> **gabarito:** custo de manutenção · subgrupo ruim · decisão inexplicável · impossível monitorar
> **porque:** Os quatro são motivos suficientes, e nenhum deles aparece na métrica que o modelo passou. É essa a razão de a seção existir: métrica boa é condição necessária e não suficiente para lançar.
>
> A alternativa errada não é um critério, é uma preferência — e é justamente contra esse tipo de argumento que a seção exige o mesmo aparato do lançamento: números, protocolo e critério explícito.
>
> A frase que fecha vale guardar: "não vamos lançar" com evidência é trabalho concluído, não trabalho perdido.
> **volte para:** #a-decisao-de-nao-lancar
:::

:::exercicio {"id":"do-modelo-a-decisao-e12","tipo":"multipla","objetivo":"O4","dificuldade":"dificil"}
Uma equipe decide não lançar e é cobrada em reunião: "vocês passaram três meses e não entregaram nada". Qual resposta é coerente com esta seção?

- [ ] Reconhecer que o projeto falhou e propor recomeçar com outra abordagem.
- [x] Apresentar a recusa com o mesmo aparato de um lançamento (números, protocolo e critério explícito), porque a decisão fundamentada é a entrega.
- [ ] Lançar em escopo reduzido, para mostrar resultado.
- [ ] Adiar a decisão até obter mais dados, sem se comprometer.

> **gabarito:** apresentar a recusa com o mesmo aparato de um lançamento
> **porque:** A seção é explícita: defender a recusa exige exatamente o que defender o lançamento exigiria. Uma recusa fundamentada informa a empresa sobre o que não funciona e por quê, e isso tem valor — o que não tem valor é uma recusa sem evidência, que é indistinguível de desistência.
>
> A terceira alternativa é a mais perigosa porque parece pragmática. Lançar em escopo reduzido para mostrar resultado inverte a ordem: o escopo passa a ser escolhido pela necessidade política de entregar, e não pelo que o modelo sustenta. Se o escopo reduzido for defensável pelos próprios critérios, ele já teria sido a recomendação.
>
> A quarta troca decisão por adiamento e mantém o custo correndo sem nenhum critério declarado para encerrar.
> **volte para:** #a-decisao-de-nao-lancar
:::

## Síntese — o que levar

- O modelo entrega **ordenação**; a decisão exige **um corte**, e o corte exige **um preço**. Sem a matriz de custo, não existe limiar certo.
- **Probabilidade ordena, custo decide.** Pode ser ótimo agir como se a classe menos provável fosse verdadeira.
- O limiar **não é uma decisão técnica**. Quem escolhe calado está decidindo pela área de negócio sem avisar.
- Comparação justa: mesma divisão, mesmo orçamento de busca, métrica escolhida **antes**.
- Diferença sem intervalo é ruído com aparência de resultado. **Bootstrap pareado**, e empate é um achado.
- Empate em desempenho **liberta** a decisão para custo, latência e explicabilidade.
- Contabilize em **benefício**, não em custo: benefício tem linha de base natural.
- **Não lançar é uma decisão legítima**, e exige a mesma evidência de lançar.

:::exercicio {"id":"do-modelo-a-decisao-e4","tipo":"aberta","objetivo":"O3","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Seu modelo novo teve AUC de 0,91 contra 0,89 do atual, e a diferença **não** é maior que o ruído: os intervalos se sobrepõem. Você tem cinco minutos com a diretoria, que quer saber se troca ou não.

Escreva o que você diria. A dificuldade é dupla: comunicar um empate estatístico a quem espera um vencedor, **sem** esconder a incerteza e **sem** transformar a conversa numa aula de estatística.

> **rubrica:** comunica o resultado em consequência, não em métrica — o que muda no número de casos encontrados ou perdidos por período, e não "AUC de 0,91";
> diz com todas as letras que a diferença **não se distingue do ruído**, e traduz isso em linguagem de decisão ("os dois modelos são indistinguíveis com o que medimos") em vez de omitir ou de expor o intervalo de confiança como se fosse autoexplicativo;
> desloca a decisão para os critérios que **de fato** desempatam quando o desempenho empata (custo de operação, complexidade, interpretabilidade, esforço de manutenção, risco de mudança) e recomenda um caminho, em vez de devolver a dúvida para a mesa;
> não vende o empate como vitória ("o novo é melhor") nem se refugia no tecnicismo ("estatisticamente inconclusivo") para não recomendar nada
> **porque:** O quarto critério é o exercício inteiro, porque existem duas maneiras de trair o rigor e elas parecem opostas. **Arredondar para vitória**, dizendo "o novo deu 0,91 contra 0,89", é a mentira por omissão que a diretoria não tem como detectar. **Refugiar-se no "inconclusivo"** parece honestidade, e é a outra falha: quem tem os dados e não recomenda transferiu a decisão para quem tem menos informação do que você.
>
> A saída é a que o capítulo vinha construindo: quando o desempenho empata, **a decisão não é de desempenho**. Ela passa a ser de custo, de risco e de operação — e essas são exatamente as perguntas que a diretoria sabe responder melhor do que você. Comunicar o empate direito é o que devolve a decisão para o lugar certo, com a informação certa.
>
> Repare no que **não** entra em cinco minutos: a divisão, a busca de hiperparâmetros, o teste usado para o intervalo. Nada disso é escondido — está no relatório, na parte de protocolo. Adaptar é escolher o que cabe, e a incerteza cabe sempre; o método, quase nunca.
> **volte para:** #apresentar-sem-trair-o-rigor
:::

## Verificação

1. Um colega diz que o limiar padrão é 0,5 porque "é o meio". Em que situação isso é defensável, e por que quase nunca é o caso?
2. Dois modelos empatam dentro do intervalo de confiança. Liste três critérios que você usaria para decidir, e diga qual pesaria mais no seu contexto.
3. A área de negócio se recusa a estimar o custo de um falso negativo, dizendo que "é impossível colocar preço nisso". O que você faz — e por que aceitar o silêncio é a pior opção?

> Estas três não são corrigidas, e a omissão é deliberada: as três se ganham numa conversa, e a terceira, em particular, depende de quem está do outro lado da mesa.
