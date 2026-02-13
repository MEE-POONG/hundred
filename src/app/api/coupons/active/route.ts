
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function GET() {
    try {
        await connectDB();

        const now = new Date();

        const coupons = await Coupon.find({
            isActive: true,
            $or: [
                { expirationDate: { $gt: now } }, // Not expired
                { expirationDate: null }           // Or no expiration
            ],
            $or: [
                { usageLimit: null },              // No limit
                { $expr: { $lt: ["$usedCount", "$usageLimit"] } } // Or usage < limit
            ]
        }).select('code description discountType discountValue minPurchase expirationDate')
            .sort({ discountValue: -1 }); // Sort by highest discount first

        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Fetch active coupons error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}
