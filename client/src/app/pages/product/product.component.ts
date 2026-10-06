import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, discountOf, money } from '../../models';
import { CartService } from '../../services/cart.service';
import { CatalogService } from '../../services/catalog.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product',
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private catalog = inject(CatalogService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);
  private toast = inject(ToastService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  qty = signal(1);
  error = signal('');
  money = money;
  discountOf = discountOf;
  stars = [1, 2, 3, 4, 5];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') || '';
      this.qty.set(1);
      this.catalog.product(slug).subscribe({
        next: (product) => {
          this.product.set(product);
          this.error.set('');
          this.catalog.products({ category: product.category }).subscribe((items) => {
            this.related.set(items.filter((item) => item._id !== product._id).slice(0, 4));
          });
        },
        error: () => {
          this.product.set(null);
          this.error.set('That product is no longer available.');
        }
      });
    });
  }

  wished() {
    const product = this.product();
    return !!product && this.wishlist.has(product._id);
  }

  changeQty(delta: number) {
    const product = this.product();
    if (!product) return;
    this.qty.set(Math.min(product.stock, Math.max(1, this.qty() + delta)));
  }

  add() {
    const product = this.product();
    if (!product) return;
    this.toast.show(this.cart.add(product, this.qty()));
  }

  toggleWish() {
    const product = this.product();
    if (!product) return;
    this.toast.show(this.wishlist.toggle(product));
  }
}
