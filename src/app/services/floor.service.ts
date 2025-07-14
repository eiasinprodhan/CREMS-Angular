import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Floor } from '../models/floor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  baseUrl: string = "http://localhost:3000/floors";

  constructor(
    private http: HttpClient
  ) { }

  addFloors(floor: Floor): Observable<any> {
    return this.http.post(this.baseUrl, floor);
  }

  listFloors(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  viewFloors(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editFloors(id: string, floor: Floor): Observable<any> {
    return this.http.put(this.baseUrl + '/' + id, floor);
  }

  deleteFloors(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  getFloorByBuildingId(id: string): Observable<Floor[]> {
    return this.http.get<Floor[]>(this.baseUrl + '?building=' + id);
  }
}
