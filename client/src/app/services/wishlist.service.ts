import { Injectable, signal } from '@angular/core';
import { Product } from '../models';

const KEY = 'famsworld_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  items = signal<Product[]>(this.read());

  has(id: string) {
    return this.items().some((product) => product._id === id);
  }

  toggle(product: Product): string {
    if (this.has(product._id)) {
      this.write(this.items().filter((item) => item._id !== product._id));
      return 'Removed from wishlist';
    }
    this.write([product, ...this.items()]);
    return 'Saved to wishlist';
  }

  private read(): Product[] {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as Product[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(items: Product[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
    this.items.set(items);
  }
}
