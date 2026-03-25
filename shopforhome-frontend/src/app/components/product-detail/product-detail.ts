import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router }
  from '@angular/router';
import { ProductService }
  from '../../services/product';
import { CartService }
  from '../../services/cart';
import { WishlistService }
  from '../../services/wishlist';
import { AuthService }
  from '../../services/auth';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {

  product: any = null;
  quantity = 1;
  message = '';
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot
      .paramMap.get('id')!;
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: (err) => {
        console.log('Product load error:', err);
        this.loading = false;
      }
    });
  }

  // ✅ Fix image URL
  getImageUrl(imageUrl: string): string {
    if (!imageUrl ||
        imageUrl === null ||
        imageUrl.trim() === '') {
      return 'https://via.placeholder.com/' +
        '500x400?text=No+Image';
    }
    if (imageUrl.startsWith('http://') ||
        imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `https://localhost:7140/${imageUrl}`;
  }

  onImageError(event: any) {
    event.target.src =
      'https://via.placeholder.com/' +
      '500x400?text=No+Image';
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getUser();
    this.message = '';
    this.error = '';

    this.cartService.addToCart({
      userId: user.userId,
      productId: this.product.productId,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.message = '✅ Added to cart!';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.log('Cart error:', err);
        this.error = '❌ Failed to add to cart.';
      }
    });
  }

  addToWishlist() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getUser();
    this.message = '';
    this.error = '';

    this.wishlistService.addToWishlist({
      userId: user.userId,
      productId: this.product.productId
    }).subscribe({
      next: () => {
        this.message = '✅ Added to wishlist!';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message ||
          '❌ Failed to add to wishlist.';
      }
    });
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }
}