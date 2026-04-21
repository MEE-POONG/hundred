
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Fetch coupons error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { code, type, description, discountType, discountValue, minPurchase, expirationDate, usageLimit, isActive } = body;

        if (!code || (type !== 'shipping' && discountValue === undefined)) {
            return NextResponse.json({ error: 'Code and Discount Value are required' }, { status: 400 });
        }

        await connectDB();

        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }

        const newCoupon = new Coupon({
            code: code.toUpperCase(),
            type: type || 'discount',
            description,
            discountType,
            discountValue: Number(discountValue),
            minPurchase: Number(minPurchase) || 0,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            usageLimit: usageLimit ? Number(usageLimit) : null,
            isActive: isActive
        });

        await newCoupon.save();
        return NextResponse.json(newCoupon, { status: 201 });

    } catch (error) {
        console.error('Create coupon error:', error);
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}
