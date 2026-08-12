# Roadmap

> O lugar único que responde: **o que vem agora, em que ordem, e por quê.**
>
> Reescrito em **2026-08-08**, quando o projeto mudou de escopo: de um livro de Machine Learning para o livro de **três disciplinas reais** — Ciência de Dados, Análise Preditiva e Aprendizagem de Máquina.

## O que mudou, e por quê

O livro passou a servir a duas disciplinas **em curso**, ministradas pelo autor:

| Disciplina | Papel no livro | Recorte |
|---|---|---|
| **Ciência de Dados** | pré-requisito, dado por outro professor | os alunos chegam com preparação de dados na bagagem |
| **Análise Preditiva** | ministrada pelo autor | vai da transformação de dados até modelos preditivos |
| **Aprendizagem de Máquina** | ministrada pelo autor | vai **direto para deep learning**; o clássico é revisão |

Isso impõe três mudanças de prioridade:

1. **Cobertura antes de profundidade.** Uma disciplina em andamento precisa de material em todos os tópicos, não de sete capítulos perfeitos e vinte ausentes. A constituição foi emendada (1.1.0) para permitir isso **sem baixar o rigor em silêncio**: cada capítulo declara seu nível — `esqueleto`, `essencial` ou `completo` — no próprio cabeçalho.
2. **A ordem é a da disciplina, não a do sumário.** A numeração é por **parte e posição** (`II.2`, ver [ADR 0011](adr/0011-numeracao-por-parte.md)); a ordem de leitura de cada disciplina vive nas [trilhas](livro/trilhas/analise-preditiva.md). Um mesmo capítulo serve a duas disciplinas com pesos diferentes, e capítulos distantes no sumário são vizinhos numa trilha.
3. **Laboratórios interativos passam a ser primeira classe.** O gesto de pôr os pesos à mão e ver a reta se mover ensina o que nenhuma frase ensina. É a linha de evolução mais promissora do livro.

## Estado atual — **edição 1.0 (2026-08-10)**

| | |
|---|---|
| Capítulos | **28** · todos no nível `essencial` · nenhum em `completo` |
| Interatividade | **91 exercícios** · 7 vídeos · 1 laboratório |
| Seções "De onde isto veio" | **26 de 26** capítulos de método, com tabela de selos |
| Trilhas de disciplina | 3 |
| `ml-zero` | 5 etapas · 88 testes · Backend: 28 testes |
| Site | 🟢 https://machinelearning.ghdaru.com.br/ |
| Backend | 🟢 https://api.machinelearning.ghdaru.com.br — **os 91 exercícios corrigem de verdade** |

**Ciclos concluídos:** C1 (trilha de Análise Preditiva), C2 (trilha de Aprendizagem de Máquina), C7 (o capítulo 27 cobre a Unidade 02) e C8 (pesquisa histórica + retrofit). **Dívidas D6, D8 e D9 pagas.**

---

## Agora

### C5 — Aprofundamento: `essencial → completo` ⬅ **prioridade máxima**

É o único caminho que resta para o livro melhorar, e ele **paga a dívida D10**: hoje muita fonte está selada `✓ᵐ` — conferimos que a obra existe, não que a lemos.

A ordem é a das **filas de verificação** nas cinco notas de pesquisa em `estudos/`, que já estão ordenadas por **dúvida fechada por unidade de esforço**. Os primeiros itens são baratos e fecham muito: o guia CRISP-DM 1.0 (fecha o cap. 19 inteiro numa leitura), Stigler 1981 (fecha o fio Gauss×Legendre), Loog *et al.* 2020 (2 páginas, arXiv aberto), Kaufman *et al.* 2012 e Gebru *et al.* 2018.

Promover a `completo` exige, além disso: experimento próprio no `ml-zero`, cláusula de expiração e revisão developmental.

### ~~C4 — Publicar o backend~~ — **CONCLUÍDO em 2026-08-11**

> Neon (São Paulo) + Railway + Vercel + domínio próprio, nos passos 1–7 do [`DEPLOY.md`](chat-companion/DEPLOY.md). Os **91 exercícios corrigem no servidor**, com revelação progressiva, verificada de ponta a ponta pelo domínio novo. Duas correções nasceram do próprio deploy: o [ADR 0007](adr/0007-builder-declarado-na-railway.md) (build declarado em vez de detectado) e o `og:image`, que apontava para o endereço prestes a ser aposentado.
>
> **Falta o passo 8** — aposentar o `ghdaru.github.io` trocando-o pelo stub de redirecionamento, e então remover essa origem de `ALLOWED_ORIGINS` no Railway. Deixado por último de propósito: é o único passo irreversível para quem tem link antigo.

