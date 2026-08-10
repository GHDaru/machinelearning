# 25 — Do Modelo à Decisão

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

Na Inglaterra, **Patrick Blackett** monta em **agosto de 1940**, no Anti-Aircraft Command, um grupo de sete cientistas — físicos, um astrônomo, um fisiologista, um matemático — apelidado **"Blackett's Circus"**. Em março de 1941 repete a receita no Coastal Command, contra os submarinos alemães. Nos Estados Unidos, o **Statistical Research Group** reúne em Columbia, no verão de 1942, gente como **Wald, Savage, Friedman e Hotelling** para decidir blindagem de bombardeiro, mistura de munição e regras de inspeção por amostragem.

**O que se fazia antes.** Decisão de comando por experiência e hierarquia. E, do lado da estatística, dois problemas tratados separadamente e **sem preço**: estimar um parâmetro e testar uma hipótese.

**A virada.** Abraham Wald mostra, em **1939**, que estimar e testar são **casos particulares de um mesmo problema: decidir**. E para isso ele precisa de algo que a estatística clássica não tinha — uma **função que diz quanto custa errar**. Erro deixa de ser categoria lógica (certo/errado) e vira **grandeza econômica**.

**A ideia reaproveitável.** **Pode ser ótimo agir como se uma classe fosse verdadeira mesmo quando a outra é mais provável.** Charles Elkan dá o exemplo perfeito: pode ser racional **não** aprovar uma transação alta de cartão *mesmo que ela seja provavelmente legítima* — porque o prejuízo da fraude rara supera o incômodo do bloqueio frequente. **Probabilidade ordena; custo decide.** Um modelo que devolve só probabilidade não terminou o trabalho.

**O nome.** *Operational research* no Reino Unido, *operations research* nos Estados Unidos — a diferença de nome guarda a diferença de origem. Já **"análise de decisão"** é cunhada só em **1966**, por **Ronald Howard**, e o detalhe é saboroso: o nome do campo nasce **dentro** de uma conferência de Pesquisa Operacional.

> ### O capítulo 04 e este são a mesma história, cortada em dois
>
> Blackett entrou em **1934** no comitê Tizard, cuja marca foi justamente **supervisionar o desenvolvimento do radar** antes da guerra. Só depois, em 1940, montou o Circus.
>
> **A mesma pessoa, no mesmo comitê, diante do mesmo problema.** Chegou o sinal — o que se faz com ele? O [capítulo 04](04-avaliacao.md) conta o lado do **botão de ganho**: onde pôr o limiar, e como a curva ROC mapeia essa troca. Este conta o lado do **comando**: quanto custa cada erro, e quem tem autoridade para dizer isso.
>
> **O limiar do capítulo 04 é a matriz de custo deste capítulo vista de perfil.**

### A matriz de custo, e o erro que atravessou décadas

Aqui está o achado mais útil — e mais desconfortável — desta seção.

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
| 📖 | A leitura de que os capítulos 04 e 25 são uma história só, e de que o limiar é a matriz de custo vista de perfil |

## Fundamentos: comparar duas técnicas sem se enganar

Comparação justa tem três exigências, e violar qualquer uma invalida o resultado.

**1. O mesmo dado, na mesma divisão.** Se o modelo A foi avaliado numa divisão e o B em outra, você comparou as divisões, não os modelos. Fixe a *seed* e reutilize exatamente os mesmos conjuntos.

**2. O mesmo orçamento de busca.** Comparar um modelo com hiperparâmetros ajustados por cem tentativas contra outro com valores de fábrica não é comparação, é encenação. Ou os dois recebem busca, ou nenhum recebe.

**3. A mesma métrica, escolhida antes.** Escolher a métrica **depois** de ver os resultados é a forma mais comum e mais inocente de trapaça — você acaba selecionando a régua que favorece o modelo que já preferia.

### A diferença é maior que o ruído?

Modelo A dá 0,913 e modelo B dá 0,907. A é melhor?

Provavelmente **você não sabe**. Métrica calculada num conjunto de teste é uma **estimativa**, e estimativa tem incerteza — como o [capítulo 04](04-avaliacao.md) mostrou. Com 500 exemplos de teste, uma diferença de 0,006 costuma estar dentro do ruído.

O procedimento honesto é o **bootstrap pareado**: reamostre o conjunto de teste com reposição, recalcule a métrica dos **dois** modelos na mesma reamostragem, e guarde a diferença. Repita mil vezes. Se o intervalo das diferenças cruza o zero, **os modelos empataram** — e dizer isso é um resultado, não um fracasso.

O detalhe que faz o método funcionar é o *pareado*: avaliar os dois na **mesma** reamostragem cancela a variação que vem do conjunto e isola a que vem do modelo.

