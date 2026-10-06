# Prova — Regressão, interpretação e regularização no problema da Califórnia

> 20 questões de múltipla escolha, 1 ponto cada. Cobre: o dado e a descritiva (1–4),
> regressão simples e interpretação (5–8), modelo múltiplo e interpretação (9–12),
> análise de resultado (13–16) e Ridge/Lasso (17–20).
>
> **Procedência dos números:** todos calculados no dataset congelado do repositório
> (`ml-zero/dados/california/housing_bruto.csv`, 20 640 block groups × 10 colunas, censo
> de 1990), com dummies de `ocean_proximity`, imputação da mediana aprendida no treino,
> padronização sem vazamento, divisão 75/25 com semente 42 e scikit-learn
> (LinearRegression, RidgeCV, LassoCV). Gabarito comentado ao final —
> **não distribua este arquivo aos alunos antes da prova.**
> Forms automático: [`prova_california_google_forms.gs`](prova_california_google_forms.gs).

---

## Bloco A — O dado (1–4)

**1.** A coluna `total_bedrooms` tem 207 valores faltantes. No pipeline com divisão treino/teste, o tratamento correto é:

- a) remover as 207 linhas, inclusive as que caírem no teste
- b) imputar com a mediana calculada no dataset inteiro, antes da divisão
- c) imputar com a mediana calculada **só no treino** (deu 437) e aplicar esse mesmo valor ao teste
- d) substituir por zero, que é neutro

**2.** Exatamente 965 bairros têm `median_house_value` = 500 001 — nem um dólar a mais, nem a menos. A leitura correta é:

- a) são erros de digitação e devem ser removidos
- b) a regra do IQR confirma que são outliers e manda excluir
- c) 500 001 era o preço de tabela dos imóveis de luxo em 1990
- d) o alvo foi **censurado no teto** pelo censo: valores acima de US$ 500 mil foram truncados, e esses 965 não são outliers

**3.** A categoria `ISLAND` de `ocean_proximity` tem 5 linhas em 20 640. A consequência para o coeficiente da dummy `oceano_ISLAND` é:

- a) nenhuma: o coeficiente vale o mesmo que os demais
- b) o coeficiente fica mais preciso, porque a categoria é homogênea
- c) a dummy deve ser convertida em variável contínua
- d) o coeficiente é estimado sobre 5 observações: instável, sensível a qualquer mudança na amostra, e não deve ser lido como efeito

**4.** `median_income` varia de 0,5 a 15, com média 3,87. Antes de interpretar qualquer coeficiente dela, é preciso saber que:

- a) a renda está padronizada entre 0 e 15
- b) a unidade é **dezenas de milhares de dólares por ano** (3,87 ≈ US$ 38,7 mil): ignorar a unidade erra a leitura por um fator de 10 000
- c) a renda está em dólares por mês
- d) valores acima de 10 são impossíveis e devem ser tratados

## Bloco B — Regressão simples e interpretação (5–8)

**5.** Sozinha, `median_income` (padronizada) dá R² de teste 0,471. A leitura mais útil desse número é:

- a) um único atributo já explica quase metade da variância do preço — e vira a **régua** que o modelo múltiplo precisa superar
- b) o modelo é inútil, pois erra mais da metade
- c) 0,471 é a correlação entre renda e preço
- d) falta padronizar a renda para o R² subir

**6.** Na regressão simples padronizada, o coeficiente da renda é ≈ +79 553. A interpretação correta é:

- a) cada dólar de renda aumenta o imóvel em 79 553 dólares
- b) 79 553 é o preço previsto para a renda média
- c) subir **um desvio-padrão** na renda mediana do bairro move a previsão em ≈ +US$ 79,6 mil
- d) o coeficiente está errado, pois renda não pode valer mais que 15

**7.** A correlação de `median_income` com o alvo é +0,688. Sem rodar nada, o R² da regressão simples correspondente é aproximadamente:

- a) 0,688
- b) 0,344
- c) 0,83
- d) 0,47 — porque na regressão simples R² = r²

