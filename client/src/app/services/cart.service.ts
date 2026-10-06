import { Injectable, computed, signal } from '@angular/core';
import { CartLine, Product } from '../models';

const KEY = 'famsworld_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartLine[]>(this.read());
  count = computed(() => this.items().reduce((sum, line) => sum + line.qty, 0));
  subtotal = computed(() => this.items().reduce((sum, line) => sum + line.product.price * line.qty, 0));
  delivery = computed(() => (this.subtotal() === 0 || this.subtotal() >= 50 ? 0 : 10));
  total = computed(() => this.subtotal() + this.delivery());

  add(product: Product, qty = 1): string {
    const items = this.items().map((line) => ({ ...line }));
    const existing = items.find((line) => line.product._id === product._id);
    const nextQty = (existing?.qty || 0) + qty;

    if (nextQty > product.stock) {
      return `Only ${product.stock} ${product.unit} of ${product.name} left`;
    }

    if (existing) existing.qty = nextQty;
    else items.push({ product, qty });

    this.write(items);
    return `${product.name} added to cart`;
  }

  setQty(productId: string, qty: number) {
    const items = this.items()
      .map((line) => (line.product._id === productId ? { ...line, qty } : line))
      .filter((line) => line.qty > 0);
    const line = items.find((item) => item.product._id === productId);
    if (line && line.qty > line.product.stock) {
      line.qty = line.product.stock;
    }
    this.write(items);
  }

  remove(productId: string) {
    this.write(this.items().filter((line) => line.product._id !== productId));
  }

  clear() {
    this.write([]);
  }

  private read(): CartLine[] {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as CartLine[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(items: CartLine[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
    this.items.set(items);
  }
}
