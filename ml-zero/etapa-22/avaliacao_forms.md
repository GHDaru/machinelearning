# Avaliação da aula — perguntas para o Google Forms

Não tenho acesso a uma API de criação de formulários nesta sessão (as ferramentas de Google Drive conectadas leem/escrevem arquivos, não criam Forms), então não consigo gerar o link do formulário diretamente. O que fiz em vez disso: o notebook agora produz, na seção 8, um objeto `resumo_final` com exatamente os campos abaixo — é só criar o formulário uma vez (5 minutos) com estas perguntas, na ordem, e ele já casa 1:1 com o que o notebook imprime.

**Duas formas de recolher a resposta, à sua escolha:**
- **Rápida**: uma única pergunta de texto longo ("Cole aqui o JSON do seu resumo_final") — o aluno copia a saída da última célula da seção 8 e cola inteira.
- **Detalhada**: uma pergunta por campo, como a lista abaixo — mais fácil de tabular depois, mais cliques para o aluno.

## Perguntas (versão detalhada)

1. **Nome** — resposta curta, obrigatória.
2. **Qual FORMATO você escolheu (F01–F40)?** — resposta curta, obrigatória.
3. **hidden_layer_sizes da sua configuração** — resposta curta (ex.: `(64,)`).
4. **activation** — múltipla escolha: `relu` / `tanh`.
5. **solver** — múltipla escolha: `adam` / `lbfgs`.
6. **max_iter** — múltipla escolha: `50` / `400`.
7. **Sua previsão na seção 4, em US$ (`MINHA_PREVISAO_SECAO4`)** — resposta curta, número.
8. **MAE do MLP cru da seção 4, em US$ (`mae_cru`)** — resposta curta, número.
9. **Sua previsão na seção 7, em US$ (`MINHA_PREVISAO`)** — resposta curta, número.
10. **MAE do seu FORMATO na seção 7, em US$ (`meu_mae`)** — resposta curta, número.
11. **MAE mediana com 5 sementes, dados tratados, em US$** — resposta curta, número.
12. **Amplitude com 5 sementes, dados tratados, em US$** — resposta curta, número.
13. **MAE mediana com 5 sementes, dados crus, em US$** — resposta curta, número.
14. **Amplitude com 5 sementes, dados crus, em US$** — resposta curta, número.
15. **O tratamento sobreviveu à amplitude (seção 8)?** — múltipla escolha: `Sim` / `Não`.
16. **Sua configuração bateu o MLP tratado da seção 5?** — múltipla escolha: `Sim` / `Não`.
17. **Seu FORMATO caiu em max_iter=50?** — múltipla escolha: `Sim` / `Não`.
18. **Cole aqui o JSON completo do seu `resumo_final`** (seção 8, última célula) — parágrafo, obrigatória. Serve de conferência contra as respostas 1–17.

## Perguntas (versão rápida, uma só)

1. **Nome** — resposta curta, obrigatória.
2. **Cole aqui o JSON completo do seu `resumo_final`** (a última célula da seção 8 do notebook) — parágrafo, obrigatória.

## Onde isso nasce no notebook

`ml-zero/etapa-22/descritiva_mlp_california.ipynb`, seção 8 ("O capstone"), última célula de código — imprime exatamente este JSON:

```json
{
  "nome": "",
  "formato_escolhido": "F01",
  "hidden_layer_sizes": "(16,)",
  "activation": "relu",
  "solver": "adam",
  "max_iter": 50,
  "minha_previsao_secao4_usd": 0.0,
  "mae_mlp_cru_secao4_usd": 61906.74,
  "minha_previsao_secao7_usd": 0.0,
  "mae_formato_escolhido_usd": 42723.56,
  "mae_mediana_tratado_5_sementes_usd": 43009.77,
  "amplitude_tratado_5_sementes_usd": 1108.19,
  "mae_mediana_cru_5_sementes_usd": 115813.23,
  "amplitude_cru_5_sementes_usd": 3121.53,
  "tratamento_sobrevive_a_amplitude": true,
  "respostas_secao7": {
    "bateu_mlp_tratado_secao5": null,
    "caiu_em_max_iter_50": null,
    "resultado_sobrevive_a_outra_seed": null
  }
}
```
(exemplo real, gerado rodando F01 — não um número inventado)