**8.** Sozinho, `total_rooms` tem correlação **+0,134** com o preço. No modelo múltiplo, seu coeficiente sai **negativo** (≈ −13 mil US$/dp). A explicação correta é:

- a) o coeficiente negativo prova que mais cômodos derrubam o preço
- b) é erro numérico: correlação e coeficiente devem ter o mesmo sinal
- c) com `total_bedrooms`, `households` e `population` no modelo, o coeficiente mede o efeito de cômodos **dado o resto** — e esse condicional pode trocar o sinal da relação marginal
- d) faltou aplicar logaritmo em `total_rooms`

## Bloco C — Modelo múltiplo e interpretação (9–12)

**9.** O modelo foi treinado com as **cinco** dummies de `ocean_proximity` ao mesmo tempo. O problema conhecido dessa escolha é:

- a) dummies não podem entrar em regressão linear
- b) as cinco somam sempre 1, ficando colineares com o intercepto (*dummy trap*): o ajuste fecha, mas os coeficientes individuais das dummies e o intercepto perdem leitura isolada
- c) o modelo deixa de convergir
- d) o R² de teste fica artificialmente alto

**10.** No múltiplo padronizado, `latitude` dá ≈ −54,3 mil e `longitude` ≈ −54,0 mil US$/dp. A leitura correta do par é:

- a) morar ao norte e morar a leste destroem o preço, cada um por si
- b) as duas devem ser removidas por redundância
- c) na Califórnia, latitude e longitude juntas codificam a geografia (litoral × interior, sul × norte): o par se lê **junto**, e "variar uma mantendo a outra fixa" é operação na equação, não um deslocamento real
- d) o sinal negativo indica erro de escala

**11.** `total_bedrooms` sai com ≈ +44,9 mil e `total_rooms` com ≈ −13,2 mil, sendo os dois altamente correlacionados entre si. O erro de teste não muda se os dois trocarem pesos entre si. Isso ilustra:

- a) colinearidade: a previsão fica estável, mas a leitura de cada coeficiente separado vira ruído — o mesmo fenômeno de temperatura×panfletos na limonada
- b) que quartos valem mais que cômodos no mercado
- c) heterocedasticidade
- d) vazamento do teste para o treino

**12.** O coeficiente da renda no múltiplo é ≈ +74,8 mil US$/dp "mantendo os demais constantes". Um relatório conclui: "aumentar a renda do bairro em 1 dp **causa** +US$ 74,8 mil no imóvel". O erro é:

- a) "mantendo constante" é operação matemática na equação ajustada, não intervenção no mundo: bairros de renda diferente diferem em tudo, e o modelo prevê — não autoriza leitura causal
- b) o valor correto seria +79,6 mil, o da regressão simples
- c) não há erro: coeficiente ajustado é efeito causal
- d) o erro é usar desvio-padrão em vez de dólar

## Bloco D — Análise de resultado (13–16)

**13.** O múltiplo deu R² de **treino 0,647** e de **teste 0,638**. O diagnóstico correto é:

- a) sobreajuste grave: o treino está acima do teste
- b) treino e teste andam juntos: não há sobreajuste relevante; o que limita o modelo é a **forma** (reta em relações que não são retas), não a variância
- c) subajuste zero: 0,64 é o máximo teórico
- d) o teste vazou para o treino

**14.** No teste, RMSE ≈ US$ 69,3 mil e MAE ≈ US$ 50,3 mil. A diferença entre os dois diz que:

- a) houve erro de conta: RMSE e MAE deveriam ser iguais
- b) o erro típico é de 19 mil dólares
- c) o RMSE está em outra unidade
- d) existe uma cauda de erros grandes: o RMSE eleva ao quadrado e é puxado por eles; o MAE descreve melhor o erro "típico" para comunicar ao negócio

**15.** Nos 233 bairros do teste que estão no teto censurado (500 001), o resíduo médio é **+107,7 mil** (previsto acima do "real"); fora do teto, é −4,3 mil. A leitura correta é:

