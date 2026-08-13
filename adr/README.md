# Architecture Decision Records

Toda decisão relevante deste projeto — de arquitetura, de processo ou editorial — vira um registro aqui.

O formato responde a cinco perguntas, nesta ordem:

1. **Contexto** — que situação forçou a decisão
2. **Decisão** — o que se decidiu, em uma frase
3. **Alternativas avaliadas** — o que mais estava na mesa, e por que perdeu
4. **Justificativa** — por que esta ganhou
5. **Consequências** — o que fica mais fácil, o que fica mais difícil, e o que passa a exigir cuidado

A quinta é a que distingue um ADR de um anúncio. Uma decisão sem custo declarado provavelmente não foi uma decisão.

## Registros

| # | Título | Data | Estado |
|---|---|---|---|
| [0001](0001-correcao-de-exercicios-no-servidor.md) | Correção de exercícios no servidor, não no cliente | 2026-08-01 | aceito |
| [0002](0002-sintaxe-interativa-no-markdown.md) | Exercícios e vídeos dentro do Markdown do capítulo | 2026-08-01 | aceito |
| [0003](0003-dado-sintetico-na-etapa-00.md) | Dado sintético na etapa 00 da trilha prática | 2026-08-01 | aceito |
| [0004](0004-escopo-da-primeira-versao.md) | O que é a "1ª versão" do livro, e como chegar lá | 2026-08-10 | aceito |
| [0005](0005-selo-de-resumo-lido.md) | O selo `✓ᵃ`, e a trava contra selos cunhados por fora | 2026-08-10 | aceito |
| [0006](0006-publicacao-vercel-railway-dominio.md) | Publicação: front na Vercel, backend na Railway, domínio próprio | 2026-08-10 | aceito |
| [0007](0007-builder-declarado-na-railway.md) | O build do backend é declarado (Dockerfile), não detectado | 2026-08-11 | aceito |
| [0008](0008-identificacao-por-turma.md) | Identificação por turma: exceção estreita ao progresso anônimo | 2026-08-11 | aceito |
| [0009](0009-separar-linear-e-logistica.md) | Separar regressão linear e logística em dois capítulos | 2026-08-11 | aceito (numeração superada pelo 0011) |
| [0010](0010-pandas-na-etapa-de-exploracao.md) | pandas e matplotlib na etapa de exploração (e só nela) | 2026-08-12 | aceito |
| [0011](0011-numeracao-por-parte.md) | Numeração por parte, e o id do exercício desatado do número | 2026-08-12 | aceito |
| [0012](0012-verificacao-como-superficie-corrigida.md) | A Verificação vira superfície corrigida, uma pergunta por capítulo | 2026-08-12 | aceito (faseado) |
| [0013](0013-voz-do-livro-e-o-humanizer.md) | A `humanizer` entra como editora de concisão; §14 recusada | 2026-08-13 | aceito |
| [0014](0014-tres-exercicios-por-objetivo-e-a-prova.md) | "Tópico" é o objetivo; a prova é por parte e determinística | 2026-08-13 | aceito |
| [0015](0015-animacao-e-laboratorio-sem-manopla.md) | A animação não é quarta superfície: é laboratório sem manopla | 2026-08-13 | aceito |

> Esta tabela ficou parada no 0003 por oito registros. Índice que não acompanha
> é pior do que índice nenhum: quem chega procura aqui, não encontra o 0008, e
> decide de novo o que já estava decidido.
