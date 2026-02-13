import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import bcrypt from 'bcryptjs';

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

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        const body = await req.json();
        // Separate logic: password change vs profile update
        const { name, phone, currentPassword, newPassword, image } = body;

        await connectDB();

        const userId = (session.user as any).id;
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
        }

        // 1. Password Change Logic
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }, { status: 400 });
            }
            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' }, { status: 400 });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            return NextResponse.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
        }

        // 2. Profile Update Logic
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (image) user.image = image;

        await user.save();

        return NextResponse.json({
            message: 'อัปเดตข้อมูลสำเร็จ',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
