import { Product } from './types';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Fat Burn Extreme 3000',
    slug: 'fat-burn-extreme-3000',
    description: 'อาหารเสริมลดน้ำหนักสูตรเข้มข้น ช่วยเผาผลาญไขมันเร่งด่วน พร้อมสารสกัดจากธรรมชาติ 100%',
    shortDescription: 'เผาผลาญไขมันเร่งด่วน ลดน้ำหนักได้จริง',
    price: 1290,
    salePrice: 990,
    images: ['https://placehold.co/600x600/1A1A2A/FF4D9D?text=Fat+Burn', 'https://placehold.co/600x600/1A1A2A/FF7AC3?text=Detail'],
    category: 'weight-loss',
    categoryName: 'ลดน้ำหนัก',
    rating: 4.8,
    reviewCount: 324,
    stock: 45,
    isInStock: true,
    isFeatured: true,
    isOnSale: true,
    ingredients: ['Green Tea Extract', 'L-Carnitine', 'Garcinia Cambogia', 'Chromium Picolinate'],
    directions: 'รับประทานวันละ 2 แคปซูล ก่อนอาหารเช้าและเย็น พร้อมน้ำเปล่า 1-2 แก้ว',
    warnings: ['ไม่เหมาะสำหรับเด็ก สตรีมีครรภ์และให้นมบุตร', 'หากมีอาการผิดปกติให้หยุดทานทันที'],
    fda: '10-1-12345-6-0001',
    variants: [
      { id: 'v1', name: 'ขนาด', type: 'size', options: ['30 แคปซูล', '60 แคปซูล', '90 แคปซูล'], priceModifier: 200 }
    ]
  },
  {
    id: 'p2',
    name: 'Collagen Plus+ Premium',
    slug: 'collagen-plus-premium',
    description: 'คอลลาเจนชนิดดื่มสูตรพรีเมียม เพิ่มความชุ่มชื้นให้ผิว ลดริ้วรอย ผิวกระจ่างใส',
    shortDescription: 'ผิวสวยใส ลดริ้วรอย ด้วยคอลลาเจนเข้มข้น',
    price: 1890,
    salePrice: 1490,
    images: ['https://placehold.co/600x600/1A1A2A/B84DFF?text=Collagen', 'https://placehold.co/600x600/1A1A2A/FF4D9D?text=Detail'],
    category: 'skin-care',
    categoryName: 'บำรุงผิว',
    rating: 4.9,
    reviewCount: 567,
    stock: 89,
    isInStock: true,
    isFeatured: true,
    isOnSale: true,
    ingredients: ['Fish Collagen Peptide 10,000mg', 'Vitamin C', 'Glutathione', 'Hyaluronic Acid'],
    directions: 'ดื่มวันละ 1 ซอง หลังอาหาร หรือก่อนนอน ผสมน้ำเย็น 150-200 มล.',
    warnings: ['ผู้แพ้อาหารทะเลควรหลีกเลี่ยง', 'เก็บในที่แห้งและเย็น'],
    fda: '10-1-12345-6-0002',
    variants: [
      { id: 'v2', name: 'รสชาติ', type: 'flavor', options: ['รสพีช', 'รสเบอร์รี่', 'รสมะนาว'] }
    ],
    redeemable: {
      productId: 'p2',
      requiredTickets: [
        { ticketId: 't3', rarity: 'Epic', quantity: 2 }
      ]
    }
  },
  {
    id: 'p3',
    name: 'Mega Multivitamin Complex',
    slug: 'mega-multivitamin-complex',
    description: 'วิตามินรวมครบสูตรสำหรับทุกเพศทุกวัย บำรุงร่างกาย เสริมภูมิคุ้มกัน',
    shortDescription: 'วิตามินรวมครบสูตร 30+ ชนิด',
    price: 890,
    images: ['https://placehold.co/600x600/1A1A2A/52D395?text=Multivitamin'],
    category: 'vitamins',
    categoryName: 'วิตามินรวม',
    rating: 4.7,
    reviewCount: 234,
    stock: 120,
    isInStock: true,
    isFeatured: true,
    isOnSale: false,
    ingredients: ['Vitamin A, C, D, E, K', 'B-Complex', 'Zinc', 'Magnesium', 'Calcium'],
    directions: 'รับประทานวันละ 1 เม็ด หลังอาหารเช้า',
    warnings: ['ไม่ควรเกินขนาดที่แนะนำ'],
    fda: '10-1-12345-6-0003'
  },
  {
    id: 'p4',
    name: 'Whey Protein Isolate Pro',
    slug: 'whey-protein-isolate-pro',
    description: 'เวย์โปรตีนไอโซเลทบริสุทธิ์ 95% เพิ่มกล้ามเนื้อ ฟื้นฟูกล้ามหลังออกกำลังกาย',
    shortDescription: 'โปรตีนบริสุทธิ์ 95% สร้างกล้ามเนื้อเร็ว',
    price: 2290,
    salePrice: 1890,
    images: ['https://placehold.co/600x600/1A1A2A/FBCA2C?text=Whey+Protein'],
    category: 'protein',
    categoryName: 'โปรตีน',
    rating: 4.9,
    reviewCount: 892,
    stock: 67,
    isInStock: true,
    isFeatured: true,
    isOnSale: true,
    ingredients: ['Whey Protein Isolate 95%', 'BCAA', 'L-Glutamine', 'Natural Flavors'],
    directions: 'ผสม 1 สกู๊ป (30g) กับน้ำหรือนม 200-250 มล. ดื่มหลังออกกำลังกายทันที',
    warnings: ['ผู้แพ้นมวัวไม่ควรรับประทาน', 'เก็บในที่แห้งและปิดฝาให้สนิท'],
    fda: '10-1-12345-6-0004',
    variants: [
      { id: 'v3', name: 'รสชาติ', type: 'flavor', options: ['ช็อกโกแลต', 'วานิลลา', 'สตรอว์เบอร์รี่', 'กล้วยหอม'] },
      { id: 'v4', name: 'ขนาด', type: 'size', options: ['1 kg', '2 kg', '5 kg'], priceModifier: 800 }
    ],
    redeemable: {
      productId: 'p4',
      requiredTickets: [
        { ticketId: 't4', rarity: 'Legendary', quantity: 1 }
      ]
    }
  },
  {
    id: 'p5',
    name: 'Detox Fiber Plus',
    slug: 'detox-fiber-plus',
    description: 'ดีท็อกซ์ล้างสารพิษ ใยอาหารสูง ช่วยระบบขับถ่าย ลำใส้สะอาด ลดพุง',
    shortDescription: 'ดีท็อกซ์ ล้างสารพิษ ลำไส้สะอาด',
    price: 690,
    salePrice: 490,
    images: ['https://placehold.co/600x600/1A1A2A/16A34A?text=Detox'],
    category: 'detox',
    categoryName: 'ดีท็อกซ์',
    rating: 4.6,
    reviewCount: 156,
    stock: 200,
    isInStock: true,
    isFeatured: false,
    isOnSale: true,
    ingredients: ['Psyllium Husk', 'Inulin', 'Chlorophyll', 'Probiotics'],
    directions: 'ผสม 1 ซอง กับน้ำเย็น 250 มล. ดื่มก่อนนอน',
    warnings: ['ควรดื่มน้ำเพิ่มอีกอย่างน้อย 2 ลิตรต่อวัน'],
    fda: '10-1-12345-6-0005',
    redeemable: {
      productId: 'p5',
      requiredTickets: [
        { ticketId: 't2', rarity: 'Rare', quantity: 3 }
      ]
    }
  },
  {
    id: 'p6',
    name: 'Omega-3 Fish Oil 1000mg',
    slug: 'omega-3-fish-oil-1000mg',
    description: 'โอเมก้า 3 น้ำมันปลาบริสุทธิ์ บำรุงสมอง หัวใจ และข้อต่อ',
    shortDescription: 'น้ำมันปลาบริสุทธิ์ บำรุงสมองและหัวใจ',
    price: 790,
    images: ['https://placehold.co/600x600/1A1A2A/0EA5E9?text=Omega-3'],
    category: 'vitamins',
    categoryName: 'วิตามินรวม',
    rating: 4.8,
    reviewCount: 445,
    stock: 150,
    isInStock: true,
    isFeatured: false,
    isOnSale: false,
    ingredients: ['Fish Oil 1000mg (EPA 180mg, DHA 120mg)', 'Vitamin E'],
    directions: 'รับประทานวันละ 1-2 แคปซูล หลังอาหาร',
    warnings: ['ผู้แพ้อาหารทะเลควรปรึกษาแพทย์', 'เก็บในที่เย็น'],
    fda: '10-1-12345-6-0006'
  },
  {
    id: 'p7',
    name: 'L-Glutathione Whitening',
    slug: 'l-glutathione-whitening',
    description: 'กลูต้าไธโอนบริสุทธิ์ ผิวขาวใส ลดฝ้า กระ จุดด่างดำ',
    shortDescription: 'กลูต้าไธโอน ผิวขาวใส ลดฝ้ากระ',
    price: 1590,
    salePrice: 1290,
    images: ['https://placehold.co/600x600/1A1A2A/E879F9?text=Glutathione'],
    category: 'skin-care',
    categoryName: 'บำรุงผิว',
    rating: 4.7,
    reviewCount: 378,
    stock: 75,
    isInStock: true,
    isFeatured: true,
    isOnSale: true,
    ingredients: ['L-Glutathione 500mg', 'Vitamin C', 'Alpha Lipoic Acid', 'Grape Seed Extract'],
    directions: 'รับประทานวันละ 1-2 แคปซูล หลังอาหาร พร้อมน้ำอุ่น',
    warnings: ['ไม่เหมาะสำหรับสตรีมีครรภ์และให้นมบุตร'],
    fda: '10-1-12345-6-0007',
    redeemable: {
      productId: 'p7',
      requiredTickets: [
        { ticketId: 't2', rarity: 'Rare', quantity: 2 },
        { ticketId: 't1', rarity: 'Common', quantity: 5 }
      ]
    }
  },
  {
    id: 'p8',
    name: 'BCAA 2:1:1 Energy Boost',
    slug: 'bcaa-211-energy-boost',
    description: 'บีซีเอเอ สูตรเพิ่มพลังงาน ฟื้นฟูกล้ามเนื้อ ลดอาการเมื่อยล้า',
    shortDescription: 'BCAA เพิ่มพลัง ฟื้นฟูกล้ามเนื้อ',
    price: 990,
    images: ['https://placehold.co/600x600/1A1A2A/F97316?text=BCAA'],
    category: 'protein',
    categoryName: 'โปรตีน',
    rating: 4.6,
    reviewCount: 289,
    stock: 0,
    isInStock: false,
    isFeatured: false,
    isOnSale: false,
    ingredients: ['BCAA 5000mg (Leucine 2500mg, Isoleucine 1250mg, Valine 1250mg)', 'Caffeine', 'Electrolytes'],
    directions: 'ผสม 1 สกู๊ป กับน้ำเย็น 300 มล. ดื่มระหว่างออกกำลังกาย',
    warnings: ['มีคาเฟอีน ไม่เหมาะสำหรับเด็กและสตรีมีครรภ์'],
    fda: '10-1-12345-6-0008',
    variants: [
      { id: 'v5', name: 'รสชาติ', type: 'flavor', options: ['องุ่น', 'แตงโม', 'มะนาว'] }
    ]
  },
  {
    id: 'p9',
    name: 'Green Coffee Bean Extract',
    slug: 'green-coffee-bean-extract',
    description: 'สารสกัดจากเมล็ดกาแฟเขียว ควบคุมน้ำหนัก เผาผลาญไขมัน',
    shortDescription: 'กาแฟเขียว ควบคุมน้ำหนัก',
    price: 890,
    salePrice: 690,
    images: ['https://placehold.co/600x600/1A1A2A/15803D?text=Green+Coffee'],
    category: 'weight-loss',
    categoryName: 'ลดน้ำหนัก',
    rating: 4.5,
    reviewCount: 198,
    stock: 95,
    isInStock: true,
    isFeatured: false,
    isOnSale: true,
    ingredients: ['Green Coffee Bean Extract 800mg', 'Chlorogenic Acid 50%'],
    directions: 'รับประทานวันละ 1 แคปซูล ก่อนอาหารเช้า',
    warnings: ['มีคาเฟอีนเล็กน้อย'],
    fda: '10-1-12345-6-0009',
    redeemable: {
      productId: 'p9',
      requiredTickets: [
        { ticketId: 't1', rarity: 'Common', quantity: 10 }
      ]
    }
  },
  {
    id: 'p10',
    name: 'Biotin Hair & Nail Formula',
    slug: 'biotin-hair-nail-formula',
    description: 'ไบโอตินบำรุงผม เล็บ ลดผมร่วง เล็บแข็งแรง',
    shortDescription: 'บำรุงผมและเล็บ ลดผมร่วง',
    price: 590,
    images: ['https://placehold.co/600x600/1A1A2A/DB2777?text=Biotin'],
    category: 'skin-care',
    categoryName: 'บำรุงผิว',
    rating: 4.8,
    reviewCount: 512,
    stock: 180,
    isInStock: true,
    isFeatured: false,
    isOnSale: false,
    ingredients: ['Biotin 10,000mcg', 'Keratin', 'Collagen', 'Vitamin E'],
    directions: 'รับประทานวันละ 1 เม็ด หลังอาหาร',
    warnings: ['ควรรับประทานอย่างต่อเนื่องอย่างน้อย 3 เดือน'],
    fda: '10-1-12345-6-0010'
  },
  {
    id: 'p11',
    name: 'Probiotic Digestive Health',
    slug: 'probiotic-digestive-health',
    description: 'โปรไบโอติก 10 พันล้าน CFU ดูแลระบบทางเดินอาหาร เสริมภูมิคุ้มกัน',
    shortDescription: 'โปรไบโอติก ดูแลระบบย่อยอาหาร',
    price: 1190,
    images: ['https://placehold.co/600x600/1A1A2A/7C3AED?text=Probiotic'],
    category: 'detox',
    categoryName: 'ดีท็อกซ์',
    rating: 4.9,
    reviewCount: 423,
    stock: 110,
    isInStock: true,
    isFeatured: true,
    isOnSale: false,
    ingredients: ['Lactobacillus & Bifidobacterium 10 Billion CFU', 'Prebiotic Fiber', 'Digestive Enzymes'],
    directions: 'รับประทานวันละ 1 แคปซูล ก่อนอาหารเช้า',
    warnings: ['เก็บในตู้เย็นเพื่อรักษาแบคทีเรียมีชีวิต'],
    fda: '10-1-12345-6-0011',
    redeemable: {
      productId: 'p11',
      requiredTickets: [
        { ticketId: 't3', rarity: 'Epic', quantity: 1 },
        { ticketId: 't1', rarity: 'Common', quantity: 3 }
      ]
    }
  },
  {
    id: 'p12',
    name: 'Vitamin C 1000mg Immune Support',
    slug: 'vitamin-c-1000mg-immune-support',
    description: 'วิตามินซี 1000mg เสริมภูมิคุ้มกัน ต้านอนุมูลอิสระ',
    shortDescription: 'วิตามินซีสูง เสริมภูมิต้านทาน',
    price: 490,
    salePrice: 390,
    images: ['https://placehold.co/600x600/1A1A2A/F59E0B?text=Vitamin+C'],
    category: 'vitamins',
    categoryName: 'วิตามินรวม',
    rating: 4.7,
    reviewCount: 678,
    stock: 250,
    isInStock: true,
    isFeatured: true,
    isOnSale: true,
    ingredients: ['Vitamin C (Ascorbic Acid) 1000mg', 'Bioflavonoids', 'Rose Hip Extract'],
    directions: 'รับประทานวันละ 1 เม็ด หลังอาหาร',
    warnings: ['ไม่ควรเกินวันละ 2000mg'],
    fda: '10-1-12345-6-0012'
  },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured);
}

export function getOnSaleProducts(): Product[] {
  return products.filter(p => p.isOnSale);
}

export function getRedeemableProducts(): Product[] {
  return products.filter(p => p.redeemable);
}
