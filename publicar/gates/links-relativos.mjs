// Gate dos LINKS RELATIVOS: todo link relativo do Markdown aponta para um
// arquivo que existe no repositório.
//
// POR QUE ELE EXISTE — e este é o pior tipo de defeito, porque o gate MENTIA.
//
// O `build.mjs` imprimia "links internos OK" ao fim de toda geração, e não
// conferia link nenhum. A frase era decorativa. Sete links do livro publicado
// apontavam para arquivo inexistente, entre eles QUATRO numa prova que aluno faz.
//
// A causa está no reescritor de links do build. Ele faz:
//
//     se o alvo é .md E o slug está publicado  ->  vira .html local
//     senão                                    ->  vira URL do GitHub
//
// O `senão` existe por um motivo legítimo: link para `ml-zero/etapa-05/linear.py`
// tem de ir para o GitHub mesmo. Só que ele engole também o `.md` que não existe:
// um capítulo com nome errado não quebra nada, vira uma URL do GitHub bem-formada
// que devolve 404 ao leitor. Erro de digitação sai daqui parecendo link bom.
//
// Um 404 no GitHub é pior que um link morto óbvio: ele tem cara de link certo,
// e o leitor conclui que o material sumiu, não que o livro errou o endereço.
//
// O QUE ELE COBRA
//
//   Todo `[texto](alvo)` com alvo relativo — sem esquema, sem `//`, e que não
//   seja só âncora — resolve para um arquivo existente. A âncora (`#secao`) é
//   ignorada aqui: quem confere âncora é o build, que conhece os slugs gerados.
//
// Uso:  node publicar/gates/links-relativos.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Onde procurar: o livro é o que o leitor lê. Fora dele, link quebrado é
// problema de manutenção, não de leitura — e entra quando alguém quiser.
const PASTAS = ["livro"];

function todosOsMd(dir, achados = []) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) todosOsMd(caminho, achados);
    else if (nome.endsWith(".md")) achados.push(caminho);
  }
  return achados;
}

export function verificar() {
  const problemas = [];
  let conferidos = 0;
  const arquivos = PASTAS.flatMap((p) => todosOsMd(resolve(RAIZ, p)));

  for (const arq of arquivos) {
    const fonte = readFileSync(arq, "utf8");
    for (const m of fonte.matchAll(/\[([^\]]*)\]\(([^)\s]+?)\)/g)) {
      const alvo = m[2];
      if (/^(https?:|#|mailto:|\/\/|data:)/.test(alvo)) continue;
      const semAncora = alvo.split("#")[0];
      if (!semAncora) continue;              // link só de âncora
      conferidos++;
      if (existsSync(resolve(dirname(arq), semAncora))) continue;
      const linha = fonte.slice(0, m.index).split("\n").length;
      problemas.push({
        arquivo: arq.slice(RAIZ.length + 1), linha, alvo, texto: m[1].slice(0, 40),
      });
    }
  }
  return { conferidos, problemas };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { conferidos, problemas } = verificar();
  if (problemas.length) {
    console.error(`✗ ${problemas.length} link(s) relativo(s) apontando para arquivo inexistente:`);
    for (const p of problemas) {
      console.error(`   ${p.arquivo}:${p.linha} → ${p.alvo}   ("${p.texto}")`);
    }
    console.error("\n   O reescritor do build manda o que não reconhece para o GitHub,");
    console.error("   então isto vira uma URL bem-formada que devolve 404 ao leitor.");
    process.exit(1);
  }
  console.log(`✓ ${conferidos} link(s) relativo(s) do livro resolvem para arquivo existente.`);
}
