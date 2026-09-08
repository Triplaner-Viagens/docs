---
sidebar_position: 2
title: Desenvolvimento e CI/CD
---

# Desenvolvimento e CI/CD

Este guia mostra como rodar o Triplaner localmente e como funciona o pipeline de
integração e entrega contínua. O produto vive em três repositórios separados,
cada um com seu ciclo de evolução: `frontend` (Next.js), `backend` (NestJS) e
`docs` (Docusaurus, este site).

## O que já está configurado

- Domínio padronizado em inglês no código e nas rotas. Ver [Migração para inglês](./migracao-ingles.md).
- Containers de desenvolvimento e de produção nos dois repositórios de aplicação, com `Dockerfile`, `Dockerfile.dev` e `docker-compose`.
- Pipeline no GitHub Actions com três estágios encadeados: qualidade, build da imagem Docker e deploy.
- Migrations tratadas como passo separado, nunca no boot do container.

## Pré-requisitos

- Node.js 22 e npm.
- Docker com Compose, para o caminho conteinerizado.

## Rodar localmente com npm

O caminho mais rápido para iterar em código. Exige um Postgres acessível pela
`DATABASE_URL` (local ou gerenciado).

### Backend

```bash
cd backend
cp .env.example .env          # preencha DATABASE_URL e os segredos JWT
npm install
npm run prisma:migrate        # aplica as migrations no banco de dev
npm run start:dev             # sobe a API em http://localhost:3333
```

Os segredos `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` precisam de ao menos 16
caracteres, senão a validação de ambiente barra a subida.

### Frontend

```bash
cd frontend
npm install
npm run dev                   # sobe a interface em http://localhost:3000
```

O frontend chama a API pela variável `NEXT_PUBLIC_API_URL`, que assume
`http://localhost:3333` por padrão. A flag `NEXT_PUBLIC_USAR_BACKEND` decide se
as telas usam o backend real ou os dados de exemplo; com o backend no ar,
mantenha `true`.

### Documentação

```bash
cd docs
npm install
npm start                     # abre o site de docs em http://localhost:3000
```

## Rodar com Docker

Ambiente isolado e reproduzível. No backend, o Compose já sobe um Postgres
local, então não é preciso ter banco na máquina.

### Backend, desenvolvimento

```bash
cd backend
docker compose up --build
```

Sobe três serviços: `db` (Postgres em `5433:5432`), `migrate` (roda
`prisma migrate deploy` uma vez e encerra) e `backend` (API em `3333:3333`, com
hot reload). Ao trocar dependências ou reaproveitar um volume antigo:

```bash
docker compose up --build --renew-anon-volumes
```

Para parar e, se quiser, apagar o volume do banco:

```bash
docker compose down           # para os serviços
docker compose down -v        # para e apaga os dados do banco de dev
```

### Frontend, desenvolvimento

```bash
cd frontend
docker compose up --build
```

Sobe a interface em `3000:3000`. Como os repositórios são separados, tenha o
backend no ar antes (por npm ou pelo Compose do backend). O navegador alcança a
API por `http://localhost:3333`.

### Produção, validação local

As imagens de produção também rodam na máquina, úteis para validar o artefato
igual ao que sobe em produção antes de fazer o deploy.

```bash
# backend
cd backend
JWT_ACCESS_SECRET=um-segredo-forte-de-16-mais JWT_REFRESH_SECRET=outro-segredo-forte-16-mais \
  docker compose -f docker-compose.prod.yml up --build

# frontend
cd frontend
docker compose -f docker-compose.prod.yml up --build
```

Segredos entram só em runtime, nunca embutidos na imagem ou no `Dockerfile`.

## Banco de dados e migrations

O banco fica fora da imagem do app: código é descartável a cada deploy, dados
precisam sobreviver. Por isso a migration é um passo único e ordenado, e não roda
no boot do container, o que evitaria corrida entre réplicas.

- Desenvolvimento local: `npm run prisma:migrate` cria e aplica migrations.
- Container: o serviço `migrate` roda `npx prisma migrate deploy` antes do backend subir.
- Produção: o Render aplica as migrations pelo `preDeployCommand` do `render.yaml`.

## Testes e qualidade

```bash
# backend
npm run lint
npm run typecheck
npm test
npm run test:e2e

# frontend
npm run lint
npm run typecheck
npm test
```

## Fluxo de CI/CD

Cada repositório de aplicação tem seu `.github/workflows/ci.yml`, disparado em
`push` e em `pull_request`. São três jobs encadeados por `needs`:

```mermaid
flowchart LR
    Push([push ou pull request]) --> Q[quality<br/>lint, typecheck e testes]
    Q --> D[docker<br/>valida o build da imagem]
    D --> Dep[deploy<br/>dispara o hook do Render]
```

- **quality**: roda lint, typecheck e testes. No backend, sobe um Postgres como
  serviço do job e aplica as migrations antes dos testes, para que o e2e rode
  contra um banco real.
- **docker**: builda a imagem de produção para provar que ela compila. Em pull
  request apenas builda, sem publicar, pegando build quebrado antes do merge.
- **deploy**: dispara o deploy do Render pelo webhook `RENDER_DEPLOY_HOOK_URL`.
  O Render builda o próprio `Dockerfile` e roda as migrations pelo
  `preDeployCommand`. Enquanto o secret do hook não estiver configurado, o job é
  inofensivo e não publica nada, o que evita deploy acidental.

A ordem `quality` para `docker` para `deploy` garante que nada é publicado sem
antes passar nos testes e provar que a imagem builda.
