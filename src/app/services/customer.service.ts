import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environments } from './environments';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  baseUrl: string = environments.apiBaseUrl + '/customers';

  constructor(private http: HttpClient) {}

  public saveCustomers(customer: Customer): Observable<any>{
    return this.http.post(this.baseUrl + '/', customer);
  }

  public listCustomers(): Observable<any> {
    return this.http.get(this.baseUrl + '/');
  }

  public viewCustomers(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  public editCustomers(customer: Customer): Observable<any> {
    return this.http.put(this.baseUrl + '/', customer);
  }

  public deleteCustomers(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
