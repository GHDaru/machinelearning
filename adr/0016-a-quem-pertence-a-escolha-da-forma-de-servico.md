# ADR 0016 — A escolha da forma de serviço é desenho, e fica no V.2

**Data:** 2026-08-13 · **Estado:** aceito · **Comitê:** lente pedagógica, lente de arquitetura do livro, lente de prática e indústria

## Contexto

O capítulo V.2 declara quatro objetivos. O quarto é:

> **O4.** Decidir entre predição em lote e em tempo real a partir do requisito, não do gosto.

O corpo do V.2 não ensina isso em lugar nenhum. Quem ensina é o **V.3**, nas linhas 67 a 75, com a tabela das três formas (batch, online, streaming) e a frase *"escolhidas pelo requisito e não pelo gosto"*, que é a redação do objetivo do outro capítulo.

O espelho também vale: **nenhum dos quatro objetivos do V.3 cobre essa tabela**. Ela vive órfã, sem objetivo, sem exercício e sem âncora de retorno.

O gate já tinha diagnosticado o caso e se recusado a resolvê-lo sozinho. Em `publicar/exercicios.mjs`, a entrada `v-2 O4` de `ORFAOS_ACEITOS` carrega o comentário: *"O objetivo está no capítulo errado, e mover conteúdo é decisão editorial, não de gate."* É a dívida **D16** do `ROADMAP.md`, cuja saída registrada é "o conteúdo sobe ou o verbo desce".

Escrever três exercícios para o O4 hoje seria cobrar do leitor o que o capítulo não ensina, contra o Princípio I. Era preciso decidir antes.

## As opções

**(A) O conteúdo sobe.** Escrever a seção que falta no V.2 e manter o O4 lá. O V.3 devolve a tabela órfã.

**(B) O verbo desce.** Tirar o O4 do V.2 e dar ao V.3 um objetivo novo que cubra a tabela que ele já tem.

## O que o comitê disse

**A lente pedagógica recomendou B.** O V.2 tem uma tese única e afiada, a de que custo sem nome não entra no orçamento; uma seção sobre forma de serviço seria um segundo assunto na mesma página. E a sequência estaria invertida: o leitor decidiria arquitetura antes de conhecer as restrições que decidem.

**A lente de arquitetura recomendou B**, pelo caminho mais barato: o texto do V.3 já existe, e faltaria apenas o rótulo. Ela verificou que a mudança custa zero hoje, porque nenhum exercício e nenhuma prova apontam para `v-2:O4`, e a prova da Parte V ainda não existe. Registrou o próprio risco: B pode mudar a órfã de lugar em vez de pagá-la.

**A lente de prática recomendou A**, e trouxe a evidência que decidiu:

- **Verificação negativa nas duas fontes-base.** No PDF de Sculley et al. (2015), a fonte-base do V.2, as buscas por *batch*, *online*, *latency* e *real-time* não acham a escolha: ela não é herdada do artigo. No CD4ML, a fonte-base do V.3, o assunto de *model serving* aparece com outros três padrões, e o contraste entre lote e tempo real **também não está lá**. Nenhum dos dois capítulos herda o tema da própria fonte.
- **A indústria trata a escolha como projeto.** Em *Designing Machine Learning Systems*, de Chip Huyen, ela é o capítulo 7, com a seção "Batch Prediction Versus Online Prediction" seguida de "Unifying Batch Pipeline and Streaming Pipeline" — a escolha reorganiza os pipelines de dados, não é um botão de implantação. Em *Machine Learning Design Patterns*, as duas formas são **padrões de projeto** numerados (16 e 17).
- **A regra #32 já mora no V.2.** O texto dela, aberto em primeira mão, começa assim: *"Batch processing is different than online processing."* A frase está na mesma regra que manda reutilizar código entre treino e serviço, que é o miolo da seção "O contrato entre treino e serviço" do V.2.

## Decisão

**Fica o A.** A escolha da forma de serviço é desenho de sistema, e o V.2 é o capítulo de desenho de sistema. O O4 permanece onde está e ganha corpo: uma seção com os eixos que decidem, cada um com fonte. O V.3 perde a tabela órfã e recebe uma remissão, de modo que ele passe a tratar de **operar a forma escolhida**, e não de escolhê-la.

Com isso, a primeira metade da D16 é paga inteira, e não empurrada: some o objetivo sem conteúdo do V.2 **e** some a tabela sem objetivo do V.3. A entrada `v-2 O4` sai de `ORFAOS_ACEITOS` no mesmo commit, como o gate exige.

## Por que contra a maioria

Duas lentes disseram B e uma disse A. A decisão segue a minoria por uma razão declarada: **as duas primeiras opinaram sobre a arrumação do livro; a terceira foi verificar onde o assunto mora na literatura, e voltou com busca negativa nas duas fontes-base e com dois livros de projeto que o tratam como projeto.** Num livro cujo primeiro princípio é evidência acima de retórica, o argumento com fonte ganha do argumento de simetria.

A objeção pedagógica era a mais séria, e é o que a redação da seção tem de responder: dois assuntos na mesma página. Ela cai porque o eixo que de fato decide a forma **é o custo de calcular o atributo**, e o custo de calcular o atributo já é o assunto da seção anterior do V.2. Não é um segundo tema; é o mesmo tema levado à consequência arquitetural. Por isso a seção nova entra logo depois do contrato de treino e serviço, e não em outro lugar do capítulo.

A objeção de sequência, a de que o leitor decidiria antes de conhecer as restrições, cai pelo mesmo motivo: as restrições que decidem são latência do atributo, frescor e volume, e nenhuma delas depende de drift ou de rollback, que são o que o V.3 acrescenta depois.

## Consequências

- O V.2 vai a 12 exercícios, três por objetivo, com o O4 finalmente cobrável.
- O V.3 encolhe um pouco e fica mais coerente: a perna "servir" da tríade passa a ser sobre servir, não sobre escolher.
- **O risco assumido**, que a lente pedagógica nomeou: o V.2 fica mais longo e com um assunto a mais. A mitigação é a posição da seção, colada ao contrato que a motiva, e o teto do verbo nos exercícios, que é *decidir* e não *projetar uma arquitetura de serving*.
- A segunda metade da D16 continua aberta: o **O2 do V.3** (implantar atrás de API com contrato e validação de entrada) segue sem conteúdo que o sustente. Ela é decidida no ciclo do próprio V.3, e não aqui.
- Fontes conferidas em primeira mão nesta rodada, com citação verbatim no capítulo: Rules of ML (#31 e #32), Michelangelo, e o texto de Huyen de 2022. Duas delas eram ⏳ no V.2 e sobem para ✓.
