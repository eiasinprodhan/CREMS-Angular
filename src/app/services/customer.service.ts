import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService{
  baseUrl: string = "http://localhost:3000/customers"

  constructor(
    private http: HttpClient
  ) { }

  public listCustomers(): Observable<any>{
    return this.http.get(this.baseUrl);
  }

  public viewCustomers(id:string): Observable<any>{
    return this.http.get(this.baseUrl+"/"+id);
  }
}
