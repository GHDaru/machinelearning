# Prova da Parte III — Redes Neurais e Deep Learning

> **Estado da arte capturado em 2026-08** · [histórico](../HISTORICO.md)
>
> **Isto não vale nota, e o livro diz isso por escrito.** A identificação é
> autodeclarada, o livro fica aberto e o enunciado está publicado no Markdown do
> repositório. O que esta prova produz é **evidência de prática, não de
> aprendizado**. A recomendação do livro a quem dá aula é pontuar **por ter
> feito, nunca por ter acertado**.

## O que esta prova é

Dez itens sobre os seis capítulos da Parte III, de [III.1](../capitulos/iii-1-neuronio-artificial.md)
a [III.6](../capitulos/iii-6-modelos-de-fundacao.md). Cada item **cruza dois
capítulos ou mais**.

Nenhum item traz o **"volte para"**, e todo cenário é **inédito**. Todos são
corrigidos na hora, sem consultar modelo de linguagem.

Esta parte tem um fio que vale procurar enquanto você responde: **o mesmo
diagnóstico reaparece com nomes diferentes**, e boa parte dos itens cobra
justamente reconhecê-lo sob o disfarce.

:::exercicio {"id":"prova-parte-iii-q1","tipo":"multipla","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/iii-1-neuronio-artificial.md:O3","livro/capitulos/iii-2-redes-neurais.md:O1"],"dificuldade":"media"}
Uma equipe empilha três camadas densas sem nenhuma função de ativação entre elas e tenta resolver um problema não linearmente separável. O treino roda, a perda desce um pouco e estaciona.

Qual é a explicação?

- [ ] Três camadas são poucas; o teorema da aproximação universal exige mais profundidade.
- [x] Sem ativação, as três camadas colapsam numa única transformação linear, e a fronteira continua sendo uma reta.
- [ ] O problema é a inicialização, que precisa ser He em vez de Xavier.
- [ ] A perda escolhida é inadequada para problemas não separáveis.

> **gabarito:** as camadas colapsam numa transformação linear
> **porque:** O produto de duas matrizes é uma matriz, e o de três também. A rede computa exatamente o que uma camada linear computaria, com o triplo dos parâmetros e do tempo de treino.
>
> Isso liga os dois capítulos. A limitação de 1969 nunca foi do neurônio, era da arquitetura de uma camada só — e empilhar camadas **sem não-linearidade** não constrói arquitetura nenhuma, apenas reescreve a mesma reta com mais símbolos.
>
> A terceira alternativa aponta uma decisão real e irrelevante aqui: nenhuma inicialização torna uma função linear capaz de separar o que reta nenhuma separa.
:::

:::exercicio {"id":"prova-parte-iii-q2","tipo":"multipla-multi","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iii-3-treinar-redes-profundas.md:O2","livro/capitulos/iii-5-sequencias-linguagem.md:O2"],"dificuldade":"dificil"}
Uma rede profunda não aprende as primeiras camadas, e uma RNN não aprende dependências de vinte passos. Quais afirmações ligam corretamente os dois casos? (marque todas que valem)

- [x] Nos dois, o gradiente é um produto de muitos fatores, e fatores menores que 1 encolhem exponencialmente.
- [x] Nos dois, o remédio estrutural cria um caminho em que o sinal é somado em vez de multiplicado.
- [x] Na RNN, cada passo de tempo é uma camada a mais no caminho de volta do erro.
- [ ] Nos dois, o problema se resolve aumentando a capacidade do modelo.

> **gabarito:** produto de fatores · caminho aditivo · passo de tempo é camada
> **porque:** É o mesmo diagnóstico em duas dimensões, profundidade e tempo, e é por isso que a LSTM aparece na mesma tabela de remédios das conexões residuais: as duas criam um canal por onde o erro passa somado.
>
> A alternativa errada é a tentação comum, e ela falha pelo mesmo motivo nos dois casos. Mais capacidade dá mais espaço e não dá caminho; um estado oculto maior não faz o gradiente sobreviver a vinte multiplicações.
>
> Repare que o par também explica por que a atenção resolveu o lado das sequências de outro jeito: em vez de melhorar o caminho, ela o encurtou para um passo.
:::

