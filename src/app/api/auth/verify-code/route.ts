import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({
            email,
            verificationToken: code,
            verificationTokenExpires: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'รหัสยืนยันไม่ถูกต้องหรือหมดอายุ' },
                { status: 400 }
            );
        }

        // Update user status
        user.emailVerified = new Date();
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        return NextResponse.json({ 
            message: 'ยืนยันอีเมลสำเร็จ',
            success: true 
        });
    } catch (error) {
        console.error('Code verification error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการยืนยัน' },
            { status: 500 }
        );
    }
}
