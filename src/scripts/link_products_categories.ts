import './env-init';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import connectDB from '../lib/db';

async function updateProducts() {
  try {
    await connectDB();
    console.log('Connected to DB');

    const products = await Product.find().lean();
    console.log(`Checking ${products.length} products...`);

    for (const p of products) {
      if (p.category) {
        // Find the category by slug
        const category = await Category.findOne({ slug: p.category });
        if (category) {
          // Update product with categoryId
          await mongoose.connection.collection('products').updateOne(
            { _id: p._id },
            { $set: { categoryId: category._id } }
          );
          console.log(`Updated product ${p.name} with categoryId ${category._id}`);
        } else {
          console.log(`Category not found for slug: ${p.category} (Product: ${p.name})`);
        }
      }
    }

    console.log('Update complete!');
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updateProducts();
