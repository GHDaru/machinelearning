# III.3 — Treinar Redes Profundas

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-10 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar por que a inicialização dos pesos determina se a rede treina.
- **O2.** Diagnosticar gradientes que somem e que explodem pelos seus sintomas.
- **O3.** Aplicar dropout, normalização em lote e aumento de dados como regularização.
- **O4.** Escolher entre SGD com momento e otimizadores adaptativos, com critério.

## O problema: a rede de vinte camadas que fica parada

Uma rede de duas camadas treina quase sozinha. Uma de vinte fica parada.

A cena é sempre a mesma. A perda desce um pouco nas primeiras épocas e estaciona. Você reduz o passo de aprendizado; nada muda. Aumenta; a perda vira `NaN`. Troca o otimizador, troca a arquitetura, coleta mais dados. Nada muda. A rede tem vinte camadas e se comporta como se tivesse três — porque, na prática, ela tem três: as outras dezessete nunca receberam sinal para ajustar coisa alguma.

Isso não é uma anedota de iniciante. **Foi o estado normal do campo até cerca de 2010.** Sabia-se empilhar camadas; não se sabia treiná-las. E o que destravou não foi mais computador nem mais dado — foi entender o que estava acontecendo entre a saída e a primeira camada.

## De onde isto veio

**O aperto — Munique, 15 de junho de 1991.** Um aluno de **graduação** da Technische Universität München entrega uma *Diplomarbeit* de 74 páginas e faz o que ninguém tinha feito: em vez de propor mais um truque, ele **mede** por que o erro não chega às camadas do fundo.

Vale ler a folha de rosto com atenção, porque ela contraria a lembrança coletiva. O autor assina **Josef Hochreiter**, não "Sepp". O *Aufgabensteller*, o orientador formal, é o Prof. W. Brauer. Jürgen Schmidhuber aparece como *Betreuer*, o supervisor de fato. E o capítulo 4 do trabalho já se chama **"Konstanter Fehlerrückfluß"** — refluxo *constante* do erro. Isto é: **a LSTM de 1997 já estava nomeada em 1991**, seis anos antes de existir. A §2.3 diz, em alemão, que o produto dos pesos "exponentiell fällt bzw. steigt": cai ou cresce exponencialmente.

**O que se fazia antes.** Culpava-se a arquitetura, os dados, o passo de aprendizado. Tratava-se sintoma. Cada equipe tinha seu conjunto de superstições sobre o que fazia uma rede profunda treinar, e nenhuma delas explicava por que o remédio funcionava aqui e falhava ali.

**A virada.** Nomear a causa. O gradiente que chega à primeira camada é um **produto** de muitos fatores, um por camada atravessada. Produto de muitos fatores menores que 1 vai a zero exponencialmente; produto de fatores maiores que 1 explode do mesmo jeito. E daí segue a frase que organiza o capítulo inteiro: **nenhum hiperparâmetro conserta uma exponencial.** Ajustar a taxa de aprendizado contra um fator 10⁻¹² é discutir o centavo de uma dívida de milhões.

**A ideia reaproveitável.** *Diagnóstico antes do remédio — e o diagnóstico dura mais que o remédio.* O texto de 1991 não resolve o problema: ele o **mede**. Trinta e cinco anos depois, o remédio já mudou quatro vezes; o diagnóstico, não. Quem aprende remédios envelhece com eles; quem aprende o diagnóstico reconhece o mesmo problema na próxima arquitetura, que ainda não foi inventada.

**O nome.** *Vanishing gradient* é rótulo inglês, posterior. O original é alemão, e é uma descrição, não um apelido.

**O limite do que este capítulo afirma.** A citação corrente do problema, na literatura, costuma ser Bengio, Simard & Frasconi (1994), em inglês. **Não conseguimos conferir se aquele artigo cita a tese de 1991.** Então o capítulo diz duas coisas e para: Hochreiter mediu o fenômeno em 1991, em alemão; e a citação que circula é de 1994. Ele **não afirma** que houve omissão de crédito — isso exigiria a leitura que não fizemos.

