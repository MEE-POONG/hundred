import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import StockMovement from '@/models/StockMovement';

// GET: Fetch all stock movements + all products with stock info
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const [products, movements] = await Promise.all([
            Product.find().select('name images stock sold slug').sort({ name: 1 }),
            StockMovement.find().sort({ createdAt: -1 }).limit(50),
        ]);

        return NextResponse.json({ products, movements });
    } catch (error) {
        console.error('Inventory fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}

// POST: Create a new stock movement (adjust stock)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await request.json();
        const { productId, type, quantity, reason, note } = body;

        if (!productId || !type || !quantity || !reason) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find product
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Validate stock for 'out' type
        if (type === 'out' && product.stock < quantity) {
            return NextResponse.json({ error: 'สต็อกไม่พอ' }, { status: 400 });
        }

        // Update product stock
        const stockChange = type === 'in' ? quantity : -quantity;
        product.stock += stockChange;
        await product.save();

        // Create movement record
        const movement = await StockMovement.create({
            product: productId,
            productName: product.name,
            type,
            quantity,
            reason,
            note: note || '',
            performedBy: session.user.email || 'admin',
        });

        return NextResponse.json({ movement, newStock: product.stock });
    } catch (error) {
        console.error('Stock movement error:', error);
        return NextResponse.json({ error: 'Failed to create stock movement' }, { status: 500 });
    }
}
