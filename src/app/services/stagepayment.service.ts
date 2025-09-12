import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environments } from './environments';
import { Observable } from 'rxjs';
import { StagePayment } from '../models/stagepayments.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StagepaymentService {
  private baseUrl = environments.apiBaseUrl + '/stagepayments';

  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object
    ) { }

  getPaymentsByStage(stageId: number): Observable<StagePayment[]> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<StagePayment[]>(`${this.baseUrl}/${stageId}`, { headers });
  }

  savePayment(payment: StagePayment): Observable<StagePayment> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post<StagePayment>(this.baseUrl + '/', payment, { headers });
  }
}
