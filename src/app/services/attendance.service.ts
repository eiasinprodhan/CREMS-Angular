import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Attendance } from '../models/attendance.model';
import { Observable } from 'rxjs';
import { environments } from './environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl: string = environments.apiBaseUrl + '/attendances';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Add a new attendance record
  addAttendances(attendance: Attendance): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.post(this.baseUrl + '/', attendance, { headers });
  }

  // List all attendance records
  listAttendances(): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get(this.baseUrl + '/', { headers });
  }

  // View a specific attendance record by ID
  viewAttendances(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  // View attendance records by stage ID
  viewAttendancesByStage(stageId: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get(`${this.baseUrl}?stageId=${stageId}`, { headers });
  }

  // Edit an existing attendance record by ID
  editAttendances(attendance: Attendance): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.put(`${this.baseUrl}/`, attendance, { headers });
  }

  // Delete an attendance record by ID
  deleteAttendances(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.delete(`${this.baseUrl}?stageId=${id}`, { headers });
  }

  // List attendance records by project ID
  listAttendanceByProject(projectId: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get(`${this.baseUrl}?project=${projectId}`, { headers });
  }

}