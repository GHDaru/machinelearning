# ADR 0015 — A animação não é uma quarta superfície: é laboratório sem manopla

**Data:** 2026-08-13 · **Estado:** aceito · **Comitê:** design de interação e carga cognitiva, professor e autor de material visual

## Contexto

O autor pediu animações de métodos "aprendendo", primeiro na capa e depois nos capítulos. A primeira nasceu no III.1: o perceptron corrigindo os próprios pesos, com um botão que troca para dados XOR, onde ele nunca converge.

Isso levantou duas perguntas que valem para as outras 22.

## Decisão 1 — atributo, não bloco novo

Eu havia chamado a animação de **quarta superfície**, ao lado do exercício (pergunta e corrige), do vídeo (mostra) e do laboratório (deixa manipular). O comitê contradisse, e o código dá razão a ele: a animação já é um `TIPOS` como qualquer outro, renderiza dentro do mesmo `<section class="laboratorio">`, com a mesma tarja, e conta no mesmo placar. Um bloco `:::anima` duplicaria parser, CSS e vocabulário para um caminho de código idêntico.

**É laboratório sem manopla**, e a distinção vai em `"modo": "demonstracao"`.

Para o leitor muda uma coisa só, e ela importa: **se há ou não algo para fazer ali**. A capa promete "N laboratórios interativos", e 23 demonstrações inflariam esse número com objetos que ninguém manipula. Por isso o modo pede tarja própria e contador próprio. Promessa quebrada custa mais que vocabulário novo.

## Decisão 2 — anima-se estado que evolui, não método que existe

O critério, e ele exclui capítulo por mérito e não por cota: **estado que evolui, mais um número que o leitor consegue prever errado.**

Capítulo de processo, de decisão e de governança podem animar, desde que o que se move não seja a caixa do diagrama, e sim a consequência quantificada de mexer num controle. Não animam arquitetura, catálogo, nem o que já é laboratório manipulável.

O teste contra a decoração, aplicado item a item:

1. há **número nomeado** na tela que muda com o quadro;
2. há **um controle cujo resultado o leitor consegue errar ao prever**;
3. **pausada num quadro qualquer**, ela responde a uma pergunta do capítulo.

Só o primeiro é ilustração. Só o terceiro é figura estática que se mexe. **Sem o segundo, é a bolinha rolando no vale da função de perda**, que é o clichê do gênero.

O mapa dos 29 capítulos está em [`specs/009-livro-v0-completo/animacoes.md`](../specs/009-livro-v0-completo/animacoes.md): **23 animam, 6 não.**

## O defeito que a primeira animação já tinha, e a regra que ele deixa

A versão publicada rodava no carregamento da página. O bloco está na linha 111 de 219, então quem descia até ele minutos depois encontrava **um quadro congelado dizendo "convergiu"**: uma imagem estática se passando por animação.

Pior que o defeito é como ele passou. O teste automatizado rolava até o bloco imediatamente após carregar, que não é o que uma pessoa faz. **A verificação reproduzia o caminho do robô, não o do leitor.**

Fica a regra, e ela vale para as 22 seguintes: **animação começa quando o leitor chega** (`IntersectionObserver`), e o teste espera antes de rolar.

Três defeitos irmãos vieram no mesmo lote e viram checklist do modo `demonstracao`:

| | |
|---|---|
| **Duração** | o XOR rodava até a época 60, cerca de 2 minutos. Cortado em 8: um contador de erros que não desce já disse tudo |
| **Leitor de tela** | `aria-label` mutante num `role="img"` não é anunciado. O placar recebe `aria-live` |
| **Tema** | faltava o `MutationObserver` que os outros três laboratórios já tinham; trocar claro/escuro deixava as cores do tema anterior |

## Alternativas avaliadas

| Alternativa | Por que não |
|---|---|
| Bloco `:::anima` próprio | duplica parser, CSS e vocabulário para caminho de código idêntico; a distinção é de expectativa, e expectativa se carrega em atributo |
| GIF animado, como pedido originalmente | 1 a 3 MB com serrilhado, contra ~4 KB de canvas; e o `og:image` não anima em plataforma social nenhuma, mostra o primeiro quadro |
| Uma animação por capítulo, sem exceção | é cota, e cota preenchida produz decoração nos capítulos que não têm estado que evolua |
| Laço infinito | movimento perpétuo atrás de texto é ruído; roda uma vez ao chegar e descansa |

## Consequências

O placar da capa passa a ter duas contagens onde havia uma, e o texto precisa distinguir o que se manipula do que se assiste.

**Dívida declarada, a pagar antes da segunda animação:** `animaPerceptron` duplica, em outra forma, a escala, o preâmbulo de tema e o construtor de botão que a `regressaoLinear` já tem. O núcleo compartilhado (`plano`, `placar`, `relogio`) sai **com duas animações, não com oito**. Cinco módulos cobrem as 23, e estão mapeados no arquivo de animações.

Fica registrado o que **não** foi decidido: o ritmo. A primeira converge em 2 épocas, cerca de 4 segundos, e o comitê recomenda 12 a 20 segundos com passo mais lento nas correções, mais botões de pausa e de passo a passo. É ajuste didático, e o autor não se pronunciou.
