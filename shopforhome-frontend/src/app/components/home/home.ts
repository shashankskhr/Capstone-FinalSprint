import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService }
  from '../../services/product';
import { AuthService }
  from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  categories: any[] = [];
  featuredProducts: any[] = [];
  loading = false;

  stats = [
    {
      icon: '🛋️',
      count: '500+',
      label: 'Products'
    },
    {
      icon: '😊',
      count: '1000+',
      label: 'Happy Customers'
    },
    {
      icon: '🚚',
      count: 'Free',
      label: 'Delivery'
    },
    {
      icon: '⭐',
      count: '4.8',
      label: 'Rating'
    }
  ];

  testimonials = [
    {
      name: 'Rahul Sharma',
      text: 'Amazing products and fast delivery. Love the furniture collection!',
      rating: 5,
      avatar: 'RS'
    },
    {
      name: 'Priya Singh',
      text: 'Best home decor store online. Quality is top notch!',
      rating: 5,
      avatar: 'PS'
    },
    {
      name: 'Amit Kumar',
      text: 'Great prices and excellent customer service.',
      rating: 4,
      avatar: 'AK'
    }
  ];

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.productService.getCategories()
      .subscribe({
        next: (c) => this.categories = c,
        error: (err) =>
          console.log('Category error:', err)
      });

    this.productService.getProducts()
      .subscribe({
        next: (p) => {
          this.featuredProducts = p.slice(0, 6);
          this.loading = false;
        },
        error: (err) => {
          console.log('Products error:', err);
          this.loading = false;
        }
      });
  }

  browseByCategory(categoryId: number) {
    this.router.navigate(['/products'],
      { queryParams: { categoryId } });
  }

  getCategoryIcon(name: string): string {
    switch (name) {
      case 'Furniture': return '🛋️';
      case 'Home Décor': return '🏺';
      case 'Lighting': return '💡';
      default: return '🏠';
    }
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl ||
        imageUrl.trim() === '') {
      return 'https://via.placeholder.com/' +
        '400x300?text=No+Image';
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
      'https://via.placeholder.com/' +
      '400x300?text=No+Image';
  }

  getStars(rating: number): string[] {
    return Array(rating).fill('⭐');
  }
}