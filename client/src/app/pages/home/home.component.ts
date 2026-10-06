import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CATEGORY_META, CategoryCount, Product, money } from '../../models';
import { CatalogService } from '../../services/catalog.service';

interface Slide {
  eyebrow: string;
  title: string;
  lede: string;
  cta: string;
  link: string;
  query?: Record<string, string>;
  image: string;
  alt: string;
  badge: string;
  pick: string;
  slug: string;
  price: string;
  compare: string;
  rating: string;
  note: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private catalog = inject(CatalogService);
  private clockTimer: ReturnType<typeof setInterval> | null = null;
  private slideTimer: ReturnType<typeof setInterval> | null = null;
  private quoteTimer: ReturnType<typeof setInterval> | null = null;

  deals = signal<Product[]>([]);
  featured = signal<Product[]>([]);
  picks = signal<Record<string, Product>>({});
  categories = signal<CategoryCount[]>([]);
  loading = signal(true);
  error = signal('');
  clock = signal({ h: '00', m: '00', s: '00' });
  slideIndex = signal(0);
  quoteIndex = signal(0);
  paused = signal(false);
  email = signal('');
  note = signal('');
  joining = signal(false);
  meta = CATEGORY_META;
  money = money;

  slides: Slide[] = [
    {
      eyebrow: 'New season · Free shipping over $50',
      title: 'Quality products, trusted by thousands',
      lede: 'Bags, headphones, watches, cameras, and home pieces chosen for everyday use.',
      cta: 'Shop now',
      link: '/shop',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=80',
      alt: 'Navy backpack ready for a commute',
      badge: '40% OFF',
      pick: 'Trail Backpack',
      slug: 'trail-backpack',
      price: '$89',
      compare: '$120',
      rating: '4.8',
      note: 'Laptop sleeve · 24 ready to ship'
    },
    {
      eyebrow: 'Audio · In stock today',
      title: 'Headphones that stay comfortable past the second hour',
      lede: 'Over-ear and in-ear sets with USB-C charging, packed and shipped from New York.',
      cta: 'Shop audio',
      link: '/shop',
      query: { category: 'Audio' },
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80',
      alt: 'Studio headphones on a stand',
      badge: 'NEW',
      pick: 'Studio Headphones',
      slug: 'studio-headphones',
      price: '$149',
      compare: '$199',
      rating: '4.9',
      note: 'USB-C charging · 22 ready to ship'
    },
    {
      eyebrow: 'This week · Marked down',
      title: 'Watches, cameras, and carry goods on sale',
      lede: 'Prices drop while stock lasts. Standard shipping is free once the bag passes $50.',
      cta: 'See deals',
      link: '/shop',
      query: { deal: 'true' },
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80',
      alt: 'Wristwatch on a dark surface',
      badge: 'SALE',
      pick: 'Field Watch',
      slug: 'field-watch',
      price: '$139',
      compare: '$175',
      rating: '4.7',
      note: 'Canvas strap · gift box included'
    }
  ];

  quotes = [
    { name: 'Maya Chen', place: 'Brooklyn, NY', text: 'The trail backpack fits a 14-inch laptop and still looks clean on the train. It arrived two days after I ordered.' },
    { name: 'Jordan Hale', place: 'Chicago, IL', text: 'I wore the studio headphones through a full workday. The cushions are the reason I kept them instead of sending them back.' },
    { name: 'Priya Nair', place: 'Austin, TX', text: 'The field watch is lighter than the photos suggest. Swapping the strap took a minute, and the return window made the order easy.' },
    { name: 'Luis Ortega', place: 'Seattle, WA', text: 'The camera sling sits flat under a jacket. Customer care answered a fit question the same afternoon.' }
  ];

