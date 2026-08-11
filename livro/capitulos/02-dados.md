# 02 — Dados

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-05 · [histórico](../HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](../GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Identificar as três fontes de vazamento de dados mais comuns e como cada uma se manifesta.
- **O2.** Projetar uma divisão treino/validação/teste que respeite a estrutura temporal e de grupo dos dados.
- **O3.** Escrever uma ficha de dataset (origem, licença, limitações conhecidas) antes de treinar.
- **O4.** Diagnosticar desbalanceamento e viés de seleção a partir da própria coleta.

## O problema: o resultado bom demais

O modelo aprende o que está nos dados — inclusive o que não deveria estar.

**Vazamento de dados** (*data leakage*) é a informação que existe no treino mas **não existirá no momento da predição**. Ele produz o resultado mais perigoso do Machine Learning: o resultado bom demais.

A assinatura é sempre a mesma, e você vai reconhecê-la depois deste capítulo:

1. Alguém reporta uma métrica excelente — 0,97 de AUC num problema que ninguém resolvia.
2. Ninguém desconfia, porque a notícia é boa e desconfiar de boa notícia é socialmente caro.
3. O modelo vai a produção.
4. O número desaba, e a investigação leva semanas.

O vazamento **não dá erro**. Não aparece em log, não quebra teste, e passa por todas as revisões de código — porque não é um bug de código. É um bug de **tempo**: uma coluna que só passa a existir depois do fato que você quer prever.

> **A heurística mais útil deste livro.** Resultado surpreendentemente bom é a pista mais confiável de que algo está errado. Antes de comemorar, procure o vazamento. Se não achar, procure de novo — e só então comemore.

## De onde isto veio

**O aperto.** Fim dos anos 2000, competições públicas de mineração de dados. Empresas e universidades passaram a publicar conjuntos de dados reais e premiar quem previsse melhor — e as competições começaram a **quebrar**, uma atrás da outra: INFORMS 2010, o desafio de rede social do IJCNN 2011, a KDD-Cup 2007 sobre o dado da Netflix. Não por trapaça: por vazamento.

O caso que virou emblema é a **KDD Cup de 2008**, de detecção de câncer em mamografia. Uma das colunas era o **identificador do paciente** — um número administrativo, sem nenhum conteúdo clínico. E ele tinha **poder preditivo enorme**.

**O que se fazia antes.** Tratava-se vazamento como descuido individual: alguém esqueceu de tirar uma coluna. Cada equipe descobria o seu, contava no corredor, e não havia vocabulário comum para o fenômeno.

**A virada.** Em 2012, Kaufman, Rosset, Perlich e Stitelman publicam *"Leakage in Data Mining: Formulation, Detection, and Avoidance"* e fazem o movimento que faltava: **transformar uma coleção de acidentes numa categoria com definição, taxonomia e método de detecção.** Vazamento deixa de ser azar e passa a ser algo que se procura de propósito.

**A ideia reaproveitável — e é a que dá título a este capítulo.** **Desempenho alto demais é sintoma, não vitória.** O identificador do paciente não sabia nada sobre câncer; sabia sobre **como o hospital organizou a fila** — que exames vinham de triagem de rotina e quais de encaminhamento suspeito. Todo vazamento é a mesma coisa dita de formas diferentes: **o modelo aprendeu o processo de coleta em vez do fenômeno.** Quando você vir um número bom demais, a pergunta não é "por que meu modelo é tão bom?", é **"o que, no jeito como esses dados foram produzidos, está me entregando a resposta?"**.

**O nome.** *Leakage* — a informação "vaza" do futuro para o passado, atravessando a fronteira temporal que deveria separar o que se sabe do que se quer prever.

### As fichas de dataset, e de onde a forma foi copiada

A **ficha de dataset** que este capítulo adota tem origem declarada, e ela não vem da computação. Gebru e coautoras propuseram os *Datasheets for Datasets* (2018; versão em *CACM*, 2021) fazendo uma analogia explícita com a **indústria eletrônica**, onde todo componente vem acompanhado de uma folha de dados descrevendo características de operação, resultados de teste e usos recomendados. A proposta é literalmente: por analogia, que todo conjunto de dados venha com a sua.

**A ideia reaproveitável.** **Importar uma forma madura de outra engenharia é mais barato que inventar uma.** A eletrônica levou décadas para padronizar o que entra numa folha de dados; Machine Learning copiou o formato pronto e ganhou o atalho. Vale olhar para os lados com mais frequência: o problema que parece novo no seu campo costuma ter uma solução estabilizada em outro.

**Procedência das afirmações desta seção:**

| Selo | Afirmação |
|---|---|
| ✓ᵐ | [Kaufman, Rosset, Perlich & Stitelman, *ACM TKDD* 6(4), art. 15, 2012](https://dl.acm.org/doi/10.1145/2382577.2382579) — obra, autoria, ano e veículo. **PDF localizado, não lido por inteiro** |
| ✓ᵐ | [Gebru *et al.*, *Datasheets for Datasets*, arXiv:1803.09010](https://arxiv.org/abs/1803.09010), 23/03/2018; versão em *CACM* 64(12), 2021. A analogia com a eletrônica está declarada no resumo |
| ⏳ | As competições citadas como gatilho (INFORMS 2010, IJCNN 2011, KDD-Cup 2007) e o caso do *Patient ID* na KDD Cup 2008 |
| ⏳ | A explicação de **por que** o identificador previa — a organização da fila do hospital. É a leitura corrente do caso; não conferida na primária |
| ❌ | **Datasets clássicos que envelheceram mal** por viés de seleção ou por questões éticas: casos existem e são citados na literatura, mas **nenhum foi verificado nesta passada**, e por isso nenhum é nomeado aqui |
| 📖 | As duas ideias reaproveitáveis |

## Fundamentos: as três fontes de vazamento

### 1. Alvo disfarçado — a coluna que só existe depois

A mais comum e a mais constrangedora. Um atributo que, na prática, é uma versão do alvo.

| Você quer prever | A coluna traiçoeira | Por que é vazamento |
|---|---|---|
| Se o cliente vai cancelar | `motivo_cancelamento` | só é preenchida **depois** do cancelamento |
| Se a transação é fraude | `valor_estornado` | o estorno acontece **após** a fraude ser detectada |
| Se o paciente tem a doença | `medicamento_prescrito` | a prescrição vem **depois** do diagnóstico |
| Se a máquina vai falhar | `data_da_manutencao_corretiva` | a corretiva é consequência da falha |

O teste é uma pergunta só, e ela precisa ser feita **para cada coluna**:

> No instante exato em que eu preciso fazer a predição, este valor já existe e já está preenchido?

Se a resposta for "não" ou "depende", a coluna sai. Fazer essa pergunta coluna a coluna parece burocracia até a primeira vez que ela salva um projeto.

### 2. Pré-processamento antes da divisão — o vazamento silencioso

Este é sutil, quase universal entre iniciantes, e não tem sintoma visível.

```python
# ERRADO — e ninguém percebe olhando
X = normalizar(X)                              # usa média e desvio de TUDO
treino, teste = dividir(X)                     # tarde demais

# CERTO
treino, teste = dividir(X)
media, desvio = ajustar_normalizador(treino)   # aprende SÓ no treino
treino = aplicar(treino, media, desvio)
teste  = aplicar(teste,  media, desvio)        # aplica o que veio do treino
```

Na versão errada, a média usada para normalizar o treino **contém informação dos exemplos de teste**. O modelo nunca viu as linhas do teste, mas viu uma estatística delas — e isso basta para inflar a métrica.

Vale para tudo que "aprende" alguma coisa dos dados: normalização, imputação de ausentes, seleção de atributos, codificação por alvo (*target encoding*), redução de dimensionalidade. A regra é única e não tem exceção:

> **Tudo que aprende dos dados aprende só do treino.** O teste é aplicado, nunca consultado.

O efeito costuma ser pequeno — décimos de ponto. É justamente por isso que é perigoso: pequeno demais para levantar suspeita, grande o bastante para decidir qual modelo vai a produção.

### 3. Duplicata entre conjuntos — o modelo que já viu a prova

Se o mesmo exemplo, ou um quase-idêntico, aparece nos dois lados da divisão, o teste deixou de medir generalização e passou a medir memória.

Acontece mais do que se imagina:

- **Duplicatas exatas** na base (o mesmo registro importado duas vezes).
- **Quase-duplicatas**: o mesmo cliente em dois meses, a mesma notícia republicada, a mesma foto redimensionada.
- **Múltiplas linhas do mesmo sujeito**: dez transações de um cliente, cinco exames de um paciente, vinte sensores da mesma máquina.

O terceiro caso é o que mais engana, porque não parece duplicata — são linhas genuinamente diferentes. Mas se o modelo aprende a reconhecer *o cliente* em vez de *o comportamento*, ele vai bem no teste e mal com clientes novos, que é a única coisa que importa.

:::exercicio {"id":"02-e1","tipo":"multipla","objetivo":"O1","dificuldade":"media"}
Uma equipe prevê inadimplência em 30 dias. O modelo atinge 0,96 de AUC — três vezes melhor que qualquer tentativa anterior. Entre os atributos está `dias_de_atraso_atual`. Qual é a leitura mais provável?

- [ ] O modelo é excelente; `dias_de_atraso_atual` é de fato um bom preditor.
- [x] Vazamento: quem já está em atraso hoje quase por definição estará inadimplente, e essa coluna não existe no momento em que a decisão precisa ser tomada.
- [ ] Overfitting: o modelo decorou o treino.
- [ ] A AUC está alta porque a base é desbalanceada.

> **gabarito:** Vazamento
> **porque:** Aplique o teste da coluna: *no instante em que preciso decidir, este valor já existe?* Se a decisão é conceder crédito **antes** de haver qualquer atraso, então `dias_de_atraso_atual` é zero para todo mundo naquele instante — e o valor que apareceu no treino veio de um momento posterior ao que se quer prever. O modelo aprendeu "quem está atrasado vai ficar inadimplente", que é verdade e é inútil.
>
> Note por que **overfitting** é a resposta errada mais tentadora: overfitting produz treino bom e validação ruim. Aqui a validação também está ótima — porque a coluna vazada está nos dois lados. Vazamento e overfitting têm assinaturas opostas, e confundi-los manda a investigação para o lado errado.
> **volte para:** #1-alvo-disfarcado-a-coluna-que-so-existe-depois
:::

:::exercicio {"id":"02-e2","tipo":"multipla-multi","objetivo":"O1","dificuldade":"dificil"}
Quais destas práticas introduzem vazamento? (marque todas que valem)

- [x] Preencher valores ausentes com a mediana calculada sobre o dataset inteiro, antes de dividir.
- [x] Selecionar os 20 atributos mais correlacionados com o alvo usando todos os dados, e só depois dividir.
- [ ] Fixar a *seed* do embaralhamento antes de dividir.
- [x] Aplicar *target encoding* numa categórica usando as médias calculadas sobre treino e teste juntos.
- [ ] Usar validação cruzada em vez de uma única divisão.

> **gabarito:** imputação antes do split · seleção de atributos antes do split · target encoding sobre tudo
> **porque:** As três corretas são a mesma falha com três roupas: **algo aprendeu dos dados de teste antes de o teste ser usado para medir**. A mediana carrega a distribuição do teste; a seleção de atributos usa a correlação com o alvo do teste; o *target encoding* embute a média do alvo do teste dentro de uma coluna de entrada — este último é o mais grave dos três, porque injeta o próprio alvo.
>
> As duas erradas são higiene, não vazamento. Fixar a *seed* torna a divisão reprodutível, o que é exigência do Princípio II. E validação cruzada não vaza *por si só* — ela vaza se o pré-processamento for feito fora do laço, que é exatamente o mesmo erro de novo, só que repetido em cada dobra.
> **volte para:** #2-pre-processamento-antes-da-divisao-o-vazamento-silencioso
:::

## A divisão que respeita a estrutura dos dados

Embaralhar e cortar é o padrão — e está errado sempre que os dados têm estrutura. Duas estruturas importam.

### Tempo: nunca embaralhe uma série

Se você quer prever o futuro, **treine no passado e teste no futuro**. Embaralhar uma série temporal permite que o modelo treine com dados de dezembro para prever junho, o que é uma máquina do tempo que produção não terá.

```
❌ embaralhado:  [J F M A M J J A S O N D]  →  treino e teste misturados
✅ temporal:     [J F M A M J J A S] treino  [O N D] teste
```

E há um detalhe que quase todo mundo esquece: o **intervalo de guarda**. Se você prevê 30 dias à frente, os últimos 30 dias do treino contêm informação que se sobrepõe ao início do teste. Descarte-os. Perder um mês de treino é barato; descobrir em produção que a métrica era otimista, não.

### Grupo: o mesmo sujeito não pode estar nos dois lados

Se a base tem várias linhas por cliente, paciente ou máquina, a divisão é **por sujeito**, não por linha. Todas as linhas do cliente 4711 vão para o treino, ou todas vão para o teste — nunca umas em cada.

A pergunta que decide isso é: **o que vai ser novo em produção?** Se o sistema vai atender clientes que ele nunca viu, o teste precisa conter clientes que o treino nunca viu. Se ele vai atender os mesmos clientes de sempre em situações novas, aí a divisão por linha é defensável — mas essa decisão precisa ser **declarada**, não herdada do `train_test_split` padrão.

### E a estratificação

Preservar a proporção de classes nos três conjuntos. Barato, quase sempre certo, e imprescindível quando a classe positiva é rara: sem ela, o teste pode acabar com um punhado de positivos e a métrica vira loteria — o problema que o [capítulo 04](04-avaliacao.md) trata com intervalo de confiança.

**Atenção à ordem de precedência.** Quando há tempo *e* grupo *e* desbalanceamento, tempo manda. Não se estratifica uma série temporal: forçar a proporção de classes no futuro é assumir que você já sabe qual será ela — e essa é a coisa que você está tentando descobrir.

:::exercicio {"id":"02-e3","tipo":"multipla","objetivo":"O2","dificuldade":"dificil"}
Um hospital quer prever readmissão em 30 dias. A base tem 50.000 internações de 12.000 pacientes, coletadas ao longo de 4 anos. O sistema vai atender pacientes que chegam pela primeira vez. Qual divisão é a correta?

- [ ] Embaralhar as 50.000 internações e dividir 70/15/15, estratificando pelo alvo.
- [ ] Dividir por paciente, embaralhando os 12.000 e separando 70/15/15.
- [x] Dividir por tempo (treino nos primeiros anos, teste no último) **e** garantir que nenhum paciente apareça em dois conjuntos.
- [ ] Usar validação cruzada de 5 dobras sobre as internações, que é mais robusta que uma divisão única.

> **gabarito:** Dividir por tempo e por paciente, simultaneamente
> **porque:** Há **duas** estruturas aqui, e ignorar qualquer uma delas invalida a medição.
>
> **Tempo**, porque protocolos clínicos, população e prática mudam em 4 anos: treinar com 2026 para prever 2023 é uma máquina do tempo. **Paciente**, porque um mesmo paciente tem várias internações — e um modelo que aprende a reconhecer *aquele paciente* vai bem no teste e falha justamente no caso de uso declarado, que é o paciente novo.
>
> As alternativas 1 e 2 acertam uma estrutura e ignoram a outra. A alternativa 4 é a armadilha mais elegante: validação cruzada é de fato mais robusta contra ruído amostral, mas robustez não conserta viés — cinco dobras embaralhadas erradas dão uma estimativa errada com um intervalo de confiança estreito, que é pior do que uma estimativa errada e obviamente incerta.
>
> Na prática, a divisão correta custa dados: pacientes do último período que já apareciam antes precisam sair de um dos lados. Esse custo é real e vale a pena.
> **volte para:** #a-divisao-que-respeita-a-estrutura-dos-dados
:::

## A ficha de dataset

Antes de treinar, escreva uma página sobre os dados. Não é burocracia: é o único momento em que alguém olha para a origem em vez de olhar para as colunas.

A prática vem de *Datasheets for Datasets* (Gebru et al.) e este livro adota uma versão mínima, de sete perguntas:

| # | Pergunta | Por que importa |
|---|---|---|
| 1 | **Quem coletou, quando e para quê?** | dado coletado para outro fim carrega o viés daquele fim |
| 2 | **Como um exemplo entrou na base?** | é aqui que mora o viés de seleção |
| 3 | **Qual é a licença?** | uso comercial pode ser proibido, e ninguém descobre isso tarde de graça |
| 4 | **Há dado pessoal?** | se há, ou anonimiza ou não entra (Princípio V) |
| 5 | **Como o alvo foi rotulado?** | rótulo humano tem taxa de erro; rótulo automático tem a regra que o gerou |
| 6 | **O que se sabe que está errado?** | toda base tem defeitos conhecidos; não registrá-los é fingir que não existem |
| 7 | **Quando expira?** | população, comportamento e instrumentação mudam |

A pergunta 5 merece um parágrafo. Se o alvo foi rotulado por uma regra automática, **o modelo vai aprender a regra, não o fenômeno** — e o teto de desempenho dele é a qualidade daquela regra. É comum descobrir, tarde, que "fraude" na base significa "o que o sistema antigo marcou como fraude", e que o modelo novo foi treinado para imitar o velho.

## O viés de seleção: aprender com quem já está lá

O desbalanceamento é o problema fácil: uma classe é rara, e o [capítulo 04](04-avaliacao.md) já mostrou como medir sem se enganar.

O problema difícil é o **viés de seleção** — quando a forma como os exemplos entraram na base não representa a população em que o modelo vai operar.

O caso clássico e cruel: um banco quer prever inadimplência e treina com o histórico dos **clientes a quem concedeu crédito**. Mas quem recebeu crédito passou por um filtro — o modelo antigo, ou o gerente. Os dados não contêm os que foram recusados, e são exatamente esses que o novo modelo precisa avaliar. O sistema aprende sobre uma população que já foi filtrada por ele mesmo, e fica cada vez mais confiante sobre uma fatia cada vez mais estreita do mundo.

Isso tem nome — *feedback loop* — e o [capítulo 15](15-sistemas-de-ml.md) trata das consequências arquiteturais. Aqui basta o diagnóstico e o gesto mínimo: **reservar uma fração pequena de decisões aleatórias**, fora da recomendação do modelo, para manter a base honesta. Custa dinheiro. É o preço de continuar aprendendo.

:::exercicio {"id":"02-e4","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"media"}
Você recebeu uma base de 200.000 avaliações de produtos, rotuladas como "positiva" ou "negativa", para treinar um classificador de sentimento. O rótulo foi gerado automaticamente: avaliações de 4–5 estrelas viraram "positiva", de 1–2 estrelas viraram "negativa", e as de 3 estrelas foram descartadas.

Escreva as **três perguntas mais importantes** que você faria antes de treinar, e diga o que cada resposta mudaria na sua decisão.

> **rubrica:** questiona o rótulo automático e o teto que a regra de geração impõe;
> nota que descartar as 3 estrelas remove justamente os casos ambíguos, inflando a métrica;
> levanta ao menos uma questão de origem, licença ou representatividade da base;
> cada pergunta vem acompanhada do que a resposta mudaria — não é uma lista solta de dúvidas
> **porque:** As três mais valiosas costumam ser estas. **Primeira:** o rótulo é a estrela, não o sentimento — e as duas coisas divergem (elogio com nota baixa por causa da entrega, ironia, avaliação de 5 estrelas com reclamação no texto). O modelo terá como teto a qualidade dessa correspondência.
>
> **Segunda, e a mais fácil de deixar passar:** descartar as 3 estrelas remove exatamente os casos difíceis. O classificador vai parecer excelente no teste — que também não tem casos difíceis — e vai encontrá-los todos em produção. É desbalanceamento invertido: a base ficou mais fácil que o mundo.
>
> **Terceira:** de onde vêm as avaliações, quem escreve avaliação (quem teve experiência extrema, tipicamente), e se a licença permite o uso pretendido.
>
> O critério de "o que a resposta mudaria" é o que separa curiosidade de investigação. Uma pergunta cuja resposta não muda nada é uma pergunta que não precisava ser feita.
> **volte para:** #a-ficha-de-dataset
:::

## Mão na massa

A **etapa 02** do [`ml-zero`](../trilha-ml-zero.md) implementa o que este capítulo argumenta, em biblioteca padrão pura:

1. `detectar_vazamento_obvio` — procura colunas suspeitas de serem o alvo disfarçado, por correlação quase perfeita e por preenchimento condicionado ao alvo;
2. `dividir_por_grupo` — garante que nenhum sujeito apareça em dois conjuntos;
3. `dividir_por_tempo` — corte temporal **com intervalo de guarda**;
4. `checar_duplicatas` — exatas e quase-exatas entre conjuntos;
5. `FichaDeDataset` — as sete perguntas como estrutura executável, que falha se ficarem sem resposta.

O item 5 é o mais incomum e o mais útil: a ficha não é um documento que alguém promete escrever, é um objeto que o pipeline recusa se estiver incompleto.


**Notebook pronto para executar** — [`vazamento.ipynb`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/etapa-02/vazamento.ipynb) · [abrir no Colab](https://colab.research.google.com/github/GHDaru/machinelearning/blob/main/ml-zero/etapa-02/vazamento.ipynb)

Os três vazamentos, em execução: a coluna que sabe demais, a divisão que respeita grupos e a que respeita o tempo. Traz de brinde a razão de o exemplo ter 200 linhas e não 10 — **com poucas linhas qualquer coluna separa perfeitamente por acaso**, e o detector acusaria todas.

> Na sua máquina: `pip install notebook` e `jupyter notebook`, ou abra a pasta no VS Code. O notebook **não precisa do repositório clonado** — se você estiver no Colab, ele baixa sozinho os arquivos de que precisa. Como rodar a trilha inteira: [`ml-zero`](https://github.com/GHDaru/machinelearning/blob/main/ml-zero/README.md).

## Assista

:::video {"id":"02-v1","fonte":"youtube","ref":"fSytzGwwBVw","min":6,"autor":"StatQuest with Josh Starmer","titulo":"Machine Learning Fundamentals: Cross Validation"}
O texto acima argumenta *por que* a divisão precisa respeitar a estrutura; este vídeo mostra a **mecânica** de dividir e de rodar validação cruzada, com os blocos se movendo na tela. Vale como base concreta antes do exercício 02-e3 — e repare, enquanto assiste, que a animação assume dados sem estrutura temporal nem de grupo. É o caso mais simples, e é por isso que ele é o mais ensinado.
:::

## Síntese — o que levar

- **Resultado bom demais é pista de vazamento**, não motivo de comemoração.
- Faça a pergunta da coluna, uma por uma: *no instante da predição, este valor já existe?*
- **Tudo que aprende dos dados aprende só do treino.** Normalização, imputação, seleção, *target encoding*.
- Divisão respeita a estrutura: **tempo manda sobre grupo, que manda sobre estratificação**.
- Escreva a ficha antes de treinar. A pergunta 5 — como o alvo foi rotulado — é a que mais surpreende.
- Sua base tem o viés do filtro que a criou. Se o filtro foi o próprio sistema, o problema se agrava sozinho.

## Verificação

1. Explique a diferença entre vazamento e overfitting em termos das assinaturas que cada um deixa nas curvas de treino e validação.
2. Você tem 3 anos de transações de 5.000 lojas e quer prever venda da próxima semana. Descreva a divisão e justifique cada decisão.
3. Um colega diz: "normalizei tudo antes de dividir, mas o efeito é minúsculo, não muda nada". O que você responde?
