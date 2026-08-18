/* Ilha viva "Quadro da turma" (ADR 0021) — JS puro, sem dependências.
   Preenche <div data-viz="turma"> na página `turma.html`.

   O QUE ESTA PÁGINA É, E O QUE ELA NÃO É

   Ela é um arquivo estático, servido no mesmo lugar que o livro. Qualquer
   pessoa que digite o endereço abre este HTML — e isso não tem conserto, nem
   precisa ter. O que se tranca não é a página, é a RESPOSTA do servidor: aqui
   dentro não há nome de aluno, não há matrícula, não há nota. Tudo vem de
   `GET /turma/{turma}`, que exige credencial conferida a cada requisição.

   Consequência de desenho, e ela é obrigatória: **a página não faz requisição
   nenhuma antes de um clique.** Um fetch automático sem credencial devolveria
   403, e a auditoria de jornada (publicar/jornada.mjs) reprova qualquer erro de
   console. Portaria fechada, silêncio total, até o professor entrar. */
(function () {
  "use strict";
  var BACKEND = ((window.COMPANION || {}).backend || "").replace(/\/+$/, "");
  var CHAVE = "prof_sessao";

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function guardado() {
    try { return JSON.parse(sessionStorage.getItem(CHAVE) || "null"); } catch (e) { return null; }
  }
  // sessionStorage e NÃO localStorage: a credencial morre quando ele fecha a
  // aba, que é o que se quer numa máquina de laboratório ou de sala de aula.
  function guardar(s) { try { sessionStorage.setItem(CHAVE, JSON.stringify(s)); } catch (e) {} }
  function esquecer() { try { sessionStorage.removeItem(CHAVE); } catch (e) {} }

  var raiz = document.querySelector('[data-viz="turma"]');
  if (!raiz) return;

  var estado = { linhas: [], turma: "", capitulo: "", ordem: "resolvidos", desc: true, busca: "" };

  // ---------------------------------------------------------------- portaria
  function portaria(recado) {
    raiz.innerHTML = "";
    var cx = el("div", "prof-portaria");
    cx.appendChild(el("h2", null, "Quadro da turma"));
    cx.appendChild(el("p", "prof-nota",
      "Esta página não guarda nada. Nome, matrícula e nota vêm do servidor, e só " +
      "com credencial válida. O conteúdo das respostas do aluno não aparece aqui — " +
      "é a promessa que ele leu ao se identificar, e ela continua valendo."));

    if (!BACKEND) {
      cx.appendChild(el("p", "prof-erro",
        "Esta cópia do livro foi publicada sem backend, então não há turma a consultar."));
      raiz.appendChild(cx);
      return;
    }

    var f = el("form", "prof-form");
    var iTurma = el("input", "prof-campo");
    iTurma.type = "text"; iTurma.placeholder = "código da turma"; iTurma.required = true;
    iTurma.value = estado.turma || "";
    var iUser = el("input", "prof-campo");
    iUser.type = "text"; iUser.placeholder = "usuário"; iUser.autocomplete = "username";
    var iSenha = el("input", "prof-campo");
    // type=password para o telão da sala não revelar o que ele digita.
    iSenha.type = "password"; iSenha.placeholder = "senha"; iSenha.autocomplete = "current-password";
    [iTurma, iUser, iSenha].forEach(function (i) { f.appendChild(i); });
    var bt = el("button", "prof-botao", "Abrir quadro");
    bt.type = "submit";
    f.appendChild(bt);
    cx.appendChild(f);
    if (recado) cx.appendChild(el("p", "prof-erro", recado));
    raiz.appendChild(cx);

    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      estado.turma = iTurma.value.trim();
      bt.disabled = true; bt.textContent = "entrando…";
      var s = guardado();
      var pronto = s && s.expira_em * 1000 > Date.now()
        ? Promise.resolve(s)
        : fetch(BACKEND + "/admin/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: iUser.value, senha: iSenha.value }),
          }).then(function (r) {
            if (r.status === 503) throw new Error("Este servidor não tem o painel configurado.");
            if (!r.ok) throw new Error("Usuário ou senha não conferem.");
            return r.json();
          }).then(function (d) { guardar(d); return d; });
      pronto.then(function (s2) { carregar(s2); })
            .catch(function (e) { portaria(e.message || "Não foi possível entrar."); });
    });
  }

  // ---------------------------------------------------------------- dados
  function carregar(sessao) {
    raiz.innerHTML = "";
    raiz.appendChild(el("p", "prof-nota", "carregando o quadro…"));
    var url = BACKEND + "/turma/" + encodeURIComponent(estado.turma) +
              (estado.capitulo ? "?capitulo=" + encodeURIComponent(estado.capitulo) : "");
    fetch(url, { headers: { Authorization: "Bearer " + sessao.token } })
      .then(function (r) {
        if (r.status === 403) { esquecer(); throw new Error("A credencial expirou. Entre de novo."); }
        if (!r.ok) throw new Error("O servidor recusou a consulta (" + r.status + ").");
        return r.json();
      })
      .then(function (d) { estado.linhas = d.progresso || []; estado.dados = d; quadro(sessao); })
      // Erro de rede não tem `status`: dizer "credencial recusada" aqui mandaria
      // o professor procurar a senha quando o problema é o servidor.
      .catch(function (e) { portaria(e.message || "Não foi possível falar com o servidor."); });
  }

  // ---------------------------------------------------------------- quadro
  var COLS = [
    { k: "aluno", r: "Aluno", txt: true },
    { k: "resolvidos", r: "Resolvidos" },
    { k: "nota", r: "Nota" },
    { k: "acerto_do_que_tentou", r: "Acerto do que tentou" },
    { k: "exercicios_tentados", r: "Tentados", extra: true },
    { k: "tentativas", r: "Tentativas", extra: true },
    { k: "de_primeira", r: "De primeira", extra: true },
    { k: "pontos", r: "Pontos", extra: true },
    { k: "pontos_possiveis", r: "Possíveis", extra: true },
    { k: "minutos_entre_primeira_e_ultima", r: "Min. entre 1ª e última", extra: true },
    { k: "ultima_em", r: "Última atividade", extra: true, txt: true },
  ];

  function valor(l, k) {
    var v = l[k];
    if (v === null || v === undefined) return "—";   // nunca vira 0
    if (k === "ultima_em") return String(v).slice(0, 16).replace("T", " ");
    return String(v).replace(".", ",");
  }

  function quadro(sessao) {
    raiz.innerHTML = "";
    var d = estado.dados || {};
    var temNota = d.capitulo !== null && d.capitulo !== undefined;

    var barra = el("div", "prof-barra");
    barra.appendChild(el("strong", null, estado.turma));
    barra.appendChild(el("span", "prof-chip", estado.linhas.length + " aluno(s)"));
    barra.appendChild(el("span", "prof-chip",
      temNota ? "capítulo " + d.capitulo : "livro inteiro"));
    var bSair = el("button", "prof-botao-fraco", "Esquecer credencial");
    bSair.type = "button";
    bSair.addEventListener("click", function () { esquecer(); portaria("Credencial esquecida."); });
    barra.appendChild(bSair);
    raiz.appendChild(barra);

    // O aviso que impede o erro mais caro: sem recorte de capítulo NÃO existe
    // nota, porque o único denominador possível seria "o que o aluno tentou" —
    // e aí quem fez um exercício e acertou lidera o ranking.
    if (!temNota) {
      raiz.appendChild(el("p", "prof-aviso",
        "Sem escolher um capítulo não há nota: o denominador seria “o que o aluno " +
        "tentou”, e quem tentou um exercício e acertou apareceria com 10. A coluna " +
        "“Acerto do que tentou” mostra esse número com o nome certo. Para nota, " +
        "escolha um capítulo."));
    }

    var filtros = el("div", "prof-filtros");
    var iCap = el("input", "prof-campo");
    iCap.type = "number"; iCap.min = "1"; iCap.placeholder = "capítulo (nº de leitura)";
    iCap.value = estado.capitulo;
    var bCap = el("button", "prof-botao", "Aplicar");
    bCap.type = "button";
    bCap.addEventListener("click", function () {
      estado.capitulo = iCap.value.trim(); carregar(sessao);
    });
    var iBusca = el("input", "prof-campo");
    iBusca.type = "search"; iBusca.placeholder = "buscar aluno"; iBusca.value = estado.busca;
    iBusca.addEventListener("input", function () { estado.busca = iBusca.value; pintar(); });
    [iCap, bCap, iBusca].forEach(function (x) { filtros.appendChild(x); });
    raiz.appendChild(filtros);

    var caixa = el("div", "prof-tabela-rolagem");
    raiz.appendChild(caixa);
    var acoes = el("div", "prof-acoes");
    var bCsv = el("button", "prof-botao", "Baixar planilha (.csv)");
    bCsv.type = "button";
    bCsv.addEventListener("click", baixar);
    acoes.appendChild(bCsv);
    raiz.appendChild(acoes);
    raiz.appendChild(el("p", "prof-nota",
      "“Min. entre 1ª e última” é a distância entre a primeira e a última resposta " +
      "pelo relógio do servidor. Não é tempo de trabalho: quem responde uma questão, " +
      "almoça e responde outra marca noventa minutos. A matrícula é autodeclarada " +
      "pelo aluno e não é verificada por ninguém."));

    function visiveis() {
      var b = estado.busca.trim().toLowerCase();
      var v = estado.linhas.filter(function (l) {
        return !b || String(l.aluno).toLowerCase().indexOf(b) >= 0;
      });
      var k = estado.ordem;
      return v.sort(function (a, c) {
        var x = a[k], y = c[k];
        // Nulo sempre por último, nas duas direções: senão quem não fez nada
        // ocupa o topo do ranking.
        if (x === null || x === undefined) return 1;
        if (y === null || y === undefined) return -1;
        if (x === y) return String(a.aluno).localeCompare(String(c.aluno));
        var r = x > y ? 1 : -1;
        return estado.desc ? -r : r;
      });
    }

    function pintar() {
      caixa.innerHTML = "";
      var linhas = visiveis();
      if (!linhas.length) {
        caixa.appendChild(el("p", "prof-erro",
          "Nenhum aluno em «" + estado.turma + "». O código é o que o aluno digitou " +
          "no comando /turma — confira se é este mesmo."));
        return;
      }
      var t = el("table", "prof-tabela");
      var thead = el("thead"), tr = el("tr");
      COLS.forEach(function (c) {
        if (c.k === "nota" && !temNota) return;
        var th = el("th", c.extra ? "prof-col-extra" : null, c.r);
        th.setAttribute("scope", "col");
        th.setAttribute("aria-sort", estado.ordem === c.k
          ? (estado.desc ? "descending" : "ascending") : "none");
        th.addEventListener("click", function () {
          if (estado.ordem === c.k) estado.desc = !estado.desc;
          else { estado.ordem = c.k; estado.desc = true; }
          pintar();
        });
        tr.appendChild(th);
      });
      thead.appendChild(tr); t.appendChild(thead);
      var tb = el("tbody");
      linhas.forEach(function (l) {
        var f = el("tr");
        COLS.forEach(function (c) {
          if (c.k === "nota" && !temNota) return;
          f.appendChild(el("td", c.extra ? "prof-col-extra" : null, valor(l, c.k)));
        });
        tb.appendChild(f);
      });
      t.appendChild(tb);
      caixa.appendChild(t);
    }

    function baixar() {
      var linhas = visiveis();
      var cols = COLS.filter(function (c) { return !(c.k === "nota" && !temNota); });
      // Ponto e vírgula, vírgula decimal e BOM: é o que o Excel em português
      // abre certo. Sem o BOM, "Gonçalves" chega como "GonÃ§alves".
      var txt = "﻿" + cols.map(function (c) { return c.r; }).join(";") + "\r\n" +
        linhas.map(function (l) {
          return cols.map(function (c) {
            var v = l[c.k];
            if (v === null || v === undefined) return "";
            return c.txt ? '"' + String(v).replace(/"/g, '""') + '"'
                         : String(v).replace(".", ",");
          }).join(";");
        }).join("\r\n");
      var blob = new Blob([txt], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "turma-" + estado.turma + (estado.capitulo ? "-cap" + estado.capitulo : "") + ".csv";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }

    raiz.__api = { visiveis: visiveis, pintar: pintar, estado: estado };
    pintar();
  }

  var s = guardado();
  portaria(s && s.expira_em * 1000 > Date.now() ? null : null);
})();
