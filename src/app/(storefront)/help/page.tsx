'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: 'การสั่งซื้อและจ่ายเงิน',
    icon: '💳',
    items: [
      {
        id: '1-1',
        question: 'ฉันสามารถใช้วิธีการจ่ายเงินอะไรได้บ้าง?',
        answer: 'เรารับวิธีการจ่ายเงินต่อไปนี้: บัตรเครดิต/เดบิต, โอนเงินธนาคาร, ตัวแทนฯ (COD), ระบบตั๋ว SupplementShop และอื่นๆ',
      },
      {
        id: '1-2',
        question: 'ฉันสามารถยกเลิกหรือแก้ไขคำสั่งได้หรือไม่?',
        answer: 'หากคำสั่งยังไม่เริ่มจัดส่ง คุณสามารถยกเลิกหรือแก้ไขได้โดยการติดต่อเรา โปรดติดต่อเราที่เร็วที่สุด',
      },
      {
        id: '1-3',
        question: 'จะได้รับใบเสร็จรับเงินได้อย่างไร?',
        answer: 'ใบเสร็จรับเงินจะถูกส่งไปยังอีเมลของคุณโดยอัตโนมัติหลังจากการชำระเงิน คุณสามารถดูและดาวน์โหลดได้จากหน้าบัญชี',
      },
    ],
  },
  {
    title: 'การจัดส่งและคืนสินค้า',
    icon: '📦',
    items: [
      {
        id: '2-1',
        question: 'การจัดส่งใช้เวลานานเท่าไหร่?',
        answer: 'เวลาจัดส่งมาตรฐาน 2-3 วันทำการในกรุงเทพฯ และ 3-5 วันสำหรับจังหวัดอื่น (หลังชำระเงินแล้ว)',
      },
      {
        id: '2-2',
        question: 'ฉันสามารถติดตามการจัดส่งได้หรือไม่?',
        answer: 'ได้ คุณจะได้รับหมายเลขติดตามหลังจากสินค้าเริ่มจัดส่ง ติดตามได้ผ่านหน้าบัญชี หรือในอีเมลที่ส่งมา',
      },
      {
        id: '2-3',
        question: 'นโยบายการคืนสินค้าคืออะไร?',
        answer: 'คุณสามารถคืนสินค้าภายใน 7 วันหลังรับของ หากสินค้ายังไม่ได้ใช้และอยู่ในสภาพดี กรุณาติดต่อฝ่ายบริการลูกค้า',
      },
    ],
  },
  {
    title: 'บัญชีและความปลอดภัย',
    icon: '🔐',
    items: [
      {
        id: '3-1',
        question: 'ฉันลืมรหัสผ่าน ฉันจะทำอย่างไร?',
        answer: 'คลิกที่ "ลืมรหัสผ่าน" ที่หน้าเข้าสู่ระบบ กรอกอีเมลของคุณ และเราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณ',
      },
      {
        id: '3-2',
        question: 'บัญชีของฉันปลอดภัยหรือไม่?',
        answer: 'เราใช้การเข้ารหัส SSL และมาตรการความปลอดภัยที่ทันสมัยเพื่อปกป้องข้อมูลของคุณ ไม่เปิดเผยข้อมูลส่วนตัวของคุณให้กับบุคคลที่สาม',
      },
      {
        id: '3-3',
        question: 'ฉันสามารถเปลี่ยนอีเมลหรือรหัสผ่านได้หรือไม่?',
        answer: 'ได้ คุณสามารถเปลี่ยนได้ในส่วน "การตั้งค่า" ของหน้าบัญชี หรือติดต่อฝ่ายบริการลูกค้า',
      },
    ],
  },
  {
    title: 'ระบบตั๋ว',
    icon: '🎫',
    items: [
      {
        id: '4-1',
        question: 'ระบบตั๋วคืออะไร?',
        answer: 'ระบบตั๋ว SupplementShop เป็นโปรแกรมสะสมคะแนนที่ให้คุณได้รับตั๋วพิเศษที่แลกได้เป็นสินค้าหรือส่วนลด',
      },
      {
        id: '4-2',
        question: 'ฉันจะได้รับตั๋วได้อย่างไร?',
        answer: 'คุณจะได้รับตั๋วเมื่อ: (1) ทำการซื้อ (2) เขียนรีวิว (3) ร้อมเพื่อน (4) สุ่มตั๋วฟรีทุกวัน',
      },
      {
        id: '4-3',
        question: 'ตั๋วหมดอายุหรือไม่?',
        answer: 'ตั๋วจะหมดอายุ 1 ปีหลังจากได้รับ โปรดใช้ตั๋วให้ทันก่อนหมดอายุ',
      },
    ],
  },
  {
    title: 'สินค้าและคุณภาพ',
    icon: '✨',
    items: [
      {
        id: '5-1',
        question: 'สินค้าทั้งหมดได้รับการรับรองจาก อย. หรือไม่?',
        answer: 'ใช่ สินค้าทั้งหมดของ SupplementShop ได้รับการรับรองจากสำนัก อย. และเป็นแท้อย่างแน่นอน',
      },
      {
        id: '5-2',
        question: 'ฉันจะรู้ได้อย่างไรว่าสินค้าเหมาะสำหรับฉัน?',
        answer: 'แต่ละสินค้ามีคำอธิบายรายละเอียด วิธีใช้ และสำหรับใคร คุณสามารถอ่านรีวิวจากลูกค้าอื่นได้',
      },
      {
        id: '5-3',
        question: 'มีอะไรที่ต้องระวังเมื่อบริหารสินค้าหรือไม่?',
        answer: 'อย่าลืมตรวจสอบวันหมดอายุก่อนซื้อ เก็บในที่อบอุ่นและห้องแห้ง และอ่านคำแนะนำการใช้อย่างละเอียด',
      },
    ],
  },
];

