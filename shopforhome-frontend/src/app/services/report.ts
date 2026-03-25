import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }
  from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment }
  from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSalesReport(data: any): Observable<any> {
    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // ✅ send proper date format
    const payload = {
      fromDate: new Date(
        data.fromDate).toISOString(),
      toDate: new Date(
        data.toDate).toISOString()
    };

    console.log('Report payload:', payload);

    return this.http.post<any>(
      `${this.apiUrl}/SalesReportApi`,
      payload,
      { headers }
    );
  }
}