  stories = [
    { title: 'How an order leaves the building', text: 'Orders placed before 2:00 pm on a business day are packed the same day in a padded mailer or a rigid box.', link: '/shipping', label: 'Shipping details' },
    { title: 'Thirty days, written plainly', text: 'Unused items come back with a prepaid label. Refunds return to the original payment method after we inspect the parcel.', link: '/returns', label: 'Return policy' },
    { title: 'A person reads the inbox', text: 'Questions about fit, SKUs, and shipments go to hello@northline.store. We reply within one business day.', link: '/contact', label: 'Write to us' }
  ];

  shots = [
    { src: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80', alt: 'Daypack on a chair', category: 'Bags' },
    { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', alt: 'Headphones', category: 'Audio' },
    { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', alt: 'Watch', category: 'Watches' },
    { src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', alt: 'Camera on a table', category: 'Cameras' },
    { src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80', alt: 'Living room chair', category: 'Home' },
    { src: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80', alt: 'Sunglasses', category: 'Accessories' }
  ];

  ticker = ['Free shipping over $50', '30-day returns', 'Ships in 3–5 business days', 'Card or cash on delivery', 'Packed in New York', 'hello@northline.store'];
  tickerLoop = [...this.ticker, ...this.ticker];

  ngOnInit() {
    this.tick();
    this.clockTimer = setInterval(() => this.tick(), 1000);
    this.armSlides();
    this.quoteTimer = setInterval(() => this.nextQuote(), 7000);
    forkJoin({
      deals: this.catalog.products({ deal: 'true' }),
      featured: this.catalog.products({ featured: 'true' }),
      categories: this.catalog.categories(),
      catalog: this.catalog.products({})
    }).subscribe({
      next: (data) => {
        this.deals.set(data.deals.slice(0, 8));
        this.featured.set(data.featured.slice(0, 4));
        this.categories.set(data.categories);
        const picks: Record<string, Product> = {};
        for (const product of data.catalog) {
          const current = picks[product.category];
          if (!current || product.rating > current.rating) picks[product.category] = product;
        }
        this.picks.set(picks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Products could not be loaded. Refresh the page in a moment.');
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.clockTimer) clearInterval(this.clockTimer);
    if (this.slideTimer) clearInterval(this.slideTimer);
    if (this.quoteTimer) clearInterval(this.quoteTimer);
  }

  pause() { this.paused.set(true); }
  resume() { this.paused.set(false); }

  next() {
    this.slideIndex.update((index) => (index + 1) % this.slides.length);
  }

  prev() {
    this.slideIndex.update((index) => (index - 1 + this.slides.length) % this.slides.length);
  }

  go(index: number) {
    this.slideIndex.set(index);
    this.armSlides();
  }

  nextQuote() {
    this.quoteIndex.update((index) => (index + 1) % this.quotes.length);
  }

  prevQuote() {
    this.quoteIndex.update((index) => (index - 1 + this.quotes.length) % this.quotes.length);
  }

  subscribe() {
    const email = this.email().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.note.set('Enter the email you want notes sent to.');
      return;
    }
    this.joining.set(true);
    this.catalog.contact({
      name: 'Newsletter',
      email,
      topic: 'Newsletter',
      body: 'Please add this address to new arrivals and sale notes.'
    }).subscribe({
      next: () => {
        this.note.set('You are on the list. We write when new pieces land.');
        this.email.set('');
        this.joining.set(false);
      },
      error: () => {
        this.note.set('We could not save that email. Try again in a moment.');
        this.joining.set(false);
      }
    });
  }

  armSlides() {
    if (this.slideTimer) clearInterval(this.slideTimer);
    this.slideTimer = setInterval(() => {
      if (!this.paused()) this.next();
    }, 5500);
  }

  private tick() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const pad = (value: number) => String(value).padStart(2, '0');
    this.clock.set({
      h: pad(Math.floor(diff / 3600000)),
      m: pad(Math.floor((diff % 3600000) / 60000)),
      s: pad(Math.floor((diff % 60000) / 1000))
    });
  }
}
