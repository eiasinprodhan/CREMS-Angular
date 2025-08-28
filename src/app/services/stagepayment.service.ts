import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from './environments';
import { Observable } from 'rxjs';
import { StagePayment } from '../models/stagepayments.model';

@Injectable({
  providedIn: 'root'
})
export class StagepaymentService {
  private baseUrl = environments.apiBaseUrl + '/stagepayments';

  constructor(private http: HttpClient) {}

  getPaymentsByStage(stageId: number): Observable<StagePayment[]> {
    return this.http.get<StagePayment[]>(`${this.baseUrl}/${stageId}`);
  }

  savePayment(payment: StagePayment): Observable<StagePayment> {
    return this.http.post<StagePayment>(this.baseUrl + '/', payment);
  }
}
