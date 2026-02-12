import { Pool, QueryResult } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function query(
  text: string,
  params?: unknown[]
): Promise<QueryResult> {
  const client = getPool();
  return client.query(text, params);
}

export async function initDatabase(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reg_code        VARCHAR(12) UNIQUE NOT NULL,
      name            VARCHAR(255) NOT NULL,
      email           VARCHAR(255) NOT NULL,
      mobile          VARCHAR(15) NOT NULL,
      college         VARCHAR(255) NOT NULL,
      year            VARCHAR(20) NOT NULL,
      pass_tier       VARCHAR(50) NOT NULL,
      selected_events TEXT[] NOT NULL,
      screenshot_url  TEXT NOT NULL,
      payment_verified BOOLEAN DEFAULT false,
      checked_in      BOOLEAN DEFAULT false,
      created_at      TIMESTAMPTZ DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
      event_id        VARCHAR(50) NOT NULL,
      member_name     VARCHAR(255) NOT NULL,
      member_email    VARCHAR(255),
      member_mobile   VARCHAR(15),
      member_college  VARCHAR(255),
      member_year     VARCHAR(20),
      is_leader       BOOLEAN DEFAULT false
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS event_attendance (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
      event_id        VARCHAR(50) NOT NULL,
      status          VARCHAR(20) DEFAULT 'registered',
      marked_at       TIMESTAMPTZ,
      UNIQUE(registration_id, event_id)
    );
  `);
}

export function generateRegCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "GST-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
