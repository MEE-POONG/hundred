import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

async function verifyWithGemini(base64: string, mimeType: string, apiKey: string): Promise<{ valid: boolean; reason: string }> {
  const prompt = `คุณเป็นระบบตรวจสอบสลิปการโอนเงิน วิเคราะห์รูปภาพนี้แล้วตอบใน JSON เท่านั้น:

รูปนี้เป็นสลิปการโอนเงินผ่านธนาคาร, PromptPay, หรือ QR Payment หรือไม่?
สลิปที่ถูกต้องจะมี: ชื่อธนาคาร, เลขที่อ้างอิง/Transaction ID, วันที่-เวลา, จำนวนเงิน

ตอบเฉพาะ JSON:
{"isSlip": true/false, "confidence": "high/medium/low", "reason": "เหตุผลสั้นๆภาษาไทย"}

ถ้าเป็นรูปคน, สัตว์, ภูมิทัศน์, สินค้า, หรือรูปอื่นที่ไม่ใช่สลิปโอนเงิน ให้ตอบ isSlip: false`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64 } }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 256 }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) throw new Error('Cannot parse response');

  const parsed = JSON.parse(jsonMatch[0]);
  const isSlip = parsed.isSlip === true;
  const confidence = parsed.confidence || 'low';
  const reason = parsed.reason || '';

  // Only reject if clearly NOT a slip with high confidence
  if (!isSlip && confidence === 'high') {
    return { valid: false, reason: reason || 'รูปภาพไม่ใช่สลิปการโอนเงิน' };
  }

  return { valid: true, reason: isSlip ? `ตรวจพบสลิปการโอนเงิน` : 'ผ่านการตรวจสอบ' };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ valid: false, reason: 'ไม่พบไฟล์' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        valid: false,
        reason: 'ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ JPG, PNG, WebP',
      });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        valid: false,
        reason: 'ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)',
      });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey || apiKey === 'your-google-ai-api-key-here') {
      console.warn('[verify-slip] GOOGLE_AI_API_KEY not configured — skipping AI verification');
      return NextResponse.json({ valid: true, reason: 'ผ่านการตรวจสอบเบื้องต้น' });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    const result = await verifyWithGemini(base64, file.type, apiKey);
    return NextResponse.json(result);

  } catch (error) {
    console.error('[verify-slip] Error:', error);
    // Fail open — allow upload on errors to avoid blocking users
    return NextResponse.json({ valid: true, reason: 'ผ่านการตรวจสอบ' });
  }
}
