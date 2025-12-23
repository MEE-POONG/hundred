// Core Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isInStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  ingredients: string[];
  directions: string;
  warnings: string[];
  fda: string;
  variants?: ProductVariant[];
  redeemable?: RedeemRule;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'flavor' | 'size';
  options: string[];
  priceModifier?: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

// Ticket System Types
export type TicketRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface TicketType {
  id: string;
  rarity: TicketRarity;
  name: string;
  color: string;
  glowColor: string;
  probability: number;
  icon: string;
}

export interface OwnedTicket {
  ticketId: string;
  rarity: TicketRarity;
  quantity: number;
}

export interface RedeemRule {
  productId: string;
  requiredTickets: {
    ticketId: string;
    rarity: TicketRarity;
    quantity: number;
  }[];
}

export interface RedemptionHistory {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  ticketsUsed: {
    rarity: TicketRarity;
    quantity: number;
  }[];
  redeemedAt: string;
  status: 'pending' | 'completed' | 'shipped';
}

export interface DrawHistory {
  id: string;
  ticketRarity: TicketRarity;
  ticketName: string;
  drawnAt: string;
}

// Order Types
export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  salePrice?: number;
  quantity: number;
  selectedVariants?: {
    [key: string]: string;
  };
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber?: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderTimeline {
  status: string;
  label: string;
  date?: string;
  completed: boolean;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: 'user' | 'admin';
  joinedAt: string;
}

// Admin Types
export interface KPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
}
