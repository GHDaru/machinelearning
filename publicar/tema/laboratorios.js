/* Laboratórios interativos — a terceira superfície do livro vivo.

   Exercício pergunta e corrige. Vídeo mostra. **Laboratório deixa manipular.**

   Tudo roda no navegador, sem backend: um laboratório não tem gabarito para
   esconder — o gabarito é o comportamento do próprio objeto. É por isso que
   ele funciona mesmo com o backend fora do ar, ao contrário dos exercícios.

   Registro de tipos no fim do arquivo. Cada tipo é uma função
   (raiz, config) => void que preenche o elemento. */
(function () {
  "use strict";

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function campo(rotulo, valor, passo, aoMudar) {
    var wrap = el("label", "lab-campo");
    wrap.appendChild(el("span", "lab-campo-rot", rotulo));
    var input = document.createElement("input");
    input.type = "number";
    input.step = String(passo);
    input.value = String(valor);
    input.className = "lab-num";
    input.addEventListener("input", function () { aoMudar(parseFloat(input.value)); });
    wrap.appendChild(input);
    var faixa = document.createElement("input");
    faixa.type = "range";
    faixa.min = "-3"; faixa.max = "3"; faixa.step = String(passo);
    faixa.value = String(valor);
    faixa.className = "lab-faixa";
    faixa.addEventListener("input", function () {
      input.value = faixa.value;
      aoMudar(parseFloat(faixa.value));
    });
    input.addEventListener("input", function () { faixa.value = input.value; });
    wrap.appendChild(faixa);
    return wrap;
  }

  // ------------------------------------------------- neurônio de McCulloch–Pitts

  var FUNCOES = {
    AND:  { rotulo: "E (AND)",        saida: function (a, b) { return a && b ? 1 : 0; } },
    OR:   { rotulo: "OU (OR)",        saida: function (a, b) { return a || b ? 1 : 0; } },
    NAND: { rotulo: "NÃO-E (NAND)",   saida: function (a, b) { return a && b ? 0 : 1; } },
    NOR:  { rotulo: "NÃO-OU (NOR)",   saida: function (a, b) { return a || b ? 0 : 1; } },
    XOR:  { rotulo: "OU-EXCLUSIVO (XOR)", saida: function (a, b) { return a !== b ? 1 : 0; },
            impossivel: true },
  };

  var ENTRADAS = [[0, 0], [0, 1], [1, 0], [1, 1]];

  function neuronioMP(raiz, cfg) {
    var estado = { w1: 0, w2: 0, limiar: 0, funcao: cfg.funcao || "AND" };

    var corpo = el("div", "lab-corpo");
    var painel = el("div", "lab-painel");
    var visual = el("div", "lab-visual");
    corpo.appendChild(painel);
    corpo.appendChild(visual);

    // --- seletor de função ---
    var sel = document.createElement("select");
    sel.className = "lab-select";
    Object.keys(FUNCOES).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k;
      o.textContent = FUNCOES[k].rotulo;
      sel.appendChild(o);
    });
    sel.value = estado.funcao;
    sel.addEventListener("change", function () { estado.funcao = sel.value; desenhar(); });
    var selWrap = el("label", "lab-campo");
    selWrap.appendChild(el("span", "lab-campo-rot", "Função que você quer construir"));
    selWrap.appendChild(sel);
    painel.appendChild(selWrap);

    painel.appendChild(campo("peso w₁", estado.w1, 0.1, function (v) { estado.w1 = v || 0; desenhar(); }));
    painel.appendChild(campo("peso w₂", estado.w2, 0.1, function (v) { estado.w2 = v || 0; desenhar(); }));
    painel.appendChild(campo("limiar θ", estado.limiar, 0.1, function (v) { estado.limiar = v || 0; desenhar(); }));

    var formula = el("div", "lab-formula");
    painel.appendChild(formula);

    var tabela = el("table", "lab-tabela");
    painel.appendChild(tabela);

    var veredito = el("div", "lab-veredito");
    painel.appendChild(veredito);

    var canvas = document.createElement("canvas");
    canvas.width = 420; canvas.height = 420;
    canvas.className = "lab-canvas";
    visual.appendChild(canvas);
    visual.appendChild(el("p", "lab-legenda",
      "Cada ponto é uma linha da tabela-verdade. A reta é w₁x₁ + w₂x₂ = θ. " +
      "A região sombreada é onde o neurônio dispara (saída 1)."));

    function dispara(a, b) {
      return (estado.w1 * a + estado.w2 * b) >= estado.limiar ? 1 : 0;
    }

    function desenhar() {
      var fn = FUNCOES[estado.funcao];
      formula.innerHTML = "saída = 1 se <b>" + estado.w1.toFixed(1) + "·x₁ + " +
        estado.w2.toFixed(1) + "·x₂ ≥ " + estado.limiar.toFixed(1) + "</b>, senão 0";

      // tabela-verdade com o que o neurônio faz × o que deveria fazer
      var acertos = 0;
      var linhas = "<tr><th>x₁</th><th>x₂</th><th>esperado</th><th>seu neurônio</th><th></th></tr>";
      ENTRADAS.forEach(function (p) {
        var esperado = fn.saida(p[0], p[1]);
        var obtido = dispara(p[0], p[1]);
        var ok = esperado === obtido;
        if (ok) acertos++;
        linhas += "<tr class=\"" + (ok ? "ok" : "erro") + "\"><td>" + p[0] + "</td><td>" + p[1] +
          "</td><td>" + esperado + "</td><td>" + obtido + "</td><td>" + (ok ? "✔" : "✘") + "</td></tr>";
      });
      tabela.innerHTML = linhas;

      if (acertos === 4) {
        veredito.className = "lab-veredito acertou";
        veredito.innerHTML = "<b>4 de 4.</b> Você encontrou pesos que constroem " +
          fn.rotulo + ". Repare que existem infinitas soluções — a sua é uma delas.";
      } else if (fn.impossivel && acertos === 3) {
        veredito.className = "lab-veredito quase";
        veredito.innerHTML = "<b>3 de 4 — e vai ficar em 3.</b> Tente quanto quiser: " +
          "nenhum conjunto de pesos resolve o XOR com um neurônio só. " +
          "Os pontos de saída 1 estão em cantos <i>opostos</i> do quadrado, e uma reta " +
          "não separa cantos opostos. Foi este argumento que parou a área por uma década.";
      } else {
        veredito.className = "lab-veredito";
        veredito.innerHTML = acertos + " de 4 corretos. Ajuste os pesos e o limiar.";
      }
      pintar(fn);
    }

    function pintar(fn) {
      var ctx = canvas.getContext("2d");
      var W = canvas.width, H = canvas.height, m = 70;
      var escuro = document.documentElement.getAttribute("data-tema") === "escuro";
      var corFundo = escuro ? "#1d1f22" : "#f7f7f5";
      var corEixo = escuro ? "#4a4d52" : "#c9c9c4";
      var corTexto = escuro ? "#9a9a97" : "#6a6a6a";

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = corFundo;
      ctx.fillRect(0, 0, W, H);

      // px: x1,x2 em [-0.25, 1.25] -> pixels
      var lo = -0.25, hi = 1.25;
      function px(v) { return m + (v - lo) / (hi - lo) * (W - 2 * m); }
      function py(v) { return H - m - (v - lo) / (hi - lo) * (H - 2 * m); }

      // região de disparo, por amostragem: robusto a w=0 e a retas verticais
      var passo = 4;
      ctx.fillStyle = escuro ? "rgba(224,162,74,.18)" : "rgba(224,162,74,.22)";
      for (var sx = m; sx < W - m; sx += passo) {
        for (var sy = m; sy < H - m; sy += passo) {
          var vx = lo + (sx - m) / (W - 2 * m) * (hi - lo);
          var vy = lo + (H - m - sy) / (H - 2 * m) * (hi - lo);
          if (estado.w1 * vx + estado.w2 * vy >= estado.limiar) {
            ctx.fillRect(sx, sy, passo, passo);
          }
        }
      }

      // eixos
      ctx.strokeStyle = corEixo;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px(lo), py(0)); ctx.lineTo(px(hi), py(0));
      ctx.moveTo(px(0), py(lo)); ctx.lineTo(px(0), py(hi));
      ctx.stroke();
      ctx.fillStyle = corTexto;
      ctx.font = "13px -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.fillText("x₁", px(hi) - 18, py(0) + 22);
      ctx.fillText("x₂", px(0) - 26, py(hi) + 14);

      // a reta de decisão: w1·x1 + w2·x2 = θ
      ctx.strokeStyle = "#e0a24a";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (Math.abs(estado.w2) > 1e-9) {
        var y1 = (estado.limiar - estado.w1 * lo) / estado.w2;
        var y2 = (estado.limiar - estado.w1 * hi) / estado.w2;
        ctx.moveTo(px(lo), py(y1)); ctx.lineTo(px(hi), py(y2));
      } else if (Math.abs(estado.w1) > 1e-9) {
        var x = estado.limiar / estado.w1;           // reta vertical
        ctx.moveTo(px(x), py(lo)); ctx.lineTo(px(x), py(hi));
      }
      ctx.stroke();

      // os quatro pontos da tabela-verdade
      ENTRADAS.forEach(function (p) {
        var esperado = fn.saida(p[0], p[1]);
        var obtido = estado.w1 * p[0] + estado.w2 * p[1] >= estado.limiar ? 1 : 0;
        ctx.beginPath();
        ctx.arc(px(p[0]), py(p[1]), 11, 0, Math.PI * 2);
        ctx.fillStyle = esperado === 1 ? "#6fd08a" : (escuro ? "#3a3d42" : "#ffffff");
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = esperado === obtido ? (escuro ? "#8a8d92" : "#8a8a86") : "#b3261e";
        ctx.stroke();
        ctx.fillStyle = corTexto;
        ctx.font = "12px -apple-system, Segoe UI, Roboto, sans-serif";
        ctx.fillText("(" + p[0] + "," + p[1] + ")", px(p[0]) + 15, py(p[1]) - 12);
      });
    }

    raiz.appendChild(corpo);
    desenhar();
    // redesenha ao trocar o tema, para o canvas não ficar com as cores antigas
    new MutationObserver(function () { desenhar(); }).observe(
      document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  }

  // ------------------------------------------------------------- registro

  var TIPOS = { "neuronio-mp": neuronioMP };

  function iniciar() {
    [].forEach.call(document.querySelectorAll(".laboratorio"), function (raiz) {
      var tipo = raiz.getAttribute("data-lab");
      var cfg = {};
      try { cfg = JSON.parse(raiz.getAttribute("data-cfg") || "{}"); } catch (e) {}
      var construir = TIPOS[tipo];
      if (!construir) {
        raiz.appendChild(el("p", "lab-erro", "Laboratório desconhecido: " + tipo));
        return;
      }
      construir(raiz.querySelector(".lab-area"), cfg);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
