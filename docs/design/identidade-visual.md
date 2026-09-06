---
sidebar_position: 1
title: Identidade Visual
---

# Identidade Visual

Esta seção define a base visual do Triplaner: a direção da marca, a paleta de cores, a tipografia, os tokens de design e os padrões de layout. A meta declarada na visão de produto é um visual leve e familiar, inspirado em players consolidados de viagem, com curva de aprendizado quase nula.

export const Sw = ({ c }) => (
  <span
    style={{
      display: "inline-block",
      width: 14,
      height: 14,
      borderRadius: 3,
      marginRight: 6,
      verticalAlign: "-2px",
      border: "1px solid #cbd5e1",
      background: c,
    }}
  />
);

## Direção escolhida: Confiança

A direção adotada é a "Confiança", uma base de azul na linhagem de Booking e Hoteis.com, com um par de acentos quentes do Airbnb: o vermelho Rausch e o vinho. A escolha atende dois pontos do produto:

- O azul comunica segurança e credibilidade, o que conversa direto com o módulo de segurança e com a persona de viajantes familiares.
- A familiaridade com apps de viagem consolidados reduz a curva de aprendizado, como pede a visão de produto.

O vermelho do Airbnb entra como cor de marca em ações de conversão e destaques, e o vinho o acompanha em gradientes e elementos gráficos, dando calor e direcionando o olhar sem poluir.

## Referências de mercado

O estudo de players guiou tanto cor quanto posição de componentes.

| Player | O que aproveitamos |
| --- | --- |
| Booking, Hoteis.com | Azul de confiança, filtros laterais, cards de resultado densos e escaneáveis |
| Airbnb | Vermelho Rausch como cor de marca, foto grande, respiro e hierarquia limpa |
| Trivago, Kayak | Barra de busca dominante no topo e comparação lado a lado |

O princípio geral: layout familiar de app de viagem, cor sóbria e um acento usado com parcimônia.

## Paleta

As cores são organizadas por papel, não por matiz. Cada cor tem uma função, e a interface usa o token pelo papel, nunca o valor cru.

### Tema claro

| Token | Papel | Cor |
| --- | --- | --- |
| background | Fundo da página | <Sw c="#F7F8FA"/> `#F7F8FA` |
| surface | Fundo de card e superfícies elevadas | <Sw c="#FFFFFF"/> `#FFFFFF` |
| foreground | Texto principal | <Sw c="#0B2545"/> `#0B2545` |
| muted-foreground | Texto secundário | <Sw c="#5A6B85"/> `#5A6B85` |
| border | Bordas e divisórias | <Sw c="#E3E8EF"/> `#E3E8EF` |
| primary | Ação principal, links, estado ativo | <Sw c="#1668E3"/> `#1668E3` |
| primary-foreground | Texto sobre primary | <Sw c="#FFFFFF"/> `#FFFFFF` |
| cta | Cor de marca, CTA de conversão | <Sw c="#FF385C"/> `#FF385C` |
| cta-foreground | Texto sobre cta | <Sw c="#FFFFFF"/> `#FFFFFF` |
| wine | Acento em gradientes e destaques gráficos | <Sw c="#92174D"/> `#92174D` |
| success | Segurança, confirmação, avaliação positiva | <Sw c="#12B76A"/> `#12B76A` |
| warning | Atenção, área a evitar com ressalva | <Sw c="#F79009"/> `#F79009` |
| destructive | Erro, ação irreversível | <Sw c="#E5484D"/> `#E5484D` |

### Tema escuro

O dark mode não é opcional na tendência atual e vem quase de graça com os tokens. As cores de fundo escurecem e as cores de ação clareiam para manter contraste.

| Token | Papel | Cor |
| --- | --- | --- |
| background | Fundo da página | <Sw c="#0B1220"/> `#0B1220` |
| surface | Fundo de card | <Sw c="#121A2A"/> `#121A2A` |
| foreground | Texto principal | <Sw c="#E6ECF5"/> `#E6ECF5` |
| muted-foreground | Texto secundário | <Sw c="#9AA7BD"/> `#9AA7BD` |
| border | Bordas e divisórias | <Sw c="#22304A"/> `#22304A` |
| primary | Ação principal | <Sw c="#4C8DFF"/> `#4C8DFF` |
| cta | Cor de marca, CTA de conversão | <Sw c="#FF5A76"/> `#FF5A76` |
| wine | Acento em gradientes | <Sw c="#C65C8A"/> `#C65C8A` |
| success | Segurança, confirmação | <Sw c="#3CCB7F"/> `#3CCB7F` |

### Regras de uso da cor

- O azul é o token `primary`, usado em toda ação principal, link e estado ativo.
- O vermelho do Airbnb é um token próprio, `cta`, reservado ao destaque de conversão e à identidade da marca. Ele não é o `accent` do shadcn, que segue neutro e serve apenas a estados sutis como hover de menu.
- O vinho é o token `wine`, usado junto ao `cta` em gradientes e elementos gráficos, como o medalhão da página 404. Não é cor de texto ou de ação isolada.
- O acento de marca aparece em no máximo um elemento por tela em geral, para não competir com o azul de ação.
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

Os tokens vivem no `globals.css` do frontend. O shadcn/ui organiza o tema do Tailwind v4 em duas partes: os valores das cores em `:root` e `.dark`, e o mapeamento para as utilidades no bloco `@theme inline`. As cores usam OKLCH, que é o formato adotado pelo shadcn e dá transições mais uniformes. Exemplo do formato real:

```css
:root {
  --background: oklch(0.979 0.003 264.5); /* #F7F8FA */
  --foreground: oklch(0.264 0.068 255.3); /* #0B2545 */
  --primary: oklch(0.546 0.202 259.6); /* #1668E3 */
  --cta: oklch(0.658 0.231 17.1); /* #FF385C */
  --wine: oklch(0.438 0.161 0.8); /* #92174D */
  --success: oklch(0.686 0.167 154.9); /* #12B76A */
  --radius: 0.75rem;
}

@theme inline {
  --color-primary: var(--primary);
  --color-cta: var(--cta);
  --color-wine: var(--wine);
  --color-success: var(--success);
}
```

Assim, trocar uma cor da marca é mudar um token em um lugar só, e toda a interface acompanha. A conversão de hex para OKLCH é feita por script no momento de definir a paleta.

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
