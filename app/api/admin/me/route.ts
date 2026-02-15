import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '../auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authError = validateAdmin(req);
    if (authError) return authError;

    return NextResponse.json({ authenticated: true });
}
