---
sidebar_position: 6
title: Fluxo de Telas
---

# Fluxo de Telas do MVP

Este documento conecta as 16 telas do MVP em uma jornada, o que a lista do Mapa de Telas não mostra. Ele existe por dois motivos: fechar quais telas e estados precisam ser desenhados antes de qualquer pixel, e servir de briefing para gerar o design system e as telas no Figma.

As telas seguem a numeração do [Mapa de Telas](./mapa-de-telas.md). O escopo aqui é apenas o MVP: T01, T02, T05, T06, T08 a T13, T15, T18, T20 e as telas de sistema T23, T24 e T25.

## Portas de entrada

Antes da jornada principal, dois desvios controlam o acesso:

- **Autenticação.** Toda rota protegida exige sessão. Sem sessão, o usuário cai em T01. O backend de login e registro já existe.
- **Primeiro acesso.** Logo após criar a conta ou no primeiro login, o usuário passa por T05 para coletar preferências. Nos acessos seguintes vai direto para a Home.

## Jornada principal

```mermaid
flowchart TD
    Start([Acesso]) --> T01
    T01[T01 Login] <--> T02[T02 Registro]
    T01 -->|autenticado| Gate{Primeiro acesso?}
    T02 -->|conta criada| Gate
    Gate -->|sim| T05[T05 Preferencias]
    Gate -->|nao| T06
    T05 --> T06[T06 Home]

    T06 -->|montar roteiro| T08[T08 Filtros]
    T06 -->|meus roteiros| T18[T18 Meus roteiros]
    T06 -->|conta| T20[T20 Perfil]
    T06 -->|abrir recente| T11

    T08 --> T09[T09 Tempo e pausas]
    T09 --> T10[T10 Geracao]
    T10 -->|sucesso| T11[T11 Linha do tempo]
    T10 -->|falha| T24[T24 Erro generico]

    T11 <-->|alternar vista| T12[T12 Mapa]
    T11 -->|abrir ponto| T13[T13 Detalhe do ponto]
    T12 -->|abrir ponto| T13
    T13 -->|ver seguranca| T15[T15 Camada de seguranca]
    T11 -->|salvar| T18
    T18 -->|abrir roteiro| T11

    classDef core fill:#1668E3,stroke:#0B2545,color:#fff;
    classDef sys fill:#FF385C,stroke:#92174D,color:#fff;
    class T05,T06,T08,T09,T10,T11,T12,T13,T15,T18,T20 core;
    class T24 sys;
```

O eixo central é `T08 → T09 → T10 → T11`, a criação do roteiro. A partir do roteiro pronto, o usuário circula entre linha do tempo, mapa, detalhe do ponto e segurança sem sair do contexto, e salva o resultado em Meus Roteiros.

## Telas de sistema

Estados globais que qualquer tela pode acionar. São desenhados uma vez e reaproveitados.

```mermaid
flowchart LR
    Any[Qualquer rota] -->|inexistente| T23[T23 Nao encontrado]
    Any2[Qualquer tela] -->|erro inesperado| T24[T24 Erro generico]
    Empty[T06 ou T18 sem dados] -->|lista vazia| T25[T25 Estado vazio]
    T23 -->|voltar ao inicio| Home[T06 Home]
    T24 -->|tentar de novo| Prev[Tela anterior]
    T25 -->|montar roteiro| Filtros[T08 Filtros]

    classDef sys fill:#FF385C,stroke:#92174D,color:#fff;
    class T23,T24,T25 sys;
```

## Detalhamento por tela

Cada linha é o briefing de uma tela: o objetivo, os estados a desenhar e para onde ela leva. Os estados seguem o lembrete do Mapa de Telas: nem toda tela é um só desenho.

| Tela | Objetivo | Estados a desenhar | Saídas |
| --- | --- | --- | --- |
| T01 Login | Autenticar com email e senha | Padrão, enviando, erro de credencial | T02, T06, recuperar senha |
| T02 Registro | Criar conta com senha forte | Padrão, validando, enviando, erro | T01, T05 |
| T05 Preferências | Coletar gostos para alimentar filtros | Padrão, salvando | T06 |
| T06 Home | Busca dominante, atalhos e recentes | Com recentes, vazio, carregando | T08, T18, T20, T11 |
| T08 Filtros | Locomoção, atividade, datas e destino | Padrão, validação de campos | T09 |
| T09 Tempo e pausas | Janelas, pausas, retorno e margem | Padrão, validação | T10 |
| T10 Geração | Progresso enquanto monta o roteiro | Carregando, sucesso, falha | T11, T24 |
| T11 Linha do tempo | O dia em blocos, com anotações | Conteúdo, carregando, vazio | T12, T13, T18 |
| T12 Mapa | Explorar pontos e rota do dia | Conteúdo, carregando mapa, erro de tile | T11, T13 |
| T13 Detalhe do ponto | Dados do local e ação | Conteúdo, carregando | T15, volta ao roteiro |
| T15 Camada de segurança | Classificação, áreas e rotas | Conteúdo, sem dados de segurança | Volta ao detalhe |
| T18 Meus roteiros | Listar roteiros salvos | Com itens, vazio, carregando | T11 |
| T20 Perfil | Dados da conta | Conteúdo, salvando | Home |
| T23 Não encontrado | Rota inexistente | Único | T06 |
| T24 Erro genérico | Fronteira de erro com recuperação | Único | Tela anterior |
| T25 Estado vazio | Sem roteiros ou resultados | Único | T08 |

## Legenda

- **Azul**: telas do fluxo principal, na cor `primary`.
- **Vermelho**: telas de sistema e falha, na cor de marca `cta`, com traço em `wine`.
- Setas de mão dupla indicam alternância sem perda de contexto, como linha do tempo e mapa.

Este fluxo é a base do próximo passo: gerar no Figma o design system a partir dos tokens do frontend e, sobre ele, cada uma destas telas com seus estados.
