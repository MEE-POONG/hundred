import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
            { error: 'ประเภทไฟล์ไม่ถูกต้อง (รองรับ: JPG, PNG, WebP, GIF)' },
            { status: 400 }
        );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
        return NextResponse.json(
            { error: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)' },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

        const image = await Image.create({
            filename,
            contentType: file.type,
            data: buffer,
            size: file.size,
            uploadedBy: (session.user as any).email || 'anonymous',
        });

        // Return a URL that points to our image serving API
        const url = `/api/images/${image._id}`;
        return NextResponse.json({ url, id: image._id });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
