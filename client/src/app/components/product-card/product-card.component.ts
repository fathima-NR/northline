import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, discountOf, money } from '../../models';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  product = input.required<Product>();
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);
  private toast = inject(ToastService);

  money = money;
  discountOf = discountOf;

  wished() {
    return this.wishlist.has(this.product()._id);
  }

  stars() {
    return [1, 2, 3, 4, 5];
  }

  toggleWish() {
    this.toast.show(this.wishlist.toggle(this.product()));
  }

  add() {
    this.toast.show(this.cart.add(this.product()));
  }
}
