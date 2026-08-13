# III.6 — Modelos de Fundação e Generativos

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).
>
> ⏳ **Cláusula de expiração — leia antes de continuar.** Este é o capítulo que envelhece mais rápido do livro. O estado da arte aqui foi capturado em 2026-08; nomes de modelos, tamanhos, preços e recordes de *benchmark* mudam em meses, e por isso **este capítulo não cita nenhum**. Confira a data do cabeçalho antes de confiar em qualquer número que encontrar, inclusive nos que estão aqui. O que se pretende durável são as distinções estruturais: pré-treino contra adaptação, conhecimento nos pesos contra conhecimento recuperável.

## Objetivos de aprendizagem

- **O1.** Distinguir pré-treino, fine-tuning e uso via prompt quanto a custo e a dado necessário.
- **O2.** Usar embeddings para busca semântica e medir a melhora sobre a busca por termos.
- **O3.** Explicar RAG como decisão de arquitetura, e não como técnica de prompt.
- **O4.** Escolher entre fine-tuning e recuperação a partir da natureza do problema.

## O problema: cada tarefa de linguagem recomeçava do zero

Em 2018 havia uma assimetria constrangedora entre duas áreas vizinhas.

Em **visão computacional**, ninguém treinava do zero havia anos. Pegava-se uma rede já treinada num corpus grande de imagens e adaptava-se ao problema de casa. Em **processamento de linguagem**, não: **cada tarefa recomeçava do zero**. Classificar sentimento, extrair entidades, responder pergunta — cada uma exigia sua própria arquitetura, seu próprio corpus rotulado, seu próprio treino do início.

O gargalo não era a arquitetura nem a máquina. Era o **rótulo**. Rotular texto custa hora de gente, e a mesma empresa que tinha milhões de documentos tinha oitocentos exemplos rotulados — quando tinha.

## De onde isto veio

**O aperto.** Visão reaproveitava tudo; linguagem não reaproveitava quase nada. ✓ᵃ

**O que se fazia antes.** Reaproveitava-se **a camada de entrada**. Embeddings estáticos (um vetor fixo por palavra, aprendido em corpus grande) entravam como *feature*, e **todo o resto** era treinado por tarefa. Era transferência de vocabulário, não de modelo. ⏳

**A virada.** Transferir **o modelo inteiro**, não só a camada de entrada. Pré-treinar em texto cru, sem rótulo, e depois ajustar o mesmo modelo à tarefa. ✓ᵃ

**A ideia reaproveitável.** *Quando o dado rotulado é o gargalo, mude o que se reaproveita — não o algoritmo.* O salto de 2018 não veio de um otimizador melhor nem de uma camada nova: veio de trocar a **unidade de reuso**, da palavra para o modelo. Vale fora daqui: diante de escassez de rótulo, a primeira pergunta útil não é "que modelo uso?", é "o que já foi aprendido que eu posso não reaprender?". 📖

