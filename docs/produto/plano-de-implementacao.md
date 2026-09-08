---
sidebar_position: 5
title: Plano de Implementação
---

# Plano de Implementação

Este documento planeja a implementação das lacunas levantadas na seção Referência de Roteiro Manual. São seis frentes que aproximam o gerador do cuidado de um roteiro montado à mão:

1. Deslocamento entre cidades, com distância, tempo e pedágio.
2. Metadados da atração: guia, custo, reserva prévia, melhor época e duração.
3. Status de hospedagem, a definir ou confirmada.
4. Período aberto, dias sem programação fixa.
5. Recomendação gastronômica, pratos e restaurantes.
6. Exportar e compartilhar o roteiro como documento apresentável.

## Princípio: primeiro manual, depois automático

A visão de produto recomenda começar por um MVP de filtros manuais e diluir custo e tempo. Seguimos o mesmo princípio aqui.

- **Fase A, manual**: o modelo de dados guarda todos os campos, e o usuário preenche o que quiser. Sem dependência de API externa. Já entrega valor e valida a estrutura.
- **Fase B, automático**: integrações preenchem sozinhas distância, tempo, pedágio e sugestões gastronômicas, e o export ganha acabamento.

Assim, cada campo nasce editável à mão, exatamente como o casal fazia, e a automação entra depois sem quebrar nada.

## Modelo de dados

Hoje o backend tem os modelos `User` e `Itinerary`, e o roteiro é guardado como um documento único no campo `data` do `Itinerary`. Estas frentes trocam esse documento único por uma estrutura de viagem relacional e editável. A proposta em Prisma, resumida nos modelos centrais:

```prisma
model Trip {
  id              String     @id @default(uuid())
  userId          String
  title           String
  startDate       DateTime
  endDate         DateTime
  totalDistanceKm Float?
  status          TripStatus @default(DRAFT)
  days            Day[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Day {
  id         String            @id @default(uuid())
  tripId     String
  date       DateTime
  order      Int
  isOpen     Boolean           @default(false) // periodo aberto
  notes      String? // anotacoes livres do dia
  legs       Leg[]
  activities Activity[]
  lodging    Lodging?
  decisions  PendingDecision[]
}

model Leg {
  id          String     @id @default(uuid())
  dayId       String
  order       Int        @default(0)
  originName  String
  destName    String
  distanceKm  Float?
  durationMin Int?
  toll        TollStatus @default(UNKNOWN)
  tollCost    Float?
}

model Activity {
  id               String           @id @default(uuid())
  dayId            String
  order            Int
  name             String
  description      String?
  category         ActivityCategory
  needsGuide       GuideNeed        @default(UNKNOWN)
  cost             CostType         @default(UNKNOWN)
  costValue        Float?
  needsReservation Boolean          @default(false)
  bestSeason       String?
  bestTimeOfDay    String?
  durationMin      Int?
}

model Lodging {
  id       String        @id @default(uuid())
  dayId    String        @unique
  status   LodgingStatus @default(TO_DEFINE)
  name     String?
  type     LodgingType   @default(OTHER)
  checkIn  DateTime?
  checkOut DateTime?
}

model PendingDecision {
  id       String  @id @default(uuid())
  dayId    String
  text     String
  resolved Boolean @default(false)
}

model Recommendation {
  id          String             @id @default(uuid())
  dayId       String?
  kind        RecommendationKind
  name        String
  description  String?
  rating      Float?
}

model ShareLink {
  id        String    @id @default(uuid())
  tripId    String
  token     String    @unique
  expiresAt DateTime?
}
```

Enums de apoio:

```prisma
enum TripStatus         { DRAFT PLANNED DONE }
enum TollStatus         { NONE PAID UNKNOWN }
enum ActivityCategory   { CULTURE NATURE ADVENTURE GASTRONOMY LEISURE OTHER }
enum GuideNeed          { REQUIRED RECOMMENDED NONE UNKNOWN }
enum CostType           { FREE PAID UNKNOWN }
enum LodgingStatus      { TO_DEFINE CONFIRMED }
enum LodgingType        { HOTEL POUSADA AIRBNB OTHER }
enum RecommendationKind { DISH RESTAURANT SHOP }
```

Cada frente abaixo usa um pedaço desse modelo.

## Frente 1: Deslocamento entre cidades

**Objetivo**: registrar o trecho de um dia com origem, destino, distância, tempo e pedágio, indo além da locomoção dentro de um único local.

- **Dados**: modelo `Leg`, ligado ao `Day`. O campo `toll` distingue trecho sem cobrança, com cobrança e desconhecido, o que espelha o destaque de pedágio do roteiro manual.
- **Backend**: endpoints de CRUD de `Leg` sob um dia. Cálculo do `totalDistanceKm` da viagem somando os trechos.
- **Frontend**: bloco de deslocamento na linha do tempo, com distância, tempo e uma etiqueta de pedágio. Entra também na tela de filtros do roteiro, ao definir de onde para onde se vai.
- **Integração, Fase B**: uma API de rotas preenche distância e tempo automaticamente. Pedágio depende de disponibilidade da fonte, e fica como decisão em aberto.

## Frente 2: Metadados da atração

**Objetivo**: descrever cada atração como o roteiro manual descrevia, com guia, custo, reserva, melhor época e duração.

