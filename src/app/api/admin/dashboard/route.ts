import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const [orders, products, users] = await Promise.all([
            Order.find().sort({ createdAt: -1 }).lean(),
            Product.find().lean(),
            User.countDocuments(),
        ]);

        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const totalOrders = orders.length;
        const lowStockProducts = products.filter((p: any) => p.stock < 10).length;
        const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        const ordersByStatus = {
            pending_payment: orders.filter((o: any) => o.status === 'pending_payment').length,
            paid: orders.filter((o: any) => o.status === 'paid').length,
            processing: orders.filter((o: any) => o.status === 'processing').length,
            shipped: orders.filter((o: any) => o.status === 'shipped').length,
            delivered: orders.filter((o: any) => o.status === 'delivered').length,
            cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
        };

        const recentOrders = orders.slice(0, 5);
        const topProducts = products.slice(0, 5);

        return NextResponse.json({
            stats: {
                totalRevenue,
                totalOrders,
                lowStockProducts,
                averageOrderValue,
                totalUsers: users,
            },
            ordersByStatus,
            recentOrders,
            topProducts,
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
    }
}
