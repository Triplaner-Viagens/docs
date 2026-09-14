---
sidebar_position: 4
title: Decisões Técnicas
---

# Decisões Técnicas

Registro das decisões do Review Intelligence Service no formato de ADR resumido: contexto, decisão, consequências e o que faria a decisão mudar. Data de referência: setembro de 2026.

## D1. O scraper descobre os lugares; o backend não mantém lista

**Contexto.** O backend NestJS monta o roteiro mas não tem catálogo de pontos de interesse por cidade.

**Decisão.** O serviço recebe apenas a cidade e descobre tudo (ver [Varredura de Cidade](./varredura-de-cidade.md)). O modo lote por Place ID continua disponível para quando o backend tiver uma lista própria.

**Consequências.** O serviço vira a fonte da lista de sugestões, então a taxonomia de categorias e os tetos passam a ser decisões de produto, mantidas em `config/categories.yaml`.

## D2. Descoberta pelo feed de busca do Google Maps, sem chave

**Contexto.** As fontes candidatas eram Google Places API (New), OpenStreetMap Overpass, Wikivoyage e o próprio Google Maps. A Places API é a fonte de melhor cobertura para restaurantes e bares, mas exige projeto no Google Cloud com billing habilitado (a chave do AI Studio usada no Gemini não serve). Overpass é gratuito mas fraco em gastronomia e não devolve nota nem volume de reviews.

**Alternativas testadas e descartadas.** Antes de recorrer ao navegador, foram testadas rotas HTTP puras do Maps: a busca com `tbm=map` devolve só 20 identificadores por consulta e ignora paginação; as páginas `maps/search`, `maps?cid=` e `search?ludocid=` são cascas de JavaScript sem resultados no HTML; `maps/preview/place` responde 400. Nenhuma entrega nome, nota e contagem de reviews com paginação.

**Decisão.** Provider padrão `maps_search`: Chromium headless abre a busca do Maps, rola o feed de resultados até o fim e extrai nome, identificador (ftid), coordenadas, nota e tipo de cada card. Em teste, uma consulta trouxe 87 lugares em 20 segundos. O provider `places_api` está implementado e pode ser ligado por configuração.

**Consequências.** Zero custo de descoberta. Em troca, dependência do HTML do Maps (pode quebrar sem aviso), cerca de 15 a 20 segundos por consulta e uso de memória do Chromium no worker. A contagem de reviews nem sempre aparece no card, o que enfraquece o piso de reviews até a validação em campo.

**O que mudaria a decisão.** Bloqueio pelo Google, ou cidades acima do teto de consultas onde a Places API (cerca de 300 chamadas por cidade) passa a valer o custo.

## D3. Places API adiada por custo

**Contexto.** A Places API (New) Text Search cobra por requisição depois de uma cota mensal gratuita por SKU (na faixa de alguns milhares de chamadas por mês no SKU Pro, na tabela vigente em 2026; confirmar na página de preços antes de habilitar). Uma cidade consome em torno de 100 buscas x até 3 páginas, então a cota gratuita cobriria algo como 15 cidades por mês; acima disso o custo fica na casa de dezenas de dólares por mil requisições.

**Decisão.** Não criar a chave agora. O código está pronto (`DISCOVERY_PROVIDER=places_api` e `GOOGLE_PLACES_API_KEY`), e o restante do serviço não depende dela.

**Consequências.** A resolução de lugar por nome e coordenadas em `POST /places/analyze` passou a usar a busca do Maps quando não há chave (ancorando pelo ftid em vez do Place ID). O provider `places_api` não foi executado contra a API real e precisa de uma validação curta quando a chave existir.

**Quando habilitar.** Ao entrar em produção com várias cidades por semana, ou se o scraping do Maps quebrar. Passos: projeto no Google Cloud, ativar Places API (New), restringir a chave por API, definir cota diária no console e ligar o provider.

## D4. Classificação no free tier do Gemini, billing adiado

**Contexto.** A classificação por LLM é o único custo variável do serviço. Gemini Flash Lite pelo endpoint compatível com OpenAI roda de graça dentro de uma cota diária de requisições e um limite por minuto; com billing, uma cidade de mil lugares custa em torno de US$ 4. A alternativa Claude Haiku com Batch API custa mais e não tem free tier.

**Decisão.** Manter Gemini Flash Lite sem billing. O serviço ganhou um limite diário de requisições configurável (`CLASSIFY_DAILY_REQUEST_LIMIT`): ao atingir a cota, os lotes restantes ficam pendentes e o próximo scan ou refresh retoma de onde parou, em vez de falhar o job.

**Consequências.** Uma cidade inteira leva vários dias para ficar totalmente pontuada no free tier. A lista de lugares fica disponível desde o primeiro dia (a descoberta não depende do modelo), e os scores vão chegando por prioridade de categoria. O scan de cidade projeta o custo antes de enfileirar e corta a fila para caber no cap diário em dólares quando o billing for ligado.

**Quando habilitar.** Quando o tempo até a primeira cidade completa importar mais do que os poucos dólares por cidade, ou quando houver mais de uma cidade em paralelo.

## D5. Cache de 90 e 180 dias com revalidação em segundo plano

**Contexto.** O serviço original guardava scores por 30 dias. Reviews mudam devagar e a coleta é a parte mais lenta.

**Decisão.** Validade por categoria: 90 dias para gastronomia e vida noturna, 180 para o restante. Cache vencido é servido com `stale: true` e o refresh roda em segundo plano (stale-while-revalidate). A varredura de cidade tem validade própria de 180 dias e só reanalisa lugares vencidos ou novos.

**Consequências.** Consultas repetidas para a mesma cidade não geram scraping. O backend precisa tratar `stale` como informação, não como erro.

## D6. Dimensionamento por tetos, piso de reviews e saturação

**Contexto.** O volume desejado era da ordem de mil lugares por cidade, mas o número real varia muito entre uma capital e uma cidade pequena.

**Decisão.** Três controles combinados: tetos por categoria (somam 1000), piso de reviews por categoria e parada por saturação da busca. Uma cidade pequena termina cedo pela saturação; uma megacidade é cortada pelos tetos e pelo máximo de consultas.

**Consequências.** O número de lugares por cidade é um resultado, não um parâmetro fixo. `maxPlaces` no request reescala os tetos quando o produto quiser uma lista menor.

## D7. Perfis de critérios por categoria

**Contexto.** Segurança, iluminação e caminhabilidade fazem sentido para todos os lugares, mas não dizem se um restaurante é bom.

**Decisão.** Três perfis: default, gastronomia e vida noturna (ver [Critérios e Scores](./criterios.md)). O prompt do classificador é montado por perfil, e menções fora do perfil são descartadas.

**Consequências.** O pré-filtro em gastronomia deixa passar quase todas as reviews, o que multiplica por cinco o custo de classificação por lugar nessa categoria. Isso foi considerado no teto de 400 lugares e na projeção de custo.

## D8. Place ID de cidade ou bairro não é analisado como lugar

**Contexto.** O primeiro teste do serviço usou o Place ID de Recife em `POST /places/analyze` e devolveu scores vazios, porque uma cidade não tem reviews.

**Decisão.** A rota de lugar único falha com mensagem explícita apontando para `POST /cities/scan` quando não há reviews.

## D9. Segurança de credenciais

Chaves ficam apenas em `.env`, que nunca é lido pelo assistente de código nem versionado; `.env.example` documenta cada variável. A configuração do Claude Code deve negar leitura e edição de `.env` e variantes. Uma chave que tenha aparecido em qualquer transcrição deve ser rotacionada.
