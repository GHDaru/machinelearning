# Plan 002 — Capítulo I.3: Dados

**Spec:** [spec.md](spec.md) · **Raia:** plena · **Data:** 2026-08-05

## Constitution Check (portão)

| Princípio | Como cumpre | Risco |
|---|---|---|
| **I — Evidência** | A única referência citada no corpo (Gebru et al., *Datasheets for Datasets*) foi conferida na fonte e promovida a ✓. Os números do capítulo são ilustrativos e declarados como tal. | Citar de memória. Mitigado: conferência antes do commit. |
| **II — Experimento executável** | Cada afirmação metodológica do capítulo tem um teste correspondente na etapa 02. A lição central ("embaralhar por linha vaza o sujeito") é uma asserção executável. | — |
| **III — Método pedagógico** | Esqueleto v4; worked examples (o bloco ERRADO/CERTO) antes dos exercícios; dificuldade crescente: reconhecimento → aplicação → julgamento. | — |
| **IV — Livro vivo** | Selo de captura 2026-08; entrada no HISTORICO com a versão do modelo. Sem cláusula de expiração nova: o conteúdo do capítulo é do tipo que não expira rápido. | — |
| **V — Segurança e dados** | Sem segredos. A `FichaDeDataset` **barra** dataset com dado pessoal declarado — o princípio virou código executável. | — |
| **VI — Acessibilidade** | Etapa 02 em biblioteca padrão pura, sem rede. Intuição antes de qualquer formalismo. | — |
| **VII — Spec-driven** | Este ciclo. Objetivos herdados do esqueleto, não reinventados. | — |
| **VIII — Interatividade** | 4 exercícios (múltipla, múltipla-multi, múltipla difícil, aberta) + 1 vídeo com justificativa que **critica** o próprio vídeo (ele assume dados sem estrutura). | — |
| **IX — DoD** | Build verde, 45 testes na trilha, saídas coladas. | — |

**Veredito:** aprovado.

## Decisões

**O detector acusa, não corrige.** `detectar_vazamento_obvio` devolve `Suspeita`, não `Erro`. Automatizar a remoção seria pior que o problema: a decisão de descartar uma coluna depende de saber quando ela é preenchida no mundo real, e isso o código não sabe.

**Dois sinais independentes, ambos reportados.** Uma coluna criada depois do evento tipicamente dispara os dois (previsibilidade quase perfeita *e* preenchimento condicionado). Reportar ambos é correto: o segundo explica por que o primeiro aconteceu.

**A ficha é um portão, não um documento.** `validar()` levanta se faltar resposta. Documento é promessa; objeto que falha é garantia.

**Carregador de módulos por etapa** (`tests/conftest.py`). Etapas autocontidas têm arquivos homônimos (`dados.py` na 00 e na 02) e `sys.path` cru faz a primeira importação vencer, silenciosamente. Alternativa descartada: renomear para `dados00.py`/`dados02.py` — resolveria hoje e pioraria a cada etapa.

## Fases

1. Escrever o capítulo (objetivos → exercícios → corpo, nesta ordem — Backward Design).
2. Implementar a etapa 02 e seus testes.
3. Verificar referências e promover a ✓ o que for citado.
4. Registrar: HISTORICO, CHANGELOG, ROADMAP, videoteca, trilha.