### C3 — Mais laboratórios interativos

O laboratório do capítulo 18 provou o formato: o estudante trava em 3 de 4 no XOR e **descobre** a impossibilidade. A linha de evolução, em ordem de valor didático:

| Laboratório | Capítulo | O que o leitor descobre manipulando |
|---|---|---|
| **Perceptron que aprende** | 18 | a regra de Rosenblatt ajustando os pesos sozinha, passo a passo — depois de ele ter feito à mão |
| **XOR com camada escondida** | 09 | duas retas combinadas resolvem o que uma não resolvia |
| **Gradiente descendente** | 06 | taxa alta quica, taxa baixa arrasta — vendo a bolinha descer |
| **Fronteira de decisão** | 05/07 | reta × árvore × floresta no mesmo conjunto de pontos, desenhado por ele |
| **Matriz de confusão e limiar** | 04 | precisão e revocação trocando de lugar ao arrastar o limiar |
| **Viés × variância** | 01 | grau do polinômio subindo, treino melhorando e validação piorando |
| **k-means passo a passo** | 08 | centróides se movendo, e a dependência da inicialização |

Cada um roda no navegador, sem backend. Isso os torna a superfície **mais robusta** do livro.

---

## Depois

### C6 — Etapas do `ml-zero` que faltam

Prioridade para as que servem às trilhas: **09** (rede em NumPy), **26** (treino profundo), **21** (EDA), **24** (séries temporais).

### C7 — Parte de Inteligência Artificial *(parcialmente concluído)*

O autor observa que **IA é outra disciplina**. O capítulo 27 cobre o que a ementa de Aprendizagem de Máquina exige (simbólico, fuzzy, genéticos, bayesianas). Uma Parte VI dedicada — busca, planejamento, agentes, representação de conhecimento — fica registrada como possibilidade, não como compromisso.

### ~~C8 — Sessão de pesquisa histórica e retrofit~~ — **CONCLUÍDO em 2026-08-10**

> Cinco passadas de pesquisa em `estudos/`, retrofit nos 8 capítulos com corpo, e os níveis declarados. O registro do que a sessão única produziu — e do que a auditoria adversarial derrubou depois — está na [edição 1.0](livro/HISTORICO.md).

Criado pela emenda **1.2.0** da constituição. **Uma sessão de pesquisa, não uma por capítulo** — a regra do próprio princípio: as histórias se conectam (McCulloch–Pitts → Rosenblatt → Minsky → backpropagation; Gauss/Legendre → mínimos quadrados → regressão; Tukey → EDA → visualização), e quem pesquisa capítulo a capítulo publica os dois lados sem a ligação.

Produtos, nesta ordem:

1. **Nota de pesquisa** em `estudos/`, cobrindo os métodos dos capítulos com corpo, e terminando com a **fila de verificação** — as fontes ordenadas por quanta dúvida cada uma fecha por unidade de esforço.
2. **Retrofit** da seção "De onde isto veio" nos 8 capítulos com corpo (dívida **D8**), cada afirmação com selo ✓ / ✓ᵐ / ⏳ / ❌ / 📖.
3. **Declaração de nível** nos 20 capítulos que não a têm (dívida **D9**) — mesma passada, mesmo cabeçalho.

O capítulo **18** é o piloto: já tem linha do tempo com DOIs, mas ela está organizada como cronologia, não como "o aperto → o que se fazia antes → a virada → **a ideia reaproveitável** → o nome". Falta-lhe justamente o quarto elemento, e os selos precisam baixar de ✓ para **✓ᵐ** onde só o DOI foi conferido — o caso do neocognitron mostrou por quê.

## Dívidas registradas

