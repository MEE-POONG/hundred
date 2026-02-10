import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';
import Inventory from '@/models/Inventory';
import mongoose from 'mongoose';

// Ticket Types & Probabilities
const TICKET_TYPES = [
    { id: 't1', name: 'Common Ticket', rarity: 'Common', weight: 60, color: '#CD7F32' },
    { id: 't2', name: 'Rare Ticket', rarity: 'Rare', weight: 30, color: '#C0C0C0' },
    { id: 't3', name: 'Epic Ticket', rarity: 'Epic', weight: 9, color: '#FFD700' },
    { id: 't4', name: 'Legendary Ticket', rarity: 'Legendary', weight: 1, color: '#B9F2FF' },
];

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ count: 0 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    // DEMO: Auto-give 5 tickets if 0 available
    const existingCount = await Ticket.countDocuments({ user: userId, status: 'available' });
    if (existingCount === 0) {
        const newTickets = Array(5).fill(null).map(() => ({
            user: userId,
            code: `FREE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            status: 'available',
            source: 'demo_gift'
        }));
        await Ticket.insertMany(newTickets);
    }

    const count = await Ticket.countDocuments({ user: userId, status: 'available' });
    return NextResponse.json({ count });
}

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    const sessionDB = await mongoose.startSession();
    sessionDB.startTransaction();

    try {
        // 1. Check ticket availability (Draw Chances)
        const ticket = await Ticket.findOne({ user: userId, status: 'available' }).session(sessionDB);

        // For DEMO purposes: If user has no tickets, allow 1 free draw per day?
        // Or strictly enforce tickets. Let's enforce tickets.
        if (!ticket) {
            // Check if user is admin, allow free spin for demo? No, let's keep it real.
            await sessionDB.abortTransaction();
            return NextResponse.json({ error: 'No draw tickets available' }, { status: 400 });
        }

        // 2. Randomize Rarity
        const totalWeight = TICKET_TYPES.reduce((sum, t) => sum + t.weight, 0);
        const random = Math.random() * totalWeight;
        let accumulatedWeight = 0;
        let selectedType = TICKET_TYPES[0];

        for (const type of TICKET_TYPES) {
            accumulatedWeight += type.weight;
            if (random <= accumulatedWeight) {
                selectedType = type;
                break;
            }
        }

        // 3. Add to Inventory (The Ticket Card)
        await Inventory.findOneAndUpdate(
            { user: userId, itemId: selectedType.id },
            {
                $inc: { quantity: 1 },
                $setOnInsert: {
                    itemType: 'ticket_card',
                    rarity: selectedType.rarity,
                }
            },
            { upsert: true, new: true, session: sessionDB }
        );

        // 4. Mark draw ticket as used
        ticket.status = 'used';
        ticket.usedAt = new Date();
        // In this model, we don't link to a Reward model here, but we can store the result string
        // Or just mark as used.
        await ticket.save({ session: sessionDB });

        await sessionDB.commitTransaction();

        return NextResponse.json({
            result: {
                id: selectedType.id,
                name: selectedType.name,
                rarity: selectedType.rarity,
                color: selectedType.color
            }
        });

    } catch (error) {
        await sessionDB.abortTransaction();
        console.error('Draw error:', error);
        return NextResponse.json({ error: 'Draw failed' }, { status: 500 });
    } finally {
        sessionDB.endSession();
    }
}
