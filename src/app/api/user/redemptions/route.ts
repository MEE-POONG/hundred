import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Redemption from '@/models/Redemption';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    try {
        const redemptions = await Redemption.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean(); // Use lean for performance

        // Transform to match frontend interface if needed
        // Frontend expects: id, productId (optional), productName, productImage, ticketsUsed, redeemedAt, status
        const formattedRedemptions = redemptions.map((r: any) => ({
            id: r._id.toString(),
            productName: r.productName,
            productImage: r.productImage,
            ticketsUsed: r.ticketsUsed,
            redeemedAt: r.createdAt,
            status: r.status,
            trackingNumber: r.trackingNumber,
            rejectedReason: r.rejectedReason
        }));

        return NextResponse.json(formattedRedemptions);

    } catch (error) {
        console.error('Fetch user redemptions error:', error);
        return NextResponse.json({ error: 'Failed to fetch redemptions' }, { status: 500 });
    }
}
