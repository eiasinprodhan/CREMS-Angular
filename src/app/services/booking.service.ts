import { Injectable } from '@angular/core';
import { environments } from './environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl: string = environments.apiBaseUrl + '/bookings';
  
    constructor(private http: HttpClient) { }
  
  
    addBooking(booking: Booking): Observable<any> {
      return this.http.post(`${this.baseUrl}/`, booking);
    }
  
    listBookings(): Observable<Booking[]> {
      return this.http.get<Booking[]>(this.baseUrl + '/');
    }
  
    viewBooking(id: number): Observable<Booking> {
      return this.http.get<Booking>(`${this.baseUrl}/${id}`);
    }
  
    editBooking(booking: Booking): Observable<any> {
     return this.http.put(`${this.baseUrl}/`, booking);
    }
  
    deleteBooking(id: number): Observable<any> {
      return this.http.delete(this.baseUrl + '/' + id);
    }
}
