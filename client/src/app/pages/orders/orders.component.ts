import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order, money } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CatalogService } from '../../services/catalog.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  private catalog = inject(CatalogService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  orders = signal<Order[]>([]);
  error = signal('');
  placed = signal('');
  money = money;

  ngOnInit() {
    this.placed.set(history.state?.placed || '');
    this.catalog.myOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => this.error.set('Orders could not be loaded.')
    });
  }

  when(value: string) {
    return new Date(value).toLocaleString('en-AE', { dateStyle: 'medium', timeStyle: 'short' });
  }

  payLabel(method: string) {
    return method === 'card' ? 'Card' : 'Cash on delivery';
  }

  logout() {
    this.auth.logout();
    this.toast.show('Signed out');
    this.router.navigateByUrl('/');
  }
}
