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
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H; cv.className = "lab-canvas";
    cv.setAttribute("role", "img");
    area.appendChild(cv);
    var ctx = cv.getContext("2d");
    var placar = el("div", "lab-placar");
    placar.setAttribute("aria-live", "polite");   // o canvas é role=img: quem
    placar.setAttribute("role", "status");        // não enxerga acompanha aqui
    area.appendChild(placar);
    var botoes = el("div", "lab-botoes"); area.appendChild(botoes);

    var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var est = { pts: [], w: [0, 0], b: 0, i: 0, epoca: 0, erros: 0, xor: false, timer: null, parou: false };

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
    function esc(v, px) { return PAD + (v + LIM) / (2 * LIM) * (px - 2 * PAD); }

    function desenhar() {
      var escuro = document.documentElement.getAttribute("data-tema") === "escuro" ||
        (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
      ctx.fillStyle = escuro ? "#1a1b1e" : "#faf9f7";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = escuro ? "#3a3b3f" : "#dcdbd7";
      ctx.lineWidth = 1;
      ctx.strokeRect(PAD, PAD, W - 2 * PAD, H - 2 * PAD);

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
      if (est.parou && est.timer) { clearInterval(est.timer); est.timer = null; sincBotoes(); }
    }

    function rodar(xor) {
      if (est.timer) clearInterval(est.timer);
      est.xor = !!xor; est.pts = dados(est.xor);
      est.w = [0, 0]; est.b = 0; est.i = 0; est.epoca = 0; est.erros = 0; est.parou = false;
      if (calmo) {                                  // quem pediu menos movimento recebe o resultado
        for (var k = 0; k < est.pts.length * 61 && !est.parou; k++) passo();
        est.parou = true; desenhar(); texto(); sincBotoes(); return;
      }
      est.timer = setInterval(passo, 55);
      sincBotoes();
    }

    var bRodar, bXor;
    function sincBotoes() {
      bRodar.textContent = est.timer ? "Recomeçar" : "Rodar de novo";
      bXor.textContent = est.xor ? "Voltar aos dados separáveis" : "E se os dados forem XOR?";
    }
    function botao(txt, fn) {
      var b = el("button", "lab-botao", txt);
      b.type = "button"; b.addEventListener("click", fn); botoes.appendChild(b); return b;
    }
    bRodar = botao("Rodar de novo", function () { rodar(est.xor); });
    bXor = botao("E se os dados forem XOR?", function () { rodar(!est.xor); });

    // Só começa quando o leitor CHEGA. Sem isto a animação rodava no load,
    // terminava em 4 segundos, e quem descia até aqui minutos depois achava um
    // quadro congelado dizendo "convergiu" — uma imagem estática se passando
    // por animação. Foi assim que ela nasceu, e o teste não pegou porque o
    // navegador automatizado rola até o bloco na hora.
    est.pts = dados(false); desenhar(); texto();
    if (window.IntersectionObserver) {
      var visto = false;
      var obs = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting && !visto) { visto = true; obs.disconnect(); rodar(false); }
        });
      }, { threshold: 0.4 });
      obs.observe(cv);
    } else {
      rodar(false);
    }

    // Trocar o tema no meio da animação deixava as cores do tema anterior.
    if (window.MutationObserver) {
      new MutationObserver(function () { desenhar(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
    }
  }

  var TIPOS = { "neuronio-mp": neuronioMP, "regressao-linear": regressaoLinear,
                "explorar-variavel": explorarVariavel, "anima-perceptron": animaPerceptron };

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
