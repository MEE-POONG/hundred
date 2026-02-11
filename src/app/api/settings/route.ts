import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import StoreSettings from '@/models/StoreSettings';

// GET: Store Settings
export async function GET() {
    await dbConnect();
    try {
        let settings = await StoreSettings.findOne();
        if (!settings) {
            // Create default settings if not exists
            settings = await StoreSettings.create({
                name: 'SupplementShop',
                description: 'ร้านขายอาหารเสริมคุณภาพพรีเมียม',
                phone: '02-123-4567',
                email: 'support@supplementshop.com',
                address: '123/45 สยามสแควร์ ถนนราชดำเนิน กรุงเทพ',
                businessHours: '09:00 - 22:00',
                logo: 'https://ui-avatars.com/api/?name=Shop&background=FF4D9D&color=fff&size=128', // Default logo
            });
        }
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PUT: Update Store Settings (Admin only)
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await request.json();
        let settings = await StoreSettings.findOne();

        if (!settings) {
            settings = new StoreSettings(body);
        } else {
            Object.assign(settings, body);
        }

        await settings.save();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
