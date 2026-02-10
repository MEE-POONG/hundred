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
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Auto-generate slug from name
    let slug = body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    // Check if slug exists, append random if needed (simple check)
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const productData = {
      ...body,
      slug,
      categoryName: body.category === 'weight-loss' ? 'ลดน้ำหนัก' :
        body.category === 'skin-care' ? 'บำรุงผิว' :
          body.category === 'fitness' ? 'ฟิตเนส' : 'สุขภาพ', // Simple mapping
      shortDescription: body.description?.substring(0, 100) || '',
      rating: 0,
      reviewCount: 0,
    };

    const product = await Product.create(productData);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
