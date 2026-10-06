import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  error = signal('');
  busy = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  fillDemo() {
    this.form.setValue({ email: 'demo@famsworld.com', password: 'demo123' });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.goNext(),
      error: (err) => {
        this.error.set(err.error?.message || 'Could not sign in');
        this.busy.set(false);
      }
    });
  }

  private goNext() {
    const next = this.route.snapshot.queryParamMap.get('next') || '/';
    this.router.navigateByUrl(next.startsWith('/') ? next : '/');
  }
}
