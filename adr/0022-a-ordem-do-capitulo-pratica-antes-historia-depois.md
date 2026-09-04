# ADR 0022 — A ordem do capítulo: prática antes, história depois — e onde isso NÃO vale

**Data:** 2026-09-01 · **Estado:** aceito · **Comitê:** pesquisa educacional com fontes seladas, professor conteudista, e o autor

## Contexto

O autor navegou o `II.2` recortado em cartões e pediu uma inversão de ordem:

> *"Primeiro ele pratica, depois ele descobre de onde veio. E por fim curiosidades históricas, com ilustrações, imagens."*

E pediu, junto: *"veja se bate com a teoria"*.

Duas coisas estavam no caminho. A primeira é o **Princípio X** da constituição, que fixa a posição da seção histórica: *"vai depois de 'o problema' e antes da intuição"*. A segunda é que "praticar antes" tem evidência, e a evidência tem uma fronteira que o pedido não previa.

Esta decisão existe porque o `CLAUDE.md` manda: *"em conflito entre um pedido pontual e a constituição, a constituição prevalece — ou o conflito é explicitado ao usuário antes de agir."* Foi explicitado, e o autor decidiu seguir. O que segue é o registro do que se decidiu e do que a evidência sustenta.

## Decisão 1 — "praticar antes" vale por **tipo de conhecimento**, não por capítulo

A meta-análise de resolver-antes-de-explicar (Sinha & Kapur, 2021 — 53 estudos, 166 comparações) separa dois resultados que costumam ser citados como um só:

| O que se aprende | Praticar antes rende |
|---|---|
| Conceito e transferência | **g = 0,36** · IC [0,20 · 0,51] |
| **Procedimento** | **g = −0,03** · IC [−0,20 · 0,15] |

O `II.2` tem os dois, e eles estão separados pelos próprios objetivos declarados:

- **O1 e O2** — derivar a regressão como minimização, obter as equações normais. É **procedimento**. Zona do −0,03.
- **O3 e O4** — interpretar o coeficiente e dizer o que ele não significa, reconhecer quando o linear é a escolha certa. É **conceito e transferência**. Zona do +0,36.

**A regra que fica:** prática antes da explicação nos atos de conceito e transferência; exemplo trabalhado antes da prática nos atos de procedimento.

Duas condições, e as duas têm número:

1. **A prática não pode ser sem assistência.** Descoberta não assistida rende **d = −0,38**; descoberta com feedback, exemplo trabalhado, andaime e explicação elicitada rende **d = +0,30** (Alfieri et al., 2011). A diferença entre as duas não é de grau: é de sinal.
2. **A explicação que vem depois tem de construir sobre o que o leitor tentou.** Instrução que se apoia nas tentativas do aluno rende **g = 0,56**; a que ignora rende **0,20** (Sinha & Kapur). Um laboratório seguido de um texto genérico é a versão de baixa fidelidade, e é ela que produz os efeitos pequenos que se atribuem ao método.

### O corolário que já era verdade e ninguém tinha escrito

O `GUIA-EDITORIAL.md` §2.3 manda: *"ponha o laboratório antes da explicação, não depois."* A regra está certa e **incompleta**: ela vale para conceito e transferência, e não vale para procedimento. O guia passa a dizer isso.

E vale registrar a convergência, porque ela não foi combinada: um diagnóstico pedagógico do capítulo, feito sem ver esta pesquisa, mediu densidade e concluiu que *"este é um capítulo com dois capítulos dentro"* — cartões 1 a 11 a 2,9 ideias novas por 100 palavras, exigindo cálculo; cartões 12 a 18 a 1,1, sem cálculo nenhum. **A junta que a densidade acha é a mesma que o tipo de conhecimento acha.** Duas análises independentes, mesmo corte.

## Decisão 2 — a seção histórica vai para o fim, e o Princípio X é emendado

O Princípio X passa a permitir **duas posições** para "De onde isto veio":

- **depois de "o problema" e antes da intuição** (a posição original), quando a história *estabelece o aperto* que o método resolve;
- **ao fim do capítulo**, quando o capítulo já leva o leitor ao aperto por outro caminho — tipicamente pela prática.

O que **não** muda, e é o que o princípio protege: os **cinco elementos** e a **tabela de selos** continuam obrigatórios, em qualquer das duas posições. A seção pode mudar de lugar; não pode mudar de natureza.

