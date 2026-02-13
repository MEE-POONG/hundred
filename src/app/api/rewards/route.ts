
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Reward from '@/models/Reward';

export async function GET() {
    try {
        await connectDB();
        // Fetch only active and redeemable rewards for public view
        const rewards = await Reward.find({
            isActive: true,
            isRedeemable: true
        }).sort({ createdAt: -1 });

        return NextResponse.json(rewards);
    } catch (error) {
        console.error('Fetch public rewards error:', error);
        return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
    }
}