function AccordionItem({ isOpen, question, answer, onClick }: {
  isOpen: boolean;
  question: string;
  answer: string;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/[0.08] last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-4 px-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left"
      >
        <span className="font-medium pr-4">{question}</span>
        <span className={`text-xl transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-[rgb(var(--text-muted))] animate-scale-in">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">ศูนย์ช่วยเหลือ</span>
        </h1>
        <p className="text-[rgb(var(--text-muted))] text-lg mb-8">
          ค้นหาคำตอบสำหรับคำถามทั่วไปและเรียนรู้เพิ่มเติมเกี่ยวกับการใช้ SupplementShop
        </p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="ค้นหาคำถาม..."
            className="w-full px-6 py-4 bg-white/5 border border-white/[0.08] rounded-2xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          <Link href="/auth/login">
            <Card hover className="p-4 flex items-center gap-3">
              <span className="text-2xl">🔓</span>
              <div className="text-sm font-medium">ต้องการเข้าสู่ระบบ?</div>
            </Card>
          </Link>
          <Link href="/auth/register">
            <Card hover className="p-4 flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div className="text-sm font-medium">สร้างบัญชีใหม่</div>
            </Card>
          </Link>
          <Link href="/products">
            <Card hover className="p-4 flex items-center gap-3">
              <span className="text-2xl">🛍️</span>
              <div className="text-sm font-medium">ดูสินค้าทั้งหมด</div>
            </Card>
          </Link>
          <a href="tel:+66812345678">
            <Card hover className="p-4 flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div className="text-sm font-medium">โทรหาเรา</div>
            </Card>
          </a>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-4xl mx-auto space-y-12">
        {faqCategories.map((category) => (
          <div key={category.title}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{category.icon}</span>
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>

            <Card elevated>
              {category.items.map((item) => (
                <AccordionItem
                  key={item.id}
                  isOpen={openItems.has(item.id)}
                  question={item.question}
                  answer={item.answer}
                  onClick={() => toggleItem(item.id)}
                />
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 border-[rgb(var(--primary))]/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gradient">ยังไม่พบคำตอบที่ต้องการ?</span>
            </h2>
            <p className="text-[rgb(var(--text-muted))] mb-8">
              ติดต่อทีมฝ่ายบริการลูกค้าของเรา เราจะช่วยเหลือคุณโดยเร็ว
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@supplementshop.com">
                <Button size="lg" variant="outline">
                  📧 ส่งอีเมล
                </Button>
              </a>
              <a href="tel:+66812345678">
                <Button size="lg">
                  ☎️ โทร 081-234-5678
                </Button>
              </a>
            </div>
            <p className="text-[rgb(var(--text-muted))] text-sm mt-6">
              ⏰ เปิดทำการ จันทร์-ศุกร์ 9:00-18:00 น.
            </p>
          </div>
        </Card>
      </div>

      {/* Related Links */}
      <div className="max-w-4xl mx-auto mt-12">
        <h3 className="text-xl font-bold mb-6">ลิงก์ที่เกี่ยวข้อง</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/policy">
            <Card hover className="p-6">
              <div className="font-semibold mb-2">📋 นโยบายความเป็นส่วนตัว</div>
              <p className="text-sm text-[rgb(var(--text-muted))]">อ่านเกี่ยวกับวิธีที่เราปกป้องข้อมูลของคุณ</p>
            </Card>
          </Link>
          <Link href="/policy">
            <Card hover className="p-6">
              <div className="font-semibold mb-2">⚖️ เงื่อนไขการใช้งาน</div>
              <p className="text-sm text-[rgb(var(--text-muted))]">เรียนรู้เกี่ยวกับเงื่อนไขการใช้เว็บไซต์</p>
            </Card>
          </Link>
          <Link href="/tickets">
            <Card hover className="p-6">
              <div className="font-semibold mb-2">🎫 ระบบตั๋ว</div>
              <p className="text-sm text-[rgb(var(--text-muted))]">เรียนรู้เพิ่มเติมเกี่ยวกับการใช้ตั๋วของเรา</p>
            </Card>
          </Link>
          <Link href="/products">
            <Card hover className="p-6">
              <div className="font-semibold mb-2">📚 สินค้าทั้งหมด</div>
              <p className="text-sm text-[rgb(var(--text-muted))]">ดูรายการสินค้าและรีวิวทั้งหมด</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
