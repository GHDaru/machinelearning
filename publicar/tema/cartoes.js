/* Modo cartão — a MESMA página de capítulo lida uma tela por vez (microlearning).

   POR QUE ELE EXISTE. O capítulo é longo por bom motivo: ele é um texto, e texto
   se lê inteiro. Mas quem abre o livro no ônibus não está lendo um texto — está
   pegando um conceito. O modo cartão dá esse segundo jeito de ler SEM criar um
   segundo livro: não há HTML novo, não há Markdown paralelo, não há conteúdo
   duplicado. O que existe é uma régua que corta o HTML já gerado, no cliente.

   AS TRÊS COISAS QUE ESTE ARQUIVO NÃO FAZ, de propósito:

     1. **não gera conteúdo.** Ele MOVE os nós que o build já produziu. Um
        exercício dentro do cartão é o mesmo elemento que o `interativos.js`
        ligou no carregamento — mesmos ouvintes, mesmo estado, mesma correção no
        servidor. Nada de gabarito passa por aqui, porque nada de gabarito passa
        pela página (Princípio VIII.3);
     2. **não muda o padrão.** A página longa é o que o leitor recebe; o modo
        cartão é um clique. Desligar devolve os nós à ordem original;
     3. **não decide a régua no meio do código.** A segmentação inteira vive em
        `segmentar`, que é PURA: recebe nós, devolve descrições de cartão, não
        toca no DOM. Trocar a régua é trocar essa função e mais nada.

   A RÉGUA, e por que ela mudou. A v1 cortava por cabeçalho — critério
   TIPOGRÁFICO. Medido a 360×800 no capítulo II.2, isso dava cartões de 226 px a
   5 849 px (25,9x entre o maior e o menor, contra 1,2x na referência aprovada
   pelo autor): o cartão da dedução tinha 7,3 telas e 1 289 palavras, e a barra
   prometia "7 de 18" tanto para ele quanto para um cartão de 39 palavras. Um
   cartão que rola sete telas é a página longa com um botão.

   Agora o corte é DECLARADO no Markdown (`:::cartao {"nivel":1,"titulo":"…"}`,
   ver `publicar/cartoes.mjs`) e chega ao DOM como um `<hr class="corte-cartao">`
   invisível. `segmentarPorMarcador` o usa quando ele existe;
   `segmentarPorCabecalhos` continua valendo para os capítulos que ainda não
   declararam corte — os 28 outros seguem funcionando sem tocar em nada.

   O que está entre `:::cartao-fim` e o próximo `:::cartao` (e o que vem antes do
   primeiro) fica FORA do baralho: continua no capítulo, e some enquanto o modo
   cartão está ligado. É a saída para o trecho sem gesto — a disputa
   Legendre-Gauss do II.2 é o caso claro. Perder conteúdo seria falha; deixá-lo
   fora do baralho é decisão.

   Acessibilidade: os botões são botões (teclado de graça), as setas ←/→ navegam
   quando o foco não está num campo, a troca de cartão move o foco para o cartão
   novo e é anunciada num `aria-live` — o mesmo padrão dos placares dos
   laboratórios. */
