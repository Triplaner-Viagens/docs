---
sidebar_position: 6
title: FinOps e Custos
---

# FinOps e Custos

O que custa dinheiro, quanto custa por cidade e por cliente, e quais botoes controlam o gasto.
Valores em dolar, tabela de precos de setembro de 2026; confira as paginas de precos antes de
decidir, elas mudam.

## 1. Onde o dinheiro vai

| Componente | Custo | Observacao |
| --- | --- | --- |
| Geocodificacao (Nominatim) | zero | Limite de uso: 1 req/s e User-Agent identificado |
| Descoberta de lugares (busca do Maps em Chromium) | zero em dinheiro | Custa CPU e RAM do worker e tempo (15 a 20 s por busca) |
| Coleta de reviews (Google Maps) | zero em dinheiro | Custa tempo do worker; proxy opcional (`SCRAPE_PROXY_URL`) se houver bloqueio, US$ 5 a 15/mes |
| Classificacao por LLM | **unico custo variavel** | Por token; Gemini Flash Lite hoje |
| Infraestrutura | fixo mensal | VPS ou PaaS com Postgres, Redis, API e worker |
| Places API (desligada) | por requisicao | So se for ligada |

## 2. Modelo de custo da classificacao

Parametros usados pelo servico na projecao (`app/cost/projection.py`):

| Parametro | Valor | Origem |
| --- | --- | --- |
| Reviews coletadas por lugar no scan | 200 | `CITY_REVIEWS_PER_PLACE` |
| Taxa de reviews relevantes apos o prefiltro | 15% atracoes, 80% gastronomia, 85% vida noturna | Observado em Recife (atracoes) e estimado para restaurantes, onde quase toda review fala de comida ou atendimento |
| Reviews por requisicao | 20 | `CLASSIFY_BATCH_SIZE` |
| Tokens por requisicao | 700 de prompt de sistema + 120 de entrada e 60 de saida por review | Medido no prompt atual |

Precos por milhao de tokens (entrada / saida):

| Modelo | Entrada | Saida | Free tier |
| --- | --- | --- | --- |
| Gemini Flash Lite (via endpoint OpenAI) | 0,10 | 0,40 | Sim: cota diaria de requisicoes, sem custo |
| Claude Haiku 4.5 com Batch API | 0,50 | 2,50 | Nao |
| Claude Haiku 4.5 sem batch | 1,00 | 5,00 | Nao |

### Cidade completa (1000 lugares, tetos padrao)

| Categoria | Lugares | Reviews | Relevantes |
| --- | --- | --- | --- |
| turismo, natureza, passeios, compras | 500 | 100.000 | 15.000 |
| gastronomia | 400 | 80.000 | 64.000 |
| vida noturna | 100 | 20.000 | 17.000 |
| **Total** | **1000** | **200.000** | **96.000** |

Requisicoes de classificacao: 96.000 / 20 = **4.800**.
Tokens: entrada 4.800 x 700 + 96.000 x 120 = 14,9 M; saida 96.000 x 60 = 5,8 M.

| Modelo | Custo da cidade completa |
| --- | --- |
| Gemini Flash Lite, billing ligado | **US$ 3,80** |
| Gemini Flash Lite, free tier | US$ 0, mas 4.800 requisicoes divididas pela cota diaria: com uma cota na casa de mil por dia, cerca de 5 dias por cidade e no maximo 6 cidades por mes |
| Claude Haiku 4.5, Batch API | US$ 21,90 |

Na pratica muitos lugares tem menos de 200 reviews, entao o custo real tende a ficar entre
**US$ 2,50 e 3,80 por cidade** com Gemini. Uma cidade pequena (200 lugares) custa menos de US$ 1.

### Revalidacao (cache vencido)

O refresh e incremental: so baixa e classifica reviews mais novas que a ultima coleta. Em 90 dias um
restaurante popular recebe de 20 a 60 reviews novas, um museu de 5 a 20. Estimativa: **20% a 30% do
custo inicial por ciclo**, ou seja US$ 0,80 a 1,10 por cidade a cada 90 dias para gastronomia e
vida noturna e outros US$ 0,30 a cada 180 dias para o resto. Anualizado, uma cidade ativa custa
cerca de **US$ 8 a 9 por ano** em classificacao.

### Analise avulsa de um lugar (`POST /places/analyze`)

Ate 1500 reviews por lugar. Um restaurante grande: 1500 x 0,8 = 1200 relevantes, 60 requisicoes,
cerca de US$ 0,05. Uma atracao: 1500 x 0,15 = 225 relevantes, US$ 0,01. O alerta
`COST_PLACE_ALERT_USD=0.10` dispara quando um lugar passa disso.

## 3. Infraestrutura

| Opcao | Composicao | Mensal |
| --- | --- | --- |
| VPS unica (recomendada para comecar) | 2 vCPU, 4 GB, Docker Compose com db, redis, web e worker | US$ 8 a 25 (Hetzner, Contabo, DigitalOcean) |
| Render | Web Starter + Worker Standard (Chromium precisa de 2 GB) + Postgres Basic + Key Value | US$ 45 a 60 |
| Escala (10+ cidades por dia) | VPS 4 vCPU 8 GB com 2 workers, ou Postgres gerenciado | US$ 30 a 60 |

