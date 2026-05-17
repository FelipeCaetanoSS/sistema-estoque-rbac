import { z } from 'zod';
import { Role } from '@prisma/client';
import { loginSchema, registerSchema } from '../auth/schemas';
import { createProductSchema, updateProductSchema } from '../modules/products/schemas';
import { movementSchema } from '../modules/stock/schemas';
import { updateRoleSchema } from '../modules/users/schemas';

function zodToOpenApiSchema(schema: z.ZodType) {
  return z.toJSONSchema(schema, {
    target: 'openapi-3.0',
    io: 'input'
  });
}

const idParam = (name: string, description: string) => ({
  name,
  in: 'path',
  required: true,
  description,
  schema: {
    type: 'string',
    format: 'uuid'
  }
});

const jsonRequest = (schema: unknown) => ({
  required: true,
  content: {
    'application/json': {
      schema
    }
  }
});

const jsonResponse = (description: string, schema?: unknown) => ({
  description,
  ...(schema
    ? {
        content: {
          'application/json': {
            schema
          }
        }
      }
    : {})
});

const errorResponses = {
  validation: jsonResponse('Validation error', { $ref: '#/components/schemas/ValidationErrorResponse' }),
  unauthorized: jsonResponse('Unauthorized', { $ref: '#/components/schemas/ErrorResponse' }),
  forbidden: jsonResponse('Forbidden', { $ref: '#/components/schemas/ForbiddenResponse' }),
  notFound: jsonResponse('Not found', { $ref: '#/components/schemas/ErrorResponse' }),
  conflict: jsonResponse('Conflict', { $ref: '#/components/schemas/ErrorResponse' }),
  internal: jsonResponse('Internal server error', { $ref: '#/components/schemas/ErrorResponse' })
};

