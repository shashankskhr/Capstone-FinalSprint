import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService }
  from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  loading = false;
  error = '';
  searchQuery = '';

  filters = {
    categoryId: null as any,
    minPrice: null as any,
    maxPrice: null as any,
    minRating: null as any
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.doSearch(this.searchQuery);
      } else {
        this.searchQuery = '';
        if (params['categoryId']) {
          this.filters.categoryId =
            params['categoryId'];
        }
        this.loadProducts();
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (c) => this.categories = c,
      error: (err) =>
        console.log('Category error:', err)
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    this.products = [];

    const activeFilters: any = {};
    if (this.filters.categoryId)
      activeFilters.categoryId =
        this.filters.categoryId;
    if (this.filters.minPrice)
      activeFilters.minPrice =
        this.filters.minPrice;
    if (this.filters.maxPrice)
      activeFilters.maxPrice =
        this.filters.maxPrice;
    if (this.filters.minRating)
      activeFilters.minRating =
        this.filters.minRating;

    this.productService.getProducts(activeFilters)
      .subscribe({
        next: (p) => {
          console.log('Products:', p);
          this.products = p;
          this.loading = false;
        },
        error: (err) => {
          console.log('Load error:', err);
          this.error = 'Failed to load products.';
          this.loading = false;
        }
      });
  }

  doSearch(query: string) {
    this.loading = true;
    this.error = '';
    this.products = [];

    this.productService.search(query).subscribe({
      next: (p) => {
        this.products = p;
        this.loading = false;
      },
      error: (err) => {
        console.log('Search error:', err);
        this.error = 'Search failed.';
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
        '300x180?text=No+Image';
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
      '300x180?text=No+Image';
  }

  viewDetail(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  applyFilters() {
    this.searchQuery = '';
    this.loadProducts();
  }

  clearFilters() {
    this.filters = {
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      minRating: null
    };
    this.searchQuery = '';
    this.router.navigate(['/products']);
  }
}