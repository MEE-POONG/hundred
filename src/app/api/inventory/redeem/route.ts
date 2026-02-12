import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Inventory from '@/models/Inventory';
import Product from '@/models/Product';
import Redemption from '@/models/Redemption';
import mongoose from 'mongoose';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const { productId } = await request.json();

    if (!productId) {
        return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const sessionDB = await mongoose.startSession();
    sessionDB.startTransaction();

    try {
        // 1. Get Product & Verify Redeem Rules
        const product = await Product.findById(productId).session(sessionDB);

        if (!product) {
            await sessionDB.abortTransaction();
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.stock < 1) {
            await sessionDB.abortTransaction();
            return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
        }

        // Check redemption rules
        // Assuming product schema has 'redeemable' field or similar logic
        // If schema doesn't match perfectly, you might need to adjust this part
        const requiredTickets = product.redeemable?.requiredTickets || [];

        if (!requiredTickets || requiredTickets.length === 0) {
            await sessionDB.abortTransaction();
            return NextResponse.json({ error: 'This product is not redeemable' }, { status: 400 });
        }

        // 2. Check User Inventory
        const userTickets = await Inventory.find({
            user: userId,
            itemType: 'ticket_card',
            quantity: { $gt: 0 }
        }).session(sessionDB);

        // Verify requirements
        for (const requirement of requiredTickets) {
            const userHas = userTickets.find(t => t.rarity === requirement.rarity);
            if (!userHas || userHas.quantity < requirement.quantity) {
                await sessionDB.abortTransaction();
                return NextResponse.json({
                    error: `Insufficient tickets: Need ${requirement.quantity} ${requirement.rarity}`
                }, { status: 400 });
            }
        }

        // 3. Deduct Tickets
        for (const requirement of requiredTickets) {
            await Inventory.findOneAndUpdate(
                { user: userId, itemType: 'ticket_card', rarity: requirement.rarity },
                { $inc: { quantity: -requirement.quantity } },
                { session: sessionDB }
            );
        }

        // 4. Create Redemption Record
        const newRedemption = await Redemption.create([{
            user: userId,
            productName: product.name,
            productImage: product.images?.[0] || '',
            ticketsUsed: requiredTickets,
            status: 'pending',
            shippingAddress: {
                name: session.user.name || 'Unknown',
                phone: (session.user as any).phone || '-',
                address: 'Please update address'
            },
            trackingNumber: '',
            rejectedReason: ''
        }], { session: sessionDB });

        // 5. Update Product Stock
        product.stock -= 1;
        await product.save({ session: sessionDB });

        await sessionDB.commitTransaction();

        return NextResponse.json({ success: true, redemptionId: newRedemption[0]._id });

    } catch (error) {
        await sessionDB.abortTransaction();
        console.error('Redemption error:', error);
        return NextResponse.json({ error: 'Redemption failed' }, { status: 500 });
    } finally {
        sessionDB.endSession();
    }
}
