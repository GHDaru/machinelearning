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

  var TIPOS = { "neuronio-mp": neuronioMP, "regressao-linear": regressaoLinear,
                "explorar-variavel": explorarVariavel, "anima-perceptron": animaPerceptron,
                "anima-mlp-xor": animaMLPXor, "anima-kmeans": animaKMeans,
                "anima-justica": animaJustica, "anima-vies-variancia": animaViesVariancia,
                "anima-taxas": animaTaxas, "anima-vazamento": animaVazamento };

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
