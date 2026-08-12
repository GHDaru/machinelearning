# IV.3 — IA Simbólica, Fuzzy e Evolutiva

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Distinguir os paradigmas simbólico, conexionista, evolutivo e estatístico.
- **O2.** Representar conhecimento em regras e explicar o encadeamento da inferência.
- **O3.** Modelar incerteza linguística com conjuntos nebulosos.
- **O4.** Aplicar um algoritmo genético a um problema de otimização e reconhecer seus limites.

## O problema: nem todo problema de IA é um problema de aprendizado

Uma equipe precisa decidir se um lote de produção segue ou para. Tem **41 lotes rotulados** de histórico, um regulador que exige justificativa por escrito para cada reprovação, e três engenheiros que fazem essa chamada há vinte anos sem errar feio.

A equipe faz o que aprendeu a fazer: treina um ensemble. Sai 0,88 de AUC na validação cruzada — em 41 exemplos, um número que não significa quase nada. Ninguém consegue explicar uma decisão individual. O regulador recusa. E os vinte anos de experiência dos três engenheiros, que era o ativo mais valioso da sala, não entrou em lugar nenhum.

O erro não foi técnico. Foi de **enquadramento**: supor que "usar IA" significa "ajustar um modelo a dados". Havia conhecimento, e ele estava na cabeça de gente; havia um predicado vago ("a peça está muito fora do padrão") esperando ser modelado; havia uma estrutura causal conhecida do processo. Três coisas que aprendizado supervisionado não usa — e que quatro tradições da IA foram construídas justamente para usar.

Este capítulo é o panorama dessas quatro tradições. Cada uma nasceu de um aperto que dado nenhum resolve: **provar um teorema sem busca cega** · **decidir com um predicado vago** — "a água está quente" não tem limiar · **otimizar uma forma física sem derivada** · **raciocinar sob incerteza sem explodir a tabela conjunta**. 📖

## De onde isto veio

São quatro linhagens, quatro apertos, quatro viradas. Vale ler as quatro mini-histórias antes de olhar para o que elas têm em comum — porque o que elas têm em comum é a lição do capítulo, e ela não aparece se você ler só uma.

**1. A simbólica — provar teorema sem busca cega.** Allen Newell, **John Clifford Shaw** e Herbert Simon, meados dos anos 1950. O terceiro nome quase sempre some das citações, e some porque Shaw era o programador; registre-o. O aperto: uma prova de lógica é uma sequência de aplicações de regras, e o número de sequências possíveis explode antes do quinto passo. **A virada** foi escrever o problema como *estado, operadores e uma heurística que poda* — buscar guiado em vez de buscar tudo. O **Logic Theorist** provou 38 dos 52 primeiros teoremas do capítulo 2 do *Principia Mathematica* e, para o teorema **2.85**, achou uma prova **mais curta** que a de Whitehead e Russell ⏳. Foi demonstrado em Dartmouth, no verão de 1956 ✓ᵐ. Conta-se que o *Journal of Symbolic Logic* teria recusado publicar um artigo coautorado por um programa ⏳ — anedota excelente e fonte fraca, exatamente o tipo de coisa que este capítulo pede para você tratar com ceticismo.

Depois vieram os sistemas especialistas de verdade: **DENDRAL** (Stanford, a partir de 1965), que inferia estrutura química a partir de espectro de massa, e **MYCIN** (Shortliffe, 1972–76), que diagnosticava infecção bacteriana **no nível de um especialista humano** e **nunca foi usado clinicamente** ⏳. O mercado de máquinas LISP evaporou em **1987** ⏳.

> **A ideia reaproveitável do colapso, e ela é dura.** O que matou aquele mercado **não foi a IA falhar** — foi o hardware genérico alcançar o especializado. Workstations comuns passaram a rodar LISP mais barato que máquinas feitas para isso. A aposta perdida foi de **arquitetura**, não de método. Toda vez que você amarra um resultado técnico a um substrato especializado, está fazendo essa mesma aposta. 📖

