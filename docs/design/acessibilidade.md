---
sidebar_position: 3
title: Acessibilidade
---

# Acessibilidade

O objetivo é atender o WCAG 2.2 no nível AA no que for viável, tratando acessibilidade como parte do design, não como ajuste posterior. Esta seção traz o checklist prático que orienta cada tela e componente.

## Por que WCAG 2.2 AA

O nível AA é o padrão de referência para produtos web e cobre a maior parte das necessidades reais de pessoas com baixa visão, daltonismo, limitação motora ou que dependem de teclado e leitor de tela. A versão 2.2 acrescenta critérios importantes de foco e de tamanho de alvo, que já entram no nosso sistema desde o início.

## Contraste

| Elemento | Contraste mínimo |
| --- | --- |
| Texto normal | 4.5:1 |
| Texto grande, a partir de 24px ou 19px em negrito | 3:1 |
| Componentes de interface e indicador de foco | 3:1 |

A paleta da identidade visual foi pensada para respeitar esses valores nos dois temas. Cor nunca é o único meio de informar. Estados como segurança de um local usam cor mais ícone mais rótulo.

## Foco visível

Critérios novos do WCAG 2.2 que seguimos:

- O indicador de foco tem no mínimo 2px de espessura ao redor do componente e contraste de ao menos 3:1 entre o estado com foco e sem foco.
- O elemento com foco não fica escondido atrás de barras fixas ou painéis. Nada de foco coberto por header ou rodapé colado.
- A ordem de foco segue a ordem visual e lógica da tela.

## Tamanho de alvo

- Alvos de toque têm no mínimo 24x24px, conforme o critério de nível AA. Onde há espaço, usamos 44x44px, que é o conforto real no celular.
- Alvos pequenos só são aceitos quando têm espaçamento suficiente entre eles.

## Teclado e leitor de tela

- Tudo que funciona com o mouse funciona com o teclado. Nada depende só de passar o cursor.
- HTML semântico primeiro. Usamos o elemento certo, `button`, `nav`, `main`, `label`, antes de recorrer a ARIA.
- ARIA entra apenas para preencher lacunas, como rotular um controle sem texto visível ou anunciar mudanças dinâmicas.
- Mudanças assíncronas relevantes, como o fim da geração do roteiro, são anunciadas por região viva para o leitor de tela.
- Link de pular para o conteúdo no topo, para quem navega por teclado não repetir o menu toda vez.

## Formulários

- Todo campo tem rótulo associado, não apenas um placeholder.
- Erro identificado em texto, ligado ao campo, com instrução de correção.
- Agrupamento e ordem lógicos, com foco levado ao primeiro campo com erro no envio.

## Conteúdo visual e movimento

- Toda imagem informativa tem texto alternativo. Imagem decorativa é marcada como tal para o leitor de tela ignorar.
- `prefers-reduced-motion` desliga animações não essenciais.
- Nenhum conteúdo pisca de forma que possa causar desconforto ou risco.

## Como verificamos

- Checagem automática com eslint de acessibilidade e auditoria no navegador durante o desenvolvimento.
- Teste manual de navegação só por teclado em cada fluxo novo.
- Revisão de contraste dos tokens sempre que a paleta mudar.

A automação pega parte dos problemas, mas não todos. Por isso o teste manual de teclado e a revisão de contraste continuam no fluxo.

## Fontes desta pesquisa

- [What to Expect From WCAG 2.2 (Deque)](https://www.deque.com/blog/what-to-expect-from-wcag-2-2/)
- [New Success Criteria in WCAG 2.2 (Vispero)](https://vispero.com/resources/new-success-criteria-in-wcag22/)
- [WCAG 2.2 Overview (WebAIM)](https://webaim.org/blog/wcag-2-2-overview-and-feedback/)
