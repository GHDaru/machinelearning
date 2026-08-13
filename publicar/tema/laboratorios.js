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


  // -------------------------------------------------- explorar uma variável

  /* Análise monovariada sobre o conjunto REAL do livro.

     O capítulo diz que a média mente e a mediana aguenta, que assimetria se vê
     no histograma e que outlier se define por critério declarado. Aqui o leitor
     troca de coluna e VÊ as três coisas mudarem — inclusive um caso em que a
     média e a mediana quase coincidem e outro em que não.

     Os dados vêm de `dados/limonada.csv`, publicado pelo build. Inventar
     números tiraria do laboratório exatamente o que ele ensina. */

  function quantil(ordenado, q) {           // interpolação linear (tipo 7, o do R e do numpy)
    if (!ordenado.length) return NaN;
    var pos = (ordenado.length - 1) * q;
    var base = Math.floor(pos), resto = pos - base;
    return ordenado[base + 1] !== undefined
      ? ordenado[base] + resto * (ordenado[base + 1] - ordenado[base])
      : ordenado[base];
  }

  function descritivas(vals) {
    var v = vals.slice().sort(function (a, b) { return a - b; });
    var n = v.length;
    var media = v.reduce(function (a, b) { return a + b; }, 0) / n;
    var q1 = quantil(v, 0.25), med = quantil(v, 0.5), q3 = quantil(v, 0.75);
    var iqr = q3 - q1;
    var dp = Math.sqrt(v.reduce(function (a, x) { return a + (x - media) * (x - media); }, 0) / n);
    var cont = {}, moda = null, maxc = 0;
    v.forEach(function (x) { cont[x] = (cont[x] || 0) + 1; if (cont[x] > maxc) { maxc = cont[x]; moda = x; } });
    var linf = q1 - 1.5 * iqr, lsup = q3 + 1.5 * iqr;
    return {
      n: n, media: media, mediana: med, moda: moda, moda_freq: maxc,
      min: v[0], max: v[n - 1], q1: q1, q3: q3, iqr: iqr, dp: dp,
      p10: quantil(v, 0.10), p90: quantil(v, 0.90),
      linf: linf, lsup: lsup,
      outliers: v.filter(function (x) { return x < linf || x > lsup; }),
      distintos: Object.keys(cont).length, ord: v,
    };
  }

  function explorarVariavel(raiz, cfg) {
    var COLUNAS = cfg.colunas || ["temperatura", "precipitacao", "panfletos", "preco", "vendas"];
    var estado = { coluna: COLUNAS[0], dados: null, bins: 12 };

    var corpo = el("div", "lab-corpo");
    var painel = el("div", "lab-painel");
    var visual = el("div", "lab-visual");
    corpo.appendChild(painel);
    corpo.appendChild(visual);

    var sel = document.createElement("select");
    sel.className = "lab-select";
    COLUNAS.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () { estado.coluna = sel.value; desenhar(); });
    var selWrap = el("label", "lab-campo");
    selWrap.appendChild(el("span", "lab-campo-rot", "Variável"));
    selWrap.appendChild(sel);
    painel.appendChild(selWrap);

    painel.appendChild(campo("classes do histograma", estado.bins, 1, function (v) {
      estado.bins = Math.max(3, Math.min(40, Math.round(v) || 12));
      desenhar();
    }));

    var placar = el("div", "lab-placar");
    painel.appendChild(placar);

    var canvas = document.createElement("canvas");
    canvas.width = 560; canvas.height = 420;
    canvas.className = "lab-canvas lab-canvas-larga";
    visual.appendChild(canvas);

    var aviso = el("p", "lab-dica", "Carregando o conjunto…");
    visual.appendChild(aviso);

    function desenhar() {
      if (!estado.dados) return;
      var vals = estado.dados.map(function (l) { return parseFloat(l[estado.coluna]); })
                             .filter(function (x) { return isFinite(x); });
      if (!vals.length) {                       // coluna ausente ou não numérica
        aviso.textContent = 'A coluna "' + estado.coluna + '" não tem valores numéricos legíveis.';
        placar.innerHTML = "";
        return;
      }
      var d = descritivas(vals);
      var ctx = canvas.getContext("2d");
      var W = canvas.width, H = canvas.height;
      var escuro = document.documentElement.getAttribute("data-tema") === "escuro";
      var corFundo = escuro ? "#1d1f22" : "#f7f7f5";
      var corEixo = escuro ? "#4a4d52" : "#c9c9c4";
      var corTexto = escuro ? "#9a9a97" : "#6a6a6a";
      var corBarra = escuro ? "rgba(125,179,213,.75)" : "rgba(47,111,159,.72)";
      var corMedia = "#e0a24a";
      var corMediana = escuro ? "#6fc08a" : "#2e8b57";

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = corFundo; ctx.fillRect(0, 0, W, H);

      var m = 48, hHist = 250, topoBox = hHist + 70;
      var lo = d.min, hi = d.max;
      if (hi === lo) { hi = lo + 1; }
      function px(v) { return m + (v - lo) / (hi - lo) * (W - 2 * m); }

      // ---- histograma ----
      var k = estado.bins, contagem = new Array(k).fill(0);
      vals.forEach(function (x) {
        var i = Math.min(k - 1, Math.floor((x - lo) / (hi - lo) * k));
        contagem[i]++;
      });
      var maxc = Math.max.apply(null, contagem);
      var larg = (W - 2 * m) / k;
      ctx.fillStyle = corBarra;
      contagem.forEach(function (c, i) {
        var h = (c / maxc) * (hHist - 40);
        ctx.fillRect(m + i * larg + 1, hHist - h, larg - 2, h);
      });
      ctx.strokeStyle = corEixo; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(m, hHist); ctx.lineTo(W - m, hHist); ctx.stroke();

      // média e mediana sobre o histograma
      [[d.media, corMedia, "media"], [d.mediana, corMediana, "mediana"]].forEach(function (t, i) {
        ctx.strokeStyle = t[1]; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(px(t[0]), 18); ctx.lineTo(px(t[0]), hHist); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = t[1]; ctx.font = "12px system-ui, sans-serif";
        ctx.fillText(t[2], px(t[0]) + 4, 16 + i * 14);
      });

      // ---- boxplot ----
      var yb = topoBox, alt = 46;
      ctx.strokeStyle = corEixo; ctx.lineWidth = 1.5;
      // bigodes: até o ponto mais extremo DENTRO da cerca
      var dentro = d.ord.filter(function (x) { return x >= d.linf && x <= d.lsup; });
      var bmin = dentro.length ? dentro[0] : d.min;
      var bmax = dentro.length ? dentro[dentro.length - 1] : d.max;
      ctx.beginPath();
      ctx.moveTo(px(bmin), yb + alt / 2); ctx.lineTo(px(d.q1), yb + alt / 2);
      ctx.moveTo(px(d.q3), yb + alt / 2); ctx.lineTo(px(bmax), yb + alt / 2);
      ctx.moveTo(px(bmin), yb + 10); ctx.lineTo(px(bmin), yb + alt - 10);
      ctx.moveTo(px(bmax), yb + 10); ctx.lineTo(px(bmax), yb + alt - 10);
      ctx.stroke();
      ctx.fillStyle = escuro ? "rgba(125,179,213,.28)" : "rgba(47,111,159,.20)";
      ctx.fillRect(px(d.q1), yb, px(d.q3) - px(d.q1), alt);
      ctx.strokeStyle = corEixo;
      ctx.strokeRect(px(d.q1), yb, px(d.q3) - px(d.q1), alt);
      ctx.strokeStyle = corMediana; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px(d.mediana), yb); ctx.lineTo(px(d.mediana), yb + alt); ctx.stroke();
      ctx.fillStyle = "#c0392b";
      d.outliers.forEach(function (x) {
        ctx.beginPath(); ctx.arc(px(x), yb + alt / 2, 3.5, 0, Math.PI * 2); ctx.fill();
      });

      ctx.fillStyle = corTexto; ctx.font = "12px system-ui, sans-serif";
      // Caixa degenerada (IQR = 0) empilharia os dois rótulos no mesmo pixel.
      // Um rótulo só, dizendo o que aconteceu, ensina mais que dois ilegíveis.
      if (px(d.q3) - px(d.q1) < 24) {
        ctx.fillText("Q1 = Q3", px(d.q1) - 20, yb - 6);
      } else {
        ctx.fillText("Q1", px(d.q1) - 8, yb - 6);
        ctx.fillText("Q3", px(d.q3) - 8, yb - 6);
      }
      ctx.fillText("P50", px(d.mediana) - 10, yb + alt + 16);
      ctx.fillText(lo.toFixed(1), m - 4, hHist + 18);
      ctx.fillText(hi.toFixed(1), W - m - 20, hHist + 18);

      // ---- placar ----
      function f(v) { return isFinite(v) ? (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2)) : "—"; }
      var assim = d.media - d.mediana;
      var lado = Math.abs(assim) < 0.02 * (d.max - d.min) ? "aproximadamente simétrica"
               : (assim > 0 ? "assimétrica à <b>direita</b> (média &gt; mediana)"
                            : "assimétrica à <b>esquerda</b> (média &lt; mediana)");
      placar.innerHTML =
        '<table class="lab-metricas"><tbody>' +
        "<tr><th>n</th><td>" + d.n + "</td></tr>" +
        "<tr><th>valores distintos</th><td>" + d.distintos + "</td></tr>" +
        '<tr class="lab-metrica-alvo"><th>média</th><td>' + f(d.media) + "</td></tr>" +
        '<tr class="lab-metrica-alvo"><th>mediana (P50)</th><td>' + f(d.mediana) + "</td></tr>" +
        "<tr><th>moda</th><td>" + f(d.moda) + " (×" + d.moda_freq + ")</td></tr>" +
        "<tr><th>desvio-padrão</th><td>" + f(d.dp) + "</td></tr>" +
        "<tr><th>mínimo · máximo</th><td>" + f(d.min) + " · " + f(d.max) + "</td></tr>" +
        "<tr><th>Q1 · Q3</th><td>" + f(d.q1) + " · " + f(d.q3) + "</td></tr>" +
        "<tr><th>IQR</th><td>" + f(d.iqr) + "</td></tr>" +
        "<tr><th>P10 · P90</th><td>" + f(d.p10) + " · " + f(d.p90) + "</td></tr>" +
        "<tr><th>cerca (1,5 × IQR)</th><td>" + f(d.linf) + " · " + f(d.lsup) + "</td></tr>" +
        "<tr><th>outliers</th><td>" + d.outliers.length + "</td></tr>" +
        "</tbody></table>" +
        '<p class="lab-veredito">Distribuição ' + lado + ". " +
        (d.outliers.length
          ? "<b>" + d.outliers.length + "</b> ponto(s) fora da cerca de 1,5 × IQR — em vermelho no boxplot."
          : "Nenhum ponto fora da cerca de 1,5 × IQR.") + "</p>";
      aviso.textContent = "Histograma em cima, boxplot embaixo, na mesma escala horizontal. " +
        "A linha tracejada laranja é a média; a verde, a mediana.";
    }

    raiz.appendChild(corpo);

    var caminho = cfg.dados || "dados/limonada.csv";
    fetch(caminho).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (txt) {
      // `.trim()` em cada campo, e não só na string inteira: com terminador
      // CRLF, o `\r` fica colado no ÚLTIMO nome de coluna, e a chave vira
      // "vendas\r". O acesso a `l["vendas"]` devolvia undefined, a coluna
      // inteira virava NaN — e o painel continuava exibindo os números da
      // coluna anterior, porque o desenho quebrava antes de atualizá-lo.
      // Valor errado exibido com confiança é pior que erro na tela.
      var linhas = txt.trim().split(/\r?\n/);
      var cab = linhas[0].split(",").map(function (c) { return c.trim(); });
      estado.dados = linhas.slice(1).map(function (l) {
        var v = l.split(","), o = {};
        cab.forEach(function (c, i) { o[c] = (v[i] || "").trim(); });
        return o;
      });
      desenhar();
    }).catch(function () {
      aviso.textContent = "Não consegui carregar " + caminho +
        ". Abrindo o arquivo direto do disco (file://) o navegador bloqueia a leitura — " +
        "use o livro publicado, ou sirva a pasta com um servidor local.";
    });

    new MutationObserver(function () { desenhar(); }).observe(
      document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  }

  // ------------------------------------------------- núcleo das animações
  //
  // Extraído na SEGUNDA animação, não na oitava (ADR 0015). Duas
  // implementações já bastam para mostrar o que é comum e o que não é; oito
  // teriam consolidado a duplicação antes de alguém olhar para ela.
  //
  // O que entra aqui é o que as duas repetiam palavra por palavra: descobrir o
  // tema, montar canvas com escala, o placar que fala por quem não enxerga o
  // canvas, e o relógio — que é a peça com mais história. Ele carrega três
  // decisões que custaram caro e que nenhuma animação nova deveria ter de
  // redescobrir:
  //
  //   1. só começa quando o leitor CHEGA (IntersectionObserver). Sem isto a
  //      animação rodava no load, terminava em 4 segundos, e quem descia até
  //      ela minutos depois achava um quadro congelado — imagem estática se
  //      passando por animação;
  //   2. quem pediu `prefers-reduced-motion` recebe o RESULTADO, não a
  //      ausência de resultado: roda tudo de uma vez e desenha o fim;
  //   3. trocar o tema no meio redesenha, senão as cores do tema anterior ficam.

  function temaEscuro() {
    return document.documentElement.getAttribute("data-tema") === "escuro" ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  /** Canvas + escala + moldura. `esc(v, px)` leva coordenada do plano a pixel. */
  function tela(area, W, H, PAD, LIM) {
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H; cv.className = "lab-canvas";
    cv.setAttribute("role", "img");
    area.appendChild(cv);
    var ctx = cv.getContext("2d");
    return {
      cv: cv, ctx: ctx, W: W, H: H, PAD: PAD, LIM: LIM,
      esc: function (v, px) { return PAD + (v + LIM) / (2 * LIM) * (px - 2 * PAD); },
      fundo: function (escuro) {
        ctx.fillStyle = escuro ? "#1a1b1e" : "#faf9f7";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = escuro ? "#3a3b3f" : "#dcdbd7";
        ctx.lineWidth = 1;
        ctx.strokeRect(PAD, PAD, W - 2 * PAD, H - 2 * PAD);
      }
    };
  }

  /** Placar com `aria-live`: o canvas é role=img, então quem não enxerga lê aqui. */
  function placarDe(area) {
    var p = el("div", "lab-placar");
    p.setAttribute("aria-live", "polite");
    p.setAttribute("role", "status");
    area.appendChild(p);
    return p;
  }

  function botoeiraDe(area) {
    var box = el("div", "lab-botoes");
    area.appendChild(box);
    return function (txt, fn) {
      var b = el("button", "lab-botao", txt);
      b.type = "button";
      b.addEventListener("click", fn);
      box.appendChild(b);
      return b;
    };
  }

  /** O relógio da animação, com as três decisões acima embutidas.
   *  `passo()` avança um quadro e devolve `true` quando acabou. */
  function relogio(cv, passo, aoDesenhar, ms) {
    var calmo = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var timer = null;
    function parar() { if (timer) { clearInterval(timer); timer = null; } }
    var api = {
      rodando: function () { return !!timer; },
      parar: parar,
      // `tetoCalmo` limita o adiantamento de quem não quer movimento — um laço
      // que nunca termina (o XOR não termina) travaria a página sem ele.
      comecar: function (tetoCalmo) {
        parar();
        if (calmo) {
          for (var k = 0; k < (tetoCalmo || 2000); k++) if (passo()) break;
          aoDesenhar();
          return false;                       // não ficou rodando
        }
        timer = setInterval(function () {
          if (passo()) parar();
        }, ms || 55);
        return true;
      }
    };
    if (window.MutationObserver) {
      new MutationObserver(aoDesenhar).observe(
        document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
    }
    api.aoChegar = function (fn) {
      if (!window.IntersectionObserver) { fn(); return; }
      var visto = false;
      var obs = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting && !visto) { visto = true; obs.disconnect(); fn(); }
        });
      }, { threshold: 0.4 });
      obs.observe(cv);
    };
    return api;
  }

  // ------------------------------------------------------------- registro

  // A animação é a quarta superfície, e a mais barata: o leitor não manipula,
  // ele ASSISTE o método corrigir o próprio erro. A regra aqui é a de 1958,
  // como o capítulo a enuncia: para cada exemplo errado, empurre os pesos na
  // direção dele.
  //
  // O botão do XOR existe porque a animação sozinha contaria meia verdade. Com
  // dados separáveis a reta assenta; com XOR ela nunca para. Ver a fronteira
  // oscilando sem fim ensina o limite melhor que o parágrafo sobre ele.
  function animaPerceptron(area, cfg) {
    var W = 460, H = 300, PAD = 28, LIM = 2.6;
    var t = tela(area, W, H, PAD, LIM);
    var cv = t.cv, ctx = t.ctx, esc = t.esc;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel;
    var est = { pts: [], w: [0, 0], b: 0, i: 0, epoca: 0, erros: 0, xor: false, parou: false };

    function dados(xor) {
      var r = rng(Number(cfg.semente) || 7), p = [], k;
      if (xor) {
        [[-1, -1, 1], [1, 1, 1], [-1, 1, -1], [1, -1, -1]].forEach(function (c) {
          for (k = 0; k < 9; k++) p.push({ x: c[0] + (r() - .5) * .7, y: c[1] + (r() - .5) * .7, t: c[2] });
        });
      } else {
        for (k = 0; k < 36; k++) {
          var t = k % 2 ? 1 : -1;
          p.push({ x: t * .9 + (r() - .5) * 1.5, y: t * .8 + (r() - .5) * 1.5, t: t });
        }
      }
      return p;
    }

    function desenhar() {
      var escuro = temaEscuro();
      t.fundo(escuro);

      if (Math.abs(est.w[1]) > 1e-6) {   // w0*x + w1*y + b = 0
        var y1 = (-est.b - est.w[0] * -LIM) / est.w[1], y2 = (-est.b - est.w[0] * LIM) / est.w[1];
        ctx.strokeStyle = escuro ? "#e6e6e4" : "#1c1c1c";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(esc(-LIM, W), H - esc(y1, H));
        ctx.lineTo(esc(LIM, W), H - esc(y2, H));
        ctx.stroke();
      }
      est.pts.forEach(function (p, k) {
        ctx.fillStyle = p.t > 0 ? (escuro ? "#8fb8dd" : "#35618e") : (escuro ? "#e0a24a" : "#b8761f");
        ctx.beginPath();
        ctx.arc(esc(p.x, W), H - esc(p.y, H), (k === est.i && !est.parou) ? 6.5 : 4, 0, 6.2832);
        ctx.fill();
        if (k === est.i && !est.parou) {
          ctx.strokeStyle = escuro ? "#e6e6e4" : "#1c1c1c"; ctx.lineWidth = 1.5; ctx.stroke();
        }
      });
    }

    function texto() {
      placar.textContent = est.xor
        ? "XOR · época " + est.epoca + " · " + est.erros + " erros nesta passada, e não vai zerar"
        : "época " + est.epoca + " · " + est.erros + " erros nesta passada" + (est.parou ? " · convergiu" : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var p = est.pts[est.i];
      if (((est.w[0] * p.x + est.w[1] * p.y + est.b) >= 0 ? 1 : -1) !== p.t) {
        est.w[0] += 0.1 * p.t * p.x; est.w[1] += 0.1 * p.t * p.y; est.b += 0.1 * p.t;
        est.erros++;
      }
      est.i++;
      if (est.i >= est.pts.length) {
        est.i = 0; est.epoca++;
        if (est.erros === 0) est.parou = true; else est.erros = 0;
        // 8 épocas bastam: um contador de erros que não desce já disse tudo.
        // Com a trava anterior (60) o XOR rodava ~2 minutos, e ninguém espera.
        if (est.epoca > 8) est.parou = true;
      }
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(xor) {
      est.xor = !!xor; est.pts = dados(est.xor);
      est.w = [0, 0]; est.b = 0; est.i = 0; est.epoca = 0; est.erros = 0; est.parou = false;
      rel.comecar(est.pts.length * 61);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    var bRodar, bXor;
    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bXor.textContent = est.xor ? "Voltar aos dados separáveis" : "E se os dados forem XOR?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.xor); });
    bXor = botao("E se os dados forem XOR?", function () { rodar(!est.xor); });

    rel = relogio(cv, passo, function () { desenhar(); }, 55);
    est.pts = dados(false); desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }

  // Segunda animação (ADR 0015), e a que fecha o arco que a primeira abriu.
  // Lá o perceptron oscila para sempre no XOR; aqui uma camada escondida com
  // dois neurônios resolve o mesmo XOR, e o que se vê é POR QUE ela resolve:
  // duas retas girando até que a combinação delas recorte o quadrado.
  //
  // A rede é 2-2-1 com tanh e gradiente completo, escrita à mão — a mesma que
  // a etapa 09 do ml-zero constrói em NumPy.
  //
  // O terceiro botão nasceu de um achado ao TESTAR esta animação, não de um
  // plano. A primeira semente escolhida a esmo caía num mínimo local e travava
  // em ~25 de 48, com a perda parada em ln(2)/2 — a animação prometia "assista
  // fechar" e não fechava. Varrendo 60 inicializações sobre o MESMO dado:
  // 44 resolvem, 16 não. O gradiente está certo; o que muda é de onde ele
  // parte. É exatamente o modo de falha "inicialização ruim" do objetivo O4
  // deste capítulo, então em vez de trocar a semente e esconder o achado, a
  // semente ruim virou botão.
  //
  // Detalhe que o teste também expôs: o mínimo local é do PAR (dado, início),
  // não do início sozinho. Ao fixar o dado e variar só a inicialização, a
  // semente que falhava passou a resolver. Por isso `dados()` usa sempre
  // SEM_BOA: com o dado fixo, o botão isola a variável que ele diz isolar.
  function animaMLPXor(area, cfg) {
    var W = 460, H = 300, PAD = 28, LIM = 1.7;
    var t = tela(area, W, H, PAD, LIM);
    var cv = t.cv, ctx = t.ctx, esc = t.esc;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bCamada, bRuim;
    var TETO = 250;                       // ~14 s; a semente boa fecha em 142
    var SEM_BOA = Number(cfg.semente) || 6;
    var SEM_RUIM = Number(cfg.semente_ruim) || 1;
    var est = { pts: [], W1: null, b1: null, W2: null, b2: null,
                epoca: 0, perda: 1, semCamada: false, ruim: false, parou: false };

    function semente() { return est.ruim ? SEM_RUIM : SEM_BOA; }

    function dados() {
      var r = rng(SEM_BOA), p = [], k;    // o dado é o MESMO nas duas: o que
      [[-1, -1, 0], [1, 1, 0], [-1, 1, 1], [1, -1, 1]].forEach(function (c) {
        for (k = 0; k < 12; k++) {        // muda entre elas é só de onde a
          p.push({ x: c[0] * .8 + (r() - .5) * .5,   // descida parte
                   y: c[1] * .8 + (r() - .5) * .5, t: c[2] });
        }
      });
      return p;
    }

    function iniciarPesos() {
      var r = rng(semente() + 3);
      est.W1 = [[r() * 2 - 1, r() * 2 - 1], [r() * 2 - 1, r() * 2 - 1]];
      est.b1 = [0, 0];
      est.W2 = [r() * 2 - 1, r() * 2 - 1];
      est.b2 = 0;
    }

    function sig(z) { return 1 / (1 + Math.exp(-z)); }

    /** Passagem à frente. Sem camada escondida, h = x: vira um neurônio só. */
    function frente(p) {
      var z1 = [est.W1[0][0] * p.x + est.W1[0][1] * p.y + est.b1[0],
                est.W1[1][0] * p.x + est.W1[1][1] * p.y + est.b1[1]];
      var h = est.semCamada ? [p.x, p.y] : [Math.tanh(z1[0]), Math.tanh(z1[1])];
      var z2 = est.W2[0] * h[0] + est.W2[1] * h[1] + est.b2;
      return { z1: z1, h: h, y: sig(z2) };
    }

    function epoca() {
      var n = est.pts.length, eta = 5, perda = 0;
      var gW1 = [[0, 0], [0, 0]], gb1 = [0, 0], gW2 = [0, 0], gb2 = 0;
      est.pts.forEach(function (p) {
        var f = frente(p), d2 = f.y - p.t;   // derivada da entropia cruzada com sigmoide
        perda += -(p.t * Math.log(f.y + 1e-9) + (1 - p.t) * Math.log(1 - f.y + 1e-9));
        gW2[0] += d2 * f.h[0]; gW2[1] += d2 * f.h[1]; gb2 += d2;
        if (!est.semCamada) {
          for (var j = 0; j < 2; j++) {
            var d1 = d2 * est.W2[j] * (1 - f.h[j] * f.h[j]);   // derivada da tanh
            gW1[j][0] += d1 * p.x; gW1[j][1] += d1 * p.y; gb1[j] += d1;
          }
        }
      });
      est.W2[0] -= eta * gW2[0] / n; est.W2[1] -= eta * gW2[1] / n; est.b2 -= eta * gb2 / n;
      if (!est.semCamada) {
        for (var j = 0; j < 2; j++) {
          est.W1[j][0] -= eta * gW1[j][0] / n; est.W1[j][1] -= eta * gW1[j][1] / n;
          est.b1[j] -= eta * gb1[j] / n;
        }
      }
      est.perda = perda / n;
      est.epoca++;
    }

    function acertos() {
      var c = 0;
      est.pts.forEach(function (p) { if ((frente(p).y >= 0.5 ? 1 : 0) === p.t) c++; });
      return c;
    }

    function reta(w0, w1, b, cor) {
      if (Math.abs(w1) < 1e-6) return;
      var y1 = (-b - w0 * -LIM) / w1, y2 = (-b - w0 * LIM) / w1;
      ctx.strokeStyle = cor; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(esc(-LIM, W), H - esc(y1, H));
      ctx.lineTo(esc(LIM, W), H - esc(y2, H));
      ctx.stroke();
    }

    function desenhar() {
      var escuro = temaEscuro();
      t.fundo(escuro);
      // As duas retas da camada escondida são o conteúdo da animação: é vendo
      // as DUAS girarem que se entende que a solução não é uma fronteira
      // curva, e sim duas fronteiras retas combinadas.
      if (!est.semCamada) {
        reta(est.W1[0][0], est.W1[0][1], est.b1[0], escuro ? "#8fb8dd" : "#35618e");
        reta(est.W1[1][0], est.W1[1][1], est.b1[1], escuro ? "#e0a24a" : "#b8761f");
      }
      est.pts.forEach(function (p) {
        var certo = (frente(p).y >= 0.5 ? 1 : 0) === p.t;
        ctx.fillStyle = p.t ? (escuro ? "#8fb8dd" : "#35618e") : (escuro ? "#e0a24a" : "#b8761f");
        ctx.beginPath();
        ctx.arc(esc(p.x, W), H - esc(p.y, H), certo ? 4 : 6, 0, 6.2832);
        ctx.fill();
        if (!certo) {                       // errado ganha contorno: dá para
          ctx.strokeStyle = escuro ? "#e6e6e4" : "#1c1c1c";   // contar no olho
          ctx.lineWidth = 1.5; ctx.stroke();
        }
      });
    }

    function texto() {
      var a = acertos(), n = est.pts.length;
      var cabeca = est.semCamada ? "sem camada escondida"
                 : est.ruim ? "camada escondida, e uma inicialização infeliz"
                 : "camada escondida com 2 neurônios";
      placar.textContent = cabeca +
        " · época " + est.epoca + " · perda " + est.perda.toFixed(3) +
        " · " + a + " de " + n + " certos" +
        (est.parou ? (a === n ? " · resolveu" : " · empacou, e não vai sair daqui") : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      epoca();
      if (est.epoca >= TETO || (acertos() === est.pts.length && est.perda < 0.05)) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(opc) {
      est.semCamada = !!opc.semCamada;
      est.ruim = !!opc.ruim;
      est.pts = dados(); iniciarPesos();
      est.epoca = 0; est.perda = 1; est.parou = false;
      rel.comecar(TETO);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bCamada.textContent = est.semCamada ? "Devolver a camada escondida" : "E sem a camada escondida?";
      bRuim.textContent = est.ruim ? "Voltar à inicialização boa" : "E se a inicialização for infeliz?";
    }
    bRodar = botao("Rodar de novo", function () { rodar({ semCamada: est.semCamada, ruim: est.ruim }); });
    bCamada = botao("E sem a camada escondida?", function () { rodar({ semCamada: !est.semCamada }); });
    bRuim = botao("E se a inicialização for infeliz?", function () { rodar({ ruim: !est.ruim }); });

    rel = relogio(cv, passo, function () { desenhar(); }, 55);
    est.pts = dados(); iniciarPesos(); desenhar(); texto();
    rel.aoChegar(function () { rodar({}); });
  }

  // Terceira animação, e a primeira de outra família: as duas anteriores são
  // "laço de descida com placar", esta é "particionar e recalcular critério".
  // Serviu de teste do núcleo — `tela`, `placarDe`, `botoeiraDe` e `relogio`
  // vieram inteiros, e o que ela precisou acrescentar foi só o que é dela.
  //
  // O que ela ensina é o mais difícil do capítulo: método correto, execução
  // correta, resposta errada, e só a semente mudou. É o mesmo fenômeno que a
  // animação do III.2 produziu por acidente, aqui de propósito.
  function animaKMeans(area, cfg) {
    var W = 460, H = 300, PAD = 24, LIM = 1.15;
    var t = tela(area, W, H, PAD, LIM);
    var cv = t.cv, ctx = t.ctx, esc = t.esc;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bRuim;
    var K = 3, TETO = 40;
    var SEM_BOA = Number(cfg.semente) || 5;
    var SEM_RUIM = Number(cfg.semente_ruim) || 29;
    var est = { pts: [], cen: [], atrib: [], it: 0, inercia: 0, antes: -1,
                ruim: false, parou: false, fase: "atribuir" };

    var CORES_C = ["#35618e", "#b8761f", "#4a7c59"];
    var CORES_E = ["#8fb8dd", "#e0a24a", "#87b89a"];

    // Três grupos bem separados: com estrutura tão clara, uma partição ruim
    // não pode ser desculpada por "o dado é ambíguo".
    function dados() {
      var r = rng(41), p = [], c = [[-.65, -.5], [.65, -.5], [0, .62]], k, g;
      for (g = 0; g < 3; g++) {
        for (k = 0; k < 26; k++) {
          p.push({ x: c[g][0] + (r() - .5) * .42, y: c[g][1] + (r() - .5) * .42 });
        }
      }
      return p;
    }

    /** Centros iniciais sorteados entre os próprios pontos (Forgy). */
    function iniciarCentros() {
      var r = rng(est.ruim ? SEM_RUIM : SEM_BOA), esc2 = [], k, i;
      for (k = 0; k < K; k++) {
        do { i = Math.floor(r() * est.pts.length); } while (esc2.indexOf(i) >= 0);
        esc2.push(i);
      }
      return esc2.map(function (i) { return { x: est.pts[i].x, y: est.pts[i].y }; });
    }

    function d2(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }

    function atribuir() {
      var mudou = false;
      est.pts.forEach(function (p, i) {
        var melhor = 0, md = Infinity;
        est.cen.forEach(function (c, j) { var d = d2(p, c); if (d < md) { md = d; melhor = j; } });
        if (est.atrib[i] !== melhor) mudou = true;
        est.atrib[i] = melhor;
      });
      return mudou;
    }

    function recentrar() {
      var sx = [], sy = [], n = [], j;
      for (j = 0; j < K; j++) { sx.push(0); sy.push(0); n.push(0); }
      est.pts.forEach(function (p, i) {
        var g = est.atrib[i]; sx[g] += p.x; sy[g] += p.y; n[g]++;
      });
      for (j = 0; j < K; j++) if (n[j]) est.cen[j] = { x: sx[j] / n[j], y: sy[j] / n[j] };
    }

    function inercia() {
      var s = 0;
      est.pts.forEach(function (p, i) { s += d2(p, est.cen[est.atrib[i]]); });
      return s;
    }

    function desenhar() {
      var escuro = temaEscuro();
      t.fundo(escuro);
      est.pts.forEach(function (p, i) {
        var g = est.atrib[i];
        ctx.fillStyle = g == null ? (escuro ? "#7a7b7f" : "#9a9a97")
                                  : (escuro ? CORES_E[g] : CORES_C[g]);
        ctx.beginPath();
        ctx.arc(esc(p.x, W), H - esc(p.y, H), 3.4, 0, 6.2832);
        ctx.fill();
      });
      // O centro é desenhado como cruz, e não como bola: ele não é um ponto do
      // dado, e confundir os dois é o mal-entendido mais comum do método.
      est.cen.forEach(function (c, j) {
        ctx.strokeStyle = escuro ? CORES_E[j] : CORES_C[j];
        ctx.lineWidth = 3;
        var x = esc(c.x, W), y = H - esc(c.y, H);
        ctx.beginPath();
        ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y);
        ctx.moveTo(x, y - 7); ctx.lineTo(x, y + 7);
        ctx.stroke();
      });
    }

    function texto() {
      placar.textContent = (est.ruim ? "semente infeliz · " : "") +
        "iteração " + est.it + " · " + (est.fase === "atribuir" ? "atribuir" : "recentrar") +
        " · inércia " + est.inercia.toFixed(3) +
        (est.parou ? " · estabilizou" : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    // Um passo do relógio é meia iteração, de propósito: ver "atribuir" e
    // "recentrar" separados é o que mostra que o método são DOIS movimentos
    // alternando, e não uma caixa que devolve grupos.
    function passo() {
      if (est.fase === "atribuir") {
        var mudou = atribuir();
        est.inercia = inercia();
        est.fase = "recentrar";
        if (!mudou && est.it > 0) est.parou = true;
      } else {
        recentrar();
        est.inercia = inercia();
        est.fase = "atribuir";
        est.it++;
        if (est.it >= TETO) est.parou = true;
      }
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(opc) {
      est.ruim = !!opc.ruim;
      est.pts = dados();
      est.atrib = est.pts.map(function () { return null; });
      est.cen = iniciarCentros();
      est.it = 0; est.inercia = 0; est.parou = false; est.fase = "atribuir";
      rel.comecar(TETO * 2);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bRuim.textContent = est.ruim ? "Voltar à semente boa" : "E se a semente for outra?";
    }
    bRodar = botao("Rodar de novo", function () { rodar({ ruim: est.ruim }); });
    bRuim = botao("E se a semente for outra?", function () { rodar({ ruim: !est.ruim }); });

    rel = relogio(cv, passo, function () { desenhar(); }, 320);
    est.pts = dados();
    est.atrib = est.pts.map(function () { return null; });
    est.cen = iniciarCentros();
    desenhar(); texto();
    rel.aoChegar(function () { rodar({}); });
  }

  // Quarta animação, e a terceira família: "limiar sobre scores fixos". Nada é
  // treinado aqui — os escores existem desde o começo, e a única coisa que se
  // move é onde se corta o do grupo A.
  //
  // O que ela mostra é um teorema, não um comportamento: com prevalências
  // diferentes, dois dos três critérios podem ficar verdes ao mesmo tempo, e os
  // três nunca. O botão devolve as prevalências iguais e o terceiro acende.
  //
  // Dois cuidados que a construção exigiu, e que o teste guarda:
  //
  // 1. Os dois grupos são CALIBRADOS por construção — sorteia-se o escore e
  //    depois y ~ Bernoulli(escore). Sem isso, a "calibração" mediria artefato
  //    da geração do dado em vez da premissa do teorema. A primeira versão
  //    errava aqui, e o resultado dava no máximo UM verde.
  // 2. A varredura fica na faixa de operação (0,25 a 0,75). Fora dela as duas
  //    métricas colapsam para perto de zero e "casam" trivialmente — um limiar
  //    que quase não classifica ninguém satisfaz quase tudo, e exibir isso como
  //    solução ensinaria o contrário do capítulo.
  function animaJustica(area, cfg) {
    var W = 460, H = 300, PAD = 26, LIM = 1;
    var t = tela(area, W, H, PAD, LIM);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bIguais;
    var TOL = 0.03, T_MIN = 0.25, T_MAX = 0.75, PASSO = 0.01, T_B = 0.5;
    var est = { A: [], B: [], tA: T_MAX, mB: null, iguais: false, parou: false, melhor: null };

    function gera(sem, n, desloc) {
      var r = rng(sem), p = [], i, s;
      for (i = 0; i < n; i++) {
        s = (r() + r() + r()) / 3;
        s = Math.min(0.97, Math.max(0.03, s + desloc));
        p.push({ s: s, y: r() < s ? 1 : 0 });
      }
      return p;
    }

    function met(g, lim) {
      var tp = 0, fp = 0, fn = 0;
      g.forEach(function (p) {
        var q = p.s >= lim ? 1 : 0;
        if (q && p.y) tp++; else if (q && !p.y) fp++; else if (!q && p.y) fn++;
      });
      return { taxaPos: (tp + fp) / g.length, tpr: tp / (tp + fn || 1) };
    }

    function luzes() {
      var mA = met(est.A, est.tA);
      return {
        mA: mA,
        par: Math.abs(mA.taxaPos - est.mB.taxaPos) <= TOL,
        opo: Math.abs(mA.tpr - est.mB.tpr) <= TOL,
        cal: true                     // premissa: os dois grupos são calibrados
      };
    }

    function prev(g) { var c = 0; g.forEach(function (p) { if (p.y) c++; }); return c / g.length; }

    function faixa(g, y0, lim, escuro) {
      var x0 = PAD, larg = W - 2 * PAD;
      g.forEach(function (p, i) {
        ctx.fillStyle = p.y ? (escuro ? "#8fb8dd" : "#35618e")
                            : (escuro ? "#e0a24a" : "#b8761f");
        ctx.beginPath();
        ctx.arc(x0 + p.s * larg, y0 + ((i * 7) % 34), 1.7, 0, 6.2832);
        ctx.fill();
      });
      ctx.strokeStyle = escuro ? "#e6e6e4" : "#1c1c1c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0 + lim * larg, y0 - 8);
      ctx.lineTo(x0 + lim * larg, y0 + 42);
      ctx.stroke();
    }

    function desenhar() {
      var escuro = temaEscuro(), l = luzes();
      t.fundo(escuro);
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("grupo A · prevalência " + prev(est.A).toFixed(2), PAD, PAD + 14);
      faixa(est.A, PAD + 30, est.tA, escuro);
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("grupo B · prevalência " + prev(est.B).toFixed(2), PAD, PAD + 108);
      faixa(est.B, PAD + 124, T_B, escuro);

      var rot = ["paridade", "oportunidade", "calibração"];
      var ok = [l.par, l.opo, l.cal];
      rot.forEach(function (r, j) {
        var x = PAD + j * 140, y = H - PAD - 6;
        ctx.fillStyle = ok[j] ? (escuro ? "#87b89a" : "#2f7d4f")
                              : (escuro ? "#d98a8a" : "#a83232");
        ctx.beginPath(); ctx.arc(x + 6, y - 4, 5, 0, 6.2832); ctx.fill();
        ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
        ctx.fillText(r, x + 17, y);
      });
    }

    function texto() {
      var l = luzes(), n = (l.par ? 1 : 0) + (l.opo ? 1 : 0) + 1;
      placar.textContent =
        (est.iguais ? "prevalências iguais · " : "prevalências diferentes · ") +
        "limiar de A em " + est.tA.toFixed(2) +
        " · taxa de positivos " + l.mA.taxaPos.toFixed(3) + " contra " + est.mB.taxaPos.toFixed(3) +
        " · revocação " + l.mA.tpr.toFixed(3) + " contra " + est.mB.tpr.toFixed(3) +
        " · " + n + " de 3 critérios" +
        (est.parou ? " · melhor que deu: " + est.melhor + " de 3" : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var l = luzes(), n = (l.par ? 1 : 0) + (l.opo ? 1 : 0) + 1;
      if (est.melhor == null || n > est.melhor) est.melhor = n;
      est.tA -= PASSO;
      if (est.tA < T_MIN - 1e-9) { est.tA = T_MIN; est.parou = true; }
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(opc) {
      est.iguais = !!opc.iguais;
      var d = est.iguais ? 0 : 0.13;
      est.A = gera(11, 900, d);
      est.B = gera(23, 900, -d);
      est.mB = met(est.B, T_B);
      est.tA = T_MAX; est.parou = false; est.melhor = null;
      rel.comecar(Math.ceil((T_MAX - T_MIN) / PASSO) + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bIguais.textContent = est.iguais ? "Voltar às prevalências diferentes"
                                       : "E se as prevalências fossem iguais?";
    }
    bRodar = botao("Rodar de novo", function () { rodar({ iguais: est.iguais }); });
    bIguais = botao("E se as prevalências fossem iguais?", function () { rodar({ iguais: !est.iguais }); });

    rel = relogio(cv, passo, function () { desenhar(); }, 90);
    est.A = gera(11, 900, 0.13); est.B = gera(23, 900, -0.13);
    est.mB = met(est.B, T_B);
    desenhar(); texto();
    rel.aoChegar(function () { rodar({}); });
  }

  // A animação da tese do livro: viés e variância, com o grau do polinômio
  // subindo de 1 a 15. A tabela do capítulo mostra dois números; aqui se vê o
  // INSTANTE em que um deles vira para cima enquanto o outro continua caindo.
  // É o único lugar do livro em que o cruzamento acontece na tela.
  //
  // Duas decisões de implementação que não são detalhe:
  //
  //   1. O ajuste é por Gram-Schmidt modificado (A = QR), e não pela equação
  //      normal. Com grau 15 a matriz de Vandermonde é malcondicionada, e a
  //      equação normal eleva o condicionamento ao quadrado: o erro de
  //      validação explodiria por ruído de ponto flutuante, e não por
  //      sobreajuste. Seria a animação certa contando a história errada.
  //   2. `x` vive em [-1, 1] pelo mesmo motivo.
  function animaViesVariancia(area, cfg) {
    var W = 460, H = 300, PAD = 34;
    var GRAU_MAX = 15, N_TREINO = 20, N_VAL = 200;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var est = { grau: 1, curva: [], ruido: 0.15, pontos: N_TREINO, dados: null };
    var rel;

    // A função verdadeira. Suave, e não polinomial de grau baixo, para que
    // nenhum grau da varredura acerte por sorte.
    function verdade(x) { return Math.sin(3 * x) + 0.5 * x; }

    function gerar() {
      var r = rng(Number(cfg.semente) || 20260813), i, x;
      var tr = [], va = [];
      for (i = 0; i < est.pontos; i++) {
        x = -1 + 2 * (i + 0.5) / est.pontos;
        // ruído gaussiano por soma de uniformes (Irwin-Hall centrado)
        var e = (r() + r() + r() + r() + r() + r() - 3) * est.ruido;
        tr.push([x, verdade(x) + e]);
      }
      // A validação leva ruído próprio, e isso é decisão de conteúdo, não de
      // implementação. Com validação sem ruído, a curva laranja desceria até
      // zero e o capítulo perderia o terceiro termo da decomposição: o piso
      // irredutível. Com ruído, ela para perto da variância do ruído, e o
      // leitor vê que existe um chão que nenhum modelo atravessa.
      for (i = 0; i < N_VAL; i++) {
        x = -1 + 2 * (i + 0.5) / N_VAL;
        var ev = (r() + r() + r() + r() + r() + r() - 3) * est.ruido;
        va.push([x, verdade(x) + ev]);
      }
      return { tr: tr, va: va };
    }

    /** Ajusta polinômio de grau g por Gram-Schmidt modificado; devolve os
     *  coeficientes na base de monômios, ou null se a coluna colapsar. */
    function ajustar(pts, g) {
      var n = pts.length, m = g + 1, i, j, k;
      var A = [], R = [];
      for (j = 0; j < m; j++) {
        A.push(pts.map(function (p) { return Math.pow(p[0], j); }));
        R.push(new Array(m).fill(0));
      }
      for (j = 0; j < m; j++) {
        for (k = 0; k < j; k++) {
          var d = 0;
          for (i = 0; i < n; i++) d += A[k][i] * A[j][i];
          R[k][j] = d;
          for (i = 0; i < n; i++) A[j][i] -= d * A[k][i];
        }
        var nrm = 0;
        for (i = 0; i < n; i++) nrm += A[j][i] * A[j][i];
        nrm = Math.sqrt(nrm);
        if (!(nrm > 1e-12)) return null;
        R[j][j] = nrm;
        for (i = 0; i < n; i++) A[j][i] /= nrm;
      }
      var qty = [];
      for (j = 0; j < m; j++) {
        var s = 0;
        for (i = 0; i < n; i++) s += A[j][i] * pts[i][1];
        qty.push(s);
      }
      var c = new Array(m).fill(0);
      for (j = m - 1; j >= 0; j--) {
        var acc = qty[j];
        for (k = j + 1; k < m; k++) acc -= R[j][k] * c[k];
        c[j] = acc / R[j][j];
      }
      return c;
    }

    function prever(c, x) {
      var s = 0, j;
      for (j = c.length - 1; j >= 0; j--) s = s * x + c[j];
      return s;
    }

    function eqm(c, pts) {
      var s = 0, i, d;
      for (i = 0; i < pts.length; i++) { d = prever(c, pts[i][0]) - pts[i][1]; s += d * d; }
      return s / pts.length;
    }

    function passo() {
      if (est.grau > GRAU_MAX) return true;
      var c = ajustar(est.dados.tr, est.grau);
      est.curva.push(c
        ? { g: est.grau, tr: eqm(c, est.dados.tr), va: eqm(c, est.dados.va) }
        : { g: est.grau, tr: NaN, va: NaN });
      est.grau++;
      return est.grau > GRAU_MAX;
    }

    /** O grau de menor erro de validação — o joelho da curva. */
    function melhor() {
      var b = null, i;
      for (i = 0; i < est.curva.length; i++) {
        if (!isFinite(est.curva[i].va)) continue;
        if (!b || est.curva[i].va < b.va) b = est.curva[i];
      }
      return b;
    }

    function texto() {
      var u = est.curva[est.curva.length - 1], b = melhor();
      if (!u) { placar.textContent = "grau 0"; return; }
      var partes = ["grau " + u.g,
        "erro de treino " + u.tr.toFixed(3),
        "erro de validação " + u.va.toFixed(3)];
      if (b) partes.push("melhor até aqui: grau " + b.g + " com " + b.va.toFixed(3));
      if (est.curva.length >= GRAU_MAX) partes.push("varredura completa");
      placar.textContent = partes.join(" · ");
    }

    function desenhar() {
      var escuro = temaEscuro();
      t.fundo(escuro);
      var i, p, topo = 0;
      for (i = 0; i < est.curva.length; i++) {
        p = est.curva[i];
        if (isFinite(p.va)) topo = Math.max(topo, p.va);
        if (isFinite(p.tr)) topo = Math.max(topo, p.tr);
      }
      topo = Math.max(topo, 0.4);
      var px = function (g) { return PAD + (g - 1) / (GRAU_MAX - 1) * (W - 2 * PAD); };
      var py = function (v) { return H - PAD - Math.min(v, topo) / topo * (H - 2 * PAD); };

      ctx.font = "12px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#8b8c90" : "#6b6a66";
      ctx.fillText("grau do polinômio", W / 2 - 48, H - 10);

      // As duas curvas. Treino cai sempre; validação é a que vira.
      [["tr", escuro ? "#5ba3d0" : "#2f6f9f", "treino"],
       ["va", escuro ? "#e0864f" : "#c25a1e", "validação"]].forEach(function (serie, idx) {
        ctx.strokeStyle = serie[1];
        ctx.fillStyle = serie[1];
        ctx.lineWidth = 2;
        ctx.beginPath();
        var primeiro = true;
        for (i = 0; i < est.curva.length; i++) {
          p = est.curva[i];
          if (!isFinite(p[serie[0]])) continue;
          var X = px(p.g), Y = py(p[serie[0]]);
          if (primeiro) { ctx.moveTo(X, Y); primeiro = false; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();
        for (i = 0; i < est.curva.length; i++) {
          p = est.curva[i];
          if (!isFinite(p[serie[0]])) continue;
          ctx.beginPath();
          ctx.arc(px(p.g), py(p[serie[0]]), 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.fillText(serie[2], PAD + 6, PAD + 16 + idx * 16);
      });

      // A marca do joelho: a linha vertical no grau de menor validação.
      var b = melhor();
      if (b && est.curva.length > 3) {
        ctx.strokeStyle = escuro ? "#6f7075" : "#a9a8a4";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(px(b.g), PAD); ctx.lineTo(px(b.g), H - PAD);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    function rodar(mudanca) {
      if (rel) rel.parar();
      if (mudanca && mudanca.ruido != null) est.ruido = mudanca.ruido;
      if (mudanca && mudanca.pontos != null) est.pontos = mudanca.pontos;
      est.grau = 1; est.curva = [];
      est.dados = gerar();
      desenhar(); texto();
      rel.comecar(GRAU_MAX + 2);
    }

    botao("Recomeçar", function () { rodar({}); });
    // O segundo botão é o controle que o ADR 0015 exige: um resultado que o
    // leitor consegue prever errado. E que o AUTOR previu errado: a spec dizia
    // que com mais dado o joelho andaria para a direita. Medido, ele não anda,
    // fica no grau 5 nos dois casos. O que desaba é o CASTIGO por passar dele,
    // de 0,48 para 0,015 no grau 15. A lição medida é melhor que a prevista.
    botao("E com 3× mais dados de treino?", function () {
      rodar({ pontos: est.pontos === N_TREINO ? 60 : N_TREINO });
    });

    rel = relogio(cv, function () {
      var fim = passo();
      desenhar(); texto();
      return fim;
    }, function () { desenhar(); }, 220);

    est.dados = gerar();
    desenhar(); texto();
    rel.aoChegar(function () { rodar({}); });
  }

  // Três taxas de aprendizado na MESMA paisagem, ao mesmo tempo. A habilidade
  // do capítulo é diagnosticar pela FORMA da curva, e forma não se compara em
  // sequência: precisa das três lado a lado.
  //
  // O botão troca só a PERDA, mantendo as três taxas idênticas. É de propósito:
  // mudar duas variáveis de uma vez não é experimento. Com erro quadrático a
  // taxa 1,5 explode; com perda logística, a MESMA taxa não explode. É a
  // sutileza que o capítulo mede na etapa 05–06, e o leitor tende a prever
  // errado, que é o que o ADR 0015 exige de um controle.
  function animaTaxas(area, cfg) {
    var W = 460, H = 300, PAD = 34, EPOCAS = 60;
    var TAXAS = [0.001, 0.1, 1.5];
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var est = { ep: 0, logistica: false, dados: null, trilhas: null };
    var rel;

    function gerar() {
      var r = rng(Number(cfg.semente) || 20260813), i, x, pts = [];
      for (i = 0; i < 40; i++) {
        x = -1 + 2 * (i + 0.5) / 40;
        var e = (r() + r() + r() + r() + r() + r() - 3) * 0.12;
        // O mesmo x serve às duas perdas: regressão sobre `y`, classificação
        // sobre `c`. Trocar a perda não troca o dado.
        pts.push({ x: x, y: 1.2 * x + 0.3 + e, c: x > 0 ? 1 : 0 });
      }
      return pts;
    }

    function sig(z) { return 1 / (1 + Math.exp(-z)); }

    /** Perda e gradiente em w = [b, a], para a perda escolhida. */
    function perdaGrad(w) {
      var pts = est.dados, n = pts.length, i, p, L = 0, gb = 0, ga = 0, z, d;
      for (i = 0; i < n; i++) {
        p = pts[i];
        z = w[0] + w[1] * p.x;
        if (est.logistica) {
          var s = sig(z);
          var eps = 1e-12;
          L += -(p.c * Math.log(s + eps) + (1 - p.c) * Math.log(1 - s + eps));
          d = s - p.c;
        } else {
          d = z - p.y;
          L += d * d;
        }
        gb += d; ga += d * p.x;
      }
      // Fator 2 no quadrático para que a Hessiana seja (2/n)XᵀX: com x em
      // [-1,1] o maior autovalor é 2, então a fronteira de estabilidade fica
      // em taxa 1,0 — e é por isso que 1,5 diverge e 0,1 não.
      var k = est.logistica ? 1 / n : 2 / n;
      return { L: L / n, g: [k * gb, k * ga] };
    }

    function novaTrilha() {
      return TAXAS.map(function (lr) {
        return { lr: lr, w: [0, 0], hist: [], estourou: false };
      });
    }

    function passo() {
      if (est.ep >= EPOCAS) return true;
      est.trilhas.forEach(function (tr) {
        if (tr.estourou) { tr.hist.push(Infinity); return; }
        var pg = perdaGrad(tr.w);
        if (!isFinite(pg.L) || pg.L > 1e6) { tr.estourou = true; tr.hist.push(Infinity); return; }
        tr.hist.push(pg.L);
        tr.w[0] -= tr.lr * pg.g[0];
        tr.w[1] -= tr.lr * pg.g[1];
      });
      est.ep++;
      return est.ep >= EPOCAS;
    }

    /** O veredito de cada trilha, que é o que o capítulo pede para diagnosticar. */
    function diagnostico(tr) {
      if (tr.estourou) return "estourou";
      var h = tr.hist, n = h.length;
      if (n < 5) return "começando";
      var queda = (h[0] - h[n - 1]) / (Math.abs(h[0]) || 1);
      var ultimas = (h[n - 5] - h[n - 1]) / (Math.abs(h[n - 5]) || 1);
      // "Quase parada" precisa de um corte declarado, senão vira gosto: menos
      // de 10% de queda em 60 épocas é a linha adotada aqui, e é a leitura de
      // "desce, mas quase imperceptivelmente" da tabela do capítulo.
      if (queda < 0.10) return "quase parada";
      if (ultimas < 0.005) return "estabilizou";
      return "descendo";
    }

    function texto() {
      var partes = [est.logistica ? "perda logística" : "erro quadrático",
        "época " + est.ep];
      est.trilhas.forEach(function (tr) {
        var u = tr.hist[tr.hist.length - 1];
        partes.push("taxa " + tr.lr + ": " +
          (isFinite(u) ? u.toFixed(4) : "fora da escala") + " (" + diagnostico(tr) + ")");
      });
      placar.textContent = partes.join(" · ");
    }

    function desenhar() {
      var escuro = temaEscuro();
      t.fundo(escuro);
      // O teto é a maior perda FINITA do primeiro quadro: quem explode sai da
      // moldura, e sair da moldura é a informação.
      var teto = 0.01, i, j;
      est.trilhas.forEach(function (tr) {
        if (isFinite(tr.hist[0])) teto = Math.max(teto, tr.hist[0]);
      });
      teto *= 1.15;
      var px = function (e) { return PAD + e / (EPOCAS - 1) * (W - 2 * PAD); };
      var py = function (v) { return H - PAD - Math.min(v, teto) / teto * (H - 2 * PAD); };

      ctx.font = "12px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#8b8c90" : "#6b6a66";
      ctx.fillText("época", W / 2 - 18, H - 10);

      var cores = escuro ? ["#7f8085", "#5ba3d0", "#e0864f"]
                         : ["#8f8e8a", "#2f6f9f", "#c25a1e"];
      est.trilhas.forEach(function (tr, idx) {
        ctx.strokeStyle = cores[idx];
        ctx.fillStyle = cores[idx];
        ctx.lineWidth = 2;
        ctx.beginPath();
        var primeiro = true;
        for (j = 0; j < tr.hist.length; j++) {
          var v = tr.hist[j];
          if (!isFinite(v)) break;                 // saiu da escala: a linha para
          var X = px(j), Y = py(v);
          if (primeiro) { ctx.moveTo(X, Y); primeiro = false; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();
        if (tr.estourou) {
          // A seta para cima onde a curva sumiu, para que "fora da escala" não
          // se confunda com "a curva acabou".
          var xe = px(Math.max(0, tr.hist.findIndex(function (v) { return !isFinite(v); }) - 1));
          ctx.beginPath();
          ctx.moveTo(xe, PAD + 12); ctx.lineTo(xe - 4, PAD + 20); ctx.lineTo(xe + 4, PAD + 20);
          ctx.closePath(); ctx.fill();
        }
        ctx.fillText("taxa " + tr.lr, PAD + 6, PAD + 16 + idx * 16);
      });
    }

    function rodar(mudanca) {
      if (rel) rel.parar();
      if (mudanca && mudanca.logistica != null) est.logistica = mudanca.logistica;
      est.ep = 0;
      est.dados = est.dados || gerar();
      est.trilhas = novaTrilha();
      desenhar(); texto();
      rel.comecar(EPOCAS + 2);
    }

    botao("Recomeçar", function () { rodar({}); });
    botao("E se a perda fosse logística?", function () {
      rodar({ logistica: !est.logistica });
    });

    rel = relogio(cv, function () {
      var fim = passo();
      desenhar(); texto();
      return fim;
    }, function () { desenhar(); }, 70);

    est.dados = gerar();
    est.trilhas = novaTrilha();
    desenhar(); texto();
    rel.aoChegar(function () { rodar({}); });
  }

  // As TRÊS fontes de vazamento do capítulo, medidas lado a lado com a mesma
  // intensidade subindo de 0 a 1. A spec antiga desta animação prometia um
  // tombo de AUC para o vazamento de pré-processamento, e o próprio capítulo
  // diz o contrário: "o efeito costuma ser pequeno — décimos de ponto". A
  // animação foi refeita para medir, e não para confirmar.
  //
  // O modelo é k-NN ponderado por distância, e a escolha não é casual: é o
  // modelo mais simples que consegue MEMORIZAR, e sem memória a fonte 3
  // (duplicata) não teria efeito nenhum. Um linear esconderia justamente a
  // fonte que o capítulo chama de "o modelo que já viu a prova".
  function animaVazamento(area, cfg) {
    var W = 460, H = 300, PAD = 34, PASSOS = 21, K = 15;
    // N_TR pequeno de propósito: com treino grande, a média e o desvio mudam
    // tão pouco ao incluir o teste que a fonte 2 mede exatamente zero. O
    // vazamento de pré-processamento vive do quanto a ESTATÍSTICA se move.
    var N_TR = 80, N_TE = 200, D = 3, N_CAT = 60;
    // A fonte 2 vale milésimos, e milésimos não sobrevivem a um sorteio só: com
    // uma amostra, o sinal dela chega a inverter. Cada ponto das curvas é a
    // média de R sorteios independentes, senão a curva mediria ruído.
    var R = 8;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    // Quatro curvas para três fontes: a fonte 2 aparece DUAS vezes, com duas
    // estatísticas diferentes. É o achado desta animação, e o motivo de ela
    // existir: "aprender antes de dividir" vale milésimos quando o que se
    // aprende é média e desvio, e vale a prova inteira quando o que se aprende
    // é uma média POR CATEGORIA rara. Mesmo erro, dois mundos.
    var FONTES = [
      { id: "alvo", rotulo: "1. alvo disfarçado" },
      { id: "prep", rotulo: "2. normalizar antes de dividir" },
      { id: "enc", rotulo: "2b. codificar por alvo antes de dividir" },
      { id: "dup", rotulo: "3. duplicata" }
    ];
    var est = { i: 0, bases: null, curvas: null, sorteio: 0 };
    var rel;

    function gerarBase(semente) {
      var r = rng(semente);
      function gauss() { return (r() + r() + r() + r() + r() + r() - 3); }
      // TODOS os pontos já nascem com a coluna extra, preenchida com ruído.
      // Sem isso, a fonte 1 teria uma dimensão a mais que as outras duas e as
      // três curvas partiriam de AUC diferentes na intensidade 0 — a
      // comparação mediria a geometria, e não o vazamento.
      function bloco(n) {
        var pts = [], i, j, x, z;
        for (i = 0; i < n; i++) {
          x = []; z = 0;
          for (j = 0; j < D; j++) { x.push(gauss()); z += (j === 0 ? 1.1 : j === 1 ? -0.7 : 0.5) * x[j]; }
          x.push(gauss());                        // a coluna extra, por ora só ruído
          // Uma categórica de alta cardinalidade, do tipo que aparece em
          // qualquer base real: CEP, SKU, id de loja. Com 60 categorias e 80
          // linhas de treino, quase toda categoria é rara — e é aí que a
          // codificação por alvo vira um vazamento de rótulo.
          pts.push({ x: x, cat: Math.floor(r() * N_CAT), y: (1 / (1 + Math.exp(-z))) > r() ? 1 : 0 });
        }
        return pts;
      }
      return { tr: bloco(N_TR), te: bloco(N_TE), r: r };
    }

    /** AUC por postos (Mann-Whitney), que não depende de limiar. */
    function auc(scores, ys) {
      var idx = scores.map(function (s, i) { return i; });
      idx.sort(function (a, b) { return scores[a] - scores[b]; });
      var postos = new Array(scores.length), i = 0, j, soma, p;
      while (i < idx.length) {
        j = i;
        while (j + 1 < idx.length && scores[idx[j + 1]] === scores[idx[i]]) j++;
        p = (i + j) / 2 + 1;                      // posto médio nos empates
        for (var k = i; k <= j; k++) postos[idx[k]] = p;
        i = j + 1;
      }
      var nP = 0, nN = 0;
      soma = 0;
      for (i = 0; i < ys.length; i++) { if (ys[i] === 1) { nP++; soma += postos[i]; } else nN++; }
      if (!nP || !nN) return 0.5;
      return (soma - nP * (nP + 1) / 2) / (nP * nN);
    }

    /** k-NN ponderado por 1/(d+ε): contínuo, e premia o vizinho de distância 0. */
    function prever(tr, te) {
      return te.map(function (q) {
        var viz = tr.map(function (p) {
          var d = 0, j;
          for (j = 0; j < p.x.length; j++) { var dd = p.x[j] - q.x[j]; d += dd * dd; }
          return { d: Math.sqrt(d), y: p.y };
        });
        viz.sort(function (a, b) { return a.d - b.d; });
        var num = 0, den = 0, i;
        for (i = 0; i < K && i < viz.length; i++) {
          var w = 1 / (viz[i].d + 1e-6);
          num += w * viz[i].y; den += w;
        }
        return den ? num / den : 0.5;
      });
    }

    /** Média do alvo por categoria, com recuo para a média global no que falta. */
    function alvoMedio(pts) {
      var soma = {}, cont = {}, i, g = 0;
      for (i = 0; i < pts.length; i++) {
        soma[pts[i].cat] = (soma[pts[i].cat] || 0) + pts[i].y;
        cont[pts[i].cat] = (cont[pts[i].cat] || 0) + 1;
        g += pts[i].y;
      }
      return { m: soma, n: cont, global: pts.length ? g / pts.length : 0.5 };
    }
    function comCodificacao(pts, mapa) {
      return pts.map(function (p) {
        var c = mapa.n[p.cat] ? mapa.m[p.cat] / mapa.n[p.cat] : mapa.global;
        return { x: p.x.concat([c]), cat: p.cat, y: p.y };
      });
    }

    function padroniza(pts, mu, sd) {
      return pts.map(function (p) {
        return { x: p.x.map(function (v, j) { return (v - mu[j]) / (sd[j] || 1); }), y: p.y };
      });
    }
    function estatisticas(pts) {
      var m = pts.length, dim = pts[0].x.length, mu = [], sd = [], j, i, s;
      for (j = 0; j < dim; j++) {
        s = 0; for (i = 0; i < m; i++) s += pts[i].x[j];
        mu.push(s / m);
        s = 0; for (i = 0; i < m; i++) s += Math.pow(pts[i].x[j] - mu[j], 2);
        sd.push(Math.sqrt(s / m));
      }
      return { mu: mu, sd: sd };
    }

    /** Roda o experimento de UMA fonte com intensidade `a`, e devolve a AUC
     *  que o time REPORTARIA — que é a métrica que o vazamento infla. */
    function medir(fonte, a) {
      var soma = 0, k;
      for (k = 0; k < est.bases.length; k++) soma += medirUm(est.bases[k], fonte, a);
      return soma / est.bases.length;
    }

    function medirUm(base, fonte, a) {
      // As três fontes partem do MESMO ponto: mesma dimensão, mesma
      // padronização ajustada só no treino. Na intensidade 0 as três são o
      // mesmo experimento honesto, e é por isso que as curvas se tocam ali.
      var b = base, tr = b.tr, te = b.te, e;
      if (fonte === "alvo") {
        // A coluna que só existe depois: o ruído dá lugar ao rótulo.
        var comCol = function (pts) {
          return pts.map(function (p) {
            var x = p.x.slice();
            x[x.length - 1] = a * (p.y - 0.5) * 6 + (1 - a) * x[x.length - 1];
            return { x: x, cat: p.cat, y: p.y };   // `cat` sobrevive, ou a
            // codificação por alvo desta fonte cai para a média global e a
            // curva parte de uma AUC diferente das outras três.
          });
        };
        tr = comCol(tr); te = comCol(te);
      } else if (fonte === "dup") {
        // Uma fração `a` das linhas de teste também está no treino.
        var n = Math.round(a * te.length);
        // A cópia leva TAMBÉM a categoria: sem ela, a linha duplicada recebe
        // outra codificação e deixa de ser duplicata de verdade — o vazamento
        // apareceria menor do que é, por defeito da simulação e não do método.
        tr = tr.concat(te.slice(0, n).map(function (p) { return { x: p.x, cat: p.cat, y: p.y }; }));
      }
      // As duas etapas que "aprendem dos dados" vêm por último, e é nelas que
      // moram as fontes 2 e 2b: o conjunto de AJUSTE de cada uma cresce com
      // `a`, engolindo uma fração do teste.
      var codMapa = alvoMedio(tr.concat(b.te.slice(0, fonte === "enc" ? Math.round(a * b.te.length) : 0)));
      tr = comCodificacao(tr, codMapa); te = comCodificacao(te, codMapa);
      var quantos = fonte === "prep" ? Math.round(a * b.te.length) : 0;
      e = estatisticas(tr.concat(comCodificacao(b.te.slice(0, quantos), codMapa)));
      var s = prever(padroniza(tr, e.mu, e.sd), padroniza(te, e.mu, e.sd));
      return auc(s, te.map(function (p) { return p.y; }));
    }

    function passo() {
      if (est.i >= PASSOS) return true;
      var a = est.i / (PASSOS - 1);
      FONTES.forEach(function (f, k) { est.curvas[k].push({ a: a, auc: medir(f.id, a) }); });
      est.i++;
      return est.i >= PASSOS;
    }

    function texto() {
      var partes = ["intensidade " + (est.i ? ((est.i - 1) / (PASSOS - 1)).toFixed(2) : "0.00")];
      FONTES.forEach(function (f, k) {
        var c = est.curvas[k], u = c[c.length - 1];
        if (!u) return;
        var ganho = u.auc - c[0].auc;
        partes.push(f.rotulo + ": AUC " + u.auc.toFixed(3) +
          " (" + (ganho >= 0 ? "+" : "") + ganho.toFixed(3) + ")");
      });
      if (est.i >= PASSOS) partes.push("varredura completa");
      placar.textContent = partes.join(" · ");
    }

    function desenhar() {
      var escuro = temaEscuro();
      t.fundo(escuro);
      var px = function (a) { return PAD + a * (W - 2 * PAD); };
      var py = function (v) { return H - PAD - (v - 0.5) / 0.5 * (H - 2 * PAD); };

      ctx.font = "12px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#8b8c90" : "#6b6a66";
      ctx.fillText("intensidade do vazamento", W / 2 - 72, H - 10);
      ctx.fillText("AUC 1,0", 4, PAD + 4);
      ctx.fillText("0,5", 12, H - PAD + 4);

      var cores = escuro ? ["#e0864f", "#5ba3d0", "#8fbf6a"]
                         : ["#c25a1e", "#2f6f9f", "#4f8f3a"];
      FONTES.forEach(function (f, k) {
        ctx.strokeStyle = cores[k]; ctx.fillStyle = cores[k]; ctx.lineWidth = 2;
        ctx.beginPath();
        est.curvas[k].forEach(function (p, i) {
          var X = px(p.a), Y = py(p.auc);
          if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        });
        ctx.stroke();
        ctx.fillText(f.rotulo, PAD + 6, PAD + 16 + k * 16);
      });
    }

    function sortear() {
      var base0 = Number(cfg.semente) || 20260813;
      est.bases = [];
      for (var k = 0; k < R; k++) est.bases.push(gerarBase(base0 + est.sorteio * 1000 + k * 7919));
    }

    function rodar() {
      if (rel) rel.parar();
      est.i = 0;
      est.curvas = FONTES.map(function () { return []; });
      desenhar(); texto();
      rel.comecar(PASSOS + 2);
    }

    botao("Recomeçar", function () { rodar(); });
    botao("Outro conjunto de sorteios", function () { est.sorteio++; sortear(); rodar(); });

    rel = relogio(cv, function () {
      var fim = passo();
      desenhar(); texto();
      return fim;
    }, function () { desenhar(); }, 120);

    sortear();
    est.curvas = FONTES.map(function () { return []; });
    desenhar(); texto();
    rel.aoChegar(function () { rodar(); });
  }

  // A animação do capítulo II.1: o limiar varrendo os escores, com a matriz de
  // confusão, precisão e revocação mudando junto, e o ponto andando sobre a ROC.
  //
  // O controle que o leitor erra ao prever é a PREVALÊNCIA. Perguntado o que
  // acontece com a acurácia quando os positivos caem de 50% para 1%, quase todo
  // mundo responde "cai". Ela sobe: no limiar alto o modelo praticamente só diz
  // "não", e a essa altura quase sempre acerta. Quem desaba é a precisão, e a
  // AUC-ROC não se move um dígito.
  //
  // A decisão de implementação que sustenta a lição: a prevalência entra como
  // PESO, e não por reamostragem. Os escores dos positivos e dos negativos vêm
  // de dois poços fixos, e π só decide quanto cada poço pesa na contagem. Com
  // isso TPR e FPR ficam EXATAMENTE invariantes à prevalência, que é o teorema
  // do capítulo (a ROC só olha para dentro de cada classe), em vez de
  // aproximadamente invariantes a menos de ruído de amostragem. Uma animação
  // que ensina "este número não muda" não pode exibir o número tremendo.
  function animaLimiar(area, cfg) {
    var W = 460, H = 300, PAD = 22;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bPrev;
    var N = 2000, PASSO = 0.02, T0 = 0.98, T_FIM = 0.0, GRID = 501;

    function poco(sem, n, desloc) {
      var r = rng(sem), v = [], i, s;
      for (i = 0; i < n; i++) {
        s = (r() + r() + r()) / 3 + desloc;
        v.push(Math.min(0.999, Math.max(0.001, s)));
      }
      v.sort(function (a, b) { return a - b; });
      return v;
    }

    var POS = poco(7, 4000, 0.22), NEG = poco(13, 4000, -0.22);
    var est = { lim: T0, pi: 0.5, parou: false, roc: [], melhorF1: 0, limF1: 0 };

    /** Fração do poço (ordenado) com escore >= lim, por busca binária. */
    function acima(v, lim) {
      var lo = 0, hi = v.length, m;
      while (lo < hi) { m = (lo + hi) >> 1; if (v[m] >= lim) hi = m; else lo = m + 1; }
      return (v.length - lo) / v.length;
    }

    function met(lim, pi) {
      var tpr = acima(POS, lim), fpr = acima(NEG, lim);
      var tp = pi * tpr, fn = pi * (1 - tpr);
      var fp = (1 - pi) * fpr, tn = (1 - pi) * (1 - fpr);
      return { tpr: tpr, fpr: fpr, tp: tp, fn: fn, fp: fp, tn: tn,
               acc: tp + tn, rec: tpr,
               prec: (tp + fp) > 1e-12 ? tp / (tp + fp) : null };
    }

    /** AUC por trapézio numa grade própria, independente do passo da animação. */
    function areas(pi) {
      var i, lim, m, roc = 0, pr = 0, ant = met(1.0001, pi);
      for (i = 1; i < GRID; i++) {
        lim = 1 - i / (GRID - 1);
        m = met(lim, pi);
        roc += (m.fpr - ant.fpr) * (m.tpr + ant.tpr) / 2;
        if (m.prec != null && ant.prec != null) {
          pr += (m.rec - ant.rec) * (m.prec + ant.prec) / 2;
        }
        ant = m;
      }
      return { roc: roc, pr: pr };
    }

    function faixa(v, y0, cor) {
      var x0 = PAD + 4, larg = W / 2 - PAD - 14, i;
      ctx.fillStyle = cor;
      for (i = 0; i < v.length; i += 7) {
        ctx.fillRect(x0 + v[i] * larg, y0 + (((i / 7) | 0) % 26), 1.4, 1.4);
      }
    }

    function desenhar() {
      var escuro = temaEscuro(), m = met(est.lim, est.pi);
      var x0 = PAD + 4, larg = W / 2 - PAD - 14;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("escores dos positivos", x0, PAD + 12);
      faixa(POS, PAD + 18, escuro ? "#8fb8dd" : "#35618e");
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("escores dos negativos", x0, PAD + 68);
      faixa(NEG, PAD + 74, escuro ? "#e0a24a" : "#b8761f");
      ctx.strokeStyle = escuro ? "#e6e6e4" : "#1c1c1c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0 + est.lim * larg, PAD + 14);
      ctx.lineTo(x0 + est.lim * larg, PAD + 104);
      ctx.stroke();

      var cx = x0, cy = PAD + 130;
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("matriz de confusão (de " + N + ")", cx, cy);
      [["VP", m.tp], ["FP", m.fp], ["FN", m.fn], ["VN", m.tn]].forEach(function (c, j) {
        var px = cx + (j % 2) * 96, py = cy + 18 + (j > 1 ? 20 : 0);
        ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
        ctx.fillText(c[0], px, py);
        ctx.fillStyle = escuro ? "#e6e6e4" : "#1c1c1c";
        ctx.fillText(String(Math.round(c[1] * N)), px + 24, py);
      });

      var rx = W / 2 + 14, ry = PAD + 12, rl = H - 2 * PAD - 34;
      ctx.strokeStyle = escuro ? "#3a3b3f" : "#dcdbd7";
      ctx.lineWidth = 1;
      ctx.strokeRect(rx, ry, rl, rl);
      ctx.beginPath(); ctx.moveTo(rx, ry + rl); ctx.lineTo(rx + rl, ry); ctx.stroke();
      ctx.strokeStyle = escuro ? "#87b89a" : "#2f7d4f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      est.roc.forEach(function (p, j) {
        var px = rx + p[0] * rl, py = ry + rl - p[1] * rl;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.fillStyle = escuro ? "#e6e6e4" : "#1c1c1c";
      ctx.beginPath();
      ctx.arc(rx + m.fpr * rl, ry + rl - m.tpr * rl, 3.5, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("ROC · falso positivo × revocação", rx, ry + rl + 16);
    }

    function texto() {
      var m = met(est.lim, est.pi), a = areas(est.pi);
      placar.textContent =
        "prevalência " + est.pi.toFixed(2) +
        " · limiar " + est.lim.toFixed(2) +
        " · VP " + Math.round(m.tp * N) + " FP " + Math.round(m.fp * N) +
        " FN " + Math.round(m.fn * N) + " VN " + Math.round(m.tn * N) +
        " · acurácia " + m.acc.toFixed(3) +
        " · precisão " + (m.prec == null ? "—" : m.prec.toFixed(3)) +
        " · revocação " + m.rec.toFixed(3) +
        " · AUC-ROC " + a.roc.toFixed(3) + " · AUC-PR " + a.pr.toFixed(3) +
        (est.parou
          ? " · melhor F1 " + est.melhorF1.toFixed(3) + " no limiar " + est.limF1.toFixed(2) +
            " · dizer não a tudo dá acurácia " + (1 - est.pi).toFixed(3)
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var m = met(est.lim, est.pi), f1;
      est.roc.push([m.fpr, m.tpr]);
      if (m.prec != null && (m.prec + m.rec) > 0) {
        f1 = 2 * m.prec * m.rec / (m.prec + m.rec);
        if (f1 > est.melhorF1) { est.melhorF1 = f1; est.limF1 = est.lim; }
      }
      est.lim -= PASSO;
      if (est.lim < T_FIM - 1e-9) { est.lim = T_FIM; est.parou = true; }
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(pi) {
      est.pi = pi; est.lim = T0; est.parou = false;
      est.roc = []; est.melhorF1 = 0; est.limF1 = 0;
      rel.comecar(Math.ceil((T0 - T_FIM) / PASSO) + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bPrev.textContent = est.pi > 0.1 ? "E se só 1% fosse positivo?"
                                       : "Voltar às classes equilibradas";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.pi); });
    bPrev = botao("E se só 1% fosse positivo?", function () {
      rodar(est.pi > 0.1 ? 0.01 : 0.5);
    });

    rel = relogio(cv, passo, function () { desenhar(); }, 70);
    desenhar(); texto();
    rel.aoChegar(function () { rodar(est.pi); });
  }

  // A animação do capítulo III.3: a retropropagação descendo camada a camada
  // numa rede de 20, com a NORMA DO GRADIENTE de cada camada aparecendo em
  // escala logarítmica. A animação é o próprio passo para trás.
  //
  // Aqui o leitor erra a previsão DUAS vezes, e a segunda é a que interessa.
  // Primeiro ele espera que rede profunda sempre mate o gradiente; depois, ao
  // trocar a ativação, espera que a ReLU resolva sozinha. A dedução de Xavier
  // supõe ativação linear, e a ReLU zera metade das entradas: só a terceira
  // combinação (ReLU com He) mantém as barras de pé. É o argumento da seção
  // "Inicialização" do capítulo, medido em vez de afirmado.
  //
  // Nada aqui é encenado: os pesos são sorteados, o passo para a frente e o
  // passo para trás são calculados, e a barra é a norma L2 de δ na camada.
  function animaGradiente(area, cfg) {
    var W = 460, H = 300, PAD = 24;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bModo;
    var L = 20, N = 48, DEC = 12;          // DEC décadas na escala vertical
    var MODOS = [
      { rot: "sigmoide + Xavier", ativ: "sig", ganho: 1 },
      { rot: "ReLU + Xavier", ativ: "relu", ganho: 1 },
      { rot: "ReLU + He", ativ: "relu", ganho: 2 }
    ];
    var est = { modo: 0, camada: L + 1, normas: [], parou: false, rede: null };

    function normal(r) {                    // Box-Muller, descartando o par
      var u = Math.max(1e-12, r()), v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v);
    }

    function dsig(x) { var g = 1 / (1 + Math.exp(-x)); return g * (1 - g); }

    function construir(m) {
      var r = rng(101), l, i, j, dp, Wl, zl, al, s;
      var a = [], Ws = [], pres = [];
      for (i = 0; i < N; i++) a.push(normal(r));
      for (l = 0; l < L; l++) {
        dp = Math.sqrt(m.ganho / N);
        Wl = [];
        for (i = 0; i < N; i++) {
          Wl.push([]);
          for (j = 0; j < N; j++) Wl[i].push(normal(r) * dp);
        }
        Ws.push(Wl);
        zl = []; al = [];
        for (i = 0; i < N; i++) {
          s = 0;
          for (j = 0; j < N; j++) s += Wl[i][j] * a[j];
          zl.push(s);
          al.push(m.ativ === "sig" ? 1 / (1 + Math.exp(-s)) : Math.max(0, s));
        }
        pres.push(zl); a = al;
      }
      return { Ws: Ws, z: pres, m: m };
    }

    /** δ na saída, e o passo para trás guardando a norma L2 de cada camada. */
    function retro(rede) {
      var r = rng(7), d = [], i, l, j, s, nv, novo, zp, norm = [];
      for (i = 0; i < N; i++) d.push(normal(r) / Math.sqrt(N));
      for (l = L - 1; l >= 0; l--) {
        s = 0;
        for (i = 0; i < N; i++) s += d[i] * d[i];
        norm[l] = Math.sqrt(s);
        novo = [];
        for (j = 0; j < N; j++) {
          nv = 0;
          for (i = 0; i < N; i++) nv += rede.Ws[l][i][j] * d[i];
          if (l > 0) {
            zp = rede.z[l - 1][j];
            nv *= rede.m.ativ === "sig" ? dsig(zp) : (zp > 0 ? 1 : 0);
          }
          novo.push(nv);
        }
        d = novo;
      }
      return norm;
    }

    function desenhar() {
      var escuro = temaEscuro(), i, v, alt;
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var base = H - PAD - 22, altMax = base - PAD - 26;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText(MODOS[est.modo].rot + " · norma do gradiente por camada (log)",
                   x0, PAD + 14);
      var yRef = base - (1 - 6 / DEC) * altMax;
      ctx.strokeStyle = escuro ? "#3a3b3f" : "#dcdbd7";
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yRef); ctx.lineTo(x0 + larg, yRef); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("10⁻⁶", x0 + larg - 28, yRef - 3);
      for (i = 0; i < L; i++) {
        v = est.normas[i];
        if (v == null || i + 1 > est.camada) continue;
        alt = Math.max(1, (1 + Math.log(Math.max(v, 1e-12)) / Math.LN10 / DEC) * altMax);
        ctx.fillStyle = escuro ? "#8fb8dd" : "#35618e";
        ctx.fillRect(x0 + i * (larg / L) + 2, base - alt, larg / L - 4, alt);
      }
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("camada 1", x0, base + 14);
      ctx.fillText("camada " + L, x0 + larg - 54, base + 14);
    }

    function texto() {
      var pri = est.normas[0], ult = est.normas[L - 1];
      placar.textContent =
        MODOS[est.modo].rot + " · rede de " + L + " camadas" +
        (!est.parou && est.camada <= L && est.normas[est.camada - 1] != null
          ? " · camada " + est.camada + ": norma " + est.normas[est.camada - 1].toExponential(2)
          : "") +
        (est.parou
          ? " · última camada " + ult.toExponential(2) +
            " · primeira camada " + pri.toExponential(2) +
            " · a primeira recebe " + (pri / ult).toExponential(2) + " do que saiu da última"
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      est.camada--;
      if (est.camada < 1) { est.camada = 1; est.parou = true; }
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar() {
      est.rede = construir(MODOS[est.modo]);
      est.normas = retro(est.rede);
      est.camada = L + 1; est.parou = false;
      rel.comecar(L + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bModo.textContent = "Trocar para " + MODOS[(est.modo + 1) % MODOS.length].rot;
    }
    bRodar = botao("Rodar de novo", function () { rodar(); });
    bModo = botao("Trocar para " + MODOS[1].rot, function () {
      est.modo = (est.modo + 1) % MODOS.length; rodar();
    });

    rel = relogio(cv, passo, function () { desenhar(); }, 90);
    est.rede = construir(MODOS[0]);
    est.normas = retro(est.rede);
    desenhar(); texto();
    rel.aoChegar(function () { rodar(); });
  }

  // A animação do capítulo II.7: a mesma série, o mesmo modelo, os mesmos
  // atributos, avaliados de dois jeitos. A janela de origem móvel avança dobra a
  // dobra e o MAE de cada uma aparece; a linha reta lá embaixo é o MAE da
  // divisão embaralhada, calculado uma vez sobre as mesmas linhas.
  //
  // O que o leitor erra ao prever é o SINAL da diferença, antes do tamanho.
  // Quase todo mundo aceita que embaralhar "não é ideal"; poucos esperam que o
  // número resultante seja MENOR, que é justamente o que o torna perigoso. Erro
  // que aparece grande ninguém publica; erro que aparece pequeno vira slide.
  //
  // O modelo é k-vizinhos sobre (defasagem 2, defasagem 1), e a escolha não é
  // neutra: é o mais simples que MEMORIZA. Com as linhas embaralhadas, o vizinho
  // mais próximo de um ponto de teste costuma ser o instante ao lado, que ficou
  // no treino. Com um linear, o vazamento existiria e seria pequeno, e a
  // animação ensinaria que o erro de método é um detalhe.
  function animaOrigemMovel(area, cfg) {
    var W = 460, H = 300, PAD = 26;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bQuebra;
    var N = 320, DOBRAS = 8, BLOCO = 20, K = 3;
    var est = { quebra: false, serie: [], dobra: 0, maes: [], embaralhado: 0, parou: false };

    function gerar(quebra) {
      var r = rng(31), y = [], i, e = 0, nivel;
      for (i = 0; i < N; i++) {
        e = 0.7 * e + (r() - 0.5) * 2.0;                 // ruído autocorrelacionado
        nivel = (quebra && i > N * 0.62) ? 14 : 0;       // degrau de regime
        // A tendência (0,09 por passo) é escolha de REALISMO, não de efeito: em
        // 320 passos a série mais que dobra, que é o que uma base de negócio em
        // crescimento faz. Varri 0,035 / 0,09 / 0,18 e a mentira do embaralhado
        // vale 1,1× / 1,9× / 3,5× sem quebra. O tamanho do engano é proporcional
        // a quanto o futuro difere do passado, e essa dependência é a lição:
        // não se escolhe o número, mede-se.
        y.push(20 + 0.09 * i + 4 * Math.sin(i / 7.0) + e + nivel);
      }
      return y;
    }

    /** Linhas (defasagem 2, defasagem 1) -> alvo, para todo t >= 2. */
    function linhas(y) {
      var L = [], i;
      for (i = 2; i < y.length; i++) L.push({ x: [y[i - 2], y[i - 1]], y: y[i], t: i });
      return L;
    }

    /** k-vizinhos sobre as duas defasagens, com média simples dos vizinhos. */
    function prever(treino, x) {
      var d = treino.map(function (p) {
        var a = p.x[0] - x[0], b = p.x[1] - x[1];
        return { d: a * a + b * b, y: p.y };
      });
      d.sort(function (p, q) { return p.d - q.d; });
      var s = 0, k = Math.min(K, d.length), i;
      for (i = 0; i < k; i++) s += d[i].y;
      return s / k;
    }

    function mae(treino, teste) {
      var s = 0, i;
      for (i = 0; i < teste.length; i++) s += Math.abs(prever(treino, teste[i].x) - teste[i].y);
      return s / teste.length;
    }

    /** Origem móvel: treina com tudo até a origem, avalia o bloco seguinte. */
    function dobraMovel(L, j) {
      var fim = L.length - (DOBRAS - j) * BLOCO;
      return mae(L.slice(0, fim), L.slice(fim, fim + BLOCO));
    }

    /** A divisão inválida: embaralha as linhas e corta 20% para teste. */
    function embaralhada(L) {
      var r = rng(5), c = L.slice(), i, j, tmp;
      for (i = c.length - 1; i > 0; i--) {
        j = Math.floor(r() * (i + 1)); tmp = c[i]; c[i] = c[j]; c[j] = tmp;
      }
      var corte = Math.floor(c.length * 0.8);
      return mae(c.slice(0, corte), c.slice(corte));
    }

    function media(v) {
      var s = 0, i; for (i = 0; i < v.length; i++) s += v[i];
      return v.length ? s / v.length : 0;
    }

    function desenhar() {
      var escuro = temaEscuro(), i, h;
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var ySer = PAD + 12, altSer = 76;
      var base = H - PAD - 18, altMax = base - (ySer + altSer) - 28;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";

      var mn = Math.min.apply(null, est.serie), mx = Math.max.apply(null, est.serie);
      ctx.strokeStyle = escuro ? "#8fb8dd" : "#35618e";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      est.serie.forEach(function (v, i2) {
        var px = x0 + (i2 / (N - 1)) * larg;
        var py = ySer + altSer - ((v - mn) / (mx - mn || 1)) * altSer;
        if (i2 === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      var origem = (N - DOBRAS * BLOCO) / N;
      ctx.strokeStyle = escuro ? "#e0a24a" : "#b8761f";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x0 + origem * larg, ySer); ctx.lineTo(x0 + origem * larg, ySer + altSer);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("a série · do tracejado em diante, as " + DOBRAS + " dobras", x0, ySer - 2);

      var topo = Math.max(media(est.maes) * 1.6, est.embaralhado * 3, 1);
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("MAE por dobra (origem móvel)", x0, ySer + altSer + 18);
      for (i = 0; i < est.maes.length; i++) {
        h = Math.max(1, (est.maes[i] / topo) * altMax);
        ctx.fillStyle = escuro ? "#8fb8dd" : "#35618e";
        ctx.fillRect(x0 + i * (larg / DOBRAS) + 4, base - h, larg / DOBRAS - 8, h);
      }
      var yEmb = base - Math.max(1, (est.embaralhado / topo) * altMax);
      ctx.strokeStyle = escuro ? "#d98a8a" : "#a83232";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, yEmb); ctx.lineTo(x0 + larg, yEmb); ctx.stroke();
      ctx.fillStyle = escuro ? "#d98a8a" : "#a83232";
      ctx.fillText("embaralhado: " + est.embaralhado.toFixed(2), x0 + larg - 118, yEmb - 4);
    }

    function texto() {
      var m = media(est.maes);
      placar.textContent =
        (est.quebra ? "série com quebra de regime" : "série sem quebra") +
        " · dobras concluídas " + est.maes.length + " de " + DOBRAS +
        (est.maes.length ? " · MAE da última dobra " + est.maes[est.maes.length - 1].toFixed(2) : "") +
        " · MAE médio da origem móvel " + m.toFixed(2) +
        " · MAE da divisão embaralhada " + est.embaralhado.toFixed(2) +
        (est.parou
          ? " · o embaralhado é " + (m / est.embaralhado).toFixed(1) + " vezes menor que a verdade"
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      est.maes.push(dobraMovel(linhas(est.serie), est.dobra));
      est.dobra++;
      if (est.dobra >= DOBRAS) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(quebra) {
      est.quebra = quebra;
      est.serie = gerar(quebra);
      est.embaralhado = embaralhada(linhas(est.serie));
      est.dobra = 0; est.maes = []; est.parou = false;
      rel.comecar(DOBRAS + 2);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bQuebra.textContent = est.quebra ? "Voltar à série sem quebra"
                                       : "E se houvesse uma quebra de regime?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.quebra); });
    bQuebra = botao("E se houvesse uma quebra de regime?", function () { rodar(!est.quebra); });

    rel = relogio(cv, passo, function () { desenhar(); }, 180);
    est.serie = gerar(false);
    est.embaralhado = embaralhada(linhas(est.serie));
    desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }

  // A animação do capítulo II.8: o custo do falso negativo subindo de 1 a 10, e o
  // LIMIAR ÓTIMO andando por causa disso. O modelo não muda em nenhum quadro; o
  // que muda é quanto dói cada tipo de erro.
  //
  // O leitor erra a previsão na DIREÇÃO. Perguntado o que acontece com o limiar
  // quando errar por omissão fica dez vezes mais caro, a resposta intuitiva é
  // "sobe, é preciso ter mais certeza". Ele desce, porque o que ficou caro foi
  // deixar passar. E há um segundo erro dentro do primeiro: quem mantém 0,50 "por
  // padrão" não fica parado, fica cada vez mais caro.
  //
  // Os escores são CALIBRADOS por construção (sorteia-se s, depois y ~ Bernoulli(s)),
  // e isso não é conveniência: com escore calibrado o limiar ótimo tem forma
  // fechada, 1/(1+custo). A animação passa a exibir um resultado conferível em vez
  // de uma tendência, e o teste confere a curva medida contra a fórmula. O segundo
  // botão espreme os escores para o meio, e é aí que a fórmula deixa de valer —
  // que é a terceira pergunta do capítulo II.1 aparecendo como consequência de
  // dinheiro, e não como refinamento técnico.
  function animaCusto(area, cfg) {
    var W = 460, H = 300, PAD = 26;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bCal;
    var N = 4000, GRID = 200, C0 = 1, C1 = 10, PASSO = 0.25, POR = 1000;
    var BASE = (function () {
      var r = rng(19), v = [], i, s;
      for (i = 0; i < N; i++) {
        s = Math.min(0.95, Math.max(0.02, (r() + r() + r()) / 3 * 0.6));
        v.push({ s: s, y: r() < s ? 1 : 0 });           // calibrado por construção
      }
      return v;
    })();
    var est = { custo: C0, trilha: [], parou: false, espremido: false, dados: BASE };

    /** Espremer o escore para perto de 0,3 preserva a ORDEM e mata a calibração. */
    function espremer(v) {
      return v.map(function (p) { return { s: 0.3 + (p.s - 0.3) * 0.25, y: p.y }; });
    }

    /** Custo esperado por mil casos, com o falso positivo valendo 1. */
    function gasto(lim, cFN) {
      var fp = 0, fn = 0, i, d = est.dados;
      for (i = 0; i < N; i++) {
        if (d[i].s >= lim) { if (!d[i].y) fp++; }
        else if (d[i].y) fn++;
      }
      return (fp + fn * cFN) / N * POR;
    }

    function otimo(cFN) {
      var melhor = null, i, lim, g;
      for (i = 0; i <= GRID; i++) {
        lim = i / GRID;
        g = gasto(lim, cFN);
        if (melhor == null || g < melhor.g) melhor = { lim: lim, g: g };
      }
      return melhor;
    }

    function desenhar() {
      var escuro = temaEscuro(), i, p, c;
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var base = H - PAD - 18, alt = base - PAD - 28;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText((est.espremido ? "escore espremido" : "escore calibrado") +
                   " · limiar ótimo medido, contra 1/(1+custo)", x0, PAD + 12);
      function px(cc) { return x0 + ((cc - C0) / (C1 - C0)) * larg; }
      function py(l) { return base - l * alt; }
      ctx.strokeStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath();
      for (i = 0; i <= 60; i++) {
        c = C0 + (C1 - C0) * i / 60;
        if (i === 0) ctx.moveTo(px(c), py(1 / (1 + c))); else ctx.lineTo(px(c), py(1 / (1 + c)));
      }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = escuro ? "#8fb8dd" : "#35618e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      est.trilha.forEach(function (q, j) {
        if (j === 0) ctx.moveTo(px(q.c), py(q.lim)); else ctx.lineTo(px(q.c), py(q.lim));
      });
      ctx.stroke();
      p = est.trilha[est.trilha.length - 1];
      if (p) {
        ctx.fillStyle = escuro ? "#e6e6e4" : "#1c1c1c";
        ctx.beginPath(); ctx.arc(px(p.c), py(p.lim), 3.5, 0, 6.2832); ctx.fill();
      }
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("custo do FN = 1", x0, base + 14);
      ctx.fillText("= 10", x0 + larg - 24, base + 14);
      ctx.fillText("limiar 1,0", x0, PAD + 26);
      ctx.fillText("limiar 0,0", x0, base - 3);
    }

    function texto() {
      var p = est.trilha[est.trilha.length - 1];
      if (!p) { placar.textContent = "pronto para rodar"; return; }
      placar.textContent =
        (est.espremido ? "escore espremido" : "escore calibrado") +
        " · custo do falso negativo " + p.c.toFixed(2) +
        " · limiar ótimo " + p.lim.toFixed(3) +
        " · a fórmula 1/(1+custo) dá " + (1 / (1 + p.c)).toFixed(3) +
        " · custo por " + POR + " casos " + p.g.toFixed(1) +
        " · mantendo 0,50 seria " + p.g50.toFixed(1) +
        (est.parou
          ? " · no custo " + C1 + ", manter 0,50 sai " + (p.g50 - p.g).toFixed(1) +
            " mais caro por " + POR + " casos"
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var o = otimo(est.custo);
      est.trilha.push({ c: est.custo, lim: o.lim, g: o.g, g50: gasto(0.5, est.custo) });
      est.custo += PASSO;
      if (est.custo > C1 + 1e-9) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(espremido) {
      est.espremido = espremido;
      est.dados = espremido ? espremer(BASE) : BASE;
      est.custo = C0; est.trilha = []; est.parou = false;
      rel.comecar(Math.ceil((C1 - C0) / PASSO) + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bCal.textContent = est.espremido ? "Voltar ao escore calibrado"
                                       : "E se o escore não fosse calibrado?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.espremido); });
    bCal = botao("E se o escore não fosse calibrado?", function () { rodar(!est.espremido); });

    rel = relogio(cv, passo, function () { desenhar(); }, 90);
    desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }

  // A animação do capítulo V.3: os dias passando, com o PSI da entrada e a AUC
  // real do modelo na mesma linha do tempo. O PSI se calcula hoje; a AUC exige o
  // rótulo, que chega semanas depois. A distância entre as duas linhas verticais
  // é o adiantamento que o monitoramento compra.
  //
  // O segundo botão é o que impede a animação de virar propaganda de PSI. A MESMA
  // deriva de entrada roda nos dois modos, com o mesmo PSI dia a dia; no primeiro
  // a AUC desaba junto, no segundo ela não se mexe. É a frase do próprio capítulo,
  // medida em vez de afirmada: deriva de entrada não implica queda de desempenho.
  // Um alarme que dispara nos dois casos é alarme, não veredito.
  function animaDeriva(area, cfg) {
    var W = 460, H = 300, PAD = 26;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bTipo;
    var DIAS = 60, POR_DIA = 2000, FAIXAS = 10, LIM_PSI = 0.25, W1 = 1.8;
    var CALMA = 5, JANELA = 3, QUEDA = 0.05;   // dias de referência, suavização, queda
    var LATENCIA = 21;                         // dias até o rótulo chegar
    // O adiantamento NÃO vem de o PSI se mexer antes da AUC: medido, os dois
    // cruzam no mesmo dia 32. Vem de o PSI ser observável HOJE e a AUC exigir o
    // rótulo, que chega 21 dias depois. Inventar uma dianteira para o PSI seria
    // mais bonito e seria mentira; o mecanismo verdadeiro é a latência, e é o que
    // o capítulo já diz: enquanto o rótulo não chega, sobra o que não depende dele.
    var est = { doi: true, dia: 0, psi: [], auc: [], ref: null, parou: false,
                diaPSI: null, diaAUC: null, auc0: null };

    function normal(r) {
      var u = Math.max(1e-12, r()), v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v);
    }

    /** Deslocamento da entrada no dia d: parado, depois rampa. Igual nos dois modos. */
    function desloc(d) { return d < 20 ? 0 : Math.min(1.5, (d - 20) / 30 * 1.5); }

    /** Quanto do sinal ainda vale no dia d. Só o modo "dói" o corrói. */
    function forca(d, doi) { return doi ? Math.max(0.15, 1 - Math.max(0, d - 20) / 40) : 1; }

    function dia(d, doi) {
      var r = rng(1000 + d), x = [], y = [], i, xi, p;
      for (i = 0; i < POR_DIA; i++) {
        xi = normal(r) + desloc(d);
        p = 1 / (1 + Math.exp(-W1 * forca(d, doi) * xi));
        x.push(xi); y.push(r() < p ? 1 : 0);
      }
      return { x: x, y: y };
    }

    function hist(x) {
      var h = [], i, k;
      for (i = 0; i < FAIXAS; i++) h.push(0);
      for (i = 0; i < x.length; i++) {
        k = Math.floor((x[i] + 3) / 6 * FAIXAS);
        h[Math.min(FAIXAS - 1, Math.max(0, k))]++;
      }
      return h.map(function (c) { return Math.max(c / x.length, 1e-4); });
    }

    function psi(a, b) {
      var s = 0, i;
      for (i = 0; i < a.length; i++) s += (b[i] - a[i]) * Math.log(b[i] / a[i]);
      return s;
    }

    function media(v) {
      var s = 0, i; for (i = 0; i < v.length; i++) s += v[i];
      return v.length ? s / v.length : 0;
    }

    /** AUC pelo posto: probabilidade de um positivo receber escore maior. */
    function auc(x, y) {
      var p = x.map(function (xi, i) { return { s: xi, y: y[i] }; });
      p.sort(function (u, v) { return u.s - v.s; });
      var np = 0, nn = 0, soma = 0, i;
      for (i = 0; i < p.length; i++) {
        if (p[i].y) { np++; soma += nn; } else nn++;
      }
      return (np && nn) ? soma / (np * nn) : 0.5;
    }

    function desenhar() {
      var escuro = temaEscuro();
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var base = H - PAD - 18, alt = base - PAD - 28;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText((est.doi ? "deriva que DÓI" : "deriva que NÃO dói") +
                   " · PSI (laranja) e AUC real (azul)", x0, PAD + 12);
      function px(d) { return x0 + (d / (DIAS - 1)) * larg; }
      var yLim = base - (LIM_PSI / 0.8) * alt;
      ctx.strokeStyle = escuro ? "#3a3b3f" : "#dcdbd7";
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yLim); ctx.lineTo(x0 + larg, yLim); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("PSI 0,25", x0 + larg - 46, yLim - 3);
      ctx.strokeStyle = escuro ? "#e0a24a" : "#b8761f";
      ctx.lineWidth = 2; ctx.beginPath();
      est.psi.forEach(function (v, d) {
        var py = base - Math.min(1, v / 0.8) * alt;
        if (d === 0) ctx.moveTo(px(d), py); else ctx.lineTo(px(d), py);
      });
      ctx.stroke();
      ctx.strokeStyle = escuro ? "#8fb8dd" : "#35618e";
      ctx.beginPath();
      est.auc.forEach(function (v, d) {
        var py = base - Math.max(0, Math.min(1, (v - 0.5) / 0.45)) * alt;
        if (d === 0) ctx.moveTo(px(d), py); else ctx.lineTo(px(d), py);
      });
      ctx.stroke();
      [[est.diaPSI, escuro ? "#e0a24a" : "#b8761f"],
       [est.diaAUC, escuro ? "#8fb8dd" : "#35618e"]].forEach(function (m) {
        if (m[0] == null) return;
        ctx.strokeStyle = m[1]; ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(m[0]), PAD + 18); ctx.lineTo(px(m[0]), base);
        ctx.stroke(); ctx.setLineDash([]);
      });
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("dia 0", x0, base + 14);
      ctx.fillText("dia " + (DIAS - 1), x0 + larg - 32, base + 14);
    }

    function texto() {
      var d = est.psi.length - 1;
      placar.textContent =
        (est.doi ? "deriva que dói" : "deriva que não dói") +
        " · dia " + (d < 0 ? 0 : d) +
        (d >= 0 ? " · PSI " + est.psi[d].toFixed(3) + " · AUC " + est.auc[d].toFixed(3) : "") +
        (est.diaPSI != null ? " · PSI cruzou 0,25 no dia " + est.diaPSI
                            : " · PSI ainda abaixo de 0,25") +
        (est.diaAUC != null
          ? " · a AUC caiu 5 pontos no dia " + est.diaAUC +
            " · com o rótulo levando " + LATENCIA + " dias, você só saberia no dia " +
            (est.diaAUC + LATENCIA) +
            " · o PSI avisou " + (est.diaAUC + LATENCIA - est.diaPSI) + " dias antes"
          : (est.parou ? " · a AUC nunca caiu 5 pontos" : ""));
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var d = est.dia, dd = dia(d, est.doi);
      var a = auc(dd.x, dd.y), p = psi(est.ref, hist(dd.x));
      est.psi.push(p); est.auc.push(a);
      // A referência é a MÉDIA dos primeiros dias, e a detecção usa média móvel.
      // Com um dia só de referência e leitura de um dia só, o ruído amostral
      // dispara "queda" no dia 9 até na deriva que não dói: o alarme mediria
      // sorteio. Foi o primeiro defeito desta animação, e ele invertia o sinal
      // do adiantamento.
      if (d === CALMA - 1) est.auc0 = media(est.auc.slice(0, CALMA));
      if (est.diaPSI == null && p >= LIM_PSI) est.diaPSI = d;
      if (est.diaAUC == null && est.auc0 != null && d >= CALMA + JANELA - 1 &&
          media(est.auc.slice(d - JANELA + 1, d + 1)) <= est.auc0 - QUEDA) est.diaAUC = d;
      est.dia++;
      if (est.dia >= DIAS) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(doi) {
      est.doi = doi; est.dia = 0; est.psi = []; est.auc = [];
      est.diaPSI = null; est.diaAUC = null; est.auc0 = null; est.parou = false;
      est.ref = hist(dia(0, doi).x);
      rel.comecar(DIAS + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bTipo.textContent = est.doi ? "E se a deriva não doesse?" : "Voltar à deriva que dói";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.doi); });
    bTipo = botao("E se a deriva não doesse?", function () { rodar(!est.doi); });

    rel = relogio(cv, passo, function () { desenhar(); }, 45);
    est.ref = hist(dia(0, true).x);
    desenhar(); texto();
    rel.aoChegar(function () { rodar(true); });
  }

  // A animação do capítulo I.5: as barras da satisfação do cliente do exercício
  // deste capítulo (88,1 · 88,4 · 88,9 · 89,2), com a BASE do eixo subindo de 0
  // até rente à menor delas. Os quatro valores não mudam em quadro nenhum.
  //
  // O que o leitor erra ao prever não é a direção, que todo mundo acerta: é a
  // MAGNITUDE. A razão real entre a maior e a menor barra é 1,0125; com a base em
  // 88, a razão do que se vê na tela é 12. E o segundo botão mostra o corolário
  // que quase nunca se diz: com dados que têm diferença real grande, o mesmo
  // truque acrescenta pouco. **O eixo truncado paga mais quando há menos a
  // mostrar**, que é exatamente quando alguém tem motivo para usá-lo.
  function animaEixo(area, cfg) {
    var W = 460, H = 300, PAD = 26;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bDados;
    // Os números são os do exercício deste capítulo, e a varredura termina na
    // base 88 que ele descreve. Assim a animação e o exercício respondem à mesma
    // pergunta, e um confere o outro.
    var SERIE = { rot: "satisfação do cliente", v: [88.1, 88.4, 88.9, 89.2],
                  rots: ["T1", "T2", "T3", "T4"] };
    var BASE_FIM = 88, PASSOS = 60;
    var est = { linha: false, i: 0, base: 0, parou: false };

    function dados() { return SERIE; }
    function menor() { return Math.min.apply(null, dados().v); }
    function maior() { return Math.max.apply(null, dados().v); }

    function baseDe(i) { return (i / PASSOS) * BASE_FIM; }

    function razaoVista(base) {
      var lo = menor() - base, hi = maior() - base;
      return lo > 1e-9 ? hi / lo : Infinity;
    }

    function desenhar() {
      var escuro = temaEscuro(), d = dados(), i, h;
      var x0 = PAD + 10, larg = W - 2 * PAD - 20;
      var base = H - PAD - 22, alt = base - PAD - 30;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText(d.rot + " · " + (est.linha ? "linha" : "barra") +
                   " · base do eixo em " + est.base.toFixed(1), x0, PAD + 14);
      var lo = est.base, hi = maior() + (maior() - menor()) * 0.3;
      var passoX = larg / d.v.length;
      if (est.linha) {
        ctx.strokeStyle = escuro ? "#8fb8dd" : "#35618e";
        ctx.lineWidth = 2; ctx.beginPath();
        for (i = 0; i < d.v.length; i++) {
          h = Math.max(0, (d.v[i] - lo) / (hi - lo)) * alt;
          var pxi = x0 + i * passoX + passoX / 2;
          if (i === 0) ctx.moveTo(pxi, base - h); else ctx.lineTo(pxi, base - h);
        }
        ctx.stroke();
      } else {
        for (i = 0; i < d.v.length; i++) {
          h = Math.max(0, (d.v[i] - lo) / (hi - lo)) * alt;
          ctx.fillStyle = escuro ? "#8fb8dd" : "#35618e";
          ctx.fillRect(x0 + i * passoX + 12, base - h, passoX - 24, h);
        }
      }
      for (i = 0; i < d.v.length; i++) {
        ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
        ctx.fillText(d.rots[i] + "  " + d.v[i], x0 + i * passoX + 12, base + 14);
      }
      ctx.strokeStyle = escuro ? "#3a3b3f" : "#dcdbd7";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, base); ctx.lineTo(x0 + larg, base); ctx.stroke();
    }

    function texto() {
      var d = dados(), rv = razaoVista(est.base), real = maior() / menor();
      placar.textContent =
        d.rot + " · " + (est.linha ? "linha" : "barra") +
        " · valores " + d.v.join(" · ") + " (inalterados)" +
        " · base do eixo " + est.base.toFixed(1) +
        " · razão real entre a maior e a menor " + real.toFixed(4) +
        (est.linha
          ? " · na linha o comprimento não codifica nada, e a razão de alturas deixa de significar"
          : " · razão das alturas na tela " + (isFinite(rv) ? rv.toFixed(2) : "infinita")) +
        (est.parou && !est.linha
          ? " · na base " + BASE_FIM + " o exagero é de " + (rv / real).toFixed(1) + " vezes"
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      est.base = baseDe(est.i);
      est.i++;
      if (est.i > PASSOS) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(linha) {
      est.linha = linha; est.i = 0; est.base = 0; est.parou = false;
      rel.comecar(PASSOS + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bDados.textContent = est.linha ? "Voltar para barra" : "E se fosse uma linha?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.linha); });
    bDados = botao("E se fosse uma linha?", function () { rodar(!est.linha); });

    rel = relogio(cv, passo, function () { desenhar(); }, 70);
    desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }

  // A animação do capítulo II.3: dado linearmente separável, descida de gradiente
  // na entropia cruzada, e três números na tela — a norma de w, a perda e a
  // acurácia. A acurácia congela em 1,000 nas primeiras dezenas de passos; a
  // perda continua caindo; e a norma de w continua crescendo, sem parar.
  //
  // O leitor erra a previsão numa pergunta que parece boba: "a perda ainda está
  // caindo, então o modelo ainda está melhorando?" Não está. Ele está ficando
  // mais CONFIANTE sobre a mesma fronteira, e nada mais. Com dado separável o
  // máximo da verossimilhança não existe em ponto nenhum: a perda tende a zero
  // com a norma indo ao infinito, e é isso que "não há solução fechada" (O3)
  // quer dizer na prática.
  //
  // O segundo botão liga a penalização L2. A norma para de crescer, a perda
  // estabiliza acima de zero, e a fronteira é a mesma. É o argumento inteiro de
  // por que regularizar não é um detalhe de ajuste fino.
  function animaSeparavel(area, cfg) {
    var W = 460, H = 300, PAD = 26;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bReg;
    var N = 200, PASSOS = 400, ETA = 0.5, LAMBDA = 0.02;
    var DADOS = (function () {
      var r = rng(23), v = [], i, x1, x2, y;
      for (i = 0; i < N; i++) {
        y = i % 2;
        x1 = (r() * 2 - 1) * 1.6;
        x2 = (r() * 0.9 + 0.06) * (y ? 1 : -1);      // margem estreita: separável, mas não de graça
        v.push({ x: [x1, x2], y: y });
      }
      return v;
    })();
    var est = { reg: false, i: 0, w: [0, 0], b: 0, hist: [], parou: false,
                iAcc: null, perda: 1, acc: 0, norma: 0 };

    function sig(z) { return 1 / (1 + Math.exp(-z)); }

    function medir() {
      var s = 0, ac = 0, i, z, p;
      for (i = 0; i < N; i++) {
        z = est.w[0] * DADOS[i].x[0] + est.w[1] * DADOS[i].x[1] + est.b;
        p = sig(z);
        s -= DADOS[i].y ? Math.log(Math.max(p, 1e-12)) : Math.log(Math.max(1 - p, 1e-12));
        if ((p >= 0.5 ? 1 : 0) === DADOS[i].y) ac++;
      }
      est.perda = s / N;
      est.acc = ac / N;
      est.norma = Math.sqrt(est.w[0] * est.w[0] + est.w[1] * est.w[1]);
    }

    function iterar() {
      var g0 = 0, g1 = 0, gb = 0, i, z, p, e;
      for (i = 0; i < N; i++) {
        z = est.w[0] * DADOS[i].x[0] + est.w[1] * DADOS[i].x[1] + est.b;
        p = sig(z); e = p - DADOS[i].y;
        g0 += e * DADOS[i].x[0]; g1 += e * DADOS[i].x[1]; gb += e;
      }
      g0 /= N; g1 /= N; gb /= N;
      if (est.reg) { g0 += LAMBDA * est.w[0]; g1 += LAMBDA * est.w[1]; }
      est.w[0] -= ETA * g0; est.w[1] -= ETA * g1; est.b -= ETA * gb;
    }

    function desenhar() {
      var escuro = temaEscuro(), i, h;
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var base = H - PAD - 20, alt = base - PAD - 28;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText((est.reg ? "com penalização L2" : "sem penalização") +
                   " · norma de w (laranja) e perda (azul)", x0, PAD + 12);
      var maxN = 1;
      est.hist.forEach(function (q) { if (q.n > maxN) maxN = q.n; });
      ctx.strokeStyle = escuro ? "#e0a24a" : "#b8761f";
      ctx.lineWidth = 2; ctx.beginPath();
      est.hist.forEach(function (q, j) {
        var px = x0 + (j / PASSOS) * larg, py = base - (q.n / maxN) * alt;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.strokeStyle = escuro ? "#8fb8dd" : "#35618e";
      ctx.beginPath();
      est.hist.forEach(function (q, j) {
        var px = x0 + (j / PASSOS) * larg, py = base - (q.p / 0.7) * alt;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      if (est.iAcc != null) {
        ctx.strokeStyle = escuro ? "#87b89a" : "#2f7d4f";
        ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
        h = x0 + (est.iAcc / PASSOS) * larg;
        ctx.beginPath(); ctx.moveTo(h, PAD + 18); ctx.lineTo(h, base); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = escuro ? "#87b89a" : "#2f7d4f";
        ctx.fillText("acurácia 1,000 desde o passo " + est.iAcc, h + 4, PAD + 30);
      }
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("passo 0", x0, base + 14);
      ctx.fillText("passo " + PASSOS, x0 + larg - 48, base + 14);
    }

    function texto() {
      placar.textContent =
        (est.reg ? "com penalização L2" : "sem penalização") +
        " · passo " + est.i +
        " · norma de w " + est.norma.toFixed(2) +
        " · perda " + est.perda.toFixed(4) +
        " · acurácia " + est.acc.toFixed(3) +
        (est.iAcc != null ? " · a acurácia chegou a 1,000 no passo " + est.iAcc : "") +
        (est.parou
          ? (est.reg
              ? " · a norma parou de crescer"
              : " · e a norma seguiu crescendo por mais " + (PASSOS - est.iAcc) + " passos sem mexer na acurácia")
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      iterar(); medir();
      if (est.iAcc == null && est.acc >= 1) est.iAcc = est.i;
      est.hist.push({ n: est.norma, p: est.perda });
      est.i++;
      if (est.i >= PASSOS) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(reg) {
      est.reg = reg; est.i = 0; est.w = [0, 0]; est.b = 0;
      est.hist = []; est.iAcc = null; est.parou = false;
      medir();
      rel.comecar(PASSOS + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bReg.textContent = est.reg ? "Tirar a penalização" : "E se houvesse penalização L2?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.reg); });
    bReg = botao("E se houvesse penalização L2?", function () { rodar(!est.reg); });

    rel = relogio(cv, passo, function () { desenhar(); }, 20);
    medir(); desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }




  // A animação do capítulo II.2: a descida de gradiente perseguindo a resposta que
  // as equações normais já entregaram. Na tela, a soma dos quadrados caindo e a
  // DISTÂNCIA até o ótimo fechado, que é o número que importa.
  //
  // O leitor erra a previsão sobre a velocidade. Com dois atributos fortemente
  // correlacionados, a superfície é um vale comprido e estreito, e o gradiente
  // leva milhares de passos para chegar onde a álgebra chega numa conta. O botão
  // padroniza os atributos, e os mesmos passos passam a bastar. O que mudou não
  // foi o otimizador: foi o CONDICIONAMENTO do problema, que é um assunto do dado
  // e não do algoritmo.
  //
  // O ótimo fechado é calculado aqui pelas equações normais 2x2 resolvidas na
  // mão, para que o alvo da distância seja o mesmo objeto que a seção acima
  // deriva, e não um "melhor até agora".
  function animaNormais(area, cfg) {
    var W = 460, H = 300, PAD = 26;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bPad;
    var N = 300, QUADROS = 400, LOTE = 10, PASSOS = QUADROS * LOTE;
    // Cada regime recebe o MAIOR passo estável (1/L, com L o maior autovalor da
    // hessiana 2XᵀX/N, por iteração de potência). Sem isso a comparação seria
    // fraudulenta nos dois sentidos: com passo fixo pequeno, o padronizado
    // pareceria lento à toa; com passo fixo grande, o bruto DIVERGE (medi: soma
    // dos quadrados a 8e196 em 400 passos). Dando a cada um o seu melhor passo,
    // o que sobra na comparação é só o condicionamento, que é a variável que a
    // seção discute.
    var BRUTO = (function () {
      var r = rng(41), v = [], i, a, b, ruido;
      for (i = 0; i < N; i++) {
        a = r() * 10;
        b = a * 0.97 + (r() - 0.5) * 0.6;             // segundo atributo quase colinear
        ruido = (r() - 0.5) * 2;
        v.push({ x: [a, b], y: 1.5 * a - 0.8 * b + 3 + ruido });
      }
      return v;
    })();
    var est = { pad: false, i: 0, w: [0, 0], b: 0, otimo: null, hist: [], parou: false,
                dist: 0, sse: 0, passo90: null, eta: 0, sseOtimo: 1 };

    function dados() {
      if (!est.pad) return BRUTO;
      var m = [0, 0], s = [0, 0], i, k;
      for (k = 0; k < 2; k++) {
        for (i = 0; i < N; i++) m[k] += BRUTO[i].x[k];
        m[k] /= N;
        for (i = 0; i < N; i++) s[k] += Math.pow(BRUTO[i].x[k] - m[k], 2);
        s[k] = Math.sqrt(s[k] / N) || 1;
      }
      return BRUTO.map(function (p) {
        return { x: [(p.x[0] - m[0]) / s[0], (p.x[1] - m[1]) / s[1]], y: p.y };
      });
    }

    /** Equações normais 2x2 com intercepto, por centragem e regra de Cramer. */
    function normais(D) {
      var mx = [0, 0], my = 0, i, k;
      for (i = 0; i < N; i++) { mx[0] += D[i].x[0]; mx[1] += D[i].x[1]; my += D[i].y; }
      mx[0] /= N; mx[1] /= N; my /= N;
      var a = 0, bb = 0, c = 0, d0 = 0, d1 = 0, u, v, w;
      for (i = 0; i < N; i++) {
        u = D[i].x[0] - mx[0]; v = D[i].x[1] - mx[1]; w = D[i].y - my;
        a += u * u; bb += u * v; c += v * v; d0 += u * w; d1 += v * w;
      }
      var det = a * c - bb * bb;
      var w0 = (d0 * c - bb * d1) / det, w1 = (a * d1 - bb * d0) / det;
      return { w: [w0, w1], b: my - w0 * mx[0] - w1 * mx[1], cond: (a + c) / Math.max(det / (a + c), 1e-12) };
    }

    function sseDe(D, w, b) {
      var s = 0, i, e;
      for (i = 0; i < N; i++) {
        e = w[0] * D[i].x[0] + w[1] * D[i].x[1] + b - D[i].y;
        s += e * e;
      }
      return s / N;
    }

    // A "distância" é o EXCESSO RELATIVO de erro sobre o ótimo fechado, e não a
    // distância entre vetores de peso. Padronizar troca a parametrização: o
    // intercepto ótimo passa a ser a média de y, e comparar ‖w − w*‖ entre os
    // dois regimes compararia réguas diferentes. O excesso de erro é invariante
    // a essa troca, e é a moeda que o método de fato minimiza.
    function medir(D) {
      est.sse = sseDe(D, est.w, est.b);
      est.dist = (est.sse - est.sseOtimo) / est.sseOtimo;
    }

    /** Maior autovalor de 2XᵀX/N (com a coluna do intercepto), por potência. */
    function maiorAutovalor(D) {
      var v = [1, 1, 1], i, k, it, s, novo, dot;
      for (it = 0; it < 60; it++) {
        novo = [0, 0, 0];
        for (i = 0; i < N; i++) {
          var xi = [D[i].x[0], D[i].x[1], 1];
          dot = xi[0] * v[0] + xi[1] * v[1] + xi[2] * v[2];
          for (k = 0; k < 3; k++) novo[k] += 2 * xi[k] * dot / N;
        }
        s = Math.sqrt(novo[0] * novo[0] + novo[1] * novo[1] + novo[2] * novo[2]);
        if (s < 1e-12) break;
        v = [novo[0] / s, novo[1] / s, novo[2] / s];
      }
      return s || 1;
    }

    function iterar(D, eta) {
      var g0 = 0, g1 = 0, gb = 0, i, e;
      for (i = 0; i < N; i++) {
        e = est.w[0] * D[i].x[0] + est.w[1] * D[i].x[1] + est.b - D[i].y;
        g0 += e * D[i].x[0]; g1 += e * D[i].x[1]; gb += e;
      }
      est.w[0] -= eta * 2 * g0 / N; est.w[1] -= eta * 2 * g1 / N; est.b -= eta * 2 * gb / N;
    }

    function desenhar() {
      var escuro = temaEscuro();
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var base = H - PAD - 20, alt = base - PAD - 28;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText((est.pad ? "atributos padronizados" : "atributos como vieram") +
                   " · excesso de erro sobre o ótimo fechado (log)", x0, PAD + 12);
      ctx.strokeStyle = escuro ? "#8fb8dd" : "#35618e";
      ctx.lineWidth = 2; ctx.beginPath();
      est.hist.forEach(function (d, j) {
        var px = x0 + (j / QUADROS) * larg;
        var py = base - Math.max(0, Math.min(1, (Math.log10(Math.max(d, 1e-6)) + 6) / 7)) * alt;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("passo 0", x0, base + 14);
      ctx.fillText("passo " + PASSOS, x0 + larg - 48, base + 14);
      ctx.fillText("1e1", x0 + larg - 26, base - alt + 8);
      ctx.fillText("1e-6", x0 + larg - 30, base - 3);
    }

    function texto() {
      placar.textContent =
        (est.pad ? "atributos padronizados" : "atributos como vieram") +
        " · passo " + est.i +
        " · passo de " + est.eta.toExponential(1) +
        " · soma dos quadrados por ponto " + est.sse.toFixed(4) +
        " · excesso de erro sobre o ótimo fechado " + est.dist.toExponential(2) +
        (est.passo90 != null
          ? " · chegou a 1% de excesso no passo " + est.passo90
          : (est.parou ? " · nunca chegou a 1% de excesso em " + PASSOS + " passos" : ""));
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var D = dados(), k;
      // Cada quadro dá LOTE passos: a lição precisa de milhares de iterações
      // para aparecer, e ninguém assiste a milhares de quadros.
      for (k = 0; k < LOTE; k++) { iterar(D, est.eta); est.i++; }
      medir(D);
      if (est.passo90 == null && est.dist < 0.01) est.passo90 = est.i;
      est.hist.push(est.dist);
      if (est.i >= PASSOS) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(pad) {
      est.pad = pad; est.i = 0; est.w = [0, 0]; est.b = 0;
      est.hist = []; est.passo90 = null; est.parou = false;
      var D = dados();
      est.otimo = normais(D);
      est.sseOtimo = sseDe(D, est.otimo.w, est.otimo.b);
      est.eta = 1 / maiorAutovalor(D);
      medir(D);
      rel.comecar(PASSOS + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bPad.textContent = est.pad ? "Voltar aos atributos como vieram"
                                 : "E se os atributos fossem padronizados?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.pad); });
    bPad = botao("E se os atributos fossem padronizados?", function () { rodar(!est.pad); });

    rel = relogio(cv, passo, function () { desenhar(); }, 20);
    est.otimo = normais(dados());
    est.sseOtimo = sseDe(dados(), est.otimo.w, est.otimo.b);
    est.eta = 1 / maiorAutovalor(dados()); medir(dados());
    desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }


  // A animação do capítulo III.4: o filtro deslizando sobre a imagem, com o mapa
  // de ativação se pintando posição a posição, e o botão que desloca a imagem em
  // 3 pixels.
  //
  // Os dois modelos são TREINADOS aqui, com descida de gradiente, sobre um
  // conjunto em que a forma aparece SEMPRE NA MESMA POSIÇÃO. É a condição que o
  // capítulo descreve no "problema": ou você mostra o gato em todas as posições,
  // ou aprende um detector de gato-no-canto-esquerdo. Os dois chegam a acertar o
  // treino; o botão do deslocamento é que separa os dois.
  //
  // As contagens de parâmetros são calculadas dos próprios modelos, e não
  // escritas à mão: 16x16 ligado a uma unidade densa dá 256 + 1, e um filtro 5x5
  // dá 25 + 1. A razão entre elas é o assunto da seção, e ela não depende do
  // tamanho da imagem só do lado da convolução — o rodapé mostra a mesma conta
  // na escala do capítulo (224x224x3 contra o mesmo filtro).
  function animaConvolucao(area, cfg) {
    var W = 460, H = 300, PAD = 24;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bDesloc;
    var L = 16, K = 5, S = L - K + 1;          // imagem, filtro, mapa de ativação
    var P_DENSA = L * L + 1, P_CONV = K * K + 1;
    var POS_TREINO = [4, 4], DESLOC = 3;
    var est = { deslocado: false, i: 0, mapa: [], img: null, parou: false,
                densa: null, filtro: null, sDensa: 0, sConv: 0 };

    function vazia() {
      var v = [], i;
      for (i = 0; i < L * L; i++) v.push(0);
      return v;
    }

    /** Uma cruz 5x5 desenhada na posição (r, c) do canto superior esquerdo. */
    function forma(r, c, ruidoR) {
      var v = vazia(), i, j;
      for (i = 0; i < K; i++) {
        v[(r + 2) * L + (c + i)] = 1;
        v[(r + i) * L + (c + 2)] = 1;
      }
      if (ruidoR) for (i = 0; i < L * L; i++) v[i] += (ruidoR() - 0.5) * 0.3;
      return v;
    }

    function ruidoSo(r) {
      var v = vazia(), i;
      for (i = 0; i < L * L; i++) v[i] = (r() - 0.5) * 0.3 + (r() < 0.04 ? 1 : 0);
      return v;
    }

    function sig(z) { return 1 / (1 + Math.exp(-z)); }

    /** Treina a densa e o filtro no MESMO conjunto, com a forma sempre em (4,4). */
    function treinar() {
      var r = rng(77), lote = [], i, e;
      for (i = 0; i < 60; i++) {
        lote.push(i % 2
          ? { x: forma(POS_TREINO[0], POS_TREINO[1], r), y: 1 }
          : { x: ruidoSo(r), y: 0 });
      }
      var wD = [], bD = 0, wC = [], bC = 0;
      for (i = 0; i < L * L; i++) wD.push(0);
      for (i = 0; i < K * K; i++) wC.push(0);

      function maxConv(x, w, b) {
        var melhor = -1e9, rr, cc, a, ki, kj, arg = null;
        for (rr = 0; rr < S; rr++) for (cc = 0; cc < S; cc++) {
          a = b;
          for (ki = 0; ki < K; ki++) for (kj = 0; kj < K; kj++) {
            a += w[ki * K + kj] * x[(rr + ki) * L + (cc + kj)];
          }
          if (a > melhor) { melhor = a; arg = [rr, cc]; }
        }
        return { z: melhor, arg: arg };
      }

      var it, k, m, p, g;
      for (it = 0; it < 300; it++) {
        for (k = 0; k < lote.length; k++) {
          // densa
          var z = bD;
          for (i = 0; i < L * L; i++) z += wD[i] * lote[k].x[i];
          g = sig(z) - lote[k].y;
          for (i = 0; i < L * L; i++) wD[i] -= 0.05 * g * lote[k].x[i];
          bD -= 0.05 * g;
          // conv, com gradiente só pela janela vencedora do max
          m = maxConv(lote[k].x, wC, bC);
          g = sig(m.z) - lote[k].y;
          for (var ki2 = 0; ki2 < K; ki2++) for (var kj2 = 0; kj2 < K; kj2++) {
            wC[ki2 * K + kj2] -= 0.05 * g *
              lote[k].x[(m.arg[0] + ki2) * L + (m.arg[1] + kj2)];
          }
          bC -= 0.05 * g;
        }
      }
      return { densa: { w: wD, b: bD }, conv: { w: wC, b: bC }, maxConv: maxConv };
    }

    var MOD = treinar();

    function pontuarDensa(x) {
      var z = MOD.densa.b, i;
      for (i = 0; i < L * L; i++) z += MOD.densa.w[i] * x[i];
      return sig(z);
    }

    function ativacao(x, rr, cc) {
      var a = MOD.conv.b, ki, kj;
      for (ki = 0; ki < K; ki++) for (kj = 0; kj < K; kj++) {
        a += MOD.conv.w[ki * K + kj] * x[(rr + ki) * L + (cc + kj)];
      }
      return a;
    }

    function desenhar() {
      var escuro = temaEscuro(), i, j, v;
      var cel = 7, x0 = PAD + 4, y0 = PAD + 26;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText((est.deslocado ? "imagem deslocada em " + DESLOC + " px" : "imagem na posição do treino") +
                   " · o mesmo filtro em toda posição", x0, PAD + 14);
      // a imagem
      for (i = 0; i < L; i++) for (j = 0; j < L; j++) {
        v = Math.max(0, Math.min(1, est.img[i * L + j]));
        ctx.fillStyle = escuro ? "rgba(143,184,221," + v + ")" : "rgba(53,97,142," + v + ")";
        ctx.fillRect(x0 + j * cel, y0 + i * cel, cel - 1, cel - 1);
      }
      // a janela do filtro na posição da vez
      if (!est.parou && est.i < S * S) {
        var rr = (est.i / S) | 0, cc = est.i % S;
        ctx.strokeStyle = escuro ? "#e0a24a" : "#b8761f";
        ctx.lineWidth = 2;
        ctx.strokeRect(x0 + cc * cel - 1, y0 + rr * cel - 1, K * cel, K * cel);
      }
      // o mapa de ativação
      var mx0 = x0 + L * cel + 26, mcel = 9;
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("mapa de ativação", mx0, y0 - 6);
      var pico = 1e-6;
      est.mapa.forEach(function (a) { if (Math.abs(a) > pico) pico = Math.abs(a); });
      for (i = 0; i < est.mapa.length; i++) {
        v = Math.max(0, est.mapa[i]) / pico;
        ctx.fillStyle = escuro ? "rgba(224,162,74," + v + ")" : "rgba(184,118,31," + v + ")";
        ctx.fillRect(mx0 + (i % S) * mcel, y0 + ((i / S) | 0) * mcel, mcel - 1, mcel - 1);
      }
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText("densa: " + P_DENSA + " pesos", x0, H - PAD - 16);
      ctx.fillText("convolucional: " + P_CONV + " pesos", x0, H - PAD - 2);
    }

    function texto() {
      placar.textContent =
        (est.deslocado ? "imagem deslocada em " + DESLOC + " px" : "imagem na posição do treino") +
        " · parâmetros: densa " + P_DENSA + ", convolucional " + P_CONV +
        " · posições varridas " + Math.min(est.i, S * S) + " de " + S * S +
        (est.parou
          ? " · a densa dá " + est.sDensa.toFixed(3) +
            " e a convolucional dá " + est.sConv.toFixed(3)
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var rr = (est.i / S) | 0, cc = est.i % S;
      est.mapa.push(ativacao(est.img, rr, cc));
      est.i++;
      if (est.i >= S * S) {
        est.parou = true;
        est.sDensa = pontuarDensa(est.img);
        est.sConv = sig(Math.max.apply(null, est.mapa));
      }
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(deslocado) {
      var r = rng(5);
      est.deslocado = deslocado;
      est.img = deslocado
        ? forma(POS_TREINO[0] + DESLOC, POS_TREINO[1] + DESLOC, r)
        : forma(POS_TREINO[0], POS_TREINO[1], r);
      est.i = 0; est.mapa = []; est.parou = false;
      rel.comecar(S * S + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bDesloc.textContent = est.deslocado ? "Voltar à posição do treino"
                                          : "E se a imagem andasse " + DESLOC + " px?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.deslocado); });
    bDesloc = botao("E se a imagem andasse " + DESLOC + " px?", function () {
      rodar(!est.deslocado);
    });

    rel = relogio(cv, passo, function () { desenhar(); }, 18);
    est.img = forma(POS_TREINO[0], POS_TREINO[1], rng(5));
    desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }


  // A animação do capítulo IV.2: Q-learning num grid, um episódio por quadro, com
  // a recompensa média e o ε caindo. O botão põe ε em zero desde o começo.
  //
  // O leitor erra a previsão porque a intuição de otimização diz que explorar é
  // desperdício: sem exploração o agente iria "direto ao ponto". O mundo tem duas
  // saídas, uma perto valendo pouco e uma longe valendo muito, e o agente guloso
  // encontra a de perto primeiro. A partir daí ele nunca mais tenta outra coisa,
  // porque a melhor ação CONHECIDA já é positiva. Ele não fica preso por burrice:
  // fica preso porque a única informação que poderia tirá-lo dali só apareceria
  // numa ação que ele deixou de tomar.
  //
  // Os dois modos partem da MESMA tabela Q inicial e do mesmo fluxo de sorteios,
  // para que a diferença seja o ε e nada mais.
  function animaExploracao(area, cfg) {
    var W = 460, H = 300, PAD = 24;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bEps;
    var G = 7, EPISODIOS = 600, MAX_PASSOS = 100;
    // A saída pequena fica LONGE da largada de propósito. Na primeira versão ela
    // estava em (1,1), colada no início, e virava uma armadilha absorvente que
    // pegava os dois modos: até com ε = 1 o passeio aleatório caía nela nos
    // primeiros passos, e o agente que explora nunca chegava ao +1,0. A lição
    // exige que explorar seja POSSÍVEL, senão a animação só mostra que o mundo
    // é cruel.
    var PERTO = [0, 5], LONGE = [6, 6], R_PERTO = 0.25, R_LONGE = 1.5;
    var ALFA = 0.3, GAMA = 0.97, PASSO_CUSTO = -0.01;
    var DX = [0, 0, 1, -1], DY = [1, -1, 0, 0];
    var est = { semEps: false, ep: 0, Q: null, hist: [], parou: false,
                eps: 1, media: 0, achouLonge: 0, achouPerto: 0 };

    function novoQ() {
      var r = rng(13), Q = [], i, a;
      for (i = 0; i < G * G; i++) {
        Q.push([]);
        for (a = 0; a < 4; a++) Q[i].push(r() * 0.01);
      }
      return Q;
    }

    function melhor(Q, s) {
      var b = 0, a;
      for (a = 1; a < 4; a++) if (Q[s][a] > Q[s][b]) b = a;
      return b;
    }

    function episodio(r, eps) {
      var x = 0, y = 0, k, s, a, nx, ny, ns, rec, total = 0, fim = null;
      for (k = 0; k < MAX_PASSOS; k++) {
        s = y * G + x;
        a = (r() < eps) ? Math.floor(r() * 4) : melhor(est.Q, s);
        nx = Math.min(G - 1, Math.max(0, x + DX[a]));
        ny = Math.min(G - 1, Math.max(0, y + DY[a]));
        ns = ny * G + nx;
        rec = PASSO_CUSTO;
        if (nx === PERTO[0] && ny === PERTO[1]) { rec += R_PERTO; fim = "perto"; }
        else if (nx === LONGE[0] && ny === LONGE[1]) { rec += R_LONGE; fim = "longe"; }
        est.Q[s][a] += ALFA * (rec + (fim ? 0 : GAMA * est.Q[ns][melhor(est.Q, ns)]) - est.Q[s][a]);
        total += rec; x = nx; y = ny;
        if (fim) break;
      }
      return { total: total, fim: fim };
    }

    function desenhar() {
      var escuro = temaEscuro(), i, j, s, v, pico = 1e-6;
      var cel = 16, x0 = PAD + 4, y0 = PAD + 26;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText((est.semEps ? "ε = 0 desde o começo" : "ε caindo de 1 a 0,05") +
                   " · valor de cada casa", x0, PAD + 14);
      for (i = 0; i < G * G; i++) {
        v = est.Q[i][melhor(est.Q, i)];
        if (v > pico) pico = v;
      }
      for (i = 0; i < G; i++) for (j = 0; j < G; j++) {
        s = i * G + j;
        v = Math.max(0, est.Q[s][melhor(est.Q, s)]) / pico;
        ctx.fillStyle = escuro ? "rgba(143,184,221," + v + ")" : "rgba(53,97,142," + v + ")";
        ctx.fillRect(x0 + j * cel, y0 + i * cel, cel - 1, cel - 1);
      }
      ctx.fillStyle = escuro ? "#87b89a" : "#2f7d4f";
      ctx.fillRect(x0 + LONGE[0] * cel, y0 + LONGE[1] * cel, cel - 1, cel - 1);
      ctx.fillStyle = escuro ? "#e0a24a" : "#b8761f";
      ctx.fillRect(x0 + PERTO[0] * cel, y0 + PERTO[1] * cel, cel - 1, cel - 1);
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("laranja = +" + R_PERTO + " · verde = +" + R_LONGE, x0, y0 + G * cel + 14);
      // recompensa por episódio
      var gx = x0 + G * cel + 26, glarg = W - PAD - gx - 4;
      var base = y0 + G * cel, altG = base - y0;
      ctx.fillText("recompensa por episódio", gx, y0 - 6);
      ctx.strokeStyle = escuro ? "#8fb8dd" : "#35618e";
      ctx.lineWidth = 1.6; ctx.beginPath();
      est.hist.forEach(function (q, k) {
        var px = gx + (k / EPISODIOS) * glarg;
        var py = base - Math.max(0, Math.min(1, (q + 0.6) / 1.6)) * altG;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    function texto() {
      placar.textContent =
        (est.semEps ? "ε = 0 desde o começo" : "ε caindo de 1 a 0,05") +
        " · episódio " + est.ep + " de " + EPISODIOS +
        " · ε " + est.eps.toFixed(3) +
        " · recompensa média dos últimos 20 " + est.media.toFixed(3) +
        (est.parou
          ? " · chegou ao +" + R_LONGE + " em " + est.achouLonge +
            " episódios e ao +" + R_PERTO + " em " + est.achouPerto
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var r = est.r, res;
      est.eps = est.semEps ? 0 : Math.max(0.05, 1 - est.ep / (EPISODIOS * 0.6));
      res = episodio(r, est.eps);
      if (res.fim === "longe") est.achouLonge++;
      else if (res.fim === "perto") est.achouPerto++;
      est.hist.push(res.total);
      var ult = est.hist.slice(-20), s = 0, i;
      for (i = 0; i < ult.length; i++) s += ult[i];
      est.media = s / ult.length;
      est.ep++;
      if (est.ep >= EPISODIOS) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(semEps) {
      est.semEps = semEps; est.ep = 0; est.Q = novoQ(); est.hist = [];
      est.achouLonge = 0; est.achouPerto = 0; est.parou = false;
      est.r = rng(91);                       // mesmo fluxo de sorteios nos dois modos
      rel.comecar(EPISODIOS + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bEps.textContent = est.semEps ? "Voltar ao ε que cai" : "E se ε fosse 0 desde o começo?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.semEps); });
    bEps = botao("E se ε fosse 0 desde o começo?", function () { rodar(!est.semEps); });

    rel = relogio(cv, passo, function () { desenhar(); }, 18);
    est.Q = novoQ(); est.r = rng(91);
    desenhar(); texto();
    rel.aoChegar(function () { rodar(false); });
  }


  // A animação do capítulo III.5: o gradiente voltando pela sequência, passo a
  // passo, com a norma que chega a cada posição anterior. É uma retropropagação no
  // tempo de verdade — o mesmo produto de jacobianas que o corpo do capítulo
  // descreve, calculado aqui.
  //
  // A previsão que o leitor erra é sobre a FORMA da queda. "O sinal enfraquece com
  // a distância" faz pensar em algo gradual; a queda é exponencial, e a diferença
  // entre gradual e exponencial é o capítulo inteiro. O botão troca a recorrência
  // por uma leitura por atenção, em que o caminho da saída até QUALQUER posição
  // tem comprimento 1: o peso que chega a cada posição é o α dela, e α não sabe o
  // que é distância.
  //
  // A comparação é honesta porque as duas curvas medem a mesma coisa — quanto do
  // sinal da saída chega à posição t−k —, e não porque uma foi ajustada para
  // parecer melhor que a outra.
  function animaMemoria(area, cfg) {
    var W = 460, H = 300, PAD = 24;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bModo;
    var T = 100, N = 32;
    // Três modos, e o segundo é o que a folclore descreve. A escala é o raio
    // espectral aproximado da matriz recorrente: 1,0 é a inicialização padrão
    // (Glorot para uma matriz quadrada dá desvio 1/√N, que é raio ≈ 1).
    var MODOS = [
      { rot: "recorrência, inicialização padrão", escala: 1.0, atencao: false },
      { rot: "recorrência, pesos 40% menores", escala: 0.6, atencao: false },
      { rot: "leitura por atenção", escala: 1.0, atencao: true }
    ];
    var est = { modo: 0, k: 0, sinal: [], parou: false, corte: null, Wr: null, alfa: null };

    function normal(r) {
      var u = Math.max(1e-12, r()), v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v);
    }

    function preparar() {
      var r = rng(59), i, j, W1 = [], h = [], a = [], s = 0;
      var ESCALA = MODOS[est.modo].escala;
      for (i = 0; i < N; i++) {
        W1.push([]);
        for (j = 0; j < N; j++) W1[i].push(normal(r) * ESCALA / Math.sqrt(N));
      }
      // estados pré-ativação ao longo do tempo, para a derivada de tanh
      var z = [];
      for (i = 0; i < N; i++) h.push(normal(r) * 0.5);
      for (var tt = 0; tt < T; tt++) {
        var zt = [], nh = [];
        for (i = 0; i < N; i++) {
          var acc = 0;
          for (j = 0; j < N; j++) acc += W1[i][j] * h[j];
          zt.push(acc); nh.push(Math.tanh(acc));
        }
        z.push(zt); h = nh;
      }
      // pesos de atenção sobre as T posições, normalizados
      for (i = 0; i < T; i++) { a.push(Math.exp(normal(r) * 0.5)); s += a[i]; }
      for (i = 0; i < T; i++) a[i] /= s;
      est.Wr = W1; est.z = z; est.alfa = a;
      est.d = [];
      for (i = 0; i < N; i++) est.d.push(normal(rng(3)) / Math.sqrt(N));
    }

    function norma(v) {
      var s = 0, i; for (i = 0; i < v.length; i++) s += v[i] * v[i];
      return Math.sqrt(s);
    }

    /** Um passo de retropropagação no tempo: δ ← (Wᵀ δ) ⊙ tanh'(z). */
    function voltar(k) {
      var novo = [], j, i, acc, zk;
      for (j = 0; j < N; j++) {
        acc = 0;
        for (i = 0; i < N; i++) acc += est.Wr[i][j] * est.d[i];
        zk = est.z[T - 1 - k][j];
        novo.push(acc * (1 - Math.tanh(zk) * Math.tanh(zk)));
      }
      est.d = novo;
    }

    function desenhar() {
      var escuro = temaEscuro(), i, h;
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var base = H - PAD - 20, alt = base - PAD - 28;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText(MODOS[est.modo].rot +
                   " · quanto do sinal chega a cada posição anterior (log)", x0, PAD + 12);
      var yCorte = base - (1 - 3 / 6) * alt;
      ctx.strokeStyle = escuro ? "#3a3b3f" : "#dcdbd7";
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yCorte); ctx.lineTo(x0 + larg, yCorte); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("1‰ do inicial", x0 + larg - 62, yCorte - 3);
      for (i = 0; i < est.sinal.length; i++) {
        h = Math.max(1, (1 + Math.log(Math.max(est.sinal[i], 1e-6)) / Math.LN10 / 6) * alt);
        ctx.fillStyle = escuro ? "#8fb8dd" : "#35618e";
        ctx.fillRect(x0 + i * (larg / T) + 1, base - h, larg / T - 2, h);
      }
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("saída", x0, base + 14);
      ctx.fillText(T + " passos atrás", x0 + larg - 78, base + 14);
    }

    /** Razão geométrica média por passo, que é a forma da queda. */
    function razao() {
      var k = est.sinal.length - 1;
      if (k < 5 || est.sinal[k] <= 0) return null;
      return Math.pow(est.sinal[k], 1 / k);
    }

    function texto() {
      var k = est.sinal.length - 1, rz = razao();
      placar.textContent =
        MODOS[est.modo].rot +
        " · posições varridas " + est.sinal.length + " de " + T +
        (k >= 0 ? " · na posição " + k + " atrás chega " + est.sinal[k].toExponential(2) : "") +
        (rz != null ? " · fica " + rz.toFixed(3) + " do sinal a cada passo" : "") +
        (est.corte != null
          ? " · cai abaixo de 1‰ na posição " + est.corte
          : (est.parou ? " · NUNCA cai abaixo de 1‰ em " + T + " passos" : ""));
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var v;
      if (MODOS[est.modo].atencao) {
        // caminho de comprimento 1: o que chega à posição k é o peso α dela
        v = est.alfa[est.k] / est.alfa[0];
      } else {
        if (est.k > 0) voltar(est.k);
        v = norma(est.d) / est.n0;
      }
      est.sinal.push(v);
      if (est.corte == null && v < 1e-3) est.corte = est.k;
      est.k++;
      if (est.k >= T) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(modo) {
      est.modo = modo; est.k = 0; est.sinal = []; est.corte = null; est.parou = false;
      preparar();
      est.n0 = norma(est.d);
      rel.comecar(T + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bModo.textContent = "Trocar para " + MODOS[(est.modo + 1) % MODOS.length].rot;
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.modo); });
    bModo = botao("Trocar para " + MODOS[1].rot, function () {
      rodar((est.modo + 1) % MODOS.length);
    });

    rel = relogio(cv, passo, function () { desenhar(); }, 40);
    preparar(); est.n0 = norma(est.d);
    desenhar(); texto();
    rel.aoChegar(function () { rodar(0); });
  }


  // A animação do capítulo II.5: o MESMO orçamento de cortes gasto de dois jeitos.
  // Numa árvore só, que vai fundo; ou espalhado em tocos somados, que é o boosting.
  // A cada quadro entra um corte, e o placar mostra o erro de treino e o de
  // validação lado a lado.
  //
  // O que o leitor erra ao prever é qual dos dois se dá melhor com o MESMO número
  // de cortes. A árvore única leva o erro de treino a quase zero e o de validação
  // sobe depois de um ponto; os tocos somados descem os dois juntos por muito mais
  // tempo. Não é que boosting seja "mais poderoso": é que gastar o orçamento em
  // muitos modelos fracos e sequenciais ataca viés sem comprar variância na mesma
  // velocidade, que é a distinção que o O2 do capítulo cobra.
  //
  // Os dois recebem o mesmo dado, a mesma divisão treino/validação e o mesmo
  // número de cortes. É a única forma de a comparação medir a alocação do
  // orçamento em vez de medir o orçamento.
  function animaEnsemble(area, cfg) {
    var W = 460, H = 300, PAD = 26;
    var t = tela(area, W, H, PAD, 1);
    var cv = t.cv, ctx = t.ctx;
    var placar = placarDe(area);
    var botao = botoeiraDe(area);
    var rel, bRodar, bModo;
    var N = 240, CORTES = 60, TAXA = 0.3;
    var DADOS = (function () {
      var r = rng(67), v = [], i, x;
      for (i = 0; i < N; i++) {
        x = r() * 10;
        v.push({ x: x, y: Math.sin(x) + 0.35 * x + (r() - 0.5) * 1.6 });
      }
      v.sort(function (a, b) { return a.x - b.x; });
      return v;
    })();
    var TREINO = DADOS.filter(function (_, i) { return i % 3 !== 0; });
    var VALID = DADOS.filter(function (_, i) { return i % 3 === 0; });
    var est = { boosting: false, i: 0, corte: 0, parou: false,
                fT: null, fV: null, regioes: null, tocos: null,
                eT: 0, eV: 0, piorV: null, melhorV: 1e9, melhorEm: 0 };

    function mse(pontos, pred) {
      var s = 0, i, e;
      for (i = 0; i < pontos.length; i++) { e = pred(pontos[i].x) - pontos[i].y; s += e * e; }
      return s / pontos.length;
    }

    /** Melhor corte por redução de soma de quadrados dentro de um conjunto. */
    function melhorCorte(pts) {
      if (pts.length < 8) return null;
      var i, k, mediaE, mediaD, sE, sD, nE, nD, melhor = null, sse;
      for (k = 3; k < pts.length - 3; k++) {
        sE = 0; nE = k; sD = 0; nD = pts.length - k;
        for (i = 0; i < k; i++) sE += pts[i].y;
        for (i = k; i < pts.length; i++) sD += pts[i].y;
        mediaE = sE / nE; mediaD = sD / nD;
        sse = 0;
        for (i = 0; i < k; i++) sse += Math.pow(pts[i].y - mediaE, 2);
        for (i = k; i < pts.length; i++) sse += Math.pow(pts[i].y - mediaD, 2);
        if (melhor == null || sse < melhor.sse) {
          melhor = { k: k, sse: sse, x: (pts[k - 1].x + pts[k].x) / 2, mE: mediaE, mD: mediaD };
        }
      }
      return melhor;
    }

    /** Um toco: um corte só, sobre o resíduo corrente. */
    function toco(res) {
      var c = melhorCorte(res);
      return c ? { x: c.x, e: c.mE, d: c.mD } : null;
    }

    function predArvore(x) {
      var i;
      for (i = 0; i < est.regioes.length; i++) {
        if (x >= est.regioes[i].a && x < est.regioes[i].b) return est.regioes[i].m;
      }
      return est.regioes[est.regioes.length - 1].m;
    }

    function predBoost(x) {
      var s = est.base, i;
      for (i = 0; i < est.tocos.length; i++) {
        s += TAXA * (x < est.tocos[i].x ? est.tocos[i].e : est.tocos[i].d);
      }
      return s;
    }

    function pred(x) { return est.boosting ? predBoost(x) : predArvore(x); }

    function cortarArvore() {
      // parte a região com maior soma de quadrados interna
      var alvo = -1, pior = -1, i, pts, c;
      for (i = 0; i < est.regioes.length; i++) {
        if (est.regioes[i].sse > pior && est.regioes[i].pts.length >= 8) {
          pior = est.regioes[i].sse; alvo = i;
        }
      }
      if (alvo < 0) return false;
      pts = est.regioes[alvo].pts;
      c = melhorCorte(pts);
      if (!c) return false;
      var esq = pts.slice(0, c.k), dir = pts.slice(c.k);
      function sseDe(p, m) {
        var s = 0, j; for (j = 0; j < p.length; j++) s += Math.pow(p[j].y - m, 2);
        return s;
      }
      est.regioes.splice(alvo, 1,
        { a: est.regioes[alvo].a, b: c.x, m: c.mE, pts: esq, sse: sseDe(esq, c.mE) },
        { a: c.x, b: est.regioes[alvo].b, m: c.mD, pts: dir, sse: sseDe(dir, c.mD) });
      return true;
    }

    function cortarBoost() {
      var res = TREINO.map(function (p) { return { x: p.x, y: p.y - predBoost(p.x) }; });
      var tc = toco(res);
      if (!tc) return false;
      est.tocos.push(tc);
      return true;
    }

    function desenhar() {
      var escuro = temaEscuro(), i;
      var x0 = PAD + 6, larg = W - 2 * PAD - 12;
      var base = H - PAD - 20, alt = base - PAD - 28;
      t.fundo(escuro);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = escuro ? "#c9c9c6" : "#4a4a48";
      ctx.fillText((est.boosting ? "tocos somados (boosting)" : "uma árvore, cada vez mais fundo") +
                   " · " + est.corte + " cortes gastos de " + CORTES, x0, PAD + 12);
      var mn = -1.5, mx = 5.5;
      function px(x) { return x0 + (x / 10) * larg; }
      function py(y) { return base - ((y - mn) / (mx - mn)) * alt; }
      DADOS.forEach(function (p) {
        ctx.fillStyle = escuro ? "rgba(143,184,221,0.5)" : "rgba(53,97,142,0.45)";
        ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 1.6, 0, 6.2832); ctx.fill();
      });
      ctx.strokeStyle = escuro ? "#e0a24a" : "#b8761f";
      ctx.lineWidth = 2; ctx.beginPath();
      for (i = 0; i <= 200; i++) {
        var xx = i / 200 * 10;
        if (i === 0) ctx.moveTo(px(xx), py(pred(xx))); else ctx.lineTo(px(xx), py(pred(xx)));
      }
      ctx.stroke();
      ctx.fillStyle = escuro ? "#8f8f8c" : "#6a6a68";
      ctx.fillText("erro de treino " + est.eT.toFixed(3), x0, base + 14);
      ctx.fillText("erro de validação " + est.eV.toFixed(3), x0 + 150, base + 14);
    }

    function texto() {
      placar.textContent =
        (est.boosting ? "tocos somados (boosting)" : "uma árvore, cada vez mais fundo") +
        " · cortes " + est.corte + " de " + CORTES +
        " · erro de treino " + est.eT.toFixed(4) +
        " · erro de validação " + est.eV.toFixed(4) +
        (est.parou
          ? " · a validação foi melhor em " + est.melhorV.toFixed(4) +
            " com " + est.melhorEm + " cortes, terminou em " + est.eV.toFixed(4) +
            ", e piorou por " + (est.corte - est.melhorEm) + " cortes"
          : "");
      cv.setAttribute("aria-label", placar.textContent);
    }

    function passo() {
      var ok = est.boosting ? cortarBoost() : cortarArvore();
      if (ok) est.corte++;
      est.eT = mse(TREINO, pred); est.eV = mse(VALID, pred);
      if (est.eV < est.melhorV) { est.melhorV = est.eV; est.melhorEm = est.corte; }
      est.i++;
      if (est.i >= CORTES || !ok) est.parou = true;
      desenhar(); texto();
      if (est.parou) sincBotoes();
      return est.parou;
    }

    function rodar(boosting) {
      var s = 0, i;
      est.boosting = boosting; est.i = 0; est.corte = 0; est.parou = false;
      est.melhorV = 1e9; est.melhorEm = 0;
      for (i = 0; i < TREINO.length; i++) s += TREINO[i].y;
      est.base = s / TREINO.length;
      var sse0 = 0;
      for (i = 0; i < TREINO.length; i++) sse0 += Math.pow(TREINO[i].y - est.base, 2);
      est.regioes = [{ a: -1e9, b: 1e9, m: est.base, pts: TREINO, sse: sse0 }];
      est.tocos = [];
      est.eT = mse(TREINO, pred); est.eV = mse(VALID, pred);
      rel.comecar(CORTES + 4);
      if (!rel.rodando()) { est.parou = true; texto(); }
      sincBotoes();
    }

    function sincBotoes() {
      bRodar.textContent = rel && rel.rodando() ? "Recomeçar" : "Rodar de novo";
      bModo.textContent = est.boosting ? "Voltar à árvore única"
                                       : "E gastando os mesmos cortes em tocos?";
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.boosting); });
    bModo = botao("E gastando os mesmos cortes em tocos?", function () { rodar(!est.boosting); });

    rel = relogio(cv, passo, function () { desenhar(); }, 60);
    rodarInicial();
    function rodarInicial() {
      var s = 0, i;
      for (i = 0; i < TREINO.length; i++) s += TREINO[i].y;
      est.base = s / TREINO.length;
      var sse0 = 0;
      for (i = 0; i < TREINO.length; i++) sse0 += Math.pow(TREINO[i].y - est.base, 2);
      est.regioes = [{ a: -1e9, b: 1e9, m: est.base, pts: TREINO, sse: sse0 }];
      est.tocos = [];
      est.eT = mse(TREINO, pred); est.eV = mse(VALID, pred);
      desenhar(); texto();
    }
    rel.aoChegar(function () { rodar(false); });
  }

  var TIPOS = { "neuronio-mp": neuronioMP, "regressao-linear": regressaoLinear,
                "explorar-variavel": explorarVariavel, "anima-perceptron": animaPerceptron,
                "anima-mlp-xor": animaMLPXor, "anima-kmeans": animaKMeans,
                "anima-justica": animaJustica, "anima-vies-variancia": animaViesVariancia,
                "anima-taxas": animaTaxas, "anima-vazamento": animaVazamento,
                "anima-limiar": animaLimiar, "anima-gradiente": animaGradiente,
                "anima-origem-movel": animaOrigemMovel, "anima-custo": animaCusto,
                "anima-deriva": animaDeriva,
                "anima-eixo": animaEixo,
                "anima-separavel": animaSeparavel,
                "anima-normais": animaNormais,
                "anima-convolucao": animaConvolucao,
                "anima-exploracao": animaExploracao,
                "anima-memoria": animaMemoria,
                "anima-ensemble": animaEnsemble };

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
