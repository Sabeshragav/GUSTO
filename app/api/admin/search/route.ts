import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { query } from '@/lib/db';
import { EVENTS } from '@/data/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const queryTerm = url.searchParams.get('q');

    // Mode 1: Full Details by Unique Code (for selection/refresh)
    if (code) {
        try {
            const userResult = await query(
                `SELECT id, name, email, mobile, college, year, unique_code, checked_in, check_in_time, created_at
                 FROM users WHERE unique_code = $1`,
                [code]
            );

            if (userResult.rows.length === 0) {
                return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
            }

            const user = userResult.rows[0];

            const eventsResult = await query(
                `SELECT event_id, fallback_event_id, status, attendance_status, created_at
                 FROM event_registrations WHERE user_id = $1`,
                [user.id]
            );

            const paymentResult = await query(
                `SELECT amount, screenshot_url, transaction_id, status, created_at
                 FROM payments WHERE user_id = $1`,
                [user.id]
            );

            const eventMap = Object.fromEntries(EVENTS.map((e) => [e.id, e.title]));

            return NextResponse.json({
                user,
                events: eventsResult.rows.map((row) => ({
                    ...row,
                    event_title: eventMap[row.event_id] || row.event_id,
                    fallback_event_title: row.fallback_event_id
                        ? eventMap[row.fallback_event_id] || row.fallback_event_id
                        : null,
                })),
                payment: paymentResult.rows[0] || null,
            });
        } catch (err) {
            console.error('Detail fetch error:', err);
            return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
        }
    }

    // Mode 2: Auto-complete Search (by name/email/mobile/code)
    if (!queryTerm || queryTerm.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        const sql = `
            SELECT id, name, email, mobile, college, year, unique_code, checked_in
            FROM users 
            WHERE 
                unique_code ILIKE $1 OR
                name ILIKE $1 OR
                email ILIKE $1 OR
                mobile ILIKE $1
            LIMIT 10
        `;
        const searchTerm = `%${queryTerm}%`;
        
        const userResult = await query(sql, [searchTerm]);
        
        return NextResponse.json({
            results: userResult.rows
        });

    } catch (err) {
        console.error('Search error:', err);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
