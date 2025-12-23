import { User, KPI } from './types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    avatar: 'https://ui-avatars.com/api/?name=S+I&background=FF4D9D&color=fff&size=128',
    phone: '081-234-5678',
    role: 'user',
    joinedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'ผู้ดูแลระบบ',
    email: 'admin@supplementshop.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=B84DFF&color=fff&size=128',
    role: 'admin',
    joinedAt: '2024-06-01T08:00:00Z',
  },
];

export const mockAdminKPIs: KPI[] = [
  {
    label: 'ยอดขายเดือนนี้',
    value: '฿248,950',
    change: 12.5,
    trend: 'up',
    icon: '💰',
  },
  {
    label: 'ออเดอร์ใหม่',
    value: 156,
    change: 8.3,
    trend: 'up',
    icon: '📦',
  },
  {
    label: 'สต็อกใกล้หมด',
    value: 3,
    change: -25,
    trend: 'down',
    icon: '⚠️',
  },
  {
    label: 'อัตราแลกตั๋ว',
    value: '18.5%',
    change: 5.2,
    trend: 'up',
    icon: '🎫',
  },
];

export function getCurrentUser(): User {
  return mockUsers[0];
}

export function getAdminUser(): User {
  return mockUsers[1];
}