:::exercicio {"id":"prova-parte-iii-q3","tipo":"multipla","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iii-4-visao.md:O2","livro/capitulos/iii-2-redes-neurais.md:O3"],"dificuldade":"media"}
Uma imagem 128×128 com 3 canais entra em duas alternativas: uma camada densa com 32 unidades, ou uma camada convolucional com 32 filtros 3×3. O que se pode afirmar sobre o número de pesos?

- [ ] São comparáveis, porque as duas têm 32 unidades de saída.
- [x] A densa depende do tamanho da imagem e a convolucional não: 1 572 864 contra 864 pesos.
- [ ] A convolucional tem mais pesos, porque cada filtro atravessa os três canais.
- [ ] Não dá para comparar sem saber o tamanho do lote.

> **gabarito:** 1 572 864 contra 864
> **porque:** A densa liga cada pixel de cada canal a cada unidade: $128 \times 128 \times 3 \times 32 = 1\,572\,864$. A convolucional tem $3 \times 3 \times 3 = 27$ pesos por filtro, vezes 32 filtros, igual a **864**.
>
> A diferença decisiva não é o tamanho do número, é de onde ele vem. O total da convolucional não contém o tamanho da imagem em lugar nenhum; o da densa é proporcional a ele.
>
> A terceira alternativa acerta um fato (o filtro atravessa os três canais) e o usa para concluir o contrário do que ele implica. Atravessar os canais é o que faz o filtro ter 27 pesos em vez de 9, e mesmo assim ele fica quatro ordens de grandeza abaixo da densa.
:::

:::exercicio {"id":"prova-parte-iii-q4","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iii-5-sequencias-linguagem.md:O4","livro/capitulos/iii-4-visao.md:O1"],"dificuldade":"dificil"}
O que a AlexNet em duas colunas e a remoção da recorrência em 2017 têm em comum?

- [ ] Os dois foram escolhas teóricas, justificadas por poder de representação.
- [x] Os dois foram decididos por restrição material: memória de 3 GB num caso, paralelismo em GPU no outro.
- [ ] Os dois aumentaram o número de parâmetros para ganhar capacidade.
- [ ] Os dois substituíram uma arquitetura que não conseguia representar o problema.

> **gabarito:** restrição material nos dois casos
> **porque:** O artigo da AlexNet diz que a rede foi espalhada em duas GPUs porque uma só tinha 3 GB; o de 2017 justifica a remoção da recorrência por paralelismo e tempo de treino. Nenhum dos dois argumentos é sobre o que a arquitetura consegue representar.
>
> A quarta alternativa é a leitura mais comum e é falsa nos dois casos. A recorrência **representava** dependências longas em princípio; o problema era treiná-la. E a AlexNet em duas colunas não representa nada que uma coluna não representasse.
>
> A lição que os dois casos sustentam junta-se a Playfair e ao cubo OLAP: falta de recurso produz forma nova, a forma sobrevive à restrição que a gerou, e a geração seguinte a estuda como se fosse princípio.
:::

:::exercicio {"id":"prova-parte-iii-q5","tipo":"numerica","objetivo":"O1","secao":"prova","objetivos":["livro/capitulos/iii-2-redes-neurais.md:O3","livro/capitulos/iii-4-visao.md:O2"],"dificuldade":"facil"}
Uma camada densa recebe 64 entradas e produz 16 saídas, com viés. Quantos parâmetros treináveis ela tem?

> **gabarito:** 1040
> **porque:** $64 \times 16 = 1\,024$ pesos, mais 16 vieses, um por unidade de **destino**. Total **1 040**.
>
> A regra `e × s + s` é a mesma que a convolução usa numa forma diferente: lá o que se repete são os pesos do filtro em todas as posições, e o viés continua sendo um por filtro. Nos dois casos o viés acompanha a unidade de saída, nunca a de entrada.
>
> É o erro que não aparece como erro de matemática: ele vira exceção de dimensão, ou pior, uma soma que passa por *broadcasting* e treina errado.
:::

