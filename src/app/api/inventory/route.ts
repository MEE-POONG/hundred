import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Inventory from '@/models/Inventory';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json([]);
    }

    await connectDB();
    const userId = (session.user as any).id;
    const items = await Inventory.find({ user: userId, quantity: { $gt: 0 } }).lean();

    return NextResponse.json(items);
}
