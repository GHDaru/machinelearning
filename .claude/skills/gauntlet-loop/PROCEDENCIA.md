# Procedência da skill `gauntlet-loop`

**Origem:** [`robonuggets/gauntlet-loop`](https://github.com/robonuggets/gauntlet-loop),
arquivo `.claude/skills/gauntlet-loop/SKILL.md`, baixado em **2026-09-01**.
`SKILL.md` está aqui **sem alteração** — o diff com o original é vazio de propósito.

**Licença:** Creative Commons **Attribution 4.0 International** (CC BY 4.0), declarada no
`LICENSE` do repositório de origem. Exige atribuição, que é o que este arquivo faz.

**Conteúdo:** instrução pura. Sem script, sem hook, sem shell — conferido antes de instalar.

## Como ela se encaixa neste repositório

O Gauntlet Loop é a mesma ideia do **Princípio II** da constituição do Maestro — *quem
executa não verifica* —, com dois acréscimos que este repositório não tinha escritos:

1. **O crítico é cego.** Ele não vê a justificativa de quem construiu, e julga A/B com os
   rótulos removidos. A revisão em contexto fresco daqui já era independente; cega, não era.
2. **A saída é vencer a comparação, não cumprir N rodadas.** A skill diz, e vale copiar:
   *"Named exit after N rounds"* é um dos modos de falha do loop.

Duas regras deste repositório prevalecem, e não contradizem o texto:

- **A barra tem metade mensurável obrigatória.** A skill diz que "gosto mais um número
  bate gosto sozinho" e trata isso como preferência. Aqui o Princípio IX torna obrigatório:
  o portão do crítico é código de saída, não julgamento.
- **O merge continua sendo do autor.** A skill manda não pedir direção a cada rodada, e isso
  vale para as rodadas. O portão de publicação é humano, como sempre.

## Registro de um erro meu, porque ele é instrutivo

Na primeira tentativa instalei a skill **errada**: procurei "gauntlet" na web e achei
`hjupter/claude-gauntlet`, que é outra coisa — ela *executa* o loop, enquanto esta *escreve
o prompt* que faz outro agente executá-lo. As duas descrevem o mesmo padrão e resolvem
problemas diferentes.

O autor corrigiu com o endereço certo. Fica a lição: **busca por palavra devolve homônimo**,
e "achei um repositório com o nome certo" não é o mesmo que "achei o que foi pedido".
