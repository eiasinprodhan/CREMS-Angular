import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environments } from './environments';
import { LoanPayment } from '../models/loanpayments.model';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoanpaymentService {

  private baseUrl = environments.apiBaseUrl + '/loanpayments';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  addLoanPayment(loanPayment: LoanPayment): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post(this.baseUrl + '/', loanPayment, { headers });
  }

  listLLoanPayments(): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<any>(this.baseUrl + '/', { headers });
  }

  getLoanPaymentById(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers });
  }

  updateLoanPayment(id: number, loanPayment: LoanPayment): Observable<any> {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.put(`${this.baseUrl}/${id}`, loanPayment, { headers });
  }

  deleteLoanPayment(id: number): Observable<any> {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  getLoanPaymentsByBookingId(bookingId: number): Observable<any> {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get(this.baseUrl + '/booking/' + bookingId, { headers });
  }

}
