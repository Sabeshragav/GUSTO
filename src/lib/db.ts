import { Pool, PoolClient } from "pg";
import { randomUUID } from "crypto";

let pool: Pool;

function getPool(): Pool {
  if (!pool) {
    const isLocal = process.env.NODE_ENV !== "production";
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal
        ? false
        : {
          rejectUnauthorized: false,
        },
    });
  }
  return pool;
}

export async function query(text: string, params?: unknown[]) {
  const pool = getPool();
  return pool.query(text, params);
}

export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return pool.connect();
}

/**
 * Generate unique registration code: GUSTO26-XXXXXXXX
 * Uses 8 hex chars from a UUID (~4.2 billion combinations),
 * making collisions essentially impossible without DB lookups.
 */
export function generateUniqueCode(): string {
  const hex = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `GUSTO26-${hex}`;
}
