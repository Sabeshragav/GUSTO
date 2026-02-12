import { NextRequest, NextResponse } from "next/server";
import { query, initDatabase, generateRegCode } from "../../../src/lib/db";
import { uploadToS3 } from "../../../src/lib/s3";
import { sendRegistrationEmail } from "../../../src/lib/email";
import { EVENTS } from "../../../src/data/events";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Pass definitions for server-side validation
const PASS_LIMITS: Record<
    string,
    { name: string; price: number; maxTotal: number; maxTech: number; maxNonTech: number }
> = {
    silver: { name: "Silver", price: 180, maxTotal: 1, maxTech: 1, maxNonTech: 1 },
    gold: { name: "Gold", price: 200, maxTotal: 2, maxTech: 2, maxNonTech: 2 },
    diamond: { name: "Diamond", price: 250, maxTotal: 3, maxTech: 2, maxNonTech: 1 },
    platinum: { name: "Platinum", price: 300, maxTotal: 4, maxTech: 2, maxNonTech: 2 },
};

// Team-based events (min 1, max 4 members)
const TEAM_EVENTS = new Set(["paper-presentation", "project-presentation"]);

let dbInitialized = false;

async function ensureDb() {
    if (!dbInitialized) {
        await initDatabase();
        dbInitialized = true;
    }
}

function sanitize(val: string): string {
    return val.trim().replace(/[<>]/g, "");
}

