import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stage } from '../models/stage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  baseUrl: string = "http://localhost:3000/stages";

  constructor(
    private http: HttpClient
  ) { }

  addStages(stage: Stage): Observable<any> {
    return this.http.post(this.baseUrl, stage);
  }

  listStages(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "?floor=" + id);
  }

  viewStages(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editStages(id: string, stage: Stage): Observable<any> {
    return this.http.put(this.baseUrl + '/' + id, stage);
  }

  deletestages(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  liststageByproject(prodectId: string): Observable<any> {
    return this.http.get(this.baseUrl + "?project=" + prodectId);
  }

  listWorkHistory(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "?siteManager=" + id);
  }

}

