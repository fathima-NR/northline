import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { money } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CatalogService } from '../../services/catalog.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private catalog = inject(CatalogService);
  private router = inject(Router);
  private toast = inject(ToastService);
  cart = inject(CartService);
  auth = inject(AuthService);
  money = money;
  error = signal('');
  placing = signal(false);
  payment = signal<'cod' | 'card'>('card');

  form = this.fb.nonNullable.group({
    fullName: [this.auth.user()?.name || '', Validators.required],
    phone: [this.auth.user()?.phone || '', Validators.required],
    address: ['', Validators.required],
    city: ['New York', Validators.required],
    area: ['NY', Validators.required],
    notes: ['']
  });

  place() {
    if (!this.cart.items().length) {
      this.router.navigateByUrl('/cart');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please complete the delivery details.');
      return;
    }
    this.placing.set(true);
    this.error.set('');
    this.catalog.placeOrder({
      items: this.cart.items().map((line) => ({ product: line.product._id, qty: line.qty })),
      shipping: this.form.getRawValue(),
      paymentMethod: this.payment()
    }).subscribe({
      next: (order) => {
        this.cart.clear();
        this.toast.show('Order placed');
        this.router.navigate(['/orders'], { state: { placed: order._id } });
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Could not place the order');
        this.placing.set(false);
      }
    });
  }
}
