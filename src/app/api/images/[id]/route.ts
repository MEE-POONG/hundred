import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await connectDB();

        const image = await Image.findById(id);
        if (!image) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Return image with proper headers for caching
        return new NextResponse(image.data, {
            headers: {
                'Content-Type': image.contentType,
                'Content-Length': image.size.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Image fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}
