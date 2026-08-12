# ADR 0011 — Numeração por parte, e o id do exercício desatado do número

**Data:** 2026-08-12 · **Estado:** aceito · **Substitui** a regra de numeração do [ADR 0009](0009-separar-linear-e-logistica.md)

## Contexto

O livro numerava capítulos por ordem de criação, e declarava esse número **identificador estável** (`publicar/sumario.json`, `_nota_numeracao`). A justificativa era boa: três disciplinas leem em três ordens diferentes, e a ordem de leitura vive nas trilhas.

O custo apareceu na medição, e é maior do que a dívida D7 do roadmap dizia:

```
posição  1  cap 00        posição 11  cap 28
posição  3  cap 19        posição 17  cap 18
posição  5  cap 02        posição 23  cap 08
```

**Nenhuma das 29 posições coincidia com o número.** Não era "numeração fora de ordem": era numeração que não guardava relação alguma com o sumário. E o capítulo 28, criado ontem entre o 05 e o 06, tornou isso visível na Parte II.

## Decisão

**O capítulo passa a ser identificado por parte e posição dentro dela:** `II.2 — Modelos Lineares`, arquivo `ii-2-modelos-lineares.md`, endereço `/ii-2-modelos-lineares.html`.

A escolha é do autor, entre quatro alternativas apresentadas (§Alternativas). O que ela compra: **inserir um capítulo desloca apenas os vizinhos da mesma parte**, não o livro inteiro. Ontem, o capítulo novo teria renumerado seis capítulos em vez de vinte e três.

### O id do exercício deixa de carregar o número

`05-e1` virou **`modelos-lineares-e1`**. Esta é a parte da decisão que não foi pedida e é a que mais importa.

Se o id seguisse a numeração — `ii-2-e1` —, inserir um capítulo no meio da Parte II renumeraria os exercícios de todos os capítulos seguintes, e **o progresso de cada aluno apontaria para exercícios que deixaram de existir**. Aconteceria a cada inserção, para sempre.

O nome do capítulo não muda quando a posição muda. Então: **números para humanos, nomes para máquinas.** O leitor vê "II.2"; o banco de dados vê `modelos-lineares`.

### O "capítulo" que o companion usa vira posição de leitura

O gating de capacidades (`chat-companion/backend/capabilities.py`) liberava ferramentas por número de capítulo: diagnóstico de dados no 2, métricas no 4, contas no 6. Com "II.2" no título, não há inteiro para comparar.

Passou a ser a **posição de leitura** (1..29), e os três valores foram traduzidos: 2 → 5, 4 → 9, 6 → 12. É o que o gating sempre quis dizer — *"depois que o leitor passou por tantos capítulos"* — e que o número de criação nunca disse.

### Os endereços antigos quebram, por decisão explícita

`/05-modelos-lineares.html` passa a dar 404. O autor aceitou o custo: o livro tem dias de vida, e havia **13 tentativas** registradas em produção. Redirecionar 29 URLs custaria uma tabela de-para versionada para sempre, para preservar links de uma semana.

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| **Renumerar 01–29 pela ordem do sumário** | Resolve hoje e reabre amanhã: qualquer inserção no meio renumera o livro inteiro — exatamente o que acabou de acontecer com o capítulo 28 |
| **Tirar o número do endereço** (`/modelos-lineares.html`, número só como rótulo calculado) | **É a única solução permanente**, e foi apresentada como tal. O autor preferiu manter o número no endereço; a numeração por parte reduz o custo das inserções futuras sem eliminá-lo |
| **Não renumerar; exibir a posição ao lado do número** | Trata o sintoma. O sumário fica legível e o leitor continua vendo "capítulo 19" antes de "capítulo 02" |
| **Numerar pela trilha de Análise Preditiva** | Serve uma disciplina e desserve as outras duas. É a razão de o número ter virado identificador estável em primeiro lugar |

## Consequências

**A favor:**

- O sumário passa a se ler sozinho: `I.1 … I.6`, `II.1 … II.8`.
- Inserção futura custa a parte, não o livro.
- Os ids de exercício ficaram **imunes** a qualquer renumeração futura.
- O gating do companion passou a significar o que dizia.

**Contra, e assumido:**

- **29 endereços quebrados**, sem redirecionamento.
- **A ordem das trilhas continua saltando** — é inevitável com três disciplinas, e nenhuma numeração resolveria isso. O que muda é que agora o salto é entre partes (`II.2 → II.3 → III.1`), que se lê melhor do que `05 → 28 → 18`.
- **A numeração das etapas do `ml-zero` ficou órfã.** `etapa-05` servia o antigo capítulo 05; hoje serve o `II.2`. Está declarado como dívida imediata, e o conserto é o mesmo princípio: a pasta passa a ter nome, não número.
- Uma inserção **no meio de uma parte** ainda renumera os capítulos seguintes daquela parte, e quebra os endereços deles. O id do exercício, não.

## O que a migração ensinou, e virou gate

Quatro acoplamentos ao número só apareceram quando ele mudou:

1. **`dividirTitulo` exigia que o prefixo fosse só dígitos.** Com "II.2", ele devolvia vazio, o cabeçalho do capítulo não era montado — e junto com ele sumia o **selo de nível**, que a constituição manda mostrar ao leitor. **O gate do Princípio X pegou**, nas 29 páginas de uma vez. É a segunda vez que esse gate salva exatamente essa promessa.
2. **O grafo do livro** identificava nós por número e ligava capítulos por menção textual ("cap. 05"). Passou a identificar por slug e a ligar **por link** — mais fiel: referência que o autor linkou é dependência declarada; menção solta nem sempre.
3. **O gating de capacidades**, acima.
4. **Os testes do backend** citavam `05-e1` literal.

E um gate novo, que a migração provou faltar: **âncora `volte para` inexistente agora falha o build**. Duas estavam quebradas antes desta migração — uma delas no gesto que o Guia Editorial chama de "o mais útil do livro".
