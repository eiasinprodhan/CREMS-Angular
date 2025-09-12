import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environments } from './environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  baseUrl: string = environments.apiBaseUrl + '/transactions';

  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object
    ) { }

  public saveTransaction(transaction: Transaction): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post(this.baseUrl + '/', transaction, { headers });
  }

  public listTransaction(): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get(this.baseUrl + '/', { headers });
  }

  public deleteTransaction(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.delete(this.baseUrl + "/" + id, { headers });
  }

}
