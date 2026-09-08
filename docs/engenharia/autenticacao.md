---
sidebar_position: 3
title: Autenticação
---

# Autenticação

Esta seção descreve o módulo de autenticação do backend (NestJS), pensada para quem ainda não conhece a fundo o framework. A ideia é que qualquer pessoa da dupla consiga ler, entender e mexer no código com segurança.

## Visão geral

O backend expõe quatro rotas de autenticação, todas sob o prefixo `/auth`:

| Rota | Método | Público | O que faz |
| --- | --- | --- | --- |
| `/auth/register` | POST | sim | Cria a conta, já autentica e devolve os tokens |
| `/auth/login` | POST | sim | Valida email e senha e devolve os tokens |
| `/auth/refresh` | POST | via cookie | Troca o refresh por um par novo de tokens |
| `/auth/logout` | POST | via cookie | Revoga o refresh salvo no banco |

O modelo de sessão usa dois tokens JWT: um `access` de vida curta (15 minutos) e um `refresh` de vida longa (7 dias). O `access` vai no corpo da resposta para o frontend guardar em memória. O `refresh` nunca aparece no corpo, ele viaja apenas em um cookie `HttpOnly`, que o JavaScript da página não consegue ler.

## Conceitos do NestJS usados aqui

O Nest organiza o código em peças com papéis bem definidos. Entender esses papéis é o suficiente para ler o módulo de Auth.

| Peça | Papel | Analogia |
| --- | --- | --- |
| Module | Agrupa e conecta um conjunto de funcionalidades | A pasta que junta tudo de um assunto |
| Controller | Recebe a requisição HTTP e devolve a resposta | O balcão de atendimento |
| Service | Contém a regra de negócio | Quem faz o trabalho nos bastidores |
| Provider | Qualquer classe que o Nest sabe injetar em outra | Peça reaproveitável |
| Guard | Decide se a requisição pode passar antes de chegar no controller | O segurança na porta |
| Strategy | Ensina o Passport a extrair e validar um token | O manual de conferência do crachá |
| Decorator | Anotação com `@` que adiciona comportamento | Um adesivo com instruções |
| Pipe | Transforma e valida os dados que entram | O filtro na entrada |

Um conceito central é a **injeção de dependência**: em vez de uma classe criar as outras de que precisa, ela declara no construtor o que quer, e o Nest entrega pronto. Por exemplo, `AuthService` pede `UsersService`, `JwtService` e `ConfigService` no construtor, e o Nest resolve isso sozinho. Isso deixa o código fácil de testar, porque nos testes trocamos a peça real por uma falsa.

## Prisma e o banco de dados

O **Prisma** é o ORM do projeto, a camada que conversa com o Postgres sem precisar escrever SQL na mão. Ele parte de um arquivo de schema onde declaramos as tabelas como modelos.

O único modelo hoje é o usuário:

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  refreshHash String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Pontos importantes:

- `password` guarda o **hash** da senha, nunca a senha em texto.
- `refreshHash` guarda o hash do refresh token atual. É isso que permite revogar a sessão: se o campo estiver vazio, nenhum refresh é aceito.
- `email` é único, o banco impede duas contas com o mesmo email.

O acesso ao banco acontece pelo `PrismaService`, um provider que abre a conexão quando a aplicação sobe e fecha quando ela encerra. O `UsersService` usa esse serviço e expõe apenas o que o Auth precisa: `findByEmail`, `findById`, `create` e `update`. Assim, a regra de negócio nunca fala com o Prisma diretamente, ela fala com o `UsersService`.

Mudanças na estrutura do banco são versionadas em **migrations**. A migration inicial cria a tabela `User`. Para aplicar as migrations em um banco novo, rodamos `prisma migrate deploy`.

## Fluxo de registro e login

Toda requisição passa pela mesma sequência antes de chegar na regra de negócio:

```
Requisição
  -> ThrottlerGuard      (limita a quantidade de chamadas)
  -> JwtAccessGuard      (exige token, exceto em rotas marcadas como públicas)
  -> ValidationPipe      (valida o corpo contra o DTO)
  -> Controller          (chama o Service)
  -> Service             (regra de negócio, banco, hash, JWT)
  -> resposta: { access } no corpo + cookie HttpOnly com o refresh
```

No **registro**, o `AuthService` verifica se o email já existe, cria o usuário com a senha já hasheada e emite o par de tokens.

No **login**, o serviço busca o usuário pelo email, confere a senha contra o hash salvo e, se bater, emite o par de tokens. A mensagem de erro é sempre genérica ("credenciais inválidas"), sem dizer se foi o email ou a senha que estava errado, para não ajudar um atacante.

A emissão de tokens (`issueTokens`) assina o `access` e o `refresh`, salva o hash do refresh no banco e devolve os dois. Como o hash do refresh é regravado a cada emissão, o refresh anterior deixa de valer. Isso é a **rotação** de tokens.

## Tokens: access e refresh

| Token | Onde fica | Validade | Para que serve |
| --- | --- | --- | --- |
| access | Memória do frontend, enviado no header `Authorization: Bearer` | 15 min | Autorizar as chamadas do dia a dia |
| refresh | Cookie `HttpOnly` no caminho `/auth` | 7 dias | Obter um novo access sem refazer login |

A separação existe por segurança. O `access` é curto para que, se vazar, valha por pouco tempo. O `refresh` é longo, mas fica em um cookie que o JavaScript não lê e cujo hash está guardado no banco, então dá para revogá-lo a qualquer momento. O `logout` faz exatamente isso: zera o `refreshHash`, e a partir daí o refresh guardado no cookie não vale mais, mesmo que alguém o tenha copiado.

