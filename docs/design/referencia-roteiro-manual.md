---
sidebar_position: 6
title: Referência de Roteiro Manual
---

# Referência de Roteiro Manual

Esta seção estuda um roteiro real, montado à mão por um casal, Silvia e Edgard, que planeja viagens com muita pesquisa. O documento serve de duas formas: mostra o que um bom roteiro contém na prática e revela o que o nosso gerador precisa oferecer para substituir esse trabalho manual. Os dados pessoais do material original, como telefones e nomes de familiares, ficam de fora por serem sensíveis.

## O caso estudado

Uma viagem de carro pelo Nordeste, de Brasília ao Rio Grande do Norte, com 12 dias, cerca de 3.565 km e seis localidades principais. O roteiro foi entregue como um PDF caprichado, com capa, mapa geral e uma página por dia.

O que chama atenção é o cuidado com detalhe. Cada dia traz o trecho de deslocamento, o mapa, o tempo estimado, as atrações, onde comer, onde dormir e observações soltas. É exatamente esse conjunto que o Triplaner precisa gerar sem o esforço manual.

## O que o roteiro manual contém

Extraímos os elementos presentes, separados por nível. Esta é, na prática, a lista de campos que o gerador deveria saber montar.

### Nível da viagem

| Elemento | Exemplo no material |
| --- | --- |
| Título da viagem | Nome e destino principal |
| Viajantes | Quem participa |
| Data de saída e retorno | Período total da viagem |
| Quilometragem total | Estimativa somada dos trechos |
| Mapa geral da rota | Visão do trajeto inteiro |
| Localidades visitadas | Lista ordenada das cidades |

### Nível do dia

| Elemento | Exemplo no material |
| --- | --- |
| Cabeçalho do dia | Número, data e dia da semana |
| Trecho de deslocamento | Origem, destino, distância e tempo estimado |
| Mapa do trecho | Imagem do trajeto, com rotas alternativas |
| Pedágio | Aviso de trecho com ou sem cobrança |
| Paradas | Almoço, descanso ao longo do caminho |
| Hospedagem | Status (a definir ou confirmada), nome e tipo |
| Atrações e atividades | Lista com descrição e categoria |
| Gastronomia local | Pratos típicos e restaurantes recomendados |
| Dicas práticas | Acesso, preservação, melhor época, reserva |
| Anotações do dia | Observações livres e decisões pendentes |

### Nível da atração

| Elemento | Exemplo no material |
| --- | --- |
| Nome e descrição | O que é e por que vale a visita |
| Categoria | Cultura, natureza, aventura, gastronomia |
| Necessidade de guia | Obrigatório, recomendado ou dispensável |
| Custo | Gratuito ou pago |
| Reserva prévia | Necessária ou não |
| Melhor época ou horário | Estação do ano, hora do dia |
| Duração ou extensão | Tamanho da trilha, tempo do passeio |

## O que o nosso gerador resolve bem

Boa parte do material conversa com o que o produto já prevê:

- A categorização das atrações em cultura, natureza, aventura e gastronomia é exatamente o filtro de tipo de atividade.
- A liberdade de manobra e a margem para imprevistos são a gestão de tempo, pausas e margem de erro.
- A sugestão de hospedagem alinhada ao trajeto é a integração de hospedagem.
- O mapa por trecho é o mapa interativo de exploração.

## O que falta e vira requisito

O roteiro manual revela lacunas que valem virar item de trabalho no frontend e no backend.

| Lacuna | O que adicionar |
| --- | --- |
| Deslocamento entre cidades | Trecho com origem, destino, distância, tempo e aviso de pedágio, não só locomoção dentro do local |
| Metadados da atração | Guia, custo, reserva prévia, melhor época e duração como campos próprios |
| Status de hospedagem | Estado a definir ou confirmada, para o usuário acompanhar o que ainda falta fechar |
| Anotações do dia | Campo de texto livre por dia, além de uma lista de decisões pendentes |
| Período aberto | Bloco de dias sem programação fixa, marcado como livre, como o material fez com um trecho da viagem |
| Múltiplas atividades no dia | Vários blocos no mesmo dia, inclusive dias que compartilham data |
| Recomendação gastronômica | Pratos típicos e restaurantes bem avaliados como conteúdo do dia |
| Exportar e compartilhar | Gerar um documento apresentável do roteiro, que foi o resultado final do trabalho manual |

Essas lacunas se conectam ao Mapa de Telas. Deslocamento e pedágio reforçam a tela de filtros do roteiro e a linha do tempo. Metadados da atração enriquecem o detalhe do ponto. Exportar e compartilhar dá peso à tela de roteiro salvo.

## Anotações diárias

Uma ideia que nasce direto do material: o roteiro manual está cheio de observações soltas por dia, como verificar a necessidade de guia, decidir uma parada ou lembrar de uma reserva. Isso pede um espaço próprio.

A proposta é que cada dia da linha do tempo tenha uma seção de anotações, com duas partes:

- Um campo de texto livre para observações gerais do dia.
- Uma lista de decisões pendentes, itens curtos que podem ser marcados como resolvidos.

O ganho é duplo. O usuário registra o raciocínio que hoje fica espalhado, e o roteiro passa a refletir o estado real do planejamento, não só o caminho ideal. As anotações entram no documento exportado, preservando o cuidado que o casal colocava à mão.

Do ponto de vista de UX, a seção fica recolhida por padrão para não pesar a linha do tempo, e se expande quando o usuário quer anotar. O conteúdo é salvo por dia, junto do roteiro.

## Como usamos esta referência

Este material vira insumo direto de três frentes:

- Inspiração visual, pela clareza do cabeçalho de dia, dos mapas e dos destaques de pedágio e hospedagem.
- Modelo de dados, pela lista de campos por viagem, por dia e por atração.
- Backlog, pelas lacunas que viram requisitos de tela e de conteúdo.
