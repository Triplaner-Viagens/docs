---
sidebar_position: 5
title: Operação e Deploy
---

# Operação e Deploy

Passo a passo para subir o servico do zero, validar com uma cidade real e deixar rodando.
Duas formas: local com `uv` (desenvolvimento) ou tudo em containers (producao em uma VPS).
Os comandos assumem o terminal dentro de `webscraper/`.

## 0. Pre-requisitos

| Item | Versao | Para que |
| --- | --- | --- |
| Docker + Docker Compose | Compose v2 | Postgres, Redis e, em producao, API e worker |
| uv | 0.8 ou mais novo | Ambiente Python (so no modo local) |
| Python | 3.12 ou 3.13 | Instalado pelo uv |
| Chromium do Playwright | instalado pelo comando abaixo | Descoberta de lugares e resolucao por nome |
| RAM livre | 3 GB (local) ou 4 GB na VPS | Chromium usa de 400 MB a 1 GB por busca |

Chaves: nenhuma obrigatoria. Sem `OPENAI_API_KEY` (Gemini) o pipeline roda em dry run: descobre,
coleta e prefiltra, mas nao pontua. Sem `GOOGLE_PLACES_API_KEY` tudo funciona via Maps.

## 1. Configurar o `.env`

1. Copie o exemplo: `cp .env.example .env` (so na primeira vez; se ja existe, compare os dois
   e acrescente o que falta).
2. Confira as variaveis novas desta versao, que precisam existir no seu `.env`:

```
CLASSIFY_DAILY_REQUEST_LIMIT=0
DISCOVERY_PROVIDER=maps_search
DISCOVERY_REQUEST_INTERVAL_SECONDS=2.0
DISCOVERY_MAX_RESULTS_PER_QUERY=120
DISCOVERY_HEADLESS=true
DISCOVERY_PARALLEL_TABS=3
DISCOVERY_QUICK_MAX_RESULTS=40
GEOCODE_USER_AGENT=triplaner-review-intelligence/0.1
CITY_MAX_PLACES=1000
CITY_MAX_QUERIES=250
CITY_REVIEWS_PER_PLACE=200
CITY_SATURATION_RATIO=0.10
CITY_GRID_CELL_KM=3.0
CITY_DEFAULT_RADIUS_KM=10.0
CITY_SCAN_TTL_DAYS=180
SCORES_TTL_DAYS=180
```

3. Classificacao com Gemini no free tier (o que voce usa hoje):

```
CLASSIFY_PROVIDER=openai
CLASSIFY_MODEL=gemini-3.5-flash-lite
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
OPENAI_API_KEY=<chave nova do AI Studio>
CLASSIFY_REQUEST_INTERVAL_SECONDS=4
CLASSIFY_DAILY_REQUEST_LIMIT=<cota diaria do modelo no free tier>
```

   O valor da cota diaria esta em https://ai.google.dev/gemini-api/docs/rate-limits (muda com o
   tempo). Com o limite preenchido, o servico para de chamar o modelo ao atingir a cota e retoma no
   dia seguinte em vez de falhar o job. Deixe `0` se ligar o billing.

4. Rotacione a chave do Gemini se a atual ja apareceu em alguma transcricao ou log.

5. Corrija a regra de bloqueio do Claude Code em `~/.claude/settings.json` para que o `.env`
   nunca mais seja lido por assistente:

```json
"deny": ["Read(**/.env)", "Read(**/.env.*)", "Edit(**/.env)", "Edit(**/.env.*)"]
```

   Repare que essa regra tambem bloqueia `.env.example`; por isso o `.env.example` nao recebeu a
   ultima alteracao de comentario sobre a Places API (o conteudo das variaveis esta correto).

## 2. Subir Postgres e Redis

```bash
make infra            # docker compose up -d db redis
docker compose ps     # os dois devem aparecer healthy
```

Portas no host: Postgres 5434, Redis 6380 (evitam conflito com instancias locais do backend).

## 3. Instalar dependencias e aplicar migracoes (modo local)

```bash
uv sync --all-extras
uv run playwright install chromium
make migrate          # alembic upgrade head (inclui a migracao a7d3e1b2c4f5 do city scan)
make test             # 47 testes e ruff devem passar
```

Se `alembic upgrade head` reclamar de revisao desconhecida, o banco e de uma versao anterior ao
servico: `docker compose down -v` apaga o volume e recomeca.

## 4. Subir API e worker (modo local)

Em dois terminais:

```bash
make api              # uvicorn em http://localhost:8100 (Swagger em /docs)
make worker           # arq: processa scan_city e analyze_place
```

Verificacoes:

```bash
curl -s localhost:8100/health/ready   # {"status":"ok","database":"ok","redis":"ok"}
curl -s -H "X-Api-Token: $API_TOKEN" localhost:8100/stats   # gasto do dia, fila, contagens
```

Toda rota, exceto `/health` e `/health/ready`, exige o header `X-Api-Token` igual ao
`API_TOKEN` do `.env` do webscraper (o backend envia o mesmo valor via `SCRAPER_API_TOKEN`).
Sem `API_TOKEN` o servico responde 503. Swagger (`/docs`) so com `APP_ENV=development`.

## 5. Primeira varredura de validacao (Recife, pequena)

Comece pequeno para validar tres coisas que so aparecem com o Google real: se a contagem de reviews
vem nos cards, o tempo por busca e se nao ha bloqueio.

```bash
uv run python scripts/scan_city.py Recife --country Brasil \
  --categories turismo --max-places 20 --reviews 60
```

O que observar no terminal e nos logs do worker:

1. Estagio `discover:quick` e, em menos de um minuto, `firstResultsAt` preenchido no job e a
   primeira lista em `GET /cities/{id}/places`. Depois `discover:turismo:Nq:Mp` avancando
   (N consultas, M lugares); cada consulta leva de 15 a 20 s, 3 abas em paralelo.
