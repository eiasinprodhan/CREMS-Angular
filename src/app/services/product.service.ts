import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl: string = "http://localhost:3000/products";

  constructor(
    private http: HttpClient
  ) { }

  listProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

}
