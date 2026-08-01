// Knowledge Graph do livro — extração DETERMINÍSTICA, sem LLM.
// Nós: capítulos, conceitos-chave de ML, etapas do ml-zero, datasets do livro.
// Arestas: menções reais no texto (peso = nº de ocorrências) — evidência verificável.
// Chamado pelo build.mjs a cada build ⇒ o grafo acompanha toda mudança do livro.

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Conceitos com verbete no glossário. A grafia é a que o livro usa; o `re`
// existe para não capturar falsos positivos (ex.: "viés" dentro de "viésado").
const CONCEITOS = [
  { id: "generalizacao", rotulo: "generalização", re: /\bgeneraliza(?:ção|r|ções)\b/gi },
  { id: "overfitting", rotulo: "overfitting", re: /\boverfit(?:ting)?\b/gi },
  { id: "underfitting", rotulo: "underfitting", re: /\bunderfit(?:ting)?\b/gi },
  { id: "vies-variancia", rotulo: "viés–variância", re: /\bvi[ée]s[–-]vari[âa]ncia\b/gi },
  { id: "validacao-cruzada", rotulo: "validação cruzada", re: /\bvalida[çc][ãa]o\s+cruzada\b/gi },
  { id: "vazamento", rotulo: "vazamento de dados", re: /\bvazamento(?:\s+de\s+dados)?\b/gi },
  { id: "regularizacao", rotulo: "regularização", re: /\bregulariza(?:ção|ções|dor)\b/gi },
  { id: "gradiente", rotulo: "gradiente descendente", re: /\bgradiente\b/gi },
  { id: "funcao-de-perda", rotulo: "função de perda", re: /\bfun[çc][ãa]o\s+de\s+perda\b/gi },
  { id: "embedding", rotulo: "embedding", re: /\bembedding(?:s)?\b/gi },
  { id: "atencao", rotulo: "atenção", re: /\baten[çc][ãa]o\b/gi },
  { id: "transformer", rotulo: "Transformer", re: /\bTransformers?\b/g },
  { id: "boosting", rotulo: "boosting", re: /\bboosting\b/gi },
  { id: "drift", rotulo: "drift", re: /\bdrift\b/gi },
  { id: "calibracao", rotulo: "calibração", re: /\bcalibra(?:ção|do|r)\b/gi },
  { id: "matriz-confusao", rotulo: "matriz de confusão", re: /\bmatriz\s+de\s+confus[ãa]o\b/gi },
  { id: "auc", rotulo: "AUC / ROC", re: /\b(?:AUC|ROC)\b/g },
  { id: "transferencia", rotulo: "transferência de aprendizado", re: /\btransfer[êe]ncia\s+de\s+aprendizado\b/gi },
  { id: "rag", rotulo: "RAG", re: /\bRAG\b/g },
  { id: "interpretabilidade", rotulo: "interpretabilidade", re: /\binterpretabilidade\b/gi },
];

// Etapas da construção prática. Uma por capítulo (ver ml-zero/README.md).
const ETAPAS = [
  "00 dado e baseline", "01 avaliação honesta", "02 pipeline de dados", "03 atributos",
  "04 métricas e validação", "05 modelo linear do zero", "06 otimizador do zero",
  "07 ensembles", "08 clustering", "09 rede neural do zero", "10 visão",
  "11 sequências", "12 embeddings e RAG", "13 política por reforço",
  "14 explicação da decisão", "15 serviço de inferência", "16 monitoramento e drift",
];

const GH = "https://github.com/GHDaru/machinelearning/tree/main/ml-zero";

function contar(re, texto) {
  const m = texto.match(re);
  return m ? m.length : 0;
}

export function gerarGrafo(itens, RAIZ, versao) {
  const capitulos = itens.filter((i) => /^\s*\d+\s*—/.test(i.titulo));
  const nos = [];
  const arestas = [];
  const addAresta = (de, para, peso) => {
    if (peso > 0 && de !== para) arestas.push({ de, para, peso });
  };

  for (const c of capitulos) {
    const num = c.titulo.match(/^\s*(\d+)/)[1];
    nos.push({ id: "cap-" + num, tipo: "capitulo", rotulo: c.titulo, url: c.slug + ".html" });
  }
  for (const co of CONCEITOS) nos.push({ id: co.id, tipo: "conceito", rotulo: co.rotulo, url: "glossario.html" });
  ETAPAS.forEach((e, i) => {
    const n = String(i).padStart(2, "0");
    nos.push({ id: "etapa-" + n, tipo: "etapa", rotulo: "etapa " + e, url: GH });
  });

  for (const c of capitulos) {
    const caminho = resolve(RAIZ, c.arquivo);
    if (!existsSync(caminho)) continue;
    const num = c.titulo.match(/^\s*(\d+)/)[1];
    const id = "cap-" + num;
    // corpo sem blocos de código (código cita nomes por razões mecânicas, não conceituais)
    const texto = readFileSync(caminho, "utf8").replace(/```[\s\S]*?```/g, " ");

    // capítulo → capítulo ("cap. NN" / "capítulo NN")
    const porCap = {};
    for (const m of texto.matchAll(/\bcap(?:ítulos?|s?\.)\s*(\d{1,2})\b/gi)) {
      const alvo = String(parseInt(m[1], 10)).padStart(2, "0");
      if (alvo !== num && capitulos.some((x) => x.titulo.trim().startsWith(alvo))) porCap[alvo] = (porCap[alvo] || 0) + 1;
    }
    for (const alvo of Object.keys(porCap)) addAresta(id, "cap-" + alvo, porCap[alvo]);

    for (const co of CONCEITOS) addAresta(id, co.id, contar(co.re, texto));

    // capítulo → etapa ("etapa N" — tipicamente na Mão na massa)
    const porEtapa = {};
    for (const m of texto.matchAll(/\betapas?\s+(\d{1,2})\b/gi)) {
      const n = String(parseInt(m[1], 10)).padStart(2, "0");
      if (parseInt(n, 10) < ETAPAS.length) porEtapa[n] = (porEtapa[n] || 0) + 1;
    }
    for (const n of Object.keys(porEtapa)) addAresta(id, "etapa-" + n, porEtapa[n]);
  }

  // poda: nós sem nenhuma aresta saem (mantém o grafo honesto)
  const conectados = new Set();
  arestas.forEach((a) => {
    conectados.add(a.de);
    conectados.add(a.para);
  });
  const nosFinais = nos.filter((n) => conectados.has(n.id));

  return { versao, nos: nosFinais, arestas };
}
