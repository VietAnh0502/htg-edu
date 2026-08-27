import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

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

const TRANSIENT_CODES = new Set([
  "P1001",
  "P1002",
  "P1017",
  "P2024",
  "P2037",
  "ECONNRESET",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "EPIPE",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "EAI_AGAIN",
  "ENOTFOUND",
  "53300",
  "57P01",
  "57P02",
  "57P03",
]);

const TRANSIENT_MESSAGES = [
  "connection pool",
  "connection reset",
  "connection terminated",
  "connection refused",
  "connection closed",
  "closed unexpectedly",
  "socket hang up",
  "timed out fetching a new connection",
  "can't reach database server",
  "could not connect to server",
  "too many clients",
  "remaining connection slots are reserved",
  "database system is starting up",
  "terminating connection due to administrator command",
];

type ErrorLike = {
  cause?: unknown;
  code?: unknown;
  message?: unknown;
  name?: unknown;
};

function errorDetails(error: unknown) {
  const codes = new Set<string>();
  const messages: string[] = [];
  const visited = new Set<unknown>();
  let current = error;

  for (let depth = 0; depth < 5 && current && typeof current === "object" && !visited.has(current); depth += 1) {
    visited.add(current);
    const item = current as ErrorLike;
    if (item.code !== undefined) codes.add(String(item.code).toUpperCase());
    if (item.name !== undefined) messages.push(String(item.name));
    if (item.message !== undefined) messages.push(String(item.message));
    current = item.cause;
  }

  return { codes, message: messages.join(" ").toLowerCase() };
}

export function isTransientDatabaseError(error: unknown) {
  const { codes, message } = errorDetails(error);
  return [...codes].some(code => TRANSIENT_CODES.has(code) || /^08[A-Z0-9]{3}$/.test(code))
    || TRANSIENT_MESSAGES.some(fragment => message.includes(fragment));
}

function logPoolError(scope: string, error: Error) {
  const code = "code" in error ? String(error.code) : undefined;
  console.error(`[database:${scope}]`, { code, message: error.message });
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL chưa được cấu hình");

  const pool = new Pool({
    connectionString,
    // Supabase recommends one application-side connection per serverless
    // instance; Supavisor transaction mode multiplexes it on the server side.
    max: 1,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 10_000,
    maxLifetimeSeconds: 300,
    keepAlive: true,
    keepAliveInitialDelayMillis: 5_000,
  });

  pool.on("error", error => logPoolError("idle-client", error));
  if (process.env.VERCEL_URL && process.env.VERCEL_REGION) attachDatabasePool(pool);
  return pool;
}

function createClient(pool: Pool) {
  const adapter = new PrismaPg(pool, {
    onConnectionError: error => logPoolError("connection", error),
    onPoolError: error => logPoolError("pool", error),
  });

  return new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          const attempts = RETRYABLE_READS.has(operation) ? 3 : 1;
          for (let attempt = 1; ; attempt += 1) {
            try {
              return await query(args);
            } catch (error) {
              if (attempt >= attempts || !isTransientDatabaseError(error)) throw error;
              const backoffMs = attempt * 150 + Math.floor(Math.random() * 100);
              await new Promise(resolve => setTimeout(resolve, backoffMs));
            }
          }
        },
      },
    },
  });
}

type DatabaseClient = ReturnType<typeof createClient>;
const globalForDatabase = globalThis as unknown as {
  databasePool?: Pool;
  prisma?: DatabaseClient;
};

// Both objects survive warm invocations and Next.js hot reloads. Vercel's pool
// attachment keeps Fluid Compute alive until idle clients have been released.
const databasePool = globalForDatabase.databasePool ?? createPool();
export const db = globalForDatabase.prisma ?? createClient(databasePool);
globalForDatabase.databasePool = databasePool;
globalForDatabase.prisma = db;
