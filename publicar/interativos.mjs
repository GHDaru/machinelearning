// Parser dos blocos interativos do livro — exercícios e vídeos.
//
// FONTE ÚNICA DA SINTAXE. Consumido por dois lados, com recortes diferentes:
//   - build.mjs        -> renderiza a UI SEM o gabarito (Princípio VIII.3)
//   - exercicios.mjs   -> extrai o banco COMPLETO para o backend corrigir
//
// A separação é o ponto: a página nunca carrega a resposta certa. Quem corrige
// é o backend, que é também quem aprende com o erro do leitor (telemetria).
//
// Sintaxe (ver livro/BANCO-DE-EXERCICIOS.md):
//
//   :::exercicio {"id":"avaliacao-e1","tipo":"multipla","objetivo":"O2"}
//   Enunciado em Markdown.
//
//   - [ ] Alternativa errada
//   - [x] Alternativa certa
//
//   > **gabarito:** Alternativa certa
//   > **porque:** o feedback explicativo, obrigatório.
//   > **volte para:** #ancora-da-secao
//   :::
//
//   :::video {"id":"avaliacao-v1","fonte":"youtube","ref":"ID","min":10,"autor":"...","titulo":"..."}
//   O que este vídeo resolve que o texto não resolve.
//   :::
//
//   :::lab {"id":"redes-neurais-l1","tipo":"neuronio-mp","titulo":"...","funcao":"AND"}
//   O que manipular aqui ensina, e o que o leitor deve tentar descobrir.
//   :::
//
// Laboratório é a terceira superfície: exercício pergunta e corrige, vídeo
// mostra, laboratório deixa MANIPULAR. Roda inteiro no navegador — não há
// gabarito a esconder, porque o gabarito é o comportamento do próprio objeto.

const TIPOS = ["multipla", "multipla-multi", "numerica", "completar", "aberta"];

const RE_BLOCO = /^:::(exercicio|video|lab)\s+(\{[\s\S]*?\})\s*\n([\s\S]*?)\n:::[ \t]*$/gm;
const RE_CERCA = /^(?:```|~~~)[\s\S]*?^(?:```|~~~)[ \t]*$/gm;
const RE_OPCAO = /^[-*]\s+\[([ xX])\]\s+(.+?)\s*$/;
const RE_META = /^>\s*\*\*([a-zà-ú ]+):\*\*\s*([\s\S]*?)\s*$/i;

/** Erro de autoria com localização — vira falha de build, não aviso silencioso. */
export class ErroDeBloco extends Error {
  constructor(arquivo, id, msg) {
    super(`${arquivo} · bloco "${id || "sem id"}": ${msg}`);
    this.arquivo = arquivo;
    this.id = id;
  }
}

/**
 * Intervalos ocupados por blocos de código cercado.
 *
 * Sem isto, a própria documentação da sintaxe (BANCO-DE-EXERCICIOS.md, que
 * mostra um `:::exercicio` dentro de ```markdown) viraria um exercício de
 * verdade — com id duplicado, e renderizado como widget onde deveria haver
 * um exemplo. Um livro que documenta o próprio formato precisa poder citá-lo.
 */
function cercas(markdown) {
  const faixas = [];
  for (const m of markdown.matchAll(RE_CERCA)) faixas.push([m.index, m.index + m[0].length]);
  return (pos) => faixas.some(([ini, fim]) => pos >= ini && pos < fim);
}

function parseAtributos(json, arquivo) {
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new ErroDeBloco(arquivo, null, `atributos não são JSON válido — ${e.message}`);
  }
}

/** Separa corpo em: enunciado, opções e metadados do rodapé (`> **chave:** valor`). */
function fatiar(corpo) {
  const linhas = corpo.split("\n");
  const enunciado = [];
  const opcoes = [];
  const meta = {};
  let chaveAberta = null;

  for (const linha of linhas) {
    const mMeta = linha.match(RE_META);
    if (mMeta) {
      chaveAberta = mMeta[1].trim().toLowerCase().replace(/\s+/g, "_");
      meta[chaveAberta] = mMeta[2];
      continue;
    }
    // continuação de um metadado multi-linha (`> texto`)
    if (chaveAberta && /^>\s?/.test(linha)) {
      meta[chaveAberta] += "\n" + linha.replace(/^>\s?/, "");
      continue;
    }
    chaveAberta = null;

    const mOpc = linha.match(RE_OPCAO);
    if (mOpc) {
      opcoes.push({ correta: mOpc[1].toLowerCase() === "x", texto: mOpc[2] });
      continue;
    }
    if (!opcoes.length) enunciado.push(linha);
  }

  return { enunciado: enunciado.join("\n").trim(), opcoes, meta };
}

