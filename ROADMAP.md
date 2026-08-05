# Roadmap

> O lugar único que responde: **o que vem agora, em que ordem, e por quê.**
>
> Olha para frente. Para o que já aconteceu, veja [`CHANGELOG.md`](CHANGELOG.md) (mudanças) e [`livro/HISTORICO.md`](livro/HISTORICO.md) (edições do livro e placar de expiração).

## Como ler este documento

Cada item aqui **vira uma spec** antes de virar trabalho (Princípio VII). O roadmap diz a ordem e a justificativa; a spec diz o escopo e os critérios de aceite. Um item sem spec é uma intenção, não um compromisso.

A ordem não é arbitrária — segue dois critérios, nesta prioridade:

1. **Destravar o que já está construído.** Maquinaria pronta e ociosa é desperdício maior que funcionalidade ausente.
2. **Cobrir primeiro os modos de falha caros.** Em Machine Learning, o que quebra projetos reais é dado e avaliação, não escolha de arquitetura.

## Estado atual — edição 0.1 (2026-08-01)

| | |
|---|---|
| Capítulos escritos | **3** de 18 — `00`, `01`, `04` (piloto) |
| Capítulos em esqueleto | 15 — com objetivos e problema definidos |
| Exercícios | 11 · **Vídeos** 3 · **Etapas do `ml-zero`** 1 de 17 |
| Site | 🟢 no ar em https://ghdaru.github.io/machinelearning/ |
| Backend | 🔴 **não publicado** — a interatividade está dormente |

---

## Agora

### R1 — Publicar o backend do livro vivo 🔴 **maior alavanca do projeto**

Sem ele, o livro é um PDF navegável bonito. Com ele, é o que a constituição promete: exercícios corrigidos, feedback que explica, progresso, tutor e a telemetria que corrige o próprio texto.

Tudo já está construído e testado — 23 testes verdes, sobe sem chave e sem banco. Falta **só publicar** e apontar `companion_backend` em `publicar/sumario.json`.

- **Raia:** infra (gates de reversibilidade)
- **Entrega:** URL no ar, `GET /health` respondendo, um exercício corrigido de ponta a ponta na produção
- **Cuidado:** é a primeira vez que o projeto tem estado persistente de leitor. Backup e plano de rollback antes, não durante.

### R2 — Capítulo 02: Dados

O primeiro capítulo de conteúdo, e não por acaso: **vazamento de dados é o erro mais caro e mais silencioso de Machine Learning**. Ele não dá erro, não aparece em log, passa por revisão de código, e o sintoma é uma métrica boa demais que ninguém questiona porque a notícia é boa.

Destrava também a **etapa 02** do `ml-zero`, que é onde a trilha sai do dado sintético e encontra as patologias do dado real — a limitação que o [ADR 0003](adr/0003-dado-sintetico-na-etapa-00.md) declarou de propósito.

- **Depende de:** nada (00, 01 e 04 já dão a base)
- **Entrega:** capítulo no esqueleto v4, ≥3 exercícios, ≥1 vídeo, etapa 02 da trilha, referências ⏳ → ✓

---

## Próximo

### R3 — Capítulo 07: Árvores e Ensembles

A maioria dos problemas reais de ML em empresas é tabular, e a resposta padrão continua sendo gradient boosting. O capítulo trata isso como **afirmação empírica** — com experimento reproduzível e citação verificada, não como folclore de competição.

Escolhido antes de 05/06 deliberadamente: entrega valor prático imediato a quem lê o livro para trabalhar, e a base teórica pode vir depois sem prejuízo.

### R4 — Capítulos 05 e 06: Modelos Lineares e Otimização

Podem ser uma spec só — são o mesmo assunto visto de dois ângulos, e separá-los duplicaria a pesquisa. É a base que torna o capítulo 09 (redes neurais) legível: quem não viu gradiente e regularização no caso limpo não entende o caso confuso.

### R5 — Capítulo 16: MLOps

