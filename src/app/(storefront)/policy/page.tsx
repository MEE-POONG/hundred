'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

interface PolicySection {
  id: string;
  title: string;
  icon: string;
  content: string;
  subsections?: Array<{
    subtitle: string;
    text: string;
  }>;
}

const policySections: PolicySection[] = [
  {
    id: 'privacy',
    title: 'นโยบายความเป็นส่วนตัว',
    icon: '🔒',
    content: 'SupplementShop มีความมุ่งมั่นในการปกป้องความเป็นส่วนตัวของลูกค้า นโยบายนี้อธิบายวิธีที่เรารวบรวม ใช้ และปกป้องข้อมูลของคุณ',
    subsections: [
      {
        subtitle: 'ข้อมูลที่เรารวบรวม',
        text: 'เรารวบรวมข้อมูลที่คุณให้ไว้โดยสมัครใจ เช่น ชื่อ อีเมล ที่อยู่ เบอร์โทรศัพท์ และข้อมูลการชำระเงิน เรายังรวบรวมข้อมูลเกี่ยวกับการใช้เว็บไซต์ของคุณ เช่น ที่อยู่ IP ระบบปฏิบัติการ และประวัติการเรียกดู',
      },
      {
        subtitle: 'วิธีที่เราใช้ข้อมูลของคุณ',
        text: 'เราใช้ข้อมูลของคุณเพื่อ: (1) ประมวลผลการสั่งซื้อและการจัดส่ง (2) ส่งยืนยันการสั่งซื้อและการอัพเดต (3) ตอบกลับคำถามและคำร้องขอของคุณ (4) การวิเคราะห์และปรับปรุงเว็บไซต์ (5) ส่งข้อมูลทางการตลาดหากคุณอนุมัติ',
      },
      {
        subtitle: 'การรักษาความปลอดภัยของข้อมูล',
        text: 'เราใช้การเข้ารหัส SSL และมาตรการรักษาความปลอดภัยอื่นๆ เพื่อปกป้องข้อมูลส่วนตัวของคุณ อย่างไรก็ตาม ไม่มีวิธีการส่งข้อมูลผ่านอินเทอร์เน็ตที่ปลอดภัย 100% เราไม่สามารถรับประกันความปลอดภัยสัมบูรณ์ได้',
      },
      {
        subtitle: 'การแชร์ข้อมูลของคุณ',
        text: 'เราไม่ขายหรือแชร์ข้อมูลส่วนตัวของคุณให้กับบุคคลที่สาม ยกเว้นเป็นสิ่งจำเป็นเพื่อให้บริการหรือตามที่กฎหมายกำหนด เรามีข้อตกลงการปกป้องข้อมูลกับบริษัทที่ประมวลผลข้อมูลในนามของเรา',
      },
      {
        subtitle: 'สิทธิของคุณ',
        text: 'คุณมีสิทธิในการ: (1) เข้าถึงข้อมูลส่วนตัวของคุณ (2) แก้ไขข้อมูลที่ไม่ถูกต้อง (3) ลบข้อมูลของคุณ (4) คัดค้านการประมวลผลบางส่วน กรุณาติดต่อเราเพื่อใช้สิทธิเหล่านี้',
      },
    ],
  },
  {
    id: 'terms',
    title: 'เงื่อนไขการใช้งาน',
    icon: '⚖️',
    content: 'โดยการใช้เว็บไซต์ SupplementShop คุณตกลงที่จะปฏิบัติตามเงื่อนไขเหล่านี้',
    subsections: [
      {
        subtitle: 'ใบอนุญาตการใช้',
        text: 'เว็บไซต์ SupplementShop ได้รับการออกแบบสำหรับการใช้ส่วนบุคคล (ไม่ใช่เชิงพาณิชย์) ห้ามใช้เว็บไซต์สำหรับวัตถุประสงค์อื่นๆ หรือหลีกเลี่ยงข้อกำหนดใด ๆ ของเงื่อนไขเหล่านี้',
      },
      {
        subtitle: 'ข้อมูลที่ผิด',
        text: 'ผู้ใช้อนุญาตให้ SupplementShop ใช้และแสดงข้อมูล เช่น ชื่อ ที่อยู่ เบอร์โทรศัพท์ที่ให้มา ตามหลักสำคัญของการตลาดและการสื่อสาร',
      },
      {
        subtitle: 'จำกัดความรับผิดชอบ',
        text: 'SupplementShop จะไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้เว็บไซต์ หรือสินค้าและบริการที่ขายผ่านเว็บไซต์ เลยแม้ว่า SupplementShop ได้รับแจ้งเตือนเกี่ยวกับความเป็นไปได้ของความเสียหายดังกล่าว',
      },
      {
        subtitle: 'ความเห็นและข้อมูลของผู้ใช้',
        text: 'หากคุณส่งความเห็น ข้อมูล รีวิว หรือการสร้างสรรค์อื่นๆ ไปยัง SupplementShop คุณให้สิทธิแก่ SupplementShop ในการใช้งาน เปลี่ยนแปลง เผยแพร่ และแจกจ่ายสิ่งเหล่านี้ได้อย่างไม่มีเงื่อนไข',
      },
      {
        subtitle: 'การสิ้นสุด',
        text: 'SupplementShop มีสิทธิ์ระงับหรือยกเลิกการเข้าถึงของคุณต่อเว็บไซต์ได้ทันที หากสงสัยว่าคุณไม่ปฏิบัติตามเงื่อนไขเหล่านี้',
      },
    ],
  },
  {
    id: 'cookies',
    title: 'นโยบาย Cookies',
    icon: '🍪',
    content: 'SupplementShop ใช้ cookies และเทคโนโลยีการติดตามอื่นๆ เพื่อปรับปรุงประสบการณ์ของคุณบนเว็บไซต์',
    subsections: [
      {
        subtitle: 'Cookies คืออะไร',
        text: 'Cookies เป็นไฟล์ข้อมูลเล็กๆ ที่เก็บไว้บนอุปกรณ์ของคุณเมื่อคุณเข้าชมเว็บไซต์ Cookies ช่วยให้เว็บไซต์จำข้อมูลเกี่ยวกับการเยี่ยมชมของคุณได้',
      },
      {
        subtitle: 'ประเภทของ Cookies ที่เราใช้',
        text: 'เราใช้ cookies ที่จำเป็น (สำหรับการทำงานของเว็บไซต์) ความชอบ (เพื่อจดจำการตั้งค่าของคุณ) การวิเคราะห์ (เพื่อเข้าใจวิธีการใช้เว็บไซต์) และสินค้าอื่นๆ (เพื่อวัตถุประสงค์ทางการตลาด)',
      },
      {
        subtitle: 'การควบคุม Cookies',
        text: 'คุณสามารถปฏิเสธการใช้ cookies บางส่วนผ่านเบราว์เซอร์ของคุณ อย่างไรก็ตาม การปฏิเสธ cookies บางส่วนอาจส่งผลต่อการทำงานของเว็บไซต์',
      },
      {
        subtitle: 'Cookies ของบุคคลที่สาม',
        text: 'เราอาจใช้บริการตามองค์กรที่สาม ซึ่งอาจใช้ cookies เพื่อติดตามกิจกรรมของคุณ ซึ่งอยู่นอกเหนือการควบคุมของเรา',
      },
      {
        subtitle: 'อัพเดต',
        text: 'SupplementShop อาจอัพเดตนโยบาย Cookies นี้ได้ตลอดเวลา โปรดตรวจสอบเป็นระยะๆ เพื่อรับทราบการเปลี่ยนแปลง',
      },
    ],
  },
];