**2. A fuzzy — decidir com predicado vago.** Lotfi Zadeh, "Fuzzy Sets", *Information and Control* **8**, 338–353, **1965** ✓ᵐ. O aperto é de uma banalidade desconcertante: "a água está quente" é uma frase que qualquer pessoa entende e que nenhum limiar reproduz. A 49 °C está quente e a 50 °C também; não existe o grau em que a água *vira* quente. **A virada** foi abandonar a pergunta "pertence ou não pertence?" e substituí-la por "pertence **quanto**?". O nome foi uma escolha ruim, e Zadeh sabia: *fuzzy* é pejorativo em inglês, e a palavra custou uma década de recepção ⏳. A partir de **1968** começam a chegar cartas do Japão; em **1987**, o metrô de **Sendai**, linha Namboku, entra em operação com controle fuzzy de aceleração e frenagem ⏳.

**3. A evolutiva — otimizar forma física sem derivada.** Três origens independentes, três continentes, cerca de **25 anos sem que soubessem umas das outras** ⏳: os *genetic algorithms* de **Holland** em Ann Arbor (1962; livro *Adaptation in Natural and Artificial Systems*, 1975), o *evolutionary programming* de **Fogel** em San Diego (1962; livro em 1966) e as *evolution strategies* de **Bienert, Rechenberg e Schwefel** na TU Berlin (por volta de 1965). O aperto de Rechenberg é o mais concreto do capítulo: encontrar a forma de **mínimo arrasto** em túnel de vento. Não há função para derivar — há uma peça de metal e um medidor. **A virada** foi tratar variação aleatória mais seleção como um método de busca, e não como uma metáfora biológica.

**4. As bayesianas — raciocinar sob incerteza sem explodir a tabela conjunta.** Judea Pearl, "Bayesian Networks: A Model of Self-Activated Memory for Evidential Reasoning", relatório técnico **CSD-850017** da UCLA, apresentado na Cognitive Science Society em **abril de 1985** ✓ᵐ — é ali que o termo aparece. Livro em 1988; Prêmio Turing em 2011. O aperto: a distribuição conjunta de *n* variáveis binárias exige 2ⁿ − 1 números. Com 30 variáveis, mais de um bilhão. **A virada** foi perceber que quase todos esses números são redundantes, porque a maioria das variáveis é **condicionalmente independente** das demais — e que essa independência pode ser *desenhada*, como um grafo. Em 1985, falar de probabilidade dentro da IA era estar **fora do mainstream** ⏳.

**A ideia reaproveitável, e é uma só para as quatro.** **A representação escolhida decide qual busca é possível.** Nenhuma das quatro tradições inventou um otimizador melhor. Cada uma inventou uma **forma de escrever o problema** que tornou a busca tratável: estado-e-operador tornou a prova buscável; o grau de pertinência tornou o predicado vago computável; a população tornou o espaço sem gradiente percorrível; o grafo de independências tornou a inferência probabilística viável. É a lição do [capítulo I.6](i-6-representacao.md) vista de outro ângulo — lá, a representação decide o que o modelo consegue aprender; aqui, decide o que o algoritmo consegue procurar. 📖