- **Dados**: campos no modelo `Activity`, com enums para guia e custo, e campos livres para melhor época e horário.
- **Backend**: CRUD de `Activity` sob um dia, com validação dos enums.
- **Frontend**: no card da atividade e no detalhe do ponto, esses metadados viram etiquetas e linhas de informação. Guia obrigatório, entrada gratuita e necessidade de reserva ganham destaque visual, sempre com ícone e texto, não só cor, por acessibilidade.
- **Integração, Fase B**: parte dos metadados pode vir de fontes de pontos de interesse, mas o preenchimento manual continua válido.

## Frente 3: Status de hospedagem

**Objetivo**: acompanhar o que já está fechado e o que ainda falta, como o material que alternava entre hospedagem a definir e confirmada.

- **Dados**: modelo `Lodging`, um por dia, com `status` a definir ou confirmada e `type` para hotel, pousada, Airbnb ou outro.
- **Backend**: CRUD de `Lodging` sob um dia.
- **Frontend**: cartão de hospedagem no dia, com etiqueta clara de status. Um resumo da viagem pode listar quantas noites ainda estão a definir, ajudando o usuário a fechar as pendências.
- **Observação de segurança**: contato de anfitrião é dado pessoal. Se for guardado, fica restrito ao dono do roteiro e nunca é exposto em link público.

## Frente 4: Período aberto

**Objetivo**: permitir dias sem programação fixa, como o trecho do material marcado como programação à parte.

- **Dados**: campo `isOpen` no `Day`. Um dia aberto pode ter anotações, mas não exige atividades nem trechos.
- **Backend**: nada além do campo. As validações que exigiriam atividades passam a ignorar dias abertos.
- **Frontend**: na linha do tempo, o dia aberto aparece com um marcador leve de tempo livre e um convite para planejar depois, sem parecer um erro ou um vazio.

## Frente 5: Recomendação gastronômica

**Objetivo**: sugerir pratos típicos e restaurantes, presença forte no roteiro manual.

- **Dados**: modelo `Recommendation`, com `kind` para prato, restaurante ou compra. Fica ligado ao dia ou à localidade.
- **Backend**: CRUD simples e uma consulta por dia.
- **Frontend**: uma seção de sabores locais no dia, com nome, descrição curta e avaliação quando houver.
- **Integração, Fase B**: uma API de lugares traz restaurantes bem avaliados próximos aos pontos do dia.

## Frente 6: Exportar e compartilhar

**Objetivo**: transformar o roteiro em um documento apresentável, que foi o resultado final do trabalho manual, e permitir compartilhar.

- **Dados**: modelo `ShareLink`, com um token para acesso de leitura.
- **Backend**: geração do token e uma rota pública de leitura que devolve o roteiro sem dados sensíveis.
- **Frontend**:
  - **Fase A**: uma visão de impressão do roteiro, com CSS próprio, que o usuário salva como PDF pelo próprio navegador. Rápido e sem dependência nova.
  - **Fase B**: um PDF desenhado, fiel à identidade visual, e uma página pública de leitura via link.
- **Cuidado**: o documento exportado e o link público nunca incluem contato de anfitrião nem outros dados pessoais.

## Integrações externas e decisões em aberto

A Fase B depende de fontes externas. Toda biblioteca ou serviço novo passa antes por checagem de vulnerabilidades e sua aprovação, conforme as regras do projeto.

| Necessidade | Candidatos | Decisão |
| --- | --- | --- |
| Distância e tempo de rota | OpenRouteService, Mapbox Directions, Google Routes | Em aberto. OpenRouteService tem camada gratuita e dados abertos |
| Pedágio | Google Routes, provedores regionais | Em aberto. Cobertura de pedágio no Brasil precisa de validação |
| Restaurantes e avaliações | Google Places, Foursquare, OpenStreetMap | Em aberto. Custo e limites a comparar |
| Export em PDF | Impressão do navegador, biblioteca dedicada | Fase A usa impressão. Fase B avalia biblioteca |

Nenhuma dessas integrações bloqueia a Fase A, que é toda manual.

## Roadmap em fases

**Fase A, base manual**

1. Modelo de dados de viagem, com migration.
2. Backend: CRUD de `Trip`, `Day`, `Leg`, `Activity`, `Lodging`, `PendingDecision`, `Recommendation`.
3. Frontend: linha do tempo lendo esses dados, com bloco de deslocamento, metadados da atração, cartão de hospedagem, dia aberto e sabores locais.
4. Anotações do dia e decisões pendentes, conforme a Referência de Roteiro Manual.
5. Export por impressão do navegador.

**Fase B, automação e acabamento**

1. Integração de rotas para distância e tempo.
2. Avaliação de fonte de pedágio.
3. Integração de lugares para gastronomia.
4. PDF desenhado e link público de compartilhamento.

## Impacto nas telas

Estas frentes recaem sobre telas já previstas no Mapa de Telas, em vez de criar muitas telas novas:

| Frente | Telas afetadas |
| --- | --- |
| Deslocamento entre cidades | T08 Filtros do roteiro, T11 Linha do tempo |
| Metadados da atração | T11 Linha do tempo, T13 Detalhe do ponto |
| Status de hospedagem | T11 Linha do tempo, T16 Sugestões de hospedagem |
| Período aberto | T11 Linha do tempo |
| Recomendação gastronômica | T11 Linha do tempo, T13 Detalhe do ponto |
| Exportar e compartilhar | T19 Roteiro salvo |

A maior parte do trabalho concentra na linha do tempo, que se torna o coração do produto.
