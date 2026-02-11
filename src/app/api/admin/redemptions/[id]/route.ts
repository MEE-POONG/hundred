import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Redemption from '@/models/Redemption';

// PATCH: Update redemption status (approve, reject, ship, complete)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    try {
        const body = await request.json();
        const { status, rejectedReason, trackingNumber } = body;

        const updateData: any = { status };

        if (status === 'approved') updateData.approvedAt = new Date();
        if (status === 'rejected') updateData.rejectedReason = rejectedReason || 'ไม่ผ่านเงื่อนไข';
        if (status === 'shipped') {
            updateData.shippedAt = new Date();
            if (trackingNumber) updateData.trackingNumber = trackingNumber;
        }
        if (status === 'completed') updateData.completedAt = new Date();

        const redemption = await Redemption.findByIdAndUpdate(id, updateData, { new: true });

        if (!redemption) {
            return NextResponse.json({ error: 'ไม่พบข้อมูลการแลก' }, { status: 404 });
        }

        return NextResponse.json(redemption);
    } catch (error) {
        console.error('Redemption update error:', error);
        return NextResponse.json({ error: 'Failed to update redemption' }, { status: 500 });
    }
}
