import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        await connectDB();

        const userId = (session.user as any).id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
        }

        // Get user stats
        const orderCount = await Order.countDocuments({ user: userId });

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                role: user.role,
                createdAt: user.createdAt,
            },
            stats: {
                orders: orderCount,
                points: 0,
                reviews: 0,
            },
        });
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
