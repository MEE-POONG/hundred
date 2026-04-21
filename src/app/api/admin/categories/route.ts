import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

// GET all categories
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const categories = await Category.find().sort({ createdAt: -1 });
    
    // Fetch product counts for each category
    const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ category: cat.slug });
      return {
        ...cat.toObject(),
        productCount
      };
    }));

    return NextResponse.json(categoriesWithCount);
    } catch (error) {
        console.error('Admin categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST new category
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const { name, slug, description, image, isActive } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        await connectDB();
        const category = await Category.create({
            name,
            slug,
            description,
            image,
            isActive: isActive !== undefined ? isActive : true,
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error('Admin category creation error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Category slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
