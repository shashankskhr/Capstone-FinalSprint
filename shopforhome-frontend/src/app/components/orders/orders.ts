import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  loading = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loading = true;
    this.orderService.getUserOrders(user.userId).subscribe({
      next: (o) => {
        console.log('Orders:', o);
        this.orders = o;
        this.loading = false;
      },
      error: (err) => {
        console.log('Orders error:', err);
        this.loading = false;
      }
    });
  }
}