> ### A rejeição tem geografia
>
> Duas das quatro histórias terminam com a mesma forma. A lógica fuzzy foi hostilizada no Ocidente — em boa parte **por causa da palavra** — e adotada industrialmente no Japão. Pearl estava fora do mainstream da IA em 1985 e recebeu o Turing 22 anos depois. Ambos venceram **por fora**.
>
> **A comunidade que rejeita uma ideia raramente é a que a reabilita.** Isso não é consolo para quem tem uma ideia rejeitada; é uma instrução de busca. Se o seu método não anda, a pergunta útil talvez não seja "como convenço esta sala?", e sim "qual é a sala em que este método é obviamente útil?".
>
> **Repare no relógio: 22 anos e um oceano.** De Zadeh (1965) a Sendai (1987) foram 22 anos **e uma mudança de continente**. Compare com os 43 anos do [capítulo II.7](ii-7-series-temporais.md), os 59 do [03](i-6-representacao.md) e os cerca de 80 do [13](iv-2-reforco.md). O atraso aqui é curto para o padrão do livro — o que custou tempo não foi formular a ideia nem construir a ferramenta, foi **encontrar quem quisesse ouvir**. 📖

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ⏳ | Logic Theorist: 38 dos 52 primeiros teoremas do capítulo 2 do *Principia Mathematica*, e a prova mais curta para o teorema 2.85 |
| ✓ᵐ | A demonstração do Logic Theorist em Dartmouth, verão de 1956 |
| ⏳ | A recusa atribuída ao *Journal of Symbolic Logic* a um artigo coautorado por um programa |
| ⏳ | DENDRAL em Stanford a partir de 1965; MYCIN (Shortliffe, 1972–76) no nível de especialista e nunca usado clinicamente |
| ⏳ | O colapso de 1987 do mercado de máquinas LISP diante de workstations genéricas |
| ✓ᵐ | Zadeh, *Fuzzy Sets*, **Information and Control** 8, 338–353 (1965). **Metadados conferidos; não lido** |
| ⏳ | O nome *fuzzy* como escolha ruim e a década de recepção perdida; a frase de Zadeh sobre o conselho editorial (só em fontes secundárias) |
| ⏳ | As cartas do Japão a partir de 1968 e o metrô de Sendai (linha Namboku) com controle fuzzy em operação em 1987 |
| ⏳ | As três origens independentes da computação evolutiva e os ~25 anos de desconhecimento mútuo — Holland (1962/1975), Fogel (1962/1966), Bienert–Rechenberg–Schwefel (~1965) |
| ✓ᵐ | Pearl, *Bayesian Networks…*, UCLA TR CSD-850017, Cognitive Science Society, abril de 1985; livro em 1988; Turing em 2011. **Metadados conferidos; não lido** |
| ⏳ | Probabilidade como posição fora do mainstream da IA em 1985 |
| 📖 | A ideia reaproveitável geral; a leitura do colapso de 1987 como aposta de arquitetura; "a rejeição tem geografia"; a comparação de relógios |

## Simbólica: a base de conhecimento e o motor de inferência

A arquitetura é uma separação, e é essa separação que dá o nome ao paradigma. De um lado, a **base de conhecimento**: fatos e regras do tipo *SE — ENTÃO*, escritas em linguagem que uma pessoa lê. De outro, o **motor de inferência**: um procedimento genérico, sem nenhum compromisso com o domínio, que combina as regras.

Duas direções de encadeamento:

| Direção | Como funciona | Quando serve |
|---|---|---|
| **Para a frente** (*forward chaining*) | parte dos fatos conhecidos e dispara toda regra cuja condição foi satisfeita, gerando fatos novos | monitoramento, alarme, configuração — chega um dado, o que ele implica? |
| **Para trás** (*backward chaining*) | parte de uma hipótese e procura as regras que a sustentam, perguntando pelo que falta | diagnóstico — quero saber se é isto, o que preciso medir? |

O encadeamento para trás dá de graça a coisa que o resto do livro custa caro para obter: a **explicação**. O rastro de regras que sustentou a conclusão *é* a justificativa, na mesma linguagem em que o especialista fala. Compare com o esforço do [capítulo V.1](v-1-interpretabilidade-justica.md) para extrair explicação aproximada de um modelo que não a produz.

E aqui está o gargalo que derrubou a promessa comercial da década de 1980: **a aquisição do conhecimento**. Escrever a base exige um engenheiro de conhecimento entrevistando um especialista — e o especialista decide bem sem conseguir enunciar as regras que usa. O motor era a parte fácil. Enquanto isso, este era o paradigma dominante da IA: as tradições deste capítulo ocuparam justamente o vazio deixado pelo inverno conexionista do [capítulo III.1](iii-1-neuronio-artificial.md).

