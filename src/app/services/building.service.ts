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

  addBuildings(building: Building, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('building', JSON.stringify(building));
    formData.append('photo', photo);
    return this.http.post(this.baseUrl+'/', formData);
  }

  listBuildings(): Observable<any> {
    return this.http.get(this.baseUrl+'/');
  }

  viewBuildings(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editBuildings(building: Building, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('building', JSON.stringify(building));
    formData.append('photo', photo);
    return this.http.put(this.baseUrl + '/', formData);
  }

  deleteBuildings(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  listBuildingByproject(projectId: number): Observable<any> {
    return this.http.get(this.baseUrl + "?project=" + projectId);
  }

  listWorkHistory(id: number): Observable<any> {
    return this.http.get(this.baseUrl + "/siteManager?siteManager=" + id);
  }
}