- a) o modelo superestima sistematicamente os imóveis caros por defeito próprio
- b) o alvo é que está truncado: o modelo prevê acima de 500 mil onde o censo cortou o valor — o "erro" ali é do dado, e avaliar sem tratar a censura pune o modelo injustamente
- c) é preciso remover os 233 do treino e do teste, sempre
- d) o resíduo positivo prova heterocedasticidade

**16.** "R² de 0,638 é bom ou ruim?" A resposta tecnicamente correta é:

- a) ruim: abaixo de 0,9 não se publica
- b) bom: acima de 0,5 é sempre aceitável
- c) depende da régua e da pergunta: supera a renda sozinha (0,471) e a média (0), mas RMSE de US$ 69 mil pode ser inútil para precificar um imóvel e suficiente para ranquear regiões
- d) a pergunta não faz sentido, pois R² não avalia regressão

## Bloco E — Ridge e Lasso (17–20)

**17.** O LassoCV (α escolhido por validação cruzada) zerou **exatamente um** atributo — a dummy `oceano_<1H OCEAN` — e empatou o R² de teste (0,6377 contra 0,6375 do modelo cheio). A leitura correta é:

- a) o lasso errou ao descartar uma variável com informação
- b) o lasso fez a seleção embutida e desarmou a *dummy trap* sozinho: com as cinco dummies somando 1, uma delas é redundante — e foi a que ele cortou, sem perder desempenho
- c) o lasso sempre zera exatamente uma variável
- d) o empate prova que regularizar não serve para nada aqui

**18.** Varrendo α para cima, a ordem de zeramento termina com `housing_median_age`, depois `oceano_INLAND`, e **`median_income` por último** — com α uma ordem de grandeza acima de todos. Já `total_rooms` cai cedo. Isso significa que:

- a) `total_rooms` é inútil no mundo real
- b) a ordem é aleatória e muda a cada execução
- c) a ordem ranqueia a contribuição **única** de cada atributo: a renda é o sinal de que o modelo menos abre mão; `total_rooms` cai cedo por ser redundante com quartos/domicílios/população, não por ser inútil
- d) a renda deveria ter sido zerada primeiro, por ter o maior coeficiente

**19.** Neste problema, `population` chega aos milhares enquanto `median_income` vive entre 0,5 e 15. Rodar ridge/lasso **sem padronizar** faria a penalidade:

- a) punir os atributos pela unidade em que foram medidos, e não pela utilidade — o coeficiente da renda, numericamente grande por causa da escala, seria esmagado primeiro
- b) funcionar igual, pois a penalidade é invariante a escala
- c) zerar automaticamente as dummies
- d) aumentar o R² de treino

**20.** A validação cruzada escolheu α=19 para o ridge e α=34 para o lasso. Sobre esses números, a afirmação correta é:

- a) o lasso é mais regularizado que o ridge, pois 34 > 19
- b) os dois α deveriam ser iguais
- c) o α correto seria escolhido no conjunto de teste, que é maior
- d) cada α foi escolhido por validação cruzada **dentro do treino**, com o teste tocado uma única vez ao final — e α de métodos diferentes não se compara: as convenções de escala da penalidade diferem entre Lasso e Ridge

---

## Gabarito comentado

