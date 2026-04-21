import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, code: string) => {
    const mailOptions = {
        from: `"Hundred Supplement" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'รหัสยืนยันตัวตนของคุณ - Hundred Supplement',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #2c3e50; text-align: center;">ยืนยันอีเมลของคุณ</h2>
                <p>ขอบคุณที่สมัครสมาชิกกับ Hundred Supplement รหัสยืนยันตัวตนของคุณคือ:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background-color: #f3f4f6; color: #000; padding: 20px; border-radius: 8px; font-weight: bold; font-size: 32px; letter-spacing: 5px; display: inline-block; border: 2px dashed #fbbf24;">
                        ${code}
                    </div>
                </div>
                <p>รหัสนี้มีอายุการใช้งาน 15 นาที</p>
                <p>หากคุณไม่ได้สมัครสมาชิกกับเรา โปรดเพิกเฉยต่ออีเมลนี้</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2025 Hundred Supplement</p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};
