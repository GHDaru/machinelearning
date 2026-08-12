# ADR 0012 — A Verificação vira superfície corrigida, uma pergunta por capítulo

**Data:** 2026-08-12 · **Estado:** aceito (direção decidida; conversão faseada) · **Relaciona-se** ao [ADR 0001](0001-correcao-de-exercicios-no-servidor.md) e ao [ADR 0002](0002-sintaxe-interativa-no-markdown.md)

## Contexto

A auditoria de Bloom da onda 3 mediu uma assimetria que ninguém tinha visto porque as duas superfícies eram lidas separadamente:

- **Exercícios** — 104 blocos `:::exercicio`, corrigidos no servidor, com revelação progressiva.
- **Seção `## Verificação`** — ~87 perguntas abertas no fim dos capítulos, **sem correção, sem gabarito, sem rubrica**.

As perguntas da Verificação estão consistentemente **um a dois degraus cognitivos acima** dos exercícios do mesmo capítulo, e frequentemente são a **única** cobrança do nível declarado no objetivo. `iii-2-redes-neurais.md` pede escrever os pesos de um MLP que computa XOR; `ii-2-modelos-lineares.md` pede demonstrar que a reta passa pelo centro de massa. Nenhuma das duas é corrigida.

A consequência é a que importa: **toda a cobrança de nível Criar do livro está fora do circuito de correção**, enquanto o Princípio VIII diz que "ler não é aprender: o leitor pratica **e recebe resposta**". A dívida D13 (15 objetivos de nível Criar sem exercício de produção) é a mesma coisa, contada por outro lado.

Três pareceres independentes foram encomendados — avaliação da aprendizagem, arquitetura e custo, e professor com turma em curso. Os relatórios estão no diário desta sessão; o que segue é o que foi verificado e aceito.

## O que os três disseram

**Convergiram em três pontos**, e a convergência é o que sustenta esta decisão:

1. **Não converter as ~87.** Converter uma por capítulo (~30), escolhida por critério, e manter as demais.
2. **Não criar um tipo novo de bloco.** `tipo: "aberta"` já existe e já é corrigido por rubrica; a distinção é pedagógica, e distinção pedagógica se carrega em atributo.
3. **Fasear e medir** antes de escalar para o livro inteiro.

**Divergiram num ponto, e o desacordo é real.** O parecer de avaliação quer que a explicação revelada na 2ª tentativa seja **solução de referência completa** (worked example, no sentido de Sweller). O professor recusa exatamente isso: a pergunta do vazamento é o que ele usa para abrir a aula seguinte, e "o gabarito já disse" queima o material — entre semestres, irreversivelmente.

## Decisão

**Converter uma pergunta-âncora por capítulo em `:::exercicio` do tipo `aberta`, marcada por atributo, e escolher as primeiras pelos objetivos que hoje não têm cobrança nenhuma.**

### 1. Atributo, não tipo novo

```
:::exercicio {"id":"redes-neurais-e4","tipo":"aberta","objetivo":"O2","secao":"verificacao","pontos":3}
```

Um campo. Zero mudança de backend. O tipo novo `:::verificacao` foi **recusado explicitamente**: custaria dias em cinco arquivos para reproduzir semântica que `aberta` já tem, dobraria a matriz de teste e não mudaria uma linha do que o leitor experimenta.

### 2. O critério de escolha é a dívida, não a ambição

Os três pareceres propuseram critérios de qualidade para escolher a âncora (verificável fora do contexto do leitor; única cobrança do verbo declarado; não duplica exercício existente). Todos valem, e há um critério que os ordena: **converta primeiro onde o objetivo hoje não é cobrado por ninguém.**

Isso amarra esta decisão à D13 e à lista `ORFAOS_ACEITOS` de `publicar/exercicios.mjs`. A conversão deixa de ser um projeto editorial paralelo e passa a ser **o mecanismo pelo qual a dívida dos objetivos é paga** — um capítulo de cada vez, com o gate bidirecional cobrando a retirada da exceção no mesmo commit.

### 3. Revelar os critérios, não a solução

O desacordo se resolve separando o que estava junto. A 2ª tentativa desses exercícios revela **a avaliação critério a critério e o comentário** — que é resposta substantiva, e satisfaz o Princípio VIII.2 (feedback que só diz "errado" é proibido). Não revela a solução de referência pronta.

