import { Role } from '@prisma/client';
import { Permission } from './permissions';

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    'users:manage',
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'stock:read',
    'stock:in',
    'stock:out',
    'reports:view'
  ],
  [Role.EDITOR]: [
    'products:read',
    'products:create',
    'products:update',
    'stock:read',
    'stock:in',
    'stock:out'
  ],
  [Role.USER]: ['products:read', 'stock:read']
};
