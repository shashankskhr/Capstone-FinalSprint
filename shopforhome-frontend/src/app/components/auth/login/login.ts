import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  form = {
    email: '',
    password: ''
  };

  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';

    if (!this.form.email.trim() ||
        !this.form.password.trim()) {
      this.error = 'Email and password are required.';
      return;
    }

    this.loading = true;

    this.authService.login(this.form).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);
        this.loading = false;
        this.authService.saveUser(res);
        if (res.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err: any) => {
        console.log('Login error:', err);
        this.loading = false;

        if (err.status === 401) {
          this.error = 'Invalid email or password.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server.';
        } else {
          this.error = err.error?.message ||
            'Login failed. Please try again.';
        }
      }
    });
  }
}