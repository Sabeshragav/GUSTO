import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { query } from '@/lib/db';
import { EVENTS } from '@/data/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    const url = new URL(req.url);
    const eventFilter = url.searchParams.get('event');
    const abstractFilter = url.searchParams.get('abstractStatus');
    const paymentFilter = url.searchParams.get('paymentStatus');
    const checkinFilter = url.searchParams.get('checkedIn');
    const attendanceFilter = url.searchParams.get('attendanceStatus');

    // Pagination params
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

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
        // Only consider abstract-based events for this filter
        conditions.push(`er.event_id IN ('paper-presentation', 'project-presentation')`);
    }
    if (paymentFilter) {
        conditions.push(`p.status = $${paramIndex++}`);
        params.push(paymentFilter);
    }
    if (checkinFilter !== null && checkinFilter !== undefined && checkinFilter !== '') {
        // Handle NULL as false for not checked in
        if (checkinFilter === 'false') {
            conditions.push(`(u.checked_in = $${paramIndex++} OR u.checked_in IS NULL)`);
            params.push(false);
        } else {
            conditions.push(`u.checked_in = $${paramIndex++}`);
            params.push(true);
        }
    }
    if (attendanceFilter) {
        conditions.push(`er.attendance_status = $${paramIndex++}`);
        params.push(attendanceFilter);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Count total matching records (for pagination metadata)
    const countResult = await query(
        `SELECT COUNT(DISTINCT u.id) as total
         FROM users u
         LEFT JOIN event_registrations er ON u.id = er.user_id
         LEFT JOIN payments p ON u.id = p.user_id
         ${whereClause}`,
        params
    );
    const total = parseInt(countResult.rows[0]?.total || '0', 10);
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated registrations
    const result = await query(
        `SELECT
            u.id, u.name, u.email, u.mobile, u.college, u.year,
            u.unique_code, u.checked_in, u.check_in_time, u.created_at, u.food_preference,
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
        ORDER BY u.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
        [...params, limit, offset]
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

    return NextResponse.json({
        registrations,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
        eventList: EVENTS.map((e) => ({ id: e.id, title: e.title })),
    });
}
