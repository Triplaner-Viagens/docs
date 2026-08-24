---
sidebar_position: 3
title: Estrutura do Repositório
---

# Estrutura do Repositório

O Triplaner é organizado em repositórios separados por responsabilidade, todos sob a organização [Triplaner-Viagens](https://github.com/Triplaner-Viagens) no GitHub.

## Repositórios

| Repositório | Responsabilidade | Tecnologia |
| --- | --- | --- |
| [frontend](https://github.com/Triplaner-Viagens/frontend) | Interface web e experiência do usuário | Next.js, React, Tailwind |
| [backend](https://github.com/Triplaner-Viagens/backend) | API REST e orquestração de integrações | NestJS |
| [docs](https://github.com/Triplaner-Viagens/docs) | Documentação do produto e do projeto | Docusaurus |

## Organização local

Em ambiente de desenvolvimento, os repositórios convivem sob um diretório raiz do projeto:

```
Triplaner/
├── frontend/   # aplicação Next.js
├── backend/    # API NestJS
└── docs/       # este site de documentação
```

Cada repositório mantém seu próprio ciclo de versionamento e suas próprias dependências, o que reforça a separação de responsabilidades e permite evoluir cada frente de forma independente.

## Documentação (docs)

O repositório de documentação segue a estrutura padrão do Docusaurus:

```
docs/
├── docs/            # páginas de documentação em Markdown/MDX
├── src/             # páginas e componentes React do site
├── static/          # imagens e arquivos estáticos
├── docusaurus.config.ts
└── sidebars.ts
```

As páginas de conteúdo ficam em `docs/docs/`, organizadas nas seções Visão Geral, Produto, Arquitetura e Engenharia.