export async function POST(req: NextRequest) {
    try {
        await ensureDb();

        const formData = await req.formData();

        // ──── Extract fields ────
        const name = formData.get("name") as string | null;
        const email = formData.get("email") as string | null;
        const mobile = formData.get("mobile") as string | null;
        const college = formData.get("college") as string | null;
        const year = formData.get("year") as string | null;
        const tier = formData.get("tier") as string | null;
        const selectedEvents = formData.get("selectedEvents") as string | null;
        const teamSizeRaw = formData.get("teamSize") as string | null;
        const transactionId = formData.get("transactionId") as string | null;
        const totalAmountRaw = formData.get("totalAmount") as string | null;
        const teammatesRaw = formData.get("teammates") as string | null;
        const screenshot = formData.get("screenshot") as File | null;

        // ──── Validate required fields ────
        if (
            !name ||
            !email ||
            !mobile ||
            !college ||
            !year ||
            !tier ||
            !selectedEvents ||
            !transactionId
        ) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        // ──── Validate email format ────
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }

        // ──── Validate mobile (10 digits) ────
        if (!/^\d{10}$/.test(mobile)) {
            return NextResponse.json(
                { success: false, message: "Mobile number must be 10 digits" },
                { status: 400 }
            );
        }

        // ──── Validate pass tier ────
        const passLimits = PASS_LIMITS[tier];
        if (!passLimits) {
            return NextResponse.json(
                { success: false, message: "Invalid pass tier" },
                { status: 400 }
            );
        }

        // ──── Validate team size ────
        const teamSize = parseInt(teamSizeRaw || "1", 10);
        if (isNaN(teamSize) || teamSize < 1 || teamSize > 4) {
            return NextResponse.json(
                { success: false, message: "Team size must be between 1 and 4" },
                { status: 400 }
            );
        }

        // ──── Server-side price recalculation ────
        const expectedTotal = passLimits.price * teamSize;
        const clientTotal = parseInt(totalAmountRaw || "0", 10);
        if (clientTotal !== expectedTotal) {
            console.warn(
                `Price tamper detected: client=${clientTotal}, server=${expectedTotal}`
            );
        }

        // ──── Parse event IDs and validate ────
        const eventIds = selectedEvents
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);

        if (eventIds.length === 0) {
            return NextResponse.json(
                { success: false, message: "At least one event must be selected" },
                { status: 400 }
            );
        }

        if (eventIds.length > passLimits.maxTotal) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Too many events selected for ${passLimits.name} pass (max ${passLimits.maxTotal})`,
                },
                { status: 400 }
            );
        }

        // Validate that all event IDs exist
        const validEventIds = new Set(EVENTS.map((e) => e.id));
        for (const eventId of eventIds) {
            if (!validEventIds.has(eventId)) {
                return NextResponse.json(
                    { success: false, message: `Unknown event: ${eventId}` },
                    { status: 400 }
                );
            }
        }

        // Check if any selected events are team-based
        const hasTeamEvents = eventIds.some((id) => TEAM_EVENTS.has(id));

        // ──── Parse teammate data ────
        let teammates: Array<{
            name: string;
            email: string;
            mobile: string;
            college: string;
            year: string;
        }> = [];

        if (teammatesRaw) {
            try {
                teammates = JSON.parse(teammatesRaw);
            } catch {
                return NextResponse.json(
                    { success: false, message: "Invalid teammate data format" },
                    { status: 400 }
                );
            }

            // Validate: teammates only allowed for team-based events
            if (teammates.length > 0 && !hasTeamEvents) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Team members are only allowed for Paper Presentation and Project Presentation",
                    },
                    { status: 400 }
                );
            }

            // Max 3 additional teammates (total team = 4 including leader)
            if (teammates.length > 3) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Maximum 4 team members including the leader",
                    },
                    { status: 400 }
                );
            }

            // Check for duplicate emails
            const allEmails = [email, ...teammates.map((t) => t.email)];
            const uniqueEmails = new Set(
                allEmails.map((e) => e.trim().toLowerCase())
            );
            if (uniqueEmails.size !== allEmails.length) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Duplicate email addresses found in team",
                    },
                    { status: 400 }
                );
            }
        }

        // ──── Validate screenshot ────
        if (!screenshot || !(screenshot instanceof File)) {
            return NextResponse.json(
                { success: false, message: "Payment screenshot is required" },
                { status: 400 }
            );
        }

        if (!screenshot.type.startsWith("image/")) {
            return NextResponse.json(
                { success: false, message: "Screenshot must be an image file" },
                { status: 400 }
            );
        }

        if (screenshot.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, message: "Screenshot must be under 5MB" },
                { status: 400 }
            );
        }

        // ──── Upload screenshot to S3 ────
        const fileBuffer = Buffer.from(await screenshot.arrayBuffer());
        const safeName = sanitize(name).replace(/[^a-zA-Z0-9]/g, "_");
        const ext = screenshot.name.split(".").pop() || "jpg";
        const fileName = `${safeName}_${Date.now()}.${ext}`;

        const screenshotUrl = await uploadToS3(fileBuffer, fileName, screenshot.type);

        // ──── Generate unique registration code ────
        let regCode = generateRegCode();
        // Ensure uniqueness (retry if collision)
        for (let attempt = 0; attempt < 5; attempt++) {
            const existing = await query(
                "SELECT id FROM registrations WHERE reg_code = $1",
                [regCode]
            );
            if (existing.rows.length === 0) break;
            regCode = generateRegCode();
        }

        // ──── Insert registration ────
        const regResult = await query(
            `INSERT INTO registrations 
       (reg_code, name, email, mobile, college, year, pass_tier, selected_events, screenshot_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, reg_code`,
            [
                regCode,
                sanitize(name),
                sanitize(email),
                sanitize(mobile),
                sanitize(college),
                year,
                passLimits.name, // Store as "Silver", "Gold", etc.
                eventIds,        // PostgreSQL TEXT[] — event IDs
                screenshotUrl,
            ]
        );

        const registrationId = regResult.rows[0].id;
        const savedRegCode = regResult.rows[0].reg_code;

        // ──── Insert event_attendance rows ────
        for (const eventId of eventIds) {
            await query(
                `INSERT INTO event_attendance (registration_id, event_id, status)
         VALUES ($1, $2, 'registered')`,
                [registrationId, eventId]
            );
        }

        // ──── Insert team members ────
        // For team events, insert the leader + teammates
        const teamEventIds = eventIds.filter((id) => TEAM_EVENTS.has(id));

        for (const teamEventId of teamEventIds) {
            // Insert leader as team member
            await query(
                `INSERT INTO team_members 
         (registration_id, event_id, member_name, member_email, member_mobile, member_college, member_year, is_leader)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
                [
                    registrationId,
                    teamEventId,
                    sanitize(name),
                    sanitize(email),
                    sanitize(mobile),
                    sanitize(college),
                    year,
                ]
            );

            // Insert additional teammates
            for (const tm of teammates) {
                await query(
                    `INSERT INTO team_members 
           (registration_id, event_id, member_name, member_email, member_mobile, member_college, member_year, is_leader)
           VALUES ($1, $2, $3, $4, $5, $6, $7, false)`,
                    [
                        registrationId,
                        teamEventId,
                        sanitize(tm.name),
                        sanitize(tm.email),
                        sanitize(tm.mobile),
                        sanitize(tm.college),
                        tm.year,
                    ]
                );
            }
        }

        // ──── Send confirmation email ────
        try {
            const eventDetails = eventIds.map((id) => {
                const ev = EVENTS.find((e) => e.id === id);
                return {
                    title: ev?.title || id,
                    date: ev?.date || "TBD",
                    time: ev?.time || "TBD",
                    venue: ev?.venue || "TBD",
                };
            });

            await sendRegistrationEmail(
                sanitize(email),
                sanitize(name),
                savedRegCode,
                passLimits.name,
                eventDetails
            );
        } catch (emailErr) {
            // Don't fail registration if email fails — log and continue
            console.error("Failed to send confirmation email:", emailErr);
        }

        return NextResponse.json({
            success: true,
            regCode: savedRegCode,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to save registration. Please try again.",
            },
            { status: 500 }
        );
    }
}
