
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Redemption from '@/models/Redemption';

// GET: Fetch user's own redemption detail
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params for Next.js 15+

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        await connectDB();

        const redemption = await Redemption.findOne({
            _id: id,
            user: userId
        }).lean();

        if (!redemption) {
            return NextResponse.json({ error: 'Redemption not found' }, { status: 404 });
        }

        return NextResponse.json(redemption);
    } catch (error) {
        console.error('Fetch user redemption detail error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
