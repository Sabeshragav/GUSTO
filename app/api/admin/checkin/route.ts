import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    try {
        const { code, action } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Registration code is required' }, { status: 400 });
        }

        if (action === 'checkin') {
            const result = await query(
                `UPDATE users SET checked_in = true, check_in_time = NOW()
                 WHERE unique_code = $1 AND checked_in = false
                 RETURNING id, name, unique_code, checked_in`,
                [code]
            );

            if (result.rows.length === 0) {
                // Check if already checked in
                const existing = await query(
                    'SELECT checked_in FROM users WHERE unique_code = $1',
                    [code]
                );
                if (existing.rows.length > 0 && existing.rows[0].checked_in) {
                    return NextResponse.json({ error: 'Already checked in' }, { status: 409 });
                }
                return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, user: result.rows[0] });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (err) {
        console.error('Check-in error:', err);
        return NextResponse.json({ error: 'Check-in failed' }, { status: 500 });
    }
}
