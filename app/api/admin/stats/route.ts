import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    try {
        const statsResult = await query(`
            SELECT
                COUNT(DISTINCT u.id) as total,
                COUNT(DISTINCT CASE WHEN u.checked_in = true THEN u.id END) as checked_in,
                COUNT(DISTINCT CASE WHEN p.status = 'VERIFIED' THEN u.id END) as payment_verified,
                COUNT(DISTINCT CASE WHEN u.food_preference = 'VEG' THEN u.id END) as veg_count,
                COUNT(DISTINCT CASE WHEN u.food_preference = 'NON_VEG' THEN u.id END) as non_veg_count,
                COUNT(DISTINCT CASE WHEN er.status = 'CONFIRMED' AND er.event_id IN ('paper-presentation', 'project-presentation') THEN u.id END) as abstracts_count
            FROM users u
            LEFT JOIN event_registrations er ON u.id = er.user_id
            LEFT JOIN payments p ON u.id = p.user_id
        `);

        return NextResponse.json({
            stats: statsResult.rows[0] || {
                total: 0,
                checked_in: 0,
                payment_verified: 0,
                veg_count: 0,
                non_veg_count: 0,
                abstracts_count: 0,
            },
        });
    } catch (err) {
        console.error('Stats fetch error:', err);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
