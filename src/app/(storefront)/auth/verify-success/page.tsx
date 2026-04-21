import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function VerifySuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex justify-center">
                    <div className="p-4 bg-green-100 rounded-full">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                </div>
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        ยืนยันอีเมลสำเร็จ!
                    </h2>
                    <p className="mt-4 text-sm text-gray-600">
                        บัญชีของคุณได้รับการยืนยันเรียบร้อยแล้ว ตอนนี้คุณสามารถเข้าสู่ระบบและเริ่มใช้งานได้ทันที
                    </p>
                </div>
                <div className="mt-8">
                    <Link
                        href="/auth/login"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
                    >
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
}
