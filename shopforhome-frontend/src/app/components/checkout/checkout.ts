import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { CouponService } from '../../services/coupon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class CheckoutComponent implements OnInit {

  cartItems: any[] = [];
  userId: number = 0;
  couponCode = '';
  couponId: number | null = null;
  discountPercent = 0;
  message = '';
  error = '';
  loading = false;
  orderPlaced = false;
  orderId: number | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private couponService: CouponService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = user.userId;
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.loading = false;
      },
      error: (err) => {
        console.log('Cart error:', err);
        this.loading = false;
      }
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce((s, i) =>
      s + (i.product?.price || 0) * i.quantity, 0);
  }

  getDiscount(): number {
    return this.getSubtotal() *
      (this.discountPercent / 100);
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscount();
  }

  applyCoupon() {
    this.message = '';
    this.error = '';

    if (!this.couponCode.trim()) {
      this.error = 'Please enter a coupon code.';
      return;
    }

    this.couponService.validateCoupon({
      userId: this.userId,
      couponCode: this.couponCode
    }).subscribe({
      next: (res: any) => {
        this.discountPercent = res.discountPercent;
        this.couponId = res.couponId;
        this.message =
          `✅ Coupon applied! ${res.discountPercent}% off.`;
      },
      error: (err) => {
        this.error = err.error?.message ||
          '❌ Invalid or expired coupon.';
      }
    });
  }

  placeOrder() {
    this.message = '';
    this.error = '';
    this.loading = true;

    this.orderService.placeOrder({
      userId: this.userId,
      couponId: this.couponId
    }).subscribe({
      next: (res: any) => {
        console.log('Order placed:', res);
        this.loading = false;
        this.orderPlaced = true;
        this.orderId = res.orderId;
      },
      error: (err) => {
        console.log('Order error:', err);
        this.loading = false;
        this.error = err.error?.message ||
          '❌ Failed to place order.';
      }
    });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}