**A evidência para esta parte é honesta e magra: não existe.** Procurei estudo sobre a posição de narrativa histórica em material instrucional e **não achei** — selo ❌. O que sustenta a mudança não é aprendizagem medida, é **ritmo**, e o argumento veio do diagnóstico: a disputa Legendre–Gauss é *"o primeiro lugar onde bate o olho de quem acha o capítulo lento — trinta linhas antes do modelo"*.

Registrar isso como preferência editorial fundamentada, e não como decisão baseada em evidência, é a diferença entre esta ADR e uma justificação.

## Decisão 3 — "curiosidades" é recusado; ilustração entra a serviço do mecanismo

O pedido dizia *"por fim curiosidades históricas, com ilustrações, imagens"*. A primeira metade é recusada e a segunda é aceita com condição.

**Curiosidade é proibida pela própria constituição**, com estas palavras: *"curiosidade decorativa — se o parágrafo sai sem perda de compreensão, é enfeite"*. E o Princípio X exige, como quarto elemento e *"o que mais importa"*, a **ideia reaproveitável**. A Legendre–Gauss tem uma, e forte: *crédito não segue descoberta, segue comunicação* — que o capítulo já converte numa exigência prática (script, semente e saída colada). Rebatizar a seção como "curiosidades" perde exatamente o que a justifica.

**A seção histórica muda de lugar e mantém o nome, os cinco elementos e os selos.**

Sobre as ilustrações, há uma cautela que eu não consigo dimensionar e por isso declaro assim: existe meta-análise sobre o **efeito de detalhe sedutor** — imagem interessante e irrelevante prejudicando o aprendizado —, publicada como *"Keep it Coherent"* (Sundararajan & Adesope, *Educational Psychology Review* 32, 2020, [10.1007/s10648-020-09522-4](https://doi.org/10.1007/s10648-020-09522-4)). **Selo ✓ᵐ: o editor está fechado e eu não consegui abrir o texto.** Metadado prova que a obra existe, não o que ela afirma — então **nenhum tamanho de efeito é citado aqui**, e a direção do achado entra como cautela, não como prova.

**A regra que fica, e ela não depende daquele número:** ilustração entra a serviço do **mecanismo**, não da curiosidade. O livro já tem o padrão — a figura do *block group* e a da camada escondida são **geradas dos dados** e **se recusam a existir** se os dados pararem de sustentar o que elas afirmam. Uma ilustração histórica decorativa não tem como cumprir isso, e é esse o teste.

## A ordem que resulta

```
Ato I    O problema, curto            quem está preso, e em quê
Ato II   A conta                      exemplo trabalhado PRIMEIRO, depois desvanece
                                      (procedimento: g = −0,03 para praticar antes)
Ato III  A leitura                    PRÁTICA primeiro, explicação depois
                                      (conceito e transferência: g = +0,36)
Ato IV   A decisão                    prática primeiro
Ato V    De onde isto veio            os cinco elementos e os selos, no fim
```

## Alternativas avaliadas

**Manter a ordem original e recusar o pedido.** O Princípio X permitiria, e o custo seria real: o capítulo continua abrindo com trinta linhas de história antes do modelo, que é o ponto onde o diagnóstico diz que o leitor apressado desiste. Recusada porque a evidência não obriga a posição original — ela simplesmente não fala sobre isso.

**Aplicar "praticar antes" ao capítulo inteiro, como o pedido sugeria.** Recusada por número: no Ato II isso é a zona do g = −0,03, e com prática sem assistência vira d = −0,38. Seria trocar uma metade que funciona por uma que a evidência não sustenta.

**Transformar a seção histórica em "curiosidades" ilustradas.** Recusada pela constituição, e sem hesitação: é o único item deste pedido que colide com uma proibição escrita, e não com uma preferência.

**Cortar a seção histórica do capítulo.** Nunca esteve em jogo, e vale dizer por quê: o Princípio X é NÃO-NEGOCIÁVEL e a seção é portão do nível `essencial`.

## Consequências

- O `GUIA-EDITORIAL.md` §2.3 ganha a fronteira que faltava: laboratório antes vale para conceito e transferência, não para procedimento.
- O Princípio X passa a admitir duas posições, com os cinco elementos e os selos intactos nas duas. É emenda **MINOR** da constituição.
- Os outros 28 capítulos **não** mudam de ordem por causa desta ADR. A posição ao fim é uma permissão, e cada capítulo a exerce ou não conforme leve o leitor ao aperto pela prática ou pela história.
- Fica uma dívida de verificação, no formato que o §2.4 pede: **abrir o texto de "Keep it Coherent"** e trocar o ✓ᵐ por ✓ ou por uma correção. Enquanto isso não acontecer, nenhum número dele é citável.
