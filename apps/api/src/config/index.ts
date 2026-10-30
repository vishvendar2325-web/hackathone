import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  webOrigin: process.env.WEB_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/focusflow',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'focusflow-super-secret-access-token-key-2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'focusflow-super-secret-refresh-token-key-2026',
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'gemini',
    apiKey: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '',
  },
};
