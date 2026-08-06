# Por que a etapa 07 não reusou o dado da etapa 00

> Nota de medição · 2026-08-05 · sustenta uma decisão de [`ml-zero/etapa-07/dados_tabulares.py`](../ml-zero/etapa-07/dados_tabulares.py)

## A pergunta

Reusar o dataset da etapa 00 no experimento do capítulo 07 seria mais elegante: um dado só, atravessando o livro. A primeira versão do experimento fez isso — e os quatro modelos terminaram empilhados entre 0,55 e 0,57 de AUC, sem distinguir nada.

Antes de mexer no código, a pergunta certa era: **qual é o teto deste dado?**

## A medição

Como nós escrevemos o processo gerador, dá para calcular o classificador de Bayes — ordenar pela probabilidade verdadeira — e medir a AUC que ele alcança. É o luxo do dado sintético (ADR 0003).

| Medida | AUC |
|---|---|
| Classificador de Bayes, com os 8% de flips | **0,5895** |
| Classificador de Bayes, sem os flips | 0,7155 |
| Melhor modelo obtido (boosting) | 0,5693 |
| Atributo `uso` sozinho | 0,5563 |

## A leitura

O boosting alcançou **96% do teto teórico**. Os modelos não estavam errados — o dado é que não tinha o que medir.

A causa é aritmética: 8% de flips num problema com 19% de prevalência corrompem cerca de **40% dos positivos**. O que sobra de sinal não separa modelos.

Há uma segunda razão, e ela é mais importante que a primeira: **a fronteira da etapa 00 é uma sigmoide suave**. Um modelo linear a descreve quase perfeitamente. Usar esse dado para argumentar a favor de árvores seria montar o experimento no terreno onde árvores não têm vantagem — e concluir o contrário do que o terreno diz.

## A decisão

A etapa 07 gera o próprio dado, com as características que Grinsztajn et al. (2022) identificam no tabular real: atributos não informativos, função irregular e sensibilidade à orientação dos eixos. O teto do novo dado é **0,9402**, e os modelos se espalham de 0,4963 (linear) a 0,9392 (boosting) — faixa suficiente para o experimento significar alguma coisa.

**O que não foi feito, e por quê.** A etapa 00 **não** foi alterada. A lição dela — 81% de acurácia com 0% de revocação — depende daquele dado, já está publicada, e continua correta. Trocar dado publicado para fazer um experimento novo ficar bonito é a forma mais direta de perder a confiança do leitor.

## O que fica registrado

Que este experimento tem o resultado embutido no gerador é declarado no próprio capítulo 07, em destaque. A ilustração serve para tornar o mecanismo visível; a evidência de que dado tabular real tem essa forma é do paper, não nossa.
