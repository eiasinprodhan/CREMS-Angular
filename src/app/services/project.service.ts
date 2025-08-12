import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl: string = environment.apiBaseUrl + "/projects";

  constructor(
    private http: HttpClient
  ) { }

  addProjects(project: Project): Observable<any> {
    return this.http.post(this.baseUrl+'/save', project);
  }

  listProjects(): Observable<any> {
    return this.http.get(this.baseUrl+'/all');
  }

  viewProjects(id: number): Observable<any> {
    return this.http.get(this.baseUrl+'/'+id);
  }

  editProjects(project: Project): Observable<any> {
    return this.http.put(this.baseUrl+'/update', project);
  }

  deleteProjects(id: number): Observable<any> {
    return this.http.delete(this.baseUrl+'/delete/'+id);
  }

  listWorkHistory(id: number): Observable<any>{
    return this.http.get(this.baseUrl+"?projectManager="+id);
  }
}
