import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Building } from '../models/building.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  baseUrl: string = "http://localhost:3000/buildings";

  constructor(
    private http: HttpClient
  ) { }

  addBuildings(building: Building): Observable<any> {
    return this.http.post(this.baseUrl, building);
  }

  listBuildings(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  viewBuildings(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editBuildings(id: string, building: Building): Observable<any> {
    return this.http.put(this.baseUrl + '/' + id, building);
  }

  deleteBuildings(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  listBuildingByproject(prodectId: string): Observable<any>{
    return this.http.get(this.baseUrl+"?project="+prodectId);
  }
}

