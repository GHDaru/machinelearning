# ADR 0003 — Dado sintético na etapa 00 da trilha prática

**Data:** 2026-08-01 · **Estado:** aceito

## Contexto

A etapa 00 do `ml-zero` precisa de um dataset. O Princípio VI exige custo zero; o Princípio II exige reprodutibilidade; e o Princípio V proíbe dado pessoal identificável.

## Decisão

A etapa 00 usa um **dataset sintético**, gerado por um processo declarado no próprio repositório, com seed fixa e ruído irredutível conhecido. Dados reais entram a partir da **etapa 02**, quando o capítulo 02 tiver preparado o leitor para as patologias que só o dado real tem.

## Alternativas avaliadas

**A. Dataset clássico baixado** (Titanic, Iris, Adult). Familiar e realista. Perdeu por três razões: exige rede na primeira execução; introduz uma dependência externa que pode sair do ar ou mudar; e vários dos clássicos carregam problemas éticos documentados que mereceriam um capítulo inteiro — usá-los como exemplo neutro na página 1 contradiz o Princípio V.

**B. Dataset real pequeno, versionado no repositório.** Resolve rede e estabilidade. Perdeu na etapa 00 por não permitir conhecer o teto teórico — e é justamente esse teto que dá sentido pedagógico à linha de base. Continua sendo a escolha certa a partir da etapa 02.

**C. Sintético gerado por biblioteca** (`sklearn.make_classification`). Perdeu por contradizer a regra "do zero antes da biblioteca" logo na primeira etapa, e por esconder o processo gerador — que é justamente o que torna a etapa didática.

## Justificativa

Conhecendo o processo verdadeiro, conhecemos **piso e teto**: a linha de base (81% de acurácia, 0% de revocação) e o máximo alcançável (~96%, dado o ruído de 8% injetado de propósito). Ter os dois números explícitos transforma a etapa 00 numa régua para tudo o que vem depois — algo impossível com dado real, onde ninguém sabe qual é o teto.

E resolve custo, rede e reprodutibilidade de uma vez: a mesma seed dá o mesmo conjunto hoje e daqui a dois anos, sem depender de um servidor continuar no ar.

## Consequências

**Mais fácil:** rodar em qualquer máquina, sem rede; comparar o erro do modelo com o teto teórico; reproduzir resultados anos depois.

**Mais difícil:** o leitor não encontra as patologias do dado real — ausentes traiçoeiros, vazamento acidental, viés de coleta.

**Exige cuidado:** essa limitação precisa ser **declarada no próprio código e no capítulo**, e não descoberta pelo leitor. O docstring de `etapa-00/dados.py` a declara; o README da trilha a repete. Um dado sintético apresentado como se fosse real seria a violação mais direta possível do Princípio I, num livro que ensina justamente a desconfiar de resultado bom demais.