E há o desfecho que quebra o padrão dos capítulos [II.2](ii-2-modelos-lineares.md), [III.1](iii-1-neuronio-artificial.md) e [IV.1](iv-1-nao-supervisionado.md), onde crédito não segue descoberta e sim comunicação: **Hochreiter não foi apagado.** Ele volta em 1997 com a LSTM (*Long Short-Term Memory*), a partir do mesmo diagnóstico, e leva o crédito. Este é o caso **atenuado** do padrão: comunicar tarde, ou no idioma errado, custou a prioridade sobre o problema — não a carreira de quem o formulou.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ | A folha de rosto e a estrutura da Diplomarbeit de 74 páginas (15/06/1991, TUM): assinatura "Josef Hochreiter", Aufgabensteller **W. Brauer**, Betreuer **J. Schmidhuber**, capítulo 4 "Konstanter Fehlerrückfluß" e a §2.3 ("exponentiell fällt bzw. steigt") — [PDF](https://people.idsia.ch/~juergen/SeppHochreiter1991ThesisAdvisorSchmidhuber.pdf), **lido no original** |
| ✓ᵐ | Bengio, Simard & Frasconi (1994) como a citação corrente do problema em inglês |
| ❌ | **Se o artigo de 1994 cita a tese de 1991** — procuramos e não conseguimos conferir. É por isso que o capítulo não afirma omissão de crédito |
| ✓ᵐ | Glorot & Bengio (AISTATS 2010); Nair & Hinton (ICML 2010); Glorot, Bordes & Bengio (AISTATS 2011); Kingma & Ba (2014); Srivastava, Hinton *et al.* (JMLR 2014); Ioffe & Szegedy (2015); He, Zhang, Ren & Sun (ICCV 2015) — metadados conferidos, artigos não abertos |
| ✓ᵐ | Santurkar *et al.*, *How Does Batch Normalization Help Optimization? (No, It Is Not About Internal Covariate Shift)* — [arXiv:1805.11604](https://arxiv.org/abs/1805.11604) |
| ⏳ | "Adam" como *adaptive moment estimation*; e a anedota do caixa de banco que roda de guichê para impedir conluio, contada como origem do dropout — não conferida em fala primária |
| 📖 | A leitura de que o diagnóstico de 1991 sobreviveu a quatro gerações de remédio, e de que este é o caso **atenuado** do padrão de crédito dos capítulos II.2, 08 e 18 |

## Fundamentos: o gradiente é um produto, e produtos são traiçoeiros

A retropropagação leva o erro da saída até a primeira camada aplicando a regra da cadeia, camada por camada. Cada camada atravessada **multiplica** o que passou por ela. O gradiente que chega lá embaixo não é uma soma de contribuições: é um produto de vinte fatores.

Some multiplique. A derivada da sigmoide vale no máximo 0,25, e só no ponto central — nas pontas ela é praticamente zero. Com 0,25 por camada, dez camadas dão 0,25¹⁰ ≈ 0,00000095. O erro chega à primeira camada dividido por um milhão. Ela não está aprendendo devagar: ela não está aprendendo.

O outro lado da mesma moeda é a **explosão**. Se os fatores forem maiores que 1, o produto cresce na mesma velocidade, e o sintoma é diferente e inconfundível: a perda salta, vira `inf` e depois `NaN`, tipicamente em poucas iterações. A explosão tem remédio de uma linha — o **grampo de gradiente** (*gradient clipping*): se a norma do gradiente passar de um limite, reescale-a para o limite. Isso funciona porque a direção continua boa; só o tamanho estava absurdo. **A explosão é o caso fácil, e é sintomática: ela grita.** O desaparecimento é silencioso, e por isso é o problema caro.

Tudo isto é a otimização do [capítulo II.4](ii-4-otimizacao.md) — mesma descida, mesma perda, mesmo gradiente. O que a profundidade acrescenta não é uma teoria nova; é uma **cadeia longa de multiplicações** entre o erro e o parâmetro que você quer ajustar.

:::exercicio {"id":"treinar-redes-profundas-e1","tipo":"numerica","objetivo":"O2","dificuldade":"facil"}
Numa rede com sigmoide, suponha que cada camada atravessada multiplique o gradiente por **0,25** (o melhor caso da sigmoide). A partir de quantas camadas o gradiente que chega à primeira fica **abaixo de um milionésimo** (10⁻⁶) do que saiu da última?

Responda com um número inteiro de camadas.

> **gabarito:** 10 ± 0,4
> **porque:** É a conta `0,25ⁿ < 10⁻⁶`. Cada camada tira um fator 4: 0,25⁵ ≈ 0,00098 (um milésimo) e 0,25¹⁰ ≈ 0,00000095 — abaixo do milionésimo já na décima camada.
>
> O que importa não é o 10, é a **forma da curva**. Não há degradação suave: a cada cinco camadas o sinal perde três casas decimais. Por isso nenhum ajuste de taxa de aprendizado resolve — multiplicar o passo por 10 devolve uma casa de um buraco de seis. Compare com uma rede de 3 camadas (0,25³ ≈ 0,016, perfeitamente treinável) e você tem a razão de duas camadas treinarem sozinhas e vinte não treinarem de jeito nenhum.
> **volte para:** #fundamentos-o-gradiente-e-um-produto-e-produtos-sao-traicoeiros
:::

### Inicialização: por que zero não funciona e por que a variância importa

Inicializar todos os pesos com **zero** parece neutro e é fatal: todos os neurônios de uma camada calculam a mesma coisa, recebem o mesmo gradiente e se atualizam de forma idêntica para sempre. Uma camada de 512 neurônios simétricos é uma camada de 1 neurônio, com 512 vezes o custo. Quebrar a simetria é a primeira função do sorteio inicial.

Mas *qual* sorteio, e essa é a pergunta de verdade. Pesos grandes demais saturam as ativações e disparam a explosão; pequenos demais aceleram o desaparecimento. O que precisa ser preservado é a **variância do sinal** ao atravessar a camada — porque a variância do produto é o que decide se a cadeia encolhe ou cresce. Glorot & Bengio (2010) tratam disso, e repare no título: *Understanding the difficulty of training deep feedforward neural networks*. **Entender vem antes de consertar**; a fórmula de inicialização que hoje leva o nome deles é subproduto do estudo, não a tese dele.

Cinco anos depois, He *et al.* (2015) apontam a letra miúda: a dedução de Xavier supunha ativação **linear**, o que **é inválido sob ReLU** — que zera metade das entradas e, com isso, corta a variância pela metade. Daí a inicialização He, com o fator 2 que compensa exatamente essa perda. Não é um truque melhor: é a mesma conta refeita sob a hipótese certa.

:::exercicio {"id":"treinar-redes-profundas-e2","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Uma equipe troca a ativação de uma rede de 30 camadas de `tanh` para `ReLU` e mantém a inicialização de Xavier/Glorot, que vinha funcionando. O treino, que antes convergia devagar, agora estagna. Qual é a explicação mais precisa?

- [ ] A ReLU é inadequada para redes muito profundas; acima de ~20 camadas só ativações saturantes funcionam.
- [x] A dedução de Xavier supõe ativação aproximadamente linear; sob ReLU, metade das entradas é zerada e a variância do sinal encolhe camada a camada — a inicialização He corrige isso com o fator 2.
- [ ] O problema é a taxa de aprendizado: ReLU exige taxa menor, e basta dividi-la por 10.
- [ ] Inicialização não interage com a ativação; as duas escolhas são independentes e o problema está em outro lugar.

> **gabarito:** Xavier supõe ativação linear — hipótese inválida sob ReLU; use a inicialização He
> **porque:** Inicialização e ativação **não são escolhas independentes**: a inicialização existe para preservar a variância do sinal, e quanto de variância sobrevive depende de qual ativação está no caminho. A ReLU zera as entradas negativas, ou seja, descarta cerca de metade do sinal — algo que a dedução de Xavier, feita no regime linear, não previa. Trinta camadas de encolhimento de variância reproduzem o desaparecimento do gradiente com outra causa imediata e a mesma matemática por trás: um produto.
>
> Sobre as erradas: **a ReLU é justamente o que viabilizou redes profundas**, não o que as impede. **Dividir a taxa por 10** não muda a variância propagada — é o clássico ajuste de hiperparâmetro contra uma exponencial. E dizer que as duas escolhas são independentes é exatamente o mal-entendido que este exercício existe para desfazer.
> **volte para:** #inicializacao-por-que-zero-nao-funciona-e-por-que-a-variancia-importa
:::

### Ativação: a sigmoide satura, a ReLU não — e o neurônio morto é o preço

A sigmoide comprime qualquer entrada no intervalo (0, 1). Longe do centro, ela é quase plana — e ativação plana significa derivada quase zero, isto é, mais um fator minúsculo no produto. A **ReLU** (*Rectified Linear Unit*) troca isso por algo grosseiro e eficaz: zera o negativo e devolve o positivo intacto. Na região ativa, sua derivada é exatamente **1**, e um fator 1 não encolhe o produto.

A história de como ela entrou é instrutiva. Nair & Hinton (2010) a apresentam **pela porta de trás**, num artigo sobre máquinas de Boltzmann restritas. E quando Glorot, Bordes & Bengio (2011) a defendem de frente, o argumento principal não é velocidade — é **esparsidade**: com metade das unidades em zero, a representação fica esparsa, e isso é apresentado como virtude, não como efeito colateral.

O preço tem nome: **neurônio morto**. Uma unidade que passa a receber só entradas negativas devolve zero, tem derivada zero e nunca mais se atualiza — está desligada em definitivo. Variantes como *Leaky* ReLU e GELU existem para manter uma inclinação pequena no lado negativo e evitar exatamente isso.

## O kit de conserto: um diagnóstico, quatro remédios, vinte e cinco anos

Aqui está a competência que este capítulo quer formar: **reconhecer o mesmo diagnóstico sob remédios que não se parecem em nada.** "O gradiente é um produto, e produtos somem ou explodem" (1991) gerou quatro famílias de solução, escritas por gente diferente, em décadas diferentes, com vocabulários diferentes — e todas atacam a mesma multiplicação.

| Remédio | Como ataca o produto | Onde está no livro |
|---|---|---|
| **LSTM** (1997) | cria um canal de memória por onde o erro passa **sem ser multiplicado** | [cap. III.5](iii-5-sequencias-linguagem.md) |
| **Inicialização** (Xavier 2010, He 2015) | escolhe a variância inicial para que o produto **não encolha nem cresça** | seção acima |
| **ReLU** (2010–2011) | derivada **1** na região ativa: o fator deixa de reduzir | seção acima |
| **Conexão residual** (2015) | acrescenta um caminho **aditivo** que atravessa o bloco intacto | [cap. III.4](iii-4-visao.md) |

A conexão residual fecha o argumento de forma quase literária: se o problema é multiplicação, some. `saída = bloco(x) + x` dá ao gradiente uma rota direta até as camadas do fundo, e foi isso que tornou rotineiro treinar redes de mais de cem camadas. Com ela, He *et al.* (2015) reportam 4,94% de erro top-5 no ImageNet — **o primeiro resultado a passar o humano reportado, de 5,1%**.

### O resto do kit: normalização, dropout e otimizadores

**Normalização.** A *batch normalization* (Ioffe & Szegedy, 2015) padroniza as ativações de cada camada usando as estatísticas do lote; a *layer normalization* faz o mesmo usando as estatísticas de **cada exemplo**, dentro da camada — o que a torna a escolha quando o lote é pequeno ou o comprimento varia, como em sequências.

**Dropout.** Srivastava, Hinton *et al.* (JMLR, 2014) desligam unidades ao acaso durante o treino. Repare que este remédio resolve **outro** problema: é regularização, combate *overfitting*, não o gradiente. A anedota do caixa de banco que roda de guichê para impedir conluio entre funcionários, usada para explicar por que impedir a coadaptação entre neurônios ajuda, circula muito e **não foi conferida em fala primária**: ⏳.

**Otimizadores.** Adam (Kingma & Ba, 2014) mantém estimativas de primeiro e segundo momentos do gradiente e adapta o passo por parâmetro. Na prática: converge rápido e **perdoa uma taxa de aprendizado mal escolhida** — o que é exatamente sua virtude e seu risco, porque esconde diagnósticos. SGD (*Stochastic Gradient Descent*) com momento, bem ajustado e com boa agenda de taxa, ainda entrega generalização igual ou melhor em visão, ao custo de exigir mais ajuste manual. Critério honesto: **Adam para começar e para iterar rápido; SGD com momento quando o último ponto percentual importa e há orçamento para ajustar.** E nenhum dos dois conserta uma exponencial.

:::exercicio {"id":"treinar-redes-profundas-e4","tipo":"multipla","objetivo":"O4","dificuldade":"media"}
Uma equipe tem duas semanas para entregar a primeira linha de base de um classificador de imagens sobre um conjunto novo: a arquitetura ainda está em discussão e ninguém tem intuição sobre a taxa de aprendizado adequada. Dois meses depois, com a arquitetura congelada e a linha de base publicada, o time disputa décimos de ponto percentual e tem máquina ociosa à noite. Qual escolha de otimizador é a mais defensável em cada momento?

- [ ] SGD com momento nos dois: adaptativos generalizam pior, e generalizar é sempre o objetivo.
- [x] Adam no primeiro momento, SGD com momento no segundo: o primeiro perdoa a taxa mal escolhida enquanto tudo ainda muda; o segundo cobra ajuste e devolve o último ponto percentual.
- [ ] Adam nos dois: converge mais rápido, e tempo até o resultado é o critério que importa em ambos os casos.
- [ ] Indiferente: com uma boa agenda de taxa de aprendizado, os dois chegam ao mesmo lugar no mesmo tempo.

> **gabarito:** Adam no primeiro momento, SGD com momento no segundo
> **porque:** O critério não é qual otimizador é melhor — é **o que é escasso agora**. Na primeira fase o escasso é o seu tempo, e há muitas variáveis se movendo ao mesmo tempo; um otimizador que perdoa taxa mal escolhida remove uma delas. Na segunda fase o escasso é o último ponto percentual, e existe orçamento de máquina para o ajuste manual que o SGD com momento exige.
>
> A primeira alternativa acerta o fato (em visão, SGD com momento bem ajustado costuma generalizar igual ou melhor) e erra a conclusão: usá-lo na fase exploratória gasta as duas semanas ajustando taxa de aprendizado de uma arquitetura que vai mudar.
>
> A terceira ignora que a virtude do Adam é também seu risco: **perdoar taxa mal escolhida é esconder um diagnóstico.** Na fase em que você disputa décimos, esse diagnóstico é justamente o que você quer ver.
>
> A quarta é a mais perigosa por soar equilibrada. Se fosse indiferente, a literatura não teria vinte anos de discussão — e nenhuma das duas escolhas conserta uma perda que não se move, porque isso não é problema de otimizador: é a exponencial da seção anterior.
> **volte para:** #o-resto-do-kit-normalizacao-dropout-e-otimizadores
:::

## "Funciona" e "sabemos por quê" são duas afirmações

Este é o episódio mais didático do capítulo, e por isso tem seção própria.

Ioffe & Szegedy (2015) explicaram a *batch normalization* por um mecanismo: o **"internal covariate shift"** — a distribuição das entradas de cada camada mudaria durante o treino, e normalizar estabilizaria isso. A explicação é intuitiva, virou folclore de sala de aula e foi repetida em centenas de tutoriais.

Em 2018, Santurkar *et al.* publicam *How Does Batch Normalization Help Optimization? (No, It Is Not About Internal Covariate Shift)* e mostram que **o método funciona e a explicação não se sustenta**. A batch norm continua ajudando; a razão pela qual ajuda foi outra.

A lição vale muito além da normalização: **"funciona" e "sabemos por quê" são afirmações independentes, e a segunda pode cair sem derrubar a primeira.** É o mesmo padrão do Cauchy do [capítulo II.4](ii-4-otimizacao.md), que publicou o método do gradiente em 1847 sem prova de convergência — método correto, justificativa incompleta, décadas de uso proveitoso no meio.

A consequência prática é dura e útil: **não derive decisões de projeto de uma história de mecanismo que nunca foi testada.** Se a sua justificativa para usar um componente é a narrativa que veio no artigo, e não o efeito medido no seu problema, você está apostando na parte mais frágil da evidência.

:::exercicio {"id":"treinar-redes-profundas-e3","tipo":"aberta","objetivo":"O2","pontos":3,"dificuldade":"dificil"}
Uma equipe treina uma rede densa de 40 camadas com sigmoide, inicialização uniforme pequena e SGD. A perda cai de 2,30 para 2,25 na primeira época e depois não se move por 50 épocas. A acurácia fica em nível de acaso. Em três semanas, a equipe trocou o otimizador de SGD para Adam, depois para RMSProp, testou seis taxas de aprendizado e dobrou o conjunto de dados. Nada mudou.

Diga o que você mediria **antes** de propor qualquer correção, qual é o diagnóstico mais provável e o que faria em seguida.

> **rubrica:** propõe **medir antes de corrigir** — norma do gradiente por camada, e/ou distribuição das ativações por camada, comparando o topo com o fundo da rede;
> identifica o desaparecimento do gradiente como diagnóstico mais provável, ligando-o à sigmoide (derivada ≤ 0,25) elevada a ~40 camadas;
> explica **por que a troca de otimizador não podia funcionar**: otimizador reescala o passo, não restaura sinal que chegou como 10⁻²⁰ — nenhum hiperparâmetro conserta uma exponencial;
> propõe correções que atacam o produto (ReLU, inicialização He, conexões residuais, normalização), não hiperparâmetros;
> distingue os sintomas: perda travada = gradiente sumindo; perda em `NaN` = gradiente explodindo, e aí o remédio é o grampo
> **porque:** A resposta fraca escolhe um remédio ("use ReLU", "põe batch norm") e pode até acertar por sorte. A resposta forte faz o que a tese de 1991 fez: **mede primeiro**. Uma linha que imprime a norma do gradiente por camada encerra a discussão em minutos, e mostra a queda de várias ordens de grandeza entre a camada 40 e a camada 1.
>
> As três semanas perdidas são o conteúdo do exercício, não um detalhe do enunciado. Otimizador, taxa de aprendizado e volume de dados são todos ajustes **multiplicativos sobre um sinal que não existe**. Nenhum deles poderia funcionar, e isso era previsível antes do primeiro teste — bastava conhecer o diagnóstico.
>
> Sobre o critério de otimizador, que é o objetivo aqui: Adam é a escolha certa para iterar rápido e perdoa taxa mal escolhida; SGD com momento e boa agenda costuma generalizar igual ou melhor quando há orçamento de ajuste. Mas a pergunta "Adam ou SGD?" só é legítima **depois** que o sinal chega às camadas do fundo. Antes disso, ela é uma pergunta bem formulada sobre o problema errado.
> **volte para:** #o-kit-de-conserto-um-diagnostico-quatro-remedios-vinte-e-cinco-anos
:::

## Síntese — o que levar

- O gradiente que chega à primeira camada é um **produto** de um fator por camada. Produtos somem ou explodem exponencialmente.
- **Nenhum hiperparâmetro conserta uma exponencial.** Taxa, otimizador e volume de dados são ajustes multiplicativos sobre um sinal que já não existe.
- Os dois sintomas são opostos e inconfundíveis: **perda travada** = gradiente sumindo (silencioso, caro); **`NaN`** = gradiente explodindo (grita, e o grampo resolve).
- **Zero não inicializa nada**: mata a simetria entre neurônios. O que se escolhe de verdade é a **variância**.
- Inicialização e ativação **não são independentes**: Xavier supõe regime linear, He corrige para ReLU.
- **ReLU** troca saturação por derivada 1 — e cobra o **neurônio morto** como preço.
- **Dropout resolve outro problema** (overfitting), não o gradiente. Confundir os dois leva a aplicar o remédio errado com convicção.
- **Adam** para começar e iterar rápido; **SGD com momento** quando o último ponto percentual importa e há orçamento de ajuste.
- **A ideia exportável:** diagnóstico antes do remédio — e o diagnóstico dura mais que o remédio. Quatro gerações de solução, um único enunciado de 1991.
- **"Funciona" e "sabemos por quê" são afirmações independentes.** A batch norm é o caso-modelo: o método sobreviveu, a explicação não.

:::exercicio {"id":"treinar-redes-profundas-e5","tipo":"aberta","objetivo":"O3","secao":"verificacao","pontos":3,"dificuldade":"dificil"}
**Desafio de fechamento.** Você usa dropout, normalização em lote e aumento de dados no mesmo treino. Para cada um, diga qual problema ele ataca e como você **mediria** se está ajudando neste seu caso, **sem recorrer à justificativa que veio no artigo original**.

> **rubrica:** separa os alvos: dropout e aumento de dados atacam generalização (o vão entre treino e validação), enquanto a normalização em lote atua sobre a otimização — e não trata os três como "regularização" indistinta;
> propõe, para cada um, uma medição concreta e comparável — treinar com e sem o componente, tudo o mais igual, e olhar a quantidade que ele deveria mover;
> diz **qual quantidade** deve mudar em cada caso, e não apenas "ver se a acurácia melhora": o vão treino–validação para dropout e aumento, a velocidade de convergência e a tolerância à taxa de aprendizado para a normalização;
> não usa a explicação do artigo como evidência: a batch norm ajuda e a história do *internal covariate shift* não se sustenta, então justificar a escolha pelo mecanismo narrado é apoiar-se na parte mais frágil da evidência
> **porque:** A proibição do enunciado é o exercício. Estes três componentes entram em quase todo treino por hábito, e o hábito se justifica repetindo a história que veio no artigo — o que este capítulo mostrou ser exatamente o que pode cair sem derrubar o método.
>
> Trocar a narrativa pela medição é barato e quase ninguém faz: **um treino com e sem, tudo o mais igual**. O que custa é saber *o que olhar*, e é aí que o terceiro critério pega a resposta rasa. "Ver se melhora a acurácia" não distingue nada — se o dropout está ajudando, o sinal é o **vão** entre treino e validação encolhendo; se a normalização está ajudando, o sinal aparece na convergência e na tolerância à taxa de aprendizado, e pode vir **sem** ganho de acurácia final.
>
> E há a consequência que só aparece medindo: os três podem se sobrepor. Aumento de dados forte já reduz o vão, e o dropout por cima pode custar capacidade sem devolver generalização. Quem herdou os três de um tutorial nunca descobre isso, porque nunca rodou o treino sem um deles.
> **volte para:** #funciona-e-sabemos-por-que-sao-duas-afirmacoes
:::

## Verificação

1. Uma rede de 25 camadas trava com a perda praticamente constante desde a primeira época. Descreva, em ordem, as **duas medições** que você faria antes de mexer em qualquer hiperparâmetro — e diga o que cada resultado possível eliminaria como causa.
2. Explique por que inicializar todos os pesos com zero impede o aprendizado, e por que a resposta "sorteie valores pequenos" está incompleta. Que quantidade a inicialização precisa preservar, e por que ela muda quando a ativação passa de `tanh` para ReLU?

> Estas duas não são corrigidas, e a omissão é deliberada: valem como conversa de diagnóstico, em que a pergunta seguinte depende da sua resposta anterior.
