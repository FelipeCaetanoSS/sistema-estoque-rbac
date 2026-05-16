import { Router } from 'express';
import * as usersController from './controller';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { authenticate } from '../../middlewares/authenticate';
import { requirePermission } from '../../rbac/requirePermission';

export const usersRoutes = Router();

usersRoutes.use(authenticate, requirePermission('users:manage'));

usersRoutes.get('/', asyncHandler(usersController.list));
usersRoutes.patch('/:id/role', asyncHandler(usersController.updateRole));
