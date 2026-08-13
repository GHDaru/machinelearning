# ADR 0018 — O TensorFlow Playground entra no III.2, vendorizado e com roteiro

- **Status:** aceito
- **Data:** 2026-08-13
- **Raia:** plena (código de terceiro entrando no site publicado)

## Contexto

O capítulo III.2 (Redes Multicamadas) tem uma animação própria, `anima-mlp-xor`, que
mostra o MLP resolvendo o XOR com as duas retas girando e o botão da inicialização
ruim. Ela cobre o O1 e parte do O4.

O que ela **não** cobre está na seção "Quantas camadas e quantas unidades — a decisão
é empírica", que é hoje a única seção do capítulo com tese forte e **nenhum objeto
para o leitor operar**. Ela afirma que redes mais profundas resolvem com menos
unidades por camada, que hiperparâmetro se escolhe sob validação, e que existência
não é treinabilidade. Três afirmações que o leitor recebe de palavra.

O [TensorFlow Playground](https://github.com/tensorflow/playground) é a ferramenta
consagrada para essa faixa exata. A pergunta era como usá-lo.

## Decisão

**Vendorizar o build no repositório**, servido pelo nosso próprio site, com o
`analytics.js` removido, as fontes locais, e um **roteiro de previsão-antes-de-mexer**
ao lado. Sem o roteiro, não entra.

## Alternativas avaliadas

### A. `iframe` para `playground.tensorflow.org` — recusada

Recusada por **dois princípios da constituição**, não por gosto:

- **Princípio V (privacidade).** O domínio serve `analytics.js` com Google Analytics
  hoje. Um iframe injeta rastreamento de terceiro que o leitor não pode apagar e nós
  não controlamos. O livro já reconhece esse risco em outro lugar: os vídeos usam
  `youtube-nocookie` e só criam o iframe depois de um clique. Para o Playground não
  existe equivalente `nocookie`.
- **Princípio VIII.6.** "Laboratórios funcionam mesmo com o backend fora do ar." Um
  iframe remoto quebra quando o domínio de terceiro cai ou muda de endereço.

Há ainda o argumento de dependência: o upstream está **parado desde junho de 2022**,
com uma centena de issues sem triagem. O `analytics.js` que ele publica aponta para o
Universal Analytics, que o Google desligou em julho de 2023 — o pacote carrega um
rastreador morto há três anos e ninguém removeu. Isso **inverte** a intuição sobre
manutenção: código congelado é dívida baixa para quem vendoriza e dependência alta
para quem faz iframe.

### C. Não usar, ficar só com a `anima-mlp-xor` — recusada

A animação própria continua, e continua ensinando o que o Playground não mostra (o
mínimo local, com 44 de 60 inicializações resolvendo). Mas ela não cobre a seção dos
hiperparâmetros, e essa seção precisa de um objeto manipulável.

## Condições, e elas são parte da decisão

1. **Roteiro obrigatório, uma manopla por pergunta.** O Playground tem oito controles
   livres. Oito manoplas sem roteiro produzem confundimento: o leitor mexe em três
   coisas, algo melhora, e ele não sabe qual causou. Isso não falha o critério 2 do
   [ADR 0015](0015-animacao-e-laboratorio-sem-manopla.md) por falta de controle, falha
   **por excesso** — é a mesma bolinha rolando no vale, com botões. O roteiro fixa
   tudo menos um controle por pergunta, e pede a previsão escrita antes de mexer.
2. **Tabela de rótulos em português** ao lado. A interface é em inglês e o livro não
   é. Sem a tabela, o leitor gasta carga cognitiva traduzindo em vez de prevendo.
3. **`analytics.js` fora, e um gate que impeça o retorno.** Um `grep` por
   `analytics|gtag|UA-` na pasta vendorizada, que quebra o build.
4. **Fontes vendorizadas.** O `index.html` tem exatamente **um** recurso externo:
   Google Fonts (Roboto + Material Icons). Não é cosmético: oito botões do
   Playground usam ligadura `material-icons`, e sem a fonte eles viram as palavras
   literais (`play_arrow`, `replay`). Sem vendorizar, o capítulo passa a depender de
   rede e o princípio VIII.6 cai de novo, pela porta dos fundos.
5. **Apache 2.0 cumprida:** `LICENSE` junto, um `LEIA-ME.md` declarando origem,
   commit e o que modificamos (cláusula 4(b), já que remover analytics e traduzir
   rótulos **são** modificações), cabeçalhos de copyright preservados, e nenhum uso
   da marca que sugira endosso — o próprio README do projeto diz "this is not an
   official Google product".

## Consequências

- O livro passa a carregar ~450 KB de código de terceiro (bundle, lib, CSS, fontes).
  É estático, roda no navegador, e não muda: o upstream está congelado.
- O `build.mjs` ganha uma cópia recursiva de `publicar/tema/playground/` para
  `docs/assets/playground/`. A pasta `docs/` é apagada a cada build, então nada pode
  ser posto lá na mão.
- O arquivo vendorizado chama-se `playground.html`, e **não** `index.html`: o gate de
  links do build compara por `basename()`, e um `index.html` a mais colidiria com o do
  livro, passando falsamente.
- O iframe entra por um tipo novo no registro de laboratórios, para que o `:::lab`
  continue sendo a superfície única de interatividade.
- **Risco aceito:** o gate de links não protege `src` de iframe. Um caminho errado dá
  iframe branco com build verde. Mitigação: um teste que confere a existência do
  arquivo vendorizado.

## Como o comitê votou

Três especialistas, três ângulos, mesma conclusão: **vendorizar**.

- **Licença e sustentação:** B, porque é a única opção que satisfaz os princípios V e
  VIII.6, e o custo é baixo justamente porque o upstream está congelado.
- **Pedagogia:** entra **com condição** — só na seção dos hiperparâmetros, com roteiro
  de previsão e tabela de rótulos; sem o roteiro, não entra.
- **Integração técnica:** viável **com ressalva** — a ressalva é a tipografia, e ela
  virou a condição 4 acima.

O comitê também corrigiu a lista de arquivos que eu tinha levantado: faltavam o
`bundle.css` (156 KB, todo o Material Design Lite) e o `favicon.png`. Sem o
`bundle.css`, o Playground abre sem layout nenhum.