const authenticated = [{ bearerAuth: [] }];

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Sistema de Estoque RBAC API',
    version: '1.0.0',
    description: 'API de controle de estoque com autenticacao JWT e autorizacao RBAC.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development'
    }
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Products' },
    { name: 'Stock' },
    { name: 'Users' }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          200: jsonResponse('API is healthy', {
            type: 'object',
            required: ['status'],
            properties: {
              status: { type: 'string', example: 'ok' }
            }
          }),
          500: errorResponses.internal
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a user',
        requestBody: jsonRequest(zodToOpenApiSchema(registerSchema)),
        responses: {
          201: jsonResponse('User registered', { $ref: '#/components/schemas/AuthResponse' }),
          400: errorResponses.validation,
          409: errorResponses.conflict,
          500: errorResponses.internal
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: jsonRequest(zodToOpenApiSchema(loginSchema)),
        responses: {
          200: jsonResponse('User authenticated', { $ref: '#/components/schemas/AuthResponse' }),
          400: errorResponses.validation,
          401: errorResponses.unauthorized,
          500: errorResponses.internal
        }
      }
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        description: 'Requires permission products:read.',
        security: authenticated,
        'x-permission': 'products:read',
        responses: {
          200: jsonResponse('Products list', {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          }),
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          500: errorResponses.internal
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create product',
        description: 'Requires permission products:create.',
        security: authenticated,
        'x-permission': 'products:create',
        requestBody: jsonRequest(zodToOpenApiSchema(createProductSchema)),
        responses: {
          201: jsonResponse('Product created', { $ref: '#/components/schemas/Product' }),
          400: errorResponses.validation,
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      }
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by id',
        description: 'Requires permission products:read.',
        security: authenticated,
        'x-permission': 'products:read',
        parameters: [idParam('id', 'Product id')],
        responses: {
          200: jsonResponse('Product found', { $ref: '#/components/schemas/Product' }),
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Update product',
        description: 'Requires permission products:update.',
        security: authenticated,
        'x-permission': 'products:update',
        parameters: [idParam('id', 'Product id')],
        requestBody: jsonRequest(zodToOpenApiSchema(updateProductSchema)),
        responses: {
          200: jsonResponse('Product updated', { $ref: '#/components/schemas/Product' }),
          400: errorResponses.validation,
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        description: 'Requires permission products:delete.',
        security: authenticated,
        'x-permission': 'products:delete',
        parameters: [idParam('id', 'Product id')],
        responses: {
          204: jsonResponse('Product deleted'),
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      }
    },
    '/stock/movements': {
      get: {
        tags: ['Stock'],
        summary: 'List stock movements',
        description: 'Requires permission reports:view.',
        security: authenticated,
        'x-permission': 'reports:view',
        responses: {
          200: jsonResponse('Movements list', {
            type: 'array',
            items: { $ref: '#/components/schemas/Movement' }
          }),
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          500: errorResponses.internal
        }
      }
    },
    '/stock/{productId}': {
      get: {
        tags: ['Stock'],
        summary: 'Get product stock',
        description: 'Requires permission stock:read.',
        security: authenticated,
        'x-permission': 'stock:read',
        parameters: [idParam('productId', 'Product id')],
        responses: {
          200: jsonResponse('Product stock', { $ref: '#/components/schemas/Stock' }),
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      }
    },
    '/stock/{productId}/in': {
      post: {
        tags: ['Stock'],
        summary: 'Register stock input',
        description: 'Requires permission stock:in.',
        security: authenticated,
        'x-permission': 'stock:in',
        parameters: [idParam('productId', 'Product id')],
        requestBody: jsonRequest(zodToOpenApiSchema(movementSchema)),
        responses: {
          201: jsonResponse('Stock input registered', {
            $ref: '#/components/schemas/StockMovementResponse'
          }),
          400: errorResponses.validation,
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      }
    },
    '/stock/{productId}/out': {
      post: {
        tags: ['Stock'],
        summary: 'Register stock output',
        description: 'Requires permission stock:out.',
        security: authenticated,
        'x-permission': 'stock:out',
        parameters: [idParam('productId', 'Product id')],
        requestBody: jsonRequest(zodToOpenApiSchema(movementSchema)),
        responses: {
          201: jsonResponse('Stock output registered', {
            $ref: '#/components/schemas/StockMovementResponse'
          }),
          400: errorResponses.validation,
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      }
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        description: 'Requires permission users:manage.',
        security: authenticated,
        'x-permission': 'users:manage',
        responses: {
          200: jsonResponse('Users list', {
            type: 'array',
            items: { $ref: '#/components/schemas/User' }
          }),
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          500: errorResponses.internal
        }
      }
    },
    '/users/{id}/role': {
      patch: {
        tags: ['Users'],
        summary: 'Update user role',
        description: 'Requires permission users:manage.',
        security: authenticated,
        'x-permission': 'users:manage',
        parameters: [idParam('id', 'User id')],
        requestBody: jsonRequest(zodToOpenApiSchema(updateRoleSchema)),
        responses: {
          200: jsonResponse('User role updated', { $ref: '#/components/schemas/User' }),
          400: errorResponses.validation,
          401: errorResponses.unauthorized,
          403: errorResponses.forbidden,
          404: errorResponses.notFound,
          500: errorResponses.internal
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Role: {
        type: 'string',
        enum: Object.values(Role)
      },
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'role', 'createdAt'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { $ref: '#/components/schemas/Role' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        required: ['user', 'token'],
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' }
        }
      },
      Category: {
        type: 'object',
        required: ['id', 'name', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        required: ['id', 'sku', 'name', 'price', 'quantity', 'categoryId', 'category', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          sku: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number', format: 'decimal' },
          quantity: { type: 'integer', minimum: 0 },
          categoryId: { type: 'string', format: 'uuid' },
          category: { $ref: '#/components/schemas/Category' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Stock: {
        type: 'object',
        required: ['id', 'sku', 'name', 'quantity'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          sku: { type: 'string' },
          name: { type: 'string' },
          quantity: { type: 'integer', minimum: 0 }
        }
      },
      Movement: {
        type: 'object',
        required: ['id', 'type', 'quantity', 'createdAt', 'product', 'user'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['IN', 'OUT'] },
          quantity: { type: 'integer', minimum: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          product: {
            type: 'object',
            required: ['id', 'sku', 'name'],
            properties: {
              id: { type: 'string', format: 'uuid' },
              sku: { type: 'string' },
              name: { type: 'string' }
            }
          },
          user: {
            type: 'object',
            required: ['id', 'name', 'email'],
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' }
            }
          }
        }
      },
      StockMovementResponse: {
        type: 'object',
        required: ['movement', 'stock'],
        properties: {
          movement: { $ref: '#/components/schemas/Movement' },
          stock: {
            type: 'object',
            required: ['productId', 'quantity'],
            properties: {
              productId: { type: 'string', format: 'uuid' },
              quantity: { type: 'integer', minimum: 0 }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string' },
          details: {}
        }
      },
      ValidationErrorResponse: {
        type: 'object',
        required: ['error', 'issues'],
        properties: {
          error: { type: 'string', example: 'Validation error' },
          issues: {
            type: 'array',
            items: { type: 'object' }
          }
        }
      },
      ForbiddenResponse: {
        type: 'object',
        required: ['error', 'required'],
        properties: {
          error: { type: 'string', example: 'Forbidden' },
          required: { type: 'string', example: 'products:create' }
        }
      }
    }
  }
} as const;