(function () {
  "use strict";

  // ------------------------------------------------------------- segmentação

  function ehCabecalho(no) {
    return no.nodeType === 1 && (no.tagName === "H2" || no.tagName === "H3");
  }

  /** Texto do cabeçalho sem a âncora "#" que o build pendura nele. */
  function tituloDe(h) {
    var c = h.cloneNode(true);
    var a = c.querySelector(".header-anchor");
    if (a && a.parentNode) a.parentNode.removeChild(a);
    return (c.textContent || "").replace(/\s+/g, " ").trim();
  }

  function soEspaco(no) {
    if (no.nodeType === 3) return !/\S/.test(no.nodeValue || "");
    if (no.nodeType === 8) return true;   // comentário não abre cartão
    return false;
  }

  /**
   * A RÉGUA — função pura, sem DOM de saída e sem estado de fora.
   *
   * Versão 1: um cartão começa em cada `<h2>` ou `<h3>`; o conteúdo vai até o
   * próximo cabeçalho de qualquer um dos dois níveis. Disso cai de graça a
   * regra do enunciado: um `<h2>` que contém `<h3>` vira um cartão de abertura
   * (o que vem antes do primeiro `<h3>`) mais um cartão por `<h3>`.
   *
   * @param {Array<Node>} nos  os filhos do corpo do capítulo, na ordem
   * @returns {Array<{nivel:number,titulo:string,id:string,pai:string,nos:Array<Node>}>}
   */
  function segmentarPorCabecalhos(nos) {
    var cartoes = [];
    var atual = null;
    var ultimoH2 = "";
    for (var i = 0; i < nos.length; i++) {
      var no = nos[i];
      if (ehCabecalho(no)) {
        var nivel = no.tagName === "H2" ? 2 : 3;
        var titulo = tituloDe(no);
        if (nivel === 2) ultimoH2 = titulo;
        atual = { nivel: nivel, titulo: titulo, id: no.id || "",
                  pai: nivel === 3 ? ultimoH2 : "", nos: [no] };
        cartoes.push(atual);
        continue;
      }
      if (!atual) {
        if (soEspaco(no)) continue;          // espaço antes do 1º título não cria cartão
        atual = { nivel: 2, titulo: "Abertura", id: "", pai: "", nos: [] };
        cartoes.push(atual);
      }
      atual.nos.push(no);
    }
    return cartoes;
  }

  function ehCorte(no) {
    return no.nodeType === 1 && no.className &&
           (" " + no.className + " ").indexOf(" corte-cartao ") >= 0;
  }

  /**
   * A RÉGUA v2 — o autor declara onde cada cartão começa e onde o baralho acaba.
   *
   * Também função pura. Um cartão vai de um `<hr class="corte-cartao">` até o
   * próximo marcador; `data-fim` fecha o baralho, e o que vem depois (ou antes
   * do primeiro corte) sai em `fora` — continua no capítulo, escondido enquanto
   * o modo cartão está ligado.
   *
   * @param {Array<Node>} nos
   * @returns {{cartoes:Array<Object>, fora:Array<Node>}}
   */
  function segmentarPorMarcador(nos) {
    var cartoes = [];
    var fora = [];
    var atual = null;
    for (var i = 0; i < nos.length; i++) {
      var no = nos[i];
      if (ehCorte(no)) {
        if (no.getAttribute("data-fim")) { atual = null; fora.push(no); continue; }
        atual = { nivel: Number(no.getAttribute("data-nivel")) || 0,
                  titulo: no.getAttribute("data-titulo") || "",
                  id: "", pai: "", nos: [no] };
        cartoes.push(atual);
        continue;
      }
      if (atual) atual.nos.push(no);
      else fora.push(no);
    }
    return { cartoes: cartoes, fora: fora };
  }

  /** Escolhe a régua: marcador declarado ganha; cabeçalho é o que sobra. */
  function segmentar(nos) {
    for (var i = 0; i < nos.length; i++) {
      if (ehCorte(nos[i])) return segmentarPorMarcador(nos);
    }
    return { cartoes: segmentarPorCabecalhos(nos), fora: [] };
  }

  // --------------------------------------------------------------- montagem

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  var artigo = document.querySelector("article.markdown");
  var conteudo = document.querySelector(".conteudo");
  if (!artigo || !conteudo) return;
  if (!document.body.classList.contains("pagina-capitulo")) return;

  var originais = [].slice.call(artigo.childNodes);
  var recorte = segmentar(originais);
  var cartoes = recorte.cartoes;
  var fora = recorte.fora;
  if (cartoes.length < 2) return;            // página sem estrutura não vira fluxo

  var TOTAL = cartoes.length;

  // Barra de topo: o interruptor + a barra de progresso (que só aparece ligada).
  var barra = el("div", "cartoes-barra");
  var alt = el("button", "cartoes-alt", "🃏 Modo cartão");
  alt.type = "button";
  alt.setAttribute("aria-pressed", "false");
  alt.title = "Ler este capítulo uma tela por vez";
  var trilho = el("div", "cartoes-trilho");
  var enchimento = el("i");
  trilho.appendChild(enchimento);
  barra.appendChild(alt);
  barra.appendChild(trilho);
  conteudo.insertBefore(barra, artigo);

  // Palco (dentro do artigo, para herdar a largura e o estilo do texto) e nav.
  var palco = el("div", "cartoes-palco");
  var foraCaixa = el("div", "cartoes-fora");

  var nav = el("nav", "cartoes-nav");
  nav.setAttribute("aria-label", "Navegação por cartões");
  var pontos = el("div", "cartoes-pontos");
  pontos.setAttribute("aria-hidden", "true");
  var bolinhas = [];
  for (var k = 0; k < TOTAL; k++) { var b = el("i"); pontos.appendChild(b); bolinhas.push(b); }
  var linha = el("div", "cartoes-linha");
  var btnAnt = el("button", "cartoes-btn", "← Anterior");
  btnAnt.type = "button";
  var conta = el("span", "cartoes-conta");
  var btnProx = el("button", "cartoes-btn", "Próxima →");
  btnProx.type = "button";
  linha.appendChild(btnAnt); linha.appendChild(conta); linha.appendChild(btnProx);
  var anuncio = el("p", "cartoes-vh");
  anuncio.setAttribute("role", "status");
  anuncio.setAttribute("aria-live", "polite");
  nav.appendChild(pontos); nav.appendChild(linha); nav.appendChild(anuncio);

  var ligado = false;
  var atual = 0;

  /** Volta ao topo do fluxo — não ao topo da PÁGINA, que no celular é a barra
   *  de navegação inteira. `scroll-behavior: smooth` do tema é desarmado no
   *  instante do salto: animar 18 vezes seguidas é enjoo, não afeto. */
  function aoTopo() {
    var raiz = document.documentElement;
    var antes = raiz.style.scrollBehavior;
    raiz.style.scrollBehavior = "auto";
    var y = barra.getBoundingClientRect().top +
            (window.pageYOffset || raiz.scrollTop || 0) - 8;
    window.scrollTo(0, y > 0 ? y : 0);
    raiz.style.scrollBehavior = antes;
  }

  function mostrar(i, comFoco) {
    atual = Math.max(0, Math.min(TOTAL - 1, i));
    for (var k = 0; k < TOTAL; k++) {
      if (k === atual) cartoes[k].el.removeAttribute("hidden");
      else cartoes[k].el.setAttribute("hidden", "");
      bolinhas[k].className = k === atual ? "on" : (k < atual ? "vista" : "");
    }
    enchimento.style.width = ((atual + 1) / TOTAL * 100) + "%";
    btnAnt.disabled = atual === 0;
    btnProx.disabled = atual === TOTAL - 1;
    conta.textContent = (atual + 1) + " / " + TOTAL;
    anuncio.textContent = "Cartão " + (atual + 1) + " de " + TOTAL + " — " + cartoes[atual].titulo;
    if (comFoco !== false) {
      try { cartoes[atual].el.focus({ preventScroll: true }); }
      catch (e) { try { cartoes[atual].el.focus(); } catch (e2) {} }
    }
    aoTopo();
  }

  function ligar() {
    for (var i = 0; i < TOTAL; i++) {
      var c = cartoes[i];
      var d = el("div", "cartao");
      d.setAttribute("role", "group");
      d.setAttribute("tabindex", "-1");
      d.setAttribute("aria-label", "Cartão " + (i + 1) + " de " + TOTAL + ": " + c.titulo);
      d.setAttribute("hidden", "");
      // "Nível 1 · cartão 3/17" — o rótulo da referência. Sem nível declarado
      // (capítulo ainda no corte por cabeçalho), a seção-mãe faz as vezes.
      d.appendChild(el("p", "cartao-nivel",
        (c.nivel ? "Nível " + c.nivel + " · " : (c.pai ? c.pai + " · " : "")) +
        "cartão " + (i + 1) + "/" + TOTAL));
      // MOVE os nós — não copia. É o que garante que o exercício dentro do
      // cartão seja o MESMO elemento que o backend já conhece.
      for (var j = 0; j < c.nos.length; j++) d.appendChild(c.nos[j]);
      c.el = d;
      palco.appendChild(d);
    }
    // O que não entrou em cartão nenhum não some do capítulo: some da TELA
    // enquanto o baralho está aberto. `desligar()` devolve tudo à ordem
    // original, porque reanexa `originais` um a um.
    if (fora.length) {
      foraCaixa.hidden = true;
      for (var f = 0; f < fora.length; f++) foraCaixa.appendChild(fora[f]);
      palco.appendChild(foraCaixa);
    }
    artigo.appendChild(palco);
    artigo.classList.add("em-cartoes");
    barra.classList.add("ligado");
    conteudo.insertBefore(nav, artigo.nextSibling);
    alt.textContent = "📖 Página inteira";
    alt.setAttribute("aria-pressed", "true");
    ligado = true;
    mostrar(cartaoDoHash(), false);
  }

  function desligar() {
    for (var i = 0; i < TOTAL; i++) cartoes[i].el = null;
    for (var n = 0; n < originais.length; n++) artigo.appendChild(originais[n]);
    if (palco.parentNode) palco.parentNode.removeChild(palco);
    palco.innerHTML = "";
    if (nav.parentNode) nav.parentNode.removeChild(nav);
    artigo.classList.remove("em-cartoes");
    barra.classList.remove("ligado");
    enchimento.style.width = "";
    alt.textContent = "🃏 Modo cartão";
    alt.setAttribute("aria-pressed", "false");
    ligado = false;
    aoTopo();
  }

  /** Índice do cartão que contém o alvo do `#hash` (0 se não houver). */
  function cartaoDoHash() {
    var id = (location.hash || "").replace(/^#/, "");
    if (!id) return 0;
    var alvo = null;
    try { alvo = document.getElementById(id); } catch (e) {}
    if (!alvo) return 0;
    for (var i = 0; i < TOTAL; i++) {
      for (var j = 0; j < cartoes[i].nos.length; j++) {
        var no = cartoes[i].nos[j];
        if (no === alvo || (no.nodeType === 1 && no.contains && no.contains(alvo))) return i;
      }
    }
    return 0;
  }

  alt.addEventListener("click", function () { if (ligado) desligar(); else ligar(); });
  btnAnt.addEventListener("click", function () { mostrar(atual - 1); });
  btnProx.addEventListener("click", function () { mostrar(atual + 1); });

  window.addEventListener("hashchange", function () {
    if (ligado) mostrar(cartaoDoHash(), false);
  });

  document.addEventListener("keydown", function (ev) {
    if (!ligado) return;
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var t = ev.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    if (ev.key === "ArrowRight") { mostrar(atual + 1); ev.preventDefault(); }
    else if (ev.key === "ArrowLeft") { mostrar(atual - 1); ev.preventDefault(); }
  });
})();
