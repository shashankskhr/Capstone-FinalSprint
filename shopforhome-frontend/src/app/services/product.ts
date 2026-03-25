import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(filters?: any): Observable<any[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.categoryId != null && filters.categoryId !== '')
        params = params.set('categoryId', filters.categoryId);
      if (filters.minPrice != null && filters.minPrice !== '')
        params = params.set('minPrice', filters.minPrice);
      if (filters.maxPrice != null && filters.maxPrice !== '')
        params = params.set('maxPrice', filters.maxPrice);
      if (filters.minRating != null && filters.minRating !== '')
        params = params.set('minRating', filters.minRating);
    }

    return this.http.get<any[]>(
      `${this.apiUrl}/ProductsApi`, { params });
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/ProductsApi/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/ProductsApi/categories`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/ProductsApi`, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/ProductsApi/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/ProductsApi/${id}`);
  }

  uploadCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(
      `${this.apiUrl}/ProductsApi/upload-csv`, formData);
  }

  getLowStock(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/ProductsApi/low-stock`);
  }

  search(query: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/SearchApi`,
      { params: { q: query } }
    );
  }
}