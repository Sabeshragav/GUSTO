import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Pass definitions for server-side validation
const PASS_LIMITS: Record<
    string,
    { price: number; maxTotal: number; maxTech: number; maxNonTech: number }
> = {
    silver: { price: 180, maxTotal: 1, maxTech: 1, maxNonTech: 1 },
    gold: { price: 200, maxTotal: 2, maxTech: 2, maxNonTech: 2 },
    diamond: { price: 250, maxTotal: 3, maxTech: 2, maxNonTech: 1 },
    platinum: { price: 300, maxTotal: 4, maxTech: 2, maxNonTech: 2 },
};

// Track processed transaction IDs in memory (basic dedup — use DB for production)
const processedTransactions = new Set<string>();

// Service account auth for Google Sheets
async function getSheetsClient() {
    const { google } = await import("googleapis");

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
}

// OAuth2 auth for Google Drive (personal account)
async function getDriveClient() {
    const { google } = await import("googleapis");

    const oauth2 = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET
    );

    oauth2.setCredentials({
        refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });

    return google.drive({ version: "v3", auth: oauth2 });
}

function bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

function sanitize(val: string): string {
    return val.trim().replace(/[<>]/g, "");
}

export async function POST(req: NextRequest) {
    try {
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
            // Use server-calculated total
        }

        // ──── Prevent duplicate Transaction ID ────
        const txId = sanitize(transactionId);
        if (processedTransactions.has(txId)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This Transaction ID has already been used. If this is an error, contact the organizers.",
                },
                { status: 409 }
            );
        }

        // ──── Validate event count against pass limits ────
        const eventList = selectedEvents
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);
        if (eventList.length > passLimits.maxTotal) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Too many events selected for ${tier} pass (max ${passLimits.maxTotal})`,
                },
                { status: 400 }
            );
        }

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

        // ──── Check environment variables ────
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (
            !process.env.GOOGLE_CLIENT_EMAIL ||
            !process.env.GOOGLE_PRIVATE_KEY ||
            !sheetId ||
            !folderId ||
            !process.env.GOOGLE_OAUTH_CLIENT_ID ||
            !process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
            !process.env.GOOGLE_OAUTH_REFRESH_TOKEN
        ) {
            console.error("Missing Google credentials in environment");
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Server configuration error. Please contact the organizers.",
                },
                { status: 500 }
            );
        }

        // ──── Upload screenshot to Google Drive (via OAuth2) ────
        const drive = await getDriveClient();
        const fileBuffer = Buffer.from(await screenshot.arrayBuffer());
        const timestamp = new Date().toISOString();
        const safeName = sanitize(name).replace(/[^a-zA-Z0-9]/g, "_");
        const ext = screenshot.name.split(".").pop() || "jpg";
        const fileName = `${safeName}_${Date.now()}.${ext}`;

        const driveResponse = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
            },
            media: {
                mimeType: screenshot.type,
                body: bufferToStream(fileBuffer),
            },
            fields: "id",
        });

        const fileId = driveResponse.data.id;
        if (!fileId) {
            console.error("Drive upload returned no file ID");
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to upload screenshot. Please try again.",
                },
                { status: 500 }
            );
        }

        // Make file publicly viewable
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const screenshotLink = `https://drive.google.com/file/d/${fileId}/view`;

        // ──── Format teammate data for sheet ────
        const teammateNames = teammates.map((t) => t.name).join(" | ");
        const teammateEmails = teammates.map((t) => t.email).join(" | ");
        const teammateMobiles = teammates.map((t) => t.mobile).join(" | ");
        const teammateColleges = teammates.map((t) => t.college).join(" | ");
        const teammateYears = teammates.map((t) => t.year).join(" | ");

        // ──── Append to Google Sheets (via service account) ────
        const sheets = await getSheetsClient();

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "Sheet1!A:Q",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [
                        timestamp,
                        sanitize(name),
                        sanitize(email),
                        sanitize(mobile),
                        sanitize(college),
                        year,
                        tier,
                        selectedEvents,
                        teamSize,
                        txId,
                        expectedTotal,
                        teammateNames,
                        teammateEmails,
                        teammateMobiles,
                        teammateColleges,
                        teammateYears,
                        screenshotLink,
                    ],
                ],
            },
        });

        // Mark transaction as processed
        processedTransactions.add(txId);

        return NextResponse.json({ success: true });
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
