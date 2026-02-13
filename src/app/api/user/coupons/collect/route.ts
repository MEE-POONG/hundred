
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import UserCoupon from '@/models/UserCoupon';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            // If user is not logged in, we cannot save to account.
            // Client side should prompt login.
            return NextResponse.json({ error: 'Please login to collect coupons' }, { status: 401 });
        }

        const { couponId } = await req.json();
        if (!couponId) return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });

        await connectDB();

        // 1. Check Coupon Validity
        const coupon = await Coupon.findById(couponId);
        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ error: 'Coupon not available' }, { status: 404 });
        }

        if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
            return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json({ error: 'Coupon fully redeemed' }, { status: 400 });
        }

        // 2. Check if already collected
        const userId = (session.user as any).id;
        const existing = await UserCoupon.findOne({ user: userId, coupon: couponId });

        if (existing) {
            return NextResponse.json({ message: 'Already collected', collected: true });
        }

        // 3. Save UserCoupon
        const userCoupon = new UserCoupon({
            user: userId,
            coupon: couponId,
            isUsed: false
        });
        await userCoupon.save();

        return NextResponse.json({ message: 'Coupon collected successfully', collected: true });

    } catch (error) {
        console.error('Collect coupon error:', error);
        return NextResponse.json({ error: 'Failed to collect coupon' }, { status: 500 });
    }
}
