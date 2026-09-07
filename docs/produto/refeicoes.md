---
sidebar_position: 5
title: Refeições no roteiro
---

# Refeições no roteiro

Status: planejada. Ainda não implementada. Hoje as refeições aparecem apenas como uma pausa genérica ("Almoço") na timeline.

## Motivação

Alimentação é parte central de uma viagem. O roteiro precisa tratar refeições como um item próprio, e não como uma pausa qualquer, considerando se a pessoa vai comer fora ou em casa (ou na hospedagem) durante a viagem.

## Card de refeição (variação)

Uma variação do card, distinta do card de atividade e da pausa atual:

- Identidade visual própria (ícone e rótulo de refeição: café, almoço, jantar).
- Indica o modo: comer fora (sugestão de local) ou em casa/hospedagem.
- Quando for comer fora, pode reaproveitar imagem e segurança como o card de atividade.
- Quando for em casa, é um bloco mais simples, só marcando o horário reservado.

## Pergunta antes da montagem

Antes de gerar o roteiro, perguntar a preferência de refeições:

- Vai comer fora, em casa/hospedagem, ou misturar?
- Opcional: preferência por tipo de refeição (café, almoço, jantar) e faixa de horário.

Essa preferência entra nos filtros de geração (novo campo, por exemplo `refeicoes`), junto de `comeco`, `retorno` e `pausa`.

## Customização depois da montagem

Depois de gerar, permitir ajuste fácil, no mesmo espírito do editor atual:

- Alternar uma refeição entre comer fora e em casa.
- Incluir ou remover uma refeição do dia.
- Trocar a sugestão de local quando for comer fora.

## Impacto técnico

- Modelo: hoje o `Bloco` é a união atividade, deslocamento e pausa. Avaliar um novo tipo `refeicao` (ou estender a pausa) nos tipos do frontend (`lib/roteiro/tipos.ts`) e do backend (`src/roteiro/tipos.ts`).
- Geração: o gerador (`backend/src/roteiro/roteiro.gerador.ts`) passa a montar blocos de refeição segundo a preferência, no lugar da pausa fixa de almoço.
- Filtros: novo campo de preferência de refeições no formulário e na serialização (`lib/roteiro/filtros.ts`) e no DTO de geração.
- Edição: estender o editor de roteiro e o DTO de atualização para refeições.

## Pontos em aberto

- Quantas refeições por dia considerar por padrão e em quais horários.
- Como sugerir locais para comer fora (reaproveitar catálogo de atrações ou fonte à parte).
- Comer em casa some da timeline ou aparece como bloco reservado.
- Integração com a camada de imagens das atrações ([imagens das atrações](./imagens-atracoes.md)).
