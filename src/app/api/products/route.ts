import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let query: any = {};
    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });

    const result = products.map(p => ({
      ...p.toObject({ virtuals: true }),
      isInStock: p.stock > 0 && (p.isAvailable !== false),
      id: p._id
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Auto-generate slug from name
    // Auto-generate slug from name, allowing Thai characters
    let slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]+/g, '');
    if (!slug) slug = `product-${Date.now()}`; // Fallback if slug is completely empty

    // Check if slug exists, append random if needed (simple check)
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const productData = {
      ...body,
      slug,
      categoryName: body.categoryName || (body.category === 'weight-loss' ? 'ลดน้ำหนัก' :
        body.category === 'skin-care' ? 'บำรุงผิว' :
          body.category === 'fitness' ? 'ฟิตเนส' :
            body.category === 'health' ? 'สุขภาพ' : body.category),
      shortDescription: body.description?.substring(0, 100) || '',
      rating: 0,
      reviewCount: 0,
    };

    const product = await Product.create(productData);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create product POST error:', error, error?.stack);
    return NextResponse.json({ error: 'Failed to create product', details: error?.message || String(error) }, { status: 500 });
  }
}
