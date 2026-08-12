# Spec 005 — Novo escopo: três disciplinas, trilhas e laboratórios

**Branch:** `005-escopo-tres-disciplinas` · **Raia:** plena · **Data:** 2026-08-08

## O quê

Reescopar o livro para servir a três disciplinas reais de Engenharia de Software, criar as trilhas por disciplina, e introduzir os **laboratórios interativos** como terceira superfície.

## Por quê

O autor ministra **Análise Preditiva** e **Aprendizagem de Máquina**; os alunos chegam com **Ciência de Dados** cursada. O livro atendia parcialmente a uma dessas ementas e nenhuma inteiramente.

Há também um achado de sala de aula que muda o desenho: numa aula sobre McCulloch–Pitts, os alunos descobriram os pesos **à mão**. O gesto ensina o que a exposição não ensina — e pede um objeto manipulável, não um parágrafo.

## Requisitos

- **R1** Estrutura cobrindo as três ementas, sem duplicar conteúdo entre disciplinas.
- **R2** Ordem de leitura por disciplina, permitindo que um capítulo sirva a duas com pesos diferentes.
- **R3** Níveis de maturidade declarados, para cobrir o programa sem baixar o rigor em silêncio.
- **R4** Laboratório interativo como bloco de primeira classe, rodando **sem backend**.
- **R5** Primeiro laboratório: neurônio de McCulloch–Pitts, com o XOR como descoberta.
- **R6** Capítulo III.1 escrito ao nível `essencial`, com história, exercícios e o laboratório.

## Critérios de aceite

| # | Critério | Verificação |
|---|---|---|
| A1 | Build verde com a nova estrutura | `npm run build` |
| A2 | Toda unidade das três ementas mapeada a ao menos um capítulo | inspeção das trilhas |
| A3 | O laboratório funciona com `companion_backend` vazio | roda no navegador, sem `fetch` |
| A4 | Bloco `:::lab` sem introdução **falha o build** | gate do banco |
| A5 | Nível do capítulo declarado no cabeçalho quando ≠ `completo` | inspeção |
| A6 | McCulloch & Pitts (1943) conferido e ✓ | bibliografia |

## Decisões de escopo

**O título muda; o repositório não.** `machinelearning` permanece — a URL publicada é estável e o custo de trocá-la excede o ganho.

**Os números dos capítulos não são renumerados.** Renumerar quebraria os ids dos 31 exercícios (que embutem o número do capítulo) e as âncoras já publicadas. O número vira **identificador estável** e a ordem vive nas trilhas — o que o autor pediu explicitamente ("não precisa ser linear").

**IA fica fora, com uma exceção.** O autor observa que Inteligência Artificial é outra disciplina. O capítulo IV.3 cobre o que a ementa de Aprendizagem de Máquina exige (simbólico, fuzzy, genéticos, bayesianas); uma Parte VI dedicada fica registrada como possibilidade.

## Fora de escopo

- Escrever os 20 capítulos-esqueleto — é o ciclo C1/C2 do roadmap.
- Os demais laboratórios da fila (C3).
- Publicar o backend.
