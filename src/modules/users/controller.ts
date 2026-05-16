import { Request, Response } from 'express';
import * as usersService from './service';
import { updateRoleSchema } from './schemas';

export async function list(_req: Request, res: Response) {
  const users = await usersService.listUsers();
  return res.json(users);
}

export async function updateRole(req: Request, res: Response) {
  const input = updateRoleSchema.parse(req.body);
  const user = await usersService.updateRole(String(req.params.id), input);
  return res.json(user);
}
