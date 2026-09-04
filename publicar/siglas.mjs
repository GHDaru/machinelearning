// Siglas "abertas" do livro — FONTE ÚNICA, e o glossário espelha (Guia Editorial).
//
// O dicionário e o passe que o aplica moram num módulo próprio desde 2026-09-04,
// por três leitores: o motor (`build.mjs`), que chama `abrirSiglas`; a asserção H
// de `publicar/jornada.mjs`, que abre a página e cobra que o embrulho tenha
// acontecido; e `publicar/testes/siglas.mjs`, que dirige o passe sem construir o
// livro. Duas cópias do dicionário seriam duas verdades, e um passe que só se
// exercita pelo build inteiro é um passe sem teste rápido.

export const SIGLAS = {
  ML: "Machine Learning", IA: "Inteligência Artificial",
  MLP: "Multi-Layer Perceptron", CNN: "Convolutional Neural Network", RNN: "Recurrent Neural Network",
  LSTM: "Long Short-Term Memory", GRU: "Gated Recurrent Unit", GAN: "Generative Adversarial Network",
  SVM: "Support Vector Machine", KNN: "K-Nearest Neighbors", PCA: "Principal Component Analysis",
  SGD: "Stochastic Gradient Descent", MSE: "Mean Squared Error", MAE: "Mean Absolute Error",
  EQM: "Erro Quadrático Médio — o MSE da literatura em inglês", SQE: "Soma dos Quadrados dos Erros",
  EAM: "Erro Absoluto Médio — o MAE da literatura em inglês",
  RMSE: "Root Mean Squared Error", MAPE: "Mean Absolute Percentage Error",
  AUC: "Area Under the Curve", ROC: "Receiver Operating Characteristic",
  RL: "Reinforcement Learning", MDP: "Markov Decision Process", PPO: "Proximal Policy Optimization",
  RLHF: "Reinforcement Learning from Human Feedback", DQN: "Deep Q-Network",
  LLM: "Large Language Model", NLP: "Natural Language Processing", RAG: "Retrieval-Augmented Generation",
  BERT: "Bidirectional Encoder Representations from Transformers", GPT: "Generative Pre-trained Transformer",
  SHAP: "SHapley Additive exPlanations", LIME: "Local Interpretable Model-agnostic Explanations",
  MLOps: "Machine Learning Operations",
  ETL: "Extract, Transform, Load", API: "Application Programming Interface",
  SDK: "Software Development Kit", CLI: "Command-Line Interface", GPU: "Graphics Processing Unit",
  CPU: "Central Processing Unit", TPU: "Tensor Processing Unit",
  JSON: "JavaScript Object Notation", HTTP: "HyperText Transfer Protocol", CSV: "Comma-Separated Values",
  DOI: "Digital Object Identifier", LGPD: "Lei Geral de Proteção de Dados",
  IQR: "Interquartile Range — intervalo interquartil (Q3 − Q1)",
  ARIMA: "AutoRegressive Integrated Moving Average", ACF: "Autocorrelation Function — função de autocorrelação",
  PACF: "Partial Autocorrelation Function — função de autocorrelação parcial",
  OLAP: "Online Analytical Processing", OLTP: "Online Transaction Processing",
  ELT: "Extract, Load, Transform", CRISP: "CRoss-Industry Standard Process",
  EDA: "Exploratory Data Analysis — análise exploratória de dados",
  CART: "Classification and Regression Trees", TF: "Term Frequency", IDF: "Inverse Document Frequency",
  IID: "Independent and Identically Distributed", ERM: "Empirical Risk Minimization",
  PAC: "Probably Approximately Correct", NLL: "Negative Log-Likelihood",
  KL: "Kullback-Leibler", ELBO: "Evidence Lower Bound", DDD: "Domain-Driven Design",
};

const RE_SIGLAS = new RegExp("\\b(" + Object.keys(SIGLAS).sort((a, b) => b.length - a.length).join("|") + ")\\b", "g");
// ONDE O `<abbr>` NÃO ENTRA, e por quê cada um está aqui.
//
//   pre, code  o texto é identificador: `AUC` numa chamada de função é nome.
//   a          o link já tem afordância própria; sublinhado pontilhado dentro
//              de sublinhado de link é ruído em cima de ruído.
//   abbr       já embrulhado; embrulhar de novo aninharia.
//   h1..h6     o cabeçalho vira âncora e sumário, e o `title` não cabe ali.
//   script, style  não é texto do leitor.
//   textarea   o conteúdo de um `<textarea>` é literal: uma tag aqui apareceria
//              escrita, com sinal de maior e tudo, dentro da caixa de resposta.
//
// O que saiu desta lista em 2026-09-04, e por que estava errado (D24):
//
//   input      é elemento VAZIO. Ele não tem texto dentro para proteger, e como
//              o motor escreve `<input ...>` sem a barra final, o contador de
//              proteção subia e NUNCA descia. Da primeira alternativa de
//              exercício em diante a página inteira ficava protegida, blocos
//              interativos e prosa comum juntos. Era esta a causa real de o
//              II.2 ter zero `<abbr>` usando "AUC" quatro vezes.
//   label      é onde mora o texto da alternativa de múltipla escolha e o
//              "Marcar como assistido" do vídeo. É prosa que o leitor lê.
//   button     é o rótulo do gesto, e um laboratório pode nomear uma sigla ali.
//
// A guarda de elemento vazio fica separada da lista, para o erro não voltar
// pela porta de quem acrescentar `img` ou `br` à proteção sem reparar que
// elemento vazio não fecha.
const TAGS_PROT = /^(pre|code|a|abbr|h[1-6]|script|style|textarea)$/i;
const TAGS_VAZIAS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;
export function ligarCitacoes(texto) {
  return texto.replace(/arXiv\s+(\d{4}\.\d{4,5})/g,
    (m, id) => `<a class="cita" href="bibliografia.html" title="ver na Bibliografia">arXiv ${id}</a>`);
}
/**
 * Embrulha em `<abbr>` cada sigla conhecida que aparece em TEXTO.
 *
 * Roda no HTML final da página, depois de os blocos interativos já terem
 * virado HTML: é por isso que o alcance dela é a página inteira, e não só a
 * prosa. Nunca dentro de atributo, porque o laço consome a tag inteira
 * (`<tag ...>`) como um pedaço só e nunca substitui nada lá dentro.
 *
 * Nunca no lado da resposta, e isso é herdado, não conferido aqui: o gabarito,
 * o `porque` e a rubrica não chegam a existir no HTML (Princípio VIII.3), e o
 * gate de vazamento do Markdown exportado guarda a outra porta. O que este
 * passe toca do bloco interativo é o que o leitor já vê na tela.
 */
export function abrirSiglas(html) {
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  const sub = (t) => ligarCitacoes(t).replace(RE_SIGLAS, (s) => `<abbr title="${SIGLAS[s]}">${s}</abbr>`);
  let out = "", last = 0, m, prot = 0;
  while ((m = re.exec(html))) {
    const txt = html.slice(last, m.index);
    out += prot > 0 ? txt : sub(txt);
    const tag = m[1].toLowerCase();
    const abreEscopo = TAGS_PROT.test(tag) && !TAGS_VAZIAS.test(tag) && !m[0].endsWith("/>");
    if (abreEscopo) prot += m[0][1] === "/" ? -1 : 1;
    if (prot < 0) prot = 0;
    out += m[0];
    last = re.lastIndex;
  }
  return out + (prot > 0 ? html.slice(last) : sub(html.slice(last)));
}

