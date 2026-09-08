---
sidebar_position: 2
title: Épicos
---

# Épicos do produto

Este documento reúne os épicos do Triplaner, entendidos como grandes blocos de
funcionalidade que a aplicação deve oferecer. Cada épico descreve o objetivo e
as funcionalidades que o compõem, sem detalhar tarefas de implementação.

Os números servem apenas como referência e não indicam sequência de
desenvolvimento. A prioridade de cada épico está na tabela MoSCoW abaixo.

Para o contexto de negócio, ver [Visão do Produto](./visao-do-produto.md). Para
as regras que orientam a geração, ver [Regras de negócio](./regras-de-negocio.md).

## Priorização (MoSCoW)

O critério combina o laço central do MVP (primeiro manual, depois automático), o
que já está construído e o custo de dependências externas.

| Épico | Prioridade | Situação | Justificativa |
| --- | --- | --- | --- |
| 1 Contas e autenticação | Must | Construído | Base de acesso de todo o produto |
| 3 Definição de filtros do roteiro | Must | Construído | Entrada da geração |
| 4 Geração automática de roteiro | Must | Construído | Coração do produto |
| 5 Gestão de roteiros | Must | Construído | Sem edição o roteiro não se sustenta |
| 13 Perfil e conta | Must (mínimo) | Mock | Ver dados da conta e encerrar sessão são básicos |
| 2 Descoberta de destinos | Should | Mock | Porta de entrada, backend simples |
| 6 Detalhe de ponto de interesse | Should | Parcial | Depende do modelo relacional do roteiro |
| 7 Visualização em mapa | Should | Tela | Alto valor visual sobre dados existentes |
| 10 Compartilhamento de roteiro | Should | Endpoint inicial | Fase A por impressão e link é barata |
| 12 Preferências de viagem | Should | Mock | Alimenta a geração de novos roteiros |
| 8 Módulo de segurança | Could | Não iniciado | Diferencial de produto, mas depende de fonte externa incerta |
| 9 Integração de hospedagem | Could | Mock | Depende de fonte externa; Fase A pode ser manual |
| 14 Configurações e notificações | Could | Mock | Exige infraestrutura de envio de email e push |
| 11 Assistente virtual | Won't (agora) | Não iniciado | Diferencial premium previsto para fase posterior |

## Épico 1: Contas e autenticação

Permitir que a pessoa crie e acesse sua conta com segurança.

- Cadastro de conta com email e senha.
- Login e logout.
- Recuperação de senha: solicitar redefinição e definir nova senha por token.
- Sessão baseada em token de acesso com renovação automática.
- Proteção das áreas internas do app atrás de autenticação.

## Épico 2: Descoberta de destinos

Ajudar a pessoa a escolher para onde viajar e iniciar um roteiro a partir daí.

- Busca de destinos por termo.
- Destaques de destinos na tela inicial.
- Cartão de destino que inicia a criação de um roteiro já com o destino preenchido.

## Épico 3: Definição de filtros do roteiro

Capturar as preferências que orientam a geração do roteiro.

- Destino e intervalo da viagem (data de início e fim).
- Meio de locomoção (a pé, carro, transporte público, bicicleta).
- Tipos de atividade e interesses (gastronomia, cultura, natureza e outros).
- Ritmo desejado do roteiro.
- Janela diária: horário de começo e de retorno.
- Pausas para descanso e margem de erro entre atividades.

## Épico 4: Geração automática de roteiro

Montar um roteiro cronometrado a partir dos filtros.

- Encaixe de atividades, pausas e deslocamentos dentro da janela diária.
- Distribuição das atividades ao longo dos dias da viagem.
- Validação da janela diária mínima antes de gerar.
- Feedback de progresso enquanto o roteiro é montado.
- Proposta a explorar: modo de sugestões para dias curtos, quando a janela é
  menor que o mínimo (ver [Regras de negócio](./regras-de-negocio.md)).

## Épico 5: Gestão de roteiros

Permitir consultar e ajustar os roteiros gerados.

- Listagem dos roteiros da pessoa.
- Visualização do roteiro por dia, com atividades e horários.
- Edição do roteiro: reordenar, remover pontos e ajustar horário e duração.
- Salvar as alterações do roteiro.

## Épico 6: Detalhe de ponto de interesse

Dar contexto sobre cada local do roteiro.

- Informações do ponto: nome, endereço e tipo de atividade.
- Localização por coordenadas para uso no mapa.

## Épico 7: Visualização em mapa

Mostrar o roteiro espacialmente.

- Exibição dos pontos do roteiro no mapa.
- Seleção de um ponto e centralização no mapa.
- Exibição de endereço e nome do ponto selecionado.

## Épico 8: Módulo de segurança

Classificar a segurança dos locais e orientar escolhas mais seguras.

- Classificação de segurança dos locais (seguro, atenção, evitar).
- Sinalização de áreas a evitar.
- Preferência por rotas mais amigáveis.
- Favorecimento de roteiros adequados para famílias.

## Épico 9: Integração de hospedagem

Aproximar a escolha de estadia do roteiro planejado.

- Sugestões de estadias próximas aos pontos do roteiro.
- Detalhe da estadia: tipo e preço.
- Alinhamento geográfico das sugestões com os pontos de interesse.

## Épico 10: Compartilhamento de roteiro

Permitir mostrar o roteiro para outras pessoas.

- Geração de link para compartilhar um roteiro.

## Épico 11: Assistente virtual

Oferecer uma via conversacional para montar o roteiro.

- Chatbot que coleta as necessidades da pessoa em linguagem natural.
- Preenchimento automático de parte dos parâmetros do roteiro a partir da conversa.
- Ajuste do restante pela interface. Diferencial premium previsto para fase posterior.

## Épico 12: Preferências de viagem

Guardar gostos gerais que alimentam a geração.

- Interesses e tipos de atividade preferidos.
- Ritmo padrão de viagem.
- Reuso dessas preferências ao criar novos roteiros.

## Épico 13: Perfil e conta

Centralizar os dados e acessos da pessoa.

- Visualização dos dados da conta.
- Acesso a preferências e configurações.
- Encerrar a sessão.

## Épico 14: Configurações e notificações

Dar controle sobre como o produto se comunica.

- Notificações por email.
- Notificações push.
- Resumo semanal.
