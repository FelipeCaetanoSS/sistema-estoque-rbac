import { Request, Response } from 'express';
import * as productsService from './service';
import { createProductSchema, updateProductSchema } from './schemas';

export async function list(_req: Request, res: Response) {
  const products = await productsService.listProducts();
  return res.json(products);
}

export async function get(req: Request, res: Response) {
  const product = await productsService.getProduct(String(req.params.id));
  return res.json(product);
}

export async function create(req: Request, res: Response) {
  const input = createProductSchema.parse(req.body);
  const product = await productsService.createProduct(input);
  return res.status(201).json(product);
}

export async function update(req: Request, res: Response) {
  const input = updateProductSchema.parse(req.body);
  const product = await productsService.updateProduct(String(req.params.id), input);
  return res.json(product);
}

export async function remove(req: Request, res: Response) {
  await productsService.deleteProduct(String(req.params.id));
  return res.status(204).send();
}
