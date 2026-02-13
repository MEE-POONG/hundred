
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';
import UserCoupon from '@/models/UserCoupon';

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const userId = session?.user ? (session.user as any).id : null;

        const now = new Date();

        // 1. Fetch Active Coupons (Public info)
        const coupons = await Coupon.find({
            isActive: true,
            $or: [
                { expirationDate: { $gt: now } }, // Not expired
                { expirationDate: null }
            ],
            $or: [
                { usageLimit: null },
                { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
            ]
        }).select('code description discountType discountValue minPurchase expirationDate usedCount usageLimit')
            .sort({ discountValue: -1 });

        // 2. If User Logged In, Check collected status
        let collectedMap: Record<string, boolean> = {};
        if (userId) {
            const userCoupons = await UserCoupon.find({ user: userId, isUsed: false });
            userCoupons.forEach((uc: any) => {
                collectedMap[uc.coupon.toString()] = true;
            });
        }

        // 3. Transform Data
        const result = coupons.map((c: any) => ({
            _id: c._id,
            code: c.code,
            description: c.description,
            discountType: c.discountType,
            discountValue: c.discountValue,
            minPurchase: c.minPurchase,
            expirationDate: c.expirationDate,
            isCollected: !!collectedMap[c._id.toString()]
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Fetch active coupons error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}
