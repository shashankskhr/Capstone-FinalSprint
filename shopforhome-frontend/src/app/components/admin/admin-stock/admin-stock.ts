import { Component, OnInit } from '@angular/core';
import { ProductService }
  from '../../../services/product';

@Component({
  selector: 'app-admin-stock',
  standalone: false,
  templateUrl: './admin-stock.html',
  styleUrls: ['./admin-stock.scss']
})
export class AdminStockComponent
  implements OnInit {

  lowStockProducts: any[] = [];
  allProducts: any[] = [];
  loading = false;
  message = '';

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadLowStock();
    this.loadAllProducts();
  }

  loadLowStock() {
    this.loading = true;
    this.productService.getLowStock()
      .subscribe({
        next: (p) => {
          console.log('Low stock:', p);
          this.lowStockProducts = p;
          this.loading = false;
        },
        error: (err) => {
          console.log('Low stock error:', err);
          this.loading = false;
        }
      });
  }

  loadAllProducts() {
    this.productService.getProducts()
      .subscribe({
        next: (p) => {
          this.allProducts = p;
        },
        error: (err) =>
          console.log('Products error:', err)
      });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl ||
        imageUrl.trim() === '') {
      return 'https://via.placeholder.com/' +
        '50x50?text=No+Image';
    }
    if (imageUrl.startsWith('http://') ||
        imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return 'https://localhost:7140/'
      + imageUrl;
  }

  onImageError(event: any) {
    event.target.src =
      'https://via.placeholder.com/50x50';
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Critical';
    if (stock < 10) return 'Low';
    return 'In Stock';
  }

  getStockColor(stock: number): string {
    if (stock === 0) return '#dc3545';
    if (stock < 5) return '#fd7e14';
    if (stock < 10) return '#ffc107';
    return '#28a745';
  }
}