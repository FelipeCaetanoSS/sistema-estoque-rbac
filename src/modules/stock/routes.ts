import { Router } from 'express';
import * as stockController from './controller';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { authenticate } from '../../middlewares/authenticate';
import { requirePermission } from '../../rbac/requirePermission';

export const stockRoutes = Router();

stockRoutes.use(authenticate);

stockRoutes.get('/movements', requirePermission('reports:view'), asyncHandler(stockController.listMovements));
stockRoutes.get('/:productId', requirePermission('stock:read'), asyncHandler(stockController.getStock));
stockRoutes.post('/:productId/in', requirePermission('stock:in'), asyncHandler(stockController.stockIn));
stockRoutes.post('/:productId/out', requirePermission('stock:out'), asyncHandler(stockController.stockOut));
