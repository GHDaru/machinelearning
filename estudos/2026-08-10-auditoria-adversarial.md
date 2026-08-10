# Auditoria adversarial das seções históricas — 2026-08-10

> Exigida pelo [ADR 0004](../adr/0004-escopo-da-primeira-versao.md). Executada em **contexto fresco**, por um revisor que não escreveu nenhum dos capítulos, com a instrução de **tentar derrubar** o rigor — não de aprovar.
>
> **Veredicto: REPROVADO**, com 6 achados de gravidade alta. O que segue é o registro do que foi encontrado, do que foi corrigido e do que **fica devendo**.

## Por que este documento existe

Um gate mecânico verifica que a seção existe e que a tabela de selos existe. Ele **não** consegue verificar se o selo é honesto, se a afirmação tem lastro na nota de pesquisa, ou se o corpo narra como fato o que a tabela marca como dúvida. Isso precisa de leitura adversarial — e precisa ser feito por quem não escreveu.

A auditoria achou coisas que nenhum de nós teria achado relendo o próprio texto.

## Achados de gravidade ALTA — todos corrigidos

**1. Duas seções históricas sem lastro na fonte única.** Os capítulos 03 e 25 tinham "De onde isto veio" completo **sem uma linha correspondente na nota de pesquisa** — e a nota dizia explicitamente, sobre esses dois capítulos, que *"não escreverei a seção a partir de memória"*. A pesquisa existia e era boa; ela nunca foi **registrada**. Violação da regra de rastreabilidade do ADR 0004.
*Corrigido:* a 5ª passada foi acrescentada à nota, com o registro de que o lançamento foi tardio e a falha foi de processo.

**2. Selo inflado no capítulo 08.** Uma linha marcava **✓** para a apuração de Power sobre "cerveja e fraldas"; a nota registra ⏳/❌ e diz que a fonte foi apenas *rastreada até*. Pior: a linha seguinte da **mesma tabela** marcava ⏳ para os mesmos fatos. A tabela contradizia a si mesma.
*Corrigido:* rebaixado a ✓ᵐ, com a declaração de que a entrevista não foi lida por inteiro.

**3. Três capítulos reivindicando "o maior intervalo do livro".** Os capítulos 10 (53 anos), 03 (59) e 13 (~80) diziam a mesma coisa — e o capítulo 10 se refutava **na própria frase**, listando os outros dois logo depois.
*Corrigido:* só o 13 diz "o maior"; os outros dizem "um dos maiores".

**4. Erro factual no capítulo 10.** A distinção entre células simples e complexas era atribuída ao artigo de Hubel & Wiesel de **1959**; a literatura a associa ao trabalho de **1962**. E ✓ᵐ não autorizaria afirmar conteúdo interno de nenhum dos dois.
*Corrigido:* o ✓ᵐ passou a cobrir só obra/autoria/ano, e a atribuição da hierarquia virou ⏳ declarando a dúvida entre 1959 e 1962.

**5. Um prenome inventado.** O capítulo 01 dizia *"um psicometrista chamado **Selvin** Larson"*. A nota de pesquisa nunca teve prenome — só "Larson (1931)". O prenome entrou de algum lugar que **não é a fonte única**, e é exatamente o modo de falha que o Princípio X nomeia: *história inventada soa bem*.
*Corrigido:* "um psicometrista de sobrenome Larson".

**6. Registro misturado no capítulo 04.** A origem da curva ROC no radar era narrada inteiramente como fato — *"o receptor tinha um controle de ganho"*, *"apareceu o problema"* — enquanto a tabela marcava **tudo ⏳**. É a terceira proibição do Princípio X.
*Corrigido:* o corpo passou a usar "conta-se que" e "segundo a versão corrente", com remissão explícita à tabela.

## O que fica devendo — dívida **D10**, declarada

O achado mais incômodo é **sistêmico** e não se resolve com edição pontual: em vários capítulos, uma fonte selada **✓ᵐ** sustenta no corpo uma afirmação sobre **o que a obra argumenta por dentro** — *"Belkin et al. mostraram que…"*, *"Cybenko e Hornik provam que…"*, *"primeira aplicação de autorregressão, com defasagem 2"*.

A regra que isso viola está escrita na própria nota de pesquisa: *enquanto for ✓ᵐ, o texto pode dizer que a obra existe e o que ela é, **nunca o que ela argumenta por dentro***.

Há duas saídas honestas, e as duas custam:

1. **Ler as fontes** e promover os selos a ✓ — é o ciclo de aprofundamento (`essencial → completo`), e é o caminho certo.
2. **Hedge no corpo** de cada afirmação — barato, mas piora o texto e mascara o problema com linguagem.

**A escolha registrada é a (1)**, e por isso o defeito fica como dívida em vez de ser maquiado. A fila de verificação da nota de pesquisa já está ordenada por dúvida fechada por unidade de esforço — ela é o plano de pagamento.

Outros itens menores registrados na mesma dívida: afirmações órfãs no capítulo 18 (a nota nunca cobriu esse capítulo, escrito antes da sessão de pesquisa); "AdaBoost, com Freund" e a data de 1995 sem linha de selo nos capítulos 07 e 24; Hadamard (1923) no corpo do 06 sem linha na tabela; e uma afirmação de mercado no 23 selada 📖, quando leitura editorial não cobre fato de indústria.

## O que a auditoria **não** encontrou

- **Gênio solitário** (proibição 1): nada. Instituição, encomenda ou restrição material aparecem em todas as seções auditadas.
- **Ideia reaproveitável ausente ou vaga** (o elemento que o Princípio X chama de mais importante): nada. Os 21 capítulos a entregam, e ela é exportável em todos.

## A lição de processo

A auditoria custou uma passada de leitura e achou **um prenome inventado, um erro de data, um selo inflado, uma contradição tripla e duas seções sem lastro**. Nenhum desses defeitos teria sido pego pelo gate do build, e nenhum foi pego por quem escreveu.

**Contexto fresco e instrução adversarial não são cerimônia.** A instrução importa: pedir "revise" produz elogio; pedir "tente derrubar" produz achado.
