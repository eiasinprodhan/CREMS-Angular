import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environments } from './environments';
import { LoanPayment } from '../models/loanpayments.model';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { catchError } from 'rxjs/operators'; // for error handling

@Injectable({
  providedIn: 'root',
})
export class LoanpaymentService {
  private baseUrl = environments.apiBaseUrl + '/loanpayments';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return headers;
  }

  addLoanPayment(loanPayment: LoanPayment): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.baseUrl + '/', loanPayment, { headers }).pipe(
      catchError((error) => {
        console.error('Error adding loan payment', error);
        throw error;
      })
    );
  }

  listLoanPayments(): Observable<LoanPayment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<LoanPayment[]>(this.baseUrl + '/', { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching loan payments', error);
        throw error;
      })
    );
  }

  getLoanPaymentById(id: number): Observable<LoanPayment> {
    const headers = this.getAuthHeaders();
    return this.http.get<LoanPayment>(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching loan payment by ID', error);
        throw error;
      })
    );
  }

  updateLoanPayment(id: number, loanPayment: LoanPayment): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/${id}`, loanPayment, { headers }).pipe(
      catchError((error) => {
        console.error('Error updating loan payment', error);
        throw error;
      })
    );
  }

  deleteLoanPayment(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting loan payment', error);
        throw error;
      })
    );
  }

  getLoanPaymentsByBookingId(bookingId: number): Observable<LoanPayment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<LoanPayment[]>(`${this.baseUrl}/booking/${bookingId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching loan payments by booking ID', error);
        throw error;
      })
    );
  }
}
