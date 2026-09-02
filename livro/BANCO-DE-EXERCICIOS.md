# Banco de Exercícios — sintaxe, tipos e como a correção funciona

> Documento de **referência** (Diátaxis). O *porquê* está na constituição (Princípio VIII); o *como escrever bem* está no [Guia Editorial §4](GUIA-EDITORIAL.md). Aqui está a mecânica.

## Por que a correção mora no servidor

A página que você lê **não conhece a resposta certa**. Quando você clica em "Responder", a resposta viaja até o backend do livro, que corrige, explica e devolve o feedback.

Três razões, nesta ordem:

1. **Feedback melhor.** O servidor sabe quantas vezes você já tentou. Na primeira tentativa errada ele explica o conceito e devolve você à seção certa; só na segunda revela a resposta esperada. Um gabarito embutido no HTML não consegue esperar.
2. **A avaliação por rubrica só existe lá.** Respostas abertas são avaliadas contra critérios escritos pelo autor — isso exige um modelo, e um modelo exige um servidor.
3. **O erro é o sinal mais valioso deste projeto.** Saber qual exercício erra mais, e com que resposta, é o que corrige o livro. Exercício com taxa de acerto muito baixa é sintoma de texto mal escrito — e entra na fila de revisão (Guia §10).

O livro é aberto: quem quiser ver o gabarito acha no repositório. Não estamos escondendo — estamos evitando que a resposta esteja a um `Ctrl+U` de distância no momento em que você deveria estar pensando.

**Sem backend configurado**, o exercício continua legível e diz isso honestamente. O livro nunca finge ter corrigido.

## Onde os exercícios vivem

**Dentro do Markdown do capítulo**, junto do conteúdo que eles testam — não num arquivo separado. Isso garante que exercício e texto envelheçam juntos.

O motor faz dois recortes do mesmo bloco:

| Consumidor | O que recebe |
|---|---|
| `publicar/build.mjs` → a página | enunciado + alternativas, **sem** marcação de correta, **sem** feedback |
| `publicar/exercicios.mjs` → `banco.json` → o backend | tudo, inclusive gabarito, feedback e rubrica |

A fonte única da sintaxe é [`publicar/interativos.mjs`](../publicar/interativos.mjs).

## Sintaxe

Um bloco começa com `:::exercicio` seguido de atributos JSON e termina com `:::`.

```markdown
:::exercicio {"id":"avaliacao-e1","tipo":"multipla","objetivo":"O2","dificuldade":"media"}
Numa base de detecção de fraude com 0,3% de casos positivos, um modelo atinge
99,5% de acurácia. Qual leitura é correta?

- [ ] O modelo é excelente: erra menos de 1 em 200.
- [x] O número não diz nada: prever "não é fraude" sempre já daria 99,7%.
- [ ] A acurácia é inválida para problemas binários.

> **gabarito:** O número não diz nada
> **porque:** Com 0,3% de positivos, a classe majoritária sozinha entrega 99,7% de
> acurácia — o modelo com 99,5% está **abaixo** do classificador que não faz nada.
> Acurácia mede acertos totais e, quando uma classe domina, ela mede sobretudo a
> prevalência. Para esse caso, olhe precisão e revocação da classe rara.
> **volte para:** #os-cinco-tipos
:::
```

### Atributos

| Atributo | Obrigatório | O que é |
|---|---|---|
| `id` | sim | único no livro inteiro. Convenção: `NN-eK` (capítulo, exercício). Duplicata quebra o build. |
| `tipo` | sim | `multipla`, `multipla-multi`, `numerica`, `completar`, `aberta` |
| `objetivo` | sim | o `O1`/`O2`… declarado na seção Objetivos do capítulo. O build confere que existe. |
| `pontos` | não | peso (default 1) |
| `dificuldade` | não | `facil`, `media`, `dificil` (default `media`) |
| `versoes` | não | quando o gabarito depende de versão: `{"scikit-learn":"1.5"}` (Princípio IV) |

### Metadados do rodapé

Linhas de citação `> **chave:** valor`, aceitando continuação em múltiplas linhas.

