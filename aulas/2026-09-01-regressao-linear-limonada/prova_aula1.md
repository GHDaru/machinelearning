# Prova da aula 1 — Análise descritiva e diagnóstica (caso da limonada)

> 10 questões de múltipla escolha, 1 ponto cada. Aplicação: Google Forms, ao final da aula 1.
> Cobre **somente** a parte descritiva, par a par, diagnóstica e o calendário — o modelo de
> regressão fica para a prova da aula 2. Para gerar o formulário automaticamente, use
> [`prova_aula1_google_forms.gs`](prova_aula1_google_forms.gs) (instruções no [README](README.md)).
> O gabarito comentado está ao final — **não distribua este arquivo aos alunos antes da prova.**

---

**1.** Na análise descritiva, uma das variáveis apresentou assimetria à direita forte (≈ 1,9) e curtose alta (≈ 5), indicando cauda pesada. Qual?

- a) temperatura
- b) precipitacao
- c) vendas
- d) panfletos

**2.** A regra do IQR (quartil ± 1,5×IQR) marcou os 62 dias de preço 0,50 como "outliers". A interpretação correta desse resultado é:

- a) os 62 dias devem ser removidos antes de modelar
- b) o multiplicador 1,5 é baixo demais; com 3,0 o problema desaparece
- c) `preco` só assume dois valores: o IQR colapsa em zero e a regra, que pressupõe variável contínua, deixa de significar "outlier"
- d) há erro de digitação nos valores 0,50

**3.** Os ~28 pontos de precipitação acima da cerca superior correspondem a dias de chuva forte que realmente aconteceram. O tratamento adequado é:

- a) manter os pontos, e considerar uma transformação (por exemplo, log) se a análise indicar
- b) excluir os pontos, porque outlier sempre prejudica a análise
- c) substituir os valores pela média da variável
- d) substituir os valores pela mediana da variável

**4.** Curtose (excesso) de aproximadamente +5 em `precipitacao` significa que a distribuição:

- a) é mais achatada que a normal
- b) é simétrica
- c) tem variância próxima de zero
- d) tem caudas mais pesadas que as da normal — valores extremos mais frequentes

**5.** A correlação entre `preco` e `vendas` é +0,51. Por que a conclusão "suba o preço para vender mais" é errada?

- a) 0,51 é uma correlação fraca demais para qualquer conclusão
- b) o preço 0,50 só existe em julho e agosto: a correlação mede a estação (confundimento), não o efeito do preço
- c) o correto seria usar a correlação de Spearman
- d) faltou padronizar as variáveis antes de calcular a correlação

**6.** Na descritiva da temperatura, a média é ~61, o mínimo ~15 e o máximo ~103. O cuidado de leitura correto é:

- a) valores acima de 100 são impossíveis; há erro de coleta
- b) os dois extremos devem ser removidos pela regra do IQR
- c) depois de padronizar, a unidade deixa de importar para a interpretação
- d) a escala é Fahrenheit — interpretar os valores como °C levaria a conclusões absurdas

**7.** Na `scatter_matrix`, todos os cruzamentos que envolvem `preco` aparecem como **duas faixas de pontos**. Isso indica que:

- a) `preco` assume pouquíssimos valores distintos (na prática, é binária)
- b) `preco` tem correlação positiva forte com todas as variáveis
- c) as faixas são os outliers detectados pelo IQR
- d) houve erro de renderização do gráfico

**8.** Sobre a correlação de Pearson, $r = \mathrm{cov}(x,y)\,/\,(s_x s_y)$: se duas variáveis têm $r \approx 0$, a conclusão correta é:

- a) não existe relação alguma entre elas
- b) existe relação causal fraca entre elas
- c) não há associação **linear** — mas pode existir relação não linear forte (por exemplo, em U)
- d) uma delas tem variância zero

**9.** As vendas médias por dia da semana variaram de 24,8 a 25,7 copos, e a correlação de cada *dummy* de dia com as vendas ficou entre −0,03 e +0,02. A decisão adequada é:

- a) incluir `dia_semana` no modelo, porque em varejo o dia da semana sempre importa
- b) deixar `dia_semana` fora do modelo: o sinal foi medido e não existe neste dado
- c) converter o dia em número de 1 a 7 e incluir como variável contínua
- d) excluir os domingos, que têm a menor média

**10.** No gráfico das vendas ao longo do ano, a faixa do preço 0,50 (julho–agosto) está exatamente sobre o pico da série. O que essa imagem mostra?

- a) o confundimento: o preço só muda no pico da estação, então qualquer variável que só muda ali "correlaciona" com vendas
- b) a prova de que o aumento de preço causou o pico de vendas
- c) que a série não tem sazonalidade relevante
- d) que a média móvel de 7 dias distorce a série original

---

## Gabarito comentado

| # | Resposta | Por quê |
|---|---|---|
| 1 | **b** | A chuva concentra muitos dias de valor baixo e poucos de chuva forte: assimetria 1,86 e curtose ~5,2, medidas em aula. Temperatura e vendas são quase simétricas; panfletos tem assimetria leve (~0,3). |
| 2 | **c** | Q1 = Q3 = 0,30 → IQR = 0 e a cerca colapsa num ponto. A regra pressupõe variável contínua; `preco` é binária na prática. Remover os "outliers" apagaria julho e agosto do dataset. |
| 3 | **a** | Outlier real carrega informação — chuva forte é justamente o que derruba venda. Excluir ou substituir por média/mediana apaga o fenômeno e enviesa qualquer análise seguinte. |
| 4 | **d** | Curtose de excesso positiva = leptocúrtica: caudas mais pesadas que as da normal. Achatamento (a) seria curtose negativa; curtose não mede simetria (b) nem variância (c). |
| 5 | **b** | O preço nunca variou dentro de um mês: preço e estação são a mesma variável com dois nomes. A correlação de +0,51 mede o verão — "termômetro disfarçado". |
| 6 | **d** | Os valores (15 a 103, média 61) identificam a escala Fahrenheit. Unidade é a primeira checagem da descritiva; padronizar (c) muda a escala dos números, não a necessidade de entender o que eles medem. |
| 7 | **a** | Faixas horizontais/verticais numa dispersão denunciam variável com poucos valores distintos. É a `scatter_matrix` mostrando o mesmo diagnóstico que o IQR colapsado já tinha dado: `preco` é binária. |
| 8 | **c** | Pearson mede só associação **linear**. Uma parábola perfeita pode dar r ≈ 0. Por isso o par a par (olhar a forma) vem antes e junto do número. |
| 9 | **b** | Amplitude menor que 1 copo e correlações indistinguíveis de zero: neste dado, não há sinal — atributo sem sinal só adiciona variância. A ressalva honesta: em varejo real costuma haver efeito de dia; aqui a conclusão vale porque foi **medida**. |
| 10 | **a** | A faixa sombreada sobre o pico é a fotografia do confundimento perfeito entre preço e estação. Causalidade (b) é exatamente a leitura que a imagem desmente; a sazonalidade (c) é visível e forte. |
