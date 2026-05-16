import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(2),
  name: z.string().min(2),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().uuid().optional(),
  categoryName: z.string().min(2).optional()
}).refine((data) => data.categoryId || data.categoryName, {
  message: 'Informe categoryId ou categoryName',
  path: ['categoryId']
});

export const updateProductSchema = z.object({
  sku: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  price: z.coerce.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
  categoryName: z.string().min(2).optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
