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
//   :::aprofundar {"titulo":"De onde sai o 2/n"}
//   A dedução inteira, para quem quer. Fechada por padrão.
//   :::
//
//   :::interacao {"id":"modelos-lineares-i1","tipo":"prever","titulo":"..."}
//   O exemplo trabalhado, a conta ou o contexto — em Markdown.
//
//   - [?] rótulo do passo apagado => a linha certa      (só em `desvanecido`)
//   - ( ) opção de previsão                             (só em `prever`)
//   - (!) a opção que é o que de fato acontece          (só em `prever`)
//
//   > **pergunta:** o que o leitor responde ANTES de revelar
//   > **revela:** o que aparece depois do clique
//   :::
//
// Laboratório é a terceira superfície: exercício pergunta e corrige, vídeo
// mostra, laboratório deixa MANIPULAR. Roda inteiro no navegador — não há
// gabarito a esconder, porque o gabarito é o comportamento do próprio objeto.
//
// Interação é a QUARTA, e a única que revela no cliente. Ela é FORMATIVA: não
// vale nota, não grava tentativa, não fala com o backend — e é exatamente por
// isso que pode revelar aqui. O Princípio VIII.3 protege o gabarito do que
// VALE NOTA; onde não há nota não há gabarito a proteger, e insistir em pedir
// ao servidor uma resposta que ninguém contabiliza custaria a garantia mais
// valiosa da interação: ela funciona com a rede fora do ar (VIII.6). A
// justificativa inteira está no cabeçalho de `publicar/tema/interacoes.js`.

const TIPOS = ["multipla", "multipla-multi", "numerica", "completar", "aberta"];

const RE_BLOCO = /^:::(exercicio|video|lab|interacao|aprofundar)\s+(\{[\s\S]*?\})\s*\n([\s\S]*?)\n:::[ \t]*$/gm;
const RE_CERCA = /^(?:```|~~~)[\s\S]*?^(?:```|~~~)[ \t]*$/gm;
const RE_OPCAO = /^[-*]\s+\[([ xX])\]\s+(.+?)\s*$/;
const RE_META = /^>\s*\*\*([a-zà-ú ]+):\*\*\s*([\s\S]*?)\s*$/i;

// --------------------------------------------------------------- interações
//
// Os três tipos vêm de evidência, não de gosto:
//   principio    — exemplo trabalhado + prompt de princípio. Autoexplicação
//                  PROVOCADA supera receber a explicação pronta (g=0,35;
//                  Bisra, Liu, Nesbit, Salimi & Winne, 2018).
//   desvanecido  — passo apagado do exemplo. Desvanecimento somado a prompt de
//                  princípio rende em transferência próxima e distante
//                  (Atkinson, Renkl & Merrill, 2003).
//   prever       — prever e conferir. Resolver antes de explicar rende (g=0,36;
//                  Sinha & Kapur, 2021) DESDE QUE a explicação construa sobre o
//                  que o leitor tentou (g=0,56 contra 0,20 quando ignora) — é
//                  por isso que a revelação repete a previsão dele na tela.
const TIPOS_INTERACAO = ["principio", "desvanecido", "prever"];

// O passo apagado: `- [?] rótulo => a linha certa`.
// O marcador NÃO é `- [x]` de propósito, e a razão é dupla. Semântica: `[x]`
// significa "gabarito" na casa, e interação não tem gabarito. Mecânica: o gate
// de vazamento do build.mjs recusa qualquer linha `- [x]` no Markdown
// exportado, e `semGabarito()` só limpa bloco de exercício — um `[x]` aqui
// derrubaria o build por uma resposta que nunca foi segredo.
const RE_PASSO = /^[-*]\s+\[\?\]\s+(.+?)\s*=>\s*(.+?)\s*$/;
// A previsão: `- ( )` para as opções e `- (!)` para a que de fato acontece.
const RE_PREVISAO = /^[-*]\s+\(([ !])\)\s+(.+?)\s*$/;

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

