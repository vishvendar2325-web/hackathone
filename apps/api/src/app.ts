import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import v1Router from './routes/v1';
import { errorMiddleware } from './middleware/errorMiddleware';
import { config } from './config/index';

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows flexible embedding in AI Studio preview iframe
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: config.webOrigin === '*' ? true : config.webOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // API v1 Routes
  app.use('/api/v1', v1Router);

  // Centralized Error Handling
  app.use(errorMiddleware);

  return app;
}

export default createApp;
