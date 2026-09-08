---
sidebar_position: 4
title: Regras de negócio
---

# Regras de negócio: geração de roteiros

Status: rascunho vivo. A regra da janela mínima está confirmada; o modo de sugestões é uma proposta a explorar.

## Contexto

Um roteiro representa o planejamento de um ou mais dias de viagem. Cada dia tem uma janela de atividade definida por dois horários dos filtros:

- `comeco`: horário em que o dia começa.
- `retorno`: horário em que o dia termina.

As datas do intervalo da viagem ficam em `inicio` e `fim` (dia inicial e final), separadas da janela diária.

A geração encaixa atividades, pausas e deslocamentos dentro dessa janela diária. Sem uma janela mínima não há espaço útil para montar uma sequência que valha a pena.

## Regra confirmada: janela diária mínima

Ao gerar um roteiro, a janela do dia precisa ser válida:

1. `retorno` deve ser maior que `comeco`.
2. A diferença entre `retorno` e `comeco` deve ser de no mínimo 1 hora (60 minutos).

Quando a janela é inválida (retorno menor ou igual ao começo, ou diferença menor que 60 minutos), a geração de roteiro completo não é oferecida.

### Onde validar

A mesma regra vale nas duas pontas, para não confiar só no cliente:

- Frontend: validação do formulário de filtros antes de disparar a geração (junto das demais validações em `lib/validation` e do fluxo de `lib/roteiro/filtros`). Impede o avanço e mostra mensagem clara.
- Backend: validação no DTO e no gerador (`backend/src/roteiro`), rejeitando ou tratando a janela inválida antes de montar os dias.

### Mensagem ao usuário

Quando a janela for menor que o mínimo, explicar que um roteiro cronometrado precisa de pelo menos 1 hora de dia e oferecer o caminho alternativo (ver proposta abaixo).

## Proposta a explorar: modo de sugestões para dias curtos

Ideia ainda não decidida, registrada para discussão.

Se o usuário quiser um dia mais curto do que o mínimo, em vez de gerar um roteiro completo cronometrado, o app sugere um conjunto de atrações compatíveis com os interesses e o destino, e o usuário escolhe quais quer visitar.

### Motivação

- Simplifica o trabalho de geração: não precisamos encaixar tempo, pausas e deslocamentos numa janela apertada.
- Entrega valor mesmo quando não há tempo para um roteiro estruturado.
- Dá controle ao usuário sobre o que ver no tempo curto que tem.

### Esboço de fluxo

1. Usuário define filtros com janela diária curta (abaixo do mínimo).
2. App oferece o modo de sugestões em vez do roteiro cronometrado.
3. App lista atrações candidatas (por interesse, destino e segurança).
4. Usuário seleciona as atrações desejadas.
5. Opcional: a partir da seleção, montar um roteiro simples só com os pontos escolhidos, sem a exigência de janela mínima.

### Questões em aberto

- Qual o limite exato que separa roteiro completo de sugestões (o mínimo de 1 hora, ou um patamar maior)?
- O modo de sugestões gera algo salvável em Meus roteiros ou é só uma lista de descoberta?
- As sugestões reaproveitam o mesmo catálogo/algoritmo da geração ou é uma fonte à parte?
- A escolha entre roteiro e sugestões é automática pela janela ou o usuário decide?

## Próximos passos

1. Implementar a validação da janela mínima no frontend e no backend (regra confirmada).
2. Alinhar o produto sobre a proposta do modo de sugestões antes de qualquer implementação.
