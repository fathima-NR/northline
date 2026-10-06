import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CategoryCount, Order, Product } from '../models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);

  products(filters: Record<string, string> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params = params.set(key, value);
    });
    return this.http.get<Product[]>('/api/products', { params });
  }

  categories() {
    return this.http.get<CategoryCount[]>('/api/products/meta/categories');
  }

  product(slug: string) {
    return this.http.get<Product>(`/api/products/${slug}`);
  }

  placeOrder(body: unknown) {
    return this.http.post<Order>('/api/orders', body);
  }

  myOrders() {
    return this.http.get<Order[]>('/api/orders/mine');
  }

  contact(body: { name: string; email: string; topic: string; body: string }) {
    return this.http.post<{ id: string; message: string }>('/api/contact', body);
  }
}