// -------------------------------------------------------------- aprofundar
//
// A QUINTA superfície, e a única que TIRA coisa do caminho do leitor.
//
// O que ela resolve. A dedução completa é a parte do capítulo que mais encosta
// nos limites do cartão (1 600 px e 250 palavras, `gates/cartoes-legiveis.mjs`),
// e a D21 do roadmap piorou isso: fórmula que cortava na margem foi consertada
// quebrando-a em duas linhas, o que aumenta a altura. A carga cognitiva
// (Sweller, ✓ em BASE-EDUCACIONAL.md) pede uma ideia nova por vez, e a derivada
// inteira no fluxo principal é a segunda ideia da página. Quem quer a conta
// clica; quem quer o conceito segue adiante sem rolar por cima dela.
//
// Por que `<details>` nativo, sem uma linha de JavaScript:
//   - teclado e leitor de tela vêm do navegador, não do nosso código;
//   - funciona com o backend fora do ar, que é a garantia do Princípio VIII.6;
//   - o `Ctrl+F` dos navegadores atuais abre o bloco fechado para mostrar o
//     achado. ATENÇÃO: esta é a única linha desta lista que NÃO foi medida
//     aqui. Busca na página é interface do navegador e não se dispara por
//     script, então ela é herdada da plataforma, e não verificada por nós.
//
// A MEDIÇÃO QUE AUTORIZA O BLOCO. Num Chromium 141 a 360×800, o `innerText` de
// um cartão com `<details>` FECHADO devolve o texto do `<summary>` e mais nada:
// 15 palavras contra 29 com o mesmo bloco aberto (`textContent` devolve as 29
// nos dois casos). É esse `innerText` que o gate dos cartões conta, e é por isso
// que o aprofundamento não estoura o teto de palavras. A altura segue o mesmo
// caminho: 70 px fechado, 138 px aberto. As duas medidas são refeitas a cada
// execução de `publicar/testes/aprofundar.mjs`, num navegador de verdade.
//
// POR QUE O BLOCO RECUSA APARENTAR QUE ORGANIZA E NA PRÁTICA ESCONDE
//
// Um `:::aprofundar` que guardasse exercício, interação, laboratório, vídeo ou
// um corte de cartão seria perda de conteúdo disfarçada de organização, e o
// pior é que ela seria SILENCIOSA: o gate dos cartões acha `.exercicio` e
// `.interacao` com `querySelectorAll`, que atravessa `<details>` fechado. O
// cartão passaria no portão da premissa do autor exibindo um bloco fechado, e o
// leitor teria a página sem exercício nenhum à vista. Por isso a recusa é do
// parser: nenhum bloco `:::` vive dentro de um aprofundamento.
const RE_LINHA_BLOCO = /^:::([a-zà-ú-]+)/gim;
// O corte de cartão chega aqui já convertido: `marcarCortes()` roda antes de
// `renderizar()` e troca `:::cartao` por este `<hr>`. Sem esta segunda forma, a
// recusa valeria em `extrair()` (que lê o Markdown cru) e falharia justo no
// caminho que gera a página.
const RE_CORTE_CONVERTIDO = /<hr class="corte-cartao"/i;

