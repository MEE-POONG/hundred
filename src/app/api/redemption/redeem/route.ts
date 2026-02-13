
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Redemption from '@/models/Redemption';
import Reward from '@/models/Reward';
import Ticket from '@/models/Ticket';
import User from '@/models/User';

export async function POST(req: Request) {
    let sessionMongoose;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = (session.user as any).id;

        const { rewardId, shippingAddress } = await req.json();

        if (!rewardId) {
            return NextResponse.json({ error: 'Reward ID is required' }, { status: 400 });
        }

        // Connect DB and get mongoose instance
        const mongoose = await connectDB();

        if (!mongoose) {
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

        // 1. Check Reward
        const reward = await Reward.findById(rewardId);
        if (!reward || !reward.isActive || !reward.isRedeemable) { // changed active to isActive based on model
            return NextResponse.json({ error: 'Reward not available' }, { status: 404 });
        }
        if (reward.stock <= 0) {
            return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
        }

        // 2. Check User Tickets
        // ticketCost format: { common: 10, rare: 2 } (Map or Object)
        // If stored as Map in Mongoose, we might need to access it differently, but lean() or toObject() usually converts to POJO.
        // Assuming it behaves like an object here for simplicity.
        const requiredTickets = reward.ticketCost instanceof Map ? Object.fromEntries(reward.ticketCost) : reward.ticketCost || {};
        const ticketsToBurn: string[] = [];

        for (const [rarity, qty] of Object.entries(requiredTickets)) {
            if (Number(qty) <= 0) continue;

            // Check total available tickets
            const userTickets = await Ticket.find({
                user: userId,
                rarity: rarity,
                status: 'available'
            }).limit(Number(qty));

            if (userTickets.length < Number(qty)) {
                return NextResponse.json({ error: `Not enough ${rarity} tickets` }, { status: 400 });
            }

            // Collect IDs to burn
            userTickets.forEach(t => ticketsToBurn.push(t._id.toString()));
        }

        // 3. Process Redemption (Transaction)
        sessionMongoose = await mongoose.startSession();
        sessionMongoose.startTransaction();

        try {
            // Burn tickets
            await Ticket.updateMany(
                { _id: { $in: ticketsToBurn } },
                { $set: { status: 'used', usedAt: new Date(), reward: reward._id } },
                { session: sessionMongoose }
            );

            // Decrease Stock
            // Need to reload reward within session for consistency, or just update
            await Reward.findByIdAndUpdate(rewardId, { $inc: { stock: -1 } }, { session: sessionMongoose });

            // Create Redemption
            const redemption = new Redemption({
                user: userId,
                reward: reward._id,
                productName: reward.name,
                productImage: reward.image,
                ticketsUsed: Object.entries(requiredTickets).map(([r, q]) => ({ rarity: r, quantity: Number(q) })),
                shippingAddress,
                status: 'pending'
            });

            await redemption.save({ session: sessionMongoose });

            await sessionMongoose.commitTransaction();
            return NextResponse.json(redemption, { status: 201 });

        } catch (err) {
            await sessionMongoose.abortTransaction();
            throw err;
        }

    } catch (error) {
        console.error('Redeem error:', error);
        return NextResponse.json({ error: 'Redemption failed' }, { status: 500 });
    } finally {
        if (sessionMongoose) {
            sessionMongoose.endSession();
        }
    }
}