Duas peças concretas. O ULMFiT (Howard & Ruder, [arXiv:1801.06146](https://arxiv.org/abs/1801.06146), 18/01/2018) mostra o tamanho do ganho: **com 100 exemplos rotulados, iguala o desempenho de treinar do zero com 10 000**. ✓ᵃ E o BERT (2018) traz o objetivo de máscara, que é esconder palavras e pedir que o modelo as recupere. Na prática são **15% dos tokens**, sorteados a cada sequência.

A filiação está declarada pelos próprios autores, e não é leitura de terceiro: o objetivo é *"inspired by the Cloze task (Taylor, 1953)"*, e mais adiante eles reconhecem que o procedimento *"is often referred to as a Cloze task in the literature"*. A tarefa Cloze é de **Wilson L. Taylor**, publicada em 1953 no *Journalism Quarterly* como medida de legibilidade de texto jornalístico. Uma régua de redação virou função de perda **65 anos depois** — mais um caso do padrão que este livro persegue: o intervalo entre a ideia e o procedimento.

**As leis de escala.** Kaplan e colegas ([arXiv:2001.08361](https://arxiv.org/abs/2001.08361), 23/01/2020) mostram que a perda cai como **lei de potência** em tamanho de modelo, dado e computação, *"spanning more than seven orders of magnitude"* — e que **largura e profundidade têm efeito mínimo**. ✓ᵃ

> **A leitura deste livro (📖).** Isto é o **oposto** do [capítulo III.4](iii-4-visao.md). Lá, trinta anos de progresso vieram de arquitetura: convolução, *pooling*, conexão residual. A lei de escala diz que, passado certo ponto, **arquitetura é detalhe**. Duas verdades em capítulos vizinhos, e a segunda não apaga a primeira: ela vale num regime, o regime em que há computação e corpus para gastar. Fora dele, arquitetura continua decidindo.

### O nome, e a crítica que veio junto

O termo *foundation model* nasce de um relatório de **114 autores** do Stanford CRFM (Bommasani et al., [arXiv:2108.07258](https://arxiv.org/abs/2108.07258), 16/08/2021). ✓ᵃ Os autores explicam a escolha: chamam-nos assim *"to underscore their critically central yet **incomplete** character"* — centrais, e ainda assim incompletos. E o próprio resumo já traz a autocrítica: o paradigma *"incentivizes **homogenization**"*, e os defeitos do modelo-base *"are inherited by all adapted models downstream"*.

A objeção mais citada ao termo é atribuída a **Meredith Whittaker**: renomearam algo que já tinha nome — são modelos de linguagem grandes, e "fundação" embute uma promessa de solidez que o objeto não sustenta. **⏳ — a atribuição circula na imprensa especializada; não foi conferida em fala primária.**

> **A leitura deste livro (📖).** É a lição do caso OLAP, no [capítulo II.6](ii-6-analise-multidimensional.md): **quem batiza uma categoria decide o que ela herda de história e de crítica**. A diferença, e ela é a favor deste caso, é que aqui os autores **declararam a limitação no próprio resumo**, o oposto do relatório patrocinado de 1993.

O intervalo é a contra-prova do livro. Transformer em 2017; BERT e GPT em 2018. Cerca de **um ano**. Compare com 53 anos no [capítulo III.4](iii-4-visao.md), 59 no [capítulo I.6](i-6-representacao.md), 91 no [capítulo IV.2](iv-2-reforco.md). O [capítulo II.5](ii-5-arvores-ensembles.md) já apontava a primeira condição para o intervalo encurtar: **a precisão da pergunta**. Este caso acrescenta a segunda: **infraestrutura de reprodução compartilhada** (arXiv, código aberto, GPU comprável, benchmark comum). Com as duas presentes, o intervalo cai de décadas para meses. 📖

**Procedência das afirmações desta seção** (`✓ᵃ` = página do artigo aberta e **resumo lido**; o corpo, não):

| Selo | Afirmação |
|---|---|
| ✓ᵃ | O aperto de 2018: visão já não treinava do zero, linguagem recomeçava a cada tarefa; a virada é transferir o modelo inteiro |
| ✓ᵃ | ULMFiT (Howard & Ruder, arXiv:1801.06146, 18/01/2018): 100 exemplos rotulados igualam treino do zero com 10 000 |
| ✓ᵃ | Kaplan et al. (arXiv:2001.08361, 23/01/2020): perda em lei de potência, *"spanning more than seven orders of magnitude"*; largura e profundidade com efeito mínimo |
| ✓ᵃ | Lewis et al. (arXiv:2005.11401, 22/05/2020): *"their ability to access and precisely manipulate knowledge is still limited"*; separação entre memória paramétrica e não-paramétrica |
| ✓ᵃ | Bommasani et al. (arXiv:2108.07258, 16/08/2021, 114 autores): *"critically central yet incomplete"*, *"incentivizes homogenization"*, defeitos *"inherited by all adapted models downstream"* |
| ✓ᵐ | BERT (2018): ficha da obra |
| ✓ | Que o objetivo de máscara vem da tarefa Cloze, **declarado pelos autores do BERT**: *"inspired by the Cloze task (Taylor, 1953)"*, e o reconhecimento de que o procedimento *"is often referred to as a Cloze task in the literature"*. Dali também os **15%** de tokens mascarados — [arXiv:1810.04805](https://arxiv.org/abs/1810.04805), **lido** |
| ✓ᵐ | A ficha da tarefa Cloze: **Wilson L. Taylor**, *"'Cloze Procedure': A New Tool for Measuring Readability"*, *Journalism Quarterly* 30(4):415–433, 1953, [10.1177/107769905303000401](https://doi.org/10.1177/107769905303000401) |
| ⏳ | Embeddings estáticos como prática dominante de transferência antes de 2018 |
| ⏳ | A objeção de Meredith Whittaker ao termo *foundation model* — imprensa especializada, sem fala primária conferida |
| 📖 | A leitura de que as leis de escala contradizem o capítulo III.4 **dentro de um regime**, sem anulá-lo |
| 📖 | A leitura de que quem batiza a categoria decide o que ela herda — paralelo com o caso OLAP do capítulo II.6 |
| 📖 | A leitura do intervalo de ~1 ano como contra-prova: precisão da pergunta **mais** infraestrutura de reprodução compartilhada |

## Fundamentos: pré-treino auto-supervisionado e a palavra que muda de sentido

**Auto-supervisionado** é a palavra que resolve o gargalo do rótulo, e ela é mais simples do que parece: o rótulo é **extraído do próprio dado**. Esconda uma palavra e peça a palavra de volta; corte a frase e peça a continuação. Ninguém anotou nada, e ainda assim existe resposta certa para comparar. É supervisão sem anotador — e é isso que permite treinar em corpus da ordem da internet, onde rotular à mão seria impensável.

O que sai desse treino é uma **representação contextual**. A diferença em relação ao embedding estático do [capítulo I.6](i-6-representacao.md) é direta: no estático, *manga* tem **um** vetor, média confusa da fruta e da peça de roupa. No contextual, o vetor de *manga* é calculado **na frase em que a palavra aparece** — e "a manga estava madura" e "a manga da camisa rasgou" produzem vetores distantes. A mesma palavra deixa de ter um significado só.

Isso muda o que a busca semântica consegue fazer. Busca por termos acha documentos que **repetem a palavra**; busca por embedding acha documentos que **falam da mesma coisa** com outras palavras — e é o ganho que o [capítulo II.1](ii-1-avaliacao.md) exige que você **meça**, não presuma, contra a linha de base por termos.

:::exercicio {"id":"modelos-de-fundacao-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Uma equipe indexou 30 mil chamados de suporte com **embeddings estáticos** (um vetor fixo por palavra, somados por documento) para fazer busca semântica. A busca por "**manga quebrada na esteira**" devolve receitas de suco de fruta. Qual é o diagnóstico mais preciso?

- [ ] O índice é pequeno demais: com 30 mil documentos não há sinal suficiente para busca vetorial.
- [x] O embedding estático dá **um único vetor por palavra**, misturando os sentidos; sem contexto, "manga" carrega fruta e peça de roupa ao mesmo tempo.
- [ ] A busca vetorial não serve para termos técnicos — o caso pede busca por palavra-chave.
- [ ] Falta normalizar os vetores antes de calcular a similaridade do cosseno.

> **gabarito:** O embedding estático colapsa os sentidos da palavra num vetor só
> **porque:** O vetor estático é aprendido **antes** de existir a frase: ele é a média de todos os contextos em que a palavra apareceu no corpus de treino. Se o corpus tinha mais fruta que vestuário, "manga" fica perto de fruta e leva o documento inteiro junto. A representação contextual resolve isso por construção — o vetor é calculado **com a frase**, e as duas mangas ficam longe uma da outra.
>
> Sobre as erradas: **tamanho do índice** não é o problema — a mesma consulta erraria com 30 milhões de documentos, porque o erro está na representação, não na quantidade. **Voltar para palavra-chave** troca um problema por outro: a busca por termos não erraria a manga, mas perderia o chamado que diz "correia partida" sem usar nenhuma das suas palavras. E **normalizar** muda a escala da similaridade, não o sentido colapsado dentro do vetor.
> **volte para:** #fundamentos-pre-treino-auto-supervisionado-e-a-palavra-que-muda-de-sentido
:::

:::exercicio {"id":"modelos-de-fundacao-e5","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Qual é a diferença entre o que a busca por termos e a busca por embedding encontram?

- [ ] A busca por termos é mais rápida; a por embedding é mais precisa.
- [x] A por termos acha documentos que repetem a palavra; a por embedding acha documentos que falam da mesma coisa com outras palavras.
- [ ] A por termos serve para texto curto; a por embedding, para texto longo.
- [ ] As duas encontram o mesmo conjunto, e a diferença está só na ordenação.

> **gabarito:** repetir a palavra contra falar da mesma coisa
> **porque:** É a distinção que justifica a busca semântica existir. Um chamado que diz "correia partida" não repete nenhuma palavra da consulta "manga quebrada na esteira", e é exatamente o documento que interessa.
>
> A primeira alternativa afirma precisão como propriedade fixa, e o capítulo pede o contrário: o ganho da busca semântica é algo que se **mede** contra a linha de base por termos, e não que se presuma.
>
> Vale reter que as duas erram de formas diferentes. A por termos perde o sinônimo; a por embedding pode trazer o que só é vagamente parecido. Comparar as duas é o único jeito de saber qual erro custa mais no seu caso.
> **volte para:** #fundamentos-pre-treino-auto-supervisionado-e-a-palavra-que-muda-de-sentido
:::

:::exercicio {"id":"modelos-de-fundacao-e6","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Por que "auto-supervisionado" resolve o gargalo do rótulo?

- [ ] Porque dispensa a noção de resposta certa, treinando sem função de perda.
- [x] Porque o rótulo é extraído do próprio dado: esconde-se uma palavra e pede-se a palavra de volta, então existe resposta certa sem ninguém ter anotado.
- [ ] Porque usa rótulos gerados por outro modelo já treinado.
- [ ] Porque troca classificação por agrupamento, que não precisa de rótulo.

> **gabarito:** o rótulo é extraído do próprio dado
> **porque:** É supervisão sem anotador. Há resposta certa para comparar em cada exemplo, e ela não custa hora de especialista: já estava no texto, e foi escondida de propósito.
>
> A primeira alternativa é a confusão mais comum com o termo. Existe função de perda, existe resposta certa, existe gradiente. O que não existe é anotação humana.
>
> E é isso que permite treinar em corpus da ordem da internet, onde rotular à mão seria impensável. A escala do pré-treino não vem de mais anotadores, vem de dispensá-los.
> **volte para:** #fundamentos-pre-treino-auto-supervisionado-e-a-palavra-que-muda-de-sentido
:::

## Adaptar: as três portas, e o que cada uma custa

Com o modelo pré-treinado na mão, há três formas de chegar à sua tarefa — e elas diferem sobretudo em **dado necessário** e **custo**.

**Fine-tuning completo.** Continua o treino, ajustando **todos** os pesos com os seus exemplos. É o mais poderoso e o mais caro: exige máquina, exige tempo e produz uma cópia inteira do modelo para cada tarefa. É onde o número do ULMFiT importa — com transferência, a ordem de grandeza de rótulos necessários cai drasticamente.

**Adaptação eficiente.** Em vez de mexer em tudo, congela-se o modelo e treina-se um punhado pequeno de parâmetros novos — **adaptadores**, e a família **LoRA** (*Low-Rank Adaptation*) é a mais difundida. Mesmo efeito prático na maioria dos casos, com uma fração do custo e um artefato pequeno por tarefa, em vez de um modelo inteiro. Fica registrado o nome; o detalhe é assunto de outro ciclo.

**Prompting e in-context learning.** Nenhum peso muda. A tarefa é **descrita** no texto de entrada, às vezes com alguns exemplos ali mesmo, e o modelo responde. Custo de treino zero, latência e custo por chamada não-zero, e nenhuma garantia de estabilidade: a mesma instrução reescrita produz resultado diferente. É a porta certa para começar — e a errada para prometer consistência sem medir.

A regra de bolso é a ordem inversa do custo: **tente prompt, depois adaptação eficiente, e só então fine-tuning completo** — e a cada degrau exija a evidência de que o anterior não bastava.

:::exercicio {"id":"modelos-de-fundacao-e2","tipo":"numerica","objetivo":"O1","dificuldade":"facil"}
No artigo do ULMFiT (2018), o modelo transferido atinge, **com 100 exemplos rotulados**, o mesmo desempenho de um modelo treinado do zero com **10 000** exemplos.

Por qual fator a quantidade de rótulos necessária foi dividida? Responda com um número inteiro.

> **gabarito:** 100 ± 0
> **porque:** 10 000 ÷ 100 = **100**. Duas ordens de grandeza.
>
> O que interessa não é a divisão, é o que ela reorganiza no seu projeto. Rótulo é o insumo caro: ele custa hora de especialista, não hora de máquina. Um fator de 100 significa que a diferença entre "inviável" e "uma semana de anotação" pode ser apenas **escolher transferir em vez de treinar do zero**. É por isso que a primeira pergunta de um projeto com pouco dado rotulado não é qual algoritmo usar — é o que já foi aprendido que você pode não reaprender.
>
> Cuidado com o exagero simétrico: o fator vale para as tarefas e o corpus daquele artigo, não é uma constante da natureza. Meça o seu.
> **volte para:** #adaptar-as-tres-portas-e-o-que-cada-uma-custa
:::

:::exercicio {"id":"modelos-de-fundacao-e7","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Qual é a regra de bolso do capítulo para escolher entre as três portas de adaptação?

- [ ] Fine-tuning primeiro, porque é o mais poderoso, e só recuar se o custo inviabilizar.
- [x] Prompt primeiro, depois adaptação eficiente, e só então fine-tuning completo — exigindo a cada degrau a evidência de que o anterior não bastava.
- [ ] Adaptação eficiente sempre, porque tem o melhor equilíbrio entre custo e resultado.
- [ ] A escolha depende só do tamanho do modelo, não da tarefa.

> **gabarito:** prompt, depois adaptação eficiente, depois fine-tuning
> **porque:** É a ordem inversa do custo, e o que a torna disciplina em vez de preferência é a segunda metade: **exigir a evidência** de que o degrau anterior não bastava. Sem isso, a regra vira gosto.
>
> A primeira alternativa inverte a ordem e é comum em equipes que já têm máquina disponível. Ela paga o custo máximo antes de saber se ele era necessário, e produz uma cópia inteira do modelo por tarefa.
>
> A terceira escolhe um degrau fixo, o que também dispensa a evidência. Adaptação eficiente é ótima quando o prompt não deu conta — e é desperdício quando ele daria.
> **volte para:** #adaptar-as-tres-portas-e-o-que-cada-uma-custa
:::

:::exercicio {"id":"modelos-de-fundacao-e8","tipo":"multipla-multi","objetivo":"O1","dificuldade":"dificil"}
Uma equipe precisa de saída em formato rígido e consistente para 200 mil chamadas por dia. Testou prompt e a mesma instrução reescrita produz resultados diferentes. Quais afirmações são corretas? (marque todas que valem)

- [x] Instabilidade a reescrita é uma característica conhecida do prompting, não um erro da equipe.
- [x] Adaptação eficiente produz um artefato pequeno por tarefa, em vez de uma cópia do modelo.
- [x] Prompting tem custo de treino zero e custo por chamada não-zero, o que pesa em 200 mil chamadas diárias.
- [ ] Fine-tuning completo é a única porta capaz de fixar formato de saída.

> **gabarito:** instabilidade conhecida · artefato pequeno · custo por chamada
> **porque:** As três corretas encaminham a decisão sem precisar do degrau mais caro. O capítulo é explícito: prompting é a porta certa para começar, e a errada para prometer consistência sem medir — que é exatamente o que a equipe descobriu.
>
> O volume muda a conta. Custo de treino zero é ótimo com cem chamadas por dia e irrelevante com duzentas mil, quando o custo por chamada domina.
>
> A alternativa errada transforma "mais poderoso" em "único capaz". Adaptação eficiente fixa formato na maioria dos casos, com uma fração do custo, e é o degrau que a evidência disponível já justifica.
> **volte para:** #adaptar-as-tres-portas-e-o-que-cada-uma-custa
:::

## Conhecimento nos pesos e conhecimento recuperável

O modelo guarda fatos nos pesos. O artigo de RAG (Lewis et al., [arXiv:2005.11401](https://arxiv.org/abs/2005.11401), 22/05/2020) diagnostica o limite disso com precisão: *"their ability to access and precisely manipulate knowledge is still limited"*. ✓ᵃ A proposta separa duas memórias — a **paramétrica**, que está nos pesos, e a **não-paramétrica**, que está num índice consultável na hora da pergunta.

> **A leitura deste livro (📖).** É a LSTM repetida 23 anos depois. No [capítulo III.5](iii-5-sequencias-linguagem.md), a memória embutida na rede recorrente não dava conta e a solução foi construir um **canal explícito** para a informação atravessar. Aqui é o mesmo movimento, uma escala acima: **quando a memória embutida falha, construa um canal externo.**

É por isso que **RAG é decisão de arquitetura, não técnica de prompt**. Adotar RAG significa passar a manter um índice, uma política de atualização, um recuperador que pode errar e uma etapa a mais na latência. Nada disso cabe num campo de texto.

**Quando usar recuperação em vez de fine-tuning.** Três sinais, e qualquer um deles já basta: o conhecimento muda (política de preços que troca toda semana, catálogo, jurisprudência); a resposta precisa **citar a fonte**, porque alguém vai auditar; ou o volume de conhecimento é grande e o custo de retreinar a cada mudança é proibitivo. Fine-tuning ensina comportamento: formato, tom, um jeito de responder. Recuperação fornece **fato**. Confundir os dois é o erro mais caro deste capítulo: quem faz fine-tuning para "ensinar a política nova" paga o treino e ainda fica com a política de ontem congelada nos pesos.

**Alucinação, e por que ela não é um defeito de fabricação.** O modelo foi treinado para **continuar texto de forma plausível** — não para dizer a verdade. Uma citação inventada com autor, ano e página é, do ponto de vista do objetivo de treino, um sucesso: é exatamente o texto que viria a seguir. Recuperação ataca o problema pela raiz certa, ao trocar "lembre-se do fato" por "leia este trecho e responda a partir dele", mas **não o elimina**: se o recuperador trouxer o documento errado, o modelo responderá com convicção idêntica.

:::exercicio {"id":"modelos-de-fundacao-e3","tipo":"aberta","objetivo":"O4","pontos":3,"dificuldade":"dificil"}
Uma operadora de saúde quer um assistente interno que responda dúvidas sobre **cobertura de procedimentos**. As regras mudam **toda semana** por decisão de comitê, existem cerca de 4 mil páginas de normas vigentes, e **toda resposta precisa apontar a norma que a sustenta**, porque a auditoria confere por amostragem.

A liderança técnica propôs "fazer fine-tuning do modelo nas normas". Julgue a proposta e diga o que você faria — incluindo o que mediria para saber se funcionou.

> **rubrica:** identifica que o conhecimento muda toda semana, o que torna qualquer conhecimento congelado nos pesos obsoleto entre treinos;
> reconhece a exigência de citar a fonte como incompatível com conhecimento paramétrico, que não devolve procedência;
> recomenda recuperação (RAG) como arquitetura principal, e não como ajuste de prompt;
> separa os dois papéis — recuperação fornece fato, fine-tuning (ou prompt) ajusta formato e tom da resposta;
> propõe medir as duas etapas separadamente: qualidade do recuperador (o trecho certo apareceu entre os recuperados?) e qualidade da resposta (ela é sustentada pelo trecho citado?);
> menciona ao menos um modo de falha residual — recuperador traz documento errado, norma revogada ainda no índice, resposta convicta sobre trecho inadequado
> **porque:** A proposta erra na natureza do problema, não no tamanho. Fine-tuning **congela** o que ensinou: no dia seguinte ao treino a norma muda e o modelo continua confiante na versão antiga — e agora o erro está espalhado pelos pesos, onde não se corrige com um `UPDATE`. Com regra semanal, o ciclo de retreino nunca alcança o ciclo do comitê.
>
> O segundo requisito é ainda mais decisivo e costuma passar despercebido: **auditoria exige procedência**. Conhecimento nos pesos não devolve fonte — ele devolve texto plausível, e uma norma inventada com número e artigo é exatamente o tipo de saída que o objetivo de treino premia. Recuperação devolve **o trecho**, e a citação deixa de ser promessa e passa a ser um ponteiro verificável.
>
> A resposta forte separa os papéis: **recuperação para o fato, adaptação (ou simplesmente prompt) para o formato**. E ela mede as duas metades separadamente — porque um sistema que responde mal pode estar recuperando o trecho errado ou raciocinando mal sobre o trecho certo, e essas duas falhas se consertam em lugares opostos. Sem essa separação, a equipe vai passar meses ajustando prompt para consertar um problema de índice.
>
> Modo de falha que quase ninguém escreve na proposta e todo mundo encontra em produção: **a norma revogada continua no índice**. O recuperador a traz, o modelo a cita, a auditoria acha. A política de expurgo do índice é parte do sistema, não tarefa de manutenção.
> **volte para:** #conhecimento-nos-pesos-e-conhecimento-recuperavel
:::

:::exercicio {"id":"modelos-de-fundacao-e9","tipo":"multipla","objetivo":"O3","dificuldade":"facil"}
Por que o capítulo insiste que RAG é decisão de arquitetura, e não técnica de prompt?

- [ ] Porque o prompt de RAG é longo demais para caber num campo de texto.
- [x] Porque adotá-lo significa manter um índice, uma política de atualização, um recuperador que pode errar e uma etapa a mais na latência.
- [ ] Porque RAG exige treinar o modelo de novo com os documentos recuperados.
- [ ] Porque o termo "arquitetura" é o usado no artigo original.

> **gabarito:** índice, política de atualização, recuperador falível e latência
> **porque:** Nada disso cabe num campo de texto. Cada item é um componente com dono, custo de manutenção e modo de falha próprio, e é isso que torna a adoção uma decisão de sistema.
>
> A terceira alternativa confunde as duas memórias que o capítulo separa. RAG **não** treina de novo: a memória paramétrica fica como está, e a não-paramétrica é consultada na hora da pergunta.
>
> A consequência prática é onde o erro aparece. Quem trata RAG como prompt não planeja quem atualiza o índice nem o que acontece quando o recuperador traz o documento errado, e descobre os dois em produção.
> **volte para:** #conhecimento-nos-pesos-e-conhecimento-recuperavel
:::

:::exercicio {"id":"modelos-de-fundacao-e10","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Por que a alucinação não é um defeito de fabricação do modelo?

- [ ] Porque ela só acontece quando o prompt está mal escrito.
- [x] Porque o modelo foi treinado para continuar texto de forma plausível, e uma citação inventada com autor, ano e página é exatamente o texto que viria a seguir.
- [ ] Porque ela desaparece completamente com recuperação.
- [ ] Porque é um erro de amostragem que uma temperatura menor elimina.

> **gabarito:** o objetivo de treino premia continuação plausível, não verdade
> **porque:** Do ponto de vista do que foi otimizado, a citação inventada é um **sucesso**. Não houve falha: houve o objetivo sendo cumprido, e o objetivo não era dizer a verdade.
>
> Ver assim muda o que se procura como remédio. Não adianta pedir ao modelo que "não invente"; o que muda o jogo é trocar "lembre-se do fato" por "leia este trecho e responda a partir dele".
>
> A terceira alternativa é a promessa exagerada que o capítulo desmonta na mesma frase: recuperação ataca a raiz certa e **não elimina** o problema. Se o recuperador trouxer o documento errado, o modelo responderá com convicção idêntica.
> **volte para:** #conhecimento-nos-pesos-e-conhecimento-recuperavel
:::

:::exercicio {"id":"modelos-de-fundacao-e11","tipo":"multipla-multi","objetivo":"O4","dificuldade":"facil"}
Quais sinais, sozinhos, já indicam recuperação em vez de fine-tuning? (marque todos que valem)

- [x] O conhecimento muda com frequência.
- [x] A resposta precisa citar a fonte, porque alguém vai auditar.
- [x] O volume de conhecimento é grande e retreinar a cada mudança seria proibitivo.
- [ ] A equipe quer que o modelo responda num tom mais formal.

> **gabarito:** conhecimento que muda · exigência de citar fonte · volume grande
> **porque:** Os três são os sinais da seção, e qualquer um deles já basta. Fine-tuning congela o que ensinou, então conhecimento que muda fica desatualizado entre treinos, e conhecimento nos pesos não devolve procedência.
>
> A alternativa errada descreve exatamente o que fine-tuning faz bem. A linha que organiza a decisão é curta: **fine-tuning ensina comportamento — formato, tom, um jeito de responder. Recuperação fornece fato.**
>
> Confundir os dois é o erro mais caro do capítulo: quem faz fine-tuning para ensinar a política nova paga o treino e ainda fica com a política de ontem congelada nos pesos.
> **volte para:** #conhecimento-nos-pesos-e-conhecimento-recuperavel
:::

:::exercicio {"id":"modelos-de-fundacao-e12","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Um sistema com recuperação responde mal. Por que medir as duas etapas separadamente muda o que a equipe faz?

- [ ] Porque separar as métricas melhora o desempenho geral do sistema.
- [x] Porque a falha pode estar no recuperador ou no raciocínio sobre o trecho certo, e essas duas se consertam em lugares opostos.
- [ ] Porque o recuperador não tem métrica própria, e por isso precisa ser avaliado junto.
- [ ] Porque a auditoria exige duas métricas separadas no relatório.

> **gabarito:** as duas falhas se consertam em lugares opostos
> **porque:** Uma métrica única de "respondeu bem" não distingue trazer o trecho errado de raciocinar mal sobre o trecho certo. As perguntas são duas: o trecho certo apareceu entre os recuperados, e a resposta é sustentada pelo trecho citado.
>
> A consequência de não separar é concreta e cara: sem essa separação, a equipe passa meses ajustando prompt para consertar um problema de índice.
>
> Repare que é o mesmo princípio do [capítulo II.8](ii-8-do-modelo-a-decisao.md), onde o modelo que ordena e a decisão que corta são medidos separadamente. Sistema com duas etapas pede duas medições.
> **volte para:** #conhecimento-nos-pesos-e-conhecimento-recuperavel
:::

## Limites: custo, viés herdado e a dificuldade de avaliar

**Custo.** Pré-treinar é um projeto de infraestrutura, não de equipe de dados — e é por isso que a esmagadora maioria dos usuários consome modelos de terceiros. Isso tem consequência: a homogeneização que o próprio relatório de Stanford aponta significa que **o mesmo punhado de modelos-base sustenta milhares de aplicações**, e um defeito lá aparece em todas — *"inherited by all adapted models downstream"*.

**Viés herdado do corpus.** O modelo aprendeu a continuar o texto que existe, com as associações que existem nele. Nenhuma etapa do pré-treino filtra isso, e o fine-tuning por cima raramente remove — costuma apenas encobrir na superfície testada. O tratamento sério é assunto do [capítulo V.1](v-1-interpretabilidade-justica.md).

**Avaliar é o problema aberto.** Aqui não há matriz de confusão esperando: a saída é texto livre, muitas respostas diferentes são aceitáveis, e o "gabarito" muitas vezes é um julgamento. O [capítulo II.1](ii-1-avaliacao.md) continua valendo, e sua exigência central vale mais ainda: **defina a linha de base e meça contra ela**. Rubrica escrita antes de olhar as respostas, conjunto de casos fixo, e desconfiança explícita quando o avaliador é outro modelo — o júri automático herda os mesmos vieses do julgado, e concorda consigo mesmo com facilidade suspeita.

## Síntese — o que levar

- Em 2018 o gargalo de linguagem era **rótulo**, não arquitetura: cada tarefa recomeçava do zero.
- **A ideia exportável:** quando o dado rotulado é o gargalo, mude **o que se reaproveita**, não o algoritmo. A unidade de reuso passou da palavra para o modelo.
- **Auto-supervisionado** = o rótulo sai do próprio dado. É o que destrava treinar em corpus sem anotador.
- Embedding **contextual** dá vetores diferentes à mesma palavra em frases diferentes; o estático dá um só, e é aí que a busca semântica quebra.
- As **leis de escala** dizem que, passado certo ponto, arquitetura é detalhe — o oposto do [capítulo III.4](iii-4-visao.md). As duas verdades convivem, cada uma no seu regime.
- Três portas, em ordem crescente de custo: **prompt → adaptação eficiente (LoRA) → fine-tuning completo**. Suba um degrau só com evidência de que o anterior não bastou.
- **Fine-tuning ensina comportamento; recuperação fornece fato.** Confundir isso é o erro caro deste capítulo.
- **RAG é decisão de arquitetura**: traz índice, política de atualização e um recuperador que também erra.
- **Alucinação não é bug**: o modelo foi treinado para continuar texto plausível, não para dizer a verdade.
- O nome *foundation model* foi escolhido para marcar o caráter **central e incompleto** — e a crítica veio no próprio resumo que cunhou o termo.
- **Um ano** entre Transformer e BERT/GPT. Pergunta precisa **mais** infraestrutura de reprodução compartilhada encurtam o intervalo de décadas para meses.

:::exercicio {"id":"modelos-de-fundacao-e4","tipo":"aberta","objetivo":"O3","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Um colega diz que "RAG é só colocar os documentos no prompt". Aponte **três compromissos de arquitetura** que essa frase esconde, e diga qual deles costuma aparecer primeiro em produção.

> **rubrica:** identifica ao menos três decisões que são de arquitetura, e não de redação de prompt — como o documento é partido em trechos e de que tamanho, qual índice recupera e por qual critério de similaridade, quantos trechos entram e o que fazer quando não cabem, como o conteúdo é atualizado quando a fonte muda, ou o que o sistema responde quando a recuperação não traz nada relevante;
> mostra que cada compromisso tem **consequência mensurável**, e não é preferência de estilo: o corte errado parte a frase que continha a resposta, e o índice errado devolve o documento parecido em vez do documento certo;
> aponta um que aparece primeiro em produção e **justifica** a escolha pela dinâmica do sistema real, e não por opinião — tipicamente a atualização do conteúdo ou o comportamento quando nada relevante é recuperado, porque os dois são invisíveis nos testes e inevitáveis no uso;
> não reduz o problema a tamanho de janela de contexto: "cabe mais texto agora" muda um dos compromissos e não elimina nenhum dos outros
> **porque:** A frase do colega é atraente porque descreve corretamente o que se **vê**: no fim, há mesmo documentos dentro de um prompt. O que ela esconde é tudo que decide **quais** documentos, e essa é a parte que se projeta, se versiona e quebra.
>
> O quarto critério persegue o atalho da moda. Janelas de contexto maiores fazem parecer que o problema evaporou — basta jogar tudo lá dentro. Mas o corte continua existindo (agora com trechos maiores), a recuperação continua decidindo a ordem, o custo por chamada cresce com o que você enfiou, e nada disso resolve o dia em que a fonte muda e o índice não.
>
> E é por isso que o compromisso que aparece primeiro raramente é o que se estuda primeiro. Fragmentação e similaridade são o que se lê nos tutoriais; **atualização** e **o que responder quando não há resposta** são o que aparece na segunda semana de produção, porque nenhum dos dois tem como se manifestar num teste feito com o índice recém-construído.
> **volte para:** #conhecimento-nos-pesos-e-conhecimento-recuperavel
:::

## Verificação

1. Explique a diferença entre pré-treino, fine-tuning e uso via prompt em termos de **quem paga o quê**: quanto dado rotulado, quanto tempo de máquina e quanto custo por uso cada um exige. Dê um caso do seu trabalho para cada um.
2. Descreva um sistema de busca que você usa hoje e diga como mediria se trocar busca por termos por busca com embeddings melhorou alguma coisa — qual é a linha de base, qual é o conjunto de consultas e qual número decide.

> Estas duas não são corrigidas, e a omissão é deliberada: as duas pedem um caso que só você tem à mão, e rubricar um sistema que o corretor não viu seria fingir correção.
