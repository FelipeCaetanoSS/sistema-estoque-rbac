import { NextFunction, Request, Response } from 'express';
import { Permission } from './permissions';
import { rolePermissions } from './rolePermissions';

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const granted = rolePermissions[req.user.role] ?? [];

    if (!granted.includes(permission)) {
      return res.status(403).json({
        error: 'Forbidden',
        required: permission
      });
    }

    return next();
  };
}
