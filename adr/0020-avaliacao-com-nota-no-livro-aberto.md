# ADR 0020 — Avaliação com nota num livro aberto

- **Estado:** aceito
- **Data:** 2026-08-14
- **Decisores:** autor + comitê de três especialistas (avaliação, backend/privacidade, experiência do aluno)
- **Emenda a:** ADR 0008 (identificação opt-in), ADR 0014 (instrumentos de avaliação), ADR 0019 (prova de capítulo)

## Contexto

O autor precisa aplicar avaliação valendo nota às turmas dele, e receber por aluno: o que
fez, quando fez, quanto tempo levou, a nota, e o identificador dele.

O livro já tem quase metade disso e ninguém tinha notado. A tabela `tentativas` grava
cada resposta com `created_at` (`store.py:261-269`); `identificacoes` guarda o vínculo
turma/aluno, opt-in (ADR 0008); e `GET /turma/{turma}` já exporta progresso agregado em
JSON ou CSV sob token (`app.py:472-492`). Falta o relógio de duração, a nota, e a
distinção entre praticar e ser avaliado.

Três especialistas leram o repositório em paralelo. Convergiram no essencial e
divergiram do pedido literal em dois pontos, ambos registrados abaixo.

## O defeito que bloqueava tudo

Verificado no backend em produção, com duas requisições anônimas:

```
tentativa 1 (resposta errada) → revelado=False
tentativa 2 (resposta errada) → revelado=True, feedback traz "Resposta esperada"
```

`TENTATIVAS_ATE_REVELAR = 2` (`exercicios.py:24`) entrega o gabarito na segunda
tentativa, e o `session_id` é inventado pelo cliente — trocá-lo zera o contador de taxa.
Vale para os 82 itens marcados como prova.

Isso **não** vaza nada que já não seja público: os gabaritos estão em texto limpo no
Markdown das provas, num repositório aberto, e o ADR 0019 aceitou esse risco de olhos
abertos. Mas ele o aceitou para um instrumento **que não valia nota**. Anexar nota
reabre a decisão.

## Decisões

**1. O modo é propriedade da APLICAÇÃO da prova, nunca do item.**

