import cors from 'cors';
import express from 'express';
import { authRoutes } from './auth/routes';
import { errorHandler } from './middlewares/errorHandler';
import { productsRoutes } from './modules/products/routes';
import { stockRoutes } from './modules/stock/routes';
import { usersRoutes } from './modules/users/routes';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRoutes);
  app.use('/products', productsRoutes);
  app.use('/stock', stockRoutes);
  app.use('/users', usersRoutes);

  app.use(errorHandler);

  return app;
}
