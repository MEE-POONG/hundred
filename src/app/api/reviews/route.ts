import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        await connectDB();
        const { productId, orderId, rating, comment, images } = await request.json();
        const userId = (session.user as any).id;

        if (!productId || !orderId || !rating || !comment) {
            return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
        }

        // 1. Verify Order: Valid, User Owner, Delivered, Within 5 days
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
            status: 'delivered', // Must be delivered
        });

        if (!order) {
            return NextResponse.json({ error: 'ไม่พบคำสั่งซื้อหรือสถานะไม่ถูกต้อง' }, { status: 404 });
        }

        const deliveredDate = new Date(order.deliveredAt || order.updatedAt); // fallback if deliveredAt missing
        const deadline = new Date(deliveredDate.getTime() + 5 * 24 * 60 * 60 * 1000); // +5 days
        const now = new Date();

        if (now > deadline) {
            return NextResponse.json({ error: 'หมดเวลารีวิว (เกิน 5 วันหลังจากได้รับสินค้า)' }, { status: 400 });
        }

        // 2. Verify Product is in Order
        const hasProduct = order.items.some((item: any) => item.productId === productId);
        if (!hasProduct) {
            return NextResponse.json({ error: 'สินค้านี้ไม่ได้อยู่ในคำสั่งซื้อ' }, { status: 400 });
        }

        // 3. Check Duplicate Review
        const existingReview = await Review.findOne({
            user: userId,
            product: productId,
            order: orderId,
        });

        if (existingReview) {
            return NextResponse.json({ error: 'คุณรีวิวสินค้านี้ไปแล้ว' }, { status: 400 });
        }

        // 4. Create Review
        const newReview = await Review.create({
            user: userId,
            product: productId,
            order: orderId,
            rating,
            comment,
            images: images || [],
        });

        return NextResponse.json(newReview, { status: 201 });

    } catch (error) {
        console.error('Review submit error:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกรีวิว' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await connectDB();

        const reviews = await Review.find({ product: productId, isPublished: true })
            .populate('user', 'name image') // Get user name & image
            .sort({ createdAt: -1 });

        // Mask Usernames Logic: "Somchai" -> "S*****i"
        const maskedReviews = reviews.map((review: any) => {
            const user = review.user;
            let maskedName = 'ไม่ระบุชื่อ';
            if (user && user.name) {
                const name = user.name;
                if (name.length > 2) {
                    maskedName = `${name[0]}***${name[name.length - 1]}`;
                } else {
                    maskedName = `${name[0]}***`;
                }
            }

            return {
                _id: review._id,
                rating: review.rating,
                comment: review.comment,
                images: review.images,
                createdAt: review.createdAt,
                user: {
                    name: maskedName,
                    image: user?.image || null, // Keep image or default avatar
                },
                adminReply: review.adminReply, // Show Admin Reply
                adminRepliedAt: review.adminRepliedAt,
            };
        });

        return NextResponse.json(maskedReviews);

    } catch (error) {
        console.error('Fetch reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
