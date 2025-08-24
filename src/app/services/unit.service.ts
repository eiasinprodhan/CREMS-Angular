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

  constructor(private http: HttpClient) {}


  addUnit(unit: Unit): Observable<any> {
    return this.http.post(this.baseUrl + '/', unit);
  }

  listUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl + '/');
  }

  viewUnit(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${this.baseUrl}/${id}`);
  }

  editUnit(unit: Unit): Observable<any> {
    return this.http.put(this.baseUrl + '/', unit);
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

}
