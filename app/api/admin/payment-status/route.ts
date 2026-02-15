import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    try {
        const { userId, status } = await req.json();

        if (!userId || !status) {
            return NextResponse.json(
                { error: 'userId and status are required' },
                { status: 400 }
            );
        }

        const validStatuses = ['PENDING', 'VERIFIED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Status must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        const result = await query(
            `UPDATE payments
             SET status = $1
             WHERE user_id = $2
             RETURNING id, status`,
            [status, userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Payment record not found for this user' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, payment: result.rows[0] });
    } catch (err) {
        console.error('Payment status update error:', err);
        return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    }
}
