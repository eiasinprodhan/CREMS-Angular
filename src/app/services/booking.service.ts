import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environments } from './environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl: string = environments.apiBaseUrl + '/bookings';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  addBooking(booking: Booking): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.post(`${this.baseUrl}/`, booking, { headers });
  }

  listBookings(): Observable<Booking[]> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get<Booking[]>(this.baseUrl + '/', { headers });
  }

  viewBooking(id: number): Observable<Booking> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get<Booking>(`${this.baseUrl}/${id}`, { headers });
  }

  editBooking(booking: Booking): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.put(`${this.baseUrl}/`, booking, { headers });
  }

  deleteBooking(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.delete(this.baseUrl + '/' + id, { headers });
  }
}
