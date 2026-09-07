---
sidebar_position: 4
title: Imagens das atrações
---

# Imagens das atrações no roteiro

Status: exploração. O campo já existe no modelo e o card já renderiza imagem quando houver; a origem das imagens ainda será definida durante o desenvolvimento.

## Objetivo

Enriquecer o card de cada atração do roteiro com uma imagem, deixando o planejamento mais visual e reconhecível, sem quebrar quando não houver imagem.

## Modelo de dados

O tipo `Ponto` (frontend em `lib/roteiro/tipos.ts` e backend em `src/roteiro/tipos.ts`) tem o campo opcional:

- `imagemUrl?: string`: URL da imagem da atração.

Sendo opcional, o roteiro segue válido sem imagem. Hoje o gerador não preenche esse campo; ele será preenchido quando a fonte de imagens estiver definida.

## Renderização

- Card na timeline (`components/roteiro/timeline.tsx`): mostra a miniatura quando `imagemUrl` existe; caso contrário, mantém o ícone do tipo de atividade como fallback.
- Evolução possível: imagem maior (capa) na tela de detalhe do ponto.

Observação técnica: a miniatura usa `img` simples em vez de `next/image` porque as URLs virão de domínios externos e variados. Se adotarmos `next/image`, será preciso configurar os domínios remotos permitidos.

## Fontes de imagem a avaliar

1. Google Maps Places (Place Photos)
   - Prós: cobertura ampla e qualidade consistente para pontos turísticos.
   - Contras: custo por requisição, regras de atribuição e de cache da licença, necessidade de chave e de referência ao `place_id`.

2. Webscraper próprio (quando implementado)
   - Prós: controle da fonte e do custo.
   - Contras: fragilidade a mudanças de layout, questões de direitos de uso das imagens, necessidade de cache e de moderação.

## Pontos em aberto

- Direitos de uso e atribuição de cada fonte.
- Onde e por quanto tempo cachear as imagens (URL direta da fonte x cópia própria).
- Momento de resolver a imagem: durante a geração do roteiro ou sob demanda ao abrir o roteiro.
- Fallback visual quando a atração não tiver imagem confiável (hoje é o ícone do tipo).

## Próximos passos

1. Decidir a fonte inicial (provavelmente Google Maps Places para validar rápido).
2. Preencher `imagemUrl` na geração ou em uma etapa de enriquecimento.
3. Reavaliar `next/image` e cache quando a fonte estiver definida.
