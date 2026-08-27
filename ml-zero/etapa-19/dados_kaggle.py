"""Etapa 19 — o California Housing **cru**, como ele sai do Kaggle.

O `mlp.py` e o `rede.py` leem o arquivo já derivado. Este aqui começa antes: no
CSV original de 10 colunas, com uma coluna categórica e 207 valores ausentes.

    python ml-zero/etapa-19/dados_kaggle.py

POR QUE DUAS VERSÕES DO MESMO CONJUNTO

A que o `scikit-learn` entrega tem 9 colunas de números, nenhum buraco e nenhuma
categoria. Ela é o resultado de um preparo que alguém fez, e que ninguém vê. A do
Kaggle é o arquivo de onde aquele preparo saiu:

    longitude · latitude · housing_median_age · total_rooms · total_bedrooms
    population · households · median_income · median_house_value · ocean_proximity

Derivar uma da outra é o exercício, e ele é curto:

    AveRooms  = total_rooms    / households
    AveBedrms = total_bedrooms / households
    AveOccup  = population     / households
    MedHouseVal = median_house_value / 100000

E `conferir()` compara o seu resultado com o arquivo congelado, coluna a coluna.
É o mesmo papel das linhas de base no `mlp.py`: um checksum, para você saber que
errou ANTES de tirar conclusão sobre modelo.

BAIXAR DO KAGGLE, E POR QUE O ARQUIVO CONGELADO CONTINUA AQUI

O trecho que o Kaggle mostra na página do conjunto é este, e ele funciona:

    import kagglehub
    caminho = kagglehub.dataset_download("camnugent/california-housing-prices")

**Medido em 2026-08-21: baixa sem credencial nenhuma.** O conjunto é público, e
o `kagglehub` cai em acesso anônimo quando não acha `kaggle.json` nem
`KAGGLE_USERNAME`/`KAGGLE_KEY`. Não é preciso ter conta para rodar.

E o arquivo baixado é **byte a byte** o mesmo que está congelado aqui:

    sha256  8a3727f4cf54ac1a327f69b1d5b4db54c5834ea81c6e4efc0d163300022a685e

Então por que manter a cópia local? Porque download é dependência de rede, de
cota e da vontade de terceiro. Conjunto no Kaggle muda de versão, sai do ar e
ganha revisão nova sem avisar ninguém — e no dia em que isso acontecer, duas
turmas de semestres diferentes deixam de ser comparáveis, que é justamente o que
o `split.csv` gravado existe para impedir. A cópia congelada é o que faz a
etapa continuar rodando na aula em que a rede da escola cai.

Por isso `carregar_bruto()` usa o Kaggle quando dá e o arquivo local quando não
dá, e `comparar_com_o_congelado()` confere o que veio. Confiar sem conferir
seria o defeito que este capítulo inteiro combate.

"""
from __future__ import annotations

import hashlib
from pathlib import Path

import pandas as pd

DADOS = Path(__file__).parents[1] / "dados" / "california"
BRUTO = DADOS / "housing_bruto.csv"
DERIVADO = DADOS / "california.csv"
KAGGLE = "camnugent/california-housing-prices"

COLUNAS_ESPERADAS = [
    "longitude", "latitude", "housing_median_age", "total_rooms",
    "total_bedrooms", "population", "households", "median_income",
    "median_house_value", "ocean_proximity",
]


def baixar_do_kaggle():
    """O trecho da página do Kaggle, tal como ele aparece lá.

    Devolve o caminho do `housing.csv` baixado, ou **None** quando não dá — sem
    credencial, sem rede, sem a biblioteca instalada. Devolver None em vez de
    estourar é deliberado: a etapa continua pelo arquivo congelado, e o aluno vê
    o motivo impresso em vez de um traceback no meio da aula.
    """
    try:
        import kagglehub
    except ImportError:
        print("  kagglehub não instalado (pip install kagglehub) — usando o arquivo congelado")
        return None
    try:
        pasta = Path(kagglehub.dataset_download(KAGGLE))
    except Exception as erro:                       # credencial ausente, rede fora, cota
        print(f"  não deu para baixar do Kaggle ({type(erro).__name__}) — usando o congelado")
        print("  o download pede credencial: kaggle.json, ou KAGGLE_USERNAME e KAGGLE_KEY")
        return None
    achados = sorted(pasta.rglob("*.csv"))
    if not achados:
        print(f"  o download veio sem CSV dentro de {pasta} — usando o congelado")
        return None
    print(f"  baixado do Kaggle: {achados[0]}")
    return achados[0]


def sha256(caminho) -> str:
    return hashlib.sha256(Path(caminho).read_bytes()).hexdigest()


def carregar_bruto(tentar_kaggle=False, caminho=None):
    """As 10 colunas originais. Devolve (DataFrame, origem).

    `caminho` serve para reaproveitar um download que já aconteceu — baixar duas
    vezes na mesma sessão não é erro, mas é ruído na tela do aluno.
    """
    caminho = caminho or (baixar_do_kaggle() if tentar_kaggle else None) or BRUTO
    d = pd.read_csv(caminho)
    faltando = [c for c in COLUNAS_ESPERADAS if c not in d.columns]
    if faltando:
        raise ValueError(f"o arquivo {caminho} não tem as colunas {faltando}")
    return d, Path(caminho)


