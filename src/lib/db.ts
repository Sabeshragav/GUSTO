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

export async function initDatabase() {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // ── users table ──
    await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                mobile VARCHAR(15) UNIQUE NOT NULL,
                college VARCHAR(255) NOT NULL,
                year VARCHAR(20) NOT NULL,
                unique_code VARCHAR(20) UNIQUE NOT NULL,
                checked_in BOOLEAN DEFAULT false,
                check_in_time TIMESTAMPTZ NULL,
                created_at TIMESTAMPTZ DEFAULT now()
            );
        `);

    // ── event_registrations table ──
    await client.query(`
            CREATE TABLE IF NOT EXISTS event_registrations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                event_id VARCHAR(50) NOT NULL,
                fallback_event_id VARCHAR(50) NULL,
                status VARCHAR(30) DEFAULT 'CONFIRMED',
                attendance_status VARCHAR(20) DEFAULT 'PENDING',
                created_at TIMESTAMPTZ DEFAULT now()
            );
        `);

    // ── payments table ──
    await client.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                amount INTEGER DEFAULT 250,
                screenshot_url TEXT NOT NULL,
                transaction_id VARCHAR(100),
                status VARCHAR(20) DEFAULT 'PENDING',
                created_at TIMESTAMPTZ DEFAULT now()
            );
        `);

    // ── indexes ──
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_unique_code ON users(unique_code);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_event_reg_user ON event_registrations(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);`);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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
