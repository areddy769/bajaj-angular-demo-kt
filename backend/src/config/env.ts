import dotenv from 'dotenv';

// Load .env file (silently ignored if missing — tests set vars programmatically)
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  databaseUrl: process.env['DATABASE_URL'] ?? 'file:./dev.db',
  jwtSecret: required('JWT_SECRET', 'change-this-development-secret'),
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '1h',
  frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:4200',
};

export const isDev = env.nodeEnv !== 'production';
