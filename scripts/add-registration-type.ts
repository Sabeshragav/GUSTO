/**
 * Migration: Add `registration_type` column to the `users` table.
 *
 * This is a SAFE, non-destructive migration:
 *   - Uses ADD COLUMN IF NOT EXISTS (idempotent — safe to run multiple times)
 *   - All existing rows will default to 'ONLINE'
 *   - No data is modified or deleted
 *
 * Usage:
 *   npx tsx scripts/add-registration-type.ts
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
        // Check current state before migration
        const beforeResult = await client.query(
            `SELECT COUNT(*) as total FROM users`,
        );
        console.log(`📊  Current user count: ${beforeResult.rows[0].total}`);

        // Check if column already exists
        const colCheck = await client.query(
            `SELECT column_name FROM information_schema.columns
             WHERE table_name = 'users' AND column_name = 'registration_type'`,
        );

        if (colCheck.rows.length > 0) {
            console.log("ℹ️   Column 'registration_type' already exists. Nothing to do.");
        } else {
            // Add the column with a default value — existing rows get 'ONLINE'
            await client.query(`
                ALTER TABLE users
                ADD COLUMN registration_type VARCHAR(20) DEFAULT 'ONLINE'
            `);
            console.log("  ✔ Added 'registration_type' column with DEFAULT 'ONLINE'");
        }

        // Verify: count rows and confirm no data was lost
        const afterResult = await client.query(
            `SELECT COUNT(*) as total FROM users`,
        );
        console.log(`📊  User count after migration: ${afterResult.rows[0].total}`);

        if (beforeResult.rows[0].total !== afterResult.rows[0].total) {
            console.error("❌  ROW COUNT MISMATCH! Something went wrong.");
            process.exit(1);
        }

        // Show a sample to confirm defaults were applied
        const sample = await client.query(
            `SELECT id, name, registration_type FROM users LIMIT 5`,
        );
        console.log("\n📋  Sample rows after migration:");
        for (const row of sample.rows) {
            console.log(`   ${row.name} → registration_type: ${row.registration_type}`);
        }

        console.log("\n🎉  Migration completed successfully! No data was lost.");
    } catch (err) {
        console.error("❌  Migration failed:", err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