function validarExercicio(ex, arquivo) {
  const erro = (m) => {
    throw new ErroDeBloco(arquivo, ex.id, m);
  };
  if (!ex.id) erro("falta `id`");
  if (!TIPOS.includes(ex.tipo)) erro(`tipo "${ex.tipo}" desconhecido (use: ${TIPOS.join(", ")})`);
  if (!ex.objetivo) erro("falta `objetivo` — todo exercício rastreia até um objetivo do capítulo (Princípio VIII.4)");
  if (!ex.enunciado) erro("enunciado vazio");
  if (!ex.porque) erro("falta `> **porque:**` — feedback que só diz 'errado' é proibido (Princípio VIII.2)");

  if (ex.tipo === "multipla" || ex.tipo === "multipla-multi") {
    if (ex.opcoes.length < 2) erro("precisa de ao menos 2 alternativas");
    const certas = ex.opcoes.filter((o) => o.correta).length;
    if (ex.tipo === "multipla" && certas !== 1) erro(`múltipla escolha precisa de exatamente 1 alternativa correta (achei ${certas})`);
    if (ex.tipo === "multipla-multi" && certas < 1) erro("precisa de ao menos 1 alternativa correta");
  } else if (ex.tipo === "numerica") {
    if (ex.gabarito == null || !/-?\d/.test(String(ex.gabarito))) erro("`> **gabarito:**` precisa de um número (ex.: `0.75 ± 0.02`)");
  } else if (ex.tipo === "completar") {
    if (!ex.gabarito) erro("`> **gabarito:**` precisa do texto que preenche a lacuna");
  } else if (ex.tipo === "aberta") {
    if (!ex.rubrica) erro("resposta aberta precisa de `> **rubrica:**` — critérios explícitos, um por linha ou separados por `;`");
  }
}

/** Interpreta `0.75 ± 0.02` / `0.75 +- 0.02` / `0.75` -> {valor, tolerancia}. */
export function parseNumerico(txt) {
  const m = String(txt).replace(",", ".").match(/(-?[\d.]+(?:e-?\d+)?)\s*(?:±|\+\/-|\+-)\s*([\d.]+(?:e-?\d+)?)/i);
  if (m) return { valor: Number(m[1]), tolerancia: Number(m[2]) };
  const n = Number(String(txt).replace(",", ".").trim());
  return Number.isFinite(n) ? { valor: n, tolerancia: 0 } : null;
}

/**
 * Extrai todos os blocos interativos de um Markdown.
 * @returns {{exercicios: object[], videos: object[], laboratorios: object[]}}
 */
export function extrair(markdown, arquivo = "?", capitulo = 0) {
  const exercicios = [];
  const videos = [];
  const laboratorios = [];
  const emCerca = cercas(markdown);

  for (const m of markdown.matchAll(RE_BLOCO)) {
    if (emCerca(m.index)) continue; // exemplo de sintaxe, não exercício
    const [, tipoBloco, attrsJson, corpo] = m;
    const attrs = parseAtributos(attrsJson, arquivo);

    if (tipoBloco === "lab") {
      if (!attrs.id) throw new ErroDeBloco(arquivo, null, "laboratório sem `id`");
      if (!attrs.tipo) throw new ErroDeBloco(arquivo, attrs.id, "laboratório sem `tipo` (qual widget carregar)");
      const intro = corpo.trim();
      if (!intro) throw new ErroDeBloco(arquivo, attrs.id, "laboratório sem introdução: diga o que manipular aqui ensina");
      laboratorios.push({
        id: attrs.id, capitulo, arquivo, tipo: attrs.tipo,
        titulo: attrs.titulo || attrs.id, config: attrs, intro,
      });
      continue;
    }

    if (tipoBloco === "video") {
      if (!attrs.id) throw new ErroDeBloco(arquivo, null, "vídeo sem `id`");
      if (!attrs.ref) throw new ErroDeBloco(arquivo, attrs.id, "vídeo sem `ref` (o identificador na fonte)");
      if (!attrs.autor) throw new ErroDeBloco(arquivo, attrs.id, "vídeo sem `autor` — curadoria dá crédito (Princípio VIII.5)");
      const porque = corpo.trim();
      if (!porque) throw new ErroDeBloco(arquivo, attrs.id, "vídeo sem justificativa: diga o que ele resolve que o texto não resolve");
      videos.push({
        id: attrs.id,
        capitulo,
        arquivo,
        fonte: attrs.fonte || "youtube",
        ref: attrs.ref,
        titulo: attrs.titulo || attrs.id,
        autor: attrs.autor,
        min: Number(attrs.min) || null,
        porque,
      });
      continue;
    }

    const { enunciado, opcoes, meta } = fatiar(corpo);
    const ex = {
      id: attrs.id,
      capitulo,
      arquivo,
      tipo: attrs.tipo,
      objetivo: attrs.objetivo,
      pontos: Number(attrs.pontos) || 1,
      dificuldade: attrs.dificuldade || "media",
      // "verificacao" = desafio integrador de fim de capítulo (ADR 0012).
      // É atributo, e não tipo de bloco, porque a distinção é pedagógica: a
      // mecânica de correção é a mesma. Quem consome isto segmenta ranking e
      // barra de progresso, para que um item tudo-ou-nada não afogue o sinal.
      secao: attrs.secao || "corpo",
      enunciado,
      opcoes,
      gabarito: meta.gabarito || null,
      porque: meta.porque || null,
      volte_para: meta.volte_para || null,
      rubrica: meta.rubrica || null,
      versoes: attrs.versoes || null, // ex.: {"scikit-learn":"1.5"} — Princípio IV
    };
    validarExercicio(ex, arquivo);
    exercicios.push(ex);
  }

  return { exercicios, videos, laboratorios };
}

