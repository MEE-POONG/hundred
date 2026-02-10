import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ history: [] });
    }

    await connectDB();
    const userId = (session.user as any).id;

    const tickets = await Ticket.find({ user: userId, status: 'used' })
        .populate('reward')
        .sort({ usedAt: -1 })
        .limit(20)
        .lean();

    const history = tickets.map(t => ({
        id: t._id,
        rewardName: t.reward?.name || 'Unknown',
        rewardImage: t.reward?.image || '',
        usedAt: t.usedAt,
        rarity: t.reward?.rarity || 'common'
    }));

    return NextResponse.json({ history });
}
