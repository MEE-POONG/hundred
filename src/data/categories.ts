import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'weight-loss',
    name: 'ลดน้ำหนัก',
    slug: 'weight-loss',
    icon: '🔥',
    description: 'อาหารเสริมเพื่อควบคุมน้ำหนัก เผาผลาญไขมัน',
  },
  {
    id: 'skin-care',
    name: 'บำรุงผิว',
    slug: 'skin-care',
    icon: '✨',
    description: 'วิตามินบำรุงผิวพรรณ ให้ผิวสวยใส',
  },
  {
    id: 'vitamins',
    name: 'วิตามินรวม',
    slug: 'vitamins',
    icon: '💊',
    description: 'วิตามินและแร่ธาตุเสริมสุขภาพ',
  },
  {
    id: 'protein',
    name: 'โปรตีน',
    slug: 'protein',
    icon: '💪',
    description: 'โปรตีนเวย์ เพิ่มกล้ามเนื้อ',
  },
  {
    id: 'detox',
    name: 'ดีท็อกซ์',
    slug: 'detox',
    icon: '🌿',
    description: 'ล้างสารพิษ ดูแลระบบขับถ่าย',
  },
];
