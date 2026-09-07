---
sidebar_position: 9
title: Arquitetura do Frontend
---

# Arquitetura do Frontend

Este documento define como o frontend organiza suas chamadas de dados e os estados de cada tela, para que o MVP funcione com dados de exemplo hoje e passe a consumir o backend sem reescrever as páginas. Ele é o planejamento que guia a codificação de todas as telas.

## Princípio: página não conhece transporte

Nenhuma página ou componente faz `fetch` direto nem importa o mock. Toda leitura e escrita de dados passa por um serviço de domínio. O serviço decide de onde vêm os dados: hoje do mock local, amanhã do backend. Trocar a origem é mudar o interior do serviço, não as telas.

## Camadas

```
lib/
  http/
    client.ts        cliente fetch base: baseUrl, JSON, credenciais,
                     erro tipado (ApiError)
  services/
    auth.ts          login, register, recuperarSenha, redefinirSenha
    roteiros.ts      listar, obter, gerar, atualizar, salvar
    preferencias.ts  obter, salvar
    perfil.ts        obter
  roteiro/
    tipos.ts         contratos de domínio (Roteiro, Ponto, Dia, ...)
    mock.ts          dados de exemplo, consumidos apenas pelos serviços
    filtros.ts       tipos e parsing dos filtros de criação
```

### Cliente HTTP

`http/client.ts` centraliza a base das requisições: monta a URL a partir de `NEXT_PUBLIC_API_URL`, envia e recebe JSON, inclui credenciais e traduz falhas em um `ApiError` tipado, com `status` e `code`. Os serviços usam esse cliente e nunca chamam `fetch` diretamente. O cliente expõe os verbos `post`, `patch` e `query`.

### Método QUERY para leituras com filtros

Leituras que carregam muitos filtros, como gerar e listar roteiros, usam o método HTTP `QUERY` em vez de `GET`. O `QUERY` é seguro e idempotente como o `GET`, porém aceita corpo de requisição, o que foi pensado justamente para consultas com muitos parâmetros. Assim os filtros vão no corpo em JSON, sem estourar o tamanho e a legibilidade de uma query string, e a resposta é cacheável.

Vale separar os dois usos de filtro no fluxo de criação:

- Entre as telas, os filtros trafegam como query params na URL, para cada etapa ser recarregável e compartilhável.
- Na chamada ao backend, o serviço envia esses mesmos filtros no corpo de uma requisição `QUERY`.

O cliente `fetch` aceita o método `QUERY` como string. Quando o backend ainda não expõe o endpoint, o serviço devolve o mock e a assinatura assíncrona não muda.

### Serviços de domínio

Cada serviço expõe funções que devolvem tipos de domínio, não formatos de rede. Enquanto o backend de roteiro não existe, o serviço retorna o mock por trás de uma pequena espera simulada, mantendo a mesma assinatura assíncrona que a versão real terá. Uma flag lida de ambiente decide entre origem de exemplo e origem real, tela por recurso, sem tocar nas páginas.

Contratos previstos:

| Serviço | Função | Entrada | Saída |
| --- | --- | --- | --- |
| auth | `login` | email, senha | sessão |
| auth | `register` | email, senha | sessão |
| roteiros | `listar` | filtro opcional | lista de `Roteiro` |
| roteiros | `obter` | id | `Roteiro` ou nulo |
| roteiros | `gerar` | `FiltrosRoteiro` | `Roteiro` |
| roteiros | `atualizar` | id, alterações | `Roteiro` |
| roteiros | `salvar` | id | confirmação |
| preferencias | `obter` | nada | `Preferencias` |
| preferencias | `salvar` | `Preferencias` | confirmação |
| perfil | `obter` | nada | `Perfil` |

## Fluxo de criação com query params

As três etapas da criação carregam os filtros pela URL, então cada tela é legível no servidor, recarregável e compartilhável, sem estado global.

```
T08 /roteiro/novo
  coleta destino, datas, meio, interesses
  -> T09 /roteiro/novo/tempo?destino=...&inicio=...&fim=...&meio=...&interesses=...
        acrescenta ritmo, início, retorno, pausa, margem
  -> T10 /roteiro/gerando?<todos os filtros>
        chama roteiros.gerar(filtros), entao redireciona
  -> T11 /roteiro/[id]
```

`roteiro/filtros.ts` define `FiltrosRoteiro` e as funções de serializar e ler os filtros da URL, para as etapas não repetirem parsing. A tela de geração lê os filtros, chama `roteiros.gerar` e substitui a rota pelo roteiro criado.

## Estados por tela

Toda tela com dados assíncronos prevê os quatro estados do Mapa de Telas. O resumo do que cada tela do MVP exige:

| Tela | Loading | Vazio | Erro |
| --- | --- | --- | --- |
| T11 Roteiro | skeleton do roteiro | dia sem pontos | fronteira de erro da rota |
| T12 Mapa | skeleton do mapa | sem pontos para exibir | fronteira de erro da rota |
| T13 Ponto | skeleton do ponto | ponto inexistente vira 404 | fronteira de erro da rota |
| T18 Meus roteiros | skeleton da lista | `EmptyState` sem roteiros | fronteira de erro da rota |
| T10 Geração | é o próprio estado de progresso | não se aplica | volta aos filtros com aviso |

Loading vive em `loading.tsx` por segmento, o vazio em `EmptyState`, o erro na fronteira `error.tsx`. As telas de formulário (T05, T08, T09) validam entrada no cliente e mostram erro por campo, sem estado assíncrono de leitura.

## Ordem de implementação

1. Cliente HTTP e serviços, com o mock por trás.
2. Migrar as páginas para consumir os serviços no lugar do mock direto.
3. Ligar o fluxo de criação por query params, até `roteiros.gerar`.
4. Completar os estados de loading e vazio que faltam.

Cada passo mantém o build verde, e nenhuma página muda de novo quando o backend entrar.
