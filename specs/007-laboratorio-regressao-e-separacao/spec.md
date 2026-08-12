# Spec 007 — Laboratório de regressão linear, dedução do método, e a separação linear × logística

**Data:** 2026-08-11 · **Estado:** implementado

## Por quê

O pedido do autor, em uso real de sala:

> *"vamos fazer um exercício de laboratório que ele gera uma curva com dados aleatórios e o aluno pode interagir com a reta mexendo nos coeficientes ou direto na reta e o cálculo dos erros são calculados diretamente. Colocar algumas métricas e claro a métrica que vamos minimizar e um botão para otimizar ou revelar a reta ótima. […] Criar uma sessão de dedução do método. E separar regressão linear e em outro regressão logística."*

Três necessidades distintas, e uma delas explica as outras duas.

**1. O capítulo II.2 ensina o método pelo resultado, não pela dedução.** Ele afirma que a reta minimiza o erro quadrático, mostra a fórmula da perda e informa que existe solução fechada — mas **não deriva nada**. O leitor recebe as equações normais como fato revelado. O laboratório do capítulo III.1 provou o antídoto: o estudante que põe os pesos à mão e trava no XOR **descobre** a impossibilidade em vez de ser informado dela.

**2. O capítulo II.2 carrega dois modelos.** Regressão linear e logística dividem o mesmo capítulo porque compartilham a forma `w·x + b`. Só que respondem perguntas diferentes (quanto × qual), têm perdas diferentes, saídas em unidades diferentes e — o ponto que decide — **uma tem solução fechada e a outra não**. Espremidos num capítulo só, a logística ganha 30 linhas e nenhum laboratório.

**3. Um capítulo com dois modelos não cabe num laboratório só.** A interação que ensina a reta (arrastar e ver o erro cair) não é a que ensina a sigmoide.

## O que precisa ser verdade ao final

| # | Critério de aceite | Como se verifica |
|---|---|---|
| A1 | O laboratório gera dados aleatórios com ruído e desenha os pontos | abrir a página; botão "novos dados" muda a nuvem |
| A2 | O aluno muda a reta por **coeficientes** (inclinação e intercepto) | mexer nos campos e ver a reta mover |
| A3 | O aluno muda a reta **arrastando diretamente** sobre o gráfico | arrastar as alças e ver os coeficientes mudarem junto |
| A4 | Os resíduos aparecem **desenhados**, ponto a ponto | segmento vertical de cada ponto até a reta |
| A5 | As métricas recalculam a cada movimento | SQE, EQM, RMSE, EAM e R² |
| A6 | A métrica minimizada está **marcada como tal** | o EQM em destaque, com rótulo explícito |
| A7 | Existe botão que **revela a reta ótima** | reta de referência em cor distinta, com o EQM dela |
| A8 | Existe botão que **ajusta automaticamente** os coeficientes | os campos passam a valer a solução fechada |
| A9 | Roda **sem backend** | funciona com a API fora do ar |
| A10 | O capítulo II.2 tem uma seção de **dedução** do método | derivação das equações normais, do critério ao resultado |
| A11 | Regressão logística é um **capítulo próprio** | arquivo, número estável, entrada no sumário |
| A12 | Nenhum link do livro aponta para uma âncora que deixou de existir | `npm run build` valida links internos e falha |
| A13 | O capítulo novo cumpre o Princípio X | seção "De onde isto veio" com tabela de selos; o build cobra |
| A14 | O banco de exercícios não deriva | `node exercicios.mjs --verificar` |

## Fora de escopo

- Laboratório de regressão logística (fica registrado como próximo passo; a interação é outra).
- Regressão múltipla no laboratório: a manipulação direta só faz sentido em duas dimensões.
- Renumerar capítulos. O número é identificador estável (`_nota_numeracao` do sumário).

## Riscos

| Risco | Mitigação |
|---|---|
| Separar quebra links de outros capítulos para as âncoras da logística | o gate de links internos do build falha; foi assim que os quatro pontos foram encontrados |
| O exercício `modelos-lineares-e2` é de logística e muda de capítulo | vira `regressao-logistica-e1`; tentativas antigas no banco ficam órfãs — aceito e registrado no ADR 0009 |
| O capítulo novo nasce devendo o Princípio X | escrever a seção histórica **no mesmo lote**, com selos honestos — não ✓ onde só houve metadado |
