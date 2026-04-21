const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('--- Email Connection Test ---');
    console.log('Host:', process.env.EMAIL_SERVER_HOST);
    console.log('Port:', process.env.EMAIL_SERVER_PORT);
    console.log('User:', process.env.EMAIL_SERVER_USER);
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection is successful!');
        
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_SERVER_USER, // Send to self
            subject: 'Test Email',
            text: 'If you see this, email is working!',
        });
        console.log('✅ Email sent:', info.messageId);
    } catch (error) {
        console.error('❌ Email failed:', error.message);
        if (process.env.EMAIL_SERVER_HOST === 'smtp.example.com') {
            console.log('\n[NOTICE] You are still using example values in .env file.');
            console.log('Please update EMAIL_SERVER_HOST, USER, and PASSWORD with your real SMTP credentials.');
        }
    }
}

testEmail();
