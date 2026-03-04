import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { getClient, generateUniqueCode } from '@/lib/db';
import { EVENTS, REGISTRATION_PRICE } from '@/data/events';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    try {
        const body = await req.json();
        const {
            name,
            email,
            mobile,
            college,
            year,
            foodPreference,
            events: selectedEventIds,
            paymentMethod,
            transactionId,
        } = body as {
            name: string;
            email: string;
            mobile: string;
            college: string;
            year: string;
            foodPreference: string;
            events: string[];
            paymentMethod: 'CASH' | 'UPI';
            transactionId?: string;
        };

        // ── Basic validation ──
        if (!name || !email || !mobile || !college || !year) {
            return NextResponse.json(
                { error: 'All personal details are required' },
                { status: 400 },
            );
        }
        if (!selectedEventIds || selectedEventIds.length === 0) {
            return NextResponse.json(
                { error: 'At least one event must be selected' },
                { status: 400 },
            );
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 },
            );
        }
        if (!/^\d{10}$/.test(mobile)) {
            return NextResponse.json(
                { error: 'Mobile must be 10 digits' },
                { status: 400 },
            );
        }
        if (paymentMethod === 'UPI' && !transactionId) {
            return NextResponse.json(
                { error: 'Transaction ID is required for UPI payments' },
                { status: 400 },
            );
        }

        // ── Validate event IDs (exclude abstract events) ──
        const validEventIds = EVENTS
            .filter((e) => e.id !== 'paper-presentation' && e.id !== 'project-presentation')
            .map((e) => e.id);

        for (const id of selectedEventIds) {
            if (!validEventIds.includes(id)) {
                return NextResponse.json(
                    { error: `Invalid event: ${id}` },
                    { status: 400 },
                );
            }
        }

        // ── Begin transaction ──
        const client = await getClient();
        try {
            await client.query('BEGIN');

            // Check email/mobile uniqueness
            const existing = await client.query(
                'SELECT id, email, mobile FROM users WHERE email = $1 OR mobile = $2',
                [email, mobile],
            );
            if (existing.rows.length > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json(
                    { error: 'Email or mobile already registered' },
                    { status: 409 },
                );
            }

            const uniqueCode = generateUniqueCode();

            // Insert user with registration_type = 'ONSPOT'
            const userResult = await client.query(
                `INSERT INTO users (name, email, mobile, college, year, unique_code, food_preference, registration_type)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'ONSPOT')
                 RETURNING id`,
                [name, email, mobile, college, year, uniqueCode, foodPreference || 'VEG'],
            );
            const userId = userResult.rows[0].id;

            // Batch insert event registrations
            if (selectedEventIds.length > 0) {
                const values: unknown[] = [];
                const placeholders: string[] = [];
                selectedEventIds.forEach((eventId: string, i: number) => {
                    const offset = i * 4;
                    placeholders.push(
                        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`,
                    );
                    const event = EVENTS.find((e) => e.id === eventId);
                    values.push(
                        userId,
                        eventId,
                        'CONFIRMED',
                        event?.timeSlot === 'ONLINE' ? 'NOT_REQUIRED' : 'PENDING',
                    );
                });
                await client.query(
                    `INSERT INTO event_registrations (user_id, event_id, status, attendance_status)
                     VALUES ${placeholders.join(', ')}`,
                    values,
                );
            }

            // Insert payment (auto-verified for on-spot)
            await client.query(
                `INSERT INTO payments (user_id, amount, screenshot_url, transaction_id, status)
                 VALUES ($1, $2, $3, $4, 'VERIFIED')`,
                [
                    userId,
                    REGISTRATION_PRICE,
                    'ONSPOT_REGISTRATION',
                    paymentMethod === 'CASH' ? 'CASH' : transactionId,
                ],
            );

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                uniqueCode,
                message: `On-spot registration successful. Code: ${uniqueCode}`,
            });
        } catch (txErr) {
            await client.query('ROLLBACK');
            throw txErr;
        } finally {
            client.release();
        }
    } catch (err: any) {
        console.error('[OnSpot Register] Error:', err?.message || err);

        if (err?.code === '23505') {
            return NextResponse.json(
                { error: 'A duplicate record was detected. This person may already be registered.' },
                { status: 409 },
            );
        }

        return NextResponse.json(
            { error: 'On-spot registration failed. Please try again.' },
            { status: 500 },
        );
    }
}
