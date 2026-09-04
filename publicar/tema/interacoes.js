/* Interações formativas do livro vivo — JS puro, sem dependências, sem rede.

   POR QUE ESTE ARQUIVO EXISTE, E POR QUE ELE PODE FAZER O QUE O EXERCÍCIO NÃO PODE

   O exercício e a interação parecem a mesma coisa e são o oposto uma da outra:

                     :::exercicio            :::interacao
     função          SOMATIVA — vale nota    FORMATIVA — não vale nada
     correção        no backend; o gabarito  no cliente, revelando
                     nunca chega ao cliente
     registro        grava tentativa por     não grava nada: nem servidor,
                     aluno, e aprende do erro nem localStorage
     errar           conta contra o leitor   é o ponto

   É PORQUE A INTERAÇÃO NÃO VALE NOTA QUE ELA PODE REVELAR NO CLIENTE SEM
   VIOLAR O PRINCÍPIO VIII.3. Aquele princípio protege o gabarito daquilo que
   é contabilizado: a resposta a um clique de `Ctrl+U` estragaria a revelação
   progressiva que a segunda tentativa cobra, e envenenaria a telemetria que
   corrige o livro. Aqui não há tentativa, não há placar e não há telemetria —
   não existe segredo a guardar, e portanto não existe o que proteger.

   E há o ganho que essa escolha compra: sem segredo, não há chamada de rede,
   e a interação continua inteira com o backend fora do ar (Princípio VIII.6).
   O exercício, sem servidor, diz honestamente que não pode corrigir. A
   interação nunca precisa dizer isso.

   OS TRÊS TIPOS, E DE ONDE ELES VÊM

     principio    exemplo trabalhado com pergunta de princípio. O leitor
                  escreve a resposta dele, clica, e a explicação aparece AO
                  LADO da resposta dele — que não é corrigida, é comparada.
                  Autoexplicação provocada supera receber a explicação pronta
                  (g=0,35; Bisra, Liu, Nesbit, Salimi & Winne, 2018).
     desvanecido  passo apagado da conta. Ao conferir, as linhas certas
                  aparecem e as dele ficam ao lado. Sem nota e sem "errado":
                  só a comparação. Desvanecimento somado a prompt de princípio
                  dá efeito médio-a-grande em transferência próxima e distante
                  (Atkinson, Renkl & Merrill, 2003).
     prever       prever e conferir. O botão só libera depois da previsão, e a
                  revelação REPETE a previsão do leitor antes de dar o
                  resultado. Isto não é enfeite: resolver antes de explicar
                  rende (g=0,36; Sinha & Kapur, 2021) desde que a explicação
                  construa sobre o que o leitor tentou — g=0,56 quando
                  constrói, g=0,20 quando ignora.

   ACESSIBILIDADE. Botão é botão (teclado de graça). Enquanto falta responder,
   ele NÃO fica `disabled` nem `aria-disabled`: as duas coisas o tiram da
   tabulação ou o anunciam como indisponível, e aí o motivo de ele não liberar
   deixa de ser alcançável por quem lê a tela — que é quem mais precisa dele.
   (Testado: o Playwright recusa clicar num `aria-disabled`, aplicando a mesma
   regra que a tecnologia assistiva.) O sinal de "ainda não" é `data-pronto`,
   que pinta e não bloqueia; quem bloqueia é o clique, que escreve o porquê num
   `role="status"` ligado ao botão por `aria-describedby`. A revelação entra num
   `aria-live="polite"` que já existia vazio no DOM — região viva criada na hora
   não anuncia de forma confiável. */
