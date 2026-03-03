import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Encryption
  MESSAGE_ENCRYPTION_KEY_V1: process.env.MESSAGE_ENCRYPTION_KEY_V1!,
  MESSAGE_ENCRYPTION_KEY_VERSION: parseInt(process.env.MESSAGE_ENCRYPTION_KEY_VERSION || '1', 10),

  // Message retention (days)
  MESSAGE_RETENTION_DAYS: parseInt(process.env.MESSAGE_RETENTION_DAYS || '90', 10),
  REPORTED_MESSAGE_RETENTION_DAYS: parseInt(process.env.REPORTED_MESSAGE_RETENTION_DAYS || '180', 10),
};
