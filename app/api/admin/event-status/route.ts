import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    try {
        const { userId, eventId, status } = await req.json();

        if (!userId || !eventId || !status) {
            return NextResponse.json(
                { error: 'userId, eventId, and status are required' },
                { status: 400 }
            );
        }

        const validStatuses = ['PENDING', 'PRESENT', 'ABSENT', 'NOT_REQUIRED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Status must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        // Gate: only allow marking attendance if user is checked in
        const userCheck = await query(
            'SELECT checked_in FROM users WHERE id = $1',
            [userId]
        );
        if (userCheck.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (!userCheck.rows[0].checked_in) {
            return NextResponse.json(
                { error: 'User must be checked in before marking attendance' },
                { status: 403 }
            );
        }

        const result = await query(
            `UPDATE event_registrations
             SET attendance_status = $1
             WHERE user_id = $2 AND event_id = $3
             RETURNING id, event_id, attendance_status`,
            [status, userId, eventId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Event registration not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, registration: result.rows[0] });
    } catch (err) {
        console.error('Event status update error:', err);
        return NextResponse.json({ error: 'Failed to update event status' }, { status: 500 });
    }
}
