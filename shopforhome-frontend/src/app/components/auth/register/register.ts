import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {

  form = {
    fullName: '',
    email: '',
    password: '',
    role: 'User'
  };

  error = '';
  loading = false;
  registered = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.error = '';
    this.registered = false;

    if (!this.form.fullName.trim()) {
      this.error = 'Full name is required.';
      return;
    }
    if (!this.form.email.trim()) {
      this.error = 'Email is required.';
      return;
    }
    if (!this.form.password.trim()) {
      this.error = 'Password is required.';
      return;
    }

    this.loading = true;

    this.authService.register(this.form).subscribe({
      next: (res: any) => {
        console.log('SUCCESS:', res);
        this.loading = false;
        this.registered = true;
      },
      error: (err: any) => {
        console.log('ERROR STATUS:', err.status);
        console.log('ERROR BODY:', err.error);
        this.loading = false;

        if (err.status === 400) {
          this.error = err.error?.message ||
            'Email already exists.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server.';
        } else if (err.status === 500) {
          this.error = 'Server error. Try again.';
        } else {
          this.registered = true;
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}