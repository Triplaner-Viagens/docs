---
sidebar_position: 4
title: Convenção de nomenclatura
---

# Convenção de nomenclatura

O código, as rotas, os arquivos e os identificadores do projeto ficam em inglês, para permitir a expansão internacional. A documentação segue em português por enquanto. O texto visível da interface também segue em português por ora; traduzi-lo é um passo futuro de internacionalização (i18n), separado desta padronização.

## Regras gerais

- Arquivos: `kebab-case` em inglês (`itinerary-timeline.tsx`, `types.ts`, `labels.ts`).
- Componentes e tipos: `PascalCase` (`DestinationCard`, `Itinerary`).
- Funções e variáveis: `camelCase` (`generateItinerary`, `serializeFilters`).
- Rotas: recurso no plural, REST consistente (`/itineraries`, `/itineraries/[id]`).

## Glossário de domínio

| Português | Inglês |
|---|---|
| roteiro | itinerary |
| ponto | spot |
| hospedagem | stay |
| destino | destination |
| dia | day |
| bloco | block |
| segurança | safety |
| filtros | filters |

## Enums e valores

| Português | Inglês |
|---|---|
| TipoAtividade | ActivityType |
| passeio | sightseeing |
| gastronomia | food |
| cultura | culture |
| natureza | nature |
| compras | shopping |
| vida-noturna | nightlife |
| MeioLocomocao | TransportMode |
| a-pe | walking |
| carro | car |
| transporte-publico | transit |
| bicicleta | bike |
| NivelSeguranca | SafetyLevel |
| tranquilo | safe |
| atencao | caution |
| evitar | avoid |
| bloco: atividade | activity |
| bloco: pausa | break |
| bloco: deslocamento | transfer |

## Campos

| Português | Inglês |
|---|---|
| nome | name |
| descricao | description |
| endereco | address |
| tipo | type |
| horaInicio | startTime |
| duracaoMin | durationMin |
| coordenadas | coordinates |
| imagemUrl | imageUrl |
| rotulo | label |
| meio | mode |
| distanciaKm | distanceKm |
| pedagio | toll |
| data | date |
| titulo | title |
| blocos | blocks |
| anotacoes | notes |
| destino | destination |
| periodo | period |
| resumo | summary |
| dias | days |
| salvo | saved |
| nivel | level |
| nota | note |

## Campos de filtro de geração

| Português | Inglês |
|---|---|
| inicio | startDate |
| fim | endDate |
| meio | mode |
| interesses | interests |
| ritmo | pace |
| comeco | dayStart |
| retorno | dayEnd |
| pausa | breakMin |
| margem | buffer |

## Rotas

| Antes | Depois |
|---|---|
| /roteiros | /itineraries |
| /roteiro/novo | /itineraries/new |
| /roteiro/novo/tempo | /itineraries/new/time |
| /roteiro/gerando | /itineraries/generating |
| /roteiro/[id] | /itineraries/[id] |
| /roteiro/[id]/editar | /itineraries/[id]/edit |
| /roteiro/[id]/compartilhar | /itineraries/[id]/share |
| /roteiro/[id]/mapa | /itineraries/[id]/map |
| /roteiro/[id]/ponto/[pontoId] | /itineraries/[id]/spot/[spotId] |
| /roteiro/[id]/hospedagem | /itineraries/[id]/stay |
| /roteiro/[id]/hospedagem/[hospedagemId] | /itineraries/[id]/stay/[stayId] |
| /chat | /assistant |
| /destinos | /destinations |
| /perfil | /profile |
| /configuracoes | /settings |
| /preferencias | /preferences |
| /recuperar-senha | /forgot-password |
| /redefinir-senha | /reset-password |

## API do backend

O controller passa de `@Controller('roteiros')` para `@Controller('itineraries')`, com ações em inglês: `list`, `get`, `generate`, `save`, `share` (mantendo POST com corpo) e `PATCH :id` para edição.

## Banco de dados

O model `Roteiro` passa a `Itinerary` e as colunas para inglês (`destination`, `period`, `summary`, `data`, `saved`). O campo JSON com a estrutura do roteiro tem suas chaves internas migradas junto, para as linhas já salvas continuarem legíveis.