Suprimir feedback nos itens de prova quebraria o princípio VIII.2 ("feedback que só diz
'errado' é proibido") para quem usa esses mesmos itens praticando. O mesmo item precisa
servir aos dois usos. Entra um objeto `avaliacoes` que declara turma, itens, janela e
tentativas; `corrigir()` ganha um modo que, em avaliação, força uma tentativa, nunca
revela e retém o feedback até o fechamento.

**2. A correção é sempre do servidor. A nota nunca vem do arquivo.**

O princípio VIII.3 diz que "a página nunca carrega o gabarito", e um pacote JSON que se
corrige sozinho é um pacote com o gabarito dentro. O aluno pode responder sem rede, mas
quem calcula é o servidor. Se ele editar um campo de pontos no arquivo devolvido, o campo
é ignorado — e isso vira teste.

Corolário: **assinatura criptográfica no caderno de ida foi recusada.** Exigiria
distribuir uma chave para a turma inteira, e chave distribuída não é chave. O que se
assina é o **recibo de volta**.

**3. A distinção útil não é online/offline, é síncrono/assíncrono.**

Quem está sem rede não é excluído se puder responder agora e enviar depois. O que exclui
é exigir conexão *durante* a resposta.

**4. Item aberto fica fora da nota automática.**

Ele é o único tipo que chama o modelo, e degrada em silêncio para "errado" quando não há
LLM disponível (`exercicios.py:135-141`) — numa lista é um aviso, numa prova é um zero
injusto. Além disso é não-determinístico, o que é indefensável num recurso. Consequência
boa: os quatro tipos determinísticos rodam **sem LLM nenhum**, então uma prova inteira
funciona com a chave da API fora do ar.

**5. "Quanto tempo levou" é registrado, e rotulado pelo que ele não é.**

Só se mede honestamente a diferença entre a primeira e a última submissão, pelo relógio
do **servidor**. Isso não é tempo de trabalho: quem responde a primeira questão, almoça e
responde a última marca noventa minutos. A coluna vai para a planilha com essa ressalva
por extenso.

Recusados explicitamente: duração calculada no cliente (é um número que o aluno controla
com uma linha de `fetch`, e uma coluna que parece medida e é declarada é pior que coluna
nenhuma) e telemetria de foco de aba (mede "aba visível", não "aluno pensando", e
transforma o livro em software de vigilância).

O que o autor provavelmente quer de verdade é **janela de entrega** — abre às X, fecha às
Y, verificado no servidor. Isso sobrevive a um aluno adversarial; duração não.

**6. `GET /turma` não muda. Entra uma superfície nova e estreita.**

O texto que o aluno lê ao se identificar promete que o professor **não** vê o conteúdo
das respostas, e há um teste que quebra se vazar. O ADR 0008 já deixou o procedimento:
"muda-se a frase primeiro, e depois o código". A leitura de respostas fica escopada por
avaliação, sob uma frase de consentimento própria, gravada com versão na avaliação.

**7. A entrega sobrevive ao botão de apagar a sessão.**

`tentativas` pende de `sessions` com `ON DELETE CASCADE` (`store.py:263`). Hoje, um aluno
que apagar a sessão depois da prova apaga o próprio registro, e o professor não distingue
"não fez" de "fez e apagou". Nota apagável pelo avaliado não é nota.

A entrega passa a ser chaveada por `(avaliacao_id, matricula)`, sem cascade. Apagar a
sessão **apaga o texto das respostas** e preserva a linha mínima: que houve entrega,
quando, quanto tempo, quanto pontuou. E a frase de consentimento diz isso **antes**.

**8. Pontuar por ter feito, não por ter acertado, enquanto for remoto.**

Prova online sem proctoring mede quem fez, não quem sabe. O gabarito está publicado, a
identidade é autodeclarada, e nada impede consulta ou segunda sessão. A alternativa —
criar um pool de itens não publicados — compra rigor ao preço da premissa central do
projeto. Não vale. Em aplicação **presencial**, com o backend servindo de caderno de
registro, a nota por acerto volta a ser defensável.

## O que foi entregue agora, antes do resto

A folha de impressão (`estilo.css`, bloco `@media print`). Ctrl+P em qualquer capítulo ou
prova produz papel ou PDF: sem barra lateral, sem rodapé, sem botões de responder, sem
laboratório, com os exercícios inteiros e sem quebra no meio. Custo zero, sem servidor,
sem exportador — que é o caminho que o princípio VI pede.

Foi a recomendação de melhor retorno por esforço de todo o comitê, e `interativos.css` já
fazia metade do trabalho desde antes.

## Pendências que travam a implementação

- **O que é "código" no pedido do autor.** Matrícula do aluno, ou código-fonte que ele
  escreveu? Se for código-fonte, não existe tipo `codigo` no banco, o campo `aberta` é uma
  textarea de quatro linhas com autocorreção ligada, e o gate proíbe item não
  determinístico em prova. Correção automática de código é outro produto; enquanto ele não
  existir, o honesto é receber o **link do notebook** e corrigir à mão.
- **Pool de conexões.** `_conn()` abre conexão nova a cada chamada (`store.py:219-220`).
  Não é dívida desta feature; é defeito de hoje que a primeira carga simultânea — a prova —
  vai expor.

## Consequências

Boas: o professor ganha planilha por aluno e por item; a prova funciona sem LLM; o papel
funciona sem nada. Ruins: passam a conviver duas políticas de privacidade, "prática
anônima" e "avaliação identificada", e o erro que arruinaria tudo é o aluno achar que vale
a primeira quando vale a segunda. Por isso a frase é gravada na avaliação, versionada, e
não fica escrita no código.
