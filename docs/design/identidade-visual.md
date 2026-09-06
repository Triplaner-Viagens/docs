---
sidebar_position: 1
title: Identidade Visual
---

# Identidade Visual

Esta seção define a base visual do Triplaner: a direção da marca, a paleta de cores, a tipografia, os tokens de design e os padrões de layout. A meta declarada na visão de produto é um visual leve e familiar, inspirado em players consolidados de viagem, com curva de aprendizado quase nula.

## Direção escolhida: Confiança

A direção adotada é a "Confiança", uma base de azul na linhagem de Booking e Hoteis.com, com um acento coral quente. A escolha atende dois pontos do produto:

- O azul comunica segurança e credibilidade, o que conversa direto com o módulo de segurança e com a persona de viajantes familiares.
- A familiaridade com apps de viagem consolidados reduz a curva de aprendizado, como pede a visão de produto.

O acento coral entra apenas em ações principais e destaques, para dar calor e direcionar o olhar sem poluir.

## Referências de mercado

O estudo de players guiou tanto cor quanto posição de componentes.

| Player | O que aproveitamos |
| --- | --- |
| Booking, Hoteis.com | Azul de confiança, filtros laterais, cards de resultado densos e escaneáveis |
| Airbnb | Uso econômico de um único acento, foto grande, respiro e hierarquia limpa |
| Trivago, Kayak | Barra de busca dominante no topo e comparação lado a lado |

O princípio geral: layout familiar de app de viagem, cor sóbria e um acento usado com parcimônia.

## Paleta

As cores são organizadas por papel, não por matiz. Cada cor tem uma função, e a interface usa o token pelo papel, nunca o valor cru.

### Tema claro

| Token | Papel | Hex |
| --- | --- | --- |
| background | Fundo da página | `#F7F8FA` |
| surface | Fundo de card e superfícies elevadas | `#FFFFFF` |
| foreground | Texto principal | `#0B2545` |
| muted-foreground | Texto secundário | `#5A6B85` |
| border | Bordas e divisórias | `#E3E8EF` |
| primary | Ação principal, links, estado ativo | `#1668E3` |
| primary-foreground | Texto sobre primary | `#FFFFFF` |
| accent | Destaque quente, CTA de conversão | `#FF7A45` |
| success | Segurança, confirmação, avaliação positiva | `#12B76A` |
| warning | Atenção, área a evitar com ressalva | `#F79009` |
| destructive | Erro, ação irreversível | `#E5484D` |

### Tema escuro

O dark mode não é opcional na tendência atual e vem quase de graça com os tokens. As cores de fundo escurecem e as cores de ação clareiam para manter contraste.

| Token | Papel | Hex |
| --- | --- | --- |
| background | Fundo da página | `#0B1220` |
| surface | Fundo de card | `#121A2A` |
| foreground | Texto principal | `#E6ECF5` |
| muted-foreground | Texto secundário | `#9AA7BD` |
| border | Bordas e divisórias | `#22304A` |
| primary | Ação principal | `#4C8DFF` |
| accent | Destaque quente | `#FF8A5C` |
| success | Segurança, confirmação | `#3CCB7F` |

### Regras de uso da cor

- O acento coral aparece em no máximo um elemento por tela em geral, para não competir com o azul de ação.
- Cor nunca é o único meio de transmitir informação. Segurança de um local, por exemplo, usa cor mais ícone e rótulo, atendendo à acessibilidade.
- Contraste segue a régua do WCAG descrita na seção de acessibilidade.

## Tipografia

Duas famílias, ambas gratuitas, com fallback de sistema.

| Uso | Fonte | Observação |
| --- | --- | --- |
| Títulos e destaques | Plus Jakarta Sans | Moderna e amigável, dá personalidade sem ruído |
| Corpo e interface | Inter | Altíssima legibilidade em tamanhos pequenos |

Escala base, seguindo o padrão de tamanhos pequenos e confiantes dos apps de viagem:

| Papel | Tamanho | Peso |
| --- | --- | --- |
| Texto de apoio | 14px | 400 |
| Corpo | 16px | 400 |
| Rótulo de UI | 16px | 500 |
| Título de seção | 22px a 28px | 600 |
| Título de página | 32px a 40px | 700 |

## Tokens, forma e espaçamento

- Grade base de 4px. Todo espaçamento é múltiplo de 4.
- Raio de canto: 8px em botões e inputs, 12px em cards. Transmite acolhimento sem exagero.
- Elevação por sombra suave, usada só onde há hierarquia real, para não pesar a tela.

Os tokens vivem no `globals.css` do frontend, dentro do bloco `@theme` do Tailwind v4, que é como o shadcn/ui organiza o tema. Exemplo do formato:

```css
@theme {
  --color-background: #f7f8fa;
  --color-surface: #ffffff;
  --color-foreground: #0b2545;
  --color-primary: #1668e3;
  --color-accent: #ff7a45;
  --color-success: #12b76a;
  --radius-md: 0.75rem;
}
```

Assim, trocar uma cor da marca é mudar um token em um lugar só, e toda a interface acompanha.

## Padrões de layout

- Barra de busca dominante no topo da home, como nos players de referência.
- Resultados e roteiro em cards escaneáveis, com foto, título, informação-chave e uma ação clara.
- Filtros em painel lateral no desktop e em painel deslizante no mobile.
- Um roteiro é lido como uma linha do tempo do dia, com blocos de atividade, pausas e deslocamentos.
- O mapa acompanha o roteiro, permitindo explorar cada ponto, conforme a seção de componentes e mapa.

## Fontes desta pesquisa

- [Airbnb Brand Color Palette (Mobbin)](https://mobbin.com/colors/brand/airbnb)
- [Hotel Website Design Trends 2026 (Mediaboom)](https://mediaboom.com/news/hotel-website-design-trends/)
- [UI Color Trends 2026 (Updivision)](https://updivision.com/blog/post/ui-color-trends-to-watch-in-2026)
- [Trivago Brand Design Case Study (Behance)](https://www.behance.net/gallery/41914807/Trivago-Brand-Design-Case-Study)
