---
sidebar_position: 2
title: Stack Tecnológico
---

# Stack Tecnológico

O stack foi escolhido para sustentar uma plataforma web robusta e de fácil manutenção por uma dupla, com forte reaproveitamento de TypeScript em toda a base.

## Frontend

| Item | Escolha |
| --- | --- |
| Framework | Next.js 16 |
| Biblioteca de UI | React 19 |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 4 |
| Lint | ESLint 9 |

O uso de React com TypeScript garante tipagem estática segura e uma interface componentizada, rápida e limpa. O Next.js dá estrutura de roteamento, renderização e organização de páginas.

## Backend

| Item | Escolha |
| --- | --- |
| Framework | NestJS 11 |
| Linguagem | TypeScript 5 |
| Runtime | Node.js |
| Servidor HTTP | Express (via plataforma NestJS) |
| Testes | Jest |

O NestJS oferece uma estrutura modular e opinativa para construir a API REST, adequada para orquestrar múltiplas chamadas externas de forma organizada e testável.

## Documentação

| Item | Escolha |
| --- | --- |
| Gerador de site | Docusaurus |
| Linguagem | TypeScript e Markdown / MDX |
| Publicação | GitHub Pages (gh-pages) |

## Integrações previstas

- **APIs de mapas e geolocalização** para distâncias e rotas.
- **APIs de LLM** (por exemplo OpenAI ou Gemini) para o processamento de linguagem natural do chatbot, em fase futura.
- **Fontes de avaliação de segurança e hospedagem** para enriquecer as recomendações do roteiro.

## Infraestrutura (visão futura)

A hospedagem prevista é baseada em servidores Linux, com uso de contêineres Docker para padronizar ambientes e facilitar o deploy. As decisões definitivas de infraestrutura serão tomadas conforme o produto amadurece e os custos são validados.
