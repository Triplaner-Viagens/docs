---
sidebar_position: 5
title: Mapa de Telas
---

# Mapa de Telas

Este documento inventaria todas as telas do Triplaner. A meta é saber, desde já, quantas telas precisamos construir, em que ordem e o que cada uma exige. Ele guia o planejamento do frontend e evita descobrir telas faltantes no meio do caminho.

## Como ler este mapa

Cada tela recebe um código, de `T01` em diante, uma descrição e uma prioridade.

| Prioridade | Significado |
| --- | --- |
| MVP | Entra na primeira versão, o núcleo de filtros manuais e roteiro |
| Fase 2 | Melhorias e integrações após o MVP validar a ideia |
| Futuro | Diferenciais previstos na visão de produto, como o assistente |

A divisão segue a visão de produto, que recomenda começar por um MVP de filtros manuais e deixar o assistente conversacional para uma fase posterior, diluindo custo e tempo.

## Autenticação

O backend destas telas já existe, descrito na seção de Autenticação.

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T01 | Login | Email e senha, com link para registro e recuperação | MVP |
| T02 | Registro | Criação de conta com validação de senha forte | MVP |
| T03 | Recuperar senha | Solicitação por email | Fase 2 |
| T04 | Redefinir senha | Definição de nova senha a partir do link | Fase 2 |

## Onboarding

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T05 | Boas-vindas e preferências | Coleta os gostos gerais do usuário para alimentar os filtros | MVP |

## Descoberta

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T06 | Home | Busca dominante no topo, atalhos e roteiros recentes | MVP |
| T07 | Resultados de destino | Lista de destinos ao buscar, quando houver desambiguação | Fase 2 |

## Criação de roteiro

Este é o fluxo central do produto. Os campos de cada tela derivam da seção Referência de Roteiro Manual, que lista o que um roteiro real precisa conter, incluindo deslocamento entre cidades, pedágio, metadados da atração e as anotações do dia.

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T08 | Filtros do roteiro | Meio de locomoção, tipo de atividade, datas e destino | MVP |
| T09 | Tempo e pausas | Janelas de diversão, pausas, horário de retorno e margem de erro | MVP |
| T10 | Geração do roteiro | Estado de progresso enquanto o roteiro é montado | MVP |
| T11 | Roteiro em linha do tempo | O dia como blocos de atividade, pausa e deslocamento, com anotações do dia | MVP |
| T12 | Roteiro no mapa | Mapa interativo para explorar os pontos e a rota do dia | MVP |
| T13 | Detalhe do ponto | Informações de um local do roteiro, com dados de segurança | MVP |
| T14 | Edição do roteiro | Reordenar, remover e ajustar pontos e horários | Fase 2 |

## Segurança

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T15 | Camada de segurança | Classificação do local, áreas a evitar e rotas mais amigáveis | MVP |

Esta camada pode aparecer embutida no detalhe do ponto e no mapa, mas é mapeada como tela própria por ter regra e conteúdo específicos.

## Hospedagem

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T16 | Sugestões de hospedagem | Estadias alinhadas geograficamente ao roteiro | Fase 2 |
| T17 | Detalhe de hospedagem | Informações e link para a propriedade sugerida | Fase 2 |

## Biblioteca do usuário

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T18 | Meus roteiros | Lista dos roteiros salvos pelo usuário | MVP |
| T19 | Roteiro salvo | Visualização de um roteiro salvo, base para compartilhar | Fase 2 |

## Conta

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T20 | Perfil | Dados da conta do usuário | MVP |
| T21 | Configurações | Tema, preferências e notificações | Fase 2 |

## Assistente

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T22 | Assistente conversacional | Chatbot que coleta necessidades e preenche os filtros | Futuro |

## Telas de sistema

Estados que toda aplicação precisa e que são fáceis de esquecer no planejamento.

| Código | Tela | Descrição | Prioridade |
| --- | --- | --- | --- |
| T23 | Não encontrado | Página 404 para rotas inexistentes | MVP |
| T24 | Erro genérico | Fronteira de erro, com mensagem calma e ação de recuperação | MVP |
| T25 | Estado vazio | Exibido quando não há roteiros ou resultados | MVP |
| T26 | Sem conexão | Aviso de falta de conexão, quando aplicável | Fase 2 |

## Contagem

| Área | Telas | Códigos |
| --- | --- | --- |
| Autenticação | 4 | T01 a T04 |
| Onboarding | 1 | T05 |
| Descoberta | 2 | T06, T07 |
| Criação de roteiro | 7 | T08 a T14 |
| Segurança | 1 | T15 |
| Hospedagem | 2 | T16, T17 |
| Biblioteca | 2 | T18, T19 |
| Conta | 2 | T20, T21 |
| Assistente | 1 | T22 |
| Sistema | 4 | T23 a T26 |
| **Total** | **26** | |

Distribuição por prioridade:

| Prioridade | Telas | Total |
| --- | --- | --- |
| MVP | T01, T02, T05, T06, T08 a T13, T15, T18, T20, T23, T24, T25 | 16 |
| Fase 2 | T03, T04, T07, T14, T16, T17, T19, T21, T26 | 9 |
| Futuro | T22 | 1 |

O MVP concentra 16 telas. É esse o esforço inicial de frontend a planejar.

## Lembrete de estados

Cada tela não é um só desenho. Toda tela com dados assíncronos precisa prever seus estados, conforme a seção de Componentes, Loading e Mapa:

- Carregando, com skeleton ou spinner segundo o tempo de espera.
- Sucesso, com o conteúdo real.
- Vazio, quando não há dados, com orientação do próximo passo.
- Erro, com mensagem genérica e ação de recuperação.

Ao estimar o trabalho de uma tela, contamos também esses estados, não apenas o caso feliz.

## Fluxo principal do MVP

A jornada central conecta as telas assim:

```
T01/T02 Login ou Registro
  -> T05 Preferências
  -> T06 Home, busca do destino
  -> T08 Filtros do roteiro
  -> T09 Tempo e pausas
  -> T10 Geração
  -> T11 Roteiro em linha do tempo
      <-> T12 Roteiro no mapa
      -> T13 Detalhe do ponto -> T15 Segurança
  -> T18 Meus roteiros, ao salvar
```
