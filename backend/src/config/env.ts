import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/finsight_ai'),
  JWT_SECRET: z.string().min(16).default('development-only-change-me-please'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(5),
  AI_PROVIDER: z.enum(['bedrock', 'mock']).default('mock'),
  AWS_REGION: z.string().default('ap-south-1'),
  BEDROCK_MODEL_ID: z.string().default('amazon.nova-lite-v1:0'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SESSION_TOKEN: z.string().optional(),
  S3_ENABLED: z.coerce.boolean().default(false),
  S3_BUCKET: z.string().optional(),
  S3_PREFIX: z.string().default('invoices'),
  LOCAL_UPLOAD_DIR: z.string().default('uploads'),
  TESTNET_ENABLED: z.coerce.boolean().default(false),
  TESTNET_NETWORK: z.string().default('demo-testnet')
}).passthrough();

export const env = schema.parse(process.env);
