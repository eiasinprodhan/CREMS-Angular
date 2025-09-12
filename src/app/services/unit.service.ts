import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit.model';
import { environments } from './environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  baseUrl: string = environments.apiBaseUrl + '/units';

  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object
    ) { }


  addUnit(unit: any, photos: File[]): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    const formData = new FormData();

    formData.append('unit', JSON.stringify(unit));

    photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });

    return this.http.post(`${this.baseUrl}/`, formData, { headers });
  }

  listUnits(): Observable<Unit[]> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<Unit[]>(this.baseUrl + '/', { headers });
  }

  viewUnit(id: number): Observable<Unit> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<Unit>(`${this.baseUrl}/${id}`, { headers });
  }

  editUnit(unit: any, photos: File[]): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    const formData = new FormData();

    formData.append('unit', JSON.stringify(unit));

    photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });

    return this.http.put(`${this.baseUrl}/`, formData, { headers });
  }

  updateUnitForBook(unit: Unit): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.put(this.baseUrl + '/updateunitforbook', unit, { headers });
  }

  deleteUnit(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.delete(this.baseUrl + '/' + id, { headers });
  }

  getUnitByBuildingId(buildingId: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get(this.baseUrl + '/productdetails/' + buildingId, { headers });
  }

}
