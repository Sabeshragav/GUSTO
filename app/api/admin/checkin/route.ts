import { NextRequest, NextResponse } from "next/server";
import { query, initDatabase } from "../../../../src/lib/db";
import { validateAdmin } from "../auth";

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initDatabase();
        dbInitialized = true;
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!validateAdmin(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await ensureDb();

        const { regCode } = await req.json();

        if (!regCode) {
            return NextResponse.json(
                { success: false, message: "Registration code is required" },
                { status: 400 }
            );
        }

        const result = await query(
            `UPDATE registrations SET checked_in = true
       WHERE reg_code = $1
       RETURNING id, reg_code, name, checked_in`,
            [regCode.toUpperCase().trim()]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Registration not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            registration: result.rows[0],
        });
    } catch (error) {
        console.error("Admin checkin error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