/** Monta e valida um aprofundamento. Fonte única do objeto, como `montarInteracao`. */
function montarAprofundamento(attrs, corpo, arquivo) {
  const erro = (m) => {
    throw new ErroDeBloco(arquivo, attrs.titulo || null, m);
  };
  if (!attrs.titulo) {
    erro("aprofundamento sem `titulo` — é o texto do `<summary>`, e é a única " +
      "pista que o leitor tem do que está fechado ali");
  }
  const texto = corpo.trim();
  if (!texto) erro("aprofundamento vazio — um `<details>` sem conteúdo é só uma linha que não abre");

  // O LIMITE HERDADO DO `RE_BLOCO`, dito em voz alta em vez de virar mistério.
  // O corpo do bloco vai até a primeira linha que seja só `:::` — regra da
  // fonte única da sintaxe, e ela não sabe o que é cerca de código. Um exemplo
  // de bloco completo dentro de ```markdown, aqui dentro, faria o
  // aprofundamento fechar no `:::` do exemplo, deixando a cerca aberta e a
  // mensagem de erro falando de outra coisa. A cerca desbalanceada é o sintoma,
  // e é ela que se relata.
  const cercasAbertas = (texto.match(/^(?:```|~~~)/gm) || []).length % 2;
  if (cercasAbertas) {
    erro("o corpo tem uma cerca de código sem fecho. Se dentro dela havia um exemplo com " +
      "`:::` sozinho numa linha, foi ele que fechou o aprofundamento antes da hora: o corpo " +
      "termina no primeiro `:::`, e isso vem do `RE_BLOCO`, que é a sintaxe da casa inteira. " +
      "Exemplo de bloco completo mora fora do aprofundamento.");
  }
  // Cerca de código é exemplo, e a casa inteira respeita isso: o próprio
  // BANCO-DE-EXERCICIOS.md documenta a sintaxe citando blocos dentro de
  // ```markdown. Mascaro o miolo das cercas preservando as quebras de linha,
  // para o número da linha continuar honesto na mensagem de erro.
  const semCerca = texto.replace(RE_CERCA, (b) => b.replace(/[^\n]/g, " "));
  const achado = [...semCerca.matchAll(RE_LINHA_BLOCO)][0];
  if (achado) {
    erro(`tem um \`:::${achado[1]}\` dentro. Aprofundamento não aninha bloco nenhum: ` +
      "o que entra ali nasce fechado, e exercício, interação, laboratório, vídeo ou corte " +
      "de cartão fechado é conteúdo perdido com cara de organização. " +
      "Tire o bloco do aprofundamento, ou deixe o aprofundamento de fora dele.");
  }
  if (RE_CORTE_CONVERTIDO.test(texto)) {
    erro("tem um corte de cartão (`:::cartao`) dentro. O corte é divisória do baralho: " +
      "dentro de um bloco que fecha, ele parte um cartão que ninguém vê.");
  }

  return { titulo: String(attrs.titulo), corpo: texto };
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
    // Resposta decimal sem tolerância declarada corrige por igualdade exata, e
    // o leitor que arredondou de outro jeito erra por arredondamento e não por
    // conteúdo. Inteiro pode dispensar; decimal precisa dizer quanto aceita —
    // `± 0` continua valendo, desde que seja escolha escrita.
    const num = parseNumerico(ex.gabarito);
    const declarou = /(±|\+\/-|\+-)/.test(String(ex.gabarito));
    if (num && !Number.isInteger(num.valor) && !declarou) {
      erro(`gabarito numérico decimal (${ex.gabarito}) sem tolerância declarada — ` +
        "escreva `± <margem>`, senão a correção exige igualdade exata e pune arredondamento");
    }
  } else if (ex.tipo === "completar") {
    if (!ex.gabarito) erro("`> **gabarito:**` precisa do texto que preenche a lacuna");
  } else if (ex.tipo === "aberta") {
    if (!ex.rubrica) erro("resposta aberta precisa de `> **rubrica:**` — critérios explícitos, um por linha ou separados por `;`");
  }
}

/** Separa o corpo de uma interação: enunciado, passos, previsões e rodapé. */
function fatiarInteracao(corpo) {
  const enunciado = [];
  const passos = [];
  const previsoes = [];
  const meta = {};
  let chaveAberta = null;

  for (const linha of corpo.split("\n")) {
    const mMeta = linha.match(RE_META);
    if (mMeta) {
      chaveAberta = mMeta[1].trim().toLowerCase().replace(/\s+/g, "_");
      meta[chaveAberta] = mMeta[2];
      continue;
    }
    if (chaveAberta && /^>\s?/.test(linha)) {
      meta[chaveAberta] += "\n" + linha.replace(/^>\s?/, "");
      continue;
    }
    chaveAberta = null;

    const mPasso = linha.match(RE_PASSO);
    if (mPasso) {
      passos.push({ rotulo: mPasso[1].trim(), certo: mPasso[2].trim() });
      continue;
    }
    const mPrev = linha.match(RE_PREVISAO);
    if (mPrev) {
      previsoes.push({ real: mPrev[1] === "!", texto: mPrev[2] });
      continue;
    }
    if (!passos.length && !previsoes.length) enunciado.push(linha);
  }

  return { enunciado: enunciado.join("\n").trim(), passos, previsoes, meta };
}

function validarInteracao(ia, arquivo) {
  const erro = (m) => {
    throw new ErroDeBloco(arquivo, ia.id, m);
  };
  if (!ia.id) erro("falta `id`");
  if (!TIPOS_INTERACAO.includes(ia.tipo)) erro(`tipo "${ia.tipo}" desconhecido (use: ${TIPOS_INTERACAO.join(", ")})`);
  if (!ia.enunciado) erro("enunciado vazio — diga o que o leitor tem diante dos olhos antes de agir");
  if (!ia.revela) erro("falta `> **revela:**` — gesto sem retorno não é interação, é formulário");

  if (ia.tipo === "principio") {
    if (!ia.pergunta) erro("falta `> **pergunta:**` — o que rende é a autoexplicação PROVOCADA, e sem pergunta não há provocação");
  } else if (ia.tipo === "desvanecido") {
    if (!ia.passos.length) erro("nenhum passo apagado — marque ao menos uma linha com `- [?] rótulo => a linha certa`");
  } else {
    if (!ia.pergunta) erro("falta `> **pergunta:**` — não há previsão sem pergunta");
    if (ia.previsoes.length) {
      if (ia.numero != null) erro("escolha um modo só: opções `( )` ou o atributo `numero`, nunca os dois");
      if (ia.previsoes.length < 2) erro("previsão por opção precisa de ao menos 2 opções");
      const reais = ia.previsoes.filter((o) => o.real).length;
      if (reais !== 1) erro(`exatamente uma opção leva \`(!)\` — o que de fato acontece (achei ${reais})`);
    } else if (ia.numero == null) {
      erro("previsão precisa de opções `- ( )` / `- (!)` ou do atributo `numero` (campo numérico)");
    }
  }
}

/** Interpreta `0.75 ± 0.02` / `0.75 +- 0.02` / `0.75` -> {valor, tolerancia}.
 *
 * A troca de vírgula por ponto é GLOBAL, e isso não é detalhe de estilo. O
 * livro é em português, então o gabarito natural é `0,45 ± 0,01`; trocando só
 * a primeira vírgula, o valor saía certo e a tolerância virava 0 em silêncio.
 * Três exercícios publicados corrigiam por igualdade exata por causa disso.
 * Ver `publicar/testes/numerico.mjs`. */
export function parseNumerico(txt) {
  const normal = String(txt).replace(/,/g, ".");
  const m = normal.match(/(-?[\d.]+(?:e-?\d+)?)\s*(?:±|\+\/-|\+-)\s*([\d.]+(?:e-?\d+)?)/i);
  if (m) return { valor: Number(m[1]), tolerancia: Number(m[2]) };
  const n = Number(normal.trim());
  return Number.isFinite(n) ? { valor: n, tolerancia: 0 } : null;
}

/**
 * Extrai todos os blocos interativos de um Markdown.
 * @returns {{exercicios: object[], videos: object[], laboratorios: object[],
 *            interacoes: object[], aprofundamentos: object[]}}
 */
export function extrair(markdown, arquivo = "?", capitulo = 0) {
  const exercicios = [];
  const videos = [];
  const laboratorios = [];
  const interacoes = [];
  const aprofundamentos = [];
  const emCerca = cercas(markdown);

  for (const m of markdown.matchAll(RE_BLOCO)) {
    if (emCerca(m.index)) continue; // exemplo de sintaxe, não exercício
    const [, tipoBloco, attrsJson, corpo] = m;
    const attrs = parseAtributos(attrsJson, arquivo);

    if (tipoBloco === "interacao") {
      interacoes.push(montarInteracao(attrs, corpo, arquivo, capitulo));
      continue;
    }

    if (tipoBloco === "aprofundar") {
      aprofundamentos.push(montarAprofundamento(attrs, corpo, arquivo));
      continue;
    }

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
      // Item de prova é CRUZADO por definição (ADR 0014): declara os objetivos
      // de dois capítulos ou mais, e é isso que o distingue de "mais um
      // exercício". Cada entrada tem a forma "<arquivo-do-capitulo>:O<n>".
      // Quem cobra a regra é exercicios.mjs; aqui só se carrega o campo.
      objetivos: Array.isArray(attrs.objetivos) ? attrs.objetivos : null,
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

  return { exercicios, videos, laboratorios, interacoes, aprofundamentos };
}

/** Monta e valida uma interação a partir do bloco cru. Fonte única do objeto. */
function montarInteracao(attrs, corpo, arquivo, capitulo) {
  const { enunciado, passos, previsoes, meta } = fatiarInteracao(corpo);
  const ia = {
    id: attrs.id,
    capitulo,
    arquivo,
    tipo: attrs.tipo,
    titulo: attrs.titulo || null,
    enunciado,
    passos,
    previsoes,
    pergunta: meta.pergunta || null,
    revela: meta.revela || null,
    // Só no modo numérico do `prever`. A tolerância é declarada porque a
    // previsão de um leitor que arredondou diferente não pode "não bater" por
    // arredondamento — o mesmo cuidado do gabarito numérico do exercício.
    numero: attrs.numero == null ? null : String(attrs.numero),
    tolerancia: Number(attrs.tolerancia) || 0,
  };
  validarInteracao(ia, arquivo);
  return ia;
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
    if (tipoBloco === "interacao") return htmlInteracao(montarInteracao(attrs, corpo, arquivo, capitulo), renderMd);
    if (tipoBloco === "aprofundar") return htmlAprofundar(montarAprofundamento(attrs, corpo, arquivo), renderMd);
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

// ------------------------------------------------------ HTML do aprofundar

/**
 * O bloco inteiro tem de ser UM bloco HTML para o markdown-it, e bloco HTML
 * termina na primeira LINHA EM BRANCO. Daí este passo, que a interação também
 * dá (`semVazio`), com um cuidado a mais: dentro de `<pre>` a linha em branco é
 * conteúdo, e apagá-la corromperia o código que o autor escreveu. Lá ela vira a
 * entidade `&#10;`, que o navegador lê como quebra de linha e que não parte
 * bloco nenhum, porque no arquivo ela não é uma linha em branco.
 */
function umBlocoSo(html) {
  return String(html)
    .split(/(<pre[\s\S]*?<\/pre>)/)
    .map((parte, i) =>
      i % 2
        ? parte.replace(/\n(?:[ \t]*\n)+/g, (m) => "\n" + "&#10;".repeat(m.split("\n").length - 2))
        : parte.replace(/\n[ \t]*\n+/g, "\n"))
    .join("")
    .trim();
}

/**
 * UI de um aprofundamento: `<details>` FECHADO, sem uma linha de JavaScript.
 *
 * Fechado por padrão porque é aprofundamento, não conteúdo escondido: o fluxo
 * principal continua completo sem ele, e quem quer a conta pede a conta. O
 * `<summary>` é o único texto que conta no `innerText` do cartão — ver a
 * medição no cabeçalho da seção `aprofundar`, mais acima.
 */
function htmlAprofundar(ap, renderMd) {
  return `<details class="aprofundar">
<summary class="ap-cab"><span class="ap-tag">Aprofundar</span><span class="ap-titulo">${esc(ap.titulo)}</span></summary>
<div class="ap-corpo">${umBlocoSo(renderMd(ap.corpo))}</div>
</details>`;
}

// ------------------------------------------------------- HTML das interações

const ROTULO_INTERACAO = {
  principio: "explique antes de ver",
  desvanecido: "complete os passos que faltam",
  prever: "preveja antes de revelar",
};

const BOTAO_INTERACAO = {
  principio: "Revelar a explicação",
  desvanecido: "Conferir os passos",
  prever: "Revelar o resultado",
};

// O bloco inteiro tem de ser UM bloco HTML para o markdown-it, e bloco HTML
// termina na primeira linha em branco. Uma fórmula MathJax dentro de uma opção
// nasce com linhas em branco no `<style>` — foi assim que o II.7 e o III.1
// foram ao ar com um `<style>` aberto e meia página lida como CSS. O dedup do
// build já cuida daquele caso; isto aqui é o cinto.
const semVazio = (h) => String(h).replace(/\n[ \t]*\n+/g, "\n").trim();
const semParagrafo = (h) => semVazio(h).replace(/^<p>/, "").replace(/<\/p>$/, "");

/**
 * UI de uma interação — COM a revelação embutida, e é aqui que ela difere de
 * tudo o mais nesta casa. O `.ia-fonte` é um `<template>`: inerte, invisível,
 * fora do `innerText` (o gate dos cartões conta palavra, e a explicação só
 * passa a contar depois que o leitor a pediu) e sem uma linha de rede.
 */
function htmlInteracao(ia, renderMd) {
  // O botão NÃO nasce `disabled` nem `aria-disabled`. As duas coisas dizem à
  // tecnologia assistiva (e ao Playwright, que aplica a mesma regra) que o
  // controle está indisponível — e aí o motivo de ele não liberar, que mora no
  // `role="status"` ao lado, deixa de ser alcançável justamente por quem mais
  // precisa dele. O sinal de "ainda não" é `data-pronto`, que pinta e não
  // bloqueia; quem bloqueia é o `interacoes.js`, dizendo o porquê.
  const id = esc(ia.id);
  const tipo = esc(ia.tipo);

  let entrada;
  if (tipo === "desvanecido") {
    entrada = `<ol class="ia-passos">${ia.passos
      .map(
        (p, i) =>
          `<li class="ia-passo"><span class="ia-passo-rot">${semParagrafo(renderMd(p.rotulo))}</span>` +
          `<input class="ia-branco" type="text" inputmode="text" autocomplete="off" spellcheck="false"` +
          ` data-certo="${esc(p.certo)}" aria-label="passo ${i + 1}, a linha que falta"` +
          ` placeholder="?"><span class="ia-passo-cmp"></span></li>`
      )
      .join("")}</ol>`;
  } else if (tipo === "prever" && ia.previsoes.length) {
    entrada = `<ul class="ia-opcoes">${ia.previsoes
      .map(
        (o, i) =>
          `<li><label><input class="ia-opcao" type="radio" name="ia-${id}" value="${i}"${o.real ? ' data-real="1"' : ""}>` +
          `<span>${semParagrafo(renderMd(o.texto))}</span></label></li>`
      )
      .join("")}</ul>`;
  } else if (tipo === "prever") {
    entrada = `<div class="ia-entrada"><input class="ia-num" type="text" inputmode="decimal" autocomplete="off"` +
      ` data-real="${esc(ia.numero)}" data-tol="${esc(ia.tolerancia)}" aria-label="sua previsão, em número"` +
      ` placeholder="seu palpite"></div>`;
  } else {
    entrada = `<div class="ia-entrada"><textarea class="ia-livre" rows="3" aria-label="sua explicação"` +
      ` placeholder="Com suas palavras. Ninguém corrige isto: ela fica ao lado da explicação, para você comparar."></textarea></div>`;
  }

  const cabTitulo = ia.titulo ? `<span class="ia-titulo">${esc(ia.titulo)}</span>` : "";
  const pergunta = ia.pergunta ? `<p class="ia-pergunta">${semParagrafo(renderMd(ia.pergunta))}</p>` : "";

  return `<section class="interacao" data-interacao="${id}" data-tipo="${tipo}">
<header class="ia-cab"><span class="ia-tag">Interação</span>${cabTitulo}<span class="ia-modo">${ROTULO_INTERACAO[tipo]}</span></header>
<div class="ia-corpo">${semVazio(renderMd(ia.enunciado))}</div>
${pergunta}${entrada}
<div class="ia-acoes"><button class="ia-revelar" type="button" data-pronto="false" aria-describedby="ia-status-${id}">${BOTAO_INTERACAO[tipo]}</button><span class="ia-status" id="ia-status-${id}" role="status"></span></div>
<div class="ia-revelacao" aria-live="polite"></div>
<template class="ia-fonte">${semVazio(renderMd(ia.revela))}</template>
</section>`;
}

export { TIPOS, TIPOS_INTERACAO };
