export const permissions = [
  'users:manage',
  'products:read',
  'products:create',
  'products:update',
  'products:delete',
  'stock:read',
  'stock:in',
  'stock:out',
  'reports:view'
] as const;

export type Permission = (typeof permissions)[number];
