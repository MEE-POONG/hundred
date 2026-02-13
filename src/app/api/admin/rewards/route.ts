
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Reward from '@/models/Reward';

export async function GET() {
    try {
        await connectDB();
        const rewards = await Reward.find().sort({ createdAt: -1 });
        return NextResponse.json(rewards);
    } catch (error) {
        console.error('Fetch rewards error:', error);
        return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Auth Check
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        // Extract fields
        const { name, description, image, type, rarity, probability, stock, isRedeemable, ticketCost } = body;

        if (!name || !image) {
            return NextResponse.json({ error: 'Name and Image are required' }, { status: 400 });
        }

        await connectDB();

        const newReward = new Reward({
            name,
            description,
            image,
            type: type || 'physical',
            rarity: rarity || 'common',
            probability: probability || 0,
            stock: stock || 0,
            isRedeemable: !!isRedeemable,
            ticketCost: ticketCost || {},
        });

        await newReward.save();
        return NextResponse.json(newReward, { status: 201 });

    } catch (error) {
        console.error('Create reward error:', error);
        return NextResponse.json({ error: 'Failed to create reward' }, { status: 500 });
    }
}
