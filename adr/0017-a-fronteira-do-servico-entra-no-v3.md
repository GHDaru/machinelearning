# ADR 0017 — A fronteira do serviço entra no V.3, e a política de violação é decisão do leitor

**Data:** 2026-08-13 · **Estado:** aceito · **Comitê:** lente pedagógica, lente de evidência, lente de processo

## Contexto

Segunda e última metade da dívida **D16**. O capítulo V.3 declara:

> **O2.** Implantar um modelo atrás de uma API com contrato e validação de entrada.

e o corpo não trata da fronteira da API em lugar nenhum: nem contrato de requisição e resposta, nem validação no serviço, nem o que acontece quando a entrada viola o contrato, nem versão de endpoint. A entrada `v-3-mlops.md: ["O2"]` está em `ORFAOS_ACEITOS`, em `publicar/exercicios.mjs`.

O [ADR 0016](0016-a-quem-pertence-a-escolha-da-forma-de-servico.md) resolveu a primeira metade fazendo o conteúdo subir. Aqui a pergunta se repete com sinal invertido, e por isso o comitê foi convocado de novo.

## O que o comitê disse

**As três lentes recomendaram escrever a seção.** Foi unânime, ao contrário do caso anterior, e cada uma pelo seu motivo.

**A pedagógica** mostrou que o verbo não tem para onde descer: versionar e registrar já são o O1, os drifts são o O3, e sombra, canário e reverter são o O4. Qualquer redação alternativa do O2 ou colide com um objetivo existente ou cobra uma remissão. Mostrou também que não é repetição do V.2: lá o contrato é **declarado** em tempo de desenho, como diagnóstico; aqui ele é **executado** em tempo de requisição. E fez a observação que mais pesou: sem essa seção, dois objetivos existentes ficam pendurados, porque a camada 2 do monitoramento manda vigiar esquema, faixas e nulos sem nunca dizer onde a checagem mora, e sombra e canário pressupõem versões endereçáveis.

**A de processo** achou o que faltava para fechar o caso: a trilha prática **já promete** essa etapa. Em `livro/trilha-ml-zero.md`, a etapa 15 aponta para este capítulo com a redação *"Serviço FastAPI com contrato, validação de entrada e versão de modelo"*, marcada 🚧. A lacuna era declarada, não esquecida.

**A de evidência** trouxe as fontes e, mais útil que elas, o limite delas.

## Decisão 1 — o conteúdo sobe, dentro de "Fundamentos"

A seção entra como a perna que faltava de "versionar, registrar, servir", e não como seção de topo. O escopo é o que é específico de ML: o contrato do V.2 na fronteira, a validação em duas camadas, a violação como falha ruidosa, a versão do modelo endereçável e o registro do que foi servido. **Não é tutorial de REST**: nada de códigos de status como assunto, nada de framework como assunto, nada de formato de payload genérico.

## Decisão 2 — a política de violação é apresentada como decisão, não como prescrição

Este é o ponto que a lente de evidência forçou, e ele muda o que eu ia escrever.

Nenhuma fonte aberta prescreve o que fazer quando **uma requisição** viola o contrato. As fontes falam de esquema sobre lotes de estatísticas, de skew entre treino e serviço, de contrato implícito entre o modelo e quem o consome. Nenhuma diz "rejeite" nem "use o padrão". Escrever uma prescrição seria opinião com aparência de fonte, contra o Princípio I.

Então o capítulo não prescreve. Ele apresenta as **três políticas** e mostra as três convivendo num serviço real, com caminho de arquivo e linha: o próprio backend deste livro. A regra que o capítulo ensina não é qual escolher, e sim que **a política é uma decisão escrita no contrato, e não um acidente da implementação** — e que a política silenciosa é a perigosa, o que aí sim tem fonte, na regra #10.

A leitura editorial vai selada 📖, separada do que as fontes sustentam.

## Decisão 3 — o exemplo trabalhado é o serviço deste livro, defeitos inclusive

`chat-companion/backend/app.py` entra como exemplo com caminho e linha, e entra **com o que ele faz de errado**: não tem versão de endpoint, e nenhuma rejeição vira sinal observável. O capítulo diz isso em voz alta.

É coerente com o que o livro já faz consigo mesmo no placar de expiração, e vale mais que um exemplo inventado: o leitor vê um serviço que funciona, em produção, servindo o próprio livro que ele está lendo, e vê onde ele está abaixo do que o capítulo recomenda.

## Alternativa recusada

**Rebaixar o verbo.** Recusada pela lente pedagógica, e a lente de processo mostrou que ela nem paga a dívida: o parser do gate lê o rótulo `- **O2.**`, e não o texto. Reescrever o texto do objetivo deixaria a entrada de `ORFAOS_ACEITOS` válida e a dívida registrada para sempre. Deletar o objetivo obrigaria a renumerar O3 e O4 e a mexer nos exercícios que apontam para eles.

## Consequências

- O V.3 vai a 12 exercícios, três por objetivo. A entrada `v-3-mlops.md: ["O2"]` sai de `ORFAOS_ACEITOS`, e **`ORFAOS_ACEITOS` fica vazia**: a D16 é paga por inteiro.
- **O risco que a lente de processo nomeou, e que eu aceito com mitigação:** pagar a D16 cobrando um verbo de produção com múltipla escolha engorda a **D13**. Por isso o exercício difícil do O2 é um desafio aberto na Verificação, com rubrica, no formato do [ADR 0012](0012-verificacao-como-superficie-corrigida.md), e o verbo *implantar* fica amarrado à etapa 15 do `ml-zero`, que segue 🚧 e declarada.
- O risco que a lente pedagógica nomeou, o de a seção virar tutorial de REST, é contido pelo escopo da Decisão 1.
- Fontes abertas em primeira mão nesta rodada: as regras #10, #29 e #37 das *Rules of ML*, a seção de *Model Serving* do CD4ML, e o guia do TensorFlow Data Validation. **O *ML Test Score* não abriu** e continua ✓ᵐ: o PDF falhou em três endereços, e nenhum teste numerado dele é citado.
