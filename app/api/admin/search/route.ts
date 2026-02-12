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

export async function GET(req: NextRequest) {
    try {
        if (!validateAdmin(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await ensureDb();

        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json(
                { success: false, message: "Registration code is required" },
                { status: 400 }
            );
        }

        const result = await query(
            `SELECT r.*, 
        (SELECT json_agg(json_build_object(
          'id', tm.id, 'event_id', tm.event_id, 'member_name', tm.member_name, 
          'member_email', tm.member_email, 'member_mobile', tm.member_mobile,
          'member_college', tm.member_college, 'member_year', tm.member_year, 'is_leader', tm.is_leader
        )) FROM team_members tm WHERE tm.registration_id = r.id) as team_members,
        (SELECT json_agg(json_build_object(
          'event_id', ea.event_id, 'status', ea.status, 'marked_at', ea.marked_at
        )) FROM event_attendance ea WHERE ea.registration_id = r.id) as event_attendance
       FROM registrations r
       WHERE r.reg_code = $1`,
            [code.toUpperCase().trim()]
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
        console.error("Admin search error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
