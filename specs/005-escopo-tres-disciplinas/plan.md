# Plan 005 — Novo escopo

**Spec:** [spec.md](spec.md) · **Raia:** plena · **Data:** 2026-08-08

## Constitution Check (portão)

| Princípio | Como cumpre | Risco |
|---|---|---|
| **I — Evidência** | McCulloch & Pitts (1943) conferido na fonte e ✓. O capítulo III.1 não faz afirmação empírica sem fonte; a história é narrada com datas verificáveis. | Narrar história de memória. Mitigado: a referência central foi conferida; as demais entram ⏳ e **não sustentam afirmação**. |
| **II — Experimento executável** | O laboratório **é** o experimento: o leitor executa e verifica. | — |
| **III — Método pedagógico** | O laboratório vem **antes** da explicação (descoberta primeiro, nome depois) — carga cognitiva aplicada ao desenho da página, não só ao texto. | — |
| **IV — Livro vivo** | Nível declarado no cabeçalho; edição 0.5 no HISTORICO com o modelo de IA. | — |
| **V — Segurança e dados** | Laboratório roda no cliente; nada é enviado. | — |
| **VI — Acessibilidade** | Canvas puro, sem dependência, sem rede. Funciona offline. | — |
| **VII — Spec-driven** | Este ciclo. A emenda constitucional é a exceção prevista (meta-nível). | — |
| **VIII — Interatividade** | Emendado: laboratório vira terceira superfície e conta como mídia. | **Risco real**: níveis de maturidade podem virar desculpa para nunca aprofundar. Mitigado: o nível é visível ao leitor **e** cobrado no roadmap (C5). |
| **IX — DoD** | Build verde (40 páginas), 111 testes, saídas coladas. | — |

**Veredito:** aprovado, com a mitigação do Princípio VIII registrada.

## Decisões de arquitetura

**Laboratório roda no cliente, por natureza.** Exercício precisa de backend porque há gabarito a esconder. Laboratório não tem gabarito — o gabarito é o comportamento do objeto. A consequência é a propriedade mais valiosa dele: **funciona quando tudo o mais falha**.

**Registro de widgets por tipo.** `publicar/tema/laboratorios.js` mantém um objeto `TIPOS` mapeando nome → construtor. Adicionar um laboratório é adicionar uma função; o Markdown já sabe invocá-la.

**A config inteira vai no `data-cfg`.** O motor não interpreta os atributos do bloco — só os repassa. Quem sabe o que `funcao: "AND"` significa é o widget. Isso evita que o motor precise mudar a cada laboratório novo.

**Redesenha ao trocar o tema.** O canvas não herda CSS; um `MutationObserver` no `data-tema` redesenha. Sem isso, o laboratório ficaria com as cores do tema anterior — bug pequeno e muito visível.

## Fases

1. Runtime dos laboratórios e o widget do neurônio.
2. Bloco `:::lab` no parser, no build e no extrator.
3. Capítulo III.1 com o laboratório antes da explicação.
4. Nova estrutura: título, partes, 9 esqueletos novos.
5. Trilhas por disciplina, mapeadas às ementas.
6. Emenda constitucional 1.1.0 e Guia Editorial.
7. Roadmap reescrito pela prioridade das disciplinas.
