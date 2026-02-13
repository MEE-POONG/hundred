
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Reward from '@/models/Reward';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        const reward = await Reward.findOne({
            _id: id,
            isActive: true,
            isRedeemable: true
        });

        if (!reward) {
            return NextResponse.json({ error: 'Reward not found or unavailable' }, { status: 404 });
        }

        return NextResponse.json(reward);
    } catch (error) {
        console.error('Fetch public reward detail error:', error);
        return NextResponse.json({ error: 'Failed to fetch reward' }, { status: 500 });
    }
}
