import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

// GET: All Orders (Admin Only)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        // Get query params for filtering
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const query: any = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            // Find users matching search first (for user name search)
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(u => u._id);

            query.$or = [
                { _id: { $regex: search, $options: 'i' } }, // Search by Order ID
                { user: { $in: userIds } }, // Search by User
                // Add shipping address search if schema supports it
                { 'shippingAddress.name': { $regex: search, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('user', 'name email image')
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
