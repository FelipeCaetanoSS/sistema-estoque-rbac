import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { Role } from '@prisma/client';

process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/estoque?schema=public';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'segredo-local-para-testes';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';

function makeToken(role: Role) {
  return jwt.sign({ role }, process.env.JWT_SECRET as string, {
    subject: `user-${role.toLowerCase()}`
  });
}

describe('RBAC middleware', async () => {
  const { createApp } = await import('../src/app');
  const app = createApp();

  it('returns 200 on public health route', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns 401 when a protected route has no token', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('returns 403 when role does not have the required permission', async () => {
    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${makeToken(Role.USER)}`)
      .send({
        sku: 'SKU-403',
        name: 'Produto bloqueado',
        price: 10,
        categoryName: 'Teste'
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: 'Forbidden',
      required: 'products:create'
    });
  });
});
