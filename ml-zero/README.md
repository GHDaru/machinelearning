# `ml-zero` — a construção prática

> **Tutorial** (Diátaxis): aqui se faz. A explicação está nos capítulos; o mapa das etapas e as regras estão em [`livro/trilha-ml-zero.md`](../livro/trilha-ml-zero.md).

Um sistema de Machine Learning completo, do zero, uma etapa por capítulo. Do dado bruto ao modelo servido por API e monitorado — **em CPU, sem chave paga, sem download obrigatório**.

## Rodar

```bash
cd ml-zero
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m pytest -q            # os testes são o gabarito
python etapa-00/rodar.py       # a etapa 00, do começo ao fim
```

A etapa 00 usa **só a biblioteca padrão do Python** — nem NumPy. Isso é deliberado: nada deve ficar entre você e o entendimento de que uma divisão de dados é apenas uma lista embaralhada com cuidado. NumPy entra na etapa 05, quando o algoritmo passa a exigir álgebra linear de verdade.

## Etapa 00 — dado, divisão e linha de base

**Capítulo correspondente:** [01 — Fundamentos](../livro/01-fundamentos.md)

| Arquivo | O que faz |
|---|---|
| [`etapa-00/dados.py`](etapa-00/dados.py) | Gera o dataset sintético (seed fixa) e divide em treino/validação/teste com estratificação |
| [`etapa-00/baseline.py`](etapa-00/baseline.py) | `MajorityBaseline`, `MeanBaseline`, `acuracia`, `matriz_confusao` |
| [`etapa-00/rodar.py`](etapa-00/rodar.py) | O roteiro completo, com a saída comentada |
| [`tests/test_etapa_00.py`](tests/test_etapa_00.py) | 17 testes — o gabarito da etapa |

### O que você deve ver

```
treino             2399  (prevalência 0.190)
validação           799  (prevalência 0.190)
teste               802  (prevalência 0.191)

LINHA DE BASE (prevê sempre a classe 0)
acurácia na validação   0.8098
matriz de confusão      VP=0 FP=0 FN=152 VN=647
revocação da classe 1   0.0000
```

### A lição

Leia os dois números **juntos**: **81% de acurácia** e **0% de revocação**.

O "modelo" acerta quatro em cada cinco previsões — e não encontra um único caso positivo, que é exatamente o que se queria encontrar. Um relatório que citasse só o primeiro número estaria tecnicamente correto e completamente enganoso.

Este é o piso do projeto. Qualquer modelo das etapas seguintes precisa **bater 0,81 de acurácia E ter revocação maior que zero**. Um dos dois não basta — e é por isso que o [capítulo 04](../livro/capitulos/04-avaliacao.md) existe.

O teto também é conhecido: o gerador injeta 8% de ruído irredutível de propósito, o que põe o máximo alcançável em torno de 0,96. Ter piso e teto explícitos é um luxo que só o dado sintético permite, e é a razão de a etapa 00 usá-lo.

### Por que dado sintético (e o que isso custa)

**Ganha-se:** custo zero, sem rede, reprodutibilidade perfeita, e o conhecimento do processo verdadeiro — o que permite comparar o erro do modelo com o teto teórico.

**Perde-se:** dado sintético não tem as patologias do dado real. Sem valores ausentes traiçoeiros, sem vazamento acidental, sem viés de coleta. Essas patologias entram a partir da **etapa 02**, com dados reais, quando o [capítulo 02](../livro/capitulos/02-dados.md) tiver preparado o terreno.

Dizer isso em voz alta é parte do método: o Princípio I exige que a limitação do experimento seja declarada junto com o resultado.

## Etapa 02 — vazamento e divisões honestas

**Capítulo correspondente:** [02 — Dados](../livro/capitulos/02-dados.md)

| Arquivo | O que faz |
|---|---|
| [`etapa-02/dados.py`](etapa-02/dados.py) | Detector de vazamento, divisões por grupo e por tempo, duplicatas, ficha de dataset |
| [`tests/test_etapa_02.py`](tests/test_etapa_02.py) | 28 testes |
| [`tests/conftest.py`](tests/conftest.py) | Carregador de módulos por etapa (etapas autocontidas têm arquivos homônimos) |

