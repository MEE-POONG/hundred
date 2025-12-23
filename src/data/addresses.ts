import { Address } from '@/data/types';

export const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'บ้านหลัก',
    phone: '081-234-5678',
    address: '123 ซอยสุขุมวิท 42',
    district: 'ปรุงเสนาะ',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    isDefault: true,
  },
  {
    id: '2',
    name: 'ที่ทำงาน',
    phone: '089-876-5432',
    address: '456 อาคารเอ็มโพเรียม',
    district: 'พลับพลา',
    province: 'กรุงเทพมหานคร',
    postalCode: '10120',
    isDefault: false,
  },
  {
    id: '3',
    name: 'บ้านพ่อแม่',
    phone: '092-345-6789',
    address: '789 ซอยลาดพร้าว',
    district: 'วังทองหลาง',
    province: 'กรุงเทพมหานคร',
    postalCode: '10310',
    isDefault: false,
  },
];

export const getAddressById = (id: string) => {
  return mockAddresses.find(addr => addr.id === id);
};

export const getDefaultAddress = () => {
  return mockAddresses.find(addr => addr.isDefault);
};
