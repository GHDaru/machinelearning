# ADR 0009 — Separar regressão linear e logística em dois capítulos

**Data:** 2026-08-11 · **Estado:** aceito

## Contexto

O capítulo 05 nasceu chamado "Modelos Lineares" e cobria **dois** modelos: regressão linear e regressão logística. A justificativa era a forma compartilhada $w \cdot x + b$.

O uso em sala mostrou o custo. Ao pedir um laboratório de mínimos quadrados e uma seção de dedução do método, o autor expôs o que estava implícito: **os dois modelos não cabem no mesmo capítulo sem que um deles vire apêndice do outro.**

O que eles de fato compartilham é a forma linear. O que os separa:

| | Linear | Logística |
|---|---|---|
| Pergunta | quanto | qual |
| Saída | na unidade de $y$ | probabilidade |
| Perda | erro quadrático | entropia cruzada |
| **Solução fechada** | **existe** | **não existe** |
| Leitura do coeficiente | efeito direto em $\hat{y}$ | multiplica a razão de chances |
| Interação que ensina | arrastar a reta e ver o erro | ajustar a curva em S |

A última linha decidiu: o laboratório que ensina a reta **não** é o que ensina a sigmoide. Um capítulo com dois modelos precisaria de dois laboratórios, duas deduções e duas seções de interpretação — e é isso que dois capítulos são.

Antes da separação, a logística tinha **30 linhas e um exercício** dentro do 05.

## Decisão

**A regressão logística vira o capítulo 28.** O 05 fica só com a linear, e ganha o laboratório e a dedução.

**O número é 28, e não 06 ou uma renumeração.** O `_nota_numeracao` do sumário estabelece que o número do capítulo é **identificador estável**, não posição de leitura — a ordem vive nas trilhas. Renumerar quebraria links externos, o progresso dos leitores e os ids dos exercícios de metade do livro. O 28 é simplesmente o próximo livre; na trilha de Análise Preditiva ele aparece como item **10**, logo depois do 05.

**Os exercícios de logística mudam de id.** `05-e2` vira `28-e1`, e `05-e3` (razão de chances, que também era de logística) vira `28-e2`. O exercício novo da dedução recebe **`05-e7`**, e não o `05-e2` vago.

Essa última escolha é a que importa: reusar `05-e2` para uma pergunta diferente faria as tentativas antigas dos leitores apontarem para outro exercício, **em silêncio**. Um id vago é barato; um id reciclado corrompe o histórico de quem já respondeu.

**A consequência aceita:** quem já respondeu `05-e2` ou `05-e3` tem tentativas registradas contra ids que não existem mais no banco. O progresso dessas pessoas passa a mostrar dois exercícios órfãos. É o menor dano disponível — o alternativo seria manter os ids num capítulo onde não pertencem mais.

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| **Manter tudo no 05** e só acrescentar o laboratório | O capítulo passaria de 300 para 450 linhas com dois modelos, dois laboratórios e duas deduções. É o "amontoado" que a metodologia combate: um assunto por página |
| **Renumerar** (logística vira 06, otimização vira 07…) | Quebra a regra de identificador estável, os links externos e os ids de exercício de todo o livro |
| **Logística como seção do capítulo 09** (redes neurais) | Tentador — um neurônio com sigmoide **é** uma regressão logística. Mas inverte a dependência: o 09 explica a rede supondo que o leitor já entende a unidade. E a logística é ferramenta de Análise Preditiva, disciplina que não chega ao 09 |
| **Apagar a logística** do livro | Está na ementa de duas disciplinas |

## Consequências

**A favor:**

- A logística sai de 30 linhas para um capítulo com história, dedução da perda, três exercícios e vídeo próprio.
- O capítulo 05 ganha espaço para o que o autor pediu: o laboratório e a dedução em cinco passos.
- A pergunta *"por que a logística não tem solução fechada?"* — que no capítulo antigo era uma frase solta — vira uma seção que **mostra onde a dedução do 05 para de funcionar**. Os dois capítulos ficam mais fortes por serem dois.

**Contra, e assumido:**

- **Dois exercícios órfãos** no histórico de quem já os respondeu (acima).
- **Um capítulo a mais** para manter, revisar e datar.
- O capítulo 28 nasce com **três fontes seladas `✓ᵐ`** — Berkson (1944), Verhulst (1838) e Cox (1958). Sei que existem, com DOI conferido; **não as li**. Está declarado no próprio capítulo e é a dívida **D10**, que se paga lendo.
