import { NextRequest, NextResponse } from "next/server";

// Dynamically import googleapis to keep it server-only
async function getGoogleSheets() {
    const { google } = await import("googleapis");
    return google.sheets("v4");
}

async function getAuth() {
    const { google } = await import("googleapis");
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return auth;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { name, email, mobile, college, year, tier, events, timestamp } =
            body;

        // Validate required fields
        if (!name || !email || !mobile || !college || !year || !tier || !events) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 },
            );
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 },
            );
        }

        // Validate mobile (10 digits)
        if (!/^\d{10}$/.test(mobile)) {
            return NextResponse.json(
                { error: "Mobile number must be 10 digits" },
                { status: 400 },
            );
        }

        // Check environment variables
        const sheetId = process.env.GOOGLE_SHEET_ID;
        if (
            !process.env.GOOGLE_CLIENT_EMAIL ||
            !process.env.GOOGLE_PRIVATE_KEY ||
            !sheetId
        ) {
            console.error("Missing Google Sheets credentials in environment");
            return NextResponse.json(
                { error: "Server configuration error. Please contact the organizers." },
                { status: 500 },
            );
        }

        const auth = await getAuth();
        const sheets = await getGoogleSheets();

        await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId: sheetId,
            range: "Sheet1!A:H",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [
                        timestamp || new Date().toISOString(),
                        name,
                        email,
                        mobile,
                        college,
                        year,
                        tier,
                        events,
                    ],
                ],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to save registration. Please try again." },
            { status: 500 },
        );
    }
}
