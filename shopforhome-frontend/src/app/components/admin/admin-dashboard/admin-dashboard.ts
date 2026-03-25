import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {
  constructor(public authService: AuthService) {}
}