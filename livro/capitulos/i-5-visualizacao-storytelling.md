# I.5 — Visualização e Storytelling

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Escolher o tipo de gráfico adequado à pergunta e ao tipo de variável.
- **O2.** Identificar distorções visuais que induzem a conclusões erradas.
- **O3.** Construir uma narrativa de dados com começo, tensão e recomendação.
- **O4.** Adaptar a mesma análise para públicos técnico e executivo.

## O problema: quando o gráfico não muda nada

Uma análise que ninguém entende não muda decisão nenhuma — e uma análise que não muda decisão nenhuma não valeu o custo.

O [capítulo I.4](i-4-analise-exploratoria.md) é olhar para **descobrir**: você desenha vinte gráficos feios, para si mesmo, e joga dezenove fora. Este capítulo é outra coisa: mostrar para **convencer**. O público é outro, o tempo de atenção é outro, e o erro também é outro. Lá o risco era não ver o padrão; aqui o risco é o leitor ver um padrão que não existe — e decidir com base nele. O [capítulo II.8](ii-8-do-modelo-a-decisao.md) é onde a decisão acontece de fato; este é a ponte.

Visualização é interface. Como toda interface, ela pode ser honesta ou pode enganar — inclusive sem que ninguém tenha querido enganar.

## De onde isto veio

**O aperto.** Fim do século XVIII. O comércio internacional cresce, os governos precisam acompanhá-lo, e os números existem em um único formato: **tabelas**. William Playfair, engenheiro e economista político escocês, queria algo que a tabela não dava: que um leitor apreendesse uma tendência de décadas **de relance**, sem somar coluna nenhuma.

**O que se fazia antes.** Tabela de números, lida linha a linha. Para comparar dois anos, o leitor fazia a subtração de cabeça; para ver uma tendência de trinta anos, fazia trinta.

**A virada.** Usar **posição** e **comprimento** para representar quantidade. Se a quantidade vira distância no papel, comparar deixa de ser aritmética e vira percepção. Dessa ideia saem o gráfico de linhas e o de barras — os dois nascem ali.

**A ideia reaproveitável, e é o achado deste capítulo: uma restrição de dados pode gerar uma forma nova.** O atlas de Playfair é feito de séries temporais: 34 pranchas de importação e exportação ao longo dos anos, todas em linha. Mas para a Escócia ele tinha os dados de um único ano, 1781. Sem eixo do tempo não há linha a traçar. A saída foi desenhar 34 **barras**, uma para cada sentido do comércio com 17 parceiros. Beniger & Robyn resumem: *"Playfair was driven to this invention by a lack of data"*. Ou seja: **a barra não é uma linha simplificada — é a resposta a uma pergunta que a linha não podia responder.** Guarde isso, porque é a razão de o próximo tópico existir: cada forma responde a um tipo de pergunta, e usar a forma errada é responder outra coisa.

É o mesmo padrão do [capítulo III.1](iii-1-neuronio-artificial.md), em que McCulloch e Pitts fazem um neurônio **sem aprendizado** porque não havia como treinar, e do [capítulo II.6](ii-6-analise-multidimensional.md), onde o cubo OLAP pré-computa porque a consulta era lenta demais. Restrição material gera forma nova; e a forma sobrevive à restrição que a criou.