def comparar_com_o_congelado(caminho_baixado):
    """O que veio do Kaggle é o mesmo arquivo que está congelado aqui?

    Compara os bytes primeiro; se diferirem, compara o que de fato importa —
    forma, colunas e onde estão os buracos. Arquivo diferente não é
    necessariamente arquivo errado: pode ser outra revisão, outra ordem de
    linhas, outro fim de linha. O que não se admite é não saber.
    """
    igual_byte = sha256(caminho_baixado) == sha256(BRUTO)
    a, b = pd.read_csv(caminho_baixado), pd.read_csv(BRUTO)
    return {
        "bytes_iguais": igual_byte,
        "forma_igual": a.shape == b.shape,
        "colunas_iguais": list(a.columns) == list(b.columns),
        "nulos_iguais": a.isna().sum().to_dict() == b.isna().sum().to_dict(),
        "sha256_baixado": sha256(caminho_baixado),
        "sha256_congelado": sha256(BRUTO),
    }


def derivar(bruto):
    """As 10 colunas do censo viram os 8 atributos + o alvo.

    Três das oito são RAZÕES, e é aí que mora o que o capítulo I.4 chama de
    atributo derivado: `total_rooms` sozinho diz o tamanho do setor, não o
    tamanho das casas. Dividir por `households` é o que torna a coluna
    comparável entre um setor de 200 e um de 5 000 domicílios.
    """
    return pd.DataFrame({
        "MedInc": bruto["median_income"],
        "HouseAge": bruto["housing_median_age"],
        "AveRooms": bruto["total_rooms"] / bruto["households"],
        "AveBedrms": bruto["total_bedrooms"] / bruto["households"],
        "Population": bruto["population"],
        "AveOccup": bruto["population"] / bruto["households"],
        "Latitude": bruto["latitude"],
        "Longitude": bruto["longitude"],
        "MedHouseVal": bruto["median_house_value"] / 100000,
    })


def conferir(derivado, tolerancia=5e-3):
    """Compara a sua derivação com o arquivo congelado, coluna a coluna.

    O `scikit-learn` distribui os valores arredondados, então a comparação tem
    tolerância — e ela é FROUXA de propósito (5e-3). Não é para detectar
    arredondamento: é para detectar troca de coluna, divisão pelo denominador
    errado e esquecimento do fator 100 000, que erram por ordens de grandeza.

    As linhas em que `total_bedrooms` está ausente ficam de fora da comparação, e
    a chave `linhas_sem_bedrooms` diz quantas foram.
    """
    ref = pd.read_csv(DERIVADO)
    saida = {"colunas_conferidas": 0, "divergentes": [], "linhas_sem_bedrooms": 0}
    for c in ref.columns:
        a = derivado[c].to_numpy(dtype=float)
        b = ref[c].to_numpy(dtype=float)
        presente = ~pd.isna(a)
        saida["linhas_sem_bedrooms"] = max(saida["linhas_sem_bedrooms"],
                                           int((~presente).sum()))
        maior = float(abs(a[presente] - b[presente]).max())
        saida["colunas_conferidas"] += 1
        if maior > tolerancia:
            saida["divergentes"].append((c, maior))
    saida["bate"] = not saida["divergentes"]
    return saida


if __name__ == "__main__":
    print("O California Housing cru — 10 colunas, do jeito que ele vem\n")

    bruto, origem = carregar_bruto(tentar_kaggle=True)
    print(f"  origem: {origem}")
    print(f"  {bruto.shape[0]} linhas × {bruto.shape[1]} colunas\n")

    print("  1. O que o arquivo derivado não mostra")
    nulos = bruto.isna().sum()
    print(f"     valores ausentes: { {k: int(v) for k, v in nulos[nulos > 0].items()} }")
    categorias = {k: int(v) for k, v in bruto["ocean_proximity"].value_counts().items()}
    print(f"     coluna categórica `ocean_proximity`: {categorias}\n")

    print("  2. Derivar os 8 atributos, e conferir contra o congelado")
    d = derivar(bruto)
    r = conferir(d)
    print(f"     {r['colunas_conferidas']} colunas conferidas · bate: {r['bate']}")
    if r["divergentes"]:
        for c, m in r["divergentes"]:
            print(f"       {c}: diferença máxima {m:.4f}")
    print(f"     {r['linhas_sem_bedrooms']} linhas ficaram de fora, por falta de `total_bedrooms`\n")

    print("  3. E o achado que só aparece comparando as duas versões")
    falta = bruto["total_bedrooms"].isna().to_numpy()
    ref = pd.read_csv(DERIVADO)
    reconstruido = ref.loc[falta, "AveBedrms"].to_numpy() * bruto.loc[falta, "households"].to_numpy()
    inteiros = bool((abs(reconstruido - reconstruido.round()) < 0.02).all())
    print(f"     as {int(falta.sum())} linhas sem `total_bedrooms` no arquivo do Kaggle")
    print(f"     TÊM valor no arquivo do scikit-learn, e ele é inteiro: {inteiros}")
    print(f"     primeiros: {[int(v) for v in reconstruido.round()[:6]]}")
    print("     ou seja: não é imputação, é dado que uma das cópias perdeu pelo caminho")
