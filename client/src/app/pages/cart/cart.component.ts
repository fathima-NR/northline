import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { money } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
  money = money;
}
