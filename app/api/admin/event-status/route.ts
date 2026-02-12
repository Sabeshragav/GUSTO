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

        const { registrationId, eventId, status } = await req.json();

        if (!registrationId || !eventId || !status) {
            return NextResponse.json(
                { success: false, message: "registrationId, eventId, and status are required" },
                { status: 400 }
            );
        }

        const validStatuses = ["registered", "present", "absent"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: `Status must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        const result = await query(
            `UPDATE event_attendance 
       SET status = $1, marked_at = NOW()
       WHERE registration_id = $2 AND event_id = $3
       RETURNING *`,
            [status, registrationId, eventId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Event attendance record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            attendance: result.rows[0],
        });
    } catch (error) {
        console.error("Admin event-status error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