**O nome.** *The Commercial and Political Atlas*, 1786 (com uma edição preliminar privada em 1785). O próprio Playfair explicou por que insistia: *"As the knowledge of mankind increases, and transactions multiply, it becomes more and more desirable to abbreviate and facilitate the modes of conveying information."*

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | Playfair, *The Commercial and Political Atlas* (1786; edição preliminar privada em 1785), e a invenção do gráfico de linhas e do de barras |
| ⏳ | Que antes disso o padrão fosse a tabela lida linha a linha |
| ⏳ | A citação de Beniger & Robyn (1978), *"driven to this invention by a lack of data"*, tomada de [friendly.github.io/HistDataVis](https://friendly.github.io/HistDataVis/ch05-playfair.html) — fonte secundária que cita a primária; **não conferida** em Beniger & Robyn |
| ⏳ | A frase do próprio Playfair — citada de forma consistente em várias secundárias; **não conferida** na edição de 1786 |
| 📖 | A leitura de que "uma restrição de dados pode gerar uma forma nova", e o paralelo com os capítulos III.1 e 23 |

## Fundamentos: a pergunta escolhe o gráfico

Não se escolhe gráfico por gosto nem por variedade. Escolhe-se pela pergunta que ele responde.

| A pergunta | A forma | Por quê |
|---|---|---|
| **Comparação** — quem é maior? | barra | comprimento a partir de uma base comum é o que o olho compara melhor |
| **Evolução** — para onde está indo? | linha | a inclinação vira tendência, sem esforço |
| **Distribuição** — como os valores se espalham? | histograma, boxplot | mostra forma, cauda e assimetria, que a média esconde |
| **Relação** — X anda junto com Y? | dispersão | dois eixos, um ponto por observação |
| **Composição** — de que isto é feito? | barra empilhada; pizza **às vezes** | só vale quando as partes somam um todo com significado |

O **boxplot** dessa tabela é de Tukey, e é o mesmo do [capítulo I.4](i-4-analise-exploratoria.md) — lá como ferramenta de descoberta, aqui como forma de comunicar espalhamento sem despejar a base inteira na tela.

### Por que a pizza quase sempre perde

A pizza codifica quantidade em **ângulo** (e área). A barra codifica em **comprimento**. O olho humano compara comprimentos com precisão e ângulos com dificuldade: numa pizza de seis fatias parecidas, quase ninguém acerta a ordem — e ordenar é justamente a pergunta mais comum.

A regra prática: a pizza só se sustenta com **duas ou três** categorias, quando o todo importa mais que a ordem ("dois terços da receita vêm de um produto"). Fora disso, use barra. E nunca ponha pizza em 3D com fatia destacada: a perspectiva aumenta a área das fatias da frente, ou seja, o enfeite muda o número lido.

:::exercicio {"id":"visualizacao-storytelling-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Você quer mostrar **como o tempo de resposta da API se espalha** entre as requisições — se há cauda longa, onde estão os piores casos. Qual forma responde a essa pergunta?

- [ ] Um gráfico de pizza com a fatia de cada faixa de tempo.
- [ ] Um gráfico de barras com o tempo **médio** de resposta por dia.
- [x] Um histograma (ou boxplot) dos tempos de resposta.
- [ ] Um gráfico de linhas do tempo médio ao longo da semana.

> **gabarito:** Histograma ou boxplot
> **porque:** A pergunta é de **distribuição**, isto é, como os valores se espalham, e só histograma e boxplot mostram forma, cauda e assimetria. Latência quase sempre tem cauda longa: a média fica confortável e o percentil 99 é o que derruba o usuário.
>
> As duas alternativas com **média** (barra por dia, linha na semana) são o erro mais comum e o mais caro: elas respondem "quanto, em geral" e "para onde está indo", que são perguntas de comparação e de evolução — e a média é exatamente a estatística que apaga a cauda que você foi procurar. A pizza é a pior de todas: fatiar o tempo em faixas transforma uma variável contínua em composição, e ainda entrega a comparação ao ângulo, que o olho lê mal.
> **volte para:** #fundamentos-a-pergunta-escolhe-o-grafico
:::

:::exercicio {"id":"visualizacao-storytelling-e5","tipo":"multipla","objetivo":"O1","dificuldade":"facil"}
A pergunta é "as sete regiões vendem quanto, e qual vende mais?". Qual forma responde melhor?

- [x] Barra, porque comprimento a partir de uma base comum é o que o olho compara melhor.
- [ ] Pizza, porque as sete regiões somam o total de vendas.
- [ ] Linha, ligando as sete regiões em ordem alfabética.
- [ ] Dispersão, com região no eixo X e vendas no eixo Y.

> **gabarito:** barra
> **porque:** A pergunta é de **comparação**, e a tabela do capítulo dá a forma direto: barra. A justificativa não é estética, é perceptiva — comprimento medido de uma base comum é a codificação que o olho humano lê com mais precisão.
>
> A pizza é a alternativa que parece defensável, porque as sete regiões de fato somam um todo. Só que a pergunta pede **ordem**, e é justamente nisso que a pizza falha: com sete fatias parecidas, quase ninguém acerta qual é a maior. Ela se sustenta com duas ou três categorias, quando o todo importa mais que a ordem.
>
> A linha é pior do que parece: ligar regiões sugere continuidade entre categorias que não têm ordem natural, e a inclinação entre "Nordeste" e "Norte" não significa nada.
> **volte para:** #fundamentos-a-pergunta-escolhe-o-grafico
:::

:::exercicio {"id":"visualizacao-storytelling-e6","tipo":"multipla-multi","objetivo":"O1","dificuldade":"dificil"}
Uma equipe precisa mostrar quatro coisas sobre a mesma base. Quais pareamentos entre pergunta e forma seguem a tabela do capítulo? (marque todos que valem)

- [x] "O ticket médio subiu ou caiu ao longo de 24 meses?" → linha.
- [x] "Clientes que compram mais também devolvem mais?" → dispersão.
- [x] "Como se espalham os prazos de entrega?" → histograma ou boxplot.
- [ ] "Qual das nove categorias de produto vende mais?" → pizza.
- [ ] "O churn foi de 4,1%" → gráfico de rosca com o percentual destacado.

> **gabarito:** evolução por linha · relação por dispersão · distribuição por histograma
> **porque:** As três corretas são leitura direta da tabela, e cada uma escolhe a forma pelo que o olho precisa fazer: seguir uma inclinação, ver dois eixos ao mesmo tempo, ou perceber forma e cauda.
>
> A pizza com nove categorias é o caso que a seção seguinte desmonta: a pergunta é de ordem, e ângulo é a codificação que o olho lê pior.
>
> A última é a mais fina, e é a regra que quase nunca se aplica: às vezes a melhor visualização é **nenhuma**. Quando a resposta é um número só, o gráfico não acrescenta informação, só tinta — e uma rosca para exibir um percentual é tinta pura, com a agravante de codificar em ângulo aquilo que o texto já disse com precisão.
> **volte para:** #fundamentos-a-pergunta-escolhe-o-grafico
:::

## Como um gráfico mente sem dizer uma mentira

Nenhum dos truques abaixo falsifica um número. Todos mudam a conclusão.

**Eixo Y truncado.** Comece o eixo em 97 em vez de 0 e uma queda de 3% vira um despenhadeiro. O leitor não lê a escala — lê a **altura da barra**. Como o comprimento é o que codifica a quantidade, cortar a base quebra a codificação: as barras deixam de ser proporcionais ao que representam. Regra: **barra sempre parte do zero**; linha pode não partir, porque nela o que codifica é a inclinação, não o comprimento — mas o corte precisa estar visível e declarado.

**Área por raio.** Ao dobrar o valor, dobrar o raio de um círculo quadruplica a área. O leitor lê a área. Um crescimento de 2× vira 4×.

**Excesso de tinta.** Grades pesadas, sombras, gradientes, 3D, ícones decorativos: tinta que não carrega informação. Ela não só polui — ela compete com o dado pela atenção, e às vezes vence.

**Cor sem propósito.** Cor é para destacar (uma série importa, o resto é cinza), para ordenar (escala contínua clara→escura) ou para categorizar (poucas cores distintas). Escolher paleta arco-íris para dados ordenados inventa fronteiras que não existem. E cerca de um em cada doze homens tem alguma forma de daltonismo: **nunca use verde/vermelho como o único sinal** de bom/ruim — acrescente forma, posição ou rótulo. Um gráfico que só funciona colorido também não funciona impresso em preto e branco.

:::exercicio {"id":"visualizacao-storytelling-e2","tipo":"aberta","objetivo":"O2","pontos":3,"dificuldade":"dificil"}
Um gerente leva à diretoria um gráfico de barras com a satisfação do cliente nos últimos quatro trimestres: 88,1 · 88,4 · 88,9 · 89,2. O eixo Y começa em 88 e termina em 89,5. Não há nota de rodapé. O título é "Satisfação do cliente". Na tela, a última barra tem cerca de **onze vezes** a altura da primeira, e a diretoria aprova mais verba para o programa.

Julgue o gráfico: o que está errado, por que engana, e como você o refaria.

> **rubrica:** identifica o eixo Y truncado como o problema central;
> explica que em barra o comprimento codifica a quantidade, então cortar a base torna as barras não proporcionais aos valores;
> observa que a variação real é pequena (cerca de 1,1 ponto, ~1%) e que a impressão visual (~11×) não corresponde a ela;
> propõe uma correção concreta — barra a partir do zero, ou trocar por linha com o corte de escala declarado e visível;
> menciona o título como parte do problema ou da solução (rótulo em vez de conclusão), ou aponta a ausência de contexto (meta, margem de erro, série mais longa)
> **porque:** Nenhum número foi falsificado — e é isso que torna o caso instrutivo. O engano está na **codificação**. Numa barra, a quantidade é o comprimento medido a partir de uma base comum; ao começar o eixo em 88, o comprimento passa a representar "quanto excede 88", que não é a grandeza do título. Daí a distorção: 1,1 ponto de variação real vira uma diferença visual de cerca de onze vezes.
>
> A correção mínima é a base zero — e note o efeito: com o eixo do zero, as quatro barras ficam praticamente idênticas, que é a verdade do dado. Se a variação pequena for genuinamente relevante (satisfação move-se devagar), a saída honesta não é truncar em silêncio: é trocar para **linha**, onde o codificador é a inclinação, com a escala declarada, mais a meta e a série histórica para dar referência. E vale reparar no título: "Satisfação do cliente" é rótulo dos dados, não conclusão — ele delega ao gráfico distorcido o trabalho de afirmar o que o autor não escreveu. Um título que dissesse "Satisfação subiu 1,1 ponto em um ano" teria denunciado o próprio gráfico.
> **volte para:** #como-um-grafico-mente-sem-dizer-uma-mentira
:::

:::exercicio {"id":"visualizacao-storytelling-e7","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Por que a regra "barra sempre parte do zero" não se aplica igualmente a um gráfico de linha?

- [ ] Porque linha é usada para dados contínuos, e barra para categorias.
- [x] Porque em barra quem codifica a quantidade é o comprimento, e em linha é a inclinação.
- [ ] Porque linhas são mais difíceis de distorcer do que barras.
- [ ] Porque a regra vale para as duas, e a exceção não existe.

> **gabarito:** o que codifica muda de uma forma para a outra
> **porque:** É o critério que sustenta a regra, e é o que a torna aplicável em vez de decorável. Numa barra, a quantidade é o comprimento medido de uma base comum, então mover a base quebra a proporção: as barras deixam de representar os valores.
>
> Numa linha, quem carrega a informação é a inclinação entre pontos, e ela sobrevive a um eixo que não começa no zero. Por isso o corte é permitido ali — desde que **visível e declarado**, que é a segunda metade da regra e a que costuma sumir.
>
> A terceira alternativa é falsa e perigosa: linha se distorce com facilidade, pela escala do eixo e pela razão entre largura e altura, que muda a inclinação aparente sem tocar em número nenhum.
> **volte para:** #como-um-grafico-mente-sem-dizer-uma-mentira
:::

:::exercicio {"id":"visualizacao-storytelling-e8","tipo":"multipla-multi","objetivo":"O2","dificuldade":"media"}
Um painel usa: escala arco-íris para uma variável ordenada de 0 a 100, verde e vermelho como único sinal de bom e ruim, e círculos cujo raio dobra quando o valor dobra. Quais críticas desta seção se aplicam? (marque todas que valem)

- [x] O arco-íris inventa fronteiras que não existem numa variável ordenada.
- [x] Verde e vermelho sozinhos excluem parte dos leitores, e falham em preto e branco.
- [x] Dobrar o raio quadruplica a área, e o leitor lê a área.
- [ ] Círculos nunca devem ser usados para codificar quantidade, em nenhuma situação.

> **gabarito:** arco-íris em dado ordenado · verde e vermelho como único sinal · raio dobrado quadruplica a área
> **porque:** As três corretas são três dos quatro truques da seção, e nenhum deles falsifica um número: todos mudam a conclusão pela codificação.
>
> A do arco-íris é a menos óbvia. Uma variável ordenada pede uma escala que também seja ordenada, do claro ao escuro; o arco-íris tem saltos de matiz que o olho lê como fronteiras de categoria, e o leitor passa a ver grupos onde há um contínuo.
>
> A alternativa errada transforma uma crítica específica em proibição geral, que é o erro típico de quem decorou a regra. O problema não é o círculo: é codificar no raio o que o leitor lê como área. Codificando pela área, o círculo funciona.
> **volte para:** #como-um-grafico-mente-sem-dizer-uma-mentira
:::

## O gráfico que decide

Um gráfico de exploração pode ter cinco leituras. Um gráfico de apresentação tem **uma mensagem** — e o resto é ruído a remover.

Daí a regra mais barata e mais ignorada deste capítulo: **o título é a conclusão, não o rótulo dos dados.** Troque "Vendas por região" por **"Vendas caíram 30% no Sul"**. O primeiro obriga cada pessoa da sala a descobrir sozinha o que ver, e cinco pessoas descobrem cinco coisas. O segundo diz o que você viu — e assume a responsabilidade por ter dito.

A narrativa que sustenta o gráfico tem quatro tempos:

1. **Contexto** — o que era normal até aqui.
2. **Tensão** — o que mudou, e por que isso não pode continuar.
3. **Evidência** — o gráfico, com a mensagem no título.
4. **Recomendação** — o que fazer, com o custo e o risco de não fazer.

E a mesma análise se conta de dois jeitos, sem mudar de conclusão. Para o **time técnico**: metodologia, incerteza, o que foi descartado, os dados feios. Para a **diretoria**: a recomendação primeiro, um gráfico, o custo — e o resto no apêndice, disponível para quem pedir. Mudar a ordem e o nível de detalhe é adaptação; mudar a conclusão conforme a plateia é outra coisa, e tem outro nome.

Às vezes a melhor visualização é **nenhuma**: quando a resposta é um número só ("o churn foi de 4,1%"), o gráfico só adiciona tinta.

:::exercicio {"id":"visualizacao-storytelling-e3","tipo":"completar","objetivo":"O3","dificuldade":"facil"}
Complete a regra do título num gráfico de apresentação:

`O título de um gráfico que decide deve ser a ______, e não o rótulo dos dados.`

> **gabarito:** conclusão|conclusao|mensagem
> **porque:** O título é o único elemento que todo mundo na sala lê — inclusive quem não vai olhar os eixos. Gastá-lo com "Vendas por região" desperdiça a única linha garantida do slide e transfere ao público o trabalho de interpretar; "Vendas caíram 30% no Sul" entrega a leitura já feita.
>
> Há um efeito colateral útil: quando você é obrigado a escrever a conclusão no título, descobre se o gráfico realmente a sustenta. Se não sai um título afirmativo, ou o gráfico está errado, ou você ainda não sabe o que achou. É o mesmo teste do slide: se o slide tem duas mensagens, são dois slides.
> **volte para:** #o-grafico-que-decide
:::

:::exercicio {"id":"visualizacao-storytelling-e9","tipo":"multipla","objetivo":"O3","dificuldade":"media"}
Uma apresentação traz: o gráfico, o método usado, a conclusão e a lista de próximos passos, nessa ordem. Segundo os quatro tempos desta seção, o que falta?

- [ ] Nada: os quatro elementos estão presentes, apenas em outra ordem.
- [x] Faltam o contexto e a tensão, que são os dois primeiros tempos e o que dá sentido à evidência.
- [ ] Falta a metodologia detalhada, que deveria abrir a apresentação.
- [ ] Falta um segundo gráfico, para dar comparação ao primeiro.

> **gabarito:** faltam contexto e tensão
> **porque:** Os quatro tempos são contexto, tensão, evidência e recomendação. A apresentação descrita começa direto na evidência: o público recebe um gráfico sem saber o que era normal antes nem por que aquilo não pode continuar.
>
> É o defeito que faz uma boa análise não mudar nada. Sem tensão, a recomendação chega como opinião — a sala não tem como avaliar se a mudança justifica o custo, porque ninguém estabeleceu que havia um problema.
>
> Repare que o método aparece na apresentação e não está entre os quatro tempos. Ele não é dispensável, é **público-dependente**: para o time técnico entra no corpo, para a diretoria vai ao apêndice, disponível a quem pedir.
> **volte para:** #o-grafico-que-decide
:::

:::exercicio {"id":"visualizacao-storytelling-e10","tipo":"multipla","objetivo":"O3","dificuldade":"dificil"}
Você escreve o título do gráfico e não consegue formular uma frase afirmativa: sai sempre "Receita por canal" ou "Análise de churn". O que esse fato indica?

- [ ] Que o título deve mesmo ser neutro, para não induzir o público.
- [x] Que ou o gráfico não sustenta uma conclusão, ou você ainda não sabe o que achou, e os dois casos pedem trabalho antes da apresentação.
- [ ] Que faltam dados, e a análise deve ser refeita com uma amostra maior.
- [ ] Que o gráfico tem informação demais e precisa ser dividido em dois.

> **gabarito:** o gráfico não sustenta conclusão, ou você ainda não sabe o que achou
> **porque:** É o efeito colateral útil da regra do título, e ele funciona como teste barato. A obrigação de escrever uma afirmação força a verificar se a evidência a sustenta, e a dificuldade em escrevê-la é informação, não bloqueio de redação.
>
> A primeira alternativa é a defesa mais comum do título neutro, e ela troca responsabilidade por aparência de isenção. Um título que não afirma nada não deixa o público livre: deixa cada pessoa da sala descobrindo uma coisa diferente, e transfere ao gráfico o trabalho de dizer o que o autor não quis assinar.
>
> A quarta descreve um sintoma vizinho e distinto, que vale conhecer: se o slide tem duas mensagens, são dois slides. Aí o problema é excesso de conclusão, não ausência dela, e o título sai fácil — só que sai dois.
> **volte para:** #o-grafico-que-decide
:::

:::exercicio {"id":"visualizacao-storytelling-e11","tipo":"multipla","objetivo":"O4","dificuldade":"facil"}
O que muda ao adaptar a mesma análise da diretoria para o time técnico?

- [ ] A conclusão, que precisa ser mais cautelosa diante de um público especialista.
- [x] A ordem e o nível de detalhe: metodologia, incerteza e dados feios entram no corpo em vez de ficarem no apêndice.
- [ ] Os números, que para a diretoria são arredondados e para o time são exatos.
- [ ] Nada: uma boa análise se apresenta igual para qualquer público.

> **gabarito:** a ordem e o nível de detalhe
> **porque:** É a distinção que a seção faz com uma frase curta e dura: mudar a ordem e o nível de detalhe é adaptação, mudar a conclusão conforme a plateia é outra coisa, e tem outro nome.
>
> Para a diretoria, a recomendação vem primeiro, com um gráfico e o custo, e o resto fica disponível a quem pedir. Para o time técnico, o que estava no apêndice sobe: metodologia, incerteza, o que foi descartado e os dados feios são justamente o que aquele público precisa para avaliar se acredita.
>
> A terceira alternativa parece inofensiva e é uma versão pequena do mesmo problema: arredondar sem declarar muda o que o público consegue verificar. Arredondar tudo bem, esconder a precisão real não.
> **volte para:** #o-grafico-que-decide
:::

:::exercicio {"id":"visualizacao-storytelling-e12","tipo":"multipla-multi","objetivo":"O4","dificuldade":"media"}
Uma analista apresenta o mesmo estudo duas vezes. Quais diferenças entre as duas versões são adaptação legítima ao público? (marque todas que valem)

- [x] Na versão executiva, a recomendação abre a apresentação; na técnica, ela fecha.
- [x] Na versão técnica, o que foi descartado da amostra é discutido; na executiva, vai para o apêndice.
- [ ] Na versão executiva, o intervalo de incerteza é omitido porque "confunde".
- [x] Na versão executiva há um gráfico; na técnica, cinco.
- [ ] Na versão executiva, o efeito é descrito como confirmado; na técnica, como indício.

> **gabarito:** recomendação na abertura · descarte de amostra no apêndice · um gráfico contra cinco
> **porque:** As três corretas mudam ordem e profundidade, e qualquer pessoa das duas plateias que lesse as duas versões chegaria à mesma conclusão. É esse o teste.
>
> As duas erradas atravessam a linha, e é útil ver que elas atravessam de jeitos diferentes. Omitir a incerteza porque "confunde" não simplifica: remove a informação de que a conclusão pode estar errada, que é a que a diretoria mais precisa para decidir quanto apostar. E chamar o mesmo efeito de confirmado num slide e de indício no outro é dizer duas coisas diferentes, com a mesma assinatura embaixo.
>
> A regra que sobra é operacional: se as duas versões fossem impressas lado a lado, nenhuma frase de uma poderia contradizer a outra.
> **volte para:** #o-grafico-que-decide
:::

## Síntese — o que levar

- A forma segue a **pergunta**: comparação → barra; evolução → linha; distribuição → histograma/boxplot; relação → dispersão; composição → às vezes pizza, quase sempre barra.
- A **barra de Playfair nasceu de uma falta de dados** — um só ano, sem eixo do tempo. Restrição material gera forma nova, aqui como no [III.1](iii-1-neuronio-artificial.md) e no [II.6](ii-6-analise-multidimensional.md).
- **Comprimento se compara melhor que ângulo.** É a razão técnica de a barra vencer a pizza quase sempre.
- **Barra parte do zero.** Eixo truncado não falsifica número nenhum e ainda assim muda a conclusão — é a distorção mais comum e a mais fácil de flagrar.
- Tinta sem informação compete com o dado. Cor tem três empregos (destacar, ordenar, categorizar) e nunca deve ser o **único** sinal — daltonismo e impressão em cinza.
- Um gráfico de apresentação tem **uma** mensagem, e ela vai no **título**. Rótulo de dados terceiriza a conclusão para a plateia.
- Explorar (cap. I.4) é para você; comunicar (este) é para quem decide (cap. II.8). Muda o público, muda o gráfico — não a conclusão.

:::exercicio {"id":"visualizacao-storytelling-e4","tipo":"aberta","objetivo":"O4","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Seu modelo mostrou que a inadimplência se concentra num canal de venda específico, e a estimativa tem incerteza considerável. Conte o mesmo achado **duas vezes**: em três minutos para a diretoria e em quinze para o time técnico. Diga o que entra em cada versão — e, sobretudo, **o que não pode mudar entre as duas**.

> **rubrica:** diz o que entra na versão executiva (o achado, a consequência e a recomendação) e o que entra na técnica (método, incerteza quantificada, limitação e o que faria a conclusão cair);
> identifica explicitamente o que **não pode mudar**: o achado, os números e a incerteza — e justifica por que mudá-los seria mentir, não resumir;
> justifica cada corte pelo que o público **decide**, não pelo tempo disponível;
> não trata a versão executiva como a técnica encurtada, nem sacrifica a incerteza para caber em três minutos
> **porque:** Adaptar não é encurtar. As duas versões respondem a perguntas diferentes: a diretoria decide o que fazer, o time técnico decide se dá para confiar. Por isso o método sai da versão executiva sem prejuízo, já que quem decide o canal não precisa saber qual validação você usou, mas a **incerteza não sai de nenhuma das duas**.
>
> É aqui que quase toda apresentação escorrega, e o escorregão é sempre justificado pelo relógio: "não dava tempo de explicar o intervalo". O resultado é uma diretoria decidindo com uma certeza que ninguém tinha, e o custo aparece depois, quando o número não se confirma e a conversa vira sobre a sua credibilidade em vez de sobre a decisão.
>
> A regra que fecha o capítulo: **muda o público, muda o gráfico — não a conclusão.** Se as duas versões levam a decisões diferentes, uma das duas está errada, e é quase sempre a curta.
> **volte para:** #o-grafico-que-decide
:::

## Verificação

1. Um diretor pede "um gráfico das vendas". Que perguntas você faz antes de escolher a forma — e como cada resposta muda a escolha?
2. Pegue um gráfico de um jornal ou relatório desta semana. Ele trunca algum eixo, codifica quantidade em área, ou usa cor sem propósito? O que muda na conclusão se você corrigir?
3. Reescreva três títulos de gráficos que você já viu, transformando rótulo em conclusão. Em qual deles o gráfico **não** sustentava a conclusão que você quis escrever?

> Estas três não são corrigidas, e a omissão é deliberada: dependem de um material que só você tem à mão (o gráfico desta semana, os títulos que você já viu), e corrigir por rubrica um artefato que o corretor não viu seria fingir correção.
