import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private router = inject(Router);
  auth = inject(AuthService);
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  query = '';
  open = signal(false);

  search() {
    const search = this.query.trim();
    this.open.set(false);
    this.router.navigate(['/shop'], { queryParams: search ? { search } : {} });
  }

  close() {
    this.open.set(false);
  }
}
