import { randomUUID } from "crypto";
import { NextRequest, NextResponse, after } from "next/server";
import { getClient, generateUniqueCode } from "@/lib/db";
// import { uploadToS3, buildS3Url } from "@/lib/s3"; // AWS S3 (commented out)
import { uploadToBlob } from "@/lib/s3";
import { sendRegistrationEmail } from "@/lib/email";
import { EVENTS, REGISTRATION_PRICE } from "@/data/events";
import {
    validateEventSelection,
    getAbstractEvents,
    getSubmissionEvents,
} from "@/data/eventValidation";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // ── Extract fields ──
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const mobile = formData.get("mobile") as string;
        const college = formData.get("college") as string;
        const year = formData.get("year") as string;
        const selectedEventIds = JSON.parse(
            formData.get("selectedEventIds") as string,
        ) as string[];
        const fallbackSelections = JSON.parse(
            (formData.get("fallbackSelections") as string) || "{}",
        ) as Record<string, string>;
        const transactionId = formData.get("transactionId") as string;
        const foodPreference = (formData.get("foodPreference") as string) || "VEG";
        const screenshot = formData.get("screenshot") as File;

        // ── Basic validation ──
        if (!name || !email || !mobile || !college || !year) {
            return NextResponse.json(
                { error: "All personal details are required" },
                { status: 400 },
            );
        }
        if (!transactionId || !screenshot) {
            return NextResponse.json(
                { error: "Payment details are required" },
                { status: 400 },
            );
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 },
            );
        }
        if (!/^\d{10}$/.test(mobile)) {
            return NextResponse.json(
                { error: "Mobile must be 10 digits" },
                { status: 400 },
            );
        }

        // ── Resolve events ──
        const selectedEvents = selectedEventIds
            .map((id) => EVENTS.find((e) => e.id === id))
            .filter(Boolean);
        if (selectedEvents.length !== selectedEventIds.length) {
            return NextResponse.json(
                { error: "One or more invalid event IDs" },
                { status: 400 },
            );
        }

        // ── Event selection validation ──
        const validation = validateEventSelection(selectedEvents as typeof EVENTS);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // ── Validate fallbacks for abstract events ──
        const abstractEvents = getAbstractEvents(selectedEvents as typeof EVENTS);
        for (const ae of abstractEvents) {
            const fallbackId = fallbackSelections[ae.id];
            if (!fallbackId) {
                return NextResponse.json(
                    { error: `Fallback event required for "${ae.title}"` },
                    { status: 400 },
                );
            }
            const fallbackEvent = EVENTS.find((e) => e.id === fallbackId);
            if (!fallbackEvent || fallbackEvent.eventType === "ABSTRACT") {
                return NextResponse.json(
                    { error: `Invalid fallback event for "${ae.title}"` },
                    { status: 400 },
                );
            }
        }

        // ── Prepare screenshot buffer BEFORE the transaction ──
        const screenshotBuffer = Buffer.from(await screenshot.arrayBuffer());

        // ── Begin transaction ──
        const client = await getClient();
        try {
            await client.query("BEGIN");

            // Check email/mobile uniqueness
            const existing = await client.query(
                "SELECT id FROM users WHERE email = $1 OR mobile = $2",
                [email, mobile],
            );
            if (existing.rows.length > 0) {
                await client.query("ROLLBACK");
                return NextResponse.json(
                    { error: "Email or mobile already registered" },
                    { status: 409 },
                );
            }

            // Generate IDs upfront
            const userId = randomUUID();
            const uniqueCode = generateUniqueCode();

            // 🔥 Upload to Vercel Blob first to get the URL
            const screenshotUrl = await uploadToBlob(
                screenshotBuffer,
                screenshot.name,
                screenshot.type,
                "payments",
                userId,
            );

            // Run all DB inserts
            const typedEvents = selectedEvents as typeof EVENTS;

            // Insert user (with our pre-generated UUID)
            await client.query(
                `INSERT INTO users (id, name, email, mobile, college, year, unique_code, food_preference)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    userId,
                    name,
                    email,
                    mobile,
                    college,
                    year,
                    uniqueCode,
                    foodPreference,
                ],
            );

            // Batch insert event registrations + payment in parallel
            const eventInsert =
                typedEvents.length > 0
                    ? (() => {
                        const values: unknown[] = [];
                        const placeholders: string[] = [];
                        typedEvents.forEach((event, i) => {
                            const offset = i * 5;
                            placeholders.push(
                                `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`,
                            );
                            values.push(
                                userId,
                                event.id,
                                fallbackSelections[event.id] || null,
                                "CONFIRMED",
                                event.timeSlot === "ONLINE" ? "NOT_REQUIRED" : "PENDING",
                            );
                        });
                        return client.query(
                            `INSERT INTO event_registrations (user_id, event_id, fallback_event_id, status, attendance_status)
                         VALUES ${placeholders.join(", ")}`,
                            values,
                        );
                    })()
                    : Promise.resolve();

            const paymentInsert = client.query(
                `INSERT INTO payments (user_id, amount, screenshot_url, transaction_id)
                 VALUES ($1, $2, $3, $4)`,
                [userId, REGISTRATION_PRICE, screenshotUrl, transactionId],
            );

            await Promise.all([eventInsert, paymentInsert]);
            await client.query("COMMIT");

            // Send confirmation email (fire-and-forget — does not block response)
            const submissionEvents = getSubmissionEvents(
                selectedEvents as typeof EVENTS,
            );
            const allNeedSubmission = [...abstractEvents, ...submissionEvents];
            console.log(`[Register] Dispatching confirmation email to ${email}`);
            after(async () => {
                try {
                    await sendRegistrationEmail({
                        to: email,
                        name,
                        uniqueCode,
                        events: typedEvents.map((e) => ({
                            title: e.title,
                            eventType: e.eventType,
                            submissionEmail: e.submissionEmail,
                        })),
                        amount: REGISTRATION_PRICE,
                    });
                } catch (err) {
                    console.error("[Register] Background email failed:", err);
                }
            });

            return NextResponse.json({
                success: true,
                uniqueCode,
                events: typedEvents.map((e) => e.title),
                amount: REGISTRATION_PRICE,
                hasSubmissionEvents: allNeedSubmission.length > 0,
            });
        } catch (txErr) {
            await client.query("ROLLBACK");
            throw txErr;
        } finally {
            client.release();
        }
    } catch (err: any) {
        console.error("Registration error:", err);

        // Build a verbose error response
        const errorMessage = err?.message || "Unknown error";
        const errorCode = err?.code || null;

        let detail = "An unexpected error occurred during registration.";
        if (errorCode === "ECONNREFUSED" || errorCode === "ENOTFOUND") {
            detail = "Unable to connect to the database. Please try again later.";
        } else if (errorCode === "23505") {
            detail =
                "A duplicate record was detected. You may already be registered.";
        } else if (errorCode === "23503") {
            detail =
                "A referenced record (e.g., event) was not found. Please refresh and try again.";
        } else if (
            errorMessage.includes("S3") ||
            errorMessage.includes("upload") ||
            errorMessage.includes("putObject")
        ) {
            detail =
                "Failed to upload payment screenshot. Please check the file and try again.";
        } else if (
            errorMessage.includes("timeout") ||
            errorMessage.includes("Timeout")
        ) {
            detail =
                "The request timed out. Please check your connection and try again.";
        } else if (
            errorMessage.includes("email") ||
            errorMessage.includes("SMTP")
        ) {
            detail =
                "Registration was saved but the confirmation email could not be sent. Please contact support.";
        }

        return NextResponse.json(
            {
                error: "Registration failed.",
                detail,
                reason: errorMessage,
            },
            { status: 500 },
        );
    }
}
