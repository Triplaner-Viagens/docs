---
sidebar_position: 4
title: Componentes, Loading e Mapa
---

# Componentes, Loading e Mapa

Esta seção cobre a parte técnica do frontend: a modularização de componentes com shadcn/ui, a estratégia de carregamento, a responsividade para celular e o mapa interativo com MapLibre.

## Modularização com shadcn/ui

O frontend usa Next.js 16, React 19 e Tailwind v4. Sobre essa base entra o shadcn/ui, que não é uma biblioteca instalada como dependência fechada, e sim um conjunto de componentes copiados para dentro do projeto. A gente é dona do código de cada componente e pode ajustá-lo.

Por que combina com o requisito de modularização:

- Cada componente é um arquivo isolado, com responsabilidade única.
- Os componentes usam os tokens do tema, então mudança de marca não exige mexer em cada um.
- A CLI do shadcn detecta o Tailwind v4 sozinho e gera os componentes já no formato de tokens em `@theme`, sem `tailwind.config`.

Organização proposta de pastas:

```
app/          rotas e páginas
components/
  ui/         componentes base do shadcn, botão, card, input, skeleton
  layout/     header, navegação, rodapé
  roteiro/    componentes do domínio de roteiro
  mapa/       componentes do mapa
lib/          utilidades, cliente de API, helpers
hooks/        hooks reutilizáveis
```

A regra é separar o componente base, que é genérico, do componente de domínio, que conhece as regras do Triplaner. Um `Card` é base. Um `CartaoDeRoteiro` é de domínio e usa o `Card` por dentro.

### Estados de cada componente

Todo componente interativo prevê seus estados desde o começo, não só o estado feliz:

- Padrão, foco, hover, ativo e desabilitado.
- Carregando, com o indicador adequado.
- Erro, com a mensagem no padrão da seção de UX.
- Vazio, quando não há dados, com orientação do que fazer.

## Estratégia de carregamento

A pesquisa de UX aponta que o melhor não é escolher entre spinner e skeleton, e sim orquestrar os dois pelo tempo de espera. O skeleton melhora a percepção de velocidade em 20 a 30 por cento em conteúdo estruturado.

| Tempo de espera | O que mostrar |
| --- | --- |
| 0 a 300ms | Nada. O usuário não percebe atrasos tão curtos, e um flash pareceria bug |
| 300ms a 1s | Spinner sutil, quando o layout que vem é desconhecido ou a ação é curta |
| 1s a 10s | Skeleton que imita o conteúdo que está chegando |

Aplicação no produto:

- Lista de resultados, cards de roteiro e mapa carregam com skeleton, porque a estrutura é conhecida.
- Ações curtas, como salvar um filtro ou autenticar, usam spinner inline.
- A geração do roteiro, que é mais longa e variável, mostra progresso com estado e mensagem, para o usuário não se sentir travado.

O shadcn já traz um componente `Skeleton` que usa os tokens do tema, então a aparência do carregamento acompanha a marca.

## Responsividade para celular

Abordagem mobile first. O layout é desenhado primeiro para a tela pequena e cresce a partir dela.

- Breakpoints do Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.
- Alvos de toque confortáveis, com o mínimo de acessibilidade respeitado.
- No celular, navegação principal na base da tela, ao alcance do polegar.
- Filtros viram painel deslizante, em vez de barra lateral.
- O mapa ocupa a tela cheia, e os detalhes do ponto sobem em um painel deslizante sobre ele.
- Respeito às áreas seguras do aparelho, sem elemento colado atrás de recortes ou barras do sistema.

## Mapa interativo com MapLibre

O requisito de explorar o local pede um mapa fluido, não só uma imagem estática. A escolha é o MapLibre GL JS.

Por que MapLibre:

- Vetorial e acelerado por WebGL, com zoom, rotação e inclinação suaves, o que dá a sensação de explorar.
- Open source, fork do Mapbox, sem custo de licença nem lock-in.
- Estilo do mapa customizável, então dá para aproximar as cores do mapa da marca.

O que ele exige e como tratamos:

- MapLibre desenha o mapa, mas os dados de tile vêm de um provedor. No início, um provedor de camada gratuita atende o desenvolvimento e o MVP.
- A chave do provedor, quando houver, é segredo. Ela fica em variável de ambiente e nunca é commitada, seguindo a regra de segurança do projeto.

Uso previsto no Triplaner:

- Cada ponto do roteiro vira um marcador no mapa.
- Ao tocar um marcador, um popup ou painel mostra o detalhe do local.
- A rota do dia é desenhada ligando os pontos na ordem do roteiro.
- Quando houver muitos pontos próximos, eles se agrupam para não poluir a tela.
- O usuário pode navegar livremente pelo mapa para explorar a região ao redor do roteiro.

A integração no React será feita por um wrapper compatível com MapLibre, mantendo o componente de mapa isolado na pasta de domínio. Como toda dependência nova, a biblioteca passa antes por checagem de vulnerabilidades e aprovação.

## Fontes desta pesquisa

- [shadcn/ui com Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
- [Skeleton loading screen design (LogRocket)](https://blog.logrocket.com/ux-design/skeleton-loading-screen-design/)
- [Mapbox vs Leaflet vs MapLibre GL JS 2026 (PkgPulse)](https://www.pkgpulse.com/guides/mapbox-vs-leaflet-vs-maplibre-interactive-maps-2026)
- [Map libraries comparison (Geoapify)](https://www.geoapify.com/map-libraries-comparison-leaflet-vs-maplibre-gl-vs-openlayers-trends-and-statistics/)
