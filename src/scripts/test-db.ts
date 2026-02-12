import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const uri = process.env.DATABASE_URL;

console.log('---------------------------------------------------');
console.log('🔍 Database Connection Diagnostic');
console.log('---------------------------------------------------');

if (!uri) {
    console.error('❌ Error: DATABASE_URL is missing in .env file');
    process.exit(1);
}

// Mask password for display
const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`📡 URL Found: ${maskedUri}`);

// Check for common formatting issues
const parts = uri.split('://');
if (parts.length > 1) {
    const credentials = parts[1].split('@')[0];
    if (credentials.includes(':')) {
        const [user, pass] = credentials.split(':');
        // Check if password has potentially dangerous characters that are NOT encoded
        const dangerousChars = ['@', '/', '?', '#'];
        const hasDangerousChar = dangerousChars.some(char => pass.includes(char));

        if (hasDangerousChar) {
            console.log('\n⚠️  WARNING: Your password contains special characters (@, /, ?, #).');
            console.log('   If these are not URL encoded, the connection WILL fail.');
            console.log('   Example: "@" must be written as "%40"');
        }
    }
}

console.log('\n🔄 Attempting to connect...');

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB successfully!');
        console.log('   Database is accessible and credentials are correct.');
        process.exit(0);
    })
    .catch((err) => {
        console.log('❌ FAILED: Could not connect.');
        console.log(`   Error: ${err.message}`);

        console.log('\n💡 Suggestions:');
        if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
            console.log('   1. Check Username and Password again. (Case sensitive?)');
            console.log('   2. Ask the admin if "SCRAM-SHA-1" or "SCRAM-SHA-256" auth mechanism is required.');
            console.log('   3. Ensure special characters in password are URL Encoded.');
        } else if (err.message.includes('time') || err.message.includes('querySrv')) {
            console.log('   1. Check your Internet Connection.');
            console.log('   2. **IP Whitelist**: Your IP address might not be allowed in MongoDB Atlas.');
            console.log('      Ask the admin to add your current IP address.');
        }
        process.exit(1);
    });
