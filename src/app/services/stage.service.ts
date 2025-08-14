import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stage } from '../models/stage.model';
import { Observable } from 'rxjs';
import { environments } from './environments';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  baseUrl: string = environments.apiBaseUrl + '/stages';

  constructor(
    private http: HttpClient
  ) { }

  addStages(stage: Stage): Observable<any> {
    return this.http.post(this.baseUrl+'/', stage);
  }

  listStages(id: number): Observable<any> {
    return this.http.get(this.baseUrl + "?floor=" + id);
  }

  viewStages(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editStages(stage: Stage): Observable<any> {
    return this.http.put(this.baseUrl + '/', stage);
  }

  deletestages(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  liststageByproject(projectId: number): Observable<any> {
    return this.http.get(this.baseUrl + "?project=" + projectId);
  }

  listWorkHistory(id: number): Observable<any> {
    return this.http.get(this.baseUrl + "?siteManager=" + id);
  }

  loadAllStages(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

}

