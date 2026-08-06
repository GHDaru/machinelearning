# Videoteca

> Curadoria de vídeos por capítulo. A **fonte** de cada vídeo é o bloco `:::video` do capítulo que ele serve — é lá que ele vive, junto do texto que complementa. Esta página reúne a política e um índice **mantido à mão**; quem adiciona um vídeo atualiza os dois lugares. (Gerar o índice a partir do `banco.json` é melhoria devida: enquanto não for, ele pode ficar atrasado, e dizer isso é mais honesto do que fingir automação.)

## A política de curadoria

Um vídeo entra por aquilo que **o texto não faz bem**: geometria animada, uma derivação no ritmo do quadro, o som de alguém pensando em voz alta. Se o vídeo apenas repete o capítulo, ele não entra — repetição não é reforço, é ruído.

Cada vídeo declara:

| Campo | Por quê |
|---|---|
| **Autor** | Crédito. Curadoria sem atribuição é apropriação |
| **Duração** | O leitor decide se cabe agora. Vídeo sem duração declarada é um compromisso em branco |
| **O que resolve** | Obrigatório. Se você não consegue escrever esta frase, o vídeo não deveria entrar |

Regras adicionais, do [Guia Editorial §5](GUIA-EDITORIAL.md):

- **Gratuito e estável.** Vídeo atrás de paywall não entra — custo zero é requisito (Princípio VI).
- **Reconferido a cada janela trimestral.** Link morto é dívida do livro, não do leitor.
- **Fachada por padrão.** O player só pede o vídeo ao servidor de origem **depois** do clique. Antes disso, nenhuma requisição sai do seu navegador para terceiros.

## Índice

| Capítulo | Vídeo | Autor | Duração |
|---|---|---|---|
| 00 — Introdução | A Gentle Introduction to Machine Learning | StatQuest with Josh Starmer | ~6 min |
| 01 — Fundamentos | Machine Learning Fundamentals: Bias and Variance | StatQuest with Josh Starmer | ~7 min |
| 02 — Dados | Machine Learning Fundamentals: Cross Validation | StatQuest with Josh Starmer | ~6 min |
| 04 — Avaliação | ROC and AUC, Clearly Explained! | StatQuest with Josh Starmer | ~16 min |
| 07 — Árvores e Ensembles | Gradient Boost Part 1: Regression Main Ideas | StatQuest with Josh Starmer | ~15 min |

> Os capítulos-esqueleto ainda não têm vídeo — cada um recebe o seu quando sua spec for implementada (mínimo 1 por capítulo, Princípio VIII.1). Sugestões de vídeo são bem-vindas pelo próprio companion do livro (botão 💬 → Sugerir).

## Marcar como assistido

Cada vídeo tem uma caixa "marcar como assistido". Ela alimenta a barra de progresso do capítulo e o seu registro anônimo de progresso — o mesmo que guarda os exercícios resolvidos. Como todo o resto: sem cadastro, e apagável a qualquer momento em uma ação.
