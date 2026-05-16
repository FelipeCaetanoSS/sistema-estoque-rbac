import { Router } from 'express';
import * as productsController from './controller';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { authenticate } from '../../middlewares/authenticate';
import { requirePermission } from '../../rbac/requirePermission';

export const productsRoutes = Router();

productsRoutes.use(authenticate);

productsRoutes.get('/', requirePermission('products:read'), asyncHandler(productsController.list));
productsRoutes.get('/:id', requirePermission('products:read'), asyncHandler(productsController.get));
productsRoutes.post('/', requirePermission('products:create'), asyncHandler(productsController.create));
productsRoutes.put('/:id', requirePermission('products:update'), asyncHandler(productsController.update));
productsRoutes.delete('/:id', requirePermission('products:delete'), asyncHandler(productsController.remove));
