export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  healthGoal: string[];
  tags: string[];
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  warnings: string[];
  stock: number;
  isVegan: boolean;
  isSugarFree: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  registeredDate: string;
}

export interface Payment {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedDate: string;
  tags: string[];
  readTime: number;
}

export interface Certificate {
  id: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  issuedBy: string;
  validUntil: string;
}
