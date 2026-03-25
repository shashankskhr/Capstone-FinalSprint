import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWishlist(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/WishlistApi/${userId}`);
  }

  addToWishlist(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/WishlistApi`, data);
  }

  removeFromWishlist(wishlistId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/WishlistApi/${wishlistId}`);
  }
}