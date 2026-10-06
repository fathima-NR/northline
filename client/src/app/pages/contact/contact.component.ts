import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private catalog = inject(CatalogService);
  error = signal('');
  sent = signal('');
  busy = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    topic: ['Order help', Validators.required],
    body: ['', [Validators.required, Validators.minLength(12)]]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Add your name, a valid email, and a short message.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.catalog.contact(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.sent.set(res.message);
        this.busy.set(false);
        this.form.reset({ name: '', email: '', topic: 'Order help', body: '' });
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Could not send your message');
        this.busy.set(false);
      }
    });
  }
}
