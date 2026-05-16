import { MovementType } from '@prisma/client';
import { Request, Response } from 'express';
import * as stockService from './service';
import { movementSchema } from './schemas';

export async function getStock(req: Request, res: Response) {
  const stock = await stockService.getStock(String(req.params.productId));
  return res.json(stock);
}

export async function stockIn(req: Request, res: Response) {
  const input = movementSchema.parse(req.body);
  const result = await stockService.moveStock(
    String(req.params.productId),
    req.user!.id,
    MovementType.IN,
    input
  );

  return res.status(201).json(result);
}

export async function stockOut(req: Request, res: Response) {
  const input = movementSchema.parse(req.body);
  const result = await stockService.moveStock(
    String(req.params.productId),
    req.user!.id,
    MovementType.OUT,
    input
  );

  return res.status(201).json(result);
}

export async function listMovements(_req: Request, res: Response) {
  const movements = await stockService.listMovements();
  return res.json(movements);
}