| Chave | Quando | O que faz |
|---|---|---|
| `gabarito` | numérica, completar | a resposta esperada |
| `porque` | **sempre** | o feedback explicativo. Sem ele o build falha. |
| `volte para` | recomendado | âncora da seção que resolve a dúvida (`#slug-do-titulo`) |
| `rubrica` | aberta | critérios separados por `;` ou um por linha; mínimo 2 |

## Os cinco tipos

### `multipla` — escolha uma

Exatamente uma alternativa marcada com `[x]`. Mínimo duas alternativas.

### `multipla-multi` — escolha todas que valem

Uma ou mais corretas. Marcar um subconjunto das corretas (sem marcar nenhuma errada) conta como **parcial** — o leitor vê "◐ parcialmente" e é convidado a completar.

### `numerica` — responda com um número

O gabarito aceita tolerância explícita:

```markdown
> **gabarito:** 0.80 ± 0.01
```

Sem tolerância declarada, exige-se o valor exato. A resposta é lida de forma tolerante a formato: `0,80`, `0.80` e `80%` chegam ao mesmo lugar. Fora da tolerância mas dentro do dobro dela (ou de 10%, quando a tolerância é zero), o resultado é **parcial** — o leitor errou a conta, não o conceito.

### `completar` — complete a lacuna

*Completion problem* no sentido de Sweller: o andaime está posto, falta a peça. Alternativas aceitas separadas por `|`. A comparação ignora caixa, acentos e espaços extras.

```markdown
:::exercicio {"id":"otimizacao-e2","tipo":"completar","objetivo":"O3"}
Complete o termo que impede os pesos de crescerem sem limite:

`perda_total = perda_de_dados + λ · ______(w)`

> **gabarito:** regularização|regularizacao|penalidade
> **porque:** O segundo termo penaliza a complexidade do modelo...
:::
```

### `aberta` — responda com suas palavras

Avaliada pelo modelo **contra a rubrica escrita pelo autor** — nunca contra "o que o modelo acha que é uma boa resposta". O leitor recebe a lista de critérios com ✔ e ○, e um comentário curto.

```markdown
:::exercicio {"id":"fundamentos-e3","tipo":"aberta","objetivo":"O4","pontos":3}
Explique, para uma pessoa de produto, por que um modelo com 99% de acurácia
no teste pode falhar no primeiro mês em produção.

> **rubrica:** distingue distribuição de treino e de produção;
> menciona ao menos um mecanismo concreto (drift, vazamento, viés de seleção);
> não atribui a falha a "pouco dado" sem justificar;
> propõe uma forma de detectar o problema antes do usuário
> **porque:** O ponto central é que a métrica de teste só vale sob a hipótese de
> que produção se parece com o teste...
:::
```

Sem modelo configurado, a rota devolve uma avaliação honesta-vazia: diz que não avaliou, e lembra os critérios. **Nunca inventa uma nota.**

## Vídeos

```markdown
:::video {"id":"avaliacao-v1","fonte":"youtube","ref":"4jRBRDbJemM","min":16,"autor":"StatQuest","titulo":"ROC and AUC, clearly explained"}
Resolve a intuição **geométrica** da curva ROC — o texto trata do trade-off
algebricamente, e ver o limiar deslizando faz a moeda cair.
:::
```

| Atributo | Obrigatório | O que é |
|---|---|---|
| `id` | sim | único; convenção `NN-vK` |
| `fonte` | não | `youtube` (default) ou `vimeo` |
| `ref` | sim | o identificador do vídeo na fonte |
| `autor` | sim | crédito de quem produziu |
| `titulo` | não | título exibido (default: o `id`) |
| `min` | não | duração aproximada |

O corpo do bloco é a **justificativa obrigatória**: o que este vídeo resolve que o texto não resolve. Vídeo sem justificativa não compila.

O player é uma **fachada**: nada é pedido ao servidor de origem antes do clique do leitor.

## Laboratórios

A terceira superfície: exercício pergunta e corrige, vídeo mostra, **laboratório deixa manipular**.

