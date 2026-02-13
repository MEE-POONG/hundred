
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Reward from '@/models/Reward';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();
        const reward = await Reward.findById(id);
        if (!reward) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        return NextResponse.json(reward);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reward' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, image, type, rarity, probability, stock, isRedeemable, ticketCost } = body;

        await connectDB();
        const reward = await Reward.findById(id);
        if (!reward) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

        reward.name = name;
        if (description) reward.description = description;
        if (image) reward.image = image;
        if (type) reward.type = type;
        if (rarity) reward.rarity = rarity;

        // Handle optional boolean and objects carefully
        reward.probability = probability !== undefined ? probability : reward.probability;
        reward.stock = stock !== undefined ? stock : reward.stock;
        reward.isRedeemable = isRedeemable !== undefined ? isRedeemable : reward.isRedeemable;

        if (ticketCost) reward.ticketCost = ticketCost;

        await reward.save();
        return NextResponse.json(reward);

    } catch (error) {
        console.error('Update reward error:', error);
        return NextResponse.json({ error: 'Failed to update reward' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        await Reward.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete reward' }, { status: 500 });
    }
}
