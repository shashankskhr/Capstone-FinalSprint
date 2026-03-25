import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-wishlist',

  standalone: false,
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss']
})
export class WishlistComponent implements OnInit {

  wishlistItems: any[] = [];
  userId: number = 0;
  loading = false;
  message = '';
  error = '';

  constructor(
    private wishlistService: WishlistService,
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
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.wishlistService.getWishlist(this.userId).subscribe({
      next: (items) => {
        console.log('Wishlist:', items);
        this.wishlistItems = items;
        this.loading = false;
      },
      error: (err) => {
        console.log('Wishlist error:', err);
        this.loading = false;
      }
    });
  }

  remove(wishlistId: number) {
    this.wishlistService
      .removeFromWishlist(wishlistId).subscribe({
        next: () => {
          this.message = 'Removed from wishlist.';
          this.loadWishlist();
          setTimeout(() => this.message = '', 2000);
        },
        error: (err) => console.log('Remove error:', err)
      });
  }

  moveToCart(item: any) {
    this.message = '';
    this.error = '';

    this.cartService.addToCart({
      userId: this.userId,
      productId: item.productId,
      quantity: 1
    }).subscribe({
      next: () => {
        this.message =
          `✅ ${item.product?.productName} moved to cart!`;
        this.remove(item.wishlistId);
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.log('Move to cart error:', err);
        this.error = '❌ Failed to move to cart.';
      }
    });
  }
}