import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();

        const updateData: any = {};
        if (body.status) {
            updateData.status = body.status;
            if (body.status === 'paid') updateData.paidAt = new Date();
            if (body.status === 'shipped') updateData.shippedAt = new Date();
            if (body.status === 'delivered') updateData.deliveredAt = new Date();
        }
        if (body.trackingNumber) updateData.trackingNumber = body.trackingNumber;

        const order = await Order.findByIdAndUpdate(params.id, updateData, { new: true });
        if (!order) {
            return NextResponse.json({ error: 'ไม่พบออเดอร์' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Admin order update error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
