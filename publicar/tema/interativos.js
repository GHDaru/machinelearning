/* Exercícios e vídeos do livro vivo — JS puro, sem dependências.

   A página NÃO conhece o gabarito (Princípio VIII.3): responder é uma chamada
   ao backend, que corrige, explica e registra. Sem backend, o bloco continua
   legível e diz honestamente que a correção está indisponível.

   Identidade: reaproveita `cmp_sid` do companion — a mesma sessão anônima do
   chat. Progresso local em localStorage para sobreviver a recarregamentos. */
(function () {
  "use strict";

  var CFG = window.COMPANION || {};
  var BACKEND = (CFG.backend || "").replace(/\/+$/, "");

  function get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function uuid() {
    try { if (crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return "anon-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  var SID = get("cmp_sid", ""); if (!SID) { SID = uuid(); set("cmp_sid", SID); }

  // --- progresso local (espelho do servidor; funciona offline) ---
  function progresso() {
    try { return JSON.parse(get("ml_progresso", "{}")) || {}; } catch (e) { return {}; }
  }
  function gravarProgresso(id, dados) {
    var p = progresso();
    p[id] = dados;
    set("ml_progresso", JSON.stringify(p));
  }

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  /* Markdown mínimo e SEGURO para o feedback (escapa antes de formatar). */
  function fmt(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }

  function post(rota, corpo) {
    if (!BACKEND) return Promise.reject(new Error("sem-backend"));
    return fetch(BACKEND + rota, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    }).then(function (r) {
      if (!r.ok) return r.json().catch(function () { return {}; }).then(function (j) {
        throw new Error(j.detail || "erro " + r.status);
      });
      return r.json();
    });
  }

  // ------------------------------------------------------------- exercícios

  function respostaDe(sec) {
    var tipo = sec.getAttribute("data-tipo");
    if (tipo === "multipla") {
      var m = sec.querySelector("input[type=radio]:checked");
      return m ? m.value : null;
    }
    if (tipo === "multipla-multi") {
      var marcadas = [].slice.call(sec.querySelectorAll("input[type=checkbox]:checked"));
      return marcadas.length ? marcadas.map(function (i) { return i.value; }).join(",") : null;
    }
    var campo = sec.querySelector(".ex-num, .ex-txt, .ex-aberta");
    var v = campo ? campo.value.trim() : "";
    return v || null;
  }

  function pintar(sec, res) {
    var fb = sec.querySelector(".ex-feedback");
    var status = sec.querySelector(".ex-status");
    sec.setAttribute("data-resultado", res.correto ? "certo" : (res.parcial ? "parcial" : "errado"));
    status.textContent = res.correto ? "✔ correto" : (res.parcial ? "◐ parcialmente" : "✗ ainda não");

    fb.innerHTML = "";
    var cab = el("div", "ex-fb-cab", res.correto ? "Por que está certo" : "O que aconteceu");
    fb.appendChild(cab);
    var corpo = el("div", "ex-fb-corpo");
    corpo.innerHTML = fmt(res.feedback || "");
    fb.appendChild(corpo);
    if (res.volte_para) {
      var a = el("a", "ex-fb-volte", "↩ reler a seção");
      a.href = res.volte_para;
      fb.appendChild(a);
    }
    if (res.criterios && res.criterios.length) {
      var ul = el("ul", "ex-fb-criterios");
      res.criterios.forEach(function (c) {
        var li = el("li", c.atendido ? "ok" : "falta", c.criterio);
        ul.appendChild(li);
      });
      fb.appendChild(ul);
    }
    fb.hidden = false;
    gravarProgresso(sec.getAttribute("data-ex"), { correto: !!res.correto, quando: Date.now() });
    atualizarBarra();
  }

  function semBackend(sec) {
    var fb = sec.querySelector(".ex-feedback");
    fb.innerHTML = "";
    fb.appendChild(el("div", "ex-fb-cab", "Correção indisponível"));
    var p = el("div", "ex-fb-corpo");
    p.innerHTML = fmt(
      "Este exercício é corrigido pelo backend do livro vivo, que não está configurado nesta " +
      "publicação. O enunciado continua válido — e a resposta comentada está no repositório, " +
      "em `livro/`."
    );
    fb.appendChild(p);
    fb.hidden = false;
  }

  function ligarExercicio(sec) {
    var botao = sec.querySelector(".ex-enviar");
    var status = sec.querySelector(".ex-status");
    var id = sec.getAttribute("data-ex");

    // Estado anterior desta sessão de leitura.
    var ante = progresso()[id];
    if (ante) {
      sec.setAttribute("data-resultado", ante.correto ? "certo" : "errado");
      status.textContent = ante.correto ? "✔ resolvido antes" : "✗ tentado antes";
    }

    botao.addEventListener("click", function () {
      var resposta = respostaDe(sec);
      if (!resposta) {
        status.textContent = "escolha ou escreva uma resposta";
        return;
      }
      botao.disabled = true;
      status.textContent = "corrigindo…";
      post("/exercicio/tentativa", {
        session_id: SID,
        exercicio_id: id,
        resposta: resposta,
        capitulo: Number(sec.getAttribute("data-cap")) || 0,
      })
        .then(function (res) { pintar(sec, res); })
        .catch(function (e) {
          if (String(e.message) === "sem-backend") semBackend(sec);
          else status.textContent = "não deu para corrigir agora (" + e.message + ")";
        })
        .then(function () { botao.disabled = false; });
    });
  }

  // ----------------------------------------------------------------- vídeos

  function ligarVideo(sec) {
    var player = sec.querySelector(".vd-player");
    var play = sec.querySelector(".vd-play");
    var check = sec.querySelector(".vd-check");
    var id = sec.getAttribute("data-video");

    play.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = player.getAttribute("data-src") + "?rel=0";
      iframe.title = "Vídeo do capítulo";
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; encrypted-media; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      player.innerHTML = "";
      player.appendChild(iframe);
      player.setAttribute("data-carregado", "true");
    });

    var vistos = progresso();
    if (vistos["video:" + id]) check.checked = true;

    check.addEventListener("change", function () {
      gravarProgresso("video:" + id, { visto: check.checked, quando: Date.now() });
      atualizarBarra();
      if (check.checked) {
        post("/video/visto", {
          session_id: SID,
          video_id: id,
          capitulo: Number(sec.getAttribute("data-cap")) || 0,
        }).catch(function () {});
      }
    });
  }

  // --------------------------------------------------- barra de progresso

  var barra = null;
  function atualizarBarra() {
    if (!barra) return;
    var exs = [].slice.call(document.querySelectorAll(".exercicio"));
    var vids = [].slice.call(document.querySelectorAll(".video"));
    var p = progresso();
    var certos = exs.filter(function (s) { var e = p[s.getAttribute("data-ex")]; return e && e.correto; }).length;
    var assistidos = vids.filter(function (s) { var v = p["video:" + s.getAttribute("data-video")]; return v && v.visto; }).length;
    var total = exs.length + vids.length;
    var feitos = certos + assistidos;
    barra.querySelector(".pg-fill").style.width = total ? Math.round((feitos / total) * 100) + "%" : "0%";
    barra.querySelector(".pg-txt").textContent =
      certos + "/" + exs.length + " exercícios" + (vids.length ? " · " + assistidos + "/" + vids.length + " vídeos" : "");
    barra.setAttribute("data-completo", total && feitos === total ? "true" : "false");
  }

  function montarBarra() {
    var exs = document.querySelectorAll(".exercicio");
    var vids = document.querySelectorAll(".video");
    if (!exs.length && !vids.length) return;
    barra = el("div", "pg-barra");
    barra.innerHTML =
      '<span class="pg-rot">Seu progresso neste capítulo</span>' +
      '<span class="pg-trilho"><i class="pg-fill"></i></span>' +
      '<span class="pg-txt"></span>';
    var alvo = document.querySelector(".cap-hero") || document.querySelector(".conteudo");
    if (alvo && alvo.classList.contains("cap-hero")) alvo.appendChild(barra);
    else if (alvo) alvo.insertBefore(barra, alvo.firstChild);
    atualizarBarra();
  }

  function iniciar() {
    [].forEach.call(document.querySelectorAll(".exercicio"), ligarExercicio);
    [].forEach.call(document.querySelectorAll(".video"), ligarVideo);
    montarBarra();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
