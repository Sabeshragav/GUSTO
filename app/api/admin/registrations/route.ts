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
        const eventFilter = searchParams.get("event");
        const tierFilter = searchParams.get("tier");
        const checkedInFilter = searchParams.get("checkedIn");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "50", 10);
        const offset = (page - 1) * limit;

        // Build query with filters
        let whereClause = "";
        const params: unknown[] = [];
        const conditions: string[] = [];

        if (eventFilter) {
            params.push(eventFilter);
            conditions.push(`$${params.length} = ANY(r.selected_events)`);
        }

        if (tierFilter) {
            params.push(tierFilter);
            conditions.push(`r.pass_tier = $${params.length}`);
        }

        if (checkedInFilter !== null && checkedInFilter !== undefined) {
            params.push(checkedInFilter === "true");
            conditions.push(`r.checked_in = $${params.length}`);
        }

        if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(" AND ")}`;
        }

        // Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM registrations r ${whereClause}`,
            params
        );

        // Get registrations
        const registrationsResult = await query(
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
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
            [...params, limit, offset]
        );

        // Get stats
        const statsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE checked_in = true) as checked_in,
        COUNT(*) FILTER (WHERE payment_verified = true) as verified,
        COUNT(*) FILTER (WHERE pass_tier = 'Silver') as silver,
        COUNT(*) FILTER (WHERE pass_tier = 'Gold') as gold,
        COUNT(*) FILTER (WHERE pass_tier = 'Diamond') as diamond,
        COUNT(*) FILTER (WHERE pass_tier = 'Platinum') as platinum
      FROM registrations
    `);

        return NextResponse.json({
            success: true,
            registrations: registrationsResult.rows,
            total: parseInt(countResult.rows[0].count, 10),
            page,
            limit,
            stats: statsResult.rows[0],
        });
    } catch (error) {
        console.error("Admin registrations error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
