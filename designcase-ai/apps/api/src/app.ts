import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error.js';
import { requestLogger } from './middleware/logger.js';
import indexRoutes from './routes/index.js';

export function createApp() {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Request logging
  app.use(requestLogger);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api', indexRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
}