Tempo de worker por cidade completa: 8 a 12 min de descoberta (3 abas de Chromium em paralelo,
primeira lista em menos de um minuto) mais 2 a 3 h de coleta e classificacao com 3 jobs em
paralelo. Uma VPS de 4 GB processa confortavelmente 8 a 10 cidades novas por dia.

Pre-aquecimento das 42 cidades de `config/warm_cities.yaml`: zero de descoberta (sem chave), e
cerca de US$ 160 de classificacao com billing do Gemini, ou zero no free tier ao longo de
algumas semanas. Depois disso, o usuario nunca espera pela descoberta nessas cidades.

## 4. Places API, se for ligada

Places API (New) Text Search cobra por requisicao acima da cota mensal gratuita, e os campos
`rating` e `userRatingCount` que o ranking usa caem no SKU mais caro (na tabela de 2026, na faixa de
US$ 30 a 40 por mil requisicoes depois de cerca de mil gratuitas por mes; conferir em
https://developers.google.com/maps/billing-and-pricing/pricing). Uma cidade consome de 100 a 120
buscas com ate 3 paginas cada, entre 200 e 350 requisicoes. Resultado: **US$ 8 a 14 por cidade**,
duas a quatro vezes o custo da classificacao. Por isso a descoberta via Maps continua como padrao;
a Places API fica como plano B para bloqueio do scraping.

## 5. Custo por cliente

Definicao: um cliente e uma viagem criada no Triplaner para uma cidade. O custo por cliente depende
quase totalmente de quantos clientes compartilham a mesma cidade dentro do prazo de validade (180
dias): a primeira viagem para Recife paga a varredura, as seguintes leem do cache a custo zero.

Requisicoes tipicas de uma viagem: 1 `POST /cities/scan` (cache na maioria), 3 a 10
`GET /cities/{id}/places` (so banco), 0 a 3 `POST /places/analyze` para lugares adicionados a mao
(quase sempre cache). Nenhuma delas chama o LLM quando a cidade ja foi varrida.

Cenarios mensais com Gemini com billing e VPS unica:

| Cenario | Cidades novas/mes | Cidades ativas (refresh) | Viagens/mes | LLM | Infra | Total | **Por viagem** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Piloto | 10 | 10 | 200 | US$ 38 + 3 | US$ 20 | US$ 61 | **US$ 0,31** |
| Crescimento | 30 | 60 | 1.000 | US$ 114 + 20 | US$ 25 | US$ 159 | **US$ 0,16** |
| Escala | 100 | 300 | 5.000 | US$ 380 + 100 | US$ 60 | US$ 540 | **US$ 0,11** |
| Free tier (hoje) | ate 6 | 6 | 200 | US$ 0 | US$ 20 | US$ 20 | **US$ 0,10**, com cidades levando dias para completar |

Regra de bolso: **US$ 4 por cidade nova, US$ 9 por cidade por ano de manutencao, e o custo por
viagem cai conforme viagens por cidade aumentam.** Com 20 viagens por cidade por semestre, a
classificacao custa menos de US$ 0,20 por viagem; abaixo de 5 viagens por cidade o custo por viagem
passa de US$ 1 e vale restringir `maxPlaces` (uma varredura de 300 lugares custa US$ 1,20).

## 6. Botoes de controle

| Controle | Efeito |
| --- | --- |
| `COST_DAILY_CAP_USD` | Teto de gasto por dia; o scan projeta o custo e corta a fila para caber, o excedente vai para o proximo scan |
| `CLASSIFY_DAILY_REQUEST_LIMIT` | Cota de requisicoes por dia (free tier); excedente fica pendente |
| `COST_KILL_SWITCH` | Desliga o LLM sem parar coleta e descoberta |
| `CITY_MAX_PLACES` e `maxPlaces` no request | Menos lugares, custo proporcional |
| `CITY_REVIEWS_PER_PLACE` | 200 reviews e o ponto de equilibrio; 100 corta o custo pela metade com scores um pouco menos confiaveis em criterios raros como seguranca |
| `config/categories.yaml` | Tetos por categoria: gastronomia e a categoria cara (80% de relevancia); reduzir de 400 para 250 lugares corta 30% do custo da cidade |
| `CLASSIFY_BATCH_SIZE` | Mais reviews por requisicao dilui o prompt de sistema (700 tokens); 20 e o limite seguro para o modelo devolver JSON valido |
| `GET /stats` | Gasto do dia, total acumulado, requisicoes contra a cota e fila; ligar num painel |
| Tabela `cost_ledger` | Custo por lugar e por fase para auditoria; `COST_PLACE_ALERT_USD` avisa outliers |

## 7. O que reduz custo sem perder qualidade (ordem de impacto)

1. Manter o cache de 90 e 180 dias e o refresh incremental (ja feito): e o que transforma US$ 4 por
   cidade em centavos por viagem.
2. Prefiltro por lexico (ja feito): corta 85% das reviews de atracoes antes do LLM.
3. Prompt caching no provider: o prompt de sistema de 700 tokens se repete em todas as requisicoes;
   quando o billing for ligado, a cache de contexto do Gemini ou do Anthropic reduz a parcela de
   entrada em ate 20%.
4. Reduzir `CITY_REVIEWS_PER_PLACE` para 120 em cidades pequenas, onde os lugares nao chegam a 200
   reviews de qualquer forma.
5. Classificar gastronomia com lotes de 25 reviews e prompt de saida mais curto (menos citacoes),
   se a validacao mostrar JSON estavel.
