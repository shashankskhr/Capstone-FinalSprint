import { Component, OnInit } from '@angular/core';
import { ProductService }
  from '../../../services/product';
import { HttpClient, HttpHeaders }
  from '@angular/common/http';
import { environment }
  from '../../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.scss']
})
export class AdminProductsComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  message = '';
  error = '';
  csvFile: File | null = null;
  editMode = false;
  editId: number | null = null;
  imageFile: File | null = null;
  imagePreview: string = '';
  uploading = false;

  form: any = this.emptyForm();

  constructor(
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  emptyForm() {
    return {
      productName: '',
      description: '',
      price: 0,
      stock: 0,
      rating: 0,
      imageUrl: '',
      categoryId: null
    };
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (c) => this.categories = c,
      error: (err) =>
        console.log('Category error:', err)
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (p) => {
        console.log('Products:', p);
        this.products = p;
      },
      error: (err) =>
        console.log('Product load error:', err)
    });
  }

  onUrlChange(url: string) {
    this.form.imageUrl = url.trim();
    if (url.trim() !== '') {
      this.imageFile = null;
      this.imagePreview = '';
    }
    console.log('Image URL:', this.form.imageUrl);
  }

  onUrlPreviewError(event: any) {
    event.target.src =
      'https://via.placeholder.com/' +
      '120x120?text=Invalid+URL';
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.form.imageUrl = '';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async save() {
    this.message = '';
    this.error = '';

    if (!this.form.productName) {
      this.error = 'Product name is required.';
      return;
    }
    if (!this.form.categoryId) {
      this.error = 'Category is required.';
      return;
    }

    console.log('Image URL before save:',
      this.form.imageUrl);
    console.log('Image file:', this.imageFile);

    if (this.imageFile) {
      this.uploading = true;
      await this.uploadImage();
      this.uploading = false;
    }

    this.saveProduct();
  }

  uploadImage(): Promise<void> {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', this.imageFile!);

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.post<any>(
        `${environment.apiUrl}/ProductsApi/upload-image`,
        formData,
        { headers }
      ).subscribe({
        next: (res: any) => {
          console.log('Image uploaded:', res);
          this.form.imageUrl = res.imageUrl;
          resolve();
        },
        error: (err) => {
          console.log('Image upload error:', err);
          resolve();
        }
      });
    });
  }

  saveProduct() {
    const payload = {
      productName: this.form.productName,
      description: this.form.description || '',
      price: parseFloat(this.form.price) || 0,
      stock: parseInt(this.form.stock) || 0,
      rating: parseFloat(this.form.rating) || 0,
      imageUrl: this.form.imageUrl || '',
      categoryId: parseInt(this.form.categoryId)
    };

    console.log('Final payload:', payload);

    if (this.editMode && this.editId) {
      this.productService.updateProduct(
        this.editId, payload
      ).subscribe({
        next: (res) => {
          console.log('Updated:', res);
          this.message = '✅ Product updated!';
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          console.log('Update error:', err);
          this.error = '❌ Failed to update.';
        }
      });
    } else {
      this.productService.createProduct(payload)
        .subscribe({
          next: (res) => {
            console.log('Created:', res);
            this.message = '✅ Product added!';
            this.resetForm();
            this.loadProducts();
          },
          error: (err) => {
            console.log('Create error:', err);
            this.error = '❌ Failed to add product.';
          }
        });
    }
  }

  edit(p: any) {
    this.editMode = true;
    this.editId = p.productId;
    this.imagePreview = '';
    this.form = {
      productName: p.productName,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      rating: p.rating,
      imageUrl: p.imageUrl || '',
      categoryId: p.categoryId
    };
    window.scrollTo(0, 0);
  }

  delete(id: number) {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id)
        .subscribe({
          next: () => {
            this.message = '✅ Product deleted.';
            this.loadProducts();
          },
          error: (err) =>
            console.log('Delete error:', err)
        });
    }
  }

  resetForm() {
    this.form = this.emptyForm();
    this.editMode = false;
    this.editId = null;
    this.imageFile = null;
    this.imagePreview = '';
  }

  onCsvSelected(event: any) {
    this.csvFile = event.target.files[0];
  }

  uploadCsv() {
    if (!this.csvFile) {
      this.error = 'Please select a CSV file.';
      return;
    }
    this.productService.uploadCsv(this.csvFile)
      .subscribe({
        next: (res: any) => {
          this.message = res.message;
          this.loadProducts();
        },
        error: (err) => {
          console.log('CSV error:', err);
          this.error = '❌ CSV upload failed.';
        }
      });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl || imageUrl.trim() === '') {
      return 'https://via.placeholder.com/' +
        '50x50?text=No+Image';
    }
    if (imageUrl.startsWith('http://') ||
        imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `https://localhost:7140/${imageUrl}`;
  }

  onImageError(event: any) {
    event.target.src =
      'https://via.placeholder.com/50x50';
  }
}