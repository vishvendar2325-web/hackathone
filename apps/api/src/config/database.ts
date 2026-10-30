import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prismaGlobal) {
      global.prismaGlobal = new PrismaClient({
        log: ['error', 'warn'],
      });
    }
    prisma = global.prismaGlobal;
  }
} catch (e) {
  console.warn('[FOCUSFLOW DB] Prisma Client initial warning (will use memory store fallback if offline):', e);
  prisma = new PrismaClient();
}

export { prisma };
export default prisma;
