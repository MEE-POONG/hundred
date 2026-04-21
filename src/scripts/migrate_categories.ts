import './env-init';

import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import connectDB from '../lib/db';

async function migrate() {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Get all products
    const products = await Product.find().lean();
    console.log(`Found ${products.length} products`);

    // Extract unique categories
    const categoryMap = new Map();
    products.forEach((p: any) => {
      if (p.category && p.categoryName) {
        categoryMap.set(p.category, p.categoryName);
      }
    });

    console.log(`Unique categories found: ${categoryMap.size}`);

    // Create categories in the new model
    for (const [slug, name] of categoryMap.entries()) {
      const exists = await Category.findOne({ slug });
      if (!exists) {
        await Category.create({
          name,
          slug,
          description: `สินค้ากลุ่ม ${name}`,
          isActive: true
        });
        console.log(`Created category: ${name} (${slug})`);
      } else {
        console.log(`Category already exists: ${name}`);
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