```markdown
:::lab {"id":"neuronio-artificial-l1","tipo":"neuronio-mp","titulo":"Neurônio de McCulloch–Pitts","funcao":"AND"}
O que manipular aqui ensina — e o que o leitor deve **descobrir sozinho**.
:::
```

| Atributo | Obrigatório | O que é |
|---|---|---|
| `id` | sim | único no livro; convenção `NN-lK` |
| `tipo` | sim | qual widget carregar (ver tabela abaixo) |
| `titulo` | não | exibido no cabeçalho |
| *demais* | — | passados ao widget como configuração inicial |

O corpo do bloco é a **introdução obrigatória**. Laboratório sem ela não compila.

### Widgets disponíveis

| `tipo` | O que faz | Configuração |
|---|---|---|
| `neuronio-mp` | Neurônio de McCulloch–Pitts: pesos e limiar à mão, reta de decisão desenhada em tempo real sobre a tabela-verdade | `funcao`: `AND`, `OR`, `NAND`, `NOR`, `XOR` |

Novos widgets entram em `publicar/tema/laboratorios.js`, registrados no objeto `TIPOS` do fim do arquivo.

### Por que laboratório não precisa de backend

Não há resposta a esconder: o gabarito é o comportamento do objeto. Isso o torna a superfície **mais robusta** do livro — funciona offline, funciona sem servidor, e continua funcionando quando tudo o mais falha.

## Interações

A **quarta** superfície, e a única que revela **no cliente**. A distinção que a define, e que decide toda a arquitetura:

| | `:::exercicio` | `:::interacao` |
|---|---|---|
| Função | **somativa** — vale nota | **formativa** — não vale nada |
| Correção | no **backend**; o gabarito nunca vai ao cliente | **no cliente**, revelando |
| Registro | grava tentativa por aluno, e aprende do erro | não grava nada — nem servidor, nem `localStorage` |
| Quando o leitor erra | conta contra ele | **é o ponto** |

**É porque a interação não vale nota que ela pode revelar no cliente sem violar o Princípio VIII.3.** Aquele princípio protege o gabarito daquilo que é contabilizado; onde não há tentativa, placar nem telemetria, não existe segredo a guardar. E a escolha compra uma garantia: sem segredo não há chamada de rede, e a interação continua inteira com o backend fora do ar (Princípio VIII.6).

A premissa do autor é que **todo cartão tem uma interação e um exercício** — quem cobra isso é `publicar/gates/cartoes-legiveis.mjs`, que conta `.interacao` e `[data-interacao]` no DOM.

```markdown
:::interacao {"id":"modelos-lineares-i1","tipo":"prever","titulo":"O peso do ponto distante","numero":100}
Um ponto erra por **1**; o *outlier* erra por **10**. No critério absoluto o segundo pesa 10 vezes mais.

> **pergunta:** E no quadrático, quantas vezes?
> **revela:** **Cem vezes.** O erro decuplicou e o peso centuplicou.
:::
```

### Atributos

| Atributo | Obrigatório | O que é |
|---|---|---|
| `id` | sim | único no livro inteiro; convenção `<capitulo>-iK`. O build recusa duplicata |
| `tipo` | sim | `principio`, `desvanecido` ou `prever` |
| `titulo` | não | exibido no cabeçalho do bloco |
| `numero` | só `prever` numérico | o valor real, contra o qual a previsão é comparada |
| `tolerancia` | não | margem aceita em torno de `numero` (padrão 0) |

### Metadados do rodapé

| Chave | Quando | O que faz |
|---|---|---|
| `revela` | **sempre** | o que aparece depois do clique. Sem ele o build falha |
| `pergunta` | `principio` e `prever` | o que o leitor responde **antes** de revelar |

### Marcadores no corpo

| Marcador | Tipo | O que é |
|---|---|---|
| `- [?] rótulo => a linha certa` | `desvanecido` | um passo apagado da conta |
| `- ( ) texto` | `prever` | uma opção de previsão |
| `- (!) texto` | `prever` | a opção que é o que **de fato acontece** |

