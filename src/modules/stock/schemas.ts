import { z } from 'zod';

export const movementSchema = z.object({
  quantity: z.coerce.number().int().positive()
});

export type MovementInput = z.infer<typeof movementSchema>;
