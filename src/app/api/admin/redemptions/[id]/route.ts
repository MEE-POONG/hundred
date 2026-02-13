
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Redemption from '@/models/Redemption';
import User from '@/models/User';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params for Next.js 15+

        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const redemption = await Redemption.findById(id)
            .populate('user', 'name email phone image')
            .lean();

        if (!redemption) {
            return NextResponse.json({ error: 'Redemption not found' }, { status: 404 });
        }

        return NextResponse.json(redemption);
    } catch (error) {
        console.error('Admin Fetch Redemption Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params for Next.js 15+

        if (!id) {
            console.error('API Error: params.id is missing');
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }
        console.log('Admin PATCH Redemption ID:', id);

        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { status, trackingNumber, rejectedReason } = body;

        await connectDB();

        const redemption = await Redemption.findById(id);

        if (!redemption) {
            return NextResponse.json({ error: 'Redemption not found' }, { status: 404 });
        }

        // Update fields based on status change
        if (status) {
            redemption.status = status;

            // Set timestamps only if changing to that status for the first time
            if (status === 'approved' && !redemption.approvedAt) redemption.approvedAt = new Date();
            if (status === 'shipped' && !redemption.shippedAt) redemption.shippedAt = new Date();
            if (status === 'completed' && !redemption.completedAt) redemption.completedAt = new Date();
        }

        if (trackingNumber !== undefined) redemption.trackingNumber = trackingNumber;
        if (rejectedReason !== undefined) redemption.rejectedReason = rejectedReason;

        await redemption.save();

        return NextResponse.json(redemption);
    } catch (error) {
        console.error('Admin Update Redemption Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