(function () {
  "use strict";

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function lista(raiz, sel) {
    return [].slice.call(raiz.querySelectorAll(sel));
  }

  /* Número em português: `1,4` é um e quatro décimos. A troca da vírgula é
     GLOBAL — trocar só a primeira já custou três exercícios corrigindo por
     igualdade exata neste repositório (ver publicar/testes/numerico.mjs). */
  function numero(txt) {
    var n = Number(String(txt).replace(/\s/g, "").replace(/,/g, "."));
    return isFinite(n) ? n : null;
  }

  function texto(campo) {
    return campo && campo.value ? String(campo.value).trim() : "";
  }

  function escolhida(sec) {
    var opcoes = lista(sec, ".ia-opcao");
    for (var i = 0; i < opcoes.length; i++) if (opcoes[i].checked) return opcoes[i];
    return null;
  }

  /* Falta o quê para poder revelar. String vazia = pode revelar. */
  function falta(sec) {
    var tipo = sec.getAttribute("data-tipo");
    if (tipo === "desvanecido") {
      var vazios = lista(sec, ".ia-branco").filter(function (i) { return !texto(i); }).length;
      if (!vazios) return "";
      return vazios === 1
        ? "Falta um passo. Chute: aqui o chute não custa nada."
        : "Faltam " + vazios + " passos. Chute: aqui o chute não custa nada.";
    }
    if (tipo === "prever") {
      if (lista(sec, ".ia-opcao").length) {
        return escolhida(sec) ? "" : "Escolha uma previsão antes de revelar. Errar aqui é o ponto.";
      }
      var num = sec.querySelector(".ia-num");
      if (!texto(num)) return "Arrisque um número antes de revelar. Errar aqui é o ponto.";
      return numero(texto(num)) === null ? "Isso não é um número — arrisque um." : "";
    }
    return texto(sec.querySelector(".ia-livre"))
      ? ""
      : "Escreva a sua explicação primeiro: é ela que fica ao lado da minha, para você comparar.";
  }

  /* O que o leitor respondeu, já pronto para aparecer na revelação. */
  function previsaoDe(sec) {
    var opcao = escolhida(sec);
    if (opcao) {
      var rot = opcao.parentNode.querySelector("span");
      return {
        texto: rot ? (rot.textContent || "").trim() : opcao.value,
        bateu: opcao.getAttribute("data-real") === "1",
      };
    }
    var campo = sec.querySelector(".ia-num");
    var v = numero(texto(campo));
    var real = numero(campo.getAttribute("data-real"));
    var tol = numero(campo.getAttribute("data-tol")) || 0;
    return { texto: texto(campo), bateu: v !== null && real !== null && Math.abs(v - real) <= tol };
  }

  function congelar(sec) {
    lista(sec, ".ia-livre").concat(lista(sec, ".ia-num"), lista(sec, ".ia-branco"))
      .forEach(function (c) { c.readOnly = true; });
    lista(sec, ".ia-opcao").forEach(function (o) { o.disabled = true; });
  }

  function revelar(sec, botao, status) {
    var tipo = sec.getAttribute("data-tipo");
    var painel = sec.querySelector(".ia-revelacao");
    var fonte = sec.querySelector(".ia-fonte");
    if (!painel || sec.getAttribute("data-revelado") === "true") return;

    var caixa = el("div", "ia-rev-caixa");

    if (tipo === "principio") {
      caixa.appendChild(el("div", "ia-rev-rot", "A sua explicação"));
      caixa.appendChild(el("blockquote", "ia-sua", texto(sec.querySelector(".ia-livre"))));
      caixa.appendChild(el("div", "ia-rev-rot", "O princípio"));
    } else if (tipo === "desvanecido") {
      /* A comparação mora ao lado de cada passo, e não numa lista à parte:
         é a linha dele contra a linha certa, na mesma altura da tela. */
      lista(sec, ".ia-passo").forEach(function (li) {
        var campo = li.querySelector(".ia-branco");
        var cmp = li.querySelector(".ia-passo-cmp");
        if (!campo || !cmp) return;
        cmp.textContent = "";
        cmp.appendChild(el("b", "ia-cmp-certo", campo.getAttribute("data-certo") || ""));
        cmp.appendChild(el("span", "ia-cmp-sua", "você escreveu " + (texto(campo) || "—")));
      });
      caixa.appendChild(el("div", "ia-rev-rot", "As linhas certas estão acima, ao lado das suas"));
    } else {
      var p = previsaoDe(sec);
      caixa.appendChild(el("div", "ia-rev-rot", "A sua previsão"));
      var linha = el("p", "ia-sua-prev");
      linha.appendChild(el("b", null, p.texto));
      linha.appendChild(el("span", "ia-bateu", p.bateu ? " — bateu." : " — não bateu."));
      caixa.appendChild(linha);
      sec.setAttribute("data-bateu", p.bateu ? "sim" : "nao");
      caixa.appendChild(el("div", "ia-rev-rot", "O que acontece"));
    }

    var corpo = el("div", "ia-rev-texto");
    corpo.innerHTML = fonte ? fonte.innerHTML : "";
    caixa.appendChild(corpo);

    painel.appendChild(caixa);
    sec.setAttribute("data-revelado", "true");
    congelar(sec);
    botao.setAttribute("data-pronto", "feito");
    botao.textContent = "Revelado";
    status.textContent = "";
  }

  function ligar(sec) {
    var botao = sec.querySelector(".ia-revelar");
    var status = sec.querySelector(".ia-status");
    if (!botao || !status) return;

    function sincronizar() {
      if (sec.getAttribute("data-revelado") === "true") return;
      var pendente = falta(sec);
      botao.setAttribute("data-pronto", pendente ? "false" : "true");
      if (!pendente) status.textContent = "";
    }

    lista(sec, ".ia-livre").concat(lista(sec, ".ia-num"), lista(sec, ".ia-branco"))
      .forEach(function (c) { c.addEventListener("input", sincronizar); });
    lista(sec, ".ia-opcao").forEach(function (o) { o.addEventListener("change", sincronizar); });

    botao.addEventListener("click", function () {
      if (sec.getAttribute("data-revelado") === "true") return;
      var pendente = falta(sec);
      if (pendente) {
        status.textContent = pendente;
        return;
      }
      revelar(sec, botao, status);
    });

    sincronizar();
  }

  function iniciar() {
    [].forEach.call(document.querySelectorAll(".interacao"), ligar);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
