import { Role } from '@prisma/client';
import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.nativeEnum(Role)
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
