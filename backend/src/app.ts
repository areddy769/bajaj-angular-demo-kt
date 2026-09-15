import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { ok } from './utils/api-response';

export function createApp() {
  const app = express();

  app.use(express.json());

  // Restricted CORS: only allow the Angular dev server (configurable via .env).
  app.use(
    cors({
      origin: env.frontendUrl,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Health check — quick way for freshers to verify the backend is running.
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ...ok('API is running', null), timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 for unknown routes, then the central error handler.
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
