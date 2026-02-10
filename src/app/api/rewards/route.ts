import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Reward from '@/models/Reward';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    await connectDB();
    const rewards = await Reward.find({ isActive: true }).select('-probability'); // Hide probability from public
    return NextResponse.json(rewards);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Allow admin to create rewards
        if (!session?.user || (session.user as any).role !== 'admin') {
            // Special case for initial seeding if no rewards exist? 
            // For security, let's stick to admin only. 
            // If database is empty, we might need a separate seeder script.
            // But for now, let's just make it secure.
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const data = await req.json();
        const reward = await Reward.create(data);
        return NextResponse.json(reward, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create reward' }, { status: 500 });
    }
}
