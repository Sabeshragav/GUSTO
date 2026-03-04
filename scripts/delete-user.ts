/**
 * Standalone script to delete a user and all their related data.
 *
 * Usage:
 *   npx tsx scripts/delete-user.ts <email_or_unique_code>
 *
 * Requires DATABASE_URL in environment.
 */
import { Pool } from "pg";
import * as readline from "readline";

function askConfirmation(prompt: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === "y");
        });
    });
}

async function main() {
    const identifier = process.argv[2];

    if (!identifier) {
        console.error("❌ Please provide an email or unique code as an argument.");
        console.log("Usage: npx tsx scripts/delete-user.ts <email_or_unique_code>");
        process.exit(1);
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("❌ DATABASE_URL is not set.");
        process.exit(1);
    }

    const isLocal = process.env.NODE_ENV !== "production";

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isLocal
            ? false
            : {
                rejectUnauthorized: false,
            },
    });

    const client = await pool.connect();
    console.log(`🔍 Searching for user with identifier: ${identifier}`);

    try {
        await client.query("BEGIN");

        // 1. Find the user ID first
        const userRes = await client.query(
            "SELECT id, name, email, unique_code FROM users WHERE email = $1 OR unique_code = $1",
            [identifier]
        );

        if (userRes.rows.length === 0) {
            console.warn(`⚠️  No user found matching "${identifier}".`);
            await client.query("ROLLBACK");
            process.exit(0);
        }

        const user = userRes.rows[0];
        const userId = user.id;

        console.log(`👤 Found user: ${user.name} (${user.email} / ${user.unique_code})`);
        console.log(`🆔 User ID: ${userId}`);

        // Ask for confirmation before deleting
        const confirmed = await askConfirmation(
            `\n⚠️  Are you sure you want to delete this user and all their data? (y/N): `
        );

        if (!confirmed) {
            console.log("❌ Deletion cancelled.");
            await client.query("ROLLBACK");
            process.exit(0);
        }

        // 2. Delete from event_registrations
        const regRes = await client.query(
            "DELETE FROM event_registrations WHERE user_id = $1",
            [userId]
        );
        console.log(`  ✔ Deleted ${regRes.rowCount} event registrations.`);

        // 3. Delete from payments
        const payRes = await client.query(
            "DELETE FROM payments WHERE user_id = $1",
            [userId]
        );
        console.log(`  ✔ Deleted ${payRes.rowCount} payment records.`);

        // 4. Delete from users
        await client.query("DELETE FROM users WHERE id = $1", [userId]);
        console.log("  ✔ Deleted user record.");

        await client.query("COMMIT");
        console.log(`\n🎉 Successfully deleted everything related to ${user.name}.`);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Deletion failed:", err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
