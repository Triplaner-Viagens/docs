---
sidebar_position: 2
title: Princípios de UX
---

# Princípios de UX

Esta seção reúne as diretrizes de experiência que valem para toda tela do Triplaner: as heurísticas de Nielsen aplicadas ao produto, a política de mensagens de erro e o uso de animações.

## Heurísticas de Nielsen aplicadas

As dez heurísticas de usabilidade de Nielsen são o checklist de sanidade de cada tela. Abaixo, cada uma com o que significa na prática do Triplaner.

| Heurística | Como aplicamos |
| --- | --- |
| Visibilidade do estado do sistema | Skeleton ao carregar o roteiro, indicador de progresso na geração, feedback imediato em cada ação |
| Correspondência com o mundo real | Linguagem de viagem, não de sistema. "Roteiro", "pausa", "deslocamento", "área a evitar" |
| Controle e liberdade do usuário | Desfazer edições no roteiro, sair de um fluxo sem perder dados, fechar painéis com facilidade |
| Consistência e padrões | Componentes do shadcn reutilizados, mesma posição de busca e filtros das referências de viagem |
| Prevenção de erros | Validação antes de enviar, confirmação em ações irreversíveis, campos com formato claro |
| Reconhecer em vez de lembrar | Filtros visíveis, sugestões, histórico de buscas, o usuário não precisa decorar nada |
| Flexibilidade e eficiência | Caminho rápido para o turista prático e caminho guiado para quem quer detalhar |
| Estética e design minimalista | Um acento por tela, respiro, só a informação que importa em cada card |
| Ajudar a reconhecer e recuperar de erros | Mensagem clara do que aconteceu e do próximo passo, sem jargão técnico |
| Ajuda e documentação | Textos de apoio curtos onde surge dúvida, além desta documentação |

## Mensagens de erro

A regra é separar o que o usuário vê do que o sistema registra.

- Para o usuário, a mensagem é genérica, calma e orientada a ação. Ela diz o que fazer, não expõe detalhe interno.
- Para o log, o erro é específico e completo, para o time depurar.

O motivo é duplo. De segurança, uma mensagem genérica não entrega pista a um atacante, exatamente como no login do backend, que responde "credenciais inválidas" sem dizer se o email existe. De experiência, uma mensagem sem jargão não assusta quem não é técnico.

| Situação | O usuário vê | O log registra |
| --- | --- | --- |
| Falha de login | Credenciais inválidas | Email não encontrado ou hash divergente, com id de requisição |
| Falha de rede | Não foi possível conectar. Tente de novo em instantes | Timeout ou status HTTP, endpoint, id de requisição |
| Erro inesperado | Algo deu errado do nosso lado. Já estamos vendo isso | Stack trace, contexto, id de requisição |

Padrões de apresentação:

- Erro de campo aparece junto ao campo, com texto e ícone, não só cor.
- Erro de operação aparece em toast ou faixa, sempre com uma ação de recuperação quando existir.
- Toda mensagem de erro exibida carrega um id de requisição discreto, para o suporte cruzar com o log.

## Animações

Animação no Triplaner é funcional, não decorativa. Ela confirma uma ação, guia a atenção ou suaviza uma transição.

Diretrizes:

- Duração curta, entre 150ms e 250ms, com curva ease-out para entradas.
- Movimento sutil. Fade e leve deslocamento, nada de saltos ou giros longos.
- Cada animação tem um propósito: feedback de clique, entrada de card, transição de painel, aparição do skeleton.
- Respeitar a preferência do sistema. Quando `prefers-reduced-motion` estiver ativo, as animações não essenciais são desligadas. Isso é também um requisito de acessibilidade.

Para microinterações simples, a transição do próprio Tailwind resolve. Para transições de layout mais ricas, como reordenar pontos do roteiro, será avaliada uma biblioteca de animação dedicada. Qualquer dependência nova passa antes por checagem de vulnerabilidades e aprovação, conforme as regras do projeto.
