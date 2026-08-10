# 00 — Introdução

> **Estado da arte capturado em 2026-08** · última revisão 2026-08-01 · [histórico](HISTORICO.md)
>
> **Nível: essencial.** Corpo escrito e prática funcionando; o aprofundamento (experimento próprio, todas as fontes conferidas, cláusula de expiração) vem em ciclo próprio — ver [níveis de maturidade](GUIA-EDITORIAL.md#niveis-de-maturidade).

## Objetivos de aprendizagem

- **O1.** Explicar o que distingue Machine Learning de programação convencional, em termos de *onde mora a regra*.
- **O2.** Reconhecer quando um problema é candidato a ML — e quando não é.
- **O3.** Usar as três superfícies deste livro (texto, exercícios, construção) de forma deliberada, e não por acaso.

## O problema: a regra que ninguém consegue escrever

Programar é escrever a regra. Você sabe que um CPF válido tem 11 dígitos e um dígito verificador calculado de certo jeito, então escreve isso, e o computador executa. A regra existe na sua cabeça antes de existir no arquivo.

Agora tente escrever a regra que distingue a foto de um gato da foto de um cachorro. Você reconhece a diferença em vinte milissegundos e não consegue enunciá-la. "Orelha pontuda" falha no gato de orelha caída e no pastor alemão. "Focinho comprido" falha no boxer e no gato siamês. Cada regra que você escreve morre no primeiro contraexemplo, e a lista de exceções cresce mais rápido que a lista de regras.

**Machine Learning é o que se faz quando a regra existe mas ninguém consegue escrevê-la.** Em vez de codificar a regra, você mostra exemplos e deixa que um procedimento de otimização encontre uma regra que os explique — na esperança de que ela também explique exemplos que você ainda não viu.

Essa esperança tem nome: **generalização**. É o assunto do capítulo 01, e é o problema central de todo o resto do livro. Quase todo erro caro em ML é, no fundo, uma falha de generalização disfarçada de outra coisa.

### O que muda quando a regra é aprendida

| | Programação convencional | Machine Learning |
|---|---|---|
| Onde mora a regra | no código que você escreveu | nos parâmetros, ajustados a partir de dados |
| Como se corrige | edita-se o código | muda-se o dado, o objetivo ou o modelo |
| Como se sabe que está certo | testes: entrada conhecida → saída esperada | métricas sobre dados **que o modelo nunca viu** |
| O que dá errado | bug: o programa faz o que você escreveu, não o que você quis | o modelo aprende algo que era verdade nos seus dados e não é verdade no mundo |
| Como envelhece | envelhece quando o requisito muda | envelhece sozinho, quando o mundo muda (*drift*) |

A última linha é a que pega as equipes desprevenidas. Um sistema convencional que funcionou ontem funciona amanhã. Um modelo que funcionou ontem pode estar errado amanhã sem que uma linha de código tenha mudado — porque quem mudou foi o mundo do qual ele aprendeu. É por isso que o capítulo 16 existe.

## Quando **não** usar Machine Learning

Um livro de ML que não diz isso na primeira página está vendendo, não ensinando. Não use ML quando:

- **A regra é escrevível.** Se você consegue enunciar a regra, escreva-a. Ela será mais rápida, mais barata, auditável e não vai degradar sozinha. "Aprender" uma regra que você já sabe é engenharia ao contrário.
- **Errar é inaceitável.** Modelos erram por construção — a questão nunca é *se*, é *quanto* e *em quê*. Onde o erro é catastrófico e não há revisão humana no caminho, o custo do erro precisa ser projetado antes do modelo.
- **Você não tem exemplos.** Não há ML sem dados rotulados, medidos ou observados do fenômeno certo. Dado emprestado de outro contexto é a origem mais comum de fracasso silencioso (capítulo 02).
- **Ninguém consegue dizer o que é "bom".** Se a equipe não consegue definir a métrica antes de treinar, o projeto vai otimizar o que for fácil de medir — e isso raramente é o que importa (capítulo 04).

Os quatro casos acima são, empiricamente, mais comuns do que os projetos que de fato precisam de ML. Reconhecê-los é uma habilidade, não um obstáculo.

:::exercicio {"id":"00-e1","tipo":"multipla","objetivo":"O2","dificuldade":"facil"}
Uma equipe precisa validar se um número de cartão de crédito é sintaticamente válido antes de enviá-lo ao adquirente. Alguém propõe treinar um classificador com milhões de cartões válidos e inválidos. Qual é a melhor avaliação dessa proposta?

- [ ] Boa ideia: com dados suficientes, o modelo aprenderia a regra melhor do que um humano escreveria.
- [x] Má ideia: a regra (algoritmo de Luhn) é conhecida e escrevível — um modelo só introduziria erro onde não havia.
- [ ] Boa ideia, desde que a acurácia no teste passe de 99,9%.
- [ ] Depende do volume de cartões processados por segundo.

> **gabarito:** Má ideia: a regra é conhecida e escrevível
> **porque:** Machine Learning existe para quando a regra **não** é escrevível. A validação de cartão segue o algoritmo de Luhn, que é determinístico, exato e verificável linha a linha. Um modelo treinado para imitá-lo seria mais lento, não auditável, e — pior — erraria em algum ponto, trocando uma resposta *certa por construção* por uma *provavelmente certa*. Note que a alternativa da acurácia é uma armadilha: mesmo 99,99% seria pior que 100%, e a acurácia alta apenas esconderia que a tarefa era resolvível sem modelo nenhum.
> **volte para:** #quando-nao-usar-machine-learning
:::

:::exercicio {"id":"00-e2","tipo":"multipla-multi","objetivo":"O1","dificuldade":"media"}
Quais afirmações descrevem diferenças **estruturais** entre um sistema aprendido e um sistema programado? (marque todas que valem)

- [x] No sistema aprendido, a regra vive em parâmetros ajustados a partir de exemplos.
- [x] O sistema aprendido pode degradar sem nenhuma alteração no código.
- [ ] O sistema aprendido dispensa testes automatizados.
- [x] Verificar o sistema aprendido exige dados que ele nunca viu durante o treino.
- [ ] O sistema programado não pode ser corrigido depois de escrito.

> **gabarito:** parâmetros ajustados · degrada sem alteração de código · exige dados não vistos
> **porque:** As três corretas são exatamente as linhas da tabela de comparação: **onde mora a regra**, **como envelhece** e **como se verifica**. As duas erradas são mal-entendidos comuns e caros. Sistemas aprendidos precisam de *mais* testes automatizados, não menos — só que os testes mudam de natureza: além de "esta função retorna isto", passam a incluir "esta métrica não caiu abaixo deste limiar neste conjunto". E sistemas programados são, obviamente, corrigíveis; a diferença é *como* se corrige: editando a regra, em vez de mexer em dado, objetivo ou modelo.
> **volte para:** #o-que-muda-quando-a-regra-e-aprendida
:::

## Como este livro funciona

Este é um **livro vivo** e um **livro interativo**. As duas palavras têm significado técnico aqui.

**Vivo** quer dizer que ele declara sua própria data de validade. Cada capítulo carrega um selo de "estado da arte capturado em AAAA-MM", e cada afirmação sensível ao tempo vive sob esse selo. O [Histórico](HISTORICO.md) registra as edições e mantém um **placar de expiração**: as previsões que o livro fez, pontuadas contra a realidade. Um livro técnico que não faz isso finge ser atemporal — e envelhece mentindo.

**Interativo** quer dizer três superfícies, que se usam juntas:

| Superfície | O que é | Quando usar |
|---|---|---|
| **O texto** | os capítulos, no esqueleto v4 (objetivos → problema → fundamentos → estado da arte → prática) | para entender |
| **Os exercícios** | corrigidos no servidor, com feedback que explica o erro e devolve você à seção certa | para descobrir que você **não** entendeu |
| **A construção `ml-zero`** | um sistema de ML completo, escrito do zero, uma etapa por capítulo | para saber de verdade |

Há ainda um **tutor** (o botão 💬 no canto): um assistente que responde a partir do texto do livro, sabe em que capítulo você está e o que você já resolveu. Ele não entrega gabarito de exercício em aberto — dá a pista, não a resposta.

### A ordem que funciona

A tentação é ler tudo e praticar depois. A pesquisa sobre carga cognitiva diz o contrário, e este livro é construído para o contrário:

1. **Leia os objetivos** do capítulo. Eles são o contrato.
2. **Leia o corpo** até a seção "Mão na massa".
3. **Faça os exercícios antes de achar que entendeu.** Errar aqui é barato e informativo; errar em produção não é. O feedback do primeiro erro é deliberadamente uma pista, não a resposta — a segunda tentativa ainda é sua.
4. **Faça a etapa do `ml-zero`.** É onde o conceito vira código que roda.
5. **Volte à seção "Verificação"** e responda em voz alta. Se travar, o capítulo não terminou.

Ler sem praticar produz a sensação de competência sem a competência. É o modo de falha mais comum do estudo técnico, e o único que o leitor não consegue detectar sozinho — porque a sensação é idêntica.

:::exercicio {"id":"00-e3","tipo":"aberta","objetivo":"O3","pontos":3,"dificuldade":"media"}
Descreva um problema do seu trabalho ou da sua área de interesse que você acredita ser candidato a Machine Learning. Diga **qual regra ninguém consegue escrever**, **que exemplos existiriam** para aprender com eles, e **o que significaria "funcionar"** — em termos de uma medida, não de uma impressão.

> **rubrica:** identifica uma regra concreta que é difícil de enunciar explicitamente;
> descreve uma fonte de exemplos plausível e disponível, não hipotética;
> propõe uma medida de sucesso observável, e não um adjetivo ("bom", "preciso");
> a medida proposta tem alguma relação com a consequência no mundo, não só com o modelo
> **porque:** As três perguntas — regra, exemplos, medida — são o teste mínimo de viabilidade de um projeto de ML, e são as três que costumam ficar implícitas nas reuniões onde o projeto é aprovado. A terceira é a que mais falha: "queremos prever a evasão de clientes" não é uma medida; "queremos identificar, entre os 5% de clientes mais prováveis de sair no próximo mês, pelo menos metade dos que de fato saem" é. Note que definir a medida quase sempre expõe uma decisão de negócio que ninguém tinha tomado — e esse é o maior serviço que o exercício presta.
> **volte para:** #como-este-livro-funciona
:::

## Assista

:::video {"id":"00-v1","fonte":"youtube","ref":"Gv9_4yMHFhI","min":6,"autor":"StatQuest with Josh Starmer","titulo":"A Gentle Introduction to Machine Learning"}
Uma visão geral de seis minutos que fixa o vocabulário — treino, teste, predição — **antes** de qualquer formalismo. Vale como aquecimento: o texto acima explica *por que* ML existe; o vídeo mostra *como se parece* uma tarefa de ML na prática, com um exemplo visual único do começo ao fim.
:::

## O caminho pela frente

O livro é dividido em três partes, com uma progressão deliberada de andaime — cada parte remove um apoio que a anterior oferecia.

**Parte I — O ciclo do aprendizado supervisionado** (caps. 02–07). O núcleo. Dados, representação, avaliação, modelos lineares, otimização, ensembles. Ao final desta parte você resolve, do começo ao fim e com honestidade metodológica, a maioria dos problemas reais de ML que aparecem em empresas — que são tabulares, não são deep learning, e falham por causa de dados, não de modelo.

**Parte II — Sem rótulo, e profundo** (caps. 08–12). Agrupamento e redução de dimensionalidade; depois redes neurais construídas em NumPy, visão, sequências e a chegada dos modelos de fundação. O objetivo aqui não é competir com bibliotecas — é você ter visto o motor antes de dirigir o carro.

**Parte III — Machine Learning no mundo real** (caps. 13–17). Reforço, interpretabilidade e justiça, design de sistemas, MLOps, e a fronteira. É a parte que separa "treinei um modelo" de "opero um sistema que aprende".

Em paralelo, a trilha [`ml-zero`](trilha-ml-zero.md) constrói, etapa por etapa, um sistema completo: dado bruto → linha de base → avaliação honesta → modelo → serviço com API → monitoramento. Uma etapa por capítulo, tudo em CPU, sem chave paga (Princípio VI — custo zero é requisito, não cortesia).

## Síntese — o que levar

- ML é a resposta a **regras que existem e ninguém consegue escrever**. Onde a regra é escrevível, escreva-a.
- O problema central não é acertar nos dados que você tem; é **generalizar** para os que virão.
- Modelos envelhecem sozinhos. Isso não é defeito de implementação — é a natureza da coisa, e precisa ser projetado.
- Neste livro: leia os objetivos, leia o corpo, **erre nos exercícios**, construa a etapa, volte à verificação.

## Verificação

1. Dê um exemplo de problema em que ML é a escolha errada e explique por quê, sem usar a palavra "dados".
2. Um modelo em produção começa a errar mais, sem que nenhum código tenha mudado. Cite duas explicações possíveis e diga como você distinguiria uma da outra.
3. Por que este livro insiste que você faça os exercícios **antes** de sentir que entendeu o capítulo?
