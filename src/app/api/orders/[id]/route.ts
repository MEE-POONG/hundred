import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        await connectDB();

        const userId = (session.user as any).id;
        const role = (session.user as any).role;

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: 'ไม่พบออเดอร์' }, { status: 404 });
        }

        // Only allow owner or admin to view
        if (role !== 'admin' && order.user?.toString() !== userId) {
            return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Order detail error:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();
        const userId = (session.user as any).id;
        const role = (session.user as any).role;

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: 'ไม่พบออเดอร์' }, { status: 404 });
        }

        // Only allow owner or admin to update
        if (role !== 'admin' && order.user?.toString() !== userId) {
            return NextResponse.json({ error: 'ไม่มีสิทธิ์แก้ไข' }, { status: 403 });
        }

        // For user: allow status update to 'paid' (if pending) or 'delivered' (if shipped)
        if (role !== 'admin') {
            if (order.status === 'pending_payment' && body.status === 'paid') {
                // Allow user to mark as paid
            } else if (order.status === 'shipped' && body.status === 'delivered') {
                // Allow user to confirm receipt
            } else {
                return NextResponse.json({ error: 'ไม่สามารถเปลี่ยนสถานะนี้ได้' }, { status: 403 });
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                status: body.status,
                ...(body.status === 'paid' ? { paidAt: new Date() } : {}),
                ...(body.status === 'delivered' ? { deliveredAt: new Date() } : {})
            },
            { new: true }
        );

        return NextResponse.json(updatedOrder);

    } catch (error) {
        console.error('Order update error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
