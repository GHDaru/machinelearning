# TensorFlow Playground, vendorizado

Cópia do build do [TensorFlow Playground](https://github.com/tensorflow/playground),
servida pelo próprio site deste livro em vez de por `iframe` para o domínio de
terceiro. O porquê está no [ADR 0018](../../../adr/0018-o-playground-entra-vendorizado.md).

- **Origem:** branch `gh-pages` de `tensorflow/playground`.
- **Capturado em:** 2026-08-13.
- **Licença:** Apache 2.0 (arquivo `LICENSE` nesta pasta).
- **Não é produto oficial do Google.** O próprio README do projeto diz isso, e nada
  aqui deve sugerir endosso.

## O que modificamos

A cláusula 4(b) da Apache 2.0 pede que mudanças sejam declaradas. São três:

1. **`analytics.js` removido.** O pacote publicado carrega Google Analytics, o que
   viola o princípio de privacidade da constituição deste livro. O arquivo não foi
   copiado, e as duas linhas que o chamavam saíram do HTML. Um gate no build
   (`publicar/gates/sem-analytics.mjs`) impede que ele volte numa atualização.
   Nota de contexto: o tracker apontava para o Universal Analytics, que o Google
   desligou em julho de 2023. Estava morto no pacote original.
2. **Fontes vendorizadas.** O HTML original buscava Roboto e Material Icons em
   `fonts.googleapis.com`. Era o único recurso externo do pacote, e não era
   cosmético: oito controles usam ligadura `material-icons` e virariam as palavras
   literais (`play_arrow`, `replay`) sem a fonte. Agora vêm de `fontes/`, com o CSS
   em `fontes.css`. Só o subconjunto latino do Roboto foi trazido.
3. **`index.html` renomeado para `playground.html`.** O gate de links do nosso build
   compara nomes de arquivo por `basename()`, e um segundo `index.html` colidiria com
   o do livro, passando por validação sem ser o arquivo certo.

Os cabeçalhos de copyright e licença dentro de `bundle.js`, `bundle.css` e `lib.js`
estão preservados. Nada foi reminificado.

## Como atualizar

O upstream está congelado desde junho de 2022, então provavelmente não haverá o que
atualizar. Se houver: rebaixe os cinco arquivos da `gh-pages`, refaça as três
modificações acima, rode `node publicar/gates/sem-analytics.mjs` e atualize a data de
captura deste arquivo.
