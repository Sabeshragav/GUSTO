import { Pool, PoolClient } from 'pg';

let pool: Pool;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
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
 * Generate unique registration code: GUSTO26-XXXX
 */
export function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'GUSTO26-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