O marcador do passo **não é** `- [x]`, e por dois motivos: `[x]` significa "gabarito" nesta casa, e interação não tem gabarito; e o gate de vazamento do `build.mjs` recusa qualquer `- [x]` no Markdown exportado, que `semGabarito()` só limpa dentro de bloco de exercício.

### Os três tipos, e a evidência de cada um

Os números abaixo são resumo. A fonte, o selo e a fronteira de cada achado estão em [`BASE-EDUCACIONAL.md`](BASE-EDUCACIONAL.md), e quatro dos cinco ainda estão em ⏳.

| `tipo` | O gesto | Apoio |
|---|---|---|
| `principio` | exemplo trabalhado com pergunta de princípio. O leitor escreve, clica, e a explicação aparece **ao lado** da resposta dele — que não é corrigida, é comparada | autoexplicação provocada supera receber a explicação pronta (g=0,35; Bisra *et al.*, 2018) |
| `desvanecido` | passo apagado da conta. Ao conferir, as linhas certas aparecem e as dele ficam ao lado. Sem nota, sem "errado" | desvanecimento somado a prompt de princípio rende em transferência próxima e distante (Atkinson, Renkl & Merrill, 2003) |
| `prever` | pergunta com 2 ou 3 opções, ou campo numérico, que **tem de ser respondida** antes de o botão liberar. A revelação repete a previsão dele e diz se bateu | resolver antes de explicar rende (g=0,36; Sinha & Kapur, 2021), **desde que a explicação construa sobre o que o leitor tentou** — g=0,56 contra 0,20 quando ignora |

A última coluna é a razão de a revelação do `prever` começar pela previsão do leitor, e não pela resposta.

### Acessibilidade, e uma armadilha

O botão de revelar **não** nasce `disabled` nem `aria-disabled` enquanto falta responder. As duas coisas o tiram da tabulação ou o anunciam como indisponível — e aí o motivo de ele não liberar, que mora no `role="status"` ao lado, deixa de ser alcançável por quem lê a tela. (Medido: o Playwright recusa clicar num `aria-disabled`, aplicando a mesma regra que a tecnologia assistiva.) O sinal de "ainda não" é `data-pronto`, que pinta e não bloqueia; quem bloqueia é o clique, que escreve o porquê. A revelação entra num `aria-live="polite"` que já existe vazio no DOM, porque região viva criada na hora não anuncia de forma confiável.

O código: `publicar/tema/interacoes.js` (comportamento) e `publicar/testes/interacoes.mjs` (o que ele promete). DOM falso não tem foco nem tabulação, e foi por aí que o `aria-disabled` passou. Por isso a **asserção F** de `publicar/jornada.mjs` refaz o gesto num Chromium de verdade: clica em revelar sem responder nada e exige que nada tenha sido revelado e que a página tenha dito por quê.

## Progresso do leitor

- Identidade **anônima**, gerada pelo navegador — a mesma do chat. Sem cadastro, sem email.
- Espelhada em `localStorage`, para a barra de progresso funcionar mesmo offline.
- `GET /progresso?session_id=…` devolve o que aquela sessão resolveu.
- `DELETE /session/{id}` apaga tudo — conversas, tentativas e vídeos. Direito ao esquecimento, sem pedido, sem formulário.

## Gate de qualidade

```bash
cd publicar
node exercicios.mjs --verificar   # valida sem escrever nada (é o gate da CI)
node exercicios.mjs               # gera chat-companion/backend/banco.json
```

O gate falha quando:

- falta `id`, `tipo`, `objetivo`, enunciado ou `porque`;
- o `objetivo` não existe entre os declarados no capítulo;
- múltipla escolha não tem exatamente uma correta;
- numérica tem gabarito ilegível;
- aberta tem menos de 2 critérios;
- há `id` de exercício ou de vídeo duplicado;
- vídeo sem `ref`, sem `autor` ou sem justificativa.

Nenhum desses é aviso. Todos são erro de build — porque um exercício quebrado é pior que exercício nenhum.
