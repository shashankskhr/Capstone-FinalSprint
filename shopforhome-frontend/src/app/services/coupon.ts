import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCoupons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/DiscountCouponApi`);
  }

  createCoupon(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/DiscountCouponApi`, data);
  }

  assignCoupon(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/DiscountCouponApi/assign`, data);
  }

  getMyCoupons(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/DiscountCouponApi/my-coupons/${userId}`);
  }

  validateCoupon(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/DiscountCouponApi/validate`, data);
  }
}