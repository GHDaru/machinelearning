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


  // ------------------------------------------------------ regressão linear

  /* Mínimos quadrados pela mão do aluno.

     O capítulo afirma que a reta que minimiza a soma dos quadrados é "a
     melhor" segundo um critério escolhido. Aqui o critério vira gesto: arraste
     a reta e veja o número subir e descer. O botão que revela a ótima usa a
     MESMA solução fechada deduzida no capítulo — e o aluno pode conferir a
     conta à mão.

     Cinco métricas lado a lado, e só uma marcada como "a que estamos
     minimizando": é o que torna visível a frase do capítulo de que a perda é
     um critério de arbitragem, não uma descoberta sobre o mundo. Com um ponto
     distante, o EAM discorda do EQM na cara do leitor. */

  function rng(semente) {          // mulberry32: recarregar a página dá o mesmo dado
    var a = semente >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gerarPontos(cfg, semente) {
    var r = rng(semente);
    var n = cfg.n || 24;
    var a = cfg.a == null ? 1.8 : cfg.a;
    var b = cfg.b == null ? 4 : cfg.b;
    var ruido = cfg.ruido == null ? 3.2 : cfg.ruido;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var x = 1 + (i + r()) * (9 / n);
      var e = (r() + r() + r() - 1.5) * 2 * ruido;   // soma de uniformes ~ sino
      pts.push({ x: Math.round(x * 100) / 100, y: Math.round((a * x + b + e) * 100) / 100 });
    }
    return pts;
  }

  function ajusteOtimo(pts) {       // equações normais, o resultado da dedução
    var n = pts.length, sx = 0, sy = 0;
    pts.forEach(function (p) { sx += p.x; sy += p.y; });
    var mx = sx / n, my = sy / n, sxy = 0, sxx = 0;
    pts.forEach(function (p) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) * (p.x - mx); });
    var a = sxx === 0 ? 0 : sxy / sxx;
    return { a: a, b: my - a * mx };
  }

  function metricas(pts, a, b) {
    var n = pts.length, sqe = 0, eam = 0, sy = 0;
    pts.forEach(function (p) { sy += p.y; });
    var my = sy / n, sqt = 0;
    pts.forEach(function (p) {
      var r = p.y - (a * p.x + b);
      sqe += r * r;
      eam += Math.abs(r);
      sqt += (p.y - my) * (p.y - my);
    });
    return { sqe: sqe, eqm: sqe / n, rmse: Math.sqrt(sqe / n), eam: eam / n,
             r2: sqt === 0 ? 0 : 1 - sqe / sqt };
  }

  function regressaoLinear(raiz, cfg) {
    var semente = cfg.semente || 20260811;
    var estado = { a: 0, b: 0, pts: gerarPontos(cfg, semente),
                   otima: false, quadrados: false, arrastando: null };

    var corpo = el("div", "lab-corpo");
    var painel = el("div", "lab-painel");
    var visual = el("div", "lab-visual");
    corpo.appendChild(painel);
    corpo.appendChild(visual);

    var canvas = document.createElement("canvas");
    canvas.width = 560; canvas.height = 400;
    canvas.className = "lab-canvas lab-canvas-larga";
    visual.appendChild(canvas);

    var campoA = campo("inclinação a", estado.a, 0.1, function (v) {
      estado.a = isFinite(v) ? v : 0; desenhar();
    });
    var campoB = campo("intercepto b", estado.b, 0.5, function (v) {
      estado.b = isFinite(v) ? v : 0; desenhar();
    });
    // o intercepto vive na escala dos dados, não em [-3,3] como o padrão
    campoB.querySelector(".lab-faixa").min = "-20";
    campoB.querySelector(".lab-faixa").max = "40";
    painel.appendChild(campoA);
    painel.appendChild(campoB);

    var placar = el("div", "lab-placar");
    painel.appendChild(placar);

    var botoes = el("div", "lab-botoes");
    function botao(txt, aoClicar, cls) {
      var b = el("button", "lab-botao" + (cls ? " " + cls : ""), txt);
      b.type = "button";
      b.addEventListener("click", aoClicar);
      botoes.appendChild(b);
      return b;
    }
    botao("Ajustar automaticamente", function () {
      var o = ajusteOtimo(estado.pts);
      estado.a = Math.round(o.a * 1000) / 1000;
      estado.b = Math.round(o.b * 1000) / 1000;
      sincronizar();
      desenhar();
    }, "lab-botao-primario");
    var btOtima = botao("Revelar a reta ótima", function () {
      estado.otima = !estado.otima;
      btOtima.textContent = estado.otima ? "Esconder a reta ótima" : "Revelar a reta ótima";
      desenhar();
    });
    var btQuad = botao("Mostrar os quadrados", function () {
      estado.quadrados = !estado.quadrados;
      btQuad.textContent = estado.quadrados ? "Esconder os quadrados" : "Mostrar os quadrados";
      desenhar();
    });
    botao("Novos dados", function () {
      semente = (semente * 1664525 + 1013904223) >>> 0;
      estado.pts = gerarPontos(cfg, semente);
      desenhar();
    });
    painel.appendChild(botoes);

    var dica = el("p", "lab-dica",
      "Arraste as alças ● nas pontas da reta, ou use os campos acima. " +
      "Cada segmento cinza é um resíduo: a distância vertical do ponto até a sua reta.");
    painel.appendChild(dica);

    function sincronizar() {
      campoA.querySelector(".lab-num").value = String(estado.a);
      campoA.querySelector(".lab-faixa").value = String(estado.a);
      campoB.querySelector(".lab-num").value = String(estado.b);
      campoB.querySelector(".lab-faixa").value = String(estado.b);
    }

    // ---- escalas (recalculadas a cada desenho: os dados mudam) ----
    var esc = {};
    function escalas() {
      var xs = estado.pts.map(function (p) { return p.x; });
      var ys = estado.pts.map(function (p) { return p.y; });
      var m = 46;
      var x0 = 0, x1 = Math.max.apply(null, xs) + 1;
      var y0 = Math.min(0, Math.min.apply(null, ys) - 2);
      var y1 = Math.max.apply(null, ys) + 3;
      esc = {
        m: m, x0: x0, x1: x1, y0: y0, y1: y1,
        px: function (v) { return m + (v - x0) / (x1 - x0) * (canvas.width - 2 * m); },
        py: function (v) { return canvas.height - m - (v - y0) / (y1 - y0) * (canvas.height - 2 * m); },
        vx: function (p) { return x0 + (p - m) / (canvas.width - 2 * m) * (x1 - x0); },
        vy: function (p) { return y0 + (canvas.height - m - p) / (canvas.height - 2 * m) * (y1 - y0); },
      };
    }

    function alcas() {   // as duas pontas da reta, em pixels
      return [{ x: esc.x0, y: estado.a * esc.x0 + estado.b },
              { x: esc.x1, y: estado.a * esc.x1 + estado.b }];
    }

    // ---- arrastar direto na reta ----
    function posicao(ev) {
      var r = canvas.getBoundingClientRect();
      return { px: (ev.clientX - r.left) * (canvas.width / r.width),
               py: (ev.clientY - r.top) * (canvas.height / r.height) };
    }
    canvas.addEventListener("pointerdown", function (ev) {
      var p = posicao(ev), as = alcas();
      for (var i = 0; i < 2; i++) {
        var dx = p.px - esc.px(as[i].x), dy = p.py - esc.py(as[i].y);
        if (dx * dx + dy * dy < 400) {          // 20 px de raio
          estado.arrastando = i;
          canvas.setPointerCapture(ev.pointerId);
          ev.preventDefault();
          return;
        }
      }
    });
    canvas.addEventListener("pointermove", function (ev) {
      if (estado.arrastando === null) {
        var p0 = posicao(ev), a0 = alcas();
        var perto = a0.some(function (h) {
          var dx = p0.px - esc.px(h.x), dy = p0.py - esc.py(h.y);
          return dx * dx + dy * dy < 400;
        });
        canvas.style.cursor = perto ? "grab" : "default";
        return;
      }
      // a alça arrastada vai para o cursor; a outra fica onde está.
      // São dois pontos -> uma reta. É assim que o gesto muda a e b juntos.
      var p = posicao(ev);
      var fixa = alcas()[1 - estado.arrastando];
      var movel = { x: estado.arrastando === 0 ? esc.x0 : esc.x1, y: esc.vy(p.py) };
      var dxr = movel.x - fixa.x;
      if (Math.abs(dxr) > 1e-9) {
        estado.a = Math.round(((movel.y - fixa.y) / dxr) * 1000) / 1000;
        estado.b = Math.round((fixa.y - estado.a * fixa.x) * 1000) / 1000;
        sincronizar();
        desenhar();
      }
      ev.preventDefault();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (e) {
      canvas.addEventListener(e, function () { estado.arrastando = null; });
    });

    function fmt(v) {
      if (!isFinite(v)) return "—";
      return Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2);
    }

    function desenhar() {
      escalas();
      var ctx = canvas.getContext("2d");
      var W = canvas.width, H = canvas.height;
      var escuro = document.documentElement.getAttribute("data-tema") === "escuro";
      var corFundo = escuro ? "#1d1f22" : "#f7f7f5";
      var corEixo = escuro ? "#4a4d52" : "#c9c9c4";
      var corTexto = escuro ? "#9a9a97" : "#6a6a6a";
      var corPonto = escuro ? "#7db3d5" : "#2f6f9f";
      var corReta = "#e0a24a";
      var corOtima = escuro ? "#6fc08a" : "#2e8b57";
      var corResiduo = escuro ? "rgba(224,162,74,.45)" : "rgba(180,120,40,.45)";

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = corFundo;
      ctx.fillRect(0, 0, W, H);

      // eixos
      ctx.strokeStyle = corEixo;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(esc.m, esc.py(esc.y0)); ctx.lineTo(W - esc.m, esc.py(esc.y0));
      ctx.moveTo(esc.px(esc.x0), esc.m - 10); ctx.lineTo(esc.px(esc.x0), H - esc.m);
      ctx.stroke();
      ctx.fillStyle = corTexto;
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText("x", W - esc.m + 8, esc.py(esc.y0) + 4);
      ctx.fillText("y", esc.px(esc.x0) - 16, esc.m - 14);

      // quadrados do erro (a área É o erro quadrático)
      if (estado.quadrados) {
        ctx.fillStyle = escuro ? "rgba(224,162,74,.16)" : "rgba(224,162,74,.22)";
        ctx.strokeStyle = corResiduo;
        estado.pts.forEach(function (p) {
          var yr = estado.a * p.x + estado.b;
          var lado = Math.abs(esc.py(p.y) - esc.py(yr));
          var topo = Math.min(esc.py(p.y), esc.py(yr));
          ctx.fillRect(esc.px(p.x), topo, lado, lado);
          ctx.strokeRect(esc.px(p.x), topo, lado, lado);
        });
      }

      // resíduos
      ctx.strokeStyle = corResiduo;
      ctx.lineWidth = 1.5;
      estado.pts.forEach(function (p) {
        var yr = estado.a * p.x + estado.b;
        ctx.beginPath();
        ctx.moveTo(esc.px(p.x), esc.py(p.y));
        ctx.lineTo(esc.px(p.x), esc.py(yr));
        ctx.stroke();
      });

      // reta ótima
      if (estado.otima) {
        var o = ajusteOtimo(estado.pts);
        ctx.strokeStyle = corOtima;
        ctx.lineWidth = 2;
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        ctx.moveTo(esc.px(esc.x0), esc.py(o.a * esc.x0 + o.b));
        ctx.lineTo(esc.px(esc.x1), esc.py(o.a * esc.x1 + o.b));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // a reta do aluno
      ctx.strokeStyle = corReta;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(esc.px(esc.x0), esc.py(estado.a * esc.x0 + estado.b));
      ctx.lineTo(esc.px(esc.x1), esc.py(estado.a * esc.x1 + estado.b));
      ctx.stroke();

      // pontos
      estado.pts.forEach(function (p) {
        ctx.fillStyle = corPonto;
        ctx.beginPath();
        ctx.arc(esc.px(p.x), esc.py(p.y), 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // alças
      alcas().forEach(function (h) {
        ctx.fillStyle = corReta;
        ctx.strokeStyle = corFundo;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(esc.px(h.x), esc.py(h.y), 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // ---- placar ----
      var m = metricas(estado.pts, estado.a, estado.b);
      var o2 = ajusteOtimo(estado.pts);
      var mo = metricas(estado.pts, o2.a, o2.b);
      var linhas = [
        ["<b>EQM</b> — o que minimizamos", fmt(m.eqm), true],
        ["SQE — soma dos quadrados", fmt(m.sqe), false],
        ["RMSE — na unidade de y", fmt(m.rmse), false],
        ["EAM — erro absoluto médio", fmt(m.eam), false],
        ["R²", fmt(m.r2), false],
      ];
      var html = '<table class="lab-metricas"><tbody>';
      linhas.forEach(function (l) {
        html += '<tr class="' + (l[2] ? "lab-metrica-alvo" : "") + '"><th>' + l[0] +
                "</th><td>" + l[1] + "</td></tr>";
      });
      html += "</tbody></table>";
      var folga = m.eqm - mo.eqm;
      html += '<p class="lab-veredito">' + (folga < 1e-9
        ? "<b>Esta é a reta ótima.</b> Nenhuma outra reta tem EQM menor neste conjunto."
        : "O menor EQM possível aqui é <b>" + fmt(mo.eqm) + "</b>. Você está a " +
          fmt(folga) + " dele.") + "</p>";
      placar.innerHTML = html;
    }

    raiz.appendChild(corpo);
    sincronizar();
    desenhar();
    new MutationObserver(function () { desenhar(); }).observe(
      document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  }

  // ------------------------------------------------------------- registro

  var TIPOS = { "neuronio-mp": neuronioMP, "regressao-linear": regressaoLinear };

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
