import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Import models
import Product from '../models/Product';
import User from '../models/User';
import Order from '../models/Order';
import { TicketType } from '../models/Ticket';

// Import mock data
import { products } from '../data/products';
import { mockOrders } from '../data/orders';
import { ticketTypes } from '../data/tickets';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
}

async function seedDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});
        await TicketType.deleteMany({});
        console.log('✅ Cleared existing data\n');

        // Seed Products
        console.log('📦 Seeding Products...');
        const productDocs = products.map(p => ({
            ...p,
            _id: undefined,
        }));
        await Product.insertMany(productDocs);
        console.log(`✅ Inserted ${products.length} products\n`);

        // Seed Admin User
        console.log('👑 Seeding Admin User...');
        const adminPassword = await bcrypt.hash('admin123456', 12);
        await User.create({
            name: 'Admin',
            email: 'admin@supplementshop.com',
            password: adminPassword,
            role: 'admin',
            provider: 'credentials',
        });
        console.log('✅ Admin account created');
        console.log('   📧 Email: admin@supplementshop.com');
        console.log('   🔑 Password: admin123456\n');

        // Seed Ticket Types
        console.log('🎫 Seeding Ticket Types...');
        const ticketDocs = ticketTypes.map(t => ({
            ticketId: t.id,
            rarity: t.rarity,
            name: t.name,
            color: t.color,
            glowColor: t.glowColor,
            probability: t.probability,
            icon: t.icon,
        }));
        await TicketType.insertMany(ticketDocs);
        console.log(`✅ Inserted ${ticketTypes.length} ticket types\n`);

        // Seed Orders
        console.log('📋 Seeding Orders...');
        const orderDocs = mockOrders.map(o => ({
            orderNumber: o.orderNumber,
            items: o.items,
            subtotal: o.subtotal,
            shipping: o.shipping,
            discount: o.discount,
            total: o.total,
            status: o.status,
            shippingAddress: o.shippingAddress,
            paymentMethod: o.paymentMethod,
            shippingMethod: o.shippingMethod,
            trackingNumber: o.trackingNumber,
            createdAt: new Date(o.createdAt),
            paidAt: o.paidAt ? new Date(o.paidAt) : undefined,
            shippedAt: o.shippedAt ? new Date(o.shippedAt) : undefined,
            deliveredAt: o.deliveredAt ? new Date(o.deliveredAt) : undefined,
        }));
        await Order.insertMany(orderDocs);
        console.log(`✅ Inserted ${mockOrders.length} orders\n`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   Products: ${products.length}`);
        console.log(`   Admin: 1 (admin@supplementshop.com)`);
        console.log(`   Orders: ${mockOrders.length}`);
        console.log(`   Ticket Types: ${ticketTypes.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

seedDatabase();
