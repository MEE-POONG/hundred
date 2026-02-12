import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Redemption from '@/models/Redemption';

// GET: Fetch all redemptions (Admin only)
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    try {
        const redemptions = await Redemption.find()
            .populate('user', 'name email image')
            .sort({ createdAt: -1 });

        return NextResponse.json(redemptions);
    } catch (error) {
        console.error('Redemptions fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch redemptions' }, { status: 500 });
    }
}
