
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import UserCoupon from '@/models/UserCoupon';
import Coupon from '@/models/Coupon';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const userId = (session.user as any).id;
        const now = new Date();

        // Find collected coupons that are NOT used
        const userCoupons = await UserCoupon.find({ user: userId, isUsed: false })
            .populate('coupon') // Populate Coupon details
            .sort({ collectedAt: -1 });

        // Filter valid coupons (active, not expired)
        const validCoupons = userCoupons.filter((uc: any) => {
            const coupon = uc.coupon;
            if (!coupon || !coupon.isActive) return false;
            // Check expiration
            if (coupon.expirationDate && new Date(coupon.expirationDate) < now) return false;
            // Check global usage limit (if applicable, though usually checked at collection, could be double checked here)
            if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return false;

            return true;
        }).map((uc: any) => ({
            _id: uc._id, // UserCoupon ID (to use for redemption reference)
            couponId: uc.coupon._id,
            code: uc.coupon.code,
            type: uc.coupon.type || 'discount',
            description: uc.coupon.description,
            discountType: uc.coupon.discountType,
            discountValue: uc.coupon.discountValue,
            minPurchase: uc.coupon.minPurchase,
            expirationDate: uc.coupon.expirationDate,
        }));

        return NextResponse.json(validCoupons);

    } catch (error) {
        console.error('Fetch my coupons error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}