:::exercicio {"id":"ia-simbolica-fuzzy-evolutiva-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Sua empresa quer transformar em sistema especialista o conhecimento de três engenheiros veteranos que aprovam ou reprovam lotes de produção. Onde está o gargalo real do projeto?

- [ ] Na velocidade do motor de inferência, que precisará percorrer milhares de regras a cada consulta.
- [x] Na aquisição do conhecimento: os engenheiros decidem bem sem conseguir enunciar as regras que usam.
- [ ] Na falta de exemplos rotulados suficientes para treinar a base de regras.
- [ ] Na ausência de uma linguagem formal capaz de representar regras SE — ENTÃO.

> **gabarito:** Na aquisição do conhecimento — extrair do especialista as regras que ele aplica sem verbalizar
> **porque:** O motor de inferência é **genérico e resolvido**: o mesmo procedimento serve para diagnóstico médico e para controle de caldeira, e milhares de regras não são um problema computacional relevante. A linguagem de regras também existe desde os anos 1970. O que trava é humano — a competência de um especialista é em boa parte tácita, e o trabalho de destilá-la em regras explícitas é lento, caro e precisa ser refeito quando o processo muda.
>
> A terceira alternativa captura o mal-entendido mais comum de quem chega ao assunto vindo de aprendizado de máquina: **a base de regras não é treinada, é escrita**. É exatamente por isso que este paradigma funciona com 41 lotes de histórico — ele não usa os 41 para aprender a regra, usa-os para **testar** a regra que uma pessoa escreveu.
> **volte para:** #simbolica-a-base-de-conhecimento-e-o-motor-de-inferencia
:::

## Fuzzy: o grau entre o sim e o não

Num conjunto clássico, a pertinência é 0 ou 1: o elemento está dentro ou está fora. Num **conjunto fuzzy**, a pertinência é um número **entre 0 e 1** — 46 °C pertence ao conjunto "água quente" com grau 0,8, e ao conjunto "água morna" com grau 0,3. Os graus não precisam somar 1, e essa é a primeira pista de que **isto não é probabilidade**.

A distinção vale ser dita com todas as letras, porque quase todo mundo confunde: probabilidade mede **incerteza sobre um fato nítido** (não sei se a água está acima de 50 °C, e depois de medir saberei); pertinência mede **vagueza do próprio predicado** (sei exatamente que são 46 °C, e "quente" continua sendo uma questão de grau). Medir mais elimina a incerteza; não elimina a vagueza.

Sobre isso se constrói a **variável linguística**: "temperatura" deixa de ser um número e passa a ser uma variável cujos valores são *fria*, *morna*, *quente*, *muito quente* — cada um definido por uma função de pertinência, tipicamente triangular ou trapezoidal. E daí sai o **controlador fuzzy**, em três passos: **fuzzificar** (o sensor lê 46 °C → graus de pertinência em cada termo), **avaliar as regras** (*SE a temperatura é quente E a variação é pequena, ENTÃO reduza a potência um pouco*, com todas as regras disparando parcialmente, cada uma com a força do seu grau), e **defuzzificar** (agregar as saídas parciais num único número — a potência a aplicar).

O ganho de engenharia é que as regras são escritas na linguagem do operador da máquina, não na do teórico de controle. Foi isso que a linha Namboku pôs para andar: um controle de frenagem que o técnico de manutenção consegue ler.

:::exercicio {"id":"ia-simbolica-fuzzy-evolutiva-e2","tipo":"numerica","objetivo":"O3","dificuldade":"media"}
O termo linguístico **"água quente"** é definido por uma função de pertinência **triangular**: pertinência **0** em 30 °C, **1** em 50 °C e **0** em 70 °C, com variação linear entre esses pontos.

Qual é o grau de pertinência de uma leitura de **44 °C** ao conjunto "água quente"? Responda com duas casas decimais.

> **gabarito:** 0,70
> **porque:** 44 °C está no ramo **ascendente** do triângulo, entre 30 °C (grau 0) e 50 °C (grau 1). A interpolação linear é `(44 − 30) / (50 − 30) = 14 / 20 = 0,70`.
>
> Dois pontos que o cálculo torna concretos. Primeiro: **não há limiar**. A 43 °C o grau seria 0,65, a 45 °C seria 0,75 — nada "vira" quente em lugar nenhum, que era exatamente o aperto de Zadeh. Segundo: esse 0,70 **não é uma probabilidade de 70%** de a água estar quente. A temperatura é conhecida com certeza; o que é parcial é a aplicação da palavra. A mesma leitura de 44 °C pode ter grau 0,45 em "morna" ao mesmo tempo, e a soma passar de 1 sem que nada esteja errado.
> **volte para:** #fuzzy-o-grau-entre-o-sim-e-o-nao
:::

## Evolutiva: buscar onde não existe gradiente

Um algoritmo genético mantém uma **população** de soluções candidatas, cada uma codificada como uma sequência. A cada geração: avalia cada candidata com uma **função de aptidão**, **seleciona** as melhores com alguma aleatoriedade, gera filhas por **cruzamento** (combinar pedaços de duas candidatas) e **mutação** (perturbar uma), e repete. Não há derivada em lugar nenhum — só avaliação, comparação e variação.

Isso delimita bem quando vale a pena. **Vale** quando o espaço de busca não tem gradiente utilizável: variáveis discretas, problemas combinatórios (roteamento, escalonamento, seleção de atributos), funções com muitos ótimos locais, ou uma função de aptidão que é uma **caixa-preta** — um simulador, um jogo, ou, como em Rechenberg, um túnel de vento com uma peça de metal dentro. **Não vale** quando existe gradiente: se você pode derivar, derive; o [capítulo II.4](ii-4-otimizacao.md) faz em minutos o que uma população levaria horas para tatear.

Os dois custos a declarar antes de começar: o algoritmo genético **não dá garantia de ótimo** e é **caro em número de avaliações** — se cada avaliação é um ensaio físico ou uma simulação de dez minutos, a conta é o projeto inteiro. E ele traz um punhado de hiperparâmetros próprios (tamanho da população, taxa de mutação, pressão de seleção) que precisam ser ajustados por fora, o que é irônico: um método de busca que exige uma busca para ser configurado.

## Bayesianas: a incerteza com estrutura

Uma **rede bayesiana** tem duas peças: um **grafo dirigido acíclico**, em que cada nó é uma variável e cada seta é uma dependência direta, e uma **tabela de probabilidade condicional** por nó, dizendo a distribuição daquela variável dados os valores de seus pais. Só isso. As independências que o grafo declara são o que dispensa os outros bilhões de números da tabela conjunta.

O que essa estrutura permite, e uma rede neural do [capítulo III.2](iii-2-redes-neurais.md) não permite:

- **Inferência em qualquer direção.** A mesma rede que calcula "dada a doença, qual a chance deste sintoma?" responde "dado o sintoma, qual a chance da doença?". Uma rede neural treinada de entrada para saída faz um caminho só; para inverter, você treina outra.
- **Raciocínio sobre intervenção.** É diferente *observar* que o barômetro caiu e *forçar* o ponteiro do barômetro com a mão. O grafo distingue as duas coisas; um modelo que só aprendeu correlação, não.
- **Funcionar com variável faltando.** Não observou três das dez variáveis? A inferência simplesmente marginaliza sobre elas. Não é imputação, é a resposta correta dado o que se sabe.
- **Explicação estrutural.** O caminho de influência no grafo é a justificativa, e ela é a mesma que o especialista do domínio desenharia num quadro branco.

O preço: alguém precisa **escrever o grafo** — e voltamos ao gargalo da aquisição de conhecimento. Estruturas podem ser aprendidas de dados, mas isso exige muito mais dado do que a situação típica em que a rede bayesiana é a escolha certa.

## Por que estas tradições ainda importam

Três razões, e nenhuma delas é nostalgia.

**Interpretabilidade por construção.** Regras, graus de pertinência e grafos causais são legíveis porque foram **escritos para ser lidos** — a explicação não é extraída depois, ela é o próprio objeto. Onde há regulador, auditoria ou responsabilidade civil, isso muda o cálculo do projeto inteiro ([capítulo V.1](v-1-interpretabilidade-justica.md)).

**Funcionamento com pouco dado.** Um sistema de regras, um controlador fuzzy e uma rede bayesiana com estrutura desenhada por especialista funcionam com **zero** exemplos de treino — e usam o histórico disponível para o que ele de fato serve nesse regime: **testar**, não estimar. Aqueles 41 lotes do início do capítulo não davam para aprender; davam muito bem para avaliar.

**A fusão com aprendizado.** A direção mais viva hoje é **neuro-simbólica**: rede neural onde há dado e percepção, estrutura simbólica onde há regra e restrição — o modelo aprendido propõe, o componente simbólico verifica e recusa o que viola a regra. É também o padrão que ancora modelos de linguagem em ferramentas formais. 📖

:::exercicio {"id":"ia-simbolica-fuzzy-evolutiva-e3","tipo":"aberta","objetivo":"O1","pontos":3,"dificuldade":"dificil"}
Um hospital pede um sistema de apoio ao diagnóstico para uma doença rara. Há **60 casos confirmados** em dez anos de prontuários, um consenso clínico publicado que descreve quais fatores causam quais sintomas, e uma exigência do comitê de ética: **toda recomendação precisa vir acompanhada da justificativa clínica**.

Um colega propõe treinar uma rede neural com os 60 casos. Escreva a recomendação que você levaria à reunião, dizendo o que usar e por quê.

> **rubrica:** reconhece que 60 exemplos são insuficientes para treinar uma rede neural com qualquer confiança, e que a métrica obtida nesse regime seria ela própria pouco confiável;
> identifica que existe conhecimento estruturado disponível (o consenso clínico) que a rede neural não teria como usar;
> recomenda uma rede bayesiana com estrutura elicitada dos especialistas, ou um sistema baseado em regras, e não a rede neural;
> justifica pela explicabilidade por construção — o caminho no grafo ou o rastro de regras É a justificativa clínica exigida;
> menciona ao menos um uso legítimo dos 60 casos, como avaliar o sistema ou estimar tabelas de probabilidade condicional
> **porque:** A resposta fraca discute qual arquitetura de rede caberia em 60 exemplos. A resposta certa percebe que **a pergunta não é sobre arquitetura, é sobre onde está a informação**: ela está no consenso clínico publicado, não nos prontuários — e rede neural não tem por onde receber conhecimento que não venha em forma de exemplo.
>
> É a ideia reaproveitável do capítulo aplicada a uma decisão de projeto: **a representação escolhida decide qual busca é possível**. Escolher a rede neural é escolher procurar padrão em 60 pontos; escolher o grafo é escolher procurar a probabilidade que falta dentro de uma estrutura que já se sabe correta. E há o detalhe que fecha o caso: a exigência do comitê de ética **não é um requisito adicional a satisfazer depois**, é uma restrição sobre a representação. Numa rede bayesiana a justificativa sai de graça; numa rede neural ela seria uma aproximação construída à parte, defendida diante de gente que decide sobre a vida de pacientes.
>
> Um cuidado que a boa resposta menciona: os 60 casos não são inúteis. Servem para estimar algumas tabelas de probabilidade condicional e, sobretudo, para **avaliar** o sistema — o mesmo dado que é escasso demais para treinar pode ser suficiente para reprovar.
> **volte para:** #bayesianas-a-incerteza-com-estrutura
:::

## Síntese — o que levar

- **A representação escolhida decide qual busca é possível.** Nenhuma das quatro tradições inventou um otimizador melhor; cada uma inventou uma forma de **escrever o problema**. É o [capítulo I.6](i-6-representacao.md) visto do lado da busca.
- **Nem todo problema de IA é problema de aprendizado.** Quando a informação está na cabeça de um especialista, num consenso publicado ou numa estrutura causal conhecida, aprendizado supervisionado não tem por onde recebê-la.
- **Simbólica**: base de conhecimento separada do motor de inferência; encadeamento para a frente para monitorar, para trás para diagnosticar. Explicação de graça, e o gargalo é a **aquisição**.
- **Fuzzy**: pertinência entre 0 e 1 modela **vagueza**, não incerteza — e as duas não se confundem. Medir mais elimina incerteza; não elimina vagueza.
- **Evolutiva**: população, seleção, cruzamento, mutação e aptidão. Vale sem gradiente e em espaço combinatório; **não vale** quando você pode derivar.
- **Bayesiana**: grafo dirigido acíclico mais tabelas condicionais. Dá inferência em qualquer direção, raciocínio sobre intervenção e tolerância a variável faltando — coisas que uma rede neural não entrega.
- **A rejeição tem geografia.** A comunidade que rejeita uma ideia raramente é a que a reabilita. Se o método não anda, procure a sala certa antes de trocar o método.
- **Aposta de arquitetura não é aposta de método.** O colapso de 1987 não mediu a qualidade da IA simbólica; mediu a durabilidade de um hardware especializado.

## Verificação

1. Um colega afirma que "IA simbólica é IA antiga". Dê dois cenários concretos do seu contexto em que a escolha simbólica seria tecnicamente superior — e diga qual característica do cenário determina isso.
2. Explique, sem usar a palavra "probabilidade", a diferença entre dizer que uma leitura tem pertinência 0,7 ao conjunto "quente" e dizer que há 70% de chance de a água estar quente. Que decisão prática muda conforme a interpretação?
3. Você tem um problema de escalonamento com 40 tarefas e um simulador que leva 8 segundos por avaliação. Um algoritmo genético é candidato razoável? Estime a ordem de grandeza do custo, diga o que você mediria antes de decidir e qual linha de base o algoritmo precisaria bater.
