import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/CartApi/${userId}`);
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CartApi`, data);
  }

  updateQuantity(cartId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/CartApi/${cartId}`, { quantity });
  }

  removeFromCart(cartId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/CartApi/${cartId}`);
  }
}