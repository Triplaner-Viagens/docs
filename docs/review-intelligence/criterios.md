---
sidebar_position: 3
title: Critérios e Scores
---

# Critérios e Scores

Cada lugar recebe um score de 0 a 100 por critério, calculado a partir do que as reviews públicas dizem. Os critérios aplicados dependem do tipo de lugar: um museu e um restaurante são avaliados por perguntas diferentes. As definições, os léxicos de pré-filtro (português, inglês e espanhol) e os perfis ficam em `config/criteria.yaml`.

## Perfis por categoria

| Perfil | Categorias | Critérios |
| --- | --- | --- |
| default | turismo, natureza, passeios, compras | segurança, iluminação, caminhabilidade |
| gastronomia | gastronomia | os três transversais mais comida, atendimento, custo-benefício, ambiente, higiene, espera, culinária local, acolhimento ao turista, família e acessibilidade |
| vida_noturna | vida noturna | os nove primeiros do perfil gastronomia mais bebidas, música e ambiente, e acolhimento ao turista |

Os três critérios transversais aparecem em todos os perfis porque respondem à pergunta que originou o serviço: o viajante consegue chegar, ficar e sair deste lugar com tranquilidade.

## Definição de cada critério

| Critério | O que mede | O que não mede |
| --- | --- | --- |
| segurança | Sensação de segurança no local e no entorno: assaltos, roubos, policiamento, tranquilidade. | Segurança de equipamentos (brinquedos, embarcações). |
| iluminação | Iluminação pública das ruas e do entorno à noite: postes, calçadas escuras, visibilidade ao chegar e sair. | Show de luzes, iluminação cênica ou decorativa do próprio ponto turístico. Esta exclusão foi adicionada depois de o Marco Zero do Recife receber score alto por causa dos espetáculos de luz. |
| caminhabilidade | Facilidade e conforto de se deslocar a pé: calçadas, distâncias, acessibilidade, terreno. | Trânsito de carros. |
| comida | Sabor, frescor, tempero, apresentação e consistência entre visitas. | Preço (vai para custo-benefício). |
| atendimento | Simpatia, atenção, agilidade, erros no pedido, postura da equipe. | Tempo de espera por mesa (vai para espera). |
| custo-benefício | Relação entre preço e o que é entregue: porções, qualidade pelo valor, taxas, sensação de caro ou justo. | Preço absoluto sem juízo de valor. |
| ambiente | Conforto e atmosfera: decoração, barulho, temperatura, vista, lotação, mesas. | Música ao vivo (vai para música e ambiente no perfil vida noturna). |
| higiene | Limpeza do salão, banheiros, talheres, mesas e cozinha visível; presença de insetos. | |
| espera | Tempo de espera por mesa e pelos pratos, filas, funcionamento de reservas. | |
| bebidas | Qualidade e variedade de drinks, cerveja, vinho e café; temperatura e preço das bebidas. | |
| música e ambiente | Música ao vivo, DJ, volume, estilo, programação e animação do lugar. | |
| culinária local | Presença e autenticidade da culinária regional: pratos típicos, ingredientes da região, receitas tradicionais. | Qualidade em si (vai para comida). |
| acolhimento ao turista | Facilidade para quem não é da cidade: cardápio em outros idiomas, equipe que fala inglês ou espanhol, cartão internacional, clareza de preços, ausência de golpe de turista. | |
| família e acessibilidade | Adequação para crianças, idosos e pessoas com mobilidade reduzida: cadeirão, espaço kids, fraldário, rampa, banheiro acessível, escadas. | Caminhabilidade do entorno. |

Os três últimos formam a segunda onda de critérios de gastronomia e ainda não foram validados com reviews reais; se inflarem o prompt sem ganho, saem do perfil pelo `config/criteria.yaml` sem mudar código.

## Como o score é calculado

1. Cada review relevante gera zero ou mais menções. Uma menção tem critério, polaridade de -1 a 1, intensidade de 0 a 1, confiança de 0 a 1 e uma citação literal.
2. O peso de cada menção é intensidade x confiança x peso de recência, com meia-vida de 365 dias: uma review de dois anos atrás pesa um quarto de uma review recente.
3. O score do critério é a média ponderada da polaridade, mapeada de -1..1 para 0..100. Sem menções o score é nulo.
4. A confiança do score vem do número de menções: alta a partir de 8, média a partir de 4, baixa a partir de 1, insuficiente sem menções.
5. As três citações de maior peso viram a evidência exibida ao usuário.

Menções a critérios fora do perfil do lugar são descartadas, o que impede que o modelo invente um score de comida para uma praia.

## Como ler um score

| Faixa | Leitura |
| --- | --- |
| 70 a 100 | Reviews majoritariamente positivas no critério. |
| 45 a 69 | Sinais mistos ou poucas reviews decisivas. |
| 0 a 44 | Reviews majoritariamente negativas; vale destacar para o viajante. |

O score só deve ser exibido com destaque quando a confiança for média ou alta. Com confiança baixa, o backend deve mostrar a evidência e não o número. O `overallScore` da listagem por cidade é a média dos critérios com confiança média ou alta, e é nulo quando nenhum critério atinge esse patamar.

## Validade

| Categoria | TTL | Motivo |
| --- | --- | --- |
| gastronomia, vida noturna | 90 dias | Troca de chef, de dono ou de cardápio muda o lugar em poucos meses. |
| turismo, natureza, passeios, compras | 180 dias | Segurança e iluminação de um entorno mudam devagar. |

Scores vencidos continuam sendo servidos com `stale: true` enquanto o refresh roda em segundo plano.
