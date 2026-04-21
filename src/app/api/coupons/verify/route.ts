
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
    try {
        const { code, subtotal } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        await connectDB();

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
        }

        // Check Expiration
        if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
            return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }

        // Check Usage Limit
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }

        // Check Min Purchase
        if (subtotal < (coupon.minPurchase || 0)) {
            return NextResponse.json({ error: `Minimum purchase of ฿${coupon.minPurchase} required` }, { status: 400 });
        }

        // Calculate Discount
        let discount = 0;
        if (coupon.type === 'shipping') {
            discount = 0; // Shipping discount is handled separately in frontend/order logic
        } else if (coupon.discountType === 'percent') {
            discount = (subtotal * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed subtotal
        discount = Math.min(discount, subtotal);

        return NextResponse.json({
            valid: true,
            code: coupon.code,
            type: coupon.type || 'discount',
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            calculatedDiscount: discount,
            message: coupon.type === 'shipping' ? 'โค้ดส่งฟรีถูกใช้งานแล้ว' : 'คูปองถูกใช้งานแล้ว'
        });

    } catch (error) {
        console.error('Verify coupon error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
