import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  baseUrl: string = 'http://localhost:3000/units';

  constructor(private http: HttpClient) {}


  addUnit(unit: Unit): Observable<any> {
    return this.http.post(this.baseUrl, Unit);
  }

  listUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl);
  }

  viewUnit(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.baseUrl}/${id}`);
  }

  editUnit(id: string, unit: Unit): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, unit);
  }

  deleteUnit(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
