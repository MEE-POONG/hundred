import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        await connectDB();

        const userId = (session.user as any).id;
        const role = (session.user as any).role;

        const order = await Order.findById(params.id);
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
