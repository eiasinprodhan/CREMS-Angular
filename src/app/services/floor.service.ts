import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Floor } from '../models/floor.model';
import { Observable } from 'rxjs';
import { environments } from './environments';

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  baseUrl: string = environments.apiBaseUrl + '/floors';

  constructor(
    private http: HttpClient
  ) { }

  addFloors(floor: Floor): Observable<any> {
    return this.http.post(this.baseUrl + '/', floor);
  }

  listFloors(): Observable<any> {
    return this.http.get(this.baseUrl + '/');
  }

  viewFloors(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editFloors(floor: Floor): Observable<any> {
    return this.http.put(this.baseUrl + '/', floor);
  }

  deleteFloors(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  getFloorByBuildingId(id: number): Observable<Floor[]> {
    return this.http.get<Floor[]>(this.baseUrl + '?building=' + id);
  }
}
