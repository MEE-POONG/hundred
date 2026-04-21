import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Token is missing' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Token ไม่ถูกต้องหรือหมดอายุ' },
                { status: 400 }
            );
        }

        // Update user status
        user.emailVerified = new Date();
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        // Redirect to a success page or return success
        // return NextResponse.json({ message: 'ยืนยันอีเมลสำเร็จ' });
        
        // Better to redirect to a frontend page that shows success
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        return NextResponse.redirect(`${baseUrl}/auth/verify-success`);
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการยืนยันอีเมล' },
            { status: 500 }
        );
    }
}