/** Metadados que revelam a resposta — nunca saem do backend. */
const SEGREDOS = new Set(["gabarito", "porque", "rubrica"]);

const AVISO_SEM_GABARITO =
  "\n> _Gabarito, explicação e rubrica não vão neste arquivo. Quem corrige é o " +
  "servidor, e a explicação completa é o que a segunda tentativa paga._";

/**
 * Remove do Markdown tudo que entrega a resposta — para a **exportação**.
 *
 * `renderizar()` já impedia o gabarito de chegar ao HTML, e por isso o time
 * achou que a promessa estava cumprida. Não estava: o botão "⬇ md" ao lado de
 * cada capítulo (e o "⬇ Markdown" da capa) serviam o arquivo-FONTE cru — 79
 * gabaritos e 30 rubricas, um clique ao lado do exercício que deveria custar
 * duas tentativas. A superfície protegida era uma das duas.
 *
 * O que sai: `gabarito`, `porque`, `rubrica` e a marcação `- [x]` da
 * alternativa certa. O que fica: enunciado, alternativas e o `volte para` —
 * que é ponteiro para a seção, não resposta.
 */
export function semGabarito(markdown) {
  const emCerca = cercas(markdown);
  return markdown.replace(RE_BLOCO, (bloco, tipoBloco, attrsJson, corpo, offset) => {
    if (emCerca(offset) || tipoBloco !== "exercicio") return bloco;
    const saida = [];
    let ocultando = false;
    for (const linha of corpo.split("\n")) {
      const meta = linha.match(RE_META);
      if (meta) ocultando = SEGREDOS.has(meta[1].trim().toLowerCase());
      else if (!(ocultando && /^>/.test(linha))) ocultando = false; // fim da continuação
      if (ocultando) continue;
      saida.push(linha.replace(RE_OPCAO, "- [ ] $2"));
    }
    return `:::${tipoBloco} ${attrsJson}\n${saida.join("\n").trim()}${AVISO_SEM_GABARITO}\n:::`;
  });
}

/**
 * Substitui os blocos por HTML de UI **sem gabarito**.
 * @param {(md:string)=>string} renderMd  renderizador de Markdown inline/bloco
 */
