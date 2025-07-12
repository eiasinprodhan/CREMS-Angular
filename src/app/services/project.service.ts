import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl: string = "http://localhost:3000/projects";

  constructor(
    private http: HttpClient
  ) { }

  addProjects(project: Project): Observable<any> {
    return this.http.post(this.baseUrl, project);
  }

  listProjects(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  viewProjects(id: string): Observable<any> {
    return this.http.get(this.baseUrl+'/'+id);
  }

  editProjects(id: string, project: Project): Observable<any> {
    return this.http.put(this.baseUrl+'/'+id, project);
  }

  deleteProjects(id: string): Observable<any> {
    return this.http.delete(this.baseUrl+'/'+id);
  }
}