### A lição

Está escrita como teste, não como comentário:

```python
def test_a_licao_da_etapa_embaralhar_por_linha_vaza_o_sujeito():
    grupos = [f"cliente-{i // 8}" for i in range(800)]   # 100 clientes, 8 linhas cada
    ...
    assert len(vazou_entre(grupos, *ingenuo)) > 90, "quase todo cliente vaza"
    assert vazou_entre(grupos, *dividir_por_grupo(grupos)) == set()
```

Com 8 linhas por cliente, a divisão ingênua espalha **mais de 90 dos 100 clientes** pelos três conjuntos. O teste não mede a linha errada; ele mede o sujeito. E é por isso que o modelo treinado assim vai bem no teste e mal com clientes novos.

A `FichaDeDataset` segue a mesma filosofia: não é um documento que alguém promete escrever, é um objeto cujo `validar()` levanta quando falta resposta — inclusive quando a resposta é "nenhuma limitação conhecida", que também precisa ser dita.

## Etapa 07 — árvore, floresta e boosting

**Capítulo correspondente:** [07 — Árvores e Ensembles](../livro/capitulos/07-arvores-ensembles.md)

| Arquivo | O que faz |
|---|---|
| [`etapa-07/arvores.py`](etapa-07/arvores.py) | `Arvore` (Gini + MSE), `Floresta` (bagging), `Boosting` (perda logística), `auc` por postos |
| [`etapa-07/dados_tabulares.py`](etapa-07/dados_tabulares.py) | Gerador com atributos inúteis, interação e quebra |
| [`etapa-07/linear.py`](etapa-07/linear.py) | Régua linear — referência para o capítulo 05 |
| [`etapa-07/rodar.py`](etapa-07/rodar.py) | O experimento do capítulo (~4 min) |
| [`tests/test_etapa_07.py`](tests/test_etapa_07.py) | 21 testes (rápidos: usam dado pequeno) |

### O que você deve ver

```
TETO DE BAYES (rank pelo processo verdadeiro): AUC 0.9402

modelo                    acurácia   revocação      AUC  % do teto
linear (referência)         0.7802      0.0000   0.4963     52.8%
árvore (prof. 3)            0.9168      0.6970   0.9201     97.9%
floresta (25)               0.9556      0.8485   0.9332     99.3%
boosting (50, η=0,2)        0.9467      0.8687   0.9392     99.9%
```

### A lição

O modelo linear fica em **0,4963** — acaso. Não é que vá mal: a fronteira é não-monotônica (consumo muito alto **e** muito baixo são anomalia), e nenhuma reta expressa "os extremos são positivos e o meio é negativo".

E bagging faz o que promete: a variância da predição cai de **0,04066** (árvore profunda) para **0,00676** (floresta) — **6× menos**. Bagging não deixa o modelo mais esperto; deixa-o mais estável.

> O dado foi construído com uma regra que favorece árvores. Isso está dito no capítulo, em destaque, antes de qualquer número — a ilustração mostra o mecanismo, não prova a regra geral.

## Próximas etapas

As etapas 01–16 entram pelo ciclo spec-driven — uma spec por etapa (Princípio VII), com plano, tarefas e verificação. O mapa completo está em [`livro/trilha-ml-zero.md`](../livro/trilha-ml-zero.md).

## As regras da construção

Resumidas da [constituição](../.specify/memory/constitution.md):

1. **Do zero antes da biblioteca** — ver o motor antes de dirigir o carro.
2. **Arquitetura por refatoração** — cada porta nasce da dor da etapa; nunca estrutura antecipada.
3. **Anti-apodrecimento** — dependências mínimas; etapas autocontidas; erro didático deliberado é comentado como tal.
4. **Reprodutibilidade** — seed fixa, versões declaradas. Rodar duas vezes dá o mesmo número.
5. **Serviço desde cedo** — o modelo vira endpoint; um modelo que não serve ninguém é um exercício.
