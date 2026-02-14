import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { getClient } from '@/lib/db';
import { sendAbstractRejectionEmail } from '@/lib/email';
import { EVENTS } from '@/data/events';

export async function POST(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    try {
        const { userId, eventId, action } = await req.json();

        if (!userId || !eventId || !action) {
            return NextResponse.json(
                { error: 'userId, eventId, and action are required' },
                { status: 400 }
            );
        }

        if (!['APPROVED', 'REJECTED'].includes(action)) {
            return NextResponse.json(
                { error: 'Action must be APPROVED or REJECTED' },
                { status: 400 }
            );
        }

        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Get the event registration
            const regResult = await client.query(
                `SELECT er.id, er.event_id, er.fallback_event_id, er.status, u.name, u.email
                 FROM event_registrations er
                 JOIN users u ON er.user_id = u.id
                 WHERE er.user_id = $1 AND er.event_id = $2`,
                [userId, eventId]
            );

            if (regResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Event registration not found' }, { status: 404 });
            }

            const reg = regResult.rows[0];

            if (action === 'APPROVED') {
                await client.query(
                    `UPDATE event_registrations SET status = 'APPROVED'
                     WHERE user_id = $1 AND event_id = $2`,
                    [userId, eventId]
                );
            } else if (action === 'REJECTED') {
                if (!reg.fallback_event_id) {
                    await client.query('ROLLBACK');
                    return NextResponse.json(
                        { error: 'No fallback event set for this registration' },
                        { status: 400 }
                    );
                }

                // Reject the abstract event
                await client.query(
                    `UPDATE event_registrations SET status = 'REJECTED'
                     WHERE user_id = $1 AND event_id = $2`,
                    [userId, eventId]
                );

                // Create fallback registration
                const fallbackEvent = EVENTS.find((e) => e.id === reg.fallback_event_id);
                const attendanceStatus = fallbackEvent?.timeSlot === 'ONLINE' ? 'NOT_REQUIRED' : 'PENDING';

                await client.query(
                    `INSERT INTO event_registrations (user_id, event_id, status, attendance_status)
                     VALUES ($1, $2, 'CONFIRMED', $3)`,
                    [userId, reg.fallback_event_id, attendanceStatus]
                );

                // Send rejection email
                const originalEventTitle = EVENTS.find((e) => e.id === eventId)?.title || eventId;
                const fallbackTitle = fallbackEvent?.title || reg.fallback_event_id;

                try {
                    await sendAbstractRejectionEmail({
                        to: reg.email,
                        name: reg.name,
                        originalEvent: originalEventTitle,
                        fallbackEvent: fallbackTitle,
                    });
                } catch (emailErr) {
                    console.error('Failed to send rejection email:', emailErr);
                }
            }

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                action,
                eventId,
                fallbackEventId: action === 'REJECTED' ? reg.fallback_event_id : null,
            });
        } catch (txErr) {
            await client.query('ROLLBACK');
            throw txErr;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Abstract review error:', err);
        return NextResponse.json({ error: 'Abstract review failed' }, { status: 500 });
    }
}