O worked example que o parecer de avaliação pede é legítimo e **vai para o corpo do capítulo**, não para o gabarito — que é precisamente o que a onda 3 já vinha fazendo ao inserir exemplos numéricos trabalhados em `iii-2`, `iii-4`, `iv-2` e `ii-2`. O leitor solitário recebe o exemplo trabalhado antes de tentar; o professor mantém a pergunta viva para a aula. Nenhum dos dois é servido pela solução pronta na segunda tentativa.

### 4. Rubrica de quatro critérios para esse nível

Para `secao: "verificacao"` o mínimo sobe de 2 para **4 critérios**, todos observáveis lendo apenas a resposta:

1. **Artefato exibido** — os números ou passos estão lá.
2. **Especificação satisfeita** — o critério mecânico que decide (as 4 linhas da tabela-verdade conferem).
3. **Mecanismo explicado** — o que o artefato fez.
4. **Anti-critério** — o movimento errado comum, nomeado: *"não vale afirmar que existe solução sem exibir os pesos"*. É o análogo do distrator plausível.

## Pré-condições — o que precisa estar consertado antes de escalar

Verificadas no código, não aceitas de relatório:

| Defeito | Onde | Por que bloqueia |
|---|---|---|
| `correto = atendidos == total` — rubrica é tudo-ou-nada | `chat-companion/backend/exercicios.py:158` | com 4 critérios, esses exercícios dominariam o ranking de "difíceis" e destruiriam o sinal *taxa baixa = texto mal escrito* |
| `progresso` agrega de `tentativas` **sem join com o banco** | `chat-companion/backend/store.py:131-142` | id que sai do livro continua contando no progresso do leitor e no CSV da turma — é o que torna a conversão cara de desfazer |
| barra de capítulo só fecha em 100% | `publicar/tema/interativos.js` | mais itens tudo-ou-nada por capítulo = leitor que nunca vê verde |

A terceira é cosmética; as duas primeiras são pré-condição para escalar além do primeiro lote.

## O defeito que a investigação encontrou de passagem

O parecer de arquitetura levantou, como efeito colateral, que a exportação em Markdown grava o arquivo-fonte cru. **Conferido: era verdade, e era pior do que efeito colateral.** `docs/md/machine-learning.md` continha **79 gabaritos e 30 rubricas**, e o botão "⬇ md" fica na página do capítulo, ao lado do exercício que deveria custar duas tentativas.

O desenho estava certo e a promessa era falsa: `renderizar()` protegia o HTML, e ninguém tinha conferido a outra porta. Corrigido nesta mesma sessão (`semGabarito()` em `publicar/interativos.mjs`), com gate que falha o build — e visto falhando, 273 vazamentos, antes de ser dado por pronto.

Vale registrar como padrão, porque é o terceiro caso: **"saída tecnicamente válida, comportamento errado"** — defeito que nenhum gate mecânico pegava porque ninguém tinha usado o artefato pelo lado do leitor.

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| **Converter as ~87** | ~29 h de autoria honesta; ~17 perguntas são ancoradas no contexto do leitor ("o último sistema em que você trabalhou") e rubricar isso é fingir correção sobre artefato que o corretor não viu; e faria a D13 **parecer paga** sem ninguém produzir nada |
| **Tipo novo `:::verificacao`** | dias de código em cinco arquivos para semântica que `aberta` já tem |
| **Não converter** | custo zero e mantém o Princípio VIII descumprido justamente no topo da taxonomia |
| **Liberar só após os exercícios do capítulo** | o projeto já aprendeu que gate de entrada não prova nada sobre a saída (lição do selo, ADR 0005); aqui só produziria clique |

## Consequências

**Aceitas.** A Verificação deixa de ser uma seção homogênea: uma pergunta sai dela e vira exercício; as outras duas ficam, e passam a declarar em uma linha **por que** não são corrigidas — o que hoje o leitor tem de adivinhar. O placar da capa cresce sem que perguntas novas tenham sido escritas, e isso precisa ser dito no CHANGELOG a cada lote para não parecer produção.

**Custo recorrente.** Só `aberta` chama o modelo. Cada conversão desloca custo único de autoria para custo por turma, por coorte, para sempre. É a razão de fasear: 30 conversões multiplicam por ~2 as chamadas de LLM do livro.

**Reversível no repositório, cara de reverter no banco** — enquanto a segunda pré-condição não estiver paga. É o motivo de o primeiro lote ser pequeno.

**Não decidido aqui:** o que fazer com as ~17 perguntas ancoradas no contexto do leitor. Elas continuam sem correção, e continuar assim é a escolha certa até haver uma superfície que saiba avaliar artefato que não viu.
