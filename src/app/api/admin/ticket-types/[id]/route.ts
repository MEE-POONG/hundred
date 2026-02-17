import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import TicketType from '@/models/TicketType';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const updatedTicketType = await TicketType.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTicketType) {
            return NextResponse.json({ error: 'Ticket Type not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTicketType);
    } catch (error) {
        console.error('Failed to update ticket type:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const deletedTicketType = await TicketType.findByIdAndDelete(id);

        if (!deletedTicketType) {
            return NextResponse.json({ error: 'Ticket Type not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Ticket Type deleted successfully' });
    } catch (error) {
        console.error('Failed to delete ticket type:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
