import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ensure correct path
import connectDB from '@/lib/db';
import TicketType from '@/models/TicketType';

// Define initial data to seed if DB is empty
const defaultTicketTypes = [
    {
        rarity: 'Common',
        name: 'ตั๋วทองแดง',
        color: '#CD7F32',
        glowColor: 'rgba(205, 127, 50, 0.5)',
        probability: 0.60,
        icon: '🎫',
        description: 'ตั๋วระดับทั่วไป หาได้ง่าย',
    },
    {
        rarity: 'Rare',
        name: 'ตั๋วเงิน',
        color: '#C0C0C0',
        glowColor: 'rgba(192, 192, 192, 0.5)',
        probability: 0.28,
        icon: '🎟️',
        description: 'ตั๋วระดับหายาก มีโอกาสได้รับปานกลาง',
    },
    {
        rarity: 'Epic',
        name: 'ตั๋วทอง',
        color: '#FFD700',
        glowColor: 'rgba(255, 215, 0, 0.6)',
        probability: 0.10,
        icon: '🏆',
        description: 'ตั๋วระดับมหากาพย์ หายากมาก!',
    },
    {
        rarity: 'Legendary',
        name: 'ตั๋วเพชร',
        color: '#B9F2FF',
        glowColor: 'rgba(185, 242, 255, 0.8)',
        probability: 0.02,
        icon: '💎',
        description: 'ตั๋วระดับตำนาน สุดยอดความหายาก!',
    },
];

export async function GET() {
    await connectDB();

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let ticketTypes = await TicketType.find().sort({ probability: -1 }); // Sort by probability descending (common first?) or ascending (legendary first?) - usually common is high prob. Let's sort by rarity implicitly or prob explicitly.

        // Seed if empty
        if (ticketTypes.length === 0) {
            console.log('Seeding initial ticket types...');
            ticketTypes = await TicketType.insertMany(defaultTicketTypes);
        }

        return NextResponse.json(ticketTypes);
    } catch (error) {
        console.error('Failed to fetch ticket types:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Check if rarity already exists? Maybe not strictly required but good practice if 1-to-1 mapping is desired.
        // existing check optional.

        const newTicketType = await TicketType.create(body);
        return NextResponse.json(newTicketType, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create ticket type:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}
