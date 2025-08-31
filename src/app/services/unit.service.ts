import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit.model';
import { environments } from './environments';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  baseUrl: string = environments.apiBaseUrl + '/units';

  constructor(private http: HttpClient) { }


  addUnit(unit: any, photos: File[]): Observable<any> {
    const formData = new FormData();

    formData.append('unit', JSON.stringify(unit));

    photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });

    return this.http.post(`${this.baseUrl}/`, formData);
  }

  listUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl + '/');
  }

  viewUnit(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${this.baseUrl}/${id}`);
  }

  editUnit(unit: any, photos: File[]): Observable<any> {
    const formData = new FormData();

    formData.append('unit', JSON.stringify(unit));

    photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });

    return this.http.put(`${this.baseUrl}/`, formData);
  }

  updateUnitForBook(unit: Unit): Observable<any> {
    return this.http.put(this.baseUrl + '/updateunitforbook', unit);
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  getUnitByBuildingId(buildingId: number): Observable<any> {
    return this.http.get(this.baseUrl + '/productdetails/' + buildingId);
  }

}
