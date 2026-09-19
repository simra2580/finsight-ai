import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { optionalAuth } from './middleware/auth.js';
import { apiRouter } from './routes/api.routes.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(',').map(x=>x.trim()) }));
  app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(requestLogger);
  app.get('/health', (_req,res)=>res.json({ success:true, data:{ service:'FinSight AI Backend', status:'ok', version:'1.0.0' } }));
  app.get('/', (_req,res)=>res.json({ success:true, data:{ name:'FinSight AI', tagline:'Before money moves, FinSight thinks.', mode:'MVP / simulated payments' } }));
  app.use('/api', optionalAuth, apiRouter);
  app.use(errorHandler);
  return app;
}
