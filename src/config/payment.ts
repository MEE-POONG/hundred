/**
 * Payment Configuration
 * 
 * แก้ไขข้อมูลบัญชีธนาคารได้ที่ไฟล์นี้ หรือผ่าน Environment Variables ใน .env
 * 
 * Environment Variables (ใส่ใน .env เพื่อ override):
 *   NEXT_PUBLIC_PROMPTPAY_ID     - เลขบัญชี/เบอร์โทร PromptPay
 *   NEXT_PUBLIC_BANK_NAME        - ชื่อธนาคาร
 *   NEXT_PUBLIC_BANK_ACCOUNT     - เลขที่บัญชี (สำหรับแสดงผล)
 *   NEXT_PUBLIC_ACCOUNT_NAME     - ชื่อบัญชี
 */
export const PAYMENT_CONFIG = {
  /** PromptPay ID สำหรับ generate QR code (เบอร์โทร 10 หลัก, เลขบัตร 13 หลัก, หรือเลขบัญชี) */
  promptPayId: process.env.NEXT_PUBLIC_PROMPTPAY_ID || '67263299990',

  /** ชื่อธนาคาร */
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'กสิกรไทย (KBANK)',

  /** เลขที่บัญชีธนาคาร (สำหรับแสดงผลเท่านั้น) */
  bankAccount: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '672-6-32999-0',

  /** ชื่อบัญชี */
  accountName: process.env.NEXT_PUBLIC_ACCOUNT_NAME || 'บริษัท here co-op',
} as const;
