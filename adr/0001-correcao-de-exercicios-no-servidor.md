# ADR 0001 — Correção de exercícios no servidor, não no cliente

**Data:** 2026-08-01 · **Estado:** aceito

## Contexto

O Princípio VIII exige que todo capítulo entregue exercícios com feedback explicativo. A pergunta de arquitetura é onde a resposta do leitor é avaliada: no JavaScript da página, ou numa chamada ao backend.

O livro é publicado como site estático no GitHub Pages, e o repositório é público — o gabarito está, de qualquer forma, a um clique de distância para quem quiser procurá-lo.

## Decisão

**A correção acontece no backend.** A página renderizada não contém gabarito, feedback nem rubrica; ela envia a resposta e recebe o veredito.

## Alternativas avaliadas

**A. Gabarito embutido no HTML, correção em JavaScript.** Funciona offline, não precisa de backend, publica em qualquer lugar. Perdeu porque impede as três capacidades abaixo — e porque deixa a resposta a um `Ctrl+U` do leitor exatamente no momento em que ele deveria estar pensando.

**B. Correção no servidor com autenticação de leitor.** Permitiria progresso entre dispositivos. Perdeu por violar o Princípio V: o livro não exige cadastro, e um formulário de login entre o leitor e o exercício é um custo pedagógico real.

**C. Híbrido — determinísticos no cliente, abertos no servidor.** Perdeu por inconsistência: dois caminhos de feedback, dois formatos de telemetria, e o leitor percebendo que alguns exercícios respondem diferente dos outros.

## Justificativa

Três capacidades que só existem no servidor:

1. **Feedback que depende do histórico.** O servidor sabe que esta é a segunda tentativa, e só então revela o gabarito. Um gabarito no HTML não consegue esperar.
2. **Avaliação por rubrica.** Respostas abertas são julgadas contra critérios escritos pelo autor — isso exige um modelo, e um modelo exige servidor.
3. **A telemetria que corrige o livro.** Qual exercício erra mais, e com que resposta, é o sinal mais valioso do projeto. Ele determina qual capítulo vai para a fila de revisão.

Sobre o gabarito estar no repositório: não estamos escondendo a resposta, e o texto diz isso ao leitor. Estamos evitando que ela esteja no caminho.

## Consequências

**Mais fácil:** feedback progressivo; avaliação de resposta aberta; medir a qualidade do próprio texto pela taxa de acerto.

**Mais difícil:** o livro passa a ter uma dependência de runtime. Um backend fora do ar degrada a experiência.

**Exige cuidado:** a degradação precisa ser **honesta e explícita** — sem backend, o exercício continua legível e diz que a correção está indisponível. Nunca finge ter corrigido, e nunca marca como certo o que não avaliou. O mesmo vale para a rubrica sem modelo: devolve avaliação vazia declarada, jamais uma nota inventada.

**Também exige:** limite de tentativas por sessão e IP, para que a rota de correção não vire superfície de abuso.
