import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Inventory from '@/models/Inventory';
import Product from '@/models/Product';
import Order from '@/models/Order';
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
        if (!product || !product.redeemable || !product.redeemable.requiredTickets?.length) {
            await sessionDB.abortTransaction();
            return NextResponse.json({ error: 'Product not redeemable' }, { status: 400 });
        }

        if (product.stock < 1) {
            await sessionDB.abortTransaction();
            return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
        }

        // 2. Check User Inventory
        // Get all user tickets
        const userTickets = await Inventory.find({
            user: userId,
            itemType: 'ticket_card',
            quantity: { $gt: 0 }
        }).session(sessionDB);

        // Verify requirements
        for (const requirement of product.redeemable.requiredTickets) {
            // Find matching ticket in inventory by ID or Rarity
            // Our Inventory uses itemId = 't1', 't2' which maps to rarity
            // Requirement might specify ticketId or rarity. Let's try matching by rarity first as it's safer.
            const userHas = userTickets.find(t => t.rarity === requirement.rarity);

            if (!userHas || userHas.quantity < requirement.quantity) {
                await sessionDB.abortTransaction();
                return NextResponse.json({
                    error: `Insufficient tickets: Need ${requirement.quantity} ${requirement.rarity}`
                }, { status: 400 });
            }
        }

        // 3. Deduct Tickets
        for (const requirement of product.redeemable.requiredTickets) {
            await Inventory.findOneAndUpdate(
                { user: userId, itemType: 'ticket_card', rarity: requirement.rarity },
                { $inc: { quantity: -requirement.quantity } },
                { session: sessionDB }
            );
        }

        // 4. Create Order (Redemption)
        const orderNumber = `RED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newOrder = await Order.create([{
            orderNumber,
            user: userId,
            items: [{
                productId: product._id,
                productName: product.name,
                productImage: product.images?.[0] || '',
                price: 0,
                salePrice: 0,
                quantity: 1
            }],
            subtotal: 0,
            shipping: 0,
            discount: 0,
            total: 0,
            status: 'pending_payment', // Use pending so admin checks it, or 'processing'
            paymentMethod: 'redemption',
            shippingAddress: {
                name: session.user.name || 'Redeemed User',
                address: 'Pending Address Confirmation', // Placeholder
                phone: (session.user as any).phone || '-',
                district: '-',
                province: '-',
                postalCode: '-'
            }
        }], { session: sessionDB });

        // 5. Update Product Stock
        product.stock -= 1;
        await product.save({ session: sessionDB });

        await sessionDB.commitTransaction();

        return NextResponse.json({ success: true, orderId: newOrder[0]._id });

    } catch (error) {
        await sessionDB.abortTransaction();
        console.error('Redemption error:', error);
        return NextResponse.json({ error: 'Redemption failed' }, { status: 500 });
    } finally {
        sessionDB.endSession();
    }
}
