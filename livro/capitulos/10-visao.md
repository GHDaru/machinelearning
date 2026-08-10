# 10 — Visão Computacional

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar convolução como imposição de invariância translacional.
- **O2.** Justificar por que compartilhar pesos reduz a necessidade de dados.
- **O3.** Aplicar transferência de aprendizado e decidir o que congelar.
- **O4.** Projetar aumentação de dados coerente com o domínio do problema.

## O problema: o mesmo gato, dez mil vezes

Uma foto de 224×224 pixels coloridos são 150 528 números. Ligue isso a uma camada densa de 128 unidades, como no [capítulo 09](09-redes-neurais.md), e você acaba de escrever 19 milhões de pesos — para uma única camada, a primeira.

O tamanho é o problema menor. O problema maior é o que essa camada **acredita**: que cada pixel é uma variável independente, sem vizinho. Embaralhe as 150 528 posições com uma permutação fixa e treine de novo — a rede densa aprende exatamente igual. Para ela, a imagem nunca foi uma imagem; foi uma lista.

A consequência aparece na conta de dados. Um gato no canto superior esquerdo e o mesmo gato no canto inferior direito ativam conjuntos de pesos **disjuntos**. Nada do que a rede aprendeu numa posição serve na outra. Ou você mostra o gato em todas as posições possíveis, ou ela aprende um detector de gato-no-canto-esquerdo. É o pior dos dois mundos: parâmetros demais e generalização de menos.

## De onde isto veio

**O aperto.** Fim dos anos 1950. David Hubel e Torsten Wiesel enfiam um eletrodo no córtex visual de um gato anestesiado, projetam pontos de luz numa tela e esperam o neurônio disparar. Ele não dispara. Passam meses assim. Conta-se que a célula finalmente respondeu quando eles trocavam o slide e **a borda da lâmina de vidro** cruzou a tela — o estímulo acidental funcionou onde o estímulo planejado falhara.

**O que se fazia antes.** Procurava-se um **detector de ponto**. A suposição era natural e estava errada: se a retina recebe a imagem como um mosaico de pontos, o córtex deveria compor a visão a partir de pontos. Estava-se procurando o pixel dentro do cérebro.

**A virada.** O córtex não detecta pontos: detecta **bordas com orientação**. Uma célula responde a uma barra inclinada a 30°, e cala diante da mesma barra a 90°. E há hierarquia — as "células simples", presas a uma posição, alimentam "células complexas", que respondem à mesma orientação **em qualquer lugar** do campo receptivo. Estrutura mais primitiva feita de partes, tolerância à posição construída em cima.

**A ideia reaproveitável.** *A primitiva certa não é a mais elementar.* O ponto é mais simples que a borda — e é a primitiva **errada**. Achar a unidade mínima da **representação** não é o mesmo trabalho que achar a unidade mínima do **sinal**, e confundir as duas é o erro de projeto mais caro que existe. É o [capítulo 03](03-representacao.md) inteiro, dito por um eletrodo.

**O nome.** "Célula simples" e "célula complexa" são deles. Em 1979/80, Kunihiko Fukushima empilha essas duas em cascata no **neocognitron** e chama as camadas de **S-cells** e **C-cells** — os nomes atravessaram da biologia para a engenharia sem tradução.

**A linha.** Hubel & Wiesel (1959) → neocognitron de Fukushima (1979/80), já com S/C-cells alternadas e treinado **sem retropropagação** (ver [capítulo 18](18-neuronio-artificial.md)) → LeCun e colegas (1989) treinam uma rede convolucional em **CEPs manuscritos do Serviço Postal dos EUA**: 7 291 imagens de 16×16, cerca de 9 760 parâmetros, **três dias numa SUN-4/260** → LeNet-5 (1998) → AlexNet (2012) → ResNet (2016).

