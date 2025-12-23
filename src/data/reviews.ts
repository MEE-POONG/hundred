import { Review } from './types';

export const mockReviews: Review[] = [
  {
    id: 'rev1',
    productId: 'p1',
    userName: 'น้ำฝน จันทร์แจ่ม',
    userAvatar: 'https://ui-avatars.com/api/?name=N+J&background=FF4D9D&color=fff',
    rating: 5,
    comment: 'ทานแล้วได้ผลจริง ลดไปแล้ว 5 กิโล ใน 2 เดือน ไม่มีผลข้างเคียง ชอบมากค่ะ',
    date: '2025-12-10T14:20:00Z',
  },
  {
    id: 'rev2',
    productId: 'p1',
    userName: 'สมชาย ใจดี',
    userAvatar: 'https://ui-avatars.com/api/?name=S+I&background=B84DFF&color=fff',
    rating: 4,
    comment: 'ดีครับ แต่ต้องควบคุมอาหารและออกกำลังกายด้วยนะ',
    date: '2025-12-08T09:15:00Z',
  },
  {
    id: 'rev3',
    productId: 'p2',
    userName: 'ปิยะนุช สวยงาม',
    userAvatar: 'https://ui-avatars.com/api/?name=P+S&background=FF7AC3&color=fff',
    rating: 5,
    comment: 'คอลลาเจนตัวนี้เจ๋งมาก ผิวชุ่มชื้นขึ้นเห็นได้ชัด ลดริ้วรอยด้วย รสชาติอร่อย',
    date: '2025-12-15T16:30:00Z',
    images: ['https://placehold.co/400x400/1A1A2A/B84DFF?text=Review+Photo'],
  },
  {
    id: 'rev4',
    productId: 'p2',
    userName: 'วรรณา ผิวขาว',
    userAvatar: 'https://ui-avatars.com/api/?name=W+P&background=52D395&color=fff',
    rating: 5,
    comment: 'ดื่มมา 1 เดือน เพื่อนบอกว่าหน้าสดใสขึ้น ผิวเนียนนุ่ม จะซื้อต่อค่ะ',
    date: '2025-12-12T11:45:00Z',
  },
  {
    id: 'rev5',
    productId: 'p4',
    userName: 'ธนากร กล้ามแกร่ง',
    userAvatar: 'https://ui-avatars.com/api/?name=T+K&background=FBCA2C&color=000',
    rating: 5,
    comment: 'โปรตีนดีมาก ไม่เลี่ยน ละลายง่าย กล้ามเนื้อโตชัดเจน แนะนำเลยครับ',
    date: '2025-12-18T08:20:00Z',
  },
  {
    id: 'rev6',
    productId: 'p4',
    userName: 'ภูมิ ฟิตหุ่นดี',
    userAvatar: 'https://ui-avatars.com/api/?name=P+F&background=FF4D9D&color=fff',
    rating: 4,
    comment: 'รสช็อกโกแลตอร่อยดี แต่ราคาค่อนข้างแพงหน่อย คุณภาพดีจริงครับ',
    date: '2025-12-16T13:10:00Z',
  },
  {
    id: 'rev7',
    productId: 'p7',
    userName: 'ชนิดา ผิวใส',
    userAvatar: 'https://ui-avatars.com/api/?name=C+P&background=E879F9&color=fff',
    rating: 5,
    comment: 'กลูต้าตัวนี้เห็นผลเร็ว ผิวขาวขึ้นจริง ฝ้ากระจางลง ต้องทานต่อแน่นอน',
    date: '2025-12-14T10:30:00Z',
  },
  {
    id: 'rev8',
    productId: 'p11',
    userName: 'สุภาพร ท้องแข็ง',
    userAvatar: 'https://ui-avatars.com/api/?name=S+T&background=7C3AED&color=fff',
    rating: 5,
    comment: 'โปรไบโอติกดีมาก ท้องไม่ผูก ระบบขับถ่ายดีขึ้น รู้สึกสบายท้อง',
    date: '2025-12-11T15:50:00Z',
  },
  {
    id: 'rev9',
    productId: 'p12',
    userName: 'อนุชา ไม่ป่วย',
    userAvatar: 'https://ui-avatars.com/api/?name=A+M&background=F59E0B&color=000',
    rating: 4,
    comment: 'วิตามินซีเข้มข้นดี ทานแล้วไม่ค่อยป่วย ภูมิต้านทานดีขึ้น',
    date: '2025-12-09T12:25:00Z',
  },
  {
    id: 'rev10',
    productId: 'p5',
    userName: 'มาลี ลำไส้สะอาด',
    userAvatar: 'https://ui-avatars.com/api/?name=M+L&background=16A34A&color=fff',
    rating: 4,
    comment: 'ดีท็อกซ์ดีครับ ขับถ่ายสะดวก แต่ต้องดื่มน้ำเยอะๆ ด้วยนะ',
    date: '2025-12-07T17:40:00Z',
  },
];

export function getReviewsByProductId(productId: string): Review[] {
  return mockReviews.filter(r => r.productId === productId);
}

export function getAverageRating(productId: string): number {
  const reviews = getReviewsByProductId(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}
