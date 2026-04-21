import connectDB from './src/lib/db';
import User from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

async function checkUsers() {
    try {
        await connectDB();
        console.log('--- Database Users ---');
        const users = await User.find({}, 'name email role');
        if (users.length === 0) {
            console.log('No users found in database.');
        } else {
            users.forEach(u => {
                console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkUsers();