export function renderizar(markdown, renderMd, arquivo = "?", capitulo = 0) {
  const emCerca = cercas(markdown);
  return markdown.replace(RE_BLOCO, (bloco, tipoBloco, attrsJson, corpo, offset) => {
    if (emCerca(offset)) return bloco; // exemplo de sintaxe: passa intacto
    const attrs = parseAtributos(attrsJson, arquivo);
    if (tipoBloco === "lab") return htmlLab(attrs, corpo.trim(), renderMd, capitulo);
    if (tipoBloco === "video") return htmlVideo(attrs, corpo.trim(), renderMd, capitulo);
    const { enunciado, opcoes } = fatiar(corpo);
    return htmlExercicio(attrs, enunciado, opcoes, renderMd, capitulo);
  });
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ROTULO_TIPO = {
  multipla: "escolha uma",
  "multipla-multi": "escolha todas que valem",
  numerica: "responda com um número",
  completar: "complete a lacuna",
  aberta: "responda com suas palavras",
};

function htmlExercicio(attrs, enunciado, opcoes, renderMd, capitulo) {
  const id = esc(attrs.id);
  const tipo = esc(attrs.tipo);
  const dif = esc(attrs.dificuldade || "media");
  const corpo = renderMd(enunciado);

  let entrada = "";
  if (tipo === "multipla" || tipo === "multipla-multi") {
    const input = tipo === "multipla" ? "radio" : "checkbox";
    entrada = `<ul class="ex-opcoes">${opcoes
      .map(
        (o, i) =>
          `<li><label><input type="${input}" name="ex-${id}" value="${i}"><span>${renderMd(o.texto).replace(/^<p>|<\/p>\s*$/g, "")}</span></label></li>`
      )
      .join("")}</ul>`;
  } else if (tipo === "numerica") {
    entrada = `<div class="ex-entrada"><input class="ex-num" type="text" inputmode="decimal" name="ex-${id}" placeholder="ex.: 0.82" autocomplete="off"></div>`;
  } else if (tipo === "completar") {
    entrada = `<div class="ex-entrada"><input class="ex-txt" type="text" name="ex-${id}" placeholder="o que preenche a lacuna" autocomplete="off" spellcheck="false"></div>`;
  } else {
    entrada = `<div class="ex-entrada"><textarea class="ex-aberta" name="ex-${id}" rows="4" placeholder="Sua resposta — o tutor avalia contra os critérios do capítulo."></textarea></div>`;
  }

  return `<section class="exercicio" data-ex="${id}" data-tipo="${tipo}" data-cap="${capitulo}" data-dif="${dif}">
  <header class="ex-cab"><span class="ex-tag">Exercício</span><code class="ex-id">${id}</code><span class="ex-modo">${ROTULO_TIPO[tipo] || ""}</span></header>
  <div class="ex-enunciado">${corpo}</div>
  ${entrada}
  <div class="ex-acoes">
    <button class="ex-enviar" type="button">Responder</button>
    <button class="ex-dica" type="button" hidden>Ver a explicação</button>
    <span class="ex-status" role="status"></span>
  </div>
  <div class="ex-feedback" hidden></div>
</section>`;
}

const EMBED = {
  youtube: (ref) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(ref)}`,
  vimeo: (ref) => `https://player.vimeo.com/video/${encodeURIComponent(ref)}`,
};

function htmlVideo(attrs, porque, renderMd, capitulo) {
  const id = esc(attrs.id);
  const fonte = EMBED[attrs.fonte] ? attrs.fonte : "youtube";
  // Fachada: nada é pedido a terceiros até o leitor clicar (privacidade + carga).
  const src = EMBED[fonte](attrs.ref);
  const dur = attrs.min ? `<span class="vd-min">${esc(attrs.min)} min</span>` : "";
  return `<section class="video" data-video="${id}" data-cap="${capitulo}">
  <header class="vd-cab"><span class="vd-tag">Vídeo</span><b class="vd-titulo">${esc(attrs.titulo || attrs.id)}</b><span class="vd-autor">${esc(attrs.autor)}</span>${dur}</header>
  <div class="vd-porque">${renderMd(porque)}</div>
  <div class="vd-player" data-src="${esc(src)}">
    <button class="vd-play" type="button" aria-label="Carregar e reproduzir o vídeo">▶ Carregar o vídeo</button>
    <p class="vd-aviso">O vídeo só é pedido ao servidor de origem depois deste clique.</p>
  </div>
  <label class="vd-visto"><input type="checkbox" class="vd-check"> Marcar como assistido</label>
</section>`;
}

function htmlLab(attrs, intro, renderMd, capitulo) {
  const id = esc(attrs.id);
  // A config inteira vai no data-attribute: o widget é quem sabe o que ler dela.
  const cfg = esc(JSON.stringify(attrs));
  return `<section class="laboratorio" data-lab="${esc(attrs.tipo)}" data-id="${id}" data-cap="${capitulo}" data-cfg="${cfg}">
  <header class="lab-cab"><span class="lab-tag">Laboratório</span><span class="lab-titulo">${esc(attrs.titulo || attrs.id)}</span><code class="ex-id">${id}</code></header>
  <div class="lab-intro">${renderMd(intro)}</div>
  <div class="lab-area"></div>
</section>`;
}

export { TIPOS };