:::exercicio {"id":"25-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
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

**Probabilidade mal calibrada estraga tudo.** O cálculo do limiar ótimo pressupõe que 0,7 signifique 70%. Ensembles costumam não cumprir isso — ver [capítulo 04](04-avaliacao.md). Calibre antes de contabilizar.

:::exercicio {"id":"25-e2","tipo":"numerica","objetivo":"O2","dificuldade":"media"}
Um modelo prevê inadimplência. Aprovar um cliente **bom** dá lucro de **R$ 200**. Aprovar um cliente **mau** dá prejuízo de **R$ 1 000**. Negar não gera lucro nem prejuízo (R$ 0), qualquer que seja o cliente.

Acima de qual **probabilidade de inadimplência** vale mais negar do que aprovar? Responda em fração, com duas casas decimais.

> **gabarito:** 0,17
> **porque:** Chame de *p* a probabilidade de o cliente ser mau. Aprovar tem valor esperado `200 × (1 − p) − 1000 × p`; negar tem valor esperado **0**. O ponto de indiferença é onde os dois se igualam: `200 − 200p − 1000p = 0`, ou seja `200 = 1200p`, então `p = 1/6 ≈ 0,1667` — **0,17** arredondado.
>
> Repare no que acabou de acontecer: o limiar **não é 0,5**. E não é por causa de desequilíbrio de classes — é porque **os erros custam preços diferentes**. Um mau cliente destrói o lucro de cinco bons, então a régua se desloca para o lado cauteloso.
>
> Este é o cálculo que responde a pergunta da diretora lá do início do capítulo. Note também que ele **não usou a AUC**: a AUC serve para escolher o modelo; a matriz de custo serve para operá-lo.
> **volte para:** #da-metrica-ao-dinheiro
:::

## Apresentar sem trair o rigor

O relatório mínimo tem seis partes, nesta ordem: **problema** (a decisão que se quer apoiar), **dados** (origem, período, tamanho, o que foi excluído e por quê), **protocolo** (divisão, busca, métrica escolhida antes), **resultado** (com incerteza), **limitações** (onde o modelo não vale) e **recomendação**.

A parte que quase todo mundo corta é a de **limitações** — e é a que constrói confiança. Um relatório que declara onde o modelo falha é levado mais a sério que um que só apresenta vitórias, porque o leitor entende que alguém procurou.

Três regras para a conversa com quem não é técnico:

- **Fale em consequência, não em métrica.** Não "AUC de 0,91", e sim "entre os 10% que o modelo mais suspeita, encontramos 6 de cada 10 fraudes do período".
- **Nunca prometa o número do teste como se fosse o de produção.** O dado de produção difere; diga isso antes que a realidade diga.
- **Traga o cenário do erro.** Quem decide precisa saber como é um dia ruim, não só o dia médio.

### A decisão de não lançar

É uma decisão legítima e frequentemente a certa. Motivos suficientes para recusar um modelo que passa nas métricas:

o ganho não paga o custo de manter; o desempenho é bom no geral e **ruim num subgrupo que importa** (ver [capítulo 14](14-interpretabilidade-justica.md)); ninguém consegue explicar uma decisão individual quando for contestada; ou não há como monitorar o modelo depois de implantado (ver [capítulo 16](16-mlops.md)).

Defender essa recusa exige exatamente o mesmo aparato de defender o lançamento: números, protocolo e critério explícito. **"Não vamos lançar" com evidência é trabalho concluído**, não trabalho perdido.

:::exercicio {"id":"25-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"media"}
Seu modelo de triagem de currículos alcança 0,89 de AUC no conjunto de teste, bem acima da triagem manual atual. Ao segmentar o resultado, você descobre que o desempenho é **0,91 para candidatos formados nas cinco universidades mais frequentes na base histórica** e **0,63 para os demais**.

Escreva a recomendação que você levaria à diretoria — incluindo o que você recomenda fazer e por quê.

> **rubrica:** identifica que a média de 0,89 esconde um desempenho ruim num subgrupo;
> reconhece que o subgrupo pior corresponde a quem já era minoria na base histórica, o que caracteriza aprendizado do processo de seleção passado e não da competência dos candidatos;
> NÃO recomenda lançar como está;
> propõe ao menos uma ação concreta — reponderar/coletar dados do subgrupo, usar o modelo só como apoio com revisão humana, ou restringir o escopo declarando a limitação;
> menciona a consequência para pessoas reais, não só a métrica
> **porque:** A resposta fraca compara 0,89 com a triagem manual e recomenda lançar. A resposta forte percebe que **a média esconde a decisão**: para 0,63 de AUC o modelo está perto do acaso, e "perto do acaso" aplicado a currículos significa descartar gente por sorteio — enquanto a empresa acredita estar usando um sistema de 0,89.
>
> O ponto mais fino, e o que separa uma boa resposta de uma excelente: o modelo provavelmente **não está errado sobre os dados** — ele aprendeu corretamente um padrão que existe no histórico. Aprendeu **quem a empresa costumava contratar**. É exatamente o vazamento do [capítulo 02](02-dados.md) em versão social: o modelo capturou o processo de coleta em vez do fenômeno. E a decisão de lançar ou não **não é técnica** — é a mesma lição da seção "De onde isto veio": alguém precisa dizer quanto custa cada erro, e aqui o custo recai sobre pessoas que não estão na sala.
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

## Verificação

1. Um colega diz que o limiar padrão é 0,5 porque "é o meio". Em que situação isso é defensável, e por que quase nunca é o caso?
2. Dois modelos empatam dentro do intervalo de confiança. Liste três critérios que você usaria para decidir, e diga qual pesaria mais no seu contexto.
3. A área de negócio se recusa a estimar o custo de um falso negativo, dizendo que "é impossível colocar preço nisso". O que você faz — e por que aceitar o silêncio é a pior opção?
