import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environments } from './environments';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  baseUrl: string = environments.apiBaseUrl + '/transactions';

  constructor(
    private http: HttpClient
  ) { }

  public saveTransaction(transaction: Transaction): Observable<any> {
    return this.http.post(this.baseUrl + '/', transaction);
  }

  public listTransaction(): Observable<any> {
    return this.http.get(this.baseUrl + '/');
  }

  public deleteTransaction(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/" + id);
  }

}
