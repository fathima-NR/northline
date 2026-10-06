import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AuthResponse, User } from '../models';

const TOKEN_KEY = 'famsworld_token';
const USER_KEY = 'famsworld_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  token = signal(localStorage.getItem(TOKEN_KEY) || '');
  user = signal<User | null>(this.readUser());
  isLoggedIn = computed(() => !!this.token());

  register(body: { name: string; email: string; password: string; phone?: string }) {
    return this.http.post<AuthResponse>('/api/auth/register', body).pipe(tap((res) => this.persist(res)));
  }

  login(body: { email: string; password: string }) {
    return this.http.post<AuthResponse>('/api/auth/login', body).pipe(tap((res) => this.persist(res)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('freshmart_token');
    localStorage.removeItem('freshmart_user');
    this.token.set('');
    this.user.set(null);
  }

  private persist(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.token.set(res.token);
    this.user.set(res.user);
  }

  private readUser(): User | null {
    localStorage.removeItem('freshmart_token');
    localStorage.removeItem('freshmart_user');
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
