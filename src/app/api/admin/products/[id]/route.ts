import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        await connectDB();
        const body = await request.json();

        // Remove _id from body to prevent immutable field error
        delete body._id;

        const product = await Product.findByIdAndUpdate(id, body, { new: true });
        if (!product) {
            return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('Product update error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        await connectDB();

        // Find product first to get images
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 });
        }

        // Delete associated images
        if (product.images && product.images.length > 0) {
            try {
                // Extract IDs from image URLs (e.g., /api/images/65df...)
                const imageIds = product.images
                    .map((url: string) => url.split('/api/images/')[1])
                    .filter(Boolean); // Filter out invalid IDs

                if (imageIds.length > 0) {
                    const Image = (await import('@/models/Image')).default;
                    await Image.deleteMany({ _id: { $in: imageIds } });
                }
            } catch (imgError) {
                console.error('Failed to delete associated images:', imgError);
                // Continue deleting product even if image delete fails
            }
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: 'ลบสินค้าและรูปภาพสำเร็จ' });
    } catch (error) {
        console.error('Product delete error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
