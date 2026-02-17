import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;

async function dropIndex() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected!\n');

        const db = mongoose.connection.db;
        const collection = db!.collection('tickettypes');

        console.log('📋 Current indexes:');
        const indexes = await collection.indexes();
        console.log(indexes);

        console.log('\n🗑️  Dropping rarity_1 index...');
        await collection.dropIndex('rarity_1');
        console.log('✅ Index dropped successfully!\n');

        console.log('📋 Remaining indexes:');
        const remainingIndexes = await collection.indexes();
        console.log(remainingIndexes);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

dropIndex();
