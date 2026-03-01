/**
 * Standalone script to initialize the database schema on RDS.
 *
 * Usage:
 *   npx tsx scripts/init-db.ts
 *
 * Requires DATABASE_URL in .env.local (or environment).
 */
import { Pool } from "pg";

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error(
            "❌  DATABASE_URL is not set. Add it to .env.local or export it.",
        );
        process.exit(1);
    }

    const isLocal = process.env.NODE_ENV !== "production";
    const pool = new Pool({
        connectionString,
        ssl: isLocal
            ? false
            : {
                rejectUnauthorized: false,
            },
    });

    const client = await pool.connect();
    console.log("✅  Connected to the database.");

    try {
        await client.query("BEGIN");

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
                food_preference VARCHAR(20) NULL,
                checked_in BOOLEAN DEFAULT false,
                check_in_time TIMESTAMPTZ NULL,
                created_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        console.log("  ✔ users");

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
        console.log("  ✔ event_registrations");

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
        console.log("  ✔ payments");

        // ── indexes ──
        await client.query(
            `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
        );
        await client.query(
            `CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);`,
        );
        await client.query(
            `CREATE INDEX IF NOT EXISTS idx_users_unique_code ON users(unique_code);`,
        );
        await client.query(
            `CREATE INDEX IF NOT EXISTS idx_event_reg_user ON event_registrations(user_id);`,
        );
        await client.query(
            `CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);`,
        );
        await client.query(
            `CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);`,
        );
        console.log("  ✔ indexes");

        await client.query("COMMIT");
        console.log("\n🎉  Database schema initialized successfully!");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌  Schema init failed:", err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
