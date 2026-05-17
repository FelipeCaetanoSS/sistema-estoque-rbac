# Sistema de Estoque com RBAC

API de controle de estoque feita com Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT e bcrypt. O foco do projeto e estudar RBAC: o usuario se autentica uma vez, recebe um token JWT e cada rota protegida verifica se o role desse usuario possui a permissao exigida.

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 22 |
| Linguagem | TypeScript 5 |
| HTTP | Express 4 |
| ORM | Prisma 5 |
| Banco | PostgreSQL 16 |
| Auth | JWT + bcrypt |
| Validacao | Zod |
| Docs | Swagger/OpenAPI |

## Como rodar

```bash
npm install
cp .env.example .env
docker compose up -d
npm run prisma:migrate
npm run seed
npm run dev
```

A API sobe em `http://localhost:3000`.

Documentacao Swagger:

| Recurso | URL |
|---|---|
| Swagger UI | `http://localhost:3000/docs` |
| OpenAPI JSON | `http://localhost:3000/docs.json` |

Usuarios criados pelo seed:

| Email | Senha | Role |
|---|---|---|
| `admin@estoque.local` | `123456` | `ADMIN` |
| `editor@estoque.local` | `123456` | `EDITOR` |
| `user@estoque.local` | `123456` | `USER` |

## Endpoints

| Metodo | Rota | Permissao |
|---|---|---|
| `POST` | `/auth/register` | publica |
| `POST` | `/auth/login` | publica |
| `GET` | `/products` | `products:read` |
| `GET` | `/products/:id` | `products:read` |
| `POST` | `/products` | `products:create` |
| `PUT` | `/products/:id` | `products:update` |
| `DELETE` | `/products/:id` | `products:delete` |
| `GET` | `/stock/movements` | `reports:view` |
| `GET` | `/stock/:productId` | `stock:read` |
| `POST` | `/stock/:productId/in` | `stock:in` |
| `POST` | `/stock/:productId/out` | `stock:out` |
| `GET` | `/users` | `users:manage` |
| `PATCH` | `/users/:id/role` | `users:manage` |

## Exemplo rapido

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@estoque.local\",\"password\":\"123456\"}"
```

Use o token retornado:

```bash
curl http://localhost:3000/products \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | roda a API em modo desenvolvimento |
| `npm run build` | compila TypeScript para `dist` |
| `npm run typecheck` | valida tipos sem compilar |
| `npm test` | roda testes com Vitest |
| `npm run prisma:migrate` | aplica migrations no banco |
| `npm run seed` | cria usuarios e produto inicial |
