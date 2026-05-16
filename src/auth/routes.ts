import { Router } from 'express';
import * as authController from './controller';
import { asyncHandler } from '../middlewares/asyncHandler';

export const authRoutes = Router();

authRoutes.post('/register', asyncHandler(authController.register));
authRoutes.post('/login', asyncHandler(authController.login));
