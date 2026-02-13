
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = (session.user as any).id;

        await connectDB();

        // Aggregate tickets by rarity
        const ticketCounts = await Ticket.aggregate([
            { $match: { user: userId, status: 'available' } },
            { $group: { _id: '$rarity', count: { $sum: 1 } } }
        ]);

        const summary = ticketCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, { common: 0, rare: 0, epic: 0, legendary: 0 });

        return NextResponse.json(summary);
    } catch (error) {
        console.error('Fetch ticket summary error:', error);
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }
}
