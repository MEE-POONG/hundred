'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!email) {
            router.push('/auth/register');
        }
    }, [email, router]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            setError('กรุณากรอกรหัส 6 หลักให้ครบถ้วน');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: fullCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'รหัสยืนยันไม่ถูกต้อง');
                setIsLoading(false);
                return;
            }

            router.push('/auth/verify-success');
        } catch (err) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-5xl font-bold text-gradient mb-2">💊 ยืนยันอีเมล</div>
                    <p className="text-[rgb(var(--text-muted))]">
                        เราได้ส่งรหัสยืนยัน 6 หลักไปที่ <br />
                        <span className="font-semibold text-[rgb(var(--text))]">{email}</span>
                    </p>
                </div>

                <Card className="p-8 md:p-10" elevated>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-between gap-2">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:border-[rgb(var(--primary))] focus:outline-none transition-all"
                                    required
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[rgb(var(--error))] text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? '🔄 กำลังยืนยัน...' : 'ยืนยันรหัส'}
                        </Button>

                        <div className="text-center space-y-4">
                            <p className="text-sm text-[rgb(var(--text-muted))]">
                                ไม่ได้รับรหัส? {' '}
                                <button 
                                    type="button" 
                                    className="text-[rgb(var(--primary))] hover:underline font-medium"
                                    onClick={() => setMessage('ระบบส่งรหัสใหม่แล้ว (Mockup)')}
                                >
                                    ส่งอีกครั้ง
                                </button>
                            </p>
                            {message && (
                                <p className="text-xs text-green-400 font-medium animate-pulse">
                                    {message}
                                </p>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
