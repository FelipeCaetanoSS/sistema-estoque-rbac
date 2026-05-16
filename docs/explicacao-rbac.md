# Explicacao didatica: como o RBAC funciona neste projeto

## 1. Autenticacao: quem e o usuario?

Autenticacao responde: "quem esta fazendo a requisicao?".

No login, a API procura o usuario pelo email e compara a senha enviada com o `passwordHash` salvo no banco. Se estiver correto, ela gera um JWT com duas informacoes importantes:

- `sub`: id do usuario
- `role`: papel do usuario, como `ADMIN`, `EDITOR` ou `USER`

Depois disso, o cliente envia esse token no header:

```http
Authorization: Bearer SEU_TOKEN
```

O middleware `authenticate` valida o token e coloca o usuario em `req.user`.

## 2. Autorizacao: o que o usuario pode fazer?

Autorizacao responde: "esse usuario tem permissao para executar esta acao?".

Esse projeto nao espalha regras soltas nas controllers. Em vez disso, existe um mapa central:

```ts
ADMIN  -> users:manage, products:create, products:delete...
EDITOR -> products:create, products:update, stock:in...
USER   -> products:read, stock:read
```

Quando uma rota precisa de uma permissao, ela declara isso diretamente:

```ts
router.post(
  '/products',
  authenticate,
  requirePermission('products:create'),
  productsController.create
);
```

Assim fica facil ler a rota e entender a regra.

## 3. Fluxo completo de uma rota protegida

Exemplo: `POST /products`.

1. O cliente envia o JWT.
2. `authenticate` valida o token.
3. `authenticate` adiciona `{ id, role }` em `req.user`.
4. `requirePermission('products:create')` consulta o mapa de permissoes.
5. Se o role tiver a permissao, a controller roda.
6. Se nao tiver token, a API retorna `401 Unauthorized`.
7. Se tiver token mas nao tiver permissao, retorna `403 Forbidden`.

## 4. Diferenca entre 401 e 403

`401 Unauthorized` significa: "nao sei quem voce e". Normalmente acontece quando nao existe token ou o token e invalido.

`403 Forbidden` significa: "sei quem voce e, mas voce nao pode fazer isso". Exemplo: usuario `USER` tentando criar produto.

## 5. Por que roles e permissoes ficam separados?

O role e o cargo do usuario. A permissao e uma capacidade especifica.

Isso evita regras duplicadas. Se amanha o `EDITOR` tambem puder ver relatorios, voce adiciona `reports:view` ao role `EDITOR` em um unico arquivo, sem mexer nas controllers.

## 6. Estoque e historico

Entradas e saidas de estoque usam transacao no Prisma. A API cria uma movimentacao e atualiza a quantidade do produto dentro da mesma operacao logica.

Isso e importante porque o historico responde:

- qual produto mudou
- se foi entrada ou saida
- qual quantidade mudou
- quem fez a acao
- quando aconteceu

Esse historico so pode ser listado por quem tem `reports:view`.
