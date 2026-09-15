import { PrismaClient } from '@prisma/client';

// Reuse a single PrismaClient (important for SQLite + tests).
// Using globalThis avoids creating many connections during hot-reload / tests.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
