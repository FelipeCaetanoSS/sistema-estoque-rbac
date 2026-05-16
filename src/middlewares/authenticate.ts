import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { verifyToken } from '../auth/token';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role as Role
    };

    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
