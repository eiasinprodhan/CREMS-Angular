import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  baseUrl: string = "http://localhost:3000/transactions";

  constructor(
    private http: HttpClient
  ) { }

  public saveTransaction(transaction: Transaction): Observable<any>{
    return this.http.post(this.baseUrl, transaction);
  }

  public listTransaction(): Observable<any>{
    return this.http.get(this.baseUrl);
  }

  public deleteTransaction(id: string): Observable<any>{
    return this.http.delete(this.baseUrl+"/"+id);
  }

}
