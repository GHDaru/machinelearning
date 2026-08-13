# Autor e método

## Quem escreve

**Gilsiley Henrique Darú** — edição, direção e orquestração. [LinkedIn](https://www.linkedin.com/in/gilsiley-dar%C3%BA/)

## Divulgação de autoria (transparência)

Este livro é **co-escrito com um agente de IA (Claude, da Anthropic)** operando sob **autoria, curadoria e responsabilidade humanas**.

A divisão é explícita:

| Quem | O quê |
|---|---|
| **Humano** | Define o escopo, decide, verifica as fontes, responde pelo conteúdo |
| **Agente de IA** | Executa pesquisa, redação e o ciclo spec-kit, sob a constituição do projeto |

Seguindo o consenso das políticas editoriais e científicas (ICMJE, COPE, *Nature*, *Science*), **a IA não é listada como autora** (não pode ser responsabilizada pelo conteúdo) e seu uso é divulgado aqui e, edição por edição, no [Histórico](HISTORICO.md), **com a versão do modelo usada**.

O motivo do registro por versão é técnico, não cerimonial: saídas de modelo de linguagem são não-determinísticas. Sem saber qual modelo produziu qual edição, ninguém, inclusive o autor, consegue auditar depois de onde veio uma afirmação.

## As salvaguardas

O risco conhecido de escrever com um modelo de linguagem é a **fabricação plausível**: referências que não existem, números que soam certos, resultados que ninguém mediu. A resposta deste projeto está na constituição e é verificável no repositório:

1. **Nenhuma afirmação empírica sem experimento reproduzível ou citação ✓** (Princípio I). A [bibliografia](bibliografia.md) marca explicitamente o que ainda não foi conferido, e o que está ⏳ não pode sustentar afirmação no corpo.
2. **Nenhum resultado copiado sem reexecução** (Princípio II), salvo citação datada e explícita.
3. **Todo número tem um script que o regenera**, em CPU e sem chave paga.
4. **Ciclo spec-driven** (Princípio VII): cada melhoria tem spec, plano com Constitution Check, tarefas e verificação — rastreável no `specs/`.

A IA amplia o alcance da pesquisa e a velocidade da estruturação. O julgamento, a verificação e a assinatura são humanos.

## O método, em uma frase

Escrever de trás para frente (objetivos antes do texto), praticar antes de achar que entendeu (exercícios corrigidos no servidor), construir para saber de verdade (`ml-zero`), e datar tudo porque tudo expira.