| # | Dívida | Origem |
|---|---|---|
| D1 | Índice da [videoteca](livro/videoteca.md) mantido à mão | declarado na própria página |
| D2 | Bibliografia com maioria ⏳ | por design — cada ⏳ vira ✓ no ciclo de aprofundamento |
| D3 | Sem exercícios de código executável | exige sandbox; hoje são *completion problems* e laboratórios |
| D4 | Nenhum capítulo tem PDF | o motor perdeu o `pdf.mjs` na adaptação |
| D5 | Sem tradução para inglês | fora de escopo |
| ~~**D6**~~ | ~~Capítulo 16 sem vídeo verificável~~ — **resolvida**: no nível `essencial` não há cota de mídia, e nenhum vídeo foi inventado para preencher | Princípio VIII: o portão de mídia vale na promoção a `completo` |
| ~~**D7**~~ | ~~Numeração fora de ordem no sumário~~ — **PAGA** em 2026-08-12: numeração por parte ([ADR 0011](adr/0011-numeracao-por-parte.md)). As 29 posições estavam fora de ordem, não algumas | o id do exercício foi desatado do número, então renumerar deixou de ameaçar o progresso do leitor |
| ~~**D8**~~ | ~~Nenhum capítulo tem "De onde isto veio"~~ — **PAGA**: os 26 capítulos de método têm a seção e a tabela de selos, cobradas pelo build | a emenda 1.2.0 era posterior a eles; nível não subiu sem pagar |
| ~~**D9**~~ | ~~20 capítulos não declaram nível~~ — **PAGA** em 2026-08-10: os 18 que faltavam declararam nível, e o build agora **falha** sem a declaração | o Princípio "níveis" exige a declaração ao leitor |

| **D10** | **Selo ✓ᵐ sustentando afirmação sobre o que a obra argumenta por dentro**, em vários capítulos — quando ✓ᵐ só prova que a obra existe | achado da [auditoria adversarial](estudos/2026-08-10-auditoria-adversarial.md). Paga-se **lendo as fontes** no ciclo `essencial → completo`, não com hedge no texto. A fila de verificação da nota de pesquisa é o plano de pagamento |

| **D11** | **20 objetivos sem exercício próprio**, em 20 capítulos — não 2, como esta linha declarou até 2026-08-12 | achado pela auditoria de Bloom. O gate do `exercicios.mjs` agora **cobra**: órfão novo quebra o build, e a lista de exceções tem de encolher quando a dívida é paga |
| **D13** | **15 objetivos de nível Criar cobrados abaixo do nível** — só 1 dos 15 tem exercício que pede produção; 4 não têm evidência alguma no livro | achado da auditoria de Bloom. Ou o exercício sobe, ou o verbo desce — e as duas coisas são trabalho de conteúdo, não de gate |

> **O que o gate ensinou, e que o plano não previa.** O ADR 0004 mandava fazer o lote 1 (capítulos novos) antes do lote 2 (retrofit dos antigos). Assim que o gate entrou no build, ele **inverteu a ordem sozinho**: declarar o nível dos 7 capítulos com corpo tornou o build vermelho na hora, e nenhum trabalho novo podia ser publicado antes de a dívida antiga ser paga.
>
> Isso é o gate funcionando como projetado — e é a diferença entre uma dívida *registrada* e uma dívida *cobrada*. Uma fica no roadmap; a outra impede o próximo commit.

| **D12** | **A numeração das etapas do `ml-zero` ficou órfã** — `etapa-05` serve o capítulo `II.2` | consequência do ADR 0011; o conserto é o mesmo princípio: a pasta passa a ter nome, não número |

## O que este projeto **não** vai fazer

- **Não será um curso com certificado.** Sem cadastro, sem nota, sem trilha obrigatória.
- **Não vai executar código do leitor no servidor.** Laboratórios rodam no navegador; a construção livre vive no `ml-zero`, na máquina dele.
- **Não vai perseguir o modelo da moda.**
- **Não vai fingir profundidade.** Um capítulo `essencial` diz que é `essencial`, em destaque, no cabeçalho.

## O portão de publicação (nível `completo`)

- [ ] Esqueleto v5 completo (inclui "De onde isto veio" com selos)
- [ ] ≥3 exercícios e ≥1 mídia (vídeo **ou** laboratório), cada exercício rastreando a um objetivo
- [ ] Toda afirmação empírica com experimento reproduzível ou citação ✓
- [ ] Etapa correspondente do `ml-zero` rodando e testada
- [ ] Selo de captura + entrada no `HISTORICO.md` com a versão do modelo de IA
- [ ] Cláusula de expiração declarada e registrada no placar
- [ ] Revisão developmental feita

Para o nível `essencial`, o portão é menor e está no [Guia Editorial §2.2](livro/GUIA-EDITORIAL.md#22-niveis-de-maturidade).

---

*Este roadmap é uma intenção datada, não um contrato. A ordem muda quando a realidade der motivo — e a mudança fica registrada no `CHANGELOG.md`.*
