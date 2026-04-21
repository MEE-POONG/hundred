/**
 * PromptPay QR Code Generator
 * ตามมาตรฐาน EMVCo QR Code ของ ธนาคารแห่งประเทศไทย
 */

/** CRC-16/CCITT-FALSE checksum ตามมาตรฐาน EMVCo */
function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Format TLV (Tag-Length-Value) field */
function f(tag: string, value: string): string {
  return `${tag}${value.length.toString().padStart(2, '0')}${value}`;
}

/**
 * สร้าง PromptPay QR Payload (EMVCo standard)
 * @param promptPayID - เบอร์โทรศัพท์ (10 หลัก), เลขบัตรประชาชน (13 หลัก), หรือเลขบัญชี
 * @param amount - จำนวนเงินที่ต้องชำระ (บาท)
 */
export function generatePromptPayPayload(promptPayID: string, amount?: number): string {
  // ลบ dash และช่องว่าง
  const sanitized = promptPayID.replace(/[-\s]/g, '');

  let proxyValue: string;

  if (sanitized.length === 10 && sanitized.startsWith('0')) {
    // เบอร์โทรศัพท์: 0812345678 → 0066812345678
    proxyValue = `0066${sanitized.slice(1)}`;
  } else if (sanitized.length === 13) {
    // เลขบัตรประชาชน หรือ Tax ID: ใช้ตรงๆ
    proxyValue = sanitized;
  } else {
    // บัญชีธนาคาร หรือรูปแบบอื่น: ใช้ตรงๆ
    proxyValue = sanitized;
  }

  // Merchant Account Info (Tag 29)
  const guid = 'A000000677010111'; // PromptPay GUID
  const merchantInfo = f('00', guid) + f('01', proxyValue);

  // สร้าง payload ทีละส่วน
  const parts: string[] = [
    f('00', '01'),                        // Payload Format Indicator
    f('01', amount ? '12' : '11'),        // Point of Initiation (12=dynamic, 11=static)
    f('29', merchantInfo),                // Merchant Account Info (PromptPay)
    f('52', '0000'),                      // Merchant Category Code
    f('53', '764'),                       // Transaction Currency (764 = THB)
  ];

  if (amount && amount > 0) {
    parts.push(f('54', amount.toFixed(2))); // Transaction Amount
  }

  parts.push(f('58', 'TH'));              // Country Code
  parts.push(f('59', 'HERE CO-OP'));      // Merchant Name (max 25 chars)
  parts.push(f('60', 'Bangkok'));         // Merchant City

  // เพิ่ม CRC placeholder แล้วคำนวณ checksum
  const withoutCRC = parts.join('') + '6304';
  const checksum = crc16(withoutCRC);

  return withoutCRC + checksum;
}

/**
 * สร้าง URL สำหรับแสดง QR Code image จาก payload
 * ใช้ qrserver.com API (ไม่ต้องติดตั้ง package เพิ่ม)
 */
export function getQRCodeImageUrl(payload: string, size: number = 300): string {
  const encoded = encodeURIComponent(payload);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&margin=10&color=000000&bgcolor=ffffff&ecc=M`;
}
