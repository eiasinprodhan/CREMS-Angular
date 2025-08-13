import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Building } from '../models/building.model';
import { Observable } from 'rxjs';
import { environments } from './environments';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  baseUrl: string = environments.apiBaseUrl + '/buildings';

  constructor(
    private http: HttpClient
  ) { }

  addBuildings(building: Building): Observable<any> {
    return this.http.post(this.baseUrl+'/', building);
  }

  listBuildings(): Observable<any> {
    return this.http.get(this.baseUrl+'/');
  }

  viewBuildings(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editBuildings(building: Building): Observable<any> {
    return this.http.put(this.baseUrl + '/', building);
  }

  deleteBuildings(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  listBuildingByproject(prodectId: number): Observable<any> {
    return this.http.get(this.baseUrl + "?project=" + prodectId);
  }

  listWorkHistory(id: number): Observable<any> {
    return this.http.get(this.baseUrl + "?siteManager=" + id);
  }
}