:::exercicio {"id":"prova-parte-iii-q6","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iii-3-treinar-redes-profundas.md:O3","livro/capitulos/iii-4-visao.md:O4"],"dificuldade":"media"}
Uma equipe treina um classificador de radiografias e aplica, como aumentação, rotações de até 180° e espelhamento vertical. Além disso, usa dropout forte. O vão entre treino e validação não fecha.

Qual crítica é a mais precisa?

- [ ] O dropout está forte demais e impede a rede de aprender.
- [x] A aumentação escolhida gera imagens que não existem na clínica, então ela gasta capacidade em invariâncias falsas em vez de reduzir o vão.
- [ ] Radiografias não admitem aumentação de nenhum tipo.
- [ ] O problema é de gradiente, e a solução é trocar a inicialização.

> **gabarito:** a aumentação gera imagens que não existem no domínio
> **porque:** A regra é uma só e é sobre o domínio: a transformação preserva o rótulo **aqui**? Uma radiografia de tórax girada 180° produz uma imagem que a clínica nunca gera, e treinar com ela ensina a rede a ser invariante a algo que nunca varia.
>
> A terceira alternativa exagera para uma proibição. Aumentação em radiografia é possível e útil, desde que corresponda à variação real do exame: pequenas translações e rotações de poucos graus, variação de contraste, ruído.
>
> A quarta troca de família de problema. Vão entre treino e validação é generalização, e gradiente é otimização — o mesmo tipo de confusão que faz alguém acrescentar dropout a uma perda que não se move.
:::

:::exercicio {"id":"prova-parte-iii-q7","tipo":"multipla-multi","objetivo":"O3","secao":"prova","objetivos":["livro/capitulos/iii-6-modelos-de-fundacao.md:O2","livro/capitulos/iii-5-sequencias-linguagem.md:O3"],"dificuldade":"dificil"}
Um sistema de busca semântica usa embeddings contextuais e um índice de 200 mil documentos. Quais afirmações são corretas? (marque todas que valem)

- [x] O vetor de uma palavra depende da frase em que ela aparece, ao contrário do embedding estático.
- [x] A busca por embedding pode achar documentos que não repetem nenhuma palavra da consulta.
- [x] O ganho sobre a busca por termos precisa ser medido, e não presumido.
- [ ] Como os embeddings vêm de um Transformer, a similaridade entre dois documentos é calculada por autoatenção entre eles.

> **gabarito:** vetor depende da frase · acha sem repetir palavra · o ganho se mede
> **porque:** As três corretas separam representação de recuperação. O modelo produz vetores; a busca compara vetores. São etapas distintas, e a segunda não usa o mecanismo interno da primeira.
>
> É exatamente aí que a alternativa errada tropeça. A autoatenção acontece **dentro** de uma sequência, quando o modelo calcula a representação; a comparação entre dois documentos indexados é uma operação de similaridade sobre vetores prontos, tipicamente cosseno.
>
> Confundir as duas coisas leva a expectativas erradas de custo: a similaridade no índice é barata e linear no número de documentos, enquanto a autoatenção é quadrática no comprimento da sequência.
:::

:::exercicio {"id":"prova-parte-iii-q8","tipo":"multipla","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iii-6-modelos-de-fundacao.md:O4","livro/capitulos/iii-4-visao.md:O3"],"dificuldade":"media"}
Transferência de aprendizado em visão e recuperação em linguagem resolvem problemas diferentes. Qual comparação é correta?

- [ ] As duas evitam treinar do zero, e por isso são a mesma estratégia em domínios diferentes.
- [x] A transferência aproveita **representações** já aprendidas e continua nos pesos; a recuperação fornece **fato** de fora dos pesos, e é o que serve quando o conhecimento muda.
- [ ] A recuperação substitui a transferência sempre que houver documentos disponíveis.
- [ ] A transferência serve para dado escasso, e a recuperação para dado abundante.