2. Linha de log `maps_search 'pontos turisticos' @...: 87 lugares`: se vier 0 lugares em todas as
   consultas, o Google mudou o HTML ou pediu consentimento; abra a URL no navegador para ver.
3. Ao final, `GET /cities/{id}/places` mostra `userRatingCount`. Se estiver nulo em todos os
   lugares, o parser do card precisa de ajuste (arquivo `app/discovery/maps_parsing.py`, funcao
   `parse_count`); sem a contagem o piso de reviews nao filtra.
4. Filhos passando por `ingest`, `prefilter`, `classify`, `aggregate`. Com Gemini configurado, os
   scores aparecem em minutos para 20 lugares.

Se tudo bateu, rode a cidade inteira:

```bash
uv run python scripts/scan_city.py Recife --country Brasil
```

Espere a primeira lista em 30 a 60 s, a descoberta completa em 8 a 12 min e algumas horas de
coleta. No free tier do Gemini a classificacao continua por varios dias; o job pai fecha quando os
filhos terminam e os lugares que ficaram `pendingReviews > 0` sao retomados no proximo scan com
`--refresh`.

Antes de abrir para usuarios, pre-aqueca os destinos mais procurados para que ninguem espere
pela descoberta. A lista fica em `config/warm_cities.yaml` (42 cidades, edite a vontade):

```bash
uv run python scripts/warm_cities.py            # uma cidade por vez, so a descoberta
uv run python scripts/warm_cities.py --wait-scores   # espera tambem a classificacao
```

Cada cidade ocupa o worker por 8 a 12 min de descoberta; a lista inteira leva uma tarde. No free
tier do Gemini os scores chegam ao longo das semanas seguintes; o cache de 180 dias segura tudo.

## 6. Producao em uma VPS (tudo em containers)

Requisitos: VPS Linux com 2 vCPU e 4 GB de RAM (Chromium precisa de memoria), Docker instalado,
porta 8100 fechada para a internet e aberta so para o backend (VPN, rede privada ou firewall).

```bash
git clone <repo do webscraper> && cd webscraper
cp .env.example .env && nano .env      # preencha como na secao 1
make build                             # imagem com Chromium (uns 2 GB, demora na primeira vez)
make up                                # db, redis, web (roda alembic e sobe a API), worker
docker compose --profile app ps        # web e worker devem ficar healthy
make logs
```

O compose ja define healthchecks (`/health/ready` na API, `arq --check` no worker), `shm_size` de
1 GB e limite de 3 GB de memoria para o worker. Para escalar a coleta, suba mais workers:
`docker compose --profile app up -d --scale worker=2` (cada um roda ate 3 jobs).

Atualizacao: `git pull && make build && make up` (o container web aplica as migracoes ao subir).

Backup: o volume `review-intel-db-data` guarda tudo. `docker exec review-intel-db pg_dump -U
scraper review_intelligence > backup.sql` uma vez por semana basta para o volume atual.

## 7. Integrar com o backend NestJS

1. Variavel `REVIEW_INTELLIGENCE_URL` apontando para a API (rede privada).
2. Ao criar um roteiro: `POST /cities/scan` com nome e pais. Guardar `cityId` e `jobId`.
3. Montar o roteiro com `GET /cities/{cityId}/places?sort=score&minConfidence=media`; a lista
   fica disponivel antes dos scores terminarem.
4. Tratar `stale: true` como informacao (score valido porem vencido), `score: null` como sem dados
   e `pendingReviews > 0` como scores ainda a caminho.
5. Poll de `GET /jobs/{jobId}` a cada 30 s ou mais; nao ha webhook nesta versao.
6. Consultar `GET /stats` num painel interno para acompanhar gasto e fila.

## 8. Quando ligar o que esta desligado

| O que | Quando | Como |
| --- | --- | --- |
| Billing do Gemini | Quando uma cidade precisar ficar completa em horas, nao dias | Ativar billing no projeto do AI Studio, `CLASSIFY_DAILY_REQUEST_LIMIT=0`, ajustar `COST_DAILY_CAP_USD` |
| Places API | Se o scraping do Maps quebrar ou para cidades acima do teto de consultas | Projeto no Google Cloud, ativar Places API (New), chave restrita por API, `GOOGLE_PLACES_API_KEY` e `DISCOVERY_PROVIDER=places_api`; rodar um scan pequeno para validar o provider |
| Claude Haiku | Se a qualidade da classificacao do Flash Lite nao bastar | `CLASSIFY_PROVIDER=anthropic`, `ANTHROPIC_API_KEY`, `CLASSIFY_USE_BATCH_API=true` |

## 9. Problemas comuns

| Sintoma | Causa provavel | Acao |
| --- | --- | --- |
| `/health/ready` 503 com `database: erro` | Postgres fora ou `DATABASE_URL` errada | `docker compose ps`, conferir porta 5434 |
| Scan fica em `discover:...:0p` | Google devolveu pagina de consentimento ou HTML mudou | Abrir a URL de busca no navegador, conferir seletores em `maps_search.py` |
| Filhos falham com `NoReviewsError` | Lugar sem reviews (comum em passeios) | Esperado; o pai fecha mesmo assim |
| Scores com `insuficiente` em tudo | Sem chave do provider (dry run) ou cota do dia esgotada | Ver `/stats` (`remainingRequestsToday`) |
| Job pai preso em `analyzing` | Worker caiu no meio | Reiniciar o worker; `GET /jobs/{id}` fecha o pai quando nenhum filho esta ativo |
| Worker morto por memoria | Chromium + muitas abas | Reduzir `max_jobs` do worker ou subir o limite de memoria no compose |
