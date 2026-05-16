import { Request, Response } from 'express';
import * as authService from './service';
import { loginSchema, registerSchema } from './schemas';

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);

  return res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);

  return res.json(result);
}
