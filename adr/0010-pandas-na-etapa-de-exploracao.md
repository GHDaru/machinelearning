# ADR 0010 — pandas e matplotlib na etapa de exploração (e só nela)

**Data:** 2026-08-12 · **Estado:** aceito

## Contexto

A trilha `ml-zero` tem uma regra de origem: **nada entra antes de a etapa exigir**. A etapa 00 roda em biblioteca padrão pura — nem NumPy —, e o `requirements.txt` documenta a entrada de cada dependência: NumPy na 05, FastAPI na 15.

A regra existe por uma razão pedagógica, não estética: **nada deve ficar entre o estudante e o entendimento**. Uma divisão treino/teste é uma lista embaralhada com cuidado, e ver isso vale mais do que chamar `train_test_split`.

O capítulo 21 (Análise Exploratória) chegou pedindo notebook, depois de uma aula em que o autor percorreu tipo de cada campo, contagem, nulidade, medidas de posição, separatrizes, histograma e boxplot. E aqui a regra encosta no seu limite.

## Decisão

**A etapa 21 usa `pandas` e `matplotlib`. Nenhuma outra etapa passa a usar.**

O argumento é o mesmo que justifica a regra, aplicado ao contrário. O que se ensina no capítulo 21 é **ler uma distribuição**: onde está o centro, quanto ela espalha, para que lado puxa, o que há nas pontas. Desenhar um histograma com `canvas` ou compor um boxplot a partir de linhas ensina **sobre desenho**, e o tempo do estudante é gasto em coordenadas em vez de em quartis.

Onde a implementação à mão ensina, ela fica: `quantil`, `descritivas` e a cerca de 1,5 × IQR estão escritas **em JavaScript puro** no laboratório `21-l1` (`publicar/tema/laboratorios.js`) — 30 linhas, à vista de quem quiser ler. O notebook é a ferramenta de quem **explora**; o laboratório é a de quem **entende a conta**.

Há um segundo motivo, este de mundo real: pandas é a ferramenta que o estudante vai usar na disciplina e no trabalho. Ensinar exploração sem ela seria treinar para um ambiente que não existe.

**Custo zero permanece** (Princípio VI): as duas bibliotecas já vêm instaladas no Google Colab, então a trilha prática continua rodando sem instalar nada e sem pagar nada.

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| **Manter biblioteca padrão** e desenhar os gráficos à mão | O notebook viraria uma aula de desenho vetorial. O objetivo do capítulo é ler distribuição, não plotar |
| **Só o laboratório no navegador**, sem notebook | O autor pediu explicitamente um notebook para o aluno levar ao Colab e acompanhar passo a passo. E o notebook faz algo que o laboratório não faz: mostra **o código** que produz cada número |
| **pandas em toda a trilha** | Destruiria a razão de a etapa 00 existir. A construção do zero é o diferencial do `ml-zero` |
| **Usar `statistics` da biblioteca padrão + tabelas de texto** | Resolveria as estatísticas e não resolveria histograma nem boxplot, que são metade do capítulo |

## Consequências

**A favor:**

- O notebook fica com o tamanho e a legibilidade que um material de aula precisa ter.
- O estudante pratica na ferramenta que vai usar de verdade.
- A regra do `requirements.txt` continua honesta: cada dependência tem uma etapa declarada que a exige.

**Contra, e assumido:**

- **Duas dependências pesadas** entram no `requirements.txt`, e o CI passa a instalá-las. O verificador de notebooks precisa delas para rodar a etapa 21.
- **A fronteira agora tem exceção**, e exceção convida a próxima. A trava é este ADR: quem quiser pandas noutra etapa precisa justificar por escrito **por que a implementação à mão não ensina** aquilo — que foi o argumento aceito aqui.

## O que isto custou de imediato

O verificador de notebooks (`ml-zero/tests/rodar_notebooks.py`) rodava todos os notebooks **no mesmo processo**, limpando `sys.modules` entre eles. Funcionava enquanto tudo era biblioteca padrão; quebrou no primeiro `import numpy`, com `cannot load module more than once per process` — extensão em C não recarrega.

Passou a rodar **um processo por notebook**, que além de consertar é mais fiel: é o que o Jupyter dá ao aluno.
