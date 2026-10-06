import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CATEGORY_META, CategoryCount, Product } from '../../models';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  private catalog = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = signal<CategoryCount[]>([]);
  loading = signal(true);
  error = signal('');
  category = signal('All');
  search = signal('');
  deal = signal(false);
  sort = signal('newest');
  meta = CATEGORY_META;

  ngOnInit() {
    this.catalog.categories().subscribe({
      next: (categories) => this.categories.set(categories)
    });
    this.route.queryParamMap.subscribe((params) => {
      this.category.set(params.get('category') || 'All');
      this.search.set(params.get('search') || '');
      this.deal.set(params.get('deal') === 'true');
      this.sort.set(params.get('sort') || 'newest');
      this.load();
    });
  }

  title() {
    if (this.search()) return `Results for “${this.search()}”`;
    if (this.deal()) return 'Weekend deals';
    if (this.category() !== 'All') return this.category();
    return 'Shop all products';
  }

  choose(category: string) {
    this.update({ category: category === 'All' ? null : category });
  }

  changeSort(sort: string) {
    this.update({ sort });
  }

  private update(query: Record<string, string | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
      queryParamsHandling: 'merge'
    });
  }

  private load() {
    this.loading.set(true);
    this.error.set('');
    const filters: Record<string, string> = { sort: this.sort() };
    if (this.category() !== 'All') filters['category'] = this.category();
    if (this.search()) filters['search'] = this.search();
    if (this.deal()) filters['deal'] = 'true';

    this.catalog.products(filters).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Products could not be loaded.');
        this.loading.set(false);
      }
    });
  }
}
