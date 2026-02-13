import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Review from '@/models/Review';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const userId = (session.user as any).id;

        // 1. Find Orders delivered within last 5 days
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const orders = await Order.find({
            user: userId,
            status: 'delivered',
            deliveredAt: { $gte: fiveDaysAgo }, // Or updatedAt if deliveredAt logic isn't strictly used yet
        }).lean();

        if (!orders.length) {
            return NextResponse.json([]);
        }

        // 2. Find existing reviews for these orders
        const orderIds = orders.map(o => o._id);
        const reviews = await Review.find({
            user: userId,
            order: { $in: orderIds },
        }).select('product order').lean();

        // Set of reviewed item keys (orderId_productId)
        const reviewedSet = new Set(reviews.map(r => `${r.order}_${r.product}`));

        // 3. Extract pending items
        const pendingReviews: any[] = [];

        for (const order of orders) {
            // Calculate exact deadline for this order
            const deliveredDate = new Date(order.deliveredAt || order.updatedAt);
            const deadline = new Date(deliveredDate.getTime() + 5 * 24 * 60 * 60 * 1000);
            const timeLeft = deadline.getTime() - Date.now();

            if (timeLeft <= 0) continue; // Skip if expired exactly now

            for (const item of order.items) {
                if (!reviewedSet.has(`${order._id}_${item.productId}`)) {
                    pendingReviews.push({
                        orderId: order._id,
                        productId: item.productId,
                        productName: item.productName,
                        productImage: item.productImage,
                        price: item.price,
                        deliveredAt: order.deliveredAt || order.updatedAt,
                        deadline: deadline.toISOString(),
                    });
                }
            }
        }

        return NextResponse.json(pendingReviews);

    } catch (error) {
        console.error('Pending reviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