| # | Resp. | Por quê |
|---|---|---|
| 1 | **c** | Estatística de imputação é parâmetro aprendido: aprende no treino (mediana 437), aplica ao teste. Imputar com o dataset inteiro vaza o teste; deletar linhas do teste muda a população avaliada. |
| 2 | **d** | 965 valores idênticos em 500 001 é assinatura de censura administrativa, não de fenômeno. Outlier se investiga; teto censurado se **trata** (e a questão 15 mostra o estrago de ignorá-lo). |
| 3 | **d** | Coeficiente é estimado da variação disponível; com 5 linhas, qualquer idiossincrasia vira "efeito". É o mesmo aviso do coeficiente instável sob poucos dados, em versão extrema. |
| 4 | **b** | A ficha do dado diz: renda mediana em dezenas de milhares de US$. Unidade é a primeira checagem da descritiva — o mesmo hábito do Fahrenheit na limonada. |
| 5 | **a** | R² de um atributo só é a régua: o múltiplo (0,638) precisa justificar seus 12 atributos extras pelo ganho sobre 0,471 — ganho real aqui (+0,17), mas é essa a comparação que importa. |
| 6 | **c** | Padronizado, o coeficiente fala em desvios-padrão da entrada: +79,6 mil US$ por dp da renda do bairro. As demais alternativas trocam unidade ou papel do coeficiente. |
| 7 | **d** | Na simples, R² = r² = 0,688² ≈ 0,47 — e bate com o 0,471 medido no teste. Liga a diagnóstica à modelagem sem rodar nada. |
| 8 | **c** | Sinal marginal (sozinho) e sinal condicional (dado o resto) são perguntas diferentes; sob colinearidade com quartos/domicílios/população, o condicional pode inverter. Não é erro: é outra pergunta. |
| 9 | **b** | As cinco dummies somam 1 em toda linha: colinearidade exata com o intercepto. O solver resolve numericamente, mas intercepto e dummies perdem leitura individual. Saídas: `drop_first` ou deixar a regularização cortar (questão 17). |
| 10 | **c** | Geografia mora no **par**. Fixar a longitude e "andar um dp de latitude" cruza o estado na diagonal — operação da equação, não um lugar real. Coordenadas se leem juntas (ou viram distância-à-costa engenheirada). |
| 11 | **a** | A assinatura da colinearidade: previsão estável, pesos intercambiáveis, leitura isolada sem valor. A limonada mostrou com panfletos×temperatura; aqui são quartos×cômodos. |
| 12 | **a** | O condicional da equação não é contrafactual do mundo. Bairro de renda maior difere em escola, oferta, construção — nada disso está "mantido constante" na realidade. Modelo preditivo prevê; não autoriza política. |
| 13 | **b** | Gap treino−teste de 0,009 é ruído: variância sob controle. O que falta é capacidade/forma — relações não lineares (geografia!) que uma reta não desenha. Regularizar não conserta viés de forma. |
| 14 | **d** | RMSE ≫ MAE denuncia cauda pesada de erros (o quadrado amplifica os grandes — inclusive os do teto censurado). Para comunicar erro típico, MAE; para otimização quadrática, RMSE. |
| 15 | **b** | O modelo prevê ~608 mil em média onde o censo escreveu 500 001: o resíduo mede a censura, não a falha. Tratamentos honestos: avaliar com/sem o teto separadamente, ou modelo de censura (Tobit); nunca fingir que 500 001 é o preço verdadeiro. |
| 16 | **c** | R² não tem régua absoluta. A resposta profissional compara com as linhas de base disponíveis e com o uso: ranquear regiões tolera US$ 69 mil de RMSE; precificar um imóvel específico, não. |
| 17 | **b** | A redundância exata das cinco dummies dá ao lasso um corte "de graça": zera uma, não perde nada (0,6377 ≈ 0,6375). Seleção embutida fazendo o trabalho que o `drop_first` faria à mão — e parcimônia: mesmo desempenho, menos parâmetros. |
| 18 | **c** | A ordem de eliminação ranqueia contribuição única, como na limonada (o preço confundido caiu primeiro; a temperatura, por último). Aqui a renda é a "temperatura" do problema; `total_rooms` é o "panfleto". |
| 19 | **a** | A penalidade soma coeficientes como se fossem comparáveis; sem padronizar, quem tem unidade "cara" (renda: um dp vale poucos pontos na escala crua, exigindo coeficiente numérico grande) apanha primeiro. A multa viraria imposto sobre unidades. |
| 20 | **d** | λ/α é hiperparâmetro: decide-se por validação cruzada no treino; o teste julga uma vez. E α entre métodos não se compara — Lasso e Ridge do scikit-learn usam normalizações diferentes do erro (a "pegadinha de régua"). |