export default function PolicyPage() {
  const [activeSection, setActiveSection] = useState<string>('privacy');

  const currentSection = policySections.find(s => s.id === activeSection);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">นโยบายและเงื่อนไข</span>
          </h1>
          <p className="text-[rgb(var(--text-muted))] text-lg">
            ข้อมูลสำคัญเกี่ยวกับวิธีที่ SupplementShop ปกป้องข้อมูลของคุณและข้อเงื่อนไขการใช้งาน
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {policySections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 rounded-2xl border transition-all ${
                activeSection === section.id
                  ? 'bg-gradient-primary text-white border-[rgb(var(--primary))] glow-pink'
                  : 'bg-white/5 border-white/[0.08] hover:bg-white/10 text-[rgb(var(--text))]'
              }`}
            >
              <div className="text-3xl mb-2">{section.icon}</div>
              <div className="font-semibold text-sm">{section.title}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        {currentSection && (
          <div className="animate-scale-in">
            {/* Main Content */}
            <Card elevated className="p-8 md:p-12 mb-12">
              <div className="flex items-start gap-4 mb-8">
                <span className="text-5xl flex-shrink-0">{currentSection.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold mb-4">{currentSection.title}</h2>
                  <p className="text-[rgb(var(--text-muted))] text-lg">
                    {currentSection.content}
                  </p>
                </div>
              </div>

              {/* Subsections */}
              {currentSection.subsections && (
                <div className="space-y-8 mt-8 border-t border-white/[0.08] pt-8">
                  {currentSection.subsections.map((subsection, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-bold mb-3">{subsection.subtitle}</h3>
                      <p className="text-[rgb(var(--text-muted))] leading-relaxed">
                        {subsection.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Key Points */}
            <Card className="p-8 mb-12 bg-[rgb(var(--primary))]/5 border-[rgb(var(--primary))]/30">
              <h3 className="text-2xl font-bold mb-6">
                {currentSection.id === 'privacy' && '🔑 จุดสำคัญ'}
                {currentSection.id === 'terms' && '✓ ที่ต้องจำ'}
                {currentSection.id === 'cookies' && '📌 ข้อมูลเพิ่มเติม'}
              </h3>
              <ul className="space-y-3">
                {currentSection.id === 'privacy' && (
                  <>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>ข้อมูลของคุณได้รับการเข้ารหัสและปกป้อง</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>เราไม่ขายข้อมูลของคุณให้กับบุคคลที่สาม</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>คุณสามารถเข้าถึง แก้ไข หรือลบข้อมูลของคุณได้</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>เราปฏิบัติตามกฎหมายการปกป้องข้อมูลทั่วโลก</span>
                    </li>
                  </>
                )}
                {currentSection.id === 'terms' && (
                  <>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>เว็บไซต์นี้สำหรับการใช้ส่วนบุคคล ไม่ใช่เชิงพาณิชย์</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>ขอความเห็นและรีวิวจากผู้ใช้อย่างสนใจ</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>SupplementShop ไม่รับผิดชอบต่อความเสียหาย</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>เรามีสิทธิ์ระงับการใช้งานหากละเมิดเงื่อนไข</span>
                    </li>
                  </>
                )}
                {currentSection.id === 'cookies' && (
                  <>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>Cookies ช่วยปรับปรุงประสบการณ์ของคุณ</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>คุณสามารถควบคุม Cookies ผ่านเบราว์เซอร์</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>บางคน Cookies จำเป็นต่อการทำงานของเว็บไซต์</span>
                    </li>
                    <li className="flex gap-3">
                      <span>✓</span>
                      <span>เราใช้ cookies ของบุคคลที่สามสำหรับการวิเคราะห์</span>
                    </li>
                  </>
                )}
              </ul>
            </Card>

            {/* Last Updated */}
            <Card className="p-6 bg-white/5">
              <p className="text-sm text-[rgb(var(--text-muted))]">
                ⏰ อัพเดตล่าสุด: {new Date().toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto mt-16 pt-12 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-3">❓ คำถาม?</h4>
            <p className="text-[rgb(var(--text-muted))] text-sm mb-4">
              หากคุณมีคำถามเกี่ยวกับนโยบายและเงื่อนไขเหล่านี้ โปรดติดต่อเรา
            </p>
            <a href="mailto:privacy@supplementshop.com" className="text-[rgb(var(--primary))] text-sm hover:underline">
              privacy@supplementshop.com
            </a>
          </div>
          <div>
            <h4 className="font-bold mb-3">📋 ตัวเลือก</h4>
            <ul className="space-y-2 text-sm text-[rgb(var(--text-muted))]">
              <li>
                <Link href="/help" className="hover:text-[rgb(var(--text))]">
                  → ศูนย์ช่วยเหลือ
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[rgb(var(--text))]">
                  → การตั้งค่า
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[rgb(var(--text))]">
                  → ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">📍 อื่นๆ</h4>
            <ul className="space-y-2 text-sm text-[rgb(var(--text-muted))]">
              <li>
                <Link href="/about" className="hover:text-[rgb(var(--text))]">
                  → เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[rgb(var(--text))]">
                  → บล็อก
                </Link>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(var(--text))]">
                  → ติดตามเรา
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
