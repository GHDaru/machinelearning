# ADR 0005 — O selo `✓ᵃ` (resumo lido no original), e a trava contra selos cunhados por fora

**Data:** 2026-08-10 · **Estado:** aceito · **Emenda:** constituição 1.3.0

## Contexto

Durante a escrita da linhagem conexionista, um agente **cunhou um selo por conta própria**: `✓ᵃ`, definido como *"página do arXiv aberta e resumo lido literalmente; o corpo, não"*. Usou-o no capítulo 11, com uma linha de legenda; o capítulo 12 usou o mesmo selo com **palavras diferentes**. A constituição define cinco selos, e `✓ᵃ` não é um deles.

Isso não foi má-fé — foi o oposto. O agente estava sob a pressão de honestidade que o Princípio X impõe e precisava de um selo que não existia: ele **tinha lido o resumo**, o que é mais do que conferir um DOI e menos do que ler o artigo. Sem `✓ᵃ`, as opções eram inflar para ✓ (mentira) ou rebaixar para ✓ᵐ (apagar trabalho real).

O parecer de conformidade foi pedido a um revisor independente, e o veredicto foi: **violação de processo sobre um mérito legítimo**. Um capítulo não usou um selo — ele **legislou**.

## Decisão

**1. A constituição passa a 1.3.0 e adota `✓ᵃ` como sexto selo oficial**, com esta definição:

> | ✓ᵃ | **Resumo lido no original.** A página do artigo foi aberta e o resumo lido literalmente; o corpo, não. Autoriza citar o resumo entre aspas e afirmar a tese que os autores **declaram** |

**Regra de uso:** `✓ᵃ` exige o identificador da fonte na própria linha (DOI ou arXiv), e vale **só para o resumo publicado pelos autores**. *Snippet* de busca ou resumo gerado por máquina nunca dá `✓ᵃ` — é ✓ᵐ na melhor hipótese.

**O que `✓ᵃ` proíbe afirmar:** qualquer coisa do corpo — número, tabela, protocolo, condição experimental, limitação, atribuição interna, ou "o artigo mostra que X". **`✓ᵃ` sustenta o que os autores dizem que fizeram, nunca o que o artigo demonstra.**

**2. O gate do build passa a derivar o alfabeto de selos da própria constituição**, e falha em **qualquer** selo desconhecido — *allowlist* com falha no desconhecido, em vez de regex que passa ao encontrar um selo conhecido.

**3. O gate falha se um capítulo redefinir um selo** (linha de "legenda" própria). A definição vive num lugar só.

## Alternativas avaliadas

**A. Rebaixar todo `✓ᵃ` para ✓ᵐ e proibir selos novos.** Rejeitada: **destrói informação verificada**. O capítulo 11 tem o achado de que *o resumo do artigo da atenção não contém a palavra "attention"* — afirmação impossível de sustentar com ✓ᵐ, porque metadado não vê texto, e mentirosa como ✓, que declara fonte lida. Colapsar apagaria o melhor achado do capítulo.

**B. Manter `✓ᵃ` só como notação interna da nota de pesquisa, nunca no capítulo.** Rejeitada por incoerência: se `estudos/` pode registrar a distinção, o capítulo tem de poder declará-la ao leitor. **Esconder do leitor a qualificação mais precisa que se tem é o oposto do Princípio X.**

**C. Adotar o selo sem mexer no gate.** Rejeitada, e é a alternativa mais perigosa — ver abaixo.

## Justificativa

A distinção é real, e a escala fica coerente porque cada degrau **autoriza uma coisa diferente**: metadado prova que a obra **existe**; resumo lido autoriza citar o resumo e afirmar a **tese declarada**; leitura completa autoriza afirmar o que o artigo **demonstra**. É exatamente a mesma lógica que já justificou ✓ᵐ contra ✓.

Uma ressalva entrou no texto da emenda porque sem ela os dois se confundiriam: **o resumo do arXiv é texto primário assinado pelos autores** — não é o "resumo de busca" contra o qual o Princípio X adverte. A armadilha continua valendo para *snippet* e para resumo gerado.

**Mas o achado que mais importa aqui é sobre o gate, não sobre o selo.** O revisor mostrou que o gate estava dando **falso verde**: ele exigia *uma* linha casada com um selo conhecido, então uma tabela inteira em `✓ᵃ` barraria o capítulo, enquanto o capítulo 11 passava **por carona** nas linhas que tinham ✓. Um gate assim aprova pelo motivo errado.

A troca para *allowlist* derivada da constituição inverte isso: cunhar um selo passa a **exigir editar a constituição**, que é precisamente o comportamento desejado. A trava é mecânica, não uma boa intenção — que é a regra que o Princípio IX ("prove, não declare") já impunha ao resto do projeto.

## Consequências

**Mais fácil:** declarar com precisão o que se conferiu, sem inflar nem apagar trabalho; e detectar automaticamente qualquer selo inventado, em vez de depender de alguém reparar.

**Mais difícil:** acrescentar um selo agora custa uma emenda — de propósito.

**Corrigido junto, por indicação do mesmo parecer:** uma linha `✓ᵃ` sem fonte identificada no capítulo 12; duas definições divergentes de `✓ᵃ` (caps. 11 e 12), agora removidas em favor da definição única na constituição; e dois trechos do capítulo 11 que afirmavam em registro assertivo o que a tabela marcava ⏳ — a **terceira proibição** do Princípio X (não misturar registro).

**Aceito conscientemente:** o alfabeto de selos agora tem seis símbolos, e seis é mais do que um leitor guarda de cabeça. A mitigação é que a legenda aparece por extenso no Guia Editorial e a distinção só precisa ser lida quando o leitor quiser auditar uma afirmação — que é quando ela importa.
