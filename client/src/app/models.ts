export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number;
  category: string;
  unit: string;
  brand?: string;
  sku?: string;
  highlights?: string[];
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  deal: boolean;
  featured: boolean;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface CartLine {
  product: Product;
  qty: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  unit: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shipping: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    area: string;
    notes?: string;
  };
  paymentMethod: 'cod' | 'card';
  itemsPrice: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
}

export const CATEGORY_META: Record<string, { icon: string; image: string; blurb: string }> = {
  Bags: {
    icon: '🎒',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&h=400&q=80',
    blurb: 'Carry the day'
  },
  Audio: {
    icon: '🎧',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=400&q=80',
    blurb: 'Sound that stays'
  },
  Watches: {
    icon: '⌚',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&h=400&q=80',
    blurb: 'Time, worn well'
  },
  Cameras: {
    icon: '📷',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&h=400&q=80',
    blurb: 'Take it with you'
  },
  Home: {
    icon: '🪴',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400&h=400&q=80',
    blurb: 'Objects for the room'
  },
  Accessories: {
    icon: '🕶️',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&h=400&q=80',
    blurb: 'Finish the outfit'
  }
};

export function money(value: number): string {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function discountOf(product: { price: number; comparePrice: number }): number {
  if (!product.comparePrice || product.comparePrice <= product.price) return 0;
  return Math.round((1 - product.price / product.comparePrice) * 100);
}