> **gabarito:** representações nos pesos contra fato fora deles
> **porque:** A transferência resolve escassez de **rótulo**: bordas e texturas já aprendidas valem no domínio novo, e você treina uma cabeça sobre features prontas. A recuperação resolve outra coisa: conhecimento que muda e resposta que precisa citar a fonte.
>
> A primeira alternativa junta as duas por uma semelhança superficial. "Não treinar do zero" descreve o efeito de ambas e não descreve o que cada uma entrega.
>
> A quarta inverte o critério da recuperação, que não é sobre volume de dados de treino e sim sobre volatilidade do conhecimento e exigência de procedência.
:::

:::exercicio {"id":"prova-parte-iii-q9","tipo":"multipla","objetivo":"O2","secao":"prova","objetivos":["livro/capitulos/iii-2-redes-neurais.md:O4","livro/capitulos/iii-3-treinar-redes-profundas.md:O1"],"dificuldade":"dificil"}
Duas redes idênticas, com o mesmo dado e a mesma taxa, chegam a resultados diferentes: uma resolve o problema, a outra empaca com a perda parada num patamar. A única diferença é a semente da inicialização.

O que isso demonstra sobre o teorema da aproximação universal?

- [ ] Que o teorema está errado, porque garante que a rede resolve e ela não resolveu.
- [x] Que ele fala de **representabilidade** e não de **treinabilidade**: garante que existe configuração de pesos que resolve, sem garantir que a busca chegue até ela.
- [ ] Que o teorema só vale para redes com uma camada escondida.
- [ ] Que a semente precisa entrar como hiperparâmetro de busca.

> **gabarito:** representabilidade não é treinabilidade
> **porque:** O espaço de hipóteses continha a solução nos dois casos — é a mesma arquitetura. O que mudou foi de onde a descida partiu, e uma delas caiu num mínimo local.
>
> "Não construtivo" é o termo exato: garante-se que o objeto existe sem dar receita para construí-lo, nem promessa de que o gradiente descendente, saindo de onde você começou, vá encontrá-lo.
>
> A quarta alternativa propõe algo que se faz na prática e não é o que o caso demonstra. Rodar com várias sementes é mitigação sensata; o ponto aqui é conceitual, e é a distinção que explica os vinte anos entre 1986 e as redes profundas que funcionam.
:::

:::exercicio {"id":"prova-parte-iii-q10","tipo":"multipla-multi","objetivo":"O4","secao":"prova","objetivos":["livro/capitulos/iii-6-modelos-de-fundacao.md:O1","livro/capitulos/iii-3-treinar-redes-profundas.md:O4"],"dificuldade":"media"}
Uma equipe tem duas semanas, pouco dado rotulado e um modelo de fundação disponível. Quais decisões são coerentes com os critérios do livro? (marque todas que valem)

- [x] Começar por prompt e só subir de degrau com evidência de que ele não bastou.
- [x] Preferir um otimizador que perdoe taxa mal escolhida enquanto tudo ainda muda.
- [x] Calcular a linha de base trivial antes de qualquer comparação.
- [ ] Fazer fine-tuning completo de saída, porque é o mais poderoso e o prazo é curto.

> **gabarito:** prompt primeiro · otimizador que perdoa · linha de base antes
> **porque:** As três corretas compartilham um critério: **o que é escasso agora**. Com duas semanas e tudo em movimento, o escasso é o tempo da equipe, e cada decisão remove uma variável do problema em vez de acrescentar uma.
>
> A alternativa errada inverte a relação entre poder e prazo. Fine-tuning completo é o degrau mais caro em máquina, tempo e artefato produzido, e gastá-lo antes de saber se era necessário consome justamente as duas semanas.
>
> A linha de base trivial aparece aqui porque ela é o gesto mais barato do livro e o mais pulado: sem ela, "funcionou" não tem contra o quê ser dito.
:::
