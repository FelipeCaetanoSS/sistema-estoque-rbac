# Sistema de Estoque RBAC API

API REST para controle de estoque com autenticação JWT, autorização por RBAC e documentação OpenAPI/Swagger.

![Swagger da API](docs/swagger-preview.svg)

## Visão Geral

Este projeto demonstra uma API de estoque com separação clara entre autenticação, autorização e regras de negócio. O usuário faz login, recebe um token JWT e acessa as rotas protegidas de acordo com as permissões vinculadas ao seu papel (`ADMIN`, `EDITOR` ou `USER`).

O foco principal é mostrar uma implementação organizada de RBAC, mantendo as permissões centralizadas e as rotas declarando explicitamente quais capacidades são necessárias para cada ação.

## Funcionalidades

- Cadastro e login de usuários com senha criptografada.
- Autenticação via Bearer Token JWT.
- Autorização por roles e permissões granulares.
- CRUD de produtos com controle de acesso.
- Entrada e saída de estoque com histórico de movimentações.
- Consulta de usuários e alteração de role para administradores.
- Validação de payloads com Zod.
- ORM Prisma com PostgreSQL.
- Documentação interativa com Swagger UI.
- Testes de integração com Vitest e Supertest.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js |
| Linguagem | TypeScript |
| HTTP | Express |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Autenticação | JWT + bcrypt |
| Validação | Zod |
| Documentação | Swagger/OpenAPI |
| Testes | Vitest + Supertest |
| Infra local | Docker Compose |

## Arquitetura

```text
src/
├── auth/                 # Login, cadastro, schemas e geração de JWT
├── config/               # Variáveis de ambiente e Prisma Client
├── docs/                 # Documento OpenAPI
├── middlewares/          # Autenticação, async handler e erros
├── modules/
│   ├── products/         # Produtos
│   ├── stock/            # Estoque e movimentações
│   └── users/            # Usuários e alteração de roles
└── rbac/                 # Permissões, roles e middleware de autorização
```

## Modelo RBAC

As permissões ficam centralizadas em `src/rbac/rolePermissions.ts`.

| Role | Permissões |
| --- | --- |
| `ADMIN` | Gerencia usuários, produtos, estoque e relatórios |
| `EDITOR` | Cria e edita produtos, registra entradas/saídas e consulta estoque |
| `USER` | Consulta produtos e estoque |

Exemplo de proteção de rota:

```ts
router.post(
  '/products',
  authenticate,
  requirePermission('products:create'),
  productsController.create
);
```

## Pré-requisitos

- Node.js 20 ou superior.
- Docker e Docker Compose.
- npm.

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Suba o PostgreSQL:

```bash
docker compose up -d
```

4. Aplique as migrations:

```bash
npm run prisma:migrate
```

5. Popule o banco com dados iniciais:

```bash
npm run seed
```

6. Rode a API em desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

## Documentação da API

| Recurso | URL |
| --- | --- |
| Swagger UI | `http://localhost:3000/docs` |
| OpenAPI JSON | `http://localhost:3000/docs.json` |
| Health check | `http://localhost:3000/health` |

## Usuários do Seed

| Email | Senha | Role |
| --- | --- | --- |
| `admin@estoque.local` | `123456` | `ADMIN` |
| `editor@estoque.local` | `123456` | `EDITOR` |
| `user@estoque.local` | `123456` | `USER` |

## Endpoints

### Autenticação

| Método | Rota | Acesso |
| --- | --- | --- |
| `POST` | `/auth/register` | Público |
| `POST` | `/auth/login` | Público |

### Produtos

| Método | Rota | Permissão |
| --- | --- | --- |
| `GET` | `/products` | `products:read` |
| `GET` | `/products/:id` | `products:read` |
| `POST` | `/products` | `products:create` |
| `PUT` | `/products/:id` | `products:update` |
| `DELETE` | `/products/:id` | `products:delete` |

### Estoque

| Método | Rota | Permissão |
| --- | --- | --- |
| `GET` | `/stock/:productId` | `stock:read` |
| `POST` | `/stock/:productId/in` | `stock:in` |
| `POST` | `/stock/:productId/out` | `stock:out` |
| `GET` | `/stock/movements` | `reports:view` |

### Usuários

| Método | Rota | Permissão |
| --- | --- | --- |
| `GET` | `/users` | `users:manage` |
| `PATCH` | `/users/:id/role` | `users:manage` |

## Exemplo de Uso

Faça login com o usuário administrador:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@estoque.local\",\"password\":\"123456\"}"
```

Use o token retornado para acessar rotas protegidas:

```bash
curl http://localhost:3000/products \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia a API em modo desenvolvimento |
| `npm run build` | Compila o TypeScript para `dist` |
| `npm start` | Executa a versão compilada |
| `npm run typecheck` | Verifica tipos sem gerar build |
| `npm run lint` | Executa o ESLint |
| `npm test` | Roda os testes com Vitest |
| `npm run test:watch` | Roda os testes em modo watch |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Aplica migrations no banco |
| `npm run seed` | Cria usuários e produto inicial |

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DATABASE_URL` | URL de conexão do PostgreSQL | `postgresql://postgres:postgres@localhost:5432/estoque?schema=public` |
| `JWT_SECRET` | Segredo usado para assinar tokens JWT | `troque-este-segredo` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `1d` |
| `PORT` | Porta HTTP da API | `3000` |

## Testes

```bash
npm test
```

Os testes de integração validam o fluxo de autenticação e autorização, incluindo respostas `401` para usuários não autenticados e `403` para usuários autenticados sem a permissão necessária.

## Material Complementar

Existe uma explicação didática sobre o RBAC deste projeto em:

```text
docs/explicacao-rbac.md
```