**O intervalo, e é o maior do livro.** De Hubel & Wiesel a AlexNet vão **53 anos**. Compare com os 59 do [capítulo 03](03-representacao.md), os ~80 do [capítulo 13](13-reforco.md), os 43 do [capítulo 24](24-series-temporais.md). Agora a contra-prova, que vem no [capítulo 12](12-modelos-de-fundacao.md): do Transformer (2017) a BERT e GPT (2018) passou-se **cerca de um ano**. A diferença não é a qualidade das ideias. É que em 2017 já existia **infraestrutura de reprodução compartilhada** — arXiv, código aberto, GPU comprável, benchmark comum — além da pergunta precisa. Meio século da história desta área foi, em boa parte, o tempo de construir isso.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Hubel & Wiesel, *Receptive fields of single neurones in the cat's striate cortex*, **J. Physiol. 148:574–591 (1959)** — células simples e complexas, seletividade a orientação |
| ✓ᵐ | Fukushima, neocognitron (1979/80): S-cells e C-cells em cascata, herdando os nomes de Hubel & Wiesel |
| ✓ᵐ | LeCun et al., **Neural Computation 1:541–551 (1989)** — CEPs do Serviço Postal dos EUA, 7 291 imagens de 16×16, ~9 760 parâmetros, três dias numa SUN-4/260 |
| ⏳ | A anedota da **borda da lâmina de vidro** como o estímulo que finalmente fez a célula disparar — atribuição corrente, não conferida em fonte primária |
| ⏳ | Que a busca anterior era por um "detector de ponto", por suposição de que a visão se compõe a partir de pixels |
| ⏳ | O Nobel de Medicina de 1981 a Hubel e Wiesel |
| ⏳ | Que o neocognitron foi treinado sem retropropagação |
| 📖 | A leitura de que "a primitiva certa não é a mais elementar" é a ideia exportável do episódio |
| 📖 | A leitura do intervalo de 53 anos contra o ~1 ano do [capítulo 12](12-modelos-de-fundacao.md) como evidência de que **infraestrutura de reprodução** encurta o intervalo |
| ✓ | **Tudo o que este capítulo atribui ao artigo da AlexNet** — o limite de 3 GB da GTX 580, a decisão de partir a rede em duas GPUs, os cinco a seis dias de treino, a ReLU seis vezes mais rápida que a tangente hiperbólica no CIFAR-10, e os 15,3% contra 26,2% de erro top-5 — vem do [PDF original do NIPS 2012](https://proceedings.neurips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf), **lido**. As frases entre aspas na seção seguinte são transcrições literais |

## Fundamentos: o filtro que desliza e o peso que se repete

Um **filtro** (ou *kernel*) é uma matrizinha de pesos — 3×3, 5×5 — que percorre a imagem inteira. Em cada posição, multiplica-se o filtro pelo pedaço de imagem sob ele e soma-se: um número. Deslize por todas as posições e o resultado é outra imagem, o **mapa de ativação**, alto onde o padrão do filtro apareceu e baixo onde não apareceu.

Três consequências saem daí, e as três importam.

**Conectividade local.** Cada saída olha só uma janelinha — o **campo receptivo**. Isso codifica no modelo um fato sobre imagens que a rede densa ignora: pixels vizinhos se relacionam, pixels distantes quase não.

**Compartilhamento de pesos.** É o **mesmo** filtro em todas as posições. Um detector de borda vertical aprendido no canto esquerdo já vale no canto direito, de graça. Aqui está a resposta ao problema de dados: cada exemplo de treino atualiza os mesmos poucos pesos milhares de vezes, uma por posição. Menos parâmetros para estimar, mais evidência por parâmetro.

**Invariância a translação.** Deslocar o objeto desloca o mapa de ativação — não muda o que foi detectado. A rede não precisa reaprender o gato em cada canto porque, para ela, é o mesmo gato deslocado.

Repare no que isso é: uma **restrição** imposta de fora. A camada convolucional é uma camada densa proibida de fazer quase tudo o que poderia — pesos amarrados uns aos outros, conexões distantes zeradas. A restrição não é o preço do desempenho; é a **fonte** dele. Uma rede com menos liberdade e a hipótese certa embutida vence uma rede livre que precisa descobrir a hipótese a partir de dados que ninguém tem.

:::exercicio {"id":"10-e1","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
Uma imagem colorida de 224×224 tem 3 canais. Considere uma camada convolucional com **64 filtros de 3×3**, aplicada a essa entrada.

Quantos **pesos** (ignorando os vieses) essa camada tem?

> **gabarito:** 1728
> **porque:** Cada filtro cobre 3×3 posições em **cada um dos 3 canais** de entrada: `3 × 3 × 3 = 27` pesos por filtro. São 64 filtros: `27 × 64 = 1 728`.
>
> Agora a comparação, que é o ponto do exercício. Uma camada **densa** com 64 unidades sobre a mesma imagem precisaria de `224 × 224 × 3 × 64 = 9 633 792` pesos — cerca de **5 573 vezes mais**. E não é só a conta de memória: são 9,6 milhões de números a estimar a partir dos seus dados, contra 1 728.
>
> Note de onde vem a economia. Não é de olhar menos pixels — o filtro percorre a imagem toda. Vem de usar **os mesmos pesos** em todas as posições. O número de parâmetros da camada convolucional **não depende do tamanho da imagem**; o da densa é proporcional a ele.
> **volte para:** #fundamentos-o-filtro-que-desliza-e-o-peso-que-se-repete
:::

### Pooling e a hierarquia de features

O **pooling** reduz a resolução do mapa de ativação — tipicamente pegando o máximo de cada janela 2×2. Perde-se posição exata e ganha-se duas coisas: tolerância a pequenos deslocamentos e um campo receptivo que **cresce** nas camadas seguintes, porque cada unidade passa a resumir uma região maior do original.

Empilhe isso e aparece a **hierarquia de features**, que é a estrutura de Hubel e Wiesel repetida por mais andares do que a biologia mostrou: as primeiras camadas aprendem **bordas** e manchas de cor; as seguintes, **texturas** e cantos; depois, **partes** — um olho, uma roda; e no topo, **objetos**. Ninguém programou esses níveis. Eles emergem do treino, e são notavelmente parecidos entre redes treinadas em tarefas diferentes — fato que a seção de transferência vai cobrar.

## O diagrama que é um limite de memória desenhado

Em 2012, a AlexNet ganhou o ImageNet com **15,3% de erro top-5 contra 26,2% do segundo colocado**. Não foi uma melhora incremental: foi uma faixa inteira de distância, e é a data que a maioria dos cursos trata como o começo da era moderna da visão.

Três decisões carregaram o resultado, e todas as três são de engenharia, não de teoria. A ativação **ReLU** (unidade linear retificada) no lugar da tangente hiperbólica — o artigo relata atingir 25% de erro no CIFAR-10 **seis vezes mais rápido**. O *dropout* contra sobreajuste. E o treino em **GPU** (unidade de processamento gráfico), que levou "between five and six days to train on two GTX 580 3GB GPUs".

Agora o detalhe que fecha o capítulo. Todo curso reproduz o diagrama da AlexNet em **duas colunas paralelas** e o discute como decisão de arquitetura. O artigo diz o que ele é, em duas frases: *"A single GTX 580 GPU has only 3GB of memory, which limits the maximum size of the networks that can be trained on it. (…) Therefore we spread the net across two GPUs."*

📖 **O diagrama mais reproduzido da visão computacional é um limite de 3 gigabytes desenhado.** É o caso mais literal deste livro de restrição material gerando forma nova — ao lado de Playfair inventando o gráfico de barras porque não tinha os dados de série temporal ([capítulo 22](22-visualizacao-storytelling.md)) e do cubo OLAP pré-computando agregados porque a consulta era lenta demais ([capítulo 23](23-analise-multidimensional.md)). A forma sobrevive à restrição que a gerou, e a geração seguinte a estuda como se fosse princípio.

Quatro anos depois, a **ResNet** ataca outro problema — e a formulação dele é mais instrutiva que a solução. Empilhando mais camadas, a acurácia **de treino** piorava. Treino, não teste: isso **descarta sobreajuste** como explicação, porque um modelo que sobreajusta vai bem no treino por definição. O nome disso é **degradação**, e a resposta foram as conexões residuais: 152 camadas, 3,57% de erro. É o [capítulo 26](26-treinar-redes-profundas.md) aparecendo dentro deste.

:::exercicio {"id":"10-e2","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Uma equipe empilha camadas numa rede convolucional: 20, depois 34, depois 56 camadas. O erro **no conjunto de treino** piora a cada aumento. Qual é a leitura correta?

- [ ] A rede está sobreajustando: profundidade demais para os dados disponíveis.
- [x] Não é sobreajuste — sobreajuste melhoraria o erro de treino. É um problema de otimização: a rede mais profunda não consegue nem aprender o que a rasa aprendeu.
- [ ] Faltou aumentação de dados; com mais variação artificial o erro de treino cairia.
- [ ] O campo receptivo ficou grande demais e a rede perdeu a estrutura local.

> **gabarito:** Não é sobreajuste — o erro de **treino** piorou
> **porque:** O sinal decisivo está em qual erro piorou. Um modelo que sobreajusta decora o treino: seu erro de treino **cai**, e é o de teste que sobe. Aqui os dois pioram — então o modelo nem chegou a decorar. O problema é anterior à generalização: é **otimização**.
>
> E há um argumento de construção que fecha a questão: uma rede de 56 camadas poderia, em princípio, copiar a de 20 e deixar as 36 restantes como identidade — logo, ela **nunca deveria ser pior**. Se é, o método de treino não está achando essa solução. Foi exatamente esse raciocínio que produziu as conexões residuais.
>
> Sobre as outras: **aumentação** ataca generalização, não erro de treino (se algo, dificulta o treino). E **campo receptivo grande** não é uma patologia que faz o erro de treino subir monotonicamente com a profundidade.
> **volte para:** #o-diagrama-que-e-um-limite-de-memoria-desenhado
:::

## Transferência de aprendizado: o que quase todo projeto real faz

Aqui está a parte prática, e ela contraria a imagem que se faz da área. **A maioria esmagadora dos projetos de visão em empresa não treina rede nenhuma do zero.** Pega uma rede já treinada em milhões de imagens, joga fora a última camada, põe uma cabeça nova com as suas classes e treina só ela.

Funciona por causa da hierarquia. Bordas, texturas e cantos **não são específicos do ImageNet** — são específicos de imagens. Uma borda numa chapa de raio X é a mesma borda de uma foto de cachorro. Só as camadas do topo, que montam objetos, é que são particulares da tarefa original — e são justamente as que você substitui.

O critério de **o que congelar** é curto e serve na prática:

| Situação | O que fazer |
|---|---|
| Poucos dados (centenas), domínio parecido com fotos naturais | Congele o corpo inteiro; treine só a cabeça |
| Dados moderados (milhares), domínio parecido | Cabeça primeiro; depois descongele as últimas camadas com taxa de aprendizado baixa |
| Domínio muito diferente (satélite, microscopia, radar) | Descongele mais fundo — as features de alto nível não servem, as de baixo ainda servem |
| Muitos dados (centenas de milhares) e domínio próprio | Aí sim treinar do zero pode compensar |

O erro típico é descongelar tudo com a taxa de aprendizado padrão: os gradientes grandes da cabeça recém-inicializada, ainda aleatória, destroem features boas que levaram semanas de GPU para existir. Treine a cabeça primeiro; só então libere o corpo, e devagar.

**Aumentação de dados** entra pelo mesmo motivo — poucos exemplos. Você gera variações artificiais que **preservam o rótulo**: recortes, pequenas rotações, mudanças de brilho. A regra é uma só e é sobre o seu domínio, não sobre a biblioteca: *a transformação preserva o rótulo aqui?* Espelhar horizontalmente uma foto de gato dá um gato. Espelhar um dígito manuscrito ou um caractere destrói o rótulo. Girar 180° uma célula ao microscópio é inofensivo; girar 180° uma radiografia de tórax produz uma imagem que não existe na clínica — e treinar com ela gasta capacidade em invariâncias falsas.

Uma nota de estado da arte: desde 2020 os **Vision Transformers (ViT)** disputam esse espaço, tratando a imagem como sequência de retalhos em vez de impor convolução ([capítulo 11](11-sequencias-linguagem.md)). Eles trocam a hipótese embutida por dados e escala. Para o projeto com 800 imagens, porém, a decisão prática não muda: transferir continua sendo o caminho, mude só de que modelo.

:::exercicio {"id":"10-e3","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"dificil"}
Uma indústria quer classificar peças metálicas em "com trinca" / "sem trinca" a partir de fotos da linha de produção. Há **800 imagens rotuladas** por um inspetor experiente — 640 sem trinca, 160 com. Novas fotos custam caro para rotular. A câmera é fixa, a peça sempre entra na mesma orientação.

Treinar do zero ou transferir? Decida, justifique e diga o que você congelaria e que aumentações usaria.

> **rubrica:** decide por transferência e sustenta a decisão com a ordem de grandeza dos dados (800 exemplos contra os milhões que o pré-treino já viu);
> justifica com a hierarquia de features — bordas e texturas são genéricas a imagens, e trinca é essencialmente um padrão de textura/borda;
> propõe congelar o corpo e treinar só a cabeça primeiro, com descongelamento parcial e taxa baixa depois, se houver folga;
> escolhe aumentações que preservam o rótulo neste domínio e justifica pelo menos uma exclusão à luz da câmera fixa e da orientação constante;
> reconhece o desbalanceamento 640/160 e propõe tratamento (peso de classe ou métrica adequada), sem se guiar por acurácia
> **porque:** Com 800 imagens, treinar do zero é estimar milhões de parâmetros a partir de quase nada — e o resultado previsível é uma rede que decora as 800. A rede pré-treinada chega sabendo bordas, texturas e cantos, que é **exatamente** o vocabulário de uma trinca. Você está treinando um classificador sobre features prontas, não uma rede.
>
> Congele o corpo, treine só a cabeça. Se sobrar dado e paciência, descongele as últimas camadas com taxa de aprendizado uma ou duas ordens de grandeza menor. Descongelar tudo de saída é o modo clássico de destruir o que se veio buscar.
>
> Nas aumentações, o enunciado é uma armadilha útil: **a câmera é fixa e a orientação é constante**. Rotações grandes e espelhamentos geram imagens que a linha nunca vai produzir — capacidade gasta em invariância que ninguém pediu. O que faz sentido é o que **de fato varia na linha**: brilho e contraste (a iluminação oscila), pequenas translações e rotações de poucos graus (a peça assenta um pouco torta), ruído leve. Aumentação boa é modelagem da variação real do processo, não uma lista de transformações copiada de um tutorial.
>
> Por fim, 640/160 é 80/20: um modelo que responde "sem trinca" sempre acerta 80%. Acurácia aqui não mede nada — vale revocação da classe rara, e o [capítulo 04](04-avaliacao.md) trata do resto.
> **volte para:** #transferencia-de-aprendizado-o-que-quase-todo-projeto-real-faz
:::

## Síntese — o que levar

- Rede densa sobre imagem falha duas vezes: **parâmetros demais** e **estrutura espacial jogada fora**. Para ela, a imagem é uma lista.
- A convolução impõe três coisas de uma vez: **conectividade local**, **compartilhamento de pesos** e **invariância a translação**.
- **A ideia exportável:** a primitiva certa não é a mais elementar. Hubel e Wiesel procuravam o ponto e o córtex respondia a bordas — achar a unidade mínima da **representação**, não a do sinal, é o trabalho de projeto.
- Compartilhar pesos é o que resolve a fome de dados: o número de parâmetros **não depende do tamanho da imagem**, e cada exemplo atualiza os mesmos pesos milhares de vezes.
- **Restringir o modelo é a fonte do desempenho**, não o preço dele.
- A **hierarquia** (bordas → texturas → partes → objetos) emerge do treino e é genérica — é ela que torna a transferência possível.
- **Degradação ≠ sobreajuste.** Se o erro de **treino** piora com a profundidade, o problema é otimização.
- O diagrama de duas colunas da AlexNet é **um limite de 3 GB desenhado**. Restrição material vira forma, e a forma sobrevive à restrição.
- **Transfira por padrão.** Congele o corpo, treine a cabeça, descongele devagar. Treinar do zero é a exceção, não a regra.
- **Aumentação é modelagem do domínio**, não lista de transformações: só entra o que preserva o rótulo e o que de fato varia no processo real.
- Da percepção ao problema em 53 anos; do Transformer ao BERT em cerca de um. A diferença foi **infraestrutura de reprodução compartilhada**.

## Verificação

1. Explique, sem fórmula, por que a convolução **impõe** invariância translacional em vez de aprendê-la — e diga que preço se paga por essa imposição quando a posição absoluta do objeto importa para a tarefa.
2. Uma colega afirma: "com poucos dados, uso menos parâmetros; por isso a convolução ajuda". A frase está certa pelo motivo errado. Corrija-a, explicando o que o compartilhamento de pesos faz com a **evidência por parâmetro**.
3. Escolha um problema de imagem do seu contexto. Diga o que você congelaria numa rede pré-treinada e por quê, e liste três aumentações que você **descartaria** — justificando cada descarte pelo domínio, não pela biblioteca.