Fecha o ciclo do `ml-zero`: o modelo vira serviço com contrato, telemetria e detecção de *drift*. É o capítulo que separa "treinei um modelo" de "opero um sistema que aprende" — e o que dá sentido retroativo à regra 5 da construção ("serviço desde cedo").

---

## Depois

Sem ordem fixa entre si; cada um entra quando houver razão para entrar.

| Capítulo | Por que ainda não |
|---|---|
| 03 — Representação | Depende de 02 para os exemplos valerem |
| 09 — Redes Neurais | Precisa de 05/06 para não virar mágica |
| 08 — Não Supervisionado | Independente; entra quando houver demanda |
| 10, 11, 12 — Visão, Sequências, Fundação | Cadeia própria, dependente de 09 |
| 14 — Interpretabilidade e Justiça | Ganha muito se vier depois de 07 (explicar ensemble é o caso real) |
| 15 — Sistemas de ML | Naturalmente após 16 |
| 13 — Reforço | Enxuto por decisão editorial; baixa prioridade |
| 17 — Fronteira | **Último por natureza** — só faz sentido com o placar de expiração tendo o que pontuar |

## Dívidas registradas

Coisas que sabemos dever. Ficam aqui para não virarem descoberta arqueológica.

| # | Dívida | Origem |
|---|---|---|
| D1 | Índice da [videoteca](livro/videoteca.md) é mantido à mão; deveria ser gerado do `banco.json` | declarado na própria página |
| D2 | Bibliografia tem 5 ✓ e o resto ⏳ | por design — cada ⏳ vira ✓ junto com a spec do capítulo que o usa |
| D3 | Sem exercícios de código executável | [spec 001](specs/001-fundacao-livro-ml-interativo/spec.md) — exige sandbox; hoje são *completion problems* |
| D4 | Nenhum capítulo tem PDF | o motor perdeu o `pdf.mjs` na adaptação; volta se houver demanda |
| D5 | Sem tradução para inglês | fora de escopo da fundação |

## O que este projeto **não** vai fazer

Não-objetivos são tão úteis quanto objetivos, e mais raramente escritos.

- **Não será um curso com certificado.** Sem cadastro, sem nota, sem trilha obrigatória. O progresso é do leitor e apagável (Princípio V).
- **Não vai executar código do leitor no servidor.** A construção livre vive na máquina dele, no `ml-zero`.
- **Não vai perseguir o modelo da moda.** O capítulo 12 trata do que é estrutural; o resto expira e o placar registra.
- **Não vai crescer por volume.** Capítulo sem exercício e sem vídeo não é publicável — é melhor ter 6 capítulos íntegros que 18 pela metade.

## O portão de publicação de um capítulo

Um capítulo sai de "esqueleto" para "escrito" quando cumpre **tudo** isto:

- [ ] Esqueleto v4 completo ([Guia Editorial §2](livro/GUIA-EDITORIAL.md))
- [ ] ≥3 exercícios e ≥1 vídeo, cada exercício rastreando a um objetivo declarado
- [ ] Toda afirmação empírica com experimento reproduzível ou citação ✓ — nada apoiado em ⏳
- [ ] Etapa correspondente do `ml-zero` rodando e testada
- [ ] Selo de captura + entrada no `HISTORICO.md` com a versão do modelo de IA
- [ ] Cláusula de expiração declarada e registrada no placar
- [ ] Revisão developmental feita

Sem os sete, é esqueleto — e o snapshot do `HISTORICO.md` diz isso ao leitor.

## Cadência

- **Janela trimestral** (próxima: **2026-11**): reconferir vídeos, reexecutar experimentos nas versões correntes, atualizar o placar de expiração.
- **Gatilho por telemetria**: exercício com taxa de acerto baixa e volume relevante entra na fila de revisão — o sintoma é texto mal escrito, não leitor fraco.
- **Gatilho extraordinário**: evento que invalide uma "Síntese — o que levar" dispara revisão do capítulo afetado, sem esperar a janela.

---

*Este roadmap é uma intenção datada, não um contrato. A ordem muda quando a realidade der motivo — e a mudança fica registrada no `CHANGELOG.md`.*
