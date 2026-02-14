import { NextRequest, NextResponse } from 'next/server';
import { getClient, generateUniqueCode, initDatabase } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { sendRegistrationEmail } from '@/lib/email';
import { EVENTS, REGISTRATION_PRICE } from '@/data/events';
import { validateEventSelection, getAbstractEvents, getSubmissionEvents } from '@/data/eventValidation';

export async function POST(req: NextRequest) {
    try {
        await initDatabase();
        const formData = await req.formData();

        // ── Extract fields ──
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const mobile = formData.get('mobile') as string;
        const college = formData.get('college') as string;
        const year = formData.get('year') as string;
        const selectedEventIds = JSON.parse(formData.get('selectedEventIds') as string) as string[];
        const fallbackSelections = JSON.parse(
            (formData.get('fallbackSelections') as string) || '{}'
        ) as Record<string, string>;
        const transactionId = formData.get('transactionId') as string;
        const screenshot = formData.get('screenshot') as File;

        // ── Basic validation ──
        if (!name || !email || !mobile || !college || !year) {
            return NextResponse.json({ error: 'All personal details are required' }, { status: 400 });
        }
        if (!transactionId || !screenshot) {
            return NextResponse.json({ error: 'Payment details are required' }, { status: 400 });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }
        if (!/^\d{10}$/.test(mobile)) {
            return NextResponse.json({ error: 'Mobile must be 10 digits' }, { status: 400 });
        }

        // ── Resolve events ──
        const selectedEvents = selectedEventIds.map((id) => EVENTS.find((e) => e.id === id)).filter(Boolean);
        if (selectedEvents.length !== selectedEventIds.length) {
            return NextResponse.json({ error: 'One or more invalid event IDs' }, { status: 400 });
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
                    { status: 400 }
                );
            }
            const fallbackEvent = EVENTS.find((e) => e.id === fallbackId);
            if (!fallbackEvent || fallbackEvent.eventType === 'ABSTRACT') {
                return NextResponse.json(
                    { error: `Invalid fallback event for "${ae.title}"` },
                    { status: 400 }
                );
            }
        }

        // ── Begin transaction ──
        const client = await getClient();
        try {
            await client.query('BEGIN');

            // Check email/mobile uniqueness
            const existing = await client.query(
                'SELECT id FROM users WHERE email = $1 OR mobile = $2',
                [email, mobile]
            );
            if (existing.rows.length > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json(
                    { error: 'Email or mobile already registered' },
                    { status: 409 }
                );
            }

            // Generate unique code (retry up to 5 times for collisions)
            let uniqueCode = '';
            for (let i = 0; i < 5; i++) {
                const candidate = generateUniqueCode();
                const codeCheck = await client.query(
                    'SELECT id FROM users WHERE unique_code = $1',
                    [candidate]
                );
                if (codeCheck.rows.length === 0) {
                    uniqueCode = candidate;
                    break;
                }
            }
            if (!uniqueCode) {
                await client.query('ROLLBACK');
                return NextResponse.json(
                    { error: 'Failed to generate unique code. Please try again.' },
                    { status: 500 }
                );
            }

            // Insert user
            const userResult = await client.query(
                `INSERT INTO users (name, email, mobile, college, year, unique_code)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [name, email, mobile, college, year, uniqueCode]
            );
            const userId = userResult.rows[0].id;

            // Insert event registrations
            for (const event of selectedEvents as typeof EVENTS) {
                const fallbackId = fallbackSelections[event.id] || null;
                const status = event.eventType === 'ABSTRACT' ? 'CONFIRMED' : 'CONFIRMED';
                const attendanceStatus = event.timeSlot === 'ONLINE' ? 'NOT_REQUIRED' : 'PENDING';

                await client.query(
                    `INSERT INTO event_registrations (user_id, event_id, fallback_event_id, status, attendance_status)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [userId, event.id, fallbackId, status, attendanceStatus]
                );
            }

            // Upload payment screenshot
            const screenshotBuffer = Buffer.from(await screenshot.arrayBuffer());
            const screenshotUrl = await uploadToS3(
                screenshotBuffer,
                screenshot.name,
                screenshot.type,
                'payments',
                userId
            );

            // Insert payment record
            await client.query(
                `INSERT INTO payments (user_id, amount, screenshot_url, transaction_id)
                 VALUES ($1, $2, $3, $4)`,
                [userId, REGISTRATION_PRICE, screenshotUrl, transactionId]
            );

            await client.query('COMMIT');

            // Send confirmation email
            const submissionEvents = getSubmissionEvents(selectedEvents as typeof EVENTS);
            const allNeedSubmission = [...abstractEvents, ...submissionEvents];
            try {
                await sendRegistrationEmail({
                    to: email,
                    name,
                    uniqueCode,
                    events: (selectedEvents as typeof EVENTS).map((e) => ({
                        title: e.title,
                        eventType: e.eventType,
                        submissionEmail: e.submissionEmail,
                    })),
                    amount: REGISTRATION_PRICE,
                });
            } catch (emailErr) {
                console.error('Email send failed (registration still saved):', emailErr);
            }

            return NextResponse.json({
                success: true,
                uniqueCode,
                events: (selectedEvents as typeof EVENTS).map((e) => e.title),
                amount: REGISTRATION_PRICE,
                hasSubmissionEvents: allNeedSubmission.length > 0,
            });
        } catch (txErr) {
            await client.query('ROLLBACK');
            throw txErr;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Registration error:', err);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
