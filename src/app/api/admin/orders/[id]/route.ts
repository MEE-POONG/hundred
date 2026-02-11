import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();

        const updateData: any = {};

        // Handle Status Change
        if (body.status) {
            updateData.status = body.status;

            // If status is changed to PAID, reduce stock
            if (body.status === 'paid') {
                updateData.paidAt = new Date();

                // Check prevent stock deduction multiple times
                const currentOrder = await Order.findById(id);
                // Only reduce stock if previous status was NOT paid/shipped/delivered
                const isAlreadyPaid = ['paid', 'shipped', 'delivered'].includes(currentOrder?.status || '');

                if (currentOrder && !isAlreadyPaid) {
                    try {
                        const Product = (await import('@/models/Product')).default;
                        // Loop through items and reduce stock
                        for (const item of currentOrder.items) {
                            await Product.findByIdAndUpdate(item.product, {
                                $inc: { stock: -item.quantity, sold: item.quantity }
                            });
                        }
                    } catch (stockError) {
                        console.error('Failed to adjust stock:', stockError);
                    }
                }
            }

            if (body.status === 'shipped') updateData.shippedAt = new Date();
            if (body.status === 'delivered') updateData.deliveredAt = new Date();
        }

        // Handle Tracking Number
        if (body.trackingNumber) updateData.trackingNumber = body.trackingNumber;

        // Perform Update
        const order = await Order.findByIdAndUpdate(id, { ...updateData, ...body }, { new: true });

        if (!order) {
            return NextResponse.json({ error: 'ไม่พบออเดอร์' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Admin order update error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
