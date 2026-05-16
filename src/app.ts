import cors from 'cors';
import express from 'express';
import { authRoutes } from './auth/routes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRoutes);

  app.use(errorHandler);

  return app;
}
