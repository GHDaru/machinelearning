"""Carregamento de módulos das etapas, sem colisão de nomes.

Cada etapa é uma pasta autocontida (regra 3 da construção: etapas autocontidas
e executáveis), e etapas diferentes naturalmente têm arquivos com o mesmo nome
— `dados.py` existe na 00 e na 02, e `modelo.py` vai existir em várias.

Com `sys.path` cru, a primeira importação vence e as demais recebem o módulo
errado, silenciosamente. Este carregador registra cada arquivo sob um nome
único derivado do caminho, então `carregar("etapa-02", "dados")` devolve
sempre o arquivo daquela etapa.

Nota didática: esta é a dor que justifica a existência do conftest. A
alternativa — renomear os arquivos para `dados00.py`, `dados02.py` — resolveria
hoje e deixaria os nomes piores a cada etapa nova.
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from types import ModuleType

RAIZ = Path(__file__).resolve().parents[1]


def carregar(etapa: str, modulo: str) -> ModuleType:
    """Importa `<raiz>/<etapa>/<modulo>.py` sob um nome único e estável."""
    nome = f"mlzero__{etapa.replace('-', '_')}__{modulo}"
    if nome in sys.modules:
        return sys.modules[nome]

    caminho = RAIZ / etapa / f"{modulo}.py"
    if not caminho.exists():
        raise FileNotFoundError(f"etapa '{etapa}' não tem o módulo '{modulo}' ({caminho})")

    spec = importlib.util.spec_from_file_location(nome, caminho)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nome] = mod          # antes de executar: permite import circular interno
    spec.loader.exec_module(mod)
    return mod
