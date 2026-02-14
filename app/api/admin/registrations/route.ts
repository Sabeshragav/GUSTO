import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { query } from '@/lib/db';
import { EVENTS } from '@/data/events';

export async function GET(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    const url = new URL(req.url);
    const eventFilter = url.searchParams.get('event');
    const abstractFilter = url.searchParams.get('abstractStatus');
    const paymentFilter = url.searchParams.get('paymentStatus');
    const checkinFilter = url.searchParams.get('checkedIn');
    const attendanceFilter = url.searchParams.get('attendanceStatus');

    // Build dynamic WHERE clauses
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (eventFilter) {
        conditions.push(`er.event_id = $${paramIndex++}`);
        params.push(eventFilter);
    }
    if (abstractFilter) {
        conditions.push(`er.status = $${paramIndex++}`);
        params.push(abstractFilter);
    }
    if (paymentFilter) {
        conditions.push(`p.status = $${paramIndex++}`);
        params.push(paymentFilter);
    }
    if (checkinFilter !== null && checkinFilter !== undefined && checkinFilter !== '') {
        conditions.push(`u.checked_in = $${paramIndex++}`);
        params.push(checkinFilter === 'true');
    }
    if (attendanceFilter) {
        conditions.push(`er.attendance_status = $${paramIndex++}`);
        params.push(attendanceFilter);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Fetch registrations with events and payments
    const result = await query(
        `SELECT
            u.id, u.name, u.email, u.mobile, u.college, u.year,
            u.unique_code, u.checked_in, u.check_in_time, u.created_at,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'event_id', er.event_id,
                        'fallback_event_id', er.fallback_event_id,
                        'status', er.status,
                        'attendance_status', er.attendance_status
                    )
                ) FILTER (WHERE er.id IS NOT NULL), '[]'
            ) as events,
            (SELECT json_agg(
                jsonb_build_object(
                    'screenshot_url', p2.screenshot_url,
                    'transaction_id', p2.transaction_id,
                    'status', p2.status,
                    'amount', p2.amount
                )
            ) FROM payments p2 WHERE p2.user_id = u.id) as payment
        FROM users u
        LEFT JOIN event_registrations er ON u.id = er.user_id
        LEFT JOIN payments p ON u.id = p.user_id
        ${whereClause}
        GROUP BY u.id
        ORDER BY u.created_at DESC`,
        params
    );

    // Map event IDs to titles
    const eventMap = Object.fromEntries(EVENTS.map((e) => [e.id, e.title]));

    const registrations = result.rows.map((row) => ({
        ...row,
        events: (row.events || []).map((e: { event_id: string; fallback_event_id: string | null; status: string; attendance_status: string }) => ({
            ...e,
            event_title: eventMap[e.event_id] || e.event_id,
            fallback_event_title: e.fallback_event_id ? eventMap[e.fallback_event_id] || e.fallback_event_id : null,
        })),
    }));

    // Stats
    const statsResult = await query(`
        SELECT
            COUNT(DISTINCT u.id) as total,
            COUNT(DISTINCT CASE WHEN u.checked_in = true THEN u.id END) as checked_in,
            COUNT(DISTINCT CASE WHEN p.status = 'VERIFIED' THEN u.id END) as payment_verified,
            COUNT(CASE WHEN er.status = 'CONFIRMED' AND EXISTS (
                SELECT 1 FROM event_registrations er2
                WHERE er2.user_id = u.id AND er2.fallback_event_id IS NOT NULL
                AND er2.status = 'CONFIRMED'
            ) THEN 1 END) as abstracts_pending
        FROM users u
        LEFT JOIN event_registrations er ON u.id = er.user_id
        LEFT JOIN payments p ON u.id = p.user_id
    `);

    return NextResponse.json({
        registrations,
        stats: statsResult.rows[0] || {
            total: 0,
            checked_in: 0,
            payment_verified: 0,
            abstracts_pending: 0,
        },
        eventList: EVENTS.map((e) => ({ id: e.id, title: e.title })),
    });
}