## Guards e Strategies

O projeto usa o Passport com duas estratégias de JWT.

A **estratégia de access** (`jwt-access`) lê o token do header `Authorization: Bearer`. Ela é aplicada por um guard **global**, o `JwtAccessGuard`, registrado uma vez no módulo. Ser global significa que, por padrão, **toda rota exige token**. As rotas de login e registro escapam disso com o decorator `@Public()`.

A **estratégia de refresh** (`jwt-refresh`) lê o token do cookie `refresh`, não do header. Ela é aplicada apenas onde faz sentido, com `@UseGuards(JwtRefreshGuard)` em `/auth/refresh` e `/auth/logout`. Se o cookie não vier, ou for inválido, o guard barra a requisição antes de chegar no controller.

Depois que a estratégia valida o token, o conteúdo do JWT (o `payload`, que traz o id e o email do usuário) fica anexado à requisição. É esse dado, já verificado, que o controller lê em seguida.

## Decorators do Auth

Foram criados dois decorators próprios:

- **`@Public()`**: marca uma rota como aberta. O guard global de access olha essa marca e, quando presente, deixa passar sem exigir token. É como colocar um aviso de "entrada livre" na porta.

- **`@CurrentUser()`**: entrega ao controller o usuário já validado pela estratégia, sem precisar mexer no objeto da requisição na mão. Pode devolver o objeto inteiro (`@CurrentUser()`) ou só um campo (`@CurrentUser('sub')` devolve o id). O guard confirma que o crachá é válido, e esse decorator apenas lê o nome escrito nele para a regra de negócio usar, por exemplo para saber de qual usuário limpar o `refreshHash` no logout.

## Validação de ambiente (env.validation)

As variáveis de ambiente (URL do banco, segredos dos JWT, origem do frontend) são conferidas **no momento em que a aplicação sobe**, não no meio de uma requisição.

O arquivo `env.validation.ts` descreve o formato esperado e o Nest roda essa checagem no boot. Se algo estiver faltando ou errado, a aplicação nem inicia e mostra qual variável é o problema. O que ele garante:

- `DATABASE_URL` e `FRONTEND_ORIGIN` presentes e não vazios.
- `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` com no mínimo 16 caracteres, para evitar segredo fraco.
- `NODE_ENV` sendo um valor válido (`development`, `production` ou `test`).

O ganho prático é transformar um erro silencioso, que apareceria confuso e tarde em produção, em um erro claro logo na inicialização.

## Segurança aplicada

| Medida | O que resolve |
| --- | --- |
| Hash de senha com argon2 | Senha nunca é guardada em texto; vazamento do banco não expõe senhas |
| Refresh salvo como hash | Permite revogar sessão e não expõe o token mesmo se o banco vazar |
| Cookie `HttpOnly` no refresh | JavaScript da página não consegue ler o refresh, reduz risco de XSS |
| Resposta de erro genérica no login | Não revela se o email existe |
| Verificação de tempo constante no login | Mesmo quando o email não existe, um hash descartável é conferido para o tempo de resposta não denunciar contas válidas |
| Rate limit (throttler) | Limita tentativas; o login tem um limite mais rígido (5 por minuto) contra força bruta |
| `ValidationPipe` com whitelist | Rejeita campos não esperados no corpo e valida os DTOs |
| helmet | Adiciona cabeçalhos HTTP de segurança nas respostas |
| CORS com origem restrita | Só o frontend configurado pode chamar a API com credenciais |

## Como rodar localmente

Para testar sem frontend e sem um banco em nuvem, sobe-se um Postgres local com Docker. O `docker-compose.yml` do backend já define esse banco.

```bash
docker compose up -d

DATABASE_URL="postgresql://triplaner:triplaner@localhost:5433/triplaner" \
  npx prisma migrate deploy

DATABASE_URL="postgresql://triplaner:triplaner@localhost:5433/triplaner" \
  npm run start:dev
```

Com a API no ar, dá para exercitar o fluxo com `curl`, guardando o cookie em um arquivo:

```bash
curl -i -c cookies.txt -X POST http://localhost:3333/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"voce@triplaner.com","password":"Password1"}'

curl -i -c cookies.txt -X POST http://localhost:3333/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"voce@triplaner.com","password":"Password1"}'

curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3333/auth/refresh
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3333/auth/logout
```

Para encerrar, `docker compose down` para o banco (use `-v` para apagar os dados).

## Testes e pipeline

O módulo tem duas camadas de teste:

- **Unitários** (`auth.service.spec.ts`): testam a regra de negócio do serviço com as dependências trocadas por versões falsas, sem banco real.
- **End to end** (`auth.e2e-spec.ts`): sobem a aplicação de verdade e batem nas rotas, usando um Prisma em memória, então também rodam sem banco.

A qualidade é garantida em dois momentos:

- **No commit (local)**: um hook do husky roda o lint-staged, que aplica ESLint e Prettier apenas nos arquivos alterados. Commit rápido e código sempre formatado.
- **No push e nos pull requests (CI)**: o GitHub Actions roda a sequência completa em uma máquina limpa: instala dependências, gera o Prisma, checa lint e tipos, faz o build e roda os testes unitários e e2e.

Assim, os erros aparecem cedo, na máquina de quem escreveu, e não no ambiente do outro membro ou em produção.
