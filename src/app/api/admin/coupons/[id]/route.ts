
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { code, type, description, discountType, discountValue, minPurchase, expirationDate, usageLimit, isActive } = body;

        await connectDB();
        const coupon = await Coupon.findById(id);

        if (!coupon) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

        if (code) coupon.code = code.toUpperCase();
        if (type) coupon.type = type;
        if (description !== undefined) coupon.description = description;
        if (discountType) coupon.discountType = discountType;
        if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
        if (minPurchase !== undefined) coupon.minPurchase = Number(minPurchase);

        // Handle expiration date: can be null
        if (expirationDate !== undefined) {
            coupon.expirationDate = expirationDate ? new Date(expirationDate) : null;
        }

        // Handle usage limit: can be null
        if (usageLimit !== undefined) {
            coupon.usageLimit = usageLimit ? Number(usageLimit) : null;
        }

        if (isActive !== undefined) coupon.isActive = isActive;

        await coupon.save();
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        await Coupon.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
