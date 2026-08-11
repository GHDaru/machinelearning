// Gera o site-stub que fica no GitHub Pages depois que o livro se mudou para
// o domínio próprio (ADR 0006).
//
// Por que um stub e não apagar: há links antigos em circulação — em ementas,
// em mensagens, em favoritos de aluno. O GitHub Pages não faz 301, então o
// redirecionamento é feito no cliente, PRESERVANDO O CAMINHO: quem tinha
// .../machinelearning/18-neuronio-artificial.html cai no capítulo 18 do
// domínio novo, e não na capa.
//
// Um 404.html basta para cobrir todos os caminhos: é o que o Pages serve para
// qualquer URL que não exista, e depois do stub nenhuma existe.

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DESTINO = "https://machinelearning.ghdaru.com.br";
const BASE_ANTIGA = "/machinelearning";
const SAIDA = resolve(dirname(fileURLToPath(import.meta.url)), "../../docs");

const pagina = (titulo) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<link rel="canonical" href="${DESTINO}/">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${DESTINO}/">
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center;
         background:#faf9f7; color:#1c1c1c; text-align:center; padding:2rem;
         font:16px/1.6 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  a { color:#35618e; }
  .cx { max-width:34rem; }
  h1 { font-size:1.3rem; margin:0 0 .6rem; }
  p { color:#5a5a57; }
  @media (prefers-color-scheme: dark) {
    body { background:#141517; color:#e6e6e4; } p { color:#9a9a97; } a { color:#8fb8dd; }
  }
</style>
<script>
  // Preserva o caminho: /machinelearning/04-avaliacao.html -> /04-avaliacao.html
  (function () {
    var p = location.pathname.replace(/^\/machinelearning/, "");
    location.replace("${DESTINO}" + (p === "/" ? "" : p) + location.search + location.hash);
  })();
</script>
</head>
<body>
  <main class="cx">
    <h1>O livro mudou de endereço</h1>
    <p><strong>Ciência de Dados e Aprendizado de Máquina</strong> agora vive em
       <a href="${DESTINO}/">machinelearning.ghdaru.com.br</a>.</p>
    <p>Você está sendo levado para lá. Se nada acontecer, use o link acima.</p>
  </main>
</body>
</html>
`;

mkdirSync(SAIDA, { recursive: true });
writeFileSync(resolve(SAIDA, "index.html"), pagina("O livro mudou de endereço"));
writeFileSync(resolve(SAIDA, "404.html"), pagina("O livro mudou de endereço"));
console.log(`✓ Stub de redirecionamento gerado em docs/ (index.html + 404.html) -> ${DESTINO}`);
