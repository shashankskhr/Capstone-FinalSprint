import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  userId: number = 0;
  loading = false;
  message = '';
  error = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    public router: Router
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
    this.error = '';

    this.cartService.getCart(this.userId).subscribe({
      next: (items) => {
        console.log('Cart items:', items);
        this.cartItems = items;
        this.loading = false;
      },
      error: (err) => {
        console.log('Cart load error:', err);
        this.error = 'Failed to load cart.';
        this.loading = false;
      }
    });
  }

  updateQty(cartId: number, qty: number) {
    if (qty < 1) {
      this.remove(cartId);
      return;
    }
    this.cartService.updateQuantity(
      cartId, qty
    ).subscribe({
      next: () => {
        console.log('Qty updated');
        this.loadCart();
      },
      error: (err) =>
        console.log('Update error:', err)
    });
  }

  remove(cartId: number) {
    this.cartService.removeFromCart(cartId)
      .subscribe({
        next: () => {
          this.message = '✅ Item removed from cart.';
          this.loadCart();
          setTimeout(() => this.message = '', 2000);
        },
        error: (err) =>
          console.log('Remove error:', err)
      });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) =>
      sum + (item.product?.price || 0) *
        item.quantity, 0);
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl || imageUrl.trim() === '') {
      return 'https://via.placeholder.com/' +
        '80x80?text=No+Image';
    }
    if (imageUrl.startsWith('http://') ||
        imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `https://localhost:7140/${imageUrl}`;
  }

  onImageError(event: any) {
    event.target.src =
      'https://via.placeholder.com/80x80';
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}