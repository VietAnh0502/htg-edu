import { PrismaClient } from "@prisma/client";

const RETRYABLE_READS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

function isTransientDatabaseError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message).toLowerCase() : "";

  return ["P1001", "P1002", "P1017", "P2024"].includes(code)
    || message.includes("connection pool")
    || message.includes("connection reset")
    || message.includes("connection terminated")
    || message.includes("timed out fetching a new connection");
}

const createClient = () => new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, args, query }) {
        const attempts = RETRYABLE_READS.has(operation) ? 3 : 1;
        for (let attempt = 1; ; attempt += 1) {
          try {
            return await query(args);
          } catch (error) {
            if (attempt >= attempts || !isTransientDatabaseError(error)) throw error;
            await new Promise(resolve => setTimeout(resolve, attempt * 150));
          }
        }
      },
    },
  },
});

type DatabaseClient = ReturnType<typeof createClient>;
const globalForPrisma = globalThis as unknown as { prisma?: DatabaseClient };

// Reuse one Prisma client per warm serverless instance. Creating one client for
// every request can exhaust a small Supabase/PgBouncer connection pool.
export const db = globalForPrisma.prisma ?? createClient();
globalForPrisma.prisma = db;
