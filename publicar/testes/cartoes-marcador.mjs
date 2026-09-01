// O marcador de cartão: o que ele aceita, o que ele recusa e o que ele escreve.
//
// POR QUE ESTE TESTE EXISTE. O corte do modo cartão saiu de "onde o autor pôs
// um <h2>" para "onde o autor DECLAROU um cartão". A régua do cliente
// (tema/cartoes.js) só encontra o corte se o build tiver escrito o `<hr
// class="corte-cartao">` na posição certa, com `data-nivel` e `data-titulo`.
// Se o marcador virar parágrafo, nada quebra: a página monta, o botão aparece,
// e o capítulo volta silenciosamente ao corte por cabeçalho — que é o defeito
// que o gate `cartoes-legiveis.mjs` mede em 25,9x de diferença entre cartões.
// Defeito que não grita é defeito que fica.
import { marcarCortes, cartoesDe, ErroDeCartao } from "../cartoes.mjs";

let falhas = 0;
function ok(nome, cond) {
  if (cond) console.log(`  ok   ${nome}`);
  else { console.log(`  FALHA ${nome}`); falhas++; }
}
function recusa(nome, md) {
  try { cartoesDe(md, "teste.md"); console.log(`  FALHA ${nome} (aceitou)`); falhas++; }
  catch (e) { ok(nome, e instanceof ErroDeCartao); }
}

const doisCartoes = ':::cartao {"nivel":1,"titulo":"Um"}\n\ntexto A\n\n:::cartao {"nivel":2,"titulo":"Dois"}\n\ntexto B\n';

ok("conta os cartões declarados", cartoesDe(doisCartoes).length === 2);
ok("lê nível e título", cartoesDe(doisCartoes)[1].nivel === 2 && cartoesDe(doisCartoes)[1].titulo === "Dois");
ok("`:::cartao-fim` não é cartão", cartoesDe(doisCartoes + "\n:::cartao-fim\n").length === 2);

const html = marcarCortes(doisCartoes);
ok("vira <hr> com os dados", /<hr class="corte-cartao" data-nivel="1" data-titulo="Um">/.test(html));
ok("o <hr> fica sozinho na linha (bloco HTML para o markdown-it)",
   html.split("\n").filter((l) => l.indexOf("<hr class=\"corte-cartao\"") === 0 && l.endsWith(">")).length === 2);
ok("`:::cartao-fim` fecha o baralho", /<hr class="corte-cartao" data-fim="1">/.test(marcarCortes(":::cartao-fim\n")));
ok("o texto entre os cortes passa intacto", html.indexOf("texto A") > 0 && html.indexOf("texto B") > 0);

// Aspas no título quebrariam o atributo e comeriam o resto da página.
ok("escapa o que quebraria o atributo",
   /data-titulo="O &quot;preço&quot; &amp; a estação"/.test(
     marcarCortes(':::cartao {"nivel":3,"titulo":"O \\"preço\\" & a estação"}\n')));

// Documentar a sintaxe não pode criar cartão — a mesma regra dos :::exercicio.
const emCerca = "```markdown\n:::cartao {\"nivel\":1,\"titulo\":\"exemplo\"}\n```\n";
ok("marcador dentro de código cercado é exemplo, não corte", cartoesDe(emCerca).length === 0);
ok("marcador dentro de código cercado sai como veio", marcarCortes(emCerca) === emCerca);

recusa("sem atributos", ':::cartao\n');
recusa("JSON quebrado", ':::cartao {nivel:1}\n');
recusa("sem título", ':::cartao {"nivel":1}\n');
recusa("sem nível", ':::cartao {"titulo":"Um"}\n');

// Sem marcador nenhum, o Markdown não é tocado: os 28 capítulos que ainda
// cortam por cabeçalho não podem sentir a mudança.
const semMarcador = "## Um título\n\nprosa qualquer\n";
ok("capítulo sem marcador passa byte a byte", marcarCortes(semMarcador) === semMarcador);

if (falhas) { console.error(`✗ ${falhas} FALHOU`); process.exit(1); }
console.log("✓ marcador de cartão: corte declarado, validado e escapado.");
