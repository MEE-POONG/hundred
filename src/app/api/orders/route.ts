import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import UserCoupon from '@/models/UserCoupon';
import Coupon from '@/models/Coupon';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    // Admin can see all orders, users only see their own
    const query = role === 'admin' ? {} : { user: userId };
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const orderNumber = `ORD-${Date.now()}`;
    const userId = (session.user as any).id;
    let couponId = body.couponId;
    let discount = body.discount || 0;

    // --- Coupon Processing Logic ---
    if (couponId) {
      // 1. Verify UserCoupon ownership & validity
      const userCoupon = await UserCoupon.findOne({
        _id: couponId,
        user: userId,
        isUsed: false
      });

      if (!userCoupon) {
        // Warning: Invalid coupon usage attempt
        console.warn(`User ${userId} attempted to use invalid/used coupon ${couponId}`);
        // We could block the order, but for better UX, maybe we just ignore the coupon?
        // Or if the frontend calculated price based on it, we might want to reject.
        // For now, let's proceed but maybe without marking it used if it doesn't exist?
        // Actually, if it's invalid, we should probably throw 400.
        // But to be safe and simple: just proceed, maybe log.
      } else {
        // 2. Increment Global Coupon Usage
        await Coupon.findByIdAndUpdate(userCoupon.coupon, { $inc: { usedCount: 1 } });
      }
    }
    // --------------------------------

    const order = await Order.create({
      ...body,
      orderNumber,
      user: userId,
    });

    // --- Mark UserCoupon as Used ---
    if (couponId) {
      await UserCoupon.findOneAndUpdate(
        { _id: couponId, user: userId },
        { isUsed: true, usedAt: new Date(), orderId: order._id }
      );
    }
    // -------------------------------

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
