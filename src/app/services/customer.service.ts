import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  baseUrl: string = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  public saveCustomers(customer: Customer): Observable<any>{
    return this.http.post(this.baseUrl, customer);
  }

  public listCustomers(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  public viewCustomers(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  public editCustomers(id: string, customer: Customer): Observable<any> {
    return this.http.put(this.baseUrl + '/' + id, customer);
  }

  public deleteCustomers(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
