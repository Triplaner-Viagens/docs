---
sidebar_position: 5
title: Migração para inglês
---

# Migração para inglês

Registro do que foi executado para aplicar a [convenção de nomenclatura](./convencao-de-nomenclatura.md) ao código já existente. A convenção define o padrão; este documento registra a migração concreta, arquivo por camada, e o que ficou pendente.

## Escopo

A migração foi feita de uma vez nas três camadas: frontend, API do backend e banco de dados. O texto visível da interface continua em português; a tradução da interface é um passo futuro de i18n, fora desta migração.

## Frontend

Estado ao fim da migração: `next typegen && tsc --noEmit` com zero erros e `vitest run` com 25 de 25 testes passando.

### Biblioteca (`lib/`)

As pastas de domínio passaram a inglês, com tipos, funções e valores de enum traduzidos:

- `lib/itinerary/` (tipos, filtros, rótulos, mock): `Itinerary`, `Spot`, `Day`, `Block`, `Safety`, `ItineraryFilters`, `serializeFilters`, `readFilters`, `activityTypeLabel`, `transportModeLabel`, `safetyLabel`, `formatDuration`, `exampleItinerary`.
- `lib/destination/`, `lib/stay/`, `lib/settings/`: `Destination`, `Stay`, `StayType`, `stayTypeLabel`, `formatPrice`, `Settings`.
- `lib/auth/`: `context.tsx` (`AuthProvider`, `useAuth` retornando `{ state, user, signIn, signUp, signOut }`), `session.ts`, `initials.ts` (`emailInitials`), `payload.ts` (`emailFromToken`).
- `lib/http/`: `use-async.ts` (`useAsync`, `AsyncState` com `status` em `loading` / `ready` / `error`), `client.ts`.
- `lib/services/`: `itineraries`, `destinations`, `stays`, `settings`, `preferences`, `profile`, `auth`, apontando para os endpoints em inglês.

Valores de enum passaram a inglês: modos de locomoção (`walking`, `car`, `transit`, `bike`), tipos de atividade (`sightseeing`, `food`, `culture`, `nature`, `shopping`, `nightlife`), níveis de segurança (`safe`, `caution`, `avoid`) e tipos de bloco (`activity`, `break`, `transfer`). Os campos de filtro passaram a `startDate`, `endDate`, `mode`, `interests`, `pace`, `dayStart`, `dayEnd`, `breakMin` e `buffer`. O valor padrão de `Preferences.pace` passou de `equilibrado` para `balanced`.

### Componentes (`components/`)

Cerca de trinta componentes foram renomeados e reescritos para os novos nomes, props e imports. Principais: `ItineraryEditor`, `ItineraryMap`, `ItineraryStay`, `LoadEditor`, `Stepper` (props `steps` / `current`), `MapView` (prop `spots`), `DestinationCard` (prop `destination`), `StayCard` e `StayList` (prop `itineraryId`), `SettingsForm` e `Toggle`, `AccountPanel`, `AppHeader`, `SiteHeader`, `AuthGate`, os formulários de autenticação, `Assistant`, `Section` e `Sample`, `ColorSwatch` e `ColorPair`, `BackLink`, `ContentError` (prop `onRetry`), `PageHeader` (props `title` / `description`) e `ConnectionStatus`.

### Rotas (`app/`)

As pastas de rota e todas as páginas foram reescritas para os novos imports, nomes de componente, chaves de parâmetro (`spotId`, `stayId`) e hrefs. O mapeamento completo de rotas está na [convenção de nomenclatura](./convencao-de-nomenclatura.md#rotas).

## Backend

O módulo passou de `src/roteiro/` para `src/itinerary/`. O controller passou de `@Controller('roteiros')` para `@Controller('itineraries')`, com as ações `list`, `get`, `generate`, `save` e `share` em POST e `PATCH :id` para edição. O service usa `this.prisma.itinerary` e as colunas em inglês. Build, testes (23) e lint verdes.

## Banco de dados

Preparado, ainda não aplicado. A aplicação é uma operação sensível e depende de confirmação antes de rodar em produção.

- Migração Prisma `rename_to_english`: `ALTER TABLE` renomeando `Roteiro` para `Itinerary`, as colunas (`destino`, `periodo`, `resumo`, `dados`, `salvo` para `destination`, `period`, `summary`, `data`, `saved`), as constraints e o índice. Renomear preserva os dados.
- Script `scripts/migrate-itinerary-data.ts`: transforma, de forma idempotente, as chaves e valores internos em português do campo JSON das linhas já salvas, para continuarem legíveis com os novos tipos.

O serviço do backend no Render não roda `prisma migrate deploy` no boot, então a migração é aplicada manualmente com `npx prisma migrate deploy`, seguida do script de transformação do JSON.

## Pendências

- Aplicar a migração do banco no Supabase e rodar o script de transformação do JSON, com confirmação prévia.
- Decidir sobre a variável de ambiente `NEXT_PUBLIC_USAR_BACKEND`, que segue em português por depender também da configuração de deploy (Vercel e Render).
